/**
 * 💼 BUSINESS PARTNER GUIDE - CAMERA TYPES
 * 
 * This file defines all camera-related types for the One Barn AI demo system.
 * These types enable local WebRTC camera access for business partner demonstrations.
 * 
 * DEMO ACCOUNT USAGE:
 * - Only active for demo@onevault.ai account
 * - Extends existing camera system without breaking changes
 * - Supports multiple camera devices (webcam, phone, etc.)
 * 
 * BUSINESS PARTNER SETUP:
 * 1. Browser will request camera permissions
 * 2. Multiple camera devices can be detected and selected
 * 3. Real-time camera streams replace mock feeds
 * 4. Professional demo-quality video output
 */

import { ICameraFeed } from './ClientTypes';

// 🎥 DEMO CAMERA DEVICE - Real browser camera device
export interface IDemoCameraDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput' | 'audioinput';
  groupId: string;
  isDefault: boolean;
  isAvailable: boolean;
  capabilities?: {
    width: { min: number; max: number };
    height: { min: number; max: number };
    frameRate: { min: number; max: number };
    aspectRatio: { min: number; max: number };
  };
}

// 📱 CAMERA STREAM - Active WebRTC media stream
export interface ICameraStream {
  id: string;
  deviceId: string;
  stream: MediaStream | null;
  isActive: boolean;
  isRecording: boolean;
  quality: {
    width: number;
    height: number;
    frameRate: number;
  };
  lastUpdated: Date;
  error?: string;
}

// 🎯 DEMO CAMERA FEED - Enhanced camera feed for demo account
export interface IDemoCameraFeed extends ICameraFeed {
  // Demo-specific properties
  isDemoCamera: boolean;
  demoDeviceId?: string;
  demoStream?: MediaStream;
  demoPermissionStatus: 'granted' | 'denied' | 'prompt' | 'checking';
  
  // Business partner features
  setupStatus: 'not-configured' | 'configuring' | 'ready' | 'error';
  troubleshootingInfo?: {
    lastError?: string;
    permissionDeniedCount: number;
    deviceDetectionFailed: boolean;
    streamStartFailed: boolean;
  };
}

// ⚙️ CAMERA CONFIGURATION - Demo camera setup configuration
export interface IDemoCameraConfig {
  // 💼 BUSINESS PARTNER SETTINGS
  enableDemoMode: boolean;
  demoAccountEmail: string;
  
  // 📹 CAMERA SETTINGS
  preferredResolution: {
    width: number;
    height: number;
  };
  preferredFrameRate: number;
  enableAudio: boolean;
  enableAutoSwitch: boolean;
  
  // 🔧 TROUBLESHOOTING SETTINGS
  maxRetryAttempts: number;
  retryDelay: number;
  enableDiagnostics: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  
  // 🎨 UI SETTINGS
  showSetupWizard: boolean;
  showTroubleshooting: boolean;
  showPermissionHelp: boolean;
  showDeviceSelection: boolean;
}

// 📊 CAMERA SETUP STATUS - Setup wizard state management
export interface ICameraSetupStatus {
  currentStep: 'permissions' | 'device-selection' | 'testing' | 'complete';
  permissionStatus: 'checking' | 'granted' | 'denied' | 'error';
  availableDevices: IDemoCameraDevice[];
  selectedDevice: IDemoCameraDevice | null;
  testStream: MediaStream | null;
  errors: string[];
  warnings: string[];
  isComplete: boolean;
}

// 🚨 CAMERA ERROR TYPES - Comprehensive error handling
export interface ICameraError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  category: 'permission' | 'device' | 'stream' | 'network' | 'browser';
  resolution?: string;
  businessPartnerMessage?: string;
  technicalDetails?: string;
}

// 🎭 CAMERA PERMISSIONS - Browser permission management
export interface ICameraPermissions {
  camera: PermissionState;
  microphone: PermissionState;
  lastChecked: Date;
  canRequest: boolean;
  userGestureRequired: boolean;
  browserSupported: boolean;
  httpsRequired: boolean;
}

// 🏗️ CAMERA SERVICE STATE - Service state management
export interface ICameraServiceState {
  isInitialized: boolean;
  availableDevices: IDemoCameraDevice[];
  activeStreams: Map<string, ICameraStream>;
  permissions: ICameraPermissions;
  errors: ICameraError[];
  isLoading: boolean;
  isDemoMode: boolean;
}

// 🎯 CAMERA HOOK PROPS - React hook interface
export interface IUseCameraProps {
  enableAudio?: boolean;
  autoStart?: boolean;
  isDemoAccount?: boolean;
  useRefineIdentity?: boolean;
  onPermissionChange?: (permissions: ICameraPermissions) => void;
  onDeviceChange?: (devices: IDemoCameraDevice[]) => void;
  onStreamChange?: (streams: ICameraStream[]) => void;
  onError?: (error: ICameraError) => void;
}

// 📱 CAMERA HOOK RETURN - React hook return type
export interface IUseCameraReturn {
  // State
  devices: IDemoCameraDevice[];
  streams: ICameraStream[];
  permissions: ICameraPermissions;
  isLoading: boolean;
  errors: ICameraError[];
  
  // Actions
  requestPermissions: () => Promise<boolean>;
  startCamera: (deviceId: string) => Promise<ICameraStream | null>;
  stopCamera: (streamId: string) => Promise<void>;
  switchCamera: (deviceId: string) => Promise<ICameraStream | null>;
  refreshDevices: () => Promise<void>;
  clearErrors: () => void;
  
  // Utilities
  getDeviceById: (deviceId: string) => IDemoCameraDevice | null;
  getStreamById: (streamId: string) => ICameraStream | null;
  isDeviceAvailable: (deviceId: string) => boolean;
  getDefaultDevice: () => IDemoCameraDevice | null;
}

// 🎪 DEMO SETUP WIZARD PROPS - Setup wizard component props
export interface IDemoSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: IDemoCameraConfig) => void;
  initialConfig?: Partial<IDemoCameraConfig>;
}

// 🔧 CAMERA TROUBLESHOOTING - Troubleshooting panel props
export interface ICameraTroubleshootingProps {
  errors: ICameraError[];
  onRetry: () => void;
  onReset: () => void;
  onContactSupport: () => void;
  showDetails?: boolean;
}

// 📈 CAMERA ANALYTICS - Performance and usage analytics
export interface ICameraAnalytics {
  sessionStart: Date;
  totalStreamTime: number;
  deviceSwitches: number;
  errorCount: number;
  permissionDenials: number;
  averageSetupTime: number;
  browserInfo: {
    userAgent: string;
    platform: string;
    language: string;
  };
} 