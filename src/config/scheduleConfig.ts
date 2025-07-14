/**
 * Schedule Configuration - Phase 2 AI Analysis Integration
 * 
 * 💼 BUSINESS PARTNER SCHEDULING CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * This configuration controls ALL aspects of automatic photo capture scheduling
 * for the AI monitoring system. Customize these settings to match your
 * monitoring requirements and operational preferences.
 * 
 * 📅 SCHEDULE TYPES:
 *     DAYTIME (7 AM - 7 PM): 3 photos every 20 minutes
 *     NIGHTTIME (7 PM - 7 AM): 3 photos every 5 minutes
 * 
 * 🔄 FLEXIBLE FEATURES:
 *     - Easy time period adjustments
 *     - Customizable photo counts per session
 *     - Intelligent error handling and retry logic
 *     - Manual override capabilities
 *     - Holiday and maintenance scheduling
 * 
 * @author One Barn Development Team
 * @since Phase 2 - AI Analysis Integration
 * @compliance Demo account only, follows configuration standards
 */

import { brandConfig } from './brandConfig';

// ============================================================================
// SCHEDULE TIMING INTERFACES
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Time-based schedule configuration
 * 
 * Defines when and how often photos should be captured during
 * different periods of the day for optimal monitoring coverage.
 */
export interface ISchedulePeriod {
  // Time Period Definition
  name: string;                         // Human-readable name for this period
  description: string;                  // Description of monitoring purpose
  startHour: number;                    // Start hour (0-23, 24-hour format)
  endHour: number;                      // End hour (0-23, next day if < startHour)
  
  // Capture Configuration
  intervalMinutes: number;              // Minutes between capture sessions
  photosPerCapture: number;             // Number of photos per session
  captureQuality: 'low' | 'medium' | 'high' | 'maximum'; // Quality setting
  
  // Operational Settings
  enabled: boolean;                     // Whether this schedule is active
  priority: 'low' | 'normal' | 'high' | 'critical'; // Schedule priority
  allowManualOverride: boolean;         // Allow manual triggers during this period
  
  // Performance Optimization
  maxConcurrentCaptures: number;        // Maximum simultaneous capture sessions
  retryPolicy: {
    maxAttempts: number;                // Maximum retry attempts on failure
    retryDelayMs: number;               // Delay between retry attempts
    backoffMultiplier: number;          // Exponential backoff multiplier
  };
  
  // Storage Management
  storagePolicy: {
    compressionLevel: 'none' | 'low' | 'medium' | 'high'; // Compression for this period
    retentionDays: number;              // How long to keep photos from this period
    autoCleanup: boolean;               // Whether to auto-cleanup old photos
  };
}

/**
 * 💼 BUSINESS PARTNER: Special schedule override configuration
 * 
 * Allows for temporary schedule modifications for special circumstances
 * like maintenance, holidays, or enhanced monitoring periods.
 */
export interface IScheduleOverride {
  id: string;                           // Unique override identifier
  name: string;                         // Human-readable override name
  description: string;                  // Purpose of this override
  
  // Time Period
  startDate: Date;                      // When override begins
  endDate: Date;                        // When override ends
  allDay: boolean;                      // Whether override applies all day
  specificHours?: {                     // Specific hours if not all day
    start: number;                      // Start hour (0-23)
    end: number;                        // End hour (0-23)
  };
  
  // Override Behavior
  action: 'disable' | 'modify' | 'enhance' | 'pause'; // What to do during override
  modifiedSchedule?: Partial<ISchedulePeriod>; // Modified settings if action is 'modify'
  reason: string;                       // Reason for override
  
  // Notifications
  notifyBeforeStart: boolean;           // Notify before override starts
  notifyOnEnd: boolean;                 // Notify when override ends
  notificationMessage?: string;         // Custom notification message
  
  // Automatic Management
  autoActivate: boolean;                // Whether override activates automatically
  recurring: boolean;                   // Whether override repeats
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'; // Recurrence pattern
}

/**
 * 💼 BUSINESS PARTNER: Schedule health monitoring configuration
 */
export interface IScheduleHealthConfig {
  // Monitoring Thresholds
  thresholds: {
    maxConsecutiveFailures: number;     // Alert after this many failures
    minSuccessRate: number;             // Minimum acceptable success rate (0-1)
    maxAverageResponseTime: number;     // Maximum acceptable response time (ms)
    maxStorageUsage: number;            // Maximum storage usage before alert (bytes)
  };
  
  // Health Check Schedule
  healthChecks: {
    frequencyMinutes: number;           // How often to check health
    enableDetailedLogging: boolean;     // Whether to log detailed health data
    enableAlerts: boolean;              // Whether to send health alerts
    alertMethods: ('console' | 'notification' | 'storage')[];
  };
  
  // Performance Monitoring
  performance: {
    trackCaptureTime: boolean;          // Track time taken for captures
    trackStorageTime: boolean;          // Track time taken for storage
    trackQualityMetrics: boolean;       // Track photo quality over time
    enableTrendAnalysis: boolean;       // Analyze performance trends
  };
  
  // Automatic Recovery
  recovery: {
    enableAutoRecovery: boolean;        // Automatically attempt recovery
    recoveryActions: ('restart' | 'reduce_frequency' | 'reduce_quality' | 'notify')[];
    recoveryDelayMinutes: number;       // Wait time before recovery attempt
    maxRecoveryAttempts: number;        // Maximum auto-recovery attempts
  };
}

// ============================================================================
// MAIN SCHEDULE CONFIGURATION
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Complete scheduling configuration
 * 
 * OPTIMIZED SCHEDULE SETTINGS:
 * ✅ Daytime monitoring for routine behavior patterns
 * ✅ Enhanced nighttime monitoring for critical surveillance
 * ✅ Intelligent error handling and recovery
 * ✅ Flexible override system for special circumstances
 * ✅ Comprehensive health monitoring and alerting
 * 
 * BUSINESS PARTNER CUSTOMIZATION:
 * - All time periods can be adjusted to match your needs
 * - Photo counts and quality can be optimized for your use case
 * - Storage and cleanup policies can be customized
 * - Override system allows for maintenance and special events
 */
export const scheduleConfig = {
  
  // ═══════════════════════════════════════════════════════════════════════
  // CORE SCHEDULE PERIODS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Daytime Schedule (7 AM - 7 PM)
   * 
   * OPTIMIZED FOR:
   * - Routine behavior monitoring
   * - Battery and storage efficiency
   * - Normal activity patterns
   * - Regular health checks
   */
  daytime: {
    name: 'Daytime Monitoring',
    description: 'Regular monitoring during normal activity hours',
    startHour: 7,                       // 7:00 AM start
    endHour: 19,                        // 7:00 PM end (19:00)
    
    intervalMinutes: 20,                // 20 minutes between sessions
    photosPerCapture: 3,                // 3 photos per session
    captureQuality: 'medium',           // Balanced quality for efficiency
    
    enabled: true,                      // Enabled by default
    priority: 'normal',                 // Normal priority
    allowManualOverride: true,          // Allow manual captures
    
    maxConcurrentCaptures: 1,           // One session at a time
    retryPolicy: {
      maxAttempts: 3,                   // Retry failures 3 times
      retryDelayMs: 30000,              // 30 second delay between retries
      backoffMultiplier: 1.5            // Exponential backoff
    },
    
    storagePolicy: {
      compressionLevel: 'medium',       // Balanced compression
      retentionDays: 30,                // Keep for 30 days
      autoCleanup: true                 // Auto-cleanup old photos
    }
  } as ISchedulePeriod,

  /**
   * 💼 BUSINESS PARTNER: Nighttime Schedule (7 PM - 7 AM)
   * 
   * OPTIMIZED FOR:
   * - Enhanced surveillance monitoring
   * - Rapid emergency detection
   * - Critical behavior changes
   * - Safety and security oversight
   */
  nighttime: {
    name: 'Nighttime Surveillance',
    description: 'Enhanced monitoring for critical overnight surveillance',
    startHour: 19,                      // 7:00 PM start (19:00)
    endHour: 7,                         // 7:00 AM end (next day)
    
    intervalMinutes: 5,                 // 5 minutes between sessions (more frequent)
    photosPerCapture: 3,                // 3 photos per session
    captureQuality: 'high',             // Higher quality for better analysis
    
    enabled: true,                      // Enabled by default
    priority: 'high',                   // High priority for safety
    allowManualOverride: true,          // Allow emergency manual captures
    
    maxConcurrentCaptures: 1,           // One session at a time
    retryPolicy: {
      maxAttempts: 5,                   // More retries for critical period
      retryDelayMs: 15000,              // 15 second delay (faster retry)
      backoffMultiplier: 1.2            // Slower backoff for quick recovery
    },
    
    storagePolicy: {
      compressionLevel: 'low',          // Lower compression for quality
      retentionDays: 60,                // Keep longer for security
      autoCleanup: true                 // Auto-cleanup old photos
    }
  } as ISchedulePeriod,

  // ═══════════════════════════════════════════════════════════════════════
  // GLOBAL SCHEDULE SETTINGS
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Global schedule configuration
   * 
   * Master controls that apply to all scheduling operations
   * across both daytime and nighttime periods.
   */
  global: {
    // Master Controls
    enableScheduling: true,             // Master switch for all scheduling
    enableDemo: true,                   // Enable demo mode features
    demoAccountOnly: true,              // Restrict to demo accounts only
    
    // Transition Management
    transitionGracePeriod: 5,           // Minutes to allow for schedule transitions
    enableSmoothTransitions: true,      // Gradually adjust frequency during transitions
    logTransitions: true,               // Log schedule transitions for monitoring
    
    // Performance Management
    maxSystemLoad: 0.8,                 // Pause scheduling if system load > 80%
    enableLoadBalancing: true,          // Distribute captures to balance load
    prioritizeQuality: true,            // Prioritize quality over speed
    
    // Error Handling
    globalRetryLimit: 10,               // Maximum retries per hour
    enableCascadingFailure: true,       // Enable cascading failure detection
    emergencyShutdownThreshold: 20,     // Shutdown after 20 consecutive failures
    
    // Maintenance Windows
    maintenanceWindows: [               // Times when scheduling is disabled
      {
        name: 'Daily Maintenance',
        startHour: 2,                   // 2:00 AM
        endHour: 3,                     // 3:00 AM
        description: 'Daily system maintenance and optimization',
        enabled: false                  // Disabled by default
      }
    ],
    
    // Notification Settings
    notifications: {
      enableScheduleNotifications: false, // Notify on schedule events (disabled for demo)
      enableErrorNotifications: true,    // Notify on errors
      enableHealthNotifications: true,   // Notify on health issues
      notificationMethods: ['console']   // Console logging only for demo
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHEDULE OVERRIDE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Predefined schedule overrides
   * 
   * Common override scenarios that business partners can easily activate
   * for special circumstances, maintenance, or enhanced monitoring.
   */
  overrides: {
    
    /**
     * Enhanced Monitoring Override
     * Increases capture frequency for special surveillance needs
     */
    enhancedMonitoring: {
      id: 'enhanced_monitoring',
      name: 'Enhanced Monitoring Mode',
      description: 'Increased capture frequency for enhanced surveillance',
      
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      allDay: true,
      
      action: 'modify',
      modifiedSchedule: {
        intervalMinutes: 2,             // Capture every 2 minutes
        photosPerCapture: 5,            // 5 photos per session
        captureQuality: 'maximum',      // Maximum quality
        priority: 'critical'            // Critical priority
      },
      reason: 'Enhanced monitoring requested by business partner',
      
      notifyBeforeStart: true,
      notifyOnEnd: true,
      notificationMessage: 'Enhanced monitoring mode activated',
      
      autoActivate: false,              // Manual activation required
      recurring: false
    } as IScheduleOverride,

    /**
     * Maintenance Mode Override
     * Reduces or disables captures during maintenance periods
     */
    maintenanceMode: {
      id: 'maintenance_mode',
      name: 'Maintenance Mode',
      description: 'Reduced or disabled captures during maintenance',
      
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      allDay: false,
      specificHours: {
        start: 2,                       // 2:00 AM
        end: 4                          // 4:00 AM
      },
      
      action: 'pause',
      reason: 'System maintenance and updates',
      
      notifyBeforeStart: true,
      notifyOnEnd: true,
      notificationMessage: 'System entering maintenance mode',
      
      autoActivate: false,              // Manual activation required
      recurring: true,                  // Can be recurring
      recurringPattern: 'weekly'        // Weekly maintenance
    } as IScheduleOverride,

    /**
     * Demo Mode Override
     * Special settings optimized for business partner demonstrations
     */
    demoMode: {
      id: 'demo_mode',
      name: 'Business Partner Demo Mode',
      description: 'Optimized settings for business partner demonstrations',
      
      startDate: new Date(),
      endDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      allDay: true,
      
      action: 'modify',
      modifiedSchedule: {
        intervalMinutes: 1,             // Very frequent for demos (every 1 minute)
        photosPerCapture: 3,            // Standard 3 photos
        captureQuality: 'high',         // High quality for demo
        priority: 'high'                // High priority
      },
      reason: 'Business partner demonstration mode',
      
      notifyBeforeStart: true,
      notifyOnEnd: true,
      notificationMessage: 'Demo mode activated for business partner',
      
      autoActivate: false,              // Manual activation required
      recurring: false
    } as IScheduleOverride
  },

  // ═══════════════════════════════════════════════════════════════════════
  // HEALTH MONITORING CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Schedule health monitoring
   * 
   * Comprehensive monitoring of schedule performance, reliability,
   * and system health to ensure optimal operation.
   */
  health: {
    thresholds: {
      maxConsecutiveFailures: 5,        // Alert after 5 consecutive failures
      minSuccessRate: 0.85,             // Minimum 85% success rate
      maxAverageResponseTime: 30000,    // Maximum 30 second response time
      maxStorageUsage: 40 * 1024 * 1024 // Alert at 40MB storage usage
    },
    
    healthChecks: {
      frequencyMinutes: 15,             // Check health every 15 minutes
      enableDetailedLogging: true,      // Log detailed health information
      enableAlerts: true,               // Send health alerts
      alertMethods: ['console', 'storage'] // Log to console and storage
    },
    
    performance: {
      trackCaptureTime: true,           // Track capture performance
      trackStorageTime: true,           // Track storage performance
      trackQualityMetrics: true,        // Track photo quality trends
      enableTrendAnalysis: true         // Analyze performance trends
    },
    
    recovery: {
      enableAutoRecovery: true,         // Enable automatic recovery
      recoveryActions: ['restart', 'reduce_frequency'], // Recovery strategies
      recoveryDelayMinutes: 5,          // Wait 5 minutes before recovery
      maxRecoveryAttempts: 3            // Maximum 3 recovery attempts
    }
  } as IScheduleHealthConfig,

  // ═══════════════════════════════════════════════════════════════════════
  // TIMEZONE AND LOCALIZATION
  // ═══════════════════════════════════════════════════════════════════════
  
  /**
   * 💼 BUSINESS PARTNER: Timezone and localization settings
   */
  localization: {
    timezone: 'auto',                   // Automatically detect timezone
    dateFormat: 'MM/DD/YYYY',           // US date format
    timeFormat: '12h',                  // 12-hour time format
    firstDayOfWeek: 'sunday',           // Week starts on Sunday
    
    // Schedule Display Names
    displayNames: {
      daytime: 'Daytime Monitoring',
      nighttime: 'Nighttime Surveillance',
      maintenance: 'Maintenance Mode',
      enhanced: 'Enhanced Monitoring',
      demo: 'Demo Mode'
    },
    
    // Time Period Descriptions
    descriptions: {
      daytime: 'Regular monitoring during normal activity hours (7 AM - 7 PM)',
      nighttime: 'Enhanced surveillance during overnight hours (7 PM - 7 AM)',
      transition: 'Transitioning between schedule periods'
    }
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CONFIGURATION METADATA
  // ═══════════════════════════════════════════════════════════════════════
  
  metadata: {
    version: '2.0.0',                   // Configuration version
    lastUpdated: '2025-01-15',          // Last update date
    author: 'One Barn Development Team',
    description: 'Complete scheduling configuration for AI photo capture system',
    
    // Validation Rules
    validation: {
      requirePositiveIntervals: true,   // Intervals must be > 0
      requireValidHours: true,          // Hours must be 0-23
      requireValidPriorities: true,     // Priorities must be valid values
      maxPhotosPerCapture: 10,          // Maximum 10 photos per session
      minPhotosPerCapture: 1            // Minimum 1 photo per session
    }
  }
};

// ============================================================================
// HELPER FUNCTIONS FOR BUSINESS PARTNERS
// ============================================================================

/**
 * 💼 BUSINESS PARTNER: Get current active schedule
 * 
 * Determines which schedule period is currently active based on the time.
 * Accounts for schedule overrides and maintenance windows.
 */
export const getCurrentSchedule = (): 'daytime' | 'nighttime' | 'maintenance' | 'override' => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Check for active overrides first
  const activeOverride = getActiveOverride(now);
  if (activeOverride) {
    return 'override';
  }
  
  // Check for maintenance windows
  const inMaintenance = scheduleConfig.global.maintenanceWindows.some(window => 
    window.enabled && currentHour >= window.startHour && currentHour < window.endHour
  );
  
  if (inMaintenance) {
    return 'maintenance';
  }
  
  // Determine daytime vs nighttime
  const daytimeStart = scheduleConfig.daytime.startHour;
  const daytimeEnd = scheduleConfig.daytime.endHour;
  
  if (currentHour >= daytimeStart && currentHour < daytimeEnd) {
    return 'daytime';
  } else {
    return 'nighttime';
  }
};

/**
 * 💼 BUSINESS PARTNER: Get active schedule override
 */
export const getActiveOverride = (date: Date = new Date()): IScheduleOverride | null => {
  for (const override of Object.values(scheduleConfig.overrides)) {
    if (date >= override.startDate && date <= override.endDate) {
      if (override.allDay) {
        return override;
      } else if (override.specificHours) {
        const hour = date.getHours();
        if (hour >= override.specificHours.start && hour < override.specificHours.end) {
          return override;
        }
      }
    }
  }
  return null;
};

/**
 * 💼 BUSINESS PARTNER: Calculate next capture time
 */
export const getNextCaptureTime = (): Date => {
  const now = new Date();
  const currentSchedule = getCurrentSchedule();
  
  let intervalMinutes: number;
  
  switch (currentSchedule) {
    case 'daytime':
      intervalMinutes = scheduleConfig.daytime.intervalMinutes;
      break;
    case 'nighttime':
      intervalMinutes = scheduleConfig.nighttime.intervalMinutes;
      break;
    case 'override':
      const activeOverride = getActiveOverride(now);
      intervalMinutes = activeOverride?.modifiedSchedule?.intervalMinutes || 
                       scheduleConfig.daytime.intervalMinutes;
      break;
    case 'maintenance':
      // During maintenance, next capture is when maintenance ends
      const maintenanceWindow = scheduleConfig.global.maintenanceWindows.find(w => w.enabled);
      if (maintenanceWindow) {
        const nextCapture = new Date(now);
        nextCapture.setHours(maintenanceWindow.endHour, 0, 0, 0);
        if (nextCapture <= now) {
          nextCapture.setDate(nextCapture.getDate() + 1);
        }
        return nextCapture;
      }
      intervalMinutes = scheduleConfig.daytime.intervalMinutes;
      break;
    default:
      intervalMinutes = scheduleConfig.daytime.intervalMinutes;
  }
  
  return new Date(now.getTime() + (intervalMinutes * 60 * 1000));
};

/**
 * 💼 BUSINESS PARTNER: Get schedule configuration for current period
 */
export const getCurrentScheduleConfig = (): ISchedulePeriod => {
  const currentSchedule = getCurrentSchedule();
  
  switch (currentSchedule) {
    case 'daytime':
      return scheduleConfig.daytime;
    case 'nighttime':
      return scheduleConfig.nighttime;
    case 'override':
      const activeOverride = getActiveOverride();
      if (activeOverride && activeOverride.modifiedSchedule) {
        // Merge override settings with base schedule
        const baseSchedule = getCurrentSchedule() === 'daytime' ? 
                             scheduleConfig.daytime : scheduleConfig.nighttime;
        return { ...baseSchedule, ...activeOverride.modifiedSchedule };
      }
      return scheduleConfig.daytime;
    case 'maintenance':
      // Return a disabled schedule during maintenance
      return {
        ...scheduleConfig.daytime,
        enabled: false,
        intervalMinutes: 0
      };
    default:
      return scheduleConfig.daytime;
  }
};

/**
 * 💼 BUSINESS PARTNER: Validate schedule configuration
 */
export const validateScheduleConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Validate daytime schedule
  if (scheduleConfig.daytime.intervalMinutes <= 0) {
    errors.push('Daytime interval must be greater than 0');
  }
  
  if (scheduleConfig.daytime.photosPerCapture < 1 || 
      scheduleConfig.daytime.photosPerCapture > 10) {
    errors.push('Daytime photos per capture must be between 1 and 10');
  }
  
  // Validate nighttime schedule
  if (scheduleConfig.nighttime.intervalMinutes <= 0) {
    errors.push('Nighttime interval must be greater than 0');
  }
  
  if (scheduleConfig.nighttime.photosPerCapture < 1 || 
      scheduleConfig.nighttime.photosPerCapture > 10) {
    errors.push('Nighttime photos per capture must be between 1 and 10');
  }
  
  // Validate hours
  if (scheduleConfig.daytime.startHour < 0 || scheduleConfig.daytime.startHour > 23) {
    errors.push('Daytime start hour must be between 0 and 23');
  }
  
  if (scheduleConfig.daytime.endHour < 0 || scheduleConfig.daytime.endHour > 23) {
    errors.push('Daytime end hour must be between 0 and 23');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * 💼 BUSINESS PARTNER: Get schedule statistics
 */
export const getScheduleStatistics = () => {
  const now = new Date();
  const currentSchedule = getCurrentSchedule();
  const nextCapture = getNextCaptureTime();
  const timeUntilNext = Math.max(0, nextCapture.getTime() - now.getTime());
  
  return {
    currentSchedule,
    nextCaptureTime: nextCapture,
    minutesUntilNext: Math.floor(timeUntilNext / (60 * 1000)),
    activeOverride: getActiveOverride(),
    schedulingEnabled: scheduleConfig.global.enableScheduling,
    
    // Daily statistics
    dailyCaptures: {
      daytime: Math.floor((12 * 60) / scheduleConfig.daytime.intervalMinutes), // 12 hours
      nighttime: Math.floor((12 * 60) / scheduleConfig.nighttime.intervalMinutes), // 12 hours
      total: Math.floor((12 * 60) / scheduleConfig.daytime.intervalMinutes) + 
             Math.floor((12 * 60) / scheduleConfig.nighttime.intervalMinutes)
    },
    
    // Photo statistics
    dailyPhotos: {
      daytime: Math.floor((12 * 60) / scheduleConfig.daytime.intervalMinutes) * 
               scheduleConfig.daytime.photosPerCapture,
      nighttime: Math.floor((12 * 60) / scheduleConfig.nighttime.intervalMinutes) * 
                 scheduleConfig.nighttime.photosPerCapture,
      total: (Math.floor((12 * 60) / scheduleConfig.daytime.intervalMinutes) * 
              scheduleConfig.daytime.photosPerCapture) +
             (Math.floor((12 * 60) / scheduleConfig.nighttime.intervalMinutes) * 
              scheduleConfig.nighttime.photosPerCapture)
    }
  };
};

export default scheduleConfig; 