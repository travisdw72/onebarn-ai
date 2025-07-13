import type { IAIOptimizationConfig } from '../interfaces/AIOptimizationTypes';

/**
 * 🤖 AI Token Optimization Configuration
 * 
 * Smart pre-processing pipeline configuration for One Barn AI platform
 * Designed to reduce AI token usage by 40-50% through intelligent filtering
 * 
 * Configuration follows brandConfig.ts patterns for consistency
 */

export const aiOptimizationConfig: IAIOptimizationConfig = {
  // 🎯 Core Optimization Thresholds - CALIBRATED FOR BARN ENVIRONMENTS
  thresholds: {
    // 📸 Image Quality Thresholds - BARN OPTIMIZED
    imageQuality: {
      minBrightness: 2,            // ✅ FIXED: Even lower to catch almost-black frames (was 5)  
      maxBrightness: 98,           // ✅ FIXED: Raised for bright outdoor areas (was 95)  
      minContrast: 8,              // ✅ FIXED: Lowered for barn environments (was 20)
      minSharpness: 12,            // ✅ FIXED: Lowered for barn cameras (was 25)
      maxNoise: 85,                // ✅ FIXED: Raised noise tolerance (was 80)
      
      // 🚫 BLACK FRAME DETECTION - NEW ADDITION
      blackFrameDetection: {
        maxBrightness: 3,          // ✅ NEW: Frames with <3% brightness = black frame
        maxContrast: 2,            // ✅ NEW: Frames with <2% contrast = flat/empty  
        maxColorVariance: 5,       // ✅ NEW: <5% color variance = monochrome/empty
        skipBlackFrames: true      // ✅ NEW: Automatically skip detected black frames
      },
      
      // 🎬 TRANSITION FRAME DETECTION - NEW ADDITION  
      transitionFrameDetection: {
        maxBrightness: 8,          // ✅ NEW: Very dark transition frames
        minBrightness: 92,         // ✅ NEW: Very bright transition frames (white flash)
        uniformityThreshold: 85,   // ✅ NEW: >85% uniform color = transition frame
        skipTransitionFrames: true // ✅ NEW: Skip transition/fade frames
      },
      
      minResolution: {
        width: 240,                // ✅ FIXED: Lowered for barn cameras (was 320)
        height: 180,               // ✅ FIXED: Lowered for barn cameras (was 240)
        megapixels: 0.05           // ✅ FIXED: 0.05MP minimum (was 0.1)
      },
      maxFileSize: 50 * 1024 * 1024, // 50MB maximum file size
      acceptedFormats: ['jpeg', 'jpg', 'png', 'webp']
    },

    // 🐎 Occupancy Detection Thresholds - HORSE OPTIMIZED  
    occupancy: {
      minConfidence: 0.1,          // ✅ FIXED: Much lower for barn environments (was 0.3)
      minPixelDensity: 0.08,       // ✅ FIXED: Lowered for subtle horse presence (was 0.15)
      edgeDetectionThreshold: 0.1, // ✅ FIXED: More sensitive edge detection (was 0.2)
      colorAnalysisThreshold: 0.15, // ✅ FIXED: More flexible color analysis (was 0.25)
      hybridWeights: {
        pixelDensity: 0.3,         // ✅ ADJUSTED: Reduced weight (was 0.4)
        edgeDetection: 0.4,        // ✅ ADJUSTED: Increased weight (was 0.35)
        colorAnalysis: 0.3         // ✅ ADJUSTED: Increased weight (was 0.25)
      }
    },

    // 🎯 Content Type Detection Thresholds (NEW - for video filtering)
    contentType: {
      // 🐎 Horse Content Detection
      horseContent: {
        minConfidence: 0.4,        // Minimum confidence this is horse content
        colorPatterns: {
          brownRange: { min: 15, max: 45 },    // Brown/chestnut horse colors (HSV hue)
          blackRange: { min: 0, max: 10 },     // Black horse colors  
          whiteRange: { min: 0, max: 360, saturation: { max: 20 } }, // White/gray horses
          expectedHorseColors: ['brown', 'black', 'white', 'bay', 'chestnut']
        },
        shapeDetection: {
          aspectRatioRange: { min: 1.2, max: 2.5 }, // Horse body aspect ratio
          sizeThreshold: 0.1,       // Horse should occupy 10%+ of frame
          edgeComplexity: 0.3       // Horses have complex edge patterns
        },
        motionPatterns: {
          horizontalMovement: 0.6,  // Horses move more horizontally
          periodicMotion: 0.4,      // Rhythmic gait patterns
          naturalMovement: 0.5      // Organic vs mechanical movement
        }
      },
      
      // 👥 Human Content Detection (to SKIP)
      humanContent: {
        maxConfidence: 0.3,        // Skip if >30% confidence this is human content
        faceDetection: {
          maxFaceSize: 0.25,       // Skip if face >25% of frame (talking head)
          faceAspectRatio: { min: 0.7, max: 1.3 }, // Human face proportions
          skinToneDetection: true   // Detect human skin tones
        },
        textOverlays: {
          maxTextArea: 0.15,       // Skip if >15% of frame is text/graphics
          titleCardDetection: true, // Detect intro/title cards
          subtitleDetection: true   // Detect subtitle areas
        },
        studioEnvironment: {
          uniformBackground: 0.8,   // Skip uniform backgrounds (studio setup)
          artificialLighting: 0.7,  // Skip professional lighting patterns
          indoorEnvironment: 0.6    // Prefer outdoor/barn environments
        }
      },

      // 🏠 Environment Content Detection
      environmentContent: {
        barnEnvironment: {
          minConfidence: 0.3,      // Prefer barn/stable environments
          naturalLighting: 0.4,    // Natural vs artificial lighting
          woodTextures: 0.3,       // Barn wood detection
          strawBedding: 0.2,       // Stall bedding detection
          outdoorIndicators: 0.5   // Pasture/outdoor elements
        },
        equipmentOnly: {
          maxConfidence: 0.6,      // Skip if >60% equipment/no animals
          staticObjects: 0.7,      // Too many static objects
          noMovement: 0.8          // No organic movement detected
        }
      },

      // 🎯 Content Classification Weights
      classificationWeights: {
        colorAnalysis: 0.25,       // 25% weight for color pattern matching
        shapeDetection: 0.3,       // 30% weight for shape/form recognition  
        motionAnalysis: 0.2,       // 20% weight for movement patterns
        environmentContext: 0.15,  // 15% weight for environmental cues
        exclusionFactors: 0.1      // 10% weight for human/unwanted content
      },

      // 🎬 Video-specific Settings
      videoAnalysis: {
        sampleFrameInterval: 30,   // Analyze every 30th frame for performance
        minAnalysisFrames: 5,      // Analyze at least 5 frames before decision
        consistencyThreshold: 0.6, // 60% of frames must agree on content type
        skipIntroOutroSeconds: 10  // Skip first/last 10 seconds (often titles/credits)
      }
    },

    // 🎬 Motion Detection Thresholds - HORSE CALIBRATED ✅
    motion: {
      minMotionScore: 5,           // ✅ FIXED: Much lower for subtle horse movements (was 15)
      frameDifferenceThreshold: 2, // ✅ FIXED: More sensitive frame difference (was 5)
      motionAreaThreshold: 0.05,   // ✅ FIXED: Lowered motion area requirement (was 0.1)
      staticFrameLimit: 10,        // ✅ FIXED: Allow more static frames (was 5)
      unstableFrameLimit: 8        // ✅ FIXED: More tolerance for barn cameras (was 3)
    },

    // 🔄 Duplicate Detection Thresholds
    duplicate: {
      maxSimilarity: 0.85,         // Above 85% similarity = duplicate
      hashCacheSize: 100,          // Keep 100 recent image hashes
      cacheDurationMinutes: 60,    // Cache hashes for 1 hour
      comparisonMethod: 'perceptual_hash' // Primary comparison method
    },

    // ⏰ Time-based Filter Thresholds - NIGHT PRIORITY MONITORING
    timeBased: {
      // 🌙 HIGH PRIORITY NIGHT MONITORING (Emergency hours)
      nightPriorityHours: {
        start: 22,                 // 10 PM - Start of high-alert monitoring
        end: 6                     // 6 AM - End of night priority period
      },
      // ☀️ Day hours with more aggressive optimization
      dayOptimizationHours: {
        start: 9,                  // 9 AM - Safe optimization period
        end: 17                    // 5 PM - End of aggressive optimization
      },
      // 🚨 CRITICAL EMERGENCY HOURS (Highest sensitivity)
      emergencyHours: {
        start: 0,                  // Midnight - Peak emergency time
        end: 4                     // 4 AM - End of peak emergency period
      },
      // ⚙️ Optimization behavior by time period
      timeBasedBehavior: {
        nightPriority: {
          // 🌙 22:00-06:00 - Minimal optimization, maximum monitoring
          enableOptimization: false,        // Skip most optimizations
          emergencyMode: true,              // Enhanced sensitivity
          processingPriority: 'urgent',     // Fast processing
          qualityThresholdReduction: 0.5,   // 50% lower quality thresholds
          motionSensitivityIncrease: 2.0,   // 2x more sensitive motion detection
          duplicateBypassMode: true         // Process even similar frames
        },
        emergencyHours: {
          // 🚨 00:00-04:00 - Maximum sensitivity, bypass ALL optimizations
          enableOptimization: false,        // No optimization during peak danger
          emergencyMode: true,
          processingPriority: 'critical',
          qualityThresholdReduction: 0.7,   // 70% lower quality thresholds
          motionSensitivityIncrease: 3.0,   // 3x more sensitive
          duplicateBypassMode: true,
          occupancyBypassMode: true         // Process even potentially empty stalls
        },
        dayOptimization: {
          // ☀️ 09:00-17:00 - Aggressive optimization during safe hours
          enableOptimization: true,
          aggressiveMode: true,             // Maximum token savings
          processingPriority: 'normal',
          qualityThresholdIncrease: 1.5,    // 50% stricter quality requirements
          motionSensitivityDecrease: 0.7,   // Less sensitive during active hours
          duplicateEnhancedMode: true       // More aggressive duplicate detection
        },
        transitionHours: {
          // 🌅🌇 06:00-09:00 & 17:00-22:00 - Balanced approach
          enableOptimization: true,
          balancedMode: true,
          processingPriority: 'normal',
          standardThresholds: true
        }
      },
      scheduleOverrides: [
        {
          type: 'feeding',
          startTime: '06:00',        // Early morning feeding
          endTime: '07:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days
          action: 'enhanced_process',  // Extra monitoring during feeding
          priority: 'high'
        },
        {
          type: 'evening_feeding',
          startTime: '17:00',        // Evening feeding
          endTime: '18:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days
          action: 'enhanced_process',
          priority: 'high'
        },
        {
          type: 'night_check',
          startTime: '22:00',        // Night check rounds
          endTime: '22:30',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days
          action: 'critical_process', // Maximum sensitivity
          priority: 'critical'
        },
        {
          type: 'midnight_watch',
          startTime: '00:00',        // Midnight wellness check
          endTime: '00:30',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days
          action: 'critical_process',
          priority: 'critical'
        },
        {
          type: 'dawn_check',
          startTime: '05:30',        // Pre-dawn check
          endTime: '06:00',
          daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // All days
          action: 'enhanced_process',
          priority: 'high'
        },
        {
          type: 'training',
          startTime: '09:00',
          endTime: '17:00',
          daysOfWeek: [1, 2, 3, 4, 5], // Weekdays only
          action: 'optimized_process'   // Can use optimization during training
        },
        {
          type: 'maintenance',
          startTime: '12:00',
          endTime: '13:00',
          daysOfWeek: [0],         // Sunday maintenance
          action: 'skip'           // Skip during maintenance (day hours only)
        },
        {
          type: 'cleaning',
          startTime: '10:00',      // Moved to safe daytime hours
          endTime: '11:00',
          daysOfWeek: [2, 4, 6],   // Tue, Thu, Sat
          action: 'skip'           // Safe to skip during day cleaning
        }
      ]
    },

    // 🌐 Global Optimization Settings
    global: {
      enabled: true,               // Master enable/disable switch
      aggressiveMode: false,       // Stricter thresholds for maximum savings
      conservativeMode: false,     // Lenient thresholds for maximum coverage
      debugMode: import.meta.env.DEV, // Debug mode only in development
      logLevel: import.meta.env.DEV ? 'debug' : 'info',
      maxProcessingTime: 5000,     // 5 second max processing time
      fallbackOnError: true        // Continue with AI analysis if optimization fails
    }
  },

  // ⚙️ Enabled Optimizations Control
  enabledOptimizations: {
    imageQuality: true,            // Enable image quality pre-filtering
    occupancyDetection: true,      // Enable empty stall detection
    motionDetection: true,         // Enable motion-based filtering
    duplicateDetection: true,      // Enable duplicate content prevention
    timeBasedFiltering: true,      // Enable time-based scheduling
    contentTypeDetection: true     // Enable horse vs human content filtering
  },

  // 🚀 Performance Configuration
  performance: {
    cacheSize: 1000,              // Cache 1000 processed results
    maxConcurrentAnalyses: 3,     // Max 3 concurrent pre-processing operations
    processingTimeout: 10000,     // 10 second timeout for processing
    retryAttempts: 2              // Retry failed optimizations twice
  },

  // 📝 Logging Configuration
  logging: {
    enabled: true,
    level: import.meta.env.DEV ? 'debug' : 'info',
    includeImages: import.meta.env.DEV, // Only include image data in dev
    maxLogSize: 1024 * 1024       // 1MB max log size
  }
};

// 🎯 Preset Configurations for Different Use Cases

/**
 * Aggressive optimization preset - Maximum token savings
 * Use when cost optimization is the highest priority
 */
export const aggressivePreset: Partial<IAIOptimizationConfig> = {
  thresholds: {
    ...aiOptimizationConfig.thresholds,
    imageQuality: {
      ...aiOptimizationConfig.thresholds.imageQuality,
      minBrightness: 25,          // Stricter brightness requirements
      minContrast: 35,            // Higher contrast requirements
      minSharpness: 40            // Stricter sharpness requirements
    },
    occupancy: {
      ...aiOptimizationConfig.thresholds.occupancy,
      minConfidence: 0.5,         // Higher confidence required
      minPixelDensity: 0.25       // 25% pixel density required
    },
    motion: {
      ...aiOptimizationConfig.thresholds.motion,
      minMotionScore: 25,         // Higher motion threshold
      staticFrameLimit: 3         // Skip after 3 static frames
    },
    duplicate: {
      ...aiOptimizationConfig.thresholds.duplicate,
      maxSimilarity: 0.75         // Lower similarity threshold (more aggressive)
    },
    global: {
      ...aiOptimizationConfig.thresholds.global,
      aggressiveMode: true
    }
  }
};

/**
 * Conservative optimization preset - Maximum coverage with optimization
 * Use when analysis coverage is more important than cost savings
 */
export const conservativePreset: Partial<IAIOptimizationConfig> = {
  thresholds: {
    ...aiOptimizationConfig.thresholds,
    imageQuality: {
      ...aiOptimizationConfig.thresholds.imageQuality,
      minBrightness: 5,           // Very lenient brightness
      minContrast: 10,            // Lower contrast requirements
      minSharpness: 15            // Lower sharpness requirements
    },
    occupancy: {
      ...aiOptimizationConfig.thresholds.occupancy,
      minConfidence: 0.2,         // Lower confidence threshold
      minPixelDensity: 0.1        // 10% pixel density sufficient
    },
    motion: {
      ...aiOptimizationConfig.thresholds.motion,
      minMotionScore: 8,          // Lower motion threshold
      staticFrameLimit: 10        // Allow more static frames
    },
    duplicate: {
      ...aiOptimizationConfig.thresholds.duplicate,
      maxSimilarity: 0.95         // Higher similarity threshold (less aggressive)
    },
    global: {
      ...aiOptimizationConfig.thresholds.global,
      conservativeMode: true
    }
  }
};

/**
 * Demo mode preset - Optimized for demonstration purposes
 * Balanced settings with visible optimization effects
 */
export const demoPreset: Partial<IAIOptimizationConfig> = {
  thresholds: {
    ...aiOptimizationConfig.thresholds,
    duplicate: {
      ...aiOptimizationConfig.thresholds.duplicate,
      cacheDurationMinutes: 5     // Shorter cache for demo
    },
    global: {
      ...aiOptimizationConfig.thresholds.global,
      debugMode: true,
      logLevel: 'debug' as const
    }
  },
  logging: {
    ...aiOptimizationConfig.logging,
    enabled: true,
    level: 'debug',
    includeImages: true
  }
};

// 📊 Cost Estimation Constants
export const costEstimation = {
  // Token costs (approximate, as of 2024)
  tokenCosts: {
    openai_gpt4_vision: 0.01 / 1000,    // $0.01 per 1K tokens
    anthropic_claude_vision: 0.008 / 1000, // $0.008 per 1K tokens
    averageTokensPerImage: 2000          // Average tokens per image analysis
  },
  
  // Savings projections
  expectedSavings: {
    imageQuality: 0.15,          // 15% savings
    occupancyDetection: 0.40,    // 40% savings (biggest impact)
    motionDetection: 0.25,       // 25% savings
    duplicateDetection: 0.20,    // 20% savings
    timeBasedFiltering: 0.10     // 10% savings
  },
  
  // Combined savings (not additive due to overlap)
  totalExpectedSavings: {
    conservative: 0.35,          // 35% total savings
    balanced: 0.50,              // 50% total savings
    aggressive: 0.65             // 65% total savings
  }
};

// 🔧 Utility Functions for Configuration Management

/**
 * Get optimization configuration based on mode
 */
export const getOptimizationConfig = (
  mode: 'conservative' | 'balanced' | 'aggressive' | 'demo' | 'debug_permissive' | 'debug_strict' = 'balanced'
): IAIOptimizationConfig => {
  const baseConfig = { ...aiOptimizationConfig };
  
  switch (mode) {
    case 'conservative':
      // Most permissive - catch all possible horse content
      return {
        ...baseConfig,
        thresholds: {
          ...baseConfig.thresholds,
          imageQuality: {
            ...baseConfig.thresholds.imageQuality,
            minBrightness: 2,        // Almost no brightness filtering
            minContrast: 5,          // Very low contrast requirement
            minSharpness: 8,         // Very low sharpness requirement
            maxNoise: 90             // High noise tolerance
          },
          occupancy: {
            ...baseConfig.thresholds.occupancy,
            minConfidence: 0.05,     // 5% confidence minimum
            minPixelDensity: 0.03,   // 3% pixel density minimum
            edgeDetectionThreshold: 0.05
          },
          motion: {
            ...baseConfig.thresholds.motion,
            minMotionScore: 2,       // Detect minimal motion
            frameDifferenceThreshold: 1,
            motionAreaThreshold: 0.02
          }
        }
      };
      
    case 'aggressive':
      // Most restrictive - maximum token savings
      return {
        ...baseConfig,
        thresholds: {
          ...baseConfig.thresholds,
          imageQuality: {
            ...baseConfig.thresholds.imageQuality,
            minBrightness: 20,       // Higher brightness requirement
            minContrast: 25,         // Higher contrast requirement
            minSharpness: 35,        // Higher sharpness requirement
            maxNoise: 60             // Lower noise tolerance
          },
          occupancy: {
            ...baseConfig.thresholds.occupancy,
            minConfidence: 0.5,      // 50% confidence required
            minPixelDensity: 0.2,    // 20% pixel density required
            edgeDetectionThreshold: 0.3
          },
          motion: {
            ...baseConfig.thresholds.motion,
            minMotionScore: 20,      // Higher motion requirement
            frameDifferenceThreshold: 8,
            motionAreaThreshold: 0.15
          }
        }
      };
      
    case 'debug_permissive':
      // DEBUG: Maximum permissiveness for testing
      return {
        ...baseConfig,
        thresholds: {
          ...baseConfig.thresholds,
          imageQuality: {
            ...baseConfig.thresholds.imageQuality,
            minBrightness: 0,        // No brightness filtering
            minContrast: 0,          // No contrast filtering
            minSharpness: 0,         // No sharpness filtering
            maxNoise: 100            // No noise filtering
          },
          occupancy: {
            ...baseConfig.thresholds.occupancy,
            minConfidence: 0.01,     // 1% confidence minimum
            minPixelDensity: 0.01,   // 1% pixel density minimum
            edgeDetectionThreshold: 0.01
          },
          motion: {
            ...baseConfig.thresholds.motion,
            minMotionScore: 0,       // No motion filtering
            frameDifferenceThreshold: 0,
            motionAreaThreshold: 0.01
          }
        },
        enabledOptimizations: {
          ...baseConfig.enabledOptimizations,
          imageQuality: false,      // Disable quality filtering
          occupancyDetection: false, // Disable occupancy filtering
          motionDetection: false,   // Disable motion filtering
          duplicateDetection: false // Disable duplicate filtering
        }
      };
      
    case 'debug_strict':
      // DEBUG: Maximum strictness for testing
      return {
        ...baseConfig,
        thresholds: {
          ...baseConfig.thresholds,
          imageQuality: {
            ...baseConfig.thresholds.imageQuality,
            minBrightness: 50,       // Very high brightness requirement
            minContrast: 50,         // Very high contrast requirement
            minSharpness: 60,        // Very high sharpness requirement
            maxNoise: 30             // Very low noise tolerance
          },
          occupancy: {
            ...baseConfig.thresholds.occupancy,
            minConfidence: 0.8,      // 80% confidence required
            minPixelDensity: 0.4,    // 40% pixel density required
            edgeDetectionThreshold: 0.5
          },
          motion: {
            ...baseConfig.thresholds.motion,
            minMotionScore: 40,      // Very high motion requirement
            frameDifferenceThreshold: 15,
            motionAreaThreshold: 0.3
          }
        }
      };
      
    case 'demo':
      // Demo mode with moderate settings for presentations
      return {
        ...baseConfig,
        thresholds: {
          ...baseConfig.thresholds,
          imageQuality: {
            ...baseConfig.thresholds.imageQuality,
            minBrightness: 10,
            minContrast: 15,
            minSharpness: 18,
            maxNoise: 75
          }
        },
        logging: {
          ...baseConfig.logging,
          enabled: true,
          level: 'info',
          includeImages: false
        }
      };
      
    case 'balanced':
    default:
      return baseConfig;
  }
};

/**
 * Validate optimization configuration
 */
export const validateOptimizationConfig = (config: IAIOptimizationConfig): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate image quality thresholds
  if (config.thresholds.imageQuality.minBrightness >= config.thresholds.imageQuality.maxBrightness) {
    errors.push('Image quality: minBrightness must be less than maxBrightness');
  }
  
  if (config.thresholds.imageQuality.minContrast > 100 || config.thresholds.imageQuality.minContrast < 0) {
    errors.push('Image quality: minContrast must be between 0 and 100');
  }
  
  // Validate occupancy thresholds
  if (config.thresholds.occupancy.minConfidence > 1 || config.thresholds.occupancy.minConfidence < 0) {
    errors.push('Occupancy: minConfidence must be between 0 and 1');
  }
  
  // Validate motion thresholds
  if (config.thresholds.motion.minMotionScore > 100 || config.thresholds.motion.minMotionScore < 0) {
    errors.push('Motion: minMotionScore must be between 0 and 100');
  }
  
  // Validate time-based thresholds
  const { nightPriorityHours, dayOptimizationHours } = config.thresholds.timeBased;
  if (dayOptimizationHours.start >= dayOptimizationHours.end) {
    warnings.push('Time-based: Active hours span midnight - this is supported but verify intended behavior');
  }
  
  // Performance validation
  if (config.performance.maxConcurrentAnalyses > 10) {
    warnings.push('Performance: High concurrent analysis count may impact system performance');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Calculate estimated token savings based on configuration
 */
export const calculateEstimatedSavings = (
  config: IAIOptimizationConfig,
  dailyImageCount: number = 1000
): {
  dailyTokensSaved: number;
  dailyCostSavings: number;
  monthlyTokensSaved: number;
  monthlyCostSavings: number;
  yearlyTokensSaved: number;
  yearlyCostSavings: number;
} => {
  const { tokenCosts, expectedSavings, totalExpectedSavings } = costEstimation;
  const tokensPerImage = tokenCosts.averageTokensPerImage;
  const costPerToken = tokenCosts.openai_gpt4_vision; // Use OpenAI as baseline
  
  // Determine savings rate based on configuration aggressiveness
  let savingsRate = totalExpectedSavings.balanced;
  if (config.thresholds.global.aggressiveMode) {
    savingsRate = totalExpectedSavings.aggressive;
  } else if (config.thresholds.global.conservativeMode) {
    savingsRate = totalExpectedSavings.conservative;
  }
  
  const dailyTokens = dailyImageCount * tokensPerImage;
  const dailyTokensSaved = dailyTokens * savingsRate;
  const dailyCostSavings = dailyTokensSaved * costPerToken;
  
  return {
    dailyTokensSaved,
    dailyCostSavings,
    monthlyTokensSaved: dailyTokensSaved * 30,
    monthlyCostSavings: dailyCostSavings * 30,
    yearlyTokensSaved: dailyTokensSaved * 365,
    yearlyCostSavings: dailyCostSavings * 365
  };
};

/**
 * Get current optimization mode from configuration
 */
export const getOptimizationMode = (config: IAIOptimizationConfig): string => {
  if (config.thresholds.global.aggressiveMode) return 'aggressive';
  if (config.thresholds.global.conservativeMode) return 'conservative';
  if (config.thresholds.global.debugMode) return 'demo';
  return 'balanced';
};

/**
 * Create custom configuration preset
 */
export const createCustomPreset = (
  basedOn: 'conservative' | 'balanced' | 'aggressive' = 'balanced',
  overrides: Partial<IAIOptimizationConfig> = {}
): IAIOptimizationConfig => {
  const baseConfig = getOptimizationConfig(basedOn);
  
  // Deep merge configurations
  return {
    ...baseConfig,
    ...overrides,
    thresholds: {
      ...baseConfig.thresholds,
      ...overrides.thresholds
    }
  };
};

// Export default configuration
export default aiOptimizationConfig; 