/**
 * 🤖 Scheduled AI Monitor - Automated Photo Capture & Analysis
 * 
 * SCHEDULE:
 * - 7 PM to 7 AM: 3 photos every 5 minutes
 * - 7 AM to 7 PM: 3 photos every 20 minutes
 * 
 * Features:
 * - Automatic photo capture on schedule
 * - Real-time AI analysis  
 * - Comprehensive console logging
 * - Storage management
 * - Report generation
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Progress, 
  Space, 
  Alert, 
  Switch,
  Statistic,
  Badge,
  Divider
} from 'antd';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  CameraOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { brandConfig } from '../../config/brandConfig';
import { aiVisionService } from '../../services/aiVisionService';

const { Title, Text } = Typography;

interface IScheduledAIMonitorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreamActive: boolean;
  onAnalysisComplete?: (analysis: any) => void;
}

interface IScheduleConfig {
  isNightMode: boolean;
  photosPerCapture: number;
  intervalMinutes: number;
  nextCaptureTime: Date | null;
  currentPhase: 'day' | 'night';
  // 🎯 NEW: Track photo sequence timing
  photoSequence: number[]; // [0, 7, 14] minutes
  currentPhotoIndex: number; // 0, 1, or 2
  cycleStartTime: Date | null;
}

interface IAnalysisResult {
  timestamp: string;
  phase: 'day' | 'night';
  photoIndex: number;
  totalPhotos: number;
  horseDetected: boolean;
  confidence: number;
  observations: string[];
  alertLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface ISystemStats {
  totalCaptures: number;
  successfulAnalyses: number;
  alertsGenerated: number;
  uptime: string;
  storageUsed: string;
  lastCapture: string | null;
}

export const ScheduledAIMonitor: React.FC<IScheduledAIMonitorProps> = ({
  videoRef,
  isStreamActive,
  onAnalysisComplete
}) => {
  console.log('🔍 [ScheduledAIMonitor] COMPONENT RENDERED');
  console.log('🔍 [ScheduledAIMonitor] videoRef:', videoRef);
  console.log('🔍 [ScheduledAIMonitor] isStreamActive:', isStreamActive);
  console.log('🔍 [ScheduledAIMonitor] onAnalysisComplete:', onAnalysisComplete);
  
  // State management
  const [isActive, setIsActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<IScheduleConfig>({
    isNightMode: false,
    photosPerCapture: 3,
    intervalMinutes: 20,
    nextCaptureTime: null,
    currentPhase: 'day',
    // 🎯 NEW: Photo sequence timing
    photoSequence: [0, 7, 14], // Night: 0, 1.5, 3.5 min | Day: 0, 7, 14 min
    currentPhotoIndex: 0,
    cycleStartTime: null
  });
  const [systemStats, setSystemStats] = useState<ISystemStats>({
    totalCaptures: 0,
    successfulAnalyses: 0,
    alertsGenerated: 0,
    uptime: '00:00:00',
    storageUsed: '0 KB',
    lastCapture: null
  });
  const [recentAnalyses, setRecentAnalyses] = useState<IAnalysisResult[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  // Refs for intervals
  const scheduleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const uptimeStartRef = useRef<Date | null>(null);
  const uptimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate current schedule based on time
  const calculateCurrentSchedule = (): IScheduleConfig => {
    const now = new Date();
    const hour = now.getHours();
    
    // Night mode: 7 PM (19:00) to 7 AM (07:00)
    const isNightMode = hour >= 19 || hour < 7;
    
    console.log(`🕐 [ScheduledAIMonitor] Time check: ${hour}:00 - ${isNightMode ? 'NIGHT' : 'DAY'} mode`);
    
    const config: IScheduleConfig = {
      isNightMode,
      photosPerCapture: 3,
      intervalMinutes: isNightMode ? 5 : 20, // 5 min at night, 20 min during day
      nextCaptureTime: null,
      currentPhase: isNightMode ? 'night' : 'day',
      // 🎯 NEW: Photo sequence timing
      photoSequence: isNightMode ? [0, 1.5, 3.5] : [0, 7, 14], // Night: 0, 1.5, 3.5 min | Day: 0, 7, 14 min
      currentPhotoIndex: 0,
      cycleStartTime: null
    };
    
    console.log(`📅 [ScheduledAIMonitor] Schedule: ${config.photosPerCapture} photos over ${config.intervalMinutes} minutes`);
    console.log(`📅 [ScheduledAIMonitor] Photo timing: ${config.photoSequence.join(', ')} minutes`);
    
    return config;
  };

  // 🎯 NEW: Calculate next photo capture time
  const calculateNextPhotoTime = (schedule: IScheduleConfig): Date | null => {
    if (!schedule.cycleStartTime) return null;
    
    const nextPhotoMinutes = schedule.photoSequence[schedule.currentPhotoIndex];
    const nextPhotoTime = new Date(schedule.cycleStartTime.getTime() + (nextPhotoMinutes * 60 * 1000));
    
    console.log(`⏰ [ScheduledAIMonitor] Next photo ${schedule.currentPhotoIndex + 1}/3 in ${nextPhotoMinutes} minutes: ${nextPhotoTime.toLocaleTimeString()}`);
    
    return nextPhotoTime;
  };

  // Start monitoring system
  const startMonitoring = () => {
    console.log('🚀 [ScheduledAIMonitor] Starting automated monitoring system...');
    
    if (!isStreamActive) {
      console.error('❌ [ScheduledAIMonitor] Cannot start - camera stream not active');
      return;
    }

    setIsActive(true);
    uptimeStartRef.current = new Date();
    
    // Update schedule immediately and start cycle
    const schedule = calculateCurrentSchedule();
    const cycleStartTime = new Date();
    schedule.cycleStartTime = cycleStartTime;
    schedule.currentPhotoIndex = 0;
    schedule.nextCaptureTime = calculateNextPhotoTime(schedule);
    
    setCurrentSchedule(schedule);
    
    // Start schedule checker (runs every 10 seconds for more responsive timing)
    scheduleIntervalRef.current = setInterval(() => {
      const now = new Date();
      
      // Check if it's time for the next photo
      if (currentSchedule.nextCaptureTime && now >= currentSchedule.nextCaptureTime) {
        console.log(`📸 [ScheduledAIMonitor] Photo ${currentSchedule.currentPhotoIndex + 1}/3 capture time reached!`);
        performSinglePhotoCapture();
      }
    }, 10000); // Check every 10 seconds
    
    // Start countdown timer
    startCountdownTimer();
    
    // Start uptime tracking
    uptimeIntervalRef.current = setInterval(updateUptime, 1000);
    
    // 🎯 IMMEDIATE FIRST PHOTO (0 minutes)
    console.log('📸 [ScheduledAIMonitor] Performing immediate first photo...');
    setTimeout(() => {
      if (isActive) {
        performSinglePhotoCapture();
      }
    }, 2000); // Small delay to ensure everything is set up
    
    console.log('✅ [ScheduledAIMonitor] Monitoring system started successfully');
  };

  // Stop monitoring system
  const stopMonitoring = () => {
    console.log('🛑 [ScheduledAIMonitor] Stopping monitoring system...');
    
    setIsActive(false);
    setIsCapturing(false);
    
    // Clear all intervals
    if (scheduleIntervalRef.current) {
      clearInterval(scheduleIntervalRef.current);
      scheduleIntervalRef.current = null;
    }
    
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    
    if (uptimeIntervalRef.current) {
      clearInterval(uptimeIntervalRef.current);
      uptimeIntervalRef.current = null;
    }
    
    uptimeStartRef.current = null;
    setCountdown(0);
    
    console.log('✅ [ScheduledAIMonitor] Monitoring system stopped');
  };

  // 🎯 NEW: Perform single photo capture (not batch)
  const performSinglePhotoCapture = async () => {
    if (!videoRef.current || !isStreamActive || isCapturing) {
      console.warn('⚠️ [ScheduledAIMonitor] Skipping capture - conditions not met');
      return;
    }

    console.log(`🎬 [ScheduledAIMonitor] Capturing photo ${currentSchedule.currentPhotoIndex + 1}/3 - ${currentSchedule.currentPhase} mode`);
    
    setIsCapturing(true);
    
    let analysis: IAnalysisResult | null = null;
    
    try {
      const imageData = await capturePhoto();
      if (imageData) {
        console.log(`✅ [ScheduledAIMonitor] Photo ${currentSchedule.currentPhotoIndex + 1}/3 captured successfully (${imageData.length} bytes)`);
        
        // Analyze photo
        analysis = await analyzePhoto(imageData, currentSchedule.currentPhotoIndex + 1);
        if (analysis) {
          console.log(`🤖 [ScheduledAIMonitor] Photo ${currentSchedule.currentPhotoIndex + 1}/3 analyzed: ${analysis.confidence}% confidence`);
          
          // Update recent analyses
          setRecentAnalyses(prev => [analysis, ...prev.slice(0, 9)]);
          
          // Notify parent component
          if (onAnalysisComplete) {
            onAnalysisComplete(analysis);
          }
        }
      }
      
      // Update statistics
      setSystemStats(prev => ({
        ...prev,
        totalCaptures: prev.totalCaptures + 1,
        successfulAnalyses: prev.successfulAnalyses + (analysis ? 1 : 0),
        alertsGenerated: prev.alertsGenerated + (analysis?.alertLevel === 'high' ? 1 : 0),
        lastCapture: new Date().toLocaleTimeString()
      }));
      
      // 🎯 ADVANCE TO NEXT PHOTO OR RESTART CYCLE
      setCurrentSchedule(prev => {
        const nextPhotoIndex = prev.currentPhotoIndex + 1;
        
        if (nextPhotoIndex >= prev.photosPerCapture) {
          // Cycle complete - restart
          console.log(`🔄 [ScheduledAIMonitor] Cycle complete! Restarting in ${prev.intervalMinutes} minutes...`);
          
          const newCycleStartTime = new Date(Date.now() + (prev.intervalMinutes * 60 * 1000));
          const newSchedule = {
            ...prev,
            currentPhotoIndex: 0,
            cycleStartTime: newCycleStartTime,
            nextCaptureTime: new Date(newCycleStartTime.getTime()) // First photo immediately when cycle starts
          };
          
          console.log(`⏰ [ScheduledAIMonitor] Next cycle starts at: ${newCycleStartTime.toLocaleTimeString()}`);
          return newSchedule;
        } else {
          // Next photo in current cycle
          const updatedSchedule = {
            ...prev,
            currentPhotoIndex: nextPhotoIndex,
            nextCaptureTime: calculateNextPhotoTime({
              ...prev,
              currentPhotoIndex: nextPhotoIndex
            })
          };
          
          console.log(`⏰ [ScheduledAIMonitor] Photo ${nextPhotoIndex + 1}/3 scheduled for: ${updatedSchedule.nextCaptureTime?.toLocaleTimeString()}`);
          return updatedSchedule;
        }
      });
      
    } catch (error) {
      console.error('❌ [ScheduledAIMonitor] Photo capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Capture photo from video stream
  const capturePhoto = async (): Promise<string | null> => {
    const video = videoRef.current;
    if (!video) return null;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      return imageData;
      
    } catch (error) {
      console.error('❌ [ScheduledAIMonitor] Photo capture failed:', error);
      return null;
    }
  };

  // Analyze photo using AI vision service
  const analyzePhoto = async (imageData: string, photoIndex: number): Promise<IAnalysisResult | null> => {
    try {
      console.log(`🔍 [ScheduledAIMonitor] Starting AI analysis for photo ${photoIndex}...`);
      
      const analysis = await aiVisionService.analyzeHorseImage(imageData, {
        name: 'Scheduled Monitor',
        age: 8,
        breed: 'Mixed',
        knownConditions: ['General monitoring'],
        priority: currentSchedule.currentPhase === 'night' ? 'high' : 'medium'
      });
      
      const result: IAnalysisResult = {
        timestamp: new Date().toISOString(),
        phase: currentSchedule.currentPhase,
        photoIndex,
        totalPhotos: currentSchedule.photosPerCapture,
        horseDetected: analysis.horseDetected,
        confidence: analysis.confidence * 100,
        observations: analysis.behaviorObservations,
        alertLevel: analysis.alertLevel as any,
        recommendations: analysis.recommendations
      };
      
      console.log(`✅ [ScheduledAIMonitor] AI analysis completed for photo ${photoIndex}:`);
      console.log(`   - Horse detected: ${result.horseDetected}`);
      console.log(`   - Confidence: ${result.confidence.toFixed(1)}%`);
      console.log(`   - Alert level: ${result.alertLevel}`);
      console.log(`   - Observations: ${result.observations.join(', ')}`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ [ScheduledAIMonitor] AI analysis failed for photo ${photoIndex}:`, error);
      return null;
    }
  };

  // Start countdown timer
  const startCountdownTimer = () => {
    countdownIntervalRef.current = setInterval(() => {
      if (currentSchedule.nextCaptureTime) {
        const now = new Date();
        const timeUntilNext = Math.max(0, currentSchedule.nextCaptureTime.getTime() - now.getTime());
        setCountdown(Math.floor(timeUntilNext / 1000));
      }
    }, 1000);
  };

  // Update uptime display
  const updateUptime = () => {
    if (uptimeStartRef.current) {
      const now = new Date();
      const uptimeMs = now.getTime() - uptimeStartRef.current.getTime();
      const hours = Math.floor(uptimeMs / 3600000);
      const minutes = Math.floor((uptimeMs % 3600000) / 60000);
      const seconds = Math.floor((uptimeMs % 60000) / 1000);
      
      setSystemStats(prev => ({
        ...prev,
        uptime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }));
    }
  };

  // Format countdown display
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  // Log schedule changes
  useEffect(() => {
    console.log(`📋 [ScheduledAIMonitor] Schedule updated:`, currentSchedule);
  }, [currentSchedule]);

  // Styles
  const styles = {
    container: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      padding: brandConfig.spacing.md,
      border: `1px solid ${brandConfig.colors.neutralGray}`
    },
    header: {
      marginBottom: brandConfig.spacing.md,
      textAlign: 'center' as const
    },
    controlRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.md
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.md
    },
    analysisItem: {
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.xs,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.xs,
      fontSize: brandConfig.typography.fontSizeSm
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={4} style={{ margin: 0, color: brandConfig.colors.stableMahogany }}>
          🤖 Scheduled AI Monitor
        </Title>
        <Text type="secondary">
          {currentSchedule.currentPhase.toUpperCase()} Mode: {currentSchedule.photosPerCapture} photos every {currentSchedule.intervalMinutes} minutes
        </Text>
      </div>

      {/* Control Row */}
      <div style={styles.controlRow}>
        <Space>
          <Button
            type={isActive ? "default" : "primary"}
            icon={isActive ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={isActive ? stopMonitoring : startMonitoring}
            disabled={!isStreamActive}
            size="large"
          >
            {isActive ? 'Stop' : 'Start'} Monitoring
          </Button>
          
          <Badge status={isActive ? 'success' : 'default'} text={isActive ? 'Active' : 'Inactive'} />
        </Space>

        <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
          <Text strong>Next Capture:</Text>
          <Text type={isCapturing ? "warning" : "secondary"}>
            {isCapturing ? '📸 Capturing...' : countdown > 0 ? formatCountdown(countdown) : '--:--'}
          </Text>
        </Space>
      </div>

      {/* System Statistics */}
      <div style={styles.statsGrid}>
        <Statistic title="Total Captures" value={systemStats.totalCaptures} prefix={<CameraOutlined />} />
        <Statistic title="Successful Analyses" value={systemStats.successfulAnalyses} prefix={<RobotOutlined />} />
        <Statistic title="Alerts Generated" value={systemStats.alertsGenerated} prefix={<WarningOutlined />} />
        <Statistic title="Uptime" value={systemStats.uptime} prefix={<ClockCircleOutlined />} />
      </div>

      {/* Current Status */}
      {isActive && (
        <Alert
          message={`System is monitoring in ${currentSchedule.currentPhase} mode`}
          description={`Next capture in ${formatCountdown(countdown)} - ${currentSchedule.photosPerCapture} photos will be captured and analyzed`}
          type="info"
          showIcon
          style={{ marginBottom: brandConfig.spacing.md }}
        />
      )}

      {/* Recent Analyses */}
      {recentAnalyses.length > 0 && (
        <>
          <Divider>Recent Analyses</Divider>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {recentAnalyses.map((analysis, index) => (
              <div key={index} style={styles.analysisItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text strong>{new Date(analysis.timestamp).toLocaleTimeString()}</Text>
                  <Space>
                    <Badge color={analysis.horseDetected ? 'green' : 'gray'} text={analysis.horseDetected ? '🐴' : '❌'} />
                    <Text>{analysis.confidence.toFixed(1)}%</Text>
                  </Space>
                </div>
                <Text style={{ fontSize: '12px' }}>{analysis.observations.join(', ')}</Text>
              </div>
            ))}
          </div>
        </>
      )}

      {!isStreamActive && (
        <Alert
          message="Camera stream required"
          description="Please start your camera stream to begin automated monitoring"
          type="warning"
          showIcon
        />
      )}
    </div>
  );
}; 