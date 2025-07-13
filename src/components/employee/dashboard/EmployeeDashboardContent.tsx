import React from 'react';
import { EmployeeOverviewContent } from './EmployeeOverviewContent';
import { EmployeeTasksContent } from './EmployeeTasksContent';
import { EmployeeScheduleContent } from './EmployeeScheduleContent';
import { EmployeeModulesContent } from './EmployeeModulesContent';
import type { TabId } from './EmployeeTabNavigation';
import type { IRoleDashboardData } from '../../../interfaces/EmployeeTypes';

interface IEmployeeDashboardContentProps {
  selectedTab: TabId;
  roleData: IRoleDashboardData;
  userRole: string;
}

export const EmployeeDashboardContent: React.FC<IEmployeeDashboardContentProps> = ({
  selectedTab,
  roleData,
  userRole
}) => {
  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <EmployeeOverviewContent 
            roleData={roleData}
            userRole={userRole}
          />
        );
      case 'tasks':
        return (
          <EmployeeTasksContent 
            tasks={roleData.tasks || []}
            userRole={userRole}
          />
        );
      case 'schedule':
        return (
          <EmployeeScheduleContent 
            schedule={roleData.schedule || []}
            userRole={userRole}
          />
        );
      case 'modules':
        return (
          <EmployeeModulesContent 
            modules={roleData.modules}
            userRole={userRole}
          />
        );
      default:
        return (
          <EmployeeOverviewContent 
            roleData={roleData}
            userRole={userRole}
          />
        );
    }
  };

  return (
    <div className="employee-dashboard-content">
      {renderContent()}
    </div>
  );
}; 