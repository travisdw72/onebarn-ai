// Comprehensive AI Training & Competition Dashboard Configuration
// Supports all disciplines: English, Western, Ranch Work, and Competition

import { brandConfig } from './brandConfig';
import type { 
  IAIDashboardConfig, 
  IDashboardWidget, 
  IActiveAlerts, 
  IActiveSession, 
  ILiveCompetition 
} from './aiDashboardConfig.interface';

export const aiDashboardConfig: IAIDashboardConfig = {
  // Dashboard Layout & Structure
  layout: {
    title: "AI Training & Competition Command Center",
    subtitle: "Real-time analysis across all equestrian disciplines",
    refreshInterval: 5000, // 5 seconds
    autoRefresh: true,
    theme: "professional",
    
    sections: {
      overview: {
        title: "Platform Overview",
        order: 1,
        columns: 4,
        widgets: ["activeTraining", "todayStats", "aiStatus", "alerts"]
      },
      
      liveTraining: {
        title: "Live Training Sessions",
        order: 2,
        columns: 3,
        widgets: ["activeSessions", "realtimeMetrics", "coaching"]
      },
      
      competition: {
        title: "Competition & Timing",
        order: 3,
        columns: 2,
        widgets: ["liveCompetition", "results"]
      },
      
      analytics: {
        title: "Performance Analytics",
        order: 4,
        columns: 3,
        widgets: ["trends", "insights", "recommendations"]
      },
      
      monitoring: {
        title: "Health & Behavior Monitoring",
        order: 5,
        columns: 2,
        widgets: ["healthAlerts", "behaviorAnalysis"]
      }
    }
  },

  // Discipline Filtering & Barn Specialization
  disciplineFilters: {
    // Predefined filter sets for different barn types
    presets: {
      all: {
        name: "All Disciplines",
        description: "Complete equestrian training platform",
        disciplines: [
          "barrelRacing", "dressage", "jumping", "teamRoping", "cutting", "reining",
          "calfRoping", "breakawayRoping", "eventing", "hunter", "westernPleasure", 
          "endurance", "poloAndPolocrosse", "vaulting", "driving", "ranchWork"
        ]
      },
      english: {
        name: "English Disciplines Only",
        description: "Dressage, Show Jumping, Eventing, Hunter",
        disciplines: ["dressage", "jumping", "eventing", "hunter"]
      },
      western: {
        name: "Western Disciplines Only", 
        description: "Barrel Racing, Cutting, Reining, Western Pleasure",
        disciplines: ["barrelRacing", "cutting", "reining", "westernPleasure"]
      },
      roping: {
        name: "Roping Disciplines Only",
        description: "Team Roping, Calf Roping, Breakaway Roping",
        disciplines: ["teamRoping", "calfRoping", "breakawayRoping"]
      },
      competition: {
        name: "Competition Focus",
        description: "High-level competition disciplines",
        disciplines: ["dressage", "jumping", "eventing", "barrelRacing", "cutting", "reining"]
      },
      ranch: {
        name: "Ranch & Working",
        description: "Ranch work and practical disciplines",
        disciplines: ["cutting", "ranchWork", "teamRoping", "calfRoping"]
      },
      specialty: {
        name: "Specialty Disciplines",
        description: "Endurance, Polo, Vaulting, Driving",
        disciplines: ["endurance", "poloAndPolocrosse", "vaulting", "driving"]
      }
    },
    
    // Current active filter (can be changed by user/barn settings)
    activeFilter: "all", // Default to show all disciplines
    
    // Custom filter capability
    custom: {
      enabled: true,
      disciplines: [] // User can create custom combinations
    }
  },

  // Widget Configurations
  widgets: {
    // OVERVIEW SECTION
    activeTraining: {
      title: "Active Training Sessions",
      type: "counter",
      icon: "PlayCircle",
      color: brandConfig.colors.successGreen,
      size: "large",
      data: {
        current: 0,
        target: 10,
        unit: "sessions",
        trend: "up"
      },
      actions: ["viewAll", "startNew"]
    },

    todayStats: {
      title: "Today's Activity",
      type: "stats_grid",
      icon: "Today",
      color: brandConfig.colors.ribbonBlue,
      size: "large",
      data: {
        sessions: { value: 0, label: "Training Sessions" },
        competitions: { value: 0, label: "Competitions" },
        alerts: { value: 0, label: "AI Alerts" },
        insights: { value: 0, label: "New Insights" }
      }
    },

    aiStatus: {
      title: "AI System Status",
      type: "status_indicator",
      icon: "Psychology",
      color: brandConfig.colors.championGold,
      size: "medium",
      data: {
        status: "operational",
        providers: {
          openai: { status: "active", load: 45 },
          anthropic: { status: "active", load: 32 },
          grok: { status: "standby", load: 0 }
        },
        processing: {
          queue: 0,
          avgResponseTime: "1.2s"
        }
      }
    },

    alerts: {
      title: "Priority Alerts",
      type: "alert_summary",
      icon: "Warning",
      color: brandConfig.colors.alertAmber,
      size: "large",
      data: {
        critical: 0,
        warning: 0,
        info: 0,
        total: 0
      },
      actions: ["viewAll", "acknowledge"]
    },

    // LIVE TRAINING SECTION
    activeSessions: {
      title: "Live Training Sessions",
      type: "session_grid",
      icon: "FitnessCenter",
      color: brandConfig.colors.stableMahogany,
      size: "large",
      disciplines: {
        barrelRacing: {
          icon: "Speed",
          color: brandConfig.colors.victoryRose,
          activeSessions: 0
        },
        dressage: {
          icon: "EmojiEvents", 
          color: brandConfig.colors.championGold,
          activeSessions: 0
        },
        jumping: {
          icon: "TrendingUp",
          color: brandConfig.colors.ribbonBlue,
          activeSessions: 0
        },
        teamRoping: {
          icon: "GpsFixed",
          color: brandConfig.colors.chestnutGlow,
          activeSessions: 0
        },
        cutting: {
          icon: "Psychology",
          color: brandConfig.colors.pastureSage,
          activeSessions: 0
        },
        reining: {
          icon: "Rotate90DegreesCcw",
          color: brandConfig.colors.ribbonBlue,
          activeSessions: 0
        },
        calfRoping: {
          icon: "GpsFixed",
          color: brandConfig.colors.alertAmber,
          activeSessions: 0
        },
        breakawayRoping: {
          icon: "FavoriteRounded",
          color: brandConfig.colors.victoryRose,
          activeSessions: 0
        },
        eventing: {
          icon: "Terrain",
          color: brandConfig.colors.hunterGreen,
          activeSessions: 0
        },
        hunter: {
          icon: "Forest",
          color: brandConfig.colors.pastureSage,
          activeSessions: 0
        },
        westernPleasure: {
          icon: "SelfImprovement",
          color: brandConfig.colors.chestnutGlow,
          activeSessions: 0
        },
        endurance: {
          icon: "DirectionsRun",
          color: brandConfig.colors.infoBlue,
          activeSessions: 0
        },
        poloAndPolocrosse: {
          icon: "SportsHockey",
          color: brandConfig.colors.championGold,
          activeSessions: 0
        },
        vaulting: {
          icon: "FitnessCenter",
          color: brandConfig.colors.ribbonBlue,
          activeSessions: 0
        },
        driving: {
          icon: "DirectionsCar",
          color: brandConfig.colors.stableMahogany,
          activeSessions: 0
        },
        ranchWork: {
          icon: "Agriculture",
          color: brandConfig.colors.hunterGreen,
          activeSessions: 0
        }
      },
      actions: ["viewSession", "joinCoaching", "endSession"]
    },

    realtimeMetrics: {
      title: "Real-time Performance",
      type: "metrics_dashboard",
      icon: "Analytics",
      color: brandConfig.colors.infoBlue,
      size: "medium",
      metrics: {
        timing: {
          label: "Current Times",
          unit: "seconds",
          precision: 0.01,
          display: "digital"
        },
        heartRate: {
          label: "Horse Heart Rate",
          unit: "bpm",
          range: [28, 44],
          display: "gauge"
        },
        technique: {
          label: "Technique Score",
          unit: "percentage",
          range: [0, 100],
          display: "progress"
        },
        aiConfidence: {
          label: "AI Confidence",
          unit: "percentage",
          range: [0, 100],
          display: "progress"
        }
      }
    },

    coaching: {
      title: "AI Coaching Feed",
      type: "coaching_stream",
      icon: "RecordVoiceOver",
      color: brandConfig.colors.successGreen,
      size: "medium",
      data: {
        maxItems: 5,
        autoScroll: true,
        categories: ["technique", "safety", "performance"],
        filters: ["all", "critical", "suggestions"]
      },
      actions: ["expandFeed", "muteCoaching", "saveInsight"]
    },

    // COMPETITION SECTION
    liveCompetition: {
      title: "Live Competition",
      type: "competition_board",
      icon: "EmojiEvents",
      color: brandConfig.colors.championGold,
      size: "large",
      data: {
        event: null,
        discipline: null,
        currentRun: null,
        leaderboard: [],
        timing: {
          precision: 0.01,
          status: "ready"
        }
      },
      actions: ["startCompetition", "viewResults", "exportData"]
    },

    results: {
      title: "Recent Results",
      type: "results_table",
      icon: "Leaderboard",
      color: brandConfig.colors.ribbonBlue,
      size: "medium",
      data: {
        maxResults: 10,
        columns: ["rider", "horse", "time", "discipline", "placement"],
        sortBy: "timestamp",
        filters: ["today", "week", "month"]
      },
      actions: ["viewDetails", "exportResults", "shareResults"]
    },

    // ANALYTICS SECTION
    trends: {
      title: "Performance Trends",
      type: "trend_charts",
      icon: "TrendingUp",
      color: brandConfig.colors.pastureSage,
      size: "large",
      charts: {
        performance: {
          type: "line",
          timeframe: "30d",
          metrics: ["average_time", "consistency", "improvement"]
        },
        discipline: {
          type: "bar",
          data: "session_count_by_discipline"
        },
        progress: {
          type: "area",
          data: "skill_progression"
        }
      },
      actions: ["changeTimeframe", "exportChart", "drillDown"]
    },

    insights: {
      title: "AI Insights",
      type: "insight_cards",
      icon: "Lightbulb",
      color: brandConfig.colors.championGold,
      size: "medium",
      data: {
        maxInsights: 3,
        categories: ["performance", "training", "health", "equipment"],
        confidence: 0.7,
        autoRefresh: true
      },
      actions: ["viewAll", "saveInsight", "shareInsight"]
    },

    recommendations: {
      title: "Training Recommendations",
      type: "recommendation_list",
      icon: "Psychology",
      color: brandConfig.colors.infoBlue,
      size: "medium",
      data: {
        maxRecommendations: 5,
        priority: ["safety", "performance", "efficiency"],
        aiGenerated: true
      },
      actions: ["applyRecommendation", "scheduleTraining", "dismiss"]
    },

    // MONITORING SECTION
    healthAlerts: {
      title: "Health & Safety Monitoring",
      type: "health_monitor",
      icon: "MonitorHeart",
      color: brandConfig.colors.errorRed,
      size: "large",
      monitoring: {
        vitalSigns: {
          heartRate: { normal: [28, 44], unit: "bpm" },
          temperature: { normal: [99, 101], unit: "°F" },
          respiratoryRate: { normal: [8, 16], unit: "rpm" }
        },
        behavior: {
          activity: { normal: [40, 80], unit: "%" },
          feeding: { normal: [0.7, 1.0], unit: "score" },
          social: { normal: [0.6, 1.0], unit: "score" }
        },
        alerts: {
          critical: [],
          warning: [],
          info: []
        }
      },
      actions: ["viewDetails", "contactVet", "acknowledgeAlert"]
    },

    behaviorAnalysis: {
      title: "Behavior Analysis",
      type: "behavior_dashboard",
      icon: "Psychology",
      color: brandConfig.colors.pastureSage,
      size: "medium",
      analysis: {
        patterns: {
          feeding: "normal",
          social: "normal", 
          activity: "normal",
          stress: "low"
        },
        anomalies: [],
        predictions: {
          enabled: true,
          horizon: "24h",
          confidence: 0.8
        }
      },
      actions: ["viewHistory", "adjustThresholds", "exportReport"]
    }
  },

  // Real-time Data Sources
  dataSources: {
    training: {
      endpoint: "/api/v1/training/live",
      refreshInterval: 1000, // 1 second for live training
      fields: ["session_id", "discipline", "metrics", "alerts", "coaching"]
    },
    
    competition: {
      endpoint: "/api/v1/competition/live",
      refreshInterval: 100, // 100ms for competition timing
      fields: ["event_id", "current_run", "timing", "results"]
    },
    
    health: {
      endpoint: "/api/v1/monitoring/health",
      refreshInterval: 5000, // 5 seconds for health monitoring
      fields: ["vital_signs", "behavior", "alerts", "predictions"]
    },
    
    analytics: {
      endpoint: "/api/v1/analytics/dashboard",
      refreshInterval: 30000, // 30 seconds for analytics
      fields: ["trends", "insights", "recommendations", "performance"]
    },
    
    ai: {
      endpoint: "/api/v1/ai/status",
      refreshInterval: 10000, // 10 seconds for AI status
      fields: ["providers", "queue", "processing", "errors"]
    }
  },

  // Alert Configuration
  alerts: {
    priorities: {
      critical: {
        color: brandConfig.colors.errorRed,
        sound: true,
        notification: true,
        autoEscalate: 300000 // 5 minutes
      },
      warning: {
        color: brandConfig.colors.alertAmber,
        sound: false,
        notification: true,
        autoEscalate: 900000 // 15 minutes
      },
      info: {
        color: brandConfig.colors.infoBlue,
        sound: false,
        notification: false,
        autoEscalate: null
      }
    },
    
    categories: {
      safety: {
        icon: "Warning",
        priority: "critical",
        examples: ["Horse injury detected", "Equipment malfunction", "Rider fall"]
      },
      performance: {
        icon: "TrendingDown",
        priority: "warning", 
        examples: ["Performance decline", "Technique issue", "Consistency problem"]
      },
      health: {
        icon: "MonitorHeart",
        priority: "warning",
        examples: ["Vital signs abnormal", "Behavior change", "Fatigue detected"]
      },
      equipment: {
        icon: "Build",
        priority: "warning",
        examples: ["Timing system error", "Camera offline", "Sensor malfunction"]
      },
      achievement: {
        icon: "EmojiEvents",
        priority: "info",
        examples: ["Personal best", "Goal achieved", "Milestone reached"]
      }
    }
  },

  // Customization Options
  customization: {
    themes: {
      professional: {
        primary: brandConfig.colors.stableMahogany,
        secondary: brandConfig.colors.ribbonBlue,
        accent: brandConfig.colors.championGold
      },
      competition: {
        primary: brandConfig.colors.errorRed,
        secondary: brandConfig.colors.alertAmber,
        accent: brandConfig.colors.successGreen
      },
      training: {
        primary: brandConfig.colors.pastureSage,
        secondary: brandConfig.colors.chestnutGlow,
        accent: brandConfig.colors.infoBlue
      }
    },
    
    layouts: {
      compact: { columns: 6, spacing: "sm" },
      standard: { columns: 4, spacing: "md" },
      expanded: { columns: 3, spacing: "lg" }
    },
    
    userPreferences: {
      autoRefresh: true,
      soundAlerts: false,
      notifications: true,
      defaultView: "overview",
      favoriteWidgets: []
    }
  },

  // Integration Settings
  integration: {
    hardware: {
      timingSystems: ["FarmTek", "Alge", "FinishLynx"],
      cameras: ["arena", "stall", "mobile"],
      sensors: ["heart_rate", "gps", "motion"],
      displays: ["scoreboard", "mobile", "web"]
    },
    
    software: {
      streaming: ["YouTube", "Facebook", "Twitch"],
      results: ["HorseShowCentral", "EventLink"],
      social: ["Instagram", "TikTok", "Twitter"],
      analytics: ["Google Analytics", "custom"]
    }
  }
};

// Helper functions for dashboard management
export const getDashboardWidget = (widgetId: string): IDashboardWidget | undefined => {
  return aiDashboardConfig.widgets[widgetId];
};

export const getActiveAlerts = (): IActiveAlerts => {
  // This would fetch real-time alerts from the API
  return {
    critical: 0,
    warning: 0,
    info: 0,
    total: 0
  };
};

export const updateWidgetData = (widgetId: string, data: any): void => {
  const widget = aiDashboardConfig.widgets[widgetId];
  if (widget && widget.data) {
    widget.data = { ...widget.data, ...data };
  }
};

export const getActiveSessions = (): IActiveSession[] => {
  // This would fetch active training sessions from the API
  return [];
};

export const getLiveCompetition = (): ILiveCompetition | null => {
  // This would fetch live competition data from the API
  return null;
};

// Discipline Filtering Functions
export const getActiveDisciplines = (): string[] => {
  const activeFilter = aiDashboardConfig.disciplineFilters.activeFilter;
  
  if (activeFilter === 'custom') {
    return aiDashboardConfig.disciplineFilters.custom.disciplines;
  }
  
  const preset = aiDashboardConfig.disciplineFilters.presets[activeFilter];
  return preset ? preset.disciplines : [];
};

export const setDisciplineFilter = (filterName: string): void => {
  if (aiDashboardConfig.disciplineFilters.presets[filterName] || filterName === 'custom') {
    aiDashboardConfig.disciplineFilters.activeFilter = filterName;
  }
};

export const setCustomDisciplines = (disciplines: string[]): void => {
  aiDashboardConfig.disciplineFilters.custom.disciplines = disciplines;
  aiDashboardConfig.disciplineFilters.activeFilter = 'custom';
};

export const getFilteredDisciplines = (allDisciplines: Record<string, any>): Record<string, any> => {
  const activeDisciplines = getActiveDisciplines();
  const filtered: Record<string, any> = {};
  
  activeDisciplines.forEach(discipline => {
    if (allDisciplines[discipline]) {
      filtered[discipline] = allDisciplines[discipline];
    }
  });
  
  return filtered;
};

export const getDisciplineFilterPresets = () => {
  return aiDashboardConfig.disciplineFilters.presets;
};

export const getCurrentFilterInfo = () => {
  const activeFilter = aiDashboardConfig.disciplineFilters.activeFilter;
  const preset = aiDashboardConfig.disciplineFilters.presets[activeFilter];
  
  return {
    name: activeFilter,
    displayName: preset?.name || 'Custom Filter',
    description: preset?.description || 'Custom discipline selection',
    disciplineCount: getActiveDisciplines().length
  };
}; 