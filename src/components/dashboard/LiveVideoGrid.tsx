/**
 * Live Video Grid Component
 * Displays camera feeds with AI overlay alerts
 * Config-driven mobile-first design for barn environments
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  AlertTriangle, 
  Activity 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';
import { newDashboardConfig } from '../../config/newDashboardConfig';

interface LiveVideoGridProps {
  cameras: any[];
  selectedCamera: string | null;
  onCameraSelect: (cameraId: string) => void;
  alerts: any[];
  onEmergencyContact?: (type: string, message: string) => void;
}

export const LiveVideoGrid: React.FC<LiveVideoGridProps> = ({
  cameras,
  selectedCamera,
  onCameraSelect,
  alerts,
  onEmergencyContact
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const getCameraAlerts = (cameraId: string) => {
    return alerts.filter(alert => 
      cameras.find(cam => cam.id === cameraId)?.horses?.some((horseId: string) => 
        alert.horseId === horseId
      )
    );
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': 
        return `border-2 border-red-500 bg-red-50`;
      case 'high': 
        return `border-2 border-orange-500 bg-orange-50`;
      case 'medium': 
        return `border-2 border-yellow-500 bg-yellow-50`;
      default: 
        return `border-2 border-green-500 bg-green-50`;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Main container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: brandConfig.colors.midnightBlack,
    borderRadius: brandConfig.layout.borderRadius,
    overflow: 'hidden',
    ...(fullscreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      borderRadius: 0,
    }),
  };

  const mainVideoStyle: React.CSSProperties = {
    flex: '1',
    position: 'relative',
    backgroundColor: brandConfig.colors.midnightBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  };

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const controlButtonStyle: React.CSSProperties = {
    padding: brandConfig.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: brandConfig.colors.barnWhite,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    backdropFilter: 'blur(4px)',
    cursor: 'pointer',
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    minWidth: newDashboardConfig.layout.touchTargetSize,
    minHeight: newDashboardConfig.layout.touchTargetSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cameraGridStyle: React.CSSProperties = {
    display: 'flex',
    gap: brandConfig.spacing.lg,
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    maxHeight: '150px',
    overflowY: 'auto',
    alignItems: 'flex-start',
  };

  const cameraScrollStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, 200px)`,
    gap: brandConfig.spacing.lg,
    justifyContent: 'start',
    flex: 1,
  };

  const emergencyPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: brandConfig.spacing.sm,
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    minWidth: '250px',
    maxWidth: '400px',
    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
  };

  const emergencyRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: brandConfig.spacing.sm,
  };

  const emergencyButtonStyle: React.CSSProperties = {
    padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
    backgroundColor: brandConfig.colors.errorRed,
    color: brandConfig.colors.barnWhite,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    fontWeight: brandConfig.typography.weightBold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: newDashboardConfig.layout.touchTargetSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: brandConfig.spacing.xs,
    width: '100%',
  };

  const supportButtonStyle: React.CSSProperties = {
    ...emergencyButtonStyle,
    backgroundColor: brandConfig.colors.stableMahogany,
  };

  const handleEmergencyContact = (type: string, message: string) => {
    if (onEmergencyContact) {
      onEmergencyContact(type, message);
    }
  };

  const cameraTileStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '16/9',
    backgroundColor: brandConfig.colors.midnightBlack,
    borderRadius: brandConfig.layout.borderRadius,
    overflow: 'hidden',
    cursor: 'pointer',
    border: `2px solid transparent`,
    transition: 'all 0.2s ease',
  };

  const selectedCameraTileStyle: React.CSSProperties = {
    ...cameraTileStyle,
    border: `2px solid ${brandConfig.colors.stableMahogany}`,
  };

  return (
    <div style={containerStyle}>
      {/* Main Video Display */}
      <div style={mainVideoStyle}>
        {selectedCamera ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video
              ref={el => videoRefs.current[selectedCamera] = el}
              style={videoStyle}
              autoPlay
              muted={!audioEnabled}
              playsInline
            >
              <source 
                src={cameras.find(c => c.id === selectedCamera)?.url} 
                type="video/mp4" 
              />
            </video>
            
            {/* AI Overlay Indicators */}
            <div 
              style={{
                position: 'absolute',
                top: brandConfig.spacing.md,
                left: brandConfig.spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: brandConfig.spacing.xs,
              }}
            >
              {getCameraAlerts(selectedCamera).map(alert => (
                <div 
                  key={alert.id}
                  style={{
                    padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: brandConfig.spacing.xs,
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontFamily: brandConfig.typography.fontPrimary,
                    fontWeight: brandConfig.typography.weightSemiBold,
                    border: alert.severity === 'critical' 
                      ? `2px solid ${brandConfig.colors.errorRed}`
                      : `2px solid ${brandConfig.colors.alertAmber}`,
                  }}
                >
                  <AlertTriangle 
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: brandConfig.colors.errorRed 
                    }} 
                  />
                  <span style={{ color: brandConfig.colors.midnightBlack }}>
                    {alert.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span 
                    style={{ 
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray 
                    }}
                  >
                    {alert.aiConfidence}% confidence
                  </span>
                </div>
              ))}
            </div>

            {/* Video Controls */}
            <div 
              style={{
                position: 'absolute',
                bottom: brandConfig.spacing.md,
                right: brandConfig.spacing.md,
                display: 'flex',
                gap: brandConfig.spacing.xs,
              }}
            >
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                style={controlButtonStyle}
                title={audioEnabled 
                  ? newDashboardEnhancements.video.audioDisabled
                  : newDashboardEnhancements.video.audioEnabled
                }
              >
                {audioEnabled ? 
                  <Volume2 style={{ width: '20px', height: '20px' }} /> : 
                  <VolumeX style={{ width: '20px', height: '20px' }} />
                }
              </button>
              <button
                onClick={toggleFullscreen}
                style={controlButtonStyle}
                title={fullscreen 
                  ? newDashboardEnhancements.video.exitFullscreen
                  : newDashboardEnhancements.video.fullscreenMode
                }
              >
                <Maximize2 style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Camera Info */}
            <div 
              style={{
                position: 'absolute',
                bottom: brandConfig.spacing.md,
                left: brandConfig.spacing.md,
                padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: brandConfig.colors.barnWhite,
                borderRadius: brandConfig.layout.borderRadius,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div 
                style={{
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  fontSize: brandConfig.typography.fontSizeSm,
                }}
              >
                {cameras.find(c => c.id === selectedCamera)?.name}
              </div>
              <div 
                style={{
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontSize: brandConfig.typography.fontSizeXs,
                  opacity: 0.8,
                }}
              >
                {cameras.find(c => c.id === selectedCamera)?.location}
              </div>
            </div>
          </div>
        ) : (
          <div 
            style={{
              textAlign: 'center',
              color: brandConfig.colors.barnWhite,
              fontFamily: brandConfig.typography.fontPrimary,
            }}
          >
            <Camera 
              style={{ 
                width: '64px', 
                height: '64px', 
                marginBottom: brandConfig.spacing.md,
                opacity: 0.5 
              }} 
            />
            <p style={{ 
              fontSize: brandConfig.typography.fontSizeLg,
              margin: 0 
            }}>
              {newDashboardEnhancements.video.selectCameraPrompt}
            </p>
          </div>
        )}
      </div>

      {/* Camera Grid */}
      <div style={cameraGridStyle}>
        {/* Camera Scroll Area */}
        <div style={cameraScrollStyle}>
          {cameras.map(camera => {
            const cameraAlerts = getCameraAlerts(camera.id);
            const hasAlerts = cameraAlerts.length > 0;
            const criticalAlerts = cameraAlerts.filter(a => a.severity === 'critical').length;

            return (
              <div
                key={camera.id}
                style={selectedCamera === camera.id ? selectedCameraTileStyle : cameraTileStyle}
                onClick={() => onCameraSelect(camera.id)}
              >
                <video
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  autoPlay
                  muted
                  playsInline
                >
                  <source src={camera.url} type="video/mp4" />
                </video>
                
                {/* Status Indicator */}
                <div 
                  style={{
                    position: 'absolute',
                    top: brandConfig.spacing.xs,
                    right: brandConfig.spacing.xs,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: camera.status === 'online' 
                      ? brandConfig.colors.successGreen 
                      : brandConfig.colors.errorRed,
                  }}
                />

                {/* Alert Badge */}
                {hasAlerts && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: brandConfig.spacing.xs,
                      left: brandConfig.spacing.xs,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '2px 6px',
                      backgroundColor: criticalAlerts > 0 
                        ? brandConfig.colors.errorRed 
                        : brandConfig.colors.alertAmber,
                      color: brandConfig.colors.barnWhite,
                      borderRadius: '12px',
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontWeight: brandConfig.typography.weightBold,
                    }}
                  >
                    {criticalAlerts > 0 ? (
                      <AlertTriangle style={{ width: '12px', height: '12px' }} />
                    ) : (
                      <Activity style={{ width: '12px', height: '12px' }} />
                    )}
                    <span>{cameraAlerts.length}</span>
                  </div>
                )}

                {/* Camera Info Overlay */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: brandConfig.spacing.xs,
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                    color: brandConfig.colors.barnWhite,
                  }}
                >
                  <div 
                    style={{
                      fontFamily: brandConfig.typography.fontPrimary,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      fontSize: brandConfig.typography.fontSizeXs,
                    }}
                  >
                    {camera.name}
                  </div>
                  <div 
                    style={{
                      fontFamily: brandConfig.typography.fontPrimary,
                      fontSize: brandConfig.typography.fontSizeXs,
                      opacity: 0.8,
                    }}
                  >
                    {camera.horses?.length || 0} horse{camera.horses?.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Support Panel */}
        <div style={emergencyPanelStyle}>
          <div style={{
            fontSize: brandConfig.typography.fontSizeSm,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            marginBottom: brandConfig.spacing.md,
            textAlign: 'center',
          }}>
            Quick Actions
          </div>
          
          {/* Two buttons side by side */}
          <div style={emergencyRowStyle}>
            <button
              style={emergencyButtonStyle}
              onClick={() => handleEmergencyContact('emergency', 'EMERGENCY: Immediate assistance needed at barn facility!')}
              title="Emergency assistance"
            >
              <AlertTriangle style={{ width: '18px', height: '18px' }} />
              Emergency
            </button>
            
            <button
              style={supportButtonStyle}
              onClick={() => handleEmergencyContact('support', 'I need support with the barn management system or equipment.')}
              title="Support assistance"
            >
              <Activity style={{ width: '18px', height: '18px' }} />
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 