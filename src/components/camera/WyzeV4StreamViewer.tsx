import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Slider,
  Switch,
  FormControlLabel,
  Paper,
  Snackbar
} from '@mui/material';
import {
  Videocam,
  PlayArrow,
  Stop,
  Fullscreen,
  FullscreenExit,
  Settings,
  VolumeUp,
  VolumeOff,
  PhotoCamera,
  FiberManualRecord,
  StopCircle,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  CameraEnhance,
  Error,
  CheckCircle,
  GridOn,
  GridOff,
  Close,
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { wyzeV4Config } from '../../config/wyzeV4Config';
import { WyzeV4Service } from '../../services/wyzeV4Service';
import type { 
  IWyzeV4Camera, 
  IWyzeV4Stream, 
  IWyzeV4Alert,
  IWyzeV4StreamProps 
} from '../../interfaces/config/wyzeV4Config.interface';

export const WyzeV4StreamViewer: React.FC<IWyzeV4StreamProps> = ({
  tenantId,
  camera,
  stream,
  showControls = true,
  autoPlay = false,
  muted = true,
  fullscreenEnabled = true,
  onFullscreen,
  onStreamStarted,
  onStreamStopped,
  onAlert,
  onError
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [isStreaming, setIsStreaming] = useState<boolean>(stream?.isActive || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(!muted);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [brightness, setBrightness] = useState<number>(50);
  const [contrast, setContrast] = useState<number>(50);
  const [zoom, setZoom] = useState<number>(1);

  // Refs
  const serviceRef = useRef<WyzeV4Service | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordingTimeRef = useRef<number>(0);

  // Styles following brandConfig patterns
  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: brandConfig.colors.background,
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden',
      position: 'relative'
    },
    videoContainer: {
      position: 'relative',
      width: '100%',
      height: isMobile ? '300px' : '500px',
      backgroundColor: brandConfig.colors.midnightBlack,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
      transform: `scale(${zoom})`
    },
    placeholderContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: brandConfig.colors.neutralGray,
      gap: brandConfig.spacing.md
    },
    controlsPanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
      padding: brandConfig.spacing.md,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: 0,
      transition: brandConfig.animations.transitions.smooth,
      '&:hover': {
        opacity: showControls ? 1 : 0
      }
    },
    ptzControls: {
      position: 'absolute',
      right: brandConfig.spacing.md,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: brandConfig.spacing.xs,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      opacity: 0,
      transition: brandConfig.animations.transitions.smooth,
      '&:hover': {
        opacity: showControls ? 1 : 0
      }
    },
    ptzButton: {
      width: '40px',
      height: '40px',
      minWidth: '40px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: brandConfig.colors.arenaSand,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      }
    },
    settingsPanel: {
      position: 'absolute',
      top: brandConfig.spacing.md,
      right: brandConfig.spacing.md,
      width: isMobile ? '90%' : '300px',
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      padding: brandConfig.spacing.md,
      zIndex: 10
    },
    statusOverlay: {
      position: 'absolute',
      top: brandConfig.spacing.sm,
      left: brandConfig.spacing.sm,
      right: brandConfig.spacing.sm,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 2
    },
    liveIndicator: {
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.barnWhite,
      padding: '0.25rem 0.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  };

  // Initialize service
  useEffect(() => {
    if (tenantId && camera) {
      serviceRef.current = new WyzeV4Service(tenantId);
      
      if (autoPlay && !isStreaming) {
        handleStreamStart();
      }
    }
  }, [tenantId, camera?.id]);

  // Handle stream start
  const handleStreamStart = async () => {
    if (!serviceRef.current || !camera) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await serviceRef.current.startStream(camera.id);
      
      if (result.success) {
        setIsStreaming(true);
        onStreamStarted?.(result.data);
      } else {
        setError(result.error || wyzeV4Config.messages.streaming.streamError);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stream stop
  const handleStreamStop = async () => {
    if (!serviceRef.current || !stream) return;

    try {
      await serviceRef.current.stopStream(stream.streamId);
      setIsStreaming(false);
      onStreamStopped?.(stream.streamId);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Handle PTZ controls
  const handlePTZControl = async (action: string) => {
    if (!serviceRef.current || !camera) return;

    try {
      await serviceRef.current.controlPTZ(camera.id, action);
      showSnackbar(`PTZ: ${action}`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Handle snapshot
  const handleSnapshot = async () => {
    if (!serviceRef.current || !camera) return;

    try {
      const result = await serviceRef.current.takeSnapshot(camera.id);
      if (result.success) {
        showSnackbar(wyzeV4Config.messages.recording.snapshotTaken || 'Snapshot taken');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Handle recording
  const handleRecording = async () => {
    setIsRecording(!isRecording);
    showSnackbar(isRecording ? 'Recording stopped' : 'Recording started');
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (!fullscreenEnabled) return;
    setIsFullscreen(!isFullscreen);
    onFullscreen?.(!isFullscreen);
  };

  // Show snackbar
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Render video content
  const renderVideoContent = () => {
    if (isLoading) {
      return (
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={48} sx={{ color: brandConfig.colors.arenaSand }} />
          <Typography variant="h6" color="inherit">
            {wyzeV4Config.messages.streaming.streamStarting || 'Starting stream...'}
          </Typography>
        </Stack>
      );
    }

    if (!isStreaming || !stream) {
      return (
        <Box sx={styles.placeholderContent}>
          <Videocam sx={{ fontSize: '4rem' }} />
          <Typography variant="h6" color="inherit">
            {camera?.name || 'Camera'}
          </Typography>
          <Typography variant="body2" color="inherit">
            {camera?.status === 'online' ? 'Click to start stream' : 'Camera offline'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStreamStart}
            disabled={camera?.status !== 'online'}
            sx={{
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.arenaSand
            }}
          >
            {wyzeV4Config.controls.streaming.startStream}
          </Button>
        </Box>
      );
    }

    return (
      <video
        ref={videoRef}
        src={stream.url}
        style={styles.video}
        autoPlay
        muted={!audioEnabled}
        playsInline
        controls={false}
      />
    );
  };

  // Render PTZ controls
  const renderPTZControls = () => {
    if (!camera?.capabilities.ptz || !showControls) return null;

    return (
      <Box sx={styles.ptzControls}>
        <Stack spacing={1}>
          <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('tilt_up')}>
            <ArrowUpward />
          </IconButton>
          <Stack direction="row" spacing={1}>
            <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('pan_left')}>
              <ArrowBack />
            </IconButton>
            <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('center')}>
              <CenterFocusStrong />
            </IconButton>
            <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('pan_right')}>
              <ArrowForward />
            </IconButton>
          </Stack>
          <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('tilt_down')}>
            <ArrowDownward />
          </IconButton>
          <Box sx={{ height: '8px' }} />
          <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('zoom_in')}>
            <ZoomIn />
          </IconButton>
          <IconButton sx={styles.ptzButton} onClick={() => handlePTZControl('zoom_out')}>
            <ZoomOut />
          </IconButton>
        </Stack>
      </Box>
    );
  };

  // Render controls panel
  const renderControlsPanel = () => {
    if (!showControls) return null;

    return (
      <Box sx={styles.controlsPanel}>
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={isStreaming ? handleStreamStop : handleStreamStart}
            sx={{ color: brandConfig.colors.arenaSand }}
          >
            {isStreaming ? <Stop /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={handleSnapshot} sx={{ color: brandConfig.colors.arenaSand }}>
            <PhotoCamera />
          </IconButton>
          <IconButton
            onClick={handleRecording}
            sx={{ color: isRecording ? brandConfig.colors.errorRed : brandConfig.colors.arenaSand }}
          >
            {isRecording ? <StopCircle /> : <FiberManualRecord />}
          </IconButton>
          {camera?.capabilities.audio && (
            <IconButton
              onClick={() => setAudioEnabled(!audioEnabled)}
              sx={{ color: brandConfig.colors.arenaSand }}
            >
              {audioEnabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => setShowGrid(!showGrid)}
            sx={{ color: brandConfig.colors.arenaSand }}
          >
            {showGrid ? <GridOff /> : <GridOn />}
          </IconButton>
          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            sx={{ color: brandConfig.colors.arenaSand }}
          >
            <Settings />
          </IconButton>
          {fullscreenEnabled && (
            <IconButton onClick={handleFullscreen} sx={{ color: brandConfig.colors.arenaSand }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={styles.container}>
      {/* Main Video Container */}
      <Box sx={styles.videoContainer}>
        {renderVideoContent()}

        {/* Status Overlay */}
        <Box sx={styles.statusOverlay}>
          <Stack spacing={1}>
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
            {isRecording && (
              <Chip
                icon={<FiberManualRecord />}
                label="REC"
                sx={{
                  backgroundColor: brandConfig.colors.errorRed,
                  color: brandConfig.colors.barnWhite
                }}
              />
            )}
          </Stack>

          <Stack spacing={1}>
            {camera && (
              <Chip
                icon={camera.status === 'online' ? <CheckCircle /> : <Error />}
                label={camera.status.toUpperCase()}
                color={camera.status === 'online' ? 'success' : 'error'}
                size="small"
              />
            )}
          </Stack>
        </Box>

        {/* PTZ Controls */}
        {renderPTZControls()}

        {/* Main Controls Panel */}
        {renderControlsPanel()}
      </Box>

      {/* Settings Panel */}
      {showSettings && (
        <Paper sx={styles.settingsPanel}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">Camera Settings</Typography>
              <IconButton onClick={() => setShowSettings(false)}>
                <Close />
              </IconButton>
            </Stack>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Brightness: {brightness}%
                </Typography>
                <Slider
                  value={brightness}
                  onChange={(_, value) => setBrightness(value as number)}
                  min={0}
                  max={200}
                  sx={{ color: brandConfig.colors.stableMahogany }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Contrast: {contrast}%
                </Typography>
                <Slider
                  value={contrast}
                  onChange={(_, value) => setContrast(value as number)}
                  min={0}
                  max={200}
                  sx={{ color: brandConfig.colors.stableMahogany }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" gutterBottom>
                  Zoom: {zoom}x
                </Typography>
                <Slider
                  value={zoom}
                  onChange={(_, value) => setZoom(value as number)}
                  min={1}
                  max={4}
                  step={0.1}
                  sx={{ color: brandConfig.colors.stableMahogany }}
                />
              </Box>
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ 
            position: 'absolute', 
            top: brandConfig.spacing.md, 
            left: brandConfig.spacing.md, 
            right: brandConfig.spacing.md, 
            zIndex: 10 
          }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};
 