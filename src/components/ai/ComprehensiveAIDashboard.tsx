// Comprehensive AI Training & Competition Dashboard
// Main command center for all AI capabilities

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  LinearProgress,
  Avatar,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  PlayCircle,
  Today,
  Psychology,
  Warning,
  FitnessCenter,
  Analytics,
  RecordVoiceOver,
  EmojiEvents,
  Leaderboard,
  TrendingUp,
  Lightbulb,
  MonitorHeart,
  Speed,
  GpsFixed,
  Rotate90DegreesCcw,
  Refresh,
  Settings,
  Fullscreen,
  NotificationsActive,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  FavoriteRounded,
  Terrain,
  Forest,
  SelfImprovement,
  DirectionsRun,
  SportsHockey,
  DirectionsCar,
  Agriculture,
  FilterList
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { 
  aiDashboardConfig, 
  getDashboardWidget, 
  getActiveAlerts,
  getFilteredDisciplines,
  getDisciplineFilterPresets,
  getCurrentFilterInfo,
  setDisciplineFilter
} from '../../config/aiDashboardConfig';
import type { IDashboardWidget, IActiveAlerts } from '../../config/aiDashboardConfig.interface';

interface IComprehensiveAIDashboardProps {
  className?: string;
}

export const ComprehensiveAIDashboard: React.FC<IComprehensiveAIDashboardProps> = ({
  className
}) => {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlerts, setActiveAlerts] = useState<IActiveAlerts>({ critical: 0, warning: 0, info: 0, total: 0 });
  const [autoRefresh, setAutoRefresh] = useState(aiDashboardConfig.layout.autoRefresh);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(aiDashboardConfig.layout.theme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [disciplineFilter, setDisciplineFilterState] = useState(aiDashboardConfig.disciplineFilters.activeFilter);

  // Get discipline filter presets and current filter info
  const filterPresets = getDisciplineFilterPresets();
  const currentFilterInfo = getCurrentFilterInfo();

  // Handle discipline filter change
  const handleDisciplineFilterChange = (filterName: string) => {
    setDisciplineFilter(filterName);
    setDisciplineFilterState(filterName);
  };

  // Sample data for demonstration
  const [dashboardData, setDashboardData] = useState({
    activeSessions: 3,
    todayStats: {
      sessions: 12,
      competitions: 2,
      alerts: 5,
      insights: 8
    },
    aiStatus: {
      status: 'operational' as const,
      providers: {
        openai: { status: 'active' as const, load: 45 },
        anthropic: { status: 'active' as const, load: 32 },
        grok: { status: 'standby' as const, load: 0 }
      },
      processing: {
        queue: 0,
        avgResponseTime: '1.2s'
      }
    },
    liveTraining: {
      barrelRacing: 2,
      dressage: 1,
      jumping: 0,
      teamRoping: 1,
      cutting: 0,
      reining: 0,
      calfRoping: 1,
      breakawayRoping: 0,
      eventing: 1,
      hunter: 0,
      westernPleasure: 0,
      endurance: 0,
      poloAndPolocrosse: 0,
      vaulting: 0,
      driving: 0,
      ranchWork: 1
    },
    realtimeMetrics: {
      timing: 15.42,
      heartRate: 36,
      technique: 87,
      aiConfidence: 94
    },
    coachingFeed: [
      { time: '5:14:28 PM', category: 'technique', message: 'Excellent turn execution - maintain this rhythm', confidence: 92 },
      { time: '5:14:15 PM', category: 'safety', message: 'Horse showing slight fatigue - consider break', confidence: 87 },
      { time: '5:13:58 PM', category: 'performance', message: 'Personal best pace detected!', confidence: 96 }
    ]
  });

  // Get filtered disciplines based on current filter
  const filteredDisciplines = getFilteredDisciplines(dashboardData.liveTraining);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (autoRefresh) {
      const refreshTimer = setInterval(() => {
        // Simulate data updates
        setActiveAlerts(getActiveAlerts());
        // In real implementation, this would fetch from API
      }, aiDashboardConfig.layout.refreshInterval);
      return () => clearInterval(refreshTimer);
    }
  }, [autoRefresh]);

  // Styles using brandConfig
  const styles = {
    dashboard: {
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh',
      padding: '2rem'
    },
    header: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: '1rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '2rem'
    },
    section: {
      marginBottom: '3rem'
    },
    widget: {
      height: '100%',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)'
      }
    },
    alertBadge: {
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.arenaSand
    },
    successMetric: {
      color: brandConfig.colors.successGreen
    },
    warningMetric: {
      color: brandConfig.colors.alertAmber
    },
    infoMetric: {
      color: brandConfig.colors.infoBlue
    }
  };

  // Widget Components
  const ActiveTrainingWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.successGreen }}><PlayCircle /></Avatar>}
        title={aiDashboardConfig.widgets.activeTraining.title}
        action={
          <Chip 
            label={`${dashboardData.activeSessions} Active`}
            color="success"
            size="small"
          />
        }
      />
      <CardContent>
        <Typography variant="h3" sx={{ color: brandConfig.colors.successGreen, fontWeight: 'bold' }}>
          {dashboardData.activeSessions}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Training sessions in progress
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" size="small" sx={{ mr: 1 }}>View All</Button>
          <Button variant="contained" size="small">Start New</Button>
        </Box>
      </CardContent>
    </Card>
  );

  const TodayStatsWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.ribbonBlue }}><Today /></Avatar>}
        title="Today's Activity"
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
              {dashboardData.todayStats.sessions}
            </Typography>
            <Typography variant="caption">Training Sessions</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.championGold }}>
              {dashboardData.todayStats.competitions}
            </Typography>
            <Typography variant="caption">Competitions</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.alertAmber }}>
              {dashboardData.todayStats.alerts}
            </Typography>
            <Typography variant="caption">AI Alerts</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.infoBlue }}>
              {dashboardData.todayStats.insights}
            </Typography>
            <Typography variant="caption">New Insights</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const AIStatusWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.championGold }}><Psychology /></Avatar>}
        title="AI System Status"
        action={
          <Chip 
            label={dashboardData.aiStatus.status.toUpperCase()}
            color="success"
            size="small"
          />
        }
      />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>AI Providers</Typography>
          {Object.entries(dashboardData.aiStatus.providers).map(([provider, data]) => (
            <Box key={provider} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ minWidth: 80, textTransform: 'capitalize' }}>
                {provider}:
              </Typography>
              <Chip 
                label={data.status}
                size="small"
                color={data.status === 'active' ? 'success' : 'default'}
                sx={{ mr: 1 }}
              />
              <Typography variant="caption">
                {data.load}% load
              </Typography>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="textSecondary">
          Queue: {dashboardData.aiStatus.processing.queue} | 
          Avg Response: {dashboardData.aiStatus.processing.avgResponseTime}
        </Typography>
      </CardContent>
    </Card>
  );

  const AlertSummaryWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={
          <Badge badgeContent={activeAlerts.total} color="error">
            <Avatar sx={{ backgroundColor: brandConfig.colors.alertAmber }}><Warning /></Avatar>
          </Badge>
        }
        title="Priority Alerts"
        action={
          <Button size="small" color="primary">View All</Button>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ color: brandConfig.colors.errorRed }}>
                {activeAlerts.critical}
              </Typography>
              <Typography variant="caption">Critical</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ color: brandConfig.colors.alertAmber }}>
                {activeAlerts.warning}
              </Typography>
              <Typography variant="caption">Warning</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" sx={{ color: brandConfig.colors.infoBlue }}>
                {activeAlerts.info}
              </Typography>
              <Typography variant="caption">Info</Typography>
            </Box>
          </Grid>
        </Grid>
        {activeAlerts.total > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {activeAlerts.critical > 0 ? 'Critical alerts require immediate attention!' : 
             'Review pending alerts to prevent escalation.'}
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const LiveTrainingWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.stableMahogany }}><FitnessCenter /></Avatar>}
        title="Live Training Sessions"
      />
      <CardContent>
        <Grid container spacing={2}>
          {Object.entries(filteredDisciplines).map(([discipline, count]) => {
            const disciplineConfig = aiDashboardConfig.widgets.activeSessions.disciplines?.[discipline];
            if (!disciplineConfig) return null;
            
            return (
              <Grid item xs={6} key={discipline}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: (count as number) > 0 ? `${disciplineConfig.color}20` : 'transparent' }}>
                  <Avatar sx={{ backgroundColor: disciplineConfig.color, mr: 1, width: 32, height: 32 }}>
                    {discipline === 'barrelRacing' && <Speed />}
                    {discipline === 'dressage' && <EmojiEvents />}
                    {discipline === 'jumping' && <TrendingUp />}
                    {discipline === 'teamRoping' && <GpsFixed />}
                    {discipline === 'cutting' && <Psychology />}
                    {discipline === 'reining' && <Rotate90DegreesCcw />}
                    {discipline === 'calfRoping' && <GpsFixed />}
                    {discipline === 'breakawayRoping' && <FavoriteRounded />}
                    {discipline === 'eventing' && <Terrain />}
                    {discipline === 'hunter' && <Forest />}
                    {discipline === 'westernPleasure' && <SelfImprovement />}
                    {discipline === 'endurance' && <DirectionsRun />}
                    {discipline === 'poloAndPolocrosse' && <SportsHockey />}
                    {discipline === 'vaulting' && <FitnessCenter />}
                    {discipline === 'driving' && <DirectionsCar />}
                    {discipline === 'ranchWork' && <Agriculture />}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: (count as number) > 0 ? 'bold' : 'normal' }}>
                      {discipline.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {count as number} active
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );

  const RealtimeMetricsWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.infoBlue }}><Analytics /></Avatar>}
        title="Real-time Performance"
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption">Current Time</Typography>
            <Typography variant="h4" sx={{ color: brandConfig.colors.championGold, fontFamily: 'monospace' }}>
              {dashboardData.realtimeMetrics.timing.toFixed(2)}s
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">Heart Rate</Typography>
            <Typography variant="h4" sx={{ color: dashboardData.realtimeMetrics.heartRate > 40 ? brandConfig.colors.alertAmber : brandConfig.colors.successGreen }}>
              {dashboardData.realtimeMetrics.heartRate}
            </Typography>
            <Typography variant="caption">bpm</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">Technique Score</Typography>
            <LinearProgress 
              variant="determinate" 
              value={dashboardData.realtimeMetrics.technique} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: `${brandConfig.colors.pastureSage}30`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: brandConfig.colors.successGreen
                }
              }}
            />
            <Typography variant="caption" sx={{ color: brandConfig.colors.successGreen }}>
              {dashboardData.realtimeMetrics.technique}%
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">AI Confidence</Typography>
            <LinearProgress 
              variant="determinate" 
              value={dashboardData.realtimeMetrics.aiConfidence} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: `${brandConfig.colors.ribbonBlue}30`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: brandConfig.colors.ribbonBlue
                }
              }}
            />
            <Typography variant="caption" sx={{ color: brandConfig.colors.ribbonBlue }}>
              {dashboardData.realtimeMetrics.aiConfidence}%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const CoachingFeedWidget = () => (
    <Card sx={styles.widget}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.successGreen }}><RecordVoiceOver /></Avatar>}
        title="AI Coaching Feed"
        action={
          <IconButton size="small">
            {soundEnabled ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
        }
      />
      <CardContent>
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          {dashboardData.coachingFeed.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 1, borderLeft: `3px solid ${
              item.category === 'safety' ? brandConfig.colors.errorRed :
              item.category === 'performance' ? brandConfig.colors.championGold :
              brandConfig.colors.infoBlue
            }`, backgroundColor: `${brandConfig.colors.arenaSand}50` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Chip 
                  label={item.category}
                  size="small"
                  color={
                    item.category === 'safety' ? 'error' :
                    item.category === 'performance' ? 'warning' : 'info'
                  }
                />
                <Typography variant="caption" color="textSecondary">
                  {item.time}
                </Typography>
              </Box>
              <Typography variant="body2">
                {item.message}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Confidence: {item.confidence}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={styles.dashboard} className={className}>
      {/* Dashboard Header */}
      <Card sx={styles.header}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {aiDashboardConfig.layout.title}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {aiDashboardConfig.layout.subtitle}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Last updated: {currentTime.toLocaleTimeString()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel sx={{ color: brandConfig.colors.arenaSand }}>Discipline Filter</InputLabel>
              <Select
                value={disciplineFilter}
                onChange={(e) => handleDisciplineFilterChange(e.target.value)}
                label="Discipline Filter"
                sx={{ 
                  color: brandConfig.colors.arenaSand,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: `${brandConfig.colors.arenaSand}50`
                  },
                  '& .MuiSvgIcon-root': {
                    color: brandConfig.colors.arenaSand
                  }
                }}
              >
                {Object.entries(filterPresets).map(([key, preset]) => (
                  <MenuItem key={key} value={key}>
                    <Box>
                      <Typography variant="body2">{preset.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {preset.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Chip 
              icon={<FilterList />}
              label={`${currentFilterInfo.disciplineCount} Disciplines`}
              variant="outlined"
              sx={{ 
                color: brandConfig.colors.arenaSand,
                borderColor: brandConfig.colors.arenaSand
              }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="default"
                />
              }
              label="Auto Refresh"
              sx={{ color: brandConfig.colors.arenaSand }}
            />
            
            <IconButton 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              sx={{ color: brandConfig.colors.arenaSand }}
            >
              {notificationsEnabled ? <NotificationsActive /> : <NotificationsOff />}
            </IconButton>
            
            <IconButton sx={{ color: brandConfig.colors.arenaSand }}>
              <Refresh />
            </IconButton>
            
            <IconButton sx={{ color: brandConfig.colors.arenaSand }}>
              <Settings />
            </IconButton>
          </Box>
        </Box>
      </Card>

      {/* Overview Section */}
      <Box sx={styles.section}>
        <Typography variant="h5" sx={{ mb: 2, color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
          Platform Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <ActiveTrainingWidget />
          </Grid>
          <Grid item xs={12} md={3}>
            <TodayStatsWidget />
          </Grid>
          <Grid item xs={12} md={3}>
            <AIStatusWidget />
          </Grid>
          <Grid item xs={12} md={3}>
            <AlertSummaryWidget />
          </Grid>
        </Grid>
      </Box>

      {/* Live Training Section */}
      <Box sx={styles.section}>
        <Typography variant="h5" sx={{ mb: 2, color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
          Live Training Sessions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <LiveTrainingWidget />
          </Grid>
          <Grid item xs={12} md={4}>
            <RealtimeMetricsWidget />
          </Grid>
          <Grid item xs={12} md={4}>
            <CoachingFeedWidget />
          </Grid>
        </Grid>
      </Box>

      {/* Competition Section */}
      <Box sx={styles.section}>
        <Typography variant="h5" sx={{ mb: 2, color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
          Competition & Results
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={styles.widget}>
              <CardHeader
                avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.championGold }}><EmojiEvents /></Avatar>}
                title="Live Competition Board"
                action={<Button variant="contained" size="small">Start Competition</Button>}
              />
              <CardContent>
                <Alert severity="info">
                  No active competitions. Ready to start timing system.
                </Alert>
                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="outlined" size="small">Barrel Racing</Button>
                  <Button variant="outlined" size="small">Team Roping</Button>
                  <Button variant="outlined" size="small">Cutting</Button>
                  <Button variant="outlined" size="small">Reining</Button>
                  <Button variant="outlined" size="small">Calf Roping</Button>
                  <Button variant="outlined" size="small">Breakaway</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={styles.widget}>
              <CardHeader
                avatar={<Avatar sx={{ backgroundColor: brandConfig.colors.ribbonBlue }}><Leaderboard /></Avatar>}
                title="Recent Results"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 4 }}>
                  No recent results to display
                </Typography>
                <Button variant="outlined" fullWidth size="small">
                  View All Results
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}; 