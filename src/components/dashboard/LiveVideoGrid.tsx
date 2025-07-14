/**
 * Live Video Grid Component
 * Displays camera feeds with AI overlay alerts
 * Config-driven mobile-first design for barn environments
 * 
 * 🎥 DEMO CAMERA INTEGRATION
 * - Supports both mock URLs and real MediaStream objects
 * - Optimized for demo@onevault.ai account
 * - WebRTC stream handling for business partner demos
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

// 🎥 ENHANCED CAMERA FEED - Supports both mock and real streams
interface IEnhancedCameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  quality: '720p' | '1080p' | '4K';
  features: string[];
  isLive: boolean;
  isPremium: boolean;
  horses?: string[];
  
  // 🎬 DEMO CAMERA SUPPORT
  url?: string;              // Mock URL for non-demo cameras
  stream?: MediaStream;      // Real MediaStream for demo cameras
  isDemoCamera?: boolean;    // Flag to identify demo cameras
}

interface LiveVideoGridProps {
  cameras: IEnhancedCameraFeed[];
  selectedCamera: string | null;
  onCameraSelect: (cameraId: string) => void;
  alerts: any[];
  onEmergencyContact?: (type: string, message: string) => void;
  userEmail?: string; // Add user email to check for demo account
}

export const LiveVideoGrid: React.FC<LiveVideoGridProps> = ({
  cameras,
  selectedCamera,
  onCameraSelect,
  alerts,
  onEmergencyContact,
  userEmail
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  // 🎬 STREAM STATUS TRACKING
  const [streamStatus, setStreamStatus] = useState<{ [key: string]: 'loading' | 'active' | 'error' | 'inactive' }>({});
  const [streamErrors, setStreamErrors] = useState<{ [key: string]: string }>({});
  
  // 🎯 DEMO ACCOUNT RESTRICTIONS
  const [demoSessionStart] = useState(Date.now());
  const [demoSessionTime, setDemoSessionTime] = useState(0);
  const maxDemoSessionTime = 30 * 60 * 1000; // 30 minutes
  const isDemoCamera = cameras.some(camera => camera.isDemoCamera);
  const hasActiveDemoStream = cameras.some(camera => camera.isDemoCamera && camera.stream);
  
  // 🎥 CONNECTED CAMERAS STATE
  const [connectedCameras, setConnectedCameras] = useState<Set<string>>(new Set());
  
  // 🎬 FULLSCREEN HOVER STATE
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🎬 DEMO SESSION TIMER
  useEffect(() => {
    if (hasActiveDemoStream) {
      const timer = setInterval(() => {
        setDemoSessionTime(Date.now() - demoSessionStart);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [hasActiveDemoStream, demoSessionStart]);
  
  // 🔒 DEMO SESSION LIMIT CHECK
  const isDemoSessionExpired = demoSessionTime > maxDemoSessionTime;
  const remainingDemoTime = Math.max(0, maxDemoSessionTime - demoSessionTime);
  
  // 📝 FORMAT DEMO TIME
  const formatDemoTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 🎬 FULLSCREEN HOVER HANDLERS - 2 SECOND HOVER REQUIRED
  const handleMouseMove = (e: React.MouseEvent) => {
    if (fullscreen) {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const topSafeZone = 100; // Avoid window controls area
      const showThreshold = windowHeight - 100; // Show overlay when mouse is within 100px of bottom
      
      // Don't trigger overlay logic if mouse is in top safe zone (window controls area)
      if (mouseY < topSafeZone) {
        // Clear any pending show timeout when in safe zone
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        return;
      }
      
      if (mouseY >= showThreshold && !showCameraOverlay) {
        // Mouse is near bottom - start 7 second timer to show overlay
        if (!hoverTimeoutRef.current) {
          hoverTimeoutRef.current = setTimeout(() => {
            setShowCameraOverlay(true);
          }, 2000); // 2 seconds
        }
      } else if (mouseY < showThreshold) {
        // Mouse moved away from bottom - cancel timer and hide overlay
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        if (showCameraOverlay) {
          setShowCameraOverlay(false);
        }
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // 🎬 DEMO CAMERA STREAM HANDLING
  useEffect(() => {
    const selectedCameraData = cameras.find(c => c.id === selectedCamera);
    if (selectedCameraData && selectedCameraData.isDemoCamera && selectedCameraData.stream) {
      const videoElement = videoRefs.current[selectedCamera];
      if (videoElement) {
        // 🔄 STREAM ASSIGNMENT WITH ERROR RECOVERY
        try {
          setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'loading' }));
          setStreamErrors(prev => ({ ...prev, [selectedCamera]: '' }));
          
          videoElement.srcObject = selectedCameraData.stream;
          
          // 🎬 PLAY WITH ERROR HANDLING
          videoElement.play().catch(error => {
            console.error('[LiveVideoGrid] Failed to play demo camera stream:', error);
            setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'error' }));
            setStreamErrors(prev => ({ ...prev, [selectedCamera]: 'Play failed: ' + error.message }));
            
            // 🔄 RETRY PLAY AFTER SHORT DELAY
            setTimeout(() => {
              videoElement.play().catch(retryError => {
                console.error('[LiveVideoGrid] Retry play failed:', retryError);
                setStreamErrors(prev => ({ ...prev, [selectedCamera]: 'Retry failed: ' + retryError.message }));
              });
            }, 1000);
          });
          
          // 🎧 STREAM EVENT LISTENERS
          videoElement.addEventListener('loadstart', () => {
            console.log('[LiveVideoGrid] Stream loading started');
            setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'loading' }));
          });
          
          videoElement.addEventListener('loadedmetadata', () => {
            console.log('[LiveVideoGrid] Stream metadata loaded');
            setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'active' }));
          });
          
          videoElement.addEventListener('playing', () => {
            console.log('[LiveVideoGrid] Stream playing');
            setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'active' }));
          });
          
          videoElement.addEventListener('error', (event) => {
            console.error('[LiveVideoGrid] Video element error:', event);
            setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'error' }));
            setStreamErrors(prev => ({ ...prev, [selectedCamera]: 'Video error: ' + (event as any).message }));
          });
          
        } catch (error) {
          console.error('[LiveVideoGrid] Failed to assign stream to video element:', error);
          setStreamStatus(prev => ({ ...prev, [selectedCamera]: 'error' }));
          setStreamErrors(prev => ({ ...prev, [selectedCamera]: 'Stream assignment failed: ' + (error as Error).message }));
        }
      }
    }
  }, [selectedCamera, cameras]);

  // 🧹 CLEANUP STREAM OBJECTS
  useEffect(() => {
    return () => {
      // Clean up any created object URLs
      Object.values(videoRefs.current).forEach(videoElement => {
        if (videoElement && videoElement.src && videoElement.src.startsWith('blob:')) {
          URL.revokeObjectURL(videoElement.src);
        }
      });
    };
  }, []);

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
    ...(fullscreen && {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      maxHeight: '200px',
      transform: showCameraOverlay ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease-in-out',
    }),
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
    <div style={containerStyle} onMouseMove={handleMouseMove}>
      {/* Main Video Display */}
      <div 
        style={mainVideoStyle}
      >
        {selectedCamera ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {(() => {
              const selectedCameraData = cameras.find(c => c.id === selectedCamera);
              const isDemoCamera = selectedCameraData?.isDemoCamera && selectedCameraData?.stream;
              
              const isConnected = connectedCameras.has(selectedCamera);
              
              return (
                <>
                  <video
                    ref={el => videoRefs.current[selectedCamera] = el}
                    style={videoStyle}
                    autoPlay
                    muted={!audioEnabled}
                    playsInline
                    {...(isDemoCamera ? {} : { controls: false })}
                  >
                    {!isDemoCamera && selectedCameraData?.url && (
                      <source 
                        src={selectedCameraData.url} 
                        type="video/mp4" 
                      />
                    )}
                  </video>
                  
                  {/* 🎥 SIMPLE DEMO CAMERA OVERLAY - Show for demo account when not connected */}
                  {userEmail === 'demo@onebarnai.com' && !isDemoCamera && !isConnected && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: brandConfig.layout.borderRadius,
                        padding: brandConfig.spacing.lg,
                        textAlign: 'center',
                        color: brandConfig.colors.barnWhite,
                        border: `2px solid ${brandConfig.colors.championGold}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                                      onClick={() => {
                  // Enhanced camera connection with aspect ratio preservation
                  navigator.mediaDevices.getUserMedia({ 
                    video: { 
                      width: { ideal: 1920 },
                      height: { ideal: 1080 },
                      aspectRatio: { ideal: 16/9 }
                    }
                  })
                    .then(stream => {
                      const videoElement = videoRefs.current[selectedCamera];
                      if (videoElement) {
                        videoElement.srcObject = stream;
                        // Ensure consistent styling for live stream
                        videoElement.style.objectFit = 'cover';
                        videoElement.style.width = '100%';
                        videoElement.style.height = '100%';
                        videoElement.style.backgroundColor = brandConfig.colors.midnightBlack;
                        
                        // Mark camera as connected
                        setConnectedCameras(prev => new Set(prev).add(selectedCamera));
                      }
                    })
                    .catch(err => {
                      console.error('Camera access denied:', err);
                      // Could add fallback or user guidance here
                    });
                }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                      }}
                    >
                      <Camera size={32} style={{ marginBottom: brandConfig.spacing.sm }} />
                      <div style={{ fontSize: brandConfig.typography.fontSizeLg, fontWeight: 'bold' }}>
                        Connect Camera
                      </div>
                      <div style={{ fontSize: brandConfig.typography.fontSizeSm, opacity: 0.8 }}>
                        Click to use your camera
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

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
                style={{
                  ...controlButtonStyle,
                  opacity: isDemoSessionExpired ? 0.5 : 1,
                  cursor: isDemoSessionExpired ? 'not-allowed' : 'pointer'
                }}
                disabled={isDemoSessionExpired}
                title={isDemoSessionExpired 
                  ? 'Demo session expired' 
                  : audioEnabled 
                    ? 'Disable audio'
                    : 'Enable audio'
                }
              >
                {audioEnabled ? 
                  <Volume2 style={{ width: '20px', height: '20px' }} /> : 
                  <VolumeX style={{ width: '20px', height: '20px' }} />
                }
              </button>
              <button
                onClick={toggleFullscreen}
                style={{
                  ...controlButtonStyle,
                  opacity: isDemoSessionExpired ? 0.5 : 1,
                  cursor: isDemoSessionExpired ? 'not-allowed' : 'pointer'
                }}
                disabled={isDemoSessionExpired}
                title={isDemoSessionExpired 
                  ? 'Demo session expired' 
                  : fullscreen 
                    ? 'Exit fullscreen'
                    : 'Enter fullscreen'
                }
              >
                <Maximize2 style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* 🎯 DEMO WATERMARK */}
            {selectedCamera && cameras.find(c => c.id === selectedCamera)?.isDemoCamera && (
              <div style={{
                position: 'absolute',
                top: brandConfig.spacing.md,
                right: brandConfig.spacing.md,
                padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                backgroundColor: 'rgba(255, 215, 0, 0.9)',
                color: brandConfig.colors.midnightBlack,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeXs,
                fontWeight: brandConfig.typography.weightBold,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: brandConfig.spacing.xs,
                zIndex: 10
              }}>
                <span>🎥</span>
                <span>ONE BARN AI DEMO</span>
              </div>
            )}
            
            {/* 🎯 DEMO SESSION TIMER */}
            {hasActiveDemoStream && (
              <div style={{
                position: 'absolute',
                top: brandConfig.spacing.md,
                left: brandConfig.spacing.md,
                padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                backgroundColor: isDemoSessionExpired ? 'rgba(220, 53, 69, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                color: brandConfig.colors.barnWhite,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeXs,
                fontWeight: brandConfig.typography.weightBold,
                display: 'flex',
                alignItems: 'center',
                gap: brandConfig.spacing.xs,
                zIndex: 9
              }}>
                <span>⏱️</span>
                <span>
                  {isDemoSessionExpired 
                    ? 'Demo Session Expired' 
                    : `Demo Time: ${formatDemoTime(remainingDemoTime)}`
                  }
                </span>
              </div>
            )}

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
                  display: 'flex',
                  alignItems: 'center',
                  gap: brandConfig.spacing.xs
                }}
              >
                {connectedCameras.has(selectedCamera) ? 'Your Camera' : cameras.find(c => c.id === selectedCamera)?.name}
                {/* 🎬 STREAM STATUS INDICATOR */}
                {selectedCamera && cameras.find(c => c.id === selectedCamera)?.isDemoCamera && (
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 
                      streamStatus[selectedCamera] === 'active' ? brandConfig.colors.successGreen :
                      streamStatus[selectedCamera] === 'loading' ? brandConfig.colors.alertAmber :
                      streamStatus[selectedCamera] === 'error' ? brandConfig.colors.errorRed :
                      brandConfig.colors.neutralGray,
                    animation: streamStatus[selectedCamera] === 'loading' ? 'pulse 2s infinite' : 'none'
                  }} />
                )}
              </div>
              <div 
                style={{
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontSize: brandConfig.typography.fontSizeXs,
                  opacity: 0.8,
                }}
              >
                {cameras.find(c => c.id === selectedCamera)?.location}
                {/* 🎬 STREAM STATUS TEXT */}
                {selectedCamera && cameras.find(c => c.id === selectedCamera)?.isDemoCamera && (
                  <span style={{ marginLeft: brandConfig.spacing.xs }}>
                    • {streamStatus[selectedCamera] === 'active' ? 'LIVE' :
                        streamStatus[selectedCamera] === 'loading' ? 'CONNECTING' :
                        streamStatus[selectedCamera] === 'error' ? 'ERROR' :
                        'INACTIVE'}
                  </span>
                )}
              </div>
              
              {/* 🎬 STREAM ERROR DISPLAY */}
              {selectedCamera && streamErrors[selectedCamera] && (
                <div style={{
                  fontSize: brandConfig.typography.fontSizeXs,
                  color: brandConfig.colors.errorRed,
                  marginTop: brandConfig.spacing.xs,
                  maxWidth: '200px',
                  wordWrap: 'break-word' as const
                }}>
                  {streamErrors[selectedCamera]}
                </div>
              )}
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
              {isDemoCamera ? 'Select a demo camera to begin' : 'Select a camera to view'}
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Hover Hint */}
      {fullscreen && !showCameraOverlay && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: brandConfig.colors.barnWhite,
            borderRadius: brandConfig.layout.borderRadius,
            fontSize: brandConfig.typography.fontSizeXs,
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          Move mouse to bottom for camera selection
        </div>
      )}

      {/* Camera Grid - Always visible in normal view, overlay in fullscreen */}
      {(!fullscreen || showCameraOverlay) && (
        <div 
          style={cameraGridStyle}
        >
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
                {(() => {
                  const isDemoCamera = camera.isDemoCamera && camera.stream;
                  
                  return (
                    <video
                      ref={el => {
                        if (el && isDemoCamera) {
                          el.srcObject = camera.stream!;
                          el.play().catch(error => {
                            console.error('[LiveVideoGrid] Failed to play thumbnail stream:', error);
                          });
                        }
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      autoPlay
                      muted
                      playsInline
                    >
                      {!isDemoCamera && camera.url && (
                        <source src={camera.url} type="video/mp4" />
                      )}
                    </video>
                  );
                })()}
                
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
                    {connectedCameras.has(camera.id) ? 'Your Camera' : camera.name}
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
      )}
    </div>
  );
}; 