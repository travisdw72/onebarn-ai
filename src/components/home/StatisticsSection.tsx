import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Grid } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { IStatisticsSection } from '../../interfaces/HomePageTypes';
import { useIntersectionObserver, useCountUpAnimation } from '../../hooks/useIntersectionObserver';

interface StatisticsSectionProps {
  statistics: IStatisticsSection;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ statistics }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  // Parse numeric values for count-up animation
  const parseValue = (value: string) => {
    const numericValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
    return numericValue;
  };

  const horsesValue = useCountUpAnimation(parseValue(statistics.horsesAnalyzed.value), isVisible);
  const insightsValue = useCountUpAnimation(parseValue(statistics.aiInsights.value), isVisible);
  const videoValue = useCountUpAnimation(parseValue(statistics.videoHours.value), isVisible);
  const facilitiesValue = useCountUpAnimation(parseValue(statistics.facilities.value), isVisible);

  const formatDisplayValue = (originalValue: string, animatedValue: number) => {
    if (originalValue.includes('$')) {
      return `$${(animatedValue / 1000).toFixed(1)}M+`;
    }
    if (originalValue.includes('+')) {
      return `${animatedValue.toLocaleString()}+`;
    }
    return animatedValue.toString();
  };

  const statisticItems = [
    {
      ...statistics.horsesAnalyzed,
      animatedValue: horsesValue,
      color: brandConfig.colors.victoryRose,
    },
    {
      ...statistics.aiInsights,
      animatedValue: insightsValue,
      color: brandConfig.colors.successGreen,
    },
    {
      ...statistics.videoHours,
      animatedValue: videoValue,
      color: brandConfig.colors.championGold,
    },
    {
      ...statistics.facilities,
      animatedValue: facilitiesValue,
      color: brandConfig.colors.ribbonBlue,
    },
  ];

  return (
    <Box
      ref={sectionRef}
      sx={{
        backgroundColor: brandConfig.colors.barnWhite,
        py: 8,
        borderTop: `6px solid ${brandConfig.colors.ribbonBlue}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {statisticItems.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  delay: index * brandConfig.animations.delays.stagger,
                  duration: brandConfig.animations.durations.normal,
                }}
                sx={{
                  textAlign: 'center',
                  p: 4,
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: brandConfig.colors.arenaSand,
                  boxShadow: brandConfig.layout.boxShadow,
                  transition: brandConfig.animations.transitions.smooth,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: brandConfig.typography.fontDisplay,
                    fontSize: brandConfig.typography.fontSize4xl,
                    fontWeight: brandConfig.typography.weightBold,
                    color: stat.color,
                    mb: 1,
                    lineHeight: brandConfig.typography.lineHeightTight,
                  }}
                >
                  {formatDisplayValue(stat.value, stat.animatedValue)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: brandConfig.typography.fontSizeLg,
                    fontWeight: brandConfig.typography.weightMedium,
                    color: brandConfig.colors.stableMahogany,
                    lineHeight: brandConfig.typography.lineHeightNormal,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}; 