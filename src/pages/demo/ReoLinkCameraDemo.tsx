// 🎯 ReoLink E1 Pro Camera Integration Demo
// Showcases real E1 Pro camera feeds with HLS streaming, smart AI monitoring and cost optimization

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Alert,
  Statistic,
  Tag,
  Tabs,
  Select,
  Switch,
  Divider,
  Progress,
  Timeline,
  Badge,
  message
} from 'antd';
import {
  VideoCameraOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SettingOutlined,
  DashboardOutlined,
  MonitorOutlined,
  CloudServerOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

import ReoLinkCameraFeed from '../../components/camera/ReoLinkCameraFeed';
import { 
  reoLinkE1ProCameras,
  reoLinkE1ProHelpers,
  reoLinkE1ProConnectionConfig,
  type IReoLinkE1ProCamera
} from '../../config/reoLinkConfig';
import { 
  aiMonitoringSchedules,
  monitoringTimeHelpers,
  setActiveMonitoringSchedule
} from '../../config/aiMonitoringScheduleConfig';
import { brandConfig } from '../../config/brandConfig';
import { getReoLinkConfig } from '../../config/aiConfig';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ICostMetrics {
  apiCallsSaved: number;
  monthlySavings: number;
  efficiency: number;
  uptime: number;
}

interface IEdgeComputingMetrics {
  piProcessingLoad: number;
  cloudOffloadReduction: number;
  localAnalysisCount: number;
  networkBandwidthSaved: number;
}

interface IConversionServerStatus {
  isOnline: boolean;
  lastCheck: Date;
  error?: string;
}

export const ReoLinkCameraDemo: React.FC = () => {
  // Demo state
  const [activeTab, setActiveTab] = useState('single-camera');
  const [costMetrics, setCostMetrics] = useState<ICostMetrics>({
    apiCallsSaved: 0,
    monthlySavings: 0,
    efficiency: 0,
    uptime: 0
  });
  const [edgeMetrics, setEdgeMetrics] = useState<IEdgeComputingMetrics>({
    piProcessingLoad: 0,
    cloudOffloadReduction: 0,
    localAnalysisCount: 0,
    networkBandwidthSaved: 0
  });
  const [conversionServerStatus, setConversionServerStatus] = useState<IConversionServerStatus>({
    isOnline: false,
    lastCheck: new Date()
  });
  const [demoStartTime] = useState(new Date());
  const [aiAnalysisLog, setAiAnalysisLog] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState('default_barn_monitoring');
  const [isEdgeComputingEnabled, setIsEdgeComputingEnabled] = useState(true);

  // Check conversion server status
  useEffect(() => {
    const checkServer = async () => {
      try {
        const { host, port } = reoLinkE1ProConnectionConfig.conversionServer;
        const response = await fetch(`http://${host}:${port}/status`);
        
        if (response.ok) {
          const data = await response.json();
          setConversionServerStatus({
            isOnline: data.status === 'running',
            lastCheck: new Date()
          });
        } else {
          setConversionServerStatus({
            isOnline: false,
            lastCheck: new Date(),
            error: 'Server responded but not running'
          });
        }
      } catch (error) {
        setConversionServerStatus({
          isOnline: false,
          lastCheck: new Date(),
          error: 'Connection failed'
        });
      }
    };

    // Initial check
    checkServer();
    
    // Check every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time metrics for demo
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      const runtimeMinutes = (Date.now() - demoStartTime.getTime()) / (1000 * 60);
      
      // Simulate cost savings accumulation
      setCostMetrics(prev => ({
        apiCallsSaved: Math.floor(runtimeMinutes * 2.3), // 2.3 calls saved per minute
        monthlySavings: Math.round(runtimeMinutes * 0.15 * 100) / 100, // $0.15 per minute
        efficiency: Math.min(95, 75 + (runtimeMinutes * 0.5)), // Efficiency improves over time
        uptime: Math.min(99.9, 95 + (runtimeMinutes * 0.1))
      }));

      // Simulate edge computing metrics
      setEdgeMetrics(prev => ({
        piProcessingLoad: 30 + Math.sin(Date.now() / 30000) * 20, // 10-50% load
        cloudOffloadReduction: Math.min(85, 60 + (runtimeMinutes * 0.8)),
        localAnalysisCount: Math.floor(runtimeMinutes * 1.2),
        networkBandwidthSaved: Math.round(runtimeMinutes * 2.1 * 100) / 100 // MB saved
      }));
    }, 2000);

    return () => clearInterval(metricsInterval);
  }, [demoStartTime]);

  // Handle AI analysis updates
  const handleAIAnalysis = (analysis: any) => {
    setAiAnalysisLog(prev => [
      {
        ...analysis,
        id: Date.now(),
        costSaved: '$0.23', // Simulated cost per analysis
        edgeProcessed: isEdgeComputingEnabled
      },
      ...prev.slice(0, 9)
    ]);
  };

  // Handle schedule changes
  const handleScheduleChange = (scheduleId: string) => {
    setSelectedSchedule(scheduleId);
    setActiveMonitoringSchedule(scheduleId);
  };

  // Start conversion server (placeholder - would be backend call in real app)
  const handleStartConversionServer = () => {
    message.info('To start the conversion server, run: node rtsp-conversion-server.js');
  };

  const currentSchedule = aiMonitoringSchedules.find(s => s.id === selectedSchedule);
  const currentPhase = monitoringTimeHelpers.isDayTime(currentSchedule!) ? 'day' : 'night';
  const reoLinkConfig = getReoLinkConfig();

  return (
    <div style={{ padding: brandConfig.spacing.lg }}>
      {/* Demo Header */}
      <Row gutter={[16, 16]} style={{ marginBottom: brandConfig.spacing.xl }}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Space direction="vertical" size="small">
                  <Title level={2} style={{ 
                    margin: 0, 
                    color: brandConfig.colors.stableMahogany,
                    fontFamily: brandConfig.typography.fontDisplay 
                  }}>
                    <VideoCameraOutlined /> ReoLink E1 Pro Integration Demo
                  </Title>
                  <Paragraph style={{ margin: 0, fontSize: brandConfig.typography.fontSizeLg }}>
                    Real E1 Pro camera with RTSP-to-HLS streaming, intelligent AI monitoring, and cost optimization
                  </Paragraph>
                  <Space wrap>
                    <Tag color="blue">E1 Pro Demo</Tag>
                    <Tag color="green">Cost Savings: ${costMetrics.monthlySavings}/mo</Tag>
                    <Tag color="orange">Edge Computing: {Math.round(edgeMetrics.cloudOffloadReduction)}% Local</Tag>
                    <Tag color="purple">Uptime: {costMetrics.uptime.toFixed(1)}%</Tag>
                    <Tag color={conversionServerStatus.isOnline ? 'green' : 'red'}>
                      Server: {conversionServerStatus.isOnline ? 'Online' : 'Offline'}
                    </Tag>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="API Calls Saved"
                      value={costMetrics.apiCallsSaved}
                      prefix={<ThunderboltOutlined />}
                      valueStyle={{ color: brandConfig.colors.successGreen }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Monthly Savings"
                      value={costMetrics.monthlySavings}
                      prefix={<DollarOutlined />}
                      precision={2}
                      valueStyle={{ color: brandConfig.colors.championGold }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Conversion Server Status Alert */}
      {!conversionServerStatus.isOnline && (
        <Alert
          type="warning"
          message="RTSP-to-HLS Conversion Server Required"
          description={
            <Space direction="vertical">
              <Text>
                The E1 Pro camera requires an RTSP-to-HLS conversion server for browser streaming. 
                The server converts RTSP streams to HLS format for web compatibility.
              </Text>
              <Space>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartConversionServer}
                >
                  Setup Instructions
                </Button>
                <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                  Last checked: {conversionServerStatus.lastCheck.toLocaleTimeString()}
                </Text>
              </Space>
            </Space>
          }
          showIcon
          style={{ marginBottom: brandConfig.spacing.lg }}
        />
      )}

      {/* AI Monitoring Configuration */}
      <Row gutter={[16, 16]} style={{ marginBottom: brandConfig.spacing.lg }}>
        <Col xs={24} lg={8}>
          <Card size="small" title="Smart Monitoring Schedule">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Select
                value={selectedSchedule}
                onChange={handleScheduleChange}
                style={{ width: '100%' }}
                placeholder="Select monitoring schedule"
              >
                {aiMonitoringSchedules.map(schedule => (
                  <Select.Option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </Select.Option>
                ))}
              </Select>
              {currentSchedule && (
                <div>
                  <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                    {currentSchedule.description}
                  </Text>
                  <br />
                  <Tag color={currentPhase === 'day' ? 'gold' : 'blue'}>
                    Current: {currentPhase} mode
                  </Tag>
                </div>
              )}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card size="small" title="HLS Streaming">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Conversion Server</Text>
                <Badge 
                  status={conversionServerStatus.isOnline ? 'success' : 'error'} 
                  text={conversionServerStatus.isOnline ? 'Running' : 'Stopped'}
                />
              </div>
              <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                Server: {reoLinkE1ProConnectionConfig.conversionServer.host}:{reoLinkE1ProConnectionConfig.conversionServer.port}
              </Text>
              <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                RTSP → HLS conversion enables browser streaming
              </Text>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card size="small" title="Cost Optimization">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>System Efficiency</Text>
                <Text strong style={{ color: brandConfig.colors.successGreen }}>
                  {Math.round(costMetrics.efficiency)}%
                </Text>
              </div>
              <Progress 
                percent={Math.round(costMetrics.efficiency)} 
                size="small"
                strokeColor={brandConfig.colors.pastureSage}
              />
              <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                Intelligent scheduling reduces API costs by 80%
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Main Demo Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane 
          tab={
            <span>
              <MonitorOutlined />
              E1 Pro Camera Feed
            </span>
          } 
          key="single-camera"
        >
          <ReoLinkCameraFeed
            onAIAnalysis={handleAIAnalysis}
            onConnectionStatusChange={(connected) => {
              console.log('E1 Pro camera connection status:', connected);
            }}
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <DashboardOutlined />
              Multi-Camera Dashboard
            </span>
          } 
          key="multi-camera"
        >
          <Row gutter={[16, 16]}>
            {reoLinkE1ProCameras.slice(0, 4).map((camera, index) => (
              <Col xs={24} lg={12} key={camera.id}>
                <Card
                  size="small"
                  title={
                    <Space>
                      <VideoCameraOutlined />
                      {camera.name}
                      <Tag color="blue">{camera.location}</Tag>
                    </Space>
                  }
                  extra={
                    <Badge 
                      status={camera.enabled ? "processing" : "default"} 
                      text={camera.enabled ? "Online" : "Offline"} 
                    />
                  }
                >
                  <div style={{ 
                    height: 200, 
                    backgroundColor: brandConfig.colors.midnightBlack,
                    borderRadius: brandConfig.layout.borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: brandConfig.colors.arenaSand
                  }}>
                    <Space direction="vertical" align="center">
                      <VideoCameraOutlined style={{ fontSize: 32 }} />
                      <Text style={{ color: brandConfig.colors.arenaSand }}>
                        {camera.resolution} HLS Stream
                      </Text>
                      <Text type="secondary" style={{ color: brandConfig.colors.sterlingSilver }}>
                        {camera.purpose}
                      </Text>
                      <Tag color="purple">RTSP → HLS</Tag>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CloudServerOutlined />
              Technical Architecture
            </span>
          } 
          key="tech-architecture"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="🔧 E1 Pro Technical Setup">
                <Timeline>
                  <Timeline.Item color="blue">
                    <Text strong>ReoLink E1 Pro Camera</Text>
                    <br />
                    <Text type="secondary">RTSP streaming only - no HTTP API support</Text>
                  </Timeline.Item>
                  <Timeline.Item color="orange">
                    <Text strong>RTSP-to-HLS Conversion Server</Text>
                    <br />
                    <Text type="secondary">Node.js server converts RTSP to browser-compatible HLS</Text>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <Text strong>WebSocket PTZ Control</Text>
                    <br />
                    <Text type="secondary">Real-time camera control via WebSocket</Text>
                  </Timeline.Item>
                  <Timeline.Item color="purple">
                    <Text strong>HLS.js Player</Text>
                    <br />
                    <Text type="secondary">Browser-based HLS video streaming</Text>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </Col>
            
            <Col xs={24} lg={12}>
              <Card title="⚠️ E1 Pro Limitations">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Alert
                    type="warning"
                    message="No HTTP API Support"
                    description="E1 Pro cameras do not support HTTP/HTTPS API endpoints unlike other ReoLink models"
                    showIcon
                  />
                  <Alert
                    type="info"
                    message="RTSP Streaming Only"
                    description="All video streaming must use RTSP protocol with conversion for browser compatibility"
                    showIcon
                  />
                  <Alert
                    type="info"
                    message="WebSocket PTZ Control"
                    description="Camera control requires WebSocket connection through conversion server"
                    showIcon
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <EyeOutlined />
              Analysis Log
            </span>
          } 
          key="analysis-log"
        >
          <Card title="🤖 Real-time AI Analysis Log">
            {aiAnalysisLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: brandConfig.spacing.xl }}>
                <EyeOutlined style={{ fontSize: 48, color: brandConfig.colors.sterlingSilver }} />
                <br />
                <Text type="secondary">Start E1 Pro camera monitoring to see AI analysis results</Text>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {aiAnalysisLog.map((analysis, index) => (
                  <Card 
                    key={analysis.id} 
                    size="small" 
                    style={{ 
                      backgroundColor: index === 0 ? brandConfig.colors.arenaSand : brandConfig.colors.barnWhite 
                    }}
                  >
                    <Row gutter={[16, 8]} align="middle">
                      <Col xs={24} sm={8}>
                        <Space direction="vertical" size="small">
                          <Text strong>{analysis.cameraName}</Text>
                          <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                            {new Date(analysis.timestamp).toLocaleTimeString()}
                          </Text>
                          {analysis.streamStats && (
                            <Tag color="blue">
                              HLS Level: {analysis.streamStats.level}
                            </Tag>
                          )}
                        </Space>
                      </Col>
                      <Col xs={24} sm={8}>
                        <Space wrap>
                          <Tag color={
                            analysis.alertLevel === 'high' ? 'red' : 
                            analysis.alertLevel === 'medium' ? 'orange' : 'green'
                          }>
                            {analysis.alertLevel} alert
                          </Tag>
                          <Tag color="blue">{analysis.phase} mode</Tag>
                          {analysis.edgeProcessed && <Tag color="purple">Edge processed</Tag>}
                        </Space>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div style={{ textAlign: 'right' }}>
                          <Text strong style={{ color: brandConfig.colors.successGreen }}>
                            {analysis.costSaved} saved
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: brandConfig.typography.fontSizeXs }}>
                            vs. continuous API monitoring
                          </Text>
                        </div>
                      </Col>
                      <Col span={24}>
                        <Text>{analysis.observations}</Text>
                        {analysis.recommendations.length > 0 && (
                          <div style={{ marginTop: brandConfig.spacing.sm }}>
                            <Text type="secondary">
                              💡 {analysis.recommendations[0]}
                            </Text>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Demo Footer */}
      <Row style={{ marginTop: brandConfig.spacing.xl }}>
        <Col span={24}>
          <Alert
            type="info"
            message="ReoLink E1 Pro Live Demo Environment"
            description={
              <Space direction="vertical">
                <Text>
                  This demo showcases ReoLink E1 Pro camera integration with RTSP-to-HLS streaming, 
                  intelligent AI monitoring, and cost optimization. The system connects to a real E1 Pro camera 
                  and processes live video streams through a conversion server.
                </Text>
                <Space wrap>
                  <Tag color="green">✓ Real-time HLS streaming</Tag>
                  <Tag color="blue">✓ WebSocket PTZ control</Tag>
                  <Tag color="orange">✓ RTSP conversion</Tag>
                  <Tag color="purple">✓ Smart AI monitoring</Tag>
                </Space>
              </Space>
            }
            showIcon
          />
        </Col>
      </Row>
    </div>
  );
};

export default ReoLinkCameraDemo; 