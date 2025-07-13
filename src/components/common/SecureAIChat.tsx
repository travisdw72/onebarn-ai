// Secure AI Chat Component - Zero Trust Implementation
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Collapse,
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { secureAIService } from '../../services/secureAIService';
import type { User } from '../../config/adminDashboardData';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  securityLevel?: 'safe' | 'filtered' | 'blocked';
  auditId?: string;
  confidence?: number;
}

interface SecureAIChatProps {
  user: User;
  context?: 'dashboard' | 'horse-profile' | 'training' | 'health';
}

export const SecureAIChat: React.FC<SecureAIChatProps> = ({ user, context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await secureAIService.secureChat({
        question: userMessage.content,
        user,
        context
      });

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.answer,
        timestamp: new Date(),
        securityLevel: response.securityLevel,
        auditId: response.auditId,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        securityLevel: 'blocked',
        confidence: 0
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getSecurityIcon = (level?: 'safe' | 'filtered' | 'blocked') => {
    switch (level) {
      case 'safe':
        return <ShieldIcon sx={{ color: 'success.main', fontSize: 16 }} />;
      case 'filtered':
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />;
      case 'blocked':
        return <BlockIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getSecurityColor = (level?: 'safe' | 'filtered' | 'blocked') => {
    switch (level) {
      case 'safe':
        return 'success';
      case 'filtered':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const SecurityInfoPanel = () => (
    <Collapse in={showSecurityInfo}>
      <Alert 
        severity="info" 
        sx={{ mb: 2, fontSize: '0.75rem' }}
        icon={<SecurityIcon fontSize="small" />}
      >
        <Typography variant="caption" display="block">
          <strong>🔒 Zero Trust AI Security:</strong>
        </Typography>
        <Typography variant="caption" display="block">
          • Only your authorized data is used for responses
        </Typography>
        <Typography variant="caption" display="block">
          • All interactions are logged for audit compliance
        </Typography>
        <Typography variant="caption" display="block">
          • Responses are filtered for data leaks
        </Typography>
        <Typography variant="caption" display="block">
          • Role: {user.role} | Permissions: {user.permissions.length} active
        </Typography>
      </Alert>
    </Collapse>
  );

  if (!isOpen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 10, sm: 20 },
          right: { xs: 10, sm: 20 },
          zIndex: 9999
        }}
      >
        <Tooltip title="AI Assistant (Secure)">
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              width: { xs: 50, sm: 60 },
              height: { xs: 50, sm: 60 },
              backgroundColor: '#2C5530', // hunterGreen
              color: 'white',
              '&:hover': {
                backgroundColor: '#1F3D23', // darker hunterGreen
              },
              boxShadow: 3
            }}
          >
            <Badge
              badgeContent={<SecurityIcon sx={{ fontSize: 12 }} />}
              color="success"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <ChatIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 10, sm: 20 },
        right: { xs: 10, sm: 20 },
        left: { xs: 10, sm: 'auto' },
        zIndex: 9999,
        width: { 
          xs: 'calc(100vw - 20px)', 
          sm: isExpanded ? 450 : 350 
        },
        height: { 
          xs: isExpanded ? '80vh' : '60vh', 
          sm: isExpanded ? 600 : 400 
        },
        maxWidth: { xs: '100%', sm: 450 },
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: { xs: 1, sm: 2 },
            backgroundColor: '#2C5530', // hunterGreen
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon fontSize="small" />
            <Typography 
              variant="subtitle2" 
              fontWeight="bold"
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Secure AI Assistant
            </Typography>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold"
              sx={{ 
                fontSize: '0.8rem',
                display: { xs: 'block', sm: 'none' }
              }}
            >
              AI Chat
            </Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '0.7rem',
                height: 20
              }}
            />
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => setShowSecurityInfo(!showSecurityInfo)}
              sx={{ color: 'white', mr: 1 }}
            >
              <SecurityIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{ color: 'white', mr: 1 }}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Security Info Panel */}
        <SecurityInfoPanel />

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 1,
            backgroundColor: '#f5f5f5'
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                👋 Hi {user.name}! I'm your secure AI assistant.
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Ask me about your horses, training, or health records.
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                mb: 1,
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  maxWidth: '80%',
                  backgroundColor: message.type === 'user' ? '#2C5530' : 'white', // hunterGreen for user messages
                  color: message.type === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography variant="body2">
                  {message.content}
                </Typography>
                
                {message.type === 'ai' && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getSecurityIcon(message.securityLevel)}
                    <Chip
                      label={message.securityLevel || 'safe'}
                      size="small"
                      color={getSecurityColor(message.securityLevel) as any}
                      sx={{ fontSize: '0.6rem', height: 16 }}
                    />
                    {message.confidence !== undefined && (
                      <Chip
                        label={`${Math.round(message.confidence * 100)}%`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.6rem', height: 16 }}
                      />
                    )}
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Analyzing securely...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: { xs: 1, sm: 2 }, backgroundColor: 'white', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about your horses..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              multiline
              maxRows={3}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              color="primary"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}; 