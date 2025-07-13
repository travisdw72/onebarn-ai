import { IAIMonitorConfig } from './aiMonitorConfig.interface';

export const aiMonitorConfig: IAIMonitorConfig = {
  dashboard: {
    layout: {
      columns: 3,
      mobileColumns: 1,
      tabletColumns: 2,
      gridSpacing: 2,
      cardMinHeight: 200,
      cardMaxHeight: 600,
      headerHeight: 64,
      footerHeight: 48
    },
    refreshInterval: 30000, // 30 seconds
    maxAlertsDisplay: 50,
    defaultView: 'grid',
    autoRefresh: true,
    compactMode: false,
    themes: [
      {
        id: 'light',
        name: 'Light Mode',
        primary: '#8B4513',
        secondary: '#2C5530',
        background: '#F5F2E8',
        surface: '#FFFFFF',
        error: '#D32F2F',
        warning: '#FF9800',
        success: '#4CAF50',
        info: '#2196F3'
      },
      {
        id: 'dark',
        name: 'Dark Mode',
        primary: '#D2691E',
        secondary: '#90EE90',
        background: '#121212',
        surface: '#1E1E1E',
        error: '#F44336',
        warning: '#FFC107',
        success: '#4CAF50',
        info: '#2196F3'
      }
    ]
  },

  alerts: {
    severityLevels: [
      {
        id: 'critical',
        name: 'Critical',
        level: 4,
        color: '#D32F2F',
        backgroundColor: '#FFEBEE',
        borderColor: '#F44336',
        icon: 'report_problem',
        description: 'Immediate attention required - potential life-threatening situation',
        autoEscalateMinutes: 5,
        requiresAcknowledgment: true,
        notificationChannels: ['email', 'sms', 'push', 'phone']
      },
      {
        id: 'high',
        name: 'High',
        level: 3,
        color: '#FF9800',
        backgroundColor: '#FFF3E0',
        borderColor: '#FF9800',
        icon: 'warning',
        description: 'Urgent attention needed within 15 minutes',
        autoEscalateMinutes: 15,
        requiresAcknowledgment: true,
        notificationChannels: ['email', 'sms', 'push']
      },
      {
        id: 'medium',
        name: 'Medium',
        level: 2,
        color: '#FFC107',
        backgroundColor: '#FFFDE7',
        borderColor: '#FFC107',
        icon: 'info',
        description: 'Moderate concern - address within 1 hour',
        autoEscalateMinutes: 60,
        requiresAcknowledgment: false,
        notificationChannels: ['email', 'push']
      },
      {
        id: 'low',
        name: 'Low',
        level: 1,
        color: '#4CAF50',
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
        icon: 'check_circle',
        description: 'Informational - review when convenient',
        requiresAcknowledgment: false,
        notificationChannels: ['email']
      }
    ],

    categories: [
      {
        id: 'vitals',
        name: 'Vital Signs',
        description: 'Heart rate, temperature, respiratory monitoring',
        icon: 'favorite',
        color: '#E91E63',
        defaultSeverity: 'high',
        monitoringTypes: ['heartRate', 'temperature', 'respiratory'],
        keywords: ['heart', 'pulse', 'temperature', 'breathing', 'fever']
      },
      {
        id: 'behavior',
        name: 'Behavioral',
        description: 'Unusual behavior patterns and anomalies',
        icon: 'psychology',
        color: '#9C27B0',
        defaultSeverity: 'medium',
        monitoringTypes: ['activity', 'feeding', 'social', 'stress'],
        keywords: ['behavior', 'activity', 'stress', 'aggression', 'feeding']
      },
      {
        id: 'movement',
        name: 'Movement & Gait',
        description: 'Mobility issues, lameness, and movement patterns',
        icon: 'directions_walk',
        color: '#3F51B5',
        defaultSeverity: 'medium',
        monitoringTypes: ['gait', 'mobility', 'location', 'exercise'],
        keywords: ['gait', 'lameness', 'movement', 'walking', 'exercise']
      },
      {
        id: 'social',
        name: 'Social Interactions',
        description: 'Herd dynamics and social behavior monitoring',
        icon: 'groups',
        color: '#009688',
        defaultSeverity: 'low',
        monitoringTypes: ['interaction', 'hierarchy', 'compatibility'],
        keywords: ['social', 'herd', 'interaction', 'dominance', 'isolation']
      },
      {
        id: 'environment',
        name: 'Environmental',
        description: 'Environmental conditions and facility alerts',
        icon: 'eco',
        color: '#4CAF50',
        defaultSeverity: 'medium',
        monitoringTypes: ['temperature', 'humidity', 'air_quality', 'lighting'],
        keywords: ['environment', 'temperature', 'humidity', 'air', 'lighting']
      }
    ],

    actions: [
      {
        id: 'acknowledge',
        name: 'Acknowledge',
        description: 'Mark alert as seen and being handled',
        icon: 'check',
        color: '#4CAF50',
        requiredPermissions: ['alerts:acknowledge'],
        confirmationRequired: false,
        auditLevel: 'basic'
      },
      {
        id: 'escalate',
        name: 'Escalate',
        description: 'Escalate to higher authority or specialist',
        icon: 'keyboard_arrow_up',
        color: '#FF9800',
        requiredPermissions: ['alerts:escalate'],
        confirmationRequired: true,
        auditLevel: 'detailed'
      },
      {
        id: 'resolve',
        name: 'Resolve',
        description: 'Mark alert as resolved with notes',
        icon: 'check_circle',
        color: '#4CAF50',
        requiredPermissions: ['alerts:resolve'],
        confirmationRequired: true,
        auditLevel: 'detailed'
      },
      {
        id: 'assign',
        name: 'Assign',
        description: 'Assign alert to specific team member',
        icon: 'person_add',
        color: '#2196F3',
        requiredPermissions: ['alerts:assign'],
        confirmationRequired: false,
        auditLevel: 'basic'
      }
    ],

    escalation: {
      rules: [
        {
          id: 'critical_auto',
          name: 'Critical Auto-Escalation',
          conditions: [
            { field: 'severity', operator: 'eq', value: 'critical' },
            { field: 'acknowledged', operator: 'eq', value: false }
          ],
          actions: [
            { type: 'notify', target: 'veterinarian_oncall', parameters: { channel: 'phone' } },
            { type: 'escalate', target: 'manager', parameters: { delay: 300 } }
          ],
          delay: 300, // 5 minutes
          repeat: true,
          repeatInterval: 600 // 10 minutes
        }
      ],
      contacts: [
        {
          id: 'veterinarian_oncall',
          name: 'On-Call Veterinarian',
          email: 'oncall@veterinary.example.com',
          phone: '+1234567890',
          role: 'veterinarian',
          department: 'medical',
          notificationPreferences: [
            { channel: 'phone', severity: ['critical'], enabled: true },
            { channel: 'sms', severity: ['critical', 'high'], enabled: true }
          ]
        }
      ],
      templates: [
        {
          id: 'critical_alert',
          name: 'Critical Alert Notification',
          subject: 'CRITICAL: {{ horse.name }} - {{ alert.category }}',
          body: 'Critical alert for {{ horse.name }}: {{ alert.description }}. Immediate attention required.',
          variables: ['horse.name', 'alert.category', 'alert.description', 'alert.timestamp'],
          channels: ['email', 'sms']
        }
      ]
    },

    retention: {
      policies: [
        { alertType: 'critical', severity: 'critical', retentionDays: 2555, archiveAfterDays: 365, compressionEnabled: true },
        { alertType: 'standard', severity: 'high', retentionDays: 1095, archiveAfterDays: 180, compressionEnabled: true },
        { alertType: 'standard', severity: 'medium', retentionDays: 365, archiveAfterDays: 90, compressionEnabled: true },
        { alertType: 'standard', severity: 'low', retentionDays: 90, compressionEnabled: false }
      ],
      archival: {
        enabled: true,
        storage: 'local',
        compression: 'gzip',
        encryption: true,
        indexing: true
      },
      purging: {
        enabled: true,
        schedule: '0 2 * * 0', // Weekly at 2 AM
        batchSize: 1000,
        confirmationRequired: true,
        auditRetentionDays: 2555
      }
    },

    filtering: {
      quick: [
        { id: 'unacknowledged', name: 'Unacknowledged', field: 'acknowledged', operator: 'eq', value: false, icon: 'notifications', color: '#FF9800' },
        { id: 'critical', name: 'Critical', field: 'severity', operator: 'eq', value: 'critical', icon: 'report_problem', color: '#D32F2F' },
        { id: 'today', name: 'Today', field: 'timestamp', operator: 'gte', value: 'today', icon: 'today', color: '#2196F3' }
      ],
      advanced: [
        {
          id: 'severity',
          name: 'Severity Level',
          type: 'multiselect',
          field: 'severity',
          options: [
            { value: 'critical', label: 'Critical', color: '#D32F2F' },
            { value: 'high', label: 'High', color: '#FF9800' },
            { value: 'medium', label: 'Medium', color: '#FFC107' },
            { value: 'low', label: 'Low', color: '#4CAF50' }
          ]
        },
        {
          id: 'category',
          name: 'Alert Category',
          type: 'multiselect',
          field: 'category',
          options: [
            { value: 'vitals', label: 'Vital Signs', icon: 'favorite' },
            { value: 'behavior', label: 'Behavioral', icon: 'psychology' },
            { value: 'movement', label: 'Movement & Gait', icon: 'directions_walk' }
          ]
        },
        {
          id: 'timeRange',
          name: 'Time Range',
          type: 'range',
          field: 'timestamp',
          validation: { required: false }
        }
      ],
      saved: [],
      defaults: {
        severity: ['critical', 'high', 'medium'],
        timeRange: '24h',
        categories: [],
        status: ['open', 'acknowledged'],
        maxResults: 50
      }
    }
  },

  monitoring: {
    sections: [
      {
        id: 'vitals',
        name: 'Vital Signs Monitoring',
        description: 'Real-time monitoring of horse vital signs',
        icon: 'favorite',
        color: '#E91E63',
        enabled: true,
        metrics: [
          { id: 'heartRate', name: 'Heart Rate', unit: 'bpm', type: 'numeric', range: { min: 20, max: 80 }, precision: 0, aggregation: 'avg' },
          { id: 'temperature', name: 'Body Temperature', unit: '°F', type: 'numeric', range: { min: 98, max: 102 }, precision: 1, aggregation: 'avg' }
        ],
        thresholds: [
          { metricId: 'heartRate', name: 'Elevated Heart Rate', operator: 'gt', value: 60, severity: 'high', enabled: true, hysteresis: 5 },
          { metricId: 'temperature', name: 'Fever', operator: 'gt', value: 101.5, severity: 'critical', enabled: true }
        ],
        alerts: ['vitals'],
        visualization: 'line_chart',
        updateInterval: 10000,
        dataRetentionDays: 30
      }
    ],
    vitals: {
      heartRate: {
        enabled: true,
        normalRange: { min: 28, max: 44 },
        warningRange: { min: 44, max: 60 },
        criticalRange: { min: 60, max: 80 },
        unit: 'bpm',
        precision: 0,
        sampleRate: 10
      },
      temperature: {
        enabled: true,
        normalRange: { min: 99.0, max: 101.0 },
        warningRange: { min: 101.0, max: 101.5 },
        criticalRange: { min: 101.5, max: 104.0 },
        unit: '°F',
        precision: 1,
        sampleRate: 30
      },
      respiratoryRate: {
        enabled: true,
        normalRange: { min: 8, max: 16 },
        warningRange: { min: 16, max: 24 },
        criticalRange: { min: 24, max: 40 },
        unit: 'breaths/min',
        precision: 0,
        sampleRate: 30
      }
    },
    behavior: {
      patterns: [
        {
          id: 'feeding',
          name: 'Feeding Behavior',
          description: 'Normal feeding patterns and appetite',
          indicators: ['feed_consumption', 'feeding_duration', 'water_intake'],
          normalFrequency: { min: 3, max: 6, unit: 'times_per_day' },
          alertConditions: [
            { type: 'frequency', operator: 'lt', value: 2, timeWindow: 24, consecutiveOccurrences: 1 }
          ]
        }
      ],
      anomalyDetection: true,
      learningPeriodDays: 14,
      sensitivity: 'medium',
      categories: [
        {
          id: 'stress',
          name: 'Stress Indicators',
          description: 'Signs of stress or anxiety in horses',
          behaviors: ['pacing', 'weaving', 'cribbing', 'head_shaking'],
          severity: 'medium'
        }
      ]
    },
    movement: {
      tracking: {
        enabled: true,
        accuracy: 'high',
        updateInterval: 30,
        historyRetentionDays: 90,
        geofencing: true
      },
      zones: [
        {
          id: 'safe_pasture',
          name: 'Safe Pasture Area',
          description: 'Primary grazing and exercise area',
          boundaries: [
            { latitude: 40.7128, longitude: -74.0060 },
            { latitude: 40.7138, longitude: -74.0050 }
          ],
          type: 'safe',
          actions: ['log_entry']
        }
      ],
      activity: {
        types: [
          {
            id: 'grazing',
            name: 'Grazing',
            description: 'Normal feeding and grazing activity',
            metrics: ['duration', 'location', 'movement_speed'],
            thresholds: []
          }
        ],
        detection: {
          enabled: true,
          algorithms: ['motion_analysis', 'location_clustering'],
          confidence: 0.8,
          validation: true
        },
        goals: []
      },
      gait: {
        analysis: {
          enabled: true,
          frequency: 3600,
          duration: 300,
          metrics: ['stride_length', 'cadence', 'symmetry'],
          comparison: true
        },
        patterns: [],
        abnormalities: []
      }
    },
    social: {
      interactions: [],
      groups: [],
      hierarchy: {
        enabled: false,
        factors: [],
        updateFrequency: 0,
        visualization: false
      },
      compatibility: {
        enabled: false,
        factors: [],
        scoring: 'numeric',
        recommendations: false
      }
    },
    environment: {
      sensors: [],
      conditions: [],
      automation: {
        enabled: false,
        rules: [],
        override: true,
        logging: true
      }
    }
  },

  realtime: {
    websocket: {
      enabled: true,
      url: 'wss://api.onebarn.com/ws',
      protocols: ['ai-monitor-v1'],
      authentication: {
        type: 'token',
        credentials: { 'Authorization': 'Bearer {{token}}' },
        refreshInterval: 3600
      },
      heartbeat: {
        enabled: true,
        interval: 30000,
        timeout: 10000,
        retries: 3
      },
      compression: true,
      bufferSize: 1024
    },
    polling: {
      enabled: true,
      interval: 30000,
      jitter: true,
      backoff: {
        strategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 30000,
        multiplier: 2
      },
      maxRequests: 100
    },
    events: {
      types: [
        { name: 'alert_created', priority: 'high', throttle: { enabled: false, maxEvents: 0, timeWindow: 0, strategy: 'drop' } },
        { name: 'alert_updated', priority: 'medium', throttle: { enabled: false, maxEvents: 0, timeWindow: 0, strategy: 'drop' } },
        { name: 'vital_reading', priority: 'low', throttle: { enabled: true, maxEvents: 10, timeWindow: 1000, strategy: 'sample' } }
      ],
      filtering: {
        enabled: true,
        rules: [],
        defaultAction: 'allow'
      },
      batching: {
        enabled: false,
        maxSize: 10,
        maxWait: 1000,
        compression: false
      },
      ordering: {
        enabled: true,
        field: 'timestamp',
        buffer: 100,
        timeout: 5000
      }
    },
    reconnection: {
      enabled: true,
      maxAttempts: 5,
      backoff: {
        strategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 30000,
        multiplier: 2
      },
      randomization: true
    }
  },

  notifications: {
    channels: [
      {
        id: 'email',
        name: 'Email',
        type: 'email',
        enabled: true,
        configuration: { smtp_server: 'smtp.onebarn.com', port: 587 },
        rateLimit: { maxPerMinute: 10, maxPerHour: 100, maxPerDay: 500, burstSize: 5 }
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'sms',
        enabled: true,
        configuration: { provider: 'twilio', account_sid: '{{TWILIO_SID}}' },
        rateLimit: { maxPerMinute: 5, maxPerHour: 50, maxPerDay: 200, burstSize: 3 }
      },
      {
        id: 'push',
        name: 'Push Notification',
        type: 'push',
        enabled: true,
        configuration: { service: 'firebase', server_key: '{{FCM_KEY}}' },
        rateLimit: { maxPerMinute: 20, maxPerHour: 200, maxPerDay: 1000, burstSize: 10 }
      }
    ],
    templates: [
      {
        id: 'alert_notification',
        name: 'Standard Alert Notification',
        channel: 'email',
        subject: 'Alert: {{alert.severity}} - {{horse.name}}',
        body: 'Alert for {{horse.name}}: {{alert.description}}',
        variables: ['alert.severity', 'horse.name', 'alert.description'],
        formatting: { type: 'html', styles: {}, attachments: [] }
      }
    ],
    preferences: {
      global: {
        enabled: true,
        quietHours: {
          enabled: true,
          startTime: '22:00',
          endTime: '06:00',
          timezone: 'America/New_York',
          exceptions: ['critical']
        },
        frequency: {
          maxPerMinute: 5,
          maxPerHour: 50,
          digestMode: false,
          digestInterval: 3600
        },
        escalation: true
      },
      perUser: [],
      perRole: []
    },
    delivery: {
      retries: {
        maxAttempts: 3,
        backoff: {
          strategy: 'exponential',
          initialDelay: 1000,
          maxDelay: 10000,
          multiplier: 2
        },
        conditions: ['network_error', 'timeout']
      },
      failover: {
        enabled: true,
        channels: ['email', 'sms'],
        conditions: ['delivery_failure'],
        delay: 300
      },
      tracking: {
        enabled: true,
        accuracy: 'high',
        updateInterval: 0,
        historyRetentionDays: 0,
        geofencing: false
      },
      analytics: {
        enabled: true,
        metrics: ['delivery_rate', 'open_rate', 'response_time'],
        retention: 90,
        aggregation: ['daily', 'weekly', 'monthly']
      }
    }
  },

  visualization: {
    charts: [],
    widgets: [],
    themes: [],
    defaults: {
      theme: 'light',
      colors: ['#8B4513', '#2C5530', '#F5F2E8', '#C0C0C0', '#D2691E'],
      fonts: {
        family: 'Inter, sans-serif',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
        formats: ['woff2', 'woff']
      },
      animations: true,
      responsive: true,
      accessibility: {
        enabled: true,
        highContrast: false,
        screenReader: true,
        keyboardNavigation: true,
        colorBlindSupport: true
      }
    }
  },

  export: {
    formats: [
      {
        id: 'csv',
        name: 'CSV File',
        extension: 'csv',
        mimeType: 'text/csv',
        configuration: { delimiter: ',', quote: '"', escape: '"' },
        maxSize: 10485760,
        compression: true
      },
      {
        id: 'pdf',
        name: 'PDF Report',
        extension: 'pdf',
        mimeType: 'application/pdf',
        configuration: { pageSize: 'A4', orientation: 'portrait' },
        maxSize: 52428800,
        compression: false
      }
    ],
    templates: [],
    scheduling: {
      enabled: false,
      frequencies: [],
      timezone: 'America/New_York',
      maxConcurrent: 3,
      retries: 2
    },
    distribution: {
      channels: [],
      recipients: [],
      notifications: true,
      confirmations: true
    },
    security: {
      encryption: {
        enabled: true,
        algorithm: 'AES-256',
        keySize: 256,
        passwordProtection: true,
        certificateProtection: false
      },
      access: {
        permissions: ['alerts:export'],
        roles: ['admin', 'manager', 'veterinarian'],
        approval: {
          required: false,
          approvers: [],
          timeout: 3600,
          escalation: []
        },
        restrictions: []
      },
      audit: {
        enabled: true,
        events: ['export_request', 'export_completion', 'export_access'],
        retention: 2555,
        notifications: true
      },
      retention: {
        policies: [],
        archival: {
          enabled: false,
          storage: 'local',
          compression: 'none',
          encryption: false,
          indexing: false
        },
        purging: {
          enabled: false,
          schedule: '',
          batchSize: 0,
          confirmationRequired: false,
          auditRetentionDays: 0
        }
      }
    }
  },

  zeroTrust: {
    securityPolicies: [
      {
        id: 'default_access',
        name: 'Default Access Policy',
        description: 'Default access control for AI monitoring components',
        enabled: true,
        conditions: [
          { type: 'role', operator: 'contains', value: ['admin', 'manager', 'veterinarian', 'trainer'] }
        ],
        actions: [
          { type: 'allow', parameters: {} }
        ],
        priority: 1,
        effectiveDate: '2024-01-01T00:00:00Z'
      }
    ],
    dataClassification: {
      levels: [
        {
          id: 'public',
          name: 'Public',
          color: '#4CAF50',
          description: 'Information that can be freely shared',
          restrictions: [],
          retentionDays: 365
        },
        {
          id: 'internal',
          name: 'Internal',
          color: '#FF9800',
          description: 'Information for internal use only',
          restrictions: ['no_external_sharing'],
          retentionDays: 1095
        },
        {
          id: 'confidential',
          name: 'Confidential',
          color: '#F44336',
          description: 'Sensitive information requiring special handling',
          restrictions: ['no_screenshots', 'no_copy_paste', 'approval_required'],
          retentionDays: 2555
        }
      ],
      handlingRules: [
        {
          classificationId: 'confidential',
          allowScreenshots: false,
          allowCopyPaste: false,
          allowPrint: false,
          allowExport: true,
          requireJustification: true,
          auditRequired: true
        }
      ],
      watermarkSettings: {
        enabled: true,
        text: 'CONFIDENTIAL - {{ user.name }} - {{ timestamp }}',
        opacity: 0.1,
        fontSize: '12px',
        color: '#666666',
        position: 'center'
      },
      exportRestrictions: []
    },
    accessControl: {
      roles: [
        {
          roleId: 'veterinarian',
          roleName: 'Veterinarian',
          permissions: [
            {
              resource: 'ai_monitor',
              actions: ['read', 'acknowledge', 'escalate', 'resolve'],
              conditions: [],
              dataFilters: [],
              timeRestrictions: []
            }
          ],
          maxSessionDuration: 28800,
          allowedLocations: ['any'],
          allowedDeviceTypes: ['desktop', 'tablet', 'mobile']
        }
      ],
      resources: [
        {
          resourceId: 'ai_monitor_dashboard',
          resourceName: 'AI Monitor Dashboard',
          requiredPermissions: ['ai_monitor:read'],
          dataClassification: 'confidential',
          ownershipModel: 'tenant'
        }
      ],
      contextualRules: []
    },
    threatDetection: {
      anomalyDetection: {
        enabled: true,
        sensitivity: 'medium',
        algorithms: ['statistical', 'machine_learning'],
        thresholds: { login_frequency: 10, data_access: 100 },
        learningPeriodDays: 30
      },
      behaviorAnalytics: {
        trackingEnabled: true,
        metrics: ['page_views', 'click_patterns', 'session_duration'],
        baselinePeriodDays: 14,
        alertThresholds: { unusual_access: 0.8 }
      },
      threatIntelligence: {
        feeds: [],
        updateInterval: 3600,
        autoBlock: false,
        severity: 'medium'
      },
      responseActions: []
    },
    sessionManagement: {
      maxConcurrentSessions: 3,
      sessionTimeout: 28800,
      idleTimeout: 1800,
      absoluteTimeout: 86400,
      requireReauth: true,
      reauthInterval: 14400,
      deviceBinding: true,
      locationBinding: false
    },
    deviceTrust: {
      trustLevels: [
        {
          id: 'trusted',
          name: 'Trusted Device',
          score: 90,
          requirements: ['registered', 'certificate_valid', 'compliance_check'],
          permissions: ['full_access'],
          sessionLimits: {
            maxDuration: 28800,
            maxIdleTime: 1800,
            requirePeriodicVerification: false,
            verificationInterval: 0
          }
        }
      ],
      riskFactors: [],
      complianceChecks: [],
      certificateRequirements: []
    },
    riskAssessment: {
      factors: [],
      scoring: {
        algorithm: 'weighted',
        modelVersion: '1.0',
        updateFrequency: 'hourly',
        normalization: 'linear'
      },
      thresholds: [
        { level: 'low', minScore: 0, maxScore: 30, color: '#4CAF50', description: 'Low risk' },
        { level: 'medium', minScore: 30, maxScore: 70, color: '#FF9800', description: 'Medium risk' },
        { level: 'high', minScore: 70, maxScore: 100, color: '#F44336', description: 'High risk' }
      ],
      actions: []
    }
  }
}; 