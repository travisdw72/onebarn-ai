import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { partnershipConfig } from '../../../config/partnershipConfig';
import type { IManagerPartnershipsContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerPartnershipsContent: React.FC<IManagerPartnershipsContentProps> = ({
  partnershipData,
  onPartnerAction
}) => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'applications' | 'management' | 'revenue' | 'veterinary'>('dashboard');

  const renderPartnershipDashboard = () => (
    <div className="space-y-6">
      {/* Partnership Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: partnershipConfig.metrics.totalPartners, value: partnershipData.totalPartners, color: brandConfig.colors.championGold },
          { label: partnershipConfig.metrics.activePartners, value: partnershipData.activePartners, color: brandConfig.colors.successGreen },
          { label: partnershipConfig.metrics.monthlyRevenue, value: partnershipData.monthlyRevenue, color: brandConfig.colors.pastureSage },
          { label: partnershipConfig.metrics.conversionRate, value: partnershipData.conversionRate, color: brandConfig.colors.ribbonBlue }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="p-6 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${metric.color}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div 
              className="text-3xl font-bold mb-2"
              style={{
                color: metric.color,
                fontFamily: brandConfig.typography.fontDisplay,
                fontSize: brandConfig.typography.fontSize3xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {metric.value}
            </div>
            <div 
              style={{
                color: brandConfig.colors.midnightBlack,
                fontSize: brandConfig.typography.fontSizeBase,
                fontWeight: brandConfig.typography.weightMedium
              }}
            >
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Partnership Activity */}
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
          🤝 Recent Partnership Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'New application received', partner: 'Sunset Ridge Stables', time: '2 hours ago', type: 'application' },
            { action: 'Payment processed', partner: 'Golden Oak Stables', time: '4 hours ago', type: 'payment' },
            { action: 'Partnership activated', partner: 'Valley View Stables', time: '1 day ago', type: 'activation' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${brandConfig.colors.arenaSand}50` }}>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: activity.type === 'application' 
                      ? brandConfig.colors.alertAmber
                      : activity.type === 'payment'
                      ? brandConfig.colors.successGreen
                      : brandConfig.colors.championGold
                  }}
                />
                <div>
                  <div style={{ color: brandConfig.colors.midnightBlack, fontWeight: brandConfig.typography.weightMedium }}>
                    {activity.action}
                  </div>
                  <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                    {activity.partner}
                  </div>
                </div>
              </div>
              <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h3 
        className="text-xl font-bold"
        style={{
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightBold
        }}
      >
        Pending Applications ({partnershipData.pendingApplications.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {partnershipData.pendingApplications.map((application, index) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="p-6 rounded-2xl shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.alertAmber}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
                  {application.barnName}
                </h4>
                <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                  {application.ownerName} • {application.location}
                </p>
              </div>
              <div 
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${brandConfig.colors.alertAmber}15`,
                  color: brandConfig.colors.alertAmber,
                  fontSize: brandConfig.typography.fontSizeXs
                }}
              >
                {application.tier.name} Tier
              </div>
            </div>
            <div className="mb-4">
              <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                Estimated Monthly Revenue: {application.estimatedRevenue}
              </p>
              <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                Submitted: {new Date(application.submissionDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onPartnerAction('approve', application.id)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{
                  backgroundColor: brandConfig.colors.successGreen,
                  color: brandConfig.colors.barnWhite,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {partnershipConfig.buttons.approveApplication}
              </button>
              <button
                onClick={() => onPartnerAction('reject', application.id)}
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{
                  backgroundColor: brandConfig.colors.errorRed,
                  color: brandConfig.colors.barnWhite,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {partnershipConfig.buttons.rejectApplication}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Partnership Program Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 
          className="text-3xl font-bold mb-2"
          style={{
            color: brandConfig.colors.championGold,
            fontFamily: brandConfig.typography.fontDisplay,
            fontSize: brandConfig.typography.fontSize3xl,
            fontWeight: brandConfig.typography.weightBold
          }}
        >
          🤝 {partnershipConfig.overview.title}
        </h1>
        <p 
          style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeLg
          }}
        >
          {partnershipConfig.overview.subtitle}
        </p>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {[
          { key: 'dashboard', label: 'Dashboard', icon: '📊' },
          { key: 'applications', label: 'Applications', icon: '📝' },
          { key: 'management', label: 'Partners', icon: '🤝' },
          { key: 'revenue', label: 'Revenue', icon: '💰' },
          { key: 'veterinary', label: 'Vet Partners', icon: '🏥' }
        ].map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key as any)}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
              activeSection === section.key ? 'shadow-md' : 'hover:shadow-sm'
            }`}
            style={{
              backgroundColor: activeSection === section.key ? brandConfig.colors.championGold : brandConfig.colors.barnWhite,
              color: activeSection === section.key ? brandConfig.colors.barnWhite : brandConfig.colors.midnightBlack,
              border: `2px solid ${activeSection === section.key ? brandConfig.colors.championGold : `${brandConfig.colors.sterlingSilver}33`}`,
              borderRadius: brandConfig.layout.borderRadius,
              fontSize: brandConfig.typography.fontSizeSm
            }}
          >
            <span>{section.icon}</span>
            <span>{section.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Content Area */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeSection === 'dashboard' && renderPartnershipDashboard()}
        {activeSection === 'applications' && renderApplications()}
        {activeSection === 'management' && (
          <div className="text-center p-12" style={{ color: brandConfig.colors.neutralGray }}>
            Partner Management Interface Coming Soon
          </div>
        )}
        {activeSection === 'revenue' && (
          <div className="text-center p-12" style={{ color: brandConfig.colors.neutralGray }}>
            Revenue Analytics Interface Coming Soon
          </div>
        )}
        {activeSection === 'veterinary' && (
          <div className="text-center p-12" style={{ color: brandConfig.colors.neutralGray }}>
            Veterinary Partnership Interface Coming Soon
          </div>
        )}
      </motion.div>
    </div>
  );
}; 