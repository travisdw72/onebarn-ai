import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import { ArrowForward, PlayCircle } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { IPrimaryActionsSection } from '../../interfaces/HomePageTypes';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useNavigation } from '../../contexts/NavigationContext';
import type { AppRoute } from '../../types/routes';

interface PrimaryActionsSectionProps {
  primaryActions: IPrimaryActionsSection;
}

export const PrimaryActionsSection: React.FC<PrimaryActionsSectionProps> = ({ primaryActions }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);
  const { navigateTo } = useNavigation();

  // Map routes to valid AppRoute types
  const getRoute = (route: string): AppRoute => {
    const routeMap: Record<string, AppRoute> = {
      'register': 'register',
      'video-analysis-demo': 'video-analysis-demo',
    };
    
    return routeMap[route] || 'register';
  };

  const handleActionClick = (route: string) => {
    const mappedRoute = getRoute(route);
    navigateTo(mappedRoute);
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        backgroundColor: brandConfig.colors.barnWhite,
        py: 8,
        borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
        borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: brandConfig.animations.durations.normal }}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          <Typography
            sx={{
              fontSize: { xs: brandConfig.typography.fontSize2xl, md: brandConfig.typography.fontSize3xl },
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.stableMahogany,
              mb: 2,
            }}
          >
            {primaryActions.sectionTitle}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Grid container spacing={4} justifyContent="center">
          {/* Main Action - Primary CTA */}
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.2, duration: brandConfig.animations.durations.normal }}
              whileHover={{ y: -4, scale: 1.02 }}
              sx={{ height: '100%' }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => handleActionClick(primaryActions.mainAction.route)}
                sx={{
                  height: '120px',
                  backgroundColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.barnWhite,
                  fontSize: brandConfig.typography.fontSizeXl,
                  fontWeight: brandConfig.typography.weightBold,
                  borderRadius: '16px',
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(139, 69, 19, 0.3)',
                  transition: brandConfig.animations.transitions.smooth,
                  '&:hover': {
                    backgroundColor: brandConfig.colors.hunterGreen,
                    boxShadow: '0 12px 35px rgba(139, 69, 19, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '2rem' }}>{primaryActions.mainAction.icon}</span>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {primaryActions.mainAction.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {primaryActions.mainAction.description}
                </Typography>
              </Button>
            </Box>
          </Grid>

          {/* Secondary Action */}
          <Grid item xs={12} md={6}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.4, duration: brandConfig.animations.durations.normal }}
              whileHover={{ y: -4, scale: 1.02 }}
              sx={{ height: '100%' }}
            >
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<PlayCircle />}
                onClick={() => handleActionClick(primaryActions.secondaryAction.route)}
                sx={{
                  height: '120px',
                  borderColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSizeLg,
                  fontWeight: brandConfig.typography.weightMedium,
                  borderRadius: '16px',
                  textTransform: 'none',
                  borderWidth: '2px',
                  transition: brandConfig.animations.transitions.smooth,
                  '&:hover': {
                    borderColor: brandConfig.colors.hunterGreen,
                    backgroundColor: `${brandConfig.colors.hunterGreen}10`,
                    color: brandConfig.colors.hunterGreen,
                    borderWidth: '2px',
                    transform: 'translateY(-2px)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.5rem' }}>{primaryActions.secondaryAction.icon}</span>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {primaryActions.secondaryAction.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {primaryActions.secondaryAction.description}
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Context */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: brandConfig.animations.durations.normal }}
          sx={{ textAlign: 'center', mt: 4 }}
        >
          <Typography
            variant="body1"
            sx={{
              color: brandConfig.colors.neutralGray,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: brandConfig.typography.lineHeightRelaxed,
            }}
          >
            Start protecting your horses today with our AI monitoring system. 
            No special equipment needed - works with standard IP cameras.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}; 