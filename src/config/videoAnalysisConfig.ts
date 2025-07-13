export const videoAnalysisConfig = {
  // Video recording settings
  recording: {
    defaultDuration: 30, // seconds (total for all clips)
    clipDuration: 10, // seconds per individual clip
    totalClips: 3, // number of clips to record
    maxDuration: 120, // seconds
    minDuration: 10, // seconds
    // Updated format priorities to avoid WebM duration issues
    videoFormat: 'video/mp4;codecs=h264,aac', // Prefer MP4 first for better duration handling
    fallbackFormats: [
      'video/mp4;codecs=h264,aac',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm'
    ],
    preferredOutputFormat: 'mp4', // For better AI analysis
    frameRate: 30,
    quality: 0.8,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },

  // Multi-clip recording settings
  multiClip: {
    enabled: true,
    clipDuration: 9, // 9 seconds per clip (shorter for rate limiting)
    totalClips: 3, // 3 clips total = exactly 27.0 seconds
    gapBetweenClips: 0, // No gap between clips for exact 27.0s total
    combineToMP4: true, // Convert final video to MP4 for better AI analysis
    // Force MP4 for multi-clip to avoid duration issues
    preferredFormat: 'video/mp4;codecs=h264,aac',
    progressPhases: {
      recording: 70, // 70% of progress for recording
      combining: 15, // 15% for combining clips
      converting: 10, // 10% for format conversion
      analyzing: 5  // 5% for AI analysis
    },
    // Video processing options to handle duration issues
    processingOptions: {
      enforceExactDuration: true, // Ensure exact clip durations
      waitForMetadata: 2000, // Wait 2s for video metadata to load
      validateDuration: true, // Validate duration before analysis
      fallbackToSingleFrame: true // Use single frame if duration issues persist
    }
  },

  // Analysis intervals and timing
  intervals: {
    defaultRecordingInterval: 27, // seconds (exactly 27.0s recording, no gaps)
    minGapBetweenRecordings: 2, // seconds
    maxConcurrentUploads: 2,
    uploadTimeout: 60000, // 1 minute
    analysisTimeout: 120000, // 2 minutes
    // New: AI analysis debugging
    debugAnalysis: true, // Enable detailed AI analysis logging
    logAIResponses: true, // Log raw AI responses for debugging
  },

  // UI labels and text
  labels: {
    liveCamera: 'Live Camera Feed',
    videoPlayback: 'Video Playback',
    recording: 'Recording',
    multiClipRecording: 'Recording Multi-Clip',
    autoRecord: 'Auto Record',
    recordingSegment: 'Recording Segment:',
    recordingClip: 'Recording Clip:',
    uploadingSegment: 'Uploading Segment for Analysis...',
    combiningClips: 'Combining video clips...',
    convertingFormat: 'Converting to optimized format...',
    latestAnalysis: 'Latest Analysis',
    latestMultiClipAnalysis: 'Latest Multi-Clip Analysis',
    sessionSummary: 'Session Summary',
    segmentsAnalyzed: 'Segments Analyzed',
    multiClipSessions: 'Multi-Clip Sessions',
    avgConfidence: 'Avg Confidence',
    recentSegments: 'Recent Segments',
    recentMultiClipSessions: 'Recent Multi-Clip Sessions',
    confidence: 'Confidence',
    horsesDetected: 'Horses Detected',
    keyObservations: 'Key Observations',
    recommendations: 'Recommendations',
    segments: 'Segments',
    clips: 'Clips',
    // Scene Description Labels
    sceneDescription: 'What AI Sees',
    environmentDetails: 'Environment',
    horseDescription: 'Horse Details',
    positioning: 'Positioning',
    cameraQuality: 'Video Quality',
    sceneAssessment: 'Scene Assessment',
    setting: 'Setting',
    surfaceType: 'Surface',
    lighting: 'Lighting',
    weatherVisible: 'Weather',
    coatColor: 'Coat Color',
    markings: 'Markings',
    bodyCondition: 'Body Condition',
    tackEquipment: 'Equipment',
    locationInFrame: 'Frame Position',
    distanceFromCamera: 'Distance',
    imageClarity: 'Image Quality',
    cameraAngle: 'Camera Angle'
  },

  // Button labels
  buttons: {
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    startMultiClipRecording: 'Record 3x9s Clips & Send to AI',
    stopMultiClipRecording: 'Stop Multi-Clip Recording',
    analyzeSegment: 'Analyze Segment',
    clearHistory: 'Clear History',
    downloadResults: 'Download Results',
    pauseRecording: 'Pause Recording',
    resumeRecording: 'Resume Recording'
  },

  // Status messages
  messages: {
    analyzingVideo: 'Analyzing video segment with AI...',
    analyzingMultiClip: 'Analyzing multi-clip video with AI...',
    uploadComplete: 'Video segment uploaded successfully',
    multiClipComplete: 'Multi-clip session complete',
    analysisComplete: 'Analysis complete',
    recordingStarted: 'Recording started',
    multiClipRecordingStarted: 'Multi-clip recording started',
    recordingStopped: 'Recording stopped',
    multiClipRecordingStopped: 'Multi-clip recording stopped',
    combiningClips: 'Combining video clips...',
    convertingToMP4: 'Converting to MP4 for better AI analysis...',
    errorRecording: 'Error starting recording',
    errorMultiClipRecording: 'Error starting multi-clip recording',
    errorUploading: 'Error uploading video segment',
    errorAnalyzing: 'Error analyzing video segment',
    errorCombiningClips: 'Error combining video clips',
    errorConvertingFormat: 'Error converting video format',
    noVideoDevice: 'No video device found',
    permissionDenied: 'Camera permission denied',
    networkError: 'Network error - check connection',
    storageWarning: 'Storage space low'
  },

  // Analysis thresholds
  thresholds: {
    highConfidence: 0.8,
    mediumConfidence: 0.6,
    lowConfidence: 0.4,
    urgentAlert: 0.9,
    highRisk: 0.7,
    mediumRisk: 0.5,
    lowRisk: 0.3
  },

  // Video quality settings
  videoQuality: {
    high: {
      width: 1920,
      height: 1080,
      bitrate: 5000000 // 5 Mbps
    },
    medium: {
      width: 1280,
      height: 720,
      bitrate: 2500000 // 2.5 Mbps
    },
    low: {
      width: 640,
      height: 480,
      bitrate: 1000000 // 1 Mbps
    }
  },

  // Storage and history
  storage: {
    maxHistoryItems: 50,
    maxLocalStorageSize: 10 * 1024 * 1024, // 10MB
    cacheExpiryDays: 7,
    autoCleanup: true
  },

  // Supported formats and codecs
  formats: {
    recording: {
      preferred: [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac'
      ],
      fallback: 'video/webm'
    },
    output: {
      aiOptimized: 'video/mp4', // Best for AI analysis
      webOptimized: 'video/webm', // Best for web playback
      universal: 'video/mp4' // Most compatible
    }
  },

  // Analysis modes
  analysisModes: {
    realtime: {
      label: 'Real-time',
      description: 'Continuous analysis every 30 seconds',
      priority: 'high',
      maxConcurrent: 1
    },
    scheduled: {
      label: 'Scheduled',
      description: 'Analysis at specific intervals',
      priority: 'medium',
      maxConcurrent: 2
    },
    onDemand: {
      label: 'On Demand',
      description: 'Manual analysis when requested',
      priority: 'high',
      maxConcurrent: 1
    }
  },

  // Alert configurations
  alerts: {
    urgent: {
      color: '#d32f2f',
      sound: true,
      notification: true,
      autoAction: 'notify_vet'
    },
    high: {
      color: '#f57c00',
      sound: true,
      notification: true,
      autoAction: 'flag_review'
    },
    medium: {
      color: '#fbc02d',
      sound: false,
      notification: true,
      autoAction: 'log_event'
    },
    low: {
      color: '#388e3c',
      sound: false,
      notification: false,
      autoAction: 'none'
    }
  },

  // Export and reporting
  export: {
    formats: ['json', 'csv', 'pdf'],
    includeVideoThumbnails: true,
    maxExportItems: 100,
    compressionLevel: 'medium'
  },

  // Scene Description Display Configuration
  sceneDescription: {
    // Display preferences for scene description components
    displayOrder: [
      'overallSceneAssessment',
      'environment',
      'horseDescription',
      'positioning',
      'cameraQuality'
    ],
    
    // Which components to show by default
    defaultVisible: {
      overallSceneAssessment: true,
      environment: true,
      horseDescription: true,
      positioning: false,
      cameraQuality: false,
      backgroundElements: false
    },
    
    // Compact view settings for mobile/small screens
    compactView: {
      maxDescriptionLength: 100,
      showOnlyEssentials: true,
      essentialFields: ['overallSceneAssessment', 'setting', 'coatColor']
    },
    
    // Icon mapping for different scene elements
    icons: {
      environment: '🏞️',
      horseDescription: '🐎',
      positioning: '📍',
      cameraQuality: '📷',
      setting: '🏢',
      surfaceType: '🌱',
      lighting: '💡',
      weatherVisible: '🌤️',
      coatColor: '🎨',
      tackEquipment: '🎯',
      imageClarity: '🔍'
    },
    
    // Color coding for quality indicators
    qualityColors: {
      excellent: '#4caf50',  // Green
      good: '#8bc34a',       // Light Green
      fair: '#ffeb3b',       // Yellow
      poor: '#ff9800',       // Orange
      critical: '#f44336'    // Red
    },
    
    // Messages for different scenarios
    messages: {
      noHorseDetected: 'No horse detected in this frame',
      lowQuality: 'Video quality may affect analysis accuracy',
      multipleHorses: 'Multiple horses detected - analysis may be less precise',
      obstuctedView: 'View partially obstructed',
      idealConditions: 'Ideal conditions for analysis'
    }
  }
}; 