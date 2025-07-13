// TypeScript interfaces for AI Dashboard Configuration
// Enhanced for both Horse Training and Senior Care

export interface IDashboardWidget {
  title: string;
  type: string;
  icon: string;
  color: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
  actions?: string[];
  disciplines?: Record<string, any>;
  metrics?: Record<string, any>;
  monitoring?: Record<string, any>;
  analysis?: Record<string, any>;
  charts?: Record<string, any>;
  // Senior Care Specific Properties
  careCategory?: 'health' | 'cognitive' | 'social' | 'safety' | 'wellness';
  alertSeverity?: 'low' | 'medium' | 'high' | 'critical';
  medicalRelevance?: boolean;
  emergencyCapable?: boolean;
}

export interface IDashboardSection {
  title: string;
  order: number;
  columns: number;
  widgets: string[];
  // Enhanced for senior care
  priority?: 'low' | 'medium' | 'high' | 'critical';
  userRoles?: string[];
  contextType?: 'horse-training' | 'senior-care' | 'general';
}

export interface IDashboardLayout {
  title: string;
  subtitle: string;
  refreshInterval: number;
  autoRefresh: boolean;
  theme: string;
  sections: Record<string, IDashboardSection>;
  // Senior Care Layout Properties
  emergencyMode?: boolean;
  medicalStaffView?: boolean;
  familyView?: boolean;
}

export interface IDataSource {
  endpoint: string;
  refreshInterval: number;
  fields: string[];
  // Enhanced data source properties
  priority?: 'low' | 'medium' | 'high' | 'critical';
  emergencyEndpoint?: string;
  fallbackEndpoint?: string;
}

export interface IAlertPriority {
  color: string;
  sound: boolean;
  notification: boolean;
  autoEscalate: number | null;
  // Enhanced alert properties
  medicalResponse?: boolean;
  familyNotification?: boolean;
  emergencyProtocol?: boolean;
}

export interface IAlertCategory {
  icon: string;
  priority: string;
  examples: string[];
  // Enhanced category properties
  requiredResponse?: 'immediate' | 'urgent' | 'routine' | 'monitoring';
  medicalStaffOnly?: boolean;
  auditRequired?: boolean;
}

export interface IAlertConfig {
  priorities: Record<string, IAlertPriority>;
  categories: Record<string, IAlertCategory>;
  // Senior Care Alert Config
  emergencyEscalation?: {
    level1: number; // minutes
    level2: number;
    level3: number;
  };
  medicalStaffAlerts?: string[];
  familyAlerts?: string[];
}

export interface ITheme {
  primary: string;
  secondary: string;
  accent: string;
  // Enhanced theme properties
  medical?: string;
  emergency?: string;
  wellness?: string;
}

export interface ILayout {
  columns: number;
  spacing: string;
  // Enhanced layout
  emergencyLayout?: {
    columns: number;
    spacing: string;
    priority: 'alerts-first' | 'vitals-first';
  };
}

export interface IUserPreferences {
  autoRefresh: boolean;
  soundAlerts: boolean;
  notifications: boolean;
  defaultView: string;
  favoriteWidgets: string[];
  // Senior Care Preferences
  medicalAlertsOnly?: boolean;
  familyMemberView?: boolean;
  emergencyContactsVisible?: boolean;
  vitalSignsAlwaysVisible?: boolean;
}

export interface ICustomization {
  themes: Record<string, ITheme>;
  layouts: Record<string, ILayout>;
  userPreferences: IUserPreferences;
  // Enhanced customization
  roleBasedViews?: Record<string, string[]>; // role -> widget IDs
  contextSwitching?: boolean;
}

export interface IHardwareIntegration {
  timingSystems: string[];
  cameras: string[];
  sensors: string[];
  displays: string[];
  // Senior Care Hardware
  medicalDevices?: string[];
  emergencyButtons?: string[];
  vitalSignsMonitors?: string[];
  fallDetectors?: string[];
  medicationDispensers?: string[];
}

export interface ISoftwareIntegration {
  streaming: string[];
  results: string[];
  social: string[];
  analytics: string[];
  // Senior Care Software
  medicalRecordSystems?: string[];
  emergencyServices?: string[];
  familyCommunication?: string[];
  pharmacySystems?: string[];
}

export interface IIntegration {
  hardware: IHardwareIntegration;
  software: ISoftwareIntegration;
}

export interface IDisciplineFilterPreset {
  name: string;
  description: string;
  disciplines: string[];
}

export interface IDisciplineFilters {
  presets: Record<string, IDisciplineFilterPreset>;
  activeFilter: string;
  custom: {
    enabled: boolean;
    disciplines: string[];
  };
}

// Senior Care Specific Interfaces
export interface ICareCategory {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  monitoringTypes: string[];
  alertThresholds: Record<string, number>;
}

export interface ISeniorCareFilters {
  careCategories: Record<string, ICareCategory>;
  activeFilter: string;
  custom: {
    enabled: boolean;
    categories: string[];
  };
}

export interface IAIDashboardConfig {
  layout: IDashboardLayout;
  disciplineFilters: IDisciplineFilters;
  seniorCareFilters?: ISeniorCareFilters;
  widgets: Record<string, IDashboardWidget>;
  dataSources: Record<string, IDataSource>;
  alerts: IAlertConfig;
  customization: ICustomization;
  integration: IIntegration;
  // Context switching between horse training and senior care
  contextType?: 'horse-training' | 'senior-care' | 'multi-context';
  contextSwitching?: {
    enabled: boolean;
    defaultContext: string;
    availableContexts: string[];
  };
}

// Widget-specific interfaces
export interface ICounterWidget extends IDashboardWidget {
  data: {
    current: number;
    target: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    // Enhanced for senior care
    threshold?: {
      warning: number;
      critical: number;
    };
    medicalSignificance?: boolean;
  };
}

export interface IStatsGridWidget extends IDashboardWidget {
  data: Record<string, {
    value: number;
    label: string;
    // Enhanced properties
    status?: 'normal' | 'warning' | 'critical';
    trend?: 'improving' | 'stable' | 'declining';
    medicalRelevance?: boolean;
  }>;
}

export interface IStatusIndicatorWidget extends IDashboardWidget {
  data: {
    status: 'operational' | 'warning' | 'error';
    providers: Record<string, {
      status: 'active' | 'standby' | 'error';
      load: number;
    }>;
    processing: {
      queue: number;
      avgResponseTime: string;
    };
    // Senior care status
    emergencySystem?: {
      status: 'ready' | 'responding' | 'offline';
      lastTest: string;
    };
    medicalStaffAvailable?: boolean;
  };
}

export interface IAlertSummaryWidget extends IDashboardWidget {
  data: {
    critical: number;
    warning: number;
    info: number;
    total: number;
    // Enhanced for senior care
    medical?: number;
    emergency?: number;
    familyNotifications?: number;
  };
}

export interface ISessionGridWidget extends IDashboardWidget {
  disciplines: Record<string, {
    icon: string;
    color: string;
    activeSessions: number;
  }>;
}

// Senior Care Specific Widget Interfaces
export interface IHealthMonitoringWidget extends IDashboardWidget {
  monitoring: {
    vitalSigns: Record<string, {
      current: number;
      normal: [number, number];
      unit: string;
      trend: 'improving' | 'stable' | 'declining';
      lastUpdate: string;
    }>;
    alerts: {
      critical: number;
      warning: number;
      info: number;
    };
    emergencyContacts: Array<{
      name: string;
      role: string;
      available: boolean;
    }>;
  };
}

export interface ICognitiveAssessmentWidget extends IDashboardWidget {
  assessment: {
    overallScore: number;
    memoryScore: number;
    executiveFunction: number;
    orientation: number;
    language: number;
    attention: number;
    lastAssessment: string;
    trend: 'improving' | 'stable' | 'declining';
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
}

export interface IMedicationManagementWidget extends IDashboardWidget {
  medication: {
    todaysMedications: Array<{
      name: string;
      dosage: string;
      time: string;
      taken: boolean;
      notes?: string;
    }>;
    adherenceRate: number;
    missedDoses: number;
    upcomingRefills: Array<{
      medication: string;
      daysRemaining: number;
    }>;
    interactions: Array<{
      medication1: string;
      medication2: string;
      severity: 'minor' | 'moderate' | 'major';
    }>;
  };
}

export interface ISocialEngagementWidget extends IDashboardWidget {
  social: {
    todaysActivities: Array<{
      name: string;
      time: string;
      type: 'group' | 'individual' | 'family';
      participated: boolean;
    }>;
    socialScore: number;
    weeklyInteractions: number;
    favoriteActivities: string[];
    recentVisitors: Array<{
      name: string;
      relationship: string;
      date: string;
    }>;
  };
}

export interface IEmergencyResponseWidget extends IDashboardWidget {
  emergency: {
    systemStatus: 'ready' | 'alert' | 'responding' | 'offline';
    lastIncident: {
      type: string;
      date: string;
      responseTime: number;
      outcome: string;
    } | null;
    emergencyContacts: Array<{
      name: string;
      role: 'medical' | 'family' | 'facility';
      phone: string;
      available: boolean;
    }>;
    protocols: Array<{
      type: string;
      enabled: boolean;
      lastTested: string;
    }>;
  };
}

export interface IWellnessProgramWidget extends IDashboardWidget {
  wellness: {
    currentPrograms: Array<{
      name: string;
      category: 'physical' | 'cognitive' | 'social' | 'spiritual';
      progress: number;
      nextSession: string;
    }>;
    overallWellnessScore: number;
    goalProgress: Record<string, {
      target: number;
      current: number;
      unit: string;
    }>;
    recommendations: Array<{
      category: string;
      suggestion: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  };
}

// Enhanced existing widget interfaces for senior care
export interface IMetricsDashboardWidget extends IDashboardWidget {
  metrics: Record<string, {
    label: string;
    unit: string;
    precision?: number;
    range?: [number, number];
    display: 'digital' | 'gauge' | 'progress';
    // Enhanced for senior care
    medicalRelevance?: boolean;
    alertThreshold?: number;
    emergencyThreshold?: number;
  }>;
}

export interface ICoachingStreamWidget extends IDashboardWidget {
  data: {
    maxItems: number;
    autoScroll: boolean;
    categories: string[];
    filters: string[];
    // Enhanced for senior care
    medicalNotesEnabled?: boolean;
    familyUpdatesEnabled?: boolean;
    emergencyNotesEnabled?: boolean;
  };
}

export interface ITrendChartsWidget extends IDashboardWidget {
  charts: Record<string, {
    type: 'line' | 'bar' | 'area';
    timeframe?: string;
    metrics?: string[];
    data?: string;
    // Enhanced for senior care
    medicalOverlay?: boolean;
    medicationEvents?: boolean;
    emergencyMarkers?: boolean;
  }>;
}

export interface IInsightCardsWidget extends IDashboardWidget {
  data: {
    maxInsights: number;
    categories: string[];
    confidence: number;
    autoRefresh: boolean;
    // Enhanced for senior care
    medicalInsights?: boolean;
    wellnessInsights?: boolean;
    emergencyPredictions?: boolean;
  };
}

export interface IRecommendationListWidget extends IDashboardWidget {
  data: {
    maxRecommendations: number;
    priority: string[];
    aiGenerated: boolean;
    // Enhanced for senior care
    medicalRecommendations?: boolean;
    wellnessRecommendations?: boolean;
    safetyRecommendations?: boolean;
    familyVisible?: boolean;
  };
}

// Helper function return types
export interface IActiveAlerts {
  critical: number;
  warning: number;
  info: number;
  total: number;
  // Enhanced for senior care
  medical?: number;
  emergency?: number;
  safety?: number;
}

export interface IActiveSession {
  id: string;
  discipline: string;
  rider: string;
  horse: string;
  startTime: string;
  status: 'active' | 'paused' | 'completed';
}

// Senior Care Specific Helper Types
export interface IActiveSenior {
  id: string;
  name: string;
  room: string;
  status: 'stable' | 'monitoring' | 'alert' | 'emergency';
  lastUpdate: string;
  careLevel: 'independent' | 'assisted' | 'skilled' | 'memory_care';
  primaryCaregiver: string;
}

export interface ISeniorHealthSummary {
  seniorId: string;
  name: string;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  vitalSigns: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSaturation: number;
  };
  alerts: IActiveAlerts;
  medications: {
    due: number;
    taken: number;
    missed: number;
  };
  activities: {
    completed: number;
    scheduled: number;
    participation: number; // percentage
  };
}

export interface IEmergencyEvent {
  id: string;
  seniorId: string;
  type: 'fall' | 'medical' | 'behavioral' | 'environmental';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'responding' | 'resolved';
  responseTime: number; // seconds
  personnel: string[];
  outcome: string;
  timestamp: string;
}

export interface ILiveCompetition {
  id: string;
  name: string;
  discipline: string;
  status: 'upcoming' | 'active' | 'completed';
  currentRun?: {
    rider: string;
    horse: string;
    startTime: string;
  };
  leaderboard: Array<{
    position: number;
    rider: string;
    horse: string;
    time: number;
    penalties: number;
    total: number;
  }>;
}

export interface ILiveTrainingData {
  barrelRacing: number;
  dressage: number;
  jumping: number;
  teamRoping: number;
  cutting: number;
  reining: number;
  calfRoping: number;
  breakawayRoping: number;
  eventing: number;
  hunter: number;
  westernPleasure: number;
  endurance: number;
  poloAndPolocrosse: number;
  vaulting: number;
  driving: number;
  ranchWork: number;
}

// Senior Care Live Data
export interface ILiveSeniorCareData {
  healthMonitoring: number;
  cognitivePrograms: number;
  socialActivities: number;
  physicalTherapy: number;
  medicationManagement: number;
  emergencyResponse: number;
  familyEngagement: number;
  wellnessPrograms: number;
  nutritionPrograms: number;
  recreationalActivities: number;
} 