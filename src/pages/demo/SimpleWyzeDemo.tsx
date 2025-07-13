import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { SimpleWyzeCamera } from '../../components/camera/SimpleWyzeCamera';
import { brandConfig } from '../../config/brandConfig';

export const SimpleWyzeDemo: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ 
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.background 
    }}>
      <Box sx={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <Typography variant="h3" sx={{ 
          color: brandConfig.colors.stableMahogany,
          fontWeight: brandConfig.typography.weightBold,
          marginBottom: brandConfig.spacing.md
        }}>
          Wyze Camera Demo
        </Typography>
        <Typography variant="h6" sx={{ 
          color: brandConfig.colors.textSecondary,
          fontSize: brandConfig.typography.fontSizeLg
        }}>
          Simple camera feed from Wyze bridge
        </Typography>
      </Box>

      <SimpleWyzeCamera refreshInterval={3} />

      <Box sx={{ 
        marginTop: brandConfig.spacing.xl,
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.arenaSand,
        borderRadius: brandConfig.layout.borderRadius
      }}>
        <Typography variant="h6" sx={{ 
          color: brandConfig.colors.stableMahogany,
          fontWeight: brandConfig.typography.weightBold,
          marginBottom: brandConfig.spacing.md
        }}>
          Requirements
        </Typography>
        <Typography variant="body1" sx={{ 
          color: brandConfig.colors.textSecondary,
          marginBottom: brandConfig.spacing.sm
        }}>
          • Wyze bridge running on localhost:8888
        </Typography>
        <Typography variant="body1" sx={{ 
          color: brandConfig.colors.textSecondary,
          marginBottom: brandConfig.spacing.sm
        }}>
          • Camera accessible at http://localhost:8888/snapshot/wyze.jpg
        </Typography>
        <Typography variant="body1" sx={{ 
          color: brandConfig.colors.textSecondary
        }}>
          • No AI analysis - just simple image display
        </Typography>
      </Box>
    </Container>
  );
}; 