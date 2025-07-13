/**
 * Monitoring Card Component
 * Individual monitoring section card with real-time data visualization
 * 
 * @description Configuration-driven monitoring card with charts and metrics
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions,
  Typography, IconButton, Button, Box, Stack,
  Chip, CircularProgress, Alert, Avatar, Tooltip
} from '@mui/material';
import {
  Refresh, MoreVert, Fullscreen, TrendingUp, TrendingDown,
  Error, Warning, CheckCircle, Favorite, Psychology,
  DirectionsWalk, Group
} from '@mui/icons-material';

// Configuration imports
import { aiMonitorConfig, getMonitoringSectionConfig } from '../../config/aiMonitorConfig';
import { brandConfig } from '../../config/brandConfig';

// Interface imports
import type { IMonitoringCardProps } from '../../interfaces/config/aiMonitorConfig.interface';

export const MonitoringCard: React.FC<IMonitoringCardProps> = ({
  section,
  data = {},
  isLoading = false,
  error,
  onRefresh,
  showControls = true
}) => {
  const [expanded, setExpanded] = useState(false);

  // Get section configuration
  const sectionConfig = getMonitoringSectionConfig(section);
  
  if (!sectionConfig) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Unknown monitoring section: {section}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Favorite: <Favorite />,
      Psychology: <Psychology />,
      DirectionsWalk: <DirectionsWalk />,
      Group: <Group />
    };
    return iconMap[iconName] || <CheckCircle />;
  };

  // Calculate metric status based on normal ranges
  const getMetricStatus = (value: number, normal: [number, number]) => {
    if (value < normal[0] || value > normal[1]) {
      return 'critical';
    }
    const threshold = (normal[1] - normal[0]) * 0.1; // 10% threshold
    if (value < normal[0] + threshold || value > normal[1] - threshold) {
      return 'warning';
    }
    return 'normal';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return brandConfig.colors.errorRed;
      case 'warning': return brandConfig.colors.alertAmber;
      case 'normal': return brandConfig.colors.successGreen;
      default: return brandConfig.colors.sterlingSilver;
    }
  };

  // Get trend indicator
  const getTrendIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp sx={{ color: brandConfig.colors.successGreen, fontSize: 16 }} />;
    } else if (current < previous) {
      return <TrendingDown sx={{ color: brandConfig.colors.errorRed, fontSize: 16 }} />;
    }
    return null;
  };

  // Format metric value
  const formatMetricValue = (value: number, unit: string) => {
    if (typeof value !== 'number') return 'N/A';
    return `${value.toFixed(1)} ${unit}`;
  };

  // Determine overall card status
  const getOverallStatus = () => {
    if (!data.metrics) return 'no-data';
    
    const statuses = sectionConfig.metrics.map(metric => {
      const value = data.metrics?.[metric.key]?.current;
      if (typeof value !== 'number') return 'no-data';
      return getMetricStatus(value, metric.normal);
    });

    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.includes('no-data')) return 'no-data';
    return 'normal';
  };

  const overallStatus = getOverallStatus();

  // Styles using configuration
  const styles = {
    card: {
      borderRadius: aiMonitorConfig.cards.monitoring.borderRadius,
      minHeight: aiMonitorConfig.layout.monitoringCards.minHeight,
      border: `2px solid ${getStatusColor(overallStatus)}40`,
      backgroundColor: overallStatus === 'critical' ? 
        brandConfig.colors.errorRed + '05' : 
        overallStatus === 'warning' ? 
        brandConfig.colors.alertAmber + '05' : 
        'white',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: brandConfig.layout.boxShadow,
        transform: 'translateY(-2px)'
      }
    },
    header: {
      padding: aiMonitorConfig.cards.monitoring.padding.header,
      height: aiMonitorConfig.cards.monitoring.headerHeight
    },
    avatar: {
      backgroundColor: sectionConfig.color + '20',
      color: sectionConfig.color,
      width: 40,
      height: 40
    },
    content: {
      padding: aiMonitorConfig.cards.monitoring.padding.content,
      paddingTop: '0.5rem'
    },
    metricItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '0.5rem',
      border: '1px solid' + brandConfig.colors.sterlingSilver + '30'
    },
    statusChip: {
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold
    },
    noDataState: {
      textAlign: 'center' as const,
      padding: '2rem',
      color: brandConfig.colors.sterlingSilver
    }
  };

  return (
    <Card sx={styles.card} elevation={aiMonitorConfig.cards.monitoring.elevation}>
      {/* Header */}
      <CardHeader
        sx={styles.header}
        avatar={
          <Avatar sx={styles.avatar}>
            {getIcon(sectionConfig.icon)}
          </Avatar>
        }
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightSemiBold,
              fontSize: brandConfig.typography.fontSizeBase,
              color: brandConfig.colors.stableMahogany
            }}>
              {sectionConfig.title}
            </Typography>
            <Chip
              label={overallStatus.toUpperCase()}
              size="small"
              sx={{
                ...styles.statusChip,
                backgroundColor: getStatusColor(overallStatus),
                color: 'white'
              }}
            />
          </Stack>
        }
        subheader={
          <Typography variant="caption" color="textSecondary">
            Updates every {Math.floor(sectionConfig.updateInterval / 1000)}s
          </Typography>
        }
        action={
          showControls && (
            <Stack direction="row" spacing={0.5}>
              {onRefresh && (
                <Tooltip title={aiMonitorConfig.text.tooltips.refresh}>
                  <IconButton
                    size="small"
                    onClick={onRefresh}
                    disabled={isLoading}
                    sx={{ color: brandConfig.colors.stableMahogany }}
                  >
                    {isLoading ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Refresh />
                    )}
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                size="small"
                sx={{ color: brandConfig.colors.hunterGreen }}
              >
                <Fullscreen />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: brandConfig.colors.hunterGreen }}
              >
                <MoreVert />
              </IconButton>
            </Stack>
          )
        }
      />

      {/* Content */}
      <CardContent sx={styles.content}>
        {/* Loading State */}
        {isLoading && (
          <Box sx={styles.noDataState}>
            <CircularProgress sx={{ color: brandConfig.colors.stableMahogany, marginBottom: '1rem' }} />
            <Typography>
              {aiMonitorConfig.text.messages.connecting}
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}

        {/* No Data State */}
        {!isLoading && !error && !data.metrics && (
          <Box sx={styles.noDataState}>
            <Error sx={{ fontSize: '3rem', color: brandConfig.colors.sterlingSilver, marginBottom: '1rem' }} />
            <Typography>
              {aiMonitorConfig.text.messages.noData}
            </Typography>
          </Box>
        )}

        {/* Metrics Display */}
        {!isLoading && !error && data.metrics && (
          <Stack spacing={1}>
            {sectionConfig.metrics.map((metric) => {
              const currentValue = data.metrics[metric.key]?.current;
              const previousValue = data.metrics[metric.key]?.previous;
              const status = typeof currentValue === 'number' ? 
                getMetricStatus(currentValue, metric.normal) : 'no-data';

              return (
                <Box
                  key={metric.key}
                  sx={{
                    ...styles.metricItem,
                    backgroundColor: getStatusColor(status) + '10',
                    borderColor: getStatusColor(status) + '30'
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography sx={{
                      fontFamily: brandConfig.typography.fontSecondary,
                      fontWeight: brandConfig.typography.weightMedium,
                      fontSize: brandConfig.typography.fontSizeSm,
                      color: brandConfig.colors.stableMahogany
                    }}>
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Normal: {metric.normal[0]}-{metric.normal[1]} {metric.unit}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    {typeof previousValue === 'number' && typeof currentValue === 'number' && 
                      getTrendIndicator(currentValue, previousValue)}
                    
                    <Typography sx={{
                      fontFamily: brandConfig.typography.fontDisplay,
                      fontWeight: brandConfig.typography.weightBold,
                      fontSize: brandConfig.typography.fontSizeXl,
                      color: getStatusColor(status)
                    }}>
                      {typeof currentValue === 'number' ? 
                        formatMetricValue(currentValue, metric.unit) : 
                        'N/A'
                      }
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}

        {/* Chart Placeholder */}
        {!isLoading && !error && data.metrics && (
          <Box sx={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: brandConfig.colors.arenaSand + '30',
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="textSecondary">
              {sectionConfig.chartType.charAt(0).toUpperCase() + sectionConfig.chartType.slice(1)} Chart
            </Typography>
            <Box sx={{
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.5rem',
              border: `2px dashed ${brandConfig.colors.sterlingSilver}`,
              borderRadius: brandConfig.layout.borderRadius
            }}>
              <Typography variant="body2" color="textSecondary">
                Chart visualization would appear here
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'space-between', padding: '1rem' }}>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<TrendingUp />}
            sx={{
              color: brandConfig.colors.stableMahogany,
              borderColor: brandConfig.colors.stableMahogany
            }}
            variant="outlined"
          >
            View Trends
          </Button>
        </Stack>

        <Typography variant="caption" color="textSecondary">
          Last updated: {data.lastUpdate ? 
            new Date(data.lastUpdate).toLocaleTimeString() : 
            'Never'
          }
        </Typography>
      </CardActions>
    </Card>
  );
}; 