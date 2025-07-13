/**
 * 🐎 useHorseDetection Hook
 * Integrates pre-AI horse detection with existing optimization system
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { HorseDetectionService } from '../services/horseDetectionService';
import { IHorseDetectionResult, IHorseDetectionConfig } from '../interfaces/HorseDetectionTypes';
import { horseDetectionConfig, getOptimizedConfig } from '../config/horseDetectionConfig';

interface IUseHorseDetectionOptions {
  mode?: 'balanced' | 'precise' | 'sensitive' | 'night' | 'fast';
  customConfig?: Partial<IHorseDetectionConfig>;
  enableStats?: boolean;
}

interface IHorseDetectionStats {
  totalDetections: number;
  horsesDetected: number;
  noHorseDetected: number;
  averageConfidence: number;
  averageProcessingTime: number;
  totalTokensSaved: number;
  estimatedCostSavings: number;
  detectionRate: number;
}

export const useHorseDetection = (options: IUseHorseDetectionOptions = {}) => {
  const {
    mode = 'balanced',
    customConfig,
    enableStats = true
  } = options;

  // Service instance reference
  const serviceRef = useRef<HorseDetectionService | null>(null);
  
  // State management
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState<IHorseDetectionResult | null>(null);
  const [stats, setStats] = useState<IHorseDetectionStats>({
    totalDetections: 0,
    horsesDetected: 0,
    noHorseDetected: 0,
    averageConfidence: 0,
    averageProcessingTime: 0,
    totalTokensSaved: 0,
    estimatedCostSavings: 0,
    detectionRate: 0
  });
  const [config, setConfig] = useState<IHorseDetectionConfig>(() => {
    const baseConfig = getOptimizedConfig(mode);
    return customConfig ? { ...baseConfig, ...customConfig } : baseConfig;
  });

  // Initialize horse detection service
  useEffect(() => {
    serviceRef.current = HorseDetectionService.getInstance(config);
  }, [config]);

  /**
   * 🎯 Main horse detection function
   */
  const detectHorse = useCallback(async (imageData: string): Promise<IHorseDetectionResult> => {
    if (!serviceRef.current) {
      throw new Error('Horse detection service not initialized');
    }

    setIsDetecting(true);
    
    try {
      const result = await serviceRef.current.detectHorse(imageData);
      setLastDetection(result);
      
      // Update statistics
      if (enableStats) {
        setStats(prevStats => {
          const newStats = {
            ...prevStats,
            totalDetections: prevStats.totalDetections + 1,
            horsesDetected: result.hasHorse 
              ? prevStats.horsesDetected + 1 
              : prevStats.horsesDetected,
            noHorseDetected: !result.hasHorse 
              ? prevStats.noHorseDetected + 1 
              : prevStats.noHorseDetected,
            totalTokensSaved: prevStats.totalTokensSaved + result.tokensSavedEstimate,
          };
          
          // Calculate derived statistics
          newStats.averageConfidence = (
            (prevStats.averageConfidence * prevStats.totalDetections + result.confidence) / 
            newStats.totalDetections
          );
          
          newStats.averageProcessingTime = (
            (prevStats.averageProcessingTime * prevStats.totalDetections + result.processingTime) / 
            newStats.totalDetections
          );
          
          newStats.detectionRate = (newStats.horsesDetected / newStats.totalDetections) * 100;
          
          // Estimate cost savings ($0.01 per 1000 tokens average)
          newStats.estimatedCostSavings = (newStats.totalTokensSaved / 1000) * 0.01;
          
          return newStats;
        });
      }
      
      return result;
    } finally {
      setIsDetecting(false);
    }
  }, [enableStats]);

  /**
   * 🔄 Update detection configuration
   */
  const updateConfig = useCallback((
    newMode?: 'balanced' | 'precise' | 'sensitive' | 'night' | 'fast',
    newCustomConfig?: Partial<IHorseDetectionConfig>
  ) => {
    const baseConfig = newMode ? getOptimizedConfig(newMode) : getOptimizedConfig(mode);
    const updatedConfig = newCustomConfig ? { ...baseConfig, ...newCustomConfig } : baseConfig;
    setConfig(updatedConfig);
  }, [mode]);

  /**
   * 📊 Reset statistics
   */
  const resetStats = useCallback(() => {
    setStats({
      totalDetections: 0,
      horsesDetected: 0,
      noHorseDetected: 0,
      averageConfidence: 0,
      averageProcessingTime: 0,
      totalTokensSaved: 0,
      estimatedCostSavings: 0,
      detectionRate: 0
    });
  }, []);

  /**
   * 🎯 Smart detection with pre-filtering
   * Integrates with existing AI optimization pipeline
   */
  const smartDetectAndOptimize = useCallback(async (
    imageData: string,
    context?: any
  ): Promise<{
    shouldProceedToAI: boolean;
    horseDetection: IHorseDetectionResult;
    optimizationRecommendation: string;
    tokenSavingsEstimate: number;
  }> => {
    const horseResult = await detectHorse(imageData);
    
    // Decision logic for AI processing
    const shouldProceedToAI = horseResult.recommendSendToAI;
    
    // Generate optimization recommendation
    let optimizationRecommendation = '';
    if (horseResult.hasHorse && horseResult.confidence > 0.7) {
      optimizationRecommendation = 'High confidence horse detected - proceed with AI analysis';
    } else if (horseResult.hasHorse && horseResult.confidence > 0.4) {
      optimizationRecommendation = 'Moderate confidence horse detected - proceed with caution';
    } else if (horseResult.confidence < 0.3) {
      optimizationRecommendation = 'Low horse likelihood - skip AI analysis to save tokens';
    } else {
      optimizationRecommendation = 'Uncertain detection - proceed with AI for safety';
    }
    
    return {
      shouldProceedToAI,
      horseDetection: horseResult,
      optimizationRecommendation,
      tokenSavingsEstimate: horseResult.tokensSavedEstimate
    };
  }, [detectHorse]);

  /**
   * 🔍 Batch processing for multiple images
   */
  const batchDetect = useCallback(async (
    images: string[]
  ): Promise<IHorseDetectionResult[]> => {
    const results: IHorseDetectionResult[] = [];
    
    for (const imageData of images) {
      try {
        const result = await detectHorse(imageData);
        results.push(result);
      } catch (error) {
        console.error('Batch detection failed for image:', error);
        // Add failed result
        results.push({
          hasHorse: true, // Fail-safe: assume horse present
          confidence: 0.5,
          reason: 'batch_detection_error',
          details: { error: String(error) },
          processingTime: 0,
          recommendSendToAI: true,
          tokensSavedEstimate: 0
        });
      }
    }
    
    return results;
  }, [detectHorse]);

  /**
   * 📈 Performance analysis
   */
  const getPerformanceAnalysis = useCallback(() => {
    const totalProcessingTime = stats.averageProcessingTime * stats.totalDetections;
    const hourlyDetections = stats.totalDetections; // Assuming current session
    const dailyProjection = hourlyDetections * 24;
    const dailyCostSavings = stats.estimatedCostSavings * 24;

    return {
      current: stats,
      projections: {
        dailyDetections: dailyProjection,
        dailyCostSavings,
        monthlyTokensSaved: stats.totalTokensSaved * 30,
        monthlyCostSavings: dailyCostSavings * 30
      },
      performance: {
        efficiency: stats.averageProcessingTime < 20 ? 'excellent' : 
                   stats.averageProcessingTime < 50 ? 'good' : 'needs_optimization',
        accuracy: stats.detectionRate > 80 ? 'high' : 
                 stats.detectionRate > 60 ? 'moderate' : 'low',
        tokenOptimization: stats.totalTokensSaved > 10000 ? 'excellent' : 
                          stats.totalTokensSaved > 5000 ? 'good' : 'minimal'
      }
    };
  }, [stats]);

  return {
    // Core detection functionality
    detectHorse,
    smartDetectAndOptimize,
    batchDetect,
    
    // Configuration management
    updateConfig,
    config,
    
    // Statistics and monitoring
    stats,
    resetStats,
    getPerformanceAnalysis,
    
    // State
    isDetecting,
    lastDetection,
    
    // Utility
    isReady: !!serviceRef.current
  };
}; 