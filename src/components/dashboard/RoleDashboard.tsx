import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { dashboardConfig, getDashboardModulesForRole, getQuickActionsForRole, getAnalyticsForRole, getRoleTheme, getWelcomeMessage } from '../../config/dashboardConfig';
import { ROLE_PERMISSIONS, hasPermission, canAccessModule } from '../../config/permissions.config';
import { SecureAIChat } from '../common/SecureAIChat';
import { useSecureAIChat } from '../../hooks/useSecureAIChat';
import { DashboardFooter } from '../layout/DashboardFooter';
import { AIAlertWidget } from '../ai/AIAlertWidget';
import { AIObservationDashboard } from '../ai/AIObservationDashboard';
import { Header } from '../layout/Header';
import { aiConfig } from '../../config/aiConfig';
import { useAI } from '../../contexts/AIContext';
import { useTenant } from '../../contexts/TenantContext';
import QuickAccess from '../navigation/QuickAccess';
import { ClientSupportTab } from '../client/support/ClientSupportTab';
import { EmployeeSupportTab } from '../employee/support/EmployeeSupportTab';
import { ManagerSupportTab } from '../manager/support/ManagerSupportTab';
import { VeterinarianSupportTab } from '../veterinarian/support/VeterinarianSupportTab';
import { EnhancedSupportStaffTab } from '../support/enhanced/EnhancedSupportStaffTab';
import { 
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Psychology as AIIcon,
  People as PeopleIcon,
  MonitorHeart as MonitorIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  Speed as PerformanceIcon,
  CloudSync as CloudIcon,
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminIcon,
  BarChart as ChartIcon,
  Pets as HorseIcon,
  HealthAndSafety as HealthIcon,
  EmojiEvents as TrophyIcon,
  CameraAlt as CameraIcon,
  Receipt as BillingIcon,
  Headset as SupportIcon,
  Person as PersonIcon
} from '@mui/icons-material';

interface IRoleDashboardProps {
  userRole?: string; // Optional prop to override user role for testing
}

interface IAnalyticsCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface ISystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  performance: string;
  lastCheck: string;
}

interface IUserMetric {
  role: string;
  count: number;
  active: number;
  growth: string;
  color: string;
}

interface IAlert {
  id: string;
  type: 'system' | 'business' | 'user' | 'ai' | 'health' | 'security';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface IQuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route?: string;
  action?: string | (() => void); // Support both string and function actions
}

export const RoleDashboard: React.FC<IRoleDashboardProps> = ({ userRole: propUserRole }) => {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const { isEnabled } = useAI();
  const { tenantId } = useTenant();
  
  // Determine user role from props or auth context
  const userRole = propUserRole || user?.role || 'employee';
  const roleConfig = ROLE_PERMISSIONS[userRole];
  
  // Get role-specific configuration
  const availableModules = getDashboardModulesForRole(userRole);
  const quickActions = getQuickActionsForRole(userRole);
  const analyticsMetrics = getAnalyticsForRole(userRole);
  const roleTheme = getRoleTheme(userRole);
  const welcomeMessage = getWelcomeMessage(userRole, user?.name || user?.email?.split('@')[0]);
  
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAIDashboard, setShowAIDashboard] = useState(false);

  // Convert user to User type for AI chat
  const aiChatUser = {
    id: user?.id || `${userRole}-001`,
    name: user?.name || user?.email?.split('@')[0] || userRole,
    email: user?.email || `${userRole}@example.com`,
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: new Date().toISOString(),
    barn: user?.barn || 'Sunset Stables',
    joinDate: user?.joinDate || '2024-01-01',
    permissions: roleConfig?.permissions.map(p => p.resource) || []
  };

  // Initialize secure AI chat
  const { isChatEnabled } = useSecureAIChat({ 
    user: aiChatUser, 
    context: 'dashboard' 
  });

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigateTo('login');
      return;
    }
  }, [user, navigateTo]);

  // Mock data - in real app, this would come from APIs filtered by role
  const [analyticsData] = useState<IAnalyticsCard[]>([
    {
      id: 'total-horses',
      title: dashboardConfig.analyticsMetrics['total-horses'].title,
      value: userRole === 'client' ? '2' : userRole === 'admin' ? '347' : '24',
      change: '+12 this month',
      trend: 'up' as const,
      color: dashboardConfig.analyticsMetrics['total-horses'].color,
      icon: <HorseIcon sx={{ fontSize: '2rem' }} />,
      description: dashboardConfig.analyticsMetrics['total-horses'].description
    },
    {
      id: 'health-alerts',
      title: dashboardConfig.analyticsMetrics['health-alerts'].title,
      value: userRole === 'veterinarian' ? '8' : userRole === 'client' ? '0' : '2',
      change: userRole === 'client' ? 'All clear' : '-50% this week',
      trend: userRole === 'client' ? ('stable' as const) : ('down' as const),
      color: dashboardConfig.analyticsMetrics['health-alerts'].color,
      icon: <HealthIcon sx={{ fontSize: '2rem' }} />,
      description: dashboardConfig.analyticsMetrics['health-alerts'].description
    },
    {
      id: 'training-sessions',
      title: dashboardConfig.analyticsMetrics['training-sessions'].title,
      value: userRole === 'trainer' ? '12' : userRole === 'client' ? '3' : '8',
      change: '+5 today',
      trend: 'up' as const,
      color: dashboardConfig.analyticsMetrics['training-sessions'].color,
      icon: <TrophyIcon sx={{ fontSize: '2rem' }} />,
      description: dashboardConfig.analyticsMetrics['training-sessions'].description
    },
    {
      id: 'ai-insights',
      title: dashboardConfig.analyticsMetrics['ai-insights'].title,
      value: userRole === 'manager' || userRole === 'admin' ? '2,847' : '127',
      change: '+234 today',
      trend: 'up' as const,
      color: dashboardConfig.analyticsMetrics['ai-insights'].color,
      icon: <AIIcon sx={{ fontSize: '2rem' }} />,
      description: dashboardConfig.analyticsMetrics['ai-insights'].description
    }
  ].filter(metric => analyticsMetrics.includes(metric.id)));

  const [systemHealth] = useState<ISystemHealth[]>([
    {
      component: 'OpenAI Integration',
      status: 'healthy',
      uptime: '99.8%',
      performance: '145ms avg',
      lastCheck: '2 min ago'
    },
    {
      component: 'Anthropic Claude',
      status: 'healthy',
      uptime: '99.6%',
      performance: '189ms avg',
      lastCheck: '2 min ago'
    },
    {
      component: 'Video Analysis Engine',
      status: 'warning',
      uptime: '98.2%',
      performance: '2.3s avg',
      lastCheck: '5 min ago'
    },
    {
      component: 'Real-time Monitoring',
      status: 'healthy',
      uptime: '99.9%',
      performance: '89ms avg',
      lastCheck: '1 min ago'
    }
  ]);

  const [alerts] = useState<IAlert[]>([
    {
      id: 'alert-1',
      type: 'ai',
      severity: 'high',
      title: 'AI Model Performance Degradation',
      message: 'Video analysis model showing 15% accuracy decrease. Requires attention.',
      timestamp: '2024-06-15T14:30:00Z',
      acknowledged: false
    },
    {
      id: 'alert-2',
      type: 'health',
      severity: 'medium',
      title: 'Horse Health Alert',
      message: userRole === 'client' ? 'Thunder Bay requires veterinary attention within 24 hours.' : 'Multiple horses showing elevated temperature readings.',
      timestamp: '2024-06-15T12:15:00Z',
      acknowledged: false
    },
    {
      id: 'alert-3',
      type: 'system',
      severity: 'low',
      title: 'Scheduled Maintenance Reminder',
      message: 'AI system maintenance scheduled for this weekend.',
      timestamp: '2024-06-15T10:00:00Z',
      acknowledged: true
    }
  ]);

  // Get available tabs based on role permissions
  const getAvailableTabs = () => {
    const tabs = [];
    
    if (canAccessModule(userRole, 'overview')) {
      tabs.push({ id: 'overview', label: dashboardConfig.navigation.tabs.overview, icon: <CameraIcon /> });
    }
    
    if (canAccessModule(userRole, 'horses') || hasPermission(userRole, 'horses', 'list')) {
      tabs.push({ id: 'horses', label: dashboardConfig.navigation.tabs.horses, icon: <HorseIcon /> });
    }
    
    if (canAccessModule(userRole, 'settings')) {
      tabs.push({ id: 'settings', label: dashboardConfig.navigation.tabs.settings, icon: <SettingsIcon /> });
    }
    
    // Profile tab for all roles with support permissions (contains ticket system)
    if (canAccessModule(userRole, 'profile') || hasPermission(userRole, 'support_tickets', 'create') || hasPermission(userRole, 'support_tickets', 'show')) {
      tabs.push({ id: 'profile', label: dashboardConfig.navigation.tabs.profile, icon: <PersonIcon /> });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: ISystemHealth['status']) => {
    switch (status) {
      case 'healthy':
        return <SuccessIcon sx={{ color: brandConfig.colors.successGreen }} />;
      case 'warning':
        return <WarningIcon sx={{ color: brandConfig.colors.alertAmber }} />;
      case 'critical':
        return <WarningIcon sx={{ color: brandConfig.colors.errorRed }} />;
    }
  };

  const getAlertIcon = (type: IAlert['type']) => {
    switch (type) {
      case 'ai':
        return <AIIcon sx={{ color: brandConfig.colors.ribbonBlue }} />;
      case 'business':
        return <BusinessIcon sx={{ color: brandConfig.colors.championGold }} />;
      case 'system':
        return <SecurityIcon sx={{ color: brandConfig.colors.hunterGreen }} />;
      case 'user':
        return <PeopleIcon sx={{ color: brandConfig.colors.victoryRose }} />;
      case 'health':
        return <HealthIcon sx={{ color: brandConfig.colors.errorRed }} />;
      case 'security':
        return <SecurityIcon sx={{ color: brandConfig.colors.midnightBlack }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleLogout = () => {
    logout();
    navigateTo('login');
  };

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    console.log(`Opening module: ${moduleId}`);
    // Open AI Dashboard for health module with slight delay to prevent password manager
    if (moduleId === 'health') {
      setTimeout(() => {
        setShowAIDashboard(true);
      }, 100);
    }
  };

  const handleQuickActionClick = (action: IQuickAction) => {
    if (action.route) {
      navigateTo(action.route as any);
    } else if (action.action) {
      // Handle both function and string action types
      if (typeof action.action === 'function') {
        action.action();
      } else if (typeof action.action === 'string') {
        // Handle string-based actions
        console.log(`Executing action: ${action.action}`);
        // You can add specific action handlers here
        switch (action.action) {
          case 'open-messaging':
            console.log('Opening messaging system...');
            break;
          case 'create-health-record':
            console.log('Creating health record...');
            break;
          case 'acknowledge-ai-alert':
            console.log('Acknowledging AI alert...');
            break;
          case 'run-ai-diagnostic':
            console.log('Running AI diagnostic...');
            break;
          case 'prescribe-medication':
            console.log('Opening medication prescription...');
            break;
          case 'schedule-checkup':
            console.log('Scheduling checkup...');
            break;
          case 'send-emergency-alert':
            console.log('Sending emergency alert...');
            break;
          case 'handle-ai-support':
            console.log('Handling AI support request...');
            break;
          case 'schedule-ai-training':
            console.log('Scheduling AI training...');
            break;
          case 'handle-false-alarm':
            console.log('Handling false alarm...');
            break;
          default:
            console.log(`Unknown action: ${action.action}`);
        }
      }
    }
    console.log(`Quick action: ${action.id}`);
  };

  // Don't render if not authenticated
  if (!user?.isAuthenticated) {
    return null;
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontPrimary,
    },
    main: {
      padding: brandConfig.spacing.xl,
      maxWidth: dashboardConfig.layout.maxWidth,
      margin: '0 auto',
    },
    headerSection: {
      marginBottom: brandConfig.spacing.xl,
    },
    welcomeTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: roleTheme.primary,
      margin: `0 0 ${brandConfig.spacing.sm} 0`,
    },
    welcomeSubtitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.neutralGray,
      margin: `0 0 ${brandConfig.spacing.lg} 0`,
    },
    roleBadge: {
      display: 'inline-block',
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      backgroundColor: roleTheme.primary,
      color: brandConfig.colors.barnWhite,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightBold,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      marginBottom: brandConfig.spacing.lg,
    },
    tabNavigation: {
      display: 'flex',
      gap: brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.xl,
      borderBottom: `2px solid ${brandConfig.colors.sterlingSilver}`,
    },
    tab: {
      padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '3px solid transparent',
      cursor: 'pointer',
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.neutralGray,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
    },
    activeTab: {
      color: roleTheme.primary,
      borderBottomColor: roleTheme.primary,
      fontWeight: brandConfig.typography.weightBold,
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: brandConfig.spacing.lg,
      marginBottom: brandConfig.spacing.xl,
    },
    metricCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: brandConfig.spacing.xl,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      borderLeft: '5px solid',
      transition: 'transform 0.2s ease',
    },
    section: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: brandConfig.spacing.xl,
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      marginBottom: brandConfig.spacing.xl,
    },
    sectionTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.midnightBlack,
      margin: `0 0 ${brandConfig.spacing.lg} 0`,
      display: 'flex',
      alignItems: 'center',
      gap: brandConfig.spacing.xs,
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: brandConfig.spacing.lg,
    },
    actionCard: {
      padding: brandConfig.spacing.xl,
      borderRadius: brandConfig.layout.borderRadius,
      border: '2px solid',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center' as const,
      backgroundColor: brandConfig.colors.barnWhite,
    },
    noAccess: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.xl,
      color: brandConfig.colors.neutralGray,
      fontSize: brandConfig.typography.fontSizeLg,
    }
  };

  const renderOverview = () => (
    <>
      {/* Role Badge */}
      <div style={styles.roleBadge}>
        {roleConfig?.badge || userRole.toUpperCase()}
      </div>

      {/* Metrics Grid */}
      {analyticsData.length > 0 && (
        <div style={styles.metricsGrid}>
          {analyticsData.map((metric) => (
            <div
              key={metric.id}
              style={{
                ...styles.metricCard,
                borderLeftColor: metric.color,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: brandConfig.spacing.md,
              }}>
                <h3 style={{
                  fontSize: brandConfig.typography.fontSizeLg,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.midnightBlack,
                  margin: '0',
                }}>{metric.title}</h3>
                <div style={{ color: metric.color }}>{metric.icon}</div>
              </div>
              <div style={{
                fontFamily: brandConfig.typography.fontDisplay,
                fontSize: brandConfig.typography.fontSize3xl,
                fontWeight: brandConfig.typography.weightBold,
                margin: `${brandConfig.spacing.xs} 0`,
                color: metric.color,
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                display: 'flex',
                alignItems: 'center',
                gap: brandConfig.spacing.xs,
              }}>
                {metric.trend === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: '1rem', color: brandConfig.colors.successGreen }} />
                ) : metric.trend === 'down' ? (
                  <TrendingDownIcon sx={{ fontSize: '1rem', color: brandConfig.colors.errorRed }} />
                ) : (
                  <InfoIcon sx={{ fontSize: '1rem', color: brandConfig.colors.neutralGray }} />
                )}
                {metric.change}
              </div>
              <p style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                margin: `${brandConfig.spacing.xs} 0 0 0`,
              }}>{metric.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <DashboardIcon />
            Quick Actions
          </h2>
          <div style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <div
                key={action.id}
                style={{
                  ...styles.actionCard,
                  borderColor: action.color,
                }}
                onClick={() => handleQuickActionClick(action)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `${action.color}15`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = brandConfig.colors.barnWhite;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: action.color, marginBottom: brandConfig.spacing.md }}>
                  {action.icon}
                </div>
                <h3 style={{
                  fontSize: brandConfig.typography.fontSizeLg,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.midnightBlack,
                  margin: `0 0 ${brandConfig.spacing.xs} 0`,
                }}>{action.title}</h3>
                <p style={{
                  fontSize: brandConfig.typography.fontSizeSm,
                  color: brandConfig.colors.neutralGray,
                  margin: '0',
                }}>{action.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modules Grid */}
      {availableModules.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <GroupIcon />
            Available Modules
          </h2>
          <div style={styles.quickActionsGrid}>
            {availableModules.map((module) => (
              <div
                key={module.id}
                style={{
                  ...styles.actionCard,
                  borderColor: module.color,
                }}
                onClick={() => handleModuleClick(module.id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `${module.color}15`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = brandConfig.colors.barnWhite;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: module.color, marginBottom: brandConfig.spacing.md }}>
                  {module.icon}
                </div>
                <h3 style={{
                  fontSize: brandConfig.typography.fontSizeLg,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.midnightBlack,
                  margin: `0 0 ${brandConfig.spacing.xs} 0`,
                }}>{module.title}</h3>
                <p style={{
                  fontSize: brandConfig.typography.fontSizeSm,
                  color: brandConfig.colors.neutralGray,
                  margin: `0 0 ${brandConfig.spacing.sm} 0`,
                }}>{module.description}</p>
                <div style={{
                  fontSize: brandConfig.typography.fontSizeXs,
                  color: brandConfig.colors.neutralGray,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: brandConfig.spacing.xs,
                  justifyContent: 'center',
                }}>
                  {module.features.slice(0, 3).map((feature, index) => (
                    <span key={index} style={{
                      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                      backgroundColor: `${module.color}20`,
                      borderRadius: brandConfig.layout.borderRadius,
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );

  const renderNoAccess = () => (
    <div style={styles.noAccess}>
      <SecurityIcon sx={{ fontSize: '4rem', color: brandConfig.colors.neutralGray, marginBottom: brandConfig.spacing.md }} />
      <h2>{dashboardConfig.messages.accessDenied}</h2>
      <p>Please contact your administrator if you believe this is an error.</p>
    </div>
  );

  const renderSystemHealth = () => (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <MonitorIcon />
        System Health
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
        {systemHealth.map((system) => (
          <div key={system.component} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.midnightBlack,
                margin: `0 0 ${brandConfig.spacing.xs} 0`,
              }}>{system.component}</h3>
              <div style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                display: 'flex',
                gap: brandConfig.spacing.md,
              }}>
                <span>Uptime: {system.uptime}</span>
                <span>Performance: {system.performance}</span>
                <span>Last Check: {system.lastCheck}</span>
              </div>
            </div>
            <div>
              {getStatusIcon(system.status)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderAlerts = () => (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>
        <NotificationIcon />
        Recent Alerts
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
        {alerts.map((alert) => (
          <div key={alert.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: brandConfig.spacing.md,
            padding: brandConfig.spacing.md,
            borderRadius: brandConfig.layout.borderRadius,
            backgroundColor: brandConfig.colors.arenaSand,
            border: '1px solid rgba(0, 0, 0, 0.1)',
            opacity: alert.acknowledged ? 0.6 : 1,
          }}>
            {getAlertIcon(alert.type)}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.midnightBlack,
                margin: `0 0 ${brandConfig.spacing.xs} 0`,
              }}>
                {alert.title}
                <span style={{
                  marginLeft: brandConfig.spacing.xs,
                  fontSize: brandConfig.typography.fontSizeXs,
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  backgroundColor: alert.severity === 'high' ? brandConfig.colors.errorRed :
                                 alert.severity === 'medium' ? brandConfig.colors.alertAmber :
                                 brandConfig.colors.successGreen,
                  color: brandConfig.colors.barnWhite,
                  borderRadius: '4px',
                }}>
                  {alert.severity.toUpperCase()}
                </span>
              </h3>
              <p style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                margin: `0 0 ${brandConfig.spacing.xs} 0`,
              }}>{alert.message}</p>
              <div style={{
                fontSize: brandConfig.typography.fontSizeXs,
                color: brandConfig.colors.neutralGray,
              }}>
                {formatTimestamp(alert.timestamp)} • {alert.type}
                {alert.acknowledged && ' • Acknowledged'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderSupport = () => {
    // Render appropriate support component based on user role
    switch (userRole) {
      case 'client':
        return <ClientSupportTab />;
      case 'employee':
      case 'trainer':
        return <EmployeeSupportTab />;
      case 'veterinarian':
        return <VeterinarianSupportTab />;
      case 'support':
        return <EnhancedSupportStaffTab />;
      case 'manager':
        return <ManagerSupportTab />;
      case 'admin':
        // Admin gets comprehensive support management functionality
        return (
          <div style={{
            padding: brandConfig.spacing.lg,
            backgroundColor: brandConfig.colors.barnWhite,
            borderRadius: brandConfig.layout.borderRadius
          }}>
            <h2 style={{ 
              fontSize: brandConfig.typography.fontSize2xl, 
              color: brandConfig.colors.midnightBlack, 
              marginBottom: brandConfig.spacing.lg,
              fontWeight: brandConfig.typography.weightBold
            }}>
              Support Management Center
            </h2>
            
            {/* Support Analytics Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: brandConfig.spacing.md,
              marginBottom: brandConfig.spacing.xl
            }}>
              <div style={{
                padding: brandConfig.spacing.md,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: brandConfig.layout.borderRadius,
                textAlign: 'center' as const
              }}>
                <h3 style={{ color: brandConfig.colors.stableMahogany, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>23</h3>
                <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm, margin: `${brandConfig.spacing.xs} 0 0 0` }}>Open Tickets Today</p>
              </div>
              <div style={{
                padding: brandConfig.spacing.md,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: brandConfig.layout.borderRadius,
                textAlign: 'center' as const
              }}>
                <h3 style={{ color: brandConfig.colors.hunterGreen, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>2.5h</h3>
                <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm, margin: `${brandConfig.spacing.xs} 0 0 0` }}>Avg First Response</p>
              </div>
              <div style={{
                padding: brandConfig.spacing.md,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: brandConfig.layout.borderRadius,
                textAlign: 'center' as const
              }}>
                <h3 style={{ color: brandConfig.colors.championGold, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>94%</h3>
                <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm, margin: `${brandConfig.spacing.xs} 0 0 0` }}>Customer Satisfaction</p>
              </div>
              <div style={{
                padding: brandConfig.spacing.md,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: brandConfig.layout.borderRadius,
                textAlign: 'center' as const
              }}>
                <h3 style={{ color: brandConfig.colors.ribbonBlue, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold, margin: 0 }}>89%</h3>
                <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm, margin: `${brandConfig.spacing.xs} 0 0 0` }}>First Call Resolution</p>
              </div>
            </div>

            {/* Support Categories */}
            <div style={{ marginBottom: brandConfig.spacing.xl }}>
              <h3 style={{ 
                fontSize: brandConfig.typography.fontSizeLg, 
                color: brandConfig.colors.midnightBlack, 
                marginBottom: brandConfig.spacing.md,
                fontWeight: brandConfig.typography.weightSemiBold 
              }}>
                Category Breakdown
              </h3>
              <div style={{ display: 'flex', gap: brandConfig.spacing.md, flexWrap: 'wrap' as const }}>
                <span style={{ padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`, backgroundColor: brandConfig.colors.hunterGreen, color: brandConfig.colors.barnWhite, borderRadius: '4px', fontSize: brandConfig.typography.fontSizeSm }}>
                  Technical (45.6%)
                </span>
                <span style={{ padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`, backgroundColor: brandConfig.colors.championGold, color: brandConfig.colors.barnWhite, borderRadius: '4px', fontSize: brandConfig.typography.fontSizeSm }}>
                  Billing (28.7%)
                </span>
                <span style={{ padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`, backgroundColor: brandConfig.colors.ribbonBlue, color: brandConfig.colors.barnWhite, borderRadius: '4px', fontSize: brandConfig.typography.fontSizeSm }}>
                  Feature Request (15.8%)
                </span>
                <span style={{ padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`, backgroundColor: brandConfig.colors.victoryRose, color: brandConfig.colors.barnWhite, borderRadius: '4px', fontSize: brandConfig.typography.fontSizeSm }}>
                  Bug Report (9.9%)
                </span>
              </div>
            </div>

            {/* Active Support Tickets */}
            <div>
              <h3 style={{ 
                fontSize: brandConfig.typography.fontSizeLg, 
                color: brandConfig.colors.midnightBlack, 
                marginBottom: brandConfig.spacing.md,
                fontWeight: brandConfig.typography.weightSemiBold 
              }}>
                Active Support Tickets
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
                {[
                  { id: '#ST-1234', title: 'Camera feed not loading', client: 'Sarah Johnson', priority: 'High', status: 'In Progress', time: '2h ago' },
                  { id: '#ST-1235', title: 'Billing discrepancy question', client: 'Mike Chen', priority: 'Medium', status: 'Pending', time: '4h ago' },
                  { id: '#ST-1236', title: 'Feature request: Mobile alerts', client: 'Lisa Rodriguez', priority: 'Low', status: 'Under Review', time: '1d ago' }
                ].map((ticket) => (
                  <div key={ticket.id} style={{
                    padding: brandConfig.spacing.md,
                    backgroundColor: brandConfig.colors.arenaSand,
                    borderRadius: brandConfig.layout.borderRadius,
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: brandConfig.spacing.xs }}>
                      <div>
                        <h4 style={{ 
                          fontSize: brandConfig.typography.fontSizeBase, 
                          fontWeight: brandConfig.typography.weightSemiBold,
                          color: brandConfig.colors.midnightBlack,
                          margin: 0
                        }}>
                          {ticket.title}
                        </h4>
                        <p style={{ 
                          fontSize: brandConfig.typography.fontSizeSm,
                          color: brandConfig.colors.neutralGray,
                          margin: `${brandConfig.spacing.xs} 0 0 0`
                        }}>
                          {ticket.id} • {ticket.client}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: brandConfig.spacing.xs, alignItems: 'center' }}>
                        <span style={{
                          padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                          backgroundColor: ticket.priority === 'High' ? brandConfig.colors.errorRed : 
                                         ticket.priority === 'Medium' ? brandConfig.colors.alertAmber : brandConfig.colors.successGreen,
                          color: brandConfig.colors.barnWhite,
                          borderRadius: '4px',
                          fontSize: brandConfig.typography.fontSizeXs,
                          fontWeight: brandConfig.typography.weightBold
                        }}>
                          {ticket.priority}
                        </span>
                        <span style={{
                          padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                          backgroundColor: brandConfig.colors.hunterGreen,
                          color: brandConfig.colors.barnWhite,
                          borderRadius: '4px',
                          fontSize: brandConfig.typography.fontSizeXs
                        }}>
                          {ticket.status}
                        </span>
                        <span style={{
                          fontSize: brandConfig.typography.fontSizeXs,
                          color: brandConfig.colors.neutralGray
                        }}>
                          {ticket.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{
            padding: brandConfig.spacing.lg,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center' as const
          }}>
            <h3 style={{ color: brandConfig.colors.sterlingSilver, marginBottom: brandConfig.spacing.md }}>
              Support Not Available
            </h3>
            <p style={{ fontSize: brandConfig.typography.fontSizeBase, color: brandConfig.colors.sterlingSilver }}>
              Support functionality is not available for your current role.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <Header 
        dashboardTabs={availableTabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      
      <main style={styles.main}>
        {/* Header Section */}
        <section style={styles.headerSection}>
          <h1 style={styles.welcomeTitle}>
            {welcomeMessage.title}
          </h1>
          <p style={styles.welcomeSubtitle}>
            {welcomeMessage.subtitle}
          </p>
        </section>

        {/* Tab Content */}
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'horses' && renderOverview()} {/* Horses content - for now use overview */}
        {selectedTab === 'settings' && renderSystemHealth()}
        {selectedTab === 'profile' && renderSupport()}
        
        {/* Alerts Section */}
        {alerts.length > 0 && renderAlerts()}
        
        {/* No Access Message */}
        {!availableModules.length && !quickActions.length && !analyticsData.length && renderNoAccess()}
      </main>

      <QuickAccess />
      
      {/* AI Dashboard */}
      {showAIDashboard && (
        <AIObservationDashboard
          isOpen={showAIDashboard}
          onClose={() => setShowAIDashboard(false)}
        />
      )}
    </div>
  );
}; 