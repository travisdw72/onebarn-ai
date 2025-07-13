import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  Eye, 
  Brain, 
  Shield, 
  Heart, 
  Zap, 
  CheckCircle, 
  Star,
  ArrowRight,
  Clock,
  AlertTriangle,
  Camera,
  Database,
  Stethoscope,
  Settings,
  Sparkles,
  TrendingUp,
  Building,
  Plug,
  DollarSign,
  Timer,
  ShieldCheck,
  Handshake,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { featuresConfig } from '../config/featuresPageConfig';
import { Header } from '../components/layout/Header';

export const Features: React.FC = () => {
  // Icon mapping for features
  const getIcon = (iconString: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'video-camera': <Camera size={32} />,
      'brain-circuit': <Brain size={32} />,
      'motion-sensor': <Zap size={32} />,
      'database': <Database size={32} />,
      'stethoscope': <Stethoscope size={32} />,
      'dashboard': <Settings size={32} />,
      'crystal-ball': <Sparkles size={32} />,
      'trending-up': <TrendingUp size={32} />,
      'building-network': <Building size={32} />,
      'plug-connection': <Plug size={32} />,
      'dollar-decrease': <DollarSign size={32} />,
      'medical-early': <Heart size={32} />,
      'shield-check': <ShieldCheck size={32} />,
      'handshake-trust': <Handshake size={32} />,
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
    <Box sx={{ minHeight: '100vh', backgroundColor: brandConfig.colors.background }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          overflow: 'hidden',
        }}
      >
        {/* Background Video Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(107, 58, 44, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  {featuresConfig.txt_hero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: brandConfig.typography.weightMedium,
                    mb: 4,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                  }}
                >
                  {featuresConfig.txt_hero_subheading}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayCircle />}
                  sx={{
                    backgroundColor: brandConfig.colors.championGold,
                    color: brandConfig.colors.midnightBlack,
                    fontSize: '1.1rem',
                    fontWeight: brandConfig.typography.weightBold,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: brandConfig.colors.championGold,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {featuresConfig.txt_hero_cta}
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: 'rgba(244, 232, 216, 0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${brandConfig.colors.championGold}`,
                  }}
                >
                  <PlayCircle size={80} color={brandConfig.colors.championGold} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SubHero - The Problem */}
      <Box sx={{ py: 8, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    color: brandConfig.colors.stableMahogany,
                    mb: 3,
                    textTransform: 'uppercase',
                  }}
                >
                  {featuresConfig.txt_subhero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.hunterGreen,
                    mb: 3,
                  }}
                >
                  {featuresConfig.txt_subhero_subheading}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.textSecondary,
                    mb: 3,
                  }}
                >
                  {featuresConfig.txt_subhero_description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.textSecondary,
                    fontWeight: brandConfig.typography.weightMedium,
                  }}
                >
                  {featuresConfig.txt_subhero_description2}
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Features Section */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              {featuresConfig.txt_features_overview_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                mb: 8,
              }}
            >
              {featuresConfig.txt_features_overview_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {featuresConfig.core_features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={feature.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
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
                        }}
                      >
                        {getIcon(feature.icon)}
                      </Box>
                      
                      <Chip
                        label={feature.category}
                        sx={{
                          backgroundColor: getFeatureColor(index),
                          color: brandConfig.colors.arenaSand,
                          fontWeight: brandConfig.typography.weightMedium,
                          mb: 2,
                        }}
                      />
                      
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                          mb: 3,
                        }}
                      >
                        {feature.description}
                      </Typography>
                      
                      <Box>
                        {feature.features.slice(0, 3).map((subFeature, subIndex) => (
                          <Box key={subIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle size={16} color={getFeatureColor(index)} />
                            <Typography
                              sx={{
                                fontSize: brandConfig.typography.fontSizeSm,
                                color: brandConfig.colors.textSecondary,
                                ml: 1,
                              }}
                            >
                              {subFeature}
                            </Typography>
                          </Box>
                        ))}
                        {feature.features.length > 3 && (
                          <Typography
                            sx={{
                              fontSize: brandConfig.typography.fontSizeSm,
                              color: getFeatureColor(index),
                              fontWeight: brandConfig.typography.weightMedium,
                              mt: 1,
                            }}
                          >
                            +{feature.features.length - 3} more features
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              {featuresConfig.txt_benefits_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                mb: 8,
              }}
            >
              {featuresConfig.txt_benefits_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {featuresConfig.benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={benefit.id}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      height: '100%',
                      background: brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      border: `1px solid ${brandConfig.colors.championGold}20`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          backgroundColor: `${brandConfig.colors.championGold}20`,
                          color: brandConfig.colors.championGold,
                          mr: 3,
                        }}
                      >
                        {getIcon(benefit.icon)}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: brandConfig.typography.fontSizeXl,
                            fontWeight: brandConfig.typography.weightBold,
                            color: brandConfig.colors.stableMahogany,
                            mb: 1,
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: brandConfig.typography.fontSizeSm,
                            color: brandConfig.colors.championGold,
                            fontWeight: brandConfig.typography.weightMedium,
                          }}
                        >
                          {benefit.metrics}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        color: brandConfig.colors.textSecondary,
                        lineHeight: brandConfig.typography.lineHeightRelaxed,
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Subscription Tiers */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: brandConfig.typography.weightBold,
                fontFamily: 'Bebas Neue, display',
                textAlign: 'center',
                color: brandConfig.colors.stableMahogany,
                mb: 2,
                textTransform: 'uppercase',
              }}
            >
              {featuresConfig.txt_subscription_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                mb: 8,
              }}
            >
              {featuresConfig.txt_subscription_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {featuresConfig.subscription_tiers.map((tier, index) => (
              <Grid item xs={12} md={6} lg={3} key={tier.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      background: tier.popular 
                        ? `linear-gradient(135deg, ${brandConfig.colors.championGold}10 0%, ${brandConfig.colors.stableMahogany}10 100%)`
                        : brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      border: tier.popular 
                        ? `2px solid ${brandConfig.colors.championGold}` 
                        : `1px solid ${brandConfig.colors.sterlingSilver}20`,
                      boxShadow: tier.popular 
                        ? '0 8px 30px rgba(212, 165, 116, 0.3)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {tier.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: brandConfig.colors.championGold,
                          color: brandConfig.colors.midnightBlack,
                          px: 3,
                          py: 0.5,
                          borderRadius: '20px',
                          fontSize: brandConfig.typography.fontSizeSm,
                          fontWeight: brandConfig.typography.weightBold,
                        }}
                      >
                        MOST POPULAR
                      </Box>
                    )}
                    
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 1,
                        }}
                      >
                        {tier.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                        <Typography
                          sx={{
                            fontSize: '2.5rem',
                            fontWeight: brandConfig.typography.weightBold,
                            color: tier.popular ? brandConfig.colors.championGold : brandConfig.colors.stableMahogany,
                          }}
                        >
                          {tier.price}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: brandConfig.typography.fontSizeBase,
                            color: brandConfig.colors.textSecondary,
                            ml: 1,
                          }}
                        >
                          {tier.period}
                        </Typography>
                      </Box>
                      
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          mb: 4,
                        }}
                      >
                        {tier.description}
                      </Typography>
                      
                      <Box sx={{ mb: 4 }}>
                        {tier.features.map((feature, featureIndex) => (
                          <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle size={16} color={brandConfig.colors.successGreen} />
                            <Typography
                              sx={{
                                fontSize: brandConfig.typography.fontSizeSm,
                                color: brandConfig.colors.textSecondary,
                                ml: 1,
                              }}
                            >
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      
                      <Button
                        variant={tier.popular ? "contained" : "outlined"}
                        fullWidth
                        sx={{
                          backgroundColor: tier.popular ? brandConfig.colors.championGold : 'transparent',
                          color: tier.popular ? brandConfig.colors.midnightBlack : brandConfig.colors.stableMahogany,
                          borderColor: tier.popular ? brandConfig.colors.championGold : brandConfig.colors.stableMahogany,
                          fontWeight: brandConfig.typography.weightBold,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: tier.popular ? brandConfig.colors.championGold : `${brandConfig.colors.stableMahogany}10`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {tier.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial CTA Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.arenaSand,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    mb: 3,
                  }}
                >
                  {featuresConfig.txt_cta_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.championGold,
                    mb: 4,
                  }}
                >
                  {featuresConfig.txt_cta_subheading}
                </Typography>
                
                <Box
                  sx={{
                    backgroundColor: `${brandConfig.colors.arenaSand}20`,
                    p: 3,
                    borderRadius: '12px',
                    borderLeft: `4px solid ${brandConfig.colors.championGold}`,
                    mb: 4,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeLg,
                      fontStyle: 'italic',
                      mb: 2,
                    }}
                  >
                    "{featuresConfig.txt_cta_testimonial}"
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.championGold,
                      fontWeight: brandConfig.typography.weightMedium,
                    }}
                  >
                    {featuresConfig.txt_cta_testimonial_author}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                  {[featuresConfig.txt_cta_point1, featuresConfig.txt_cta_point2, featuresConfig.txt_cta_point3].map((point, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle size={20} color={brandConfig.colors.championGold} />
                      <Typography sx={{ ml: 2, fontSize: brandConfig.typography.fontSizeBase }}>
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight />}
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      fontSize: '1.2rem',
                      fontWeight: brandConfig.typography.weightBold,
                      px: 4,
                      py: 2,
                      mb: 2,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.championGold,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {featuresConfig.txt_cta_button}
                  </Button>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.arenaSand,
                      opacity: 0.8,
                    }}
                  >
                    {featuresConfig.txt_cta_secondary}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}; 