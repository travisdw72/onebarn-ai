/**
 * AI Prompts Configuration - Single Source of Truth
 * Comprehensive prompt management for all equine AI interactions
 * 
 * @description Centralized prompt configuration for equine AI services with enhanced video analysis
 * @compliance Data privacy compliant prompts with safety guidelines
 * @security Context-aware prompts with appropriate restrictions for equine care
 * @author One Barn Development Team
 * @since v1.0.0
 * @updated v2.0.0 - Added advanced equine video analysis capabilities
 */

import { brandConfig } from './brandConfig';

// ============================================================================
// PROMPT CATEGORIES AND TYPES
// ============================================================================

export type PromptCategory = 
  | 'horse_training' 
  | 'health_analysis' 
  | 'behavioral_analysis' 
  | 'performance_analysis' 
  | 'financial_analysis' 
  | 'emergency_response' 
  | 'general_chat' 
  | 'compliance_audit'
  | 'video_analysis';  // Added for video monitoring

export type PromptType = 
  | 'system' 
  | 'user_context' 
  | 'analysis_template' 
  | 'safety_check' 
  | 'response_template' 
  | 'escalation_prompt'
  | 'video_assessment'  // Added for video-specific prompts
  | 'baseline_establishment'  // Added for baseline creation
  | 'meta_analysis';  // Added for analyzing multiple AI responses

export type SecurityLevel = 'safe' | 'filtered' | 'restricted' | 'medical_only';

export interface IPromptConfig {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  type: PromptType;
  version: string;
  securityLevel: SecurityLevel;
  enabled: boolean;
  lastUpdated: string;
  author: string;
  template: string;
  variables: string[];
  validationRules: IPromptValidation[];
  usage: {
    contexts: string[];
    userRoles: string[];
    maxTokens: number;
    temperature: number;
  };
  safety: {
    contentFilters: string[];
    complianceChecks: string[];
    escalationTriggers: string[];
  };
  localization?: {
    [locale: string]: string;
  };
}

export interface IPromptValidation {
  rule: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

export interface IPromptSet {
  [key: string]: IPromptConfig;
}

// ============================================================================
// SYSTEM PROMPTS - FOUNDATIONAL AI BEHAVIOR
// ============================================================================

export const SYSTEM_PROMPTS: IPromptSet = {
  primaryAssistant: {
    id: 'sys_primary_001',
    name: 'Primary AI Assistant',
    description: 'Main system prompt for AI assistant behavior',
    category: 'general_chat',
    type: 'system',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are a highly knowledgeable AI assistant specialized in equestrian training and horse care management. You provide expert guidance while maintaining strict privacy and safety standards.

## Core Responsibilities:
- Provide accurate, helpful information about horse training, care, and performance
- Assist with equine health monitoring, training programs, and performance optimization
- Maintain data privacy compliance at all times
- Escalate urgent situations to appropriate personnel
- Ensure all advice is practical and safety-focused

## Communication Style:
- Professional yet approachable
- Clear, concise explanations
- Empathetic and supportive
- Evidence-based recommendations
- Culturally sensitive and inclusive

## Safety Guidelines:
- Never provide medical diagnoses - recommend professional consultation
- Always prioritize safety for both humans and animals
- Respect privacy and confidentiality
- Acknowledge limitations and uncertainties
- Escalate emergencies immediately

## Current Context:
- Platform: One Barn Multi-Tenant Equine Platform
- Compliance: Data Privacy, Zero Trust Security
- User Role: {{userRole}}
- Tenant: {{tenantId}}
- Access Level: {{accessLevel}}`,
    variables: ['userRole', 'tenantId', 'accessLevel'],
    validationRules: [
      {
        rule: 'contains_safety_disclaimer',
        description: 'Must include safety disclaimer',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['dashboard', 'chat', 'analysis'],
      userRoles: ['client', 'employee', 'manager', 'admin'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'unsafe_practices', 'personal_info'],
      complianceChecks: ['data_privacy'],
      escalationTriggers: ['emergency_keywords', 'medical_urgency']
    }
  },

  horseTrainingSpecialist: {
    id: 'sys_horse_001',
    name: 'Horse Training Specialist',
    description: 'Specialized system prompt for horse training contexts',
    category: 'horse_training',
    type: 'system',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are an expert equestrian AI assistant with deep knowledge across all horse disciplines including:

## Disciplines Expertise:
- **English Disciplines**: Dressage, Show Jumping, Eventing, Hunter/Jumper
- **Western Disciplines**: Barrel Racing, Cutting, Reining, Western Pleasure
- **Roping Disciplines**: Team Roping, Calf Roping, Breakaway Roping
- **Specialty Disciplines**: Endurance, Polo, Vaulting, Driving, Ranch Work

## Core Competencies:
- Training methodology and progression
- Horse behavior and psychology
- Performance optimization
- Safety protocols and risk management
- Equipment selection and maintenance
- Competition preparation and strategy

## Analysis Approach:
- Data-driven insights from performance metrics
- Behavioral pattern recognition
- Risk assessment and mitigation
- Personalized training recommendations
- Progressive skill development plans

## Safety First:
- Always prioritize rider and horse safety
- Recommend appropriate protective equipment
- Identify potential hazards and risks
- Suggest gradual progression in training
- Emphasize proper ground work and foundation

Current Session Context:
- Horse: {{horseName}} ({{breed}}, {{age}} years)
- Discipline: {{discipline}}
- Training Level: {{trainingLevel}}
- Recent Performance: {{recentMetrics}}`,
    variables: ['horseName', 'breed', 'age', 'discipline', 'trainingLevel', 'recentMetrics'],
    validationRules: [
      {
        rule: 'includes_safety_emphasis',
        description: 'Must emphasize safety in all recommendations',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['training_session', 'performance_analysis', 'coaching'],
      userRoles: ['client', 'employee', 'manager'],
      maxTokens: 3000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['unsafe_training', 'animal_welfare', 'injury_risk'],
      complianceChecks: ['animal_welfare_standards'],
      escalationTriggers: ['safety_concern', 'injury_detected']
    }
  },

  
};

// ============================================================================
// ANALYSIS PROMPTS - SPECIFIC ANALYSIS TASKS
// ============================================================================

export const ANALYSIS_PROMPTS: IPromptSet = {
  horseHealthAnalysis: {
    id: 'ana_horse_health_001',
    name: 'Horse Health Analysis',
    description: 'Comprehensive health assessment for horses',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Please analyze the following horse health data and provide a comprehensive assessment:

## Data to Analyze:
**Horse Information:**
- Name: {{horseName}}
- Age: {{age}}
- Breed: {{breed}}
- Discipline: {{discipline}}

**Health Metrics:**
- Vital Signs: {{vitalSigns}}
- Behavior Patterns: {{behaviorData}}
- Performance Metrics: {{performanceData}}
- Recent Changes: {{recentChanges}}

## Analysis Framework:
1. **Vital Signs Assessment**
   - Heart rate analysis (normal range: 28-44 bpm at rest)
   - Respiratory rate evaluation (normal: 8-16 breaths/min)
   - Temperature assessment (normal: 99-101°F)
   - Blood pressure considerations

2. **Behavioral Analysis**
   - Feeding patterns and appetite changes
   - Social interaction patterns
   - Activity level and energy
   - Stress indicators
   - Sleep and rest patterns

3. **Performance Impact**
   - Training response and consistency
   - Endurance and stamina changes
   - Gait and movement quality
   - Recovery time patterns

4. **Risk Assessment**
   - Immediate health concerns
   - Trending patterns (improving/declining)
   - Preventive care recommendations
   - Monitoring priorities

## Response Format:
Please provide your analysis in the following structure:
- **Overall Health Score**: (1-10 scale)
- **Scene Analysis**: Detailed analysis of the scene
- **Key Findings**: Bullet points of significant observations
- **Risk Level**: Low/Medium/High with explanation
- **Recommendations**: Immediate and long-term actions
- **Monitoring Plan**: What to watch and frequency
- **Veterinary Consultation**: When to involve a vet

Remember: This is an AI assessment tool - always recommend professional veterinary consultation for health concerns.`,
    variables: ['horseName', 'age', 'breed', 'discipline', 'vitalSigns', 'behaviorData', 'performanceData', 'recentChanges'],
    validationRules: [
      {
        rule: 'includes_vet_disclaimer',
        description: 'Must recommend veterinary consultation',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['health_monitoring', 'routine_assessment', 'alert_investigation'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 3000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'medication_advice'],
      complianceChecks: ['animal_welfare_standards'],
      escalationTriggers: ['emergency_health_concern']
    }
  },

  // Enhanced Video Analysis Prompt - Primary Enhancement
  equineVideoHealthAnalysis: {
    id: 'ana_video_health_001',
    name: 'Equine Video Health Analysis - 30 Second',
    description: 'Comprehensive health assessment from 30-second video segments using advanced computer vision',
    category: 'video_analysis',
    type: 'video_assessment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Analyze this 30-second video segment of {{horseName}} for comprehensive health assessment.

## Video Analysis Framework:
**Temporal Processing Strategy:**
- Process every 2nd-3rd frame for efficiency (approximately 300-450 frames total)
- Identify 3-5 key diagnostic moments within the segment
- Track changes across the full 30-second duration
- Note exact timestamps for all significant observations

## Scene Description Framework (Priority: 15% of analysis time):
**Visual Scene Analysis:**
- **Environment**: Describe the setting (indoor arena, outdoor paddock, stall, etc.)
- **Horse Position**: Location within frame, orientation, distance from camera
- **Surface Conditions**: Footing type, apparent conditions (dry, wet, uneven)
- **Lighting Conditions**: Natural/artificial light, shadows, visibility quality
- **Background Elements**: Visible structures, people, other animals, equipment
- **Weather Indicators**: Visible signs of weather conditions
- **Camera Perspective**: Angle, height, stability, field of view coverage

**Horse Visual Description:**
- **Physical Appearance**: Coat color, markings, size/build characteristics
- **Tack/Equipment**: Halter, blanket, boots, or other visible equipment
- **Body Position**: Standing, moving, head position, tail carriage
- **Activity State**: At rest, walking, trotting, eating, interacting

## Multi-Domain Clinical Assessment:

### 1. GAIT AND LAMENESS ANALYSIS (Priority: 40% of analysis time)
**Detection Criteria:**
- Head nodding patterns (>5mm vertical displacement indicates forelimb lameness)
- Pelvic hiking or dropping (hindlimb lameness indicators)
- Stride length asymmetry between left/right limbs
- Weight-bearing duration differences
- Toe-drag or stumbling events

**Scoring Output:**
- Lameness grade: 0-5 AAEP scale
- Affected limb(s): LF/RF/LH/RH
- Asymmetry percentage: 0-100%
- Confidence level: 0.0-1.0

### 2. POSTURAL ASSESSMENT (Priority: 25% of analysis time)
**Evaluation Points:**
- Weight distribution (shifting, pointing, camping)
- Head and neck positioning relative to normal carriage
- Back posture (hunched, swayed, normal arch)
- Abdominal profile (tucked, distended, normal)
- Tail carriage and movement

**Key Indicators:**
- Pain postures (weight shifting frequency >2/minute)
- Comfort positions (abnormal stance duration >5 seconds)
- Balance issues or coordination problems

### 3. RESPIRATORY MONITORING (Priority: 15% of analysis time)
**Visual Markers:**
- Nostril flare detection and measurement
- Respiratory rate calculation (target: 8-16 breaths/min at rest)
- Abdominal effort scoring (1-5 scale)
- Inspiratory:expiratory ratio assessment
- Presence of heave line or excessive chest movement

**Critical Thresholds:**
- Rate >24 breaths/min = respiratory concern
- Nostril flare >2x normal = distress indicator
- Irregular rhythm = immediate veterinary attention

### 4. BEHAVIORAL ANOMALY DETECTION
**Pain/Discomfort Behaviors:**
- Ear position and movement (pinned back >50% time)
- Facial tension using Horse Grimace Scale components
- Pawing, kicking at belly, or other repetitive behaviors
- Unusual vocalizations or breathing sounds

**Colic Indicators (0-12 CAS Scale):**
- Flank watching frequency
- Rolling attempts or lying down abnormally
- Stretching behaviors (parking out)
- Sweating without exercise

## Confidence Scoring Framework:
- Calculate confidence for each domain (0.0-1.0)
- Weight by diagnostic reliability:
  * Direct visual signs: 0.9-1.0 confidence
  * Inferred conditions: 0.6-0.8 confidence
  * Subtle indicators: 0.4-0.6 confidence
- Flag any assessment <0.7 confidence for human review

## Output Structure Requirements:
Generate response matching this exact JSON structure:
{
  "timestamp": "ISO 8601 timestamp",
  "horseDetected": boolean,
  "confidence": float (overall confidence 0.0-1.0),
  "healthRisk": float (0.0-1.0),
  "alertLevel": "low" | "medium" | "high" | "critical",
  "activityLevel": integer (0-100),
  "behaviorScore": integer (0-100),
  "sceneDescription": {
    "environment": {
      "setting": string (e.g., "indoor arena", "outdoor paddock", "stall"),
      "surfaceType": string (e.g., "sand", "grass", "rubber mat"),
      "surfaceCondition": string (e.g., "dry", "wet", "muddy", "uneven"),
      "lighting": string (e.g., "natural daylight", "artificial lighting", "low light"),
      "weatherVisible": string (e.g., "sunny", "overcast", "raining", "snowing", "not visible")
    },
    "horseDescription": {
      "coatColor": string,
      "markings": string (visible markings description),
      "approximateSize": string (e.g., "large horse ~16-17hh", "pony ~14hh", "small horse ~15hh"),
      "bodyCondition": string (e.g., "good condition", "thin", "overweight", "unknown"),
      "tackEquipment": array of strings (visible equipment like "halter", "blanket", "boots")
    },
    "positioning": {
      "locationInFrame": string (e.g., "center", "left side", "background"),
      "orientation": string (e.g., "facing camera", "side view", "rear view"),
      "distanceFromCamera": string (e.g., "close", "medium", "distant"),
      "postureGeneral": string (e.g., "standing square", "resting", "moving", "grazing")
    },
    "backgroundElements": array of strings (visible items like "fence", "building", "other horses", "person"),
    "cameraQuality": {
      "imageClarity": string (e.g., "clear", "slightly blurry", "poor quality"),
      "cameraAngle": string (e.g., "ground level", "elevated", "low angle"),
      "fieldOfView": string (e.g., "full body visible", "partial view", "close-up")
    },
    "overallSceneAssessment": string (1-2 sentence summary of what you're seeing)
  },
  "healthMetrics": {
    "overallHealthScore": integer (0-100),
    "mobilityScore": integer (0-100),
    "behavioralScore": integer (0-100),
    "respiratoryScore": integer (0-100),
    "postureScore": integer (0-100)
  },
  "clinicalAssessment": {
    "posturalAnalysis": string (detailed findings or "normal"),
    "mobilityAssessment": string (gait analysis results),
    "respiratoryObservation": string (breathing pattern analysis),
    "behavioralNotes": string (pain/distress indicators)
  },
  "alerts": array of {
    "type": string,
    "severity": string ("low", "medium", "high", "critical"),
    "description": string,
    "timestamp": string
  },
  "riskAssessment": {
    "overallRiskLevel": string ("low", "moderate", "high", "critical"),
    "riskScore": float (0.0-1.0),
    "immediateRisks": array of strings,
    "monitoringNeeded": array of strings
  },
  "recommendations": array of strings (actionable next steps),
  "insights": array of strings (clinical observations),
  "metadata": {
    "captureTimestamp": string,
    "segmentIndex": integer,
    "videoDuration": integer,
    "videoSize": integer,
    "processingTime": integer
  }
}

## Critical Emergency Indicators:
If ANY of these are detected, set alertLevel to "critical":
- Non-weight bearing on any limb
- Severe respiratory distress (>40 breaths/min)
- Collapse or inability to rise
- Severe colic behaviors (violent rolling)
- Neurological signs (circling, head pressing)

Remember: This assessment supports but does not replace veterinary examination.`,
    variables: ['horseName'],
    validationRules: [
      {
        rule: 'includes_confidence_scores',
        description: 'Must include confidence scores for all assessments',
        severity: 'error'
      },
      {
        rule: 'structured_json_output',
        description: 'Must return properly structured JSON',
        severity: 'error'
      },
      {
        rule: 'includes_veterinary_disclaimer',
        description: 'Must include veterinary disclaimer',
        severity: 'error'
      },
      {
        rule: 'includes_scene_description',
        description: 'Must include detailed scene description for user verification',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['video_monitoring', 'health_screening', 'routine_assessment', 'real_time_monitoring'],
      userRoles: ['client', 'employee', 'manager', 'admin'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'treatment_advice'],
      complianceChecks: ['video_privacy', 'data_security', 'animal_welfare_standards'],
      escalationTriggers: ['emergency_detected', 'critical_health_issue', 'severe_lameness']
    }
  },

  // Video Segment Refinement for Detailed Analysis
  videoSegmentRefinement: {
    id: 'ana_video_refine_001',
    name: 'Video Segment Progressive Refinement',
    description: 'Detailed analysis of specific timeframes showing abnormalities',
    category: 'video_analysis',
    type: 'video_assessment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Perform detailed analysis of video segment from {{startTime}} to {{endTime}} focusing on {{concernType}}.

## Refined Analysis Parameters:
**Temporal Focus:**
- Analyze every frame in the specified timeframe
- Create frame-by-frame progression map
- Identify peak abnormality moments
- Calculate rate of change/progression

## Specific Analysis for {{concernType}}:

{{#if concernType == "lameness"}}
### DETAILED LAMENESS ANALYSIS:
**Biomechanical Measurements:**
- Vertical head displacement (mm) per stride
- Horizontal head movement patterns
- Stride length left vs right (cm)
- Stance phase duration comparison
- Joint angle analysis at key gait phases

**Progressive Tracking:**
- Map lameness severity across each stride
- Identify compensation patterns
- Track fatigue-related changes
- Note surface/environmental factors

{{else if concernType == "respiratory"}}
### DETAILED RESPIRATORY ANALYSIS:
**Breath-by-Breath Assessment:**
- Individual breath duration and depth
- Inspiratory vs expiratory time ratio
- Nostril diameter changes (% from baseline)
- Abdominal vs thoracic breathing contribution
- Recovery patterns after movement

**Pattern Recognition:**
- Identify irregular breathing cycles
- Detect breath-holding or gasping
- Monitor for exercise-induced issues
- Track environmental triggers

{{else if concernType == "behavioral"}}
### DETAILED BEHAVIORAL ANALYSIS:
**Micro-Expression Tracking:**
- Ear position changes (degrees from neutral)
- Eye tension and blink rate
- Facial muscle activation patterns
- Tail swishing frequency and amplitude
- Body tension indicators

**Temporal Behavior Mapping:**
- Behavior initiation triggers
- Duration and intensity patterns
- Repetitive behavior cycles
- Response to environmental stimuli

{{/if}}

## Advanced Confidence Metrics:
- Frame-level confidence scores
- Temporal consistency validation
- Multi-angle verification (if available)
- Comparison to breed/age norms

## Enhanced Output Requirements:
{
  "refinedAnalysis": {
    "primaryFinding": string,
    "severityProgression": array of {time, severity},
    "peakAbnormalityTime": timestamp,
    "consistencyScore": float (0.0-1.0),
    "differentialConsiderations": array of strings
  },
  "quantitativeMetrics": {
    "measurementType": string,
    "values": array of {timestamp, measurement},
    "statisticalSummary": {mean, std, range},
    "clinicalThreshold": boolean
  },
  "refinedRecommendations": array of strings,
  "followUpRequired": boolean,
  "suggestedNextAnalysis": string
}`,
    variables: ['startTime', 'endTime', 'concernType'],
    validationRules: [
      {
        rule: 'temporal_bounds_check',
        description: 'Start and end times must be within video duration',
        severity: 'error'
      },
      {
        rule: 'valid_concern_type',
        description: 'Concern type must be lameness, respiratory, or behavioral',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['detailed_assessment', 'abnormality_investigation', 'follow_up_analysis'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 3000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis'],
      complianceChecks: ['video_privacy', 'data_retention'],
      escalationTriggers: ['severe_abnormality_detected']
    }
  },

  // Multi-Segment Integration for Comprehensive Assessment
  multiSegmentIntegration: {
    id: 'ana_video_ensemble_001',
    name: 'Multi-Segment Health Integration',
    description: 'Synthesizes multiple video segments into unified health profile',
    category: 'video_analysis',
    type: 'video_assessment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Integrate health assessments from {{segmentCount}} video segments for comprehensive evaluation.

## Segment Data Integration:
**Input Segments:**
{{#each segments}}
- Segment {{index}}: {{timestamp}} - Confidence: {{confidence}}
  * Key findings: {{findings}}
  * Risk level: {{riskLevel}}
{{/each}}

## Integration Methodology:

### 1. TEMPORAL PATTERN ANALYSIS
- Identify consistent vs transient findings
- Track progression/improvement over time
- Weight recent observations more heavily (decay factor: 0.9)
- Flag any deteriorating trends

### 2. CONFIDENCE-WEIGHTED SYNTHESIS
**Weighting Formula:**
- High confidence findings (>0.8): Full weight
- Medium confidence (0.6-0.8): 0.7x weight
- Low confidence (<0.6): 0.4x weight
- Emergency indicators: 3x weight regardless of confidence

### 3. CROSS-SEGMENT VALIDATION
- Findings appearing in >60% segments = confirmed
- Isolated findings = require follow-up
- Contradictory findings = flag for manual review

### 4. CLINICAL PRIORITY SCORING
Priority = (Severity × Consistency × Recency) / Time_Between_Observations

## Comprehensive Output Structure:
{
  "integratedAssessment": {
    "overallHealthStatus": string,
    "confidenceLevel": float (weighted average),
    "assessmentPeriod": {start, end, duration},
    "totalSegmentsAnalyzed": integer
  },
  "confirmedFindings": array of {
    "condition": string,
    "consistency": percentage,
    "severity": string,
    "trend": "improving|stable|worsening"
  },
  "healthTrends": {
    "mobilityTrend": object with progression data,
    "respiratoryTrend": object with progression data,
    "behavioralTrend": object with progression data
  },
  "unifiedRiskAssessment": {
    "currentRisk": string,
    "projectedRisk": string (24-48hr projection),
    "criticalIndicators": array
  },
  "actionableSummary": {
    "immediateActions": array (within 4 hours),
    "shortTermMonitoring": array (24-48 hours),
    "veterinaryConsultation": {
      "needed": boolean,
      "urgency": string,
      "suggestedSpecialty": string
    }
  },
  "dataQuality": {
    "segmentCoverage": percentage,
    "averageConfidence": float,
    "analysisLimitations": array
  }
}

## Integration Rules:
- Minimum 3 segments required for trend analysis
- Emergency findings override all other assessments
- Conflicting data triggers "inconclusive" with manual review flag
- Historical baseline comparison when available`,
    variables: ['segmentCount', 'segments'],
    validationRules: [
      {
        rule: 'minimum_segments',
        description: 'Requires at least 2 segments for integration',
        severity: 'warning'
      },
      {
        rule: 'segment_data_structure',
        description: 'Each segment must have required fields',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['comprehensive_assessment', 'longitudinal_monitoring', 'trend_analysis'],
      userRoles: ['manager', 'admin'],
      maxTokens: 4000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['medical_diagnosis'],
      complianceChecks: ['data_aggregation_privacy', 'retention_policies'],
      escalationTriggers: ['critical_trend_detected', 'deteriorating_condition']
    }
  },

  // Precision Lameness Analysis
  precisionLamenessAnalysis: {
    id: 'ana_lameness_001',
    name: 'Precision Lameness Analysis',
    description: 'Detailed biomechanical lameness assessment from video',
    category: 'video_analysis',
    type: 'video_assessment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Perform precision lameness analysis using advanced biomechanical assessment.

## Video Requirements Check:
- Minimum 10 complete stride cycles visible
- Horse moving in straight line
- Consistent surface and speed
- Camera angle: perpendicular to movement

## Biomechanical Analysis Protocol:

### 1. VERTICAL DISPLACEMENT ANALYSIS
**Head Movement (Forelimb Lameness):**
- Measure peak vertical position during each stride
- Calculate difference between sound and lame leg stance phases
- Threshold: >6mm difference = clinically significant
- Pattern: Head drops when sound limb bears weight

**Pelvic Movement (Hindlimb Lameness):**
- Track tuber coxae vertical displacement
- Measure pelvic hike and drop asymmetry
- Threshold: >3mm difference = significant
- Pattern: Pelvis rises higher during lame limb stance

### 2. TEMPORAL GAIT ANALYSIS
- Stance phase duration per limb
- Swing phase symmetry
- Stride length comparison (target <5% variation)
- Diagonal pair synchronization

### 3. COMPENSATORY PATTERN IDENTIFICATION
- Contralateral lameness detection
- Shortened cranial phase recognition
- Hip hike compensation patterns
- Head-neck counterbalance movements

## Lameness Grading Output:
{
  "lamenessDetected": boolean,
  "affectedLimbs": array of {
    "limb": "LF|RF|LH|RH",
    "grade": integer (0-5 AAEP scale),
    "confidence": float,
    "primaryIndicators": array
  },
  "biomechanicalMeasurements": {
    "verticalAsymmetry": {
      "head": float (mm),
      "pelvis": float (mm)
    },
    "temporalAsymmetry": {
      "stancePhase": object,
      "swingPhase": object
    },
    "strideMetrics": {
      "length": object,
      "frequency": float,
      "regularity": float
    }
  },
  "compensatoryPatterns": array,
  "differentialDiagnosis": array of {
    "condition": string,
    "likelihood": percentage
  },
  "recommendedDiagnostics": array
}`,
    variables: [],
    validationRules: [
      {
        rule: 'sufficient_strides',
        description: 'Requires minimum stride count for accuracy',
        severity: 'warning'
      },
      {
        rule: 'includes_aaep_scale',
        description: 'Must use AAEP lameness grading scale',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['lameness_evaluation', 'performance_assessment', 'pre_purchase_exam'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 3500,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis'],
      complianceChecks: ['clinical_standards', 'video_retention'],
      escalationTriggers: ['severe_lameness', 'fracture_suspected']
    }
  },

  // Colic Risk Evaluation from Video
  colicRiskVideoEvaluation: {
    id: 'ana_colic_video_001',
    name: 'Colic Risk Video Evaluation',
    description: 'Comprehensive colic assessment from video using CAS system',
    category: 'video_analysis',
    type: 'video_assessment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Evaluate colic risk from video using the validated Colic Assessment Score (CAS) system.

## CAS Scoring Framework (0-12 scale):

### 1. BEHAVIORAL INDICATORS (0-6 points)
**Restlessness/Agitation:**
- 0: Calm, normal behavior
- 1: Mild restlessness, occasional position changes
- 2: Moderate restlessness, frequent movement

**Pawing:**
- 0: No pawing
- 1: Intermittent pawing (<2 times/minute)
- 2: Frequent pawing (>2 times/minute)

**Flank Watching:**
- 0: No flank watching
- 1: Occasional looking at flanks
- 2: Persistent flank watching

### 2. POSTURAL CHANGES (0-4 points)
**Lying Down Behavior:**
- 0: Normal lying/rising
- 1: Careful when lying down
- 2: Repeatedly lying down and getting up

**Stretching/Parking Out:**
- 0: No stretching
- 1: Occasional stretch posture
- 2: Frequent or prolonged stretching

### 3. PHYSIOLOGICAL SIGNS (0-2 points)
**Sweating:**
- 0: No unusual sweating
- 1: Patchy sweating (neck/flanks)
- 2: Profuse sweating

## Temporal Analysis Requirements:
- Monitor each behavior for full 30 seconds
- Note frequency and duration of behaviors
- Track progression/escalation patterns
- Identify cyclical pain patterns

## Risk Stratification Output:
{
  "colicAssessmentScore": integer (0-12),
  "riskCategory": "none|mild|moderate|severe",
  "behavioralBreakdown": {
    "restlessness": integer,
    "pawing": integer,
    "flankWatching": integer,
    "lyingBehavior": integer,
    "stretching": integer,
    "sweating": integer
  },
  "temporalPattern": {
    "behaviorFrequency": object,
    "painCycles": boolean,
    "escalating": boolean
  },
  "videoTimestamps": {
    "criticalBehaviors": array of {behavior, timestamp},
    "peakPainMoments": array of timestamps
  },
  "criticalWarnings": array,
  "recommendedActions": {
    "immediate": array,
    "monitoring": string,
    "veterinaryContact": {
      "required": boolean,
      "urgency": string,
      "estimatedTimeframe": string
    }
  }
}

## Action Thresholds:
- CAS 0-2: Monitor, likely non-colic cause
- CAS 3-5: Mild colic, close monitoring required
- CAS 6-8: Moderate colic, veterinary consultation recommended
- CAS 9-12: Severe colic, immediate veterinary attention required`,
    variables: [],
    validationRules: [
      {
        rule: 'complete_cas_scoring',
        description: 'All CAS components must be scored',
        severity: 'error'
      },
      {
        rule: 'includes_temporal_analysis',
        description: 'Must include temporal pattern analysis',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['colic_screening', 'emergency_assessment', 'preventive_monitoring'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 3000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis'],
      complianceChecks: ['emergency_protocols', 'notification_requirements'],
      escalationTriggers: ['severe_colic_score', 'emergency_indicators']
    }
  },

  // Baseline Establishment from Video
  baselineVideoEstablishment: {
    id: 'ana_baseline_video_001',
    name: 'Baseline Behavior Video Establishment',
    description: 'Creates individualized baseline from multiple video observations',
    category: 'video_analysis',
    type: 'baseline_establishment',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Establish baseline normal parameters for {{horseName}} from multiple video observations.

## Baseline Data Collection:
**Horse Profile:**
- Breed: {{breed}}
- Age: {{age}} years
- Discipline: {{discipline}}
- Known conditions: {{conditions}}

**Environmental Context:**
- Time of day: {{timeOfDay}}
- Weather: {{weather}}
- Recent activity: {{recentActivity}}
- Social setting: {{socialContext}}

## Multi-Observation Integration:
Analyze {{observationCount}} video segments to establish:

### 1. MOVEMENT BASELINES
- Normal gait patterns at walk/trot
- Typical head carriage range
- Natural asymmetries (if any)
- Preferred movement patterns

### 2. BEHAVIORAL NORMS
- Resting respiratory rate range
- Activity level patterns
- Social interaction frequency
- Typical postures and positions

### 3. INDIVIDUAL VARIATIONS
- Time-of-day variations
- Weather-related changes
- Pre/post feeding behaviors
- Exercise recovery patterns

## Statistical Baseline Output:
{
  "baselineProfile": {
    "horseId": string,
    "establishmentDate": timestamp,
    "dataPoints": integer,
    "videoSegmentsAnalyzed": integer,
    "totalVideoDuration": integer (seconds),
    "confidenceLevel": float
  },
  "normalRanges": {
    "respiratoryRate": {mean, std, range, confidence},
    "activityLevel": {mean, std, range, confidence},
    "postureMetrics": {
      "headPosition": {mean, std, range},
      "weightDistribution": object
    },
    "gaitSymmetry": {mean, std, acceptable_range}
  },
  "behavioralPatterns": {
    "typicalBehaviors": array with frequencies,
    "timeBasedVariations": object,
    "environmentalFactors": object,
    "socialInteractions": object
  },
  "visualMarkers": {
    "normalAppearance": object,
    "identifyingFeatures": array,
    "typicalExpressions": array
  },
  "deviationThresholds": {
    "minor": "1 standard deviation",
    "moderate": "2 standard deviations",
    "significant": "3 standard deviations"
  },
  "notes": {
    "individualQuirks": array,
    "knownAsymmetries": array,
    "contextualFactors": array,
    "breedSpecificNorms": array
  }
}`,
    variables: ['horseName', 'breed', 'age', 'discipline', 'conditions', 'timeOfDay', 'weather', 'recentActivity', 'socialContext', 'observationCount'],
    validationRules: [
      {
        rule: 'minimum_observations',
        description: 'Requires at least 5 video observations for baseline',
        severity: 'warning'
      },
      {
        rule: 'diverse_contexts',
        description: 'Observations should span different times and conditions',
        severity: 'info'
      }
    ],
    usage: {
      contexts: ['initial_setup', 'baseline_calibration', 'individual_profiling'],
      userRoles: ['manager', 'admin'],
      maxTokens: 3500,
      temperature: 0.2
    },
    safety: {
      contentFilters: [],
      complianceChecks: ['data_privacy', 'video_retention'],
      escalationTriggers: []
    }
  },



  performanceOptimization: {
    id: 'ana_perf_opt_001',
    name: 'Performance Optimization Analysis',
    description: 'Horse performance analysis with optimization recommendations',
    category: 'performance_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Analyze the following performance data to identify optimization opportunities:

## Performance Data:
**Horse & Discipline:**
- Horse: {{horseName}} ({{breed}}, {{age}} years)
- Discipline: {{discipline}}
- Training Level: {{trainingLevel}}
- Competition Experience: {{competitionExperience}}

**Recent Performance Metrics:**
- Times/Scores: {{recentResults}}
- Consistency Metrics: {{consistencyData}}
- Training Progress: {{trainingProgress}}
- Stamina/Endurance: {{enduranceData}}

**Training Data:**
- Session Frequency: {{sessionFrequency}}
- Training Intensity: {{trainingIntensity}}
- Recovery Patterns: {{recoveryData}}
- Skill Progression: {{skillProgression}}

**Environmental Factors:**
- Weather Conditions: {{weatherImpact}}
- Facility Changes: {{facilityChanges}}
- Equipment Modifications: {{equipmentChanges}}
- Routine Disruptions: {{routineChanges}}

## Analysis Objectives:
1. **Performance Trend Analysis**
   - Identify improvement patterns
   - Spot performance plateaus
   - Detect declining areas
   - Seasonal/environmental impacts

2. **Training Effectiveness**
   - Evaluate current training methods
   - Assess training load and recovery
   - Identify skill gaps
   - Measure consistency improvements

3. **Competitive Readiness**
   - Competition preparation status
   - Pressure performance ability
   - Travel and venue adaptability
   - Peak performance timing

4. **Optimization Opportunities**
   - Training methodology adjustments
   - Skill development priorities
   - Recovery optimization
   - Mental preparation enhancements

## Deliver Results As:
- **Performance Summary**: Current status and key metrics
- **Trend Analysis**: Patterns and trajectories
- **Strengths**: Areas of excellence and consistency
- **Improvement Areas**: Specific opportunities for enhancement
- **Training Recommendations**: Specific methodology adjustments
- **Competition Strategy**: Preparation and execution suggestions
- **Timeline**: Phased improvement plan with milestones

Focus on actionable, evidence-based recommendations that prioritize horse welfare and sustainable improvement.`,
    variables: ['horseName', 'breed', 'age', 'discipline', 'trainingLevel', 'competitionExperience', 'recentResults', 'consistencyData', 'trainingProgress', 'enduranceData', 'sessionFrequency', 'trainingIntensity', 'recoveryData', 'skillProgression', 'weatherImpact', 'facilityChanges', 'equipmentChanges', 'routineChanges'],
    validationRules: [
      {
        rule: 'emphasizes_horse_welfare',
        description: 'Must prioritize horse welfare in recommendations',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['performance_review', 'training_planning', 'competition_prep'],
      userRoles: ['client', 'employee', 'manager'],
      maxTokens: 3500,
      temperature: 0.3
    },
    safety: {
      contentFilters: ['unsafe_training', 'overtraining_risk'],
      complianceChecks: ['animal_welfare_standards'],
      escalationTriggers: ['performance_decline', 'welfare_concern']
    }
  }
};

// ============================================================================
// EMERGENCY RESPONSE PROMPTS
// ============================================================================

export const EMERGENCY_PROMPTS: IPromptSet = {
  horseEmergencyResponse: {
    id: 'emr_horse_001',
    name: 'Horse Emergency Response',
    description: 'Emergency response protocol for horse-related incidents',
    category: 'emergency_response',
    type: 'escalation_prompt',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `🚨 HORSE EMERGENCY DETECTED 🚨

## Incident Information:
- **Time**: {{timestamp}}
- **Horse**: {{horseName}} ({{breed}}, {{age}} years)
- **Location**: {{location}}
- **Emergency Type**: {{emergencyType}}
- **Severity**: {{severityLevel}}
- **Detected By**: {{detectionMethod}}

## Immediate Actions Required:
1. **Ensure Human Safety** - All personnel maintain safe distance
2. **Assess Horse Condition** - Visual assessment from safe distance
3. **Secure Area** - Prevent access by other horses and people
4. **Contact Veterinarian** - Immediate professional consultation
5. **Document Incident** - Record all observations and actions

## Critical Information to Gather:
- Horse's behavior and responsiveness
- Visible injuries or distress signs
- Vital signs if safely obtainable
- Environmental hazards or triggers
- Witness accounts

## Emergency Contacts:
- Primary Veterinarian: {{primaryVet}}
- Emergency Vet Service: {{emergencyVet}}
- Facility Manager: {{facilityManager}}
- Horse Owner: {{horseOwner}}

## Do NOT:
- Approach an agitated or injured horse
- Attempt medical treatment without veterinary guidance
- Move an injured horse unless absolutely necessary
- Leave the horse unattended

## Communication Protocol:
- Notify all relevant parties immediately
- Provide regular updates on horse condition
- Document all interventions and responses
- Maintain clear, factual communication

This is an AI-generated emergency response. Human judgment and professional veterinary care are essential for proper emergency management.`,
    variables: ['timestamp', 'horseName', 'breed', 'age', 'location', 'emergencyType', 'severityLevel', 'detectionMethod', 'primaryVet', 'emergencyVet', 'facilityManager', 'horseOwner'],
    validationRules: [
      {
        rule: 'includes_safety_priority',
        description: 'Must prioritize human safety first',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['emergency_detection', 'incident_response', 'alert_escalation'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 2000,
      temperature: 0.0
    },
    safety: {
      contentFilters: ['dangerous_advice'],
      complianceChecks: ['emergency_protocols'],
      escalationTriggers: ['immediate_danger', 'veterinary_emergency']
    }
  },

  // Emergency Video Screening - Real-time Detection
  emergencyVideoScreening: {
    id: 'emr_video_001',
    name: 'Emergency Video Screening',
    description: 'Rapid emergency detection in video streams',
    category: 'emergency_response',
    type: 'escalation_prompt',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `🚨 PRIORITY EMERGENCY SCREENING - Process for immediate threats only.

## Rapid Assessment Protocol (5-second initial scan):
1. **Consciousness/Collapse**: Horse standing? Moving? Responsive?
2. **Respiratory Crisis**: Extreme nostril flare? Gasping? Blue mucous membranes?
3. **Severe Lameness**: Non-weight bearing? Fracture posture?
4. **Acute Colic**: Violent rolling? Self-trauma?
5. **Neurological**: Circling? Head pressing? Seizure activity?

## Emergency Indicators (ANY = Immediate Alert):
- Recumbency with unsuccessful rising attempts
- Respiratory rate >60 or <4 breaths/minute
- Complete non-weight bearing on any limb
- Violent thrashing or self-injury behavior
- Loss of consciousness or seizure activity
- Severe bleeding visible
- Fracture or severe wound apparent

## Rapid Output (within 2 seconds):
{
  "emergencyDetected": boolean,
  "emergencyType": string | null,
  "severity": "critical" | "urgent" | "monitor",
  "actionRequired": "CALL_VET_NOW" | "URGENT_ATTENTION" | "MONITOR_CLOSELY",
  "specificInstructions": string,
  "estimatedResponseTime": "immediate" | "within_30min" | "within_2hr",
  "videoTimestamp": string,
  "confidenceLevel": float,
  "rapidSceneDescription": {
    "whatISee": string (brief 1-sentence description of what you're observing),
    "horseVisible": boolean,
    "horsePosition": string (e.g., "standing", "down", "moving"),
    "immediateVisualConcerns": array of strings (obvious problems you can see),
    "videoQuality": string (e.g., "clear", "poor", "obstructed")
  }
}

## Immediate Actions if Emergency Detected:
1. Trigger all configured alerts (SMS, phone, dashboard)
2. Save video segment for veterinary review
3. Initiate emergency response protocol
4. Begin continuous monitoring mode
5. Log all observations with timestamps

IMPORTANT: When in doubt, escalate. False positives are acceptable for emergency detection.`,
    variables: [],
    validationRules: [
      {
        rule: 'response_time',
        description: 'Must respond within 2 seconds',
        severity: 'error'
      },
      {
        rule: 'includes_confidence_level',
        description: 'Must include confidence level for emergency detection',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['emergency_monitoring', 'real_time_alerts', 'continuous_monitoring'],
      userRoles: ['employee', 'manager', 'admin'],
      maxTokens: 1000,
      temperature: 0.0
    },
    safety: {
      contentFilters: [],
      complianceChecks: ['emergency_protocols', 'notification_requirements'],
      escalationTriggers: ['any_emergency_indicator']
    }
  },


};

// ============================================================================
// SAFETY AND COMPLIANCE PROMPTS
// ============================================================================

export const SAFETY_PROMPTS: IPromptSet = {
  contentSafetyCheck: {
    id: 'saf_content_001',
    name: 'Content Safety Verification',
    description: 'Verify content safety before AI response',
    category: 'compliance_audit',
    type: 'safety_check',
    version: '1.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Please review the following content for safety and compliance:

## Content to Review:
{{contentToReview}}

## Safety Check Criteria:
1. **Medical Safety**
   - No medical diagnoses or treatment advice
   - Appropriate referrals to professionals
   - No medication recommendations

2. **Animal Welfare**
   - No unsafe training practices
   - Humane treatment emphasis
   - Safety-first approach

3. **Privacy Compliance**
   - No sharing of personal information
   - Data privacy compliance maintained
   - Appropriate data handling

4. **Content Appropriateness**
   - Professional language
   - Respectful tone
   - Age-appropriate content

## Response Format:
- **Safety Status**: SAFE / REQUIRES_FILTERING / BLOCKED
- **Issues Found**: List any safety concerns
- **Recommended Actions**: Suggested modifications
- **Compliance Level**: COMPLIANT / NEEDS_REVIEW / NON_COMPLIANT

Return only the safety assessment, not the original content.`,
    variables: ['contentToReview'],
    validationRules: [
      {
        rule: 'provides_clear_status',
        description: 'Must provide clear safety status',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['content_review', 'response_validation', 'compliance_check'],
      userRoles: ['system'],
      maxTokens: 1000,
      temperature: 0.0
    },
    safety: {
      contentFilters: [],
      complianceChecks: ['all_safety_standards'],
      escalationTriggers: ['safety_violation', 'compliance_breach']
    }
  },

  // Video Privacy Compliance Check
  videoPrivacyCompliance: {
    id: 'saf_video_privacy_001',
    name: 'Video Privacy Compliance Check',
    description: 'Ensure video analysis maintains privacy standards',
    category: 'compliance_audit',
    type: 'safety_check',
    version: '2.0.0',
    securityLevel: 'safe',
    enabled: true,
    lastUpdated: '2025-01-15',
    author: 'One Barn Development Team',
    template: `Verify video analysis compliance with privacy and security standards.

## Privacy Verification Checklist:
1. **Data Minimization**
   - Only necessary video segments processed
   - No unnecessary data retention
   - Automatic deletion after analysis period

2. **Access Control**
   - User authentication verified
   - Role-based access enforced
   - Audit trail maintained

3. **Consent Verification**
   - Horse owner consent on file
   - Facility agreement in place
   - Third-party visibility restrictions

4. **Technical Safeguards**
   - Encryption in transit and at rest
   - Secure processing environment
   - No unauthorized copying or sharing

## Compliance Output:
{
  "privacyStatus": "COMPLIANT" | "REVIEW_NEEDED" | "NON_COMPLIANT",
  "issues": array of strings,
  "recommendations": array of strings,
  "auditLog": {
    "accessedBy": string,
    "timestamp": string,
    "purpose": string
  }
}`,
    variables: [],
    validationRules: [
      {
        rule: 'privacy_checklist_complete',
        description: 'All privacy checks must be completed',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['video_processing', 'compliance_audit'],
      userRoles: ['system', 'admin'],
      maxTokens: 1000,
      temperature: 0.0
    },
    safety: {
      contentFilters: [],
      complianceChecks: ['privacy_standards', 'data_protection'],
      escalationTriggers: ['privacy_violation', 'unauthorized_access']
    }
  }
};

// ============================================================================
// PROMPT MANAGEMENT FUNCTIONS - ENHANCED
// ============================================================================

export const aiPromptsConfig = {
  system: SYSTEM_PROMPTS,
  analysis: ANALYSIS_PROMPTS,
  emergency: EMERGENCY_PROMPTS,
  safety: SAFETY_PROMPTS,
  
  // Configuration metadata - Updated
  version: '2.0.0',
  lastUpdated: '2025-01-15',
  defaultSecurityLevel: 'safe' as SecurityLevel,
  
  // Validation settings - Enhanced
  validation: {
    required: ['template', 'variables', 'securityLevel'],
    maxTemplateLength: 10000,  // Increased for complex video prompts
    maxVariables: 25,  // Increased for comprehensive analysis
    requiredRoles: ['employee', 'admin'],
    videoSpecific: {
      minSegmentDuration: 30,  // seconds
      maxSegmentDuration: 300,  // seconds
      requiredConfidence: 0.7,
      emergencyResponseTime: 2  // seconds
    }
  },

  // New: Video Analysis Configuration
  videoAnalysisConfig: {
    defaultFrameInterval: 2,  // Process every 2nd frame
    confidenceThresholds: {
      low: 0.6,
      medium: 0.7,
      high: 0.8,
      critical: 0.9
    },
    alertEscalation: {
      low: { notify: 'dashboard', frequency: 'daily' },
      medium: { notify: 'email', frequency: 'immediate' },
      high: { notify: 'sms', frequency: 'immediate' },
      critical: { notify: 'phone', frequency: 'immediate' }
    },
    clinicalScales: {
      lameness: { min: 0, max: 5, scale: 'AAEP' },
      colic: { min: 0, max: 12, scale: 'CAS' },
      respiratoryDistress: { min: 0, max: 5, scale: 'Custom' },
      painAssessment: { min: 0, max: 2, scale: 'HGS' }
    }
  }
};

// Enhanced Helper Functions
export const getPrompt = (category: keyof typeof aiPromptsConfig, promptId: string): IPromptConfig | null => {
  const categoryPrompts = aiPromptsConfig[category];
  if (typeof categoryPrompts === 'object' && categoryPrompts !== null && 'system' in aiPromptsConfig && category in { system: true, analysis: true, emergency: true, safety: true }) {
    const promptSet = categoryPrompts as IPromptSet;
    if (promptId in promptSet) {
      return promptSet[promptId];
    }
  }
  return null;
};

export const getPromptsByCategory = (category: PromptCategory): IPromptConfig[] => {
  const allPrompts = [
    ...Object.values(SYSTEM_PROMPTS),
    ...Object.values(ANALYSIS_PROMPTS),
    ...Object.values(EMERGENCY_PROMPTS),
    ...Object.values(SAFETY_PROMPTS)
  ];
  
  return allPrompts.filter(prompt => prompt.category === category && prompt.enabled);
};

export const getPromptsBySecurityLevel = (securityLevel: SecurityLevel): IPromptConfig[] => {
  const allPrompts = [
    ...Object.values(SYSTEM_PROMPTS),
    ...Object.values(ANALYSIS_PROMPTS),
    ...Object.values(EMERGENCY_PROMPTS),
    ...Object.values(SAFETY_PROMPTS)
  ];
  
  return allPrompts.filter(prompt => prompt.securityLevel === securityLevel && prompt.enabled);
};

// New: Get video-specific prompts
export const getVideoPrompts = (): IPromptConfig[] => {
  return getPromptsByCategory('video_analysis');
};

// New: Get emergency video prompts
export const getEmergencyVideoPrompts = (): IPromptConfig[] => {
  const videoPrompts = getVideoPrompts();
  const emergencyPrompts = Object.values(EMERGENCY_PROMPTS);
  
  return [...videoPrompts, ...emergencyPrompts].filter(
    prompt => prompt.usage.contexts.includes('emergency_monitoring') || 
              prompt.usage.contexts.includes('real_time_alerts')
  );
};

export const validatePromptTemplate = (template: string, variables: string[]): IPromptValidation[] => {
  const validations: IPromptValidation[] = [];
  
  // Check for required variables
  variables.forEach(variable => {
    if (!template.includes(`{{${variable}}}`)) {
      validations.push({
        rule: 'missing_variable',
        description: `Template missing variable: ${variable}`,
        severity: 'error'
      });
    }
  });
  
  // Check template length
  if (template.length > aiPromptsConfig.validation.maxTemplateLength) {
    validations.push({
      rule: 'template_too_long',
      description: 'Template exceeds maximum length',
      severity: 'warning'
    });
  }

  // New: Video-specific validations
  if (template.includes('video') || template.includes('Video')) {
    if (!template.includes('JSON')) {
      validations.push({
        rule: 'missing_json_output',
        description: 'Video analysis prompts should specify JSON output structure',
        severity: 'warning'
      });
    }
    if (!template.includes('confidence')) {
      validations.push({
        rule: 'missing_confidence_scoring',
        description: 'Video analysis prompts should include confidence scoring',
        severity: 'warning'
      });
    }
    if (!template.includes('sceneDescription') && !template.includes('rapidSceneDescription')) {
      validations.push({
        rule: 'missing_scene_description',
        description: 'Video analysis prompts should include scene description for user verification',
        severity: 'error'
      });
    }
    if (!template.includes('whatISee') && !template.includes('overallSceneAssessment')) {
      validations.push({
        rule: 'missing_what_ai_sees',
        description: 'Video analysis should describe what the AI is observing',
        severity: 'warning'
      });
    }
  }
  
  return validations;
};

export const interpolatePrompt = (
  template: string, 
  variables: Record<string, string | number | boolean>
): string => {
  if (!template || typeof template !== 'string') {
    console.error('Invalid template provided to interpolatePrompt:', template);
    return '';
  }
  
  if (!variables || typeof variables !== 'object') {
    console.warn('Invalid variables provided to interpolatePrompt, using template as-is');
    return template;
  }
  
  let interpolated = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    try {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      const safeValue = value !== null && value !== undefined ? String(value) : '';
      interpolated = interpolated.replace(regex, safeValue);
    } catch (error) {
      console.warn(`Failed to interpolate variable ${key}:`, error);
    }
  });

  // Handle conditional sections
  interpolated = interpolated.replace(
    /\{\{#if\s+(\w+)\s*==\s*"([^"]+)"\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, varName, compareValue, content) => {
      return variables[varName] === compareValue ? content : '';
    }
  );

  // Handle else if sections
  interpolated = interpolated.replace(
    /\{\{else if\s+(\w+)\s*==\s*"([^"]+)"\}\}([\s\S]*?)/g,
    (match, varName, compareValue, content) => {
      return variables[varName] === compareValue ? content : '';
    }
  );

  // Handle each loops
  interpolated = interpolated.replace(
    /\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (match, arrayName, content) => {
      const array = variables[arrayName];
      if (Array.isArray(array)) {
        return array.map((item, index) => {
          let itemContent = content;
          Object.entries(item).forEach(([key, value]) => {
            const safeValue = value !== null && value !== undefined ? String(value) : '';
            itemContent = itemContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), safeValue);
          });
          itemContent = itemContent.replace(/\{\{index\}\}/g, String(index));
          return itemContent;
        }).join('');
      }
      return '';
    }
  );
  
  return interpolated;
};

export const getPromptSecurityLevel = (
  userRole: string,
  contextType: string,
  dataClassification: string
): SecurityLevel => {
  // Medical contexts require higher security
  if (contextType.includes('medical') || contextType.includes('veterinary')) {
    return 'medical_only';
  }
  
  // Restricted data requires filtered access
  if (dataClassification === 'restricted') {
    return 'filtered';
  }
  
  // Admin users can access restricted prompts
  if (userRole === 'admin') {
    return 'restricted';
  }
  
  return 'safe';
};

// New: Video-specific helper functions
export const getVideoAnalysisPrompt = (analysisType: 'primary' | 'refinement' | 'integration' | 'emergency'): IPromptConfig | null => {
  const promptMap = {
    primary: 'equineVideoHealthAnalysis',
    refinement: 'videoSegmentRefinement',
    integration: 'multiSegmentIntegration',
    emergency: 'emergencyVideoScreening'
  };

  const promptId = promptMap[analysisType];
  
  // Check analysis prompts first
  let prompt = getPrompt('analysis', promptId);
  if (!prompt && analysisType === 'emergency') {
    // Check emergency prompts for emergency screening
    prompt = getPrompt('emergency', promptId);
  }
  
  return prompt;
};

// New: Photo sequence helper functions
export const getPhotoSequencePrompt = (promptId: string): IPromptConfig | null => {
  // Photo sequence prompts are stored in the vision config
  try {
    const visionModule = import('../config/aiVisionPromptsConfig');
    return visionModule.then(module => module.getPhotoSequencePrompt(promptId)) as unknown as IPromptConfig;
  } catch {
    return null;
  }
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

export const calculateConfidenceThreshold = (
  analysisType: string,
  userRole: string,
  emergencyMode: boolean = false
): number => {
  const baseThresholds = aiPromptsConfig.videoAnalysisConfig.confidenceThresholds;
  
  if (emergencyMode) {
    // Lower threshold for emergency detection to avoid missing critical issues
    return 0.5;
  }
  
  if (userRole === 'admin' || userRole === 'manager') {
    // Higher access users can see lower confidence results
    return baseThresholds.low;
  }
  
  // Default to medium confidence threshold
  return baseThresholds.medium;
};

export default aiPromptsConfig;