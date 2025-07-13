import React from 'react';
import { brandConfig } from '../config/brandConfig';
import { Header } from '../components/layout/Header';
import { useNavigation } from '../contexts/NavigationContext';
import QuickAccess from '../components/navigation/QuickAccess';

interface IFeatureCard {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface IStatistic {
  label: string;
  value: string;
  color: string;
}

export const Home: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  const features: IFeatureCard[] = [
    {
      icon: '🐎',
      title: 'Horse Management',
      description: 'Comprehensive care tracking and health monitoring for your horses',
      color: brandConfig.colors.stableMahogany,
    },
    {
      icon: '📋',
      title: 'Training Programs',
      description: 'Structured training schedules and progress tracking',
      color: brandConfig.colors.hunterGreen,
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'Data-driven insights for performance optimization',
      color: brandConfig.colors.ribbonBlue,
    },
    {
      icon: '💰',
      title: 'Billing & Finance',
      description: 'Streamlined invoicing and payment management',
      color: brandConfig.colors.championGold,
    },
    {
      icon: '👥',
      title: 'Client Portal',
      description: 'Secure access for horse owners and stakeholders',
      color: brandConfig.colors.pastureSage,
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Full functionality on any device, anywhere',
      color: brandConfig.colors.victoryRose,
    },
  ];

  const statistics: IStatistic[] = [
    { label: 'Active Horses', value: '150+', color: brandConfig.colors.successGreen },
    { label: 'Training Sessions', value: '2,500+', color: brandConfig.colors.ribbonBlue },
    { label: 'Happy Clients', value: '75+', color: brandConfig.colors.championGold },
    { label: 'Barn Partners', value: '25+', color: brandConfig.colors.stableMahogany },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontPrimary,
    },
    hero: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '4rem 0',
      textAlign: 'center' as const,
    },
    heroContent: {
      padding: '0 1.5rem',
    },
    heroTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: '3.5rem',
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      margin: '0 0 1rem 0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      lineHeight: brandConfig.typography.lineHeightTight,
    },
    heroSubtitle: {
      fontSize: brandConfig.typography.fontSizeXl,
      color: brandConfig.colors.midnightBlack,
      margin: '0 0 2rem 0',
      lineHeight: brandConfig.typography.lineHeightNormal,
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    ctaButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: '1rem 2rem',
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: brandConfig.layout.boxShadow,
      minHeight: brandConfig.mobile.touchTargets.glovedFriendly,
      minWidth: brandConfig.mobile.touchTargets.glovedFriendly,
    },
    statsSection: {
      backgroundColor: '#FFFFFF',
      padding: '3rem 0',
      borderTop: `4px solid ${brandConfig.colors.stableMahogany}`,
    },
    statsContent: {
      padding: '0 1.5rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      textAlign: 'center' as const,
    },
    statCard: {
      padding: '1.5rem',
    },
    statValue: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      margin: '0 0 0.5rem 0',
      lineHeight: brandConfig.typography.lineHeightTight,
    },
    statLabel: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.midnightBlack,
      fontWeight: brandConfig.typography.weightMedium,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.025em',
    },
    featuresSection: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '4rem 0',
    },
    featuresContent: {
      padding: '0 1.5rem',
    },
    sectionTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      textAlign: 'center' as const,
      margin: '0 0 3rem 0',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    featureCard: {
      backgroundColor: '#FFFFFF',
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      borderLeft: '6px solid',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'block',
    },
    featureTitle: {
      fontFamily: brandConfig.typography.fontPrimary,
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightSemiBold,
      margin: '0 0 1rem 0',
      color: brandConfig.colors.midnightBlack,
    },
    featureDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      lineHeight: brandConfig.typography.lineHeightRelaxed,
      color: brandConfig.colors.sterlingSilver,
      margin: '0',
    },
    footer: {
      backgroundColor: brandConfig.colors.midnightBlack,
      color: brandConfig.colors.arenaSand,
      padding: '2rem 0',
      textAlign: 'center' as const,
    },
    footerContent: {
      padding: '0 1.5rem',
    },
    footerText: {
      fontSize: brandConfig.typography.fontSizeBase,
      margin: '0',
      color: brandConfig.colors.sterlingSilver,
    },
  };

  const handleCtaClick = () => {
    navigateTo('login');
  };

  return (
    <div style={styles.container}>
      {/* Header with Navigation */}
      <Header />
      
      {/* Quick Access */}
      <QuickAccess />
      
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent} className="mobile-hero-content">
          <h1 style={styles.heroTitle} className="hero-title-mobile">
            Professional Horse<br />Training Management
          </h1>
          <p style={styles.heroSubtitle} className="hero-subtitle-mobile">
            Streamline your barn operations with our comprehensive multi-tenant platform
            designed specifically for equestrian professionals.
          </p>
          <button 
            style={styles.ctaButton}
            onClick={handleCtaClick}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#5A3124';
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = brandConfig.colors.stableMahogany;
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = brandConfig.layout.boxShadow;
            }}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContent} className="mobile-section-content">
          <div style={styles.statsGrid}>
            {statistics.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={{ ...styles.statValue, color: stat.color }}>
                  {stat.value}
                </div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.featuresContent} className="mobile-section-content">
          <h2 style={styles.sectionTitle}>Platform Features</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.featureCard,
                  borderLeftColor: feature.color,
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = brandConfig.layout.boxShadow;
                }}
              >
                <span style={styles.featureIcon}>{feature.icon}</span>
                <h3 style={{ ...styles.featureTitle, color: feature.color }}>
                  {feature.title}
                </h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent} className="mobile-section-content">
          <p style={styles.footerText}>
            © 2024 {brandConfig.application.companyName}. All rights reserved. | 
            Multi-Tenant Horse Training Platform v{brandConfig.application.version}
          </p>
        </div>
      </footer>
    </div>
  );
}; 