import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import {
  Timer as TimerIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  EmojiEvents as TrophyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { aiTrainingConfig } from '../../config/aiTrainingConfig';

interface TrainingSessionMonitorProps {
  horseId: string;
  trainerId: string;
  sessionType: 'barrelRacing' | 'dressage' | 'jumping';
  mode: 'practice' | 'competition' | 'analysis';
}

export const TrainingSessionMonitor: React.FC<TrainingSessionMonitorProps> = ({
  horseId,
  trainerId,
  sessionType,
  mode
}) => {
  // Session state
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [splitTimes, setSplitTimes] = useState<number[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [personalBest, setPersonalBest] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Get configuration for current session type
  const sessionConfig = (aiTrainingConfig.sessions.types as any)[sessionType];
  const competitionConfig = (aiTrainingConfig.competition.modes as any)[mode];

  // Demo data - in real implementation, this would come from sensors/cameras
  const [mockMetrics, setMockMetrics] = useState({
    speed: 0,
    heartRate: 65,
    technique: 0.85,
    consistency: 0.90
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 0.01);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Simulate AI analysis
  useEffect(() => {
    if (isActive) {
      const analysisInterval = setInterval(() => {
        // Simulate real-time AI coaching
        const randomFeedback = generateAIFeedback();
        if (randomFeedback) {
          setAlerts(prev => [...prev.slice(-2), randomFeedback]);
        }
        
        // Update mock metrics
        setMockMetrics(prev => ({
          speed: Math.random() * 25 + 15,
          heartRate: Math.random() * 20 + 60,
          technique: Math.random() * 0.3 + 0.7,
          consistency: Math.random() * 0.2 + 0.8
        }));
      }, 2000);
      
      return () => clearInterval(analysisInterval);
    }
  }, [isActive]);

  const generateAIFeedback = () => {
    const coachingConfig = aiTrainingConfig.coaching.realTime;
    if (!coachingConfig.enabled) return null;

    const alertTypes = Object.keys(coachingConfig.alertTypes);
    const selectedType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const typeConfig = (coachingConfig.alertTypes as any)[selectedType];
    const message = typeConfig.examples[Math.floor(Math.random() * typeConfig.examples.length)];

    return {
      id: Date.now(),
      type: selectedType,
      message,
      priority: typeConfig.priority,
      timestamp: new Date()
    };
  };

  const handleStart = () => {
    setIsActive(true);
    setTimer(0);
    setSplitTimes([]);
    setCurrentSegment(0);
    setAlerts([]);
  };

  const handleStop = () => {
    setIsActive(false);
    
    // Check for personal best
    if (sessionType === 'barrelRacing' && timer > 0 && timer < personalBest) {
      setPersonalBest(timer);
      setAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'performance',
        message: `New Personal Best: ${timer.toFixed(2)}s!`,
        priority: 'info',
        timestamp: new Date()
      }]);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleSplit = () => {
    if (isActive) {
      setSplitTimes(prev => [...prev, timer]);
      setCurrentSegment(prev => prev + 1);
    }
  };

  const formatTime = (time: number) => {
    return time.toFixed(2);
  };

  const getSegmentNames = () => {
    if (sessionType === 'barrelRacing') {
      return ['Start', 'Barrel 1', 'Barrel 2', 'Barrel 3', 'Finish'];
    }
    return ['Start', 'Segment 1', 'Segment 2', 'Finish'];
  };

  const getSeverityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return brandConfig.colors.errorRed;
      case 'warning': return brandConfig.colors.alertAmber;
      case 'medium': return brandConfig.colors.ribbonBlue;
      case 'info': return brandConfig.colors.successGreen;
      default: return brandConfig.colors.sterlingSilver;
    }
  };

  return (
    <Card sx={{ 
      maxWidth: 800, 
      margin: 'auto',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ 
              bgcolor: sessionConfig.color,
              color: 'white'
            }}>
              {sessionType === 'barrelRacing' && <SpeedIcon />}
              {sessionType === 'dressage' && <TrophyIcon />}
              {sessionType === 'jumping' && <TrendingUpIcon />}
            </Avatar>
            <Typography variant="h5" sx={{ 
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontPrimary
            }}>
              {sessionConfig.title}
            </Typography>
            <Chip 
              label={mode.toUpperCase()}
              color={mode === 'competition' ? 'error' : 'primary'}
              size="small"
            />
          </Box>
        }
        action={
          <Box display="flex" gap={1}>
            {!isActive ? (
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleStart}
                sx={{ 
                  bgcolor: brandConfig.colors.successGreen,
                  '&:hover': { bgcolor: brandConfig.colors.pastureSage }
                }}
              >
                Start Session
              </Button>
            ) : (
              <>
                <IconButton onClick={handlePause} color="warning">
                  <PauseIcon />
                </IconButton>
                <IconButton onClick={handleStop} color="error">
                  <StopIcon />
                </IconButton>
                {sessionType === 'barrelRacing' && (
                  <Button
                    variant="outlined"
                    onClick={handleSplit}
                    size="small"
                  >
                    Split
                  </Button>
                )}
              </>
            )}
          </Box>
        }
      />
      
      <CardContent>
        <Grid container spacing={3}>
          {/* Timer Display */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <TimerIcon sx={{ 
                  fontSize: 48, 
                  color: brandConfig.colors.stableMahogany,
                  mb: 1 
                }} />
                <Typography variant="h3" sx={{ 
                  fontFamily: 'monospace',
                  color: isActive ? brandConfig.colors.errorRed : brandConfig.colors.stableMahogany
                }}>
                  {formatTime(timer)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Time (seconds)
                </Typography>
                {personalBest > 0 && (
                  <Typography variant="body2" sx={{ 
                    color: brandConfig.colors.championGold,
                    mt: 1
                  }}>
                    Personal Best: {formatTime(personalBest)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Real-time Metrics */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Real-time Analysis
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="body2">Speed: {mockMetrics.speed.toFixed(1)} mph</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockMetrics.speed / 30) * 100}
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2">Heart Rate: {mockMetrics.heartRate.toFixed(0)} bpm</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockMetrics.heartRate / 100) * 100}
                    color="error"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2">Technique Score: {(mockMetrics.technique * 100).toFixed(0)}%</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={mockMetrics.technique * 100}
                    color="success"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2">Consistency: {(mockMetrics.consistency * 100).toFixed(0)}%</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={mockMetrics.consistency * 100}
                    color="info"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Split Times */}
          {sessionType === 'barrelRacing' && splitTimes.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Split Times
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {splitTimes.map((split, index) => (
                      <Chip
                        key={index}
                        label={`${getSegmentNames()[index + 1]}: ${formatTime(split)}s`}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* AI Coaching Alerts */}
          {alerts.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Coaching Insights
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {alerts.map((alert, index) => (
                      <Box key={alert.id} mb={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          {alert.priority === 'critical' && <WarningIcon color="error" />}
                          {alert.priority === 'info' && <TrophyIcon sx={{ color: brandConfig.colors.championGold }} />}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: getSeverityColor(alert.priority),
                              fontWeight: alert.priority === 'critical' ? 'bold' : 'normal'
                            }}
                          >
                            {alert.message}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {alert.timestamp.toLocaleTimeString()}
                        </Typography>
                        {index < alerts.length - 1 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrainingSessionMonitor; 