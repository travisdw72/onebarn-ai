/**
 * 🌙 Overnight AI Optimization Test Runner
 * Simplified UI component for starting and monitoring overnight AI optimization tests
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Progress,
  Badge,
  Alert,
  Tabs,
  Input,
  Checkbox,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  List,
  Slider,
  Switch,
  Divider,
  Select,
  Form,
  Tag
} from 'antd';
import {
  PlayCircleOutlined, StopOutlined, DownloadOutlined,
  VideoCameraOutlined, PictureOutlined, RobotOutlined,
  BarChartOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { AIVisionService } from '../../services/aiVisionService';
import { AIOptimizationService } from '../../services/aiOptimizationService';
import { OvernightAITestingService, IOvernightTestConfig } from '../../services/overnightAITestingService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface TestStats {
  sessionId: string;
  sessionName: string;
  startTime: Date;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  processedImages: number;
  skippedImages: number;
  totalTokensSaved: number;
  totalCostSaved: number;
  currentSavingsRate: number;
  averageProcessingTime: number;
  skipReasons: Record<string, number>;
  runtime: string;
}

interface IDataSourceConfig {
  dataSource: 'mock' | 'frames' | 'videos' | 'mixed';
  enableRealAI: boolean;
  testCategories: string[];
  enableFrameExtraction: boolean;
  maxImages: number;
  testDurationHours: number;
  testMode?: 'standard' | 'debug' | 'bypass_quality' | 'bypass_all';
}

export const OvernightTestRunner: React.FC = () => {
  const [testStats, setTestStats] = useState<TestStats>({
    sessionId: '',
    sessionName: 'Overnight AI Optimization Test',
    startTime: new Date(),
    status: 'idle',
    processedImages: 0,
    skippedImages: 0,
    totalTokensSaved: 0,
    totalCostSaved: 0,
    currentSavingsRate: 0,
    averageProcessingTime: 0,
    skipReasons: {},
    runtime: '00:00:00'
  });

  const [testConfig, setTestConfig] = useState({
    sessionName: 'Overnight AI Optimization Test',
    maxImages: 5555, // Handle thousands of images
    testDurationHours: 12, // Longer duration for comprehensive testing
    enableRealAI: true,
    logInterval: 25, // Less frequent logging for large datasets
    rateLimit: 1000 // Faster processing for large datasets
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const aiVisionService = AIVisionService.getInstance();
  const optimizationService = AIOptimizationService.getInstance();

  const [config, setConfig] = useState<IDataSourceConfig>({
    dataSource: 'frames',
    enableRealAI: false,
    testCategories: ['baseline', 'optimized'],
    enableFrameExtraction: false,
    maxImages: 1000, // Increase default to handle thousands of images
    testDurationHours: 8, // Increase default duration for comprehensive testing
    testMode: 'standard'
  });

  const [availableImages, setAvailableImages] = useState<{
    baseline: number;
    optimized: number;
    skipped: number;
    total: number;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const dataSourceOptions = [
    { value: 'frames', label: '📸 Pre-extracted Frames', description: 'Use 12,699 frames from Python testing (baseline, optimized, skipped)' },
    { value: 'videos', label: '🎥 Video Files', description: 'Use 19 horse videos (emergency, lameness, foaling, behavior)' },
    { value: 'mixed', label: '🔄 Mixed Sources', description: 'Combine frames + videos for comprehensive testing' },
    { value: 'mock', label: '🎭 Mock Data', description: 'Use simulated data (fallback option)' }
  ];

  const getCategoryOptions = () => {
    const baseFrameOptions = [
      { value: 'baseline', label: '📊 Baseline Frames', count: availableImages?.baseline?.toString() || 'Scan to detect' },
      { value: 'optimized', label: '✅ Optimized Frames', count: availableImages?.optimized?.toString() || 'Scan to detect' },
      { value: 'skipped', label: '⏭️ Skipped Frames', count: availableImages?.skipped?.toString() || 'Scan to detect' }
    ];
    
    return {
      frames: baseFrameOptions,
      videos: [
        { value: 'emergency_scenarios', label: '🚨 Emergency Scenarios', count: '4 videos' },
        { value: 'motion_testing', label: '🏇 Motion Analysis', count: '2 videos' },
        { value: 'occupancy_testing', label: '👥 Occupancy Testing', count: '2 videos' },
        { value: 'quality_testing', label: '🔍 Quality Testing', count: '1 video' },
        { value: 'general_behavior', label: '🐎 General Behavior', count: '3 videos' }
      ],
      mixed: [
        { value: 'baseline', label: '📊 Baseline Frames', count: availableImages?.baseline?.toString() || 'Unknown' },
        { value: 'optimized', label: '✅ Optimized Frames', count: availableImages?.optimized?.toString() || 'Unknown' },
        { value: 'emergency_scenarios', label: '🚨 Emergency Videos', count: '4 videos' },
        { value: 'motion_testing', label: '🏇 Motion Videos', count: '2 videos' }
      ],
      mock: [
        { value: 'horse_standing', label: '🐎 Horse Standing', count: 'Generated' },
        { value: 'horse_moving', label: '🏃 Horse Moving', count: 'Generated' },
        { value: 'empty_stall', label: '🏠 Empty Stall', count: 'Generated' }
      ]
    };
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-49), logEntry]);
  };

  const generateMockImageData = (): string => {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  };

  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const clearLoadedImages = () => {
    setAvailableImages(null);
    addLog('🗑️ Cleared scan results');
  };

  const scanAvailableImages = async () => {
    setIsScanning(true);
    addLog('🔍 Scanning for available images in public/images/frames/...');
    
    try {
      const testingService = OvernightAITestingService.getInstance();
      const counts = await testingService.scanAvailableImages();
      setAvailableImages(counts);
      addLog(`✅ Scan complete: Found ${counts.total} images (baseline: ${counts.baseline}, optimized: ${counts.optimized}, skipped: ${counts.skipped})`);
    } catch (error) {
      addLog(`❌ Failed to scan images: ${error}`);
    } finally {
      setIsScanning(false);
    }
  };

  const startOvernightTest = async () => {
    try {
      setIsTestRunning(true);
      addLog(`🚀 Starting overnight test with REAL DATA: ${testConfig.sessionName}`);
      addLog(`📊 Data Source: ${config.dataSource} (Categories: ${config.testCategories.join(', ')})`);
      addLog(`📊 Configuration: ${config.maxImages} images, ${config.testDurationHours} hours`);
      addLog(`🤖 Real AI Analysis: ${config.enableRealAI ? 'ENABLED ⚠️' : 'SIMULATION 💰'}`);

      // 🎯 NEW: Use enhanced overnight testing service
      const testingService = OvernightAITestingService.getInstance();
      
      const enhancedConfig: IOvernightTestConfig = {
        sessionName: testConfig.sessionName,
        maxImages: config.maxImages,
        testDurationHours: config.testDurationHours,
        enableRealAI: config.enableRealAI,
        saveInterval: 10,
        logInterval: 5,
        rateLimit: 2000,
        
        // 🎯 NEW: Real data source configuration
        dataSource: config.dataSource,
        testCategories: config.testCategories,
        enableFrameExtraction: config.enableFrameExtraction,
        framesPath: '../../../python_development/token_optimization_testing/frames',
        videoPath: '../../../python_development/downloads',
        
        // 🎯 NEW: Image saving configuration
        saveProcessedImages: true,
        imageSaveDirectory: './overnight_test_results',
        saveImageCategories: {
          wouldSendToAI: true,
          skippedLowQuality: true,
          skippedNoOccupancy: true,
          skippedNoMotion: true,
          skippedDuplicate: true,
          skippedOther: true
        }
      };

      let sessionId: string;
      if (config.testMode && config.testMode !== 'standard') {
        addLog(`🎯 Using test mode: ${config.testMode}`);
        sessionId = await testingService.startTestingWithOverrides({
          ...enhancedConfig,
          testMode: config.testMode
        });
      } else {
        sessionId = await testingService.startOvernightTest(enhancedConfig);
      }
      
      setTestStats(prev => ({
        ...prev,
        sessionId,
        sessionName: testConfig.sessionName,
        startTime: new Date(),
        status: 'running'
      }));

      addLog(`✅ Overnight test initialized with session ID: ${sessionId}`);
      addLog(`🎯 Using real data from your collection!`);
      
      intervalRef.current = setInterval(() => {
        const currentTest = testingService.getCurrentTest();
        if (currentTest) {
          updateRealTestStats(currentTest);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to start overnight test:', error);
      addLog(`❌ Failed to start test: ${error}`);
      setTestStats(prev => ({ ...prev, status: 'failed' }));
      setIsTestRunning(false);
    }
  };

  // 🎯 NEW: Update stats from real testing service
  const updateRealTestStats = (testResult: any) => {
    const startTime = new Date(testResult.startTime).getTime();
    const currentTime = Date.now();
    const runtime = Math.floor((currentTime - startTime) / 1000);
    
    const hours = Math.floor(runtime / 3600);
    const minutes = Math.floor((runtime % 3600) / 60);
    const seconds = runtime % 60;
    const runtimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    setTestStats(prev => ({
      ...prev,
      processedImages: testResult.processedImages,
      skippedImages: testResult.skippedImages,
      totalTokensSaved: testResult.tokensSaved,
      totalCostSaved: testResult.costSavingsUSD,
      currentSavingsRate: testResult.baselineTokensEstimate > 0 
        ? (testResult.tokensSaved / testResult.baselineTokensEstimate) * 100 
        : 0,
      averageProcessingTime: testResult.averageOptimizationTime,
      skipReasons: testResult.skipReasons,
      runtime: runtimeString,
      status: testResult.status
    }));

    // Update logs with key insights
    if (testResult.processedImages > 0 && testResult.processedImages % 10 === 0) {
      addLog(`📊 Progress: ${testResult.processedImages} processed, ${testResult.tokensSaved.toLocaleString()} tokens saved ($${testResult.costSavingsUSD.toFixed(2)})`);
    }
  };

  const runTestingLoop = async (sessionId: string) => {
    const startTime = Date.now();
    const endTime = startTime + (testConfig.testDurationHours * 60 * 60 * 1000);
    let imageIndex = 0;
    
    const baselineTokensPerImage = 2800;
    let totalBaselineTokens = 0;
    let totalActualTokens = 0;
    let totalSkippedTokens = 0;
    let processingTimes: number[] = [];
    let skipReasons: Record<string, number> = {};

    while (isTestRunning && Date.now() < endTime && imageIndex < testConfig.maxImages) {
      try {
        const imageStartTime = Date.now();
        
        const testImage = {
          name: `test_image_${imageIndex}.jpg`,
          data: generateMockImageData(),
          category: ['horse_standing', 'horse_moving', 'empty_stall', 'equipment_only'][imageIndex % 4]
        };

        const analysisContext = {
          source: 'manual' as const,
          priority: 'medium' as const,
          sessionId,
          expectedContent: 'horse' as const
        };

        const optimizationResult = await optimizationService.preProcessRequest(
          testImage.data,
          analysisContext
        );

        const processingTime = Date.now() - imageStartTime;
        processingTimes.push(processingTime);
        totalBaselineTokens += baselineTokensPerImage;

        if (optimizationResult.shouldProceed) {
          if (testConfig.enableRealAI) {
            try {
              const aiResult = await aiVisionService.analyzeHorseImage(testImage.data, {
                name: testImage.name,
                priority: 'medium'
              });
              
              const tokensUsed = Math.ceil(JSON.stringify(aiResult).length / 4) + 1700;
              totalActualTokens += tokensUsed;
              addLog(`✅ Processed ${testImage.name}: ${tokensUsed} tokens used`);
            } catch (aiError) {
              addLog(`⚠️ AI analysis failed for ${testImage.name}, counting as skipped`);
              totalSkippedTokens += baselineTokensPerImage;
            }
          } else {
            const simulatedTokens = Math.floor(baselineTokensPerImage * 0.8);
            totalActualTokens += simulatedTokens;
            addLog(`🧪 Simulated processing ${testImage.name}: ${simulatedTokens} tokens`);
          }
        } else {
          totalSkippedTokens += baselineTokensPerImage;
          const skipReason = optimizationResult.decisions.skipReason || 'unknown';
          skipReasons[skipReason] = (skipReasons[skipReason] || 0) + 1;
          addLog(`⏭️ Skipped ${testImage.name}: ${skipReason}`);
          
          setTestStats(prev => ({
            ...prev,
            skippedImages: prev.skippedImages + 1
          }));
        }

        const totalTokensSaved = totalBaselineTokens - totalActualTokens - totalSkippedTokens + totalSkippedTokens;
        const currentSavingsRate = totalBaselineTokens > 0 ? (totalTokensSaved / totalBaselineTokens) * 100 : 0;
        const totalCostSaved = totalTokensSaved * 0.0025 / 1000;
        const averageProcessingTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;

        setTestStats(prev => ({
          ...prev,
          processedImages: imageIndex + 1,
          totalTokensSaved: Math.round(totalTokensSaved),
          totalCostSaved: parseFloat(totalCostSaved.toFixed(4)),
          currentSavingsRate: parseFloat(currentSavingsRate.toFixed(1)),
          averageProcessingTime: parseFloat(averageProcessingTime.toFixed(0)),
          skipReasons
        }));

        imageIndex++;

        if (imageIndex % testConfig.logInterval === 0) {
          addLog(`📊 Progress: ${imageIndex}/${testConfig.maxImages} images, ${currentSavingsRate.toFixed(1)}% savings, $${totalCostSaved.toFixed(2)} saved`);
        }

        await sleep(testConfig.rateLimit);

      } catch (error) {
        addLog(`❌ Error processing image ${imageIndex}: ${error}`);
      }
    }

    setTestStats(prev => ({ ...prev, status: 'completed' }));
    setIsTestRunning(false);
    addLog(`🎉 Test completed! Processed ${imageIndex} images`);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const updateUI = () => {
    if (testStats.status === 'running') {
      const runtime = Date.now() - testStats.startTime.getTime();
      const hours = Math.floor(runtime / 3600000);
      const minutes = Math.floor((runtime % 3600000) / 60000);
      const seconds = Math.floor((runtime % 60000) / 1000);
      
      setTestStats(prev => ({
        ...prev,
        runtime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }));
    }
  };

  const stopTest = () => {
    setIsTestRunning(false);
    setTestStats(prev => ({ ...prev, status: 'completed' }));
    addLog('🛑 Test stopped by user');
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getProgressPercentage = (): number => {
    if (testConfig.maxImages === 0) return 0;
    return (testStats.processedImages / testConfig.maxImages) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'processing';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const downloadResults = () => {
    const data = JSON.stringify(testStats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overnight_test_${testStats.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🌙 Overnight AI Optimization Test Runner</Title>
      
      {/* 🎯 NEW: Real Data Source Alert */}
      <Alert
        message="🎯 Ready for Real Data Testing!"
        description={
          <div>
            <p><strong>Your collection includes:</strong></p>
            <ul>
              <li><Tag color="green">📊 12,699 pre-extracted frames</Tag> from Python testing (7,275 baseline + 4,756 optimized + 668 skipped)</li>
              <li><Tag color="blue">🎥 19 horse videos</Tag> including emergency scenarios, lameness detection, foaling, and behavior analysis</li>
              <li><Tag color="purple">📋 Organized test categories</Tag> for comprehensive optimization testing</li>
            </ul>
            <p>The system will automatically use your real data for authentic token optimization testing!</p>
          </div>
        }
        type="success"
        showIcon
        style={{ marginBottom: '24px' }}
      />
      
      {/* Configuration Card */}
      <Card 
        title="Test Configuration"
        extra={<Badge status={getStatusColor(testStats.status)} text={testStats.status.toUpperCase()} />}
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Text strong>Session Name:</Text>
            <Input
              value={testConfig.sessionName}
              onChange={(e) => setTestConfig(prev => ({ ...prev, sessionName: e.target.value }))}
              disabled={isTestRunning}
              style={{ marginTop: '4px' }}
            />
          </Col>
          <Col span={8}>
            <Text strong>Max Images:</Text>
            <Input
              type="number"
              value={testConfig.maxImages}
              onChange={(e) => setTestConfig(prev => ({ ...prev, maxImages: parseInt(e.target.value) }))}
              disabled={isTestRunning}
              style={{ marginTop: '4px' }}
              placeholder={availableImages ? `Max ${availableImages.total.toLocaleString()}` : "5000"}
              addonAfter={availableImages ? `/ ${availableImages.total.toLocaleString()}` : "total"}
            />
          </Col>
          <Col span={8}>
            <Text strong>Duration (hours):</Text>
            <Input
              type="number"
              value={testConfig.testDurationHours}
              onChange={(e) => setTestConfig(prev => ({ ...prev, testDurationHours: parseInt(e.target.value) }))}
              disabled={isTestRunning}
              style={{ marginTop: '4px' }}
            />
          </Col>
        </Row>

        <Checkbox
          checked={testConfig.enableRealAI}
          onChange={(e) => setTestConfig(prev => ({ ...prev, enableRealAI: e.target.checked }))}
          disabled={isTestRunning}
          style={{ marginBottom: '16px' }}
        >
          Enable Real AI Analysis (uses actual API calls)
        </Checkbox>

        <Space>
          <Button 
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={startOvernightTest} 
            disabled={isTestRunning}
          >
            Start Overnight Test
          </Button>
          {isTestRunning && (
            <Button 
              danger
              icon={<StopOutlined />}
              onClick={stopTest}
            >
              Stop Test
            </Button>
          )}
        </Space>
      </Card>

      {/* 🎯 NEW: Real Images from Public Folder */}
      <Card 
        title="📁 Real Images from Public Folder" 
        style={{ marginBottom: '24px' }}
      >
        <Alert
          message="Your Real Images Ready for Testing!"
          description="Move your 12,699 frames to public/images/frames/ and they'll be automatically detected and used for testing. No file uploads needed!"
          type="success"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space>
              <Button
                type="primary"
                icon={<PictureOutlined />}
                onClick={scanAvailableImages}
                disabled={isTestRunning || isScanning}
                loading={isScanning}
              >
                {isScanning ? 'Scanning...' : 'Scan Available Images'}
              </Button>
              
              {availableImages && (
                <Button 
                  size="small" 
                  onClick={clearLoadedImages}
                  disabled={isTestRunning}
                >
                  Clear Scan
                </Button>
              )}
            </Space>
            
            {availableImages && (
              <div style={{ marginTop: '16px' }}>
                <Title level={5}>📊 Detected Images:</Title>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="Baseline Frames"
                      value={availableImages.baseline}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Optimized Frames"
                      value={availableImages.optimized}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Skipped Frames"
                      value={availableImages.skipped}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Total Images"
                      value={availableImages.total}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Col>
                </Row>
                
                <Alert
                  message={`🚀 Ready to test with ${availableImages.total.toLocaleString()} real images!`}
                  description={
                    availableImages.total > 1000 
                      ? `Excellent! You have ${availableImages.total.toLocaleString()} real frames from your Python testing. This will provide highly authentic optimization results. Consider enabling 'Real AI Analysis' for a subset to manage costs.`
                      : `Perfect! Your Python testing frames are detected. The system will use these real images instead of mock data.`
                  }
                  type="success"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              </div>
            )}
            
            {!availableImages && !isScanning && (
              <Alert
                message="Images not scanned yet"
                description="Click 'Scan Available Images' to detect your real frames in public/images/frames/"
                type="info"
                style={{ marginTop: '16px' }}
              />
            )}
          </div>
        </Space>
      </Card>

      {/* 🎯 NEW: Test Mode Configuration */}
      <Card 
        title="🎯 Advanced Test Modes" 
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Test Mode:</Text>
            <Select
              value={config.testMode}
              onChange={(value) => setConfig(prev => ({ ...prev, testMode: value }))}
              disabled={isTestRunning}
              style={{ width: '100%', marginTop: '4px' }}
            >
              <Select.Option value="standard">🎯 Standard Testing</Select.Option>
              <Select.Option value="debug">🐛 Debug Mode (Limited Images)</Select.Option>
              <Select.Option value="bypass_quality">⚠️ Bypass Quality Checks</Select.Option>
              <Select.Option value="bypass_all">🚨 Bypass All Optimization</Select.Option>
            </Select>
          </Col>
          <Col span={12}>
            <Text strong>Data Source:</Text>
            <Select
              value={config.dataSource}
              onChange={(value) => setConfig(prev => ({ ...prev, dataSource: value }))}
              disabled={isTestRunning}
              style={{ width: '100%', marginTop: '4px' }}
            >
              {dataSourceOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Divider />

        <div>
          <Text strong>Test Categories:</Text>
          <div style={{ marginTop: '8px' }}>
            {getCategoryOptions()[config.dataSource]?.map((category: any) => (
              <Tag
                key={category.value}
                color={config.testCategories.includes(category.value) ? 'blue' : 'default'}
                style={{ cursor: 'pointer', marginBottom: '8px' }}
                onClick={() => {
                  if (isTestRunning) return;
                  setConfig(prev => ({
                    ...prev,
                    testCategories: prev.testCategories.includes(category.value)
                      ? prev.testCategories.filter(c => c !== category.value)
                      : [...prev.testCategories, category.value]
                  }));
                }}
              >
                {category.label} ({category.count})
              </Tag>
            )) || <Text type="secondary">Select a data source to see categories</Text>}
          </div>
        </div>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Checkbox
              checked={config.enableRealAI}
              onChange={(e) => setConfig(prev => ({ ...prev, enableRealAI: e.target.checked }))}
              disabled={isTestRunning}
            >
              🤖 Real AI Analysis 
              {availableImages && config.enableRealAI && (
                <Text type="warning">
                  (Est. cost: ${((Math.min(config.maxImages, availableImages.total) * 0.007)).toFixed(2)})
                </Text>
              )}
            </Checkbox>
            {config.enableRealAI && availableImages && (
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                💰 ~$0.007 per image × {Math.min(config.maxImages, availableImages.total).toLocaleString()} images = ${((Math.min(config.maxImages, availableImages.total) * 0.007)).toFixed(2)} max cost
                <br />
                📊 Optimization will likely skip 70-90% of images, reducing actual cost significantly
              </div>
            )}
          </Col>
          <Col span={12}>
            <Checkbox
              checked={config.enableFrameExtraction}
              onChange={(e) => setConfig(prev => ({ ...prev, enableFrameExtraction: e.target.checked }))}
              disabled={isTestRunning}
            >
              🎬 Extract Frames from Videos
            </Checkbox>
          </Col>
        </Row>

        {config.testMode === 'debug' && (
          <Alert
            message="Debug Mode Active"
            description="Limited to 20 images with enhanced logging for troubleshooting."
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}

        {config.testMode === 'bypass_quality' && (
          <Alert
            message="Quality Bypass Mode"
            description="Quality optimization checks will be disabled to test AI integration directly."
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}

        {config.testMode === 'bypass_all' && (
          <Alert
            message="Full Bypass Mode"
            description="ALL optimization filters disabled. Every image will be sent to AI analysis."
            type="error"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}
      </Card>

      {/* Progress Card */}
      {testStats.status !== 'idle' && (
        <Card title="Test Progress" style={{ marginBottom: '24px' }}>
          <Progress
            percent={getProgressPercentage()}
            format={() => `${testStats.processedImages}/${testConfig.maxImages}`}
            style={{ marginBottom: '24px' }}
          />

          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Tokens Saved"
                value={testStats.totalTokensSaved}
                precision={0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Cost Saved"
                value={testStats.totalCostSaved}
                precision={2}
                prefix="$"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Savings Rate"
                value={testStats.currentSavingsRate}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Runtime"
                value={testStats.runtime}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: '16px' }}>
            <Col span={12}>
              <Text>Skipped Images: {testStats.skippedImages}</Text>
            </Col>
            <Col span={12}>
              <Text>Avg Processing: {testStats.averageProcessingTime}ms</Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Results Tabs */}
      {testStats.status !== 'idle' && (
        <Card>
          <Tabs defaultActiveKey="logs">
            <TabPane tab="📋 Live Logs" key="logs">
              <div style={{ 
                height: '300px', 
                overflowY: 'auto', 
                backgroundColor: '#f5f5f5',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}>
                {logs.map((log, index) => (
                  <div key={index} style={{ marginBottom: '4px' }}>
                    {log}
                  </div>
                ))}
              </div>
            </TabPane>
            
            <TabPane tab="📊 Skip Analysis" key="stats">
              <Title level={4}>Skip Reasons:</Title>
              <List
                dataSource={Object.entries(testStats.skipReasons)}
                renderItem={([reason, count]) => (
                  <List.Item>
                    <Text>{reason}</Text>
                    <Badge count={count} />
                  </List.Item>
                )}
              />
              {Object.keys(testStats.skipReasons).length === 0 && (
                <Text type="secondary">No skips recorded yet</Text>
              )}
            </TabPane>
            
            <TabPane tab="💾 Export" key="export">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={downloadResults}
                  block
                >
                  Download Results JSON
                </Button>
                
                <Alert
                  message="Results are automatically saved to localStorage and can be exported as JSON for further analysis."
                  type="info"
                />
              </Space>
            </TabPane>
          </Tabs>
        </Card>
      )}

      {/* Instructions */}
      <Alert
        message="🌙 Overnight Testing Instructions"
        description={
          <div>
            <p>1. Configure your test parameters above (defaults optimized for thousands of images)</p>
            <p>2. Enable/disable real AI analysis - see cost estimate above</p>
            <p>3. Click "Start Overnight Test" and let it run for hours to process thousands of images</p>
            <p>4. Results will be continuously saved and can be exported</p>
            <br />
            <p><strong>💡 For Large Datasets:</strong> Start with Real AI disabled for free optimization testing, then enable for a subset (e.g., 100-500 images) to manage costs while getting authentic results.</p>
            <p><strong>⚡ Performance:</strong> The system processes ~1 image per second, so 1,000 images = ~17 minutes, 5,000 images = ~1.5 hours.</p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default OvernightTestRunner; 