/**
 * Simple AI Status - Test Component
 * 
 * Simplified version to test integration without color property issues
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip
} from '@mui/material';
import {
  Psychology as AIIcon,
  CheckCircle as SuccessIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';

interface ISimpleAIStatusProps {
  onOpenDashboard?: () => void;
}

export const SimpleAIStatus: React.FC<ISimpleAIStatusProps> = ({
  onOpenDashboard
}) => {
  const { user } = useAuth();
  
  // Demo account validation
  const isDemoAccount = user?.email === 'demo@onebarnai.com';
  
  if (!isDemoAccount) {
    return (
      <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, padding: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
            💼 AI Monitor
          </Typography>
          <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
            Demo account required (demo@onebarnai.com)
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, padding: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <AIIcon sx={{ color: brandConfig.colors.stableMahogany, fontSize: '2rem' }} />
          <Box>
            <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
              💼 AI Analysis System
            </Typography>
            <Typography variant="body2" sx={{ color: brandConfig.colors.neutralGray }}>
              Phase 2 Integration Active
            </Typography>
          </Box>
          
          <Chip
            icon={<SuccessIcon />}
            label="DEMO MODE"
            sx={{
              backgroundColor: brandConfig.colors.successGreen,
              color: brandConfig.colors.barnWhite
            }}
          />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
              95%
            </Typography>
            <Typography variant="caption" sx={{ color: brandConfig.colors.neutralGray }}>
              System Health
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
              24
            </Typography>
            <Typography variant="caption" sx={{ color: brandConfig.colors.neutralGray }}>
              Workflows
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
              12%
            </Typography>
            <Typography variant="caption" sx={{ color: brandConfig.colors.neutralGray }}>
              Storage Used
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.barnWhite
            }}
            onClick={onOpenDashboard}
          >
            Open AI Dashboard
          </Button>
          
          <Button
            variant="outlined"
            sx={{
              borderColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.stableMahogany
            }}
          >
            Start Workflow
          </Button>
        </Box>
        
        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: brandConfig.colors.neutralGray }}>
            🔄 Automated: 3 photos every 20min (day) / 5min (night)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimpleAIStatus; 