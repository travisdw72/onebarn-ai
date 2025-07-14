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

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  AlertTriangle, 
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';
import { newDashboardConfig } from '../../config/newDashboardConfig';
import { dashboardConfig } from '../../config/dashboardConfig';

import { useAuth } from '../../contexts/AuthContext';
import { ScheduledAIMonitor } from '../ai-monitor/ScheduledAIMonitor';

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
  const { user } = useAuth();
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
  
  // 🤖 AI MONITORING STATE - Updated to be background-only
  const [aiMonitoringActive, setAIMonitoringActive] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const aiVideoRef = useRef<HTMLVideoElement>(null);
  
  // 🔍 DEBUG LOGGING FOR DEMO ACCOUNT
  useEffect(() => {
    console.log('🔍 [LiveVideoGrid] Component mounted with props:');
    console.log('🔍 [LiveVideoGrid] userEmail:', userEmail);
    console.log('🔍 [LiveVideoGrid] selectedCamera:', selectedCamera);
    console.log('🔍 [LiveVideoGrid] cameras:', cameras);
    console.log('🔍 [LiveVideoGrid] isDemoAccount check:', userEmail === 'demo@onebarnai.com');
    console.log('🔍 [LiveVideoGrid] connectedCameras:', connectedCameras);
    console.log('🔍 [LiveVideoGrid] aiMonitoringActive:', aiMonitoringActive);
    console.log('🔍 [LiveVideoGrid] showAIPanel:', showAIPanel);
  }, [userEmail, selectedCamera, cameras, connectedCameras, aiMonitoringActive, showAIPanel]);
  
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

  // �� DEMO CAMERA STREAM HANDLING
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

  // 📱 MOBILE-RESPONSIVE DETECTION
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isMobileViewport = window.innerWidth < 768;
  const isMobile = isMobileDevice || isMobileViewport;

  // New AI monitoring integration
  const handleCameraConnection = useCallback(async (cameraId: string) => {
    console.log('🎬 [LiveVideoGrid] handleCameraConnection called');
    console.log('🎬 [LiveVideoGrid] cameraId:', cameraId);
    console.log('🎬 [LiveVideoGrid] userEmail:', userEmail);
    console.log('🎬 [LiveVideoGrid] isDemoAccount:', userEmail === 'demo@onebarnai.com');
    
    try {
      console.log('🎬 [LiveVideoGrid] Starting camera connection for AI monitoring...');
      
      // 📱 MOBILE-SPECIFIC CAMERA CONNECTION
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('📱 [LiveVideoGrid] Mobile device detected:', isMobileDevice);
      
      // 🔒 HTTPS CHECK FOR MOBILE
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (isMobileDevice && !isSecure) {
        throw new Error('📱 Mobile camera access requires HTTPS connection. Please use a secure connection.');
      }
      
      // 🎥 MOBILE-OPTIMIZED CAMERA CONSTRAINTS
      const constraints = {
        video: isMobileDevice ? {
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          aspectRatio: { ideal: 16/9 },
          facingMode: 'environment', // Use back camera on mobile
          frameRate: { ideal: 30, max: 60 }
        } : {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 16/9 },
          frameRate: { ideal: 30 }
        },
        audio: false // Disable audio for better mobile performance
      };
      
      // Enhanced camera connection with mobile-specific handling
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('🎬 [LiveVideoGrid] Stream obtained:', stream);
      
      const videoElement = videoRefs.current[cameraId];
      if (videoElement) {
        videoElement.srcObject = stream;
        
        // 📱 MOBILE-SPECIFIC VIDEO ELEMENT SETUP
        videoElement.style.objectFit = 'cover';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.backgroundColor = brandConfig.colors.midnightBlack;
        videoElement.playsInline = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        
        // 🤖 ASSIGN STREAM TO AI VIDEO REF FOR MONITORING
        if (aiVideoRef.current) {
          aiVideoRef.current.srcObject = stream;
          aiVideoRef.current.playsInline = true;
          aiVideoRef.current.autoplay = true;
          aiVideoRef.current.muted = true;
        }
        
        // Mark camera as connected
        setConnectedCameras(prev => new Set(prev).add(cameraId));
        
        // 🤖 TRIGGER AI MONITORING FOR DEMO ACCOUNT
        if (userEmail === 'demo@onebarnai.com') {
          console.log('✅ [LiveVideoGrid] Camera connected, starting AI monitoring...');
          console.log('✅ [LiveVideoGrid] AI monitoring video element connected');
          setAIMonitoringActive(true);
          setShowAIPanel(true);
          
          // Show success message
          console.log('🎬 AI Monitoring Active - Camera connected successfully!');
        }
      }
    } catch (err) {
      console.error('❌ [LiveVideoGrid] Camera access denied:', err);
      
      // 📱 MOBILE-SPECIFIC ERROR HANDLING
      let errorMessage = 'Camera access failed. ';
      if (err instanceof Error) {
        if (err.message.includes('Permission denied')) {
          errorMessage += 'Please allow camera access in your browser settings.';
        } else if (err.message.includes('NotFoundError')) {
          errorMessage += 'No camera found. Please check your device has a camera.';
        } else if (err.message.includes('NotReadableError')) {
          errorMessage += 'Camera is being used by another application.';
        } else if (err.message.includes('HTTPS')) {
          errorMessage += err.message;
        } else {
          errorMessage += err.message;
        }
      }
      
      // Show error to user (you could add a toast notification here)
      console.error('📱 [LiveVideoGrid] Mobile camera error:', errorMessage);
      
      // Could add fallback or user guidance here
      alert(errorMessage);
    }
  }, [userEmail]);

  // Main container styles - Updated to support side panel
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row', // Changed to row to accommodate side panel
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

  // Video container styles - Updated to accommodate side panel
  const videoContainerStyle: React.CSSProperties = {
    flex: showAIPanel && !fullscreen ? '1' : '1',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
    gap: isMobile ? brandConfig.spacing.sm : brandConfig.spacing.lg,
    padding: isMobile ? brandConfig.spacing.sm : brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    maxHeight: isMobile ? '120px' : '150px',
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
      maxHeight: isMobile ? '140px' : '200px',
      transform: showCameraOverlay ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s ease-in-out',
    }),
  };

  const cameraScrollStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? `repeat(auto-fill, 120px)` : `repeat(auto-fill, 200px)`,
    gap: isMobile ? brandConfig.spacing.sm : brandConfig.spacing.lg,
    justifyContent: 'start',
    flex: 1,
  };

  // 📱 MOBILE-RESPONSIVE EMERGENCY PANEL STYLES
  const emergencyPanelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? brandConfig.spacing.xs : brandConfig.spacing.sm,
    padding: isMobile ? brandConfig.spacing.sm : brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    minWidth: isMobile ? '200px' : '250px',
    maxWidth: isMobile ? '280px' : '400px',
    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    fontSize: isMobile ? brandConfig.typography.fontSizeXs : brandConfig.typography.fontSizeSm,
  };

  const emergencyRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', // Stack vertically on mobile
    gap: isMobile ? brandConfig.spacing.xs : brandConfig.spacing.sm,
  };

  const emergencyButtonStyle: React.CSSProperties = {
    padding: isMobile ? `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}` : `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
    backgroundColor: brandConfig.colors.errorRed,
    color: brandConfig.colors.barnWhite,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    fontSize: isMobile ? brandConfig.typography.fontSizeXs : brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    fontWeight: brandConfig.typography.weightBold,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: isMobile ? '40px' : newDashboardConfig.layout.touchTargetSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '4px' : brandConfig.spacing.xs,
    width: '100%',
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
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
    minHeight: isMobile ? '67px' : '112px', // Maintain aspect ratio but ensure minimum size
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
  };

  const selectedCameraTileStyle: React.CSSProperties = {
    ...cameraTileStyle,
    border: `2px solid ${brandConfig.colors.stableMahogany}`,
  };

  // AI Panel styles
  const aiPanelStyle: React.CSSProperties = {
    width: '350px',
    backgroundColor: brandConfig.colors.barnWhite,
    borderLeft: `1px solid ${brandConfig.colors.sterlingSilver}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  const aiPanelHeaderStyle: React.CSSProperties = {
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const aiPanelContentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: brandConfig.spacing.sm,
  };

  return (
    <div style={containerStyle} onMouseMove={handleMouseMove}>
      {/* Main Video Container */}
      <div style={videoContainerStyle}>
      {/* Main Video Display */}
        <div style={mainVideoStyle}>
        {selectedCamera ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {(() => {
              const selectedCameraData = cameras.find(c => c.id === selectedCamera);
              const isDemoCamera = selectedCameraData?.isDemoCamera && selectedCameraData?.stream;
              const isConnected = connectedCameras.has(selectedCamera);
              
              return (
                <>
                  <video
                      ref={el => {
                        videoRefs.current[selectedCamera] = el;
                        if (el && isDemoCamera) {
                          el.srcObject = selectedCameraData.stream!;
                          el.play().catch(error => {
                            console.error('[LiveVideoGrid] Failed to play video:', error);
                          });
                        }
                      }}
                    style={videoStyle}
                    autoPlay
                    muted={!audioEnabled}
                    playsInline
                      controls={false}
                      onLoadedMetadata={() => {
                        const cameraId = selectedCamera;
                        setStreamStatus(prev => ({ ...prev, [cameraId]: 'active' }));
                      }}
                      onError={(e) => {
                        const cameraId = selectedCamera;
                        setStreamStatus(prev => ({ ...prev, [cameraId]: 'error' }));
                        setStreamErrors(prev => ({ ...prev, [cameraId]: 'Failed to load video stream' }));
                      }}
                    />
                  
                    {/* 🎥 CAMERA CONNECTION OVERLAY - Show for demo account when not connected */}
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
                        minWidth: '200px',
                        minHeight: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
                        touchAction: 'manipulation', // Prevent zoom on double tap
                      }}
                      className="touch-target-glove"
                      onClick={() => {
                        console.log('🔍 [LiveVideoGrid] Connect Camera button clicked');
                        console.log('🔍 [LiveVideoGrid] selectedCamera:', selectedCamera);
                        console.log('🔍 [LiveVideoGrid] userEmail:', userEmail);
                        console.log('🔍 [LiveVideoGrid] About to call handleCameraConnection');
                        handleCameraConnection(selectedCamera);
                      }}
                      onTouchStart={(e) => {
                        // Mobile touch feedback
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                      }}
                      onTouchEnd={(e) => {
                        // Reset after touch
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                      }}
                      onMouseOver={(e) => {
                        // Desktop hover feedback
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                        e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        // Reset after hover
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

                    {/* Alert Overlays */}
                    <div style={{
                position: 'absolute',
                top: brandConfig.spacing.md,
                left: brandConfig.spacing.md,
                      right: brandConfig.spacing.md,
                      pointerEvents: 'none',
                      zIndex: 5,
                    }}>
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
                            marginBottom: brandConfig.spacing.xs,
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
                            {new Date(alert.timestamp).toLocaleTimeString()}
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
                          backgroundColor: audioEnabled ? brandConfig.colors.successGreen : 'rgba(0, 0, 0, 0.5)',
                }}
                        title={audioEnabled ? 'Mute audio' : 'Enable audio'}
              >
                        {audioEnabled ? (
                          <Volume2 style={{ width: '20px', height: '20px' }} />
                        ) : (
                  <VolumeX style={{ width: '20px', height: '20px' }} />
                        )}
              </button>
                      
              <button
                onClick={toggleFullscreen}
                        style={controlButtonStyle}
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
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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

                    {/* 🎬 AI MONITORING STATUS INDICATOR */}
                    {userEmail === 'demo@onebarnai.com' && aiMonitoringActive && (
                      <div style={{
                        position: 'absolute',
                        bottom: brandConfig.spacing.md,
                        right: fullscreen ? '100px' : '150px',
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        backgroundColor: brandConfig.colors.successGreen,
                        color: brandConfig.colors.barnWhite,
                        borderRadius: brandConfig.layout.borderRadius,
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightBold,
                        display: 'flex',
                        alignItems: 'center',
                        gap: brandConfig.spacing.xs,
                        zIndex: 10,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}>
                        <span>🤖</span>
                        <span>AI MONITORING ACTIVE</span>
                      </div>
                    )}
                  </>
                );
              })()}
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

      {/* Camera Grid - Always visible in normal view, overlay in fullscreen */}
      {(!fullscreen || showCameraOverlay) && (
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
                          style={videoStyle}
                      autoPlay
                      muted
                      playsInline
                          controls={false}
                          onLoadedMetadata={() => {
                            setStreamStatus(prev => ({ ...prev, [camera.id]: 'active' }));
                          }}
                          onError={(e) => {
                            console.error('[LiveVideoGrid] Thumbnail video error:', e);
                            setStreamStatus(prev => ({ ...prev, [camera.id]: 'error' }));
                          }}
                        />
                  );
                })()}
                
                    {/* Camera Status Indicator */}
                    <div style={{
                    position: 'absolute',
                    top: brandConfig.spacing.xs,
                    right: brandConfig.spacing.xs,
                      width: '12px',
                      height: '12px',
                    borderRadius: '50%',
                      backgroundColor: 
                        camera.status === 'online' ? brandConfig.colors.successGreen :
                        camera.status === 'offline' ? brandConfig.colors.errorRed :
                        brandConfig.colors.alertAmber,
                      border: `2px solid ${brandConfig.colors.barnWhite}`,
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }} />

                    {/* Camera Name */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: brandConfig.spacing.xs,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: brandConfig.colors.barnWhite,
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontFamily: brandConfig.typography.fontPrimary,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}>
                      {camera.name}
                    </div>

                {/* Alert Badge */}
                {hasAlerts && (
                      <div style={{
                      position: 'absolute',
                      top: brandConfig.spacing.xs,
                      left: brandConfig.spacing.xs,
                        backgroundColor: criticalAlerts > 0 ? brandConfig.colors.errorRed : brandConfig.colors.alertAmber,
                      color: brandConfig.colors.barnWhite,
                      borderRadius: '12px',
                        padding: `2px ${brandConfig.spacing.xs}`,
                        fontSize: '10px',
                      fontWeight: brandConfig.typography.weightBold,
                        minWidth: '20px',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}>
                        {cameraAlerts.length}
                  </div>
                )}
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

      {/* 🤖 AI MONITORING SIDE PANEL - Non-intrusive background monitoring */}
      {userEmail === 'demo@onebarnai.com' && showAIPanel && !fullscreen && (
        <div style={aiPanelStyle}>
          <div style={aiPanelHeaderStyle}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: brandConfig.spacing.sm,
            }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <div style={{
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightBold,
                  color: brandConfig.colors.stableMahogany,
                  marginBottom: '2px',
                }}>
                  AI Monitor
                </div>
                                 <div style={{
                   fontSize: brandConfig.typography.fontSizeXs,
                   color: brandConfig.colors.neutralGray,
                 }}>
                   Background Analysis
                 </div>
               </div>
             </div>
             <button
               onClick={() => setShowAIPanel(false)}
               style={{
                 background: 'none',
                 border: 'none',
                 fontSize: brandConfig.typography.fontSizeLg,
                 cursor: 'pointer',
                 color: brandConfig.colors.neutralGray,
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Hide AI Panel (monitoring continues)"
            >
              ×
            </button>
          </div>
          
          <div style={aiPanelContentStyle}>
            <div style={{
              padding: brandConfig.spacing.sm,
              backgroundColor: brandConfig.colors.successGreen,
              color: brandConfig.colors.barnWhite,
              borderRadius: brandConfig.layout.borderRadius,
              textAlign: 'center',
              fontSize: brandConfig.typography.fontSizeSm,
              fontWeight: brandConfig.typography.weightBold,
              marginBottom: brandConfig.spacing.md,
            }}>
              🎬 AI Monitoring Active
            </div>
            
            <ScheduledAIMonitor 
              videoRef={aiVideoRef}
              isStreamActive={connectedCameras.has(selectedCamera)}
              onAnalysisComplete={(analysis) => {
                console.log('🤖 [LiveVideoGrid] AI Analysis Complete:', analysis);
              }}
            />
          </div>
        </div>
      )}

      {/* 🤖 HIDDEN VIDEO ELEMENT FOR AI MONITORING */}
      <video
        ref={aiVideoRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
        muted
        autoPlay
        playsInline
      />

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
    </div>
  );
}; 