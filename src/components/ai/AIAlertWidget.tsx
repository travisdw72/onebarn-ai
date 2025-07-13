/**
 * AI Alert Widget Component
 * Compact alert widget for dashboard integration
 * 
 * @description Real-time AI alert monitoring widget with auto-refresh and acknowledgment capabilities
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Button, Badge,
  IconButton, Collapse, Alert, CircularProgress
} from '@mui/material';
import {
  ExpandMore, ExpandLess, Warning, Error, Notifications,
  CheckCircle, NotificationImportant, Refresh
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { aiDataVaultService } from '../../services/aiDataVaultService';

interface IAIAlertWidgetProps {
  tenantId: string;
  maxAlerts?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onViewFullDashboard?: () => void;
}

export const AIAlertWidget: React.FC<IAIAlertWidgetProps> = ({
  tenantId,
  maxAlerts = 5,
  autoRefresh = true,
  refreshInterval = 30000,
  onViewFullDashboard
}) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(loadAlerts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [tenantId, autoRefresh, refreshInterval]);

  const loadAlerts = async () => {
    try {
      const response = await aiDataVaultService.getActiveAlerts(tenantId, {
        limit: maxAlerts
      });
      
      if (response.success) {
        setAlerts(response.data.alerts || []);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to load AI alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await aiDataVaultService.acknowledgeAlert(
        alertId,
        'current-user@barn.com',
        tenantId,
        'Acknowledged via widget'
      );
      
      if (response.success) {
        loadAlerts();
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const getCriticalAlerts = () => alerts.filter(alert => alert.priorityLevel <= 2);
  
  const getHighPriorityIcon = (priorityLevel: number) => {
    if (priorityLevel === 1) return <Error sx={{ color: brandConfig.colors.errorRed }} />;
    if (priorityLevel === 2) return <Warning sx={{ color: brandConfig.colors.alertAmber }} />;
    return <NotificationImportant sx={{ color: brandConfig.colors.infoBlue }} />;
  };

  const formatAlertType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const styles = {
    widget: {
      border: alerts.length > 0 ? `2px solid ${brandConfig.colors.errorRed}40` : `1px solid ${brandConfig.colors.sterlingSilver}60`,
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: alerts.length > 0 ? `${brandConfig.colors.errorRed}05` : 'white'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: alerts.length > 0 ? `1px solid ${brandConfig.colors.errorRed}20` : `1px solid ${brandConfig.colors.sterlingSilver}20`
    },
    alertItem: {
      padding: '0.75rem',
      borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}20`,
      '&:last-child': {
        borderBottom: 'none'
      }
    },
    criticalBadge: {
      backgroundColor: brandConfig.colors.errorRed,
      color: 'white',
      fontWeight: brandConfig.typography.weightBold
    }
  };

  return (
    <Card sx={styles.widget}>
      {/* Header */}
      <Box sx={styles.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge 
            badgeContent={alerts.length} 
            color="error" 
            invisible={alerts.length === 0}
          >
            <Notifications sx={{ color: brandConfig.colors.stableMahogany }} />
          </Badge>
          <Typography sx={{
            fontWeight: brandConfig.typography.weightSemiBold,
            color: brandConfig.colors.stableMahogany
          }}>
            AI Alerts
          </Typography>
          {getCriticalAlerts().length > 0 && (
            <Chip
              label="CRITICAL"
              size="small"
              sx={styles.criticalBadge}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isLoading ? (
            <CircularProgress size={16} />
          ) : (
            <Typography variant="caption" color="textSecondary">
              {lastUpdate.toLocaleTimeString()}
            </Typography>
          )}
          
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Alert Summary */}
      {!isExpanded && alerts.length > 0 && (
        <Box sx={{ padding: '1rem' }}>
          <Alert 
            severity={getCriticalAlerts().length > 0 ? "error" : "warning"}
            action={
              <Button 
                size="small" 
                onClick={() => setIsExpanded(true)}
                sx={{ color: 'inherit' }}
              >
                View All
              </Button>
            }
          >
            {alerts.length} active alert(s) require attention
            {getCriticalAlerts().length > 0 && (
              <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightBold }}>
                {getCriticalAlerts().length} CRITICAL alert(s)
              </Typography>
            )}
          </Alert>
        </Box>
      )}

      {/* No Alerts State */}
      {!isExpanded && alerts.length === 0 && (
        <Box sx={{ padding: '1rem', textAlign: 'center' }}>
          <CheckCircle sx={{ color: brandConfig.colors.successGreen, marginBottom: '0.5rem' }} />
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '1rem' }}>
            No active AI alerts
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              console.log('View Full AI Dashboard clicked!', onViewFullDashboard);
              if (onViewFullDashboard) {
                setTimeout(() => {
                  onViewFullDashboard();
                }, 100);
              }
            }}
            sx={{
              borderColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.stableMahogany,
              '&:hover': {
                backgroundColor: brandConfig.colors.stableMahogany,
                color: 'white'
              }
            }}
          >
            View Full AI Dashboard
          </Button>
        </Box>
      )}

      {/* Detailed Alert List */}
      <Collapse in={isExpanded}>
        {alerts.length === 0 ? (
          <Box sx={{ 
            padding: '1.5rem', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <CheckCircle sx={{ color: brandConfig.colors.successGreen, fontSize: '3rem' }} />
            <Typography variant="h6" sx={{ color: brandConfig.colors.successGreen }}>
              All Clear! 🎉
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No active AI alerts.
            </Typography>
          </Box>
        ) : (
          <Box>
            {alerts.map((alert, index) => (
              <Box key={index} sx={styles.alertItem}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                    {getHighPriorityIcon(alert.priorityLevel)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: brandConfig.typography.weightSemiBold,
                        color: brandConfig.colors.stableMahogany
                      }}>
                        {formatAlertType(alert.alertType)}
                      </Typography>
                      
                      <Typography variant="caption" color="textSecondary">
                        {new Date(alert.alertTimestamp).toLocaleString()}
                      </Typography>
                      
                      {alert.observation?.horseId && (
                        <Typography variant="caption" sx={{ 
                          display: 'block', 
                          color: brandConfig.colors.hunterGreen
                        }}>
                          Horse: {alert.observation.horseId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Chip
                      label={`P${alert.priorityLevel}`}
                      size="small"
                      sx={{
                        backgroundColor: alert.priorityLevel <= 2 ? brandConfig.colors.errorRed : brandConfig.colors.alertAmber,
                        color: 'white',
                        minWidth: '32px'
                      }}
                    />
                    
                    {!alert.acknowledgedBy && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAcknowledgeAlert(alert.alertId)}
                        sx={{
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                          borderColor: brandConfig.colors.stableMahogany,
                          color: brandConfig.colors.stableMahogany,
                          '&:hover': {
                            backgroundColor: brandConfig.colors.stableMahogany,
                            color: 'white'
                          }
                        }}
                      >
                        ACK
                      </Button>
                    )}
                    
                    {alert.acknowledgedBy && (
                      <Typography variant="caption" sx={{ color: brandConfig.colors.successGreen }}>
                        ✓ ACK'd
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            
            {/* View All Button */}
            <Box sx={{ 
              padding: '1rem', 
              borderTop: `1px solid ${brandConfig.colors.sterlingSilver}20` 
            }}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  borderColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.stableMahogany,
                  '&:hover': {
                    backgroundColor: brandConfig.colors.stableMahogany,
                    color: 'white'
                  }
                }}
                onClick={() => {
                  console.log('View Full AI Dashboard clicked (expanded)!', onViewFullDashboard);
                  if (onViewFullDashboard) {
                    setTimeout(() => {
                      onViewFullDashboard();
                    }, 100);
                  }
                }}
              >
                View Full AI Dashboard
              </Button>
            </Box>
          </Box>
        )}
      </Collapse>
    </Card>
  );
}; 
