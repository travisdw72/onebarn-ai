import type { IAIMonitorConfig } from '../interfaces/config/aiMonitorConfig.interface';
import { brandConfig } from './brandConfig';

export const aiMonitorConfig: IAIMonitorConfig = {
  // Dashboard Settings
  dashboard: {
    title: "AI Monitoring Dashboard",
    subtitle: "Real-time AI-powered horse monitoring and alerts",
    refreshInterval: 30000, // 30 seconds
    autoRefresh: true,
    maxAlertsDisplay: 5,
    enableFiltering: true,
    enableTimeControls: true,
    gridSettings: {
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4
      },
      spacing: 2,
      containerSpacing: 3
    },
    layout: {
      headerHeight: '64px',
      sidebarWidth: '280px',
      contentPadding: '24px',
      cardMinHeight: '320px',
      maxWidth: '1440px'
    },
    defaultView: 'grid',
    maxAlerts: 1000,
    pagination: {
      defaultPageSize: 25,
      pageSizeOptions: [10, 25, 50, 100],
      showSizeChanger: true,
      showQuickJumper: true
    }
  },

  // Layout Configuration
  layout: {
    header: {
      height: brandConfig.layout.headerHeight,
      padding: brandConfig.layout.containerPadding,
      backgroundColor: brandConfig.colors.arenaSand,
      borderBottom: `2px solid ${brandConfig.colors.stableMahogany}20`
    },
    grid: {
      spacing: 3,
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4
      }
    },
    alertSummary: {
      marginBottom: '2rem',
      padding: '1.5rem',
      borderRadius: brandConfig.layout.borderRadius
    },
    monitoringCards: {
      minHeight: '300px',
      padding: '1rem'
    }
  },

  // Alert Configuration
  alerts: {
    severityLevels: {
      emergency: {
        id: 'emergency',
        label: 'Emergency',
        description: 'Immediate veterinary attention required',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderColor: '#d32f2f',
        icon: 'emergency',
        weight: 100,
        autoEscalateMinutes: 5,
        requiresImmediate: true,
        soundAlert: true
      },
      critical: {
        id: 'critical',
        label: 'Critical',
        description: 'Urgent attention needed within 30 minutes',
        color: '#f57c00',
        backgroundColor: '#fff3e0',
        borderColor: '#f57c00',
        icon: 'warning',
        weight: 80,
        autoEscalateMinutes: 30,
        requiresImmediate: true,
        soundAlert: true
      },
      warning: {
        id: 'warning',
        label: 'Warning',
        description: 'Concerning pattern detected - monitor closely',
        color: '#fbc02d',
        backgroundColor: '#fffde7',
        borderColor: '#fbc02d',
        icon: 'warning_amber',
        weight: 60,
        autoEscalateMinutes: 120,
        requiresImmediate: false,
        soundAlert: false
      },
      info: {
        id: 'info',
        label: 'Information',
        description: 'Notable behavior or metric change',
        color: '#1976d2',
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2',
        icon: 'info',
        weight: 40,
        requiresImmediate: false,
        soundAlert: false
      },
      normal: {
        id: 'normal',
        label: 'Normal',
        description: 'All parameters within normal range',
        color: '#388e3c',
        backgroundColor: '#e8f5e8',
        borderColor: '#388e3c',
        icon: 'check_circle',
        weight: 20,
        requiresImmediate: false,
        soundAlert: false
      }
    },
    priorities: {
      high: {
        id: 'high',
        label: 'High Priority',
        description: 'Requires immediate attention',
        color: '#d32f2f',
        weight: 90,
        responseTimeMinutes: 15
      },
      medium: {
        id: 'medium',
        label: 'Medium Priority',
        description: 'Attention needed within 2 hours',
        color: '#f57c00',
        weight: 60,
        responseTimeMinutes: 120
      },
      low: {
        id: 'low',
        label: 'Low Priority',
        description: 'Review within 24 hours',
        color: '#1976d2',
        weight: 30,
        responseTimeMinutes: 1440
      }
    },
    statuses: {
      new: {
        id: 'new',
        label: 'New',
        description: 'Alert just received, awaiting review',
        color: '#1976d2',
        icon: 'fiber_new',
        allowedTransitions: ['acknowledged', 'escalated', 'resolved']
      },
      acknowledged: {
        id: 'acknowledged',
        label: 'Acknowledged',
        description: 'Alert has been reviewed and is being addressed',
        color: '#f57c00',
        icon: 'thumb_up',
        allowedTransitions: ['escalated', 'resolved', 'investigating']
      },
      investigating: {
        id: 'investigating',
        label: 'Investigating',
        description: 'Currently investigating the alert',
        color: '#9c27b0',
        icon: 'search',
        allowedTransitions: ['escalated', 'resolved', 'acknowledged']
      },
      escalated: {
        id: 'escalated',
        label: 'Escalated',
        description: 'Alert has been escalated to higher authority',
        color: '#d32f2f',
        icon: 'trending_up',
        allowedTransitions: ['resolved', 'investigating']
      },
      resolved: {
        id: 'resolved',
        label: 'Resolved',
        description: 'Alert has been addressed and resolved',
        color: '#388e3c',
        icon: 'check_circle',
        allowedTransitions: []
      },
      false_positive: {
        id: 'false_positive',
        label: 'False Positive',
        description: 'Alert determined to be false positive',
        color: '#757575',
        icon: 'cancel',
        allowedTransitions: []
      }
    },
    acknowledgment: {
      enabled: true,
      requiresComment: true,
      commentMinLength: 10,
      autoAcknowledgeAfterMinutes: 240,
      allowBulkAcknowledge: true
    },
    escalation: {
      enabled: true,
      levels: [
        {
          id: 'level1',
          label: 'Primary Trainer',
          description: 'Horse\'s primary trainer',
          requiredRoles: ['trainer', 'senior_trainer'],
          notificationMethods: ['push', 'sms'],
          timeoutMinutes: 30
        },
        {
          id: 'level2',
          label: 'Senior Staff',
          description: 'Senior training staff and supervisors',
          requiredRoles: ['senior_trainer', 'supervisor'],
          notificationMethods: ['push', 'sms', 'call'],
          timeoutMinutes: 60
        },
        {
          id: 'level3',
          label: 'Veterinary Team',
          description: 'On-site veterinary professionals',
          requiredRoles: ['veterinarian', 'vet_tech'],
          notificationMethods: ['push', 'sms', 'call', 'email'],
          timeoutMinutes: 15
        },
        {
          id: 'level4',
          label: 'Emergency Response',
          description: 'Emergency veterinary and management team',
          requiredRoles: ['emergency_vet', 'facility_manager', 'owner'],
          notificationMethods: ['call', 'sms', 'push'],
          timeoutMinutes: 5
        }
      ],
      automaticRules: [
        {
          id: 'emergency_auto',
          condition: 'severity === "emergency"',
          triggerAfterMinutes: 5,
          escalateToLevel: 'level3',
          requiresApproval: false
        },
        {
          id: 'critical_auto',
          condition: 'severity === "critical" && !acknowledged',
          triggerAfterMinutes: 30,
          escalateToLevel: 'level2',
          requiresApproval: false
        }
      ]
    },
    categories: {
      vitals: {
        id: 'vitals',
        label: 'Vital Signs',
        description: 'Heart rate, respiratory rate, temperature monitoring',
        icon: 'favorite',
        color: '#e91e63',
        monitoringTypes: ['heart_rate', 'respiratory_rate', 'temperature', 'blood_pressure'],
        defaultFilters: { type: 'vitals' }
      },
      behavior: {
        id: 'behavior',
        label: 'Behavior Analysis',
        description: 'Behavioral patterns and anomaly detection',
        icon: 'psychology',
        color: '#9c27b0',
        monitoringTypes: ['activity_level', 'stress_indicators', 'social_behavior', 'feeding_behavior'],
        defaultFilters: { type: 'behavior' }
      },
      movement: {
        id: 'movement',
        label: 'Movement & Gait',
        description: 'Locomotion analysis and lameness detection',
        icon: 'directions_walk',
        color: '#2196f3',
        monitoringTypes: ['gait_analysis', 'lameness_detection', 'activity_tracking', 'stride_analysis'],
        defaultFilters: { type: 'movement' }
      },
      social: {
        id: 'social',
        label: 'Social Interactions',
        description: 'Herd dynamics and social behavior monitoring',
        icon: 'groups',
        color: '#4caf50',
        monitoringTypes: ['herd_position', 'social_rank', 'interaction_frequency', 'isolation_detection'],
        defaultFilters: { type: 'social' }
      },
      environmental: {
        id: 'environmental',
        label: 'Environmental Factors',
        description: 'Weather, air quality, and facility conditions',
        icon: 'eco',
        color: '#795548',
        monitoringTypes: ['temperature', 'humidity', 'air_quality', 'noise_level'],
        defaultFilters: { type: 'environmental' }
      },
      training: {
        id: 'training',
        label: 'Training Performance',
        description: 'Training metrics and performance analysis',
        icon: 'fitness_center',
        color: '#ff5722',
        monitoringTypes: ['performance_metrics', 'fatigue_indicators', 'skill_progression', 'recovery_rate'],
        defaultFilters: { type: 'training' }
      }
    }
  },

  // Monitoring Sections Configuration
  monitoring: {
    sections: {
      vitals: {
        id: 'vitals',
        label: 'Vital Signs Monitoring',
        description: 'Continuous monitoring of critical health parameters',
        icon: 'monitor_heart',
        color: '#e91e63',
        enabled: true,
        metrics: [
          {
            id: 'heart_rate',
            label: 'Heart Rate',
            description: 'Beats per minute',
            unit: 'bpm',
            type: 'number',
            thresholds: [
              { level: 'normal', min: 28, max: 44, message: 'Heart rate normal', action: 'none' },
              { level: 'warning', min: 20, max: 60, message: 'Heart rate elevated', action: 'alert' },
              { level: 'critical', min: 15, max: 80, message: 'Heart rate critically abnormal', action: 'escalate' }
            ],
            visualization: 'line',
            format: '0.0'
          },
          {
            id: 'respiratory_rate',
            label: 'Respiratory Rate',
            description: 'Breaths per minute',
            unit: 'bpm',
            type: 'number',
            thresholds: [
              { level: 'normal', min: 8, max: 16, message: 'Respiratory rate normal', action: 'none' },
              { level: 'warning', min: 5, max: 24, message: 'Respiratory rate abnormal', action: 'alert' },
              { level: 'critical', min: 0, max: 40, message: 'Respiratory distress', action: 'emergency' }
            ],
            visualization: 'line',
            format: '0.0'
          }
        ],
        refreshIntervalSeconds: 30,
        historicalDataDays: 30,
        alertRules: [
          {
            id: 'hr_spike',
            name: 'Heart Rate Spike',
            description: 'Sudden increase in heart rate',
            condition: 'heart_rate > baseline * 1.5',
            severity: 'warning',
            enabled: true,
            cooldownMinutes: 15,
            dependencies: []
          }
        ]
      },
      behavior: {
        id: 'behavior',
        label: 'Behavioral Analysis',
        description: 'AI-powered behavior pattern recognition',
        icon: 'psychology',
        color: '#9c27b0',
        enabled: true,
        metrics: [
          {
            id: 'stress_level',
            label: 'Stress Level',
            description: 'Computed stress indicator',
            unit: '%',
            type: 'percentage',
            thresholds: [
              { level: 'normal', max: 25, message: 'Low stress level', action: 'none' },
              { level: 'warning', max: 60, message: 'Elevated stress detected', action: 'alert' },
              { level: 'critical', max: 100, message: 'High stress - intervention needed', action: 'escalate' }
            ],
            visualization: 'gauge',
            format: '0.0%'
          }
        ],
        refreshIntervalSeconds: 60,
        historicalDataDays: 14,
        alertRules: []
      }
    },
    aiProviders: {
      primary: {
        id: 'primary',
        name: 'Primary AI Engine',
        description: 'Main AI monitoring and analysis system',
        enabled: true,
        apiEndpoint: '/api/v1/ai/monitoring',
        confidence: {
          minimumThreshold: 0.7,
          warningThreshold: 0.8,
          optimalThreshold: 0.9,
          displayFormat: '0.0%'
        },
        modelVersion: '2.1.0',
        capabilities: ['vitals', 'behavior', 'movement', 'prediction'],
        rateLimit: {
          requestsPerMinute: 100,
          burstLimit: 20,
          retryDelaySeconds: 5
        }
      }
    },
    thresholds: {
      vitals: {
        heart_rate: {
          normal: { min: 28, max: 44 },
          warning: { min: 20, max: 60 },
          critical: { min: 15, max: 80 },
          unit: 'bpm',
          alertDelay: 30
        },
        temperature: {
          normal: { min: 99.0, max: 101.5 },
          warning: { min: 98.0, max: 102.5 },
          critical: { min: 96.0, max: 104.0 },
          unit: '°F',
          alertDelay: 60
        }
      },
      behavior: {
        stress: {
          normalRange: ['calm', 'relaxed', 'alert'],
          concerningBehaviors: ['restless', 'agitated', 'withdrawn'],
          criticalBehaviors: ['panic', 'aggression', 'collapse'],
          durationMinutes: 15,
          frequencyThreshold: 3
        }
      },
      movement: {
        activity: {
          normalActivity: { min: 30, max: 70 },
          lowActivity: { threshold: 20, durationMinutes: 120 },
          highActivity: { threshold: 80, durationMinutes: 60 },
          immobilityAlert: { minutes: 240 }
        }
      },
      social: {
        interaction: {
          isolationAlert: { minutes: 360 },
          aggressionScore: { threshold: 7 },
          groupDynamics: ['leader', 'follower', 'neutral', 'submissive']
        }
      }
    },
    dataRetention: {
      alertsMonths: 12,
      metricsMonths: 6,
      logsMonths: 3,
      archiveAfterMonths: 24,
      purgeAfterYears: 7
    }
  },

  // Filters Configuration
  filters: {
    timeRange: {
      default: "24h",
      options: [
        { value: "1h", label: "Last Hour" },
        { value: "6h", label: "Last 6 Hours" },
        { value: "24h", label: "Last 24 Hours" },
        { value: "7d", label: "Last Week" },
        { value: "30d", label: "Last Month" }
      ]
    },
    severity: {
      options: [
        { value: "all", label: "All Severities" },
        { value: "critical", label: "Critical Only" },
        { value: "warning", label: "Warning & Above" },
        { value: "info", label: "Info & Above" }
      ]
    },
    category: {
      options: [
        { value: "all", label: "All Categories" },
        { value: "health", label: "Health" },
        { value: "behavior", label: "Behavior" },
        { value: "activity", label: "Activity" },
        { value: "social", label: "Social" },
        { value: "environment", label: "Environment" }
      ]
    }
  },

  // Visualization Settings
  visualization: {
    charts: {
      defaultHeight: 250,
      animationDuration: 750,
      gridLines: true,
      showLegend: true,
      responsive: true,
      maintainAspectRatio: false
    },
    colors: {
      primary: brandConfig.colors.stableMahogany,
      secondary: brandConfig.colors.ribbonBlue,
      success: brandConfig.colors.successGreen,
      warning: brandConfig.colors.alertAmber,
      error: brandConfig.colors.errorRed,
      info: brandConfig.colors.infoBlue,
      gradient: [
        brandConfig.colors.stableMahogany,
        brandConfig.colors.chestnutGlow,
        brandConfig.colors.championGold,
        brandConfig.colors.pastureSage
      ]
    }
  },

  // Real-time Settings
  realtime: {
    websocketEnabled: true,
    fallbackPolling: true,
    pollingInterval: 30000,
    reconnectAttempts: 5,
    reconnectDelay: 2000,
    heartbeatInterval: 25000
  },

  // Notification Settings
  notifications: {
    enabled: true,
    position: "top-right",
    autoHide: false,
    criticalTimeout: 0, // Never auto-hide critical
    warningTimeout: 10000,
    infoTimeout: 5000,
    maxVisible: 3
  },

  // Card Configuration
  cards: {
    alert: {
      borderRadius: brandConfig.layout.borderRadius,
      padding: {
        header: '1rem',
        content: '1.5rem',
        actions: '1rem'
      },
      elevation: 2,
      maxWidth: '400px'
    },
    monitoring: {
      borderRadius: brandConfig.layout.borderRadius,
      padding: {
        header: '1rem',
        content: '1.5rem'
      },
      elevation: 1,
      headerHeight: '60px'
    }
  },

  // Text Content
  text: {
    headers: {
      dashboard: "AI Monitoring Dashboard",
      activeAlerts: "Active Alerts",
      alertSummary: "Alert Summary",
      monitoringGrid: "Real-time Monitoring"
    },
    messages: {
      noAlerts: "No active alerts at this time",
      loadingAlerts: "Loading alerts...",
      errorLoadingAlerts: "Error loading alerts",
      noData: "No monitoring data available",
      connecting: "Connecting to monitoring system...",
      disconnected: "Connection lost - attempting to reconnect"
    },
    buttons: {
      refresh: "Refresh",
      acknowledge: "Acknowledge",
      viewAll: "View All",
      filter: "Filter",
      export: "Export",
      fullscreen: "Fullscreen"
    },
    tooltips: {
      refresh: "Refresh monitoring data",
      acknowledge: "Mark alert as acknowledged",
      viewDetails: "View detailed information",
      filter: "Filter alerts and data",
      timeRange: "Select time range for data display"
    }
  }
};

// Helper functions
export const getAlertSeverityConfig = (severity: string) => {
  return aiMonitorConfig.alerts.severityLevels[severity as keyof typeof aiMonitorConfig.alerts.severityLevels] || 
         aiMonitorConfig.alerts.severityLevels.info;
};

export const getMonitoringSectionConfig = (section: string) => {
  return aiMonitorConfig.monitoring.sections[section as keyof typeof aiMonitorConfig.monitoring.sections];
};

export const getAlertTemplateConfig = (template: string) => {
  return aiMonitorConfig.alerts.templates[template as keyof typeof aiMonitorConfig.alerts.templates];
}; 