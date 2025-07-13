import { useState, useEffect, useCallback, useRef } from 'react';
import { AIOptimizationService } from '../services/aiOptimizationService';
import {
  IPreProcessingResult,
  IAnalysisContext,
  IOptimizationStats,
  IOptimizationThresholds,
  IUseAIOptimizationReturn,
  IAIOptimizationConfig
} from '../interfaces/AIOptimizationTypes';
import { aiOptimizationConfig } from '../config/aiOptimizationConfig';

interface UseAIOptimizationProps {
  config?: Partial<IAIOptimizationConfig>;
  autoStart?: boolean;
  enableLogging?: boolean;
}

export const useAIOptimization = ({
  config,
  autoStart = true,
  enableLogging = true
}: UseAIOptimizationProps = {}): IUseAIOptimizationReturn => {
  
  // State management
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const [lastOptimization, setLastOptimization] = useState<Date | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [successRate, setSuccessRate] = useState(1.0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [stats, setStats] = useState<IOptimizationStats | null>(null);
  
  // Refs for service instance and tracking
  const serviceRef = useRef<AIOptimizationService | null>(null);
  const requestCountRef = useRef(0);
  const successCountRef = useRef(0);
  const processingQueueRef = useRef<Array<{
    id: string;
    timestamp: number;
    status: 'pending' | 'processing' | 'completed' | 'error';
  }>>([]);

  // Initialize service
  useEffect(() => {
    if (autoStart) {
      const mergedConfig = config ? { ...aiOptimizationConfig, ...config } : aiOptimizationConfig;
      serviceRef.current = AIOptimizationService.getInstance(mergedConfig);
      
      if (enableLogging) {
        console.log('🤖 AI Optimization Service initialized');
      }
    }
  }, [autoStart, config, enableLogging]);

  // Update stats periodically
  useEffect(() => {
    if (!serviceRef.current) return;

    const interval = setInterval(() => {
      try {
        const currentStats = serviceRef.current?.getStats();
        if (currentStats) {
          setStats(currentStats);
          
          // Update success rate
          const total = currentStats.session.totalRequests;
          const errors = errorCount;
          const newSuccessRate = total > 0 ? (total - errors) / total : 1.0;
          setSuccessRate(newSuccessRate);
        }
      } catch (error) {
        if (enableLogging) {
          console.warn('Failed to update optimization stats:', error);
        }
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [errorCount, enableLogging]);

  /**
   * Main pre-processing function
   */
  const preProcessRequest = useCallback(async (
    imageData: string,
    context?: IAnalysisContext
  ): Promise<IPreProcessingResult> => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    try {
      setIsProcessing(true);
      setQueueSize(prev => prev + 1);
      requestCountRef.current++;
      
      // Add to processing queue
      processingQueueRef.current.push({
        id: requestId,
        timestamp: startTime,
        status: 'processing'
      });

      // Enhanced context with session tracking
      const enhancedContext: IAnalysisContext = {
        ...context,
        sessionId: context?.sessionId || `session_${Date.now()}`,
        source: context?.source || 'manual',
        priority: context?.priority || 'medium'
      };

      if (enableLogging && aiOptimizationConfig.thresholds.global.debugMode) {
        console.log('🔍 Starting pre-processing:', {
          requestId,
          context: enhancedContext,
          imageSize: imageData.length
        });
      }

      // Call the optimization service
      const result = await serviceRef.current.preProcessRequest(imageData, enhancedContext);
      
      // Update tracking
      successCountRef.current++;
      setLastOptimization(new Date());
      setLastError(null);
      
      // Update processing queue
      processingQueueRef.current = processingQueueRef.current.map(item =>
        item.id === requestId ? { ...item, status: 'completed' } : item
      );

      if (enableLogging) {
        console.log('✅ Pre-processing completed:', {
          requestId,
          shouldProceed: result.shouldProceed,
          tokenSavings: result.tokenSavingsEstimate,
          processingTime: result.processingTime.total,
          skipReason: result.decisions.skipReason
        });
      }

      return result;

    } catch (error: any) {
      setErrorCount(prev => prev + 1);
      setLastError(error.message || 'Unknown optimization error');
      
      // Update processing queue
      processingQueueRef.current = processingQueueRef.current.map(item =>
        item.id === requestId ? { ...item, status: 'error' } : item
      );

      if (enableLogging) {
        console.error('❌ Pre-processing failed:', {
          requestId,
          error: error.message,
          processingTime: Date.now() - startTime
        });
      }

      throw error;

    } finally {
      setIsProcessing(false);
      setQueueSize(prev => Math.max(0, prev - 1));
      
      // Clean up old queue entries
      const cutoff = Date.now() - 300000; // 5 minutes
      processingQueueRef.current = processingQueueRef.current.filter(
        item => item.timestamp > cutoff
      );
    }
  }, [enableLogging]);

  /**
   * Update optimization thresholds
   */
  const updateThresholds = useCallback((thresholds: Partial<IOptimizationThresholds>) => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    serviceRef.current.updateConfig({ thresholds: { ...aiOptimizationConfig.thresholds, ...thresholds } });
    
    if (enableLogging) {
      console.log('🔧 Optimization thresholds updated');
    }
  }, [enableLogging]);

  /**
   * Get current thresholds
   */
  const getThresholds = useCallback((): IOptimizationThresholds => {
    return aiOptimizationConfig.thresholds;
  }, []);

  /**
   * Reset to default configuration
   */
  const resetToDefaults = useCallback(() => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    serviceRef.current.updateConfig(aiOptimizationConfig);
    setErrorCount(0);
    setLastError(null);
    
    if (enableLogging) {
      console.log('🔄 Optimization configuration reset to defaults');
    }
  }, [enableLogging]);

  /**
   * Get optimization statistics
   */
  const getStats = useCallback((): IOptimizationStats => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    return serviceRef.current.getStats();
  }, []);

  /**
   * Clear statistics
   */
  const clearStats = useCallback(() => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    serviceRef.current.clearStats();
    setStats(null);
    setErrorCount(0);
    setSuccessRate(1.0);
    requestCountRef.current = 0;
    successCountRef.current = 0;
    
    if (enableLogging) {
      console.log('📊 Optimization statistics cleared');
    }
  }, [enableLogging]);

  /**
   * Export statistics as JSON
   */
  const exportStats = useCallback((): string => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    const currentStats = serviceRef.current.getStats();
    const exportData = {
      ...currentStats,
      exportTimestamp: new Date().toISOString(),
      hookMetrics: {
        totalRequests: requestCountRef.current,
        successfulRequests: successCountRef.current,
        errorRate: errorCount / Math.max(1, requestCountRef.current),
        averageSuccessRate: successRate
      },
      processingQueue: processingQueueRef.current.length
    };

    return JSON.stringify(exportData, null, 2);
  }, [errorCount, successRate]);

  /**
   * Clear optimization cache
   */
  const clearCache = useCallback(() => {
    if (!serviceRef.current) {
      throw new Error('AI Optimization Service not initialized');
    }

    serviceRef.current.clearCache();
    
    if (enableLogging) {
      console.log('🗑️ Optimization cache cleared');
    }
  }, [enableLogging]);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(() => {
    // This would need to be implemented in the service
    // For now, return mock data
    return {
      size: 0,
      hitRate: 0.8,
      oldestEntry: new Date(Date.now() - 3600000), // 1 hour ago
      newestEntry: new Date()
    };
  }, []);

  /**
   * Clear last error
   */
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  /**
   * Get processing queue status
   */
  const getQueueStatus = useCallback(() => {
    return {
      size: processingQueueRef.current.length,
      pending: processingQueueRef.current.filter(item => item.status === 'pending').length,
      processing: processingQueueRef.current.filter(item => item.status === 'processing').length,
      completed: processingQueueRef.current.filter(item => item.status === 'completed').length,
      errors: processingQueueRef.current.filter(item => item.status === 'error').length
    };
  }, []);

  /**
   * Check if service is ready
   */
  const isReady = useCallback(() => {
    return serviceRef.current !== null;
  }, []);

  /**
   * Get optimization recommendations based on current stats
   */
  const getOptimizationRecommendations = useCallback((): string[] => {
    if (!stats) return [];

    const recommendations: string[] = [];
    
    if (stats.performance.errorRate > 0.1) {
      recommendations.push('Consider adjusting thresholds - high error rate detected');
    }
    
    if (stats.session.tokensSaved < 100) {
      recommendations.push('Enable more aggressive optimization for better token savings');
    }
    
    if (stats.performance.averagePreProcessingTime > 5000) {
      recommendations.push('Consider reducing processing complexity for better performance');
    }
    
    if (stats.session.skippedRequests / Math.max(1, stats.session.totalRequests) > 0.8) {
      recommendations.push('Very high skip rate - consider more lenient thresholds');
    }
    
    return recommendations;
  }, [stats]);

  // Return the hook interface
  return {
    // Core functionality
    preProcessRequest,
    
    // Configuration management
    updateThresholds,
    getThresholds,
    resetToDefaults,
    
    // Statistics and monitoring
    getStats,
    clearStats,
    exportStats,
    
    // Cache management
    clearCache,
    getCacheStats,
    
    // Real-time status
    status: {
      isProcessing,
      queueSize,
      lastOptimization,
      errorCount,
      successRate
    },
    
    // Error handling
    lastError,
    clearError,
    
    // Additional utility methods
    isReady,
    getQueueStatus,
    getOptimizationRecommendations
  };
};

// Export additional utility functions
export const createOptimizationContext = (
  overrides: Partial<IAnalysisContext> = {}
): IAnalysisContext => ({
  source: 'manual',
  priority: 'medium',
  sessionId: `session_${Date.now()}`,
  ...overrides
});

export const estimateTokenSavings = (
  dailyImageCount: number,
  optimizationConfig: IAIOptimizationConfig
): { daily: number; monthly: number; yearly: number } => {
  // Simplified estimation based on configuration
  const tokensPerImage = 2000; // Average tokens per image
  const savingsRate = optimizationConfig.thresholds.global.aggressiveMode ? 0.65 : 
                     optimizationConfig.thresholds.global.conservativeMode ? 0.35 : 0.50;
  
  const dailySavings = dailyImageCount * tokensPerImage * savingsRate;
  
  return {
    daily: dailySavings,
    monthly: dailySavings * 30,
    yearly: dailySavings * 365
  };
};

export const formatOptimizationResult = (result: IPreProcessingResult): string => {
  if (result.shouldProceed) {
    return `✅ Analysis approved (${result.processingTime.total}ms)`;
  } else {
    return `⏭️ Skipped: ${result.decisions.skipReason} (${result.tokenSavingsEstimate}% tokens saved)`;
  }
};

export default useAIOptimization; 