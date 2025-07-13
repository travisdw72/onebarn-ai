// Real-time Chat Service with AI Chatbot and Live Agent Support
// Integrates with existing Claude API and ticket system infrastructure

import { aiConfig } from '../config/aiConfig';
import { ticketService, ISupportTicket } from './ticketService';
import { intelligentRoutingService } from './intelligentRoutingService';

// Import Anthropic for AI chat
let Anthropic: any = null;
const initializeAnthropic = async () => {
  if (!Anthropic) {
    const anthropicModule = await import('@anthropic-ai/sdk');
    Anthropic = anthropicModule.default;
  }
  return Anthropic;
};

// ============================================================================
// INTERFACES
// ============================================================================

export interface IChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'ai' | 'agent';
  content: string;
  timestamp: string;
  messageType: 'text' | 'system' | 'handoff' | 'escalation';
  metadata?: {
    confidence?: number;
    suggestedActions?: string[];
    escalationReason?: string;
    agentId?: string;
    ticketId?: string;
  };
}

export interface IChatSession {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  status: 'active' | 'waiting_for_agent' | 'with_agent' | 'resolved' | 'abandoned';
  type: 'ai_only' | 'ai_with_escalation' | 'live_agent' | 'emergency';
  assignedAgentId?: string;
  assignedAgentName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'general' | 'technical' | 'billing' | 'ai_support' | 'emergency';
  startTime: string;
  lastActivity: string;
  messages: IChatMessage[];
  aiContext: {
    conversationSummary: string;
    userSentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
    technicalComplexity: 'low' | 'medium' | 'high';
    escalationScore: number; // 0-1, higher = more likely to need human
    resolvedByAI: boolean;
  };
  relatedTicketId?: string;
}

export interface ILiveAgent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  currentChats: number;
  maxChats: number;
  specialties: string[];
  averageResponseTime: number; // seconds
  customerSatisfaction: number; // 0-5
  totalChatsToday: number;
}

export interface IChatbotResponse {
  content: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string;
  suggestedActions: string[];
  category: string;
  requiresTicket: boolean;
}

// ============================================================================
// CHAT SERVICE CLASS
// ============================================================================

class ChatService {
  private readonly CHAT_STORAGE_KEY = 'onebarn_chat_sessions';
  private readonly AGENT_STORAGE_KEY = 'onebarn_live_agents';
  private anthropicClient: any = null;
  
  // Mock live agents - in production, this would come from staff management
  private liveAgents: ILiveAgent[] = [
    {
      id: 'agent_001',
      name: 'Enhanced Support Staff',
      role: 'support',
      status: 'online',
      currentChats: 2,
      maxChats: 5,
      specialties: ['general', 'billing', 'basic_technical'],
      averageResponseTime: 45,
      customerSatisfaction: 4.2,
      totalChatsToday: 12
    },
    {
      id: 'agent_002', 
      name: 'IT Manager',
      role: 'it_manager',
      status: 'online',
      currentChats: 1,
      maxChats: 3,
      specialties: ['technical', 'ai_support', 'infrastructure'],
      averageResponseTime: 90,
      customerSatisfaction: 4.7,
      totalChatsToday: 8
    },
    {
      id: 'agent_003',
      name: 'Support Manager', 
      role: 'manager',
      status: 'busy',
      currentChats: 2,
      maxChats: 3,
      specialties: ['escalations', 'billing_disputes', 'client_relations'],
      averageResponseTime: 120,
      customerSatisfaction: 4.8,
      totalChatsToday: 6
    }
  ];

  constructor() {
    this.initializeClaudeClient();
  }

  private async initializeClaudeClient() {
    if (!this.anthropicClient && aiConfig.providers.anthropic.enabled && aiConfig.providers.anthropic.apiKey) {
      const AnthropicSDK = await initializeAnthropic();
      this.anthropicClient = new AnthropicSDK({
        apiKey: aiConfig.providers.anthropic.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  // ============================================================================
  // CHAT SESSION MANAGEMENT
  // ============================================================================

  public async startChatSession(
    userId: string,
    userName: string,
    userRole: string,
    initialMessage: string,
    chatType: IChatSession['type'] = 'ai_with_escalation'
  ): Promise<IChatSession> {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('💬 Starting new chat session:', chatId);

    const session: IChatSession = {
      id: chatId,
      userId,
      userName,
      userRole,
      status: 'active',
      type: chatType,
      priority: 'medium',
      category: 'general',
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      messages: [],
      aiContext: {
        conversationSummary: '',
        userSentiment: 'neutral',
        technicalComplexity: 'low',
        escalationScore: 0.1,
        resolvedByAI: false
      }
    };

    // Add initial user message
    const userMessage: IChatMessage = {
      id: `msg_${Date.now()}_1`,
      chatId,
      senderId: userId,
      senderName: userName,
      senderType: 'user',
      content: initialMessage,
      timestamp: new Date().toISOString(),
      messageType: 'text'
    };

    session.messages.push(userMessage);

    // Get AI response if AI chat is enabled
    if (chatType === 'ai_only' || chatType === 'ai_with_escalation') {
      const aiResponse = await this.getAIResponse(session, initialMessage);
      
      const aiMessage: IChatMessage = {
        id: `msg_${Date.now()}_2`,
        chatId,
        senderId: 'ai_assistant',
        senderName: 'AI Assistant',
        senderType: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        messageType: 'text',
        metadata: {
          confidence: aiResponse.confidence,
          suggestedActions: aiResponse.suggestedActions
        }
      };

      session.messages.push(aiMessage);
      session.category = aiResponse.category as IChatSession['category'];
      session.aiContext.escalationScore = aiResponse.shouldEscalate ? 0.8 : 0.2;

      // Auto-escalate if AI determines it needs human help
      if (aiResponse.shouldEscalate && chatType === 'ai_with_escalation') {
        await this.escalateToLiveAgent(session, aiResponse.escalationReason || 'AI determined human assistance needed');
      }
    } else if (chatType === 'live_agent') {
      // Immediately assign to live agent
      await this.assignToLiveAgent(session);
    }

    this.saveChatSession(session);
    
    console.log('✅ Chat session started:', {
      chatId: session.id,
      type: session.type,
      status: session.status,
      messagesCount: session.messages.length
    });

    return session;
  }

  public async sendMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    content: string,
    senderType: 'user' | 'agent' = 'user'
  ): Promise<IChatMessage[]> {
    const session = this.getChatSession(chatId);
    if (!session) {
      throw new Error('Chat session not found');
    }

    // Add user/agent message
    const message: IChatMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 1}`,
      chatId,
      senderId,
      senderName,
      senderType,
      content,
      timestamp: new Date().toISOString(),
      messageType: 'text'
    };

    session.messages.push(message);
    session.lastActivity = new Date().toISOString();

    const newMessages: IChatMessage[] = [message];

    // Generate AI response if needed
    if (senderType === 'user' && (session.status === 'active' && (session.type === 'ai_only' || session.type === 'ai_with_escalation'))) {
      const aiResponse = await this.getAIResponse(session, content);
      
      const aiMessage: IChatMessage = {
        id: `msg_${Date.now()}_${session.messages.length + 1}`,
        chatId,
        senderId: 'ai_assistant',
        senderName: 'AI Assistant',
        senderType: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        messageType: 'text',
        metadata: {
          confidence: aiResponse.confidence,
          suggestedActions: aiResponse.suggestedActions
        }
      };

      session.messages.push(aiMessage);
      newMessages.push(aiMessage);

      // Update AI context
      session.aiContext.escalationScore = Math.min(
        session.aiContext.escalationScore + (aiResponse.shouldEscalate ? 0.3 : -0.1),
        1.0
      );

      // Auto-escalate if confidence is low or escalation requested
      if (aiResponse.shouldEscalate && session.type === 'ai_with_escalation' && session.status === 'active') {
        await this.escalateToLiveAgent(session, aiResponse.escalationReason || 'AI confidence low, escalating to human agent');
      }

      // Create ticket if needed
      if (aiResponse.requiresTicket) {
        await this.createTicketFromChat(session);
      }
    }

    this.saveChatSession(session);
    return newMessages;
  }

  // ============================================================================
  // AI CHATBOT INTEGRATION
  // ============================================================================

  private async getAIResponse(session: IChatSession, userMessage: string): Promise<IChatbotResponse> {
    if (!this.anthropicClient) {
      console.warn('🤖 Claude client not available, using fallback response');
      return this.getFallbackResponse(userMessage);
    }

    try {
      console.log('🤖 Getting AI response from Claude...');

      // Build conversation context
      const conversationHistory = session.messages
        .slice(-6) // Last 6 messages for context
        .map(msg => `${msg.senderType}: ${msg.content}`)
        .join('\n');

      const chatbotPrompt = `You are an expert AI customer support assistant for One Barn, an equestrian facility management platform. You help users with horses, training, billing, AI systems, and general support.

CONVERSATION HISTORY:
${conversationHistory}

LATEST USER MESSAGE: "${userMessage}"

USER CONTEXT:
- Role: ${session.userRole}
- Current sentiment: ${session.aiContext.userSentiment}
- Technical complexity: ${session.aiContext.technicalComplexity}
- Escalation score: ${session.aiContext.escalationScore}

Provide a helpful, professional response. Respond with ONLY valid JSON in this exact format:
{
  "content": "Your helpful response to the user",
  "confidence": 0.85,
  "shouldEscalate": false,
  "escalationReason": "Optional reason if escalation needed",
  "suggestedActions": ["action1", "action2"],
  "category": "general|technical|billing|ai_support|emergency",
  "requiresTicket": false
}

Guidelines:
1. Be helpful, professional, and empathetic
2. If the issue is complex technical, billing dispute, or user is frustrated, set shouldEscalate: true
3. For simple questions, provide direct answers
4. Suggest relevant actions the user can take
5. Set requiresTicket: true for issues that need tracking
6. Match the category to the type of request

Respond with ONLY the JSON object, no additional text.`;

      const response = await this.anthropicClient.messages.create({
        model: aiConfig.providers.anthropic.model,
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: chatbotPrompt
          }
        ]
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      try {
        const aiResponse = JSON.parse(content);
        console.log('✅ Claude chatbot response:', aiResponse);
        return aiResponse;
      } catch (parseError) {
        console.error('❌ Failed to parse Claude chatbot response:', parseError);
        return this.getFallbackResponse(userMessage);
      }

    } catch (error) {
      console.error('❌ Claude API error in chatbot:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private getFallbackResponse(userMessage: string): IChatbotResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
      return {
        content: "I understand you have a billing question. Let me connect you with our billing specialist who can help you right away.",
        confidence: 0.7,
        shouldEscalate: true,
        escalationReason: "Billing inquiry requires human assistance",
        suggestedActions: ["Review billing history", "Contact billing department"],
        category: "billing",
        requiresTicket: true
      };
    }

    if (lowerMessage.includes('technical') || lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('not working')) {
      return {
        content: "I see you're experiencing a technical issue. Let me gather some information and connect you with our technical support team.",
        confidence: 0.6,
        shouldEscalate: true,
        escalationReason: "Technical issue requires expert assistance",
        suggestedActions: ["Check system status", "Contact technical support"],
        category: "technical",
        requiresTicket: true
      };
    }

    if (lowerMessage.includes('ai') || lowerMessage.includes('false alarm') || lowerMessage.includes('alert')) {
      return {
        content: "I can help with AI-related questions! Our AI system monitors horse behavior and health. What specific aspect would you like help with?",
        confidence: 0.8,
        shouldEscalate: false,
        suggestedActions: ["View AI settings", "Check alert history", "Schedule AI training"],
        category: "ai_support",
        requiresTicket: false
      };
    }

    // Default response
    return {
      content: "Thank you for contacting One Barn support! I'm here to help you with any questions about your horses, training, or our platform. Could you tell me more about what you need assistance with?",
      confidence: 0.6,
      shouldEscalate: false,
      suggestedActions: ["Browse help articles", "Contact support team"],
      category: "general",
      requiresTicket: false
    };
  }

  // ============================================================================
  // LIVE AGENT INTEGRATION
  // ============================================================================

  public async escalateToLiveAgent(session: IChatSession, reason: string): Promise<void> {
    console.log('🚀 Escalating chat to live agent:', session.id, reason);

    // Find best available agent using existing intelligent routing
    const availableAgents = this.liveAgents.filter(agent => 
      agent.status === 'online' && agent.currentChats < agent.maxChats
    );

    if (availableAgents.length === 0) {
      // No agents available - add to queue
      session.status = 'waiting_for_agent';
      
      const queueMessage: IChatMessage = {
        id: `msg_${Date.now()}_queue`,
        chatId: session.id,
        senderId: 'system',
        senderName: 'System',
        senderType: 'ai',
        content: `I'm connecting you with a live agent who specializes in ${session.category} issues. You're currently #${this.getQueuePosition(session.id)} in line. Average wait time is 3-5 minutes.`,
        timestamp: new Date().toISOString(),
        messageType: 'system',
        metadata: {
          escalationReason: reason
        }
      };

      session.messages.push(queueMessage);
    } else {
      // Assign to best agent
      await this.assignToLiveAgent(session);
    }

    this.saveChatSession(session);
  }

  private async assignToLiveAgent(session: IChatSession): Promise<void> {
    // Use intelligent routing to find best agent
    const availableAgents = this.liveAgents.filter(agent => 
      agent.status === 'online' && agent.currentChats < agent.maxChats
    );

    if (availableAgents.length === 0) {
      session.status = 'waiting_for_agent';
      return;
    }

    // Score agents based on specialties and workload
    const scoredAgents = availableAgents.map(agent => {
      let score = 0;
      
      // Specialty match
      if (agent.specialties.includes(session.category)) score += 0.5;
      if (agent.specialties.includes('general')) score += 0.2;
      
      // Workload (inverse - less busy is better)
      score += (1 - (agent.currentChats / agent.maxChats)) * 0.3;
      
      // Performance
      score += (agent.customerSatisfaction / 5) * 0.2;
      
      return { ...agent, score };
    });

    // Sort by score and pick the best
    scoredAgents.sort((a, b) => b.score - a.score);
    const bestAgent = scoredAgents[0];

    // Assign agent
    session.assignedAgentId = bestAgent.id;
    session.assignedAgentName = bestAgent.name;
    session.status = 'with_agent';

    // Update agent workload
    const agentIndex = this.liveAgents.findIndex(a => a.id === bestAgent.id);
    if (agentIndex !== -1) {
      this.liveAgents[agentIndex].currentChats++;
    }

    // Add handoff message
    const handoffMessage: IChatMessage = {
      id: `msg_${Date.now()}_handoff`,
      chatId: session.id,
      senderId: 'system',
      senderName: 'System',
      senderType: 'ai',
      content: `You've been connected with ${bestAgent.name}, our ${bestAgent.role} specialist. They'll be with you shortly!`,
      timestamp: new Date().toISOString(),
      messageType: 'handoff',
      metadata: {
        agentId: bestAgent.id,
        escalationReason: 'Assigned to live agent'
      }
    };

    session.messages.push(handoffMessage);

    console.log('✅ Chat assigned to agent:', {
      chatId: session.id,
      agentId: bestAgent.id,
      agentName: bestAgent.name,
      agentScore: bestAgent.score
    });
  }

  // ============================================================================
  // TICKET INTEGRATION
  // ============================================================================

  private async createTicketFromChat(session: IChatSession): Promise<void> {
    if (session.relatedTicketId) return; // Already has ticket

    const conversationSummary = session.messages
      .slice(0, 4) // First few messages for context
      .map(msg => `${msg.senderName}: ${msg.content}`)
      .join('\n\n');

    const ticketData: Partial<ISupportTicket> = {
      title: `Chat Support Request - ${session.category}`,
      description: `Conversation started in live chat:\n\n${conversationSummary}`,
      priority: session.priority as ISupportTicket['priority'],
      category: session.category as ISupportTicket['category'],
      clientEmail: `${session.userId}@onebarn.com`, // In real app, get actual email
      clientName: session.userName,
      source: 'live_chat',
      tags: ['chat-generated', session.category],
      metadata: {
        chatId: session.id,
        aiEscalationScore: session.aiContext.escalationScore,
        userSentiment: session.aiContext.userSentiment
      }
    };

    try {
      const ticket = await ticketService.createTicket(ticketData);
      session.relatedTicketId = ticket.id;
      
      // Add ticket creation message to chat
      const ticketMessage: IChatMessage = {
        id: `msg_${Date.now()}_ticket`,
        chatId: session.id,
        senderId: 'system',
        senderName: 'System',
        senderType: 'ai',
        content: `I've created support ticket #${ticket.ticketNumber} to track this issue. You can reference this number for future follow-ups.`,
        timestamp: new Date().toISOString(),
        messageType: 'system',
        metadata: {
          ticketId: ticket.id
        }
      };

      session.messages.push(ticketMessage);
      this.saveChatSession(session);

      console.log('✅ Ticket created from chat:', {
        chatId: session.id,
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber
      });

    } catch (error) {
      console.error('❌ Failed to create ticket from chat:', error);
    }
  }

  // ============================================================================
  // DATA MANAGEMENT
  // ============================================================================

  private saveChatSession(session: IChatSession): void {
    const sessions = this.loadChatSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex !== -1) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(this.CHAT_STORAGE_KEY, JSON.stringify(sessions));
  }

  private loadChatSessions(): IChatSession[] {
    try {
      const data = localStorage.getItem(this.CHAT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  }

  public getChatSession(chatId: string): IChatSession | null {
    const sessions = this.loadChatSessions();
    return sessions.find(s => s.id === chatId) || null;
  }

  public getUserChatSessions(userId: string): IChatSession[] {
    const sessions = this.loadChatSessions();
    return sessions.filter(s => s.userId === userId);
  }

  public getAgentChatSessions(agentId: string): IChatSession[] {
    const sessions = this.loadChatSessions();
    return sessions.filter(s => s.assignedAgentId === agentId && s.status === 'with_agent');
  }

  public getAvailableAgents(): ILiveAgent[] {
    return this.liveAgents.filter(agent => agent.status === 'online');
  }

  private getQueuePosition(chatId: string): number {
    const sessions = this.loadChatSessions();
    const waitingSessions = sessions
      .filter(s => s.status === 'waiting_for_agent')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return waitingSessions.findIndex(s => s.id === chatId) + 1;
  }

  public async endChatSession(chatId: string, resolution: string = 'resolved'): Promise<void> {
    const session = this.getChatSession(chatId);
    if (!session) return;

    session.status = resolution as IChatSession['status'];
    session.lastActivity = new Date().toISOString();

    // Free up agent
    if (session.assignedAgentId) {
      const agentIndex = this.liveAgents.findIndex(a => a.id === session.assignedAgentId);
      if (agentIndex !== -1) {
        this.liveAgents[agentIndex].currentChats = Math.max(0, this.liveAgents[agentIndex].currentChats - 1);
      }
    }

    // Add resolution message
    const endMessage: IChatMessage = {
      id: `msg_${Date.now()}_end`,
      chatId,
      senderId: 'system',
      senderName: 'System',
      senderType: 'ai',
      content: resolution === 'resolved' 
        ? 'This chat session has been marked as resolved. Thank you for using One Barn support!'
        : 'This chat session has ended.',
      timestamp: new Date().toISOString(),
      messageType: 'system'
    };

    session.messages.push(endMessage);
    this.saveChatSession(session);

    console.log('✅ Chat session ended:', {
      chatId: session.id,
      resolution,
      duration: new Date().getTime() - new Date(session.startTime).getTime()
    });
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService; 