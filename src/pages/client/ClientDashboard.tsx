import React from 'react';
import { RoleDashboard } from '../../components/dashboard/RoleDashboard';

/**
 * ClientDashboard Component
 * 
 * This component uses the unified RoleDashboard with RBAC permissions
 * configured for horse owners. All content, styling, and configuration 
 * comes from config files following the single source of truth architecture.
 * 
 * Client-specific features:
 * - View their horses only (filtered by ownership)
 * - Live camera access for their horses
 * - Health reports and updates
 * - Billing and payment management
 * - Limited analytics focused on their horses
 */
export const ClientDashboard: React.FC = () => {
  return <RoleDashboard userRole="client" />;
}; 