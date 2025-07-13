// 🤖 Smart AI Monitoring Hook
// Implements scheduled monitoring with day/night patterns, session management, and pause periods

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  activeMonitoringSchedule, 
  monitoringTimeHelpers,
  setActiveMonitoringSchedule,
  type IAIMonitoringSchedule,
  type IMonitoringPattern
} from '../config/aiMonitoringScheduleConfig';

export interface ISmartMonitoringState {
  // Status
  isActive: boolean;
  isInSession: boolean;
  isPaused: boolean;
  isEmergencyMode: boolean;
  
  // Current state
  currentPhase: 'day' | 'night';
  currentPattern: IMonitoringPattern;
  schedule: IAIMonitoringSchedule;
  
  // Session tracking
  sessionProgress: {
    photosInSession: number;
    totalPhotosInSession: number;
    sessionTimeElapsed: number;
    sessionTimeRemaining: number;
  };
  
  // Timing
  timeToNextAction: number; // seconds
  timeToNextPhase: number; // seconds
  nextActionType: 'capture' | 'pause' | 'resume' | 'phase_change';
  
  // Statistics
  stats: {
    sessionsCompleted: number;
    totalPhotosToday: number;
    totalAnalysesToday: number;
    uptime: number; // minutes
  };
}

export interface ISmartMonitoringControls {
  // Basic controls
  startMonitoring: () => void;
  stopMonitoring: () => void;
  pauseMonitoring: () => void;
  resumeMonitoring: () => void;
  
  // Advanced controls
  switchToEmergencyMode: () => void;
  exitEmergencyMode: () => void;
  captureNow: () => void;
  changeSchedule: (scheduleId: string) => void;
  
  // Session controls
  skipToNextSession: () => void;
  restartCurrentSession: () => void;
}

export const useSmartAIMonitoring = (
  onCapturePhoto: () => void,
  onAnalysisComplete?: (analysis: any) => void
) => {
  // State management
  const [state, setState] = useState<ISmartMonitoringState>(() => {
    const currentPattern = monitoringTimeHelpers.getCurrentPattern(activeMonitoringSchedule);
    
    return {
      isActive: false,
      isInSession: false,
      isPaused: false,
      isEmergencyMode: false,
      currentPhase: monitoringTimeHelpers.isDayTime(activeMonitoringSchedule) ? 'day' : 'night',
      currentPattern,
      schedule: activeMonitoringSchedule,
      sessionProgress: {
        photosInSession: 0,
        totalPhotosInSession: currentPattern.photosPerSession,
        sessionTimeElapsed: 0,
        sessionTimeRemaining: currentPattern.sessionDurationSeconds
      },
      timeToNextAction: 0,
      timeToNextPhase: 0,
      nextActionType: 'capture',
      stats: {
        sessionsCompleted: 0,
        totalPhotosToday: 0,
        totalAnalysesToday: 0,
        uptime: 0
      }
    };
  });
  
  // Refs for intervals and timing
  const masterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const lastPhaseCheckRef = useRef<string>('');
  
  /**
   * Update state with current schedule and pattern
   */
  const updateCurrentPattern = useCallback(() => {
    const currentPhase = monitoringTimeHelpers.isDayTime(activeMonitoringSchedule) ? 'day' : 'night';
    const currentPattern = monitoringTimeHelpers.getCurrentPattern(activeMonitoringSchedule);
    
    setState(prev => ({
      ...prev,
      currentPhase,
      currentPattern,
      schedule: activeMonitoringSchedule,
      sessionProgress: {
        ...prev.sessionProgress,
        totalPhotosInSession: currentPattern.photosPerSession,
        sessionTimeRemaining: currentPattern.sessionDurationSeconds
      }
    }));
  }, []);
  
  /**
   * Check for phase changes (day/night transitions)
   */
  const checkPhaseChange = useCallback(() => {
    const currentTimeKey = monitoringTimeHelpers.getCurrentTime();
    
    if (currentTimeKey !== lastPhaseCheckRef.current) {
      lastPhaseCheckRef.current = currentTimeKey;
      
      const newPhase = monitoringTimeHelpers.isDayTime(activeMonitoringSchedule) ? 'day' : 'night';
      
      if (newPhase !== state.currentPhase) {
        console.log(`🌅 Phase change detected: ${state.currentPhase} → ${newPhase}`);
        
        // End current session and prepare for new phase
        if (state.isInSession) {
          endCurrentSession();
        }
        
        updateCurrentPattern();
        
        // Start new session with new pattern after a brief delay
        setTimeout(() => {
          if (state.isActive && !state.isPaused) {
            startNewSession();
          }
        }, 5000); // 5 second transition delay
      }
    }
  }, [state.currentPhase, state.isActive, state.isPaused, state.isInSession]);
  
  /**
   * Start a new photo session
   */
  const startNewSession = useCallback(() => {
    const pattern = monitoringTimeHelpers.getCurrentPattern(activeMonitoringSchedule);
    
    console.log(`📸 Starting new session: ${pattern.photosPerSession} photos every ${pattern.intervalBetweenPhotos}s`);
    
    setState(prev => ({
      ...prev,
      isInSession: true,
      sessionProgress: {
        photosInSession: 0,
        totalPhotosInSession: pattern.photosPerSession,
        sessionTimeElapsed: 0,
        sessionTimeRemaining: pattern.sessionDurationSeconds
      },
      timeToNextAction: pattern.intervalBetweenPhotos,
      nextActionType: 'capture'
    }));
    
    // Start session interval for photo captures
    sessionIntervalRef.current = setInterval(() => {
      if (state.isActive && state.isInSession && !state.isPaused) {
        capturePhoto();
      }
    }, pattern.intervalBetweenPhotos * 1000);
    
  }, [state.isActive, state.isInSession, state.isPaused]);
  
  /**
   * End current session and schedule pause
   */
  const endCurrentSession = useCallback(() => {
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }
    
    const pattern = monitoringTimeHelpers.getCurrentPattern(activeMonitoringSchedule);
    const pauseMinutes = state.currentPhase === 'day' 
      ? activeMonitoringSchedule.pauseBetweenSessions.dayPauseMinutes
      : activeMonitoringSchedule.pauseBetweenSessions.nightPauseMinutes;
    
    console.log(`⏸️ Session complete. Pausing for ${pauseMinutes} minutes.`);
    
    setState(prev => ({
      ...prev,
      isInSession: false,
      isPaused: true,
      timeToNextAction: pauseMinutes * 60,
      nextActionType: 'resume',
      stats: {
        ...prev.stats,
        sessionsCompleted: prev.stats.sessionsCompleted + 1
      }
    }));
    
    // Schedule next session
    if (activeMonitoringSchedule.pauseBetweenSessions.enabled) {
      pauseTimeoutRef.current = setTimeout(() => {
        if (state.isActive) {
          setState(prev => ({ ...prev, isPaused: false }));
          startNewSession();
        }
      }, pauseMinutes * 60 * 1000);
    }
  }, [state.currentPhase, state.isActive]);
  
  /**
   * Capture a photo and update session progress
   */
  const capturePhoto = useCallback(() => {
    console.log(`📸 Capturing photo ${state.sessionProgress.photosInSession + 1}/${state.sessionProgress.totalPhotosInSession}`);
    
    // Trigger photo capture
    onCapturePhoto();
    
    setState(prev => {
      const newPhotosInSession = prev.sessionProgress.photosInSession + 1;
      const isSessionComplete = newPhotosInSession >= prev.sessionProgress.totalPhotosInSession;
      
      const newStats = {
        ...prev.stats,
        totalPhotosToday: prev.stats.totalPhotosToday + 1,
        totalAnalysesToday: prev.stats.totalAnalysesToday + 1
      };
      
      if (isSessionComplete) {
        // Session complete, schedule end
        setTimeout(() => endCurrentSession(), 1000);
      }
      
      return {
        ...prev,
        sessionProgress: {
          ...prev.sessionProgress,
          photosInSession: newPhotosInSession
        },
        stats: newStats
      };
    });
  }, [state.sessionProgress, onCapturePhoto, endCurrentSession]);
  
  /**
   * Master monitoring loop - runs every second
   */
  const runMasterLoop = useCallback(() => {
    if (!state.isActive) return;
    
    // Update uptime
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        uptime: startTimeRef.current 
          ? Math.floor((Date.now() - startTimeRef.current.getTime()) / 60000)
          : 0
      }
    }));
    
    // Check for phase changes
    checkPhaseChange();
    
    // Update countdown timers
    setState(prev => ({
      ...prev,
      timeToNextAction: Math.max(0, prev.timeToNextAction - 1),
      sessionProgress: {
        ...prev.sessionProgress,
        sessionTimeElapsed: prev.sessionProgress.sessionTimeElapsed + 1,
        sessionTimeRemaining: Math.max(0, prev.sessionProgress.sessionTimeRemaining - 1)
      }
    }));
  }, [state.isActive, checkPhaseChange]);
  
  // Controls implementation
  const controls: ISmartMonitoringControls = {
    startMonitoring: () => {
      console.log('🚀 Starting smart AI monitoring');
      startTimeRef.current = new Date();
      setState(prev => ({ ...prev, isActive: true, isPaused: false }));
      startNewSession();
    },
    
    stopMonitoring: () => {
      console.log('⏹️ Stopping smart AI monitoring');
      
      // Clear all intervals and timeouts
      if (masterIntervalRef.current) clearInterval(masterIntervalRef.current);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      
      setState(prev => ({
        ...prev,
        isActive: false,
        isInSession: false,
        isPaused: false,
        isEmergencyMode: false
      }));
    },
    
    pauseMonitoring: () => {
      console.log('⏸️ Pausing monitoring');
      setState(prev => ({ ...prev, isPaused: true }));
    },
    
    resumeMonitoring: () => {
      console.log('▶️ Resuming monitoring');
      setState(prev => ({ ...prev, isPaused: false }));
      if (!state.isInSession) {
        startNewSession();
      }
    },
    
    switchToEmergencyMode: () => {
      console.log('🚨 Switching to emergency mode');
      
      // Clear existing intervals
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      
      setState(prev => ({
        ...prev,
        isEmergencyMode: true,
        isInSession: true,
        isPaused: false
      }));
      
      // Start emergency interval
      const emergencyInterval = activeMonitoringSchedule.emergencyMode.intervalSeconds * 1000;
      sessionIntervalRef.current = setInterval(() => {
        if (state.isActive && state.isEmergencyMode) {
          capturePhoto();
        }
      }, emergencyInterval);
    },
    
    exitEmergencyMode: () => {
      console.log('✅ Exiting emergency mode');
      
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      
      setState(prev => ({
        ...prev,
        isEmergencyMode: false,
        isInSession: false
      }));
      
      startNewSession();
    },
    
    captureNow: () => {
      console.log('📸 Manual capture triggered');
      capturePhoto();
    },
    
    changeSchedule: (scheduleId: string) => {
      console.log(`📅 Changing to schedule: ${scheduleId}`);
      setActiveMonitoringSchedule(scheduleId);
      updateCurrentPattern();
      
      // Restart monitoring with new schedule
      if (state.isActive) {
        controls.stopMonitoring();
        setTimeout(() => controls.startMonitoring(), 1000);
      }
    },
    
    skipToNextSession: () => {
      console.log('⏭️ Skipping to next session');
      endCurrentSession();
    },
    
    restartCurrentSession: () => {
      console.log('🔄 Restarting current session');
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      startNewSession();
    }
  };
  
  // Master interval effect
  useEffect(() => {
    if (state.isActive) {
      masterIntervalRef.current = setInterval(runMasterLoop, 1000);
    } else {
      if (masterIntervalRef.current) clearInterval(masterIntervalRef.current);
    }
    
    return () => {
      if (masterIntervalRef.current) clearInterval(masterIntervalRef.current);
    };
  }, [state.isActive, runMasterLoop]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (masterIntervalRef.current) clearInterval(masterIntervalRef.current);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);
  
  return {
    state,
    controls
  };
}; 