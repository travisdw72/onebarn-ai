/**
 * AI Token Optimization Types
 * Comprehensive TypeScript interfaces for the smart pre-processing pipeline
 */

// Image Quality Assessment
export interface IImageQualityMetrics {
  brightness: number;           // 0-100 brightness level
  contrast: number;            // 0-100 contrast level
  sharpness: number;           // 0-100 sharpness level
  noise: number;               // 0-100 noise level (lower is better)
  resolution: {
    width: number;
    height: number;
    megapixels: number;
  };
  fileSize: number;            // bytes
  format: string;              // 'jpeg', 'png', 'webp', etc.
  hasHistogram: boolean;
}

export interface IImageQualityResult {
  passed: boolean;
  score: number;               // 0-100 overall quality score
  metrics: IImageQualityMetrics;
  failureReasons: string[];
  recommendations: string[];
  processingTime: number;      // milliseconds
}

// Occupancy Detection
export interface IOccupancyDetectionResult {
  hasOccupancy: boolean;
  confidence: number;          // 0-1 confidence level
  occupancyType: 'horse' | 'human' | 'equipment' | 'multiple' | 'unknown' | 'empty';
  occupancyCount: number;
  boundingBoxes: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
    label: string;
  }>;
  processingTime: number;
  metadata: {
    analysisMethod: 'pixel_density' | 'edge_detection' | 'color_analysis' | 'hybrid';
    sensitivity: number;
    threshold: number;
  };
}

// Motion Detection
export interface IMotionDetectionResult {
  motionDetected: boolean;
  motionScore: number;         // 0-100 motion intensity
  motionAreas: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    intensity: number;
  }>;
  processingTime: number;
  comparisonImage?: string;    // base64 of comparison image
  frameDifference: number;     // 0-100 difference percentage
  motionType: 'significant' | 'minor' | 'static' | 'unstable';
}

// Duplicate Content Detection
export interface IDuplicateDetectionResult {
  isDuplicate: boolean;
  similarity: number;          // 0-1 similarity score
  duplicateOf?: string;        // hash or ID of original
  comparisonMethod: 'perceptual_hash' | 'histogram' | 'feature_match' | 'pixel_diff';
  processingTime: number;
  metadata: {
    threshold: number;
    hashAlgorithm: string;
    comparedHashes: number;
  };
}

// Time-based Filtering - Enhanced for Night Priority Monitoring
export interface ITimeBasedFilterResult {
  shouldProcess: boolean;
  reason: 'night_priority' | 'emergency_hours' | 'day_optimization' | 'transition_hours' | 'scheduled_maintenance' | 'feeding_time' | 'training_session' | 'night_check' | 'critical_monitoring' | 'override';
  currentHour: number;
  timeCategory: 'night_priority' | 'emergency_hours' | 'day_optimization' | 'transition_hours';
  processingPriority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  optimizationMode: {
    enableOptimization: boolean;
    emergencyMode: boolean;
    thresholdAdjustments: {
      qualityReduction?: number;
      motionIncrease?: number;
      bypassModes?: string[];
    };
  };
  scheduleType: 'barn_schedule' | 'horse_schedule' | 'facility_schedule' | 'global_schedule';
  nextActiveTime?: Date;
  metadata: {
    timezone: string;
    schedule: string;
    overrides: string[];
    safetyProfile: 'maximum_monitoring' | 'enhanced_monitoring' | 'standard_monitoring' | 'optimized_monitoring';
  };
}

// Comprehensive Pre-processing Result
export interface IPreProcessingResult {
  shouldProceed: boolean;
  overallScore: number;        // 0-100 combined optimization score
  tokenSavingsEstimate: number; // percentage saved
  
  // Individual assessment results
  imageQuality: IImageQualityResult;
  occupancy: IOccupancyDetectionResult;
  motion: IMotionDetectionResult;
  duplicate: IDuplicateDetectionResult;
  timeFilter: ITimeBasedFilterResult;
  contentType: IContentTypeDetectionResult;
  
  // Processing metadata
  processingTime: {
    total: number;
    breakdown: {
      imageQuality: number;
      occupancy: number;
      motion: number;
      duplicate: number;
      timeFilter: number;
      contentType: number;
    };
  };
  
  // Optimization decisions
  decisions: {
    skipReason?: 'low_quality' | 'no_occupancy' | 'no_motion' | 'duplicate' | 'inactive_time' | 'day_optimization' | 'human_content' | 'equipment_only' | 'manual_override';
    bypassReason?: 'night_priority' | 'emergency_hours' | 'critical_monitoring' | 'feeding_time' | 'horse_content_priority' | 'safety_override';
    confidence: number;
    recommendations: string[];
    safetyProfile: 'maximum_monitoring' | 'enhanced_monitoring' | 'standard_monitoring' | 'optimized_monitoring';
  };
  
  // Analytics data
  analytics: {
    sessionId: string;
    sequence: number;
    timestamp: string;
    source: 'camera' | 'upload' | 'manual' | 'scheduled';
    context: string;
  };
}

// Optimization Configuration Interfaces
export interface IImageQualityThresholds {
  minBrightness: number;
  maxBrightness: number;
  minContrast: number;
  minSharpness: number;
  maxNoise: number;
  minResolution: {
    width: number;
    height: number;
    megapixels: number;
  };
  maxFileSize: number;         // bytes
  acceptedFormats: string[];
}

export interface IOccupancyThresholds {
  minConfidence: number;
  minPixelDensity: number;
  edgeDetectionThreshold: number;
  colorAnalysisThreshold: number;
  hybridWeights: {
    pixelDensity: number;
    edgeDetection: number;
    colorAnalysis: number;
  };
}

export interface IMotionThresholds {
  minMotionScore: number;
  frameDifferenceThreshold: number;
  motionAreaThreshold: number;
  staticFrameLimit: number;    // consecutive static frames before skip
  unstableFrameLimit: number;  // max unstable frames before skip
}

export interface IDuplicateThresholds {
  maxSimilarity: number;       // 0-1, above this is duplicate
  hashCacheSize: number;       // number of recent hashes to keep
  cacheDurationMinutes: number;
  comparisonMethod: string;
}

// Black Frame Detection - for completely black/fade frames
export interface IBlackFrameThresholds {
  enabled: boolean;
  maxBrightness: number;       // 0-100, below this is considered black
  maxColorVariance: number;    // 0-100, uniformity threshold
  skipTransitionFrames: boolean;
}

// Transition Frame Detection - for fade/dissolve effects
export interface ITransitionFrameThresholds {
  enabled: boolean;
  maxBrightness: number;       // upper bound for transition detection
  minBrightness: number;       // lower bound for transition detection
  uniformityThreshold: number; // color uniformity for fade detection
  edgeThreshold: number;       // edge density for transition detection
}

export interface ITimeBasedThresholds {
  // 🌙 Night Priority Monitoring Configuration
  nightPriorityHours: {
    start: number;             // 0-23 hour for night priority start
    end: number;               // 0-23 hour for night priority end  
  };
  dayOptimizationHours: {
    start: number;             // 0-23 hour for aggressive optimization start
    end: number;               // 0-23 hour for aggressive optimization end
  };
  emergencyHours: {
    start: number;             // 0-23 hour for peak emergency monitoring
    end: number;               // 0-23 hour for peak emergency monitoring end
  };
  
  // Time-based behavior configuration
  timeBasedBehavior: {
    nightPriority: {
      enableOptimization: boolean;
      emergencyMode: boolean;
      processingPriority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
      qualityThresholdReduction: number;    // 0-1 multiplier
      motionSensitivityIncrease: number;    // multiplier for motion sensitivity
      duplicateBypassMode: boolean;
    };
    emergencyHours: {
      enableOptimization: boolean;  
      emergencyMode: boolean;
      processingPriority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
      qualityThresholdReduction: number;
      motionSensitivityIncrease: number;
      duplicateBypassMode: boolean;
      occupancyBypassMode: boolean;
    };
    dayOptimization: {
      enableOptimization: boolean;
      aggressiveMode: boolean;
      processingPriority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
      qualityThresholdIncrease: number;     // multiplier for stricter quality
      motionSensitivityDecrease: number;    // multiplier for less sensitivity
      duplicateEnhancedMode: boolean;
    };
    transitionHours: {
      enableOptimization: boolean;
      balancedMode: boolean;
      processingPriority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
      standardThresholds: boolean;
    };
  };
  
  scheduleOverrides: Array<{
    type: 'feeding' | 'evening_feeding' | 'night_check' | 'midnight_watch' | 'dawn_check' | 'training' | 'maintenance' | 'cleaning';
    startTime: string;         // HH:MM format
    endTime: string;
    daysOfWeek: number[];      // 0-6, Sunday=0
    action: 'process' | 'enhanced_process' | 'critical_process' | 'optimized_process' | 'skip' | 'reduce_frequency';
    priority?: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  }>;
}

// Optimization Statistics
export interface IOptimizationStats {
  session: {
    totalRequests: number;
    optimizedRequests: number;
    skippedRequests: number;
    tokensSaved: number;
    costSavings: number;       // dollars
    averageProcessingTime: number;
  };
  
  daily: {
    date: string;
    totalRequests: number;
    optimizedRequests: number;
    tokensSaved: number;
    costSavings: number;
    topSkipReasons: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
  };
  
  quality: {
    averageImageQuality: number;
    occupancyDetectionAccuracy: number;
    motionDetectionAccuracy: number;
    duplicateDetectionAccuracy: number;
  };
  
  performance: {
    averagePreProcessingTime: number;
    cacheHitRate: number;
    errorRate: number;
    systemLoad: number;
  };
}

// Hook Return Types
export interface IUseAIOptimizationReturn {
  // Pre-processing function
  preProcessRequest: (
    imageData: string,
    context?: IAnalysisContext
  ) => Promise<IPreProcessingResult>;
  
  // Configuration management
  updateThresholds: (thresholds: Partial<IOptimizationThresholds>) => void;
  getThresholds: () => IOptimizationThresholds;
  resetToDefaults: () => void;
  
  // Statistics and monitoring
  getStats: () => IOptimizationStats;
  clearStats: () => void;
  exportStats: () => string; // JSON string
  
  // Cache management
  clearCache: () => void;
  getCacheStats: () => {
    size: number;
    hitRate: number;
    oldestEntry: Date;
    newestEntry: Date;
  };
  
  // Real-time status
  status: {
    isProcessing: boolean;
    queueSize: number;
    lastOptimization: Date | null;
    errorCount: number;
    successRate: number;
  };
  
  // Error handling
  lastError: string | null;
  clearError: () => void;
}

// Consolidated Threshold Configuration
export interface IContentTypeThresholds {
  // 🐎 Horse Content Detection
  horseContent: {
    minConfidence: number;
    colorPatterns: {
      brownRange: { min: number; max: number };
      blackRange: { min: number; max: number };
      whiteRange: { min: number; max: number; saturation: { max: number } };
      expectedHorseColors: string[];
    };
    shapeDetection: {
      aspectRatioRange: { min: number; max: number };
      sizeThreshold: number;
      edgeComplexity: number;
    };
    motionPatterns: {
      horizontalMovement: number;
      periodicMotion: number;
      naturalMovement: number;
    };
  };
  
  // 👥 Human Content Detection (to SKIP)
  humanContent: {
    maxConfidence: number;
    faceDetection: {
      maxFaceSize: number;
      faceAspectRatio: { min: number; max: number };
      skinToneDetection: boolean;
    };
    textOverlays: {
      maxTextArea: number;
      titleCardDetection: boolean;
      subtitleDetection: boolean;
    };
    studioEnvironment: {
      uniformBackground: number;
      artificialLighting: number;
      indoorEnvironment: number;
    };
  };

  // 🏠 Environment Content Detection
  environmentContent: {
    barnEnvironment: {
      minConfidence: number;
      naturalLighting: number;
      woodTextures: number;
      strawBedding: number;
      outdoorIndicators: number;
    };
    equipmentOnly: {
      maxConfidence: number;
      staticObjects: number;
      noMovement: number;
    };
  };

  // 🎯 Content Classification Weights
  classificationWeights: {
    colorAnalysis: number;
    shapeDetection: number;
    motionAnalysis: number;
    environmentContext: number;
    exclusionFactors: number;
  };

  // 🎬 Video-specific Settings
  videoAnalysis: {
    sampleFrameInterval: number;
    minAnalysisFrames: number;
    consistencyThreshold: number;
    skipIntroOutroSeconds: number;
  };
}

export interface IOptimizationThresholds {
  imageQuality: IImageQualityThresholds;
  occupancy: IOccupancyThresholds;
  motion: IMotionThresholds;
  duplicate: IDuplicateThresholds;
  timeBased: ITimeBasedThresholds;
  contentType: IContentTypeThresholds;
  blackFrameDetection: IBlackFrameThresholds;
  transitionFrameDetection: ITransitionFrameThresholds;
  
  // Global settings
  global: {
    enabled: boolean;
    aggressiveMode: boolean;    // stricter thresholds for max savings
    conservativeMode: boolean;  // lenient thresholds for max coverage
    debugMode: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    maxProcessingTime: number;  // milliseconds
    fallbackOnError: boolean;   // proceed with analysis if optimization fails
  };
}

// Analysis Context
export interface IAnalysisContext {
  source: 'camera' | 'upload' | 'manual' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  horseId?: string;
  sessionId?: string;
  previousImage?: string;      // for motion detection
  expectedContent?: 'horse' | 'human' | 'equipment' | 'empty';
  environmentalFactors?: {
    lighting: 'good' | 'poor' | 'artificial' | 'natural';
    weather: 'clear' | 'cloudy' | 'rainy' | 'snowy';
    timeOfDay: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  };
  overrides?: {
    skipQualityCheck?: boolean;
    skipOccupancyCheck?: boolean;
    skipMotionCheck?: boolean;
    skipDuplicateCheck?: boolean;
    skipTimeCheck?: boolean;
    forceProcess?: boolean;
  };
}

// Service Configuration
// Content Type Detection Result
export interface IContentTypeDetectionResult {
  contentType: 'horse' | 'human' | 'equipment' | 'mixed' | 'unknown';
  confidence: number;          // 0-1 confidence in classification
  shouldProcess: boolean;      // based on content type preferences
  analysis: {
    horseContent: {
      confidence: number;
      detectedFeatures: string[];
      colorMatch: number;
      shapeMatch: number;
      motionMatch: number;
    };
    humanContent: {
      confidence: number;
      faceDetected: boolean;
      textOverlayDetected: boolean;
      studioEnvironment: boolean;
    };
    environmentContent: {
      barnEnvironment: number;
      equipmentOnly: number;
      outdoorSetting: number;
    };
  };
  processingTime: number;
  recommendations: string[];
}

export interface IAIOptimizationServiceConfig {
  thresholds: IOptimizationThresholds;
  enabledOptimizations: {
    imageQuality: boolean;
    occupancyDetection: boolean;
    motionDetection: boolean;
    duplicateDetection: boolean;
    timeBasedFiltering: boolean;
    contentTypeDetection: boolean;
  };
  performance: {
    cacheSize: number;
    maxConcurrentAnalyses: number;
    processingTimeout: number;
    retryAttempts: number;
  };
  logging: {
    enabled: boolean;
    level: string;
    includeImages: boolean;     // for debugging (be careful with storage)
    maxLogSize: number;
  };
}

// Export consolidated interface for service constructor
export interface IAIOptimizationConfig extends IAIOptimizationServiceConfig {
  brandConfig?: {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, any>;
  };
} 