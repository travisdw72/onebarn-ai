/**
 * AI Analysis Configuration - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER AI ANALYSIS SETTINGS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This configuration controls ALL aspects of AI analysis behavior, performance,
 * and integration with the photo capture and storage systems.
 * 
 * 🧠 AI ANALYSIS FEATURES:
 *     - Advanced photo sequence analysis
 *     - Configurable confidence thresholds
 *     - Performance optimization settings
 *     - Error handling and retry logic
 *     - Demo account restrictions
 * 
 * 🔧 CUSTOMIZATION OPTIONS:
 *     - Analysis depth and complexity
 *     - Output format preferences
 *     - Caching and performance settings
 *     - Provider configuration
 *     - Quality thresholds
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, follows configuration standards
 */

import { brandConfig } from './brandConfig';
import { aiVisionPromptsConfig } from './aiVisionPromptsConfig';

// ============================================================================
// AI PROVIDER CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: AI provider settings
 * 
 * Configuration for different AI providers and their specific settings
 * for optimal analysis performance and cost management.
 */
export const aiProviderConfig = {
  // Primary AI Provider Settings
  primary: {
    provider: 'openai',                 // Primary AI service provider
    model: 'gpt-4-vision-preview',      // AI model for vision analysis
    apiVersion: '2024-02-15-preview',   // API version
    maxTokens: 4000,                    // Maximum tokens per request
    temperature: 0.1,                   // Low temperature for consistent results
    topP: 0.9,                          // Top-p sampling parameter
    
    // Rate Limiting
    rateLimits: {
      requestsPerMinute: 20,            // Maximum requests per minute
      requestsPerHour: 100,             // Maximum requests per hour
      requestsPerDay: 500,              // Maximum requests per day (demo limit)
      tokensPerMinute: 40000,           // Maximum tokens per minute
    },
    
    // Timeout Settings
    timeouts: {
      connectionTimeout: 30000,         // Connection timeout (30 seconds)
      requestTimeout: 60000,            // Request timeout (60 seconds)
      retryTimeout: 5000,               // Retry timeout (5 seconds)
    },
    
    // Quality Settings
    quality: {
      imageCompression: 'high',         // Image compression level
      maxImageSize: 1024 * 1024,        // Maximum image size (1MB)
      supportedFormats: ['jpeg', 'png', 'webp'], // Supported image formats
    }
  },
  
  // Fallback AI Provider
  fallback: {
    provider: 'anthropic',              // Fallback provider
    model: 'claude-3-sonnet',           // Fallback model
    enabled: false,                     // Disabled by default for demo
    
    rateLimits: {
      requestsPerMinute: 10,
      requestsPerHour: 50,
      requestsPerDay: 200,
      tokensPerMinute: 20000,
    },
    
    timeouts: {
      connectionTimeout: 30000,
      requestTimeout: 60000,
      retryTimeout: 5000,
    }
  },
  
  // Local/Edge AI Provider (future)
  edge: {
    provider: 'local',                  // Local AI processing
    model: 'vision-local-v1',           // Local vision model
    enabled: false,                     // Disabled by default
    
    performance: {
      maxConcurrentRequests: 2,         // Maximum concurrent requests
      processingTimeout: 120000,        // Processing timeout (2 minutes)
      memoryLimit: 2048,                // Memory limit (MB)
    }
  }
};

// ============================================================================
// ANALYSIS BEHAVIOR CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Analysis behavior settings
 * 
 * Controls how AI analysis behaves under different conditions
 * and scenarios for optimal results and performance.
 */
export const analysisBehaviorConfig = {
  // Analysis Depth Settings
  depth: {
    basic: {
      name: 'Basic Analysis',
      description: 'Quick analysis for routine monitoring',
      promptLength: 'short',           // Use shorter prompts
      maxProcessingTime: 15000,        // 15 seconds maximum
      confidenceThreshold: 0.6,        // Lower confidence threshold
      enableMetaAnalysis: false,       // No meta-analysis
      enableTrendAnalysis: false,      // No trend analysis
    },
    
    standard: {
      name: 'Standard Analysis',
      description: 'Comprehensive analysis for regular monitoring',
      promptLength: 'medium',          // Use medium prompts
      maxProcessingTime: 30000,        // 30 seconds maximum
      confidenceThreshold: 0.7,        // Standard confidence threshold
      enableMetaAnalysis: true,        // Enable meta-analysis
      enableTrendAnalysis: true,       // Enable trend analysis
    },
    
    detailed: {
      name: 'Detailed Analysis',
      description: 'Deep analysis for critical situations',
      promptLength: 'long',            // Use comprehensive prompts
      maxProcessingTime: 60000,        // 60 seconds maximum
      confidenceThreshold: 0.8,        // High confidence threshold
      enableMetaAnalysis: true,        // Enable meta-analysis
      enableTrendAnalysis: true,       // Enable trend analysis
    },
    
    comprehensive: {
      name: 'Comprehensive Analysis',
      description: 'Complete analysis for research and detailed monitoring',
      promptLength: 'full',            // Use full prompts
      maxProcessingTime: 120000,       // 2 minutes maximum
      confidenceThreshold: 0.9,        // Very high confidence threshold
      enableMetaAnalysis: true,        // Enable meta-analysis
      enableTrendAnalysis: true,       // Enable trend analysis
    }
  },
  
  // Confidence Thresholds
  confidence: {
    minimum: 0.3,                      // Minimum confidence to return results
    warning: 0.5,                      // Show warning below this threshold
    acceptable: 0.7,                   // Acceptable confidence level
    high: 0.85,                        // High confidence level
    maximum: 0.95,                     // Maximum realistic confidence
    
    // Confidence-based actions
    actions: {
      belowMinimum: 'retry',           // Retry analysis
      belowWarning: 'flag',            // Flag for review
      belowAcceptable: 'note',         // Add note about confidence
      aboveHigh: 'highlight',          // Highlight high-confidence results
    }
  },
  
  // Error Handling
  errorHandling: {
    maxRetries: 3,                     // Maximum retry attempts
    retryDelay: 1000,                  // Initial retry delay (ms)
    retryBackoff: 2.0,                 // Exponential backoff multiplier
    retryJitter: 0.1,                  // Random jitter factor
    
    // Error Recovery Strategies
    recovery: {
      networkError: 'retry',           // Retry on network errors
      timeoutError: 'reduce_complexity', // Reduce complexity on timeout
      rateLimitError: 'delay',         // Delay on rate limit
      authError: 'abort',              // Abort on authentication errors
      unknownError: 'retry',           // Retry on unknown errors
    },
    
    // Fallback Behavior
    fallback: {
      enableFallbackProvider: false,   // Use fallback provider (disabled for demo)
      fallbackQuality: 'reduced',      // Reduced quality for fallback
      fallbackTimeout: 30000,          // Timeout for fallback requests
    }
  },
  
  // Performance Optimization
  performance: {
    enableCaching: true,               // Enable result caching
    cacheSize: 100,                    // Maximum cache entries
    cacheTTL: 3600000,                 // Cache TTL (1 hour)
    
    // Batch Processing
    batchProcessing: {
      enabled: true,                   // Enable batch processing
      maxBatchSize: 5,                 // Maximum photos per batch
      batchTimeout: 90000,             // Batch processing timeout
    },
    
    // Resource Management
    resourceManagement: {
      maxConcurrentRequests: 2,        // Maximum concurrent requests
      memoryThreshold: 0.8,            // Memory usage threshold
      cpuThreshold: 0.9,               // CPU usage threshold
    }
  }
};

// ============================================================================
// OUTPUT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Analysis output configuration
 * 
 * Controls how analysis results are formatted and presented
 * for different use cases and interfaces.
 */
export const analysisOutputConfig = {
  // Report Generation Settings
  reports: {
    // Concise Report Settings
    concise: {
      maxSummaryLength: 200,           // Maximum summary length (characters)
      maxKeyFindings: 3,               // Maximum key findings
      includeConfidence: true,         // Include confidence scores
      includeTimestamp: true,          // Include analysis timestamp
      includeActionItems: true,        // Include recommended actions
      
      // Formatting
      format: {
        useEmojis: true,               // Use emojis in reports
        highlightAlerts: true,         // Highlight alert conditions
        includeSeverity: true,         // Include severity indicators
        useColors: true,               // Use color coding
      }
    },
    
    // Detailed Report Settings
    detailed: {
      includeExecutiveSummary: true,   // Include executive summary
      includeRawData: false,           // Include raw AI data (disabled for demo)
      includeTechnicalDetails: true,   // Include technical analysis details
      includeRecommendations: true,    // Include detailed recommendations
      includeHistoricalComparison: true, // Include historical comparison
      
      // Sections
      sections: {
        overview: true,                // Overview section
        findings: true,                // Detailed findings
        patterns: true,                // Pattern analysis
        trends: true,                  // Trend analysis
        recommendations: true,         // Recommendations
        metadata: true,                // Analysis metadata
      }
    },
    
    // Export Settings
    export: {
      availableFormats: ['json', 'csv', 'pdf'], // Available export formats
      defaultFormat: 'json',           // Default export format
      includeImages: false,            // Include images in exports (disabled for demo)
      compressExports: true,           // Compress export files
      
      // PDF Export Settings
      pdf: {
        pageSize: 'A4',                // PDF page size
        orientation: 'portrait',       // PDF orientation
        margins: '20mm',               // PDF margins
        includeCharts: false,          // Include charts (disabled for demo)
      }
    }
  },
  
  // Alert Configuration
  alerts: {
    // Alert Levels
    levels: {
      normal: {
        name: 'Normal',
        color: brandConfig.colors.success,
        icon: '✅',
        priority: 'low',
        notifyUser: false,
        logLevel: 'info'
      },
      
      warning: {
        name: 'Warning',
        color: brandConfig.colors.warning,
        icon: '⚠️',
        priority: 'medium',
        notifyUser: true,
        logLevel: 'warn'
      },
      
      critical: {
        name: 'Critical',
        color: brandConfig.colors.error,
        icon: '🚨',
        priority: 'high',
        notifyUser: true,
        logLevel: 'error'
      },
      
      emergency: {
        name: 'Emergency',
        color: brandConfig.colors.error,
        icon: '🆘',
        priority: 'immediate',
        notifyUser: true,
        logLevel: 'error'
      }
    },
    
    // Alert Thresholds
    thresholds: {
      behaviorChange: 0.7,             // Behavior change detection threshold
      healthConcern: 0.6,              // Health concern threshold
      environmentalIssue: 0.5,         // Environmental issue threshold
      emergencyCondition: 0.9,         // Emergency condition threshold
    },
    
    // Alert Actions
    actions: {
      normal: [],                      // No actions for normal
      warning: ['log', 'display'],     // Log and display warnings
      critical: ['log', 'display', 'notify'], // Log, display, and notify
      emergency: ['log', 'display', 'notify', 'escalate'] // All actions plus escalate
    }
  },
  
  // Visualization Settings
  visualization: {
    // Chart Configuration
    charts: {
      enabled: false,                  // Disabled for demo
      types: ['line', 'bar', 'pie'],   // Supported chart types
      colorScheme: 'default',          // Color scheme
      responsive: true,                // Responsive charts
    },
    
    // Trend Visualization
    trends: {
      enabled: true,                   // Enable trend visualization
      timeRanges: ['1h', '6h', '12h', '24h', '7d'], // Available time ranges
      defaultRange: '12h',             // Default time range
      updateInterval: 300000,          // Update interval (5 minutes)
    }
  }
};

// ============================================================================
// DEMO ACCOUNT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Demo account specific settings
 * 
 * Special configuration for demo accounts with appropriate
 * restrictions and optimizations for business partner use.
 */
export const demoAccountConfig = {
  // Demo Restrictions
  restrictions: {
    enabledEmail: 'demo@onevault.ai',  // Only this email can use AI analysis
    maxAnalysesPerHour: 50,            // Maximum analyses per hour
    maxAnalysesPerDay: 200,            // Maximum analyses per day
    maxPhotosPerAnalysis: 10,          // Maximum photos per analysis
    maxStorageUsage: 100 * 1024 * 1024, // 100MB storage limit
    
    // Feature Limitations
    features: {
      enableMetaAnalysis: true,        // Enable meta-analysis
      enableTrendAnalysis: true,       // Enable trend analysis
      enableExport: true,              // Enable data export
      enableHistoricalComparison: true, // Enable historical comparison
      enableRealTimeAnalysis: true,    // Enable real-time analysis
    }
  },
  
  // Demo Optimizations
  optimizations: {
    fastMode: true,                    // Use fast analysis mode
    reducedQuality: false,             // Don't reduce quality for demo
    cacheResults: true,                // Cache results for demo
    preloadPrompts: true,              // Preload prompts for speed
    
    // Performance Tweaks
    performance: {
      parallelProcessing: true,        // Enable parallel processing
      resourceOptimization: true,      // Optimize resource usage
      backgroundProcessing: false,     // Disable background processing
    }
  },
  
  // Demo UI Features
  ui: {
    showDemoIndicators: true,          // Show "DEMO MODE" indicators
    showPerformanceMetrics: true,      // Show performance metrics
    showConfidenceScores: true,        // Show confidence scores
    showDetailedLogs: true,            // Show detailed logs
    
    // Demo Helpers
    helpers: {
      showTooltips: true,              // Show helpful tooltips
      showExplanations: true,          // Show analysis explanations
      showRecommendations: true,       // Show improvement recommendations
      enableGuidedTour: true,          // Enable guided tour
    }
  },
  
  // Demo Data
  demoData: {
    enableSampleData: true,            // Enable sample data generation
    sampleScenarios: [                // Predefined demo scenarios
      {
        name: 'Normal Monitoring',
        description: 'Regular monitoring with normal results',
        confidence: 0.85,
        alertLevel: 'normal'
      },
      {
        name: 'Attention Required',
        description: 'Monitoring with attention-required results',
        confidence: 0.75,
        alertLevel: 'warning'
      },
      {
        name: 'Critical Situation',
        description: 'Monitoring with critical results',
        confidence: 0.9,
        alertLevel: 'critical'
      }
    ]
  }
};

// ============================================================================
// INTEGRATION CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Integration settings
 * 
 * Configuration for integrating AI analysis with other system
 * components like storage, scheduling, and reporting.
 */
export const integrationConfig = {
  // Storage Integration
  storage: {
    autoStore: true,                   // Automatically store analysis results
    storeRawData: false,               // Don't store raw AI data (demo limitation)
    storeThumbnails: true,             // Store photo thumbnails
    compressionLevel: 'medium',        // Compression level for storage
    
    // Cleanup Settings
    cleanup: {
      autoCleanup: true,               // Enable automatic cleanup
      retentionPeriod: 30,             // Retention period (days)
      cleanupFrequency: 'daily',       // Cleanup frequency
    }
  },
  
  // Scheduler Integration
  scheduler: {
    enableScheduledAnalysis: true,     // Enable scheduled analysis
    analyzeOnCapture: true,            // Analyze immediately after capture
    batchAnalysis: true,               // Enable batch analysis
    
    // Scheduling Settings
    scheduling: {
      analysisDelay: 1000,             // Delay before analysis (ms)
      maxQueueSize: 10,                // Maximum analysis queue size
      priorityHandling: true,          // Handle priority requests first
    }
  },
  
  // Reporting Integration
  reporting: {
    enableRealtimeReports: true,       // Enable real-time reporting
    updateFrequency: 5000,             // Report update frequency (ms)
    enableNotifications: true,         // Enable report notifications
    
    // Report Distribution
    distribution: {
      chatInterface: true,             // Send to chat interface
      insightsPanel: true,             // Send to insights panel
      storage: true,                   // Store reports
      export: true,                    // Enable export
    }
  },
  
  // API Integration
  api: {
    enableWebhooks: false,             // Disable webhooks for demo
    webhookTimeout: 30000,             // Webhook timeout
    enableCallback: true,              // Enable callback functions
    
    // API Endpoints
    endpoints: {
      analysis: '/api/analysis',       // Analysis endpoint
      results: '/api/results',         // Results endpoint
      status: '/api/status',           // Status endpoint
    }
  }
};

// ============================================================================
// MAIN AI ANALYSIS CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete AI analysis configuration
 * 
 * This is the main configuration object that combines all AI analysis settings.
 * Import this in components that need AI analysis configuration:
 * 
 * ```typescript
 * import { aiAnalysisConfig } from '../config/aiAnalysisConfig';
 * 
 * // Check if analysis is enabled for user
 * if (aiAnalysisConfig.demo.restrictions.enabledEmail === userEmail) {
 *   // Perform analysis
 * }
 * 
 * // Get confidence threshold
 * const threshold = aiAnalysisConfig.behavior.confidence.acceptable;
 * ```
 */
export const aiAnalysisConfig = {
  // Core configuration sections
  provider: aiProviderConfig,
  behavior: analysisBehaviorConfig,
  output: analysisOutputConfig,
  demo: demoAccountConfig,
  integration: integrationConfig,
  
  // Configuration metadata
  version: '2.0.0',
  lastUpdated: '2025-01-15',
  
  // 💼 BUSINESS PARTNER: Quick access methods
  isAnalysisEnabled: (userEmail: string): boolean => {
    return userEmail === demoAccountConfig.restrictions.enabledEmail;
  },
  
  getConfidenceThreshold: (analysisDepth: string): number => {
    return analysisBehaviorConfig.depth[analysisDepth]?.confidenceThreshold || 0.7;
  },
  
  getMaxProcessingTime: (analysisDepth: string): number => {
    return analysisBehaviorConfig.depth[analysisDepth]?.maxProcessingTime || 30000;
  },
  
  getAlertColor: (alertLevel: string): string => {
    return analysisOutputConfig.alerts.levels[alertLevel]?.color || brandConfig.colors.info;
  },
  
  getAlertIcon: (alertLevel: string): string => {
    return analysisOutputConfig.alerts.levels[alertLevel]?.icon || 'ℹ️';
  },
  
  shouldRetry: (errorType: string): boolean => {
    const recovery = analysisBehaviorConfig.errorHandling.recovery[errorType];
    return recovery === 'retry';
  },
  
  getRateLimits: (): any => {
    return aiProviderConfig.primary.rateLimits;
  }
};

// ============================================================================
// HELPER FUNCTIONS FOR BUSINESS PARTNERS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Check if AI analysis is available
 * 
 * Comprehensive check for AI analysis availability including
 * user permissions, system status, and resource availability.
 */
export const isAIAnalysisAvailable = (userEmail: string): {
  available: boolean;
  reason?: string;
} => {
  // Check demo account
  if (!aiAnalysisConfig.isAnalysisEnabled(userEmail)) {
    return {
      available: false,
      reason: 'AI analysis is only available for demo accounts'
    };
  }
  
  // Check system status (would check actual system status in production)
  const systemHealthy = true;
  if (!systemHealthy) {
    return {
      available: false,
      reason: 'AI analysis system is currently unavailable'
    };
  }
  
  // Check rate limits (would check actual usage in production)
  const withinRateLimits = true;
  if (!withinRateLimits) {
    return {
      available: false,
      reason: 'Rate limit exceeded. Please try again later.'
    };
  }
  
  return { available: true };
};

/**
 * 💼 BUSINESS PARTNER: Get optimal analysis depth for photo count
 */
export const getOptimalAnalysisDepth = (photoCount: number, timeAvailable: number): string => {
  if (photoCount === 1 && timeAvailable < 20000) {
    return 'basic';
  } else if (photoCount <= 3 && timeAvailable < 45000) {
    return 'standard';
  } else if (photoCount <= 5 && timeAvailable < 90000) {
    return 'detailed';
  } else {
    return 'comprehensive';
  }
};

/**
 * 💼 BUSINESS PARTNER: Calculate analysis cost estimate
 */
export const calculateAnalysisCost = (photoCount: number, analysisDepth: string): {
  tokens: number;
  cost: number;
  currency: string;
} => {
  const baseTokens = 1000;
  const tokensPerPhoto = 500;
  const depthMultiplier = {
    basic: 1,
    standard: 1.5,
    detailed: 2,
    comprehensive: 3
  };
  
  const totalTokens = (baseTokens + (photoCount * tokensPerPhoto)) * 
                     (depthMultiplier[analysisDepth] || 1);
  
  // Cost calculation (demo pricing)
  const costPerToken = 0.00003; // $0.03 per 1K tokens
  const totalCost = totalTokens * costPerToken;
  
  return {
    tokens: totalTokens,
    cost: totalCost,
    currency: 'USD'
  };
};

/**
 * 💼 BUSINESS PARTNER: Get analysis configuration summary
 */
export const getAnalysisConfigSummary = () => {
  return {
    provider: aiAnalysisConfig.provider.primary.provider,
    model: aiAnalysisConfig.provider.primary.model,
    maxPhotos: aiAnalysisConfig.demo.restrictions.maxPhotosPerAnalysis,
    maxAnalysesPerDay: aiAnalysisConfig.demo.restrictions.maxAnalysesPerDay,
    confidenceThreshold: aiAnalysisConfig.behavior.confidence.acceptable,
    cachingEnabled: aiAnalysisConfig.behavior.performance.enableCaching,
    demoMode: true,
    version: aiAnalysisConfig.version
  };
};

/**
 * 💼 BUSINESS PARTNER: Validate analysis configuration
 */
export const validateAnalysisConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate provider configuration
  if (!aiAnalysisConfig.provider.primary.provider) {
    errors.push('Primary AI provider not configured');
  }
  
  // Validate demo restrictions
  if (!aiAnalysisConfig.demo.restrictions.enabledEmail) {
    errors.push('Demo email not configured');
  }
  
  // Validate confidence thresholds
  if (aiAnalysisConfig.behavior.confidence.minimum >= 
      aiAnalysisConfig.behavior.confidence.acceptable) {
    errors.push('Confidence thresholds are not properly ordered');
  }
  
  // Validate timeout settings
  if (aiAnalysisConfig.provider.primary.timeouts.requestTimeout <= 0) {
    errors.push('Request timeout must be positive');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default aiAnalysisConfig; 