/**
 * 🧪 Batch Testing Service
 * Automated testing system for horse detection validation
 */

import { HorseDetectionService } from './horseDetectionService';
import { getOptimizedConfig } from '../config/horseDetectionConfig';
import type { 
  IBatchTestResult, 
  IBatchTestSummary, 
  IBatchTestReport,
  IHorseDetectionConfig 
} from '../interfaces/HorseDetectionTypes';

export class BatchTestingService {
  private static instance: BatchTestingService;
  private horseDetectionService: HorseDetectionService;
  private config: IHorseDetectionConfig;
  
  private constructor(config: IHorseDetectionConfig) {
    this.config = config;
    this.horseDetectionService = HorseDetectionService.getInstance(config);
  }
  
  public static getInstance(config: IHorseDetectionConfig): BatchTestingService {
    if (!BatchTestingService.instance) {
      BatchTestingService.instance = new BatchTestingService(config);
    }
    return BatchTestingService.instance;
  }
  
  /**
   * 🎯 Run comprehensive batch testing on user-selected files
   */
  public async runBatchTestWithFiles(
    imageFiles: File[],
    mode: 'balanced' | 'precise' | 'sensitive' | 'night' | 'fast' = 'balanced',
    progressCallback?: (progress: number, filename: string) => void
  ): Promise<IBatchTestReport> {
    
    const testStartTime = new Date().toISOString();
    console.log('🧪 STARTING BATCH TESTING:', { mode, startTime: testStartTime, fileCount: imageFiles.length });
    
    // Update configuration
    this.config = getOptimizedConfig(mode);
    this.horseDetectionService = HorseDetectionService.getInstance(this.config);
    
    const results: IBatchTestResult[] = [];
    const errors: Array<{filename: string, error: string, timestamp: string}> = [];
    
    try {
      // Process each image file
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        try {
          progressCallback?.(Math.round((i / imageFiles.length) * 100), file.name);
          
          const result = await this.processImage(file, mode);
          results.push(result);
          
          console.log(`✅ Processed ${i + 1}/${imageFiles.length}: ${file.name} - ${result.hasHorse ? 'HORSE' : 'NO HORSE'}`);
          
        } catch (error) {
          const errorMsg = String(error);
          errors.push({
            filename: file.name,
            error: errorMsg,
            timestamp: new Date().toISOString()
          });
          console.error(`❌ Error processing ${file.name}:`, error);
        }
      }
      
    } catch (error) {
      console.error('🚨 Batch testing failed:', error);
      errors.push({
        filename: 'BATCH_PROCESS',
        error: String(error),
        timestamp: new Date().toISOString()
      });
    }
    
    const testEndTime = new Date().toISOString();
    const summary = this.generateSummary(results, mode, testStartTime, testEndTime);
    
    const report: IBatchTestReport = {
      summary,
      results,
      errors
    };
    
    console.log('🎯 BATCH TESTING COMPLETED:', summary);
    return report;
  }
  
  /**
   * 🎯 Run comprehensive batch testing on all images in specified directory (legacy)
   */
  public async runBatchTest(
    mode: 'balanced' | 'precise' | 'sensitive' | 'night' | 'fast' = 'balanced',
    progressCallback?: (progress: number, filename: string) => void
  ): Promise<IBatchTestReport> {
    
    const testStartTime = new Date().toISOString();
    console.log('🧪 STARTING BATCH TESTING:', { mode, startTime: testStartTime });
    
    // Update configuration
    this.config = getOptimizedConfig(mode);
    this.horseDetectionService = HorseDetectionService.getInstance(this.config);
    
    const results: IBatchTestResult[] = [];
    const errors: Array<{filename: string, error: string, timestamp: string}> = [];
    
    try {
      // Get all image files from the skipped directory
      const imageFiles = await this.getImageFilesFromDirectory();
      console.log(`📁 Found ${imageFiles.length} images to test`);
      
      // Process each image
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        try {
          progressCallback?.(Math.round((i / imageFiles.length) * 100), file.name);
          
          const result = await this.processImage(file, mode);
          results.push(result);
          
          console.log(`✅ Processed ${i + 1}/${imageFiles.length}: ${file.name} - ${result.hasHorse ? 'HORSE' : 'NO HORSE'}`);
          
        } catch (error) {
          const errorMsg = String(error);
          errors.push({
            filename: file.name,
            error: errorMsg,
            timestamp: new Date().toISOString()
          });
          console.error(`❌ Error processing ${file.name}:`, error);
        }
      }
      
    } catch (error) {
      console.error('🚨 Batch testing failed:', error);
      errors.push({
        filename: 'BATCH_PROCESS',
        error: String(error),
        timestamp: new Date().toISOString()
      });
    }
    
    const testEndTime = new Date().toISOString();
    const summary = this.generateSummary(results, mode, testStartTime, testEndTime);
    
    const report: IBatchTestReport = {
      summary,
      results,
      errors
    };
    
    console.log('🎯 BATCH TESTING COMPLETED:', summary);
    return report;
  }
  
  /**
   * 📁 Get all image files from user selection (browser-compatible)
   */
  public async getImageFilesFromUserSelection(): Promise<File[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      
      input.onchange = (event) => {
        const files = Array.from((event.target as HTMLInputElement).files || []);
        console.log(`📁 User selected ${files.length} image files for batch testing`);
        resolve(files);
      };
      
      input.click();
    });
  }
  
  /**
   * 📁 Alternative: Process pre-loaded files from public directory
   */
  private async getImageFilesFromDirectory(): Promise<File[]> {
    // Since we can't directly access file system in browser,
    // we'll use a predefined list of common skipped image names
    // In production, this would use a file API or be server-side
    
    const commonSkippedImages = [
      'session6_video169_1 mare 3 births ï½œ Arabian horse giving birth compilation_frame0001_t0_00.jpg',
      'session7_video187_Thoroughbred Mare Giving Birth To Foal_frame0023_t330_00_skip-low_quality.jpg',
      'session7_video192_20250701_091611_I Have a Horse - Daily Care & Routine_frame0003_t30_00_skip-low_quality.jpg',
      // Add more common skipped image names here
    ];
    
    const files: File[] = [];
    
    // Create mock File objects for testing
    // In a real implementation, this would read the actual directory
    for (const filename of commonSkippedImages) {
      try {
        // Try to load the image from public directory
        const imagePath = `/images/frames/skipped/${filename}`;
        const response = await fetch(imagePath);
        
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], filename, { type: 'image/jpeg' });
          files.push(file);
        }
      } catch (error) {
        console.warn(`⚠️ Could not load ${filename}:`, error);
      }
    }
    
    return files;
  }
  
  /**
   * 🖼️ Process a single image and capture all debug information
   */
  private async processImage(file: File, mode: string): Promise<IBatchTestResult> {
    const startTime = Date.now();
    
    // Convert file to data URL
    const imageDataUrl = await this.fileToDataUrl(file);
    
    // Capture console logs during processing
    const consoleLogs: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      consoleLogs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
      originalConsoleLog(...args);
    };
    
    try {
      // Get image metadata
      const imageMetadata = await this.getImageMetadata(imageDataUrl);
      
      // Run horse detection
      const detectionResult = await this.horseDetectionService.detectHorse(imageDataUrl);
      
      // Parse console logs for specific debug information
      const debugInfo = this.parseDebugInfo(consoleLogs, mode);
      
      // Create comprehensive result object
      const result: IBatchTestResult = {
        filename: file.name,
        filepath: `/images/frames/skipped/${file.name}`,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        
        // Final Detection Results
        hasHorse: detectionResult.hasHorse,
        finalConfidence: detectionResult.confidence,
        reason: detectionResult.reason,
        recommendSendToAI: detectionResult.recommendSendToAI,
        tokensSavedEstimate: detectionResult.tokensSavedEstimate,
        
        // Extract detailed analysis from detection result
        colorAnalysis: this.extractColorAnalysis(detectionResult.details),
        shapeAnalysis: this.extractShapeAnalysis(detectionResult.details),
        motionAnalysis: this.extractMotionAnalysis(detectionResult.details),
        
        // Extract human detection results from debug info
        humanSkinDetection: debugInfo.humanSkinDetection,
        humanShapeDetection: debugInfo.humanShapeDetection,
        
        // Confidence breakdown
        confidenceBreakdown: {
          colorConfidence: detectionResult.details?.confidenceBreakdown?.colorConfidence || 0,
          shapeConfidence: detectionResult.details?.confidenceBreakdown?.shapeConfidence || 0,
          motionConfidence: detectionResult.details?.confidenceBreakdown?.motionConfidence || 0,
          finalConfidence: detectionResult.confidence,
          weightedCalculation: this.explainWeightedCalculation(detectionResult.details?.confidenceBreakdown)
        },
        
        // Image metadata
        imageMetadata,
        
        // Debug information
        debugInfo: {
          configMode: mode,
          minimumConfidence: this.config.minimumConfidence,
          processingStages: detectionResult.details?.processingStages || [],
          cacheHit: false, // Would be extracted from logs
          earlyExitStage: debugInfo.earlyExitStage,
          errorDetails: debugInfo.errorDetails
        }
      };
      
      return result;
      
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
    }
  }
  
  /**
   * 🔗 Convert File to data URL
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * 📏 Get image metadata
   */
  private getImageMetadata(imageDataUrl: string): Promise<{
    width: number;
    height: number;
    aspectRatio: number;
    fileSize?: number;
    pixelCount: number;
  }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          pixelCount: img.width * img.height
        });
      };
      img.src = imageDataUrl;
    });
  }
  
  /**
   * 🔍 Parse debug information from console logs
   */
  private parseDebugInfo(consoleLogs: string[], mode: string) {
    const debugInfo = {
      humanSkinDetection: { skinPixels: 0, faceIndicators: 0, threshold: 25, shouldReject: false },
      humanShapeDetection: { humanFaceScore: 0, faceFeatures: 0, shouldReject: false },
      earlyExitStage: undefined as string | undefined,
      errorDetails: undefined as string | undefined
    };
    
    for (const log of consoleLogs) {
      // Parse human skin detection
      if (log.includes('🚫 HUMAN SKIN DETECTION:')) {
        try {
          const match = log.match(/skinPixels[": ]+([0-9.]+)/);
          if (match) debugInfo.humanSkinDetection.skinPixels = parseFloat(match[1]);
          
          const thresholdMatch = log.match(/threshold[": ]+([0-9.]+)/);
          if (thresholdMatch) debugInfo.humanSkinDetection.threshold = parseFloat(thresholdMatch[1]);
          
          debugInfo.humanSkinDetection.shouldReject = log.includes('shouldReject[": ]+true') || log.includes('"shouldReject":true');
        } catch (error) {
          console.warn('Failed to parse skin detection log:', error);
        }
      }
      
      // Parse human shape detection
      if (log.includes('🚫 HUMAN SHAPE DETECTION:')) {
        try {
          const match = log.match(/humanFaceScore[": ]+([0-9.]+)/);
          if (match) debugInfo.humanShapeDetection.humanFaceScore = parseFloat(match[1]);
          
          debugInfo.humanShapeDetection.shouldReject = log.includes('shouldReject[": ]+true') || log.includes('"shouldReject":true');
        } catch (error) {
          console.warn('Failed to parse shape detection log:', error);
        }
      }
      
      // Parse early exit stages
      if (log.includes('🚫 FINAL REJECTION:')) {
        if (log.includes('Human face detected')) debugInfo.earlyExitStage = 'human_face_rejection';
        else if (log.includes('Black/empty screen detected')) debugInfo.earlyExitStage = 'black_screen_rejection';
        else if (log.includes('Low information content')) debugInfo.earlyExitStage = 'low_content_rejection';
      }
    }
    
    return debugInfo;
  }
  
  /**
   * Extract color analysis from detection details
   */
  private extractColorAnalysis(details: any) {
    const color = details?.color || {};
    return {
      likely: color.likely || false,
      confidence: color.confidence || 0,
      brownPixels: color.brownPixels || 0,
      blackPixels: color.blackPixels || 0,
      chestnutPixels: color.chestnutPixels || 0,
      whitePixels: color.whitePixels || 0,
      grayPixels: color.grayPixels || 0,
      palominoPixels: color.palominoPixels || 0,
      dunPixels: color.dunPixels || 0,
      grassPixels: color.grassPixels || 0,
      totalHorseColorPixels: color.totalHorseColorPixels || 0,
      rejectionReason: color.rejection_reason
    };
  }
  
  /**
   * Extract shape analysis from detection details
   */
  private extractShapeAnalysis(details: any) {
    const shape = details?.shape || {};
    return {
      likely: shape.likely || false,
      confidence: shape.confidence || 0,
      aspectRatio: shape.aspectRatio || 0,
      shapeScore: shape.shapeScore || 0,
      verticalElements: shape.verticalRectangles || 0,
      curvedElements: shape.curvedEdges || 0,
      edgeDensity: shape.edgeDensity || 0,
      rejectionReason: shape.rejection_reason
    };
  }
  
  /**
   * Extract motion analysis from detection details
   */
  private extractMotionAnalysis(details: any) {
    const motion = details?.motion || {};
    return {
      likely: motion.likely || false,
      confidence: motion.confidence || 0,
      motionScore: motion.motionScore || 0,
      frameType: motion.frameType || 'static_image'
    };
  }
  
  /**
   * Explain weighted calculation
   */
  private explainWeightedCalculation(breakdown: any): string {
    if (!breakdown) return 'No breakdown available';
    
    const weights = this.config.hybridWeights;
    return `(${breakdown.colorConfidence?.toFixed(3)} × ${weights.color}) + (${breakdown.shapeConfidence?.toFixed(3)} × ${weights.shape}) + (${breakdown.motionConfidence?.toFixed(3)} × ${weights.motion}) = ${breakdown.finalConfidence?.toFixed(3)}`;
  }
  
  /**
   * 📊 Generate comprehensive summary
   */
  private generateSummary(
    results: IBatchTestResult[], 
    mode: string, 
    startTime: string, 
    endTime: string
  ): IBatchTestSummary {
    
    const totalImages = results.length;
    const horsesDetected = results.filter(r => r.hasHorse).length;
    const horsesRejected = totalImages - horsesDetected;
    
    const humanFacesRejected = results.filter(r => r.reason.includes('human_face')).length;
    const blackScreensRejected = results.filter(r => r.reason.includes('black_screen')).length;
    const lowContentRejected = results.filter(r => r.reason.includes('low_content')).length;
    
    const totalTokensSaved = results.reduce((sum, r) => sum + r.tokensSavedEstimate, 0);
    const totalCostSavings = totalTokensSaved * 0.00001; // Approximate cost per token
    
    const averageProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / totalImages;
    const averageConfidence = results.reduce((sum, r) => sum + r.finalConfidence, 0) / totalImages;
    
    const testDuration = new Date(endTime).getTime() - new Date(startTime).getTime();
    
    return {
      totalImages,
      horsesDetected,
      horsesRejected,
      humanFacesRejected,
      blackScreensRejected,
      lowContentRejected,
      
      totalTokensSaved,
      totalCostSavings,
      
      averageProcessingTime,
      averageConfidence,
      
      configurationUsed: mode,
      testStartTime: startTime,
      testEndTime: endTime,
      testDuration,
      
      accuracyMetrics: {
        truePositives: 0,  // Would need manual labeling to calculate
        falsePositives: 0,
        trueNegatives: 0,
        falseNegatives: 0,
        precision: 0,
        recall: 0,
        f1Score: 0
      }
    };
  }
  
  /**
   * 💾 Export results to JSON
   */
  public exportResults(report: IBatchTestReport, filename?: string): void {
    const exportFilename = filename || `horse_detection_batch_test_${new Date().toISOString().replace(/:/g, '-')}.json`;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = exportFilename;
    link.click();
    
    console.log(`📥 Test results exported to: ${exportFilename}`);
  }
  
  /**
   * 📊 Export results to CSV (simplified version)
   */
  public exportResultsCSV(report: IBatchTestReport, filename?: string): void {
    const exportFilename = filename || `horse_detection_batch_test_${new Date().toISOString().replace(/:/g, '-')}.csv`;
    
    // CSV headers
    const headers = [
      'Filename', 'HasHorse', 'Confidence', 'Reason', 'ProcessingTime', 
      'TotalHorseColors', 'HumanSkinPixels', 'HumanFaceScore', 'AspectRatio',
      'TokensSaved', 'ColorConfidence', 'ShapeConfidence', 'MotionConfidence'
    ];
    
    // Convert results to CSV rows
    const rows = report.results.map(result => [
      result.filename,
      result.hasHorse,
      result.finalConfidence.toFixed(3),
      result.reason,
      result.processingTime,
      result.colorAnalysis.totalHorseColorPixels.toFixed(1),
      result.humanSkinDetection.skinPixels.toFixed(1),
      result.humanShapeDetection.humanFaceScore.toFixed(1),
      result.imageMetadata.aspectRatio.toFixed(2),
      result.tokensSavedEstimate,
      result.confidenceBreakdown.colorConfidence.toFixed(3),
      result.confidenceBreakdown.shapeConfidence.toFixed(3),
      result.confidenceBreakdown.motionConfidence.toFixed(3)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = exportFilename;
    link.click();
    
    console.log(`📥 Test results exported to CSV: ${exportFilename}`);
  }
} 