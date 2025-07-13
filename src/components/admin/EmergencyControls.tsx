import React from 'react';
import { AlertTriangle, Shield, Power, Bell } from 'lucide-react';

interface EmergencyControlsProps {
  emergencyMode: boolean;
  onToggle: () => void;
}

export const EmergencyControls: React.FC<EmergencyControlsProps> = ({
  emergencyMode,
  onToggle
}) => {
  return (
    <div className="emergency-controls">
      <button
        onClick={onToggle}
        className={`emergency-toggle ${emergencyMode ? 'active' : ''}`}
        title={emergencyMode ? 'Disable Emergency Mode' : 'Enable Emergency Mode'}
      >
        {emergencyMode ? (
          <>
            <Shield className="w-5 h-5" />
            <span className="font-raleway font-bold">EMERGENCY ACTIVE</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            <span className="font-raleway font-semibold">Emergency Mode</span>
          </>
        )}
      </button>
      
      {emergencyMode && (
        <div className="emergency-actions">
          <button className="emergency-action-btn">
            <Bell className="w-4 h-4" />
            Alert All Users
          </button>
          <button className="emergency-action-btn">
            <Power className="w-4 h-4" />
            System Shutdown
          </button>
        </div>
      )}
    </div>
  );
}; 