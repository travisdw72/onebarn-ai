// Ticket Detail Modal - Full ticket management interface
// Provides complete ticket lifecycle management like a production support system

import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useTickets } from '../../hooks/useTickets';
import { ISupportTicket, ITicketComment, ticketService } from '../../services/ticketService';
import { customerService, ICustomer } from '../../services/customerService';
import { useAuth } from '../../contexts/AuthContext';

interface ITicketDetailModalProps {
  ticket: ISupportTicket | null;
  onClose: () => void;
  onTicketUpdated?: (ticket: ISupportTicket) => void;
}

export const TicketDetailModal: React.FC<ITicketDetailModalProps> = ({
  ticket,
  onClose,
  onTicketUpdated
}) => {
  const { user } = useAuth();
  const { updateTicket, addComment, loading } = useTickets();
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history'>('details');
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'public' | 'internal'>('public');
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPriority, setEditingPriority] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(false);

  // Load customer data and refresh ticket when ticket changes
  useEffect(() => {
    if (ticket?.clientId) {
      loadCustomer();
      refreshTicketData();
    }
  }, [ticket?.clientId]);

  const refreshTicketData = async () => {
    if (!ticket?.id) return;
    try {
      const refreshedTicket = await ticketService.getTicket(ticket.id);
      if (refreshedTicket) {
        onTicketUpdated?.(refreshedTicket);
      }
    } catch (error) {
      console.error('Error refreshing ticket data:', error);
    }
  };

  const loadCustomer = async () => {
    if (!ticket?.clientId) return;
    try {
      const customerData = await customerService.getCustomer(ticket.clientId);
      setCustomer(customerData);
    } catch (error) {
      console.error('Error loading customer:', error);
    }
  };

  const handleStatusUpdate = async (newStatus: ISupportTicket['status']) => {
    if (!ticket) return;
    try {
      const updatedTicket = await updateTicket(ticket.id, { status: newStatus });
      if (updatedTicket) {
        onTicketUpdated?.(updatedTicket);
        setEditingStatus(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityUpdate = async (newPriority: ISupportTicket['priority']) => {
    if (!ticket) return;
    try {
      const updatedTicket = await updateTicket(ticket.id, { priority: newPriority });
      if (updatedTicket) {
        onTicketUpdated?.(updatedTicket);
        setEditingPriority(false);
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleAddComment = async () => {
    if (!ticket || !newComment.trim()) return;
    try {
      await addComment(
        ticket.id,
        user?.email || 'Enhanced Support Staff',
        'support',
        newComment,
        commentType === 'internal'
      );
      setNewComment('');
      
      // Refresh the ticket data to show the new comment immediately
      const refreshedTicket = await ticketService.getTicket(ticket.id);
      if (refreshedTicket) {
        onTicketUpdated?.(refreshedTicket);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEscalateTicket = async () => {
    if (!ticket) return;
    try {
      const escalatedPriority = ticket.priority === 'low' ? 'medium' :
                               ticket.priority === 'medium' ? 'high' :
                               ticket.priority === 'high' ? 'critical' : 'critical';
      
      // Determine escalation target based on ticket category/type
      let escalationTarget = {
        assignedTo: 'manager_001',
        assignedToName: 'Facility Manager'
      };

      // Technical/AI tickets go to IT Manager
      if (ticket.category === 'ai_support' || 
          ticket.category === 'technical' || 
          ticket.type === 'camera_setup' || 
          ticket.type === 'ai_config') {
        escalationTarget = {
          assignedTo: 'it_manager_001',
          assignedToName: 'IT Manager'
        };
      }
      
      // Update priority and add escalation comment
      const updatedTicket = await updateTicket(ticket.id, { 
        priority: escalatedPriority,
        assignedTo: escalationTarget.assignedTo,
        assignedToName: escalationTarget.assignedToName
      });
      
      if (updatedTicket) {
        // Add escalation comment
        await addComment(
          ticket.id,
          user?.email || 'Enhanced Support Staff',
          'support',
          `🚨 ESCALATED: Ticket escalated from ${ticket.priority} to ${escalatedPriority} priority and assigned to ${escalationTarget.assignedToName} for immediate attention.`,
          true // Internal comment
        );
        
        // Refresh the ticket data
        const refreshedTicket = await ticketService.getTicket(ticket.id);
        if (refreshedTicket) {
          onTicketUpdated?.(refreshedTicket);
        }
      }
    } catch (error) {
      console.error('Error escalating ticket:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: ISupportTicket['status']) => {
    const colors = {
      open: brandConfig.colors.ribbonBlue,
      in_progress: brandConfig.colors.alertAmber,
      pending: brandConfig.colors.championGold,
      resolved: brandConfig.colors.successGreen,
      closed: brandConfig.colors.neutralGray
    };
    return colors[status];
  };

  const getPriorityColor = (priority: ISupportTicket['priority']) => {
    const colors = {
      critical: brandConfig.colors.errorRed,
      high: brandConfig.colors.alertAmber,
      medium: brandConfig.colors.championGold,
      low: brandConfig.colors.successGreen
    };
    return colors[priority];
  };

  if (!ticket) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: brandConfig.spacing.md
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: brandConfig.colors.barnWhite,
    borderRadius: brandConfig.layout.borderRadius,
    width: '90%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  };

  const headerStyle: React.CSSProperties = {
    padding: brandConfig.spacing.lg,
    borderBottom: `2px solid ${brandConfig.colors.arenaSand}`,
    backgroundColor: brandConfig.colors.arenaSand
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
    border: 'none',
    backgroundColor: isActive ? brandConfig.colors.barnWhite : brandConfig.colors.sterlingSilver,
    color: isActive ? brandConfig.colors.stableMahogany : brandConfig.colors.neutralGray,
    cursor: 'pointer',
    borderRadius: `${brandConfig.layout.borderRadius} ${brandConfig.layout.borderRadius} 0 0`,
    marginRight: brandConfig.spacing.xs,
    fontWeight: isActive ? brandConfig.typography.weightBold : brandConfig.typography.weightNormal
  });

  const contentAreaStyle: React.CSSProperties = {
    padding: brandConfig.spacing.lg
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.md, marginBottom: brandConfig.spacing.sm }}>
                <h2 style={{
                  fontSize: brandConfig.typography.fontSizeXl,
                  fontWeight: brandConfig.typography.weightBold,
                  color: brandConfig.colors.stableMahogany,
                  margin: 0
                }}>
                  {ticket.ticketNumber}
                </h2>
                <div style={{ display: 'flex', gap: brandConfig.spacing.sm }}>
                  {/* Status Badge */}
                  {editingStatus ? (
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusUpdate(e.target.value as ISupportTicket['status'])}
                      onBlur={() => setEditingStatus(false)}
                      autoFocus
                      style={{
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        borderRadius: brandConfig.layout.borderRadius,
                        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                        fontSize: brandConfig.typography.fontSizeSm
                      }}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingStatus(true)}
                      style={{
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        backgroundColor: getStatusColor(ticket.status),
                        color: brandConfig.colors.barnWhite,
                        borderRadius: brandConfig.layout.borderRadius,
                        fontSize: brandConfig.typography.fontSizeSm,
                        fontWeight: brandConfig.typography.weightBold,
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  )}

                  {/* Priority Badge */}
                  {editingPriority ? (
                    <select
                      value={ticket.priority}
                      onChange={(e) => handlePriorityUpdate(e.target.value as ISupportTicket['priority'])}
                      onBlur={() => setEditingPriority(false)}
                      autoFocus
                      style={{
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        borderRadius: brandConfig.layout.borderRadius,
                        border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                        fontSize: brandConfig.typography.fontSizeSm
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingPriority(true)}
                      style={{
                        padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                        backgroundColor: getPriorityColor(ticket.priority),
                        color: brandConfig.colors.barnWhite,
                        borderRadius: brandConfig.layout.borderRadius,
                        fontSize: brandConfig.typography.fontSizeSm,
                        fontWeight: brandConfig.typography.weightBold,
                        cursor: 'pointer',
                        textTransform: 'uppercase'
                      }}
                    >
                      {ticket.priority === 'critical' ? '🚨 CRITICAL' : ticket.priority.toUpperCase()}
                    </span>
                  )}

                  {/* Escalation Indicator */}
                  {ticket.assignedToName === 'Support Manager' && (
                    <span style={{
                      padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                      backgroundColor: brandConfig.colors.errorRed,
                      color: brandConfig.colors.barnWhite,
                      borderRadius: brandConfig.layout.borderRadius,
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontWeight: brandConfig.typography.weightBold,
                      animation: 'pulse 2s infinite'
                    }}>
                      ⬆️ ESCALATED
                    </span>
                  )}
                </div>
              </div>
              <h3 style={{
                fontSize: brandConfig.typography.fontSizeLg,
                color: brandConfig.colors.midnightBlack,
                margin: 0,
                fontWeight: brandConfig.typography.weightNormal
              }}>
                {ticket.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: brandConfig.typography.fontSizeXl,
                color: brandConfig.colors.neutralGray,
                cursor: 'pointer',
                padding: brandConfig.spacing.xs
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: `0 ${brandConfig.spacing.lg}`, backgroundColor: brandConfig.colors.arenaSand }}>
          <div style={{ display: 'flex' }}>
            {(['details', 'comments', 'history'] as const).map((tab) => (
              <button
                key={tab}
                style={tabStyle(activeTab === tab)}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'details' && '📋 Details'}
                {tab === 'comments' && `💬 Comments (${ticket.comments.length})`}
                {tab === 'history' && '📜 History'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {activeTab === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: brandConfig.spacing.lg }}>
              {/* Main Details */}
              <div>
                <div style={{ marginBottom: brandConfig.spacing.lg }}>
                  <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                    Description
                  </h4>
                  <p style={{
                    padding: brandConfig.spacing.md,
                    backgroundColor: brandConfig.colors.arenaSand,
                    borderRadius: brandConfig.layout.borderRadius,
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {ticket.description}
                  </p>
                </div>

                {ticket.aiMetadata && (
                  <div style={{ marginBottom: brandConfig.spacing.lg }}>
                    <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                      AI Analysis Data
                    </h4>
                    <div style={{
                      padding: brandConfig.spacing.md,
                      backgroundColor: brandConfig.colors.arenaSand,
                      borderRadius: brandConfig.layout.borderRadius,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}>
                      {ticket.aiMetadata.confidence && (
                        <p><strong>Confidence Level:</strong> {ticket.aiMetadata.confidence}%</p>
                      )}
                      {ticket.aiMetadata.alertId && (
                        <p><strong>Alert ID:</strong> {ticket.aiMetadata.alertId}</p>
                      )}
                      {ticket.aiMetadata.cameraId && (
                        <p><strong>Camera ID:</strong> {ticket.aiMetadata.cameraId}</p>
                      )}
                      {ticket.aiMetadata.falseAlarmType && (
                        <p><strong>False Alarm Type:</strong> {ticket.aiMetadata.falseAlarmType}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                    Tags
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: brandConfig.spacing.xs }}>
                    {ticket.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          padding: `${brandConfig.spacing.xs} ${brandConfig.spacing.sm}`,
                          backgroundColor: brandConfig.colors.pastureSage,
                          color: brandConfig.colors.barnWhite,
                          borderRadius: brandConfig.layout.borderRadius,
                          fontSize: brandConfig.typography.fontSizeXs
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div>
                {/* Customer Info */}
                <div style={{
                  marginBottom: brandConfig.spacing.lg,
                  padding: brandConfig.spacing.md,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: brandConfig.layout.borderRadius
                }}>
                  <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                    Customer
                  </h4>
                  <div style={{ fontSize: brandConfig.typography.fontSizeSm }}>
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0`, fontWeight: brandConfig.typography.weightBold }}>
                      {ticket.clientName}
                    </p>
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0`, color: brandConfig.colors.neutralGray }}>
                      {ticket.clientEmail}
                    </p>
                    {customer && (
                      <>
                        {customer.organization && (
                          <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                            <strong>Organization:</strong> {customer.organization}
                          </p>
                        )}
                        <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                          <strong>Type:</strong> {customer.type.replace('_', ' ')}
                        </p>
                        <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                          <strong>Support Tier:</strong> {customer.supportTier}
                        </p>
                        {customer.metadata.horseCount && (
                          <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                            <strong>Horses:</strong> {customer.metadata.horseCount}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Ticket Info */}
                <div style={{
                  marginBottom: brandConfig.spacing.lg,
                  padding: brandConfig.spacing.md,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: brandConfig.layout.borderRadius
                }}>
                  <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                    Ticket Information
                  </h4>
                  <div style={{ fontSize: brandConfig.typography.fontSizeSm }}>
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                      <strong>Created:</strong> {formatDate(ticket.createdAt)}
                    </p>
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                      <strong>Updated:</strong> {formatDate(ticket.updatedAt)}
                    </p>
                    {ticket.resolvedAt && (
                      <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                        <strong>Resolved:</strong> {formatDate(ticket.resolvedAt)}
                      </p>
                    )}
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                      <strong>Category:</strong> {ticket.category.replace('_', ' ')}
                    </p>
                    {ticket.type && (
                      <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                        <strong>Type:</strong> {ticket.type.replace('_', ' ')}
                      </p>
                    )}
                    <p style={{ margin: `0 0 ${brandConfig.spacing.xs} 0` }}>
                      <strong>Assigned to:</strong> {ticket.assignedToName || 'Unassigned'}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                  padding: brandConfig.spacing.md,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: brandConfig.layout.borderRadius
                }}>
                  <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                    Quick Actions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.xs }}>
                    <button
                      onClick={() => handleStatusUpdate(ticket.status === 'open' ? 'in_progress' : 'resolved')}
                      disabled={loading}
                      style={{
                        padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                        backgroundColor: brandConfig.colors.hunterGreen,
                        color: brandConfig.colors.barnWhite,
                        border: 'none',
                        borderRadius: brandConfig.layout.borderRadius,
                        cursor: 'pointer',
                        fontSize: brandConfig.typography.fontSizeSm
                      }}
                    >
                      {ticket.status === 'open' ? 'Start Working' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => handlePriorityUpdate(ticket.priority === 'low' ? 'high' : 'low')}
                      disabled={loading}
                      style={{
                        padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                        backgroundColor: brandConfig.colors.alertAmber,
                        color: brandConfig.colors.barnWhite,
                        border: 'none',
                        borderRadius: brandConfig.layout.borderRadius,
                        cursor: 'pointer',
                        fontSize: brandConfig.typography.fontSizeSm
                      }}
                    >
                      {ticket.priority === 'low' ? 'Escalate Priority' : 'Lower Priority'}
                    </button>
                    <button
                      onClick={handleEscalateTicket}
                      disabled={loading || ticket.priority === 'critical'}
                      style={{
                        padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                        backgroundColor: ticket.priority === 'critical' ? brandConfig.colors.neutralGray : brandConfig.colors.errorRed,
                        color: brandConfig.colors.barnWhite,
                        border: 'none',
                        borderRadius: brandConfig.layout.borderRadius,
                        cursor: ticket.priority === 'critical' ? 'not-allowed' : 'pointer',
                        fontSize: brandConfig.typography.fontSizeSm,
                        opacity: ticket.priority === 'critical' ? 0.6 : 1
                      }}
                    >
                      🚨 {ticket.priority === 'critical' ? 'Already Critical' : 'Escalate to Manager'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              {/* Add Comment */}
              <div style={{
                marginBottom: brandConfig.spacing.lg,
                padding: brandConfig.spacing.md,
                backgroundColor: brandConfig.colors.arenaSand,
                borderRadius: brandConfig.layout.borderRadius
              }}>
                <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.sm }}>
                  Add Comment
                </h4>
                <div style={{ marginBottom: brandConfig.spacing.sm }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                    <input
                      type="radio"
                      name="commentType"
                      value="public"
                      checked={commentType === 'public'}
                      onChange={(e) => setCommentType(e.target.value as 'public' | 'internal')}
                    />
                    <span>🌍 Public (visible to customer)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                    <input
                      type="radio"
                      name="commentType"
                      value="internal"
                      checked={commentType === 'internal'}
                      onChange={(e) => setCommentType(e.target.value as 'public' | 'internal')}
                    />
                    <span>🔒 Internal (support team only)</span>
                  </label>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment or notes..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: brandConfig.spacing.sm,
                    border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                    borderRadius: brandConfig.layout.borderRadius,
                    fontSize: brandConfig.typography.fontSizeBase,
                    resize: 'vertical'
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  style={{
                    marginTop: brandConfig.spacing.sm,
                    padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                    backgroundColor: brandConfig.colors.stableMahogany,
                    color: brandConfig.colors.barnWhite,
                    border: 'none',
                    borderRadius: brandConfig.layout.borderRadius,
                    cursor: 'pointer',
                    fontSize: brandConfig.typography.fontSizeSm,
                    opacity: loading || !newComment.trim() ? 0.6 : 1
                  }}
                >
                  {loading ? 'Adding...' : 'Add Comment'}
                </button>
              </div>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
                {ticket.comments.map((comment, index) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: brandConfig.spacing.md,
                      backgroundColor: comment.isInternal ? brandConfig.colors.pastureSage : brandConfig.colors.barnWhite,
                      border: `1px solid ${comment.isInternal ? brandConfig.colors.hunterGreen : brandConfig.colors.sterlingSilver}`,
                      borderRadius: brandConfig.layout.borderRadius,
                      borderLeft: `4px solid ${comment.isInternal ? brandConfig.colors.hunterGreen : brandConfig.colors.ribbonBlue}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: brandConfig.spacing.sm
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: brandConfig.spacing.sm }}>
                        <strong style={{ color: brandConfig.colors.stableMahogany }}>
                          {comment.author}
                        </strong>
                        <span style={{
                          fontSize: brandConfig.typography.fontSizeXs,
                          color: brandConfig.colors.neutralGray
                        }}>
                          {comment.authorRole}
                        </span>
                        {comment.isInternal && (
                          <span style={{
                            fontSize: brandConfig.typography.fontSizeXs,
                            backgroundColor: brandConfig.colors.hunterGreen,
                            color: brandConfig.colors.barnWhite,
                            padding: `2px ${brandConfig.spacing.xs}`,
                            borderRadius: '3px'
                          }}>
                            🔒 INTERNAL
                          </span>
                        )}
                      </div>
                      <span style={{
                        fontSize: brandConfig.typography.fontSizeXs,
                        color: brandConfig.colors.neutralGray
                      }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p style={{ margin: 0, lineHeight: '1.6' }}>
                      {comment.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h4 style={{ color: brandConfig.colors.stableMahogany, marginBottom: brandConfig.spacing.md }}>
                Ticket Timeline
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.sm }}>
                <div style={{
                  padding: brandConfig.spacing.sm,
                  backgroundColor: brandConfig.colors.arenaSand,
                  borderRadius: brandConfig.layout.borderRadius,
                  borderLeft: `4px solid ${brandConfig.colors.successGreen}`
                }}>
                  <strong>Ticket Created</strong> - {formatDate(ticket.createdAt)}
                  <br />
                  <small style={{ color: brandConfig.colors.neutralGray }}>
                    Created by {ticket.clientName}
                  </small>
                </div>
                
                {ticket.assignedToName && (
                  <div style={{
                    padding: brandConfig.spacing.sm,
                    backgroundColor: brandConfig.colors.arenaSand,
                    borderRadius: brandConfig.layout.borderRadius,
                    borderLeft: `4px solid ${brandConfig.colors.ribbonBlue}`
                  }}>
                    <strong>Assigned</strong> - {formatDate(ticket.updatedAt)}
                    <br />
                    <small style={{ color: brandConfig.colors.neutralGray }}>
                      Assigned to {ticket.assignedToName}
                    </small>
                  </div>
                )}

                {ticket.comments.map((comment, index) => (
                  <div
                    key={`history-${comment.id}`}
                    style={{
                      padding: brandConfig.spacing.sm,
                      backgroundColor: brandConfig.colors.arenaSand,
                      borderRadius: brandConfig.layout.borderRadius,
                      borderLeft: `4px solid ${comment.isInternal ? brandConfig.colors.hunterGreen : brandConfig.colors.championGold}`
                    }}
                  >
                    <strong>{comment.isInternal ? 'Internal Note' : 'Comment'} Added</strong> - {formatDate(comment.createdAt)}
                    <br />
                    <small style={{ color: brandConfig.colors.neutralGray }}>
                      By {comment.author} ({comment.authorRole})
                    </small>
                  </div>
                ))}

                {ticket.resolvedAt && (
                  <div style={{
                    padding: brandConfig.spacing.sm,
                    backgroundColor: brandConfig.colors.arenaSand,
                    borderRadius: brandConfig.layout.borderRadius,
                    borderLeft: `4px solid ${brandConfig.colors.successGreen}`
                  }}>
                    <strong>Ticket Resolved</strong> - {formatDate(ticket.resolvedAt)}
                    <br />
                    <small style={{ color: brandConfig.colors.neutralGray }}>
                      Status changed to resolved
                    </small>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 