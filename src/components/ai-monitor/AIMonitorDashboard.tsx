/**
 * AI Monitor Dashboard - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER AI MONITORING DASHBOARD
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This component provides comprehensive real-time monitoring of the automated
 * AI analysis workflow including photo capture, analysis, and reporting.
 * 
 * 🔄 CORE FEATURES:
 *     - Real-time system status monitoring
 *     - Live workflow execution tracking
 *     - Performance metrics and health monitoring
 *     - Alert management and notifications
 *     - Interactive controls for workflow management
 * 
 * 📊 BUSINESS PARTNER INTEGRATION:
 *     - Professional dashboard interface for demos
 *     - Real-time status updates and progress tracking
 *     - Comprehensive error handling and user feedback
 *     - Demo account validation and restrictions
 *     - Performance monitoring for optimization
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, professional presentation ready
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Alert,
  Snackbar,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
  PhotoCamera as CameraIcon,
  Psychology as AIIcon,
  Report as ReportIcon,
  Notifications as AlertIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CloudSync as SyncIcon,
  TrendingUp as TrendingUpIcon,
  Memory as MemoryIcon,
  Delete as CleanupIcon,
  Download as ExportIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useScheduler, useSchedulerStatus, useSchedulerAlerts, useSchedulerPerformance } from '../../hooks/useScheduler';
import { ISchedulerHookState, ISchedulerHookActions } from '../../hooks/useScheduler';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface IAIMonitorDashboardProps {
  maxHeight?: string;
  autoRefresh?: boolean;
  showControls?: boolean;
  showPerformanceMetrics?: boolean;
  compactMode?: boolean;
  demoMode?: boolean;
}

interface ISystemStatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  loading?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AIMonitorDashboard: React.FC<IAIMonitorDashboardProps> = ({
  maxHeight = '100vh',
  autoRefresh = true,
  showControls = true,
  showPerformanceMetrics = true,
  compactMode = false,
  demoMode = false
}) => {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  
  // Demo account validation
  const isDemoAccount = user?.email === 'demo@onebarnai.com' || demoMode;

  // Scheduler hooks for comprehensive monitoring
  const [schedulerState, schedulerActions] = useScheduler({
    refreshInterval: 5000,
    enableRealTimeUpdates: true,
    enablePerformanceMonitoring: true,
    enableDetailedLogging: true,
    showNotifications: true,
    enableDemoFeatures: isDemoAccount
  });
  
  const alerts = useSchedulerAlerts();
  const performance = useSchedulerPerformance();

  // Local state
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string>('status');
  
  // ═══════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const handleStartWorkflow = useCallback(async () => {
    try {
      await schedulerActions.startWorkflow();
      showSnackbar('💼 BUSINESS PARTNER: Automated workflow started successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to start workflow: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handleStopWorkflow = useCallback(async () => {
    try {
      await schedulerActions.stopWorkflow();
      showSnackbar('💼 BUSINESS PARTNER: Automated workflow stopped successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to stop workflow: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handleExecuteWorkflow = useCallback(async () => {
    try {
      const result = await schedulerActions.executeWorkflow();
      showSnackbar(`💼 BUSINESS PARTNER: Single workflow executed - ${result.status}`, 'success');
    } catch (error) {
      showSnackbar('Failed to execute workflow: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handleRefresh = useCallback(async () => {
    try {
      await schedulerActions.refreshStatus();
      showSnackbar('💼 BUSINESS PARTNER: Dashboard refreshed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to refresh dashboard: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handlePerformMaintenance = useCallback(async () => {
    try {
      await schedulerActions.performMaintenance();
      showSnackbar('💼 BUSINESS PARTNER: System maintenance completed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to perform maintenance: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handleStorageCleanup = useCallback(async () => {
    try {
      await schedulerActions.performCleanup();
      showSnackbar('💼 BUSINESS PARTNER: Storage cleanup completed successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to perform cleanup: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  const handleExportData = useCallback(async () => {
    try {
      const data = await schedulerActions.exportData('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-monitoring-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSnackbar('💼 BUSINESS PARTNER: Data exported successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to export data: ' + error.message, 'error');
    }
  }, [schedulerActions, showSnackbar]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // RENDER COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: System Status Card Component
   */
  const SystemStatusCard: React.FC<ISystemStatusCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color,
    trend,
    trendValue,
    loading = false
  }) => (
    <Card
      sx={{
        height: '100%',
        backgroundColor: brandConfig.colors.arenaSand,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
        borderRadius: brandConfig.layout.borderRadius,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 12px ${brandConfig.colors.sterlingSilver}`,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ padding: brandConfig.spacing.md }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: brandConfig.spacing.sm }}>
          <Box sx={{ color }}>{icon}</Box>
          {loading && <CircularProgress size={20} sx={{ color }} />}
        </Box>
        
        <Typography
          variant="h4"
          sx={{
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            fontWeight: brandConfig.typography.weightBold,
            marginBottom: brandConfig.spacing.xs
          }}
        >
          {loading ? '...' : value}
        </Typography>
        
        <Typography
          variant="subtitle1"
          sx={{
            color: brandConfig.colors.midnightBlack,
            fontFamily: brandConfig.typography.fontPrimary,
            marginBottom: brandConfig.spacing.xs
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: brandConfig.colors.charcoalGray,
              fontFamily: brandConfig.typography.fontPrimary
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {trend && trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: brandConfig.spacing.xs }}>
            <TrendingUpIcon 
              sx={{ 
                fontSize: '1rem', 
                marginRight: brandConfig.spacing.xs,
                color: trend === 'up' ? brandConfig.colors.hunterGreen : 
                       trend === 'down' ? brandConfig.colors.burgundyRed : brandConfig.colors.charcoalGray,
                transform: trend === 'down' ? 'rotate(180deg)' : 'none'
              }} 
            />
            <Typography variant="caption" sx={{ color }}>{trendValue}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
  
  /**
   * 💼 BUSINESS PARTNER: Dashboard Header
   */
  const renderDashboardHeader = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: brandConfig.spacing.lg,
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.arenaSand,
        borderRadius: brandConfig.layout.borderRadius,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AIIcon 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            marginRight: brandConfig.spacing.sm,
            fontSize: '2.5rem'
          }} 
        />
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold,
              marginBottom: brandConfig.spacing.xs
            }}
          >
            💼 BUSINESS PARTNER: AI Monitoring Dashboard
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: brandConfig.colors.midnightBlack,
              fontFamily: brandConfig.typography.fontPrimary
            }}
          >
            Real-time AI analysis workflow monitoring • Phase 2 Integration
          </Typography>
          {schedulerState.demo.isDemo && (
            <Chip
              label="DEMO MODE - Enhanced Features Enabled"
              icon={<InfoIcon />}
              sx={{
                marginTop: brandConfig.spacing.xs,
                backgroundColor: brandConfig.colors.pastelYellow,
                color: brandConfig.colors.stableMahogany,
                fontWeight: brandConfig.typography.weightBold
              }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={handleRefresh}
            disabled={schedulerState.isLoading}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Export Data">
          <IconButton 
            onClick={handleExportData}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            <ExportIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="System Settings">
          <IconButton 
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  /**
   * 💼 BUSINESS PARTNER: Workflow Control Panel
   */
  const renderWorkflowControls = () => (
    <Card
        sx={{
          marginBottom: brandConfig.spacing.lg,
          backgroundColor: brandConfig.colors.arenaSand,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
      <CardContent sx={{ padding: brandConfig.spacing.md }}>
        <Typography
          variant="h5"
          sx={{
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            fontWeight: brandConfig.typography.weightBold,
            marginBottom: brandConfig.spacing.md,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ScheduleIcon sx={{ marginRight: brandConfig.spacing.sm }} />
          Automated Workflow Control
        </Typography>
        
        <Box sx={{ display: 'flex', gap: brandConfig.spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={schedulerState.isRunning ? <StopIcon /> : <PlayIcon />}
            onClick={schedulerState.isRunning ? handleStopWorkflow : handleStartWorkflow}
            disabled={schedulerState.isLoading}
            sx={{
              backgroundColor: schedulerState.isRunning ? brandConfig.colors.burgundyRed : brandConfig.colors.hunterGreen,
              color: brandConfig.colors.arenaSand,
              fontWeight: brandConfig.typography.weightBold,
              '&:hover': {
                backgroundColor: schedulerState.isRunning ? brandConfig.colors.burgundyRed : brandConfig.colors.hunterGreen,
                opacity: 0.9
              }
            }}
          >
            {schedulerState.isRunning ? 'Stop Workflow' : 'Start Workflow'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<CameraIcon />}
            onClick={handleExecuteWorkflow}
            disabled={schedulerState.isLoading}
            sx={{
              borderColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.stableMahogany,
              fontWeight: brandConfig.typography.weightBold,
              '&:hover': {
                backgroundColor: brandConfig.colors.stableMahogany,
                color: brandConfig.colors.arenaSand
              }
            }}
          >
            Execute Single Workflow
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<MemoryIcon />}
            onClick={handlePerformMaintenance}
            disabled={schedulerState.isLoading}
            sx={{
              borderColor: brandConfig.colors.charcoalGray,
              color: brandConfig.colors.charcoalGray,
              fontWeight: brandConfig.typography.weightBold,
              '&:hover': {
                backgroundColor: brandConfig.colors.charcoalGray,
                color: brandConfig.colors.arenaSand
              }
            }}
          >
            Perform Maintenance
          </Button>
          
          {schedulerState.storage.cleanupRecommended && (
            <Button
              variant="outlined"
              startIcon={<CleanupIcon />}
              onClick={handleStorageCleanup}
              disabled={schedulerState.isLoading}
              sx={{
                borderColor: brandConfig.colors.pastelYellow,
                color: brandConfig.colors.stableMahogany,
                fontWeight: brandConfig.typography.weightBold,
                '&:hover': {
                  backgroundColor: brandConfig.colors.pastelYellow,
                  color: brandConfig.colors.stableMahogany
                }
              }}
            >
              Storage Cleanup
            </Button>
          )}
        </Box>
        
        {schedulerState.isLoading && (
          <Box sx={{ marginTop: brandConfig.spacing.md }}>
      <LinearProgress
        sx={{
                backgroundColor: brandConfig.colors.sterlingSilver,
          '& .MuiLinearProgress-bar': {
            backgroundColor: brandConfig.colors.stableMahogany
          }
        }}
      />
            <Typography 
              variant="caption" 
              sx={{ 
                color: brandConfig.colors.charcoalGray,
                marginTop: brandConfig.spacing.xs,
                display: 'block'
              }}
            >
              Processing workflow operation...
            </Typography>
    </Box>
        )}
      </CardContent>
    </Card>
  );
  
  /**
   * 💼 BUSINESS PARTNER: System Status Overview
   */
  const renderSystemStatus = () => (
    <Grid container spacing={brandConfig.spacing.md} sx={{ marginBottom: brandConfig.spacing.lg }}>
      <Grid item xs={12} sm={6} md={3}>
        <SystemStatusCard
          title="System Health"
          value={`${Math.round(schedulerState.realTimeStats.systemHealth)}%`}
          subtitle="Overall system performance"
          icon={<SpeedIcon sx={{ fontSize: '2rem' }} />}
          color={schedulerState.realTimeStats.systemHealth > 80 ? brandConfig.colors.hunterGreen : 
                 schedulerState.realTimeStats.systemHealth > 60 ? brandConfig.colors.pastelYellow : 
                 brandConfig.colors.burgundyRed}
          trend="up"
          trendValue="Stable"
          loading={schedulerState.isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SystemStatusCard
          title="Total Workflows"
          value={schedulerState.realTimeStats.totalWorkflows.toString()}
          subtitle="Successfully completed"
          icon={<TimelineIcon sx={{ fontSize: '2rem' }} />}
          color={brandConfig.colors.stableMahogany}
          trend="up"
          trendValue={`${schedulerState.realTimeStats.successfulWorkflows} successful`}
          loading={schedulerState.isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SystemStatusCard
          title="Storage Usage"
          value={`${Math.round(schedulerState.storage.usagePercentage)}%`}
          subtitle={`${schedulerState.storage.totalReports} reports, ${schedulerState.storage.totalPhotos} photos`}
          icon={<StorageIcon sx={{ fontSize: '2rem' }} />}
          color={schedulerState.storage.usagePercentage > 80 ? brandConfig.colors.burgundyRed : 
                 schedulerState.storage.usagePercentage > 60 ? brandConfig.colors.pastelYellow : 
                 brandConfig.colors.hunterGreen}
          trend={schedulerState.storage.cleanupRecommended ? "up" : "stable"}
          trendValue={schedulerState.storage.cleanupRecommended ? "Cleanup recommended" : "Normal"}
          loading={schedulerState.isLoading}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <SystemStatusCard
          title="Active Alerts"
          value={schedulerState.unacknowledgedAlerts.toString()}
          subtitle={`${schedulerState.criticalAlerts} critical alerts`}
          icon={<AlertIcon sx={{ fontSize: '2rem' }} />}
          color={schedulerState.criticalAlerts > 0 ? brandConfig.colors.burgundyRed : 
                 schedulerState.unacknowledgedAlerts > 0 ? brandConfig.colors.pastelYellow : 
                 brandConfig.colors.hunterGreen}
          trend={schedulerState.unacknowledgedAlerts > 0 ? "up" : "stable"}
          trendValue={schedulerState.unacknowledgedAlerts > 0 ? "Requires attention" : "All clear"}
          loading={schedulerState.isLoading}
        />
      </Grid>
    </Grid>
  );
  
  /**
   * 💼 BUSINESS PARTNER: Performance Metrics
   */
  const renderPerformanceMetrics = () => (
    <Card
      sx={{
        marginBottom: brandConfig.spacing.lg,
        backgroundColor: brandConfig.colors.arenaSand,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
        borderRadius: brandConfig.layout.borderRadius
      }}
    >
      <CardContent sx={{ padding: brandConfig.spacing.md }}>
        <Typography
          variant="h5"
          sx={{
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            fontWeight: brandConfig.typography.weightBold,
            marginBottom: brandConfig.spacing.md,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AssessmentIcon sx={{ marginRight: brandConfig.spacing.sm }} />
          Performance Metrics
        </Typography>
        
        <Grid container spacing={brandConfig.spacing.md}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                {Math.round(schedulerState.performance.successRate * 100)}%
              </Typography>
              <Typography variant="subtitle2" sx={{ color: brandConfig.colors.charcoalGray }}>
                Success Rate
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                {Math.round(schedulerState.performance.endToEndTime / 1000)}s
              </Typography>
              <Typography variant="subtitle2" sx={{ color: brandConfig.colors.charcoalGray }}>
                Avg Processing Time
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                {Math.round(schedulerState.performance.throughput)}
      </Typography>
              <Typography variant="subtitle2" sx={{ color: brandConfig.colors.charcoalGray }}>
                Workflows/Hour
      </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                {Math.round(schedulerState.performance.errorRate * 100)}%
              </Typography>
              <Typography variant="subtitle2" sx={{ color: brandConfig.colors.charcoalGray }}>
                Error Rate
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {schedulerState.realTimeStats.lastActivity && (
          <Box sx={{ marginTop: brandConfig.spacing.md, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: brandConfig.colors.charcoalGray }}>
              Last Activity: {new Date(schedulerState.realTimeStats.lastActivity).toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
  
  /**
   * 💼 BUSINESS PARTNER: Recent Alerts
   */
  const renderRecentAlerts = () => (
    <Card
      sx={{
        marginBottom: brandConfig.spacing.lg,
        backgroundColor: brandConfig.colors.arenaSand,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
        borderRadius: brandConfig.layout.borderRadius
      }}
    >
      <CardContent sx={{ padding: brandConfig.spacing.md }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: brandConfig.spacing.md }}>
          <Typography
            variant="h5"
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <AlertIcon sx={{ marginRight: brandConfig.spacing.sm }} />
            Recent Alerts
            {schedulerState.unacknowledgedAlerts > 0 && (
              <Badge badgeContent={schedulerState.unacknowledgedAlerts} color="error" sx={{ marginLeft: brandConfig.spacing.sm }} />
            )}
          </Typography>
          
          {schedulerState.unacknowledgedAlerts > 0 && (
            <Button
              size="small"
              onClick={() => alerts.acknowledgeAllAlerts()}
              sx={{
                color: brandConfig.colors.stableMahogany,
                textTransform: 'none'
              }}
            >
              Acknowledge All
            </Button>
          )}
        </Box>
        
        {schedulerState.alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', padding: brandConfig.spacing.lg }}>
            <SuccessIcon sx={{ fontSize: '3rem', color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }} />
            <Typography variant="h6" sx={{ color: brandConfig.colors.hunterGreen }}>
              No Active Alerts
            </Typography>
            <Typography variant="body2" sx={{ color: brandConfig.colors.charcoalGray }}>
              All systems operating normally
            </Typography>
          </Box>
        ) : (
          <List>
            {schedulerState.alerts.slice(0, 5).map((alert, index) => (
              <ListItem
                key={alert.id}
                sx={{
                  backgroundColor: alert.acknowledged ? 'transparent' : brandConfig.colors.lightSage,
                  borderRadius: brandConfig.layout.borderRadius,
                  marginBottom: brandConfig.spacing.xs,
                  border: `1px solid ${
                    alert.type === 'critical' ? brandConfig.colors.burgundyRed :
                    alert.type === 'warning' ? brandConfig.colors.pastelYellow :
                    brandConfig.colors.sterlingSilver
                  }`
                }}
              >
                <ListItemIcon>
                  {alert.type === 'critical' ? <ErrorIcon sx={{ color: brandConfig.colors.burgundyRed }} /> :
                   alert.type === 'warning' ? <WarningIcon sx={{ color: brandConfig.colors.pastelYellow }} /> :
                   <InfoIcon sx={{ color: brandConfig.colors.stableMahogany }} />}
                </ListItemIcon>
                
                <ListItemText
                  primary={alert.message}
                  secondary={new Date(alert.timestamp).toLocaleString()}
                  primaryTypographyProps={{
                    sx: { fontWeight: alert.acknowledged ? 'normal' : 'bold' }
                  }}
                />
                
                {!alert.acknowledged && (
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      onClick={() => alerts.acknowledgeAlert(alert.id)}
                      sx={{
                        color: brandConfig.colors.stableMahogany,
                        textTransform: 'none'
                      }}
                    >
                      Acknowledge
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════
  
  // Demo account validation
  if (!isDemoAccount) {
    return (
      <Box sx={{ padding: brandConfig.spacing.lg }}>
        <Alert severity="warning" sx={{ marginBottom: brandConfig.spacing.lg }}>
          <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
            💼 BUSINESS PARTNER: Demo Account Required
          </Typography>
          <Typography>
            AI Monitoring Dashboard features are currently available only for demo accounts.
            Please use the demo@onevault.ai account to access these features.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
      <Box
        sx={{
        padding: brandConfig.spacing.lg,
          maxHeight,
          overflow: 'auto',
        backgroundColor: brandConfig.colors.lightSage
        }}
      >
        {renderDashboardHeader()}

      {showControls && renderWorkflowControls()}

      {renderSystemStatus()}
      
      {showPerformanceMetrics && renderPerformanceMetrics()}
      
      {renderRecentAlerts()}

      {/* Error Display */}
      {schedulerState.error && (
        <Alert 
          severity="error" 
          sx={{ marginBottom: brandConfig.spacing.lg }}
          onClose={() => {
            // This would clear the error in the scheduler state
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
            💼 BUSINESS PARTNER ERROR
          </Typography>
          <Typography>{schedulerState.error}</Typography>
        </Alert>
      )}

      {/* Success/Info Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
          sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
  );
};

export default AIMonitorDashboard; 