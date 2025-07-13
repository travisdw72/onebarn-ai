import axios, { AxiosResponse } from 'axios';
import { IAIAlert, IFilterState, IMonitoringMetric } from '../config/aiMonitorConfig.interface';

// API client configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.onebarn.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for authentication and tenant headers
apiClient.interceptors.request.use(
  (config) => {
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
    config.headers['X-Client-Version'] = process.env.REACT_APP_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = 'web';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - possibly redirect to login
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface IAlertQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Partial<IFilterState>;
  includeResolved?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

interface IAlertResponse {
  alerts: IAIAlert[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface IMetricsResponse {
  metrics: IMonitoringMetric[];
  timestamp: string;
  summary: {
    totalAlerts: number;
    activeAlerts: number;
    criticalAlerts: number;
    averageConfidence: number;
  };
}

interface IAcknowledgeRequest {
  alertId: string;
  comment?: string;
  acknowledgedBy: string;
}

interface IEscalateRequest {
  alertId: string;
  escalationLevel: string;
  reason: string;
  escalatedBy: string;
}

interface IRealtimeSubscription {
  id: string;
  onMessage: (data: any) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

class AIMonitorService {
  private subscriptions: Map<string, WebSocket> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private maxRetryAttempts = 5;

  /**
   * Fetch alerts with filtering and pagination
   */
  async fetchAlerts(params: IAlertQueryParams = {}): Promise<IAlertResponse> {
    try {
      const queryParams = this.buildQueryParams(params);
      
      const response: AxiosResponse<IAlertResponse> = await apiClient.get('/api/v1/ai/alerts', {
        params: queryParams
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  /**
   * Fetch a single alert by ID
   */
  async fetchAlert(alertId: string): Promise<IAIAlert> {
    try {
      const response: AxiosResponse<{ alert: IAIAlert }> = await apiClient.get(`/api/v1/ai/alerts/${alertId}`);
      return response.data.alert;
    } catch (error) {
      console.error('Failed to fetch alert:', error);
      throw new Error('Failed to fetch alert');
    }
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(request: IAcknowledgeRequest): Promise<IAIAlert> {
    try {
      const response: AxiosResponse<{ alert: IAIAlert }> = await apiClient.post(
        `/api/v1/ai/alerts/${request.alertId}/acknowledge`,
        {
          comment: request.comment,
          acknowledgedBy: request.acknowledgedBy,
          timestamp: new Date().toISOString()
        }
      );

      return response.data.alert;
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw new Error('Failed to acknowledge alert');
    }
  }

  /**
   * Escalate an alert
   */
  async escalateAlert(request: IEscalateRequest): Promise<IAIAlert> {
    try {
      const response: AxiosResponse<{ alert: IAIAlert }> = await apiClient.post(
        `/api/v1/ai/alerts/${request.alertId}/escalate`,
        {
          escalationLevel: request.escalationLevel,
          reason: request.reason,
          escalatedBy: request.escalatedBy,
          timestamp: new Date().toISOString()
        }
      );

      return response.data.alert;
    } catch (error) {
      console.error('Failed to escalate alert:', error);
      throw new Error('Failed to escalate alert');
    }
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string, resolvedBy: string, comment?: string): Promise<IAIAlert> {
    try {
      const response: AxiosResponse<{ alert: IAIAlert }> = await apiClient.post(
        `/api/v1/ai/alerts/${alertId}/resolve`,
        {
          resolvedBy,
          comment,
          timestamp: new Date().toISOString()
        }
      );

      return response.data.alert;
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      throw new Error('Failed to resolve alert');
    }
  }

  /**
   * Fetch monitoring metrics
   */
  async fetchMetrics(
    timeRange: { start: string; end: string },
    metricTypes?: string[]
  ): Promise<IMetricsResponse> {
    try {
      const params: any = {
        startDate: timeRange.start,
        endDate: timeRange.end
      };

      if (metricTypes && metricTypes.length > 0) {
        params.metricTypes = metricTypes.join(',');
      }

      const response: AxiosResponse<IMetricsResponse> = await apiClient.get('/api/v1/ai/metrics', {
        params
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      throw new Error('Failed to fetch metrics');
    }
  }

  /**
   * Subscribe to real-time alert updates
   */
  subscribeToRealtime(
    tenantId: string,
    onMessage: (data: any) => void,
    onError: (error: Error) => void = () => {},
    onClose: () => void = () => {}
  ): string {
    const subscriptionId = generateSubscriptionId();
    
    try {
      const wsUrl = this.buildWebSocketUrl(tenantId);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Real-time subscription established:', subscriptionId);
        
        // Send authentication message
        const authData = localStorage.getItem('auth');
        if (authData) {
          try {
            const { token } = JSON.parse(authData);
            ws.send(JSON.stringify({
              type: 'auth',
              token,
              tenantId,
              subscriptionId
            }));
          } catch (error) {
            console.error('Failed to send auth message:', error);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different message types
          switch (data.type) {
            case 'alert':
              onMessage(data.payload);
              break;
            case 'metric_update':
              onMessage(data.payload);
              break;
            case 'connection_established':
              console.log('WebSocket connection confirmed');
              break;
            case 'error':
              onError(new Error(data.message || 'WebSocket error'));
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          onError(new Error('Failed to parse message'));
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        onError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.subscriptions.delete(subscriptionId);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.shouldRetry(subscriptionId)) {
          setTimeout(() => {
            this.retrySubscription(subscriptionId, tenantId, onMessage, onError, onClose);
          }, this.getRetryDelay(subscriptionId));
        } else {
          onClose();
        }
      };

      this.subscriptions.set(subscriptionId, ws);
      
      return subscriptionId;
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      onError(new Error('Failed to establish connection'));
      return subscriptionId;
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscriptionId: string): void {
    const ws = this.subscriptions.get(subscriptionId);
    if (ws) {
      ws.close(1000, 'Unsubscribed');
      this.subscriptions.delete(subscriptionId);
      this.retryAttempts.delete(subscriptionId);
    }
  }

  /**
   * Export alerts to file
   */
  async exportAlerts(
    filters: Partial<IFilterState>,
    format: 'csv' | 'excel' | 'pdf' = 'csv'
  ): Promise<Blob> {
    try {
      const params = {
        ...this.buildQueryParams({ filters }),
        format,
        export: true
      };

      const response = await apiClient.get('/api/v1/ai/alerts/export', {
        params,
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      console.error('Failed to export alerts:', error);
      throw new Error('Failed to export alerts');
    }
  }

  /**
   * Get alert statistics
   */
  async getAlertStatistics(
    timeRange: { start: string; end: string }
  ): Promise<{
    totalAlerts: number;
    alertsBySeverity: Record<string, number>;
    alertsByStatus: Record<string, number>;
    alertsByCategory: Record<string, number>;
    trends: Array<{ date: string; count: number; severity: string }>;
  }> {
    try {
      const response = await apiClient.get('/api/v1/ai/alerts/statistics', {
        params: {
          startDate: timeRange.start,
          endDate: timeRange.end
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch alert statistics:', error);
      throw new Error('Failed to fetch alert statistics');
    }
  }

  /**
   * Get horses for filtering
   */
  async getHorses(): Promise<Array<{ id: string; name: string; status: string }>> {
    try {
      const response = await apiClient.get('/api/v1/horses', {
        params: {
          status: 'active',
          limit: 1000
        }
      });

      return response.data.horses || [];
    } catch (error) {
      console.error('Failed to fetch horses:', error);
      throw new Error('Failed to fetch horses');
    }
  }

  /**
   * Test AI monitoring system
   */
  async testMonitoringSystem(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, { status: string; responseTime: number; message?: string }>;
  }> {
    try {
      const response = await apiClient.get('/api/v1/ai/monitoring/health');
      return response.data;
    } catch (error) {
      console.error('Failed to test monitoring system:', error);
      throw new Error('Failed to test monitoring system');
    }
  }

  // Private helper methods

  private buildQueryParams(params: IAlertQueryParams): any {
    const queryParams: any = {};

    if (params.page !== undefined) queryParams.page = params.page;
    if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params.includeResolved !== undefined) queryParams.includeResolved = params.includeResolved;

    if (params.dateRange) {
      queryParams.startDate = params.dateRange.start;
      queryParams.endDate = params.dateRange.end;
    }

    if (params.filters) {
      if (params.filters.horses && params.filters.horses.length > 0) {
        queryParams.horses = params.filters.horses.join(',');
      }
      if (params.filters.severity && params.filters.severity.length > 0) {
        queryParams.severity = params.filters.severity.join(',');
      }
      if (params.filters.status && params.filters.status.length > 0) {
        queryParams.status = params.filters.status.join(',');
      }
      if (params.filters.categories && params.filters.categories.length > 0) {
        queryParams.categories = params.filters.categories.join(',');
      }
      if (params.filters.confidence) {
        queryParams.minConfidence = params.filters.confidence.min;
        queryParams.maxConfidence = params.filters.confidence.max;
      }
      if (params.filters.locations && params.filters.locations.length > 0) {
        queryParams.locations = params.filters.locations.join(',');
      }
    }

    return queryParams;
  }

  private buildWebSocketUrl(tenantId: string): string {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = process.env.REACT_APP_WS_HOST || window.location.host;
    const wsPath = process.env.REACT_APP_WS_PATH || '/ws';
    
    return `${wsProtocol}//${wsHost}${wsPath}/ai-monitoring?tenant=${tenantId}`;
  }

  private shouldRetry(subscriptionId: string): boolean {
    const attempts = this.retryAttempts.get(subscriptionId) || 0;
    return attempts < this.maxRetryAttempts;
  }

  private getRetryDelay(subscriptionId: string): number {
    const attempts = this.retryAttempts.get(subscriptionId) || 0;
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempts), 16000);
  }

  private retrySubscription(
    subscriptionId: string,
    tenantId: string,
    onMessage: (data: any) => void,
    onError: (error: Error) => void,
    onClose: () => void
  ): void {
    const attempts = this.retryAttempts.get(subscriptionId) || 0;
    this.retryAttempts.set(subscriptionId, attempts + 1);

    console.log(`Retrying WebSocket connection (attempt ${attempts + 1}/${this.maxRetryAttempts})`);

    // Create new subscription with same ID to maintain continuity
    this.subscribeToRealtime(tenantId, onMessage, onError, onClose);
  }
}

// Helper functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSubscriptionId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Export singleton instance
export const aiMonitorService = new AIMonitorService();
export default aiMonitorService; 