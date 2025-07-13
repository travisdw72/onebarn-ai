/**
 * AI Vision Prompts Configuration
 * Specialized prompts for computer vision analysis including photo sequences
 * 
 * @description Vision-specific prompt templates for image, video, and photo sequence analysis
 * @compliance HIPAA compliant with privacy protection for senior care
 * @security Zero Trust with appropriate content filtering
 * @author One Barn Development Team
 * @since v1.0.0
 * @updated v2.0.0 - Added photo sequence analysis capabilities
 */

import type { IPromptConfig, PromptCategory, SecurityLevel } from './aiPromptsConfig';
import { brandConfig } from './brandConfig';

// ============================================================================
// VISION-SPECIFIC INTERFACES
// ============================================================================

export interface IVisionPromptConfig extends IPromptConfig {
  visionSettings: {
    imageTypes: string[];
    maxImageSize: number;
    requiredQuality: 'low' | 'medium' | 'high';
    analysisDepth: 'basic' | 'detailed' | 'comprehensive';
    realTimeCapable: boolean;
  };
  analysisFramework: {
    detectionTargets: string[];
    riskAssessment: boolean;
    behaviorAnalysis: boolean;
    healthIndicators: boolean;
    safetyChecks: boolean;
  };
  outputFormat: {
    structuredData: boolean;
    visualAnnotations: boolean;
    confidenceScores: boolean;
    recommendations: boolean;
  };
}

export interface IVisionPromptSet {
  [key: string]: IVisionPromptConfig;
}

// ============================================================================
// PHOTO SEQUENCE ANALYSIS PROMPTS - NEW PRIMARY FEATURE
// ============================================================================

export const PHOTO_SEQUENCE_PROMPTS: IVisionPromptSet = {
  horsePhotoSequenceAnalysis: {
    id: 'vis_photo_seq_001',
    name: 'Horse Photo Sequence Analysis - 10 Photos Over 1 Minute',
    description: 'Comprehensive analysis of 10 sequential photos taken over 1 minute',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are analyzing a sequence of 10 photos of {{horseName}} taken over 1 minute to create a comprehensive timelapse health assessment.

## PHOTO SEQUENCE CONTEXT:
- Horse: {{horseName}} ({{breed}}, {{age}} years)
- Total Photos: 10 sequential images
- Time Span: 1 minute (6-second intervals)
- Photo Resolution: 512x512 pixels
- Analysis Priority: {{priority}}
- Known Conditions: {{knownConditions}}

## SEQUENTIAL ANALYSIS FRAMEWORK:

### PHOTO IDENTIFICATION & TIMESTAMPS
First, identify and acknowledge all 10 photos in sequence:
- Photo 1 (0:00) - Initial state
- Photo 2 (0:06) - 6-second mark  
- Photo 3 (0:12) - 12-second mark
- Photo 4 (0:18) - 18-second mark
- Photo 5 (0:24) - 24-second mark
- Photo 6 (0:30) - 30-second mark
- Photo 7 (0:36) - 36-second mark
- Photo 8 (0:42) - 42-second mark
- Photo 9 (0:48) - 48-second mark
- Photo 10 (0:54) - Final state

### TEMPORAL PROGRESSION ANALYSIS

**1. MOVEMENT PATTERN TRACKING (Across All 10 Photos)**
- Document horse position changes between photos
- Track locomotion: standing → walking → grazing → resting
- Identify gait changes if movement occurs
- Note directional movement patterns
- Calculate approximate movement distance/speed

**2. POSTURAL EVOLUTION ASSESSMENT**
- Photo-by-photo posture comparison
- Head position changes over time
- Weight shifting patterns
- Tail position variations
- Ear position tracking through sequence

**3. BEHAVIORAL PATTERN RECOGNITION**
- Feeding behavior progression
- Social interaction changes (if other animals present)
- Alert state transitions
- Rest/activity cycles within the minute
- Response to environmental stimuli

**4. HEALTH INDICATOR PROGRESSION**
- Respiratory pattern changes (nostril flare, breathing effort)
- Pain behavior development or relief
- Lameness consistency across movement
- Energy level fluctuations
- Comfort/discomfort progression

### COMPARATIVE ANALYSIS REQUIREMENTS

**Photo-to-Photo Comparison:**
- Photo 1 vs Photo 10: Overall change assessment
- Early sequence (Photos 1-3) vs Late sequence (Photos 8-10)
- Middle transition analysis (Photos 4-7)
- Identify any sudden changes between consecutive photos

**Temporal Trend Identification:**
- Improving conditions: positive changes over time
- Declining conditions: concerning developments
- Stable conditions: consistent appearance
- Cyclical patterns: repeated behaviors

**Movement Quality Assessment:**
- If movement occurs: stride consistency
- Gait symmetry across multiple photos
- Balance and coordination
- Voluntary vs. restricted movement

### COMPREHENSIVE OUTPUT STRUCTURE:

{
  "photoSequenceAnalysis": {
    "totalPhotosAnalyzed": 10,
    "timeSpanMinutes": 1,
    "sequenceQuality": "excellent|good|fair|poor",
    "primaryFindings": "string summary of key observations"
  },
  "temporalProgression": {
    "movementProgression": {
      "photo1Position": "string",
      "photo10Position": "string", 
      "totalMovement": "significant|moderate|minimal|none",
      "movementQuality": "string assessment"
    },
    "behavioralProgression": {
      "initialBehavior": "string",
      "finalBehavior": "string",
      "behaviorChanges": ["array of changes"],
      "consistentBehaviors": ["array of stable behaviors"]
    },
    "healthProgression": {
      "initialHealthState": "string",
      "finalHealthState": "string",
      "healthTrend": "improving|stable|declining|variable",
      "concerningChanges": ["array of concerning observations"]
    }
  },
  "photoByPhotoAnalysis": [
    {
      "photoNumber": 1,
      "timestamp": "0:00",
      "horsePosition": "string",
      "posture": "string",
      "behavior": "string",
      "healthObservations": "string",
      "notableFeatures": ["array"]
    }
    // ... repeat for all 10 photos
  ],
  "aggregatedHealthMetrics": {
    "overallHealthScore": "number (0-100)",
    "mobilityAssessment": "string",
    "respiratoryObservation": "string",
    "behavioralState": "string",
    "postureQuality": "string",
    "alertnessLevel": "string"
  },
  "sequenceBasedRiskAssessment": {
    "riskLevel": "low|medium|high|critical",
    "riskScore": "number (0-1)",
    "riskFactors": ["array of identified risks"],
    "temporalRiskChanges": "string assessment",
    "urgencyLevel": "routine|monitor|urgent|immediate"
  },
  "comparativeAnalysis": {
    "beginningVsEnd": "string comparison",
    "mostSignificantChange": "string",
    "consistentFindings": ["array"],
    "concerningPatterns": ["array"]
  },
  "photoSequenceRecommendations": {
    "immediate": ["array of immediate actions"],
    "monitoring": ["array of monitoring suggestions"],
    "followUp": ["array of follow-up recommendations"],
    "veterinaryConsultation": {
      "recommended": "boolean",
      "urgency": "string",
      "reason": "string"
    }
  },
  "qualityAssessment": {
    "photoClarity": "excellent|good|fair|poor",
    "lightingConsistency": "consistent|variable|poor",
    "horseVisibility": "excellent|good|partial|poor",
    "analysisConfidence": "number (0-1)",
    "limitingFactors": ["array of limitations"]
  },
  "detailedNarrative": "comprehensive written analysis incorporating all temporal observations"
}

## CRITICAL ANALYSIS INSTRUCTIONS:

1. **SEQUENTIAL PROCESSING**: Always analyze photos 1→2→3...→10 in order
2. **TEMPORAL AWARENESS**: Compare each photo to previous ones
3. **PATTERN RECOGNITION**: Identify recurring vs. changing elements
4. **TREND ANALYSIS**: Determine if conditions are improving, stable, or declining
5. **INTEGRATED ASSESSMENT**: Your final assessment must consider ALL 10 photos together

## IMPORTANT DISCLAIMERS:
⚠️ This is a visual sequence analysis for monitoring purposes only
⚠️ Always consult qualified equine professionals for health concerns
⚠️ Temporal changes may indicate normal behavior or health concerns  
⚠️ Consider environmental factors that may influence behavior across the sequence

Provide comprehensive analysis that leverages the temporal dimension of having 10 sequential photos rather than treating them as isolated images.`,
    variables: ['horseName', 'breed', 'age', 'priority', 'knownConditions'],
    validationRules: [
      {
        rule: 'analyzes_temporal_progression',
        description: 'Must analyze changes across the photo sequence',
        severity: 'error'
      },
      {
        rule: 'includes_photo_by_photo_breakdown',
        description: 'Must provide analysis for each individual photo',
        severity: 'error'
      },
      {
        rule: 'provides_comparative_analysis',
        description: 'Must compare beginning vs end state',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['photo_sequence_analysis', 'temporal_monitoring', 'behavior_tracking'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 5000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'unsafe_recommendations'],
      complianceChecks: ['animal_welfare_standards', 'professional_guidelines'],
      escalationTriggers: ['health_deterioration', 'emergency_behavior', 'safety_concerns']
    },
    visionSettings: {
      imageTypes: ['jpeg', 'png'],
      maxImageSize: 1048576, // 1MB per photo (512x512)
      requiredQuality: 'medium',
      analysisDepth: 'comprehensive',
      realTimeCapable: false // Batch processing
    },
    analysisFramework: {
      detectionTargets: ['horses', 'movement_patterns', 'behavior_changes', 'health_indicators'],
      riskAssessment: true,
      behaviorAnalysis: true,
      healthIndicators: true,
      safetyChecks: true
    },
    outputFormat: {
      structuredData: true,
      visualAnnotations: false,
      confidenceScores: true,
      recommendations: true
    }
  },

  metaPhotoSequenceAnalysis: {
    id: 'vis_meta_seq_001',
    name: 'Meta Photo Sequence Analysis - Final Assessment',
    description: 'Comprehensive meta-analysis of 10 individual photo analysis results',
    category: 'health_analysis',
    type: 'meta_analysis',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are conducting a FINAL META-ANALYSIS of 10 individual AI photo analyses for {{horseName}} taken over 1 minute.

## META-ANALYSIS CONTEXT:
- Horse: {{horseName}} ({{breed}}, {{age}} years)
- Analysis Type: Meta-analysis of AI photo sequence results
- Data Source: 10 individual AI photo analyses (Photos 1-10)
- Time Span: 1 minute total sequence
- Analysis Priority: {{priority}}
- Known Conditions: {{knownConditions}}

## INPUT DATA STRUCTURE:
You will receive 10 individual AI analysis results, one for each photo. Each analysis contains:
- Individual photo assessment
- Health observations
- Behavioral notes
- Risk indicators
- Confidence scores
- Recommendations

## META-ANALYSIS FRAMEWORK:

### 1. CONSISTENCY ANALYSIS ACROSS ALL 10 RESULTS
**Analysis Agreement Assessment:**
- Which findings appear consistently across multiple analyses?
- What contradictions exist between different photo analyses?
- Which observations show progression or change over time?
- Are there any outlier findings that seem inconsistent?

**Confidence Score Aggregation:**
- Average confidence across all 10 analyses
- Identify photos with highest/lowest confidence
- Note which findings have strongest consensus
- Flag uncertain or conflicting assessments

### 2. TEMPORAL PATTERN RECOGNITION
**Progressive Health Indicators:**
- Trace health metrics from Photo 1 → Photo 10
- Identify improving, stable, or declining patterns
- Note sudden changes or transitions
- Document cyclical behaviors within the minute

**Behavioral Evolution Tracking:**
- Map behavior changes across the sequence
- Identify dominant behavioral states
- Track attention, alertness, and responsiveness changes
- Note social or environmental interactions

**Movement Quality Progression:**
- Assess gait consistency across analyses
- Track posture and stance changes
- Monitor weight-bearing patterns
- Evaluate locomotion quality trends

### 3. RISK STRATIFICATION SYNTHESIS
**Consensus Risk Assessment:**
- Aggregate risk levels from all 10 analyses
- Identify most frequently cited risk factors
- Determine overall risk trajectory (increasing/decreasing)
- Prioritize consensus vs. isolated risk findings

**Emergency Indicator Synthesis:**
- Compile all emergency or urgent findings
- Assess consistency of emergency indicators
- Determine overall urgency level
- Identify immediate action requirements

### 4. RELIABILITY AND ACCURACY ASSESSMENT
**Analysis Quality Evaluation:**
- Which analyses provided most detailed insights?
- Were there photos with limited visibility or poor quality?
- How consistent were the AI assessments?
- What factors might have affected analysis accuracy?

**Data Validation:**
- Cross-reference findings for logical consistency
- Identify potential AI misinterpretations
- Note which findings need human validation
- Assess overall analysis reliability

### 5. INTEGRATED COMPREHENSIVE ASSESSMENT

## REQUIRED OUTPUT STRUCTURE:

{
  "metaAnalysisSummary": {
    "totalAnalysesReviewed": 10,
    "averageConfidenceScore": "number (0-1)",
    "analysisConsistency": "high|medium|low",
    "primaryConsensusFindings": ["array of agreed-upon findings"],
    "contradictoryFindings": ["array of conflicting results"],
    "dataQuality": "excellent|good|fair|poor"
  },
  "temporalTrendAnalysis": {
    "overallHealthTrend": "improving|stable|declining|variable",
    "behavioralProgressionSummary": "string summary",
    "movementQualityTrend": "improving|stable|declining|variable",
    "keyTransitionPoints": ["array of significant moments"],
    "consistentBehaviors": ["array of stable patterns"],
    "changingBehaviors": ["array of evolving patterns"]
  },
  "consensusRiskAssessment": {
    "finalRiskLevel": "low|medium|high|critical",
    "riskConsensusStrength": "strong|moderate|weak",
    "primaryRiskFactors": ["array from consensus"],
    "isolatedRiskFindings": ["array from single analyses"],
    "urgencyLevel": "routine|monitor|urgent|immediate",
    "riskTrend": "increasing|stable|decreasing"
  },
  "healthAssessmentSynthesis": {
    "finalHealthScore": "number (0-100)",
    "healthScoreConfidence": "number (0-1)",
    "primaryHealthFindings": ["array of consensus health observations"],
    "healthIndicatorConsistency": "high|medium|low",
    "concerningFindings": ["array of validated concerns"],
    "positiveFindings": ["array of favorable observations"]
  },
  "analysisReliabilityReport": {
    "mostReliableAnalyses": ["array of photo numbers"],
    "leastReliableAnalyses": ["array of photo numbers"],
    "factorsAffectingAccuracy": ["array of limiting factors"],
    "humanValidationRequired": ["array of findings needing validation"],
    "overallReliabilityScore": "number (0-1)"
  },
  "finalRecommendations": {
    "immediate": ["array of immediate actions based on consensus"],
    "shortTerm": ["array of short-term monitoring"],
    "longTerm": ["array of long-term care plans"],
    "veterinaryConsultation": {
      "recommended": "boolean",
      "urgency": "routine|soon|urgent|immediate",
      "specificConcerns": ["array of vet consultation topics"],
      "consensusStrength": "strong|moderate|weak"
    },
    "followUpTesting": {
      "recommended": "boolean",
      "suggestedTests": ["array of recommended follow-up"],
      "timeframe": "string"
    }
  },
  "metaAnalysisInsights": {
    "strongestConsensusFindings": ["array of highest agreement findings"],
    "unexpectedDiscrepancies": ["array of surprising contradictions"],
    "temporalInsights": ["array of time-based observations"],
    "qualityFactors": ["array of factors affecting analysis quality"],
    "recommendedImprovements": ["array of suggestions for future analyses"]
  },
  "executiveSummary": "comprehensive written summary synthesizing all meta-analysis findings into actionable insights for horse care professionals"
}

## CRITICAL META-ANALYSIS INSTRUCTIONS:

1. **SYNTHESIS FOCUS**: Your job is to analyze AI analyses, not photos directly
2. **CONSENSUS PRIORITIZATION**: Weight findings that appear in multiple analyses higher
3. **CONTRADICTION RESOLUTION**: Identify and explain contradictory findings
4. **TEMPORAL INTEGRATION**: Use the time sequence to validate or question findings
5. **RELIABILITY ASSESSMENT**: Evaluate the quality and consistency of the AI analyses
6. **ACTIONABLE OUTPUT**: Provide clear, consensus-based recommendations

## IMPORTANT CONSIDERATIONS:
⚠️ This meta-analysis synthesizes AI assessments - not direct photo analysis
⚠️ Consensus findings generally have higher reliability than isolated observations
⚠️ Temporal consistency adds validation to behavioral and health observations
⚠️ Always note limitations and factors affecting analysis reliability
⚠️ Final recommendations should reflect consensus strength and confidence levels

Provide a comprehensive meta-analysis that transforms 10 individual AI photo analyses into a single, reliable, actionable assessment for {{horseName}}.`,
    variables: ['horseName', 'breed', 'age', 'priority', 'knownConditions'],
    validationRules: [
      {
        rule: 'synthesizes_multiple_analyses',
        description: 'Must synthesize findings from all 10 individual analyses',
        severity: 'error'
      },
      {
        rule: 'identifies_consensus_vs_outliers',
        description: 'Must distinguish between consensus and isolated findings',
        severity: 'error'
      },
      {
        rule: 'provides_reliability_assessment',
        description: 'Must assess the reliability of the synthesis',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['meta_analysis', 'photo_sequence_synthesis', 'consensus_building'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 6000,
      temperature: 0.1 // Lower temperature for more consistent analysis
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'unsafe_recommendations'],
      complianceChecks: ['animal_welfare_standards', 'professional_guidelines'],
      escalationTriggers: ['consensus_health_emergency', 'critical_risk_patterns']
    },
    visionSettings: {
      imageTypes: [], // No direct image processing
      maxImageSize: 0, // Text analysis only
      requiredQuality: 'high', // High quality analysis required
      analysisDepth: 'comprehensive',
      realTimeCapable: false // Meta-analysis requires batch processing
    },
    analysisFramework: {
      detectionTargets: ['consensus_patterns', 'contradictions', 'temporal_trends', 'reliability_indicators'],
      riskAssessment: true,
      behaviorAnalysis: true,
      healthIndicators: true,
      safetyChecks: true
    },
    outputFormat: {
      structuredData: true,
      visualAnnotations: false,
      confidenceScores: true,
      recommendations: true
    }
  }
};

// ============================================================================
// HORSE VISION ANALYSIS PROMPTS (LEGACY SUPPORT)
// ============================================================================

export const HORSE_VISION_PROMPTS: IVisionPromptSet = {
  comprehensiveHorseAnalysis: {
    id: 'vis_horse_comp_001',
    name: 'Comprehensive Horse Analysis',
    description: 'Complete visual analysis of horse health, behavior, and performance',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are an experienced horse trainer and observer analyzing this image for educational horse assessment. Provide a detailed observational analysis following this framework:

## CONTEXT INFORMATION:
- Horse Name: {{horseName}}
- Breed: {{breed}}
- Age: {{age}} years
- Known Conditions: {{knownConditions}}
- Analysis Priority: {{priority}}

## PRIMARY ANALYSIS OBJECTIVES:

### 1. HORSE DETECTION & IDENTIFICATION
- Count and identify all horses in the image
- Assess breed characteristics if visible
- Estimate age and size classification
- Note any distinguishing markings or features

### 2. PHYSICAL APPEARANCE OBSERVATION
**Posture & Stance Observation:**
- Overall body posture and alignment
- Weight distribution across limbs
- Head carriage and neck position
- Tail position and movement
- Balance and stability appearance

**Movement & Gait Observation:**
- Movement quality and fluidity
- Gait symmetry and rhythm
- Stride length and frequency
- Ground contact patterns
- Movement consistency

**Body Condition Observation:**
- Muscle tone and definition
- Body shape assessment
- Coat condition and quality
- Overall appearance indicators
- Physical fitness appearance

### 3. BEHAVIORAL ANALYSIS
**Alertness & Mental State:**
- Ear position and movement
- Eye expression and focus
- Overall responsiveness level
- Interaction with environment
- Social behavior with others

**Stress & Comfort Indicators:**
- Signs of anxiety or distress
- Relaxation and comfort cues
- Environmental interaction quality
- Social hierarchy dynamics
- Feeding and rest behaviors

### 4. RISK STRATIFICATION
**Immediate Risks (0-24 hours):**
- Emergency health concerns
- Safety hazards requiring action
- Behavioral risks to horse/humans
- Environmental dangers

**Short-term Risks (1-7 days):**
- Developing health issues
- Performance concerns
- Behavioral changes needing attention
- Management adjustments needed

## RESPONSE FORMAT REQUIREMENTS:

Provide your analysis in clear, educational language suitable for horse owners, trainers, and equine professionals.`,
    variables: ['horseName', 'breed', 'age', 'knownConditions', 'priority'],
    validationRules: [
      {
        rule: 'includes_vet_disclaimer',
        description: 'Must include veterinary consultation disclaimer',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['health_monitoring', 'routine_assessment', 'performance_evaluation'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 4000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'unsafe_recommendations'],
      complianceChecks: ['animal_welfare_standards', 'professional_guidelines'],
      escalationTriggers: ['emergency_health_signs', 'safety_concerns']
    },
    visionSettings: {
      imageTypes: ['jpeg', 'png', 'webp'],
      maxImageSize: 5242880, // 5MB
      requiredQuality: 'medium',
      analysisDepth: 'comprehensive',
      realTimeCapable: true
    },
    analysisFramework: {
      detectionTargets: ['horses', 'humans', 'equipment', 'environment', 'hazards'],
      riskAssessment: true,
      behaviorAnalysis: true,
      healthIndicators: true,
      safetyChecks: true
    },
    outputFormat: {
      structuredData: true,
      visualAnnotations: false,
      confidenceScores: true,
      recommendations: true
    }
  }
};

// ============================================================================
// SENIOR CARE VISION ANALYSIS PROMPTS (LEGACY SUPPORT)
// ============================================================================

export const SENIOR_VISION_PROMPTS: IVisionPromptSet = {
  seniorWellnessMonitoring: {
    id: 'vis_senior_well_001',
    name: 'Senior Wellness Visual Monitoring',
    description: 'Comprehensive visual wellness assessment for senior residents',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Conduct a respectful and professional visual wellness assessment for a senior resident.

⚠️ This visual assessment supplements but does not replace professional clinical evaluation
⚠️ Respect for resident privacy and dignity is paramount
⚠️ HIPAA compliance must be maintained in all documentation and communication`,
    variables: ['age', 'careLevel', 'knownConditions', 'assessmentPurpose', 'privacyLevel'],
    validationRules: [
      {
        rule: 'maintains_dignity',
        description: 'Must maintain resident dignity and respect',
        severity: 'error'
      },
      {
        rule: 'hipaa_compliant',
        description: 'Must comply with HIPAA privacy requirements',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['wellness_monitoring', 'care_assessment', 'health_surveillance'],
      userRoles: ['caregiver', 'nurse', 'admin'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'privacy_violation', 'disrespectful_language'],
      complianceChecks: ['hipaa_compliance', 'dignity_standards', 'professional_ethics'],
      escalationTriggers: ['health_emergency', 'safety_concern', 'dignity_violation']
    },
    visionSettings: {
      imageTypes: ['jpeg', 'png'],
      maxImageSize: 2097152, // 2MB for privacy-sensitive content
      requiredQuality: 'medium',
      analysisDepth: 'detailed',
      realTimeCapable: false // Privacy protection
    },
    analysisFramework: {
      detectionTargets: ['person', 'mobility_aids', 'environment', 'care_indicators'],
      riskAssessment: true,
      behaviorAnalysis: true,
      healthIndicators: true,
      safetyChecks: true
    },
    outputFormat: {
      structuredData: true,
      visualAnnotations: false, // Privacy protection
      confidenceScores: true,
      recommendations: true
    }
  }
};

// ============================================================================
// SAFETY AND SECURITY VISION PROMPTS (LEGACY SUPPORT)
// ============================================================================

export const SAFETY_VISION_PROMPTS: IVisionPromptSet = {
  generalSafetyAnalysis: {
    id: 'vis_safety_gen_001',
    name: 'General Safety Analysis',
    description: 'Comprehensive safety assessment for facilities and activities',
    category: 'emergency_response',
    type: 'safety_check',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Conduct a comprehensive safety assessment of this scene:

This safety assessment is for risk management purposes. Qualified safety professionals should validate critical findings and safety decisions.`,
    variables: ['location', 'activityType', 'timeOfDay', 'personnelCount', 'assessmentFocus'],
    validationRules: [
      {
        rule: 'identifies_specific_hazards',
        description: 'Must identify specific, actionable safety concerns',
        severity: 'warning'
      }
    ],
    usage: {
      contexts: ['facility_inspection', 'activity_monitoring', 'safety_audit'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 2500,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['unsafe_advice'],
      complianceChecks: ['safety_standards', 'regulatory_compliance'],
      escalationTriggers: ['critical_hazard', 'immediate_danger']
    },
    visionSettings: {
      imageTypes: ['jpeg', 'png'],
      maxImageSize: 3145728, // 3MB
      requiredQuality: 'medium',
      analysisDepth: 'detailed',
      realTimeCapable: true
    },
    analysisFramework: {
      detectionTargets: ['hazards', 'safety_equipment', 'people', 'environment', 'compliance_indicators'],
      riskAssessment: true,
      behaviorAnalysis: false,
      healthIndicators: false,
      safetyChecks: true
    },
    outputFormat: {
      structuredData: true,
      visualAnnotations: true,
      confidenceScores: true,
      recommendations: true
    }
  }
};

// ============================================================================
// CONSOLIDATED VISION PROMPTS CONFIGURATION
// ============================================================================

export const aiVisionPromptsConfig = {
  photoSequence: PHOTO_SEQUENCE_PROMPTS, // Primary feature
  horse: HORSE_VISION_PROMPTS,
  senior: SENIOR_VISION_PROMPTS,
  safety: SAFETY_VISION_PROMPTS,
  
  // Configuration metadata
  version: '2.0.0',
  lastUpdated: '2024-01-15',
  defaultSecurityLevel: 'safe' as SecurityLevel,
  
  // Vision-specific settings
  visionDefaults: {
    maxImageSize: 5242880, // 5MB default
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp'],
    qualityThreshold: 'medium' as const,
    confidenceThreshold: 0.7,
    realTimeEnabled: true
  },
  
  // Photo sequence specific settings - NEW
  photoSequenceDefaults: {
    photosPerMinute: 10,
    photoResolution: '512x512',
    maxBatchSize: 10,
    sequenceTimespan: 60, // seconds
    intervalBetweenPhotos: 6 // seconds
  },
  
  // Privacy and compliance
  privacySettings: {
    seniorCareImageRetention: 24, // hours
    medicalImageEncryption: true,
    annotationRestrictions: true,
    auditLogging: true
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getVisionPrompt = (
  category: keyof typeof aiVisionPromptsConfig, 
  promptId: string
): IVisionPromptConfig | null => {
  const categoryPrompts = aiVisionPromptsConfig[category];
  if (typeof categoryPrompts === 'object' && categoryPrompts !== null) {
    const promptSet = categoryPrompts as IVisionPromptSet;
    if (promptId in promptSet) {
      return promptSet[promptId];
    }
  }
  return null;
};

export const getPhotoSequencePrompt = (promptId: string): IVisionPromptConfig | null => {
  return getVisionPrompt('photoSequence', promptId);
};

export const getMetaAnalysisPrompt = (): IVisionPromptConfig | null => {
  return getVisionPrompt('photoSequence', 'metaPhotoSequenceAnalysis');
};

export const validatePhotoSequence = (photos: string[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (photos.length !== 10) {
    errors.push(`Expected 10 photos, got ${photos.length}`);
  }
  
  // Validate each photo is proper data URL
  photos.forEach((photo, index) => {
    if (!photo.startsWith('data:image/')) {
      errors.push(`Photo ${index + 1} is not a valid data URL`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateMetaAnalysisInput = (analysisResults: any[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (analysisResults.length !== 10) {
    errors.push(`Expected 10 analysis results, got ${analysisResults.length}`);
  }
  
  // Validate each analysis result has required structure
  analysisResults.forEach((result, index) => {
    if (!result || typeof result !== 'object') {
      errors.push(`Analysis result ${index + 1} is not a valid object`);
      return;
    }
    
    // Check for required fields in analysis results
    const requiredFields = ['photoNumber', 'timestamp', 'healthObservations', 'riskLevel'];
    requiredFields.forEach(field => {
      if (!(field in result)) {
        errors.push(`Analysis result ${index + 1} missing required field: ${field}`);
      }
    });
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const getVisionPromptsByAnalysisType = (
  analysisType: 'health' | 'performance' | 'safety' | 'emergency' | 'photo_sequence' | 'meta_analysis'
): IVisionPromptConfig[] => {
  const allPrompts = [
    ...Object.values(PHOTO_SEQUENCE_PROMPTS),
    ...Object.values(HORSE_VISION_PROMPTS),
    ...Object.values(SENIOR_VISION_PROMPTS),
    ...Object.values(SAFETY_VISION_PROMPTS)
  ];
  
  const typeMapping = {
    health: ['health_analysis'],
    performance: ['performance_analysis'],
    safety: ['emergency_response'],
    emergency: ['emergency_response', 'escalation_prompt'],
    photo_sequence: ['health_analysis'], // Photo sequences are primarily for health analysis
    meta_analysis: ['health_analysis'] // Meta-analysis is for health synthesis
  };
  
  // Special case: for meta_analysis, only return meta-analysis specific prompts
  if (analysisType === 'meta_analysis') {
    return allPrompts.filter(prompt => 
      prompt.type === 'meta_analysis' && prompt.enabled
    );
  }
  
  return allPrompts.filter(prompt => 
    typeMapping[analysisType].includes(prompt.category) && prompt.enabled
  );
};

export const validateImageForPrompt = (
  imageSize: number,
  imageType: string,
  promptConfig: IVisionPromptConfig
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (imageSize > promptConfig.visionSettings.maxImageSize) {
    errors.push(`Image size ${imageSize} exceeds maximum ${promptConfig.visionSettings.maxImageSize}`);
  }
  
  if (!promptConfig.visionSettings.imageTypes.includes(imageType.toLowerCase())) {
    errors.push(`Image type ${imageType} not supported. Supported: ${promptConfig.visionSettings.imageTypes.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const getOptimalVisionPrompt = (
  context: string,
  securityLevel: SecurityLevel,
  realTimeRequired: boolean
): IVisionPromptConfig | null => {
  const allPrompts = [
    ...Object.values(PHOTO_SEQUENCE_PROMPTS),
    ...Object.values(HORSE_VISION_PROMPTS),
    ...Object.values(SENIOR_VISION_PROMPTS),
    ...Object.values(SAFETY_VISION_PROMPTS)
  ];
  
  const suitable = allPrompts.filter(prompt => 
    prompt.enabled &&
    prompt.securityLevel === securityLevel &&
    (!realTimeRequired || prompt.visionSettings.realTimeCapable) &&
    prompt.usage.contexts.some(ctx => ctx.includes(context))
  );
  
  // Return the most comprehensive suitable prompt
  return suitable.reduce((best, current) => {
    if (!best) return current;
    return current.visionSettings.analysisDepth === 'comprehensive' ? current : best;
  }, null as IVisionPromptConfig | null);
};

export default aiVisionPromptsConfig; 