import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Container, Typography, Grid, Card, CardContent, Avatar, Rating } from '@mui/material';
import { useNavigation } from '../../contexts/NavigationContext';
import { brandConfig } from '../../config/brandConfig';
import { registrationFormData } from '../../config/registrationFormData';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';

export const RegistrationLanding: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleStartRegistration = () => {
    navigateTo('register-owner');
  };

  const handlePartnerRegistration = () => {
    navigateTo('register-owner'); // For now, same as regular registration
  };

  const handleLogoClick = () => {
    navigateTo('home');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: brandConfig.gradients.heroPrimary,
      position: 'relative',
      overflow: 'hidden'
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
    minimalHeader: {
      padding: brandConfig.spacing.lg,
      position: 'relative',
      zIndex: 10
    },
    logo: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      cursor: 'pointer',
      textAlign: 'left' as const,
      letterSpacing: '-0.02em',
      '&:hover': {
        opacity: 0.8
      }
    },
    content: {
      paddingY: brandConfig.spacing.xl,
      paddingX: brandConfig.spacing.md,
      position: 'relative',
      zIndex: 10
    },
    hero: {
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.xxl
    },
    heroTitle: {
      fontSize: brandConfig.typography.fontSize4xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.lg,
      lineHeight: brandConfig.typography.lineHeightTight,
      fontFamily: brandConfig.typography.fontDisplay,
      letterSpacing: '-0.02em'
    },
    heroSubtitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.md,
      fontWeight: brandConfig.typography.weightMedium,
      opacity: 0.9
    },
    heroDescription: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.arenaSand,
      maxWidth: '700px',
      margin: '0 auto',
      marginBottom: brandConfig.spacing.xl,
      lineHeight: brandConfig.typography.lineHeightRelaxed,
      opacity: 0.9
    },
    ctaSection: {
      marginBottom: brandConfig.spacing.xxl
    },
    primaryButton: {
      backgroundColor: brandConfig.colors.championGold,
      color: brandConfig.colors.midnightBlack,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.lg} ${brandConfig.spacing.xxl}`,
      borderRadius: '12px',
      marginBottom: brandConfig.spacing.md,
      minWidth: '320px',
      boxShadow: '0 8px 25px rgba(184, 134, 11, 0.3)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.championGold,
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 35px rgba(184, 134, 11, 0.4)'
      }
    },
    secondaryButton: {
      color: brandConfig.colors.arenaSand,
      fontSize: brandConfig.typography.fontSizeBase,
      textDecoration: 'underline',
      opacity: 0.8,
      '&:hover': {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
        opacity: 1
      }
    },
    valueProposition: {
      marginBottom: brandConfig.spacing.xxl
    },
    sectionHeading: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      textAlign: 'center' as const,
      marginBottom: brandConfig.spacing.xl,
      fontFamily: brandConfig.typography.fontDisplay
    },
    benefitsList: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    benefitItem: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: brandConfig.spacing.lg,
      padding: brandConfig.spacing.lg,
      backgroundColor: 'rgba(245, 230, 211, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      border: '1px solid rgba(245, 230, 211, 0.2)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(245, 230, 211, 0.15)',
        transform: 'translateY(-2px)'
      }
    },
    benefitIcon: {
      color: brandConfig.colors.championGold,
      marginRight: brandConfig.spacing.md,
      marginTop: '2px'
    },
    benefitText: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.arenaSand,
      lineHeight: brandConfig.typography.lineHeightRelaxed
    },
    testimonials: {
      marginBottom: brandConfig.spacing.xxl
    },
    testimonialCard: {
      backgroundColor: 'rgba(245, 230, 211, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: brandConfig.spacing.lg,
      height: '100%',
      border: '1px solid rgba(245, 230, 211, 0.2)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(245, 230, 211, 0.15)',
        transform: 'translateY(-4px)'
      }
    },
    testimonialQuote: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontStyle: 'italic',
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.md,
      lineHeight: brandConfig.typography.lineHeightRelaxed
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      marginTop: brandConfig.spacing.md
    },
    testimonialAvatar: {
      backgroundColor: brandConfig.colors.championGold,
      marginRight: brandConfig.spacing.sm,
      width: '40px',
      height: '40px'
    },
    testimonialName: {
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand
    },
    testimonialDetails: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.arenaSand,
      opacity: 0.7
    },
    guarantee: {
      textAlign: 'center' as const,
      backgroundColor: 'rgba(245, 230, 211, 0.1)',
      backdropFilter: 'blur(8px)',
      padding: brandConfig.spacing.xl,
      borderRadius: '20px',
      margin: '0 auto',
      maxWidth: '600px',
      border: '1px solid rgba(245, 230, 211, 0.2)'
    },
    guaranteeHeading: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: brandConfig.typography.fontDisplay
    },
    guaranteeIcon: {
      color: brandConfig.colors.championGold,
      marginRight: brandConfig.spacing.sm
    },
    guaranteeText: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.arenaSand,
      lineHeight: brandConfig.typography.lineHeightRelaxed,
      opacity: 0.9
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Background Pattern */}
      <Box sx={styles.backgroundPattern} />
      
      {/* Minimal Header - Just Logo */}
      <Box sx={styles.minimalHeader}>
        <Typography
          sx={styles.logo}
          onClick={handleLogoClick}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          One Barn AI
        </Typography>
      </Box>

      <Box sx={styles.content}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={styles.hero}
          >
            <Typography
              component={motion.h1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={styles.heroTitle}
            >
              {registrationFormData.landing.hero.title}
            </Typography>
            <Typography
              component={motion.h2}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={styles.heroSubtitle}
            >
              {registrationFormData.landing.hero.subtitle}
            </Typography>
            <Typography
              component={motion.p}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              sx={styles.heroDescription}
            >
              {registrationFormData.landing.hero.description}
            </Typography>
            
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              sx={styles.ctaSection}
            >
              <Button 
                variant="contained" 
                size="large"
                sx={styles.primaryButton}
                onClick={handleStartRegistration}
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {registrationFormData.landing.cta.primary}
              </Button>
              <br />
              <Button 
                variant="text"
                sx={styles.secondaryButton}
                onClick={handlePartnerRegistration}
              >
                {registrationFormData.landing.cta.secondary}
                <br />
                {registrationFormData.landing.cta.partnerLink}
              </Button>
            </Box>
          </Box>

          {/* Value Proposition */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            sx={styles.valueProposition}
          >
            <Typography sx={styles.sectionHeading}>
              {registrationFormData.landing.valueProposition.headline}
            </Typography>
            
            <Box sx={styles.benefitsList}>
              {registrationFormData.landing.valueProposition.benefits.map((benefit, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  sx={styles.benefitItem}
                >
                  <CheckCircleIcon sx={styles.benefitIcon} />
                  <Typography sx={styles.benefitText}>
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Testimonials */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            sx={styles.testimonials}
          >
            <Typography sx={styles.sectionHeading}>
              {registrationFormData.landing.social.testimonialHeading}
            </Typography>
            
            <Grid container spacing={3}>
              {registrationFormData.landing.social.testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                    sx={styles.testimonialCard}
                  >
                    <CardContent>
                      <Rating value={5} readOnly size="small" sx={{ color: brandConfig.colors.championGold }} />
                      <Typography sx={styles.testimonialQuote}>
                        "{testimonial.quote}"
                      </Typography>
                      <Box sx={styles.testimonialAuthor}>
                        <Avatar sx={styles.testimonialAvatar}>
                          {testimonial.author.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={styles.testimonialName}>
                            {testimonial.author}
                          </Typography>
                          <Typography sx={styles.testimonialDetails}>
                            {testimonial.location} • {testimonial.horses}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Guarantee */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            sx={styles.guarantee}
          >
            <Typography sx={styles.guaranteeHeading}>
              <VerifiedIcon sx={styles.guaranteeIcon} />
              {registrationFormData.landing.guarantee.heading}
            </Typography>
            <Typography sx={styles.guaranteeText}>
              {registrationFormData.landing.guarantee.text}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}; 