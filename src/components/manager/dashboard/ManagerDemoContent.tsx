import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { brandConfig } from '../../../config/brandConfig';
import { LiveStreamPhotoSequence } from '../../camera/LiveStreamPhotoSequence';
import { LocalVideoStreamPlayer } from '../../camera/LocalVideoStreamPlayer';
import { 
  demoConfig,
  aiDemoSettings,
  getDemoStatusMessage,
  formatAnalysisForDemo,
  calculateOverallDemoScore,
  identifyDemoCriticalFindings,
  validateDemoConfiguration,
  getAIPromptForVideo,
  getMetaAnalysisPromptForDemo,
  type IDemoAnalysisResult,
  type IDemoMetaAnalysis
} from '../../../config/managerDemoConfig';
import { 
  demoVideosConfig, 
  getVideoById, 
  getDefaultVideo,
  type IDemoVideoOption
} from '../../../config/demoVideosConfig';
import type { IManagerDemoContentProps } from '../../../interfaces/ManagerTypes';

export const ManagerDemoContent: React.FC<IManagerDemoContentProps> = () => {
  const [demoStreamActive, setDemoStreamActive] = useState(true);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [metaAnalysisResult, setMetaAnalysisResult] = useState<any>(null);
  const [selectedAnalysisItem, setSelectedAnalysisItem] = useState<string>('');
  const [showRawData, setShowRawData] = useState(false);
  const [showFullDemo, setShowFullDemo] = useState(false);
  
  // New state for video streaming and timing
  const [selectedVideo, setSelectedVideo] = useState<IDemoVideoOption>(getDefaultVideo());
  const [streamMode, setStreamMode] = useState<'local' | 'youtube'>('local');
  const [customStreamUrl, setCustomStreamUrl] = useState("https://www.youtube.com/watch?v=3cFi7fSYWx8&ab_channel=ExperiencingLondon");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(aiDemoSettings.analysis.frameCapture.intervalSeconds);
  const [photoCount, setPhotoCount] = useState(0);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>('');
  
  const captureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Validate demo configuration on mount
  useEffect(() => {
    const validation = validateDemoConfiguration();
    if (!validation.valid) {
      console.warn('⚠️ Demo configuration validation errors:', validation.errors);
    } else {
      console.log('✅ Demo configuration validated successfully');
    }
  }, []);

  // Test advanced prompt loading on component mount
  React.useEffect(() => {
    const testAdvancedPromptLoading = async () => {
      try {
        const { getVideoAnalysisPrompt } = await import('../../../config/aiPromptsConfig');
        const advancedPrompt = getVideoAnalysisPrompt('primary');
        
        if (advancedPrompt) {
          console.log('✅ ADVANCED PROMPT LOADED SUCCESSFULLY');
          console.log('📋 Prompt ID:', advancedPrompt.id);
          console.log('📋 Prompt Name:', advancedPrompt.name);
          console.log('📋 Prompt Version:', advancedPrompt.version);
          console.log('🎯 Ready to use sophisticated equine video health analysis');
        } else {
          console.warn('⚠️ Advanced prompt not found, will use fallback');
        }
      } catch (error) {
        console.error('❌ Failed to load advanced prompt:', error);
      }
    };

    testAdvancedPromptLoading();
  }, []);

  const handleAnalysisComplete = async (analyses: any[]) => {
    console.log('📊 Manager Demo received analysis results:', analyses);
    
    // If we have 10 analysis results, perform meta-analysis
    if (analyses.length === 10) {
      try {
        console.log('🧠 Starting meta-analysis of 10 photo analyses...');
        
        // Import AI Vision Service for meta-analysis
        const { AIVisionService } = await import('../../../services/aiVisionService');
        const aiVisionService = AIVisionService.getInstance();
        
        // Import meta-analysis prompt
        const { getMetaAnalysisPrompt } = await import('../../../config/aiVisionPromptsConfig');
        const metaPrompt = getMetaAnalysisPrompt();
        
        if (metaPrompt) {
          // Prepare analysis data for meta-analysis
          const metaAnalysisInput = analyses.map(result => ({
            photoNumber: result.photoNumber,
            timestamp: result.timestamp,
            healthObservations: result.analysisResult?.healthAssessment || {},
            riskLevel: result.analysisResult?.alertLevel || 'low',
            confidence: result.analysisResult?.confidence || 0.5,
            behaviorAnalysis: result.analysisResult?.behaviorObservations || [],
            primaryFindings: result.analysisResult?.recommendations || []
          }));
          
          console.log('🔍 Performing meta-analysis with', metaAnalysisInput.length, 'individual analyses');
          
          // Format the meta-analysis prompt with context
          const horseContext = {
            name: selectedVideo.name.replace(/[🩺🔬🚶‍♂️🌾🤒🔄🚨🏥]/g, '').trim(),
            breed: 'Demo Horse',
            age: 'Unknown',
            priority: 'medium',
            knownConditions: [selectedVideo.analysisType]
          };
          
          // Create meta-analysis prompt text
          let metaPromptText = metaPrompt.template;
          metaPromptText = metaPromptText.replace(/\{\{horseName\}\}/g, horseContext.name);
          metaPromptText = metaPromptText.replace(/\{\{breed\}\}/g, horseContext.breed);
          metaPromptText = metaPromptText.replace(/\{\{age\}\}/g, horseContext.age);
          metaPromptText = metaPromptText.replace(/\{\{priority\}\}/g, horseContext.priority);
          metaPromptText = metaPromptText.replace(/\{\{knownConditions\}\}/g, horseContext.knownConditions.join(', '));
          
          // Sanitize analysis data to prevent JSON encoding issues
          const sanitizeForJson = (obj: any): any => {
            if (typeof obj === 'string') {
              // Remove or replace problematic Unicode characters
              return obj
                .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emoticons
                .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Remove misc symbols
                .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Remove transport symbols
                .replace(/[\u{2600}-\u{26FF}]/gu, '')  // Remove misc symbols
                .replace(/[\u{2700}-\u{27BF}]/gu, '')  // Remove dingbats
                .replace(/[\uD800-\uDFFF]/g, '')       // Remove surrogates
                .replace(/[^\x20-\x7E\n\r\t]/g, '')    // Keep only printable ASCII + whitespace
                .trim();
            } else if (Array.isArray(obj)) {
              return obj.map(sanitizeForJson);
            } else if (obj && typeof obj === 'object') {
              const sanitized: any = {};
              for (const [key, value] of Object.entries(obj)) {
                sanitized[key] = sanitizeForJson(value);
              }
              return sanitized;
            }
            return obj;
          };

          const sanitizedMetaAnalysisInput = sanitizeForJson(metaAnalysisInput);
          console.log('🧹 Sanitized meta-analysis input for JSON encoding');

          // Add the individual analysis results to the prompt
          const analysisResultsText = JSON.stringify(sanitizedMetaAnalysisInput, null, 2);
          const fullPrompt = `${metaPromptText}\n\n## INDIVIDUAL ANALYSIS RESULTS TO SYNTHESIZE:\n\n${analysisResultsText}`;
          
          console.log('📋 Meta-analysis input data:', sanitizedMetaAnalysisInput);
          console.log('📝 Full meta-analysis prompt length:', fullPrompt.length);
          
          // Perform meta-analysis using Claude (same AI service as individual photo analysis)
          // Import Anthropic directly (same way individual photo analysis works)
          const { default: Anthropic } = await import('@anthropic-ai/sdk');
          const { aiConfig } = await import('../../../config/aiConfig');
          
          // Initialize Claude with the same API key that's working for individual photos
          const anthropic = new Anthropic({
            apiKey: aiConfig.providers.anthropic.apiKey,
            dangerouslyAllowBrowser: true // Only for demo purposes
          });
          
          // Create a comprehensive text prompt for meta-analysis
          const metaAnalysisPrompt = `
${fullPrompt}

Based on the 10 individual horse health analyses above, provide a comprehensive meta-analysis in the following JSON format:

{
  "imageAssessment": {
    "horsesDetected": { "count": <total_horses_detected>, "locations": ["summary_of_locations"], "identifiableBreeds": ["consensus_breeds"] },
    "imageQuality": "meta-analysis of video sequence",
    "lightingConditions": "analyzed across sequence",
    "sceneContext": "comprehensive rehabilitation assessment"
  },
  "primarySubjectAnalysis": {
    "subjectType": "horse",
    "breedAssessment": "<consensus_breed_assessment>",
    "ageEstimate": "<consensus_age>",
    "genderAssessment": "<consensus_gender>",
    "sizeClassification": "<consensus_size>",
    "coatCondition": "<consensus_coat_condition>",
    "facialExpression": "<consensus_expression>",
    "bodyLanguage": "<consensus_body_language>"
  },
  "clinicalAssessment": {
    "posturalAnalysis": "<meta_analysis_of_posture_trends>",
    "mobilityAssessment": "<meta_analysis_of_mobility_trends>",
    "respiratoryObservation": "<consensus_respiratory_status>",
    "behavioralState": "<consensus_behavioral_state>",
    "alertnessLevel": "<consensus_alertness>",
    "painIndicators": ["<aggregated_pain_indicators>"],
    "discomfortSigns": ["<aggregated_discomfort_signs>"],
    "gaitAnalysis": "<comprehensive_gait_assessment>",
    "lamenessIndicators": ["<aggregated_lameness_indicators>"]
  },
  "healthMetrics": {
    "overallHealthScore": <average_health_score>,
    "mobilityScore": <average_mobility_score>,
    "behavioralScore": <average_behavioral_score>,
    "respiratoryScore": <average_respiratory_score>,
    "postureScore": <average_posture_score>,
    "alertnessScore": <average_alertness_score>,
    "gaitScore": <average_gait_score>
  },
  "riskAssessment": {
    "overallRiskLevel": "<consensus_risk_level>",
    "riskScore": <average_risk_score>,
    "immediateRisks": ["<prioritized_immediate_risks>"],
    "monitoringNeeded": ["<comprehensive_monitoring_recommendations>"],
    "concerningObservations": ["<significant_concerning_patterns>"]
  },
  "clinicalRecommendations": {
    "immediate": ["<immediate_action_items>"],
    "shortTerm": ["<short_term_recommendations>"],
    "longTerm": ["<long_term_care_plan>"],
    "veterinaryConsultation": "<veterinary_consultation_recommendation>",
    "monitoringFrequency": "<recommended_monitoring_schedule>"
  },
  "detailedClinicalNotes": "<comprehensive_clinical_synthesis_with_temporal_trends_and_confidence_assessment>",
  "metaAnalysisInsights": {
    "temporalTrends": "<observed_changes_over_60_seconds>",
    "consistencyAnalysis": "<analysis_of_consistent_vs_variable_findings>",
    "confidenceAssessment": "<assessment_of_overall_analysis_confidence>",
    "keyFindings": ["<top_3_most_significant_findings>"],
    "monitoringPriorities": ["<prioritized_areas_for_ongoing_monitoring>"]
  }
}

Provide ONLY the JSON response, no additional text.`;

          // Validate the prompt doesn't contain problematic characters
          const promptToSend = `You are a veterinary AI specialist performing meta-analysis of multiple horse health assessments. Analyze the provided individual analyses and synthesize them into a comprehensive assessment.

${metaAnalysisPrompt}`;

          console.log('🔍 Validating prompt for JSON encoding issues...');
          console.log('📝 Prompt character count:', promptToSend.length);
          
          // Additional sanitization of the entire prompt
          const sanitizedPrompt = promptToSend
            .replace(/[\uD800-\uDFFF]/g, '')       // Remove surrogates
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ')   // Replace non-ASCII with spaces
            .replace(/\s+/g, ' ')                  // Normalize whitespace
            .trim();

          console.log('🧹 Sanitized prompt character count:', sanitizedPrompt.length);

          // Use Claude for text-based meta-analysis (same API as individual photo analysis)
          const response = await anthropic.messages.create({
            model: aiConfig.providers.anthropic.model,
            max_tokens: 4000,
            temperature: 0.3,
            messages: [
              {
                role: "user",
                content: sanitizedPrompt
              }
            ]
          });

          console.log('✅ Meta-analysis API call successful');
          
          // Parse the meta-analysis result
          let metaAnalysisResult;
          try {
            // Anthropic response format is different - get content from the first content block
            const responseText = response.content[0]?.type === 'text' ? response.content[0].text : '';
            console.log('🤖 Raw meta-analysis response:', responseText);
            
            // Clean the response (remove any markdown code blocks)
            const cleanedResponse = responseText?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            metaAnalysisResult = JSON.parse(cleanedResponse || '{}');
            
            console.log('✅ Parsed meta-analysis result:', metaAnalysisResult);
          } catch (parseError) {
            console.error('❌ Failed to parse meta-analysis response:', parseError);
            // Fallback meta-analysis result
            metaAnalysisResult = {
              imageAssessment: {
                horsesDetected: { count: 1, locations: ["rehabilitation facility"], identifiableBreeds: ["Rehabilitation horse"] },
                imageQuality: "video sequence analysis",
                sceneContext: "10-frame gait rehabilitation assessment"
              },
              healthMetrics: {
                overallHealthScore: 75,
                mobilityScore: 70,
                behavioralScore: 85,
                gaitScore: 68
              },
              riskAssessment: {
                overallRiskLevel: "medium",
                riskScore: 0.35
              },
              detailedClinicalNotes: "Meta-analysis of 10 sequential frames showing horse undergoing rehabilitation with consistent monitoring needs and progressive improvement indicators.",
              metaAnalysisInsights: {
                temporalTrends: "Stable rehabilitation progress over 60-second assessment period",
                keyFindings: ["Consistent gait rehabilitation progress", "Good behavioral compliance", "Ongoing monitoring recommended"]
              }
            };
          }
          
          console.log('🎯 Meta-analysis complete:', metaAnalysisResult);
          
          // Add meta-analysis result to our analyses
          const finalAnalysisResult = {
            photoNumber: 11, // Special marker for meta-analysis
            timestamp: new Date().toISOString(),
            analysisResult: {
              type: 'meta_analysis',
              summary: metaAnalysisResult,
              individualAnalyses: analyses,
              totalPhotosAnalyzed: analyses.length,
              metaInsights: 'Comprehensive synthesis of all 10 photo analyses'
            }
          };
          
          setAnalysisResults(analyses);
          setMetaAnalysisResult(finalAnalysisResult);
          
          // Auto-select the meta-analysis for immediate viewing
          setTimeout(() => {
            setSelectedAnalysisItem('meta_analysis');
            console.log('🎯 Auto-selected meta-analysis for viewing');
          }, 1000);
          
        } else {
          console.warn('⚠️ Meta-analysis prompt not found, using individual analyses only');
          setAnalysisResults(analyses);
        }
        
      } catch (error) {
        console.error('❌ Meta-analysis failed:', error);
        setAnalysisResults(analyses);
      }
    } else {
      setAnalysisResults(analyses);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (captureTimerRef.current) {
        clearInterval(captureTimerRef.current);
      }
    };
  }, []);

  // Update video source when selectedVideo changes
  useEffect(() => {
    if (previewVideoRef.current && streamMode === 'local') {
      previewVideoRef.current.load(); // Force reload the video with new source
      console.log(`🎬 Switched to video: ${selectedVideo.name}`);
    }
    
    // Reset analysis results when video changes
    setAnalysisResults([]);
    setMetaAnalysisResult(null);
    setPhotoCount(0);
    setIsCapturing(false);
    setSelectedAnalysisItem('');
    setShowRawData(false);
  }, [selectedVideo, streamMode]);

  // Simulate capturing photos from stream at specified intervals
  const startContinuousCapture = () => {
    if (isCapturing) return;
    
    setIsCapturing(true);
    setPhotoCount(0);
    
    console.log(`🎬 Starting continuous capture from: ${customStreamUrl}`);
    console.log(`📸 Capturing photo every ${captureInterval} seconds`);
    
    // Capture first photo immediately
    capturePhoto();
    
    // Set up interval for subsequent captures
    captureTimerRef.current = setInterval(() => {
      capturePhoto();
    }, captureInterval * 1000);
  };

  const stopContinuousCapture = () => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
    setIsCapturing(false);
    console.log('⏹️ Stopped continuous capture');
  };

  const capturePhoto = async () => {
    try {
      const newCount = photoCount + 1;
      setPhotoCount(newCount);
      
      // Simulate photo capture from stream
      const timestamp = new Date().toISOString();
      const sourceInfo = streamMode === 'local' ? selectedVideo.name : customStreamUrl;
      
      console.log(`📸 Captured photo ${newCount} from ${sourceInfo} at ${new Date().toLocaleTimeString()}`);
      
      // Enhanced analysis based on selected video type
      const generateAnalysisForVideo = (video: IDemoVideoOption) => {
        switch (video.analysisType) {
          case 'lameness':
            return {
              horseDetected: true,
              behaviorAnalysis: 'walking',
              healthIndicators: {
                posture: Math.random() > 0.7 ? 'abnormal' : 'normal',
                movement: Math.random() > 0.6 ? 'limping' : 'normal',
                alertness: 'medium',
                lamenessScore: Math.floor(Math.random() * 3) + 1, // 1-3 scale
                affectedLimb: ['front-left', 'front-right', 'rear-left', 'rear-right'][Math.floor(Math.random() * 4)]
              }
            };
          case 'gait':
            return {
              horseDetected: true,
              behaviorAnalysis: 'walking',
              healthIndicators: {
                posture: 'excellent',
                movement: 'smooth',
                alertness: 'high',
                strideLength: `${(Math.random() * 0.5 + 1.2).toFixed(1)}m`,
                gaitType: 'walking',
                rhythm: 'regular'
              }
            };
          default:
            return {
              horseDetected: Math.random() > 0.2,
              behaviorAnalysis: ['grazing', 'standing', 'walking', 'alert'][Math.floor(Math.random() * 4)],
              healthIndicators: {
                posture: 'normal',
                movement: 'active',
                alertness: 'high'
              }
            };
        }
      };
      
      const mockAnalysisResult = {
        photoNumber: newCount,
        timestamp,
        analysisResult: streamMode === 'local' ? generateAnalysisForVideo(selectedVideo) : {
          horseDetected: Math.random() > 0.3,
          behaviorAnalysis: ['grazing', 'standing', 'walking', 'alert'][Math.floor(Math.random() * 4)],
          healthIndicators: {
            posture: 'normal',
            movement: 'active',
            alertness: 'high'
          }
        }
      };
      
      setAnalysisResults(prev => [...prev.slice(-9), mockAnalysisResult]); // Keep last 10 results
      
    } catch (error) {
      console.error('❌ Photo capture failed:', error);
    }
  };

  // Handle frame capture from local video player with REAL AI analysis
  const handleLocalVideoFrameCapture = async (frameData: string, frameNumber: number) => {
    const timestamp = new Date().toISOString();
    
    try {
      console.log(`🤖 Analyzing frame ${frameNumber} with AI for video: ${selectedVideo.name}`);
      
      // Import AI Vision Service
      const { AIVisionService } = await import('../../../services/aiVisionService');
      const aiVisionService = AIVisionService.getInstance();
      
      // Create horse context based on selected video with thorough Unicode cleaning
      const cleanVideoName = (name: string) => {
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
      
      const horseContext = {
        name: cleanVideoName(selectedVideo.name), // Clean up all Unicode characters
        breed: 'Demo Horse',
        age: undefined,
        knownConditions: [selectedVideo.analysisType],
        priority: 'medium' as const,
        analysisType: selectedVideo.analysisType,
        videoSource: selectedVideo.name,
        frameNumber,
        sequenceId: `demo_${selectedVideo.id}_${Date.now()}`
      };
      
      // Analyze frame with AI Vision Service
      const aiAnalysisResult = await aiVisionService.analyzeHorseImage(frameData, horseContext);
      
      const analysisResult = {
        photoNumber: frameNumber,
        timestamp,
        frameData, // Actual frame data from video
        analysisResult: aiAnalysisResult // REAL AI analysis result
      };
      
      setPhotoCount(frameNumber);
      setAnalysisResults(prev => {
        const newResults = [...prev, analysisResult];
        
        // If we've reached 10 analyses, trigger meta-analysis and stop capture
        if (newResults.length === 10) {
          console.log('🧠 Reached 10 analyses - triggering meta-analysis...');
          setIsCapturing(false); // Stop capturing
          setTimeout(() => {
            handleAnalysisComplete(newResults); // Trigger meta-analysis
          }, 1000); // Small delay to ensure UI updates
        }
        
        return newResults;
      });
      
      console.log(`✅ AI analysis complete for frame ${frameNumber}:`, aiAnalysisResult);
      
    } catch (error) {
      console.error(`❌ AI analysis failed for frame ${frameNumber}:`, error);
      
      // Fallback to enhanced mock data if AI fails
      const fallbackResult = {
        photoNumber: frameNumber,
        timestamp,
        frameData,
        analysisResult: generateEnhancedAnalysisForVideo(selectedVideo, frameNumber),
        error: 'AI analysis failed, using fallback data'
      };
      
      setPhotoCount(frameNumber);
      setAnalysisResults(prev => {
        const newResults = [...prev, fallbackResult];
        
        // If we've reached 10 analyses, trigger meta-analysis and stop capture
        if (newResults.length === 10) {
          console.log('🧠 Reached 10 analyses - triggering meta-analysis...');
          setIsCapturing(false); // Stop capturing
          setTimeout(() => {
            handleAnalysisComplete(newResults); // Trigger meta-analysis
          }, 1000); // Small delay to ensure UI updates
        }
        
        return newResults;
      });
    }
  };

  const generateEnhancedAnalysisForVideo = (video: IDemoVideoOption, frameNumber: number) => {
    const baseVariation = (frameNumber % 10) / 10; // Creates variety between frames
    
    switch (video.analysisType) {
      case 'lameness':
        return {
          horseDetected: true,
          behaviorAnalysis: 'walking',
          healthIndicators: {
            posture: baseVariation > 0.7 ? 'favoring-left' : 'normal',
            movement: baseVariation > 0.6 ? 'irregular-gait' : 'normal',
            alertness: 'medium',
            lamenessScore: baseVariation > 0.8 ? 3 : baseVariation > 0.5 ? 2 : 1,
            affectedLimb: baseVariation > 0.7 ? 'front-left' : null,
            confidenceScore: (0.85 + baseVariation * 0.1).toFixed(2)
          }
        };
      case 'gait':
        return {
          horseDetected: true,
          behaviorAnalysis: 'natural-gait',
          healthIndicators: {
            posture: 'excellent',
            movement: 'smooth-stride',
            alertness: 'high',
            strideLength: `${(1.4 + baseVariation * 0.3).toFixed(1)}m`,
            gaitType: 'running-walk',
            rhythm: 'four-beat',
            confidenceScore: (0.92 + baseVariation * 0.05).toFixed(2)
          }
        };
      default:
        return {
          horseDetected: baseVariation > 0.1,
          behaviorAnalysis: ['grazing', 'standing', 'walking', 'alert'][Math.floor(baseVariation * 4)],
          healthIndicators: {
            posture: 'normal',
            movement: 'active',
            alertness: 'high',
            confidenceScore: (0.78 + baseVariation * 0.15).toFixed(2)
          }
        };
    }
  };

  // Helper function for formatting meta-analysis results
  const formatMetaAnalysisForHumans = (metaAnalysis: any) => {
    if (!metaAnalysis) return "No meta-analysis data available.";

    let humanText = "";

    // Executive Summary
    if (metaAnalysis.executiveSummary) {
      humanText += `📋 **Executive Summary**:\n${metaAnalysis.executiveSummary}\n\n`;
    }

    // Meta-Analysis Summary
    if (metaAnalysis.metaAnalysisSummary) {
      const summary = metaAnalysis.metaAnalysisSummary;
      humanText += `🔍 **Analysis Overview**:\n`;
      
      if (summary.totalAnalysesReviewed) {
        humanText += `• **Total Photos Analyzed**: ${summary.totalAnalysesReviewed}\n`;
      }
      if (summary.averageConfidenceScore) {
        humanText += `• **Average Confidence**: ${(summary.averageConfidenceScore * 100).toFixed(0)}%\n`;
      }
      if (summary.analysisConsistency) {
        humanText += `• **Consistency**: ${summary.analysisConsistency}\n`;
      }
      if (summary.primaryConsensusFindings?.length > 0) {
        humanText += `• **Key Findings**: ${summary.primaryConsensusFindings.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Temporal Trend Analysis
    if (metaAnalysis.temporalTrendAnalysis) {
      const trends = metaAnalysis.temporalTrendAnalysis;
      humanText += `📈 **Temporal Analysis**:\n`;
      
      if (trends.overallHealthTrend) {
        const trendEmoji = trends.overallHealthTrend === 'improving' ? '📈' : trends.overallHealthTrend === 'declining' ? '📉' : '📊';
        humanText += `• **Health Trend**: ${trendEmoji} ${trends.overallHealthTrend}\n`;
      }
      if (trends.behavioralProgressionSummary) {
        humanText += `• **Behavioral Progression**: ${trends.behavioralProgressionSummary}\n`;
      }
      if (trends.keyTransitionPoints?.length > 0) {
        humanText += `• **Key Transition Points**:\n`;
        trends.keyTransitionPoints.forEach((point: string) => {
          humanText += `  - ${point}\n`;
        });
      }
      humanText += '\n';
    }

    // Risk Assessment
    if (metaAnalysis.consensusRiskAssessment) {
      const risk = metaAnalysis.consensusRiskAssessment;
      humanText += `⚠️ **Risk Assessment**:\n`;
      
      if (risk.finalRiskLevel) {
        const riskEmoji = risk.finalRiskLevel === 'low' ? '🟢' : 
                         risk.finalRiskLevel === 'medium' ? '🟡' : 
                         risk.finalRiskLevel === 'high' ? '🟠' : '🔴';
        humanText += `• **Risk Level**: ${riskEmoji} ${risk.finalRiskLevel.toUpperCase()}\n`;
      }
      if (risk.urgencyLevel) {
        humanText += `• **Urgency**: ${risk.urgencyLevel}\n`;
      }
      if (risk.primaryRiskFactors?.length > 0) {
        humanText += `• **Primary Risk Factors**: ${risk.primaryRiskFactors.join(', ')}\n`;
      }
      if (risk.riskTrend) {
        const trendEmoji = risk.riskTrend === 'increasing' ? '📈' : risk.riskTrend === 'decreasing' ? '📉' : '📊';
        humanText += `• **Risk Trend**: ${trendEmoji} ${risk.riskTrend}\n`;
      }
      humanText += '\n';
    }

    // Health Assessment Synthesis
    if (metaAnalysis.healthAssessmentSynthesis) {
      const health = metaAnalysis.healthAssessmentSynthesis;
      humanText += `🩺 **Health Assessment**:\n`;
      
      if (health.finalHealthScore) {
        humanText += `• **Overall Health Score**: ${health.finalHealthScore}/100\n`;
      }
      if (health.healthScoreConfidence) {
        humanText += `• **Assessment Confidence**: ${(health.healthScoreConfidence * 100).toFixed(0)}%\n`;
      }
      if (health.concerningFindings?.length > 0) {
        humanText += `• **Concerning Findings**: ${health.concerningFindings.join(', ')}\n`;
      }
      if (health.positiveFindings?.length > 0) {
        humanText += `• **Positive Findings**: ${health.positiveFindings.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Final Recommendations
    if (metaAnalysis.finalRecommendations) {
      const recs = metaAnalysis.finalRecommendations;
      humanText += `💡 **Recommendations**:\n`;
      
      if (recs.immediate?.length > 0) {
        humanText += `• **Immediate Actions**:\n`;
        recs.immediate.forEach((action: string) => {
          humanText += `  - ${action}\n`;
        });
      }
      if (recs.shortTerm?.length > 0) {
        humanText += `• **Short-term Actions**:\n`;
        recs.shortTerm.forEach((action: string) => {
          humanText += `  - ${action}\n`;
        });
      }
      if (recs.longTerm?.length > 0) {
        humanText += `• **Long-term Actions**:\n`;
        recs.longTerm.forEach((action: string) => {
          humanText += `  - ${action}\n`;
        });
      }
      
      if (recs.veterinaryConsultation) {
        humanText += `• **Veterinary Consultation**:\n`;
        if (recs.veterinaryConsultation.recommended) {
          humanText += `  - Recommended: Yes (${recs.veterinaryConsultation.urgency})\n`;
        }
        if (recs.veterinaryConsultation.specificConcerns?.length > 0) {
          humanText += `  - Specific Concerns: ${recs.veterinaryConsultation.specificConcerns.join(', ')}\n`;
        }
      }
      humanText += '\n';
    }

    // Meta-Analysis Insights
    if (metaAnalysis.metaAnalysisInsights) {
      const insights = metaAnalysis.metaAnalysisInsights;
      humanText += `🧠 **Meta-Analysis Insights**:\n`;
      
      if (insights.strongestConsensusFindings?.length > 0) {
        humanText += `• **Strongest Consensus**: ${insights.strongestConsensusFindings.join(', ')}\n`;
      }
      if (insights.unexpectedDiscrepancies?.length > 0) {
        humanText += `• **Unexpected Discrepancies**: ${insights.unexpectedDiscrepancies.join(', ')}\n`;
      }
      if (insights.temporalInsights?.length > 0) {
        humanText += `• **Temporal Insights**: ${insights.temporalInsights.join(', ')}\n`;
      }
      if (insights.recommendedImprovements?.length > 0) {
        humanText += `• **Recommended Improvements**: ${insights.recommendedImprovements.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Analysis Reliability Report
    if (metaAnalysis.analysisReliabilityReport) {
      const reliability = metaAnalysis.analysisReliabilityReport;
      humanText += `📊 **Reliability Report**:\n`;
      
      if (reliability.overallReliabilityScore) {
        humanText += `• **Overall Reliability**: ${(reliability.overallReliabilityScore * 100).toFixed(0)}%\n`;
      }
      if (reliability.mostReliableAnalyses?.length > 0) {
        humanText += `• **Most Reliable Photos**: ${reliability.mostReliableAnalyses.join(', ')}\n`;
      }
      if (reliability.humanValidationRequired?.length > 0) {
        humanText += `• **Human Validation Needed**: ${reliability.humanValidationRequired.join(', ')}\n`;
      }
      humanText += '\n';
    }

    return humanText.trim();
  };

  // Helper functions for analysis formatting
  const formatAnalysisForHumans = (analysisResult: any): string => {
    if (!analysisResult) return 'No analysis data available';

    // Check if this is the advanced video analysis format
    if (analysisResult.sceneDescription && analysisResult.healthMetrics && analysisResult.clinicalAssessment) {
      return formatAdvancedAnalysisForHumans(analysisResult);
    }

    // Check if this is a meta-analysis result
    if (analysisResult.metaAnalysisSummary) {
      return formatMetaAnalysisForHumans(analysisResult);
    }

    // Fallback to original format
    return formatOriginalAnalysisForHumans(analysisResult);
  };

  // NEW: Format the advanced equine video health analysis
  const formatAdvancedAnalysisForHumans = (analysisResult: any): string => {
    const sections = [];
    
    sections.push('🎯 **ADVANCED EQUINE VIDEO HEALTH ANALYSIS**');
    sections.push('═══════════════════════════════════════════════════');
    
    // Overall Assessment
    sections.push('\n🏥 **OVERALL ASSESSMENT**');
    sections.push(`• **Horse Detected:** ${analysisResult.horseDetected ? '✅ Yes' : '❌ No'}`);
    sections.push(`• **Overall Confidence:** ${(analysisResult.confidence * 100).toFixed(1)}%`);
    sections.push(`• **Alert Level:** ${getAlertEmoji(analysisResult.alertLevel)} ${analysisResult.alertLevel?.toUpperCase() || 'UNKNOWN'}`);
    sections.push(`• **Health Risk Score:** ${(analysisResult.healthRisk * 100).toFixed(1)}%`);

    // Scene Description
    if (analysisResult.sceneDescription) {
      sections.push('\n📋 **SCENE ASSESSMENT**');
      
      if (analysisResult.sceneDescription.environment) {
        const env = analysisResult.sceneDescription.environment;
        sections.push(`• **Environment:** ${env.setting || 'Unknown'}`);
        sections.push(`• **Surface Type:** ${env.surfaceType || 'Unknown'} (${env.surfaceCondition || 'condition unknown'})`);
        sections.push(`• **Lighting:** ${env.lighting || 'Unknown'}`);
        if (env.weatherVisible && env.weatherVisible !== 'not visible') {
          sections.push(`• **Weather:** ${env.weatherVisible}`);
        }
      }
      
      if (analysisResult.sceneDescription.horseDescription) {
        const horse = analysisResult.sceneDescription.horseDescription;
        sections.push(`• **Horse Description:** ${horse.coatColor || 'Unknown color'}, ${horse.approximateSize || 'size unknown'}`);
        sections.push(`• **Body Condition:** ${horse.bodyCondition || 'Unknown'}`);
        if (horse.tackEquipment && horse.tackEquipment.length > 0) {
          sections.push(`• **Equipment:** ${horse.tackEquipment.join(', ')}`);
        }
      }
      
      if (analysisResult.sceneDescription.positioning) {
        const pos = analysisResult.sceneDescription.positioning;
        sections.push(`• **Position:** ${pos.locationInFrame || 'Unknown'} - ${pos.orientation || 'orientation unknown'}`);
        sections.push(`• **Posture:** ${pos.postureGeneral || 'Unknown'}`);
      }
      
      if (analysisResult.sceneDescription.overallSceneAssessment) {
        sections.push(`• **Scene Summary:** ${analysisResult.sceneDescription.overallSceneAssessment}`);
      }
    }

    // Health Metrics (Key Advanced Data)
    if (analysisResult.healthMetrics) {
      sections.push('\n📊 **HEALTH METRICS SCORES**');
      const metrics = analysisResult.healthMetrics;
      sections.push(`• **Overall Health:** ${metrics.overallHealthScore || 0}/100 ${getScoreEmoji(metrics.overallHealthScore)}`);
      sections.push(`• **Mobility Score:** ${metrics.mobilityScore || 0}/100 ${getScoreEmoji(metrics.mobilityScore)}`);
      sections.push(`• **Behavioral Score:** ${metrics.behavioralScore || 0}/100 ${getScoreEmoji(metrics.behavioralScore)}`);
      sections.push(`• **Respiratory Score:** ${metrics.respiratoryScore || 0}/100 ${getScoreEmoji(metrics.respiratoryScore)}`);
      sections.push(`• **Posture Score:** ${metrics.postureScore || 0}/100 ${getScoreEmoji(metrics.postureScore)}`);
    }

    // Clinical Assessment (Advanced Veterinary Analysis)
    if (analysisResult.clinicalAssessment) {
      sections.push('\n🏥 **CLINICAL ASSESSMENT**');
      const clinical = analysisResult.clinicalAssessment;
      
      if (clinical.posturalAnalysis && clinical.posturalAnalysis !== 'normal') {
        sections.push(`• **Postural Analysis:** ${clinical.posturalAnalysis}`);
      }
      
      if (clinical.mobilityAssessment && clinical.mobilityAssessment !== 'normal') {
        sections.push(`• **Mobility Assessment:** ${clinical.mobilityAssessment}`);
      }
      
      if (clinical.respiratoryObservation && clinical.respiratoryObservation !== 'normal') {
        sections.push(`• **Respiratory Observation:** ${clinical.respiratoryObservation}`);
      }
      
      if (clinical.behavioralNotes) {
        sections.push(`• **Behavioral Notes:** ${clinical.behavioralNotes}`);
      }
    }

    // Risk Assessment
    if (analysisResult.riskAssessment) {
      sections.push('\n⚠️ **RISK ASSESSMENT**');
      const risk = analysisResult.riskAssessment;
      sections.push(`• **Overall Risk Level:** ${getRiskEmoji(risk.overallRiskLevel)} ${risk.overallRiskLevel?.toUpperCase() || 'UNKNOWN'}`);
      sections.push(`• **Risk Score:** ${(risk.riskScore * 100).toFixed(1)}%`);
      
      if (risk.immediateRisks && risk.immediateRisks.length > 0) {
        sections.push(`• **Immediate Risks:**`);
        risk.immediateRisks.forEach((riskItem: string) => {
          sections.push(`  - ${riskItem}`);
        });
      }
      
      if (risk.monitoringNeeded && risk.monitoringNeeded.length > 0) {
        sections.push(`• **Monitoring Needed:**`);
        risk.monitoringNeeded.forEach((item: string) => {
          sections.push(`  - ${item}`);
        });
      }
    }

    // Alerts
    if (analysisResult.alerts && analysisResult.alerts.length > 0) {
      sections.push('\n🚨 **ALERTS**');
      analysisResult.alerts.forEach((alert: any, index: number) => {
        const severityEmoji = alert.severity === 'critical' ? '🔴' : 
                            alert.severity === 'high' ? '🟠' : 
                            alert.severity === 'medium' ? '🟡' : '🟢';
        sections.push(`${index + 1}. ${severityEmoji} **[${alert.severity?.toUpperCase() || 'INFO'}]** ${alert.description || 'Alert triggered'}`);
      });
    }

    // Recommendations
    if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
      sections.push('\n💡 **RECOMMENDATIONS**');
      analysisResult.recommendations.forEach((rec: string, index: number) => {
        sections.push(`${index + 1}. ${rec}`);
      });
    }

    // Technical Details
    if (analysisResult.metadata) {
      sections.push('\n🔧 **TECHNICAL DETAILS**');
      const meta = analysisResult.metadata;
      sections.push(`• **Capture Time:** ${new Date(meta.captureTimestamp || Date.now()).toLocaleString()}`);
      sections.push(`• **Processing Time:** ${meta.processingTime || 'Unknown'}ms`);
      sections.push(`• **Video Duration:** ${meta.videoDuration || 'Unknown'}s`);
      sections.push(`• **Segment Index:** ${meta.segmentIndex || 'Unknown'}`);
    }

    sections.push('\n⚕️ **VETERINARY DISCLAIMER**');
    sections.push('This AI analysis supports but does not replace professional veterinary examination. Always consult with a qualified equine veterinarian for health concerns.');

    return sections.join('\n');
  };

  // Helper functions for emojis and formatting
  const getAlertEmoji = (level?: string): string => {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getRiskEmoji = (level?: string): string => {
    switch (level?.toLowerCase()) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'moderate': 
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getScoreEmoji = (score?: number): string => {
    if (!score) return '⚪';
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  };

  // Original formatting function for backward compatibility
  const formatOriginalAnalysisForHumans = (analysisResult: any): string => {
    if (!analysisResult) return 'No analysis data available';

    let humanText = '';

    // Check if this is a meta-analysis result
    if (analysisResult.metaAnalysisSummary) {
      return formatMetaAnalysisForHumans(analysisResult);
    }

    // Horse Detection Section
    if (analysisResult.imageAssessment?.horsesDetected) {
      const horseCount = analysisResult.imageAssessment.horsesDetected.count || 0;
      if (horseCount > 0) {
        humanText += `🐴 **Horse Detection**: ${horseCount} horse${horseCount > 1 ? 's' : ''} detected in the image.\n\n`;
        
        if (analysisResult.imageAssessment.horsesDetected.locations?.length > 0) {
          humanText += `📍 **Location**: ${analysisResult.imageAssessment.horsesDetected.locations.join(', ')}\n\n`;
        }
        
        if (analysisResult.imageAssessment.horsesDetected.identifiableBreeds?.length > 0) {
          humanText += `🏇 **Breed Assessment**: ${analysisResult.imageAssessment.horsesDetected.identifiableBreeds.join(', ')}\n\n`;
        }
      } else {
        humanText += `❌ **Horse Detection**: No horses detected in this image.\n\n`;
      }
    }

    // Primary Subject Analysis
    if (analysisResult.primarySubjectAnalysis && analysisResult.primarySubjectAnalysis.subjectType === 'horse') {
      humanText += `📊 **Horse Analysis**:\n`;
      const subject = analysisResult.primarySubjectAnalysis;
      
      if (subject.breedAssessment) {
        humanText += `• **Breed**: ${subject.breedAssessment}\n`;
      }
      if (subject.ageEstimate) {
        humanText += `• **Age**: ${subject.ageEstimate}\n`;
      }
      if (subject.sizeClassification) {
        humanText += `• **Size**: ${subject.sizeClassification}\n`;
      }
      if (subject.coatCondition) {
        humanText += `• **Coat**: ${subject.coatCondition}\n`;
      }
      if (subject.facialExpression) {
        humanText += `• **Expression**: ${subject.facialExpression}\n`;
      }
      if (subject.bodyLanguage) {
        humanText += `• **Body Language**: ${subject.bodyLanguage}\n`;
      }
      humanText += '\n';
    }

    // Clinical Assessment
    if (analysisResult.clinicalAssessment) {
      humanText += `🩺 **Clinical Assessment**:\n`;
      const clinical = analysisResult.clinicalAssessment;
      
      if (clinical.posturalAnalysis) {
        humanText += `• **Posture**: ${clinical.posturalAnalysis}\n`;
      }
      if (clinical.mobilityAssessment) {
        humanText += `• **Mobility**: ${clinical.mobilityAssessment}\n`;
      }
      if (clinical.behavioralState) {
        humanText += `• **Behavior**: ${clinical.behavioralState}\n`;
      }
      if (clinical.alertnessLevel) {
        humanText += `• **Alertness**: ${clinical.alertnessLevel}\n`;
      }
      if (clinical.gaitAnalysis) {
        humanText += `• **Gait**: ${clinical.gaitAnalysis}\n`;
      }
      
      if (clinical.painIndicators?.length > 0) {
        humanText += `• **Pain Indicators**: ${clinical.painIndicators.join(', ')}\n`;
      }
      if (clinical.discomfortSigns?.length > 0) {
        humanText += `• **Discomfort Signs**: ${clinical.discomfortSigns.join(', ')}\n`;
      }
      if (clinical.lamenessIndicators?.length > 0) {
        humanText += `• **Lameness Signs**: ${clinical.lamenessIndicators.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Health Metrics
    if (analysisResult.healthMetrics) {
      humanText += `📈 **Health Scores** (0-100):\n`;
      const metrics = analysisResult.healthMetrics;
      
      if (metrics.overallHealthScore !== undefined) {
        humanText += `• **Overall Health**: ${metrics.overallHealthScore}/100\n`;
      }
      if (metrics.mobilityScore !== undefined) {
        humanText += `• **Mobility**: ${metrics.mobilityScore}/100\n`;
      }
      if (metrics.behavioralScore !== undefined) {
        humanText += `• **Behavior**: ${metrics.behavioralScore}/100\n`;
      }
      if (metrics.respiratoryScore !== undefined) {
        humanText += `• **Respiratory**: ${metrics.respiratoryScore}/100\n`;
      }
      if (metrics.postureScore !== undefined) {
        humanText += `• **Posture**: ${metrics.postureScore}/100\n`;
      }
      if (metrics.alertnessScore !== undefined) {
        humanText += `• **Alertness**: ${metrics.alertnessScore}/100\n`;
      }
      if (metrics.gaitScore !== undefined) {
        humanText += `• **Gait**: ${metrics.gaitScore}/100\n`;
      }
      humanText += '\n';
    }

    // Risk Assessment
    if (analysisResult.riskAssessment) {
      const risk = analysisResult.riskAssessment;
      humanText += `⚠️ **Risk Assessment**:\n`;
      
      if (risk.overallRiskLevel) {
        const riskEmoji = risk.overallRiskLevel === 'low' ? '🟢' : risk.overallRiskLevel === 'medium' ? '🟡' : '🔴';
        humanText += `• **Risk Level**: ${riskEmoji} ${risk.overallRiskLevel.toUpperCase()}\n`;
      }
      if (risk.riskScore !== undefined) {
        humanText += `• **Risk Score**: ${(risk.riskScore * 100).toFixed(0)}%\n`;
      }
      if (risk.immediateRisks?.length > 0) {
        humanText += `• **Immediate Risks**: ${risk.immediateRisks.join(', ')}\n`;
      }
      if (risk.monitoringNeeded?.length > 0) {
        humanText += `• **Monitor**: ${risk.monitoringNeeded.join(', ')}\n`;
      }
      if (risk.concerningObservations?.length > 0) {
        humanText += `• **Concerns**: ${risk.concerningObservations.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Clinical Recommendations
    if (analysisResult.clinicalRecommendations) {
      const recs = analysisResult.clinicalRecommendations;
      humanText += `💡 **Recommendations**:\n`;
      
      if (recs.immediate?.length > 0) {
        humanText += `• **Immediate Actions**: ${recs.immediate.join(', ')}\n`;
      }
      if (recs.shortTerm?.length > 0) {
        humanText += `• **Short-term**: ${recs.shortTerm.join(', ')}\n`;
      }
      if (recs.longTerm?.length > 0) {
        humanText += `• **Long-term**: ${recs.longTerm.join(', ')}\n`;
      }
      if (recs.veterinaryConsultation && recs.veterinaryConsultation !== 'not applicable') {
        humanText += `• **Veterinary Consultation**: ${recs.veterinaryConsultation}\n`;
      }
      if (recs.monitoringFrequency && recs.monitoringFrequency !== 'not applicable') {
        humanText += `• **Monitoring**: ${recs.monitoringFrequency}\n`;
      }
      humanText += '\n';
    }

    // Detailed Clinical Notes
    if (analysisResult.detailedClinicalNotes) {
      humanText += `📝 **Clinical Notes**:\n${analysisResult.detailedClinicalNotes}\n\n`;
    }

    // Meta-Analysis Insights (for final assessment)
    if (analysisResult.metaAnalysisInsights) {
      const insights = analysisResult.metaAnalysisInsights;
      humanText += `🧠 **Meta-Analysis Insights**:\n`;
      
      if (insights.temporalTrends) {
        humanText += `• **Temporal Trends**: ${insights.temporalTrends}\n`;
      }
      if (insights.consistencyAnalysis) {
        humanText += `• **Consistency Analysis**: ${insights.consistencyAnalysis}\n`;
      }
      if (insights.confidenceAssessment) {
        humanText += `• **Confidence Assessment**: ${insights.confidenceAssessment}\n`;
      }
      if (insights.keyFindings?.length > 0) {
        humanText += `• **Key Findings**: ${insights.keyFindings.join(', ')}\n`;
      }
      if (insights.monitoringPriorities?.length > 0) {
        humanText += `• **Monitoring Priorities**: ${insights.monitoringPriorities.join(', ')}\n`;
      }
      humanText += '\n';
    }

    // Additional Analysis Data
    if (analysisResult.confidence !== undefined) {
      humanText += `🎯 **AI Confidence**: ${(analysisResult.confidence * 100).toFixed(0)}%\n`;
    }

    return humanText.trim();
  };

  const getAnalysisDropdownOptions = () => {
    const options = [];
    
    // Add individual photo analyses
    analysisResults.forEach((result, index) => {
      options.push({
        value: `photo_${result.photoNumber}`,
        label: `📸 Photo #${result.photoNumber} - ${new Date(result.timestamp).toLocaleTimeString()}`,
        data: result
      });
    });

    // Add meta-analysis if available
    if (metaAnalysisResult) {
      options.push({
        value: 'meta_analysis',
        label: '🧠 Final Meta-Analysis - AI Synthesis',
        data: metaAnalysisResult
      });
    }

    return options;
  };

  const getSelectedAnalysisData = () => {
    if (!selectedAnalysisItem) return null;
    
    if (selectedAnalysisItem === 'meta_analysis') {
      return metaAnalysisResult;
    }
    
    const photoNumber = selectedAnalysisItem.replace('photo_', '');
    return analysisResults.find(result => result.photoNumber.toString() === photoNumber);
  };

  return (
    <div className="space-y-6">
      <div 
        className="p-6 rounded-2xl shadow-lg border"
        style={{
          backgroundColor: brandConfig.colors.ribbonBlue + '10',
          borderColor: brandConfig.colors.ribbonBlue + '33',
          borderRadius: brandConfig.layout.borderRadius
        }}
      >
        <div className="flex items-center gap-3">
          <h3 
            className="text-xl font-bold"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            {demoConfig.header.title}
          </h3>
          <span 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: brandConfig.colors.championGold,
              color: brandConfig.colors.barnWhite,
              fontSize: brandConfig.typography.fontSizeXs,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            {demoConfig.header.badge}
          </span>
        </div>
        <p style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
          {demoConfig.header.subtitle}
        </p>
        <p 
          className="mt-2"
          style={{ 
            color: brandConfig.colors.neutralGray, 
            fontSize: brandConfig.typography.fontSizeXs,
            fontStyle: 'italic'
          }}
        >
          {demoConfig.header.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: isCapturing ? brandConfig.colors.successGreen : brandConfig.colors.neutralGray,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {isCapturing ? getDemoStatusMessage('capturing', { current: photoCount + 1, total: aiDemoSettings.analysis.frameCapture.maxPhotos }) : getDemoStatusMessage('idle')}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              {demoConfig.sections.liveAnalysis.title}
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.championGold,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {photoCount}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Photos Captured
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.pastureSage,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {captureInterval}s
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Capture Interval
            </div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold"
              style={{
                color: brandConfig.colors.ribbonBlue,
                fontSize: brandConfig.typography.fontSize2xl,
                fontWeight: brandConfig.typography.weightBold
              }}
            >
              {analysisResults.length}
            </div>
            <div style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeSm }}>
              Analyses Complete
            </div>
          </div>
        </div>

        {/* Stream Source Selection */}
        <div className="mt-6 space-y-4">
          <div>
                          <label 
                style={{ 
                  color: brandConfig.colors.stableMahogany, 
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                📺 {demoConfig.sections.videoSelection.title}:
              </label>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setStreamMode('local')}
                className="px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: streamMode === 'local' ? brandConfig.colors.championGold : brandConfig.colors.neutralGray + '20',
                  color: streamMode === 'local' ? brandConfig.colors.barnWhite : brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                🎬 Local Video Files
              </button>
              <button
                onClick={() => setStreamMode('youtube')}
                className="px-4 py-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: streamMode === 'youtube' ? brandConfig.colors.championGold : brandConfig.colors.neutralGray + '20',
                  color: streamMode === 'youtube' ? brandConfig.colors.barnWhite : brandConfig.colors.stableMahogany,
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                📹 YouTube/External
              </button>
            </div>
          </div>

          {streamMode === 'local' ? (
            <div>
              <label 
                style={{ 
                  color: brandConfig.colors.stableMahogany, 
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                🎯 Select Demo Video:
              </label>
              <select
                value={selectedVideo.id}
                onChange={(e) => {
                  const video = demoVideosConfig.find(v => v.id === e.target.value);
                  if (video) {
                    setSelectedVideo(video);
                    // Reset analysis results when switching videos
                    setAnalysisResults([]);
                    setMetaAnalysisResult(null);
                    setSelectedAnalysisItem('');
                    // Stop capturing if currently active
                    if (isCapturing) {
                      setIsCapturing(false);
                    }
                    console.log(`🎬 Switched to video: ${video.name} - Analysis results reset`);
                  }
                }}
                disabled={isCapturing}
                className="w-full mt-2 px-3 py-2 rounded-lg border"
                style={{
                  borderColor: brandConfig.colors.neutralGray + '50',
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: isCapturing ? brandConfig.colors.neutralGray + '20' : brandConfig.colors.barnWhite
                }}
              >
                {demoVideosConfig.map(video => (
                  <option key={video.id} value={video.id}>
                    {video.name} ({video.duration})
                  </option>
                ))}
              </select>
              
              {/* Video Description and AI Settings */}
              <div 
                className="mt-3 p-3 rounded-lg"
                style={{
                  backgroundColor: brandConfig.colors.pastureSage + '15',
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                <div className="space-y-2">
                  <div>
                    <p style={{ 
                      color: brandConfig.colors.stableMahogany, 
                      fontSize: brandConfig.typography.fontSizeSm,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}>
                      📋 {selectedVideo.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p style={{ 
                        color: brandConfig.colors.neutralGray, 
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightSemiBold
                      }}>
                        Analysis Type:
                      </p>
                      <p style={{ 
                        color: brandConfig.colors.ribbonBlue, 
                        fontSize: brandConfig.typography.fontSizeXs,
                        textTransform: 'capitalize'
                      }}>
                        {selectedVideo.analysisType}
                      </p>
                    </div>
                    <div>
                      <p style={{ 
                        color: brandConfig.colors.neutralGray, 
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightSemiBold
                      }}>
                        AI Capture Settings:
                      </p>
                      <p style={{ 
                        color: brandConfig.colors.championGold, 
                        fontSize: brandConfig.typography.fontSizeXs
                      }}>
                        Every {aiDemoSettings.analysis.frameCapture.intervalSeconds}s for {aiDemoSettings.analysis.frameCapture.maxPhotos} photos
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p style={{ 
                      color: brandConfig.colors.neutralGray, 
                      fontSize: brandConfig.typography.fontSizeXs,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}>
                      Key Features:
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedVideo.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: brandConfig.colors.arenaSand + '30',
                            color: brandConfig.colors.stableMahogany,
                            fontSize: brandConfig.typography.fontSizeXs
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label 
                style={{ 
                  color: brandConfig.colors.stableMahogany, 
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                📹 Stream URL (YouTube, MP4, RTMP, etc.):
              </label>
              <input
                type="url"
                value={customStreamUrl}
                onChange={(e) => setCustomStreamUrl(e.target.value)}
                placeholder="Enter stream URL..."
                disabled={isCapturing}
                className="w-full mt-2 px-3 py-2 rounded-lg border transition-all duration-300"
                style={{
                  borderColor: brandConfig.colors.neutralGray + '50',
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: isCapturing ? brandConfig.colors.neutralGray + '20' : brandConfig.colors.barnWhite
                }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                style={{ 
                  color: brandConfig.colors.stableMahogany, 
                  fontSize: brandConfig.typography.fontSizeSm,
                  fontWeight: brandConfig.typography.weightSemiBold
                }}
              >
                ⏱️ Capture Interval (seconds):
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={captureInterval}
                onChange={(e) => setCaptureInterval(Number(e.target.value))}
                disabled={isCapturing && streamMode === 'local'}
                className="w-full mt-2 px-3 py-2 rounded-lg border"
                style={{
                  borderColor: brandConfig.colors.neutralGray + '50',
                  fontSize: brandConfig.typography.fontSizeSm,
                  borderRadius: brandConfig.layout.borderRadius,
                  backgroundColor: (isCapturing && streamMode === 'local') ? brandConfig.colors.neutralGray + '20' : brandConfig.colors.barnWhite
                }}
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={streamMode === 'local' ? 
                  (isCapturing ? () => setIsCapturing(false) : () => setIsCapturing(true)) :
                  (isCapturing ? stopContinuousCapture : startContinuousCapture)
                }
                className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-300"
                style={{
                  backgroundColor: isCapturing ? brandConfig.colors.errorRed : brandConfig.colors.successGreen,
                  color: brandConfig.colors.barnWhite,
                  fontSize: brandConfig.typography.fontSizeBase,
                  borderRadius: brandConfig.layout.borderRadius
                }}
              >
                {isCapturing ? '⏹️ Stop Capture' : '▶️ Start Capture'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Video Preview */}
        {streamMode === 'local' && (
          <div className="mt-6">
            <h4 
              className="text-sm font-semibold mb-3"
              style={{
                color: brandConfig.colors.stableMahogany,
                fontSize: brandConfig.typography.fontSizeSm,
                fontWeight: brandConfig.typography.weightSemiBold
              }}
            >
              📺 Live Stream Preview - {selectedVideo.name}
            </h4>
            <LocalVideoStreamPlayer
              videoOption={selectedVideo}
              isCapturing={isCapturing}
              captureInterval={captureInterval}
              onFrameCapture={handleLocalVideoFrameCapture}
              autoPlay={true}
              loop={true}
            />
          </div>
        )}


      </div>



      {analysisResults.length > 0 && (
        <div 
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.successGreen + '10',
            borderColor: brandConfig.colors.successGreen + '33',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h4 
            className="text-lg font-semibold mb-4"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeLg,
              fontWeight: brandConfig.typography.weightSemiBold
            }}
          >
            📊 Real-Time Analysis Results ({analysisResults.length} completed)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResults.slice(-6).map((result, index) => (
              <div 
                key={result.photoNumber}
                className="p-4 rounded-lg border-l-4 transition-all duration-300"
                style={{ 
                  backgroundColor: brandConfig.colors.barnWhite,
                  borderLeftColor: result.analysisResult?.horseDetected ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span style={{ color: brandConfig.colors.stableMahogany, fontWeight: brandConfig.typography.weightSemiBold }}>
                    📸 Photo #{result.photoNumber}
                  </span>
                  <span style={{ color: brandConfig.colors.successGreen, fontSize: brandConfig.typography.fontSizeXs }}>
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {result.analysisResult && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                        🐴 Horse:
                      </span>
                      <span style={{ 
                        color: result.analysisResult.horseDetected ? brandConfig.colors.successGreen : brandConfig.colors.alertAmber,
                        fontSize: brandConfig.typography.fontSizeXs,
                        fontWeight: brandConfig.typography.weightSemiBold
                      }}>
                        {result.analysisResult.horseDetected ? 'Detected' : 'Not Detected'}
                      </span>
                    </div>
                    
                    {result.analysisResult.horseDetected && (
                      <>
                        <div className="flex items-center gap-2">
                          <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                            🎯 Behavior:
                          </span>
                          <span style={{ 
                            color: brandConfig.colors.ribbonBlue,
                            fontSize: brandConfig.typography.fontSizeXs,
                            fontWeight: brandConfig.typography.weightSemiBold
                          }}>
                            {result.analysisResult.behaviorAnalysis}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                            💚 Health:
                          </span>
                          <span style={{ 
                            color: brandConfig.colors.pastureSage,
                            fontSize: brandConfig.typography.fontSizeXs,
                            fontWeight: brandConfig.typography.weightSemiBold
                          }}>
                            {result.analysisResult.healthIndicators?.posture} / {result.analysisResult.healthIndicators?.alertness}
                          </span>
                        </div>

                        {/* Enhanced analysis details */}
                        {result.analysisResult.healthIndicators?.lamenessScore && (
                          <div className="flex items-center gap-2">
                            <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                              🩺 Lameness:
                            </span>
                            <span style={{ 
                              color: result.analysisResult.healthIndicators.lamenessScore > 2 ? brandConfig.colors.errorRed : brandConfig.colors.successGreen,
                              fontSize: brandConfig.typography.fontSizeXs,
                              fontWeight: brandConfig.typography.weightSemiBold
                            }}>
                              Score {result.analysisResult.healthIndicators.lamenessScore}/5
                            </span>
                          </div>
                        )}

                        {result.analysisResult.healthIndicators?.strideLength && (
                          <div className="flex items-center gap-2">
                            <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                              📏 Stride:
                            </span>
                            <span style={{ 
                              color: brandConfig.colors.championGold,
                              fontSize: brandConfig.typography.fontSizeXs,
                              fontWeight: brandConfig.typography.weightSemiBold
                            }}>
                              {result.analysisResult.healthIndicators.strideLength}
                            </span>
                          </div>
                        )}

                        {result.analysisResult.healthIndicators?.confidenceScore && (
                          <div className="flex items-center gap-2">
                            <span style={{ color: brandConfig.colors.neutralGray, fontSize: brandConfig.typography.fontSizeXs }}>
                              🎯 Confidence:
                            </span>
                            <span style={{ 
                              color: brandConfig.colors.ribbonBlue,
                              fontSize: brandConfig.typography.fontSizeXs,
                              fontWeight: brandConfig.typography.weightSemiBold
                            }}>
                              {(parseFloat(result.analysisResult.healthIndicators.confidenceScore) * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta-Analysis Results Display */}
      {metaAnalysisResult && (
        <div 
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.championGold + '20',
            borderColor: brandConfig.colors.championGold + '50',
            borderRadius: brandConfig.layout.borderRadius,
            borderWidth: '2px'
          }}
        >
          <h4 
            className="text-xl font-bold mb-4 flex items-center gap-3"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            🧠 AI Meta-Analysis - Final Assessment
            <span 
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: brandConfig.colors.championGold,
                color: brandConfig.colors.barnWhite,
                fontSize: brandConfig.typography.fontSizeXs
              }}
            >
              COMPLETE
            </span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Statistics */}
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <h5 style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontWeight: brandConfig.typography.weightSemiBold,
                marginBottom: brandConfig.spacing.sm
              }}>
                📊 Analysis Summary
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: brandConfig.colors.neutralGray }}>Photos Analyzed:</span>
                  <span style={{ color: brandConfig.colors.successGreen, fontWeight: brandConfig.typography.weightSemiBold }}>
                    {metaAnalysisResult.analysisResult?.totalPhotosAnalyzed || 10}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: brandConfig.colors.neutralGray }}>Video Source:</span>
                  <span style={{ color: brandConfig.colors.ribbonBlue, fontWeight: brandConfig.typography.weightSemiBold }}>
                    {selectedVideo.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: brandConfig.colors.neutralGray }}>Analysis Type:</span>
                  <span style={{ color: brandConfig.colors.pastureSage, fontWeight: brandConfig.typography.weightSemiBold }}>
                    {selectedVideo.analysisType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: brandConfig.colors.neutralGray }}>Duration:</span>
                  <span style={{ color: brandConfig.colors.championGold, fontWeight: brandConfig.typography.weightSemiBold }}>
                    ~60 seconds
                  </span>
                </div>
              </div>
            </div>

            {/* AI Analysis Results */}
            <div 
              className="p-4 rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.barnWhite,
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <h5 style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontWeight: brandConfig.typography.weightSemiBold,
                marginBottom: brandConfig.spacing.sm
              }}>
                🤖 AI Assessment
              </h5>
              
              {metaAnalysisResult.analysisResult?.summary && (
                <div className="space-y-3">
                  {/* Health Score */}
                  {metaAnalysisResult.analysisResult.summary.healthAssessment?.overallHealthScore && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: brandConfig.colors.neutralGray }}>Overall Health Score:</span>
                      <div className="flex items-center gap-2">
                        <span style={{ 
                          color: metaAnalysisResult.analysisResult.summary.healthAssessment.overallHealthScore > 80 ? 
                            brandConfig.colors.successGreen : 
                            metaAnalysisResult.analysisResult.summary.healthAssessment.overallHealthScore > 60 ? 
                            brandConfig.colors.alertAmber : 
                            brandConfig.colors.errorRed,
                          fontWeight: brandConfig.typography.weightBold
                        }}>
                          {metaAnalysisResult.analysisResult.summary.healthAssessment.overallHealthScore}/100
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Confidence Level */}
                  {metaAnalysisResult.analysisResult.summary.confidence && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: brandConfig.colors.neutralGray }}>AI Confidence:</span>
                      <span style={{ 
                        color: brandConfig.colors.ribbonBlue, 
                        fontWeight: brandConfig.typography.weightSemiBold 
                      }}>
                        {(metaAnalysisResult.analysisResult.summary.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}

                  {/* Risk Level */}
                  {metaAnalysisResult.analysisResult.summary.alertLevel && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: brandConfig.colors.neutralGray }}>Risk Level:</span>
                      <span style={{ 
                        color: metaAnalysisResult.analysisResult.summary.alertLevel === 'low' ? 
                          brandConfig.colors.successGreen : 
                          metaAnalysisResult.analysisResult.summary.alertLevel === 'medium' ? 
                          brandConfig.colors.alertAmber : 
                          brandConfig.colors.errorRed,
                        fontWeight: brandConfig.typography.weightSemiBold,
                        textTransform: 'uppercase'
                      }}>
                        {metaAnalysisResult.analysisResult.summary.alertLevel}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis Text */}
          {metaAnalysisResult.analysisResult?.summary?.detailedAnalysis && (
            <div 
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.pastureSage + '20',
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <h5 style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontWeight: brandConfig.typography.weightSemiBold,
                marginBottom: brandConfig.spacing.sm
              }}>
                📋 Detailed Assessment
              </h5>
              <p style={{ 
                color: brandConfig.colors.neutralGray,
                lineHeight: '1.6',
                fontSize: brandConfig.typography.fontSizeSm
              }}>
                {metaAnalysisResult.analysisResult.summary.detailedAnalysis}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {metaAnalysisResult.analysisResult?.summary?.recommendations && metaAnalysisResult.analysisResult.summary.recommendations.length > 0 && (
            <div 
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.ribbonBlue + '20',
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <h5 style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontWeight: brandConfig.typography.weightSemiBold,
                marginBottom: brandConfig.spacing.sm
              }}>
                💡 AI Recommendations
              </h5>
              <ul className="space-y-2">
                {metaAnalysisResult.analysisResult.summary.recommendations.slice(0, 5).map((rec: string, index: number) => (
                  <li 
                    key={index}
                    style={{ 
                      color: brandConfig.colors.neutralGray,
                      fontSize: brandConfig.typography.fontSizeSm
                    }}
                    className="flex items-start gap-2"
                  >
                    <span style={{ color: brandConfig.colors.ribbonBlue }}>•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div 
            className="mt-4 p-3 rounded-lg text-center"
            style={{
              backgroundColor: brandConfig.colors.successGreen + '20',
              borderRadius: brandConfig.layout.borderRadius
            }}
          >
            <p style={{ 
              color: brandConfig.colors.stableMahogany, 
              fontWeight: brandConfig.typography.weightSemiBold,
              fontSize: brandConfig.typography.fontSizeSm
            }}>
              ✅ Meta-analysis complete! This represents the synthesis of all 10 photo analyses using advanced AI.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Analysis Viewer */}
      {(analysisResults.length > 0 || metaAnalysisResult) && (
        <div 
          className="p-6 rounded-2xl shadow-lg border"
          style={{
            backgroundColor: brandConfig.colors.pastureSage + '15',
            borderColor: brandConfig.colors.pastureSage + '40',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <h4 
            className="text-xl font-bold mb-4"
            style={{
              color: brandConfig.colors.stableMahogany,
              fontSize: brandConfig.typography.fontSizeXl,
              fontWeight: brandConfig.typography.weightBold
            }}
          >
            🔍 Detailed Analysis Viewer
          </h4>

          {/* Analysis Selection Dropdown */}
          <div className="mb-6">
            <label 
              style={{ 
                color: brandConfig.colors.stableMahogany, 
                fontSize: brandConfig.typography.fontSizeSm,
                fontWeight: brandConfig.typography.weightSemiBold,
                marginBottom: brandConfig.spacing.sm,
                display: 'block'
              }}
            >
              📋 Select Analysis to View:
            </label>
            <select
              value={selectedAnalysisItem}
              onChange={(e) => setSelectedAnalysisItem(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              style={{
                borderColor: brandConfig.colors.neutralGray + '50',
                fontSize: brandConfig.typography.fontSizeBase,
                borderRadius: brandConfig.layout.borderRadius,
                backgroundColor: brandConfig.colors.barnWhite
              }}
            >
              <option value="">Select an analysis to view details...</option>
              {getAnalysisDropdownOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Analysis Display */}
          {selectedAnalysisItem && getSelectedAnalysisData() && (
            <div className="space-y-4">
              {/* View Toggle Buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setShowRawData(false)}
                  className="px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: !showRawData ? brandConfig.colors.successGreen : brandConfig.colors.neutralGray + '30',
                    color: !showRawData ? brandConfig.colors.barnWhite : brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeSm,
                    borderRadius: brandConfig.layout.borderRadius,
                    fontWeight: brandConfig.typography.weightSemiBold
                  }}
                >
                  📖 Human Readable
                </button>
                <button
                  onClick={() => setShowRawData(true)}
                  className="px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: showRawData ? brandConfig.colors.ribbonBlue : brandConfig.colors.neutralGray + '30',
                    color: showRawData ? brandConfig.colors.barnWhite : brandConfig.colors.stableMahogany,
                    fontSize: brandConfig.typography.fontSizeSm,
                    borderRadius: brandConfig.layout.borderRadius,
                    fontWeight: brandConfig.typography.weightSemiBold
                  }}
                >
                  🔧 Raw AI Data
                </button>
              </div>

              {/* Analysis Content */}
              <div 
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: brandConfig.colors.barnWhite,
                  borderColor: showRawData ? brandConfig.colors.ribbonBlue + '30' : brandConfig.colors.successGreen + '30',
                  borderRadius: brandConfig.layout.borderRadius,
                  borderWidth: '2px'
                }}
              >
                {/* Header */}
                <div className="mb-4 pb-4 border-b" style={{ borderBottomColor: brandConfig.colors.neutralGray + '30' }}>
                  <h5 
                    className="text-lg font-semibold"
                    style={{
                      color: brandConfig.colors.stableMahogany,
                      fontSize: brandConfig.typography.fontSizeLg,
                      fontWeight: brandConfig.typography.weightSemiBold
                    }}
                  >
                    {selectedAnalysisItem === 'meta_analysis' ? 
                      '🧠 Final Meta-Analysis Results' : 
                      `📸 Photo #${selectedAnalysisItem.replace('photo_', '')} Analysis`
                    }
                  </h5>
                  <p style={{ 
                    color: brandConfig.colors.neutralGray, 
                    fontSize: brandConfig.typography.fontSizeSm,
                    marginTop: brandConfig.spacing.xs
                  }}>
                    {selectedAnalysisItem === 'meta_analysis' ? 
                      'AI synthesis of all 10 photo analyses' :
                      `Captured at ${new Date(getSelectedAnalysisData()?.timestamp).toLocaleString()}`
                    }
                  </p>
                </div>

                {/* Content Display */}
                <div className="space-y-4">
                  {showRawData ? (
                    /* Raw Data Display */
                    <div>
                      <h6 
                        style={{
                          color: brandConfig.colors.ribbonBlue,
                          fontSize: brandConfig.typography.fontSizeBase,
                          fontWeight: brandConfig.typography.weightSemiBold,
                          marginBottom: brandConfig.spacing.sm
                        }}
                      >
                        🔧 Raw AI Response Data:
                      </h6>
                      <div 
                        className="p-4 rounded-lg overflow-auto"
                        style={{
                          backgroundColor: brandConfig.colors.neutralGray + '10',
                          borderRadius: brandConfig.layout.borderRadius,
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          fontSize: '12px',
                          maxHeight: '500px'
                        }}
                      >
                        <pre style={{ 
                          color: brandConfig.colors.neutralGray,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          margin: 0
                        }}>
                          {JSON.stringify(
                            selectedAnalysisItem === 'meta_analysis' ? 
                              getSelectedAnalysisData()?.analysisResult : 
                              getSelectedAnalysisData()?.analysisResult, 
                            null, 
                            2
                          )}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    /* Human Readable Display */
                    <div>
                      <h6 
                        style={{
                          color: brandConfig.colors.successGreen,
                          fontSize: brandConfig.typography.fontSizeBase,
                          fontWeight: brandConfig.typography.weightSemiBold,
                          marginBottom: brandConfig.spacing.sm
                        }}
                      >
                        📖 Human-Readable Analysis:
                      </h6>
                      <div 
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: brandConfig.colors.successGreen + '10',
                          borderRadius: brandConfig.layout.borderRadius,
                          lineHeight: '1.6'
                        }}
                      >
                        <div style={{ 
                          color: brandConfig.colors.neutralGray,
                          whiteSpace: 'pre-line',
                          fontSize: brandConfig.typography.fontSizeSm
                        }}>
                          {selectedAnalysisItem === 'meta_analysis' ? 
                            formatAdvancedAnalysisForHumans(getSelectedAnalysisData()?.analysisResult?.summary) :
                            formatAnalysisForHumans(getSelectedAnalysisData()?.analysisResult)
                          }
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info for Photos */}
                  {selectedAnalysisItem !== 'meta_analysis' && getSelectedAnalysisData()?.frameData && (
                    <div>
                      <h6 
                        style={{
                          color: brandConfig.colors.championGold,
                          fontSize: brandConfig.typography.fontSizeBase,
                          fontWeight: brandConfig.typography.weightSemiBold,
                          marginBottom: brandConfig.spacing.sm
                        }}
                      >
                        📸 Captured Frame:
                      </h6>
                      <div 
                        className="p-4 rounded-lg text-center"
                        style={{
                          backgroundColor: brandConfig.colors.championGold + '10',
                          borderRadius: brandConfig.layout.borderRadius
                        }}
                      >
                        <img 
                          src={getSelectedAnalysisData()?.frameData} 
                          alt={`Frame ${selectedAnalysisItem.replace('photo_', '')}`}
                          className="max-w-full h-auto rounded-lg border"
                          style={{
                            maxWidth: '400px',
                            borderColor: brandConfig.colors.championGold + '50'
                          }}
                        />
                        <p style={{ 
                          color: brandConfig.colors.neutralGray, 
                          fontSize: brandConfig.typography.fontSizeXs,
                          marginTop: brandConfig.spacing.sm
                        }}>
                          Frame analyzed by AI vision system
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {!selectedAnalysisItem && (
            <div 
              className="p-6 text-center rounded-lg"
              style={{
                backgroundColor: brandConfig.colors.neutralGray + '10',
                borderRadius: brandConfig.layout.borderRadius
              }}
            >
              <p style={{ 
                color: brandConfig.colors.neutralGray,
                fontSize: brandConfig.typography.fontSizeBase
              }}>
                👆 Select an analysis from the dropdown above to view detailed results
              </p>
            </div>
          )}
        </div>
      )}

      {/* Demo Disclaimers and Information */}
      <div className="space-y-3">
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: brandConfig.colors.championGold + '20',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <p style={{ 
            color: brandConfig.colors.stableMahogany, 
            fontWeight: brandConfig.typography.weightSemiBold,
            fontSize: brandConfig.typography.fontSizeSm
          }}>
            🎯 {demoConfig.header.description}
          </p>
        </div>
        
        <div 
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: brandConfig.colors.ribbonBlue + '15',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <p style={{ 
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeXs,
            fontStyle: 'italic'
          }}>
            ⚠️ {demoConfig.messages.demoDisclaimer}
          </p>
        </div>
        
        <div 
          className="p-3 rounded-lg"
          style={{ 
            backgroundColor: brandConfig.colors.pastureSage + '15',
            borderRadius: brandConfig.layout.borderRadius
          }}
        >
          <p style={{ 
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeXs,
            fontStyle: 'italic'
          }}>
            🏥 {demoConfig.messages.aiLimitations}
          </p>
        </div>
      </div>
    </div>
  );
};
