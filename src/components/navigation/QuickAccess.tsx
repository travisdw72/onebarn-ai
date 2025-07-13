import React from 'react';
import { 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  Grid, 
  Box, 
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { 
  CameraAlt,
  Visibility,
  Dashboard,
  FavoriteBorder,
  Videocam,
  Monitor,
  Warning,
  TrendingUp,
  PlayArrow,
  Analytics
} from '@mui/icons-material';
import { useNavigation } from '../../contexts/NavigationContext';
import { brandConfig } from '../../config/brandConfig';

export const QuickAccess: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Card 
      sx={{ 
        margin: '20px',
        borderColor: brandConfig.colors.hunterGreen,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: `2px solid ${brandConfig.colors.hunterGreen}`
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h4" sx={{ fontSize: '20px' }}>🚀</Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontDisplay,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            Quick Access - Horse Monitoring
          </Typography>
        </Box>

        {/* Action Cards Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Live Camera Monitoring */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: brandConfig.colors.hunterGreen + '20',
                border: `2px solid ${brandConfig.colors.hunterGreen}`,
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <CameraAlt 
                  sx={{ 
                    fontSize: '32px', 
                    color: brandConfig.colors.hunterGreen,
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: brandConfig.colors.hunterGreen, 
                    mb: 1,
                    fontWeight: brandConfig.typography.weightBold
                  }}
                >
                  Live Camera Monitoring
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    mb: 2,
                    color: brandConfig.colors.midnightBlack
                  }}
                >
                  Real-time AI analysis for horse health
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Videocam />}
                  onClick={() => navigateTo('camera-monitor')}
                  sx={{ 
                    backgroundColor: brandConfig.colors.hunterGreen,
                    '&:hover': {
                      backgroundColor: brandConfig.colors.hunterGreen + 'DD'
                    },
                    width: '100%',
                    height: '45px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Start Monitoring
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Simple Camera Feed */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: brandConfig.colors.ribbonBlue + '20',
                border: `2px solid ${brandConfig.colors.ribbonBlue}`,
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Monitor 
                  sx={{ 
                    fontSize: '32px', 
                    color: brandConfig.colors.ribbonBlue,
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: brandConfig.colors.ribbonBlue, 
                    mb: 1,
                    fontWeight: brandConfig.typography.weightBold
                  }}
                >
                  Simple Camera Feed
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    mb: 2,
                    color: brandConfig.colors.midnightBlack
                  }}
                >
                  Basic camera monitoring view
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Visibility />}
                  onClick={() => navigateTo('camera-feed')}
                  sx={{ 
                    width: '100%',
                    height: '45px',
                    fontSize: '14px',
                    borderColor: brandConfig.colors.ribbonBlue,
                    color: brandConfig.colors.ribbonBlue,
                    '&:hover': {
                      borderColor: brandConfig.colors.ribbonBlue,
                      backgroundColor: brandConfig.colors.ribbonBlue + '10'
                    }
                  }}
                >
                  View Feed
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Video Upload */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: brandConfig.colors.victoryRose + '20',
                border: `2px solid ${brandConfig.colors.victoryRose}`,
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Analytics 
                  sx={{ 
                    fontSize: '32px', 
                    color: brandConfig.colors.victoryRose,
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: brandConfig.colors.victoryRose, 
                    mb: 1,
                    fontWeight: brandConfig.typography.weightBold
                  }}
                >
                  Video Analysis
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    mb: 2,
                    color: brandConfig.colors.midnightBlack
                  }}
                >
                  Upload horse videos for AI analysis
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigateTo('video-upload')}
                  sx={{ 
                    width: '100%',
                    height: '45px',
                    fontSize: '14px',
                    borderColor: brandConfig.colors.victoryRose,
                    color: brandConfig.colors.victoryRose,
                    '&:hover': {
                      borderColor: brandConfig.colors.victoryRose,
                      backgroundColor: brandConfig.colors.victoryRose + '10'
                    }
                  }}
                >
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Dashboard */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                backgroundColor: brandConfig.colors.championGold + '20',
                border: `2px solid ${brandConfig.colors.championGold}`,
                borderRadius: '8px',
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Dashboard 
                  sx={{ 
                    fontSize: '32px', 
                    color: brandConfig.colors.championGold,
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: brandConfig.colors.championGold, 
                    mb: 1,
                    fontWeight: brandConfig.typography.weightBold
                  }}
                >
                  AI Insights Dashboard
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    mb: 2,
                    color: brandConfig.colors.midnightBlack
                  }}
                >
                  Advanced AI analytics and trends
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FavoriteBorder />}
                  onClick={() => navigateTo('ai-dashboard')}
                  sx={{ 
                    width: '100%',
                    height: '45px',
                    fontSize: '14px',
                    borderColor: brandConfig.colors.championGold,
                    color: brandConfig.colors.championGold,
                    '&:hover': {
                      borderColor: brandConfig.colors.championGold,
                      backgroundColor: brandConfig.colors.championGold + '10'
                    }
                  }}
                >
                  View Insights
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Stats Row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <CameraAlt sx={{ color: brandConfig.colors.hunterGreen }} />
                <Typography variant="h6" sx={{ color: brandConfig.colors.hunterGreen }}>
                  0
                </Typography>
                <Typography variant="body2">ready</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: brandConfig.colors.sterlingSilver }}>
                Active Cameras
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Monitor sx={{ color: brandConfig.colors.ribbonBlue }} />
                <Typography variant="h6" sx={{ color: brandConfig.colors.ribbonBlue }}>
                  Ready
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: brandConfig.colors.sterlingSilver }}>
                Monitoring Status
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <FavoriteBorder sx={{ color: brandConfig.colors.pastureSage }} />
                <Typography variant="h6" sx={{ color: brandConfig.colors.pastureSage }}>
                  Online
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: brandConfig.colors.sterlingSilver }}>
                AI Analysis
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Tips and Information */}
        <Box sx={{ 
          p: 2,
          backgroundColor: brandConfig.colors.arenaSand,
          borderRadius: '8px',
          borderLeft: `4px solid ${brandConfig.colors.stableMahogany}`,
          mb: 2
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: '16px' }}>💡</Typography>
                <Typography variant="body2" sx={{ fontSize: '13px' }}>
                  <strong style={{ color: brandConfig.colors.stableMahogany }}>Pro Tip:</strong>{' '}
                  Start camera monitoring to get real-time AI analysis of your horse's health, behavior, and movement patterns!
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: '16px' }}>🐎</Typography>
                <Typography variant="body2" sx={{ fontSize: '13px' }}>
                  <strong style={{ color: brandConfig.colors.hunterGreen }}>Monitoring:</strong>{' '}
                  Detect lameness, colic signs, behavioral changes, and respiratory issues automatically.
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Feature Highlights */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="🔍 Motion Detection" 
            size="small"
            sx={{ 
              backgroundColor: brandConfig.colors.victoryRose,
              color: 'white',
              fontSize: '12px'
            }}
          />
          <Chip 
            label="🧠 Health Analysis" 
            size="small"
            sx={{ 
              backgroundColor: brandConfig.colors.ribbonBlue,
              color: 'white',
              fontSize: '12px'
            }}
          />
          <Chip 
            label="⏰ 24/7 Monitoring" 
            size="small"
            sx={{ 
              backgroundColor: brandConfig.colors.pastureSage,
              color: 'white',
              fontSize: '12px'
            }}
          />
          <Chip 
            label="🚨 Auto Alerts" 
            size="small"
            sx={{ 
              backgroundColor: brandConfig.colors.championGold,
              color: 'white',
              fontSize: '12px'
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickAccess; 