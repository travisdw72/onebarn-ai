// Wyze V4 Camera Configuration Interface
export interface IWyzeV4Config {
  cameraInfo: {
    title: string;
    description: string;
    maxCameras: number;
    defaultStreamType: string;
    supportedResolutions: string[];
    supportedFrameRates: number[];
    maxViewers: number;
    streamingProtocols: string[];
    features: {
      colorNightVision: boolean;
      wifi6Support: boolean;
      weatherProof: boolean;
      ptzControl: boolean;
      audioSupport: boolean;
      sdCardRecording: boolean;
      cloudRecording: boolean;
      motionDetection: boolean;
      personDetection: boolean;
      vehicleDetection: boolean;
      petDetection: boolean;
      soundDetection: boolean;
      twoWayAudio: boolean;
      sirenAlert: boolean;
      spotlightControl: boolean;
    };
  };

  integration: {
    dockerWyzeBridge: {
      enabled: boolean;
      dockerImage: string;
      containerName: string;
      hostPort: number;
      rtspPort: number;
      webPort: number;
      apiPort: number;
      healthCheckEndpoint: string;
      maxRetries: number;
      retryDelay: number;
      timeout: number;
      environment: Record<string, string>;
    };
    fallbackOptions: {
      directRtsp: {
        enabled: boolean;
        description: string;
        defaultPort: number;
        protocols: string[];
        timeoutMs: number;
      };
      wyzeApi: {
        enabled: boolean;
        description: string;
        baseUrl: string;
        apiVersion: string;
        timeout: number;
      };
      alternativeCameras: {
        enabled: boolean;
        description: string;
        recommended: Array<{
          brand: string;
          models: string[];
          features: string[];
          priceRange: string;
        }>;
      };
    };
  };

  controls: {
    connection: Record<string, string>;
    streaming: Record<string, string>;
    recording: Record<string, string>;
    ptzControls: Record<string, string>;
    audio: Record<string, string>;
    lighting: Record<string, string>;
    alerts: Record<string, string>;
  };

  messages: {
    connection: Record<string, string>;
    streaming: Record<string, string>;
    recording: Record<string, string>;
    alerts: Record<string, string>;
    general: Record<string, string>;
  };

  sources: {
    discovery: {
      enabled: boolean;
      autoScan: boolean;
      scanInterval: number;
      networkScanRange: string;
      discoveryMethods: string[];
      timeout: number;
    };
    wyzeAccount: {
      authRequired: boolean;
      supportsTwoFactor: boolean;
      credentialsStorage: string;
      sessionTimeout: number;
      refreshTokenInterval: number;
      maxDevices: number;
      supportedRegions: string[];
    };
    manualConfiguration: {
      enabled: boolean;
      requiresValidation: boolean;
      supportedFormats: string[];
      defaultCredentials: {
        username: string;
        password: string;
      };
    };
  };

  aiIntegration: {
    enabled: boolean;
    compatibleWithExistingAI: boolean;
    supportedAnalysis: string[];
    frameCapture: {
      enabled: boolean;
      intervalSeconds: number;
      maxFramesPerMinute: number;
      resolution: string;
      format: string;
      quality: number;
      storageLocation: string;
      retentionDays: number;
    };
    realTimeAnalysis: {
      enabled: boolean;
      processingDelay: number;
      confidenceThreshold: number;
      alertThreshold: number;
      batchProcessing: boolean;
      maxConcurrentAnalysis: number;
    };
    historicalAnalysis: {
      enabled: boolean;
      storageCapacity: string;
      compressionEnabled: boolean;
      searchable: boolean;
      reportGeneration: boolean;
      dataRetentionDays: number;
    };
  };

  quality: {
    videoSettings: {
      defaultResolution: string;
      defaultFrameRate: number;
      defaultBitrate: number;
      maxBitrate: number;
      minBitrate: number;
      adaptiveBitrate: boolean;
      hardwareAcceleration: boolean;
      compressionLevel: string;
    };
    audioSettings: {
      enabled: boolean;
      sampleRate: number;
      channels: number;
      bitrate: number;
      noiseReduction: boolean;
      echoCancellation: boolean;
      volumeNormalization: boolean;
    };
    networkOptimization: {
      bufferSize: number;
      maxRetries: number;
      retryDelay: number;
      adaptiveStreaming: boolean;
      bandwidthOptimization: boolean;
      latencyOptimization: boolean;
      connectionPooling: boolean;
    };
    performance: {
      maxConcurrentStreams: number;
      cpuUsageLimit: number;
      memoryUsageLimit: number;
      diskUsageLimit: number;
      tempFileCleanup: boolean;
      performanceMonitoring: boolean;
      resourceThrottling: boolean;
    };
  };

  security: {
    encryption: {
      streamEncryption: boolean;
      storageEncryption: boolean;
      apiEncryption: boolean;
      certificateValidation: boolean;
      tlsVersion: string;
      keyRotation: boolean;
      keyRotationInterval: number;
    };
    authentication: {
      required: boolean;
      sessionTimeout: number;
      multiFactorAuth: boolean;
      passwordComplexity: boolean;
      accountLockout: boolean;
      maxFailedAttempts: number;
      lockoutDuration: number;
    };
    access: {
      rbacEnabled: boolean;
      tenantIsolation: boolean;
      auditLogging: boolean;
      ipWhitelisting: boolean;
      geoRestrictions: boolean;
      timeBasedAccess: boolean;
      deviceFingerprinting: boolean;
    };
    privacy: {
      dataMinimization: boolean;
      retentionPolicy: boolean;
      rightsManagement: boolean;
      consentManagement: boolean;
      dataExport: boolean;
      dataDelete: boolean;
      privacyMasking: boolean;
    };
  };

  mobile: {
    responsiveDesign: boolean;
    touchControls: boolean;
    gestureSupport: boolean;
    orientationSupport: boolean;
    batteryOptimization: boolean;
    dataUsageOptimization: boolean;
    offlineMode: boolean;
    pushNotifications: boolean;
    backgroundSync: boolean;
    cacheManagement: boolean;
    adaptiveUI: boolean;
    darkMode: boolean;
    accessibilityFeatures: boolean;
    screenSizeAdaptation: {
      mobile: {
        maxColumns: number;
        defaultView: string;
        navigationStyle: string;
        controlSize: string;
      };
      tablet: {
        maxColumns: number;
        defaultView: string;
        navigationStyle: string;
        controlSize: string;
      };
      desktop: {
        maxColumns: number;
        defaultView: string;
        navigationStyle: string;
        controlSize: string;
      };
    };
  };

  tooltips: Record<string, string>;

  technical: {
    apiEndpoints: {
      bridge: Record<string, string>;
      wyze: Record<string, string>;
    };
    protocols: {
      rtsp: {
        port: number;
        transport: string;
        timeout: number;
        maxRetries: number;
      };
      rtmp: {
        port: number;
        timeout: number;
        maxRetries: number;
      };
      http: {
        port: number;
        timeout: number;
        maxRetries: number;
      };
      https: {
        port: number;
        timeout: number;
        maxRetries: number;
      };
    };
    diagnostics: {
      enabled: boolean;
      loggingLevel: string;
      performanceMetrics: boolean;
      errorReporting: boolean;
      healthChecks: boolean;
      networkTesting: boolean;
      streamAnalysis: boolean;
      resourceMonitoring: boolean;
    };
  };

  ui: {
    layout: {
      defaultView: string;
      maxCamerasPerRow: number;
      aspectRatio: string;
      borderRadius: string;
      shadowEnabled: boolean;
      overlayControls: boolean;
      statusIndicators: boolean;
      loadingAnimations: boolean;
    };
    controls: {
      position: string;
      autoHide: boolean;
      autoHideDelay: number;
      fadeAnimation: boolean;
      touchFriendly: boolean;
      keyboardShortcuts: boolean;
      contextMenu: boolean;
    };
    themes: {
      light: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        accent: string;
      };
      dark: {
        primary: string;
        secondary: string;
        background: string;
        surface: string;
        accent: string;
      };
    };
  };

  analytics: {
    enabled: boolean;
    metrics: {
      streamUptime: boolean;
      connectionLatency: boolean;
      videoQuality: boolean;
      errorRates: boolean;
      userEngagement: boolean;
      resourceUsage: boolean;
      networkBandwidth: boolean;
      aiAnalysisAccuracy: boolean;
    };
    reporting: {
      dailyReports: boolean;
      weeklyReports: boolean;
      monthlyReports: boolean;
      customReports: boolean;
      alertReports: boolean;
      performanceReports: boolean;
      usageReports: boolean;
    };
    retention: {
      metricsRetentionDays: number;
      logsRetentionDays: number;
      reportRetentionDays: number;
      archivalEnabled: boolean;
      compressionEnabled: boolean;
    };
  };

  maintenance: {
    autoUpdates: {
      enabled: boolean;
      schedule: string;
      backupBeforeUpdate: boolean;
      rollbackOnFailure: boolean;
      notificationOnUpdate: boolean;
    };
    healthChecks: {
      enabled: boolean;
      interval: number;
      timeout: number;
      retryCount: number;
      alertOnFailure: boolean;
    };
    backups: {
      enabled: boolean;
      schedule: string;
      retention: number;
      compression: boolean;
      encryption: boolean;
      remoteBackup: boolean;
    };
    troubleshooting: {
      diagnosticMode: boolean;
      debugLogging: boolean;
      networkTesting: boolean;
      performanceProfiling: boolean;
      errorCollection: boolean;
      supportTicketIntegration: boolean;
    };
  };
}

// Additional interfaces for specific Wyze V4 components
export interface IWyzeV4Camera {
  id: string;
  name: string;
  mac: string;
  model: string;
  firmwareVersion: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'connecting' | 'error';
  streamUrl?: string;
  rtspUrl?: string;
  lastSeen: Date;
  capabilities: {
    ptz: boolean;
    audio: boolean;
    nightVision: boolean;
    motion: boolean;
    recording: boolean;
  };
  settings: {
    resolution: string;
    frameRate: number;
    bitrate: number;
    nightVisionMode: 'auto' | 'on' | 'off';
    motionSensitivity: number;
    recordingEnabled: boolean;
  };
  tenantId: string;
  location?: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface IWyzeV4Stream {
  cameraId: string;
  streamId: string;
  url: string;
  protocol: 'rtsp' | 'rtmp' | 'hls' | 'webrtc';
  resolution: string;
  frameRate: number;
  bitrate: number;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  errorCount: number;
  lastError?: string;
  quality: 'HD' | 'SD' | 'AUTO';
  latency: number;
  bandwidth: number;
}

export interface IWyzeV4Recording {
  id: string;
  cameraId: string;
  filename: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  size: number;
  resolution: string;
  codec: string;
  triggerType: 'manual' | 'motion' | 'scheduled' | 'alert';
  storageLocation: 'local' | 'cloud' | 'both';
  thumbnailUrl?: string;
  downloadUrl?: string;
  isCorrupted: boolean;
  metadata: {
    motionEvents: number;
    alertEvents: number;
    aiAnalysis?: any;
  };
}

export interface IWyzeV4Alert {
  id: string;
  cameraId: string;
  type: 'motion' | 'sound' | 'person' | 'vehicle' | 'pet' | 'custom';
  timestamp: Date;
  confidence: number;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  location?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tenantId: string;
}

export interface IWyzeV4Settings {
  cameraId: string;
  general: {
    name: string;
    description?: string;
    location?: string;
    timezone: string;
    enabled: boolean;
  };
  video: {
    resolution: string;
    frameRate: number;
    bitrate: number;
    compressionLevel: string;
    rotation: number;
    flipHorizontal: boolean;
    flipVertical: boolean;
  };
  audio: {
    enabled: boolean;
    microphone: boolean;
    speaker: boolean;
    volume: number;
    noiseReduction: boolean;
  };
  detection: {
    motion: {
      enabled: boolean;
      sensitivity: number;
      zones: Array<{
        id: string;
        name: string;
        coordinates: Array<{ x: number; y: number }>;
      }>;
    };
    person: {
      enabled: boolean;
      sensitivity: number;
    };
    vehicle: {
      enabled: boolean;
      sensitivity: number;
    };
    pet: {
      enabled: boolean;
      sensitivity: number;
    };
    sound: {
      enabled: boolean;
      sensitivity: number;
    };
  };
  recording: {
    enabled: boolean;
    mode: 'continuous' | 'motion' | 'scheduled';
    quality: string;
    duration: number;
    storage: 'local' | 'cloud' | 'both';
    retention: number;
  };
  alerts: {
    enabled: boolean;
    methods: string[];
    schedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      days: string[];
    };
    cooldown: number;
  };
  privacy: {
    masking: {
      enabled: boolean;
      zones: Array<{
        id: string;
        coordinates: Array<{ x: number; y: number }>;
      }>;
    };
  };
}

export interface IWyzeV4Props {
  tenantId: string;
  onCameraAdded?: (camera: IWyzeV4Camera) => void;
  onCameraRemoved?: (cameraId: string) => void;
  onStreamStarted?: (stream: IWyzeV4Stream) => void;
  onStreamStopped?: (streamId: string) => void;
  onAlert?: (alert: IWyzeV4Alert) => void;
  onError?: (error: string) => void;
}

export interface IWyzeV4DashboardProps extends IWyzeV4Props {
  cameras: IWyzeV4Camera[];
  selectedCamera?: string;
  viewMode: 'single' | 'grid' | 'list';
  showControls: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface IWyzeV4GridProps extends IWyzeV4Props {
  cameras: IWyzeV4Camera[];
  columns: number;
  aspectRatio: string;
  showLabels: boolean;
  showStatus: boolean;
  onCameraSelect?: (cameraId: string) => void;
}

export interface IWyzeV4StreamProps extends IWyzeV4Props {
  camera: IWyzeV4Camera;
  stream?: IWyzeV4Stream;
  showControls: boolean;
  autoPlay: boolean;
  muted: boolean;
  fullscreenEnabled: boolean;
  onFullscreen?: (isFullscreen: boolean) => void;
}

export interface IWyzeV4ControlsProps extends IWyzeV4Props {
  camera: IWyzeV4Camera;
  stream?: IWyzeV4Stream;
  position: 'top' | 'bottom' | 'overlay';
  size: 'small' | 'medium' | 'large';
  autoHide: boolean;
  onAction?: (action: string, params?: any) => void;
} 