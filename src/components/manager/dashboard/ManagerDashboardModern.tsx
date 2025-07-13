import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ManagerDashboardHeader } from './ManagerDashboardHeader';
import { ManagerQuickStatsGrid } from './ManagerQuickStatsGrid';
import { ManagerTabNavigation, type TabId } from './ManagerTabNavigation';
import { ManagerDashboardContent } from './ManagerDashboardContent';
import { managerDashboardConfig, type ManagerStatistic } from '../../../config/managerDashboardData';
import { partnershipConfig } from '../../../config/partnershipConfig';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerDashboardModernProps, BarnPartnershipData } from '../../../interfaces/ManagerTypes';

export const ManagerDashboardModern: React.FC<IManagerDashboardModernProps> = ({
  facilityId
}) => {
  const [selectedTab, setSelectedTab] = useState<TabId>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh interval setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Refresh data here when needed
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleEmergencyAlert = () => {
    alert('🚨 EMERGENCY ALERT ACTIVATED! Emergency services have been notified. All staff will be alerted immediately.');
  };

  const handleStatClick = (statId: string) => {
    // Navigate to appropriate tab based on stat clicked
    switch (statId) {
      case 'monthlyRevenue':
      case 'partnerships':
        setSelectedTab('partnerships');
        break;
      case 'stallOccupancy':
      case 'totalHorses':
        setSelectedTab('operations');
        break;
      case 'healthAlerts':
        setSelectedTab('analytics');
        break;
      default:
        setSelectedTab('overview');
        break;
    }
  };

  const handleTabChange = (tab: TabId) => {
    setSelectedTab(tab);
  };

  // Get manager-specific data from config
  const statistics = managerDashboardConfig.mockData.statistics;
  const modules = Object.values(managerDashboardConfig.modules);
  const performanceMetrics = managerDashboardConfig.mockData.performanceMetrics;

  // Build partnership data from config
  const partnershipData: BarnPartnershipData = {
    totalPartners: partnershipConfig.mockData.totalPartners,
    activePartners: partnershipConfig.mockData.activePartners,
    monthlyRevenue: partnershipConfig.mockData.monthlyRevenue,
    conversionRate: partnershipConfig.mockData.conversionRate,
    jointRevenue: partnershipConfig.mockData.jointRevenue,
    pendingApplications: partnershipConfig.mockData.pendingApplications,
    activePartnerships: partnershipConfig.mockData.activePartnerships,
    revenueSharing: [], // Would be populated from API
    vetPartners: partnershipConfig.mockData.vetPartners,
    vetReferrals: [] // Would be populated from API
  };

  // Get facility information
  const facilityName = "Sunset Ridge Equestrian Center";
  const userName = "Jennifer Martinez";
  const totalRevenue = statistics.find(s => s.key === 'monthlyRevenue')?.value || '$0';
  const occupancyRate = statistics.find(s => s.key === 'stallOccupancy')?.value || '0%';

  // Determine available tabs
  const availableTabs: TabId[] = ['overview', 'operations', 'partnerships', 'analytics', 'reports', 'demo'];

  return (
    <div className="manager-dashboard min-h-screen" style={{ backgroundColor: brandConfig.colors.arenaSand }}>
      
      <ManagerDashboardHeader 
        userName={userName}
        facilityName={facilityName}
        onEmergencyAlert={handleEmergencyAlert}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={handleAutoRefreshToggle}
        totalRevenue={totalRevenue}
        occupancyRate={occupancyRate}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <ManagerQuickStatsGrid 
          statistics={statistics}
          onStatClick={handleStatClick} 
        />
        
        <ManagerTabNavigation 
          selectedTab={selectedTab} 
          onTabChange={handleTabChange}
          availableTabs={availableTabs}
        />
        
        <ManagerDashboardContent 
          selectedTab={selectedTab}
          statistics={statistics}
          modules={modules}
          performanceMetrics={performanceMetrics}
          partnershipData={partnershipData}
        />
      </div>

      {/* Success Animation for Partnership Tab */}
      {selectedTab === 'partnerships' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50"
          style={{
            backgroundColor: brandConfig.colors.championGold,
            color: brandConfig.colors.barnWhite
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            🤝
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}; 