// Live Agent Dashboard for Support Staff
// Manages multiple chat sessions, escalations, and agent workload

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Divider,
  Paper,
  Tab,
  Tabs
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Assignment as TicketIcon
} from '@mui/icons-material';
import { brandConfig } from '../../config/brandConfig';
import { useAuth } from '../../contexts/AuthContext';
import { chatService, IChatSession, IChatMessage, ILiveAgent } from '../../services/chatService';

interface IAgentDashboardProps {
  agentId?: string;
}

export const AgentDashboard: React.FC<IAgentDashboardProps> = ({ agentId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeSessions, setActiveSessions] = useState<IChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<IChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [agentStatus, setAgentStatus] = useState<ILiveAgent['status']>('online');
  const [refreshKey, setRefreshKey] = useState(0);

  const currentAgentId = agentId || user?.email || 'agent_001';

  // Load agent's active sessions
  useEffect(() => {
    const loadSessions = () => {
      const sessions = chatService.getAgentChatSessions(currentAgentId);
      setActiveSessions(sessions);
      
      // Update selected session if it exists
      if (selectedSession) {
        const updatedSession = chatService.getChatSession(selectedSession.id);
        setSelectedSession(updatedSession);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [currentAgentId, selectedSession, refreshKey]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    try {
      const newMessages = await chatService.sendMessage(
        selectedSession.id,
        currentAgentId,
        user?.email || 'Agent',
        newMessage.trim(),
        'agent'
      );

      setNewMessage('');
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const resolveSession = async (sessionId: string) => {
    await chatService.endChatSession(sessionId, 'resolved');
    setRefreshKey(prev => prev + 1);
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
  };

  const getSessionPriority = (session: IChatSession) => {
    const priorityConfig = {
      'critical': { color: brandConfig.colors.errorRed, label: 'CRITICAL' },
      'high': { color: brandConfig.colors.alertAmber, label: 'HIGH' },
      'medium': { color: brandConfig.colors.ribbonBlue, label: 'MEDIUM' },
      'low': { color: brandConfig.colors.neutralGray, label: 'LOW' }
    };
    return priorityConfig[session.priority];
  };

  const getSessionDuration = (session: IChatSession) => {
    const start = new Date(session.startTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just started';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
  };

  const getLastMessagePreview = (session: IChatSession) => {
    const lastUserMessage = session.messages
      .filter(m => m.senderType === 'user')
      .pop();
    
    return lastUserMessage?.content.substring(0, 60) + '...' || 'No messages yet';
  };

  const styles = {
    container: {
      height: '100vh',
      backgroundColor: brandConfig.colors.arenaSand,
      padding: brandConfig.spacing.lg
    },
    sessionList: {
      height: 'calc(100vh - 200px)',
      overflowY: 'auto' as const
    },
    chatArea: {
      height: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column' as const
    },
    messagesContainer: {
      flexGrow: 1,
      overflowY: 'auto' as const,
      padding: brandConfig.spacing.md,
      backgroundColor: '#f8f9fa',
      maxHeight: 'calc(100vh - 300px)'
    },
    message: {
      marginBottom: brandConfig.spacing.md,
      display: 'flex',
      alignItems: 'flex-start',
      gap: brandConfig.spacing.xs
    },
    userMessage: {
      flexDirection: 'row-reverse' as const,
      '& .message-bubble': {
        backgroundColor: brandConfig.colors.stableMahogany,
        color: brandConfig.colors.barnWhite,
        borderRadius: '18px 18px 4px 18px'
      }
    },
    agentMessage: {
      '& .message-bubble': {
        backgroundColor: brandConfig.colors.hunterGreen,
        color: brandConfig.colors.barnWhite,
        borderRadius: '18px 18px 18px 4px'
      }
    },
    aiMessage: {
      '& .message-bubble': {
        backgroundColor: brandConfig.colors.barnWhite,
        color: brandConfig.colors.midnightBlack,
        borderRadius: '18px 18px 18px 4px',
        border: `1px solid ${brandConfig.colors.ribbonBlue}`
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
      padding: brandConfig.spacing.md,
      borderTop: `1px solid ${brandConfig.colors.sterlingSilver}`,
      backgroundColor: brandConfig.colors.barnWhite
    }
  };

  const renderMessage = (message: IChatMessage) => {
    const isUser = message.senderType === 'user';
    const isAgent = message.senderType === 'agent';
    const isAI = message.senderType === 'ai';
    
    return (
      <Box
        key={message.id}
        sx={{
          ...styles.message,
          ...(isUser ? styles.userMessage : isAgent ? styles.agentMessage : styles.aiMessage)
        }}
      >
        {!isUser && (
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            backgroundColor: isAgent ? brandConfig.colors.hunterGreen : brandConfig.colors.ribbonBlue 
          }}>
            {isAgent ? <PersonIcon /> : <AIIcon />}
          </Avatar>
        )}
        
        <Box
          className="message-bubble"
          sx={{
            ...styles.messageBubble,
            ...(isUser && styles.userMessage['& .message-bubble']),
            ...(isAgent && styles.agentMessage['& .message-bubble']),
            ...(isAI && styles.aiMessage['& .message-bubble'])
          }}
        >
          <Typography variant="body2" sx={{ margin: 0 }}>
            {message.content}
          </Typography>
          <Typography variant="caption" sx={{ 
            opacity: 0.7, 
            fontSize: '0.75rem',
            display: 'block',
            mt: 0.5
          }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Typography>
        </Box>
        
        {isUser && (
          <Avatar sx={{ width: 32, height: 32, backgroundColor: brandConfig.colors.stableMahogany }}>
            <PersonIcon />
          </Avatar>
        )}
      </Box>
    );
  };

  const renderSessionCard = (session: IChatSession) => {
    const priority = getSessionPriority(session);
    const isSelected = selectedSession?.id === session.id;
    
    return (
      <Card
        key={session.id}
        sx={{
          mb: 1,
          cursor: 'pointer',
          border: isSelected ? `2px solid ${brandConfig.colors.stableMahogany}` : '1px solid transparent',
          backgroundColor: isSelected ? `${brandConfig.colors.stableMahogany}10` : brandConfig.colors.barnWhite,
          '&:hover': {
            backgroundColor: `${brandConfig.colors.stableMahogany}05`
          }
        }}
        onClick={() => setSelectedSession(session)}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {session.userName}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Chip
                label={priority.label}
                size="small"
                sx={{
                  backgroundColor: `${priority.color}20`,
                  color: priority.color,
                  fontSize: '0.7rem',
                  height: 20
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {getSessionDuration(session)}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {getLastMessagePreview(session)}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={session.category.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {session.relatedTicketId && (
                <TicketIcon sx={{ fontSize: '1rem', color: brandConfig.colors.ribbonBlue }} />
              )}
              <Badge badgeContent={session.messages.filter(m => m.senderType === 'user').length} color="primary">
                <ChatIcon sx={{ fontSize: '1rem' }} />
              </Badge>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={{ 
        mb: 3, 
        color: brandConfig.colors.stableMahogany,
        fontFamily: brandConfig.typography.fontDisplay,
        fontWeight: brandConfig.typography.weightBold
      }}>
        Live Agent Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Session List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Active Chats ({activeSessions.length})</Typography>
                <IconButton onClick={() => setRefreshKey(prev => prev + 1)}>
                  <RefreshIcon />
                </IconButton>
              </Box>
              
              <Box sx={styles.sessionList}>
                {activeSessions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ChatIcon sx={{ fontSize: '3rem', color: brandConfig.colors.neutralGray, mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      No active chats
                    </Typography>
                  </Box>
                ) : (
                  activeSessions.map(renderSessionCard)
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          {selectedSession ? (
            <Card sx={{ height: '100%' }}>
              {/* Chat Header */}
              <CardContent sx={{ borderBottom: `1px solid ${brandConfig.colors.sterlingSilver}`, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">{selectedSession.userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedSession.category} • {getSessionDuration(selectedSession)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => resolveSession(selectedSession.id)}
                      startIcon={<CheckIcon />}
                    >
                      Resolve
                    </Button>
                    <IconButton onClick={() => setSelectedSession(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>

              {/* Messages */}
              <Box sx={styles.messagesContainer}>
                {selectedSession.messages.map(renderMessage)}
              </Box>

              {/* Input */}
              <Box sx={styles.inputContainer}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your response..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    sx={{
                      backgroundColor: brandConfig.colors.hunterGreen,
                      '&:hover': {
                        backgroundColor: brandConfig.colors.stableMahogany
                      }
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </Card>
          ) : (
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                flexDirection: 'column'
              }}>
                <ChatIcon sx={{ fontSize: '4rem', color: brandConfig.colors.neutralGray, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a chat to start helping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from the active sessions on the left
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentDashboard; 