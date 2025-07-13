import React, { useState } from 'react';
import { SystemOverview } from '../components/admin/SystemOverview';
import { DatabaseMonitoring } from '../components/admin/DatabaseMonitoring';
import { UserManagement } from '../components/admin/UserManagement';
import { AISystemStatus } from '../components/admin/AISystemStatus';
import { SupportTickets } from '../components/admin/SupportTickets';
import { SystemLogs } from '../components/admin/SystemLogs';
import { EmergencyControls } from '../components/admin/EmergencyControls';
import { Header } from '../components/layout/Header';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { getDashboardTabsForRole } from '../config/dashboardConfig';
import { brandConfig } from '../config/brandConfig';
import { Activity, Database, Users, Brain, Ticket, FileText, AlertTriangle } from 'lucide-react';
import '../styles/admin-dashboard.css';

// Mock data
const mockSystemData = {
  systemHealth: {
    overall: 'operational',
    uptime: '99.97%',
    lastIncident: '3 days ago',
    activeAlerts: 2,
    resolvedToday: 15
  },
  users: {
    totalActive: 247,
    newToday: 12
  },
  infrastructure: {
    servers: {
      online: 8,
      total: 8,
      load: 67
    },
    database: {
      connections: 45,
      maxConnections: 100,
      queryTime: 15,
      storage: 73
    },
    aiProcessing: {
      queued: 23,
      processing: 156,
      completed: 8934,
      errors: 3
    }
  },
  barns: {
    active: 12,
    total: 15,
    totalHorses: 89,
    totalCameras: 47
  }
};

const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    barn: 'Sunset Stables',
    role: 'owner',
    status: 'online' as const,
    lastActivity: '2 minutes ago',
    currentPage: '/dashboard',
    sessionDuration: '2h 15m'
  },
  {
    id: '2',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    barn: 'Thunder Valley Ranch',
    role: 'trainer',
    status: 'idle' as const,
    lastActivity: '15 minutes ago',
    currentPage: '/horses/thunder-bay',
    sessionDuration: '45m'
  },
  {
    id: '3',
    name: 'Dr. Lisa Chen',
    email: 'lisa@example.com',
    barn: 'Pine Ridge Equestrian',
    role: 'veterinarian',
    status: 'online' as const,
    lastActivity: '5 minutes ago',
    currentPage: '/health/reports',
    sessionDuration: '1h 20m'
  }
];

const mockTickets = [
  {
    id: 'T-001',
    title: 'Camera not connecting in Barn A',
    user: 'Sarah Johnson',
    barn: 'Sunset Stables',
    priority: 'high',
    status: 'open',
    created: '2 hours ago',
    category: 'Hardware'
  },
  {
    id: 'T-002',
    title: 'AI alerts not triggering for horse behavior',
    user: 'Mike Wilson',
    barn: 'Thunder Valley Ranch',
    priority: 'medium',
    status: 'in-progress',
    created: '5 hours ago',
    category: 'AI System'
  }
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'database' | 'users' | 'ai' | 'support' | 'logs'>('overview');
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Get dashboard tabs for admin role
  const dashboardTabs = getDashboardTabsForRole('admin');

  const handleEmergencyToggle = () => {
    setEmergencyMode(!emergencyMode);
  };

  const handleUserImpersonate = (userId: string) => {
    console.log(`Impersonating user: ${userId}`);
    // In real app, this would switch to that user's view
  };

  const handleTicketUpdate = (ticketId: string, status: string) => {
    console.log(`Updating ticket ${ticketId} to status: ${status}`);
    // In real app, this would update the ticket status
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'overview' | 'database' | 'users' | 'ai' | 'support' | 'logs');
  };

  return (
    <div 
      className={`admin-dashboard ${emergencyMode ? 'emergency-mode' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: brandConfig.colors.arenaSand,
        fontFamily: brandConfig.typography.fontPrimary,
      }}
    >
      {/* Standardized Header with Dashboard Tabs */}
      <Header 
        showNavigation={true}
        dashboardTabs={dashboardTabs}
        selectedTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* System Status Bar */}
      <div 
        style={{
          padding: brandConfig.spacing.md,
          backgroundColor: brandConfig.colors.barnWhite,
          borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: brandConfig.spacing.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md }}>
          <div className={`status-indicator ${mockSystemData.systemHealth.overall}`}>
            <div className="status-dot"></div>
            <span 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold,
                fontSize: brandConfig.typography.fontSizeBase,
                color: brandConfig.colors.midnightBlack,
              }}
            >
              System {mockSystemData.systemHealth.overall.toUpperCase()}
            </span>
          </div>
        </div>
        
        <EmergencyControls 
          emergencyMode={emergencyMode}
          onToggle={handleEmergencyToggle}
        />
      </div>

      {/* Main Content */}
      <div 
        style={{
          flex: 1,
          padding: brandConfig.spacing.md,
          overflow: 'auto',
          backgroundColor: brandConfig.colors.arenaSand,
        }}
      >
        {activeTab === 'overview' && (
          <SystemOverview
            systemData={mockSystemData}
            activeUsers={mockUsers.filter(u => u.status === 'online').length}
            onUserImpersonate={handleUserImpersonate}
          />
        )}
        
        {activeTab === 'database' && (
          <DatabaseMonitoring systemData={mockSystemData} />
        )}
        
        {activeTab === 'users' && (
          <UserManagement 
            users={mockUsers}
            onImpersonate={handleUserImpersonate}
          />
        )}
        
        {activeTab === 'ai' && (
          <AISystemStatus systemData={mockSystemData} />
        )}
        
        {activeTab === 'support' && (
          <SupportTickets 
            tickets={mockTickets}
            onTicketUpdate={handleTicketUpdate}
          />
        )}
        
        {activeTab === 'logs' && (
          <SystemLogs />
        )}
      </div>

      {/* Emergency Overlay */}
      {emergencyMode && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div 
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              padding: brandConfig.spacing.xl,
              borderRadius: brandConfig.layout.borderRadius,
              maxWidth: '500px',
              textAlign: 'center',
              border: `3px solid ${brandConfig.colors.errorRed}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.lg }}>
              <AlertTriangle size={32} style={{ color: brandConfig.colors.errorRed }} />
              <h2 
                style={{
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontWeight: brandConfig.typography.weightBold,
                  fontSize: brandConfig.typography.fontSize2xl,
                  color: brandConfig.colors.errorRed,
                  margin: 0,
                }}
              >
                EMERGENCY MODE ACTIVE
              </h2>
            </div>
            <p 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontSize: brandConfig.typography.fontSizeLg,
                color: brandConfig.colors.midnightBlack,
                marginBottom: brandConfig.spacing.xl,
              }}
            >
              All non-critical systems have been disabled. Emergency protocols are in effect.
            </p>
            <button
              onClick={handleEmergencyToggle}
              style={{
                backgroundColor: brandConfig.colors.errorRed,
                color: brandConfig.colors.barnWhite,
                border: 'none',
                padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightSemiBold,
                cursor: 'pointer',
                fontFamily: brandConfig.typography.fontPrimary,
              }}
            >
              Disable Emergency Mode
            </button>
          </div>
        </div>
      )}
      
      {/* Dashboard Footer */}
      <DashboardFooter />
    </div>
  );
}; 