/**
 * Storage Types and Interfaces - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER INTERFACE DEFINITIONS
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This file defines ALL TypeScript interfaces for the storage system.
 * These interfaces ensure type safety and provide clear contracts for
 * data structures used throughout the AI monitoring system.
 * 
 * 📋 INCLUDED INTERFACES:
 * - Storage Schema and Data Structures
 * - Analysis Report Types (Concise + Full)
 * - Photo Storage and Metadata Types
 * - Configuration and Preference Types
 * - Export/Import Data Structures
 * - Error Handling and Validation Types
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance TypeScript strict mode, follows configuration standards
 */

// ============================================================================
// CORE STORAGE SCHEMA INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Main storage schema for all AI monitoring data
 * 
 * This is the top-level interface that defines the complete structure
 * of data stored in browser localStorage. All storage operations use
 * this schema to ensure consistency and type safety.
 */
export interface IStorageSchema {
  analysisReports: IAnalysisReportStorage;
  capturedPhotos: IPhotoStorage;
  userPreferences: IUserPreferences;
  systemData: ISystemData;
  indices: IStorageIndices;
}

/**
 * 💼 BUSINESS PARTNER: Analysis reports storage structure
 * 
 * Stores all AI analysis reports with both concise (for chat) and
 * full (for insights panel) versions, plus raw AI response data.
 */
export interface IAnalysisReportStorage {
  [reportId: string]: IStoredAnalysisReport;
}

/**
 * 💼 BUSINESS PARTNER: Photo storage structure
 * 
 * Stores captured photos with metadata and compression information.
 * Links photos to their associated analysis reports.
 */
export interface IPhotoStorage {
  [photoId: string]: IStoredPhoto;
}

// ============================================================================
// ANALYSIS REPORT INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete stored analysis report
 * 
 * This interface defines how analysis reports are stored, including
 * both user-facing reports and raw AI data for transparency.
 */
export interface IStoredAnalysisReport {
  // Report Data
  concise: IConciseReport;              // Short summary for chat interface
  full: IFullAnalysisReport;            // Detailed analysis for insights panel
  raw: IAIRawResponse;                  // Original AI response (may be compressed)
  
  // Metadata
  id: string;                           // Unique report identifier
  timestamp: Date;                      // When analysis was performed
  photos: string[];                     // Associated photo IDs
  
  // Storage Information
  storageSize: number;                  // Size of stored data in bytes
  compressed: boolean;                  // Whether data is compressed
  version: string;                      // Schema version for migrations
}

/**
 * 💼 BUSINESS PARTNER: Concise report for chat interface
 * 
 * Short, actionable reports that appear in the chat window.
 * Maximum 2-3 sentences with clear next steps.
 */
export interface IConciseReport {
  // Identification
  id: string;                           // Unique concise report ID
  timestamp: Date;                      // When report was generated
  
  // Content
  summary: string;                      // 2-3 sentence summary (max 200 chars)
  alertLevel: AlertLevel;               // Severity level for UI styling
  confidence: number;                   // AI confidence score (0-1)
  
  // Key Information
  keyFindings: string[];                // 1-2 most important observations
  nextAction: string;                   // Recommended immediate action
  urgency: UrgencyLevel;                // How quickly action is needed
  
  // Links and Navigation
  fullReportId: string;                 // Link to detailed analysis
  relatedPhotoIds: string[];            // Photos that support findings
  
  // Display Formatting
  displayData: {
    icon: string;                       // Icon for chat display
    backgroundColor: string;            // Background color based on alert level
    textColor: string;                  // Text color for readability
    showViewButton: boolean;            // Whether to show "View Full Report" button
  };
}

/**
 * 💼 BUSINESS PARTNER: Full analysis report for insights panel
 * 
 * Comprehensive analysis with all details, trends, raw data, and
 * export capabilities. Displayed in the AI Insights tab.
 */
export interface IFullAnalysisReport {
  // Identification and Metadata
  id: string;                           // Unique full report ID
  timestamp: Date;                      // When analysis was performed
  version: string;                      // Report schema version
  
  // Executive Summary Section
  executiveSummary: {
    overallStatus: string;              // High-level status assessment
    primaryFindings: string[];          // Key observations
    riskLevel: RiskLevel;               // Overall risk assessment
    recommendedActions: IRecommendedAction[];
    confidence: number;                 // Overall confidence score (0-1)
  };
  
  // Detailed Analysis Section
  detailedAnalysis: {
    observations: string;               // Full AI analysis text
    behaviorPatterns: IBehaviorPattern[];
    healthIndicators: IHealthIndicator[];
    environmentalFactors: IEnvironmentalFactor[];
    temporalAnalysis: ITemporalAnalysis;
  };
  
  // Raw Data Section (for transparency)
  rawData: {
    aiResponse: IAIRawResponse;         // Original AI response
    photoMetadata: IPhotoMetadata[];    // Technical photo information
    confidenceScores: IConfidenceScore[];
    processingMetrics: IProcessingMetrics;
    systemContext: ISystemContext;
  };
  
  // Trends and Historical Analysis
  trends: {
    comparisonToPrevious: ITrendAnalysis | null;
    longTermTrends: ITrendData[];
    anomalies: IAnomalyDetection[];
    patternRecognition: IPatternRecognition[];
  };
  
  // Export and Sharing Capabilities
  exportData: {
    generatedAt: Date;                  // When export data was prepared
    availableFormats: ExportFormat[];   // Supported export formats
    estimatedSizes: { [format: string]: number }; // Estimated export file sizes
    shareableData: boolean;             // Whether data can be shared externally
  };
  
  // Quality and Validation
  quality: {
    dataCompleteness: number;           // How complete the analysis is (0-1)
    analysisDepth: AnalysisDepth;       // Level of analysis performed
    validationStatus: ValidationStatus; // Data validation results
    limitations: string[];              // Known limitations of this analysis
  };
}

// ============================================================================
// PHOTO STORAGE INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Stored photo with metadata
 * 
 * Complete photo storage structure including compressed image data,
 * capture metadata, and analysis associations.
 */
export interface IStoredPhoto {
  // Photo Data
  data: string;                         // Base64 encoded photo data
  compressed: boolean;                  // Whether photo data is compressed
  originalSize: number;                 // Original file size in bytes
  compressedSize: number;               // Compressed size in bytes
  
  // Metadata
  metadata: IPhotoMetadata;             // Capture and technical details
  analysisResults: string[];            // Associated analysis report IDs
  
  // Storage Information
  id: string;                           // Unique photo identifier
  storedAt: Date;                       // When photo was stored
  lastAccessed: Date;                   // When photo was last retrieved
  accessCount: number;                  // How many times photo was accessed
}

/**
 * 💼 BUSINESS PARTNER: Photo capture metadata
 * 
 * Technical and contextual information about captured photos,
 * including quality assessment for AI analysis suitability.
 */
export interface IPhotoMetadata {
  // Basic Information
  id: string;                           // Unique photo identifier
  captureTime: Date;                    // When photo was captured
  filename?: string;                    // Original filename if available
  
  // Technical Details
  resolution: {
    width: number;                      // Photo width in pixels
    height: number;                     // Photo height in pixels
  };
  
  fileInfo: {
    format: string;                     // Image format (jpeg, png, etc.)
    quality: number;                    // Image quality setting (0-1)
    colorSpace?: string;                // Color space information
    orientation?: number;               // EXIF orientation data
  };
  
  // Capture Context
  cameraSource: {
    deviceId: string;                   // Camera device identifier
    deviceName: string;                 // Human-readable camera name
    resolution: string;                 // Camera resolution capability
    type: CameraType;                   // Camera type (webcam, mobile, etc.)
  };
  
  // Environmental Context
  environment: {
    lighting: LightingCondition;        // Lighting conditions
    timeOfDay: TimeOfDay;               // Day/night classification
    weather?: string;                   // Weather conditions if detectable
    location?: string;                  // Location description if available
  };
  
  // Quality Assessment
  qualityMetrics: {
    overallQuality: PhotoQuality;       // Overall photo quality rating
    analysisQuality: number;            // Suitability for AI analysis (0-1)
    sharpness: number;                  // Image sharpness score (0-1)
    brightness: number;                 // Brightness level (0-1)
    contrast: number;                   // Contrast level (0-1)
    noiseLevel: number;                 // Image noise assessment (0-1)
  };
  
  // Schedule Context
  scheduleInfo: {
    captureType: CaptureType;           // Scheduled vs manual capture
    schedulePhase: SchedulePhase;       // Daytime vs nighttime schedule
    sessionNumber: number;              // Which capture session
    photoInSession: number;             // Which photo in the 3-photo session
  };
}

// ============================================================================
// USER PREFERENCES AND CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: User preferences and settings
 * 
 * Customizable settings that control how the storage system operates
 * and how data is displayed and managed.
 */
export interface IUserPreferences {
  // Schedule Customization
  scheduleOverrides: {
    daytimeInterval?: number;           // Custom daytime capture interval (minutes)
    nighttimeInterval?: number;         // Custom nighttime capture interval (minutes)
    photosPerCapture?: number;          // Custom number of photos per session
    enableSchedule?: boolean;           // Whether scheduling is enabled
    quietHours?: {                      // Hours with no captures
      start: string;                    // Start time (HH:MM format)
      end: string;                      // End time (HH:MM format)
    };
  };
  
  // Notification Settings
  notificationSettings: {
    enableBrowserNotifications: boolean; // Browser push notifications
    enableSoundAlerts: boolean;         // Audio alerts for critical findings
    enableEmailAlerts: boolean;         // Email notifications (if configured)
    alertLevels: AlertLevel[];          // Which alert levels trigger notifications
    quietMode: boolean;                 // Suppress non-critical notifications
  };
  
  // Analysis Preferences
  analysisSettings: {
    confidenceThreshold: number;        // Minimum confidence for displaying results (0-1)
    enableDetailedLogging: boolean;     // Whether to log detailed analysis data
    autoAnalysis: boolean;              // Automatically analyze captured photos
    analysisDepth: AnalysisDepth;       // Preferred analysis depth
    includeRawData: boolean;            // Whether to store raw AI responses
  };
  
  // Display Preferences
  displaySettings: {
    theme: 'light' | 'dark' | 'auto';   // UI theme preference
    compactMode: boolean;               // Use compact UI layout
    showConfidenceScores: boolean;      // Display AI confidence scores
    showTimestamps: boolean;            // Show detailed timestamps
    defaultReportView: 'concise' | 'full'; // Default report view
  };
  
  // Export Preferences
  exportPreferences: {
    defaultFormat: ExportFormat;        // Preferred export format
    includePhotos: boolean;             // Include photos in exports
    includeRawData: boolean;            // Include raw AI data in exports
    compressionLevel: CompressionLevel; // Export compression preference
    filenameFormat: string;             // Export filename template
  };
  
  // Privacy Settings
  privacySettings: {
    allowDataCollection: boolean;       // Allow usage analytics
    allowErrorReporting: boolean;       // Allow error reporting
    dataRetentionDays: number;          // Custom data retention period
    enableCleanupNotifications: boolean; // Notify before cleanup
  };
}

// ============================================================================
// SYSTEM DATA AND MONITORING
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: System data and monitoring information
 * 
 * Tracks storage usage, performance metrics, and system health
 * for optimal operation and maintenance.
 */
export interface ISystemData {
  // Storage Statistics
  storage: {
    totalUsage: number;                 // Total storage usage in bytes
    reportUsage: number;                // Storage used by reports
    photoUsage: number;                 // Storage used by photos
    systemUsage: number;                // Storage used by system data
    lastCalculated: Date;               // When usage was last calculated
  };
  
  // Content Statistics
  content: {
    totalReports: number;               // Total number of stored reports
    totalPhotos: number;                // Total number of stored photos
    reportsByAlertLevel: {              // Reports by severity
      normal: number;
      warning: number;
      critical: number;
    };
    photosByQuality: {                  // Photos by quality level
      high: number;
      medium: number;
      low: number;
    };
  };
  
  // Maintenance Information
  maintenance: {
    lastCleanup: Date;                  // When automatic cleanup last ran
    lastOptimization: Date;             // When optimization last ran
    nextScheduledCleanup: Date;         // When next cleanup is scheduled
    cleanupItemsRemoved: number;        // Items removed in last cleanup
    compressionSavings: number;         // Bytes saved by compression
  };
  
  // Performance Metrics
  performance: {
    averageAnalysisTime: number;        // Average AI analysis time (ms)
    averageStorageTime: number;         // Average storage operation time (ms)
    averageRetrievalTime: number;       // Average data retrieval time (ms)
    errorRate: number;                  // Percentage of operations that fail
    cacheHitRate: number;               // Percentage of cache hits
  };
  
  // System Information
  system: {
    version: string;                    // Storage system version
    schemaVersion: string;              // Data schema version
    browserInfo: string;                // Browser and version info
    installDate: Date;                  // When storage was first initialized
    lastUpdateCheck: Date;              // When system last checked for updates
  };
  
  // Health Monitoring
  health: {
    status: SystemStatus;               // Overall system health
    warnings: string[];                 // Current system warnings
    errors: string[];                   // Recent system errors
    resourceUsage: {                    // Resource utilization
      cpu: number;                      // CPU usage percentage
      memory: number;                   // Memory usage percentage
      storage: number;                  // Storage usage percentage
    };
  };
}

/**
 * 💼 BUSINESS PARTNER: Storage indices for efficient data retrieval
 * 
 * Maintains searchable indices for fast data access without loading
 * all data into memory. Optimizes performance for large datasets.
 */
export interface IStorageIndices {
  // Report Indices
  reportIndex: {
    byTimestamp: ITimestampIndex[];     // Reports sorted by creation time
    byAlertLevel: IAlertLevelIndex[];   // Reports grouped by severity
    byConfidence: IConfidenceIndex[];   // Reports sorted by AI confidence
    searchCache: ISearchCacheEntry[];   // Cached search results
  };
  
  // Photo Indices
  photoIndex: {
    byTimestamp: ITimestampIndex[];     // Photos sorted by capture time
    byQuality: IQualityIndex[];         // Photos grouped by quality level
    byAnalysis: IAnalysisIndex[];       // Photos linked to analysis results
    sizeIndex: ISizeIndex[];            // Photos sorted by file size
  };
  
  // Index Metadata
  metadata: {
    lastUpdated: Date;                  // When indices were last rebuilt
    totalIndexSize: number;             // Total size of all indices
    rebuildRequired: boolean;           // Whether indices need rebuilding
    rebuildReason?: string;             // Why rebuild is needed
  };
}

// ============================================================================
// ANALYSIS DATA INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: AI analysis behavior patterns
 * 
 * Structured data about detected behavior patterns with significance
 * levels and trend information.
 */
export interface IBehaviorPattern {
  pattern: string;                      // Description of behavior pattern
  frequency: number;                    // How often pattern occurs
  significance: SignificanceLevel;      // Importance of this pattern
  description: string;                  // Detailed explanation
  firstObserved: Date;                  // When pattern was first detected
  lastObserved: Date;                   // When pattern was last seen
  trend: TrendDirection;                // Whether pattern is increasing/decreasing
  confidence: number;                   // Confidence in pattern detection (0-1)
  relatedPatterns: string[];            // IDs of related patterns
}

/**
 * 💼 BUSINESS PARTNER: Health indicators from AI analysis
 * 
 * Health-related observations and assessments from AI analysis
 * with normal ranges and concern levels.
 */
export interface IHealthIndicator {
  indicator: string;                    // Name of health indicator
  value: string | number;               // Current measured/observed value
  unit?: string;                        // Unit of measurement if applicable
  normalRange?: {                       // Normal range for this indicator
    min: number;
    max: number;
  };
  status: HealthStatus;                 // Whether value is normal or concerning
  concern: string;                      // Description of any concerns
  confidence: number;                   // Confidence in assessment (0-1)
  trend?: TrendDirection;               // Trend compared to previous readings
  recommendations: string[];            // Specific recommendations for this indicator
}

/**
 * 💼 BUSINESS PARTNER: Environmental factors affecting analysis
 * 
 * External conditions that may impact behavior or analysis accuracy.
 */
export interface IEnvironmentalFactor {
  factor: string;                       // Name of environmental factor
  description: string;                  // Description of current conditions
  impact: ImpactLevel;                  // How much this affects the analysis
  confidence: number;                   // Confidence in factor assessment (0-1)
  recommendations: string[];            // How to account for this factor
}

/**
 * 💼 BUSINESS PARTNER: Temporal analysis of changes over time
 * 
 * Analysis of how observations change across the photo sequence
 * and comparison with historical data.
 */
export interface ITemporalAnalysis {
  timeSpan: number;                     // Duration of analysis in seconds
  changeDetected: boolean;              // Whether significant changes occurred
  changeDescription?: string;           // Description of detected changes
  stability: StabilityLevel;            // How stable conditions were
  keyMoments: IKeyMoment[];             // Important moments in the sequence
  overallTrend: TrendDirection;         // General direction of change
}

/**
 * 💼 BUSINESS PARTNER: Key moments during analysis
 * 
 * Specific timestamps where significant events or changes occurred.
 */
export interface IKeyMoment {
  timestamp: number;                    // Seconds from start of analysis
  description: string;                  // What happened at this moment
  significance: SignificanceLevel;      // How important this moment is
  photoIndex?: number;                  // Which photo captured this moment
  confidence: number;                   // Confidence in this observation (0-1)
}

// ============================================================================
// RAW AI RESPONSE INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Raw AI response data
 * 
 * Original response from AI analysis system for transparency
 * and debugging purposes. May be compressed for storage efficiency.
 */
export interface IAIRawResponse {
  // Response Metadata
  requestId: string;                    // Unique request identifier
  timestamp: Date;                      // When response was received
  processingTime: number;               // Time taken for analysis (ms)
  
  // AI Provider Information
  provider: string;                     // AI service provider (OpenAI, etc.)
  model: string;                        // Specific AI model used
  version: string;                      // Model version
  
  // Request Information
  requestData: {
    promptUsed: string;                 // AI prompt that was used
    photosSubmitted: number;            // Number of photos analyzed
    parameters: Record<string, any>;    // AI parameters used
  };
  
  // Response Data
  responseData: {
    content: string;                    // Raw AI response text
    tokensUsed: number;                 // Number of tokens consumed
    confidenceScore?: number;           // AI's confidence in response
    alternativeResponses?: string[];    // Other possible responses
  };
  
  // Processing Information
  processing: {
    preprocessingTime: number;          // Time spent preprocessing (ms)
    analysisTime: number;               // Time spent on AI analysis (ms)
    postprocessingTime: number;         // Time spent postprocessing (ms)
    errorOccurred: boolean;             // Whether any errors occurred
    warnings: string[];                 // Any warnings during processing
  };
  
  // Quality Metrics
  quality: {
    responseCompleteness: number;       // How complete the response is (0-1)
    relevanceScore: number;             // How relevant response is (0-1)
    consistencyCheck: boolean;          // Whether response is internally consistent
    validationPassed: boolean;          // Whether response passed validation
  };
}

// ============================================================================
// TREND ANALYSIS INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Trend analysis comparing current to previous
 * 
 * Analysis of how current findings compare to previous reports
 * for tracking improvement or deterioration over time.
 */
export interface ITrendAnalysis {
  // Comparison Metadata
  currentReportId: string;              // Current report being analyzed
  previousReportId: string;             // Previous report for comparison
  timeBetween: number;                  // Time between reports (hours)
  
  // Overall Trends
  overallTrend: TrendDirection;         // General direction of change
  trendStrength: TrendStrength;         // How strong the trend is
  confidence: number;                   // Confidence in trend analysis (0-1)
  
  // Specific Changes
  improvements: string[];               // Areas that have improved
  deteriorations: string[];             // Areas that have gotten worse
  stableAreas: string[];                // Areas that remained stable
  newFindings: string[];                // New observations not in previous report
  
  // Quantitative Changes
  behaviorChanges: IBehaviorChange[];   // Changes in behavior patterns
  healthChanges: IHealthChange[];       // Changes in health indicators
  environmentalChanges: IEnvironmentalChange[]; // Changes in environment
  
  // Recommendations
  recommendations: IRecommendedAction[]; // Actions based on trends
  monitoring: string[];                 // What to monitor going forward
  concernLevel: ConcernLevel;           // Level of concern about trends
}

/**
 * 💼 BUSINESS PARTNER: Long-term trend data point
 * 
 * Individual data points for tracking metrics over extended periods.
 */
export interface ITrendData {
  timestamp: Date;                      // When this data point was recorded
  metric: string;                       // Name of metric being tracked
  value: number;                        // Numerical value of metric
  unit?: string;                        // Unit of measurement
  trend: TrendDirection;                // Direction compared to previous
  confidence: number;                   // Confidence in this data point (0-1)
  context?: string;                     // Additional context for this reading
}

/**
 * 💼 BUSINESS PARTNER: Anomaly detection results
 * 
 * Identification of unusual patterns or behaviors that deviate
 * from established baselines or expected ranges.
 */
export interface IAnomalyDetection {
  // Anomaly Identification
  type: string;                         // Type of anomaly detected
  description: string;                  // Description of the anomaly
  severity: AnomalySeverity;            // How severe the anomaly is
  timestamp: Date;                      // When anomaly was detected
  
  // Statistical Information
  expectedValue?: number;               // What value was expected
  actualValue?: number;                 // What value was observed
  deviationScore: number;               // How far from normal (standard deviations)
  confidence: number;                   // Confidence in anomaly detection (0-1)
  
  // Context and Impact
  possibleCauses: string[];             // Potential explanations for anomaly
  impact: ImpactLevel;                  // How much this affects overall assessment
  previousOccurrences: Date[];          // When similar anomalies occurred before
  
  // Response Information
  actionRequired: boolean;              // Whether immediate action is needed
  recommendations: string[];            // Recommended responses to anomaly
  monitoringRequired: boolean;          // Whether ongoing monitoring is needed
}

// ============================================================================
// EXPORT/IMPORT INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Export data structure
 * 
 * Complete data package for exporting analysis data and photos
 * in various formats for external use or backup purposes.
 */
export interface IExportData {
  // Export Metadata
  metadata: {
    exportId: string;                   // Unique export identifier
    exportDate: Date;                   // When export was created
    format: ExportFormat;               // Export format used
    version: string;                    // Export schema version
    sourceSystem: string;               // System that created export
  };
  
  // Data Selection
  selection: {
    dateRange: {                        // Date range of exported data
      start: Date;
      end: Date;
    };
    includeReports: boolean;            // Whether reports are included
    includePhotos: boolean;             // Whether photos are included
    includeRawData: boolean;            // Whether raw AI data is included
    reportCount: number;                // Number of reports in export
    photoCount: number;                 // Number of photos in export
  };
  
  // Exported Content
  content: {
    reports?: IStoredAnalysisReport[];  // Analysis reports
    photos?: IStoredPhoto[];            // Photo data
    preferences?: IUserPreferences;     // User preferences
    systemInfo?: Partial<ISystemData>;  // System information
  };
  
  // Export Statistics
  statistics: {
    originalSize: number;               // Original data size (bytes)
    exportSize: number;                 // Export file size (bytes)
    compressionRatio: number;           // Compression achieved
    processingTime: number;             // Time to create export (ms)
    estimatedImportTime: number;        // Estimated time to import (ms)
  };
  
  // Validation and Integrity
  validation: {
    checksum: string;                   // Data integrity checksum
    validateOnImport: boolean;          // Whether to validate during import
    schemaValidation: boolean;          // Whether schema validation passed
    warningsCount: number;              // Number of validation warnings
  };
}

// ============================================================================
// UTILITY TYPE DEFINITIONS
// ============================================================================

// Alert and Severity Levels
export type AlertLevel = 'normal' | 'warning' | 'critical';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'immediate';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ConcernLevel = 'none' | 'minor' | 'moderate' | 'major' | 'severe';
export type SignificanceLevel = 'low' | 'medium' | 'high';
export type AnomalySeverity = 'minor' | 'moderate' | 'major' | 'critical';

// Quality and Status Types
export type PhotoQuality = 'low' | 'medium' | 'high' | 'excellent';
export type AnalysisDepth = 'basic' | 'standard' | 'detailed' | 'comprehensive';
export type ValidationStatus = 'pending' | 'passed' | 'warning' | 'failed';
export type HealthStatus = 'normal' | 'attention' | 'concern' | 'critical';
export type SystemStatus = 'healthy' | 'warning' | 'error' | 'maintenance';

// Trend and Change Types
export type TrendDirection = 'improving' | 'stable' | 'declining' | 'variable';
export type TrendStrength = 'weak' | 'moderate' | 'strong' | 'very_strong';
export type StabilityLevel = 'very_stable' | 'stable' | 'variable' | 'unstable';
export type ImpactLevel = 'none' | 'minimal' | 'moderate' | 'significant' | 'major';

// Technical Types
export type CameraType = 'webcam' | 'mobile' | 'external' | 'integrated';
export type LightingCondition = 'bright' | 'normal' | 'dim' | 'dark' | 'variable';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type CaptureType = 'scheduled' | 'manual' | 'triggered' | 'emergency';
export type SchedulePhase = 'daytime' | 'nighttime' | 'transition';

// Format and Compression Types
export type ExportFormat = 'json' | 'csv' | 'pdf' | 'zip' | 'xml';
export type CompressionLevel = 'none' | 'low' | 'medium' | 'high' | 'maximum';

// ============================================================================
// ADDITIONAL SUPPORTING INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Recommended action structure
 * 
 * Structured recommendations with priority and implementation details.
 */
export interface IRecommendedAction {
  action: string;                       // Description of recommended action
  priority: 'low' | 'medium' | 'high' | 'critical'; // Priority level
  timeframe: string;                    // When action should be taken
  category: 'monitoring' | 'intervention' | 'maintenance' | 'emergency';
  confidence: number;                   // Confidence in recommendation (0-1)
  rationale: string;                    // Why this action is recommended
  expectedOutcome: string;              // What should result from this action
}

/**
 * 💼 BUSINESS PARTNER: Processing metrics for performance tracking
 */
export interface IProcessingMetrics {
  totalTime: number;                    // Total processing time (ms)
  phases: {
    preprocessing: number;              // Preprocessing time (ms)
    aiAnalysis: number;                 // AI analysis time (ms)
    postprocessing: number;             // Postprocessing time (ms)
    storage: number;                    // Storage operation time (ms)
  };
  resourceUsage: {
    peakMemory: number;                 // Peak memory usage (bytes)
    cpuTime: number;                    // CPU time used (ms)
    networkCalls: number;               // Number of network requests
  };
  cachePerformance: {
    hits: number;                       // Cache hits
    misses: number;                     // Cache misses
    hitRate: number;                    // Cache hit rate (0-1)
  };
}

/**
 * 💼 BUSINESS PARTNER: System context for analysis
 */
export interface ISystemContext {
  browser: string;                      // Browser name and version
  platform: string;                    // Operating system
  timestamp: Date;                      // System timestamp
  timezone: string;                     // User timezone
  language: string;                     // User language preference
  screenResolution: string;             // Screen resolution
  connectionType?: string;              // Network connection type
  batteryLevel?: number;                // Device battery level (0-1)
}

/**
 * 💼 BUSINESS PARTNER: Confidence score breakdown
 */
export interface IConfidenceScore {
  category: string;                     // What this confidence score measures
  score: number;                        // Confidence level (0-1)
  factors: string[];                    // Factors affecting confidence
  methodology: string;                  // How confidence was calculated
  limitations: string[];               // Known limitations affecting confidence
}

/**
 * 💼 BUSINESS PARTNER: Pattern recognition results
 */
export interface IPatternRecognition {
  patternId: string;                    // Unique pattern identifier
  patternType: string;                  // Type of pattern (behavioral, temporal, etc.)
  description: string;                  // Human-readable pattern description
  frequency: number;                    // How often pattern occurs
  significance: SignificanceLevel;      // Importance of this pattern
  firstSeen: Date;                      // When pattern was first detected
  lastSeen: Date;                       // When pattern was last observed
  confidence: number;                   // Confidence in pattern detection (0-1)
  relatedPatterns: string[];            // IDs of related patterns
  impact: ImpactLevel;                  // Impact on overall assessment
}

// ============================================================================
// INDEX INTERFACES FOR EFFICIENT DATA RETRIEVAL
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Timestamp-based index entry
 */
export interface ITimestampIndex {
  id: string;                           // Item identifier
  timestamp: Date;                      // Item timestamp
  type: 'report' | 'photo';             // Type of indexed item
  alertLevel?: AlertLevel;              // Alert level if applicable
  size: number;                         // Item size in bytes
}

/**
 * 💼 BUSINESS PARTNER: Alert level index entry
 */
export interface IAlertLevelIndex {
  alertLevel: AlertLevel;               // Alert level
  items: string[];                      // Item IDs with this alert level
  count: number;                        // Number of items
  lastUpdated: Date;                    // When index was last updated
}

/**
 * 💼 BUSINESS PARTNER: Confidence score index entry
 */
export interface IConfidenceIndex {
  confidenceRange: string;              // Confidence range (e.g., "0.8-0.9")
  items: string[];                      // Item IDs in this confidence range
  averageConfidence: number;            // Average confidence for this range
  count: number;                        // Number of items in range
}

/**
 * 💼 BUSINESS PARTNER: Quality-based index entry
 */
export interface IQualityIndex {
  quality: PhotoQuality;                // Photo quality level
  items: string[];                      // Photo IDs with this quality
  count: number;                        // Number of photos
  totalSize: number;                    // Total size of photos in this quality level
}

/**
 * 💼 BUSINESS PARTNER: Analysis association index entry
 */
export interface IAnalysisIndex {
  photoId: string;                      // Photo identifier
  analysisIds: string[];                // Associated analysis report IDs
  analysisCount: number;                // Number of analyses for this photo
  lastAnalysis: Date;                   // When photo was last analyzed
}

/**
 * 💼 BUSINESS PARTNER: Size-based index entry
 */
export interface ISizeIndex {
  id: string;                           // Item identifier
  size: number;                         // Item size in bytes
  compressed: boolean;                  // Whether item is compressed
  compressionRatio?: number;            // Compression ratio if compressed
}

/**
 * 💼 BUSINESS PARTNER: Search cache entry
 */
export interface ISearchCacheEntry {
  searchQuery: string;                  // Search query that was cached
  results: string[];                    // Cached search results (item IDs)
  timestamp: Date;                      // When cache entry was created
  hitCount: number;                     // How many times cache was used
  validUntil: Date;                     // When cache entry expires
}

// ============================================================================
// CHANGE TRACKING INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Behavior change tracking
 */
export interface IBehaviorChange {
  behaviorType: string;                 // Type of behavior that changed
  previousState: string;                // Previous behavior state
  currentState: string;                 // Current behavior state
  changeType: 'improvement' | 'deterioration' | 'new' | 'resolved';
  significance: SignificanceLevel;      // How significant this change is
  confidence: number;                   // Confidence in change detection (0-1)
  firstNoticed: Date;                   // When change was first detected
  description: string;                  // Human-readable change description
}

/**
 * 💼 BUSINESS PARTNER: Health change tracking
 */
export interface IHealthChange {
  healthIndicator: string;              // Health indicator that changed
  previousValue: string | number;       // Previous value or state
  currentValue: string | number;        // Current value or state
  changeDirection: 'improved' | 'worsened' | 'new_concern' | 'resolved';
  severity: 'minor' | 'moderate' | 'significant' | 'major';
  confidence: number;                   // Confidence in change assessment (0-1)
  clinicalSignificance: boolean;        // Whether change is clinically significant
  recommendedAction: string;            // What should be done about this change
}

/**
 * 💼 BUSINESS PARTNER: Environmental change tracking
 */
export interface IEnvironmentalChange {
  factor: string;                       // Environmental factor that changed
  previousCondition: string;            // Previous environmental state
  currentCondition: string;             // Current environmental state
  impact: ImpactLevel;                  // How much this change affects analysis
  adaptationRequired: boolean;          // Whether analysis needs to adapt
  description: string;                  // Description of the change
}

export default IStorageSchema; 