import { useState, useEffect, useCallback, useRef } from 'react';
import { aiVisionService, IHorseAnalysisResult } from '../services/aiVisionService';
import { IVideoAnalysisResult, IVideoAnalysisMetadata } from '../interfaces/VideoTypes';

interface UseVideoAnalysisProps {
  autoAnalysis?: boolean;
  segmentDuration?: number;
  selectedHorse?: string;
}

interface UseVideoAnalysisReturn {
  // Analysis state
  currentAnalysis: IVideoAnalysisResult | null;
  analysisHistory: IVideoAnalysisResult[];
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Video segment analysis
  analyzeVideoSegment: (videoBlob: Blob, context?: any) => Promise<IVideoAnalysisResult>;
  clearHistory: () => void;
  getAnalysisTrends: () => {
    riskTrend: number[];
    confidenceTrend: number[];
    timestamps: string[];
  };
  
  // Queue management for video uploads
  uploadProgress: number;
  queueStatus: {
    queueSize: number;
    isProcessing: boolean;
    successRate: number;
    dynamicInterval: number;
  };
  
  // Utility functions
  needsImmediateAttention: (analysis?: IVideoAnalysisResult) => boolean;
  generateRecommendations: (analysis?: IVideoAnalysisResult) => string[];
}

export const useVideoAnalysis = ({
  autoAnalysis = false,
  segmentDuration = 30,
  selectedHorse = ''
}: UseVideoAnalysisProps = {}): UseVideoAnalysisReturn => {
  
  // Analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<IVideoAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<IVideoAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Queue status
  const [queueStatus, setQueueStatus] = useState({
    queueSize: 0,
    isProcessing: false,
    successRate: 1.0,
    dynamicInterval: 30000
  });
  
  // Refs for tracking
  const analysisCountRef = useRef(0);
  const lastAnalysisTimeRef = useRef(0);
  
  // Load analysis history on mount
  useEffect(() => {
    loadAnalysisHistory();
  }, []);
  
  // Update queue status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const status = aiVisionService.getQueueStatus();
      setQueueStatus(status);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  /**
   * Load analysis history from localStorage
   */
  const loadAnalysisHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem('videoAnalysisHistory');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.analyses && Array.isArray(data.analyses)) {
          setAnalysisHistory(data.analyses);
        }
      }
    } catch (error) {
      console.warn('Failed to load video analysis history:', error);
    }
  }, []);
  
  /**
   * Convert AI service result to video analysis format
   */
  const convertToVideoAnalysisResult = useCallback((
    aiResult: IHorseAnalysisResult, 
    metadata: IVideoAnalysisMetadata
  ): IVideoAnalysisResult => {
    return {
      timestamp: aiResult.timestamp,
      horseDetected: aiResult.horseDetected,
      confidence: aiResult.confidence,
      healthRisk: aiResult.riskScore,
      behaviorScore: aiResult.healthMetrics?.behavioralScore || 50,
      activityLevel: aiResult.healthMetrics?.mobilityScore || 50,
      alerts: aiResult.riskAssessment?.immediateRisks || aiResult.recommendations || [],
      insights: aiResult.behaviorObservations || [],
      recommendations: aiResult.recommendations || [],
      alertLevel: aiResult.alertLevel,
      metadata,
      clinicalAssessment: aiResult.clinicalAssessment,
      healthMetrics: aiResult.healthMetrics,
      riskAssessment: aiResult.riskAssessment,
      // Video-specific properties
      videoDuration: metadata.videoDuration,
      videoSize: metadata.videoSize,
      uploadTime: metadata.uploadTime
    };
  }, []);
  
  /**
   * Analyze video segment with AI service
   */
  const analyzeVideoSegment = useCallback(async (
    videoBlob: Blob, 
    context: any = {}
  ): Promise<IVideoAnalysisResult> => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setUploadProgress(0);
    analysisCountRef.current++;
    
    try {
      console.log(`🎬 Starting video segment analysis: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Create metadata
      const metadata: IVideoAnalysisMetadata = {
        captureTimestamp: new Date().toISOString(),
        segmentIndex: context.segmentIndex || 1,
        videoDuration: context.segmentDuration || segmentDuration,
        videoSize: videoBlob.size,
        uploadTime: Date.now(),
        sessionId: context.sessionId,
        analysisSequence: analysisCountRef.current,
        environmentalFactors: context.environmentalContext
      };
      
      // Enhanced horse context for video analysis
      const horseContext = {
        name: selectedHorse || context.name || 'Monitored Horse',
        age: 8, // Default age
        breed: 'Unknown',
        knownConditions: ['General monitoring'],
        segmentIndex: context.segmentIndex || 1,
        segmentDuration: context.segmentDuration || segmentDuration,
        priority: context.priority || 'high',
        videoMode: true,
        environmentalContext: {
          analysisContext: 'video_segment_analysis',
          recordingMode: context.environmentalContext?.recordingMode || 'unknown',
          sessionDuration: context.environmentalContext?.sessionDuration || 0
        }
      };
      
      // Update upload progress
      setUploadProgress(25);
      
      // Use video analysis method in AI service
      const aiResult = await aiVisionService.analyzeVideoSegment(videoBlob, horseContext);
      
      setUploadProgress(75);
      
      // Convert to our format
      const analysisResult = convertToVideoAnalysisResult(aiResult, metadata);
      
      setUploadProgress(100);
      
      // Update state
      setCurrentAnalysis(analysisResult);
      setAnalysisHistory(prev => [analysisResult, ...prev.slice(0, 49)]);
      
      // Save to localStorage
      try {
        const historyData = {
          timestamp: Date.now(),
          analyses: [analysisResult, ...analysisHistory.slice(0, 9)],
          metadata: {
            totalAnalyses: analysisCountRef.current,
            averageConfidence: analysisHistory.reduce((acc, a) => acc + a.confidence, 0) / (analysisHistory.length || 1)
          }
        };
        localStorage.setItem('videoAnalysisHistory', JSON.stringify(historyData));
      } catch (storageError) {
        console.warn('Failed to save video analysis to localStorage:', storageError);
      }
      
      lastAnalysisTimeRef.current = Date.now();
      
      // Reset upload progress after a delay
      setTimeout(() => setUploadProgress(0), 2000);
      
      return analysisResult;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown video analysis error';
      setAnalysisError(errorMessage);
      console.error('🚨 Video analysis failed:', error);
      
      // Create fallback analysis
      const fallbackAnalysis: IVideoAnalysisResult = {
        timestamp: new Date().toISOString(),
        horseDetected: true,
        confidence: 0.1,
        healthRisk: 0.3,
        behaviorScore: 50,
        activityLevel: 50,
        alerts: ['Video analysis temporarily unavailable'],
        insights: ['Video segment recorded', 'Manual review recommended'],
        recommendations: ['Check AI service configuration', 'Verify internet connection'],
        alertLevel: 'low',
        metadata: {
          captureTimestamp: new Date().toISOString(),
          segmentIndex: context.segmentIndex || 1,
          videoDuration: context.segmentDuration || segmentDuration,
          videoSize: videoBlob.size,
          uploadTime: Date.now(),
          sessionId: context.sessionId,
          analysisSequence: analysisCountRef.current,
          errorOccurred: true,
          errorMessage: errorMessage
        },
        videoDuration: context.segmentDuration || segmentDuration,
        videoSize: videoBlob.size,
        uploadTime: Date.now()
      };
      
      setCurrentAnalysis(fallbackAnalysis);
      setUploadProgress(0);
      return fallbackAnalysis;
      
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedHorse, segmentDuration, analysisHistory]);
  
  /**
   * Clear analysis history
   */
  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
    setCurrentAnalysis(null);
    localStorage.removeItem('videoAnalysisHistory');
    analysisCountRef.current = 0;
  }, []);
  
  /**
   * Get analysis trends
   */
  const getAnalysisTrends = useCallback(() => {
    const recentHistory = analysisHistory.slice(0, 20);
    
    return {
      riskTrend: recentHistory.map(a => a.healthRisk * 100),
      confidenceTrend: recentHistory.map(a => a.confidence * 100),
      timestamps: recentHistory.map(a => a.timestamp)
    };
  }, [analysisHistory]);
  
  /**
   * Check if analysis needs immediate attention
   */
  const needsImmediateAttention = useCallback((analysis?: IVideoAnalysisResult): boolean => {
    const checkAnalysis = analysis || currentAnalysis;
    if (!checkAnalysis) return false;
    
    return checkAnalysis.alertLevel === 'urgent' || 
           checkAnalysis.healthRisk > 0.8 ||
           checkAnalysis.alerts.some((alert: string) => 
             alert.toLowerCase().includes('urgent') || 
             alert.toLowerCase().includes('emergency') ||
             alert.toLowerCase().includes('colic') ||
             alert.toLowerCase().includes('lameness')
           );
  }, [currentAnalysis]);
  
  /**
   * Generate care recommendations
   */
  const generateRecommendations = useCallback((analysis?: IVideoAnalysisResult): string[] => {
    const checkAnalysis = analysis || currentAnalysis;
    if (!checkAnalysis) return ['No analysis available'];
    
    const recommendations: string[] = [...checkAnalysis.recommendations];
    
    // Add context-based recommendations
    if (checkAnalysis.healthRisk > 0.7) {
      recommendations.unshift('🚨 High risk detected - consider veterinary consultation');
    }
    
    if (checkAnalysis.behaviorScore < 40) {
      recommendations.push('📊 Low behavior score - monitor for signs of distress');
    }
    
    if (checkAnalysis.activityLevel < 30) {
      recommendations.push('⚡ Low activity detected - check for lameness or illness');
    }
    
    if (checkAnalysis.confidence < 0.5) {
      recommendations.push('🔍 Low confidence analysis - consider better lighting or positioning');
    }
    
    // Video-specific recommendations
    if (checkAnalysis.videoSize < 1024 * 1024) { // Less than 1MB
      recommendations.push('📹 Video segment was small - ensure adequate recording quality');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }, [currentAnalysis]);
  
  return {
    // Analysis state
    currentAnalysis,
    analysisHistory,
    isAnalyzing,
    analysisError,
    
    // Video segment analysis
    analyzeVideoSegment,
    clearHistory,
    getAnalysisTrends,
    
    // Upload progress
    uploadProgress,
    queueStatus,
    
    // Utility functions
    needsImmediateAttention,
    generateRecommendations
  };
}; 