import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  IconButton,
  Paper,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CameraAlt,
  Stop,
  PlayArrow,
  Visibility,
  Settings,
  FullscreenExit,
  Fullscreen,
  FlashOn,
  FlashOff,
  CameraEnhance,
  Warning,
  CheckCircle,
  Info,
  Close
} from '@mui/icons-material';

import { useAIVision } from '../../hooks/useAIVision';
import { brandConfig } from '../../config/brandConfig';

// Process AI result and convert to HorseAnalysis format
const processAIResult = (result: any): HorseAnalysis => {
  return {
    healthRisk: result.healthRisk || 0,
    behaviorScore: result.behaviorScore || 0,
    activityLevel: result.activityLevel || 0,
    alerts: result.alerts || [],
    insights: result.insights || [],
    confidence: result.confidence || 0,
    timestamp: new Date().toISOString()
  };
};

interface HorseAnalysis {
  healthRisk: number;
  behaviorScore: number;
  activityLevel: number;
  alerts: string[];
  insights: string[];
  confidence: number;
  timestamp: string;
  
  // Enhanced metadata for rich tracking
  metadata?: {
    captureTimestamp: string;
    motionDetected: boolean;
    monitoringMode: string;
    analysisSequence: number;
    queueStatus?: {
      queueSize: number;
      isProcessing: boolean;
      isAnalyzing: boolean;
      consecutiveAnalyses: number;
      successRate: number;
      dynamicInterval: number;
    };
    environmentalFactors?: any;
    errorOccurred?: boolean;
    errorMessage?: string;
    forceAnalysis?: boolean;
  };
  
  // Rich clinical data from AI
  primarySubjectAnalysis?: {
    subjectType: string;
    breedAssessment: string;
    ageEstimate: string;
    genderAssessment: string;
    sizeClassification: string;
    coatCondition: string;
    facialExpression: string;
    bodyLanguage: string;
  };
  
  clinicalAssessment?: {
    posturalAnalysis: string;
    mobilityAssessment: string;
    respiratoryObservation: string;
    behavioralState: string;
    alertnessLevel: string;
    painIndicators: string[];
    discomfortSigns: string[];
    gaitAnalysis?: string;
    lamenessIndicators?: string[];
  };
  
  healthMetrics?: {
    overallHealthScore: number;
    mobilityScore: number;
    behavioralScore: number;
    respiratoryScore: number;
    postureScore: number;
    alertnessScore: number;
    gaitScore?: number;
  };
  
  riskAssessment?: {
    overallRiskLevel: string;
    riskScore: number;
    immediateRisks: string[];
    monitoringNeeded: string[];
    concerningObservations: string[];
  };
  
  clinicalRecommendations?: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    veterinaryConsultation: string;
    monitoringFrequency: string;
  };
  
  detailedClinicalNotes?: string;
}

export const LiveHorseCamera: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  // State management
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorse, setSelectedHorse] = useState<string>('');
  const [monitoringMode, setMonitoringMode] = useState<'realtime' | 'standard' | 'efficient'>('standard');
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [showAICommentary, setShowAICommentary] = useState(true);
  const [motionDetected, setMotionDetected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [focusAreas, setFocusAreas] = useState<any[]>([]);
  const [nextAnalysisCountdown, setNextAnalysisCountdown] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hook for AI vision
  const {
    isAnalyzing,
    analysisHistory,
    analyzeImage: performAnalysis,
    analysisError: aiError,
    queueStatus
  } = useAIVision();

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Camera access denied or unavailable');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setAutoAnalysis(false);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          // Convert blob to base64
          const reader = new FileReader();
          reader.onload = async () => {
            const base64 = reader.result as string;
            await performAnalysis(base64);
          };
          reader.readAsDataURL(blob);
        } catch (err) {
          setError('Analysis failed. Please try again.');
        }
      }
    }, 'image/jpeg', 0.9);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return brandConfig.colors.successGreen;
    if (score >= 60) return brandConfig.colors.championGold;
    if (score >= 40) return brandConfig.colors.alertAmber;
    return brandConfig.colors.errorRed;
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 20) return brandConfig.colors.successGreen;
    if (risk <= 40) return brandConfig.colors.championGold;
    if (risk <= 70) return brandConfig.colors.alertAmber;
    return brandConfig.colors.errorRed;
  };

  // Mobile-first layout styles
  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh',
      padding: isMobile ? brandConfig.spacing.sm : brandConfig.spacing.lg
    },
    header: {
      mb: isMobile ? 2 : 3,
      textAlign: 'center' as const
    },
    videoContainer: {
      position: 'relative' as const,
      width: isMobile ? '85%' : '100%',
      maxWidth: isMobile ? '350px' : 'none',
      aspectRatio: '16/9',
      backgroundColor: '#f0f0f0',
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden' as const,
      mb: 2,
      mx: isMobile ? 'auto' : 0
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const
    },
    controlsCard: {
      mb: 2,
      backgroundColor: 'white'
    },
    actionButton: {
      minHeight: brandConfig.mobile?.touchTargets?.glovedFriendly || '64px',
      fontSize: isMobile ? '16px' : '14px',
      fontWeight: 'bold' as const,
      borderRadius: brandConfig.layout.borderRadius
    },
    settingsFab: {
      position: 'fixed' as const,
      bottom: isMobile ? 24 : 32,
      right: isMobile ? 24 : 32,
      zIndex: 1000
    },
    analysisCard: {
      mb: 2,
      border: `2px solid ${brandConfig.colors.ribbonBlue}`
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Header - Mobile Optimized */}
      <Box sx={styles.header}>
        <Typography 
          variant={isMobile ? "h6" : "h3"}
          sx={{ 
            color: 'white',
            fontFamily: brandConfig.typography.fontDisplay,
            fontWeight: brandConfig.typography.weightBold,
            mb: isMobile ? 0.25 : 1,
            fontSize: isMobile ? '1.1rem' : '2rem'
          }}
        >
          🐎 Live Horse Monitor
        </Typography>
        <Typography 
          variant={isMobile ? "caption" : "h6"}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: 'normal',
            mb: isMobile ? 0.5 : 1,
            fontSize: isMobile ? '0.75rem' : '1.1rem'
          }}
        >
          Real-time horse monitoring via live stream
        </Typography>
        {isMobile && (
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              icon={<CameraAlt />}
              label={isStreaming ? "Live" : "Offline"}
              color={isStreaming ? "success" : "default"}
              size="small"
            />
            {motionDetected && (
              <Chip 
                icon={<Warning />}
                label="Motion"
                color="warning"
                size="small"
              />
            )}
          </Stack>
        )}
      </Box>

      {/* Error Alert */}
      {(error || aiError) && (
        <Alert 
          severity="error" 
          onClose={() => {
            setError(null);
          }}
          sx={{ mb: 2 }}
        >
          {error || aiError}
        </Alert>
      )}

      {/* Camera Feed - Positioned Above Quick Settings */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <CameraAlt />
              <Typography variant="h6">Live Camera Feed</Typography>
              {!isMobile && isStreaming && (
                <Chip label="Live" color="success" size="small" />
              )}
              {!isMobile && motionDetected && (
                <Chip label="Motion" color="warning" size="small" />
              )}
            </Stack>
          }
          action={
            !isMobile && (
              <Stack direction="row" spacing={1}>
                <IconButton onClick={toggleFullscreen}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
                {!isStreaming ? (
                  <Button 
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={startCamera}
                    sx={{ 
                      backgroundColor: brandConfig.colors.hunterGreen,
                      minHeight: '48px'
                    }}
                  >
                    Start Camera
                  </Button>
                ) : (
                  <Button 
                    variant="contained"
                    color="error"
                    startIcon={<Stop />}
                    onClick={stopCamera}
                    sx={{ minHeight: '48px' }}
                  >
                    Stop Camera
                  </Button>
                )}
              </Stack>
            )
          }
        />
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Box sx={styles.videoContainer}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={styles.video}
              onClick={() => {
                if (videoRef.current?.paused) {
                  videoRef.current.play();
                }
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            
            {/* Focus areas overlay */}
            {focusAreas.map((area, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  left: `${area.x * 100}%`,
                  top: `${area.y * 100}%`,
                  width: `${area.width * 100}%`,
                  height: `${area.height * 100}%`,
                  border: `2px solid ${brandConfig.colors.ribbonBlue}`,
                  borderRadius: '4px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  pointerEvents: 'none'
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    top: '-20px',
                    left: '0',
                    color: brandConfig.colors.ribbonBlue,
                    fontWeight: 'bold',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    px: 1,
                    borderRadius: '4px'
                  }}
                >
                  {area.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Mobile Camera Controls */}
          {isMobile && (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {!isStreaming ? (
                <Button 
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={startCamera}
                  sx={{ 
                    backgroundColor: brandConfig.colors.hunterGreen,
                    ...styles.actionButton,
                    flex: 1
                  }}
                >
                  Start Camera
                </Button>
              ) : (
                <>
                  <Button 
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<Stop />}
                    onClick={stopCamera}
                    sx={styles.actionButton}
                  >
                    Stop
                  </Button>
                  <Button 
                    variant="contained"
                    size="large"
                    startIcon={<CameraEnhance />}
                    onClick={captureAndAnalyze}
                    disabled={isAnalyzing}
                    sx={{ 
                      backgroundColor: brandConfig.colors.stableMahogany,
                      ...styles.actionButton,
                      flex: 1
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Quick Selection Settings - Positioned Below Video */}
      <Card sx={styles.controlsCard}>
        <CardContent>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Horse Selection
              </Typography>
              <Select
                fullWidth
                value={selectedHorse}
                onChange={(e) => setSelectedHorse(e.target.value)}
                displayEmpty
                sx={{ minHeight: '48px' }}
              >
                <MenuItem value="">Select a horse</MenuItem>
                <MenuItem value="Thunder">Thunder</MenuItem>
                <MenuItem value="Star">Star</MenuItem>
                <MenuItem value="Midnight">Midnight</MenuItem>
                <MenuItem value="Spirit">Spirit</MenuItem>
              </Select>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Monitoring Mode
              </Typography>
              <Select
                fullWidth
                value={monitoringMode}
                onChange={(e) => setMonitoringMode(e.target.value as any)}
                sx={{ minHeight: '48px' }}
              >
                <MenuItem value="realtime">Realtime (15s)</MenuItem>
                <MenuItem value="standard">Standard (30s)</MenuItem>
                <MenuItem value="efficient">Efficient (60s)</MenuItem>
              </Select>
            </Grid>

            {!isMobile && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoAnalysis}
                        onChange={(e) => setAutoAnalysis(e.target.checked)}
                        disabled={!isStreaming}
                      />
                    }
                    label="Auto Analysis"
                  />
                  {autoAnalysis && nextAnalysisCountdown > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={100 - (nextAnalysisCountdown / 60) * 100}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Next analysis in {nextAnalysisCountdown}s
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showAICommentary}
                        onChange={(e) => setShowAICommentary(e.target.checked)}
                      />
                    }
                    label="AI Commentary"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Visibility />}
                    onClick={captureAndAnalyze}
                    disabled={!isStreaming || isAnalyzing}
                    sx={{
                      backgroundColor: brandConfig.colors.stableMahogany,
                      ...styles.actionButton
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Current Frame'}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Analysis - Mobile Optimized */}
      {analysisHistory.length > 0 && (
        <Card sx={styles.analysisCard}>
          <CardHeader
            title="Latest Analysis"
            titleTypographyProps={{ variant: isMobile ? 'h6' : 'h5' }}
          />
          <CardContent>
            {analysisHistory.slice(0, 1).map((analysis, index) => (
              <Box key={index}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="textSecondary">
                      Health Risk
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ color: getRiskColor(analysis.healthRisk) }}
                    >
                      {analysis.healthRisk}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="textSecondary">
                      Behavior
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ color: getScoreColor(analysis.behaviorScore) }}
                    >
                      {analysis.behaviorScore}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="textSecondary">
                      Activity
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ color: getScoreColor(analysis.activityLevel) }}
                    >
                      {analysis.activityLevel}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="textSecondary">
                      Confidence
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ color: getScoreColor(analysis.confidence) }}
                    >
                      {analysis.confidence}%
                    </Typography>
                  </Grid>
                </Grid>

                {analysis.alerts.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Alerts:
                    </Typography>
                    <Stack spacing={1}>
                      {analysis.alerts.map((alert, alertIndex) => (
                        <Chip
                          key={alertIndex}
                          label={alert}
                          color="error"
                          size="small"
                          icon={<Warning />}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {analysis.insights.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Insights:
                    </Typography>
                    <Stack spacing={1}>
                      {analysis.insights.slice(0, isMobile ? 2 : 3).map((insight, insightIndex) => (
                        <Typography
                          key={insightIndex}
                          variant="body2"
                          sx={{ 
                            color: brandConfig.colors.midnightBlack,
                            fontSize: isMobile ? '14px' : '13px'
                          }}
                        >
                          • {insight}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mobile Settings FAB */}
      {isMobile && (
        <Fab
          sx={styles.settingsFab}
          color="primary"
          onClick={() => setShowSettings(true)}
        >
          <Settings />
        </Fab>
      )}

      {/* Mobile Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Settings</Typography>
            <IconButton onClick={() => setShowSettings(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoAnalysis}
                  onChange={(e) => setAutoAnalysis(e.target.checked)}
                  disabled={!isStreaming}
                />
              }
              label="Auto Analysis"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showAICommentary}
                  onChange={(e) => setShowAICommentary(e.target.checked)}
                />
              }
              label="AI Commentary"
            />
            
            {autoAnalysis && nextAnalysisCountdown > 0 && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Next analysis in {nextAnalysisCountdown}s
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={100 - (nextAnalysisCountdown / 60) * 100}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 