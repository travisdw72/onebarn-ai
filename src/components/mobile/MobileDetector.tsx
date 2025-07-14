/**
 * MobileDetector Component
 * Detects device capabilities and environmental conditions for mobile-first design
 * Optimized for barn environments with gloves, bright sunlight, and one-handed operation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { brandConfig } from '../../config/brandConfig';

export interface IMobileCapabilities {
  // Device Detection
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  
  // Screen Information
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  
  // Environmental Detection
  ambientLight: number | null;
  isOutdoorMode: boolean;
  batteryLevel: number | null;
  isCharging: boolean | null;
  
  // Input Capabilities
  supportsTouch: boolean;
  supportsVoice: boolean;
  supportsVibration: boolean;
  supportsGeolocation: boolean;
  
  // Connection Information
  connectionType: string;
  isOnline: boolean;
  isSlowConnection: boolean;
  
  // Preferences
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  gloveMode: boolean;
}

export interface IMobileDetectorProps {
  children: (capabilities: IMobileCapabilities) => React.ReactNode;
  onCapabilitiesChange?: (capabilities: IMobileCapabilities) => void;
  enableAmbientLight?: boolean;
  enableBatteryMonitoring?: boolean;
  updateInterval?: number;
}

export const MobileDetector: React.FC<IMobileDetectorProps> = ({
  children,
  onCapabilitiesChange,
  enableAmbientLight = true,
  enableBatteryMonitoring = true,
  updateInterval = 5000
}) => {
  const [capabilities, setCapabilities] = useState<IMobileCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
    ambientLight: null,
    isOutdoorMode: false,
    batteryLevel: null,
    isCharging: null,
    supportsTouch: false,
    supportsVoice: false,
    supportsVibration: false,
    supportsGeolocation: false,
    connectionType: 'unknown',
    isOnline: navigator.onLine,
    isSlowConnection: false,
    prefersReducedMotion: false,
    prefersHighContrast: false,
    gloveMode: false
  });

  // Device Detection
  const detectDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const screenWidth = window.innerWidth;
    
    return {
      isMobile: screenWidth <= parseInt(brandConfig.layout.breakpoints.mobileMd),
      isTablet: screenWidth > parseInt(brandConfig.layout.breakpoints.mobileMd) && 
                screenWidth <= parseInt(brandConfig.layout.breakpoints.tablet),
      isDesktop: screenWidth > parseInt(brandConfig.layout.breakpoints.tablet),
      isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      screenWidth,
      screenHeight: window.innerHeight,
      orientation: (screenWidth > window.innerHeight ? 'landscape' : 'portrait') as 'portrait' | 'landscape',
      pixelRatio: window.devicePixelRatio || 1
    };
  }, []);

  // Ambient Light Detection
  const detectAmbientLight = useCallback(async () => {
    if (!enableAmbientLight) return null;
    
    try {
      if ('AmbientLightSensor' in window) {
        const sensor = new (window as any).AmbientLightSensor();
        return new Promise<number>((resolve) => {
          sensor.addEventListener('reading', () => {
            resolve(sensor.illuminance);
          });
          sensor.start();
          
          // Fallback after 2 seconds
          setTimeout(() => resolve(10000), 2000);
        });
      }
    } catch (error) {
      console.warn('Ambient light sensor not available:', error);
    }
    
    return null;
  }, [enableAmbientLight]);

  // Battery Status Detection
  const detectBatteryStatus = useCallback(async () => {
    if (!enableBatteryMonitoring) return { level: null, charging: null };
    
    try {
      const battery = await (navigator as any).getBattery();
      return {
        level: battery.level * 100,
        charging: battery.charging
      };
    } catch (error) {
      console.warn('Battery API not available:', error);
      return { level: null, charging: null };
    }
  }, [enableBatteryMonitoring]);

  // Connection Detection
  const detectConnection = useCallback(() => {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    if (connection) {
      return {
        type: connection.effectiveType || 'unknown',
        isSlowConnection: connection.effectiveType === 'slow-2g' || 
                         connection.effectiveType === '2g'
      };
    }
    
    return {
      type: 'unknown',
      isSlowConnection: false
    };
  }, []);

  // Capabilities Detection
  const detectCapabilities = useCallback(() => {
    return {
      supportsTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      supportsVoice: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      supportsVibration: 'vibrate' in navigator,
      supportsGeolocation: 'geolocation' in navigator
    };
  }, []);

  // Preferences Detection
  const detectPreferences = useCallback(() => {
    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches
    };
  }, []);

  // Glove Mode Detection (heuristic based on touch patterns)
  const detectGloveMode = useCallback(() => {
    // This is a simplified heuristic - in a real implementation,
    // you might track touch pressure, area, and accuracy
    const touchAccuracy = localStorage.getItem('touchAccuracy');
    const recentMisses = localStorage.getItem('recentTouchMisses');
    
    return {
      gloveMode: touchAccuracy && parseFloat(touchAccuracy) < 0.8 || 
                recentMisses && parseInt(recentMisses) > 5
    };
  }, []);

  // Update All Capabilities
  const updateCapabilities = useCallback(async () => {
    const deviceInfo = detectDevice();
    const ambientLight = await detectAmbientLight();
    const batteryStatus = await detectBatteryStatus();
    const connectionInfo = detectConnection();
    const capabilities = detectCapabilities();
    const preferences = detectPreferences();
    const gloveModeInfo = detectGloveMode();
    
    // Determine outdoor mode based on ambient light
    const isOutdoorMode = ambientLight ? 
      ambientLight > brandConfig.outdoorMode.lightThresholds.outdoor : 
      false;

    const newCapabilities: IMobileCapabilities = {
      ...deviceInfo,
      ambientLight,
      isOutdoorMode,
      batteryLevel: batteryStatus.level,
      isCharging: batteryStatus.charging,
      connectionType: connectionInfo.type,
      isOnline: navigator.onLine,
      isSlowConnection: connectionInfo.isSlowConnection,
      ...capabilities,
      ...preferences,
      ...gloveModeInfo
    };

    setCapabilities(newCapabilities);
    onCapabilitiesChange?.(newCapabilities);
  }, [
    detectDevice,
    detectAmbientLight,
    detectBatteryStatus,
    detectConnection,
    detectCapabilities,
    detectPreferences,
    detectGloveMode,
    onCapabilitiesChange
  ]);

  // Setup event listeners
  useEffect(() => {
    // Initial detection
    updateCapabilities();

    // Window resize handler
    const handleResize = () => {
      updateCapabilities();
    };

    // Online/offline handlers
    const handleOnline = () => {
      setCapabilities(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setCapabilities(prev => ({ ...prev, isOnline: false }));
    };

    // Media query handlers
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({ ...prev, prefersReducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setCapabilities(prev => ({ ...prev, prefersHighContrast: e.matches }));
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
      highContrastQuery.addEventListener('change', handleHighContrastChange);
    }

    // Periodic updates
    const interval = setInterval(updateCapabilities, updateInterval);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
        highContrastQuery.removeEventListener('change', handleHighContrastChange);
      }
      
      clearInterval(interval);
    };
  }, [updateCapabilities, updateInterval]);

  return (
    <>
      {children(capabilities)}
    </>
  );
};

// Hook for easier usage
export const useMobileDetection = (options?: {
  enableAmbientLight?: boolean;
  enableBatteryMonitoring?: boolean;
  updateInterval?: number;
}) => {
  const [capabilities, setCapabilities] = useState<IMobileCapabilities | null>(null);

  return {
    capabilities,
    MobileDetector: ({ children }: { children: React.ReactNode }) => (
      <MobileDetector
        onCapabilitiesChange={setCapabilities}
        {...options}
      >
        {() => children}
      </MobileDetector>
    )
  };
};

// Utility functions
export const getMobileClass = (capabilities: IMobileCapabilities): string => {
  const classes = [];
  
  if (capabilities.isMobile) classes.push('mobile');
  if (capabilities.isTablet) classes.push('tablet');
  if (capabilities.isDesktop) classes.push('desktop');
  if (capabilities.isTouchDevice) classes.push('touch');
  if (capabilities.isOutdoorMode) classes.push('outdoor-mode');
  if (capabilities.gloveMode) classes.push('glove-mode');
  if (capabilities.prefersReducedMotion) classes.push('reduced-motion');
  if (capabilities.prefersHighContrast) classes.push('high-contrast');
  if (capabilities.isSlowConnection) classes.push('slow-connection');
  
  return classes.join(' ');
};

export const getTouchTargetSize = (capabilities: IMobileCapabilities): string => {
  if (capabilities.gloveMode) {
    return brandConfig.mobile.touchTargets.glovedFriendly;
  }
  
  if (capabilities.isMobile) {
    return brandConfig.mobile.touchTargets.preferred;
  }
  
  return brandConfig.mobile.touchTargets.minimal;
};

export const shouldUseOutdoorMode = (capabilities: IMobileCapabilities): boolean => {
  return capabilities.isOutdoorMode || 
         capabilities.prefersHighContrast ||
         capabilities.ambientLight !== null && 
         capabilities.ambientLight > brandConfig.outdoorMode.lightThresholds.outdoor;
}; 