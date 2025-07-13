// Zero Trust AI Monitor Dashboard Configuration Interfaces
export interface IZeroTrustConfig {
  securityPolicies: ISecurityPolicy[];
  dataClassification: IDataClassification;
  accessControl: IAccessControlMatrix;
  threatDetection: IThreatDetectionConfig;
  sessionManagement: ISessionManagementConfig;
  deviceTrust: IDeviceTrustConfig;
  riskAssessment: IRiskAssessmentConfig;
}

export interface ISecurityPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: IPolicyCondition[];
  actions: IPolicyAction[];
  priority: number;
  effectiveDate: string;
  expirationDate?: string;
}

export interface IPolicyCondition {
  type: 'role' | 'time' | 'location' | 'device' | 'riskScore' | 'dataClassification';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: string | number | string[];
}

export interface IPolicyAction {
  type: 'allow' | 'deny' | 'require2fa' | 'logEvent' | 'restrictAccess' | 'terminateSession';
  parameters?: Record<string, any>;
}

export interface IDataClassification {
  levels: IClassificationLevel[];
  handlingRules: IDataHandlingRule[];
  watermarkSettings: IWatermarkConfig;
  exportRestrictions: IExportRestriction[];
}

export interface IClassificationLevel {
  id: string;
  name: string;
  color: string;
  description: string;
  restrictions: string[];
  retentionDays: number;
}

export interface IDataHandlingRule {
  classificationId: string;
  allowScreenshots: boolean;
  allowCopyPaste: boolean;
  allowPrint: boolean;
  allowExport: boolean;
  requireJustification: boolean;
  auditRequired: boolean;
}

export interface IWatermarkConfig {
  enabled: boolean;
  text: string;
  opacity: number;
  fontSize: string;
  color: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
}

export interface IExportRestriction {
  classificationId: string;
  allowedFormats: string[];
  requireApproval: boolean;
  maxRecords: number;
  retentionDays: number;
}

export interface IAccessControlMatrix {
  roles: IRolePermissions[];
  resources: IResourcePermissions[];
  contextualRules: IContextualRule[];
}

export interface IRolePermissions {
  roleId: string;
  roleName: string;
  permissions: IPermissionGrant[];
  inheritFrom?: string[];
  maxSessionDuration: number;
  allowedLocations?: string[];
  allowedDeviceTypes?: string[];
}

export interface IPermissionGrant {
  resource: string;
  actions: string[];
  conditions?: IPolicyCondition[];
  dataFilters?: IDataFilter[];
  timeRestrictions?: ITimeRestriction[];
}

export interface IDataFilter {
  field: string;
  operator: string;
  value: any;
  description: string;
}

export interface ITimeRestriction {
  dayOfWeek: number[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface IResourcePermissions {
  resourceId: string;
  resourceName: string;
  requiredPermissions: string[];
  dataClassification: string;
  ownershipModel: 'user' | 'tenant' | 'global';
}

export interface IContextualRule {
  id: string;
  name: string;
  trigger: ITriggerCondition;
  permissionModifications: IPermissionModification[];
  enabled: boolean;
}

export interface ITriggerCondition {
  type: 'timeOfDay' | 'location' | 'deviceRisk' | 'userBehavior' | 'dataAccess';
  parameters: Record<string, any>;
}

export interface IPermissionModification {
  action: 'grant' | 'revoke' | 'elevate' | 'restrict';
  permissions: string[];
  duration?: number;
  justification?: string;
}

export interface IThreatDetectionConfig {
  anomalyDetection: IAnomalyDetectionConfig;
  behaviorAnalytics: IBehaviorAnalyticsConfig;
  threatIntelligence: IThreatIntelligenceConfig;
  responseActions: IResponseActionConfig[];
}

export interface IAnomalyDetectionConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  algorithms: string[];
  thresholds: Record<string, number>;
  learningPeriodDays: number;
}

export interface IBehaviorAnalyticsConfig {
  trackingEnabled: boolean;
  metrics: string[];
  baselinePeriodDays: number;
  alertThresholds: Record<string, number>;
}

export interface IThreatIntelligenceConfig {
  feeds: IThreatFeed[];
  updateInterval: number;
  autoBlock: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface IThreatFeed {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  enabled: boolean;
  feedType: 'ip' | 'domain' | 'hash' | 'signature';
}

export interface IResponseActionConfig {
  triggerId: string;
  actions: ISecurityAction[];
  severity: string;
  autoExecute: boolean;
  requireApproval: boolean;
}

export interface ISecurityAction {
  type: 'lockAccount' | 'requireReauth' | 'blockIP' | 'logEvent' | 'notify' | 'escalate';
  parameters: Record<string, any>;
  delay?: number;
}

export interface ISessionManagementConfig {
  maxConcurrentSessions: number;
  sessionTimeout: number;
  idleTimeout: number;
  absoluteTimeout: number;
  requireReauth: boolean;
  reauthInterval: number;
  deviceBinding: boolean;
  locationBinding: boolean;
}

export interface IDeviceTrustConfig {
  trustLevels: IDeviceTrustLevel[];
  riskFactors: IDeviceRiskFactor[];
  complianceChecks: IComplianceCheck[];
  certificateRequirements: ICertificateRequirement[];
}

export interface IDeviceTrustLevel {
  id: string;
  name: string;
  score: number;
  requirements: string[];
  permissions: string[];
  sessionLimits: ISessionLimits;
}

export interface ISessionLimits {
  maxDuration: number;
  maxIdleTime: number;
  requirePeriodicVerification: boolean;
  verificationInterval: number;
}

export interface IDeviceRiskFactor {
  factor: string;
  weight: number;
  thresholds: Record<string, number>;
  description: string;
}

export interface IComplianceCheck {
  id: string;
  name: string;
  required: boolean;
  checkType: 'certificate' | 'encryption' | 'patch' | 'antivirus' | 'policy';
  parameters: Record<string, any>;
}

export interface ICertificateRequirement {
  type: 'client' | 'device' | 'user';
  issuer: string;
  validityPeriod: number;
  keyLength: number;
  algorithms: string[];
}

export interface IRiskAssessmentConfig {
  factors: IRiskFactor[];
  scoring: IRiskScoringConfig;
  thresholds: IRiskThreshold[];
  actions: IRiskAction[];
}

export interface IRiskFactor {
  id: string;
  name: string;
  weight: number;
  calculation: 'static' | 'dynamic' | 'behavioral';
  dataSource: string;
  updateInterval: number;
}

export interface IRiskScoringConfig {
  algorithm: 'weighted' | 'machine_learning' | 'rule_based';
  modelVersion: string;
  updateFrequency: 'realtime' | 'hourly' | 'daily';
  normalization: 'linear' | 'logarithmic' | 'exponential';
}

export interface IRiskThreshold {
  level: 'low' | 'medium' | 'high' | 'critical';
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
}

export interface IRiskAction {
  riskLevel: string;
  actions: ISecurityAction[];
  autoExecute: boolean;
  escalationPath: string[];
}

// AI Monitor Dashboard Core Interfaces
export interface IAIMonitorConfig {
  dashboard: IDashboardConfig;
  alerts: IAlertConfig;
  monitoring: IMonitoringConfig;
  realtime: IRealtimeConfig;
  notifications: INotificationConfig;
  visualization: IVisualizationConfig;
  export: IExportConfig;
  zeroTrust: IZeroTrustConfig;
}

export interface IDashboardConfig {
  layout: ILayoutConfig;
  refreshInterval: number;
  maxAlertsDisplay: number;
  defaultView: 'grid' | 'list' | 'timeline';
  autoRefresh: boolean;
  compactMode: boolean;
  themes: IThemeConfig[];
}

export interface ILayoutConfig {
  columns: number;
  mobileColumns: number;
  tabletColumns: number;
  gridSpacing: number;
  cardMinHeight: number;
  cardMaxHeight: number;
  headerHeight: number;
  footerHeight: number;
}

export interface IThemeConfig {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface IAlertConfig {
  severityLevels: ISeverityLevel[];
  categories: IAlertCategory[];
  actions: IAlertAction[];
  escalation: IEscalationConfig;
  retention: IRetentionConfig;
  filtering: IFilterConfig;
}

export interface ISeverityLevel {
  id: string;
  name: string;
  level: number;
  color: string;
  backgroundColor: string;
  borderColor: string;
  icon: string;
  description: string;
  autoEscalateMinutes?: number;
  requiresAcknowledgment: boolean;
  notificationChannels: string[];
}

export interface IAlertCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultSeverity: string;
  monitoringTypes: string[];
  keywords: string[];
}

export interface IAlertAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredPermissions: string[];
  confirmationRequired: boolean;
  auditLevel: 'none' | 'basic' | 'detailed';
}

export interface IEscalationConfig {
  rules: IEscalationRule[];
  contacts: IEscalationContact[];
  templates: IEscalationTemplate[];
}

export interface IEscalationRule {
  id: string;
  name: string;
  conditions: IEscalationCondition[];
  actions: IEscalationAction[];
  delay: number;
  repeat: boolean;
  repeatInterval?: number;
}

export interface IEscalationCondition {
  field: string;
  operator: string;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface IEscalationAction {
  type: 'notify' | 'assign' | 'escalate' | 'autoResolve';
  target: string;
  parameters: Record<string, any>;
}

export interface IEscalationContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  notificationPreferences: INotificationPreference[];
}

export interface INotificationPreference {
  channel: 'email' | 'sms' | 'push' | 'slack' | 'teams';
  severity: string[];
  timeRestrictions?: ITimeRestriction;
  enabled: boolean;
}

export interface IEscalationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  channels: string[];
}

export interface IRetentionConfig {
  policies: IRetentionPolicy[];
  archival: IArchivalConfig;
  purging: IPurgingConfig;
}

export interface IRetentionPolicy {
  alertType: string;
  severity: string;
  retentionDays: number;
  archiveAfterDays?: number;
  compressionEnabled: boolean;
}

export interface IArchivalConfig {
  enabled: boolean;
  storage: 'local' | 's3' | 'azure' | 'gcp';
  compression: 'none' | 'gzip' | 'lz4';
  encryption: boolean;
  indexing: boolean;
}

export interface IPurgingConfig {
  enabled: boolean;
  schedule: string;
  batchSize: number;
  confirmationRequired: boolean;
  auditRetentionDays: number;
}

export interface IFilterConfig {
  quick: IQuickFilter[];
  advanced: IAdvancedFilter[];
  saved: ISavedFilter[];
  defaults: IDefaultFilter;
}

export interface IQuickFilter {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: any;
  icon?: string;
  color?: string;
}

export interface IAdvancedFilter {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'range';
  field: string;
  options?: IFilterOption[];
  validation?: IFilterValidation;
}

export interface IFilterOption {
  value: any;
  label: string;
  color?: string;
  icon?: string;
}

export interface IFilterValidation {
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface ISavedFilter {
  id: string;
  name: string;
  description?: string;
  filters: IAppliedFilter[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export interface IAppliedFilter {
  field: string;
  operator: string;
  value: any;
}

export interface IDefaultFilter {
  severity: string[];
  timeRange: string;
  categories: string[];
  status: string[];
  maxResults: number;
}

export interface IMonitoringConfig {
  sections: IMonitoringSection[];
  vitals: IVitalsConfig;
  behavior: IBehaviorConfig;
  movement: IMovementConfig;
  social: ISocialConfig;
  environment: IEnvironmentConfig;
}

export interface IMonitoringSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  enabled: boolean;
  metrics: IMetric[];
  thresholds: IThreshold[];
  alerts: string[];
  visualization: string;
  updateInterval: number;
  dataRetentionDays: number;
}

export interface IMetric {
  id: string;
  name: string;
  unit: string;
  type: 'numeric' | 'boolean' | 'categorical' | 'text';
  range?: {min: number; max: number};
  precision?: number;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count' | 'last';
}

export interface IThreshold {
  metricId: string;
  name: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | number[];
  severity: string;
  enabled: boolean;
  hysteresis?: number;
}

export interface IVitalsConfig {
  heartRate: IVitalConfig;
  temperature: IVitalConfig;
  respiratoryRate: IVitalConfig;
  bloodPressure?: IVitalConfig;
  oxygenSaturation?: IVitalConfig;
}

export interface IVitalConfig {
  enabled: boolean;
  normalRange: {min: number; max: number};
  warningRange: {min: number; max: number};
  criticalRange: {min: number; max: number};
  unit: string;
  precision: number;
  sampleRate: number;
}

export interface IBehaviorConfig {
  patterns: IBehaviorPattern[];
  anomalyDetection: boolean;
  learningPeriodDays: number;
  sensitivity: 'low' | 'medium' | 'high';
  categories: IBehaviorCategory[];
}

export interface IBehaviorPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  normalFrequency: {min: number; max: number; unit: string};
  alertConditions: IAlertCondition[];
}

export interface IBehaviorCategory {
  id: string;
  name: string;
  description: string;
  behaviors: string[];
  severity: string;
}

export interface IAlertCondition {
  type: 'frequency' | 'duration' | 'intensity' | 'pattern';
  operator: string;
  value: number;
  timeWindow: number;
  consecutiveOccurrences?: number;
}

export interface IMovementConfig {
  tracking: ITrackingConfig;
  zones: IZoneConfig[];
  activity: IActivityConfig;
  gait: IGaitConfig;
}

export interface ITrackingConfig {
  enabled: boolean;
  accuracy: 'low' | 'medium' | 'high';
  updateInterval: number;
  historyRetentionDays: number;
  geofencing: boolean;
}

export interface IZoneConfig {
  id: string;
  name: string;
  description: string;
  boundaries: ICoordinate[];
  type: 'safe' | 'restricted' | 'alert' | 'emergency';
  actions: string[];
}

export interface ICoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface IActivityConfig {
  types: IActivityType[];
  detection: IActivityDetection;
  goals: IActivityGoal[];
}

export interface IActivityType {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  thresholds: IThreshold[];
}

export interface IActivityDetection {
  enabled: boolean;
  algorithms: string[];
  confidence: number;
  validation: boolean;
}

export interface IActivityGoal {
  id: string;
  name: string;
  metric: string;
  target: number;
  timeframe: string;
  priority: 'low' | 'medium' | 'high';
}

export interface IGaitConfig {
  analysis: IGaitAnalysis;
  patterns: IGaitPattern[];
  abnormalities: IGaitAbnormality[];
}

export interface IGaitAnalysis {
  enabled: boolean;
  frequency: number;
  duration: number;
  metrics: string[];
  comparison: boolean;
}

export interface IGaitPattern {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  normalRange: Record<string, {min: number; max: number}>;
}

export interface IGaitAbnormality {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  severity: string;
  recommendations: string[];
}

export interface ISocialConfig {
  interactions: ISocialInteraction[];
  groups: ISocialGroup[];
  hierarchy: IHierarchyConfig;
  compatibility: ICompatibilityConfig;
}

export interface ISocialInteraction {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  indicators: string[];
  frequency: {normal: {min: number; max: number}; unit: string};
}

export interface ISocialGroup {
  id: string;
  name: string;
  description: string;
  members: string[];
  dynamics: string[];
  monitoring: boolean;
}

export interface IHierarchyConfig {
  enabled: boolean;
  factors: string[];
  updateFrequency: number;
  visualization: boolean;
}

export interface ICompatibilityConfig {
  enabled: boolean;
  factors: string[];
  scoring: 'numeric' | 'categorical';
  recommendations: boolean;
}

export interface IEnvironmentConfig {
  sensors: IEnvironmentSensor[];
  conditions: IEnvironmentCondition[];
  automation: IEnvironmentAutomation;
}

export interface IEnvironmentSensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'air_quality' | 'noise' | 'light';
  unit: string;
  range: {min: number; max: number};
  accuracy: number;
  calibrationDate?: string;
}

export interface IEnvironmentCondition {
  id: string;
  name: string;
  description: string;
  sensors: string[];
  thresholds: IThreshold[];
  responses: IEnvironmentResponse[];
}

export interface IEnvironmentResponse {
  condition: string;
  action: string;
  parameters: Record<string, any>;
  delay?: number;
  automation: boolean;
}

export interface IEnvironmentAutomation {
  enabled: boolean;
  rules: IAutomationRule[];
  override: boolean;
  logging: boolean;
}

export interface IAutomationRule {
  id: string;
  name: string;
  triggers: ITrigger[];
  actions: IAction[];
  schedule?: ISchedule;
  enabled: boolean;
}

export interface ITrigger {
  type: 'sensor' | 'time' | 'event' | 'manual';
  parameters: Record<string, any>;
  conditions: ICondition[];
}

export interface IAction {
  type: 'device' | 'notification' | 'log' | 'api';
  parameters: Record<string, any>;
  delay?: number;
}

export interface ICondition {
  field: string;
  operator: string;
  value: any;
}

export interface ISchedule {
  type: 'once' | 'recurring' | 'cron';
  startTime: string;
  endTime?: string;
  pattern?: string;
  timezone: string;
}

export interface IRealtimeConfig {
  websocket: IWebSocketConfig;
  polling: IPollingConfig;
  events: IEventConfig;
  reconnection: IReconnectionConfig;
}

export interface IWebSocketConfig {
  enabled: boolean;
  url: string;
  protocols: string[];
  authentication: IWSAuthentication;
  heartbeat: IHeartbeatConfig;
  compression: boolean;
  bufferSize: number;
}

export interface IWSAuthentication {
  type: 'token' | 'certificate' | 'basic';
  credentials: Record<string, string>;
  refreshInterval?: number;
}

export interface IHeartbeatConfig {
  enabled: boolean;
  interval: number;
  timeout: number;
  retries: number;
}

export interface IPollingConfig {
  enabled: boolean;
  interval: number;
  jitter: boolean;
  backoff: IBackoffConfig;
  maxRequests: number;
}

export interface IBackoffConfig {
  strategy: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  multiplier: number;
}

export interface IEventConfig {
  types: IEventType[];
  filtering: IEventFiltering;
  batching: IEventBatching;
  ordering: IEventOrdering;
}

export interface IEventType {
  name: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  throttle?: IThrottleConfig;
  validation?: IEventValidation;
}

export interface IThrottleConfig {
  enabled: boolean;
  maxEvents: number;
  timeWindow: number;
  strategy: 'drop' | 'queue' | 'sample';
}

export interface IEventValidation {
  schema?: string;
  required: string[];
  types: Record<string, string>;
}

export interface IEventFiltering {
  enabled: boolean;
  rules: IFilterRule[];
  defaultAction: 'allow' | 'deny';
}

export interface IFilterRule {
  field: string;
  operator: string;
  value: any;
  action: 'allow' | 'deny';
}

export interface IEventBatching {
  enabled: boolean;
  maxSize: number;
  maxWait: number;
  compression: boolean;
}

export interface IEventOrdering {
  enabled: boolean;
  field: string;
  buffer: number;
  timeout: number;
}

export interface IReconnectionConfig {
  enabled: boolean;
  maxAttempts: number;
  backoff: IBackoffConfig;
  randomization: boolean;
}

export interface INotificationConfig {
  channels: INotificationChannel[];
  templates: INotificationTemplate[];
  preferences: INotificationPreferences;
  delivery: IDeliveryConfig;
}

export interface INotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack' | 'teams';
  enabled: boolean;
  configuration: Record<string, any>;
  rateLimit?: IRateLimit;
}

export interface IRateLimit {
  maxPerMinute: number;
  maxPerHour: number;
  maxPerDay: number;
  burstSize: number;
}

export interface INotificationTemplate {
  id: string;
  name: string;
  channel: string;
  subject?: string;
  body: string;
  variables: string[];
  formatting: ITemplateFormatting;
}

export interface ITemplateFormatting {
  type: 'html' | 'text' | 'markdown';
  styles?: Record<string, string>;
  attachments?: IAttachment[];
}

export interface IAttachment {
  name: string;
  type: string;
  source: 'url' | 'data' | 'file';
  content: string;
}

export interface INotificationPreferences {
  global: IGlobalPreferences;
  perUser: IUserPreferences[];
  perRole: IRolePreferences[];
}

export interface IGlobalPreferences {
  enabled: boolean;
  quietHours: IQuietHours;
  frequency: IFrequencyLimits;
  escalation: boolean;
}

export interface IQuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
  exceptions: string[];
}

export interface IFrequencyLimits {
  maxPerMinute: number;
  maxPerHour: number;
  digestMode: boolean;
  digestInterval: number;
}

export interface IUserPreferences {
  userId: string;
  channels: string[];
  severity: string[];
  categories: string[];
  frequency: IFrequencyLimits;
  quietHours?: IQuietHours;
}

export interface IRolePreferences {
  roleId: string;
  defaultChannels: string[];
  requiredSeverity: string[];
  mandatoryCategories: string[];
  restrictions: string[];
}

export interface IDeliveryConfig {
  retries: IRetryConfig;
  failover: IFailoverConfig;
  tracking: ITrackingConfig;
  analytics: IAnalyticsConfig;
}

export interface IRetryConfig {
  maxAttempts: number;
  backoff: IBackoffConfig;
  conditions: string[];
}

export interface IFailoverConfig {
  enabled: boolean;
  channels: string[];
  conditions: string[];
  delay: number;
}

export interface IAnalyticsConfig {
  enabled: boolean;
  metrics: string[];
  retention: number;
  aggregation: string[];
}

export interface IVisualizationConfig {
  charts: IChartConfig[];
  widgets: IWidgetConfig[];
  themes: IVisualizationTheme[];
  defaults: IVisualizationDefaults;
}

export interface IChartConfig {
  id: string;
  name: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'gauge';
  description: string;
  datasource: string;
  axes: IAxisConfig[];
  series: ISeriesConfig[];
  styling: IChartStyling;
  interactions: IChartInteractions;
}

export interface IAxisConfig {
  id: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  field: string;
  type: 'linear' | 'logarithmic' | 'time' | 'category';
  label: string;
  unit?: string;
  range?: {min: number; max: number};
  formatting?: IAxisFormatting;
}

export interface IAxisFormatting {
  precision: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
}

export interface ISeriesConfig {
  id: string;
  name: string;
  field: string;
  color: string;
  type?: string;
  styling?: ISeriesStyling;
}

export interface ISeriesStyling {
  lineWidth?: number;
  fillOpacity?: number;
  markerSize?: number;
  markerShape?: string;
  pattern?: string;
}

export interface IChartStyling {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  padding: number;
  legend: ILegendConfig;
  grid: IGridConfig;
}

export interface ILegendConfig {
  enabled: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  alignment: 'start' | 'center' | 'end';
  maxItems?: number;
}

export interface IGridConfig {
  enabled: boolean;
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface IChartInteractions {
  zoom: boolean;
  pan: boolean;
  select: boolean;
  tooltip: ITooltipConfig;
  crosshair: ICrosshairConfig;
}

export interface ITooltipConfig {
  enabled: boolean;
  format: string;
  fields: string[];
  styling: Record<string, string>;
}

export interface ICrosshairConfig {
  enabled: boolean;
  color: string;
  width: number;
  style: string;
}

export interface IWidgetConfig {
  id: string;
  name: string;
  type: 'metric' | 'status' | 'progress' | 'list' | 'table' | 'map';
  description: string;
  datasource: string;
  configuration: Record<string, any>;
  styling: IWidgetStyling;
  refresh: IRefreshConfig;
}

export interface IWidgetStyling {
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  padding: number;
  typography: ITypographyConfig;
}

export interface ITypographyConfig {
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface IRefreshConfig {
  enabled: boolean;
  interval: number;
  onDemand: boolean;
  conditions?: string[];
}

export interface IVisualizationTheme {
  id: string;
  name: string;
  colors: string[];
  gradients: IGradient[];
  fonts: IFontConfig[];
  effects: IEffectConfig[];
}

export interface IGradient {
  id: string;
  name: string;
  colors: string[];
  direction: number;
  type: 'linear' | 'radial';
}

export interface IFontConfig {
  family: string;
  weights: number[];
  styles: string[];
  formats: string[];
}

export interface IEffectConfig {
  type: 'shadow' | 'glow' | 'blur' | 'outline';
  parameters: Record<string, any>;
}

export interface IVisualizationDefaults {
  theme: string;
  colors: string[];
  fonts: IFontConfig;
  animations: boolean;
  responsive: boolean;
  accessibility: IAccessibilityConfig;
}

export interface IAccessibilityConfig {
  enabled: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindSupport: boolean;
}

export interface IExportConfig {
  formats: IExportFormat[];
  templates: IExportTemplate[];
  scheduling: ISchedulingConfig;
  distribution: IDistributionConfig;
  security: IExportSecurity;
}

export interface IExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  configuration: Record<string, any>;
  maxSize?: number;
  compression?: boolean;
}

export interface IExportTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  fields: string[];
  filters?: IAppliedFilter[];
  styling?: Record<string, any>;
  variables?: Record<string, string>;
}

export interface ISchedulingConfig {
  enabled: boolean;
  frequencies: IFrequency[];
  timezone: string;
  maxConcurrent: number;
  retries: number;
}

export interface IFrequency {
  id: string;
  name: string;
  cron: string;
  description: string;
}

export interface IDistributionConfig {
  channels: IDistributionChannel[];
  recipients: IRecipient[];
  notifications: boolean;
  confirmations: boolean;
}

export interface IDistributionChannel {
  id: string;
  name: string;
  type: 'email' | 'ftp' | 'sftp' | 's3' | 'webhook';
  configuration: Record<string, any>;
  authentication?: Record<string, string>;
}

export interface IRecipient {
  id: string;
  name: string;
  email?: string;
  channels: string[];
  formats: string[];
  schedule?: string;
}

export interface IExportSecurity {
  encryption: IEncryptionConfig;
  access: IAccessConfig;
  audit: IAuditConfig;
  retention: IRetentionConfig;
}

export interface IEncryptionConfig {
  enabled: boolean;
  algorithm: string;
  keySize: number;
  passwordProtection: boolean;
  certificateProtection: boolean;
}

export interface IAccessConfig {
  permissions: string[];
  roles: string[];
  approval: IApprovalConfig;
  restrictions: IRestrictionConfig[];
}

export interface IApprovalConfig {
  required: boolean;
  approvers: string[];
  timeout: number;
  escalation: string[];
}

export interface IRestrictionConfig {
  type: 'time' | 'location' | 'device' | 'network';
  conditions: Record<string, any>;
  message: string;
}

export interface IAuditConfig {
  enabled: boolean;
  events: string[];
  retention: number;
  notifications: boolean;
}

export interface ISecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  userId?: string;
  tenantId: string;
  source: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo?: {
    deviceId?: string;
    platform?: string;
    browser?: string;
    version?: string;
  };
  riskScore?: number;
  actions?: string[];
  resolved?: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
} 