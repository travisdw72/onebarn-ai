/**
 * AI Status Widget - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER AI STATUS WIDGET
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This widget provides a compact overview of the AI monitoring system status
 * that can be embedded in the main dashboard or other components.
 * 
 * 🔄 CORE FEATURES:
 *     - Compact system status overview
 *     - Real-time health monitoring
 *     - Quick action buttons
 *     - Alert indicators
 *     - Performance metrics summary
 * 
 * 📊 BUSINESS PARTNER INTEGRATION:
 *     - Seamless integration with main dashboard
 *     - Professional compact presentation
 *     - Real-time status updates
 *     - Demo account validation
 *     - Click-through to full dashboard
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, compact widget design
 */

import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Button,
  LinearProgress,
  Grid,
  Badge
} from '@mui/material';
import {
  Psychology as AIIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Storage as StorageIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useSchedulerStatus } from '../../hooks/useScheduler';
import { useNavigation } from '../../contexts/NavigationContext';

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface IAIStatusWidgetProps {
  compact?: boolean;
  showControls?: boolean;
  onOpenDashboard?: () => void;
  enableNavigation?: boolean;
}

interface IStatusIndicatorProps {
  value: string | number;
  label: string;
  color: string;
  icon: React.ReactNode;
  size?: 'small' | 'medium';
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const AIStatusWidget: React.FC<IAIStatusWidgetProps> = ({
  compact = false,
  showControls = true,
  onOpenDashboard,
  enableNavigation = true
}) => {
  const { user } = useAuth();
  const { navigateTo } = useNavigation();
  
  // Demo account validation
  const isDemoAccount = user?.email === 'demo@onebarnai.com';
  
  // Get scheduler status (lightweight version)
  const {
    isRunning,
    systemHealth,
    totalWorkflows,
    successRate,
    lastActivity,
    unacknowledgedAlerts,
    storageUsage,
    isDemo
  } = useSchedulerStatus();
  
  // ═══════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════
  
  const handleOpenDashboard = useCallback(() => {
    if (onOpenDashboard) {
      onOpenDashboard();
    } else if (enableNavigation) {
      // Navigate to AI monitoring dashboard
      navigateTo('ai-monitor');
    }
  }, [onOpenDashboard, enableNavigation, navigateTo]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // RENDER COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Status Indicator Component
   */
  const StatusIndicator: React.FC<IStatusIndicatorProps> = ({
    value,
    label,
    color,
    icon,
    size = 'medium'
  }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: compact ? 'row' : 'column', 
        alignItems: 'center',
        gap: brandConfig.spacing.xs
      }}
    >
      <Box sx={{ color, fontSize: size === 'small' ? '1.2rem' : '1.5rem' }}>
        {icon}
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant={size === 'small' ? 'h6' : 'h5'} 
          sx={{ 
            color: brandConfig.colors.stableMahogany, 
            fontWeight: 'bold',
            lineHeight: 1
          }}
        >
          {value}
        </Typography>
                 <Typography 
           variant="caption" 
           sx={{ 
             color: brandConfig.colors.textSecondary,
             fontSize: size === 'small' ? '0.65rem' : '0.75rem'
           }}
         >
          {label}
        </Typography>
      </Box>
    </Box>
  );
  
  /**
   * 💼 BUSINESS PARTNER: Widget Header
   */
  const renderWidgetHeader = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: brandConfig.spacing.md
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
        <AIIcon 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            fontSize: compact ? '1.5rem' : '2rem'
          }} 
        />
        <Box>
          <Typography
            variant={compact ? 'h6' : 'h5'}
            sx={{
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold,
              lineHeight: 1
            }}
          >
            💼 AI Monitor
          </Typography>
          {!compact && (
            <Typography
                             variant="caption"
               sx={{
                 color: brandConfig.colors.textSecondary,
                 fontFamily: brandConfig.typography.fontPrimary
               }}
            >
              Real-time analysis system
            </Typography>
          )}
        </Box>
        
        {/* Status indicator */}
        <Chip
          icon={isRunning ? <SuccessIcon /> : <WarningIcon />}
          label={isRunning ? 'ACTIVE' : 'STOPPED'}
          size="small"
          sx={{
                         backgroundColor: isRunning ? brandConfig.colors.hunterGreen : brandConfig.colors.error,
            color: brandConfig.colors.arenaSand,
            fontWeight: 'bold',
            '& .MuiChip-icon': {
              color: brandConfig.colors.arenaSand
            }
          }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.xs }}>
        {unacknowledgedAlerts > 0 && (
          <Badge badgeContent={unacknowledgedAlerts} color="error">
            <WarningIcon sx={{ color: brandConfig.colors.burgundyRed }} />
          </Badge>
        )}
        
        <Tooltip title="Open Full Dashboard">
          <IconButton 
            onClick={handleOpenDashboard}
            size="small"
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            <OpenIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
  
  /**
   * 💼 BUSINESS PARTNER: System Status Overview
   */
  const renderSystemStatus = () => (
    <Grid container spacing={compact ? 1 : 2} sx={{ marginBottom: brandConfig.spacing.md }}>
      <Grid item xs={compact ? 3 : 6}>
        <StatusIndicator
          value={`${Math.round(systemHealth)}%`}
          label="Health"
          color={systemHealth > 80 ? brandConfig.colors.hunterGreen : 
                 systemHealth > 60 ? brandConfig.colors.pastelYellow : 
                 brandConfig.colors.burgundyRed}
          icon={<SpeedIcon />}
          size={compact ? 'small' : 'medium'}
        />
      </Grid>
      
      <Grid item xs={compact ? 3 : 6}>
        <StatusIndicator
          value={totalWorkflows.toString()}
          label="Workflows"
          color={brandConfig.colors.stableMahogany}
          icon={<TimelineIcon />}
          size={compact ? 'small' : 'medium'}
        />
      </Grid>
      
      {!compact && (
        <>
          <Grid item xs={6}>
            <StatusIndicator
              value={`${Math.round(successRate * 100)}%`}
              label="Success Rate"
              color={successRate > 0.9 ? brandConfig.colors.hunterGreen : 
                     successRate > 0.7 ? brandConfig.colors.pastelYellow : 
                     brandConfig.colors.burgundyRed}
              icon={<SuccessIcon />}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6}>
            <StatusIndicator
              value={`${Math.round(storageUsage)}%`}
              label="Storage"
              color={storageUsage > 80 ? brandConfig.colors.burgundyRed : 
                     storageUsage > 60 ? brandConfig.colors.pastelYellow : 
                     brandConfig.colors.hunterGreen}
              icon={<StorageIcon />}
              size="small"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
  
  /**
   * 💼 BUSINESS PARTNER: Last Activity Info
   */
  const renderLastActivity = () => {
    if (!lastActivity) return null;
    
    const activityTime = new Date(lastActivity);
    const timeAgo = Math.round((Date.now() - activityTime.getTime()) / 60000); // minutes ago
    
    return (
      <Box sx={{ textAlign: 'center', marginBottom: brandConfig.spacing.sm }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: brandConfig.colors.charcoalGray,
            fontSize: '0.7rem'
          }}
        >
          Last Activity: {timeAgo < 60 ? `${timeAgo}m ago` : activityTime.toLocaleTimeString()}
        </Typography>
      </Box>
    );
  };
  
  /**
   * 💼 BUSINESS PARTNER: Action Buttons
   */
  const renderActionButtons = () => {
    if (!showControls) return null;
    
    return (
      <Box sx={{ display: 'flex', gap: brandConfig.spacing.xs, justifyContent: 'center' }}>
        <Button
          size="small"
          variant="outlined"
          onClick={handleOpenDashboard}
          sx={{
            borderColor: brandConfig.colors.stableMahogany,
            color: brandConfig.colors.stableMahogany,
            textTransform: 'none',
            fontSize: '0.75rem',
            '&:hover': {
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.arenaSand
            }
          }}
        >
          Open Dashboard
        </Button>
        
        {unacknowledgedAlerts > 0 && (
          <Button
            size="small"
            variant="contained"
            onClick={handleOpenDashboard}
            sx={{
              backgroundColor: brandConfig.colors.burgundyRed,
              color: brandConfig.colors.arenaSand,
              textTransform: 'none',
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: brandConfig.colors.burgundyRed,
                opacity: 0.9
              }
            }}
          >
            View Alerts ({unacknowledgedAlerts})
          </Button>
        )}
      </Box>
    );
  };
  
  // ═══════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════
  
  // Demo account validation
  if (!isDemoAccount) {
    return (
      <Card
        sx={{
          backgroundColor: brandConfig.colors.arenaSand,
          border: `1px solid ${brandConfig.colors.sterlingSilver}`,
          borderRadius: brandConfig.layout.borderRadius,
          height: compact ? 'auto' : '200px'
        }}
      >
        <CardContent sx={{ padding: brandConfig.spacing.md }}>
          <Box sx={{ textAlign: 'center' }}>
            <AIIcon 
              sx={{ 
                fontSize: '2rem', 
                color: brandConfig.colors.charcoalGray,
                marginBottom: brandConfig.spacing.sm 
              }} 
            />
            <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.xs }}>
              💼 AI Monitor
            </Typography>
            <Typography variant="caption" sx={{ color: brandConfig.colors.charcoalGray }}>
              Demo account required
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card
      sx={{
        backgroundColor: brandConfig.colors.arenaSand,
        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
        borderRadius: brandConfig.layout.borderRadius,
        height: compact ? 'auto' : 'fit-content',
        minHeight: compact ? '120px' : '200px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 12px ${brandConfig.colors.sterlingSilver}`,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ padding: brandConfig.spacing.md }}>
        {renderWidgetHeader()}
        
        {renderSystemStatus()}
        
        {renderLastActivity()}
        
        {renderActionButtons()}
        
        {/* Demo indicator */}
        {isDemo && (
          <Box sx={{ textAlign: 'center', marginTop: brandConfig.spacing.sm }}>
            <Chip
              label="DEMO MODE"
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.pastelYellow,
                color: brandConfig.colors.stableMahogany,
                fontSize: '0.6rem',
                fontWeight: 'bold'
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AIStatusWidget; 