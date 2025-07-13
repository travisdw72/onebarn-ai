/**
 * 🧪 AI Testing Tool TypeScript Interfaces
 * Type definitions for the Single-Image AI Filter Testing Tool
 */

import { IPreProcessingResult } from './AIOptimizationTypes';

// 📸 Image Upload Types
export interface IImageUploadState {
  file: File | null;
  dataUrl: string | null;
  isLoading: boolean;
  error: string | null;
  dragActive: boolean;
}

export interface IImageUploaderProps {
  onImageSelect: (imageData: string, file: File) => void;
  onImageClear: () => void;
  acceptedFormats: string[];
  maxFileSize: number;
  currentImage?: string | null;
  isProcessing?: boolean;
}

// ⚙️ Threshold Control Types
export interface IThresholdValues {
  imageQuality: number;
  occupancy: number;
  motion: number;
  duplicate: number;
}

export interface IThresholdControlsProps {
  values: IThresholdValues;
  onChange: (values: IThresholdValues) => void;
  onPresetSelect: (preset: 'conservative' | 'balanced' | 'aggressive') => void;
  onReset: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  disabled?: boolean;
}

export interface IThresholdSliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  tooltip?: string;
}

// 📊 Filter Results Types
export interface IFilterResult {
  name: string;
  passed: boolean;
  score: number;
  threshold: number;
  details: string;
  icon: string;
  color: string;
}

export interface IFilterResultsProps {
  results: IPreProcessingResult | null;
  thresholds: IThresholdValues;
  isLoading: boolean;
  processingTime?: number;
}

export interface IFilterResultCardProps {
  filter: IFilterResult;
  isLoading: boolean;
  compact?: boolean;
}

// 💡 Recommendations Types
export interface IRecommendation {
  id: string;
  category: 'quality' | 'occupancy' | 'motion' | 'duplicate' | 'general';
  title: string;
  description: string;
  action: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  apply: () => void;
  dismiss: () => void;
}

export interface IRecommendationPanelProps {
  recommendations: IRecommendation[];
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
  compact?: boolean;
}

export interface IRecommendationCardProps {
  recommendation: IRecommendation;
  onApply: () => void;
  onDismiss: () => void;
}

// 🎯 Main Component Types
export interface ISingleImageAnalyzerState {
  imageData: string | null;
  imageFile: File | null;
  thresholds: IThresholdValues;
  results: IPreProcessingResult | null;
  recommendations: IRecommendation[];
  isProcessing: boolean;
  error: string | null;
  processingStartTime: number | null;
  processingEndTime: number | null;
}

export interface ISingleImageAnalyzerProps {
  initialThresholds?: Partial<IThresholdValues>;
  onConfigurationChange?: (thresholds: IThresholdValues) => void;
  onResultsChange?: (results: IPreProcessingResult | null) => void;
  debugMode?: boolean;
}

// 🔄 Configuration Types
export interface IThresholdPreset {
  key: string;
  label: string;
  description: string;
  values: IThresholdValues;
}

export interface IExportedConfiguration {
  version: string;
  timestamp: string;
  thresholds: IThresholdValues;
  metadata: {
    userAgent: string;
    origin: string;
    sessionId: string;
  };
}

// 📱 Mobile Adaptation Types
export interface IMobileAdaptation {
  isMobile: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

// 🎨 UI State Types
export interface IUIState {
  expandedSections: {
    thresholds: boolean;
    results: boolean;
    recommendations: boolean;
    debug: boolean;
  };
  activeTab: string | null;
  showTooltips: boolean;
  compactMode: boolean;
}

// 📈 Performance Metrics Types
export interface IPerformanceMetrics {
  totalProcessingTime: number;
  filterBreakdown: {
    imageQuality: number;
    occupancy: number;
    motion: number;
    duplicate: number;
    timeFilter: number;
  };
  memoryUsage?: number;
  cpuUsage?: number;
  cacheHitRate?: number;
}

// 🔧 Debug Information Types
export interface IDebugInfo {
  enabled: boolean;
  rawResults: any;
  configSnapshot: IThresholdValues;
  processingLog: string[];
  performanceMetrics: IPerformanceMetrics;
  environmentInfo: {
    userAgent: string;
    timestamp: string;
    viewport: { width: number; height: number };
  };
}

// 🎯 Hook Return Types
export interface IUseImageAnalysisReturn {
  analyzeImage: (imageData: string, thresholds: IThresholdValues) => Promise<IPreProcessingResult>;
  isAnalyzing: boolean;
  error: string | null;
  clearError: () => void;
  cancelAnalysis: () => void;
}

export interface IUseThresholdManagementReturn {
  thresholds: IThresholdValues;
  updateThreshold: (key: keyof IThresholdValues, value: number) => void;
  updateThresholds: (values: Partial<IThresholdValues>) => void;
  applyPreset: (preset: 'conservative' | 'balanced' | 'aggressive') => void;
  resetToDefaults: () => void;
  exportConfiguration: () => string;
  importConfiguration: (configJson: string) => boolean;
  getPresetValues: (preset: string) => IThresholdValues;
}

export interface IUseRecommendationEngineReturn {
  recommendations: IRecommendation[];
  generateRecommendations: (results: IPreProcessingResult, thresholds: IThresholdValues) => void;
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  clearRecommendations: () => void;
}

// 🎨 Styling Types (following brandConfig patterns)
export interface ITestingToolStyles {
  container: React.CSSProperties;
  leftPanel: React.CSSProperties;
  rightPanel: React.CSSProperties;
  section: React.CSSProperties;
  sectionHeader: React.CSSProperties;
  card: React.CSSProperties;
  button: React.CSSProperties;
  slider: React.CSSProperties;
  result: React.CSSProperties;
  recommendation: React.CSSProperties;
}

// 📊 Analytics Types
export interface ITestingAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  imagesAnalyzed: number;
  thresholdAdjustments: number;
  recommendationsApplied: number;
  configurationsExported: number;
  averageProcessingTime: number;
  userInteractions: Array<{
    action: string;
    timestamp: Date;
    details: any;
  }>;
} 