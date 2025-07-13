import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Camera,
  Sensors,
  Timer,
  PhoneAndroid,
  Security,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  Settings,
  Shield,
  Wifi,
  WifiOff,
  Lock,
  LockOpen,
  Fingerprint,
  LocationOn,
  LocationOff,
  Speed,
  Memory,
  Storage,
  NetworkCheck,
  Update,
  BugReport,
  Visibility,
  VisibilityOff,
  DeviceHub,
  RouterOutlined
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { zeroTrustTrainingConfig } from '../../config/zeroTrustTrainingConfig';
import { useZeroTrustSecurity } from '../../hooks/useZeroTrustSecurity';
import { DataClassificationBanner } from '../security/DataClassificationBanner';
import { PermissionGate } from '../security/PermissionGate';

interface ITrainingDevice {
  id: string;
  name: string;
  type: 'cameras' | 'sensors' | 'timingGates' | 'mobileDevices';
  model: string;
  firmwareVersion: string;
  location: string;
  status: 'online' | 'offline' | 'compromised' | 'maintenance';
  trustScore: number;
  lastSeen: string;
  lastValidated: string;
  certificationStatus: 'valid' | 'expired' | 'revoked';
  encryptionEnabled: boolean;
  tamperDetected: boolean;
  networkStatus: 'connected' | 'disconnected' | 'restricted';
  batteryLevel?: number;
  temperature?: number;
  signalStrength?: number;
  dataTransmitted: number;
  alertsCount: number;
  complianceScore: number;
  geofenced: boolean;
  zone: string;
}

interface ISecurityEvent {
  id: string;
  deviceId: string;
  type: 'tamper_detected' | 'cert_expired' | 'network_anomaly' | 'location_violation' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  resolved: boolean;
  responseAction?: string;
}

interface IDeviceMetrics {
  totalDevices: number;
  onlineDevices: number;
  trustedDevices: number;
  compromisedDevices: number;
  certificateExpiring: number;
  securityEvents: number;
  averageTrustScore: number;
  networkCoverage: number;
}

interface IZeroTrustDeviceManagerProps {
  facilityId: string;
  userId: string;
  userRole: string;
  onSecurityEvent?: (event: ISecurityEvent) => void;
  onDeviceAction?: (deviceId: string, action: string) => void;
}

export const ZeroTrustDeviceManager: React.FC<IZeroTrustDeviceManagerProps> = ({
  facilityId,
  userId,
  userRole,
  onSecurityEvent,
  onDeviceAction
}) => {
  // State Management
  const [devices, setDevices] = useState<ITrainingDevice[]>([]);
  const [securityEvents, setSecurityEvents] = useState<ISecurityEvent[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<ITrainingDevice | null>(null);
  const [deviceMetrics, setDeviceMetrics] = useState<IDeviceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showOfflineDevices, setShowOfflineDevices] = useState(true);
  
  // Dialog States
  const [deviceDetailsOpen, setDeviceDetailsOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [isolateDialogOpen, setIsolateDialogOpen] = useState(false);
  const [provisionDialogOpen, setProvisionDialogOpen] = useState(false);

  // Hooks
  const { 
    validateDeviceTrust,
    isolateDevice,
    validateCertificate,
    updateFirmware,
    logSecurityEvent,
    getDeviceMetrics,
    checkGeofencing
  } = useZeroTrustSecurity();

  // Load devices and metrics
  useEffect(() => {
    loadDevices();
    loadSecurityEvents();
    calculateMetrics();
  }, [facilityId]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDevices();
      loadSecurityEvents();
      calculateMetrics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, facilityId]);

  const loadDevices = useCallback(async () => {
    setLoading(true);
    try {
      // Mock device data - replace with actual API call
      const mockDevices: ITrainingDevice[] = [
        {
          id: 'cam_001',
          name: 'Arena Camera 1',
          type: 'cameras',
          model: 'SecurityCam Pro 4K',
          firmwareVersion: '2.1.5',
          location: 'Training Arena - North',
          status: 'online',
          trustScore: 95,
          lastSeen: '2024-01-16T10:30:00Z',
          lastValidated: '2024-01-16T10:25:00Z',
          certificationStatus: 'valid',
          encryptionEnabled: true,
          tamperDetected: false,
          networkStatus: 'connected',
          temperature: 45,
          signalStrength: 85,
          dataTransmitted: 2147483648, // 2GB
          alertsCount: 0,
          complianceScore: 98,
          geofenced: true,
          zone: 'training_arena'
        },
        {
          id: 'sensor_001',
          name: 'Motion Sensor - Gate 1',
          type: 'sensors',
          model: 'MotionPro v3',
          firmwareVersion: '1.8.2',
          location: 'Arena Gate 1',
          status: 'online',
          trustScore: 88,
          lastSeen: '2024-01-16T10:29:00Z',
          lastValidated: '2024-01-16T10:15:00Z',
          certificationStatus: 'valid',
          encryptionEnabled: true,
          tamperDetected: false,
          networkStatus: 'connected',
          batteryLevel: 78,
          temperature: 32,
          signalStrength: 92,
          dataTransmitted: 1048576, // 1MB
          alertsCount: 1,
          complianceScore: 92,
          geofenced: true,
          zone: 'training_arena'
        },
        {
          id: 'timer_001',
          name: 'Barrel Racing Timer',
          type: 'timingGates',
          model: 'PrecisionTime Pro',
          firmwareVersion: '3.2.1',
          location: 'Barrel Pattern Start',
          status: 'online',
          trustScore: 99,
          lastSeen: '2024-01-16T10:30:00Z',
          lastValidated: '2024-01-16T10:30:00Z',
          certificationStatus: 'valid',
          encryptionEnabled: true,
          tamperDetected: false,
          networkStatus: 'connected',
          temperature: 28,
          signalStrength: 98,
          dataTransmitted: 524288, // 512KB
          alertsCount: 0,
          complianceScore: 100,
          geofenced: true,
          zone: 'training_arena'
        },
        {
          id: 'mobile_001',
          name: 'Trainer iPad Pro',
          type: 'mobileDevices',
          model: 'iPad Pro 12.9"',
          firmwareVersion: 'iOS 17.2.1',
          location: 'Mobile',
          status: 'online',
          trustScore: 82,
          lastSeen: '2024-01-16T10:28:00Z',
          lastValidated: '2024-01-16T10:20:00Z',
          certificationStatus: 'valid',
          encryptionEnabled: true,
          tamperDetected: false,
          networkStatus: 'connected',
          batteryLevel: 65,
          signalStrength: 75,
          dataTransmitted: 104857600, // 100MB
          alertsCount: 2,
          complianceScore: 85,
          geofenced: true,
          zone: 'training_arena'
        },
        {
          id: 'cam_002',
          name: 'Stable Camera 2',
          type: 'cameras',
          model: 'SecurityCam Standard',
          firmwareVersion: '1.9.8',
          location: 'Stable Block B',
          status: 'compromised',
          trustScore: 25,
          lastSeen: '2024-01-16T09:45:00Z',
          lastValidated: '2024-01-16T08:30:00Z',
          certificationStatus: 'expired',
          encryptionEnabled: false,
          tamperDetected: true,
          networkStatus: 'restricted',
          temperature: 65,
          signalStrength: 45,
          dataTransmitted: 0,
          alertsCount: 5,
          complianceScore: 15,
          geofenced: false,
          zone: 'unknown'
        }
      ];

      // Filter devices based on user permissions
      const userPermissions = zeroTrustTrainingConfig.getStakeholderPermissions(userRole as any);
      const canManageDevices = userRole === 'TRAINER' || userRole === 'FACILITY_MANAGER';
      
      const filteredDevices = canManageDevices ? mockDevices : 
        mockDevices.filter(device => device.status !== 'compromised');

      setDevices(filteredDevices);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  }, [facilityId, userRole]);

  const loadSecurityEvents = useCallback(async () => {
    try {
      // Mock security events - replace with actual API call
      const mockEvents: ISecurityEvent[] = [
        {
          id: 'event_001',
          deviceId: 'cam_002',
          type: 'tamper_detected',
          severity: 'critical',
          description: 'Physical tampering detected on camera housing',
          timestamp: '2024-01-16T09:45:00Z',
          resolved: false
        },
        {
          id: 'event_002',
          deviceId: 'cam_002',
          type: 'cert_expired',
          severity: 'high',
          description: 'Security certificate has expired',
          timestamp: '2024-01-16T08:30:00Z',
          resolved: false
        },
        {
          id: 'event_003',
          deviceId: 'mobile_001',
          type: 'location_violation',
          severity: 'medium',
          description: 'Device detected outside authorized zone',
          timestamp: '2024-01-16T07:15:00Z',
          resolved: true,
          responseAction: 'Automatic location tracking enabled'
        }
      ];

      setSecurityEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load security events:', error);
    }
  }, []);

  const calculateMetrics = useCallback(() => {
    if (devices.length === 0) return;

    const metrics: IDeviceMetrics = {
      totalDevices: devices.length,
      onlineDevices: devices.filter(d => d.status === 'online').length,
      trustedDevices: devices.filter(d => d.trustScore >= 80).length,
      compromisedDevices: devices.filter(d => d.status === 'compromised').length,
      certificateExpiring: devices.filter(d => d.certificationStatus === 'expired').length,
      securityEvents: securityEvents.filter(e => !e.resolved).length,
      averageTrustScore: Math.round(devices.reduce((sum, d) => sum + d.trustScore, 0) / devices.length),
      networkCoverage: Math.round((devices.filter(d => d.networkStatus === 'connected').length / devices.length) * 100)
    };

    setDeviceMetrics(metrics);
  }, [devices, securityEvents]);

  // Filter devices
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesType = filterType === 'all' || device.type === filterType;
      const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
      const showOffline = showOfflineDevices || device.status !== 'offline';
      
      return matchesType && matchesStatus && showOffline;
    });
  }, [devices, filterType, filterStatus, showOfflineDevices]);

  // Event handlers
  const handleDeviceValidation = useCallback(async (deviceId: string) => {
    try {
      const trustScore = await validateDeviceTrust(deviceId);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, trustScore, lastValidated: new Date().toISOString() }
          : device
      ));

      logSecurityEvent({
        type: 'device_validation',
        deviceId,
        trustScore,
        timestamp: Date.now()
      });

      onDeviceAction?.(deviceId, 'validate');

    } catch (error) {
      console.error('Device validation failed:', error);
    }
  }, [validateDeviceTrust, logSecurityEvent, onDeviceAction]);

  const handleDeviceIsolation = useCallback(async (deviceId: string) => {
    try {
      await isolateDevice(deviceId);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'maintenance', networkStatus: 'restricted' as const }
          : device
      ));

      logSecurityEvent({
        type: 'device_isolated',
        deviceId,
        timestamp: Date.now()
      });

      onDeviceAction?.(deviceId, 'isolate');
      setIsolateDialogOpen(false);

    } catch (error) {
      console.error('Device isolation failed:', error);
    }
  }, [isolateDevice, logSecurityEvent, onDeviceAction]);

  const handleCertificateRenewal = useCallback(async (deviceId: string) => {
    try {
      await validateCertificate(deviceId);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, certificationStatus: 'valid' as const }
          : device
      ));

      logSecurityEvent({
        type: 'certificate_renewed',
        deviceId,
        timestamp: Date.now()
      });

      onDeviceAction?.(deviceId, 'renew_certificate');
      setCertificateDialogOpen(false);

    } catch (error) {
      console.error('Certificate renewal failed:', error);
    }
  }, [validateCertificate, logSecurityEvent, onDeviceAction]);

  const handleFirmwareUpdate = useCallback(async (deviceId: string) => {
    try {
      await updateFirmware(deviceId);
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, firmwareVersion: '2.1.6' } // Mock version
          : device
      ));

      logSecurityEvent({
        type: 'firmware_updated',
        deviceId,
        timestamp: Date.now()
      });

      onDeviceAction?.(deviceId, 'update_firmware');

    } catch (error) {
      console.error('Firmware update failed:', error);
    }
  }, [updateFirmware, logSecurityEvent, onDeviceAction]);

  // Get device type icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'cameras': return <Camera />;
      case 'sensors': return <Sensors />;
      case 'timingGates': return <Timer />;
      case 'mobileDevices': return <PhoneAndroid />;
      default: return <DeviceHub />;
    }
  };

  // Get trust score color
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return brandConfig.colors.successGreen;
    if (score >= 70) return brandConfig.colors.alertAmber;
    if (score >= 50) return brandConfig.colors.errorRed;
    return brandConfig.colors.midnightBlack;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'default';
      case 'compromised': return 'error';
      case 'maintenance': return 'warning';
      default: return 'default';
    }
  };

  // Render metrics cards
  const renderMetricsCards = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {deviceMetrics?.totalDevices || 0}
            </Typography>
            <Typography variant="body2">Total Devices</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {deviceMetrics?.onlineDevices || 0}
            </Typography>
            <Typography variant="body2">Online</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {deviceMetrics?.compromisedDevices || 0}
            </Typography>
            <Typography variant="body2">Compromised</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: getTrustScoreColor(deviceMetrics?.averageTrustScore || 0) }}>
              {deviceMetrics?.averageTrustScore || 0}
            </Typography>
            <Typography variant="body2">Avg Trust Score</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render device table
  const renderDeviceTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Device</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Trust Score</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Last Seen</TableCell>
            <TableCell>Security</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDevices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {getDeviceIcon(device.type)}
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {device.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {device.model} - v{device.firmwareVersion}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={device.status}
                  color={getStatusColor(device.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography 
                    variant="body2" 
                    sx={{ color: getTrustScoreColor(device.trustScore) }}
                    fontWeight="bold"
                  >
                    {device.trustScore}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={device.trustScore} 
                    sx={{ 
                      width: 60,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getTrustScoreColor(device.trustScore)
                      }
                    }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  {device.geofenced ? <LocationOn color="success" /> : <LocationOff color="error" />}
                  <Typography variant="body2">{device.location}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {new Date(device.lastSeen).toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  {device.encryptionEnabled ? <Lock color="success" /> : <LockOpen color="error" />}
                  {device.tamperDetected && <Warning color="error" />}
                  {device.certificationStatus === 'valid' ? 
                    <CheckCircle color="success" /> : 
                    <Error color="error" />
                  }
                  {device.alertsCount > 0 && (
                    <Badge badgeContent={device.alertsCount} color="error">
                      <Warning />
                    </Badge>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedDevice(device);
                        setDeviceDetailsOpen(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Validate Trust">
                    <IconButton 
                      size="small"
                      onClick={() => handleDeviceValidation(device.id)}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  {device.status === 'compromised' && (
                    <Tooltip title="Isolate Device">
                      <IconButton 
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedDevice(device);
                          setIsolateDialogOpen(true);
                        }}
                      >
                        <Shield />
                      </IconButton>
                    </Tooltip>
                  )}
                  {device.certificationStatus !== 'valid' && (
                    <Tooltip title="Renew Certificate">
                      <IconButton 
                        size="small"
                        color="warning"
                        onClick={() => {
                          setSelectedDevice(device);
                          setCertificateDialogOpen(true);
                        }}
                      >
                        <Security />
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
  );

  // Render security events
  const renderSecurityEvents = () => (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Security Events
        </Typography>
        <List>
          {securityEvents.slice(0, 5).map((event) => (
            <React.Fragment key={event.id}>
              <ListItem>
                <ListItemIcon>
                  {event.severity === 'critical' ? <Error color="error" /> :
                   event.severity === 'high' ? <Warning color="error" /> :
                   event.severity === 'medium' ? <Warning color="warning" /> :
                   <Warning color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={event.description}
                  secondary={`${event.type} - ${new Date(event.timestamp).toLocaleString()}`}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={event.resolved ? 'Resolved' : 'Active'}
                    color={event.resolved ? 'success' : 'error'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <PermissionGate permission="device_management" action="view">
      <Box sx={{ p: 3 }}>
        <DataClassificationBanner 
          classification="INTERNAL"
          showWarning={deviceMetrics?.compromisedDevices ? deviceMetrics.compromisedDevices > 0 : false}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            Zero Trust Device Manager
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto Refresh"
            />
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                loadDevices();
                loadSecurityEvents();
                calculateMetrics();
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Metrics Cards */}
        {renderMetricsCards()}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Device Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="cameras">Cameras</MenuItem>
                    <MenuItem value="sensors">Sensors</MenuItem>
                    <MenuItem value="timingGates">Timing Gates</MenuItem>
                    <MenuItem value="mobileDevices">Mobile Devices</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="offline">Offline</MenuItem>
                    <MenuItem value="compromised">Compromised</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showOfflineDevices}
                      onChange={(e) => setShowOfflineDevices(e.target.checked)}
                    />
                  }
                  label="Show Offline Devices"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Refresh Interval (seconds)"
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  inputProps={{ min: 10, max: 300 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Device Table */}
        {loading ? (
          <LinearProgress />
        ) : (
          renderDeviceTable()
        )}

        {/* Security Events */}
        {renderSecurityEvents()}

        {/* Device Details Dialog */}
        <Dialog 
          open={deviceDetailsOpen} 
          onClose={() => setDeviceDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Device Details: {selectedDevice?.name}</DialogTitle>
          <DialogContent>
            {selectedDevice && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>General Information</Typography>
                  <Typography>ID: {selectedDevice.id}</Typography>
                  <Typography>Model: {selectedDevice.model}</Typography>
                  <Typography>Firmware: {selectedDevice.firmwareVersion}</Typography>
                  <Typography>Location: {selectedDevice.location}</Typography>
                  <Typography>Zone: {selectedDevice.zone}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Security Status</Typography>
                  <Typography>Trust Score: {selectedDevice.trustScore}</Typography>
                  <Typography>Certification: {selectedDevice.certificationStatus}</Typography>
                  <Typography>Encryption: {selectedDevice.encryptionEnabled ? 'Enabled' : 'Disabled'}</Typography>
                  <Typography>Tamper Status: {selectedDevice.tamperDetected ? 'Detected' : 'None'}</Typography>
                  <Typography>Network: {selectedDevice.networkStatus}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                  {selectedDevice.batteryLevel && (
                    <Typography>Battery: {selectedDevice.batteryLevel}%</Typography>
                  )}
                  {selectedDevice.temperature && (
                    <Typography>Temperature: {selectedDevice.temperature}°C</Typography>
                  )}
                  {selectedDevice.signalStrength && (
                    <Typography>Signal: {selectedDevice.signalStrength}%</Typography>
                  )}
                  <Typography>Data Transmitted: {(selectedDevice.dataTransmitted / 1048576).toFixed(2)} MB</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Compliance</Typography>
                  <Typography>Compliance Score: {selectedDevice.complianceScore}%</Typography>
                  <Typography>Active Alerts: {selectedDevice.alertsCount}</Typography>
                  <Typography>Geofenced: {selectedDevice.geofenced ? 'Yes' : 'No'}</Typography>
                  <Typography>Last Validated: {new Date(selectedDevice.lastValidated).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeviceDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Isolate Device Dialog */}
        <Dialog open={isolateDialogOpen} onClose={() => setIsolateDialogOpen(false)}>
          <DialogTitle>Isolate Device</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This will immediately disconnect the device from the network and require manual reauthorization.
            </Alert>
            <Typography>
              Are you sure you want to isolate "{selectedDevice?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsolateDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => selectedDevice && handleDeviceIsolation(selectedDevice.id)}
            >
              Isolate Device
            </Button>
          </DialogActions>
        </Dialog>

        {/* Certificate Renewal Dialog */}
        <Dialog open={certificateDialogOpen} onClose={() => setCertificateDialogOpen(false)}>
          <DialogTitle>Renew Security Certificate</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will generate and install a new security certificate for the device.
            </Alert>
            <Typography>
              Renew certificate for "{selectedDevice?.name}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCertificateDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => selectedDevice && handleCertificateRenewal(selectedDevice.id)}
            >
              Renew Certificate
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PermissionGate>
  );
};

export default ZeroTrustDeviceManager; 