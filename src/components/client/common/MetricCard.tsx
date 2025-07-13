import React from 'react';
import { motion } from 'framer-motion';
import { IMetricCardProps } from '../../../interfaces/ClientTypes';

export const MetricCard: React.FC<IMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  onClick,
  loading = false,
  className = '',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ) : (
              <p className="text-3xl font-bold text-stable-mahogany">{value}</p>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {icon && (
          <div className="ml-4 text-stable-mahogany">
            {icon}
          </div>
        )}
      </div>
      
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
          </span>
        </div>
      )}
    </motion.div>
  );
}; 