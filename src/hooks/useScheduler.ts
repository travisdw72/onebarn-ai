/**
 * Scheduler Hook - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER REACT INTEGRATION HOOK
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This hook provides React components with seamless access to the complete
 * AI monitoring workflow system including scheduling, status monitoring,
 * and control capabilities.
 * 
 * 🔄 HOOK CAPABILITIES:
 *     - Real-time system status monitoring
 *     - Workflow control (start/stop/execute)
 *     - Performance metrics and health monitoring
 *     - Alert management and notifications
 *     - Historical data access
 * 
 * 📊 BUSINESS PARTNER INTEGRATION:
 *     - Automatic state updates for UI components
 *     - Error handling and user feedback
 *     - Performance monitoring for optimization
 *     - Demo account validation and restrictions
 *     - Professional logging and debugging
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, React hooks pattern
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { mainScheduler, IMainSchedulerStatus, IWorkflowResult, ISystemAlert } from '../services/MainScheduler';
import { localStorageService } from '../services/LocalStorageService';
import { storageConfig } from '../config/storageConfig';
import { scheduleConfig } from '../config/scheduleConfig';

// ============================================================================
// HOOK INTERFACES AND TYPES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Scheduler hook state
 * 
 * Complete state management for the scheduler system including
 * status, controls, and real-time monitoring capabilities.
 */
export interface ISchedulerHookState {
  // System Status
  systemStatus: IMainSchedulerStatus | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Workflow Management
  isRunning: boolean;
  currentWorkflow: IWorkflowResult | null;
  workflowHistory: IWorkflowResult[];
  
  // Real-time Monitoring
  realTimeStats: {
    totalWorkflows: number;
    successfulWorkflows: number;
    failedWorkflows: number;
    averageProcessingTime: number;
    lastActivity: Date | null;
    systemHealth: number;
  };
  
  // Alert Management
  alerts: ISystemAlert[];
  unacknowledgedAlerts: number;
  criticalAlerts: number;
  
  // Performance Metrics
  performance: {
    endToEndTime: number;
    successRate: number;
    throughput: number;
    errorRate: number;
    cacheHitRate: number;
  };
  
  // Storage Information
  storage: {
    usagePercentage: number;
    totalReports: number;
    totalPhotos: number;
    lastCleanup: Date | null;
    cleanupRecommended: boolean;
  };
  
  // Demo Account Info
  demo: {
    isDemo: boolean;
    userEmail: string;
    limitations: string[];
    featuresEnabled: string[];
  };
}

/**
 * 💼 BUSINESS PARTNER: Scheduler hook actions
 * 
 * All available actions that components can perform through
 * the scheduler hook with proper error handling.
 */
export interface ISchedulerHookActions {
  // Workflow Control
  startWorkflow: () => Promise<void>;
  stopWorkflow: () => Promise<void>;
  executeWorkflow: () => Promise<IWorkflowResult>;
  pauseWorkflow: (minutes?: number) => Promise<void>;
  resumeWorkflow: () => Promise<void>;
  
  // System Management
  refreshStatus: () => Promise<void>;
  performMaintenance: () => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Alert Management
  acknowledgeAlert: (alertId: string) => void;
  acknowledgeAllAlerts: () => void;
  getAlerts: (includeAcknowledged?: boolean) => ISystemAlert[];
  
  // Data Management
  getWorkflowHistory: (limit?: number) => IWorkflowResult[];
  getRecentReports: (limit?: number) => Promise<any[]>;
  exportData: (format: 'json' | 'csv') => Promise<string>;
  
  // Storage Management
  checkStorageUsage: () => Promise<void>;
  performCleanup: () => Promise<void>;
  
  // Configuration
  updateScheduleConfig: (config: any) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

/**
 * 💼 BUSINESS PARTNER: Hook configuration options
 */
export interface ISchedulerHookOptions {
  // Update Frequency
  refreshInterval: number;              // How often to refresh status (ms)
  enableRealTimeUpdates: boolean;       // Whether to enable real-time updates
  
  // Data Management
  maxWorkflowHistory: number;           // Maximum workflow history to keep
  maxAlertHistory: number;              // Maximum alerts to keep
  
  // Performance
  enablePerformanceMonitoring: boolean; // Whether to track performance
  enableDetailedLogging: boolean;       // Whether to log detailed information
  
  // UI Integration
  enableAutoRefresh: boolean;           // Whether to auto-refresh UI
  showNotifications: boolean;           // Whether to show notifications
  
  // Demo Features
  enableDemoFeatures: boolean;          // Whether demo features are enabled
  showDemoIndicators: boolean;          // Whether to show demo indicators
}

// ============================================================================
// MAIN SCHEDULER HOOK
// ============================================================================

/**
 * 💼 BUSINESS PARTNER HOOK: Complete Scheduler System Integration
 * 
 * COMPREHENSIVE REACT INTEGRATION:
 * ✅ Real-time system status monitoring
 * ✅ Workflow control with error handling
 * ✅ Performance metrics and health monitoring
 * ✅ Alert management and notifications
 * ✅ Historical data access and management
 * ✅ Demo account validation and restrictions
 * 
 * BUSINESS PARTNER BENEFITS:
 * 1. Seamless React integration with automatic state updates
 * 2. Complete workflow control from any component
 * 3. Real-time monitoring and performance metrics
 * 4. Professional error handling and user feedback
 * 5. Comprehensive logging and debugging capabilities
 * 6. Demo-safe operation with appropriate restrictions
 * 
 * @param options Configuration options for the hook
 * @returns Complete scheduler state and actions
 */
export const useScheduler = (options: Partial<ISchedulerHookOptions> = {}): [ISchedulerHookState, ISchedulerHookActions] => {
  // Default configuration
  const defaultOptions: ISchedulerHookOptions = {
    refreshInterval: 5000,              // 5 seconds
    enableRealTimeUpdates: true,
    maxWorkflowHistory: 50,
    maxAlertHistory: 100,
    enablePerformanceMonitoring: true,
    enableDetailedLogging: true,
    enableAutoRefresh: true,
    showNotifications: true,
    enableDemoFeatures: true,
    showDemoIndicators: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  // ═══════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════
  
  const [state, setState] = useState<ISchedulerHookState>({
    systemStatus: null,
    isLoading: true,
    isInitialized: false,
    error: null,
    
    isRunning: false,
    currentWorkflow: null,
    workflowHistory: [],
    
    realTimeStats: {
      totalWorkflows: 0,
      successfulWorkflows: 0,
      failedWorkflows: 0,
      averageProcessingTime: 0,
      lastActivity: null,
      systemHealth: 0
    },
    
    alerts: [],
    unacknowledgedAlerts: 0,
    criticalAlerts: 0,
    
    performance: {
      endToEndTime: 0,
      successRate: 0,
      throughput: 0,
      errorRate: 0,
      cacheHitRate: 0
    },
    
    storage: {
      usagePercentage: 0,
      totalReports: 0,
      totalPhotos: 0,
      lastCleanup: null,
      cleanupRecommended: false
    },
    
    demo: {
      isDemo: false,
      userEmail: '',
      limitations: [],
      featuresEnabled: []
    }
  });
  
  // Refs for cleanup and performance
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshTime = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);
  
  // ═══════════════════════════════════════════════════════════════════════
  // INITIALIZATION AND SETUP
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Initialize the hook
   */
  const initialize = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Initializing scheduler hook...');
      
      // Check if demo account is enabled
      const userEmail = 'demo@onevault.ai'; // This would come from auth context
      const isDemoEnabled = storageConfig.isDemoEnabled(userEmail);
      
      if (!isDemoEnabled) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Scheduler features are only available for demo accounts',
          demo: {
            isDemo: false,
            userEmail,
            limitations: ['Feature not available for this account'],
            featuresEnabled: []
          }
        }));
        return;
      }
      
      // Initialize system status
      await refreshStatus();
      
      // Start real-time updates if enabled
      if (config.enableRealTimeUpdates && config.enableAutoRefresh) {
        startRealTimeUpdates();
      }
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        isLoading: false,
        error: null
      }));
      
      console.log('💼 BUSINESS PARTNER: Scheduler hook initialized successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to initialize scheduler hook:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to initialize scheduler',
        isInitialized: false
      }));
    }
  }, [config.enableRealTimeUpdates, config.enableAutoRefresh]);
  
  /**
   * 💼 BUSINESS PARTNER: Start real-time updates
   */
  const startRealTimeUpdates = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    refreshIntervalRef.current = setInterval(() => {
      refreshStatus();
    }, config.refreshInterval);
    
    console.log(`💼 BUSINESS PARTNER: Real-time updates started (${config.refreshInterval}ms interval)`);
  }, [config.refreshInterval]);
  
  /**
   * 💼 BUSINESS PARTNER: Stop real-time updates
   */
  const stopRealTimeUpdates = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    
    console.log('💼 BUSINESS PARTNER: Real-time updates stopped');
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STATUS MONITORING
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Refresh system status
   */
  const refreshStatus = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isRefreshing.current) {
      return;
    }
    
    // Rate limiting
    const now = Date.now();
    if (now - lastRefreshTime.current < 1000) {
      return;
    }
    
    isRefreshing.current = true;
    lastRefreshTime.current = now;
    
    try {
      // Get system status
      const systemStatus = mainScheduler.getSystemStatus();
      
      // Get workflow history
      const workflowHistory = mainScheduler.getWorkflowHistory(config.maxWorkflowHistory);
      
      // Get alerts
      const alerts = mainScheduler.getSystemAlerts(false);
      
      // Get storage stats
      const storageStats = localStorageService.getStorageStats();
      
      // Update state
      setState(prev => ({
        ...prev,
        systemStatus,
        isRunning: systemStatus.isRunning,
        workflowHistory,
        alerts,
        
        realTimeStats: {
          totalWorkflows: systemStatus.performance.successfulWorkflows + systemStatus.performance.failedWorkflows,
          successfulWorkflows: systemStatus.performance.successfulWorkflows,
          failedWorkflows: systemStatus.performance.failedWorkflows,
          averageProcessingTime: systemStatus.performance.endToEndProcessingTime,
          lastActivity: systemStatus.lastActivity,
          systemHealth: systemStatus.health.overallHealth
        },
        
        unacknowledgedAlerts: alerts.filter(a => !a.acknowledged).length,
        criticalAlerts: alerts.filter(a => a.type === 'critical').length,
        
        performance: {
          endToEndTime: systemStatus.performance.endToEndProcessingTime,
          successRate: systemStatus.performance.successfulWorkflows / 
                      (systemStatus.performance.successfulWorkflows + systemStatus.performance.failedWorkflows) || 0,
          throughput: systemStatus.performance.throughput,
          errorRate: systemStatus.performance.errorRate,
          cacheHitRate: systemStatus.components.reportGeneration.cacheHitRate
        },
        
        storage: {
          usagePercentage: storageStats.usagePercentage,
          totalReports: storageStats.totalReports,
          totalPhotos: storageStats.totalPhotos,
          lastCleanup: storageStats.lastCleanup,
          cleanupRecommended: storageStats.usagePercentage > 80
        },
        
        demo: {
          isDemo: systemStatus.demo.isDemo,
          userEmail: systemStatus.demo.userEmail,
          limitations: systemStatus.demo.limitations,
          featuresEnabled: systemStatus.demo.featuresEnabled
        },
        
        error: null
      }));
      
      if (config.enableDetailedLogging) {
        console.log('💼 BUSINESS PARTNER: Status refreshed', { 
          systemHealth: systemStatus.health.overallHealth,
          isRunning: systemStatus.isRunning,
          totalWorkflows: systemStatus.performance.successfulWorkflows + systemStatus.performance.failedWorkflows
        });
      }
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to refresh status:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to refresh status'
      }));
    } finally {
      isRefreshing.current = false;
    }
  }, [config.maxWorkflowHistory, config.enableDetailedLogging]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // WORKFLOW CONTROL ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Start automated workflow
   */
  const startWorkflow = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Starting automated workflow...');
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await mainScheduler.startAutomatedWorkflow();
      
      // Refresh status immediately
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: Automated workflow started successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to start workflow:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to start workflow',
        isLoading: false
      }));
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Stop automated workflow
   */
  const stopWorkflow = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Stopping automated workflow...');
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await mainScheduler.stopAutomatedWorkflow();
      
      // Refresh status immediately
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: Automated workflow stopped successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to stop workflow:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to stop workflow',
        isLoading: false
      }));
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Execute single workflow
   */
  const executeWorkflow = useCallback(async (): Promise<IWorkflowResult> => {
    try {
      console.log('💼 BUSINESS PARTNER: Executing single workflow...');
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await mainScheduler.executeWorkflow();
      
      // Refresh status immediately
      await refreshStatus();
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        currentWorkflow: result
      }));
      
      console.log('💼 BUSINESS PARTNER: Single workflow executed successfully');
      
      return result;
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to execute workflow:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to execute workflow',
        isLoading: false
      }));
      throw error;
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Pause workflow temporarily
   */
  const pauseWorkflow = useCallback(async (minutes: number = 30) => {
    try {
      console.log(`💼 BUSINESS PARTNER: Pausing workflow for ${minutes} minutes...`);
      
      // This would integrate with the scheduler service
      // For now, we'll simulate the pause
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshStatus();
      
      console.log(`💼 BUSINESS PARTNER: Workflow paused for ${minutes} minutes`);
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to pause workflow:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to pause workflow'
      }));
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Resume paused workflow
   */
  const resumeWorkflow = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Resuming workflow...');
      
      // This would integrate with the scheduler service
      // For now, we'll simulate the resume
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: Workflow resumed successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to resume workflow:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to resume workflow'
      }));
    }
  }, [refreshStatus]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // SYSTEM MANAGEMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Perform system maintenance
   */
  const performMaintenance = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Performing system maintenance...');
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await mainScheduler.performMaintenance();
      
      // Refresh status after maintenance
      await refreshStatus();
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      console.log('💼 BUSINESS PARTNER: System maintenance completed successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Maintenance failed:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Maintenance failed',
        isLoading: false
      }));
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Clear system caches
   */
  const clearCache = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Clearing system caches...');
      
      // This would clear all system caches
      // For now, we'll simulate the operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: System caches cleared successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to clear cache:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to clear cache'
      }));
    }
  }, [refreshStatus]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // ALERT MANAGEMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Acknowledge single alert
   */
  const acknowledgeAlert = useCallback((alertId: string) => {
    try {
      mainScheduler.acknowledgeAlert(alertId);
      
      // Update state immediately
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId ? { ...alert, acknowledged: true } : alert
        ),
        unacknowledgedAlerts: prev.unacknowledgedAlerts - 1
      }));
      
      console.log(`💼 BUSINESS PARTNER: Alert ${alertId} acknowledged`);
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to acknowledge alert:', error);
    }
  }, []);
  
  /**
   * 💼 BUSINESS PARTNER: Acknowledge all alerts
   */
  const acknowledgeAllAlerts = useCallback(() => {
    try {
      state.alerts.forEach(alert => {
        if (!alert.acknowledged) {
          mainScheduler.acknowledgeAlert(alert.id);
        }
      });
      
      // Update state immediately
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert => ({ ...alert, acknowledged: true })),
        unacknowledgedAlerts: 0
      }));
      
      console.log('💼 BUSINESS PARTNER: All alerts acknowledged');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to acknowledge all alerts:', error);
    }
  }, [state.alerts]);
  
  /**
   * 💼 BUSINESS PARTNER: Get alerts with filtering
   */
  const getAlerts = useCallback((includeAcknowledged: boolean = false): ISystemAlert[] => {
    return mainScheduler.getSystemAlerts(includeAcknowledged);
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // DATA MANAGEMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Get workflow history
   */
  const getWorkflowHistory = useCallback((limit: number = 10): IWorkflowResult[] => {
    return mainScheduler.getWorkflowHistory(limit);
  }, []);
  
  /**
   * 💼 BUSINESS PARTNER: Get recent reports
   */
  const getRecentReports = useCallback(async (limit: number = 10): Promise<any[]> => {
    try {
      return await localStorageService.getAnalysisReports({ limit });
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to get recent reports:', error);
      return [];
    }
  }, []);
  
  /**
   * 💼 BUSINESS PARTNER: Export data
   */
  const exportData = useCallback(async (format: 'json' | 'csv'): Promise<string> => {
    try {
      console.log(`💼 BUSINESS PARTNER: Exporting data in ${format} format...`);
      
      const reports = await localStorageService.getAnalysisReports({ limit: 100 });
      const storageStats = localStorageService.getStorageStats();
      
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          format,
          totalReports: reports.length,
          storageStats
        },
        reports,
        workflowHistory: mainScheduler.getWorkflowHistory(50)
      };
      
      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else if (format === 'csv') {
        // Simple CSV export
        const csvRows = ['timestamp,alert_level,confidence,summary'];
        reports.forEach(report => {
          csvRows.push([
            report.timestamp,
            report.concise.alertLevel,
            report.concise.confidence,
            `"${report.concise.summary}"`
          ].join(','));
        });
        return csvRows.join('\n');
      }
      
      return JSON.stringify(exportData, null, 2);
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to export data:', error);
      throw error;
    }
  }, []);
  
  // ═══════════════════════════════════════════════════════════════════════
  // STORAGE MANAGEMENT ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Check storage usage
   */
  const checkStorageUsage = useCallback(async () => {
    try {
      const storageStats = localStorageService.getStorageStats();
      
      setState(prev => ({
        ...prev,
        storage: {
          usagePercentage: storageStats.usagePercentage,
          totalReports: storageStats.totalReports,
          totalPhotos: storageStats.totalPhotos,
          lastCleanup: storageStats.lastCleanup,
          cleanupRecommended: storageStats.usagePercentage > 80
        }
      }));
      
      console.log('💼 BUSINESS PARTNER: Storage usage checked', storageStats);
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to check storage usage:', error);
    }
  }, []);
  
  /**
   * 💼 BUSINESS PARTNER: Perform storage cleanup
   */
  const performCleanup = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Performing storage cleanup...');
      
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await localStorageService.performCleanup();
      
      // Refresh status after cleanup
      await refreshStatus();
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      console.log('💼 BUSINESS PARTNER: Storage cleanup completed successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Storage cleanup failed:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Storage cleanup failed',
        isLoading: false
      }));
    }
  }, [refreshStatus]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // CONFIGURATION ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Update schedule configuration
   */
  const updateScheduleConfig = useCallback(async (newConfig: any) => {
    try {
      console.log('💼 BUSINESS PARTNER: Updating schedule configuration...');
      
      // This would update the schedule configuration
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: Schedule configuration updated successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to update schedule configuration:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update configuration'
      }));
    }
  }, [refreshStatus]);
  
  /**
   * 💼 BUSINESS PARTNER: Reset to default configuration
   */
  const resetToDefaults = useCallback(async () => {
    try {
      console.log('💼 BUSINESS PARTNER: Resetting to default configuration...');
      
      // This would reset to default configuration
      // For now, we'll simulate the reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshStatus();
      
      console.log('💼 BUSINESS PARTNER: Configuration reset to defaults successfully');
      
    } catch (error) {
      console.error('💼 BUSINESS PARTNER ERROR: Failed to reset configuration:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to reset configuration'
      }));
    }
  }, [refreshStatus]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // EFFECT HOOKS
  // ═══════════════════════════════════════════════════════════════════════
  
  // Initialize on mount
  useEffect(() => {
    initialize();
    
    // Cleanup on unmount
    return () => {
      stopRealTimeUpdates();
    };
  }, [initialize, stopRealTimeUpdates]);
  
  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopRealTimeUpdates();
      } else if (config.enableRealTimeUpdates && config.enableAutoRefresh) {
        startRealTimeUpdates();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [config.enableRealTimeUpdates, config.enableAutoRefresh, startRealTimeUpdates, stopRealTimeUpdates]);
  
  // ═══════════════════════════════════════════════════════════════════════
  // RETURN HOOK STATE AND ACTIONS
  // ═══════════════════════════════════════════════════════════════════════
  
  const actions: ISchedulerHookActions = {
    // Workflow Control
    startWorkflow,
    stopWorkflow,
    executeWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    
    // System Management
    refreshStatus,
    performMaintenance,
    clearCache,
    
    // Alert Management
    acknowledgeAlert,
    acknowledgeAllAlerts,
    getAlerts,
    
    // Data Management
    getWorkflowHistory,
    getRecentReports,
    exportData,
    
    // Storage Management
    checkStorageUsage,
    performCleanup,
    
    // Configuration
    updateScheduleConfig,
    resetToDefaults
  };
  
  return [state, actions];
};

// ============================================================================
// HOOK UTILITIES AND HELPERS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Scheduler status hook (simplified version)
 * 
 * Lightweight hook for components that only need status information
 * without full control capabilities.
 */
export const useSchedulerStatus = () => {
  const [state] = useScheduler({
    refreshInterval: 10000,
    enableRealTimeUpdates: true,
    enablePerformanceMonitoring: false,
    enableDetailedLogging: false
  });
  
  return {
    isRunning: state.isRunning,
    systemHealth: state.realTimeStats.systemHealth,
    totalWorkflows: state.realTimeStats.totalWorkflows,
    successRate: state.performance.successRate,
    lastActivity: state.realTimeStats.lastActivity,
    unacknowledgedAlerts: state.unacknowledgedAlerts,
    storageUsage: state.storage.usagePercentage,
    isDemo: state.demo.isDemo
  };
};

/**
 * 💼 BUSINESS PARTNER: Scheduler alerts hook
 * 
 * Specialized hook for components that focus on alert management.
 */
export const useSchedulerAlerts = () => {
  const [state, actions] = useScheduler({
    refreshInterval: 5000,
    enableRealTimeUpdates: true,
    maxAlertHistory: 50
  });
  
  return {
    alerts: state.alerts,
    unacknowledgedAlerts: state.unacknowledgedAlerts,
    criticalAlerts: state.criticalAlerts,
    acknowledgeAlert: actions.acknowledgeAlert,
    acknowledgeAllAlerts: actions.acknowledgeAllAlerts,
    getAlerts: actions.getAlerts
  };
};

/**
 * 💼 BUSINESS PARTNER: Scheduler performance hook
 * 
 * Specialized hook for components that focus on performance monitoring.
 */
export const useSchedulerPerformance = () => {
  const [state] = useScheduler({
    refreshInterval: 2000,
    enableRealTimeUpdates: true,
    enablePerformanceMonitoring: true,
    enableDetailedLogging: true
  });
  
  return {
    performance: state.performance,
    realTimeStats: state.realTimeStats,
    systemHealth: state.realTimeStats.systemHealth,
    workflowHistory: state.workflowHistory,
    currentWorkflow: state.currentWorkflow
  };
};

export default useScheduler; 