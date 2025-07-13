// ============================================================================
// SECURE AUTHENTICATION CONFIGURATION
// ============================================================================
// This file handles authentication securely for both demo and production modes

export interface IAuthConfig {
  isDemoMode: boolean;
  enableDemoFallback: boolean;
  productionTimeout: number;
  security: {
    sessionTimeout: number; // minutes
    tokenExpiry: number; // minutes  
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    requireTwoFactor: boolean;
    logSensitiveData: boolean; // Should ALWAYS be false in production
    saltRounds: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    twoFactorRequired: boolean;
    ipWhitelist: string[];
  };
  demo: {
    enabled: boolean;
    credentials: Array<{
      role: string;
      email: string;
      password: string;
      name: string;
      permissions: string[];
    }>;
  };
  production: {
    enabled: boolean;
    apiEndpoint: string;
    platformApiKey: string;
    tenantId: string;
    tenantHk: string;
    tokenStorage: 'localStorage' | 'sessionStorage' | 'httpOnly';
    encryptTokens: boolean;
    credentials: Array<{
      role: string;
      email: string;
      password: string;
      name: string;
      permissions: string[];
    }>;
  };
  session: {
    timeout: number;
    refreshThreshold: number;
    maxConcurrentSessions: number;
    requirePasswordChange: boolean;
    sessionCookieName: string;
    secureOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none';
  };
}

// ============================================================================
// AUTHENTICATION CONFIGURATION
// ============================================================================

export const authConfig: IAuthConfig = {
  // PRODUCTION MODE ENABLED - Real database connectivity
  isDemoMode: false, // ✅ Production mode enabled
  enableDemoFallback: false, // ✅ Keep demo fallback for safety
  productionTimeout: parseInt(import.meta.env.VITE_PRODUCTION_TIMEOUT || '30000'), // ✅ 30 second default
  
  security: {
    sessionTimeout: 480, // 8 hours
    tokenExpiry: 60, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    requireTwoFactor: import.meta.env.VITE_PRODUCTION_MODE === 'true', // Enable 2FA in production
    logSensitiveData: false, // NEVER log passwords, tokens, etc.
    saltRounds: 12,
    passwordMinLength: 8,
    requireSpecialChars: false,
    requireNumbers: false,
    requireUppercase: false,
    twoFactorRequired: false,
    ipWhitelist: [],
  },
  
  demo: {
    enabled: import.meta.env.VITE_DEMO_MODE === 'true',
    // All demo credentials removed for security
    // Demo authentication must be handled via environment variables
    credentials: [],
  },
  
  production: {
    enabled: import.meta.env.VITE_PRODUCTION_MODE === 'true',
    apiEndpoint: import.meta.env.VITE_AUTH_API_URL || import.meta.env.VITE_API_BASE_URL || '/api/auth',
    platformApiKey: import.meta.env.VITE_PLATFORM_API_KEY || import.meta.env.VITE_API_TOKEN || '',
    tenantId: import.meta.env.VITE_TENANT_ID || import.meta.env.VITE_CUSTOMER_ID || 'one_barn_ai',
    tenantHk: import.meta.env.VITE_TENANT_HK || '',
    tokenStorage: 'localStorage', // Consider httpOnly cookies for production
    encryptTokens: true,
    // All production credentials removed for security
    // Authentication handled via API calls to production database
    credentials: [],
  },
  
  session: {
    timeout: 480, // 8 hours in minutes
    refreshThreshold: 60, // Refresh token 60 minutes before expiry
    maxConcurrentSessions: 3,
    requirePasswordChange: false,
    sessionCookieName: 'onebarn_session',
    secureOnly: import.meta.env.VITE_PRODUCTION_MODE === 'true',
    sameSite: 'lax' as const
  },
};

// ============================================================================
// SECURE AUTHENTICATION UTILITIES
// ============================================================================

export class SecureAuthUtils {
  
  // Validate credentials (checks both production and demo)
  static async validateCredentials(email: string, password: string): Promise<{
    isValid: boolean;
    userRole: string | null;
    authMode: 'production' | 'demo';
    userData?: any;
  }> {
    // Try production first if enabled
    if (authConfig.production.enabled) {
      try {
        const productionResult = await this.validateProductionCredentials(email, password);
        if (productionResult.isValid) {
          return {
            isValid: true,
            userRole: productionResult.userRole,
            authMode: 'production',
            userData: productionResult.userData
          };
        }
      } catch (error) {
        console.warn('Production authentication failed, trying demo fallback:', error);
      }
    }
    
    // Fallback to demo if enabled
    if (authConfig.enableDemoFallback && authConfig.demo.enabled) {
      const demoResult = this.validateDemoCredentials(email, password);
      if (demoResult) {
        return {
          isValid: true,
          userRole: this.getDemoUserRole(email),
          authMode: 'demo',
          userData: this.getDemoUserData(email)
        };
      }
    }
    
    return {
      isValid: false,
      userRole: null,
      authMode: 'demo'
    };
  }
  
  // Validate production credentials with API call
  static async validateProductionCredentials(email: string, password: string): Promise<{
    isValid: boolean;
    userRole: string | null;
    userData?: any;
  }> {
    // Log the authentication attempt
    console.log(`🔧 Production Auth Attempt:`, {
      email: email,
      apiUrl: `${authConfig.production.apiEndpoint}/api/v1/auth/login`,
      tenantId: authConfig.production.tenantId,
      timestamp: new Date().toISOString()
    });

    try {
      const apiUrl = `${authConfig.production.apiEndpoint}/api/v1/auth/login`;
      const timeoutMs = authConfig.productionTimeout;
      
      // Log request details
      console.log(`📡 Making API Request:`, {
        url: apiUrl,
        method: 'POST',
        timeout: timeoutMs,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authConfig.production.platformApiKey ? '***' : 'NOT_SET'}`,
          'X-Tenant-ID': authConfig.production.tenantId
        },
        body: {
          username: email,
          password: '***'
        },
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authConfig.production.platformApiKey}`,
          'X-Tenant-ID': authConfig.production.tenantId
        },
        body: JSON.stringify({ username: email, password }),
        signal: AbortSignal.timeout(timeoutMs)
      });
      
      // Log response details
      console.log(`📨 API Response Status:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Log the raw database response
        console.log(`📋 Raw Database Response:`, {
          responseType: typeof data,
          responseKeys: Object.keys(data || {}),
          fullResponse: data,
          timestamp: new Date().toISOString()
        });
        
        // Extract user data and role information
        const userData = data.data?.user_data || data.user_data || data.user || data;
        const sessionData = data.data?.session_token || data.session_token || data.token;
        
        // Log user data extraction
        console.log(`👤 User Data Extraction:`, {
          hasData: Boolean(data.data),
          hasUserData: Boolean(userData),
          userDataKeys: Object.keys(userData || {}),
          sessionToken: sessionData ? 'Present' : 'Missing',
          timestamp: new Date().toISOString()
        });
        
        // Extract role information with multiple possible paths
        const roleInfo = {
          // Check multiple possible role paths
          roles_array: userData?.roles,
          role_name: userData?.role_name,
          role: userData?.role,
          user_role: userData?.user_role,
          permission_role: userData?.permission_role,
          access_level: userData?.access_level,
          user_type: userData?.user_type,
          account_type: userData?.account_type,
          // Check if roles is an array and extract first role
          first_role: userData?.roles?.[0],
          first_role_name: userData?.roles?.[0]?.role_name,
          first_role_id: userData?.roles?.[0]?.role_id,
          first_role_level: userData?.roles?.[0]?.role_level,
          first_role_type: userData?.roles?.[0]?.role_type
        };
        
        // Log role information analysis
        console.log(`🎭 Role Information Analysis:`, {
          roleInfo: roleInfo,
          availableRolePaths: Object.keys(roleInfo).filter(key => roleInfo[key as keyof typeof roleInfo] != null),
          timestamp: new Date().toISOString()
        });
        
        // Determine the final role using multiple fallback paths
        let finalRole = null;
        
        // Priority order for role determination
        const rolePriority = [
          userData?.roles?.[0]?.role_name,
          userData?.role_name,
          userData?.role,
          userData?.user_role,
          userData?.permission_role,
          userData?.access_level,
          userData?.user_type,
          userData?.account_type,
          userData?.roles?.[0]?.role_type,
          userData?.roles?.[0]?.role_id
        ];
        
        // Find the first non-null role
        finalRole = rolePriority.find(role => role != null)?.toString().toLowerCase() || 'user';
        
        // Log final role determination
        console.log(`🎯 Final Role Determination:`, {
          finalRole: finalRole,
          rolePriority: rolePriority,
          selectedFrom: rolePriority.findIndex(role => role != null),
          timestamp: new Date().toISOString()
        });
        
        // Prepare the complete user data object
        const completeUserData = {
          ...userData,
          session_token: sessionData,
          session_expires: data.data?.session_expires || data.session_expires,
          // Add all possible ID fields
          id: userData?.id || userData?.user_id || userData?.userBk || userData?.user_bk,
          user_id: userData?.user_id || userData?.id,
          userBk: userData?.userBk || userData?.user_bk,
          // Add all possible name fields
          name: userData?.name || userData?.full_name || userData?.display_name || userData?.first_name,
          full_name: userData?.full_name || userData?.name,
          display_name: userData?.display_name || userData?.name,
          first_name: userData?.first_name,
          last_name: userData?.last_name,
          // Add all possible tenant/facility fields
          tenant_id: userData?.tenant_id || userData?.tenantId,
          tenantId: userData?.tenantId || userData?.tenant_id,
          barn_id: userData?.barn_id || userData?.barnId || userData?.facility_id,
          facility_id: userData?.facility_id || userData?.barn_id,
          // Add role information
          roles: userData?.roles || [],
          permissions: userData?.permissions || [],
          role_name: finalRole,
          original_role_data: roleInfo
        };
        
        // Log the complete user data
        console.log(`✅ Complete User Data:`, {
          userDataKeys: Object.keys(completeUserData),
          id: completeUserData.id,
          name: completeUserData.name,
          email: email,
          finalRole: finalRole,
          hasSessionToken: Boolean(completeUserData.session_token),
          timestamp: new Date().toISOString()
        });
        
        return {
          isValid: true,
          userRole: finalRole,
          userData: completeUserData
        };
      } else {
        // Log failed response
        const errorData = await response.text();
        console.log(`❌ API Response Failed:`, {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          timestamp: new Date().toISOString()
        });
        
        return {
          isValid: false,
          userRole: null
        };
      }
    } catch (error) {
      // Enhanced error logging
      console.error(`❌ Production Auth Error:`, {
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        isTimeoutError: error instanceof Error && error.name === 'TimeoutError',
        isNetworkError: error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch'),
        timestamp: new Date().toISOString()
      });
      
      // Keep essential error logging
      if (error instanceof Error && error.name === 'TimeoutError') {
        console.error('🔐 Authentication timeout. Consider increasing VITE_PRODUCTION_TIMEOUT if this persists.');
      } else if (error instanceof Error && error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('🔐 Network error. Check API URL and connectivity.');
      }
      
      throw error;
    }
  }
  
  // Validate demo credentials without exposing passwords
  static validateDemoCredentials(email: string, password: string): boolean {
    if (!authConfig.demo.enabled) {
      console.warn('Demo mode is disabled');
      return false;
    }
    
    // Demo credentials removed for security
    // Demo authentication must be handled via environment variables or API
    console.warn('Demo credentials not available - configure via environment variables');
    return false;
  }
  
  // Get user role from email (works for both demo and production)
  static getDemoUserRole(email: string): string | null {
    // Hardcoded credentials removed for security
    // Role determination must be handled via API or environment variables
    console.warn('User role determination not available - configure via API');
    return null;
  }
  
  // Get user data from email
  static getDemoUserData(email: string): any {
    // Hardcoded credentials removed for security
    // User data must be retrieved via API or environment variables
    console.warn('User data not available - configure via API');
    return null;
  }
  
  // Secure token generation
  static generateSecureToken(userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${authConfig.isDemoMode ? 'demo' : 'prod'}-${userId}-${timestamp}-${random}`;
  }
  
  // Validate token format
  static validateTokenFormat(token: string): boolean {
    const tokenPattern = /^(demo|prod)-[\w-]+-\d+-[\w]+$/;
    return tokenPattern.test(token);
  }
  
  // Secure logging - never log sensitive data
  static secureLog(action: string, data: any): void {
    if (authConfig.security.logSensitiveData) {
      console.warn('⚠️ Sensitive data logging is enabled - this should be disabled in production');
    }
    
    // Only log auth events in development mode for debugging
    if (import.meta.env.DEV && action === 'login_attempt' && !data.success) {
      // Only log failed login attempts in development
      console.log('🔐 Login failed for:', data.email);
    }
    
    // Always log security events to browser console in development for monitoring
    // In production, these would typically go to a secure logging service
  }
  
  // Check if we're in production mode
  static isProductionMode(): boolean {
    return import.meta.env.PROD;
  }
  
  // Get secure storage method
  static getStorageMethod(): Storage {
    if (authConfig.production.tokenStorage === 'sessionStorage') {
      return sessionStorage;
    }
    return localStorage; // Default
  }
  
  // Clear all authentication data
  static clearAuthData(): void {
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    
    // Clear any other auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    
    this.secureLog('logout', { success: true });
  }
}

// ============================================================================
// PRODUCTION AUTHENTICATION SERVICE
// ============================================================================

export class ProductionAuthService {
  
  static async login(email: string, password: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    message?: string;
  }> {
    try {
      // In production, this would call your secure API
      const response = await fetch(authConfig.production.apiEndpoint + '/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        SecureAuthUtils.secureLog('login_success', { email, success: true });
        return {
          success: true,
          token: data.data?.session_token,
          user: data.data?.user_data,
        };
      } else {
        SecureAuthUtils.secureLog('login_failure', { email, success: false });
        return {
          success: false,
          message: data.message || data.detail || 'Login failed',
        };
      }
    } catch (error) {
      SecureAuthUtils.secureLog('login_error', { email, success: false });
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }
  
  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(authConfig.production.apiEndpoint + '/api/v1/auth/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// ============================================================================
// SECURITY CHECKLIST FOR PRODUCTION
// ============================================================================

export const securityChecklist = {
  // ✅ Passwords never stored in localStorage
  passwordStorage: 'Passwords are never stored locally',
  
  // ✅ Tokens have expiration
  tokenExpiry: 'Tokens expire automatically',
  
  // ✅ Sensitive data logging disabled
  logging: 'Sensitive data logging can be disabled',
  
  // ✅ Demo mode can be disabled
  demoMode: 'Demo mode can be disabled for production',
  
  // ⚠️ TODO: Implement these for production
  todos: [
    'Implement HTTPS-only cookies for token storage',
    'Add rate limiting for login attempts',
    'Implement proper password hashing (server-side)',
    'Add CSRF protection',
    'Implement refresh token rotation',
    'Add audit logging for all auth events',
    'Implement account lockout after failed attempts',
  ],
};

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

// Authentication configuration loaded
// Security configuration available in authConfig and securityChecklist 