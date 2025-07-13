import { apiClient } from '../utils/apiClient';
import { zeroTrustTrainingConfig } from '../config/zeroTrustTrainingConfig';
import { aiTrainingConfig } from '../config/aiTrainingConfig';

// Training Session Interfaces
export interface ITrainingSession {
  id: string;
  disciplineType: string;
  participantId: string;
  participantType: 'horse' | 'rider';
  startTime: number;
  endTime?: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  metrics: ISessionMetrics;
  securityStatus: ISessionSecurityStatus;
  aiAnalysis?: IAIAnalysisResult;
}

export interface ISessionMetrics {
  timing: ITimingData;
  performance: IPerformanceData;
  biometric: IBiometricData;
  safety: ISafetyData;
}

export interface ITimingData {
  totalTime: number;
  splits: Record<string, number>;
  personalBest?: boolean;
  comparisonData?: IComparisonData;
}

export interface IPerformanceData {
  discipline: string;
  scores: Record<string, number>;
  metrics: Record<string, any>;
  improvements: string[];
  recommendations: string[];
}

export interface IBiometricData {
  heartRate?: number[];
  stressLevel?: number;
  fatigue?: number;
  temperature?: number;
  gaitAnalysis?: any;
}

export interface ISafetyData {
  alerts: ISafetyAlert[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  emergencyContacts?: string[];
}

export interface ISafetyAlert {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
}

export interface IComparisonData {
  previousBest: number;
  averageTime: number;
  competitionStandard: number;
  improvement: number;
}

export interface ISessionSecurityStatus {
  dataClassification: string;
  encryptionLevel: string;
  accessLog: IAccessLogEntry[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore: number;
}

export interface IAccessLogEntry {
  userId: string;
  action: string;
  timestamp: number;
  result: 'success' | 'denied' | 'error';
  riskScore?: number;
}

export interface IAIAnalysisResult {
  performanceScore: number;
  insights: string[];
  recommendations: string[];
  predictions: IPrediction[];
  coachingTips: string[];
  safetyWarnings: string[];
}

export interface IPrediction {
  type: string;
  confidence: number;
  timeframe: string;
  description: string;
}

// Video Analysis Interfaces
export interface IVideoAnalysis {
  sessionId: string;
  videoId: string;
  analysisType: 'technique' | 'performance' | 'safety' | 'competition';
  results: IVideoAnalysisResult;
  securityMetadata: IVideoSecurityMetadata;
}

export interface IVideoAnalysisResult {
  frameAnalysis: IFrameAnalysis[];
  movementTracking: IMovementData[];
  qualityScores: Record<string, number>;
  anomalies: IAnomalyDetection[];
  highlights: IVideoHighlight[];
}

export interface IFrameAnalysis {
  frameNumber: number;
  timestamp: number;
  objects: IDetectedObject[];
  quality: number;
  annotations: IAnnotation[];
}

export interface IDetectedObject {
  type: 'horse' | 'rider' | 'equipment' | 'obstacle';
  confidence: number;
  boundingBox: IBoundingBox;
  attributes: Record<string, any>;
}

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IAnnotation {
  type: string;
  text: string;
  position: { x: number; y: number };
  importance: 'low' | 'medium' | 'high';
}

export interface IMovementData {
  timestamp: number;
  velocity: number;
  acceleration: number;
  direction: number;
  gait?: string;
  rhythm?: number;
}

export interface IAnomalyDetection {
  type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  description: string;
  recommendation: string;
}

export interface IVideoHighlight {
  startTime: number;
  endTime: number;
  type: 'excellent' | 'improvement_needed' | 'safety_concern';
  description: string;
  importance: number;
}

export interface IVideoSecurityMetadata {
  encrypted: boolean;
  watermarked: boolean;
  accessRestrictions: string[];
  retentionDate: string;
  classificationLevel: string;
  downloadPermissions: string[];
}

// Device Management Interfaces
export interface IDeviceStatus {
  deviceId: string;
  type: 'camera' | 'sensor' | 'timer' | 'mobile';
  status: 'online' | 'offline' | 'compromised' | 'maintenance';
  trustScore: number;
  lastValidation: number;
  securityEvents: IDeviceSecurityEvent[];
}

export interface IDeviceSecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
  response: string;
}

class TrainingService {
  private baseUrl = '/api/v1/training';
  private wsConnection: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  // Session Management
  async createSession(sessionData: Partial<ITrainingSession>): Promise<ITrainingSession> {
    try {
      // Validate security permissions
      const canCreate = await this.validateSecurityAccess('training_sessions', 'create');
      if (!canCreate) {
        throw new Error('Insufficient permissions to create training session');
      }

      const response = await apiClient.post(`${this.baseUrl}/sessions`, {
        ...sessionData,
        securityMetadata: {
          classification: this.determineDataClassification(sessionData.disciplineType || ''),
          encryptionRequired: true,
          accessLog: []
        }
      });

      const session = response.data;
      
      // Initialize real-time monitoring
      await this.initializeRealTimeMonitoring(session.id);
      
      // Log session creation
      await this.logSecurityEvent('session_created', {
        sessionId: session.id,
        userId: sessionData.participantId,
        timestamp: Date.now()
      });

      return session;
    } catch (error) {
      console.error('Failed to create training session:', error);
      throw error;
    }
  }

  async startSession(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      
      // Validate device trust before starting
      await this.validateDeviceTrust(sessionId);
      
      // Start real-time data collection
      await this.startRealTimeCollection(sessionId);
      
      const response = await apiClient.patch(`${this.baseUrl}/sessions/${sessionId}/start`);
      
      // Emit session started event
      this.emit('sessionStarted', { sessionId, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Failed to start training session:', error);
      throw error;
    }
  }

  async pauseSession(sessionId: string): Promise<void> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/sessions/${sessionId}/pause`);
      
      // Emit session paused event
      this.emit('sessionPaused', { sessionId, timestamp: Date.now() });
      
      return response.data;
    } catch (error) {
      console.error('Failed to pause training session:', error);
      throw error;
    }
  }

  async stopSession(sessionId: string): Promise<ITrainingSession> {
    try {
      // Stop real-time collection
      await this.stopRealTimeCollection(sessionId);
      
      const response = await apiClient.patch(`${this.baseUrl}/sessions/${sessionId}/stop`);
      
      const session = response.data;
      
      // Generate final analysis
      const finalAnalysis = await this.generateFinalAnalysis(sessionId);
      session.aiAnalysis = finalAnalysis;
      
      // Clean up resources
      await this.cleanupSession(sessionId);
      
      // Emit session completed event
      this.emit('sessionCompleted', { sessionId, session, timestamp: Date.now() });
      
      return session;
    } catch (error) {
      console.error('Failed to stop training session:', error);
      throw error;
    }
  }

  async getSession(sessionId: string): Promise<ITrainingSession> {
    try {
      // Validate access permissions
      const canView = await this.validateSecurityAccess('training_sessions', 'view');
      if (!canView) {
        throw new Error('Insufficient permissions to view training session');
      }

      const response = await apiClient.get(`${this.baseUrl}/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get training session:', error);
      throw error;
    }
  }

  // Real-time Data Processing
  async initializeRealTimeMonitoring(sessionId: string): Promise<void> {
    try {
      // Establish WebSocket connection for real-time data
      this.wsConnection = new WebSocket(`ws://localhost:3001/training/realtime/${sessionId}`);
      
      this.wsConnection.onopen = () => {
        console.log('Real-time monitoring connected');
      };

      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealTimeData(sessionId, data);
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.handleConnectionError(sessionId, error);
      };

      this.wsConnection.onclose = () => {
        console.log('Real-time monitoring disconnected');
        this.handleConnectionClose(sessionId);
      };

    } catch (error) {
      console.error('Failed to initialize real-time monitoring:', error);
      throw error;
    }
  }

  private async handleRealTimeData(sessionId: string, data: any): Promise<void> {
    try {
      // Process different types of real-time data
      switch (data.type) {
        case 'timing':
          await this.processTimingData(sessionId, data);
          break;
        case 'biometric':
          await this.processBiometricData(sessionId, data);
          break;
        case 'video_frame':
          await this.processVideoFrame(sessionId, data);
          break;
        case 'sensor':
          await this.processSensorData(sessionId, data);
          break;
        case 'safety_alert':
          await this.processSafetyAlert(sessionId, data);
          break;
        default:
          console.warn('Unknown real-time data type:', data.type);
      }

      // Emit processed data event
      this.emit('realTimeData', { sessionId, data });

    } catch (error) {
      console.error('Failed to process real-time data:', error);
    }
  }

  private async processTimingData(sessionId: string, data: any): Promise<void> {
    // Process timing data with millisecond precision
    const timing = {
      timestamp: data.timestamp,
      split: data.split,
      totalTime: data.totalTime,
      accuracy: data.accuracy || 0.001 // 1ms accuracy
    };

    // Validate timing accuracy
    if (timing.accuracy > 0.005) { // 5ms threshold
      await this.logSecurityEvent('timing_accuracy_warning', {
        sessionId,
        accuracy: timing.accuracy,
        threshold: 0.005
      });
    }

    // Emit timing update
    this.emit('timingUpdate', { sessionId, timing });
  }

  private async processBiometricData(sessionId: string, data: any): Promise<void> {
    // Process biometric data with privacy protection
    const biometric = {
      heartRate: data.heartRate,
      stressLevel: data.stressLevel,
      fatigue: data.fatigue,
      timestamp: data.timestamp
    };

    // Check for safety thresholds
    if (biometric.heartRate && biometric.heartRate > 180) {
      await this.triggerSafetyAlert(sessionId, {
        type: 'high_heart_rate',
        severity: 'high',
        value: biometric.heartRate,
        threshold: 180
      });
    }

    // Emit biometric update
    this.emit('biometricUpdate', { sessionId, biometric });
  }

  private async processVideoFrame(sessionId: string, data: any): Promise<void> {
    // Process video frame with AI analysis
    const frameAnalysis = await this.analyzeVideoFrame(data.frame);
    
    // Check for safety concerns
    if (frameAnalysis.safetyScore < 0.7) {
      await this.triggerSafetyAlert(sessionId, {
        type: 'safety_concern_detected',
        severity: 'medium',
        description: 'AI detected potential safety issue in video feed'
      });
    }

    // Emit frame analysis
    this.emit('frameAnalysis', { sessionId, frameAnalysis });
  }

  // AI Analysis Methods
  async analyzeVideoFrame(frame: any): Promise<IFrameAnalysis> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/ai/analyze-frame`, {
        frame: frame,
        options: {
          detectObjects: true,
          analyzeMovement: true,
          checkSafety: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to analyze video frame:', error);
      throw error;
    }
  }

  async generateAICoaching(sessionId: string, performanceData: any): Promise<string[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/ai/coaching`, {
        sessionId,
        performanceData,
        context: {
          discipline: performanceData.discipline,
          level: performanceData.level,
          goals: performanceData.goals
        }
      });

      return response.data.recommendations;
    } catch (error) {
      console.error('Failed to generate AI coaching:', error);
      return [];
    }
  }

  async generateFinalAnalysis(sessionId: string): Promise<IAIAnalysisResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/ai/final-analysis`, {
        sessionId
      });

      return response.data;
    } catch (error) {
      console.error('Failed to generate final analysis:', error);
      throw error;
    }
  }

  // Security and Compliance Methods
  private async validateSecurityAccess(resource: string, action: string): Promise<boolean> {
    try {
      // Get current user context
      const userContext = await this.getCurrentUserContext();
      
      // Check permissions using Zero Trust config
      const hasPermission = zeroTrustTrainingConfig.validateDataAccess(
        userContext.role,
        'CONFIDENTIAL', // Default classification for training data
        action
      );

      if (!hasPermission) {
        await this.logSecurityEvent('access_denied', {
          resource,
          action,
          userId: userContext.id,
          timestamp: Date.now()
        });
      }

      return hasPermission;
    } catch (error) {
      console.error('Security validation failed:', error);
      return false;
    }
  }

  private async validateDeviceTrust(sessionId: string): Promise<void> {
    try {
      // Get all devices associated with the session
      const devices = await this.getSessionDevices(sessionId);
      
      for (const device of devices) {
        const trustPolicy = zeroTrustTrainingConfig.getDeviceTrustPolicy(device.type);
        
        if (!trustPolicy) {
          throw new Error(`No trust policy found for device type: ${device.type}`);
        }

        // Validate device certificate
        if (trustPolicy.requireCertification && !device.certified) {
          throw new Error(`Device ${device.id} lacks required certification`);
        }

        // Check trust score
        if (device.trustScore < 70) {
          throw new Error(`Device ${device.id} trust score too low: ${device.trustScore}`);
        }

        // Validate encryption
        if (trustPolicy.encryptionRequired && !device.encryptionEnabled) {
          throw new Error(`Device ${device.id} encryption not enabled`);
        }
      }
    } catch (error) {
      console.error('Device trust validation failed:', error);
      throw error;
    }
  }

  private determineDataClassification(disciplineType: string): string {
    // Determine data classification based on discipline and context
    const competitiveDisciplines = ['barrelRacing', 'dressage', 'jumping', 'reining'];
    
    if (competitiveDisciplines.includes(disciplineType)) {
      return 'RESTRICTED'; // Competition data is highly sensitive
    }
    
    return 'CONFIDENTIAL'; // Default classification for training data
  }

  async logSecurityEvent(eventType: string, details: any): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/security/events`, {
        type: eventType,
        details,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Device Management Methods
  async getSessionDevices(sessionId: string): Promise<IDeviceStatus[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/sessions/${sessionId}/devices`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session devices:', error);
      return [];
    }
  }

  async validateDeviceHealth(deviceId: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/devices/${deviceId}/health`);
      return response.data.healthy;
    } catch (error) {
      console.error('Failed to validate device health:', error);
      return false;
    }
  }

  // Safety and Emergency Methods
  private async triggerSafetyAlert(sessionId: string, alert: Partial<ISafetyAlert>): Promise<void> {
    try {
      const safetyAlert: ISafetyAlert = {
        type: alert.type || 'unknown',
        severity: alert.severity || 'medium',
        message: alert.message || 'Safety alert triggered',
        timestamp: Date.now(),
        resolved: false
      };

      // Send immediate alert
      await apiClient.post(`${this.baseUrl}/safety/alerts`, {
        sessionId,
        alert: safetyAlert
      });

      // Emit safety alert event
      this.emit('safetyAlert', { sessionId, alert: safetyAlert });

      // If critical severity, initiate emergency protocols
      if (safetyAlert.severity === 'critical') {
        await this.initiateEmergencyProtocol(sessionId);
      }

    } catch (error) {
      console.error('Failed to trigger safety alert:', error);
    }
  }

  private async initiateEmergencyProtocol(sessionId: string): Promise<void> {
    try {
      // Stop session immediately
      await this.stopSession(sessionId);
      
      // Notify emergency contacts
      await this.notifyEmergencyContacts(sessionId);
      
      // Lock down all devices
      await this.lockdownDevices(sessionId);
      
      // Log emergency event
      await this.logSecurityEvent('emergency_protocol_initiated', {
        sessionId,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Failed to initiate emergency protocol:', error);
    }
  }

  // Utility Methods
  private async getCurrentUserContext(): Promise<any> {
    // This should be implemented to get current user context
    // For now, return mock data
    return {
      id: 'user_001',
      role: 'TRAINER',
      permissions: []
    };
  }

  private async startRealTimeCollection(sessionId: string): Promise<void> {
    // Start collecting data from all sensors and devices
    console.log('Starting real-time data collection for session:', sessionId);
  }

  private async stopRealTimeCollection(sessionId: string): Promise<void> {
    // Stop collecting data and clean up resources
    console.log('Stopping real-time data collection for session:', sessionId);
  }

  private async cleanupSession(sessionId: string): Promise<void> {
    // Clean up WebSocket connections and temporary resources
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
  }

  private async handleConnectionError(sessionId: string, error: any): Promise<void> {
    console.error('Connection error for session:', sessionId, error);
    await this.logSecurityEvent('connection_error', {
      sessionId,
      error: error.message,
      timestamp: Date.now()
    });
  }

  private async handleConnectionClose(sessionId: string): Promise<void> {
    console.log('Connection closed for session:', sessionId);
    // Attempt to reconnect if session is still active
    setTimeout(() => this.initializeRealTimeMonitoring(sessionId), 5000);
  }

  private async notifyEmergencyContacts(sessionId: string): Promise<void> {
    // Notify emergency contacts - implementation depends on your notification system
    console.log('Notifying emergency contacts for session:', sessionId);
  }

  private async lockdownDevices(sessionId: string): Promise<void> {
    // Lock down all devices associated with the session
    console.log('Locking down devices for session:', sessionId);
  }

  // Event Management
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Event callback error:', error);
        }
      });
    }
  }
}

// Export singleton instance
export const trainingService = new TrainingService();
export default trainingService; 