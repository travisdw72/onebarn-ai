/**
 * Centralized API Client
 * Handles authentication, tenant isolation, and request/response interceptors
 * 
 * @description Configuration-driven API client with zero trust security
 * @author One Barn Development Team
 * @since v1.0.0
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'https://api.onebarn.com',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
};

// Request ID generation
const generateRequestId = (): string => uuidv4();

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const { token, tenant } = JSON.parse(authData);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (tenant) {
          config.headers['X-Tenant-ID'] = tenant;
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }
    
    // Add security headers
    config.headers['X-Request-ID'] = generateRequestId();
    config.headers['X-Client-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = 'web';
    config.headers['X-Timestamp'] = new Date().toISOString();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.debug('API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn('Authentication failed, clearing auth data');
      localStorage.removeItem('auth');
      
      // Only redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle authorization errors
    if (error.response?.status === 403) {
      console.warn('Access forbidden:', error.response.data);
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
      console.error('Network error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Retry logic for failed requests
const retryRequest = async (error: any, retryCount: number = 0): Promise<any> => {
  if (retryCount >= API_CONFIG.maxRetries) {
    return Promise.reject(error);
  }
  
  // Only retry on network errors or 5xx server errors
  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'NETWORK_ERROR' ||
    (error.response?.status >= 500 && error.response?.status < 600)
  ) {
    await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * (retryCount + 1)));
    
    try {
      return await apiClient.request(error.config);
    } catch (retryError) {
      return retryRequest(retryError, retryCount + 1);
    }
  }
  
  return Promise.reject(error);
};

// Add retry logic to interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => retryRequest(error)
);

// Export default instance
export default apiClient;

// Health check method
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

// Utility methods
export const setAuthToken = (token: string): void => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const setTenantId = (tenantId: string): void => {
  apiClient.defaults.headers.common['X-Tenant-ID'] = tenantId;
};

export const clearAuth = (): void => {
  delete apiClient.defaults.headers.common['Authorization'];
  delete apiClient.defaults.headers.common['X-Tenant-ID'];
  localStorage.removeItem('auth');
}; 