/**
 * VoiceCommandManager Component
 * Speech recognition and command processing for hands-free operation in barn environments
 * Context-aware voice commands for horse care and facility management
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { IMobileCapabilities } from './MobileDetector';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, CheckCircle } from 'lucide-react';

export interface IVoiceCommand {
  id: string;
  patterns: string[];
  handler: (transcription: string, context?: any) => void;
  description: string;
  examples: string[];
  category: 'navigation' | 'horse' | 'emergency' | 'training' | 'medical' | 'facility';
  requiresContext?: boolean;
  confirmationRequired?: boolean;
  cooldown?: number;
}

export interface IVoiceCommandContext {
  currentHorse?: string;
  currentLocation?: string;
  currentScreen?: string;
  userRole?: string;
  emergencyMode?: boolean;
  selectedHorses?: string[];
  recentActivity?: string[];
}

export interface IVoiceCommandManagerProps {
  capabilities: IMobileCapabilities;
  context?: IVoiceCommandContext;
  commands?: IVoiceCommand[];
  enableContinuousListening?: boolean;
  enableWakeWord?: boolean;
  enableVoiceFeedback?: boolean;
  language?: string;
  onCommand?: (command: IVoiceCommand, transcription: string) => void;
  onTranscription?: (text: string, confidence: number) => void;
  onStatusChange?: (status: 'idle' | 'listening' | 'processing' | 'error') => void;
  className?: string;
}

export const VoiceCommandManager: React.FC<IVoiceCommandManagerProps> = ({
  capabilities,
  context = {},
  commands = [],
  enableContinuousListening = false,
  enableWakeWord = true,
  enableVoiceFeedback = true,
  language = 'en-US',
  onCommand,
  onTranscription,
  onStatusChange,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscription, setLastTranscription] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [commandCooldowns, setCommandCooldowns] = useState<Map<string, number>>(new Map());

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!capabilities.supportsVoice) {
      setErrorMessage('Voice recognition not supported on this device');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = enableContinuousListening;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onstart = () => {
        setStatus('listening');
        setIsListening(true);
        setErrorMessage('');
        onStatusChange?.(status);
        
        // Auto-stop after timeout
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
        }
        listeningTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 30000); // 30 second timeout
      };

      recognitionRef.current.onresult = (event) => {
        const results = Array.from(event.results);
        const transcript = results
          .map(result => result[0].transcript)
          .join(' ');
        
        const finalTranscript = results
          .filter(result => result.isFinal)
          .map(result => result[0].transcript)
          .join(' ');

        if (finalTranscript) {
          const resultConfidence = results[results.length - 1]?.[0]?.confidence || 0;
          setLastTranscription(finalTranscript);
          setConfidence(resultConfidence);
          onTranscription?.(finalTranscript, resultConfidence);
          
          // Process command
          processVoiceCommand(finalTranscript, resultConfidence);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setStatus('error');
        setIsListening(false);
        const errorMsg = getErrorMessage(event.error);
        setErrorMessage(errorMsg);
        onStatusChange?.(status);
        
        // Auto-retry for certain errors
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (enableContinuousListening) {
              startListening();
            }
          }, 2000);
        }
      };

      recognitionRef.current.onend = () => {
        setStatus('idle');
        setIsListening(false);
        onStatusChange?.(status);
        
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
        }
        
        // Restart if continuous listening is enabled
        if (enableContinuousListening && !isProcessing) {
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      };
    }

    // Initialize speech synthesis
    if (enableVoiceFeedback) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, [capabilities.supportsVoice, enableContinuousListening, enableVoiceFeedback, language, isProcessing, onStatusChange, status]);

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
      
      // Haptic feedback
      if (capabilities.supportsVibration) {
        navigator.vibrate(brandConfig.mobile.haptics.patterns.success);
      }
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      setErrorMessage('Failed to start voice recognition');
    }
  }, [isListening, capabilities.supportsVibration]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      
      // Haptic feedback
      if (capabilities.supportsVibration) {
        navigator.vibrate(brandConfig.mobile.haptics.patterns.warning);
      }
    }
  }, [isListening, capabilities.supportsVibration]);

  // Voice feedback
  const speak = useCallback((text: string, priority: 'low' | 'normal' | 'high' = 'normal') => {
    if (!enableVoiceFeedback || !synthRef.current) return;

    // Cancel existing speech for high priority
    if (priority === 'high') {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = language;

    synthRef.current.speak(utterance);
  }, [enableVoiceFeedback, language]);

  // Process voice command
  const processVoiceCommand = useCallback((transcript: string, confidence: number) => {
    setStatus('processing');
    setIsProcessing(true);
    
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Check for wake word first
    if (enableWakeWord && !normalizedTranscript.includes(brandConfig.mobile.voice.wakeWord.toLowerCase())) {
      setStatus('idle');
      setIsProcessing(false);
      return;
    }

    // Find matching command
    const matchingCommand = commands.find(command => 
      command.patterns.some(pattern => 
        normalizedTranscript.includes(pattern.toLowerCase())
      )
    );

    if (matchingCommand) {
      // Check cooldown
      const now = Date.now();
      const lastExecution = commandCooldowns.get(matchingCommand.id) || 0;
      const cooldown = matchingCommand.cooldown || 1000;
      
      if (now - lastExecution < cooldown) {
        speak('Please wait before using that command again');
        setStatus('idle');
        setIsProcessing(false);
        return;
      }

      // Update cooldown
      setCommandCooldowns(prev => new Map(prev).set(matchingCommand.id, now));

      // Check confidence threshold
      if (confidence < brandConfig.mobile.voice.confidence) {
        speak('I\'m not sure I understood that. Please try again.');
        setStatus('idle');
        setIsProcessing(false);
        return;
      }

      // Execute command
      try {
        if (matchingCommand.confirmationRequired) {
          speak(`Did you say ${matchingCommand.description}? Say yes to confirm.`);
          // Implementation for confirmation would go here
        } else {
          matchingCommand.handler(transcript, context);
          onCommand?.(matchingCommand, transcript);
          
          // Add to history
          setCommandHistory(prev => [transcript, ...prev.slice(0, 9)]);
          
          // Voice feedback
          speak('Command executed');
          
          // Haptic feedback
          if (capabilities.supportsVibration) {
            navigator.vibrate(brandConfig.mobile.haptics.patterns.success);
          }
        }
      } catch (error) {
        console.error('Command execution error:', error);
        speak('Sorry, there was an error executing that command');
        setErrorMessage('Command execution failed');
      }
    } else {
      speak('Command not recognized. Try saying "help" for available commands.');
      
      // Haptic feedback for unrecognized command
      if (capabilities.supportsVibration) {
        navigator.vibrate(brandConfig.mobile.haptics.patterns.error);
      }
    }

    setStatus('idle');
    setIsProcessing(false);
  }, [
    enableWakeWord,
    commands,
    commandCooldowns,
    context,
    onCommand,
    capabilities.supportsVibration,
    speak
  ]);

  // Get error message
  const getErrorMessage = (error: string): string => {
    const errorMessages = {
      'no-speech': 'No speech detected. Try speaking closer to the microphone.',
      'audio-capture': 'Audio capture failed. Check microphone permissions.',
      'not-allowed': 'Microphone access denied. Please enable microphone permissions.',
      'network': 'Network error. Check your internet connection.',
      'aborted': 'Voice recognition was cancelled.',
      'language-not-supported': 'Language not supported.'
    };
    
    return errorMessages[error as keyof typeof errorMessages] || 'Unknown error occurred';
  };

  // Component styles
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
    zIndex: 1000,
  };

  const buttonStyle: React.CSSProperties = {
    width: brandConfig.mobile.touchTargets.glovedFriendly,
    height: brandConfig.mobile.touchTargets.glovedFriendly,
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isListening ? '#DC3545' : '#8B4513',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.2s ease',
    ...(isListening && {
      animation: 'pulse 1.5s infinite',
    }),
  };

  const statusStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    fontSize: '14px',
    fontFamily: brandConfig.typography.fontPrimary,
    color: brandConfig.colors.midnightBlack,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '250px',
  };

  const transcriptionStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: brandConfig.typography.fontPrimary,
    color: brandConfig.colors.midnightBlack,
    maxWidth: '300px',
    wordBreak: 'break-word',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  if (!capabilities.supportsVoice) {
    return null;
  }

  return (
    <div className={`voice-command-manager ${className}`} style={containerStyle}>
      {/* Status indicator */}
      {(isListening || isProcessing || errorMessage) && (
        <div style={statusStyle}>
          {isListening && <Mic size={16} />}
          {isProcessing && <Volume2 size={16} />}
          {errorMessage && <AlertCircle size={16} />}
          <span>
            {isListening && 'Listening...'}
            {isProcessing && 'Processing...'}
            {errorMessage && 'Error'}
          </span>
        </div>
      )}

      {/* Transcription display */}
      {lastTranscription && (
        <div style={transcriptionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CheckCircle size={16} color={brandConfig.colors.successGreen} />
            <span style={{ fontWeight: 600 }}>Recognized:</span>
          </div>
          <div>{lastTranscription}</div>
          <div style={{ 
            fontSize: '12px', 
            color: brandConfig.colors.neutralGray, 
            marginTop: '4px' 
          }}>
            Confidence: {Math.round(confidence * 100)}%
          </div>
        </div>
      )}

      {/* Main voice button */}
      <button
        style={buttonStyle}
        onClick={isListening ? stopListening : startListening}
        title={isListening ? 'Stop listening' : 'Start voice commands'}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      {/* Error message */}
      {errorMessage && (
        <div style={{
          ...transcriptionStyle,
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          color: '#DC3545',
          border: '1px solid #DC3545',
        }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

// Create equestrian-specific voice commands
export const createEquestirianVoiceCommands = (
  onNavigate: (screen: string) => void,
  onHorseAction: (action: string, horseName: string) => void,
  onEmergency: (type: string) => void,
  onTrainingLog: (horseName: string, activity: string) => void
): IVoiceCommand[] => [
  // Navigation commands
  {
    id: 'nav-horses',
    patterns: ['show horses', 'go to horses', 'horses', 'my horses'],
    handler: () => onNavigate('horses'),
    description: 'Navigate to horses view',
    examples: ['Show horses', 'Go to horses'],
    category: 'navigation'
  },
  {
    id: 'nav-cameras',
    patterns: ['show cameras', 'go to cameras', 'cameras', 'live cameras'],
    handler: () => onNavigate('cameras'),
    description: 'Navigate to cameras view',
    examples: ['Show cameras', 'Go to cameras'],
    category: 'navigation'
  },
  {
    id: 'nav-dashboard',
    patterns: ['go to dashboard', 'dashboard', 'home', 'overview'],
    handler: () => onNavigate('dashboard'),
    description: 'Navigate to dashboard',
    examples: ['Go to dashboard', 'Home'],
    category: 'navigation'
  },

  // Horse care commands
  {
    id: 'horse-status',
    patterns: ['check status', 'horse status', 'how is'],
    handler: (transcript) => {
      const horseName = extractHorseName(transcript);
      onHorseAction('status', horseName);
    },
    description: 'Check horse status',
    examples: ['Check status of Thunder Bay', 'How is Midnight Star'],
    category: 'horse',
    requiresContext: true
  },
  {
    id: 'horse-feed',
    patterns: ['feed time', 'feeding', 'feed'],
    handler: (transcript) => {
      const horseName = extractHorseName(transcript);
      onHorseAction('feed', horseName);
    },
    description: 'Log feeding time',
    examples: ['Feed time for Thunder Bay', 'Feeding Midnight Star'],
    category: 'horse'
  },
  {
    id: 'horse-turnout',
    patterns: ['turn out', 'turnout', 'put out'],
    handler: (transcript) => {
      const horseName = extractHorseName(transcript);
      onHorseAction('turnout', horseName);
    },
    description: 'Log turnout',
    examples: ['Turn out Thunder Bay', 'Turnout Midnight Star'],
    category: 'horse'
  },

  // Training commands
  {
    id: 'log-training',
    patterns: ['log training', 'training session', 'workout'],
    handler: (transcript) => {
      const horseName = extractHorseName(transcript);
      const activity = extractActivity(transcript);
      onTrainingLog(horseName, activity);
    },
    description: 'Log training session',
    examples: ['Log training for Thunder Bay', 'Training session with Midnight Star'],
    category: 'training'
  },

  // Emergency commands
  {
    id: 'emergency-vet',
    patterns: ['call vet', 'veterinarian', 'vet emergency', 'emergency vet'],
    handler: () => onEmergency('veterinarian'),
    description: 'Call veterinarian',
    examples: ['Call vet', 'Veterinarian emergency'],
    category: 'emergency',
    confirmationRequired: true
  },
  {
    id: 'emergency-staff',
    patterns: ['alert staff', 'call staff', 'staff emergency'],
    handler: () => onEmergency('staff'),
    description: 'Alert staff',
    examples: ['Alert staff', 'Staff emergency'],
    category: 'emergency',
    confirmationRequired: true
  },

  // Help command
  {
    id: 'help',
    patterns: ['help', 'what can you do', 'commands', 'voice commands'],
    handler: () => {
      // This would trigger help display
      console.log('Help requested');
    },
    description: 'Show available commands',
    examples: ['Help', 'What can you do'],
    category: 'navigation'
  }
];

// Utility functions
const extractHorseName = (transcript: string): string => {
  const words = transcript.toLowerCase().split(' ');
  const horseNames = ['thunder bay', 'midnight star', 'spirit', 'champion', 'star'];
  
  for (const name of horseNames) {
    if (transcript.toLowerCase().includes(name)) {
      return name;
    }
  }
  
  return 'selected horse';
};

const extractActivity = (transcript: string): string => {
  const activities = ['riding', 'training', 'grooming', 'exercise', 'workout'];
  const words = transcript.toLowerCase().split(' ');
  
  for (const activity of activities) {
    if (words.includes(activity)) {
      return activity;
    }
  }
  
  return 'training';
};

// Hook for easier usage
export const useVoiceCommands = (
  capabilities: IMobileCapabilities,
  commands: IVoiceCommand[] = []
) => {
  const [lastCommand, setLastCommand] = useState<IVoiceCommand | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');

  const handleCommand = useCallback((command: IVoiceCommand, transcript: string) => {
    setLastCommand(command);
    setTranscription(transcript);
  }, []);

  const handleStatusChange = useCallback((status: 'idle' | 'listening' | 'processing' | 'error') => {
    setIsListening(status === 'listening');
  }, []);

  return {
    lastCommand,
    isListening,
    transcription,
    VoiceCommandManager: (props: Omit<IVoiceCommandManagerProps, 'capabilities' | 'commands' | 'onCommand' | 'onStatusChange'>) => (
      <VoiceCommandManager
        {...props}
        capabilities={capabilities}
        commands={commands}
        onCommand={handleCommand}
        onStatusChange={handleStatusChange}
      />
    )
  };
}; 