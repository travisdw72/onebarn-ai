/**
 * OutdoorModeManager Component
 * Handles automatic contrast adjustment and manual override controls for barn environments
 * Optimized for bright sunlight conditions and mobile usage
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { IMobileCapabilities } from './MobileDetector';
import { Sun, Moon, Eye, EyeOff, Settings, Battery, Wifi } from 'lucide-react';

export interface IOutdoorModeState {
  isActive: boolean;
  isAutomatic: boolean;
  ambientLight: number | null;
  contrastLevel: number; // 1-10 scale
  fontSizeMultiplier: number;
  simplifiedUI: boolean;
  batteryOptimized: boolean;
  manualOverride: boolean;
}

export interface IOutdoorModeManagerProps {
  capabilities: IMobileCapabilities;
  onModeChange?: (state: IOutdoorModeState) => void;
  enableAutoDetection?: boolean;
  enableManualOverride?: boolean;
  enableBatteryOptimization?: boolean;
  showControls?: boolean;
  className?: string;
}

export const OutdoorModeManager: React.FC<IOutdoorModeManagerProps> = ({
  capabilities,
  onModeChange,
  enableAutoDetection = true,
  enableManualOverride = true,
  enableBatteryOptimization = true,
  showControls = true,
  className = ''
}) => {
  const [outdoorState, setOutdoorState] = useState<IOutdoorModeState>({
    isActive: false,
    isAutomatic: true,
    ambientLight: null,
    contrastLevel: 5,
    fontSizeMultiplier: 1,
    simplifiedUI: false,
    batteryOptimized: false,
    manualOverride: false
  });

  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate contrast level based on ambient light
  const calculateContrastLevel = useCallback((ambientLight: number): number => {
    const { indoor, brightIndoor, outdoor, brightSun } = brandConfig.outdoorMode.lightThresholds;
    
    if (ambientLight <= indoor) return 1; // Indoor
    if (ambientLight <= brightIndoor) return 3; // Bright indoor
    if (ambientLight <= outdoor) return 6; // Outdoor
    if (ambientLight <= brightSun) return 8; // Bright sun
    return 10; // Extreme sun
  }, []);

  // Calculate font size multiplier based on conditions
  const calculateFontSizeMultiplier = useCallback((state: IOutdoorModeState): number => {
    let multiplier = 1;
    
    if (state.isActive) {
      if (state.contrastLevel >= 8) multiplier = 1.3; // Bright sun
      else if (state.contrastLevel >= 6) multiplier = 1.2; // Outdoor
      else if (state.contrastLevel >= 4) multiplier = 1.1; // Bright indoor
    }
    
    // Additional multiplier for glove mode
    if (capabilities.gloveMode) {
      multiplier *= 1.1;
    }
    
    return multiplier;
  }, [capabilities.gloveMode]);

  // Update outdoor mode based on conditions
  const updateOutdoorMode = useCallback(() => {
    const { ambientLight, batteryLevel, isCharging, prefersHighContrast } = capabilities;
    
    if (!enableAutoDetection && !outdoorState.manualOverride) return;
    
    const newState: IOutdoorModeState = { ...outdoorState };
    
    // Update ambient light
    newState.ambientLight = ambientLight;
    
    // Determine if outdoor mode should be active
    if (outdoorState.manualOverride) {
      // Manual override takes precedence
      newState.isActive = outdoorState.isActive;
    } else if (enableAutoDetection) {
      // Auto detection based on ambient light and preferences
      const shouldActivate = 
        (ambientLight !== null && ambientLight > brandConfig.outdoorMode.lightThresholds.outdoor) ||
        prefersHighContrast ||
        capabilities.isOutdoorMode;
      
      newState.isActive = shouldActivate;
    }
    
    // Update contrast level
    if (ambientLight !== null) {
      newState.contrastLevel = calculateContrastLevel(ambientLight);
    }
    
    // Update font size multiplier
    newState.fontSizeMultiplier = calculateFontSizeMultiplier(newState);
    
    // Battery optimization
    if (enableBatteryOptimization && batteryLevel !== null) {
      newState.batteryOptimized = batteryLevel < 20 && !isCharging;
      if (newState.batteryOptimized) {
        newState.simplifiedUI = true;
      }
    }
    
    // Simplified UI for high contrast levels
    newState.simplifiedUI = newState.contrastLevel >= 8 || newState.batteryOptimized;
    
    setOutdoorState(newState);
    onModeChange?.(newState);
  }, [
    capabilities,
    enableAutoDetection,
    enableBatteryOptimization,
    outdoorState,
    calculateContrastLevel,
    calculateFontSizeMultiplier,
    onModeChange
  ]);

  // Manual toggle outdoor mode
  const toggleOutdoorMode = useCallback(() => {
    const newState: IOutdoorModeState = {
      ...outdoorState,
      isActive: !outdoorState.isActive,
      manualOverride: true,
      isAutomatic: false
    };
    
    setOutdoorState(newState);
    onModeChange?.(newState);
  }, [outdoorState, onModeChange]);

  // Reset to automatic mode
  const resetToAutomatic = useCallback(() => {
    const newState: IOutdoorModeState = {
      ...outdoorState,
      manualOverride: false,
      isAutomatic: true
    };
    
    setOutdoorState(newState);
    updateOutdoorMode();
  }, [outdoorState, updateOutdoorMode]);

  // Adjust contrast manually
  const adjustContrast = useCallback((delta: number) => {
    const newContrastLevel = Math.max(1, Math.min(10, outdoorState.contrastLevel + delta));
    const newState: IOutdoorModeState = {
      ...outdoorState,
      contrastLevel: newContrastLevel,
      manualOverride: true,
      isAutomatic: false
    };
    
    setOutdoorState(newState);
    onModeChange?.(newState);
  }, [outdoorState, onModeChange]);

  // Apply outdoor mode styles to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (outdoorState.isActive) {
      // Apply outdoor mode CSS variables
      root.style.setProperty('--outdoor-mode-active', '1');
      root.style.setProperty('--outdoor-contrast-level', outdoorState.contrastLevel.toString());
      root.style.setProperty('--outdoor-font-multiplier', outdoorState.fontSizeMultiplier.toString());
      
      // High contrast colors
      root.style.setProperty('--outdoor-bg-color', brandConfig.outdoorMode.contrast.backgroundColor);
      root.style.setProperty('--outdoor-text-color', brandConfig.outdoorMode.contrast.textColor);
      root.style.setProperty('--outdoor-border-width', brandConfig.outdoorMode.contrast.borderWidth);
      
      // Add outdoor mode class
      document.body.classList.add('outdoor-mode');
      
      if (outdoorState.simplifiedUI) {
        document.body.classList.add('simplified-ui');
      }
      
      if (outdoorState.batteryOptimized) {
        document.body.classList.add('battery-optimized');
      }
    } else {
      // Remove outdoor mode
      root.style.removeProperty('--outdoor-mode-active');
      root.style.removeProperty('--outdoor-contrast-level');
      root.style.removeProperty('--outdoor-font-multiplier');
      root.style.removeProperty('--outdoor-bg-color');
      root.style.removeProperty('--outdoor-text-color');
      root.style.removeProperty('--outdoor-border-width');
      
      document.body.classList.remove('outdoor-mode', 'simplified-ui', 'battery-optimized');
    }
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('outdoor-mode', 'simplified-ui', 'battery-optimized');
    };
  }, [outdoorState]);

  // Setup periodic updates
  useEffect(() => {
    if (enableAutoDetection && outdoorState.isAutomatic) {
      intervalRef.current = setInterval(updateOutdoorMode, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enableAutoDetection, outdoorState.isAutomatic, updateOutdoorMode]);

  // Initial update
  useEffect(() => {
    updateOutdoorMode();
  }, [updateOutdoorMode]);

  // Component styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: brandConfig.spacing.sm,
    padding: brandConfig.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: brandConfig.layout.borderRadius,
    backdropFilter: 'blur(8px)',
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: brandConfig.mobile.touchTargets.preferred,
    height: brandConfig.mobile.touchTargets.preferred,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    backgroundColor: outdoorState.isActive ? brandConfig.colors.successGreen : brandConfig.colors.neutralGray,
    color: brandConfig.colors.barnWhite,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const settingsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: brandConfig.spacing.xs,
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.barnWhite,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    borderRadius: brandConfig.layout.borderRadius,
    boxShadow: brandConfig.layout.boxShadow,
    zIndex: 1000,
    minWidth: '200px',
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    margin: `${brandConfig.spacing.sm} 0`,
  };

  if (!showControls) {
    return null;
  }

  return (
    <div className={`outdoor-mode-manager ${className}`} style={containerStyle}>
      {/* Status indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: brandConfig.spacing.xs,
        color: outdoorState.isActive ? brandConfig.colors.successGreen : brandConfig.colors.neutralGray,
        fontSize: brandConfig.typography.fontSizeXs,
      }}>
        {outdoorState.isActive ? <Sun size={16} /> : <Moon size={16} />}
        <span>
          {outdoorState.isActive ? 'Outdoor' : 'Indoor'}
          {outdoorState.ambientLight && ` (${Math.round(outdoorState.ambientLight)} lux)`}
        </span>
      </div>

      {/* Manual toggle button */}
      {enableManualOverride && (
        <button
          style={buttonStyle}
          onClick={toggleOutdoorMode}
          title={outdoorState.isActive ? 'Disable outdoor mode' : 'Enable outdoor mode'}
        >
          {outdoorState.isActive ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {/* Settings button */}
      <button
        style={{
          ...buttonStyle,
          backgroundColor: showSettings ? brandConfig.colors.infoBlue : brandConfig.colors.neutralGray,
        }}
        onClick={() => setShowSettings(!showSettings)}
        title="Outdoor mode settings"
      >
        <Settings size={20} />
      </button>

      {/* Battery indicator */}
      {capabilities.batteryLevel !== null && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: brandConfig.spacing.xs,
          color: capabilities.batteryLevel < 20 ? brandConfig.colors.errorRed : brandConfig.colors.successGreen,
        }}>
          <Battery size={16} />
          <span>{Math.round(capabilities.batteryLevel)}%</span>
        </div>
      )}

      {/* Connection indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: brandConfig.spacing.xs,
        color: capabilities.isSlowConnection ? brandConfig.colors.errorRed : brandConfig.colors.successGreen,
      }}>
        <Wifi size={16} />
        <span>{capabilities.connectionType}</span>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={settingsStyle}>
          <h4 style={{
            margin: `0 0 ${brandConfig.spacing.sm} 0`,
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeSm,
          }}>
            Outdoor Mode Settings
          </h4>

          {/* Automatic/Manual toggle */}
          <div style={{ marginBottom: brandConfig.spacing.md }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeXs,
            }}>
              <input
                type="checkbox"
                checked={outdoorState.isAutomatic}
                onChange={(e) => {
                  if (e.target.checked) {
                    resetToAutomatic();
                  } else {
                    setOutdoorState(prev => ({ ...prev, isAutomatic: false, manualOverride: true }));
                  }
                }}
              />
              Automatic detection
            </label>
          </div>

          {/* Contrast level slider */}
          <div style={{ marginBottom: brandConfig.spacing.md }}>
            <label style={{
              display: 'block',
              marginBottom: brandConfig.spacing.xs,
              fontSize: brandConfig.typography.fontSizeXs,
            }}>
              Contrast Level: {outdoorState.contrastLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={outdoorState.contrastLevel}
              onChange={(e) => {
                const newLevel = parseInt(e.target.value);
                setOutdoorState(prev => ({ 
                  ...prev, 
                  contrastLevel: newLevel,
                  manualOverride: true,
                  isAutomatic: false
                }));
              }}
              style={sliderStyle}
            />
          </div>

          {/* Font size multiplier display */}
          <div style={{ marginBottom: brandConfig.spacing.md }}>
            <span style={{
              fontSize: brandConfig.typography.fontSizeXs,
              color: brandConfig.colors.neutralGray,
            }}>
              Font Size: {Math.round(outdoorState.fontSizeMultiplier * 100)}%
            </span>
          </div>

          {/* Quick adjustment buttons */}
          <div style={{
            display: 'flex',
            gap: brandConfig.spacing.xs,
            marginTop: brandConfig.spacing.md,
          }}>
            <button
              style={{
                ...buttonStyle,
                flex: 1,
                height: 'auto',
                padding: brandConfig.spacing.sm,
                fontSize: brandConfig.typography.fontSizeXs,
              }}
              onClick={() => adjustContrast(-1)}
            >
              Decrease
            </button>
            <button
              style={{
                ...buttonStyle,
                flex: 1,
                height: 'auto',
                padding: brandConfig.spacing.sm,
                fontSize: brandConfig.typography.fontSizeXs,
              }}
              onClick={() => adjustContrast(1)}
            >
              Increase
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for easier usage
export const useOutdoorMode = () => {
  const [outdoorState, setOutdoorState] = useState<IOutdoorModeState | null>(null);

  return {
    outdoorState,
    isOutdoorMode: outdoorState?.isActive || false,
    contrastLevel: outdoorState?.contrastLevel || 1,
    fontSizeMultiplier: outdoorState?.fontSizeMultiplier || 1,
    OutdoorModeManager: (props: Omit<IOutdoorModeManagerProps, 'onModeChange'>) => (
      <OutdoorModeManager
        {...props}
        onModeChange={setOutdoorState}
      />
    )
  };
};

// Utility to get outdoor mode classes
export const getOutdoorModeClasses = (state: IOutdoorModeState): string => {
  const classes = [];
  
  if (state.isActive) classes.push('outdoor-mode-active');
  if (state.simplifiedUI) classes.push('simplified-ui');
  if (state.batteryOptimized) classes.push('battery-optimized');
  if (state.manualOverride) classes.push('manual-override');
  
  return classes.join(' ');
}; 