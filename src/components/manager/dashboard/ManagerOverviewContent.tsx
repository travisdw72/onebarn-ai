import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { managerDashboardConfig } from '../../../config/managerDashboardData';
import type { IManagerOverviewContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerOverviewContent: React.FC<IManagerOverviewContentProps> = ({
  statistics,
  recentActivity,
  upcomingTasks
}) => {
  return (
    <div className="space-y-8">
      {/* Facility Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 
          className="text-2xl font-bold mb-6"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            fontSize: brandConfig.typography.fontSize2xl,
            fontWeight: brandConfig.typography.weightBold
          }}
        >
          {managerDashboardConfig.headers.facilityOverview}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Daily Summary Card */}
          <div 
            className="p-6 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeLg,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              📊 Daily Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Active Horses:</span>
                <span style={{ color: brandConfig.colors.midnightBlack, fontWeight: brandConfig.typography.weightSemiBold }}>
                  {statistics.find(s => s.key === 'totalHorses')?.value || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Appointments Today:</span>
                <span style={{ color: brandConfig.colors.midnightBlack, fontWeight: brandConfig.typography.weightSemiBold }}>
                  {statistics.find(s => s.key === 'upcomingAppointments')?.value || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Staff on Duty:</span>
                <span style={{ color: brandConfig.colors.successGreen, fontWeight: brandConfig.typography.weightSemiBold }}>
                  12/15
                </span>
              </div>
            </div>
          </div>

          {/* Financial Overview Card */}
          <div 
            className="p-6 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.championGold}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{
                color: brandConfig.colors.championGold,
                fontSize: brandConfig.typography.fontSizeLg,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              💰 Financial Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Monthly Revenue:</span>
                <span style={{ color: brandConfig.colors.championGold, fontWeight: brandConfig.typography.weightSemiBold }}>
                  {statistics.find(s => s.key === 'monthlyRevenue')?.value || '$0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Outstanding Invoices:</span>
                <span style={{ color: brandConfig.colors.alertAmber, fontWeight: brandConfig.typography.weightSemiBold }}>
                  $12,450
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: brandConfig.colors.neutralGray }}>Profit Margin:</span>
                <span style={{ color: brandConfig.colors.successGreen, fontWeight: brandConfig.typography.weightSemiBold }}>
                  28.5%
                </span>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications Card */}
          <div 
            className="p-6 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.victoryRose}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{
                color: brandConfig.colors.victoryRose,
                fontSize: brandConfig.typography.fontSizeLg,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              🚨 Alerts & Priority Items
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: brandConfig.colors.errorRed }}
                />
                <span 
                  className="text-sm"
                  style={{ 
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeSm 
                  }}
                >
                  2 horses need immediate veterinary attention
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: brandConfig.colors.alertAmber }}
                />
                <span 
                  className="text-sm"
                  style={{ 
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeSm 
                  }}
                >
                  5 partnership applications pending review
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: brandConfig.colors.successGreen }}
                />
                <span 
                  className="text-sm"
                  style={{ 
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeSm 
                  }}
                >
                  All facilities operating normally
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 
          className="text-2xl font-bold mb-6"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontDisplay,
            fontSize: brandConfig.typography.fontSize2xl,
            fontWeight: brandConfig.typography.weightBold
          }}
        >
          {managerDashboardConfig.headers.quickActions}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {managerDashboardConfig.quickActions.map((action, index) => (
            <motion.button
              key={action.action}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border text-center"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderColor: `${brandConfig.colors.sterlingSilver}33`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div 
                className="font-medium text-sm"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightMedium
                }}
              >
                {action.label}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 