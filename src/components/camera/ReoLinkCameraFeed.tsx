// 📹 ReoLink E1 Pro Camera Feed with HLS Streaming
// Real camera integration with RTSP-to-HLS conversion, WebSocket PTZ controls, and AI monitoring

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Typography,
  Select,
  Progress,
  Alert,
  Divider,
  Statistic,
  Tag,
  Tooltip,
  Badge,
  Switch,
  message
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  DisconnectOutlined,
  WifiOutlined,
  VideoCameraOutlined,
  CloudServerOutlined,
  ThunderboltOutlined,
  MonitorOutlined
} from '@ant-design/icons';

import { useSmartAIMonitoring } from '../../hooks/useSmartAIMonitoring';
import { 
  aiMonitoringSchedules, 
  aiMonitoringUIConfig,
  monitoringTimeHelpers 
} from '../../config/aiMonitoringScheduleConfig';
import { 
  reoLinkE1ProCameras,
  reoLinkE1ProConnectionConfig,
  reoLinkE1ProHelpers,
  getActiveCameraId,
  setActiveCameraId,
  type IReoLinkE1ProCamera
} from '../../config/reoLinkConfig';
import { 
  reoLinkService,
  type IReoLinkStreamInfo,
  type IReoLinkHealthStatus,
  type IReoLinkPTZControl
} from '../../services/reoLinkService';
import { brandConfig } from '../../config/brandConfig';
import { aiVisionService } from '../../services/aiVisionService';

const { Title, Text } = Typography;
const { Option } = Select;

interface IReoLinkCameraFeedProps {
  onFrameCapture?: (imageData: string) => void;
  onAIAnalysis?: (analysisData: any) => void;
  onConnectionStatusChange?: (isConnected: boolean) => void;
}

export const ReoLinkCameraFeed: React.FC<IReoLinkCameraFeedProps> = ({
  onFrameCapture,
  onAIAnalysis,
  onConnectionStatusChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  
  // Camera state
  const [selectedCameraId, setSelectedCameraId] = useState<string>(getActiveCameraId());
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [streamQuality, setStreamQuality] = useState<'main' | 'sub'>('main');
  const [analysisLog, setAnalysisLog] = useState<any[]>([]);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [conversionServerStatus, setConversionServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  
  // Camera info and health
  const [currentCamera, setCurrentCamera] = useState<IReoLinkE1ProCamera | null>(null);
  const [streamInfo, setStreamInfo] = useState<IReoLinkStreamInfo | null>(null);
  const [healthStatus, setHealthStatus] = useState<IReoLinkHealthStatus | null>(null);
  const [hlsStats, setHlsStats] = useState<any>(null);
  
  // Smart monitoring hook
  const { state: monitoringState, controls: monitoringControls } = useSmartAIMonitoring(
    () => captureFrame(), // onCapturePhoto callback
    (analysis) => { // onAnalysisComplete callback
      if (onAIAnalysis) {
        onAIAnalysis(analysis);
      }
    }
  );

  // Load camera configuration
  useEffect(() => {
    const camera = reoLinkE1ProHelpers.getCameraById(selectedCameraId);
    setCurrentCamera(camera || null);
    setActiveCameraId(selectedCameraId);
  }, [selectedCameraId]);

  // Initialize camera connection
  useEffect(() => {
    if (currentCamera && conversionServerStatus === 'online') {
      initializeCamera();
    }
    
    return () => {
      cleanup();
    };
  }, [currentCamera, streamQuality, conversionServerStatus]);

  // Check conversion server status
  useEffect(() => {
    checkConversionServer();
    const interval = setInterval(checkConversionServer, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Health monitoring
  useEffect(() => {
    if (currentCamera && isConnected) {
      const healthInterval = setInterval(async () => {
        try {
          const health = await reoLinkService.getHealthStatus(currentCamera.id);
          setHealthStatus(health);
        } catch (error) {
          console.error('Health check failed:', error);
        }
      }, 5000);

      return () => clearInterval(healthInterval);
    }
  }, [currentCamera, isConnected]);

  // Cleanup function
  const cleanup = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
    }
  };

  // Check conversion server availability
  const checkConversionServer = async () => {
    try {
      setConversionServerStatus('checking');
      const { host, port } = reoLinkE1ProConnectionConfig.conversionServer;
      const response = await fetch(`http://${host}:${port}/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversionServerStatus(data.status === 'running' ? 'online' : 'offline');
      } else {
        setConversionServerStatus('offline');
      }
    } catch (error) {
      console.error('Conversion server check failed:', error);
      setConversionServerStatus('offline');
    }
  };

  // Initialize camera connection
  const initializeCamera = async () => {
    if (!currentCamera) return;
    
    try {
      setError('');
      setConnectionAttempts(prev => prev + 1);
      
      // Get stream information from service
      const streamInfo = await reoLinkService.getStreamInfo(currentCamera.id);
      if (!streamInfo) {
        throw new Error('Failed to get stream information');
      }
      
      setStreamInfo(streamInfo);
      
      // Start HLS stream
      await startHLSStream(streamInfo);
      
      // Connect WebSocket for PTZ control
      await connectWebSocket();
      
      setIsConnected(true);
      setIsStreaming(true);
      
      if (onConnectionStatusChange) {
        onConnectionStatusChange(true);
      }
      
      message.success(`Connected to ${currentCamera.name}`);
      
    } catch (error) {
      console.error('Camera initialization failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Camera initialization failed';
      setError(errorMessage);
      setIsConnected(false);
      setIsStreaming(false);
      
      if (onConnectionStatusChange) {
        onConnectionStatusChange(false);
      }
      
      message.error(errorMessage);
    }
  };

  // Start HLS stream
  const startHLSStream = async (streamInfo: IReoLinkStreamInfo) => {
    if (!videoRef.current || !streamInfo) return;
    
    try {
      const streamUrl = streamQuality === 'main' 
        ? streamInfo.streams.main.url 
        : streamInfo.streams.sub.url;
      
      console.log(`🎥 Starting HLS stream: ${streamUrl}`);
      
      if (Hls.isSupported()) {
        // Use HLS.js for browsers that support it
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000, // 60MB
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxLoadingDelay: 4,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          liveDurationInfinity: false,
          liveBackBufferLength: 0,
          maxLiveSyncPlaybackRate: 1.5,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 3,
          manifestLoadingRetryDelay: 1000,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 3,
          levelLoadingRetryDelay: 1000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 3,
          fragLoadingRetryDelay: 1000,
          startLevel: -1,
          startPosition: -1,
          autoStartLoad: true,
          debug: false
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        
        // HLS event handlers
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ HLS manifest parsed, starting playback');
          videoRef.current?.play().catch(error => {
            console.error('Video play failed:', error);
          });
        });
        
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          setHlsStats({
            fragments: data.frag.sn,
            level: data.frag.level,
            loadTime: 0, // Simplified - stats not available in this HLS version
            size: 0      // Simplified - stats not available in this HLS version
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error:', data);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error, destroying HLS instance');
                hls.destroy();
                setError('HLS streaming failed');
                break;
            }
          }
        });
        
        hlsRef.current = hls;
        
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(error => {
            console.error('Video play failed:', error);
          });
        });
      } else {
        throw new Error('HLS streaming not supported in this browser');
      }
      
    } catch (error) {
      console.error('Failed to start HLS stream:', error);
      throw error;
    }
  };

  // Connect WebSocket for PTZ control
  const connectWebSocket = async (): Promise<void> => {
    if (!currentCamera) return;
    
    return new Promise((resolve, reject) => {
      const { host, websocketPort } = reoLinkE1ProConnectionConfig.conversionServer;
      const wsUrl = `ws://${host}:${websocketPort}`;
      const ws = new WebSocket(wsUrl);
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 10000);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        console.log(`✅ WebSocket connected for PTZ control: ${currentCamera.name}`);
        
        // Send initial configuration
        ws.send(JSON.stringify({
          type: 'configure',
          cameraId: currentCamera.id,
          quality: streamQuality
        }));
        
        websocketRef.current = ws;
        resolve();
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('WebSocket message parsing failed:', error);
        }
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`❌ WebSocket error for ${currentCamera.name}:`, error);
        reject(error);
      };
      
      ws.onclose = () => {
        console.log(`🔌 WebSocket closed for ${currentCamera.name}`);
        websocketRef.current = null;
      };
    });
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'ptz_response':
        if (!message.success) {
          setError(`PTZ command failed: ${message.error}`);
        }
        break;
      case 'stream_status':
        console.log('Stream status update:', message.data);
        break;
      case 'error':
        setError(`WebSocket error: ${message.message}`);
        break;
      default:
        console.log('Unknown WebSocket message:', message);
    }
  };

  // Stop video stream
  const stopVideoStream = () => {
    cleanup();
    setIsStreaming(false);
    setIsConnected(false);
    setStreamInfo(null);
    setHlsStats(null);
    
    // Also stop monitoring
    if (monitoringState.isActive) {
      monitoringControls.stopMonitoring();
    }
    
    if (onConnectionStatusChange) {
      onConnectionStatusChange(false);
    }
    
    message.info('Stream stopped');
  };

  // Capture frame from video for AI analysis
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !isStreaming) return null;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!canvas) return null;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      if (onFrameCapture) {
        onFrameCapture(imageData);
      }
      
      // Perform AI analysis
      await performAIAnalysis(imageData);
      
      return imageData;
      
    } catch (error) {
      console.error('Frame capture failed:', error);
      return null;
    }
  }, [isStreaming, onFrameCapture]);

  // AI analysis with smart monitoring context
  const performAIAnalysis = async (imageData: string) => {
    if (!currentCamera) return;
    
    try {
      const analysis = await aiVisionService.analyzeHorseImage(imageData, {
        name: currentCamera.name,
        age: 8,
        breed: 'Mixed',
        knownConditions: ['General monitoring'],
        priority: monitoringState.currentPattern.priority
      });

      const displayAnalysis = {
        timestamp: analysis.timestamp,
        cameraId: currentCamera.id,
        cameraName: currentCamera.name,
        location: currentCamera.location,
        horseDetected: analysis.horseDetected,
        activityLevel: analysis.confidence * 100,
        posture: analysis.healthAssessment.posture,
        alertLevel: analysis.alertLevel,
        observations: analysis.behaviorObservations.join(', '),
        mobility: analysis.healthAssessment.mobility,
        breathing: analysis.healthAssessment.breathing,
        recommendations: analysis.recommendations,
        riskScore: analysis.riskScore,
        phase: monitoringState.currentPhase,
        pattern: monitoringState.currentPattern.analysisMode,
        streamQuality,
        streamStats: hlsStats
      };

      setAnalysisLog(prev => [displayAnalysis, ...prev.slice(0, 9)]);

      if (onAIAnalysis) {
        onAIAnalysis(displayAnalysis);
      }

      if (aiVisionService.needsImmediateAttention(analysis)) {
        message.warning(`🚨 URGENT: AI detected concerning signs on ${currentCamera.name}. Please check immediately!`);
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysisLog(prev => [{
        timestamp: new Date().toISOString(),
        cameraId: currentCamera.id,
        cameraName: currentCamera.name,
        location: currentCamera.location,
        horseDetected: false,
        activityLevel: 0,
        posture: 'unknown',
        alertLevel: 'low',
        observations: 'AI analysis unavailable',
        mobility: 'unknown',
        breathing: 'unknown',
        recommendations: ['Check AI service configuration'],
        riskScore: 0,
        phase: monitoringState.currentPhase,
        pattern: 'fallback',
        streamQuality,
        streamStats: null
      }, ...prev.slice(0, 9)]);
    }
  };

  // PTZ Controls via WebSocket
  const handlePTZControl = async (command: IReoLinkPTZControl['command'], value?: number) => {
    if (!currentCamera || !currentCamera.ptzSupport || !websocketRef.current) return;

    try {
      const ptzCommand = {
        type: 'ptz_control',
        cameraId: currentCamera.id,
        command,
        value
      };
      
      websocketRef.current.send(JSON.stringify(ptzCommand));
      
      // Visual feedback
      message.success(`PTZ command sent: ${command}`);
      
    } catch (error) {
      console.error('PTZ control failed:', error);
      setError(`PTZ control error: ${error instanceof Error ? error.message : 'PTZ control failed'}`);
    }
  };

  // Capture snapshot
  const handleCaptureSnapshot = async () => {
    if (!currentCamera || !isStreaming) return;

    try {
      const imageData = await captureFrame();
      if (imageData) {
        // Create download link
        const link = document.createElement('a');
        link.download = `${currentCamera.name}_snapshot_${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
        link.href = imageData;
        link.click();
        
        message.success('Snapshot captured and downloaded');
      }
    } catch (error) {
      console.error('Snapshot capture failed:', error);
      setError('Snapshot capture failed');
    }
  };

  // Get connection status display
  const getConnectionStatus = () => {
    if (isConnected && isStreaming) {
      return { 
        status: 'connected', 
        color: brandConfig.colors.successGreen,
        label: 'Streaming',
        icon: <WifiOutlined />
      };
    } else if (isConnected && !isStreaming) {
      return { 
        status: 'connecting', 
        color: brandConfig.colors.alertAmber,
        label: 'Connecting...',
        icon: <ReloadOutlined spin />
      };
    } else {
      return { 
        status: 'disconnected', 
        color: brandConfig.colors.errorRed,
        label: 'Disconnected',
        icon: <DisconnectOutlined />
      };
    }
  };

  // Get phase display info
  const getPhaseDisplay = () => {
    const { currentPhase } = monitoringState;
    const config = aiMonitoringUIConfig.statusIndicators.currentPhase;
    
    if (monitoringState.isEmergencyMode) {
      return { label: config.emergencyLabel, color: aiMonitoringUIConfig.colors.emergencyPhase };
    } else if (monitoringState.isPaused) {
      return { label: config.pauseLabel, color: aiMonitoringUIConfig.colors.pausePhase };
    } else {
      return {
        label: currentPhase === 'day' ? config.dayLabel : config.nightLabel,
        color: currentPhase === 'day' ? aiMonitoringUIConfig.colors.dayPhase : aiMonitoringUIConfig.colors.nightPhase
      };
    }
  };

  const connectionStatus = getConnectionStatus();
  const phaseDisplay = getPhaseDisplay();

  return (
    <div style={{ padding: brandConfig.spacing.md }}>
      {/* Header with Camera Selection and Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: brandConfig.spacing.lg }}>
        <Col xs={24} sm={12} md={8}>
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong style={{ fontFamily: brandConfig.typography.fontPrimary }}>
                Camera Selection
              </Text>
              <Select
                value={selectedCameraId}
                onChange={setSelectedCameraId}
                style={{ width: '100%' }}
                placeholder="Select a camera"
              >
                {reoLinkE1ProCameras.map(camera => (
                  <Option key={camera.id} value={camera.id}>
                    <Space>
                      <VideoCameraOutlined />
                      {camera.name}
                      {!camera.enabled && <Tag color="red">Disabled</Tag>}
                    </Space>
                  </Option>
                ))}
              </Select>
              {currentCamera && (
                <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                  {currentCamera.description}
                </Text>
              )}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Connection Status</Text>
              <Space>
                <Badge 
                  color={connectionStatus.color} 
                  text={
                    <Text style={{ color: connectionStatus.color }}>
                      {connectionStatus.icon} {connectionStatus.label}
                    </Text>
                  } 
                />
              </Space>
              <Space direction="vertical" size="small">
                <Space>
                  <CloudServerOutlined />
                  <Text type="secondary">
                    Server: {conversionServerStatus === 'online' ? 'Online' : 'Offline'}
                  </Text>
                  <Badge 
                    color={conversionServerStatus === 'online' ? 'green' : 'red'} 
                    status={conversionServerStatus === 'online' ? 'success' : 'error'}
                  />
                </Space>
                {healthStatus && (
                  <Space size="small">
                    <Text type="secondary">Latency: {Math.round(healthStatus.latency)}ms</Text>
                    <Text type="secondary">Quality: {healthStatus.streamQuality}</Text>
                  </Space>
                )}
              </Space>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={8}>
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>AI Monitoring Status</Text>
              <Space>
                <Tag color={phaseDisplay.color}>{phaseDisplay.label}</Tag>
                {monitoringState.isActive && (
                  <Badge 
                    status="processing" 
                    text={monitoringState.isInSession ? "Analyzing" : "Waiting"} 
                  />
                )}
              </Space>
              <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                Sessions: {monitoringState.stats.sessionsCompleted} | Photos: {monitoringState.stats.totalPhotosToday}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Conversion Server Status Alert */}
      {conversionServerStatus === 'offline' && (
        <Alert
          type="warning"
          message="Conversion Server Required"
          description="The RTSP-to-HLS conversion server is not running. Please start rtsp-conversion-server.js to enable camera streaming."
          showIcon
          action={
            <Button size="small" onClick={checkConversionServer}>
              Check Again
            </Button>
          }
          style={{ marginBottom: brandConfig.spacing.md }}
        />
      )}

      {/* Main Video Feed and Controls */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <CameraOutlined />
                {currentCamera?.name || 'No Camera Selected'} - HLS Stream
                {currentCamera?.location && (
                  <Tag color="blue">{currentCamera.location}</Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                <Select
                  value={streamQuality}
                  onChange={setStreamQuality}
                  size="small"
                  style={{ minWidth: 120 }}
                >
                  <Option value="main">Main Stream</Option>
                  <Option value="sub">Sub Stream</Option>
                </Select>
                <Tooltip title="Refresh Connection">
                  <Button 
                    icon={<ReloadOutlined />} 
                    size="small" 
                    onClick={initializeCamera}
                    loading={connectionAttempts > 0 && !isConnected}
                  />
                </Tooltip>
              </Space>
            }
          >
            <div style={{ position: 'relative', backgroundColor: brandConfig.colors.midnightBlack, minHeight: 400 }}>
              {currentCamera ? (
                <>
                  {/* HLS Video Player */}
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <video
                      ref={videoRef}
                      style={{
                        width: '100%',
                        maxWidth: '800px',
                        height: 'auto',
                        borderRadius: brandConfig.layout.borderRadius,
                        border: `2px solid ${brandConfig.colors.stableMahogany}`,
                        backgroundColor: brandConfig.colors.midnightBlack
                      }}
                      controls
                      muted
                      autoPlay
                      playsInline
                      onLoadedMetadata={() => {
                        console.log('Video metadata loaded');
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                        setError('Video playback error');
                      }}
                    />
                    
                    {/* Live indicator overlay */}
                    {isStreaming && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightBold,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          animation: 'pulse 2s infinite'
                        }} />
                        LIVE - {currentCamera.name}
                      </div>
                    )}
                    
                    {/* Stream info overlay */}
                    {hlsStats && (
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: brandConfig.typography.fontSizeXs
                      }}>
                        Level: {hlsStats.level} | Fragments: {hlsStats.fragments}
                      </div>
                    )}
                  </div>
                  
                  {/* Hidden canvas for frame capture */}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  
                  {!isStreaming && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: brandConfig.colors.arenaSand,
                      zIndex: 10
                    }}>
                      <Space direction="vertical" align="center">
                        <VideoCameraOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                        <Text style={{ color: brandConfig.colors.arenaSand }}>
                          🎯 LIVE CAMERA: {currentCamera.name}
                        </Text>
                        <Text style={{ color: brandConfig.colors.sterlingSilver, fontSize: brandConfig.typography.fontSizeSm }}>
                          IP: {currentCamera.host}
                        </Text>
                        <Button 
                          type="primary" 
                          icon={<PlayCircleOutlined />}
                          onClick={initializeCamera}
                          loading={connectionAttempts > 0 && !isConnected}
                          disabled={conversionServerStatus !== 'online'}
                        >
                          Start HLS Stream
                        </Button>
                      </Space>
                    </div>
                  )}
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                  color: brandConfig.colors.sterlingSilver
                }}>
                  <Space direction="vertical" align="center">
                    <CameraOutlined style={{ fontSize: 48 }} />
                    <Text>Select a camera to begin streaming</Text>
                  </Space>
                </div>
              )}
            </div>
            
            {error && (
              <Alert
                type="error"
                message="Camera Error"
                description={error}
                style={{ marginTop: brandConfig.spacing.sm }}
                action={
                  <Button size="small" onClick={() => setError('')}>
                    Dismiss
                  </Button>
                }
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          {/* Camera Controls */}
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Stream Controls */}
            <Card size="small" title="Stream Controls">
              <Space wrap>
                <Button
                  type={isStreaming ? "default" : "primary"}
                  icon={isStreaming ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={isStreaming ? stopVideoStream : initializeCamera}
                  disabled={!currentCamera || conversionServerStatus !== 'online'}
                >
                  {isStreaming ? 'Stop' : 'Start'}
                </Button>
                <Button
                  icon={<CameraOutlined />}
                  onClick={handleCaptureSnapshot}
                  disabled={!isStreaming}
                >
                  Snapshot
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={captureFrame}
                  disabled={!isStreaming}
                  type="dashed"
                >
                  Capture for AI
                </Button>
              </Space>
            </Card>

            {/* PTZ Controls */}
            {currentCamera?.ptzSupport && (
              <Card size="small" title="PTZ Controls">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 8 }}>
                    <Button
                      icon={<ArrowUpOutlined />}
                      onClick={() => handlePTZControl('up')}
                      disabled={!isConnected || !websocketRef.current}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Space>
                      <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => handlePTZControl('left')}
                        disabled={!isConnected || !websocketRef.current}
                      />
                      <Button
                        onClick={() => handlePTZControl('stop')}
                        disabled={!isConnected || !websocketRef.current}
                      >
                        Stop
                      </Button>
                      <Button
                        icon={<ArrowRightOutlined />}
                        onClick={() => handlePTZControl('right')}
                        disabled={!isConnected || !websocketRef.current}
                      />
                    </Space>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Button
                      icon={<ArrowDownOutlined />}
                      onClick={() => handlePTZControl('down')}
                      disabled={!isConnected || !websocketRef.current}
                    />
                  </div>
                  <Space>
                    <Button
                      icon={<ZoomInOutlined />}
                      onClick={() => handlePTZControl('zoomIn')}
                      disabled={!isConnected || !websocketRef.current}
                      size="small"
                    >
                      Zoom In
                    </Button>
                    <Button
                      icon={<ZoomOutOutlined />}
                      onClick={() => handlePTZControl('zoomOut')}
                      disabled={!isConnected || !websocketRef.current}
                      size="small"
                    >
                      Zoom Out
                    </Button>
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                      WebSocket: {websocketRef.current ? 'Connected' : 'Disconnected'}
                    </Text>
                  </div>
                </div>
              </Card>
            )}

            {/* Smart Monitoring Controls */}
            <Card size="small" title="Smart AI Monitoring">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space wrap>
                  <Button
                    type={monitoringState.isActive ? "default" : "primary"}
                    icon={monitoringState.isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={monitoringState.isActive ? monitoringControls.stopMonitoring : monitoringControls.startMonitoring}
                    disabled={!isStreaming}
                  >
                    {monitoringState.isActive ? 'Stop Monitoring' : 'Start Monitoring'}
                  </Button>
                  
                  {monitoringState.isActive && (
                    <Button
                      icon={monitoringState.isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                      onClick={monitoringState.isPaused ? monitoringControls.resumeMonitoring : monitoringControls.pauseMonitoring}
                    >
                      {monitoringState.isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}
                </Space>
                
                {monitoringState.isActive && (
                  <Progress
                    percent={(monitoringState.sessionProgress.photosInSession / monitoringState.sessionProgress.totalPhotosInSession) * 100}
                    size="small"
                    format={() => `${monitoringState.sessionProgress.photosInSession}/${monitoringState.sessionProgress.totalPhotosInSession}`}
                  />
                )}
                
                <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                  Current: {phaseDisplay.label} | Pattern: {monitoringState.currentPattern.analysisMode}
                </Text>
              </Space>
            </Card>

            {/* Stream Statistics */}
            {hlsStats && (
              <Card size="small" title="Stream Statistics">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Statistic
                        title="Level"
                        value={hlsStats.level}
                        valueStyle={{ fontSize: brandConfig.typography.fontSizeSm }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Fragments"
                        value={hlsStats.fragments}
                        valueStyle={{ fontSize: brandConfig.typography.fontSizeSm }}
                      />
                    </Col>
                  </Row>
                  <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                    Load Time: {hlsStats.loadTime}ms | Size: {Math.round(hlsStats.size / 1024)}KB
                  </Text>
                </Space>
              </Card>
            )}

            {/* Recent Analysis */}
            {analysisLog.length > 0 && (
              <Card size="small" title="Recent Analysis" style={{ maxHeight: 300, overflow: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {analysisLog.slice(0, 3).map((analysis, index) => (
                    <div key={index} style={{
                      padding: brandConfig.spacing.sm,
                      backgroundColor: brandConfig.colors.arenaSand,
                      borderRadius: brandConfig.layout.borderRadius,
                      fontSize: brandConfig.typography.fontSizeXs
                    }}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Tag color={analysis.alertLevel === 'high' ? 'red' : analysis.alertLevel === 'medium' ? 'orange' : 'green'}>
                            {analysis.alertLevel}
                          </Tag>
                          <Text type="secondary">
                            {new Date(analysis.timestamp).toLocaleTimeString()}
                          </Text>
                        </div>
                        <Text>{analysis.observations}</Text>
                        {analysis.recommendations.length > 0 && (
                          <Text type="secondary">
                            → {analysis.recommendations[0]}
                          </Text>
                        )}
                      </Space>
                    </div>
                  ))}
                </Space>
              </Card>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ReoLinkCameraFeed; 