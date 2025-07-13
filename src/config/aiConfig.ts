// 🤖 AI Service Configuration
// Note: This is configured for DEMO/DEVELOPMENT purposes only
// In production, API keys should be handled by backend services

export const aiConfig = {
  // 🔒 DEMO MODE CONFIGURATION
  // Production: API calls would go through backend proxy
  demoMode: {
    enabled: import.meta.env.DEV, // Only in development
    mockResponses: true,
    showSecurityWarnings: true
  },

  // 🔑 API Configuration (DEMO AND TESTING)
  // Production: API keys managed via Render environment variables
  apiKeys: {
    // ⚠️ API keys from environment variables - secure for demo/testing deployment
    openai: import.meta.env.VITE_OPENAI_API_KEY || null,
    anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || null,
    grok: import.meta.env.VITE_GROK_API_KEY || null,
    
    // Production endpoints (these would be used in production)
    production: {
      endpoint: '/api/v1/ai', // Backend proxy endpoint
      timeout: 30000,
      retryAttempts: 3
    }
  },

  // 🚨 Security Warnings
  securityWarnings: {
    showInDev: true,
    messages: {
      apiKeyExposure: '🔧 DEMO MODE: API keys visible in client - use backend proxy for production',
      securityBypass: '🔧 DEMO MODE: Client-side security checks can be bypassed',
      dataVaultMock: '🔧 DEMO MODE: Using mock data vault responses'
    }
  },

  // 📹 ReoLink Integration
  reoLink: {
    enabled: true,
    demoMode: import.meta.env.DEV,
    maxConcurrentStreams: 4,
    analysisInterval: 30, // seconds
    snapshotQuality: 0.8,
    streamTimeout: 30000,
    healthCheckInterval: 30000,
    
    // Camera-specific AI analysis settings
    cameraAnalysis: {
      horseDetection: {
        enabled: true,
        confidenceThreshold: 0.7,
        modelPriority: 'accuracy' // 'accuracy' | 'speed'
      },
      behaviorAnalysis: {
        enabled: true,
        patterns: ['eating', 'drinking', 'resting', 'moving', 'distress'],
        alertThreshold: 0.8
      },
      healthMonitoring: {
        enabled: true,
        vitalSigns: ['posture', 'mobility', 'breathing'],
        emergencyDetection: true
      }
    }
  },

  // 🔄 Provider Configuration
  providers: {
    primary: 'anthropic',
    fallbacks: ['openai', 'grok'],
    circuitBreaker: {
      enabled: true,
      failureThreshold: 3,
      recoveryTime: 30000
    },
    
    // AI Provider Settings
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
      model: 'gpt-4o',
      baseUrl: 'https://api.openai.com/v1',
      maxTokens: 2000,
      temperature: 0.1,
      maxRetries: 2,
      retryDelay: 2000,
      enabled: true  // Re-enabled for meta-analysis
    },
    anthropic: {
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || null,
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 2000,
      temperature: 0.1,
      enabled: true
    },
    grok: {
      apiKey: import.meta.env.VITE_GROK_API_KEY || null,
      baseUrl: 'https://api.x.ai/v1',
      model: 'grok-beta',
      maxTokens: 4000,
      temperature: 0.3,
      enabled: false // Enable when Grok API is available
    }
  },

  // Horse Analytics Thresholds (from behavior standards)
  horseThresholds: {
    healthRisk: 0.7,
    performancePlateauDays: 14,
    costAnomalyPercentage: 20,
    behaviorAnomalyScore: 0.65,
    trainingEfficiencyThreshold: 0.8,
    financialRiskThreshold: 0.6
  },

  // Senior Care Analytics Thresholds
  seniorThresholds: {
    healthRisk: 0.8,
    cognitiveDeclineThreshold: 0.75,
    fallRiskThreshold: 0.7,
    medicationAdherenceThreshold: 0.85,
    socialIsolationThreshold: 0.6,
    depressionRiskThreshold: 0.7,
    emergencyResponseThreshold: 0.9,
    vitalSignsAnomalyThreshold: 0.8,
    activityLevelDeclineThreshold: 0.7,
    nutritionRiskThreshold: 0.75
  },

  // Insight Generation Settings
  insights: {
    maxInsightsPerHorse: 5,
    maxInsightsPerSenior: 7,
    confidenceThreshold: 0.6,
    refreshIntervalMinutes: 30,
    historicalDataDays: 90,
    predictionHorizonDays: 30
  },



  // Senior Care Analysis Categories
  seniorAnalysisTypes: {
    health: {
      enabled: true,
      priority: 'critical',
      indicators: [
        'vital_signs_monitoring',
        'medication_adherence',
        'symptom_tracking',
        'chronic_condition_management',
        'preventive_care_compliance',
        'weight_fluctuation',
        'sleep_pattern_changes',
        'appetite_changes',
        'pain_level_assessment'
      ]
    },
    cognitive: {
      enabled: true,
      priority: 'critical',
      assessments: [
        'memory_function',
        'executive_function',
        'attention_span',
        'language_abilities',
        'problem_solving',
        'orientation_awareness',
        'decision_making_capacity',
        'learning_retention',
        'confusion_episodes'
      ]
    },
    physical: {
      enabled: true,
      priority: 'high',
      metrics: [
        'mobility_assessment',
        'balance_stability',
        'strength_evaluation',
        'endurance_capacity',
        'flexibility_range',
        'fall_risk_factors',
        'gait_analysis',
        'coordination_testing',
        'rehabilitation_progress'
      ]
    },
    social: {
      enabled: true,
      priority: 'high',
      patterns: [
        'social_interaction_frequency',
        'family_engagement',
        'community_participation',
        'friendship_maintenance',
        'group_activity_involvement',
        'communication_quality',
        'isolation_indicators',
        'support_network_strength'
      ]
    },
    emotional: {
      enabled: true,
      priority: 'high',
      indicators: [
        'mood_stability',
        'depression_screening',
        'anxiety_levels',
        'emotional_regulation',
        'coping_mechanisms',
        'life_satisfaction',
        'grief_processing',
        'behavioral_changes',
        'agitation_episodes'
      ]
    },
    safety: {
      enabled: true,
      priority: 'critical',
      monitoring: [
        'fall_detection',
        'wandering_behavior',
        'medication_errors',
        'kitchen_safety',
        'bathroom_safety',
        'emergency_response',
        'environmental_hazards',
        'personal_security',
        'medical_emergency_detection'
      ]
    },
    wellness: {
      enabled: true,
      priority: 'medium',
      programs: [
        'fitness_activities',
        'nutrition_management',
        'hydration_monitoring',
        'sleep_hygiene',
        'stress_reduction',
        'hobby_engagement',
        'spiritual_care',
        'preventive_wellness',
        'health_education'
      ]
    }
  },

  // Visualization Settings
  visualization: {
    colors: {
      trendPositive: 'var(--pasture-sage)',
      trendNegative: 'var(--victory-rose)',
      trendNeutral: 'var(--sterling-silver)',
      criticalPriority: 'var(--victory-rose)',
      highPriority: 'var(--alert-amber)',
      mediumPriority: 'var(--ribbon-blue)',
      peakPerformance: 'var(--champion-gold)',
      // Senior Care Specific Colors
      healthyStatus: 'var(--success-green)',
      concernStatus: 'var(--alert-amber)',
      criticalStatus: 'var(--error-red)',
      cognitiveHealth: 'var(--info-blue)',
      physicalHealth: 'var(--pasture-sage)',
      emotionalHealth: 'var(--champion-gold)',
      socialHealth: 'var(--ribbon-blue)'
    },
    chartDefaults: {
      fontFamily: 'Raleway',
      fontSize: 14,
      responsive: true,
      maintainAspectRatio: false
    }
  },

  // Real-time Processing
  realtime: {
    enabled: true,
    batchSize: 10,
    processingIntervalMs: 5000,
    maxQueueSize: 100,
    retryAttempts: 3,
    retryDelayMs: 1000,
    // Senior Care Real-time Settings
    emergencyResponseMs: 1000, // 1 second for emergency detection
    vitalSignsIntervalMs: 30000, // 30 seconds for vital signs
    activityMonitoringMs: 60000, // 1 minute for activity monitoring
    medicationReminderMs: 300000 // 5 minutes for medication reminders
  },

  // Senior Care Specific Configurations
  seniorCare: {
    emergencyDetection: {
      enabled: true,
      fallDetectionThreshold: 0.85,
      medicalEmergencyThreshold: 0.9,
      behavioralEmergencyThreshold: 0.8,
      responseTimeSeconds: 120,
      escalationTimeouts: {
        level1: 300, // 5 minutes
        level2: 900, // 15 minutes
        level3: 1800 // 30 minutes
      }
    },
    medicationManagement: {
      enabled: true,
      adherenceTracking: true,
      interactionChecking: true,
      dosageValidation: true,
      reminderSystem: true,
      sideEffectMonitoring: true,
      refillAlerts: true
    },
    cognitiveAssessment: {
      enabled: true,
      assessmentFrequency: 'monthly',
      miniMentalStateEnabled: true,
      clockDrawingEnabled: true,
      memoryTestsEnabled: true,
      executiveFunctionTests: true,
      baselineComparison: true,
      progressTracking: true
    },
    activityRecommendations: {
      enabled: true,
      personalizedPlans: true,
      adaptiveScheduling: true,
      groupActivities: true,
      individualActivities: true,
      therapeuticActivities: true,
      recreationalActivities: true,
      cognitiveStimulation: true,
      physicalExercise: true,
      socialEngagement: true
    }
  },

  // Rate limiting configuration
  rateLimiting: {
    openai: {
      requestsPerMinute: 60,
      tokensPerMinute: 90000,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    anthropic: {
      requestsPerMinute: 50,
      tokensPerMinute: 80000,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    grok: {
      requestsPerMinute: 30,
      tokensPerMinute: 60000,
      maxRetries: 2,
      backoffMultiplier: 1.5
    }
  },

  // Video analysis configuration
  video: {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    supportedFormats: ['mp4', 'avi', 'mov', 'mkv'],
    maxDuration: 300, // 5 minutes
    frameExtractionRate: 1, // 1 frame per second
    analysisTimeout: 45000 // 45 seconds
  },

  // Photo analysis configuration  
  photo: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
    maxDimensions: { width: 4096, height: 4096 },
    analysisTimeout: 15000 // 15 seconds
  },

  // Horse analysis types and their specific configurations
  horseAnalysisTypes: {
    health: {
      enabled: true,
      confidenceThreshold: 0.7,
      indicators: [
        'lameness',
        'breathing_issues', 
        'coat_condition',
        'body_condition',
        'eye_clarity',
        'posture_abnormalities'
      ],
      securityLevel: 'RESTRICTED' // Health data is sensitive
    },
    
    performance: {
      enabled: true,
      confidenceThreshold: 0.8,
      metrics: [
        'gait_quality',
        'speed_consistency',
        'jump_form',
        'collection',
        'straightness',
        'impulsion'
      ],
      disciplines: [
        'dressage',
        'show_jumping',
        'barrel_racing',
        'cutting',
        'reining',
        'eventing'
      ],
      securityLevel: 'CONFIDENTIAL' // Performance data for competitive advantage
    },
    
    behavior: {
      enabled: true,
      confidenceThreshold: 0.75,
      patterns: [
        'stress_indicators',
        'aggression_signs',
        'cooperation_level',
        'attention_span',
        'fear_responses',
        'pain_behaviors'
      ],
      securityLevel: 'RESTRICTED' // Behavioral data affects welfare decisions
    },
    
    training: {
      enabled: true,
      confidenceThreshold: 0.85,
      assessments: [
        'exercise_response',
        'learning_rate',
        'fatigue_indicators',
        'motivation_level',
        'skill_progression',
        'readiness_indicators'
      ],
      securityLevel: 'CONFIDENTIAL' // Training methodologies are proprietary
    }
  },

  // AI prompt templates for different analysis types
  prompts: {
    health: {
      system: "You are a veterinary AI assistant specializing in equine health assessment through visual analysis.",
      template: "Analyze this horse image/video for health indicators. Focus on: {indicators}. Provide confidence scores and specific observations.",
      maxTokens: 1500
    },
    
    performance: {
      system: "You are an equine performance analyst with expertise in {discipline} evaluation.",
      template: "Evaluate this horse's performance in {discipline}. Analyze: {metrics}. Provide detailed scoring and improvement recommendations.",
      maxTokens: 2000
    },
    
    behavior: {
      system: "You are an equine behavior specialist focused on horse welfare and psychological assessment.",
      template: "Assess behavioral patterns in this horse. Look for: {patterns}. Consider welfare implications and training recommendations.",
      maxTokens: 1800
    },
    
    training: {
      system: "You are an expert horse trainer analyzing training session effectiveness and horse response.",
      template: "Evaluate this training session for: {assessments}. Provide actionable feedback for trainer and horse development.",
      maxTokens: 2200
    }
  },

  // Error handling and fallback configuration
  errorHandling: {
    maxRetries: 3,
    timeoutMs: 30000,
    fallbackMode: 'degraded', // 'none', 'cached', 'degraded', 'offline'
    
    retryStrategies: {
      networkError: { delay: 1000, backoff: 2, maxDelay: 10000 },
      rateLimitError: { delay: 5000, backoff: 1.5, maxDelay: 30000 },
      serverError: { delay: 2000, backoff: 2, maxDelay: 15000 }
    }
  },

  // Feature flags for different AI capabilities
  features: {
    realTimeAnalysis: true,
    batchProcessing: true,
    multiCameraSupport: true,
    historicalComparison: true,
    predictiveAnalytics: true,
    
    // Experimental features (disabled by default)
    experimental: {
      gaitBiometrics: false,
      emotionalAnalysis: false,
      injuryPrediction: false,
      nutritionalAssessment: false
    }
  },

  // Data privacy and security settings
  privacy: {
    dataRetention: {
      images: 30, // days
      videos: 90, // days  
      analysisResults: 365 // days
    },
    
    anonymization: {
      enabled: true,
      removeMetadata: true,
      blurFaces: false, // We want to see horse faces
      removeLocationData: true
    },
    
    encryption: {
      inTransit: true,
      atRest: true,
      keyRotation: 90 // days
    }
  },

  // Integration with other barn management systems
  integrations: {
    veterinaryRecords: {
      enabled: true,
      syncInterval: 3600, // 1 hour
      apiEndpoint: '/api/v1/veterinary'
    },
    
    trainingLogs: {
      enabled: true,
      syncInterval: 1800, // 30 minutes
      apiEndpoint: '/api/v1/training'
    },
    
    nutritionTracking: {
      enabled: false, // Future feature
      syncInterval: 7200, // 2 hours
      apiEndpoint: '/api/v1/nutrition'
    }
  }
};

// Environment validation
export const validateAiConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!aiConfig.providers.openai.apiKey && aiConfig.providers.openai.enabled) {
    errors.push('OpenAI API key is required when OpenAI provider is enabled');
  }
  
  if (!aiConfig.providers.anthropic.apiKey && aiConfig.providers.anthropic.enabled) {
    errors.push('Anthropic API key is required when Anthropic provider is enabled');
  }
  
  if (!aiConfig.providers.grok.apiKey && aiConfig.providers.grok.enabled) {
    errors.push('Grok API key is required when Grok provider is enabled');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Provider priority for fallback
export const getProviderPriority = (): string[] => {
  const enabledProviders = Object.entries(aiConfig.providers)
    .filter(([key, config]) => {
      // Only check AI provider configs (not primary, fallbacks, circuitBreaker)
      if (key === 'primary' || key === 'fallbacks' || key === 'circuitBreaker') return false;
      return typeof config === 'object' && config !== null && 'enabled' in config && config.enabled;
    })
    .map(([name, _]) => name);
    
  // Prioritize based on reliability and capabilities
  const priority = ['openai', 'anthropic', 'grok'];
  return priority.filter(provider => enabledProviders.includes(provider));
};

// Senior Care Specific Helper Functions
export const getSeniorAnalysisConfig = (analysisType: string) => {
  return aiConfig.seniorAnalysisTypes[analysisType as keyof typeof aiConfig.seniorAnalysisTypes];
};

export const getHorseAnalysisConfig = (analysisType: string) => {
  return aiConfig.horseAnalysisTypes[analysisType as keyof typeof aiConfig.horseAnalysisTypes];
};

export const isEmergencyThresholdMet = (confidence: number, emergencyType: string): boolean => {
  const thresholds = {
    fall: aiConfig.seniorCare.emergencyDetection.fallDetectionThreshold,
    medical: aiConfig.seniorCare.emergencyDetection.medicalEmergencyThreshold,
    behavioral: aiConfig.seniorCare.emergencyDetection.behavioralEmergencyThreshold
  };
  
  return confidence >= (thresholds[emergencyType as keyof typeof thresholds] || 0.9);
};

export const getSeniorThreshold = (thresholdType: string): number => {
  return aiConfig.seniorThresholds[thresholdType as keyof typeof aiConfig.seniorThresholds] || 0.5;
};

export const getHorseThreshold = (thresholdType: string): number => {
  return aiConfig.horseThresholds[thresholdType as keyof typeof aiConfig.horseThresholds] || 0.5;
};

// 📹 ReoLink Configuration Helpers
export const getReoLinkConfig = () => {
  return aiConfig.reoLink;
};

export const getCameraAnalysisConfig = (analysisType: string) => {
  return aiConfig.reoLink.cameraAnalysis[analysisType as keyof typeof aiConfig.reoLink.cameraAnalysis];
};

export const shouldAnalyzeCamera = (cameraId: string): boolean => {
  return aiConfig.reoLink.enabled && !aiConfig.demoMode.enabled;
};

export const getCameraConfidenceThreshold = (): number => {
  return aiConfig.reoLink.cameraAnalysis.horseDetection.confidenceThreshold;
}; 