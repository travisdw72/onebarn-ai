import { CORE_DEMO_VIDEOS, type IVideoConfig } from './videoConfig';

export interface IDemoVideoOption {
  id: string;
  name: string;
  description: string;
  filename: string;
  url: string;
  duration: string;
  analysisType: 'lameness' | 'gait' | 'behavior' | 'general' | 'emergency' | 'colic' | 'foaling';
  features: string[];
}

// Use the single source of truth for demo videos
export const demoVideosConfig: IDemoVideoOption[] = CORE_DEMO_VIDEOS.map(video => ({
  id: video.id,
  name: video.name,
  description: video.description,
  filename: video.filename,
  url: video.url,
  duration: video.duration,
  analysisType: video.analysisType,
  features: video.features
}));

export const getVideoByAnalysisType = (type: IDemoVideoOption['analysisType']): IDemoVideoOption[] => {
  return demoVideosConfig.filter(video => video.analysisType === type);
};

export const getVideoById = (id: string): IDemoVideoOption | undefined => {
  return demoVideosConfig.find(video => video.id === id);
};

export const getDefaultVideo = (): IDemoVideoOption => {
  return demoVideosConfig[0];
}; 