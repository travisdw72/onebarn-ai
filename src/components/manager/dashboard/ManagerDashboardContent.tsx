import React from 'react';
import { motion } from 'framer-motion';
import { ManagerOverviewContent } from './ManagerOverviewContent';
import { ManagerOperationsContent } from './ManagerOperationsContent';
import { ManagerBarnPartnershipContent } from './ManagerBarnPartnershipContent';
import { ManagerAnalyticsContent } from './ManagerAnalyticsContent';
import { ManagerReportsContent } from './ManagerReportsContent';
import { ManagerDemoContent } from './ManagerDemoContent';
import type { IManagerDashboardContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerDashboardContent: React.FC<IManagerDashboardContentProps> = ({
  selectedTab,
  statistics,
  modules,
  performanceMetrics,
  partnershipData
}) => {
  const handlePartnerAction = (action: string, partnerId: string) => {
    // Handle partnership actions in a production environment
    if (import.meta.env.DEV) {
      console.log(`Manager action: ${action} for partner ${partnerId}`);
    }
  };

  const handleGenerateReport = (reportId: string) => {
    // Handle report generation in a production environment
    if (import.meta.env.DEV) {
      console.log(`Generating report: ${reportId}`);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <ManagerOverviewContent 
            statistics={statistics}
            recentActivity={[]} // This would come from props or context
            upcomingTasks={[]} // This would come from props or context
          />
        );
      case 'operations':
        return (
          <ManagerOperationsContent 
            modules={modules}
            dailyTasks={[]} // This would come from props or context
            staffOverview={[]} // This would come from props or context
          />
        );
      case 'partnerships':
        return (
          <ManagerBarnPartnershipContent 
            partnershipData={partnershipData}
            onPartnerAction={handlePartnerAction}
          />
        );
      case 'analytics':
        return (
          <ManagerAnalyticsContent 
            performanceMetrics={performanceMetrics}
            trendData={[]} // This would come from props or context
          />
        );
      case 'reports':
        return (
          <ManagerReportsContent 
            availableReports={[]} // This would come from props or context
            onGenerateReport={handleGenerateReport}
          />
        );
      case 'demo':
        return (
          <ManagerDemoContent 
            facilityName="Sunset Ridge Equestrian Center"
            demoMode={true}
          />
        );
      default:
        return <ManagerOverviewContent statistics={statistics} recentActivity={[]} upcomingTasks={[]} />;
    }
  };

  return (
    <motion.div
      key={selectedTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {renderContent()}
    </motion.div>
  );
}; 