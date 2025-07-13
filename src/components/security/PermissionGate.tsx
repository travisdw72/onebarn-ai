import React, { useEffect, useState, ReactNode } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';
import { useZeroTrust } from './ZeroTrustProvider';
import { brandConfig } from '../../config/brandConfig';
import { aiMonitorConfig } from '../../config/aiMonitorConfig';

interface IPermissionGateProps {
  children: ReactNode;
  resource: string;
  action: string;
  context?: Record<string, any>;
  fallback?: ReactNode;
  showLoader?: boolean;
  logAccess?: boolean;
  requiredTrustLevel?: 'low' | 'medium' | 'high';
  maxRiskScore?: number;
  requireDeviceTrust?: boolean;
  requireLocationAccess?: boolean;
  showDeniedReason?: boolean;
  onAccessGranted?: () => void;
  onAccessDenied?: (reason: string) => void;
}

export const PermissionGate: React.FC<IPermissionGateProps> = ({
  children,
  resource,
  action,
  context = {},
  fallback,
  showLoader = true,
  logAccess = true,
  requiredTrustLevel = 'low',
  maxRiskScore = 100,
  requireDeviceTrust = false,
  requireLocationAccess = false,
  showDeniedReason = true,
  onAccessGranted,
  onAccessDenied
}) => {
  const {
    checkPermission,
    logSecurityEvent,
    trustLevel,
    riskScore,
    isDeviceTrusted,
    isLocationAllowed,
    isSessionValid
  } = useZeroTrust();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deniedReason, setDeniedReason] = useState<string>('');

  useEffect(() => {
    validateAccess();
  }, [resource, action, context, trustLevel, riskScore, isDeviceTrusted, isLocationAllowed]);

  const validateAccess = async () => {
    if (!aiMonitorConfig.security.enabled) {
      setHasPermission(true);
      setIsLoading(false);
      onAccessGranted?.();
      return;
    }

    setIsLoading(true);
    setDeniedReason('');

    try {
      // Check session validity first
      if (!isSessionValid) {
        setHasPermission(false);
        setDeniedReason('Session invalid or expired');
        logAccessAttempt(false, 'Session invalid');
        onAccessDenied?.('Session invalid or expired');
        setIsLoading(false);
        return;
      }

      // Check trust level requirement
      if (!meetsTrustLevelRequirement()) {
        setHasPermission(false);
        const reason = `Insufficient trust level: ${trustLevel} (required: ${requiredTrustLevel})`;
        setDeniedReason(reason);
        logAccessAttempt(false, reason);
        onAccessDenied?.(reason);
        setIsLoading(false);
        return;
      }

      // Check risk score requirement
      if (riskScore > maxRiskScore) {
        setHasPermission(false);
        const reason = `Risk score too high: ${riskScore} (max: ${maxRiskScore})`;
        setDeniedReason(reason);
        logAccessAttempt(false, reason);
        onAccessDenied?.(reason);
        setIsLoading(false);
        return;
      }

      // Check device trust requirement
      if (requireDeviceTrust && !isDeviceTrusted) {
        setHasPermission(false);
        const reason = 'Device not trusted';
        setDeniedReason(reason);
        logAccessAttempt(false, reason);
        onAccessDenied?.(reason);
        setIsLoading(false);
        return;
      }

      // Check location access requirement
      if (requireLocationAccess && !isLocationAllowed) {
        setHasPermission(false);
        const reason = 'Location not allowed';
        setDeniedReason(reason);
        logAccessAttempt(false, reason);
        onAccessDenied?.(reason);
        setIsLoading(false);
        return;
      }

      // Check core permission
      const hasAccess = await checkPermission(resource, action, context);
      
      setHasPermission(hasAccess);
      
      if (logAccess) {
        logAccessAttempt(hasAccess, hasAccess ? 'Access granted' : 'Permission denied');
      }

      if (hasAccess) {
        onAccessGranted?.();
      } else {
        const reason = 'Insufficient permissions';
        setDeniedReason(reason);
        onAccessDenied?.(reason);
      }

    } catch (error) {
      console.error('Permission validation failed:', error);
      setHasPermission(false);
      const reason = 'Permission validation error';
      setDeniedReason(reason);
      logAccessAttempt(false, `Validation error: ${error.message}`);
      onAccessDenied?.(reason);
    } finally {
      setIsLoading(false);
    }
  };

  const meetsTrustLevelRequirement = (): boolean => {
    const trustLevelOrder = { low: 0, medium: 1, high: 2 };
    return trustLevelOrder[trustLevel] >= trustLevelOrder[requiredTrustLevel];
  };

  const logAccessAttempt = (granted: boolean, reason: string) => {
    if (!logAccess) return;

    logSecurityEvent({
      type: 'access',
      severity: granted ? 'info' : 'medium',
      resource,
      action,
      outcome: granted ? 'success' : 'blocked',
      details: {
        reason,
        context,
        trustLevel,
        riskScore,
        deviceTrusted: isDeviceTrusted,
        locationAllowed: isLocationAllowed,
        requiredTrustLevel,
        maxRiskScore,
        requireDeviceTrust,
        requireLocationAccess
      },
      risk: granted ? 5 : 40,
      automated: true,
      acknowledged: false
    });
  };

  // Loading state
  if (isLoading && showLoader) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '48px',
          padding: brandConfig.spacing.md
        }}
      >
        <CircularProgress 
          size={24} 
          sx={{ 
            color: brandConfig.colors.stableMahogany,
            marginRight: brandConfig.spacing.sm
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: brandConfig.colors.midnightBlack,
            fontFamily: brandConfig.typography.fontPrimary
          }}
        >
          Validating access...
        </Typography>
      </Box>
    );
  }

  // Access granted - render children
  if (hasPermission === true) {
    return <>{children}</>;
  }

  // Access denied - render fallback or default denied message
  if (hasPermission === false) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box
        sx={{
          padding: brandConfig.spacing.md,
          borderRadius: brandConfig.layout.borderRadius,
          border: `1px solid ${brandConfig.colors.alertAmber}`,
          backgroundColor: `${brandConfig.colors.alertAmber}15`
        }}
      >
        <Alert 
          severity="warning" 
          sx={{
            backgroundColor: 'transparent',
            color: brandConfig.colors.midnightBlack,
            '& .MuiAlert-icon': {
              color: brandConfig.colors.alertAmber
            }
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: brandConfig.typography.weightSemiBold,
              marginBottom: brandConfig.spacing.xs
            }}
          >
            Access Restricted
          </Typography>
          
          {showDeniedReason && deniedReason && (
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.stableMahogany
              }}
            >
              {deniedReason}
            </Typography>
          )}
          
          {!showDeniedReason && (
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.stableMahogany
              }}
            >
              You do not have sufficient permissions to access this feature.
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  // Still loading without loader shown
  return null;
};

// Higher-order component version for easier usage
export const withPermissionGate = <P extends object>(
  Component: React.ComponentType<P>,
  gatePropsByRouteSelector
: (props: P) => Omit<IPermissionGateProps, 'children'>
) => {
  return (props: P) => {
    const gateProps = gatePropsByRouteSelector(props);
    
    return (
      <PermissionGate {...gateProps}>
        <Component {...props} />
      </PermissionGate>
    );
  };
};

// Specialized permission gates for common use cases
export const AdminOnlyGate: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate
    resource="admin"
    action="access"
    requiredTrustLevel="medium"
    maxRiskScore={50}
    requireDeviceTrust={true}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const VeterinarianGate: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate
    resource="health_data"
    action="read"
    requiredTrustLevel="medium"
    maxRiskScore={60}
    requireLocationAccess={true}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const TrainerGate: React.FC<{ 
  children: ReactNode; 
  fallback?: ReactNode;
  horseId?: string;
}> = ({ 
  children, 
  fallback,
  horseId 
}) => (
  <PermissionGate
    resource="training_data"
    action="read"
    context={{ horseId }}
    requiredTrustLevel="low"
    maxRiskScore={70}
    requireLocationAccess={true}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export const AIMonitoringGate: React.FC<{ 
  children: ReactNode; 
  fallback?: ReactNode;
  action?: 'read' | 'write' | 'acknowledge' | 'escalate';
}> = ({ 
  children, 
  fallback,
  action = 'read'
}) => (
  <PermissionGate
    resource="ai_alerts"
    action={action}
    requiredTrustLevel="medium"
    maxRiskScore={60}
    requireDeviceTrust={true}
    showDeniedReason={true}
    fallback={fallback}
  >
    {children}
  </PermissionGate>
);

export default PermissionGate; 