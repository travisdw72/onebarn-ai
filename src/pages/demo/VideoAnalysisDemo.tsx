import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Fade,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VideoFile,
  Analytics,
  Visibility,
  ExpandMore,
  Code,
  Photo,
  CheckCircle,
  Error,
  Schedule,
  Assessment,
  Close,
  Fullscreen,
  Download,
  VideoLibrary
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { aiVisionService } from '../../services/aiVisionService';
import { SceneDescriptionDisplay } from '../../components/video-analysis/SceneDescriptionDisplay';
import { AIAnalysisDisplay } from '../../components/video-analysis/AIAnalysisDisplay';
import type { IEnhancedVideoAnalysisResult } from '../../interfaces/VideoTypes';
import type { ISceneDescriptionData } from '../../components/video-analysis/SceneDescriptionDisplay';

// Import the single source of truth video config
import { CORE_DEMO_VIDEOS, getVideoInfoForAnalysisDemo, type IVideoConfig } from '../../config/videoConfig';

// Function to categorize videos based on filename
const categorizeVideo = (filename: string) => {
  // This is now handled by the config, but kept for legacy compatibility
  const video = CORE_DEMO_VIDEOS.find(v => v.filename === filename);
  if (video) {
    return {
      category: video.name,
      difficulty: video.difficulty,
      description: video.description,
      expectedFindings: video.expectedFindings
    };
  }
  
  // Fallback
  return {
    category: 'General Analysis',
    difficulty: 'Intermediate',
    description: 'AI analysis of equine behavior and health indicators',
    expectedFindings: ['Behavioral Analysis', 'Health Assessment', 'Activity Monitoring']
  };
};

// Enhanced interfaces
interface IPhotoAnalysisResult {
  photoIndex: number;
  timestamp: string;
  photoData: string;
  analysis: any;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  confidence: number;
  insights: string[];
  error?: string;
}

interface IVideoInfo {
  filename: string;
  displayName: string;
  category: string;
  difficulty: string;
  description: string;
  expectedFindings: string[];
  videoUrl: string;
}

interface IVideoAnalysisState {
  selectedVideo: IVideoInfo | null;
  availableVideos: IVideoInfo[];
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisResult: IEnhancedVideoAnalysisResult | null;
  sceneDescription: ISceneDescriptionData | null;
  error: string | null;
  isVideoPlaying: boolean;
  showFullAnalysis: boolean;
  showRawData: boolean;
  rawDataContent: string;
  extractedPhotos: string[];
  photoAnalysisResults: IPhotoAnalysisResult[];
  currentAnalyzingPhoto: number;
  showPhotoGallery: boolean;
  selectedPhotoIndex: number;
  showPhotoDialog: boolean;
  isLoadingVideos: boolean;
}

export const VideoAnalysisDemo: React.FC = () => {
  const [state, setState] = useState<IVideoAnalysisState>({
    selectedVideo: null,
    availableVideos: [],
    isAnalyzing: false,
    analysisProgress: 0,
    analysisResult: null,
    sceneDescription: null,
    error: null,
    isVideoPlaying: false,
    showFullAnalysis: false,
    showRawData: false,
    rawDataContent: '',
    extractedPhotos: [],
    photoAnalysisResults: [],
    currentAnalyzingPhoto: -1,
    showPhotoGallery: false,
    selectedPhotoIndex: 0,
    showPhotoDialog: false,
    isLoadingVideos: true
  });

  // Load available videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Use the single source of truth video config
        const videoInfos: IVideoInfo[] = getVideoInfoForAnalysisDemo();

        setState(prev => ({
          ...prev,
          availableVideos: videoInfos,
          isLoadingVideos: false
        }));
      } catch (error) {
        console.error('Failed to load videos:', error);
        setState(prev => ({
          ...prev,
          error: 'Failed to load available videos',
          isLoadingVideos: false
        }));
      }
    };

    loadVideos();
  }, []);

  // Enhanced photo extraction with better error handling
  const extractPhotosFromVideo = async (videoBlob: Blob): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot create canvas context'));
        return;
      }

      const photos: string[] = [];
      let currentPhotoIndex = 0;
      const photoCount = 10;
      const photoTimestamps: number[] = [];

      video.onloadeddata = () => {
        const duration = video.duration;
        canvas.width = 640;
        canvas.height = 480;

        for (let i = 0; i < photoCount; i++) {
          const timestamp = Math.min(i * (duration / (photoCount - 1)), duration - 0.1);
          photoTimestamps.push(timestamp);
        }

        video.currentTime = photoTimestamps[0];
      };

      video.onseeked = () => {
        try {
          const videoAspect = video.videoWidth / video.videoHeight;
          let drawWidth = 640;
          let drawHeight = 480;
          let offsetX = 0;
          let offsetY = 0;

          if (videoAspect > 640/480) {
            drawHeight = 640 / videoAspect;
            offsetY = (480 - drawHeight) / 2;
          } else {
            drawWidth = 480 * videoAspect;
            offsetX = (640 - drawWidth) / 2;
          }

          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 640, 480);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          photos.push(imageData);

          currentPhotoIndex++;
          if (currentPhotoIndex < photoCount && currentPhotoIndex < photoTimestamps.length) {
            video.currentTime = photoTimestamps[currentPhotoIndex];
          } else {
            resolve(photos);
          }
        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => reject(new Error('Video loading failed'));
      video.src = URL.createObjectURL(videoBlob);
      video.load();
    });
  };

  // Enhanced video analysis with individual photo tracking
  const handleAnalyzeVideo = async () => {
    if (!state.selectedVideo) return;

    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      analysisProgress: 0, 
      error: null,
      extractedPhotos: [],
      photoAnalysisResults: [],
      currentAnalyzingPhoto: -1
    }));

    try {
      console.log(`🎥 Starting AI analysis of ${state.selectedVideo.displayName}`);
      console.log(`📁 Video: ${state.selectedVideo.videoUrl}`);

      // Step 1: Extract photos
      setState(prev => ({ ...prev, analysisProgress: 10 }));
      
      const response = await fetch(state.selectedVideo.videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to load video: ${response.status} ${response.statusText}`);
      }
      
      const videoBlob = await response.blob();
      console.log(`📁 Video loaded: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);

      const extractedPhotos = await extractPhotosFromVideo(videoBlob);
      
      setState(prev => ({ 
        ...prev, 
        extractedPhotos,
        analysisProgress: 20,
        photoAnalysisResults: extractedPhotos.map((photo: string, index: number) => ({
          photoIndex: index,
          timestamp: `${Math.round(index * 6)}s`,
          photoData: photo,
          analysis: null,
          status: 'pending' as const,
          confidence: 0,
          insights: []
        }))
      }));

      // Step 2: Simulate individual photo analysis
      for (let i = 0; i < extractedPhotos.length; i++) {
        setState(prev => ({
          ...prev,
          currentAnalyzingPhoto: i,
          analysisProgress: 20 + (i / extractedPhotos.length) * 60,
          photoAnalysisResults: prev.photoAnalysisResults.map((result, index) => 
            index === i ? { ...result, status: 'analyzing' as const } : result
          )
        }));

        // Simulate analysis time
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock individual photo analysis
        const mockPhotoAnalysis = {
          confidence: 0.7 + Math.random() * 0.25,
          findings: [`Finding ${i + 1}`, `Observation ${i + 1}`],
          insights: [`Insight from photo ${i + 1}`],
          timestamp: `${Math.round(i * 6)}s`
        };

        setState(prev => ({
          ...prev,
          photoAnalysisResults: prev.photoAnalysisResults.map((result, index) => 
            index === i ? {
              ...result,
              status: 'completed' as const,
              analysis: mockPhotoAnalysis,
              confidence: mockPhotoAnalysis.confidence,
              insights: mockPhotoAnalysis.insights
            } : result
          )
        }));
      }

      // Step 3: Final comprehensive analysis
      setState(prev => ({ ...prev, analysisProgress: 85 }));
      
      const analysisResult = await aiVisionService.analyzePhotoSequence(videoBlob, {
        name: state.selectedVideo.displayName,
        category: state.selectedVideo.category,
        expectedFindings: state.selectedVideo.expectedFindings,
        priority: state.selectedVideo.difficulty === 'Critical' ? 'urgent' : 
                 state.selectedVideo.difficulty === 'Advanced' ? 'high' : 'medium'
      });

      // Generate enhanced scene description
      const sceneDescription: ISceneDescriptionData = {
        environment: {
          setting: state.selectedVideo.category.includes('Emergency') ? 'indoor_stall' : 'paddock',
          surfaceType: state.selectedVideo.category.includes('Gait') ? 'arena_footing' : 'natural_ground',
          surfaceCondition: 'good',
          lighting: 'natural_daylight',
          weatherVisible: 'clear'
        },
        horseDescription: {
          coatColor: 'bay',
          markings: 'white_markings',
          approximateSize: 'full_size',
          bodyCondition: 'good',
          tackEquipment: state.selectedVideo.category.includes('Performance') ? ['halter', 'lead_rope'] : ['halter']
        },
        positioning: {
          locationInFrame: 'center',
          orientation: 'profile_view',
          distanceFromCamera: 'medium',
          postureGeneral: state.selectedVideo.category.includes('Emergency') ? 'alert_distressed' : 'normal_standing'
        },
        backgroundElements: ['barn_structure', 'fencing'],
        cameraQuality: {
          imageClarity: 'clear',
          cameraAngle: 'side_view',
          fieldOfView: 'wide'
        },
        overallSceneAssessment: `${state.selectedVideo.category} scenario captured with excellent detail for comprehensive AI analysis`
      };

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisProgress: 100,
        analysisResult,
        sceneDescription,
        rawDataContent: JSON.stringify({ 
          analysisResult, 
          sceneDescription, 
          photoAnalysisResults: prev.photoAnalysisResults,
          videoInfo: state.selectedVideo
        }, null, 2),
        currentAnalyzingPhoto: -1,
        error: null
      }));

      console.log('✅ AI Video Analysis Results:', analysisResult);

    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: error instanceof Error ? error.message : 'Analysis failed',
        analysisProgress: 0
      }));
    }
  };

  // Handle video selection
  const handleVideoSelect = (event: SelectChangeEvent) => {
    const selectedFilename = event.target.value;
    const selectedVideo = state.availableVideos.find(v => v.filename === selectedFilename);
    
    if (selectedVideo) {
      setState(prev => ({
        ...prev,
        selectedVideo,
        analysisResult: null,
        sceneDescription: null,
        error: null,
        analysisProgress: 0,
        isVideoPlaying: false,
        showFullAnalysis: false,
        extractedPhotos: [],
        photoAnalysisResults: [],
        rawDataContent: ''
      }));
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Critical': return '#d32f2f';
      case 'Advanced': return '#f57c00';
      case 'Professional': return '#7b1fa2';
      case 'Intermediate': return '#1976d2';
      default: return brandConfig.colors.hunterGreen;
    }
  };

  // Get status icon for photo analysis
  const getPhotoStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle sx={{ color: brandConfig.colors.hunterGreen }} />;
      case 'analyzing': return <CircularProgress size={20} />;
      case 'failed': return <Error sx={{ color: '#d32f2f' }} />;
      default: return <Schedule sx={{ color: '#666' }} />;
    }
  };

  if (state.isLoadingVideos) {
    return (
      <Box sx={{ 
        padding: brandConfig.spacing.lg,
        backgroundColor: brandConfig.colors.arenaSand,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Card elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading Available Videos...</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #8B4513 0%, #2C5530 100%)' }}>
        <Typography variant="h3" sx={{ 
          color: brandConfig.colors.arenaSand,
          fontWeight: 'bold',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <VideoFile sx={{ fontSize: '2rem' }} />
          AI Video Analysis Demo
        </Typography>
        <Typography variant="h6" sx={{ color: brandConfig.colors.arenaSand, opacity: 0.9 }}>
          Experience advanced AI-powered equine video analysis - {CORE_DEMO_VIDEOS.length} videos available
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Video Selection Panel */}
        <Grid item xs={12} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VideoLibrary sx={{ color: brandConfig.colors.stableMahogany }} />
                Select Video for Analysis
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Choose Video</InputLabel>
                <Select
                  value={state.selectedVideo?.filename || ''}
                  label="Choose Video"
                  onChange={handleVideoSelect}
                >
                  {state.availableVideos.map((video) => (
                    <MenuItem key={video.filename} value={video.filename}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {video.displayName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={video.category}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                          <Chip 
                            label={video.difficulty}
                            size="small"
                            sx={{ 
                              backgroundColor: getDifficultyColor(video.difficulty),
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selected Video Info */}
              {state.selectedVideo && (
                <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ mb: 1, color: brandConfig.colors.stableMahogany }}>
                    {state.selectedVideo.displayName}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip 
                      label={state.selectedVideo.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      label={state.selectedVideo.difficulty}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(state.selectedVideo.difficulty),
                        color: 'white'
                      }}
                    />
                  </Stack>
                  
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {state.selectedVideo.description}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    color: brandConfig.colors.stableMahogany,
                    fontWeight: 500
                  }}>
                    Expected Findings: {state.selectedVideo.expectedFindings.join(', ')}
                  </Typography>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Panel */}
        <Grid item xs={12} lg={8}>
          {state.selectedVideo ? (
            <Stack spacing={3}>
              {/* Video Player */}
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility sx={{ color: brandConfig.colors.stableMahogany }} />
                      Video Analysis
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleAnalyzeVideo}
                      disabled={state.isAnalyzing}
                      startIcon={state.isAnalyzing ? <CircularProgress size={20} /> : <Analytics />}
                      sx={{
                        backgroundColor: brandConfig.colors.stableMahogany,
                        '&:hover': { backgroundColor: brandConfig.colors.hunterGreen }
                      }}
                    >
                      {state.isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
                    </Button>
                  </Box>

                  <video
                    src={state.selectedVideo.videoUrl}
                    controls
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      backgroundColor: '#000',
                      borderRadius: brandConfig.layout.borderRadius
                    }}
                    onError={(e) => {
                      console.error('Video failed to load:', e);
                      setState(prev => ({
                        ...prev,
                        error: `Failed to load video: ${state.selectedVideo?.displayName}`
                      }));
                    }}
                  />
                </CardContent>
              </Card>

              {/* Analysis Progress */}
              {state.isAnalyzing && (
                <Fade in={state.isAnalyzing}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        AI Analysis in Progress
                      </Typography>
                      
                      <LinearProgress 
                        variant="determinate" 
                        value={state.analysisProgress} 
                        sx={{ 
                          height: 8,
                          borderRadius: 4,
                          mb: 2,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: brandConfig.colors.stableMahogany
                          }
                        }}
                      />
                      
                      <Typography variant="body2" color="text.secondary">
                        Progress: {Math.round(state.analysisProgress)}%
                        {state.currentAnalyzingPhoto >= 0 && 
                          ` • Analyzing photo ${state.currentAnalyzingPhoto + 1} of ${state.photoAnalysisResults.length}`
                        }
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              )}

              {/* Extracted Photos Gallery */}
              {state.extractedPhotos.length > 0 && (
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Photo sx={{ color: brandConfig.colors.stableMahogany }} />
                        Extracted Analysis Photos ({state.extractedPhotos.length})
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setState(prev => ({ ...prev, showPhotoGallery: !prev.showPhotoGallery }))}
                      >
                        {state.showPhotoGallery ? 'Hide' : 'Show'} Gallery
                      </Button>
                    </Box>

                    {state.showPhotoGallery && (
                      <ImageList cols={5} rowHeight={120} gap={8}>
                        {state.photoAnalysisResults.map((result, index) => (
                          <ImageListItem 
                            key={index} 
                            sx={{ 
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease',
                              '&:hover': { transform: 'scale(1.05)' }
                            }}
                            onClick={() => setState(prev => ({ 
                              ...prev, 
                              selectedPhotoIndex: index, 
                              showPhotoDialog: true 
                            }))}
                          >
                            <img
                              src={result.photoData}
                              alt={`Analysis photo ${index + 1}`}
                              style={{ borderRadius: 4 }}
                            />
                            <ImageListItemBar
                              title={result.timestamp}
                              subtitle={`${Math.round(result.confidence * 100)}% confidence`}
                              actionIcon={
                                <Badge 
                                  overlap="circular" 
                                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                  badgeContent={getPhotoStatusIcon(result.status)}
                                >
                                  <IconButton size="small" sx={{ color: 'white' }}>
                                    <Fullscreen />
                                  </IconButton>
                                </Badge>
                              }
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {state.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="h6">Analysis Error</Typography>
                  {state.error}
                </Alert>
              )}

              {/* Analysis Results */}
              {state.analysisResult && (
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assessment sx={{ color: brandConfig.colors.stableMahogany }} />
                        Analysis Results
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Code />}
                          onClick={() => setState(prev => ({ ...prev, showRawData: true }))}
                        >
                          View Full Analysis
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Download />}
                          onClick={() => {
                            const blob = new Blob([state.rawDataContent], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${state.selectedVideo?.filename || 'analysis'}_results.json`;
                            a.click();
                          }}
                        >
                          Export Results
                        </Button>
                      </Stack>
                    </Box>

                    {/* Individual Photo Results */}
                    <Accordion sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">Individual Photo Analysis Results</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          {state.photoAnalysisResults.map((result, index) => (
                            <Grid item xs={12} md={6} key={index}>
                              <Card variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                  <img 
                                    src={result.photoData} 
                                    alt={`Photo ${index + 1}`}
                                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                  />
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      Photo {index + 1} - {result.timestamp}
                                      {getPhotoStatusIcon(result.status)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Confidence: {Math.round(result.confidence * 100)}%
                                    </Typography>
                                    {result.insights.length > 0 && (
                                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                        {result.insights.join(', ')}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    {/* Comprehensive Analysis */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">Comprehensive AI Analysis</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {state.rawDataContent && (
                          <AIAnalysisDisplay 
                            rawDataContent={state.rawDataContent}
                            showTitle={false}
                            timestamp={new Date().toISOString()}
                          />
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </Stack>
          ) : (
            <Card elevation={3} sx={{ height: 400 }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <VideoLibrary sx={{ fontSize: '4rem', color: brandConfig.colors.stableMahogany, mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Select a Video to Analyze
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose from {state.availableVideos.length} available videos to see AI analysis in action
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Analysis Results Dialog */}
      <Dialog 
        open={state.showRawData} 
        onClose={() => setState(prev => ({ ...prev, showRawData: false }))}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Complete Analysis Results</Typography>
            <IconButton onClick={() => setState(prev => ({ ...prev, showRawData: false }))}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {state.rawDataContent && (
            <AIAnalysisDisplay 
              rawDataContent={state.rawDataContent}
              showTitle={true}
              timestamp={new Date().toISOString()}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            startIcon={<Download />}
            onClick={() => {
              const blob = new Blob([state.rawDataContent], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${state.selectedVideo?.filename || 'analysis'}_results.json`;
              a.click();
            }}
          >
            Export JSON
          </Button>
          <Button onClick={() => setState(prev => ({ ...prev, showRawData: false }))}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Photo Detail Dialog */}
      <Dialog
        open={state.showPhotoDialog}
        onClose={() => setState(prev => ({ ...prev, showPhotoDialog: false }))}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Photo Analysis Detail
          <IconButton onClick={() => setState(prev => ({ ...prev, showPhotoDialog: false }))}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {state.photoAnalysisResults[state.selectedPhotoIndex] && (
            <Box>
              <img 
                src={state.photoAnalysisResults[state.selectedPhotoIndex].photoData}
                alt={`Analysis photo ${state.selectedPhotoIndex + 1}`}
                style={{ width: '100%', borderRadius: brandConfig.layout.borderRadius, marginBottom: 16 }}
              />
              <Typography variant="h6">
                {state.photoAnalysisResults[state.selectedPhotoIndex].timestamp} - 
                Photo {state.selectedPhotoIndex + 1}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Confidence: {Math.round(state.photoAnalysisResults[state.selectedPhotoIndex].confidence * 100)}%
              </Typography>
              {state.photoAnalysisResults[state.selectedPhotoIndex].insights.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Analysis Insights:</Typography>
                  {state.photoAnalysisResults[state.selectedPhotoIndex].insights.map((insight, idx) => (
                    <Typography key={idx} variant="body2" sx={{ ml: 2, mt: 0.5 }}>
                      • {insight}
                    </Typography>
                  ))}
                </Box>
              )}
              {state.photoAnalysisResults[state.selectedPhotoIndex].analysis && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Raw Analysis Data:</Typography>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5',
                    padding: 8,
                    borderRadius: 4,
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    marginTop: 8
                  }}>
                    {JSON.stringify(state.photoAnalysisResults[state.selectedPhotoIndex].analysis, null, 2)}
                  </pre>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}; 