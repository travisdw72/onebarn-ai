import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/dashboardConfig';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService, ISupportTicket, ITicketStats } from '../../../services/ticketService';
import { TicketDetailModal } from '../../support/TicketDetailModal';

interface IITManagerTabProps {
  className?: string;
}

interface ISystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description: string;
  lastUpdated: string;
}

interface ITechnicalMetric {
  metric: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

export const ITManagerTab: React.FC<IITManagerTabProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [stats, setStats] = useState<ITicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Load escalated technical tickets
  useEffect(() => {
    loadTechnicalTickets();
  }, []);

  const loadTechnicalTickets = async () => {
    try {
      setLoading(true);
      
      // Load tickets assigned to IT Manager (escalated technical tickets)
      const escalatedTickets = await ticketService.getTickets({ 
        assignedTo: 'it_manager_001'
      });
      
      // Also load unassigned technical tickets that should be auto-assigned
      const unassignedTechnical = await ticketService.getTickets({ 
        category: ['ai_support', 'technical'], 
        assignedTo: undefined 
      });
      
      // Combine and deduplicate
      const allTechnicalTickets = [...escalatedTickets, ...unassignedTechnical];
      const uniqueTickets = allTechnicalTickets.filter((ticket, index, self) => 
        index === self.findIndex(t => t.id === ticket.id)
      );
      
      setTickets(uniqueTickets);
      
      // Generate IT-specific stats
      const itStats = await ticketService.getTicketStats();
      setStats(itStats);
      
    } catch (error) {
      console.error('Error loading technical tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket: ISupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleCloseModal = () => {
    setShowTicketModal(false);
    setSelectedTicket(null);
  };

  const handleTicketUpdated = (updatedTicket: ISupportTicket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    loadTechnicalTickets(); // Refresh data
  };

  const [systemHealth] = useState<ISystemHealth[]>([
    {
      component: 'AI Processing Engine',
      status: 'healthy',
      value: '99.2%',
      description: 'AI inference engine uptime',
      lastUpdated: '2024-01-15T14:30:00Z'
    },
    {
      component: 'Camera Network',
      status: 'warning',
      value: '94.2%',
      description: '2 cameras offline for maintenance',
      lastUpdated: '2024-01-15T14:25:00Z'
    },
    {
      component: 'Database Performance',
      status: 'healthy',
      value: '12ms',
      description: 'Average query response time',
      lastUpdated: '2024-01-15T14:28:00Z'
    },
    {
      component: 'Storage Capacity',
      status: 'warning',
      value: '78%',
      description: 'Video storage utilization',
      lastUpdated: '2024-01-15T14:20:00Z'
    }
  ]);

  const [technicalMetrics] = useState<ITechnicalMetric[]>([
    {
      metric: 'AI Accuracy',
      current: 98.5,
      target: 95.0,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      metric: 'False Positive Rate',
      current: 2.1,
      target: 5.0,
      unit: '%',
      trend: 'down',
      status: 'good'
    },
    {
      metric: 'System Response Time',
      current: 145,
      target: 200,
      unit: 'ms',
      trend: 'stable',
      status: 'good'
    },
    {
      metric: 'Camera Uptime',
      current: 94.2,
      target: 98.0,
      unit: '%',
      trend: 'down',
      status: 'warning'
    }
  ]);

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return brandConfig.colors.hunterGreen;
      case 'warning': return brandConfig.colors.goldenStraw;
      case 'critical': return brandConfig.colors.alertRed;
      default: return brandConfig.colors.charcoalGray;
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '❓';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getMetricStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good': return brandConfig.colors.hunterGreen;
      case 'warning': return brandConfig.colors.goldenStraw;
      case 'critical': return brandConfig.colors.alertRed;
      default: return brandConfig.colors.charcoalGray;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return brandConfig.colors.alertRed;
      case 'high': return brandConfig.colors.goldenStraw;
      case 'medium': return brandConfig.colors.skyBlue;
      case 'low': return brandConfig.colors.hunterGreen;
      default: return brandConfig.colors.charcoalGray;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨 CRITICAL';
      case 'high': return '⬆️ HIGH';
      case 'medium': return '➡️ MEDIUM';
      case 'low': return '⬇️ LOW';
      default: return priority;
    }
  };

  const escalatedTickets = tickets.filter(t => 
    t.assignedTo === 'it_manager_001' || 
    t.assignedToName === 'IT Manager'
  );

  const criticalTickets = escalatedTickets.filter(t => t.priority === 'critical');
  const todayResolved = escalatedTickets.filter(t => 
    t.status === 'resolved' && 
    new Date(t.updatedAt || t.createdAt).toDateString() === new Date().toDateString()
  );

  if (loading) {
    return (
      <div style={{ 
        padding: brandConfig.spacing.xl,
        textAlign: 'center',
        color: brandConfig.colors.charcoalGray
      }}>
        Loading IT Manager Dashboard...
      </div>
    );
  }

  return (
    <div className={`it-manager-tab ${className}`} style={{
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: brandConfig.spacing.xl,
        padding: brandConfig.spacing.lg,
        backgroundColor: brandConfig.colors.pureWhite,
        borderRadius: brandConfig.layout.borderRadius,
        boxShadow: brandConfig.effects.cardShadow
      }}>
        <h2 style={{
          margin: 0,
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSize2xl,
          fontWeight: brandConfig.typography.weightBold,
          display: 'flex',
          alignItems: 'center',
          gap: brandConfig.spacing.md
        }}>
          🔧 IT Manager Dashboard
          <span style={{
            fontSize: brandConfig.typography.fontSizeBase,
            fontWeight: brandConfig.typography.weightNormal,
            color: brandConfig.colors.charcoalGray,
            backgroundColor: brandConfig.colors.arenaSand,
            padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
            borderRadius: brandConfig.layout.borderRadiusSmall
          }}>
            Technical Infrastructure & Escalated Support
          </span>
        </h2>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: brandConfig.spacing.lg,
        marginBottom: brandConfig.spacing.xl
      }}>
        <div style={{
          backgroundColor: brandConfig.colors.pureWhite,
          padding: brandConfig.spacing.lg,
          borderRadius: brandConfig.layout.borderRadius,
          boxShadow: brandConfig.effects.cardShadow,
          borderLeft: `4px solid ${brandConfig.colors.alertRed}`
        }}>
          <h3 style={{ margin: 0, color: brandConfig.colors.alertRed, fontSize: brandConfig.typography.fontSizeLg }}>
            🚨 Critical Escalations
          </h3>
          <p style={{ margin: `${brandConfig.spacing.sm} 0 0 0`, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
            {criticalTickets.length}
          </p>
        </div>

        <div style={{
          backgroundColor: brandConfig.colors.pureWhite,
          padding: brandConfig.spacing.lg,
          borderRadius: brandConfig.layout.borderRadius,
          boxShadow: brandConfig.effects.cardShadow,
          borderLeft: `4px solid ${brandConfig.colors.goldenStraw}`
        }}>
          <h3 style={{ margin: 0, color: brandConfig.colors.goldenStraw, fontSize: brandConfig.typography.fontSizeLg }}>
            📋 Total Escalated
          </h3>
          <p style={{ margin: `${brandConfig.spacing.sm} 0 0 0`, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
            {escalatedTickets.length}
          </p>
        </div>

        <div style={{
          backgroundColor: brandConfig.colors.pureWhite,
          padding: brandConfig.spacing.lg,
          borderRadius: brandConfig.layout.borderRadius,
          boxShadow: brandConfig.effects.cardShadow,
          borderLeft: `4px solid ${brandConfig.colors.hunterGreen}`
        }}>
          <h3 style={{ margin: 0, color: brandConfig.colors.hunterGreen, fontSize: brandConfig.typography.fontSizeLg }}>
            ✅ Resolved Today
          </h3>
          <p style={{ margin: `${brandConfig.spacing.sm} 0 0 0`, fontSize: brandConfig.typography.fontSize2xl, fontWeight: brandConfig.typography.weightBold }}>
            {todayResolved.length}
          </p>
        </div>
      </div>

      {/* System Health Overview */}
      <div style={{
        backgroundColor: brandConfig.colors.pureWhite,
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        boxShadow: brandConfig.effects.cardShadow,
        marginBottom: brandConfig.spacing.xl
      }}>
        <h3 style={{
          margin: `0 0 ${brandConfig.spacing.lg} 0`,
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightBold
        }}>
          🖥️ System Health Overview
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: brandConfig.spacing.md
        }}>
          {systemHealth.map((system, index) => (
            <div key={index} style={{
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadiusSmall,
              border: `1px solid ${getStatusColor(system.status)}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: brandConfig.spacing.sm
              }}>
                <span style={{
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.charcoalGray
                }}>
                  {system.component}
                </span>
                <span style={{ fontSize: brandConfig.typography.fontSizeLg }}>
                  {getStatusIcon(system.status)}
                </span>
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: getStatusColor(system.status),
                marginBottom: brandConfig.spacing.xs
              }}>
                {system.value}
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.charcoalGray
              }}>
                {system.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Metrics */}
      <div style={{
        backgroundColor: brandConfig.colors.pureWhite,
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        boxShadow: brandConfig.effects.cardShadow,
        marginBottom: brandConfig.spacing.xl
      }}>
        <h3 style={{
          margin: `0 0 ${brandConfig.spacing.lg} 0`,
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightBold
        }}>
          📊 Technical Performance Metrics
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: brandConfig.spacing.md
        }}>
          {technicalMetrics.map((metric, index) => (
            <div key={index} style={{
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadiusSmall,
              border: `1px solid ${getMetricStatusColor(metric.status)}`
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: brandConfig.spacing.sm
              }}>
                <span style={{
                  fontWeight: brandConfig.typography.weightSemiBold,
                  color: brandConfig.colors.charcoalGray
                }}>
                  {metric.metric}
                </span>
                <span style={{ fontSize: brandConfig.typography.fontSizeLg }}>
                  {getTrendIcon(metric.trend)}
                </span>
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSizeXl,
                fontWeight: brandConfig.typography.weightBold,
                color: getMetricStatusColor(metric.status),
                marginBottom: brandConfig.spacing.xs
              }}>
                {metric.current}{metric.unit}
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.charcoalGray
              }}>
                Target: {metric.target}{metric.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalated Technical Tickets */}
      <div style={{
        backgroundColor: brandConfig.colors.pureWhite,
        padding: brandConfig.spacing.lg,
        borderRadius: brandConfig.layout.borderRadius,
        boxShadow: brandConfig.effects.cardShadow
      }}>
        <h3 style={{
          margin: `0 0 ${brandConfig.spacing.lg} 0`,
          color: brandConfig.colors.stableMahogany,
          fontSize: brandConfig.typography.fontSizeXl,
          fontWeight: brandConfig.typography.weightBold
        }}>
          🎫 Escalated Technical Tickets ({escalatedTickets.length})
        </h3>

        {escalatedTickets.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: brandConfig.spacing.xl,
            color: brandConfig.colors.charcoalGray
          }}>
            <div style={{ fontSize: '3rem', marginBottom: brandConfig.spacing.md }}>🎉</div>
            <h4 style={{ margin: 0, color: brandConfig.colors.hunterGreen }}>
              No Escalated Technical Issues!
            </h4>
            <p style={{ margin: `${brandConfig.spacing.sm} 0 0 0` }}>
              All technical tickets are being handled at the support level.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
            {escalatedTickets.map((ticket) => (
              <div
                key={ticket.id}
                style={{
                  padding: brandConfig.spacing.md,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: brandConfig.layout.borderRadiusSmall,
                  border: `2px solid ${getPriorityColor(ticket.priority)}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleViewTicket(ticket)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = brandConfig.effects.cardShadowHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: brandConfig.spacing.sm
                }}>
                  <div>
                    <h4 style={{
                      margin: 0,
                      color: brandConfig.colors.stableMahogany,
                      fontSize: brandConfig.typography.fontSizeLg,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}>
                      {ticket.title}
                    </h4>
                    <p style={{
                      margin: `${brandConfig.spacing.xs} 0 0 0`,
                      color: brandConfig.colors.charcoalGray,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}>
                      {ticket.id} • {ticket.customerName} • {ticket.category}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                      backgroundColor: getPriorityColor(ticket.priority),
                      color: brandConfig.colors.pureWhite,
                      borderRadius: brandConfig.layout.borderRadiusSmall,
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold,
                      marginBottom: brandConfig.spacing.xs
                    }}>
                      {getPriorityBadge(ticket.priority)}
                    </span>
                    <div style={{
                      fontSize: brandConfig.typography.fontSizeSm,
                      color: brandConfig.colors.charcoalGray
                    }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p style={{
                  margin: 0,
                  color: brandConfig.colors.charcoalGray,
                  fontSize: brandConfig.typography.fontSizeBase,
                  lineHeight: 1.4
                }}>
                  {ticket.description.substring(0, 150)}
                  {ticket.description.length > 150 ? '...' : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={handleCloseModal}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}; 