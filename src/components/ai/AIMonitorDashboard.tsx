/**
 * AI Monitor Dashboard Component
 * Main dashboard for real-time AI monitoring with alert management
 * 
 * @description Complete monitoring dashboard following configuration-driven architecture
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Card, CardHeader, CardContent, Typography,
  Button, IconButton, Alert, AlertTitle, Stack, Chip,
  FormControl, Select, MenuItem, InputLabel, Tooltip,
  CircularProgress, Paper, Badge, Divider
} from '@mui/material';
import {
  Refresh, FilterList, Fullscreen, Timeline,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Configuration imports
import { aiMonitorConfig, getAlertSeverityConfig, getMonitoringSectionConfig } from '../../config/aiMonitorConfig';
import { brandConfig } from '../../config/brandConfig';

// Component imports
import { AIAlertCard } from './AIAlertCard';
import { MonitoringCard } from './MonitoringCard';
import { AlertSummaryCard } from './AlertSummaryCard';

// Interface imports
import type { IAIMonitorDashboardProps } from '../../interfaces/config/aiMonitorConfig.interface';

// Service imports
import { aiDataVaultService } from '../../services/aiDataVaultService';

export const AIMonitorDashboard: React.FC<IAIMonitorDashboardProps> = ({
  tenantId,
  horseId,
  autoRefresh = aiMonitorConfig.dashboard.autoRefresh,
  refreshInterval = aiMonitorConfig.dashboard.refreshInterval,
  initialFilters = {},
  onAlertAction
}) => {
  // State management
  const [alerts, setAlerts] = useState<any[]>([]);
  const [monitoringData, setMonitoringData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({
    timeRange: initialFilters.timeRange || aiMonitorConfig.filters.timeRange.default,
    severity: initialFilters.severity || 'all',
    category: initialFilters.category || 'all'
  });
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  // Load data function
  const loadData = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      
      // Load alerts and monitoring data in parallel
      const [alertsResponse, vitalSignsResponse, behaviorResponse, movementResponse, socialResponse] = 
        await Promise.all([
          aiDataVaultService.getActiveAlerts(tenantId, {
            limit: aiMonitorConfig.dashboard.maxAlertsDisplay,
            severity: filters.severity !== 'all' ? filters.severity : undefined,
            category: filters.category !== 'all' ? filters.category : undefined,
            horseId
          }),
          aiDataVaultService.getMonitoringData(tenantId, 'vital_signs', {
            timeRange: filters.timeRange,
            horseId
          }),
          aiDataVaultService.getMonitoringData(tenantId, 'behavior', {
            timeRange: filters.timeRange,
            horseId
          }),
          aiDataVaultService.getMonitoringData(tenantId, 'movement', {
            timeRange: filters.timeRange,
            horseId
          }),
          aiDataVaultService.getMonitoringData(tenantId, 'social', {
            timeRange: filters.timeRange,
            horseId
          })
        ]);

      // Update state with responses
      if (alertsResponse.success) {
        setAlerts(alertsResponse.data.alerts || []);
      }

      const newMonitoringData = {
        vitalSigns: vitalSignsResponse.success ? vitalSignsResponse.data : {},
        behavior: behaviorResponse.success ? behaviorResponse.data : {},
        movement: movementResponse.success ? movementResponse.data : {},
        social: socialResponse.success ? socialResponse.data : {}
      };
      
      setMonitoringData(newMonitoringData);
      setLastUpdate(new Date());
      setConnectionStatus('connected');
      
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, horseId, filters]);

  // Auto-refresh effect
  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadData, autoRefresh, refreshInterval]);

  // Alert action handlers
  const handleAlertAction = async (alertId: string, action: string) => {
    try {
      if (action === 'acknowledge') {
        await aiDataVaultService.acknowledgeAlert(alertId, 'current-user@barn.com', tenantId);
        loadData(); // Refresh data after acknowledgment
      }
      
      // Call parent handler if provided
      if (onAlertAction) {
        onAlertAction(alertId, action);
      }
    } catch (error) {
      console.error(`Failed to ${action} alert:`, error);
    }
  };

  // Filter change handlers
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Helper functions
  const getCriticalAlerts = () => alerts.filter(alert => alert.severity === 'critical');
  const getWarningAlerts = () => alerts.filter(alert => alert.severity === 'warning');
  const getInfoAlerts = () => alerts.filter(alert => alert.severity === 'info');

  // Styles using configuration
  const styles = {
    container: {
      padding: aiMonitorConfig.layout.header.padding,
      backgroundColor: brandConfig.colors.arenaSand + '10',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: aiMonitorConfig.layout.header.backgroundColor,
      borderBottom: aiMonitorConfig.layout.header.borderBottom,
      padding: aiMonitorConfig.layout.header.padding,
      borderRadius: aiMonitorConfig.cards.monitoring.borderRadius,
      marginBottom: aiMonitorConfig.layout.alertSummary.marginBottom
    },
    alertSummarySection: {
      marginBottom: aiMonitorConfig.layout.alertSummary.marginBottom
    },
    monitoringGrid: {
      marginTop: '2rem'
    },
    filterControls: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    connectionStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: brandConfig.layout.borderRadius
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return brandConfig.colors.successGreen;
      case 'connecting': return brandConfig.colors.alertAmber;
      case 'disconnected': return brandConfig.colors.errorRed;
      default: return brandConfig.colors.sterlingSilver;
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Header Section */}
      <Paper sx={styles.header} elevation={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.stableMahogany,
                marginBottom: '0.5rem'
              }}
            >
              {aiMonitorConfig.text.headers.dashboard}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: brandConfig.colors.hunterGreen,
                fontFamily: brandConfig.typography.fontSecondary
              }}
            >
              {aiMonitorConfig.dashboard.subtitle}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Connection Status */}
            <Box sx={{
              ...styles.connectionStatus,
              backgroundColor: getConnectionStatusColor() + '20',
              border: `1px solid ${getConnectionStatusColor()}`
            }}>
              <Box 
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: getConnectionStatusColor()
                }}
              />
              <Typography variant="caption" sx={{ color: getConnectionStatusColor() }}>
                {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </Typography>
            </Box>

            {/* Last Update */}
            <Typography variant="caption" color="textSecondary">
              {aiMonitorConfig.text.tooltips.refresh}: {lastUpdate.toLocaleTimeString()}
            </Typography>

            {/* Refresh Button */}
            <Tooltip title={aiMonitorConfig.text.tooltips.refresh}>
              <IconButton 
                onClick={loadData} 
                disabled={isLoading}
                sx={{ color: brandConfig.colors.stableMahogany }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Filter Controls */}
        <Divider sx={{ margin: '1rem 0' }} />
        <Box sx={styles.filterControls}>
          <FilterList sx={{ color: brandConfig.colors.hunterGreen }} />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{aiMonitorConfig.text.tooltips.timeRange}</InputLabel>
            <Select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              label="Time Range"
            >
              {aiMonitorConfig.filters.timeRange.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              label="Severity"
            >
              {aiMonitorConfig.filters.severity.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              label="Category"
            >
              {aiMonitorConfig.filters.category.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Alert Summary Section */}
      <Box sx={styles.alertSummarySection}>
        <AlertSummaryCard
          criticalCount={getCriticalAlerts().length}
          warningCount={getWarningAlerts().length}
          infoCount={getInfoAlerts().length}
          totalCount={alerts.length}
        />
      </Box>

      {/* Active Alerts List */}
      {alerts.length > 0 && (
        <Card sx={{ marginBottom: '2rem' }}>
          <CardHeader
            avatar={
              <Badge badgeContent={alerts.length} color="error" invisible={alerts.length === 0}>
                <NotificationsIcon sx={{ color: brandConfig.colors.stableMahogany }} />
              </Badge>
            }
            title={
              <Typography sx={{ 
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold 
              }}>
                {aiMonitorConfig.text.headers.activeAlerts}
              </Typography>
            }
            action={
              <Button
                size="small"
                startIcon={<Timeline />}
                sx={{ color: brandConfig.colors.stableMahogany }}
              >
                {aiMonitorConfig.text.buttons.viewAll}
              </Button>
            }
          />
          <CardContent>
            <Stack spacing={2}>
              {alerts.slice(0, aiMonitorConfig.dashboard.maxAlertsDisplay).map((alert) => (
                <AIAlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={(alertId) => handleAlertAction(alertId, 'acknowledge')}
                  onViewDetails={(alertId) => handleAlertAction(alertId, 'viewDetails')}
                  onAction={handleAlertAction}
                  showActions={true}
                  compact={true}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Monitoring Grid */}
      <Box sx={styles.monitoringGrid}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightSemiBold,
            color: brandConfig.colors.stableMahogany,
            marginBottom: '1.5rem'
          }}
        >
          {aiMonitorConfig.text.headers.monitoringGrid}
        </Typography>

        <Grid container spacing={aiMonitorConfig.layout.grid.spacing}>
          {Object.keys(aiMonitorConfig.monitoring.sections).map((sectionKey) => {
            const section = getMonitoringSectionConfig(sectionKey);
            return (
              <Grid 
                item 
                xs={aiMonitorConfig.layout.grid.columns.xs}
                sm={aiMonitorConfig.layout.grid.columns.sm}
                md={aiMonitorConfig.layout.grid.columns.md}
                lg={aiMonitorConfig.layout.grid.columns.lg}
                xl={aiMonitorConfig.layout.grid.columns.xl}
                key={sectionKey}
              >
                <MonitoringCard
                  section={sectionKey as keyof typeof aiMonitorConfig.monitoring.sections}
                  data={monitoringData[sectionKey]}
                  isLoading={isLoading}
                  onRefresh={loadData}
                  showControls={true}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* No Alerts State */}
      {alerts.length === 0 && !isLoading && (
        <Alert 
          severity="success" 
          sx={{ 
            marginTop: '2rem',
            backgroundColor: brandConfig.colors.successGreen + '10',
            borderColor: brandConfig.colors.successGreen
          }}
        >
          <AlertTitle sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
            All Clear
          </AlertTitle>
          {aiMonitorConfig.text.messages.noAlerts}
        </Alert>
      )}
    </Box>
  );
}; 