/**
 * Manager Demo Configuration - Single Source of Truth
 * Comprehensive demo configuration integrating AI vision analysis with video demonstrations
 * 
 * @description Configuration-driven demo system for manager dashboard
 * @compliance Data privacy compliant with proper AI prompt integration
 * @security Zero Trust with appropriate AI prompt security levels
 * @author One Barn Development Team
 * @since v2.0.0
 * @updated v2.0.0 - Initial creation with AI vision integration
 */

import { brandConfig } from './brandConfig';
import type { IVisionPromptConfig } from './aiVisionPromptsConfig';
import { 
  getVisionPrompt, 
  getPhotoSequencePrompt, 
  getMetaAnalysisPrompt,
  validatePhotoSequence,
  validateMetaAnalysisInput
} from './aiVisionPromptsConfig';

// Import the single source of truth for videos
import { CORE_DEMO_VIDEOS, type IVideoConfig } from './videoConfig';

// ============================================================================
// DEMO CONFIGURATION INTERFACES
// ============================================================================

export interface IDemoVideoOption {
  id: string;
  name: string;
  description: string;
  filename: string;
  url: string;
  duration: string;
  analysisType: 'lameness' | 'gait' | 'behavior' | 'general' | 'emergency' | 'colic' | 'foaling';
  features: string[];
  aiPromptConfig: {
    primaryPromptId: string;
    metaPromptId?: string;
    analysisSettings: {
      captureInterval: number; // seconds
      totalCaptures: number;
      analysisDepth: 'basic' | 'detailed' | 'comprehensive';
      realTimeCapable: boolean;
    };
    expectedResults: {
      primaryFindings: string[];
      riskIndicators: string[];
      behaviorPatterns: string[];
      healthMetrics: string[];
    };
  };
  demoSettings: {
    autoPlay: boolean;
    showControls: boolean;
    loopVideo: boolean;
    startTime?: number; // seconds
    highlightSegments?: Array<{
      start: number;
      end: number;
      description: string;
      analysisType: string;
    }>;
  };
}

export interface IAIDemoSettings {
  analysis: {
    frameCapture: {
      intervalSeconds: number;
      maxPhotos: number;
      photoResolution: string;
      autoStop: boolean;
    };
    prompts: {
      individualPhotoPromptId: string;
      metaAnalysisPromptId: string;
      emergencyScreeningPromptId: string;
    };
    thresholds: {
      confidenceMinimum: number;
      emergencyConfidence: number;
      healthRiskThreshold: number;
    };
    output: {
      structuredJSON: boolean;
      humanReadable: boolean;
      rawAIResponse: boolean;
      visualAnnotations: boolean;
    };
  };
  demonstration: {
    videos: {
      autoSelectBest: boolean;
      fallbackToDefault: boolean;
      supportedFormats: string[];
      maxFileSize: number; // bytes
    };
    ui: {
      showProgress: boolean;
      displayTimestamps: boolean;
      enableVideoSwitching: boolean;
      showAnalysisInRealTime: boolean;
    };
    results: {
      autoExpandDetails: boolean;
      highlightCriticalFindings: boolean;
      enableComparison: boolean;
      showConfidenceScores: boolean;
    };
  };
}

export interface IDemoAnalysisResult {
  photoNumber: number;
  timestamp: string;
  frameDataUrl: string;
  analysis: {
    raw: any; // Raw AI response
    formatted: {
      overallHealthScore: number;
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
      primaryFindings: string[];
      behavioralObservations: string[];
      healthMetrics: Record<string, number>;
      recommendations: string[];
      sceneDescription: string;
    };
    confidence: number;
    processingTime: number;
  };
  metadata: {
    videoId: string;
    analysisType: string;
    promptUsed: string;
    captureQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export interface IDemoMetaAnalysis {
  summary: {
    totalPhotosAnalyzed: number;
    averageConfidence: number;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    analysisConsistency: 'high' | 'medium' | 'low';
  };
  trends: {
    healthProgression: 'improving' | 'stable' | 'declining' | 'variable';
    behavioralPatterns: string[];
    riskFactors: string[];
    keyInsights: string[];
  };
  recommendations: {
    immediate: string[];
    monitoring: string[];
    followUp: string[];
    veterinaryConsultation: {
      recommended: boolean;
      urgency: 'routine' | 'soon' | 'urgent' | 'immediate';
      concerns: string[];
    };
  };
  dataQuality: {
    reliability: number;
    limitations: string[];
    confidenceFactors: string[];
  };
}

// ============================================================================
// DEMO VIDEOS CONFIGURATION WITH AI INTEGRATION
// ============================================================================

export const demoVideosConfig: IDemoVideoOption[] = CORE_DEMO_VIDEOS.map(video => ({
  id: video.id,
  name: video.name,
  description: video.description,
  filename: video.filename,
  url: video.url,
  duration: video.duration,
  analysisType: video.analysisType,
  features: video.features,
  aiPromptConfig: {
    primaryPromptId: video.aiPromptConfig.primaryPromptId,
    metaPromptId: video.aiPromptConfig.metaPromptId,
    analysisSettings: {
      captureInterval: video.aiPromptConfig.analysisSettings.captureInterval,
      totalCaptures: video.aiPromptConfig.analysisSettings.totalCaptures,
      analysisDepth: video.aiPromptConfig.analysisSettings.analysisDepth,
      realTimeCapable: video.aiPromptConfig.analysisSettings.realTimeCapable
    },
    expectedResults: {
      primaryFindings: video.aiPromptConfig.expectedResults.primaryFindings,
      riskIndicators: video.aiPromptConfig.expectedResults.riskIndicators,
      behaviorPatterns: video.aiPromptConfig.expectedResults.behaviorPatterns,
      healthMetrics: video.aiPromptConfig.expectedResults.healthMetrics
    }
  },
  demoSettings: {
    autoPlay: false, // Default to false for demo
    showControls: true,
    loopVideo: true,
    startTime: video.demoSettings?.startTime,
    highlightSegments: video.demoSettings?.highlightSegments
  }
}));

// ============================================================================
// AI DEMO SETTINGS CONFIGURATION
// ============================================================================

export const aiDemoSettings: IAIDemoSettings = {
  analysis: {
    frameCapture: {
      intervalSeconds: 6,
      maxPhotos: 10,
      photoResolution: '512x512',
      autoStop: true
    },
    prompts: {
      individualPhotoPromptId: 'horsePhotoSequenceAnalysis',
      metaAnalysisPromptId: 'metaPhotoSequenceAnalysis',
      emergencyScreeningPromptId: 'emergencyVideoScreening'
    },
    thresholds: {
      confidenceMinimum: 0.7,
      emergencyConfidence: 0.5,
      healthRiskThreshold: 0.8
    },
    output: {
      structuredJSON: true,
      humanReadable: true,
      rawAIResponse: true,
      visualAnnotations: false
    }
  },
  demonstration: {
    videos: {
      autoSelectBest: true,
      fallbackToDefault: true,
      supportedFormats: ['mp4', 'webm', 'ogg'],
      maxFileSize: 1073741824 // 1GB
    },
    ui: {
      showProgress: true,
      displayTimestamps: true,
      enableVideoSwitching: true,
      showAnalysisInRealTime: true
    },
    results: {
      autoExpandDetails: false,
      highlightCriticalFindings: true,
      enableComparison: true,
      showConfidenceScores: true
    }
  }
};

// ============================================================================
// DEMO CONFIGURATION CONTENT
// ============================================================================

export const demoConfig = {
  // 🎯 Demo header content
  header: {
    title: 'AI Vision Technology Demonstration',
    subtitle: 'Real-time equine health analysis using advanced computer vision',
    description: 'Experience our cutting-edge AI technology that analyzes horse health, behavior, and movement patterns through video monitoring.',
    badge: '✨ LIVE DEMO'
  },

  // 📋 Demo sections
  sections: {
    videoSelection: {
      title: 'Video Selection',
      description: 'Choose from our library of demonstration videos showcasing different analysis types',
      icon: '🎥'
    },
    liveAnalysis: {
      title: 'Live Analysis',
      description: 'Watch as our AI analyzes video frames in real-time',
      icon: '🔍'
    },
    results: {
      title: 'Analysis Results',
      description: 'View detailed AI insights with confidence scores and recommendations',
      icon: '📊'
    },
    metaAnalysis: {
      title: 'Comprehensive Assessment',
      description: 'Final integrated analysis combining all observations',
      icon: '🧠'
    }
  },

  // 🎮 Demo controls
  controls: {
    startAnalysis: 'Start AI Analysis',
    stopAnalysis: 'Stop Analysis',
    resetDemo: 'Reset Demo',
    switchVideo: 'Switch Video',
    viewResults: 'View Results',
    downloadReport: 'Download Report'
  },

  // 📊 Analysis status messages
  statusMessages: {
    idle: 'Ready to begin analysis',
    initializing: 'Initializing AI vision system...',
    capturing: 'Capturing frame {{current}} of {{total}}...',
    analyzing: 'Analyzing photo {{current}} with AI...',
    processing: 'Processing AI response...',
    metaAnalyzing: 'Performing comprehensive meta-analysis...',
    complete: 'Analysis complete! {{total}} photos analyzed.',
    error: 'Analysis error: {{error}}',
    stopping: 'Stopping analysis...'
  },

  // ⚠️ Warning and info messages
  messages: {
    demoDisclaimer: 'This is a demonstration of AI analysis capabilities. Results are for educational purposes only.',
    aiLimitations: 'AI analysis supplements but does not replace professional veterinary examination.',
    privacyNotice: 'Demo videos are used with permission for educational purposes only.',
    confidenceNote: 'Confidence scores indicate AI certainty level (0-100%). Higher scores indicate more reliable assessments.',
    realTimeNote: 'Real-time analysis captures frames every 6 seconds for comprehensive temporal assessment.'
  },

  // 🎨 Visual elements
  visual: {
    progressColors: {
      capturing: brandConfig.colors.earthyTan,
      analyzing: brandConfig.colors.hunterGreen,
      processing: brandConfig.colors.stableMahogany,
      complete: brandConfig.colors.forestGreen
    },
    statusIcons: {
      idle: '⏸️',
      capturing: '📸',
      analyzing: '🔍',
      processing: '⚙️',
      complete: '✅',
      error: '❌'
    },
    riskLevelColors: {
      low: brandConfig.colors.forestGreen,
      medium: brandConfig.colors.earthyTan,
      high: brandConfig.colors.rusticRed,
      critical: brandConfig.colors.emergencyRed
    }
  },

  // 📈 Expected demo outcomes
  expectedOutcomes: {
    lameness: {
      primaryFindings: ['Gait asymmetry detection', 'Weight bearing assessment'],
      confidence: 0.85,
      riskLevel: 'medium'
    },
    gait: {
      primaryFindings: ['Natural movement patterns', 'Coordinated locomotion'],
      confidence: 0.92,
      riskLevel: 'low'
    },
    behavior: {
      primaryFindings: ['Normal behavioral responses', 'Environmental awareness'],
      confidence: 0.78,
      riskLevel: 'low'
    },
    emergency: {
      primaryFindings: ['Emergency situation detected', 'Immediate intervention required'],
      confidence: 0.95,
      riskLevel: 'critical'
    },
    colic: {
      primaryFindings: ['Pain behavior indicators', 'Colic symptoms present'],
      confidence: 0.88,
      riskLevel: 'high'
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getVideoByAnalysisType = (type: IDemoVideoOption['analysisType']): IDemoVideoOption[] => {
  return demoVideosConfig.filter(video => video.analysisType === type);
};

export const getVideoById = (id: string): IDemoVideoOption | undefined => {
  return demoVideosConfig.find(video => video.id === id);
};

export const getDefaultVideo = (): IDemoVideoOption => {
  return demoVideosConfig[0]; // Default to lameness analysis
};

export const getAIPromptForVideo = (videoId: string): IVisionPromptConfig | null => {
  const video = getVideoById(videoId);
  if (!video) return null;
  
  return getPhotoSequencePrompt(video.aiPromptConfig.primaryPromptId);
};

export const getMetaAnalysisPromptForDemo = (): IVisionPromptConfig | null => {
  return getMetaAnalysisPrompt();
};

export const validateDemoConfiguration = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate all videos have valid AI prompt configurations
  demoVideosConfig.forEach(video => {
    const prompt = getAIPromptForVideo(video.id);
    if (!prompt) {
      errors.push(`Video ${video.id} has invalid AI prompt configuration`);
    }
    
    // Check if video file exists (this would be done at runtime)
    if (!video.url.startsWith('/')) {
      errors.push(`Video ${video.id} has invalid URL format`);
    }
  });
  
  // Validate meta-analysis prompt exists
  const metaPrompt = getMetaAnalysisPromptForDemo();
  if (!metaPrompt) {
    errors.push('Meta-analysis prompt not found');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const getDemoStatusMessage = (
  status: keyof typeof demoConfig.statusMessages,
  variables?: Record<string, string | number>
): string => {
  let message = demoConfig.statusMessages[status];
  
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(`{{${key}}}`, String(value));
    });
  }
  
  return message;
};

export const formatAnalysisForDemo = (rawAnalysis: any): IDemoAnalysisResult['analysis']['formatted'] => {
  // Format raw AI analysis for demo display
  return {
    overallHealthScore: rawAnalysis.healthMetrics?.overallHealthScore || 0,
    riskLevel: rawAnalysis.riskAssessment?.overallRiskLevel || 'low',
    primaryFindings: rawAnalysis.insights || [],
    behavioralObservations: rawAnalysis.clinicalAssessment?.behavioralNotes ? [rawAnalysis.clinicalAssessment.behavioralNotes] : [],
    healthMetrics: rawAnalysis.healthMetrics || {},
    recommendations: rawAnalysis.recommendations || [],
    sceneDescription: rawAnalysis.sceneDescription?.overallSceneAssessment || 'Scene analysis not available'
  };
};

export const calculateOverallDemoScore = (analyses: IDemoAnalysisResult[]): number => {
  if (analyses.length === 0) return 0;
  
  const totalScore = analyses.reduce((sum, analysis) => sum + analysis.analysis.formatted.overallHealthScore, 0);
  return Math.round(totalScore / analyses.length);
};

export const identifyDemoCriticalFindings = (analyses: IDemoAnalysisResult[]): string[] => {
  const criticalFindings: string[] = [];
  
  analyses.forEach(analysis => {
    if (analysis.analysis.formatted.riskLevel === 'critical' || analysis.analysis.formatted.riskLevel === 'high') {
      criticalFindings.push(...analysis.analysis.formatted.primaryFindings);
    }
  });
  
  // Remove duplicates
  return [...new Set(criticalFindings)];
};

export default {
  videos: demoVideosConfig,
  aiSettings: aiDemoSettings,
  demo: demoConfig,
  utils: {
    getVideoByAnalysisType,
    getVideoById,
    getDefaultVideo,
    getAIPromptForVideo,
    getMetaAnalysisPromptForDemo,
    validateDemoConfiguration,
    getDemoStatusMessage,
    formatAnalysisForDemo,
    calculateOverallDemoScore,
    identifyDemoCriticalFindings
  }
}; 