// AI Analytics Page for Client Dashboard
// Comprehensive AI-powered insights and analytics for horse management

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  Psychology as AIIcon,
  MonitorHeart as HealthIcon,
  EmojiEvents as PerformanceIcon,
  AttachMoney as FinancialIcon,
  Pets as BehavioralIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { AIInsightsDashboard } from '../../components/ai/AIInsightsDashboard';
import { useAIProviders, useStableInsights } from '../../hooks/useAIAnalytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `ai-tab-${index}`,
    'aria-controls': `ai-tabpanel-${index}`,
  };
}

export const AIAnalyticsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Mock horse IDs - in real app, these would come from user's horses
  const horseIds = ['horse-1', 'horse-2', 'horse-3'];
  
  // Get AI provider status
  const { availableProviders, providerStatus, isAnyProviderAvailable, testProviders } = useAIProviders();
  
  // Get stable-wide insights
  const { insights: stableInsights, isLoading: stableLoading } = useStableInsights(horseIds);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Calculate summary stats
  const summaryStats = {
    totalInsights: stableInsights.length,
    criticalIssues: stableInsights.filter(i => i.priority === 'critical').length,
    healthAlerts: stableInsights.filter(i => i.type === 'health').length,
    performanceOpportunities: stableInsights.filter(i => i.type === 'performance').length,
    averageConfidence: stableInsights.length > 0 
      ? stableInsights.reduce((sum, i) => sum + i.confidence, 0) / stableInsights.length 
      : 0
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <AIIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1" fontWeight="600">
            AI Analytics Dashboard
          </Typography>
        </Box>
        <Typography variant="h6" color="textSecondary" mb={3}>
          AI-powered insights and recommendations for optimal horse management
        </Typography>

        {/* Provider Status */}
        <Box display="flex" gap={2} alignItems="center" mb={3}>
          <Typography variant="body2" color="textSecondary">
            AI Providers:
          </Typography>
          {availableProviders.map(provider => (
            <Chip
              key={provider}
              label={provider.toUpperCase()}
              color={providerStatus[provider] ? 'success' : 'error'}
              variant={providerStatus[provider] ? 'filled' : 'outlined'}
              size="small"
            />
          ))}
          <Button
            size="small"
            startIcon={<SettingsIcon />}
            onClick={testProviders}
            variant="outlined"
          >
            Test Providers
          </Button>
        </Box>

        {/* Warning if no providers available */}
        {!isAnyProviderAvailable && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>AI Providers Not Available</AlertTitle>
            No AI providers are currently available. Please configure your API keys in the environment variables:
            <ul>
              <li>VITE_OPENAI_API_KEY for OpenAI</li>
              <li>VITE_ANTHROPIC_API_KEY for Anthropic Claude</li>
              <li>VITE_GROK_API_KEY for Grok (when available)</li>
            </ul>
          </Alert>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {summaryStats.totalInsights}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Total Insights
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <HealthIcon color="error" />
                <Box>
                  <Typography variant="h4" component="div" color="error">
                    {summaryStats.criticalIssues}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Critical Issues
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <HealthIcon color="warning" />
                <Box>
                  <Typography variant="h4" component="div" color="warning.main">
                    {summaryStats.healthAlerts}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Health Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PerformanceIcon color="success" />
                <Box>
                  <Typography variant="h4" component="div" color="success.main">
                    {summaryStats.performanceOpportunities}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Performance Insights
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AIIcon color="primary" />
                <Box>
                  <Typography variant="h4" component="div">
                    {(summaryStats.averageConfidence * 100).toFixed(0)}%
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Avg Confidence
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="AI analytics tabs">
            <Tab 
              label="All Insights" 
              icon={<AIIcon />} 
              iconPosition="start"
              {...a11yProps(0)} 
            />
            <Tab 
              label="Health Analysis" 
              icon={<HealthIcon />} 
              iconPosition="start"
              {...a11yProps(1)} 
            />
            <Tab 
              label="Performance" 
              icon={<PerformanceIcon />} 
              iconPosition="start"
              {...a11yProps(2)} 
            />
            <Tab 
              label="Financial" 
              icon={<FinancialIcon />} 
              iconPosition="start"
              {...a11yProps(3)} 
            />
            <Tab 
              label="Behavioral" 
              icon={<BehavioralIcon />} 
              iconPosition="start"
              {...a11yProps(4)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <AIInsightsDashboard
            horseIds={horseIds}
            title="All AI Insights"
            showFilters={true}
            maxInsights={20}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AIInsightsDashboard
            horseIds={horseIds}
            title="Health Analysis & Predictions"
            showFilters={false}
            maxInsights={15}
          />
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Health Monitoring</AlertTitle>
            AI continuously monitors vital signs, feeding patterns, and activity levels to predict potential health issues before they become serious.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AIInsightsDashboard
            horseIds={horseIds}
            title="Performance Optimization"
            showFilters={false}
            maxInsights={15}
          />
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Performance Analytics</AlertTitle>
            Advanced algorithms analyze training data, competition results, and recovery patterns to optimize performance and prevent overtraining.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AIInsightsDashboard
            horseIds={horseIds}
            title="Financial Analysis & ROI"
            showFilters={false}
            maxInsights={15}
          />
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Financial Intelligence</AlertTitle>
            Track costs, revenue, and ROI across all aspects of horse management with predictive financial modeling.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <AIInsightsDashboard
            horseIds={horseIds}
            title="Behavioral Patterns & Anomalies"
            showFilters={false}
            maxInsights={15}
          />
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Behavioral Analysis</AlertTitle>
            AI identifies behavioral patterns and anomalies that may indicate stress, illness, or training issues.
          </Alert>
        </TabPanel>
      </Paper>

      {/* Footer Information */}
      <Box mt={4} p={3} bgcolor="grey.50" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          About AI Analytics
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Our AI analytics system uses multiple AI providers (OpenAI, Anthropic Claude, and Grok) to analyze your horse data 
          and provide actionable insights. The system continuously learns from patterns in health, performance, financial, 
          and behavioral data to help you make informed decisions about your horses' care and training.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          All insights include confidence scores and are backed by specific recommendations with timelines and expected outcomes.
          The AI system respects data privacy and only processes anonymized patterns to generate insights.
        </Typography>
      </Box>
    </Container>
  );
};

export default AIAnalyticsPage; 