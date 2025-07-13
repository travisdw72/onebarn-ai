import React from 'react';
import { useOutdoorMode } from '../../hooks/useOutdoorMode';
import { brandConfig } from '../../config/brandConfig';

export const OutdoorModeToggle: React.FC = () => {
  const { isOutdoorMode, lightLevel, isManualOverride, toggleOutdoorMode } = useOutdoorMode();

  const toggleStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    backgroundColor: isOutdoorMode ? '#FFFFFF' : brandConfig.colors.stableMahogany,
    color: isOutdoorMode ? '#000000' : brandConfig.colors.arenaSand,
    border: isOutdoorMode ? '3px solid #000000' : `2px solid ${brandConfig.colors.stableMahogany}`,
    borderRadius: brandConfig.layout.borderRadius,
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: brandConfig.typography.weightSemiBold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: brandConfig.mobile.touchTargets.preferred,
    minWidth: brandConfig.mobile.touchTargets.preferred,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: brandConfig.layout.boxShadow,
  };

  const indicatorStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isOutdoorMode ? '#32CD32' : '#FFA500',
    border: '1px solid currentColor',
  };

  return (
    <button
      style={toggleStyle}
      onClick={toggleOutdoorMode}
      title={`Outdoor Mode: ${isOutdoorMode ? 'ON' : 'OFF'}${lightLevel ? ` (${Math.round(lightLevel)} lux)` : ''}`}
    >
      <span style={indicatorStyle}></span>
      <span>
        {isOutdoorMode ? '☀️ OUTDOOR' : '🏠 INDOOR'}
      </span>
      {isManualOverride && <span style={{ fontSize: '0.75rem' }}>MANUAL</span>}
    </button>
  );
}; 