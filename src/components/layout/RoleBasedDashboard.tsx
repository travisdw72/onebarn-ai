/**
 * Role-Based Dashboard Component
 * Renders appropriate dashboard based on user role
 * Integrates with existing auth system and config-driven components
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';
import { getRoleTheme, getWelcomeMessage } from '../../config/dashboardConfig';

// Import new dashboard components
import { LiveVideoGrid } from '../dashboard/LiveVideoGrid';
import { AIInsightsPanel } from '../dashboard/AIInsightsPanel';
import { AIChatInterface } from '../dashboard/AIChatInterface';
import { SystemStatusBar } from '../dashboard/SystemStatusBar';

// Import the new dashboard pages
import { AdminDashboard } from '../../pages/AdminDashboard';
import { ITManagerDashboard } from '../../pages/ITManagerDashboard';
import { ITSupportDashboard } from '../../pages/ITSupportDashboard';
import { PartnerDashboard } from '../../pages/PartnerDashboard';



// Import existing components
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Header } from './Header';
import { DashboardFooter } from './DashboardFooter';

// Import ticket system components
import { Phase1Dashboard } from '../phase1/Phase1Dashboard';
import { ClientSupportTab } from '../client/support/ClientSupportTab';

// Import icons for dashboard tabs
import { Camera, Activity, MessageCircle, Settings, Users, FileText, HelpCircle, Headphones } from 'lucide-react';

// Import dashboard CSS styles
import '../../styles/admin-dashboard.css';
import '../../styles/it-dashboard.css';
import '../../styles/partner-dashboard.css';

interface RoleBasedDashboardProps {
  className?: string;
}

export const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ className }) => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tenantId } = useTenant();
  const { 
    horses, 
    cameras, 
    alerts, 
    insights, 
    isLoading: dataLoading,
    error: dataError,
    refetch 
  } = useDashboardData();
  
  console.log('🔍 [RoleBasedDashboard] COMPONENT RENDERED');
  console.log('🔍 [RoleBasedDashboard] User:', user);
  console.log('🔍 [RoleBasedDashboard] User Email:', user?.email);
  console.log('🔍 [RoleBasedDashboard] User Role:', user?.role);
  console.log('🔍 [RoleBasedDashboard] TenantId:', tenantId);
  console.log('🔍 [RoleBasedDashboard] Horses:', horses);
  console.log('🔍 [RoleBasedDashboard] Cameras:', cameras);
  console.log('🔍 [RoleBasedDashboard] Insights:', insights);
  console.log('🔍 [RoleBasedDashboard] Alerts:', alerts);
  console.log('🔍 [RoleBasedDashboard] DataLoading:', dataLoading);
  console.log('🔍 [RoleBasedDashboard] DataError:', dataError);

  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [emergencyMessage, setEmergencyMessage] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational' as const,
    aiEngine: 'active' as const,
    cameras: { online: 2, total: 3 },
    alerts: { active: 2 },
    uptime: '99.9%'
  });
  
  console.log('🔍 [RoleBasedDashboard] Current activeTab:', activeTab);
  console.log('🔍 [RoleBasedDashboard] selectedCamera:', selectedCamera);
  console.log('🔍 [RoleBasedDashboard] systemStatus:', systemStatus);



  // Demo user role mapping function - matches AuthProvider demo mapping
  const getDemoRoleMapping = (email: string): string | null => {
    const demoUserMapping: Record<string, string> = {
      'admin@onebarnai.com': 'admin',               // Admin Dashboard
      'travis.woodward@onebarnai.com': 'it_manager', // IT Manager Dashboard
      'michelle.nash@onebarnai.com': 'it_support',   // IT Support Dashboard  
      'sarah.robertson@onebarnai.com': 'partner',    // Partner Dashboard
      'demo@onebarnai.com': 'client',                 // Client Dashboard
    };
    
    return demoUserMapping[email?.toLowerCase()] || null;
  };

  // Function to normalize One Vault roles - with demo override
  const normalizeOneVaultRole = (role: string, email?: string): string => {
    // First check if this is a demo user with hardcoded role
    if (email) {
      const demoRole = getDemoRoleMapping(email);
      if (demoRole) {
        return demoRole;
      }
    }

    // Original role normalization logic for non-demo users
    const roleLower = role.toLowerCase();
    
    // Handle One Vault ADMIN role patterns (ADMIN_ROLE_{tenant}_{timestamp})
    if (roleLower.includes('admin') || roleLower === 'administrator') {
      return 'admin';
    }
    
    // Handle One Vault USER role patterns  
    if (roleLower.includes('user') || roleLower === 'end_user') {
      return 'client';
    }
    
    // Handle One Vault IT roles
    if (roleLower.includes('it_manager') || roleLower === 'it_manager') {
      return 'it_manager';
    }
    
    if (roleLower.includes('it_support') || roleLower === 'it_support') {
      return 'it_support';
    }
    
    // Handle One Vault partner roles
    if (roleLower.includes('partner') || roleLower === 'partners') {
      return 'partner';
    }
    
    // Handle common role variations
    if (roleLower.includes('employee') || roleLower === 'trainer' || roleLower === 'staff') {
      return 'employee';
    }
    
    if (roleLower.includes('manager') || roleLower === 'supervisor') {
      return 'admin';
    }
    
    if (roleLower.includes('client') || roleLower === 'customer') {
      return 'client';
    }
    
    // Default fallback
    return 'client';
  };

  // 📱 DEMO ACCOUNT VALIDATION - After normalizeOneVaultRole is declared
  const isDemoAccount = user?.email === 'demo@onebarnai.com';



  // Dashboard tabs configuration based on role
  const getDashboardTabs = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { id: 'overview', label: 'System Overview', icon: <Activity size={16} /> },
          { id: 'database', label: 'Database', icon: <Settings size={16} /> },
          { id: 'users', label: 'Users', icon: <Users size={16} /> },
          { id: 'ai-system', label: 'AI System', icon: <Activity size={16} /> },
          { id: 'tickets', label: 'Support', icon: <HelpCircle size={16} /> },
          { id: 'logs', label: 'Logs', icon: <FileText size={16} /> },
        ];
        
      case 'it_manager':
        return [
          { id: 'monitoring', label: 'System Monitoring', icon: <Activity size={16} /> },
          { id: 'users', label: 'User Management', icon: <Users size={16} /> },
          { id: 'performance', label: 'Performance', icon: <Activity size={16} /> },
          { id: 'deployments', label: 'Deployments', icon: <Settings size={16} /> },
          { id: 'support', label: 'Support', icon: <HelpCircle size={16} /> },
        ];
        
      case 'it_support':
        return [
          { id: 'tickets', label: 'Support Tickets', icon: <HelpCircle size={16} /> },
          { id: 'sessions', label: 'User Sessions', icon: <Users size={16} /> },
          { id: 'knowledge', label: 'Knowledge Base', icon: <FileText size={16} /> },
          { id: 'issues', label: 'Common Issues', icon: <Settings size={16} /> },
        ];
        
      case 'partner':
        return [
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
          { id: 'revenue', label: 'Revenue & Commissions', icon: <Activity size={16} /> },
          { id: 'horses', label: 'Horse Monitoring', icon: <Activity size={16} /> },
          { id: 'customers', label: 'Customer Success', icon: <Users size={16} /> },
          { id: 'marketing', label: 'Marketing Tools', icon: <Settings size={16} /> },
          { id: 'support', label: 'Support', icon: <HelpCircle size={16} /> },
        ];
        
      case 'client':
        return [
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
          { id: 'insights', label: 'AI Insights', icon: <Activity size={16} /> },
          { id: 'chat-history', label: 'Chat History', icon: <MessageCircle size={16} /> },
          { id: 'support', label: 'Support', icon: <HelpCircle size={16} /> },
        ];
        
      case 'employee':
      case 'trainer':
        return [
          { id: 'overview', label: 'Overview', icon: <Activity size={16} /> },
          { id: 'insights', label: 'AI Insights', icon: <Activity size={16} /> },
          { id: 'chat-history', label: 'Chat History', icon: <MessageCircle size={16} /> },
          { id: 'support', label: 'Support', icon: <HelpCircle size={16} /> },
          { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
        ];
        
      default:
        return [];
    }
  };

  // Get role-based configuration
  const roleTheme = user?.role ? getRoleTheme(user.role) : null;
  const welcomeMessage = user?.role ? getWelcomeMessage(user.role, user.name) : null;

  // Emergency contact handler
  const handleEmergencyContact = (type: string, message: string) => {
    setEmergencyMessage(message);
    setActiveTab('chat'); // Switch to chat tab
    // The AI chat will pick up the emergency message and display it
  };

  useEffect(() => {
    // Auto-select first available camera
    if (cameras && cameras.length > 0 && !selectedCamera) {
      const onlineCamera = cameras.find(c => c.status === 'online');
      if (onlineCamera) {
        setSelectedCamera(onlineCamera.id);
      }
    }
  }, [cameras, selectedCamera]);

  // Loading states
  if (authLoading || dataLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.barnWhite,
        fontFamily: brandConfig.typography.fontPrimary,
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <span style={{
          marginLeft: brandConfig.spacing.md,
          fontSize: brandConfig.typography.fontSizeLg,
          color: brandConfig.colors.midnightBlack,
        }}>
          {newDashboardEnhancements.states.loading}
        </span>
      </div>
    );
  }

  // Error states
  if (dataError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.barnWhite,
        fontFamily: brandConfig.typography.fontPrimary,
        padding: brandConfig.spacing.xl,
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
        }}>
          <h2 style={{
            color: brandConfig.colors.errorRed,
            fontSize: brandConfig.typography.fontSize2xl,
            marginBottom: brandConfig.spacing.md,
          }}>
            {newDashboardEnhancements.states.error}
          </h2>
          <p style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeSm,
            marginBottom: brandConfig.spacing.lg,
          }}>
            {dataError.message || 'An error occurred while loading dashboard data'}
          </p>
          <button
            onClick={() => refetch()}
            style={{
              padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.barnWhite,
              border: 'none',
              borderRadius: brandConfig.layout.borderRadius,
              fontSize: brandConfig.typography.fontSizeSm,
              fontFamily: brandConfig.typography.fontPrimary,
              cursor: 'pointer',
            }}
          >
            {newDashboardEnhancements.states.retry}
          </button>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.barnWhite,
        fontFamily: brandConfig.typography.fontPrimary,
      }}>
        <div style={{
          textAlign: 'center',
          padding: brandConfig.spacing.xl,
        }}>
          <h2 style={{
            color: brandConfig.colors.errorRed,
            fontSize: brandConfig.typography.fontSize2xl,
            marginBottom: brandConfig.spacing.md,
          }}>
            Authentication Required
          </h2>
          <p style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeSm,
          }}>
            Please log in to access the dashboard
          </p>
        </div>
      </div>
    );
  }

  // Render dashboard based on role and permissions
  const renderDashboardContent = () => {
    const role = user.role;
    const normalizedRole = normalizeOneVaultRole(role, user?.email);
    const dashboardTabs = getDashboardTabs(normalizedRole); // Use normalized role for tabs

    // ADMIN DASHBOARD
    if (normalizedRole === 'admin') {
      return <AdminDashboard />;
    }

    // IT MANAGER DASHBOARD  
    if (normalizedRole === 'it_manager') {
      return <ITManagerDashboard />;
    }

    // IT SUPPORT DASHBOARD
    if (normalizedRole === 'it_support') {
      return <ITSupportDashboard />;
    }

    // PARTNER DASHBOARD
    if (normalizedRole === 'partner') {
      return <PartnerDashboard />;
    }

    // CLIENT DASHBOARD
    if (normalizedRole === 'client') {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: brandConfig.colors.arenaSand,
          fontFamily: brandConfig.typography.fontPrimary,
        }}>
          {/* Navigation Header */}
          <Header 
            showNavigation={true}
            dashboardTabs={dashboardTabs}
            selectedTab={activeTab}
            onTabChange={setActiveTab}
          />
          

          
          {/* Main Content Area - Flex grow to fill space */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Render content based on selected tab */}
            {activeTab === 'support' ? (
              <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
                <ClientSupportTab />
              </div>
            ) : activeTab === 'insights' ? (
              <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
                <AIInsightsPanel
                  insights={insights}
                  alerts={alerts}
                  horses={horses}
                />
              </div>
            ) : activeTab === 'chat-history' ? (
              <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
                <AIChatInterface
                  horses={horses}
                  selectedCamera={selectedCamera}
                  cameras={cameras}
                  alerts={alerts}
                  insights={insights}
                  isExpanded={true}
                  onToggleExpand={() => {}}
                  emergencyMessage={emergencyMessage}
                  onEmergencyMessageHandled={() => setEmergencyMessage(null)}
                />
              </div>
            ) : (
              /* Default Dashboard Content - Overview Tab */
              <div style={{
                display: 'grid',
                gridTemplateColumns: isChatExpanded ? '1fr 400px' : '1fr 350px',
                gridTemplateRows: 'auto 1fr',
                gap: brandConfig.spacing.md,
                flex: 1,
                padding: brandConfig.spacing.md,
                overflow: 'hidden',
              }}>
                {/* System Status Bar */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <SystemStatusBar 
                    systemStatus={systemStatus}
                    onlineUsers={1}
                  />
                </div>

                {/* Main Video Grid - Full height */}
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <LiveVideoGrid
                    cameras={cameras}
                    selectedCamera={selectedCamera}
                    onCameraSelect={setSelectedCamera}
                    alerts={alerts}
                    onEmergencyContact={handleEmergencyContact}
                    userEmail={user?.email}
                  />
                </div>

                {/* AI Chat Interface - Match video height */}
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  <AIChatInterface
                    horses={horses}
                    selectedCamera={selectedCamera}
                    cameras={cameras}
                    alerts={alerts}
                    insights={insights}
                    isExpanded={isChatExpanded}
                    onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
                    emergencyMessage={emergencyMessage}
                    onEmergencyMessageHandled={() => setEmergencyMessage(null)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Dashboard Footer */}
          <DashboardFooter />
        </div>
      );
    }

    // EMPLOYEE DASHBOARD
    if (normalizedRole === 'employee' || normalizedRole === 'trainer') {
      return (
              <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.arenaSand,
        fontFamily: brandConfig.typography.fontPrimary,
      }}>
        {/* Navigation Header */}
        <Header 
          showNavigation={true}
          dashboardTabs={dashboardTabs}
          selectedTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Main Content Area - Flex grow to fill space */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Render content based on selected tab */}
          {activeTab === 'insights' ? (
            <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
              <AIInsightsPanel
                insights={insights}
                alerts={alerts}
                horses={horses}
              />
            </div>
          ) : activeTab === 'chat-history' ? (
            <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
              <AIChatInterface
                horses={horses}
                selectedCamera={selectedCamera}
                cameras={cameras}
                alerts={alerts}
                insights={insights}
                isExpanded={true}
                onToggleExpand={() => {}}
                emergencyMessage={emergencyMessage}
                onEmergencyMessageHandled={() => setEmergencyMessage(null)}
              />
            </div>
          ) : activeTab === 'support' ? (
            <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
              <ClientSupportTab />
            </div>
          ) : activeTab === 'reports' ? (
            <div style={{ flex: 1, padding: brandConfig.spacing.md, overflow: 'auto' }}>
              <div style={{
                backgroundColor: brandConfig.colors.barnWhite,
                padding: brandConfig.spacing.lg,
                borderRadius: brandConfig.layout.borderRadius,
                textAlign: 'center',
              }}>
                <h3 style={{
                  color: brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSize2xl,
                  marginBottom: brandConfig.spacing.md,
                }}>
                  Partnership Revenue Reports
                </h3>
                <p style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm,
                }}>
                  Barn partnership revenue, horse platform status, and financial analytics coming soon.
                </p>
              </div>
            </div>
          ) : (
            /* Default Dashboard Content - Overview Tab */
            <div style={{
              display: 'grid',
              gridTemplateColumns: isChatExpanded ? '1fr 400px' : '1fr 350px',
              gridTemplateRows: 'auto 1fr',
              gap: brandConfig.spacing.md,
              flex: 1,
              padding: brandConfig.spacing.md,
              overflow: 'hidden',
            }}>
              {/* System Status Bar */}
              <div style={{ gridColumn: '1 / -1' }}>
                <SystemStatusBar 
                  systemStatus={systemStatus}
                  onlineUsers={1}
                />
              </div>

              {/* Main Video Grid - Full width */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}>
                <LiveVideoGrid
                  cameras={cameras}
                  selectedCamera={selectedCamera}
                  onCameraSelect={setSelectedCamera}
                  alerts={alerts}
                  onEmergencyContact={handleEmergencyContact}
                  userEmail={user?.email}
                />
              </div>

              {/* AI Chat Interface - Match video height */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
              }}>
                <AIChatInterface
                  horses={horses}
                  selectedCamera={selectedCamera}
                  cameras={cameras}
                  alerts={alerts}
                  insights={insights}
                  isExpanded={isChatExpanded}
                  onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
                  emergencyMessage={emergencyMessage}
                  onEmergencyMessageHandled={() => setEmergencyMessage(null)}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>
      );
    }

    // DEFAULT FALLBACK
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.barnWhite,
        fontFamily: brandConfig.typography.fontPrimary,
      }}>
        <div style={{
          textAlign: 'center',
          padding: brandConfig.spacing.xl,
        }}>
          <h2 style={{
            color: brandConfig.colors.errorRed,
            fontSize: brandConfig.typography.fontSize2xl,
            marginBottom: brandConfig.spacing.md,
          }}>
            Dashboard Not Available
          </h2>
          <p style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeSm,
          }}>
            Role ({normalizedRole}) dashboard is not yet implemented.
          </p>
          <p style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeXs,
            marginTop: brandConfig.spacing.xs,
          }}>
            Original DB Role: {role} | Email: {user?.email} | Normalized: {normalizedRole}
          </p>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className={className}>
        {renderDashboardContent()}
      </div>
    </ErrorBoundary>
  );
}; 