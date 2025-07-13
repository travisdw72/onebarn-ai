import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Badge,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  DeveloperMode as DevelopmentIcon,
  TrendingUp,
  TrendingDown,
  Refresh,
  GetApp,
  Warning,
  CheckCircle,
  Error,
  Info,
  Backup,
  Assessment,
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  SmartToy,
  Database,
  BugReport,
  Lightbulb,
  Api,
  Timeline,
  MoreVert
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { adminDashboardConfig, type IAdminDashboardData, type AdminTabId } from '../../config/adminDashboardData';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../config/permissions.config';

interface IComprehensiveAdminDashboardProps {
  className?: string;
}

/**
 * ComprehensiveAdminDashboard Component
 * 
 * A comprehensive administrative dashboard that provides platform-wide oversight
 * and management capabilities. Follows the config-driven architecture with
 * all content, styling, and configuration sourced from adminDashboardConfig.
 * 
 * Features:
 * - Platform KPIs and health monitoring
 * - Real-time system performance metrics
 * - Client facility management
 * - AI model performance analytics
 * - Support ticket management
 * - Development pipeline tracking
 * - Revenue and growth analytics
 * - RBAC-based access control
 */
const ComprehensiveAdminDashboard: React.FC<IComprehensiveAdminDashboardProps> = ({ 
  className = '' 
}) => {
  const { user } = useAuth();
  
  // Component state
  const [selectedTab, setSelectedTab] = useState<AdminTabId>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | 'day' | 'week' | 'month' | 'quarter'>('day');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Auto-refresh functionality for real-time admin data
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
        console.log('Refreshing admin dashboard data...', new Date().toISOString());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Permission check using RBAC system - only admin role can access
  if (!user || user.role !== 'admin') {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        <AlertTitle>{adminDashboardConfig.messages.unauthorizedAccess}</AlertTitle>
        You do not have permission to access the administrative dashboard.
      </Alert>
    );
  }

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'optimal':
      case 'healthy':
      case 'active':
      case 'online':
        return brandConfig.colors.hunterGreen;
      case 'good':
      case 'stable':
      case 'warning':
        return brandConfig.colors.pastureGreen;
      case 'attention':
      case 'degraded':
      case 'needs-review':
        return brandConfig.colors.championGold;
      case 'critical':
      case 'urgent':
      case 'offline':
      case 'error':
        return brandConfig.colors.victoryRose;
      default:
        return brandConfig.colors.sterlingSilver;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return brandConfig.colors.ribbonBlue;
      case 'warning':
        return brandConfig.colors.championGold;
      case 'error':
      case 'critical':
        return brandConfig.colors.victoryRose;
      default:
        return brandConfig.colors.sterlingSilver;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp sx={{ color: brandConfig.colors.hunterGreen, fontSize: '1rem' }} />;
      case 'down':
        return <TrendingDown sx={{ color: brandConfig.colors.victoryRose, fontSize: '1rem' }} />;
      default:
        return <div style={{ width: '1rem', height: '1rem' }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp; // In production, implement proper timestamp formatting
  };

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: AdminTabId) => {
    setSelectedTab(newValue);
  };

  // Platform KPI Cards Component
  const renderPlatformKPIs = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: brandConfig.colors.midnightBlack }}>
        {adminDashboardConfig.headers.platformKPIs}
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(adminDashboardConfig.platformKPIs).map(([key, kpi]) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={key}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  borderLeft: `4px solid ${getStatusColor(kpi.status)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: brandConfig.shadows?.medium || '0 4px 8px rgba(0,0,0,0.12)'
                  },
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.label}
                    </Typography>
                    <Tooltip title={adminDashboardConfig.tooltips.platformKPIs}>
                      {getTrendIcon(kpi.trend)}
                    </Tooltip>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: brandConfig.colors.midnightBlack }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: getStatusColor(kpi.status), mb: 1, fontWeight: 'medium' }}>
                    {kpi.change}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Platform Alerts Component
  const renderPlatformAlerts = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
            <Warning sx={{ color: brandConfig.colors.championGold }} />
            {adminDashboardConfig.platformAlerts.title}
          </Typography>
          <Button 
            size="small" 
            startIcon={<Refresh />}
            onClick={() => console.log('Refreshing alerts...')}
          >
            {adminDashboardConfig.buttons.refresh}
          </Button>
        </Box>
        {adminDashboardConfig.platformAlerts.alerts.length === 0 ? (
          <Alert severity="success">
            <AlertTitle>{adminDashboardConfig.messages.noAlerts}</AlertTitle>
            {adminDashboardConfig.messages.systemHealthy}
          </Alert>
        ) : (
          <Stack spacing={2}>
            {adminDashboardConfig.platformAlerts.alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                severity={alert.severity === 'critical' ? 'error' : alert.severity as any}
                action={
                  alert.actionRequired && (
                    <Button color="inherit" size="small">
                      {adminDashboardConfig.buttons.resolve}
                    </Button>
                  )
                }
              >
                <AlertTitle>{alert.title}</AlertTitle>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {alert.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Impact: {alert.impact} • {formatTimestamp(alert.timestamp)}
                  {alert.affectedFacilities && ` • ${alert.affectedFacilities} facilities affected`}
                </Typography>
              </Alert>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );

  // System Performance Metrics Component
  const renderSystemPerformance = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <Speed sx={{ color: brandConfig.colors.ribbonBlue }} />
          {adminDashboardConfig.systemPerformance.title}
        </Typography>
        <Grid container spacing={2}>
          {adminDashboardConfig.systemPerformance.metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={4} key={metric.id}>
              <Paper sx={{ p: 2, border: `1px solid ${brandConfig.colors.lightGray}`, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {metric.component}
                  </Typography>
                  <Chip 
                    label={metric.status} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getStatusColor(metric.status),
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, color: brandConfig.colors.midnightBlack }}>
                  {metric.value}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(metric.value)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${brandConfig.colors.lightGray}40`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getStatusColor(metric.status),
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Target: {metric.target}% • Trend: {metric.trend}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Client Management Component
  const renderClientManagement = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
            <PeopleIcon sx={{ color: brandConfig.colors.stableMahogany }} />
            {adminDashboardConfig.clientManagement.title}
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<GetApp />}
          >
            {adminDashboardConfig.buttons.export}
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Facility Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Tier</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Horses</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Revenue</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: brandConfig.colors.arenaSand }}>Support</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminDashboardConfig.clientManagement.facilities.map((facility) => (
                <TableRow key={facility.id} hover sx={{ '&:hover': { backgroundColor: `${brandConfig.colors.arenaSand}20` } }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {facility.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{facility.location}</TableCell>
                  <TableCell>{facility.owner}</TableCell>
                  <TableCell>
                    <Chip 
                      label={facility.status} 
                      size="small"
                      color={facility.status === 'active' ? 'success' : facility.status === 'trial' ? 'warning' : 'default'}
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      color: facility.subscriptionTier === 'Enterprise' ? brandConfig.colors.championGold : brandConfig.colors.stableMahogany,
                      fontWeight: 'medium'
                    }}>
                      {facility.subscriptionTier}
                    </Typography>
                  </TableCell>
                  <TableCell>{facility.horses}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: brandConfig.colors.hunterGreen }}>
                    {facility.monthlyRevenue}
                  </TableCell>
                  <TableCell>
                    <Badge badgeContent={facility.supportTickets} color="error">
                      <SupportIcon sx={{ color: facility.supportTickets > 0 ? brandConfig.colors.victoryRose : brandConfig.colors.sterlingSilver }} />
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  // Support Management Component
  const renderSupportManagement = () => (
    <Box>
      {/* Support Analytics Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportIcon sx={{ color: brandConfig.colors.ribbonBlue }} />
            {adminDashboardConfig.supportAnalytics.title}
          </Typography>
          
          {/* Support KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandConfig.colors.midnightBlack }}>
                  {adminDashboardConfig.supportAnalytics.ticketVolume.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">Today's Tickets</Typography>
                <Typography variant="body2" sx={{ color: brandConfig.colors.hunterGreen, fontWeight: 'medium' }}>
                  {adminDashboardConfig.supportAnalytics.ticketVolume.change}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandConfig.colors.midnightBlack }}>
                  {adminDashboardConfig.supportAnalytics.resolutionMetrics.avgFirstResponse}
                </Typography>
                <Typography variant="body2" color="text.secondary">Avg First Response</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandConfig.colors.midnightBlack }}>
                  {adminDashboardConfig.supportAnalytics.resolutionMetrics.customerSatisfaction}
                </Typography>
                <Typography variant="body2" color="text.secondary">Customer Satisfaction</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: brandConfig.colors.arenaSand, textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: brandConfig.colors.midnightBlack }}>
                  {adminDashboardConfig.supportAnalytics.resolutionMetrics.firstCallResolution}
                </Typography>
                <Typography variant="body2" color="text.secondary">First Call Resolution</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Category Breakdown */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Ticket Category Breakdown
          </Typography>
          <Grid container spacing={2}>
            {adminDashboardConfig.supportAnalytics.categoryBreakdown.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.category}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: brandConfig.colors.stableMahogany }}>
                    {category.count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {category.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: brandConfig.colors.hunterGreen }}>
                    {category.percentage}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg: {category.avgResolutionTime}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Active Support Tickets */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {adminDashboardConfig.supportTickets.title}
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: brandConfig.colors.stableMahogany }}>
              Create New Ticket
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminDashboardConfig.supportTickets.tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {ticket.id}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {ticket.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.facility}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ticket.clientName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ticket.clientEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.priority.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getSeverityColor(ticket.priority),
                          color: brandConfig.colors.barnWhite,
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.status.replace('-', ' ').toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: getStatusColor(ticket.status),
                          color: getStatusColor(ticket.status)
                        }}
                      />
                    </TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell>{ticket.created}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: brandConfig.colors.stableMahogany }}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Support Staff Performance */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon sx={{ color: brandConfig.colors.ribbonBlue }} />
            {adminDashboardConfig.supportManagement.title}
          </Typography>
          
          <Grid container spacing={3}>
            {adminDashboardConfig.supportManagement.staffPerformance.map((staff) => (
              <Grid item xs={12} md={6} lg={4} key={staff.id}>
                <Card sx={{ border: `1px solid ${brandConfig.colors.sterlingSilver}20` }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {staff.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {staff.role}
                        </Typography>
                      </Box>
                      <Chip 
                        label={staff.availability.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: staff.availability === 'online' 
                            ? brandConfig.colors.hunterGreen 
                            : brandConfig.colors.championGold,
                          color: brandConfig.colors.barnWhite
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Assigned Tickets:</strong> {staff.assignedTickets}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Resolved Today:</strong> {staff.resolvedToday}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Avg Resolution:</strong> {staff.avgResolutionTime}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Satisfaction:</strong> ⭐ {staff.customerSatisfaction}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Specialties:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {staff.specialties.map((specialty, index) => (
                          <Chip 
                            key={index}
                            label={specialty}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  // AI Model Performance Component
  const renderAIModelPerformance = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <SmartToy sx={{ color: brandConfig.colors.ribbonBlue }} />
          {adminDashboardConfig.aiModelPerformance.title}
        </Typography>
        <Grid container spacing={3}>
          {adminDashboardConfig.aiModelPerformance.models.map((model) => (
            <Grid item xs={12} md={4} key={model.id}>
              <Paper sx={{ p: 3, border: `1px solid ${brandConfig.colors.lightGray}`, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {model.name}
                  </Typography>
                  <Chip 
                    label={model.status} 
                    size="small"
                    sx={{ 
                      backgroundColor: getStatusColor(model.status),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Accuracy</Typography>
                    <Typography variant="h6" sx={{ color: brandConfig.colors.hunterGreen, fontWeight: 'bold' }}>
                      {model.accuracy}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Latency</Typography>
                    <Typography variant="h6" sx={{ color: brandConfig.colors.stableMahogany, fontWeight: 'bold' }}>
                      {model.latency}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Throughput</Typography>
                    <Typography variant="body2" fontWeight="medium">{model.throughput}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Version</Typography>
                    <Typography variant="body2" fontWeight="medium">{model.version}</Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  Last update: {model.lastUpdate}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  // Render tab content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <Box>
            {renderPlatformKPIs()}
            {renderPlatformAlerts()}
            {renderSystemPerformance()}
          </Box>
        );
      case 'clients':
        return (
          <Box>
            {renderClientManagement()}
          </Box>
        );
      case 'system':
        return (
          <Box>
            {renderAIModelPerformance()}
            {/* Additional system components can be added here */}
          </Box>
        );
      case 'support':
        return (
          <Box>
            {renderSupportManagement()}
          </Box>
        );
      case 'business':
        return (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: '3rem', color: brandConfig.colors.sterlingSilver, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Business Analytics Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Coming soon - Revenue analytics and growth metrics
            </Typography>
          </Paper>
        );
      case 'development':
        return (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <DevelopmentIcon sx={{ fontSize: '3rem', color: brandConfig.colors.sterlingSilver, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Development Pipeline Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Coming soon - Feature requests and development tracking
            </Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  // Main render
  return (
    <Box className={className} sx={{ minHeight: '100vh', backgroundColor: brandConfig.colors.arenaSand }}>
      {/* Header */}
      <Box sx={{ backgroundColor: brandConfig.colors.midnightBlack, color: brandConfig.colors.arenaSand, p: 4 }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {adminDashboardConfig.header.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                {adminDashboardConfig.header.subtitle}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: brandConfig.colors.arenaSand }}>Timeframe</InputLabel>
                <Select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  sx={{ 
                    color: brandConfig.colors.arenaSand,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${brandConfig.colors.arenaSand}60`
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${brandConfig.colors.arenaSand}80`
                    }
                  }}
                >
                  <MenuItem value="hour">Last Hour</MenuItem>
                  <MenuItem value="day">Last 24 Hours</MenuItem>
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: brandConfig.colors.hunterGreen
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: brandConfig.colors.hunterGreen
                      }
                    }}
                  />
                }
                label={adminDashboardConfig.buttons.autoRefresh}
                sx={{ color: brandConfig.colors.arenaSand }}
              />
              <Button
                variant="contained"
                startIcon={<Warning />}
                sx={{
                  backgroundColor: brandConfig.colors.victoryRose,
                  '&:hover': {
                    backgroundColor: `${brandConfig.colors.victoryRose}CC`
                  }
                }}
              >
                {adminDashboardConfig.buttons.platformAlert}
              </Button>
            </Box>
          </Box>

          {/* Platform status summary */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Platform Health</Typography>
              <Typography variant="body1">{adminDashboardConfig.header.platformHealth}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Active Facilities</Typography>
              <Typography variant="body1">{adminDashboardConfig.header.activeFacilities}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>System Load</Typography>
              <Typography variant="body1">{adminDashboardConfig.header.systemLoad}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Revenue Status</Typography>
              <Typography variant="body1">{adminDashboardConfig.header.revenueStatus}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 4 }}>
        {/* Navigation tabs */}
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'medium',
                fontSize: '1rem',
                textTransform: 'none',
                minHeight: '64px'
              },
              '& .Mui-selected': {
                color: `${brandConfig.colors.stableMahogany} !important`,
                fontWeight: 'bold'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: brandConfig.colors.stableMahogany,
                height: 3
              }
            }}
          >
            {Object.entries(adminDashboardConfig.tabs).map(([key, tab]) => (
              <Tab
                key={key}
                label={tab.label}
                value={tab.id}
                icon={<span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Tab content with animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default ComprehensiveAdminDashboard;
