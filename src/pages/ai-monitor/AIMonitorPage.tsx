import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Fab,
  Drawer,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Security as SecurityIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { aiMonitorConfig } from '../../config/aiMonitorConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

interface IAIMonitorPageProps {
  embedded?: boolean;
}

export const AIMonitorPage: React.FC<IAIMonitorPageProps> = ({
  embedded = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { tenantId } = useTenant();

  // State management
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [securityStatus, setSecurityStatus] = useState<{
    trustLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    deviceTrusted: boolean;
  }>({
    trustLevel: 'medium',
    riskScore: 25,
    deviceTrusted: true
  });

  // Configuration shortcuts
  const dashboardConfig = aiMonitorConfig.dashboard;
  const securityConfig = aiMonitorConfig.security;

  useEffect(() => {
    // Simulate loading and data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAlerts([
        {
          id: 'alert_001',
          severity: 'warning',
          title: 'Elevated Heart Rate - Thunder',
          description: 'Heart rate detected at 65 bpm, above normal range',
          timestamp: new Date().toISOString(),
          confidence: 92,
          category: 'vitals'
        },
        {
          id: 'alert_002',
          severity: 'info',
          title: 'Social Behavior Change - Star',
          description: 'Decreased interaction with herd members',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          confidence: 78,
          category: 'behavior'
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getSeverityColor = (severity: string) => {
    const config = aiMonitorConfig.alerts.severityLevels[severity];
    return config?.color || brandConfig.colors.midnightBlack;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'emergency':
        return <WarningIcon />;
      case 'warning':
        return <NotificationsIcon />;
      default:
        return <CheckCircleIcon />;
    }
  };

  const renderSecurityIndicator = () => (
    <Paper
      elevation={1}
      sx={{
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.arenaSand,
        borderRadius: brandConfig.layout.borderRadius,
        marginBottom: brandConfig.spacing.lg
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon
            sx={{
              color: brandConfig.colors.stableMahogany,
              marginRight: brandConfig.spacing.sm
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            Zero Trust Security Status
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: brandConfig.spacing.sm }}>
          <Chip
            label={`Trust: ${securityStatus.trustLevel.toUpperCase()}`}
            color={securityStatus.trustLevel === 'high' ? 'success' : 
                   securityStatus.trustLevel === 'medium' ? 'warning' : 'error'}
            size="small"
          />
          <Chip
            label={`Risk: ${securityStatus.riskScore}`}
            color={securityStatus.riskScore < 30 ? 'success' : 
                   securityStatus.riskScore < 70 ? 'warning' : 'error'}
            size="small"
          />
          <Chip
            label={securityStatus.deviceTrusted ? 'Device Trusted' : 'Device Untrusted'}
            color={securityStatus.deviceTrusted ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </Box>
    </Paper>
  );

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
            fontSize: isMobile ? '1.5rem' : '2rem'
          }} 
        />
        <Box>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
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
              fontSize: isMobile ? brandConfig.typography.fontSizeSm : brandConfig.typography.fontSizeMd
            }}
          >
            {dashboardConfig.subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
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

        <Tooltip title="Settings">
          <IconButton
            onClick={() => setShowSettings(true)}
            sx={{
              color: brandConfig.colors.stableMahogany,
              '&:hover': {
                backgroundColor: `${brandConfig.colors.stableMahogany}20`
              }
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderAlertCard = (alert: any) => (
    <Paper
      key={alert.id}
      elevation={2}
      sx={{
        padding: brandConfig.spacing.md,
        marginBottom: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.arenaSand,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: brandConfig.spacing.sm }}>
            {getSeverityIcon(alert.severity)}
            <Typography
              variant="h6"
              sx={{
                color: brandConfig.colors.stableMahogany,
                fontFamily: brandConfig.typography.fontDisplay,
                fontWeight: brandConfig.typography.weightSemiBold,
                marginLeft: brandConfig.spacing.sm
              }}
            >
              {alert.title}
            </Typography>
          </Box>
          
          <Typography
            variant="body1"
            sx={{
              color: brandConfig.colors.midnightBlack,
              fontFamily: brandConfig.typography.fontPrimary,
              marginBottom: brandConfig.spacing.sm
            }}
          >
            {alert.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: brandConfig.spacing.sm, flexWrap: 'wrap' }}>
            <Chip
              label={alert.severity.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getSeverityColor(alert.severity),
                color: 'white',
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            />
            <Chip
              label={`${alert.confidence}% confidence`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={alert.category}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.xs }}>
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: brandConfig.colors.stableMahogany,
              borderColor: brandConfig.colors.stableMahogany,
              '&:hover': {
                backgroundColor: `${brandConfig.colors.stableMahogany}10`
              }
            }}
          >
            Acknowledge
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            sx={{
              color: brandConfig.colors.alertAmber,
              borderColor: brandConfig.colors.alertAmber,
              '&:hover': {
                backgroundColor: `${brandConfig.colors.alertAmber}10`
              }
            }}
          >
            Escalate
          </Button>
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: brandConfig.colors.sterlingSilver,
          fontFamily: brandConfig.typography.fontPrimary,
          marginTop: brandConfig.spacing.sm,
          display: 'block'
        }}
      >
        {new Date(alert.timestamp).toLocaleString()}
      </Typography>
    </Paper>
  );

  const renderSettingsDrawer = () => (
    <Drawer
      anchor="right"
      open={showSettings}
      onClose={() => setShowSettings(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : '400px',
          padding: brandConfig.spacing.lg,
          backgroundColor: brandConfig.colors.arenaSand
        }
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: brandConfig.colors.stableMahogany,
          fontFamily: brandConfig.typography.fontDisplay,
          marginBottom: brandConfig.spacing.lg
        }}
      >
        Dashboard Settings
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: brandConfig.colors.midnightBlack,
          fontFamily: brandConfig.typography.fontPrimary
        }}
      >
        Dashboard configuration options will be available here. This includes filter preferences, 
        notification settings, security policies, and display options.
      </Typography>

      <Box sx={{ marginTop: brandConfig.spacing.lg }}>
        <Button
          variant="contained"
          onClick={() => setShowSettings(false)}
          sx={{
            backgroundColor: brandConfig.colors.stableMahogany,
            '&:hover': {
              backgroundColor: brandConfig.colors.hunterGreen
            }
          }}
        >
          Close Settings
        </Button>
      </Box>
    </Drawer>
  );

  if (!user || !tenantId) {
    return (
      <Alert severity="error" sx={{ margin: brandConfig.spacing.lg }}>
        <Typography variant="h6">Access Denied</Typography>
        <Typography>Please log in to access the AI monitoring dashboard.</Typography>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        minHeight: embedded ? 'auto' : '100vh',
        backgroundColor: brandConfig.colors.arenaSand,
        padding: brandConfig.spacing.lg
      }}
    >
      {/* Security Status */}
      {securityConfig.enabled && renderSecurityIndicator()}

      {/* Dashboard Header */}
      {renderDashboardHeader()}

      {/* Loading State */}
      {isLoading && (
        <Paper
          sx={{
            padding: brandConfig.spacing.xl,
            textAlign: 'center',
            backgroundColor: brandConfig.colors.arenaSand,
            marginBottom: brandConfig.spacing.lg
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay
            }}
          >
            Loading AI monitoring data...
          </Typography>
        </Paper>
      )}

      {/* Alerts Grid */}
      {!isLoading && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              sx={{
                color: brandConfig.colors.stableMahogany,
                fontFamily: brandConfig.typography.fontDisplay,
                marginBottom: brandConfig.spacing.lg
              }}
            >
              Active Alerts ({alerts.length})
            </Typography>
            
            {alerts.length === 0 ? (
              <Paper
                sx={{
                  padding: brandConfig.spacing.xl,
                  textAlign: 'center',
                  backgroundColor: brandConfig.colors.arenaSand
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
                    fontFamily: brandConfig.typography.fontDisplay
                  }}
                >
                  No Active Alerts
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
            ) : (
              alerts.map(renderAlertCard)
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                color: brandConfig.colors.stableMahogany,
                fontFamily: brandConfig.typography.fontDisplay,
                marginBottom: brandConfig.spacing.lg
              }}
            >
              Summary
            </Typography>
            
            <Paper
              sx={{
                padding: brandConfig.spacing.lg,
                backgroundColor: brandConfig.colors.arenaSand,
                marginBottom: brandConfig.spacing.md
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: brandConfig.colors.stableMahogany,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  marginBottom: brandConfig.spacing.sm
                }}
              >
                Alert Statistics
              </Typography>
              
              <Box sx={{ marginBottom: brandConfig.spacing.sm }}>
                <Typography variant="body2">Total Alerts: {alerts.length}</Typography>
                <Typography variant="body2">Critical: 0</Typography>
                <Typography variant="body2">Warning: {alerts.filter(a => a.severity === 'warning').length}</Typography>
                <Typography variant="body2">Info: {alerts.filter(a => a.severity === 'info').length}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Settings Drawer */}
      {renderSettingsDrawer()}

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: brandConfig.colors.stableMahogany,
            '&:hover': {
              backgroundColor: brandConfig.colors.hunterGreen
            }
          }}
          onClick={() => setShowSettings(true)}
        >
          <FilterIcon />
        </Fab>
      )}
    </Box>
  );
};

export default AIMonitorPage; 