/**
 * AI System API Contracts for Data Vault 2.0 Integration
 * Single Source of Truth for all AI-related API interactions
 * 
 * @description Comprehensive API contracts for storing AI interactions, analytics, and audit data
 * @compliance HIPAA compliant with tenant isolation and audit requirements
 * @security Zero Trust architecture with role-based access control
 * @author One Barn Development Team
 * @since v1.0.0
 */

// ============================================================================
// CORE AI API ENDPOINTS CONFIGURATION
// ============================================================================

export const AI_API_ENDPOINTS = {
  // Base API configuration
  base: {
    version: 'v1',
    basePath: '/api/v1/ai',
    timeout: 30000,
    retryAttempts: 3
  },

  // AI Chat & Interaction Endpoints
  chat: {
    secureChat: '/secure-chat',
    batchChat: '/batch-chat',
    chatHistory: '/chat-history',
    chatSessions: '/chat-sessions'
  },

  // AI Analytics & Insights Endpoints
  analytics: {
    analyze: '/analyze',
    insights: '/insights',
    predictions: '/predictions',
    recommendations: '/recommendations'
  },

  // AI Audit & Compliance Endpoints
  audit: {
    interactions: '/audit/interactions',
    securityEvents: '/audit/security-events',
    complianceReports: '/audit/compliance-reports',
    dataAccess: '/audit/data-access'
  },

  // Senior Care Specific Endpoints
  seniorCare: {
    healthAnalysis: '/senior-care/health-analysis',
    wellnessRecommendations: '/senior-care/wellness',
    socialEngagement: '/senior-care/social-engagement',
    safetyAlerts: '/senior-care/safety-alerts',
    medicationReminders: '/senior-care/medication',
    activityRecommendations: '/senior-care/activities',
    cognitiveAssessment: '/senior-care/cognitive-assessment',
    emergencyResponse: '/senior-care/emergency'
  },

  // Horse Training Specific Endpoints (preserved)
  horseTraining: {
    performanceAnalysis: '/horse-training/performance',
    behaviorAnalysis: '/horse-training/behavior',
    healthMonitoring: '/horse-training/health',
    trainingRecommendations: '/horse-training/training-recommendations',
    competitionAnalysis: '/horse-training/competition'
  }
} as const;

// ============================================================================
// DATA VAULT 2.0 TABLE STRUCTURES FOR AI SYSTEM
// ============================================================================

export const AI_DATA_VAULT_SCHEMA = {
  // Hub Tables (Core Business Entities)
  hubs: {
    ai_interaction_h: {
      tableName: 'ai_interaction_h',
      schema: 'business',
      columns: {
        ai_interaction_hk: 'BYTEA PRIMARY KEY',
        ai_interaction_bk: 'VARCHAR(255) NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        record_source: 'VARCHAR(100) NOT NULL'
      }
    },

    ai_session_h: {
      tableName: 'ai_session_h',
      schema: 'business',
      columns: {
        ai_session_hk: 'BYTEA PRIMARY KEY',
        ai_session_bk: 'VARCHAR(255) NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        record_source: 'VARCHAR(100) NOT NULL'
      }
    },

    // Senior Care Specific Hubs
    senior_assessment_h: {
      tableName: 'senior_assessment_h',
      schema: 'business',
      columns: {
        senior_assessment_hk: 'BYTEA PRIMARY KEY',
        senior_assessment_bk: 'VARCHAR(255) NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        record_source: 'VARCHAR(100) NOT NULL'
      }
    },

    wellness_program_h: {
      tableName: 'wellness_program_h',
      schema: 'business',
      columns: {
        wellness_program_hk: 'BYTEA PRIMARY KEY',
        wellness_program_bk: 'VARCHAR(255) NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        record_source: 'VARCHAR(100) NOT NULL'
      }
    }
  },

  // Satellite Tables (Descriptive Data)
  satellites: {
    ai_interaction_details_s: {
      tableName: 'ai_interaction_details_s',
      schema: 'business',
      columns: {
        ai_interaction_hk: 'BYTEA NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        hash_diff: 'BYTEA NOT NULL',
        question_text: 'TEXT NOT NULL',
        response_text: 'TEXT NOT NULL',
        context_type: 'VARCHAR(50)',
        confidence_score: 'DECIMAL(5,4)',
        security_level: 'VARCHAR(20) NOT NULL',
        processing_time_ms: 'INTEGER',
        token_count_input: 'INTEGER',
        token_count_output: 'INTEGER',
        model_used: 'VARCHAR(100)',
        tenant_id: 'VARCHAR(255) NOT NULL',
        is_current: 'BOOLEAN NOT NULL DEFAULT TRUE'
      }
    },

    ai_interaction_security_s: {
      tableName: 'ai_interaction_security_s',
      schema: 'business',
      columns: {
        ai_interaction_hk: 'BYTEA NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        hash_diff: 'BYTEA NOT NULL',
        ip_address: 'INET',
        user_agent: 'TEXT',
        session_id: 'VARCHAR(255)',
        data_filters_applied: 'JSONB',
        response_filters_applied: 'JSONB',
        security_violations: 'JSONB',
        compliance_flags: 'JSONB',
        is_current: 'BOOLEAN NOT NULL DEFAULT TRUE'
      }
    },

    // Senior Care Specific Satellites
    senior_assessment_details_s: {
      tableName: 'senior_assessment_details_s',
      schema: 'business',
      columns: {
        senior_assessment_hk: 'BYTEA NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        hash_diff: 'BYTEA NOT NULL',
        assessment_type: 'VARCHAR(50) NOT NULL',
        assessment_results: 'JSONB NOT NULL',
        cognitive_score: 'DECIMAL(5,2)',
        physical_score: 'DECIMAL(5,2)',
        social_score: 'DECIMAL(5,2)',
        emotional_score: 'DECIMAL(5,2)',
        risk_factors: 'JSONB',
        recommendations: 'JSONB',
        assessor_type: 'VARCHAR(20) NOT NULL', // 'ai' or 'human'
        confidence_level: 'DECIMAL(5,4)',
        tenant_id: 'VARCHAR(255) NOT NULL',
        is_current: 'BOOLEAN NOT NULL DEFAULT TRUE'
      }
    },

    wellness_program_details_s: {
      tableName: 'wellness_program_details_s',
      schema: 'business',
      columns: {
        wellness_program_hk: 'BYTEA NOT NULL',
        load_date: 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP',
        hash_diff: 'BYTEA NOT NULL',
        program_type: 'VARCHAR(50) NOT NULL',
        program_details: 'JSONB NOT NULL',
        target_outcomes: 'JSONB',
        ai_recommendations: 'JSONB',
        participation_level: 'VARCHAR(20)',
        effectiveness_score: 'DECIMAL(5,2)',
        adaptation_notes: 'JSONB',
        tenant_id: 'VARCHAR(255) NOT NULL',
        is_current: 'BOOLEAN NOT NULL DEFAULT TRUE'
      }
    }
  }
} as const;

// ============================================================================
// API REQUEST/RESPONSE INTERFACES
// ============================================================================

export interface IAIBaseRequest {
  tenantId: string;
  userId: string;
  sessionId?: string;
  requestId: string;
  timestamp: string;
}

export interface IAIBaseResponse {
  success: boolean;
  timestamp: string;
  requestId: string;
  processingTimeMs: number;
  errors?: string[];
  warnings?: string[];
}

export interface IAISecureChatRequest extends IAIBaseRequest {
  question: string;
  context?: 'dashboard' | 'horse-profile' | 'training' | 'health' | 'senior-care' | 'wellness' | 'emergency';
  userRole: 'client' | 'employee' | 'manager' | 'admin' | 'caregiver' | 'nurse' | 'doctor';
  userPermissions: string[];
  effectiveDate?: string;
  includeHistory?: boolean;
}

export interface IAISecureChatResponse extends IAIBaseResponse {
  answer: string;
  confidence: number;
  sources: string[];
  securityLevel: 'safe' | 'filtered' | 'blocked';
  auditId: string;
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  modelUsed: string;
  providerUsed: string;
  dataFiltersApplied: string[];
  responseFiltersApplied: string[];
}

export interface IAIAnalyticsRequest extends IAIBaseRequest {
  analysisType: 'behavioral' | 'performance' | 'health' | 'training' | 'financial' | 'wellness' | 'cognitive' | 'social' | 'safety';
  dataScope: {
    horseIds?: string[];
    seniorIds?: string[];
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    includeHistorical?: boolean;
  };
  analysisParameters?: {
    confidenceThreshold?: number;
    includeRecommendations?: boolean;
    detailLevel?: 'summary' | 'detailed' | 'comprehensive';
  };
}

export interface IAIAnalyticsResponse extends IAIBaseResponse {
  analysisId: string;
  analysisType: string;
  insights: Array<{
    category: string;
    insight: string;
    confidence: number;
    supportingData: any[];
    recommendations?: string[];
  }>;
  summary: {
    totalDataPoints: number;
    averageConfidence: number;
    keyFindings: string[];
  };
}

// Senior Care Specific Interfaces
export interface ISeniorHealthAnalysisRequest extends IAIBaseRequest {
  seniorId: string;
  analysisTypes: ('vitals' | 'medication' | 'cognitive' | 'physical' | 'emotional' | 'social')[];
  timeframe: {
    startDate: string;
    endDate: string;
  };
  includeRiskAssessment: boolean;
  generateRecommendations: boolean;
}

export interface ISeniorHealthAnalysisResponse extends IAIBaseResponse {
  seniorId: string;
  healthScore: {
    overall: number;
    vitals: number;
    cognitive: number;
    physical: number;
    emotional: number;
    social: number;
  };
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    likelihood: number;
    impact: number;
    recommendations: string[];
  }>;
  trends: {
    improving: string[];
    declining: string[];
    stable: string[];
  };
  recommendations: Array<{
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    recommendation: string;
    expectedOutcome: string;
    timeframe: string;
  }>;
}

export interface IWellnessProgramRequest extends IAIBaseRequest {
  seniorId: string;
  currentPrograms?: string[];
  healthConditions?: string[];
  preferences?: {
    activityTypes: string[];
    difficultyLevel: 'low' | 'medium' | 'high';
    socialPreference: 'individual' | 'small_group' | 'large_group';
    timePreferences: string[];
  };
  goals?: string[];
}

export interface IWellnessProgramResponse extends IAIBaseResponse {
  recommendedPrograms: Array<{
    programId: string;
    name: string;
    description: string;
    category: 'physical' | 'cognitive' | 'social' | 'creative' | 'spiritual';
    difficulty: 'low' | 'medium' | 'high';
    duration: string;
    frequency: string;
    benefits: string[];
    contraindications: string[];
    personalizedAdaptations: string[];
  }>;
  schedule: {
    weekly: Array<{
      day: string;
      activities: Array<{
        time: string;
        activity: string;
        duration: number;
        type: string;
      }>;
    }>;
  };
}

export interface IAIAuditRequest extends IAIBaseRequest {
  auditType: 'interactions' | 'security-events' | 'compliance' | 'data-access' | 'health-decisions' | 'emergency-responses';
  filters?: {
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    userIds?: string[];
    securityLevels?: string[];
    seniorIds?: string[];
    emergencyTypes?: string[];
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export interface IAIAuditResponse extends IAIBaseResponse {
  auditRecords: Array<{
    auditId: string;
    interactionId: string;
    userId: string;
    timestamp: string;
    question: string;
    response: string;
    securityLevel: string;
    complianceFlags: string[];
    seniorId?: string;
    healthImpact?: 'none' | 'low' | 'medium' | 'high';
    emergencyFlag?: boolean;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
}

// ============================================================================
// STORED PROCEDURES FOR AI OPERATIONS
// ============================================================================

export const AI_STORED_PROCEDURES = {
  createAIInteraction: {
    name: 'business.create_ai_interaction',
    parameters: [
      'p_interaction_bk VARCHAR(255)',
      'p_user_bk VARCHAR(255)',
      'p_question_text TEXT',
      'p_response_text TEXT',
      'p_confidence_score DECIMAL(5,4)',
      'p_security_level VARCHAR(20)',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_interaction_hk BYTEA',
      'p_audit_id VARCHAR(255)'
    ]
  },

  getUserAIHistory: {
    name: 'business.get_user_ai_history',
    parameters: [
      'p_user_bk VARCHAR(255)',
      'p_tenant_id VARCHAR(255)',
      'p_start_date TIMESTAMP',
      'p_end_date TIMESTAMP',
      'p_page INTEGER DEFAULT 1',
      'p_page_size INTEGER DEFAULT 50'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_interactions JSONB',
      'p_total_count INTEGER'
    ]
  },

  // Senior Care Specific Procedures
  createSeniorAssessment: {
    name: 'business.create_senior_assessment',
    parameters: [
      'p_assessment_bk VARCHAR(255)',
      'p_senior_bk VARCHAR(255)',
      'p_user_bk VARCHAR(255)',
      'p_assessment_type VARCHAR(50)',
      'p_assessment_results JSONB',
      'p_cognitive_score DECIMAL(5,2)',
      'p_physical_score DECIMAL(5,2)',
      'p_social_score DECIMAL(5,2)',
      'p_emotional_score DECIMAL(5,2)',
      'p_risk_factors JSONB',
      'p_recommendations JSONB',
      'p_assessor_type VARCHAR(20)',
      'p_confidence_level DECIMAL(5,4)',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_assessment_hk BYTEA',
      'p_audit_id VARCHAR(255)'
    ]
  },

  getSeniorHealthTrends: {
    name: 'business.get_senior_health_trends',
    parameters: [
      'p_senior_bk VARCHAR(255)',
      'p_tenant_id VARCHAR(255)',
      'p_start_date TIMESTAMP',
      'p_end_date TIMESTAMP',
      'p_trend_types TEXT[]',
      'p_include_predictions BOOLEAN DEFAULT FALSE'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_trends JSONB',
      'p_predictions JSONB',
      'p_risk_alerts JSONB'
    ]
  },

  createWellnessProgram: {
    name: 'business.create_wellness_program',
    parameters: [
      'p_program_bk VARCHAR(255)',
      'p_senior_bk VARCHAR(255)',
      'p_user_bk VARCHAR(255)',
      'p_program_type VARCHAR(50)',
      'p_program_details JSONB',
      'p_target_outcomes JSONB',
      'p_ai_recommendations JSONB',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_program_hk BYTEA',
      'p_schedule_id VARCHAR(255)'
    ]
  }
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const AI_ERROR_CODES = {
  AUTH_TOKEN_INVALID: {
    code: 1001,
    message: 'Invalid or expired authentication token',
    httpStatus: 401
  },
  VALIDATION_QUESTION_EMPTY: {
    code: 1101,
    message: 'Question text cannot be empty',
    httpStatus: 400
  },
  AI_PROVIDER_UNAVAILABLE: {
    code: 1201,
    message: 'AI provider is currently unavailable',
    httpStatus: 503
  },
  SECURITY_CONTENT_BLOCKED: {
    code: 1301,
    message: 'Content blocked due to security policy violations',
    httpStatus: 403
  },

  // Senior Care Specific Error Codes
  SENIOR_NOT_FOUND: {
    code: 2001,
    message: 'Senior resident not found or access denied',
    httpStatus: 404
  },
  HEALTH_DATA_ACCESS_DENIED: {
    code: 2002,
    message: 'Insufficient permissions to access health data',
    httpStatus: 403
  },
  EMERGENCY_PROTOCOL_FAILED: {
    code: 2003,
    message: 'Emergency response protocol could not be activated',
    httpStatus: 500
  },
  MEDICATION_DATA_INVALID: {
    code: 2004,
    message: 'Medication data format is invalid or incomplete',
    httpStatus: 400
  },
  ASSESSMENT_INCOMPLETE: {
    code: 2005,
    message: 'Required assessment data is missing or incomplete',
    httpStatus: 400
  },
  CARE_PLAN_CONFLICT: {
    code: 2006,
    message: 'Proposed care plan conflicts with existing medical orders',
    httpStatus: 409
  }
} as const;

export default {
  endpoints: AI_API_ENDPOINTS,
  schema: AI_DATA_VAULT_SCHEMA,
  procedures: AI_STORED_PROCEDURES,
  errors: AI_ERROR_CODES
} as const; 