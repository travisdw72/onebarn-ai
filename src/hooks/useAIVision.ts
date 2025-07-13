import { useState, useEffect, useCallback, useRef } from 'react';
import { aiVisionService, IHorseAnalysisResult } from '../services/aiVisionService';
import { IAnalysisResult, IAnalysisMetadata, IMotionDetectionResult } from '../interfaces/CameraTypes';

interface UseAIVisionProps {
  autoAnalysis?: boolean;
  monitoringMode?: 'realtime' | 'standard' | 'efficient';
  selectedHorse?: string;
  motionDetectionEnabled?: boolean;
}

interface UseAIVisionReturn {
  // Analysis state
  currentAnalysis: IAnalysisResult | null;
  analysisHistory: IAnalysisResult[];
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Motion detection
  motionDetected: boolean;
  lastMotionTime: number;
  motionResult: IMotionDetectionResult | null;
  
  // Analysis control
  analyzeImage: (imageData: string, forceAnalysis?: boolean) => Promise<IAnalysisResult>;
  clearHistory: () => void;
  getAnalysisTrends: () => {
    riskTrend: number[];
    confidenceTrend: number[];
    timestamps: string[];
  };
  
  // Queue management
  queueStatus: {
    queueSize: number;
    isProcessing: boolean;
    successRate: number;
    dynamicInterval: number;
  };
  
  // Utility functions
  needsImmediateAttention: (analysis?: IAnalysisResult) => boolean;
  generateRecommendations: (analysis?: IAnalysisResult) => string[];
}

export const useAIVision = ({
  autoAnalysis = false,
  monitoringMode = 'standard',
  selectedHorse = '',
  motionDetectionEnabled = true
}: UseAIVisionProps = {}): UseAIVisionReturn => {
  
  // Analysis state
  const [currentAnalysis, setCurrentAnalysis] = useState<IAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<IAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Motion detection state
  const [motionDetected, setMotionDetected] = useState(false);
  const [lastMotionTime, setLastMotionTime] = useState<number>(0);
  const [motionResult, setMotionResult] = useState<IMotionDetectionResult | null>(null);
  
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
   * Load analysis history from localStorage and AI service
   */
  const loadAnalysisHistory = useCallback(() => {
    try {
      // Load from localStorage
      const saved = localStorage.getItem('horseAnalysisHistory');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.analyses && Array.isArray(data.analyses)) {
          setAnalysisHistory(data.analyses);
        }
      }
      
             // Also load from AI service and convert to our format
       const serviceHistory = aiVisionService.getAnalysisHistory(20);
       if (serviceHistory.length > 0) {
         setAnalysisHistory(prev => {
           // Convert service history to our format
           const convertedHistory = serviceHistory.map(aiResult => {
             const metadata: IAnalysisMetadata = {
               captureTimestamp: aiResult.timestamp,
               motionDetected: false,
               monitoringMode: 'standard',
               analysisSequence: 0
             };
             return convertToAnalysisResult(aiResult, metadata);
           });
           
           // Merge and deduplicate by timestamp
           const allAnalyses = [...convertedHistory, ...prev];
           const uniqueAnalyses = allAnalyses.filter((analysis, index, self) => 
             index === self.findIndex(a => a.timestamp === analysis.timestamp)
           );
           return uniqueAnalyses.slice(0, 50); // Keep last 50
         });
       }
    } catch (error) {
      console.warn('Failed to load analysis history:', error);
    }
  }, []);
  
  /**
   * Convert AI service result to our interface format
   */
  const convertToAnalysisResult = useCallback((
    aiResult: IHorseAnalysisResult, 
    metadata: IAnalysisMetadata
  ): IAnalysisResult => {
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
      riskAssessment: aiResult.riskAssessment
    };
  }, []);
  
  /**
   * Analyze image with AI service
   */
  const analyzeImage = useCallback(async (
    imageData: string, 
    forceAnalysis: boolean = false
  ): Promise<IAnalysisResult> => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    analysisCountRef.current++;
    
    try {
      const horseContext = {
        name: selectedHorse || 'Monitored Horse',
        age: 8, // Default age
        breed: 'Unknown',
        knownConditions: ['General monitoring'],
        motionDetected: motionDetected,
        lastMotionTime: lastMotionTime,
        monitoringMode: monitoringMode,
        analysisSequence: analysisCountRef.current,
        priority: (forceAnalysis ? 'urgent' : 
                 motionDetected ? 'high' : 
                 monitoringMode === 'realtime' ? 'medium' : 'low') as 'high' | 'medium' | 'low' | 'urgent',
        environmentalContext: {
          lightingCondition: 'unknown',
          timeOfDay: new Date().getHours() >= 6 && new Date().getHours() <= 18 ? 'day' : 'night',
          analysisContext: autoAnalysis ? 'continuous_monitoring' : 'manual_capture'
        }
      };
      
      // Use appropriate analysis method based on force flag
      const aiResult = forceAnalysis 
        ? await aiVisionService.forceAnalysis(imageData, horseContext)
        : await aiVisionService.analyzeHorseImage(imageData, horseContext);
      
      // Create metadata
      const metadata: IAnalysisMetadata = {
        captureTimestamp: new Date().toISOString(),
        motionDetected: motionDetected,
        monitoringMode: monitoringMode,
        analysisSequence: analysisCountRef.current,
        queueStatus: aiVisionService.getQueueStatus(),
        environmentalFactors: horseContext.environmentalContext
      };
      
      // Convert to our format
      const analysisResult = convertToAnalysisResult(aiResult, metadata);
      
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
        localStorage.setItem('horseAnalysisHistory', JSON.stringify(historyData));
      } catch (storageError) {
        console.warn('Failed to save analysis to localStorage:', storageError);
      }
      
      lastAnalysisTimeRef.current = Date.now();
      return analysisResult;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown analysis error';
      setAnalysisError(errorMessage);
      console.error('🚨 AI Vision analysis failed:', error);
      
      // Create fallback analysis
      const fallbackAnalysis: IAnalysisResult = {
        timestamp: new Date().toISOString(),
        horseDetected: true,
        confidence: 0.1,
        healthRisk: 0.3,
        behaviorScore: 50,
        activityLevel: 50,
        alerts: ['Analysis temporarily unavailable'],
        insights: ['Camera feed is active', 'Manual observation recommended'],
        recommendations: ['Check AI service configuration', 'Verify internet connection'],
        alertLevel: 'low',
        metadata: {
          captureTimestamp: new Date().toISOString(),
          motionDetected: motionDetected,
          monitoringMode: monitoringMode,
          analysisSequence: analysisCountRef.current,
          errorOccurred: true,
          errorMessage: errorMessage
        }
      };
      
      setCurrentAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
      
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedHorse, motionDetected, lastMotionTime, monitoringMode, autoAnalysis, analysisHistory]);
  
  /**
   * Update motion detection result
   */
  const updateMotionDetection = useCallback((result: IMotionDetectionResult) => {
    setMotionResult(result);
    
    if (result.motionDetected !== motionDetected) {
      setMotionDetected(result.motionDetected);
      if (result.motionDetected) {
        setLastMotionTime(Date.now());
      }
    }
  }, [motionDetected]);
  
  /**
   * Clear analysis history
   */
  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
    setCurrentAnalysis(null);
    localStorage.removeItem('horseAnalysisHistory');
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
  const needsImmediateAttention = useCallback((analysis?: IAnalysisResult): boolean => {
    const checkAnalysis = analysis || currentAnalysis;
    if (!checkAnalysis) return false;
    
    return checkAnalysis.alertLevel === 'urgent' || 
           checkAnalysis.healthRisk > 0.8 ||
           checkAnalysis.alerts.some(alert => 
             alert.toLowerCase().includes('urgent') || 
             alert.toLowerCase().includes('emergency') ||
             alert.toLowerCase().includes('colic') ||
             alert.toLowerCase().includes('lameness')
           );
  }, [currentAnalysis]);
  
  /**
   * Generate care recommendations
   */
  const generateRecommendations = useCallback((analysis?: IAnalysisResult): string[] => {
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
    
    // Motion-based recommendations
    if (motionDetected && checkAnalysis.alertLevel === 'high') {
      recommendations.unshift('🏃 Motion + high alert - immediate attention recommended');
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }, [currentAnalysis, motionDetected]);
  
  // Expose motion detection update function (for use in camera components)
  (useAIVision as any).updateMotionDetection = updateMotionDetection;
  
  return {
    // Analysis state
    currentAnalysis,
    analysisHistory,
    isAnalyzing,
    analysisError,
    
    // Motion detection
    motionDetected,
    lastMotionTime,
    motionResult,
    
    // Analysis control
    analyzeImage,
    clearHistory,
    getAnalysisTrends,
    
    // Queue management
    queueStatus,
    
    // Utility functions
    needsImmediateAttention,
    generateRecommendations
  };
};

// Export motion detection helper for camera components
export const createMotionDetector = () => {
  let lastFrame: ImageData | null = null;
  
  return (
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement, 
    sensitivity: number = 0.3
  ): IMotionDetectionResult | null => {
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current frame
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);
    
    if (!lastFrame) {
      lastFrame = currentFrame;
      return {
        motionDetected: false,
        motionIntensity: 0,
        motionAreas: [],
        timestamp: new Date().toISOString()
      };
    }
    
    // Simple motion detection by comparing pixel differences
    let diffCount = 0;
    const threshold = 50 * sensitivity;
    const totalPixels = canvas.width * canvas.height;
    const minDiffPixels = totalPixels * 0.01; // 1% of pixels must change
    
    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const rDiff = Math.abs(currentFrame.data[i] - lastFrame.data[i]);
      const gDiff = Math.abs(currentFrame.data[i + 1] - lastFrame.data[i + 1]);
      const bDiff = Math.abs(currentFrame.data[i + 2] - lastFrame.data[i + 2]);
      
      if (rDiff + gDiff + bDiff > threshold) {
        diffCount++;
      }
    }
    
    const motionDetected = diffCount > minDiffPixels;
    const motionIntensity = Math.min(1, diffCount / minDiffPixels);
    
    lastFrame = currentFrame;
    
    return {
      motionDetected,
      motionIntensity,
      motionAreas: [], // Could be enhanced with zone detection
      timestamp: new Date().toISOString(),
      frameComparison: {
        pixelDifference: diffCount,
        significantChanges: diffCount
      }
    };
  };
}; 