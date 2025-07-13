import React, { useState } from 'react';
import { Ticket, Book, Users, MessageCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { getDashboardTabsForRole } from '../config/dashboardConfig';
import { brandConfig } from '../config/brandConfig';
import '../styles/it-dashboard.css';

export const ITSupportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'sessions' | 'knowledge' | 'issues'>('tickets');

  const mockTickets = [
    {
      id: 'T-001',
      title: 'Camera not connecting in Barn A',
      user: 'Sarah Johnson',
      priority: 'high',
      status: 'open',
      created: '2 hours ago'
    },
    {
      id: 'T-002',
      title: 'AI alerts not triggering',
      user: 'Mike Wilson',
      priority: 'medium',
      status: 'in-progress',
      created: '5 hours ago'
    }
  ];

  // Get dashboard tabs for it-support role
  const dashboardTabs = getDashboardTabsForRole('it-support');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'tickets' | 'sessions' | 'knowledge' | 'issues');
  };

  return (
    <div 
      className="it-support-dashboard"
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

      {/* IT Support Status Bar */}
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
          <Ticket size={32} style={{ color: brandConfig.colors.stableMahogany }} />
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
              IT Support Dashboard
            </h2>
            <p 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                margin: 0,
              }}
            >
              Customer Support & Issue Resolution
            </p>
          </div>
        </div>
        
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm,
            padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
            backgroundColor: mockTickets.filter(t => t.status === 'open').length > 0 ? brandConfig.colors.errorRed : brandConfig.colors.successGreen,
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
            {mockTickets.filter(t => t.status === 'open').length}
          </span>
          <span 
            style={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontSize: brandConfig.typography.fontSizeBase,
            }}
          >
            Open Tickets
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
        {activeTab === 'tickets' && (
          <div className="it-support">
            <div className="support-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Ticket className="w-6 h-6 text-victory-rose" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">
                      {mockTickets.filter(t => t.status === 'open').length}
                    </span>
                    <span className="stat-label font-raleway text-sm">Open Tickets</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <MessageCircle className="w-6 h-6 text-ribbon-blue" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">
                      {mockTickets.filter(t => t.status === 'in-progress').length}
                    </span>
                    <span className="stat-label font-raleway text-sm">In Progress</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Users className="w-6 h-6 text-hunter-green" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">23</span>
                    <span className="stat-label font-raleway text-sm">Resolved Today</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Book className="w-6 h-6 text-champion-gold" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">15m</span>
                    <span className="stat-label font-raleway text-sm">Avg Response</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              My Support Tickets
            </h2>
            
            <div className="tickets-list">
              {mockTickets.map(ticket => (
                <div key={ticket.id} className="ticket-item">
                  <div className="ticket-header">
                    <div className="ticket-id">
                      <Ticket className="w-4 h-4" />
                      <span className="font-mono font-bold">{ticket.id}</span>
                    </div>
                    <div className="ticket-badges">
                      <span className={`priority-badge ${ticket.priority}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                      <span className={`status-badge ${ticket.status}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ticket-content">
                    <h3 className="font-raleway font-semibold text-lg mb-2">
                      {ticket.title}
                    </h3>
                    
                    <div className="ticket-meta">
                      <div className="meta-item">
                        <Users className="w-4 h-4" />
                        <span>{ticket.user}</span>
                      </div>
                      <div className="meta-item">
                        <span>{ticket.created}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <button className="ticket-btn primary">
                      Take Action
                    </button>
                    <button className="ticket-btn secondary">
                      Contact User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="user-session-assistance">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              User Session Assistance
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              View and assist users with their current sessions
            </p>
            
            <div className="session-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Users className="w-6 h-6 text-ribbon-blue" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">12</span>
                    <span className="stat-label font-raleway text-sm">Active Sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="knowledge-base">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Knowledge Base
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Access documentation and troubleshooting guides
            </p>
            
            <div className="kb-tools">
              <div className="tools-grid">
                <div className="tool-card">
                  <div className="tool-icon">
                    <Book className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="tool-content">
                    <h4 className="tool-title font-raleway font-semibold">Documentation</h4>
                    <p className="tool-description font-raleway text-sm">
                      Complete system documentation and guides
                    </p>
                    <button className="tool-btn">Browse Docs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="common-issues">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Common Issues & Solutions
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Quick reference for frequently encountered issues
            </p>
            
            <div className="issues-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <MessageCircle className="w-6 h-6 text-victory-rose" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">15</span>
                    <span className="stat-label font-raleway text-sm">Camera Issues</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Book className="w-6 h-6 text-ribbon-blue" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">8</span>
                    <span className="stat-label font-raleway text-sm">AI Issues</span>
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