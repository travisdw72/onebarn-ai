/**
 * AI Chat Interface Component
 * Voice-enabled AI chat for barn environment
 * Config-driven mobile-first design with glove-friendly controls
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';

interface AIChatInterfaceProps {
  horses: any[];
  selectedCamera: string | null;
  cameras: any[];
  alerts: any[];
  insights: any[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  emergencyMessage?: string | null;
  onEmergencyMessageHandled?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: {
    horseId?: string;
    cameraId?: string;
    alertId?: string;
  };
  audioUrl?: string;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({
  horses,
  selectedCamera,
  cameras,
  alerts,
  insights,
  isExpanded = false,
  onToggleExpand,
  emergencyMessage,
  onEmergencyMessageHandled
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: newDashboardEnhancements.aiChat.welcomeMessage,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle emergency messages
  useEffect(() => {
    if (emergencyMessage) {
      handleSendMessage(emergencyMessage);
      if (onEmergencyMessageHandled) {
        onEmergencyMessageHandled();
      }
    }
  }, [emergencyMessage, onEmergencyMessageHandled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text: string) => {
    if (synthRef.current && isAudioEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Use a more natural voice if available
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Natural') || 
        voice.name.includes('Enhanced') ||
        voice.name.includes('Premium')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      synthRef.current.speak(utterance);
    }
  };

  const analyzeUserInput = (input: string) => {
    const context: any = {};
    
    // Extract horse names from input
    const horseNames = horses.map(h => h.name.toLowerCase());
    const mentionedHorse = horseNames.find(name => 
      input.toLowerCase().includes(name)
    );
    
    if (mentionedHorse) {
      const horse = horses.find(h => h.name.toLowerCase() === mentionedHorse);
      context.horseId = horse?.id;
    }
    
    // Extract camera/location references
    const cameraLocations = cameras.map(c => c.location.toLowerCase());
    const mentionedLocation = cameraLocations.find(location =>
      input.toLowerCase().includes(location.split(' ')[0]) // Match first word of location
    );
    
    if (mentionedLocation) {
      const camera = cameras.find(c => c.location.toLowerCase() === mentionedLocation);
      context.cameraId = camera?.id;
    }
    
    // If no specific horse mentioned but camera is selected, use horses in that camera
    if (!context.horseId && selectedCamera) {
      const camera = cameras.find(c => c.id === selectedCamera);
      if (camera && camera.horses.length > 0) {
        context.cameraId = selectedCamera;
        context.horseId = camera.horses[0]; // Default to first horse in camera
      }
    }
    
    return context;
  };

  const generateAIResponse = (userInput: string, context: any): string => {
    const input = userInput.toLowerCase();
    
    // Get relevant horse data
    const targetHorse = context.horseId ? horses.find(h => h.id === context.horseId) : null;
    const targetCamera = context.cameraId ? cameras.find(c => c.id === context.cameraId) : null;
    
    // Health and status queries
    if (input.includes('how is') || input.includes('status') || input.includes('doing')) {
      if (targetHorse) {
        const recentAlerts = alerts.filter(a => a.horseId === targetHorse.id && !a.resolved);
        const recentInsights = insights.filter(i => i.horseId === targetHorse.id).slice(0, 2);
        
        let response = `${targetHorse.name} is currently ${targetHorse.status}. `;
        response += `Health score: ${targetHorse.healthScore}%. `;
        response += `Last activity: ${targetHorse.lastActivity}. `;
        
        if (recentAlerts.length > 0) {
          response += `⚠️ I've detected ${recentAlerts.length} alert(s): ${recentAlerts[0].description}. `;
        } else {
          response += `✅ No current alerts. `;
        }
        
        if (recentInsights.length > 0) {
          response += `Recent insight: ${recentInsights[0].description}`;
        }
        
        return response;
      } else {
        const totalAlerts = alerts.filter(a => !a.resolved).length;
        const healthyHorses = horses.filter(h => h.status === 'normal').length;
        
        return `Overall status: ${healthyHorses}/${horses.length} horses are doing well. ${totalAlerts} active alerts across all horses. All AI monitoring systems are operational.`;
      }
    }
    
    // Behavior queries
    if (input.includes('behavior') || input.includes('acting') || input.includes('unusual')) {
      if (targetHorse) {
        const behaviorInsights = insights.filter(i => 
          i.horseId === targetHorse.id && i.type === 'behavior'
        );
        
        if (behaviorInsights.length > 0) {
          return `${targetHorse.name}'s behavior pattern is currently "${targetHorse.behaviorPattern}". ${behaviorInsights[0].description}`;
        } else {
          return `${targetHorse.name} is showing normal behavior patterns. No unusual activity detected in the last 24 hours.`;
        }
      } else {
        const unusualBehavior = horses.filter(h => h.behaviorPattern !== 'normal');
        if (unusualBehavior.length > 0) {
          return `I've detected unusual behavior in ${unusualBehavior.length} horse(s): ${unusualBehavior.map(h => h.name).join(', ')}. Would you like details on any specific horse?`;
        } else {
          return `All horses are displaying normal behavior patterns. No concerning activities detected.`;
        }
      }
    }
    
    // Emergency and alert queries
    if (input.includes('emergency') || input.includes('alert') || input.includes('problem')) {
      const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
      const highAlerts = alerts.filter(a => a.severity === 'high' && !a.resolved);
      
      if (criticalAlerts.length > 0) {
        return `🚨 CRITICAL: ${criticalAlerts.length} emergency alert(s) require immediate attention! ${criticalAlerts[0].description} - ${horses.find(h => h.id === criticalAlerts[0].horseId)?.name}`;
      } else if (highAlerts.length > 0) {
        return `⚠️ ${highAlerts.length} high-priority alert(s) need attention: ${highAlerts[0].description}`;
      } else {
        return `✅ No current emergencies or critical alerts. All horses are safe and monitored.`;
      }
    }
    
    // Camera and location queries
    if (input.includes('camera') || input.includes('barn') || input.includes('stall')) {
      if (targetCamera) {
        const cameraHorses = targetCamera.horses.map(hId => 
          horses.find(h => h.id === hId)?.name
        ).filter(Boolean);
        
        return `Camera "${targetCamera.name}" at ${targetCamera.location} is ${targetCamera.status}. Currently monitoring: ${cameraHorses.join(', ')}. AI features active: motion detection, behavior analysis, emergency detection.`;
      } else {
        const onlineCameras = cameras.filter(c => c.status === 'online').length;
        return `${onlineCameras}/${cameras.length} cameras are online and monitoring. All AI detection systems are active.`;
      }
    }
    
    // Default response
    return `I'm here to help with your horse monitoring questions. Try asking about specific horses, their health, behavior, or any alerts you're concerned about.`;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    // Analyze user input for context
    const context = analyzeUserInput(messageText);
    
    // Generate AI response
    const aiResponse = generateAIResponse(messageText, context);
    
    // Simulate processing delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        context,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Speak the response if audio is enabled
      if (isAudioEnabled) {
        speakMessage(aiResponse);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Component styles using brandConfig
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    overflow: 'hidden',
    fontFamily: brandConfig.typography.fontPrimary,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.stableMahogany,
    color: brandConfig.colors.barnWhite,
  };

  const titleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: brandConfig.spacing.xs,
    fontSize: brandConfig.typography.fontSizeLg,
    fontWeight: brandConfig.typography.weightBold,
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: brandConfig.spacing.sm,
  };

  const controlButtonStyle: React.CSSProperties = {
    padding: brandConfig.spacing.xs,
    backgroundColor: 'transparent',
    border: `1px solid ${brandConfig.colors.arenaSand}`,
    borderRadius: brandConfig.layout.borderRadius,
    color: brandConfig.colors.barnWhite,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px', // Increased for better mobile touch
    minHeight: '48px', // Increased for better mobile touch
  };

  const messagesStyle: React.CSSProperties = {
    flex: 1,
    padding: brandConfig.spacing.md,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: brandConfig.spacing.md,
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on mobile
  };

  const messageStyle = (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    alignItems: 'flex-start',
    gap: brandConfig.spacing.sm,
  });

  const messageBubbleStyle = (isUser: boolean): React.CSSProperties => ({
    maxWidth: '70%',
    padding: brandConfig.spacing.sm,
    borderRadius: brandConfig.layout.borderRadius,
    backgroundColor: isUser ? brandConfig.colors.stableMahogany : brandConfig.colors.arenaSand,
    color: isUser ? brandConfig.colors.barnWhite : brandConfig.colors.midnightBlack,
    fontSize: brandConfig.typography.fontSizeSm,
    lineHeight: '1.5',
  });

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: brandConfig.spacing.sm,
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: brandConfig.spacing.sm,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    borderRadius: brandConfig.layout.borderRadius,
    backgroundColor: brandConfig.colors.barnWhite,
    color: brandConfig.colors.midnightBlack,
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    resize: 'none',
    minHeight: '40px',
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: brandConfig.spacing.sm,
    backgroundColor: brandConfig.colors.stableMahogany,
    color: brandConfig.colors.barnWhite,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px',
    minHeight: '48px',
  };

  const micButtonStyle: React.CSSProperties = {
    ...actionButtonStyle,
    backgroundColor: isListening ? brandConfig.colors.errorRed : brandConfig.colors.pastureSage,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle} className="mobile-chat-header">
        <div style={titleStyle}>
          <MessageCircle style={{ width: '20px', height: '20px' }} />
          <span>AI Guardian</span>
        </div>
        <div style={controlsStyle}>
          <button
            style={controlButtonStyle}
            className="touch-target"
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            title={isAudioEnabled ? newDashboardEnhancements.aiChat.voiceEnabled : newDashboardEnhancements.aiChat.voiceDisabled}
          >
            {isAudioEnabled ? <Volume2 style={{ width: '16px', height: '16px' }} /> : <VolumeX style={{ width: '16px', height: '16px' }} />}
          </button>
          {onToggleExpand && (
            <button
              style={controlButtonStyle}
              className="touch-target"
              onClick={onToggleExpand}
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? <Minimize2 style={{ width: '16px', height: '16px' }} /> : <Maximize2 style={{ width: '16px', height: '16px' }} />}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={messagesStyle} className="mobile-chat-messages">
        {messages.map((message) => (
          <div key={message.id} style={messageStyle(message.type === 'user')}>
            <div style={messageBubbleStyle(message.type === 'user')}>
              {message.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div style={messageStyle(false)}>
            <div style={messageBubbleStyle(false)}>
              {newDashboardEnhancements.aiChat.processingMessage}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={inputContainerStyle} className="mobile-chat-input">
        <textarea
          style={inputStyle}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? newDashboardEnhancements.aiChat.listeningIndicator : newDashboardEnhancements.aiChat.placeholder}
          disabled={isProcessing || isListening}
        />
        <button
          style={micButtonStyle}
          className="touch-target"
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          title={isListening ? newDashboardEnhancements.aiChat.stopListening : newDashboardEnhancements.aiChat.startListening}
        >
          {isListening ? <MicOff style={{ width: '20px', height: '20px' }} /> : <Mic style={{ width: '20px', height: '20px' }} />}
        </button>
        <button
          style={actionButtonStyle}
          className="touch-target"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isProcessing || isListening}
          title={newDashboardEnhancements.aiChat.sendMessage}
        >
          <Send style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </div>
  );
}; 