import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerPartnershipsContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerBarnPartnershipContent: React.FC<IManagerPartnershipsContentProps> = ({
  partnershipData,
  onPartnerAction
}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);

  const barnManagerData = {
    barnName: "Sunset Ridge Equestrian Center",
    monthlyClients: 18,
    averageMonthlyRevenue: "$12,500",
    potentialPartnershipRevenue: "$3,200",
    clientSatisfactionScore: 4.7,
    competitorBarnPartners: 5,
    localMarketShare: "23%",
    potentialNewClients: 8
  };

  return (
    <div className="space-y-6">
      <div 
        className="p-6 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: isEnrolled ? brandConfig.colors.successGreen + '10' : brandConfig.colors.alertAmber + '10',
          borderColor: isEnrolled ? brandConfig.colors.successGreen + '33' : brandConfig.colors.alertAmber + '33',
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <h3 
          className="text-xl font-bold"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeXl,
            fontWeight: brandConfig.typography.weightBold
          }}
        >
          🏆 One Barn Partnership Program - Barn Manager View
        </h3>
        <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
          {isEnrolled ? "✅ Active Partnership Member" : "💡 Partnership Opportunity Available"}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {barnManagerData.monthlyClients}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Current Clients
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.championGold,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {barnManagerData.averageMonthlyRevenue}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Monthly Revenue
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.successGreen,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {barnManagerData.potentialPartnershipRevenue}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Potential Monthly Increase
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.ribbonBlue,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {barnManagerData.clientSatisfactionScore}★
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Client Satisfaction
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsEnrolled(true);
              onPartnerAction('enroll', 'demo');
            }}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-300"
            style={{
              backgroundColor: brandConfig.colors.championGold,
              color: brandConfig.colors.barnWhite,
              fontSize: brandConfig.typography.fontSizeBase,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            {isEnrolled ? '✅ Partnership Active' : '🚀 Join Partnership Program'}
          </button>
        </div>
      </div>

      <div 
        className="p-6 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderColor: `${brandConfig.colors.championGold}33`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <h4 
          className="text-lg font-semibold mb-4"
          style={{
            color: brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeLg,
            fontWeight: brandConfig.typography.weightSemiBold
          }}
        >
          💰 Partnership ROI Calculator
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${brandConfig.colors.arenaSand}50` }}>
            <h5 style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
              Current State
            </h5>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • {barnManagerData.monthlyClients} active clients
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • {barnManagerData.averageMonthlyRevenue} monthly revenue
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • Manual horse monitoring
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${brandConfig.colors.championGold}20` }}>
            <h5 style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
              With Partnership
            </h5>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • Premium AI monitoring services
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • Higher client retention (+25%)
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              • {barnManagerData.potentialNewClients} new clients attracted
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${brandConfig.colors.successGreen}20` }}>
            <h5 style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
              ROI Projection
            </h5>
            <p style={{ color: brandConfig.colors.successGreen, fontWeight: brandConfig.typography.weightSemiBold }}>
              +{barnManagerData.potentialPartnershipRevenue} per month
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              3-month payback period
            </p>
            <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              240% annual ROI
            </p>
          </div>
        </div>
      </div>

      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: `${brandConfig.colors.alertAmber}20` }}
      >
        <p style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
          💡 This view shows what a barn manager would see - focused on their ROI, client growth, and revenue opportunities!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.stableMahogany}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h4 
            className="text-lg font-semibold mb-4"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            📈 Growth Opportunities
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                Potential New Clients
              </span>
              <span style={{ color: brandConfig.colors.successGreen, fontWeight: brandConfig.typography.weightSemiBold }}>
                +{barnManagerData.potentialNewClients}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                Current Market Share
              </span>
              <span style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
                {barnManagerData.localMarketShare}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
                Partner Barns in Area
              </span>
              <span style={{ color: brandConfig.colors.alertAmber, fontWeight: brandConfig.typography.weightSemiBold }}>
                {barnManagerData.competitorBarnPartners} competitors
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            borderColor: `${brandConfig.colors.championGold}33`,
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h4 
            className="text-lg font-semibold mb-4"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            🎯 Next Steps
          </h4>
          <div className="space-y-3">
            <button
              onClick={() => onPartnerAction('schedule-demo', 'demo')}
              className="w-full px-4 py-2 rounded-lg text-left transition-all duration-300"
              style={{
                backgroundColor: `${brandConfig.colors.ribbonBlue}20`,
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeSm,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              📅 Schedule Partnership Demo
            </button>
            <button
              onClick={() => onPartnerAction('download-roi-report', 'demo')}
              className="w-full px-4 py-2 rounded-lg text-left transition-all duration-300"
              style={{
                backgroundColor: `${brandConfig.colors.arenaSand}50`,
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeSm,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              📊 Download ROI Report
            </button>
            <button
              onClick={() => onPartnerAction('contact-representative', 'demo')}
              className="w-full px-4 py-2 rounded-lg text-left transition-all duration-300"
              style={{
                backgroundColor: `${brandConfig.colors.successGreen}20`,
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeSm,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              💬 Contact Partnership Rep
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 