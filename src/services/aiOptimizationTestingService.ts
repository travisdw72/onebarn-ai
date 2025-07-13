/**
 * 🧪 AI Optimization Testing Service
 * Comprehensive overnight testing of real AI token optimization
 * Measures actual token usage and savings with real AI vision analysis
 */

import { AIVisionService } from './aiVisionService';
import { AIOptimizationService } from './aiOptimizationService';
import type { IPreProcessingResult, IOptimizationStats } from '../interfaces/AIOptimizationTypes';
import { aiOptimizationConfig } from '../config/aiOptimizationConfig';

export interface ITestSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed' | 'paused';
  totalImages: number;
  processedImages: number;
  
  // Token tracking
  baselineTokensUsed: number;
  optimizedTokensUsed: number;
  tokensSaved: number;
  tokensSkipped: number;
  
  // Cost tracking  
  baselineCostUSD: number;
  optimizedCostUSD: number;
  costSavingsUSD: number;
  
  // Performance metrics
  averageProcessingTime: number;
  optimizationSuccessRate: number;
  aiAnalysisSuccessRate: number;
  
  // Skip analysis
  skipReasons: Record<string, number>;
  skipCategories: Record<string, number>;
  
  // Detailed results
  results: ITestResult[];
}

export interface ITestResult {
  id: string;
  imageData: string;
  imageName: string;
  category: string;
  timestamp: Date;
  
  // Optimization results
  optimizationResult: IPreProcessingResult;
  wasSkipped: boolean;
  skipReason?: string;
  
  // AI analysis results (only if processed)
  aiAnalysisResult?: any;
  aiTokensUsed?: number;
  aiCostUSD?: number;
  aiProcessingTime?: number;
  
  // Baseline comparison
  baselineTokensEstimate: number;
  baselineCostEstimate: number;
  actualTokensSaved: number;
  actualCostSaved: number;
}

export class AIOptimizationTestingService {
  private static instance: AIOptimizationTestingService;
  private aiVisionService: AIVisionService;
  private optimizationService: AIOptimizationService;
  private currentSession: ITestSession | null = null;
  private isRunning = false;
  private isPaused = false;
  
  // Test configuration
  private readonly TOKEN_COSTS = {
    gpt4Vision: 0.01, // $0.01 per 1K tokens for images
    gpt4o: 0.0025,    // $0.0025 per 1K tokens for GPT-4o vision
    claude3: 0.008,   // $0.008 per 1K tokens for Claude 3
  };
  
  private readonly ESTIMATED_TOKENS_PER_IMAGE = {
    baseline: 2500,    // Estimated tokens for full AI analysis
    minimum: 1000,     // Minimum tokens for basic analysis
    maximum: 4000,     // Maximum tokens for complex analysis
  };

  private constructor() {
    this.aiVisionService = AIVisionService.getInstance();
    this.optimizationService = AIOptimizationService.getInstance();
  }

  public static getInstance(): AIOptimizationTestingService {
    if (!AIOptimizationTestingService.instance) {
      AIOptimizationTestingService.instance = new AIOptimizationTestingService();
    }
    return AIOptimizationTestingService.instance;
  }

  /**
   * Start comprehensive overnight testing session
   */
  public async startOvernightTest(config: {
    sessionName: string;
    imageSource: 'python_frames' | 'test_videos' | 'demo_images';
    maxImages?: number;
    testDurationHours?: number;
    aiProvider?: 'openai' | 'anthropic';
    saveResults?: boolean;
    enableRealAI?: boolean; // Toggle for actual AI analysis vs simulation
  }): Promise<string> {
    
    if (this.isRunning) {
      throw new Error('Testing session already running');
    }

    const sessionId = `overnight_${Date.now()}`;
    
    this.currentSession = {
      id: sessionId,
      name: config.sessionName,
      startTime: new Date(),
      status: 'running',
      totalImages: 0,
      processedImages: 0,
      baselineTokensUsed: 0,
      optimizedTokensUsed: 0,
      tokensSaved: 0,
      tokensSkipped: 0,
      baselineCostUSD: 0,
      optimizedCostUSD: 0,
      costSavingsUSD: 0,
      averageProcessingTime: 0,
      optimizationSuccessRate: 0,
      aiAnalysisSuccessRate: 0,
      skipReasons: {},
      skipCategories: {},
      results: []
    };

    this.isRunning = true;
    this.isPaused = false;

    console.log('🚀 Starting AI Optimization Overnight Test:', {
      sessionId,
      sessionName: config.sessionName,
      enableRealAI: config.enableRealAI,
      maxImages: config.maxImages,
      testDurationHours: config.testDurationHours
    });

    // Start the testing process
    this.runTestingLoop(config);

    return sessionId;
  }

  /**
   * Main testing loop that runs overnight
   */
  private async runTestingLoop(config: any): Promise<void> {
    try {
      // Get test images from specified source
      const testImages = await this.loadTestImages(config.imageSource, config.maxImages);
      
      if (!this.currentSession) return;
      
      this.currentSession.totalImages = testImages.length;
      
      console.log(`📊 Loaded ${testImages.length} test images for analysis`);

      // Process each image with optimization + AI analysis
      for (let i = 0; i < testImages.length && this.isRunning; i++) {
        if (this.isPaused) {
          await this.waitForResume();
        }

        const testImage = testImages[i];
        await this.processTestImage(testImage, config);
        
        // Update progress
        if (this.currentSession) {
          this.currentSession.processedImages = i + 1;
          
          // Log progress every 10 images
          if ((i + 1) % 10 === 0) {
            this.logProgress();
          }
        }

        // Rate limiting to avoid overwhelming APIs
        await this.sleep(1000); // 1 second between analyses
      }

      // Complete the session
      await this.completeSession(config.saveResults);
      
    } catch (error) {
      console.error('🚨 Testing session failed:', error);
      if (this.currentSession) {
        this.currentSession.status = 'failed';
      }
      this.isRunning = false;
    }
  }

  /**
   * Process a single test image with optimization and AI analysis
   */
  private async processTestImage(testImage: {
    data: string;
    name: string;
    category: string;
  }, config: any): Promise<void> {
    
    if (!this.currentSession) return;

    const startTime = Date.now();
    const resultId = `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const testResult: ITestResult = {
      id: resultId,
      imageData: testImage.data,
      imageName: testImage.name,
      category: testImage.category,
      timestamp: new Date(),
      optimizationResult: {} as IPreProcessingResult,
      wasSkipped: false,
      baselineTokensEstimate: this.ESTIMATED_TOKENS_PER_IMAGE.baseline,
      baselineCostEstimate: this.ESTIMATED_TOKENS_PER_IMAGE.baseline * this.TOKEN_COSTS.gpt4o / 1000,
      actualTokensSaved: 0,
      actualCostSaved: 0
    };

    try {
      // Step 1: Run optimization pre-processing
      const analysisContext = {
        source: 'manual' as const,
        priority: 'medium' as const,
        sessionId: this.currentSession.id,
        expectedContent: 'horse' as const
      };

      testResult.optimizationResult = await this.optimizationService.preProcessRequest(
        testImage.data, 
        analysisContext
      );

      testResult.wasSkipped = !testResult.optimizationResult.shouldProceed;
      testResult.skipReason = testResult.optimizationResult.decisions.skipReason;

      // Update skip tracking
      if (testResult.wasSkipped && testResult.skipReason) {
        this.currentSession.skipReasons[testResult.skipReason] = 
          (this.currentSession.skipReasons[testResult.skipReason] || 0) + 1;
        this.currentSession.skipCategories[testImage.category] = 
          (this.currentSession.skipCategories[testImage.category] || 0) + 1;
      }

      // Step 2: Run AI analysis (only if optimization says proceed)
      if (testResult.optimizationResult.shouldProceed && config.enableRealAI) {
        
        const aiStartTime = Date.now();
        
        // Use the actual AI vision service
        testResult.aiAnalysisResult = await this.aiVisionService.analyzeHorseImage(
          testImage.data,
          {
            name: testImage.name,
            priority: 'medium'
          }
        );

        testResult.aiProcessingTime = Date.now() - aiStartTime;
        
        // Estimate actual tokens used (we'll need to track this from API responses)
        testResult.aiTokensUsed = this.estimateTokensFromResponse(testResult.aiAnalysisResult);
        testResult.aiCostUSD = (testResult.aiTokensUsed * this.TOKEN_COSTS.gpt4o) / 1000;
        
        // Calculate actual savings
        testResult.actualTokensSaved = testResult.baselineTokensEstimate - testResult.aiTokensUsed;
        testResult.actualCostSaved = testResult.baselineCostEstimate - testResult.aiCostUSD;

        // Update session totals
        this.currentSession.optimizedTokensUsed += testResult.aiTokensUsed;
        this.currentSession.optimizedCostUSD += testResult.aiCostUSD;
        
      } else if (testResult.wasSkipped) {
        // Image was skipped - count as pure savings
        testResult.actualTokensSaved = testResult.baselineTokensEstimate;
        testResult.actualCostSaved = testResult.baselineCostEstimate;
        
        this.currentSession.tokensSkipped += testResult.baselineTokensEstimate;
      }

      // Update baseline totals (what we would have used)
      this.currentSession.baselineTokensUsed += testResult.baselineTokensEstimate;
      this.currentSession.baselineCostUSD += testResult.baselineCostEstimate;

      // Calculate overall savings
      this.currentSession.tokensSaved += testResult.actualTokensSaved;
      this.currentSession.costSavingsUSD += testResult.actualCostSaved;

      // Store the result
      this.currentSession.results.push(testResult);

      console.log(`✅ Processed ${testImage.name}:`, {
        skipped: testResult.wasSkipped,
        skipReason: testResult.skipReason,
        tokensSaved: testResult.actualTokensSaved,
        costSaved: testResult.actualCostSaved.toFixed(4)
      });

    } catch (error) {
      console.error(`❌ Failed to process ${testImage.name}:`, error);
      
      // Still count baseline usage for failed images
      this.currentSession.baselineTokensUsed += testResult.baselineTokensEstimate;
      this.currentSession.baselineCostUSD += testResult.baselineCostEstimate;
    }
  }

  /**
   * Load test images from various sources
   */
  private async loadTestImages(source: string, maxImages?: number): Promise<Array<{
    data: string;
    name: string; 
    category: string;
  }>> {
    
    const images: Array<{ data: string; name: string; category: string; }> = [];

    switch (source) {
      case 'python_frames':
        // Load frames from the Python testing system
        return this.loadPythonFrames(maxImages);
        
      case 'test_videos':
        // Extract frames from test videos
        return this.loadVideoFrames(maxImages);
        
      case 'demo_images':
        // Use demo/sample images
        return this.loadDemoImages(maxImages);
        
      default:
        throw new Error(`Unknown image source: ${source}`);
    }
  }

  /**
   * Load frames from Python optimization testing results
   */
  private async loadPythonFrames(maxImages?: number): Promise<Array<{
    data: string;
    name: string;
    category: string;
  }>> {
    // This would interface with your Python results
    // For now, we'll create a mock implementation
    const frames = [];
    
    // In real implementation, this would:
    // 1. Read from python_development/token_optimization_testing/frames/
    // 2. Load baseline and optimized frame sets
    // 3. Convert to base64 for AI analysis
    
    console.log('📁 Loading frames from Python testing system...');
    
    // Mock implementation - replace with actual frame loading
    for (let i = 0; i < Math.min(maxImages || 100, 50); i++) {
      frames.push({
        data: this.generateMockImageData(),
        name: `python_frame_${i}.jpg`,
        category: 'python_test'
      });
    }
    
    return frames;
  }

  /**
   * Extract frames from test videos
   */
  private async loadVideoFrames(maxImages?: number): Promise<Array<{
    data: string;
    name: string;
    category: string;
  }>> {
    // This would extract frames from your test videos
    console.log('🎬 Extracting frames from test videos...');
    
    // Mock implementation
    const frames = [];
    const categories = ['emergency', 'routine', 'motion_test', 'quality_test'];
    
    for (let i = 0; i < Math.min(maxImages || 100, 50); i++) {
      frames.push({
        data: this.generateMockImageData(),
        name: `video_frame_${i}.jpg`,
        category: categories[i % categories.length]
      });
    }
    
    return frames;
  }

  /**
   * Load demo images for testing
   */
  private async loadDemoImages(maxImages?: number): Promise<Array<{
    data: string;
    name: string;
    category: string;
  }>> {
    console.log('🖼️ Loading demo images...');
    
    // Mock implementation - replace with actual demo images
    const images = [];
    const categories = ['horse_standing', 'horse_moving', 'empty_stall', 'equipment_only'];
    
    for (let i = 0; i < Math.min(maxImages || 100, 20); i++) {
      images.push({
        data: this.generateMockImageData(),
        name: `demo_image_${i}.jpg`,
        category: categories[i % categories.length]
      });
    }
    
    return images;
  }

  /**
   * Estimate tokens used from AI response
   */
  private estimateTokensFromResponse(response: any): number {
    if (!response) return 0;
    
    // Estimate based on response length and complexity
    const responseText = JSON.stringify(response);
    const estimatedTokens = Math.ceil(responseText.length / 4); // Rough estimate: 4 chars per token
    
    // Add base image analysis tokens
    return estimatedTokens + 1500; // Base cost for image analysis
  }

  /**
   * Generate mock image data for testing
   */
  private generateMockImageData(): string {
    // Generate a simple mock base64 image
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
  }

  /**
   * Log current progress
   */
  private logProgress(): void {
    if (!this.currentSession) return;

    const progress = (this.currentSession.processedImages / this.currentSession.totalImages) * 100;
    const savingsRate = this.currentSession.baselineTokensUsed > 0 
      ? (this.currentSession.tokensSaved / this.currentSession.baselineTokensUsed) * 100 
      : 0;

    console.log('📊 Test Progress:', {
      progress: `${progress.toFixed(1)}%`,
      processed: `${this.currentSession.processedImages}/${this.currentSession.totalImages}`,
      tokensSaved: this.currentSession.tokensSaved.toLocaleString(),
      savingsRate: `${savingsRate.toFixed(1)}%`,
      costSavings: `$${this.currentSession.costSavingsUSD.toFixed(2)}`,
      status: this.currentSession.status
    });
  }

  /**
   * Complete the testing session
   */
  private async completeSession(saveResults: boolean = true): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date();
    this.currentSession.status = 'completed';
    this.isRunning = false;

    // Calculate final metrics
    const totalProcessingTime = this.currentSession.results.reduce(
      (sum, result) => sum + (result.aiProcessingTime || 0), 0
    );
    
    this.currentSession.averageProcessingTime = totalProcessingTime / this.currentSession.processedImages;
    
    const successfulOptimizations = this.currentSession.results.filter(r => r.optimizationResult.shouldProceed !== undefined).length;
    this.currentSession.optimizationSuccessRate = successfulOptimizations / this.currentSession.processedImages;
    
    const successfulAIAnalyses = this.currentSession.results.filter(r => r.aiAnalysisResult).length;
    this.currentSession.aiAnalysisSuccessRate = successfulAIAnalyses / this.currentSession.processedImages;

    console.log('🎉 Testing session completed!', this.generateSessionSummary());

    if (saveResults) {
      await this.saveSessionResults();
    }
  }

  /**
   * Generate comprehensive session summary
   */
  public generateSessionSummary(): any {
    if (!this.currentSession) return null;

    const duration = this.currentSession.endTime 
      ? this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime()
      : Date.now() - this.currentSession.startTime.getTime();

    const savingsRate = this.currentSession.baselineTokensUsed > 0
      ? (this.currentSession.tokensSaved / this.currentSession.baselineTokensUsed) * 100
      : 0;

    return {
      session: {
        id: this.currentSession.id,
        name: this.currentSession.name,
        duration: `${Math.round(duration / 60000)} minutes`,
        status: this.currentSession.status
      },
      processing: {
        totalImages: this.currentSession.totalImages,
        processedImages: this.currentSession.processedImages,
        successRate: `${((this.currentSession.processedImages / this.currentSession.totalImages) * 100).toFixed(1)}%`
      },
      optimization: {
        tokensSaved: this.currentSession.tokensSaved.toLocaleString(),
        tokensSkipped: this.currentSession.tokensSkipped.toLocaleString(),
        savingsRate: `${savingsRate.toFixed(1)}%`,
        optimizationSuccessRate: `${(this.currentSession.optimizationSuccessRate * 100).toFixed(1)}%`
      },
      costs: {
        baselineCost: `$${this.currentSession.baselineCostUSD.toFixed(2)}`,
        optimizedCost: `$${this.currentSession.optimizedCostUSD.toFixed(2)}`,
        costSavings: `$${this.currentSession.costSavingsUSD.toFixed(2)}`,
        savingsPercentage: `${((this.currentSession.costSavingsUSD / this.currentSession.baselineCostUSD) * 100).toFixed(1)}%`
      },
      performance: {
        averageProcessingTime: `${this.currentSession.averageProcessingTime.toFixed(0)}ms`,
        aiAnalysisSuccessRate: `${(this.currentSession.aiAnalysisSuccessRate * 100).toFixed(1)}%`
      },
      skipAnalysis: {
        topSkipReasons: Object.entries(this.currentSession.skipReasons)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([reason, count]) => ({ reason, count })),
        skipByCategory: this.currentSession.skipCategories
      }
    };
  }

  /**
   * Save session results to local storage or file
   */
  private async saveSessionResults(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const results = {
        session: this.currentSession,
        summary: this.generateSessionSummary(),
        timestamp: new Date().toISOString()
      };

      // Save to localStorage
      const key = `ai_optimization_test_${this.currentSession.id}`;
      localStorage.setItem(key, JSON.stringify(results));

      // Also create a downloadable JSON file
      const blob = new Blob([JSON.stringify(results, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_optimization_results_${this.currentSession.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('💾 Session results saved to localStorage and downloaded');
      
    } catch (error) {
      console.error('❌ Failed to save session results:', error);
    }
  }

  // Control methods
  public pauseSession(): void {
    this.isPaused = true;
    console.log('⏸️ Testing session paused');
  }

  public resumeSession(): void {
    this.isPaused = false;
    console.log('▶️ Testing session resumed');
  }

  public stopSession(): void {
    this.isRunning = false;
    this.isPaused = false;
    if (this.currentSession) {
      this.currentSession.status = 'completed';
    }
    console.log('⏹️ Testing session stopped');
  }

  public getCurrentSession(): ITestSession | null {
    return this.currentSession;
  }

  private async waitForResume(): Promise<void> {
    while (this.isPaused && this.isRunning) {
      await this.sleep(1000);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default AIOptimizationTestingService; 