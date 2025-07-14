/**
 * 🎥 Live Video Grid with AI Monitoring Integration
 * 
 * BUSINESS PARTNER DEMO COMPONENT
 * Provides professional camera grid interface with real-time AI analysis
 * Specifically designed for demo@onebarnai.com account demonstrations
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  VideoCameraOutlined, 
  EyeOutlined, 
  CloseOutlined,
  FullscreenOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  RobotOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Grid, 
  Row, 
  Col,
  Badge,
  Tooltip,
  Progress,
  Switch,
  Slider,
  message
} from 'antd';
import { brandConfig } from '../../config/brandConfig';
import { LiveCameraFeed } from './LiveCameraFeed';
import { SmartLiveCameraFeed } from './SmartLiveCameraFeed';
import { aiVisionService } from '../../services/aiVisionService';
const { Title, Text } = Typography;

interface ILiveVideoGridProps {
  cameras: Array<{
    id: string;
    name: string;
    stream?: MediaStream;
    isActive?: boolean;
  }>;
  isOpen: boolean;
  onClose: () => void;
  demoMode?: boolean;
}

interface IAIAnalysisResult {
  timestamp: string;
  cameraId: string;
  horseDetected: boolean;
  confidence: number;
  alertLevel: 'low' | 'medium' | 'high';
  observations: string;
  recommendations: string[];
}

export const LiveVideoGrid: React.FC<ILiveVideoGridProps> = ({
  cameras,
  isOpen,
  onClose,
  demoMode = true
}) => {
  // State management
  const [selectedCamera, setSelectedCamera] = useState<string | null>(cameras[0]?.id || null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiMonitoringEnabled, setAiMonitoringEnabled] = useState(true);
  const [analysisInterval, setAnalysisInterval] = useState(5); // seconds
  const [analysisHistory, setAnalysisHistory] = useState<IAIAnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<IAIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cameraActive: false,
    aiActive: false,
    analysisCount: 0,
    lastAnalysis: null as string | null
  });

  // Simple monitoring state
  const [monitoringActive, setMonitoringActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simple monitoring functions
  const startMonitoring = () => {
    setMonitoringActive(true);
    console.log('🤖 AI Monitoring started');
  };

  const stopMonitoring = () => {
    setMonitoringActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    console.log('🤖 AI Monitoring stopped');
  };

  // Handle AI analysis results
  function handleAIAnalysis(result: IAIAnalysisResult) {
    setCurrentAnalysis(result);
    setAnalysisHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10
    setSystemStatus(prev => ({
      ...prev,
      analysisCount: prev.analysisCount + 1,
      lastAnalysis: result.timestamp,
      aiActive: true
    }));

    // Show alerts for high-priority detections
    if (result.alertLevel === 'high' && result.horseDetected) {
      message.warning(`🚨 High-priority detection: ${result.observations}`);
    }
  }

  // Handle frame capture from camera
  const handleFrameCapture = (imageData: string, cameraId: string) => {
    if (!aiMonitoringEnabled) return;
    
    setIsAnalyzing(true);
    
    // Perform AI analysis (mock for demo)
    setTimeout(() => {
      const mockAnalysis: IAIAnalysisResult = {
        timestamp: new Date().toISOString(),
        cameraId,
        horseDetected: Math.random() > 0.3, // 70% chance
        confidence: Math.random() * 40 + 60, // 60-100%
        alertLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        observations: [
          'Horse appears calm and relaxed',
          'Normal standing posture detected',
          'Active movement observed',
          'Feeding behavior detected',
          'Resting position noted'
        ][Math.floor(Math.random() * 5)],
        recommendations: ['Continue monitoring', 'Check water level', 'Verify feed schedule']
      };
      
      handleAIAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle AI monitoring
  const toggleAIMonitoring = () => {
    if (aiMonitoringEnabled) {
      stopMonitoring();
      setAiMonitoringEnabled(false);
      message.info('🤖 AI Monitoring stopped');
    } else {
      startMonitoring();
      setAiMonitoringEnabled(true);
      message.success('🤖 AI Monitoring started');
    }
  };

  // Update system status when cameras change
  useEffect(() => {
    setSystemStatus(prev => ({
      ...prev,
      cameraActive: cameras.length > 0 && cameras.some(c => c.isActive)
    }));
  }, [cameras]);

  // Styles
  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      zIndex: 9999,
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column' as const
    },
    header: {
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    content: {
      flex: 1,
      display: 'flex',
      padding: brandConfig.spacing.md,
      gap: brandConfig.spacing.md
    },
    mainVideo: {
      flex: 2,
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      overflow: 'hidden' as const
    },
    sidePanel: {
      flex: 1,
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: brandConfig.spacing.md,
      maxHeight: '100%',
      overflowY: 'auto' as const
    },
    controlPanel: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.sm,
      margin: brandConfig.spacing.sm,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.neutralGray}`
    },
    statusCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      border: `1px solid ${brandConfig.colors.neutralGray}`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.sm
    },
    analysisItem: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.xs,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.xs,
      fontSize: brandConfig.typography.fontSizeSm
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
          <VideoCameraOutlined style={{ fontSize: '24px' }} />
          <Title level={3} style={{ color: brandConfig.colors.barnWhite, margin: 0 }}>
            💼 Live Camera Feed with AI Monitoring
          </Title>
          <Badge 
            count={cameras.length} 
            style={{ backgroundColor: brandConfig.colors.successGreen }}
          />
        </div>
        
        <Space>
          <Tooltip title="Toggle Fullscreen">
            <Button 
              type="text" 
              icon={<FullscreenOutlined />} 
              onClick={toggleFullscreen}
              style={{ color: brandConfig.colors.barnWhite }}
            />
          </Tooltip>
          <Tooltip title="Close Camera Grid">
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClose}
              style={{ color: brandConfig.colors.barnWhite }}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Main Video Feed */}
        <div style={styles.mainVideo}>
          {selectedCamera ? (
            <SmartLiveCameraFeed
              onFrameCapture={(imageData) => handleFrameCapture(imageData, selectedCamera)}
              onAIAnalysis={(analysis) => {
                console.log('🤖 AI Analysis received:', analysis);
                handleAIAnalysis({
                  timestamp: analysis.timestamp || new Date().toISOString(),
                  cameraId: selectedCamera,
                  horseDetected: analysis.horseDetected || false,
                  confidence: analysis.activityLevel || 50,
                  alertLevel: analysis.alertLevel || 'low',
                  observations: analysis.observations || 'No specific observations',
                  recommendations: analysis.recommendations || ['Continue monitoring']
                });
              }}
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: brandConfig.colors.neutralGray
            }}>
              <div style={{ textAlign: 'center' }}>
                <VideoCameraOutlined style={{ fontSize: '48px', marginBottom: brandConfig.spacing.md }} />
                <Title level={4}>No Camera Selected</Title>
                <Text>Please select a camera from the panel</Text>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div style={styles.sidePanel}>
          {/* System Status */}
          <Card title="🎯 System Status" size="small" style={{ marginBottom: brandConfig.spacing.md }}>
            <div style={styles.statusCard}>
              <Row gutter={16}>
                <Col span={12}>
                  <Badge 
                    status={systemStatus.cameraActive ? 'success' : 'error'} 
                    text="Camera" 
                  />
                </Col>
                <Col span={12}>
                  <Badge 
                    status={systemStatus.aiActive ? 'success' : 'warning'} 
                    text="AI Analysis" 
                  />
                </Col>
              </Row>
              <div style={{ marginTop: brandConfig.spacing.sm }}>
                <Text strong>Analyses: </Text>
                <Text>{systemStatus.analysisCount}</Text>
              </div>
              {systemStatus.lastAnalysis && (
                <div>
                  <Text strong>Last: </Text>
                  <Text>{new Date(systemStatus.lastAnalysis).toLocaleTimeString()}</Text>
                </div>
              )}
            </div>
          </Card>

          {/* AI Controls */}
          <Card title="🤖 AI Monitoring Controls" size="small" style={{ marginBottom: brandConfig.spacing.md }}>
            <div style={styles.controlPanel}>
              <div style={{ marginBottom: brandConfig.spacing.sm }}>
                <Text strong>AI Monitoring: </Text>
                <Switch 
                  checked={aiMonitoringEnabled}
                  onChange={toggleAIMonitoring}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </div>
              
              <div style={{ marginBottom: brandConfig.spacing.sm }}>
                <Text strong>Analysis Interval: {analysisInterval}s</Text>
                <Slider
                  min={2}
                  max={30}
                  value={analysisInterval}
                  onChange={setAnalysisInterval}
                  marks={{ 2: '2s', 15: '15s', 30: '30s' }}
                />
              </div>

              {isAnalyzing && (
                <div style={{ textAlign: 'center' }}>
                  <Progress type="circle" size={40} status="active" />
                  <div><Text>Analyzing...</Text></div>
                </div>
              )}
            </div>
          </Card>

          {/* Current Analysis */}
          {currentAnalysis && (
            <Card title="📊 Latest Analysis" size="small" style={{ marginBottom: brandConfig.spacing.md }}>
              <div style={styles.statusCard}>
                <div style={{ marginBottom: brandConfig.spacing.xs }}>
                  <Badge 
                    status={currentAnalysis.horseDetected ? 'success' : 'default'} 
                    text={currentAnalysis.horseDetected ? 'Horse Detected' : 'No Horse'}
                  />
                </div>
                <div style={{ marginBottom: brandConfig.spacing.xs }}>
                  <Text strong>Confidence: </Text>
                  <Progress 
                    percent={Math.round(currentAnalysis.confidence)} 
                    size="small"
                    status={currentAnalysis.confidence > 80 ? 'success' : 'normal'}
                  />
                </div>
                <div style={{ marginBottom: brandConfig.spacing.xs }}>
                  <Text strong>Alert Level: </Text>
                  <Badge 
                    color={
                      currentAnalysis.alertLevel === 'high' ? 'red' :
                      currentAnalysis.alertLevel === 'medium' ? 'orange' : 'green'
                    }
                    text={currentAnalysis.alertLevel.toUpperCase()}
                  />
                </div>
                <div>
                  <Text strong>Observations: </Text>
                  <Text>{currentAnalysis.observations}</Text>
                </div>
              </div>
            </Card>
          )}

          {/* Analysis History */}
          <Card title="📋 Analysis History" size="small">
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {analysisHistory.length === 0 ? (
                <Text type="secondary">No analysis data yet. Start AI monitoring to see results.</Text>
              ) : (
                analysisHistory.map((analysis, index) => (
                  <div key={index} style={styles.analysisItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{new Date(analysis.timestamp).toLocaleTimeString()}</Text>
                      <Badge 
                        color={analysis.horseDetected ? 'green' : 'gray'}
                        text={analysis.horseDetected ? '🐴' : '❌'}
                      />
                    </div>
                    <Text>{analysis.observations}</Text>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 