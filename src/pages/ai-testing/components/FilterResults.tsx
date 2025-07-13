/**
 * 📊 Filter Results Component
 * Displays detailed AI optimization filter results with visual indicators
 * Shows individual filter performance and final decision
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';
import {
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  Schedule as TimeIcon,
  Assessment as ScoreIcon,
  PlayArrow as ProceedIcon,
  SkipNext as SkipIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import { brandConfig } from '../../../config/brandConfig';
import { aiTestingData } from '../../../config/aiTestingData';
import type { 
  IFilterResultsProps, 
  IFilterResultCardProps,
  IFilterResult,
  IThresholdValues 
} from '../../../interfaces/AITestingTypes';
import type { IPreProcessingResult } from '../../../interfaces/AIOptimizationTypes';

// Individual filter result card component
const FilterResultCard: React.FC<IFilterResultCardProps> = ({
  filter,
  isLoading,
  compact = false
}) => {
  const styles = {
    card: {
      padding: compact ? brandConfig.spacing.sm : brandConfig.spacing.md,
      border: `1px solid ${filter.passed 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed}`,
      borderRadius: brandConfig.spacing.sm,
      backgroundColor: filter.passed 
        ? `${brandConfig.colors.successGreen}10` 
        : `${brandConfig.colors.errorRed}10`,
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      opacity: isLoading ? 0.6 : 1,
      transition: 'all 0.3s ease'
    },
    icon: {
      fontSize: compact ? '1.5rem' : '2rem',
      color: filter.passed ? brandConfig.colors.successGreen : brandConfig.colors.errorRed
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.xs
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      fontSize: compact 
        ? brandConfig.typography.fontSizeSm 
        : brandConfig.typography.fontSizeBase
    },
    score: {
      fontWeight: brandConfig.typography.weightBold,
      color: filter.passed ? brandConfig.colors.successGreen : brandConfig.colors.errorRed,
      fontSize: compact 
        ? brandConfig.typography.fontSizeSm 
        : brandConfig.typography.fontSizeLg
    },
    details: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.sm,
      marginTop: brandConfig.spacing.xs
    },
    progressBar: {
      flex: 1,
      height: compact ? '4px' : '6px',
      borderRadius: brandConfig.spacing.xs,
      backgroundColor: brandConfig.colors.sterlingSilver
    }
  };

  const StatusIcon = filter.passed ? PassIcon : FailIcon;
  const progressValue = (filter.score / Math.max(filter.threshold, 100)) * 100;

  return (
    <Card sx={styles.card} elevation={0}>
      <StatusIcon sx={styles.icon} />
      
      <Box sx={styles.content}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>
            {filter.name}
          </Typography>
          <Typography sx={styles.score}>
            {filter.score.toFixed(1)}
          </Typography>
        </Box>
        
        <Typography sx={styles.details}>
          {filter.details}
        </Typography>
        
        {!compact && (
          <Box sx={styles.progressContainer}>
            <LinearProgress
              variant="determinate"
              value={Math.min(progressValue, 100)}
              sx={{
                ...styles.progressBar,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: filter.passed 
                    ? brandConfig.colors.successGreen 
                    : brandConfig.colors.errorRed
                }
              }}
            />
            <Typography variant="caption" sx={{ minWidth: '60px', textAlign: 'right' }}>
              {filter.threshold > 0 && `/ ${filter.threshold}`}
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

// Convert preprocessing results to filter result format
const convertToFilterResults = (
  results: IPreProcessingResult,
  thresholds: IThresholdValues
): IFilterResult[] => {
  const filterConfigs = aiTestingData.filterResults.filters;
  
  return [
    {
      name: filterConfigs.imageQuality.label,
      passed: results.imageQuality.passed,
      score: results.imageQuality.score,
      threshold: thresholds.imageQuality,
      details: results.imageQuality.passed 
        ? filterConfigs.imageQuality.passText 
        : filterConfigs.imageQuality.failText,
      icon: 'image',
      color: results.imageQuality.passed 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed
    },
    {
      name: filterConfigs.occupancy.label,
      passed: results.occupancy.hasOccupancy,
      score: results.occupancy.confidence * 100,
      threshold: thresholds.occupancy,
      details: results.occupancy.hasOccupancy 
        ? filterConfigs.occupancy.passText 
        : filterConfigs.occupancy.failText,
      icon: 'visibility',
      color: results.occupancy.hasOccupancy 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed
    },
    {
      name: filterConfigs.motion.label,
      passed: results.motion.motionDetected,
      score: results.motion.motionScore,
      threshold: thresholds.motion,
      details: results.motion.motionDetected 
        ? filterConfigs.motion.passText 
        : filterConfigs.motion.failText,
      icon: 'directions_run',
      color: results.motion.motionDetected 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed
    },
    {
      name: filterConfigs.duplicate.label,
      passed: !results.duplicate.isDuplicate,
      score: (1 - results.duplicate.similarity) * 100,
      threshold: 100 - thresholds.duplicate,
      details: !results.duplicate.isDuplicate 
        ? filterConfigs.duplicate.passText 
        : filterConfigs.duplicate.failText,
      icon: 'content_copy',
      color: !results.duplicate.isDuplicate 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed
    },
    {
      name: filterConfigs.timeFilter.label,
      passed: results.timeFilter.shouldProcess,
      score: results.timeFilter.shouldProcess ? 100 : 0,
      threshold: 100,
      details: results.timeFilter.shouldProcess 
        ? filterConfigs.timeFilter.passText 
        : filterConfigs.timeFilter.failText,
      icon: 'schedule',
      color: results.timeFilter.shouldProcess 
        ? brandConfig.colors.successGreen 
        : brandConfig.colors.errorRed
    }
  ];
};

export const FilterResults: React.FC<IFilterResultsProps> = ({
  results,
  thresholds,
  isLoading,
  processingTime
}) => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.md
    },
    loadingState: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.xl,
      color: brandConfig.colors.neutralGray
    },
    noResultsState: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.xl,
      color: brandConfig.colors.neutralGray,
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.spacing.sm,
      border: `1px dashed ${brandConfig.colors.sterlingSilver}`
    },
    filtersGrid: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.sm
    },
    finalDecision: {
      padding: brandConfig.spacing.lg,
      borderRadius: brandConfig.spacing.sm,
      textAlign: 'center' as const,
      border: '2px solid',
      marginTop: brandConfig.spacing.md
    },
    proceedDecision: {
      backgroundColor: `${brandConfig.colors.successGreen}15`,
      borderColor: brandConfig.colors.successGreen,
      color: brandConfig.colors.successGreen
    },
    skipDecision: {
      backgroundColor: `${brandConfig.colors.errorRed}15`,
      borderColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.errorRed
    },
    decisionIcon: {
      fontSize: '3rem',
      marginBottom: brandConfig.spacing.sm
    },
    decisionTitle: {
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSize2xl,
      marginBottom: brandConfig.spacing.sm
    },
    decisionDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      opacity: 0.8
    },
    metricsSection: {
      marginTop: brandConfig.spacing.lg,
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.spacing.sm
    },
    metricsTitle: {
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: brandConfig.spacing.sm
    },
    metricItem: {
      textAlign: 'center' as const
    },
    metricValue: {
      fontWeight: brandConfig.typography.weightBold,
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.ribbonBlue
    },
    metricLabel: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.loadingState}>
          <LinearProgress sx={{ marginBottom: brandConfig.spacing.md }} />
          <Typography variant="body1">
            {aiTestingData.states.loading.title}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: brandConfig.spacing.sm }}>
            {aiTestingData.states.loading.description}
          </Typography>
        </Box>
      </Box>
    );
  }

  // No results state
  if (!results) {
    return (
      <Box sx={styles.container}>
        <Box sx={styles.noResultsState}>
          <InfoIcon sx={{ 
            fontSize: '3rem', 
            color: brandConfig.colors.neutralGray,
            marginBottom: brandConfig.spacing.sm 
          }} />
          <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
            No Analysis Results
          </Typography>
          <Typography variant="body2">
            Upload an image to see detailed filter analysis results
          </Typography>
        </Box>
      </Box>
    );
  }

  // Convert results to filter format
  const filterResults = convertToFilterResults(results, thresholds);
  const passedFiltersCount = filterResults.filter(f => f.passed).length;
  const totalFiltersCount = filterResults.length;

  return (
    <Box sx={styles.container}>
      {/* Individual Filter Results */}
      <Box sx={styles.filtersGrid}>
        {filterResults.map((filter, index) => (
          <FilterResultCard
            key={index}
            filter={filter}
            isLoading={false}
            compact={false}
          />
        ))}
      </Box>

      <Divider />

      {/* Final Decision */}
      <Box sx={{
        ...styles.finalDecision,
        ...(results.shouldProceed ? styles.proceedDecision : styles.skipDecision)
      }}>
        {results.shouldProceed ? (
          <ProceedIcon sx={styles.decisionIcon} />
        ) : (
          <SkipIcon sx={styles.decisionIcon} />
        )}
        
        <Typography sx={styles.decisionTitle}>
          {results.shouldProceed 
            ? aiTestingData.finalDecision.proceed.title
            : aiTestingData.finalDecision.skip.title}
        </Typography>
        
        <Typography sx={styles.decisionDescription}>
          {results.shouldProceed 
            ? aiTestingData.finalDecision.proceed.description
            : aiTestingData.finalDecision.skip.description}
        </Typography>

        {/* Decision metrics */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: brandConfig.spacing.lg, marginTop: brandConfig.spacing.md }}>
          <Chip
            label={`${passedFiltersCount}/${totalFiltersCount} filters passed`}
            size="small"
            sx={{
              backgroundColor: passedFiltersCount === totalFiltersCount 
                ? brandConfig.colors.successGreen 
                : brandConfig.colors.alertAmber,
              color: brandConfig.colors.barnWhite
            }}
          />
          
          {results.decisions.confidence && (
            <Chip
              label={`${Math.round(results.decisions.confidence * 100)}% confidence`}
              size="small"
              sx={{
                backgroundColor: brandConfig.colors.ribbonBlue,
                color: brandConfig.colors.barnWhite
              }}
            />
          )}
        </Box>
      </Box>

      {/* Performance Metrics */}
      {(processingTime || results.processingTime) && (
        <Box sx={styles.metricsSection}>
          <Typography sx={styles.metricsTitle}>
            Performance Metrics
          </Typography>
          
          <Box sx={styles.metricsGrid}>
            <Box sx={styles.metricItem}>
              <Typography sx={styles.metricValue}>
                {processingTime || results.processingTime.total}
              </Typography>
              <Typography sx={styles.metricLabel}>
                ms total
              </Typography>
            </Box>
            
            <Box sx={styles.metricItem}>
              <Typography sx={styles.metricValue}>
                {results.processingTime.breakdown.imageQuality}
              </Typography>
              <Typography sx={styles.metricLabel}>
                ms quality
              </Typography>
            </Box>
            
            <Box sx={styles.metricItem}>
              <Typography sx={styles.metricValue}>
                {results.processingTime.breakdown.occupancy}
              </Typography>
              <Typography sx={styles.metricLabel}>
                ms occupancy
              </Typography>
            </Box>
            
            <Box sx={styles.metricItem}>
              <Typography sx={styles.metricValue}>
                {results.processingTime.breakdown.motion}
              </Typography>
              <Typography sx={styles.metricLabel}>
                ms motion
              </Typography>
            </Box>
            
            <Box sx={styles.metricItem}>
              <Typography sx={styles.metricValue}>
                {results.tokenSavingsEstimate}
              </Typography>
              <Typography sx={styles.metricLabel}>
                % tokens saved
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Skip reason details */}
      {!results.shouldProceed && results.decisions.skipReason && (
        <Alert 
          severity="info" 
          sx={{ marginTop: brandConfig.spacing.sm }}
        >
          <Typography variant="body2">
            <strong>Skip Reason:</strong> {results.decisions.skipReason.replace(/_/g, ' ')}
          </Typography>
          {results.decisions.recommendations.length > 0 && (
            <Typography variant="body2" sx={{ marginTop: brandConfig.spacing.xs }}>
              <strong>Suggestion:</strong> {results.decisions.recommendations[0]}
            </Typography>
          )}
        </Alert>
      )}
    </Box>
  );
}; 