import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerQuickStatsGridProps } from '../../../interfaces/ManagerTypes';

export const ManagerQuickStatsGrid: React.FC<IManagerQuickStatsGridProps> = ({
  statistics,
  onStatClick
}) => {
  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return brandConfig.colors.successGreen;
      case 'warning':
        return brandConfig.colors.alertAmber;
      case 'critical':
        return brandConfig.colors.errorRed;
      default:
        return brandConfig.colors.neutralGray;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return brandConfig.colors.successGreen;
    if (change < 0) return brandConfig.colors.errorRed;
    return brandConfig.colors.neutralGray;
  };

  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statistics.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => onStatClick(stat.key)}
            className="cursor-pointer rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: getStatusColor(stat.status)
                }}
              />
              <div 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getStatusColor(stat.status)}15`,
                  color: getStatusColor(stat.status),
                  fontSize: brandConfig.typography.fontSizeXs,
                  fontWeight: brandConfig.typography.weightMedium,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {stat.status.toUpperCase()}
              </div>
            </div>

            {/* Main Value */}
            <div className="mb-4">
              <div 
                className="text-3xl font-bold mb-2"
                style={{
                  color: brandConfig.colors.stableMahogany,
                  fontFamily: brandConfig.typography.fontDisplay,
                  fontSize: brandConfig.typography.fontSize3xl,
                  fontWeight: brandConfig.typography.weightBold
                }}
              >
                {stat.value}
              </div>
              <div 
                className="font-medium"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightMedium
                }}
              >
                {stat.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </div>

            {/* Change Indicator */}
            <div className="flex items-center">
              <span 
                className="text-sm font-semibold"
                style={{
                  color: getChangeColor(stat.change),
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                {stat.change > 0 ? '↗' : stat.change < 0 ? '↘' : '→'} {formatChange(stat.change)}
              </span>
              <span 
                className="text-xs ml-2"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              >
                vs last month
              </span>
            </div>

            {/* Hover Effect Overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-5 transition-opacity duration-300"
              style={{
                backgroundColor: brandConfig.colors.stableMahogany,
                borderRadius: brandConfig.layout.borderRadius
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 