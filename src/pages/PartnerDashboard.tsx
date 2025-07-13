import React, { useState } from 'react';
import { Award, DollarSign, Users, BarChart3, Gift, MessageCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { DashboardFooter } from '../components/layout/DashboardFooter';
import { getDashboardTabsForRole } from '../config/dashboardConfig';
import { brandConfig } from '../config/brandConfig';
import '../styles/partner-dashboard.css';

export const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'horses' | 'customers' | 'marketing' | 'support'>('overview');

  const mockPartnerData = {
    tier: 'gold',
    monthlyRevenue: 12750,
    totalCustomers: 89,
    activeHorses: 156,
    commissionRate: 15
  };

  // Get dashboard tabs for partner role
  const dashboardTabs = getDashboardTabsForRole('partner');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as 'overview' | 'revenue' | 'horses' | 'customers' | 'marketing' | 'support');
  };

  return (
    <div 
      className="partner-dashboard"
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

      {/* Partner Status Bar */}
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
          <Award size={32} style={{ color: brandConfig.colors.championGold }} />
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
              Partner Dashboard
            </h2>
            <p 
              style={{
                fontFamily: brandConfig.typography.fontPrimary,
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.neutralGray,
                margin: 0,
              }}
            >
              Business Growth & Customer Management
            </p>
          </div>
        </div>
        
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm,
            padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
            backgroundColor: brandConfig.colors.championGold,
            borderRadius: brandConfig.layout.borderRadius,
            color: brandConfig.colors.barnWhite,
          }}
        >
          <Award size={20} />
          <span 
            style={{
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightBold,
              fontSize: brandConfig.typography.fontSizeBase,
            }}
          >
            GOLD PARTNER
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
        {activeTab === 'overview' && (
          <div className="partner-overview">
            <div className="welcome-section">
              <div className="welcome-content">
                <h2 className="font-raleway font-bold text-2xl mb-4">
                  Welcome to Your Partner Dashboard
                </h2>
                <p className="font-raleway text-lg text-gray-700 mb-6">
                  Track your business growth, manage customers, and access exclusive partner resources
                </p>
                
                <div className="success-highlights">
                  <div className="highlight-item">
                    <span className="highlight-number font-bebas text-3xl text-champion-gold">
                      ${mockPartnerData.monthlyRevenue.toLocaleString()}
                    </span>
                    <span className="highlight-label font-raleway">Monthly Revenue</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-number font-bebas text-3xl text-hunter-green">
                      {mockPartnerData.totalCustomers}
                    </span>
                    <span className="highlight-label font-raleway">Active Customers</span>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-number font-bebas text-3xl text-ribbon-blue">
                      {mockPartnerData.activeHorses}
                    </span>
                    <span className="highlight-label font-raleway">Horses Monitored</span>
                  </div>
                </div>
              </div>
              
              <div className="partner-tier-display">
                <div className="tier-card gold">
                  <div className="tier-icon">
                    <Award className="w-12 h-12 text-champion-gold" />
                  </div>
                  <div className="tier-info">
                    <h3 className="font-raleway font-bold text-xl">Gold Partner</h3>
                    <p className="font-raleway text-sm text-gray-600">
                      {mockPartnerData.commissionRate}% commission rate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <DollarSign className="w-6 h-6 text-champion-gold" />
                  <h3 className="font-raleway font-semibold">Monthly Revenue</h3>
                </div>
                <div className="metric-content">
                  <div className="metric-value">
                    <span className="font-bebas text-4xl text-champion-gold">
                      ${mockPartnerData.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="metric-change positive">
                    <span className="font-raleway text-sm">+23% from last month</span>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <Users className="w-6 h-6 text-hunter-green" />
                  <h3 className="font-raleway font-semibold">Customer Growth</h3>
                </div>
                <div className="metric-content">
                  <div className="metric-value">
                    <span className="font-bebas text-4xl text-hunter-green">
                      {mockPartnerData.totalCustomers}
                    </span>
                  </div>
                  <div className="metric-details">
                    <div className="detail-row">
                      <span className="label">New this month:</span>
                      <span className="value">12</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <BarChart3 className="w-6 h-6 text-ribbon-blue" />
                  <h3 className="font-raleway font-semibold">Performance</h3>
                </div>
                <div className="metric-content">
                  <div className="metric-value">
                    <span className="font-bebas text-4xl text-ribbon-blue">97%</span>
                  </div>
                  <div className="metric-details">
                    <div className="detail-row">
                      <span className="label">Customer Satisfaction:</span>
                      <span className="value">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="revenue-tracking">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Revenue & Commission Tracking
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor your earnings and commission payments
            </p>
            
            <div className="revenue-overview">
              <div className="revenue-cards">
                <div className="revenue-card primary">
                  <div className="card-header">
                    <h3 className="font-raleway font-semibold">This Month</h3>
                  </div>
                  <div className="card-content">
                    <div className="revenue-amount">
                      <span className="font-bebas text-4xl text-champion-gold">
                        ${mockPartnerData.monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="revenue-change positive">
                      <span className="font-raleway text-sm">+23% from last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'horses' && (
          <div className="horse-monitoring">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Horse Monitoring Overview
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Monitor the health and performance of horses under your management
            </p>
            
            <div className="monitoring-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Users className="w-6 h-6 text-stable-mahogany" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">{mockPartnerData.activeHorses}</span>
                    <span className="stat-label font-raleway text-sm">Active Horses</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <BarChart3 className="w-6 h-6 text-hunter-green" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">94%</span>
                    <span className="stat-label font-raleway text-sm">Avg Health Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="customer-management">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Customer Success Management
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Manage customer relationships and track satisfaction
            </p>
            
            <div className="customer-overview">
              <div className="overview-stats">
                <div className="stat-card">
                  <Users className="w-6 h-6 text-ribbon-blue" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">{mockPartnerData.totalCustomers}</span>
                    <span className="stat-label font-raleway text-sm">Total Customers</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Award className="w-6 h-6 text-champion-gold" />
                  <div className="stat-content">
                    <span className="stat-number font-bebas text-3xl">97%</span>
                    <span className="stat-label font-raleway text-sm">Satisfaction Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="marketing-tools">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Marketing Tools & Resources
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Access marketing materials and track referral performance
            </p>
            
            <div className="marketing-materials">
              <div className="materials-grid">
                <div className="material-card">
                  <div className="material-thumbnail">
                    <Gift className="w-8 h-8 text-stable-mahogany" />
                  </div>
                  <div className="material-content">
                    <h4 className="material-title font-raleway font-semibold">Partner Brochure</h4>
                    <p className="material-description font-raleway text-sm">
                      Professional brochure highlighting One Barn AI benefits
                    </p>
                  </div>
                  <div className="material-actions">
                    <button className="download-btn">Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="partner-support">
            <h2 className="section-title font-raleway font-bold text-xl mb-4">
              Partner Support
            </h2>
            <p className="font-raleway text-gray-600 mb-6">
              Get help and access partner-exclusive support resources
            </p>
            
            <div className="support-overview">
              <div className="quick-contact">
                <h3 className="font-raleway font-semibold mb-4">Quick Contact</h3>
                <div className="contact-options">
                  <button className="contact-btn primary">
                    <MessageCircle className="w-5 h-5" />
                    Chat with Partner Success
                  </button>
                  <button className="contact-btn secondary">
                    Schedule Call
                  </button>
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