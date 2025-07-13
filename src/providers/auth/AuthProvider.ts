import type { AuthProvider } from "@refinedev/core";
import { brandConfig } from "../../config/brandConfig";
import { SecureAuthUtils, authConfig } from "../../config/authConfig";

// User data structure following the established patterns
interface IUserData {
  id: string;
  email: string;
  name: string;
  role: "client" | "employee" | "admin" | "manager" | "trainer" | "db_admin" | "barn_owner_manager" | "it_support" | "partner" | "veterinarian";
  tenantId: string;
  barnId?: string;
  avatar?: string;
  authMode: 'production' | 'demo';
  // Additional fields for comprehensive role tracking
  originalRole?: string;
  roleHierarchy?: string[];
  permissions?: string[];
  departmentId?: string;
  facilityId?: string;
}

interface ILoginCredentials {
  email: string;
  password: string;
  tenantId?: string;
}

// Enhanced authentication service with dual-mode support
class AuthService {
  async login(credentials: ILoginCredentials): Promise<{
    success: boolean;
    user?: IUserData;
    token?: string;
    message?: string;
    authMode?: 'production' | 'demo';
  }> {
    // Add comprehensive logging for authentication attempts
    console.log(`🔐 Authentication Attempt:`, {
      email: credentials.email,
      timestamp: new Date().toISOString(),
      authMode: authConfig.production.enabled ? 'production' : 'demo'
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Use the new dual-mode authentication
      const authResult = await SecureAuthUtils.validateCredentials(
        credentials.email,
        credentials.password
      );

      // Log the raw authentication result from database
      console.log(`🔍 Raw Authentication Result:`, {
        isValid: authResult.isValid,
        authMode: authResult.authMode,
        userRole: authResult.userRole,
        userData: authResult.userData,
        timestamp: new Date().toISOString()
      });

      if (!authResult.isValid) {
        console.warn(`❌ Authentication Failed:`, {
          email: credentials.email,
          reason: 'Invalid credentials',
          timestamp: new Date().toISOString()
        });
        return {
          success: false,
          message: "Invalid credentials",
        };
      }

      // Log the original role from database before mapping
      console.log(`📊 Role Mapping Process:`, {
        originalRole: authResult.userRole,
        email: credentials.email,
        userData: authResult.userData,
        timestamp: new Date().toISOString()
      });

      // Create user data from auth result
      const userData = authResult.userData;
      const mappedRole = this.mapRoleToUserRole(authResult.userRole || 'client', credentials.email);
      
      // Log the role mapping result
      console.log(`🎯 Role Mapping Result:`, {
        originalRole: authResult.userRole,
        mappedRole: mappedRole,
        email: credentials.email,
        timestamp: new Date().toISOString()
      });

      const user: IUserData = {
        id: userData?.id || userData?.user_id || userData?.userBk || `user-${Date.now()}`,
        email: credentials.email,
        name: userData?.name || userData?.full_name || userData?.display_name || credentials.email.split('@')[0],
        role: mappedRole,
        tenantId: authConfig.production.tenantId || userData?.tenant_id || userData?.tenantId || "tenant-001",
        barnId: userData?.barnId || userData?.barn_id || userData?.facility_id || "barn-001",
        authMode: authResult.authMode,
        // Store original role for debugging
        originalRole: authResult.userRole,
        roleHierarchy: userData?.roles || [],
        permissions: userData?.permissions || [],
        departmentId: userData?.department_id || userData?.departmentId,
        facilityId: userData?.facility_id || userData?.facilityId
      };

      // Log the final user object
      console.log(`✅ Final User Object:`, {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        originalRole: user.originalRole,
        tenantId: user.tenantId,
        barnId: user.barnId,
        authMode: user.authMode,
        permissions: user.permissions,
        timestamp: new Date().toISOString()
      });

      // Generate secure token
      const token = SecureAuthUtils.generateSecureToken(user.id);

      // Secure logging
      SecureAuthUtils.secureLog('auth_service_login', {
        email: credentials.email,
        role: user.role,
        originalRole: user.originalRole,
        success: true,
        authMode: authResult.authMode
      });

      return {
        success: true,
        user,
        token,
        authMode: authResult.authMode
      };

    } catch (error) {
      console.error('❌ Authentication Error:', {
        email: credentials.email,
        error: error,
        timestamp: new Date().toISOString()
      });
      return {
        success: false,
        message: "Authentication service unavailable",
      };
    }
  }

  // Demo user mapping for production demonstration
  private getDemoRoleMapping(email: string): "client" | "employee" | "admin" | "manager" | "trainer" | "db_admin" | "barn_owner_manager" | "it_support" | "partner" | "veterinarian" | null {
    // Hardcoded email-to-role mapping for demonstration purposes
    const demoUserMapping: Record<string, "client" | "employee" | "admin" | "manager" | "trainer" | "db_admin" | "barn_owner_manager" | "it_support" | "partner" | "veterinarian"> = {
      // Admin Dashboard - Database Administrator
      'admin@onebarnai.com': 'admin',
      
      // IT Manager Dashboard  
      'travis.woodward@onebarnai.com': 'manager', // Changed to manager for IT Manager dashboard
      
      // IT Support Dashboard
      'michelle.nash@onebarnai.com': 'it_support',
      
      // Partner Dashboard
      'sarah.robertson@onebarnai.com': 'partner',
      
      // Client Dashboard
      'demo@onevault.ai': 'client',
    };
    
    return demoUserMapping[email.toLowerCase()] || null;
  }

  // Enhanced role mapping to support more database roles
  private mapRoleToUserRole(role: string, email: string): "client" | "employee" | "admin" | "manager" | "trainer" | "db_admin" | "barn_owner_manager" | "it_support" | "partner" | "veterinarian" {
    // First check if this is a demo user with hardcoded role
    const demoRole = this.getDemoRoleMapping(email);
    if (demoRole) {
      console.log(`🎯 Demo User Role Override:`, {
        email: email,
        originalDatabaseRole: role,
        overriddenRole: demoRole,
        timestamp: new Date().toISOString()
      });
      return demoRole;
    }

    // Log the incoming role for debugging
    console.log(`🔄 Role Mapping Input:`, {
      incomingRole: role,
      email: email,
      type: typeof role,
      timestamp: new Date().toISOString()
    });

    // Simplified role mapping based on actual database roles
    const roleMap: Record<string, "client" | "employee" | "admin" | "manager" | "trainer" | "db_admin" | "barn_owner_manager" | "it_support" | "partner" | "veterinarian"> = {
      // Database roles from actual API response
      'administrator': 'admin',
      'manager': 'manager',
      'user': 'client',
      
      // Additional mappings for future use
      'admin': 'admin',
      'employee': 'employee',
      'trainer': 'trainer',
      'it_support': 'it_support',
      'partner': 'partner',
      'veterinarian': 'veterinarian',
      'client': 'client'
    };
    
    // Clean and normalize the role
    const cleanRole = role?.toLowerCase()?.trim() || 'client';
    const mappedRole = roleMap[cleanRole] || 'client';
    
    // Log the mapping result
    console.log(`📋 Role Mapping Result:`, {
      email: email,
      originalRole: role,
      cleanRole: cleanRole,
      mappedRole: mappedRole,
      wasFound: roleMap.hasOwnProperty(cleanRole),
      isDemoOverride: false,
      timestamp: new Date().toISOString()
    });
    
    // If role wasn't found in our mapping, log it for investigation
    if (!roleMap.hasOwnProperty(cleanRole)) {
      console.warn(`⚠️ Unknown Role Detected:`, {
        email: email,
        role: role,
        cleanRole: cleanRole,
        mappedTo: mappedRole,
        timestamp: new Date().toISOString(),
        suggestion: 'Consider adding this role to the roleMap'
      });
    }
    
    return mappedRole;
  }

  async validateToken(token: string): Promise<boolean> {
    // Validate token format first
    if (!SecureAuthUtils.validateTokenFormat(token)) {
      return false;
    }
    
    // In production mode, we could validate with the API
    if (authConfig.production.enabled) {
      try {
        const response = await fetch(`${authConfig.production.apiEndpoint}/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': authConfig.production.tenantId,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(authConfig.productionTimeout)
        });
        
        if (response.ok) {
          return true;
        }
      } catch (error) {
        console.warn('Production token validation failed, using local validation');
      }
    }
    
    // Fall back to local token validation
    return token.startsWith("demo-") || token.startsWith("prod-");
  }

  async getUserFromToken(token: string): Promise<IUserData | null> {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.user || null;
      }
    } catch (error) {
      console.error('Error getting user from token:', error);
    }
    return null;
  }
}

const authService = new AuthService();

export const authProvider: AuthProvider = {
  login: async ({ email, password, tenantId }) => {
    try {
      const response = await authService.login({ email, password, tenantId });
      
      if (response.success && response.user && response.token) {
        // Store authentication data following security standards
        const authData = {
          token: response.token,
          user: response.user,
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + brandConfig.security.sessionTimeout * 60 * 1000).toISOString(),
          authMode: response.authMode
        };

        localStorage.setItem("auth", JSON.stringify(authData));
        
        // Enhanced role-based routing - all users go to /dashboard, RoleBasedDashboard handles role-specific content
        const roleRoutes = {
          admin: "dashboard",                          // admin@onebarnai.com → Admin content
          db_admin: "dashboard",
          manager: "dashboard",                        // travis.woodward@onebarnai.com → IT Manager content  
          barn_owner_manager: "dashboard",
          employee: "dashboard",
          trainer: "dashboard",
          it_support: "dashboard",                     // michelle.nash@onebarnai.com → IT Support content
          partner: "dashboard",                        // sarah.robertson@onebarnai.com → Partner content
          veterinarian: "dashboard",
          client: "dashboard",                         // demo@onevault.ai → Client content
        };

        // Log successful authentication with role routing
        console.log(`🎉 Authentication Successful:`, {
          email: response.user.email,
          role: response.user.role,
          originalRole: response.user.originalRole,
          authMode: response.authMode,
          redirectTo: roleRoutes[response.user.role] || "/dashboard",
          timestamp: new Date().toISOString()
        });

        return {
          success: true,
          redirectTo: roleRoutes[response.user.role] || "/dashboard",
        };
      }

      return {
        success: false,
        error: {
          message: response.message || "Login failed",
          name: "Authentication Error",
        },
      };
    } catch (error) {
      console.error(`❌ Login Error:`, {
        error: error,
        timestamp: new Date().toISOString()
      });
      return {
        success: false,
        error: {
          message: "An error occurred during login",
          name: "Network Error",
        },
      };
    }
  },

  logout: async () => {
    // Log logout attempt
    console.log(`🚪 Logout Attempted:`, {
      timestamp: new Date().toISOString()
    });
    
    // Use secure logout method
    SecureAuthUtils.clearAuthData();
    
    console.log(`✅ Logout Successful:`, {
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const authData = localStorage.getItem("auth");
    
    if (!authData) {
      console.log(`🔒 Auth Check Failed: No auth data found`);
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      const { token, expiresAt, user } = JSON.parse(authData);
      
      // Check if token is expired
      if (new Date() > new Date(expiresAt)) {
        console.log(`⏰ Auth Check Failed: Token expired`, {
          expiresAt: expiresAt,
          currentTime: new Date().toISOString(),
          user: user?.email
        });
        localStorage.removeItem("auth");
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
        };
      }

      // Validate token
      const isValid = await authService.validateToken(token);
      
      if (isValid) {
        console.log(`✅ Auth Check Successful:`, {
          email: user?.email,
          role: user?.role,
          originalRole: user?.originalRole,
          timestamp: new Date().toISOString()
        });
        return {
          authenticated: true,
        };
      }
    } catch (error) {
      console.error("❌ Auth Check Error:", {
        error: error,
        timestamp: new Date().toISOString()
      });
    }

    // Clear invalid auth data
    localStorage.removeItem("auth");
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const authData = localStorage.getItem("auth");
    
    if (!authData) {
      return null;
    }

    try {
      const { user } = JSON.parse(authData);
      
      // Enhanced role-based permissions following RBAC standards
      const rolePermissions = {
        admin: ["*"], // All permissions - admin@onebarnai.com
        db_admin: ["*"], // All permissions
        manager: ["system:read", "system:write", "users:read", "users:write", "analytics:read", "reports:read"], // IT Manager - travis.woodward@onebarnai.com
        barn_owner_manager: ["horses:read", "horses:write", "training:read", "training:write", "clients:read", "analytics:read", "staff:read", "finances:read"],
        employee: ["horses:read", "horses:write", "training:read", "training:write", "clients:read"],
        trainer: ["horses:read", "horses:write", "training:read", "training:write", "clients:read", "analytics:read"],
        it_support: ["system:read", "users:read", "support:read", "support:write", "tickets:read", "tickets:write"], // IT Support - michelle.nash@onebarnai.com
        partner: ["horses:read", "training:read", "clients:read", "analytics:read", "revenue:read"], // Partner - sarah.robertson@onebarnai.com
        veterinarian: ["horses:read", "horses:write", "health:read", "health:write", "analytics:read"],
        client: ["horses:read", "training:read", "billing:read"], // Client - demo@onevault.ai
      };

      const permissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
      
      // Log permissions
      console.log(`🔑 User Permissions:`, {
        email: user.email,
        role: user.role,
        originalRole: user.originalRole,
        permissions: permissions,
        timestamp: new Date().toISOString()
      });

      return permissions;
    } catch (error) {
      console.error("❌ Get Permissions Error:", error);
      return null;
    }
  },

  getIdentity: async () => {
    const authData = localStorage.getItem("auth");
    
    if (!authData) {
      return null;
    }

    try {
      const { user, authMode } = JSON.parse(authData);
      
      // Log identity retrieval
      console.log(`👤 Identity Retrieved:`, {
        id: user.id,
        email: user.email,
        role: user.role,
        originalRole: user.originalRole,
        authMode: authMode,
        timestamp: new Date().toISOString()
      });
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        originalRole: user.originalRole,
        tenantId: user.tenantId,
        barnId: user.barnId,
        avatar: user.avatar,
        authMode: authMode,
        permissions: user.permissions,
        departmentId: user.departmentId,
        facilityId: user.facilityId
      };
    } catch (error) {
      console.error("❌ Get Identity Error:", error);
      return null;
    }
  },

  onError: async (error) => {
    console.error(`❌ Auth Provider Error:`, {
      error: error,
      status: error.status,
      timestamp: new Date().toISOString()
    });
    
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error: {
          message: "Session expired. Please login again.",
          name: "Authentication Error",
        },
      };
    }

    return {
      error: {
        message: error.message || "An error occurred",
        name: "Error",
      },
    };
  },
};

// Export auth service for use in components
export { authService };
export type { IUserData, ILoginCredentials }; 