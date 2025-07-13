/**
 * Augmented Learning Configuration
 * Advanced learning capabilities for AI agents analyzing horse photo sequences
 * 
 * @description Configuration for continuous learning, pattern recognition, and agent adaptation
 * @compliance HIPAA compliant with privacy protection and tenant isolation
 * @security Zero Trust with secure learning data handling
 * @author One Barn Development Team
 * @since v2.0.0
 * @updated Integrated with existing photo sequence analysis system
 */

import { brandConfig } from './brandConfig';

// ============================================================================
// LEARNING INTERFACES
// ============================================================================

export interface ILearningAgentConfig {
  agentId: string;
  learningEnabled: boolean;
  learningRate: number;
  patternMemoryDays: number;
  adaptationThreshold: number;
  confidenceCalibration: IConfidenceCalibration;
  feedbackIntegration: IFeedbackIntegration;
  specializations: string[];
}

export interface IConfidenceCalibration {
  enabled: boolean;
  adjustmentFactor: number;
  minimumConfidence: number;
  maximumConfidence: number;
  calibrationMethod: 'linear' | 'exponential' | 'adaptive';
}

export interface IFeedbackIntegration {
  veterinaryWeight: number;
  trainerWeight: number;
  outcomeWeight: number;
  historicalWeight: number;
  realTimeFeedback: boolean;
}

export interface IPatternLearningConfig {
  enabled: boolean;
  patternTypes: string[];
  recognitionThreshold: number;
  validationRequired: boolean;
  crossTenantLearning: ICrossTenantLearning;
}

export interface ICrossTenantLearning {
  enabled: boolean;
  anonymizationLevel: 'basic' | 'high' | 'maximum';
  minimumDataPoints: number;
  privacyPreservation: boolean;
}

// ============================================================================
// AUGMENTED LEARNING CONFIGURATION
// ============================================================================

export const augmentedLearningConfig = {
  // Core Learning Settings
  core: {
    enabled: true,
    learningMode: 'continuous' as 'continuous' | 'batch' | 'hybrid',
    updateFrequency: 'realtime' as 'realtime' | 'hourly' | 'daily' | 'weekly',
    validationPeriod: 7, // days
    rollbackEnabled: true,
    maxLearningIterations: 1000,
    convergenceThreshold: 0.001
  },

  // Agent-Specific Learning Configurations
  agents: {
    // Horse Image Analysis Agent (HIA-001)
    'HIA-001': {
      agentId: 'HIA-001',
      learningEnabled: true,
      learningRate: 0.001,
      patternMemoryDays: 90,
      adaptationThreshold: 0.8,
      confidenceCalibration: {
        enabled: true,
        adjustmentFactor: 0.1,
        minimumConfidence: 0.6,
        maximumConfidence: 0.95,
        calibrationMethod: 'adaptive' as const
      },
      feedbackIntegration: {
        veterinaryWeight: 0.4,
        trainerWeight: 0.3,
        outcomeWeight: 0.2,
        historicalWeight: 0.1,
        realTimeFeedback: true
      },
      specializations: [
        'movement_pattern_recognition',
        'posture_analysis',
        'behavior_detection',
        'health_indicator_recognition',
        'photo_sequence_correlation'
      ]
    } as ILearningAgentConfig,

    // Equine Care Agent (ECA-001)
    'ECA-001': {
      agentId: 'ECA-001',
      learningEnabled: true,
      learningRate: 0.0005, // More conservative for health decisions
      patternMemoryDays: 180, // Longer memory for health patterns
      adaptationThreshold: 0.85, // Higher threshold for health decisions
      confidenceCalibration: {
        enabled: true,
        adjustmentFactor: 0.05, // More conservative adjustments
        minimumConfidence: 0.7,
        maximumConfidence: 0.98,
        calibrationMethod: 'exponential' as const
      },
      feedbackIntegration: {
        veterinaryWeight: 0.6, // Higher weight for veterinary feedback
        trainerWeight: 0.2,
        outcomeWeight: 0.15,
        historicalWeight: 0.05,
        realTimeFeedback: false // Batch processing for health decisions
      },
      specializations: [
        'health_assessment_patterns',
        'risk_prediction_models',
        'veterinary_correlation_patterns',
        'breed_specific_health_indicators',
        'age_related_condition_patterns',
        'seasonal_health_variations'
      ]
    } as ILearningAgentConfig,

    // Pattern Learning Agent (PAL-001)
    'PAL-001': {
      agentId: 'PAL-001',
      learningEnabled: true,
      learningRate: 0.01, // Higher rate for pattern discovery
      patternMemoryDays: 365, // Full year of patterns
      adaptationThreshold: 0.75,
      confidenceCalibration: {
        enabled: true,
        adjustmentFactor: 0.2,
        minimumConfidence: 0.5,
        maximumConfidence: 0.9,
        calibrationMethod: 'linear' as const
      },
      feedbackIntegration: {
        veterinaryWeight: 0.3,
        trainerWeight: 0.4,
        outcomeWeight: 0.2,
        historicalWeight: 0.1,
        realTimeFeedback: true
      },
      specializations: [
        'temporal_pattern_discovery',
        'correlation_pattern_identification',
        'anomaly_pattern_detection',
        'cross_domain_pattern_recognition',
        'predictive_pattern_modeling'
      ]
    } as ILearningAgentConfig
  },

  // Pattern Recognition Configuration
  patternRecognition: {
    photoSequencePatterns: {
      enabled: true,
      sequenceLength: 10, // photos
      temporalResolution: 6, // seconds between photos
      patternTypes: [
        'movement_progression',
        'posture_evolution',
        'behavior_transitions',
        'health_indicator_changes',
        'environmental_responses'
      ],
      recognitionThreshold: 0.7,
      validationRequired: true,
      crossTenantLearning: {
        enabled: true,
        anonymizationLevel: 'high' as const,
        minimumDataPoints: 50,
        privacyPreservation: true
      }
    } as IPatternLearningConfig,

    healthIndicatorPatterns: {
      enabled: true,
      patternTypes: [
        'respiratory_patterns',
        'lameness_indicators',
        'pain_behaviors',
        'comfort_levels',
        'energy_fluctuations'
      ],
      recognitionThreshold: 0.8, // Higher threshold for health
      validationRequired: true,
      crossTenantLearning: {
        enabled: true,
        anonymizationLevel: 'maximum' as const,
        minimumDataPoints: 100,
        privacyPreservation: true
      }
    } as IPatternLearningConfig,

    behaviorPatterns: {
      enabled: true,
      patternTypes: [
        'feeding_behaviors',
        'social_interactions',
        'alert_state_transitions',
        'rest_activity_cycles',
        'environmental_responses'
      ],
      recognitionThreshold: 0.65,
      validationRequired: false, // More exploratory
      crossTenantLearning: {
        enabled: true,
        anonymizationLevel: 'high' as const,
        minimumDataPoints: 30,
        privacyPreservation: true
      }
    } as IPatternLearningConfig
  },

  // Feedback Learning Configuration
  feedbackLearning: {
    enabled: true,
    feedbackTypes: {
      veterinaryValidation: {
        weight: 1.0,
        confidenceBoost: 0.2,
        requiredForHealthDecisions: true,
        timeWindowHours: 72
      },
      trainerObservations: {
        weight: 0.7,
        confidenceBoost: 0.1,
        requiredForHealthDecisions: false,
        timeWindowHours: 24
      },
      outcomeTracking: {
        weight: 0.8,
        confidenceBoost: 0.15,
        requiredForHealthDecisions: true,
        timeWindowHours: 168 // 1 week
      },
      systemValidation: {
        weight: 0.5,
        confidenceBoost: 0.05,
        requiredForHealthDecisions: false,
        timeWindowHours: 1
      }
    },
    
    adaptiveFeedbackWeighting: {
      enabled: true,
      performanceBasedAdjustment: true,
      expertiseWeighting: true,
      temporalRelevanceDecay: 0.95 // 5% decay per day
    }
  },

  // Continuous Improvement Configuration
  continuousImprovement: {
    enabled: true,
    improvementMetrics: [
      'accuracy_improvement',
      'false_positive_reduction',
      'processing_time_optimization',
      'confidence_calibration_accuracy',
      'prediction_accuracy'
    ],
    
    performanceTargets: {
      minimumAccuracy: 0.85,
      maximumFalsePositiveRate: 0.1,
      maximumProcessingTimeMs: 30000,
      confidenceCalibrationError: 0.05,
      predictionAccuracyTarget: 0.8
    },
    
    adaptiveOptimization: {
      enabled: true,
      optimizationStrategies: [
        'hyperparameter_tuning',
        'model_architecture_adjustment',
        'feature_selection_optimization',
        'threshold_adjustment',
        'ensemble_weight_optimization'
      ],
      optimizationFrequency: 'weekly',
      validationRequired: true
    }
  },

  // Privacy and Security
  privacySecurity: {
    dataAnonymization: {
      enabled: true,
      anonymizationMethods: [
        'differential_privacy',
        'k_anonymity',
        'data_masking',
        'synthetic_data_generation'
      ],
      privacyBudget: 1.0,
      noiseLevel: 0.1
    },
    
    tenantIsolation: {
      strictIsolation: true,
      crossTenantLearningOptIn: true,
      dataSharing: {
        enabled: false, // Opt-in only
        anonymizationRequired: true,
        minimumAggregation: 10
      }
    },
    
    auditLogging: {
      enabled: true,
      logLearningOperations: true,
      logPatternDiscovery: true,
      logModelUpdates: true,
      retentionDays: 365
    }
  },

  // Performance Configuration
  performance: {
    resourceLimits: {
      maxMemoryMB: 8192,
      maxProcessingTimeMs: 60000,
      maxConcurrentLearningTasks: 5,
      maxPatternStorageMB: 2048
    },
    
    optimization: {
      batchLearning: {
        enabled: true,
        batchSize: 100,
        batchFrequency: 'hourly'
      },
      
      incrementalLearning: {
        enabled: true,
        updateFrequency: 'realtime',
        maxUpdatesPerSecond: 10
      },
      
      caching: {
        enabled: true,
        patternCacheTTL: 3600, // 1 hour
        modelCacheTTL: 86400,  // 24 hours
        maxCacheSize: 1024     // MB
      }
    }
  },

  // Integration with Existing Configuration
  integration: {
    brandConfigIntegration: {
      enabled: true,
      useColorsForVisualization: true,
      useTypographyForReports: true,
      useSpacingForLayouts: true
    },
    
    visionPromptsIntegration: {
      enabled: true,
      enhancePromptsWithLearning: true,
      adaptPromptBasedOnPerformance: true,
      personalizePromptsPerTenant: false // Privacy protection
    },
    
    dataVaultIntegration: {
      enabled: true,
      storeLearningHistory: true,
      trackPatternEvolution: true,
      maintainAuditTrail: true
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getLearningAgentConfig = (agentId: string): ILearningAgentConfig | null => {
  return (augmentedLearningConfig.agents as Record<string, ILearningAgentConfig>)[agentId] || null;
};

export const getPatternLearningConfig = (patternType: string): IPatternLearningConfig | null => {
  return (augmentedLearningConfig.patternRecognition as Record<string, IPatternLearningConfig>)[patternType] || null;
};

export const isLearningEnabled = (agentId: string): boolean => {
  const agentConfig = getLearningAgentConfig(agentId);
  return (agentConfig?.learningEnabled ?? false) && augmentedLearningConfig.core.enabled;
};

export const canShareAcrossTenants = (patternType: string): boolean => {
  const patternConfig = getPatternLearningConfig(patternType);
  return patternConfig?.crossTenantLearning?.enabled || false;
};

export const getLearningRate = (agentId: string, performanceMetrics?: any): number => {
  const agentConfig = getLearningAgentConfig(agentId);
  if (!agentConfig) return 0;
  
  let baseRate = agentConfig.learningRate;
  
  // Adaptive learning rate based on performance
  if (performanceMetrics) {
    if (performanceMetrics.accuracy > 0.9) {
      baseRate *= 0.5; // Slow down when performing well
    } else if (performanceMetrics.accuracy < 0.7) {
      baseRate *= 2.0; // Speed up when performing poorly
    }
  }
  
  return Math.max(0.0001, Math.min(0.1, baseRate)); // Clamp between bounds
};

export const shouldUpdateModel = (
  agentId: string, 
  lastUpdateTime: Date, 
  performanceChange: number
): boolean => {
  const agentConfig = getLearningAgentConfig(agentId);
  if (!agentConfig || !isLearningEnabled(agentId)) return false;
  
  const timeSinceUpdate = Date.now() - lastUpdateTime.getTime();
  const updateFrequency = augmentedLearningConfig.core.updateFrequency;
  
  // Time-based updates
  const timeThresholds = {
    realtime: 60000,      // 1 minute
    hourly: 3600000,      // 1 hour
    daily: 86400000,      // 24 hours
    weekly: 604800000     // 7 days
  };
  
  if (timeSinceUpdate > timeThresholds[updateFrequency]) {
    return true;
  }
  
  // Performance-based updates
  if (Math.abs(performanceChange) > agentConfig.adaptationThreshold) {
    return true;
  }
  
  return false;
};

export const validateLearningConfiguration = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate core configuration
  if (!augmentedLearningConfig.core.enabled) {
    errors.push('Core learning is disabled');
  }
  
  // Validate agent configurations
  Object.values(augmentedLearningConfig.agents).forEach(agent => {
    if (agent.learningRate <= 0 || agent.learningRate > 1) {
      errors.push(`Invalid learning rate for agent ${agent.agentId}: ${agent.learningRate}`);
    }
    
    if (agent.patternMemoryDays <= 0) {
      errors.push(`Invalid pattern memory days for agent ${agent.agentId}: ${agent.patternMemoryDays}`);
    }
    
    if (agent.adaptationThreshold <= 0 || agent.adaptationThreshold > 1) {
      errors.push(`Invalid adaptation threshold for agent ${agent.agentId}: ${agent.adaptationThreshold}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default augmentedLearningConfig; 