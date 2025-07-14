import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container } from '@mui/material';
import { Activity, Brain, Zap } from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { IHeroSection, IAIStatusSection, IPrimaryAction } from '../../interfaces/HomePageTypes';
import { useNavigation } from '../../contexts/NavigationContext';
import { AnimatedLogo } from '../common/AnimatedLogo';
import type { AppRoute } from '../../types/routes';

interface HeroSectionProps {
  hero: IHeroSection;
  aiStatus: IAIStatusSection;
  primaryAction: IPrimaryAction;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  hero, 
  aiStatus, 
  primaryAction 
}) => {
  const { navigateTo } = useNavigation();

  const handleCtaClick = () => {
    navigateTo(primaryAction.route as AppRoute);
  };

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: brandConfig.animations.durations.slow }}
      sx={{
        background: brandConfig.gradients.heroPrimary,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: brandConfig.gradients.heroOverlay,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.2,
          },
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        {/* AI Status Indicators */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: brandConfig.animations.delays.section, 
            duration: brandConfig.animations.durations.normal 
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(245, 230, 211, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              px: 2,
              py: 1,
              border: '1px solid rgba(245, 230, 211, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                backgroundColor: brandConfig.colors.successGreen,
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: brandConfig.colors.arenaSand,
                fontWeight: brandConfig.typography.weightMedium,
              }}
            >
              {aiStatus.overall}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(245, 230, 211, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              px: 2,
              py: 1,
              border: '1px solid rgba(245, 230, 211, 0.3)',
            }}
          >
            <Brain size={16} color={brandConfig.colors.ribbonBlue} />
            <Typography
              variant="caption"
              sx={{
                color: brandConfig.colors.arenaSand,
                fontWeight: brandConfig.typography.weightMedium,
              }}
            >
              {aiStatus.anthropic}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(245, 230, 211, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '20px',
              px: 2,
              py: 1,
              border: '1px solid rgba(245, 230, 211, 0.3)',
            }}
          >
            <Zap size={16} color={brandConfig.colors.championGold} />
            <Typography
              variant="caption"
              sx={{
                color: brandConfig.colors.arenaSand,
                fontWeight: brandConfig.typography.weightMedium,
              }}
            >
              {aiStatus.circuitBreaker}
            </Typography>
          </Box>
        </Box>

        {/* Main Hero Content */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: brandConfig.animations.delays.section + 0.1, 
            duration: brandConfig.animations.durations.slow 
          }}
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AnimatedLogo
            variant="hero"
            theme="dark"
            autoPlay={true}
            delay={0.8}
          />
        </Box>

        <Typography
          component={motion.h2}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: brandConfig.animations.delays.section + 0.2, 
            duration: brandConfig.animations.durations.slow 
          }}
          sx={{
            fontSize: { 
              xs: brandConfig.typography.fontSizeXl, 
              md: brandConfig.typography.fontSize2xl, 
              lg: brandConfig.typography.fontSize3xl 
            },
            fontWeight: brandConfig.typography.weightSemiBold,
            color: brandConfig.colors.arenaSand,
            opacity: 0.9,
            mb: 2,
          }}
        >
          {hero.subtitle}
        </Typography>

        <Typography
          component={motion.p}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: brandConfig.animations.delays.section + 0.3, 
            duration: brandConfig.animations.durations.slow 
          }}
          sx={{
            fontSize: { 
              xs: brandConfig.typography.fontSizeLg, 
              md: brandConfig.typography.fontSizeXl 
            },
            color: brandConfig.colors.arenaSand,
            opacity: 0.8,
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: brandConfig.typography.lineHeightRelaxed,
          }}
        >
          {hero.tagline}
        </Typography>

        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: brandConfig.animations.delays.section + 0.4, 
            duration: brandConfig.animations.durations.slow 
          }}
          sx={{
            fontSize: brandConfig.typography.fontSizeSm,
            color: brandConfig.colors.arenaSand,
            opacity: 0.6,
            mb: 6,
            fontFamily: brandConfig.typography.fontMono,
          }}
        >
          {hero.version}
        </Typography>

        {/* Primary CTA Button */}
        <Button
          component={motion.button}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            delay: brandConfig.animations.delays.section + 0.5, 
            duration: brandConfig.animations.durations.normal 
          }}
          onClick={handleCtaClick}
          sx={{
            position: 'relative',
            backgroundColor: brandConfig.colors.arenaSand,
            color: brandConfig.colors.stableMahogany,
            px: 6,
            py: 3,
            borderRadius: '16px',
            fontWeight: brandConfig.typography.weightBold,
            fontSize: brandConfig.typography.fontSizeXl,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            border: '2px solid transparent',
            overflow: 'hidden',
            minHeight: brandConfig.mobile.touchTargets.glovedFriendly,
            transition: brandConfig.animations.transitions.smooth,
            '&:hover': {
              borderColor: brandConfig.colors.championGold,
              '&::before': {
                opacity: 1,
              },
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(90deg, rgba(212, 165, 116, 0.2), rgba(74, 111, 165, 0.2))`,
              opacity: 0,
              transition: brandConfig.animations.transitions.smooth,
            },
          }}
        >
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Activity size={24} />
            <span>{primaryAction.text}</span>
          </Box>
        </Button>

        {/* Scroll Indicator */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 1, 
            duration: brandConfig.animations.durations.slow 
          }}
          sx={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Box
            component={motion.div}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            sx={{
              width: 24,
              height: 40,
              border: `2px solid ${brandConfig.colors.arenaSand}`,
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              opacity: 0.5,
            }}
          >
            <Box
              component={motion.div}
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              sx={{
                width: 4,
                height: 12,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: '2px',
                mt: 1,
                opacity: 0.5,
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}; 