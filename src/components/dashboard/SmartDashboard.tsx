import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminDashboardModern } from '../../pages/admin/AdminDashboardModern';
import { EmployeeDashboardModern } from '../../pages/employee/EmployeeDashboardModern';
import { ClientDashboardModern } from '../../pages/client/ClientDashboardModern';
import { ManagerDashboardModern } from '../../pages/manager/ManagerDashboardModern';
import { VeterinarianDashboard } from '../../pages/veterinarian/VeterinarianDashboard';
import { SupportDashboard } from '../../pages/support/SupportDashboard';
import { brandConfig } from '../../config/brandConfig';

interface ISmartDashboardProps {
  /**
   * Override the role-based dashboard selection (for testing/debugging)
   */
  forceRole?: string;
}

/**
 * Smart Dashboard Component
 * 
 * This component provides a consistent /dashboard URL for all users while
 * displaying role-specific content based on the authenticated user's role.
 * 
 * Benefits:
 * - Consistent user experience (/dashboard for everyone)
 * - Role-based content without revealing roles in URL
 * - Security through obscurity (roles not visible in URL)
 * - Professional web app standards
 */
export const SmartDashboard: React.FC<ISmartDashboardProps> = ({ forceRole }) => {
  const { user } = useAuth();
  
  // Determine which dashboard to show based on user role
  const getUserRole = (): string => {
    if (forceRole) {
      return forceRole;
    }
    
    if (!user?.role) {
      return 'employee'; // Default fallback
    }
    
    return user.role.toLowerCase();
  };

  const userRole = getUserRole();

  // Function to normalize One Vault database roles to dashboard roles
  const normalizeOneVaultRole = (role: string): string => {
    // Handle One Vault database role patterns
    const roleLower = role.toLowerCase();
    
    // Handle ADMIN role patterns (ADMIN_ROLE_{tenant}_{timestamp})
    if (roleLower.includes('admin') || roleLower === 'administrator') {
      return 'db_admin';
    }
    
    // Handle USER role patterns  
    if (roleLower.includes('user') || roleLower === 'end_user') {
      return 'end_users';
    }
    
    // Handle IT roles
    if (roleLower.includes('it_manager') || roleLower === 'it_manager') {
      return 'it_manager';
    }
    
    if (roleLower.includes('it_support') || roleLower === 'it_support') {
      return 'it_support';
    }
    
    // Handle partner roles
    if (roleLower.includes('partner') || roleLower === 'partners') {
      return 'partners';
    }
    
    // Return original role if no mapping found
    return roleLower;
  };

  // Render appropriate dashboard based on role
  const renderDashboard = () => {
    // Normalize role to handle One Vault database role patterns
    const normalizedRole = normalizeOneVaultRole(userRole);
    
    switch (normalizedRole) {
      case 'db_admin':
        return <AdminDashboardModern />;
      
      case 'it_manager':
        return <ManagerDashboardModern />;
      
      case 'it_support':
        return <SupportDashboard />;
      
      case 'partners':
        return <ManagerDashboardModern />;
      
      case 'end_users':
        return <ClientDashboardModern />;
      
      // Legacy role support for backward compatibility
      case 'admin':
      case 'administrator':
      case 'system_admin':
        return <AdminDashboardModern />;
      
      case 'manager':
      case 'barn_owner_manager':
      case 'facility_manager':
        return <ManagerDashboardModern />;
      
      case 'client':
      case 'horse_owner':
        return <ClientDashboardModern />;
      
      case 'veterinarian':
      case 'vet':
        return <VeterinarianDashboard />;
      
      case 'support':
        return <SupportDashboard />;
      
      case 'employee':
      case 'trainer':
      case 'staff':
      default:
        return <EmployeeDashboardModern />;
    }
  };

  // Show loading state if user data is still being fetched
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        color: brandConfig.colors.sterlingSilver,
        fontSize: brandConfig.typography.fontSizeLg
      }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: brandConfig.colors.surface,
    }}>
      {/* Development indicator - remove in production */}
      {brandConfig.application.environment === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: brandConfig.colors.midnightBlack,
          color: brandConfig.colors.arenaSand,
          padding: '0.5rem 1rem',
          borderRadius: brandConfig.layout.borderRadius,
          fontSize: brandConfig.typography.fontSizeXs,
          fontFamily: brandConfig.typography.fontMono,
          zIndex: 1000,
          boxShadow: brandConfig.layout.boxShadow,
          maxWidth: '200px',
        }}>
          <div>Auth Role: {userRole}</div>
          <div>Normalized: {normalizeOneVaultRole(userRole)}</div>
          <div>URL: /dashboard</div>
        </div>
      )}
      
      {renderDashboard()}
    </div>
  );
}; 