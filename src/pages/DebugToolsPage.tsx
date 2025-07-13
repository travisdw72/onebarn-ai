// 🛠️ Comprehensive Debug & Development Tools Dashboard
// Centralized access to all testing, debugging, and development tools

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Build,
  Science,
  Psychology,
  CameraAlt,
  VideoLibrary,
  Analytics,
  BugReport,
  Speed,
  Timeline,
  Storage,
  ExpandMore,
  PlayArrow,
  Visibility,
  Assessment,
  Settings,
  Code,
  Memory
} from '@mui/icons-material';
import { brandConfig } from '../config/brandConfig';
import { useNavigation } from '../contexts/NavigationContext';

interface IToolCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tools: IDebugTool[];
}

interface IDebugTool {
  id: string;
  name: string;
  description: string;
  route?: string;
  status: 'working' | 'experimental' | 'deprecated' | 'new';
  lastUsed?: string;
  component?: string;
}

export const DebugToolsPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toolCategories: IToolCategory[] = [
    {
      id: 'ai-testing',
      title: 'AI Testing & Analysis',
      description: 'Tools for testing and validating AI models',
      icon: <Psychology />,
      tools: [
        {
          id: 'single-image-analyzer',
          name: 'Single Image AI Analyzer',
          description: 'Test AI analysis on individual images with detailed output',
          route: 'ai-testing-single-image',
          status: 'working',
          lastUsed: '2024-12-06',
          component: 'SingleImageAnalyzer.tsx'
        },
        {
          id: 'threshold-tester',
          name: 'Simple Threshold Tester',
          description: 'Debug and test image processing thresholds',
          route: 'simple-threshold-tester', 
          status: 'working',
          lastUsed: '2024-12-05',
          component: 'SimpleThresholdTester.tsx'
        },
        {
          id: 'horse-detection',
          name: 'Horse Detection Tester',
          description: 'Pre-AI horse detection system testing',
          route: 'horse-detection-tester',
          status: 'experimental',
          lastUsed: '2024-12-04',
          component: 'HorseDetectionTester.tsx'
        },
        {
          id: 'batch-tester',
          name: 'Batch Testing Tool',
          description: 'Automated batch testing for horse detection algorithms',
          route: 'batch-tester',
          status: 'working',
          lastUsed: '2024-12-03',
          component: 'BatchTester.tsx'
        },
        {
          id: 'overnight-test',
          name: 'Overnight AI Testing',
          description: 'Long-running AI optimization and performance tests',
          route: 'overnight-test',
          status: 'experimental',
          lastUsed: '2024-12-02',
          component: 'OvernightTestPage.tsx'
        }
      ]
    },
    {
      id: 'camera-testing',
      title: 'Camera & Video Testing',
      description: 'Camera connectivity and video analysis testing',
      icon: <CameraAlt />,
      tools: [
        {
          id: 'camera-feed-debug',
          name: 'Camera Feed Debugger',
          description: 'Debug camera connections and streaming issues',
          route: 'camera-feed',
          status: 'working',
          component: 'CameraFeedPage.tsx'
        },
        {
          id: 'wyze-v4-debug',
          name: 'Wyze V4 Camera Debug',
          description: 'Test and debug Wyze V4 camera integration',
          route: 'wyze-v4-dashboard',
          status: 'experimental',
          component: 'WyzeV4Dashboard.tsx'
        },
        {
          id: 'video-upload-test',
          name: 'Video Upload Testing',
          description: 'Test video upload and processing pipeline',
          route: 'video-upload',
          status: 'working',
          component: 'VideoUpload.tsx'
        },
        {
          id: 'reolink-camera-demo',
          name: 'ReoLink Camera Integration',
          description: 'Real camera feeds with smart AI monitoring and cost optimization',
          route: 'reolink-demo',
          status: 'new',
          lastUsed: new Date().toISOString().split('T')[0],
          component: 'ReoLinkCameraDemo.tsx'
        }
      ]
    },
    {
      id: 'demo-development',
      title: 'Demo Development',
      description: 'Internal demos and development prototypes',
      icon: <PlayArrow />,
      tools: [
        {
          id: 'agent-builder',
          name: 'AI Agent Builder Demo',
          description: 'Technical demo for AI agent construction',
          route: 'demo',
          status: 'experimental',
          component: 'AgentBuilderDemo.tsx'
        },
        {
          id: 'role-dashboard',
          name: 'Role Dashboard Demo',
          description: 'Test different user role dashboard views',
          status: 'working',
          component: 'RoleDashboardDemo.tsx'
        },
        {
          id: 'comprehensive-ai',
          name: 'Comprehensive AI Dashboard',
          description: 'Full AI capabilities demonstration',
          status: 'experimental', 
          component: 'ComprehensiveAIDashboardDemo.tsx'
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performance & Optimization',
      description: 'Performance testing and optimization tools',
      icon: <Speed />,
      tools: [
        {
          id: 'token-optimization',
          name: 'Token Optimization Testing',
          description: 'Test and measure API token usage optimization',
          status: 'experimental',
          component: 'Python testing suite'
        },
        {
          id: 'memory-profiler',
          name: 'Memory Usage Profiler',
          description: 'Monitor React component memory usage',
          status: 'new',
          component: 'Built-in browser tools'
        },
        {
          id: 'render-performance',
          name: 'Render Performance Monitor',
          description: 'Track component render times and optimization',
          status: 'new',
          component: 'React DevTools'
        }
      ]
    },
    {
      id: 'legacy',
      title: 'Legacy & Archive',
      description: 'Deprecated components and legacy code',
      icon: <Storage />,
      tools: [
        {
          id: 'legacy-dashboards',
          name: 'Legacy Dashboard Components',
          description: 'Historical dashboard implementations',
          status: 'deprecated',
          component: '/pages/legacy/*'
        },
        {
          id: 'old-ai-training',
          name: 'Old AI Training Dashboard',
          description: 'Previous AI training interface',
          status: 'deprecated',
          component: 'AITrainingDashboard.tsx'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'success';
      case 'experimental': return 'warning';
      case 'deprecated': return 'error';
      case 'new': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'working': return 'Ready';
      case 'experimental': return 'Beta';
      case 'deprecated': return 'Legacy';
      case 'new': return 'New';
      default: return status;
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? toolCategories 
    : toolCategories.filter(cat => cat.id === selectedCategory);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.background,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Build sx={{ mr: 2, color: brandConfig.colors.stableMahogany }} />
            <Typography 
              variant="h3" 
              sx={{ 
                color: brandConfig.colors.stableMahogany,
                fontFamily: brandConfig.typography.fontDisplay,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              Debug & Development Tools
            </Typography>
          </Box>
          
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Development Environment Only:</strong> These tools are for testing, debugging, and development purposes. 
              Not intended for production use or business demonstrations.
            </Typography>
          </Alert>

          <Typography variant="body1" sx={{ color: brandConfig.colors.neutralGray }}>
            Centralized access to all development tools, testing utilities, and debugging components.
          </Typography>
        </Box>

        {/* Category Filter */}
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Filter by Category:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All Tools"
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              color={selectedCategory === 'all' ? 'primary' : 'default'}
            />
                         {toolCategories.map((category) => (
               <Chip
                 key={category.id}
                 label={category.title}
                 onClick={() => setSelectedCategory(category.id)}
                 variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                 color={selectedCategory === category.id ? 'primary' : 'default'}
               />
             ))}
          </Box>
        </Paper>

        {/* Tool Categories */}
        {filteredCategories.map((category) => (
          <Accordion key={category.id} defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {category.icon}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6">{category.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {category.description}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', mr: 2 }}>
                  <Chip 
                    label={`${category.tools.length} tools`} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Grid container spacing={2}>
                {category.tools.map((tool) => (
                  <Grid item xs={12} md={6} lg={4} key={tool.id}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        cursor: tool.route ? 'pointer' : 'default',
                        '&:hover': tool.route ? {
                          boxShadow: brandConfig.layout.boxShadow,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out'
                        } : {}
                      }}
                      onClick={() => tool.route && navigateTo(tool.route as any)}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" component="h3">
                            {tool.name}
                          </Typography>
                          <Chip
                            label={getStatusLabel(tool.status)}
                            size="small"
                            color={getStatusColor(tool.status) as any}
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {tool.description}
                        </Typography>
                        
                        {tool.component && (
                          <Typography variant="caption" sx={{ 
                            fontFamily: brandConfig.typography.fontMono,
                            backgroundColor: brandConfig.colors.surface,
                            p: 0.5,
                            borderRadius: 1,
                            display: 'block',
                            mb: 1
                          }}>
                            {tool.component}
                          </Typography>
                        )}
                        
                        {tool.lastUsed && (
                          <Typography variant="caption" color="textSecondary">
                            Last used: {tool.lastUsed}
                          </Typography>
                        )}
                        
                        {tool.route && (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlayArrow />}
                              fullWidth
                              onClick={(e) => {
                                e.stopPropagation();
                                navigateTo(tool.route as any);
                              }}
                            >
                              Open Tool
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Visibility />}
                onClick={() => navigateTo('home')}
              >
                Back to Home
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Assessment />}
                onClick={() => navigateTo('admin-dashboard')}
              >
                Admin Dashboard
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CameraAlt />}
                onClick={() => navigateTo('camera-monitor')}
              >
                Camera Monitor
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<VideoLibrary />}
                onClick={() => navigateTo('video-analysis-demo')}
              >
                Video Demo
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}; 