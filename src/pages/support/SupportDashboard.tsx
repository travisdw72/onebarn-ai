import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * SupportDashboard Component
 * 
 * This component uses the unified RoleDashboard with RBAC permissions
 * and displays enhanced support staff modules including AI user support,
 * system status monitoring, and user training management.
 */
export const SupportDashboard: React.FC = () => {
  return <RoleDashboard userRole="support" />;
}; 