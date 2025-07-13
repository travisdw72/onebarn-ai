/**
 * Dashboard Footer Component
 * Reusable footer for all dashboard pages
 * 
 * @description Consistent footer across all dashboard views
 * @author One Barn Development Team
 * @since v1.0.0
 */

import React from 'react';
import { Box, Typography, Divider, Link, Grid } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';

export const DashboardFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerStyles = {
    container: {
      backgroundColor: 'transparent',
      borderTop: `1px solid rgba(139, 69, 19, 0.2)`,
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      width: '100%'
    },
    
    content: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto'
    },
    
    section: {
      marginBottom: '1rem'
    },
    
    title: {
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: '0.5rem'
    },
    
    link: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.midnightBlack,
      textDecoration: 'none',
      display: 'block',
      marginBottom: '0.25rem',
      opacity: 0.7,
      '&:hover': {
        color: brandConfig.colors.hunterGreen,
        textDecoration: 'underline',
        opacity: 1
      }
    },
    
    copyright: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.midnightBlack,
      opacity: 0.6,
      textAlign: 'center' as const,
      paddingTop: '1rem',
      borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    
    brandText: {
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightSemiBold
    }
  };

  return (
    <Box sx={footerStyles.container}>
      <Box sx={footerStyles.content}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={3}>
            <Box sx={footerStyles.section}>
              <Box sx={{ marginBottom: '0.5rem' }}>
                <Box
                  component="img"
                  src="/images/one_barn_logo_dark.svg"
                  alt="One Barn AI"
                  sx={{
                    width: '200px',
                    height: '66px',
                    display: 'block'
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Platform Links */}
          <Grid item xs={12} md={2}>
            <Box sx={footerStyles.section}>
              <Typography sx={footerStyles.title}>
                Platform
              </Typography>
              <Link href="#" sx={footerStyles.link}>AI Dashboard</Link>
              <Link href="#" sx={footerStyles.link}>Live Monitoring</Link>
              <Link href="#" sx={footerStyles.link}>Horse Profiles</Link>
              <Link href="#" sx={footerStyles.link}>Video Analysis</Link>
              <Link href="#" sx={footerStyles.link}>Insights</Link>
            </Box>
          </Grid>

          {/* AI Features */}
          <Grid item xs={12} md={2}>
            <Box sx={footerStyles.section}>
              <Typography sx={footerStyles.title}>
                AI Features
              </Typography>
              <Link href="#" sx={footerStyles.link}>Computer Vision</Link>
              <Link href="#" sx={footerStyles.link}>Behavioral Analysis</Link>
              <Link href="#" sx={footerStyles.link}>Performance Tracking</Link>
              <Link href="#" sx={footerStyles.link}>Predictive Insights</Link>
              <Link href="#" sx={footerStyles.link}>Auto Alerts</Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={2}>
            <Box sx={footerStyles.section}>
              <Typography sx={footerStyles.title}>
                Support
              </Typography>
              <Link href="#" sx={footerStyles.link}>Help Center</Link>
              <Link href="#" sx={footerStyles.link}>Documentation</Link>
              <Link href="#" sx={footerStyles.link}>Contact Support</Link>
              <Link href="#" sx={footerStyles.link}>Training Videos</Link>
              <Link href="#" sx={footerStyles.link}>Status Page</Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={3}>
            <Box sx={footerStyles.section}>
              <Typography sx={footerStyles.title}>
                Legal & Compliance
              </Typography>
              <Link href="#" sx={footerStyles.link}>Privacy Policy</Link>
              <Link href="#" sx={footerStyles.link}>Terms of Service</Link>
              <Link href="#" sx={footerStyles.link}>HIPAA Compliance</Link>
              <Link href="#" sx={footerStyles.link}>Data Security</Link>
              <Link href="#" sx={footerStyles.link}>Cookie Policy</Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography sx={footerStyles.copyright}>
          © {currentYear} <span style={footerStyles.brandText}>One Barn Platform</span>. 
          All rights reserved. | Built with security, privacy, and performance in mind. | 
          AI-powered horse training management for the modern equestrian professional.
        </Typography>
      </Box>
    </Box>
  );
}; 