// Demo page for the Comprehensive AI Dashboard
// Shows the full capabilities of the AI Training & Competition Command Center

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ButtonGroup
} from '@mui/material';
import {
  CheckCircle,
  Speed,
  EmojiEvents,
  Psychology,
  Analytics,
  MonitorHeart,
  Timer,
  FilterList,
  Terrain,
  Forest,
  SelfImprovement,
  DirectionsRun,
  SportsHockey,
  FitnessCenter,
  DirectionsCar,
  Agriculture
} from '@mui/icons-material';

import { brandConfig } from '../../config/brandConfig';
import { ComprehensiveAIDashboard } from './ComprehensiveAIDashboard';
import { 
  setDisciplineFilter, 
  getDisciplineFilterPresets, 
  getCurrentFilterInfo 
} from '../../config/aiDashboardConfig';

export const ComprehensiveAIDashboardDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('overview');
  const filterPresets = getDisciplineFilterPresets();

  const handleFilterDemo = (filterName: string) => {
    setDisciplineFilter(filterName);
    setSelectedDemo('dashboard');
  };

  const styles = {
    container: {
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh',
      padding: '2rem'
    },
    header: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: '2rem',
      textAlign: 'center' as const
    },
    section: {
      marginBottom: '3rem'
    },
    card: {
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      height: '100%'
    },
    filterButton: {
      margin: '0.5rem',
      borderRadius: brandConfig.layout.borderRadius
    }
  };

  const OverviewSection = () => (
    <Box sx={styles.section}>
      <Card sx={styles.card}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
            🏆 Platform Capabilities
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">
              **DISCIPLINE FILTERING NOW AVAILABLE!** 🎯
            </Typography>
            <Typography>
              Perfect for barns that specialize in specific disciplines - English-only, Western-only, Roping-only, and more!
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.hunterGreen }}>
                🏇 **Discipline Specialization Examples**
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon><EmojiEvents sx={{ color: brandConfig.colors.championGold }} /></ListItemIcon>
                  <ListItemText 
                    primary="English Disciplines Only" 
                    secondary="Dressage, Show Jumping, Eventing, Hunter - Perfect for English barns!"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Speed sx={{ color: brandConfig.colors.victoryRose }} /></ListItemIcon>
                  <ListItemText 
                    primary="Western Disciplines Only" 
                    secondary="Barrel Racing, Cutting, Reining, Western Pleasure"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Psychology sx={{ color: brandConfig.colors.pastureSage }} /></ListItemIcon>
                  <ListItemText 
                    primary="Roping Specialists" 
                    secondary="Team Roping, Calf Roping, Breakaway Roping"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DirectionsRun sx={{ color: brandConfig.colors.infoBlue }} /></ListItemIcon>
                  <ListItemText 
                    primary="Specialty Disciplines" 
                    secondary="Endurance, Polo, Vaulting, Driving"
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.ribbonBlue }}>
                🎯 **Try Different Barn Types**
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(filterPresets).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={key === 'english' ? 'contained' : 'outlined'}
                    onClick={() => handleFilterDemo(key)}
                    sx={styles.filterButton}
                    startIcon={
                      key === 'english' ? <EmojiEvents /> :
                      key === 'western' ? <Speed /> :
                      key === 'roping' ? <Psychology /> :
                      key === 'specialty' ? <DirectionsRun /> :
                      key === 'competition' ? <Timer /> :
                      key === 'ranch' ? <Agriculture /> :
                      <FilterList />
                    }
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {preset.name}
                      </Typography>
                      <Typography variant="caption">
                        {preset.disciplines.length} disciplines
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ color: brandConfig.colors.stableMahogany }}>
            🚀 **Core Features Available for ALL Discipline Types**
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<Analytics />} 
                label="Real-time AI Coaching" 
                color="primary" 
                variant="outlined" 
                sx={{ width: '100%', mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<Timer />} 
                label="Professional Timing (0.01s)" 
                color="secondary" 
                variant="outlined" 
                sx={{ width: '100%', mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<MonitorHeart />} 
                label="Health Monitoring" 
                color="error" 
                variant="outlined" 
                sx={{ width: '100%', mb: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Chip 
                icon={<Psychology />} 
                label="Multi-Provider AI" 
                color="success" 
                variant="outlined" 
                sx={{ width: '100%', mb: 1 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Card sx={styles.header}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          🤖 AI Training & Competition Command Center
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          Complete AI-Powered Equestrian Training Platform
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
          Real-time analysis • Competition timing • Performance coaching • Health monitoring
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <ButtonGroup variant="contained" sx={{ backgroundColor: brandConfig.colors.arenaSand }}>
            <Button 
              onClick={() => setSelectedDemo('overview')}
              variant={selectedDemo === 'overview' ? 'contained' : 'outlined'}
              sx={{ color: brandConfig.colors.stableMahogany }}
            >
              Platform Overview
            </Button>
            <Button 
              onClick={() => setSelectedDemo('dashboard')}
              variant={selectedDemo === 'dashboard' ? 'contained' : 'outlined'}
              sx={{ color: brandConfig.colors.stableMahogany }}
            >
              Live Dashboard
            </Button>
          </ButtonGroup>
        </Box>
      </Card>

      {/* Content */}
      {selectedDemo === 'overview' && <OverviewSection />}
      {selectedDemo === 'dashboard' && <ComprehensiveAIDashboard />}

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.7 }}>
        <Typography variant="body2">
          🚀 One Barn AI Platform • Revolutionizing Equestrian Training • Built with React, TypeScript, and MUI • Configuration-Driven Architecture
        </Typography>
      </Box>
    </Box>
  );
}; 