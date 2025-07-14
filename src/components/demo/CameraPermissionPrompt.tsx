/**
 * 💼 BUSINESS PARTNER GUIDE - CAMERA PERMISSION PROMPT
 * 
 * This component provides clear guidance for granting camera permissions
 * during One Barn AI business partner demonstrations.
 * 
 * DEMO FEATURES:
 * - Clear permission request instructions
 * - Browser-specific guidance
 * - Visual permission indicators
 * - Troubleshooting for denied permissions
 * - Professional demo presentation
 * 
 * BUSINESS PARTNER USAGE:
 * - Appears when camera permissions are needed
 * - Provides step-by-step permission instructions
 * - Handles permission denial gracefully
 * - Offers alternative solutions
 * 
 * INTEGRATION POINTS:
 * - Used by DemoSetupWizard during permission step
 * - Triggered by camera service on permission errors
 * - Embedded in LiveVideoGrid for setup
 * - Accessible from troubleshooting guide
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Monitor,
  Settings,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { demoCameraConfig } from '../../config/demoCameraConfig';
import { clientDashboardConfig } from '../../config/clientDashboardData';

interface ICameraPermissionPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  onRetry: () => void;
  permissionStatus: 'prompt' | 'granted' | 'denied';
  isRequesting: boolean;
  browserName?: string;
  showHelp?: boolean;
}

export const CameraPermissionPrompt: React.FC<ICameraPermissionPromptProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
  onPermissionDenied,
  onRetry,
  permissionStatus,
  isRequesting,
  browserName = 'Chrome',
  showHelp = false
}) => {
  // 🎯 STATE MANAGEMENT
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // 📝 CONFIGURATION
  const uiConfig = demoCameraConfig.ui.setup.steps.permissions;
  const clientConfig = clientDashboardConfig.demoCamera?.interface?.errors;
  const demoConfig = demoCameraConfig.ui.demo;

  // 🎬 ANIMATION EFFECT
  useEffect(() => {
    if (isOpen && permissionStatus === 'prompt') {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, permissionStatus]);

  // 🌐 BROWSER-SPECIFIC INSTRUCTIONS
  const getBrowserInstructions = () => {
    const instructions = {
      Chrome: {
        icon: '🟢',
        steps: [
          'Click the camera icon in the address bar',
          'Select "Always allow" for best experience',
          'Click "Allow" to grant camera access',
          'Refresh the page if needed'
        ]
      },
      Firefox: {
        icon: '🟠',
        steps: [
          'Click the camera icon in the address bar',
          'Select "Allow" from the dropdown',
          'Check "Remember this decision"',
          'Click "Allow" to confirm'
        ]
      },
      Safari: {
        icon: '🔵',
        steps: [
          'Click "Safari" in the menu bar',
          'Select "Settings for This Website"',
          'Change camera to "Allow"',
          'Refresh the page'
        ]
      },
      Edge: {
        icon: '🟡',
        steps: [
          'Click the camera icon in the address bar',
          'Select "Allow" from the dropdown',
          'Choose "Always allow on this site"',
          'Refresh if needed'
        ]
      }
    };
    return instructions[browserName as keyof typeof instructions] || instructions.Chrome;
  };

  // 🎨 PERMISSION STATUS COMPONENT
  const PermissionStatusIndicator = () => {
    const statusConfig = {
      prompt: {
        icon: <Camera size={24} style={{ color: brandConfig.colors.alertAmber }} />,
        text: 'Permission Required',
        color: brandConfig.colors.alertAmber,
        bgColor: brandConfig.colors.alertAmber + '20'
      },
      granted: {
        icon: <CheckCircle size={24} style={{ color: brandConfig.colors.successGreen }} />,
        text: 'Permission Granted',
        color: brandConfig.colors.successGreen,
        bgColor: brandConfig.colors.successGreen + '20'
      },
      denied: {
        icon: <XCircle size={24} style={{ color: brandConfig.colors.errorRed }} />,
        text: 'Permission Denied',
        color: brandConfig.colors.errorRed,
        bgColor: brandConfig.colors.errorRed + '20'
      }
    };

    const config = statusConfig[permissionStatus];

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: brandConfig.spacing.md,
        backgroundColor: config.bgColor,
        borderRadius: brandConfig.layout.borderRadius,
        border: `1px solid ${config.color}`,
        marginBottom: brandConfig.spacing.lg
      }}>
        {config.icon}
        <span style={{
          marginLeft: brandConfig.spacing.sm,
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: config.color
        }}>
          {config.text}
        </span>
      </div>
    );
  };

  // 🎯 PERMISSION REQUEST COMPONENT
  const PermissionRequestContent = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        marginBottom: brandConfig.spacing.xl,
        position: 'relative'
      }}>
        {/* Animated Camera Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: brandConfig.colors.championGold + '20',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: brandConfig.spacing.md,
          animation: isRequesting ? 'pulse 2s infinite' : 'none'
        }}>
          <Camera size={40} style={{ color: brandConfig.colors.championGold }} />
        </div>
        
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          margin: 0,
          marginBottom: brandConfig.spacing.sm
        }}>
          {uiConfig.title}
        </h2>
        
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          margin: 0,
          marginBottom: brandConfig.spacing.lg
        }}>
          {uiConfig.description}
        </p>
      </div>

      {/* Instructions */}
      <div style={{
        backgroundColor: brandConfig.colors.arenaSand,
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        marginBottom: brandConfig.spacing.lg,
        textAlign: 'left'
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Settings size={20} style={{ marginRight: brandConfig.spacing.sm }} />
          Instructions for {browserName}:
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
          {uiConfig.instructions.map((instruction, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: brandConfig.spacing.md
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: brandConfig.colors.ribbonBlue,
                color: brandConfig.colors.arenaSand,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: brandConfig.typography.fontSizeSm,
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightBold,
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <p style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                color: brandConfig.colors.midnightBlack,
                margin: 0
              }}>
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Browser-specific guidance */}
      <div style={{
        backgroundColor: brandConfig.colors.ribbonBlue + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.ribbonBlue}`,
        marginBottom: brandConfig.spacing.lg
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md,
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: brandConfig.spacing.sm }}>
            {getBrowserInstructions().icon}
          </span>
          {browserName} Specific Steps:
        </h3>
        
        <ol style={{
          paddingLeft: brandConfig.spacing.lg,
          margin: 0
        }}>
          {getBrowserInstructions().steps.map((step, index) => (
            <li key={index} style={{
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack,
              marginBottom: brandConfig.spacing.sm
            }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Request Button */}
      <button
        onClick={onPermissionGranted}
        disabled={isRequesting}
        style={{
          backgroundColor: brandConfig.colors.ribbonBlue,
          color: brandConfig.colors.arenaSand,
          border: 'none',
          borderRadius: brandConfig.layout.borderRadius,
          padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          cursor: isRequesting ? 'not-allowed' : 'pointer',
          opacity: isRequesting ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: brandConfig.spacing.sm,
          margin: '0 auto'
        }}
      >
        {isRequesting ? (
          <>
            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Requesting Permission...
          </>
        ) : (
          <>
            <Shield size={20} />
            Grant Camera Permission
          </>
        )}
      </button>
    </div>
  );

  // ✅ PERMISSION GRANTED COMPONENT
  const PermissionGrantedContent = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: brandConfig.colors.successGreen + '20',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: brandConfig.spacing.md
        }}>
          <CheckCircle size={40} style={{ color: brandConfig.colors.successGreen }} />
        </div>
        
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          margin: 0,
          marginBottom: brandConfig.spacing.sm
        }}>
          Permission Granted!
        </h2>
        
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          margin: 0,
          marginBottom: brandConfig.spacing.lg
        }}>
          Camera access has been successfully granted for the demo.
        </p>
      </div>

      <div style={{
        backgroundColor: brandConfig.colors.successGreen + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.successGreen}`,
        marginBottom: brandConfig.spacing.lg
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          You're ready to proceed!
        </h3>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.midnightBlack,
          margin: 0
        }}>
          The camera setup will now continue with device selection and testing.
        </p>
      </div>
    </div>
  );

  // ❌ PERMISSION DENIED COMPONENT
  const PermissionDeniedContent = () => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: brandConfig.colors.errorRed + '20',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          marginBottom: brandConfig.spacing.md
        }}>
          <XCircle size={40} style={{ color: brandConfig.colors.errorRed }} />
        </div>
        
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          margin: 0,
          marginBottom: brandConfig.spacing.sm
        }}>
          Permission Denied
        </h2>
        
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          margin: 0,
          marginBottom: brandConfig.spacing.lg
        }}>
          Camera access was denied. The demo requires camera permissions to function.
        </p>
      </div>

      <div style={{
        backgroundColor: brandConfig.colors.errorRed + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.errorRed}`,
        marginBottom: brandConfig.spacing.lg
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          💼 How to Fix This:
        </h3>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {uiConfig.troubleshooting.denied}
        </p>
      </div>

      <div style={{
        backgroundColor: brandConfig.colors.arenaSand,
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        marginBottom: brandConfig.spacing.lg
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          Manual Permission Reset:
        </h3>
        <ol style={{
          paddingLeft: brandConfig.spacing.lg,
          margin: 0,
          textAlign: 'left'
        }}>
          <li style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack,
            marginBottom: brandConfig.spacing.sm
          }}>
            Click the 🔒 or 🎥 icon in your browser's address bar
          </li>
          <li style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack,
            marginBottom: brandConfig.spacing.sm
          }}>
            Change camera permission to "Allow"
          </li>
          <li style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack,
            marginBottom: brandConfig.spacing.sm
          }}>
            Refresh the page
          </li>
          <li style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack
          }}>
            Try the setup again
          </li>
        </ol>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: brandConfig.spacing.md }}>
        <button
          onClick={onRetry}
          style={{
            backgroundColor: brandConfig.colors.ribbonBlue,
            color: brandConfig.colors.arenaSand,
            border: 'none',
            borderRadius: brandConfig.layout.borderRadius,
            padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightSemiBold,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        
        <button
          onClick={() => setShowTroubleshooting(true)}
          style={{
            backgroundColor: 'transparent',
            color: brandConfig.colors.midnightBlack,
            border: `1px solid ${brandConfig.colors.sterlingSilver}`,
            borderRadius: brandConfig.layout.borderRadius,
            padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightSemiBold,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: brandConfig.spacing.sm
          }}
        >
          <HelpCircle size={16} />
          Get Help
        </button>
      </div>
    </div>
  );

  // 🎯 MAIN RENDER
  if (!isOpen) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: brandConfig.colors.barnWhite,
          borderRadius: brandConfig.layout.borderRadius,
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{
            padding: brandConfig.spacing.lg,
            borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
            backgroundColor: brandConfig.colors.arenaSand,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h1 style={{
              fontSize: brandConfig.typography.fontSizeXl,
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.midnightBlack,
              margin: 0
            }}>
              Camera Permissions
            </h1>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: brandConfig.typography.fontSizeXl,
                color: brandConfig.colors.neutralGray,
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          {/* Status Indicator */}
          <div style={{ padding: brandConfig.spacing.lg, paddingBottom: 0 }}>
            <PermissionStatusIndicator />
          </div>

          {/* Content */}
          <div style={{ padding: brandConfig.spacing.lg }}>
            {permissionStatus === 'prompt' && <PermissionRequestContent />}
            {permissionStatus === 'granted' && <PermissionGrantedContent />}
            {permissionStatus === 'denied' && <PermissionDeniedContent />}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default CameraPermissionPrompt; 