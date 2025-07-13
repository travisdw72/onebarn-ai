import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Tab,
  Tabs,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectItem,
  Switch,
  FormControlLabel,
  Fab,
  Badge,
  Tooltip,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Security,
  VideoLibrary,
  DeviceHub,
  Analytics,
  Warning,
  CheckCircle,
  PlayArrow,
  Stop,
  Pause,
  Settings,
  Shield,
  Visibility,
  Storage,
  Emergency,
  Notifications,
  TrendingUp,
  Speed,
  Timer,
  Psychology,
  MoreVert,
  Add
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { brandConfig } from '../../config/brandConfig';
import { aiTrainingConfig } from '../../config/aiTrainingConfig';
import { zeroTrustTrainingConfig } from '../../config/zeroTrustTrainingConfig';
import { TrainingSessionMonitor } from '../../components/training/TrainingSessionMonitor';
import { SecureTrainingVault } from '../../components/training/SecureTrainingVault';
import { ZeroTrustDeviceManager } from '../../components/training/ZeroTrustDeviceManager';
import { DataClassificationBanner } from '../../components/security/DataClassificationBanner';
import { PermissionGate } from '../../components/security/PermissionGate';
import { useTrainingSession } from '../../hooks/useTrainingSession';

interface IActiveSessions {
  id: string;
  disciplineType: string;
  participantName: string;
  participantType: 'horse' | 'rider';
  startTime: string;
  status: 'active' | 'paused';
  securityLevel: string;
  location: string;
}

interface ITrainingMetrics {
  totalSessions: number;
  activeSessions: number;
  completedToday: number;
  averageSessionTime: number;
  securityEvents: number;
  deviceHealth: number;
  aiInsights: number;
  complianceScore: number;
}

interface IQuickActions {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  requiresPermission: string;
  securityLevel: string;
}

export const TrainingDashboard: React.FC = () => {
  // URL parameters
  const navigate = useNavigate();
  const { facilityId = 'default_facility' } = useParams();

  // State Management
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeSessions, setActiveSessions] = useState<IActiveSessions[]>([]);
  const [trainingMetrics, setTrainingMetrics] = useState<ITrainingMetrics | null>(null);
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [deviceStatus, setDeviceStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Training Session Hook
  const trainingSession = useTrainingSession({
    disciplineType: selectedDiscipline,
    participantId: selectedParticipant,
    participantType: 'horse', // This should be dynamic
    autoSave: true,
    securityLevel: 'CONFIDENTIAL'
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [facilityId]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, facilityId]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Load active sessions
      const sessions: IActiveSessions[] = [
        {
          id: 'session_001',
          disciplineType: 'barrelRacing',
          participantName: 'Thunder - Mare',
          participantType: 'horse',
          startTime: '2024-01-16T10:30:00Z',
          status: 'active',
          securityLevel: 'CONFIDENTIAL',
          location: 'Arena 1'
        },
        {
          id: 'session_002',
          disciplineType: 'dressage',
          participantName: 'Midnight - Stallion',
          participantType: 'horse',
          startTime: '2024-01-16T09:45:00Z',
          status: 'paused',
          securityLevel: 'RESTRICTED',
          location: 'Arena 2'
        }
      ];
      setActiveSessions(sessions);

      // Load training metrics
      const metrics: ITrainingMetrics = {
        totalSessions: 247,
        activeSessions: sessions.length,
        completedToday: 8,
        averageSessionTime: 45, // minutes
        securityEvents: 2,
        deviceHealth: 94,
        aiInsights: 15,
        complianceScore: 98
      };
      setTrainingMetrics(metrics);

      // Load security alerts
      const alerts = [
        {
          id: 'alert_001',
          type: 'device_trust_low',
          severity: 'medium',
          message: 'Camera #3 trust score below threshold',
          timestamp: Date.now() - 300000 // 5 minutes ago
        },
        {
          id: 'alert_002',
          type: 'data_classification_upgrade',
          severity: 'low',
          message: 'Competition data detected - classification upgraded to RESTRICTED',
          timestamp: Date.now() - 600000 // 10 minutes ago
        }
      ];
      setSecurityAlerts(alerts);

      // Load device status
      const devices = [
        { id: 'cam_001', type: 'camera', status: 'online', trustScore: 95 },
        { id: 'cam_002', type: 'camera', status: 'maintenance', trustScore: 45 },
        { id: 'sensor_001', type: 'sensor', status: 'online', trustScore: 88 },
        { id: 'timer_001', type: 'timer', status: 'online', trustScore: 99 }
      ];
      setDeviceStatus(devices);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [facilityId]);

  // Quick Actions Configuration
  const quickActions: IQuickActions[] = [
    {
      id: 'new_session',
      title: 'Start New Session',
      description: 'Begin a new training session with AI monitoring',
      icon: <PlayArrow />,
      action: () => setSessionDialogOpen(true),
      requiresPermission: 'training_sessions',
      securityLevel: 'CONFIDENTIAL'
    },
    {
      id: 'view_vault',
      title: 'Secure Data Vault',
      description: 'Access encrypted training data and videos',
      icon: <Storage />,
      action: () => setSelectedTab(2),
      requiresPermission: 'training_data',
      securityLevel: 'RESTRICTED'
    },
    {
      id: 'device_manager',
      title: 'Device Security',
      description: 'Monitor and manage training equipment',
      icon: <DeviceHub />,
      action: () => setSelectedTab(3),
      requiresPermission: 'device_management',
      securityLevel: 'INTERNAL'
    },
    {
      id: 'analytics',
      title: 'AI Analytics',
      description: 'View performance insights and recommendations',
      icon: <Analytics />,
      action: () => navigate(`/training/${facilityId}/analytics`),
      requiresPermission: 'training_analytics',
      securityLevel: 'CONFIDENTIAL'
    }
  ];

  // Event Handlers
  const handleStartNewSession = useCallback(async () => {
    try {
      if (!selectedParticipant || selectedDiscipline === 'all') {
        throw new Error('Please select discipline and participant');
      }

      await trainingSession.actions.createSession();
      await trainingSession.actions.startSession();
      setSessionDialogOpen(false);
      
      // Refresh dashboard to show new session
      await loadDashboardData();

    } catch (error) {
      console.error('Failed to start new session:', error);
      alert('Failed to start session: ' + (error as Error).message);
    }
  }, [selectedParticipant, selectedDiscipline, trainingSession, loadDashboardData]);

  const handleEmergencyStop = useCallback(async () => {
    try {
      setEmergencyMode(true);
      
      // Stop all active sessions
      for (const session of activeSessions) {
        // This would call the appropriate service to stop each session
        console.log('Emergency stopping session:', session.id);
      }

      // Lock down all devices
      console.log('Locking down all training devices');

      // Notify security team
      console.log('Notifying emergency contacts');

      await loadDashboardData();

    } catch (error) {
      console.error('Emergency stop failed:', error);
    }
  }, [activeSessions, loadDashboardData]);

  const handleSessionAction = useCallback((sessionId: string, action: 'pause' | 'resume' | 'stop') => {
    console.log(`${action} session:`, sessionId);
    // Implementation would depend on the session management service
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSecurityEvent = useCallback((event: any) => {
    console.log('Security event received:', event);
    setSecurityAlerts(prev => [event, ...prev]);
  }, []);

  // Get discipline configuration
  const getDisciplineConfig = (disciplineType: string) => {
    return aiTrainingConfig.sessions.types[disciplineType as keyof typeof aiTrainingConfig.sessions.types];
  };

  // Get security level color
  const getSecurityLevelColor = (level: string) => {
    const config = zeroTrustTrainingConfig.dataClassification.levels[level as keyof typeof zeroTrustTrainingConfig.dataClassification.levels];
    return config?.color || brandConfig.colors.sterlingSilver;
  };

  // Format duration
  const formatDuration = (startTime: string): string => {
    const duration = Date.now() - new Date(startTime).getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  // Render Overview Tab
  const renderOverviewTab = () => (
    <Grid container spacing={3}>
      {/* Metrics Cards */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {trainingMetrics?.activeSessions || 0}
                </Typography>
                <Typography variant="body2">Active Sessions</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {trainingMetrics?.completedToday || 0}
                </Typography>
                <Typography variant="body2">Completed Today</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: trainingMetrics?.securityEvents === 0 ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber }}>
                  {trainingMetrics?.securityEvents || 0}
                </Typography>
                <Typography variant="body2">Security Events</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: brandConfig.colors.championGold }}>
                  {trainingMetrics?.complianceScore || 0}%
                </Typography>
                <Typography variant="body2">Compliance Score</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action) => (
                <Grid item xs={12} sm={6} key={action.id}>
                  <PermissionGate permission={action.requiresPermission} action="execute">
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: brandConfig.colors.arenaSand }
                      }}
                      onClick={action.action}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {action.icon}
                          <Typography variant="subtitle2">
                            {action.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                        <Chip 
                          label={action.securityLevel}
                          size="small"
                          sx={{ 
                            mt: 1,
                            backgroundColor: getSecurityLevelColor(action.securityLevel),
                            color: 'white'
                          }}
                        />
                      </CardContent>
                    </Card>
                  </PermissionGate>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Active Sessions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Active Training Sessions
            </Typography>
            {activeSessions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No active sessions
              </Typography>
            ) : (
              activeSessions.map((session) => (
                <Card key={session.id} variant="outlined" sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Box>
                        <Typography variant="subtitle2">
                          {session.participantName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getDisciplineConfig(session.disciplineType)?.title || session.disciplineType}
                        </Typography>
                        <Typography variant="caption">
                          Duration: {formatDuration(session.startTime)} • {session.location}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={session.status}
                          color={session.status === 'active' ? 'success' : 'warning'}
                          size="small"
                        />
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            setAnchorEl(e.currentTarget);
                            // Set selected session for menu actions
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Security Alerts */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Security Alerts
            </Typography>
            {securityAlerts.length === 0 ? (
              <Alert severity="success">
                <Typography>All systems secure - no active alerts</Typography>
              </Alert>
            ) : (
              securityAlerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  severity={alert.severity}
                  sx={{ mb: 1, '&:last-child': { mb: 0 } }}
                  action={
                    <Button size="small">
                      Resolve
                    </Button>
                  }
                >
                  {alert.message}
                  <Typography variant="caption" display="block">
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Main render
  return (
    <PermissionGate permission="training_dashboard" action="view">
      <Box sx={{ p: 3 }}>
        {/* Data Classification Banner */}
        <DataClassificationBanner 
          classification="CONFIDENTIAL"
          showWarning={securityAlerts.length > 0}
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
            EMERGENCY MODE ACTIVE - All training systems have been secured
          </Alert>
        )}

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Training Command Center
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Zero Trust AI-Powered Training Platform
            </Typography>
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto Refresh"
            />
            <Badge badgeContent={securityAlerts.length} color="error">
              <IconButton>
                <Notifications />
              </IconButton>
            </Badge>
            <IconButton onClick={() => loadDashboardData()}>
              <Settings />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab 
              icon={<Dashboard />} 
              label="Overview" 
              iconPosition="start"
            />
            <Tab 
              icon={<Timer />} 
              label={`Live Sessions (${activeSessions.length})`}
              iconPosition="start"
            />
            <Tab 
              icon={<Storage />} 
              label="Secure Vault" 
              iconPosition="start"
            />
            <Tab 
              icon={<DeviceHub />} 
              label="Device Security" 
              iconPosition="start"
            />
            <Tab 
              icon={<Analytics />} 
              label="AI Analytics" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {loading ? (
          <LinearProgress />
        ) : (
          <Box>
            {selectedTab === 0 && renderOverviewTab()}
            {selectedTab === 1 && activeSessions.length > 0 && (
              <TrainingSessionMonitor
                disciplineType={activeSessions[0].disciplineType as keyof typeof aiTrainingConfig.sessions.types}
                sessionId={activeSessions[0].id}
                participantId={activeSessions[0].participantName}
                participantType={activeSessions[0].participantType}
                onSecurityEvent={handleSecurityEvent}
              />
            )}
            {selectedTab === 2 && (
              <SecureTrainingVault
                userId="current_user_id"
                userRole="TRAINER"
                onDataAccess={(dataId, action) => console.log('Data access:', dataId, action)}
                onComplianceViolation={(violation) => console.log('Compliance violation:', violation)}
              />
            )}
            {selectedTab === 3 && (
              <ZeroTrustDeviceManager
                facilityId={facilityId}
                userId="current_user_id"
                userRole="TRAINER"
                onSecurityEvent={handleSecurityEvent}
                onDeviceAction={(deviceId, action) => console.log('Device action:', deviceId, action)}
              />
            )}
            {selectedTab === 4 && (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" gutterBottom>
                  AI Analytics Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advanced analytics and insights coming soon...
                </Typography>
              </Box>
            )}
          </Box>
        )}

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
          <Emergency />
        </Fab>

        {/* New Session Dialog */}
        <Dialog 
          open={sessionDialogOpen} 
          onClose={() => setSessionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Start New Training Session</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Discipline</InputLabel>
                  <Select
                    value={selectedDiscipline}
                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                  >
                    <SelectItem value="barrelRacing">Barrel Racing</SelectItem>
                    <SelectItem value="dressage">Dressage</SelectItem>
                    <SelectItem value="jumping">Show Jumping</SelectItem>
                    <SelectItem value="cutting">Cutting</SelectItem>
                    <SelectItem value="reining">Reining</SelectItem>
                    <SelectItem value="western">Western Training</SelectItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Participant</InputLabel>
                  <Select
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                  >
                    <SelectItem value="horse_001">Thunder - Mare</SelectItem>
                    <SelectItem value="horse_002">Midnight - Stallion</SelectItem>
                    <SelectItem value="horse_003">Lightning - Gelding</SelectItem>
                    <SelectItem value="rider_001">Sarah Johnson</SelectItem>
                    <SelectItem value="rider_002">Mike Rodriguez</SelectItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSessionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleStartNewSession}
              disabled={!selectedParticipant || selectedDiscipline === 'all'}
            >
              Start Session
            </Button>
          </DialogActions>
        </Dialog>

        {/* Session Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => {
            setAnchorEl(null);
            // Handle pause action
          }}>
            <Pause sx={{ mr: 1 }} />
            Pause Session
          </MenuItem>
          <MenuItem onClick={() => {
            setAnchorEl(null);
            // Handle stop action
          }}>
            <Stop sx={{ mr: 1 }} />
            Stop Session
          </MenuItem>
          <MenuItem onClick={() => {
            setAnchorEl(null);
            // Handle view details
          }}>
            <Visibility sx={{ mr: 1 }} />
            View Details
          </MenuItem>
        </Menu>
      </Box>
    </PermissionGate>
  );
};

export default TrainingDashboard; 