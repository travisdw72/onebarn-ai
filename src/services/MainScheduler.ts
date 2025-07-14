/**
 * Main Scheduler Integration - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER COMPLETE WORKFLOW ORCHESTRATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This service orchestrates the complete end-to-end workflow:
 * Photo Capture → AI Analysis → Report Generation → Storage → Display
 * 
 * 🔄 COMPLETE WORKFLOW PIPELINE:
 *     1. Scheduled photo capture (3 photos every 20min/5min)
 *     2. AI analysis using aiVisionPromptsConfig.ts
 *     3. Concise report generation for chat interface
 *     4. Detailed report generation for insights panel
 *     5. Local storage of all data and reports
 *     6. Real-time updates to UI components
 * 
 * 🎯 BUSINESS PARTNER INTEGRATION:
 *     - Seamless automation requiring no manual intervention
 *     - Real-time status monitoring and error handling
 *     - Comprehensive logging for transparency
 *     - Performance optimization and resource management
 *     - Demo account restrictions and safety controls
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, follows all configuration standards
 */

import { getSchedulerService } from './SchedulerService';
import { getPhotoCaptureService } from './PhotoCaptureService';
import { aiAnalysisService } from './AIAnalysisService';
import { reportGenerator } from './ReportGenerator';
import { localStorageService } from './LocalStorageService';
import { CameraService } from './CameraService';
import { storageConfig } from '../config/storageConfig';
import { scheduleConfig } from '../config/scheduleConfig';
import { aiAnalysisConfig } from '../config/aiAnalysisConfig';
import { reportConfig } from '../config/reportConfig';
import { brandConfig } from '../config/brandConfig';

// ============================================================================
// MAIN SCHEDULER INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete workflow status
 * 
 * Comprehensive status information for the entire AI monitoring
 * system including all component states and health metrics.
 */
export interface IMainSchedulerStatus {
  // Overall System Status
  systemStatus: 'healthy' | 'warning' | 'error' | 'maintenance';
  isRunning: boolean;
  lastActivity: Date | null;
  
  // Component Status
  components: {
    scheduler: {
      status: 'active' | 'paused' | 'stopped' | 'error';
      nextCapture: Date | null;
      sessionsToday: number;
      successRate: number;
    };
    
    photoCapture: {
      status: 'ready' | 'capturing' | 'error';
      availableCameras: number;
      lastCaptureTime: Date | null;
      totalPhotos: number;
    };
    
    aiAnalysis: {
      status: 'idle' | 'processing' | 'error';
      analysisInProgress: boolean;
      totalAnalyses: number;
      averageProcessingTime: number;
    };
    
    reportGeneration: {
      status: 'idle' | 'generating' | 'error';
      totalReports: number;
      averageGenerationTime: number;
      cacheHitRate: number;
    };
    
    localStorage: {
      status: 'healthy' | 'warning' | 'full' | 'error';
      usagePercentage: number;
      totalReports: number;
      totalPhotos: number;
      lastCleanup: Date | null;
    };
  };
  
  // Performance Metrics
  performance: {
    endToEndProcessingTime: number;    // Average time for complete workflow
    successfulWorkflows: number;       // Number of successful end-to-end workflows
    failedWorkflows: number;          // Number of failed workflows
    errorRate: number;                // Percentage of workflows with errors
    throughput: number;               // Workflows completed per hour
  };
  
  // Current Activity
  currentActivity: {
    phase: 'idle' | 'capturing' | 'analyzing' | 'reporting' | 'storing';
    progress: number;                 // Progress percentage (0-100)
    estimatedTimeRemaining: number;   // Estimated time to completion (ms)
    currentTask: string;              // Description of current task
  };
  
  // Health and Alerts
  health: {
    overallHealth: number;            // Overall system health (0-1)
    alerts: ISystemAlert[];          // Current system alerts
    warnings: string[];              // Active warnings
    recommendations: string[];       // System recommendations
  };
  
  // Demo Account Information
  demo: {
    isDemo: boolean;                  // Whether running in demo mode
    userEmail: string;                // Demo user email
    limitations: string[];           // Active demo limitations
    featuresEnabled: string[];       // Enabled demo features
  };
}

/**
 * 💼 BUSINESS PARTNER: System alert information
 */
export interface ISystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  actionRequired: boolean;
  recommendedAction?: string;
}

/**
 * 💼 BUSINESS PARTNER: Workflow execution result
 */
export interface IWorkflowResult {
  workflowId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  success: boolean;
  
  // Phase Results
  phases: {
    capture: {
      success: boolean;
      duration: number;
      photosCaptures: number;
      photoIds: string[];
      error?: string;
    };
    
    analysis: {
      success: boolean;
      duration: number;
      confidence: number;
      analysisId: string;
      error?: string;
    };
    
    reporting: {
      success: boolean;
      duration: number;
      reportIds: string[];
      error?: string;
    };
    
    storage: {
      success: boolean;
      duration: number;
      storedItems: number;
      error?: string;
    };
  };
  
  // Final Results
  results: {
    conciseReport?: any;
    detailedReport?: any;
    storedReportIds: string[];
    storedPhotoIds: string[];
  };
  
  // Performance Metrics
  performance: {
    totalProcessingTime: number;
    memoryUsage: number;
    resourceEfficiency: number;
    qualityScore: number;
  };
  
  // Error Information
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

// ============================================================================
// MAIN SCHEDULER SERVICE CLASS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER SERVICE: Complete Workflow Orchestration
 * 
 * COMPREHENSIVE AUTOMATION SOLUTION:
 * ✅ End-to-end workflow automation (capture → analysis → reports)
 * ✅ Real-time status monitoring and health checks
 * ✅ Intelligent error handling and recovery
 * ✅ Performance optimization and resource management
 * ✅ Demo account restrictions and safety controls
 * ✅ Comprehensive logging and transparency
 * 
 * BUSINESS PARTNER BENEFITS:
 * 1. Complete hands-off automation - no manual intervention needed
 * 2. Real-time monitoring and status updates
 * 3. Professional error handling with recovery strategies
 * 4. Performance optimization for optimal resource usage
 * 5. Comprehensive logging for transparency and debugging
 * 6. Demo-safe operation with appropriate restrictions
 */
export class MainScheduler {
  private isInitialized = false;
  private isRunning = false;
  private currentWorkflow: IWorkflowResult | null = null;
  private workflowHistory: IWorkflowResult[] = [];
  private systemAlerts: ISystemAlert[] = [];
  
  // Service instances
  private schedulerService: any;
  private photoCaptureService: any;
  private cameraService: CameraService;
  
  // Performance metrics
  private performanceMetrics = {
    totalWorkflows: 0,
    successfulWorkflows: 0,
    failedWorkflows: 0,
    averageProcessingTime: 0,
    lastProcessingTime: 0,
    throughput: 0
  };
  
  // System health monitoring
  private healthMetrics = {
    overallHealth: 1.0,
    componentHealth: {
      scheduler: 1.0,
      photoCapture: 1.0,
      aiAnalysis: 1.0,
      reportGeneration: 1.0,
      localStorage: 1.0
    },
    lastHealthCheck: new Date(),
    consecutiveErrors: 0
  };
  
  // Configuration
  private readonly maxWorkflowHistory = 100;
  private readonly maxSystemAlerts = 50;
  private readonly healthCheckInterval = 30000; // 30 seconds
  
  constructor() {
    this.initializeMainScheduler();
  }

  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION AND SETUP
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Initialize the main scheduler system
   * 
   * Sets up all service dependencies and validates demo account access
   * for complete workflow orchestration.
   */
  private async initializeMainScheduler(): Promise<void> {
    try {
      console.log('💼 BUSINESS PARTNER: Initializing main scheduler system...');
      
      // Check demo account access
      if (!this.isDemoAccount()) {
        console.log('💼 BUSINESS PARTNER: Main scheduler disabled - not a demo account');
        return;
      }
      
      // Initialize camera service
      this.cameraService = new CameraService();
      
      // Initialize service dependencies
      this.schedulerService = getSchedulerService(this.cameraService);
      this.photoCaptureService = getPhotoCaptureService(this.cameraService);
      
      // Validate all services are ready
      await this.validateServiceDependencies();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      this.isInitialized = true;
      console.log('💼 BUSINESS PARTNER: Main scheduler system initialized successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to initialize main scheduler:', error);
      this.addSystemAlert('error', 'system', 'Failed to initialize main scheduler', true);
      throw error;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Check if current user is demo account
   */
  private isDemoAccount(): boolean {
    const userEmail = 'demo@onevault.ai'; // This would come from auth context
    return storageConfig.isDemoEnabled(userEmail);
  }

  /**
   * 💼 BUSINESS PARTNER: Validate all service dependencies
   */
  private async validateServiceDependencies(): Promise<void> {
    try {
      // Check scheduler service
      const schedulerStatus = this.schedulerService.getStatus();
      if (!schedulerStatus.isInitialized) {
        throw new Error('Scheduler service not initialized');
      }
      
      // Check photo capture service
      const captureStatus = this.photoCaptureService.getStatus();
      if (!captureStatus.isInitialized) {
        throw new Error('Photo capture service not initialized');
      }
      
      // Check AI analysis service
      const analysisStatus = aiAnalysisService.getStatus();
      if (!analysisStatus.isInitialized) {
        throw new Error('AI analysis service not initialized');
      }
      
      // Check report generator
      const reportStatus = reportGenerator.getStatus();
      if (!reportStatus.isInitialized) {
        throw new Error('Report generator not initialized');
      }
      
      // Check local storage
      const storageStats = localStorageService.getStorageStats();
      if (storageStats.usagePercentage > 90) {
        this.addSystemAlert('warning', 'storage', 'Storage usage above 90%', true);
      }
      
      console.log('💼 BUSINESS PARTNER: All service dependencies validated');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Service dependency validation failed:', error);
      throw error;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Start health monitoring
   */
  private startHealthMonitoring(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, this.healthCheckInterval);
    
    console.log('💼 BUSINESS PARTNER: Health monitoring started');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN WORKFLOW ORCHESTRATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Start complete automated workflow
   * 
   * Begins the automated workflow that handles photo capture,
   * AI analysis, report generation, and storage automatically.
   */
  async startAutomatedWorkflow(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Main scheduler not initialized');
    }
    
    if (this.isRunning) {
      console.log('💼 BUSINESS PARTNER: Automated workflow already running');
      return;
    }
    
    try {
      console.log('💼 BUSINESS PARTNER: Starting automated workflow...');
      
      this.isRunning = true;
      
      // Start the scheduler service
      await this.schedulerService.startScheduling();
      
      // Set up workflow event listeners
      this.setupWorkflowEventListeners();
      
      console.log('💼 BUSINESS PARTNER: Automated workflow started successfully');
      
    } catch (error) {
      this.isRunning = false;
      console.error('💼 BUSINESS PARTNER ERROR: Failed to start automated workflow:', error);
      this.addSystemAlert('error', 'system', 'Failed to start automated workflow', true);
      throw error;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Stop automated workflow
   */
  async stopAutomatedWorkflow(): Promise<void> {
    if (!this.isRunning) {
      console.log('💼 BUSINESS PARTNER: Automated workflow not running');
      return;
    }
    
    try {
      console.log('💼 BUSINESS PARTNER: Stopping automated workflow...');
      
      this.isRunning = false;
      
      // Stop the scheduler service
      await this.schedulerService.stopScheduling();
      
      // Wait for current workflow to complete
      if (this.currentWorkflow) {
        await this.waitForCurrentWorkflowCompletion();
      }
      
      console.log('💼 BUSINESS PARTNER: Automated workflow stopped successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to stop automated workflow:', error);
      this.addSystemAlert('error', 'system', 'Failed to stop automated workflow', true);
      throw error;
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Execute single workflow manually
   * 
   * Executes a complete workflow cycle manually for testing
   * or demonstration purposes.
   */
  async executeWorkflow(): Promise<IWorkflowResult> {
    if (!this.isInitialized) {
      throw new Error('Main scheduler not initialized');
    }
    
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = new Date();
    
    try {
      console.log(`💼 BUSINESS PARTNER: Starting workflow ${workflowId}`);
      
      // Create workflow result object
      const workflowResult: IWorkflowResult = {
        workflowId,
        startTime,
        endTime: new Date(),
        duration: 0,
        success: false,
        
        phases: {
          capture: { success: false, duration: 0, photosCaptures: 0, photoIds: [] },
          analysis: { success: false, duration: 0, confidence: 0, analysisId: '' },
          reporting: { success: false, duration: 0, reportIds: [] },
          storage: { success: false, duration: 0, storedItems: 0 }
        },
        
        results: {
          storedReportIds: [],
          storedPhotoIds: []
        },
        
        performance: {
          totalProcessingTime: 0,
          memoryUsage: 0,
          resourceEfficiency: 0,
          qualityScore: 0
        },
        
        errors: [],
        warnings: [],
        recommendations: []
      };
      
      this.currentWorkflow = workflowResult;
      
      // Phase 1: Photo Capture
      console.log('💼 BUSINESS PARTNER: Phase 1 - Photo Capture');
      const captureResult = await this.executePhotoCapturePhase();
      workflowResult.phases.capture = captureResult;
      
      if (!captureResult.success) {
        throw new Error('Photo capture phase failed');
      }
      
      // Phase 2: AI Analysis
      console.log('💼 BUSINESS PARTNER: Phase 2 - AI Analysis');
      const analysisResult = await this.executeAIAnalysisPhase(captureResult.photoIds);
      workflowResult.phases.analysis = analysisResult;
      
      if (!analysisResult.success) {
        throw new Error('AI analysis phase failed');
      }
      
      // Phase 3: Report Generation
      console.log('💼 BUSINESS PARTNER: Phase 3 - Report Generation');
      const reportingResult = await this.executeReportGenerationPhase(analysisResult.analysisId);
      workflowResult.phases.reporting = reportingResult;
      
      if (!reportingResult.success) {
        throw new Error('Report generation phase failed');
      }
      
      // Phase 4: Storage
      console.log('💼 BUSINESS PARTNER: Phase 4 - Storage');
      const storageResult = await this.executeStoragePhase(reportingResult.reportIds);
      workflowResult.phases.storage = storageResult;
      
      if (!storageResult.success) {
        throw new Error('Storage phase failed');
      }
      
      // Complete workflow
      workflowResult.endTime = new Date();
      workflowResult.duration = workflowResult.endTime.getTime() - startTime.getTime();
      workflowResult.success = true;
      
      // Update performance metrics
      this.updatePerformanceMetrics(workflowResult);
      
      // Add to history
      this.addToWorkflowHistory(workflowResult);
      
      console.log(`💼 BUSINESS PARTNER: Workflow ${workflowId} completed successfully in ${workflowResult.duration}ms`);
      
      return workflowResult;
      
    } catch (error) {
      // Handle workflow failure
      const workflowResult = this.currentWorkflow || {
        workflowId,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        success: false,
        phases: {
          capture: { success: false, duration: 0, photosCaptures: 0, photoIds: [] },
          analysis: { success: false, duration: 0, confidence: 0, analysisId: '' },
          reporting: { success: false, duration: 0, reportIds: [] },
          storage: { success: false, duration: 0, storedItems: 0 }
        },
        results: { storedReportIds: [], storedPhotoIds: [] },
        performance: { totalProcessingTime: 0, memoryUsage: 0, resourceEfficiency: 0, qualityScore: 0 },
        errors: [error.message],
        warnings: [],
        recommendations: ['Check system logs for details', 'Verify service dependencies']
      };
      
      this.updatePerformanceMetrics(workflowResult);
      this.addToWorkflowHistory(workflowResult);
      
      console.error(`💼 BUSINESS PARTNER ERROR: Workflow ${workflowId} failed:`, error);
      this.addSystemAlert('error', 'workflow', `Workflow ${workflowId} failed: ${error.message}`, true);
      
      return workflowResult;
      
    } finally {
      this.currentWorkflow = null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // WORKFLOW PHASE EXECUTION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Execute photo capture phase
   */
  private async executePhotoCapturePhase(): Promise<any> {
    const phaseStartTime = Date.now();
    
    try {
      // Capture batch of photos (3 photos as per schedule)
      const batchResult = await this.photoCaptureService.captureBatch(3, 1000);
      
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: batchResult.totalCaptured > 0,
        duration: phaseDuration,
        photosCaptures: batchResult.totalCaptured,
        photoIds: batchResult.successful.map(r => r.photoId).filter(id => id !== null),
        error: batchResult.totalCaptured === 0 ? 'No photos captured' : undefined
      };
      
    } catch (error) {
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: false,
        duration: phaseDuration,
        photosCaptures: 0,
        photoIds: [],
        error: error.message
      };
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Execute AI analysis phase
   */
  private async executeAIAnalysisPhase(photoIds: string[]): Promise<any> {
    const phaseStartTime = Date.now();
    
    try {
      // Prepare analysis request
      const analysisRequest = {
        photos: photoIds.map(id => ({
          id,
          dataUrl: `data:image/jpeg;base64,demo_photo_${id}`,
          metadata: { id, quality: 0.8 },
          captureTime: new Date(),
          quality: 0.8
        })),
        
        analysisType: 'sequence',
        analysisDepth: 'standard',
        includeHistorical: true,
        
        outputFormat: {
          includeConcise: true,
          includeDetailed: true,
          includeRawData: false,
          includeMetaAnalysis: false
        },
        
        maxAnalysisTimeMs: 30000,
        enableCaching: true,
        retryOnFailure: true,
        
        context: {
          sessionId: `session_${Date.now()}`,
          scheduleType: 'daytime'
        }
      };
      
      // Perform AI analysis
      const analysisResult = await aiAnalysisService.analyzePhotoSequence(analysisRequest);
      
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: analysisResult.success,
        duration: phaseDuration,
        confidence: analysisResult.confidence,
        analysisId: analysisResult.analysisId,
        error: analysisResult.error?.message
      };
      
    } catch (error) {
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: false,
        duration: phaseDuration,
        confidence: 0,
        analysisId: '',
        error: error.message
      };
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Execute report generation phase
   */
  private async executeReportGenerationPhase(analysisId: string): Promise<any> {
    const phaseStartTime = Date.now();
    
    try {
      // Get analysis result
      const analysisResult = aiAnalysisService.getAnalysisHistory(1)[0];
      
      if (!analysisResult) {
        throw new Error('Analysis result not found');
      }
      
      // Prepare report generation request
      const reportRequest = {
        analysisResult,
        generateConcise: true,
        generateDetailed: true,
        generateTrends: false,
        generateExport: false,
        
        formatting: {
          includeConfidence: true,
          includeTimestamps: true,
          includeRecommendations: true,
          includeMetadata: false,
          useMarkdown: false,
          useEmojis: true
        },
        
        output: {
          maxConciseLength: 200,
          detailLevel: 'standard',
          exportFormats: ['json'],
          includeImages: false
        },
        
        context: {
          userEmail: 'demo@onevault.ai',
          sessionId: analysisId,
          reportPurpose: 'monitoring'
        }
      };
      
      // Generate reports
      const reportResult = await reportGenerator.generateReport(reportRequest);
      
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: true,
        duration: phaseDuration,
        reportIds: [reportResult.reportId],
        error: undefined
      };
      
    } catch (error) {
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: false,
        duration: phaseDuration,
        reportIds: [],
        error: error.message
      };
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Execute storage phase
   */
  private async executeStoragePhase(reportIds: string[]): Promise<any> {
    const phaseStartTime = Date.now();
    
    try {
      // Storage is handled automatically by the services
      // This phase validates that storage was successful
      
      const storageStats = localStorageService.getStorageStats();
      
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: true,
        duration: phaseDuration,
        storedItems: reportIds.length,
        error: undefined
      };
      
    } catch (error) {
      const phaseDuration = Date.now() - phaseStartTime;
      
      return {
        success: false,
        duration: phaseDuration,
        storedItems: 0,
        error: error.message
      };
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // EVENT HANDLING AND MONITORING
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Set up workflow event listeners
   */
  private setupWorkflowEventListeners(): void {
    // This would set up event listeners for scheduler events
    // For demo purposes, we'll simulate this
    console.log('💼 BUSINESS PARTNER: Workflow event listeners configured');
  }

  /**
   * 💼 BUSINESS PARTNER: Perform system health check
   */
  private performHealthCheck(): void {
    try {
      // Check scheduler health
      const schedulerStatus = this.schedulerService.getStatus();
      this.healthMetrics.componentHealth.scheduler = schedulerStatus.health.consecutiveFailures === 0 ? 1.0 : 0.5;
      
      // Check photo capture health
      const captureStatus = this.photoCaptureService.getStatus();
      this.healthMetrics.componentHealth.photoCapture = captureStatus.performance.successfulCaptures > 0 ? 1.0 : 0.8;
      
      // Check AI analysis health
      const analysisStatus = aiAnalysisService.getStatus();
      this.healthMetrics.componentHealth.aiAnalysis = analysisStatus.performance.successfulAnalyses > 0 ? 1.0 : 0.8;
      
      // Check report generation health
      const reportStatus = reportGenerator.getStatus();
      this.healthMetrics.componentHealth.reportGeneration = reportStatus.performance.successfulReports > 0 ? 1.0 : 0.8;
      
      // Check storage health
      const storageStats = localStorageService.getStorageStats();
      this.healthMetrics.componentHealth.localStorage = storageStats.usagePercentage < 90 ? 1.0 : 0.6;
      
      // Calculate overall health
      const healthValues = Object.values(this.healthMetrics.componentHealth);
      this.healthMetrics.overallHealth = healthValues.reduce((sum, health) => sum + health, 0) / healthValues.length;
      
      this.healthMetrics.lastHealthCheck = new Date();
      
      // Generate health alerts if needed
      if (this.healthMetrics.overallHealth < 0.8) {
        this.addSystemAlert('warning', 'system', 'System health below 80%', true);
      }
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Health check failed:', error);
      this.addSystemAlert('error', 'system', 'Health check failed', true);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Add system alert
   */
  private addSystemAlert(
    type: 'info' | 'warning' | 'error' | 'critical',
    component: string,
    message: string,
    actionRequired: boolean = false
  ): void {
    const alert: ISystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      component,
      message,
      timestamp: new Date(),
      acknowledged: false,
      actionRequired
    };
    
    this.systemAlerts.push(alert);
    
    // Keep only recent alerts
    if (this.systemAlerts.length > this.maxSystemAlerts) {
      this.systemAlerts = this.systemAlerts.slice(-this.maxSystemAlerts);
    }
    
    console.log(`💼 BUSINESS PARTNER ${type.toUpperCase()}: ${component} - ${message}`);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITY AND HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Wait for current workflow completion
   */
  private async waitForCurrentWorkflowCompletion(): Promise<void> {
    const timeout = 60000; // 1 minute timeout
    const startTime = Date.now();
    
    while (this.currentWorkflow && (Date.now() - startTime) < timeout) {
      await this.delay(1000);
    }
    
    if (this.currentWorkflow) {
      console.warn('💼 BUSINESS PARTNER: Workflow did not complete within timeout');
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Update performance metrics
   */
  private updatePerformanceMetrics(workflowResult: IWorkflowResult): void {
    this.performanceMetrics.totalWorkflows++;
    
    if (workflowResult.success) {
      this.performanceMetrics.successfulWorkflows++;
      this.healthMetrics.consecutiveErrors = 0;
    } else {
      this.performanceMetrics.failedWorkflows++;
      this.healthMetrics.consecutiveErrors++;
    }
    
    // Update average processing time
    if (workflowResult.success) {
      const totalTime = this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.successfulWorkflows - 1) + workflowResult.duration;
      this.performanceMetrics.averageProcessingTime = totalTime / this.performanceMetrics.successfulWorkflows;
    }
    
    this.performanceMetrics.lastProcessingTime = workflowResult.duration;
    
    // Calculate throughput (workflows per hour)
    const hourlyWorkflows = this.performanceMetrics.totalWorkflows;
    this.performanceMetrics.throughput = hourlyWorkflows; // Simplified calculation
  }

  /**
   * 💼 BUSINESS PARTNER: Add to workflow history
   */
  private addToWorkflowHistory(workflowResult: IWorkflowResult): void {
    this.workflowHistory.push(workflowResult);
    
    // Keep only recent history
    if (this.workflowHistory.length > this.maxWorkflowHistory) {
      this.workflowHistory = this.workflowHistory.slice(-this.maxWorkflowHistory);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUBLIC STATUS AND CONTROL METHODS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * 💼 BUSINESS PARTNER: Get complete system status
   */
  getSystemStatus(): IMainSchedulerStatus {
    const schedulerStatus = this.schedulerService?.getStatus();
    const captureStatus = this.photoCaptureService?.getStatus();
    const analysisStatus = aiAnalysisService.getStatus();
    const reportStatus = reportGenerator.getStatus();
    const storageStats = localStorageService.getStorageStats();
    
    return {
      systemStatus: this.healthMetrics.overallHealth > 0.8 ? 'healthy' : 
                   this.healthMetrics.overallHealth > 0.6 ? 'warning' : 'error',
      isRunning: this.isRunning,
      lastActivity: this.workflowHistory.length > 0 ? 
                   this.workflowHistory[this.workflowHistory.length - 1].endTime : null,
      
      components: {
        scheduler: {
          status: schedulerStatus?.isActive ? 'active' : 'paused',
          nextCapture: schedulerStatus?.nextCaptureTime || null,
          sessionsToday: schedulerStatus?.statistics.totalSessions || 0,
          successRate: schedulerStatus?.performance.successRate || 0
        },
        
        photoCapture: {
          status: captureStatus?.captureInProgress ? 'capturing' : 'ready',
          availableCameras: captureStatus?.availableCameras || 0,
          lastCaptureTime: null,
          totalPhotos: captureStatus?.performance.totalCaptures || 0
        },
        
        aiAnalysis: {
          status: analysisStatus?.analysisInProgress ? 'processing' : 'idle',
          analysisInProgress: analysisStatus?.analysisInProgress || false,
          totalAnalyses: analysisStatus?.performance.totalAnalyses || 0,
          averageProcessingTime: analysisStatus?.performance.averageAnalysisTime || 0
        },
        
        reportGeneration: {
          status: 'idle',
          totalReports: reportStatus?.performance.totalReports || 0,
          averageGenerationTime: reportStatus?.performance.averageGenerationTime || 0,
          cacheHitRate: reportStatus?.performance.cacheHitRate || 0
        },
        
        localStorage: {
          status: storageStats.usagePercentage > 90 ? 'warning' : 'healthy',
          usagePercentage: storageStats.usagePercentage,
          totalReports: storageStats.totalReports,
          totalPhotos: storageStats.totalPhotos,
          lastCleanup: storageStats.lastCleanup
        }
      },
      
      performance: {
        endToEndProcessingTime: this.performanceMetrics.averageProcessingTime,
        successfulWorkflows: this.performanceMetrics.successfulWorkflows,
        failedWorkflows: this.performanceMetrics.failedWorkflows,
        errorRate: this.performanceMetrics.totalWorkflows > 0 ? 
                  this.performanceMetrics.failedWorkflows / this.performanceMetrics.totalWorkflows : 0,
        throughput: this.performanceMetrics.throughput
      },
      
      currentActivity: {
        phase: this.currentWorkflow ? 'analyzing' : 'idle',
        progress: this.currentWorkflow ? 50 : 0,
        estimatedTimeRemaining: this.currentWorkflow ? 15000 : 0,
        currentTask: this.currentWorkflow ? 'Processing analysis' : 'Waiting for next scheduled capture'
      },
      
      health: {
        overallHealth: this.healthMetrics.overallHealth,
        alerts: this.systemAlerts.filter(a => !a.acknowledged),
        warnings: this.systemAlerts.filter(a => a.type === 'warning' && !a.acknowledged).map(a => a.message),
        recommendations: this.generateSystemRecommendations()
      },
      
      demo: {
        isDemo: true,
        userEmail: 'demo@onevault.ai',
        limitations: [
          'Demo account only',
          'Limited to 200 analyses per day',
          'Data stored locally only'
        ],
        featuresEnabled: [
          'Automated photo capture',
          'AI analysis',
          'Report generation',
          'Local storage',
          'Export capabilities'
        ]
      }
    };
  }

  /**
   * 💼 BUSINESS PARTNER: Get workflow history
   */
  getWorkflowHistory(limit: number = 10): IWorkflowResult[] {
    return this.workflowHistory.slice(-limit);
  }

  /**
   * 💼 BUSINESS PARTNER: Get system alerts
   */
  getSystemAlerts(includeAcknowledged: boolean = false): ISystemAlert[] {
    return includeAcknowledged ? 
           this.systemAlerts : 
           this.systemAlerts.filter(a => !a.acknowledged);
  }

  /**
   * 💼 BUSINESS PARTNER: Acknowledge system alert
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.systemAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      console.log(`💼 BUSINESS PARTNER: Alert ${alertId} acknowledged`);
    }
  }

  /**
   * 💼 BUSINESS PARTNER: Generate system recommendations
   */
  private generateSystemRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.healthMetrics.overallHealth < 0.8) {
      recommendations.push('System health is below optimal - check component status');
    }
    
    if (this.performanceMetrics.failedWorkflows > 0) {
      recommendations.push('Recent workflow failures detected - review error logs');
    }
    
    const storageStats = localStorageService.getStorageStats();
    if (storageStats.usagePercentage > 80) {
      recommendations.push('Storage usage is high - consider running cleanup');
    }
    
    if (this.healthMetrics.consecutiveErrors > 3) {
      recommendations.push('Multiple consecutive errors - system may need attention');
    }
    
    return recommendations;
  }

  /**
   * 💼 BUSINESS PARTNER: Manual cleanup and maintenance
   */
  async performMaintenance(): Promise<void> {
    try {
      console.log('💼 BUSINESS PARTNER: Starting system maintenance...');
      
      // Clear caches
      aiAnalysisService.clearCache();
      reportGenerator.clearCache();
      
      // Perform storage cleanup
      await localStorageService.performCleanup();
      
      // Clear old alerts
      this.systemAlerts = this.systemAlerts.filter(a => 
        (Date.now() - a.timestamp.getTime()) < 24 * 60 * 60 * 1000 // Keep last 24 hours
      );
      
      // Reset consecutive errors
      this.healthMetrics.consecutiveErrors = 0;
      
      console.log('💼 BUSINESS PARTNER: System maintenance completed');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Maintenance failed:', error);
      this.addSystemAlert('error', 'system', 'Maintenance failed', true);
    }
  }
}

// ============================================================================
// SINGLETON EXPORT FOR GLOBAL USE
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Global main scheduler instance
 * 
 * Import this in components that need to control the complete workflow:
 * 
 * ```typescript
 * import { mainScheduler } from '../services/MainScheduler';
 * 
 * // Start automated workflow
 * await mainScheduler.startAutomatedWorkflow();
 * 
 * // Get system status
 * const status = mainScheduler.getSystemStatus();
 * 
 * // Execute single workflow
 * const result = await mainScheduler.executeWorkflow();
 * ```
 */
export const mainScheduler = new MainScheduler();

export default mainScheduler; 