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
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { aiMonitorConfig } from '../../config/aiMonitorConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { AIAlertCard } from '../ai/AIAlertCard';
import { AlertSummaryCard } from '../ai/AlertSummaryCard';
import { MonitoringFilters } from '../ai/MonitoringFilters';
import { RealtimeIndicator } from '../ai/RealtimeIndicator';
import { PermissionGate, AIMonitoringGate } from '../security/PermissionGate';
import { DataClassificationBanner } from '../security/DataClassificationBanner';
import { useAIMonitoring } from '../../hooks/useAIMonitoring';
import { useZeroTrust } from '../security/ZeroTrustProvider';

interface IAIMonitorDashboardProps {
  maxHeight?: string;
  autoRefresh?: boolean;
  showFilters?: boolean;
  showSummary?: boolean;
  compactMode?: boolean;
}

export const AIMonitorDashboard: React.FC<IAIMonitorDashboardProps> = ({
  maxHeight = '800px',
  autoRefresh = true,
  showFilters = true,
  showSummary = true,
  compactMode = false
}) => {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  const { securityContext, riskScore, trustLevel, logSecurityEvent } = useZeroTrust();

  // AI Monitoring hook for data management
  const {
    alerts,
    alertSummary,
    isLoading,
    error,
    filters,
    pagination,
    isRealTimeConnected,
    lastUpdate,
    refreshAlerts,
    updateFilters,
    acknowledgAlert,
    escalateAlert,
    resolveAlert
  } = useAIMonitoring(tenantId);

  // Local state
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  // Configuration shortcuts
  const dashboardConfig = aiMonitorConfig.dashboard;
  const gridSettings = dashboardConfig.gridSettings;
  const securityConfig = aiMonitorConfig.security;

  // Effects
  useEffect(() => {
    // Log dashboard access
    logSecurityEvent({
      type: 'access',
      severity: 'info',
      resource: 'ai_monitor_dashboard',
      action: 'view',
      outcome: 'success',
      details: {
        filters: filters,
        trustLevel,
        riskScore
      },
      risk: 5,
      automated: true,
      acknowledged: false
    });
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !dashboardConfig.autoRefresh) return;

    const interval = setInterval(() => {
      refreshAlerts();
    }, dashboardConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, dashboardConfig.autoRefresh, dashboardConfig.refreshInterval, refreshAlerts]);

  // Event handlers
  const handleRefresh = useCallback(async () => {
    try {
      await refreshAlerts();
      showSnackbar('Dashboard refreshed successfully', 'success');
      
      logSecurityEvent({
        type: 'access',
        severity: 'info',
        resource: 'ai_monitor_dashboard',
        action: 'refresh',
        outcome: 'success',
        details: { timestamp: new Date().toISOString() },
        risk: 5,
        automated: false,
        acknowledged: false
      });
    } catch (error) {
      showSnackbar('Failed to refresh dashboard', 'error');
    }
  }, [refreshAlerts, logSecurityEvent]);

  const handleFilterToggle = useCallback(() => {
    setShowFiltersPanel(prev => !prev);
  }, []);

  const handleAlertAction = useCallback(async (
    alertId: string,
    action: 'acknowledge' | 'escalate' | 'resolve',
    payload?: any
  ) => {
    try {
      switch (action) {
        case 'acknowledge':
          await acknowledgAlert(alertId, payload?.comment || '', user?.id || 'unknown');
          showSnackbar(`Alert ${alertId} acknowledged`, 'success');
          break;
        case 'escalate':
          await escalateAlert(alertId, payload?.level || 'level2', payload?.reason || '', user?.id || 'unknown');
          showSnackbar(`Alert ${alertId} escalated`, 'warning');
          break;
        case 'resolve':
          await resolveAlert(alertId, user?.id || 'unknown', payload?.comment || '');
          showSnackbar(`Alert ${alertId} resolved`, 'success');
          break;
      }

      // Log the action
      logSecurityEvent({
        type: 'access',
        severity: 'info',
        resource: 'ai_alert',
        action: action,
        outcome: 'success',
        details: {
          alertId,
          payload,
          userId: user?.id
        },
        risk: 10,
        automated: false,
        acknowledged: false
      });

    } catch (error) {
      showSnackbar(`Failed to ${action} alert`, 'error');
      
      logSecurityEvent({
        type: 'access',
        severity: 'medium',
        resource: 'ai_alert',
        action: action,
        outcome: 'failure',
        details: {
          alertId,
          error: error.message,
          userId: user?.id
        },
        risk: 30,
        automated: false,
        acknowledged: false
      });
    }
  }, [acknowledgAlert, escalateAlert, resolveAlert, user, logSecurityEvent]);

  const handleAlertSelection = useCallback((alertId: string, selected: boolean) => {
    setSelectedAlerts(prev => 
      selected 
        ? [...prev, alertId]
        : prev.filter(id => id !== alertId)
    );
  }, []);

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  // Render helpers
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
        <DashboardIcon 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            marginRight: brandConfig.spacing.sm,
            fontSize: '2rem'
          }} 
        />
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold,
              marginBottom: brandConfig.spacing.xs
            }}
          >
            {dashboardConfig.title}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: brandConfig.colors.midnightBlack,
              fontFamily: brandConfig.typography.fontPrimary,
              fontSize: brandConfig.typography.fontSizeMd
            }}
          >
            {dashboardConfig.subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
        {/* Security indicator */}
        <Tooltip title={`Trust Level: ${trustLevel} | Risk Score: ${riskScore}`}>
          <Chip
            icon={<SecurityIcon />}
            label={`Security: ${trustLevel.toUpperCase()}`}
            color={trustLevel === 'high' ? 'success' : trustLevel === 'medium' ? 'warning' : 'error'}
            size="small"
            sx={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          />
        </Tooltip>

        {/* Real-time indicator */}
        <RealtimeIndicator
          connected={isRealTimeConnected}
          lastUpdate={lastUpdate}
          onReconnect={refreshAlerts}
        />

        {/* Filter toggle */}
        {showFilters && (
          <Tooltip title="Toggle Filters">
            <IconButton
              onClick={handleFilterToggle}
              sx={{
                color: showFiltersPanel ? brandConfig.colors.stableMahogany : brandConfig.colors.midnightBlack,
                backgroundColor: showFiltersPanel ? `${brandConfig.colors.stableMahogany}20` : 'transparent',
                '&:hover': {
                  backgroundColor: `${brandConfig.colors.stableMahogany}30`
                }
              }}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        )}

        {/* Refresh button */}
        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={handleRefresh}
            disabled={isLoading}
            sx={{
              color: brandConfig.colors.stableMahogany,
              '&:hover': {
                backgroundColor: `${brandConfig.colors.stableMahogany}20`
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderFiltersPanel = () => {
    if (!showFiltersPanel) return null;

    return (
      <Paper
        elevation={2}
        sx={{
          padding: brandConfig.spacing.lg,
          marginBottom: brandConfig.spacing.lg,
          backgroundColor: brandConfig.colors.arenaSand,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <MonitoringFilters
          filters={filters}
          onChange={updateFilters}
          onReset={() => updateFilters({})}
          compactMode={compactMode}
        />
      </Paper>
    );
  };

  const renderLoadingState = () => (
    <Box sx={{ width: '100%', marginBottom: brandConfig.spacing.md }}>
      <LinearProgress
        sx={{
          backgroundColor: `${brandConfig.colors.stableMahogany}20`,
          '& .MuiLinearProgress-bar': {
            backgroundColor: brandConfig.colors.stableMahogany
          }
        }}
      />
    </Box>
  );

  const renderErrorState = () => (
    <Alert
      severity="error"
      sx={{
        marginBottom: brandConfig.spacing.lg,
        backgroundColor: `${brandConfig.colors.errorRed}10`,
        color: brandConfig.colors.midnightBlack,
        '& .MuiAlert-icon': {
          color: brandConfig.colors.errorRed
        }
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
        Dashboard Error
      </Typography>
      <Typography variant="body2">
        {error || 'Failed to load monitoring data. Please try refreshing the page.'}
      </Typography>
    </Alert>
  );

  const renderDashboardContent = () => (
    <Grid container spacing={gridSettings.spacing} sx={{ marginTop: brandConfig.spacing.sm }}>
      {/* Summary Card */}
      {showSummary && (
        <Grid item xs={12} md={compactMode ? 6 : 4}>
          <PermissionGate
            resource="ai_alerts"
            action="read"
            requiredTrustLevel="low"
            maxRiskScore={80}
          >
            <AlertSummaryCard
              summary={alertSummary}
              isLoading={isLoading}
              onFilterChange={updateFilters}
            />
          </PermissionGate>
        </Grid>
      )}

      {/* Alert Cards */}
      {alerts.map((alert) => (
        <Grid 
          key={alert.id} 
          item 
          xs={gridSettings.columns.xs} 
          sm={gridSettings.columns.sm} 
          md={gridSettings.columns.md} 
          lg={gridSettings.columns.lg} 
          xl={gridSettings.columns.xl}
        >
          <AIMonitoringGate action="read">
            <AIAlertCard
              alert={alert}
              selected={selectedAlerts.includes(alert.id)}
              onSelect={(selected) => handleAlertSelection(alert.id, selected)}
              onAction={(action, payload) => handleAlertAction(alert.id, action, payload)}
              compactMode={compactMode}
              showDataClassification={securityConfig.enabled}
            />
          </AIMonitoringGate>
        </Grid>
      ))}

      {/* Empty state */}
      {alerts.length === 0 && !isLoading && (
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              padding: brandConfig.spacing.xl,
              textAlign: 'center',
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <DashboardIcon
              sx={{
                fontSize: '4rem',
                color: brandConfig.colors.sterlingSilver,
                marginBottom: brandConfig.spacing.md
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: brandConfig.colors.midnightBlack,
                fontFamily: brandConfig.typography.fontDisplay,
                marginBottom: brandConfig.spacing.sm
              }}
            >
              No Alerts Available
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: brandConfig.colors.sterlingSilver,
                fontFamily: brandConfig.typography.fontPrimary
              }}
            >
              All horses are showing normal behavior patterns.
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <AIMonitoringGate>
      <Box
        sx={{
          maxHeight,
          overflow: 'auto',
          padding: brandConfig.spacing.md,
          backgroundColor: brandConfig.colors.arenaSand,
          minHeight: '500px'
        }}
      >
        {/* Data Classification Banner */}
        {securityConfig.enabled && (
          <DataClassificationBanner
            level="confidential"
            compact={compactMode}
          />
        )}

        {/* Dashboard Header */}
        {renderDashboardHeader()}

        {/* Filters Panel */}
        {renderFiltersPanel()}

        {/* Loading State */}
        {isLoading && renderLoadingState()}

        {/* Error State */}
        {error && renderErrorState()}

        {/* Dashboard Content */}
        {!error && renderDashboardContent()}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{
              backgroundColor: brandConfig.colors.arenaSand,
              color: brandConfig.colors.midnightBlack,
              fontFamily: brandConfig.typography.fontPrimary
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </AIMonitoringGate>
  );
};

export default AIMonitorDashboard; 