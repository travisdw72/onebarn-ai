export const wyzeConfig = {
  // Wyze Bridge Configuration
  bridge: {
    baseUrl: 'http://localhost:8888',
    rtspPort: 8554,
    webrtcPort: 8189,
    rtmpPort: 1935,
    credentials: {
      email: import.meta.env.VITE_WYZE_EMAIL || '',
      password: import.meta.env.VITE_WYZE_PASSWORD || ''
    }
  },

  // Wyze API Configuration  
  api: {
    baseUrl: 'https://api.wyzecam.com',
    version: 'v1',
    timeout: 30000
  },

  // HLS Conversion Server Configuration
  hls: {
    baseUrl: 'http://localhost:3002',
    segmentDuration: 6,
    playlistSize: 5,
    outputPath: './hls-output'
  },

  // Default Camera Settings
  cameras: {
    defaultQuality: 'HD', // HD, SD, AUTO
    defaultStream: 'rtsp', // rtsp, rtmp, hls
    enableAudio: true,
    enableNightVision: true,
    recordingSettings: {
      format: 'mp4',
      bitrate: 2000,
      resolution: '1920x1080'
    }
  },

  // PTZ Control Settings
  ptz: {
    stepSize: 10,
    zoomStep: 1,
    presets: {
      home: { pan: 0, tilt: 0, zoom: 0 },
      corner1: { pan: -90, tilt: 0, zoom: 0 },
      corner2: { pan: 90, tilt: 0, zoom: 0 },
      overview: { pan: 0, tilt: -45, zoom: 0 }
    }
  },

  // Motion Detection Settings
  motionDetection: {
    enabled: true,
    sensitivity: 50,
    cooldownSeconds: 30,
    recordingDuration: 60
  },

  // Streaming URLs Templates
  streamUrls: {
    rtsp: (cameraName: string) => `rtsp://localhost:8554/${cameraName}`,
    rtspHD: (cameraName: string) => `rtsp://localhost:8554/${cameraName}-hd`,
    rtspSD: (cameraName: string) => `rtsp://localhost:8554/${cameraName}-sd`,
    hls: (cameraName: string) => `http://localhost:3002/hls/${cameraName}.m3u8`,
    rtmp: (cameraName: string) => `rtmp://localhost:1935/${cameraName}`,
    webrtc: (cameraName: string) => `ws://localhost:8189/${cameraName}`
  },

  // Error Handling
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    timeoutMs: 10000
  },

  // Logging Configuration
  logging: {
    level: 'info', // debug, info, warn, error
    enableConsole: true,
    enableFile: false,
    logPath: './logs/wyze.log'
  }
}; 