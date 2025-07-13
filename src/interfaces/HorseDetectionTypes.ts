/**
 * 🐎 Horse Detection Types
 * Interfaces for pre-AI horse detection system
 */

export interface IHorseDetectionResult {
  hasHorse: boolean;                    // Final determination
  confidence: number;                   // 0-1 confidence score
  reason: string;                       // Detection reason/method
  details: any;                         // Detailed analysis results
  processingTime: number;               // Processing time in ms
  recommendSendToAI: boolean;           // Whether to proceed with AI analysis
  tokensSavedEstimate: number;          // Estimated tokens saved if skipped
}

export interface IHorseDetectionConfig {
  // Detection stages to enable
  useColorDetection: boolean;
  useShapeDetection: boolean;
  useMotionDetection: boolean;
  useMachineLearning: boolean;
  
  // Early exit conditions
  skipOnColorFail: boolean;
  skipOnShapeFail: boolean;
  
  // Confidence thresholds
  minimumConfidence: number;            // 0-1, minimum to proceed to AI
  
  // Color detection thresholds
  colorThresholds: {
    minBrownPercentage: number;         // % of brown pixels for horse
    minBlackPercentage: number;         // % of black pixels for horse
    minChestnutPercentage: number;      // % of chestnut pixels for horse
    minWhitePercentage: number;         // % of white pixels for horse
    maxGreenPercentage: number;         // Max green (grass) allowed
    maxSkinPercentage: number;          // 🚫 CRITICAL: Max human skin % before rejection
  };
  
  // Shape detection thresholds
  shapeThresholds: {
    minVerticalShapes: number;          // Horse legs
    minCurvedEdges: number;             // Horse body curves
    minAspectRatio: number;             // Width/height ratio
    maxAspectRatio: number;             // Width/height ratio
  };
  
  // Motion detection thresholds
  motionThresholds: {
    minMotionScore: number;             // Movement threshold
    horseMotionPatterns: string[];      // Expected motion types
  };
  
  // Machine learning thresholds
  mlThresholds: {
    minConfidence: number;              // ML model confidence threshold
    modelUrl?: string;                  // Path to TensorFlow.js model
  };
  
  // Hybrid algorithm weights
  hybridWeights: {
    color: number;                      // Weight for color analysis
    shape: number;                      // Weight for shape analysis  
    motion: number;                     // Weight for motion analysis
    machineLearning: number;            // Weight for ML analysis
  };
  
  // Performance settings
  performance: {
    maxProcessingTime: number;          // Max time before fallback
    enableCaching: boolean;             // Cache detection results
    cacheSize: number;                  // Max cached results
  };
}

export interface IBatchTestResult {
  filename: string;
  filepath: string;
  timestamp: string;
  processingTime: number;
  
  // Final Detection Results
  hasHorse: boolean;
  finalConfidence: number;
  reason: string;
  recommendSendToAI: boolean;
  tokensSavedEstimate: number;
  
  // Stage-by-Stage Results
  colorAnalysis: {
    likely: boolean;
    confidence: number;
    brownPixels: number;
    blackPixels: number;
    chestnutPixels: number;
    whitePixels: number;
    grayPixels: number;
    palominoPixels: number;
    dunPixels: number;
    grassPixels: number;
    totalHorseColorPixels: number;
    rejectionReason?: string;
  };
  
  shapeAnalysis: {
    likely: boolean;
    confidence: number;
    aspectRatio: number;
    shapeScore: number;
    verticalElements: number;
    curvedElements: number;
    edgeDensity: number;
    rejectionReason?: string;
  };
  
  motionAnalysis: {
    likely: boolean;
    confidence: number;
    motionScore: number;
    frameType: string;
  };
  
  // Human Detection Results
  humanSkinDetection: {
    skinPixels: number;
    faceIndicators: number;
    threshold: number;
    shouldReject: boolean;
  };
  
  humanShapeDetection: {
    humanFaceScore: number;
    faceFeatures: number;
    shouldReject: boolean;
  };
  
  // Confidence Breakdown
  confidenceBreakdown: {
    colorConfidence: number;
    shapeConfidence: number;
    motionConfidence: number;
    finalConfidence: number;
    weightedCalculation: string;
  };
  
  // Image Metadata
  imageMetadata: {
    width: number;
    height: number;
    aspectRatio: number;
    fileSize?: number;
    pixelCount: number;
  };
  
  // Debug Information
  debugInfo: {
    configMode: string;
    minimumConfidence: number;
    processingStages: string[];
    cacheHit: boolean;
    earlyExitStage?: string;
    errorDetails?: string;
  };
}

export interface IBatchTestSummary {
  totalImages: number;
  horsesDetected: number;
  horsesRejected: number;
  humanFacesRejected: number;
  blackScreensRejected: number;
  lowContentRejected: number;
  
  totalTokensSaved: number;
  totalCostSavings: number;
  
  averageProcessingTime: number;
  averageConfidence: number;
  
  configurationUsed: string;
  testStartTime: string;
  testEndTime: string;
  testDuration: number;
  
  accuracyMetrics: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

export interface IBatchTestReport {
  summary: IBatchTestSummary;
  results: IBatchTestResult[];
  errors: Array<{
    filename: string;
    error: string;
    timestamp: string;
  }>;
} 