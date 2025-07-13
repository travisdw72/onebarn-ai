import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Phone, Bell } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { IEmployeeRole } from '../../../interfaces/EmployeeTypes';

interface IEmployeeDashboardHeaderProps {
  userRole: string;
  userName: string;
  roleConfig: IEmployeeRole;
  onEmergencyAlert: () => void;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
}

export const EmployeeDashboardHeader: React.FC<IEmployeeDashboardHeaderProps> = ({
  userRole,
  userName,
  roleConfig,
  onEmergencyAlert,
  autoRefresh,
  onAutoRefreshToggle
}) => {
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-arena-sand py-6 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: brandConfig.colors.stableMahogany }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{roleConfig.icon}</div>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ 
                  fontSize: brandConfig.typography.fontSize3xl,
                  fontWeight: brandConfig.typography.weightBold 
                }}
              >
                {dashboardConfig.welcome.title}
              </h1>
              <p 
                className="mt-1"
                style={{ 
                  color: `${brandConfig.colors.arenaSand}cc`,
                  fontSize: brandConfig.typography.fontSizeBase
                }}
              >
                {userName} - {roleConfig.user.title}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span 
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ 
                    backgroundColor: brandConfig.colors.hunterGreen,
                    color: brandConfig.colors.arenaSand,
                    fontSize: brandConfig.typography.fontSizeXs
                  }}
                >
                  {roleConfig.badge}
                </span>
                <span 
                  className="text-sm"
                  style={{ color: `${brandConfig.colors.arenaSand}b3` }}
                >
                  {currentTime}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onAutoRefreshToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'text-arena-sand' 
                  : 'text-arena-sand/70'
              }`}
              style={{
                backgroundColor: autoRefresh 
                  ? brandConfig.colors.hunterGreen 
                  : `${brandConfig.colors.arenaSand}33`,
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`
              }}
            >
              <RotateCcw className="w-4 h-4" />
              <span style={{ fontSize: brandConfig.typography.fontSizeSm }}>
                Auto Refresh
              </span>
            </button>
            <button 
              onClick={onEmergencyAlert}
              className="font-semibold hover:opacity-90 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.errorRed,
                color: brandConfig.colors.arenaSand,
                fontSize: brandConfig.typography.fontSizeSm,
                fontWeight: brandConfig.typography.weightSemiBold,
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`
              }}
            >
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm rounded-2xl p-4 border"
          style={{
            backgroundColor: `${brandConfig.colors.arenaSand}33`,
            borderColor: `${brandConfig.colors.arenaSand}4d`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <div className="flex items-center space-x-3">
            <Bell 
              className="w-6 h-6" 
              style={{ color: brandConfig.colors.championGold }} 
            />
            <p 
              className="font-medium"
              style={{ 
                color: brandConfig.colors.arenaSand,
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightMedium
              }}
            >
              {dashboardConfig.welcome.subtitle}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}; 