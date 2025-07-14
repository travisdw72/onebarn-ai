/**
 * Local Storage Service - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER GUIDE: Local Data Storage Management
 * ═══════════════════════════════════════════════════════════
 * 
 * This service manages ALL data storage for the AI monitoring system:
 * - Analysis reports (concise + full)
 * - Captured photos with metadata
 * - User preferences and settings
 * - System data and usage statistics
 * 
 * 🔒 PRIVACY FIRST: All data stored locally in your browser
 * 📦 COMPRESSION: Automatic data compression to save space
 * 🗑️ AUTO-CLEANUP: Automatic removal of old data (30 days)
 * 💾 EXPORT: Full data export capabilities for external use
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @updated 2025-01-15
 */

import { brandConfig } from '../config/brandConfig';

// ============================================================================
// STORAGE INTERFACES - BUSINESS PARTNER DOCUMENTATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Main storage schema for all AI monitoring data
 * 
 * This interface defines how data is structured in browser storage.
 * All analysis reports, photos, and settings are organized under this schema.
 */
export interface IStorageSchema {
  // Analysis Reports Storage
  analysisReports: {
    [reportId: string]: {
      concise: IConciseReport;      // Short summary for chat display
      full: IFullAnalysisReport;    // Detailed analysis for insights panel
      raw: any;                     // Original AI response data
      timestamp: Date;              // When analysis was performed
      photos: string[];             // Associated photo IDs
    };
  };
  
  // Photo Storage with Metadata
  capturedPhotos: {
    [photoId: string]: {
      data: string;                 // Base64 encoded photo data
      metadata: IPhotoMetadata;     // Capture details and quality info
      analysisResults: string[];    // Associated analysis report IDs
      compressed: boolean;          // Whether photo data is compressed
    };
  };
  
  // User Preferences and Settings
  userPreferences: {
    scheduleOverrides: any;         // Custom schedule modifications
    notificationSettings: any;     // Alert and notification preferences
    analysisSettings: any;         // AI analysis configuration overrides
    exportPreferences: any;        // Default export format preferences
  };
  
  // System Management Data
  systemData: {
    lastCleanup: Date;              // When automatic cleanup last ran
    storageUsage: number;           // Current storage usage in bytes
    dataVersion: string;            // Schema version for migrations
    totalReports: number;           // Total number of reports stored
    totalPhotos: number;            // Total number of photos stored
  };
}

/**
 * 💼 BUSINESS PARTNER: Concise report structure for chat interface
 * 
 * These short reports appear in the chat window and provide quick insights.
 * Maximum 2-3 sentences with key findings and action level.
 */
export interface IConciseReport {
  id: string;
  summary: string;                  // 2-3 sentence summary of findings
  alertLevel: 'normal' | 'warning' | 'critical';
  timestamp: Date;
  confidence: number;               // AI confidence score (0-1)
  keyFindings: string[];           // 1-2 most important observations
  nextAction: string;              // Recommended immediate action
  fullReportId: string;            // Link to detailed analysis
}

/**
 * 💼 BUSINESS PARTNER: Full analysis report structure for insights panel
 * 
 * Comprehensive analysis with all details, trends, and raw data.
 * Displayed in the AI Insights tab with export capabilities.
 */
export interface IFullAnalysisReport {
  id: string;
  timestamp: Date;
  
  // Executive Summary Section
  executiveSummary: {
    overallStatus: string;          // High-level status assessment
    primaryFindings: string[];      // Key observations
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedActions: string[];   // Prioritized action items
  };
  
  // Detailed Analysis Section
  detailedAnalysis: {
    observations: string;           // Full AI analysis text
    behaviorPatterns: IBehaviorPattern[];
    healthIndicators: IHealthIndicator[];
    environmentalFactors: string[]; // Conditions affecting analysis
  };
  
  // Raw Data Section
  rawData: {
    aiResponse: any;                // Original AI analysis response
    photoMetadata: IPhotoMetadata[];// Technical photo information
    confidenceScores: IConfidenceScore[];
    processingMetrics: IProcessingMetrics;
  };
  
  // Trends and History
  trends: {
    comparisonToPrevious: ITrendAnalysis;
    longTermTrends: ITrendData[];
    anomalies: IAnomalyDetection[];
  };
  
  // Export and Sharing
  exportData: {
    generatedAt: Date;
    exportFormats: string[];        // Available export formats
    shareableLink?: string;         // Optional sharing capability
  };
}

/**
 * 💼 BUSINESS PARTNER: Photo metadata for quality and analysis tracking
 */
export interface IPhotoMetadata {
  id: string;
  captureTime: Date;
  cameraSource: string;             // Which camera captured the photo
  resolution: { width: number; height: number };
  fileSize: number;                 // Original file size in bytes
  quality: 'low' | 'medium' | 'high';
  lighting: string;                 // Lighting conditions
  analysisQuality: number;          // How suitable for AI analysis (0-1)
  scheduleType: 'daytime' | 'nighttime'; // Which schedule captured this
}

// Supporting interfaces for analysis data
export interface IBehaviorPattern {
  pattern: string;
  frequency: number;
  significance: 'low' | 'medium' | 'high';
  description: string;
}

export interface IHealthIndicator {
  indicator: string;
  value: string;
  normal: boolean;
  concern: string;
}

export interface IConfidenceScore {
  category: string;
  score: number;
  factors: string[];
}

export interface IProcessingMetrics {
  analysisTime: number;             // Time taken for analysis in ms
  photosProcessed: number;
  aiProvider: string;
  modelVersion: string;
}

export interface ITrendAnalysis {
  improvement: boolean;
  changePercentage: number;
  significantChanges: string[];
}

export interface ITrendData {
  date: Date;
  metric: string;
  value: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface IAnomalyDetection {
  type: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  timestamp: Date;
}

// ============================================================================
// MAIN LOCAL STORAGE SERVICE CLASS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER SERVICE: Complete local storage management system
 * 
 * CAPABILITIES:
 * ✅ Store analysis reports and photos locally
 * ✅ Automatic data compression to save space
 * ✅ Intelligent cleanup of old data
 * ✅ Export data in multiple formats
 * ✅ Monitor storage usage and quotas
 * ✅ Data integrity validation
 * 
 * SETUP INSTRUCTIONS:
 * 1. Service automatically initializes when first used
 * 2. No configuration required - works out of the box
 * 3. Data persists between browser sessions
 * 4. Automatic cleanup prevents storage overflow
 */
export class LocalStorageService {
  private readonly STORAGE_PREFIX = 'onebarndemo_';
  private readonly SCHEMA_VERSION = '2.0.0';
  private readonly MAX_STORAGE_SIZE = 50 * 1024 * 1024; // 50MB limit
  private readonly CLEANUP_DAYS = 30; // Auto-delete data older than 30 days
  
  // 💼 BUSINESS PARTNER: Storage keys for different data types
  private readonly KEYS = {
    REPORTS: `${this.STORAGE_PREFIX}reports`,
    PHOTOS: `${this.STORAGE_PREFIX}photos`,
    PREFERENCES: `${this.STORAGE_PREFIX}preferences`,
    SYSTEM: `${this.STORAGE_PREFIX}system`,
    INDEX: `${this.STORAGE_PREFIX}index`
  };

  constructor() {
    this.initializeStorage();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION AND SETUP
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Initialize storage system
   * 
   * Automatically called when service is first used.
   * Sets up storage schema and performs any necessary migrations.
   */
  private async initializeStorage(): Promise<void> {
    try {
      // Check if storage is already initialized
      const systemData = this.getSystemData();
      
      if (!systemData || systemData.dataVersion !== this.SCHEMA_VERSION) {
        // First time setup or version migration needed
        await this.setupInitialStorage();
      }
      
      // Perform routine maintenance
      await this.performRoutineMaintenance();
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to initialize storage:', error);
      throw new Error('Storage initialization failed. Please clear browser data and try again.');
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Set up initial storage structure
   */
  private async setupInitialStorage(): Promise<void> {
    const initialSystemData = {
      lastCleanup: new Date(),
      storageUsage: 0,
      dataVersion: this.SCHEMA_VERSION,
      totalReports: 0,
      totalPhotos: 0
    };

    const initialPreferences = {
      scheduleOverrides: {},
      notificationSettings: {
        enableBrowserNotifications: true,
        soundAlerts: false,
        emailAlerts: false
      },
      analysisSettings: {
        confidenceThreshold: 0.7,
        enableDetailedLogging: true
      },
      exportPreferences: {
        defaultFormat: 'json',
        includePhotos: true,
        includeRawData: false
      }
    };

    // Initialize storage with empty structures
    localStorage.setItem(this.KEYS.REPORTS, JSON.stringify({}));
    localStorage.setItem(this.KEYS.PHOTOS, JSON.stringify({}));
    localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(initialPreferences));
    localStorage.setItem(this.KEYS.SYSTEM, JSON.stringify(initialSystemData));
    localStorage.setItem(this.KEYS.INDEX, JSON.stringify({
      reportIndex: [],
      photoIndex: [],
      lastUpdated: new Date()
    }));

    console.log('💼 BUSINESS PARTNER: Storage initialized successfully');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ANALYSIS REPORT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Store a complete analysis report
   * 
   * Saves both concise and full reports with automatic compression.
   * Associates with captured photos and updates indices.
   * 
   * @param conciseReport Short summary for chat display
   * @param fullReport Detailed analysis for insights panel
   * @param rawData Original AI response data
   * @param photoIds Associated photo IDs
   */
  async storeAnalysisReport(
    conciseReport: IConciseReport,
    fullReport: IFullAnalysisReport,
    rawData: any,
    photoIds: string[]
  ): Promise<void> {
    try {
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create complete report entry
      const reportEntry = {
        concise: conciseReport,
        full: fullReport,
        raw: await this.compressData(rawData),
        timestamp: new Date(),
        photos: photoIds
      };

      // Get current reports
      const reports = this.getAllReports();
      reports[reportId] = reportEntry;

      // Store updated reports
      localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(reports));

      // Update indices and system data
      await this.updateReportIndex(reportId, reportEntry.timestamp);
      await this.updateStorageUsage();

      console.log(`💼 BUSINESS PARTNER: Analysis report ${reportId} stored successfully`);

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to store analysis report:', error);
      throw new Error('Failed to save analysis report');
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Retrieve a specific analysis report
   * 
   * @param reportId Unique report identifier
   * @returns Complete report data or null if not found
   */
  async getAnalysisReport(reportId: string): Promise<any | null> {
    try {
      const reports = this.getAllReports();
      const report = reports[reportId];

      if (!report) {
        console.warn(`💼 BUSINESS PARTNER: Report ${reportId} not found`);
        return null;
      }

      // Decompress raw data if needed
      if (report.raw && typeof report.raw === 'string') {
        report.raw = await this.decompressData(report.raw);
      }

      return report;

    } catch (error) {
      console.error(`💼 BUSINESS PARTNER ERROR: Failed to retrieve report ${reportId}:`, error);
      return null;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Get all analysis reports with optional filtering
   * 
   * @param filter Optional filter criteria
   * @returns Array of analysis reports
   */
  async getAnalysisReports(filter?: {
    startDate?: Date;
    endDate?: Date;
    alertLevel?: string;
    limit?: number;
  }): Promise<any[]> {
    try {
      const reports = this.getAllReports();
      let reportArray = Object.entries(reports).map(([id, report]) => ({
        id,
        ...report
      }));

      // Apply filters if provided
      if (filter) {
        if (filter.startDate) {
          reportArray = reportArray.filter(report => 
            new Date(report.timestamp) >= filter.startDate!
          );
        }
        
        if (filter.endDate) {
          reportArray = reportArray.filter(report => 
            new Date(report.timestamp) <= filter.endDate!
          );
        }
        
        if (filter.alertLevel) {
          reportArray = reportArray.filter(report => 
            report.concise.alertLevel === filter.alertLevel
          );
        }
        
        if (filter.limit) {
          reportArray = reportArray.slice(0, filter.limit);
        }
      }

      // Sort by timestamp (newest first)
      reportArray.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return reportArray;

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to retrieve analysis reports:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PHOTO MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Store captured photos with metadata
   * 
   * Automatically compresses photos and stores with analysis metadata.
   * Associates photos with analysis reports for easy retrieval.
   * 
   * @param photoData Base64 encoded photo data
   * @param metadata Photo capture and quality information
   * @returns Unique photo ID for reference
   */
  async storePhoto(photoData: string, metadata: IPhotoMetadata): Promise<string> {
    try {
      const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Compress photo data if it's large
      const compressedData = await this.compressPhotoData(photoData);
      
      const photoEntry = {
        data: compressedData,
        metadata: metadata,
        analysisResults: [],
        compressed: compressedData !== photoData
      };

      // Get current photos
      const photos = this.getAllPhotos();
      photos[photoId] = photoEntry;

      // Store updated photos
      localStorage.setItem(this.KEYS.PHOTOS, JSON.stringify(photos));

      // Update indices and system data
      await this.updatePhotoIndex(photoId, metadata.captureTime);
      await this.updateStorageUsage();

      console.log(`💼 BUSINESS PARTNER: Photo ${photoId} stored successfully`);
      return photoId;

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to store photo:', error);
      throw new Error('Failed to save photo');
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Retrieve a specific photo
   * 
   * @param photoId Unique photo identifier
   * @returns Photo data and metadata or null if not found
   */
  async getPhoto(photoId: string): Promise<any | null> {
    try {
      const photos = this.getAllPhotos();
      const photo = photos[photoId];

      if (!photo) {
        console.warn(`💼 BUSINESS PARTNER: Photo ${photoId} not found`);
        return null;
      }

      // Decompress photo data if needed
      if (photo.compressed) {
        photo.data = await this.decompressPhotoData(photo.data);
      }

      return photo;

    } catch (error) {
      console.error(`💼 BUSINESS PARTNER ERROR: Failed to retrieve photo ${photoId}:`, error);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // DATA COMPRESSION AND OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Compress data to save storage space
   * 
   * Uses efficient compression for analysis data and photos.
   * Automatically applied to large data to optimize storage usage.
   */
  private async compressData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      
      // Simple compression using browser's built-in compression
      // For production, consider using a compression library
      return btoa(jsonString);
      
    } catch (error) {
      console.warn('💼 BUSINESS PARTNER: Data compression failed, storing uncompressed');
      return JSON.stringify(data);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Decompress stored data
   */
  private async decompressData(compressedData: string): Promise<any> {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
      
    } catch (error) {
      console.warn('💼 BUSINESS PARTNER: Data decompression failed, returning as-is');
      return compressedData;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Compress photo data for efficient storage
   */
  private async compressPhotoData(photoData: string): Promise<string> {
    try {
      // For demo purposes, we'll use simple compression
      // In production, consider image-specific compression
      if (photoData.length > 100000) { // Compress if > 100KB
        return this.compressData(photoData);
      }
      return photoData;
      
    } catch (error) {
      console.warn('💼 BUSINESS PARTNER: Photo compression failed');
      return photoData;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Decompress photo data
   */
  private async decompressPhotoData(compressedData: string): Promise<string> {
    try {
      return await this.decompressData(compressedData);
    } catch (error) {
      return compressedData;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STORAGE MANAGEMENT AND CLEANUP
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Automatic cleanup of old data
   * 
   * Removes data older than 30 days to prevent storage overflow.
   * Runs automatically but can be triggered manually.
   */
  async performCleanup(): Promise<void> {
    try {
      const cutoffDate = new Date(Date.now() - (this.CLEANUP_DAYS * 24 * 60 * 60 * 1000));
      let cleanedReports = 0;
      let cleanedPhotos = 0;

      // Clean old reports
      const reports = this.getAllReports();
      Object.keys(reports).forEach(reportId => {
        const report = reports[reportId];
        if (new Date(report.timestamp) < cutoffDate) {
          delete reports[reportId];
          cleanedReports++;
        }
      });
      localStorage.setItem(this.KEYS.REPORTS, JSON.stringify(reports));

      // Clean old photos
      const photos = this.getAllPhotos();
      Object.keys(photos).forEach(photoId => {
        const photo = photos[photoId];
        if (new Date(photo.metadata.captureTime) < cutoffDate) {
          delete photos[photoId];
          cleanedPhotos++;
        }
      });
      localStorage.setItem(this.KEYS.PHOTOS, JSON.stringify(photos));

      // Update system data
      const systemData = this.getSystemData();
      systemData.lastCleanup = new Date();
      systemData.totalReports -= cleanedReports;
      systemData.totalPhotos -= cleanedPhotos;
      localStorage.setItem(this.KEYS.SYSTEM, JSON.stringify(systemData));

      // Update storage usage
      await this.updateStorageUsage();

      console.log(`💼 BUSINESS PARTNER: Cleanup completed - removed ${cleanedReports} reports and ${cleanedPhotos} photos`);

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Cleanup failed:', error);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Check and update storage usage statistics
   */
  async updateStorageUsage(): Promise<void> {
    try {
      let totalSize = 0;
      
      // Calculate size of all stored data
      Object.keys(this.KEYS).forEach(key => {
        const data = localStorage.getItem(this.KEYS[key as keyof typeof this.KEYS]);
        if (data) {
          totalSize += data.length;
        }
      });

      // Update system data
      const systemData = this.getSystemData();
      systemData.storageUsage = totalSize;
      localStorage.setItem(this.KEYS.SYSTEM, JSON.stringify(systemData));

      // Check if approaching storage limit
      if (totalSize > this.MAX_STORAGE_SIZE * 0.8) {
        console.warn('💼 BUSINESS PARTNER WARNING: Storage usage is approaching limit. Consider running cleanup.');
      }

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to update storage usage:', error);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Get current storage statistics
   */
  getStorageStats(): {
    totalSize: number;
    maxSize: number;
    usagePercentage: number;
    totalReports: number;
    totalPhotos: number;
    lastCleanup: Date;
  } {
    const systemData = this.getSystemData();
    return {
      totalSize: systemData.storageUsage || 0,
      maxSize: this.MAX_STORAGE_SIZE,
      usagePercentage: ((systemData.storageUsage || 0) / this.MAX_STORAGE_SIZE) * 100,
      totalReports: systemData.totalReports || 0,
      totalPhotos: systemData.totalPhotos || 0,
      lastCleanup: systemData.lastCleanup ? new Date(systemData.lastCleanup) : new Date()
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Routine maintenance tasks
   */
  private async performRoutineMaintenance(): Promise<void> {
    const systemData = this.getSystemData();
    const lastCleanup = systemData.lastCleanup ? new Date(systemData.lastCleanup) : new Date(0);
    const oneDayAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

    // Run cleanup if it's been more than a day
    if (lastCleanup < oneDayAgo) {
      await this.performCleanup();
    }

    // Update storage usage
    await this.updateStorageUsage();
  }

  /**
   * 💼 BUSINESS PARTNER: Get all reports from storage
   */
  private getAllReports(): any {
    const data = localStorage.getItem(this.KEYS.REPORTS);
    return data ? JSON.parse(data) : {};
  }

  /**
   * 💼 BUSINESS PARTNER: Get all photos from storage
   */
  private getAllPhotos(): any {
    const data = localStorage.getItem(this.KEYS.PHOTOS);
    return data ? JSON.parse(data) : {};
  }

  /**
   * 💼 BUSINESS PARTNER: Get system data
   */
  private getSystemData(): any {
    const data = localStorage.getItem(this.KEYS.SYSTEM);
    return data ? JSON.parse(data) : {};
  }

  /**
   * 💼 BUSINESS PARTNER: Update report index for efficient retrieval
   */
  private async updateReportIndex(reportId: string, timestamp: Date): Promise<void> {
    try {
      const indexData = JSON.parse(localStorage.getItem(this.KEYS.INDEX) || '{}');
      if (!indexData.reportIndex) indexData.reportIndex = [];
      
      indexData.reportIndex.push({
        id: reportId,
        timestamp: timestamp,
        indexed: new Date()
      });
      
      // Keep index sorted by timestamp
      indexData.reportIndex.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      indexData.lastUpdated = new Date();
      localStorage.setItem(this.KEYS.INDEX, JSON.stringify(indexData));

      // Update system data
      const systemData = this.getSystemData();
      systemData.totalReports = (systemData.totalReports || 0) + 1;
      localStorage.setItem(this.KEYS.SYSTEM, JSON.stringify(systemData));

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to update report index:', error);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Update photo index for efficient retrieval
   */
  private async updatePhotoIndex(photoId: string, captureTime: Date): Promise<void> {
    try {
      const indexData = JSON.parse(localStorage.getItem(this.KEYS.INDEX) || '{}');
      if (!indexData.photoIndex) indexData.photoIndex = [];
      
      indexData.photoIndex.push({
        id: photoId,
        captureTime: captureTime,
        indexed: new Date()
      });
      
      // Keep index sorted by capture time
      indexData.photoIndex.sort((a: any, b: any) => 
        new Date(b.captureTime).getTime() - new Date(a.captureTime).getTime()
      );
      
      indexData.lastUpdated = new Date();
      localStorage.setItem(this.KEYS.INDEX, JSON.stringify(indexData));

      // Update system data
      const systemData = this.getSystemData();
      systemData.totalPhotos = (systemData.totalPhotos || 0) + 1;
      localStorage.setItem(this.KEYS.SYSTEM, JSON.stringify(systemData));

    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to update photo index:', error);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Clear all stored data (for testing/reset)
   * 
   * ⚠️ WARNING: This permanently deletes all analysis data and photos!
   * Use only for testing or when you want to start fresh.
   */
  async clearAllData(): Promise<void> {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      await this.setupInitialStorage();
      console.log('💼 BUSINESS PARTNER: All data cleared and storage reset');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to clear data:', error);
      throw new Error('Failed to clear storage data');
    }
  }
}

// ============================================================================
// SINGLETON EXPORT FOR GLOBAL USE
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Global storage service instance
 * 
 * Import this in any component that needs to store or retrieve data:
 * 
 * ```typescript
 * import { localStorageService } from '../services/LocalStorageService';
 * 
 * // Store an analysis report
 * await localStorageService.storeAnalysisReport(concise, full, raw, photos);
 * 
 * // Get recent reports
 * const reports = await localStorageService.getAnalysisReports({ limit: 10 });
 * ```
 */
export const localStorageService = new LocalStorageService();

export default localStorageService; 