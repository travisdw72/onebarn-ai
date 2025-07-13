/**
 * New Dashboard Configuration
 * Mobile-first, clean dashboard settings for One Barn AI
 * Integrates with existing brandConfig and dashboardConfig
 */

import { brandConfig } from './brandConfig';
import { dashboardConfig } from './dashboardConfig';

export interface INewDashboardConfig {
  layout: {
    videoGridRatio: string;
    insightsPanelRatio: string;
    mobileBreakpoint: string;
    touchTargetSize: string;
    headerHeight: string;
    sidebarCollapsedWidth: string;
  };
  
  aiChat: {
    defaultMessage: string;
    voiceEnabled: boolean;
    contextualResponses: boolean;
    emergencyKeywords: string[];
    maxMessages: number;
    autoScrollDelay: number;
  };
  
  video: {
    autoSelectFirst: boolean;
    alertOverlays: boolean;
    touchControls: boolean;
    fullscreenEnabled: boolean;
    gridColumns: number;
    refreshInterval: number;
  };
  
  emergencyProtocols: {
    vetContactEnabled: boolean;
    staffNotificationEnabled: boolean;
    automaticRecording: boolean;
    escalationTimeout: number;
    criticalAlertSound: boolean;
  };
  
  mobile: {
    swipeGestures: boolean;
    gloveMode: boolean;
    largeButtons: boolean;
    voiceCommands: boolean;
    hapticFeedback: boolean;
  };
  
  performance: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    cacheStrategy: string;
    prefetchData: boolean;
  };
}

export const newDashboardConfig: INewDashboardConfig = {
  layout: {
    videoGridRatio: '70%',
    insightsPanelRatio: '30%',
    mobileBreakpoint: brandConfig.layout.breakpoints.mobileMd,
    touchTargetSize: '48px', // Minimum for glove use
    headerHeight: '64px',
    sidebarCollapsedWidth: '60px',
  },
  
  aiChat: {
    defaultMessage: "Hi! I'm your AI Guardian. I'm currently monitoring your horses. Ask me anything about their wellbeing, behavior, or recent activity.",
    voiceEnabled: true,
    contextualResponses: true,
    emergencyKeywords: ['emergency', 'vet', 'urgent', 'help', 'emergency', 'critical', 'danger'],
    maxMessages: 50,
    autoScrollDelay: 100,
  },
  
  video: {
    autoSelectFirst: true,
    alertOverlays: true,
    touchControls: true,
    fullscreenEnabled: true,
    gridColumns: 4,
    refreshInterval: 30000, // 30 seconds
  },
  
  emergencyProtocols: {
    vetContactEnabled: true,
    staffNotificationEnabled: true,
    automaticRecording: true,
    escalationTimeout: 300, // 5 minutes
    criticalAlertSound: true,
  },
  
  mobile: {
    swipeGestures: true,
    gloveMode: true,
    largeButtons: true,
    voiceCommands: true,
    hapticFeedback: true,
  },
  
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    cacheStrategy: 'stale-while-revalidate',
    prefetchData: true,
  },
};

// Enhanced dashboard content for new interface
export const newDashboardContent = {
  welcome: {
    title: 'Welcome to One Barn AI',
    subtitle: 'Real-time horse monitoring and management',
    aiGreeting: newDashboardConfig.aiChat.defaultMessage,
  },
  
  navigation: {
    dashboard: 'Dashboard',
    horses: 'My Horses',
    cameras: 'Live Cameras',
    alerts: 'Alerts',
    reports: 'Reports',
    settings: 'Settings',
  },
  
  buttons: {
    viewLive: 'View Live',
    emergency: 'Emergency',
    callVet: 'Call Vet',
    alertStaff: 'Alert Staff',
    capture: 'Capture',
    logEvent: 'Log Event',
    fullscreen: 'Fullscreen',
    audioOn: 'Audio On',
    audioOff: 'Audio Off',
    voiceOn: 'Voice On',
    voiceOff: 'Voice Off',
  },
  
  messages: {
    noAlerts: 'All horses are safe and sound',
    systemOnline: 'All systems operational',
    emergencyActive: 'EMERGENCY MODE ACTIVE',
    selectCamera: 'Select a camera to view live feed',
    loading: 'Loading...',
    connecting: 'Connecting...',
    offline: 'Offline',
    retry: 'Retry Connection',
  },
  
  tooltips: {
    aiChat: 'AI-powered assistance for horse monitoring',
    emergencyButton: 'Immediate emergency response',
    cameraGrid: 'Live video feeds from all barn cameras',
    alerts: 'Real-time AI-detected alerts and insights',
    fullscreen: 'View in fullscreen mode',
    audio: 'Toggle audio for video feeds',
    voice: 'Voice commands and responses',
  },
  
  accessibility: {
    altTextCamera: 'Live camera feed',
    altTextAlert: 'Alert notification',
    altTextHorse: 'Horse status indicator',
    ariaLabelEmergency: 'Emergency response button',
    ariaLabelChat: 'AI chat interface',
    ariaLabelVideo: 'Video control',
  },
};

// Mobile-specific configurations
export const mobileConfig = {
  touchTargets: {
    minimum: '44px',
    recommended: '48px',
    gloveMode: '56px',
  },
  
  gestures: {
    swipeThreshold: 50,
    tapDelay: 150,
    longPressDelay: 500,
  },
  
  vibration: {
    alertPattern: [200, 100, 200],
    emergencyPattern: [500, 200, 500, 200, 500],
    feedbackPattern: [50],
  },
};

// Emergency response configurations
export const emergencyConfig = {
  contacts: {
    veterinarian: {
      name: 'Emergency Veterinarian',
      phone: '(555) 123-VETS',
      email: 'emergency@vetservice.com',
    },
    facility: {
      name: 'Facility Manager',
      phone: '(555) 123-BARN',
      email: 'manager@onebarn.com',
    },
    support: {
      name: 'Technical Support',
      phone: '(555) 123-TECH',
      email: 'support@onebarn.com',
    },
  },
  
  protocols: {
    autoRecord: true,
    autoNotify: true,
    autoCapture: true,
    autoLog: true,
  },
  
  escalation: {
    timeouts: {
      initial: 60, // 1 minute
      secondary: 300, // 5 minutes
      final: 900, // 15 minutes
    },
    
    levels: [
      'staff_notification',
      'facility_manager',
      'veterinarian',
      'emergency_services',
    ],
  },
}; 