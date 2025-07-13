import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { 
  AlertTriangle, 
  Zap, 
  Search, 
  Brain, 
  Smartphone, 
  Heart 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { IFeaturesSection } from '../../interfaces/HomePageTypes';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface FeaturesSectionProps {
  features: IFeaturesSection;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  // Map emoji icons to Lucide icons
  const getIcon = (iconString: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '🚨': <AlertTriangle size={32} />,
      '⚡': <Zap size={32} />,
      '🔍': <Search size={32} />,
      '🧠': <Brain size={32} />,
      '📱': <Smartphone size={32} />,
      '🏥': <Heart size={32} />,
    };
    
    return iconMap[iconString] || <Brain size={32} />;
  };

  // Color mapping for different features
  const getFeatureColor = (index: number) => {
    const colors = [
      brandConfig.colors.victoryRose,
      brandConfig.colors.ribbonBlue,
      brandConfig.colors.championGold,
      brandConfig.colors.successGreen,
      brandConfig.colors.hunterGreen,
      brandConfig.colors.chestnutGlow,
    ];
    return colors[index % colors.length];
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        backgroundColor: brandConfig.colors.surface,
        py: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: brandConfig.animations.durations.normal }}
          sx={{ textAlign: 'center', mb: 8 }}
        >
          <Typography
            sx={{
              fontSize: { xs: brandConfig.typography.fontSize2xl, md: brandConfig.typography.fontSize3xl },
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.stableMahogany,
              mb: 2,
            }}
          >
            {features.sectionTitle}
          </Typography>
          <Typography
            sx={{
              fontSize: brandConfig.typography.fontSizeLg,
              color: brandConfig.colors.textSecondary,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: brandConfig.typography.lineHeightRelaxed,
            }}
          >
            Comprehensive AI monitoring designed to prevent emergencies and save lives
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.list.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={feature.id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  delay: index * brandConfig.animations.delays.stagger + 0.2,
                  duration: brandConfig.animations.durations.normal,
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: brandConfig.animations.durations.fast }
                }}
                sx={{
                  height: '100%',
                  background: brandConfig.gradients.statusCard,
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: brandConfig.animations.transitions.smooth,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    '& .feature-icon': {
                      transform: 'scale(1.1)',
                      color: getFeatureColor(index),
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Feature Icon */}
                  <Box
                    className="feature-icon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      backgroundColor: `${getFeatureColor(index)}20`,
                      color: getFeatureColor(index),
                      mb: 3,
                      transition: brandConfig.animations.transitions.smooth,
                    }}
                  >
                    {getIcon(feature.icon)}
                  </Box>

                  {/* Feature Title */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeXl,
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      mb: 2,
                      lineHeight: brandConfig.typography.lineHeightTight,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  {/* Feature Description */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.textSecondary,
                      lineHeight: brandConfig.typography.lineHeightRelaxed,
                      flexGrow: 1,
                    }}
                  >
                    {feature.description}
                  </Typography>

                  {/* Hover indicator */}
                  <Box
                    sx={{
                      width: 40,
                      height: 2,
                      backgroundColor: getFeatureColor(index),
                      borderRadius: '1px',
                      mt: 3,
                      transition: brandConfig.animations.transitions.smooth,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}; 