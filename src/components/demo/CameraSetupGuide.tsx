/**
 * 💼 BUSINESS PARTNER GUIDE - CAMERA SETUP GUIDE
 * 
 * This component provides detailed camera setup instructions and troubleshooting
 * for business partners during One Barn AI demonstrations.
 * 
 * DEMO FEATURES:
 * - Clear step-by-step instructions
 * - Visual troubleshooting guide
 * - Common issue resolution
 * - Professional demo preparation
 * - Browser compatibility information
 * 
 * BUSINESS PARTNER USAGE:
 * - Appears when camera setup issues occur
 * - Provides instant troubleshooting help
 * - Includes browser-specific instructions
 * - Offers direct support contact information
 * 
 * INTEGRATION POINTS:
 * - Used by DemoSetupWizard for help
 * - Triggered by camera errors
 * - Accessible from LiveVideoGrid
 * - Embedded in support documentation
 */

import React, { useState } from 'react';
import { 
  Camera, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  Monitor, 
  Smartphone, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { demoCameraConfig } from '../../config/demoCameraConfig';
import { clientDashboardConfig } from '../../config/clientDashboardData';

interface ICameraSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentError?: string;
  showSection?: 'setup' | 'troubleshooting' | 'requirements' | 'support';
}

export const CameraSetupGuide: React.FC<ICameraSetupGuideProps> = ({
  isOpen,
  onClose,
  currentError,
  showSection = 'setup'
}) => {
  // 🎯 STATE MANAGEMENT
  const [activeSection, setActiveSection] = useState(showSection);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  // 📝 CONFIGURATION
  const uiConfig = demoCameraConfig.ui.demo;
  const troubleshootingConfig = demoCameraConfig.ui.troubleshooting;
  const clientConfig = clientDashboardConfig.demoCamera;

  // 🎨 SECTION NAVIGATION
  const sections = [
    {
      id: 'setup',
      title: 'Setup Instructions',
      icon: <Settings size={20} />,
      color: brandConfig.colors.ribbonBlue
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <AlertCircle size={20} />,
      color: brandConfig.colors.alertAmber
    },
    {
      id: 'requirements',
      title: 'Requirements',
      icon: <Monitor size={20} />,
      color: brandConfig.colors.hunterGreen
    },
    {
      id: 'support',
      title: 'Get Support',
      icon: <HelpCircle size={20} />,
      color: brandConfig.colors.victoryRose
    }
  ];

  // 🎯 SETUP INSTRUCTIONS SECTION
  const renderSetupInstructions = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: brandConfig.spacing.lg
      }}>
        <Camera size={32} style={{ 
          color: brandConfig.colors.ribbonBlue,
          marginRight: brandConfig.spacing.md
        }} />
        <div>
          <h2 style={{
            fontSize: brandConfig.typography.fontSizeXl,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            margin: 0,
            marginBottom: brandConfig.spacing.xs
          }}>
            Camera Setup Instructions
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.neutralGray,
            margin: 0
          }}>
            Follow these steps to set up your camera for the demonstration
          </p>
        </div>
      </div>

      {/* Quick Start Steps */}
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
          Quick Start Guide
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
          {uiConfig.instructions.steps.map((step, index) => (
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
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div style={{
        backgroundColor: brandConfig.colors.championGold + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.championGold}`
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          💡 Pro Tips for Best Results
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {uiConfig.instructions.tips.map((tip, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack
            }}>
              <CheckCircle size={16} style={{ 
                color: brandConfig.colors.championGold,
                marginRight: brandConfig.spacing.sm,
                marginTop: '2px',
                flexShrink: 0
              }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // 🔧 TROUBLESHOOTING SECTION
  const renderTroubleshooting = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: brandConfig.spacing.lg
      }}>
        <AlertCircle size={32} style={{ 
          color: brandConfig.colors.alertAmber,
          marginRight: brandConfig.spacing.md
        }} />
        <div>
          <h2 style={{
            fontSize: brandConfig.typography.fontSizeXl,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            margin: 0,
            marginBottom: brandConfig.spacing.xs
          }}>
            {troubleshootingConfig.title}
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.neutralGray,
            margin: 0
          }}>
            {troubleshootingConfig.subtitle}
          </p>
        </div>
      </div>

      {/* Common Problems */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
        {troubleshootingConfig.problems.map((problem, index) => (
          <div key={problem.title} style={{
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setExpandedProblem(
                expandedProblem === problem.title ? null : problem.title
              )}
              style={{
                width: '100%',
                padding: brandConfig.spacing.md,
                backgroundColor: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.midnightBlack
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={20} style={{ 
                  color: brandConfig.colors.alertAmber,
                  marginRight: brandConfig.spacing.sm
                }} />
                {problem.title}
              </div>
              <span style={{
                transform: expandedProblem === problem.title ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}>
                ▼
              </span>
            </button>
            
            {expandedProblem === problem.title && (
              <div style={{
                padding: brandConfig.spacing.md,
                paddingTop: 0,
                borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`
              }}>
                <p style={{
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  color: brandConfig.colors.neutralGray,
                  marginBottom: brandConfig.spacing.md
                }}>
                  {problem.description}
                </p>
                
                <div style={{
                  backgroundColor: brandConfig.colors.barnWhite,
                  padding: brandConfig.spacing.md,
                  borderRadius: brandConfig.layout.borderRadius,
                  marginBottom: brandConfig.spacing.md
                }}>
                  <h4 style={{
                    fontSize: brandConfig.typography.fontSizeBase,
                    fontFamily: brandConfig.typography.fontPrimary,
                    fontWeight: brandConfig.typography.weightSemiBold,
                    color: brandConfig.colors.midnightBlack,
                    marginBottom: brandConfig.spacing.sm
                  }}>
                    Solution:
                  </h4>
                  <p style={{
                    fontSize: brandConfig.typography.fontSizeBase,
                    fontFamily: brandConfig.typography.fontPrimary,
                    color: brandConfig.colors.midnightBlack,
                    margin: 0
                  }}>
                    {problem.solution}
                  </p>
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
                    marginBottom: brandConfig.spacing.sm
                  }}>
                    💼 Business Partner Note:
                  </h4>
                  <p style={{
                    fontSize: brandConfig.typography.fontSizeBase,
                    fontFamily: brandConfig.typography.fontPrimary,
                    color: brandConfig.colors.midnightBlack,
                    margin: 0
                  }}>
                    {problem.businessPartnerNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 📋 REQUIREMENTS SECTION
  const renderRequirements = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: brandConfig.spacing.lg
      }}>
        <Monitor size={32} style={{ 
          color: brandConfig.colors.hunterGreen,
          marginRight: brandConfig.spacing.md
        }} />
        <div>
          <h2 style={{
            fontSize: brandConfig.typography.fontSizeXl,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            margin: 0,
            marginBottom: brandConfig.spacing.xs
          }}>
            System Requirements
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.neutralGray,
            margin: 0
          }}>
            Ensure your system meets these requirements for optimal performance
          </p>
        </div>
      </div>

      {/* Browser Requirements */}
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
          Supported Browsers
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: brandConfig.spacing.sm }}>
          {[
            { name: 'Chrome', version: '60+', recommended: true },
            { name: 'Firefox', version: '55+', recommended: false },
            { name: 'Safari', version: '11+', recommended: false },
            { name: 'Edge', version: '79+', recommended: false }
          ].map((browser) => (
            <div key={browser.name} style={{
              display: 'flex',
              alignItems: 'center',
              padding: brandConfig.spacing.sm,
              backgroundColor: brandConfig.colors.barnWhite,
              borderRadius: brandConfig.layout.borderRadius,
              border: browser.recommended ? `2px solid ${brandConfig.colors.championGold}` : `1px solid ${brandConfig.colors.sterlingSilver}`
            }}>
              <CheckCircle size={16} style={{ 
                color: brandConfig.colors.successGreen,
                marginRight: brandConfig.spacing.sm
              }} />
              <div>
                <span style={{
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.midnightBlack
                }}>
                  {browser.name}
                </span>
                <span style={{
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontFamily: brandConfig.typography.fontPrimary,
                  color: brandConfig.colors.neutralGray,
                  marginLeft: brandConfig.spacing.xs
                }}>
                  {browser.version}
                </span>
                {browser.recommended && (
                  <span style={{
                    fontSize: brandConfig.typography.fontSizeSm,
                    fontFamily: brandConfig.typography.fontPrimary,
                    color: brandConfig.colors.championGold,
                    marginLeft: brandConfig.spacing.xs,
                    fontWeight: brandConfig.typography.weightSemiBold
                  }}>
                    Recommended
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Requirements */}
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
          Hardware Requirements
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {troubleshootingConfig.support.resources.map((resource, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: brandConfig.spacing.sm,
              fontSize: brandConfig.typography.fontSizeBase,
              fontFamily: brandConfig.typography.fontPrimary,
              color: brandConfig.colors.midnightBlack
            }}>
              <CheckCircle size={16} style={{ 
                color: brandConfig.colors.successGreen,
                marginRight: brandConfig.spacing.sm,
                marginTop: '2px',
                flexShrink: 0
              }} />
              {resource}
            </li>
          ))}
        </ul>
      </div>

      {/* Security Requirements */}
      <div style={{
        backgroundColor: brandConfig.colors.victoryRose + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.victoryRose}`
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          🔒 Security Requirements
        </h3>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.sm
        }}>
          Camera access requires a secure connection:
        </p>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          <li style={{
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
            HTTPS connection required
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.midnightBlack
          }}>
            <CheckCircle size={16} style={{ 
              color: brandConfig.colors.successGreen,
              marginRight: brandConfig.spacing.sm
            }} />
            Localhost accepted for testing
          </li>
        </ul>
      </div>
    </div>
  );

  // 🎧 SUPPORT SECTION
  const renderSupport = () => (
    <div style={{ padding: brandConfig.spacing.lg }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: brandConfig.spacing.lg
      }}>
        <HelpCircle size={32} style={{ 
          color: brandConfig.colors.victoryRose,
          marginRight: brandConfig.spacing.md
        }} />
        <div>
          <h2 style={{
            fontSize: brandConfig.typography.fontSizeXl,
            fontFamily: brandConfig.typography.fontPrimary,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
            margin: 0,
            marginBottom: brandConfig.spacing.xs
          }}>
            {troubleshootingConfig.support.title}
          </h2>
          <p style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontFamily: brandConfig.typography.fontPrimary,
            color: brandConfig.colors.neutralGray,
            margin: 0
          }}>
            {troubleshootingConfig.support.description}
          </p>
        </div>
      </div>

      {/* Contact Information */}
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
          {troubleshootingConfig.support.contact.title}
        </h3>
        <p style={{
          fontSize: brandConfig.typography.fontSizeBase,
          fontFamily: brandConfig.typography.fontPrimary,
          color: brandConfig.colors.neutralGray,
          marginBottom: brandConfig.spacing.md
        }}>
          {troubleshootingConfig.support.contact.description}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: brandConfig.spacing.sm,
            backgroundColor: brandConfig.colors.barnWhite,
            borderRadius: brandConfig.layout.borderRadius
          }}>
            <Mail size={20} style={{ 
              color: brandConfig.colors.ribbonBlue,
              marginRight: brandConfig.spacing.sm
            }} />
            <div>
              <span style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.midnightBlack
              }}>
                Email: 
              </span>
              <span style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                color: brandConfig.colors.ribbonBlue,
                marginLeft: brandConfig.spacing.xs
              }}>
                {troubleshootingConfig.support.contact.email}
              </span>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: brandConfig.spacing.sm,
            backgroundColor: brandConfig.colors.barnWhite,
            borderRadius: brandConfig.layout.borderRadius
          }}>
            <Settings size={20} style={{ 
              color: brandConfig.colors.hunterGreen,
              marginRight: brandConfig.spacing.sm
            }} />
            <div>
              <span style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                fontWeight: brandConfig.typography.weightSemiBold,
                color: brandConfig.colors.midnightBlack
              }}>
                Hours: 
              </span>
              <span style={{
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                color: brandConfig.colors.midnightBlack,
                marginLeft: brandConfig.spacing.xs
              }}>
                {troubleshootingConfig.support.contact.hours}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: brandConfig.colors.successGreen + '20',
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        borderLeft: `4px solid ${brandConfig.colors.successGreen}`
      }}>
        <h3 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontFamily: brandConfig.typography.fontPrimary,
          fontWeight: brandConfig.typography.weightSemiBold,
          color: brandConfig.colors.midnightBlack,
          marginBottom: brandConfig.spacing.md
        }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: brandConfig.spacing.sm }}>
          {troubleshootingConfig.actions.map((action, index) => (
            <button
              key={index}
              style={{
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                backgroundColor: brandConfig.colors.barnWhite,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase,
                fontFamily: brandConfig.typography.fontPrimary,
                color: brandConfig.colors.midnightBlack,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: brandConfig.spacing.xs
              }}
              onClick={() => {
                // Handle action click
                console.log(`Action clicked: ${action}`);
              }}
            >
              <RefreshCw size={16} />
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

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
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
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
            Camera Setup Guide
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

        {/* Navigation */}
        <div style={{
          padding: brandConfig.spacing.md,
          borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
          backgroundColor: brandConfig.colors.arenaSand
        }}>
          <div style={{ display: 'flex', gap: brandConfig.spacing.sm, overflowX: 'auto' }}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                  backgroundColor: activeSection === section.id ? section.color : 'transparent',
                  color: activeSection === section.id ? brandConfig.colors.barnWhite : brandConfig.colors.midnightBlack,
                  border: `1px solid ${section.color}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontFamily: brandConfig.typography.fontPrimary,
                  fontWeight: brandConfig.typography.weightMedium,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  gap: brandConfig.spacing.xs
                }}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeSection === 'setup' && renderSetupInstructions()}
          {activeSection === 'troubleshooting' && renderTroubleshooting()}
          {activeSection === 'requirements' && renderRequirements()}
          {activeSection === 'support' && renderSupport()}
        </div>
      </div>
    </div>
  );
};

export default CameraSetupGuide; 