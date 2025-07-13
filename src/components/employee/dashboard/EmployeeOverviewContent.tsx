import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/employeeDashboardData';
import type { IRoleDashboardData, IAlert } from '../../../interfaces/EmployeeTypes';

interface IEmployeeOverviewContentProps {
  roleData: IRoleDashboardData;
  userRole: string;
}

export const EmployeeOverviewContent: React.FC<IEmployeeOverviewContentProps> = ({
  roleData,
  userRole
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-5 h-5" style={{ color: brandConfig.colors.errorRed }} />;
      case 'warning': return <AlertTriangle className="w-5 h-5" style={{ color: brandConfig.colors.alertAmber }} />;
      case 'info': return <CheckCircle className="w-5 h-5" style={{ color: brandConfig.colors.infoBlue }} />;
      case 'success': return <CheckCircle className="w-5 h-5" style={{ color: brandConfig.colors.successGreen }} />;
      default: return <Clock className="w-5 h-5" style={{ color: brandConfig.colors.neutralGray }} />;
    }
  };

  const getAlertBorderColor = (type: string) => {
    switch (type) {
      case 'error': return brandConfig.colors.errorRed;
      case 'warning': return brandConfig.colors.alertAmber;
      case 'info': return brandConfig.colors.infoBlue;
      case 'success': return brandConfig.colors.successGreen;
      default: return brandConfig.colors.neutralGray;
    }
  };

  const mockAlerts: IAlert[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Dashboard',
      content: 'Access your daily tasks, schedule, and available modules from the tabs above.',
      type: 'info',
      timestamp: new Date().toISOString()
    }
  ];

  const alerts = roleData.alerts || mockAlerts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 space-y-8"
      >
        
        {/* Recent Alerts */}
        <div 
          className="rounded-3xl p-6 shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.sterlingSilver}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            Recent Updates
          </h2>
          <div className="space-y-4">
            {alerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl border-l-4"
                style={{
                  backgroundColor: `${getAlertBorderColor(alert.type)}0d`,
                  borderLeftColor: getAlertBorderColor(alert.type),
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h3 
                    className="font-semibold"
                    style={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeBase,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}
                  >
                    {alert.title}
                  </h3>
                  <p 
                    className="mt-1"
                    style={{
                      color: `${brandConfig.colors.midnightBlack}cc`,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}
                  >
                    {alert.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="rounded-3xl p-6 shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.sterlingSilver}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="p-4 rounded-xl text-left hover:shadow-md transition-all"
              style={{
                backgroundColor: `${brandConfig.colors.hunterGreen}1a`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <TrendingUp 
                className="w-8 h-8 mb-2" 
                style={{ color: brandConfig.colors.hunterGreen }} 
              />
              <h3 
                className="font-semibold"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                View Reports
              </h3>
            </button>
            <button 
              className="p-4 rounded-xl text-left hover:shadow-md transition-all"
              style={{
                backgroundColor: `${brandConfig.colors.championGold}1a`,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <CheckCircle 
                className="w-8 h-8 mb-2" 
                style={{ color: brandConfig.colors.championGold }} 
              />
              <h3 
                className="font-semibold"
                style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                Complete Tasks
              </h3>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div 
          className="rounded-3xl p-6 shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.sterlingSilver}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h3 
            className="text-lg font-bold mb-4"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            Today's Summary
          </h3>
          <div className="space-y-3">
            {roleData.stats.slice(0, 2).map((stat) => (
              <div key={stat.id} className="flex justify-between items-center">
                <span 
                  style={{
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeSm
                  }}
                >
                  {stat.label}
                </span>
                <span 
                  className="font-semibold"
                  style={{
                    color: brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontWeight: brandConfig.typography.weightSemiBold
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 