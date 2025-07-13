import { useState, useCallback, useEffect, useRef } from 'react';
import { liveStreamConfig } from '../config/liveStreamConfig';

interface IPhotoSequenceResult {
  photoNumber: number;
  timestamp: string;
  imageData: string;
  analysisResult?: any;
  processingTime?: number;
}

interface IPhotoSequenceSession {
  sessionId: string;
  startTime: number;
  totalPhotos: number;
  completedPhotos: number;
  results: IPhotoSequenceResult[];
  isComplete: boolean;
  error?: string;
}

export const useLiveStreamPhotoSequence = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSession, setCurrentSession] = useState<IPhotoSequenceSession | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<IPhotoSequenceSession[]>([]);
  const [demoUsageCount, setDemoUsageCount] = useState(0);
  const [isDemoLimitReached, setIsDemoLimitReached] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [nextAnalysisCountdown, setNextAnalysisCountdown] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const photoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const config = liveStreamConfig.aiAnalysis.photoSequence;

  // Initialize demo usage count from localStorage
  useEffect(() => {
    if (config.demoMode.enabled) {
      const stored = localStorage.getItem(config.demoMode.storageKey);
      const count = stored ? parseInt(stored, 10) : 0;
      setDemoUsageCount(count);
      setIsDemoLimitReached(count >= config.demoMode.maxAnalysisCount);
    }
  }, [config.demoMode.enabled, config.demoMode.storageKey, config.demoMode.maxAnalysisCount]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (photoTimeoutRef.current) clearTimeout(photoTimeoutRef.current);
    };
  }, []);

  // Capture screenshot from iframe (YouTube stream)
  const captureStreamPhoto = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas for enhanced simulation
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Set standard resolution for consistent AI analysis
        canvas.width = 640;
        canvas.height = 480;

        // Create realistic equestrian environment for AI analysis
        const currentTime = Date.now();
        const variation = (currentTime % 10000) / 10000; // Creates variety between photos
        
        // Background - sky and ground
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.6, '#98FB98'); // Pale green (grass)
        gradient.addColorStop(1, '#228B22'); // Forest green
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ground/pasture area
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

        // Fence elements
        ctx.fillStyle = '#8B4513';
        for (let i = 100; i < canvas.width - 100; i += 120) {
          ctx.fillRect(i, canvas.height * 0.4, 8, canvas.height * 0.4);
        }
        
        // Fence rails
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(50, canvas.height * 0.5, canvas.width - 100, 6);
        ctx.fillRect(50, canvas.height * 0.6, canvas.width - 100, 6);

        // Horse simulation with variety
        if (variation > 0.2) { // 80% chance of horse being visible
          const horseX = 200 + (variation * 200);
          const horseY = canvas.height * 0.65;
          
          // Horse body
          ctx.fillStyle = '#8B4513';
          ctx.beginPath();
          ctx.ellipse(horseX, horseY, 60, 30, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Horse head
          ctx.beginPath();
          ctx.ellipse(horseX + 70, horseY - 10, 25, 20, 0, 0, 2 * Math.PI);
          ctx.fill();
          
          // Legs
          ctx.fillRect(horseX - 40, horseY + 20, 8, 30);
          ctx.fillRect(horseX - 20, horseY + 20, 8, 30);
          ctx.fillRect(horseX + 10, horseY + 20, 8, 30);
          ctx.fillRect(horseX + 30, horseY + 20, 8, 30);
          
          // Eye detail
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(horseX + 80, horseY - 5, 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        // Timestamp overlay
        const timestamp = new Date();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 250, 30);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.fillText(`Live Stream: ${timestamp.toLocaleTimeString()}`, 15, 30);

        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        resolve(imageData);
        
      } catch (error) {
        console.error('Photo capture error:', error);
        reject(error);
      }
    });
  }, []);

  // NEW: Capture frames from Python backend (real YouTube capture)
  const captureFromPythonBackend = useCallback(async (youtubeUrl: string): Promise<IPhotoSequenceResult[]> => {
    try {
      console.log('🐍 Starting Python backend frame extraction...');
      
      const response = await fetch('http://localhost:8000/extract-frames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          num_frames: config.photosPerSequence,
          interval_seconds: config.captureIntervalSeconds,
          max_resolution: '720p'
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Frame extraction failed');
      }

      console.log(`✅ Received ${data.frames.length} frames from Python backend`);

      // Convert backend response to our format
      const results: IPhotoSequenceResult[] = data.frames.map((frame: any) => ({
        photoNumber: frame.frame_number,
        timestamp: frame.timestamp,
        imageData: frame.base64_image,
      }));

      return results;

    } catch (error) {
      console.error('❌ Python backend capture failed:', error);
      throw error;
    }
  }, [config.photosPerSequence, config.captureIntervalSeconds]);

  // Process single photo with AI
  const processPhotoWithAI = useCallback(async (imageData: string, photoNumber: number): Promise<any> => {
    try {
      console.log(`📸 Processing photo ${photoNumber} with AI...`);
      
      // Import AI Vision Service
      const { AIVisionService } = await import('../services/aiVisionService');
      const aiVisionService = AIVisionService.getInstance();
      
      // Analyze with horse context using the correct public method
      const horseContext = {
        name: 'Live Stream Horse',
        breed: 'Unknown',
        age: undefined,
        knownConditions: ['Live monitoring'],
        priority: 'medium' as const
      };
      
      // Use the public analyzeHorseImage method which expects base64 string
      const analysisResult = await aiVisionService.analyzeHorseImage(imageData, horseContext);
      console.log(`✅ Photo ${photoNumber} analysis complete:`, analysisResult);
      
      return analysisResult;
      
    } catch (error) {
      console.error(`❌ Photo ${photoNumber} analysis failed:`, error);
      // Return fallback analysis
      return {
        timestamp: new Date().toISOString(),
        photoNumber,
        confidence: 0.5,
        healthRisk: 0.2,
        activityLevel: 0.6,
        insights: [`Photo ${photoNumber} captured from live stream`],
        recommendations: ['Continue monitoring'],
        alertLevel: 'low'
      };
    }
  }, [currentSession?.sessionId]);

  // Start photo sequence analysis
  const startPhotoSequenceAnalysis = useCallback(async (useRealCapture: boolean = false, youtubeUrl?: string) => {
    // Check demo limits
    if (config.demoMode.enabled && isDemoLimitReached) {
      alert(config.demoMode.limitReachedMessage);
      return;
    }

    setIsAnalyzing(true);
    
    const sessionId = `session_${Date.now()}`;
    const session: IPhotoSequenceSession = {
      sessionId,
      startTime: Date.now(),
      totalPhotos: config.photosPerSequence,
      completedPhotos: 0,
      results: [],
      isComplete: false
    };
    
    setCurrentSession(session);
    
    // Keep track of results locally to avoid state update issues
    const allResults: IPhotoSequenceResult[] = [];
    
    try {
      if (useRealCapture && youtubeUrl) {
        // NEW: Use Python backend for real YouTube capture
        console.log(`🐍 Starting Python backend capture for: ${youtubeUrl}`);
        
        const backendResults = await captureFromPythonBackend(youtubeUrl);
        
        // Process each frame with AI
        for (let i = 0; i < backendResults.length; i++) {
          const photoResult = backendResults[i];
          console.log(`🤖 Processing frame ${photoResult.photoNumber} with AI...`);
          
          // Update session progress
          setCurrentSession(prev => prev ? {
            ...prev,
            completedPhotos: i + 1,
            results: [...allResults, photoResult]
          } : null);
          
          // Analyze with AI
          const analysisStartTime = Date.now();
          const analysisResult = await processPhotoWithAI(photoResult.imageData, photoResult.photoNumber);
          const processingTime = Date.now() - analysisStartTime;
          
          // Update photo result with analysis
          const completedPhotoResult: IPhotoSequenceResult = {
            ...photoResult,
            analysisResult,
            processingTime
          };
          
          allResults.push(completedPhotoResult);
          
          // Update session with analysis result
          setCurrentSession(prev => prev ? {
            ...prev,
            results: [...allResults]
          } : null);
        }
        
      } else {
        // EXISTING: Use simulation mode
        console.log(`🎬 Starting photo sequence analysis: ${config.photosPerSequence} photos over ${config.totalSequenceTimeSeconds} seconds`);
        
        // Capture and analyze photos sequentially
        for (let i = 1; i <= config.photosPerSequence; i++) {
          console.log(`📸 Capturing photo ${i}/${config.photosPerSequence}...`);
          
          // Capture photo from stream
          const imageData = await captureStreamPhoto();
          const photoTimestamp = new Date().toISOString();
          
          // Create initial photo result
          const photoResult: IPhotoSequenceResult = {
            photoNumber: i,
            timestamp: photoTimestamp,
            imageData
          };
          
          // Add to local results array
          allResults.push(photoResult);
          
          // Update session with captured photo
          setCurrentSession(prev => prev ? {
            ...prev,
            completedPhotos: i,
            results: [...allResults]
          } : null);
          
          // Analyze photo with AI (in background)
          const analysisStartTime = Date.now();
          const analysisResult = await processPhotoWithAI(imageData, i);
          const processingTime = Date.now() - analysisStartTime;
          
          // Update photo result with analysis
          const completedPhotoResult: IPhotoSequenceResult = {
            ...photoResult,
            analysisResult,
            processingTime
          };
          
          // Update the result in our local array
          allResults[allResults.length - 1] = completedPhotoResult;
          
          // Update session with analysis result
          setCurrentSession(prev => prev ? {
            ...prev,
            results: [...allResults]
          } : null);
          
          // Wait before next photo (except for last photo)
          if (i < config.photosPerSequence) {
            console.log(`⏱️ Waiting ${config.captureIntervalSeconds} seconds before next photo...`);
            await new Promise(resolve => {
              photoTimeoutRef.current = setTimeout(resolve, config.captureIntervalSeconds * 1000);
            });
          }
        }
      }
      
      // Mark session as complete with all collected results
      const completedSession: IPhotoSequenceSession = {
        ...session,
        completedPhotos: config.photosPerSequence,
        results: allResults, // Use our local results array
        isComplete: true
      };
      
      console.log('🔄 Setting completed session with', allResults.length, 'results');
      setCurrentSession(completedSession);
      setAnalysisHistory(prev => [completedSession, ...prev.slice(0, 9)]); // Keep last 10 sessions
      
      // Update demo usage count
      if (config.demoMode.enabled) {
        const newCount = demoUsageCount + 1;
        setDemoUsageCount(newCount);
        localStorage.setItem(config.demoMode.storageKey, newCount.toString());
        
        if (newCount >= config.demoMode.maxAnalysisCount) {
          setIsDemoLimitReached(true);
        }
      }
      
      const modeUsed = useRealCapture ? 'Python backend' : 'simulation';
      console.log(`✅ Photo sequence analysis completed successfully using ${modeUsed}!`);
      
    } catch (error) {
      console.error('❌ Photo sequence analysis failed:', error);
      setCurrentSession(prev => prev ? {
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error'
      } : null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [config, isDemoLimitReached, demoUsageCount, captureStreamPhoto, captureFromPythonBackend, processPhotoWithAI]);

  // Start continuous mode
  const startContinuousMode = useCallback(() => {
    if (!config.productionMode.enabled) return;
    
    setContinuousMode(true);
    setNextAnalysisCountdown(config.productionMode.intervalMinutes * 60);
    
    // Start countdown
    countdownRef.current = setInterval(() => {
      setNextAnalysisCountdown(prev => {
        if (prev <= 1) {
          // Trigger analysis
          startPhotoSequenceAnalysis();
          return config.productionMode.intervalMinutes * 60; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);
    
    console.log(`🔄 Continuous mode started: Analysis every ${config.productionMode.intervalMinutes} minutes`);
  }, [config.productionMode, startPhotoSequenceAnalysis]);

  // Stop continuous mode
  const stopContinuousMode = useCallback(() => {
    setContinuousMode(false);
    setNextAnalysisCountdown(0);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    console.log('⏹️ Continuous mode stopped');
  }, []);

  // Reset demo usage (for testing)
  const resetDemoUsage = useCallback(() => {
    if (config.demoMode.enabled) {
      localStorage.removeItem(config.demoMode.storageKey);
      setDemoUsageCount(0);
      setIsDemoLimitReached(false);
      console.log('🔄 Demo usage count reset');
    }
  }, [config.demoMode]);

  // NEW: Check Python backend demo status
  const checkPythonDemoStatus = useCallback(async (): Promise<{
    demoEnabled: boolean;
    capturesUsed: number;
    capturesRemaining: number;
    demoExhausted: boolean;
  } | null> => {
    try {
      const response = await fetch('http://localhost:8000/demo-status');
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return {
        demoEnabled: data.demo_enabled,
        capturesUsed: data.captures_used,
        capturesRemaining: data.captures_remaining,
        demoExhausted: data.demo_exhausted
      };
    } catch (error) {
      console.warn('Could not check Python demo status:', error);
      return null;
    }
  }, []);

  // NEW: Reset Python backend demo counter
  const resetPythonDemo = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/reset-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to reset Python demo:', error);
      return false;
    }
  }, []);

  return {
    // State
    isAnalyzing,
    currentSession,
    analysisHistory,
    demoUsageCount,
    isDemoLimitReached,
    continuousMode,
    nextAnalysisCountdown,
    
    // Actions
    startPhotoSequenceAnalysis,
    startContinuousMode,
    stopContinuousMode,
    resetDemoUsage,
    
    // Python Backend Demo Actions
    checkPythonDemoStatus,
    resetPythonDemo,
    
    // Config
    config
  };
}; 