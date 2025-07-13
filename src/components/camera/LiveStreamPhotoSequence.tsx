import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Stack,
  Alert,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Analytics,
  PhotoCamera,
  Visibility,
  History,
  Close,
  Settings,
  PlayArrow,
  Pause,
  Info,
  ExpandMore,
  CheckCircle,
  Warning,
  ErrorOutline
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { liveStreamConfig } from '../../config/liveStreamConfig';
import { useLiveStreamPhotoSequence } from '../../hooks/useLiveStreamPhotoSequence';

interface IPhotoAnalysisResult {
  photoNumber: number;
  timestamp: string;
  analysisResult?: any;
}

interface ILiveStreamPhotoSequenceProps {
  streamActive: boolean;
  embedUrl?: string;
  onAnalysisComplete?: (analyses: IPhotoAnalysisResult[]) => void;
}

export const LiveStreamPhotoSequence: React.FC<ILiveStreamPhotoSequenceProps> = ({
  streamActive,
  embedUrl,
  onAnalysisComplete
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showHistory, setShowHistory] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedPhotoResult, setSelectedPhotoResult] = React.useState<any>(null);
  const [selectedPhotoForDetail, setSelectedPhotoForDetail] = React.useState<number>(1);
  const [showRawData, setShowRawData] = React.useState(false);
  
  // Python Backend Demo Status
  const [pythonDemoStatus, setPythonDemoStatus] = React.useState<{
    demoEnabled: boolean;
    capturesUsed: number;
    capturesRemaining: number;
    demoExhausted: boolean;
  } | null>(null);

  const {
    // State
    isAnalyzing,
    currentSession,
    analysisHistory,
    demoUsageCount,
    isDemoLimitReached,
    continuousMode,
    nextAnalysisCountdown,
    
    // Actions
    startPhotoSequenceAnalysis,
    startContinuousMode,
    stopContinuousMode,
    resetDemoUsage,
    
    // Python Backend Demo Actions
    checkPythonDemoStatus,
    resetPythonDemo,
    
    // Config
    config
  } = useLiveStreamPhotoSequence();

  // Watch for completed analysis and call callback
  React.useEffect(() => {
    if (onAnalysisComplete && currentSession?.isComplete && currentSession.results.length > 0) {
      console.log('📊 Analysis session completed, calling parent callback...');
      
      // Extract analysis results for the callback
      const analysisResults: IPhotoAnalysisResult[] = currentSession.results
        .filter(result => result.analysisResult)
        .map(result => ({
          photoNumber: result.photoNumber,
          timestamp: result.timestamp,
          analysisResult: result.analysisResult
        }));
      
      if (analysisResults.length > 0) {
        onAnalysisComplete(analysisResults);
        console.log('✅ Called parent callback with', analysisResults.length, 'analysis results');
      }
    }
  }, [currentSession?.isComplete, currentSession?.results, onAnalysisComplete]);

  // Check Python demo status on component mount and periodically
  React.useEffect(() => {
    const updatePythonDemoStatus = async () => {
      const status = await checkPythonDemoStatus();
      if (status) {
        setPythonDemoStatus(status);
      }
    };

    updatePythonDemoStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(updatePythonDemoStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkPythonDemoStatus]);

  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressValue = (): number => {
    if (!currentSession) return 0;
    return (currentSession.completedPhotos / currentSession.totalPhotos) * 100;
  };

  const getHealthRiskColor = (risk: number): string => {
    if (risk <= 0.3) return brandConfig.colors.successGreen;
    if (risk <= 0.6) return brandConfig.colors.championGold;
    if (risk <= 0.8) return brandConfig.colors.alertAmber;
    return brandConfig.colors.errorRed;
  };

  const styles = {
    container: {
      mb: 2
    },
    analyzeButton: {
      minHeight: isMobile ? '56px' : '48px',
      fontSize: isMobile ? '16px' : '14px',
      fontWeight: 'bold',
      borderRadius: brandConfig.layout.borderRadius,
      px: isMobile ? 3 : 2
    },
    progressCard: {
      backgroundColor: brandConfig.colors.arenaSand,
      border: `2px solid ${brandConfig.colors.ribbonBlue}`,
      borderRadius: brandConfig.layout.borderRadius
    },
    resultCard: {
      backgroundColor: 'white',
      border: `1px solid ${brandConfig.colors.hunterGreen}`,
      borderRadius: brandConfig.layout.borderRadius,
      mb: 1
    },
    photoResult: {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: brandConfig.colors.arenaSand,
        transform: 'translateY(-2px)'
      }
    }
  };

  return (
    <Box sx={styles.container}>
      {/* Main Analysis Controls */}
      <Card>
        <CardContent>
          <Stack 
            direction={isMobile ? "column" : "row"} 
            justifyContent="space-between" 
            alignItems={isMobile ? "stretch" : "center"}
            spacing={2}
          >
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: brandConfig.colors.stableMahogany,
                  fontWeight: brandConfig.typography.weightBold,
                  mb: 0.5
                }}
              >
                📸 {config.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {config.demoMode.enabled 
                  ? `Demo Mode: ${demoUsageCount}/${config.demoMode.maxAnalysisCount} analyses used`
                  : `${config.photosPerSequence} photos over ${config.totalSequenceTimeSeconds} seconds`
                }
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              {/* Settings Button */}
              <IconButton
                onClick={() => setShowSettings(true)}
                sx={{ color: brandConfig.colors.hunterGreen }}
              >
                <Settings />
              </IconButton>

              {/* History Button */}
              <IconButton
                onClick={() => setShowHistory(true)}
                sx={{ color: brandConfig.colors.stableMahogany }}
              >
                <History />
              </IconButton>

              {/* Main Analyze Button */}
              <Button
                variant="contained"
                size={isMobile ? "large" : "medium"}
                startIcon={isAnalyzing ? <PhotoCamera /> : <Analytics />}
                onClick={() => startPhotoSequenceAnalysis(false)}
                disabled={!streamActive || isAnalyzing || isDemoLimitReached}
                sx={{
                  backgroundColor: isAnalyzing 
                    ? brandConfig.colors.alertAmber 
                    : brandConfig.colors.stableMahogany,
                  '&:hover': {
                    backgroundColor: isAnalyzing 
                      ? brandConfig.colors.alertAmber 
                      : brandConfig.colors.hunterGreen
                  },
                  ...styles.analyzeButton
                }}
              >
                {isAnalyzing 
                  ? config.buttonTextAnalyzing 
                  : config.buttonText
                }
              </Button>

              {/* Real Capture Button */}
              <Button
                variant="outlined"
                size={isMobile ? "large" : "medium"}
                startIcon={<PhotoCamera />}
                onClick={async () => {
                  // Update demo status before capture
                  const status = await checkPythonDemoStatus();
                  if (status) {
                    setPythonDemoStatus(status);
                  }
                  startPhotoSequenceAnalysis(true, embedUrl);
                }}
                disabled={
                  !streamActive || 
                  isAnalyzing || 
                  isDemoLimitReached || 
                  !embedUrl || 
                  (pythonDemoStatus?.demoExhausted ?? false)
                }
                sx={{
                  borderColor: pythonDemoStatus?.demoExhausted 
                    ? brandConfig.colors.victoryRose 
                    : brandConfig.colors.championGold,
                  color: pythonDemoStatus?.demoExhausted 
                    ? brandConfig.colors.victoryRose 
                    : brandConfig.colors.championGold,
                  '&:hover': {
                    borderColor: pythonDemoStatus?.demoExhausted 
                      ? brandConfig.colors.victoryRose 
                      : brandConfig.colors.championGold,
                    backgroundColor: pythonDemoStatus?.demoExhausted 
                      ? brandConfig.colors.victoryRose + '10' 
                      : brandConfig.colors.championGold + '10',
                  },
                  ...styles.analyzeButton
                }}
              >
                {pythonDemoStatus?.demoExhausted 
                  ? '🚫 Demo Limit Reached' 
                  : `🐍 Real Capture (${pythonDemoStatus?.capturesRemaining ?? '?'} left)`
                }
              </Button>

              {/* Continuous Mode Toggle (Production Only) */}
              {config.productionMode.enabled && (
                <Button
                  variant={continuousMode ? "contained" : "outlined"}
                  size={isMobile ? "large" : "medium"}
                  startIcon={continuousMode ? <Pause /> : <PlayArrow />}
                  onClick={continuousMode ? stopContinuousMode : startContinuousMode}
                  sx={{
                    backgroundColor: continuousMode 
                      ? brandConfig.colors.championGold 
                      : 'transparent',
                    borderColor: brandConfig.colors.championGold,
                    color: continuousMode ? 'white' : brandConfig.colors.championGold,
                    ...styles.analyzeButton
                  }}
                >
                  {continuousMode ? 'Stop Auto' : 'Start Auto'}
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Demo Limit Warning */}
          {config.demoMode.enabled && isDemoLimitReached && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                {config.demoMode.limitReachedMessage}
              </Typography>
              <Button
                size="small"
                onClick={resetDemoUsage}
                sx={{ mt: 1, color: brandConfig.colors.alertAmber }}
              >
                Reset Demo Count (Testing)
              </Button>
            </Alert>
          )}

          {/* Python Backend Demo Status */}
          {pythonDemoStatus?.demoEnabled && (
            <Alert 
              severity={pythonDemoStatus.demoExhausted ? "error" : "info"} 
              sx={{ mt: 2 }}
            >
              <Typography variant="body2">
                <strong>🐍 Python Backend Demo:</strong> {pythonDemoStatus.capturesUsed}/10 real captures used
                {pythonDemoStatus.demoExhausted && " - Demo limit reached!"}
              </Typography>
              {pythonDemoStatus.demoExhausted && (
                <Button
                  size="small"
                  onClick={async () => {
                    const success = await resetPythonDemo();
                    if (success) {
                      const status = await checkPythonDemoStatus();
                      if (status) {
                        setPythonDemoStatus(status);
                      }
                    }
                  }}
                  sx={{ mt: 1, color: brandConfig.colors.alertAmber }}
                >
                  Reset Python Demo (Testing)
                </Button>
              )}
            </Alert>
          )}

          {/* Continuous Mode Countdown */}
          {continuousMode && nextAnalysisCountdown > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Next analysis in: {formatCountdown(nextAnalysisCountdown)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={100 - (nextAnalysisCountdown / (config.productionMode.intervalMinutes * 60)) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: brandConfig.colors.arenaSand,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: brandConfig.colors.championGold
                  }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Current Analysis Progress */}
      {isAnalyzing && currentSession && (
        <Card sx={styles.progressCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.ribbonBlue }}>
              📸 Analyzing Live Stream...
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Progress: {currentSession.completedPhotos}/{currentSession.totalPhotos} photos captured
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getProgressValue()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: brandConfig.colors.arenaSand,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: brandConfig.colors.ribbonBlue
                  }
                }}
              />
            </Box>

            <Typography variant="body2" color="textSecondary">
              {currentSession.completedPhotos === 0 
                ? "Starting photo capture..."
                : currentSession.completedPhotos < currentSession.totalPhotos
                  ? `Capturing photo ${currentSession.completedPhotos + 1}...`
                  : "Processing final results..."
              }
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Latest Analysis Results */}
      {currentSession && currentSession.isComplete && (
        <Card sx={styles.resultCard}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.hunterGreen }}>
              📊 Latest Analysis Results
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">Photos</Typography>
                <Typography variant="h6">{currentSession.completedPhotos}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">Duration</Typography>
                <Typography variant="h6">
                  {Math.round((Date.now() - currentSession.startTime) / 1000)}s
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">Average Confidence</Typography>
                <Typography variant="h6">
                  {Math.round(
                    currentSession.results
                      .filter(r => r.analysisResult)
                      .reduce((acc, r) => acc + (r.analysisResult?.confidence || 0), 0) /
                    currentSession.results.filter(r => r.analysisResult).length || 0
                  )}%
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="textSecondary">Health Risk</Typography>
                <Chip
                  label={`${Math.round(
                    currentSession.results
                      .filter(r => r.analysisResult)
                      .reduce((acc, r) => acc + (r.analysisResult?.healthRisk || 0), 0) /
                    currentSession.results.filter(r => r.analysisResult).length * 100 || 0
                  )}%`}
                  sx={{
                    backgroundColor: getHealthRiskColor(
                      currentSession.results
                        .filter(r => r.analysisResult)
                        .reduce((acc, r) => acc + (r.analysisResult?.healthRisk || 0), 0) /
                      currentSession.results.filter(r => r.analysisResult).length || 0
                    ),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Grid>
            </Grid>

            {/* Photo Results Grid */}
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Individual Photo Results:
            </Typography>
            <Grid container spacing={1}>
              {currentSession.results.map((result, index) => (
                <Grid item xs={6} sm={4} md={2} key={result.photoNumber}>
                  <Card 
                    sx={{
                      ...styles.photoResult,
                      backgroundColor: result.analysisResult 
                        ? brandConfig.colors.arenaSand 
                        : brandConfig.colors.errorRed + '20'
                    }}
                    onClick={() => setSelectedPhotoResult(result)}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" display="block">
                        Photo {result.photoNumber}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {result.analysisResult 
                          ? `${Math.round(result.analysisResult.confidence * 100)}%`
                          : 'Failed'
                        }
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {result.processingTime ? `${result.processingTime}ms` : 'Processing...'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis Results - Similar to Video Upload Page */}
      {currentSession?.isComplete && currentSession.results.length > 0 && (
        <Card sx={{ mt: 3, border: `2px solid ${brandConfig.colors.stableMahogany}` }}>
          <CardContent>
            <Typography 
              variant="h5" 
              sx={{ 
                color: brandConfig.colors.stableMahogany,
                fontWeight: brandConfig.typography.weightBold,
                mb: 3,
                textAlign: 'center'
              }}
            >
              🧠 Detailed Photo Analysis Results
            </Typography>

            {/* Photo Selection Dropdown */}
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Photo Analysis</InputLabel>
                <Select
                  value={selectedPhotoForDetail}
                  onChange={(e) => setSelectedPhotoForDetail(Number(e.target.value))}
                  label="Select Photo Analysis"
                >
                  {currentSession.results
                    .filter(result => result.analysisResult)
                    .map((result) => (
                      <MenuItem key={result.photoNumber} value={result.photoNumber}>
                        {new Date(result.timestamp).toLocaleTimeString()} - Photo {result.photoNumber} Analysis
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Selected Photo Analysis Display */}
            {(() => {
              const selectedResult = currentSession.results.find(r => r.photoNumber === selectedPhotoForDetail);
              if (!selectedResult?.analysisResult) return null;

              const analysisData = selectedResult.analysisResult;
              const timestamp = new Date(selectedResult.timestamp).toLocaleTimeString();

              return (
                <Box>
                  {/* Header */}
                  <Card sx={{ 
                    backgroundColor: brandConfig.colors.stableMahogany,
                    color: brandConfig.colors.arenaSand,
                    mb: 2
                  }}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {timestamp} - Photo {selectedResult.photoNumber} Analysis
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Processing Time: {selectedResult.processingTime}ms
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowRawData(!showRawData)}
                          sx={{ 
                            color: brandConfig.colors.arenaSand,
                            borderColor: brandConfig.colors.arenaSand,
                            '&:hover': {
                              backgroundColor: brandConfig.colors.arenaSand + '20'
                            }
                          }}
                        >
                          {showRawData ? 'Hide' : 'Show'} Raw Data
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Raw Data or Formatted Analysis */}
                  <Card>
                    <CardContent>
                      {showRawData ? (
                        <Box>
                          <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.midnightBlack }}>
                            🤖 Raw Data
                          </Typography>
                          <Box sx={{
                            backgroundColor: brandConfig.colors.arenaSand,
                            p: 2,
                            borderRadius: brandConfig.layout.borderRadius,
                            border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                            maxHeight: '400px',
                            overflow: 'auto'
                          }}>
                            <pre style={{
                              fontSize: brandConfig.typography.fontSizeSm,
                              color: brandConfig.colors.midnightBlack,
                              margin: 0,
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}>
                              {JSON.stringify(analysisData, null, 2)}
                            </pre>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.midnightBlack }}>
                            📊 Analysis Results:
                          </Typography>

                          {/* Image Assessment */}
                          <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <PhotoCamera color="primary" />
                                <Typography variant="h6">Image Assessment</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Horses Detected
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.imageAssessment?.horsesDetected?.count || 0}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Image Quality
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.imageAssessment?.imageQuality || 'Unknown'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Lighting
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.imageAssessment?.lightingConditions || 'Unknown'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Scene Context
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.imageAssessment?.sceneContext || 'Unknown'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Primary Subject Analysis */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Visibility color="primary" />
                                <Typography variant="h6">Primary Subject Analysis</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Subject Type
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.primarySubjectAnalysis?.subjectType || 'None'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Breed Assessment
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.primarySubjectAnalysis?.breedAssessment || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Age Estimate
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.primarySubjectAnalysis?.ageEstimate || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Body Language
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.primarySubjectAnalysis?.bodyLanguage || 'N/A'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Clinical Assessment */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <CheckCircle color="primary" />
                                <Typography variant="h6">Clinical Assessment</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Postural Analysis
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.clinicalAssessment?.posturalAnalysis || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Mobility Assessment
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.clinicalAssessment?.mobilityAssessment || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Behavioral State
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.clinicalAssessment?.behavioralState || 'N/A'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                  <Typography variant="caption" color="textSecondary">
                                    Alertness Level
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.clinicalAssessment?.alertnessLevel || 'N/A'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Health Metrics */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Analytics color="primary" />
                                <Typography variant="h6">Health Metrics</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={6} md={4}>
                                  <Typography variant="caption" color="textSecondary">
                                    Overall Health Score
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.healthMetrics?.overallHealthScore || 0}/100
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                  <Typography variant="caption" color="textSecondary">
                                    Mobility Score
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.healthMetrics?.mobilityScore || 0}/100
                                  </Typography>
                                </Grid>
                                <Grid item xs={6} md={4}>
                                  <Typography variant="caption" color="textSecondary">
                                    Behavioral Score
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.healthMetrics?.behavioralScore || 0}/100
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Risk Assessment */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Warning color="primary" />
                                <Typography variant="h6">Risk Assessment</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="caption" color="textSecondary">
                                    Overall Risk Level
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.riskAssessment?.overallRiskLevel || 'Unknown'}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="caption" color="textSecondary">
                                    Risk Score
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {analysisData.riskAssessment?.riskScore || 0}/100
                                  </Typography>
                                </Grid>
                                {analysisData.riskAssessment?.concerningObservations?.length > 0 && (
                                  <Grid item xs={12}>
                                    <Typography variant="caption" color="textSecondary">
                                      Concerning Observations
                                    </Typography>
                                    <List dense>
                                      {analysisData.riskAssessment.concerningObservations.map((obs: string, idx: number) => (
                                        <ListItem key={idx}>
                                          <ListItemText primary={obs} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Grid>
                                )}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Clinical Recommendations */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Info color="primary" />
                                <Typography variant="h6">Clinical Recommendations</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                {analysisData.clinicalRecommendations?.immediate?.length > 0 && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="error">
                                      Immediate Actions
                                    </Typography>
                                    <List dense>
                                      {analysisData.clinicalRecommendations.immediate.map((rec: string, idx: number) => (
                                        <ListItem key={idx}>
                                          <ListItemText primary={rec} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Grid>
                                )}
                                {analysisData.clinicalRecommendations?.shortTerm?.length > 0 && (
                                  <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="warning.main">
                                      Short Term
                                    </Typography>
                                    <List dense>
                                      {analysisData.clinicalRecommendations.shortTerm.map((rec: string, idx: number) => (
                                        <ListItem key={idx}>
                                          <ListItemText primary={rec} />
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Grid>
                                )}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/* Detailed Clinical Notes */}
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <CheckCircle color="success" />
                                <Typography variant="h6">Detailed Clinical Notes</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                {analysisData.detailedClinicalNotes || 'No detailed notes available'}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Photo Sequence Settings</Typography>
            <IconButton onClick={() => setShowSettings(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Alert severity="info">
              <Typography variant="body2">
                📸 Photos per sequence: {config.photosPerSequence}
              </Typography>
              <Typography variant="body2">
                ⏱️ Capture interval: {config.captureIntervalSeconds} seconds
              </Typography>
              <Typography variant="body2">
                🕐 Total duration: {config.totalSequenceTimeSeconds} seconds
              </Typography>
            </Alert>
            
            {config.demoMode.enabled && (
              <Alert severity="warning">
                <Typography variant="body2">
                  🚧 Demo Mode Active
                </Typography>
                <Typography variant="body2">
                  Usage: {demoUsageCount}/{config.demoMode.maxAnalysisCount}
                </Typography>
              </Alert>
            )}
            
            {config.productionMode.enabled && (
              <Alert severity="success">
                <Typography variant="body2">
                  🚀 Production Mode Available
                </Typography>
                <Typography variant="body2">
                  Continuous analysis every {config.productionMode.intervalMinutes} minutes
                </Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Analysis History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Analysis History</Typography>
            <IconButton onClick={() => setShowHistory(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {analysisHistory.length === 0 ? (
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
              No analysis history yet. Start your first photo sequence analysis!
            </Typography>
          ) : (
            <List>
              {analysisHistory.map((session, index) => (
                <ListItem key={session.sessionId} divider>
                  <ListItemText
                    primary={`Session ${index + 1}: ${session.completedPhotos}/${session.totalPhotos} photos`}
                    secondary={`${new Date(session.startTime).toLocaleString()} - ${
                      session.isComplete ? 'Completed' : 'In Progress'
                    }`}
                  />
                  <Chip
                    label={session.isComplete ? 'Complete' : 'Incomplete'}
                    color={session.isComplete ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Result Detail Dialog */}
      <Dialog 
        open={!!selectedPhotoResult} 
        onClose={() => setSelectedPhotoResult(null)} 
        maxWidth="sm" 
        fullWidth
      >
        {selectedPhotoResult && (
          <>
            <DialogTitle>
              Photo {selectedPhotoResult.photoNumber} Analysis Details
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography variant="body2">
                  <strong>Timestamp:</strong> {new Date(selectedPhotoResult.timestamp).toLocaleString()}
                </Typography>
                
                {selectedPhotoResult.analysisResult ? (
                  <>
                    <Typography variant="body2">
                      <strong>Confidence:</strong> {Math.round(selectedPhotoResult.analysisResult.confidence * 100)}%
                    </Typography>
                    <Typography variant="body2">
                      <strong>Health Risk:</strong> {Math.round(selectedPhotoResult.analysisResult.healthRisk * 100)}%
                    </Typography>
                    <Typography variant="body2">
                      <strong>Processing Time:</strong> {selectedPhotoResult.processingTime}ms
                    </Typography>
                    
                    {selectedPhotoResult.analysisResult.insights && (
                      <Box>
                        <Typography variant="subtitle2">Insights:</Typography>
                        <List dense>
                          {selectedPhotoResult.analysisResult.insights.map((insight: string, idx: number) => (
                            <ListItem key={idx}>
                              <ListItemText primary={insight} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </>
                ) : (
                  <Alert severity="error">
                    Analysis failed for this photo. This may be due to stream capture issues or AI processing errors.
                  </Alert>
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPhotoResult(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}; 