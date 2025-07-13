import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import { 
  Camera, 
  Activity, 
  Brain, 
  Shield,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { ISystemStatusSection } from '../../interfaces/HomePageTypes';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface SystemStatusSectionProps {
  systemStatus: ISystemStatusSection;
}

export const SystemStatusSection: React.FC<SystemStatusSectionProps> = ({ systemStatus }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  // Status mapping for icons and colors
  const getStatusConfig = (status: string | undefined, value: string) => {
    if (status === 'ready' || value === 'Ready' || value === 'Guardian Ready') {
      return {
        icon: <CheckCircle size={24} />,
        color: brandConfig.colors.successGreen,
        bgColor: `${brandConfig.colors.successGreen}15`,
        label: 'Ready',
      };
    }
    
    if (value === 'Watching' || value === 'Online') {
      return {
        icon: <Activity size={24} />,
        color: brandConfig.colors.ribbonBlue,
        bgColor: `${brandConfig.colors.ribbonBlue}15`,
        label: 'Active',
      };
    }
    
    if (value === '0') {
      return {
        icon: <AlertCircle size={24} />,
        color: brandConfig.colors.alertAmber,
        bgColor: `${brandConfig.colors.alertAmber}15`,
        label: 'Standby',
      };
    }

    return {
      icon: <Shield size={24} />,
      color: brandConfig.colors.ribbonBlue,
      bgColor: `${brandConfig.colors.ribbonBlue}15`,
      label: 'Active',
    };
  };

  const statusItems = [
    {
      ...systemStatus.activeCameras,
      icon: <Camera size={32} />,
      title: 'Active Monitoring',
      config: getStatusConfig(systemStatus.activeCameras.status, systemStatus.activeCameras.value),
    },
    {
      ...systemStatus.monitoringStatus,
      icon: <Shield size={32} />,
      title: 'Guardian System',
      config: getStatusConfig(undefined, systemStatus.monitoringStatus.value),
    },
    {
      ...systemStatus.aiAnalysis,
      icon: <Brain size={32} />,
      title: 'AI Analysis Engine',
      config: getStatusConfig(undefined, systemStatus.aiAnalysis.value),
    },
  ];

  return (
    <Box
      ref={sectionRef}
      sx={{
        backgroundColor: brandConfig.colors.surface,
        py: 8,
        borderTop: `1px solid ${brandConfig.colors.sterlingSilver}40`,
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
            System Status
          </Typography>
          <Typography
            sx={{
              fontSize: brandConfig.typography.fontSizeLg,
              color: brandConfig.colors.textSecondary,
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: brandConfig.typography.lineHeightRelaxed,
            }}
          >
            Real-time monitoring of your horse protection system
          </Typography>
        </Box>

        {/* Status Cards Grid */}
        <Grid container spacing={4}>
          {statusItems.map((item, index) => (
            <Grid item xs={12} md={4} key={item.label}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  delay: index * brandConfig.animations.delays.stagger + 0.2,
                  duration: brandConfig.animations.durations.normal,
                }}
                sx={{
                  height: '100%',
                  background: brandConfig.colors.barnWhite,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}30`,
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  transition: brandConfig.animations.transitions.smooth,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  {/* Status Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      backgroundColor: item.config.bgColor,
                      color: item.config.color,
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* Status Badge */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      icon={item.config.icon}
                      label={item.config.label}
                      sx={{
                        backgroundColor: item.config.bgColor,
                        color: item.config.color,
                        fontWeight: brandConfig.typography.weightSemiBold,
                        fontSize: brandConfig.typography.fontSizeSm,
                        '& .MuiChip-icon': {
                          color: item.config.color,
                        },
                      }}
                    />
                  </Box>

                  {/* Status Value */}
                  <Typography
                    sx={{
                      fontFamily: brandConfig.typography.fontDisplay,
                      fontSize: brandConfig.typography.fontSize3xl,
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      mb: 1,
                      lineHeight: brandConfig.typography.lineHeightTight,
                    }}
                  >
                    {item.value}
                  </Typography>

                  {/* Status Label */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      fontWeight: brandConfig.typography.weightMedium,
                      color: brandConfig.colors.textSecondary,
                      mb: 2,
                    }}
                  >
                    {item.label}
                  </Typography>

                  {/* Additional Status Info */}
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      color: brandConfig.colors.textSecondary,
                      opacity: 0.8,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {/* Pulse Animation for Active Status */}
                  {item.config.label === 'Active' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: item.config.color,
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { 
                            opacity: 1,
                            transform: 'scale(1)',
                          },
                          '50%': { 
                            opacity: 0.5,
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* System Health Summary */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            delay: 0.6, 
            duration: brandConfig.animations.durations.normal 
          }}
          sx={{
            mt: 6,
            p: 4,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <CheckCircle size={24} color={brandConfig.colors.successGreen} />
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.stableMahogany,
              }}
            >
              System Ready
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: brandConfig.typography.fontSizeBase,
              color: brandConfig.colors.textSecondary,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            Your horse protection system is operational and ready to monitor for emergencies. 
            All AI systems are online and standing guard.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}; 