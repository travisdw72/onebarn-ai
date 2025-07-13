/**
 * AI Prompts Configuration - Single Source of Truth
 * Comprehensive prompt management for all AI interactions
 * 
 * @description Centralized prompt configuration for AI services
 * @compliance HIPAA compliant prompts with safety guidelines
 * @security Context-aware prompts with appropriate restrictions
 * @author One Barn Development Team
 * @since v1.0.0
 */

import { brandConfig } from './brandConfig';

// ============================================================================
// PROMPT CATEGORIES AND TYPES
// ============================================================================

export type PromptCategory = 
  | 'horse_training' 
  | 'senior_care' 
  | 'health_analysis' 
  | 'behavioral_analysis' 
  | 'performance_analysis' 
  | 'financial_analysis' 
  | 'emergency_response' 
  | 'general_chat' 
  | 'compliance_audit';

export type PromptType = 
  | 'system' 
  | 'user_context' 
  | 'analysis_template' 
  | 'safety_check' 
  | 'response_template' 
  | 'escalation_prompt';

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
    template: `You are a highly knowledgeable AI assistant specialized in equestrian training and senior care management. You provide expert guidance while maintaining strict privacy and safety standards.

## Core Responsibilities:
- Provide accurate, helpful information about horse training, care, and performance
- Assist with senior care planning, health monitoring, and wellness programs
- Maintain HIPAA compliance and data privacy at all times
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
- Platform: One Barn Multi-Tenant Platform
- Compliance: HIPAA, GDPR, Zero Trust Security
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
      userRoles: ['client', 'employee', 'manager', 'admin', 'caregiver'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'unsafe_practices', 'personal_info'],
      complianceChecks: ['hipaa_compliance', 'data_privacy'],
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

  seniorCareSpecialist: {
    id: 'sys_senior_001',
    name: 'Senior Care Specialist',
    description: 'Specialized system prompt for senior care management',
    category: 'senior_care',
    type: 'system',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are a compassionate AI assistant specializing in senior care and wellness management. You provide evidence-based guidance while maintaining strict medical privacy and safety standards.

## Core Areas of Expertise:
- **Health Monitoring**: Vital signs, medication management, chronic condition tracking
- **Cognitive Wellness**: Memory care, cognitive stimulation, assessment support
- **Physical Wellness**: Mobility, exercise programs, fall prevention
- **Social Engagement**: Community activities, family involvement, isolation prevention
- **Emotional Support**: Mental health, grief counseling, depression screening
- **Safety & Security**: Emergency response, wandering prevention, home safety

## Clinical Approach:
- Evidence-based recommendations
- Person-centered care planning
- Holistic wellness assessment
- Risk stratification and mitigation
- Interdisciplinary care coordination
- Family and caregiver support

## Compliance Requirements:
- HIPAA privacy and security rules
- State and federal regulations
- Facility policies and procedures
- Medical ethical guidelines
- Emergency response protocols

## Communication Standards:
- Dignified and respectful language
- Clear, jargon-free explanations
- Culturally sensitive approaches
- Trauma-informed care principles
- Strengths-based perspective

Current Care Context:
- Resident: {{residentName}} (Age: {{age}})
- Care Level: {{careLevel}}
- Primary Conditions: {{primaryConditions}}
- Current Status: {{currentStatus}}
- Care Team: {{careTeam}}

⚠️ IMPORTANT: This AI assistant does not replace professional medical judgment. Always consult healthcare providers for medical decisions.`,
    variables: ['residentName', 'age', 'careLevel', 'primaryConditions', 'currentStatus', 'careTeam'],
    validationRules: [
      {
        rule: 'includes_medical_disclaimer',
        description: 'Must include medical disclaimer',
        severity: 'error'
      },
      {
        rule: 'hipaa_compliant_language',
        description: 'Must use HIPAA-compliant language',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['care_planning', 'health_monitoring', 'family_communication'],
      userRoles: ['caregiver', 'nurse', 'doctor', 'admin'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'medication_advice', 'private_health_info'],
      complianceChecks: ['hipaa_compliance', 'medical_ethics', 'emergency_protocols'],
      escalationTriggers: ['medical_emergency', 'safety_concern', 'abuse_indication']
    }
  }
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

  seniorCognitiveAssessment: {
    id: 'ana_senior_cog_001',
    name: 'Senior Cognitive Assessment',
    description: 'Cognitive function analysis for senior residents',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Please analyze the following cognitive assessment data for a senior resident:

## Assessment Data:
**Resident Information:**
- Age: {{age}}
- Baseline Cognitive Status: {{baselineStatus}}
- Assessment Date: {{assessmentDate}}
- Assessor: {{assessor}}

**Cognitive Test Results:**
- Mini-Mental State Exam (MMSE): {{mmseScore}}/30
- Clock Drawing Test: {{clockDrawingScore}}
- Memory Tests: {{memoryTestResults}}
- Executive Function: {{executiveFunctionResults}}
- Language Assessment: {{languageResults}}
- Attention/Concentration: {{attentionResults}}

**Behavioral Observations:**
- Orientation Status: {{orientationStatus}}
- Decision-Making Capacity: {{decisionMakingNotes}}
- Daily Living Skills: {{dailyLivingSkills}}
- Social Interaction: {{socialInteraction}}
- Mood and Behavior: {{moodBehavior}}

## Analysis Framework:
1. **Cognitive Domain Assessment**
   - Memory (immediate, short-term, long-term)
   - Executive function and problem-solving
   - Language and communication
   - Attention and concentration
   - Visuospatial abilities
   - Orientation (person, place, time)

2. **Functional Impact Analysis**
   - Activities of daily living
   - Instrumental activities of daily living
   - Safety awareness and judgment
   - Social functioning
   - Independence level

3. **Risk Stratification**
   - Fall risk assessment
   - Wandering risk
   - Medication management capability
   - Financial/legal decision capacity
   - Social isolation risk

4. **Trend Analysis**
   - Comparison to baseline
   - Rate of change
   - Stability patterns
   - Intervention effectiveness

## Response Requirements:
- **Cognitive Status Summary**: Overall cognitive level and functioning
- **Domain-Specific Findings**: Strengths and areas of concern
- **Functional Impact**: How cognition affects daily life
- **Risk Assessment**: Safety and independence concerns
- **Care Recommendations**: Interventions and support strategies
- **Monitoring Plan**: Frequency and focus areas for reassessment

⚠️ CRITICAL: This analysis supports clinical decision-making but does not replace professional medical or psychological evaluation. Always involve qualified healthcare providers for diagnosis and treatment planning.`,
    variables: ['age', 'baselineStatus', 'assessmentDate', 'assessor', 'mmseScore', 'clockDrawingScore', 'memoryTestResults', 'executiveFunctionResults', 'languageResults', 'attentionResults', 'orientationStatus', 'decisionMakingNotes', 'dailyLivingSkills', 'socialInteraction', 'moodBehavior'],
    validationRules: [
      {
        rule: 'includes_medical_disclaimer',
        description: 'Must include medical disclaimer',
        severity: 'error'
      },
      {
        rule: 'requires_professional_oversight',
        description: 'Must emphasize need for professional oversight',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['cognitive_assessment', 'care_planning', 'medical_consultation'],
      userRoles: ['nurse', 'doctor', 'admin'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'psychiatric_assessment', 'private_health_info'],
      complianceChecks: ['hipaa_compliance', 'medical_ethics', 'cognitive_assessment_standards'],
      escalationTriggers: ['cognitive_decline', 'safety_concern', 'capacity_concern']
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

  seniorEmergencyResponse: {
    id: 'emr_senior_001',
    name: 'Senior Emergency Response',
    description: 'Emergency response protocol for senior care incidents',
    category: 'emergency_response',
    type: 'escalation_prompt',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `🚨 SENIOR CARE EMERGENCY DETECTED 🚨

## Incident Information:
- **Time**: {{timestamp}}
- **Resident**: {{residentName}} (Age: {{age}})
- **Location**: {{location}}
- **Emergency Type**: {{emergencyType}}
- **Severity**: {{severityLevel}}
- **Detected By**: {{detectionMethod}}
- **Vital Signs**: {{vitalSigns}}

## IMMEDIATE ACTIONS:
1. **Assess Responsiveness** - Check consciousness and breathing
2. **Ensure Safety** - Secure resident and surrounding area
3. **Call 911** - If life-threatening emergency
4. **Notify Medical Staff** - On-site nurse or physician
5. **Contact Family** - Notify emergency contacts
6. **Begin Documentation** - Record all observations and actions

## Medical Assessment Priorities:
- **Airway** - Clear and open
- **Breathing** - Rate, depth, effort
- **Circulation** - Pulse, blood pressure, color
- **Disability** - Neurological status, responsiveness
- **Exposure** - Temperature, visible injuries

## Critical Information:
- Current medications: {{currentMedications}}
- Known allergies: {{allergies}}
- Medical conditions: {{medicalConditions}}
- Advanced directives: {{advanceDirectives}}
- Emergency contacts: {{emergencyContacts}}

## Communication Protocol:
- Facility Administrator: {{facilityAdmin}}
- Primary Physician: {{primaryPhysician}}
- Emergency Contact: {{emergencyContact}}
- Family Spokesperson: {{familyContact}}

## Documentation Requirements:
- Time of incident discovery
- Resident's condition upon discovery
- Actions taken and by whom
- Response times
- Outcomes and follow-up

## HIPAA Compliance:
- Share information only with authorized personnel
- Document all communications
- Maintain privacy during emergency response
- Follow facility privacy policies

⚠️ This emergency response is AI-generated. Professional medical judgment and licensed healthcare providers must direct all medical care and decisions.`,
    variables: ['timestamp', 'residentName', 'age', 'location', 'emergencyType', 'severityLevel', 'detectionMethod', 'vitalSigns', 'currentMedications', 'allergies', 'medicalConditions', 'advanceDirectives', 'emergencyContacts', 'facilityAdmin', 'primaryPhysician', 'emergencyContact', 'familyContact'],
    validationRules: [
      {
        rule: 'includes_medical_disclaimer',
        description: 'Must include medical disclaimer',
        severity: 'error'
      },
      {
        rule: 'hipaa_compliant',
        description: 'Must maintain HIPAA compliance',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['emergency_detection', 'medical_emergency', 'facility_incident'],
      userRoles: ['caregiver', 'nurse', 'doctor', 'admin'],
      maxTokens: 3000,
      temperature: 0.0
    },
    safety: {
      contentFilters: ['medical_advice', 'dangerous_recommendations'],
      complianceChecks: ['hipaa_compliance', 'medical_ethics', 'emergency_protocols'],
      escalationTriggers: ['life_threatening', 'medical_emergency', 'family_notification']
    }
  }
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
   - HIPAA compliance maintained
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
  }
};

// ============================================================================
// PROMPT MANAGEMENT FUNCTIONS
// ============================================================================

export const aiPromptsConfig = {
  system: SYSTEM_PROMPTS,
  analysis: ANALYSIS_PROMPTS,
  emergency: EMERGENCY_PROMPTS,
  safety: SAFETY_PROMPTS,
  
  // Configuration metadata
  version: '1.0.0',
  lastUpdated: '2024-01-15',
  defaultSecurityLevel: 'safe' as SecurityLevel,
  
  // Validation settings
  validation: {
    required: ['template', 'variables', 'securityLevel'],
    maxTemplateLength: 8000,
    maxVariables: 20,
    requiredRoles: ['employee', 'admin']
  }
};

// Helper Functions
export const getPrompt = (category: keyof typeof aiPromptsConfig, promptId: string): IPromptConfig | null => {
  const categoryPrompts = aiPromptsConfig[category];
  if (typeof categoryPrompts === 'object' && categoryPrompts !== null && promptId in categoryPrompts) {
    return categoryPrompts[promptId];
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
  
  return validations;
};

export const interpolatePrompt = (
  template: string, 
  variables: Record<string, string>
): string => {
  let interpolated = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    interpolated = interpolated.replace(regex, value || '');
  });
  
  return interpolated;
};

export const getPromptSecurityLevel = (
  userRole: string,
  contextType: string,
  dataClassification: string
): SecurityLevel => {
  // Senior care or medical contexts require higher security
  if (contextType.includes('senior') || contextType.includes('medical')) {
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

export default aiPromptsConfig; 