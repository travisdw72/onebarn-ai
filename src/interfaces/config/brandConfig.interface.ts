export interface IApplicationConfig {
  name: string;
  description: string;
  version: string;
  environment: string;
  companyName: string;
  supportEmail: string;
  website: string;
}

export interface IColorPalette {
  // Primary Colors
  stableMahogany: string;
  arenaSand: string;
  midnightBlack: string;
  barnWhite: string;
  
  // Secondary Colors
  hunterGreen: string;
  sterlingSilver: string;
  chestnutGlow: string;
  
  // Template-inspired additions
  stableMahoganyDark: string;
  
  // Performance Accent Colors
  championGold: string;
  ribbonBlue: string;
  victoryRose: string;
  pastureSage: string;
  
  // Functional Colors
  successGreen: string;
  alertAmber: string;
  errorRed: string;
  infoBlue: string;
  warningOrange: string;
  
  // Utility Colors
  neutralGray: string;
  
  // Referenced colors from existing code
  weatheredWood: string;
  goldenStraw: string;
  alertRed: string;
  skyBlue: string;
  
  // Standard UI colors
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Background and text
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface ISpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ITypographyConfig {
  fontDisplay: string;
  fontPrimary: string;
  fontSecondary: string;
  fontMono: string;
  
  // Font Weights
  weightLight: number;
  weightRegular: number;
  weightMedium: number;
  weightSemiBold: number;
  weightBold: number;
  
  // Line Heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  
  // Font Sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeBase: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  
  // NEW: Large display sizes for hero
  fontSizeDisplay: string;
  fontSizeDisplayLg: string;
  fontSizeDisplayXl: string;
  
  // NEW: Animation-friendly weights
  weightNormal: number;
  weightExtraBold: number;
}

export interface ILayoutConfig {
  maxWidth: string;
  containerPadding: string;
  headerHeight: string;
  sidebarWidth: string;
  borderRadius: string;
  boxShadow: string;
  
  breakpoints: {
    mobileXs: string;
    mobileSm: string;
    mobileMd: string;
    tablet: string;
    desktop: string;
    largeDesktop: string;
  };
}

export interface IFeatureFlags {
  enableOfflineMode: boolean;
  enableVoiceCommands: boolean;
  enableMobileApp: boolean;
  enableAdvancedReporting: boolean;
  enableMultiTenant: boolean;
  enableAuditLogging: boolean;
  enableRoleBasedAccess: boolean;
}

export interface ISecurityConfig {
  sessionTimeout: number;
  requireTwoFactor: boolean;
  enablePasswordPolicy: boolean;
  auditAllActions: boolean;
  encryptionRequired: boolean;
}

export interface IApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableCaching: boolean;
}

export interface ITenantConfig {
  enableMultiTenant: boolean;
  defaultTheme: string;
  allowCustomBranding: boolean;
  enableTenantIsolation: boolean;
}

export interface IMobileConfig {
  enablePushNotifications: boolean;
  enableOfflineSync: boolean;
  enableBiometricAuth: boolean;
  enableGpsTracking: boolean;
  imageCompressionQuality: number;
  
  touchTargets: {
    minimal: string;
    preferred: string;
    glovedFriendly: string;
    extendedTapArea: string;
    emergencyActions: string;
  };
  
  gestures: {
    enableSwipeNavigation: boolean;
    enableLongPress: boolean;
    enableDoubleTap: boolean;
    swipeThreshold: string;
    longPressDelay: string;
    doubleTapDelay: string;
    swipeActions: {
      leftSwipe: string;
      rightSwipe: string;
      upSwipe: string;
      downSwipe: string;
    };
  };
  
  voice: {
    enabled: boolean;
    alwaysListening: boolean;
    wakeWord: string;
    language: string;
    confidence: number;
    timeoutSeconds: number;
  };
  
  haptics: {
    enabled: boolean;
    patterns: {
      success: number[];
      error: number[];
      warning: number[];
      emergency: number[];
    };
  };
  
  photoDocumentation: {
    enabled: boolean;
    autoMetadata: boolean;
    overlayGuides: boolean;
    comparisonMode: boolean;
    maxFileSize: string;
    quality: number;
    formats: string[];
  };
  
  performance: {
    lazyLoading: boolean;
    imageOptimization: boolean;
    cacheStrategy: string;
    prefetchData: boolean;
    offlineCapable: boolean;
  };
}

export interface IOutdoorConfig {
  enabled: boolean;
  autoDetect: boolean;
  manualToggle: boolean;
  
  contrast: {
    ratio: string;
    backgroundColor: string;
    textColor: string;
    borderWidth: string;
    fontWeightIncrease: number;
  };
  
  visibility: {
    textShadow: string;
    buttonShadow: string;
    minFontSize: string;
    simplifiedUI: boolean;
    increasedSpacing: boolean;
    removeGradients: boolean;
    enhancedBorders: boolean;
    largerIcons: boolean;
  };
  
  lightThresholds: {
    indoor: number;
    brightIndoor: number;
    outdoor: number;
    brightSun: number;
  };
  
  battery: {
    reducedAnimations: boolean;
    lowerRefreshRate: boolean;
    dimBackground: boolean;
    optimizeImages: boolean;
  };
}

export interface IAnimationConfig {
  transitions: {
    smooth: string;
    bounce: string;
    spring: { type: string; stiffness: number };
  };
  durations: {
    fast: number;
    normal: number;
    slow: number;
    countUp: number;
  };
  delays: {
    stagger: number;
    section: number;
  };
}

export interface IGradientConfig {
  heroPrimary: string;
  heroOverlay: string;
  featureAccent: string;
  statusCard: string;
}

export interface ICameraConfig {
  defaultQuality: 'main' | 'sub' | 'mobile';
  enablePTZ: boolean;
  enableSnapshots: boolean;
  streamBufferSize: number;
  connectionTimeout: number;
  healthCheckInterval: number;
  
  // UI Configuration
  feedAspectRatio: string;
  controlsPosition: 'top' | 'bottom' | 'left' | 'right';
  showConnectionStatus: boolean;
  showHealthMetrics: boolean;
  
  // Integration with AI monitoring
  aiIntegration: {
    enabled: boolean;
    autoStart: boolean;
    captureOnAlert: boolean;
    saveAnalysisImages: boolean;
  };
}

export interface ILogoConfig {
  paths: {
    light: string;
    dark: string;
  };
  display: {
    useSvg: boolean;
    fallbackToText: boolean;
    showBoth: boolean;
  };
  dimensions: {
    header: { width: string; height: string };
    registration: { width: string; height: string };
    mobile: { width: string; height: string };
  };
}

export interface IBrandConfig {
  application: IApplicationConfig;
  logo: ILogoConfig;
  colors: IColorPalette;
  typography: ITypographyConfig;
  animations: IAnimationConfig;
  gradients: IGradientConfig;
  spacing: ISpacingConfig;
  layout: ILayoutConfig;
  features: IFeatureFlags;
  security: ISecurityConfig;
  api: IApiConfig;
  tenant: ITenantConfig;
  mobile: IMobileConfig;
  outdoorMode: IOutdoorConfig;
  camera: ICameraConfig;
  healthStatusMapping: Record<string, keyof IColorPalette>;
  trainingStatusMapping: Record<string, keyof IColorPalette>;
} 