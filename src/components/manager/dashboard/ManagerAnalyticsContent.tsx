import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerAnalyticsContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerAnalyticsContent: React.FC<IManagerAnalyticsContentProps> = ({
  performanceMetrics,
  trendData
}) => {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
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
          📈 Performance Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="p-6 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderColor: `${brandConfig.colors.sterlingSilver}33`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <div 
                className="text-2xl font-bold mb-2"
                style={{
                  color: metric.status === 'good' 
                    ? brandConfig.colors.successGreen
                    : metric.status === 'warning'
                    ? brandConfig.colors.alertAmber
                    : brandConfig.colors.errorRed,
                  fontFamily: brandConfig.typography.fontDisplay,
                  fontSize: brandConfig.typography.fontSize2xl,
                  fontWeight: brandConfig.typography.weightBold
                }}
              >
                {metric.value}
              </div>
              <div 
                className="font-medium mb-1"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightMedium
                }}
              >
                {metric.key}
              </div>
              <div 
                className="text-sm"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm
                }}
              >
                Target: {metric.target}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Analytics Coming Soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center p-16 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderColor: `${brandConfig.colors.sterlingSilver}33`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <div className="text-6xl mb-4">📊</div>
        <h3 
          className="text-xl font-semibold mb-4"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeXl,
            fontWeight: brandConfig.typography.weightSemiBold
          }}
        >
          Advanced Analytics Dashboard
        </h3>
        <p 
          style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeBase
          }}
        >
          Comprehensive analytics interface with charts, trends, and insights coming soon.
        </p>
      </motion.div>
    </div>
  );
}; 