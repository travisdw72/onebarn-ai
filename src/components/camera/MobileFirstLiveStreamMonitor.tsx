import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  Chip,
  IconButton,
  InputAdornment,
  Collapse,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fab,
  Snackbar,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Fullscreen,
  FullscreenExit,
  ContentPaste,
  Clear,
  PhotoCamera,
  Settings,
  SwapHoriz,
  Refresh,
  Warning,
  CheckCircle,
  Analytics,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Wifi,
  WifiOff
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { liveStreamConfig } from '../../config/liveStreamConfig';
import { useLiveStreamPhotoSequence } from '../../hooks/useLiveStreamPhotoSequence';

interface IMobileFirstLiveStreamMonitorProps {
  tenantId?: string;
  onStreamChange?: (streamUrl: string) => void;
  onAnalysisComplete?: (analysis: any) => void;
}

export const MobileFirstLiveStreamMonitor: React.FC<IMobileFirstLiveStreamMonitorProps> = ({
  tenantId,
  onStreamChange,
  onAnalysisComplete
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State management following mobile config
  const [streamUrl, setStreamUrl] = useState<string>(liveStreamConfig.sources.youtube.defaultUrl);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedStream, setSelectedStream] = useState<string>('london-experience');
  const [showControls, setShowControls] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [showDataWarning, setShowDataWarning] = useState<boolean>(false);
  const [aiAnalysisExpanded, setAIAnalysisExpanded] = useState<boolean>(true);
  const [streamSelectionCollapsed, setStreamSelectionCollapsed] = useState<boolean>(isMobile);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(isMobile);
  const [settingsCollapsed, setSettingsCollapsed] = useState<boolean>(true);

  // Refs
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Live stream photo sequence hook
  const {
    isAnalyzing,
    currentSession,
    analysisHistory,
    startPhotoSequenceAnalysis
  } = useLiveStreamPhotoSequence();

  // Extract video ID from URL for YouTube embed
  const extractVideoId = useCallback((url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  // Generate embed URL
  const getEmbedUrl = useCallback((url: string): string => {
    const videoId = extractVideoId(url);
    if (videoId) {
      return liveStreamConfig.sources.youtube.embedTemplate.replace('{videoId}', videoId);
    }
    return url;
  }, [extractVideoId]);

  // Handle URL input
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStreamUrl(event.target.value);
    onStreamChange?.(event.target.value);
  };

  // Handle paste button
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setStreamUrl(text);
      onStreamChange?.(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setStreamUrl('');
    onStreamChange?.('');
  };

  // Handle predefined stream selection
  const handleStreamSelection = (streamId: string) => {
    const stream = liveStreamConfig.sources.predefined.find(s => s.id === streamId);
    if (stream) {
      setStreamUrl(stream.url);
      setSelectedStream(streamId);
      onStreamChange?.(stream.url);
    }
  };

  // Handle AI analysis
  const handleAIAnalysis = async () => {
    if (streamUrl && iframeRef.current) {
      try {
        await startPhotoSequenceAnalysis();
      } catch (error) {
        console.error('AI Analysis failed:', error);
      }
    }
  };

  // Show data usage warning on mobile
  useEffect(() => {
    if (isMobile && !showDataWarning) {
      const hasShownWarning = localStorage.getItem('dataWarningShown');
      if (!hasShownWarning) {
        setShowDataWarning(true);
        localStorage.setItem('dataWarningShown', 'true');
      }
    }
  }, [isMobile, showDataWarning]);

  // Styles following mobile-first approach
  const styles = {
    container: {
      maxWidth: '100%',
      mx: 'auto',
      px: isMobile ? 1 : 2,
      py: 1
    },
    mobileHeader: {
      position: 'sticky',
      top: 0,
      zIndex: 1100,
      mb: 1,
      bgcolor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider'
    },
    urlInputSection: {
      mb: 2,
      p: isMobile ? 1 : 2,
      bgcolor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.hunterGreen}`
    },
    streamPlayer: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16/9',
      minHeight: '200px',
      maxHeight: '60vh',
      mb: 2,
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden',
      bgcolor: '#000'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none'
    },
    controlsOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      p: 1,
      display: showControls ? 'flex' : 'none',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    aiAnalysisPanel: {
      mb: 2,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      borderRadius: brandConfig.layout.borderRadius
    },
    streamSelection: {
      mb: 2,
      maxWidth: '100%',
      overflowX: 'auto'
    },
    collapsibleSection: {
      mb: 1,
      border: `1px solid ${brandConfig.colors.hunterGreen}`,
      borderRadius: brandConfig.layout.borderRadius
    },
    touchTarget: {
      minHeight: '56px',
      minWidth: '56px'
    },
    fab: {
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 1000
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Status Indicators Only */}
      {isMobile && (connectionStatus !== 'connected' || isAnalyzing) && (
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={1}>
            {connectionStatus !== 'connected' && (
              <Chip 
                icon={<WifiOff />}
                label={connectionStatus}
                color="warning"
                size="small"
              />
            )}
            {isAnalyzing && (
              <Chip 
                icon={<Analytics />}
                label="Analyzing"
                color="primary"
                size="small"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* 1. Custom Stream URL Input - Top Priority */}
      <Card sx={styles.urlInputSection}>
        <CardContent sx={{ p: isMobile ? 1 : 2, '&:last-child': { pb: isMobile ? 1 : 2 } }}>
          <Typography variant="h6" gutterBottom color={brandConfig.colors.stableMahogany} sx={{ fontWeight: 'bold' }}>
            🔗 Custom Stream URL
          </Typography>
          {streamUrl && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, wordBreak: 'break-all' }}>
              {streamUrl}
            </Typography>
          )}
          <TextField
            fullWidth
            value={streamUrl}
            onChange={handleUrlChange}
            placeholder="Stream URL"
            label="Stream URL"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Stack direction="row" spacing={0.5}>
                    <IconButton onClick={handlePaste} size="small" sx={styles.touchTarget}>
                      <ContentPaste />
                    </IconButton>
                    {streamUrl && (
                      <IconButton onClick={handleClear} size="small" sx={styles.touchTarget}>
                        <Clear />
                      </IconButton>
                    )}
                  </Stack>
                </InputAdornment>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* 2. Video Stream Player */}
      <Box sx={styles.streamPlayer} ref={playerRef}>
        {streamUrl ? (
          <>
            <iframe
              ref={iframeRef}
              src={getEmbedUrl(streamUrl)}
              style={styles.iframe}
              allowFullScreen
              title={liveStreamConfig.streamInfo.title}
              onLoad={() => {
                setIsPlaying(true);
                setConnectionStatus('connected');
              }}
              onError={() => {
                setConnectionStatus('disconnected');
              }}
            />
            
            {/* Stream Controls Overlay */}
            <Box sx={styles.controlsOverlay}>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={handleAIAnalysis} sx={{ color: 'white', ...styles.touchTarget }}>
                  <PhotoCamera />
                </IconButton>
              </Stack>
              
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => playerRef.current?.requestFullscreen()} sx={{ color: 'white', ...styles.touchTarget }}>
                  <Fullscreen />
                </IconButton>
                <IconButton onClick={() => window.location.reload()} sx={{ color: 'white', ...styles.touchTarget }}>
                  <Refresh />
                </IconButton>
              </Stack>
            </Box>
          </>
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6">
              {liveStreamConfig.status.enterUrlToStart}
            </Typography>
          </Box>
        )}
      </Box>

      {/* 3. AI Analysis Panel - Always Visible on Mobile */}
      <Card sx={styles.aiAnalysisPanel}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={() => setAIAnalysisExpanded(!aiAnalysisExpanded)}>
            <Typography variant="h6" color={brandConfig.colors.stableMahogany}>
              🤖 {liveStreamConfig.aiAnalysis.title}
            </Typography>
            <IconButton>
              {aiAnalysisExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </Stack>
          
          <Collapse in={aiAnalysisExpanded}>
            <Box sx={{ mt: 2 }}>
              {isAnalyzing ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={24} />
                  <Typography>{liveStreamConfig.aiAnalysis.photoSequence.buttonTextAnalyzing}</Typography>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Analytics />}
                  onClick={handleAIAnalysis}
                  disabled={!streamUrl}
                  sx={{
                    backgroundColor: brandConfig.colors.stableMahogany,
                    ...styles.touchTarget
                  }}
                >
                  {liveStreamConfig.aiAnalysis.photoSequence.buttonText}
                </Button>
              )}
              
              {currentSession && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Progress: {currentSession.completedPhotos}/{currentSession.totalPhotos} photos
                  </Typography>
                  <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.300', borderRadius: 2 }}>
                    <Box 
                      sx={{ 
                        width: `${(currentSession.completedPhotos / currentSession.totalPhotos) * 100}%`,
                        height: '100%',
                        bgcolor: brandConfig.colors.successGreen,
                        borderRadius: 2,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                </Box>
              )}
              
              {analysisHistory.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Analysis Results
                  </Typography>
                  <Stack spacing={1}>
                    {analysisHistory.slice(0, 3).map((session, index) => (
                      <Alert 
                        key={index}
                        severity="info" 
                        icon={<CheckCircle />}
                      >
                        Analysis completed: {session.results.length} photos processed
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* 4. Stream Selection - Collapsible */}
      <Card sx={styles.collapsibleSection}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={() => setStreamSelectionCollapsed(!streamSelectionCollapsed)}>
            <Typography variant="subtitle1">📺 Quick Select Streams</Typography>
            <IconButton>
              {streamSelectionCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </Stack>
          
          <Collapse in={!streamSelectionCollapsed}>
            <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1, mt: 2 }}>
              {liveStreamConfig.sources.predefined.map((stream) => (
                <Button
                  key={stream.id}
                  variant={selectedStream === stream.id ? 'contained' : 'outlined'}
                  onClick={() => handleStreamSelection(stream.id)}
                  sx={{
                    minWidth: '140px',
                    minHeight: '56px',
                    flexShrink: 0,
                    backgroundColor: selectedStream === stream.id ? brandConfig.colors.hunterGreen : 'transparent'
                  }}
                >
                  {stream.name}
                </Button>
              ))}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* 5. Collapsible Controls */}
      <Card sx={styles.collapsibleSection}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={() => setControlsCollapsed(!controlsCollapsed)}>
            <Typography variant="subtitle1">🎮 {liveStreamConfig.controls.settings}</Typography>
            <IconButton>
              {controlsCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </Stack>
          
          <Collapse in={!controlsCollapsed}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SwapHoriz />}
                sx={styles.touchTarget}
              >
                Switch Camera View
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PhotoCamera />}
                sx={styles.touchTarget}
              >
                Take Screenshot
              </Button>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* 6. Collapsible Settings */}
      <Card sx={styles.collapsibleSection}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={() => setSettingsCollapsed(!settingsCollapsed)}>
            <Typography variant="subtitle1">⚙️ Advanced Settings</Typography>
            <IconButton>
              {settingsCollapsed ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </Stack>
          
          <Collapse in={!settingsCollapsed}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Stream quality, buffer settings, and advanced options will appear here.
              </Typography>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>

      {/* Floating Action Button for Quick Analysis */}
      {isMobile && streamUrl && (
        <Fab 
          color="primary" 
          sx={{
            ...styles.fab,
            backgroundColor: brandConfig.colors.stableMahogany
          }}
          onClick={handleAIAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? <CircularProgress size={24} color="inherit" /> : <Analytics />}
        </Fab>
      )}

      {/* Data Usage Warning */}
      <Snackbar
        open={showDataWarning}
        autoHideDuration={6000}
        onClose={() => setShowDataWarning(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowDataWarning(false)} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          {liveStreamConfig.messages.mobile.dataUsageWarning}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 