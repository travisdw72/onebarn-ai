import React from 'react';
import { Activity, CheckSquare, Calendar, Grid3X3 } from 'lucide-react';
import { brandConfig } from '../../../config/brandConfig';

export type TabId = 'overview' | 'tasks' | 'schedule' | 'modules';

interface IEmployeeTabNavigationProps {
  selectedTab: TabId;
  onTabChange: (tab: TabId) => void;
  availableTabs: TabId[];
}

export const EmployeeTabNavigation: React.FC<IEmployeeTabNavigationProps> = ({
  selectedTab,
  onTabChange,
  availableTabs
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'modules', label: 'Modules', icon: Grid3X3 }
  ] as const;

  const visibleTabs = tabs.filter(tab => 
    availableTabs.includes(tab.id as TabId)
  );

  return (
    <div 
      className="flex space-x-1 rounded-2xl p-2 mb-8 shadow-lg border"
      style={{
        backgroundColor: brandConfig.colors.barnWhite,
        borderColor: `${brandConfig.colors.sterlingSilver}33`,
        borderRadius: brandConfig.layout.borderRadius,
        padding: brandConfig.spacing.sm
      }}
    >
      {visibleTabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id as TabId)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all ${
            selectedTab === id
              ? 'shadow-lg'
              : 'hover:opacity-75'
          }`}
          style={{
            backgroundColor: selectedTab === id 
              ? brandConfig.colors.stableMahogany 
              : 'transparent',
            color: selectedTab === id 
              ? brandConfig.colors.arenaSand 
              : brandConfig.colors.stableMahogany,
            fontSize: brandConfig.typography.fontSizeBase,
            fontWeight: brandConfig.typography.weightSemiBold,
            borderRadius: brandConfig.layout.borderRadius,
            padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`
          }}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}; 