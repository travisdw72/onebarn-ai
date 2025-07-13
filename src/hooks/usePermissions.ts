import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';

// Import the existing permissions configuration
import { ROLE_PERMISSIONS } from '../config/permissions.config';

interface PermissionsHook {
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  permissions: string[];
  isLoading: boolean;
  userRole: string | null;
}

export const usePermissions = (): PermissionsHook => {
  const { user } = useAuth();
  const { tenantId } = useTenant();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.role) {
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    const userRole = user.role;
    const roleDefinition = ROLE_PERMISSIONS[userRole];

    if (roleDefinition && roleDefinition.permissions) {
      // Extract all permissions from the role configuration
      const allPermissions = roleDefinition.permissions.flatMap(permission => 
        permission.actions.map(action => `${permission.resource}:${action}`)
      );
      
      setPermissions(allPermissions);
    } else {
      setPermissions([]);
    }

    setIsLoading(false);
  }, [user, tenantId]);

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    return permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  return {
    hasPermission,
    hasRole,
    permissions,
    isLoading,
    userRole: user?.role || null,
  };
}; 