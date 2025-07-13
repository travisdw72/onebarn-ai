import React from 'react';
import { brandConfig } from '../../config/brandConfig';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Loading...',
  color = brandConfig.colors.stableMahogany
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '20px', height: '20px', borderWidth: '2px' };
      case 'large':
        return { width: '48px', height: '48px', borderWidth: '4px' };
      default:
        return { width: '32px', height: '32px', borderWidth: '3px' };
    }
  };

  const sizeStyles = getSizeStyles();

  const spinnerStyle: React.CSSProperties = {
    ...sizeStyles,
    border: `${sizeStyles.borderWidth} solid ${brandConfig.colors.sterlingSilver}`,
    borderTop: `${sizeStyles.borderWidth} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: brandConfig.spacing.sm,
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
      {text && (
        <span style={{
          fontSize: brandConfig.typography.fontSizeSm,
          color: brandConfig.colors.neutralGray,
          fontFamily: brandConfig.typography.fontPrimary,
        }}>
          {text}
        </span>
      )}
    </div>
  );
}; 