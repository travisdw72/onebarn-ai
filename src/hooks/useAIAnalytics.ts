// React Hooks for AI Analytics Integration
// Provides easy-to-use hooks for accessing AI insights and analytics

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsEngine, type AnalyticsInsight, type HorseData } from '../services/analyticsEngine';
import { aiService } from '../services/aiProviders';
import { aiConfig } from '../config/aiConfig';

// Hook for getting AI insights for a specific horse
export const useHorseInsights = (horseId: string) => {
  const [refreshInterval, setRefreshInterval] = useState(aiConfig.insights.refreshIntervalMinutes * 60 * 1000);

  const {
    data: insights,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['horse-insights', horseId],
    queryFn: async () => {
      // This would typically fetch from your backend
      // For now, we'll simulate with mock data
      const mockHorseData = generateMockHorseData(horseId);
      return await analyticsEngine.generateDailyInsights([mockHorseData]);
    },
    refetchInterval: refreshInterval,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!horseId
  });

  const refreshInsights = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    insights: insights || [],
    isLoading,
    error,
    refreshInsights,
    setRefreshInterval
  };
};

// Hook for getting insights for multiple horses
export const useStableInsights = (horseIds: string[]) => {
  const {
    data: insights,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['stable-insights', horseIds.sort().join(',')],
    queryFn: async () => {
      const mockHorseData = horseIds.map(generateMockHorseData);
      return await analyticsEngine.generateDailyInsights(mockHorseData);
    },
    refetchInterval: aiConfig.insights.refreshIntervalMinutes * 60 * 1000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: horseIds.length > 0
  });

  return {
    insights: insights || [],
    isLoading,
    error,
    refreshInsights: refetch
  };
};

// Hook for real-time AI analysis
export const useAIAnalysis = () => {
  const queryClient = useQueryClient();

  const analysisMutation = useMutation({
    mutationFn: async (request: {
      type: 'health' | 'performance' | 'financial' | 'behavioral';
      data: any;
      horseId: string;
      context?: string;
    }) => {
      return await aiService.analyze({
        type: request.type,
        data: request.data,
        horseId: request.horseId,
        context: request.context
      });
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['horse-insights', variables.horseId] });
      queryClient.invalidateQueries({ queryKey: ['stable-insights'] });
    }
  });

  return {
    analyzeData: analysisMutation.mutate,
    isAnalyzing: analysisMutation.isPending,
    analysisResult: analysisMutation.data,
    analysisError: analysisMutation.error
  };
};

// Hook for tracking analytics events
export const useAnalyticsTracking = () => {
  const trackEvent = useCallback((eventType: string, data: any) => {
    analyticsEngine.trackEvent(eventType, data);
  }, []);

  const trackHorseView = useCallback((horseId: string, userId: string) => {
    trackEvent('horse_view', { horseId, userId });
  }, [trackEvent]);

  const trackTrainingSession = useCallback((horseId: string, sessionData: any) => {
    trackEvent('training_session', { horseId, ...sessionData });
  }, [trackEvent]);

  const trackHealthEvent = useCallback((horseId: string, healthData: any) => {
    trackEvent('health_event', { horseId, ...healthData });
  }, [trackEvent]);

  const trackFinancialEvent = useCallback((horseId: string, financialData: any) => {
    trackEvent('financial_event', { horseId, ...financialData });
  }, [trackEvent]);

  return {
    trackEvent,
    trackHorseView,
    trackTrainingSession,
    trackHealthEvent,
    trackFinancialEvent
  };
};

// Hook for AI provider status and testing
export const useAIProviders = () => {
  const [providerStatus, setProviderStatus] = useState<{ [key: string]: boolean }>({});

  const testProviders = useCallback(async () => {
    try {
      const results = await aiService.testProviders();
      setProviderStatus(results);
      return results;
    } catch (error) {
      console.error('Failed to test AI providers:', error);
      return {};
    }
  }, []);

  useEffect(() => {
    testProviders();
  }, [testProviders]);

  const availableProviders = aiService.getAvailableProviders();

  return {
    availableProviders,
    providerStatus,
    testProviders,
    isAnyProviderAvailable: Object.values(providerStatus).some(status => status)
  };
};

// Hook for insight filtering and sorting
export const useInsightFilters = (insights: AnalyticsInsight[]) => {
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'health' | 'performance' | 'financial' | 'behavioral',
    priority: 'all' as 'all' | 'low' | 'medium' | 'high' | 'critical',
    minConfidence: 0,
    sortBy: 'priority' as 'priority' | 'confidence' | 'riskScore' | 'createdAt'
  });

  const filteredInsights = insights.filter(insight => {
    if (filters.type !== 'all' && insight.type !== filters.type) return false;
    if (filters.priority !== 'all' && insight.priority !== filters.priority) return false;
    if (insight.confidence < filters.minConfidence) return false;
    return true;
  });

  const sortedInsights = [...filteredInsights].sort((a, b) => {
    switch (filters.sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'confidence':
        return b.confidence - a.confidence;
      case 'riskScore':
        return b.riskScore - a.riskScore;
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return {
    filteredInsights: sortedInsights,
    filters,
    setFilters,
    totalInsights: insights.length,
    filteredCount: sortedInsights.length
  };
};

// Hook for insight statistics
export const useInsightStats = (insights: AnalyticsInsight[]) => {
  const stats = {
    total: insights.length,
    byType: {
      health: insights.filter(i => i.type === 'health').length,
      performance: insights.filter(i => i.type === 'performance').length,
      financial: insights.filter(i => i.type === 'financial').length,
      behavioral: insights.filter(i => i.type === 'behavioral').length
    },
    byPriority: {
      critical: insights.filter(i => i.priority === 'critical').length,
      high: insights.filter(i => i.priority === 'high').length,
      medium: insights.filter(i => i.priority === 'medium').length,
      low: insights.filter(i => i.priority === 'low').length
    },
    averageConfidence: insights.length > 0 
      ? insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length 
      : 0,
    averageRiskScore: insights.length > 0 
      ? insights.reduce((sum, i) => sum + i.riskScore, 0) / insights.length 
      : 0,
    byProvider: insights.reduce((acc, insight) => {
      acc[insight.aiProvider] = (acc[insight.aiProvider] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number })
  };

  return stats;
};

// Hook for competition readiness analysis
export const useCompetitionReadiness = (horseId: string, competitionDate?: Date) => {
  const {
    data: readinessAnalysis,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['competition-readiness', horseId, competitionDate?.toISOString()],
    queryFn: async () => {
      if (!competitionDate) return null;
      
      const mockHorseData = generateMockHorseData(horseId);
      const performanceOptimizer = new (await import('../services/analyticsEngine')).PerformanceOptimizer();
      
      return await performanceOptimizer.projectCompetitionReadiness(mockHorseData, competitionDate);
    },
    enabled: !!horseId && !!competitionDate,
    staleTime: 30 * 60 * 1000 // 30 minutes
  });

  return {
    readinessAnalysis,
    isLoading,
    error,
    refreshAnalysis: refetch
  };
};

// Mock data generator for development/testing
function generateMockHorseData(horseId: string): HorseData {
  return {
    horseId,
    horseName: `Horse ${horseId}`,
    age: Math.floor(Math.random() * 15) + 3,
    breed: ['Thoroughbred', 'Quarter Horse', 'Arabian', 'Warmblood'][Math.floor(Math.random() * 4)],
    discipline: ['Dressage', 'Jumping', 'Eventing', 'Racing'][Math.floor(Math.random() * 4)],
    lastUpdated: new Date(),
    healthMetrics: {
      vitals: {
        heartRate: Math.floor(Math.random() * 20) + 28,
        temperature: Math.random() * 2 + 99,
        respiratoryRate: Math.floor(Math.random() * 10) + 8,
        weight: Math.floor(Math.random() * 300) + 900
      },
      feeding: {
        schedule: ['6:00 AM', '12:00 PM', '6:00 PM'],
        intake: Math.random() * 5 + 15,
        waterConsumption: Math.random() * 20 + 30
      },
      activity: {
        dailyMovement: Math.floor(Math.random() * 5000) + 3000,
        restPeriods: Math.floor(Math.random() * 8) + 4,
        exerciseIntensity: Math.random() * 0.5 + 0.3
      },
      veterinaryHistory: []
    },
    performanceMetrics: {
      training: {
        sessionsPerWeek: Math.floor(Math.random() * 4) + 3,
        averageIntensity: Math.random() * 0.4 + 0.6,
        skillProgression: {
          'basic_movements': Math.random(),
          'advanced_movements': Math.random() * 0.8,
          'competition_readiness': Math.random() * 0.9
        },
        consistency: Math.random() * 0.3 + 0.7
      },
      competition: {
        results: [],
        readinessScore: Math.random() * 0.4 + 0.6,
        peakPerformanceDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
      },
      recovery: {
        averageRecoveryTime: Math.random() * 12 + 12,
        fatigueLevel: Math.random() * 0.4 + 0.1,
        restDaysPerWeek: Math.floor(Math.random() * 3) + 1
      }
    },
    financialMetrics: {
      costs: {
        boarding: Math.random() * 500 + 800,
        veterinary: Math.random() * 200 + 100,
        training: Math.random() * 400 + 300,
        competition: Math.random() * 300 + 200,
        equipment: Math.random() * 150 + 100,
        total: 0
      },
      revenue: {
        competitions: Math.random() * 1000,
        sales: 0,
        breeding: Math.random() * 500,
        lessons: Math.random() * 300,
        total: 0
      },
      roi: (Math.random() - 0.3) * 100,
      projectedCosts: {}
    },
    behavioralMetrics: {
      patterns: {
        feedingBehavior: ['eager', 'normal', 'reluctant'][Math.floor(Math.random() * 3)],
        socialInteraction: ['friendly', 'neutral', 'aggressive'][Math.floor(Math.random() * 3)],
        stressIndicators: Math.random() > 0.7 ? ['pacing', 'weaving'] : [],
        trainingResponse: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)]
      },
      anomalies: [],
      baseline: {
        feeding: Math.random(),
        activity: Math.random(),
        social: Math.random()
      }
    }
  };
} 