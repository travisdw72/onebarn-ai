import React, { useState, useEffect } from 'react';
import { brandConfig } from '../config/brandConfig';
import { aiConfig } from '../config/aiConfig';
import { Header } from '../components/layout/Header';
import { useNavigation } from '../contexts/NavigationContext';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { useTenant } from '../contexts/TenantContext';
import QuickAccess from '../components/navigation/QuickAccess';
import { 
  Dashboard as DashboardIcon,
  Psychology as AIIcon,
  MonitorHeart as MonitorIcon,
  Analytics as AnalyticsIcon,
  VideoLibrary as VideoIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface IQuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  urgency?: 'high' | 'medium' | 'low';
}

interface IAIAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  horseId?: string;
  horseName?: string;
}

interface IPerformanceMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export const EmployeeDashboard: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { user } = useAuth();
  const { config, isEnabled, status } = useAI();
  const { tenantId } = useTenant();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data - in real app, this would come from API
  const [aiAlerts] = useState<IAIAlert[]>([
    {
      id: 'alert-1',
      type: 'warning',
      title: 'Unusual Behavior Detected',
      message: 'Horse "Thunder" showing atypical movement patterns in paddock 3',
      timestamp: '2024-06-15T14:30:00Z',
      horseId: 'horse-123',
      horseName: 'Thunder'
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Training Session Complete',
      message: 'AI analysis completed for morning training session with "Spirit"',
      timestamp: '2024-06-15T11:45:00Z',
      horseId: 'horse-456',
      horseName: 'Spirit'
    },
    {
      id: 'alert-3',
      type: 'success',
      title: 'Performance Improvement',
      message: 'Gait analysis shows 15% improvement in "Bella\'s" stride consistency',
      timestamp: '2024-06-15T09:15:00Z',
      horseId: 'horse-789',
      horseName: 'Bella'
    }
  ]);

  const quickActions: IQuickAction[] = [
    {
      id: 'ai-analysis',
      title: 'AI Analysis Dashboard',
      description: 'Comprehensive AI-powered insights and analysis',
      icon: <AIIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.ribbonBlue,
      route: 'ai-dashboard',
      urgency: 'high'
    },
    {
      id: 'live-monitor',
      title: 'Live Monitoring',
      description: 'Real-time horse health and behavior monitoring',
      icon: <MonitorIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.successGreen,
      route: 'ai-monitor',
      urgency: 'high'
    },
    {
      id: 'video-analysis',
      title: 'Video Analysis',
      description: 'Upload and analyze training videos',
      icon: <VideoIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.victoryRose,
      route: 'video-upload',
      urgency: 'medium'
    },
    {
      id: 'insights',
      title: 'Performance Insights',
      description: 'Deep dive into training effectiveness',
      icon: <AnalyticsIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.championGold,
      route: 'ai-insights',
      urgency: 'medium'
    },
    {
      id: 'observations',
      title: 'AI Observations',
      description: 'Review AI-generated behavioral observations',
      icon: <AssessmentIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.hunterGreen,
      route: 'ai-observation',
      urgency: 'low'
    },
    {
      id: 'camera-feed',
      title: 'Camera Feeds',
      description: 'Live camera monitoring of facilities',
      icon: <SecurityIcon sx={{ fontSize: '2.5rem' }} />,
      color: brandConfig.colors.infoBlue,
      route: 'camera-feed',
      urgency: 'low'
    }
  ];

  const performanceMetrics: IPerformanceMetric[] = [
    {
      label: 'Active Horses Monitored',
      value: '24',
      change: '+3 today',
      trend: 'up',
      color: brandConfig.colors.successGreen
    },
    {
      label: 'AI Insights Generated',
      value: '156',
      change: '+12 today',
      trend: 'up',
      color: brandConfig.colors.ribbonBlue
    },
    {
      label: 'Training Sessions Analyzed',
      value: '8',
      change: '+2 today',
      trend: 'up',
      color: brandConfig.colors.championGold
    },
    {
      label: 'Alert Response Time',
      value: '2.3 min',
      change: '-0.5 min',
      trend: 'up',
      color: brandConfig.colors.successGreen
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAlertIcon = (type: IAIAlert['type']) => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: brandConfig.colors.alertAmber }} />;
      case 'error':
        return <WarningIcon sx={{ color: brandConfig.colors.errorRed }} />;
      case 'success':
        return <SuccessIcon sx={{ color: brandConfig.colors.successGreen }} />;
      default:
        return <NotificationIcon sx={{ color: brandConfig.colors.infoBlue }} />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontPrimary,
    },
    main: {
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    welcomeSection: {
      marginBottom: '2rem',
    },
    welcomeTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize3xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.midnightBlack,
      margin: '0 0 0.5rem 0',
    },
    welcomeSubtitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      color: brandConfig.colors.neutralGray,
      margin: '0 0 1rem 0',
    },
    statusBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap' as const,
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
    },
    activeStatus: {
      backgroundColor: brandConfig.colors.successGreen,
      color: brandConfig.colors.barnWhite,
    },
    inactiveStatus: {
      backgroundColor: brandConfig.colors.alertAmber,
      color: brandConfig.colors.barnWhite,
    },
    timeDisplay: {
      color: brandConfig.colors.neutralGray,
      fontSize: brandConfig.typography.fontSizeSm,
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    metricCard: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: '1.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
      borderLeft: '4px solid',
    },
    metricValue: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      margin: '0 0 0.25rem 0',
    },
    metricLabel: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.midnightBlack,
      fontWeight: brandConfig.typography.weightMedium,
      margin: '0 0 0.5rem 0',
    },
    metricChange: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '2rem',
      [`@media (max-width: ${brandConfig.layout.breakpoints.tablet})`]: {
        gridTemplateColumns: '1fr',
      },
    },
    quickActionsSection: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
    },
    sectionTitle: {
      fontFamily: brandConfig.typography.fontDisplay,
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.midnightBlack,
      margin: '0 0 1.5rem 0',
    },
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    actionCard: {
      padding: '1.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      border: '2px solid',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center' as const,
    },
    actionTitle: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.midnightBlack,
      margin: '1rem 0 0.5rem 0',
    },
    actionDescription: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      margin: '0',
    },
    alertsSection: {
      backgroundColor: brandConfig.colors.barnWhite,
      padding: '2rem',
      borderRadius: brandConfig.layout.borderRadius,
      boxShadow: brandConfig.layout.boxShadow,
    },
    alertsList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    alertItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem',
      borderRadius: brandConfig.layout.borderRadius,
      backgroundColor: brandConfig.colors.arenaSand,
      border: '1px solid rgba(0, 0, 0, 0.1)',
    },
    alertContent: {
      flex: 1,
    },
    alertTitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.midnightBlack,
      margin: '0 0 0.25rem 0',
    },
    alertMessage: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.neutralGray,
      margin: '0 0 0.5rem 0',
    },
    alertMeta: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.neutralGray,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  const handleActionClick = (route: string) => {
    navigateTo(route as any);
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <main style={styles.main}>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
                     <h1 style={styles.welcomeTitle}>
             Welcome back, {user?.email?.split('@')[0] || 'Employee'}
           </h1>
          <p style={styles.welcomeSubtitle}>
            AI-Powered Equestrian Management Dashboard
          </p>
          
          <div style={styles.statusBar}>
            <div style={{
              ...styles.statusBadge,
              ...(isEnabled ? styles.activeStatus : styles.inactiveStatus)
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'currentColor',
              }} />
              AI System {isEnabled ? 'Active' : 'Offline'}
            </div>
            <div style={styles.statusBadge}>
              Tenant: {tenantId || 'Default'}
            </div>
            <div style={styles.timeDisplay}>
              {currentTime.toLocaleString()}
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <div style={styles.metricsGrid}>
          {performanceMetrics.map((metric, index) => (
            <div
              key={index}
              style={{
                ...styles.metricCard,
                borderLeftColor: metric.color,
              }}
            >
              <div style={{ ...styles.metricValue, color: metric.color }}>
                {metric.value}
              </div>
              <div style={styles.metricLabel}>
                {metric.label}
              </div>
              <div style={styles.metricChange}>
                <TrendingIcon sx={{ fontSize: '1rem', color: metric.color }} />
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Quick Actions */}
          <section style={styles.quickActionsSection}>
            <h2 style={styles.sectionTitle}>
              <DashboardIcon sx={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Quick Actions
            </h2>
            <div style={styles.actionsGrid}>
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  style={{
                    ...styles.actionCard,
                    borderColor: action.color,
                    backgroundColor: action.urgency === 'high' ? 
                      `${action.color}10` : 'transparent',
                  }}
                  onClick={() => handleActionClick(action.route)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${action.color}20`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = action.urgency === 'high' ? 
                      `${action.color}10` : 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ color: action.color }}>
                    {action.icon}
                  </div>
                  <h3 style={styles.actionTitle}>
                    {action.title}
                  </h3>
                  <p style={styles.actionDescription}>
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Alerts */}
          <section style={styles.alertsSection}>
            <h2 style={styles.sectionTitle}>
              <NotificationIcon sx={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              AI Alerts
            </h2>
            <div style={styles.alertsList}>
              {aiAlerts.map((alert) => (
                <div key={alert.id} style={styles.alertItem}>
                  {getAlertIcon(alert.type)}
                  <div style={styles.alertContent}>
                    <h3 style={styles.alertTitle}>
                      {alert.title}
                    </h3>
                    <p style={styles.alertMessage}>
                      {alert.message}
                    </p>
                    <div style={styles.alertMeta}>
                      <ScheduleIcon sx={{ fontSize: '0.75rem' }} />
                      {formatTimestamp(alert.timestamp)}
                      {alert.horseName && (
                        <>
                          <span>•</span>
                          <span>{alert.horseName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <QuickAccess />
    </div>
  );
}; 