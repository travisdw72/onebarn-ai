/**
 * AI Monitoring Hook
 * Provides AI monitoring functionality for dashboards
 * 
 * @description Configuration-driven hook for AI monitoring with alerts and real-time data
 * @author One Barn Development Team
 * @since v1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/apiClient';

interface IAIAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  horseId?: string;
  timestamp: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

interface IAlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  acknowledged: number;
  unacknowledged: number;
}

interface IFilters {
  severity?: string;
  timeRange?: string;
  category?: string;
  status?: string;
  horseName?: string;
}

interface IPagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

interface IUseAIMonitoringReturn {
  alerts: IAIAlert[];
  alertSummary: IAlertSummary;
  isLoading: boolean;
  error: string | null;
  filters: IFilters;
  pagination: IPagination;
  isRealTimeConnected: boolean;
  lastUpdate: Date | null;
  refreshAlerts: () => Promise<void>;
  updateFilters: (newFilters: IFilters) => void;
  acknowledgAlert: (alertId: string, comment: string, userId: string) => Promise<void>;
  escalateAlert: (alertId: string, level: string, reason: string, userId: string) => Promise<void>;
  resolveAlert: (alertId: string, userId: string, comment: string) => Promise<void>;
}

export const useAIMonitoring = (tenantId: string): IUseAIMonitoringReturn => {
  const [alerts, setAlerts] = useState<IAIAlert[]>([]);
  const [alertSummary, setAlertSummary] = useState<IAlertSummary>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    acknowledged: 0,
    unacknowledged: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilters>({
    severity: 'all',
    timeRange: '24h',
    category: 'all',
    status: 'all'
  });
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    limit: 50,
    total: 0,
    hasMore: false
  });
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebSocket connection for real-time updates
  const initializeWebSocket = useCallback(() => {
    if (!tenantId) return;

    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3001'}/ai-monitoring?tenantId=${tenantId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('AI Monitoring WebSocket connected');
        setIsRealTimeConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'alert_update') {
            setAlerts(prevAlerts => {
              const existingIndex = prevAlerts.findIndex(alert => alert.id === data.alert.id);
              if (existingIndex >= 0) {
                // Update existing alert
                const updatedAlerts = [...prevAlerts];
                updatedAlerts[existingIndex] = data.alert;
                return updatedAlerts;
              } else {
                // Add new alert
                return [data.alert, ...prevAlerts];
              }
            });
            setLastUpdate(new Date());
          } else if (data.type === 'summary_update') {
            setAlertSummary(data.summary);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('AI Monitoring WebSocket disconnected');
        setIsRealTimeConnected(false);
        
        // Attempt to reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          initializeWebSocket();
        }, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error('AI Monitoring WebSocket error:', error);
        setError('Real-time connection error');
      };

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      setError('Failed to establish real-time connection');
    }
  }, [tenantId]);

  // Fetch alerts from API
  const fetchAlerts = useCallback(async () => {
    if (!tenantId) return;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        tenantId,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await apiClient.get(`/api/v1/ai-monitoring/alerts?${params}`);
      
      if (response.data.success) {
        setAlerts(response.data.alerts);
        setAlertSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          hasMore: response.data.hasMore
        }));
        setLastUpdate(new Date());
      } else {
        throw new Error(response.data.message || 'Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch alerts');
      
      // Fallback to mock data for development
      setAlerts([
        {
          id: '1',
          type: 'health_anomaly',
          severity: 'high',
          title: 'Health Anomaly Detected',
          description: 'Unusual heart rate pattern detected in Thunder',
          horseId: 'horse-1',
          timestamp: new Date().toISOString(),
          isAcknowledged: false
        },
        {
          id: '2',
          type: 'behavior_change',
          severity: 'medium',
          title: 'Behavior Change',
          description: 'Decreased activity levels observed',
          horseId: 'horse-2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isAcknowledged: false
        }
      ]);
      setAlertSummary({
        total: 2,
        critical: 0,
        high: 1,
        medium: 1,
        low: 0,
        acknowledged: 0,
        unacknowledged: 2
      });
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, filters, pagination.page, pagination.limit]);

  // Refresh alerts
  const refreshAlerts = useCallback(async () => {
    await fetchAlerts();
  }, [fetchAlerts]);

  // Update filters
  const updateFilters = useCallback((newFilters: IFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Acknowledge alert
  const acknowledgAlert = useCallback(async (alertId: string, comment: string, userId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/ai-monitoring/alerts/${alertId}/acknowledge`, {
        comment,
        userId,
        tenantId
      });

      if (response.data.success) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, isAcknowledged: true, acknowledgedBy: userId, acknowledgedAt: new Date().toISOString() }
            : alert
        ));
        await refreshAlerts(); // Refresh to get updated summary
      } else {
        throw new Error(response.data.message || 'Failed to acknowledge alert');
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }, [tenantId, refreshAlerts]);

  // Escalate alert
  const escalateAlert = useCallback(async (alertId: string, level: string, reason: string, userId: string) => {
    try {
      const response = await apiClient.post(`/api/v1/ai-monitoring/alerts/${alertId}/escalate`, {
        level,
        reason,
        userId,
        tenantId
      });

      if (response.data.success) {
        await refreshAlerts(); // Refresh to get updated data
      } else {
        throw new Error(response.data.message || 'Failed to escalate alert');
      }
    } catch (error) {
      console.error('Error escalating alert:', error);
      throw error;
    }
  }, [tenantId, refreshAlerts]);

  // Resolve alert
  const resolveAlert = useCallback(async (alertId: string, userId: string, comment: string) => {
    try {
      const response = await apiClient.post(`/api/v1/ai-monitoring/alerts/${alertId}/resolve`, {
        userId,
        comment,
        tenantId
      });

      if (response.data.success) {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
        await refreshAlerts(); // Refresh to get updated summary
      } else {
        throw new Error(response.data.message || 'Failed to resolve alert');
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }, [tenantId, refreshAlerts]);

  // Initialize monitoring
  useEffect(() => {
    if (tenantId) {
      fetchAlerts();
      initializeWebSocket();
      
      // Set up periodic refresh as fallback
      refreshIntervalRef.current = setInterval(fetchAlerts, 30000); // 30 seconds
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [tenantId, fetchAlerts, initializeWebSocket]);

  // Refetch when filters change
  useEffect(() => {
    if (tenantId) {
      fetchAlerts();
    }
  }, [filters, fetchAlerts]);

  return {
    alerts,
    alertSummary,
    isLoading,
    error,
    filters,
    pagination,
    isRealTimeConnected,
    lastUpdate,
    refreshAlerts,
    updateFilters,
    acknowledgAlert,
    escalateAlert,
    resolveAlert
  };
}; 