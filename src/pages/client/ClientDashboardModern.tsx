import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * ClientDashboardModern Component
 * 
 * Updated to use the unified RoleDashboard with RBAC permissions
 * configured for horse owners. This provides consistent styling,
 * logout functionality, support tab, and all the modern features
 * while maintaining the clean look the user prefers.
 * 
 * Features:
 * - Logout button in header
 * - Support tab with client-specific help
 * - Consistent brand styling
 * - Role-based permissions and modules
 * - Mobile responsive design
 */
export const ClientDashboardModern: React.FC = () => {
  return <RoleDashboard userRole="client" />;
}; 