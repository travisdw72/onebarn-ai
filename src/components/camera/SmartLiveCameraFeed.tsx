// 🤖 Smart Live Camera Feed with Schedule-Based AI Monitoring
// Uses config-driven scheduling for day/night patterns, session management, and pause periods

import React, { useRef, useState } from 'react';
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
  Tooltip
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  EyeOutlined
} from '@ant-design/icons';

import { useSmartAIMonitoring } from '../../hooks/useSmartAIMonitoring';
import { 
  aiMonitoringSchedules, 
  aiMonitoringUIConfig,
  monitoringTimeHelpers 
} from '../../config/aiMonitoringScheduleConfig';
import { brandConfig } from '../../config/brandConfig';
import { aiVisionService } from '../../services/aiVisionService';

const { Title, Text } = Typography;
const { Option } = Select;

interface ISmartLiveCameraFeedProps {
  onFrameCapture?: (imageData: string) => void;
  onAIAnalysis?: (analysisData: any) => void;
}

export const SmartLiveCameraFeed: React.FC<ISmartLiveCameraFeedProps> = ({
  onFrameCapture,
  onAIAnalysis
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Camera state
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [analysisLog, setAnalysisLog] = useState<any[]>([]);
  
  // Smart monitoring hook
  const { state: monitoringState, controls: monitoringControls } = useSmartAIMonitoring(
    () => captureFrame(), // onCapturePhoto callback
    (analysis) => { // onAnalysisComplete callback
      if (onAIAnalysis) {
        onAIAnalysis(analysis);
      }
    }
  );
  
  // Camera management
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      
      // Also stop monitoring
      if (monitoringState.isActive) {
        monitoringControls.stopMonitoring();
      }
    }
  };

  // Capture frame and trigger AI analysis
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        if (onFrameCapture) {
          onFrameCapture(imageData);
        }

        // Perform AI analysis
        performAIAnalysis(imageData);
        
        return imageData;
      }
    }
    return null;
  };

  // AI analysis with smart monitoring context
  const performAIAnalysis = async (imageData: string) => {
    try {
      const analysis = await aiVisionService.analyzeHorseImage(imageData, {
        name: 'Monitored Horse',
        age: 8,
        breed: 'Mixed',
        knownConditions: ['General monitoring'],
        priority: monitoringState.currentPattern.priority
      });

      const displayAnalysis = {
        timestamp: analysis.timestamp,
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
        pattern: monitoringState.currentPattern.analysisMode
      };

      setAnalysisLog(prev => [displayAnalysis, ...prev.slice(0, 9)]);

      if (onAIAnalysis) {
        onAIAnalysis(displayAnalysis);
      }

      if (aiVisionService.needsImmediateAttention(analysis)) {
        alert('🚨 URGENT: AI detected concerning signs. Please check your horse immediately!');
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysisLog(prev => [{
        timestamp: new Date().toISOString(),
        horseDetected: true,
        activityLevel: 50,
        posture: 'normal',
        alertLevel: 'low',
        observations: 'AI analysis unavailable',
        mobility: 'unknown',
        breathing: 'unknown',
        recommendations: ['Check AI service configuration'],
        riskScore: 0,
        phase: monitoringState.currentPhase,
        pattern: 'fallback'
      }, ...prev.slice(0, 9)]);
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

  const phaseDisplay = getPhaseDisplay();

  return (
    <div style={{ 
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand 
    }}>
      <Title level={2} style={{ color: brandConfig.colors.stableMahogany }}>
        🤖 Smart AI Monitoring Camera
      </Title>

      <Row gutter={[16, 16]}>
        {/* Main Camera Feed */}
        <Col span={16}>
          <Card 
            title={
              <Space>
                <CameraOutlined />
                <span>Live Camera Feed</span>
                {isStreaming && <Tag color="red">● LIVE</Tag>}
                {monitoringState.isActive && (
                  <Tag color={phaseDisplay.color} style={{ color: 'white' }}>
                    {phaseDisplay.label}
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                {!isStreaming ? (
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={startCamera}
                    style={{ backgroundColor: brandConfig.colors.hunterGreen }}
                  >
                    Start Camera
                  </Button>
                ) : (
                  <Button 
                    danger 
                    icon={<PauseCircleOutlined />}
                    onClick={stopCamera}
                  >
                    Stop Camera
                  </Button>
                )}
              </Space>
            }
          >
            <div style={{ position: 'relative' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: brandConfig.layout.borderRadius,
                  objectFit: 'cover',
                  border: isStreaming ? `2px solid ${brandConfig.colors.pastureSage}` : `1px solid #d9d9d9`
                }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Session Progress Overlay */}
              {monitoringState.isActive && monitoringState.isInSession && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: brandConfig.spacing.sm,
                  borderRadius: brandConfig.layout.borderRadius,
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: '12px' }}>
                      Session: {monitoringState.sessionProgress.photosInSession}/{monitoringState.sessionProgress.totalPhotosInSession} photos
                    </Text>
                    <Text style={{ color: 'white', fontSize: '12px' }}>
                      Next: {monitoringTimeHelpers.formatDuration(monitoringState.timeToNextAction)}
                    </Text>
                  </div>
                  <Progress 
                    percent={(monitoringState.sessionProgress.photosInSession / monitoringState.sessionProgress.totalPhotosInSession) * 100}
                    size="small"
                    showInfo={false}
                    strokeColor={brandConfig.colors.hunterGreen}
                  />
                </div>
              )}
            </div>

            {error && (
              <Alert
                message="Camera Error"
                description={error}
                type="error"
                style={{ marginTop: brandConfig.spacing.sm }}
              />
            )}
          </Card>
        </Col>

        {/* Smart Controls Panel */}
        <Col span={8}>
          <Card title="🤖 Smart Monitoring Controls">
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Schedule Selector */}
              <div>
                <Text strong>{aiMonitoringUIConfig.scheduleSelector.title}</Text>
                <Select
                  style={{ width: '100%', marginTop: brandConfig.spacing.xs }}
                  value={monitoringState.schedule.id}
                  onChange={monitoringControls.changeSchedule}
                >
                  {aiMonitoringSchedules.map(schedule => (
                    <Option key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </Option>
                  ))}
                </Select>
                <Text style={{ fontSize: '11px', color: brandConfig.colors.neutralGray }}>
                  {monitoringState.schedule.description}
                </Text>
              </div>

              <Divider />

              {/* Monitoring Controls */}
              <Space wrap>
                {!monitoringState.isActive ? (
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={monitoringControls.startMonitoring}
                    disabled={!isStreaming}
                    style={{ backgroundColor: brandConfig.colors.hunterGreen }}
                  >
                    Start Smart Monitoring
                  </Button>
                ) : (
                  <Button
                    danger
                    icon={<PauseCircleOutlined />}
                    onClick={monitoringControls.stopMonitoring}
                  >
                    Stop Monitoring
                  </Button>
                )}

                {monitoringState.isActive && (
                  <>
                    {monitoringState.isPaused ? (
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={monitoringControls.resumeMonitoring}
                        style={{ backgroundColor: brandConfig.colors.pastureSage }}
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button
                        icon={<PauseCircleOutlined />}
                        onClick={monitoringControls.pauseMonitoring}
                      >
                        Pause
                      </Button>
                    )}

                    <Button
                      type="primary"
                      danger={monitoringState.isEmergencyMode}
                      icon={<WarningOutlined />}
                      onClick={monitoringState.isEmergencyMode ? 
                        monitoringControls.exitEmergencyMode : 
                        monitoringControls.switchToEmergencyMode
                      }
                    >
                      {monitoringState.isEmergencyMode ? 'Exit Emergency' : 'Emergency Mode'}
                    </Button>

                    <Button
                      icon={<CameraOutlined />}
                      onClick={monitoringControls.captureNow}
                      style={{ backgroundColor: brandConfig.colors.stableMahogany, color: 'white' }}
                    >
                      Capture Now
                    </Button>
                  </>
                )}
              </Space>

              <Divider />

              {/* Status Display */}
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Statistic
                    title="Photos Today"
                    value={monitoringState.stats.totalPhotosToday}
                    prefix={<CameraOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Sessions"
                    value={monitoringState.stats.sessionsCompleted}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Uptime"
                    value={monitoringState.stats.uptime}
                    suffix="min"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Next Action"
                    value={monitoringTimeHelpers.formatDuration(monitoringState.timeToNextAction)}
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
              </Row>

              {/* Current Pattern Info */}
              {monitoringState.isActive && (
                <div style={{ 
                  padding: brandConfig.spacing.sm,
                  backgroundColor: brandConfig.colors.surface,
                  borderRadius: brandConfig.layout.borderRadius,
                  marginTop: brandConfig.spacing.sm
                }}>
                  <Text strong style={{ fontSize: '12px' }}>Current Pattern:</Text>
                  <br />
                  <Text style={{ fontSize: '11px' }}>
                    {monitoringState.currentPattern.photosPerSession} photos every {monitoringState.currentPattern.intervalBetweenPhotos}s
                  </Text>
                  <br />
                  <Text style={{ fontSize: '11px' }}>
                    Pause: {monitoringState.currentPhase === 'day' ? 
                      monitoringState.schedule.pauseBetweenSessions.dayPauseMinutes :
                      monitoringState.schedule.pauseBetweenSessions.nightPauseMinutes} min
                  </Text>
                </div>
              )}
            </Space>
          </Card>

          {/* Analysis Results */}
          {analysisLog.length > 0 && (
            <Card 
              title="Recent AI Analysis"
              style={{ marginTop: brandConfig.spacing.md }}
            >
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {analysisLog.map((analysis, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: brandConfig.spacing.sm,
                      marginBottom: brandConfig.spacing.xs,
                      backgroundColor: index === 0 ? brandConfig.colors.pastureSage + '20' : brandConfig.colors.surface,
                      borderRadius: brandConfig.layout.borderRadius,
                      border: `1px solid ${brandConfig.colors.pastureSage}`
                    }}
                  >
                    <Space>
                      <Text strong style={{ fontSize: '12px' }}>
                        {new Date(analysis.timestamp).toLocaleTimeString()}
                      </Text>
                      <Tag color={analysis.phase === 'day' ? 'orange' : 'blue'}>
                        {analysis.phase}
                      </Tag>
                      <Tag>{analysis.pattern}</Tag>
                    </Space>
                    <br />
                    <Text style={{ fontSize: '11px' }}>
                      Risk: {(analysis.riskScore * 100).toFixed(0)}% | 
                      Activity: {analysis.activityLevel.toFixed(0)}% | 
                      Alert: {analysis.alertLevel}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px', color: brandConfig.colors.textSecondary }}>
                      {analysis.observations.substring(0, 50)}...
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}; 