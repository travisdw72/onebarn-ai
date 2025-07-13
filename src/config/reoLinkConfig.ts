// 📹 ReoLink E1 Pro Configuration
// Single source of truth for ReoLink E1 Pro camera settings and RTSP streaming integration
// ⚠️ CRITICAL: E1 Pro does NOT support HTTP API endpoints - RTSP streaming only!

import { brandConfig } from './brandConfig';

export interface IReoLinkE1ProCamera {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  
  // E1 Pro Connection settings - RTSP ONLY
  host: string;
  rtspPort: number;
  onvifPort: number;
  servicePort: number;
  username: string;
  password: string;
  
  // Camera specifications
  brand: string;
  model: string;
  resolution: string;
  nightVision: boolean;
  ptzSupport: boolean;
  
  // RTSP Stream settings (ONLY supported method for E1 Pro)
  rtspStreams: {
    main: string;
    sub: string;
  };
  
  // WebSocket streaming configuration for browser compatibility
  hlsStreams: {
    main: string;
    sub: string;
  };
  
  // Location and purpose
  location: string;
  purpose: string;
  
  // Multi-tenant support
  tenantId?: string;
  facilityId?: string;
  
  // Health monitoring
  healthCheck: {
    enabled: boolean;
    intervalSeconds: number;
    timeoutSeconds: number;
    method: 'ping' | 'rtsp_test' | 'websocket';
  };
}

export interface IReoLinkE1ProConnection {
  // E1 Pro Authentication (Basic only - no token system)
  credentials: {
    username: string;
    password: string;
  };
  
  // Connection settings
  rtspTimeout: number;
  retryAttempts: number;
  retryDelay: number;
  
  // Backend conversion server settings
  conversionServer: {
    host: string;
    port: number;
    websocketPort: number;
    hlsPort: number;
  endpoints: {
      stream: string;
    ptz: string;
    snapshot: string;
    status: string;
    };
  };
  
  // E1 Pro Feature support (LIMITED compared to other ReoLink models)
  features: {
    rtspStreaming: boolean;
    onvifSupport: boolean;
    ptzControl: boolean;
    nightVision: boolean;
    audioRecording: boolean;
    motionDetection: boolean;
    httpApi: boolean; // FALSE for E1 Pro
    webInterface: boolean; // FALSE for E1 Pro
    directBrowserAccess: boolean; // FALSE for E1 Pro
  };
}

export interface IReoLinkE1ProStreamConfig {
  // RTSP to HLS conversion quality settings
  quality: {
    main: {
      resolution: string;
      bitrate: number;
      fps: number;
      keyFrameInterval: number;
    };
    sub: {
      resolution: string;
      bitrate: number;
      fps: number;
      keyFrameInterval: number;
    };
  };
  
  // HLS streaming settings
  hls: {
    segmentDuration: number;
    playlistLength: number;
    lowLatencyMode: boolean;
    startFromKeyFrame: boolean;
  };
  
  // WebSocket streaming settings
  websocket: {
    bufferSize: number;
    maxRetries: number;
    reconnectDelay: number;
  };
}

export interface IReoLinkE1ProPTZConfig {
  // PTZ control via WebSocket (since HTTP doesn't work)
  websocketUrl: string;
  
  // PTZ capabilities
  movements: {
    pan: { min: number; max: number; step: number };
    tilt: { min: number; max: number; step: number };
    zoom: { min: number; max: number; step: number };
  };
  
  // Preset positions
  presets: {
    [key: number]: {
      name: string;
      description: string;
      position: { pan: number; tilt: number; zoom: number };
    };
  };
  
  // Auto-tracking settings
  autoTracking: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    trackingTypes: string[];
  };
}

// 🎯 LIVE ReoLink E1 Pro Camera - RTSP ONLY Configuration
export const reoLinkE1ProCameras: IReoLinkE1ProCamera[] = [
  {
    id: 'live_e1_pro_camera',
    name: 'Live E1 Pro Camera',
    description: 'ACTUAL ReoLink E1 Pro 3K PT camera - RTSP streaming only',
    enabled: true,
    
    host: '192.168.254.35',
    rtspPort: 554,
    onvifPort: 8000,
    servicePort: 9000,
    username: 'admin',
    password: '!@m1cor1013rL',
    
    brand: 'ReoLink',
    model: 'E1 Pro 3K PT',
    resolution: '3K (2304x1296)',
    nightVision: true,
    ptzSupport: true,
    
    // RTSP URLs (ONLY supported method for E1 Pro)
    rtspStreams: {
      main: 'rtsp://admin:!@m1cor1013rL@192.168.254.35:554/Preview_01_main',
      sub: 'rtsp://admin:!@m1cor1013rL@192.168.254.35:554/Preview_01_sub'
    },
    
    // HLS streams from conversion server
    hlsStreams: {
      main: 'http://localhost:3001/hls/192.168.254.35_main.m3u8',
      sub: 'http://localhost:3001/hls/192.168.254.35_sub.m3u8'
    },
    
    location: 'Live Demo Setup',
    purpose: 'Real-time AI monitoring demo with RTSP streaming',
    
    tenantId: 'live_demo_001',
    facilityId: 'live_facility',
    
    healthCheck: {
      enabled: true,
      intervalSeconds: 30,
      timeoutSeconds: 10,
      method: 'rtsp_test'
    }
  }
];

// 🔧 E1 Pro Connection Configuration - RTSP ONLY
export const reoLinkE1ProConnectionConfig: IReoLinkE1ProConnection = {
  credentials: {
    username: 'admin',
    password: '!@m1cor1013rL'
  },
  
  rtspTimeout: 30000,
  retryAttempts: 3,
  retryDelay: 2000,
  
  conversionServer: {
    host: 'localhost',
    port: 3001,
    websocketPort: 9999,
    hlsPort: 8080,
  endpoints: {
      stream: '/stream',
      ptz: '/ptz',
      snapshot: '/snapshot',
      status: '/status'
    }
  },
  
  features: {
    rtspStreaming: true,
    onvifSupport: true,
    ptzControl: true,
    nightVision: true,
    audioRecording: true,
    motionDetection: true,
    httpApi: false, // ❌ NOT SUPPORTED by E1 Pro
    webInterface: false, // ❌ NOT SUPPORTED by E1 Pro
    directBrowserAccess: false // ❌ NOT SUPPORTED by E1 Pro
  }
};

// 📺 E1 Pro Stream Configuration - RTSP to HLS conversion
export const reoLinkE1ProStreamConfig: IReoLinkE1ProStreamConfig = {
  quality: {
    main: {
      resolution: '2304x1296', // 3K resolution
      bitrate: 4000,
      fps: 30,
      keyFrameInterval: 2
    },
    sub: {
      resolution: '1280x720', // 720p for sub stream
      bitrate: 1500,
      fps: 15,
      keyFrameInterval: 2
    }
  },
  
  hls: {
    segmentDuration: 2,
    playlistLength: 6,
    lowLatencyMode: true,
    startFromKeyFrame: true
  },
  
  websocket: {
    bufferSize: 1024 * 1024,
    maxRetries: 5,
    reconnectDelay: 3000
  }
};

// 🎮 PTZ Control Configuration - WebSocket based
export const reoLinkE1ProPTZConfig: IReoLinkE1ProPTZConfig = {
  websocketUrl: 'ws://localhost:9999/ptz',
  
  movements: {
    pan: { min: -180, max: 180, step: 5 },
    tilt: { min: -30, max: 30, step: 5 },
    zoom: { min: 1, max: 16, step: 1 }
  },
  
  presets: {
    1: { name: 'Home', description: 'Default position', position: { pan: 0, tilt: 0, zoom: 1 } },
    2: { name: 'Corner 1', description: 'Top left corner', position: { pan: -90, tilt: 15, zoom: 2 } },
    3: { name: 'Corner 2', description: 'Top right corner', position: { pan: 90, tilt: 15, zoom: 2 } },
    4: { name: 'Wide View', description: 'Full room view', position: { pan: 0, tilt: 0, zoom: 1 } },
    5: { name: 'Close Up', description: 'Zoomed view', position: { pan: 0, tilt: 0, zoom: 8 } }
  },
  
  autoTracking: {
      enabled: true,
    sensitivity: 'medium',
    trackingTypes: ['person', 'pet', 'motion']
  }
};

// 🎨 UI Configuration using brandConfig
export const reoLinkE1ProUIConfig = {
  colors: {
    connected: brandConfig.colors.pastureSage,
    disconnected: brandConfig.colors.victoryRose,
    streaming: brandConfig.colors.ribbonBlue,
    error: brandConfig.colors.errorRed,
    warning: brandConfig.colors.alertAmber,
    background: brandConfig.colors.arenaSand
  },
  
  layout: {
    videoAspectRatio: '16:9',
    controlPanelWidth: '300px',
    streamingIndicatorSize: '12px',
    ptzButtonSize: '48px'
  },
  
  animations: {
    connectionPulse: '2s ease-in-out infinite',
    streamingIndicator: '1s ease-in-out infinite alternate',
    ptzButtonPress: '0.1s ease-in-out'
  }
};

// 🔧 Helper Functions
export const reoLinkE1ProHelpers = {
  getEnabledCameras: (): IReoLinkE1ProCamera[] => {
    return reoLinkE1ProCameras.filter(camera => camera.enabled);
  },
  
  getCameraById: (id: string): IReoLinkE1ProCamera | undefined => {
    return reoLinkE1ProCameras.find(camera => camera.id === id);
  },
  
  buildRTSPUrl: (camera: IReoLinkE1ProCamera, stream: 'main' | 'sub'): string => {
    return camera.rtspStreams[stream];
  },
  
  buildHLSUrl: (camera: IReoLinkE1ProCamera, stream: 'main' | 'sub'): string => {
    return camera.hlsStreams[stream];
  },
  
  validateConnection: (camera: IReoLinkE1ProCamera): boolean => {
    return !!(camera.host && camera.username && camera.password && camera.rtspPort);
  },
  
  getConnectionInfo: (camera: IReoLinkE1ProCamera) => {
    return {
      rtspMain: camera.rtspStreams.main,
      rtspSub: camera.rtspStreams.sub,
      onvifUrl: `http://${camera.host}:${camera.onvifPort}`,
      serviceUrl: `http://${camera.host}:${camera.servicePort}`,
      canDirectConnect: false, // E1 Pro cannot be accessed directly from browser
      requiresConversion: true // E1 Pro requires RTSP-to-HLS conversion
    };
  }
};

// Active camera management
let activeCameraId: string = reoLinkE1ProCameras[0]?.id || '';

export const setActiveCameraId = (cameraId: string) => {
  activeCameraId = cameraId;
};

export const getActiveCameraId = (): string => {
  return activeCameraId;
};

export const getActiveCamera = (): IReoLinkE1ProCamera | undefined => {
  return reoLinkE1ProHelpers.getCameraById(activeCameraId);
};

// Connection diagnostics
export const reoLinkE1ProDiagnostics = {
  // Test RTSP connection (requires backend)
  testRTSPConnection: async (camera: IReoLinkE1ProCamera): Promise<boolean> => {
    try {
      const response = await fetch(`http://${reoLinkE1ProConnectionConfig.conversionServer.host}:${reoLinkE1ProConnectionConfig.conversionServer.port}/test-rtsp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rtspUrl: camera.rtspStreams.main,
          timeout: 10000
        })
      });
      return response.ok;
    } catch (error) {
      console.error('RTSP test failed:', error);
      return false;
    }
  },
  
  // Test conversion server availability
  testConversionServer: async (): Promise<boolean> => {
    try {
      const response = await fetch(`http://${reoLinkE1ProConnectionConfig.conversionServer.host}:${reoLinkE1ProConnectionConfig.conversionServer.port}/status`);
      return response.ok;
    } catch (error) {
      console.error('Conversion server test failed:', error);
      return false;
    }
  },
  
  // Comprehensive camera diagnostics
  runFullDiagnostics: async (camera: IReoLinkE1ProCamera) => {
    const results = {
      cameraId: camera.id,
      timestamp: new Date().toISOString(),
      rtspConnection: false,
      conversionServer: false,
      websocketConnection: false,
      overallHealth: 'unknown' as 'healthy' | 'degraded' | 'failed' | 'unknown'
    };
    
    try {
      // Test conversion server
      results.conversionServer = await reoLinkE1ProDiagnostics.testConversionServer();
      
      // Test RTSP connection
      results.rtspConnection = await reoLinkE1ProDiagnostics.testRTSPConnection(camera);
      
      // Test WebSocket connection
      results.websocketConnection = await new Promise<boolean>((resolve) => {
        const ws = new WebSocket(camera.hlsStreams.main);
        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };
        
        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      });
      
      // Determine overall health
      if (results.rtspConnection && results.conversionServer && results.websocketConnection) {
        results.overallHealth = 'healthy';
      } else if (results.conversionServer) {
        results.overallHealth = 'degraded';
      } else {
        results.overallHealth = 'failed';
      }
      
    } catch (error) {
      console.error('Diagnostics failed:', error);
      results.overallHealth = 'failed';
    }
    
    return results;
  }
};

// 📊 Configuration Analytics
export const reoLinkE1ProAnalytics = {
  // Configuration validation
  validateConfig: (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Check camera configurations
    reoLinkE1ProCameras.forEach(camera => {
      if (!camera.host) errors.push(`Camera ${camera.id}: Missing host`);
      if (!camera.username) errors.push(`Camera ${camera.id}: Missing username`);
      if (!camera.password) errors.push(`Camera ${camera.id}: Missing password`);
      if (!camera.rtspStreams.main) errors.push(`Camera ${camera.id}: Missing main RTSP stream`);
      if (!camera.rtspStreams.sub) errors.push(`Camera ${camera.id}: Missing sub RTSP stream`);
    });
    
    // Check conversion server config
    if (!reoLinkE1ProConnectionConfig.conversionServer.host) {
      errors.push('Missing conversion server host');
    }
    
    return { valid: errors.length === 0, errors };
  },
  
  // Configuration summary
  getConfigSummary: () => {
    return {
      totalCameras: reoLinkE1ProCameras.length,
      enabledCameras: reoLinkE1ProHelpers.getEnabledCameras().length,
      conversionServerRequired: true,
      directBrowserAccess: false,
      supportedFeatures: Object.keys(reoLinkE1ProConnectionConfig.features).filter(
        key => reoLinkE1ProConnectionConfig.features[key as keyof typeof reoLinkE1ProConnectionConfig.features]
      ),
      limitations: [
        'No HTTP API support',
        'No web interface',
        'RTSP streaming only',
        'Requires backend conversion server',
        'WebSocket required for PTZ control'
      ]
    };
  }
};

// Export legacy compatibility (for gradual migration)
export const reoLinkCameras = reoLinkE1ProCameras;
export const reoLinkConnectionConfig = reoLinkE1ProConnectionConfig;
export const reoLinkStreamConfig = reoLinkE1ProStreamConfig;
export const reoLinkUIConfig = reoLinkE1ProUIConfig;
export const reoLinkHelpers = reoLinkE1ProHelpers;
export const reoLinkStyles = reoLinkE1ProUIConfig;
export type IReoLinkCamera = IReoLinkE1ProCamera; 