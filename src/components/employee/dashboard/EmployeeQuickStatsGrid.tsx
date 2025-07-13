import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { IRoleDashboardData, IQuickStat } from '../../../interfaces/EmployeeTypes';

interface IEmployeeQuickStatsGridProps {
  roleData: IRoleDashboardData;
  onStatClick: (statId: string) => void;
}

interface IMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  onClick: () => void;
  index: number;
}

const MetricCard: React.FC<IMetricCardProps> = ({ 
  title, 
  value, 
  subtitle = "", 
  trend = "neutral", 
  onClick, 
  index 
}) => {
  const getStatusIcon = () => {
    switch (trend) {
      case 'up': return '🟢';
      case 'down': return '🔴'; 
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  const getStatusColor = () => {
    switch (trend) {
      case 'up': return brandConfig.colors.successGreen;
      case 'down': return brandConfig.colors.errorRed;
      case 'warning': return brandConfig.colors.alertAmber;
      default: return brandConfig.colors.neutralGray;
    }
  };

  const getTooltip = (statId: string) => {
    return dashboardConfig.tooltips[statId as keyof typeof dashboardConfig.tooltips] || 
           dashboardConfig.tooltips.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105"
      onClick={onClick}
      style={{
        backgroundColor: brandConfig.colors.barnWhite,
        borderColor: `${brandConfig.colors.sterlingSilver}33`,
        borderWidth: '1px',
        borderRadius: brandConfig.layout.borderRadius
      }}
      title={getTooltip(title.toLowerCase().replace(/\s+/g, '-'))}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{getStatusIcon()}</span>
        <span 
          className="text-sm font-medium"
          style={{ 
            color: getStatusColor(),
            fontSize: brandConfig.typography.fontSizeSm,
            fontWeight: brandConfig.typography.weightMedium
          }}
        >
          {trend.toUpperCase()}
        </span>
      </div>
      <div 
        className="text-3xl font-bold mb-1"
        style={{
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSize3xl,
          fontWeight: brandConfig.typography.weightBold
        }}
      >
        {value}
      </div>
      <div 
        className="text-lg font-semibold mb-2"
        style={{
          color: brandConfig.colors.midnightBlack,
          fontSize: brandConfig.typography.fontSizeLg,
          fontWeight: brandConfig.typography.weightSemiBold
        }}
      >
        {title}
      </div>
      {subtitle && (
        <p 
          className="text-sm"
          style={{
            color: `${brandConfig.colors.midnightBlack}99`,
            fontSize: brandConfig.typography.fontSizeSm
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export const EmployeeQuickStatsGrid: React.FC<IEmployeeQuickStatsGridProps> = ({
  roleData,
  onStatClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {roleData.stats.map((stat: IQuickStat, index: number) => (
        <MetricCard
          key={stat.id}
          title={stat.label}        // CRITICAL: stat.label -> title (employee data structure)
          value={stat.value}        // CRITICAL: stat.value -> value (employee data structure)
          subtitle=""               // No subtitle in employee data
          trend="neutral"           // No trend in employee data
          onClick={() => onStatClick(stat.id)}
          index={index}
        />
      ))}
    </motion.div>
  );
}; 