import type { ILiveStreamConfig } from './liveStreamConfig.interface';

export const liveStreamConfig: ILiveStreamConfig = {
  // 📺 Stream Information
  streamInfo: {
    title: 'Live Horse Monitor',
    description: 'Real-time horse monitoring via live stream',
    defaultStreamType: 'youtube',
    maxViewers: 50,
    location: 'Main Pasture Area',
    qualityLabel: 'Stream Quality',
    sourceLabel: 'Stream Source', 
    locationLabel: 'Camera Location'
  },

  // 🎮 Stream Controls
  controls: {
    play: 'Play Stream',
    pause: 'Pause Stream',
    startStream: 'Start Stream',
    stopStream: 'Stop Stream',
    connecting: 'Connecting...',
    fullscreen: 'Fullscreen',
    enterFullscreen: 'Enter Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    volume: 'Volume',
    quality: 'Quality',
    reload: 'Reload Stream',
    refreshStream: 'Refresh Stream',
    screenshot: 'Take Screenshot',
    takeScreenshot: 'Take Screenshot',
    screenshots: 'Screenshots',
    settings: 'Settings',
    exportData: 'Export Data',
    backToDashboard: 'Back to Dashboard',
    streamUrlLabel: 'Stream URL',
    streamUrlPlaceholder: 'Enter YouTube live stream URL...'
  },

  // 📝 Status Messages
  status: {
    live: 'LIVE',
    viewers: 'viewers',
    connectionStatus: 'Connection Status',
    connecting: 'Connecting to stream...',
    establishingConnection: 'Establishing secure connection...',
    connectionError: 'Connection Error',
    checkConnection: 'Please check your connection and try again.',
    streamOffline: 'Stream Offline',
    enterUrlToStart: 'Enter a valid stream URL above to start monitoring.'
  },

  // 🎯 Stream Sources
  sources: {
    youtube: {
      name: 'YouTube Live',
      description: 'YouTube live stream integration',
      icon: '📺',
      defaultUrl: 'https://www.youtube.com/watch?v=3cFi7fSYWx8&ab_channel=ExperiencingLondon', // Default to first predefined stream
      embedTemplate: 'https://www.youtube.com/embed/{videoId}?autoplay=1&mute=1&controls=1&rel=0&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&modestbranding=1',
      enabled: true
    },
    twitch: {
      name: 'Twitch Stream',
      description: 'Twitch live stream integration',
      icon: '💜',
      defaultUrl: '',
      embedTemplate: 'https://player.twitch.tv/?channel={channelName}&parent={domain}&autoplay=true&muted=true',
      enabled: false
    },
    custom: {
      name: 'Custom Stream',
      description: 'Custom streaming source',
      icon: '🔗',
      defaultUrl: '',
      embedTemplate: '{url}',
      enabled: true
    },
    // 🌟 Predefined Streams - Easy to expand
    predefined: [
      {
        id: 'london-experience',
        name: 'London Experience Live',
        description: 'Primary live stream from London',
        url: 'https://www.youtube.com/watch?v=3cFi7fSYWx8&ab_channel=ExperiencingLondon',
        category: 'travel',
        isDefault: true
      },
      {
        id: 'secondary-stream',
        name: 'Secondary Camera Feed',
        description: 'Backup camera angle',
        url: 'https://www.youtube.com/watch?v=FgX0re89IVY',
        category: 'backup'
      },
      {
        id: 'third-stream',
        name: 'Tertiary Camera View',
        description: 'Third camera perspective',
        url: 'https://www.youtube.com/watch?v=XMB7lJePXkc',
        category: 'alternate'
      }
    ]
  },

  // 🤖 AI Analysis Integration
  aiAnalysis: {
    enabled: true,
    title: 'AI Analysis',
    enableAnalysis: 'Enable AI Analysis',
    captureInterval: 30, // seconds
    captureIntervalLabel: 'Analysis Interval',
    minInterval: 10,
    maxInterval: 300,
    intervalStep: 10,
    waitingForData: 'Analyzing stream... Data will appear here shortly.',
    analysisTypes: [
      'horse-behavior',
      'movement-analysis', 
      'health-monitoring',
      'environmental-conditions'
    ],
    autoCapture: false,
    saveAnalysisHistory: true,
    // 📸 Photo Sequence Analysis - NEW
    photoSequence: {
      enabled: true,
      title: 'Photo Sequence Analysis',
      buttonText: 'Analyze Stream',
      buttonTextAnalyzing: 'Analyzing Photos...',
      photosPerSequence: 10,
      captureIntervalSeconds: 6, // 6 seconds between each photo
      totalSequenceTimeSeconds: 60, // 1 minute total sequence
      // Demo mode settings
      demoMode: {
        enabled: true, // Set to false in production
        maxAnalysisCount: 10,
        storageKey: 'liveStreamAnalysisCount',
        limitReachedMessage: 'Demo limit reached (10 analyses). Please contact support for unlimited access.',
        resetOnNewSession: false
      },
      // Production mode settings
      productionMode: {
        enabled: false, // Set to true in production
        continuousAnalysis: true,
        intervalMinutes: 10,
        autoStart: false,
        maxContinuousHours: 24,
        pauseAfterHours: 24
      }
    }
  },

  // 💡 Help and Tooltips
  tooltips: {
    'stream-url': 'Enter a YouTube live stream URL to monitor your horse',
    'quality-selector': 'Choose stream quality based on your connection',
    'fullscreen': 'Click to view in fullscreen mode',
    'ai-analysis': 'Enable AI-powered horse behavior analysis',
    'screenshot': 'Capture current frame for analysis',
    'connection-status': 'Real-time connection status indicator'
  },

  // 📊 Stream Analytics
  analytics: {
    trackViewTime: true,
    trackInteractions: true,
    trackQualityChanges: true,
    trackErrors: true,
    reportingInterval: 60 // seconds
  },

  // ⚙️ Technical Settings
  technical: {
    autoRetryAttempts: 3,
    retryDelay: 5000, // milliseconds
    connectionTimeout: 10000, // milliseconds
    bufferSize: 5, // seconds
    qualityOptions: ['auto', '720p', '480p', '360p', '240p'],
    defaultQuality: 'auto'
  },

  // 🔒 Security Settings
  security: {
    requireAuthentication: true,
    allowedDomains: [
      'youtube.com',
      'youtu.be',
      'twitch.tv',
      'localhost',        // For local streams
      '127.0.0.1',       // For local IP streams
      'your-domain.com'   // Add your custom domain here
    ],
    validateStreamUrls: false, // Temporarily disabled for custom streams
    maxUrlLength: 2048
  },

  // 📱 Mobile-First Design & Layout
  mobile: {
    enableMobileControls: true,
    touchGestures: {
      doubleTapFullscreen: true,
      pinchZoom: false,
      swipeVolume: true,
      swipeStreamSelection: true, // Swipe between predefined streams
      pullToRefresh: true
    },
    adaptiveQuality: true,
    reducedMotion: false,
    layout: {
      priorityOrder: [
        'streamUrlInput',     // 1. URL input at top
        'streamPlayer',       // 2. Video stream 
        'aiAnalysis',         // 3. AI analysis section
        'streamSelection',    // 4. Stream switching
        'controls',           // 5. Additional controls
        'settings'            // 6. Settings at bottom
      ],
      stackVertically: true,
      compactSpacing: true,
      stickyControls: false,
      collapsibleSections: ['controls', 'settings', 'analytics'],
      minimumTouchTarget: '48px',
      preferredTouchTarget: '56px'
    },
    urlInput: {
      alwaysVisible: true,
      position: 'top',
      placeholder: 'Enter stream URL or select preset...',
      clearButton: true,
      pasteButton: true,
      suggestionDropdown: true
    },
    streamPlayer: {
      fullWidthOnMobile: true,
      aspectRatio: '16:9',
      minHeight: '200px',
      maxHeight: '60vh',
      tapToToggleControls: true,
      swipeUpForFullscreen: true
    },
    aiAnalysis: {
      collapsible: false, // Always show on mobile
      compactView: true,
      showSummaryFirst: true,
      expandableDetails: true
    },
    streamSelection: {
      horizontalScroll: true,
      showThumbnails: false, // Save space on mobile
      quickSwipe: true,
      categoryTabs: true
    }
  },

  // 🎨 Visual Styling
  styling: {
    playerAspectRatio: '16:9',
    controlsTimeout: 3000, // milliseconds
    loadingAnimation: 'pulse',
    borderRadius: '12px',
    overlayOpacity: 0.8,
    // 📱 Mobile-first responsive styling
    mobile: {
      compactHeader: true,
      reducedPadding: true,
      largerButtons: true,
      increasedLineHeight: true,
      simplifiedUI: true,
      hideNonEssentialElements: true
    }
  },

  // 📋 Messages
  messages: {
    streamLoadError: 'Unable to load stream. Please check the URL and try again.',
    connectionLost: 'Connection to stream lost. Attempting to reconnect...',
    streamOffline: 'Stream is currently offline. Please try again later.',
    invalidUrl: 'Invalid stream URL. Please enter a valid YouTube or stream URL.',
    screenshotSuccess: 'Screenshot captured successfully!',
    screenshotError: 'Unable to capture screenshot. Please try again.',
    aiAnalysisStarted: 'AI analysis started. Results will appear in the analysis panel.',
    aiAnalysisError: 'AI analysis failed. Please try again.',
    noStreamSelected: 'Please enter a stream URL to begin monitoring.',
    // 📱 Mobile-specific messages
    mobile: {
      tapToStart: 'Tap to start monitoring',
      swipeToSwitch: 'Swipe left/right to switch streams',
      pullToRefresh: 'Pull down to refresh stream',
      rotateForFullscreen: 'Rotate device for fullscreen view',
      connectionOptimized: 'Connection optimized for mobile',
      reducedQuality: 'Quality reduced for mobile connection',
      wifiRecommended: 'WiFi recommended for best experience',
      dataUsageWarning: 'Live streaming uses mobile data'
    }
  },

  // 🎪 Features
  features: {
    enableScreenshots: true,
    enableRecording: false, // Disabled for YouTube compliance
    enableChatIntegration: false,
    enableStreamMetrics: true,
    enableQualitySelector: true,
    enableVolumeControl: true,
    enablePlaybackSpeed: false, // Not applicable for live streams
    enableSubtitles: false,
    enablePictureInPicture: true
  }
}; 