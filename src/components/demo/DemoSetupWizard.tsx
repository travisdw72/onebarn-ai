/**
 * 💼 BUSINESS PARTNER GUIDE - DEMO SETUP WIZARD
 * 
 * This component guides business partners through camera setup for One Barn AI demos.
 * It provides step-by-step instructions, troubleshooting, and professional demo preparation.
 * 
 * DEMO FEATURES:
 * - Step-by-step camera configuration
 * - Clear permission instructions
 * - Device selection and testing
 * - Professional demo interface
 * - Comprehensive troubleshooting
 * 
 * BUSINESS PARTNER USAGE:
 * - Appears automatically for demo@onevault.ai account
 * - Guides through camera permissions and setup
 * - Tests camera quality before demo
 * - Provides troubleshooting for common issues
 * 
 * SETUP STEPS:
 * 1. Welcome and instructions
 * 2. Camera permissions
 * 3. Device selection
 * 4. Camera testing
 * 5. Setup complete
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Settings, 
  Monitor, 
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { demoCameraConfig } from '../../config/demoCameraConfig';
import { clientDashboardData } from '../../config/clientDashboardData';
import { useLocalCamera } from '../../hooks/useLocalCamera';
import { IDemoSetupWizardProps } from '../../interfaces/CameraTypes';

export const DemoSetupWizard: React.FC<IDemoSetupWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialConfig
}) => {
  // 🎯 SETUP WIZARD STATE
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [setupErrors, setSetupErrors] = useState<string[]>([]);
  const [testVideoRef, setTestVideoRef] = useState<HTMLVideoElement | null>(null);

  // 📱 CAMERA INTEGRATION
  const {
    devices,
    streams,
    permissions,
    errors,
    isLoading,
    requestPermissions,
    startCamera,
    stopCamera,
    switchCamera,
    getDefaultDevice,
    clearErrors
  } = useLocalCamera();

  // 📝 CONFIGURATION
  const uiConfig = clientDashboardData.demoCamera?.interface?.setupWizard || {};
  const stepConfig = demoCameraConfig.ui.setup.steps;
  const buttonConfig = demoCameraConfig.ui.setup.buttons;

  // 🎬 SETUP STEPS CONFIGURATION
  const setupSteps = [
    {
      id: 'welcome',
      title: stepConfig.welcome.title,
      description: stepConfig.welcome.description,
      icon: <Camera size={32} style={{ color: brandConfig.colors.championGold }} />,
      component: 'WelcomeStep'
    },
    {
      id: 'permissions',
      title: stepConfig.permissions.title,
      description: stepConfig.permissions.description,
      icon: <Settings size={32} style={{ color: brandConfig.colors.ribbonBlue }} />,
      component: 'PermissionsStep'
    },
    {
      id: 'device-selection',
      title: stepConfig.deviceSelection.title,
      description: stepConfig.deviceSelection.description,
      icon: <Monitor size={32} style={{ color: brandConfig.colors.hunterGreen }} />,
      component: 'DeviceSelectionStep'
    },
    {
      id: 'testing',
      title: stepConfig.testing.title,
      description: stepConfig.testing.description,
      icon: <CheckCircle size={32} style={{ color: brandConfig.colors.pastureSage }} />,
      component: 'TestingStep'
    },
    {
      id: 'complete',
      title: stepConfig.complete.title,
      description: stepConfig.complete.description,
      icon: <CheckCircle size={32} style={{ color: brandConfig.colors.successGreen }} />,
      component: 'CompleteStep'
    }
  ];

  // 🔄 STEP NAVIGATION
  const nextStep = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      clearErrors();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      clearErrors();
    }
  };

  const skipStep = () => {
    nextStep();
  };

  // 🔄 ERROR RECOVERY AND RETRY LOGIC
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  // 🎬 ENHANCED CAMERA OPERATIONS WITH RETRY
  const handleRequestPermissionsWithRetry = async (retries = 0) => {
    setIsRetrying(true);
    try {
      const granted = await requestPermissions();
      if (granted) {
        setRetryCount(0);
        setSetupErrors([]);
        nextStep();
      } else {
        if (retries < maxRetries) {
          setRetryCount(retries + 1);
          setTimeout(() => {
            handleRequestPermissionsWithRetry(retries + 1);
          }, 2000);
        } else {
          setSetupErrors([
            'Camera permission denied multiple times.',
            'Please manually grant camera permission in your browser settings.',
            'For Chrome: Click the camera icon in the address bar and select "Allow".',
            'For Firefox: Click the shield icon and select "Allow Camera".'
          ]);
        }
      }
    } catch (error) {
      console.error('[DemoSetupWizard] Permission request failed:', error);
      setSetupErrors([
        'Failed to request camera permissions.',
        'This may be due to browser restrictions.',
        'Please refresh the page and try again.'
      ]);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDeviceSelectionWithRetry = async (deviceId: string, retries = 0) => {
    setIsRetrying(true);
    try {
      const stream = await startCamera(deviceId);
      if (stream) {
        setRetryCount(0);
        setSetupErrors([]);
        nextStep();
      } else {
        if (retries < maxRetries) {
          setRetryCount(retries + 1);
          setTimeout(() => {
            handleDeviceSelectionWithRetry(deviceId, retries + 1);
          }, 2000);
        } else {
          setSetupErrors([
            'Failed to start camera after multiple attempts.',
            'Please try selecting a different camera device.',
            'If the issue persists, check your camera is not being used by another application.'
          ]);
        }
      }
    } catch (error) {
      console.error('[DemoSetupWizard] Device selection failed:', error);
      setSetupErrors([
        'Camera device selection failed.',
        'Your camera may be busy or unavailable.',
        'Please close other applications using your camera and try again.'
      ]);
    } finally {
      setIsRetrying(false);
    }
  };

  // 🧹 CLEAR ERRORS AND RESET STATE
  const handleClearErrors = () => {
    setSetupErrors([]);
    setRetryCount(0);
    clearErrors();
  };

  // 🎯 COMPLETE SETUP FUNCTION
  const handleCompleteSetup = async () => {
    setIsCompleting(true);
    try {
      const finalConfig = {
        ...demoCameraConfig.settings,
        ...initialConfig
      };
      
      onComplete(finalConfig);
      
      console.log('[DemoSetupWizard] Setup completed successfully', {
        devicesFound: devices.length,
        permissionsGranted: permissions.camera === 'granted',
        errorsEncountered: errors.length
      });
      
    } catch (error) {
      console.error('[DemoSetupWizard] Setup completion failed:', error);
      setSetupErrors(['Setup completion failed. Please try again.']);
    } finally {
      setIsCompleting(false);
    }
  };

  // 🎯 ENHANCED ERROR DISPLAY COMPONENT
  const ErrorDisplay: React.FC<{ errors: string[] }> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
      <div style={{
        backgroundColor: brandConfig.colors.errorRed + '20',
        border: `2px solid ${brandConfig.colors.errorRed}`,
        borderRadius: brandConfig.layout.borderRadius,
        padding: brandConfig.spacing.md,
        marginBottom: brandConfig.spacing.lg
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: brandConfig.spacing.sm
        }}>
          <AlertCircle size={24} style={{ 
            color: brandConfig.colors.errorRed,
            marginRight: brandConfig.spacing.sm
          }} />
          <h4 style={{
            fontSize: brandConfig.typography.fontSizeLg,
            fontWeight: brandConfig.typography.weightSemiBold,
            color: brandConfig.colors.errorRed,
            margin: 0
          }}>
            Setup Issue {retryCount > 0 && `(Retry ${retryCount}/${maxRetries})`}
          </h4>
        </div>
        
        {errors.map((error, index) => (
          <p key={index} style={{
            fontSize: brandConfig.typography.fontSizeBase,
            color: brandConfig.colors.midnightBlack,
            margin: `${brandConfig.spacing.xs} 0`,
            display: 'flex',
            alignItems: 'flex-start'
          }}>
            <span style={{ 
              marginRight: brandConfig.spacing.xs,
              color: brandConfig.colors.errorRed,
              fontWeight: brandConfig.typography.weightBold
            }}>
              •
            </span>
            {error}
          </p>
        ))}
        
        <div style={{
          display: 'flex',
          gap: brandConfig.spacing.sm,
          marginTop: brandConfig.spacing.md
        }}>
          <button
            onClick={handleClearErrors}
            style={{
              backgroundColor: brandConfig.colors.neutralGray,
              color: brandConfig.colors.barnWhite,
              border: 'none',
              borderRadius: brandConfig.layout.borderRadius,
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
              fontSize: brandConfig.typography.fontSizeSm,
              fontFamily: brandConfig.typography.fontPrimary,
              cursor: 'pointer'
            }}
          >
            Clear Errors
          </button>
          
          {retryCount > 0 && retryCount < maxRetries && (
            <button
              onClick={() => {
                if (currentStep === 1) {
                  handleRequestPermissionsWithRetry(retryCount);
                } else if (currentStep === 2) {
                  const defaultDevice = getDefaultDevice();
                  if (defaultDevice) {
                    handleDeviceSelectionWithRetry(defaultDevice.deviceId, retryCount);
                  }
                }
              }}
              disabled={isRetrying}
              style={{
                backgroundColor: brandConfig.colors.ribbonBlue,
                color: brandConfig.colors.barnWhite,
                border: 'none',
                borderRadius: brandConfig.layout.borderRadius,
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                fontSize: brandConfig.typography.fontSizeSm,
                fontFamily: brandConfig.typography.fontPrimary,
                cursor: isRetrying ? 'not-allowed' : 'pointer',
                opacity: isRetrying ? 0.6 : 1
              }}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // 📱 WELCOME STEP COMPONENT
  const WelcomeStep = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <Camera size={64} style={{ 
          color: brandConfig.colors.championGold,
          marginBottom: brandConfig.spacing.md
        }} />
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {uiConfig.title}
        </h2>
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.lg
        }}>
          {uiConfig.welcomeMessage}
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
          {stepConfig.welcome.title}
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {stepConfig.welcome.instructions.map((instruction, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack
            }}>
              <CheckCircle size={16} style={{ 
                color: brandConfig.colors.successGreen,
                marginRight: brandConfig.spacing.sm
              }} />
              {instruction}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{
        backgroundColor: brandConfig.colors.ribbonBlue + '20',
        padding: brandConfig.spacing.md,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.ribbonBlue}`
      }}>
        <h4 style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.xs
        }}>
          💼 Business Partner Requirements:
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {(uiConfig.businessPartnerInstructions || []).map((instruction: string, index: number) => (
            <li key={index} style={{
              fontSize: brandConfig.typography.fontSizeSm,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack,
              marginBottom: brandConfig.spacing.xs
            }}>
              • {instruction}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // 🔐 PERMISSIONS STEP COMPONENT
  const PermissionsStep = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <Settings size={64} style={{ 
          color: brandConfig.colors.ribbonBlue,
          marginBottom: brandConfig.spacing.md
        }} />
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {stepConfig.permissions.title}
        </h2>
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.lg
        }}>
          {stepConfig.permissions.description}
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
          Permission Status:
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: brandConfig.spacing.md
        }}>
          {permissions.camera === 'granted' ? (
            <CheckCircle size={24} style={{ color: brandConfig.colors.successGreen }} />
          ) : (
            <AlertCircle size={24} style={{ color: brandConfig.colors.alertAmber }} />
          )}
          <span style={{
            marginLeft: brandConfig.spacing.sm,
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack
          }}>
            Camera: {permissions.camera === 'granted' ? 'Granted' : 'Required'}
          </span>
        </div>
      </div>

      {setupErrors.length > 0 && (
        <ErrorDisplay errors={setupErrors} />
      )}

      {permissions.camera !== 'granted' && (
        <div style={{ textAlign: 'center' }}>
                     <button
             onClick={() => handleRequestPermissionsWithRetry()}
             disabled={isLoading || isRetrying}
             style={{
               backgroundColor: brandConfig.colors.ribbonBlue,
               color: brandConfig.colors.arenaSand,
               border: 'none',
               borderRadius: brandConfig.layout.borderRadius,
               padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
               fontSize: brandConfig.typography.fontSizeBase,
               fontFamily: brandConfig.typography.fontPrimary,
               fontWeight: brandConfig.typography.weightSemiBold,
               cursor: isLoading || isRetrying ? 'not-allowed' : 'pointer',
               opacity: isLoading || isRetrying ? 0.6 : 1
             }}
           >
             {isLoading || isRetrying ? 'Requesting...' : 'Grant Permissions'}
           </button>
        </div>
      )}
    </div>
  );

  // 📱 DEVICE SELECTION STEP COMPONENT
  const DeviceSelectionStep = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <Monitor size={64} style={{ 
          color: brandConfig.colors.hunterGreen,
          marginBottom: brandConfig.spacing.md
        }} />
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {stepConfig.deviceSelection.title}
        </h2>
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.lg
        }}>
          {stepConfig.deviceSelection.description}
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
          {stepConfig.deviceSelection.labels.deviceList}:
        </h3>
        {devices.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
            {devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => handleDeviceSelectionWithRetry(device.deviceId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: brandConfig.spacing.md,
                  backgroundColor: brandConfig.colors.barnWhite,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  color: brandConfig.colors.midnightBlack,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Camera size={20} style={{ 
                    color: brandConfig.colors.hunterGreen,
                    marginRight: brandConfig.spacing.sm
                  }} />
                  {device.label}
                </div>
                {device.isDefault && (
                  <span style={{
                    fontSize: brandConfig.typography.fontSizeSm,
                    color: brandConfig.colors.championGold,
                    fontWeight: brandConfig.typography.weightMedium
                  }}>
                    Default
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.neutralGray,
            textAlign: 'center',
            padding: brandConfig.spacing.lg
          }}>
            No camera devices found. Please ensure a camera is connected.
          </p>
        )}
      </div>
    </div>
  );

  // 🧪 TESTING STEP COMPONENT
  const TestingStep = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <CheckCircle size={64} style={{ 
          color: brandConfig.colors.pastureSage,
          marginBottom: brandConfig.spacing.md
        }} />
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {stepConfig.testing.title}
        </h2>
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.lg
        }}>
          {stepConfig.testing.description}
        </p>
      </div>

      {streams.length > 0 && (
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
            {stepConfig.deviceSelection.labels.preview}:
          </h3>
          <div style={{
            backgroundColor: brandConfig.colors.midnightBlack,
            borderRadius: brandConfig.layout.borderRadius,
            overflow: 'hidden',
            aspectRatio: '16/9'
          }}>
            <video
              ref={(el) => {
                setTestVideoRef(el);
                if (el && streams[0]?.stream) {
                  el.srcObject = streams[0].stream;
                }
              }}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: brandConfig.colors.successGreen + '20',
        padding: brandConfig.spacing.md,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.successGreen}`,
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.successGreen,
          margin: 0,
          fontWeight: brandConfig.typography.weightSemiBold
        }}>
          {stepConfig.testing.status.ready}
        </p>
      </div>
    </div>
  );

  // ✅ COMPLETE STEP COMPONENT
  const CompleteStep = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: brandConfig.spacing.xl 
      }}>
        <CheckCircle size={64} style={{ 
          color: brandConfig.colors.successGreen,
          marginBottom: brandConfig.spacing.md
        }} />
        <h2 style={{
          fontSize: brandConfig.typography.fontSize2xl,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          {stepConfig.complete.title}
        </h2>
        <p style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.lg
        }}>
          {stepConfig.complete.description}
        </p>
      </div>

      <div style={{
        backgroundColor: brandConfig.colors.successGreen + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        marginBottom: brandConfig.spacing.lg
      }}>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          {stepConfig.complete.summary}
        </p>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          What's Next:
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {stepConfig.complete.nextSteps.map((step, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack
            }}>
              <CheckCircle size={16} style={{ 
                color: brandConfig.colors.successGreen,
                marginRight: brandConfig.spacing.sm
              }} />
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleCompleteSetup}
          disabled={isCompleting}
          style={{
            backgroundColor: brandConfig.colors.successGreen,
            color: brandConfig.colors.arenaSand,
            border: 'none',
            borderRadius: brandConfig.layout.borderRadius,
            padding: `${brandConfig.spacing.md} ${brandConfig.spacing.xl}`,
            fontSize: brandConfig.typography.fontSizeLg,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightBold,
            cursor: isCompleting ? 'not-allowed' : 'pointer',
            opacity: isCompleting ? 0.6 : 1
          }}
        >
          {isCompleting ? 'Completing...' : buttonConfig.startDemo}
        </button>
      </div>
    </div>
  );

  // 🎭 RENDER CURRENT STEP
  const renderCurrentStep = () => {
    switch (setupSteps[currentStep].component) {
      case 'WelcomeStep':
        return <WelcomeStep />;
      case 'PermissionsStep':
        return <PermissionsStep />;
      case 'DeviceSelectionStep':
        return <DeviceSelectionStep />;
      case 'TestingStep':
        return <TestingStep />;
      case 'CompleteStep':
        return <CompleteStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // 🎯 MAIN RENDER
  if (!isOpen) return null;

  return (
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
        {/* 📊 PROGRESS HEADER */}
        <div style={{
          padding: brandConfig.spacing.lg,
          borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
          backgroundColor: brandConfig.colors.arenaSand
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: brandConfig.spacing.md
          }}>
            <h1 style={{
              fontSize: brandConfig.typography.fontSizeXl,
              fontFamily: brandConfig.typography.fontPrimary,
              fontWeight: brandConfig.typography.weightBold,
              color: brandConfig.colors.midnightBlack,
              margin: 0
            }}>
              {setupSteps[currentStep].title}
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
          
          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: brandConfig.colors.sterlingSilver,
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStep + 1) / setupSteps.length) * 100}%`,
              height: '100%',
              backgroundColor: brandConfig.colors.championGold,
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: brandConfig.spacing.sm
          }}>
            {setupSteps[currentStep].icon}
            <span style={{
              marginLeft: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeSm,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.neutralGray
            }}>
              Step {currentStep + 1} of {setupSteps.length}
            </span>
          </div>
        </div>

        {/* 📱 STEP CONTENT */}
        {renderCurrentStep()}

        {/* 🎯 NAVIGATION FOOTER */}
        <div style={{
          padding: brandConfig.spacing.lg,
          borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
          backgroundColor: brandConfig.colors.arenaSand,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: `1px solid ${brandConfig.colors.sterlingSilver}`,
              borderRadius: brandConfig.layout.borderRadius,
              padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            <ArrowLeft size={16} style={{ marginRight: brandConfig.spacing.xs }} />
            {buttonConfig.previous}
          </button>
          
          <div style={{ display: 'flex', gap: brandConfig.spacing.sm }}>
            {currentStep < setupSteps.length - 1 && (
              <button
                onClick={skipStep}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  color: brandConfig.colors.neutralGray,
                  cursor: 'pointer'
                }}
              >
                {buttonConfig.skip}
              </button>
            )}
            
            {currentStep < setupSteps.length - 1 && (
              <button
                onClick={nextStep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: brandConfig.colors.stableMahogany,
                  border: 'none',
                  borderRadius: brandConfig.layout.borderRadius,
                  padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.arenaSand,
                  cursor: 'pointer'
                }}
              >
                {buttonConfig.next}
                <ArrowRight size={16} style={{ marginLeft: brandConfig.spacing.xs }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSetupWizard; 