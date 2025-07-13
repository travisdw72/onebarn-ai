import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Pause,
  Videocam,
  VideocamOff,
  Security,
  Warning,
  Timer,
  TrendingUp,
  Psychology,
  Speed,
  TrackChanges,
  EmergencySharp,
  Shield
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { aiTrainingConfig } from '../../config/aiTrainingConfig';
import { zeroTrustTrainingConfig } from '../../config/zeroTrustTrainingConfig';
import { useZeroTrustSecurity } from '../../hooks/useZeroTrustSecurity';
import { useAIMonitoring } from '../../hooks/useAIMonitoring';
import { DataClassificationBanner } from '../security/DataClassificationBanner';
import { PermissionGate } from '../security/PermissionGate';

interface ITrainingSessionMonitorProps {
  disciplineType: keyof typeof aiTrainingConfig.sessions.types;
  sessionId: string;
  participantId: string;
  participantType: 'horse' | 'rider';
  onSessionComplete?: (sessionData: any) => void;
  onSecurityEvent?: (event: any) => void;
}

interface ISessionMetrics {
  startTime: number;
  currentTime: number;
  elapsedTime: number;
  splits: Record<string, number>;
  performance: Record<string, any>;
  aiInsights: string[];
  securityEvents: any[];
}

interface ISecurityStatus {
  dataClassification: string;
  accessValidated: boolean;
  deviceTrusted: boolean;
  locationVerified: boolean;
  encryptionActive: boolean;
  riskScore: number;
}

export const TrainingSessionMonitor: React.FC<ITrainingSessionMonitorProps> = ({
  disciplineType,
  sessionId,
  participantId,
  participantType,
  onSessionComplete,
  onSecurityEvent
}) => {
  // State Management
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const [metrics, setMetrics] = useState<ISessionMetrics>({
    startTime: 0,
    currentTime: Date.now(),
    elapsedTime: 0,
    splits: {},
    performance: {},
    aiInsights: [],
    securityEvents: []
  });
  const [securityStatus, setSecurityStatus] = useState<ISecurityStatus>({
    dataClassification: 'CONFIDENTIAL',
    accessValidated: false,
    deviceTrusted: false,
    locationVerified: false,
    encryptionActive: false,
    riskScore: 100
  });
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const performanceDataRef = useRef<any[]>([]);
  const securityValidationRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const { 
    validateAccess, 
    continuousMonitoring, 
    deviceTrustScore, 
    locationTrustScore,
    behaviorTrustScore,
    encryptSession,
    logSecurityEvent
  } = useZeroTrustSecurity();
  
  const { 
    realTimeAnalysis, 
    aiCoachingFeedback, 
    performanceMetrics,
    safetyAlerts 
  } = useAIMonitoring(disciplineType);

  // Get discipline configuration
  const disciplineConfig = aiTrainingConfig.sessions.types[disciplineType];
  const securityTemplate = zeroTrustTrainingConfig.securityTemplates.training_session;

  // Security validation effect
  useEffect(() => {
    const validateSecurity = async () => {
      try {
        const accessValid = await validateAccess('training_data', 'view');
        const deviceTrust = await deviceTrustScore();
        const locationTrust = await locationTrustScore();
        const behaviorTrust = await behaviorTrustScore();
        
        const riskScore = zeroTrustTrainingConfig.calculateSecurityRiskScore({
          userRole: 'TRAINER', // This should come from auth context
          dataClassification: 'CONFIDENTIAL',
          deviceTrust,
          locationTrust,
          timeTrust: 90, // Time-based trust
          behaviorTrust
        });

        setSecurityStatus({
          dataClassification: 'CONFIDENTIAL',
          accessValidated: accessValid,
          deviceTrusted: deviceTrust > 70,
          locationVerified: locationTrust > 80,
          encryptionActive: true,
          riskScore
        });

        // Log security validation
        logSecurityEvent({
          type: 'training_session_security_check',
          sessionId,
          riskScore,
          deviceTrust,
          locationTrust,
          behaviorTrust
        });

      } catch (error) {
        console.error('Security validation failed:', error);
        setEmergencyMode(true);
        onSecurityEvent?.({
          type: 'security_validation_failure',
          error: error.message,
          timestamp: Date.now()
        });
      }
    };

    validateSecurity();
    
    // Continuous security monitoring
    securityValidationRef.current = setInterval(validateSecurity, 30000); // Every 30 seconds

    return () => {
      if (securityValidationRef.current) {
        clearInterval(securityValidationRef.current);
      }
    };
  }, [sessionId, validateAccess, deviceTrustScore, locationTrustScore, behaviorTrustScore, logSecurityEvent, onSecurityEvent]);

  // Timer effect
  useEffect(() => {
    if (sessionActive && !sessionPaused) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setMetrics(prev => ({
          ...prev,
          currentTime: now,
          elapsedTime: now - prev.startTime
        }));
      }, 10); // 10ms precision for 0.01 second accuracy

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [sessionActive, sessionPaused]);

  // AI Analysis effect
  useEffect(() => {
    if (sessionActive && performanceDataRef.current.length > 0) {
      const analyzePerformance = async () => {
        try {
          const analysis = await realTimeAnalysis(performanceDataRef.current);
          const coaching = await aiCoachingFeedback(analysis, disciplineType);
          const safety = await safetyAlerts(analysis);

          setMetrics(prev => ({
            ...prev,
            performance: analysis,
            aiInsights: coaching
          }));

          // Handle safety alerts
          if (safety.length > 0) {
            safety.forEach(alert => {
              onSecurityEvent?.({
                type: 'safety_alert',
                alert,
                timestamp: Date.now()
              });
            });
          }

        } catch (error) {
          console.error('AI analysis failed:', error);
        }
      };

      const analysisInterval = setInterval(analyzePerformance, 1000); // Every second
      return () => clearInterval(analysisInterval);
    }
  }, [sessionActive, realTimeAnalysis, aiCoachingFeedback, safetyAlerts, disciplineType, onSecurityEvent]);

  // Session control handlers
  const handleStartSession = useCallback(async () => {
    try {
      // Validate security before starting
      if (!securityStatus.accessValidated || !securityStatus.deviceTrusted) {
        throw new Error('Security validation failed - cannot start session');
      }

      const startTime = Date.now();
      setMetrics(prev => ({
        ...prev,
        startTime,
        currentTime: startTime,
        elapsedTime: 0,
        splits: {},
        performance: {},
        aiInsights: [],
        securityEvents: []
      }));

      // Initialize encrypted session
      await encryptSession(sessionId);

      setSessionActive(true);
      setSessionPaused(false);

      // Log session start
      logSecurityEvent({
        type: 'training_session_started',
        sessionId,
        discipline: disciplineType,
        participant: participantId,
        timestamp: startTime
      });

    } catch (error) {
      console.error('Failed to start session:', error);
      onSecurityEvent?.({
        type: 'session_start_failure',
        error: error.message,
        timestamp: Date.now()
      });
    }
  }, [securityStatus, sessionId, disciplineType, participantId, encryptSession, logSecurityEvent, onSecurityEvent]);

  const handleStopSession = useCallback(async () => {
    try {
      setSessionActive(false);
      setSessionPaused(false);
      setRecordingActive(false);

      // Prepare session summary
      const sessionSummary = {
        sessionId,
        discipline: disciplineType,
        participant: participantId,
        startTime: metrics.startTime,
        endTime: Date.now(),
        totalTime: metrics.elapsedTime,
        splits: metrics.splits,
        performance: metrics.performance,
        aiInsights: metrics.aiInsights,
        securityEvents: metrics.securityEvents
      };

      // Log session completion
      logSecurityEvent({
        type: 'training_session_completed',
        sessionId,
        duration: metrics.elapsedTime,
        timestamp: Date.now()
      });

      onSessionComplete?.(sessionSummary);

    } catch (error) {
      console.error('Failed to stop session:', error);
      onSecurityEvent?.({
        type: 'session_stop_failure',
        error: error.message,
        timestamp: Date.now()
      });
    }
  }, [sessionId, disciplineType, participantId, metrics, logSecurityEvent, onSessionComplete, onSecurityEvent]);

  const handlePauseSession = useCallback(() => {
    setSessionPaused(!sessionPaused);
    
    logSecurityEvent({
      type: sessionPaused ? 'training_session_resumed' : 'training_session_paused',
      sessionId,
      timestamp: Date.now()
    });
  }, [sessionPaused, sessionId, logSecurityEvent]);

  const handleToggleRecording = useCallback(async () => {
    try {
      if (!recordingActive) {
        // Validate video recording permissions
        const canRecord = await validateAccess('video_recording', 'create');
        if (!canRecord) {
          throw new Error('Insufficient permissions for video recording');
        }
      }

      setRecordingActive(!recordingActive);

      logSecurityEvent({
        type: recordingActive ? 'video_recording_stopped' : 'video_recording_started',
        sessionId,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Failed to toggle recording:', error);
      onSecurityEvent?.({
        type: 'recording_toggle_failure',
        error: error.message,
        timestamp: Date.now()
      });
    }
  }, [recordingActive, sessionId, validateAccess, logSecurityEvent, onSecurityEvent]);

  const handleEmergencyStop = useCallback(() => {
    setEmergencyMode(true);
    setSessionActive(false);
    setSessionPaused(false);
    setRecordingActive(false);

    logSecurityEvent({
      type: 'emergency_stop_activated',
      sessionId,
      timestamp: Date.now()
    });

    onSecurityEvent?.({
      type: 'emergency_stop',
      sessionId,
      timestamp: Date.now()
    });
  }, [sessionId, logSecurityEvent, onSecurityEvent]);

  // Format time display
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Render security status indicator
  const renderSecurityStatus = () => (
    <Card sx={{ mb: 2, border: `2px solid ${securityStatus.riskScore < 30 ? brandConfig.colors.successGreen : 
                                           securityStatus.riskScore < 60 ? brandConfig.colors.alertAmber : 
                                           brandConfig.colors.errorRed}` }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Shield color={securityStatus.riskScore < 30 ? 'success' : 
                          securityStatus.riskScore < 60 ? 'warning' : 'error'} />
            <Typography variant="h6" sx={{ color: brandConfig.colors.midnightBlack }}>
              Security Status
            </Typography>
            <Chip 
              label={`Risk: ${securityStatus.riskScore}`}
              color={securityStatus.riskScore < 30 ? 'success' : 
                    securityStatus.riskScore < 60 ? 'warning' : 'error'}
              size="small"
            />
          </Box>
          <IconButton onClick={() => setShowSecurityDetails(true)}>
            <Security />
          </IconButton>
        </Box>
        <Box display="flex" gap={1} mt={1}>
          <Chip 
            label="Access" 
            color={securityStatus.accessValidated ? 'success' : 'error'} 
            size="small" 
          />
          <Chip 
            label="Device" 
            color={securityStatus.deviceTrusted ? 'success' : 'error'} 
            size="small" 
          />
          <Chip 
            label="Location" 
            color={securityStatus.locationVerified ? 'success' : 'error'} 
            size="small" 
          />
          <Chip 
            label="Encryption" 
            color={securityStatus.encryptionActive ? 'success' : 'error'} 
            size="small" 
          />
        </Box>
      </CardContent>
    </Card>
  );

  // Render timing display
  const renderTimingDisplay = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ 
          fontFamily: brandConfig.typography.fontMono,
          color: sessionActive ? brandConfig.colors.successGreen : brandConfig.colors.sterlingSilver,
          fontWeight: brandConfig.typography.weightBold
        }}>
          {formatTime(metrics.elapsedTime)}
        </Typography>
        <Typography variant="body2" sx={{ color: brandConfig.colors.sterlingSilver }}>
          {sessionActive ? (sessionPaused ? 'Paused' : 'Recording') : 'Ready'}
        </Typography>
      </CardContent>
    </Card>
  );

  // Render discipline-specific widgets
  const renderDisciplineWidgets = () => {
    switch (disciplineType) {
      case 'barrelRacing':
        return (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: brandConfig.colors.midnightBlack }}>
                Barrel Racing Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Turn Quality</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.turnQuality || 0} 
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Speed Consistency</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.speedConsistency || 0} 
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      
      case 'dressage':
        return (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: brandConfig.colors.midnightBlack }}>
                Dressage Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2">Rhythm</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.rhythm || 0} 
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">Contact</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.contact || 0} 
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2">Impulsion</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.performance.impulsion || 0} 
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: brandConfig.colors.midnightBlack }}>
                General Training Metrics
              </Typography>
              <Typography variant="body2" sx={{ color: brandConfig.colors.sterlingSilver }}>
                AI analysis in progress...
              </Typography>
            </CardContent>
          </Card>
        );
    }
  };

  // Render AI coaching feedback
  const renderAIFeedback = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Psychology sx={{ color: brandConfig.colors.ribbonBlue }} />
          <Typography variant="h6" sx={{ color: brandConfig.colors.midnightBlack }}>
            AI Coaching Insights
          </Typography>
        </Box>
        {metrics.aiInsights.length > 0 ? (
          metrics.aiInsights.slice(-3).map((insight, index) => (
            <Alert 
              key={index} 
              severity="info" 
              sx={{ mb: 1, '&:last-child': { mb: 0 } }}
            >
              {insight}
            </Alert>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: brandConfig.colors.sterlingSilver }}>
            Start training session to receive AI coaching feedback
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // Main render
  return (
    <PermissionGate permission="training_sessions" action="view">
      <Box sx={{ p: 2 }}>
        {/* Data Classification Banner */}
        <DataClassificationBanner 
          classification={securityStatus.dataClassification}
          showWarning={securityStatus.riskScore > 60}
        />

        {/* Emergency Mode Alert */}
        {emergencyMode && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => setEmergencyMode(false)}>
                ACKNOWLEDGE
              </Button>
            }
          >
            Emergency mode activated - All training systems secured
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column - Controls and Status */}
          <Grid item xs={12} md={4}>
            {renderSecurityStatus()}
            {renderTimingDisplay()}
            
            {/* Session Controls */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: brandConfig.colors.midnightBlack }}>
                  Session Controls
                </Typography>
                <Box display="flex" justifyContent="center" gap={1} mb={2}>
                  {!sessionActive ? (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={handleStartSession}
                      disabled={!securityStatus.accessValidated || !securityStatus.deviceTrusted}
                      sx={{ 
                        backgroundColor: brandConfig.colors.successGreen,
                        '&:hover': { backgroundColor: brandConfig.colors.hunterGreen }
                      }}
                    >
                      Start
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        startIcon={sessionPaused ? <PlayArrow /> : <Pause />}
                        onClick={handlePauseSession}
                        sx={{ 
                          backgroundColor: brandConfig.colors.alertAmber,
                          '&:hover': { backgroundColor: '#D4A574' }
                        }}
                      >
                        {sessionPaused ? 'Resume' : 'Pause'}
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Stop />}
                        onClick={handleStopSession}
                        sx={{ 
                          backgroundColor: brandConfig.colors.errorRed,
                          '&:hover': { backgroundColor: '#B85450' }
                        }}
                      >
                        Stop
                      </Button>
                    </>
                  )}
                </Box>
                
                <Box display="flex" justifyContent="center" mb={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={recordingActive}
                        onChange={handleToggleRecording}
                        disabled={!sessionActive}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        {recordingActive ? <Videocam /> : <VideocamOff />}
                        Recording
                      </Box>
                    }
                  />
                </Box>

                <Typography variant="body2" sx={{ 
                  color: brandConfig.colors.sterlingSilver,
                  textAlign: 'center'
                }}>
                  Discipline: {disciplineConfig.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Center Column - Discipline Widgets */}
          <Grid item xs={12} md={4}>
            {renderDisciplineWidgets()}
          </Grid>

          {/* Right Column - AI Feedback */}
          <Grid item xs={12} md={4}>
            {renderAIFeedback()}
          </Grid>
        </Grid>

        {/* Emergency Stop Button */}
        <Fab
          color="error"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: brandConfig.colors.errorRed,
            '&:hover': { backgroundColor: '#B85450' }
          }}
          onClick={handleEmergencyStop}
        >
          <EmergencySharp />
        </Fab>

        {/* Security Details Dialog */}
        <Dialog 
          open={showSecurityDetails} 
          onClose={() => setShowSecurityDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Training Session Security Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Security Status
                </Typography>
                <Typography>Risk Score: {securityStatus.riskScore}/100</Typography>
                <Typography>Data Classification: {securityStatus.dataClassification}</Typography>
                <Typography>Access Validated: {securityStatus.accessValidated ? 'Yes' : 'No'}</Typography>
                <Typography>Device Trusted: {securityStatus.deviceTrusted ? 'Yes' : 'No'}</Typography>
                <Typography>Location Verified: {securityStatus.locationVerified ? 'Yes' : 'No'}</Typography>
                <Typography>Encryption Active: {securityStatus.encryptionActive ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Session Information
                </Typography>
                <Typography>Session ID: {sessionId}</Typography>
                <Typography>Discipline: {disciplineConfig.title}</Typography>
                <Typography>Participant: {participantId}</Typography>
                <Typography>Security Template: {securityTemplate.authentication}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default TrainingSessionMonitor; 