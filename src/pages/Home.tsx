import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Build } from '@mui/icons-material';
import { brandConfig } from '../config/brandConfig';
import { homePageData } from '../config/homePageData';
import { useNavigation } from '../contexts/NavigationContext';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/home/HeroSection';
import { PrimaryActionsSection } from '../components/home/PrimaryActionsSection';
import { StatisticsSection } from '../components/home/StatisticsSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { QuickAccessSection } from '../components/home/QuickAccessSection';
import { SystemStatusSection } from '../components/home/SystemStatusSection';

export const Home: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.background,
        fontFamily: brandConfig.typography.fontPrimary,
      }}
    >
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        hero={homePageData.hero}
        aiStatus={homePageData.aiStatus}
        primaryAction={homePageData.primaryAction}
      />

      {/* Primary Actions - Main Workflow CTAs */}
      <PrimaryActionsSection primaryActions={homePageData.primaryActions} />

      {/* Statistics Section - Social Proof */}
      <StatisticsSection statistics={homePageData.statistics} />

      {/* Features Section - What We Monitor */}
      <FeaturesSection features={homePageData.features} />

      {/* Quick Access Section - For Existing Users */}
      <QuickAccessSection quickAccess={homePageData.quickAccess} />

      {/* System Status Section */}
      <SystemStatusSection systemStatus={homePageData.systemStatus} />

      {/* Developer Tools Access - Only show in development */}
      {brandConfig.application.environment === 'development' && (
        <Box
          sx={{
            backgroundColor: brandConfig.colors.neutralGray + '10',
            py: 2,
            borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: brandConfig.colors.neutralGray,
              mb: 1,
              fontSize: brandConfig.typography.fontSizeSm,
            }}
          >
            Development Mode
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Build />}
            onClick={() => navigateTo('debug-tools')}
            sx={{
              borderColor: brandConfig.colors.neutralGray,
              color: brandConfig.colors.neutralGray,
              fontSize: brandConfig.typography.fontSizeXs,
              '&:hover': {
                borderColor: brandConfig.colors.stableMahogany,
                color: brandConfig.colors.stableMahogany,
              },
            }}
          >
            Debug & Testing Tools
          </Button>
        </Box>
      )}
    </Box>
  );
}; 