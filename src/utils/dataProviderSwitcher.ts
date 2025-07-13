/**
 * Data Provider Switcher Utility
 * Easy switching between localStorage and API for testing
 * 
 * @description Helper functions to test API integration before going live
 * @author One Barn Development Team
 * @since v1.0.0
 */

import { DataProvider } from "@refinedev/core";
import { 
  createDataProvider,
  createLocalStorageProvider,
  createProductionDataProvider,
  createSmartDataProvider,
  isReadyForAPI
} from "../config/dataProviderConfig";

// ============================================================================
// SWITCHING INTERFACE
// ============================================================================

export interface IDataProviderSwitcher {
  current: 'localStorage' | 'api' | 'hybrid';
  provider: DataProvider;
  switchTo: (mode: 'localStorage' | 'api' | 'hybrid' | 'smart') => DataProvider;
  isApiReady: () => boolean;
  getStatus: () => string;
}

// ============================================================================
// PROVIDER SWITCHER IMPLEMENTATION
// ============================================================================

class DataProviderSwitcher implements IDataProviderSwitcher {
  public current: 'localStorage' | 'api' | 'hybrid' = 'localStorage';
  public provider: DataProvider;

  constructor() {
    // Start with environment default
    this.provider = createDataProvider();
    this.detectCurrentMode();
    
    console.log(`🔌 Data Provider Switcher initialized with: ${this.current}`);
  }

  private detectCurrentMode(): void {
    // Simple detection based on provider methods
    const providerString = this.provider.toString();
    
    if (providerString.includes('apiDataProvider')) {
      this.current = 'api';
    } else if (providerString.includes('hybrid')) {
      this.current = 'hybrid';
    } else {
      this.current = 'localStorage';
    }
  }

  public switchTo(mode: 'localStorage' | 'api' | 'hybrid' | 'smart'): DataProvider {
    console.log(`🔄 Switching data provider from ${this.current} to ${mode}`);

    switch (mode) {
      case 'localStorage':
        this.provider = createLocalStorageProvider();
        this.current = 'localStorage';
        break;

      case 'api':
        try {
          this.provider = createProductionDataProvider();
          this.current = 'api';
          console.log('✅ Successfully switched to API provider');
        } catch (error) {
          console.error('❌ Failed to switch to API provider:', error);
          console.log('🔄 Falling back to localStorage');
          this.provider = createLocalStorageProvider();
          this.current = 'localStorage';
        }
        break;

      case 'hybrid':
        try {
          // Import and use hybrid provider
          import('../providers/data/APIDataProvider').then(({ createHybridAPIDataProvider }) => {
            this.provider = createHybridAPIDataProvider();
            this.current = 'hybrid';
            console.log('✅ Successfully switched to hybrid provider');
          });
        } catch (error) {
          console.error('❌ Failed to switch to hybrid provider:', error);
          this.provider = createLocalStorageProvider();
          this.current = 'localStorage';
        }
        break;

      case 'smart':
        this.provider = createSmartDataProvider();
        this.detectCurrentMode();
        console.log(`✅ Smart provider selected: ${this.current}`);
        break;

      default:
        console.warn(`⚠️ Unknown mode: ${mode}, staying with ${this.current}`);
        break;
    }

    return this.provider;
  }

  public isApiReady(): boolean {
    return isReadyForAPI();
  }

  public getStatus(): string {
    const apiReady = this.isApiReady();
    const env = import.meta.env.NODE_ENV || 'development';
    
    return `
🔌 Data Provider Status:
├── Current: ${this.current}
├── Environment: ${env}
├── API Ready: ${apiReady ? '✅' : '❌'}
├── Auth Present: ${!!localStorage.getItem('auth')}
└── Endpoint: ${import.meta.env.VITE_API_BASE_URL || 'not configured'}
    `.trim();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

// Create singleton instance
export const dataProviderSwitcher = new DataProviderSwitcher();

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

// Quick switch functions for testing
export const useLocalStorage = () => {
  return dataProviderSwitcher.switchTo('localStorage');
};

export const useAPI = () => {
  return dataProviderSwitcher.switchTo('api');
};

export const useHybrid = () => {
  return dataProviderSwitcher.switchTo('hybrid');
};

export const useSmart = () => {
  return dataProviderSwitcher.switchTo('smart');
};

// Test function to validate API connectivity
export const testAPIConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing API connection...');
    
    const apiProvider = dataProviderSwitcher.switchTo('api');
    
    // Test with a simple getList call
    const result = await apiProvider.getList({
      resource: 'horses',
      pagination: { current: 1, pageSize: 1 },
      filters: [],
      sorters: []
    });

    const success = Array.isArray(result.data);
    console.log(success ? '✅ API connection successful' : '❌ API connection failed');
    
    return success;
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return false;
  }
};

// Development helper to show current status
export const showDataProviderStatus = () => {
  console.log(dataProviderSwitcher.getStatus());
};

// Easy migration function
export const migrateToAPI = async (): Promise<boolean> => {
  try {
    console.log('🚀 Starting migration to API...');
    
    // Test API connection first
    const apiWorks = await testAPIConnection();
    
    if (apiWorks) {
      // Switch to API permanently
      dataProviderSwitcher.switchTo('api');
      console.log('✅ Migration to API completed successfully');
      return true;
    } else {
      // Switch to hybrid mode for gradual transition
      dataProviderSwitcher.switchTo('hybrid');
      console.log('⚠️ API test failed, using hybrid mode for gradual transition');
      return false;
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    dataProviderSwitcher.switchTo('localStorage');
    return false;
  }
};

export default dataProviderSwitcher; 