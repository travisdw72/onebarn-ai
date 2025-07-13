import React from 'react';

interface IStatusIndicatorProps {
  status: 'active' | 'warning' | 'inactive' | 'online' | 'offline' | 'maintenance';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const StatusIndicator: React.FC<IStatusIndicatorProps> = ({
  status,
  size = 'md',
  showText = true
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return 'text-hunter-green';
      case 'warning':
      case 'maintenance':
        return 'text-champion-gold';
      case 'inactive':
      case 'offline':
        return 'text-victory-rose';
      default:
        return 'text-sterling-silver';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'online':
        return '🟢';
      case 'warning':
      case 'maintenance':
        return '🟡';
      case 'inactive':
      case 'offline':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  return (
    <span className={`flex items-center space-x-1 font-medium ${getStatusColor(status)} ${getSizeClass(size)}`}>
      <span>{getStatusIcon(status)}</span>
      {showText && <span>{status.toUpperCase()}</span>}
    </span>
  );
}; 