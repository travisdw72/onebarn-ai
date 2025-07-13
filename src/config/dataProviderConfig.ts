// ============================================================================
// DATA PROVIDER CONFIGURATION
// ============================================================================
// Easy switching between localStorage (dev) and database (production)

import { localStorageDataProvider } from "../providers/data/LocalStorageDataProvider";
import { createDatabaseProvider } from "../providers/data/DatabaseDataProvider";
import { apiDataProvider, createAPIDataProvider, createHybridAPIDataProvider } from "../providers/data/APIDataProvider";

// Environment Configuration
export const DATA_PROVIDER_CONFIG = {
  // Development: NOW USING API FOR REAL DATABASE CONNECTION
  development: {
    provider: 'api', // ✅ Changed from localStorage to api
    settings: {
      debugMode: true,
      enableLogging: true,
      showSecurityWarnings: true,
      timeout: 30000,
      retryAttempts: 3
    }
  },

  // Staging: Use API with fallback to localStorage
  staging: {
    provider: 'hybrid_api',
    settings: {
      debugMode: true,
      enableLogging: true,
      fallbackToLocalStorage: true,
      showSecurityWarnings: true
    }
  },

  // Production: Use your actual API
  production: {
    provider: 'api',
    settings: {
      debugMode: false,
      enableLogging: false,
      timeout: 30000,
      retryAttempts: 3,
      enableAIAgents: true
    }
  },

  // Test environment with real API
  test: {
    provider: 'api',
    settings: {
      debugMode: true,
      enableLogging: true,
      timeout: 10000,
      retryAttempts: 1,
      enableAIAgents: false
    }
  },

  // Legacy database provider (for backward compatibility)
  database: {
    provider: 'database',
    settings: {
      apiKey: import.meta.env.VITE_DATABASE_API_KEY,
      baseUrl: import.meta.env.VITE_DATABASE_BASE_URL || 'https://your-api.com/api',
      timeout: 30000,
      retryAttempts: 3,
      enableAIAgents: true
    }
  }
} as const;

// Get current environment
const getCurrentEnvironment = (): keyof typeof DATA_PROVIDER_CONFIG => {
  if (import.meta.env.NODE_ENV === 'production') return 'production';
  if (import.meta.env.NODE_ENV === 'test') return 'test';
  return 'development';
};

// Create the appropriate data provider based on environment
export const createDataProvider = () => {
  const env = getCurrentEnvironment();
  const config = DATA_PROVIDER_CONFIG[env];

  // Log only in development
  if (import.meta.env.DEV) {
    console.log(`🔌 Initializing ${config.provider} data provider for ${env} environment`);
  }

  switch (config.provider) {
    case 'api':
      if (import.meta.env.DEV) {
        console.log('🌐 Using API Data Provider with real backend');
      }
      return createAPIDataProvider();

    case 'hybrid_api':
      if (import.meta.env.DEV) {
        console.log('🔄 Using Hybrid API Data Provider with localStorage fallback');
      }
      return createHybridAPIDataProvider();
      
    case 'database':
      if (!config.settings.apiKey) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Database API key not found, falling back to localStorage');
        }
        return localStorageDataProvider();
      }
      
      return createDatabaseProvider(
        config.settings.apiKey,
        config.settings.baseUrl
      );
      
    default:
      if (import.meta.env.DEV) {
        console.warn('⚠️ Unknown provider, falling back to localStorage');
      }
      return localStorageDataProvider();
  }
};

// ============================================================================
// SEAMLESS SWITCHING UTILITIES
// ============================================================================

// Force switch to localStorage (for debugging)
export const createLocalStorageProvider = () => {
  if (import.meta.env.DEV) {
    console.log('🔄 Forcing localStorage data provider');
  }
  return localStorageDataProvider();
};

// Force switch to API (when ready for production)
export const createProductionDataProvider = () => {
  if (import.meta.env.DEV) {
    console.log('🚀 Forcing API data provider for production mode');
  }
  return createAPIDataProvider();
};

// Environment override (useful for testing)
export const createDataProviderForEnvironment = (environment: keyof typeof DATA_PROVIDER_CONFIG) => {
  const config = DATA_PROVIDER_CONFIG[environment];
  
  // Log only in development
  if (import.meta.env.DEV) {
    console.log(`🔧 Override: Using ${config.provider} provider for ${environment} environment`);
  }
  
  switch (config.provider) {
    case 'api':
      return createAPIDataProvider();
    case 'hybrid_api':
      return createHybridAPIDataProvider();
    case 'database':
      return createDatabaseProvider(
        config.settings.apiKey || '',
        config.settings.baseUrl || ''
      );
    default:
      return localStorageDataProvider();
  }
};

// Check if we're ready for API mode
export const isReadyForAPI = (): boolean => {
  // Add your API readiness checks here
  const hasApiEndpoint = !!import.meta.env.VITE_API_BASE_URL;
  const hasAuth = !!localStorage.getItem('auth');
  
  return hasApiEndpoint && hasAuth;
};

// Smart provider selection
export const createSmartDataProvider = () => {
  if (isReadyForAPI()) {
    if (import.meta.env.DEV) {
      console.log('✅ API ready - using API data provider');
    }
    return createAPIDataProvider();
  } else {
    if (import.meta.env.DEV) {
      console.log('⚠️ API not ready - using localStorage provider');
    }
    return localStorageDataProvider();
  }
};

// AI Agent Integration Configuration
export const AI_AGENT_CONFIG = {
  // External AI Agents (from your database provider)
  external: {
    enabled: import.meta.env.VITE_ENABLE_EXTERNAL_AI_AGENTS === 'true',
    baseUrl: import.meta.env.VITE_EXTERNAL_AI_BASE_URL,
    apiKey: import.meta.env.VITE_EXTERNAL_AI_API_KEY,
    endpoints: {
      chat: '/ai/chat',
      analysis: '/ai/analysis',
      insights: '/ai/insights',
      predictions: '/ai/predictions'
    }
  },

  // Your own AI Agents (if you build a Node.js backend)
  internal: {
    enabled: import.meta.env.VITE_ENABLE_INTERNAL_AI_AGENTS === 'true',
    baseUrl: import.meta.env.VITE_INTERNAL_AI_BASE_URL || 'http://localhost:4000',
    endpoints: {
      customAnalysis: '/api/ai/custom-analysis',
      training: '/api/ai/training',
      monitoring: '/api/ai/monitoring'
    }
  }
};

// Helper to check if external AI agents are available
export const isExternalAIAvailable = (): boolean => {
  return AI_AGENT_CONFIG.external.enabled && 
         !!AI_AGENT_CONFIG.external.apiKey && 
         !!AI_AGENT_CONFIG.external.baseUrl;
};

// Helper to check if internal AI agents are available
export const isInternalAIAvailable = (): boolean => {
  return AI_AGENT_CONFIG.internal.enabled;
};

// Get AI provider priority based on availability
export const getAIProviderPriority = (): string[] => {
  const providers: string[] = [];
  
  if (isExternalAIAvailable()) {
    providers.push('external_ai_agents');
  }
  
  if (isInternalAIAvailable()) {
    providers.push('internal_ai_agents');
  }
  
  // Fallback to configured AI providers
  providers.push('anthropic', 'openai');
  
  return providers;
}; 