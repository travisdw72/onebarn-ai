import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { getAnimationPreset, playFlipSound } from '../../utils/animationUtils';
import '../../styles/animated-logo.css';

interface AnimatedLogoProps {
  variant?: 'hero' | 'header' | 'mobile';
  theme?: 'light' | 'dark' | 'auto';
  onClick?: () => void;
  autoPlay?: boolean;
  delay?: number;
  animateOnClick?: boolean;
  enableSound?: boolean;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  variant = 'hero',
  theme = 'auto',
  onClick,
  autoPlay = true,
  delay = 0.5,
  animateOnClick = false,
  enableSound = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Get animation preset based on variant
  const animationPreset = getAnimationPreset(variant);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
        if (enableSound) {
          playFlipSound();
        }
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, delay, enableSound]);

  // Handle click with optional animation
  const handleClick = () => {
    if (animateOnClick) {
      setAnimationKey(prev => prev + 1); // Force re-animation
      setStartAnimation(false);
      setTimeout(() => {
        setStartAnimation(true);
        if (enableSound) {
          playFlipSound();
        }
      }, 50);
    }
    if (onClick) {
      onClick();
    }
  };

  // Get logo path based on theme
  const getLogoPath = () => {
    if (theme === 'auto') {
      return brandConfig.logo.paths.light; // Use white logo for dark backgrounds
    }
    return theme === 'light' ? brandConfig.logo.paths.dark : brandConfig.logo.paths.light;
  };

  // Get dimensions based on variant
  const getDimensions = () => {
    switch (variant) {
      case 'hero':
        return { width: '800px', height: '260px' };
      case 'header':
        return { width: '180px', height: '60px' };
      case 'mobile':
        return { width: '120px', height: '40px' };
      default:
        return { width: '180px', height: '60px' };
    }
  };

  const dimensions = getDimensions();

  // Text fallback component
  const TextFallback = () => (
    <motion.div
      key={`text-${animationKey}`}
      variants={animationPreset.coinFlip}
      initial="initial"
      animate={startAnimation ? "animate" : "initial"}
      whileHover={onClick ? "hover" : undefined}
      className="animated-logo gradient-text"
    >
      <Typography
        sx={{
          fontFamily: brandConfig.typography.fontDisplay,
          fontSize: variant === 'hero' ? '4.5rem' : variant === 'header' ? brandConfig.typography.fontSize2xl : brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightBold,
          color: theme === 'light' ? brandConfig.colors.midnightBlack : brandConfig.colors.arenaSand,
          cursor: onClick ? 'pointer' : 'default',
          letterSpacing: '-0.02em',
        }}
        onClick={handleClick}
      >
        {brandConfig.application.name}
      </Typography>
    </motion.div>
  );

  // SVG Logo component
  const SvgLogo = () => (
    <Box
      className="animated-logo-container"
      sx={{
        position: 'relative',
        display: 'inline-block',
        perspective: '1000px',
      }}
    >
      {/* Glow effect background */}
      <motion.div
        key={`glow-${animationKey}`}
        variants={animationPreset.glow}
        initial="initial"
        animate={startAnimation ? "animate" : "initial"}
        className="logo-glow"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      />
      
      {/* Main logo */}
      <motion.img
        key={`logo-${animationKey}`}
        src={getLogoPath()}
        alt={brandConfig.application.name}
        onError={() => setImageError(true)}
        onClick={handleClick}
        variants={animationPreset.coinFlip}
        initial="initial"
        animate={startAnimation ? "animate" : "initial"}
        whileHover={onClick ? "hover" : undefined}
        className={`animated-logo ${onClick ? 'interactive' : ''}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          cursor: onClick ? 'pointer' : 'default',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          zIndex: 1,
          position: 'relative',
        }}
      />
    </Box>
  );

  if (imageError || !brandConfig.logo.display.useSvg) {
    return <TextFallback />;
  }

  return <SvgLogo />;
}; 