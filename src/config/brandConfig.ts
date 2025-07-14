import type { IBrandConfig } from '../interfaces/config/brandConfig.interface';

export const brandConfig: IBrandConfig = {
  // Application Information
  application: {
    name: 'One Barn AI',
    description: 'AI-Powered Equestrian Analysis Platform',
    version: '2.1.0',
    environment: 'development',
    companyName: 'One Barn AI LLC',
    supportEmail: 'support@onebarnai.com',
    website: 'https://onebarnai.com'
  },

  // Logo Configuration
  logo: {
    // SVG File Paths
    paths: {
      light: '/images/one_barn_logo_white.svg',
      dark: '/images/one_barn_logo_dark.svg'
    },
    
    // Logo Display Options
    display: {
      useSvg: true,              // Use SVG instead of text
      fallbackToText: true,      // Fallback to text if SVG fails
      showBoth: false            // Show both SVG and text
    },
    
    // Logo Dimensions for different contexts
    dimensions: {
      header: { width: '180px', height: '60px' },
      registration: { width: '160px', height: '53px' },
      mobile: { width: '100px', height: '33px' }
    }
  },

  // Color Palette Standards
  colors: {
    // Primary Colors
    stableMahogany: '#8B4513',
    arenaSand: '#F5E6D3',
    midnightBlack: '#1A1A1A',
    barnWhite: '#FFFFFF',
    
    // Secondary Colors
    hunterGreen: '#2C5530',
    sterlingSilver: '#B8B5B0',
    chestnutGlow: '#C67B5C',
    
    // NEW: Template-inspired additions
    stableMahoganyDark: '#6B3A2C',        // Template's stable-mahogany
    
    // Performance Accent Colors
    championGold: '#D4A574',
    ribbonBlue: '#4A6FA5',
    victoryRose: '#B85450',
    pastureSage: '#8B9574',
    
    // Functional Colors
    successGreen: '#3E7B3F',
    alertAmber: '#E89923',
    errorRed: '#CC3333',
    infoBlue: '#5B7C99',
    warningOrange: '#FF8C00',
    
    // Utility Colors
    neutralGray: '#6B7280',
    
    // Referenced colors from existing code
    weatheredWood: '#8B7355',
    goldenStraw: '#DAA520',
    alertRed: '#DC3545',
    skyBlue: '#87CEEB',
    
    // Standard UI colors
    primary: '#8B4513',
    secondary: '#2C5530',
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    
    // Background and text
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#212529',
    textSecondary: '#6C757D',
  },

  // Typography Standards
  typography: {
    fontDisplay: '"Bebas Neue", display',
    fontPrimary: 'Inter, sans-serif',
    fontSecondary: '"Source Sans Pro", sans-serif',
    fontMono: '"Fira Code", monospace',
    
    // Font Weights
    weightLight: 300,
    weightRegular: 400,
    weightMedium: 500,
    weightSemiBold: 600,
    weightBold: 700,
    
    // Line Heights
    lineHeightTight: 1.2,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.7,
    
    // Font Sizes
    fontSizeXs: '0.75rem',
    fontSizeSm: '0.875rem',
    fontSizeBase: '1rem',
    fontSizeLg: '1.125rem',
    fontSizeXl: '1.25rem',
    fontSize2xl: '1.5rem',
    fontSize3xl: '1.875rem',
    fontSize4xl: '2.25rem',
    
    // NEW: Large display sizes for hero
    fontSizeDisplay: '4rem',      // 64px - Hero title
    fontSizeDisplayLg: '6rem',    // 96px - Large hero
    fontSizeDisplayXl: '8rem',    // 128px - Extra large hero
    
    // NEW: Animation-friendly weights
    weightNormal: 400,
    weightExtraBold: 800
  },

  // Spacing Standards
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem'      // 48px
  },

  // NEW: Animation configurations
  animations: {
    transitions: {
      smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      spring: { type: 'spring', stiffness: 200 }
    },
    durations: {
      fast: 0.3,
      normal: 0.6,
      slow: 0.8,
      countUp: 2.0
    },
    delays: {
      stagger: 0.1,
      section: 0.2
    }
  },

  // NEW: Gradient definitions
  gradients: {
    heroPrimary: 'linear-gradient(135deg, #6B3A2C, #C67B5C, #6B3A2C)',
    heroOverlay: 'linear-gradient(to br, transparent, rgba(244, 232, 216, 0.2), transparent)',
    featureAccent: 'linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(74, 111, 165, 0.2))',
    statusCard: 'linear-gradient(to br, #F4E8D8, rgba(184, 181, 176, 0.3), #F4E8D8)'
  },

  // Layout Configuration
  layout: {
    maxWidth: '1200px',
    containerPadding: '1rem',
    headerHeight: '64px',
    sidebarWidth: '240px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    
    // Breakpoints
    breakpoints: {
      mobileXs: '320px',
      mobileSm: '480px',
      mobileMd: '768px',
      tablet: '1024px',
      desktop: '1280px',
      largeDesktop: '1440px'
    }
  },

  // Feature Flags
  features: {
    enableOfflineMode: true,
    enableVoiceCommands: true,
    enableMobileApp: true,
    enableAdvancedReporting: true,
    enableMultiTenant: true,
    enableAuditLogging: true,
    enableRoleBasedAccess: true
  },

  // Security Configuration
  security: {
    sessionTimeout: 480, // 8 hours in minutes
    requireTwoFactor: false,
    enablePasswordPolicy: true,
    auditAllActions: true,
    encryptionRequired: true
  },

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3001/api/v1',
    timeout: 30000,
    retryAttempts: 3,
    enableCaching: true
  },

  // Tenant Configuration
  tenant: {
    enableMultiTenant: true,
    defaultTheme: 'stable',
    allowCustomBranding: true,
    enableTenantIsolation: true
  },

  // 📹 ReoLink Camera Configuration
  camera: {
    defaultQuality: 'main' as 'main' | 'sub' | 'mobile',
    enablePTZ: true,
    enableSnapshots: true,
    streamBufferSize: 30, // seconds
    connectionTimeout: 30000, // ms
    healthCheckInterval: 5000, // ms
    
    // UI Configuration
    feedAspectRatio: '16:9',
    controlsPosition: 'right' as 'top' | 'bottom' | 'left' | 'right',
    showConnectionStatus: true,
    showHealthMetrics: true,
    
    // Integration with AI monitoring
    aiIntegration: {
      enabled: true,
      autoStart: false,
      captureOnAlert: true,
      saveAnalysisImages: true
    }
  },

  // Mobile Configuration - Enhanced for Mobile-First Design
  mobile: {
    enablePushNotifications: true,
    enableOfflineSync: true,
    enableBiometricAuth: true,
    enableGpsTracking: false,
    imageCompressionQuality: 0.8,
    
    // Enhanced Touch Targets for Barn Environment
    touchTargets: {
      minimal: '48px',      // Standard accessibility
      preferred: '56px',    // Recommended size
      glovedFriendly: '64px', // For barn work with gloves
      extendedTapArea: '12px', // Increased invisible extended area
      emergencyActions: '72px' // Extra large for emergency buttons
    },
    
    // Gesture Support - Enhanced for One-Handed Operation
    gestures: {
      enableSwipeNavigation: true,
      enableLongPress: true,
      enableDoubleTap: true,
      swipeThreshold: '50px',
      longPressDelay: '500ms',
      doubleTapDelay: '300ms',
      // Swipe actions for common tasks
      swipeActions: {
        leftSwipe: 'quickActions',
        rightSwipe: 'details',
        upSwipe: 'fullscreen',
        downSwipe: 'refresh'
      }
    },
    
    // Voice Integration
    voice: {
      enabled: true,
      alwaysListening: false,
      wakeWord: 'Hey Barn',
      language: 'en-US',
      confidence: 0.8,
      timeoutSeconds: 30
    },
    
    // Haptic Feedback
    haptics: {
      enabled: true,
      patterns: {
        success: [100],
        error: [200, 100, 200],
        warning: [150, 50, 150],
        emergency: [300, 200, 300, 200, 300]
      }
    },
    
    // Photo Documentation
    photoDocumentation: {
      enabled: true,
      autoMetadata: true,
      overlayGuides: true,
      comparisonMode: true,
      maxFileSize: '10MB',
      quality: 0.9,
      formats: ['jpeg', 'png', 'webp']
    },
    
    // Performance Optimization
    performance: {
      lazyLoading: true,
      imageOptimization: true,
      cacheStrategy: 'stale-while-revalidate',
      prefetchData: true,
      offlineCapable: true
    }
  },

  // Outdoor/Barn Environment Optimization - Enhanced for Mobile-First
  outdoorMode: {
    enabled: true, // Enable by default for mobile-first design
    autoDetect: true, // Use ambient light sensor if available
    manualToggle: true, // Allow manual override
    
    // High Contrast Settings
    contrast: {
      ratio: '10:1',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      borderWidth: '3px',
      fontWeightIncrease: 200 // Increased for better mobile visibility
    },
    
    // Enhanced Visibility
    visibility: {
      textShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
      buttonShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      minFontSize: '1.125rem',
      simplifiedUI: true,
      // New mobile-specific visibility enhancements
      increasedSpacing: true,
      removeGradients: true,
      enhancedBorders: true,
      largerIcons: true
    },
    
    // Ambient Light Thresholds (in lux)
    lightThresholds: {
      indoor: 500,
      brightIndoor: 1000,
      outdoor: 10000,
      brightSun: 50000
    },
    
    // Battery Optimization
    battery: {
      reducedAnimations: true,
      lowerRefreshRate: true,
      dimBackground: true,
      optimizeImages: true
    }
  },

  // Health Status Color Mapping
  healthStatusMapping: {
    excellent: 'successGreen',
    good: 'infoBlue',
    fair: 'alertAmber',
    poor: 'errorRed',
    unknown: 'sterlingSilver'
  },

  // Training Status Color Mapping
  trainingStatusMapping: {
    active: 'successGreen',
    scheduled: 'infoBlue',
    pending: 'alertAmber',
    cancelled: 'errorRed',
    completed: 'championGold'
  }
};

// Helper functions for accessing config values
export const getColor = (colorKey: keyof typeof brandConfig.colors) => {
  return brandConfig.colors[colorKey];
};

export const getFeatureFlag = (feature: keyof typeof brandConfig.features) => {
  return brandConfig.features[feature];
};

export const getBreakpoint = (breakpoint: keyof typeof brandConfig.layout.breakpoints) => {
  return brandConfig.layout.breakpoints[breakpoint];
}; 