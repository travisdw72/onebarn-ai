import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService, ISupportTicket } from '../../../services/ticketService';

interface IKnowledgeBaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  lastUpdated: string;
}

export const EmployeeSupportTab: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'submit-issue' | 'knowledge-base' | 'training'>('overview');
  
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeTickets();
  }, [user]);

  const loadEmployeeTickets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const allTickets = await ticketService.getTickets();
      const employeeTickets = allTickets.filter(ticket => 
        ticket.clientEmail === user.email || 
        ticket.assignedTo === user.email ||
        ticket.category === 'general' || 
        ticket.category === 'technical' ||
        ticket.category === 'ai_support'
      );
      
      setTickets(employeeTickets);
    } catch (err) {
      console.error('Error loading employee tickets:', err);
      setError('Failed to load your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [knowledgeBase] = useState<IKnowledgeBaseItem[]>([
    {
      id: 'KB-001',
      title: 'How to Reset Equipment Systems',
      category: 'Equipment',
      description: 'Step-by-step guide for resetting various barn equipment systems',
      lastUpdated: '2024-01-10'
    },
    {
      id: 'KB-002',
      title: 'Horse Health Emergency Procedures',
      category: 'Health & Safety',
      description: 'Critical procedures for handling horse health emergencies',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'KB-003',
      title: 'Training Documentation Best Practices',
      category: 'Training',
      description: 'Guidelines for properly documenting training sessions and progress',
      lastUpdated: '2024-01-08'
    },
    {
      id: 'KB-004',
      title: 'Software Troubleshooting Guide',
      category: 'Technical',
      description: 'Common software issues and their solutions',
      lastUpdated: '2024-01-14'
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as ISupportTicket['category'],
    priority: 'medium' as ISupportTicket['priority']
  });

  const styles = {
    container: {
      padding: brandConfig.spacing.lg,
      backgroundColor: brandConfig.colors.arenaSand,
      borderRadius: brandConfig.layout.borderRadius,
      minHeight: '500px'
    },
    header: {
      marginBottom: brandConfig.spacing.lg,
      borderBottom: `2px solid ${brandConfig.colors.ribbonBlue}`,
      paddingBottom: brandConfig.spacing.md
    },
    title: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.ribbonBlue,
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
      border: `2px solid ${brandConfig.colors.ribbonBlue}`,
      backgroundColor: 'transparent',
      color: brandConfig.colors.ribbonBlue,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeTabButton: {
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: brandConfig.spacing.md,
      marginBottom: brandConfig.spacing.lg
    },
    statCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      textAlign: 'center' as const
    },
    statValue: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.ribbonBlue,
      marginBottom: brandConfig.spacing.xs
    },
    statLabel: {
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
      color: brandConfig.colors.ribbonBlue
    },
    statusChip: {
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightSemiBold,
      textTransform: 'uppercase' as const
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.md
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: brandConfig.spacing.xs
    },
    label: {
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      color: brandConfig.colors.ribbonBlue
    },
    input: {
      padding: brandConfig.spacing.sm,
      border: `1px solid ${brandConfig.colors.sterlingSilver}66`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontFamily: brandConfig.typography.fontPrimary
    },
    textarea: {
      padding: brandConfig.spacing.sm,
      border: `1px solid ${brandConfig.colors.sterlingSilver}66`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontFamily: brandConfig.typography.fontPrimary,
      minHeight: '100px',
      resize: 'vertical' as const
    },
    select: {
      padding: brandConfig.spacing.sm,
      border: `1px solid ${brandConfig.colors.sterlingSilver}66`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontFamily: brandConfig.typography.fontPrimary,
      backgroundColor: brandConfig.colors.background
    },
    submitButton: {
      padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.lg}`,
      backgroundColor: brandConfig.colors.ribbonBlue,
      color: brandConfig.colors.arenaSand,
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      alignSelf: 'flex-start'
    },
    kbGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: brandConfig.spacing.md
    },
    kbCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    trainingGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: brandConfig.spacing.lg
    },
    trainingCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`
    },
    errorMessage: {
      color: brandConfig.colors.errorRed,
      marginBottom: brandConfig.spacing.md
    },
    loadingMessage: {
      color: brandConfig.colors.alertAmber,
      marginBottom: brandConfig.spacing.md
    },
    helpCard: {
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`,
      textAlign: 'center' as const
    }
  };

  const getStatusColor = (status: ISupportTicket['status']) => {
    const colors = {
      'open': brandConfig.colors.errorRed,
      'in_progress': brandConfig.colors.alertAmber,
      'pending': brandConfig.colors.alertAmber,
      'resolved': brandConfig.colors.successGreen,
      'closed': brandConfig.colors.sterlingSilver
    };
    return colors[status];
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to submit a ticket');
      return;
    }

    try {
      setLoading(true);
      
      await ticketService.createTicket({
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        clientEmail: user.email,
        clientName: user.email,
        status: 'open',
        tags: ['employee_dashboard']
      });

      setNewTicket({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });

      await loadEmployeeTickets();
      
      alert('Support ticket submitted successfully!');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div>
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
          </div>
          <div style={styles.statLabel}>Open Issues</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {tickets.filter(t => t.status === 'resolved').length}
          </div>
          <div style={styles.statLabel}>Resolved</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{knowledgeBase.length}</div>
          <div style={styles.statLabel}>KB Articles</div>
        </div>
      </div>

      <h3 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.md }}>
        Recent Support Activity
      </h3>

      {loading ? (
        <div style={styles.loadingMessage}>Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div style={styles.helpCard}>
          <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
            No tickets found
          </h4>
          <p style={{ color: brandConfig.colors.sterlingSilver, margin: 0 }}>
            You haven't submitted any support tickets yet. Click "Submit Issue" to get help.
          </p>
        </div>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} style={styles.ticketCard}>
            <div style={styles.ticketHeader}>
              <div style={styles.ticketTitle}>{ticket.title}</div>
              <div 
                style={{
                  ...styles.statusChip,
                  backgroundColor: getStatusColor(ticket.status),
                  color: brandConfig.colors.arenaSand
                }}
              >
                {ticket.status.replace('_', ' ')}
              </div>
            </div>
            <p style={{ 
              fontSize: brandConfig.typography.fontSizeSm,
              color: brandConfig.colors.sterlingSilver,
              marginBottom: brandConfig.spacing.sm
            }}>
              {ticket.description}
            </p>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeXs,
              color: brandConfig.colors.sterlingSilver,
              display: 'flex',
              gap: brandConfig.spacing.md
            }}>
              <span>{ticket.ticketNumber}</span>
              <span>Category: {ticket.category}</span>
              <span>Priority: {ticket.priority}</span>
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderSubmitIssue = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.md }}>
        Submit Technical Issue
      </h3>
      
      <form style={styles.form} onSubmit={handleSubmitTicket}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="title">Issue Title *</label>
          <input
            style={styles.input}
            type="text"
            id="title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            required
            placeholder="Brief description of the issue"
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="category">Category *</label>
          <select
            style={styles.select}
            id="category"
            value={newTicket.category}
            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as ISupportTicket['category'] })}
            required
          >
            <option value="general">General Support</option>
            <option value="technical">Technical Issue</option>
            <option value="software">Software Problem</option>
            <option value="equipment">Equipment Malfunction</option>
            <option value="training">Training Question</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="priority">Priority Level</label>
          <select
            style={styles.select}
            id="priority"
            value={newTicket.priority}
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as ISupportTicket['priority'] })}
          >
            <option value="low">Low - General question or minor issue</option>
            <option value="medium">Medium - Affects work but has workaround</option>
            <option value="high">High - Blocks work or urgent safety concern</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="description">Detailed Description *</label>
          <textarea
            style={styles.textarea}
            id="description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            required
            placeholder="Please provide detailed information about the issue, including steps to reproduce if applicable..."
          />
        </div>
        
        <button 
          type="submit" 
          style={styles.submitButton}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = '#2c5f8a';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = brandConfig.colors.ribbonBlue;
          }}
        >
          Submit Issue
        </button>
      </form>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.md }}>
        Knowledge Base
      </h3>
      
      <div style={styles.kbGrid}>
        {knowledgeBase.map(item => (
          <div 
            key={item.id} 
            style={styles.kbCard}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = brandConfig.colors.ribbonBlue;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = `${brandConfig.colors.sterlingSilver}33`;
            }}
            onClick={() => {
              // Navigate to knowledge base article
              console.log('Opening KB article:', item.id);
            }}
          >
            <h4 style={{ 
              color: brandConfig.colors.ribbonBlue, 
              marginBottom: brandConfig.spacing.xs,
              fontSize: brandConfig.typography.fontSizeBase,
              fontWeight: brandConfig.typography.weightSemiBold
            }}>
              {item.title}
            </h4>
            <p style={{ 
              fontSize: brandConfig.typography.fontSizeSm,
              color: brandConfig.colors.sterlingSilver,
              marginBottom: brandConfig.spacing.sm
            }}>
              {item.description}
            </p>
            <div style={{ 
              fontSize: brandConfig.typography.fontSizeXs,
              color: brandConfig.colors.sterlingSilver,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Category: {item.category}</span>
              <span>Updated: {item.lastUpdated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTraining = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.md }}>
        Training Resources
      </h3>
      
      <div style={styles.trainingGrid}>
        <div style={styles.trainingCard}>
          <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
            🎓 New Employee Orientation
          </h4>
          <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
            Complete orientation modules for new team members, covering safety protocols, systems usage, and barn procedures.
          </p>
        </div>
        
        <div style={styles.trainingCard}>
          <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
            🐎 Horse Care Certification
          </h4>
          <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
            Advanced horse care training modules including health monitoring, nutrition, and emergency procedures.
          </p>
        </div>
        
        <div style={styles.trainingCard}>
          <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
            💻 Software Training
          </h4>
          <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
            Learn to use our management software, reporting tools, and mobile applications effectively.
          </p>
        </div>
        
        <div style={styles.trainingCard}>
          <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
            🚨 Safety & Emergency Response
          </h4>
          <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
            Critical safety training including emergency procedures, first aid, and incident reporting.
          </p>
        </div>
      </div>
      
      <div style={{ 
        marginTop: brandConfig.spacing.lg,
        padding: brandConfig.spacing.md,
        backgroundColor: brandConfig.colors.background,
        borderRadius: brandConfig.layout.borderRadius,
        border: `1px solid ${brandConfig.colors.sterlingSilver}33`
      }}>
        <h4 style={{ color: brandConfig.colors.ribbonBlue, marginBottom: brandConfig.spacing.sm }}>
          📚 Continuing Education
        </h4>
        <p style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.sterlingSilver }}>
          Stay up-to-date with the latest training modules, certifications, and skill development opportunities.
          New content is added monthly based on industry best practices and regulatory requirements.
        </p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>IT Support Center</div>
        <div style={styles.subtitle}>
          Technical support, knowledge base, and training resources for staff
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
            ...(selectedTab === 'submit-issue' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('submit-issue')}
        >
          Submit Issue
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'knowledge-base' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('knowledge-base')}
        >
          Knowledge Base
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(selectedTab === 'training' ? styles.activeTabButton : {})
          }}
          onClick={() => setSelectedTab('training')}
        >
          Training
        </button>
      </div>

      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'submit-issue' && renderSubmitIssue()}
      {selectedTab === 'knowledge-base' && renderKnowledgeBase()}
      {selectedTab === 'training' && renderTraining()}
    </div>
  );
}; 