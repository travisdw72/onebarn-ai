import { apiClient } from '../utils/apiClient';
import { ISecurityEvent } from '../config/aiMonitorConfig.interface';

interface IValidationResult {
  valid: boolean;
  reason?: string;
  riskScore?: number;
  expiresAt?: string;
}

interface IPermissionResult {
  allowed: boolean;
  reason?: string;
  conditions?: string[];
}

interface IDeviceTrustResult {
  trusted: boolean;
  reason?: string;
  complianceScore?: number;
  recommendations?: string[];
}

interface ILocationResult {
  allowed: boolean;
  reason?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  restrictions?: string[];
}

interface IRiskScoreContext {
  deviceId: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  sessionAge: number;
  recentActivity: any;
}

class ZeroTrustService {
  private baseUrl = import.meta.env.VITE_API_URL || 'https://api.onebarn.com';

  /**
   * Validate user session with comprehensive security checks
   */
  async validateUserSession(
    sessionId: string,
    userId: string,
    tenantId: string
  ): Promise<IValidationResult> {
    try {
      const response = await apiClient.post('/api/v1/security/validate-session', {
        sessionId,
        userId,
        timestamp: new Date().toISOString(),
        clientFingerprint: await this.generateClientFingerprint()
      }, {
        headers: {
          'X-Tenant-ID': tenantId,
          'X-Session-ID': sessionId
        }
      });

      return {
        valid: response.data.valid,
        reason: response.data.reason,
        riskScore: response.data.riskScore,
        expiresAt: response.data.expiresAt
      };
    } catch (error) {
      console.error('Session validation failed:', error);
      return {
        valid: false,
        reason: 'Session validation service unavailable'
      };
    }
  }

  /**
   * Check user permissions with context-aware authorization
   */
  async checkPermissions(
    userId: string,
    tenantId: string,
    resource: string,
    action: string,
    context: any = {}
  ): Promise<boolean> {
    try {
      const response = await apiClient.post('/api/v1/security/check-permissions', {
        userId,
        resource,
        action,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return response.data.allowed === true;
    } catch (error) {
      console.error('Permission check failed:', error);
      // Fail secure - deny access on error
      return false;
    }
  }

  /**
   * Assess device trust level based on multiple factors
   */
  async assessDeviceTrust(deviceId: string, userId: string): Promise<IDeviceTrustResult> {
    try {
      const deviceInfo = await this.collectDeviceInfo();
      
      const response = await apiClient.post('/api/v1/security/assess-device-trust', {
        deviceId,
        userId,
        deviceInfo,
        timestamp: new Date().toISOString()
      });

      return {
        trusted: response.data.trusted,
        reason: response.data.reason,
        complianceScore: response.data.complianceScore,
        recommendations: response.data.recommendations || []
      };
    } catch (error) {
      console.error('Device trust assessment failed:', error);
      return {
        trusted: false,
        reason: 'Device trust assessment unavailable'
      };
    }
  }

  /**
   * Validate location access based on geofencing and risk zones
   */
  async validateLocation(
    location: { latitude: number; longitude: number; accuracy: number },
    userId: string,
    tenantId: string
  ): Promise<ILocationResult> {
    try {
      const response = await apiClient.post('/api/v1/security/validate-location', {
        location,
        userId,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return {
        allowed: response.data.allowed,
        reason: response.data.reason,
        riskLevel: response.data.riskLevel,
        restrictions: response.data.restrictions || []
      };
    } catch (error) {
      console.error('Location validation failed:', error);
      return {
        allowed: false,
        reason: 'Location validation service unavailable'
      };
    }
  }

  /**
   * Calculate real-time risk score based on multiple factors
   */
  async calculateRiskScore(
    userId: string,
    tenantId: string,
    context: IRiskScoreContext
  ): Promise<number> {
    try {
      const response = await apiClient.post('/api/v1/security/calculate-risk', {
        userId,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          browserInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
          }
        }
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return Math.max(0, Math.min(100, response.data.riskScore || 0));
    } catch (error) {
      console.error('Risk score calculation failed:', error);
      // Default to medium risk on calculation failure
      return 50;
    }
  }

  /**
   * Log security events for monitoring and compliance
   */
  async logSecurityEvent(event: ISecurityEvent): Promise<void> {
    try {
      await apiClient.post('/api/v1/security/log-event', {
        ...event,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          }
        }
      }, {
        headers: {
          'X-Tenant-ID': event.tenantId
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Store locally as fallback
      this.storeEventLocally(event);
    }
  }

  /**
   * Detect behavioral anomalies in user activity
   */
  async detectAnomalies(
    userId: string,
    tenantId: string,
    activityData: any
  ): Promise<{ anomalies: any[]; riskIncrease: number }> {
    try {
      const response = await apiClient.post('/api/v1/security/detect-anomalies', {
        userId,
        activityData,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return {
        anomalies: response.data.anomalies || [],
        riskIncrease: response.data.riskIncrease || 0
      };
    } catch (error) {
      console.error('Anomaly detection failed:', error);
      return {
        anomalies: [],
        riskIncrease: 0
      };
    }
  }

  /**
   * Enforce security policy in real-time
   */
  async enforcePolicy(
    policyId: string,
    userId: string,
    tenantId: string,
    context: any
  ): Promise<{ action: string; reason: string; restrictions: any[] }> {
    try {
      const response = await apiClient.post('/api/v1/security/enforce-policy', {
        policyId,
        userId,
        context,
        timestamp: new Date().toISOString()
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return {
        action: response.data.action || 'allow',
        reason: response.data.reason || '',
        restrictions: response.data.restrictions || []
      };
    } catch (error) {
      console.error('Policy enforcement failed:', error);
      return {
        action: 'deny',
        reason: 'Policy enforcement service unavailable',
        restrictions: []
      };
    }
  }

  /**
   * Generate client device fingerprint for identification
   */
  private async generateClientFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0
    ];

    // Create canvas fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('ZeroTrust fingerprint 🐎', 2, 2);
      components.push(canvas.toDataURL());
    }

    // Create WebGL fingerprint
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const webglContext = gl as WebGLRenderingContext;
        const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          components.push(webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
          components.push(webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        }
      }
    } catch (e) {
      // WebGL not available
    }

    const fingerprint = components.join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Collect comprehensive device information
   */
  private async collectDeviceInfo(): Promise<any> {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
      },
      timezone: {
        offset: new Date().getTimezoneOffset(),
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      indexedDB: typeof indexedDB !== 'undefined',
      webGL: this.checkWebGLSupport(),
      canvas: this.checkCanvasSupport(),
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    // Check for development tools (basic detection)
    deviceInfo['devToolsOpen'] = this.detectDevTools();

    return deviceInfo;
  }

  /**
   * Check WebGL support
   */
  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Check Canvas support
   */
  private checkCanvasSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Detect if developer tools are open (basic detection)
   */
  private detectDevTools(): boolean {
    const threshold = 160;
    
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      return true;
    }

    // Check for console.clear override
    if (typeof console.clear === 'function') {
      const originalClear = console.clear;
      let devToolsOpen = false;
      
      console.clear = function() {
        devToolsOpen = true;
        originalClear.apply(console, arguments);
      };
      
      console.clear();
      console.clear = originalClear;
      
      return devToolsOpen;
    }

    return false;
  }

  /**
   * Store security event locally as fallback
   */
  private storeEventLocally(event: ISecurityEvent): void {
    try {
      const localEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
      localEvents.push({
        ...event,
        storedLocally: true,
        localTimestamp: new Date().toISOString()
      });

      // Keep only last 100 events
      if (localEvents.length > 100) {
        localEvents.splice(0, localEvents.length - 100);
      }

      localStorage.setItem('security_events', JSON.stringify(localEvents));
    } catch (error) {
      console.error('Failed to store security event locally:', error);
    }
  }

  /**
   * Retrieve and send locally stored events
   */
  async syncLocalEvents(): Promise<void> {
    try {
      const localEvents = JSON.parse(localStorage.getItem('security_events') || '[]');
      
      if (localEvents.length === 0) return;

      const response = await apiClient.post('/api/v1/security/sync-events', {
        events: localEvents
      });

      if (response.data.success) {
        localStorage.removeItem('security_events');
      }
    } catch (error) {
      console.error('Failed to sync local events:', error);
    }
  }

  /**
   * Get security policy for specific resource and context
   */
  async getSecurityPolicy(
    resource: string,
    tenantId: string,
    context: any = {}
  ): Promise<any> {
    try {
      const response = await apiClient.get('/api/v1/security/policy', {
        params: {
          resource,
          context: JSON.stringify(context)
        },
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return response.data.policy || {};
    } catch (error) {
      console.error('Failed to get security policy:', error);
      return {};
    }
  }

  /**
   * Report security incident
   */
  async reportIncident(
    incidentType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    tenantId: string,
    context: any = {}
  ): Promise<{ incidentId: string; acknowledged: boolean }> {
    try {
      const response = await apiClient.post('/api/v1/security/report-incident', {
        type: incidentType,
        severity,
        description,
        context,
        timestamp: new Date().toISOString(),
        reportedBy: 'ai_monitor_frontend'
      }, {
        headers: {
          'X-Tenant-ID': tenantId
        }
      });

      return {
        incidentId: response.data.incidentId,
        acknowledged: response.data.acknowledged
      };
    } catch (error) {
      console.error('Failed to report security incident:', error);
      return {
        incidentId: `local_${Date.now()}`,
        acknowledged: false
      };
    }
  }
}

// Export singleton instance
export const zeroTrustService = new ZeroTrustService();
export default zeroTrustService; 