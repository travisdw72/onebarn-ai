import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Chip,
  Stack,
  IconButton,
  Collapse,
  Alert,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Psychology,
  Analytics,
  Visibility,
  Camera,
  Assessment
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';

// Interface for raw analysis data
interface RawAnalysisData {
  analysisResult?: any;
  sceneDescription?: any;
  photoAnalysisResults?: any[];
  videoInfo?: any;
  [key: string]: any;
}

export interface AIAnalysisDisplayProps {
  rawDataContent: string;
  showTitle?: boolean;
  compactView?: boolean;
  timestamp?: string;
}

export const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({
  rawDataContent,
  showTitle = true,
  compactView = false,
  timestamp
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    aiAnalysis: true,
    detailedOutput: false,
    photoResults: false,
    technical: false
  });

  // Parse raw JSON data
  const [parsedData, setParsedData] = useState<RawAnalysisData | null>(() => {
    try {
      return JSON.parse(rawDataContent);
    } catch (error) {
      console.error('Failed to parse analysis data:', error);
      return null;
    }
  });

  const isCompactMode = compactView || isMobile;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionIcon = (section: string) => {
    const iconMap = {
      aiAnalysis: <Psychology />,
      detailedOutput: <Analytics />,
      photoResults: <Camera />,
      technical: <Assessment />
    };
    return iconMap[section as keyof typeof iconMap] || <Analytics />;
  };

  if (!parsedData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Unable to parse analysis data. Please check the raw data format.
        </Typography>
      </Alert>
    );
  }

  const analysis = parsedData.analysisResult || {};
  const photos = parsedData.photoAnalysisResults || [];
  const videoInfo = parsedData.videoInfo || {};

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    sectionHeader: {
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: isCompactMode ? '0.9rem' : '1.1rem'
    },
    aiOutputCard: {
      backgroundColor: 'rgba(44, 85, 48, 0.05)',
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.hunterGreen}`,
      mb: 2,
      p: 2
    },
    expandButton: {
      color: brandConfig.colors.stableMahogany
    },
    rawDataBox: {
      backgroundColor: '#f8f9fa',
      borderRadius: 4,
      padding: 12,
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      overflow: 'auto',
      border: '1px solid #e0e0e0',
      whiteSpace: 'pre-wrap'
    }
  };

  // Extract key AI insights from the analysis
  const getAIInsights = () => {
    const insights = [];
    
    // Get the raw AI analysis text if available
    if (analysis.rawAnalysis) {
      insights.push({
        title: "🤖 Raw AI Analysis",
        content: analysis.rawAnalysis
      });
    }

    // Get detailed analysis if available
    if (analysis.detailedAnalysis) {
      insights.push({
        title: "📋 Detailed Analysis",
        content: analysis.detailedAnalysis
      });
    }

    // Get clinical assessment details
    if (analysis.clinicalAssessment) {
      if (analysis.clinicalAssessment.posturalAnalysis) {
        insights.push({
          title: "🏃 Postural Analysis",
          content: analysis.clinicalAssessment.posturalAnalysis
        });
      }
      if (analysis.clinicalAssessment.behavioralNotes) {
        insights.push({
          title: "🧠 Behavioral Notes",
          content: analysis.clinicalAssessment.behavioralNotes
        });
      }
    }

    // Get recommendations
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      insights.push({
        title: "💡 AI Recommendations",
        content: analysis.recommendations.join('\n• ')
      });
    }

    // Get insights array
    if (analysis.insights && analysis.insights.length > 0) {
      insights.push({
        title: "🔍 Key Insights",
        content: analysis.insights.join('\n• ')
      });
    }

    return insights;
  };

  const aiInsights = getAIInsights();

  return (
    <Card sx={styles.container}>
      {showTitle && (
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Psychology sx={{ color: brandConfig.colors.hunterGreen }} />
              <Typography variant="h6" sx={styles.sectionHeader}>
                🤖 AI Video Analysis Results
              </Typography>
            </Stack>
          }
          subheader={timestamp && `Analyzed at ${new Date(timestamp).toLocaleTimeString()}`}
        />
      )}
      
      <CardContent>
        {/* Main AI Analysis Section */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSectionIcon('aiAnalysis')}
              <Typography variant="subtitle1" sx={styles.sectionHeader}>
                🎯 AI Analysis Output
              </Typography>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => toggleSection('aiAnalysis')}
              sx={styles.expandButton}
            >
              {expandedSections.aiAnalysis ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expandedSections.aiAnalysis}>
            <Box sx={{ mt: 2 }}>
              {aiInsights.length > 0 ? (
                <Stack spacing={2}>
                  {aiInsights.map((insight, index) => (
                    <Paper key={index} sx={styles.aiOutputCard}>
                      <Typography variant="subtitle2" sx={{ 
                        color: brandConfig.colors.stableMahogany, 
                        fontWeight: 'bold',
                        mb: 1 
                      }}>
                        {insight.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line'
                      }}>
                        {insight.content}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">
                  No AI analysis text found. The analysis may be structured differently.
                </Alert>
              )}
            </Box>
          </Collapse>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: brandConfig.colors.stableMahogany }}>
            📊 Quick Stats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: brandConfig.colors.hunterGreen }}>
                  {analysis.confidence ? `${Math.round(analysis.confidence * 100)}%` : 'N/A'}
                </Typography>
                <Typography variant="caption">Confidence</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: analysis.horseDetected ? brandConfig.colors.hunterGreen : '#d32f2f' }}>
                  {analysis.horseDetected ? '✓' : '✗'}
                </Typography>
                <Typography variant="caption">Horse Detected</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {photos.length || 0}
                </Typography>
                <Typography variant="caption">Photos</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: brandConfig.colors.stableMahogany }}>
                  {analysis.alertLevel || 'N/A'}
                </Typography>
                <Typography variant="caption">Alert Level</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Detailed Raw Output */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSectionIcon('detailedOutput')}
              <Typography variant="subtitle1" sx={styles.sectionHeader}>
                📋 Complete Analysis Data
              </Typography>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => toggleSection('detailedOutput')}
              sx={styles.expandButton}
            >
              {expandedSections.detailedOutput ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expandedSections.detailedOutput}>
            <Box sx={{ mt: 2 }}>
              <Box sx={styles.rawDataBox}>
                {JSON.stringify(analysis, null, 2)}
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* Photo Analysis Results */}
        {photos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                {getSectionIcon('photoResults')}
                <Typography variant="subtitle1" sx={styles.sectionHeader}>
                  📸 Individual Photo Results ({photos.length})
                </Typography>
              </Stack>
              <IconButton 
                size="small" 
                onClick={() => toggleSection('photoResults')}
                sx={styles.expandButton}
              >
                {expandedSections.photoResults ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Stack>

            <Collapse in={expandedSections.photoResults}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {photos.map((photo: any, index: number) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          📷 Photo {index + 1} - {photo.timestamp}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Confidence: {photo.confidence ? `${Math.round(photo.confidence * 100)}%` : 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Status: <Chip label={photo.status} size="small" />
                        </Typography>
                        {photo.insights && photo.insights.length > 0 && (
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Insights:
                            </Typography>
                            <ul>
                              {photo.insights.map((insight: string, i: number) => (
                                <li key={i}>
                                  <Typography variant="caption">{insight}</Typography>
                                </li>
                              ))}
                            </ul>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Box>
        )}

        {/* Technical Details */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSectionIcon('technical')}
              <Typography variant="subtitle1" sx={styles.sectionHeader}>
                🔧 Technical Information
              </Typography>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => toggleSection('technical')}
              sx={styles.expandButton}
            >
              {expandedSections.technical ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expandedSections.technical}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {videoInfo.displayName && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Video:</strong> {videoInfo.displayName}
                    </Typography>
                  </Grid>
                )}
                {videoInfo.category && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Category:</strong> {videoInfo.category}
                    </Typography>
                  </Grid>
                )}
                {analysis.timestamp && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>Analysis Time:</strong> {new Date(analysis.timestamp).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AIAnalysisDisplay; 