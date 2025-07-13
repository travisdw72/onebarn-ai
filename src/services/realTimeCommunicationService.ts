/**
 * Real-Time Communication Service - Phase 1 Core Component
 * Provides WebSocket-based real-time updates for ticket system and live chat
 * 
 * @description Implements the real-time communication from Phase 1 specifications
 * @compliance Multi-tenant with zero trust security and audit trails
 * @author One Barn Development Team
 * @since Phase 1.0.0
 */

import { ISupportTicket, ITicketComment } from './ticketService';
import { securityAuditService } from './securityAuditService';
import { brandConfig } from '../config/brandConfig';

// ============================================================================
// REAL-TIME COMMUNICATION INTERFACES
// ============================================================================

interface IWebSocketMessage {
  type: 'ticket_update' | 'comment_added' | 'status_change' | 'assignment_change' | 'chat_message' | 'system_alert';
  payload: any;
  timestamp: string;
  tenantId: string;
  sessionId?: string;
  userId?: string;
}

interface ITicketUpdateMessage extends IWebSocketMessage {
  type: 'ticket_update';
  payload: {
    ticketId: string;
    updatedFields: Partial<ISupportTicket>;
    updatedBy: string;
    updateReason?: string;
  };
}

interface ICommentAddedMessage extends IWebSocketMessage {
  type: 'comment_added';
  payload: {
    ticketId: string;
    comment: ITicketComment;
    isInternal: boolean;
  };
}

interface IStatusChangeMessage extends IWebSocketMessage {
  type: 'status_change';
  payload: {
    ticketId: string;
    oldStatus: string;
    newStatus: string;
    changedBy: string;
    reason?: string;
  };
}

interface IChatMessage extends IWebSocketMessage {
  type: 'chat_message';
  payload: {
    chatId: string;
    message: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    isInternal: boolean;
    attachments?: IChatAttachment[];
  };
}

interface IChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  url: string;
  size: number;
}

interface ILiveChatSession {
  id: string;
  ticketId?: string;
  customerId: string;
  customerName: string;
  supportAgentId?: string;
  supportAgentName?: string;
  status: 'waiting' | 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  messages: IChatMessage[];
  queuePosition?: number;
  estimatedWaitTime?: number;
  tenantId: string;
}

interface INotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  channels: {
    ticketAssigned: boolean;
    ticketUpdated: boolean;
    commentAdded: boolean;
    statusChanged: boolean;
    urgentAlerts: boolean;
    chatMessages: boolean;
  };
  quietHours?: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface IConnectionStatus {
  isConnected: boolean;
  connectionId: string;
  lastHeartbeat: string;
  userId: string;
  tenantId: string;
  activeSubscriptions: string[];
}

// ============================================================================
// REAL-TIME COMMUNICATION SERVICE CLASS
// ============================================================================

class RealTimeCommunicationService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: IWebSocketMessage[] = [];
  private subscribers = new Map<string, Set<(message: IWebSocketMessage) => void>>();
  private connectionStatus: IConnectionStatus | null = null;
  private activeChatSessions = new Map<string, ILiveChatSession>();
  private notificationPreferences = new Map<string, INotificationPreferences>();

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  async connect(userId: string, tenantId: string, sessionToken: string): Promise<boolean> {
    try {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        return true;
      }

      const wsUrl = this.buildWebSocketUrl(userId, tenantId, sessionToken);
      this.socket = new WebSocket(wsUrl);

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Failed to create WebSocket connection'));
          return;
        }

        this.socket.onopen = () => {
          console.log('🔗 Real-time communication connected');
          this.connectionStatus = {
            isConnected: true,
            connectionId: `conn_${Date.now()}`,
            lastHeartbeat: new Date().toISOString(),
            userId,
            tenantId,
            activeSubscriptions: []
          };
          
          this.startHeartbeat();
          this.processMessageQueue();
          this.reconnectAttempts = 0;
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };

        this.socket.onclose = (event) => {
          console.log('🔌 Real-time communication disconnected:', event.code, event.reason);
          this.connectionStatus = null;
          this.stopHeartbeat();
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect(userId, tenantId, sessionToken);
          }
        };

        this.socket.onerror = (error) => {
          console.error('🚨 WebSocket error:', error);
          reject(error);
        };

        // Timeout after 10 seconds
        setTimeout(() => {
          if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);
      });

    } catch (error) {
      console.error('Real-time communication connection failed:', error);
      return false;
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.stopHeartbeat();
    this.connectionStatus = null;
    this.subscribers.clear();
    this.activeChatSessions.clear();
  }

  private buildWebSocketUrl(userId: string, tenantId: string, sessionToken: string): string {
    const baseUrl = process.env.VITE_WS_URL || 'ws://localhost:3001';
    return `${baseUrl}/ws?userId=${userId}&tenantId=${tenantId}&token=${sessionToken}`;
  }

  private scheduleReconnect(userId: string, tenantId: string, sessionToken: string): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`⏰ Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect(userId, tenantId, sessionToken);
    }, delay);
  }

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  private handleIncomingMessage(data: string): void {
    try {
      const message: IWebSocketMessage = JSON.parse(data);
      
      // Update heartbeat
      if (this.connectionStatus) {
        this.connectionStatus.lastHeartbeat = new Date().toISOString();
      }

      // Handle special message types
      if (message.type === 'chat_message') {
        this.handleChatMessage(message as IChatMessage);
      } else if (message.type === 'ticket_update') {
        this.handleTicketUpdate(message as ITicketUpdateMessage);
      }

      // Notify subscribers
      this.notifySubscribers(message);

      // Log security event
      securityAuditService.logSecurityEvent({
        eventType: 'data_access',
        severity: 'info',
        tenantId: message.tenantId,
        sourceIP: '127.0.0.1', // Would be actual IP in production
        userAgent: navigator.userAgent,
        action: 'websocket_message_received',
        outcome: 'success',
        details: { messageType: message.type, timestamp: message.timestamp }
      });

    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  private handleChatMessage(message: IChatMessage): void {
    const chatId = message.payload.chatId;
    const session = this.activeChatSessions.get(chatId);
    
    if (session) {
      session.messages.push(message);
      this.activeChatSessions.set(chatId, session);
    }
  }

  private handleTicketUpdate(message: ITicketUpdateMessage): void {
    // Update local ticket data if needed
    console.log('Ticket updated:', message.payload.ticketId);
  }

  sendMessage(message: Omit<IWebSocketMessage, 'timestamp'>): void {
    const fullMessage: IWebSocketMessage = {
      ...message,
      timestamp: new Date().toISOString()
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(fullMessage));
    } else {
      // Queue message for later delivery
      this.messageQueue.push(fullMessage);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  subscribe(eventType: string, callback: (message: IWebSocketMessage) => void): string {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    // Update connection status
    if (this.connectionStatus) {
      this.connectionStatus.activeSubscriptions.push(eventType);
    }
    
    return `sub_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  unsubscribe(eventType: string, callback: (message: IWebSocketMessage) => void): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(eventType);
      }
    }
  }

  private notifySubscribers(message: IWebSocketMessage): void {
    const subscribers = this.subscribers.get(message.type);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }

    // Also notify general subscribers
    const generalSubscribers = this.subscribers.get('*');
    if (generalSubscribers) {
      generalSubscribers.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in general subscriber callback:', error);
        }
      });
    }
  }

  // ============================================================================
  // LIVE CHAT MANAGEMENT
  // ============================================================================

  async startChatSession(customerId: string, customerName: string, ticketId?: string): Promise<ILiveChatSession> {
    const session: ILiveChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      ticketId,
      customerId,
      customerName,
      status: 'waiting',
      startedAt: new Date().toISOString(),
      messages: [],
      queuePosition: this.getQueuePosition(),
      estimatedWaitTime: this.getEstimatedWaitTime(),
      tenantId: this.connectionStatus?.tenantId || 'default'
    };

    this.activeChatSessions.set(session.id, session);

    // Notify system about new chat session
    this.sendMessage({
      type: 'system_alert',
      payload: {
        alertType: 'new_chat_session',
        chatId: session.id,
        customerId: customerId,
        customerName: customerName,
        ticketId: ticketId
      },
      tenantId: session.tenantId
    });

    return session;
  }

  async endChatSession(chatId: string): Promise<void> {
    const session = this.activeChatSessions.get(chatId);
    if (session) {
      session.status = 'ended';
      session.endedAt = new Date().toISOString();
      
      // Notify participants
      this.sendMessage({
        type: 'system_alert',
        payload: {
          alertType: 'chat_session_ended',
          chatId: chatId,
          endedAt: session.endedAt
        },
        tenantId: session.tenantId
      });
      
      // Archive session (would be saved to database in production)
      this.activeChatSessions.delete(chatId);
    }
  }

  sendChatMessage(chatId: string, message: string, senderId: string, senderName: string, senderRole: string, isInternal: boolean = false): void {
    const session = this.activeChatSessions.get(chatId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    const chatMessage: IChatMessage = {
      type: 'chat_message',
      payload: {
        chatId,
        message,
        senderId,
        senderName,
        senderRole,
        isInternal
      },
      timestamp: new Date().toISOString(),
      tenantId: session.tenantId
    };

    this.sendMessage(chatMessage);
  }

  assignSupportAgent(chatId: string, agentId: string, agentName: string): void {
    const session = this.activeChatSessions.get(chatId);
    if (session) {
      session.supportAgentId = agentId;
      session.supportAgentName = agentName;
      session.status = 'active';
      this.activeChatSessions.set(chatId, session);

      this.sendMessage({
        type: 'system_alert',
        payload: {
          alertType: 'agent_assigned',
          chatId: chatId,
          agentId: agentId,
          agentName: agentName
        },
        tenantId: session.tenantId
      });
    }
  }

  private getQueuePosition(): number {
    const waitingSessions = Array.from(this.activeChatSessions.values())
      .filter(session => session.status === 'waiting');
    return waitingSessions.length;
  }

  private getEstimatedWaitTime(): number {
    // Simple calculation: 5 minutes per person in queue
    return this.getQueuePosition() * 5;
  }

  // ============================================================================
  // HEARTBEAT MANAGEMENT
  // ============================================================================

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          type: 'heartbeat',
          payload: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
          tenantId: this.connectionStatus?.tenantId || 'default'
        }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  async updateNotificationPreferences(userId: string, preferences: INotificationPreferences): Promise<void> {
    this.notificationPreferences.set(userId, preferences);
    
    // Send to server in production
    this.sendMessage({
      type: 'system_alert',
      payload: {
        alertType: 'notification_preferences_updated',
        userId: userId,
        preferences: preferences
      },
      tenantId: this.connectionStatus?.tenantId || 'default'
    });
  }

  getNotificationPreferences(userId: string): INotificationPreferences | null {
    return this.notificationPreferences.get(userId) || null;
  }

  // ============================================================================
  // TICKET REAL-TIME UPDATES
  // ============================================================================

  broadcastTicketUpdate(ticketId: string, updatedFields: Partial<ISupportTicket>, updatedBy: string, updateReason?: string): void {
    this.sendMessage({
      type: 'ticket_update',
      payload: {
        ticketId,
        updatedFields,
        updatedBy,
        updateReason
      },
      tenantId: this.connectionStatus?.tenantId || 'default'
    });
  }

  broadcastCommentAdded(ticketId: string, comment: ITicketComment, isInternal: boolean): void {
    this.sendMessage({
      type: 'comment_added',
      payload: {
        ticketId,
        comment,
        isInternal
      },
      tenantId: this.connectionStatus?.tenantId || 'default'
    });
  }

  broadcastStatusChange(ticketId: string, oldStatus: string, newStatus: string, changedBy: string, reason?: string): void {
    this.sendMessage({
      type: 'status_change',
      payload: {
        ticketId,
        oldStatus,
        newStatus,
        changedBy,
        reason
      },
      tenantId: this.connectionStatus?.tenantId || 'default'
    });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getConnectionStatus(): IConnectionStatus | null {
    return this.connectionStatus;
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  getActiveChatSessions(): ILiveChatSession[] {
    return Array.from(this.activeChatSessions.values());
  }

  getQueueStatus(): { waiting: number; active: number; avgWaitTime: number } {
    const sessions = this.getActiveChatSessions();
    const waiting = sessions.filter(s => s.status === 'waiting').length;
    const active = sessions.filter(s => s.status === 'active').length;
    const avgWaitTime = waiting * 5; // 5 minutes per waiting session

    return { waiting, active, avgWaitTime };
  }

  // ============================================================================
  // TESTING UTILITIES
  // ============================================================================

  async simulateIncomingMessage(message: IWebSocketMessage): Promise<void> {
    // For testing purposes - simulate receiving a message
    this.handleIncomingMessage(JSON.stringify(message));
  }

  getSubscriberCount(): number {
    return Array.from(this.subscribers.values()).reduce((total, subscribers) => total + subscribers.size, 0);
  }

  clearMessageQueue(): void {
    this.messageQueue = [];
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const realTimeCommunicationService = new RealTimeCommunicationService();

// Export interfaces for use in other components
export type {
  IWebSocketMessage,
  ITicketUpdateMessage,
  ICommentAddedMessage,
  IStatusChangeMessage,
  IChatMessage,
  ILiveChatSession,
  INotificationPreferences,
  IConnectionStatus
}; 