/**
 * Data Classification Banner Component
 * Shows data classification levels and security warnings
 * 
 * @description Configuration-driven banner for data classification and security compliance
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React from 'react';
import {
  Alert,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Security,
  Warning,
  Info,
  Error,
  Shield,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

// Configuration imports
import { brandConfig } from '../../config/brandConfig';

interface IDataClassificationBannerProps {
  classification?: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED' | 'confidential' | 'internal' | 'public';
  level?: 'public' | 'internal' | 'confidential' | 'restricted';
  showWarning?: boolean;
  compact?: boolean;
  showControls?: boolean;
  onDismiss?: () => void;
  customMessage?: string;
}

export const DataClassificationBanner: React.FC<IDataClassificationBannerProps> = ({
  classification = 'CONFIDENTIAL',
  level,
  showWarning = false,
  compact = false,
  showControls = false,
  onDismiss,
  customMessage
}) => {
  // Normalize classification level
  const normalizedLevel = (level || classification).toUpperCase();
  
  const getClassificationConfig = (level: string) => {
    switch (level) {
      case 'PUBLIC':
        return {
          color: brandConfig.colors.successGreen,
          backgroundColor: `${brandConfig.colors.successGreen}20`,
          icon: <Visibility />,
          label: 'PUBLIC',
          description: 'Information that can be freely shared',
          severity: 'success' as const
        };
      case 'INTERNAL':
        return {
          color: brandConfig.colors.infoBlue,
          backgroundColor: `${brandConfig.colors.infoBlue}20`,
          icon: <Info />,
          label: 'INTERNAL',
          description: 'Information for internal use only',
          severity: 'info' as const
        };
      case 'CONFIDENTIAL':
        return {
          color: brandConfig.colors.alertAmber,
          backgroundColor: `${brandConfig.colors.alertAmber}20`,
          icon: <Lock />,
          label: 'CONFIDENTIAL',
          description: 'Sensitive information requiring protection',
          severity: 'warning' as const
        };
      case 'RESTRICTED':
        return {
          color: brandConfig.colors.errorRed,
          backgroundColor: `${brandConfig.colors.errorRed}20`,
          icon: <Shield />,
          label: 'RESTRICTED',
          description: 'Highly sensitive information with limited access',
          severity: 'error' as const
        };
      default:
        return {
          color: brandConfig.colors.alertAmber,
          backgroundColor: `${brandConfig.colors.alertAmber}20`,
          icon: <Warning />,
          label: 'CLASSIFIED',
          description: 'Protected information',
          severity: 'warning' as const
        };
    }
  };

  const config = getClassificationConfig(normalizedLevel);

  const styles = {
    banner: {
      backgroundColor: config.backgroundColor,
      border: `1px solid ${config.color}`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: compact ? brandConfig.spacing.sm : brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
    },
    chip: {
      backgroundColor: config.color,
      color: brandConfig.colors.barnWhite,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: compact ? brandConfig.typography.fontSizeXs : brandConfig.typography.fontSizeSm,
    },
    text: {
      color: brandConfig.colors.midnightBlack,
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: compact ? brandConfig.typography.fontSizeSm : brandConfig.typography.fontSizeBase,
    },
    warning: {
      color: config.color,
      fontWeight: brandConfig.typography.weightSemiBold,
    }
  };

  // If it's a simple compact banner
  if (compact) {
    return (
      <Box sx={styles.banner}>
        <Box sx={{ color: config.color }}>
          {config.icon}
        </Box>
        <Chip
          label={config.label}
          size="small"
          sx={styles.chip}
        />
        {showWarning && (
          <Typography variant="caption" sx={styles.warning}>
            Handle with care
          </Typography>
        )}
      </Box>
    );
  }

  // Full banner with alert
  return (
    <Alert
      severity={config.severity}
      sx={{
        backgroundColor: config.backgroundColor,
        border: `1px solid ${config.color}`,
        borderRadius: brandConfig.layout.borderRadius,
        marginBottom: brandConfig.spacing.md,
        '& .MuiAlert-icon': {
          color: config.color
        }
      }}
      icon={config.icon}
      onClose={onDismiss}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip
          label={config.label}
          sx={styles.chip}
        />
        <Box>
          <Typography variant="body2" sx={styles.text}>
            {customMessage || config.description}
          </Typography>
          {showWarning && (
            <Typography variant="caption" sx={styles.warning}>
              ⚠️ This data requires special handling and protection
            </Typography>
          )}
        </Box>
      </Stack>
    </Alert>
  );
}; 