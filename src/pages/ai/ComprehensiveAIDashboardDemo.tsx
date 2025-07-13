// Comprehensive AI Dashboard Demo Page
// Showcases all AI training and competition capabilities

import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { ComprehensiveAIDashboard } from '../../components/ai/ComprehensiveAIDashboard';
import { brandConfig } from '../../config/brandConfig';

export const ComprehensiveAIDashboardDemo: React.FC = () => {
  const styles = {
    demoContainer: {
      backgroundColor: brandConfig.colors.midnightBlack,
      minHeight: '100vh',
      padding: '1rem'
    },
    demoHeader: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: '1rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '1rem',
      textAlign: 'center' as const
    },
    featureList: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: '1rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '1rem'
    }
  };

  return (
    <Box sx={styles.demoContainer}>
      {/* Demo Header */}
      <Box sx={styles.demoHeader}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          🤖 AI Training & Competition Command Center
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
          Complete AI-Powered Equestrian Training Platform
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Real-time analysis • Competition timing • Performance coaching • Health monitoring
        </Typography>
      </Box>

      {/* Feature Overview */}
      <Box sx={styles.featureList}>
        <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold', mb: 2 }}>
          🏆 Platform Capabilities
        </Typography>
        
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Live Training Analysis:</strong> Real-time AI coaching for Barrel Racing, Dressage, Show Jumping, 
            Team Roping, Cutting, Reining, Calf Roping, and Breakaway Roping
          </Typography>
        </Alert>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Competition Timing:</strong> Professional-grade timing systems with 0.01s precision, 
            automatic penalty detection, and live leaderboards
          </Typography>
        </Alert>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Health & Safety Monitoring:</strong> Continuous vital sign monitoring, behavior analysis, 
            fatigue detection, and predictive health insights
          </Typography>
        </Alert>

        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>AI System Status:</strong> Multi-provider AI system (OpenAI, Anthropic, Grok) with 
            load balancing and real-time performance monitoring
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary">
            🎯 Barrel Racing Analysis
          </Button>
          <Button variant="contained" color="secondary">
            🐎 Team Roping Timing
          </Button>
          <Button variant="contained" color="success">
            🏇 Cutting Horse AI
          </Button>
          <Button variant="contained" color="warning">
            🎪 Reining Pattern Analysis
          </Button>
          <Button variant="outlined" color="primary">
            🤠 Calf Roping Timer
          </Button>
          <Button variant="outlined" color="secondary">
            🎀 Breakaway Roping
          </Button>
        </Box>
      </Box>

      {/* Main Dashboard */}
      <ComprehensiveAIDashboard />

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: brandConfig.colors.stableMahogany, 
        color: brandConfig.colors.arenaSand,
        padding: '1rem',
        borderRadius: brandConfig.layout.borderRadius,
        marginTop: '2rem',
        textAlign: 'center' as const
      }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          🚀 One Barn AI Platform • Revolutionizing Equestrian Training • 
          Built with React, TypeScript, and MUI • Configuration-Driven Architecture
        </Typography>
      </Box>
    </Box>
  );
}; 