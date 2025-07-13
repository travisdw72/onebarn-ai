import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { dashboardConfig } from '../../../config/dashboardConfig';
import { ROLE_PERMISSIONS, hasPermission } from '../../../config/permissions.config';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService, ISupportTicket, ITicketStats } from '../../../services/ticketService';
import { TicketCreator } from '../../common/TicketCreator';
import { TicketSystemSummary } from '../TicketSystemSummary';
import { TicketDetailModal } from '../TicketDetailModal';

interface IEnhancedSupportStaffProps {
  className?: string;
}

interface IAISupportTicket {
  id: string;
  type: 'false_alarm' | 'training_request' | 'interpretation_help' | 'camera_setup' | 'ai_config';
  title: string;
  description: string;
  client: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  aiConfidence?: number;
}

interface ITrainingMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'interactive' | 'guide';
  category: 'ai-basics' | 'alert-interpretation' | 'camera-setup' | 'troubleshooting';
  lastUpdated: string;
  downloads: number;
  rating: number;
}

interface ISystemMetric {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description: string;
  lastUpdated: string;
}

export const EnhancedSupportStaffTab: React.FC<IEnhancedSupportStaffProps> = ({ className = '' }) => {
  const { user } = useAuth();
  
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [stats, setStats] = useState<ITicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  // Load tickets and stats on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([
        // Show ALL tickets assigned to Enhanced Support Staff OR unassigned AI support tickets
        // BUT EXCLUDE tickets that have been escalated to managers
        ticketService.getTickets({ 
          assignedTo: 'support_staff_001'
        }),
        ticketService.getTicketStats()
      ]);
      
      // Also load unassigned AI support tickets that should be auto-assigned
      const unassignedAiTickets = await ticketService.getTickets({ 
        category: ['ai_support'], 
        assignedTo: undefined 
      });
      
      // Combine and deduplicate tickets
      const allTickets = [...ticketsData, ...unassignedAiTickets];
      const uniqueTickets = allTickets.filter((ticket, index, self) => 
        index === self.findIndex(t => t.id === ticket.id)
      );
      
      // FILTER OUT ESCALATED TICKETS - tickets assigned to managers should not appear here
      const supportStaffTickets = uniqueTickets.filter(ticket => {
        // Exclude tickets assigned to managers (escalated tickets)
        const isEscalated = ticket.assignedTo === 'manager_001' || 
                           ticket.assignedTo === 'it_manager_001' ||
                           ticket.assignedToName === 'Support Manager' ||
                           ticket.assignedToName === 'Facility Manager' ||
                           ticket.assignedToName === 'IT Manager' ||
                           ticket.assignedToName?.toLowerCase().includes('manager');
        return !isEscalated;
      });
      
      setTickets(supportStaffTickets);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading ticket data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketStatusUpdate = async (ticketId: string, newStatus: ISupportTicket['status']) => {
    try {
      const updatedTicket = await ticketService.updateTicket(ticketId, { status: newStatus });
      if (updatedTicket) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        await loadData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleAddComment = async (ticketId: string, message: string) => {
    try {
      await ticketService.addComment(ticketId, {
        author: user?.email || 'Enhanced Support Staff',
        authorRole: 'support',
        message,
        isInternal: false
      });
      await loadData(); // Refresh data
    } catch (error) {
      console.error('Error adding comment:', error);
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
    // Check if ticket has been escalated (assigned to manager)
    const isEscalated = updatedTicket.assignedTo === 'manager_001' || 
                       updatedTicket.assignedTo === 'it_manager_001' ||
                       updatedTicket.assignedToName === 'Support Manager' ||
                       updatedTicket.assignedToName === 'Facility Manager' ||
                       updatedTicket.assignedToName === 'IT Manager' ||
                       updatedTicket.assignedToName?.toLowerCase().includes('manager');
    
    if (isEscalated) {
      // Remove escalated ticket from support staff view immediately
      setTickets(prev => prev.filter(t => t.id !== updatedTicket.id));
      setSelectedTicket(null);
      setShowTicketModal(false); // Close modal since ticket is no longer in our queue
    } else {
      // Update ticket normally if not escalated
      setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
      setSelectedTicket(updatedTicket);
    }
    
    loadData(); // Refresh stats
  };

  const [trainingMaterials] = useState<ITrainingMaterial[]>([
    {
      id: 'TM-001',
      title: 'Understanding AI Confidence Levels',
      type: 'video',
      category: 'ai-basics',
      lastUpdated: '2024-01-10',
      downloads: 245,
      rating: 4.8
    },
    {
      id: 'TM-002',
      title: 'Camera Setup Best Practices',
      type: 'guide',
      category: 'camera-setup',
      lastUpdated: '2024-01-12',
      downloads: 189,
      rating: 4.6
    },
    {
      id: 'TM-003',
      title: 'False Alarm Troubleshooting',
      type: 'interactive',
      category: 'troubleshooting',
      lastUpdated: '2024-01-08',
      downloads: 312,
      rating: 4.9
    }
  ]);

  const [systemMetrics] = useState<ISystemMetric[]>([
    {
      component: 'AI Health Detection',
      status: 'healthy',
      value: '98.5%',
      description: 'Accuracy rate for health anomaly detection',
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
      component: 'User Training Completion',
      status: 'healthy',
      value: '87%',
      description: 'Users completed basic AI training',
      lastUpdated: '2024-01-15T14:20:00Z'
    }
  ]);

  const containerStyle: React.CSSProperties = {
    padding: brandConfig.spacing.lg,
    backgroundColor: brandConfig.colors.arenaSand,
    borderRadius: brandConfig.layout.borderRadius,
    minHeight: '800px'
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: brandConfig.spacing.xl,
    padding: brandConfig.spacing.lg,
    backgroundColor: brandConfig.colors.milkWhite,
    borderRadius: brandConfig.layout.borderRadius,
    border: `1px solid ${brandConfig.colors.sterlingSilver}`
  };

  const headingStyle: React.CSSProperties = {
    color: brandConfig.colors.stableMahogany,
    fontSize: brandConfig.typography.fontSize2xl,
    fontWeight: brandConfig.typography.weightBold,
    marginBottom: brandConfig.spacing.md,
    fontFamily: brandConfig.typography.fontPrimary
  };

  const subHeadingStyle: React.CSSProperties = {
    color: brandConfig.colors.hunterGreen,
    fontSize: brandConfig.typography.fontSizeLg,
    fontWeight: brandConfig.typography.weightSemiBold,
    marginBottom: brandConfig.spacing.sm,
    fontFamily: brandConfig.typography.fontPrimary
  };

  const getTicketTypeIcon = (type: IAISupportTicket['type']) => {
    const icons = {
      false_alarm: '⚠️',
      training_request: '🎓',
      interpretation_help: '❓',
      camera_setup: '📹',
      ai_config: '⚙️'
    };
    return icons[type];
  };

  const getTicketTypeColor = (type: IAISupportTicket['type']) => {
    const colors = {
      false_alarm: brandConfig.colors.alertAmber,
      training_request: brandConfig.colors.championGold,
      interpretation_help: brandConfig.colors.ribbonBlue,
      camera_setup: brandConfig.colors.hunterGreen,
      ai_config: brandConfig.colors.stableMahogany
    };
    return colors[type];
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: brandConfig.colors.errorRed,
      medium: brandConfig.colors.alertAmber,
      low: brandConfig.colors.successGreen
    };
    return colors[priority];
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    const colors = {
      healthy: brandConfig.colors.successGreen,
      warning: brandConfig.colors.alertAmber,
      critical: brandConfig.colors.errorRed
    };
    return colors[status];
  };

  if (!hasPermission(user?.role || 'support', 'user_ai_training', 'provide')) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', color: brandConfig.colors.errorRed }}>
          {dashboardConfig.messages.accessDenied}
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <h1 style={headingStyle}>
        🤖 AI System Support Center
      </h1>

      {/* Quick Stats */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: brandConfig.spacing.md }}>
          <h2 style={subHeadingStyle}>📊 Support Overview</h2>
          <TicketCreator 
            defaultCategory="ai_support" 
            onTicketCreated={() => loadData()} 
          />
        </div>
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
            border: `2px solid ${brandConfig.colors.alertAmber}`
          }}>
            <h3 style={{ 
              color: brandConfig.colors.alertAmber, 
              fontSize: brandConfig.typography.fontSize2xl, 
              fontWeight: brandConfig.typography.weightBold, 
              margin: 0 
            }}>
              {tickets.filter(t => t.type === 'false_alarm').length}
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0` 
            }}>
              AI False Alerts
            </p>
          </div>

          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.championGold}`
          }}>
            <h3 style={{ 
              color: brandConfig.colors.championGold, 
              fontSize: brandConfig.typography.fontSize2xl, 
              fontWeight: brandConfig.typography.weightBold, 
              margin: 0 
            }}>
              {tickets.filter(t => t.type === 'training_request').length}
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0` 
            }}>
              Training Requests
            </p>
          </div>

          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.hunterGreen}`
          }}>
            <h3 style={{ 
              color: brandConfig.colors.hunterGreen, 
              fontSize: brandConfig.typography.fontSize2xl, 
              fontWeight: brandConfig.typography.weightBold, 
              margin: 0 
            }}>
              {tickets.filter(t => t.category === 'technical').length}
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0` 
            }}>
              Technical Issues
            </p>
          </div>

          <div style={{
            padding: brandConfig.spacing.md,
            backgroundColor: brandConfig.colors.arenaSand,
            borderRadius: brandConfig.layout.borderRadius,
            textAlign: 'center',
            border: `2px solid ${brandConfig.colors.successGreen}`
          }}>
            <h3 style={{ 
              color: brandConfig.colors.successGreen, 
              fontSize: brandConfig.typography.fontSize2xl, 
              fontWeight: brandConfig.typography.weightBold, 
              margin: 0 
            }}>
              {stats?.customerSatisfaction.toFixed(1) || '4.2'}
            </h3>
            <p style={{ 
              color: brandConfig.colors.midnightBlack, 
              fontSize: brandConfig.typography.fontSizeSm,
              margin: `${brandConfig.spacing.xs} 0 0 0` 
            }}>
              Customer Satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* Active AI Support Issues */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>🎫 Active AI Support Issues</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: brandConfig.spacing.xl }}>
            Loading tickets...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
            {tickets.map(ticket => (
            <div key={ticket.id} style={{
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius,
              border: `2px solid ${getTicketTypeColor(ticket.type)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: brandConfig.spacing.xs }}>
                  <span style={{ fontSize: brandConfig.typography.fontSizeLg, marginRight: brandConfig.spacing.xs }}>
                    {ticket.type ? getTicketTypeIcon(ticket.type) : '📋'}
                  </span>
                  <h3 style={{
                    color: brandConfig.colors.midnightBlack,
                    fontSize: brandConfig.typography.fontSizeBase,
                    fontWeight: brandConfig.typography.weightSemiBold,
                    margin: 0
                  }}>
                    {ticket.title}
                  </h3>
                  <span style={{
                    marginLeft: brandConfig.spacing.sm,
                    padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                    backgroundColor: ticket.type ? getTicketTypeColor(ticket.type) : brandConfig.colors.neutralGray,
                    color: brandConfig.colors.barnWhite,
                    borderRadius: '4px',
                    fontSize: brandConfig.typography.fontSizeXs,
                    fontWeight: brandConfig.typography.weightBold
                  }}>
                    {ticket.ticketNumber}
                  </span>
                </div>
                <p style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeSm,
                  margin: `0 0 ${brandConfig.spacing.xs} 0`
                }}>
                  {ticket.description}
                </p>
                <div style={{ display: 'flex', gap: brandConfig.spacing.sm, alignItems: 'center' }}>
                  <span style={{
                    fontSize: brandConfig.typography.fontSizeXs,
                    color: brandConfig.colors.neutralGray
                  }}>
                    Client: {ticket.clientName}
                  </span>
                  {ticket.aiMetadata?.confidence && (
                    <span style={{
                      fontSize: brandConfig.typography.fontSizeXs,
                      color: brandConfig.colors.neutralGray
                    }}>
                      AI Confidence: {ticket.aiMetadata.confidence}%
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.xs, alignItems: 'flex-end' }}>
                <span style={{
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  backgroundColor: ticket.priority === 'critical' ? brandConfig.colors.errorRed : getPriorityColor(ticket.priority as 'high' | 'medium' | 'low'),
                  color: brandConfig.colors.barnWhite,
                  borderRadius: '4px',
                  fontSize: brandConfig.typography.fontSizeXs,
                  fontWeight: brandConfig.typography.weightBold
                }}>
                  {ticket.priority.toUpperCase()}
                </span>
                <span style={{
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  backgroundColor: ticket.status === 'resolved' ? brandConfig.colors.successGreen : 
                                 ticket.status === 'in_progress' ? brandConfig.colors.ribbonBlue : brandConfig.colors.sterlingSilver,
                  color: brandConfig.colors.milkWhite,
                  borderRadius: '4px',
                  fontSize: brandConfig.typography.fontSizeXs
                }}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
                <button 
                  onClick={() => handleViewTicket(ticket)}
                  style={{
                    backgroundColor: brandConfig.colors.hunterGreen,
                    color: brandConfig.colors.barnWhite,
                    border: 'none',
                    padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                    borderRadius: brandConfig.layout.borderRadius,
                    cursor: 'pointer',
                    fontSize: brandConfig.typography.fontSizeXs
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* User Training Management */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>🎓 User AI Training Management</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: brandConfig.spacing.md 
        }}>
          {trainingMaterials.map(material => (
            <div key={material.id} style={{
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius,
              border: `1px solid ${brandConfig.colors.pastureSage}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: brandConfig.spacing.sm }}>
                <span style={{ fontSize: brandConfig.typography.fontSizeLg, marginRight: brandConfig.spacing.xs }}>
                  {material.type === 'video' ? '🎥' : 
                   material.type === 'document' ? '📄' : 
                   material.type === 'interactive' ? '💻' : '📖'}
                </span>
                <h3 style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  margin: 0
                }}>
                  {material.title}
                </h3>
              </div>
              <div style={{ marginBottom: brandConfig.spacing.sm }}>
                <span style={{
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  backgroundColor: brandConfig.colors.ribbonBlue,
                  color: brandConfig.colors.milkWhite,
                  borderRadius: '4px',
                  fontSize: brandConfig.typography.fontSizeXs
                }}>
                  {material.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: brandConfig.typography.fontSizeXs,
                color: brandConfig.colors.neutralGray,
                marginBottom: brandConfig.spacing.sm
              }}>
                <span>Downloads: {material.downloads}</span>
                <span>Rating: ⭐ {material.rating}</span>
              </div>
              <div style={{ display: 'flex', gap: brandConfig.spacing.xs }}>
                <button style={{
                  backgroundColor: brandConfig.colors.hunterGreen,
                  color: brandConfig.colors.milkWhite,
                  border: 'none',
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  cursor: 'pointer',
                  fontSize: brandConfig.typography.fontSizeXs,
                  flex: 1
                }}>
                  Edit
                </button>
                <button style={{
                  backgroundColor: brandConfig.colors.ribbonBlue,
                  color: brandConfig.colors.milkWhite,
                  border: 'none',
                  padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  cursor: 'pointer',
                  fontSize: brandConfig.typography.fontSizeXs,
                  flex: 1
                }}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Health Monitoring */}
      <section style={sectionStyle}>
        <h2 style={subHeadingStyle}>📊 AI System Health Dashboard</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: brandConfig.spacing.md 
        }}>
          {systemMetrics.map(metric => (
            <div key={metric.component} style={{
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius,
              border: `2px solid ${getStatusColor(metric.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: brandConfig.spacing.sm }}>
                <h3 style={{
                  color: brandConfig.colors.midnightBlack,
                  fontSize: brandConfig.typography.fontSizeBase,
                  fontWeight: brandConfig.typography.weightSemiBold,
                  margin: 0
                }}>
                  {metric.component}
                </h3>
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(metric.status)
                }}></span>
              </div>
              <div style={{
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold,
                color: getStatusColor(metric.status),
                marginBottom: brandConfig.spacing.xs
              }}>
                {metric.value}
              </div>
              <p style={{
                fontSize: brandConfig.typography.fontSizeSm,
                color: brandConfig.colors.midnightBlack,
                margin: `0 0 ${brandConfig.spacing.xs} 0`
              }}>
                {metric.description}
              </p>
              <div style={{
                fontSize: brandConfig.typography.fontSizeXs,
                color: brandConfig.colors.neutralGray
              }}>
                Last updated: {new Date(metric.lastUpdated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticket System Summary */}
      <TicketSystemSummary />

      {/* Ticket Detail Modal */}
      {showTicketModal && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={handleCloseModal}
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}; 