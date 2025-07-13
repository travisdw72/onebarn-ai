// TypeScript interfaces for AI Senior Care Monitor Configuration

export interface IAIMonitorConfig {
  dashboard: IDashboardSettings;
  layout: ILayoutConfig;
  alerts: IAlertConfig;
  monitoring: IMonitoringConfig;
  filters: IFiltersConfig;
  visualization: IVisualizationConfig;
  realtime: IRealtimeConfig;
  notifications: INotificationsConfig;
  cards: ICardsConfig;
  text: ITextConfig;
  emergency?: IEmergencyConfig;
  medical?: IMedicalConfig;
}

export interface IDashboardSettings {
  title: string;
  subtitle: string;
  refreshInterval: number;
  autoRefresh: boolean;
  maxAlertsDisplay: number;
  enableFiltering: boolean;
  enableTimeControls: boolean;
  emergencyMode?: boolean;
  medicalStaffDashboard?: boolean;
}

export interface ILayoutConfig {
  header: IHeaderLayout;
  grid: IGridLayout;
  alertSummary: IAlertSummaryLayout;
  monitoringCards: IMonitoringCardsLayout;
}

export interface IHeaderLayout {
  height: string;
  padding: string;
  backgroundColor: string;
  borderBottom: string;
}

export interface IGridLayout {
  spacing: number;
  columns: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface IAlertSummaryLayout {
  marginBottom: string;
  padding: string;
  borderRadius: string;
  emergencyHighlight?: boolean;
}

export interface IMonitoringCardsLayout {
  minHeight: string;
  padding: string;
  medicalCardHeight?: string;
}

export interface IAlertConfig {
  severity: Record<string, IAlertSeverity>;
  actions: Record<string, string>;
  templates: Record<string, IAlertTemplate>;
}

export interface IAlertSeverity {
  icon: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  priority: number;
  label: string;
  requiresImmediate: boolean;
  medicalResponse?: boolean;
  autoEscalate?: number;
  familyNotification?: boolean;
}

export interface IAlertTemplate {
  icon: string;
  title: string;
  category: string;
  defaultActions: string[];
  medicalPriority?: boolean;
  emergencyPriority?: boolean;
}

export interface IMonitoringConfig {
  sections: Record<string, IMonitoringSection>;
}

export interface IMonitoringSection {
  title: string;
  icon: string;
  color: string;
  metrics: IMetric[];
  chartType: 'line' | 'bar' | 'area' | 'doughnut' | 'radar';
  updateInterval: number;
  emergencyThreshold?: number;
  medicalRelevance?: boolean;
}

export interface IMetric {
  key: string;
  label: string;
  unit: string;
  normal: [number, number];
  alertThreshold?: number;
}

export interface IFiltersConfig {
  timeRange: IFilterOption;
  severity: IFilterOptions;
  category: IFilterOptions;
  careLevel?: IFilterOptions;
  location?: IFilterOptions;
}

export interface IFilterOption {
  default: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface IFilterOptions {
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface IVisualizationConfig {
  charts: IChartsConfig;
  colors: IColorsConfig;
}

export interface IChartsConfig {
  defaultHeight: number;
  animationDuration: number;
  gridLines: boolean;
  showLegend: boolean;
  responsive: boolean;
  maintainAspectRatio: boolean;
  emergencyOverlays?: boolean;
  medicalAnnotations?: boolean;
}

export interface IColorsConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  medical?: string;
  emergency?: string;
  cognitive?: string;
  physical?: string;
  social?: string;
  medication?: string;
  gradient: string[];
}

export interface IRealtimeConfig {
  websocketEnabled: boolean;
  fallbackPolling: boolean;
  pollingInterval: number;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
  emergencyPriority?: boolean;
  medicalPriority?: boolean;
}

export interface INotificationsConfig {
  enabled: boolean;
  position: string;
  autoHide: boolean;
  criticalTimeout: number;
  warningTimeout: number;
  infoTimeout: number;
  maxVisible: number;
  emergencySound?: boolean;
  medicalStaffNotifications?: boolean;
  familyNotifications?: boolean;
}

export interface ICardsConfig {
  alert: ICardConfig;
  monitoring: IMonitoringCardConfig;
}

export interface ICardConfig {
  borderRadius: string;
  padding: {
    header: string;
    content: string;
    actions: string;
  };
  elevation: number;
  maxWidth: string;
  emergencyBorder?: string;
  medicalHighlight?: boolean;
}

export interface IMonitoringCardConfig {
  borderRadius: string;
  padding: {
    header: string;
    content: string;
  };
  elevation: number;
  headerHeight: string;
  emergencyIndicator?: boolean;
  vitalSignsLayout?: string;
}

export interface ITextConfig {
  headers: Record<string, string>;
  messages: Record<string, string>;
  buttons: Record<string, string>;
  tooltips: Record<string, string>;
}

export interface IEmergencyConfig {
  enabled: boolean;
  autoDetection: IAutoDetectionConfig;
  responseProtocols: Record<string, IResponseProtocol>;
  escalationRules: IEscalationRules;
}

export interface IAutoDetectionConfig {
  fallDetection: boolean;
  vitalSignsAnomalies: boolean;
  behavioralChanges: boolean;
  medicationErrors: boolean;
}

export interface IResponseProtocol {
  name: string;
  timeLimit: number;
  actions: string[];
}

export interface IEscalationRules {
  autoEscalation: boolean;
  escalationTimeouts: number[];
  medicalStaffRequired: boolean;
  familyNotificationRequired: boolean;
}

export interface IMedicalConfig {
  vitalSignsIntegration: IVitalSignsIntegration;
  medicationTracking: IMedicationTracking;
  assessmentTools: IAssessmentTools;
}

export interface IVitalSignsIntegration {
  enabled: boolean;
  devices: string[];
  autoSync: boolean;
  syncInterval: number;
}

export interface IMedicationTracking {
  enabled: boolean;
  systems: string[];
  adherenceMonitoring: boolean;
  interactionChecking: boolean;
}

export interface IAssessmentTools {
  cognitiveAssessments: string[];
  functionalAssessments: string[];
  moodAssessments: string[];
} 