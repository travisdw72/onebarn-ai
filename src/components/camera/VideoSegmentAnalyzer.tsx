import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  FormControlLabel,
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
  VideoCall,
  CloudUpload,
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
import { multiClipVideoService, MultiClipProgress, VideoClip } from '../../services/multiClipVideoService';

interface VideoSegmentData {
  timestamp: number;
  segmentIndex: number;
  duration: number;
  horsesDetected: number;
  confidence: number;
  activityLevel: number;
  posture: string;
  gait: string;
  healthRisk: number;
  observations: string[];
  recommendations: string[];
  videoAnalysis: any;
}

interface VideoAnalysisSession {
  sessionId: string;
  horseName: string;
  startTime: number;
  segmentHistory: VideoSegmentData[];
  totalSegments: number;
  averageConfidence: number;
  finalAssessment?: any;
}

interface VideoSegmentAnalyzerProps {
  videoUrl?: string;
  videoId?: string;
  horseName: string;
  useCamera?: boolean;
  onAnalysisComplete?: (session: VideoAnalysisSession) => void;
  onSegmentAnalyzed?: (analysis: VideoSegmentData) => void;
  onFinalAssessmentDismissed?: () => void;
}

export const VideoSegmentAnalyzer: React.FC<VideoSegmentAnalyzerProps> = ({
  videoUrl,
  videoId,
  horseName,
  useCamera = false,
  onAnalysisComplete,
  onSegmentAnalyzed,
  onFinalAssessmentDismissed
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Multi-clip recording state
  const [multiClipSessionId, setMultiClipSessionId] = useState<string | null>(null);
  const [multiClipProgress, setMultiClipProgress] = useState<MultiClipProgress | null>(null);
  const [completedClips, setCompletedClips] = useState<VideoClip[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  
  // Video playback state (for uploaded videos)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<VideoSegmentData | null>(null);
  const [analysisSession, setAnalysisSession] = useState<VideoAnalysisSession>({
    sessionId: `session_${Date.now()}`,
    horseName,
    startTime: Date.now(),
    segmentHistory: [],
    totalSegments: 0,
    averageConfidence: 0
  });
  
  // UI state
  const [showAnalysisResults, setShowAnalysisResults] = useState(true);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoSetupRef = useRef<boolean>(false);
  
  // Video Analysis hook
  const {
    isAnalyzing,
    analysisHistory,
    analyzeVideoSegment,
    analysisError
  } = useVideoAnalysis();

  // Initialize camera or video
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (useCamera) {
      startCamera();
    } else if (videoUrl && videoElement && !videoSetupRef.current) {
      console.log('🎞️ Setting up video analysis for uploaded video:', videoUrl);
      videoSetupRef.current = true;
      
      const handleVideoLoaded = () => {
        if (videoElement) {
          setDuration(videoElement.duration);
          console.log(`📹 Video loaded: ${videoElement.duration.toFixed(1)}s duration`);
        }
      };
      
      let canPlayHandled = false;
      
      const handleCanPlay = async () => {
        if (canPlayHandled) return; // Prevent multiple calls
        canPlayHandled = true;
        
        console.log('🎬 Video ready for analysis');
        // Auto-start playback for uploaded videos
        if (!useCamera && videoElement) {
          try {
            videoElement.currentTime = 0; // Start from beginning
            await videoElement.play();
            setIsPlaying(true);
            setNeedsUserInteraction(false);
          } catch (error) {
            console.warn('⚠️ Autoplay prevented by browser - user must click play:', error);
            setNeedsUserInteraction(true);
            // Don't throw error, just log it
          }
        }
      };
      
      const handleVideoEnded = () => {
        console.log('🏁 Video playback ended - stopping recording');
        setIsPlaying(false);
        
        // Force stop recording if it's still running
        if (multiClipSessionId) {
          console.log('🛑 Forcing multi-clip session to stop');
          multiClipVideoService.stopRecording(multiClipSessionId);
          setIsRecording(false);
        }
      };
      
      videoElement.src = videoUrl;
      videoElement.addEventListener('loadedmetadata', handleVideoLoaded);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('ended', handleVideoEnded);
      
      // Cleanup function to remove event listeners
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleVideoLoaded);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('ended', handleVideoEnded);
        videoSetupRef.current = false; // Reset flag
        cleanup();
      };
    }

    return () => {
      cleanup();
    };
  }, [useCamera, videoUrl]);

  // Auto-recording - single test with multi-clip
  useEffect(() => {
    if (autoRecord && (useCamera || isPlaying)) {
      startMultiClipRecording();
    }
  }, [autoRecord, useCamera, isPlaying]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        console.log('📹 Camera started successfully');
      }
    } catch (err) {
      console.error('❌ Camera access failed:', err);
    }
  };

  const startMultiClipRecording = async () => {
    console.log('🎬 Starting multi-clip recording (3x 9-second clips)');
    
    if (isRecording || multiClipSessionId) {
      console.log('⚠️ Already recording, skipping');
      return;
    }
    
    try {
      let stream: MediaStream;
      
      if (useCamera) {
        stream = streamRef.current!;
      } else {
        // For uploaded videos, create stream from canvas
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const video = videoRef.current!;
        
        // Wait for video to be ready
        if (video && video.readyState < 2) {
          console.log('⏳ Waiting for video to be ready...');
          await new Promise((resolve) => {
            const checkReady = () => {
              if (video && video.readyState >= 2) {
                resolve(void 0);
              } else {
                setTimeout(checkReady, 100);
              }
            };
            checkReady();
          });
        }
        
        // Set up canvas dimensions
        canvas.width = video?.videoWidth || 640;
        canvas.height = video?.videoHeight || 480;
        console.log(`🎨 Canvas setup: ${canvas.width}x${canvas.height}`);
        
        // Create canvas stream
        stream = canvas.captureStream(30); // 30 FPS
        console.log('📺 Canvas stream created');
        
        // Start drawing video frames to canvas
        let frameCount = 0;
        const drawFrame = () => {
          if (video && video.readyState >= 2 && !video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frameCount++;
            // Reduced logging - only log every 300 frames (10 seconds)
            if (frameCount % 300 === 0) {
              console.log(`🎬 Drawing frame ${frameCount} to canvas`);
            }
          }
          
          // Continue drawing while recording
          if (isRecording) {
            requestAnimationFrame(drawFrame);
          }
        };
        
        // Start drawing loop
        drawFrame();
      }

      // Start multi-clip recording session
      const sessionId = await multiClipVideoService.startMultiClipRecording(stream, {
        clipDuration: 9, // 9 seconds per clip (optimized for rate limiting)
        totalClips: 3,   // 3 clips total
        horseName,
        onProgress: (progress) => {
          setMultiClipProgress(progress);
        },
        onClipComplete: (clipIndex, clip) => {
          setCompletedClips(prev => [...prev, clip]);
        },
                onSessionComplete: async (finalVideo) => {
          setIsRecording(false);
          setMultiClipSessionId(null);
          
          // Process the final combined video
          await processMultiClipResult(finalVideo);
        },
        onError: (error) => {
          console.error('❌ Multi-clip recording error:', error);
          setIsRecording(false);
          setMultiClipSessionId(null);
          setMultiClipProgress(null);
        }
      });

      setMultiClipSessionId(sessionId);
      setIsRecording(true);
      setCompletedClips([]);
      


    } catch (error) {
      console.error('❌ Failed to start multi-clip recording:', error);
      setIsRecording(false);
    }
  };

  const processMultiClipResult = async (finalVideo: Blob) => {
    try {

      // Enhanced horse context for video analysis
      const horseContext = {
        name: horseName,
        segmentIndex: analysisSession.totalSegments + 1,
        segmentDuration: 30, // 3x 10-second clips = 30 seconds
        sessionId: analysisSession.sessionId,
        priority: 'high' as 'high' | 'medium' | 'low' | 'urgent',
        videoMode: true,
        multiClipMode: true,
        environmentalContext: {
          recordingMode: useCamera ? 'live_camera_multiclip' : 'video_playback_multiclip',
          sessionDuration: Date.now() - analysisSession.startTime,
          previousSegments: analysisSession.segmentHistory.length,
          totalClips: completedClips.length
        }
      };

      // Upload and analyze combined video segment
      console.log('🎬 STARTING AI ANALYSIS...');
      const result = await analyzeVideoSegment(finalVideo, horseContext);
      
      console.log('🎬 AI ANALYSIS RESULT RECEIVED:', {
        hasResult: !!result,
        confidence: result?.confidence,
        healthRisk: result?.healthRisk,
        activityLevel: result?.activityLevel,
        hasInsights: result?.insights?.length || 0,
        hasRecommendations: result?.recommendations?.length || 0,
        hasClinicalAssessment: !!result?.clinicalAssessment,
        posturalAnalysis: result?.clinicalAssessment?.posturalAnalysis,
        gaitAnalysis: result?.clinicalAssessment?.gaitAnalysis
      });
      
      if (result && result.confidence !== undefined) {
        // ✅ ONLY PROCESS IF WE HAVE REAL AI DATA - NO FALLBACKS ALLOWED
        const analysisData: VideoSegmentData = {
          timestamp: Date.now(),
          segmentIndex: analysisSession.totalSegments + 1,
          duration: 30, // Combined duration
          horsesDetected: result.horseDetected ? 1 : 0,
          // ✅ USE ACTUAL AI DATA - NO FALLBACKS AT ALL
          confidence: result.confidence,
          activityLevel: result.activityLevel,
          posture: result.clinicalAssessment?.posturalAnalysis,
          gait: result.clinicalAssessment?.gaitAnalysis,
          healthRisk: result.healthRisk,
          observations: result.insights || [],
          recommendations: result.recommendations || [],
          videoAnalysis: result // ✅ Preserve the full AI analysis
        };
        
        console.log('📊 PROCESSED ANALYSIS DATA FOR UI:', {
          confidence: analysisData.confidence,
          activityLevel: analysisData.activityLevel,
          healthRisk: analysisData.healthRisk,
          posture: analysisData.posture,
          gait: analysisData.gait,
          observationsCount: analysisData.observations.length,
          recommendationsCount: analysisData.recommendations.length
        });

        // Update current analysis
        setCurrentAnalysis(analysisData);

        // Add to session history
        setAnalysisSession(prev => {
          const newHistory = [...prev.segmentHistory, analysisData];
          const newTotal = prev.totalSegments + 1;
          const newAverage = newHistory.reduce((acc, a) => acc + a.confidence, 0) / newHistory.length;
          
          return {
            ...prev,
            segmentHistory: newHistory,
            totalSegments: newTotal,
            averageConfidence: newAverage
          };
        });

        // Callback for parent component
        if (onSegmentAnalyzed) {
          onSegmentAnalyzed(analysisData);
        }

        console.log(`✅ Multi-clip video analysis complete: ${analysisData.confidence.toFixed(2)} confidence, ${analysisData.horsesDetected} horses`);
      } else {
        // ❌ NO AI DATA RECEIVED - FAIL HARD INSTEAD OF FALLBACK
        console.error('🚨 AI ANALYSIS FAILED - NO VALID RESULT RECEIVED');
        console.error('📋 Raw result:', result);
        throw new Error('AI analysis failed - no confidence score received');
      }

    } catch (error) {
      console.error('🚨 Multi-clip video analysis failed:', error);
      
      // Create a detailed error analysis to show user what went wrong
      const errorAnalysis: VideoSegmentData = {
        timestamp: Date.now(),
        segmentIndex: analysisSession.totalSegments + 1,
        duration: 30,
        horsesDetected: 0,
        confidence: 0,
        activityLevel: 0,
        posture: 'ERROR',
        gait: 'ERROR',
        healthRisk: 1.0, // Maximum risk to show something is wrong
        observations: [
          `❌ AI Analysis Failed: ${error instanceof Error ? error.message : String(error)}`,
          `🔍 This may be due to:`,
          `   • OpenAI safety policies blocking veterinary analysis`,
          `   • Network connectivity issues`,
          `   • Video format problems`,
          `   • Rate limiting or API quota issues`
        ],
        recommendations: [
          `Try uploading a different image/video`,
          `Check network connection`,
          `Wait a few minutes and try again`,
          `Contact support if issue persists`
        ],
        videoAnalysis: null,
        isError: true // Flag to style this differently
      };
      
      // Show the error to the user instead of hiding it
      setCurrentAnalysis(errorAnalysis);
      
      console.log('📊 SHOWING ERROR ANALYSIS TO USER:', errorAnalysis);
    }
  };

  const stopRecording = () => {
    if (multiClipSessionId && isRecording) {
      multiClipVideoService.stopRecording(multiClipSessionId);
      setIsRecording(false);
      setMultiClipSessionId(null);
      setMultiClipProgress(null);
      console.log('⏹️ Multi-clip recording stopped manually');
    }
  };

  const cleanup = () => {
    if (multiClipSessionId) {
      multiClipVideoService.stopRecording(multiClipSessionId);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    multiClipVideoService.cleanupAllSessions();
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        setNeedsUserInteraction(false);
      } catch (error) {
        console.error('Failed to play video:', error);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return brandConfig.colors.successGreen;
    if (score >= 60) return brandConfig.colors.warningAmber;
    return brandConfig.colors.alertRed;
  };

  return (
    <Grid container spacing={3}>
      {/* Video Display */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <VideoCall color="primary" />
                <Typography variant="h6">
                  {useCamera ? 'Live Camera Feed' : 'Video Playback'}
                </Typography>
                {isRecording && (
                  <Badge color="error" variant="dot">
                    <Chip 
                      label="Recording Multi-Clip"
                      size="small" 
                      color="error"
                      icon={<PlayArrow />}
                    />
                  </Badge>
                )}
              </Stack>
            }
            action={
              <Stack direction="row" spacing={1}>
                {!useCamera && (
                  <IconButton onClick={togglePlayPause}>
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                )}
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoRecord}
                      onChange={(e) => setAutoRecord(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Auto Record"
                />
              </Stack>
            }
          />
          
          <CardContent>
            <Box position="relative">
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.neutralGray
                }}
                autoPlay={useCamera}
                muted
                playsInline
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              />
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              
              {/* Multi-Clip Recording Progress Overlay */}
              {isRecording && multiClipProgress && (
                <Box
                  position="absolute"
                  top={16}
                  left={16}
                  right={16}
                  bgcolor="rgba(0,0,0,0.8)"
                  borderRadius={1}
                  p={2}
                >
                  <Stack spacing={1}>
                    <Typography variant="body2" color="white">
                      {multiClipProgress.message}
                    </Typography>
                    <Typography variant="caption" color="white">
                      Clip {multiClipProgress.currentClip}/3 • {multiClipProgress.phase}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={multiClipProgress.totalProgress}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: brandConfig.colors.alertRed
                        }
                      }}
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={multiClipProgress.clipProgress}
                      sx={{ 
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: brandConfig.colors.warningAmber
                        }
                      }}
                    />
                  </Stack>
                </Box>
              )}

              {/* Completed Clips Display */}
              {completedClips.length > 0 && (
                <Box
                  position="absolute"
                  bottom={16}
                  left={16}
                  bgcolor="rgba(0,0,0,0.8)"
                  borderRadius={1}
                  p={1}
                >
                  <Stack direction="row" spacing={1}>
                    <Typography variant="caption" color="white">
                      Clips: 
                    </Typography>
                    {[1, 2, 3].map(i => (
                      <Chip
                        key={i}
                        label={i}
                        size="small"
                        color={completedClips.length >= i ? "success" : "default"}
                        variant={completedClips.length >= i ? "filled" : "outlined"}
                        sx={{ 
                          minWidth: 24,
                          height: 20,
                          fontSize: '0.7rem',
                          color: completedClips.length >= i ? 'white' : 'rgba(255,255,255,0.7)'
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Manual Controls */}
            <Stack direction="row" spacing={2} mt={2}>
              <Button
                variant={isRecording ? "outlined" : "contained"}
                color={isRecording ? "error" : "primary"}
                onClick={isRecording ? stopRecording : startMultiClipRecording}
                disabled={isAnalyzing}
                startIcon={isRecording ? <Stop /> : <PlayArrow />}
              >
                {isRecording ? 'Stop Multi-Clip Recording' : 'Record 3x10s Clips & Send to AI'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Analysis Results Panel */}
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {/* Latest Analysis */}
          {currentAnalysis && showAnalysisResults && (
            <Card>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Analytics color="primary" />
                    <Typography variant="h6">
                      Latest Multi-Clip Analysis
                    </Typography>
                  </Stack>
                }
                action={
                  <IconButton onClick={() => setShowAnalysisResults(false)}>
                    <Visibility />
                  </IconButton>
                }
              />
              <CardContent>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Confidence
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={currentAnalysis.confidence * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: brandConfig.colors.lightGray,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getScoreColor(currentAnalysis.confidence * 100)
                        }
                      }}
                    />
                    <Typography variant="caption">
                      {(currentAnalysis.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>

                  <Divider />

                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">
                      Key Observations
                    </Typography>
                    {currentAnalysis.observations.slice(0, 3).map((obs, index) => (
                      <Typography key={index} variant="body2">
                        • {obs}
                      </Typography>
                    ))}
                  </Stack>

                  <Divider />

                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">
                      Recommendations
                    </Typography>
                    {currentAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                      <Typography key={index} variant="body2">
                        • {rec}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Raw AI Response Data */}
          {currentAnalysis && (
            <Card sx={{ border: `2px solid ${brandConfig.colors.alertAmber}` }}>
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <SmartToy sx={{ color: brandConfig.colors.stableMahogany }} />
                    <Typography variant="h6">
                      🤖 Raw AI Response
                    </Typography>
                    <Chip 
                      label="DEBUG" 
                      size="small" 
                      sx={{ 
                        backgroundColor: brandConfig.colors.alertAmber,
                        color: 'white',
                        fontSize: '10px'
                      }} 
                    />
                  </Stack>
                }
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Complete AI analysis data from Claude - shows exactly what the AI returned:
                </Typography>
                
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: brandConfig.colors.lightGray,
                    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                    maxHeight: '300px',
                    overflow: 'auto'
                  }}
                >
                  <pre 
                    style={{ 
                      margin: 0,
                      fontSize: '11px',
                      fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: brandConfig.colors.stableMahogany,
                      lineHeight: 1.3
                    }}
                  >
                    {JSON.stringify(currentAnalysis.videoAnalysis, null, 2)}
                  </pre>
                </Paper>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    📊 Quick Stats:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Chip 
                      label={`Confidence: ${(currentAnalysis.confidence * 100).toFixed(1)}%`}
                      size="small"
                      sx={{ backgroundColor: brandConfig.colors.hunterGreen, color: 'white' }}
                    />
                    <Chip 
                      label={`Health Risk: ${((currentAnalysis.healthRisk || 0) * 100).toFixed(1)}%`}
                      size="small"
                      sx={{ backgroundColor: brandConfig.colors.alertAmber, color: 'white' }}
                    />
                    <Chip 
                      label={`Activity: ${currentAnalysis.activityLevel}%`}
                      size="small"
                      sx={{ backgroundColor: brandConfig.colors.stableMahogany, color: 'white' }}
                    />
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Session Summary */}
          <Card>
            <CardHeader
              title={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Timeline color="primary" />
                  <Typography variant="h6">Session Summary</Typography>
                </Stack>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Multi-Clip Sessions
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analysisSession.totalSegments}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Avg Confidence
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {(analysisSession.averageConfidence * 100).toFixed(1)}%
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">
                    Session Duration
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formatTime((Date.now() - analysisSession.startTime) / 1000)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Recent Segments */}
          {analysisSession.segmentHistory.length > 0 && (
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6">Recent Multi-Clip Sessions</Typography>
                }
              />
              <CardContent>
                <Stack spacing={1}>
                  {analysisSession.segmentHistory.slice(0, 5).map((segment, index) => (
                    <Paper
                      key={segment.timestamp}
                      variant="outlined"
                      sx={{ p: 1, bgcolor: brandConfig.colors.backgroundLight }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="caption">
                            Session {segment.segmentIndex} • 30s (3x10s clips)
                          </Typography>
                          <Typography variant="body2">
                            {(segment.confidence * 100).toFixed(0)}% confidence
                          </Typography>
                        </Stack>
                        <Chip
                          label={segment.horsesDetected}
                          size="small"
                          color={segment.horsesDetected > 0 ? "success" : "default"}
                        />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}; 