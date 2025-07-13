/**
 * Centralized API Client for One Barn Platform
 * Handles authentication, tenant isolation, error handling, and request/response patterns
 * 
 * @description Type-safe API client using centralized contracts
 * @compliance HIPAA compliant with tenant isolation and audit trails
 * @security Zero Trust architecture with proper error handling
 * @author One Barn Development Team
 * @since v1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { 
  API_BASE_CONFIG, 
  API_ERROR_CODES, 
  IBaseAPIRequest, 
  IBaseAPIResponse 
} from '../config/apiContracts';
import { brandConfig } from '../config/brandConfig';

// ============================================================================
// API CLIENT INTERFACES
// ============================================================================

export interface IAPIClientConfig {
  tenantId?: string;
  userId?: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  enableLogging?: boolean;
}

export interface IAPIRequestOptions extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipTenant?: boolean;
  retryCount?: number;
}

export interface IAPIError {
  code: number;
  message: string;
  httpStatus: number;
  details?: any;
  requestId?: string;
  timestamp: string;
}

// ============================================================================
// ONE BARN API CLIENT
// ============================================================================

export class OneBarnAPIClient {
  private client: AxiosInstance;
  private config: IAPIClientConfig;
  private requestCount: number = 0;

  constructor(config: IAPIClientConfig = {}) {
    this.config = {
      baseUrl: this.getBaseUrl(),
      timeout: API_BASE_CONFIG.timeout,
      retryAttempts: API_BASE_CONFIG.retryAttempts,
      enableLogging: this.shouldEnableLogging(),
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl + API_BASE_CONFIG.basePath,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Version': brandConfig.application.version,
        'X-Client-Name': brandConfig.application.name
      }
    });

    this.setupInterceptors();
    this.logInitialization();
  }

  // ============================================================================
  // CONFIGURATION METHODS
  // ============================================================================

  private getBaseUrl(): string {
    const env = brandConfig.application.environment || 'development';
    const envConfig = API_BASE_CONFIG.environments[env as keyof typeof API_BASE_CONFIG.environments];
    return envConfig?.baseUrl || API_BASE_CONFIG.environments.development.baseUrl;
  }

  private shouldEnableLogging(): boolean {
    const env = brandConfig.application.environment || 'development';
    const envConfig = API_BASE_CONFIG.environments[env as keyof typeof API_BASE_CONFIG.environments];
    return envConfig?.enableLogging ?? true;
  }

  private logInitialization(): void {
    if (this.config.enableLogging) {
      console.log('🔌 OneBarn API Client initialized:', {
        baseUrl: this.config.baseUrl,
        environment: brandConfig.application.environment,
        timeout: this.config.timeout,
        tenantId: this.config.tenantId ? '***' : 'not set'
      });
    }
  }

  // ============================================================================
  // REQUEST INTERCEPTORS
  // ============================================================================

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.requestCount++;
        
        // Add authentication token
        if (!(config as any).skipAuth) {
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        
        // Add tenant isolation
        if (!(config as any).skipTenant && this.config.tenantId) {
          config.headers['X-Tenant-ID'] = this.config.tenantId;
        }
        
        // Add request tracking
        const requestId = this.generateRequestId();
        config.headers['X-Request-ID'] = requestId;
        config.headers['X-Request-Count'] = this.requestCount.toString();
        
        // Add timestamp
        config.headers['X-Request-Timestamp'] = new Date().toISOString();
        
        // Log request in development
        if (this.config.enableLogging) {
          console.log(`📤 API Request [${requestId}]:`, {
            method: config.method?.toUpperCase(),
            url: config.url,
            tenantId: config.headers['X-Tenant-ID'] ? '***' : 'none',
            hasAuth: !!config.headers.Authorization
          });
        }
        
        return config;
      },
      (error) => {
        console.error('📤 Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        if (this.config.enableLogging) {
          const requestId = response.config.headers['X-Request-ID'];
          console.log(`📥 API Response [${requestId}]:`, {
            status: response.status,
            duration: this.calculateDuration(response.config.headers['X-Request-Timestamp'] as string)
          });
        }
        
        return response;
      },
      (error: AxiosError) => {
        const apiError = this.handleAPIError(error);
        
        // Log error response
        if (this.config.enableLogging) {
          const requestId = error.config?.headers?.['X-Request-ID'];
          console.error(`📥 API Error [${requestId}]:`, {
            status: error.response?.status,
            code: apiError.code,
            message: apiError.message
          });
        }
        
        return Promise.reject(apiError);
      }
    );
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleAPIError(error: AxiosError): IAPIError {
    const requestId = error.config?.headers?.['X-Request-ID'] as string;
    const timestamp = new Date().toISOString();
    
    // Network or timeout errors
    if (!error.response) {
      return {
        code: 5000,
        message: error.code === 'ECONNABORTED' ? 'Request timeout' : 'Network error',
        httpStatus: 0,
        requestId,
        timestamp,
        details: {
          originalError: error.message,
          code: error.code
        }
      };
    }

    // HTTP errors with API error codes
    const responseData = error.response.data as any;
    
    if (responseData?.code && responseData?.message) {
      return {
        code: responseData.code,
        message: responseData.message,
        httpStatus: error.response.status,
        requestId,
        timestamp,
        details: responseData.details
      };
    }

    // Map HTTP status to standard error codes
    const mappedError = this.mapHTTPStatusToError(error.response.status);
    
    return {
      ...mappedError,
      requestId,
      timestamp,
      details: {
        originalError: responseData?.message || error.message,
        responseData
      }
    };
  }

  private mapHTTPStatusToError(status: number): Pick<IAPIError, 'code' | 'message' | 'httpStatus'> {
    switch (status) {
      case 401:
        return API_ERROR_CODES.AUTH_TOKEN_INVALID;
      case 403:
        return API_ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS;
      case 404:
        return { code: 1404, message: 'Resource not found', httpStatus: 404 };
      case 409:
        return { code: 1409, message: 'Resource conflict', httpStatus: 409 };
      case 429:
        return API_ERROR_CODES.TENANT_QUOTA_EXCEEDED;
      case 500:
        return API_ERROR_CODES.SYSTEM_DATABASE_ERROR;
      case 503:
        return API_ERROR_CODES.SYSTEM_EXTERNAL_SERVICE_ERROR;
      default:
        return { code: 5999, message: `HTTP ${status} error`, httpStatus: status };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getAuthToken(): string | null {
    try {
      // Try multiple auth storage methods
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.token || parsed.accessToken || parsed.authToken;
      }
      
      // Fallback to direct token storage
      return localStorage.getItem('auth_token') || localStorage.getItem('authToken');
    } catch (error) {
      console.warn('⚠️ Failed to get auth token:', error);
      return null;
    }
  }

  public generateRequestId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6);
    return `req_${timestamp}_${random}`;
  }

  private calculateDuration(startTime: string): string {
    try {
      const start = new Date(startTime).getTime();
      const end = Date.now();
      return `${end - start}ms`;
    } catch {
      return 'unknown';
    }
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  public async get<T = any>(url: string, options: IAPIRequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.client.get(url, options);
  }

  public async post<T = any>(url: string, data?: any, options: IAPIRequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, options);
  }

  public async put<T = any>(url: string, data?: any, options: IAPIRequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, options);
  }

  public async patch<T = any>(url: string, data?: any, options: IAPIRequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, options);
  }

  public async delete<T = any>(url: string, options: IAPIRequestOptions = {}): Promise<AxiosResponse<T>> {
    return this.client.delete(url, options);
  }

  // ============================================================================
  // TENANT & USER MANAGEMENT
  // ============================================================================

  public setTenantId(tenantId: string): void {
    this.config.tenantId = tenantId;
    if (this.config.enableLogging) {
      console.log('🏢 Tenant ID updated:', tenantId ? '***' : 'cleared');
    }
  }

  public setUserId(userId: string): void {
    this.config.userId = userId;
    if (this.config.enableLogging) {
      console.log('👤 User ID updated:', userId ? '***' : 'cleared');
    }
  }

  public getTenantId(): string | undefined {
    return this.config.tenantId;
  }

  public getUserId(): string | undefined {
    return this.config.userId;
  }

  // ============================================================================
  // REQUEST BUILDERS FOR COMMON PATTERNS
  // ============================================================================

  public buildBaseRequest(additionalData: Partial<IBaseAPIRequest> = {}): IBaseAPIRequest {
    return {
      tenantId: this.config.tenantId || '',
      userId: this.config.userId || '',
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      ...additionalData
    };
  }

  public buildPaginatedRequest(
    pagination?: { current?: number; pageSize?: number },
    additionalData: Partial<IBaseAPIRequest> = {}
  ): IBaseAPIRequest & { pagination?: any } {
    return {
      ...this.buildBaseRequest(additionalData),
      pagination: pagination ? {
        page: pagination.current || 1,
        pageSize: pagination.pageSize || 10
      } : undefined
    };
  }

  // ============================================================================
  // HEALTH & DIAGNOSTICS
  // ============================================================================

  public async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: string; details: any }> {
    try {
      const response = await this.get('/health', { skipAuth: true, skipTenant: true });
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        details: response.data
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        details: error
      };
    }
  }

  public getStats(): {
    requestCount: number;
    baseUrl: string;
    tenantId?: string;
    userId?: string;
  } {
    return {
      requestCount: this.requestCount,
      baseUrl: this.config.baseUrl || '',
      tenantId: this.config.tenantId,
      userId: this.config.userId
    };
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

// Create API client with current auth context
export const createAPIClient = (config?: IAPIClientConfig): OneBarnAPIClient => {
  return new OneBarnAPIClient(config);
};

// Create API client with tenant context
export const createTenantAPIClient = (tenantId: string, userId?: string): OneBarnAPIClient => {
  return new OneBarnAPIClient({ tenantId, userId });
};

// Default singleton instance (for simple usage)
export const apiClient = new OneBarnAPIClient();

export default apiClient; 