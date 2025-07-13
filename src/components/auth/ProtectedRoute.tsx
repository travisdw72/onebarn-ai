// Protected Route Component
// Ensures user is authenticated before accessing protected pages

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Login } from '../../pages/auth/Login';
import { Box, CircularProgress, Typography } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';
import { ROLE_PERMISSIONS, getRoleHierarchy, isHigherRole } from '../../config/permissions.config';

interface IProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Helper function to check if user role has access based on role hierarchy and inheritance
const hasRoleAccess = (userRole: string, requiredRoles: string[]): boolean => {
  if (requiredRoles.length === 0) return true;
  
  // Direct role match
  if (requiredRoles.includes(userRole)) return true;
  
  // Check role inheritance
  const userRoleConfig = ROLE_PERMISSIONS[userRole];
  if (userRoleConfig?.inheritsFrom) {
    for (const inheritedRole of userRoleConfig.inheritsFrom) {
      if (requiredRoles.includes(inheritedRole)) return true;
    }
  }
  
  // Check role hierarchy (higher level roles can access lower level requirements)
  const hierarchy = getRoleHierarchy();
  const userLevel = hierarchy[userRole] || 0;
  
  for (const requiredRole of requiredRoles) {
    const requiredLevel = hierarchy[requiredRole] || 0;
    if (userLevel >= requiredLevel) return true;
  }
  
  return false;
};

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: brandConfig.colors.arenaSand,
          gap: 2
        }}
      >
        <CircularProgress 
          size={60}
          sx={{ color: brandConfig.colors.stableMahogany }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontPrimary
          }}
        >
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  // If user is not authenticated, show login page
  if (!user || !user.isAuthenticated) {
    return <Login />;
  }

  // If specific roles are required, check user role with inheritance and hierarchy
  if (requiredRoles.length > 0 && !hasRoleAccess(user.role, requiredRoles)) {
    const userRoleConfig = ROLE_PERMISSIONS[user.role];
    const inheritedRoles = userRoleConfig?.inheritsFrom || [];
    
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: brandConfig.colors.arenaSand,
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: brandConfig.colors.errorRed,
            fontFamily: brandConfig.typography.fontDisplay,
            marginBottom: '1rem'
          }}
        >
          Access Denied
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            fontFamily: brandConfig.typography.fontPrimary,
            marginBottom: '2rem'
          }}
        >
          You don't have permission to access this page.
          <br />
          Required roles: {requiredRoles.join(', ')}
          <br />
          Your role: {user.role}
          {inheritedRoles.length > 0 && (
            <>
              <br />
              Inherited roles: {inheritedRoles.join(', ')}
            </>
          )}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: brandConfig.colors.sterlingSilver,
            fontFamily: brandConfig.typography.fontPrimary
          }}
        >
          Please contact your administrator if you believe this is an error.
        </Typography>
      </Box>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}; 