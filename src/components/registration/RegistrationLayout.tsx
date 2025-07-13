import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Paper, Typography, LinearProgress, Link } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import { useNavigation } from '../../contexts/NavigationContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import { Logo } from '../common/Logo';

interface IRegistrationLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  showProgress?: boolean;
}

export const RegistrationLayout: React.FC<IRegistrationLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  showProgress = true
}) => {
  const { navigateTo } = useNavigation();
  const isComplete = currentStep > totalSteps;
  const progressPercentage = isComplete ? 100 : (currentStep / totalSteps) * 100;

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const handleHelpClick = () => {
    // Could navigate to help page or open chat
    window.open('mailto:support@onebarn.ai?subject=Registration Help', '_blank');
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: brandConfig.gradients.heroPrimary,
      position: 'relative',
      overflow: 'hidden'
    },
    // Minimal Registration Header
    registrationHeader: {
      position: 'relative',
      zIndex: 100,
      padding: brandConfig.spacing.lg,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(245, 230, 211, 0.2)'
    },
    headerContent: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      cursor: 'pointer',
      letterSpacing: '-0.02em',
      transition: 'all 0.2s ease',
      '&:hover': {
        opacity: 0.8
      }
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.lg
    },
    headerLink: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      color: brandConfig.colors.arenaSand,
      textDecoration: 'none',
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightMedium,
      opacity: 0.8,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        opacity: 1,
        textDecoration: 'none'
      }
    },
    container: {
      paddingY: brandConfig.spacing.xxl,
      paddingX: brandConfig.spacing.md,
      position: 'relative',
      zIndex: 10
    },
    backgroundPattern: {
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
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.xxl
    },
    logoArea: {
      marginBottom: brandConfig.spacing.xl
    },
    brandLogo: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.sm,
      fontFamily: brandConfig.typography.fontDisplay,
      letterSpacing: '-0.02em'
    },
    tagline: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.arenaSand,
      fontWeight: brandConfig.typography.weightMedium,
      opacity: 0.9
    },
    progressSection: {
      marginBottom: brandConfig.spacing.xl,
      backgroundColor: 'rgba(245, 230, 211, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '20px',
      padding: brandConfig.spacing.lg,
      border: '1px solid rgba(245, 230, 211, 0.2)'
    },
    progressBar: {
      height: '12px',
      borderRadius: '6px',
      backgroundColor: 'rgba(245, 230, 211, 0.2)',
      marginBottom: brandConfig.spacing.md,
      '& .MuiLinearProgress-bar': {
        backgroundColor: brandConfig.colors.championGold,
        borderRadius: '6px',
        background: `linear-gradient(90deg, ${brandConfig.colors.championGold} 0%, ${brandConfig.colors.stableMahogany} 100%)`
      }
    },
    progressText: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.arenaSand,
      textAlign: 'center' as const,
      fontWeight: brandConfig.typography.weightMedium
    },
    stepHeader: {
      marginBottom: brandConfig.spacing.xl
    },
    stepTitle: {
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.md,
      textAlign: 'center' as const,
      fontFamily: brandConfig.typography.fontDisplay,
      letterSpacing: '-0.02em',
      lineHeight: brandConfig.typography.lineHeightTight
    },
    stepDescription: {
      fontSize: brandConfig.typography.fontSizeXl,
      color: brandConfig.colors.arenaSand,
      textAlign: 'center' as const,
      maxWidth: '700px',
      margin: '0 auto',
      opacity: 0.9,
      lineHeight: brandConfig.typography.lineHeightRelaxed
    },
    formContainer: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '24px',
      padding: brandConfig.spacing.xxl,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      maxWidth: '900px',
      margin: '0 auto',
      border: '1px solid rgba(245, 230, 211, 0.2)'
    },
    securityBadge: {
      textAlign: 'center' as const,
      marginTop: brandConfig.spacing.xl,
      padding: brandConfig.spacing.lg,
      backgroundColor: 'rgba(245, 230, 211, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '20px',
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.arenaSand,
      fontWeight: brandConfig.typography.weightMedium,
      border: '1px solid rgba(245, 230, 211, 0.2)'
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      {/* Minimal Registration Header */}
      <Box sx={styles.registrationHeader}>
        <Box sx={styles.headerContent}>
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Logo 
              variant="registration" 
              theme="light" 
              onClick={handleLogoClick}
            />
          </Box>
          
          <Box sx={styles.headerActions}>
            <Link
              sx={styles.headerLink}
              onClick={handleLogoClick}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HomeIcon fontSize="small" />
              Home
            </Link>
            <Link
              sx={styles.headerLink}
              onClick={handleHelpClick}
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HelpOutlineIcon fontSize="small" />
              Help
            </Link>
          </Box>
        </Box>
      </Box>
      
      {/* Background Pattern */}
      <Box sx={styles.backgroundPattern} />
      
      <Box sx={styles.container}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: brandConfig.animations.durations.slow }}
            sx={styles.header}
          >
            <Box sx={styles.logoArea}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: brandConfig.animations.delays.section, 
                  duration: brandConfig.animations.durations.normal 
                }}
                sx={{ display: 'flex', justifyContent: 'center', marginBottom: brandConfig.spacing.sm }}
              >
                <Logo 
                  variant="registration" 
                  theme="light"
                />
              </Box>
              <Typography
                component={motion.p}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: brandConfig.animations.delays.section + 0.1, 
                  duration: brandConfig.animations.durations.normal 
                }}
                sx={styles.tagline}
              >
                Never Wonder About Your Horse Again
              </Typography>
            </Box>

            {/* Progress Indicator */}
            {showProgress && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: brandConfig.animations.delays.section + 0.2, 
                  duration: brandConfig.animations.durations.normal 
                }}
                sx={styles.progressSection}
              >
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={styles.progressBar}
                />
                <Typography sx={styles.progressText}>
                  {isComplete 
                    ? "🎉 Registration Complete!" 
                    : `Step ${currentStep} of ${totalSteps} • ${Math.round(progressPercentage)}% Complete`
                  }
                </Typography>
              </Box>
            )}

            {/* Step Header */}
            <Box sx={styles.stepHeader}>
              <Typography
                component={motion.h2}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: brandConfig.animations.delays.section + 0.3, 
                  duration: brandConfig.animations.durations.normal 
                }}
                sx={styles.stepTitle}
              >
                {stepTitle}
              </Typography>
              {stepDescription && (
                <Typography
                  component={motion.p}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: brandConfig.animations.delays.section + 0.4, 
                    duration: brandConfig.animations.durations.normal 
                  }}
                  sx={styles.stepDescription}
                >
                  {stepDescription}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Form Container */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: brandConfig.animations.delays.section + 0.5, 
              duration: brandConfig.animations.durations.slow,
              type: "spring",
              stiffness: 100
            }}
            sx={styles.formContainer}
            elevation={0}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: brandConfig.animations.delays.section + 0.7, 
                duration: brandConfig.animations.durations.normal 
              }}
            >
              {children}
            </motion.div>
          </Paper>

          {/* Security Badge */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: brandConfig.animations.delays.section + 0.8, 
              duration: brandConfig.animations.durations.normal 
            }}
            sx={styles.securityBadge}
          >
            🔒 Your information is protected with enterprise-grade security
          </Box>
        </Container>
      </Box>
    </Box>
  );
}; 