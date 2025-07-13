import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  CloudUpload as UploadIcon,
  VpnKey as KeyIcon,
  Shield as ShieldIcon,
  Gavel as ComplianceIcon,
  Timeline as AuditIcon,
  Schedule as RetentionIcon,
  Group as StakeholderIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { zeroTrustTrainingConfig } from '../../config/zeroTrustTrainingConfig';
import type { 
  ISecureTrainingVaultProps,
  ITrainingDataRecord,
  IAccessControlEntry,
  IComplianceStatus,
  IAuditLogEntry,
  IDataRetentionPolicy,
  IEncryptionStatus
} from '../../interfaces/config/zeroTrustTrainingConfig.interface';
import { trainingService } from '../../services/trainingService';
import { useTrainingSession } from '../../hooks/useTrainingSession';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vault-tabpanel-${index}`}
      aria-labelledby={`vault-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const SecureTrainingVault: React.FC<ISecureTrainingVaultProps> = ({
  tenantId,
  userId,
  userRole,
  onDataAccess,
  onSecurityAlert,
  className
}) => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [trainingData, setTrainingData] = useState<ITrainingDataRecord[]>([]);
  const [accessLog, setAccessLog] = useState<IAuditLogEntry[]>([]);
  const [complianceStatus, setComplianceStatus] = useState<IComplianceStatus | null>(null);
  const [retentionPolicies, setRetentionPolicies] = useState<IDataRetentionPolicy[]>([]);
  const [encryptionStatus, setEncryptionStatus] = useState<IEncryptionStatus | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ITrainingDataRecord | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Hooks
  const { sessionData } = useTrainingSession();

  // Configuration
  const vaultConfig = zeroTrustTrainingConfig.dataGovernance.vault;
  const securityConfig = zeroTrustTrainingConfig.security;
  const complianceConfig = zeroTrustTrainingConfig.compliance;

  // Load vault data
  const loadVaultData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dataRecords, auditLogs, compliance, retention, encryption] = await Promise.all([
        trainingService.getSecureTrainingData(tenantId, userId, {
          search: searchTerm,
          classification: classificationFilter !== 'ALL' ? classificationFilter : undefined,
          dateRange: dateRange.start && dateRange.end ? dateRange : undefined
        }),
        trainingService.getAuditLogs(tenantId, userId, 'vault_access'),
        trainingService.getComplianceStatus(tenantId),
        trainingService.getRetentionPolicies(tenantId),
        trainingService.getEncryptionStatus(tenantId)
      ]);

      setTrainingData(dataRecords);
      setAccessLog(auditLogs);
      setComplianceStatus(compliance);
      setRetentionPolicies(retention);
      setEncryptionStatus(encryption);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vault data');
      onSecurityAlert?.({
        type: 'error',
        message: 'Vault data access failed',
        timestamp: new Date(),
        userId,
        details: { error: err }
      });
    } finally {
      setLoading(false);
    }
  }, [tenantId, userId, searchTerm, classificationFilter, dateRange, onSecurityAlert]);

  // Effects
  useEffect(() => {
    loadVaultData();
  }, [loadVaultData]);

  // Event handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleRecordSelect = (record: ITrainingDataRecord) => {
    setSelectedRecord(record);
    onDataAccess?.({
      recordId: record.id,
      action: 'view',
      timestamp: new Date(),
      userId,
      classification: record.classification
    });
  };

  const handleShare = async (record: ITrainingDataRecord, stakeholders: string[]) => {
    try {
      await trainingService.shareTrainingData(record.id, stakeholders, {
        tenantId,
        userId,
        permissions: ['view'],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      
      setShareDialogOpen(false);
      loadVaultData();
    } catch (err) {
      setError('Failed to share data');
    }
  };

  const handleDelete = async (record: ITrainingDataRecord) => {
    try {
      await trainingService.deleteTrainingData(record.id, {
        tenantId,
        userId,
        reason: 'User requested deletion'
      });
      
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      loadVaultData();
    } catch (err) {
      setError('Failed to delete data');
    }
  };

  const handleDownload = async (record: ITrainingDataRecord) => {
    try {
      const downloadUrl = await trainingService.generateSecureDownloadUrl(record.id, {
        tenantId,
        userId,
        expiresIn: 300 // 5 minutes
      });
      
      window.open(downloadUrl, '_blank');
      
      onDataAccess?.({
        recordId: record.id,
        action: 'download',
        timestamp: new Date(),
        userId,
        classification: record.classification
      });
    } catch (err) {
      setError('Failed to generate download link');
    }
  };

  // Helper functions
  const getClassificationColor = (classification: string) => {
    const colors = {
      'PUBLIC': brandConfig.colors.success,
      'INTERNAL': brandConfig.colors.info,
      'CONFIDENTIAL': brandConfig.colors.warning,
      'RESTRICTED': brandConfig.colors.error,
      'TOP_SECRET': brandConfig.colors.stableMahogany
    };
    return colors[classification as keyof typeof colors] || brandConfig.colors.neutral;
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon sx={{ color: brandConfig.colors.success }} />;
      case 'warning':
        return <WarningIcon sx={{ color: brandConfig.colors.warning }} />;
      case 'violation':
        return <ErrorIcon sx={{ color: brandConfig.colors.error }} />;
      default:
        return <InfoIcon sx={{ color: brandConfig.colors.info }} />;
    }
  };

  const canAccessRecord = (record: ITrainingDataRecord) => {
    const userPermissions = securityConfig.stakeholderPermissions[userRole as keyof typeof securityConfig.stakeholderPermissions];
    return userPermissions?.dataAccess.includes(record.classification) || false;
  };

  const canModifyRecord = (record: ITrainingDataRecord) => {
    const userPermissions = securityConfig.stakeholderPermissions[userRole as keyof typeof securityConfig.stakeholderPermissions];
    return userPermissions?.actions.includes('modify') && canAccessRecord(record);
  };

  const canDeleteRecord = (record: ITrainingDataRecord) => {
    const userPermissions = securityConfig.stakeholderPermissions[userRole as keyof typeof securityConfig.stakeholderPermissions];
    return userPermissions?.actions.includes('delete') && canAccessRecord(record);
  };

  // Render functions
  const renderDataOverview = () => (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FolderIcon sx={{ color: brandConfig.colors.primary, mr: 1 }} />
              <Typography variant="h6">Total Records</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany }}>
              {trainingData.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShieldIcon sx={{ color: brandConfig.colors.success, mr: 1 }} />
              <Typography variant="h6">Encrypted</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandConfig.colors.success }}>
              {encryptionStatus?.encryptedCount || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ComplianceIcon sx={{ color: brandConfig.colors.info, mr: 1 }} />
              <Typography variant="h6">Compliant</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandConfig.colors.info }}>
              {complianceStatus?.compliantRecords || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon sx={{ color: brandConfig.colors.warning, mr: 1 }} />
              <Typography variant="h6">Alerts</Typography>
            </Box>
            <Typography variant="h4" sx={{ color: brandConfig.colors.warning }}>
              {complianceStatus?.violations || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Search and Filters */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Records"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Classification</InputLabel>
                  <Select
                    value={classificationFilter}
                    onChange={(e) => setClassificationFilter(e.target.value)}
                    label="Classification"
                  >
                    <MenuItem value="ALL">All Classifications</MenuItem>
                    {securityConfig.dataClassification.levels.map((level) => (
                      <MenuItem key={level.name} value={level.name}>
                        {level.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={1}>
                <Button
                  variant="contained"
                  onClick={loadVaultData}
                  sx={{ backgroundColor: brandConfig.colors.primary }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Data Records Table */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Training Data Records</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Classification</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainingData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FileIcon sx={{ mr: 1 }} />
                          {record.name}
                        </Box>
                      </TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>
                        <Chip
                          label={record.classification}
                          size="small"
                          sx={{
                            backgroundColor: getClassificationColor(record.classification),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{record.size}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {record.encrypted && <LockIcon sx={{ mr: 1, color: brandConfig.colors.success }} />}
                          {getComplianceStatusIcon(record.complianceStatus)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {canAccessRecord(record) && (
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => handleRecordSelect(record)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canAccessRecord(record) && (
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => handleDownload(record)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canModifyRecord(record) && (
                            <Tooltip title="Share">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShareDialogOpen(true);
                                }}
                              >
                                <ShareIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {canDeleteRecord(record) && (
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{ color: brandConfig.colors.error }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
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

  const renderComplianceDashboard = () => (
    <Grid container spacing={3}>
      {/* Compliance Overview */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Compliance Status</Typography>
            {complianceStatus && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress
                      variant="determinate"
                      value={complianceStatus.overallScore}
                      size={80}
                      sx={{ color: brandConfig.colors.success }}
                    />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {complianceStatus.overallScore}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Overall Score
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <List>
                    {complianceStatus.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {getComplianceStatusIcon(req.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={req.name}
                          secondary={req.description}
                        />
                        <Chip
                          label={req.status}
                          size="small"
                          color={req.status === 'compliant' ? 'success' : 'warning'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Data Retention Policies */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Data Retention Policies</Typography>
            {retentionPolicies.map((policy, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{policy.name}</Typography>
                  <Chip
                    label={`${policy.retentionPeriod} days`}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {policy.description}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Applies to:</Typography>
                      <List dense>
                        {policy.dataTypes.map((type, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={type} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Actions:</Typography>
                      <List dense>
                        {policy.actions.map((action, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={action} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAuditTrail = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Audit Trail</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accessLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{entry.userId}</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.action}
                      size="small"
                      color={entry.success ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{entry.resourceId}</TableCell>
                  <TableCell>
                    {entry.success ? (
                      <CheckCircleIcon sx={{ color: brandConfig.colors.success }} />
                    ) : (
                      <ErrorIcon sx={{ color: brandConfig.colors.error }} />
                    )}
                  </TableCell>
                  <TableCell>{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderEncryptionStatus = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Encryption Status</Typography>
        {encryptionStatus && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Encryption Coverage
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={encryptionStatus.coveragePercentage}
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {encryptionStatus.coveragePercentage}% of data encrypted
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Encryption Methods
              </Typography>
              <List dense>
                {encryptionStatus.methods.map((method, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <KeyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={method.algorithm}
                      secondary={`${method.keyLength} bit - ${method.usage}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: brandConfig.colors.stableMahogany, mb: 1 }}>
          Secure Training Vault
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Encrypted data storage with enterprise-grade security and compliance
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            icon={<FolderIcon />}
            label="Data Overview"
            id="vault-tab-0"
            aria-controls="vault-tabpanel-0"
          />
          <Tab
            icon={<ComplianceIcon />}
            label="Compliance"
            id="vault-tab-1"
            aria-controls="vault-tabpanel-1"
          />
          <Tab
            icon={<AuditIcon />}
            label="Audit Trail"
            id="vault-tab-2"
            aria-controls="vault-tabpanel-2"
          />
          <Tab
            icon={<SecurityIcon />}
            label="Encryption"
            id="vault-tab-3"
            aria-controls="vault-tabpanel-3"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {renderDataOverview()}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {renderComplianceDashboard()}
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {renderAuditTrail()}
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        {renderEncryptionStatus()}
      </TabPanel>

      {/* Share Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Share Training Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select stakeholders to share "{selectedRecord?.name}" with:
          </Typography>
          {/* Share form implementation would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: brandConfig.colors.primary }}
            onClick={() => selectedRecord && handleShare(selectedRecord, [])}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedRecord?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => selectedRecord && handleDelete(selectedRecord)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
