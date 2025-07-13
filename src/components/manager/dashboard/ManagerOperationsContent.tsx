import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { managerDashboardConfig } from '../../../config/managerDashboardData';
import type { IManagerOperationsContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerOperationsContent: React.FC<IManagerOperationsContentProps> = ({
  modules,
  dailyTasks,
  staffOverview
}) => {
  return (
    <div className="space-y-8">
      {/* Management Modules Grid */}
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
          {managerDashboardConfig.headers.managementModules}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(managerDashboardConfig.modules).map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderColor: `${brandConfig.colors.sterlingSilver}33`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{module.icon}</span>
                <h3 
                  className="text-lg font-semibold"
                  style={{
                    color: brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeLg,
                    fontWeight: brandConfig.typography.weightSemiBold
                  }}
                >
                  {module.title}
                </h3>
              </div>
              
              <p 
                className="mb-4"
                style={{
                  color: brandConfig.colors.neutralGray,
                  fontSize: brandConfig.typography.fontSizeSm
                }}
              >
                {module.description}
              </p>
              
              <div className="space-y-2">
                <h4 
                  className="font-medium text-sm"
                  style={{
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontWeight: brandConfig.typography.weightMedium
                  }}
                >
                  Key Features:
                </h4>
                <ul className="space-y-1">
                  {module.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="text-sm flex items-center"
                      style={{
                        color: brandConfig.colors.neutralGray,
                        fontSize: brandConfig.typography.fontSizeXs
                      }}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full mr-2"
                        style={{ backgroundColor: brandConfig.colors.stableMahogany }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Staff Operations Overview */}
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
          Staff Operations Dashboard
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Tasks Overview */}
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
              📋 Daily Task Overview
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span style={{ color: brandConfig.colors.neutralGray }}>Total Tasks:</span>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: brandConfig.colors.midnightBlack,
                    fontWeight: brandConfig.typography.weightSemiBold 
                  }}
                >
                  47
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: brandConfig.colors.neutralGray }}>Completed:</span>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: brandConfig.colors.successGreen,
                    fontWeight: brandConfig.typography.weightSemiBold 
                  }}
                >
                  32 (68%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: brandConfig.colors.neutralGray }}>In Progress:</span>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: brandConfig.colors.alertAmber,
                    fontWeight: brandConfig.typography.weightSemiBold 
                  }}
                >
                  12 (26%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: brandConfig.colors.neutralGray }}>Overdue:</span>
                <span 
                  className="font-semibold"
                  style={{ 
                    color: brandConfig.colors.errorRed,
                    fontWeight: brandConfig.typography.weightSemiBold 
                  }}
                >
                  3 (6%)
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div 
                  className="w-full h-3 rounded-full"
                  style={{ backgroundColor: `${brandConfig.colors.sterlingSilver}33` }}
                >
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: '68%',
                      backgroundColor: brandConfig.colors.successGreen,
                      borderRadius: brandConfig.layout.borderRadius
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Staff Status */}
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
              👥 Staff Status
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', role: 'Head Trainer', status: 'online', tasks: '8/10' },
                { name: 'Mike Thompson', role: 'Facility Manager', status: 'busy', tasks: '6/8' },
                { name: 'Lisa Chen', role: 'Veterinarian', status: 'online', tasks: '4/6' },
                { name: 'David Rodriguez', role: 'Groom', status: 'offline', tasks: '12/15' }
              ].map((staff, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: staff.status === 'online' 
                          ? brandConfig.colors.successGreen
                          : staff.status === 'busy'
                          ? brandConfig.colors.alertAmber
                          : brandConfig.colors.neutralGray
                      }}
                    />
                    <div>
                      <div 
                        className="font-medium"
                        style={{
                          color: brandConfig.colors.midnightBlack,
                          fontSize: brandConfig.typography.fontSizeSm,
                          fontWeight: brandConfig.typography.weightMedium
                        }}
                      >
                        {staff.name}
                      </div>
                      <div 
                        className="text-xs"
                        style={{
                          color: brandConfig.colors.neutralGray,
                          fontSize: brandConfig.typography.fontSizeXs
                        }}
                      >
                        {staff.role}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-sm font-medium"
                    style={{
                      color: brandConfig.colors.stableMahogany,
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightMedium
                    }}
                  >
                    {staff.tasks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 