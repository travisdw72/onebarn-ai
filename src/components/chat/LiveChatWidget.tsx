// Live Chat Widget with AI Chatbot and Live Agent Integration
// Beautiful, modern chat interface that integrates with existing support system

import React, { useState, useEffect, useRef } from 'react';
import { 
  Fab, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Box, 
  Avatar, 
  Chip, 
  Divider,
  CircularProgress,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  SupportAgent as SupportIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, IChatSession, IChatMessage } from '../../services/chatService';

interface ILiveChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  initialMessage?: string;
  chatType?: 'ai_with_escalation' | 'ai_only' | 'live_agent';
}

export const LiveChatWidget: React.FC<ILiveChatWidgetProps> = ({
  position = 'bottom-right',
  initialMessage = "Hi! How can I help you today?",
  chatType = 'ai_with_escalation'
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState<IChatSession | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing session if available
  useEffect(() => {
    if (user?.email && isOpen) {
      const existingSessions = chatService.getUserChatSessions(user.email);
      const activeSession = existingSessions.find(s => s.status === 'active' || s.status === 'with_agent' || s.status === 'waiting_for_agent');
      
      if (activeSession) {
        setCurrentSession(activeSession);
        setMessages(activeSession.messages);
      }
    }
  }, [user, isOpen]);

  const startNewChat = async () => {
    if (!user?.email) return;

    try {
      const session = await chatService.startChatSession(
        user.email,
        user.email, // In real app, use actual name
        user.role || 'client',
        newMessage || "Hello, I need help with something.",
        chatType
      );

      setCurrentSession(session);
      setMessages(session.messages);
      setNewMessage('');
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to start chat session:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession) return;

    setIsTyping(true);
    
    try {
      const newMessages = await chatService.sendMessage(
        currentSession.id,
        user?.email || 'user',
        user?.email || 'User',
        newMessage.trim()
      );

      setMessages(prev => [...prev, ...newMessages]);
      setNewMessage('');
      
      // Update session
      const updatedSession = chatService.getChatSession(currentSession.id);
      if (updatedSession) {
        setCurrentSession(updatedSession);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (currentSession) {
        sendMessage();
      } else {
        startNewChat();
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const getMessageIcon = (message: IChatMessage) => {
    switch (message.senderType) {
      case 'ai':
        return <AIIcon sx={{ fontSize: '1.2rem', color: brandConfig.colors.ribbonBlue }} />;
      case 'agent':
        return <PersonIcon sx={{ fontSize: '1.2rem', color: brandConfig.colors.hunterGreen }} />;
      default:
        return <PersonIcon sx={{ fontSize: '1.2rem', color: brandConfig.colors.stableMahogany }} />;
    }
  };

  const getStatusChip = () => {
    if (!currentSession) return null;

    const statusConfig = {
      'active': { label: 'AI Assistant', color: brandConfig.colors.ribbonBlue, icon: <AIIcon /> },
      'waiting_for_agent': { label: 'Connecting...', color: brandConfig.colors.alertAmber, icon: <ScheduleIcon /> },
      'with_agent': { label: `With ${currentSession.assignedAgentName}`, color: brandConfig.colors.successGreen, icon: <SupportIcon /> },
      'resolved': { label: 'Resolved', color: brandConfig.colors.neutralGray, icon: <CheckIcon /> },
      'abandoned': { label: 'Ended', color: brandConfig.colors.neutralGray, icon: <CloseIcon /> }
    };

    const config = statusConfig[currentSession.status];
    
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: `${config.color}20`,
          color: config.color,
          fontWeight: 'bold',
          '& .MuiChip-icon': { color: config.color }
        }}
      />
    );
  };

  const styles = {
    fab: {
      position: 'fixed' as const,
      bottom: 120,
      [position.includes('right') ? 'right' : 'left']: 24,
      zIndex: 1000,
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      '&:hover': {
        backgroundColor: brandConfig.colors.hunterGreen,
        transform: 'scale(1.1)'
      },
      transition: 'all 0.3s ease'
    },
    chatWindow: {
      position: 'fixed' as const,
      bottom: 186,
      [position.includes('right') ? 'right' : 'left']: 24,
      width: 380,
      height: 500,
      zIndex: 1000,
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      backgroundColor: brandConfig.colors.barnWhite
    },
    header: {
      backgroundColor: brandConfig.colors.stableMahogany,
      color: brandConfig.colors.barnWhite,
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    messagesContainer: {
      height: 320,
      overflowY: 'auto' as const,
      padding: '8px',
      backgroundColor: '#f8f9fa'
    },
    message: {
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    },
    userMessage: {
      flexDirection: 'row-reverse' as const,
      '& .message-bubble': {
        backgroundColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.barnWhite,
        borderRadius: '18px 18px 4px 18px'
      }
    },
    aiMessage: {
      '& .message-bubble': {
        backgroundColor: brandConfig.colors.barnWhite,
        color: brandConfig.colors.midnightBlack,
        borderRadius: '18px 18px 18px 4px',
        border: `1px solid ${brandConfig.colors.sterlingSilver}`
      }
    },
    systemMessage: {
      justifyContent: 'center',
      '& .message-bubble': {
        backgroundColor: `${brandConfig.colors.ribbonBlue}15`,
        color: brandConfig.colors.ribbonBlue,
        borderRadius: '12px',
        fontSize: '0.875rem',
        fontStyle: 'italic'
      }
    },
    messageBubble: {
      padding: '12px 16px',
      maxWidth: '75%',
      wordWrap: 'break-word' as const,
      fontSize: '0.95rem',
      lineHeight: 1.4
    },
    inputContainer: {
      padding: '16px',
      borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
      backgroundColor: brandConfig.colors.barnWhite
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      color: brandConfig.colors.neutralGray,
      fontSize: '0.875rem',
      fontStyle: 'italic'
    }
  };

  const renderMessage = (message: IChatMessage) => {
    const isUser = message.senderType === 'user';
    const isSystem = message.messageType === 'system' || message.messageType === 'handoff';
    
    return (
      <Box
        key={message.id}
        sx={{
          ...styles.message,
          ...(isUser ? styles.userMessage : isSystem ? styles.systemMessage : styles.aiMessage)
        }}
      >
        {!isUser && !isSystem && (
          <Avatar sx={{ width: 32, height: 32, backgroundColor: brandConfig.colors.ribbonBlue }}>
            {getMessageIcon(message)}
          </Avatar>
        )}
        
        <Box
          className="message-bubble"
          sx={{
            ...styles.messageBubble,
            ...(isUser && styles.userMessage['& .message-bubble']),
            ...(isSystem && styles.systemMessage['& .message-bubble']),
            ...(!isUser && !isSystem && styles.aiMessage['& .message-bubble'])
          }}
        >
          <Typography variant="body2" sx={{ margin: 0 }}>
            {message.content}
          </Typography>
          
          {message.metadata?.suggestedActions && (
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {message.metadata.suggestedActions.map((action, index) => (
                <Chip
                  key={index}
                  label={action}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          )}
        </Box>
        
        {isUser && (
          <Avatar sx={{ width: 32, height: 32, backgroundColor: brandConfig.colors.stableMahogany }}>
            <PersonIcon sx={{ fontSize: '1.2rem' }} />
          </Avatar>
        )}
      </Box>
    );
  };

  return (
    <>
      {/* Chat FAB */}
      <Tooltip title="Live Chat Support">
        <Fab sx={styles.fab} onClick={toggleChat}>
          {isOpen ? <CloseIcon /> : <ChatIcon />}
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: brandConfig.colors.errorRed,
                color: brandConfig.colors.barnWhite,
                borderRadius: '50%',
                minWidth: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Fab>
      </Tooltip>

      {/* Chat Window */}
      {isOpen && (
        <Paper sx={styles.chatWindow}>
          {/* Header */}
          <Box sx={styles.header}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupportIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                One Barn Support
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusChip()}
              <IconButton 
                size="small" 
                onClick={toggleChat}
                sx={{ color: brandConfig.colors.barnWhite }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={styles.messagesContainer}>
            {messages.length === 0 && !currentSession ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AIIcon sx={{ fontSize: '3rem', color: brandConfig.colors.ribbonBlue, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Welcome to One Barn Support!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  I'm your AI assistant. I can help with horses, training, billing, and more. 
                  If needed, I'll connect you with a live agent.
                </Typography>
              </Box>
            ) : (
              messages.map(renderMessage)
            )}
            
            {isTyping && (
              <Box sx={styles.typingIndicator}>
                <CircularProgress size={16} />
                <Typography variant="body2">
                  {currentSession?.status === 'with_agent' 
                    ? `${currentSession.assignedAgentName} is typing...`
                    : 'AI is thinking...'
                  }
                </Typography>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box sx={styles.inputContainer}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={currentSession ? "Type your message..." : "Start a conversation..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={currentSession ? sendMessage : startNewChat}
                disabled={!newMessage.trim() || isTyping}
                sx={{
                  backgroundColor: brandConfig.colors.stableMahogany,
                  color: brandConfig.colors.barnWhite,
                  '&:hover': {
                    backgroundColor: brandConfig.colors.hunterGreen
                  },
                  '&:disabled': {
                    backgroundColor: brandConfig.colors.neutralGray
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            
            {currentSession?.status === 'waiting_for_agent' && (
              <Box sx={{ mt: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  You're #2 in queue • Average wait: 3-5 minutes
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </>
  );
};

export default LiveChatWidget; 