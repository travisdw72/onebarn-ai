// AI Provider Services for Multi-Provider Integration
// Handles communication with OpenAI, Anthropic, and Grok APIs

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { aiConfig, getProviderPriority } from '../config/aiConfig';
import { getPrompt, interpolatePrompt, getPromptsByCategory } from '../config/aiPromptsConfig';
import type { PromptCategory } from '../config/aiPromptsConfig';

// Types for AI responses
export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  confidence: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIAnalysisRequest {
  type: 'health' | 'performance' | 'financial' | 'behavioral';
  data: any;
  context?: string;
  horseId: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

// OpenAI Provider
class OpenAIProvider {
  private client: OpenAI | null = null;

  constructor() {
    if (aiConfig.providers.openai.enabled && aiConfig.providers.openai.apiKey) {
      this.client = new OpenAI({
        apiKey: aiConfig.providers.openai.apiKey,
        baseURL: aiConfig.providers.openai.baseUrl,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    const prompt = this.buildPrompt(request);
    
    try {
      const response = await this.client.chat.completions.create({
        model: aiConfig.providers.openai.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(request.type)
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        max_tokens: aiConfig.providers.openai.maxTokens,
        temperature: aiConfig.providers.openai.temperature,
      });

      const content = response.choices[0]?.message?.content || '';
      
      return {
        content,
        provider: 'openai',
        model: aiConfig.providers.openai.model,
        confidence: this.calculateConfidence(content),
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  private getSystemPrompt(analysisType: string): string {
    // Get appropriate system prompt based on analysis type
    const promptCategory: PromptCategory = this.mapAnalysisTypeToCategory(analysisType);
    const systemPrompt = getPrompt('system', 'horseTrainingSpecialist');
    
    if (systemPrompt) {
      return interpolatePrompt(systemPrompt.template, {
        horseName: 'Current Horse',
        breed: 'Unknown',
        age: 'Unknown',
        discipline: 'General',
        trainingLevel: 'Assessment',
        recentMetrics: 'Under Analysis'
      });
    }
    
    // Fallback system prompt
    return 'You are an expert equine veterinarian and trainer with 20+ years of experience in horse behavior analysis, performance optimization, and health prediction. Provide detailed, actionable insights based on the data provided.';
  }

  private buildPrompt(request: AIAnalysisRequest): string {
    // Get analysis prompt template based on type
    const promptCategory: PromptCategory = this.mapAnalysisTypeToCategory(request.type);
    const analysisPrompts = getPromptsByCategory(promptCategory);
    
    // Use the first available prompt for the category
    if (analysisPrompts.length > 0) {
      const promptConfig = analysisPrompts[0];
      return interpolatePrompt(promptConfig.template, {
        horseName: `Horse ${request.horseId}`,
        age: 'Unknown',
        breed: 'Unknown',
        discipline: 'General',
        vitalSigns: JSON.stringify(request.data?.vitals || {}),
        behaviorData: JSON.stringify(request.data?.behavior || {}),
        performanceData: JSON.stringify(request.data?.performance || {}),
        recentChanges: request.context || 'None specified'
      });
    }
    
    // Fallback prompt
    return `Analyze the following ${request.type} data for horse ID: ${request.horseId}

Data: ${JSON.stringify(request.data)}
Context: ${request.context || 'None provided'}
Priority: ${request.priority || 'medium'}

Please provide a comprehensive analysis with specific recommendations and confidence scores.`;
  }

  private mapAnalysisTypeToCategory(analysisType: string): PromptCategory {
    const mapping: Record<string, PromptCategory> = {
      'health': 'health_analysis',
      'performance': 'performance_analysis', 
      'behavioral': 'behavioral_analysis',
      'financial': 'financial_analysis'
    };
    
    return mapping[analysisType] || 'health_analysis';
  }

  private calculateConfidence(content: string): number {
    // Enhanced confidence calculation
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for detailed responses
    if (content.length > 500) confidence += 0.1;
    if (content.includes('confidence') || content.includes('certain')) confidence += 0.1;
    if (content.includes('recommendation')) confidence += 0.05;
    if (content.includes('analysis')) confidence += 0.05;
    
    // Decrease confidence for uncertain language
    if (content.includes('might') || content.includes('possibly')) confidence -= 0.1;
    if (content.includes('unclear') || content.includes('uncertain')) confidence -= 0.15;
    
    return Math.min(Math.max(confidence, 0.1), 1.0);
  }
}

// Anthropic Provider
class AnthropicProvider {
  private client: Anthropic | null = null;

  constructor() {
    if (aiConfig.providers.anthropic.enabled && aiConfig.providers.anthropic.apiKey) {
      this.client = new Anthropic({
        apiKey: aiConfig.providers.anthropic.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIResponse> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized');
    }

    const prompt = this.buildPrompt(request);
    
    try {
      const response = await this.client.messages.create({
        model: aiConfig.providers.anthropic.model,
        max_tokens: aiConfig.providers.anthropic.maxTokens,
        temperature: aiConfig.providers.anthropic.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      return {
        content,
        provider: 'anthropic',
        model: aiConfig.providers.anthropic.model,
        confidence: this.calculateConfidence(content),
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens,
        }
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw error;
    }
  }

  private buildPrompt(request: AIAnalysisRequest): string {
    // Get system prompt and analysis prompt
    const systemPrompt = getPrompt('system', 'horseTrainingSpecialist');
    const promptCategory: PromptCategory = this.mapAnalysisTypeToCategory(request.type);
    const analysisPrompts = getPromptsByCategory(promptCategory);
    
    let fullPrompt = '';
    
    // Add system context
    if (systemPrompt) {
      fullPrompt += interpolatePrompt(systemPrompt.template, {
        horseName: `Horse ${request.horseId}`,
        breed: 'Unknown',
        age: 'Unknown', 
        discipline: 'General',
        trainingLevel: 'Assessment',
        recentMetrics: 'Under Analysis'
      });
      fullPrompt += '\n\n';
    }
    
    // Add analysis prompt
    if (analysisPrompts.length > 0) {
      const promptConfig = analysisPrompts[0];
      fullPrompt += interpolatePrompt(promptConfig.template, {
        horseName: `Horse ${request.horseId}`,
        age: 'Unknown',
        breed: 'Unknown',
        discipline: 'General',
        vitalSigns: JSON.stringify(request.data?.vitals || {}),
        behaviorData: JSON.stringify(request.data?.behavior || {}),
        performanceData: JSON.stringify(request.data?.performance || {}),
        recentChanges: request.context || 'None specified'
      });
    } else {
      // Fallback
      fullPrompt += `Analyze the following ${request.type} data for horse ID: ${request.horseId}

Data: ${JSON.stringify(request.data)}
Context: ${request.context || 'None provided'}
Priority: ${request.priority || 'medium'}`;
    }
    
    return fullPrompt;
  }

  private mapAnalysisTypeToCategory(analysisType: string): PromptCategory {
    const mapping: Record<string, PromptCategory> = {
      'health': 'health_analysis',
      'performance': 'performance_analysis',
      'behavioral': 'behavioral_analysis', 
      'financial': 'financial_analysis'
    };
    
    return mapping[analysisType] || 'health_analysis';
  }

  private calculateConfidence(content: string): number {
    // Enhanced confidence calculation
    let confidence = 0.8; // Base confidence for Claude
    
    // Increase confidence for detailed responses
    if (content.length > 600) confidence += 0.1;
    if (content.includes('analysis') && content.includes('recommendation')) confidence += 0.05;
    
    // Decrease confidence for uncertain language
    if (content.includes('uncertain') || content.includes('unclear')) confidence -= 0.2;
    
    return Math.min(Math.max(confidence, 0.1), 1.0);
  }
}

// Grok Provider (placeholder for when API becomes available)
class GrokProvider {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = aiConfig.providers.grok.baseUrl;
    this.apiKey = aiConfig.providers.grok.apiKey;
  }

  async analyze(request: AIAnalysisRequest): Promise<AIResponse> {
    if (!aiConfig.providers.grok.enabled) {
      throw new Error('Grok provider is not enabled');
    }

    // Placeholder implementation for Grok API
    // This will be updated when Grok API becomes publicly available
    const mockResponse: AIResponse = {
      content: JSON.stringify({
        insights: ['Grok analysis placeholder - API not yet available'],
        riskScore: 0.5,
        recommendations: [{ action: 'Enable Grok when API is available', priority: 'low', timeline: 'future' }],
        confidence: 0.3,
        outcomes: { positive: 'Enhanced analysis capabilities', negative: 'Limited to other providers' }
      }),
      provider: 'grok',
      model: aiConfig.providers.grok.model,
      confidence: 0.3
    };

    return mockResponse;
  }
}

// Main AI Service with Provider Fallback
export class AIService {
  private providers: Map<string, OpenAIProvider | AnthropicProvider | GrokProvider>;

  constructor() {
    this.providers = new Map();
    
    if (aiConfig.providers.openai.enabled) {
      this.providers.set('openai', new OpenAIProvider());
    }
    
    if (aiConfig.providers.anthropic.enabled) {
      this.providers.set('anthropic', new AnthropicProvider());
    }
    
    if (aiConfig.providers.grok.enabled) {
      this.providers.set('grok', new GrokProvider());
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIResponse> {
    const providerPriority = getProviderPriority();
    
    for (const providerName of providerPriority) {
      const provider = this.providers.get(providerName);
      
      if (!provider) continue;
      
      try {
        const response = await provider.analyze(request);
        console.log(`AI analysis completed using ${providerName}`);
        return response;
      } catch (error) {
        console.warn(`Provider ${providerName} failed, trying next provider:`, error);
        continue;
      }
    }
    
    throw new Error('All AI providers failed to complete the analysis');
  }

  async analyzeMultiple(requests: AIAnalysisRequest[]): Promise<AIResponse[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.analyze(request))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<AIResponse> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  async testProviders(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const [name, provider] of this.providers) {
      try {
        const testRequest: AIAnalysisRequest = {
          type: 'health',
          data: { test: 'connection' },
          horseId: 'test-horse',
          context: 'Connection test'
        };
        
        await provider.analyze(testRequest);
        results[name] = true;
      } catch (error) {
        results[name] = false;
      }
    }
    
    return results;
  }
}

// Singleton instance
export const aiService = new AIService(); 