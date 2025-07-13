import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Badge,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
  Skeleton
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  PlayArrow,
  Pause,
  Stop,
  Fullscreen,
  FullscreenExit,
  Settings,
  MoreVert,
  Error,
  CheckCircle,
  Warning,
  SignalCellularAlt,
  PhotoCamera,
  VolumeUp,
  VolumeOff,
  Refresh,
  GridView,
  ViewList,
  CameraEnhance,
  RecordVoiceOver,
  Mic,
  MicOff
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { wyzeV4Config } from '../../config/wyzeV4Config';
import { WyzeV4Service } from '../../services/wyzeV4Service';
import type { 
  IWyzeV4Camera, 
  IWyzeV4Stream, 
  IWyzeV4Alert,
  IWyzeV4GridProps 
} from '../../interfaces/config/wyzeV4Config.interface';

export const WyzeV4CameraGrid: React.FC<IWyzeV4GridProps> = ({
  tenantId,
  cameras = [],
  columns = 2,
  aspectRatio = '16:9',
  showLabels = true,
  showStatus = true,
  onCameraSelect,
  onStreamStarted,
  onStreamStopped,
  onAlert,
  onError
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State management
  const [streams, setStreams] = useState<Map<string, IWyzeV4Stream>>(new Map());
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [loadingCameras, setLoadingCameras] = useState<Set<string>>(new Set());
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCameraId, setMenuCameraId] = useState<string>('');
  const [fullscreenCamera, setFullscreenCamera] = useState<string>('');
  const [cameraAlerts, setCameraAlerts] = useState<Map<string, IWyzeV4Alert[]>>(new Map());
  const [audioEnabled, setAudioEnabled] = useState<Map<string, boolean>>(new Map());

  // Refs
  const serviceRef = useRef<WyzeV4Service | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate responsive columns
  const responsiveColumns = isMobile ? 1 : isTablet ? Math.min(columns, 2) : columns;

  // Calculate aspect ratio
  const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
  const aspectRatioPadding = `${(aspectHeight / aspectWidth) * 100}%`;

  // Styles following brandConfig patterns
  const styles = {
    container: {
      width: '100%',
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.background
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: `repeat(${responsiveColumns}, 1fr)`,
      gap: brandConfig.spacing.md,
      width: '100%'
    },
    cameraCard: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      overflow: 'hidden',
      transition: brandConfig.animations.transitions.smooth,
      cursor: 'pointer',
      '&:hover': {
        boxShadow: `0 8px 16px rgba(0, 0, 0, 0.15)`,
        transform: 'translateY(-2px)'
      }
    },
    cameraCardSelected: {
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      boxShadow: `0 0 0 2px ${brandConfig.colors.stableMahogany}40`
    },
    streamContainer: {
      position: 'relative',
      width: '100%',
      paddingBottom: aspectRatioPadding,
      backgroundColor: brandConfig.colors.midnightBlack,
      overflow: 'hidden'
    },
    streamVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    streamOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: brandConfig.animations.transitions.smooth,
      '&:hover': {
        opacity: 1
      }
    },
    streamPlaceholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: brandConfig.colors.neutralGray,
      backgroundColor: brandConfig.colors.midnightBlack
    },
    statusIndicator: {
      position: 'absolute',
      top: brandConfig.spacing.sm,
      left: brandConfig.spacing.sm,
      zIndex: 2
    },
    liveIndicator: {
      position: 'absolute',
      top: brandConfig.spacing.sm,
      right: brandConfig.spacing.sm,
      zIndex: 2,
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.barnWhite,
      padding: '0.25rem 0.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    controlsOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
      padding: brandConfig.spacing.sm,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: 0,
      transition: brandConfig.animations.transitions.smooth,
      '&:hover': {
        opacity: 1
      }
    },
    cameraInfo: {
      padding: showLabels ? brandConfig.spacing.md : brandConfig.spacing.sm,
      backgroundColor: brandConfig.colors.surface
    },
    cameraName: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xs,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    cameraStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      marginBottom: brandConfig.spacing.sm
    },
    statusChip: {
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightMedium,
      height: '24px'
    },
    alertBadge: {
      '& .MuiBadge-badge': {
        backgroundColor: brandConfig.colors.errorRed,
        color: brandConfig.colors.barnWhite,
        fontSize: brandConfig.typography.fontSizeXs
      }
    },
    fullscreenContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: brandConfig.colors.midnightBlack,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fullscreenVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    fullscreenControls: {
      position: 'absolute',
      bottom: brandConfig.spacing.lg,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: brandConfig.spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3
    }
  };

  // Initialize service
  useEffect(() => {
    if (tenantId) {
      serviceRef.current = new WyzeV4Service(tenantId);
      
      // Set up event listeners
      serviceRef.current.on('streamStarted', (stream: IWyzeV4Stream) => {
        setStreams(prev => new Map(prev).set(stream.cameraId, stream));
        setLoadingCameras(prev => {
          const newSet = new Set(prev);
          newSet.delete(stream.cameraId);
          return newSet;
        });
        onStreamStarted?.(stream);
      });

      serviceRef.current.on('streamStopped', (streamId: string) => {
        setStreams(prev => {
          const newMap = new Map(prev);
          for (const [cameraId, stream] of newMap.entries()) {
            if (stream.streamId === streamId) {
              newMap.delete(cameraId);
              break;
            }
          }
          return newMap;
        });
        onStreamStopped?.(streamId);
      });

      serviceRef.current.on('alert', (alert: IWyzeV4Alert) => {
        setCameraAlerts(prev => {
          const newMap = new Map(prev);
          const cameraAlerts = newMap.get(alert.cameraId) || [];
          newMap.set(alert.cameraId, [alert, ...cameraAlerts.slice(0, 4)]);
          return newMap;
        });
        onAlert?.(alert);
      });

      serviceRef.current.on('error', (error: string) => {
        onError?.(error);
      });
    }

    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
      }
    };
  }, [tenantId]);

  // Handle camera selection
  const handleCameraSelect = (cameraId: string) => {
    setSelectedCameraId(cameraId);
    onCameraSelect?.(cameraId);
  };

  // Handle stream start
  const handleStreamStart = async (cameraId: string) => {
    if (!serviceRef.current) return;

    try {
      setLoadingCameras(prev => new Set(prev).add(cameraId));
      const result = await serviceRef.current.startStream(cameraId);
      
      if (!result.success) {
        setLoadingCameras(prev => {
          const newSet = new Set(prev);
          newSet.delete(cameraId);
          return newSet;
        });
        onError?.(result.error || wyzeV4Config.messages.streaming.streamError);
      }
    } catch (error: any) {
      setLoadingCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
      onError?.(error.message);
    }
  };

  // Handle stream stop
  const handleStreamStop = async (cameraId: string) => {
    if (!serviceRef.current) return;

    try {
      const stream = streams.get(cameraId);
      if (stream) {
        await serviceRef.current.stopStream(stream.streamId);
      }
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Handle fullscreen
  const handleFullscreen = (cameraId: string) => {
    setFullscreenCamera(cameraId);
  };

  // Handle exit fullscreen
  const handleExitFullscreen = () => {
    setFullscreenCamera('');
  };

  // Handle audio toggle
  const handleAudioToggle = (cameraId: string) => {
    setAudioEnabled(prev => {
      const newMap = new Map(prev);
      const currentState = newMap.get(cameraId) || false;
      newMap.set(cameraId, !currentState);
      return newMap;
    });
  };

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, cameraId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuCameraId(cameraId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuCameraId('');
  };

  // Handle snapshot
  const handleSnapshot = async (cameraId: string) => {
    if (!serviceRef.current) return;

    try {
      const result = await serviceRef.current.takeSnapshot(cameraId);
      if (result.success) {
        // Handle snapshot success
        handleMenuClose();
      }
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Render camera card
  const renderCameraCard = (camera: IWyzeV4Camera) => {
    const stream = streams.get(camera.id);
    const isSelected = selectedCameraId === camera.id;
    const isStreaming = stream?.isActive || false;
    const isLoading = loadingCameras.has(camera.id);
    const alerts = cameraAlerts.get(camera.id) || [];
    const hasAudio = audioEnabled.get(camera.id) || false;

    return (
      <Card
        key={camera.id}
        sx={{
          ...styles.cameraCard,
          ...(isSelected && styles.cameraCardSelected)
        }}
        onClick={() => handleCameraSelect(camera.id)}
      >
        <Box sx={styles.streamContainer}>
          {/* Status Indicator */}
          {showStatus && (
            <Box sx={styles.statusIndicator}>
              <Chip
                icon={camera.status === 'online' ? <CheckCircle /> : <Error />}
                label={camera.status.toUpperCase()}
                size="small"
                color={camera.status === 'online' ? 'success' : 'error'}
                sx={styles.statusChip}
              />
            </Box>
          )}

          {/* Live Indicator */}
          {isStreaming && (
            <Box sx={styles.liveIndicator}>
              <Box
                sx={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: brandConfig.colors.barnWhite,
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}
              />
              LIVE
            </Box>
          )}

          {/* Alert Badge */}
          {alerts.length > 0 && (
            <Badge
              badgeContent={alerts.length}
              sx={{
                ...styles.alertBadge,
                position: 'absolute',
                top: brandConfig.spacing.sm,
                right: brandConfig.spacing.sm,
                zIndex: 2
              }}
            >
              <Warning sx={{ color: brandConfig.colors.errorRed }} />
            </Badge>
          )}

          {/* Video Stream */}
          {isStreaming && stream?.url ? (
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(camera.id, el);
              }}
              src={stream.url}
              style={styles.streamVideo}
              autoPlay
              muted={!hasAudio}
              playsInline
            />
          ) : (
            <Box sx={styles.streamPlaceholder}>
              <Videocam sx={{ fontSize: '3rem', marginBottom: brandConfig.spacing.sm }} />
              <Typography variant="body2" color="inherit">
                {camera.status === 'online' ? 'Click to start stream' : 'Camera offline'}
              </Typography>
            </Box>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <Box sx={styles.loadingOverlay}>
              <CircularProgress
                size={48}
                sx={{ color: brandConfig.colors.arenaSand }}
              />
            </Box>
          )}

          {/* Stream Controls Overlay */}
          <Box sx={styles.streamOverlay}>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (isStreaming) {
                    handleStreamStop(camera.id);
                  } else {
                    handleStreamStart(camera.id);
                  }
                }}
                sx={{ color: brandConfig.colors.arenaSand }}
              >
                {isStreaming ? <Stop /> : <PlayArrow />}
              </IconButton>
              {isStreaming && (
                <>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFullscreen(camera.id);
                    }}
                    sx={{ color: brandConfig.colors.arenaSand }}
                  >
                    <Fullscreen />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudioToggle(camera.id);
                    }}
                    sx={{ color: brandConfig.colors.arenaSand }}
                  >
                    {hasAudio ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                </>
              )}
              <IconButton
                onClick={(e) => handleMenuOpen(e, camera.id)}
                sx={{ color: brandConfig.colors.arenaSand }}
              >
                <MoreVert />
              </IconButton>
            </Stack>
          </Box>

          {/* Bottom Controls */}
          <Box sx={styles.controlsOverlay}>
            <Stack direction="row" spacing={1}>
              {isStreaming && (
                <Chip
                  icon={<SignalCellularAlt />}
                  label={`${stream?.resolution || 'HD'} • ${stream?.frameRate || 30}fps`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: brandConfig.colors.arenaSand,
                    fontSize: brandConfig.typography.fontSizeXs
                  }}
                />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              {camera.capabilities.audio && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudioToggle(camera.id);
                  }}
                  sx={{ color: brandConfig.colors.arenaSand }}
                >
                  {hasAudio ? <Mic /> : <MicOff />}
                </IconButton>
              )}
            </Stack>
          </Box>
        </Box>
        
        {/* Camera Info */}
        {showLabels && (
          <Box sx={styles.cameraInfo}>
            <Typography sx={styles.cameraName}>
              {camera.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={styles.cameraStatus}>
              <Chip
                label={camera.model}
                size="small"
                variant="outlined"
                sx={styles.statusChip}
              />
              <Typography variant="body2" color="textSecondary">
                {camera.settings.resolution}
              </Typography>
            </Stack>
          </Box>
        )}
      </Card>
    );
  };

  return (
    <Box ref={containerRef} sx={styles.container}>
      {/* Camera Grid */}
      <Box sx={styles.gridContainer}>
        {cameras.map(renderCameraCard)}
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleSnapshot(menuCameraId)}>
          <PhotoCamera sx={{ mr: 1 }} />
          {wyzeV4Config.controls.recording.takeSnapshot}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Settings sx={{ mr: 1 }} />
          {wyzeV4Config.controls.streaming.settings}
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <CameraEnhance sx={{ mr: 1 }} />
          {wyzeV4Config.controls.ptzControls.centerView}
        </MenuItem>
      </Menu>

      {/* Fullscreen Modal */}
      {fullscreenCamera && (
        <Box sx={styles.fullscreenContainer}>
          {(() => {
            const camera = cameras.find(c => c.id === fullscreenCamera);
            const stream = streams.get(fullscreenCamera);
            
            if (!camera || !stream) return null;
            
            return (
              <>
                <video
                  src={stream.url}
                  style={styles.fullscreenVideo}
                  autoPlay
                  muted={!audioEnabled.get(fullscreenCamera)}
                  playsInline
                />
                <Box sx={styles.fullscreenControls}>
                  <IconButton
                    onClick={handleExitFullscreen}
                    sx={{ color: brandConfig.colors.arenaSand }}
                  >
                    <FullscreenExit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleAudioToggle(fullscreenCamera)}
                    sx={{ color: brandConfig.colors.arenaSand }}
                  >
                    {audioEnabled.get(fullscreenCamera) ? <VolumeUp /> : <VolumeOff />}
                  </IconButton>
                  <IconButton
                    onClick={() => handleSnapshot(fullscreenCamera)}
                    sx={{ color: brandConfig.colors.arenaSand }}
                  >
                    <PhotoCamera />
                  </IconButton>
                </Box>
              </>
            );
          })()}
        </Box>
      )}
    </Box>
  );
}; 