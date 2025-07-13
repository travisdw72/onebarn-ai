export interface IVideoAnalysisMetadata {
  captureTimestamp: string;
  segmentIndex: number;
  videoDuration: number;
  videoSize: number;
  processingTime?: number;
  totalFrames?: number;
  successfulFrames?: number;
  fallbackUsed?: boolean;
  uploadTime?: number;
  sessionId?: string;
  analysisSequence?: number;
  environmentalFactors?: any;
  errorOccurred?: boolean;
  errorMessage?: string;
}

export interface IVideoAnalysisResult {
  timestamp: string;
  horseDetected: boolean;
  confidence: number;
  healthRisk: number;
  behaviorScore: number;
  activityLevel: number;
  alerts: string[];
  insights: string[];
  recommendations: string[];
  alertLevel: 'low' | 'medium' | 'high' | 'urgent';
  metadata: IVideoAnalysisMetadata;
  
  // Clinical data from AI
  clinicalAssessment?: {
    posturalAnalysis: string;
    mobilityAssessment: string;
    respiratoryObservation: string;
    behavioralState: string;
    alertnessLevel: string;
    painIndicators: string[];
    discomfortSigns: string[];
    gaitAnalysis?: string;
    lamenessIndicators?: string[];
  };
  
  healthMetrics?: {
    overallHealthScore: number;
    mobilityScore: number;
    behavioralScore: number;
    respiratoryScore: number;
    postureScore: number;
    alertnessScore: number;
    gaitScore?: number;
  };
  
  riskAssessment?: {
    overallRiskLevel: string;
    riskScore: number;
    immediateRisks: string[];
    monitoringNeeded: string[];
    concerningObservations: string[];
  };
  
  // Video-specific properties
  videoDuration: number;
  videoSize: number;
  uploadTime: number;
}

// Enhanced video analysis result that matches aiPromptsConfig structure
export interface IEnhancedVideoAnalysisResult {
  timestamp: string;
  horseDetected: boolean;
  confidence: number;
  healthRisk: number;
  behaviorScore: number;
  activityLevel: number;
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Scene description from AI analysis
  sceneDescription?: {
    environment: {
      setting: string;
      surfaceType: string;
      surfaceCondition: string;
      lighting: string;
      weatherVisible: string;
    };
    horseDescription: {
      coatColor: string;
      markings: string;
      approximateSize: string;
      bodyCondition: string;
      tackEquipment: string[];
    };
    positioning: {
      locationInFrame: string;
      orientation: string;
      distanceFromCamera: string;
      postureGeneral: string;
    };
    backgroundElements: string[];
    cameraQuality: {
      imageClarity: string;
      cameraAngle: string;
      fieldOfView: string;
    };
    overallSceneAssessment: string;
  };
  
  healthMetrics: {
    overallHealthScore: number;
    mobilityScore: number;
    behavioralScore: number;
    respiratoryScore: number;
    postureScore: number;
  };
  
  clinicalAssessment: {
    posturalAnalysis: string;
    mobilityAssessment: string;
    respiratoryObservation: string;
    behavioralNotes: string;
  };
  
  alerts: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
  }>;
  
  riskAssessment: {
    overallRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskScore: number;
    immediateRisks: string[];
    monitoringNeeded: string[];
  };
  
  recommendations: string[];
  insights: string[];
  metadata: IVideoAnalysisMetadata;
}

export interface IVideoSegmentContext {
  name?: string;
  segmentIndex?: number;
  segmentDuration?: number;
  sessionId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  videoMode?: boolean;
  environmentalContext?: {
    analysisContext?: string;
    recordingMode?: string;
    sessionDuration?: number;
  };
} 