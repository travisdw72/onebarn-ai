import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Grid, Typography, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { brandConfig } from '../config/brandConfig';
import { employeeRoles, employeeDashboardData } from '../config/employeeDashboardData';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { RoleSelector } from '../components/employee/RoleSelector';
import { QuickStatsGrid } from '../components/employee/QuickStatsGrid';
import { TaskList } from '../components/employee/TaskList';
import { SchedulePanel } from '../components/employee/SchedulePanel';
import { AlertPanel } from '../components/employee/AlertPanel';
import { ModuleGrid } from '../components/employee/ModuleGrid';
import { SecureAIChat } from '../components/common/SecureAIChat';
import { useSecureAIChat } from '../hooks/useSecureAIChat';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { AIAlertWidget } from '../components/ai/AIAlertWidget';
import { AIObservationDashboard } from '../components/ai/AIObservationDashboard';
import type { IEmployeeDashboardProps } from '../interfaces/EmployeeTypes';

export const EmployeeDashboard: React.FC<IEmployeeDashboardProps> = ({ 
  initialRole = 'trainer' 
}) => {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!user?.isAuthenticated) {
      navigateTo('login');
      return;
    }
  }, [user, navigateTo]);

  // Set initial role based on logged-in user
  const getUserRole = () => {
    if (user?.role === 'admin') return 'admin';
    if (user?.role === 'trainer') return 'trainer';
    return initialRole;
  };

  const [activeRole, setActiveRole] = useState<string>(getUserRole());
  const [currentData, setCurrentData] = useState(employeeDashboardData[getUserRole()]);
  
  // Refs for scrolling to sections
  const scheduleRef = useRef<HTMLDivElement>(null);
  const modulesRef = useRef<HTMLDivElement>(null);

  // Convert user to User type for AI chat
  const aiChatUser = {
    id: 'employee-001',
    name: user?.email?.split('@')[0] || 'Employee',
    email: user?.email || 'employee@example.com',
    role: 'employee' as const,
    status: 'active' as const,
    lastLogin: new Date().toISOString(),
    barn: 'Sunset Stables',
    joinDate: '2024-01-01',
    permissions: ['manage_horses', 'schedule_training', 'view_clients', 'update_health']
  };

  // Initialize secure AI chat
  const { isChatEnabled } = useSecureAIChat({ 
    user: aiChatUser, 
    context: 'dashboard' 
  });

  useEffect(() => {
    setCurrentData(employeeDashboardData[activeRole]);
    console.log('Switched to role:', activeRole);
  }, [activeRole]);

  const handleRoleChange = (newRole: string) => {
    setActiveRole(newRole);
  };

  const handleModuleClick = (moduleId: string) => {
    console.log('Opening module:', moduleId);
    // In a real application, this would navigate to the specific module
    // For now, we'll just log the action
  };

  const handleTaskComplete = (taskId: string) => {
    console.log('Task completed:', taskId);
    // In a real application, this would update the task status
  };

  const handleAlertDismiss = (alertId: string) => {
    console.log('Alert dismissed:', alertId);
    // In a real application, this would remove the alert
  };

  const handleViewFullSchedule = () => {
    console.log('Opening full schedule view');
    // In a real application, this would navigate to the schedule page
  };

  const handleLogout = () => {
    logout();
    navigateTo('login');
  };

  const handleStatClick = (statId: string) => {
    console.log('Stat clicked:', statId);
    
    switch (statId) {
      case 'sessions-today':
        // Scroll to schedule section
        scheduleRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
        
        // Brief highlight effect
        setTimeout(() => {
          if (scheduleRef.current) {
            scheduleRef.current.style.transform = 'scale(1.02)';
            scheduleRef.current.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
              if (scheduleRef.current) {
                scheduleRef.current.style.transform = 'scale(1)';
              }
            }, 300);
          }
        }, 500);
        break;
        
      case 'active-horses':
        // Open AI Dashboard for horse monitoring
        setShowAIDashboard(true);
        break;
        
      case 'upcoming-shows':
        // TODO: Show upcoming shows schedule
        alert('🏆 Upcoming Shows\n\nThis will display your upcoming show schedule.\n\n(Coming soon!)');
        break;
        
      case 'client-satisfaction':
        // TODO: Show client reviews/satisfaction data
        alert('⭐ Client Satisfaction\n\nThis will show your client reviews and satisfaction ratings.\n\n(Coming soon!)');
        break;
        
      case 'ai-alerts':
        // Open AI Dashboard with slight delay to prevent password manager
        setTimeout(() => {
          setShowAIDashboard(true);
        }, 100);
        break;
        
      default:
        console.log('Unknown stat clicked:', statId);
    }
  };

  // Don't render if not authenticated
  if (!user?.isAuthenticated) {
    return null;
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
    mainContent: {
      marginTop: '1rem'
    },
    leftColumn: {
      marginBottom: { xs: '2rem', md: '0' }
    },
    rightColumn: {
      marginBottom: { xs: '2rem', md: '0' }
    },
    sectionTitle: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany,
      fontFamily: brandConfig.typography.fontPrimary,
      marginBottom: '1rem',
      marginTop: '2rem'
    }
  };

  return (
    <Box sx={styles.container}>
      <Container maxWidth={false} sx={styles.contentContainer}>
        {/* Header with User Info and Logout */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '1rem',
          background: `linear-gradient(135deg, ${brandConfig.colors.stableMahogany}, ${brandConfig.colors.championGold}90)`,
          borderRadius: brandConfig.layout.borderRadius,
          border: `2px solid ${brandConfig.colors.stableMahogany}`,
          boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}40`
        }}>
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
              Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              borderColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.stableMahogany,
              fontFamily: brandConfig.typography.fontSecondary,
              '&:hover': {
                borderColor: brandConfig.colors.errorRed,
                color: brandConfig.colors.errorRed,
                backgroundColor: `${brandConfig.colors.errorRed}10`
              }
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Role Selector Section */}
        <RoleSelector
          roles={employeeRoles}
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />

        {/* Quick Stats Section */}
        <QuickStatsGrid 
          stats={currentData.stats} 
          onStatClick={handleStatClick}
        />

        {/* Alerts Section (if any) */}
        {currentData.alerts && currentData.alerts.length > 0 && (
          <AlertPanel
            alerts={currentData.alerts}
            onAlertDismiss={handleAlertDismiss}
          />
        )}

        {/* Main Content Section */}
        <Grid container spacing={3} sx={styles.mainContent}>
          {/* Left Column - Schedule and Tasks */}
          <Grid item xs={12} md={8} sx={styles.leftColumn}>
            {/* Schedule Panel */}
            {currentData.schedule && currentData.schedule.length > 0 && (
              <Box ref={scheduleRef} sx={{ marginBottom: 3 }}>
                <SchedulePanel
                  schedule={currentData.schedule}
                  onViewFullSchedule={handleViewFullSchedule}
                />
              </Box>
            )}

            {/* Task List */}
            {currentData.tasks && currentData.tasks.length > 0 && (
              <TaskList
                tasks={currentData.tasks}
                onTaskComplete={handleTaskComplete}
              />
            )}
          </Grid>

          {/* Right Column - AI Alert Widget */}
          <Grid item xs={12} md={4} sx={styles.rightColumn}>
            <Box sx={{ 
              background: 'white',
              borderRadius: brandConfig.layout.borderRadius,
              boxShadow: `0 4px 12px ${brandConfig.colors.stableMahogany}20`,
              overflow: 'hidden'
            }}>
              <AIAlertWidget 
                tenantId={user?.tenantId || 'default-tenant'} 
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

        {/* Modules Section */}
        <Box ref={modulesRef}>
          <Typography sx={styles.sectionTitle}>
            Available Modules
          </Typography>
          <ModuleGrid
            modules={currentData.modules}
            onModuleClick={handleModuleClick}
          />
        </Box>

        {/* Auto-refresh indicator (mimicking the original HTML functionality) */}
        <Box sx={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          padding: '1rem',
          color: brandConfig.colors.hunterGreen,
          fontSize: brandConfig.typography.fontSizeXs,
          fontFamily: brandConfig.typography.fontSecondary
        }}>
          Dashboard auto-refreshes every 30 seconds • Last updated: {new Date().toLocaleTimeString()}
        </Box>
      </Container>

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
              tenantId={user?.tenantId || 'employee-tenant'}
            />
          </Box>
        </Box>
      )}

      {/* Secure AI Chat */}
      {isChatEnabled && (
        <SecureAIChat 
          user={aiChatUser} 
          context="dashboard" 
        />
      )}

      {/* Dashboard Footer */}
      <DashboardFooter />
    </Box>
  );
}; 