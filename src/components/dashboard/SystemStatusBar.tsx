/**
 * System Status Bar Component
 * Displays real-time system status with config-driven content
 * Part of the clean mobile-first dashboard
 */

import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Eye, 
  Brain, 
  Shield, 
  Clock 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';

interface SystemStatusBarProps {
  systemStatus: {
    overall: 'operational' | 'degraded' | 'critical';
    aiEngine: 'active' | 'inactive' | 'error';
    cameras: {
      online: number;
      total: number;
    };
    alerts: {
      active: number;
    };
    uptime: string;
  };
  onlineUsers: number;
}

export const SystemStatusBar: React.FC<SystemStatusBarProps> = ({
  systemStatus,
  onlineUsers
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': 
        return brandConfig.colors.successGreen;
      case 'degraded': 
        return brandConfig.colors.alertAmber;
      case 'critical': 
        return brandConfig.colors.errorRed;
      default: 
        return brandConfig.colors.neutralGray;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': 
        return <Shield style={{ width: '16px', height: '16px' }} />;
      case 'degraded': 
        return <Eye style={{ width: '16px', height: '16px' }} />;
      case 'critical': 
        return <WifiOff style={{ width: '16px', height: '16px' }} />;
      default: 
        return <Wifi style={{ width: '16px', height: '16px' }} />;
    }
  };

  const statusBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.barnWhite,
    borderBottom: `1px solid ${brandConfig.colors.arenaSand}`,
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    flexWrap: 'wrap',
    gap: brandConfig.spacing.md,
  };

  const statusItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: brandConfig.spacing.xs,
    color: brandConfig.colors.midnightBlack,
    fontWeight: brandConfig.typography.weightMedium,
  };

  const statusTextStyle: React.CSSProperties = {
    fontSize: brandConfig.typography.fontSizeSm,
    fontWeight: brandConfig.typography.weightSemiBold,
  };

  return (
    <div style={statusBarStyle}>
      {/* Overall Status */}
      <div 
        style={{
          ...statusItemStyle,
          color: getStatusColor(systemStatus.overall)
        }}
      >
        {getStatusIcon(systemStatus.overall)}
        <span style={statusTextStyle}>
          {newDashboardEnhancements.status.operational} {systemStatus.overall.toUpperCase()}
        </span>
      </div>

      {/* AI Engine Status */}
      <div 
        style={{
          ...statusItemStyle,
          color: systemStatus.aiEngine === 'active' 
            ? brandConfig.colors.successGreen 
            : brandConfig.colors.errorRed
        }}
      >
        <Brain style={{ width: '16px', height: '16px' }} />
        <span style={statusTextStyle}>
          {newDashboardEnhancements.status.aiActive}
        </span>
      </div>

      {/* Camera Status */}
      <div style={statusItemStyle}>
        <Eye style={{ width: '16px', height: '16px' }} />
        <span style={statusTextStyle}>
          {newDashboardEnhancements.status.camerasOnline}: {systemStatus.cameras.online}/{systemStatus.cameras.total}
        </span>
      </div>

      {/* Active Alerts */}
      <div 
        style={{
          ...statusItemStyle,
          color: systemStatus.alerts.active > 0 
            ? brandConfig.colors.errorRed 
            : brandConfig.colors.successGreen
        }}
      >
        <div 
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span 
            style={{
              color: brandConfig.colors.barnWhite,
              fontSize: brandConfig.typography.fontSizeXs,
              fontWeight: brandConfig.typography.weightBold,
            }}
          >
            {systemStatus.alerts.active}
          </span>
        </div>
        <span style={statusTextStyle}>
          {newDashboardEnhancements.status.activeAlerts}
        </span>
      </div>

      {/* Uptime */}
      <div style={statusItemStyle}>
        <Clock style={{ width: '16px', height: '16px' }} />
        <span style={statusTextStyle}>
          {newDashboardEnhancements.status.uptime}: {systemStatus.uptime}
        </span>
      </div>

      {/* Online Users */}
      <div style={statusItemStyle}>
        <div 
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: brandConfig.colors.successGreen,
            borderRadius: '50%',
          }}
        />
        <span style={statusTextStyle}>
          {onlineUsers} {newDashboardEnhancements.status.online}
        </span>
      </div>
    </div>
  );
}; 