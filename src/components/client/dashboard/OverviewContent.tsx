import React from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/dashboardConfig';
import { useAuth } from '../../../contexts/AuthContext';

interface IOverviewContentProps {
  className?: string;
}

export const OverviewContent: React.FC<IOverviewContentProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  const containerStyle: React.CSSProperties = {
    padding: brandConfig.spacing.lg,
    backgroundColor: brandConfig.colors.arenaSand,
    borderRadius: brandConfig.layout.borderRadius,
    minHeight: '400px'
  };

  const headingStyle: React.CSSProperties = {
    color: brandConfig.colors.hunterGreen,
    fontSize: brandConfig.typography.fontSize2xl,
    fontWeight: brandConfig.typography.weightBold,
    marginBottom: brandConfig.spacing.lg,
    fontFamily: brandConfig.typography.fontPrimary
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: brandConfig.spacing.xl,
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`
  };

  return (
    <div className={className} style={containerStyle}>
      <h1 style={headingStyle}>
        🏠 {dashboardConfig.welcome.client.greeting}
      </h1>

      {/* Welcome Section */}
      <section style={sectionStyle}>
        <h2 style={{
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeLg,
          marginBottom: brandConfig.spacing.sm
        }}>
          Welcome back, {user?.email?.split('@')[0] || 'Client'}!
        </h2>
        <p style={{
          color: brandConfig.colors.midnightBlack,
          fontSize: brandConfig.typography.fontSizeBase,
          lineHeight: '1.5'
        }}>
          {dashboardConfig.welcome.client.subtitle}
        </p>
      </section>

      {/* Quick Stats */}
      <section style={sectionStyle}>
        <h3 style={{
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeLg,
          marginBottom: brandConfig.spacing.md
        }}>
          Your Horses at a Glance
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: brandConfig.spacing.md
        }}>
          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.hunterGreen}`
          }}>
            <h4 style={{
              color: brandConfig.colors.hunterGreen,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              margin: 0
            }}>
              2
            </h4>
            <p style={{
              color: brandConfig.colors.midnightBlack,
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0`
            }}>
              Your Horses
            </p>
          </div>

          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.successGreen}`
          }}>
            <h4 style={{
              color: brandConfig.colors.successGreen,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              margin: 0
            }}>
              All Good
            </h4>
            <p style={{
              color: brandConfig.colors.midnightBlack,
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0`
            }}>
              Health Status
            </p>
          </div>

          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.ribbonBlue}`
          }}>
            <h4 style={{
              color: brandConfig.colors.ribbonBlue,
              fontSize: brandConfig.typography.fontSize2xl,
              fontWeight: brandConfig.typography.weightBold,
              margin: 0
            }}>
              3
            </h4>
            <p style={{
              color: brandConfig.colors.midnightBlack,
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0`
            }}>
              Upcoming Sessions
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section style={sectionStyle}>
        <h3 style={{
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeLg,
          marginBottom: brandConfig.spacing.md
        }}>
          Recent Activity
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: brandConfig.spacing.sm
        }}>
          {[
            { time: '2 hours ago', activity: 'Thunder completed training session', type: 'training' },
            { time: '1 day ago', activity: 'Star health checkup completed', type: 'health' },
            { time: '2 days ago', activity: 'New photos added to gallery', type: 'media' }
          ].map((item, index) => (
            <div key={index} style={{
              padding: brandConfig.spacing.sm,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius,
              border: `1px solid ${brandConfig.colors.pastureSage}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{
                  fontSize: brandConfig.typography.fontSizeLg,
                  marginRight: brandConfig.spacing.sm
                }}>
                  {item.type === 'training' ? '🏆' : item.type === 'health' ? '🏥' : '📷'}
                </span>
                <span style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase
                }}>
                  {item.activity}
                </span>
              </div>
              <span style={{
                color: brandConfig.colors.neutralGray,
                fontSize: brandConfig.typography.fontSizeSm
              }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}; 