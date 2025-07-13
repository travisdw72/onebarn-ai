import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Grid,
  Stack,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Toolbar,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  GridView,
  ViewList,
  Fullscreen,
  FullscreenExit,
  Settings,
  Refresh,
  Add,
  Error,
  CheckCircle,
  Warning,
  PlayArrow,
  Pause,
  Stop,
  CameraEnhance,
  DeviceHub,
  SignalCellularAlt,
  WifiOff,
  BatteryAlert,
  Close,
  Menu,
  MoreVert
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { wyzeV4Config } from '../../config/wyzeV4Config';
import { WyzeV4Service } from '../../services/wyzeV4Service';
import type { 
  IWyzeV4Camera, 
  IWyzeV4Stream, 
  IWyzeV4Alert,
  IWyzeV4DashboardProps 
} from '../../interfaces/config/wyzeV4Config.interface';

export const WyzeV4Dashboard: React.FC<IWyzeV4DashboardProps> = ({
  tenantId,
  cameras: propCameras = [],
  selectedCamera,
  viewMode = 'grid',
  showControls = true,
  autoRefresh = true,
  refreshInterval = 30000,
  onCameraAdded,
  onCameraRemoved,
  onStreamStarted,
  onStreamStopped,
  onAlert,
  onError
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State management
  const [cameras, setCameras] = useState<IWyzeV4Camera[]>(propCameras);
  const [streams, setStreams] = useState<Map<string, IWyzeV4Stream>>(new Map());
  const [selectedCameraId, setSelectedCameraId] = useState<string>(selectedCamera || '');
  const [currentViewMode, setCurrentViewMode] = useState<'single' | 'grid' | 'list'>(viewMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<IWyzeV4Alert[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showAddCamera, setShowAddCamera] = useState<boolean>(false);
  const [bridgeStatus, setBridgeStatus] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Refs
  const serviceRef = useRef<WyzeV4Service | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Styles following brandConfig patterns
  const styles = {
    container: {
      padding: isMobile ? brandConfig.spacing.md : brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.background,
      minHeight: '100vh',
      position: 'relative'
    },
    appBar: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      boxShadow: brandConfig.layout.boxShadow
    },
    mainContent: {
      marginTop: isMobile ? brandConfig.spacing.lg : brandConfig.spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      gap: brandConfig.spacing.md
    },
    statusBar: {
      backgroundColor: isConnected ? brandConfig.colors.successGreen : brandConfig.colors.errorRed,
      color: brandConfig.colors.barnWhite,
      padding: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: brandConfig.spacing.md
    },
    cameraGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? 'repeat(1, 1fr)' 
        : isTablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: brandConfig.spacing.md,
      width: '100%'
    },
    cameraCard: {
      backgroundColor: brandConfig.colors.surface,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      overflow: 'hidden',
      transition: brandConfig.animations.transitions.smooth,
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
      height: isMobile ? '250px' : '300px',
      backgroundColor: brandConfig.colors.midnightBlack,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    streamVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const
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
    cameraInfo: {
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.surface
    },
    cameraName: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xs
    },
    cameraStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
      marginBottom: brandConfig.spacing.sm
    },
    statusChip: {
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightMedium
    },
    fab: {
      position: 'fixed',
      bottom: brandConfig.spacing.lg,
      right: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      '&:hover': {
        backgroundColor: brandConfig.colors.chestnutGlow
      }
    },
    drawer: {
      '& .MuiDrawer-paper': {
        backgroundColor: brandConfig.colors.surface,
        color: brandConfig.colors.text,
        width: isMobile ? '100vw' : '300px'
      }
    },
    noDataPlaceholder: {
      textAlign: 'center',
      padding: brandConfig.spacing.xl,
      color: brandConfig.colors.textSecondary
    },
    errorCard: {
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.barnWhite,
      marginBottom: brandConfig.spacing.md
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }
  };

  // Initialize service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        serviceRef.current = new WyzeV4Service(tenantId);
        
        // Set up event listeners
        serviceRef.current.on('bridgeConnected', () => {
          setIsConnected(true);
          setError(null);
          showSnackbar(wyzeV4Config.messages.connection.bridgeReady);
        });
        
        serviceRef.current.on('bridgeDisconnected', () => {
          setIsConnected(false);
          setError(wyzeV4Config.messages.connection.bridgeNotRunning);
        });
        
        serviceRef.current.on('error', (errorMessage: string) => {
          setError(errorMessage);
          onError?.(errorMessage);
          showSnackbar(errorMessage);
        });
        
        serviceRef.current.on('alert', (alert: IWyzeV4Alert) => {
          setAlerts(prev => [alert, ...prev.slice(0, 9)]);
          onAlert?.(alert);
        });

        // Check bridge status
        const healthCheck = await serviceRef.current.checkBridgeHealth();
        setBridgeStatus(healthCheck.data);
        
        if (healthCheck.success) {
          await discoverCameras();
        }
      } catch (error: any) {
        console.error('Failed to initialize Wyze V4 service:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();

    // Cleanup
    return () => {
      if (serviceRef.current) {
        serviceRef.current.destroy();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [tenantId]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        refreshCameras();
      }, refreshInterval);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval]);

  // Discover cameras
  const discoverCameras = async () => {
    if (!serviceRef.current) return;

    try {
      setIsLoading(true);
      const result = await serviceRef.current.discoverCameras();
      
      if (result.success && result.data) {
        setCameras(result.data);
        
        // Auto-select first camera if none selected
        if (!selectedCameraId && result.data.length > 0) {
          setSelectedCameraId(result.data[0].id);
        }
      } else {
        setError(result.error || wyzeV4Config.messages.connection.cameraNotFound);
      }
    } catch (error: any) {
      console.error('Camera discovery failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh cameras
  const refreshCameras = async () => {
    if (!serviceRef.current) return;

    try {
      await serviceRef.current.checkBridgeHealth();
      await discoverCameras();
    } catch (error: any) {
      console.error('Refresh failed:', error);
    }
  };

  // Handle camera selection
  const handleCameraSelect = (cameraId: string) => {
    setSelectedCameraId(cameraId);
    if (isMobile) {
      setCurrentViewMode('single');
    }
  };

  // Handle stream start
  const handleStreamStart = async (cameraId: string) => {
    if (!serviceRef.current) return;

    try {
      const result = await serviceRef.current.startStream(cameraId);
      
      if (result.success && result.data) {
        setStreams(prev => {
          const newMap = new Map(prev);
          newMap.set(cameraId, result.data!);
          return newMap;
        });
        onStreamStarted?.(result.data);
        showSnackbar(wyzeV4Config.messages.streaming.streamActive);
      } else {
        setError(result.error || wyzeV4Config.messages.streaming.streamError);
      }
    } catch (error: any) {
      console.error('Stream start failed:', error);
      setError(error.message);
    }
  };

  // Handle stream stop
  const handleStreamStop = async (cameraId: string) => {
    if (!serviceRef.current) return;

    try {
      const stream = streams.get(cameraId);
      if (stream) {
        const result = await serviceRef.current.stopStream(stream.streamId);
        
        if (result.success) {
          setStreams(prev => {
            const newMap = new Map(prev);
            newMap.delete(cameraId);
            return newMap;
          });
          onStreamStopped?.(stream.streamId);
          showSnackbar(wyzeV4Config.messages.streaming.streamStopped);
        }
      }
    } catch (error: any) {
      console.error('Stream stop failed:', error);
      setError(error.message);
    }
  };

  // Show snackbar
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Render camera card
  const renderCameraCard = (camera: IWyzeV4Camera) => {
    const stream = streams.get(camera.id);
    const isSelected = selectedCameraId === camera.id;
    const isStreaming = stream?.isActive || false;

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
          {isStreaming && stream?.url ? (
            <video
              src={stream.url}
              style={styles.streamVideo}
              autoPlay
              muted
              playsInline
            />
          ) : (
            <Stack alignItems="center" spacing={2}>
              <Videocam sx={{ fontSize: '3rem', color: brandConfig.colors.neutralGray }} />
              <Typography variant="body2" color="textSecondary">
                {camera.status === 'online' ? 'Ready to stream' : 'Camera offline'}
              </Typography>
            </Stack>
          )}
          
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
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle fullscreen
                }}
                sx={{ color: brandConfig.colors.arenaSand }}
              >
                <Fullscreen />
              </IconButton>
            </Stack>
          </Box>
        </Box>
        
        <Box sx={styles.cameraInfo}>
          <Typography sx={styles.cameraName}>{camera.name}</Typography>
          <Box sx={styles.cameraStatus}>
            <Chip
              icon={camera.status === 'online' ? <CheckCircle /> : <Error />}
              label={camera.status.toUpperCase()}
              size="small"
              color={camera.status === 'online' ? 'success' : 'error'}
              sx={styles.statusChip}
            />
            {isStreaming && (
              <Chip
                icon={<SignalCellularAlt />}
                label="LIVE"
                size="small"
                color="primary"
                sx={styles.statusChip}
              />
            )}
          </Box>
          <Typography variant="body2" color="textSecondary">
            {camera.model} • {camera.settings.resolution}
          </Typography>
        </Box>
      </Card>
    );
  };

  // Render main content
  const renderMainContent = () => {
    if (isLoading) {
      return (
        <Box sx={styles.loadingOverlay}>
          <Stack alignItems="center" spacing={2}>
            <CircularProgress size={48} sx={{ color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h6">
              {wyzeV4Config.messages.connection.connecting}
            </Typography>
          </Stack>
        </Box>
      );
    }

    if (cameras.length === 0) {
      return (
        <Box sx={styles.noDataPlaceholder}>
          <Stack alignItems="center" spacing={3}>
            <DeviceHub sx={{ fontSize: '4rem', color: brandConfig.colors.neutralGray }} />
            <Typography variant="h5" color="textSecondary">
              {wyzeV4Config.messages.general.noCamerasFound}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {wyzeV4Config.messages.general.addCameraPrompt}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddCamera(true)}
              sx={{
                backgroundColor: brandConfig.colors.stableMahogany,
                color: brandConfig.colors.arenaSand
              }}
            >
              {wyzeV4Config.controls.connection.connect}
            </Button>
          </Stack>
        </Box>
      );
    }

    return (
      <Box sx={styles.cameraGrid}>
        {cameras.map(renderCameraCard)}
      </Box>
    );
  };

  return (
    <Box sx={styles.container}>
      {/* App Bar */}
      <AppBar position="fixed" sx={styles.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {wyzeV4Config.cameraInfo.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton color="inherit" onClick={refreshCameras}>
              <Refresh />
            </IconButton>
            <IconButton color="inherit" onClick={() => setShowSettings(true)}>
              <Settings />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Status Bar */}
      <Box sx={styles.statusBar}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {isConnected ? <CheckCircle /> : <WifiOff />}
          <Typography variant="body2">
            {isConnected ? 'Bridge Connected' : 'Bridge Disconnected'}
          </Typography>
        </Stack>
        <Typography variant="body2">
          {cameras.length} camera{cameras.length !== 1 ? 's' : ''} • {streams.size} active stream{streams.size !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        {renderMainContent()}
      </Box>

      {/* Floating Action Button */}
      <Fab
        sx={styles.fab}
        onClick={() => setShowAddCamera(true)}
      >
        <Add />
      </Fab>

      {/* Settings Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={styles.drawer}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6">Camera Settings</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
          {/* Add drawer content */}
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}; 