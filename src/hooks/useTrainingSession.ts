import { useState, useEffect, useCallback, useRef } from 'react';
import { trainingService } from '../services/trainingService';
import type { ITrainingSession, ISessionMetrics, ISafetyAlert } from '../services/trainingService';
// Temporary mock for useZeroTrustSecurity hook until it's implemented
const useZeroTrustSecurity = () => ({
  validateAccess: async (resource: string, action: string) => true,
  encryptData: async (data: any) => data,
  logSecurityEvent: async (event: any) => {},
  validateDeviceTrust: async () => true,
  riskScore: async () => 25
});
import { zeroTrustTrainingConfig } from '../config/zeroTrustTrainingConfig';

interface IUseTrainingSessionProps {
  disciplineType: string;
  participantId: string;
  participantType: 'horse' | 'rider';
  autoSave?: boolean;
  securityLevel?: string;
}

interface ITrainingSessionState {
  session: ITrainingSession | null;
  isActive: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  metrics: ISessionMetrics | null;
  realTimeData: any[];
  safetyAlerts: ISafetyAlert[];
  securityEvents: any[];
  aiInsights: string[];
  deviceStatus: any[];
}

interface ITrainingSessionActions {
  createSession: () => Promise<void>;
  startSession: () => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  stopSession: () => Promise<ITrainingSession | null>;
  emergencyStop: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
  exportSession: () => Promise<Blob | null>;
  shareSession: (recipients: string[]) => Promise<void>;
}

export const useTrainingSession = ({
  disciplineType,
  participantId,
  participantType,
  autoSave = true,
  securityLevel = 'CONFIDENTIAL'
}: IUseTrainingSessionProps) => {
  // State Management
  const [state, setState] = useState<ITrainingSessionState>({
    session: null,
    isActive: false,
    isPaused: false,
    isLoading: false,
    error: null,
    metrics: null,
    realTimeData: [],
    safetyAlerts: [],
    securityEvents: [],
    aiInsights: [],
    deviceStatus: []
  });

  // Refs for cleanup and persistence
  const sessionRef = useRef<ITrainingSession | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Security hook
  const { 
    validateAccess, 
    encryptData, 
    logSecurityEvent,
    validateDeviceTrust,
    riskScore 
  } = useZeroTrustSecurity();

  // Initialize session data
  useEffect(() => {
    sessionRef.current = state.session;
  }, [state.session]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && state.session && state.isActive) {
      autoSaveRef.current = setInterval(async () => {
        try {
          await saveSessionProgress();
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 30000); // Save every 30 seconds

      return () => {
        if (autoSaveRef.current) {
          clearInterval(autoSaveRef.current);
        }
      };
    }
  }, [autoSave, state.session, state.isActive]);

  // Real-time event listeners
  useEffect(() => {
    const handleRealTimeData = (data: any) => {
      setState(prev => ({
        ...prev,
        realTimeData: [...prev.realTimeData.slice(-99), data] // Keep last 100 entries
      }));
    };

    const handleSafetyAlert = (data: any) => {
      setState(prev => ({
        ...prev,
        safetyAlerts: [data.alert, ...prev.safetyAlerts]
      }));
    };

    const handleSecurityEvent = (data: any) => {
      setState(prev => ({
        ...prev,
        securityEvents: [data, ...prev.securityEvents]
      }));
    };

    const handleAIInsight = (data: any) => {
      setState(prev => ({
        ...prev,
        aiInsights: [data.insight, ...prev.aiInsights.slice(0, 9)] // Keep last 10 insights
      }));
    };

    // Subscribe to events
    trainingService.on('realTimeData', handleRealTimeData);
    trainingService.on('safetyAlert', handleSafetyAlert);
    trainingService.on('securityEvent', handleSecurityEvent);
    trainingService.on('aiInsight', handleAIInsight);

    return () => {
      // Unsubscribe from events
      trainingService.off('realTimeData', handleRealTimeData);
      trainingService.off('safetyAlert', handleSafetyAlert);
      trainingService.off('securityEvent', handleSecurityEvent);
      trainingService.off('aiInsight', handleAIInsight);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
      
      // If session is active, pause it
      if (state.isActive && !state.isPaused) {
        pauseSession();
      }
    };
  }, []);

  // Session Management Actions
  const createSession = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Validate security permissions
      const canCreate = await validateAccess('training_sessions', 'create');
      if (!canCreate) {
        throw new Error('Insufficient permissions to create training session');
      }

      // Validate device trust scores
      const deviceTrustValid = await validateDeviceTrust();
      if (!deviceTrustValid) {
        throw new Error('Device trust validation failed');
      }

      // Create session through service
      const session = await trainingService.createSession({
        disciplineType,
        participantId,
        participantType,
        status: 'active',
        securityStatus: {
          dataClassification: securityLevel,
          encryptionLevel: 'AES-256',
          accessLog: [],
          threatLevel: 'low',
          complianceScore: 95
        }
      });

      setState(prev => ({
        ...prev,
        session,
        isLoading: false
      }));

      // Log session creation
      await logSecurityEvent({
        type: 'training_session_created',
        sessionId: session.id,
        discipline: disciplineType,
        participant: participantId,
        timestamp: Date.now()
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create session'
      }));
      throw error;
    }
  }, [disciplineType, participantId, participantType, securityLevel, validateAccess, validateDeviceTrust, logSecurityEvent]);

  const startSession = useCallback(async (): Promise<void> => {
    if (!state.session) {
      throw new Error('No session available to start');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Additional security checks before starting
      const currentRiskScore = await riskScore();
      if (currentRiskScore > 70) {
        throw new Error(`Security risk too high to start session: ${currentRiskScore}`);
      }

      await trainingService.startSession(state.session.id);
      
      setState(prev => ({
        ...prev,
        isActive: true,
        isPaused: false,
        isLoading: false
      }));

      // Start real-time metrics collection
      startMetricsCollection();

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start session'
      }));
      throw error;
    }
  }, [state.session, riskScore]);

  const pauseSession = useCallback(async (): Promise<void> => {
    if (!state.session || !state.isActive) {
      return;
    }

    try {
      await trainingService.pauseSession(state.session.id);
      
      setState(prev => ({
        ...prev,
        isPaused: true
      }));

      // Pause metrics collection
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to pause session'
      }));
      throw error;
    }
  }, [state.session, state.isActive]);

  const resumeSession = useCallback(async (): Promise<void> => {
    if (!state.session || !state.isActive || !state.isPaused) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isPaused: false
      }));

      // Resume metrics collection
      startMetricsCollection();

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to resume session'
      }));
      throw error;
    }
  }, [state.session, state.isActive, state.isPaused]);

  const stopSession = useCallback(async (): Promise<ITrainingSession | null> => {
    if (!state.session || !state.isActive) {
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const completedSession = await trainingService.stopSession(state.session.id);
      
      setState(prev => ({
        ...prev,
        session: completedSession,
        isActive: false,
        isPaused: false,
        isLoading: false
      }));

      // Stop metrics collection
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Final auto-save
      if (autoSave) {
        await saveSessionProgress();
      }

      return completedSession;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to stop session'
      }));
      throw error;
    }
  }, [state.session, state.isActive, autoSave]);

  const emergencyStop = useCallback(async (): Promise<void> => {
    try {
      // Immediate session termination
      setState(prev => ({
        ...prev,
        isActive: false,
        isPaused: false,
        isLoading: false
      }));

      // Stop all data collection
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Log emergency stop
      await logSecurityEvent({
        type: 'emergency_stop',
        sessionId: state.session?.id,
        timestamp: Date.now(),
        reason: 'Emergency stop initiated by user'
      });

      // If session exists, attempt graceful stop
      if (state.session) {
        try {
          await trainingService.stopSession(state.session.id);
        } catch (error) {
          console.error('Emergency stop - graceful session termination failed:', error);
        }
      }

    } catch (error) {
      console.error('Emergency stop failed:', error);
      // Emergency stop should not fail, so we don't throw here
    }
  }, [state.session, logSecurityEvent]);

  const acknowledgeAlert = useCallback((alertId: string): void => {
    setState(prev => ({
      ...prev,
      safetyAlerts: prev.safetyAlerts.map(alert => 
        alert.timestamp.toString() === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    }));
  }, []);

  const exportSession = useCallback(async (): Promise<Blob | null> => {
    if (!state.session) {
      return null;
    }

    try {
      // Validate export permissions
      const canExport = await validateAccess('training_data', 'export');
      if (!canExport) {
        throw new Error('Insufficient permissions to export session data');
      }

      // Encrypt sensitive data before export
      const sessionData = await encryptData({
        session: state.session,
        metrics: state.metrics,
        realTimeData: state.realTimeData,
        exportedAt: Date.now(),
        exportedBy: 'current_user_id' // This should come from auth context
      });

      const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
        type: 'application/json'
      });

      // Log export event
      await logSecurityEvent({
        type: 'session_data_exported',
        sessionId: state.session.id,
        timestamp: Date.now()
      });

      return blob;

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to export session'
      }));
      return null;
    }
  }, [state.session, state.metrics, state.realTimeData, validateAccess, encryptData, logSecurityEvent]);

  const shareSession = useCallback(async (recipients: string[]): Promise<void> => {
    if (!state.session) {
      throw new Error('No session available to share');
    }

    try {
      // Validate sharing permissions
      const canShare = await validateAccess('training_data', 'share');
      if (!canShare) {
        throw new Error('Insufficient permissions to share session data');
      }

      // Check if data classification allows sharing
      const classificationConfig = zeroTrustTrainingConfig.dataClassification.levels[securityLevel as keyof typeof zeroTrustTrainingConfig.dataClassification.levels];
      if (classificationConfig.sharing === 'owner_trainer_only') {
        throw new Error('Data classification prevents sharing');
      }

      // Log sharing attempt
      await logSecurityEvent({
        type: 'session_share_request',
        sessionId: state.session.id,
        recipients,
        timestamp: Date.now()
      });

      // Implementation for actual sharing would go here
      console.log('Sharing session with:', recipients);

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to share session'
      }));
      throw error;
    }
  }, [state.session, securityLevel, validateAccess, logSecurityEvent]);

  // Helper Functions
  const startMetricsCollection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // Collect real-time metrics
      collectMetrics();
    }, 1000); // Collect every second
  }, []);

  const collectMetrics = useCallback(async () => {
    if (!state.session || !state.isActive || state.isPaused) {
      return;
    }

    try {
      // This would collect actual metrics from devices and sensors
      const currentMetrics = {
        timing: {
          totalTime: Date.now() - (state.session.startTime || Date.now()),
          splits: {},
          personalBest: false
        },
        performance: {
          discipline: disciplineType,
          scores: {},
          metrics: {},
          improvements: [],
          recommendations: []
        },
        biometric: {
          heartRate: [],
          stressLevel: 0,
          fatigue: 0
        },
        safety: {
          alerts: state.safetyAlerts,
          riskLevel: 'low' as const
        }
      };

      setState(prev => ({
        ...prev,
        metrics: currentMetrics
      }));

    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }, [state.session, state.isActive, state.isPaused, state.safetyAlerts, disciplineType]);

  const saveSessionProgress = useCallback(async (): Promise<void> => {
    if (!state.session) {
      return;
    }

    try {
      // Save current session state
      // This would typically call an API to persist the session data
      console.log('Auto-saving session progress:', state.session.id);
      
    } catch (error) {
      console.error('Failed to save session progress:', error);
    }
  }, [state.session]);

  // Return state and actions
  const actions: ITrainingSessionActions = {
    createSession,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    emergencyStop,
    acknowledgeAlert,
    exportSession,
    shareSession
  };

  return {
    ...state,
    actions,
    // Computed values
    sessionDuration: state.session?.startTime ? Date.now() - state.session.startTime : 0,
    hasUnresolvedAlerts: state.safetyAlerts.some(alert => !alert.resolved),
    securityRiskLevel: state.securityEvents.length > 0 ? 'elevated' : 'normal',
    isSecure: state.securityEvents.filter(event => !event.resolved).length === 0,
    // Utility functions
    formatTime: (milliseconds: number): string => {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      
      if (hours > 0) {
        return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
      }
      return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
  };
};

export default useTrainingSession; 