import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, Avatar, Paper, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Brain, 
  Clock, 
  Eye, 
  Zap, 
  Target, 
  Users, 
  Star,
  ArrowRight,
  Moon,
  AlertTriangle,
  CheckCircle,
  Award,
  TrendingUp,
  Stethoscope,
  Camera,
  Database,
  Lock,
  Sparkles,
  Building,
  Phone,
  Mail,
  Lightbulb,
  Code,
  UserCheck,
  Activity,
  Microscope,
  Headphones,
  GraduationCap,
  Globe,
  Rocket,
  HandHeart
} from 'lucide-react';
import { brandConfig } from '../config/brandConfig';
import { aboutConfig } from '../config/aboutConfig';
import { Header } from '../components/layout/Header';
import { CustomTimeline } from '../components/common/CustomTimeline';

export const About: React.FC = () => {
  // Icon mapping for various sections
  const getValueIcon = (letter: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'G': <HandHeart size={24} />,
      'U': <Eye size={24} />,
      'A': <Target size={24} />,
      'R': <Zap size={24} />,
      'D': <Brain size={24} />,
      'I': <Lightbulb size={24} />,
      'N': <Rocket size={24} />,
    };
    return iconMap[letter] || <Star size={24} />;
  };

  const getTeamIcon = (role: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Veterinary AI Specialists': <Stethoscope size={24} />,
      'Computer Vision Engineers': <Code size={24} />,
      'Equine Behaviorists': <UserCheck size={24} />,
      'Emergency Response Coordinators': <Headphones size={24} />,
    };
    return iconMap[role] || <Users size={24} />;
  };

  const getTimelineIcon = (year: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '2019': <Lightbulb size={20} />,
      '2020': <Building size={20} />,
      '2021': <Microscope size={20} />,
      '2022': <Stethoscope size={20} />,
      '2023': <Rocket size={20} />,
      '2024': <TrendingUp size={20} />,
      '2025': <Star size={20} />,
    };
    return iconMap[year] || <Star size={20} />;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandConfig.colors.background }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(135deg, rgba(107, 58, 44, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%), url(${aboutConfig.img_hero_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    color: brandConfig.colors.championGold,
                  }}
                >
                  {aboutConfig.txt_hero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.3rem', md: '1.8rem' },
                    fontWeight: brandConfig.typography.weightMedium,
                    mb: 4,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {aboutConfig.txt_hero_subheading}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: `${brandConfig.colors.championGold}20`,
                    border: `3px solid ${brandConfig.colors.championGold}`,
                    margin: '0 auto',
                  }}
                >
                  <Moon size={80} color={brandConfig.colors.championGold} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SubHero - The Midnight Hour */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.surface }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
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
                  {aboutConfig.txt_subhero_headline}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.3rem',
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.hunterGreen,
                    mb: 3,
                  }}
                >
                  {aboutConfig.txt_subhero_subheading}
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
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    mb: 3,
                  }}
                >
                  {aboutConfig.txt_subhero_description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    fontWeight: brandConfig.typography.weightMedium,
                  }}
                >
                  {aboutConfig.txt_subhero_description2}
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Founder's Vision */}
      <Box sx={{ py: 10, backgroundColor: brandConfig.colors.background }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    color: brandConfig.colors.stableMahogany,
                    mb: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  {aboutConfig.txt_founder_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.2rem',
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.hunterGreen,
                    mb: 4,
                  }}
                >
                  {aboutConfig.txt_founder_description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeBase,
                    color: brandConfig.colors.textSecondary,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {aboutConfig.txt_founder_content}
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <img
                    src={aboutConfig.img_founder_image}
                    alt="Founder with horses"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                      color: brandConfig.colors.arenaSand,
                      p: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        fontWeight: brandConfig.typography.weightMedium,
                      }}
                    >
                      "That night changed everything. The question wasn't whether the technology was possible—it was why no one had created it."
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Philosophy Section */}
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
              {aboutConfig.txt_philosophy_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.hunterGreen,
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                fontWeight: brandConfig.typography.weightMedium,
              }}
            >
              {aboutConfig.txt_philosophy_description}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeBase,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '900px',
                mx: 'auto',
                mb: 8,
                lineHeight: brandConfig.typography.lineHeightRelaxed,
                whiteSpace: 'pre-line',
              }}
            >
              {aboutConfig.txt_philosophy_content}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {[
              {
                title: aboutConfig.txt_philosophy_point1_title,
                description: aboutConfig.txt_philosophy_point1_description,
                icon: <Eye size={32} />,
                color: brandConfig.colors.victoryRose,
              },
              {
                title: aboutConfig.txt_philosophy_point2_title,
                description: aboutConfig.txt_philosophy_point2_description,
                icon: <Brain size={32} />,
                color: brandConfig.colors.ribbonBlue,
              },
              {
                title: aboutConfig.txt_philosophy_point3_title,
                description: aboutConfig.txt_philosophy_point3_description,
                icon: <Zap size={32} />,
                color: brandConfig.colors.championGold,
              },
            ].map((point, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
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
                          backgroundColor: `${point.color}20`,
                          color: point.color,
                          mb: 3,
                        }}
                      >
                        {point.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 2,
                        }}
                      >
                        {point.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                        }}
                      >
                        {point.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* GUARDIAN Values */}
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
              {aboutConfig.txt_values_heading}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeLg,
                textAlign: 'center',
                color: brandConfig.colors.hunterGreen,
                maxWidth: '800px',
                mx: 'auto',
                mb: 3,
                fontWeight: brandConfig.typography.weightMedium,
              }}
            >
              {aboutConfig.txt_values_description}
            </Typography>
            <Typography
              sx={{
                fontSize: brandConfig.typography.fontSizeBase,
                textAlign: 'center',
                color: brandConfig.colors.textSecondary,
                maxWidth: '900px',
                mx: 'auto',
                mb: 8,
                lineHeight: brandConfig.typography.lineHeightRelaxed,
              }}
            >
              {aboutConfig.txt_values_intro}
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {aboutConfig.values.map((value, index) => (
              <Grid item xs={12} md={6} lg={3} key={value.letter}>
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
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '8px',
                            backgroundColor: `${brandConfig.colors.championGold}20`,
                            color: brandConfig.colors.championGold,
                            mr: 2,
                            fontSize: '1.5rem',
                            fontWeight: brandConfig.typography.weightBold,
                          }}
                        >
                          {value.letter}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '8px',
                            backgroundColor: `${brandConfig.colors.stableMahogany}20`,
                            color: brandConfig.colors.stableMahogany,
                          }}
                        >
                          {getValueIcon(value.letter)}
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeLg,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 1,
                        }}
                      >
                        {value.value}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeSm,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                        }}
                      >
                        {value.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Journey Timeline */}
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
              {aboutConfig.txt_journey_heading}
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
              {aboutConfig.txt_journey_description}
            </Typography>
          </motion.div>

          <CustomTimeline 
            events={aboutConfig.timeline_events}
            getIcon={getTimelineIcon}
          />
        </Container>
      </Box>

      {/* Mission & Vision */}
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
              {aboutConfig.txt_mission_heading}
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
              {aboutConfig.txt_mission_description}
            </Typography>
          </motion.div>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${brandConfig.colors.ribbonBlue}10 0%, ${brandConfig.colors.championGold}05 100%)`,
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    border: `2px solid ${brandConfig.colors.ribbonBlue}20`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          backgroundColor: `${brandConfig.colors.ribbonBlue}20`,
                          color: brandConfig.colors.ribbonBlue,
                          mr: 3,
                        }}
                      >
                        <Target size={32} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '1.8rem',
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          fontFamily: 'Bebas Neue, display',
                        }}
                      >
                        {aboutConfig.txt_vision_title}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        color: brandConfig.colors.textSecondary,
                        lineHeight: brandConfig.typography.lineHeightRelaxed,
                      }}
                    >
                      {aboutConfig.txt_vision_content}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${brandConfig.colors.championGold}10 0%, ${brandConfig.colors.stableMahogany}05 100%)`,
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                    border: `2px solid ${brandConfig.colors.championGold}20`,
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: '16px',
                          backgroundColor: `${brandConfig.colors.championGold}20`,
                          color: brandConfig.colors.championGold,
                          mr: 3,
                        }}
                      >
                        <Rocket size={32} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '1.8rem',
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          fontFamily: 'Bebas Neue, display',
                        }}
                      >
                        {aboutConfig.txt_mission_title}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: brandConfig.typography.fontSizeBase,
                        color: brandConfig.colors.textSecondary,
                        lineHeight: brandConfig.typography.lineHeightRelaxed,
                      }}
                    >
                      {aboutConfig.txt_mission_content}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Impact Stories */}
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
              {aboutConfig.txt_impact_heading}
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
              {aboutConfig.txt_impact_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {aboutConfig.impact_stories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      background: brandConfig.gradients.statusCard,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
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
                          backgroundColor: `${brandConfig.colors.successGreen}20`,
                          color: brandConfig.colors.successGreen,
                          mb: 3,
                        }}
                      >
                        <Heart size={32} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeXl,
                          fontWeight: brandConfig.typography.weightBold,
                          color: brandConfig.colors.stableMahogany,
                          mb: 2,
                        }}
                      >
                        {story.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                          mb: 3,
                        }}
                      >
                        {story.description}
                      </Typography>
                      <Chip
                        label={story.outcome}
                        sx={{
                          backgroundColor: brandConfig.colors.successGreen,
                          color: brandConfig.colors.arenaSand,
                          fontWeight: brandConfig.typography.weightMedium,
                          mb: 1,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeSm,
                          color: brandConfig.colors.textSecondary,
                          fontStyle: 'italic',
                        }}
                      >
                        {story.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
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
              {aboutConfig.txt_team_heading}
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
              {aboutConfig.txt_team_description}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {aboutConfig.team_roles.map((role, index) => (
              <Grid item xs={12} md={6} key={index}>
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
                          mb: 3,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '12px',
                            backgroundColor: `${brandConfig.colors.hunterGreen}20`,
                            color: brandConfig.colors.hunterGreen,
                            mr: 3,
                          }}
                        >
                          {getTeamIcon(role.role)}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: brandConfig.typography.fontSizeXl,
                            fontWeight: brandConfig.typography.weightBold,
                            color: brandConfig.colors.stableMahogany,
                          }}
                        >
                          {role.role}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.textSecondary,
                          lineHeight: brandConfig.typography.lineHeightRelaxed,
                        }}
                      >
                        {role.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(135deg, rgba(107, 58, 44, 0.9) 0%, rgba(26, 26, 26, 0.95) 100%), url(${aboutConfig.img_cta_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: brandConfig.typography.weightBold,
                    fontFamily: 'Bebas Neue, display',
                    mb: 2,
                    textTransform: 'uppercase',
                    color: brandConfig.colors.championGold,
                  }}
                >
                  {aboutConfig.txt_cta_heading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: brandConfig.typography.weightMedium,
                    mb: 3,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {aboutConfig.txt_cta_subheading}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    mb: 4,
                    lineHeight: brandConfig.typography.lineHeightRelaxed,
                    color: brandConfig.colors.arenaSand,
                  }}
                >
                  {aboutConfig.txt_cta_description}
                </Typography>
                <Stack spacing={1} sx={{ mb: 4 }}>
                  {[
                    aboutConfig.txt_cta_point1,
                    aboutConfig.txt_cta_point2,
                    aboutConfig.txt_cta_point3,
                  ].map((point, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle 
                        size={20} 
                        color={brandConfig.colors.championGold} 
                        style={{ marginRight: '12px' }} 
                      />
                      <Typography
                        sx={{
                          fontSize: brandConfig.typography.fontSizeBase,
                          color: brandConfig.colors.arenaSand,
                        }}
                      >
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    href={aboutConfig.url_cta_button}
                    endIcon={<ArrowRight />}
                    sx={{
                      backgroundColor: brandConfig.colors.championGold,
                      color: brandConfig.colors.midnightBlack,
                      fontWeight: brandConfig.typography.weightBold,
                      px: 4,
                      py: 2,
                      fontSize: brandConfig.typography.fontSizeLg,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.championGold,
                        opacity: 0.9,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {aboutConfig.txt_cta_button}
                  </Button>
                  <Typography
                    sx={{
                      fontSize: brandConfig.typography.fontSizeBase,
                      color: brandConfig.colors.arenaSand,
                      alignSelf: 'center',
                    }}
                  >
                    {aboutConfig.txt_cta_secondary}
                  </Typography>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    backgroundColor: `${brandConfig.colors.championGold}20`,
                    border: `3px solid ${brandConfig.colors.championGold}`,
                    margin: '0 auto',
                  }}
                >
                  <Shield size={100} color={brandConfig.colors.championGold} />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 