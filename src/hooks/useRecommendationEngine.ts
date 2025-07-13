/**
 * 💡 Recommendation Engine Hook
 * Custom hook for generating AI-powered threshold optimization recommendations
 * Analyzes filter results and suggests optimal threshold adjustments
 */

import { useState, useCallback, useRef } from 'react';
import type {
  IRecommendation,
  IThresholdValues,
  IUseRecommendationEngineReturn
} from '../interfaces/AITestingTypes';
import type { IPreProcessingResult } from '../interfaces/AIOptimizationTypes';
import { aiTestingData } from '../config/aiTestingData';

interface UseRecommendationEngineProps {
  maxRecommendations?: number;
  enableAutoGeneration?: boolean;
  confidenceThreshold?: number;
}

export const useRecommendationEngine = ({
  maxRecommendations = 8,
  enableAutoGeneration = true,
  confidenceThreshold = 0.7
}: UseRecommendationEngineProps = {}): IUseRecommendationEngineReturn => {

  // State management
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  
  // Refs for tracking
  const recommendationIdRef = useRef(0);
  const dismissedRecommendationsRef = useRef<Set<string>>(new Set());

  /**
   * Generate a unique recommendation ID
   */
  const generateRecommendationId = useCallback((): string => {
    recommendationIdRef.current += 1;
    return `rec_${Date.now()}_${recommendationIdRef.current}`;
  }, []);

  /**
   * Create a recommendation object
   */
  const createRecommendation = useCallback((
    category: 'quality' | 'occupancy' | 'motion' | 'duplicate' | 'general',
    title: string,
    description: string,
    action: string,
    impact: 'low' | 'medium' | 'high',
    confidence: number,
    applyFn: () => void
  ): IRecommendation => {
    const id = generateRecommendationId();
    
    return {
      id,
      category,
      title,
      description,
      action,
      impact,
      confidence,
      apply: applyFn,
      dismiss: () => {
        dismissedRecommendationsRef.current.add(id);
        setRecommendations(prev => prev.filter(r => r.id !== id));
      }
    };
  }, [generateRecommendationId]);

  /**
   * Analyze image quality results and generate recommendations
   */
  const analyzeImageQuality = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    const qualityResult = results.imageQuality;
    
    if (!qualityResult.passed) {
      // Image quality is too low
      if (qualityResult.score < thresholds.imageQuality - 15) {
        recommendations.push(createRecommendation(
          'quality',
          'Lower Quality Threshold',
          `Current image scored ${qualityResult.score}%, but threshold is ${thresholds.imageQuality}%`,
          `Reduce quality threshold to ${Math.max(10, qualityResult.score - 5)}%`,
          'high',
          0.85,
          () => {
            // This will be handled by the parent component
            console.log('Apply quality threshold reduction');
          }
        ));
      }
      
      // Check specific quality metrics
      if (qualityResult.metrics.brightness < 30) {
        recommendations.push(createRecommendation(
          'quality',
          'Low Brightness Detected',
          'Image appears to be taken in low light conditions',
          'Consider adjusting camera settings or lowering brightness threshold',
          'medium',
          0.8,
          () => {
            console.log('Apply brightness adjustment');
          }
        ));
      }
      
      if (qualityResult.metrics.sharpness < 40) {
        recommendations.push(createRecommendation(
          'quality',
          'Low Sharpness Detected',
          'Image appears blurry or out of focus',
          'Check camera focus or reduce sharpness requirements',
          'medium',
          0.75,
          () => {
            console.log('Apply sharpness adjustment');
          }
        ));
      }
    } else if (qualityResult.score > thresholds.imageQuality + 20) {
      // Quality is much higher than needed - could be more aggressive
      recommendations.push(createRecommendation(
        'quality',
        'Increase Quality Threshold',
        `Image quality is ${qualityResult.score}%, well above threshold of ${thresholds.imageQuality}%`,
        `Increase quality threshold to ${Math.min(80, qualityResult.score - 10)}% for better optimization`,
        'medium',
        0.7,
        () => {
          console.log('Apply quality threshold increase');
        }
      ));
    }
    
    return recommendations;
  }, [createRecommendation]);

  /**
   * Analyze occupancy results and generate recommendations
   */
  const analyzeOccupancy = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    const occupancyResult = results.occupancy;
    
    if (!occupancyResult.hasOccupancy) {
      const confidencePercent = Math.round(occupancyResult.confidence * 100);
      
      if (confidencePercent > thresholds.occupancy - 15) {
        recommendations.push(createRecommendation(
          'occupancy',
          'Lower Occupancy Threshold',
          `Occupancy confidence is ${confidencePercent}%, close to threshold of ${thresholds.occupancy}%`,
          `Reduce occupancy threshold to ${Math.max(20, confidencePercent - 5)}%`,
          'high',
          0.8,
          () => {
            console.log('Apply occupancy threshold reduction');
          }
        ));
      }
      
      if (occupancyResult.occupancyType === 'unknown' && confidencePercent > 25) {
        recommendations.push(createRecommendation(
          'occupancy',
          'Unclear Occupancy Detection',
          'System detected some activity but classification is uncertain',
          'Consider improving camera angle or lighting for better occupancy detection',
          'medium',
          0.6,
          () => {
            console.log('Apply occupancy detection improvement');
          }
        ));
      }
    } else if (occupancyResult.confidence > (thresholds.occupancy / 100) + 0.3) {
      // Very high confidence - could be more aggressive
      recommendations.push(createRecommendation(
        'occupancy',
        'Increase Occupancy Threshold',
        `Occupancy confidence is very high (${Math.round(occupancyResult.confidence * 100)}%)`,
        `Increase occupancy threshold to ${Math.min(80, Math.round(occupancyResult.confidence * 100) - 10)}%`,
        'low',
        0.6,
        () => {
          console.log('Apply occupancy threshold increase');
        }
      ));
    }
    
    return recommendations;
  }, [createRecommendation]);

  /**
   * Analyze motion results and generate recommendations
   */
  const analyzeMotion = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    const motionResult = results.motion;
    
    if (!motionResult.motionDetected) {
      if (motionResult.motionScore > thresholds.motion - 10) {
        recommendations.push(createRecommendation(
          'motion',
          'Lower Motion Threshold',
          `Motion score is ${motionResult.motionScore}%, close to threshold of ${thresholds.motion}%`,
          `Reduce motion threshold to ${Math.max(5, motionResult.motionScore - 3)}%`,
          'high',
          0.8,
          () => {
            console.log('Apply motion threshold reduction');
          }
        ));
      }
      
      if (motionResult.motionType === 'minor' && motionResult.motionScore > 5) {
        recommendations.push(createRecommendation(
          'motion',
          'Detect Minor Motion',
          'Minor motion detected but filtered out',
          'Consider lowering motion sensitivity to catch subtle movements',
          'medium',
          0.7,
          () => {
            console.log('Apply motion sensitivity increase');
          }
        ));
      }
    } else if (motionResult.motionScore > thresholds.motion + 20) {
      // High motion detected - could be more selective
      recommendations.push(createRecommendation(
        'motion',
        'Increase Motion Threshold',
        `High motion detected (${motionResult.motionScore}%), well above threshold`,
        `Increase motion threshold to ${Math.min(50, motionResult.motionScore - 10)}%`,
        'low',
        0.6,
        () => {
          console.log('Apply motion threshold increase');
        }
      ));
    }
    
    return recommendations;
  }, [createRecommendation]);

  /**
   * Analyze duplicate results and generate recommendations
   */
  const analyzeDuplicate = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    const duplicateResult = results.duplicate;
    
    if (duplicateResult.isDuplicate) {
      const similarityPercent = Math.round(duplicateResult.similarity * 100);
      
      if (similarityPercent < thresholds.duplicate + 10) {
        recommendations.push(createRecommendation(
          'duplicate',
          'Increase Duplicate Threshold',
          `Image similarity is ${similarityPercent}%, just above threshold of ${thresholds.duplicate}%`,
          `Increase duplicate threshold to ${Math.min(95, similarityPercent + 5)}% to allow similar but unique images`,
          'medium',
          0.75,
          () => {
            console.log('Apply duplicate threshold increase');
          }
        ));
      }
    } else if (duplicateResult.similarity < (thresholds.duplicate / 100) - 0.2) {
      // Very different image - could be more aggressive
      recommendations.push(createRecommendation(
        'duplicate',
        'Lower Duplicate Threshold',
        `Image is very unique (${Math.round(duplicateResult.similarity * 100)}% similarity)`,
        `Lower duplicate threshold to ${Math.max(70, Math.round(duplicateResult.similarity * 100) + 10)}% for better filtering`,
        'low',
        0.6,
        () => {
          console.log('Apply duplicate threshold decrease');
        }
      ));
    }
    
    return recommendations;
  }, [createRecommendation]);

  /**
   * Generate general optimization recommendations
   */
  const generateGeneralRecommendations = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ): IRecommendation[] => {
    const recommendations: IRecommendation[] = [];
    
    // Check if too many filters are failing
    const failedFilters = [
      !results.imageQuality.passed,
      !results.occupancy.hasOccupancy,
      !results.motion.motionDetected,
      results.duplicate.isDuplicate
    ].filter(Boolean).length;
    
    if (failedFilters >= 3) {
      recommendations.push(createRecommendation(
        'general',
        'Thresholds Too Aggressive',
        'Multiple filters are rejecting this image',
        'Consider using the "Conservative" preset for less aggressive filtering',
        'high',
        0.9,
        () => {
          console.log('Apply conservative preset');
        }
      ));
    }
    
    // Processing time recommendations
    if (results.processingTime.total > 500) {
      recommendations.push(createRecommendation(
        'general',
        'Slow Processing Time',
        `Processing took ${results.processingTime.total}ms`,
        'Consider reducing image resolution or simplifying analysis',
        'low',
        0.6,
        () => {
          console.log('Apply performance optimization');
        }
      ));
    }
    
    // Check for edge cases
    if (results.shouldProceed && results.overallScore < 30) {
      recommendations.push(createRecommendation(
        'general',
        'Low Overall Score',
        `Image passed but overall score is low (${results.overallScore}%)`,
        'Review individual filter results for potential improvements',
        'medium',
        0.7,
        () => {
          console.log('Apply overall optimization');
        }
      ));
    }
    
    return recommendations;
  }, [createRecommendation]);

  /**
   * Main recommendation generation function
   */
  const generateRecommendations = useCallback((
    results: IPreProcessingResult,
    thresholds: IThresholdValues
  ) => {
    if (!enableAutoGeneration) return;
    
    const allRecommendations: IRecommendation[] = [];
    
    // Generate category-specific recommendations
    allRecommendations.push(...analyzeImageQuality(results, thresholds));
    allRecommendations.push(...analyzeOccupancy(results, thresholds));
    allRecommendations.push(...analyzeMotion(results, thresholds));
    allRecommendations.push(...analyzeDuplicate(results, thresholds));
    allRecommendations.push(...generateGeneralRecommendations(results, thresholds));
    
    // Filter by confidence threshold and limit count
    const filteredRecommendations = allRecommendations
      .filter(rec => rec.confidence >= confidenceThreshold)
      .filter(rec => !dismissedRecommendationsRef.current.has(rec.id))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxRecommendations);
    
    setRecommendations(filteredRecommendations);
  }, [
    enableAutoGeneration,
    confidenceThreshold,
    maxRecommendations,
    analyzeImageQuality,
    analyzeOccupancy,
    analyzeMotion,
    analyzeDuplicate,
    generateGeneralRecommendations
  ]);

  /**
   * Apply a specific recommendation
   */
  const applyRecommendation = useCallback((id: string) => {
    const recommendation = recommendations.find(r => r.id === id);
    if (recommendation) {
      recommendation.apply();
      // Remove the applied recommendation
      setRecommendations(prev => prev.filter(r => r.id !== id));
    }
  }, [recommendations]);

  /**
   * Dismiss a specific recommendation
   */
  const dismissRecommendation = useCallback((id: string) => {
    dismissedRecommendationsRef.current.add(id);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  }, []);

  /**
   * Clear all recommendations
   */
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    dismissedRecommendationsRef.current.clear();
  }, []);

  return {
    recommendations,
    generateRecommendations,
    applyRecommendation,
    dismissRecommendation,
    clearRecommendations
  };
}; 