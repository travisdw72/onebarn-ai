import { useState, useEffect } from 'react';
import { brandConfig } from '../config/brandConfig';

interface OutdoorModeState {
  isOutdoorMode: boolean;
  lightLevel: number | null;
  isManualOverride: boolean;
  toggleOutdoorMode: () => void;
  setManualOverride: (enabled: boolean) => void;
}

export const useOutdoorMode = (): OutdoorModeState => {
  const [isOutdoorMode, setIsOutdoorMode] = useState(brandConfig.outdoorMode.enabled);
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [isManualOverride, setIsManualOverride] = useState(false);

  useEffect(() => {
    // Check if ambient light sensor is available
    if ('AmbientLightSensor' in window && brandConfig.outdoorMode.autoDetect) {
      try {
        // @ts-ignore - AmbientLightSensor is not in TypeScript definitions yet
        const sensor = new AmbientLightSensor({ frequency: 0.1 });
        
        sensor.addEventListener('reading', () => {
          const lux = sensor.illuminance;
          setLightLevel(lux);
          
          // Only auto-switch if not manually overridden
          if (!isManualOverride) {
            const shouldBeOutdoor = lux > brandConfig.outdoorMode.lightThresholds.outdoor;
            setIsOutdoorMode(shouldBeOutdoor);
          }
        });
        
        sensor.start();
        
        return () => {
          sensor.stop();
        };
      } catch (error) {
        console.log('Ambient Light Sensor not available:', error);
      }
    }
  }, [isManualOverride]);

  const toggleOutdoorMode = () => {
    setIsOutdoorMode(!isOutdoorMode);
    setIsManualOverride(true);
  };

  const setManualOverride = (enabled: boolean) => {
    setIsManualOverride(enabled);
    if (!enabled) {
      // Reset to config default when removing manual override
      setIsOutdoorMode(brandConfig.outdoorMode.enabled);
    }
  };

  return {
    isOutdoorMode,
    lightLevel,
    isManualOverride,
    toggleOutdoorMode,
    setManualOverride,
  };
}; 