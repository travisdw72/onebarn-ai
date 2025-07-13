import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Avatar,
  LinearProgress,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PersonAdd,
  CameraAlt,
  Monitor,
  Analytics,
  CheckCircle,
  ArrowForward,
  Pets as HorseIcon,
  Visibility,
  NotificationsActive,
  TrendingUp,
  Dashboard,
  PlayArrow,
  Pause
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { useNavigation } from '../../contexts/NavigationContext';

interface IHorseData {
  id: string;
  name: string;
  breed: string;
  age: number;
  color: string;
  gender: 'Mare' | 'Stallion' | 'Gelding';
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  activityLevel: 'High' | 'Medium' | 'Low';
  lastCheckup: string;
  aiInsights: string[];
  alerts: Array<{
    type: 'health' | 'behavior' | 'activity';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

interface IClientData {
  name: string;
  email: string;
  barnName: string;
  horses: IHorseData[];
  subscriptionPlan: string;
  totalInsights: number;
  alertsThisWeek: number;
}

const DEMO_STEPS = [
  {
    label: 'Client Registration',
    description: 'New client signs up and provides horse information',
    icon: <PersonAdd />
  },
  {
    label: 'Camera Setup',
    description: 'Client connects cameras to monitor their horses',
    icon: <CameraAlt />
  },
  {
    label: 'Live Monitoring',
    description: 'AI begins analyzing and providing insights',
    icon: <Monitor />
  },
  {
    label: 'Dashboard Access',
    description: 'Client views their personalized dashboard',
    icon: <Dashboard />
  }
];

const DEMO_CLIENT_DATA: IClientData = {
  name: 'Sarah Henderson',
  email: 'sarah@windridgestables.com',
  barnName: 'Windridge Stables',
  subscriptionPlan: 'Professional',
  totalInsights: 1247,
  alertsThisWeek: 3,
  horses: [
    {
      id: 'h1',
      name: 'Thunder',
      breed: 'Thoroughbred',
      age: 8,
      color: 'Bay',
      gender: 'Stallion',
      healthStatus: 'Excellent',
      activityLevel: 'High',
      lastCheckup: '2024-01-10',
      aiInsights: [
        'Consistent exercise patterns indicate good fitness',
        'Eating habits are regular and healthy',
        'No lameness indicators detected in recent footage'
      ],
      alerts: [
        {
          type: 'behavior',
          message: 'Increased water consumption detected',
          timestamp: '2024-01-14T14:30:00',
          severity: 'low'
        }
      ]
    },
    {
      id: 'h2',
      name: 'Bella',
      breed: 'Quarter Horse',
      age: 6,
      color: 'Chestnut',
      gender: 'Mare',
      healthStatus: 'Good',
      activityLevel: 'Medium',
      lastCheckup: '2024-01-08',
      aiInsights: [
        'Slight favoring of left front leg noted',
        'Overall movement patterns within normal range',
        'Social interaction with other horses is positive'
      ],
      alerts: [
        {
          type: 'health',
          message: 'Minor gait irregularity detected - veterinary review recommended',
          timestamp: '2024-01-13T09:15:00',
          severity: 'medium'
        }
      ]
    }
  ]
};

export const ClientWorkflowDemo: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [cameraConnected, setCameraConnected] = useState(false);
  const [aiAnalysisActive, setAiAnalysisActive] = useState(false);
  const [simulatedAlerts, setSimulatedAlerts] = useState<Array<{
    id: string;
    message: string;
    severity: string;
  }>>([]);

  // Auto-play demo
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setActiveStep(prev => {
          if (prev < DEMO_STEPS.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  // Simulate AI alerts
  useEffect(() => {
    if (aiAnalysisActive) {
      const alertInterval = setInterval(() => {
        const newAlert = {
          id: Date.now().toString(),
          message: 'Normal feeding behavior detected - Thunder',
          severity: 'low'
        };
        setSimulatedAlerts(prev => [...prev, newAlert].slice(-3));
      }, 3000);
      return () => clearInterval(alertInterval);
    }
  }, [aiAnalysisActive]);

  const handleCameraConnect = () => {
    setCameraConnected(true);
    setTimeout(() => {
      setAiAnalysisActive(true);
    }, 1000);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return brandConfig.colors.pastureSage;
      case 'Good': return brandConfig.colors.ribbonBlue;
      case 'Fair': return brandConfig.colors.alertAmber;
      case 'Poor': return brandConfig.colors.victoryRose;
      default: return brandConfig.colors.sterlingSilver;
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
    },
    title: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: '1rem',
    },
    subtitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      color: brandConfig.colors.neutralGray,
      marginBottom: '2rem',
    },
    stepperContainer: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      marginBottom: '2rem',
    },
    demoContent: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      minHeight: '400px',
    },
    controlButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
    },
  };

  const renderRegistrationStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
        Client Registration Process
      </Typography>
      <Typography variant="body1" paragraph>
        Sarah Henderson is signing up for One Barn's AI monitoring service for her two horses at Windridge Stables.
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: brandConfig.colors.arenaSand }}>
            <Typography variant="h6" gutterBottom>Registration Details</Typography>
            <Typography><strong>Owner:</strong> Sarah Henderson</Typography>
            <Typography><strong>Email:</strong> sarah@windridgestables.com</Typography>
            <Typography><strong>Barn:</strong> Windridge Stables</Typography>
            <Typography><strong>Plan:</strong> Professional ($29/month per horse)</Typography>
            <Typography><strong>Horses:</strong> 2 (Thunder, Bella)</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: brandConfig.colors.arenaSand }}>
            <Typography variant="h6" gutterBottom>Features Included</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Chip label="24/7 AI Monitoring" color="primary" size="small" />
              <Chip label="Health Alerts" color="primary" size="small" />
              <Chip label="Behavior Analysis" color="primary" size="small" />
              <Chip label="Veterinary Reports" color="primary" size="small" />
              <Chip label="Mobile App Access" color="primary" size="small" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => setActiveStep(1)}
          sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
        >
          Continue to Camera Setup
        </Button>
      </Box>
    </Box>
  );

  const renderCameraSetupStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
        Camera Setup & Connection
      </Typography>
      <Typography variant="body1" paragraph>
        Sarah installs cameras in Thunder and Bella's stalls and connects them to the One Barn system.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <HorseIcon sx={{ mr: 1 }} />
              Thunder's Stall
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CameraAlt sx={{ mr: 1 }} />
              <Typography>Camera Status:</Typography>
              <Chip 
                label={cameraConnected ? "Connected" : "Connecting..."} 
                color={cameraConnected ? "success" : "warning"}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            {cameraConnected && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 1 }}>
                  AI Analysis Active - Monitoring Started
                </Alert>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: brandConfig.colors.sterlingSilver,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: brandConfig.colors.pastureSage
                    }
                  }}
                />
              </Box>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <HorseIcon sx={{ mr: 1 }} />
              Bella's Stall
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CameraAlt sx={{ mr: 1 }} />
              <Typography>Camera Status:</Typography>
              <Chip 
                label={cameraConnected ? "Connected" : "Connecting..."} 
                color={cameraConnected ? "success" : "warning"}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            {cameraConnected && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 1 }}>
                  AI Analysis Active - Monitoring Started
                </Alert>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: brandConfig.colors.sterlingSilver,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: brandConfig.colors.pastureSage
                    }
                  }}
                />
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {!cameraConnected ? (
          <Button
            variant="contained"
            endIcon={<CameraAlt />}
            onClick={handleCameraConnect}
            sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
          >
            Connect Cameras
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => setActiveStep(2)}
            sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
          >
            View Live Monitoring
          </Button>
        )}
      </Box>
    </Box>
  );

  const renderLiveMonitoringStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
        Live AI Monitoring
      </Typography>
      <Typography variant="body1" paragraph>
        One Barn's AI is now analyzing Sarah's horses 24/7, providing real-time insights and alerts.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Analytics sx={{ mr: 1 }} />
              Real-Time Analysis
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip 
                label="AI Status: Active" 
                color="success" 
                icon={<CheckCircle />}
              />
              <Chip 
                label={`Insights Generated: ${DEMO_CLIENT_DATA.totalInsights}`} 
                color="primary"
                icon={<TrendingUp />}
              />
            </Box>
            
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Recent AI Insights:
            </Typography>
            {simulatedAlerts.map((alert) => (
              <Alert key={alert.id} severity="info" sx={{ mb: 1 }}>
                {alert.message}
              </Alert>
            ))}
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Continuous monitoring active • {aiAnalysisActive ? 'Analyzing...' : 'Standby'}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <NotificationsActive sx={{ mr: 1 }} />
              Alert Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>This Week:</Typography>
                <Badge badgeContent={DEMO_CLIENT_DATA.alertsThisWeek} color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>High Priority:</Typography>
                <Badge badgeContent={0} color="error" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Medium Priority:</Typography>
                <Badge badgeContent={1} color="warning" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Low Priority:</Typography>
                <Badge badgeContent={2} color="info" />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          endIcon={<Dashboard />}
          onClick={() => setActiveStep(3)}
          sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
        >
          View Client Dashboard
        </Button>
      </Box>
    </Box>
  );

  const renderDashboardStep = () => (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
        Client Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Sarah's personalized dashboard showing her horses' health, behavior, and AI-generated insights.
      </Typography>
      
      <Grid container spacing={3}>
        {DEMO_CLIENT_DATA.horses.map((horse) => (
          <Grid item xs={12} md={6} key={horse.id}>
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: brandConfig.colors.stableMahogany, mr: 2 }}>
                  <HorseIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{horse.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {horse.breed} • {horse.age} years • {horse.gender}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label={horse.healthStatus} 
                  size="small"
                  sx={{ backgroundColor: getHealthStatusColor(horse.healthStatus), color: 'white' }}
                />
                <Chip 
                  label={`${horse.activityLevel} Activity`} 
                  size="small"
                  color="primary"
                />
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>Recent AI Insights:</Typography>
              {horse.aiInsights.slice(0, 2).map((insight, index) => (
                <Alert key={index} severity="info" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  {insight}
                </Alert>
              ))}
              
              {horse.alerts.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Active Alerts:</Typography>
                  {horse.alerts.map((alert, index) => (
                    <Alert 
                      key={index} 
                      severity={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
                      sx={{ mb: 1, fontSize: '0.875rem' }}
                    >
                      {alert.message}
                    </Alert>
                  ))}
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          endIcon={<Visibility />}
          onClick={() => navigateTo('client-dashboard')}
          sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
        >
          Open Full Dashboard
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography sx={styles.title}>
          One Barn Client Journey Demo
        </Typography>
        <Typography sx={styles.subtitle}>
          Complete workflow from registration to live monitoring
        </Typography>
        
        <Box sx={styles.controlButtons}>
          <Button
            variant={isAutoPlaying ? "contained" : "outlined"}
            startIcon={isAutoPlaying ? <Pause /> : <PlayArrow />}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            {isAutoPlaying ? 'Pause Demo' : 'Auto-Play Demo'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setActiveStep(0);
              setIsAutoPlaying(false);
              setCameraConnected(false);
              setAiAnalysisActive(false);
              setSimulatedAlerts([]);
            }}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            Reset Demo
          </Button>
        </Box>
      </Box>

      <Paper sx={styles.stepperContainer}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {DEMO_STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: completed || active ? brandConfig.colors.stableMahogany : brandConfig.colors.sterlingSilver,
                      color: 'white',
                    }}
                  >
                    {completed ? <CheckCircle /> : step.icon}
                  </Box>
                )}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {step.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={styles.demoContent}>
        {activeStep === 0 && renderRegistrationStep()}
        {activeStep === 1 && renderCameraSetupStep()}
        {activeStep === 2 && renderLiveMonitoringStep()}
        {activeStep === 3 && renderDashboardStep()}
      </Paper>
    </Box>
  );
}; 