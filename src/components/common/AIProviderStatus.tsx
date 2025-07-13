import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Alert, Button, Grid } from '@mui/material';
import { CheckCircle, Warning, Error, Refresh } from '@mui/icons-material';
import { AIVisionService } from '../../services/aiVisionService';
import { brandConfig } from '../../config/brandConfig';

interface ProviderStatus {
  name: string;
  enabled: boolean;
  model: string;
  circuitOpen: boolean;
  status: 'active' | 'error' | 'unknown';
  lastError?: string;
}

export const AIProviderStatus: React.FC = () => {
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const aiVisionService = AIVisionService.getInstance();

  const checkProviderStatus = async () => {
    setLoading(true);
    try {
      // Get status from the provider manager
      const statuses = (aiVisionService as any).providerManager?.getProviderStatus() || [];
      
      const enhancedStatuses: ProviderStatus[] = statuses.map((status: any) => ({
        ...status,
        status: status.circuitOpen ? 'error' : (status.enabled ? 'active' : 'unknown'),
        lastError: status.circuitOpen ? 'Circuit breaker is open' : undefined
      }));

      setProviderStatuses(enhancedStatuses);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to check provider status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProviderStatus();
    const interval = setInterval(checkProviderStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: brandConfig.colors.successGreen }} />;
      case 'error':
        return <Error sx={{ color: brandConfig.colors.errorRed }} />;
      default:
        return <Warning sx={{ color: brandConfig.colors.warningOrange }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Card sx={{ margin: brandConfig.spacing.md }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany }}>
            AI Provider Status
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={checkProviderStatus}
            disabled={loading}
            sx={{ color: brandConfig.colors.stableMahogany }}
          >
            Refresh
          </Button>
        </Box>

        {lastUpdate && (
          <Typography variant="caption" color="textSecondary" mb={2} display="block">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        )}

        <Grid container spacing={2}>
          {providerStatuses.map((provider) => (
            <Grid item xs={12} md={6} key={provider.name}>
              <Box
                border={1}
                borderColor={brandConfig.colors.neutralGray}
                borderRadius={brandConfig.layout.borderRadius}
                p={2}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  {getStatusIcon(provider.status)}
                  <Typography variant="h6" sx={{ ml: 1, textTransform: 'capitalize' }}>
                    {provider.name}
                  </Typography>
                  <Chip
                    label={provider.enabled ? 'Enabled' : 'Disabled'}
                    color={provider.enabled ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Model:</strong> {provider.model}
                </Typography>

                <Chip
                  label={provider.status.toUpperCase()}
                  color={getStatusColor(provider.status) as any}
                  size="small"
                  variant="outlined"
                />

                {provider.circuitOpen && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Circuit breaker is open - provider temporarily disabled
                  </Alert>
                )}

                {provider.lastError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {provider.lastError}
                  </Alert>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {providerStatuses.length === 0 && (
          <Alert severity="warning">
            No AI providers configured. Please check your environment variables:
            <ul>
              <li>VITE_OPENAI_API_KEY</li>
              <li>VITE_ANTHROPIC_API_KEY</li>
            </ul>
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>🚀 Latest Updates:</strong>
            <br />
            • Updated OpenAI model from deprecated gpt-4-vision-preview to gpt-4o
            <br />
            • Added Claude 3.5 Sonnet with vision support as fallback
            <br />
            • Implemented circuit breaker pattern for automatic failover
            <br />
            • Enhanced error handling for deprecated models
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}; 