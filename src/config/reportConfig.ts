/**
 * Report Configuration - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER REPORT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This configuration controls ALL aspects of report generation, formatting,
 * and presentation for both concise and detailed analysis reports.
 * 
 * 📊 REPORT CONFIGURATION FEATURES:
 *     - Template-based report generation
 *     - Customizable formatting and styling
 *     - Multi-format export settings
 *     - Branding and presentation options
 *     - Performance and quality settings
 * 
 * 🎨 CUSTOMIZATION OPTIONS:
 *     - Report templates and layouts
 *     - Color schemes and branding
 *     - Content formatting preferences
 *     - Export format configurations
 *     - Language and localization settings
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, follows configuration standards
 */

import { brandConfig } from './brandConfig';
import { aiAnalysisConfig } from './aiAnalysisConfig';

// ============================================================================
// REPORT TEMPLATE CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Report template definitions
 * 
 * Comprehensive template system for consistent report generation
 * across all analysis types and output formats.
 */
export const reportTemplateConfig = {
  // Concise Report Templates
  concise: {
    // Normal status template
    normal: {
      template: 'Analysis shows {overallStatus}. {primaryFinding}. {recommendation}.',
      maxLength: 200,
      includeEmoji: true,
      includeConfidence: true,
      
      // Template variables
      variables: {
        overallStatus: 'status assessment',
        primaryFinding: 'key observation',
        recommendation: 'suggested action',
        confidence: 'confidence level',
        timestamp: 'analysis time'
      },
      
      // Formatting rules
      formatting: {
        capitalizeFirst: true,
        addPeriods: true,
        useActiveVoice: true,
        avoidJargon: true
      }
    },
    
    // Warning status template
    warning: {
      template: '⚠️ Attention needed: {overallStatus}. {primaryFinding}. Recommended: {recommendation}.',
      maxLength: 200,
      includeEmoji: true,
      includeConfidence: true,
      
      variables: {
        overallStatus: 'concerning condition',
        primaryFinding: 'warning indicator',
        recommendation: 'corrective action',
        confidence: 'certainty level',
        timestamp: 'detection time'
      },
      
      formatting: {
        capitalizeFirst: true,
        addPeriods: true,
        emphasizeUrgency: true,
        useDirectLanguage: true
      }
    },
    
    // Critical status template
    critical: {
      template: '🚨 Critical: {overallStatus}. {primaryFinding}. Immediate action required: {recommendation}.',
      maxLength: 200,
      includeEmoji: true,
      includeConfidence: true,
      
      variables: {
        overallStatus: 'critical condition',
        primaryFinding: 'urgent concern',
        recommendation: 'emergency action',
        confidence: 'alert certainty',
        timestamp: 'alert time'
      },
      
      formatting: {
        capitalizeFirst: true,
        addPeriods: true,
        emphasizeUrgency: true,
        useImperativeLanguage: true
      }
    },
    
    // Emergency status template
    emergency: {
      template: '🆘 EMERGENCY: {overallStatus}. {primaryFinding}. Call for immediate assistance: {recommendation}.',
      maxLength: 200,
      includeEmoji: true,
      includeConfidence: true,
      
      variables: {
        overallStatus: 'emergency situation',
        primaryFinding: 'critical alert',
        recommendation: 'emergency response',
        confidence: 'emergency certainty',
        timestamp: 'emergency time'
      },
      
      formatting: {
        capitalizeFirst: true,
        addPeriods: true,
        useAllCaps: true,
        emphasizeUrgency: true
      }
    }
  },
  
  // Detailed Report Templates
  detailed: {
    // Standard detailed report template
    standard: {
      sections: {
        executiveSummary: {
          title: 'Executive Summary',
          template: `
            **Overall Status:** {overallStatus}
            **Risk Level:** {riskLevel}
            **Confidence:** {confidence}%
            **Analysis Time:** {timestamp}
            
            **Key Findings:**
            {keyFindings}
            
            **Recommended Actions:**
            {recommendations}
          `,
          required: true,
          order: 1
        },
        
        detailedAnalysis: {
          title: 'Detailed Analysis',
          template: `
            **Observations:**
            {observations}
            
            **Behavior Patterns:**
            {behaviorPatterns}
            
            **Health Indicators:**
            {healthIndicators}
            
            **Environmental Factors:**
            {environmentalFactors}
          `,
          required: true,
          order: 2
        },
        
        trends: {
          title: 'Trends and Patterns',
          template: `
            **Historical Comparison:**
            {historicalComparison}
            
            **Long-term Trends:**
            {longTermTrends}
            
            **Anomalies Detected:**
            {anomalies}
          `,
          required: false,
          order: 3
        },
        
        recommendations: {
          title: 'Recommendations',
          template: `
            **Immediate Actions:**
            {immediateActions}
            
            **Monitoring Recommendations:**
            {monitoringRecommendations}
            
            **Follow-up Actions:**
            {followUpActions}
          `,
          required: true,
          order: 4
        },
        
        technicalDetails: {
          title: 'Technical Details',
          template: `
            **Processing Metrics:**
            - Analysis Time: {processingTime}ms
            - Confidence Score: {confidenceScore}
            - Data Quality: {dataQuality}
            
            **System Information:**
            - Model Version: {modelVersion}
            - Analysis Method: {analysisMethod}
            - Photos Processed: {photoCount}
          `,
          required: false,
          order: 5
        }
      },
      
      // Formatting options
      formatting: {
        useMarkdown: true,
        includeTimestamps: true,
        includeConfidenceScores: true,
        includeMetadata: true,
        sectionSeparator: '\n\n---\n\n',
        bulletStyle: '-',
        numberStyle: '1.'
      }
    },
    
    // Comprehensive detailed report template
    comprehensive: {
      sections: {
        coverPage: {
          title: 'Analysis Report',
          template: `
            # AI Analysis Report
            
            **Generated:** {timestamp}
            **Analysis ID:** {analysisId}
            **Report Type:** Comprehensive Analysis
            **Confidence Level:** {confidence}%
            
            ---
          `,
          required: true,
          order: 0
        },
        
        executiveSummary: {
          title: 'Executive Summary',
          template: `
            ## Executive Summary
            
            **Overall Assessment:** {overallStatus}
            **Risk Classification:** {riskLevel}
            **Confidence Rating:** {confidence}% (±{confidenceRange}%)
            **Analysis Timestamp:** {timestamp}
            **Data Sources:** {photoCount} photos analyzed
            
            ### Key Findings
            {keyFindings}
            
            ### Primary Recommendations
            {primaryRecommendations}
            
            ### Risk Factors
            {riskFactors}
          `,
          required: true,
          order: 1
        },
        
        detailedFindings: {
          title: 'Detailed Findings',
          template: `
            ## Detailed Analysis Results
            
            ### Behavioral Observations
            {behaviorPatterns}
            
            ### Health Assessment
            {healthIndicators}
            
            ### Environmental Evaluation
            {environmentalFactors}
            
            ### Temporal Analysis
            {temporalAnalysis}
          `,
          required: true,
          order: 2
        },
        
        historicalContext: {
          title: 'Historical Context',
          template: `
            ## Historical Analysis
            
            ### Comparison to Previous Analyses
            {historicalComparison}
            
            ### Trend Analysis
            {trendAnalysis}
            
            ### Pattern Recognition
            {patternRecognition}
            
            ### Anomaly Detection
            {anomalyDetection}
          `,
          required: false,
          order: 3
        },
        
        recommendations: {
          title: 'Recommendations',
          template: `
            ## Detailed Recommendations
            
            ### Immediate Actions (0-4 hours)
            {immediateActions}
            
            ### Short-term Actions (4-24 hours)
            {shortTermActions}
            
            ### Long-term Monitoring (1-7 days)
            {longTermActions}
            
            ### Preventive Measures
            {preventiveMeasures}
          `,
          required: true,
          order: 4
        },
        
        technicalAppendix: {
          title: 'Technical Appendix',
          template: `
            ## Technical Information
            
            ### Processing Details
            - **Model:** {modelVersion}
            - **Analysis Method:** {analysisMethod}
            - **Processing Time:** {processingTime}ms
            - **Memory Usage:** {memoryUsage}MB
            
            ### Data Quality Assessment
            - **Photo Quality:** {photoQuality}/10
            - **Data Completeness:** {dataCompleteness}%
            - **Analysis Reliability:** {reliabilityScore}%
            
            ### Limitations
            {limitations}
            
            ### Methodology Notes
            {methodologyNotes}
          `,
          required: false,
          order: 5
        }
      },
      
      formatting: {
        useMarkdown: true,
        includeTableOfContents: true,
        includePageNumbers: true,
        includeFooters: true,
        sectionSeparator: '\n\n---\n\n',
        headerStyle: 'setext'
      }
    }
  },
  
  // Export Templates
  export: {
    // JSON export template
    json: {
      structure: {
        metadata: {
          reportId: '{reportId}',
          generatedAt: '{timestamp}',
          analysisId: '{analysisId}',
          format: 'json',
          version: '2.0.0'
        },
        summary: {
          overallStatus: '{overallStatus}',
          alertLevel: '{alertLevel}',
          confidence: '{confidence}',
          keyFindings: '{keyFindings}',
          recommendations: '{recommendations}'
        },
        detailed: {
          observations: '{observations}',
          behaviorPatterns: '{behaviorPatterns}',
          healthIndicators: '{healthIndicators}',
          environmentalFactors: '{environmentalFactors}',
          trends: '{trends}'
        },
        technical: {
          processingMetrics: '{processingMetrics}',
          qualityAssessment: '{qualityAssessment}',
          limitations: '{limitations}'
        }
      },
      formatting: {
        indent: 2,
        includeNulls: false,
        sortKeys: true,
        prettyPrint: true
      }
    },
    
    // CSV export template
    csv: {
      headers: [
        'timestamp',
        'report_id',
        'analysis_id',
        'alert_level',
        'confidence',
        'overall_status',
        'primary_finding',
        'recommendation',
        'processing_time',
        'photo_count'
      ],
      formatting: {
        delimiter: ',',
        quoteChar: '"',
        escapeChar: '\\',
        includeHeaders: true,
        dateFormat: 'ISO'
      }
    },
    
    // PDF export template
    pdf: {
      layout: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: {
          top: '25mm',
          right: '20mm',
          bottom: '25mm',
          left: '20mm'
        }
      },
      
      styling: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12pt',
        lineHeight: 1.5,
        headerFontSize: '16pt',
        subheaderFontSize: '14pt'
      },
      
      structure: {
        includeHeader: true,
        includeFooter: true,
        includePageNumbers: true,
        includeTableOfContents: true,
        headerText: 'AI Analysis Report - {timestamp}',
        footerText: 'Generated by One Barn AI System'
      }
    }
  }
};

// ============================================================================
// REPORT FORMATTING CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Report formatting and styling settings
 * 
 * Controls how reports are formatted, styled, and presented
 * for optimal readability and professional appearance.
 */
export const reportFormattingConfig = {
  // Color scheme for different alert levels
  colorScheme: {
    normal: {
      primary: brandConfig.colors.success,
      secondary: brandConfig.colors.successLight,
      background: brandConfig.colors.successBackground,
      text: brandConfig.colors.text,
      border: brandConfig.colors.successBorder
    },
    
    warning: {
      primary: brandConfig.colors.warning,
      secondary: brandConfig.colors.warningLight,
      background: brandConfig.colors.warningBackground,
      text: brandConfig.colors.text,
      border: brandConfig.colors.warningBorder
    },
    
    critical: {
      primary: brandConfig.colors.error,
      secondary: brandConfig.colors.errorLight,
      background: brandConfig.colors.errorBackground,
      text: brandConfig.colors.text,
      border: brandConfig.colors.errorBorder
    },
    
    emergency: {
      primary: brandConfig.colors.error,
      secondary: brandConfig.colors.errorLight,
      background: brandConfig.colors.errorBackground,
      text: brandConfig.colors.textInverse,
      border: brandConfig.colors.errorBorder
    }
  },
  
  // Typography settings
  typography: {
    // Font families
    fonts: {
      primary: brandConfig.typography.fontPrimary,
      secondary: brandConfig.typography.fontSecondary,
      monospace: brandConfig.typography.fontMonospace
    },
    
    // Font sizes
    sizes: {
      title: brandConfig.typography.fontSize3xl,
      heading: brandConfig.typography.fontSize2xl,
      subheading: brandConfig.typography.fontSizeXl,
      body: brandConfig.typography.fontSizeBase,
      caption: brandConfig.typography.fontSizeSm,
      small: brandConfig.typography.fontSizeXs
    },
    
    // Font weights
    weights: {
      light: brandConfig.typography.weightLight,
      normal: brandConfig.typography.weightNormal,
      medium: brandConfig.typography.weightMedium,
      semibold: brandConfig.typography.weightSemibold,
      bold: brandConfig.typography.weightBold
    },
    
    // Line heights
    lineHeights: {
      tight: brandConfig.typography.lineHeightTight,
      normal: brandConfig.typography.lineHeightNormal,
      relaxed: brandConfig.typography.lineHeightRelaxed
    }
  },
  
  // Layout settings
  layout: {
    // Spacing
    spacing: {
      xs: brandConfig.spacing.xs,
      sm: brandConfig.spacing.sm,
      md: brandConfig.spacing.md,
      lg: brandConfig.spacing.lg,
      xl: brandConfig.spacing.xl,
      xxl: brandConfig.spacing.xxl
    },
    
    // Container widths
    containers: {
      narrow: '600px',
      normal: '800px',
      wide: '1000px',
      full: '100%'
    },
    
    // Border radius
    borderRadius: {
      sm: brandConfig.layout.borderRadiusSm,
      md: brandConfig.layout.borderRadius,
      lg: brandConfig.layout.borderRadiusLg
    }
  },
  
  // Icon configuration
  icons: {
    alertLevels: {
      normal: '✅',
      warning: '⚠️',
      critical: '🚨',
      emergency: '🆘'
    },
    
    categories: {
      behavior: '🐴',
      health: '🏥',
      environment: '🌡️',
      trend: '📈',
      recommendation: '💡',
      technical: '⚙️'
    },
    
    actions: {
      immediate: '⚡',
      shortTerm: '📅',
      longTerm: '📊',
      preventive: '🛡️'
    }
  },
  
  // Formatting rules
  formatting: {
    // Text formatting
    text: {
      maxLineLength: 120,
      paragraphSpacing: 1.5,
      listItemSpacing: 1.2,
      indentSize: 2,
      tabSize: 4
    },
    
    // Number formatting
    numbers: {
      decimalPlaces: 2,
      percentagePrecision: 1,
      currencyPrecision: 2,
      thousandsSeparator: ',',
      decimalSeparator: '.'
    },
    
    // Date/time formatting
    datetime: {
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss',
      datetimeFormat: 'YYYY-MM-DD HH:mm:ss',
      timezoneFormat: 'Z',
      relativeTimeThreshold: 24 * 60 * 60 * 1000 // 24 hours
    }
  }
};

// ============================================================================
// REPORT CONTENT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Report content configuration
 * 
 * Defines what content is included in different types of reports
 * and how it should be structured and presented.
 */
export const reportContentConfig = {
  // Content inclusion rules
  inclusion: {
    concise: {
      maxSections: 3,
      maxBulletPoints: 3,
      maxRecommendations: 1,
      includeConfidence: true,
      includeTimestamp: true,
      includeAlertLevel: true,
      includeKeyFindings: true,
      includeRecommendations: true,
      includeMetadata: false
    },
    
    detailed: {
      maxSections: 8,
      maxBulletPoints: 10,
      maxRecommendations: 5,
      includeConfidence: true,
      includeTimestamp: true,
      includeAlertLevel: true,
      includeKeyFindings: true,
      includeRecommendations: true,
      includeMetadata: true,
      includeTechnicalDetails: true,
      includeHistoricalData: true,
      includeTrendAnalysis: true
    },
    
    export: {
      includeAllSections: true,
      includeRawData: false,
      includeImages: false,
      includeCharts: false,
      includeTechnicalDetails: true,
      includeMetadata: true
    }
  },
  
  // Content prioritization
  priority: {
    // High priority content (always included)
    high: [
      'overallStatus',
      'alertLevel',
      'confidence',
      'keyFindings',
      'immediateRecommendations'
    ],
    
    // Medium priority content (included if space allows)
    medium: [
      'behaviorPatterns',
      'healthIndicators',
      'environmentalFactors',
      'trends',
      'historicalComparison'
    ],
    
    // Low priority content (included only in detailed reports)
    low: [
      'technicalDetails',
      'processingMetrics',
      'rawData',
      'methodologyNotes',
      'limitations'
    ]
  },
  
  // Content validation rules
  validation: {
    required: {
      concise: ['summary', 'alertLevel', 'confidence'],
      detailed: ['executiveSummary', 'detailedAnalysis', 'recommendations']
    },
    
    optional: {
      concise: ['keyFindings', 'nextAction', 'timestamp'],
      detailed: ['trends', 'historicalComparison', 'technicalDetails']
    },
    
    constraints: {
      summaryMinLength: 10,
      summaryMaxLength: 500,
      recommendationMinLength: 5,
      recommendationMaxLength: 200,
      keyFindingMaxCount: 5,
      recommendationMaxCount: 3
    }
  }
};

// ============================================================================
// REPORT QUALITY CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Report quality and validation settings
 * 
 * Defines quality standards, validation rules, and improvement
 * suggestions for generated reports.
 */
export const reportQualityConfig = {
  // Quality metrics
  metrics: {
    // Completeness scoring
    completeness: {
      weights: {
        hasExecutiveSummary: 0.3,
        hasKeyFindings: 0.25,
        hasRecommendations: 0.25,
        hasConfidenceScore: 0.1,
        hasTimestamp: 0.1
      },
      
      minimumScore: 0.7,
      targetScore: 0.9
    },
    
    // Accuracy scoring
    accuracy: {
      weights: {
        confidenceScore: 0.4,
        dataQuality: 0.3,
        analysisDepth: 0.2,
        validationSuccess: 0.1
      },
      
      minimumScore: 0.6,
      targetScore: 0.8
    },
    
    // Readability scoring
    readability: {
      weights: {
        sentenceLength: 0.3,
        vocabularyComplexity: 0.25,
        structureClarity: 0.25,
        formattingConsistency: 0.2
      },
      
      minimumScore: 0.7,
      targetScore: 0.85
    },
    
    // Usefulness scoring
    usefulness: {
      weights: {
        actionableRecommendations: 0.4,
        relevantFindings: 0.3,
        contextualInformation: 0.2,
        clarityOfNextSteps: 0.1
      },
      
      minimumScore: 0.6,
      targetScore: 0.8
    }
  },
  
  // Validation rules
  validation: {
    // Content validation
    content: {
      checkSpelling: true,
      checkGrammar: true,
      checkFactualConsistency: true,
      checkLogicalFlow: true,
      checkCompleteness: true
    },
    
    // Format validation
    format: {
      checkStructure: true,
      checkSectioning: true,
      checkFormatting: true,
      checkLinks: true,
      checkImages: false
    },
    
    // Technical validation
    technical: {
      checkDataIntegrity: true,
      checkCalculations: true,
      checkReferences: true,
      checkMetadata: true,
      checkTimestamps: true
    }
  },
  
  // Improvement suggestions
  improvement: {
    // Automatic improvements
    automatic: {
      fixTypos: true,
      fixFormatting: true,
      optimizeStructure: true,
      enhanceReadability: true,
      standardizeTerminology: true
    },
    
    // Suggested improvements
    suggestions: {
      addMissingContext: true,
      improveClarity: true,
      enhanceActionability: true,
      addVisualElements: false,
      includeExamples: true
    }
  }
};

// ============================================================================
// PERFORMANCE CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Report generation performance settings
 * 
 * Configuration for optimizing report generation performance
 * while maintaining quality and reliability.
 */
export const reportPerformanceConfig = {
  // Generation timeouts
  timeouts: {
    conciseReport: 5000,    // 5 seconds
    detailedReport: 15000,  // 15 seconds
    trendReport: 20000,     // 20 seconds
    exportGeneration: 30000 // 30 seconds
  },
  
  // Caching settings
  caching: {
    enableCaching: true,
    cacheSize: 100,
    cacheTTL: 3600000, // 1 hour
    cacheCompression: true,
    
    // Cache strategies
    strategies: {
      reportTemplate: 'memory',
      generatedReport: 'memory',
      exportData: 'disk'
    }
  },
  
  // Optimization settings
  optimization: {
    enableParallelProcessing: true,
    maxConcurrentReports: 3,
    enableStreamingGeneration: false,
    enableProgressiveLoading: true,
    
    // Memory management
    memoryManagement: {
      enableGarbageCollection: true,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      memoryCleanupInterval: 60000 // 1 minute
    }
  },
  
  // Monitoring settings
  monitoring: {
    enablePerformanceTracking: true,
    trackGenerationTimes: true,
    trackMemoryUsage: true,
    trackCacheEfficiency: true,
    
    // Performance alerts
    alerts: {
      slowGenerationThreshold: 10000, // 10 seconds
      highMemoryUsageThreshold: 0.8,  // 80%
      lowCacheHitRateThreshold: 0.6   // 60%
    }
  }
};

// ============================================================================
// MAIN REPORT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete report configuration
 * 
 * This is the main configuration object that combines all report settings.
 * Import this in components that need report configuration:
 * 
 * ```typescript
 * import { reportConfig } from '../config/reportConfig';
 * 
 * // Get concise report template
 * const template = reportConfig.templates.concise.normal;
 * 
 * // Get alert color
 * const color = reportConfig.formatting.colorScheme.warning.primary;
 * ```
 */
export const reportConfig = {
  // Core configuration sections
  templates: reportTemplateConfig,
  formatting: reportFormattingConfig,
  content: reportContentConfig,
  quality: reportQualityConfig,
  performance: reportPerformanceConfig,
  
  // Configuration metadata
  version: '2.0.0',
  lastUpdated: '2025-01-15',
  
  // 💼 BUSINESS PARTNER: Quick access methods
  getTemplate: (type: string, subtype: string = 'normal'): any => {
    return reportTemplateConfig[type]?.[subtype];
  },
  
  getColorScheme: (alertLevel: string): any => {
    return reportFormattingConfig.colorScheme[alertLevel] || 
           reportFormattingConfig.colorScheme.normal;
  },
  
  getIcon: (category: string): string => {
    return reportFormattingConfig.icons.categories[category] || 
           reportFormattingConfig.icons.categories.technical;
  },
  
  getAlertIcon: (alertLevel: string): string => {
    return reportFormattingConfig.icons.alertLevels[alertLevel] || 'ℹ️';
  },
  
  getTimeout: (reportType: string): number => {
    return reportPerformanceConfig.timeouts[reportType] || 15000;
  },
  
  getQualityThreshold: (metric: string): number => {
    return reportQualityConfig.metrics[metric]?.minimumScore || 0.7;
  },
  
  shouldIncludeSection: (reportType: string, section: string): boolean => {
    const config = reportContentConfig.inclusion[reportType];
    return config ? config[section] !== false : true;
  }
};

// ============================================================================
// HELPER FUNCTIONS FOR BUSINESS PARTNERS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Get report configuration for specific type
 */
export const getReportConfiguration = (
  reportType: 'concise' | 'detailed' | 'export',
  alertLevel: string = 'normal'
): any => {
  return {
    template: reportConfig.getTemplate(reportType, alertLevel),
    colorScheme: reportConfig.getColorScheme(alertLevel),
    formatting: reportConfig.formatting,
    content: reportConfig.content.inclusion[reportType],
    quality: reportConfig.quality.metrics,
    performance: reportConfig.performance
  };
};

/**
 * 💼 BUSINESS PARTNER: Validate report configuration
 */
export const validateReportConfiguration = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate templates
  if (!reportConfig.templates.concise.normal) {
    errors.push('Missing normal concise report template');
  }
  
  // Validate color schemes
  if (!reportConfig.formatting.colorScheme.normal) {
    errors.push('Missing normal color scheme');
  }
  
  // Validate timeouts
  if (reportConfig.performance.timeouts.conciseReport <= 0) {
    errors.push('Invalid concise report timeout');
  }
  
  // Validate quality thresholds
  if (reportConfig.quality.metrics.completeness.minimumScore < 0 || 
      reportConfig.quality.metrics.completeness.minimumScore > 1) {
    errors.push('Invalid completeness minimum score');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 💼 BUSINESS PARTNER: Get report configuration summary
 */
export const getReportConfigurationSummary = () => {
  return {
    templates: {
      concise: Object.keys(reportConfig.templates.concise).length,
      detailed: Object.keys(reportConfig.templates.detailed).length,
      export: Object.keys(reportConfig.templates.export).length
    },
    colorSchemes: Object.keys(reportConfig.formatting.colorScheme).length,
    qualityMetrics: Object.keys(reportConfig.quality.metrics).length,
    performanceSettings: Object.keys(reportConfig.performance).length,
    version: reportConfig.version,
    cachingEnabled: reportConfig.performance.caching.enableCaching,
    optimizationEnabled: reportConfig.performance.optimization.enableParallelProcessing
  };
};

export default reportConfig; 