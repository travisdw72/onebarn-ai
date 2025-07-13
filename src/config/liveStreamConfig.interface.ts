// Live Stream Configuration Interfaces
export interface IStreamInfo {
  title: string;
  description: string;
  defaultStreamType: string;
  maxViewers: number;
  location: string;
  qualityLabel: string;
  sourceLabel: string;
  locationLabel: string;
}

export interface IStreamControls {
  play: string;
  pause: string;
  startStream: string;
  stopStream: string;
  connecting: string;
  fullscreen: string;
  enterFullscreen: string;
  exitFullscreen: string;
  volume: string;
  quality: string;
  reload: string;
  refreshStream: string;
  screenshot: string;
  takeScreenshot: string;
  screenshots: string;
  settings: string;
  exportData: string;
  backToDashboard: string;
  streamUrlLabel: string;
  streamUrlPlaceholder: string;
}

export interface IStreamStatus {
  live: string;
  viewers: string;
  connectionStatus: string;
  connecting: string;
  establishingConnection: string;
  connectionError: string;
  checkConnection: string;
  streamOffline: string;
  enterUrlToStart: string;
}

export interface IStreamSource {
  name: string;
  description: string;
  icon: string;
  defaultUrl: string;
  embedTemplate: string;
  enabled: boolean;
}

export interface IPredefinedStream {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  thumbnail?: string;
  isDefault?: boolean;
}

export interface IStreamSources {
  youtube: IStreamSource;
  twitch: IStreamSource;
  custom: IStreamSource;
  predefined: IPredefinedStream[];
}

export interface IPhotoSequenceDemoMode {
  enabled: boolean;
  maxAnalysisCount: number;
  storageKey: string;
  limitReachedMessage: string;
  resetOnNewSession: boolean;
}

export interface IPhotoSequenceProductionMode {
  enabled: boolean;
  continuousAnalysis: boolean;
  intervalMinutes: number;
  autoStart: boolean;
  maxContinuousHours: number;
  pauseAfterHours: number;
}

export interface IPhotoSequenceConfig {
  enabled: boolean;
  title: string;
  buttonText: string;
  buttonTextAnalyzing: string;
  photosPerSequence: number;
  captureIntervalSeconds: number;
  totalSequenceTimeSeconds: number;
  demoMode: IPhotoSequenceDemoMode;
  productionMode: IPhotoSequenceProductionMode;
}

export interface IAIAnalysis {
  enabled: boolean;
  title: string;
  enableAnalysis: string;
  captureInterval: number;
  captureIntervalLabel: string;
  minInterval: number;
  maxInterval: number;
  intervalStep: number;
  waitingForData: string;
  analysisTypes: string[];
  autoCapture: boolean;
  saveAnalysisHistory: boolean;
  photoSequence: IPhotoSequenceConfig;
}

export interface ITooltips {
  [key: string]: string;
}

export interface IStreamAnalytics {
  trackViewTime: boolean;
  trackInteractions: boolean;
  trackQualityChanges: boolean;
  trackErrors: boolean;
  reportingInterval: number;
}

export interface ITechnicalSettings {
  autoRetryAttempts: number;
  retryDelay: number;
  connectionTimeout: number;
  bufferSize: number;
  qualityOptions: string[];
  defaultQuality: string;
}

export interface ISecuritySettings {
  requireAuthentication: boolean;
  allowedDomains: string[];
  validateStreamUrls: boolean;
  maxUrlLength: number;
}

export interface ITouchGestures {
  doubleTapFullscreen: boolean;
  pinchZoom: boolean;
  swipeVolume: boolean;
  swipeStreamSelection: boolean;
  pullToRefresh: boolean;
}

export interface IMobileLayout {
  priorityOrder: string[];
  stackVertically: boolean;
  compactSpacing: boolean;
  stickyControls: boolean;
  collapsibleSections: string[];
  minimumTouchTarget: string;
  preferredTouchTarget: string;
}

export interface IUrlInputSettings {
  alwaysVisible: boolean;
  position: string;
  placeholder: string;
  clearButton: boolean;
  pasteButton: boolean;
  suggestionDropdown: boolean;
}

export interface IStreamPlayerSettings {
  fullWidthOnMobile: boolean;
  aspectRatio: string;
  minHeight: string;
  maxHeight: string;
  tapToToggleControls: boolean;
  swipeUpForFullscreen: boolean;
}

export interface IAIAnalysisSettings {
  collapsible: boolean;
  compactView: boolean;
  showSummaryFirst: boolean;
  expandableDetails: boolean;
}

export interface IStreamSelectionSettings {
  horizontalScroll: boolean;
  showThumbnails: boolean;
  quickSwipe: boolean;
  categoryTabs: boolean;
}

export interface IMobileSettings {
  enableMobileControls: boolean;
  touchGestures: ITouchGestures;
  adaptiveQuality: boolean;
  reducedMotion: boolean;
  layout: IMobileLayout;
  urlInput: IUrlInputSettings;
  streamPlayer: IStreamPlayerSettings;
  aiAnalysis: IAIAnalysisSettings;
  streamSelection: IStreamSelectionSettings;
}

export interface IMobileStyling {
  compactHeader: boolean;
  reducedPadding: boolean;
  largerButtons: boolean;
  increasedLineHeight: boolean;
  simplifiedUI: boolean;
  hideNonEssentialElements: boolean;
}

export interface IStylingSettings {
  playerAspectRatio: string;
  controlsTimeout: number;
  loadingAnimation: string;
  borderRadius: string;
  overlayOpacity: number;
  mobile: IMobileStyling;
}

export interface IMobileMessages {
  tapToStart: string;
  swipeToSwitch: string;
  pullToRefresh: string;
  rotateForFullscreen: string;
  connectionOptimized: string;
  reducedQuality: string;
  wifiRecommended: string;
  dataUsageWarning: string;
}

export interface IStreamMessages {
  streamLoadError: string;
  connectionLost: string;
  streamOffline: string;
  invalidUrl: string;
  screenshotSuccess: string;
  screenshotError: string;
  aiAnalysisStarted: string;
  aiAnalysisError: string;
  noStreamSelected: string;
  mobile: IMobileMessages;
}

export interface IStreamFeatures {
  enableScreenshots: boolean;
  enableRecording: boolean;
  enableChatIntegration: boolean;
  enableStreamMetrics: boolean;
  enableQualitySelector: boolean;
  enableVolumeControl: boolean;
  enablePlaybackSpeed: boolean;
  enableSubtitles: boolean;
  enablePictureInPicture: boolean;
}

// Main Configuration Interface
export interface ILiveStreamConfig {
  streamInfo: IStreamInfo;
  controls: IStreamControls;
  status: IStreamStatus;
  sources: IStreamSources;
  aiAnalysis: IAIAnalysis;
  tooltips: ITooltips;
  analytics: IStreamAnalytics;
  technical: ITechnicalSettings;
  security: ISecuritySettings;
  mobile: IMobileSettings;
  styling: IStylingSettings;
  messages: IStreamMessages;
  features: IStreamFeatures;
} 