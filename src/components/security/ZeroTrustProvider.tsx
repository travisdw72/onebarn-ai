import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { zeroTrustService } from '../../services/zeroTrustService';
import { aiMonitorConfig } from '../../config/aiMonitorConfig';
import { ISecurityContext, ISecurityEvent } from '../../config/aiMonitorConfig.interface';

interface IZeroTrustContextValue {
  securityContext: ISecurityContext | null;
  riskScore: number;
  trustLevel: 'low' | 'medium' | 'high';
  isSessionValid: boolean;
  lastValidation: Date | null;
  validateSession: () => Promise<boolean>;
  checkPermission: (resource: string, action: string, context?: any) => Promise<boolean>;
  logSecurityEvent: (event: Omit<ISecurityEvent, 'id' | 'timestamp' | 'tenantId'>) => void;
  refreshTrustLevel: () => Promise<void>;
  isDeviceTrusted: boolean;
  isLocationAllowed: boolean;
  securityAlerts: ISecurityEvent[];
  clearSecurityAlert: (alertId: string) => void;
}

const ZeroTrustContext = createContext<IZeroTrustContextValue | undefined>(undefined);

interface IZeroTrustProviderProps {
  children: ReactNode;
  autoValidationInterval?: number;
}

export const ZeroTrustProvider: React.FC<IZeroTrustProviderProps> = ({
  children,
  autoValidationInterval = 30000 // 30 seconds default
}) => {
  const { user, logout } = useAuth();
  const { tenantId } = useTenant();
  
  const [securityContext, setSecurityContext] = useState<ISecurityContext | null>(null);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [trustLevel, setTrustLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [isSessionValid, setIsSessionValid] = useState<boolean>(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);
  const [isDeviceTrusted, setIsDeviceTrusted] = useState<boolean>(false);
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(true);
  const [securityAlerts, setSecurityAlerts] = useState<ISecurityEvent[]>([]);

  // Initialize security context when user and tenant are available
  useEffect(() => {
    if (user && tenantId) {
      initializeSecurityContext();
    }
  }, [user, tenantId]);

  // Set up automatic validation interval
  useEffect(() => {
    if (!aiMonitorConfig.security.enabled || !user) return;

    const interval = setInterval(() => {
      validateSession();
    }, autoValidationInterval);

    return () => clearInterval(interval);
  }, [autoValidationInterval, user]);

  // Initialize security context
  const initializeSecurityContext = useCallback(async () => {
    if (!user || !tenantId) return;

    try {
      const context: ISecurityContext = {
        userId: user.id,
        tenantId: tenantId,
        roles: user.roles || [],
        permissions: user.permissions || [],
        sessionId: user.sessionId || generateSessionId(),
        deviceId: await getDeviceId(),
        location: await getCurrentLocation(),
        riskScore: 0,
        trustLevel: 'low',
        lastValidated: new Date().toISOString(),
        policyVersion: aiMonitorConfig.security.policies.default.version
      };

      setSecurityContext(context);
      await refreshTrustLevel();
      await validateDeviceTrust();
      await validateLocationAccess();
      
    } catch (error) {
      console.error('Failed to initialize security context:', error);
      logSecurityEvent({
        type: 'authentication',
        severity: 'high',
        resource: 'security_context',
        action: 'initialize',
        outcome: 'failure',
        details: { error: error.message },
        risk: 80,
        automated: true,
        acknowledged: false
      });
    }
  }, [user, tenantId]);

  // Validate current session
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!securityContext || !aiMonitorConfig.security.enabled) {
      return false;
    }

    try {
      const validationResult = await zeroTrustService.validateUserSession(
        securityContext.sessionId,
        securityContext.userId,
        tenantId
      );

      if (!validationResult.valid) {
        logSecurityEvent({
          type: 'authentication',
          severity: 'high',
          resource: 'user_session',
          action: 'validate',
          outcome: 'failure',
          details: { reason: validationResult.reason },
          risk: 90,
          automated: true,
          acknowledged: false
        });

        // Force logout on session validation failure
        await logout();
        return false;
      }

      setIsSessionValid(true);
      setLastValidation(new Date());
      
      // Update risk score based on validation result
      if (validationResult.riskScore !== undefined) {
        setRiskScore(validationResult.riskScore);
        updateTrustLevel(validationResult.riskScore);
      }

      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      logSecurityEvent({
        type: 'authentication',
        severity: 'critical',
        resource: 'user_session',
        action: 'validate',
        outcome: 'failure',
        details: { error: error.message },
        risk: 95,
        automated: true,
        acknowledged: false
      });

      setIsSessionValid(false);
      return false;
    }
  }, [securityContext, tenantId, logout]);

  // Check specific permission
  const checkPermission = useCallback(async (
    resource: string, 
    action: string, 
    context?: any
  ): Promise<boolean> => {
    if (!securityContext || !aiMonitorConfig.security.enabled) {
      return false;
    }

    try {
      const hasPermission = await zeroTrustService.checkPermissions(
        securityContext.userId,
        tenantId,
        resource,
        action,
        {
          ...context,
          riskScore,
          trustLevel,
          deviceId: securityContext.deviceId,
          location: securityContext.location
        }
      );

      // Log access attempt
      logSecurityEvent({
        type: 'authorization',
        severity: hasPermission ? 'info' : 'medium',
        resource,
        action,
        outcome: hasPermission ? 'success' : 'blocked',
        details: { 
          riskScore, 
          trustLevel, 
          context: context || {} 
        },
        risk: hasPermission ? 10 : 60,
        automated: true,
        acknowledged: false
      });

      return hasPermission;
    } catch (error) {
      console.error('Permission check failed:', error);
      logSecurityEvent({
        type: 'authorization',
        severity: 'high',
        resource,
        action,
        outcome: 'failure',
        details: { error: error.message },
        risk: 80,
        automated: true,
        acknowledged: false
      });

      return false;
    }
  }, [securityContext, tenantId, riskScore, trustLevel]);

  // Log security event
  const logSecurityEvent = useCallback((
    event: Omit<ISecurityEvent, 'id' | 'timestamp' | 'tenantId'>
  ) => {
    const securityEvent: ISecurityEvent = {
      ...event,
      id: generateEventId(),
      timestamp: new Date().toISOString(),
      tenantId: tenantId || 'unknown'
    };

    // Add to local alerts if severity is medium or higher
    if (['medium', 'high', 'critical'].includes(event.severity)) {
      setSecurityAlerts(prev => [securityEvent, ...prev.slice(0, 99)]); // Keep last 100 alerts
    }

    // Send to security service for logging
    zeroTrustService.logSecurityEvent(securityEvent).catch(error => {
      console.error('Failed to log security event:', error);
    });

    // Auto-escalate critical events
    if (event.severity === 'critical' && aiMonitorConfig.security.incidentResponse.automated) {
      handleCriticalSecurityEvent(securityEvent);
    }
  }, [tenantId]);

  // Handle critical security events
  const handleCriticalSecurityEvent = useCallback(async (event: ISecurityEvent) => {
    try {
      // Force immediate session validation
      const isValid = await validateSession();
      
      if (!isValid || event.risk >= 90) {
        // Terminate session immediately for high-risk events
        await logout();
        return;
      }

      // Apply additional restrictions based on event type
      switch (event.type) {
        case 'anomaly':
          // Increase monitoring frequency
          setRiskScore(prev => Math.min(prev + 20, 100));
          break;
        case 'threat':
          // Restrict access temporarily
          setTrustLevel('low');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to handle critical security event:', error);
    }
  }, [validateSession, logout]);

  // Refresh trust level calculation
  const refreshTrustLevel = useCallback(async () => {
    if (!securityContext) return;

    try {
      const newRiskScore = await zeroTrustService.calculateRiskScore(
        securityContext.userId,
        tenantId,
        {
          deviceId: securityContext.deviceId,
          location: securityContext.location,
          sessionAge: Date.now() - new Date(securityContext.lastValidated).getTime(),
          recentActivity: await getRecentUserActivity()
        }
      );

      setRiskScore(newRiskScore);
      updateTrustLevel(newRiskScore);
    } catch (error) {
      console.error('Failed to refresh trust level:', error);
      // Default to high risk on calculation failure
      setRiskScore(80);
      setTrustLevel('low');
    }
  }, [securityContext, tenantId]);

  // Update trust level based on risk score
  const updateTrustLevel = useCallback((score: number) => {
    const thresholds = aiMonitorConfig.security.riskAssessment.thresholds;
    
    let newTrustLevel: 'low' | 'medium' | 'high' = 'low';
    
    for (const threshold of thresholds) {
      if (score <= threshold.score) {
        switch (threshold.level) {
          case 'low':
            newTrustLevel = 'high';
            break;
          case 'medium':
            newTrustLevel = 'medium';
            break;
          case 'high':
          case 'critical':
            newTrustLevel = 'low';
            break;
        }
        break;
      }
    }

    setTrustLevel(newTrustLevel);
  }, []);

  // Validate device trust
  const validateDeviceTrust = useCallback(async () => {
    if (!securityContext || !aiMonitorConfig.security.deviceTrust.enabled) {
      setIsDeviceTrusted(true);
      return;
    }

    try {
      const deviceTrust = await zeroTrustService.assessDeviceTrust(
        securityContext.deviceId,
        securityContext.userId
      );

      setIsDeviceTrusted(deviceTrust.trusted);

      if (!deviceTrust.trusted) {
        logSecurityEvent({
          type: 'threat',
          severity: 'medium',
          resource: 'device_trust',
          action: 'assess',
          outcome: 'blocked',
          details: { 
            deviceId: securityContext.deviceId,
            reason: deviceTrust.reason
          },
          risk: 60,
          automated: true,
          acknowledged: false
        });
      }
    } catch (error) {
      console.error('Device trust validation failed:', error);
      setIsDeviceTrusted(false);
    }
  }, [securityContext]);

  // Validate location access
  const validateLocationAccess = useCallback(async () => {
    if (!securityContext?.location || !aiMonitorConfig.security.locationSecurity.enabled) {
      setIsLocationAllowed(true);
      return;
    }

    try {
      const locationAllowed = await zeroTrustService.validateLocation(
        securityContext.location,
        securityContext.userId,
        tenantId
      );

      setIsLocationAllowed(locationAllowed.allowed);

      if (!locationAllowed.allowed) {
        logSecurityEvent({
          type: 'authorization',
          severity: 'medium',
          resource: 'location_access',
          action: 'validate',
          outcome: 'blocked',
          details: { 
            location: securityContext.location,
            reason: locationAllowed.reason
          },
          risk: 50,
          automated: true,
          acknowledged: false
        });
      }
    } catch (error) {
      console.error('Location validation failed:', error);
      setIsLocationAllowed(false);
    }
  }, [securityContext, tenantId]);

  // Clear security alert
  const clearSecurityAlert = useCallback((alertId: string) => {
    setSecurityAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Helper functions
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateEventId = (): string => {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getDeviceId = async (): Promise<string> => {
    // Generate or retrieve device fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    
    const fingerprint = canvas.toDataURL();
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + 
      screen.height + 
      new Date().getTimezoneOffset() +
      fingerprint.slice(-50)
    ).slice(0, 32);
  };

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number; accuracy: number } | undefined> => {
    if (!navigator.geolocation || !aiMonitorConfig.security.locationSecurity.enabled) {
      return undefined;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        () => {
          resolve(undefined);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  };

  const getRecentUserActivity = async (): Promise<any> => {
    // Implementation would fetch recent user activity metrics
    return {
      clickCount: 0,
      keystrokes: 0,
      mouseMovements: 0,
      idleTime: 0
    };
  };

  // Monitor for suspicious activity patterns
  useEffect(() => {
    if (!aiMonitorConfig.security.monitoring.realtime.behaviorAnalysis) return;

    const handleUserActivity = (event: Event) => {
      // Simple anomaly detection for rapid-fire actions
      const now = Date.now();
      const recentEvents = JSON.parse(localStorage.getItem('recent_events') || '[]');
      
      recentEvents.push({ type: event.type, timestamp: now });
      
      // Keep only events from last 60 seconds
      const filteredEvents = recentEvents.filter((e: any) => now - e.timestamp < 60000);
      
      localStorage.setItem('recent_events', JSON.stringify(filteredEvents));
      
      // Alert if too many events in short time period (potential bot activity)
      if (filteredEvents.length > 100) {
        logSecurityEvent({
          type: 'anomaly',
          severity: 'medium',
          resource: 'user_behavior',
          action: 'activity_pattern',
          outcome: 'blocked',
          details: { 
            eventCount: filteredEvents.length,
            timeWindow: '60s',
            suspiciousActivity: true
          },
          risk: 70,
          automated: true,
          acknowledged: false
        });
      }
    };

    // Monitor various user interactions
    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach(eventType => {
      document.addEventListener(eventType, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleUserActivity);
      });
    };
  }, [logSecurityEvent]);

  const contextValue: IZeroTrustContextValue = {
    securityContext,
    riskScore,
    trustLevel,
    isSessionValid,
    lastValidation,
    validateSession,
    checkPermission,
    logSecurityEvent,
    refreshTrustLevel,
    isDeviceTrusted,
    isLocationAllowed,
    securityAlerts,
    clearSecurityAlert
  };

  return (
    <ZeroTrustContext.Provider value={contextValue}>
      {children}
    </ZeroTrustContext.Provider>
  );
};

export const useZeroTrust = (): IZeroTrustContextValue => {
  const context = useContext(ZeroTrustContext);
  if (context === undefined) {
    throw new Error('useZeroTrust must be used within a ZeroTrustProvider');
  }
  return context;
}; 