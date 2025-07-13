/**
 * Video Configuration - Single Source of Truth
 * All video references throughout the app should use this config
 * 
 * @description Configuration for the 4 core demo videos
 * @author One Barn Development Team
 * @since v2.0.0
 */

export interface IVideoConfig {
  id: string;
  name: string;
  description: string;
  filename: string;
  url: string;
  duration: string;
  category: 'colic' | 'lameness' | 'emergency' | 'gait';
  analysisType: 'colic' | 'lameness' | 'emergency' | 'gait';
  difficulty: 'Critical' | 'Advanced' | 'Professional' | 'Intermediate';
  features: string[];
  expectedFindings: string[];
  size: number; // bytes
}

// ============================================================================
// SINGLE SOURCE OF TRUTH - THE 4 CORE DEMO VIDEOS
// ============================================================================

export const CORE_DEMO_VIDEOS: IVideoConfig[] = [
  {
    id: 'colic-detection',
    name: '🤒 Colic Behavior Analysis',
    description: 'Common colic behaviors and symptoms for early detection and health monitoring',
    filename: 'Horse_colic_common_behavior.mp4',
    url: '/video/Horse_colic_common_behavior.mp4',
    duration: '2:50',
    category: 'colic',
    analysisType: 'colic',
    difficulty: 'Critical',
    features: [
      'Colic symptom detection',
      'Pain behavior recognition',
      'Early warning signs',
      'Health status monitoring',
      'Veterinary alert triggers'
    ],
    expectedFindings: ['Pain Indicators', 'Discomfort Signs', 'Emergency Protocols'],
    size: 6700000
  },
  {
    id: 'lameness-analysis',
    name: '📋 Lameness Lab Assessment',
    description: 'Professional lameness laboratory assessment with detailed diagnostic evaluation',
    filename: 'Lameness_Lab_2.mp4',
    url: '/video/Lameness_Lab_2.mp4',
    duration: '4:10',
    category: 'lameness',
    analysisType: 'lameness',
    difficulty: 'Advanced',
    features: [
      'Laboratory assessment',
      'Systematic evaluation',
      'Diagnostic protocols',
      'Professional analysis',
      'Case study methodology'
    ],
    expectedFindings: ['Gait Analysis', 'Lameness Detection', 'AAEP Scale Assessment'],
    size: 17000000
  },
  {
    id: 'emergency-response',
    name: '⚠️ Mare & Foal Stall Cast Emergency',
    description: 'Emergency situation with mare and foal cast in stall - critical response monitoring',
    filename: 'horse_casting_scare.mp4',
    url: '/video/horse_casting_scare.mp4',
    duration: '1:45',
    category: 'emergency',
    analysisType: 'emergency',
    difficulty: 'Critical',
    features: [
      'Emergency situation detection',
      'Mare and foal safety',
      'Cast horse identification',
      'Stress level monitoring',
      'Recovery assessment'
    ],
    expectedFindings: ['Safety Assessment', 'Emergency Detection', 'Intervention Planning'],
    size: 2800000
  },
  {
    id: 'gait-analysis',
    name: '🚶‍♂️ Gait Analysis Demo',
    description: 'Tennessee Walking Horse demonstrating natural gait patterns for AI movement analysis',
    filename: 'Black_Tennessee_Walking_Horse.mp4',
    url: '/video/Black_Tennessee_Walking_Horse.mp4',
    duration: '1:30',
    category: 'gait',
    analysisType: 'gait',
    difficulty: 'Intermediate',
    features: [
      'Stride length measurement',
      'Gait tempo analysis',
      'Limb coordination tracking',
      'Posture evaluation',
      'Movement smoothness assessment'
    ],
    expectedFindings: ['Movement Quality', 'Gait Patterns', 'Performance Metrics'],
    size: 6000000
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getVideoById = (id: string): IVideoConfig | undefined => {
  return CORE_DEMO_VIDEOS.find(video => video.id === id);
};

export const getVideoByCategory = (category: IVideoConfig['category']): IVideoConfig[] => {
  return CORE_DEMO_VIDEOS.filter(video => video.category === category);
};

export const getVideoByDifficulty = (difficulty: IVideoConfig['difficulty']): IVideoConfig[] => {
  return CORE_DEMO_VIDEOS.filter(video => video.difficulty === difficulty);
};

export const getDefaultVideo = (): IVideoConfig => {
  return CORE_DEMO_VIDEOS[0]; // Colic detection as default
};

export const getAllVideoNames = (): string[] => {
  return CORE_DEMO_VIDEOS.map(video => video.filename);
};

export const getAllVideoUrls = (): string[] => {
  return CORE_DEMO_VIDEOS.map(video => video.url);
};

export const getVideoCount = (): number => {
  return CORE_DEMO_VIDEOS.length;
};

export const getTotalVideoSize = (): number => {
  return CORE_DEMO_VIDEOS.reduce((total, video) => total + video.size, 0);
};

// ============================================================================
// LEGACY COMPATIBILITY (for existing code that expects specific formats)
// ============================================================================

export const getVideoInfoForAnalysisDemo = () => {
  return CORE_DEMO_VIDEOS.map(video => ({
    filename: video.filename,
    displayName: video.name,
    category: video.category,
    difficulty: video.difficulty,
    description: video.description,
    expectedFindings: video.expectedFindings,
    videoUrl: video.url
  }));
};

export const getVideoFilesForCategory = (category: string) => {
  const categoryMap: Record<string, IVideoConfig[]> = {
    'emergency_scenarios': CORE_DEMO_VIDEOS.filter(v => v.category === 'emergency' || v.category === 'colic'),
    'motion_testing': CORE_DEMO_VIDEOS.filter(v => v.category === 'gait'),
    'general_behavior': CORE_DEMO_VIDEOS.filter(v => v.category === 'lameness'),
    'quality_testing': CORE_DEMO_VIDEOS.filter(v => v.category === 'gait')
  };

  const videos = categoryMap[category] || [];
  return videos.map(video => ({
    name: video.filename,
    path: video.url,
    size: video.size
  }));
}; 