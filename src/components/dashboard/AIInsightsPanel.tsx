/**
 * AI Insights Panel Component
 * Displays alerts, insights, and horse trends
 * Config-driven mobile-first design for barn environments
 */

import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Clock, 
  Activity, 
  Heart 
} from 'lucide-react';
import { brandConfig } from '../../config/brandConfig';
import { newDashboardEnhancements } from '../../config/dashboardConfig';

interface AIInsightsPanelProps {
  insights: any[];
  alerts: any[];
  horses: any[];
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  alerts,
  horses
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'insights' | 'trends'>('alerts');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'behavior': 
        return <Activity style={{ width: '16px', height: '16px' }} />;
      case 'health': 
        return <Heart style={{ width: '16px', height: '16px' }} />;
      case 'activity': 
        return <TrendingUp style={{ width: '16px', height: '16px' }} />;
      default: 
        return <Brain style={{ width: '16px', height: '16px' }} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': 
        return <TrendingUp style={{ width: '16px', height: '16px', color: brandConfig.colors.successGreen }} />;
      case 'concerning': 
        return <TrendingDown style={{ width: '16px', height: '16px', color: brandConfig.colors.errorRed }} />;
      default: 
        return <TrendingUp style={{ width: '16px', height: '16px', color: brandConfig.colors.neutralGray }} />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': 
        return brandConfig.colors.errorRed;
      case 'high': 
        return brandConfig.colors.warningOrange;
      case 'medium': 
        return brandConfig.colors.alertAmber;
      default: 
        return brandConfig.colors.infoBlue;
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  // Panel container styles
  const panelStyle: React.CSSProperties = {
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    fontFamily: brandConfig.typography.fontPrimary,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
  };

  const tabNavStyle: React.CSSProperties = {
    display: 'flex',
    backgroundColor: brandConfig.colors.arenaSand,
    borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`,
  };

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: brandConfig.spacing.sm,
    backgroundColor: isActive ? brandConfig.colors.barnWhite : 'transparent',
    border: 'none',
    borderBottom: isActive ? `2px solid ${brandConfig.colors.stableMahogany}` : '2px solid transparent',
    cursor: 'pointer',
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    fontWeight: isActive ? brandConfig.typography.weightSemiBold : brandConfig.typography.weightMedium,
    color: isActive ? brandConfig.colors.stableMahogany : brandConfig.colors.midnightBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: brandConfig.spacing.xs,
    transition: 'all 0.2s ease',
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: brandConfig.spacing.md,
    overflow: 'auto',
  };

  const emergencyActionsStyle: React.CSSProperties = {
    padding: brandConfig.spacing.md,
    backgroundColor: brandConfig.colors.arenaSand,
    borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
  };

  const emergencyButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: brandConfig.spacing.sm,
    backgroundColor: brandConfig.colors.errorRed,
    color: brandConfig.colors.barnWhite,
    border: 'none',
    borderRadius: brandConfig.layout.borderRadius,
    fontSize: brandConfig.typography.fontSizeSm,
    fontFamily: brandConfig.typography.fontPrimary,
    fontWeight: brandConfig.typography.weightSemiBold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: brandConfig.spacing.xs,
    marginBottom: brandConfig.spacing.sm,
  };

  const quickActionsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: brandConfig.spacing.xs,
  };

  const quickActionButtonStyle: React.CSSProperties = {
    padding: brandConfig.spacing.xs,
    backgroundColor: brandConfig.colors.barnWhite,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
    borderRadius: brandConfig.layout.borderRadius,
    fontSize: brandConfig.typography.fontSizeXs,
    fontFamily: brandConfig.typography.fontPrimary,
    cursor: 'pointer',
    textAlign: 'center',
  };

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.xs }}>
          <Brain style={{ width: '20px', height: '20px', color: brandConfig.colors.stableMahogany }} />
          <h2 style={{
            margin: 0,
            fontSize: brandConfig.typography.fontSizeLg,
            fontWeight: brandConfig.typography.weightBold,
            color: brandConfig.colors.midnightBlack,
          }}>
            AI Guardian
          </h2>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: brandConfig.spacing.xs,
          fontSize: brandConfig.typography.fontSizeSm,
          color: brandConfig.colors.successGreen,
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: brandConfig.colors.successGreen,
          }} />
          <span>{newDashboardEnhancements.insights.systemActive}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={tabNavStyle}>
        <button
          onClick={() => setActiveTab('alerts')}
          style={getTabStyle(activeTab === 'alerts')}
        >
          <AlertCircle style={{ width: '16px', height: '16px' }} />
          {newDashboardEnhancements.insights.alertsTab} ({unresolvedAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          style={getTabStyle(activeTab === 'insights')}
        >
          <Brain style={{ width: '16px', height: '16px' }} />
          {newDashboardEnhancements.insights.insightsTab}
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          style={getTabStyle(activeTab === 'trends')}
        >
          <TrendingUp style={{ width: '16px', height: '16px' }} />
          {newDashboardEnhancements.insights.trendsTab}
        </button>
      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        {activeTab === 'alerts' && (
          <div>
            {unresolvedAlerts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: brandConfig.spacing.xl,
                color: brandConfig.colors.neutralGray,
              }}>
                <AlertCircle style={{ 
                  width: '48px', 
                  height: '48px', 
                  color: brandConfig.colors.successGreen,
                  marginBottom: brandConfig.spacing.md,
                }} />
                <p style={{
                  margin: 0,
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontFamily: brandConfig.typography.fontPrimary,
                }}>
                  {newDashboardEnhancements.insights.noAlertsMessage}
                </p>
              </div>
            ) : (
              unresolvedAlerts.map(alert => {
                const alertColor = getAlertColor(alert.severity);
                return (
                  <div 
                    key={alert.id}
                    style={{
                      padding: brandConfig.spacing.sm,
                      marginBottom: brandConfig.spacing.sm,
                      border: `1px solid ${alertColor}`,
                      borderRadius: brandConfig.layout.borderRadius,
                      backgroundColor: `${alertColor}10`, // 10% opacity
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: brandConfig.spacing.xs,
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: brandConfig.spacing.xs,
                      }}>
                        <AlertCircle style={{ width: '16px', height: '16px', color: alertColor }} />
                        <span style={{
                          fontSize: brandConfig.typography.fontSizeSm,
                          fontWeight: brandConfig.typography.weightSemiBold,
                          color: alertColor,
                        }}>
                          {alert.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span style={{
                        fontSize: brandConfig.typography.fontSizeXs,
                        color: brandConfig.colors.neutralGray,
                      }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div>
                      <p style={{
                        margin: `0 0 ${brandConfig.spacing.xs} 0`,
                        fontSize: brandConfig.typography.fontSizeSm,
                        color: brandConfig.colors.midnightBlack,
                      }}>
                        {horses.find(h => h.id === alert.horseId)?.name} - {alert.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{
                          fontSize: brandConfig.typography.fontSizeXs,
                          color: brandConfig.colors.neutralGray,
                        }}>
                          AI Confidence: {alert.aiConfidence}%
                        </span>
                        <button style={{
                          padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                          backgroundColor: brandConfig.colors.stableMahogany,
                          color: brandConfig.colors.barnWhite,
                          border: 'none',
                          borderRadius: brandConfig.layout.borderRadius,
                          fontSize: brandConfig.typography.fontSizeXs,
                          fontFamily: brandConfig.typography.fontPrimary,
                          cursor: 'pointer',
                        }}>
                          {newDashboardEnhancements.insights.respond}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            {insights.map(insight => (
              <div key={insight.id} style={{
                padding: brandConfig.spacing.sm,
                marginBottom: brandConfig.spacing.sm,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                backgroundColor: brandConfig.colors.barnWhite,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: brandConfig.spacing.xs,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: brandConfig.spacing.xs,
                  }}>
                    {getInsightIcon(insight.type)}
                    <span style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightMedium,
                      color: brandConfig.colors.midnightBlack,
                    }}>
                      {insight.title}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: brandConfig.spacing.xs,
                  }}>
                    {getTrendIcon(insight.trend)}
                    <span style={{
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray,
                    }}>
                      {insight.confidence}% confident
                    </span>
                  </div>
                </div>
                <p style={{
                  margin: `0 0 ${brandConfig.spacing.xs} 0`,
                  fontSize: brandConfig.typography.fontSizeSm,
                  color: brandConfig.colors.neutralGray,
                }}>
                  {insight.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontSize: brandConfig.typography.fontSizeXs,
                    color: brandConfig.colors.neutralGray,
                  }}>
                    {horses.find(h => h.id === insight.horseId)?.name} • {new Date(insight.timestamp).toLocaleDateString()}
                  </span>
                  {insight.actionable && (
                    <button style={{
                      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                      backgroundColor: 'transparent',
                      color: brandConfig.colors.stableMahogany,
                      border: `1px solid ${brandConfig.colors.stableMahogany}`,
                      borderRadius: brandConfig.layout.borderRadius,
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontFamily: brandConfig.typography.fontPrimary,
                      cursor: 'pointer',
                    }}>
                      {newDashboardEnhancements.insights.takeAction}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div>
            {horses.map(horse => (
              <div key={horse.id} style={{
                padding: brandConfig.spacing.sm,
                marginBottom: brandConfig.spacing.sm,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                backgroundColor: brandConfig.colors.barnWhite,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: brandConfig.spacing.xs,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: brandConfig.spacing.xs,
                  }}>
                    <Activity style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: brandConfig.colors.stableMahogany 
                    }} />
                    <span style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      color: brandConfig.colors.midnightBlack,
                    }}>
                      {horse.name}
                    </span>
                  </div>
                  <div style={{
                    padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: horse.healthScore >= 80 
                      ? brandConfig.colors.successGreen 
                      : horse.healthScore >= 60 
                        ? brandConfig.colors.alertAmber 
                        : brandConfig.colors.errorRed,
                    color: brandConfig.colors.barnWhite,
                    fontSize: brandConfig.typography.fontSizeXs,
                    fontWeight: brandConfig.typography.weightBold,
                  }}>
                    {horse.healthScore}%
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: brandConfig.spacing.xs,
                  marginTop: brandConfig.spacing.sm,
                }}>
                  <div style={{
                    padding: brandConfig.spacing.xs,
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: brandConfig.colors.arenaSand,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray,
                    }}>
                      {newDashboardEnhancements.insights.activity}
                    </div>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      color: brandConfig.colors.midnightBlack,
                    }}>
                      {horse.activityLevel}%
                    </div>
                  </div>
                  <div style={{
                    padding: brandConfig.spacing.xs,
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: brandConfig.colors.arenaSand,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray,
                    }}>
                      {newDashboardEnhancements.insights.mood}
                    </div>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      color: brandConfig.colors.midnightBlack,
                    }}>
                      {horse.moodScore}%
                    </div>
                  </div>
                  <div style={{
                    padding: brandConfig.spacing.xs,
                    borderRadius: brandConfig.layout.borderRadius,
                    backgroundColor: brandConfig.colors.arenaSand,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray,
                    }}>
                      {newDashboardEnhancements.insights.social}
                    </div>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      color: brandConfig.colors.midnightBlack,
                    }}>
                      {horse.socialScore}%
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: brandConfig.spacing.sm,
                  fontSize: brandConfig.typography.fontSizeXs,
                  color: brandConfig.colors.neutralGray,
                }}>
                  {newDashboardEnhancements.insights.lastUpdated}: {new Date(horse.lastActivity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Actions */}
      <div style={emergencyActionsStyle}>
        <button
          style={emergencyButtonStyle}
          onClick={() => {
            // Emergency protocol activation
            console.log('Emergency protocol activated');
            // This would integrate with the emergency service
          }}
        >
          <AlertCircle style={{ width: '16px', height: '16px' }} />
          {newDashboardEnhancements.emergencyActions.veterinarianCall}
        </button>
        
        <div style={quickActionsStyle}>
          <button
            style={quickActionButtonStyle}
            onClick={() => console.log('Auto-record all')}
          >
            {newDashboardEnhancements.emergencyActions.autoRecord}
          </button>
          <button
            style={quickActionButtonStyle}
            onClick={() => console.log('Alert all staff')}
          >
            {newDashboardEnhancements.emergencyActions.alertStaff}
          </button>
          <button
            style={quickActionButtonStyle}
            onClick={() => console.log('Send location')}
          >
            {newDashboardEnhancements.emergencyActions.sendLocation}
          </button>
          <button
            style={quickActionButtonStyle}
            onClick={() => console.log('Call backup')}
          >
            {newDashboardEnhancements.emergencyActions.callBackup}
          </button>
        </div>
      </div>
    </div>
  );
}; 