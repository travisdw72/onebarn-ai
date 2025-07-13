import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Alert,
  Button,
  LinearProgress,
  Avatar,
  IconButton
} from '@mui/material';
import { 
  Pets as DogIcon,
  Restaurant as FoodIcon,
  Bedtime as SleepIcon,
  DirectionsWalk as WalkIcon,
  Favorite as HealthIcon,
  Warning as AlertIcon,
  Videocam as CameraIcon,
  TrendingUp as TrendIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { seniorDogMonitorConfig, generateMockDogData, type IDogData } from '../../config/seniorDogMonitorConfig';

// ============================================================================
// SENIOR DOG MONITOR DASHBOARD
// ============================================================================

interface ISeniorDogMonitorProps {
  dogId?: string;
  tenantId: string;
}

export const SeniorDogMonitor: React.FC<ISeniorDogMonitorProps> = ({ 
  dogId = 'dog-001',
  tenantId 
}) => {
  const [dogData, setDogData] = useState<IDogData | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize with mock data (replace with real API calls)
  useEffect(() => {
    const data = generateMockDogData(dogId);
    setDogData(data);
    setIsLive(true);
    
    // Generate some sample alerts
    setActiveAlerts([
      {
        id: 'alert-001',
        type: 'mobility',
        severity: 'medium',
        message: 'Buddy appears to be walking stiffly this morning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        cameraLocation: 'Living Room'
      },
      {
        id: 'alert-002', 
        type: 'feeding',
        severity: 'low',
        message: 'Feeding was 15 minutes late today',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        cameraLocation: 'Kitchen'
      }
    ]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [dogId]);

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh'
    },
    header: {
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    dogAvatar: {
      width: 80,
      height: 80,
      backgroundColor: brandConfig.colors.stableMahogany,
      fontSize: '2rem'
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: isLive ? brandConfig.colors.hunterGreen : brandConfig.colors.errorRed
    },
    liveDot: {
      width: 12,
      height: 12,
      borderRadius: '50%',
      backgroundColor: isLive ? brandConfig.colors.hunterGreen : brandConfig.colors.errorRed,
      animation: isLive ? 'pulse 2s infinite' : 'none'
    },
    metricCard: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    metricHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    alertCard: {
      marginBottom: '1rem',
      borderLeft: `4px solid ${brandConfig.colors.alertAmber}`
    },
    cameraFeed: {
      width: '100%',
      height: '300px',
      backgroundColor: brandConfig.colors.midnightBlack,
      borderRadius: brandConfig.layout.borderRadius,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      color: brandConfig.colors.arenaSand
    },
    cameraOverlay: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: 'bold'
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = seniorDogMonitorConfig.styling.alertColors;
    switch (severity) {
      case 'critical': return colors.critical;
      case 'high': return colors.high;
      case 'medium': return colors.medium;
      case 'low': return colors.low;
      default: return colors.medium;
    }
  };

  const getMobilityScore = () => {
    if (!dogData) return 0;
    return Math.round(dogData.healthMetrics.mobility.overallMobility * 100);
  };

  const getCognitiveScore = () => {
    if (!dogData) return 0;
    const { recognition, responsiveness } = dogData.behavioralMetrics.cognitiveFunction;
    return Math.round(((recognition + responsiveness) / 2) * 100);
  };

  if (!dogData) {
    return <LinearProgress />;
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Avatar sx={styles.dogAvatar}>
            {seniorDogMonitorConfig.styling.icons.dog}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
              {dogData.dogName}
            </Typography>
            <Typography variant="body1" sx={{ color: brandConfig.colors.weatheredWood }}>
              {dogData.breed} • {dogData.age} years old • {dogData.weight} lbs
            </Typography>
          </Box>
        </Box>
        
        <Box sx={styles.liveIndicator}>
          <Box sx={styles.liveDot} />
          <Typography variant="body2" fontWeight="bold">
            {isLive ? 'LIVE MONITORING' : 'OFFLINE'}
          </Typography>
          <Typography variant="caption" sx={{ marginLeft: '1rem' }}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Live Camera Feed */}
        <Grid item xs={12} md={8}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <CameraIcon sx={{ color: brandConfig.colors.stableMahogany }} />
                <Typography variant="h6">Live Camera Feed - Living Room</Typography>
                <IconButton size="small">
                  <CameraIcon />
                </IconButton>
              </Box>
              
              <Box sx={styles.cameraFeed}>
                <Box sx={styles.cameraOverlay}>
                  🔴 LIVE
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <CameraIcon sx={{ fontSize: '4rem', marginBottom: '1rem' }} />
                  <Typography variant="h6">
                    Camera Feed Active
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    AI monitoring in progress...
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Alerts */}
        <Grid item xs={12} md={4}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <AlertIcon sx={{ color: brandConfig.colors.alertAmber }} />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              
              {activeAlerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  severity={alert.severity === 'critical' ? 'error' : alert.severity === 'high' ? 'warning' : 'info'}
                  sx={{ marginBottom: '1rem' }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', marginTop: '0.25rem' }}>
                    {alert.cameraLocation} • {alert.timestamp.toLocaleTimeString()}
                  </Typography>
                </Alert>
              ))}
              
              {activeAlerts.length === 0 && (
                <Typography variant="body2" sx={{ color: brandConfig.colors.hunterGreen, textAlign: 'center', padding: '2rem' }}>
                  ✅ All systems normal
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Health Metrics */}
        <Grid item xs={12} md={3}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <HealthIcon sx={{ color: brandConfig.colors.errorRed }} />
                <Typography variant="h6">Vital Signs</Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Heart Rate</Typography>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {dogData.healthMetrics.vitals.heartRate} BPM
                </Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Temperature</Typography>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {dogData.healthMetrics.vitals.temperature.toFixed(1)}°F
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2">Respiratory Rate</Typography>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {dogData.healthMetrics.vitals.respiratoryRate} /min
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Mobility Assessment */}
        <Grid item xs={12} md={3}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <WalkIcon sx={{ color: brandConfig.colors.infoBlue }} />
                <Typography variant="h6">Mobility</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Typography variant="h3" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {getMobilityScore()}%
                </Typography>
                <Typography variant="body2">Overall Mobility Score</Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Walking Gait</Typography>
                <Chip 
                  label={dogData.healthMetrics.mobility.walkingGait} 
                  color={dogData.healthMetrics.mobility.walkingGait === 'normal' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              
              <Box>
                <Typography variant="body2">Stair Climbing</Typography>
                <Chip 
                  label={dogData.healthMetrics.mobility.stairClimbing}
                  color={dogData.healthMetrics.mobility.stairClimbing === 'easy' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Activity */}
        <Grid item xs={12} md={3}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <TrendIcon sx={{ color: brandConfig.colors.hunterGreen }} />
                <Typography variant="h6">Activity</Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Daily Steps</Typography>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {dogData.activityMetrics.dailySteps.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Walk Duration</Typography>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {dogData.activityMetrics.walkDuration} min
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2">Energy Level</Typography>
                <Chip 
                  label={dogData.activityMetrics.energyLevel.replace('_', ' ')}
                  color={dogData.activityMetrics.energyLevel === 'high' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cognitive Health */}
        <Grid item xs={12} md={3}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
                  🧠 Cognitive Health
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Typography variant="h3" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {getCognitiveScore()}%
                </Typography>
                <Typography variant="body2">Cognitive Function Score</Typography>
              </Box>
              
              <Box sx={{ marginBottom: '1rem' }}>
                <Typography variant="body2">Recognition</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={dogData.behavioralMetrics.cognitiveFunction.recognition * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2">Responsiveness</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={dogData.behavioralMetrics.cognitiveFunction.responsiveness * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              {(dogData.behavioralMetrics.cognitiveFunction.confusion || 
                dogData.behavioralMetrics.cognitiveFunction.disorientation) && (
                <Alert severity="warning" sx={{ marginTop: '1rem' }}>
                  <Typography variant="caption">
                    Signs of cognitive changes detected
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Feeding Status */}
        <Grid item xs={12} md={6}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <FoodIcon sx={{ color: brandConfig.colors.alertAmber }} />
                <Typography variant="h6">Feeding & Nutrition</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Last Meal</Typography>
                  <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
                    {dogData.healthMetrics.feeding.schedule[1]} 
                  </Typography>
                  <Typography variant="caption">
                    {dogData.healthMetrics.feeding.mealSize.toFixed(1)} cups
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2">Water Consumption</Typography>
                  <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
                    {dogData.healthMetrics.feeding.waterConsumption} oz
                  </Typography>
                  <Typography variant="caption">Today</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ marginTop: '1rem' }}>
                <Typography variant="body2">Appetite</Typography>
                <Chip 
                  label={dogData.healthMetrics.feeding.appetite}
                  color={dogData.healthMetrics.feeding.appetite === 'excellent' || dogData.healthMetrics.feeding.appetite === 'good' ? 'success' : 'warning'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sleep Quality */}
        <Grid item xs={12} md={6}>
          <Card sx={styles.metricCard}>
            <CardContent>
              <Box sx={styles.metricHeader}>
                <SleepIcon sx={{ color: brandConfig.colors.infoBlue }} />
                <Typography variant="h6">Sleep & Rest</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Night Sleep</Typography>
                  <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
                    {dogData.healthMetrics.sleep.nightSleepHours} hours
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2">Naps Today</Typography>
                  <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
                    {dogData.healthMetrics.sleep.napCount}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ marginTop: '1rem' }}>
                <Typography variant="body2">Sleep Quality</Typography>
                <Chip 
                  label={dogData.healthMetrics.sleep.sleepQuality}
                  color={dogData.healthMetrics.sleep.sleepQuality === 'restful' ? 'success' : 'warning'}
                />
              </Box>
              
              <Typography variant="caption" sx={{ display: 'block', marginTop: '0.5rem' }}>
                Favorite spots: {dogData.healthMetrics.sleep.favoriteSleepSpots.join(', ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: brandConfig.colors.stableMahogany }}
          onClick={() => alert('🐕 Opening detailed health report...')}
        >
          View Full Health Report
        </Button>
        <Button 
          variant="outlined"
          sx={{ borderColor: brandConfig.colors.stableMahogany, color: brandConfig.colors.stableMahogany }}
          onClick={() => alert('📱 Would send alert to veterinarian...')}
        >
          Contact Veterinarian
        </Button>
        <Button 
          variant="outlined"
          sx={{ borderColor: brandConfig.colors.hunterGreen, color: brandConfig.colors.hunterGreen }}
          onClick={() => alert('📊 Opening analytics dashboard...')}
        >
          View Analytics
        </Button>
      </Box>
    </Box>
  );
}; 