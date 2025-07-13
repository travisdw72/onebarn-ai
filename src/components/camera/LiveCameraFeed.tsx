import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Space, Alert, Typography, Row, Col, Switch, Slider } from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  CameraOutlined,
  MobileOutlined,
  LaptopOutlined,
  VideoCameraOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { brandConfig } from '../../config/brandConfig';
import { aiVisionService, IHorseAnalysisResult } from '../../services/aiVisionService';

const { Title, Text } = Typography;

interface ILiveCameraFeedProps {
  onFrameCapture?: (imageData: string) => void;
  onAIAnalysis?: (analysisData: any) => void;
}

export const LiveCameraFeed: React.FC<ILiveCameraFeedProps> = ({
  onFrameCapture,
  onAIAnalysis
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [aiMonitoring, setAiMonitoring] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(5); // seconds
  const [phoneStreamUrl, setPhoneStreamUrl] = useState('');
  const [analysisLog, setAnalysisLog] = useState<any[]>([]);

  // Start laptop camera
  const startLaptopCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Try to use back camera if available
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

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
      setAiMonitoring(false);
    }
  };

  // Capture frame for AI analysis
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

        // Perform real AI analysis
        if (aiMonitoring) {
          performAIAnalysis(imageData);
        }

        return imageData;
      }
    }
    return null;
  };

  // Real AI analysis using OpenAI Vision
  const performAIAnalysis = async (imageData: string) => {
    try {
      const analysis = await aiVisionService.analyzeHorseImage(imageData, {
        name: 'Monitored Horse',
        age: 8,
        breed: 'Mixed',
        knownConditions: ['General monitoring'],
        priority: 'medium',
        environmentalContext: {
          lightingCondition: 'artificial',
          timeOfDay: new Date().getHours() >= 6 && new Date().getHours() <= 18 ? 'day' : 'night',
          analysisContext: aiMonitoring ? 'continuous_monitoring' : 'manual_capture'
        }
      });

      // Convert to display format
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
        riskScore: analysis.riskScore
      };

      setAnalysisLog(prev => [displayAnalysis, ...prev.slice(0, 9)]); // Keep last 10 analyses

      if (onAIAnalysis) {
        onAIAnalysis(displayAnalysis);
      }

      // Show urgent alerts
      if (aiVisionService.needsImmediateAttention(analysis)) {
        alert('🚨 URGENT: AI detected concerning signs. Please check your horse immediately!');
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to mock analysis if AI fails
      const fallbackAnalysis = {
        timestamp: new Date().toISOString(),
        horseDetected: true,
        activityLevel: 50,
        posture: 'normal',
        alertLevel: 'low',
        observations: 'AI analysis unavailable - check API key',
        mobility: 'unknown',
        breathing: 'unknown',
        recommendations: ['Check OpenAI API key configuration'],
        riskScore: 0
      };
      
      setAnalysisLog(prev => [fallbackAnalysis, ...prev.slice(0, 9)]);
    }
  };

  // Auto-capture frames when AI monitoring is enabled
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (aiMonitoring && isStreaming) {
      intervalId = setInterval(() => {
        captureFrame();
      }, captureInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [aiMonitoring, isStreaming, captureInterval]);

  return (
    <div style={{ 
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand 
    }}>
      <Title level={2} style={{ color: brandConfig.colors.stableMahogany }}>
        🎥 Live Camera Monitoring
      </Title>

      <Row gutter={[16, 16]}>
        {/* Main Camera Feed */}
        <Col span={16}>
          <Card 
            title={
              <Space>
                <LaptopOutlined />
                <span>Laptop Camera Feed</span>
                {isStreaming && <span style={{ color: 'red' }}>● LIVE</span>}
              </Space>
            }
            extra={
              <Space>
                {!isStreaming ? (
                  <Button 
                    type="primary" 
                    icon={<PlayCircleOutlined />}
                    onClick={startLaptopCamera}
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
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              
              {/* Overlay controls */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: brandConfig.spacing.sm,
                borderRadius: brandConfig.layout.borderRadius
              }}>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    icon={<CameraOutlined />}
                    onClick={captureFrame}
                    disabled={!isStreaming}
                    style={{ backgroundColor: brandConfig.colors.stableMahogany }}
                  >
                    Capture
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => captureFrame()}
                    disabled={!isStreaming}
                    style={{ backgroundColor: brandConfig.colors.ribbonBlue }}
                  >
                    Analyze
                  </Button>
                </Space>
                
                {isStreaming && (
                  <Space>
                    <Text style={{ color: 'white', fontSize: '12px' }}>
                      {new Date().toLocaleTimeString()}
                    </Text>
                  </Space>
                )}
              </div>
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

        {/* Controls Panel */}
        <Col span={8}>
          <Card title="AI Monitoring Controls">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>AI Monitoring</Text>
                <br />
                <Switch
                  checked={aiMonitoring}
                  onChange={setAiMonitoring}
                  disabled={!isStreaming}
                  style={{ marginTop: brandConfig.spacing.xs }}
                />
                <Text style={{ marginLeft: brandConfig.spacing.sm }}>
                  {aiMonitoring ? 'Enabled' : 'Disabled'}
                </Text>
              </div>

              <div>
                <Text strong>Capture Interval: {captureInterval}s</Text>
                <Slider
                  min={1}
                  max={30}
                  value={captureInterval}
                  onChange={setCaptureInterval}
                  disabled={!aiMonitoring}
                  style={{ marginTop: brandConfig.spacing.xs }}
                />
              </div>

              <div>
                <Text strong>Phone Camera Stream</Text>
                <br />
                <Text style={{ fontSize: '12px', color: brandConfig.colors.midnightBlack }}>
                  Use IP Camera apps on your phone to stream to this URL
                </Text>
                <input
                  type="text"
                  placeholder="http://192.168.1.100:8080/video"
                  value={phoneStreamUrl}
                  onChange={(e) => setPhoneStreamUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: brandConfig.spacing.xs,
                    marginTop: brandConfig.spacing.xs,
                    borderRadius: brandConfig.layout.borderRadius,
                    border: '1px solid #d9d9d9'
                  }}
                />
                <Button
                  size="small"
                  style={{ marginTop: brandConfig.spacing.xs }}
                  disabled={!phoneStreamUrl}
                >
                  Connect Phone
                </Button>
              </div>
            </Space>
          </Card>

          {/* Analysis Results */}
          {analysisLog.length > 0 && (
            <Card 
              title="Recent Analysis Results"
              style={{ marginTop: brandConfig.spacing.md }}
            >
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {analysisLog.map((analysis, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: brandConfig.spacing.sm,
                      marginBottom: brandConfig.spacing.xs,
                      backgroundColor: index === 0 ? brandConfig.colors.pastureSage + '20' : brandConfig.colors.arenaSand,
                      borderRadius: brandConfig.layout.borderRadius,
                      border: `1px solid ${brandConfig.colors.pastureSage}`
                    }}
                  >
                    <Text strong style={{ fontSize: '12px' }}>
                      {new Date(analysis.timestamp).toLocaleTimeString()}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '11px' }}>
                      Risk: {(analysis.riskScore * 100).toFixed(0)}% | 
                      Activity: {analysis.activityLevel.toFixed(0)}% | 
                      Alert: {analysis.alertLevel}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px', color: brandConfig.colors.midnightBlack }}>
                      {analysis.observations.substring(0, 50)}...
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Mobile Camera Setup Instructions */}
      <Card 
        title="📱 Mobile Camera Setup"
        style={{ marginTop: brandConfig.spacing.lg }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title="Step 1: Download App">
              <Text>
                Download an IP Camera app:
                <br />• <strong>Android:</strong> IP Webcam
                <br />• <strong>iOS:</strong> EpocCam or AtomCam
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Step 2: Start Streaming">
              <Text>
                Start the camera stream on your phone and note the IP address shown (e.g., 192.168.1.100:8080)
              </Text>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="Step 3: Connect">
              <Text>
                Enter the phone's stream URL in the controls panel and click Connect Phone
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Performance Tips */}
      <Card 
        title="🚀 Performance Tips"
        style={{ marginTop: brandConfig.spacing.lg }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <ul>
              <li>Use Chrome or Firefox for best camera support</li>
              <li>Ensure you're on HTTPS or localhost for camera access</li>
              <li>Close other applications using the camera</li>
              <li>Use good lighting for better AI analysis</li>
            </ul>
          </Col>
          <Col span={12}>
            <ul>
              <li>Adjust capture interval based on your needs</li>
              <li>Lower intervals = more frequent analysis = higher costs</li>
              <li>Monitor API usage to avoid unexpected charges</li>
              <li>Position camera for clear view of horse</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
}; 