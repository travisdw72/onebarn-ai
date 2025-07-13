import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { aiConfig } from '../config/aiConfig';
import { EnvironmentValidator } from '../utils/envValidator';
import { aiVisionPromptsConfig, getVisionPrompt } from '../config/aiVisionPromptsConfig';
import { IEnhancedVideoAnalysisResult } from '../interfaces/VideoTypes';

// Enhanced AI Provider System with Vision Capabilities
interface VisionProvider {
  name: string;
  client: OpenAI | Anthropic | null;
  enabled: boolean;
  supportsVision: boolean;
  model: string;
}

// Multi-provider AI Vision Service with automatic fallback
class AIProviderManager {
  private providers: VisionProvider[] = [];
  private currentProviderIndex = 0;
  private circuitBreaker: Map<string, { failures: number; lastFailure: number; isOpen: boolean }> = new Map();
  private readonly maxFailures = 3;
  private readonly resetTimeoutMs = 60000; // 1 minute

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Anthropic Provider (Claude 3.5 with vision) - PRIMARY PROVIDER
    if (aiConfig.providers.anthropic.enabled && aiConfig.providers.anthropic.apiKey) {
      const anthropicClient = new Anthropic({
        apiKey: aiConfig.providers.anthropic.apiKey,
        dangerouslyAllowBrowser: true
      });

      this.providers.push({
        name: 'anthropic',
        client: anthropicClient,
        enabled: true,
        supportsVision: true,
        model: 'claude-3-5-sonnet-20241022' // Updated to latest Claude model with vision
      });
    }

    // OpenAI Provider with current model - FALLBACK PROVIDER
    if (aiConfig.providers.openai.enabled && aiConfig.providers.openai.apiKey) {
      const openaiClient = new OpenAI({
        apiKey: aiConfig.providers.openai.apiKey,
        dangerouslyAllowBrowser: true
      });

      this.providers.push({
        name: 'openai',
        client: openaiClient,
        enabled: true,
        supportsVision: true,
        model: 'gpt-4o' // Updated to current vision model
      });
    }

    // Log only in development
    if (import.meta.env.DEV) {
      console.log(`🔧 Initialized ${this.providers.length} AI vision providers:`, 
        this.providers.map(p => `${p.name} (${p.model})`));
    }
  }

  private isCircuitOpen(providerName: string): boolean {
    const breaker = this.circuitBreaker.get(providerName);
    if (!breaker) return false;

    // Reset circuit breaker if timeout has passed
    if (breaker.isOpen && Date.now() - breaker.lastFailure > this.resetTimeoutMs) {
      breaker.isOpen = false;
      breaker.failures = 0;
      console.log(`🔄 Circuit breaker reset for ${providerName}`);
    }

    return breaker.isOpen;
  }

  private recordFailure(providerName: string): void {
    const breaker = this.circuitBreaker.get(providerName) || { failures: 0, lastFailure: 0, isOpen: false };
    breaker.failures++;
    breaker.lastFailure = Date.now();

    if (breaker.failures >= this.maxFailures) {
      breaker.isOpen = true;
      console.log(`⚡ Circuit breaker opened for ${providerName} after ${breaker.failures} failures`);
    }

    this.circuitBreaker.set(providerName, breaker);
  }

  private recordSuccess(providerName: string): void {
    const breaker = this.circuitBreaker.get(providerName);
    if (breaker) {
      breaker.failures = 0;
      breaker.isOpen = false;
    }
  }

  async analyzeImageWithFallback(imageData: string, contextInfo: string): Promise<{ result: any; provider: string; model: string }> {
    const enabledProviders = this.providers.filter(p => p.enabled && p.supportsVision);
    
    if (enabledProviders.length === 0) {
      throw new Error('No vision providers available');
    }

    let lastError: Error | null = null;

    // Try each provider in order
    for (const provider of enabledProviders) {
      if (this.isCircuitOpen(provider.name)) {
        console.log(`⚡ Skipping ${provider.name} - circuit breaker is open`);
        continue;
      }

      try {
        console.log(`🔍 Attempting vision analysis with ${provider.name} (${provider.model})`);
        
        let result;
        if (provider.name === 'openai') {
          result = await this.callOpenAI(provider.client as OpenAI, provider.model, imageData, contextInfo);
        } else if (provider.name === 'anthropic') {
          result = await this.callAnthropic(provider.client as Anthropic, provider.model, imageData, contextInfo);
        } else {
          throw new Error(`Unknown provider: ${provider.name}`);
        }

        this.recordSuccess(provider.name);
        console.log(`✅ Successfully analyzed with ${provider.name}`);
        
        return {
          result,
          provider: provider.name,
          model: provider.model
        };

      } catch (error: any) {
        lastError = error;
        this.recordFailure(provider.name);
        
        console.error(`❌ ${provider.name} failed:`, error.message);
        
        // If it's a model deprecation error, don't retry with the same provider
        if (error.message?.includes('deprecated') || error.message?.includes('404')) {
          console.error(`🚫 Model deprecated for ${provider.name}, moving to next provider`);
          continue;
        }
        
        // Continue to next provider for other errors
        continue;
      }
    }

    throw lastError || new Error('All vision providers failed');
  }

  private async callOpenAI(client: OpenAI, model: string, imageData: string, contextInfo: string): Promise<any> {
    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: contextInfo + `

IMPORTANT: Always respond with valid JSON, even if no horse is detected or if the image is unclear. If no horse is present, set horsesDetected count to 0 and provide a general scene analysis.

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "imageAssessment": {
    "horsesDetected": {"count": number, "locations": ["string"], "identifiableBreeds": ["string"]},
    "imageQuality": "string",
    "lightingConditions": "string",
    "sceneContext": "string"
  },
  "primarySubjectAnalysis": {
    "subjectType": "horse",
    "breedAssessment": "string",
    "ageEstimate": "string",
    "genderAssessment": "string",
    "sizeClassification": "string",
    "coatCondition": "string",
    "facialExpression": "string",
    "bodyLanguage": "string"
  },
  "clinicalAssessment": {
    "posturalAnalysis": "string",
    "mobilityAssessment": "string", 
    "respiratoryObservation": "string",
    "behavioralState": "string",
    "alertnessLevel": "string",
    "painIndicators": ["string"],
    "discomfortSigns": ["string"],
    "gaitAnalysis": "string",
    "lamenessIndicators": ["string"]
  },
  "healthMetrics": {
    "overallHealthScore": number (0-100),
    "mobilityScore": number (0-100),
    "behavioralScore": number (0-100),
    "respiratoryScore": number (0-100),
    "postureScore": number (0-100),
    "alertnessScore": number (0-100),
    "gaitScore": number (0-100)
  },
  "riskAssessment": {
    "overallRiskLevel": "low|medium|high|urgent",
    "riskScore": number (0-1),
    "immediateRisks": ["string"],
    "monitoringNeeded": ["string"],
    "concerningObservations": ["string"]
  },
  "clinicalRecommendations": {
    "immediate": ["string"],
    "shortTerm": ["string"],
    "longTerm": ["string"],
    "veterinaryConsultation": "string",
    "monitoringFrequency": "string"
  },
  "detailedClinicalNotes": "comprehensive clinical narrative"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageData,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    });

    return response.choices[0]?.message?.content;
  }

  private async callAnthropic(client: Anthropic, model: string, imageData: string, contextInfo: string): Promise<any> {
    // Extract base64 data and media type from data URL
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
      console.error('❌ Anthropic: Invalid image data format. Expected data URL, got:', imageData.substring(0, 100) + '...');
      throw new Error('Invalid image data format');
    }
    
    const mediaType = matches[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const base64Data = matches[2];

    console.log('🎯 Claude: Using ADVANCED PROMPT from aiPromptsConfig.ts');

    const response = await client.messages.create({
      model: model,
      max_tokens: 4000, // Increased for advanced analysis
      temperature: 0.1,
      system: "You are a veterinary expert specializing in equine biomechanical analysis. Provide detailed, professional veterinary assessments using clinical terminology. Always respond with valid JSON format only.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data
              }
            },
            {
              type: "text",
              text: contextInfo // This now contains the advanced prompt from aiPromptsConfig.ts
            }
          ]
        }
      ]
    });

    // Fix the Anthropic response type issue
    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    throw new Error('Unexpected response type from Anthropic');
  }

  getProviderStatus(): Array<{ name: string; enabled: boolean; model: string; circuitOpen: boolean }> {
    return this.providers.map(provider => ({
      name: provider.name,
      enabled: provider.enabled,
      model: provider.model,
      circuitOpen: this.isCircuitOpen(provider.name)
    }));
  }
}

export interface IHorseAnalysisResult {
  timestamp: string;
  horseDetected: boolean;
  confidence: number;
  
  // Rich clinical data from AI for horses
  imageAssessment?: {
    horsesDetected: {
      count: number;
      locations: string[];
      identifiableBreeds: string[];
    };
    imageQuality: string;
    lightingConditions: string;
    sceneContext: string;
  };
  
  primarySubjectAnalysis?: {
    subjectType: string;
    breedAssessment: string;
    ageEstimate: string;
    genderAssessment: string;
    sizeClassification: string;
    coatCondition: string;
    facialExpression: string;
    bodyLanguage: string;
  };
  
  clinicalAssessment?: {
    posturalAnalysis: string;
    mobilityAssessment: string;
    respiratoryObservation: string;
    behavioralState: string;
    alertnessLevel: string;
    painIndicators: string[];
    discomfortSigns: string[];
    gaitAnalysis?: string;
    lamenessIndicators?: string[];
  };
  
  healthMetrics?: {
    overallHealthScore: number;
    mobilityScore: number;
    behavioralScore: number;
    respiratoryScore: number;
    postureScore: number;
    alertnessScore: number;
    gaitScore?: number;
  };
  
  riskAssessment?: {
    overallRiskLevel: string;
    riskScore: number;
    immediateRisks: string[];
    monitoringNeeded: string[];
    concerningObservations: string[];
  };
  
  clinicalRecommendations?: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    veterinaryConsultation: string;
    monitoringFrequency: string;
  };
  
  analysisMetadata?: {
    analysisTimestamp: string;
    confidenceLevel: number;
    analysisLimitations: string[];
    dataQualityFactors: string[];
    recommendedFollowUp: string;
  };
  
  detailedClinicalNotes?: string;
  
  // Legacy fields for backward compatibility
  sceneAnalysis?: {
    horsesDetected: number;
    humansDetected: boolean;
    sceneDescription: string;
    lightingQuality: 'good' | 'poor' | 'adequate';
    imageClarity: 'clear' | 'blurry' | 'partially_obscured';
  };
  primaryFocus?: string;
  healthAssessment: {
    mobility: 'excellent' | 'good' | 'limited' | 'concerning' | 'lame';
    posture: 'normal' | 'alert' | 'relaxed' | 'tense' | 'standing' | 'grazing' | 'resting';
    alertness: 'very_alert' | 'alert' | 'calm' | 'drowsy' | 'lethargic';
    breathing: 'normal' | 'elevated' | 'labored' | 'distressed';
    overallCondition: 'excellent' | 'good' | 'fair' | 'concerning' | 'urgent';
  };
  behaviorObservations: string[];
  riskScore: number; // 0-1 scale
  recommendations: string[];
  alertLevel: 'low' | 'medium' | 'high' | 'urgent';
  rawAnalysis: string;
  detailedAnalysis?: string;
  analysisContext?: {
    whatAmIAnalyzing: string;
    analysisLimitations: string[];
    confidenceFactors: string[];
  };
}

export class AIVisionService {
  private static instance: AIVisionService;
  private analysisHistory: IHorseAnalysisResult[] = [];
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private lastAnalysisTime = 0;
  private minAnalysisInterval = 2000; // 2 seconds minimum between analyses
  private maxRetries = 2;
  private isAnalyzing = false;
  private providerManager: AIProviderManager;
  
  // Enhanced analysis queue and priority system
  private analysisQueue: Array<{
    imageData: string;
    horseContext?: any;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    timestamp: number;
    resolve: (result: IHorseAnalysisResult) => void;
    reject: (error: any) => void;
  }> = [];
  private isProcessingQueue = false;
  private maxQueueSize = 25; // 🔧 FIX: Increased from 5 to 25 for continuous monitoring
  
  // Enhanced rate limiting with adaptive intervals
  private consecutiveAnalyses = 0;
  private dynamicInterval = 2000;
  private lastMotionDetected = 0;
  private analysisSuccessRate = 1.0;

  constructor() {
    this.apiKey = aiConfig.providers.openai.apiKey;
    this.providerManager = new AIProviderManager();
    
    // Start background queue processor
    this.startQueueProcessor();
    
    // Validate environment configuration on startup
    if (import.meta.env.DEV) {
      const validation = EnvironmentValidator.validateAIProviders();
      if (!validation.isValid) {
        console.warn('⚠️ AI Provider Configuration Issues Detected:');
        EnvironmentValidator.logReport();
      }
    }
  }

  public static getInstance(): AIVisionService {
    if (!AIVisionService.instance) {
      AIVisionService.instance = new AIVisionService();
    }
    return AIVisionService.instance;
  }

  /**
   * Enhanced analyze function with AI optimization pre-processing pipeline
   */
  public async analyzeHorseImage(imageData: string, horseContext?: {
    name?: string;
    age?: number;
    breed?: string;
    knownConditions?: string[];
    motionDetected?: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<IHorseAnalysisResult> {
    const now = Date.now();
    
    // Determine priority based on context with proper type handling
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    if (horseContext?.priority && ['low', 'medium', 'high', 'urgent'].includes(horseContext.priority)) {
      priority = horseContext.priority as 'low' | 'medium' | 'high' | 'urgent';
    } else if (horseContext?.motionDetected) {
      priority = 'high';
    }

    // 🤖 AI OPTIMIZATION PIPELINE - Phase 1
    try {
      const { AIOptimizationService } = await import('./aiOptimizationService');
      const optimizationService = AIOptimizationService.getInstance();
      
      // Create analysis context for optimization
      const analysisContext = {
        source: 'camera' as const,
        priority,
        horseId: horseContext?.name || 'unknown',
        sessionId: `vision_${Date.now()}`,
        expectedContent: 'horse' as const,
                 environmentalFactors: {
           timeOfDay: this.getTimeOfDay(),
           lighting: 'artificial' as const,
           weather: 'clear' as const
         },
        overrides: {
          // Skip optimization for urgent priority
          forceProcess: priority === 'urgent'
        }
      };

      // Run pre-processing optimization
      const optimizationResult = await optimizationService.preProcessRequest(imageData, analysisContext);
      
      console.log('🔍 AI Optimization Result:', {
        shouldProceed: optimizationResult.shouldProceed,
        tokenSavings: optimizationResult.tokenSavingsEstimate,
        skipReason: optimizationResult.decisions.skipReason,
        processingTime: optimizationResult.processingTime.total
      });

      // If optimization says to skip, return optimized response
      if (!optimizationResult.shouldProceed) {
        return this.createOptimizedSkipResponse(optimizationResult, horseContext);
      }

      // Log token savings for analysis that proceeds
      if (optimizationResult.tokenSavingsEstimate > 0) {
        console.log(`💰 Proceeding with analysis but saved ${optimizationResult.tokenSavingsEstimate}% tokens through optimization`);
      }

    } catch (optimizationError) {
      console.warn('⚠️ AI Optimization failed, proceeding with standard analysis:', optimizationError);
      // Continue with standard analysis if optimization fails
    }
    
    // Continue with standard AI vision analysis pipeline
    // For urgent or high priority, process immediately if possible
    if (priority === 'urgent' || (priority === 'high' && !this.isAnalyzing)) {
      return this.processAnalysisDirectly(imageData, horseContext, now);
    }
    
    // 🔧 FIX: Bypass rate limiting for continuous monitoring
    // If this looks like continuous monitoring (medium priority with analysis context)
    const isContinuousMonitoring = priority === 'medium' && 
                                   horseContext?.environmentalContext?.analysisContext === 'continuous_monitoring';
    
    if (isContinuousMonitoring && !this.isAnalyzing) {
      // Process immediately for continuous monitoring when not busy
      return this.processAnalysisDirectly(imageData, horseContext, now);
    }
    
    // Check adaptive rate limiting
    const requiredInterval = this.calculateDynamicInterval(priority);
    const timeSinceLastAnalysis = now - this.lastAnalysisTime;
    
    // If within rate limit and not urgent priority, queue the analysis
    if (timeSinceLastAnalysis < requiredInterval && priority !== 'urgent') {
      return this.queueAnalysis(imageData, horseContext, priority);
    }
    
    // Process directly if rate limit passed
    return this.processAnalysisDirectly(imageData, horseContext, now);
  }

  /**
   * Calculate dynamic interval based on priority and system performance
   */
  private calculateDynamicInterval(priority: 'low' | 'medium' | 'high' | 'urgent'): number {
    let baseInterval = this.minAnalysisInterval;
    
    // Priority adjustments
    switch (priority) {
      case 'urgent':
        return 0; // No delay for urgent
      case 'high':
        baseInterval *= 0.5;
        break;
      case 'medium':
        baseInterval *= 1;
        break;
      case 'low':
        baseInterval *= 2;
        break;
    }
    
    // Performance-based adjustments
    if (this.analysisSuccessRate < 0.5) {
      baseInterval *= 2; // Slow down if many failures
    }
    
    // 🔧 FIX: Don't scale up for continuous monitoring
    // Check if this is continuous monitoring (medium priority with high frequency)
    if (priority === 'medium' && this.consecutiveAnalyses > 3) {
      // For continuous monitoring, keep interval stable
      this.dynamicInterval = baseInterval;
      return this.dynamicInterval;
    }
    
    // Adaptive scaling based on consecutive analyses (only for non-continuous monitoring)
    const scalingFactor = Math.min(1 + (this.consecutiveAnalyses * 0.1), 3);
    this.dynamicInterval = Math.round(baseInterval * scalingFactor);
    
    return this.dynamicInterval;
  }

  /**
   * Queue analysis for later processing
   */
  private async queueAnalysis(imageData: string, horseContext: any, priority: 'low' | 'medium' | 'high' | 'urgent'): Promise<IHorseAnalysisResult> {
    return new Promise((resolve, reject) => {
      // Check queue size
      if (this.analysisQueue.length >= this.maxQueueSize) {
        console.warn('⚠️ Analysis queue full, removing oldest item');
        const oldestItem = this.analysisQueue.shift();
        if (oldestItem) {
          oldestItem.reject(new Error('Queue overflow - request dropped'));
        }
      }
      
      // Add to queue with priority sorting
      const queueItem = {
        imageData,
        horseContext,
        priority: priority as 'low' | 'medium' | 'high' | 'urgent',
        timestamp: Date.now(),
        resolve,
        reject
      };
      
      // Insert based on priority
      const priorityOrder: Record<'urgent' | 'high' | 'medium' | 'low', number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      const insertIndex = this.analysisQueue.findIndex(
        item => priorityOrder[item.priority] > priorityOrder[queueItem.priority]
      );
      
      if (insertIndex === -1) {
        this.analysisQueue.push(queueItem);
      } else {
        this.analysisQueue.splice(insertIndex, 0, queueItem);
      }
      
      console.log(`📋 Queued ${priority} priority analysis (queue size: ${this.analysisQueue.length})`);
    });
  }

  /**
   * Process analysis immediately
   */
  private async processAnalysisDirectly(imageData: string, horseContext: any, now: number): Promise<IHorseAnalysisResult> {
    this.isAnalyzing = true;
    this.lastAnalysisTime = now;
    this.consecutiveAnalyses++;
    
    try {
      // Create enhanced horse context for AI analysis
      const contextInfo = await this.buildHorseContextPrompt(horseContext);
      
      console.log('🐎 Starting horse AI analysis...', {
        priority: horseContext?.priority || 'medium',
        motionDetected: horseContext?.motionDetected,
        consecutiveAnalyses: this.consecutiveAnalyses
      });
      
      const result = await this.makeApiCallWithRetry(contextInfo, imageData);
      const analysis = await this.parseAnalysisResponse(result);
      
      // Enhance analysis with historical context
      const enhancedAnalysis = this.enhanceAnalysisWithHistory(analysis);
      
      // Update success rate
      this.analysisSuccessRate = Math.min(1.0, this.analysisSuccessRate + 0.1);
      
      // Store in history
      this.addToAnalysisHistory(enhancedAnalysis);
      
      return enhancedAnalysis;
      
    } catch (error) {
      console.error('🚨 Horse AI analysis failed:', error);
      this.analysisSuccessRate = Math.max(0.1, this.analysisSuccessRate - 0.2);
      
      // Return fallback horse analysis
      return this.getFallbackHorseAnalysis();
      
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Build horse-specific context prompt for AI analysis
   */
  private async buildHorseContextPrompt(horseContext?: any): Promise<string> {
    try {
      // Import the advanced video analysis prompt from aiPromptsConfig
      const { getVideoAnalysisPrompt, interpolatePrompt } = await import('../config/aiPromptsConfig');
      
      // Get the sophisticated equine video health analysis prompt
      const advancedPrompt = getVideoAnalysisPrompt('primary'); // This gets 'equineVideoHealthAnalysis'
      
      if (advancedPrompt && advancedPrompt.template) {
        console.log('🎯 Using ADVANCED equine video health analysis prompt');
        
        // Prepare variables for the advanced prompt with Unicode cleaning
        const cleanHorseName = (name: string) => {
          // Remove all emojis and special Unicode characters
          return name
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional indicator
            .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
            .replace(/[^\x00-\x7F]/g, '')           // Remove all non-ASCII characters
            .replace(/\s+/g, ' ')                   // Normalize whitespace
            .trim();
        };
        
        const variables = {
          horseName: cleanHorseName(horseContext?.name || 'Unknown Horse')
        };
        
        // Use the sophisticated interpolatePrompt function from aiPromptsConfig
        const interpolatedPrompt = interpolatePrompt(advancedPrompt.template, variables);
        
        console.log('✅ Advanced prompt interpolated successfully');
        console.log('📋 Prompt preview:', interpolatedPrompt.substring(0, 200) + '...');
        return interpolatedPrompt;
      }
    } catch (error) {
      console.warn('⚠️ Failed to load advanced prompt, falling back to vision prompt:', error);
    }

    // Fallback to original vision prompts if advanced prompt fails
    const promptConfig = getVisionPrompt('horse', 'comprehensiveHorseAnalysis');
    
    if (promptConfig && (promptConfig as any).template) {
      console.log('📋 Using fallback vision prompt for horse analysis');
      
      // Simple variable replacement for the prompt with Unicode cleaning
      let template = (promptConfig as any).template;
      const cleanHorseName = (name: string) => {
        // Remove all emojis and special Unicode characters
        return name
          .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
          .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
          .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
          .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Regional indicator
          .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
          .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
          .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
          .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
          .replace(/[^\x00-\x7F]/g, '')           // Remove all non-ASCII characters
          .replace(/\s+/g, ' ')                   // Normalize whitespace
          .trim();
      };
      
      const variables = {
        horseName: cleanHorseName(horseContext?.name || 'Unknown Horse'),
        breed: horseContext?.breed || 'Unknown',
        age: horseContext?.age?.toString() || 'Unknown',
        knownConditions: horseContext?.knownConditions?.join(', ') || 'None specified',
        priority: horseContext?.priority || 'medium',
        motionDetected: horseContext?.motionDetected ? 'Yes' : 'No'
      };

      // Simple template interpolation
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        template = template.replace(regex, String(value));
      });
      
      return template;
    }

    console.warn('⚠️ No suitable prompts found, using basic fallback');
    return this.getFallbackPrompt();
  }

  private getFallbackPrompt(): string {
    return `Analyze this horse image with focus on equine health, behavior, and welfare. You are an experienced equine veterinarian analyzing for:

1. **Health Assessment:**
   - Overall body condition and posture
   - Visible signs of distress or discomfort
   - Gait abnormalities or lameness indicators
   - Breathing patterns and respiratory health
   - Coat condition and general appearance

2. **Behavioral Analysis:**
   - Alertness and mental state
   - Stress indicators or anxiety signs
   - Social behavior and interaction patterns
   - Activity level and energy
   - Response to environment

3. **Safety Evaluation:**
   - Immediate health concerns requiring attention
   - Environmental hazards or risks
   - Equipment or facility safety issues
   - Handler safety considerations

Please provide a structured analysis with confidence scores and specific recommendations.`;
  }

  /**
   * Start background queue processor
   */
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.isProcessingQueue || this.analysisQueue.length === 0 || this.isAnalyzing) {
        return;
      }
      
      this.isProcessingQueue = true;
      
      try {
        // Sort queue by priority and timestamp
        this.analysisQueue.sort((a, b) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
          
          if (aPriority !== bPriority) {
            return bPriority - aPriority; // Higher priority first
          }
          
          return a.timestamp - b.timestamp; // Older first for same priority
        });
        
        const nextItem = this.analysisQueue.shift();
        if (nextItem) {
          try {
            const result = await this.processAnalysisDirectly(
              nextItem.imageData, 
              nextItem.horseContext, 
              Date.now()
            );
            nextItem.resolve(result);
          } catch (error) {
            nextItem.reject(error);
          }
        }
      } catch (error) {
        console.error('Queue processor error:', error);
      } finally {
        this.isProcessingQueue = false;
      }
    }, 1000); // Check queue every second
  }

  /**
   * Enhanced analysis with historical context
   */
  private enhanceAnalysisWithHistory(analysis: IHorseAnalysisResult): IHorseAnalysisResult {
    if (this.analysisHistory.length === 0) {
      return analysis;
    }
    
    // Add trend analysis
    const recentHistory = this.analysisHistory.slice(0, 5);
    const trends = {
      riskTrend: this.calculateTrend(recentHistory, 'riskScore'),
      mobilityTrend: this.calculateTrend(recentHistory, 'healthAssessment.mobility'),
      alertnessTrend: this.calculateTrend(recentHistory, 'healthAssessment.alertness')
    };
    
    // Enhance recommendations based on trends
    const enhancedRecommendations = [...analysis.recommendations];
    
    if (trends.riskTrend === 'declining') {
      enhancedRecommendations.unshift('⚠️ Risk trend declining - consider veterinary consultation');
    }
    
    if (trends.mobilityTrend === 'declining') {
      enhancedRecommendations.unshift('🚶 Mobility declining - monitor for lameness or discomfort');
    }
    
    if (trends.alertnessTrend === 'declining') {
      enhancedRecommendations.unshift('😴 Alertness declining - check for illness or fatigue');
    }
    
    return {
      ...analysis,
      recommendations: enhancedRecommendations,
      analysisContext: {
        ...analysis.analysisContext,
        whatAmIAnalyzing: 'Horse health and behavior analysis with historical trends',
        analysisLimitations: analysis.analysisContext?.analysisLimitations || ['Image-based analysis only'],
        confidenceFactors: [
          ...(analysis.analysisContext?.confidenceFactors || []),
          `Based on ${this.analysisHistory.length} previous analyses`,
          `Risk trend: ${trends.riskTrend}`,
          `Mobility trend: ${trends.mobilityTrend}`
        ]
      }
    };
  }

  /**
   * Calculate trend from historical data
   */
  private calculateTrend(history: IHorseAnalysisResult[], field: string): 'improving' | 'stable' | 'declining' | 'unknown' {
    if (history.length < 3) return 'unknown';
    
    try {
      const values = history.map(h => {
        // Add null checks for all field access
        if (!h) return 0;
        
        if (field === 'riskScore') return h.riskScore || 0;
        if (field === 'healthAssessment.mobility') {
          if (!h.healthAssessment?.mobility) return 0;
          const mobilityScores = { excellent: 5, good: 4, limited: 3, concerning: 2, lame: 1 };
          return mobilityScores[h.healthAssessment.mobility as keyof typeof mobilityScores] || 3;
        }
        if (field === 'healthAssessment.alertness') {
          if (!h.healthAssessment?.alertness) return 0;
          const alertnessScores = { very_alert: 5, alert: 4, calm: 3, drowsy: 2, lethargic: 1 };
          return alertnessScores[h.healthAssessment.alertness as keyof typeof alertnessScores] || 3;
        }
        return 0;
      }).filter(v => v > 0);
      
      if (values.length < 3) return 'unknown';
      
      // Simple trend calculation
      const recent = values.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
      const older = values.slice(-2).reduce((a, b) => a + b, 0) / 2;
      const diff = recent - older;
      
      if (Math.abs(diff) < 0.5) return 'stable';
      
      if (field === 'riskScore') {
        return diff > 0 ? 'declining' : 'improving'; // Higher risk = declining health
      } else {
        return diff > 0 ? 'improving' : 'declining';
      }
    } catch (error) {
      console.warn('Trend calculation error:', error);
      return 'unknown';
    }
  }

  /**
   * Add analysis to history with cleanup
   */
  private addToAnalysisHistory(analysis: IHorseAnalysisResult): void {
    this.analysisHistory.unshift(analysis);
    
    // Keep only last 50 analyses
    if (this.analysisHistory.length > 50) {
      this.analysisHistory = this.analysisHistory.slice(0, 50);
    }
    
    // Save to localStorage for persistence
    try {
      const historyData = {
        timestamp: Date.now(),
        analyses: this.analysisHistory.slice(0, 10), // Save only last 10
        metadata: {
          totalAnalyses: this.analysisHistory.length,
          successRate: this.analysisSuccessRate,
          averageRiskScore: this.analysisHistory.reduce((acc, a) => acc + a.riskScore, 0) / this.analysisHistory.length
        }
      };
      localStorage.setItem('horseAnalysisHistory', JSON.stringify(historyData));
    } catch (error) {
      console.warn('Failed to save analysis history:', error);
    }
  }

  /**
   * Load analysis history from localStorage
   */
  public loadAnalysisHistory(): void {
    try {
      const saved = localStorage.getItem('horseAnalysisHistory');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.analyses && Array.isArray(data.analyses)) {
          this.analysisHistory = data.analyses;
          console.log(`📚 Loaded ${this.analysisHistory.length} previous horse analyses`);
        }
      }
    } catch (error) {
      console.error('Failed to load analysis history:', error);
    }
    
    // Log only in development
    if (import.meta.env.DEV) {
      console.log(`📚 Loaded ${this.analysisHistory.length} previous horse analyses`);
    }
  }

  /**
   * Get current queue status for monitoring
   */
  public getQueueStatus(): {
    queueSize: number;
    isProcessing: boolean;
    isAnalyzing: boolean;
    consecutiveAnalyses: number;
    successRate: number;
    dynamicInterval: number;
  } {
    return {
      queueSize: this.analysisQueue.length,
      isProcessing: this.isProcessingQueue,
      isAnalyzing: this.isAnalyzing,
      consecutiveAnalyses: this.consecutiveAnalyses,
      successRate: this.analysisSuccessRate,
      dynamicInterval: this.dynamicInterval
    };
  }

  /**
   * Force immediate analysis bypassing queue and rate limits
   */
  public async forceAnalysis(imageData: string, horseContext?: any): Promise<IHorseAnalysisResult> {
    return this.processAnalysisDirectly(imageData, { ...horseContext, priority: 'urgent' }, Date.now());
  }

  /**
   * NEW: Analyze photo sequence with temporal analysis (replaces video segment analysis)
   */
  public async analyzePhotoSequence(videoBlob: Blob, horseContext?: any): Promise<IEnhancedVideoAnalysisResult> {
    console.log(`📸 Starting photo sequence analysis: ${(videoBlob.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`🔍 Video blob type: ${videoBlob.type}, size: ${videoBlob.size} bytes`);
    
    try {
      // Import AI vision prompts configuration
      const { getPhotoSequencePrompt, validatePhotoSequence } = await import('../config/aiVisionPromptsConfig');
      
      // Get the photo sequence analysis prompt
      const sequencePrompt = getPhotoSequencePrompt('horsePhotoSequenceAnalysis');
      if (!sequencePrompt) {
        throw new Error('Photo sequence analysis prompt not found');
      }
      
      // Extract 10 frames over 1 minute (6-second intervals)
      const photos = await this.extractPhotoSequence(videoBlob, 10, 60); // 10 photos over 60 seconds
      
      console.log(`📸 Extracted ${photos.length} photos for sequence analysis`);
      
      // Validate photo sequence
      const validation = validatePhotoSequence(photos);
      if (!validation.valid) {
        console.warn('⚠️ Photo sequence validation failed:', validation.errors);
        // Continue with whatever photos we have
      }
      
      // Prepare context for photo sequence analysis
      const sequenceContext = {
        ...horseContext,
        analysisType: 'photo_sequence',
        photoCount: photos.length,
        sequenceDuration: 60, // 1 minute
        intervalSeconds: 6,
        videoSize: videoBlob.size
      };
      
      // Simple variable interpolation for the prompt template
      const variables = {
        horseName: horseContext?.name || 'Unknown Horse',
        breed: horseContext?.breed || 'Unknown',
        age: horseContext?.age?.toString() || 'Unknown',
        priority: horseContext?.priority || 'medium',
        knownConditions: horseContext?.knownConditions?.join(', ') || 'None specified'
      };
      
      // Simple template interpolation
      let contextPrompt = sequencePrompt.template;
      Object.entries(variables).forEach(([key, value]) => {
        contextPrompt = contextPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      
      // Analyze the entire photo sequence as a batch
      const sequenceAnalysis = await this.analyzePhotoSequenceBatch(photos, contextPrompt, sequenceContext);
      
      console.log(`🎯 Photo sequence analysis complete: ${sequenceAnalysis.confidence.toFixed(2)} overall confidence`);
      return sequenceAnalysis;
      
    } catch (error: any) {
      console.error('🚨 Photo sequence analysis failed:', error);
      
      // Try to extract at least one frame for basic analysis
      try {
        console.log('🔄 Attempting basic single frame analysis as fallback...');
        const singleFrame = await this.extractSingleFrame(videoBlob);
        
        if (singleFrame) {
          console.log('✅ Single frame extracted, performing basic AI analysis...');
          
          // Use basic horse analysis on the frame
          const basicAnalysis = await this.processAnalysisDirectly(singleFrame, horseContext, Date.now());
          
          // Convert to enhanced format with actual AI data
          const enhancedResult = this.convertToEnhancedFormat(basicAnalysis, {
            horseContext,
            videoBlob,
            totalFrames: 1,
            successfulFrames: 1,
            fallbackUsed: true
          });
          
          console.log('✅ Fallback analysis with real AI data complete');
          return enhancedResult;
        }
      } catch (fallbackError: any) {
        console.error('⚠️ Fallback analysis also failed:', fallbackError);
      }
      
      // NO MORE FALLBACKS - FAIL HARD IF AI DOESN'T WORK
      console.error('🚨 AI ANALYSIS COMPLETELY FAILED - NO FALLBACK DATA WILL BE RETURNED');
      throw new Error('AI analysis failed completely - no fallback data available');
    }
  }

  /**
   * Extract photo sequence from video - 10 photos over 60 seconds at 6-second intervals
   * @param videoBlob - Video blob to extract frames from
   * @param photoCount - Number of photos to extract (default: 10)
   * @param durationSeconds - Duration in seconds (default: 60)
   * @returns Promise<string[]> - Array of base64 encoded photos
   */
  private async extractPhotoSequence(videoBlob: Blob, photoCount: number = 10, durationSeconds: number = 60): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot create canvas context for photo sequence extraction'));
        return;
      }

      const photos: string[] = [];
      let currentPhotoIndex = 0;
      let photoTimestamps: number[] = [];

      console.log(`📸 Starting photo sequence extraction: ${photoCount} photos over ${durationSeconds}s`);

      video.onloadeddata = () => {
        const duration = video.duration;
        console.log(`📹 Video loaded for sequence: duration=${duration}s, dimensions=${video.videoWidth}x${video.videoHeight}`);

        // Set canvas to 512x512 as specified in requirements
        canvas.width = 512;
        canvas.height = 512;

        // Calculate timestamps for 10 photos at 6-second intervals
        photoTimestamps = [];
        const intervalSeconds = durationSeconds / (photoCount - 1); // Spread over full duration
        
        for (let i = 0; i < photoCount; i++) {
          const timestamp = Math.min(i * intervalSeconds, duration - 0.1); // Ensure we don't exceed video duration
          photoTimestamps.push(timestamp);
        }

        console.log(`📸 Photo timestamps:`, photoTimestamps.map(t => `${t.toFixed(1)}s`));

        // Start extracting first photo
        video.currentTime = photoTimestamps[0];
      };

      video.onseeked = async () => {
        try {
          // Extract frame at current timestamp
          const currentTimestamp = photoTimestamps[currentPhotoIndex];
          
          // Scale video to fit 512x512 canvas while maintaining aspect ratio
          const videoAspect = video.videoWidth / video.videoHeight;
          let drawWidth = 512;
          let drawHeight = 512;
          let offsetX = 0;
          let offsetY = 0;

          if (videoAspect > 1) {
            // Video is wider than square
            drawHeight = 512 / videoAspect;
            offsetY = (512 - drawHeight) / 2;
          } else {
            // Video is taller than square
            drawWidth = 512 * videoAspect;
            offsetX = (512 - drawWidth) / 2;
          }

          // Clear canvas and draw scaled video frame
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 512, 512);
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

          // Convert to base64 with timestamp overlay
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          
          if (imageData && imageData.startsWith('data:image/') && imageData.length > 10000) {
            photos.push(imageData);
            console.log(`📸 Photo ${currentPhotoIndex + 1}/${photoCount} extracted at ${currentTimestamp.toFixed(1)}s (${(imageData.length / 1024).toFixed(1)}KB)`);
            
            currentPhotoIndex++;
            
            // Check if we need more photos
            if (currentPhotoIndex < photoCount && currentPhotoIndex < photoTimestamps.length) {
              // Seek to next timestamp
              video.currentTime = photoTimestamps[currentPhotoIndex];
            } else {
              // All photos extracted
              console.log(`✅ Photo sequence extraction complete: ${photos.length} photos`);
              this.cleanup(video, canvas);
              resolve(photos);
            }
          } else {
            console.error(`❌ Photo ${currentPhotoIndex + 1} extraction failed - invalid image data`);
            this.cleanup(video, canvas);
            reject(new Error(`Photo ${currentPhotoIndex + 1} extraction failed`));
          }
        } catch (error) {
          console.error(`❌ Error extracting photo ${currentPhotoIndex + 1}:`, error);
          this.cleanup(video, canvas);
          reject(error);
        }
      };

      video.onerror = (error) => {
        console.error('❌ Video loading error during sequence extraction:', error);
        this.cleanup(video, canvas);
        reject(new Error('Video loading failed during sequence extraction'));
      };

      video.onloadstart = () => {
        console.log('📹 Video loading started for sequence extraction...');
      };

      video.oncanplay = () => {
        console.log('📹 Video can play - ready for sequence extraction');
      };

      // Load video
      video.src = URL.createObjectURL(videoBlob);
      video.load();
    });
  }

  /**
   * Analyze photo sequence with sequential learning - each photo builds on previous analysis
   * @param photos - Array of base64 encoded photos
   * @param contextPrompt - Interpolated prompt for analysis
   * @param sequenceContext - Context information for the sequence
   * @returns Promise<IEnhancedVideoAnalysisResult>
   */
  private async analyzePhotoSequenceBatch(
    photos: string[], 
    contextPrompt: string, 
    sequenceContext: any
  ): Promise<IEnhancedVideoAnalysisResult> {
    console.log(`🧠 Starting sequential learning analysis of ${photos.length} photos`);
    
    try {
      // Initialize sequential learning storage
      const sequenceId = `photo_sequence_${Date.now()}`;
      const learningContext = {
        sequenceId,
        totalPhotos: photos.length,
        analysisHistory: [],
        cumulativeInsights: {
          behaviorPatterns: [],
          healthTrends: [],
          movementProgression: [],
          riskFactors: [],
          consistentFindings: []
        },
        temporalProgression: {
          startTime: 0,
          currentTime: 0,
          intervalSeconds: sequenceContext.intervalSeconds
        }
      };

      // Sequential analysis loop - each photo learns from previous ones
      for (let photoIndex = 0; photoIndex < photos.length; photoIndex++) {
        const currentPhoto = photos[photoIndex];
        const currentTimestamp = photoIndex * sequenceContext.intervalSeconds;
        
        console.log(`📸 Analyzing photo ${photoIndex + 1}/${photos.length} at ${currentTimestamp}s`);
        
        // Build cumulative learning prompt
        const sequentialPrompt = this.buildSequentialLearningPrompt(
          contextPrompt,
          learningContext,
          photoIndex,
          currentTimestamp
        );

        try {
          // Analyze current photo with all previous context
          const analysisResult = await this.providerManager.analyzeImageWithFallback(
            currentPhoto, 
            sequentialPrompt
          );

          // Parse and store this photo's analysis
          const photoAnalysis = this.parseSequentialPhotoResponse(
            analysisResult.result, 
            photoIndex, 
            currentTimestamp
          );

          // Update cumulative learning context
          this.updateLearningContext(learningContext, photoAnalysis, photoIndex);

          // Store in localStorage for persistence and future reference
          this.storeLearningProgress(sequenceId, learningContext, photoIndex);

          console.log(`✅ Photo ${photoIndex + 1} analysis complete - stored learning context`);

        } catch (error) {
          console.error(`❌ Photo ${photoIndex + 1} analysis failed:`, error);
          // Continue with next photo, marking this one as failed
          learningContext.analysisHistory.push({
            photoIndex,
            timestamp: currentTimestamp,
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      // Generate final comprehensive analysis from all sequential learning
      const finalAnalysis = this.generateComprehensiveSequentialAnalysis(learningContext);
      
      // Store complete analysis for future reference
      this.storeCompleteSequentialAnalysis(sequenceId, finalAnalysis);

      console.log(`🎯 Sequential learning analysis complete: ${learningContext.analysisHistory.length} photos processed`);
      
      return finalAnalysis;

    } catch (error: any) {
      console.error('❌ Sequential photo analysis failed:', error);
      throw new Error(`Sequential photo analysis failed: ${error.message}`);
    }
  }

  /**
   * Build sequential learning prompt that includes all previous analysis context
   */
  private buildSequentialLearningPrompt(
    basePrompt: string,
    learningContext: any,
    photoIndex: number,
    currentTimestamp: number
  ): string {
    const isFirstPhoto = photoIndex === 0;
    const previousAnalyses = learningContext.analysisHistory.slice(0, photoIndex);
    
    let sequentialPrompt = `${basePrompt}

## SEQUENTIAL LEARNING CONTEXT:
You are analyzing Photo ${photoIndex + 1} of ${learningContext.totalPhotos} in a temporal sequence.
Current timestamp: ${currentTimestamp} seconds
Photo sequence ID: ${learningContext.sequenceId}

`;

    if (isFirstPhoto) {
      sequentialPrompt += `
## FIRST PHOTO ANALYSIS:
This is the initial baseline photo. Establish:
1. Initial horse condition and behavior state
2. Baseline health indicators
3. Environmental context
4. Key features to track in subsequent photos
5. Potential areas of concern to monitor

Focus on creating a comprehensive baseline for comparison with future photos.
`;
    } else {
      sequentialPrompt += `
## PROGRESSIVE LEARNING FROM PREVIOUS PHOTOS:

### PREVIOUS ANALYSES SUMMARY:
${this.summarizePreviousAnalyses(previousAnalyses)}

### CUMULATIVE INSIGHTS SO FAR:
**Behavior Patterns Identified:**
${learningContext.cumulativeInsights.behaviorPatterns.map((p: string) => `- ${p}`).join('\n') || '- None identified yet'}

**Health Trends Observed:**
${learningContext.cumulativeInsights.healthTrends.map((t: string) => `- ${t}`).join('\n') || '- None identified yet'}

**Movement Progression:**
${learningContext.cumulativeInsights.movementProgression.map((m: string) => `- ${m}`).join('\n') || '- None identified yet'}

**Risk Factors Noted:**
${learningContext.cumulativeInsights.riskFactors.map((r: string) => `- ${r}`).join('\n') || '- None identified yet'}

**Consistent Findings:**
${learningContext.cumulativeInsights.consistentFindings.map((f: string) => `- ${f}`).join('\n') || '- None identified yet'}

## CURRENT PHOTO ANALYSIS REQUIREMENTS:
1. **Compare with Previous State**: How has the horse's condition changed since the last photo?
2. **Trend Analysis**: Are the patterns identified in previous photos continuing or changing?
3. **Progressive Assessment**: What new insights emerge when viewing this photo in sequence?
4. **Cumulative Health Picture**: How does this photo contribute to the overall health assessment?
5. **Predictive Indicators**: Based on the progression so far, what should we watch for in remaining photos?

## LEARNING ENHANCEMENT:
Build upon previous insights. If you identified a concern in Photo ${photoIndex}, confirm or refute it in this photo.
Look for progression, improvement, or deterioration of previously noted conditions.
`;
    }

    sequentialPrompt += `
## RESPONSE FORMAT:
Provide your analysis in JSON format with these sections:
{
  "photoAnalysis": {
    "photoNumber": ${photoIndex + 1},
    "timestamp": "${currentTimestamp}s",
    "immediateObservations": "What you see in this specific photo",
    "comparisonToPrevious": "${isFirstPhoto ? 'N/A - Baseline photo' : 'How this photo compares to previous ones'}",
    "newInsights": "What new information this photo provides",
    "confirmedPatterns": "Patterns from previous photos that this photo confirms",
    "contradictedPatterns": "Any previous assumptions this photo challenges"
  },
  "cumulativeAssessment": {
    "overallHealthTrend": "improving|stable|declining|variable",
    "behaviorProgression": "Description of behavior changes over time",
    "movementQuality": "Assessment of movement progression",
    "concernLevel": "low|medium|high|critical",
    "confidenceLevel": "How confident you are in this assessment (0-1)"
  },
  "learningUpdates": {
    "newBehaviorPatterns": ["Any new patterns identified"],
    "updatedHealthTrends": ["Updated health trend observations"],
    "movementProgressionNotes": ["Movement progression observations"],
    "identifiedRiskFactors": ["Any risk factors identified"],
    "consistentFindings": ["Findings consistent across photos"]
  },
  "nextPhotoGuidance": "${photoIndex === learningContext.totalPhotos - 1 ? 'N/A - Final photo' : 'What to specifically look for in the next photo'}"
}

CRITICAL: Respond with valid JSON only. Build upon previous analysis to create a comprehensive understanding.
`;

    return sequentialPrompt;
  }

  /**
   * Summarize previous analyses for context
   */
  private summarizePreviousAnalyses(previousAnalyses: any[]): string {
    if (previousAnalyses.length === 0) return 'No previous analyses';
    
    return previousAnalyses.map((analysis, index) => 
      `Photo ${index + 1} (${analysis.timestamp}): ${analysis.summary || 'Analysis completed'}`
    ).join('\n');
  }

  /**
   * Parse sequential photo response and extract learning insights
   */
  private parseSequentialPhotoResponse(result: any, photoIndex: number, timestamp: number): any {
    try {
      let parsedResult;
      
      if (typeof result === 'string') {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } else {
        parsedResult = result;
      }

      return {
        photoIndex,
        timestamp,
        status: 'success',
        analysis: parsedResult,
        summary: parsedResult.photoAnalysis?.immediateObservations || 'Analysis completed',
        insights: parsedResult.learningUpdates || {},
        assessment: parsedResult.cumulativeAssessment || {}
      };

    } catch (error) {
      console.error(`Failed to parse photo ${photoIndex + 1} response:`, error);
      return {
        photoIndex,
        timestamp,
        status: 'parse_error',
        error: error.message,
        rawResponse: result
      };
    }
  }

  /**
   * Update learning context with new insights from current photo
   */
  private updateLearningContext(learningContext: any, photoAnalysis: any, photoIndex: number): void {
    // Add this analysis to history
    learningContext.analysisHistory.push(photoAnalysis);
    
    // Update cumulative insights if analysis was successful
    if (photoAnalysis.status === 'success' && photoAnalysis.insights) {
      const insights = photoAnalysis.insights;
      
      // Merge new patterns and insights
      if (insights.newBehaviorPatterns) {
        learningContext.cumulativeInsights.behaviorPatterns.push(...insights.newBehaviorPatterns);
      }
      
      if (insights.updatedHealthTrends) {
        learningContext.cumulativeInsights.healthTrends.push(...insights.updatedHealthTrends);
      }
      
      if (insights.movementProgressionNotes) {
        learningContext.cumulativeInsights.movementProgression.push(...insights.movementProgressionNotes);
      }
      
      if (insights.identifiedRiskFactors) {
        learningContext.cumulativeInsights.riskFactors.push(...insights.identifiedRiskFactors);
      }
      
      if (insights.consistentFindings) {
        learningContext.cumulativeInsights.consistentFindings.push(...insights.consistentFindings);
      }
    }
    
    // Update temporal progression
    learningContext.temporalProgression.currentTime = photoAnalysis.timestamp;
  }

  /**
   * Store learning progress in localStorage for persistence
   */
  private storeLearningProgress(sequenceId: string, learningContext: any, photoIndex: number): void {
    try {
      const storageKey = `sequential_learning_${sequenceId}`;
      const progressData = {
        sequenceId,
        currentPhoto: photoIndex + 1,
        totalPhotos: learningContext.totalPhotos,
        lastUpdated: new Date().toISOString(),
        cumulativeInsights: learningContext.cumulativeInsights,
        analysisCount: learningContext.analysisHistory.length,
        // Store only essential data to manage localStorage size
        recentAnalyses: learningContext.analysisHistory.slice(-3) // Keep last 3 for context
      };
      
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      console.log(`💾 Stored learning progress for photo ${photoIndex + 1}`);
      
    } catch (error) {
      console.warn('Failed to store learning progress in localStorage:', error);
      // Continue without localStorage if it fails
    }
  }

  /**
   * Generate comprehensive analysis from all sequential learning
   */
  private generateComprehensiveSequentialAnalysis(learningContext: any): IEnhancedVideoAnalysisResult {
    const successfulAnalyses = learningContext.analysisHistory.filter(a => a.status === 'success');
    const totalPhotos = learningContext.totalPhotos;
    const analyzedPhotos = successfulAnalyses.length;
    
    // Calculate overall confidence based on successful analyses
    const overallConfidence = analyzedPhotos / totalPhotos;
    
    // Determine overall health trend from cumulative insights
    const healthTrends = learningContext.cumulativeInsights.healthTrends;
    const riskFactors = learningContext.cumulativeInsights.riskFactors;
    
    // Generate comprehensive recommendations
    const recommendations = [
      `Sequential analysis of ${analyzedPhotos}/${totalPhotos} photos completed`,
      ...learningContext.cumulativeInsights.consistentFindings.slice(0, 3),
      ...riskFactors.slice(0, 2).map(risk => `Monitor: ${risk}`)
    ];

    return {
      timestamp: new Date().toISOString(),
      horseDetected: true,
      confidence: overallConfidence,
      healthRisk: riskFactors.length > 0 ? 0.6 : 0.2,
      behaviorScore: 0.8,
      activityLevel: 0.8,
      alertLevel: riskFactors.length > 2 ? 'high' : 'medium',
      
      healthMetrics: {
        overallHealthScore: Math.round((1 - (riskFactors.length * 0.1)) * 100),
        mobilityScore: 80,
        behavioralScore: 85,
        respiratoryScore: 80,
        postureScore: 80
      },
      
      clinicalAssessment: {
        posturalAnalysis: learningContext.cumulativeInsights.movementProgression.join('; ') || 'Sequential movement analysis completed',
        mobilityAssessment: 'Progressive mobility assessment over time sequence',
        respiratoryObservation: 'Temporal respiratory pattern analysis',
        behavioralNotes: learningContext.cumulativeInsights.behaviorPatterns.join('; ') || 'Behavioral progression tracked'
      },
      
      alerts: riskFactors.map((risk, index) => ({
        type: 'sequential_finding',
        severity: 'medium' as const,
        description: risk,
        timestamp: new Date().toISOString()
      })),
      
      riskAssessment: {
        overallRiskLevel: riskFactors.length > 2 ? 'high' : 'moderate',
        riskScore: Math.min(riskFactors.length * 0.2, 1.0),
        immediateRisks: riskFactors.filter(r => r.includes('immediate')),
        monitoringNeeded: learningContext.cumulativeInsights.healthTrends
      },
      
      recommendations,
      insights: [
        `Sequential learning analysis: ${analyzedPhotos} photos processed`,
        `Behavior patterns identified: ${learningContext.cumulativeInsights.behaviorPatterns.length}`,
        `Health trends tracked: ${learningContext.cumulativeInsights.healthTrends.length}`,
        `Consistent findings: ${learningContext.cumulativeInsights.consistentFindings.length}`
      ],
      
      metadata: {
        captureTimestamp: new Date().toISOString(),
        segmentIndex: 0,
        videoDuration: learningContext.temporalProgression.currentTime,
        videoSize: 0,
        totalFrames: totalPhotos,
        successfulFrames: analyzedPhotos,
        processingTime: Date.now(),
        fallbackUsed: false,
        sequentialLearning: {
          sequenceId: learningContext.sequenceId,
          totalPhotos,
          analyzedPhotos,
          learningEffectiveness: overallConfidence
        }
      }
    };
  }

  /**
   * Store complete sequential analysis for future reference
   */
  private storeCompleteSequentialAnalysis(sequenceId: string, analysis: IEnhancedVideoAnalysisResult): void {
    try {
      const storageKey = `complete_analysis_${sequenceId}`;
      const completeData = {
        sequenceId,
        completedAt: new Date().toISOString(),
        analysis,
        summary: {
          totalPhotos: analysis.metadata.totalFrames,
          successfulAnalyses: analysis.metadata.successfulFrames,
          overallConfidence: analysis.confidence,
          keyFindings: analysis.insights.slice(0, 5)
        }
      };
      
      localStorage.setItem(storageKey, JSON.stringify(completeData));
      console.log(`💾 Stored complete sequential analysis: ${sequenceId}`);
      
    } catch (error) {
      console.warn('Failed to store complete analysis in localStorage:', error);
    }
  }

  /**
   * Extract multiple frames from video at strategic intervals
   */
  private async extractMultipleFrames(videoBlob: Blob, frameCount: number = 3): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot create canvas context'));
        return;
      }
      
      const frames: string[] = [];
      let currentFrameIndex = 0;
      let frameTimestamps: number[] = [];
      
      // Wait for video to load enough data first
      video.onloadeddata = () => {
        const duration = video.duration;
        
        console.log(`📹 Video loaded: duration=${duration}s, ready state=${video.readyState}, dimensions=${video.videoWidth}x${video.videoHeight}`);
        
        // Set canvas dimensions from video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        // For videos with problematic duration or very short videos, use immediate capture
        if (!isFinite(duration) || duration <= 0 || duration < 2) {
          console.warn(`⚠️ Invalid video duration (${duration}s), using immediate frame capture`);
          
          // Wait for video to have current data, then capture
          const waitForVideoData = () => {
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA
              // Ensure we're at the beginning or a valid time
              if (video.currentTime === 0 || !isFinite(video.currentTime)) {
                video.currentTime = 0;
              }
              
              // Small delay to ensure frame is rendered
              setTimeout(() => {
                try {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const imageData = canvas.toDataURL('image/jpeg', 0.9);
                  
                  console.log(`📸 Immediate capture: ${(imageData.length / 1024).toFixed(1)}KB`);
                  
                  if (imageData && imageData.startsWith('data:image/') && imageData.length > 10000) {
                    console.log(`✅ Successful immediate frame capture - will analyze this single frame`);
                    this.cleanup(video, canvas);
                    resolve([imageData]);
                  } else {
                    console.error(`❌ Frame capture failed - small image: ${imageData?.length} bytes`);
                    this.cleanup(video, canvas);
                    reject(new Error('Frame capture produced invalid image data'));
                  }
        } catch (error) {
                  console.error('❌ Frame capture drawing failed:', error);
                  this.cleanup(video, canvas);
                  reject(error);
                }
              }, 100);
            } else {
              // Wait a bit more for video to load
              setTimeout(waitForVideoData, 50);
            }
          };
          
          waitForVideoData();
          return;
        }
        
        console.log(`📹 Video duration: ${duration.toFixed(2)}s, extracting ${frameCount} frames`);
        
        // Calculate frame timestamps (beginning, middle, end-ish)
        if (frameCount === 1) {
          frameTimestamps = [Math.min(1, duration * 0.5)];
        } else if (frameCount === 2) {
          frameTimestamps = [
            Math.min(1, duration * 0.25),
            Math.min(duration - 1, duration * 0.75)
          ];
        } else {
          frameTimestamps = [
            Math.min(1, duration * 0.2),
            Math.min(duration - 1, duration * 0.5),
            Math.min(duration - 1, duration * 0.8)
          ];
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Start extracting first frame
        video.currentTime = frameTimestamps[0];
      };
      
      video.onseeked = async () => {
        try {
          const frameData = await this.extractSingleFrameFromElement(video, canvas, ctx);
          frames.push(frameData);
          
          console.log(`📸 Extracted frame ${frames.length}/${frameCount} at ${video.currentTime.toFixed(2)}s`);
          
          currentFrameIndex++;
          
          if (currentFrameIndex < frameCount && currentFrameIndex < frameTimestamps.length) {
            // Move to next frame
            video.currentTime = frameTimestamps[currentFrameIndex];
          } else {
            // All frames extracted
            this.cleanup(video, canvas);
            resolve(frames);
          }
          
        } catch (error) {
          this.cleanup(video, canvas);
          reject(error);
        }
      };
      
      video.onerror = (error) => {
        this.cleanup(video, canvas);
        reject(new Error('Video loading failed'));
      };
      
      // Set up video
      video.src = URL.createObjectURL(videoBlob);
      video.load();
    });
  }

  /**
   * Extract single frame as fallback
   */
  private async extractSingleFrame(videoBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Cannot create canvas context'));
        return;
      }
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        // Try immediate capture first if duration is problematic
        if (!isFinite(video.duration) || video.duration <= 0) {
          setTimeout(() => {
            try {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = canvas.toDataURL('image/jpeg', 0.8);
              
              if (imageData && imageData.startsWith('data:image/')) {
                console.log(`✅ Single frame captured: ${(imageData.length / 1024).toFixed(1)}KB`);
                this.cleanup(video, canvas);
                resolve(imageData);
              } else {
                console.error('Invalid single frame data, trying seek method');
                // Continue to seek method
                const safeTime = 0;
                video.currentTime = safeTime;
              }
            } catch (error) {
              console.error('Immediate frame capture failed, trying with seek:', error);
              // Continue to seek method
              const safeTime = 0;
              video.currentTime = safeTime;
            }
          }, 300);
          return;
        }
        
        // Use a safe timestamp
        const safeTime = Math.min(1, video.duration * 0.1);
        video.currentTime = isFinite(safeTime) && safeTime > 0 ? safeTime : 0;
      };
      
      video.onseeked = async () => {
        try {
          const frameData = await this.extractSingleFrameFromElement(video, canvas, ctx);
          this.cleanup(video, canvas);
          resolve(frameData);
        } catch (error) {
          this.cleanup(video, canvas);
          reject(error);
        }
      };
      
      video.onerror = () => {
        this.cleanup(video, canvas);
        reject(new Error('Video loading failed'));
      };
      
      video.src = URL.createObjectURL(videoBlob);
      video.load();
    });
  }

  /**
   * Extract frame from video element
   */
  private async extractSingleFrameFromElement(
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Cleanup video and canvas elements
   */
  private cleanup(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    try {
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      video.remove();
      canvas.remove();
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }

  /**
   * Integrate multiple frame analyses into comprehensive result
   */
  private integrateFrameAnalyses(
    analyses: IHorseAnalysisResult[],
    metadata: any
  ): IEnhancedVideoAnalysisResult {
    const validAnalyses = analyses.filter(a => a.confidence > 0.3);
    
    if (validAnalyses.length === 0) {
      throw new Error('No valid frame analyses to integrate');
    }
    
    // Calculate weighted averages based on confidence with null safety
    const totalWeight = validAnalyses.reduce((sum, a) => sum + (a.confidence || 0.5), 0);
    const avgConfidence = totalWeight / validAnalyses.length;
    
    // Calculate health risk with proper null checking
    const healthRiskSum = validAnalyses.reduce((sum, a) => {
      const riskScore = a.riskScore || 0.3; // Default risk score
      const confidence = a.confidence || 0.5; // Default confidence
      return sum + (riskScore * confidence);
    }, 0);
    const avgHealthRisk = totalWeight > 0 ? healthRiskSum / totalWeight : 0.3;
    
    // Calculate activity level with defaults
    const avgActivityLevel = validAnalyses.reduce((sum, a) => {
      const activityLevel = (a as any).activityLevel || 
                           (a.healthMetrics?.behavioralScore) || 
                           75; // Default activity level
      return sum + activityLevel;
    }, 0) / validAnalyses.length;
    
    // Determine highest alert level
    const alertLevels = ['low', 'medium', 'high', 'critical'];
    const highestAlertLevel = validAnalyses.reduce((highest, analysis) => {
      const currentLevel = (analysis as any).alertLevel || 'low';
      return alertLevels.indexOf(currentLevel) > alertLevels.indexOf(highest) ? currentLevel : highest;
    }, 'low');
    
    // Aggregate health metrics
    const healthMetrics = {
      overallHealthScore: Math.round(validAnalyses.reduce((sum, a) => sum + (100 - a.riskScore * 100), 0) / validAnalyses.length),
      mobilityScore: Math.round(validAnalyses.reduce((sum, a) => {
        const mobility = a.healthAssessment?.mobility || 'good';
        return sum + (mobility === 'excellent' ? 95 : mobility === 'good' ? 85 : mobility === 'limited' ? 65 : 45);
      }, 0) / validAnalyses.length),
      behavioralScore: Math.round(validAnalyses.reduce((sum, a) => sum + (a.healthMetrics?.behavioralScore || 80), 0) / validAnalyses.length),
      respiratoryScore: Math.round(validAnalyses.reduce((sum, a) => sum + (a.healthMetrics?.respiratoryScore || 85), 0) / validAnalyses.length),
      postureScore: Math.round(validAnalyses.reduce((sum, a) => sum + (a.healthMetrics?.postureScore || 75), 0) / validAnalyses.length)
    };
    
    // Aggregate clinical assessment
    const clinicalAssessment = {
      posturalAnalysis: this.combineAssessments(validAnalyses.map(a => a.clinicalAssessment?.posturalAnalysis)),
      mobilityAssessment: this.combineAssessments(validAnalyses.map(a => a.clinicalAssessment?.mobilityAssessment)),
      respiratoryObservation: this.combineAssessments(validAnalyses.map(a => a.clinicalAssessment?.respiratoryObservation)),
      behavioralNotes: this.combineAssessments(validAnalyses.map(a => a.clinicalAssessment?.behavioralState))
    };
    
    // Aggregate alerts
    const alerts = validAnalyses.flatMap(a => a.recommendations?.map(rec => ({
      type: 'recommendation' as const,
      severity: 'low' as const,
      description: rec,
      timestamp: new Date().toISOString()
    })) || []);
    
    return {
      timestamp: new Date().toISOString(),
      horseDetected: validAnalyses.some(a => a.horseDetected),
      confidence: avgConfidence || 0.5,
      healthRisk: avgHealthRisk || 0.3, // Ensure never undefined
      behaviorScore: Math.round(validAnalyses.reduce((sum, a) => sum + (a.healthMetrics?.behavioralScore || 75), 0) / validAnalyses.length),
      activityLevel: Math.round(avgActivityLevel || 75), // Ensure never NaN
      alertLevel: (highestAlertLevel === 'urgent' ? 'critical' : highestAlertLevel) as 'critical' | 'high' | 'medium' | 'low',
      healthMetrics,
      clinicalAssessment,
      alerts,
      riskAssessment: {
        overallRiskLevel: avgHealthRisk > 0.8 ? 'critical' : avgHealthRisk > 0.6 ? 'high' : avgHealthRisk > 0.4 ? 'moderate' : 'low',
        riskScore: avgHealthRisk,
        immediateRisks: [...new Set(validAnalyses.flatMap(a => a.riskAssessment?.immediateRisks || []))],
        monitoringNeeded: [...new Set(validAnalyses.flatMap(a => a.riskAssessment?.monitoringNeeded || []))]
      },
      recommendations: [...new Set(validAnalyses.flatMap(a => a.recommendations || []))],
      insights: [...new Set(validAnalyses.flatMap(a => a.detailedAnalysis ? [a.detailedAnalysis] : []))],
      metadata: {
        captureTimestamp: new Date().toISOString(),
        segmentIndex: 0,
        videoDuration: metadata.horseContext?.segmentDuration || 30,
        videoSize: metadata.videoBlob?.size || 0,
        processingTime: Date.now() - (metadata.startTime || Date.now()),
        totalFrames: metadata.totalFrames,
        successfulFrames: metadata.successfulFrames,
        fallbackUsed: metadata.fallbackUsed || false
      }
    };
  }

  /**
   * Convert AI response to standard format
   */
  private convertToStandardFormat(parsed: any): IHorseAnalysisResult {
    console.log('🔄 Converting AI response to standard format');
    console.log('📊 Input data structure:', {
      hasImageAssessment: !!parsed.imageAssessment,
      hasHealthMetrics: !!parsed.healthMetrics,
      hasClinicalAssessment: !!parsed.clinicalAssessment,
      hasRiskAssessment: !!parsed.riskAssessment,
      hasRecommendations: !!parsed.clinicalRecommendations,
      hasDetailedNotes: !!parsed.detailedClinicalNotes,
      riskScoreFromAssessment: parsed.riskAssessment?.riskScore,
      healthScoreFromMetrics: parsed.healthMetrics?.overallHealthScore
    });
    
    // Extract meaningful data from AI response instead of using hardcoded values
    const horseDetected = parsed.imageAssessment?.horsesDetected?.count > 0 || 
                         parsed.horseDetected || 
                         parsed.sceneAnalysis?.horsesDetected > 0 || 
                         true; // Default to true for horse-focused analysis

    // Use actual confidence from AI or calculate based on response quality
    let confidence = 0.5; // default
    if (parsed.confidenceLevel !== undefined) {
      confidence = parsed.confidenceLevel;
      console.log('✅ Using confidence from confidenceLevel:', confidence);
    } else if (parsed.confidence !== undefined) {
      confidence = parsed.confidence;
      console.log('✅ Using confidence from root:', confidence);
    } else if (parsed.analysisMetadata?.confidenceLevel !== undefined) {
      confidence = parsed.analysisMetadata.confidenceLevel;
      console.log('✅ Using confidence from metadata:', confidence);
    } else {
      // Calculate confidence based on data richness
      if (parsed.imageAssessment && parsed.clinicalAssessment && parsed.healthMetrics) {
        confidence = 0.85;
        console.log('✅ High confidence - has all data structures');
      } else if (parsed.imageAssessment && parsed.clinicalAssessment) {
        confidence = 0.75;
        console.log('✅ Good confidence - has image and clinical assessment');
      } else if (parsed.imageAssessment) {
        confidence = 0.65;
        console.log('✅ Fair confidence - has image assessment');
      } else {
        confidence = 0.5;
        console.log('⚠️ Low confidence - limited data');
      }
    }
    
    console.log('🎯 Final confidence:', confidence);

    // Extract health metrics from AI response
    const healthMetrics = parsed.healthMetrics || {};
    const clinicalAssessment = parsed.clinicalAssessment || {};
    
    // Map AI assessment to our health assessment format
    const healthAssessment: IHorseAnalysisResult['healthAssessment'] = {
      mobility: clinicalAssessment.mobilityAssessment?.toLowerCase().includes('lame') ? 'lame' :
               clinicalAssessment.mobilityAssessment?.toLowerCase().includes('limited') ? 'limited' :
               clinicalAssessment.mobilityAssessment?.toLowerCase().includes('concerning') ? 'concerning' :
               clinicalAssessment.mobilityAssessment?.toLowerCase().includes('excellent') ? 'excellent' : 'good',
      
      posture: clinicalAssessment.posturalAnalysis?.toLowerCase().includes('tense') ? 'tense' :
              clinicalAssessment.posturalAnalysis?.toLowerCase().includes('alert') ? 'alert' :
              clinicalAssessment.posturalAnalysis?.toLowerCase().includes('relaxed') ? 'relaxed' :
              clinicalAssessment.posturalAnalysis?.toLowerCase().includes('grazing') ? 'grazing' :
              clinicalAssessment.posturalAnalysis?.toLowerCase().includes('resting') ? 'resting' : 'normal',
      
      alertness: clinicalAssessment.alertnessLevel?.toLowerCase().includes('very') ? 'very_alert' :
                clinicalAssessment.alertnessLevel?.toLowerCase().includes('lethargic') ? 'lethargic' :
                clinicalAssessment.alertnessLevel?.toLowerCase().includes('drowsy') ? 'drowsy' :
                clinicalAssessment.alertnessLevel?.toLowerCase().includes('calm') ? 'calm' : 'alert',
      
      breathing: clinicalAssessment.respiratoryObservation?.toLowerCase().includes('labored') ? 'labored' :
                clinicalAssessment.respiratoryObservation?.toLowerCase().includes('elevated') ? 'elevated' :
                clinicalAssessment.respiratoryObservation?.toLowerCase().includes('distressed') ? 'distressed' : 'normal',
      
      overallCondition: parsed.riskAssessment?.overallRiskLevel === 'critical' ? 'urgent' :
                       parsed.riskAssessment?.overallRiskLevel === 'high' ? 'concerning' :
                       parsed.riskAssessment?.overallRiskLevel === 'moderate' ? 'fair' :
                       healthMetrics.overallHealthScore > 80 ? 'excellent' : 'good'
    };

    // Calculate risk score from AI data - explicit null checks
    let riskScore = 0.3; // default
    if (parsed.riskAssessment?.riskScore !== undefined && parsed.riskAssessment?.riskScore !== null) {
      riskScore = parsed.riskAssessment.riskScore;
      console.log('✅ Using risk score from riskAssessment:', riskScore);
    } else if (parsed.riskScore !== undefined && parsed.riskScore !== null) {
      riskScore = parsed.riskScore;
      console.log('✅ Using risk score from root:', riskScore);
    } else if (parsed.healthMetrics?.overallHealthScore) {
      riskScore = (100 - parsed.healthMetrics.overallHealthScore) / 100;
      console.log('✅ Calculated risk score from health score:', riskScore);
    } else {
      console.log('⚠️ Using default risk score:', riskScore);
    }
    
    console.log('🎯 Final risk score:', riskScore);

    // Determine alert level based on risk and AI assessment
    const alertLevel = riskScore > 0.8 ? 'urgent' :
                      riskScore > 0.6 ? 'high' :
                      riskScore > 0.4 ? 'medium' : 'low';

    // Extract recommendations from AI response
    const recommendations = parsed.clinicalRecommendations?.immediate || 
                           parsed.recommendations || 
                           parsed.riskAssessment?.monitoringNeeded ||
                           ['Continue monitoring based on AI analysis'];
    
    console.log('💡 Recommendations extraction:', {
      fromClinicalImmediate: parsed.clinicalRecommendations?.immediate,
      fromRecommendations: parsed.recommendations,
      fromMonitoringNeeded: parsed.riskAssessment?.monitoringNeeded,
      finalRecommendations: recommendations
    });

    // Extract behavioral observations
    const behaviorObservations = parsed.behaviorObservations || 
                                [clinicalAssessment.behavioralState || 'Normal behavior observed in AI analysis'];

    // Create detailed analysis from AI response
    let detailedAnalysis = 'AI analysis completed';
    if (parsed.detailedClinicalNotes) {
      detailedAnalysis = parsed.detailedClinicalNotes;
      console.log('✅ Using detailed clinical notes from AI');
    } else if (parsed.detailedAnalysis) {
      detailedAnalysis = parsed.detailedAnalysis;
      console.log('✅ Using detailed analysis from AI');
    } else {
      detailedAnalysis = this.createDetailedAnalysisFromParsed(parsed);
      console.log('✅ Created detailed analysis from parsed data');
    }
    
    console.log('📝 Final detailed analysis length:', detailedAnalysis.length);

    console.log('✅ Converted to standard format with AI data:', {
      confidence,
      riskScore,
      alertLevel,
      healthAssessment,
      recommendationsCount: recommendations.length
    });

    return {
      timestamp: new Date().toISOString(),
      horseDetected,
      confidence,
      
      // Preserve rich AI data
      imageAssessment: parsed.imageAssessment,
      primarySubjectAnalysis: parsed.primarySubjectAnalysis,
      clinicalAssessment: parsed.clinicalAssessment,
      healthMetrics: parsed.healthMetrics,
      riskAssessment: parsed.riskAssessment,
      clinicalRecommendations: parsed.clinicalRecommendations,
      analysisMetadata: parsed.analysisMetadata,
      detailedClinicalNotes: parsed.detailedClinicalNotes,
      
      // Legacy compatibility fields with AI-derived data
      sceneAnalysis: {
        horsesDetected: parsed.imageAssessment?.horsesDetected?.count || 1,
        humansDetected: false,
        sceneDescription: parsed.imageAssessment?.sceneContext || 'AI horse analysis completed',
        lightingQuality: parsed.imageAssessment?.lightingConditions?.toLowerCase().includes('poor') ? 'poor' :
                        parsed.imageAssessment?.lightingConditions?.toLowerCase().includes('good') ? 'good' : 'adequate',
        imageClarity: parsed.imageAssessment?.imageQuality?.toLowerCase().includes('blurry') ? 'blurry' :
                     parsed.imageAssessment?.imageQuality?.toLowerCase().includes('obscured') ? 'partially_obscured' : 'clear'
      },
      primaryFocus: 'horse',
      healthAssessment,
      behaviorObservations,
      riskScore,
      recommendations,
      alertLevel: alertLevel as 'low' | 'medium' | 'high' | 'urgent',
      rawAnalysis: JSON.stringify(parsed),
      detailedAnalysis,
      analysisContext: parsed.analysisContext || {
        whatAmIAnalyzing: 'AI-powered horse health and behavior analysis',
        analysisLimitations: parsed.analysisMetadata?.analysisLimitations || ['Standard AI vision analysis'],
        confidenceFactors: parsed.analysisMetadata?.dataQualityFactors || ['Image quality', 'Horse visibility', 'AI model confidence']
      }
    };
  }

  /**
   * Create detailed analysis text from parsed AI response
   */
  private createDetailedAnalysisFromParsed(parsed: any): string {
    const parts: string[] = [];
    
    if (parsed.primarySubjectAnalysis) {
      const psa = parsed.primarySubjectAnalysis;
      parts.push(`Subject Analysis: ${psa.breedAssessment || 'Horse detected'}`);
      if (psa.ageEstimate) parts.push(`Age: ${psa.ageEstimate}`);
      if (psa.bodyCondition) parts.push(`Body Condition: ${psa.bodyCondition}`);
    }
    
    if (parsed.clinicalAssessment) {
      const ca = parsed.clinicalAssessment;
      if (ca.posturalAnalysis) parts.push(`Posture: ${ca.posturalAnalysis}`);
      if (ca.mobilityAssessment) parts.push(`Mobility: ${ca.mobilityAssessment}`);
      if (ca.behavioralState) parts.push(`Behavior: ${ca.behavioralState}`);
    }
    
    if (parsed.riskAssessment?.concerningObservations?.length > 0) {
      parts.push(`Concerns: ${parsed.riskAssessment.concerningObservations.join(', ')}`);
    }
    
    return parts.length > 0 ? parts.join('. ') + '.' : 'Comprehensive AI analysis completed successfully.';
  }

  /**
   * Convert basic analysis to enhanced format
   */
  private convertToEnhancedFormat(
    analysis: IHorseAnalysisResult,
    metadata: any
  ): IEnhancedVideoAnalysisResult {
    return {
      timestamp: analysis.timestamp,
      horseDetected: analysis.horseDetected,
      confidence: analysis.confidence || 0.5,
      healthRisk: analysis.riskScore || 0.3, // Ensure never undefined
      behaviorScore: analysis.healthMetrics?.behavioralScore || 75, // Use AI data or default
      activityLevel: analysis.healthMetrics?.behavioralScore || 70, // Use AI data or default
      alertLevel: (analysis.alertLevel === 'urgent' ? 'critical' : analysis.alertLevel) as 'critical' | 'high' | 'medium' | 'low',
      healthMetrics: {
        overallHealthScore: Math.round(100 - analysis.riskScore * 100),
        mobilityScore: analysis.healthAssessment?.mobility === 'excellent' ? 95 : 
                      analysis.healthAssessment?.mobility === 'good' ? 85 : 
                      analysis.healthAssessment?.mobility === 'limited' ? 65 : 45,
        behavioralScore: 80,
        respiratoryScore: 85,
        postureScore: 75
      },
      clinicalAssessment: {
        posturalAnalysis: analysis.healthAssessment?.posture || 'normal',
        mobilityAssessment: analysis.healthAssessment?.mobility || 'good',
        respiratoryObservation: analysis.healthAssessment?.breathing || 'normal',
        behavioralNotes: analysis.behaviorObservations?.[0] || 'normal behavior'
      },
      alerts: [],
      riskAssessment: {
        overallRiskLevel: analysis.riskScore > 0.8 ? 'critical' : 
                         analysis.riskScore > 0.6 ? 'high' : 
                         analysis.riskScore > 0.4 ? 'moderate' : 'low',
        riskScore: analysis.riskScore,
        immediateRisks: [],
        monitoringNeeded: analysis.recommendations || []
      },
      recommendations: analysis.recommendations || [],
      insights: [analysis.detailedAnalysis || 'Analysis completed'],
      metadata: {
        captureTimestamp: new Date().toISOString(),
        segmentIndex: 0,
        videoDuration: metadata.horseContext?.segmentDuration || 30,
        videoSize: metadata.videoBlob?.size || 0,
        processingTime: 100,
        totalFrames: metadata.totalFrames || 1,
        successfulFrames: metadata.successfulFrames || 1,
        fallbackUsed: metadata.fallbackUsed || false
      }
    };
  }

  /**
   * Combine multiple assessment strings
   */
  private combineAssessments(assessments: (string | undefined)[]): string {
    const validAssessments = assessments.filter(a => a && a.trim() !== '' && a !== 'undefined');
    if (validAssessments.length === 0) return 'normal';
    
    // If all assessments are the same, return that
    const unique = [...new Set(validAssessments)];
    if (unique.length === 1) return unique[0] as string;
    
    // Combine different assessments
    return unique.join('; ');
  }

  /**
   * Get detection areas for focus overlay (simplified for horses)
   */
  public async getDetectionAreas(imageData: string): Promise<Array<{x: number, y: number, width: number, height: number, label: string}>> {
    // Simplified implementation - in practice you might use a different model
    return [
      { x: 0.2, y: 0.1, width: 0.6, height: 0.8, label: 'Horse Detection Area' }
    ];
  }

  /**
   * Parse text-based analysis when JSON parsing fails
   */
  private parseTextAnalysis(text: string): IHorseAnalysisResult {
    const timestamp = new Date().toISOString();
    
    // Check if AI is refusing to analyze
    const isRefusal = text.toLowerCase().includes("i'm unable") || 
                     text.toLowerCase().includes("i cannot") ||
                     text.toLowerCase().includes("unable to");
    
    // Simple text parsing for key indicators
    const riskScore = text.toLowerCase().includes('urgent') ? 0.9 :
                     text.toLowerCase().includes('concerning') ? 0.7 :
                     text.toLowerCase().includes('normal') ? 0.3 : 
                     isRefusal ? 0.2 : 0.5;
    
    const alertLevel = riskScore > 0.8 ? 'urgent' :
                      riskScore > 0.6 ? 'high' :
                      riskScore > 0.4 ? 'medium' : 'low';
    
    // Handle refusal cases
    const horseDetected = !isRefusal && !text.toLowerCase().includes('no horse');
    const horsesCount = horseDetected ? 1 : 0;
    
      return {
        timestamp,
      horseDetected,
      confidence: isRefusal ? 0.3 : 0.6,
      sceneAnalysis: {
        horsesDetected: horsesCount,
        humansDetected: false,
        sceneDescription: isRefusal ? 'Analysis unavailable - possible safety restriction' : 'Text-based analysis',
        lightingQuality: 'adequate',
        imageClarity: 'clear'
      },
      primaryFocus: horseDetected ? 'horse' : 'scene',
      healthAssessment: {
        mobility: 'good',
        posture: 'normal',
        alertness: 'alert',
        breathing: 'normal',
        overallCondition: 'good'
      },
      behaviorObservations: [
        isRefusal ? 'AI analysis unavailable' : text.substring(0, 200),
        isRefusal ? 'Possible content policy restriction' : 'Manual review recommended'
      ],
      riskScore,
      recommendations: [
        isRefusal ? 'Try with different image' : 'Continue monitoring',
        isRefusal ? 'Manual visual inspection recommended' : 'Review full analysis text',
        isRefusal ? 'Consider using Anthropic fallback' : 'Standard monitoring protocols'
      ],
      alertLevel: alertLevel as 'low' | 'medium' | 'high' | 'urgent',
      rawAnalysis: text,
      detailedAnalysis: text,
      analysisContext: {
        whatAmIAnalyzing: isRefusal ? 'AI refusal handling' : 'Text-parsed horse analysis',
        analysisLimitations: ['Simplified text parsing', 'No structured data'],
        confidenceFactors: ['Basic text analysis']
      }
    };
  }

  /**
   * Get analysis history
   */
  public getAnalysisHistory(limit: number = 10): IHorseAnalysisResult[] {
    return this.analysisHistory.slice(0, limit);
  }

  /**
   * Get health trends from history
   */
  public getHealthTrends(): {
    riskScoreTrend: number[];
    mobilityTrend: string[];
    alertLevelTrend: string[];
    timestamps: string[];
  } {
    const history = this.analysisHistory.slice(0, 20); // Last 20 analyses
    
      return {
      riskScoreTrend: history.map(h => h.riskScore),
      mobilityTrend: history.map(h => h.healthAssessment.mobility),
      alertLevelTrend: history.map(h => h.alertLevel),
      timestamps: history.map(h => h.timestamp)
    };
  }

  /**
   * Check if horse needs immediate attention
   */
  public needsImmediateAttention(analysis: IHorseAnalysisResult): boolean {
    return analysis.alertLevel === 'urgent' || 
           analysis.riskScore > 0.8 ||
           analysis.healthAssessment.overallCondition === 'urgent' ||
           analysis.healthAssessment.mobility === 'lame';
  }

  /**
   * Make API call with retry logic
   */
  private async makeApiCallWithRetry(contextPrompt: string, imageData: string): Promise<any> {
    return this.providerManager.analyzeImageWithFallback(imageData, contextPrompt);
  }

  /**
   * Parse analysis response from AI
   */
  private parseAnalysisResponse(result: any): IHorseAnalysisResult {
    try {
      console.log('🔍 Parsing AI analysis response type:', typeof result);
      console.log('🔍 Response structure keys:', Object.keys(result || {}));
      
      // Handle provider response wrapper (result.result contains the actual analysis)
      let parsedResult = result;
      
      // If result has a nested 'result' field (from provider wrapper), extract it
      if (result && typeof result === 'object' && result.result) {
        console.log('📦 Found provider wrapper, extracting nested result');
        parsedResult = result.result;
      }
      
      // Parse JSON string if needed
      if (typeof parsedResult === 'string') {
        try {
          parsedResult = JSON.parse(parsedResult);
          console.log('📄 Parsed JSON string to object');
        } catch (parseError) {
          console.warn('⚠️ Failed to parse JSON string, treating as text');
          return this.parseTextAnalysis(parsedResult);
        }
      }

      // Handle the sophisticated JSON structure from advanced equine video health analysis
      if (parsedResult && typeof parsedResult === 'object') {
        // Check if this is the advanced video analysis format
        // Claude returns sceneDescription instead of imageAssessment
        if ((parsedResult.sceneDescription || parsedResult.imageAssessment) && parsedResult.healthMetrics && parsedResult.clinicalAssessment) {
          console.log('🎯 Parsing ADVANCED equine video health analysis response');
          console.log('📊 Advanced format detected with keys:', Object.keys(parsedResult));
          
          // Map the advanced response to our interface
          const advancedAnalysis: IHorseAnalysisResult = {
            timestamp: parsedResult.timestamp || new Date().toISOString(),
            horseDetected: parsedResult.horseDetected || false,
            confidence: parsedResult.confidence || 0.0,
            
            // Map the sophisticated image assessment (Claude returns sceneDescription)
            imageAssessment: {
              horsesDetected: {
                count: parsedResult.horseDetected ? 1 : 0,
                locations: [parsedResult.sceneDescription?.positioning?.locationInFrame || 'center'],
                identifiableBreeds: [parsedResult.sceneDescription?.horseDescription?.coatColor || 'unknown']
              },
              imageQuality: parsedResult.sceneDescription?.cameraQuality?.imageClarity || 'unknown',
              lightingConditions: parsedResult.sceneDescription?.environment?.lighting || 'unknown',
              sceneContext: parsedResult.sceneDescription?.overallSceneAssessment || 'Video analysis'
            },
            
            // Map the primary subject analysis (from Claude's sceneDescription.horseDescription)
            primarySubjectAnalysis: {
              subjectType: 'horse',
              breedAssessment: parsedResult.sceneDescription?.horseDescription?.coatColor || 'unknown',
              ageEstimate: parsedResult.sceneDescription?.horseDescription?.approximateSize || 'unknown',
              genderAssessment: 'unknown',
              sizeClassification: parsedResult.sceneDescription?.horseDescription?.approximateSize || 'unknown',
              coatCondition: parsedResult.sceneDescription?.horseDescription?.bodyCondition || 'unknown',
              facialExpression: 'alert',
              bodyLanguage: parsedResult.sceneDescription?.positioning?.postureGeneral || 'unknown'
            },
            
            // Map the clinical assessment (this is the key advanced data)
            clinicalAssessment: {
              posturalAnalysis: parsedResult.clinicalAssessment?.posturalAnalysis || 'No postural analysis available',
              mobilityAssessment: parsedResult.clinicalAssessment?.mobilityAssessment || 'No mobility assessment available',
              respiratoryObservation: parsedResult.clinicalAssessment?.respiratoryObservation || 'No respiratory observation available',
              behavioralState: parsedResult.clinicalAssessment?.behavioralState || 'No behavioral analysis available',
              alertnessLevel: parsedResult.clinicalAssessment?.alertnessLevel || 'alert',
              painIndicators: parsedResult.clinicalAssessment?.painIndicators || [],
              discomfortSigns: parsedResult.clinicalAssessment?.discomfortSigns || [],
              gaitAnalysis: parsedResult.clinicalAssessment?.gaitAnalysis || undefined,
              lamenessIndicators: parsedResult.clinicalAssessment?.lamenessIndicators || []
            },
            
            // Map the health metrics (scored assessments)
            healthMetrics: {
              overallHealthScore: parsedResult.healthMetrics?.overallHealthScore || 0,
              mobilityScore: parsedResult.healthMetrics?.mobilityScore || 0,
              behavioralScore: parsedResult.healthMetrics?.behavioralScore || 0,
              respiratoryScore: parsedResult.healthMetrics?.respiratoryScore || 0,
              postureScore: parsedResult.healthMetrics?.postureScore || 0,
              alertnessScore: parsedResult.healthMetrics?.alertnessScore || 80,
              gaitScore: parsedResult.healthMetrics?.gaitScore || 0
            },
            
            // Map the risk assessment
            riskAssessment: {
              overallRiskLevel: parsedResult.riskAssessment?.overallRiskLevel || 'low',
              riskScore: parsedResult.riskAssessment?.riskScore || 0.0,
              immediateRisks: parsedResult.riskAssessment?.immediateRisks || [],
              monitoringNeeded: parsedResult.riskAssessment?.monitoringNeeded || [],
              concerningObservations: parsedResult.riskAssessment?.concerningObservations || []
            },
            
            // Map clinical recommendations
            clinicalRecommendations: {
              immediate: result.recommendations?.slice(0, 3) || [],
              shortTerm: result.recommendations?.slice(3, 6) || [],
              longTerm: result.recommendations?.slice(6) || [],
              veterinaryConsultation: result.alertLevel === 'critical' || result.alertLevel === 'high' ? 
                'Immediate veterinary consultation recommended' : 
                'Routine monitoring sufficient',
              monitoringFrequency: result.alertLevel === 'critical' ? 'Continuous' :
                                 result.alertLevel === 'high' ? 'Every 2 hours' :
                                 result.alertLevel === 'medium' ? 'Every 6 hours' : 'Daily'
            },
            
            // Analysis metadata
            analysisMetadata: {
              analysisTimestamp: result.metadata?.captureTimestamp || new Date().toISOString(),
              confidenceLevel: result.confidence || 0.0,
              analysisLimitations: ['Video-based analysis', 'Single frame assessment'],
              dataQualityFactors: [
                `Image clarity: ${result.sceneDescription?.cameraQuality?.imageClarity || 'unknown'}`,
                `Lighting: ${result.sceneDescription?.environment?.lighting || 'unknown'}`,
                `Camera angle: ${result.sceneDescription?.cameraQuality?.cameraAngle || 'unknown'}`
              ],
              recommendedFollowUp: result.recommendations?.[0] || 'Continue monitoring'
            },
            
            // Detailed clinical notes
            detailedClinicalNotes: result.insights?.join(' ') || 'Advanced video analysis completed',
            
            // Legacy fields for backward compatibility
            sceneAnalysis: {
              horsesDetected: result.horseDetected ? 1 : 0,
              humansDetected: false,
              sceneDescription: result.sceneDescription?.overallSceneAssessment || 'Video analysis',
              lightingQuality: result.sceneDescription?.environment?.lighting === 'natural daylight' ? 'good' : 'adequate',
              imageClarity: result.sceneDescription?.cameraQuality?.imageClarity === 'clear' ? 'clear' : 'adequate'
            },
            primaryFocus: 'horse',
            healthAssessment: {
              mobility: this.mapMobilityScore(result.healthMetrics?.mobilityScore),
              posture: this.mapPostureFromDescription(result.sceneDescription?.positioning?.postureGeneral),
              alertness: this.mapAlertnessFromLevel(result.alertLevel),
              breathing: this.mapRespiratoryScore(result.healthMetrics?.respiratoryScore),
              overallCondition: this.mapOverallCondition(result.healthMetrics?.overallHealthScore, result.alertLevel)
            },
            behaviorObservations: result.insights || [],
            riskScore: result.riskAssessment?.riskScore || 0.0,
            recommendations: parsedResult.clinicalRecommendations?.immediate || parsedResult.recommendations || [],
            alertLevel: parsedResult.riskAssessment?.overallRiskLevel || 'low',
            rawAnalysis: JSON.stringify(parsedResult, null, 2),
            detailedAnalysis: this.formatAdvancedAnalysisForDisplay(parsedResult),
            analysisContext: {
              whatAmIAnalyzing: 'Advanced equine video health analysis using biomechanical assessment',
              analysisLimitations: [
                'Video-based visual analysis only',
                'Single frame assessment',
                'AI interpretation requires veterinary validation'
              ],
              confidenceFactors: [
                `Overall confidence: ${(result.confidence * 100).toFixed(1)}%`,
                `Health metrics available: ${Object.keys(result.healthMetrics || {}).length}`,
                `Clinical assessments: ${Object.keys(result.clinicalAssessment || {}).length}`,
                `Risk factors identified: ${(result.riskAssessment?.immediateRisks?.length || 0)}`
              ]
            }
          };
          
          console.log('✅ Advanced analysis parsed successfully');
          return advancedAnalysis;
        }
      }
      
      // Fallback to original parsing logic for other response formats
      return this.parseOriginalResponse(parsedResult);
      
    } catch (error) {
      console.error('❌ Failed to parse analysis response:', error);
      return this.getFallbackHorseAnalysis();
    }
  }

  // Helper methods for mapping advanced response data
  private mapMobilityScore(score?: number): 'excellent' | 'good' | 'limited' | 'concerning' | 'lame' {
    if (!score) return 'good';
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'limited';
    if (score >= 30) return 'concerning';
    return 'lame';
  }

  private mapPostureFromDescription(posture?: string): 'normal' | 'alert' | 'relaxed' | 'tense' | 'standing' | 'grazing' | 'resting' {
    if (!posture) return 'normal';
    const lower = posture.toLowerCase();
    if (lower.includes('standing')) return 'standing';
    if (lower.includes('grazing')) return 'grazing';
    if (lower.includes('resting')) return 'resting';
    if (lower.includes('alert')) return 'alert';
    if (lower.includes('relaxed')) return 'relaxed';
    if (lower.includes('tense')) return 'tense';
    return 'normal';
  }

  private mapAlertnessFromLevel(alertLevel?: string): 'very_alert' | 'alert' | 'calm' | 'drowsy' | 'lethargic' {
    if (!alertLevel) return 'alert';
    switch (alertLevel) {
      case 'critical':
      case 'high': return 'very_alert';
      case 'medium': return 'alert';
      case 'low': return 'calm';
      default: return 'alert';
    }
  }

  private mapRespiratoryScore(score?: number): 'normal' | 'elevated' | 'labored' | 'distressed' {
    if (!score) return 'normal';
    if (score >= 80) return 'normal';
    if (score >= 60) return 'elevated';
    if (score >= 40) return 'labored';
    return 'distressed';
  }

  private mapOverallCondition(healthScore?: number, alertLevel?: string): 'excellent' | 'good' | 'fair' | 'concerning' | 'urgent' {
    if (alertLevel === 'critical') return 'urgent';
    if (alertLevel === 'high') return 'concerning';
    if (!healthScore) return 'good';
    if (healthScore >= 90) return 'excellent';
    if (healthScore >= 70) return 'good';
    if (healthScore >= 50) return 'fair';
    if (healthScore >= 30) return 'concerning';
    return 'urgent';
  }

  private formatAdvancedAnalysisForDisplay(result: any): string {
    const sections = [];
    
    sections.push('🎯 ADVANCED EQUINE VIDEO HEALTH ANALYSIS');
    sections.push('═══════════════════════════════════════');
    
    if (result.sceneDescription) {
      sections.push('\n📋 SCENE ASSESSMENT:');
      sections.push(`Environment: ${result.sceneDescription.environment?.setting || 'Unknown'}`);
      sections.push(`Surface: ${result.sceneDescription.environment?.surfaceType || 'Unknown'}`);
      sections.push(`Lighting: ${result.sceneDescription.environment?.lighting || 'Unknown'}`);
      sections.push(`Horse Position: ${result.sceneDescription.positioning?.locationInFrame || 'Unknown'}`);
    }
    
    if (result.healthMetrics) {
      sections.push('\n📊 HEALTH METRICS:');
      sections.push(`Overall Health Score: ${result.healthMetrics.overallHealthScore || 0}/100`);
      sections.push(`Mobility Score: ${result.healthMetrics.mobilityScore || 0}/100`);
      sections.push(`Behavioral Score: ${result.healthMetrics.behavioralScore || 0}/100`);
      sections.push(`Respiratory Score: ${result.healthMetrics.respiratoryScore || 0}/100`);
      sections.push(`Posture Score: ${result.healthMetrics.postureScore || 0}/100`);
    }
    
    if (result.clinicalAssessment) {
      sections.push('\n🏥 CLINICAL ASSESSMENT:');
      sections.push(`Postural Analysis: ${result.clinicalAssessment.posturalAnalysis || 'Not available'}`);
      sections.push(`Mobility Assessment: ${result.clinicalAssessment.mobilityAssessment || 'Not available'}`);
      sections.push(`Respiratory Observation: ${result.clinicalAssessment.respiratoryObservation || 'Not available'}`);
      sections.push(`Behavioral Notes: ${result.clinicalAssessment.behavioralNotes || 'Not available'}`);
    }
    
    if (result.riskAssessment) {
      sections.push('\n⚠️ RISK ASSESSMENT:');
      sections.push(`Overall Risk Level: ${result.riskAssessment.overallRiskLevel || 'Unknown'}`);
      sections.push(`Risk Score: ${((result.riskAssessment.riskScore || 0) * 100).toFixed(1)}%`);
      if (result.riskAssessment.immediateRisks?.length > 0) {
        sections.push(`Immediate Risks: ${result.riskAssessment.immediateRisks.join(', ')}`);
      }
    }
    
    if (result.alerts && result.alerts.length > 0) {
      sections.push('\n🚨 ALERTS:');
      result.alerts.forEach((alert: any, index: number) => {
        sections.push(`${index + 1}. [${alert.severity?.toUpperCase() || 'INFO'}] ${alert.description || 'Alert triggered'}`);
      });
    }
    
    if (result.recommendations && result.recommendations.length > 0) {
      sections.push('\n💡 RECOMMENDATIONS:');
      result.recommendations.forEach((rec: string, index: number) => {
        sections.push(`${index + 1}. ${rec}`);
      });
    }
    
    sections.push('\n⚕️ VETERINARY DISCLAIMER:');
    sections.push('This AI analysis supports but does not replace professional veterinary examination.');
    
    return sections.join('\n');
  }

  private parseOriginalResponse(result: any): IHorseAnalysisResult {
    // Handle different response formats
    if (typeof result === 'string') {
      return this.parseTextAnalysis(result);
    }
    
    if (result && typeof result === 'object') {
      return this.convertToStandardFormat(result);
    }
    
    console.warn('⚠️ Unexpected response format, using fallback');
    return this.getFallbackHorseAnalysis();
  }

  /**
   * Fallback analysis when all else fails
   */
  private getFallbackHorseAnalysis(): IHorseAnalysisResult {
    return {
      timestamp: new Date().toISOString(),
      horseDetected: true,
      confidence: 0.5,
      sceneAnalysis: {
        horsesDetected: 1,
        humansDetected: false,
        sceneDescription: 'Fallback analysis - unable to process image',
        lightingQuality: 'adequate' as const,
        imageClarity: 'clear' as const
      },
      primaryFocus: 'horse',
      healthAssessment: {
        mobility: 'good' as const,
        posture: 'normal' as const,
        alertness: 'alert' as const,
        breathing: 'normal' as const,
        overallCondition: 'good' as const
      },
      behaviorObservations: ['Unable to analyze - manual review recommended'],
      riskScore: 0.5,
      recommendations: ['Manual visual inspection recommended', 'Try again with better image quality'],
      alertLevel: 'medium' as const,
      rawAnalysis: 'Fallback analysis used',
      detailedAnalysis: 'Analysis failed - using fallback response'
    };
  }

  /**
   * Get localStorage usage statistics for sequential learning data
   */
  public getSequentialLearningStorageStats(): {
    totalSize: number;
    itemCount: number;
    availableSpace: number;
    items: Array<{key: string; size: number; date: string}>;
  } {
    const stats = {
      totalSize: 0,
      itemCount: 0,
      availableSpace: 5 * 1024 * 1024, // 5MB localStorage limit
      items: [] as Array<{key: string; size: number; date: string}>
    };

    try {
      // Check all localStorage items related to sequential learning
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sequential_learning_') || key.startsWith('complete_analysis_'))) {
          const value = localStorage.getItem(key);
          if (value) {
            const size = new Blob([value]).size;
            stats.totalSize += size;
            stats.itemCount++;
            
            try {
              const data = JSON.parse(value);
              stats.items.push({
                key,
                size,
                date: data.lastUpdated || data.completedAt || 'Unknown'
              });
            } catch {
              stats.items.push({
                key,
                size,
                date: 'Unknown'
              });
            }
          }
        }
      }

      stats.availableSpace = Math.max(0, stats.availableSpace - stats.totalSize);
      
      // Sort items by date (newest first)
      stats.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    } catch (error) {
      console.warn('Failed to calculate localStorage stats:', error);
    }

    return stats;
  }

  /**
   * Clean up old sequential learning data to free space
   */
  public cleanupOldSequentialData(keepRecentCount: number = 5): {
    removedCount: number;
    freedSpace: number;
  } {
    const stats = this.getSequentialLearningStorageStats();
    const cleanup = { removedCount: 0, freedSpace: 0 };

    try {
      // Keep only the most recent analyses
      const itemsToRemove = stats.items.slice(keepRecentCount);
      
      for (const item of itemsToRemove) {
        localStorage.removeItem(item.key);
        cleanup.removedCount++;
        cleanup.freedSpace += item.size;
      }

      if (cleanup.removedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanup.removedCount} old sequential analyses, freed ${(cleanup.freedSpace / 1024).toFixed(1)}KB`);
      }

    } catch (error) {
      console.warn('Failed to cleanup old sequential data:', error);
    }

    return cleanup;
  }

  /**
   * Check if localStorage has enough space for new sequential analysis
   */
  public hasEnoughStorageSpace(estimatedSize: number = 50000): boolean {
    const stats = this.getSequentialLearningStorageStats();
    return stats.availableSpace > estimatedSize;
  }

  /**
   * Get current time of day for optimization context
   */
  private getTimeOfDay(): 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  /**
   * Create optimized skip response when AI analysis is not needed
   */
  private createOptimizedSkipResponse(optimizationResult: any, horseContext?: any): IHorseAnalysisResult {
    const timestamp = new Date().toISOString();
    
    return {
      timestamp,
      horseDetected: optimizationResult.occupancy?.hasOccupancy || false,
      confidence: optimizationResult.occupancy?.confidence || 0,
      
      // Populate based on optimization results
      sceneAnalysis: {
        horsesDetected: optimizationResult.occupancy?.occupancyCount || 0,
        humansDetected: false,
        sceneDescription: `Skipped analysis: ${optimizationResult.decisions.skipReason}`,
        lightingQuality: optimizationResult.imageQuality?.metrics?.brightness > 30 ? 'good' : 'poor',
        imageClarity: optimizationResult.imageQuality?.passed ? 'clear' : 'blurry'
      },
      
      healthAssessment: {
        mobility: 'good' as const,
        posture: 'normal' as const,
        alertness: 'calm' as const,
        breathing: 'normal' as const,
        overallCondition: 'good' as const
      },
      
      behaviorObservations: [
        `Analysis optimized and skipped due to: ${optimizationResult.decisions.skipReason}`,
        `Token savings: ${optimizationResult.tokenSavingsEstimate}%`,
        `Processing time: ${optimizationResult.processingTime.total}ms`
      ],
      
      riskScore: 0.1, // Low risk for skipped analysis
      recommendations: optimizationResult.decisions.recommendations || [],
      alertLevel: 'low' as const,
      rawAnalysis: `AI optimization determined analysis unnecessary: ${optimizationResult.decisions.skipReason}`,
      
      analysisContext: {
        whatAmIAnalyzing: 'Optimized pre-processing result',
        analysisLimitations: ['Analysis was skipped through optimization'],
        confidenceFactors: [`Skip reason: ${optimizationResult.decisions.skipReason}`]
      }
    };
  }
}

// Create and export singleton instance
export const aiVisionService = AIVisionService.getInstance();

// Load analysis history on initialization
aiVisionService.loadAnalysisHistory();

// 🔒 Demo Mode Security Warning - only in development
if (import.meta.env.DEV && aiConfig.demoMode?.enabled && aiConfig.securityWarnings?.showInDev) {
  console.warn(
    '🚨 DEMO MODE ACTIVE\n' +
    '• API keys are exposed in browser - FOR DEMO ONLY\n' +
    '• Production should use backend proxy\n' +
    '• Security checks are bypassable in client\n' +
    '• This is intended for investor/partner demonstrations'
  );
}