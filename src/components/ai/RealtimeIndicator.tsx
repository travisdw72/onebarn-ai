/**
 * Realtime Indicator Component
 * Shows real-time connection status and last update information
 * 
 * @description Configuration-driven real-time status indicator for AI monitoring
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React from 'react';
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Refresh,
  CheckCircle,
  Warning,
  Error,
  Schedule
} from '@mui/icons-material';

// Configuration imports
import { brandConfig } from '../../config/brandConfig';

interface IRealtimeIndicatorProps {
  connected: boolean;
  lastUpdate?: Date;
  onReconnect?: () => void;
  showTimestamp?: boolean;
  size?: 'small' | 'medium';
}

export const RealtimeIndicator: React.FC<IRealtimeIndicatorProps> = ({
  connected,
  lastUpdate,
  onReconnect,
  showTimestamp = true,
  size = 'medium'
}) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  const getConnectionStatus = () => {
    if (!connected) {
      return {
        color: brandConfig.colors.errorRed,
        icon: <WifiOff />,
        label: 'Disconnected',
        severity: 'error' as const
      };
    }

    if (lastUpdate) {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      const minutes = Math.floor(diff / 60000);

      if (minutes > 5) {
        return {
          color: brandConfig.colors.alertAmber,
          icon: <Warning />,
          label: 'Stale Data',
          severity: 'warning' as const
        };
      }
    }

    return {
      color: brandConfig.colors.successGreen,
      icon: <CheckCircle />,
      label: 'Live',
      severity: 'success' as const
    };
  };

  const status = getConnectionStatus();

  const chipSizes = {
    small: { fontSize: brandConfig.typography.fontSizeXs, padding: '4px 8px' },
    medium: { fontSize: brandConfig.typography.fontSizeSm, padding: '6px 12px' }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
    },
    statusChip: {
      backgroundColor: `${status.color}20`,
      color: status.color,
      borderColor: status.color,
      border: `1px solid ${status.color}`,
      fontFamily: brandConfig.typography.fontPrimary,
      fontWeight: brandConfig.typography.weightSemiBold,
      ...chipSizes[size]
    },
    timestamp: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.neutralGray,
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
    },
    refreshButton: {
      color: status.color,
      padding: '4px',
      '&:hover': {
        backgroundColor: `${status.color}20`
      }
    }
  };

  return (
    <Box sx={styles.container}>
      <Chip
        icon={status.icon}
        label={status.label}
        size={size}
        sx={styles.statusChip}
      />
      
      {showTimestamp && lastUpdate && (
        <Box sx={styles.timestamp}>
          <Schedule style={{ width: '14px', height: '14px' }} />
          <Typography variant="caption">
            {formatTimestamp(lastUpdate)}
          </Typography>
        </Box>
      )}

      {onReconnect && (
        <Tooltip title={connected ? 'Refresh Connection' : 'Reconnect'}>
          <IconButton
            size="small"
            onClick={onReconnect}
            sx={styles.refreshButton}
          >
            <Refresh style={{ width: '16px', height: '16px' }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}; 