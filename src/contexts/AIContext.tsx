import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { aiConfig } from '../config/aiConfig';

interface IAIContext {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  currentProvider: string;
  setCurrentProvider: (provider: string) => void;
  config: typeof aiConfig;
  updateConfig: (newConfig: Partial<typeof aiConfig>) => void;
  status: {
    isConnected: boolean;
    lastUpdate: string | null;
    error: string | null;
  };
}

const AIContext = createContext<IAIContext | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentProvider, setCurrentProvider] = useState(aiConfig.providers.openai.enabled ? 'openai' : 'anthropic');
  const [config, setConfig] = useState(aiConfig);
  const [status, setStatus] = useState<{
    isConnected: boolean;
    lastUpdate: string | null;
    error: string | null;
  }>({
    isConnected: false,
    lastUpdate: null,
    error: null
  });

  const updateConfig = (newConfig: Partial<typeof aiConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  };

  // Monitor AI provider connection status
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        // Implement connection check logic here
        setStatus({
          isConnected: true,
          lastUpdate: new Date().toISOString(),
          error: null
        });
      } catch (error) {
        setStatus({
          isConnected: false,
          lastUpdate: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    const interval = setInterval(checkConnection, aiConfig.realtime.processingIntervalMs);
    checkConnection();

    return () => clearInterval(interval);
  }, [currentProvider]);

  const value = {
    isEnabled,
    setIsEnabled,
    currentProvider,
    setCurrentProvider,
    config,
    updateConfig,
    status
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 