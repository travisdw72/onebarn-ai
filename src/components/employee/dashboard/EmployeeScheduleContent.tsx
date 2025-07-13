import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { IScheduleItem } from '../../../interfaces/EmployeeTypes';

interface IEmployeeScheduleContentProps {
  schedule: IScheduleItem[];
  userRole: string;
}

export const EmployeeScheduleContent: React.FC<IEmployeeScheduleContentProps> = ({
  schedule,
  userRole
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training': return brandConfig.colors.hunterGreen;
      case 'conditioning': return brandConfig.colors.championGold;
      case 'dressage': return brandConfig.colors.ribbonBlue;
      case 'competition': return brandConfig.colors.errorRed;
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
          {dashboardConfig.headers.todaysSchedule}
        </h2>
        <p 
          style={{
            color: `${brandConfig.colors.midnightBlack}99`,
            fontSize: brandConfig.typography.fontSizeSm
          }}
        >
          Your scheduled appointments and activities for today
        </p>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl p-6 shadow-lg border hover:shadow-xl transition-all"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-4 h-16 rounded-full"
                style={{ backgroundColor: getTypeColor(item.type) }}
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 
                    className="font-semibold"
                    style={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeLg,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}
                  >
                    {item.title}
                  </h3>
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getTypeColor(item.type)}1a`,
                      color: getTypeColor(item.type),
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontWeight: brandConfig.typography.weightMedium
                    }}
                  >
                    {item.type.toUpperCase()}
                  </div>
                </div>
                
                <p 
                  className="mb-3"
                  style={{
                    color: `${brandConfig.colors.midnightBlack}cc`,
                    fontSize: brandConfig.typography.fontSizeSm
                  }}
                >
                  {item.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" style={{ color: brandConfig.colors.neutralGray }} />
                    <span style={{ color: brandConfig.colors.neutralGray }}>{item.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" style={{ color: brandConfig.colors.neutralGray }} />
                    <span style={{ color: brandConfig.colors.neutralGray }}>{item.client}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {schedule.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar 
            className="w-16 h-16 mx-auto mb-4" 
            style={{ color: brandConfig.colors.neutralGray }} 
          />
          <h3 
            className="text-xl font-semibold mb-2"
            style={{
              color: brandConfig.colors.midnightBlack,
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            {dashboardConfig.messages.noScheduledSessions}
          </h3>
          <p 
            style={{
              color: `${brandConfig.colors.midnightBlack}99`,
              fontSize: brandConfig.typography.fontSizeBase
            }}
          >
            Enjoy your free time or check back later for updates.
          </p>
        </motion.div>
      )}
    </div>
  );
}; 