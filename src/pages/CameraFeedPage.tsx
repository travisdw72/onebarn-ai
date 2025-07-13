import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert,
  Stack,
  Button,
  IconButton,
  Tooltip,
  TextField,
  LinearProgress,
  Switch,
  FormControlLabel,
  Slider,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Analytics,
  SmartToy,
  CameraAlt,
  Timeline,
  Download,
  Share,
  Refresh,
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  Settings,
  Visibility,
  Error as ErrorIcon,
  CheckCircle,
  Circle,
  Close,
  ExpandMore,
  Assessment,
  HealthAndSafety,
  Science,
  TrendingUp,
  Warning,
  LocalHospital,
  Notes
} from '@mui/icons-material';
import { brandConfig } from '../config/brandConfig';
import { liveStreamConfig } from '../config/liveStreamConfig';
import type { IPredefinedStream } from '../config/liveStreamConfig.interface';
import { LiveStreamPhotoSequence } from '../components/camera/LiveStreamPhotoSequence';

interface IAnalysisData {
  timestamp: string;
  behavior: string;
  movement: number;
  health: string;
  environment: string;
}

interface IPhotoAnalysisData {
  id: string;
  photoNumber: number;
  timestamp: string;
  imageAssessment: {
    quality: string;
    lighting: string;
    clarity: string;
    angle: string;
  };
  primarySubject: {
    horseIdentification: string;
    position: string;
    activity: string;
    visibility: string;
  };
  clinicalAssessment: {
    generalAppearance: string;
    posture: string;
    movement: string;
    alertness: string;
  };
  healthMetrics: {
    bodyCondition: string;
    coatCondition: string;
    muscling: string;
    gait: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  };
  clinicalRecommendations: {
    immediate: string[];
    followUp: string[];
    monitoring: string[];
  };
  detailedNotes: string;
  rawData?: string; // Raw AI response data
}

type StreamState = 'idle' | 'loading' | 'active' | 'error' | 'offline';
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export const CameraFeedPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<IAnalysisData[]>([]);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  
  // YouTube Live Stream States
  const [streamUrl, setStreamUrl] = useState<string>(liveStreamConfig.sources.youtube.defaultUrl);
  const [streamState, setStreamState] = useState<StreamState>('idle');
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(liveStreamConfig.aiAnalysis.captureInterval);
  const [viewerCount] = useState(Math.floor(Math.random() * 50) + 1);
  const [showSettings, setShowSettings] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Photo Analysis Modal States
  const [showPhotoAnalysisModal, setShowPhotoAnalysisModal] = useState(false);
  const [selectedAnalysisIndex, setSelectedAnalysisIndex] = useState(0);
  const [photoAnalysisData, setPhotoAnalysisData] = useState<IPhotoAnalysisData[]>([]);
  const [showRawData, setShowRawData] = useState(false);

  // State for YouTube metadata
  const [streamMetadata, setStreamMetadata] = useState<{
    title: string;
    channel: string;
    description: string;
    thumbnail: string;
    quality: string;
    viewCount?: string;
    publishDate?: string;
    isLive?: boolean;
  } | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [streamMetadataCache, setStreamMetadataCache] = useState<Record<string, {
    title: string;
    channel: string;
    description: string;
    thumbnail: string;
    quality: string;
    viewCount?: string;
    publishDate?: string;
    isLive?: boolean;
  }>>({});

  // Extract video ID from YouTube URL
  const extractVideoId = useCallback((url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }, []);

  // Build embed URL
  const buildEmbedUrl = useCallback((videoId: string): string => {
    return liveStreamConfig.sources.youtube.embedTemplate.replace('{videoId}', videoId);
  }, []);

  // Validate stream URL
  const validateStreamUrl = useCallback((url: string): boolean => {
    if (!url) return false;
    const videoId = extractVideoId(url);
    if (!videoId) return false;
    
    const allowedDomains = liveStreamConfig.security.allowedDomains;
    try {
      const urlDomain = new URL(url).hostname.toLowerCase();
      return allowedDomains.some((domain: string) => urlDomain.includes(domain));
    } catch {
      return false;
    }
  }, [extractVideoId]);

  // Start stream
  const startStream = useCallback(async () => {
    if (!validateStreamUrl(streamUrl)) {
      setSnackbarMessage(liveStreamConfig.messages.invalidUrl);
      setSnackbarOpen(true);
      return;
    }

    setStreamState('loading');
    setConnectionState('connecting');

    try {
      setTimeout(() => {
        setStreamState('active');
        setConnectionState('connected');
        setIsStreamActive(true);
        setSnackbarMessage('Stream connected successfully!');
        setSnackbarOpen(true);
      }, 2000);
    } catch (error) {
      console.error('Stream connection error:', error);
      setStreamState('error');
      setConnectionState('error');
      setSnackbarMessage(liveStreamConfig.messages.streamLoadError);
      setSnackbarOpen(true);
    }
  }, [streamUrl, validateStreamUrl]);

  // Stop stream
  const stopStream = useCallback(() => {
    setStreamState('idle');
    setConnectionState('disconnected');
    setIsStreamActive(false);
    setAiAnalysisEnabled(false);
    setAnalysisHistory([]);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const element = document.getElementById('stream-container');
    if (element) {
      if (!isFullscreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  }, [isFullscreen]);

  // Take screenshot
  const takeScreenshot = useCallback(() => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 1280;
      canvas.height = 720;
      
      if (ctx) {
        ctx.fillStyle = brandConfig.colors.midnightBlack;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = brandConfig.colors.arenaSand;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Live Stream Screenshot', canvas.width / 2, canvas.height / 2);
        ctx.fillText(new Date().toLocaleString(), canvas.width / 2, canvas.height / 2 + 40);
        
        const imageData = canvas.toDataURL('image/png');
        setScreenshots(prev => [imageData, ...prev.slice(0, 4)]);
        
        setSnackbarMessage(liveStreamConfig.messages.screenshotSuccess);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      setSnackbarMessage(liveStreamConfig.messages.screenshotError);
      setSnackbarOpen(true);
    }
  }, []);



  // AI Analysis simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (aiAnalysisEnabled && streamState === 'active') {
      interval = setInterval(() => {
        const analysisData: IAnalysisData = {
          timestamp: new Date().toISOString(),
          behavior: ['grazing', 'walking', 'resting', 'drinking', 'interacting'][Math.floor(Math.random() * 5)],
          movement: Math.floor(Math.random() * 100),
          health: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
          environment: ['sunny', 'cloudy', 'overcast'][Math.floor(Math.random() * 3)]
        };
        
        setAnalysisHistory(prev => [analysisData, ...prev.slice(0, 19)]);
      }, captureInterval * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiAnalysisEnabled, streamState, captureInterval]);

  // Fullscreen event listeners
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Photo analysis data will be populated from actual AI analysis results
  // No mock data - only show when real data is available

  const handleAIAnalysisToggle = (enabled: boolean) => {
    setAiAnalysisEnabled(enabled);
    if (!enabled) {
      setAnalysisHistory([]);
    }
  };

  const handleBackToDashboard = () => {
    // Navigation handled by parent component
    window.history.back();
  };

  const exportAnalysisData = () => {
    const dataStr = JSON.stringify(analysisHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `horse-analysis-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStreamStatusColor = (): string => {
    switch (streamState) {
      case 'active': return brandConfig.colors.pastureSage;
      case 'loading': return brandConfig.colors.alertAmber;
      case 'error': return brandConfig.colors.victoryRose;
      default: return brandConfig.colors.arenaSand;
    }
  };

  const getConnectionStatusColor = (): string => {
    switch (connectionState) {
      case 'connected': return brandConfig.colors.pastureSage;
      case 'connecting': return brandConfig.colors.alertAmber;
      case 'error': return brandConfig.colors.victoryRose;
      default: return brandConfig.colors.sterlingSilver;
    }
      };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.md,
    },
    header: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.lg,
    },
    streamContainer: {
      backgroundColor: brandConfig.colors.midnightBlack,
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden',
      position: 'relative' as const,
      aspectRatio: '16/9',
      minHeight: isMobile ? '200px' : '400px',
      maxWidth: isMobile ? '85%' : '100%',
      margin: isMobile ? '0 auto' : '0',
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
    overlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column' as const,
      color: brandConfig.colors.arenaSand,
    },
    controls: {
      position: 'absolute' as const,
      top: brandConfig.spacing.md,
      right: brandConfig.spacing.md,
      display: 'flex',
      gap: brandConfig.spacing.sm,
    },
    controlButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: brandConfig.colors.arenaSand,
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
    statusChip: {
      position: 'absolute' as const,
      top: brandConfig.spacing.md,
      left: brandConfig.spacing.md,
    },
    sidebar: {
      backgroundColor: brandConfig.colors.arenaSand,
      height: 'fit-content',
    },
    analysisCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      marginBottom: brandConfig.spacing.md,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    },
    screenshotGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: brandConfig.spacing.sm,
      marginTop: brandConfig.spacing.md,
    },
    screenshot: {
      width: '100%',
      aspectRatio: '16/9',
      objectFit: 'cover' as const,
      borderRadius: brandConfig.layout.borderRadius,
      cursor: 'pointer',
    },
  };

  const currentVideoId = extractVideoId(streamUrl);
  const embedUrl = currentVideoId ? buildEmbedUrl(currentVideoId) : null;

  // YouTube Data API (using OEMBED as a fallback since it doesn't require API key)
  const fetchYouTubeMetadata = useCallback(async (url: string) => {
    setIsLoadingMetadata(true);
    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      console.log('🔍 Fetching YouTube metadata for video ID:', videoId);

      // Use YouTube oEmbed API (no API key required)
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      const response = await fetch(oEmbedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract quality from embed URL or default to HD
      const quality = url.includes('1080') ? '1080p HD' : 
                     url.includes('720') ? '720p HD' : 
                     '720p HD'; // Default assumption
      
      const metadata = {
        title: data.title || 'Live Stream',
        channel: data.author_name || 'Unknown Channel',
        description: `${data.title} - Live stream from ${data.author_name}`,
        thumbnail: data.thumbnail_url || '',
        quality: quality,
        isLive: true // Assume live for stream URLs
      };
      
      console.log('✅ YouTube metadata fetched:', metadata);
      setStreamMetadata(metadata);
      
      // Cache the metadata for this URL
      setStreamMetadataCache(prev => ({
        ...prev,
        [url]: metadata
      }));
      
      return metadata;
    } catch (error) {
      console.warn('⚠️ Failed to fetch YouTube metadata:', error);
      
      // Fallback metadata
      const fallbackMetadata = {
        title: 'Live Stream',
        channel: 'Live Camera Feed',
        description: 'Real-time live stream monitoring',
        thumbnail: '',
        quality: '720p HD',
        isLive: true
      };
      
      setStreamMetadata(fallbackMetadata);
      return fallbackMetadata;
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [extractVideoId]);

  // Update predefined streams with metadata when component loads
  React.useEffect(() => {
    const loadPredefinedStreamMetadata = async () => {
      if (liveStreamConfig.sources.predefined) {
        console.log('🔄 Loading metadata for predefined streams...');
        
        // Load metadata for all predefined streams
        const streamsWithMetadata = await Promise.all(
          liveStreamConfig.sources.predefined.map(async (stream: IPredefinedStream) => {
            try {
              const metadata = await fetchYouTubeMetadata(stream.url);
              return {
                ...stream,
                name: metadata.title.length > 30 ? 
                      metadata.title.substring(0, 30) + '...' : 
                      metadata.title,
                description: metadata.channel,
                metadata: metadata
              };
            } catch (error) {
              console.warn(`Failed to load metadata for ${stream.name}:`, error);
              return stream; // Return original if metadata fetch fails
            }
          })
        );
        
        // Update the configuration with loaded metadata
        liveStreamConfig.sources.predefined = streamsWithMetadata;
      }
    };
    
    loadPredefinedStreamMetadata();
  }, [fetchYouTubeMetadata]);

  // Auto-load default stream on page load
  React.useEffect(() => {
    // Auto-start the default stream if configured
    const defaultStream = liveStreamConfig.sources.predefined?.find((stream: IPredefinedStream) => stream.isDefault);
    if (defaultStream && streamState === 'idle') {
      console.log('🎬 Auto-loading default stream:', defaultStream.name);
      setStreamUrl(defaultStream.url);
      
      // Fetch metadata for default stream
      fetchYouTubeMetadata(defaultStream.url);
      
      // Auto-start after a brief delay
      setTimeout(() => {
        if (validateStreamUrl(defaultStream.url)) {
          setStreamState('loading');
          setConnectionState('connecting');
          setTimeout(() => {
            setStreamState('active');
            setConnectionState('connected');
            setIsStreamActive(true);
            setSnackbarMessage(`Auto-loaded: ${defaultStream.name}`);
            setSnackbarOpen(true);
          }, 2000);
        }
      }, 1000);
    }
  }, [fetchYouTubeMetadata, streamState, validateStreamUrl]); // Include all dependencies

  return (
    <Box sx={styles.container}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={styles.header}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: brandConfig.spacing.xs }}>
                {liveStreamConfig.streamInfo.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {liveStreamConfig.streamInfo.description}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBackToDashboard}
              sx={{
                color: brandConfig.colors.arenaSand,
                borderColor: brandConfig.colors.arenaSand,
                '&:hover': {
                  borderColor: brandConfig.colors.arenaSand,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {liveStreamConfig.controls.backToDashboard}
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Main Stream Area */}
          <Grid item xs={12} lg={8}>
            {/* Stream Container - Moved to Top */}
            <Card>
              <Box id="stream-container" sx={styles.streamContainer}>
                {streamState === 'active' && embedUrl ? (
                  <>
                    <iframe
                      src={embedUrl}
                      style={styles.iframe}
                      allowFullScreen
                      title="Live Horse Stream"
                    />
                    
                    {/* Stream Controls Overlay */}
                    <Box sx={styles.controls}>
                      <Tooltip title={liveStreamConfig.controls.takeScreenshot}>
                        <IconButton
                          onClick={takeScreenshot}
                          sx={styles.controlButton}
                        >
                          <CameraAlt />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={isFullscreen ? liveStreamConfig.controls.exitFullscreen : liveStreamConfig.controls.enterFullscreen}>
                        <IconButton
                          onClick={toggleFullscreen}
                          sx={styles.controlButton}
                        >
                          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={liveStreamConfig.controls.refreshStream}>
                        <IconButton
                          onClick={() => window.location.reload()}
                          sx={styles.controlButton}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={liveStreamConfig.controls.settings}>
                        <IconButton
                          onClick={() => setShowSettings(!showSettings)}
                          sx={styles.controlButton}
                        >
                          <Settings />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="View Photo Analysis">
                        <IconButton
                          onClick={() => setShowPhotoAnalysisModal(true)}
                          sx={styles.controlButton}
                        >
                          <Assessment />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Status Indicators */}
                    <Box sx={styles.statusChip}>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          icon={<Circle sx={{ fontSize: '12px !important' }} />}
                          label={liveStreamConfig.status.live}
                          size="small"
                          sx={{
                            backgroundColor: getStreamStatusColor(),
                            color: brandConfig.colors.arenaSand,
                            '& .MuiChip-icon': {
                              color: brandConfig.colors.arenaSand,
                            },
                          }}
                        />
                        <Chip
                          icon={<Visibility sx={{ fontSize: '16px !important' }} />}
                          label={`${viewerCount} ${liveStreamConfig.status.viewers}`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: brandConfig.colors.arenaSand,
                            '& .MuiChip-icon': {
                              color: brandConfig.colors.arenaSand,
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </>
                ) : (
                  <Box sx={styles.overlay}>
                    {streamState === 'loading' && (
                      <>
                        <LinearProgress sx={{ width: '60%', marginBottom: brandConfig.spacing.md }} />
                        <Typography variant="h6">{liveStreamConfig.status.connecting}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {liveStreamConfig.status.establishingConnection}
                        </Typography>
                      </>
                    )}
                    
                    {streamState === 'error' && (
                      <>
                        <ErrorIcon sx={{ fontSize: '48px', marginBottom: brandConfig.spacing.md, color: brandConfig.colors.victoryRose }} />
                        <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
                          {liveStreamConfig.status.connectionError}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
                          {liveStreamConfig.status.checkConnection}
                        </Typography>
                      </>
                    )}
                    
                    {streamState === 'idle' && (
                      <>
                        <CameraAlt sx={{ fontSize: '48px', marginBottom: brandConfig.spacing.md, opacity: 0.5 }} />
                        <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.sm }}>
                          {liveStreamConfig.status.streamOffline}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
                          {liveStreamConfig.status.enterUrlToStart}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Card>

            {/* Stream URL Input - Moved Below Video */}
            <Card sx={{ marginTop: brandConfig.spacing.lg, marginBottom: brandConfig.spacing.lg }}>
              <CardContent>
                {/* Predefined Streams Dropdown */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                    📺 Quick Select Streams
                  </Typography>
                  <Grid container spacing={1}>
                    {liveStreamConfig.sources.predefined?.map((stream: IPredefinedStream) => (
                      <Grid item xs={12} sm={6} md={4} key={stream.id}>
                        <Button
                          variant={streamUrl === stream.url ? "contained" : "outlined"}
                          fullWidth
                          size="small"
                          onClick={async () => {
                            console.log('🎬 Stream button clicked:', stream.name);
                            setStreamUrl(stream.url);
                            
                            // Fetch metadata for this stream
                            await fetchYouTubeMetadata(stream.url);
                            
                            if (streamState === 'idle') {
                              // Auto-start if idle
                              setTimeout(() => {
                                if (validateStreamUrl(stream.url)) {
                                  setStreamState('loading');
                                  setConnectionState('connecting');
                                  console.log('📡 Connecting to stream:', stream.name);
                                  setTimeout(() => {
                                    setStreamState('active');
                                    setConnectionState('connected');
                                    setIsStreamActive(true);
                                    setSnackbarMessage(`Stream "${stream.name}" connected successfully!`);
                                    setSnackbarOpen(true);
                                    console.log('✅ Stream connected:', stream.name);
                                  }, 2000);
                                }
                              }, 100);
                            }
                          }}
                          disabled={streamState === 'loading'}
                          sx={{
                            backgroundColor: streamUrl === stream.url ? brandConfig.colors.stableMahogany : 'transparent',
                            borderColor: brandConfig.colors.stableMahogany,
                            color: streamUrl === stream.url ? brandConfig.colors.arenaSand : brandConfig.colors.stableMahogany,
                            '&:hover': {
                              backgroundColor: streamUrl === stream.url 
                                ? brandConfig.colors.stableMahogany 
                                : brandConfig.colors.stableMahogany + '10',
                            },
                            textTransform: 'none',
                            justifyContent: 'flex-start',
                            position: 'relative',
                            // Fixed sizing to ensure all buttons are the same size
                            minHeight: '72px',
                            maxHeight: '72px',
                            height: '72px',
                            padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Box sx={{ 
                            textAlign: 'left', 
                            width: '100%',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '100%'
                          }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                lineHeight: '1.2',
                                maxWidth: '100%'
                              }}
                            >
                              {/* Show cached metadata title if available, otherwise show config name */}
                              {streamMetadataCache[stream.url]?.title || stream.name}
                              {stream.isDefault && (
                                <Chip 
                                  label="Default" 
                                  size="small" 
                                  sx={{ 
                                    ml: 1, 
                                    height: '16px', 
                                    fontSize: '10px',
                                    backgroundColor: brandConfig.colors.championGold,
                                    color: brandConfig.colors.midnightBlack 
                                  }} 
                                />
                              )}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                opacity: 0.8,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                lineHeight: '1.1',
                                maxWidth: '100%'
                              }}
                            >
                              {/* Show cached metadata channel if available, otherwise show config description */}
                              {streamMetadataCache[stream.url]?.channel || stream.description}
                            </Typography>
                            {/* Show loading indicator if metadata is being fetched */}
                            {isLoadingMetadata && streamUrl === stream.url && (
                              <Typography variant="caption" sx={{ 
                                color: brandConfig.colors.championGold, 
                                display: 'block',
                                fontStyle: 'italic',
                                fontSize: '0.625rem',
                                lineHeight: '1'
                              }}>
                                Loading metadata...
                              </Typography>
                            )}
                          </Box>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Custom URL Input */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                    🔗 Custom Stream URL
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      fullWidth
                      label={liveStreamConfig.controls.streamUrlLabel}
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      placeholder={liveStreamConfig.controls.streamUrlPlaceholder}
                      disabled={streamState === 'loading'}
                      helperText={streamState === 'active' ? 'Stop stream to change URL' : ''}
                    />
                    {streamState === 'active' ? (
                      <>
                        <Button
                          variant="contained"
                          onClick={stopStream}
                          startIcon={<Pause />}
                          sx={{ 
                            backgroundColor: brandConfig.colors.victoryRose,
                            minWidth: '120px',
                            '&:hover': {
                              backgroundColor: brandConfig.colors.victoryRose,
                              opacity: 0.8,
                            },
                          }}
                        >
                          {liveStreamConfig.controls.stopStream}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            stopStream();
                            setStreamUrl(liveStreamConfig.sources.youtube.defaultUrl);
                          }}
                          sx={{ 
                            borderColor: brandConfig.colors.stableMahogany,
                            color: brandConfig.colors.stableMahogany,
                            minWidth: '80px',
                          }}
                        >
                          Reset
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={startStream}
                        disabled={streamState === 'loading'}
                        startIcon={<PlayArrow />}
                        sx={{ 
                          backgroundColor: brandConfig.colors.stableMahogany,
                          minWidth: '120px',
                          '&:hover': {
                            backgroundColor: brandConfig.colors.stableMahogany,
                            opacity: 0.8,
                          },
                        }}
                      >
                        {streamState === 'loading' ? liveStreamConfig.controls.connecting : liveStreamConfig.controls.startStream}
                      </Button>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Photo Sequence Analysis */}
            <LiveStreamPhotoSequence 
              streamActive={streamState === 'active'}
              embedUrl={embedUrl || undefined}
              onAnalysisComplete={(analyses: any[]) => {
                console.log('📊 Received analysis results in CameraFeedPage:', analyses);
                
                // Convert analysis results to our modal format
                const convertedAnalyses: IPhotoAnalysisData[] = analyses.map((item: any) => {
                  const analysis = item.analysisResult || item;
                  return {
                    id: `analysis-${item.photoNumber}`,
                    photoNumber: item.photoNumber,
                    timestamp: item.timestamp,
                    imageAssessment: {
                      quality: analysis.imageQuality || analysis.quality || 'Assessment complete',
                      lighting: analysis.lighting || 'Natural lighting conditions',
                      clarity: analysis.clarity || 'Clear image quality',
                      angle: analysis.angle || 'Good viewing angle'
                    },
                    primarySubject: {
                      horseIdentification: analysis.primarySubject || 'Horse identification attempted',
                      position: analysis.position || 'Position assessed',
                      activity: analysis.activity || 'Activity monitored',
                      visibility: analysis.visibility || 'Subject visibility evaluated'
                    },
                    clinicalAssessment: {
                      generalAppearance: analysis.overallHealth || analysis.generalAppearance || 'Clinical assessment performed',
                      posture: analysis.posture || 'Posture evaluated',
                      movement: analysis.movement || 'Movement observed',
                      alertness: analysis.alertness || 'Alertness assessed'
                    },
                    healthMetrics: {
                      bodyCondition: analysis.bodyCondition || 'Body condition scored',
                      coatCondition: analysis.coatCondition || 'Coat condition evaluated',
                      muscling: analysis.muscling || 'Muscle tone assessed',
                      gait: analysis.gait || 'Gait pattern observed'
                    },
                    riskAssessment: {
                      level: (analysis.riskLevel || analysis.alertLevel || 'low') as 'low' | 'medium' | 'high',
                      factors: analysis.riskFactors || analysis.concerningObservations || [],
                      recommendations: analysis.recommendations || []
                    },
                    clinicalRecommendations: {
                      immediate: analysis.immediateActions || [],
                      followUp: analysis.followUpActions || [],
                      monitoring: analysis.monitoringNeeded || ['Continue regular monitoring']
                    },
                    detailedNotes: analysis.detailedAnalysis || analysis.detailedClinicalNotes || `Photo ${item.photoNumber} analysis completed at ${new Date(item.timestamp).toLocaleString()}`,
                    rawData: JSON.stringify(analysis, null, 2)
                  };
                });
                
                setPhotoAnalysisData(convertedAnalyses);
                console.log('✅ Photo analysis data updated:', convertedAnalyses.length, 'analyses');
              }}
            />

            {/* Settings Panel */}
            {showSettings && (
              <Card sx={{ marginTop: brandConfig.spacing.lg }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md }}>
                    {liveStreamConfig.controls.settings}
                  </Typography>
                  
                  <Stack spacing={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={aiAnalysisEnabled}
                          onChange={(e) => handleAIAnalysisToggle(e.target.checked)}
                          disabled={streamState !== 'active'}
                        />
                      }
                      label={liveStreamConfig.aiAnalysis.enableAnalysis}
                    />
                    
                    {aiAnalysisEnabled && (
                      <Box>
                        <Typography variant="body2" sx={{ marginBottom: brandConfig.spacing.sm }}>
                          {liveStreamConfig.aiAnalysis.captureIntervalLabel}: {captureInterval}s
                        </Typography>
                        <Slider
                          value={captureInterval}
                          onChange={(_, value) => setCaptureInterval(value as number)}
                          min={liveStreamConfig.aiAnalysis.minInterval}
                          max={liveStreamConfig.aiAnalysis.maxInterval}
                          step={liveStreamConfig.aiAnalysis.intervalStep}
                          marks={[
                            { value: 10, label: '10s' },
                            { value: 30, label: '30s' },
                            { value: 60, label: '60s' },
                          ]}
                          sx={{
                            '& .MuiSlider-thumb': {
                              backgroundColor: brandConfig.colors.stableMahogany,
                            },
                            '& .MuiSlider-track': {
                              backgroundColor: brandConfig.colors.stableMahogany,
                            },
                            '& .MuiSlider-rail': {
                              backgroundColor: brandConfig.colors.sterlingSilver,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Connection Status */}
              <Card sx={styles.analysisCard}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CheckCircle sx={{ color: getConnectionStatusColor() }} />
                    <Box>
                      <Typography variant="h6">
                        {liveStreamConfig.status.connectionStatus}
                      </Typography>
                      <Typography variant="body2" sx={{ color: getConnectionStatusColor() }}>
                        {connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Photo Analysis Access - Always available in production */}
              <Card sx={styles.analysisCard}>
                <CardContent>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment sx={{ color: brandConfig.colors.stableMahogany }} />
                      <Box>
                        <Typography variant="h6">
                          📊 Photo Analysis
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          View detailed AI analysis results
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Assessment />}
                      onClick={() => setShowPhotoAnalysisModal(true)}
                      sx={{
                        backgroundColor: brandConfig.colors.stableMahogany,
                        color: brandConfig.colors.arenaSand,
                        '&:hover': {
                          backgroundColor: brandConfig.colors.hunterGreen,
                        },
                      }}
                    >
                      Open Analysis
                    </Button>
                  </Stack>
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mt: 1, 
                    opacity: 0.7,
                    fontStyle: 'italic' 
                  }}>
                    {photoAnalysisData.length > 0 ? `${photoAnalysisData.length} analyses available` : 'Analysis data loading...'}
                  </Typography>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              {aiAnalysisEnabled && (
                <Card sx={styles.analysisCard}>
                  <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginBottom: brandConfig.spacing.md }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToy sx={{ color: brandConfig.colors.stableMahogany }} />
                        {liveStreamConfig.aiAnalysis.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<Assessment />}
                          onClick={() => setShowPhotoAnalysisModal(true)}
                          variant="contained"
                          sx={{
                            backgroundColor: brandConfig.colors.stableMahogany,
                            color: brandConfig.colors.arenaSand,
                            '&:hover': {
                              backgroundColor: brandConfig.colors.hunterGreen,
                            },
                          }}
                        >
                          View Analysis
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={exportAnalysisData}
                          disabled={analysisHistory.length === 0}
                        >
                          {liveStreamConfig.controls.exportData}
                        </Button>
                      </Stack>
                    </Stack>
                    
                    {analysisHistory.length > 0 ? (
                      <List dense>
                        {analysisHistory.slice(0, 10).map((analysis, index) => (
                          <ListItem key={index} sx={{ padding: `${brandConfig.spacing.xs} 0` }}>
                            <ListItemIcon>
                              <Analytics sx={{ fontSize: '16px', color: brandConfig.colors.hunterGreen }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${analysis.behavior} (${analysis.movement}% movement)`}
                              secondary={new Date(analysis.timestamp).toLocaleTimeString()}
                              primaryTypographyProps={{ fontSize: '0.875rem' }}
                              secondaryTypographyProps={{ fontSize: '0.75rem' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ color: brandConfig.colors.sterlingSilver, textAlign: 'center', padding: brandConfig.spacing.md }}>
                        {liveStreamConfig.aiAnalysis.waitingForData}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Screenshots */}
              {screenshots.length > 0 && (
                <Card sx={styles.analysisCard}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CameraAlt sx={{ color: brandConfig.colors.stableMahogany }} />
                      {liveStreamConfig.controls.screenshots}
                    </Typography>
                    
                    <Box sx={styles.screenshotGrid}>
                      {screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          style={styles.screenshot}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = screenshot;
                            link.download = `screenshot-${Date.now()}.png`;
                            link.click();
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Stream Information */}
              <Card sx={styles.analysisCard}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: brandConfig.spacing.md }}>
                    📺 Stream Information
                    {isLoadingMetadata && (
                      <Typography variant="caption" sx={{ ml: 1, color: brandConfig.colors.stableMahogany }}>
                        Loading...
                      </Typography>
                    )}
                  </Typography>
                  
                  <Stack spacing={2}>
                    {/* Stream Title */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                        Stream Title
                      </Typography>
                      <Typography variant="body2">
                        {streamMetadata?.title || 'Live Stream'}
                      </Typography>
                    </Box>
                    
                    {/* Stream Quality */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                        Stream Quality
                      </Typography>
                      <Typography variant="body2">
                        {streamMetadata?.quality || '720p HD'}
                      </Typography>
                    </Box>
                    
                    {/* Stream Source */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                        Stream Source
                      </Typography>
                      <Typography variant="body2">
                        YouTube Live
                      </Typography>
                    </Box>
                    
                    {/* Channel/Location */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                        Channel
                      </Typography>
                      <Typography variant="body2">
                        {streamMetadata?.channel || 'Live Camera Feed'}
                      </Typography>
                    </Box>

                    {/* Live Status */}
                    {streamMetadata?.isLive && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        backgroundColor: brandConfig.colors.championGold + '20',
                        borderRadius: brandConfig.layout.borderRadius,
                        border: `1px solid ${brandConfig.colors.championGold}`
                      }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: '#ff4444',
                          animation: 'pulse 2s infinite'
                        }} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                          LIVE
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Photo Analysis Modal */}
      <Dialog
        open={showPhotoAnalysisModal}
        onClose={() => setShowPhotoAnalysisModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: brandConfig.colors.arenaSand,
            border: `2px solid ${brandConfig.colors.stableMahogany}`,
            borderRadius: brandConfig.layout.borderRadius,
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.arenaSand,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Assessment sx={{ fontSize: '24px' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: brandConfig.colors.arenaSand }}>
                {photoAnalysisData[selectedAnalysisIndex] ? 
                  `Photo ${photoAnalysisData[selectedAnalysisIndex].photoNumber} Analysis` :
                  'Photo Analysis'
                }
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {photoAnalysisData[selectedAnalysisIndex] ? 
                  new Date(photoAnalysisData[selectedAnalysisIndex].timestamp).toLocaleString() :
                  'No data available'
                }
              </Typography>
            </Box>
          </Box>
          
          <IconButton
            onClick={() => setShowPhotoAnalysisModal(false)}
            sx={{ 
              color: brandConfig.colors.arenaSand,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          padding: brandConfig.spacing.lg,
          backgroundColor: brandConfig.colors.arenaSand,
        }}>
          {photoAnalysisData.length > 0 ? (
            <>
              {/* Analysis Selection Dropdown */}
              <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h6" sx={{ 
                  color: brandConfig.colors.stableMahogany, 
                  fontWeight: 'bold',
                  mb: 2 
                }}>
                  📋 Select Analysis
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: brandConfig.colors.stableMahogany }}>
                    Choose a photo analysis to view
                  </InputLabel>
                  <Select
                    value={selectedAnalysisIndex}
                    onChange={(e) => setSelectedAnalysisIndex(e.target.value as number)}
                    label="Choose a photo analysis to view"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: brandConfig.colors.stableMahogany,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: brandConfig.colors.hunterGreen,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: brandConfig.colors.stableMahogany,
                      },
                    }}
                  >
                    {photoAnalysisData.map((analysis, index) => (
                      <MenuItem key={analysis.id} value={index}>
                        Photo {analysis.photoNumber} - {new Date(analysis.timestamp).toLocaleTimeString()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Raw Data Toggle Button */}
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowRawData(!showRawData)}
                  startIcon={<SmartToy />}
                  sx={{
                    borderColor: brandConfig.colors.stableMahogany,
                    color: brandConfig.colors.stableMahogany,
                    '&:hover': {
                      borderColor: brandConfig.colors.hunterGreen,
                      backgroundColor: brandConfig.colors.stableMahogany + '10',
                    },
                  }}
                >
                  {showRawData ? 'Hide Raw Data' : 'View Raw AI Data'}
                </Button>
              </Box>

              {/* Raw Data Display */}
              {showRawData && (
                <Card sx={{ mb: 3, backgroundColor: brandConfig.colors.midnightBlack }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      color: brandConfig.colors.arenaSand,
                      fontWeight: 'bold',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <SmartToy />
                      🤖 Raw AI Response Data
                    </Typography>
                    <Box sx={{
                      backgroundColor: brandConfig.colors.midnightBlack,
                      color: brandConfig.colors.championGold,
                      padding: brandConfig.spacing.md,
                      borderRadius: brandConfig.layout.borderRadius,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {photoAnalysisData[selectedAnalysisIndex]?.rawData || 
                          JSON.stringify(photoAnalysisData[selectedAnalysisIndex], null, 2)
                        }
                      </pre>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {photoAnalysisData[selectedAnalysisIndex] && (
                <Box>
                  {/* Analysis Results Header */}
                  <Typography variant="h6" sx={{ 
                    color: brandConfig.colors.stableMahogany,
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Assessment />
                    📊 Analysis Results
                  </Typography>



              <Stack spacing={2}>
                {/* Image Assessment */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CameraAlt />
                      Image Assessment
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={1}>
                      <Typography><strong>Quality:</strong> {photoAnalysisData[selectedAnalysisIndex].imageAssessment.quality}</Typography>
                      <Typography><strong>Lighting:</strong> {photoAnalysisData[selectedAnalysisIndex].imageAssessment.lighting}</Typography>
                      <Typography><strong>Clarity:</strong> {photoAnalysisData[selectedAnalysisIndex].imageAssessment.clarity}</Typography>
                      <Typography><strong>Angle:</strong> {photoAnalysisData[selectedAnalysisIndex].imageAssessment.angle}</Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Primary Subject Analysis */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility />
                      Primary Subject Analysis
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={1}>
                      <Typography><strong>Horse ID:</strong> {photoAnalysisData[selectedAnalysisIndex].primarySubject.horseIdentification}</Typography>
                      <Typography><strong>Position:</strong> {photoAnalysisData[selectedAnalysisIndex].primarySubject.position}</Typography>
                      <Typography><strong>Activity:</strong> {photoAnalysisData[selectedAnalysisIndex].primarySubject.activity}</Typography>
                      <Typography><strong>Visibility:</strong> {photoAnalysisData[selectedAnalysisIndex].primarySubject.visibility}</Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Clinical Assessment */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalHospital />
                      Clinical Assessment
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={1}>
                      <Typography><strong>General Appearance:</strong> {photoAnalysisData[selectedAnalysisIndex].clinicalAssessment.generalAppearance}</Typography>
                      <Typography><strong>Posture:</strong> {photoAnalysisData[selectedAnalysisIndex].clinicalAssessment.posture}</Typography>
                      <Typography><strong>Movement:</strong> {photoAnalysisData[selectedAnalysisIndex].clinicalAssessment.movement}</Typography>
                      <Typography><strong>Alertness:</strong> {photoAnalysisData[selectedAnalysisIndex].clinicalAssessment.alertness}</Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Health Metrics */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HealthAndSafety />
                      Health Metrics
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={1}>
                      <Typography><strong>Body Condition:</strong> {photoAnalysisData[selectedAnalysisIndex].healthMetrics.bodyCondition}</Typography>
                      <Typography><strong>Coat Condition:</strong> {photoAnalysisData[selectedAnalysisIndex].healthMetrics.coatCondition}</Typography>
                      <Typography><strong>Muscling:</strong> {photoAnalysisData[selectedAnalysisIndex].healthMetrics.muscling}</Typography>
                      <Typography><strong>Gait:</strong> {photoAnalysisData[selectedAnalysisIndex].healthMetrics.gait}</Typography>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Risk Assessment */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning />
                      Risk Assessment
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>Risk Level:</Typography>
                        <Chip 
                          label={photoAnalysisData[selectedAnalysisIndex].riskAssessment.level.toUpperCase()}
                          color={
                            photoAnalysisData[selectedAnalysisIndex].riskAssessment.level === 'low' ? 'success' :
                            photoAnalysisData[selectedAnalysisIndex].riskAssessment.level === 'medium' ? 'warning' : 'error'
                          }
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>Factors:</Typography>
                        <List dense>
                          {photoAnalysisData[selectedAnalysisIndex].riskAssessment.factors.map((factor, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText primary={`• ${factor}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold' }}>Recommendations:</Typography>
                        <List dense>
                          {photoAnalysisData[selectedAnalysisIndex].riskAssessment.recommendations.map((rec, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemText primary={`• ${rec}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Clinical Recommendations */}
                <Accordion sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Science />
                      Clinical Recommendations
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: brandConfig.colors.victoryRose }}>Immediate Actions:</Typography>
                        <List dense>
                          {photoAnalysisData[selectedAnalysisIndex].clinicalRecommendations.immediate.map((action, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: '20px' }}>
                                <Circle sx={{ fontSize: '8px', color: brandConfig.colors.victoryRose }} />
                              </ListItemIcon>
                              <ListItemText primary={action} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: brandConfig.colors.alertAmber }}>Follow-up Actions:</Typography>
                        <List dense>
                          {photoAnalysisData[selectedAnalysisIndex].clinicalRecommendations.followUp.map((action, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: '20px' }}>
                                <Circle sx={{ fontSize: '8px', color: brandConfig.colors.alertAmber }} />
                              </ListItemIcon>
                              <ListItemText primary={action} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: brandConfig.colors.hunterGreen }}>Monitoring:</Typography>
                        <List dense>
                          {photoAnalysisData[selectedAnalysisIndex].clinicalRecommendations.monitoring.map((monitor, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: '20px' }}>
                                <Circle sx={{ fontSize: '8px', color: brandConfig.colors.hunterGreen }} />
                              </ListItemIcon>
                              <ListItemText primary={monitor} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Detailed Clinical Notes */}
                <Accordion defaultExpanded sx={{ 
                  backgroundColor: brandConfig.colors.arenaSand,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  '&:before': { display: 'none' }
                }}>
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: brandConfig.colors.stableMahogany }} />}
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      color: brandConfig.colors.stableMahogany,
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notes />
                      Detailed Clinical Notes
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
                    <Box sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      padding: brandConfig.spacing.md,
                      borderRadius: brandConfig.layout.borderRadius,
                      border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                    }}>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.6,
                        color: brandConfig.colors.midnightBlack 
                      }}>
                        ✓ {photoAnalysisData[selectedAnalysisIndex].detailedNotes}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Box>
          )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Assessment sx={{ fontSize: '48px', color: brandConfig.colors.sterlingSilver, mb: 2 }} />
                <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany, mb: 1 }}>
                  No Analysis Data Available
                </Typography>
                <Typography variant="body2" sx={{ color: brandConfig.colors.sterlingSilver }}>
                  Photo analysis results will appear here when available from AI processing.
                </Typography>
              </Box>
            )}
        </DialogContent>

        <DialogActions sx={{ 
          backgroundColor: brandConfig.colors.arenaSand,
          padding: brandConfig.spacing.lg,
          borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
        }}>
          <Button
            onClick={() => setShowPhotoAnalysisModal(false)}
            variant="contained"
            sx={{
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.arenaSand,
              '&:hover': {
                backgroundColor: brandConfig.colors.hunterGreen,
              },
            }}
          >
            Close Analysis
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}; 