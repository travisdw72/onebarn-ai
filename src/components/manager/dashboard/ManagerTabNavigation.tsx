import React from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import type { IManagerTabNavigationProps, TabId } from '../../../interfaces/ManagerTypes';

export { type TabId } from '../../../interfaces/ManagerTypes';

export const ManagerTabNavigation: React.FC<IManagerTabNavigationProps> = ({
  selectedTab,
  onTabChange,
  availableTabs
}) => {
  const tabConfig = {
    overview: {
      label: 'Overview',
      icon: '📊',
      description: 'Facility overview and key metrics',
      special: false
    },
    operations: {
      label: 'Operations',
      icon: '⚙️',
      description: 'Daily operations management',
      special: false
    },
    partnerships: {
      label: 'Barn Partners',
      icon: '🤝',
      description: 'Partnership program management',
      special: true
    },
    analytics: {
      label: 'Analytics',
      icon: '📈',
      description: 'Performance metrics and insights',
      special: false
    },
    reports: {
      label: 'Reports',
      icon: '📋',
      description: 'Generate and download reports',
      special: false
    },
    demo: {
      label: 'AI Demo',
      icon: '🎬',
      description: 'Live AI photo sequence analysis demonstration',
      special: true
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div 
        className="rounded-2xl p-2 shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderColor: `${brandConfig.colors.sterlingSilver}33`,
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <div className="flex flex-wrap gap-2">
          {availableTabs.map((tabId, index) => {
            const tab = tabConfig[tabId];
            const isSelected = selectedTab === tabId;
            const isSpecial = tab?.special || false;

            return (
              <motion.button
                key={tabId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTabChange(tabId)}
                className={`
                  relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2
                  ${isSelected ? 'shadow-md' : 'hover:shadow-sm'}
                  ${isSpecial && isSelected ? 'ring-2' : ''}
                `}
                style={{
                  backgroundColor: isSelected 
                    ? (isSpecial ? brandConfig.colors.championGold : brandConfig.colors.stableMahogany)
                    : 'transparent',
                  color: isSelected 
                    ? brandConfig.colors.barnWhite 
                    : brandConfig.colors.midnightBlack,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: isSelected 
                    ? brandConfig.typography.weightSemiBold 
                    : brandConfig.typography.weightMedium,
                  ...(isSpecial && isSelected && {
                    ringColor: `${brandConfig.colors.championGold}50`
                  })
                }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {isSpecial && !isSelected && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                    style={{ backgroundColor: brandConfig.colors.championGold }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tab Description */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 text-center"
      >
        <p 
          style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeSm
          }}
        >
          {tabConfig[selectedTab].description}
        </p>
      </motion.div>
    </motion.div>
  );
}; 