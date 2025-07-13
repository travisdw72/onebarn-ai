/**
 * 🎛️ Threshold Management Hook
 * Custom hook for managing AI optimization thresholds
 * Handles preset management, import/export, and validation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  IThresholdValues,
  IThresholdPreset,
  IExportedConfiguration,
  IUseThresholdManagementReturn
} from '../interfaces/AITestingTypes';
import { aiTestingData } from '../config/aiTestingData';

// Default threshold values
const DEFAULT_THRESHOLDS: IThresholdValues = {
  imageQuality: 30,
  occupancy: 40,
  motion: 15,
  duplicate: 85
};

// Predefined threshold presets
const THRESHOLD_PRESETS: Record<string, IThresholdValues> = {
  conservative: {
    imageQuality: 20,
    occupancy: 25,
    motion: 10,
    duplicate: 90
  },
  balanced: {
    imageQuality: 30,
    occupancy: 40,
    motion: 15,
    duplicate: 85
  },
  aggressive: {
    imageQuality: 45,
    occupancy: 60,
    motion: 25,
    duplicate: 75
  }
};

interface UseThresholdManagementProps {
  initialThresholds?: Partial<IThresholdValues>;
  enableAutoSave?: boolean;
  storageKey?: string;
  onThresholdChange?: (thresholds: IThresholdValues) => void;
}

export const useThresholdManagement = ({
  initialThresholds = {},
  enableAutoSave = false,
  storageKey = 'ai_testing_thresholds',
  onThresholdChange
}: UseThresholdManagementProps = {}): IUseThresholdManagementReturn => {

  // Initialize thresholds from various sources
  const initializeThresholds = useCallback((): IThresholdValues => {
    // Priority: initialThresholds > localStorage > defaults
    const savedThresholds = enableAutoSave ? loadFromStorage() : null;
    return {
      ...DEFAULT_THRESHOLDS,
      ...savedThresholds,
      ...initialThresholds
    };
  }, [initialThresholds, enableAutoSave]);

  // State management
  const [thresholds, setThresholds] = useState<IThresholdValues>(initializeThresholds);
  const [isModified, setIsModified] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Refs for tracking
  const originalThresholdsRef = useRef<IThresholdValues>(initializeThresholds());
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Storage functions
  const loadFromStorage = useCallback((): IThresholdValues | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that parsed data has correct structure
        if (isValidThresholdValues(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to load thresholds from storage:', error);
    }
    return null;
  }, [storageKey]);

  const saveToStorage = useCallback((values: IThresholdValues) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
      setLastSaved(new Date());
    } catch (error) {
      console.warn('Failed to save thresholds to storage:', error);
    }
  }, [storageKey]);

  // Validation function
  const isValidThresholdValues = (values: any): values is IThresholdValues => {
    return (
      typeof values === 'object' &&
      values !== null &&
      typeof values.imageQuality === 'number' &&
      typeof values.occupancy === 'number' &&
      typeof values.motion === 'number' &&
      typeof values.duplicate === 'number' &&
      values.imageQuality >= 0 && values.imageQuality <= 100 &&
      values.occupancy >= 0 && values.occupancy <= 100 &&
      values.motion >= 0 && values.motion <= 100 &&
      values.duplicate >= 0 && values.duplicate <= 100
    );
  };

  // Check if thresholds have been modified
  const checkModified = useCallback((newThresholds: IThresholdValues) => {
    const modified = Object.keys(newThresholds).some(key => {
      const k = key as keyof IThresholdValues;
      return newThresholds[k] !== originalThresholdsRef.current[k];
    });
    setIsModified(modified);
    return modified;
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (enableAutoSave && isModified) {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveToStorage(thresholds);
        setIsModified(false);
      }, 2000); // Save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [thresholds, isModified, enableAutoSave, saveToStorage]);

  // Notify changes
  useEffect(() => {
    onThresholdChange?.(thresholds);
  }, [thresholds, onThresholdChange]);

  /**
   * Update a single threshold value
   */
  const updateThreshold = useCallback((key: keyof IThresholdValues, value: number) => {
    // Validate value range
    const clampedValue = Math.max(0, Math.min(100, value));
    
    setThresholds(prev => {
      const newThresholds = { ...prev, [key]: clampedValue };
      checkModified(newThresholds);
      return newThresholds;
    });
  }, [checkModified]);

  /**
   * Update multiple threshold values
   */
  const updateThresholds = useCallback((values: Partial<IThresholdValues>) => {
    setThresholds(prev => {
      const newThresholds = { ...prev };
      
      // Validate and clamp each value
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'number') {
          const k = key as keyof IThresholdValues;
          newThresholds[k] = Math.max(0, Math.min(100, value));
        }
      });
      
      checkModified(newThresholds);
      return newThresholds;
    });
  }, [checkModified]);

  /**
   * Apply a threshold preset
   */
  const applyPreset = useCallback((preset: 'conservative' | 'balanced' | 'aggressive') => {
    const presetValues = THRESHOLD_PRESETS[preset];
    if (presetValues) {
      setThresholds(presetValues);
      checkModified(presetValues);
    }
  }, [checkModified]);

  /**
   * Reset to default values
   */
  const resetToDefaults = useCallback(() => {
    setThresholds(DEFAULT_THRESHOLDS);
    originalThresholdsRef.current = { ...DEFAULT_THRESHOLDS };
    setIsModified(false);
  }, []);

  /**
   * Get preset values
   */
  const getPresetValues = useCallback((preset: string): IThresholdValues => {
    return THRESHOLD_PRESETS[preset] || DEFAULT_THRESHOLDS;
  }, []);

  /**
   * Export configuration as JSON string
   */
  const exportConfiguration = useCallback((): string => {
    const exportData: IExportedConfiguration = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      thresholds,
      metadata: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
        sessionId: `session_${Date.now()}`
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }, [thresholds]);

  /**
   * Import configuration from JSON string
   */
  const importConfiguration = useCallback((configJson: string): boolean => {
    try {
      const importData: IExportedConfiguration = JSON.parse(configJson);
      
      // Validate structure
      if (!importData || typeof importData !== 'object') {
        throw new Error('Invalid configuration format');
      }
      
      if (!importData.thresholds || !isValidThresholdValues(importData.thresholds)) {
        throw new Error('Invalid threshold values in configuration');
      }
      
      // Apply imported thresholds
      setThresholds(importData.thresholds);
      checkModified(importData.thresholds);
      
      return true;
    } catch (error) {
      console.error('Failed to import configuration:', error);
      return false;
    }
  }, [checkModified, isValidThresholdValues]);

  /**
   * Save current configuration
   */
  const saveConfiguration = useCallback(() => {
    saveToStorage(thresholds);
    originalThresholdsRef.current = { ...thresholds };
    setIsModified(false);
  }, [thresholds, saveToStorage]);

  /**
   * Check if current values match a preset
   */
  const getCurrentPreset = useCallback((): string | null => {
    for (const [presetName, presetValues] of Object.entries(THRESHOLD_PRESETS)) {
      const matches = Object.keys(presetValues).every(key => {
        const k = key as keyof IThresholdValues;
        return Math.abs(thresholds[k] - presetValues[k]) < 1; // Allow small tolerance
      });
      
      if (matches) {
        return presetName;
      }
    }
    return null;
  }, [thresholds]);

  return {
    thresholds,
    updateThreshold,
    updateThresholds,
    applyPreset,
    resetToDefaults,
    exportConfiguration,
    importConfiguration,
    getPresetValues
  };
}; 