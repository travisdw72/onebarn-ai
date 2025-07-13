import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  Paper,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore,
  Warning,
  CheckCircle,
  Info,
  Error as ErrorIcon,
  MonitorHeart,
  Speed,
  Assessment,
  Timeline,
  Visibility,
  LocalHospital,
  Analytics,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  SmartToy
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { SceneDescriptionDisplay, ISceneDescriptionData } from '../video-analysis/SceneDescriptionDisplay';

// Enhanced analysis result structure based on aiPromptsConfig
interface EnhancedVideoAnalysisResult {
  timestamp: string;
  horseDetected: boolean;
  confidence: number;
  healthRisk?: number;  // Made optional since it can be undefined
  alertLevel: 'low' | 'medium' | 'high' | 'critical';
  activityLevel?: number;  // Made optional since it can be undefined
  behaviorScore?: number;  // Made optional since it can be undefined
  
  // Scene description from enhanced AI prompts
  sceneDescription?: ISceneDescriptionData;
  
  // Comprehensive health metrics from aiPromptsConfig
  healthMetrics: {
    overallHealthScore: number;
    mobilityScore: number;
    behavioralScore: number;
    respiratoryScore: number;
    postureScore: number;
  };
  
  // Clinical assessments
  clinicalAssessment: {
    posturalAnalysis: string;
    mobilityAssessment: string;
    respiratoryObservation: string;
    behavioralNotes: string;
  };
  
  // Enhanced clinical data from aiPromptsConfig
  precisionLamenessAnalysis?: {
    lamenessDetected: boolean;
    affectedLimbs: Array<{
      limb: 'LF' | 'RF' | 'LH' | 'RH';
      grade: number; // 0-5 AAEP scale
      confidence: number;
      primaryIndicators: string[];
    }>;
    biomechanicalMeasurements: {
      verticalAsymmetry: {
        head: number; // mm
        pelvis: number; // mm
      };
      temporalAsymmetry: {
        stancePhase: Record<string, number>;
        swingPhase: Record<string, number>;
      };
      strideMetrics: {
        length: Record<string, number>;
        frequency: number;
        regularity: number;
      };
    };
    compensatoryPatterns: string[];
    differentialDiagnosis: Array<{
      condition: string;
      likelihood: number;
    }>;
    recommendedDiagnostics: string[];
  };
  
  // Colic risk assessment from aiPromptsConfig
  colicRiskAssessment?: {
    colicAssessmentScore: number; // 0-12 CAS scale
    riskCategory: 'none' | 'mild' | 'moderate' | 'severe';
    behavioralBreakdown: {
      restlessness: number;
      pawing: number;
      flankWatching: number;
      lyingBehavior: number;
      stretching: number;
      sweating: number;
    };
    temporalPattern: {
      behaviorFrequency: Record<string, number>;
      painCycles: boolean;
      escalating: boolean;
    };
    videoTimestamps: {
      criticalBehaviors: Array<{ behavior: string; timestamp: string }>;
      peakPainMoments: string[];
    };
    criticalWarnings: string[];
    recommendedActions: {
      immediate: string[];
      monitoring: string;
      veterinaryContact: {
        required: boolean;
        urgency: string;
        estimatedTimeframe: string;
      };
    };
  };
  
  // Emergency indicators from aiPromptsConfig
  emergencyIndicators?: {
    emergencyDetected: boolean;
    emergencyType: string | null;
    severity: 'critical' | 'urgent' | 'monitor';
    actionRequired: 'CALL_VET_NOW' | 'URGENT_ATTENTION' | 'MONITOR_CLOSELY';
    specificInstructions: string;
    estimatedResponseTime: 'immediate' | 'within_30min' | 'within_2hr';
    videoTimestamp: string;
    confidenceLevel: number;
  };
  
  // Alerts with severity levels
  alerts: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: string;
  }>;
  
  // Risk assessment
  riskAssessment: {
    overallRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskScore: number;
    immediateRisks: string[];
    monitoringNeeded: string[];
  };
  
  // Recommendations and insights
  recommendations: string[];
  insights: string[];
  
  // Metadata
  metadata: {
    captureTimestamp: string;
    segmentIndex: number;
    videoDuration: number;
    videoSize: number;
    processingTime: number;
  };
}

interface EnhancedVideoAnalysisDisplayProps {
  analysisData: EnhancedVideoAnalysisResult | null;
  isAnalyzing: boolean;
  horseName: string;
  onDataUpdate?: (data: EnhancedVideoAnalysisResult) => void;
}

export const EnhancedVideoAnalysisDisplay: React.FC<EnhancedVideoAnalysisDisplayProps> = ({
  analysisData,
  isAnalyzing,
  horseName,
  onDataUpdate
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    overview: true,
    sceneDescription: true,  // Scene description visible by default
    healthMetrics: true,
    clinicalAssessment: false,
    alerts: false,
    riskAssessment: false,
    recommendations: false,
    metadata: false,
    rawAiResponse: false
  });

  // Update data when received
  useEffect(() => {
    if (analysisData && onDataUpdate) {
      onDataUpdate(analysisData);
    }
  }, [analysisData, onDataUpdate]);

  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 85) return brandConfig.colors.hunterGreen;
    if (score >= 70) return brandConfig.colors.alertAmber;
    if (score >= 50) return brandConfig.colors.alertAmber;
    return brandConfig.colors.stableMahogany;
  };

  const getAlertSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return brandConfig.colors.stableMahogany;
      case 'high': return brandConfig.colors.alertAmber;
      case 'medium': return brandConfig.colors.alertAmber;
      default: return brandConfig.colors.hunterGreen;
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <ErrorIcon color="error" />;
      case 'high': return <Warning color="warning" />;
      case 'moderate': return <Info color="info" />;
      default: return <CheckCircle color="success" />;
    }
  };

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius
    },
    scoreCard: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    alertCard: {
      mb: 1,
      borderLeft: '4px solid',
      borderRadius: brandConfig.layout.borderRadius
    },
    sectionHeader: {
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontDisplay,
      fontWeight: brandConfig.typography.weightBold
    }
  };

  if (isAnalyzing) {
    return (
      <Card sx={styles.container}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Analytics sx={{ fontSize: 48, color: brandConfig.colors.hunterGreen }} />
            <Typography variant="h6" sx={styles.sectionHeader}>
              Analyzing {horseName}...
            </Typography>
            <LinearProgress 
              sx={{ 
                width: '100%', 
                height: 8,
                borderRadius: 4,
                backgroundColor: brandConfig.colors.sterlingSilver 
              }} 
            />
            <Typography variant="body2" color="textSecondary">
              Processing 30-second video segment with AI health assessment
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card sx={styles.container}>
        <CardContent>
          <Typography variant="h6" sx={styles.sectionHeader}>
            No Analysis Data Available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Upload a video and start analysis to see comprehensive health metrics
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Safety check for required properties
  if (!analysisData.healthMetrics || !analysisData.clinicalAssessment || !analysisData.riskAssessment) {
    return (
      <Card sx={styles.container}>
        <CardContent>
          <Typography variant="h6" sx={styles.sectionHeader}>
            ⚠️ Incomplete Analysis Data
          </Typography>
          <Typography variant="body2" color="textSecondary">
            The analysis data is missing required properties. Please try the analysis again.
          </Typography>
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Debug: Missing {!analysisData.healthMetrics ? 'healthMetrics ' : ''}
            {!analysisData.clinicalAssessment ? 'clinicalAssessment ' : ''}
            {!analysisData.riskAssessment ? 'riskAssessment' : ''}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography 
        variant="h5" 
        sx={{ 
          ...styles.sectionHeader,
          mb: 3,
          textAlign: 'center'
        }}
      >
        🎬 Enhanced AI Analysis: {horseName}
      </Typography>

      {/* Overview Section */}
      <Accordion 
        expanded={expandedSections.overview}
        onChange={() => handleSectionToggle('overview')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <MonitorHeart color="primary" />
            <Typography variant="h6">Overview & Key Metrics</Typography>
            <Badge 
              badgeContent={analysisData.alertLevel.toUpperCase()} 
              color={analysisData.alertLevel === 'critical' ? 'error' : 
                     analysisData.alertLevel === 'high' ? 'warning' : 'primary'}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Paper sx={styles.scoreCard}>
                <Typography variant="h4" sx={{ 
                  color: getHealthScoreColor(analysisData.healthMetrics.overallHealthScore)
                }}>
                  {analysisData.healthMetrics.overallHealthScore}
                </Typography>
                <Typography variant="caption">Overall Health</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={styles.scoreCard}>
                <Typography variant="h4" sx={{ 
                  color: brandConfig.colors.hunterGreen 
                }}>
                  {(analysisData.confidence * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption">AI Confidence</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={styles.scoreCard}>
                <Typography variant="h4" sx={{ 
                  color: getHealthScoreColor(analysisData.activityLevel || 50)
                }}>
                  {analysisData.activityLevel || 50}
                </Typography>
                <Typography variant="caption">Activity Level</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={styles.scoreCard}>
                <Typography variant="h4" sx={{ 
                  color: getHealthScoreColor(100 - ((analysisData.healthRisk || 0) * 100))
                }}>
                  {((analysisData.healthRisk || 0) * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption">Risk Score</Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Scene Description Section - NEW */}
      {analysisData.sceneDescription && (
        <Box sx={{ mb: 2 }}>
          <SceneDescriptionDisplay
            sceneData={analysisData.sceneDescription}
            showTitle={true}
            compactView={isMobile}
            timestamp={analysisData.timestamp}
            videoId={analysisData.metadata?.segmentIndex?.toString() || '1'}
          />
        </Box>
      )}

      {/* Health Metrics Section */}
      <Accordion 
        expanded={expandedSections.healthMetrics}
        onChange={() => handleSectionToggle('healthMetrics')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Assessment color="primary" />
            <Typography variant="h6">Detailed Health Metrics</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {Object.entries(analysisData.healthMetrics).map(([metric, score]) => (
              <Grid item xs={12} sm={6} md={4} key={metric}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ 
                      color: getHealthScoreColor(score),
                      mb: 1
                    }}>
                      {score}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={score} 
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: brandConfig.colors.sterlingSilver,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getHealthScoreColor(score)
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Clinical Assessment Section */}
      <Accordion 
        expanded={expandedSections.clinicalAssessment}
        onChange={() => handleSectionToggle('clinicalAssessment')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Visibility color="primary" />
            <Typography variant="h6">Clinical Assessment</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Assessment Type</strong></TableCell>
                  <TableCell><strong>Observation</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(analysisData.clinicalAssessment).map(([type, observation]) => (
                  <TableRow key={type}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {observation || 'No specific observations noted'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Alerts Section */}
      {analysisData.alerts && analysisData.alerts.length > 0 && (
        <Accordion 
          expanded={expandedSections.alerts}
          onChange={() => handleSectionToggle('alerts')}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalHospital color="primary" />
              <Typography variant="h6">Active Alerts</Typography>
              <Badge badgeContent={analysisData.alerts.length} color="error" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {analysisData.alerts.map((alert, index) => (
                <Card 
                  key={index}
                  sx={{
                    ...styles.alertCard,
                    borderLeftColor: getAlertSeverityColor(alert.severity)
                  }}
                >
                  <CardContent sx={{ py: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {alert.type}
                        </Typography>
                        <Typography variant="body2">
                          {alert.description}
                        </Typography>
                      </Box>
                      <Chip 
                        label={alert.severity.toUpperCase()} 
                        size="small"
                        sx={{ 
                          backgroundColor: getAlertSeverityColor(alert.severity),
                          color: 'white'
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Risk Assessment Section */}
      <Accordion 
        expanded={expandedSections.riskAssessment}
        onChange={() => handleSectionToggle('riskAssessment')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {getRiskLevelIcon(analysisData.riskAssessment.overallRiskLevel)}
            <Typography variant="h6">Risk Assessment</Typography>
            <Chip 
              label={analysisData.riskAssessment.overallRiskLevel.toUpperCase()}
              color={analysisData.riskAssessment.overallRiskLevel === 'critical' ? 'error' : 
                     analysisData.riskAssessment.overallRiskLevel === 'high' ? 'warning' : 'primary'}
              size="small"
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Immediate Risks
              </Typography>
              {analysisData.riskAssessment.immediateRisks.length > 0 ? (
                <Stack spacing={0.5}>
                  {analysisData.riskAssessment.immediateRisks.map((risk, index) => (
                    <Alert key={index} severity="warning">
                      {risk}
                    </Alert>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No immediate risks identified
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Monitoring Needed
              </Typography>
              {analysisData.riskAssessment.monitoringNeeded.length > 0 ? (
                <Stack spacing={0.5}>
                  {analysisData.riskAssessment.monitoringNeeded.map((item, index) => (
                    <Alert key={index} severity="info">
                      {item}
                    </Alert>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Standard monitoring protocol sufficient
                </Typography>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Recommendations Section */}
      <Accordion 
        expanded={expandedSections.recommendations}
        onChange={() => handleSectionToggle('recommendations')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TrendingUp color="primary" />
            <Typography variant="h6">AI Recommendations & Insights</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Recommendations
              </Typography>
              {analysisData.recommendations.length > 0 ? (
                <Stack spacing={1}>
                  {analysisData.recommendations.map((rec, index) => (
                    <Paper key={index} sx={{ p: 1, bgcolor: brandConfig.colors.arenaSand }}>
                      <Typography variant="body2">
                        • {rec}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Continue standard care protocols
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Key Insights
              </Typography>
              {analysisData.insights.length > 0 ? (
                <Stack spacing={1}>
                  {analysisData.insights.map((insight, index) => (
                    <Paper key={index} sx={{ p: 1, bgcolor: brandConfig.colors.arenaSand }}>
                      <Typography variant="body2">
                        • {insight}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No specific insights at this time
                </Typography>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Metadata Section */}
      <Accordion 
        expanded={expandedSections.metadata}
        onChange={() => handleSectionToggle('metadata')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Timeline color="primary" />
            <Typography variant="h6">Analysis Metadata</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Capture Time
              </Typography>
              <Typography variant="body2">
                {new Date(analysisData.metadata.captureTimestamp).toLocaleTimeString()}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Segment Index
              </Typography>
              <Typography variant="body2">
                {analysisData.metadata.segmentIndex}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Video Duration
              </Typography>
              <Typography variant="body2">
                {analysisData.metadata.videoDuration}s
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="textSecondary">
                Processing Time
              </Typography>
              <Typography variant="body2">
                {(analysisData.metadata.processingTime / 1000).toFixed(1)}s
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Raw AI Response Section */}
      <Accordion 
        expanded={expandedSections.rawAiResponse}
        onChange={() => handleSectionToggle('rawAiResponse')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SmartToy sx={{ color: brandConfig.colors.stableMahogany }} />
            <Typography variant="h6">🤖 Raw AI Response Data</Typography>
            <Chip 
              label="DEBUG" 
              size="small" 
              sx={{ 
                backgroundColor: brandConfig.colors.alertAmber,
                color: 'white',
                fontSize: '10px'
              }} 
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            This shows exactly what Claude AI returned. Useful for debugging and seeing the complete analysis.
          </Typography>
          
          <Paper 
            sx={{ 
              p: 2, 
              backgroundColor: brandConfig.colors.sterlingSilver,
              border: `1px solid ${brandConfig.colors.sterlingSilver}`,
              maxHeight: '400px',
              overflow: 'auto'
            }}
          >
            <pre 
              style={{ 
                margin: 0,
                fontSize: '11px',
                fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: brandConfig.colors.stableMahogany,
                lineHeight: 1.4
              }}
            >
              {JSON.stringify(analysisData, null, 2)}
            </pre>
          </Paper>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              📊 Data Structure Overview:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
              <Chip 
                label={`Confidence: ${(analysisData.confidence * 100).toFixed(1)}%`}
                size="small"
                sx={{ backgroundColor: brandConfig.colors.hunterGreen, color: 'white' }}
              />
                             <Chip 
                 label={`Health Risk: ${((analysisData.healthRisk || 0) * 100).toFixed(1)}%`}
                 size="small"
                 sx={{ backgroundColor: brandConfig.colors.alertAmber, color: 'white' }}
               />
              <Chip 
                label={`Alert Level: ${analysisData.alertLevel.toUpperCase()}`}
                size="small"
                sx={{ backgroundColor: brandConfig.colors.stableMahogany, color: 'white' }}
              />
              <Chip 
                label={`Horse Detected: ${analysisData.horseDetected ? 'YES' : 'NO'}`}
                size="small"
                sx={{ backgroundColor: analysisData.horseDetected ? brandConfig.colors.hunterGreen : brandConfig.colors.sterlingSilver, color: 'white' }}
              />
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}; 