/**
 * Alert Summary Card Component
 * Summary display of alert counts by severity
 * 
 * @description Configuration-driven alert summary with visual indicators
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React from 'react';
import {
  Card, CardContent, Typography, Box, Stack, Chip, LinearProgress
} from '@mui/material';
import {
  Error, Warning, Info, CheckCircle
} from '@mui/icons-material';

// Configuration imports
import { aiMonitorConfig } from '../../config/aiMonitorConfig';
import { brandConfig } from '../../config/brandConfig';

interface IAlertSummaryCardProps {
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  totalCount: number;
}

export const AlertSummaryCard: React.FC<IAlertSummaryCardProps> = ({
  criticalCount,
  warningCount,
  infoCount,
  totalCount
}) => {
  // Calculate percentages for progress indicators
  const criticalPercent = totalCount > 0 ? (criticalCount / totalCount) * 100 : 0;
  const warningPercent = totalCount > 0 ? (warningCount / totalCount) * 100 : 0;
  const infoPercent = totalCount > 0 ? (infoCount / totalCount) * 100 : 0;

  // Determine overall status
  const getOverallStatus = () => {
    if (criticalCount > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    if (infoCount > 0) return 'info';
    return 'clear';
  };

  const overallStatus = getOverallStatus();

  // Status configuration
  const statusConfig = {
    critical: {
      color: brandConfig.colors.errorRed,
      backgroundColor: brandConfig.colors.errorRed + '10',
      borderColor: brandConfig.colors.errorRed,
      icon: <Error />,
      message: "Immediate attention required"
    },
    warning: {
      color: brandConfig.colors.alertAmber,
      backgroundColor: brandConfig.colors.alertAmber + '10',
      borderColor: brandConfig.colors.alertAmber,
      icon: <Warning />,
      message: "Review and address alerts"
    },
    info: {
      color: brandConfig.colors.infoBlue,
      backgroundColor: brandConfig.colors.infoBlue + '10',
      borderColor: brandConfig.colors.infoBlue,
      icon: <Info />,
      message: "Information available for review"
    },
    clear: {
      color: brandConfig.colors.successGreen,
      backgroundColor: brandConfig.colors.successGreen + '10',
      borderColor: brandConfig.colors.successGreen,
      icon: <CheckCircle />,
      message: "All systems operating normally"
    }
  };

  const currentStatus = statusConfig[overallStatus];

  // Styles using configuration
  const styles = {
    card: {
      borderRadius: aiMonitorConfig.cards.monitoring.borderRadius,
      border: `2px solid ${currentStatus.borderColor}`,
      backgroundColor: currentStatus.backgroundColor,
      padding: aiMonitorConfig.layout.alertSummary.padding
    },
    headerSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    statusIcon: {
      color: currentStatus.color,
      fontSize: '2rem'
    },
    alertCountSection: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1rem'
    },
    alertCountItem: {
      textAlign: 'center' as const,
      flex: 1
    },
    countNumber: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSize2xl
    },
    progressSection: {
      marginTop: '1rem'
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      marginBottom: '0.5rem'
    }
  };

  return (
    <Card sx={styles.card} elevation={2}>
      <CardContent>
        {/* Header with Status */}
        <Box sx={styles.headerSection}>
          <Box sx={styles.statusIcon}>
            {currentStatus.icon}
          </Box>
          <Box>
            <Typography sx={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightSemiBold,
              fontSize: brandConfig.typography.fontSizeXl,
              color: brandConfig.colors.stableMahogany,
              marginBottom: '0.25rem'
            }}>
              {aiMonitorConfig.text.headers.alertSummary}
            </Typography>
            <Typography sx={{
              fontFamily: brandConfig.typography.fontSecondary,
              color: currentStatus.color,
              fontWeight: brandConfig.typography.weightMedium
            }}>
              {currentStatus.message}
            </Typography>
          </Box>
        </Box>

        {/* Alert Counts */}
        <Box sx={styles.alertCountSection}>
          {/* Critical Alerts */}
          <Box sx={styles.alertCountItem}>
            <Typography sx={{
              ...styles.countNumber,
              color: brandConfig.colors.errorRed
            }}>
              {criticalCount}
            </Typography>
            <Typography variant="body2" sx={{
              color: brandConfig.colors.errorRed,
              fontWeight: brandConfig.typography.weightSemiBold,
              marginTop: '0.25rem'
            }}>
              Critical
            </Typography>
            <Chip
              label={`${criticalPercent.toFixed(0)}%`}
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.errorRed,
                color: 'white',
                fontSize: brandConfig.typography.fontSizeXs,
                marginTop: '0.25rem'
              }}
            />
          </Box>

          {/* Warning Alerts */}
          <Box sx={styles.alertCountItem}>
            <Typography sx={{
              ...styles.countNumber,
              color: brandConfig.colors.alertAmber
            }}>
              {warningCount}
            </Typography>
            <Typography variant="body2" sx={{
              color: brandConfig.colors.alertAmber,
              fontWeight: brandConfig.typography.weightSemiBold,
              marginTop: '0.25rem'
            }}>
              Warning
            </Typography>
            <Chip
              label={`${warningPercent.toFixed(0)}%`}
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.alertAmber,
                color: 'white',
                fontSize: brandConfig.typography.fontSizeXs,
                marginTop: '0.25rem'
              }}
            />
          </Box>

          {/* Info Alerts */}
          <Box sx={styles.alertCountItem}>
            <Typography sx={{
              ...styles.countNumber,
              color: brandConfig.colors.infoBlue
            }}>
              {infoCount}
            </Typography>
            <Typography variant="body2" sx={{
              color: brandConfig.colors.infoBlue,
              fontWeight: brandConfig.typography.weightSemiBold,
              marginTop: '0.25rem'
            }}>
              Info
            </Typography>
            <Chip
              label={`${infoPercent.toFixed(0)}%`}
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.infoBlue,
                color: 'white',
                fontSize: brandConfig.typography.fontSizeXs,
                marginTop: '0.25rem'
              }}
            />
          </Box>

          {/* Total Alerts */}
          <Box sx={styles.alertCountItem}>
            <Typography sx={{
              ...styles.countNumber,
              color: currentStatus.color
            }}>
              {totalCount}
            </Typography>
            <Typography variant="body2" sx={{
              color: brandConfig.colors.stableMahogany,
              fontWeight: brandConfig.typography.weightSemiBold,
              marginTop: '0.25rem'
            }}>
              Total
            </Typography>
            <Chip
              label="100%"
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.stableMahogany,
                color: 'white',
                fontSize: brandConfig.typography.fontSizeXs,
                marginTop: '0.25rem'
              }}
            />
          </Box>
        </Box>

        {/* Progress Indicators */}
        {totalCount > 0 && (
          <Box sx={styles.progressSection}>
            <Typography variant="subtitle2" sx={{
              fontWeight: brandConfig.typography.weightSemiBold,
              color: brandConfig.colors.stableMahogany,
              marginBottom: '0.75rem'
            }}>
              Alert Distribution
            </Typography>
            
            <Stack spacing={1}>
              {/* Critical Progress */}
              {criticalCount > 0 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: brandConfig.colors.errorRed }}>
                      Critical
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandConfig.colors.errorRed }}>
                      {criticalCount} alerts
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={criticalPercent}
                    sx={{
                      ...styles.progressBar,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: brandConfig.colors.errorRed
                      },
                      backgroundColor: brandConfig.colors.errorRed + '20'
                    }}
                  />
                </Box>
              )}

              {/* Warning Progress */}
              {warningCount > 0 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: brandConfig.colors.alertAmber }}>
                      Warning
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandConfig.colors.alertAmber }}>
                      {warningCount} alerts
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={warningPercent}
                    sx={{
                      ...styles.progressBar,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: brandConfig.colors.alertAmber
                      },
                      backgroundColor: brandConfig.colors.alertAmber + '20'
                    }}
                  />
                </Box>
              )}

              {/* Info Progress */}
              {infoCount > 0 && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: brandConfig.colors.infoBlue }}>
                      Info
                    </Typography>
                    <Typography variant="caption" sx={{ color: brandConfig.colors.infoBlue }}>
                      {infoCount} alerts
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={infoPercent}
                    sx={{
                      ...styles.progressBar,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: brandConfig.colors.infoBlue
                      },
                      backgroundColor: brandConfig.colors.infoBlue + '20'
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}; 