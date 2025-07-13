/**
 * Authentication Connection Tester
 * Utility to test production database connectivity and authentication
 * 
 * @description Helper functions to validate production setup and fallback behavior
 * @author One Barn Development Team
 * @since v1.0.0
 */

import { authConfig, SecureAuthUtils } from '../config/authConfig';

// ============================================================================
// CONNECTION TEST RESULTS
// ============================================================================

export interface IConnectionTestResult {
  mode: 'production' | 'demo' | 'hybrid';
  productionAvailable: boolean;
  demoFallbackEnabled: boolean;
  apiEndpoint: string;
  tenantId: string;
  platformApiKey: boolean; // Don't expose the key, just indicate if present
  testResults: {
    apiReachable: boolean;
    authenticationWorking: boolean;
    tokenValidationWorking: boolean;
    error?: string;
  };
  recommendations: string[];
}

// ============================================================================
// CONNECTION TESTER CLASS
// ============================================================================

export class AuthConnectionTester {
  
  // Test overall authentication setup
  static async testAuthenticationSetup(): Promise<IConnectionTestResult> {
    const result: IConnectionTestResult = {
      mode: this.determineMode(),
      productionAvailable: authConfig.production.enabled,
      demoFallbackEnabled: authConfig.enableDemoFallback,
      apiEndpoint: authConfig.production.apiEndpoint,
      tenantId: authConfig.production.tenantId,
      platformApiKey: !!authConfig.production.platformApiKey,
      testResults: {
        apiReachable: false,
        authenticationWorking: false,
        tokenValidationWorking: false
      },
      recommendations: []
    };

    // Test production API if enabled
    if (authConfig.production.enabled) {
      await this.testProductionAPI(result);
    }

    // Generate recommendations
    this.generateRecommendations(result);

    return result;
  }

  // Determine current authentication mode
  private static determineMode(): 'production' | 'demo' | 'hybrid' {
    if (authConfig.production.enabled && authConfig.enableDemoFallback) {
      return 'hybrid';
    } else if (authConfig.production.enabled) {
      return 'production';
    } else {
      return 'demo';
    }
  }

  // Test production API connectivity
  private static async testProductionAPI(result: IConnectionTestResult): Promise<void> {
    try {
      // Test API reachability
      const healthResponse = await fetch(`${authConfig.production.apiEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authConfig.production.platformApiKey}`,
          'X-Tenant-ID': authConfig.production.tenantId
        },
        signal: AbortSignal.timeout(authConfig.productionTimeout)
      });

      result.testResults.apiReachable = healthResponse.ok;

      // Test authentication with production API
      if (result.testResults.apiReachable) {
        // Authentication testing requires valid credentials to be provided
        // Cannot test authentication without credentials configured via environment variables
        result.testResults.authenticationWorking = false;
      }

      // Test token validation
      if (result.testResults.authenticationWorking) {
        const testToken = SecureAuthUtils.generateSecureToken('test-user');
        
        const tokenResponse = await fetch(`${authConfig.production.apiEndpoint}/validate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${testToken}`,
            'X-Tenant-ID': authConfig.production.tenantId,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(authConfig.productionTimeout)
        });
        
        result.testResults.tokenValidationWorking = tokenResponse.ok;
      }

    } catch (error) {
      result.testResults.error = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  // Generate recommendations based on test results
  private static generateRecommendations(result: IConnectionTestResult): void {
    const recs = result.recommendations;

    // Environment setup recommendations
    if (!result.platformApiKey) {
      recs.push('❌ Set VITE_PLATFORM_API_KEY in your .env file');
    }

    if (!result.tenantId) {
      recs.push('❌ Set VITE_TENANT_ID in your .env file');
    }

    if (!result.apiEndpoint || result.apiEndpoint === '/api/auth') {
      recs.push('❌ Set VITE_AUTH_API_URL to your actual production URL');
    }

    // Production API recommendations
    if (result.productionAvailable) {
      if (!result.testResults.apiReachable) {
        recs.push('🔧 Production API is not reachable - check your URL and network connection');
      } else if (!result.testResults.authenticationWorking) {
        recs.push('🔧 Production authentication is failing - verify credentials and API endpoints');
      } else if (!result.testResults.tokenValidationWorking) {
        recs.push('🔧 Token validation is failing - check API authentication flow');
      } else {
        recs.push('✅ Production authentication is working perfectly!');
      }
    }

    // Demo fallback recommendations
    if (result.demoFallbackEnabled) {
      recs.push('✅ Demo fallback is enabled - authentication will work even if production fails');
    } else if (result.productionAvailable && !result.testResults.authenticationWorking) {
      recs.push('⚠️ Consider enabling demo fallback (VITE_ENABLE_DEMO_FALLBACK=true) for development');
    }

    // Mode-specific recommendations
    if (result.mode === 'demo') {
      recs.push('🔧 Running in demo mode - set VITE_PRODUCTION_MODE=true to enable production authentication');
    } else if (result.mode === 'hybrid') {
      recs.push('🎯 Running in hybrid mode - perfect for development and testing');
    } else if (result.mode === 'production') {
      recs.push('🚀 Running in production mode - ensure all tests pass before going live');
    }
  }

  // Quick connection test for a specific user
  static async testUserLogin(email: string, password: string): Promise<{
    success: boolean;
    authMode: 'production' | 'demo';
    userData?: any;
    error?: string;
  }> {
    try {
      const result = await SecureAuthUtils.validateCredentials(email, password);
      
      return {
        success: result.isValid,
        authMode: result.authMode,
        userData: result.userData,
        error: result.isValid ? undefined : 'Invalid credentials'
      };
    } catch (error) {
      return {
        success: false,
        authMode: 'demo',
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  // Get current configuration summary
  static getConfigurationSummary(): {
    mode: string;
    productionEnabled: boolean;
    demoFallbackEnabled: boolean;
    apiEndpoint: string;
    tenantId: string;
    hasApiKey: boolean;
    availableUsers: number;
  } {
    return {
      mode: this.determineMode(),
      productionEnabled: authConfig.production.enabled,
      demoFallbackEnabled: authConfig.enableDemoFallback,
      apiEndpoint: authConfig.production.apiEndpoint,
      tenantId: authConfig.production.tenantId,
      hasApiKey: !!authConfig.production.platformApiKey,
      availableUsers: 0 // Credentials removed for security
    };
  }

  // Console helper for debugging
  static async debugAuthenticationSetup(): Promise<void> {
    console.log('🔐 One Barn Authentication Setup Debug');
    console.log('=====================================');
    
    const config = this.getConfigurationSummary();
    console.log('Configuration:', config);
    
    const testResult = await this.testAuthenticationSetup();
    console.log('\n📊 Connection Test Results:', testResult);
    
    console.log('\n📋 Recommendations:');
    testResult.recommendations.forEach(rec => console.log(rec));
  }
  
  // Quick API connectivity test
  static async quickAPITest(): Promise<void> {
    console.log('🔧 Testing API connectivity...');
    
    const apiUrl = `${authConfig.production.apiEndpoint}/api/v1/auth/login`;
    const timeoutMs = authConfig.productionTimeout;
    
    try {
      const startTime = Date.now();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authConfig.production.platformApiKey}`,
          'X-Tenant-ID': authConfig.production.tenantId
        },
        body: JSON.stringify({ username: 'test@example.com', password: 'test' }),
        signal: AbortSignal.timeout(timeoutMs)
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('✅ API Response received in', duration + 'ms');
      console.log('Status:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('🎉 API is reachable and responding correctly!');
      } else {
        console.log('⚠️ API is reachable but returned an error. This might be expected for test credentials.');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TimeoutError') {
          console.log('❌ API call timed out after', timeoutMs + 'ms');
          console.log('💡 Try increasing VITE_PRODUCTION_TIMEOUT in your .env file');
        } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.log('❌ Network error - API not reachable');
          console.log('💡 Check your VITE_AUTH_API_URL and network connection');
        } else {
          console.log('❌ API test failed:', error.message);
        }
      } else {
        console.log('❌ Unknown error:', error);
      }
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

// Quick test function for console use
export const testAuth = () => AuthConnectionTester.debugAuthenticationSetup();

// Test API connectivity
export const testAPI = () => AuthConnectionTester.quickAPITest();

// Test specific user
export const testUser = (email: string, password: string) => 
  AuthConnectionTester.testUserLogin(email, password);

// Get current config
export const getAuthConfig = () => AuthConnectionTester.getConfigurationSummary(); 