// Camera-specific TypeScript interfaces for horse monitoring system

export interface ICameraFeedProps {
  onFrameCapture?: (imageData: string) => void;
  onAIAnalysis?: (analysisData: IAnalysisResult) => void;
  selectedHorse?: string;
  autoAnalysis?: boolean;
  monitoringMode?: 'realtime' | 'standard' | 'efficient';
}

export interface IAnalysisResult {
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
  
  // Enhanced analysis data
  metadata?: IAnalysisMetadata;
  clinicalAssessment?: IClinicalAssessment;
  healthMetrics?: IHealthMetrics;
  riskAssessment?: IRiskAssessment;
}

export interface IAnalysisMetadata {
  captureTimestamp: string;
  motionDetected: boolean;
  monitoringMode: string;
  analysisSequence: number;
  environmentalFactors?: {
    lightingCondition: string;
    timeOfDay: string;
    analysisContext: string;
  };
  queueStatus?: {
    queueSize: number;
    isProcessing: boolean;
    isAnalyzing: boolean;
    consecutiveAnalyses: number;
    successRate: number;
    dynamicInterval: number;
  };
  errorOccurred?: boolean;
  errorMessage?: string;
}

export interface IClinicalAssessment {
  posturalAnalysis: string;
  mobilityAssessment: string;
  respiratoryObservation: string;
  behavioralState: string;
  alertnessLevel: string;
  painIndicators: string[];
  discomfortSigns: string[];
  gaitAnalysis?: string;
  lamenessIndicators?: string[];
}

export interface IHealthMetrics {
  overallHealthScore: number;
  mobilityScore: number;
  behavioralScore: number;
  respiratoryScore: number;
  postureScore: number;
  alertnessScore: number;
  gaitScore?: number;
}

export interface IRiskAssessment {
  overallRiskLevel: string;
  riskScore: number;
  immediateRisks: string[];
  monitoringNeeded: string[];
  concerningObservations: string[];
}

export interface ICameraSettings {
  resolution: {
    width: number;
    height: number;
  };
  facingMode: 'user' | 'environment';
  frameRate?: number;
  deviceId?: string;
}

export interface IMotionDetectionSettings {
  enabled: boolean;
  sensitivity: number; // 0-1 scale
  threshold: number;
  minPixelChange: number;
  motionAreas?: IMotionArea[];
}

export interface IMotionArea {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sensitivity?: number;
}

export interface ICameraError {
  type: 'permission' | 'hardware' | 'network' | 'config' | 'unknown';
  message: string;
  code?: string;
  timestamp: string;
}

export interface IFocusArea {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence?: number;
  type?: 'horse' | 'human' | 'equipment' | 'hazard';
}

export interface ICameraState {
  isStreaming: boolean;
  isAnalyzing: boolean;
  hasError: boolean;
  error: ICameraError | null;
  stream: MediaStream | null;
  deviceInfo?: {
    deviceId: string;
    label: string;
    capabilities: MediaTrackCapabilities;
  };
}

export interface IAnalysisHistory {
  analyses: IAnalysisResult[];
  totalCount: number;
  averageConfidence: number;
  lastAnalysis?: IAnalysisResult;
  trends: {
    riskTrend: 'improving' | 'stable' | 'declining' | 'unknown';
    healthTrend: 'improving' | 'stable' | 'declining' | 'unknown';
    activityTrend: 'increasing' | 'stable' | 'decreasing' | 'unknown';
  };
}

export interface IMonitoringSession {
  sessionId: string;
  startTime: string;
  endTime?: string;
  horseId?: string;
  horseName?: string;
  totalAnalyses: number;
  averageRiskScore: number;
  alertsGenerated: number;
  monitoringMode: 'realtime' | 'standard' | 'efficient';
  sessionNotes?: string;
}

export interface ICameraControlsProps {
  isStreaming: boolean;
  isAnalyzing: boolean;
  autoAnalysis: boolean;
  monitoringMode: 'realtime' | 'standard' | 'efficient';
  selectedHorse: string;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCaptureAnalyze: () => void;
  onAutoAnalysisChange: (enabled: boolean) => void;
  onMonitoringModeChange: (mode: 'realtime' | 'standard' | 'efficient') => void;
  onHorseSelectionChange: (horseId: string) => void;
  nextAnalysisCountdown?: number;
}

export interface IAnalysisDisplayProps {
  analysis: IAnalysisResult | null;
  isAnalyzing: boolean;
  showDetailed?: boolean;
  onShowDetails?: (analysis: IAnalysisResult) => void;
}

export interface IMotionDetectionResult {
  motionDetected: boolean;
  motionIntensity: number; // 0-1 scale
  motionAreas: IMotionArea[];
  timestamp: string;
  frameComparison?: {
    pixelDifference: number;
    significantChanges: number;
  };
}

export interface IAICommentaryItem {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  analysis?: IAnalysisResult;
  metadata?: {
    motionDetected: boolean;
    confidence: number;
    riskLevel: string;
  };
}

export interface ICameraConfiguration {
  cameras: {
    [key: string]: {
      name: string;
      location: string;
      features: string[];
      monitoringZones: string[];
      defaultSettings: ICameraSettings;
    };
  };
  defaultMonitoringMode: 'realtime' | 'standard' | 'efficient';
  analysisIntervals: {
    realtime: number;
    standard: number;
    efficient: number;
  };
  motionDetection: IMotionDetectionSettings;
  aiAnalysis: {
    confidenceThreshold: number;
    maxRetries: number;
    queueSize: number;
    rateLimiting: {
      maxRequestsPerMinute: number;
      adaptiveIntervals: boolean;
    };
  };
}

// Utility type guards
export const isAnalysisResult = (obj: any): obj is IAnalysisResult => {
  return obj && 
         typeof obj.timestamp === 'string' &&
         typeof obj.horseDetected === 'boolean' &&
         typeof obj.confidence === 'number' &&
         Array.isArray(obj.alerts) &&
         Array.isArray(obj.insights);
};

export const isCameraError = (obj: any): obj is ICameraError => {
  return obj && 
         typeof obj.type === 'string' &&
         typeof obj.message === 'string' &&
         typeof obj.timestamp === 'string';
};

export const isMotionDetectionResult = (obj: any): obj is IMotionDetectionResult => {
  return obj && 
         typeof obj.motionDetected === 'boolean' &&
         typeof obj.motionIntensity === 'number' &&
         typeof obj.timestamp === 'string';
};

// Default configurations
export const defaultCameraSettings: ICameraSettings = {
  resolution: {
    width: 1280,
    height: 720
  },
  facingMode: 'environment',
  frameRate: 30
};

export const defaultMotionDetectionSettings: IMotionDetectionSettings = {
  enabled: true,
  sensitivity: 0.3,
  threshold: 50,
  minPixelChange: 0.01 // 1% of pixels must change
};

export const defaultCameraConfiguration: ICameraConfiguration = {
  cameras: {
    stall: {
      name: 'Stall Camera',
      location: 'individual_stall',
      features: ['motion_detection', 'night_vision'],
      monitoringZones: ['feeding_area', 'water_area', 'resting_area'],
      defaultSettings: defaultCameraSettings
    }
  },
  defaultMonitoringMode: 'standard',
  analysisIntervals: {
    realtime: 15000,  // 15 seconds
    standard: 30000,  // 30 seconds
    efficient: 60000  // 60 seconds
  },
  motionDetection: defaultMotionDetectionSettings,
  aiAnalysis: {
    confidenceThreshold: 0.7,
    maxRetries: 2,
    queueSize: 5,
    rateLimiting: {
      maxRequestsPerMinute: 30,
      adaptiveIntervals: true
    }
  }
}; 