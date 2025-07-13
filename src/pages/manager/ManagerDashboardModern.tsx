import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * ManagerDashboardModern Component
 * 
 * Updated to use the unified RoleDashboard with RBAC permissions
 * configured for facility managers. This provides consistent styling,
 * logout functionality, support tab, and all modern features.
 * 
 * Features:
 * - Logout button in header
 * - Support tab with manager-specific facility support
 * - Consistent brand styling
 * - Role-based permissions and modules
 * - Mobile responsive design
 */
export const ManagerDashboardModern: React.FC = () => {
  return <RoleDashboard userRole="manager" />;
}; 