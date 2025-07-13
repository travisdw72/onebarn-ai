/**
 * Security Compliance Dashboard - Phase 1 Core Component
 * Comprehensive security monitoring with HIPAA compliance and audit trails
 * 
 * @description Implements the security dashboard from Phase 1 specifications
 * @compliance HIPAA compliant with zero trust security monitoring
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
  CircularProgress,
  Alert,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Gavel as ComplianceIcon,
  Timeline as AuditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon,
  MonitorHeart as MonitorIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';

// Configuration imports
import { brandConfig } from '../../config/brandConfig';
import { dashboardConfig } from '../../config/dashboardConfig';

// Service imports
import { securityAuditService } from '../../services/securityAuditService';

// Context imports
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';

// Interface imports
import type {
  ISecurityMetrics,
  IComplianceReport,
  IAuditLogEntry,
  ISecurityAlert,
  IThreatDetection
} from '../../services/securityAuditService';

interface ISecurityComplianceDashboardProps {
  className?: string;
  maxHeight?: string;
  showDetailedAudit?: boolean;
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
    id={`security-tabpanel-${index}`}
    aria-labelledby={`security-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export const SecurityComplianceDashboard: React.FC<ISecurityComplianceDashboardProps> = ({
  className = '',
  maxHeight = '800px',
  showDetailedAudit = true
}) => {
  const { user } = useAuth();
  const { tenantId } = useTenant();

  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<ISecurityMetrics | null>(null);
  const [complianceReport, setComplianceReport] = useState<IComplianceReport | null>(null);
  const [auditLogs, setAuditLogs] = useState<IAuditLogEntry[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<ISecurityAlert[]>([]);
  const [threatDetections, setThreatDetections] = useState<IThreatDetection[]>([]);
  const [quickOverview, setQuickOverview] = useState<any>(null);

  // Filter state
  const [timeRange, setTimeRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [auditFilter, setAuditFilter] = useState({
    userId: '',
    resource: '',
    action: ''
  });

  // Load security data
  useEffect(() => {
    loadSecurityData();
  }, [timeRange, tenantId]);

  const loadSecurityData = async () => {
    if (!tenantId) return;

    try {
      setLoading(true);
      setError(null);

      // Load security metrics
      const metrics = await securityAuditService.getSecurityMetrics(tenantId, timeRange);
      setSecurityMetrics(metrics);

      // Load compliance report
      const compliance = await securityAuditService.generateComplianceReport(
        tenantId,
        'security',
        timeRange,
        user?.id || 'system'
      );
      setComplianceReport(compliance);

      // Load audit logs
      const audit = await securityAuditService.getAuditTrail(tenantId, timeRange);
      setAuditLogs(audit.slice(0, 50)); // Limit to recent 50 entries

      // Load security alerts
      const alerts = await securityAuditService.getSecurityAlerts(tenantId);
      setSecurityAlerts(alerts.slice(0, 20));

      // Load threat detections
      const threats = await securityAuditService.getThreatDetections(tenantId);
      setThreatDetections(threats.slice(0, 10));

      // Load quick overview
      const overview = await securityAuditService.getQuickSecurityOverview(tenantId);
      setQuickOverview(overview);

    } catch (err) {
      console.error('Error loading security data:', err);
      setError('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    loadSecurityData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return brandConfig.colors.errorRed;
      case 'high': return brandConfig.colors.alertAmber;
      case 'medium': return brandConfig.colors.goldenStraw;
      case 'low': return brandConfig.colors.successGreen;
      default: return brandConfig.colors.neutralGray;
    }
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleIcon sx={{ color: brandConfig.colors.successGreen }} />;
      case 'non_compliant': return <ErrorIcon sx={{ color: brandConfig.colors.errorRed }} />;
      case 'warning': return <WarningIcon sx={{ color: brandConfig.colors.alertAmber }} />;
      default: return <WarningIcon sx={{ color: brandConfig.colors.neutralGray }} />;
    }
  };

  // Render security overview
  const renderSecurityOverview = () => {
    if (!securityMetrics || !quickOverview) return null;

    const { overview, riskAnalysis, compliance } = securityMetrics;

    return (
      <Grid container spacing={3}>
        {/* Security KPI Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Badge badgeContent={quickOverview.activeAlerts} color="error">
                <SecurityIcon sx={{ fontSize: 40, color: brandConfig.colors.stableMahogany }} />
              </Badge>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: brandConfig.typography.weightBold }}>
                Security Status
              </Typography>
              <Chip 
                label={riskAnalysis.riskScore < 30 ? 'Secure' : riskAnalysis.riskScore < 60 ? 'Moderate' : 'High Risk'}
                color={riskAnalysis.riskScore < 30 ? 'success' : riskAnalysis.riskScore < 60 ? 'warning' : 'error'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.errorRed 
              }}>
                {overview.securityAlerts}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Alerts
              </Typography>
              <Typography variant="caption" sx={{ 
                color: overview.securityAlerts > 0 ? brandConfig.colors.errorRed : brandConfig.colors.successGreen 
              }}>
                {overview.securityAlerts > 0 ? 'Requires Attention' : 'All Clear'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: brandConfig.typography.weightBold,
                color: brandConfig.colors.alertAmber 
              }}>
                {quickOverview.recentThreats}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Threat Detections
              </Typography>
              <Typography variant="caption" sx={{ color: brandConfig.colors.charcoalGray }}>
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CircularProgress 
                variant="determinate" 
                value={100 - riskAnalysis.riskScore} 
                size={60}
                sx={{ color: brandConfig.colors.successGreen }}
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Risk Score: {riskAnalysis.riskScore}/100
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Security Posture
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ 
                fontWeight: brandConfig.typography.weightSemiBold,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <ComplianceIcon sx={{ color: brandConfig.colors.hunterGreen }} />
                Compliance Status
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    {getComplianceStatusIcon(compliance.hipaa.compliant ? 'compliant' : 'non_compliant')}
                  </ListItemIcon>
                  <ListItemText 
                    primary="HIPAA Compliance"
                    secondary={`${compliance.hipaa.violations} violations | Last audit: ${compliance.hipaa.lastAudit}`}
                  />
                  <Chip 
                    label={compliance.hipaa.compliant ? 'Compliant' : 'Non-Compliant'}
                    color={compliance.hipaa.compliant ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {getComplianceStatusIcon(compliance.gdpr.compliant ? 'compliant' : 'non_compliant')}
                  </ListItemIcon>
                  <ListItemText 
                    primary="GDPR Compliance"
                    secondary={`${compliance.gdpr.violations} violations | Last audit: ${compliance.gdpr.lastAudit}`}
                  />
                  <Chip 
                    label={compliance.gdpr.compliant ? 'Compliant' : 'Non-Compliant'}
                    color={compliance.gdpr.compliant ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {getComplianceStatusIcon(compliance.internal.compliant ? 'compliant' : 'non_compliant')}
                  </ListItemIcon>
                  <ListItemText 
                    primary="Internal Policies"
                    secondary={`${compliance.internal.violations} violations | Last audit: ${compliance.internal.lastAudit}`}
                  />
                  <Chip 
                    label={compliance.internal.compliant ? 'Compliant' : 'Non-Compliant'}
                    color={compliance.internal.compliant ? 'success' : 'error'}
                    size="small"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Risks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ 
                fontWeight: brandConfig.typography.weightSemiBold,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <WarningIcon sx={{ color: brandConfig.colors.alertAmber }} />
                Top Security Risks
              </Typography>
              
              {riskAnalysis.topRisks.map((risk, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                      {risk.risk}
                    </Typography>
                    <Chip 
                      label={`${risk.score}/100`}
                      size="small"
                      sx={{ backgroundColor: getSeverityColor(risk.score > 75 ? 'critical' : risk.score > 50 ? 'high' : 'medium') }}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={risk.score} 
                    sx={{ 
                      backgroundColor: brandConfig.colors.arenaSand,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getSeverityColor(risk.score > 75 ? 'critical' : risk.score > 50 ? 'high' : 'medium')
                      }
                    }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    Frequency: {risk.frequency} incidents
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
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
                <MonitorIcon sx={{ color: brandConfig.colors.ribbonBlue }} />
                Recent Security Events
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Event Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Outcome</TableCell>
                      <TableCell>Risk Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.slice(0, 10).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                          <Chip 
                            label="Info"
                            size="small" 
                            color="info"
                          />
                        </TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.outcome}
                            size="small"
                            color={log.outcome === 'success' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            Low
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // Render security alerts
  const renderSecurityAlerts = () => (
    <Grid container spacing={3}>
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
              <WarningIcon sx={{ color: brandConfig.colors.alertAmber }} />
              Active Security Alerts
            </Typography>
            
            {securityAlerts.length === 0 ? (
              <Alert severity="success">
                No active security alerts. System is secure.
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Alert Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {securityAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.alertType}</TableCell>
                        <TableCell>
                          <Chip 
                            label={alert.severity}
                            size="small"
                            sx={{ backgroundColor: getSeverityColor(alert.severity) }}
                          />
                        </TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>
                          {new Date(alert.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={alert.status}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Threat Detections */}
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
              <ShieldIcon sx={{ color: brandConfig.colors.stableMahogany }} />
              Threat Detections
            </Typography>
            
            {threatDetections.length === 0 ? (
              <Alert severity="success">
                No threats detected. Security systems are functioning normally.
              </Alert>
            ) : (
              threatDetections.map((threat) => (
                <Alert 
                  key={threat.threatId} 
                  severity={threat.severity === 'critical' ? 'error' : threat.severity === 'high' ? 'warning' : 'info'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                    {threat.threatType.replace('_', ' ').toUpperCase()}: {threat.confidence}% confidence
                  </Typography>
                  <Typography variant="caption">
                    Detected: {new Date(threat.timestamp).toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {threat.indicators.map((indicator, index) => (
                      <Chip 
                        key={index} 
                        label={indicator} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render audit trail
  const renderAuditTrail = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: brandConfig.typography.weightSemiBold,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <AuditIcon sx={{ color: brandConfig.colors.hunterGreen }} />
                Audit Trail
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Resource</InputLabel>
                  <Select
                    value={auditFilter.resource}
                    onChange={(e) => setAuditFilter(prev => ({ ...prev, resource: e.target.value }))}
                    label="Resource"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="tickets">Tickets</MenuItem>
                    <MenuItem value="users">Users</MenuItem>
                    <MenuItem value="config">Configuration</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={auditFilter.action}
                    onChange={(e) => setAuditFilter(prev => ({ ...prev, action: e.target.value }))}
                    label="Action"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="create">Create</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Resource</TableCell>
                    <TableCell>Outcome</TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell>IP Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs
                    .filter(log => 
                      (!auditFilter.resource || log.resource.includes(auditFilter.resource)) &&
                      (!auditFilter.action || log.action.includes(auditFilter.action))
                    )
                    .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{log.userId}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {log.userRole}
                        </Typography>
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell>
                        <Chip 
                          label={log.outcome}
                          size="small"
                          color={log.outcome === 'success' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {log.compliance.hipaa && (
                            <Chip label="HIPAA" size="small" color="success" />
                          )}
                          {log.compliance.gdpr && (
                            <Chip label="GDPR" size="small" color="info" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {log.ipAddress}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const containerStyle: React.CSSProperties = {
    maxHeight,
    overflow: 'auto',
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress sx={{ color: brandConfig.colors.stableMahogany }} />
        <Typography sx={{ ml: 2 }}>Loading security data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={handleRefresh} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
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
          <Typography variant="h5" sx={{ 
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.stableMahogany,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SecurityIcon />
            Security & Compliance Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton 
                onClick={handleRefresh}
                sx={{ color: brandConfig.colors.stableMahogany }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Export Compliance Report">
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                sx={{ 
                  borderColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.stableMahogany 
                }}
              >
                Export
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Time Range Selector */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={timeRange.startDate}
            onChange={(e) => setTimeRange(prev => ({ ...prev, startDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={timeRange.endDate}
            onChange={(e) => setTimeRange(prev => ({ ...prev, endDate: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              fontFamily: brandConfig.typography.fontPrimary
            }
          }}
        >
          <Tab label="Security Overview" />
          <Tab label="Alerts & Threats" />
          <Tab label="Audit Trail" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={activeTab} index={0}>
        {renderSecurityOverview()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        {renderSecurityAlerts()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={2}>
        {renderAuditTrail()}
      </TabPanel>
    </div>
  );
}; 