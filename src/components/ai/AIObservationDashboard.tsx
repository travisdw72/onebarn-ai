/**
 * AI Observation Dashboard Component
 * Comprehensive dashboard for monitoring AI observations and alerts
 * 
 * @description Complete monitoring system for AI-detected horse behavior, health, and safety observations
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button, Grid,
  Alert, AlertTitle, CircularProgress, IconButton
} from '@mui/material';
import {
  Warning, Error, Info, CheckCircle,
  NotificationImportant, Refresh
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { aiDataVaultService } from '../../services/aiDataVaultService';

interface IAIObservationDashboardProps {
  tenantId: string;
  horseId?: string;
  cameraId?: string;
}

export const AIObservationDashboard: React.FC<IAIObservationDashboardProps> = ({
  tenantId,
  horseId,
  cameraId
}) => {
  const [observations, setObservations] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'observations' | 'alerts' | 'analytics'>('observations');

  useEffect(() => {
    loadData();
  }, [tenantId, horseId, cameraId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [obsResponse, alertsResponse, analyticsResponse] = await Promise.all([
        aiDataVaultService.getObservations({
          tenantId,
          horseId,
          cameraId
        }),
        aiDataVaultService.getActiveAlerts(tenantId),
        aiDataVaultService.getObservationAnalytics(tenantId, {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          groupBy: 'day'
        })
      ]);

      if (obsResponse.success) {
        setObservations(obsResponse.data.observations || []);
      }
      if (alertsResponse.success) {
        setActiveAlerts(alertsResponse.data.alerts || []);
      }
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load AI observation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency':
      case 'critical':
        return <Error sx={{ color: brandConfig.colors.errorRed }} />;
      case 'high':
        return <Warning sx={{ color: brandConfig.colors.alertAmber }} />;
      case 'medium':
        return <NotificationImportant sx={{ color: brandConfig.colors.infoBlue }} />;
      default:
        return <Info sx={{ color: brandConfig.colors.successGreen }} />;
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const response = await aiDataVaultService.acknowledgeAlert(
        alertId,
        'current-user@barn.com',
        tenantId,
        'Acknowledged via dashboard'
      );
      
      if (response.success) {
        loadData();
      }
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const formatObservationType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress sx={{ color: brandConfig.colors.stableMahogany }} />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '2rem' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Typography sx={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.stableMahogany
        }}>
          🤖 AI Observation & Alert Dashboard
        </Typography>

        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
          <IconButton
            onClick={loadData}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Active Alerts Summary */}
      {activeAlerts.length > 0 && (
        <Alert severity="warning" sx={{ marginBottom: '2rem' }}>
          <AlertTitle sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
            🚨 Active AI Alerts
          </AlertTitle>
          {activeAlerts.length} alert(s) require immediate attention. Review and acknowledge to prevent escalation.
        </Alert>
      )}

      {/* Tab Navigation */}
      <Box sx={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: `2px solid ${brandConfig.colors.sterlingSilver}20`
      }}>
        {['observations', 'alerts', 'analytics'].map((tab) => (
          <Button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            sx={{
              padding: '1rem 1.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: selectedTab === tab ? brandConfig.colors.stableMahogany : brandConfig.colors.hunterGreen,
              fontFamily: brandConfig.typography.fontSecondary,
              fontWeight: selectedTab === tab ? brandConfig.typography.weightSemiBold : brandConfig.typography.weightMedium,
              borderBottom: selectedTab === tab ? `3px solid ${brandConfig.colors.stableMahogany}` : '3px solid transparent',
              '&:hover': {
                backgroundColor: `${brandConfig.colors.stableMahogany}10`
              }
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'alerts' && activeAlerts.length > 0 && (
              <Chip
                label={activeAlerts.length}
                size="small"
                sx={{
                  marginLeft: '0.5rem',
                  backgroundColor: brandConfig.colors.errorRed,
                  color: 'white',
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              />
            )}
          </Button>
        ))}
      </Box>

      {/* Tab Content */}
      {selectedTab === 'observations' && (
        <Box>
          <Typography variant="h6" sx={{ 
            marginBottom: '1rem',
            color: brandConfig.colors.stableMahogany,
            fontWeight: brandConfig.typography.weightSemiBold
          }}>
            Recent AI Observations ({observations.length})
          </Typography>
          
          {observations.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <CheckCircle sx={{ color: brandConfig.colors.successGreen, fontSize: '3rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: brandConfig.colors.successGreen }}>
                      All Systems Normal 🎉
                    </Typography>
                    <Typography>
                      No unusual observations detected. All horses are within normal behavioral patterns.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {observations.map((observation, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ 
                    marginBottom: '1rem',
                    border: `1px solid ${brandConfig.colors.sterlingSilver}60`,
                    borderRadius: brandConfig.layout.borderRadius
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getSeverityIcon(observation.severityLevel)}
                          <Typography variant="h6">
                            {formatObservationType(observation.observationType)}
                          </Typography>
                        </Box>
                        <Chip
                          label={observation.severityLevel.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: `${brandConfig.colors.alertAmber}20`,
                            color: brandConfig.colors.alertAmber
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Confidence: {Math.round(observation.confidenceScore * 100)}%
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Horse ID: {observation.horseId} | Camera: {observation.cameraId}
                      </Typography>
                      
                      <Typography variant="caption" color="textSecondary">
                        {new Date(observation.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {selectedTab === 'alerts' && (
        <Box>
          <Typography variant="h6" sx={{ 
            marginBottom: '1rem',
            color: brandConfig.colors.stableMahogany,
            fontWeight: brandConfig.typography.weightSemiBold
          }}>
            Active AI Alerts ({activeAlerts.length})
          </Typography>
          
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <CheckCircle sx={{ color: brandConfig.colors.successGreen, fontSize: '3rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: brandConfig.colors.successGreen }}>
                      All Clear! 🎉
                    </Typography>
                    <Typography>
                      No active alerts. All AI observations are within normal parameters.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ) : (
            activeAlerts.map((alert, index) => (
              <Card key={index} sx={{ 
                marginBottom: '1rem',
                border: `2px solid ${brandConfig.colors.errorRed}40`,
                backgroundColor: `${brandConfig.colors.errorRed}05`
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: brandConfig.colors.errorRed }}>
                      🚨 {formatObservationType(alert.observation.observationType)}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleAcknowledgeAlert(alert.alertId)}
                      sx={{
                        backgroundColor: brandConfig.colors.successGreen,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: brandConfig.colors.successGreen
                        }
                      }}
                    >
                      Acknowledge
                    </Button>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {alert.observation.description || 'No description available'}
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    Horse: {alert.observation.horseName || alert.observation.horseId} | 
                    Severity: {alert.observation.severityLevel} | 
                    Confidence: {Math.round(alert.observation.confidenceScore * 100)}%
                  </Typography>
                  
                  <Typography variant="caption" color="textSecondary">
                    {new Date(alert.alertTimestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {selectedTab === 'analytics' && (
        <Box>
          <Typography variant="h6" sx={{ 
            marginBottom: '1rem',
            color: brandConfig.colors.stableMahogany,
            fontWeight: brandConfig.typography.weightSemiBold
          }}>
            AI Analytics Dashboard
          </Typography>
          
          {analytics ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
                      {analytics.summary?.totalObservations || 0}
                    </Typography>
                    <Typography variant="body2">Total Observations</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: brandConfig.colors.errorRed }}>
                      {analytics.summary?.alertsGenerated || 0}
                    </Typography>
                    <Typography variant="body2">Alerts Generated</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: brandConfig.colors.successGreen }}>
                      {analytics.summary?.acknowledgedCount || 0}
                    </Typography>
                    <Typography variant="body2">Acknowledged</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
                      {Math.round((analytics.summary?.avgConfidenceScore || 0) * 100)}%
                    </Typography>
                    <Typography variant="body2">Avg Confidence</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography>Loading analytics...</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}; 