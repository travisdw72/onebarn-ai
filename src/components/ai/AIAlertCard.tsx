/**
 * AI Alert Card Component
 * Individual alert card for displaying AI-generated alerts
 * 
 * @description Configurable alert card with severity indicators and action buttons
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions,
  Typography, Button, IconButton, Chip, Stack,
  Avatar, Box, Collapse, Divider, Tooltip
} from '@mui/material';
import {
  Error, Warning, Info, CheckCircle,
  ExpandMore, ExpandLess, Schedule,
  Person, Pets, Visibility
} from '@mui/icons-material';

// Configuration imports
import { aiMonitorConfig, getAlertSeverityConfig, getAlertTemplateConfig } from '../../config/aiMonitorConfig';
import { brandConfig } from '../../config/brandConfig';

// Interface imports
import type { IAIAlertCardProps } from '../../interfaces/config/aiMonitorConfig.interface';

export const AIAlertCard: React.FC<IAIAlertCardProps> = ({
  alert,
  onAcknowledge,
  onViewDetails,
  onAction,
  showActions = true,
  compact = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get configuration for alert severity and template
  const severityConfig = getAlertSeverityConfig(alert.severity);
  const templateConfig = getAlertTemplateConfig(alert.type);

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Error: <Error />,
      Warning: <Warning />,
      Info: <Info />,
      Favorite: <CheckCircle />,
      Psychology: <CheckCircle />,
      DirectionsWalk: <CheckCircle />,
      Group: <CheckCircle />,
      Cloud: <CheckCircle />
    };
    return iconMap[iconName] || <Info />;
  };

  // Handle action clicks
  const handleAction = async (action: string) => {
    setIsProcessing(true);
    try {
      if (action === 'acknowledge' && onAcknowledge) {
        await onAcknowledge(alert.id);
      } else if (action === 'viewDetails' && onViewDetails) {
        await onViewDetails(alert.id);
      } else if (onAction) {
        await onAction(alert.id, action);
      }
    } catch (error) {
      console.error(`Failed to execute action ${action}:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Styles using configuration
  const styles = {
    card: {
      borderRadius: aiMonitorConfig.cards.alert.borderRadius,
      borderLeft: `4px solid ${severityConfig.borderColor}`,
      backgroundColor: alert.isAcknowledged ? 
        brandConfig.colors.successGreen + '05' : 
        severityConfig.backgroundColor,
      maxWidth: compact ? 'none' : aiMonitorConfig.cards.alert.maxWidth,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: brandConfig.layout.boxShadow,
        transform: 'translateY(-2px)'
      }
    },
    header: {
      padding: aiMonitorConfig.cards.alert.padding.header,
      paddingBottom: compact ? '0.5rem' : aiMonitorConfig.cards.alert.padding.header
    },
    avatar: {
      backgroundColor: severityConfig.color + '20',
      color: severityConfig.color,
      width: compact ? 32 : 40,
      height: compact ? 32 : 40
    },
    content: {
      padding: compact ? '0.5rem 1rem' : aiMonitorConfig.cards.alert.padding.content,
      paddingTop: 0
    },
    actions: {
      padding: aiMonitorConfig.cards.alert.padding.actions,
      justifyContent: 'space-between'
    },
    severityChip: {
      backgroundColor: severityConfig.color,
      color: 'white',
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeXs
    },
    acknowledgedChip: {
      backgroundColor: brandConfig.colors.successGreen,
      color: 'white',
      fontSize: brandConfig.typography.fontSizeXs
    },
    expandButton: {
      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-in-out'
    }
  };

  return (
    <Card sx={styles.card} elevation={aiMonitorConfig.cards.alert.elevation}>
      {/* Header */}
      <CardHeader
        sx={styles.header}
        avatar={
          <Avatar sx={styles.avatar}>
            {getIcon(severityConfig.icon)}
          </Avatar>
        }
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightSemiBold,
              fontSize: compact ? brandConfig.typography.fontSizeSm : brandConfig.typography.fontSizeBase,
              color: brandConfig.colors.stableMahogany
            }}>
              {templateConfig?.title || alert.title}
            </Typography>
            <Chip
              label={severityConfig.label}
              size="small"
              sx={styles.severityChip}
            />
            {alert.isAcknowledged && (
              <Chip
                label="ACKNOWLEDGED"
                size="small"
                sx={styles.acknowledgedChip}
              />
            )}
          </Stack>
        }
        subheader={
          <Stack direction="row" spacing={2} alignItems="center" sx={{ marginTop: '0.5rem' }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Schedule sx={{ fontSize: 16, color: brandConfig.colors.hunterGreen }} />
              <Typography variant="caption" color="textSecondary">
                {formatTimestamp(alert.timestamp)}
              </Typography>
            </Stack>
            {alert.horseName && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Pets sx={{ fontSize: 16, color: brandConfig.colors.hunterGreen }} />
                <Typography variant="caption" color="textSecondary">
                  {alert.horseName}
                </Typography>
              </Stack>
            )}
            {templateConfig?.category && (
              <Chip
                label={templateConfig.category}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: brandConfig.typography.fontSizeXs,
                  borderColor: brandConfig.colors.hunterGreen
                }}
              />
            )}
          </Stack>
        }
        action={
          !compact && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={styles.expandButton}
              size="small"
            >
              <ExpandMore />
            </IconButton>
          )
        }
      />

      {/* Content */}
      <CardContent sx={styles.content}>
        <Typography sx={{
          fontFamily: brandConfig.typography.fontSecondary,
          fontSize: compact ? brandConfig.typography.fontSizeSm : brandConfig.typography.fontSizeBase,
          color: brandConfig.colors.midnightBlack,
          lineHeight: brandConfig.typography.lineHeightNormal
        }}>
          {alert.description}
        </Typography>

        {/* Acknowledged Information */}
        {alert.isAcknowledged && alert.acknowledgedBy && (
          <Box sx={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: brandConfig.colors.successGreen + '10',
            borderRadius: brandConfig.layout.borderRadius,
            border: `1px solid ${brandConfig.colors.successGreen}30`
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Person sx={{ fontSize: 16, color: brandConfig.colors.successGreen }} />
              <Typography variant="caption" sx={{ color: brandConfig.colors.successGreen }}>
                Acknowledged by {alert.acknowledgedBy}
                {alert.acknowledgedAt && ` at ${formatTimestamp(alert.acknowledgedAt)}`}
              </Typography>
            </Stack>
          </Box>
        )}
      </CardContent>

      {/* Expandable Metadata */}
      {!compact && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: brandConfig.typography.weightSemiBold,
              marginBottom: '0.5rem',
              color: brandConfig.colors.stableMahogany
            }}>
              Additional Details
            </Typography>
            {alert.metadata && Object.entries(alert.metadata).map(([key, value]) => (
              <Stack key={key} direction="row" justifyContent="space-between" sx={{ marginBottom: '0.25rem' }}>
                <Typography variant="body2" color="textSecondary">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightMedium }}>
                  {String(value)}
                </Typography>
              </Stack>
            ))}
          </CardContent>
        </Collapse>
      )}

      {/* Actions */}
      {showActions && (
        <CardActions sx={styles.actions}>
          <Stack direction="row" spacing={1}>
            {!alert.isAcknowledged && (
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAction('acknowledge')}
                disabled={isProcessing}
                sx={{
                  backgroundColor: brandConfig.colors.successGreen,
                  '&:hover': {
                    backgroundColor: brandConfig.colors.successGreen + 'CC'
                  },
                  fontFamily: brandConfig.typography.fontSecondary
                }}
              >
                {aiMonitorConfig.alerts.actions.acknowledge}
              </Button>
            )}
            
            {templateConfig?.defaultActions?.includes('viewDetails') && (
              <Tooltip title={aiMonitorConfig.text.tooltips.viewDetails}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => handleAction('viewDetails')}
                  disabled={isProcessing}
                  sx={{
                    borderColor: brandConfig.colors.stableMahogany,
                    color: brandConfig.colors.stableMahogany,
                    '&:hover': {
                      backgroundColor: brandConfig.colors.stableMahogany + '10'
                    }
                  }}
                >
                  {aiMonitorConfig.alerts.actions.viewDetails}
                </Button>
              </Tooltip>
            )}

            {severityConfig.requiresImmediate && !alert.isAcknowledged && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleAction('escalate')}
                disabled={isProcessing}
                sx={{ fontFamily: brandConfig.typography.fontSecondary }}
              >
                {aiMonitorConfig.alerts.actions.escalate}
              </Button>
            )}
          </Stack>

          {/* Priority Indicator */}
          <Box sx={{
            padding: '0.25rem 0.5rem',
            borderRadius: brandConfig.layout.borderRadius,
            backgroundColor: severityConfig.color + '20',
            border: `1px solid ${severityConfig.color}40`
          }}>
            <Typography variant="caption" sx={{ 
              color: severityConfig.color,
              fontWeight: brandConfig.typography.weightBold
            }}>
              Priority {severityConfig.priority}
            </Typography>
          </Box>
        </CardActions>
      )}
    </Card>
  );
}; 