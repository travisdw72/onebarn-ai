import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService, ISupportTicket as ITicketServiceTicket } from '../../../services/ticketService';
import { TicketDetailModal } from '../../support/TicketDetailModal';

interface ISupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'facility' | 'staff' | 'client' | 'technical' | 'equipment';
  created_at: string;
  updated_at: string;
  submittedBy: string;
  assignedTo?: string;
}

interface IStaffIssue {
  id: string;
  staffMember: string;
  issueType: 'technical' | 'training' | 'equipment' | 'policy';
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export const ManagerSupportTab: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'facility-issues' | 'staff-assistance' | 'escalations'>('overview');
  const [escalatedTickets, setEscalatedTickets] = useState<ITicketServiceTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ITicketServiceTicket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facilityTickets, setFacilityTickets] = useState<ISupportTicket[]>([]);
  const [staffIssues, setStaffIssues] = useState<IStaffIssue[]>([]);
  const [facilityLoading, setFacilityLoading] = useState(false);

  // Load escalated tickets on component mount and when tab changes
  useEffect(() => {
    if (selectedTab === 'escalations') {
      loadEscalatedTickets();
    }
  }, [selectedTab]);

  // Load facility tickets and staff issues
  useEffect(() => {
    if (selectedTab === 'facility-issues' || selectedTab === 'staff-assistance') {
      loadFacilityData();
    }
  }, [selectedTab]);

  const loadEscalatedTickets = async () => {
    try {
      setLoading(true);
      // Get all tickets assigned to managers (escalated tickets)
      const allTickets = await ticketService.getTickets();
      const escalated = allTickets.filter(ticket => 
        ticket.assignedTo === 'manager_001' || 
        ticket.assignedToName === 'Support Manager' ||
        ticket.assignedToName?.toLowerCase().includes('manager')
      );
      setEscalatedTickets(escalated);
    } catch (error) {
      console.error('Error loading escalated tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFacilityData = async () => {
    try {
      setFacilityLoading(true);
      
      // Get facility-related tickets using available categories
      const allTickets = await ticketService.getTickets();
      const facilityRelatedTickets = allTickets.filter(ticket => 
        ticket.category === 'technical' || 
        ticket.category === 'general' ||
        ticket.tags.includes('facility') ||
        ticket.tags.includes('equipment') ||
        ticket.tags.includes('maintenance')
      );
      
      // Convert to the expected format for facility tickets
      const convertedFacilityTickets: ISupportTicket[] = facilityRelatedTickets.map(ticket => ({
        id: ticket.ticketNumber || ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as 'open' | 'in_progress' | 'resolved' | 'closed',
        priority: ticket.priority as 'low' | 'medium' | 'high' | 'critical',
        category: 'technical' as 'facility' | 'staff' | 'client' | 'technical' | 'equipment',
        created_at: ticket.createdAt,
        updated_at: ticket.updatedAt || ticket.createdAt,
        submittedBy: ticket.clientEmail || 'system',
        assignedTo: ticket.assignedToName || undefined
      }));
      
      setFacilityTickets(convertedFacilityTickets);
      
      // For staff issues, filter by tags and categories
      const staffRelatedTickets = allTickets.filter(ticket => 
        ticket.tags.includes('training') || 
        ticket.tags.includes('staff') ||
        ticket.description.toLowerCase().includes('staff') ||
        ticket.category === 'ai_support'
      );
      
      // Convert to staff issues format
      const convertedStaffIssues: IStaffIssue[] = staffRelatedTickets.map(ticket => ({
        id: ticket.ticketNumber || ticket.id,
        staffMember: ticket.clientName || 'Staff Member',
        issueType: 'technical' as 'technical' | 'training' | 'equipment' | 'policy',
        description: ticket.description,
        status: ticket.status === 'open' ? 'new' : ticket.status as 'new' | 'in_progress' | 'resolved',
        priority: ticket.priority as 'low' | 'medium' | 'high',
        created_at: ticket.createdAt
      }));
      
      setStaffIssues(convertedStaffIssues);
      
    } catch (error) {
      console.error('Error loading facility data:', error);
    } finally {
      setFacilityLoading(false);
    }
  };

  const handleViewEscalatedTicket = (ticket: ITicketServiceTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleCloseModal = () => {
    setShowTicketModal(false);
    setSelectedTicket(null);
  };

  const handleTicketUpdated = (updatedTicket: ITicketServiceTicket) => {
    setEscalatedTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    loadEscalatedTickets(); // Refresh the list
  };
  
  const styles = {
    container: {
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: '500px'
    },
    header: {
      marginBottom: brandConfig.spacing.lg,
      borderBottom: `2px solid ${brandConfig.colors.stableMahogany}`,
      paddingBottom: brandConfig.spacing.md
    },
    title: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.sm
    },
    subtitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.sterlingSilver,
      fontWeight: brandConfig.typography.weightMedium
    },
    tabButtons: {
      display: 'flex',
      gap: brandConfig.spacing.sm,
      marginBottom: brandConfig.spacing.lg,
      flexWrap: 'wrap' as const
    },
    tabButton: {
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
      border: `2px solid ${brandConfig.colors.stableMahogany}`,
      backgroundColor: 'transparent',
      color: brandConfig.colors.stableMahogany,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeTabButton: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.lg
    },
    metricCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      textAlign: 'center' as const
    },
    metricValue: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.xs
    },
    metricLabel: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.sterlingSilver,
      fontWeight: brandConfig.typography.weightMedium
    },
    ticketCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      marginBottom: brandConfig.spacing.md
    },
    ticketHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: brandConfig.spacing.sm
    },
    ticketTitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      color: brandConfig.colors.stableMahogany
    },
    statusChip: {
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightSemiBold,
      textTransform: 'uppercase' as const
    },
    priorityChip: {
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightSemiBold,
      textTransform: 'uppercase' as const,
      marginLeft: brandConfig.spacing.sm
    },
    ticketMeta: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.sterlingSilver,
      display: 'flex',
      gap: brandConfig.spacing.md,
      flexWrap: 'wrap' as const
    },
    actionButton: {
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.arenaSand,
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginRight: brandConfig.spacing.xs
    },
    escalationCard: {
      backgroundColor: '#FFF3CD',
      border: `2px solid ${brandConfig.colors.alertAmber}`,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.md
    },
    urgentCard: {
      backgroundColor: '#F8D7DA',
      border: `2px solid ${brandConfig.colors.errorRed}`,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.md
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': brandConfig.colors.errorRed,
      'new': brandConfig.colors.errorRed,
      'in_progress': brandConfig.colors.alertAmber,
      'resolved': brandConfig.colors.successGreen,
      'closed': brandConfig.colors.sterlingSilver
    };
    return colors[status as keyof typeof colors];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': brandConfig.colors.successGreen,
      'medium': brandConfig.colors.alertAmber,
      'high': brandConfig.colors.errorRed,
      'critical': brandConfig.colors.midnightBlack
    };
    return colors[priority as keyof typeof colors];
  };

  const renderOverview = () => (
    <div>
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {facilityTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
          </div>
          <div style={styles.metricLabel}>Active Issues</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {staffIssues.filter(i => i.status === 'new' || i.status === 'in_progress').length}
          </div>
          <div style={styles.metricLabel}>Staff Issues</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {facilityTickets.filter(t => t.priority === 'high' || t.priority === 'critical').length}
          </div>
          <div style={styles.metricLabel}>High Priority</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>3</div>
          <div style={styles.metricLabel}>Pending Escalations</div>
        </div>
      </div>

      <h3 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.md }}>
        🚨 Urgent Attention Required
      </h3>

      {facilityTickets
        .filter(ticket => ticket.priority === 'high' || ticket.priority === 'critical')
        .map(ticket => (
          <div key={ticket.id} style={styles.urgentCard}>
            <div style={styles.ticketHeader}>
              <div style={styles.ticketTitle}>{ticket.title}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{
                    ...styles.statusChip,
                    backgroundColor: getStatusColor(ticket.status),
                    color: brandConfig.colors.arenaSand
                  }}
                >
                  {ticket.status.replace('_', ' ')}
                </div>
                <div 
                  style={{
                    ...styles.priorityChip,
                    backgroundColor: getPriorityColor(ticket.priority),
                    color: brandConfig.colors.arenaSand
                  }}
                >
                  {ticket.priority}
                </div>
              </div>
            </div>
            <p style={{ 
              fontSize: brandConfig.typography.fontSizeSm,
              color: brandConfig.colors.sterlingSilver,
              marginBottom: brandConfig.spacing.sm
            }}>
              {ticket.description}
            </p>
            <div style={styles.ticketMeta}>
              <span>#{ticket.id}</span>
              <span>Category: {ticket.category}</span>
              <span>Submitted by: {ticket.submittedBy}</span>
              <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ marginTop: brandConfig.spacing.sm }}>
              <button style={styles.actionButton}>Assign</button>
              <button style={styles.actionButton}>Escalate</button>
              <button style={styles.actionButton}>View Details</button>
            </div>
          </div>
        ))}

      <h3 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.md, marginTop: brandConfig.spacing.lg }}>
        📋 Recent Staff Issues
      </h3>

      {staffIssues.slice(0, 2).map(issue => (
        <div key={issue.id} style={styles.ticketCard}>
          <div style={styles.ticketHeader}>
            <div style={styles.ticketTitle}>{issue.staffMember} - {issue.issueType}</div>
            <div 
              style={{
                ...styles.statusChip,
                backgroundColor: getStatusColor(issue.status),
                color: brandConfig.colors.arenaSand
              }}
            >
              {issue.status.replace('_', ' ')}
            </div>
          </div>
          <p style={{ 
            fontSize: brandConfig.typography.fontSizeSm,
            color: brandConfig.colors.sterlingSilver,
            marginBottom: brandConfig.spacing.sm
          }}>
            {issue.description}
          </p>
          <div style={styles.ticketMeta}>
            <span>#{issue.id}</span>
            <span>Priority: {issue.priority}</span>
            <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
          </div>
          <div style={{ marginTop: brandConfig.spacing.sm }}>
            <button style={styles.actionButton}>Assist</button>
            <button style={styles.actionButton}>Assign Tech</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFacilityIssues = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.md }}>
        Facility Support Issues
      </h3>
      
      {facilityTickets.map(ticket => (
        <div key={ticket.id} style={styles.ticketCard}>
          <div style={styles.ticketHeader}>
            <div style={styles.ticketTitle}>{ticket.title}</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{
                  ...styles.statusChip,
                  backgroundColor: getStatusColor(ticket.status),
                  color: brandConfig.colors.arenaSand
                }}
              >
                {ticket.status.replace('_', ' ')}
              </div>
              <div 
                style={{
                  ...styles.priorityChip,
                  backgroundColor: getPriorityColor(ticket.priority),
                  color: brandConfig.colors.arenaSand
                }}
              >
                {ticket.priority}
              </div>
            </div>
          </div>
          <p style={{ 
            fontSize: brandConfig.typography.fontSizeSm,
            color: brandConfig.colors.sterlingSilver,
            marginBottom: brandConfig.spacing.sm
          }}>
            {ticket.description}
          </p>
          <div style={styles.ticketMeta}>
            <span>#{ticket.id}</span>
            <span>Category: {ticket.category}</span>
            <span>Submitted by: {ticket.submittedBy}</span>
            {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
            <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
            <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
          </div>
          <div style={{ marginTop: brandConfig.spacing.sm }}>
            <button style={styles.actionButton}>Update Status</button>
            <button style={styles.actionButton}>Reassign</button>
            <button style={styles.actionButton}>Add Note</button>
            <button style={styles.actionButton}>View History</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStaffAssistance = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.md }}>
        Staff Assistance Queue
      </h3>
      
      {staffIssues.map(issue => (
        <div key={issue.id} style={styles.ticketCard}>
          <div style={styles.ticketHeader}>
            <div style={styles.ticketTitle}>
              {issue.staffMember} - {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)} Issue
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{
                  ...styles.statusChip,
                  backgroundColor: getStatusColor(issue.status),
                  color: brandConfig.colors.arenaSand
                }}
              >
                {issue.status.replace('_', ' ')}
              </div>
              <div 
                style={{
                  ...styles.priorityChip,
                  backgroundColor: getPriorityColor(issue.priority),
                  color: brandConfig.colors.arenaSand
                }}
              >
                {issue.priority}
              </div>
            </div>
          </div>
          <p style={{ 
            fontSize: brandConfig.typography.fontSizeSm,
            color: brandConfig.colors.sterlingSilver,
            marginBottom: brandConfig.spacing.sm
          }}>
            {issue.description}
          </p>
          <div style={styles.ticketMeta}>
            <span>#{issue.id}</span>
            <span>Staff Member: {issue.staffMember}</span>
            <span>Issue Type: {issue.issueType}</span>
            <span>Created: {new Date(issue.created_at).toLocaleDateString()}</span>
          </div>
          <div style={{ marginTop: brandConfig.spacing.sm }}>
            <button style={styles.actionButton}>Provide Assistance</button>
            <button style={styles.actionButton}>Escalate to IT</button>
            <button style={styles.actionButton}>Schedule Training</button>
            <button style={styles.actionButton}>Mark Resolved</button>
          </div>
        </div>
      ))}
      
      <div style={{ 
        marginTop: brandConfig.spacing.lg,
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.background,
        borderRadius: brandConfig.layout.borderRadius,
        border: `1px solid ${brandConfig.colors.sterlingSilver}33`
      }}>
        <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
          📞 Staff Support Guidelines
        </h4>
        <ul style={{ 
          fontSize: brandConfig.typography.fontSizeSm,
          color: brandConfig.colors.sterlingSilver,
          lineHeight: '1.6'
        }}>
          <li>Technical issues: Assign to IT support team within 2 hours</li>
          <li>Training questions: Schedule one-on-one session within 24 hours</li>
          <li>Equipment problems: Coordinate with maintenance team immediately</li>
          <li>Policy questions: Provide clarification or escalate to admin</li>
        </ul>
      </div>
    </div>
  );

  const renderEscalations = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: brandConfig.spacing.md }}>
        <h3 style={{ color: brandConfig.colors.stableMahogany, margin: 0 }}>
          🚨 Escalated Support Tickets
        </h3>
        <button 
          onClick={loadEscalatedTickets}
          disabled={loading}
          style={{
            ...styles.actionButton,
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: brandConfig.spacing.xl,
          color: brandConfig.colors.sterlingSilver 
        }}>
          Loading escalated tickets...
        </div>
      ) : escalatedTickets.length === 0 ? (
        <div style={{
          padding: brandConfig.spacing.xl,
          textAlign: 'center',
          backgroundColor: brandConfig.colors.background,
          borderRadius: brandConfig.layout.borderRadius,
          border: `1px solid ${brandConfig.colors.sterlingSilver}33`
        }}>
          <h4 style={{ color: brandConfig.colors.successGreen, marginBottom: brandConfig.spacing.sm }}>
            ✅ No Escalated Tickets
          </h4>
          <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
            All support tickets are being handled at the appropriate level. Great job team!
          </p>
        </div>
      ) : (
        <>
          {escalatedTickets.map(ticket => (
            <div key={ticket.id} style={{
              ...styles.escalationCard,
              backgroundColor: ticket.priority === 'critical' ? '#FFEBEE' : '#FFF3CD',
              border: `2px solid ${ticket.priority === 'critical' ? brandConfig.colors.errorRed : brandConfig.colors.alertAmber}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: brandConfig.spacing.sm }}>
                <h4 style={{ 
                  color: ticket.priority === 'critical' ? brandConfig.colors.errorRed : brandConfig.colors.alertAmber, 
                  margin: 0,
                  flex: 1
                }}>
                  {ticket.priority === 'critical' ? '🚨' : '⚠️'} {ticket.ticketNumber}: {ticket.title}
                </h4>
                <div style={{ display: 'flex', gap: brandConfig.spacing.xs }}>
                  <span style={{
                    ...styles.priorityChip,
                    backgroundColor: ticket.priority === 'critical' ? brandConfig.colors.errorRed : brandConfig.colors.alertAmber,
                    color: brandConfig.colors.barnWhite
                  }}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span style={{
                    ...styles.statusChip,
                    backgroundColor: ticket.status === 'resolved' ? brandConfig.colors.successGreen : 
                                   ticket.status === 'in_progress' ? brandConfig.colors.ribbonBlue : brandConfig.colors.sterlingSilver,
                    color: brandConfig.colors.barnWhite
                  }}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p style={{ 
                fontSize: brandConfig.typography.fontSizeSm, 
                color: brandConfig.colors.sterlingSilver,
                marginBottom: brandConfig.spacing.sm,
                lineHeight: '1.5'
              }}>
                <strong>Customer:</strong> {ticket.clientName} ({ticket.clientEmail})
                <br />
                <strong>Description:</strong> {ticket.description}
              </p>
              
              <div style={{
                fontSize: brandConfig.typography.fontSizeXs,
                color: brandConfig.colors.sterlingSilver,
                marginBottom: brandConfig.spacing.sm,
                display: 'flex',
                gap: brandConfig.spacing.md,
                flexWrap: 'wrap'
              }}>
                <span>📅 Escalated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                <span>🏷️ Category: {ticket.category.replace('_', ' ')}</span>
                <span>💬 Comments: {ticket.comments.length}</span>
                {ticket.aiMetadata?.confidence && (
                  <span>🤖 AI Confidence: {ticket.aiMetadata.confidence}%</span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: brandConfig.spacing.xs, flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleViewEscalatedTicket(ticket)}
                  style={styles.actionButton}
                >
                  📋 View Details
                </button>
                <button style={styles.actionButton}>
                  📞 Contact Customer
                </button>
                <button style={styles.actionButton}>
                  📝 Add Manager Note
                </button>
                {ticket.status !== 'resolved' && (
                  <button style={{
                    ...styles.actionButton,
                    backgroundColor: brandConfig.colors.successGreen
                  }}>
                    ✅ Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
      
      <div style={{ 
        marginTop: brandConfig.spacing.lg,
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.background,
        borderRadius: brandConfig.layout.borderRadius,
        border: `1px solid ${brandConfig.colors.sterlingSilver}33`
      }}>
        <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
          📈 Escalation Metrics
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: brandConfig.spacing.md }}>
          <div>
            <div style={{ fontSize: brandConfig.typography.fontSizeBase, fontWeight: brandConfig.typography.weightBold, color: brandConfig.colors.stableMahogany }}>
              {escalatedTickets.length}
            </div>
            <div style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
              Currently Escalated
            </div>
          </div>
          <div>
            <div style={{ fontSize: brandConfig.typography.fontSizeBase, fontWeight: brandConfig.typography.weightBold, color: brandConfig.colors.errorRed }}>
              {escalatedTickets.filter(t => t.priority === 'critical').length}
            </div>
            <div style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
              Critical Priority
            </div>
          </div>
          <div>
            <div style={{ fontSize: brandConfig.typography.fontSizeBase, fontWeight: brandConfig.typography.weightBold, color: brandConfig.colors.successGreen }}>
              {escalatedTickets.filter(t => t.status === 'resolved').length}
            </div>
            <div style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
              Resolved Today
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Facility Support Management</div>
        <div style={styles.subtitle}>
          Coordinate facility issues, staff assistance, and escalation management
        </div>
      </div>

      <div style={styles.tabButtons}>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'overview' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('overview')}
        >
          Overview
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'facility-issues' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('facility-issues')}
        >
          Facility Issues
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'staff-assistance' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('staff-assistance')}
        >
          Staff Assistance
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'escalations' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('escalations')}
        >
          Escalations
        </button>
      </div>

      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'facility-issues' && renderFacilityIssues()}
      {selectedTab === 'staff-assistance' && renderStaffAssistance()}
      {selectedTab === 'escalations' && renderEscalations()}

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