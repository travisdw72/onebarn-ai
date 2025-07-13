import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Video, 
  AlertCircle, 
  BarChart3, 
  Shield, 
  Handshake,
  ArrowRight 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { IQuickAccessSection } from '../../interfaces/HomePageTypes';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useNavigation } from '../../contexts/NavigationContext';
import type { AppRoute } from '../../types/routes';

interface QuickAccessSectionProps {
  quickAccess: IQuickAccessSection;
}

export const QuickAccessSection: React.FC<QuickAccessSectionProps> = ({ quickAccess }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);
  const { navigateTo } = useNavigation();

  // Map emoji icons to Lucide icons
  const getIcon = (iconString: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '🔴': <Video size={28} />,
      '🚨': <AlertCircle size={28} />,
      '📊': <BarChart3 size={28} />,
      '🛡️': <Shield size={28} />,
      '🤝': <Handshake size={28} />,
      '🧪': <BarChart3 size={28} />, // Using BarChart3 as a substitute for test tube
      '🎯': <ArrowRight size={28} />, // Using ArrowRight for target/demo
    };
    
    return iconMap[iconString] || <Video size={28} />;
  };

  // Color mapping for different quick access items
  const getActionColor = (index: number) => {
    const colors = [
      brandConfig.colors.victoryRose,
      brandConfig.colors.alertAmber,
      brandConfig.colors.ribbonBlue,
      brandConfig.colors.successGreen,
      brandConfig.colors.championGold,
    ];
    return colors[index % colors.length];
  };

  const handleActionClick = (route: string) => {
    // Map routes to valid AppRoute types or handle navigation differently
    const routeMap: Record<string, AppRoute> = {
      '/camera-feed': 'camera-feed',
      '/emergency-setup': 'ai-dashboard', // Fallback to existing route
      '/health-reports': 'ai-insights',
      '/prevention-dashboard': 'ai-dashboard',
      'barn-partner-demo': 'barn-partner-demo',
      'ai-testing-single-image': 'ai-testing-single-image',
      'client-workflow-demo': 'client-workflow-demo',
    };
    
    const mappedRoute = routeMap[route] || 'ai-dashboard';
    navigateTo(mappedRoute);
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        backgroundColor: brandConfig.colors.arenaSand,
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
            {quickAccess.sectionTitle}
          </Typography>
          <Typography
            sx={{
              fontSize: brandConfig.typography.fontSizeLg,
              color: brandConfig.colors.stableMahogany,
              opacity: 0.8,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: brandConfig.typography.lineHeightRelaxed,
            }}
          >
            Essential tools to protect and monitor your horses
          </Typography>
        </Box>

        {/* Quick Access Grid - Responsive 2-column layout */}
        <Grid container spacing={4}>
          {quickAccess.items.map((item, index) => (
            <Grid 
              item 
              xs={12} 
              md={6} 
              lg={index < 2 ? 6 : 4} // First 2 items full width on large screens, rest in 3 columns
              key={item.id}
            >
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  delay: index * brandConfig.animations.delays.stagger + 0.3,
                  duration: brandConfig.animations.durations.normal,
                }}
                whileHover={{ 
                  y: -6, 
                  scale: 1.02,
                  transition: { duration: brandConfig.animations.durations.fast }
                }}
                sx={{
                  height: '100%',
                  background: brandConfig.colors.barnWhite,
                  border: `2px solid transparent`,
                  borderRadius: '20px',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
                  transition: brandConfig.animations.transitions.smooth,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: getActionColor(index),
                    boxShadow: '0 15px 45px rgba(0, 0, 0, 0.15)',
                    '& .action-icon': {
                      backgroundColor: getActionColor(index),
                      color: brandConfig.colors.barnWhite,
                      transform: 'scale(1.1)',
                    },
                    '& .action-arrow': {
                      transform: 'translateX(8px)',
                    },
                  },
                }}
                onClick={() => handleActionClick(item.route)}
              >
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Action Icon */}
                  <Box
                    className="action-icon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 72,
                      height: 72,
                      borderRadius: '18px',
                      backgroundColor: `${getActionColor(index)}15`,
                      color: getActionColor(index),
                      mb: 3,
                      transition: brandConfig.animations.transitions.smooth,
                    }}
                  >
                    {getIcon(item.icon)}
                  </Box>

                  {/* Action Title */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSize2xl,
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      mb: 2,
                      lineHeight: brandConfig.typography.lineHeightTight,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Action Description */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.textSecondary,
                      lineHeight: brandConfig.typography.lineHeightRelaxed,
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Call-to-Action Button */}
                  <Button
                    variant="text"
                    sx={{
                      alignSelf: 'flex-start',
                      color: getActionColor(index),
                      fontWeight: brandConfig.typography.weightSemiBold,
                      fontSize: brandConfig.typography.fontSizeBase,
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>Get Started</span>
                      <ArrowRight 
                        size={16} 
                        className="action-arrow"
                        style={{
                          transition: brandConfig.animations.transitions.smooth,
                        }}
                      />
                    </Box>
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}; 