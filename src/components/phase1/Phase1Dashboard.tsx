/**
 * Phase 1 Dashboard - Complete AI Ticket System Interface
 * Unified dashboard for all Phase 1 AI ticket system capabilities
 * 
 * @description Main dashboard integrating AI generation, routing, analytics, and security
 * @compliance Multi-tenant with zero trust security and audit trails
 * @author One Barn Development Team
 * @since Phase 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  CircularProgress,
  LinearProgress,
  Badge,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  SmartToy as AIIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Assessment as ReportIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

// Configuration imports
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/dashboardConfig';

// Component imports
import { TicketAnalyticsDashboard } from '../analytics/TicketAnalyticsDashboard';
import { SecurityComplianceDashboard } from '../security/SecurityComplianceDashboard';
import { AIMonitorDashboard } from '../ai-monitor/AIMonitorDashboard';

// Hook imports
import { usePhase1Integration } from '../../hooks/usePhase1Integration';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

// Service imports
import { aiTicketGeneratorService } from '../../services/aiTicketGeneratorService';
import { ticketService } from '../../services/ticketService';

interface IPhase1DashboardProps {
  className?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`phase1-tabpanel-${index}`}
    aria-labelledby={`phase1-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
  </div>
);

export const Phase1Dashboard: React.FC<IPhase1DashboardProps> = ({
  className = ''
}) => {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  
  // Phase 1 integration hook
  const {
    isInitialized,
    loading,
    status,
    analytics,
    errors,
    actions,
    healthScore,
    isHealthy,
    refresh
  } = usePhase1Integration();

  // Local state
  const [activeTab, setActiveTab] = useState(0);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // Effects
  useEffect(() => {
    if (!isInitialized && tenantId) {
      // Initialization is handled by the hook
    }
  }, [isInitialized, tenantId]);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = async () => {
    await refresh();
  };

  const handleGenerateTestTicket = async (type: string) => {
    try {
      const ticket = await actions.generateTestTicket(type);
      setTestResults(prev => [
        { type, ticket, timestamp: new Date().toISOString() },
        ...prev.slice(0, 4)
      ]);
    } catch (error) {
      console.error('Test ticket generation failed:', error);
    }
  };

  const handleRunFullTest = async () => {
    try {
      const testTypes = ['ai_system_alert', 'ai_performance'];
      const results = [];
      
      for (const type of testTypes) {
        const ticket = await actions.generateTestTicket(type);
        const analysis = await actions.analyzeTicketContent(ticket);
        const routing = await actions.getRoutingRecommendation(ticket);
        const escalation = await actions.predictEscalation(ticket);
        
        results.push({
          type,
          ticket,
          analysis,
          routing,
          escalation,
          timestamp: new Date().toISOString()
        });
      }
      
      setTestResults(results);
      await refresh(); // Refresh dashboard data
    } catch (error) {
      console.error('Full test failed:', error);
    }
  };

  // Render status card
  const renderStatusCard = (title: string, value: any, icon: React.ReactNode, color: string) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: brandConfig.typography.weightBold, color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Render system overview
  const renderSystemOverview = () => {
    if (!status) return null;

    return (
      <Grid container spacing={3}>
        {/* Health Score */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={healthScore}
                size={80}
                sx={{ 
                  color: isHealthy ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber 
                }}
              />
              <Typography variant="h6" sx={{ mt: 1, fontWeight: brandConfig.typography.weightBold }}>
                System Health
              </Typography>
              <Chip
                label={status.overall.status.toUpperCase()}
                color={isHealthy ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Service Status Cards */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              {renderStatusCard(
                'AI Generation',
                status.aiTicketGeneration.active ? 'Active' : 'Inactive',
                <AIIcon sx={{ fontSize: 30 }} />,
                status.aiTicketGeneration.active ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber
              )}
            </Grid>
            <Grid item xs={6} sm={3}>
              {renderStatusCard(
                'Smart Routing',
                `${Math.round(status.intelligentRouting.averageConfidence * 100)}%`,
                <TrendingIcon sx={{ fontSize: 30 }} />,
                brandConfig.colors.ribbonBlue
              )}
            </Grid>
            <Grid item xs={6} sm={3}>
              {renderStatusCard(
                'Analytics',
                status.analytics.insightsAvailable,
                <AnalyticsIcon sx={{ fontSize: 30 }} />,
                brandConfig.colors.hunterGreen
              )}
            </Grid>
            <Grid item xs={6} sm={3}>
              {renderStatusCard(
                'Security',
                `${Math.max(0, 100 - status.security.riskScore)}%`,
                <SecurityIcon sx={{ fontSize: 30 }} />,
                brandConfig.colors.stableMahogany
              )}
            </Grid>
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ 
                fontWeight: brandConfig.typography.weightSemiBold,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <TimelineIcon sx={{ color: brandConfig.colors.stableMahogany }} />
                AI System Performance
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">AI Ticket Accuracy</Typography>
                      <Typography variant="body2">{status.aiTicketGeneration.accuracy}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={status.aiTicketGeneration.accuracy} 
                      sx={{ backgroundColor: brandConfig.colors.arenaSand }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Routing Confidence</Typography>
                      <Typography variant="body2">{Math.round(status.intelligentRouting.averageConfidence * 100)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={status.intelligentRouting.averageConfidence * 100} 
                      sx={{ backgroundColor: brandConfig.colors.arenaSand }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Analytics Forecast</Typography>
                      <Typography variant="body2">{status.analytics.forecastConfidence * 100}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={status.analytics.forecastConfidence * 100} 
                      sx={{ backgroundColor: brandConfig.colors.arenaSand }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Security Score</Typography>
                      <Typography variant="body2">{Math.max(0, 100 - status.security.riskScore)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.max(0, 100 - status.security.riskScore)} 
                      sx={{ backgroundColor: brandConfig.colors.arenaSand }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ 
                fontWeight: brandConfig.typography.weightSemiBold,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <SettingsIcon sx={{ color: brandConfig.colors.hunterGreen }} />
                System Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleGenerateTestTicket('ai_system_alert')}
                  sx={{ borderColor: brandConfig.colors.stableMahogany, color: brandConfig.colors.stableMahogany }}
                >
                  Generate Test Ticket
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRunFullTest}
                  sx={{ borderColor: brandConfig.colors.hunterGreen, color: brandConfig.colors.hunterGreen }}
                >
                  Run Full System Test
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => actions.runSecurityAudit()}
                  sx={{ borderColor: brandConfig.colors.ribbonBlue, color: brandConfig.colors.ribbonBlue }}
                >
                  Run Security Audit
                </Button>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowTestPanel(!showTestPanel)}
                  sx={{ borderColor: brandConfig.colors.alertAmber, color: brandConfig.colors.alertAmber }}
                >
                  {showTestPanel ? 'Hide' : 'Show'} Test Results
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results Panel */}
        {showTestPanel && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: brandConfig.typography.weightSemiBold,
                  mb: 2
                }}>
                  Test Results
                </Typography>
                
                {testResults.length === 0 ? (
                  <Alert severity="info">
                    No test results available. Run a test to see results here.
                  </Alert>
                ) : (
                  testResults.map((result, index) => (
                    <Alert key={index} severity="success" sx={{ mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                        Test: {result.type} - {new Date(result.timestamp).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="caption">
                        Ticket ID: {result.ticket.id} | Generated successfully
                      </Typography>
                      {result.routing && (
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Routed to: {result.routing.assignedToName} (Confidence: {Math.round(result.routing.confidence * 100)}%)
                        </Typography>
                      )}
                    </Alert>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* System Errors */}
        {errors.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ 
                  fontWeight: brandConfig.typography.weightSemiBold,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <WarningIcon sx={{ color: brandConfig.colors.errorRed }} />
                  System Alerts ({errors.length})
                </Typography>
                
                {errors.slice(0, 3).map((error, index) => (
                  <Alert key={error.timestamp} severity="error" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                      {error.service.toUpperCase()}: {error.message}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(error.timestamp).toLocaleString()}
                    </Typography>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: brandConfig.colors.barnWhite,
    minHeight: '100vh',
    borderRadius: brandConfig.layout.borderRadius
  };

  if (!isInitialized && loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: brandConfig.colors.stableMahogany }} />
        <Typography sx={{ ml: 2 }}>Initializing Phase 1 AI Ticket System...</Typography>
      </Box>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
        backgroundColor: brandConfig.colors.arenaSand
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ 
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.stableMahogany,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DashboardIcon sx={{ fontSize: 40 }} />
            Phase 1 AI Ticket System
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={errors.length} color="error">
              <Chip 
                label={`Health: ${healthScore}%`}
                color={isHealthy ? 'success' : 'warning'}
                icon={isHealthy ? <SuccessIcon /> : <WarningIcon />}
              />
            </Badge>
            
            <Tooltip title="Refresh All Data">
              <IconButton 
                onClick={handleRefresh}
                disabled={loading}
                sx={{ color: brandConfig.colors.stableMahogany }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 1, color: brandConfig.colors.charcoalGray }}>
          Comprehensive AI-powered ticket management with intelligent routing, analytics, and security monitoring
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightSemiBold
            }
          }}
        >
          <Tab label="System Overview" icon={<DashboardIcon />} iconPosition="start" />
          <Tab label="AI Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Security & Compliance" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="AI Monitoring" icon={<AIIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ p: 3 }}>
        <TabPanel value={activeTab} index={0}>
          {renderSystemOverview()}
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <TicketAnalyticsDashboard 
            maxHeight="600px"
            showExportOptions={true}
          />
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <SecurityComplianceDashboard 
            maxHeight="600px"
            showDetailedAudit={true}
          />
        </TabPanel>
        
        <TabPanel value={activeTab} index={3}>
          <AIMonitorDashboard 
            maxHeight="600px"
            autoRefresh={true}
            showFilters={true}
            showSummary={true}
          />
        </TabPanel>
      </Box>
    </div>
  );
}; 