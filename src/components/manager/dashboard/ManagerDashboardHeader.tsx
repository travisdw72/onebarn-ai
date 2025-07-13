import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { managerDashboardConfig } from '../../../config/managerDashboardData';
import type { IManagerDashboardHeaderProps } from '../../../interfaces/ManagerTypes';

export const ManagerDashboardHeader: React.FC<IManagerDashboardHeaderProps> = ({
  userName,
  facilityName,
  onEmergencyAlert,
  autoRefresh,
  onAutoRefreshToggle,
  totalRevenue,
  occupancyRate
}) => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b"
      style={{
        backgroundColor: brandConfig.colors.barnWhite,
        borderBottomColor: `${brandConfig.colors.sterlingSilver}33`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          
          {/* Welcome Section */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 
                className="font-bold mb-2"
                style={{
                  fontSize: brandConfig.typography.fontSize3xl,
                  color: brandConfig.colors.stableMahogany,
                  fontFamily: brandConfig.typography.fontDisplay,
                  fontWeight: brandConfig.typography.weightBold
                }}
              >
                {managerDashboardConfig.welcome.title}
              </h1>
              <p 
                className="mb-1"
                style={{
                  fontSize: brandConfig.typography.fontSizeLg,
                  color: brandConfig.colors.midnightBlack,
                  fontWeight: brandConfig.typography.weightMedium
                }}
              >
                Welcome back, {userName}
              </p>
              <p 
                style={{
                  fontSize: brandConfig.typography.fontSizeBase,
                  color: brandConfig.colors.neutralGray
                }}
              >
                {managerDashboardConfig.welcome.subtitle} • {facilityName}
              </p>
            </motion.div>
          </div>

          {/* Key Performance Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            {/* Revenue Indicator */}
            <div 
              className="text-center p-4 rounded-xl shadow-sm border"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderColor: `${brandConfig.colors.championGold}33`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <div 
                className="text-2xl font-bold"
                style={{
                  color: brandConfig.colors.championGold,
                  fontFamily: brandConfig.typography.fontDisplay
                }}
              >
                {totalRevenue}
              </div>
              <div 
                className="text-sm"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm
                }}
              >
                Monthly Revenue
              </div>
            </div>

            {/* Occupancy Indicator */}
            <div 
              className="text-center p-4 rounded-xl shadow-sm border"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderColor: `${brandConfig.colors.pastureSage}33`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <div 
                className="text-2xl font-bold"
                style={{
                  color: brandConfig.colors.pastureSage,
                  fontFamily: brandConfig.typography.fontDisplay
                }}
              >
                {occupancyRate}
              </div>
              <div 
                className="text-sm"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm
                }}
              >
                Occupancy Rate
              </div>
            </div>
          </motion.div>

          {/* Action Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center space-x-4"
          >
            {/* Current Time */}
            <div className="text-center">
              <div 
                className="font-mono text-lg font-semibold"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontFamily: brandConfig.typography.fontMono
                }}
              >
                {currentTime}
              </div>
              <div 
                className="text-xs"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              >
                Local Time
              </div>
            </div>

            {/* Auto Refresh Toggle */}
            <div className="flex flex-col items-center">
              <button
                onClick={onAutoRefreshToggle}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  autoRefresh ? 'shadow-md' : 'shadow-sm'
                }`}
                style={{
                  backgroundColor: autoRefresh ? brandConfig.colors.successGreen : brandConfig.colors.sterlingSilver,
                  color: brandConfig.colors.barnWhite,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightMedium
                }}
              >
                {autoRefresh ? '● Live' : '○ Paused'}
              </button>
              <span 
                className="text-xs mt-1"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              >
                Auto Refresh
              </span>
            </div>

            {/* Emergency Alert Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEmergencyAlert}
              className="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                backgroundColor: brandConfig.colors.errorRed,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightBold,
                border: `2px solid ${brandConfig.colors.errorRed}`
              }}
            >
              🚨 EMERGENCY
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 