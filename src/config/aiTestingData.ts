/**
 * 🧪 AI Testing Tool Configuration
 * Configuration data for the Single-Image AI Filter Testing Tool
 * Follows brandConfig.ts patterns for consistency
 */

export const aiTestingData = {
  // 🎯 Page Content
  page: {
    title: 'Single Image AI Filter Analyzer',
    subtitle: 'Calibrate and validate AI optimization thresholds with surgical precision',
    description: 'Test individual barn surveillance images against optimization filters to fine-tune threshold settings.',
  },

  // 📸 Image Upload Section
  imageUpload: {
    title: 'Image Upload',
    instructions: {
      primary: 'Drop image here or click to browse',
      secondary: 'Supports JPG, PNG, WEBP formats up to 50MB',
      dragActive: 'Drop the image to analyze',
    },
    preview: {
      title: 'Image Preview',
      loadingText: 'Processing image...',
      errorText: 'Failed to load image',
      noImageText: 'No image selected',
    },
  },

  // ⚙️ Threshold Controls Section
  thresholdControls: {
    title: 'Threshold Controls',
    subtitle: 'Adjust optimization thresholds in real-time',
    sliders: {
      imageQuality: {
        label: 'Image Quality Threshold',
        description: 'Minimum quality score required (0-100)',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
      },
      occupancy: {
        label: 'Occupancy Confidence',
        description: 'Confidence required for occupancy detection (0-100)',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
      },
      motion: {
        label: 'Motion Detection',
        description: 'Minimum motion score required (0-100)',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
      },
      duplicate: {
        label: 'Duplicate Similarity',
        description: 'Maximum similarity before marking as duplicate (0-100)',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    presets: {
      title: 'Quick Presets',
      options: [
        { key: 'conservative', label: 'Conservative', description: 'Process more images, fewer savings' },
        { key: 'balanced', label: 'Balanced', description: 'Optimal balance of coverage and savings' },
        { key: 'aggressive', label: 'Aggressive', description: 'Maximum savings, stricter filtering' },
      ],
    },
    actions: {
      reset: 'Reset to Defaults',
      save: 'Save Configuration',
      export: 'Export Settings',
      import: 'Import Settings',
    },
  },

  // 📊 Filter Results Section
  filterResults: {
    title: 'Filter Results',
    subtitle: 'Individual filter assessment breakdown',
    filters: {
      imageQuality: {
        label: 'Image Quality',
        description: 'Overall image quality assessment',
        passText: 'Quality sufficient',
        failText: 'Quality insufficient',
      },
      occupancy: {
        label: 'Occupancy Detection',
        description: 'Presence of horses or activity',
        passText: 'Occupancy detected',
        failText: 'No occupancy detected',
      },
      motion: {
        label: 'Motion Analysis',
        description: 'Movement or activity detected',
        passText: 'Motion detected',
        failText: 'No significant motion',
      },
      duplicate: {
        label: 'Duplicate Check',
        description: 'Similarity to recent images',
        passText: 'Unique image',
        failText: 'Similar to recent image',
      },
      timeFilter: {
        label: 'Time-based Filter',
        description: 'Schedule-based processing rules',
        passText: 'Active time period',
        failText: 'Inactive time period',
      },
    },
    processingTime: {
      label: 'Processing Time',
      unit: 'ms',
    },
    decision: {
      proceedLabel: 'PROCEED',
      skipLabel: 'SKIP',
      proceedDescription: 'Image will be sent for AI analysis',
      skipDescription: 'Image will be skipped to save tokens',
    },
  },

  // 💡 Recommendations Section
  recommendations: {
    title: 'Smart Recommendations',
    subtitle: 'AI-powered threshold optimization suggestions',
    categories: {
      quality: {
        title: 'Quality Optimization',
        suggestions: [
          'Lower quality threshold to 25% for night vision cameras',
          'Increase quality threshold to 35% for high-resolution cameras',
          'Consider brightness adjustments for outdoor cameras',
        ],
      },
      occupancy: {
        title: 'Occupancy Tuning',
        suggestions: [
          'Reduce confidence to 30% to catch sleeping horses',
          'Increase confidence to 50% to reduce false positives',
          'Check camera angle for optimal occupancy detection',
        ],
      },
      motion: {
        title: 'Motion Sensitivity',
        suggestions: [
          'Lower motion threshold to 10% for subtle movements',
          'Increase motion threshold to 25% during feeding times',
          'Consider time-based motion sensitivity adjustments',
        ],
      },
      duplicate: {
        title: 'Duplicate Prevention',
        suggestions: [
          'Reduce similarity threshold to 75% for more aggressive filtering',
          'Increase similarity threshold to 95% for unique moments',
          'Consider shorter cache duration during active periods',
        ],
      },
    },
    actions: {
      applyRecommendation: 'Apply',
      dismissRecommendation: 'Dismiss',
      learnMore: 'Learn More',
    },
  },

  // 🎯 Final Decision Panel
  finalDecision: {
    title: 'Final Decision',
    proceed: {
      title: 'PROCEED with AI Analysis',
      description: 'This image passes all optimization filters',
      icon: 'check_circle',
      tokenUsage: 'Estimated tokens: ~1,200',
      cost: 'Estimated cost: $0.024',
    },
    skip: {
      title: 'SKIP Analysis',
      description: 'This image will be filtered out',
      icon: 'cancel',
      tokensSaved: 'Tokens saved: ~1,200',
      costSaved: 'Cost saved: $0.024',
    },
    summary: {
      confidence: 'Decision Confidence',
      processingTime: 'Total Processing Time',
      recommendations: 'Active Recommendations',
    },
  },

  // 🔧 Debug Information (only in development)
  debug: {
    title: 'Debug Information',
    sections: {
      rawResults: 'Raw Filter Results',
      configSnapshot: 'Current Configuration',
      processingLog: 'Processing Log',
      performanceMetrics: 'Performance Metrics',
    },
  },

  // 📱 Mobile Adaptations
  mobile: {
    imageUpload: {
      instructions: 'Tap to select image',
      cameraOption: 'Take Photo',
      galleryOption: 'Choose from Gallery',
    },
    thresholds: {
      expandLabel: 'Show Threshold Controls',
      collapseLabel: 'Hide Threshold Controls',
    },
    results: {
      expandLabel: 'Show Detailed Results',
      collapseLabel: 'Hide Details',
    },
  },

  // 🎨 UI States
  states: {
    loading: {
      title: 'Analyzing Image...',
      description: 'Running optimization filters',
      steps: [
        'Assessing image quality',
        'Detecting occupancy',
        'Analyzing motion',
        'Checking for duplicates',
        'Applying time filters',
      ],
    },
    error: {
      title: 'Analysis Failed',
      description: 'Unable to process the selected image',
      actions: {
        retry: 'Retry Analysis',
        selectNew: 'Select Different Image',
        reset: 'Reset Tool',
      },
    },
    success: {
      title: 'Analysis Complete',
      description: 'Image successfully processed through all filters',
    },
  },

  // 🏷️ Tooltips and Help Text
  tooltips: {
    imageQuality: 'Evaluates brightness, contrast, sharpness, and noise levels',
    occupancy: 'Detects presence of horses, humans, or significant activity',
    motion: 'Compares with previous frames to detect movement',
    duplicate: 'Prevents processing of similar or identical images',
    timeFilter: 'Applies schedule-based processing rules',
    processingTime: 'Total time to run all optimization filters',
    tokenSavings: 'Estimated AI tokens saved by skipping this image',
    costSavings: 'Estimated cost savings from token optimization',
    confidence: 'AI confidence level in the optimization decision',
  },

  // 📈 Performance Targets
  performance: {
    processingTimeTarget: 100, // milliseconds
    processingTimeWarning: 250, // milliseconds
    processingTimeError: 500, // milliseconds
    imageSize: {
      recommended: 1280, // pixels width
      maximum: 4096, // pixels width
    },
  },
}; 