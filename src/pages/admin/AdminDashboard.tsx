import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * AdminDashboard Component
 * 
 * Updated to use the unified RoleDashboard with RBAC permissions
 * configured for administrators. This provides consistent styling,
 * logout functionality, support tab, and comprehensive admin features.
 * 
 * Features:
 * - Platform KPIs and health monitoring
 * - Real-time system performance metrics
 * - Client facility management
 * - AI model performance analytics
 * - Support ticket management
 * - Development pipeline tracking
 * - Revenue and growth analytics
 * - RBAC-based access control
 * - Consistent styling with other dashboards
 * - Logout button and support tab
 */
export const AdminDashboard: React.FC = () => {
  return <RoleDashboard userRole="admin" />;
}; 