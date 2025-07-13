/**
 * 💡 Recommendation Panel Component
 * Displays AI-powered threshold optimization suggestions
 * Follows configuration-driven architecture and brandConfig styling
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  CheckCircle as ApplyIcon,
  Cancel as DismissIcon,
  InfoOutlined as InfoIcon,
  TrendingUp as ImpactIcon,
  Psychology as ConfidenceIcon
} from '@mui/icons-material';

import { brandConfig } from '../../../config/brandConfig';
import { aiTestingData } from '../../../config/aiTestingData';
import type {
  IRecommendationPanelProps,
  IRecommendationCardProps,
  IRecommendation
} from '../../../interfaces/AITestingTypes';

/**
 * Individual recommendation card component
 */
const RecommendationCard: React.FC<IRecommendationCardProps> = ({
  recommendation,
  onApply,
  onDismiss
}) => {
  const styles = {
    card: {
      marginBottom: brandConfig.spacing.sm,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
      borderRadius: brandConfig.spacing.sm,
      backgroundColor: brandConfig.colors.barnWhite,
      '&:hover': {
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.12)`,
        borderColor: brandConfig.colors.stableMahogany
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: brandConfig.spacing.sm
    },
    categoryChip: {
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightMedium,
      textTransform: 'uppercase' as const
    },
    title: {
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeBase,
      marginBottom: brandConfig.spacing.xs
    },
    description: {
      color: brandConfig.colors.textSecondary,
      fontSize: brandConfig.typography.fontSizeSm,
      lineHeight: brandConfig.typography.lineHeightNormal,
      marginBottom: brandConfig.spacing.sm
    },
    action: {
      color: brandConfig.colors.hunterGreen,
      fontWeight: brandConfig.typography.weightMedium,
      fontSize: brandConfig.typography.fontSizeSm,
      marginBottom: brandConfig.spacing.sm
    },
    metrics: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.sm
    },
    metricItem: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.neutralGray
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: brandConfig.spacing.sm
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      quality: brandConfig.colors.ribbonBlue,
      occupancy: brandConfig.colors.hunterGreen,
      motion: brandConfig.colors.championGold,
      duplicate: brandConfig.colors.victoryRose,
      general: brandConfig.colors.neutralGray
    };
    return colors[category as keyof typeof colors] || brandConfig.colors.neutralGray;
  };

  return (
    <Card sx={styles.card}>
      <CardContent>
        <Box sx={styles.header}>
          <Chip
            label={recommendation.category}
            size="small"
            sx={{
              ...styles.categoryChip,
              backgroundColor: getCategoryColor(recommendation.category),
              color: brandConfig.colors.barnWhite
            }}
          />
          <Tooltip title={aiTestingData.recommendations.actions.learnMore}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography sx={styles.title}>
          {recommendation.title}
        </Typography>

        <Typography sx={styles.description}>
          {recommendation.description}
        </Typography>

        <Typography sx={styles.action}>
          {recommendation.action}
        </Typography>

        <Box sx={styles.metrics}>
          <Box sx={styles.metricItem}>
            <ImpactIcon fontSize="small" />
            <Typography variant="caption">
              Impact: {recommendation.impact}
            </Typography>
          </Box>
          <Box sx={styles.metricItem}>
            <ConfidenceIcon fontSize="small" />
            <Typography variant="caption">
              Confidence: {Math.round(recommendation.confidence * 100)}%
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={styles.actions}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ApplyIcon />}
          onClick={onApply}
          sx={{
            backgroundColor: brandConfig.colors.successGreen,
            color: brandConfig.colors.barnWhite,
            '&:hover': {
              backgroundColor: brandConfig.colors.hunterGreen
            }
          }}
        >
          {aiTestingData.recommendations.actions.applyRecommendation}
        </Button>

        <Button
          variant="outlined"
          size="small"
          startIcon={<DismissIcon />}
          onClick={onDismiss}
          sx={{
            borderColor: brandConfig.colors.neutralGray,
            color: brandConfig.colors.neutralGray,
            '&:hover': {
              borderColor: brandConfig.colors.errorRed,
              color: brandConfig.colors.errorRed,
              backgroundColor: 'transparent'
            }
          }}
        >
          {aiTestingData.recommendations.actions.dismissRecommendation}
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * Main recommendation panel component
 */
export const RecommendationPanel: React.FC<IRecommendationPanelProps> = ({
  recommendations,
  onApply,
  onDismiss,
  compact = false
}) => {
  const styles = {
    container: {
      width: '100%'
    },
    header: {
      marginBottom: brandConfig.spacing.md
    },
    subtitle: {
      color: brandConfig.colors.textSecondary,
      fontSize: brandConfig.typography.fontSizeSm,
      marginTop: brandConfig.spacing.xs
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.xl,
      color: brandConfig.colors.neutralGray,
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.spacing.sm,
      border: `1px dashed ${brandConfig.colors.sterlingSilver}`
    },
    recommendationsList: {
      maxHeight: compact ? '300px' : '500px',
      overflowY: 'auto' as const,
      paddingRight: brandConfig.spacing.xs
    },
    categorySection: {
      marginBottom: brandConfig.spacing.lg
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md,
      paddingBottom: brandConfig.spacing.sm,
      borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    categoryTitle: {
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeLg
    },
    categoryCount: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: '12px',
      minWidth: '20px',
      textAlign: 'center' as const
    }
  };

  // Group recommendations by category
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, IRecommendation[]>);

  // Handle apply recommendation
  const handleApply = (id: string) => {
    onApply(id);
  };

  // Handle dismiss recommendation
  const handleDismiss = (id: string) => {
    onDismiss(id);
  };

  if (recommendations.length === 0) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.emptyState}>
          <Typography variant="body1" sx={{ marginBottom: brandConfig.spacing.sm }}>
            No recommendations available
          </Typography>
          <Typography variant="body2">
            Upload an image and adjust thresholds to receive optimization suggestions
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {!compact && (
        <Box sx={styles.header}>
          <Typography sx={styles.subtitle}>
            {aiTestingData.recommendations.subtitle}
          </Typography>
        </Box>
      )}

      <Box sx={styles.recommendationsList}>
        {Object.entries(groupedRecommendations).map(([category, categoryRecs]) => {
          const categoryData = aiTestingData.recommendations.categories[category as keyof typeof aiTestingData.recommendations.categories];
          
          return (
            <Box key={category} sx={styles.categorySection}>
              <Box sx={styles.categoryHeader}>
                <Typography sx={styles.categoryTitle}>
                  {categoryData?.title || category}
                </Typography>
                <Box sx={styles.categoryCount}>
                  {categoryRecs.length}
                </Box>
              </Box>

              {categoryRecs.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onApply={() => handleApply(recommendation.id)}
                  onDismiss={() => handleDismiss(recommendation.id)}
                />
              ))}
            </Box>
          );
        })}
      </Box>

      {recommendations.length > 5 && (
        <Alert 
          severity="info" 
          sx={{ marginTop: brandConfig.spacing.md }}
        >
          <Typography variant="body2">
            Showing {recommendations.length} optimization suggestions. 
            Apply recommendations one at a time to see immediate results.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}; 