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
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  ExpandMore,
  ExpandLess,
  Camera,
  LocationOn,
  Palette,
  WbSunny,
  Home,
  Info
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { videoAnalysisConfig } from '../../config/videoAnalysisConfig';

// Interface for scene description data from AI analysis
export interface ISceneDescriptionData {
  environment: {
    setting: string;
    surfaceType: string;
    surfaceCondition: string;
    lighting: string;
    weatherVisible: string;
  };
  horseDescription: {
    coatColor: string;
    markings: string;
    approximateSize: string;
    bodyCondition: string;
    tackEquipment: string[];
  };
  positioning: {
    locationInFrame: string;
    orientation: string;
    distanceFromCamera: string;
    postureGeneral: string;
  };
  backgroundElements: string[];
  cameraQuality: {
    imageClarity: string;
    cameraAngle: string;
    fieldOfView: string;
  };
  overallSceneAssessment: string;
}

export interface ISceneDescriptionDisplayProps {
  sceneData: ISceneDescriptionData;
  showTitle?: boolean;
  compactView?: boolean;
  timestamp?: string;
  videoId?: string;
}

export const SceneDescriptionDisplay: React.FC<ISceneDescriptionDisplayProps> = ({
  sceneData,
  showTitle = true,
  compactView = false,
  timestamp,
  videoId
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    environment: !compactView,
    horseDescription: !compactView,
    positioning: false,
    cameraQuality: false
  });

  // Apply compact view automatically on mobile
  const isCompactMode = compactView || isMobile;
  const config = videoAnalysisConfig.sceneDescription;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSectionIcon = (section: string) => {
    const iconMap = {
      environment: <Home />,
      horseDescription: <Palette />,
      positioning: <LocationOn />,
      cameraQuality: <Camera />
    };
    return iconMap[section as keyof typeof iconMap] || <Info />;
  };

  const getQualityColor = (quality: string) => {
    const qualityMap = {
      'excellent': config.qualityColors.excellent,
      'clear': config.qualityColors.good,
      'good': config.qualityColors.good,
      'fair': config.qualityColors.fair,
      'poor': config.qualityColors.poor,
      'critical': config.qualityColors.critical
    };
    return qualityMap[quality.toLowerCase() as keyof typeof qualityMap] || theme.palette.text.secondary;
  };

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}`
    },
    sectionHeader: {
      color: brandConfig.colors.stableMahogany,
      fontWeight: brandConfig.typography.weightBold,
      fontSize: isCompactMode ? '0.9rem' : '1rem'
    },
    overallAssessment: {
      backgroundColor: 'rgba(44, 85, 48, 0.05)',
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.hunterGreen}`,
      marginBottom: brandConfig.spacing.md
    },
    detailChip: {
      margin: '2px',
      fontSize: '0.75rem'
    },
    expandButton: {
      color: brandConfig.colors.stableMahogany
    }
  };

  return (
    <Card sx={styles.container}>
      {showTitle && (
        <CardHeader
          title={
            <Stack direction="row" alignItems="center" spacing={1}>
              <Visibility sx={{ color: brandConfig.colors.hunterGreen }} />
              <Typography variant="h6" sx={styles.sectionHeader}>
                {videoAnalysisConfig.labels.sceneDescription}
              </Typography>
            </Stack>
          }
          subheader={timestamp && `Analyzed at ${new Date(timestamp).toLocaleTimeString()}`}
        />
      )}
      
      <CardContent>
        {/* Overall Scene Assessment - Always Visible */}
        <Box sx={styles.overallAssessment}>
          <Typography variant="subtitle2" sx={styles.sectionHeader} gutterBottom>
            🤖 {videoAnalysisConfig.labels.sceneAssessment}
          </Typography>
          <Typography variant="body2">
            {sceneData.overallSceneAssessment}
          </Typography>
        </Box>

        {/* Environment Section */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSectionIcon('environment')}
              <Typography variant="subtitle2" sx={styles.sectionHeader}>
                {config.icons.environment} {videoAnalysisConfig.labels.environmentDetails}
              </Typography>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => toggleSection('environment')}
              sx={styles.expandButton}
            >
              {expandedSections.environment ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expandedSections.environment}>
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4}>
                  <Chip 
                    label={`${config.icons.setting} ${sceneData.environment.setting}`}
                    size="small"
                    sx={styles.detailChip}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Chip 
                    label={`${config.icons.surfaceType} ${sceneData.environment.surfaceType}`}
                    size="small"
                    sx={styles.detailChip}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Chip 
                    label={`${config.icons.lighting} ${sceneData.environment.lighting}`}
                    size="small"
                    sx={styles.detailChip}
                  />
                </Grid>
                {sceneData.environment.weatherVisible !== 'not visible' && (
                  <Grid item xs={6} sm={4}>
                    <Chip 
                      label={`${config.icons.weatherVisible} ${sceneData.environment.weatherVisible}`}
                      size="small"
                      sx={styles.detailChip}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Horse Description Section */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              {getSectionIcon('horseDescription')}
              <Typography variant="subtitle2" sx={styles.sectionHeader}>
                {config.icons.horseDescription} {videoAnalysisConfig.labels.horseDescription}
              </Typography>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => toggleSection('horseDescription')}
              sx={styles.expandButton}
            >
              {expandedSections.horseDescription ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Stack>

          <Collapse in={expandedSections.horseDescription}>
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Chip 
                    label={`${config.icons.coatColor} ${sceneData.horseDescription.coatColor}`}
                    size="small"
                    sx={styles.detailChip}
                  />
                </Grid>
                {sceneData.horseDescription.markings && (
                  <Grid item xs={12} sm={6}>
                    <Chip 
                      label={`Markings: ${sceneData.horseDescription.markings}`}
                      size="small"
                      sx={styles.detailChip}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Chip 
                    label={`Size: ${sceneData.horseDescription.approximateSize}`}
                    size="small"
                    sx={styles.detailChip}
                  />
                </Grid>
                {sceneData.horseDescription.tackEquipment.length > 0 && (
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      <Typography variant="caption" sx={{ alignSelf: 'center', mr: 1 }}>
                        {config.icons.tackEquipment} Equipment:
                      </Typography>
                      {sceneData.horseDescription.tackEquipment.map((item, index) => (
                        <Chip 
                          key={index}
                          label={item}
                          size="small"
                          sx={styles.detailChip}
                        />
                      ))}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Collapse>
        </Box>

        {/* Additional Sections for Detailed View */}
        {!isCompactMode && (
          <>
            <Divider sx={{ my: 1 }} />

            {/* Positioning Section */}
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getSectionIcon('positioning')}
                  <Typography variant="subtitle2" sx={styles.sectionHeader}>
                    {config.icons.positioning} {videoAnalysisConfig.labels.positioning}
                  </Typography>
                </Stack>
                <IconButton 
                  size="small" 
                  onClick={() => toggleSection('positioning')}
                  sx={styles.expandButton}
                >
                  {expandedSections.positioning ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>

              <Collapse in={expandedSections.positioning}>
                <Box sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Chip 
                        label={`Frame: ${sceneData.positioning.locationInFrame}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip 
                        label={`View: ${sceneData.positioning.orientation}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip 
                        label={`Distance: ${sceneData.positioning.distanceFromCamera}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip 
                        label={`Posture: ${sceneData.positioning.postureGeneral}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Camera Quality Section */}
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getSectionIcon('cameraQuality')}
                  <Typography variant="subtitle2" sx={styles.sectionHeader}>
                    {config.icons.cameraQuality} {videoAnalysisConfig.labels.cameraQuality}
                  </Typography>
                </Stack>
                <IconButton 
                  size="small" 
                  onClick={() => toggleSection('cameraQuality')}
                  sx={styles.expandButton}
                >
                  {expandedSections.cameraQuality ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Stack>

              <Collapse in={expandedSections.cameraQuality}>
                <Box sx={{ mt: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Chip 
                        label={`${config.icons.imageClarity} ${sceneData.cameraQuality.imageClarity}`}
                        size="small"
                        sx={{
                          ...styles.detailChip,
                          backgroundColor: getQualityColor(sceneData.cameraQuality.imageClarity),
                          color: 'white'
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Chip 
                        label={`Angle: ${sceneData.cameraQuality.cameraAngle}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Chip 
                        label={`View: ${sceneData.cameraQuality.fieldOfView}`}
                        size="small"
                        sx={styles.detailChip}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>
            </Box>
          </>
        )}

        {/* Background Elements (if any) */}
        {sceneData.backgroundElements.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="textSecondary">
              Background: {sceneData.backgroundElements.join(', ')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SceneDescriptionDisplay; 