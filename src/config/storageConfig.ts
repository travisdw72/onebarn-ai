/**
 * Storage Configuration - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER STORAGE SETTINGS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This configuration file controls ALL aspects of data storage for the
 * AI monitoring system. Customize these settings to match your requirements.
 * 
 * 🔒 DEMO RESTRICTION: Storage features only available to demo@onevault.ai
 * 📦 STORAGE LIMITS: Automatic management to prevent browser overflow
 * 🗑️ CLEANUP POLICY: Intelligent data retention and cleanup schedules
 * 📊 MONITORING: Real-time storage usage tracking and alerts
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Follows configuration-driven architecture standards
 */

import { brandConfig } from './brandConfig';

// ============================================================================
// DEMO ACCOUNT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Demo account restrictions and access control
 * 
 * IMPORTANT: ALL storage features are restricted to the demo account only.
 * This ensures no impact on existing production users while enabling
 * comprehensive testing and demonstration capabilities.
 */
export const demoAccountConfig = {
  // 🔐 DEMO ACCESS CONTROL
  enabledEmail: 'demo@onevault.ai',          // Only this email can use storage features
  alternateEmails: [                         // Additional demo emails if needed
    'demo@onebarn.ai',
    'business-partner@onevault.ai'
  ],
  
  // 🎯 FEATURE FLAGS FOR DEMO
  features: {
    enableAIAnalysisStorage: true,           // Enable analysis report storage
    enablePhotoStorage: true,                // Enable photo capture storage
    enableDataExport: true,                  // Enable data export capabilities
    enableAdvancedReporting: true,           // Enable full analysis reports
    enableScheduledCapture: true,            // Enable automated photo capture
    enableDataCleanup: true,                 // Enable automatic data cleanup
    enableStorageMonitoring: true,           // Enable storage usage monitoring
  },
  
  // 🚫 DEMO LIMITATIONS
  limitations: {
    maxReportsPerDay: 1000,                  // Maximum reports that can be generated per day
    maxPhotosPerDay: 2000,                   // Maximum photos that can be captured per day
    maxStorageDurationDays: 90,              // Maximum time to keep data (90 days for demos)
    maxConcurrentAnalysis: 5,                // Maximum simultaneous AI analyses
  },
  
  // 🎪 DEMO MODE INDICATORS
  ui: {
    showDemoWatermark: true,                 // Show "DEMO MODE" indicator
    displayUsageStats: true,                 // Show storage usage to business partners
    enableReset: true,                       // Allow complete data reset for demos
    showAdvancedControls: true,              // Show all management controls
  }
};

// ============================================================================
// STORAGE LIMITS AND QUOTAS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Storage limits and quota management
 * 
 * These settings prevent storage overflow and ensure optimal performance.
 * Browser storage has limits, so we manage usage intelligently.
 */
export const storageQuotaConfig = {
  // 📊 STORAGE LIMITS
  limits: {
    maxTotalStorage: 50 * 1024 * 1024,       // 50MB total storage limit
    maxReportStorage: 30 * 1024 * 1024,      // 30MB for analysis reports
    maxPhotoStorage: 15 * 1024 * 1024,       // 15MB for captured photos
    maxSystemStorage: 5 * 1024 * 1024,       // 5MB for system data and indices
  },
  
  // ⚠️ WARNING THRESHOLDS
  warnings: {
    storageWarningThreshold: 0.8,            // Warn at 80% usage
    storageCriticalThreshold: 0.95,          // Critical alert at 95% usage
    reportsWarningCount: 800,                // Warn when approaching max reports
    photosWarningCount: 1500,                // Warn when approaching max photos
  },
  
  // 🔄 AUTOMATIC MANAGEMENT
  autoManagement: {
    enableAutoCleanup: true,                 // Automatically clean old data
    cleanupFrequencyHours: 24,               // Check for cleanup every 24 hours
    enableCompression: true,                 // Automatically compress large data
    compressionThreshold: 10 * 1024,         // Compress data larger than 10KB
    enableQuotaEnforcement: true,            // Enforce storage quotas strictly
  }
};

// ============================================================================
// DATA RETENTION AND CLEANUP POLICIES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Data retention and automatic cleanup
 * 
 * These policies ensure data doesn't accumulate indefinitely while
 * preserving important information for business partner analysis.
 */
export const dataRetentionConfig = {
  // 🗓️ RETENTION PERIODS
  retentionPeriods: {
    analysisReports: {
      criticalAlerts: 90,                    // Keep critical alerts for 90 days
      warningAlerts: 60,                     // Keep warnings for 60 days
      normalReports: 30,                     // Keep normal reports for 30 days
      rawData: 7,                            // Keep raw AI data for 7 days only
    },
    
    capturedPhotos: {
      associatedWithAlerts: 90,              // Keep photos with alerts longer
      routineCaptures: 30,                   // Keep routine photos for 30 days
      highQualityPhotos: 60,                 // Keep high-quality photos longer
      lowQualityPhotos: 14,                  // Clean low-quality photos sooner
    },
    
    systemData: {
      usageStatistics: 365,                  // Keep usage stats for 1 year
      errorLogs: 30,                         // Keep error logs for 30 days
      performanceMetrics: 90,                // Keep performance data for 90 days
    }
  },
  
  // 🎯 CLEANUP STRATEGIES
  cleanupStrategies: {
    prioritizeByImportance: true,            // Keep important data longer
    preserveRecentTrends: true,              // Maintain recent trend data
    compressBeforeDelete: true,              // Compress old data before deletion
    gradualCleanup: true,                    // Clean data gradually, not all at once
  },
  
  // 🔄 CLEANUP SCHEDULE
  cleanupSchedule: {
    dailyMaintenance: {
      enabled: true,
      runTime: '02:00',                      // Run at 2 AM daily
      maxItems: 100,                         // Clean max 100 items per run
    },
    
    weeklyDeepClean: {
      enabled: true,
      runDay: 'sunday',                      // Run deep clean on Sundays
      runTime: '03:00',                      // Run at 3 AM
      compressionReview: true,               // Review compression effectiveness
    }
  }
};

// ============================================================================
// PHOTO STORAGE CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Photo capture and storage settings
 * 
 * Configuration for storing captured photos with optimal compression
 * and quality management for AI analysis requirements.
 */
export const photoStorageConfig = {
  // 📸 PHOTO SETTINGS
  capture: {
    defaultFormat: 'jpeg',                   // Default photo format
    defaultQuality: 0.8,                     // JPEG quality (0.1 to 1.0)
    maxResolution: {
      width: 1280,                           // Maximum width in pixels
      height: 720                            // Maximum height in pixels
    },
    minResolution: {
      width: 640,                            // Minimum width for analysis
      height: 480                            // Minimum height for analysis
    }
  },
  
  // 🗜️ COMPRESSION SETTINGS
  compression: {
    enableAutoCompression: true,             // Automatically compress large photos
    compressionThreshold: 200 * 1024,        // Compress photos larger than 200KB
    maxCompressedSize: 100 * 1024,          // Target compressed size (100KB)
    preserveMetadata: true,                  // Keep important metadata
    qualityLevels: {
      high: 0.9,                            // High quality compression
      medium: 0.7,                          // Medium quality compression
      low: 0.5                              // Low quality compression (for old photos)
    }
  },
  
  // 📊 METADATA TRACKING
  metadata: {
    trackCaptureTime: true,                  // Record when photo was taken
    trackCameraInfo: true,                   // Record camera/device information
    trackAnalysisResults: true,              // Link to analysis reports
    trackQualityMetrics: true,               // Record photo quality assessment
    trackStorageMetrics: true,               // Record storage size and compression
  }
};

// ============================================================================
// ANALYSIS REPORT STORAGE CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Analysis report storage and formatting
 * 
 * Configuration for storing AI analysis results with proper organization
 * and efficient retrieval for both concise and detailed reports.
 */
export const analysisStorageConfig = {
  // 📝 REPORT ORGANIZATION
  organization: {
    useTimestampCategories: true,            // Organize reports by time periods
    categorizeByAlertLevel: true,            // Group by normal/warning/critical
    enableReportChaining: true,              // Link related reports together
    maintainTrendHistory: true,              // Keep data for trend analysis
  },
  
  // 🎯 CONCISE REPORT SETTINGS
  conciseReports: {
    maxLength: 200,                          // Maximum characters in summary
    includeConfidenceScore: true,            // Show AI confidence level
    includeTimestamp: true,                  // Show when analysis was performed
    includeKeyFindings: true,                // Include 1-2 key observations
    includePrimaryAction: true,              // Include recommended action
  },
  
  // 📊 FULL REPORT SETTINGS
  fullReports: {
    includeRawData: true,                    // Include original AI response
    includePhotoMetadata: true,              // Include photo capture details
    includeProcessingMetrics: true,          // Include analysis performance data
    includeTrendAnalysis: true,              // Include comparison to previous reports
    enableDataExport: true,                  // Allow exporting full reports
    compressionLevel: 'medium',              // Compression for large reports
  },
  
  // 🔄 INDEXING AND RETRIEVAL
  indexing: {
    createTimeIndex: true,                   // Index by creation time
    createAlertIndex: true,                  // Index by alert level
    createConfidenceIndex: true,             // Index by confidence score
    enableFullTextSearch: false,             // Full text search (disabled for performance)
    maxIndexSize: 10000,                     // Maximum items in search index
  }
};

// ============================================================================
// EXPORT AND IMPORT CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Data export and import capabilities
 * 
 * Configuration for exporting analysis data and photos for external use
 * or importing data from other systems or previous installations.
 */
export const exportImportConfig = {
  // 📤 EXPORT SETTINGS
  export: {
    defaultFormat: 'json',                   // Default export format
    availableFormats: ['json', 'csv', 'pdf', 'zip'], // Supported export formats
    includePhotos: true,                     // Include photos in exports by default
    includeRawData: false,                   // Exclude raw AI data by default
    compressExports: true,                   // Compress large export files
    maxExportSize: 100 * 1024 * 1024,      // 100MB maximum export size
  },
  
  // 📥 IMPORT SETTINGS
  import: {
    allowDataImport: true,                   // Allow importing data
    supportedFormats: ['json', 'csv'],      // Supported import formats
    validateImportData: true,                // Validate imported data structure
    mergeWithExisting: true,                 // Merge with existing data
    backupBeforeImport: true,                // Backup current data before import
  },
  
  // 🔄 BATCH OPERATIONS
  batchOperations: {
    enableBatchExport: true,                 // Allow exporting multiple reports
    maxBatchSize: 1000,                      // Maximum items in batch operation
    showProgress: true,                      // Show progress during operations
    enableCancel: true,                      // Allow canceling long operations
  }
};

// ============================================================================
// PERFORMANCE AND MONITORING
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Performance monitoring and optimization
 * 
 * Settings for monitoring storage performance and automatically
 * optimizing for the best user experience.
 */
export const performanceConfig = {
  // ⚡ PERFORMANCE SETTINGS
  performance: {
    enableLazyLoading: true,                 // Load data only when needed
    cacheRecentReports: true,                // Cache frequently accessed reports
    maxCacheSize: 50,                        // Maximum items in memory cache
    cacheDurationMinutes: 30,                // How long to keep items in cache
    enableBackgroundProcessing: true,        // Process data in background
  },
  
  // 📊 MONITORING SETTINGS
  monitoring: {
    trackStorageUsage: true,                 // Monitor storage space usage
    trackOperationTimes: true,               // Monitor operation performance
    trackErrorRates: true,                   // Monitor error frequency
    logDetailedMetrics: false,               // Detailed logging (disabled for privacy)
    alertOnThresholds: true,                 // Alert when thresholds exceeded
  },
  
  // 🔧 OPTIMIZATION SETTINGS
  optimization: {
    autoOptimizeSchedule: true,              // Automatically schedule optimizations
    optimizationFrequencyHours: 168,        // Optimize weekly (168 hours)
    enableIndexOptimization: true,           // Optimize search indices
    enableCompressionReview: true,           // Review and improve compression
    enableStorageDefragmentation: false,    // Defragment storage (experimental)
  }
};

// ============================================================================
// SECURITY AND PRIVACY CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Security and privacy settings
 * 
 * Configuration for maintaining data security and user privacy
 * while enabling comprehensive monitoring capabilities.
 */
export const securityConfig = {
  // 🔒 DATA SECURITY
  security: {
    encryptSensitiveData: false,             // Encrypt sensitive data (disabled for demo)
    hashUserIdentifiers: true,               // Hash user IDs for privacy
    anonymizeExports: false,                 // Remove identifying info from exports
    secureDataTransfer: true,                // Use secure methods for data operations
  },
  
  // 🕵️ PRIVACY PROTECTION
  privacy: {
    minimizeDataCollection: false,           // Collect minimal data (disabled for demo)
    enableDataPurging: true,                 // Allow complete data removal
    respectDoNotTrack: false,                // Honor Do Not Track headers (disabled for demo)
    provideDataSummary: true,                // Provide summary of stored data
  },
  
  // 🛡️ ACCESS CONTROL
  accessControl: {
    requireAuthentication: true,             // Require user authentication
    validateSessionTokens: false,            // Validate tokens (disabled for demo)
    logDataAccess: false,                    // Log data access (disabled for privacy)
    enableAuditTrail: false,                 // Maintain audit trail (disabled for demo)
  }
};

// ============================================================================
// CONSOLIDATED STORAGE CONFIGURATION EXPORT
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete storage configuration
 * 
 * This is the main configuration object that combines all storage settings.
 * Import this in components that need storage configuration:
 * 
 * ```typescript
 * import { storageConfig } from '../config/storageConfig';
 * 
 * // Check if feature is enabled for current user
 * if (storageConfig.demo.features.enableAIAnalysisStorage) {
 *   // Use storage features
 * }
 * 
 * // Get storage limits
 * const maxSize = storageConfig.quota.limits.maxTotalStorage;
 * ```
 */
export const storageConfig = {
  // Core configuration sections
  demo: demoAccountConfig,
  quota: storageQuotaConfig,
  retention: dataRetentionConfig,
  photos: photoStorageConfig,
  analysis: analysisStorageConfig,
  exportImport: exportImportConfig,
  performance: performanceConfig,
  security: securityConfig,
  
  // Configuration metadata
  version: '2.0.0',
  lastUpdated: '2025-01-15',
  
  // 💼 BUSINESS PARTNER: Quick access methods
  isDemoEnabled: (userEmail: string): boolean => {
    return userEmail === demoAccountConfig.enabledEmail || 
           demoAccountConfig.alternateEmails.includes(userEmail);
  },
  
  getStorageLimit: (): number => {
    return storageQuotaConfig.limits.maxTotalStorage;
  },
  
  getRetentionPeriod: (dataType: string): number => {
    switch (dataType) {
      case 'critical': return dataRetentionConfig.retentionPeriods.analysisReports.criticalAlerts;
      case 'warning': return dataRetentionConfig.retentionPeriods.analysisReports.warningAlerts;
      case 'normal': return dataRetentionConfig.retentionPeriods.analysisReports.normalReports;
      case 'photos': return dataRetentionConfig.retentionPeriods.capturedPhotos.routineCaptures;
      default: return 30; // Default 30 days
    }
  },
  
  shouldCompress: (dataSize: number): boolean => {
    return storageQuotaConfig.autoManagement.enableCompression && 
           dataSize > storageQuotaConfig.autoManagement.compressionThreshold;
  }
};

// ============================================================================
// HELPER FUNCTIONS FOR BUSINESS PARTNERS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Check if storage features are available
 * 
 * Use this function to check if the current user can access storage features.
 * Only demo accounts have access to prevent impact on production users.
 */
export const isStorageEnabled = (userEmail: string): boolean => {
  return storageConfig.isDemoEnabled(userEmail);
};

/**
 * 💼 BUSINESS PARTNER: Get current storage configuration summary
 * 
 * Returns a summary of current storage settings for display in UI.
 */
export const getStorageConfigSummary = () => {
  return {
    maxStorage: formatBytes(storageConfig.quota.limits.maxTotalStorage),
    retentionPeriod: `${storageConfig.retention.retentionPeriods.analysisReports.normalReports} days`,
    autoCleanup: storageConfig.retention.cleanupSchedule.dailyMaintenance.enabled,
    compression: storageConfig.quota.autoManagement.enableCompression,
    exportFormats: storageConfig.exportImport.export.availableFormats.join(', '),
    demoRestricted: true
  };
};

/**
 * 💼 BUSINESS PARTNER: Format bytes for human-readable display
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 💼 BUSINESS PARTNER: Validate storage configuration
 * 
 * Ensures all configuration values are valid and consistent.
 */
export const validateStorageConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check storage limits are reasonable
  if (storageConfig.quota.limits.maxTotalStorage < 1024 * 1024) {
    errors.push('Total storage limit too small (minimum 1MB required)');
  }
  
  // Check retention periods are positive
  if (storageConfig.retention.retentionPeriods.analysisReports.normalReports < 1) {
    errors.push('Retention period must be at least 1 day');
  }
  
  // Check demo email is configured
  if (!storageConfig.demo.enabledEmail) {
    errors.push('Demo email must be configured');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export default storageConfig; 