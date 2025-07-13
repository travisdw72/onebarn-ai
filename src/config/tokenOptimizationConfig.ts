/**
 * Token Optimization Testing Configuration
 * Bridge between Python testing system and TypeScript dashboard
 * Mirrors python_development/token_optimization_testing/config/testing_config.py
 */

import { brandConfig } from './brandConfig';

export interface OptimizationThresholds {
  qualityMinimum: number;
  contentConfidence: number;
  motionThreshold: number;
  duplicateSimilarity: number;
  brightnessMin: number;
  brightnessMax: number;
  blurThreshold: number;
  contrastMinimum: number;
}

export interface SamplingConfig {
  shortVideoInterval: number;
  mediumVideoInterval: number;
  longVideoInterval: number;
  extendedVideoInterval: number;
  durationThresholds: {
    short: number;
    medium: number;
    long: number;
  };
}

export interface VideoCategory {
  description: string;
  expectedSavings: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CostConfig {
  inputTokenCost: number;
  outputTokenCost: number;
  imageTokenCost: number;
}

export interface ValidationTargets {
  minimumVideosPerCategory: number;
  requiredAccuracyThreshold: number;
  maximumFalsePositiveRate: number;
  targetOverallSavings: number;
  minimumAcceptableSavings: number;
}

export interface TestSessionResult {
  id: number;
  sessionName: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  totalVideos: number;
  completedVideos: number;
  overallSavingsPercentage: number;
  totalCostSavings: number;
  categoryBreakdown: Record<string, {
    savings: number;
    videos: number;
    targetMet: boolean;
  }>;
  recommendations: string[];
}

export interface OptimizationFilters {
  enableQualityFilter: boolean;
  enableContentFilter: boolean;
  enableMotionFilter: boolean;
  enableDuplicateFilter: boolean;
  enableTimeFilter: boolean;
  enableBrightnessFilter: boolean;
  enableBlurFilter: boolean;
  enableContrastFilter: boolean;
}

export const tokenOptimizationConfig = {
  // Sampling Strategy - matches Python config
  sampling: {
    shortVideoInterval: 15,     // seconds - videos < 5 minutes
    mediumVideoInterval: 30,    // seconds - videos 5-30 minutes  
    longVideoInterval: 60,      // seconds - videos 30-120 minutes
    extendedVideoInterval: 120, // seconds - videos > 2 hours
    durationThresholds: {
      short: 300,    // 5 minutes
      medium: 1800,  // 30 minutes  
      long: 7200,    // 2 hours
    }
  } as SamplingConfig,

  // Optimization Thresholds - matches Python config
  optimizationThresholds: {
    qualityMinimum: 0.3,        // Minimum quality score to process
    contentConfidence: 0.7,     // Confidence needed for content detection
    motionThreshold: 0.2,       // Minimum motion to be considered "active"
    duplicateSimilarity: 0.8,   // Threshold for duplicate detection
    brightnessMin: 0.2,         // Minimum brightness score
    brightnessMax: 0.9,         // Maximum brightness score
    blurThreshold: 0.4,         // Maximum blur score (lower = more blurry)
    contrastMinimum: 0.3,       // Minimum contrast score
  } as OptimizationThresholds,

  // Optimization Filters - matches Python config
  optimizationFilters: {
    enableQualityFilter: true,
    enableContentFilter: true,
    enableMotionFilter: true,
    enableDuplicateFilter: true,
    enableTimeFilter: true,
    enableBrightnessFilter: true,
    enableBlurFilter: true,
    enableContrastFilter: true,
  } as OptimizationFilters,

  // Video Categories & Expected Savings - matches Python config
  videoCategories: {
    emergency_scenarios: {
      description: 'Emergency and distress behaviors',
      expectedSavings: 0.15,  // 15% savings expected
      priority: 'high',
    },
    motion_testing: {
      description: 'Various motion levels and activities',
      expectedSavings: 0.25,  // 25% savings expected
      priority: 'medium',
    },
    occupancy_testing: {
      description: 'Different stall occupancy scenarios',
      expectedSavings: 0.35,  // 35% savings expected
      priority: 'high',
    },
    quality_testing: {
      description: 'Various lighting and quality conditions',
      expectedSavings: 0.15,  // 15% savings expected
      priority: 'medium',
    },
    time_testing: {
      description: 'Different times of day and feeding schedules',
      expectedSavings: 0.10,  // 10% savings expected
      priority: 'low',
    },
    duplicate_testing: {
      description: 'Similar scenes and repetitive content',
      expectedSavings: 0.20,  // 20% savings expected
      priority: 'medium',
    },
  } as Record<string, VideoCategory>,

  // Cost Configuration - matches Python config
  costs: {
    inputTokenCost: 0.00002,   // $0.00002 per input token
    outputTokenCost: 0.00006,  // $0.00006 per output token  
    imageTokenCost: 0.00085,   // $0.00085 per image
  } as CostConfig,

  // Validation Targets - matches Python config
  validation: {
    minimumVideosPerCategory: 5,
    requiredAccuracyThreshold: 0.95,  // 95% accuracy required
    maximumFalsePositiveRate: 0.05,   // 5% max false positives
    targetOverallSavings: 0.45,       // 45% target savings
    minimumAcceptableSavings: 0.30,   // 30% minimum savings
  } as ValidationTargets,

  // Dashboard Display Configuration
  display: {
    chartColors: {
      baseline: brandConfig.colors.sterlingSilver,      // Sterling Silver
      optimized: brandConfig.colors.hunterGreen,        // Hunter Green
      savings: brandConfig.colors.championGold,         // Champion Gold
      error: brandConfig.colors.victoryRose,            // Victory Rose
      success: brandConfig.colors.pastureSage,          // Pasture Sage
    },
    refreshInterval: 5000, // 5 seconds for live updates
    maxDisplayedSessions: 10,
    defaultVideoLimit: 10,
  },

  // API Endpoints for testing system integration
  api: {
    baseUrl: '/api/v1/token-optimization',
    endpoints: {
      sessions: '/sessions',
      results: '/results',
      export: '/export',
      videos: '/videos',
      stats: '/stats'
    }
  },

  // UI Text and Labels
  ui: {
    titles: {
      dashboard: 'AI Token Optimization Testing',
      sessions: 'Test Sessions',
      results: 'Optimization Results',
      categories: 'Video Categories',
      filters: 'Optimization Filters'
    },
    labels: {
      tokenSavings: 'Token Savings',
      costSavings: 'Cost Savings',
      processingTime: 'Processing Time',
      accuracy: 'Accuracy Maintained',
      targetMet: 'Target Met',
      savings: 'Savings',
      videos: 'Videos',
      status: 'Status',
      category: 'Category',
      startTime: 'Start Time',
      endTime: 'End Time',
      duration: 'Duration',
      overall: 'Overall',
      baseline: 'Baseline',
      optimized: 'Optimized'
    },
    messages: {
      noSessions: 'No test sessions found. Start a new test to see results.',
      loading: 'Loading optimization results...',
      error: 'Failed to load results. Please try again.',
      targetAchieved: 'Optimization target achieved!',
      targetMissed: 'Optimization target not met. Review settings.',
      noData: 'No data available for this session.',
      exportSuccess: 'Results exported successfully!',
      exportError: 'Failed to export results.'
    },
    buttons: {
      startTest: 'Start New Test',
      viewResults: 'View Results',
      exportResults: 'Export Results',
      refresh: 'Refresh',
      configure: 'Configure',
      details: 'View Details'
    }
  }
} as const;

// Helper functions for configuration access
export const getOptimizationConfig = () => tokenOptimizationConfig;

export const getCategoryExpectedSavings = (category: string): number => {
  return tokenOptimizationConfig.videoCategories[category]?.expectedSavings || 0;
};

export const getSamplingInterval = (videoDurationSeconds: number): number => {
  const { durationThresholds, shortVideoInterval, mediumVideoInterval, longVideoInterval, extendedVideoInterval } = tokenOptimizationConfig.sampling;
  
  if (videoDurationSeconds < durationThresholds.short) {
    return shortVideoInterval;
  } else if (videoDurationSeconds < durationThresholds.medium) {
    return mediumVideoInterval;
  } else if (videoDurationSeconds < durationThresholds.long) {
    return longVideoInterval;
  } else {
    return extendedVideoInterval;
  }
};

export const isOptimizationEnabled = (filterType: string): boolean => {
  const filters = tokenOptimizationConfig.optimizationFilters as any;
  return filters[`enable${filterType.charAt(0).toUpperCase() + filterType.slice(1)}Filter`] || false;
};

export const getChartColor = (colorType: keyof typeof tokenOptimizationConfig.display.chartColors): string => {
  return tokenOptimizationConfig.display.chartColors[colorType];
};

export const formatSavingsPercentage = (savings: number): string => {
  return `${(savings * 100).toFixed(1)}%`;
};

export const formatCostSavings = (cost: number): string => {
  return `$${cost.toFixed(6)}`;
};

export const calculateOverallSavings = (categoryResults: Record<string, { savings: number; videos: number }>): number => {
  const totalVideos = Object.values(categoryResults).reduce((sum, cat) => sum + cat.videos, 0);
  const weightedSavings = Object.values(categoryResults).reduce((sum, cat) => sum + (cat.savings * cat.videos), 0);
  return totalVideos > 0 ? weightedSavings / totalVideos : 0;
};

export const isTargetMet = (actualSavings: number, expectedSavings: number, tolerance: number = 0.05): boolean => {
  return actualSavings >= (expectedSavings - tolerance);
};

// Export types for use in components
export type {
  OptimizationThresholds,
  SamplingConfig,
  VideoCategory,
  CostConfig,
  ValidationTargets,
  TestSessionResult,
  OptimizationFilters
}; 