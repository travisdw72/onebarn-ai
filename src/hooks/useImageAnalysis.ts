/**
 * 🔍 Image Analysis Hook
 * Custom hook for analyzing images through AI optimization filters
 * Integrates with AIOptimizationService for testing and calibration
 */

import { useState, useCallback, useRef } from 'react';
import { AIOptimizationService } from '../services/aiOptimizationService';
import { aiOptimizationConfig } from '../config/aiOptimizationConfig';
import type {
  IThresholdValues,
  IUseImageAnalysisReturn
} from '../interfaces/AITestingTypes';
import type {
  IPreProcessingResult,
  IAnalysisContext,
  IAIOptimizationConfig
} from '../interfaces/AIOptimizationTypes';

interface UseImageAnalysisProps {
  enableLogging?: boolean;
  timeoutMs?: number;
  retryAttempts?: number;
}

export const useImageAnalysis = ({
  enableLogging = true,
  timeoutMs = 30000,
  retryAttempts = 2
}: UseImageAnalysisProps = {}): IUseImageAnalysisReturn => {

  // State management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for service and cancellation
  const serviceRef = useRef<AIOptimizationService | null>(null);
  const currentAnalysisRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  // Initialize service
  const getService = useCallback((): AIOptimizationService => {
    if (!serviceRef.current) {
      serviceRef.current = AIOptimizationService.getInstance();
    }
    return serviceRef.current;
  }, []);

  /**
   * Convert threshold values to optimization config format
   */
  const createOptimizationConfig = useCallback((thresholds: IThresholdValues): IAIOptimizationConfig => {
    return {
      ...aiOptimizationConfig,
      thresholds: {
        ...aiOptimizationConfig.thresholds,
        imageQuality: {
          ...aiOptimizationConfig.thresholds.imageQuality,
          minSharpness: thresholds.imageQuality,
          minBrightness: Math.max(10, thresholds.imageQuality - 10),
          minContrast: Math.max(20, thresholds.imageQuality - 5)
        },
        occupancy: {
          ...aiOptimizationConfig.thresholds.occupancy,
          minConfidence: thresholds.occupancy / 100,
          minPixelDensity: Math.max(0.1, thresholds.occupancy / 200)
        },
        motion: {
          ...aiOptimizationConfig.thresholds.motion,
          minMotionScore: thresholds.motion,
          frameDifferenceThreshold: Math.max(1, thresholds.motion / 5)
        },
        duplicate: {
          ...aiOptimizationConfig.thresholds.duplicate,
          maxSimilarity: thresholds.duplicate / 100,
          hashCacheSize: 100,
          cacheDurationMinutes: 5
        }
      }
    };
  }, []);

  /**
   * Create analysis context for testing
   */
  const createTestingContext = useCallback((): IAnalysisContext => {
    return {
      source: 'manual',
      priority: 'medium',
      sessionId: `testing_${Date.now()}`,
      expectedContent: 'horse',
      overrides: {
        skipTimeCheck: true, // Always process in testing mode
        forceProcess: false
      }
    };
  }, []);

  /**
   * Analyze image with current thresholds
   */
  const analyzeImage = useCallback(async (
    imageData: string,
    thresholds: IThresholdValues
  ): Promise<IPreProcessingResult> => {
    // Cancel any existing analysis
    if (currentAnalysisRef.current) {
      currentAnalysisRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    currentAnalysisRef.current = abortController;

    setIsAnalyzing(true);
    setError(null);
    retryCountRef.current = 0;

    const startTime = Date.now();

    try {
      if (enableLogging) {
        console.log('🔍 Starting image analysis with thresholds:', thresholds);
      }

      // Validate image data
      if (!imageData || typeof imageData !== 'string') {
        throw new Error('Invalid image data provided');
      }

      if (!imageData.startsWith('data:image/')) {
        throw new Error('Image data must be a valid data URL');
      }

      // Get service instance
      const service = getService();

      // Create temporary config with current thresholds
      const tempConfig = createOptimizationConfig(thresholds);
      
      // Update service config temporarily
      service.updateConfig(tempConfig);

      // Create analysis context
      const context = createTestingContext();

      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Analysis timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        // Clear timeout if analysis completes
        abortController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
        });
      });

      // Run analysis with timeout
      const analysisPromise = service.preProcessRequest(imageData, context);
      
      const result = await Promise.race([analysisPromise, timeoutPromise]);

      if (enableLogging) {
        const processingTime = Date.now() - startTime;
        console.log('✅ Analysis completed:', {
          shouldProceed: result.shouldProceed,
          skipReason: result.decisions.skipReason,
          processingTime,
          tokenSavings: result.tokenSavingsEstimate
        });
      }

      return result;

    } catch (error: any) {
      // Handle cancellation
      if (error.name === 'AbortError' || abortController.signal.aborted) {
        if (enableLogging) {
          console.log('🚫 Analysis cancelled');
        }
        throw new Error('Analysis was cancelled');
      }

      // Handle other errors with retry logic
      const errorMessage = error.message || 'Unknown analysis error';
      
      if (enableLogging) {
        console.error('❌ Analysis failed:', {
          error: errorMessage,
          retryCount: retryCountRef.current,
          processingTime: Date.now() - startTime
        });
      }

      // Retry logic for network or temporary errors
      if (retryCountRef.current < retryAttempts && 
          (errorMessage.includes('timeout') || 
           errorMessage.includes('network') || 
           errorMessage.includes('fetch'))) {
        
        retryCountRef.current++;
        
        if (enableLogging) {
          console.log(`🔄 Retrying analysis (attempt ${retryCountRef.current}/${retryAttempts})`);
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCountRef.current));
        
        // Recursive retry
        return analyzeImage(imageData, thresholds);
      }

      // Set error state
      setError(errorMessage);
      throw error;

    } finally {
      setIsAnalyzing(false);
      currentAnalysisRef.current = null;
    }
  }, [
    enableLogging,
    timeoutMs,
    retryAttempts,
    getService,
    createOptimizationConfig,
    createTestingContext
  ]);

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Cancel current analysis
   */
  const cancelAnalysis = useCallback(() => {
    if (currentAnalysisRef.current) {
      currentAnalysisRef.current.abort();
      currentAnalysisRef.current = null;
    }
    
    setIsAnalyzing(false);
    setError(null);
    
    if (enableLogging) {
      console.log('🚫 Analysis cancelled by user');
    }
  }, [enableLogging]);

  return {
    analyzeImage,
    isAnalyzing,
    error,
    clearError,
    cancelAnalysis
  };
}; 