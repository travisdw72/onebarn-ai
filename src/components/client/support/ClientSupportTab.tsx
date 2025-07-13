import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../../config/brandConfig';
import { useAuth } from '../../../contexts/AuthContext';
import { ticketService, ISupportTicket } from '../../../services/ticketService';
import { ChatIntegration } from '../../support/ChatIntegration';

export const ClientSupportTab: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'my-tickets' | 'submit-ticket' | 'help'>('overview');
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as ISupportTicket['category'],
    priority: 'medium' as ISupportTicket['priority']
  });

  // Load user's tickets on component mount
  useEffect(() => {
    loadUserTickets();
  }, [user]);

  const loadUserTickets = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get tickets for the current user/client  
      const allTickets = await ticketService.getTickets();
      const userTickets = allTickets.filter(ticket => ticket.clientEmail === user.email);
      
      setTickets(userTickets);
    } catch (err) {
      console.error('Error loading user tickets:', err);
      setError('Failed to load your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
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
      borderBottom: `2px solid ${brandConfig.colors.hunterGreen}`,
      paddingBottom: brandConfig.spacing.md
    },
    title: {
      fontSize: brandConfig.typography.fontSize2xl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.hunterGreen,
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
      border: `2px solid ${brandConfig.colors.hunterGreen}`,
      backgroundColor: 'transparent',
      color: brandConfig.colors.hunterGreen,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeSm,
      fontWeight: brandConfig.typography.weightMedium,
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    activeTabButton: {
      backgroundColor: brandConfig.colors.hunterGreen,
      color: brandConfig.colors.arenaSand
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: brandConfig.spacing.lg,
      marginBottom: brandConfig.spacing.lg
    },
    statCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`
    },
    statTitle: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.sterlingSilver,
      fontWeight: brandConfig.typography.weightMedium,
      marginBottom: brandConfig.spacing.xs
    },
    statValue: {
      fontSize: brandConfig.typography.fontSizeXl,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.hunterGreen
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
      color: brandConfig.colors.hunterGreen
    },
    statusChip: {
      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeXs,
      fontWeight: brandConfig.typography.weightSemiBold,
      textTransform: 'uppercase' as const
    },
    ticketDescription: {
      fontSize: brandConfig.typography.fontSizeSm,
      color: brandConfig.colors.sterlingSilver,
      marginBottom: brandConfig.spacing.sm
    },
    ticketMeta: {
      fontSize: brandConfig.typography.fontSizeXs,
      color: brandConfig.colors.sterlingSilver,
      display: 'flex',
      gap: brandConfig.spacing.md
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
      color: brandConfig.colors.hunterGreen
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
      backgroundColor: brandConfig.colors.hunterGreen,
      color: brandConfig.colors.arenaSand,
      border: 'none',
      borderRadius: brandConfig.layout.borderRadius,
      fontSize: brandConfig.typography.fontSizeBase,
      fontWeight: brandConfig.typography.weightSemiBold,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: 'fit-content'
    },
    helpCard: {
      backgroundColor: brandConfig.colors.background,
      padding: brandConfig.spacing.md,
      borderRadius: brandConfig.layout.borderRadius,
      border: `1px solid ${brandConfig.colors.sterlingSilver}33`
    },
    loadingMessage: {
      textAlign: 'center' as const,
      padding: brandConfig.spacing.lg,
      color: brandConfig.colors.sterlingSilver
    },
    errorMessage: {
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.errorRed + '10',
      color: brandConfig.colors.errorRed,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.md,
      border: `1px solid ${brandConfig.colors.errorRed}33`
    },
    successMessage: {
      padding: brandConfig.spacing.md,
      backgroundColor: brandConfig.colors.successGreen + '10',
      color: brandConfig.colors.successGreen,
      borderRadius: brandConfig.layout.borderRadius,
      marginBottom: brandConfig.spacing.md,
      border: `1px solid ${brandConfig.colors.successGreen}33`
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
    return colors[status] || brandConfig.colors.neutralGray;
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit a ticket.');
      return;
    }

    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

              // Create the ticket using the real ticket service
        const createdTicket = await ticketService.createTicket({
          title: newTicket.title,
          description: newTicket.description,
          category: newTicket.category,
          priority: newTicket.priority,
          clientId: user.email, // Use email as client ID since no user.id
          clientName: user.email, // Use email as name since no user.name
          clientEmail: user.email,
          tags: ['client-submitted', newTicket.category]
        });

      // Reset form
      setNewTicket({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });

      // Reload user tickets to show the new one
      await loadUserTickets();

      // Switch to My Tickets tab to show the new ticket
      setSelectedTab('my-tickets');

      // Show success message
      alert(`Support ticket ${createdTicket.ticketNumber} submitted successfully!`);

    } catch (err) {
      console.error('Error submitting ticket:', err);
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div>
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <div style={styles.overviewGrid}>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Open Tickets</div>
          <div style={styles.statValue}>
            {tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'pending').length}
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statTitle}>Resolved This Month</div>
          <div style={styles.statValue}>
            {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
          </div>
        </div>
      </div>
      
      <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.md }}>
        Recent Activity
      </h3>
      
      {loading ? (
        <div style={styles.loadingMessage}>Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div style={styles.helpCard}>
          <h4 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
            No tickets found
          </h4>
          <p style={{ color: brandConfig.colors.sterlingSilver, margin: 0 }}>
            You haven't submitted any support tickets yet. Click "Submit Ticket" to get help.
          </p>
        </div>
      ) : (
        tickets.slice(0, 3).map(ticket => (
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
            <div style={styles.ticketDescription}>
              {ticket.description}
            </div>
            <div style={styles.ticketMeta}>
              <span>{ticket.ticketNumber}</span>
              <span>Priority: {ticket.priority}</span>
              <span>Category: {ticket.category}</span>
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderMyTickets = () => (
    <div>
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.md }}>
        My Support Tickets
      </h3>
      
      {loading ? (
        <div style={styles.loadingMessage}>Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div style={styles.helpCard}>
          <h4 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
            No tickets found
          </h4>
          <p style={{ color: brandConfig.colors.sterlingSilver, margin: 0 }}>
            You haven't submitted any support tickets yet. Click "Submit Ticket" to get help.
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
            <div style={styles.ticketDescription}>
              {ticket.description}
            </div>
            <div style={styles.ticketMeta}>
              <span>{ticket.ticketNumber}</span>
              <span>Priority: {ticket.priority}</span>
              <span>Category: {ticket.category}</span>
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
            </div>
            {ticket.comments && ticket.comments.length > 1 && (
              <div style={{ 
                marginTop: brandConfig.spacing.sm, 
                fontSize: brandConfig.typography.fontSizeXs, 
                color: brandConfig.colors.sterlingSilver 
              }}>
                Last comment: {ticket.comments[ticket.comments.length - 1]?.message?.substring(0, 100)}...
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderSubmitTicket = () => (
    <div>
      {error && <div style={styles.errorMessage}>{error}</div>}
      
      <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.md }}>
        Submit New Support Ticket
      </h3>
      
      <form style={styles.form} onSubmit={handleSubmitTicket}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="title">Title *</label>
          <input
            style={styles.input}
            type="text"
            id="title"
            value={newTicket.title}
            onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
            required
            placeholder="Brief description of your issue"
            disabled={loading}
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
            disabled={loading}
          >
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing Question</option>
            <option value="ai_support">AI System Support</option>
            <option value="feature_request">Feature Request</option>
            <option value="bug_report">Bug Report</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="priority">Priority</label>
          <select
            style={styles.select}
            id="priority"
            value={newTicket.priority}
            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as ISupportTicket['priority'] })}
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="description">Description *</label>
          <textarea
            style={styles.textarea}
            id="description"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            required
            placeholder="Please provide detailed information about your issue..."
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            ...styles.submitButton,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#1e3f24';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.target as HTMLButtonElement).style.backgroundColor = brandConfig.colors.hunterGreen;
            }
          }}
        >
          {loading ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );

  const renderHelp = () => (
    <div>
      <h3 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.md }}>
        Help & Resources
      </h3>
      
      <div style={styles.helpCard}>
        <h4 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
          📞 Contact Information
        </h4>
        <p style={{ color: brandConfig.colors.sterlingSilver, margin: 0 }}>
          Emergency Support: (555) 123-4567<br />
          General Support: support@onebarn.com<br />
          Business Hours: Monday-Friday, 8 AM - 6 PM EST
        </p>
      </div>
      
      <div style={{ ...styles.helpCard, marginTop: brandConfig.spacing.md }}>
        <h4 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
          🔍 Frequently Asked Questions
        </h4>
        <ul style={{ color: brandConfig.colors.sterlingSilver, lineHeight: '1.6' }}>
          <li>How do I access my horse's camera feed?</li>
          <li>What should I do if I receive an AI health alert?</li>
          <li>How do I update my billing information?</li>
          <li>How can I add additional users to my account?</li>
        </ul>
      </div>
      
      <div style={{ ...styles.helpCard, marginTop: brandConfig.spacing.md }}>
        <h4 style={{ color: brandConfig.colors.hunterGreen, marginBottom: brandConfig.spacing.sm }}>
          ⚡ Emergency Procedures
        </h4>
        <p style={{ color: brandConfig.colors.sterlingSilver, margin: 0 }}>
          For immediate horse health emergencies, contact your veterinarian directly. 
          For system emergencies that affect horse safety monitoring, call our emergency line immediately.
        </p>
      </div>
    </div>
  );

      return (
      <div style={styles.container}>
        {/* Add Chat Integration at the top */}
        <ChatIntegration 
          title="Need Immediate Help?"
          description="Get instant support with our AI assistant or connect with a live agent for personalized assistance"
          chatType="ai_with_escalation"
        />

        <div style={styles.header}>
          <div style={styles.title}>Support Center</div>
          <div style={styles.subtitle}>
            Get help with your account, submit support tickets, and access resources
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
              ...(selectedTab === 'my-tickets' ? styles.activeTabButton : {})
            }}
            onClick={() => setSelectedTab('my-tickets')}
          >
            My Tickets
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(selectedTab === 'submit-ticket' ? styles.activeTabButton : {})
            }}
            onClick={() => setSelectedTab('submit-ticket')}
          >
            Submit Ticket
          </button>
          <button
            style={{
              ...styles.tabButton,
              ...(selectedTab === 'help' ? styles.activeTabButton : {})
            }}
            onClick={() => setSelectedTab('help')}
          >
            Help & Resources
          </button>
        </div>

        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'my-tickets' && renderMyTickets()}
        {selectedTab === 'submit-ticket' && renderSubmitTicket()}
        {selectedTab === 'help' && renderHelp()}
      </div>
    );
}; 