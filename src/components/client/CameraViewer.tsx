import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  IconButton, 
  Chip,
  Grid,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  ZoomIn, 
  ArrowLeft, 
  ArrowRight, 
  Fullscreen, 
  VolumeUp,
  Videocam,
  Lock,
  Circle
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { clientDashboardConfig } from '../../config/clientDashboardData';
import type { ICameraViewerProps, ICameraFeed } from '../../interfaces/ClientTypes';

export const CameraViewer: React.FC<ICameraViewerProps> = ({
  cameras,
  activeCameraId,
  onCameraChange,
  onControlAction,
  userSubscription
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const activeCamera = cameras.find(cam => cam.id === activeCameraId);
  const availableCameras = cameras.filter(cam => 
    !cam.isPremium || userSubscription === 'premium' || userSubscription === 'premium-plus'
  );
  const premiumCameras = cameras.filter(cam => cam.isPremium);

  const styles = {
    container: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}08, ${brandConfig.colors.hunterGreen}08)`,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      marginBottom: '2rem'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem',
      paddingBottom: '1.5rem',
      borderBottom: `2px solid ${brandConfig.colors.sterlingSilver}30`,
      flexWrap: 'wrap',
      gap: '1rem',
      [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
        flexDirection: 'column',
        alignItems: 'stretch'
      }
    },
    headerTitle: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary
    },
    headerSubtitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary,
      marginTop: '0.25rem'
    },
    headerActions: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
        flexDirection: 'column',
        width: '100%',
        gap: '0.5rem'
      }
    },

    cameraFeed: {
      position: 'relative',
      width: '100%',
      height: '400px',
      background: brandConfig.colors.midnightBlack,
      borderRadius: brandConfig.layout.borderRadius,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: brandConfig.colors.arenaSand,
      fontSize: brandConfig.typography.fontSizeLg,
      overflow: 'hidden',
      border: `2px solid ${brandConfig.colors.stableMahogany}40`,
      [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
        height: '280px'
      }
    },
    liveIndicator: {
      position: 'absolute',
      top: '1.5rem',
      left: '1.5rem',
      background: brandConfig.colors.errorRed,
      color: brandConfig.colors.arenaSand,
      padding: '0.25rem 1rem',
      borderRadius: '20px',
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    liveDot: {
      width: '8px',
      height: '8px',
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    cameraControls: {
      position: 'absolute',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '0.25rem',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '0.5rem',
      borderRadius: '25px',
      [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
        gap: '0.5rem',
        padding: '0.75rem',
        borderRadius: '30px'
      }
    },
    controlButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: brandConfig.colors.arenaSand,
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)'
      },
      [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
        width: brandConfig.mobile.touchTargets.preferred,
        height: brandConfig.mobile.touchTargets.preferred
      }
    },
    cameraInfo: {
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cameraName: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary
    },
    cameraQuality: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary
    },
    cameraStatus: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.successGreen,
      fontFamily: brandConfig.typography.fontSecondary
    },

    upgradePanel: {
      background: `linear-gradient(135deg, ${brandConfig.colors.ribbonBlue}, ${brandConfig.colors.infoBlue})`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '1.5rem',
      marginTop: '1.5rem',
      textAlign: 'center',
      color: brandConfig.colors.arenaSand
    },
    upgradeTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      marginBottom: '0.5rem',
      fontFamily: brandConfig.typography.fontPrimary
    },
    upgradeDescription: {
      fontSize: brandConfig.typography.fontSizeBase,
      marginBottom: '1.5rem',
      fontFamily: brandConfig.typography.fontSecondary
    },
    upgradeButton: {
      backgroundColor: brandConfig.colors.arenaSand,
      color: brandConfig.colors.ribbonBlue,
      fontWeight: brandConfig.typography.weightSemiBold,
      '&:hover': {
        backgroundColor: brandConfig.colors.sterlingSilver
      }
    },
    // New thumbnail grid styles
    thumbnailSection: {
      marginTop: '2rem'
    },
    thumbnailSectionTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      marginBottom: '1rem'
    },
    thumbnailCard: {
      border: `2px solid ${brandConfig.colors.sterlingSilver}30`,
      borderRadius: brandConfig.layout.borderRadius,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      '&:hover': {
        borderColor: brandConfig.colors.hunterGreen,
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`
      }
    },
    thumbnailCardActive: {
      borderColor: brandConfig.colors.hunterGreen,
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}10, ${brandConfig.colors.hunterGreen}05)`,
      boxShadow: `0 2px 8px ${brandConfig.colors.hunterGreen}30`
    },
    thumbnailCardPremium: {
      borderColor: brandConfig.colors.ribbonBlue,
      background: `linear-gradient(135deg, ${brandConfig.colors.ribbonBlue}10, ${brandConfig.colors.arenaSand}05)`,
      position: 'relative'
    },
    thumbnailPreview: {
      width: '100%',
      height: '80px',
      background: brandConfig.colors.sterlingSilver,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: brandConfig.colors.hunterGreen,
      position: 'relative'
    },
    thumbnailPreviewLive: {
      background: brandConfig.colors.midnightBlack,
      color: brandConfig.colors.arenaSand
    },
    thumbnailLiveIndicator: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      backgroundColor: brandConfig.colors.errorRed,
      color: brandConfig.colors.arenaSand,
      borderRadius: '50%',
      width: '12px',
      height: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    thumbnailPremiumLock: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    thumbnailInfo: {
      padding: '0.75rem'
    },
    thumbnailTitle: {
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      marginBottom: '0.25rem',
      lineHeight: 1.2
    },
    thumbnailStatus: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.hunterGreen,
      fontFamily: brandConfig.typography.fontSecondary,
      lineHeight: 1.2
    }
  };

  const handleCameraSelect = (camera: ICameraFeed) => {
    if (camera.isPremium && userSubscription !== 'premium' && userSubscription !== 'premium-plus') {
      alert(clientDashboardConfig.messages.upgradePrompt);
      return;
    }
    onCameraChange(camera.id);
  };

  const handleControlAction = (action: string) => {
    if (onControlAction) {
      onControlAction(action);
    }
    console.log('Camera control:', action);
  };

  return (
    <Card sx={styles.container}>
      <Box sx={styles.header}>
        <Box>
          <Typography sx={styles.headerTitle}>
            {clientDashboardConfig.headers.liveCameraMonitoring}
          </Typography>
          <Typography sx={styles.headerSubtitle}>
            {clientDashboardConfig.messages.liveCameraDescription}
          </Typography>
        </Box>
        <Box sx={styles.headerActions}>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
                minHeight: brandConfig.mobile.touchTargets.preferred,
                fontSize: brandConfig.typography.fontSizeBase
              }
            }}
          >
            {clientDashboardConfig.buttons.mobileApp}
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            sx={{
              [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
                minHeight: brandConfig.mobile.touchTargets.preferred,
                fontSize: brandConfig.typography.fontSizeBase
              }
            }}
          >
            {clientDashboardConfig.buttons.cameraSettings}
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            color="error"
            sx={{
              [`@media (max-width: ${brandConfig.layout.breakpoints.mobileMd})`]: {
                minHeight: brandConfig.mobile.touchTargets.preferred,
                fontSize: brandConfig.typography.fontSizeBase
              }
            }}
          >
            {clientDashboardConfig.buttons.startRecording}
          </Button>
        </Box>
      </Box>

      {/* Main Video Feed - Full Width */}
      <Box sx={styles.cameraFeed}>
        <Box sx={styles.liveIndicator}>
          <Circle sx={{ ...styles.liveDot, fontSize: '8px' }} />
          {clientDashboardConfig.cameraStatus.live}
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Videocam sx={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <Typography variant="h6">
            {activeCamera?.name || 'Select a camera'}
          </Typography>
          {activeCamera && (
            <Typography variant="body2" sx={{ opacity: 0.7, marginTop: '0.25rem' }}>
              {activeCamera.quality} • {activeCamera.features.join(' • ')}
            </Typography>
          )}
        </Box>

        <Box sx={styles.cameraControls}>
          <Tooltip title={clientDashboardConfig.cameraControls.zoomIn}>
            <IconButton 
              sx={styles.controlButton}
              onClick={() => handleControlAction('zoom-in')}
            >
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title={clientDashboardConfig.cameraControls.panLeft}>
            <IconButton 
              sx={styles.controlButton}
              onClick={() => handleControlAction('pan-left')}
            >
              <ArrowLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title={clientDashboardConfig.cameraControls.panRight}>
            <IconButton 
              sx={styles.controlButton}
              onClick={() => handleControlAction('pan-right')}
            >
              <ArrowRight />
            </IconButton>
          </Tooltip>
          <Tooltip title={clientDashboardConfig.cameraControls.fullscreen}>
            <IconButton 
              sx={styles.controlButton}
              onClick={() => handleControlAction('fullscreen')}
            >
              <Fullscreen />
            </IconButton>
          </Tooltip>
          <Tooltip title={clientDashboardConfig.cameraControls.audio}>
            <IconButton 
              sx={styles.controlButton}
              onClick={() => handleControlAction('audio')}
            >
              <VolumeUp />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Camera Info Bar */}
      {activeCamera && (
        <Box sx={styles.cameraInfo}>
          <Box>
            <Typography sx={styles.cameraName}>
              {activeCamera.name}
            </Typography>
            <Typography sx={styles.cameraQuality}>
              {activeCamera.quality} • {activeCamera.features.join(' • ')}
            </Typography>
          </Box>
          <Typography sx={styles.cameraStatus}>
            {clientDashboardConfig.cameraStatus.online}
          </Typography>
        </Box>
      )}

      {/* Camera Thumbnails Grid - Under Main Feed */}
      <Box sx={styles.thumbnailSection}>
        <Typography sx={styles.thumbnailSectionTitle}>
          {clientDashboardConfig.headers.availableCameras || 'Available Cameras'}
        </Typography>
        
        <Grid container spacing={2}>
          {availableCameras.map((camera) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={camera.id}>
              <Card
                sx={{
                  ...styles.thumbnailCard,
                  ...(activeCameraId === camera.id && styles.thumbnailCardActive)
                }}
                onClick={() => handleCameraSelect(camera)}
              >
                <Box sx={{
                  ...styles.thumbnailPreview,
                  ...(camera.isLive && styles.thumbnailPreviewLive)
                }}>
                  <Videocam sx={{ fontSize: '1.5rem' }} />
                  {camera.isLive && (
                    <Box sx={styles.thumbnailLiveIndicator}>
                      <Circle sx={{ fontSize: '6px' }} />
                    </Box>
                  )}
                </Box>
                <Box sx={styles.thumbnailInfo}>
                  <Typography sx={styles.thumbnailTitle}>
                    {camera.name}
                  </Typography>
                  <Typography sx={styles.thumbnailStatus}>
                    {camera.quality}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}

          {premiumCameras.map((camera) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={camera.id}>
              <Card
                sx={{
                  ...styles.thumbnailCard,
                  ...styles.thumbnailCardPremium
                }}
                onClick={() => handleCameraSelect(camera)}
              >
                <Box sx={styles.thumbnailPreview}>
                  <Videocam sx={{ fontSize: '1.5rem', opacity: 0.5 }} />
                  <Box sx={styles.thumbnailPremiumLock}>
                    <Lock sx={{ fontSize: '10px' }} />
                  </Box>
                </Box>
                <Box sx={styles.thumbnailInfo}>
                  <Typography sx={styles.thumbnailTitle}>
                    {camera.name}
                  </Typography>
                  <Typography sx={styles.thumbnailStatus}>
                    {clientDashboardConfig.cameraStatus.upgradeRequired}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Premium Upgrade Panel */}
        {premiumCameras.length > 0 && (userSubscription !== 'premium-plus') && (
          <Box sx={styles.upgradePanel}>
            <Typography sx={styles.upgradeTitle}>
              {clientDashboardConfig.messages.unlockMoreCameras}
            </Typography>
            <Typography sx={styles.upgradeDescription}>
              {clientDashboardConfig.messages.unlockDescription}
            </Typography>
            <Button 
              variant="contained" 
              size="small"
              sx={styles.upgradeButton}
            >
              {clientDashboardConfig.buttons.upgradeNow}
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
}; 