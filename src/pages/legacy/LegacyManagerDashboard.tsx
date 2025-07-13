import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Typography, Button, Card, CardContent, Chip } from '@mui/material';
import { Logout, TrendingUp, TrendingDown } from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { managerDashboardConfig } from '../../config/managerDashboardData';
import { SecureAIChat } from '../../components/common/SecureAIChat';
import { useSecureAIChat } from '../../hooks/useSecureAIChat';
import { DashboardFooter } from '../../components/layout/DashboardFooter';
import { AIAlertWidget } from '../../components/ai/AIAlertWidget';
import { AIObservationDashboard } from '../../components/ai/AIObservationDashboard';

export const ManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAIDashboard, setShowAIDashboard] = useState(false);

  // Convert user to User type for AI chat
  const aiChatUser = {
    id: 'manager-001',
    name: user?.email?.split('@')[0] || 'Manager',
    email: user?.email || 'manager@example.com',
    role: 'admin' as const, // Managers have admin-level access in our system
    status: 'active' as const,
    lastLogin: new Date().toISOString(),
    barn: 'Sunset Stables',
    joinDate: '2024-01-01',
    permissions: ['manage_facility', 'view_all_horses', 'manage_staff', 'view_reports']
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

  // Data from configuration
  const statistics = managerDashboardConfig.mockData.statistics;
  const recentActivity = managerDashboardConfig.mockData.recentActivity;
  const upcomingTasks = managerDashboardConfig.mockData.upcomingTasks;
  const modules = Object.values(managerDashboardConfig.modules);

  const handleLogout = () => {
    logout();
    navigateTo('login');
  };

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    console.log(`${managerDashboardConfig.messages.moduleAction} ${moduleId}`);
    // Open AI Dashboard for health module with slight delay to prevent password manager
    if (moduleId === 'health') {
      setTimeout(() => {
        setShowAIDashboard(true);
      }, 100);
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`${managerDashboardConfig.messages.quickAction} ${action}`);
  };

  const handleStatClick = (statId: string) => {
    console.log('Stat clicked:', statId);
    // Open AI Dashboard for health-related stats with slight delay to prevent password manager
    if (statId === 'healthAlerts') {
      setTimeout(() => {
        setShowAIDashboard(true);
      }, 100);
    }
  };

  // Don't render if not authenticated
  if (!user?.isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return brandConfig.colors.successGreen;
      case 'warning':
        return brandConfig.colors.alertAmber;
      case 'critical':
        return brandConfig.colors.errorRed;
      default:
        return brandConfig.colors.sterlingSilver;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return brandConfig.colors.errorRed;
      case 'medium':
        return brandConfig.colors.alertAmber;
      case 'low':
        return brandConfig.colors.successGreen;
      default:
        return brandConfig.colors.sterlingSilver;
    }
  };

  const styles = {
    container: {
      background: `linear-gradient(135deg, ${brandConfig.colors.hunterGreen}30, ${brandConfig.colors.stableMahogany}20, ${brandConfig.colors.arenaSand}40)`,
      minHeight: '100vh',
      paddingTop: '2rem',
      paddingBottom: '2rem'
    },
    contentContainer: {
      maxWidth: brandConfig.layout.maxWidth,
      margin: '0 auto',
      padding: brandConfig.layout.containerPadding
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: `linear-gradient(135deg, ${brandConfig.colors.stableMahogany}, ${brandConfig.colors.championGold}90)`,
      borderRadius: brandConfig.layout.borderRadius,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}40`
    },
    welcomeSection: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}, ${brandConfig.colors.sterlingSilver}40)`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '2rem',
      marginBottom: '2rem',
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`
    },
    statCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}08, ${brandConfig.colors.hunterGreen}08)`,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '1.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`,
        borderColor: brandConfig.colors.hunterGreen
      }
    },
    moduleCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}08, ${brandConfig.colors.hunterGreen}08)`,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '1.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      height: '100%',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`,
        borderColor: brandConfig.colors.hunterGreen
      }
    },
    quickActionButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      fontFamily: brandConfig.typography.fontSecondary,
      fontWeight: brandConfig.typography.weightSemiBold,
      padding: '1rem 1.5rem',
      borderRadius: brandConfig.layout.borderRadius,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      '&:hover': {
        backgroundColor: brandConfig.colors.hunterGreen,
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}40`
      }
    },
    activityCard: {
      background: `linear-gradient(135deg, ${brandConfig.colors.arenaSand}08, ${brandConfig.colors.hunterGreen}08)`,
      border: `2px solid ${brandConfig.colors.stableMahogany}60`,
      borderRadius: brandConfig.layout.borderRadius,
      padding: '1.5rem',
      height: '100%'
    },
    sectionTitle: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      marginBottom: '1rem'
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth={false} sx={styles.contentContainer}>
        {/* Header with User Info and Logout */}
        <Box sx={styles.header}>
          <Box>
            <Typography sx={{
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightSemiBold,
              color: brandConfig.colors.arenaSand,
              fontFamily: brandConfig.typography.fontPrimary
            }}>
              Welcome, {user?.email}
            </Typography>
            <Typography sx={{
              fontSize: brandConfig.typography.fontSizeBase,
              color: brandConfig.colors.arenaSand,
              fontFamily: brandConfig.typography.fontSecondary,
              opacity: 0.9
            }}>
              Role: {managerDashboardConfig.welcome.roleLabel}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderColor: brandConfig.colors.arenaSand,
              color: brandConfig.colors.arenaSand,
              fontFamily: brandConfig.typography.fontSecondary,
              fontWeight: brandConfig.typography.weightMedium,
              '&:hover': {
                borderColor: brandConfig.colors.arenaSand,
                backgroundColor: `${brandConfig.colors.arenaSand}20`
              }
            }}
          >
            {managerDashboardConfig.buttons.logout}
          </Button>
        </Box>

        {/* Welcome Section */}
        <Box sx={styles.welcomeSection}>
          <Typography sx={{
            fontSize: brandConfig.typography.fontSize3xl,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            {managerDashboardConfig.headers.facilityOverview}
          </Typography>
          <Typography sx={{
            fontSize: brandConfig.typography.fontSizeLg,
            color: brandConfig.colors.hunterGreen,
            fontFamily: brandConfig.typography.fontSecondary,
            fontWeight: brandConfig.typography.weightMedium,
            textAlign: 'center'
          }}>
            {managerDashboardConfig.messages.welcomeBack}
          </Typography>
        </Box>

        {/* Statistics Grid */}
        <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
          {statistics.map(stat => {
            const statConfig = managerDashboardConfig.statistics[stat.key as keyof typeof managerDashboardConfig.statistics];
            return (
              <Grid item xs={12} sm={6} md={4} lg={2} key={stat.id}>
                <Card 
                  sx={styles.statCard}
                  onClick={() => handleStatClick(stat.key)}
                >
                  <CardContent sx={{ padding: '1rem !important' }}>
                    <Typography sx={{
                      fontSize: brandConfig.typography.fontSize2xl,
                      fontWeight: brandConfig.typography.weightBold,
                      color: brandConfig.colors.stableMahogany,
                      marginBottom: '0.5rem'
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.hunterGreen,
                      fontSize: brandConfig.typography.fontSizeSm,
                      marginBottom: '0.5rem'
                    }}>
                      {statConfig?.name || stat.key}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      {stat.change >= 0 ? (
                        <TrendingUp sx={{ fontSize: '1rem', color: getStatusColor(stat.status) }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: '1rem', color: getStatusColor(stat.status) }} />
                      )}
                      <Typography sx={{
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightMedium,
                        color: getStatusColor(stat.status)
                      }}>
                        {stat.change >= 0 ? '+' : ''}{stat.change}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Management Modules */}
        <Typography sx={styles.sectionTitle}>
          {managerDashboardConfig.headers.managementModules}
        </Typography>
        <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
          {modules.map(module => (
            <Grid item xs={12} sm={6} md={4} key={module.id}>
              <Card 
                sx={{
                  ...styles.moduleCard,
                  borderColor: selectedModule === module.id ? brandConfig.colors.hunterGreen : `${brandConfig.colors.stableMahogany}60`
                }}
                onClick={() => handleModuleClick(module.id)}
              >
                <CardContent sx={{ padding: '1.5rem !important' }}>
                  <Typography sx={{
                    fontSize: brandConfig.typography.fontSize3xl,
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    {module.icon}
                  </Typography>
                  <Typography sx={{
                    color: brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeLg,
                    fontWeight: brandConfig.typography.weightSemiBold,
                    marginBottom: '0.5rem',
                    fontFamily: brandConfig.typography.fontPrimary
                  }}>
                    {module.title}
                  </Typography>
                  <Typography sx={{
                    color: brandConfig.colors.hunterGreen,
                    fontSize: brandConfig.typography.fontSizeSm,
                    lineHeight: brandConfig.typography.lineHeightNormal,
                    marginBottom: '1rem'
                  }}>
                    {module.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {module.features.slice(0, 3).map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{
                          backgroundColor: `${brandConfig.colors.hunterGreen}20`,
                          color: brandConfig.colors.hunterGreen,
                          fontSize: brandConfig.typography.fontSizeXs,
                          fontWeight: brandConfig.typography.weightMedium
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography sx={styles.sectionTitle}>
          {managerDashboardConfig.headers.quickActions}
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: '2rem' }}>
          {managerDashboardConfig.quickActions.map(action => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={action.action}>
              <Button
                sx={styles.quickActionButton}
                onClick={() => handleQuickAction(action.action)}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                    {action.icon}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontWeight: brandConfig.typography.weightSemiBold 
                  }}>
                    {action.label}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Grid - Recent Activity & Upcoming Tasks */}
        <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Card sx={styles.activityCard}>
              <CardContent sx={{ padding: '1.5rem !important' }}>
                <Typography sx={styles.sectionTitle}>
                  {managerDashboardConfig.headers.recentActivity}
                </Typography>
                {recentActivity.slice(0, 5).map(activity => (
                  <Box key={activity.id} sx={{
                    padding: '0.75rem 0',
                    borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}20`,
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Typography sx={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeSm,
                      marginBottom: '0.25rem',
                      fontFamily: brandConfig.typography.fontPrimary
                    }}>
                      {activity.description}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.hunterGreen,
                      fontSize: brandConfig.typography.fontSizeXs
                    }}>
                      {activity.timestamp} • {activity.user}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Tasks */}
          <Grid item xs={12} md={4}>
            <Card sx={styles.activityCard}>
              <CardContent sx={{ padding: '1.5rem !important' }}>
                <Typography sx={styles.sectionTitle}>
                  {managerDashboardConfig.headers.upcomingTasks}
                </Typography>
                {upcomingTasks.map(task => (
                  <Box key={task.id} sx={{
                    padding: '0.75rem 0',
                    borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}20`,
                    '&:last-child': { borderBottom: 'none' }
                  }}>
                    <Typography sx={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightMedium,
                      marginBottom: '0.25rem',
                      fontFamily: brandConfig.typography.fontPrimary
                    }}>
                      {task.title}
                    </Typography>
                    <Typography sx={{
                      color: brandConfig.colors.hunterGreen,
                      fontSize: brandConfig.typography.fontSizeXs,
                      marginBottom: '0.5rem'
                    }}>
                      {task.description}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography sx={{
                        color: brandConfig.colors.hunterGreen,
                        fontSize: brandConfig.typography.fontSizeXs
                      }}>
                        Due: {task.dueDate}
                      </Typography>
                      <Chip
                        label={task.priority.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: `${getPriorityColor(task.priority)}20`,
                          color: getPriorityColor(task.priority),
                          fontSize: brandConfig.typography.fontSizeXs,
                          fontWeight: brandConfig.typography.weightMedium
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* AI Alert Widget */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              background: 'white',
              borderRadius: brandConfig.layout.borderRadius,
              boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`,
              overflow: 'hidden'
            }}>
              <AIAlertWidget 
                tenantId={user?.tenantId || 'manager-tenant'} 
                maxAlerts={5}
                autoRefresh={true}
                refreshInterval={30000}
                onViewFullDashboard={() => {
                  setTimeout(() => {
                    setShowAIDashboard(true);
                  }, 100);
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Secure AI Chat */}
      {isChatEnabled && (
        <SecureAIChat 
          user={aiChatUser} 
          context="dashboard" 
        />
      )}

      {/* AI Observation Dashboard Modal/Overlay */}
      {showAIDashboard && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-dashboard-title"
        >
          <Box 
            sx={{
              width: '95%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: brandConfig.layout.borderRadius,
              overflow: 'auto',
              position: 'relative'
            }}
            role="document"
          >
            <Button
              onClick={() => setShowAIDashboard(false)}
              sx={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10000,
                backgroundColor: brandConfig.colors.errorRed,
                color: 'white',
                '&:hover': {
                  backgroundColor: brandConfig.colors.errorRed
                }
              }}
            >
              ✕ Close
            </Button>
            <AIObservationDashboard 
              tenantId={user?.tenantId || 'manager-tenant'}
            />
          </Box>
        </Box>
      )}

      {/* Dashboard Footer */}
      <DashboardFooter />
    </Box>
  );
}; 