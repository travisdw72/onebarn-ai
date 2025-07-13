// Core Analytics Engine for Horse Behavior Analysis and Predictive Insights
// Implements the behavioral analytics standards for One Barn Platform

import { v4 as uuidv4 } from 'uuid';
import { format, subDays, differenceInDays } from 'date-fns';
import { aiConfig } from '../config/aiConfig';
import { aiService, type AIAnalysisRequest } from './aiProviders';

// Types for analytics data
export interface HorseData {
  horseId: string;
  horseName: string;
  age: number;
  breed: string;
  discipline: string;
  lastUpdated: Date;
  healthMetrics: HealthMetrics;
  performanceMetrics: PerformanceMetrics;
  financialMetrics: FinancialMetrics;
  behavioralMetrics: BehavioralMetrics;
}

export interface HealthMetrics {
  vitals: {
    heartRate: number;
    temperature: number;
    respiratoryRate: number;
    weight: number;
  };
  feeding: {
    schedule: string[];
    intake: number;
    waterConsumption: number;
  };
  activity: {
    dailyMovement: number;
    restPeriods: number;
    exerciseIntensity: number;
  };
  veterinaryHistory: VeterinaryRecord[];
}

export interface PerformanceMetrics {
  training: {
    sessionsPerWeek: number;
    averageIntensity: number;
    skillProgression: { [skill: string]: number };
    consistency: number;
  };
  competition: {
    results: CompetitionResult[];
    readinessScore: number;
    peakPerformanceDate?: Date;
  };
  recovery: {
    averageRecoveryTime: number;
    fatigueLevel: number;
    restDaysPerWeek: number;
  };
}

export interface FinancialMetrics {
  costs: {
    boarding: number;
    veterinary: number;
    training: number;
    competition: number;
    equipment: number;
    total: number;
  };
  revenue: {
    competitions: number;
    sales: number;
    breeding: number;
    lessons: number;
    total: number;
  };
  roi: number;
  projectedCosts: { [month: string]: number };
}

export interface BehavioralMetrics {
  patterns: {
    feedingBehavior: string;
    socialInteraction: string;
    stressIndicators: string[];
    trainingResponse: string;
  };
  anomalies: BehaviorAnomaly[];
  baseline: { [behavior: string]: number };
}

export interface VeterinaryRecord {
  date: Date;
  type: string;
  diagnosis: string;
  treatment: string;
  cost: number;
}

export interface CompetitionResult {
  date: Date;
  event: string;
  placement: number;
  score: number;
  earnings: number;
}

export interface BehaviorAnomaly {
  type: string;
  severity: number;
  description: string;
  detectedAt: Date;
  possibleCauses: string[];
}

export interface AnalyticsInsight {
  id: string;
  horseId: string;
  type: 'health' | 'performance' | 'financial' | 'behavioral';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  riskScore: number;
  confidence: number;
  recommendations: Recommendation[];
  createdAt: Date;
  expiresAt: Date;
  aiProvider: string;
}

export interface Recommendation {
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeline: string;
  expectedOutcome: string;
  cost?: number;
}

// Analytics Collector - Data Collection Layer
export class AnalyticsCollector {
  private dataPoints: Map<string, any> = new Map();
  private sessionId: string;
  private buffer: any[] = [];

  constructor() {
    this.sessionId = uuidv4();
  }

  track(eventType: string, data: any): void {
    const enrichedData = {
      eventType,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      horseId: data.horseId,
      userId: data.userId,
      metadata: {
        ...data,
        deviceType: this.detectDevice(),
        location: this.getCurrentLocation(),
        connectionQuality: this.getConnectionQuality()
      }
    };

    this.buffer.push(enrichedData);
    
    if (this.buffer.length >= aiConfig.realtime.batchSize || eventType === 'critical') {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    
    const events = [...this.buffer];
    this.buffer = [];
    
    try {
      await this.sendToAnalytics(events);
    } catch (error) {
      console.error('Failed to send analytics data:', error);
      // Re-queue for offline sync
      this.buffer.unshift(...events);
    }
  }

  private detectDevice(): string {
    return navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop';
  }

  private getCurrentLocation(): string {
    // Placeholder - would integrate with geolocation API
    return 'stable-location';
  }

  private getConnectionQuality(): string {
    // Placeholder - would check network conditions
    return 'good';
  }

  private async sendToAnalytics(events: any[]): Promise<void> {
    // Placeholder - would send to analytics backend
    console.log('Sending analytics events:', events);
  }
}

// Health Prediction Model
export class HealthPredictionModel {
  private riskFactors = aiConfig.horseAnalysisTypes.health.indicators;

  async predictHealthRisk(horseData: HorseData): Promise<AnalyticsInsight[]> {
    const recentData = this.getRecentHealthData(horseData, 30);
    const insights: AnalyticsInsight[] = [];

    // Analyze each risk factor
    const riskConditions = {
      colic: {
        indicators: ['feeding_schedule_change', 'water_intake_decrease', 'activity_reduction'],
        threshold: aiConfig.horseThresholds.healthRisk,
        urgency: 'critical' as const
      },
      lameness: {
        indicators: ['gait_irregularity', 'training_intensity_spike', 'rest_day_deficit'],
        threshold: 0.6,
        urgency: 'high' as const
      },
      respiratory: {
        indicators: ['performance_decline', 'recovery_time_increase', 'environmental_changes'],
        threshold: 0.65,
        urgency: 'medium' as const
      }
    };

    for (const [condition, config] of Object.entries(riskConditions)) {
      const riskScore = this.calculateRiskScore(recentData, config.indicators);
      
      if (riskScore >= config.threshold) {
        // Get AI analysis for this specific risk
        const aiRequest: AIAnalysisRequest = {
          type: 'health',
          data: {
            condition,
            riskScore,
            recentData,
            horseProfile: {
              age: horseData.age,
              breed: horseData.breed,
              discipline: horseData.discipline
            }
          },
          horseId: horseData.horseId,
          context: `Health risk analysis for ${condition} with score ${riskScore}`,
          priority: config.urgency
        };

        try {
          const aiResponse = await aiService.analyze(aiRequest);
          const analysisResult = JSON.parse(aiResponse.content);

          insights.push({
            id: uuidv4(),
            horseId: horseData.horseId,
            type: 'health',
            priority: config.urgency,
            title: `${condition.charAt(0).toUpperCase() + condition.slice(1)} Risk Detected`,
            description: analysisResult.insights.join('. '),
            riskScore: analysisResult.riskScore || riskScore,
            confidence: aiResponse.confidence,
            recommendations: analysisResult.recommendations || [],
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            aiProvider: aiResponse.provider
          });
        } catch (error) {
          console.error(`Failed to get AI analysis for ${condition}:`, error);
          
          // Fallback to rule-based insight
          insights.push({
            id: uuidv4(),
            horseId: horseData.horseId,
            type: 'health',
            priority: config.urgency,
            title: `${condition.charAt(0).toUpperCase() + condition.slice(1)} Risk Alert`,
            description: `Elevated risk detected based on recent data patterns`,
            riskScore,
            confidence: 0.7,
            recommendations: this.getDefaultRecommendations(condition),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            aiProvider: 'rule-based'
          });
        }
      }
    }

    return insights.sort((a, b) => b.riskScore - a.riskScore);
  }

  private getRecentHealthData(horseData: HorseData, days: number): any {
    // Extract recent health data for analysis
    return {
      vitals: horseData.healthMetrics.vitals,
      feeding: horseData.healthMetrics.feeding,
      activity: horseData.healthMetrics.activity,
      recentVetVisits: horseData.healthMetrics.veterinaryHistory
        .filter(record => differenceInDays(new Date(), record.date) <= days)
    };
  }

  private calculateRiskScore(data: any, indicators: string[]): number {
    let score = 0;
    const weight = 1 / indicators.length;

    indicators.forEach(indicator => {
      const indicatorScore = this.evaluateIndicator(data, indicator);
      score += indicatorScore * weight;
    });

    // Apply temporal weighting - recent events matter more
    const temporalWeight = this.calculateTemporalWeight(data);
    return Math.min(score * temporalWeight, 1);
  }

  private evaluateIndicator(data: any, indicator: string): number {
    // Placeholder implementation - would contain specific logic for each indicator
    switch (indicator) {
      case 'feeding_schedule_change':
        return data.feeding?.schedule?.length < 3 ? 0.8 : 0.2;
      case 'water_intake_decrease':
        return data.feeding?.waterConsumption < 30 ? 0.9 : 0.1;
      case 'activity_reduction':
        return data.activity?.dailyMovement < 5000 ? 0.7 : 0.3;
      default:
        return 0.5; // Default moderate risk
    }
  }

  private calculateTemporalWeight(data: any): number {
    // More recent data gets higher weight
    return 1.2; // Placeholder
  }

  private getDefaultRecommendations(condition: string): Recommendation[] {
    const recommendations: { [key: string]: Recommendation[] } = {
      colic: [
        {
          action: 'Monitor feeding schedule closely',
          priority: 'high',
          timeline: 'immediate',
          expectedOutcome: 'Reduced digestive stress'
        },
        {
          action: 'Increase water availability',
          priority: 'high',
          timeline: 'immediate',
          expectedOutcome: 'Improved hydration'
        }
      ],
      lameness: [
        {
          action: 'Reduce training intensity',
          priority: 'high',
          timeline: '1-2 days',
          expectedOutcome: 'Prevent further injury'
        },
        {
          action: 'Schedule veterinary examination',
          priority: 'critical',
          timeline: 'within 24 hours',
          expectedOutcome: 'Early diagnosis and treatment'
        }
      ],
      respiratory: [
        {
          action: 'Check environmental conditions',
          priority: 'medium',
          timeline: 'immediate',
          expectedOutcome: 'Identify potential irritants'
        }
      ]
    };

    return recommendations[condition] || [];
  }
}

// Performance Optimization Algorithm
export class PerformanceOptimizer {
  async analyzeTrainingEffectiveness(horseData: HorseData): Promise<AnalyticsInsight[]> {
    const trainingPeriods = this.segmentTrainingPeriods(horseData);
    const insights: AnalyticsInsight[] = [];

    const aiRequest: AIAnalysisRequest = {
      type: 'performance',
      data: {
        trainingPeriods,
        currentMetrics: horseData.performanceMetrics,
        discipline: horseData.discipline
      },
      horseId: horseData.horseId,
      context: 'Training effectiveness analysis for performance optimization'
    };

    try {
      const aiResponse = await aiService.analyze(aiRequest);
      const analysisResult = JSON.parse(aiResponse.content);

      insights.push({
        id: uuidv4(),
        horseId: horseData.horseId,
        type: 'performance',
        priority: 'high',
        title: 'Training Effectiveness Analysis',
        description: analysisResult.insights.join('. '),
        riskScore: 1 - (analysisResult.riskScore || 0.5), // Invert for performance (higher is better)
        confidence: aiResponse.confidence,
        recommendations: analysisResult.recommendations || [],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        aiProvider: aiResponse.provider
      });
    } catch (error) {
      console.error('Failed to analyze training effectiveness:', error);
    }

    return insights;
  }

  async projectCompetitionReadiness(horseData: HorseData, competitionDate: Date): Promise<AnalyticsInsight> {
    const currentCondition = this.assessCurrentCondition(horseData);
    const daysUntilCompetition = differenceInDays(competitionDate, new Date());
    
    const aiRequest: AIAnalysisRequest = {
      type: 'performance',
      data: {
        currentCondition,
        daysUntilCompetition,
        competitionDate: format(competitionDate, 'yyyy-MM-dd'),
        recentPerformance: horseData.performanceMetrics
      },
      horseId: horseData.horseId,
      context: `Competition readiness projection for event on ${format(competitionDate, 'MMM dd, yyyy')}`
    };

    try {
      const aiResponse = await aiService.analyze(aiRequest);
      const analysisResult = JSON.parse(aiResponse.content);

      return {
        id: uuidv4(),
        horseId: horseData.horseId,
        type: 'performance',
        priority: daysUntilCompetition <= 7 ? 'critical' : 'high',
        title: 'Competition Readiness Projection',
        description: analysisResult.insights.join('. '),
        riskScore: 1 - (analysisResult.riskScore || 0.5),
        confidence: aiResponse.confidence,
        recommendations: analysisResult.recommendations || [],
        createdAt: new Date(),
        expiresAt: competitionDate,
        aiProvider: aiResponse.provider
      };
    } catch (error) {
      console.error('Failed to project competition readiness:', error);
      throw error;
    }
  }

  private segmentTrainingPeriods(horseData: HorseData): any[] {
    // Placeholder - would analyze training history and segment into periods
    return [
      {
        start: subDays(new Date(), 30),
        end: new Date(),
        intensity: horseData.performanceMetrics.training.averageIntensity,
        sessions: horseData.performanceMetrics.training.sessionsPerWeek * 4
      }
    ];
  }

  private assessCurrentCondition(horseData: HorseData): any {
    return {
      score: horseData.performanceMetrics.competition.readinessScore,
      fitness: horseData.performanceMetrics.training.consistency,
      recovery: horseData.performanceMetrics.recovery.fatigueLevel
    };
  }
}

// Financial Analyzer
export class FinancialAnalyzer {
  async calculateHorseROI(horseData: HorseData, period: number = 365): Promise<AnalyticsInsight> {
    const analysis = {
      totalCosts: horseData.financialMetrics.costs,
      totalRevenue: horseData.financialMetrics.revenue,
      roi: horseData.financialMetrics.roi,
      period
    };

    const aiRequest: AIAnalysisRequest = {
      type: 'financial',
      data: analysis,
      horseId: horseData.horseId,
      context: `Financial ROI analysis for ${period} day period`
    };

    try {
      const aiResponse = await aiService.analyze(aiRequest);
      const analysisResult = JSON.parse(aiResponse.content);

      return {
        id: uuidv4(),
        horseId: horseData.horseId,
        type: 'financial',
        priority: analysis.roi < 0 ? 'high' : 'medium',
        title: 'Financial Performance Analysis',
        description: analysisResult.insights.join('. '),
        riskScore: analysis.roi < 0 ? 0.8 : 0.3,
        confidence: aiResponse.confidence,
        recommendations: analysisResult.recommendations || [],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        aiProvider: aiResponse.provider
      };
    } catch (error) {
      console.error('Failed to calculate ROI:', error);
      throw error;
    }
  }
}

// Behavior Analyzer
export class BehaviorAnalyzer {
  async identifyTrainingPatterns(horseData: HorseData): Promise<AnalyticsInsight[]> {
    const patterns = {
      consistency: horseData.performanceMetrics.training.consistency,
      behavioral: horseData.behavioralMetrics.patterns,
      anomalies: horseData.behavioralMetrics.anomalies
    };

    const aiRequest: AIAnalysisRequest = {
      type: 'behavioral',
      data: patterns,
      horseId: horseData.horseId,
      context: 'Behavioral pattern analysis for training optimization'
    };

    try {
      const aiResponse = await aiService.analyze(aiRequest);
      const analysisResult = JSON.parse(aiResponse.content);

      return [{
        id: uuidv4(),
        horseId: horseData.horseId,
        type: 'behavioral',
        priority: 'medium',
        title: 'Behavioral Pattern Analysis',
        description: analysisResult.insights.join('. '),
        riskScore: analysisResult.riskScore || 0.4,
        confidence: aiResponse.confidence,
        recommendations: analysisResult.recommendations || [],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        aiProvider: aiResponse.provider
      }];
    } catch (error) {
      console.error('Failed to analyze behavioral patterns:', error);
      return [];
    }
  }

  async detectAnomalies(horseData: HorseData): Promise<BehaviorAnomaly[]> {
    const baselineBehavior = horseData.behavioralMetrics.baseline;
    const recentBehavior = this.getRecentBehavior(horseData, 7);
    
    const anomalies: BehaviorAnomaly[] = [];
    
    // Check for feeding anomalies
    if (this.detectFeedingAnomaly(baselineBehavior, recentBehavior)) {
      anomalies.push({
        type: 'feeding',
        severity: this.calculateSeverity(baselineBehavior, recentBehavior, 'feeding'),
        description: 'Unusual feeding behavior detected',
        detectedAt: new Date(),
        possibleCauses: ['dental issues', 'digestive discomfort', 'stress']
      });
    }

    // Check for activity anomalies
    if (this.detectActivityAnomaly(baselineBehavior, recentBehavior)) {
      anomalies.push({
        type: 'activity',
        severity: this.calculateSeverity(baselineBehavior, recentBehavior, 'activity'),
        description: 'Abnormal activity level detected',
        detectedAt: new Date(),
        possibleCauses: ['lameness', 'fatigue', 'illness']
      });
    }

    return anomalies.sort((a, b) => b.severity - a.severity);
  }

  private getRecentBehavior(horseData: HorseData, days: number): any {
    // Placeholder - would extract recent behavioral data
    return {
      feeding: horseData.behavioralMetrics.patterns.feedingBehavior,
      activity: horseData.healthMetrics.activity.dailyMovement
    };
  }

  private detectFeedingAnomaly(baseline: any, recent: any): boolean {
    // Placeholder logic
    return Math.abs(baseline.feeding - recent.feeding) > 0.3;
  }

  private detectActivityAnomaly(baseline: any, recent: any): boolean {
    // Placeholder logic
    return Math.abs(baseline.activity - recent.activity) > 0.4;
  }

  private calculateSeverity(baseline: any, recent: any, type: string): number {
    // Placeholder severity calculation
    return Math.random() * 0.5 + 0.3; // 0.3 to 0.8
  }
}

// Main Analytics Engine
export class AnalyticsEngine {
  private collector: AnalyticsCollector;
  private healthModel: HealthPredictionModel;
  private performanceOptimizer: PerformanceOptimizer;
  private financialAnalyzer: FinancialAnalyzer;
  private behaviorAnalyzer: BehaviorAnalyzer;

  constructor() {
    this.collector = new AnalyticsCollector();
    this.healthModel = new HealthPredictionModel();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.financialAnalyzer = new FinancialAnalyzer();
    this.behaviorAnalyzer = new BehaviorAnalyzer();
  }

  async generateDailyInsights(horseData: HorseData[]): Promise<AnalyticsInsight[]> {
    const allInsights: AnalyticsInsight[] = [];

    for (const horse of horseData) {
      try {
        // Generate insights from all analyzers
        const [healthInsights, performanceInsights, behaviorInsights] = await Promise.all([
          this.healthModel.predictHealthRisk(horse),
          this.performanceOptimizer.analyzeTrainingEffectiveness(horse),
          this.behaviorAnalyzer.identifyTrainingPatterns(horse)
        ]);

        // Add financial insights if enabled
        if (aiConfig.horseAnalysisTypes.financial.enabled) {
          const financialInsight = await this.financialAnalyzer.calculateHorseROI(horse);
          allInsights.push(financialInsight);
        }

        allInsights.push(...healthInsights, ...performanceInsights, ...behaviorInsights);
      } catch (error) {
        console.error(`Failed to generate insights for horse ${horse.horseId}:`, error);
      }
    }

    return this.prioritizeInsights(allInsights);
  }

  private prioritizeInsights(insights: AnalyticsInsight[]): AnalyticsInsight[] {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    
    return insights
      .sort((a, b) => {
        // First by priority
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by risk score
        const riskDiff = b.riskScore - a.riskScore;
        if (riskDiff !== 0) return riskDiff;
        
        // Finally by confidence
        return b.confidence - a.confidence;
      })
      .slice(0, aiConfig.insights.maxInsightsPerHorse * insights.length);
  }

  trackEvent(eventType: string, data: any): void {
    this.collector.track(eventType, data);
  }

  async flushAnalytics(): Promise<void> {
    await this.collector.flush();
  }
}

// Singleton instance
export const analyticsEngine = new AnalyticsEngine();
 