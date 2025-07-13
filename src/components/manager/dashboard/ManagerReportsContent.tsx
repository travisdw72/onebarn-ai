import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerReportsContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerReportsContent: React.FC<IManagerReportsContentProps> = ({
  availableReports,
  onGenerateReport
}) => {
  const reportCategories = [
    {
      category: 'financial',
      title: 'Financial Reports',
      icon: '💰',
      reports: [
        { id: 'monthly-revenue', name: 'Monthly Revenue Report', description: 'Comprehensive revenue breakdown by service' },
        { id: 'partnership-revenue', name: 'Partnership Revenue Report', description: 'Partnership earnings and commissions' },
        { id: 'expense-analysis', name: 'Expense Analysis', description: 'Operating costs and budget analysis' }
      ]
    },
    {
      category: 'operational',
      title: 'Operational Reports',
      icon: '⚙️',
      reports: [
        { id: 'facility-utilization', name: 'Facility Utilization', description: 'Stall occupancy and resource usage' },
        { id: 'staff-performance', name: 'Staff Performance', description: 'Employee productivity and task completion' },
        { id: 'maintenance-log', name: 'Maintenance Log', description: 'Equipment and facility maintenance history' }
      ]
    },
    {
      category: 'partnership',
      title: 'Partnership Reports',
      icon: '🤝',
      reports: [
        { id: 'partner-performance', name: 'Partner Performance', description: 'Individual partner metrics and performance' },
        { id: 'application-summary', name: 'Application Summary', description: 'Partnership application pipeline and status' },
        { id: 'vet-referrals', name: 'Veterinary Referrals', description: 'Vet partnership referral tracking' }
      ]
    },
    {
      category: 'compliance',
      title: 'Compliance Reports',
      icon: '📋',
      reports: [
        { id: 'health-compliance', name: 'Health Compliance', description: 'Vaccination and health record compliance' },
        { id: 'safety-audit', name: 'Safety Audit', description: 'Facility safety inspections and compliance' },
        { id: 'insurance-summary', name: 'Insurance Summary', description: 'Insurance coverage and claims history' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Reports Header */}
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
          📋 Reports & Analytics
        </h2>
      </motion.div>

      {/* Report Categories */}
      <div className="space-y-8">
        {reportCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
          >
            <h3 
              className="text-xl font-semibold mb-4 flex items-center space-x-2"
              style={{
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              <span className="text-2xl">{category.icon}</span>
              <span>{category.title}</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.reports.map((report, reportIndex) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIndex * 0.1) + (reportIndex * 0.05), duration: 0.6 }}
                  className="p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300"
                  style={{
                    backgroundColor: brandConfig.colors.barnWhite,
                    borderColor: `${brandConfig.colors.sterlingSilver}33`,
                    borderRadius: brandConfig.layout.borderRadius
                  }}
                >
                  <h4 
                    className="font-semibold mb-2"
                    style={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeBase,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}
                  >
                    {report.name}
                  </h4>
                  <p 
                    className="mb-4"
                    style={{
                      color: brandConfig.colors.neutralGray,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}
                  >
                    {report.description}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onGenerateReport(report.id)}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                      style={{
                        backgroundColor: brandConfig.colors.stableMahogany,
                        color: brandConfig.colors.barnWhite,
                        fontSize: brandConfig.typography.fontSizeSm,
                        borderRadius: brandConfig.layout.borderRadius
                      }}
                    >
                      Generate
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-md border"
                      style={{
                        backgroundColor: 'transparent',
                        color: brandConfig.colors.stableMahogany,
                        borderColor: brandConfig.colors.stableMahogany,
                        fontSize: brandConfig.typography.fontSizeSm,
                        borderRadius: brandConfig.layout.borderRadius
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 
          className="text-xl font-semibold mb-4"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeXl,
            fontWeight: brandConfig.typography.weightSemiBold
          }}
        >
          📥 Recent Reports
        </h3>
        
        <div 
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.sterlingSilver}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <div className="space-y-3">
            {[
              { name: 'Monthly Revenue Report - January 2024', date: '2024-01-31', size: '2.3 MB' },
              { name: 'Partnership Performance Report - Q4 2023', date: '2024-01-15', size: '1.8 MB' },
              { name: 'Facility Utilization Report - December 2023', date: '2024-01-05', size: '945 KB' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                <div>
                  <div 
                    className="font-medium"
                    style={{
                      color: brandConfig.colors.midnightBlack,
                      fontSize: brandConfig.typography.fontSizeBase,
                      fontWeight: brandConfig.typography.weightMedium
                    }}
                  >
                    {report.name}
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      color: brandConfig.colors.neutralGray,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}
                  >
                    Generated: {report.date} • {report.size}
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    backgroundColor: `${brandConfig.colors.stableMahogany}15`,
                    color: brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeSm,
                    borderRadius: brandConfig.layout.borderRadius
                  }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 