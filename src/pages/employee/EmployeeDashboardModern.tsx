import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * EmployeeDashboardModern Component
 * 
 * Updated to use the unified RoleDashboard with RBAC permissions
 * configured for employees. This provides consistent styling,
 * logout functionality, support tab, and all modern features.
 * 
 * Features:
 * - Logout button in header
 * - Support tab with employee-specific technical support
 * - Consistent brand styling
 * - Role-based permissions and modules
 * - Mobile responsive design
 */
export const EmployeeDashboardModern: React.FC = () => {
  return <RoleDashboard userRole="employee" />;
}; 