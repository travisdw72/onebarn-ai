import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * AdminDashboardModern Component
 * 
 * Updated to use the unified RoleDashboard with RBAC permissions
 * configured for administrators. This provides consistent styling,
 * logout functionality, support tab, and all modern features while
 * maintaining the comprehensive admin capabilities.
 * 
 * Features:
 * - Logout button in header
 * - Comprehensive Support management tab
 * - Consistent brand styling (no more black background)
 * - Role-based permissions and modules
 * - Mobile responsive design
 * - All admin oversight capabilities
 */
export const AdminDashboardModern: React.FC = () => {
  return <RoleDashboard userRole="admin" />;
}; 