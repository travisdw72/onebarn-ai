import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { IModule } from '../../../interfaces/EmployeeTypes';

interface IEmployeeModulesContentProps {
  modules: IModule[];
  userRole: string;
}

export const EmployeeModulesContent: React.FC<IEmployeeModulesContentProps> = ({
  modules,
  userRole
}) => {
  const getPermissionIcon = (permission: string, disabled?: boolean) => {
    if (disabled) return <Lock className="w-5 h-5" style={{ color: brandConfig.colors.neutralGray }} />;
    
    switch (permission) {
      case 'full': return <CheckCircle className="w-5 h-5" style={{ color: brandConfig.colors.successGreen }} />;
      case 'limited': return <AlertTriangle className="w-5 h-5" style={{ color: brandConfig.colors.alertAmber }} />;
      case 'none': return <Lock className="w-5 h-5" style={{ color: brandConfig.colors.errorRed }} />;
      default: return <Lock className="w-5 h-5" style={{ color: brandConfig.colors.neutralGray }} />;
    }
  };

  const getPermissionText = (permission: string, disabled?: boolean) => {
    if (disabled) return dashboardConfig.permissions.none;
    return dashboardConfig.permissions[permission as keyof typeof dashboardConfig.permissions] || 
           dashboardConfig.permissions.unknown;
  };

  const getPermissionColor = (permission: string, disabled?: boolean) => {
    if (disabled) return brandConfig.colors.neutralGray;
    
    switch (permission) {
      case 'full': return brandConfig.colors.successGreen;
      case 'limited': return brandConfig.colors.alertAmber;
      case 'none': return brandConfig.colors.errorRed;
      default: return brandConfig.colors.neutralGray;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div 
        className="rounded-3xl p-6 shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderColor: `${brandConfig.colors.sterlingSilver}33`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <h2 
          className="text-2xl font-bold mb-2"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSize2xl,
            fontWeight: brandConfig.typography.weightBold
          }}
        >
          Available Modules
        </h2>
        <p 
          style={{
            color: `${brandConfig.colors.midnightBlack}99`,
            fontSize: brandConfig.typography.fontSizeSm
          }}
        >
          Access the tools and features available to your role
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-2xl p-6 shadow-lg border transition-all ${
              module.disabled || module.permission === 'none' 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:shadow-xl cursor-pointer hover:scale-105'
            }`}
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{module.icon}</div>
              <div className="flex items-center space-x-1">
                {getPermissionIcon(module.permission, module.disabled)}
                <span 
                  className="text-xs font-medium"
                  style={{
                    color: getPermissionColor(module.permission, module.disabled),
                    fontSize: brandConfig.typography.fontSizeXs,
                    fontWeight: brandConfig.typography.weightMedium
                  }}
                >
                  {getPermissionText(module.permission, module.disabled)}
                </span>
              </div>
            </div>

            <h3 
              className="font-semibold mb-2"
              style={{
                color: module.disabled ? `${brandConfig.colors.midnightBlack}66` : brandConfig.colors.midnightBlack,
                fontSize: brandConfig.typography.fontSizeLg,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              {module.title}
            </h3>

            <p 
              className="mb-4"
              style={{
                color: module.disabled ? `${brandConfig.colors.midnightBlack}4d` : `${brandConfig.colors.midnightBlack}cc`,
                fontSize: brandConfig.typography.fontSizeSm
              }}
            >
              {module.description}
            </p>

            {!module.disabled && module.permission !== 'none' && (
              <button 
                className="flex items-center space-x-2 w-full justify-center py-2 px-4 rounded-lg hover:opacity-90 transition-colors"
                style={{
                  backgroundColor: module.permission === 'full' 
                    ? brandConfig.colors.hunterGreen 
                    : brandConfig.colors.alertAmber,
                  color: brandConfig.colors.arenaSand,
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightMedium,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                <span>Access Module</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}

            {(module.disabled || module.permission === 'none') && (
              <div 
                className="text-center py-2 px-4 rounded-lg"
                style={{
                  backgroundColor: `${brandConfig.colors.neutralGray}1a`,
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {dashboardConfig.messages.accessDenied}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 