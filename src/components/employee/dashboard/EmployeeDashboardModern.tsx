import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EmployeeDashboardHeader } from './EmployeeDashboardHeader';
import { EmployeeQuickStatsGrid } from './EmployeeQuickStatsGrid';
import { EmployeeTabNavigation, type TabId } from './EmployeeTabNavigation';
import { EmployeeDashboardContent } from './EmployeeDashboardContent';
import { employeeDashboardData, employeeRoles } from '../../../config/employeeDashboardData';
import { brandConfig } from '../../../config/brandConfig';

interface IEmployeeDashboardModernProps {
  userRole?: string; // Optional override for testing
}

export const EmployeeDashboardModern: React.FC<IEmployeeDashboardModernProps> = ({
  userRole: propUserRole
}) => {
  const [selectedTab, setSelectedTab] = useState<TabId>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>(propUserRole || 'trainer');

  // Auto refresh interval setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Refresh data here when needed
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleEmergencyAlert = () => {
    alert('Emergency alert activated! Emergency services have been notified.');
  };

  const handleStatClick = (statId: string) => {
    // Navigate to appropriate tab based on stat clicked
    switch (statId) {
      case 'sessions-today':
      case 'appointments-today':
        setSelectedTab('schedule');
        break;
      case 'active-horses':
      case 'patients-today':
        setSelectedTab('modules');
        break;
      case 'tasks-pending':
        setSelectedTab('tasks');
        break;
      default:
        setSelectedTab('overview');
        break;
    }
  };

  const handleTabChange = (tab: TabId) => {
    setSelectedTab(tab);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    setSelectedTab('overview'); // Reset to overview when changing roles
  };

  // Get role-specific data from config
  const roleData = employeeDashboardData[selectedRole];
  const roleConfig = employeeRoles.find(role => role.id === selectedRole);

  if (!roleData || !roleConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div 
          className="text-center p-8 rounded-2xl"
          style={{
            backgroundColor: brandConfig.colors.barnWhite,
            color: brandConfig.colors.midnightBlack
          }}
        >
          <h2 className="text-xl font-semibold mb-2">Role Not Found</h2>
          <p>The selected role "{selectedRole}" is not configured.</p>
        </div>
      </div>
    );
  }

  // Determine available tabs based on role
  const getAvailableTabs = (): TabId[] => {
    const baseTabs: TabId[] = ['overview', 'modules'];
    if (roleData.tasks && roleData.tasks.length > 0) {
      baseTabs.push('tasks');
    }
    if (roleData.schedule && roleData.schedule.length > 0) {
      baseTabs.push('schedule');
    }
    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="employee-dashboard min-h-screen" style={{ backgroundColor: brandConfig.colors.arenaSand }}>
      
      <EmployeeDashboardHeader 
        userRole={selectedRole}
        userName={roleConfig.user.name}
        roleConfig={roleConfig}
        onEmergencyAlert={handleEmergencyAlert}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={handleAutoRefreshToggle}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Role Selector for Testing */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div 
            className="rounded-2xl p-4 shadow-lg border"
            style={{
              backgroundColor: brandConfig.colors.barnWhite,
              borderColor: `${brandConfig.colors.sterlingSilver}33`,
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <div className="flex items-center justify-between">
              <h3 
                className="font-semibold"
                style={{
                  color: brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSizeLg,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                Role Selector (Testing)
              </h3>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: brandConfig.colors.barnWhite,
                  borderColor: `${brandConfig.colors.sterlingSilver}66`,
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {employeeRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <EmployeeQuickStatsGrid 
          roleData={roleData}
          onStatClick={handleStatClick} 
        />
        
        <EmployeeTabNavigation 
          selectedTab={selectedTab} 
          onTabChange={handleTabChange}
          availableTabs={availableTabs}
        />
        
        <EmployeeDashboardContent 
          selectedTab={selectedTab}
          roleData={roleData}
          userRole={selectedRole}
        />
      </div>
    </div>
  );
}; 