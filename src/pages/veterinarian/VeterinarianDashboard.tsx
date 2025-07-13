import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * VeterinarianDashboard Component
 * 
 * This component uses the unified RoleDashboard with RBAC permissions
 * and displays veterinarian-specific modules including AI health alerts,
 * diagnostic support, and emergency protocols.
 */
export const VeterinarianDashboard: React.FC = () => {
  return <RoleDashboard userRole="veterinarian" />;
}; 