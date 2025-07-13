import type { IWyzeV4Config } from '../interfaces/config/wyzeV4Config.interface';

export const wyzeV4Config: IWyzeV4Config = {
  // 📹 Camera Information
  cameraInfo: {
    title: 'Wyze V4 Camera System',
    description: 'Professional-grade 2.5K QHD camera monitoring for equestrian facilities',
    maxCameras: 12,
    defaultStreamType: 'wyze-bridge',
    supportedResolutions: ['2560x1440', '1920x1080', '1280x720', '640x360'],
    supportedFrameRates: [30, 20, 15, 10, 5],
    maxViewers: 100,
    streamingProtocols: ['rtsp', 'rtmp', 'hls', 'webrtc'],
    features: {
      colorNightVision: true,
      wifi6Support: true,
      weatherProof: true,
      ptzControl: true,
      audioSupport: true,
      sdCardRecording: true,
      cloudRecording: true,
      motionDetection: true,
      personDetection: true,
      vehicleDetection: true,
      petDetection: true,
      soundDetection: true,
      twoWayAudio: true,
      sirenAlert: true,
      spotlightControl: true
    }
  },

  // 🔧 Integration Settings
  integration: {
    dockerWyzeBridge: {
      enabled: true,
      dockerImage: 'mrlt8/wyze-bridge:latest',
      containerName: 'wyze-bridge',
      hostPort: 8889,
      rtspPort: 1935,
      webPort: 5000,
      apiPort: 5001,
      healthCheckEndpoint: '/health',
      maxRetries: 3,
      retryDelay: 5000,
      timeout: 30000,
      environment: {
        WYZE_EMAIL: '${WYZE_EMAIL}',
        WYZE_PASSWORD: '${WYZE_PASSWORD}',
        ENABLE_AUDIO: 'true',
        QUALITY: 'HD',
        LIVESTREAM: 'true',
        SNAPSHOT: 'true',
        RECORD_LENGTH: '60',
        FRESH_DATA: 'true',
        ROTATE_DOOR: 'true',
        H264_ENC: 'h264_nvenc',
        FFMPEG_LOGLEVEL: 'info'
      }
    },
    fallbackOptions: {
      directRtsp: {
        enabled: true,
        description: 'Direct RTSP connection (if available)',
        defaultPort: 554,
        protocols: ['tcp', 'udp'],
        timeoutMs: 10000
      },
      wyzeApi: {
        enabled: true,
        description: 'Direct Wyze API integration (experimental)',
        baseUrl: 'https://api.wyzecam.com',
        apiVersion: 'v1',
        timeout: 15000
      },
      alternativeCameras: {
        enabled: true,
        description: 'Migration to alternative camera brands',
        recommended: [
          {
            brand: 'TP-Link Tapo',
            models: ['C120', 'C121', 'C200', 'C210'],
            features: ['Native RTSP', 'Local recording', 'Pan/Tilt', 'Night vision'],
            priceRange: '$15-$35'
          },
          {
            brand: 'Reolink',
            models: ['E1 Outdoor', 'C1 Pro', 'E1 Pro'],
            features: ['4K recording', 'PoE options', 'Local storage', 'AI detection'],
            priceRange: '$25-$60'
          }
        ]
      }
    }
  },

  // 🎮 Camera Controls
  controls: {
    connection: {
      connect: 'Connect Camera',
      disconnect: 'Disconnect Camera',
      reconnect: 'Reconnect Camera',
      testConnection: 'Test Connection',
      connectionStatus: 'Connection Status',
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnected: 'Disconnected',
      error: 'Connection Error',
      timeout: 'Connection Timeout',
      retrying: 'Retrying...'
    },
    streaming: {
      startStream: 'Start Stream',
      stopStream: 'Stop Stream',
      pauseStream: 'Pause Stream',
      resumeStream: 'Resume Stream',
      fullscreen: 'Enter Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      switchCamera: 'Switch Camera',
      multiView: 'Multi-Camera View',
      gridView: 'Grid View',
      singleView: 'Single View'
    },
    recording: {
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      takeSnapshot: 'Take Snapshot',
      downloadRecording: 'Download Recording',
      viewRecordings: 'View Recordings',
      deleteRecording: 'Delete Recording',
      recordingStatus: 'Recording Status',
      recordingDuration: 'Recording Duration'
    },
    ptzControls: {
      panLeft: 'Pan Left',
      panRight: 'Pan Right',
      tiltUp: 'Tilt Up',
      tiltDown: 'Tilt Down',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      centerView: 'Center View',
      presetPositions: 'Preset Positions',
      savePreset: 'Save Preset',
      gotoPreset: 'Go to Preset',
      patrolMode: 'Patrol Mode',
      followMode: 'Follow Mode'
    },
    audio: {
      muteAudio: 'Mute Audio',
      unmuteAudio: 'Unmute Audio',
      volumeUp: 'Volume Up',
      volumeDown: 'Volume Down',
      talkButton: 'Push to Talk',
      listenMode: 'Listen Mode',
      twoWayAudio: 'Two-Way Audio',
      audioSettings: 'Audio Settings'
    },
    lighting: {
      toggleSpotlight: 'Toggle Spotlight',
      nightVision: 'Night Vision',
      infraredMode: 'Infrared Mode',
      colorMode: 'Color Mode',
      autoMode: 'Auto Mode',
      brightnessControl: 'Brightness Control',
      contrastControl: 'Contrast Control'
    },
    alerts: {
      enableAlerts: 'Enable Alerts',
      disableAlerts: 'Disable Alerts',
      motionAlerts: 'Motion Alerts',
      soundAlerts: 'Sound Alerts',
      personAlerts: 'Person Detection Alerts',
      vehicleAlerts: 'Vehicle Detection Alerts',
      petAlerts: 'Pet Detection Alerts',
      customAlerts: 'Custom Alerts',
      testAlert: 'Test Alert',
      alertHistory: 'Alert History'
    }
  },

  // 📝 Status Messages
  messages: {
    connection: {
      connecting: 'Connecting to Wyze V4 camera...',
      connected: 'Camera connected successfully',
      disconnected: 'Camera disconnected',
      connectionFailed: 'Failed to connect to camera',
      connectionTimeout: 'Connection timeout - please check network',
      bridgeNotRunning: 'Docker Wyze Bridge is not running',
      bridgeStarting: 'Starting Docker Wyze Bridge...',
      bridgeReady: 'Docker Wyze Bridge is ready',
      authenticationFailed: 'Wyze authentication failed - check credentials',
      cameraNotFound: 'Camera not found in Wyze account',
      networkError: 'Network error - check internet connection'
    },
    streaming: {
      streamStarting: 'Starting video stream...',
      streamActive: 'Video stream is active',
      streamStopped: 'Video stream stopped',
      streamError: 'Stream error - attempting to reconnect',
      lowBandwidth: 'Low bandwidth detected - reducing quality',
      highLatency: 'High latency detected - optimizing connection',
      bufferingVideo: 'Buffering video...',
      noVideoSignal: 'No video signal received',
      resolutionChanged: 'Video resolution changed'
    },
    recording: {
      recordingStarted: 'Recording started',
      recordingStopped: 'Recording stopped and saved',
      recordingError: 'Recording error - check storage space',
      snapshotTaken: 'Snapshot captured successfully',
      snapshotError: 'Failed to capture snapshot',
      storageWarning: 'Storage space running low',
      recordingCorrupted: 'Recording file corrupted',
      uploadingToCloud: 'Uploading recording to cloud storage'
    },
    alerts: {
      motionDetected: 'Motion detected in camera view',
      personDetected: 'Person detected in camera view',
      vehicleDetected: 'Vehicle detected in camera view',
      petDetected: 'Pet detected in camera view',
      soundDetected: 'Sound detected by camera',
      alertsSent: 'Alerts sent to configured recipients',
      alertsDisabled: 'Alerts have been disabled',
      alertsEnabled: 'Alerts have been enabled',
      alertConfigSaved: 'Alert configuration saved'
    },
    general: {
      settingsSaved: 'Camera settings saved successfully',
      settingsError: 'Error saving camera settings',
      firmwareUpdate: 'Firmware update available',
      deviceOffline: 'Camera device appears to be offline',
      deviceOnline: 'Camera device is back online',
      maintenanceMode: 'Camera is in maintenance mode',
      diagnosticsComplete: 'Camera diagnostics completed',
      factoryReset: 'Camera factory reset completed'
    }
  },

  // 🎯 Camera Sources and Discovery
  sources: {
    discovery: {
      enabled: true,
      autoScan: true,
      scanInterval: 30000, // 30 seconds
      networkScanRange: '192.168.1.0/24',
      discoveryMethods: ['wyze-bridge', 'mdns', 'upnp', 'manual'],
      timeout: 10000
    },
    wyzeAccount: {
      authRequired: true,
      supportsTwoFactor: true,
      credentialsStorage: 'encrypted',
      sessionTimeout: 3600000, // 1 hour
      refreshTokenInterval: 1800000, // 30 minutes
      maxDevices: 50,
      supportedRegions: ['US', 'CA', 'UK', 'EU']
    },
    manualConfiguration: {
      enabled: true,
      requiresValidation: true,
      supportedFormats: ['rtsp://', 'rtmp://', 'http://'],
      defaultCredentials: {
        username: import.meta.env.VITE_WYZE_USERNAME || '',
        password: import.meta.env.VITE_WYZE_PASSWORD || ''
      }
    }
  },

  // 🤖 AI Integration
  aiIntegration: {
    enabled: true,
    compatibleWithExistingAI: true,
    supportedAnalysis: [
      'horse-behavior',
      'movement-analysis',
      'health-monitoring',
      'environmental-conditions',
      'human-detection',
      'vehicle-detection',
      'pet-detection',
      'object-tracking',
      'facial-recognition',
      'activity-monitoring'
    ],
    frameCapture: {
      enabled: true,
      intervalSeconds: 5,
      maxFramesPerMinute: 12,
      resolution: '1920x1080',
      format: 'jpeg',
      quality: 85,
      storageLocation: 'local',
      retentionDays: 30
    },
    realTimeAnalysis: {
      enabled: true,
      processingDelay: 2000,
      confidenceThreshold: 0.7,
      alertThreshold: 0.85,
      batchProcessing: true,
      maxConcurrentAnalysis: 4
    },
    historicalAnalysis: {
      enabled: true,
      storageCapacity: '1TB',
      compressionEnabled: true,
      searchable: true,
      reportGeneration: true,
      dataRetentionDays: 365
    }
  },

  // 📊 Quality and Performance
  quality: {
    videoSettings: {
      defaultResolution: '1920x1080',
      defaultFrameRate: 20,
      defaultBitrate: 2048,
      maxBitrate: 8192,
      minBitrate: 512,
      adaptiveBitrate: true,
      hardwareAcceleration: true,
      compressionLevel: 'medium'
    },
    audioSettings: {
      enabled: true,
      sampleRate: 44100,
      channels: 2,
      bitrate: 128,
      noiseReduction: true,
      echoCancellation: true,
      volumeNormalization: true
    },
    networkOptimization: {
      bufferSize: 3, // seconds
      maxRetries: 3,
      retryDelay: 1000,
      adaptiveStreaming: true,
      bandwidthOptimization: true,
      latencyOptimization: true,
      connectionPooling: true
    },
    performance: {
      maxConcurrentStreams: 8,
      cpuUsageLimit: 80,
      memoryUsageLimit: 2048, // MB
      diskUsageLimit: 10240, // MB
      tempFileCleanup: true,
      performanceMonitoring: true,
      resourceThrottling: true
    }
  },

  // 🔒 Security and Privacy
  security: {
    encryption: {
      streamEncryption: true,
      storageEncryption: true,
      apiEncryption: true,
      certificateValidation: true,
      tlsVersion: '1.3',
      keyRotation: true,
      keyRotationInterval: 86400000 // 24 hours
    },
    authentication: {
      required: true,
      sessionTimeout: 28800000, // 8 hours
      multiFactorAuth: true,
      passwordComplexity: true,
      accountLockout: true,
      maxFailedAttempts: 5,
      lockoutDuration: 1800000 // 30 minutes
    },
    access: {
      rbacEnabled: true,
      tenantIsolation: true,
      auditLogging: true,
      ipWhitelisting: true,
      geoRestrictions: false,
      timeBasedAccess: true,
      deviceFingerprinting: true
    },
    privacy: {
      dataMinimization: true,
      retentionPolicy: true,
      rightsManagement: true,
      consentManagement: true,
      dataExport: true,
      dataDelete: true,
      privacyMasking: true
    }
  },

  // 📱 Mobile Configuration
  mobile: {
    responsiveDesign: true,
    touchControls: true,
    gestureSupport: true,
    orientationSupport: true,
    batteryOptimization: true,
    dataUsageOptimization: true,
    offlineMode: true,
    pushNotifications: true,
    backgroundSync: true,
    cacheManagement: true,
    adaptiveUI: true,
    darkMode: true,
    accessibilityFeatures: true,
    screenSizeAdaptation: {
      mobile: {
        maxColumns: 2,
        defaultView: 'single',
        navigationStyle: 'bottom',
        controlSize: 'large'
      },
      tablet: {
        maxColumns: 3,
        defaultView: 'grid',
        navigationStyle: 'sidebar',
        controlSize: 'medium'
      },
      desktop: {
        maxColumns: 4,
        defaultView: 'grid',
        navigationStyle: 'top',
        controlSize: 'small'
      }
    }
  },

  // 💡 Tooltips and Help
  tooltips: {
    'camera-connection': 'Connect to your Wyze V4 camera using Docker Wyze Bridge',
    'stream-quality': 'Select video quality based on your network bandwidth',
    'ptz-controls': 'Pan, tilt, and zoom controls for camera positioning',
    'recording-settings': 'Configure local and cloud recording preferences',
    'motion-detection': 'Enable motion detection and customize sensitivity',
    'night-vision': 'Toggle between infrared and color night vision modes',
    'two-way-audio': 'Enable two-way audio communication through the camera',
    'alert-settings': 'Configure motion, sound, and AI detection alerts',
    'storage-management': 'Manage local and cloud storage for recordings',
    'network-optimization': 'Optimize streaming performance for your network',
    'privacy-settings': 'Configure privacy zones and data retention policies',
    'mobile-controls': 'Touch and gesture controls for mobile devices',
    'ai-integration': 'Enable AI-powered horse behavior analysis',
    'multi-camera': 'View and manage multiple cameras simultaneously',
    'backup-settings': 'Configure backup and redundancy options'
  },

  // ⚙️ Technical Settings
  technical: {
    apiEndpoints: {
      bridge: {
        status: '/api/status',
        cameras: '/api/cameras',
        stream: '/api/stream',
        snapshot: '/api/snapshot',
        recording: '/api/recording',
        settings: '/api/settings',
        health: '/api/health',
        metrics: '/api/metrics'
      },
      wyze: {
        auth: '/api/auth',
        devices: '/api/devices',
        livestream: '/api/livestream',
        events: '/api/events',
        settings: '/api/settings',
        firmware: '/api/firmware'
      }
    },
    protocols: {
      rtsp: {
        port: 554,
        transport: 'tcp',
        timeout: 10000,
        maxRetries: 3
      },
      rtmp: {
        port: 1935,
        timeout: 15000,
        maxRetries: 3
      },
      http: {
        port: 80,
        timeout: 5000,
        maxRetries: 5
      },
      https: {
        port: 443,
        timeout: 10000,
        maxRetries: 3
      }
    },
    diagnostics: {
      enabled: true,
      loggingLevel: 'info',
      performanceMetrics: true,
      errorReporting: true,
      healthChecks: true,
      networkTesting: true,
      streamAnalysis: true,
      resourceMonitoring: true
    }
  },

  // 🎨 UI Configuration
  ui: {
    layout: {
      defaultView: 'grid',
      maxCamerasPerRow: 4,
      aspectRatio: '16:9',
      borderRadius: '8px',
      shadowEnabled: true,
      overlayControls: true,
      statusIndicators: true,
      loadingAnimations: true
    },
    controls: {
      position: 'bottom',
      autoHide: true,
      autoHideDelay: 3000,
      fadeAnimation: true,
      touchFriendly: true,
      keyboardShortcuts: true,
      contextMenu: true
    },
    themes: {
      light: {
        primary: '#2C5530',
        secondary: '#8B4513',
        background: '#F5E6D3',
        surface: '#FFFFFF',
        accent: '#D4A574'
      },
      dark: {
        primary: '#4A6FA5',
        secondary: '#C67B5C',
        background: '#1A1A1A',
        surface: '#2D2D2D',
        accent: '#B85450'
      }
    }
  },

  // 📈 Analytics and Monitoring
  analytics: {
    enabled: true,
    metrics: {
      streamUptime: true,
      connectionLatency: true,
      videoQuality: true,
      errorRates: true,
      userEngagement: true,
      resourceUsage: true,
      networkBandwidth: true,
      aiAnalysisAccuracy: true
    },
    reporting: {
      dailyReports: true,
      weeklyReports: true,
      monthlyReports: true,
      customReports: true,
      alertReports: true,
      performanceReports: true,
      usageReports: true
    },
    retention: {
      metricsRetentionDays: 90,
      logsRetentionDays: 30,
      reportRetentionDays: 365,
      archivalEnabled: true,
      compressionEnabled: true
    }
  },

  // 🔧 Maintenance and Updates
  maintenance: {
    autoUpdates: {
      enabled: true,
      schedule: '0 2 * * 0', // Weekly on Sunday at 2 AM
      backupBeforeUpdate: true,
      rollbackOnFailure: true,
      notificationOnUpdate: true
    },
    healthChecks: {
      enabled: true,
      interval: 60000, // 1 minute
      timeout: 30000,
      retryCount: 3,
      alertOnFailure: true
    },
    backups: {
      enabled: true,
      schedule: '0 1 * * *', // Daily at 1 AM
      retention: 30, // 30 days
      compression: true,
      encryption: true,
      remoteBackup: true
    },
    troubleshooting: {
      diagnosticMode: true,
      debugLogging: true,
      networkTesting: true,
      performanceProfiling: true,
      errorCollection: true,
      supportTicketIntegration: true
    }
  }
};

// Helper functions for configuration access
export const getWyzeV4Setting = (settingPath: string): any => {
  const keys = settingPath.split('.');
  let current: any = wyzeV4Config;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
};

export const getWyzeV4Message = (messageKey: string): string => {
  const message = getWyzeV4Setting(`messages.${messageKey}`);
  return message || `Missing message: ${messageKey}`;
};

export const getWyzeV4Control = (controlKey: string): string => {
  const control = getWyzeV4Setting(`controls.${controlKey}`);
  return control || `Missing control: ${controlKey}`;
};

export const getWyzeV4Tooltip = (tooltipKey: string): string => {
  const tooltip = getWyzeV4Setting(`tooltips.${tooltipKey}`);
  return tooltip || 'No tooltip available';
};

export const isWyzeV4FeatureEnabled = (featurePath: string): boolean => {
  const feature = getWyzeV4Setting(featurePath);
  return Boolean(feature);
};

export const getWyzeV4ApiEndpoint = (apiKey: string): string => {
  const endpoint = getWyzeV4Setting(`technical.apiEndpoints.${apiKey}`);
  return endpoint || '';
};

export const getWyzeV4Theme = (themeName: 'light' | 'dark'): any => {
  return getWyzeV4Setting(`ui.themes.${themeName}`);
};

export const getWyzeV4MobileSettings = (): any => {
  return getWyzeV4Setting('mobile');
};

export const getWyzeV4SecuritySettings = (): any => {
  return getWyzeV4Setting('security');
};

export const getWyzeV4QualitySettings = (): any => {
  return getWyzeV4Setting('quality');
}; 