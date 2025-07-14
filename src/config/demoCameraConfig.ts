/**
 * 💼 BUSINESS PARTNER GUIDE - DEMO CAMERA CONFIGURATION
 * 
 * This file contains all camera-related configuration for the One Barn AI demo system.
 * All camera settings, UI text, and troubleshooting information are centralized here.
 * 
 * DEMO ACCOUNT SETTINGS:
 * - Only active for demo@onevault.ai account
 * - Professional demo-quality video settings
 * - Comprehensive business partner documentation
 * - Easy troubleshooting and support
 * 
 * BUSINESS PARTNER CUSTOMIZATION:
 * To modify camera settings for your demo:
 * 1. Update demoCameraSettings for technical parameters
 * 2. Modify demoCameraUI for interface text
 * 3. Adjust troubleshooting messages as needed
 * 4. Test changes with demo account
 * 
 * INTEGRATION POINTS:
 * - Used by CameraService for technical settings
 * - Used by UI components for all text content
 * - Used by troubleshooting components for help messages
 * - Used by setup wizard for onboarding flow
 */

import { brandConfig } from './brandConfig';
import { IDemoCameraConfig } from '../interfaces/CameraTypes';

// 🎥 DEMO CAMERA TECHNICAL SETTINGS
export const demoCameraSettings: IDemoCameraConfig = {
  // 💼 BUSINESS PARTNER SETTINGS
  enableDemoMode: true,
  demoAccountEmail: 'demo@onevault.ai',
  
  // 📹 CAMERA QUALITY SETTINGS
  // Professional demo-quality video for business partner presentations
  preferredResolution: {
    width: 1280,    // HD quality for crisp video
    height: 720     // 16:9 aspect ratio for professional appearance
  },
  preferredFrameRate: 30,        // Smooth video playback
  enableAudio: true,             // Enable microphone for complete demo
  enableAutoSwitch: false,       // Manual camera control for demo control
  
  // 🔧 TECHNICAL SETTINGS
  maxRetryAttempts: 3,           // Retry failed operations for reliability
  retryDelay: 2000,              // 2 second delay between retries
  enableDiagnostics: true,       // Enable diagnostic logging
  logLevel: 'info',              // Detailed logging for troubleshooting
  
  // 🎨 UI SETTINGS
  // Show all UI components for comprehensive demo experience
  showSetupWizard: true,         // Guide business partners through setup
  showTroubleshooting: true,     // Help with common issues
  showPermissionHelp: true,      // Clear permission instructions
  showDeviceSelection: true      // Allow camera device selection
};

// 📝 DEMO CAMERA USER INTERFACE TEXT
export const demoCameraUI = {
  // 🎯 SETUP WIZARD CONTENT
  setup: {
    title: 'Camera Setup for Demo',
    subtitle: 'Configure your camera for the One Barn AI demonstration',
    
    // Step-by-step setup instructions
    steps: {
      welcome: {
        title: 'Welcome to Camera Setup',
        description: 'This wizard will help you set up your camera for the One Barn AI demo system.',
        instructions: [
          'We\'ll guide you through camera permissions',
          'Help you select the best camera device',
          'Test your camera for optimal quality',
          'Ensure everything works perfectly for your demo'
        ]
      },
      
      permissions: {
        title: 'Camera Permissions',
        description: 'Grant camera access to enable live video monitoring',
        instructions: [
          'Click "Allow" when prompted for camera access',
          'Your camera is needed for AI analysis demonstration',
          'This is safe and secure - only you can see the video',
          'You can revoke permissions at any time'
        ],
        troubleshooting: {
          denied: 'Camera access was denied. Please refresh the page and try again.',
          noCamera: 'No camera found. Please ensure a camera is connected.',
          https: 'Camera requires a secure connection. Please use HTTPS.'
        }
      },
      
      deviceSelection: {
        title: 'Select Camera Device',
        description: 'Choose the camera device for your demonstration',
        instructions: [
          'Select your preferred camera from the list below',
          'Built-in webcam is usually the best choice',
          'You can switch cameras later if needed',
          'Test the camera preview to ensure quality'
        ],
        labels: {
          deviceList: 'Available Cameras',
          preview: 'Camera Preview',
          quality: 'Video Quality',
          testCamera: 'Test Camera',
          switchCamera: 'Switch Camera'
        }
      },
      
      testing: {
        title: 'Camera Testing',
        description: 'Test your camera setup before starting the demo',
        instructions: [
          'Check that your camera feed is clear and steady',
          'Ensure proper lighting for best AI analysis',
          'Test different positions if needed',
          'Audio is optional but recommended for full demo'
        ],
        status: {
          testing: 'Testing camera...',
          success: 'Camera test successful!',
          failed: 'Camera test failed. Please try again.',
          ready: 'Camera ready for demo'
        }
      },
      
      complete: {
        title: 'Setup Complete!',
        description: 'Your camera is ready for the One Barn AI demonstration',
        summary: 'Camera setup completed successfully. You can now use live video monitoring features in your demo.',
        nextSteps: [
          'Camera feed will appear in the Live Video Grid',
          'AI analysis will process your video in real-time',
          'You can switch cameras anytime using the device selector',
          'Support is available if you need help'
        ]
      }
    },
    
    // Setup wizard buttons
    buttons: {
      next: 'Next Step',
      previous: 'Previous',
      skip: 'Skip This Step',
      retry: 'Try Again',
      finish: 'Complete Setup',
      cancel: 'Cancel Setup',
      help: 'Need Help?',
      testCamera: 'Test Camera',
      grantPermissions: 'Grant Permissions',
      selectDevice: 'Select Device',
      startDemo: 'Start Demo'
    }
  },
  
  // 🎬 LIVE VIDEO INTERFACE
  liveVideo: {
    title: 'Live Camera Feed',
    subtitle: 'Real-time video monitoring for AI analysis',
    
    // Camera controls
    controls: {
      startCamera: 'Start Camera',
      stopCamera: 'Stop Camera',
      switchCamera: 'Switch Camera',
      toggleAudio: 'Toggle Audio',
      fullscreen: 'Fullscreen',
      settings: 'Camera Settings',
      troubleshooting: 'Troubleshooting'
    },
    
    // Status indicators
    status: {
      starting: 'Starting camera...',
      active: 'Camera Active',
      stopped: 'Camera Stopped',
      error: 'Camera Error',
      noPermission: 'No Permission',
      noDevice: 'No Device',
      connecting: 'Connecting...',
      ready: 'Ready for Demo'
    },
    
    // Device selector
    deviceSelector: {
      title: 'Select Camera',
      placeholder: 'Choose camera device',
      noDevices: 'No cameras available',
      refreshDevices: 'Refresh Devices',
      defaultDevice: 'Default Camera',
      currentDevice: 'Current: {deviceName}'
    },
    
    // Quality indicators
    quality: {
      resolution: 'Resolution: {width}x{height}',
      frameRate: 'Frame Rate: {fps} fps',
      audio: 'Audio: {status}',
      status: {
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor'
      }
    }
  },
  
  // 🔧 TROUBLESHOOTING CONTENT
  troubleshooting: {
    title: 'Camera Troubleshooting',
    subtitle: 'Common issues and solutions for demo camera setup',
    
    // Common problems and solutions
    problems: {
      noPermission: {
        title: 'Camera Permission Denied',
        description: 'Browser camera access was denied or blocked',
        solutions: [
          'Refresh the page and click "Allow" when prompted',
          'Check browser settings for camera permissions',
          'Ensure no other applications are using the camera',
          'Try using a different browser (Chrome recommended)'
        ],
        businessPartnerNote: 'This is the most common issue. Simply refresh and allow camera access.'
      },
      
      noCamera: {
        title: 'No Camera Found',
        description: 'No camera devices detected by the system',
        solutions: [
          'Ensure camera is connected and turned on',
          'Check device manager for camera drivers',
          'Try unplugging and reconnecting USB camera',
          'Restart browser and try again'
        ],
        businessPartnerNote: 'Built-in webcams should work automatically. USB cameras may need drivers.'
      },
      
      poorQuality: {
        title: 'Poor Video Quality',
        description: 'Video feed is blurry, dark, or pixelated',
        solutions: [
          'Improve lighting conditions',
          'Clean camera lens',
          'Adjust camera position',
          'Try different camera device'
        ],
        businessPartnerNote: 'Good lighting is essential for AI analysis demonstration.'
      },
      
      streamFailed: {
        title: 'Stream Failed to Start',
        description: 'Camera stream could not be initialized',
        solutions: [
          'Close other applications using camera',
          'Refresh the page and try again',
          'Check if camera is disabled in privacy settings',
          'Try different camera device'
        ],
        businessPartnerNote: 'Usually resolved by closing other camera applications.'
      },
      
      httpsRequired: {
        title: 'HTTPS Required',
        description: 'Camera access requires a secure connection',
        solutions: [
          'Use HTTPS instead of HTTP',
          'Use localhost for local testing',
          'Deploy to secure hosting environment',
          'Contact IT support for SSL certificate'
        ],
        businessPartnerNote: 'Modern browsers require HTTPS for camera access.'
      }
    },
    
    // Troubleshooting actions
    actions: {
      runDiagnostics: 'Run Diagnostics',
      refreshDevices: 'Refresh Devices',
      resetSettings: 'Reset Settings',
      contactSupport: 'Contact Support',
      viewLogs: 'View Logs',
      exportLogs: 'Export Logs',
      retrySetup: 'Retry Setup',
      skipCamera: 'Skip Camera'
    },
    
    // Support information
    support: {
      title: 'Additional Support',
      description: 'If you continue to have issues, here are additional resources',
      resources: [
        'Browser compatibility: Chrome, Firefox, Safari, Edge',
        'Minimum requirements: Webcam, microphone (optional)',
        'Network requirements: HTTPS or localhost',
        'Supported formats: MP4, WebM video streams'
      ],
      contact: {
        title: 'Contact Technical Support',
        description: 'For additional help with camera setup',
        email: 'support@onevault.ai',
        hours: 'Monday-Friday, 9 AM - 5 PM EST'
      }
    }
  },
  
  // 🎯 DEMO SPECIFIC MESSAGES
  demo: {
    title: 'One Barn AI Camera Demo',
    subtitle: 'Live video monitoring with AI analysis',
    
    // Welcome messages
    welcome: {
      title: 'Welcome to the One Barn AI Demo',
      description: 'Experience real-time video monitoring with AI-powered analysis',
      features: [
        'Live camera feed with HD quality',
        'Real-time AI behavior analysis',
        'Automatic alert generation',
        'Professional monitoring interface'
      ]
    },
    
    // Demo instructions
    instructions: {
      title: 'Demo Instructions',
      steps: [
        'Allow camera permissions when prompted',
        'Select your camera device from the dropdown',
        'Position camera for optimal view',
        'Watch live AI analysis in action'
      ],
      tips: [
        'Good lighting improves AI accuracy',
        'Steady camera position works best',
        'Audio is optional but recommended',
        'You can switch cameras anytime'
      ]
    },
    
    // Professional notes for business partners
    businessPartnerNotes: {
      title: 'Business Partner Notes',
      setup: 'Setup typically takes 2-3 minutes for first-time users',
      quality: 'HD video quality ensures professional demonstration',
      compatibility: 'Works with all modern browsers and devices',
      support: 'Technical support available during business hours',
      customization: 'Can be customized for specific use cases'
    }
  }
};

// 🎨 CAMERA UI STYLING (integrates with brand config)
export const demoCameraStyles = {
  // Video display styling
  video: {
    borderRadius: brandConfig.layout.borderRadius,
    border: `2px solid ${brandConfig.colors.hunterGreen}`,
    backgroundColor: brandConfig.colors.midnightBlack,
    aspectRatio: '16:9',
    maxWidth: '100%',
    objectFit: 'cover' as const
  },
  
  // Setup wizard styling
  wizard: {
    backgroundColor: brandConfig.colors.arenaSand,
    borderRadius: brandConfig.layout.borderRadius,
    padding: brandConfig.spacing.xl,
    boxShadow: `0 4px 12px ${brandConfig.colors.sterlingSilver}30`
  },
  
  // Control buttons styling
  controls: {
    primary: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
      fontSize: brandConfig.typography.fontSizeBase,
      fontFamily: brandConfig.typography.fontPrimary,
      fontWeight: brandConfig.typography.weightSemiBold
    },
    secondary: {
      backgroundColor: brandConfig.colors.hunterGreen,
      color: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
      fontSize: brandConfig.typography.fontSizeBase,
      fontFamily: brandConfig.typography.fontPrimary,
      fontWeight: brandConfig.typography.weightMedium
    }
  },
  
  // Status indicators styling
  status: {
    active: {
      color: brandConfig.colors.pastureSage,
      backgroundColor: `${brandConfig.colors.pastureSage}20`,
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium
    },
    error: {
      color: brandConfig.colors.victoryRose,
      backgroundColor: `${brandConfig.colors.victoryRose}20`,
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium
    },
    warning: {
      color: brandConfig.colors.alertAmber,
      backgroundColor: `${brandConfig.colors.alertAmber}20`,
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium
    }
  }
};

// 📊 CAMERA ANALYTICS CONFIG
export const demoCameraAnalytics = {
  // Track demo usage for business partner feedback
  trackSetupTime: true,
  trackDeviceSwitches: true,
  trackErrorCount: true,
  trackPermissionDenials: true,
  
  // Analytics events
  events: {
    setupStarted: 'demo_camera_setup_started',
    setupCompleted: 'demo_camera_setup_completed',
    cameraStarted: 'demo_camera_started',
    deviceSwitched: 'demo_camera_device_switched',
    errorOccurred: 'demo_camera_error',
    permissionDenied: 'demo_camera_permission_denied'
  },
  
  // Performance thresholds
  thresholds: {
    maxSetupTime: 300000,        // 5 minutes
    maxErrorCount: 3,            // 3 errors per session
    minFrameRate: 15,            // 15 fps minimum
    maxPermissionDenials: 2      // 2 permission denials per session
  }
};

// 🎯 EXPORT CONFIGURATION
export const demoCameraConfig = {
  settings: demoCameraSettings,
  ui: demoCameraUI,
  styles: demoCameraStyles,
  analytics: demoCameraAnalytics
};

export default demoCameraConfig; 