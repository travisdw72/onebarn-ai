export interface IDashboardSettings {
  title: string;
  subtitle: string;
  refreshInterval: number;
  autoRefresh: boolean;
  maxAlertsDisplay: number;
  enableFiltering: boolean;
  enableTimeControls: boolean;
}

export interface ILayoutConfig {
  header: {
    height: string;
    padding: string;
    backgroundColor: string;
    borderBottom: string;
  };
  grid: {
    spacing: number;
    columns: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  alertSummary: {
    marginBottom: string;
    padding: string;
    borderRadius: string;
  };
  monitoringCards: {
    minHeight: string;
    padding: string;
  };
}

export interface ISeverityConfig {
  icon: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  priority: number;
  label: string;
  requiresImmediate: boolean;
}

export interface IMetricConfig {
  key: string;
  label: string;
  unit: string;
  normal: [number, number];
}

export interface IMonitoringSectionConfig {
  title: string;
  icon: string;
  color: string;
  metrics: IMetricConfig[];
  chartType: "line" | "area" | "bar" | "doughnut";
  updateInterval: number;
}

export interface IAlertTemplateConfig {
  icon: string;
  title: string;
  category: string;
  defaultActions: string[];
}

export interface IFilterOption {
  value: string;
  label: string;
}

export interface IFilterConfig {
  timeRange: {
    default: string;
    options: IFilterOption[];
  };
  severity: {
    options: IFilterOption[];
  };
  category: {
    options: IFilterOption[];
  };
}

export interface IVisualizationConfig {
  charts: {
    defaultHeight: number;
    animationDuration: number;
    gridLines: boolean;
    showLegend: boolean;
    responsive: boolean;
    maintainAspectRatio: boolean;
  };
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    gradient: string[];
  };
}

export interface IRealtimeConfig {
  websocketEnabled: boolean;
  fallbackPolling: boolean;
  pollingInterval: number;
  reconnectAttempts: number;
  reconnectDelay: number;
  heartbeatInterval: number;
}

export interface INotificationConfig {
  enabled: boolean;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  autoHide: boolean;
  criticalTimeout: number;
  warningTimeout: number;
  infoTimeout: number;
  maxVisible: number;
}

export interface ICardConfig {
  alert: {
    borderRadius: string;
    padding: {
      header: string;
      content: string;
      actions: string;
    };
    elevation: number;
    maxWidth: string;
  };
  monitoring: {
    borderRadius: string;
    padding: {
      header: string;
      content: string;
    };
    elevation: number;
    headerHeight: string;
  };
}

export interface ITextConfig {
  headers: {
    dashboard: string;
    activeAlerts: string;
    alertSummary: string;
    monitoringGrid: string;
  };
  messages: {
    noAlerts: string;
    loadingAlerts: string;
    errorLoadingAlerts: string;
    noData: string;
    connecting: string;
    disconnected: string;
  };
  buttons: {
    refresh: string;
    acknowledge: string;
    viewAll: string;
    filter: string;
    export: string;
    fullscreen: string;
  };
  tooltips: {
    refresh: string;
    acknowledge: string;
    viewDetails: string;
    filter: string;
    timeRange: string;
  };
}

export interface IAIMonitorConfig {
  dashboard: IDashboardSettings;
  layout: ILayoutConfig;
  alerts: {
    severity: {
      critical: ISeverityConfig;
      warning: ISeverityConfig;
      info: ISeverityConfig;
    };
    actions: {
      acknowledge: string;
      escalate: string;
      viewDetails: string;
      addNote: string;
      viewHistory: string;
      requestCheck: string;
      viewCamera: string;
    };
    templates: {
      vital_signs: IAlertTemplateConfig;
      behavior: IAlertTemplateConfig;
      movement: IAlertTemplateConfig;
      social: IAlertTemplateConfig;
      environmental: IAlertTemplateConfig;
    };
  };
  monitoring: {
    sections: {
      vitalSigns: IMonitoringSectionConfig;
      behavior: IMonitoringSectionConfig;
      movement: IMonitoringSectionConfig;
      social: IMonitoringSectionConfig;
    };
  };
  filters: IFilterConfig;
  visualization: IVisualizationConfig;
  realtime: IRealtimeConfig;
  notifications: INotificationConfig;
  cards: ICardConfig;
  text: ITextConfig;
}

// Additional type definitions for component props
export interface IAIAlertCardProps {
  alert: {
    id: string;
    type: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    timestamp: string;
    horseId?: string;
    horseName?: string;
    isAcknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: string;
    metadata?: Record<string, any>;
  };
  onAcknowledge?: (alertId: string) => void;
  onViewDetails?: (alertId: string) => void;
  onAction?: (alertId: string, action: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface IMonitoringCardProps {
  section: keyof IAIMonitorConfig['monitoring']['sections'];
  data?: Record<string, any>;
  isLoading?: boolean;
  error?: string;
  onRefresh?: () => void;
  showControls?: boolean;
}

export interface IAIMonitorDashboardProps {
  tenantId: string;
  horseId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  initialFilters?: {
    timeRange?: string;
    severity?: string;
    category?: string;
  };
  onAlertAction?: (alertId: string, action: string) => void;
} 