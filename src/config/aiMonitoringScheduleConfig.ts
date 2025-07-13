// 🤖 AI Monitoring Schedule Configuration
// Single source of truth for all AI monitoring timing and patterns

import { brandConfig } from './brandConfig';

export interface IAIMonitoringSchedule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  
  // Time-based patterns
  dayPattern: IMonitoringPattern;
  nightPattern: IMonitoringPattern;
  
  // Schedule rules
  timeRanges: {
    dayStart: string; // "06:00"
    nightStart: string; // "20:00"
  };
  
  // Advanced settings
  pauseBetweenSessions: {
    enabled: boolean;
    dayPauseMinutes: number;
    nightPauseMinutes: number;
  };
  
  // Emergency overrides
  emergencyMode: {
    enabled: boolean;
    intervalSeconds: number;
    maxDurationMinutes: number;
  };
}

export interface IMonitoringPattern {
  // Photo capture settings
  photosPerSession: number;
  intervalBetweenPhotos: number; // seconds
  
  // Session timing
  sessionDurationSeconds: number;
  pauseBetweenSessionsMinutes: number;
  
  // AI Analysis settings
  analysisMode: 'realtime' | 'standard' | 'efficient';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Quality settings
  skipOptimization: boolean;
  forceContinuous: boolean;
}

// 🎯 Pre-configured monitoring schedules
export const aiMonitoringSchedules: IAIMonitoringSchedule[] = [
  {
    id: 'default_barn_monitoring',
    name: 'Default Barn Monitoring',
    description: 'Standard 24/7 barn monitoring with day/night patterns',
    enabled: true,
    
    dayPattern: {
      photosPerSession: 10,
      intervalBetweenPhotos: 6, // 6 seconds between photos
      sessionDurationSeconds: 60, // 10 photos × 6 seconds = 60 seconds
      pauseBetweenSessionsMinutes: 20, // 20 minute break between sessions
      analysisMode: 'standard',
      priority: 'medium',
      skipOptimization: false,
      forceContinuous: true
    },
    
    nightPattern: {
      photosPerSession: 10,
      intervalBetweenPhotos: 3, // 3 seconds between photos
      sessionDurationSeconds: 30, // 10 photos × 3 seconds = 30 seconds
      pauseBetweenSessionsMinutes: 5, // 5 minute break between sessions
      analysisMode: 'standard', // Using standard mode for better reliability
      priority: 'high', // Higher priority since night monitoring is critical
      skipOptimization: false,
      forceContinuous: true
    },
    
    timeRanges: {
      dayStart: '06:00',
      nightStart: '20:00'
    },
    
    pauseBetweenSessions: {
      enabled: true,
      dayPauseMinutes: 20,
      nightPauseMinutes: 60
    },
    
    emergencyMode: {
      enabled: false,
      intervalSeconds: 5,
      maxDurationMinutes: 30
    }
  },
  
  {
    id: 'intensive_monitoring',
    name: 'Intensive Health Monitoring',
    description: 'High-frequency monitoring for sick or high-risk horses',
    enabled: false,
    
    dayPattern: {
      photosPerSession: 15,
      intervalBetweenPhotos: 3, // 3 seconds between photos
      sessionDurationSeconds: 45, // 15 photos × 3 seconds
      pauseBetweenSessionsMinutes: 10, // Short breaks
      analysisMode: 'realtime',
      priority: 'high',
      skipOptimization: true, // Don't skip any analysis
      forceContinuous: true
    },
    
    nightPattern: {
      photosPerSession: 10,
      intervalBetweenPhotos: 5, // 5 seconds between photos
      sessionDurationSeconds: 50, // 10 photos × 5 seconds
      pauseBetweenSessionsMinutes: 15, // Shorter night breaks
      analysisMode: 'standard',
      priority: 'medium',
      skipOptimization: true,
      forceContinuous: true
    },
    
    timeRanges: {
      dayStart: '06:00',
      nightStart: '22:00'
    },
    
    pauseBetweenSessions: {
      enabled: true,
      dayPauseMinutes: 10,
      nightPauseMinutes: 15
    },
    
    emergencyMode: {
      enabled: true,
      intervalSeconds: 2,
      maxDurationMinutes: 60
    }
  },
  
  {
    id: 'power_saver_monitoring',
    name: 'Power Saver Mode',
    description: 'Minimal monitoring for stable, healthy horses',
    enabled: false,
    
    dayPattern: {
      photosPerSession: 5,
      intervalBetweenPhotos: 12, // 12 seconds between photos
      sessionDurationSeconds: 60, // 5 photos × 12 seconds
      pauseBetweenSessionsMinutes: 45, // Long breaks
      analysisMode: 'efficient',
      priority: 'low',
      skipOptimization: false,
      forceContinuous: false
    },
    
    nightPattern: {
      photosPerSession: 3,
      intervalBetweenPhotos: 60, // 1 minute between photos
      sessionDurationSeconds: 180, // 3 photos × 60 seconds
      pauseBetweenSessionsMinutes: 120, // 2 hour breaks
      analysisMode: 'efficient',
      priority: 'low',
      skipOptimization: false,
      forceContinuous: false
    },
    
    timeRanges: {
      dayStart: '07:00',
      nightStart: '19:00'
    },
    
    pauseBetweenSessions: {
      enabled: true,
      dayPauseMinutes: 45,
      nightPauseMinutes: 120
    },
    
    emergencyMode: {
      enabled: false,
      intervalSeconds: 10,
      maxDurationMinutes: 15
    }
  }
];

// 🎛️ UI Configuration for monitoring controls
export const aiMonitoringUIConfig = {
  scheduleSelector: {
    title: 'Monitoring Schedule',
    description: 'Choose a pre-configured monitoring pattern',
    showDescription: true,
    allowCustom: true
  },
  
  statusIndicators: {
    currentPhase: {
      title: 'Current Phase',
      dayLabel: '☀️ Day Pattern',
      nightLabel: '🌙 Night Pattern',
      pauseLabel: '⏸️ Pause Period',
      emergencyLabel: '🚨 Emergency Mode'
    },
    
    nextAction: {
      title: 'Next Action',
      showCountdown: true,
      showPhotosRemaining: true
    },
    
    sessionProgress: {
      title: 'Session Progress',
      showPhotoCount: true,
      showTimeRemaining: true,
      showProgressBar: true
    }
  },
  
  quickActions: {
    emergencyMode: {
      label: 'Emergency Mode',
      icon: 'AlertTriangle',
      color: brandConfig.colors.errorRed,
      description: 'Start intensive monitoring immediately'
    },
    
    pauseMonitoring: {
      label: 'Pause Monitoring',
      icon: 'Pause',
      color: brandConfig.colors.arenaSand,
      description: 'Temporarily pause all monitoring'
    },
    
    resumeMonitoring: {
      label: 'Resume Monitoring',
      icon: 'Play',
      color: brandConfig.colors.hunterGreen,
      description: 'Resume scheduled monitoring'
    },
    
    captureNow: {
      label: 'Capture Now',
      icon: 'Camera',
      color: brandConfig.colors.stableMahogany,
      description: 'Take immediate photo and analyze'
    }
  },
  
  // Time display formats
  timeFormats: {
    countdown: 'mm:ss',
    timeOfDay: 'HH:mm',
    duration: 'mm:ss',
    sessionTime: 'HH:mm:ss'
  },
  
  // Visual indicators
  colors: {
    dayPhase: brandConfig.colors.warningOrange,
    nightPhase: brandConfig.colors.midnightBlack,
    pausePhase: brandConfig.colors.arenaSand,
    emergencyPhase: brandConfig.colors.errorRed,
    activeSession: brandConfig.colors.hunterGreen,
    waitingPhase: brandConfig.colors.pastureSage
  }
};

// 🕐 Helper functions for time-based logic
export const monitoringTimeHelpers = {
  /**
   * Get current time as HH:mm string
   */
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },
  
  /**
   * Check if current time is in day period
   */
  isDayTime(schedule: IAIMonitoringSchedule): boolean {
    const now = this.getCurrentTime();
    const { dayStart, nightStart } = schedule.timeRanges;
    
    return now >= dayStart && now < nightStart;
  },
  
  /**
   * Get current monitoring pattern
   */
  getCurrentPattern(schedule: IAIMonitoringSchedule): IMonitoringPattern {
    return this.isDayTime(schedule) ? schedule.dayPattern : schedule.nightPattern;
  },
  
  /**
   * Calculate next phase change time
   */
  getNextPhaseChange(schedule: IAIMonitoringSchedule): { time: string; phase: 'day' | 'night' } {
    const isDay = this.isDayTime(schedule);
    
    if (isDay) {
      return { time: schedule.timeRanges.nightStart, phase: 'night' };
    } else {
      return { time: schedule.timeRanges.dayStart, phase: 'day' };
    }
  },
  
  /**asdf
   * Format seconds into mm:ss
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

// 🎯 Export active schedule (can be changed at runtime)
export let activeMonitoringSchedule: IAIMonitoringSchedule = aiMonitoringSchedules[0];

/**
 * Set the active monitoring schedule
 */
export const setActiveMonitoringSchedule = (scheduleId: string) => {
  const schedule = aiMonitoringSchedules.find(s => s.id === scheduleId);
  if (schedule) {
    activeMonitoringSchedule = schedule;
    console.log(`📅 Switched to monitoring schedule: ${schedule.name}`);
  }
};

/**
 * Get schedule by ID
 */
export const getScheduleById = (scheduleId: string): IAIMonitoringSchedule | undefined => {
  return aiMonitoringSchedules.find(s => s.id === scheduleId);
}; 