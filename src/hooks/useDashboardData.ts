import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * Enhanced Dashboard Data Hook (Phase 1 - Mock Data)
 * Provides mock data for the new dashboard with permission-based filtering
 * Will be enhanced in Phase 2 with real services and WebSocket integration
 */
export const useDashboardData = () => {
  const { tenantId } = useTenant();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Mock data - will be replaced with real data in Phase 2
  const [horses] = useState([
    {
      id: '1',
      name: 'Thunder',
      breed: 'Thoroughbred',
      age: 8,
      status: 'normal',
      healthScore: 92,
      activityLevel: 85,
      moodScore: 78,
      socialScore: 88,
      lastActivity: '2024-01-10T10:30:00Z',
      behaviorPattern: 'normal'
    },
    {
      id: '2',
      name: 'Sunshine',
      breed: 'Quarter Horse',
      age: 6,
      status: 'normal',
      healthScore: 88,
      activityLevel: 92,
      moodScore: 85,
      socialScore: 90,
      lastActivity: '2024-01-10T09:45:00Z',
      behaviorPattern: 'social'
    },
    {
      id: '3',
      name: 'Star',
      breed: 'Arabian',
      age: 10,
      status: 'alert',
      healthScore: 76,
      activityLevel: 65,
      moodScore: 70,
      socialScore: 82,
      lastActivity: '2024-01-10T08:15:00Z',
      behaviorPattern: 'cautious'
    }
  ]);

  const [cameras] = useState([
    {
      id: '1',
      name: 'Barn Main',
      location: 'Main Barn',
      status: 'online',
      horses: ['1', '2'],
      streamUrl: 'https://example.com/stream1'
    },
    {
      id: '2',
      name: 'Pasture East',
      location: 'East Pasture',
      status: 'online',
      horses: ['3'],
      streamUrl: 'https://example.com/stream2'
    },
    {
      id: '3',
      name: 'Arena',
      location: 'Training Arena',
      status: 'offline',
      horses: [],
      streamUrl: 'https://example.com/stream3'
    }
  ]);

  const [alerts] = useState([
    {
      id: '1',
      type: 'behavior',
      severity: 'medium',
      title: 'Unusual Activity',
      description: 'Star showing decreased activity levels',
      timestamp: '2024-01-10T10:00:00Z',
      horseId: '3',
      resolved: false,
      aiConfidence: 78
    },
    {
      id: '2',
      type: 'health',
      severity: 'low',
      title: 'Routine Check',
      description: 'Thunder due for routine health check',
      timestamp: '2024-01-10T09:30:00Z',
      horseId: '1',
      resolved: false,
      aiConfidence: 95
    }
  ]);

  const [insights] = useState([
    {
      id: '1',
      type: 'behavior',
      title: 'Behavioral Pattern Change',
      description: 'Thunder has been showing increased social interaction in the past week',
      confidence: 85,
      trend: 'improving',
      timestamp: '2024-01-10T10:00:00Z',
      horseId: '1',
      actionable: true
    },
    {
      id: '2',
      type: 'health',
      title: 'Activity Level Increase',
      description: 'Sunshine has increased daily activity by 15% compared to last month',
      confidence: 92,
      trend: 'improving',
      timestamp: '2024-01-10T09:45:00Z',
      horseId: '2',
      actionable: false
    }
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Statistics calculations
  const statistics = useCallback(() => {
    const horsesData = horses || [];
    const camerasData = cameras || [];
    const alertsData = alerts || [];

    return {
      totalHorses: horsesData.length,
      activeCameras: camerasData.filter(c => c.status === 'online').length,
      totalCameras: camerasData.length,
      activeAlerts: alertsData.filter(a => !a.resolved).length,
      criticalAlerts: alertsData.filter(a => a.severity === 'critical' && !a.resolved).length,
      systemHealth: {
        cameras: camerasData.length > 0 ? (camerasData.filter(c => c.status === 'online').length / camerasData.length) * 100 : 0,
        alerts: alertsData.filter(a => a.severity === 'critical').length === 0 ? 100 : 50,
        overall: 100 // Always healthy in mock mode
      }
    };
  }, [horses, cameras, alerts]);

  // Emergency data for critical alerts
  const emergencyData = useCallback(() => {
    const criticalAlerts = alerts.filter(a => 
      a.severity === 'critical' && !a.resolved
    );
    
    return {
      hasCriticalAlerts: criticalAlerts.length > 0,
      criticalAlerts,
      affectedHorses: criticalAlerts.map(a => a.horseId).filter(Boolean),
      recommendedActions: criticalAlerts.map(a => a.description).filter(Boolean)
    };
  }, [alerts]);

  // Mock refresh function
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  }, []);

  return {
    // Data
    horses: horses || [],
    cameras: cameras || [],
    alerts: alerts || [],
    insights: insights || [],
    
    // Statistics
    statistics: statistics(),
    emergencyData: emergencyData(),
    
    // Status
    isLoading,
    error,
    connectionStatus: 'connected' as const,
    
    // Actions
    refetch: refreshAllData,
    refetchHorses: refreshAllData,
    refetchCameras: refreshAllData,
    refetchAlerts: refreshAllData,
    refetchInsights: refreshAllData,
    
    // Real-time status
    isConnected: true,
  };
};

// Specialized hooks for specific data types
export const useDashboardAlerts = () => {
  const { alerts, refetchAlerts, isLoading, error } = useDashboardData();
  return {
    alerts,
    refetch: refetchAlerts,
    isLoading,
    error,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && !a.resolved),
    unresolvedAlerts: alerts.filter(a => !a.resolved),
  };
};

export const useDashboardCameras = () => {
  const { cameras, refetchCameras, isLoading, error } = useDashboardData();
  return {
    cameras,
    refetch: refetchCameras,
    isLoading,
    error,
    onlineCameras: cameras.filter(c => c.status === 'online'),
    offlineCameras: cameras.filter(c => c.status === 'offline'),
  };
};

export const useDashboardStats = () => {
  const { statistics, isLoading, error } = useDashboardData();
  return {
    statistics,
    isLoading,
    error,
  };
}; 