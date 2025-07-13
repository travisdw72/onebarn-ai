import React, { useState } from 'react';
import { Monitor, Users, TrendingUp, Rocket, Settings, Activity } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { getDashboardTabsForRole } from '../config/dashboardConfig';
import { brandConfig } from '../config/brandConfig';
import '../styles/it-dashboard.css';

export const ITManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'users' | 'performance' | 'deployments' | 'support'>('monitoring');

  const mockSystemData = {
    systemHealth: { overall: 'operational', uptime: '99.97%' },
    infrastructure: {
      servers: { online: 8, total: 8, load: 67 },
      database: { connections: 45, queryTime: 15, storage: 73 },
      aiProcessing: { queued: 23, processing: 156, errors: 3 }
    }
  };

  const mockAlerts = [
    {
      id: 1,
      message: 'High database load detected',
      severity: 'medium',
      timestamp: '5 minutes ago'
    }
  ];

  // Get dashboard tabs for it-manager role
  const dashboardTabs = getDashboardTabsForRole('it-manager');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'monitoring' | 'users' | 'performance' | 'deployments' | 'support');
  };

  return (
    <div 
      className="it-manager-dashboard"
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

      {/* IT Manager Status Bar */}
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
          <Monitor size={32} style={{ color: brandConfig.colors.stableMahogany }} />
          <div>
            <h2 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightBold,
                fontSize: brandConfig.typography.fontSize2xl,
                color: brandConfig.colors.midnightBlack,
                margin: 0,
              }}
            >
              IT Manager Dashboard
            </h2>
            <p 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                margin: 0,
              }}
            >
              System Monitoring & Management
            </p>
          </div>
        </div>
        
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm,
            padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
            backgroundColor: mockAlerts.length > 0 ? brandConfig.colors.alertAmber : brandConfig.colors.successGreen,
            borderRadius: brandConfig.layout.borderRadius,
            color: brandConfig.colors.barnWhite,
          }}
        >
          <span 
            style={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightBold,
              fontSize: brandConfig.typography.fontSizeLg,
            }}
          >
            {mockAlerts.length}
          </span>
          <span 
            style={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontSize: brandConfig.typography.fontSizeBase,
            }}
          >
            Active Alerts
          </span>
        </div>
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
        {activeTab === 'monitoring' && (
          <div className="system-monitoring">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              System Health Overview
            </h2>
            
            <div className="health-overview">
              <div className="overview-cards">
                <div className="health-card">
                  <div className="card-header">
                    <Activity className="w-6 h-6 text-stable-mahogany" />
                    <h3 className="font-raleway font-semibold">System Status</h3>
                  </div>
                  <div className="card-content">
                    <div className="health-status operational">
                      <span className="font-raleway font-bold text-lg">OPERATIONAL</span>
                    </div>
                    <div className="health-details">
                      <div className="detail-item">
                        <span className="label">Uptime:</span>
                        <span className="value">{mockSystemData.systemHealth.uptime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="health-card">
                  <div className="card-header">
                    <Monitor className="w-6 h-6 text-ribbon-blue" />
                    <h3 className="font-raleway font-semibold">Infrastructure</h3>
                  </div>
                  <div className="card-content">
                    <div className="infra-stats">
                      <div className="stat-item">
                        <span className="stat-number font-bebas text-2xl text-ribbon-blue">
                          {mockSystemData.infrastructure.servers.online}/{mockSystemData.infrastructure.servers.total}
                        </span>
                        <span className="stat-label font-raleway text-sm">Servers Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="alerts-section">
              <h3 className="section-title font-raleway font-bold text-lg mb-4">Active Alerts</h3>
              
              {mockAlerts.length === 0 ? (
                <div className="no-alerts">
                  <p className="font-raleway text-center text-gray-600">
                    No active alerts - all systems operational
                  </p>
                </div>
              ) : (
                <div className="alerts-list">
                  {mockAlerts.map(alert => (
                    <div key={alert.id} className="alert-item">
                      <div className="alert-content">
                        <div className="alert-message font-raleway font-semibold">
                          {alert.message}
                        </div>
                        <div className="alert-meta">
                          <span className="alert-time font-raleway text-sm text-gray-600">
                            {alert.timestamp}
                          </span>
                          <span className={`alert-severity ${alert.severity}`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              User Management
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor and manage user accounts and sessions across the platform
            </p>
            
            <div className="user-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Users className="w-6 h-6 text-victory-rose" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">247</span>
                    <span className="stat-label font-raleway text-sm">Total Users</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Activity className="w-6 h-6 text-hunter-green" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">45</span>
                    <span className="stat-label font-raleway text-sm">Online Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="performance-metrics">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Performance Metrics
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor system performance and identify optimization opportunities
            </p>
            
            <div className="performance-overview">
              <div className="performance-cards">
                <div className="perf-card">
                  <div className="card-header">
                    <TrendingUp className="w-6 h-6 text-champion-gold" />
                    <h3 className="font-raleway font-semibold">Response Time</h3>
                  </div>
                  <div className="card-content">
                    <div className="metric-value">
                      <span className="font-bebas text-4xl text-champion-gold">245ms</span>
                      <span className="font-raleway text-sm text-gray-600">avg response</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <div className="deployment-management">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Deployment Management
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor and manage application deployments across environments
            </p>
            
            <div className="current-deployment">
              <div className="deployment-status-card">
                <div className="status-header">
                  <div className="status-info">
                    <h3 className="font-raleway font-bold text-lg">v2.1.3 - PRODUCTION</h3>
                    <span className="deployment-status operational">OPERATIONAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="it-support">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              IT Support Overview
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor support tickets and team performance
            </p>
            
            <div className="support-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Settings className="w-6 h-6 text-victory-rose" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">8</span>
                    <span className="stat-label font-raleway text-sm">Open Tickets</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Activity className="w-6 h-6 text-hunter-green" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">15m</span>
                    <span className="stat-label font-raleway text-sm">Avg Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Dashboard Footer */}
      <DashboardFooter />
    </div>
  );
}; 