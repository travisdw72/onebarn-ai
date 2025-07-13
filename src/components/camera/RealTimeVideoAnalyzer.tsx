import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Grid,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  IconButton,
  Switch,
  Slider,
  Paper,
  Divider,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Analytics,
  Visibility,
  Speed,
  Timeline,
  SmartToy,
  TrendingUp,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';

import { useVideoAnalysis } from '../../hooks/useVideoAnalysis';
import { brandConfig } from '../../config/brandConfig';
import { videoAnalysisConfig } from '../../config/videoAnalysisConfig';

interface RealTimeAnalysisData {
  timestamp: number;
  videoTime: number;
  horsesDetected: number;
  confidence: number;
  activityLevel: number;
  posture: string;
  gait: string;
  healthRisk: number;
  observations: string[];
  recommendations: string[];
  frameAnalysis: any;
}

interface VideoAnalysisSession {
  videoId: string;
  videoUrl: string;
  horseName: string;
  startTime: number;
  analysisHistory: RealTimeAnalysisData[];
  aiCommentary: string[];
  totalAnalyses: number;
  averageConfidence: number;
  finalAssessment?: any;
}

interface RealTimeVideoAnalyzerProps {
  videoUrl: string;
  videoId: string;
  horseName: string;
  onAnalysisComplete?: (session: VideoAnalysisSession) => void;
  onRealTimeUpdate?: (analysis: RealTimeAnalysisData) => void;
  onFinalAssessmentDismissed?: () => void;
}

export const RealTimeVideoAnalyzer: React.FC<RealTimeVideoAnalyzerProps> = ({
  videoUrl,
  videoId,
  horseName,
  onAnalysisComplete,
  onRealTimeUpdate,
  onFinalAssessmentDismissed
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Analysis state
  const [realtimeAnalysis, setRealtimeAnalysis] = useState(true);
  const [analysisInterval, setAnalysisInterval] = useState(3); // seconds
  const [currentAnalysis, setCurrentAnalysis] = useState<RealTimeAnalysisData | null>(null);
  const [analysisSession, setAnalysisSession] = useState<VideoAnalysisSession>({
    videoId,
    videoUrl,
    horseName,
    startTime: Date.now(),
    analysisHistory: [],
    aiCommentary: [],
    totalAnalyses: 0,
    averageConfidence: 0
  });
  
  // UI state
  const [showAICommentary, setShowAICommentary] = useState(true);
  const [analysisMode, setAnalysisMode] = useState<'realtime' | 'standard' | 'efficient'>('realtime');
  const [motionDetected, setMotionDetected] = useState(false);
  const [nextAnalysisCountdown, setNextAnalysisCountdown] = useState(0);
  const [showFinalAssessment, setShowFinalAssessment] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<ImageData | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Video Analysis hook
  const {
    isAnalyzing,
    analysisHistory,
    analyzeVideoSegment,
    analysisError
  } = useVideoAnalysis();

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      console.log(`📹 Video loaded: ${video.duration.toFixed(1)}s duration`);
      
      // Auto-start playback for real-time analysis
      console.log('🚀 Auto-starting video playback for real-time analysis...');
      video.play().then(() => {
        console.log('✅ Video auto-play successful');
      }).catch((error) => {
        console.warn('⚠️ Auto-play failed (user interaction may be required):', error);
        console.log('👆 Click the play button to start real-time analysis');
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('▶️ Video playback started - real-time analysis should begin');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('⏸️ Video playback paused - real-time analysis stopped');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      console.log('🏁 Video playback ended');
      
      // Immediately stop all analysis intervals
      stopAnalysisLoop();
      console.log('🛑 All analysis intervals stopped');
      
      // Wait a moment for any pending analyses to complete, then finalize
      setTimeout(() => {
        finalizeFinalAssessment();
      }, 1000);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - cleaning up intervals');
      stopAnalysisLoop();
    };
  }, []);

  // Record video segment from current video element
  const recordVideoSegment = async (video: HTMLVideoElement, duration: number): Promise<Blob | null> => {
    try {
      // For uploaded videos, we need to capture the stream
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Create a stream from canvas
      const stream = canvas.captureStream(30); // 30 FPS

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: videoAnalysisConfig.recording.videoFormat
      });

      const chunks: Blob[] = [];
      let isRecording = true;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Draw video frames to canvas for the specified duration
      const startTime = Date.now();
      const drawFrame = () => {
        if (!isRecording) return;
        
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= duration) {
          isRecording = false;
          mediaRecorder.stop();
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawFrame);
      };

      drawFrame();

      // Wait for recording to complete
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: videoAnalysisConfig.recording.videoFormat });
          resolve(blob);
        };
      });

    } catch (error) {
      console.error('❌ Failed to record video segment:', error);
      return null;
    }
  };

  // Real-time analysis loop
  useEffect(() => {
    console.log(`🔄 Analysis loop effect triggered: realtimeAnalysis=${realtimeAnalysis}, isPlaying=${isPlaying}`);
    
    if (realtimeAnalysis && isPlaying) {
      console.log('✅ Starting analysis loop...');
      startAnalysisLoop();
    } else {
      console.log('⏸️ Stopping analysis loop...');
      stopAnalysisLoop();
    }

    return () => stopAnalysisLoop();
  }, [realtimeAnalysis, isPlaying, analysisInterval, analysisMode]);

  const startAnalysisLoop = () => {
    stopAnalysisLoop(); // Clear any existing intervals
    
    const getAnalysisIntervalMs = () => {
      switch (analysisMode) {
        case 'realtime': return analysisInterval * 1000; // User-defined interval
        case 'standard': return 5000; // 5 seconds
        case 'efficient': return 10000; // 10 seconds
        default: return analysisInterval * 1000;
      }
    };

    const intervalMs = getAnalysisIntervalMs();
    const countdownMax = intervalMs / 1000;
    
    console.log(`🔄 Starting analysis loop: ${intervalMs}ms interval (${analysisMode} mode)`);
    
    // Reset countdown
    setNextAnalysisCountdown(countdownMax);
    
    // Countdown timer
    countdownIntervalRef.current = setInterval(() => {
      setNextAnalysisCountdown(prev => {
        if (prev <= 1) {
          return countdownMax;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Analysis interval
    analysisIntervalRef.current = setInterval(() => {
      if (isPlaying && videoRef.current && !videoRef.current.ended) {
        captureAndAnalyzeVideoSegment();
        setNextAnalysisCountdown(countdownMax);
      } else if (videoRef.current?.ended) {
        console.log('🛑 Video ended - stopping analysis interval');
        stopAnalysisLoop();
      }
    }, intervalMs);

    // Immediate first analysis
    setTimeout(() => {
      if (isPlaying && videoRef.current) {
        captureAndAnalyzeVideoSegment();
      }
    }, 1000);
  };

  const stopAnalysisLoop = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setNextAnalysisCountdown(0);
  };

  const captureAndAnalyzeVideoSegment = async () => {
    const video = videoRef.current;
    
    if (!video || isAnalyzing) return;
    
    // Don't analyze if video has ended or is paused
    if (video.ended || video.paused || !isPlaying) {
      console.log('⏹️ Skipping analysis - video ended or paused');
      return;
    }

    try {
      console.log(`🎬 Starting 30-second video segment recording from ${video.currentTime.toFixed(1)}s`);

      // Create video blob from current video segment
      const videoBlob = await recordVideoSegment(video, 30); // Record 30 seconds

      if (!videoBlob) {
        console.warn('⚠️ Failed to create video segment');
        return;
      }

      console.log(`🎞️ Video segment recorded: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);

      // Enhanced horse context for video segment analysis
      const horseContext = {
        name: horseName,
        videoTime: video.currentTime,
        totalDuration: video.duration,
        segmentDuration: 30,
        analysisSequence: analysisSession.totalAnalyses + 1,
        priority: 'high' as 'high' | 'medium' | 'low' | 'urgent',
        videoMode: true,
        playbackRate,
        environmentalContext: {
          analysisMode,
          sessionDuration: Date.now() - analysisSession.startTime,
          previousAnalyses: analysisSession.analysisHistory.length
        }
      };

      // Perform video segment analysis
      const result = await analyzeVideoSegment(videoBlob, horseContext);
      
      if (result) {
        const analysisData: RealTimeAnalysisData = {
          timestamp: Date.now(),
          videoTime: video.currentTime,
          horsesDetected: result.horseDetected ? 1 : 0,
          confidence: result.confidence || 0.7,
          activityLevel: result.activityLevel || 50,
          posture: result.clinicalAssessment?.posturalAnalysis || 'unknown',
          gait: result.clinicalAssessment?.gaitAnalysis || 'unknown',
          healthRisk: result.healthRisk || 0.3,
          observations: result.insights || [],
          recommendations: result.recommendations || [],
          frameAnalysis: result
        };

        // Update current analysis
        setCurrentAnalysis(analysisData);

        // Add to session history
        setAnalysisSession(prev => {
          const newHistory = [...prev.analysisHistory, analysisData];
          const newTotal = prev.totalAnalyses + 1;
          const newAverage = newHistory.reduce((acc, a) => acc + a.confidence, 0) / newHistory.length;
          
          return {
            ...prev,
            analysisHistory: newHistory,
            totalAnalyses: newTotal,
            averageConfidence: newAverage
          };
        });

        // Generate AI commentary
        const commentary = generateRealTimeCommentary(analysisData, motionDetected);
        if (commentary) {
          setAnalysisSession(prev => ({
            ...prev,
            aiCommentary: [commentary, ...prev.aiCommentary.slice(0, 19)] // Keep last 20
          }));
        }

        // Callback for parent component
        if (onRealTimeUpdate) {
          onRealTimeUpdate(analysisData);
        }

        console.log(`✅ Real-time analysis complete: ${analysisData.confidence.toFixed(2)} confidence, ${analysisData.horsesDetected} horses`);
      }

    } catch (error) {
      console.error('🚨 Real-time analysis failed:', error);
    }
  };

  const detectMotion = (currentFrame: ImageData): boolean => {
    if (!lastFrameRef.current) {
      lastFrameRef.current = currentFrame;
      return false;
    }

    const lastFrame = lastFrameRef.current;
    let diffPixels = 0;
    const threshold = 30;
    const totalPixels = currentFrame.data.length / 4;

    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const diffR = Math.abs(currentFrame.data[i] - lastFrame.data[i]);
      const diffG = Math.abs(currentFrame.data[i + 1] - lastFrame.data[i + 1]);
      const diffB = Math.abs(currentFrame.data[i + 2] - lastFrame.data[i + 2]);
      const diff = (diffR + diffG + diffB) / 3;

      if (diff > threshold) {
        diffPixels++;
      }
    }

    const motionPercentage = (diffPixels / totalPixels) * 100;
    lastFrameRef.current = currentFrame;
    
    return motionPercentage > 2; // 2% of pixels changed
  };

  const generateRealTimeCommentary = (analysis: RealTimeAnalysisData, motion: boolean): string => {
    const timestamp = new Date(analysis.timestamp).toLocaleTimeString();
    const videoTime = `${Math.floor(analysis.videoTime / 60)}:${Math.floor(analysis.videoTime % 60).toString().padStart(2, '0')}`;
    
    const parts = [];

    // Time and motion context
    parts.push(`[${videoTime}]`);
    if (motion) {
      parts.push(`🏃 Motion detected -`);
    } else {
      parts.push(`😴 Stationary -`);
    }

    // Horse detection
    if (analysis.horsesDetected > 0) {
      parts.push(`${analysis.horsesDetected} horse${analysis.horsesDetected > 1 ? 's' : ''} visible.`);
    } else {
      parts.push(`No horses clearly visible.`);
    }

    // Key observations
    if (analysis.posture && analysis.posture !== 'unknown') {
      parts.push(`Posture: ${analysis.posture}.`);
    }

    if (analysis.gait && analysis.gait !== 'unknown') {
      parts.push(`Gait: ${analysis.gait}.`);
    }

    // Health assessment
    if (analysis.healthRisk > 0.7) {
      parts.push(`⚠️ Elevated health risk (${(analysis.healthRisk * 100).toFixed(0)}%).`);
    } else if (analysis.healthRisk < 0.3) {
      parts.push(`✅ Low health risk.`);
    }

    // Activity level
    if (analysis.activityLevel > 70) {
      parts.push(`High activity level.`);
    } else if (analysis.activityLevel < 30) {
      parts.push(`Low activity level.`);
    }

    // Confidence indicator
    parts.push(`[${(analysis.confidence * 100).toFixed(0)}% confidence]`);

    return parts.join(' ');
  };

  const finalizeFinalAssessment = async () => {
    console.log('🏁 Generating final assessment...');
    
    // Get the most current analysis session state
    setAnalysisSession(currentSession => {
      console.log(`📊 Current session data: ${currentSession.analysisHistory.length} analyses, ${currentSession.totalAnalyses} total, ${currentSession.aiCommentary.length} comments`);
      
      // Ensure we have analysis data
      const hasAnalysisData = currentSession.analysisHistory.length > 0;
      
      const finalAssessment = {
        sessionSummary: {
          totalDuration: duration,
          totalAnalyses: currentSession.totalAnalyses,
          averageConfidence: currentSession.averageConfidence,
          motionDetectionEvents: currentSession.aiCommentary.filter(c => c.includes('Motion detected')).length
        },
        overallHealthAssessment: hasAnalysisData ? {
          averageHealthRisk: currentSession.analysisHistory.reduce((acc, a) => acc + (a.healthRisk || 0), 0) / currentSession.analysisHistory.length,
          averageActivityLevel: currentSession.analysisHistory.reduce((acc, a) => acc + (a.activityLevel || 0), 0) / currentSession.analysisHistory.length,
          mostCommonPosture: getMostCommonValue(currentSession.analysisHistory.map(a => a.posture).filter(p => p && p !== 'unknown')),
          mostCommonGait: getMostCommonValue(currentSession.analysisHistory.map(a => a.gait).filter(g => g && g !== 'unknown'))
        } : {
          averageHealthRisk: 0,
          averageActivityLevel: 0,
          mostCommonPosture: 'unknown',
          mostCommonGait: 'unknown'
        },
        keyFindings: hasAnalysisData ? generateKeyFindings(currentSession) : ['Analysis session completed with limited data - consider longer observation periods for more comprehensive insights'],
        recommendations: hasAnalysisData ? generateFinalRecommendations(currentSession) : [
          'Continue monitoring with longer video sessions for more comprehensive analysis',
          'Ensure good lighting and stable camera positioning for optimal results'
        ],
        timestamp: Date.now()
      };

      const updatedSession = {
        ...currentSession,
        finalAssessment
      };

      // Show the final assessment to the user and call callbacks outside render cycle
      setTimeout(() => {
        setShowFinalAssessment(true);
        console.log('✅ Final assessment modal should now be visible');
        
        // Call the completion callback outside the render cycle
        if (onAnalysisComplete) {
          onAnalysisComplete(updatedSession);
        }
      }, 100);

      console.log('✅ Final assessment complete:', finalAssessment);
      
      return updatedSession;
    });
  };

  const getMostCommonValue = (values: string[]): string => {
    if (!values || values.length === 0) return 'unknown';
    
    // Filter out null, undefined, and empty strings
    const validValues = values.filter(val => val && val.trim() !== '');
    if (validValues.length === 0) return 'unknown';
    
    const counts = validValues.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const entries = Object.entries(counts);
    if (entries.length === 0) return 'unknown';
    
    return entries.reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
  };

  const generateKeyFindings = (session: VideoAnalysisSession = analysisSession): string[] => {
    const findings = [];
    const history = session.analysisHistory;
    
    if (!history || history.length === 0) {
      return ['Analysis session completed with limited data - consider longer observation periods for more comprehensive insights'];
    }

    // Confidence trends
    const avgConfidence = history.reduce((acc, a) => acc + (a.confidence || 0), 0) / history.length;
    if (avgConfidence > 0.8) {
      findings.push('High-quality video analysis with excellent AI confidence');
    } else if (avgConfidence < 0.5) {
      findings.push('Video quality may have affected analysis accuracy');
    }

    // Health risk assessment
    const avgHealthRisk = history.reduce((acc, a) => acc + (a.healthRisk || 0), 0) / history.length;
    if (avgHealthRisk > 0.7) {
      findings.push('Elevated health risk indicators detected throughout video');
    } else if (avgHealthRisk < 0.3) {
      findings.push('Generally low health risk indicators observed');
    }

    // Activity patterns
    const avgActivity = history.reduce((acc, a) => acc + (a.activityLevel || 0), 0) / history.length;
    if (avgActivity > 70) {
      findings.push('High activity levels maintained throughout observation');
    } else if (avgActivity < 30) {
      findings.push('Low activity levels observed - may indicate rest period or health concerns');
    }

    // If no specific findings, add a general one
    if (findings.length === 0) {
      findings.push('Normal activity patterns observed during analysis session');
    }

    return findings;
  };

  const generateFinalRecommendations = (session: VideoAnalysisSession = analysisSession): string[] => {
    const recommendations = [];
    const history = session.analysisHistory;
    
    if (!history || history.length === 0) {
      return [
        'Continue monitoring with longer video sessions for more comprehensive analysis',
        'Ensure good lighting and stable camera positioning for optimal results'
      ];
    }

    // Based on health risk
    const avgHealthRisk = history.reduce((acc, a) => acc + (a.healthRisk || 0), 0) / history.length;
    if (avgHealthRisk > 0.6) {
      recommendations.push('Consider veterinary consultation for observed health indicators');
    }

    // Based on activity
    const avgActivity = history.reduce((acc, a) => acc + (a.activityLevel || 0), 0) / history.length;
    if (avgActivity < 30) {
      recommendations.push('Monitor activity levels - consider encouraging more movement');
    } else if (avgActivity > 80) {
      recommendations.push('High activity observed - ensure adequate rest periods');
    }

    // Based on analysis quality
    const avgConfidence = history.reduce((acc, a) => acc + (a.confidence || 0), 0) / history.length;
    if (avgConfidence < 0.6) {
      recommendations.push('Improve video quality for more accurate future analyses');
    }

    // General recommendations
    recommendations.push('Continue regular video monitoring for trend analysis');
    recommendations.push('Document any behavioral changes for veterinary review');

    // Ensure we always have at least one recommendation
    if (recommendations.length === 0) {
      recommendations.push('Maintain current monitoring routine - no immediate concerns identified');
    }

    return recommendations;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (newTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return brandConfig.colors.pastureSage;
    if (score >= 60) return brandConfig.colors.championGold;
    return brandConfig.colors.alertAmber;
  };

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.lg,
      borderRadius: brandConfig.layout.borderRadius
    },
    videoContainer: {
      position: 'relative' as const,
      backgroundColor: '#000',
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden'
    },
    video: {
      width: '100%',
      height: isMobile ? '250px' : '400px',
      objectFit: 'contain' as const
    },
    overlay: {
      position: 'absolute' as const,
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 'bold' as const
    },
    controls: {
      backgroundColor: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: brandConfig.spacing.sm
    },
    analysisCard: {
      backgroundColor: 'white',
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.layout.borderRadius
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography 
        variant={isMobile ? "h5" : "h4"}
        sx={{ 
          color: brandConfig.colors.stableMahogany,
          fontFamily: brandConfig.typography.fontDisplay,
          fontWeight: brandConfig.typography.weightBold,
          mb: 3,
          textAlign: 'center'
        }}
      >
        🎬 Real-Time Video Analysis: {horseName}
      </Typography>

      <Grid container spacing={3}>
        {/* Video Player */}
        <Grid item xs={12} lg={8}>
          <Card sx={styles.analysisCard}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={styles.videoContainer}>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  style={styles.video}
                  onLoadedMetadata={() => console.log('📹 Video metadata loaded')}
                  controls={false}
                  muted
                  playsInline
                  onClick={() => {
                    console.log('👆 Video clicked - attempting to play/pause');
                    togglePlayPause();
                  }}
                />
                
                {/* Live Analysis Overlay */}
                {realtimeAnalysis && !isPlaying && (
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(139, 69, 19, 0.9)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    zIndex: 10
                  }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      🎬 Ready for Real-Time Analysis
                    </Typography>
                    <Typography variant="body2">
                      Click the play button below to start live AI analysis
                    </Typography>
                  </Box>
                )}

                {realtimeAnalysis && isPlaying && (
                  <>
                    <Box sx={styles.overlay}>
                      🔴 LIVE ANALYSIS • {motionDetected ? '🔥 Motion' : '👁️ Watching'}
                    </Box>
                    
                    {nextAnalysisCountdown > 0 && (
                      <Box sx={{ 
                        ...styles.overlay, 
                        bottom: '10px', 
                        top: 'auto',
                        backgroundColor: 'rgba(139, 69, 19, 0.9)'
                      }}>
                        🤖 Next Analysis: {nextAnalysisCountdown}s
                      </Box>
                    )}

                    {/* Final Assessment Preview */}
                    <Box sx={{ 
                      ...styles.overlay, 
                      top: 'auto',
                      bottom: '50px',
                      right: '10px',
                      left: 'auto',
                      backgroundColor: 'rgba(44, 85, 48, 0.9)',
                      fontSize: '11px'
                    }}>
                      🏆 Final assessment at video end
                    </Box>

                    {motionDetected && (
                      <Box sx={{ 
                        ...styles.overlay, 
                        bottom: '10px', 
                        right: '10px',
                        left: 'auto',
                        backgroundColor: 'rgba(255, 165, 0, 0.9)',
                        animation: 'pulse 1s infinite'
                      }}>
                        ⚡ Motion
                      </Box>
                    )}
                  </>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </Box>

              {/* Video Controls */}
              <Box sx={styles.controls}>
                <Stack spacing={2}>
                  {/* Playback Controls */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton 
                      onClick={togglePlayPause}
                      sx={{ 
                        color: 'white',
                        backgroundColor: isPlaying ? 'rgba(255,255,255,0.1)' : 'rgba(76,175,80,0.8)',
                        '&:hover': {
                          backgroundColor: isPlaying ? 'rgba(255,255,255,0.2)' : 'rgba(76,175,80,1)'
                        },
                        fontSize: '24px',
                        padding: '12px'
                      }}
                    >
                      {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    {!isPlaying && (
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        ← Click to start real-time analysis
                      </Typography>
                    )}
                    
                    <Typography variant="body2">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </Typography>
                    
                    <Box sx={{ flexGrow: 1, mx: 2 }}>
                      <Slider
                        value={currentTime}
                        max={duration}
                        onChange={(_, value) => handleSeek(value as number)}
                        sx={{
                          color: brandConfig.colors.championGold,
                          '& .MuiSlider-thumb': {
                            backgroundColor: brandConfig.colors.championGold
                          }
                        }}
                      />
                    </Box>

                    <Typography variant="body2">
                      {playbackRate}x
                    </Typography>
                  </Stack>

                  {/* Analysis Controls */}
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SmartToy sx={{ fontSize: '16px' }} />
                      <Typography variant="body2">AI Analysis:</Typography>
                      <Switch
                        checked={realtimeAnalysis}
                        onChange={(e) => setRealtimeAnalysis(e.target.checked)}
                        size="small"
                      />
                    </Stack>

                    {realtimeAnalysis && (
                      <>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Timeline sx={{ fontSize: '16px' }} />
                          <Typography variant="body2">Interval: {analysisInterval}s</Typography>
                          <Slider
                            value={analysisInterval}
                            min={1}
                            max={10}
                            onChange={(_, value) => setAnalysisInterval(value as number)}
                            sx={{ width: '80px', color: brandConfig.colors.championGold }}
                          />
                        </Stack>

                        <Chip
                          label={`${analysisMode.toUpperCase()} MODE`}
                          size="small"
                          sx={{ 
                            backgroundColor: brandConfig.colors.hunterGreen,
                            color: 'white'
                          }}
                        />
                      </>
                    )}
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Panel */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            {/* Current Analysis */}
            {currentAnalysis && (
              <Card sx={styles.analysisCard}>
                <CardHeader
                  title="Current Analysis"
                  avatar={<Analytics sx={{ color: brandConfig.colors.stableMahogany }} />}
                  subheader={`${formatTime(currentAnalysis.videoTime)} - ${new Date(currentAnalysis.timestamp).toLocaleTimeString()}`}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Horses Detected
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {currentAnalysis.horsesDetected}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Confidence
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ color: getScoreColor(currentAnalysis.confidence * 100) }}
                      >
                        {(currentAnalysis.confidence * 100).toFixed(0)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Activity Level
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {currentAnalysis.activityLevel.toFixed(0)}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">
                        Health Risk
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ color: currentAnalysis.healthRisk > 0.6 ? brandConfig.colors.alertAmber : brandConfig.colors.pastureSage }}
                      >
                        {(currentAnalysis.healthRisk * 100).toFixed(0)}%
                      </Typography>
                    </Grid>
                  </Grid>

                  {currentAnalysis.posture !== 'unknown' && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Posture: <strong>{currentAnalysis.posture}</strong>
                      </Typography>
                    </Box>
                  )}

                  {currentAnalysis.gait !== 'unknown' && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="textSecondary">
                        Gait: <strong>{currentAnalysis.gait}</strong>
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Session Statistics */}
            <Card sx={styles.analysisCard}>
              <CardHeader
                title="Session Statistics"
                avatar={<TrendingUp sx={{ color: brandConfig.colors.hunterGreen }} />}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Total Analyses
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisSession.totalAnalyses}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Avg Confidence
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {(analysisSession.averageConfidence * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                      Session Duration
                    </Typography>
                    <Typography variant="body2">
                      {Math.floor((Date.now() - analysisSession.startTime) / 1000 / 60)} minutes
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* AI Commentary */}
            {showAICommentary && analysisSession.aiCommentary.length > 0 && (
              <Card sx={styles.analysisCard}>
                <CardHeader
                  title="AI Commentary"
                  avatar={<SmartToy sx={{ color: brandConfig.colors.stableMahogany }} />}
                  action={
                    <IconButton onClick={() => setShowAICommentary(!showAICommentary)}>
                      <Visibility />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Box sx={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    padding: '4px'
                  }}>
                    <Stack spacing={1}>
                      {analysisSession.aiCommentary.slice(0, 10).map((comment, index) => (
                        <Paper
                          key={index}
                          sx={{ 
                            p: 1,
                            backgroundColor: index === 0 ? 'rgba(139, 69, 19, 0.1)' : 'rgba(0, 0, 0, 0.02)', 
                            border: index === 0 ? '1px solid rgba(139, 69, 19, 0.2)' : '1px solid rgba(0, 0, 0, 0.05)',
                            opacity: index === 0 ? 1 : Math.max(0.4, 1 - (index * 0.1))
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: 'monospace',
                              color: index === 0 ? brandConfig.colors.stableMahogany : '#666',
                              fontSize: '11px'
                            }}
                          >
                            {comment}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                  </Box>
                  
                  <Box sx={{ 
                    mt: 2, 
                    p: 1, 
                    backgroundColor: 'rgba(44, 85, 48, 0.1)',
                    borderRadius: '4px'
                  }}>
                    <Typography variant="caption" color="textSecondary" align="center" display="block">
                      🔄 Mode: <strong>{analysisMode.toUpperCase()}</strong> • 
                      ⏱️ Next: <strong>{nextAnalysisCountdown}s</strong> • 
                      📊 History: <strong>{analysisSession.aiCommentary.length}</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Analysis Error */}
            {analysisError && (
              <Alert severity="error">
                {analysisError}
              </Alert>
            )}

            {/* Analysis Status */}
            {isAnalyzing && (
              <Alert severity="info" icon={<SmartToy />}>
                🤖 AI is analyzing the current video frame...
                <LinearProgress sx={{ mt: 1 }} />
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Final Assessment Modal/Display */}
      {showFinalAssessment && analysisSession.finalAssessment && (
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          backgroundColor: 'white',
          border: `2px solid ${brandConfig.colors.hunterGreen}`,
          borderRadius: brandConfig.layout.borderRadius,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: brandConfig.colors.stableMahogany,
                  fontFamily: brandConfig.typography.fontDisplay,
                  fontWeight: brandConfig.typography.weightBold,
                  mb: 1
                }}
              >
                🏆 Final Assessment Complete
              </Typography>
              <Typography variant="h6" sx={{ color: brandConfig.colors.hunterGreen }}>
                {horseName} - Real-Time Analysis Summary
              </Typography>
            </Box>

            {/* Session Summary */}
            <Card sx={{ backgroundColor: 'rgba(44, 85, 48, 0.05)' }}>
              <CardHeader
                title="📊 Session Summary"
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Total Duration
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatTime(analysisSession.finalAssessment.sessionSummary.totalDuration)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      AI Analyses
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisSession.finalAssessment.sessionSummary.totalAnalyses}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Avg Confidence
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{ color: getScoreColor(analysisSession.finalAssessment.sessionSummary.averageConfidence * 100) }}
                    >
                      {(analysisSession.finalAssessment.sessionSummary.averageConfidence * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Motion Events
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisSession.finalAssessment.sessionSummary.motionDetectionEvents}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Health Assessment */}
            <Card sx={{ backgroundColor: 'rgba(139, 69, 19, 0.05)' }}>
              <CardHeader
                title="🏥 Overall Health Assessment"
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Health Risk
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{ 
                        color: analysisSession.finalAssessment.overallHealthAssessment.averageHealthRisk > 0.6 
                          ? brandConfig.colors.alertAmber 
                          : brandConfig.colors.pastureSage 
                      }}
                    >
                      {(analysisSession.finalAssessment.overallHealthAssessment.averageHealthRisk * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Activity Level
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      sx={{ color: getScoreColor(analysisSession.finalAssessment.overallHealthAssessment.averageActivityLevel) }}
                    >
                      {analysisSession.finalAssessment.overallHealthAssessment.averageActivityLevel.toFixed(0)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Most Common Posture
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisSession.finalAssessment.overallHealthAssessment.mostCommonPosture}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="textSecondary">
                      Most Common Gait
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {analysisSession.finalAssessment.overallHealthAssessment.mostCommonGait}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Key Findings */}
            <Card sx={{ backgroundColor: 'rgba(255, 193, 7, 0.05)' }}>
              <CardHeader
                title="🔍 Key Findings"
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Stack spacing={1}>
                  {analysisSession.finalAssessment.keyFindings.map((finding: string, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: brandConfig.colors.championGold, fontWeight: 'bold' }}>
                        •
                      </Typography>
                      <Typography variant="body2">
                        {finding}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card sx={{ backgroundColor: 'rgba(76, 175, 80, 0.05)' }}>
              <CardHeader
                title="💡 Recommendations"
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Stack spacing={1}>
                  {analysisSession.finalAssessment.recommendations.map((recommendation: string, index: number) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography variant="body2" sx={{ color: brandConfig.colors.pastureSage, fontWeight: 'bold' }}>
                        ✓
                      </Typography>
                      <Typography variant="body2">
                        {recommendation}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => {
                  setShowFinalAssessment(false);
                  // Notify parent component that assessment was dismissed
                  if (onFinalAssessmentDismissed) {
                    onFinalAssessmentDismissed();
                  }
                }}
                sx={{
                  backgroundColor: brandConfig.colors.hunterGreen,
                  '&:hover': {
                    backgroundColor: brandConfig.colors.stableMahogany
                  }
                }}
              >
                Close Assessment
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  // Export or save functionality could go here
                  console.log('📄 Exporting assessment:', analysisSession.finalAssessment);
                  alert('Assessment data logged to console for export');
                }}
                sx={{
                  borderColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.stableMahogany
                }}
              >
                Export Results
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}; 