import React from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useOutdoorMode } from '../../hooks/useOutdoorMode';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'standard' | 'large' | 'barn-friendly';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'standard',
  disabled = false,
  className = '',
  style = {},
  type = 'button',
}) => {
  const { isOutdoorMode } = useOutdoorMode();
  
  // Touch target sizes based on use case
  const touchTargets = {
    standard: brandConfig.mobile.touchTargets.minimal,
    large: brandConfig.mobile.touchTargets.preferred,
    'barn-friendly': brandConfig.mobile.touchTargets.glovedFriendly,
  };

  // Color variants
  const getVariantStyles = () => {
    if (isOutdoorMode) {
      return {
        backgroundColor: brandConfig.outdoorMode.contrast.backgroundColor,
        color: brandConfig.outdoorMode.contrast.textColor,
        border: `${brandConfig.outdoorMode.contrast.borderWidth} solid ${brandConfig.outdoorMode.contrast.textColor}`,
        fontWeight: brandConfig.typography.weightBold + brandConfig.outdoorMode.contrast.fontWeightIncrease,
        textShadow: brandConfig.outdoorMode.visibility.textShadow,
        boxShadow: brandConfig.outdoorMode.visibility.buttonShadow,
        fontSize: brandConfig.outdoorMode.visibility.minFontSize,
      };
    }

    const variants = {
      primary: {
        backgroundColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.arenaSand,
        border: `2px solid ${brandConfig.colors.stableMahogany}`,
      },
      secondary: {
        backgroundColor: brandConfig.colors.hunterGreen,
        color: brandConfig.colors.arenaSand,
        border: `2px solid ${brandConfig.colors.hunterGreen}`,
      },
      outline: {
        backgroundColor: 'transparent',
        color: brandConfig.colors.stableMahogany,
        border: `2px solid ${brandConfig.colors.stableMahogany}`,
      },
    };
    
    return variants[variant];
  };

  const baseStyles: React.CSSProperties = {
    minHeight: touchTargets[size],
    minWidth: touchTargets[size],
    padding: size === 'barn-friendly' ? '1rem 2rem' : '0.75rem 1.5rem',
    fontSize: brandConfig.typography.fontSizeBase,
    fontWeight: brandConfig.typography.weightSemiBold,
    borderRadius: brandConfig.layout.borderRadius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: brandConfig.typography.fontPrimary,
    position: 'relative',
    overflow: 'hidden',
    
    // Disabled state
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed',
    }),
    
    // Merge variant styles
    ...getVariantStyles(),
    
    // User custom styles
    ...style,
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isOutdoorMode) {
      const target = e.target as HTMLButtonElement;
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.2)';
      
      // Darken background slightly
      if (variant === 'primary') {
        target.style.backgroundColor = '#5A3124';
      } else if (variant === 'secondary') {
        target.style.backgroundColor = '#1E4023';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const target = e.target as HTMLButtonElement;
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = brandConfig.layout.boxShadow;
      
      // Reset background color
      if (variant === 'primary') {
        target.style.backgroundColor = brandConfig.colors.stableMahogany;
      } else if (variant === 'secondary') {
        target.style.backgroundColor = brandConfig.colors.hunterGreen;
      }
    }
  };

  return (
    <button
      type={type}
      className={className}
      style={baseStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      // Accessibility attributes
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </button>
  );
}; 