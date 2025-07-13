// Hook for Secure AI Chat Integration
import { useState, useCallback } from 'react';
import type { User } from '../config/adminDashboardData';

interface UseSecureAIChatProps {
  user: User;
  context?: 'dashboard' | 'horse-profile' | 'training' | 'health';
}

interface UseSecureAIChatReturn {
  isChatEnabled: boolean;
  enableChat: () => void;
  disableChat: () => void;
  toggleChat: () => void;
  chatContext: string;
  setChatContext: (context: 'dashboard' | 'horse-profile' | 'training' | 'health') => void;
}

export const useSecureAIChat = ({ user, context = 'dashboard' }: UseSecureAIChatProps): UseSecureAIChatReturn => {
  const [isChatEnabled, setIsChatEnabled] = useState(true); // Enable by default
  const [chatContext, setChatContext] = useState(context);

  const enableChat = useCallback(() => {
    setIsChatEnabled(true);
  }, []);

  const disableChat = useCallback(() => {
    setIsChatEnabled(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatEnabled(prev => !prev);
  }, []);

  const handleSetChatContext = useCallback((newContext: 'dashboard' | 'horse-profile' | 'training' | 'health') => {
    setChatContext(newContext);
  }, []);

  return {
    isChatEnabled,
    enableChat,
    disableChat,
    toggleChat,
    chatContext,
    setChatContext: handleSetChatContext
  };
}; 