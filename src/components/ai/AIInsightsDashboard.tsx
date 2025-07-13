// AI Insights Dashboard Component
// Displays AI-generated insights, analytics, and recommendations

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  AlertTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
  MonitorHeart as HealthIcon,
  EmojiEvents as PerformanceIcon,
  AttachMoney as FinancialIcon,
  Pets as BehavioralIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { 
  useHorseInsights, 
  useInsightFilters, 
  useInsightStats,
  useAIProviders 
} from '../../hooks/useAIAnalytics';
import type { AnalyticsInsight } from '../../services/analyticsEngine';
import { aiConfig } from '../../config/aiConfig';

interface AIInsightsDashboardProps {
  horseId?: string;
  horseIds?: string[];
  title?: string;
  showFilters?: boolean;
  maxInsights?: number;
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({
  horseId,
  horseIds = [],
  title = 'AI Insights Dashboard',
  showFilters = true,
  maxInsights = 10
}) => {
  const [selectedHorse, setSelectedHorse] = useState(horseId || horseIds[0] || '');
  
  // Get insights for the selected horse
  const { 
    insights, 
    isLoading, 
    error, 
    refreshInsights 
  } = useHorseInsights(selectedHorse);

  // Filter and sort insights
  const {
    filteredInsights,
    filters,
    setFilters,
    totalInsights,
    filteredCount
  } = useInsightFilters(insights);

  // Get insight statistics
  const stats = useInsightStats(insights);

  // Get AI provider status
  const { availableProviders, providerStatus, isAnyProviderAvailable } = useAIProviders();

  // Display limited insights
  const displayInsights = filteredInsights.slice(0, maxInsights);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return aiConfig.visualization.colors.criticalPriority;
      case 'high': return aiConfig.visualization.colors.highPriority;
      case 'medium': return aiConfig.visualization.colors.mediumPriority;
      default: return '#757575';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return <HealthIcon />;
      case 'performance': return <PerformanceIcon />;
      case 'financial': return <FinancialIcon />;
      case 'behavioral': return <BehavioralIcon />;
      default: return <InfoIcon />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'high': return <WarningIcon color="warning" />;
      case 'medium': return <InfoIcon color="info" />;
      default: return <CheckCircleIcon color="success" />;
    }
  };

  if (!isAnyProviderAvailable) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            <AlertTitle>AI Providers Not Available</AlertTitle>
            No AI providers are currently available. Please check your API configuration.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="600">
          {title}
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Tooltip title="Refresh Insights">
            <IconButton onClick={refreshInsights} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Chip 
            icon={<PsychologyIcon />}
            label={`${availableProviders.length} AI Provider${availableProviders.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Horse Selection */}
      {(horseIds.length > 1 || !horseId) && (
        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel>Select Horse</InputLabel>
            <Select
              value={selectedHorse}
              onChange={(e) => setSelectedHorse(e.target.value)}
              label="Select Horse"
            >
              {horseIds.map(id => (
                <MenuItem key={id} value={id}>
                  Horse {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Insights
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Critical Issues
              </Typography>
              <Typography variant="h4" component="div" color="error">
                {stats.byPriority.critical}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Confidence
              </Typography>
              <Typography variant="h4" component="div">
                {(stats.averageConfidence * 100).toFixed(0)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Health Alerts
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {stats.byType.health}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                    label="Type"
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="health">Health</MenuItem>
                    <MenuItem value="performance">Performance</MenuItem>
                    <MenuItem value="financial">Financial</MenuItem>
                    <MenuItem value="behavioral">Behavioral</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                    label="Priority"
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    label="Sort By"
                  >
                    <MenuItem value="priority">Priority</MenuItem>
                    <MenuItem value="confidence">Confidence</MenuItem>
                    <MenuItem value="riskScore">Risk Score</MenuItem>
                    <MenuItem value="createdAt">Date Created</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>
                  Min Confidence: {(filters.minConfidence * 100).toFixed(0)}%
                </Typography>
                <Slider
                  value={filters.minConfidence}
                  onChange={(_, value) => setFilters({ ...filters, minConfidence: value as number })}
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                />
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" mt={2}>
              Showing {filteredCount} of {totalInsights} insights
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error Loading Insights</AlertTitle>
          {error.message}
        </Alert>
      )}

      {/* Insights List */}
      {!isLoading && !error && (
        <Box>
          {displayInsights.length === 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" color="textSecondary" textAlign="center">
                  No insights available for the selected filters
                </Typography>
              </CardContent>
            </Card>
          ) : (
            displayInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

// Individual Insight Card Component
interface InsightCardProps {
  insight: AnalyticsInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'success';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return <HealthIcon />;
      case 'performance': return <PerformanceIcon />;
      case 'financial': return <FinancialIcon />;
      case 'behavioral': return <BehavioralIcon />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getTypeIcon(insight.type)}
            <Typography variant="h6" component="h3">
              {insight.title}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Chip 
              label={insight.priority.toUpperCase()} 
              color={getPriorityColor(insight.priority) as any}
              size="small"
            />
            <Chip 
              label={insight.type.toUpperCase()} 
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Typography variant="body1" color="textSecondary" mb={2}>
          {insight.description}
        </Typography>

        {/* Metrics */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Risk Score
              </Typography>
              <Typography variant="h6">
                {(insight.riskScore * 100).toFixed(0)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={insight.riskScore * 100}
                color={insight.riskScore > 0.7 ? 'error' : insight.riskScore > 0.4 ? 'warning' : 'success'}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Confidence
              </Typography>
              <Typography variant="h6">
                {(insight.confidence * 100).toFixed(0)}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={insight.confidence * 100}
                color="primary"
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary">
                AI Provider
              </Typography>
              <Typography variant="h6">
                {insight.aiProvider.toUpperCase()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Recommendations */}
        {insight.recommendations.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                Recommendations ({insight.recommendations.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {insight.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Timeline: {rec.timeline} | Priority: {rec.priority}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Expected Outcome: {rec.expectedOutcome}
                          </Typography>
                          {rec.cost && (
                            <Typography variant="body2" color="textSecondary">
                              Estimated Cost: ${rec.cost}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Metadata */}
        <Box display="flex" justifyContent="between" alignItems="center" mt={2} pt={2} borderTop="1px solid #e0e0e0">
          <Typography variant="caption" color="textSecondary">
            Created: {format(new Date(insight.createdAt), 'MMM dd, yyyy HH:mm')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Expires: {format(new Date(insight.expiresAt), 'MMM dd, yyyy HH:mm')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIInsightsDashboard;
