export interface IHomePageData {
  hero: IHeroSection;
  aiStatus: IAIStatusSection;
  primaryAction: IPrimaryAction;
  primaryActions: IPrimaryActionsSection;
  statistics: IStatisticsSection;
  features: IFeaturesSection;
  quickAccess: IQuickAccessSection;
  systemStatus: ISystemStatusSection;
  proTip: IProTipSection;
  monitoringCapabilities: IMonitoringCapabilitiesSection;
  navigation: INavigationSection;
  buttons: IButtonLabels;
  messages: IMessages;
  tooltips: ITooltips;
  trustBuilders: ITrustBuildersSection;
  analytics: IAnalyticsConfig;
}

export interface IHeroSection {
  title: string;
  subtitle: string;
  version: string;
  tagline: string;
}

export interface IAIStatusSection {
  overall: string;
  circuitBreaker: string;
  anthropic: string;
}

export interface IPrimaryAction {
  text: string;
  route: string;
}

export interface IPrimaryActionsSection {
  sectionTitle: string;
  mainAction: IPrimaryActionItem;
  secondaryAction: IPrimaryActionItem;
}

export interface IPrimaryActionItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  isPrimary: boolean;
}

export interface IStatisticsSection {
  horsesAnalyzed: IStatistic;
  aiInsights: IStatistic;
  videoHours: IStatistic;
  facilities: IStatistic;
}

export interface IStatistic {
  value: string;
  label: string;
}

export interface IFeaturesSection {
  sectionTitle: string;
  list: IFeature[];
}

export interface IFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface IQuickAccessSection {
  sectionTitle: string;
  items: IQuickAccessItem[];
}

export interface IQuickAccessItem {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
}

export interface ISystemStatusSection {
  activeCameras: ISystemStatusItem;
  monitoringStatus: ISystemStatusItem;
  aiAnalysis: ISystemStatusItem;
}

export interface ISystemStatusItem {
  value: string;
  label: string;
  status?: string;
}

export interface IProTipSection {
  icon: string;
  title: string;
  message: string;
}

export interface IMonitoringCapabilitiesSection {
  icon: string;
  title: string;
  description: string;
  features: IMonitoringFeature[];
}

export interface IMonitoringFeature {
  icon: string;
  text: string;
}

export interface INavigationSection {
  backToHome: string;
  dashboard: string;
  settings: string;
}

export interface IButtonLabels {
  startMonitoring: string;
  viewDetails: string;
  getStarted: string;
  learnMore: string;
}

export interface IMessages {
  welcome: string;
  systemReady: string;
  noActiveCameras: string;
  connectionError: string;
  loading: string;
}

export interface ITooltips {
  aiStatus: string;
  statistics: string;
  quickAccess: string;
  systemStatus: string;
  proTip: string;
}

export interface ITrustBuildersSection {
  sectionTitle: string;
  testimonials: ITestimonial[];
  certifications: string[];
}

export interface ITestimonial {
  quote: string;
  source: string;
}

export interface IAnalyticsConfig {
  trackPageView: boolean;
  trackButtonClicks: boolean;
  trackFeatureUsage: boolean;
  trackQuickAccessClicks: boolean;
  trackEmotionalEngagement: boolean;
  trackConversionGoals: string[];
} 