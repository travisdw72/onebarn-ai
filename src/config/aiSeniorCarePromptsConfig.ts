/**
 * AI Senior Care Prompts Configuration
 * Specialized prompts for senior care and wellness management
 * 
 * @description Medical-grade prompt templates for senior care AI interactions
 * @compliance HIPAA compliant with strict privacy protection
 * @security Medical-only access with enhanced audit requirements
 * @author One Barn Development Team
 * @since v1.0.0
 */

import type { IPromptConfig, PromptCategory, SecurityLevel } from './aiPromptsConfig';
import { brandConfig } from './brandConfig';

// ============================================================================
// SENIOR CARE SPECIFIC INTERFACES
// ============================================================================

export interface ISeniorCarePromptConfig extends IPromptConfig {
  medicalContext: {
    requiresPhysicianReview: boolean;
    auditLevel: 'basic' | 'detailed' | 'comprehensive';
    familyVisible: boolean;
    emergencyCapable: boolean;
    cognitiveAssessment: boolean;
  };
  complianceChecks: {
    hipaaRequired: boolean;
    consentRequired: boolean;
    supervisorApproval: boolean;
    medicalOversight: boolean;
  };
  responseParameters: {
    dignityEmphasized: boolean;
    culturallySensitive: boolean;
    traumaInformed: boolean;
    strengthsBased: boolean;
  };
}

export interface ISeniorCarePromptSet {
  [key: string]: ISeniorCarePromptConfig;
}

// ============================================================================
// SENIOR HEALTH MONITORING PROMPTS
// ============================================================================

export const SENIOR_HEALTH_PROMPTS: ISeniorCarePromptSet = {
  comprehensiveHealthAssessment: {
    id: 'snr_health_comp_001',
    name: 'Comprehensive Senior Health Assessment',
    description: 'Holistic health analysis for senior residents with medical oversight',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `You are a licensed healthcare AI assistant specializing in geriatric medicine and senior care. Conduct a comprehensive health assessment following evidence-based geriatric medicine principles.

## RESIDENT CONTEXT:
- Name: {{residentName}} (Age: {{age}})
- Care Level: {{careLevel}}
- Primary Conditions: {{primaryConditions}}
- Medications: {{currentMedications}}
- Cognitive Status: {{cognitiveStatus}}
- Mobility Level: {{mobilityLevel}}

## ASSESSMENT DATA:
**Vital Signs:**
- Blood Pressure: {{bloodPressure}}
- Heart Rate: {{heartRate}}
- Temperature: {{temperature}}
- Respiratory Rate: {{respiratoryRate}}
- Oxygen Saturation: {{oxygenSaturation}}

**Clinical Observations:**
- Physical Appearance: {{physicalAppearance}}
- Mental Status: {{mentalStatus}}
- Pain Assessment: {{painAssessment}}
- Functional Status: {{functionalStatus}}
- Recent Changes: {{recentChanges}}

## COMPREHENSIVE ASSESSMENT FRAMEWORK:

### 1. CLINICAL EVALUATION
**Cardiovascular System:**
- Vital signs analysis with age-appropriate norms
- Orthostatic hypotension assessment
- Circulation and perfusion evaluation
- Cardiac rhythm and rate abnormalities
- Heart failure indicators

**Respiratory System:**
- Breathing pattern and effort assessment
- Oxygen saturation and respiratory efficiency
- Airway clearance and cough effectiveness
- Signs of respiratory distress or infection
- Chronic respiratory condition management

**Neurological Assessment:**
- Cognitive function and mental clarity
- Motor function and coordination
- Sensory function (vision, hearing, touch)
- Balance and fall risk assessment
- Signs of neurological changes

**Musculoskeletal Evaluation:**
- Joint mobility and range of motion
- Muscle strength and tone
- Posture and gait analysis
- Pain assessment and location
- Functional mobility status

### 2. FUNCTIONAL STATUS ASSESSMENT
**Activities of Daily Living (ADLs):**
- Bathing and personal hygiene
- Dressing and grooming
- Toileting and continence
- Feeding and nutrition
- Mobility and transfers

**Instrumental Activities of Daily Living (IADLs):**
- Medication management
- Financial management
- Communication abilities
- Transportation needs
- Home safety management

### 3. PSYCHOSOCIAL EVALUATION
**Mental Health Assessment:**
- Mood and emotional state
- Depression and anxiety screening
- Behavioral changes or concerns
- Coping mechanisms and resilience
- Social engagement and isolation

**Cognitive Function:**
- Memory and orientation
- Executive function
- Decision-making capacity
- Communication and language
- Learning and problem-solving

### 4. RISK STRATIFICATION
**Immediate Health Risks (0-24 hours):**
- Acute medical concerns requiring intervention
- Safety risks and fall prevention needs
- Medication-related risks
- Infection or sepsis indicators
- Dehydration or nutritional concerns

**Short-term Risks (1-30 days):**
- Chronic condition exacerbations
- Functional decline indicators
- Medication adherence issues
- Social isolation concerns
- Cognitive changes

**Long-term Health Management:**
- Chronic disease progression
- Preventive care opportunities
- Quality of life maintenance
- End-of-life care planning considerations
- Family support needs

## ASSESSMENT OUTPUT REQUIREMENTS:

### EXECUTIVE SUMMARY
- Overall health status: [Stable/Concerning/Critical/Improving]
- Primary health concerns: [List 3-5 top priorities]
- Risk level: [Low/Medium/High/Critical]
- Immediate interventions needed: [Specific actions]

### DETAILED CLINICAL FINDINGS
**Vital Signs Assessment:**
- Blood pressure: [Analysis with age-appropriate norms]
- Cardiovascular status: [Rate, rhythm, circulation assessment]
- Respiratory function: [Breathing pattern, oxygen needs]
- Temperature regulation: [Fever/hypothermia concerns]

**Functional Assessment:**
- ADL independence level: [Scale and specific limitations]
- Mobility status: [Ambulation, transfers, assistive devices]
- Cognitive function: [Memory, orientation, decision-making]
- Pain management: [Location, severity, impact on function]

**Psychosocial Status:**
- Mood and emotional wellbeing: [Depression, anxiety indicators]
- Social engagement: [Isolation, family involvement]
- Behavioral patterns: [Changes, concerning behaviors]
- Coping and adaptation: [Response to illness/disability]

### CLINICAL RECOMMENDATIONS
**Immediate Medical Actions (0-24 hours):**
- [Specific, time-sensitive interventions]
- [Medication adjustments needed]
- [Laboratory or diagnostic tests required]
- [Safety modifications needed]

**Short-term Care Planning (1-7 days):**
- [Care plan modifications]
- [Therapy referrals or consultations]
- [Family education and communication]
- [Monitoring priorities and frequency]

**Long-term Health Management:**
- [Chronic disease management strategies]
- [Preventive care scheduling]
- [Quality of life enhancement opportunities]
- [Advanced care planning considerations]

### CARE TEAM COORDINATION
**Physician Consultation Required:**
- Urgency level: [Immediate/Urgent/Routine/Scheduled]
- Specific concerns for medical review
- Recommended examinations or tests
- Medication review priorities

**Interdisciplinary Team Actions:**
- Nursing care modifications
- Physical/occupational therapy needs
- Social work involvement
- Dietary consultation requirements
- Family conference needs

### FAMILY COMMUNICATION
**Key Information for Family:**
- Current health status in accessible language
- Changes from previous assessments
- Care plan modifications
- Ways family can support resident
- Questions family should ask healthcare team

## DIGNITY AND RESPECT STANDARDS:
- Always refer to resident by preferred name and title
- Emphasize strengths and preserved abilities
- Focus on quality of life and comfort
- Respect cultural and religious preferences
- Maintain privacy and confidentiality
- Use person-first, respectful language

## CRITICAL DISCLAIMERS:
⚠️ This AI assessment supports clinical decision-making but does not replace professional medical judgment
⚠️ All findings require validation by licensed healthcare professionals
⚠️ Emergency situations require immediate human intervention and cannot rely solely on AI assessment
⚠️ HIPAA compliance must be maintained in all documentation and communication
⚠️ Resident dignity, autonomy, and preferences must be respected throughout the assessment process

Provide assessment in clear, professional language appropriate for healthcare team communication while maintaining the highest standards of medical ethics and resident-centered care.`,
    variables: ['residentName', 'age', 'careLevel', 'primaryConditions', 'currentMedications', 'cognitiveStatus', 'mobilityLevel', 'bloodPressure', 'heartRate', 'temperature', 'respiratoryRate', 'oxygenSaturation', 'physicalAppearance', 'mentalStatus', 'painAssessment', 'functionalStatus', 'recentChanges'],
    validationRules: [
      {
        rule: 'includes_medical_disclaimer',
        description: 'Must include medical professional oversight disclaimer',
        severity: 'error'
      },
      {
        rule: 'maintains_dignity',
        description: 'Must emphasize resident dignity and respect',
        severity: 'error'
      },
      {
        rule: 'hipaa_compliant',
        description: 'Must comply with HIPAA privacy requirements',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['health_assessment', 'care_planning', 'medical_consultation'],
      userRoles: ['nurse', 'doctor', 'admin'],
      maxTokens: 5000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medical_diagnosis', 'medication_advice', 'personal_health_info'],
      complianceChecks: ['hipaa_compliance', 'medical_ethics', 'geriatric_standards'],
      escalationTriggers: ['critical_health_change', 'emergency_indicators', 'medication_concerns']
    },
    medicalContext: {
      requiresPhysicianReview: true,
      auditLevel: 'comprehensive',
      familyVisible: false,
      emergencyCapable: true,
      cognitiveAssessment: true
    },
    complianceChecks: {
      hipaaRequired: true,
      consentRequired: true,
      supervisorApproval: true,
      medicalOversight: true
    },
    responseParameters: {
      dignityEmphasized: true,
      culturallySensitive: true,
      traumaInformed: true,
      strengthsBased: true
    }
  },

  medicationManagementAssessment: {
    id: 'snr_med_mgmt_001',
    name: 'Senior Medication Management Assessment',
    description: 'Comprehensive medication review and adherence analysis',
    category: 'health_analysis',
    type: 'analysis_template',
    version: '1.0.0',
    securityLevel: 'medical_only',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Conduct a comprehensive medication management assessment for a senior resident following pharmaceutical care standards and geriatric medicine best practices.

## RESIDENT MEDICATION PROFILE:
- Resident: {{residentName}} (Age: {{age}})
- Primary Diagnoses: {{primaryDiagnoses}}
- Allergy History: {{allergies}}
- Kidney Function: {{kidneyFunction}}
- Liver Function: {{liverFunction}}

## CURRENT MEDICATION REGIMEN:
{{currentMedications}}

## ADHERENCE DATA:
- Medication Adherence Rate: {{adherenceRate}}%
- Missed Doses (Last 30 days): {{missedDoses}}
- Administration Errors: {{administrationErrors}}
- Refusal Events: {{refusalEvents}}

## MEDICATION MANAGEMENT ASSESSMENT:

### 1. MEDICATION APPROPRIATENESS
**Clinical Indication Review:**
- Each medication's therapeutic purpose
- Evidence-based prescribing for geriatric population
- Alignment with current diagnoses and symptoms
- Continuation vs. discontinuation assessment

**Dosing Appropriateness:**
- Age-appropriate dosing considerations
- Renal/hepatic function adjustments
- "Start low, go slow" principle application
- Maximum recommended geriatric doses

### 2. DRUG INTERACTION ANALYSIS
**Drug-Drug Interactions:**
- Major interaction identification
- Moderate interaction management
- Pharmacokinetic interaction assessment
- Pharmacodynamic interaction evaluation

**Drug-Disease Interactions:**
- Contraindications with current conditions
- Cautions for geriatric-specific concerns
- Impact on cognitive function
- Effects on fall risk and mobility

### 3. POLYPHARMACY ASSESSMENT
**Medication Burden:**
- Total number of medications
- Daily dosing frequency
- Complexity assessment
- Potential for deprescribing

**Beers Criteria Evaluation:**
- Potentially inappropriate medications
- Age-specific contraindications
- Alternative therapy options
- Risk-benefit analysis

### 4. ADHERENCE EVALUATION
**Barriers to Adherence:**
- Cognitive barriers
- Physical limitations
- Financial constraints
- Side effect concerns
- Complex regimen factors

**Support System Assessment:**
- Caregiver involvement
- Pharmacy services
- Technology assistance
- Educational needs

## ASSESSMENT OUTPUTS:

### MEDICATION APPROPRIATENESS SUMMARY
- Overall regimen assessment: [Appropriate/Needs Review/Concerning]
- Number of medications: [Count with complexity rating]
- Potentially inappropriate medications: [List with rationale]
- Interaction risk level: [Low/Medium/High/Critical]

### SPECIFIC MEDICATION CONCERNS
**High-Priority Issues:**
- [List medications requiring immediate review]
- [Drug interactions requiring intervention]
- [Dosing adjustments needed]
- [Monitoring requirements]

**Adherence Challenges:**
- [Specific barriers identified]
- [Missed dose patterns]
- [Administration difficulties]
- [Patient/caregiver concerns]

### CLINICAL RECOMMENDATIONS
**Immediate Actions (0-24 hours):**
- [Medication holds or adjustments]
- [Laboratory monitoring needed]
- [Side effect assessment]
- [Safety precautions]

**Short-term Optimization (1-7 days):**
- [Prescriber consultations needed]
- [Medication simplification opportunities]
- [Patient/caregiver education priorities]
- [Monitoring plan implementation]

**Long-term Management Strategy:**
- [Deprescribing opportunities]
- [Alternative therapy considerations]
- [Adherence improvement strategies]
- [Regular review schedule]

### SAFETY MONITORING PLAN
**Laboratory Monitoring:**
- [Required blood work and frequency]
- [Organ function assessments]
- [Drug level monitoring needs]

**Clinical Monitoring:**
- [Vital signs parameters]
- [Symptom tracking priorities]
- [Functional status monitoring]
- [Cognitive assessment needs]

⚠️ MEDICATION SAFETY REMINDERS:
- All medication changes require physician approval
- Consider "start low, go slow" for new medications
- Monitor for drug-related problems continuously
- Involve pharmacist in complex medication management
- Respect resident autonomy in medication decisions
- Document all medication-related assessments and interventions

This medication assessment is for clinical support only. All medication decisions must be made by licensed prescribers with full clinical oversight.`,
    variables: ['residentName', 'age', 'primaryDiagnoses', 'allergies', 'kidneyFunction', 'liverFunction', 'currentMedications', 'adherenceRate', 'missedDoses', 'administrationErrors', 'refusalEvents'],
    validationRules: [
      {
        rule: 'requires_pharmacist_review',
        description: 'Must emphasize need for pharmacist consultation',
        severity: 'error'
      },
      {
        rule: 'includes_safety_warnings',
        description: 'Must include medication safety warnings',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['medication_review', 'pharmacy_consultation', 'prescriber_communication'],
      userRoles: ['nurse', 'doctor', 'pharmacist'],
      maxTokens: 4000,
      temperature: 0.1
    },
    safety: {
      contentFilters: ['medication_advice', 'dosing_recommendations', 'drug_interactions'],
      complianceChecks: ['pharmaceutical_standards', 'geriatric_guidelines'],
      escalationTriggers: ['drug_interaction', 'inappropriate_medication', 'adherence_crisis']
    },
    medicalContext: {
      requiresPhysicianReview: true,
      auditLevel: 'comprehensive',
      familyVisible: false,
      emergencyCapable: false,
      cognitiveAssessment: false
    },
    complianceChecks: {
      hipaaRequired: true,
      consentRequired: false,
      supervisorApproval: true,
      medicalOversight: true
    },
    responseParameters: {
      dignityEmphasized: true,
      culturallySensitive: false,
      traumaInformed: false,
      strengthsBased: false
    }
  }
};

// ============================================================================
// SENIOR CARE FAMILY COMMUNICATION PROMPTS
// ============================================================================

export const FAMILY_COMMUNICATION_PROMPTS: ISeniorCarePromptSet = {
  familyUpdateSummary: {
    id: 'snr_fam_update_001',
    name: 'Family Update Summary',
    description: 'Respectful family communication about resident status and care',
    category: 'senior_care',
    type: 'response_template',
    version: '1.0.0',
    securityLevel: 'filtered',
    enabled: true,
    lastUpdated: '2024-01-15',
    author: 'One Barn Development Team',
    template: `Prepare a compassionate and informative update for the family of a senior resident, maintaining appropriate privacy while providing meaningful information about their loved one's wellbeing.

## FAMILY UPDATE CONTEXT:
- Resident: {{residentName}}
- Family Relationship: {{familyRelationship}}
- Communication Preferences: {{communicationPreferences}}
- Last Update: {{lastUpdateDate}}
- Update Type: {{updateType}}

## RESIDENT STATUS SUMMARY:
- Overall Wellbeing: {{overallStatus}}
- Recent Changes: {{recentChanges}}
- Care Highlights: {{careHighlights}}
- Social Activities: {{socialActivities}}

## FAMILY-APPROPRIATE COMMUNICATION:

### WELLBEING UPDATE
**Overall Status:**
{{residentName}} continues to receive compassionate, professional care from our team. Their overall wellbeing is [status summary in family-friendly language].

**Daily Life and Activities:**
- Participation in daily activities: [Description of engagement]
- Social interactions: [Family-appropriate social updates]
- Comfort and contentment: [Observations about mood and satisfaction]
- Personal preferences: [How we're honoring their choices]

**Physical Comfort:**
- Mobility and independence: [Functional status in accessible terms]
- Comfort measures: [Pain management, positioning, etc.]
- Sleep and rest: [Quality and patterns]
- Nutrition and hydration: [Eating habits and preferences]

### CARE TEAM UPDATES
**Professional Care:**
- Medical team involvement: [Physician visits, consultations]
- Nursing care highlights: [Special attention, monitoring]
- Therapy services: [Physical, occupational, speech therapy]
- Personal care: [Assistance with daily needs]

**Individualized Attention:**
- Personal preferences respected: [Specific examples]
- Cultural and spiritual care: [Religious services, cultural activities]
- Family connections: [How we facilitate family involvement]
- Special accommodations: [Customized care approaches]

### MEANINGFUL MOMENTS
**Positive Highlights:**
- [Share specific positive interactions or achievements]
- [Mention enjoyable activities or social connections]
- [Highlight maintained abilities and strengths]
- [Note any special moments or expressions of joy]

**Personal Connections:**
- [Staff interactions that bring comfort]
- [Relationships with other residents]
- [Moments of laughter or contentment]
- [Expressions of personality and preferences]

### FAMILY INVOLVEMENT OPPORTUNITIES
**Ways to Stay Connected:**
- Visiting guidelines and optimal times
- Activities family can participate in
- Items from home that would bring comfort
- Special occasions or celebrations to plan

**Communication Options:**
- Video calls or virtual visits
- Family meetings with care team
- Updates on specific concerns
- Ways to share family news with resident

### ADDRESSING CONCERNS
**If There Are Concerns:**
- [Address any issues with transparency and compassion]
- [Explain steps being taken to address problems]
- [Invite family input and collaboration]
- [Provide realistic timelines for improvements]

**Questions and Support:**
- [Encourage family questions and involvement]
- [Provide contact information for care team]
- [Offer additional resources or support]
- [Schedule follow-up communications]

## COMMUNICATION PRINCIPLES:
- Use clear, jargon-free language
- Focus on quality of life and dignity
- Emphasize person-centered care
- Be honest while remaining hopeful
- Respect family emotions and concerns
- Provide actionable ways for family involvement

## PRIVACY AND RESPECT CONSIDERATIONS:
- Share information appropriate for family relationship
- Maintain resident dignity in all descriptions
- Focus on wellbeing rather than medical details
- Respect any confidentiality preferences
- Use strengths-based language
- Acknowledge family love and concern

This update is prepared to strengthen family connections while maintaining appropriate privacy and medical confidentiality. All specific medical information should be discussed directly with healthcare providers.`,
    variables: ['residentName', 'familyRelationship', 'communicationPreferences', 'lastUpdateDate', 'updateType', 'overallStatus', 'recentChanges', 'careHighlights', 'socialActivities'],
    validationRules: [
      {
        rule: 'family_appropriate_language',
        description: 'Must use accessible, compassionate language for families',
        severity: 'error'
      },
      {
        rule: 'maintains_privacy',
        description: 'Must respect medical privacy while informing family',
        severity: 'error'
      }
    ],
    usage: {
      contexts: ['family_communication', 'care_updates', 'family_meetings'],
      userRoles: ['caregiver', 'nurse', 'admin'],
      maxTokens: 3000,
      temperature: 0.2
    },
    safety: {
      contentFilters: ['private_medical_info', 'pessimistic_language'],
      complianceChecks: ['family_communication_standards', 'privacy_protection'],
      escalationTriggers: ['family_concern', 'communication_breakdown']
    },
    medicalContext: {
      requiresPhysicianReview: false,
      auditLevel: 'basic',
      familyVisible: true,
      emergencyCapable: false,
      cognitiveAssessment: false
    },
    complianceChecks: {
      hipaaRequired: true,
      consentRequired: false,
      supervisorApproval: false,
      medicalOversight: false
    },
    responseParameters: {
      dignityEmphasized: true,
      culturallySensitive: true,
      traumaInformed: true,
      strengthsBased: true
    }
  }
};

// ============================================================================
// SENIOR CARE CONFIGURATION
// ============================================================================

export const aiSeniorCarePromptsConfig = {
  health: SENIOR_HEALTH_PROMPTS,
  family: FAMILY_COMMUNICATION_PROMPTS,
  
  // Configuration metadata
  version: '1.0.0',
  lastUpdated: '2024-01-15',
  defaultSecurityLevel: 'medical_only' as SecurityLevel,
  
  // Senior care specific settings
  seniorCareDefaults: {
    auditLevel: 'comprehensive' as const,
    dignityRequired: true,
    hipaaCompliance: true,
    familyAccessRestricted: true
  },
  
  // Compliance requirements
  complianceStandards: {
    medicalOversightRequired: true,
    supervisionLevel: 'licensed_professional',
    documentationRequired: true,
    qualityAssurance: true
  }
};

// Helper Functions
export const getSeniorCarePrompt = (
  category: keyof typeof aiSeniorCarePromptsConfig, 
  promptId: string
): ISeniorCarePromptConfig | null => {
  const categoryPrompts = aiSeniorCarePromptsConfig[category];
  if (typeof categoryPrompts === 'object' && categoryPrompts !== null && promptId in categoryPrompts) {
    return categoryPrompts[promptId];
  }
  return null;
};

export const getPromptsByMedicalContext = (
  requiresPhysicianReview: boolean,
  emergencyCapable: boolean
): ISeniorCarePromptConfig[] => {
  const allPrompts = [
    ...Object.values(SENIOR_HEALTH_PROMPTS),
    ...Object.values(FAMILY_COMMUNICATION_PROMPTS)
  ];
  
  return allPrompts.filter(prompt => 
    prompt.enabled &&
    prompt.medicalContext.requiresPhysicianReview === requiresPhysicianReview &&
    prompt.medicalContext.emergencyCapable === emergencyCapable
  );
};

export const validateSeniorCareAccess = (
  userRole: string,
  promptConfig: ISeniorCarePromptConfig
): { hasAccess: boolean; restrictions: string[] } => {
  const restrictions: string[] = [];
  
  // Check role permissions
  if (!promptConfig.usage.userRoles.includes(userRole)) {
    return { hasAccess: false, restrictions: ['Insufficient role permissions'] };
  }
  
  // Check medical oversight requirements
  if (promptConfig.complianceChecks.medicalOversight && !['doctor', 'nurse'].includes(userRole)) {
    restrictions.push('Requires medical professional oversight');
  }
  
  // Check supervisor approval requirements
  if (promptConfig.complianceChecks.supervisorApproval && !['admin', 'doctor'].includes(userRole)) {
    restrictions.push('Requires supervisor approval');
  }
  
  return {
    hasAccess: restrictions.length === 0,
    restrictions
  };
};

export const getAppropriateSecurityLevel = (
  userRole: string,
  contextType: string,
  medicalContext: boolean
): SecurityLevel => {
  // Medical contexts always require highest security
  if (medicalContext || contextType.includes('health') || contextType.includes('medical')) {
    return 'medical_only';
  }
  
  // Family communication can be filtered
  if (contextType.includes('family')) {
    return 'filtered';
  }
  
  // Admin users get restricted access
  if (userRole === 'admin') {
    return 'restricted';
  }
  
  return 'safe';
};

export default aiSeniorCarePromptsConfig; 