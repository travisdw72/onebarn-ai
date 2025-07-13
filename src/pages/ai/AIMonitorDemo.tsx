/**
 * AI Monitor Demo Page
 * Demo page showcasing the AI Monitor Dashboard implementation
 * 
 * @description Demonstration of configuration-driven AI monitoring with sample data
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState } from 'react';
import {
  Box, Container, Typography, Button, Stack, Paper,
  Chip, Alert, AlertTitle
} from '@mui/material';
import {
  PlayArrow, Stop, Settings, Info
} from '@mui/icons-material';

// Configuration imports
import { aiMonitorConfig } from '../../config/aiMonitorConfig';
import { brandConfig } from '../../config/brandConfig';

// Component imports
import { AIMonitorDashboard } from '../../components/ai/AIMonitorDashboard';
import { AIAlertCard } from '../../components/ai/AIAlertCard';

export const AIMonitorDemo: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTenant] = useState('demo-barn-001');

  // Sample alert data for demonstration
  const sampleAlerts = [
    {
      id: 'alert-001',
      type: 'vital_signs',
      severity: 'critical' as const,
      title: 'Elevated Heart Rate Detected',
      description: 'Thunder\'s heart rate has exceeded normal range for the past 15 minutes. Current reading: 52 bpm (normal: 28-44 bpm)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      horseId: 'horse-001',
      horseName: 'Thunder',
      isAcknowledged: false,
      metadata: {
        current_heart_rate: 52,
        normal_range: '28-44 bpm',
        duration: '15 minutes',
        location: 'Stall 12',
        camera_id: 'cam-012'
      }
    },
    {
      id: 'alert-002',
      type: 'behavior',
      severity: 'warning' as const,
      title: 'Unusual Feeding Behavior',
      description: 'Spirit has shown reduced feeding activity over the past 2 hours. May indicate stress or health concern.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      horseId: 'horse-002',
      horseName: 'Spirit',
      isAcknowledged: false,
      metadata: {
        feeding_reduction: '40%',
        time_period: '2 hours',
        last_meal: '6:00 AM',
        location: 'Paddock A'
      }
    },
    {
      id: 'alert-003',
      type: 'movement',
      severity: 'info' as const,
      title: 'Movement Pattern Change',
      description: 'Blaze has increased activity levels by 25% compared to typical daily patterns.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      horseId: 'horse-003',
      horseName: 'Blaze',
      isAcknowledged: true,
      acknowledgedBy: 'trainer@demobarn.com',
      acknowledgedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      metadata: {
        activity_increase: '25%',
        typical_daily_steps: '3,200',
        current_steps: '4,000',
        location: 'Training Arena'
      }
    }
  ];

  // Handle alert actions
  const handleAlertAction = (alertId: string, action: string) => {
    console.log(`Demo: ${action} action triggered for alert ${alertId}`);
    // In a real implementation, this would call the appropriate service
  };

  // Toggle simulation
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    console.log(`Demo: AI monitoring simulation ${!isSimulating ? 'started' : 'stopped'}`);
  };

  // Styles using configuration
  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: brandConfig.colors.arenaSand + '20',
      minHeight: '100vh'
    },
    demoHeader: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '2rem',
      border: `2px solid ${brandConfig.colors.stableMahogany}20`
    },
    alertSamples: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '2rem',
      border: `1px solid ${brandConfig.colors.hunterGreen}30`
    },
    demoControls: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      marginTop: '1rem'
    }
  };

  return (
    <Container maxWidth="xl" sx={styles.container}>
      {/* Demo Header */}
      <Paper sx={styles.demoHeader} elevation={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography sx={{
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold,
              fontSize: brandConfig.typography.fontSize3xl,
              color: brandConfig.colors.stableMahogany,
              marginBottom: '0.5rem'
            }}>
              🤖 AI Monitor Dashboard Demo
            </Typography>
            <Typography sx={{
              fontFamily: brandConfig.typography.fontSecondary,
              fontSize: brandConfig.typography.fontSizeLg,
              color: brandConfig.colors.hunterGreen,
              marginBottom: '1rem'
            }}>
              Configuration-driven AI monitoring system with MUI components
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Configuration-Driven"
                sx={{
                  backgroundColor: brandConfig.colors.championGold,
                  color: 'white',
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              />
              <Chip
                label="MUI Components"
                sx={{
                  backgroundColor: brandConfig.colors.ribbonBlue,
                  color: 'white',
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              />
              <Chip
                label="Real-time Updates"
                sx={{
                  backgroundColor: brandConfig.colors.pastureSage,
                  color: 'white',
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              />
            </Stack>
          </Box>

          <Box sx={styles.demoControls}>
            <Chip
              label={isSimulating ? 'LIVE DEMO' : 'DEMO MODE'}
              size="medium"
              sx={{
                backgroundColor: isSimulating ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber,
                color: 'white',
                fontWeight: brandConfig.typography.weightBold,
                fontSize: brandConfig.typography.fontSizeSm
              }}
            />
            <Button
              variant={isSimulating ? "outlined" : "contained"}
              color={isSimulating ? "error" : "primary"}
              startIcon={isSimulating ? <Stop /> : <PlayArrow />}
              onClick={toggleSimulation}
              sx={{
                backgroundColor: isSimulating ? undefined : brandConfig.colors.stableMahogany,
                '&:hover': {
                  backgroundColor: isSimulating ? undefined : brandConfig.colors.stableMahogany + 'CC'
                }
              }}
            >
              {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              sx={{
                borderColor: brandConfig.colors.hunterGreen,
                color: brandConfig.colors.hunterGreen
              }}
            >
              Demo Settings
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Configuration Info */}
      <Alert severity="info" sx={{ marginBottom: '2rem' }}>
        <AlertTitle sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
          Implementation Details
        </AlertTitle>
        This demo showcases the AI Monitor Dashboard built with:
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><strong>Configuration Files:</strong> {' '}
            <code>aiMonitorConfig.ts</code> for all content, styling, and behavior settings
          </li>
          <li><strong>MUI Components:</strong> Cards, Grids, Typography, Chips, Progress indicators</li>
          <li><strong>Brand Configuration:</strong> All colors, fonts, and spacing from <code>brandConfig.ts</code></li>
          <li><strong>TypeScript Interfaces:</strong> Fully typed component props and configurations</li>
        </ul>
      </Alert>

      {/* Sample Alert Cards */}
      <Paper sx={styles.alertSamples} elevation={1}>
        <Typography sx={{
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          fontSize: brandConfig.typography.fontSizeXl,
          color: brandConfig.colors.stableMahogany,
          marginBottom: '1rem'
        }}>
          Sample Alert Cards
        </Typography>
        <Typography sx={{
          fontFamily: brandConfig.typography.fontSecondary,
          color: brandConfig.colors.hunterGreen,
          marginBottom: '1.5rem'
        }}>
          These alert cards demonstrate different severity levels and template configurations:
        </Typography>
        
        <Stack spacing={2}>
          {sampleAlerts.map((alert) => (
            <AIAlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAlertAction}
              onViewDetails={handleAlertAction}
              onAction={handleAlertAction}
              showActions={true}
              compact={false}
            />
          ))}
        </Stack>
      </Paper>

      {/* Main Dashboard */}
      <Paper elevation={3} sx={{ borderRadius: brandConfig.layout.borderRadius }}>
        <AIMonitorDashboard
          tenantId={selectedTenant}
          autoRefresh={isSimulating}
          refreshInterval={isSimulating ? 10000 : aiMonitorConfig.dashboard.refreshInterval}
          initialFilters={{
            timeRange: '24h',
            severity: 'all',
            category: 'all'
          }}
          onAlertAction={handleAlertAction}
        />
      </Paper>

      {/* Footer Information */}
      <Box sx={{
        marginTop: '2rem',
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: brandConfig.colors.stableMahogany + '10',
        borderRadius: brandConfig.layout.borderRadius
      }}>
        <Typography variant="caption" sx={{
          color: brandConfig.colors.hunterGreen,
          fontFamily: brandConfig.typography.fontSecondary
        }}>
          Demo running on tenant: <strong>{selectedTenant}</strong> | 
          Configuration: <strong>aiMonitorConfig.ts</strong> | 
          Brand: <strong>brandConfig.ts</strong>
        </Typography>
      </Box>
    </Container>
  );
}; 