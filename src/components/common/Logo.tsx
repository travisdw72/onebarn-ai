import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';

interface ILogoProps {
  variant?: 'header' | 'registration' | 'mobile';
  theme?: 'light' | 'dark' | 'auto';
  onClick?: () => void;
}

export const Logo: React.FC<ILogoProps> = ({
  variant = 'header',
  theme = 'auto',
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get logo configuration
  const logoConfig = brandConfig.logo;
  const dimensions = logoConfig.dimensions[variant];

  // Determine which SVG to use based on theme
  const getLogoPath = () => {
    if (theme === 'auto') {
      // For now, default to dark logo - could be enhanced to detect theme
      return logoConfig.paths.dark;
    }
    return theme === 'light' ? logoConfig.paths.light : logoConfig.paths.dark;
  };

  // Render text fallback
  const renderTextLogo = () => (
    <Typography
      sx={{
        fontFamily: brandConfig.typography.fontDisplay,
        fontSize: variant === 'header' ? brandConfig.typography.fontSize2xl : brandConfig.typography.fontSize3xl,
        fontWeight: brandConfig.typography.weightBold,
        color: theme === 'light' ? brandConfig.colors.midnightBlack : brandConfig.colors.arenaSand,
        cursor: onClick ? 'pointer' : 'default',
        letterSpacing: '-0.02em',
        transition: brandConfig.animations.transitions.smooth,
        '&:hover': onClick ? {
          opacity: 0.8
        } : {}
      }}
      onClick={onClick}
    >
      {brandConfig.application.name}
    </Typography>
  );

  // Render SVG logo
  const renderSvgLogo = () => (
    <Box
      component="img"
      src={getLogoPath()}
      alt={brandConfig.application.name}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
      onClick={onClick}
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        cursor: onClick ? 'pointer' : 'default',
        transition: brandConfig.animations.transitions.smooth,
        '&:hover': onClick ? {
          opacity: 0.8
        } : {},
        display: imageError ? 'none' : 'block'
      }}
    />
  );

  // Determine what to render based on configuration
  const shouldUseSvg = logoConfig.display.useSvg && !imageError;
  const shouldFallbackToText = logoConfig.display.fallbackToText && imageError;
  const shouldShowBoth = logoConfig.display.showBoth;

  if (shouldShowBoth) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
        {renderSvgLogo()}
        {renderTextLogo()}
      </Box>
    );
  }

  if (shouldUseSvg) {
    return (
      <Box>
        {renderSvgLogo()}
        {shouldFallbackToText && renderTextLogo()}
      </Box>
    );
  }

  return renderTextLogo();
}; 