import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Stack,
  Slider,
  Switch,
  FormControlLabel,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  ButtonGroup,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  FiberManualRecord,
  StopCircle,
  PhotoCamera,
  Videocam,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  PanTool,
  RotateLeft,
  RotateRight,
  Brightness6,
  Contrast,
  Nightlight,
  FlashlightOn,
  FlashlightOff,
  Settings,
  Save,
  Refresh,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
  MyLocation,
  BookmarkAdd,
  Bookmark,
  Route,
  Security,
  Tune,
  Speed,
  GridOn,
  GridOff,
  AspectRatio,
  HighQuality,
  VideoSettings
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { wyzeV4Config } from '../../config/wyzeV4Config';
import { WyzeV4Service } from '../../services/wyzeV4Service';
import type { 
  IWyzeV4Camera, 
  IWyzeV4Stream, 
  IWyzeV4ControlsProps,
  IWyzeV4Settings
} from '../../interfaces/config/wyzeV4Config.interface';

export const WyzeV4Controls: React.FC<IWyzeV4ControlsProps> = ({
  tenantId,
  camera,
  stream,
  position = 'bottom',
  size = 'medium',
  autoHide = true,
  onAction,
  onError
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State management
  const [isStreaming, setIsStreaming] = useState<boolean>(stream?.isActive || false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [micEnabled, setMicEnabled] = useState<boolean>(false);
  const [nightVision, setNightVision] = useState<boolean>(false);
  const [spotlight, setSpotlight] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(50);
  const [contrast, setContrast] = useState<number>(50);
  const [zoom, setZoom] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [presets, setPresets] = useState<any[]>([]);
  const [recordingQuality, setRecordingQuality] = useState<string>('HD');
  const [detectionSensitivity, setDetectionSensitivity] = useState<number>(50);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showPresetDialog, setShowPresetDialog] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTab, setCurrentTab] = useState<string>('basic');

  // Refs
  const serviceRef = useRef<WyzeV4Service | null>(null);
  const recordingTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // Control size configurations
  const sizeConfig = {
    small: {
      buttonSize: 32,
      iconSize: 16,
      spacing: 0.5,
      padding: 1
    },
    medium: {
      buttonSize: 40,
      iconSize: 20,
      spacing: 1,
      padding: 1.5
    },
    large: {
      buttonSize: 48,
      iconSize: 24,
      spacing: 1.5,
      padding: 2
    }
  };

  const config = sizeConfig[size];

  // Styles following brandConfig patterns
  const styles = {
    container: {
      position: position === 'overlay' ? 'absolute' : 'relative',
      bottom: position === 'bottom' || position === 'overlay' ? 0 : 'auto',
      top: position === 'top' ? 0 : 'auto',
      left: 0,
      right: 0,
      backgroundColor: position === 'overlay' ? 'rgba(0, 0, 0, 0.8)' : brandConfig.colors.surface,
      padding: brandConfig.spacing.md,
      borderRadius: position === 'overlay' ? 0 : brandConfig.layout.borderRadius,
      boxShadow: position === 'overlay' ? 'none' : brandConfig.layout.boxShadow,
      opacity: autoHide && position === 'overlay' ? 0 : 1,
      transition: brandConfig.animations.transitions.smooth,
      '&:hover': {
        opacity: 1
      },
      zIndex: position === 'overlay' ? 10 : 1
    },
    controlGroup: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius,
      padding: config.padding,
      margin: brandConfig.spacing.xs,
      boxShadow: position === 'overlay' ? 'none' : brandConfig.layout.boxShadow
    },
    controlButton: {
      width: config.buttonSize,
      height: config.buttonSize,
      minWidth: config.buttonSize,
      padding: 0,
      color: position === 'overlay' ? brandConfig.colors.arenaSand : brandConfig.colors.stableMahogany,
      backgroundColor: position === 'overlay' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      '&:hover': {
        backgroundColor: position === 'overlay' 
          ? 'rgba(255, 255, 255, 0.2)' 
          : `${brandConfig.colors.stableMahogany}20`
      },
      '&.active': {
        backgroundColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.arenaSand
      }
    },
    ptzGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: config.spacing,
      width: 'fit-content'
    },
    sliderContainer: {
      width: isMobile ? '100%' : '150px',
      '& .MuiSlider-thumb': {
        color: brandConfig.colors.stableMahogany
      },
      '& .MuiSlider-track': {
        color: brandConfig.colors.stableMahogany
      },
      '& .MuiSlider-rail': {
        color: brandConfig.colors.neutralGray
      }
    },
    tabContainer: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.sm
    },
    recordingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      color: brandConfig.colors.errorRed,
      animation: 'pulse 2s infinite'
    },
    presetChip: {
      margin: brandConfig.spacing.xs / 2,
      cursor: 'pointer',
      '&.selected': {
        backgroundColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.arenaSand
      }
    }
  };

  // Initialize service
  useEffect(() => {
    if (tenantId && camera) {
      serviceRef.current = new WyzeV4Service(tenantId);
      
      // Load presets
      loadPresets();
    }
  }, [tenantId, camera?.id]);

  // Load preset positions
  const loadPresets = async () => {
    // Mock preset data - in real implementation, this would come from the service
    setPresets([
      { id: '1', name: 'Main Gate', position: { pan: 0, tilt: 0, zoom: 1 } },
      { id: '2', name: 'Stable Entrance', position: { pan: 45, tilt: -10, zoom: 1.5 } },
      { id: '3', name: 'Training Area', position: { pan: -30, tilt: 5, zoom: 2 } }
    ]);
  };

  // Handle PTZ control
  const handlePTZControl = async (action: string, value?: number) => {
    if (!serviceRef.current || !camera) return;

    try {
      await serviceRef.current.controlPTZ(camera.id, action, value);
      onAction?.(action, { value });
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Handle stream control
  const handleStreamControl = async (action: 'start' | 'stop' | 'pause') => {
    if (!serviceRef.current || !camera) return;

    try {
      switch (action) {
        case 'start':
          const result = await serviceRef.current.startStream(camera.id);
          if (result.success) {
            setIsStreaming(true);
          }
          break;
        case 'stop':
          if (stream) {
            await serviceRef.current.stopStream(stream.streamId);
            setIsStreaming(false);
          }
          break;
        case 'pause':
          // Implement pause logic
          break;
      }
      onAction?.(action);
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Handle recording
  const handleRecording = async () => {
    try {
      if (isRecording) {
        setIsRecording(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onAction?.('stopRecording');
      } else {
        setIsRecording(true);
        recordingTimeRef.current = 0;
        intervalRef.current = setInterval(() => {
          recordingTimeRef.current += 1;
        }, 1000);
        onAction?.('startRecording');
      }
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Handle snapshot
  const handleSnapshot = async () => {
    if (!serviceRef.current || !camera) return;

    try {
      const result = await serviceRef.current.takeSnapshot(camera.id);
      if (result.success) {
        onAction?.('snapshot');
      }
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Handle preset
  const handlePreset = async (preset: any) => {
    if (!serviceRef.current || !camera) return;

    try {
      await serviceRef.current.controlPTZ(camera.id, 'goto_preset', preset.id);
      setSelectedPreset(preset.id);
      onAction?.('gotoPreset', { preset });
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Save new preset
  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return;

    const newPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      position: { pan: 0, tilt: 0, zoom } // Current position
    };

    setPresets(prev => [...prev, newPreset]);
    setNewPresetName('');
    setShowPresetDialog(false);
    onAction?.('savePreset', { preset: newPreset });
  };

  // Handle camera settings update
  const handleSettingsUpdate = async (settings: Partial<IWyzeV4Settings>) => {
    if (!serviceRef.current || !camera) return;

    try {
      await serviceRef.current.updateCameraSettings(camera.id, settings);
      onAction?.('updateSettings', { settings });
    } catch (error: any) {
      onError?.(error.message);
    }
  };

  // Render basic controls
  const renderBasicControls = () => (
    <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center">
      {/* Stream Controls */}
      <Box sx={styles.controlGroup}>
        <Stack direction="row" spacing={1}>
          <Tooltip title={wyzeV4Config.controls.streaming.startStream}>
            <IconButton
              sx={styles.controlButton}
              onClick={() => handleStreamControl(isStreaming ? 'stop' : 'start')}
            >
              {isStreaming ? <Stop /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
          <Tooltip title={wyzeV4Config.controls.recording.takeSnapshot}>
            <IconButton sx={styles.controlButton} onClick={handleSnapshot}>
              <PhotoCamera />
            </IconButton>
          </Tooltip>
          <Tooltip title={wyzeV4Config.controls.recording.startRecording}>
            <IconButton
              sx={{
                ...styles.controlButton,
                color: isRecording ? brandConfig.colors.errorRed : styles.controlButton.color
              }}
              onClick={handleRecording}
            >
              {isRecording ? <StopCircle /> : <FiberManualRecord />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Audio Controls */}
      {camera?.capabilities.audio && (
        <Box sx={styles.controlGroup}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={wyzeV4Config.controls.audio.muteAudio}>
              <IconButton
                sx={{
                  ...styles.controlButton,
                  ...(audioEnabled && { backgroundColor: brandConfig.colors.stableMahogany, color: brandConfig.colors.arenaSand })
                }}
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <VolumeUp /> : <VolumeOff />}
              </IconButton>
            </Tooltip>
            <Box sx={styles.sliderContainer}>
              <Slider
                value={volume}
                onChange={(_, value) => setVolume(value as number)}
                min={0}
                max={100}
                size="small"
                disabled={!audioEnabled}
              />
            </Box>
            <Tooltip title={wyzeV4Config.controls.audio.twoWayAudio}>
              <IconButton
                sx={{
                  ...styles.controlButton,
                  ...(micEnabled && { backgroundColor: brandConfig.colors.stableMahogany, color: brandConfig.colors.arenaSand })
                }}
                onClick={() => setMicEnabled(!micEnabled)}
              >
                {micEnabled ? <Mic /> : <MicOff />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      {/* Recording Status */}
      {isRecording && (
        <Box sx={styles.recordingIndicator}>
          <FiberManualRecord sx={{ fontSize: config.iconSize }} />
          <Typography variant="body2">
            REC {Math.floor(recordingTimeRef.current / 60)}:{(recordingTimeRef.current % 60).toString().padStart(2, '0')}
          </Typography>
        </Box>
      )}
    </Stack>
  );

  // Render PTZ controls
  const renderPTZControls = () => {
    if (!camera?.capabilities.ptz) return null;

    return (
      <Box sx={styles.controlGroup}>
        <Typography variant="subtitle2" gutterBottom>
          {wyzeV4Config.controls.ptzControls.panLeft.split(' ')[0]} Controls
        </Typography>
        <Stack spacing={2}>
          {/* Directional Controls */}
          <Box sx={styles.ptzGrid}>
            <Box />
            <Tooltip title={wyzeV4Config.controls.ptzControls.tiltUp}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('tilt_up')}>
                <ArrowUpward />
              </IconButton>
            </Tooltip>
            <Box />
            
            <Tooltip title={wyzeV4Config.controls.ptzControls.panLeft}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('pan_left')}>
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Tooltip title={wyzeV4Config.controls.ptzControls.centerView}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('center')}>
                <CenterFocusStrong />
              </IconButton>
            </Tooltip>
            <Tooltip title={wyzeV4Config.controls.ptzControls.panRight}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('pan_right')}>
                <ArrowForward />
              </IconButton>
            </Tooltip>
            
            <Box />
            <Tooltip title={wyzeV4Config.controls.ptzControls.tiltDown}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('tilt_down')}>
                <ArrowDownward />
              </IconButton>
            </Tooltip>
            <Box />
          </Box>

          {/* Zoom Controls */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={wyzeV4Config.controls.ptzControls.zoomOut}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('zoom_out')}>
                <ZoomOut />
              </IconButton>
            </Tooltip>
            <Box sx={styles.sliderContainer}>
              <Slider
                value={zoom}
                onChange={(_, value) => {
                  setZoom(value as number);
                  handlePTZControl('zoom', value as number);
                }}
                min={1}
                max={4}
                step={0.1}
                size="small"
              />
            </Box>
            <Tooltip title={wyzeV4Config.controls.ptzControls.zoomIn}>
              <IconButton sx={styles.controlButton} onClick={() => handlePTZControl('zoom_in')}>
                <ZoomIn />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Preset Controls */}
          <Stack spacing={1}>
            <Typography variant="body2">Presets</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {presets.map((preset) => (
                <Chip
                  key={preset.id}
                  label={preset.name}
                  onClick={() => handlePreset(preset)}
                  sx={{
                    ...styles.presetChip,
                    ...(selectedPreset === preset.id && { 
                      backgroundColor: brandConfig.colors.stableMahogany, 
                      color: brandConfig.colors.arenaSand 
                    })
                  }}
                />
              ))}
              <Tooltip title={wyzeV4Config.controls.ptzControls.savePreset}>
                <IconButton 
                  size="small" 
                  onClick={() => setShowPresetDialog(true)}
                  sx={styles.controlButton}
                >
                  <BookmarkAdd />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    );
  };

  // Render advanced controls
  const renderAdvancedControls = () => (
    <Box sx={styles.controlGroup}>
      <Typography variant="subtitle2" gutterBottom>
        Advanced Settings
      </Typography>
      <Stack spacing={2}>
        {/* Video Settings */}
        <Stack spacing={1}>
          <Typography variant="body2">Video</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={nightVision}
                  onChange={(e) => {
                    setNightVision(e.target.checked);
                    handleSettingsUpdate({ 
                      video: { ...camera?.settings.video, nightVisionMode: e.target.checked ? 'on' : 'off' } 
                    });
                  }}
                  size="small"
                />
              }
              label="Night Vision"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={spotlight}
                  onChange={(e) => setSpotlight(e.target.checked)}
                  size="small"
                />
              }
              label="Spotlight"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  size="small"
                />
              }
              label="Grid"
            />
          </Stack>
        </Stack>

        {/* Image Adjustments */}
        <Stack spacing={1}>
          <Typography variant="body2">Image</Typography>
          <Box>
            <Typography variant="caption">Brightness: {brightness}%</Typography>
            <Slider
              value={brightness}
              onChange={(_, value) => setBrightness(value as number)}
              min={0}
              max={200}
              size="small"
              sx={styles.sliderContainer}
            />
          </Box>
          <Box>
            <Typography variant="caption">Contrast: {contrast}%</Typography>
            <Slider
              value={contrast}
              onChange={(_, value) => setContrast(value as number)}
              min={0}
              max={200}
              size="small"
              sx={styles.sliderContainer}
            />
          </Box>
        </Stack>

        {/* Detection Settings */}
        <Stack spacing={1}>
          <Typography variant="body2">Detection</Typography>
          <Box>
            <Typography variant="caption">Motion Sensitivity: {detectionSensitivity}%</Typography>
            <Slider
              value={detectionSensitivity}
              onChange={(_, value) => {
                setDetectionSensitivity(value as number);
                handleSettingsUpdate({
                  detection: {
                    ...camera?.settings?.detection,
                    motion: { ...camera?.settings?.detection?.motion, sensitivity: value as number }
                  }
                });
              }}
              min={0}
              max={100}
              size="small"
              sx={styles.sliderContainer}
            />
          </Box>
        </Stack>

        {/* Recording Quality */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Quality</InputLabel>
          <Select
            value={recordingQuality}
            onChange={(e) => setRecordingQuality(e.target.value)}
            label="Quality"
          >
            <MenuItem value="HD">HD (720p)</MenuItem>
            <MenuItem value="FHD">Full HD (1080p)</MenuItem>
            <MenuItem value="2K">2K (1440p)</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );

  // Render control tabs
  const renderControlTabs = () => (
    <Box sx={styles.tabContainer}>
      <ToggleButtonGroup
        value={currentTab}
        exclusive
        onChange={(_, value) => value && setCurrentTab(value)}
        size="small"
      >
        <ToggleButton value="basic">Basic</ToggleButton>
        {camera?.capabilities.ptz && <ToggleButton value="ptz">PTZ</ToggleButton>}
        <ToggleButton value="advanced">Advanced</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      {!isMobile && position !== 'overlay' && renderControlTabs()}
      
      {currentTab === 'basic' && renderBasicControls()}
      {currentTab === 'ptz' && renderPTZControls()}
      {currentTab === 'advanced' && renderAdvancedControls()}

      {isMobile && (
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          {renderPTZControls()}
        </Box>
      )}

      {/* Preset Save Dialog */}
      <Dialog open={showPresetDialog} onClose={() => setShowPresetDialog(false)}>
        <DialogTitle>Save Camera Preset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Preset Name"
            fullWidth
            variant="outlined"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPresetDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePreset} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
