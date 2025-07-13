/**
 * AI Data Vault 2.0 Integration Configuration
 * Handles all AI data storage, retrieval, and audit operations
 * 
 * @description Complete integration layer between AI system and Data Vault 2.0
 * @compliance HIPAA compliant with full audit trail and tenant isolation
 * @security Zero Trust with role-based data access and encryption
 * @author One Barn Development Team
 * @since v1.0.0
 * @enhanced Enhanced for Senior Care AI data operations
 */

import type { 
  IAISecureChatRequest, 
  IAISecureChatResponse,
  IAIAnalyticsRequest,
  IAIAnalyticsResponse,
  IAIAuditRequest,
  IAIAuditResponse,
  ISeniorHealthAnalysisRequest,
  ISeniorHealthAnalysisResponse,
  IWellnessProgramRequest,
  IWellnessProgramResponse
} from './aiApiContracts';

// ============================================================================
// DATA VAULT 2.0 CONNECTION CONFIGURATION
// ============================================================================

export const DATA_VAULT_CONFIG = {
  // Database connection settings
  connection: {
    host: import.meta.env.VITE_DV_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_DV_PORT || '5432'),
    database: import.meta.env.VITE_DV_DATABASE || 'one_barn_dv',
    ssl: import.meta.env.VITE_DV_SSL === 'true',
    poolSize: {
      min: 5,
      max: 20
    },
    timeout: 30000
  },

  // Schema configuration
  schemas: {
    raw: 'raw',           // Raw data landing
    staging: 'staging',   // Data transformation
    business: 'business', // Core business vault
    infomart: 'infomart', // Business data marts
    audit: 'audit',       // Audit and compliance
    auth: 'auth',         // Authentication data
    healthcare: 'healthcare', // Healthcare-specific schema for senior care
    emergency: 'emergency'    // Emergency response schema
  },

  // Encryption settings
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90,
    encryptPHI: true,
    encryptPII: true,
    // Senior care specific encryption
    encryptMedicalData: true,
    encryptCognitiveData: true,
    encryptBehavioralData: true
  },

  // Audit settings
  audit: {
    logAllAccess: true,
    retentionDays: 2555, // 7 years for HIPAA compliance
    realTimeAlerting: true,
    complianceReporting: true,
    // Enhanced audit for senior care
    logMedicalDecisions: true,
    logEmergencyActions: true,
    logCognitiveTesting: true,
    logMedicationChanges: true
  }
} as const;

// ============================================================================
// AI DATA STORAGE OPERATIONS
// ============================================================================

export const AI_DATA_OPERATIONS = {
  // Store AI interaction with full audit trail
  storeAIInteraction: {
    procedureName: 'business.store_ai_interaction',
    description: 'Stores AI interaction with complete audit trail and tenant isolation',
    parameters: {
      interactionBk: 'VARCHAR(255)',
      sessionBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      questionText: 'TEXT',
      responseText: 'TEXT',
      contextType: 'VARCHAR(50)',
      confidenceScore: 'DECIMAL(5,4)',
      securityLevel: 'VARCHAR(20)',
      processingTimeMs: 'INTEGER',
      tokenCountInput: 'INTEGER',
      tokenCountOutput: 'INTEGER',
      modelUsed: 'VARCHAR(100)',
      providerUsed: 'VARCHAR(50)',
      ipAddress: 'INET',
      userAgent: 'TEXT',
      sessionId: 'VARCHAR(255)',
      requestId: 'VARCHAR(255)',
      dataFiltersApplied: 'JSONB',
      responseFiltersApplied: 'JSONB',
      securityViolations: 'JSONB',
      complianceFlags: 'JSONB',
      interactionTimestamp: 'TIMESTAMP',
      loadTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      interactionHk: 'BYTEA',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  },

  // Retrieve AI interaction history with tenant isolation
  getAIInteractionHistory: {
    procedureName: 'business.get_ai_interaction_history',
    description: 'Retrieves AI interaction history with proper tenant isolation',
    parameters: {
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userRole: 'VARCHAR(50)',
      userPermissions: 'TEXT[]',
      startDate: 'TIMESTAMP',
      endDate: 'TIMESTAMP',
      contextType: 'VARCHAR(50)',
      securityLevel: 'VARCHAR(20)',
      includeBlocked: 'BOOLEAN',
      pageNumber: 'INTEGER',
      pageSize: 'INTEGER',
      sortBy: 'VARCHAR(50)',
      sortDirection: 'VARCHAR(4)'
    },
    returns: {
      success: 'BOOLEAN',
      interactions: 'JSONB',
      totalCount: 'INTEGER',
      pageInfo: 'JSONB',
      message: 'TEXT'
    }
  },

  // Store AI analytics results
  storeAIAnalytics: {
    procedureName: 'business.store_ai_analytics',
    description: 'Stores AI analytics results with proper data governance',
    parameters: {
      analyticsBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      analysisType: 'VARCHAR(50)',
      analysisScope: 'JSONB',
      analysisResults: 'JSONB',
      confidenceMetrics: 'JSONB',
      recommendations: 'JSONB',
      dataSourcesUsed: 'JSONB',
      permissionsApplied: 'JSONB',
      dataFilters: 'JSONB',
      processingTimeMs: 'INTEGER',
      modelsUsed: 'TEXT[]',
      tokenUsage: 'JSONB',
      requestId: 'VARCHAR(255)',
      analysisTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      analyticsHk: 'BYTEA',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  },

  // Senior Care Specific Operations
  storeSeniorHealthAnalysis: {
    procedureName: 'healthcare.store_senior_health_analysis',
    description: 'Stores comprehensive senior health analysis with medical compliance',
    parameters: {
      analysisBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      analysisTypes: 'TEXT[]',
      healthScores: 'JSONB',
      riskFactors: 'JSONB',
      trends: 'JSONB',
      recommendations: 'JSONB',
      vitalSigns: 'JSONB',
      cognitiveScores: 'JSONB',
      physicalMetrics: 'JSONB',
      socialFactors: 'JSONB',
      emotionalState: 'JSONB',
      medicationData: 'JSONB',
      emergencyRiskLevel: 'VARCHAR(20)',
      analysisConfidence: 'DECIMAL(5,4)',
      dataSourcesUsed: 'JSONB',
      analysisTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      analysisHk: 'BYTEA',
      healthRiskAlerts: 'JSONB',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  },

  storeWellnessProgram: {
    procedureName: 'healthcare.store_wellness_program',
    description: 'Stores AI-recommended wellness programs with personalization data',
    parameters: {
      programBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      recommendedPrograms: 'JSONB',
      programSchedule: 'JSONB',
      personalizationFactors: 'JSONB',
      healthConditions: 'JSONB',
      preferences: 'JSONB',
      goals: 'JSONB',
      contraindications: 'JSONB',
      adaptations: 'JSONB',
      aiConfidence: 'DECIMAL(5,4)',
      programTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      programHk: 'BYTEA',
      scheduleId: 'VARCHAR(255)',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  },

  storeCognitiveAssessment: {
    procedureName: 'healthcare.store_cognitive_assessment',
    description: 'Stores cognitive assessment results with AI analysis',
    parameters: {
      assessmentBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      assessmentType: 'VARCHAR(50)',
      cognitiveScores: 'JSONB',
      memoryTests: 'JSONB',
      executiveFunction: 'JSONB',
      orientationTests: 'JSONB',
      languageTests: 'JSONB',
      attentionTests: 'JSONB',
      problemSolvingTests: 'JSONB',
      baselineComparison: 'JSONB',
      aiAnalysis: 'JSONB',
      riskFlags: 'JSONB',
      recommendations: 'JSONB',
      assessmentConfidence: 'DECIMAL(5,4)',
      assessmentTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      assessmentHk: 'BYTEA',
      cognitiveRiskLevel: 'VARCHAR(20)',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  },

  storeEmergencyResponse: {
    procedureName: 'emergency.store_emergency_response',
    description: 'Stores emergency detection and response data with immediate audit',
    parameters: {
      emergencyBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      emergencyType: 'VARCHAR(50)',
      detectionMethod: 'VARCHAR(50)',
      emergencyData: 'JSONB',
      aiDetectionConfidence: 'DECIMAL(5,4)',
      locationData: 'JSONB',
      vitalSignsAtEvent: 'JSONB',
      responseActions: 'JSONB',
      responseTimeMs: 'INTEGER',
      escalationLevel: 'INTEGER',
      resolutionStatus: 'VARCHAR(20)',
      medicalPersonnelNotified: 'BOOLEAN',
      familyNotified: 'BOOLEAN',
      emergencyTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      emergencyHk: 'BYTEA',
      responseProtocol: 'JSONB',
      auditId: 'VARCHAR(255)',
      message: 'TEXT'
    }
  }
} as const;

// ============================================================================
// TENANT ISOLATION AND SECURITY FUNCTIONS
// ============================================================================

export const AI_SECURITY_FUNCTIONS = {
  // Validate user access to AI features
  validateAIAccess: {
    functionName: 'auth.validate_ai_access',
    description: 'Validates user access to AI features based on role and permissions',
    parameters: {
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      requestedFeature: 'VARCHAR(100)',
      requestContext: 'JSONB'
    },
    returns: {
      hasAccess: 'BOOLEAN',
      permissions: 'TEXT[]',
      dataFilters: 'JSONB',
      restrictions: 'JSONB',
      auditRequired: 'BOOLEAN'
    }
  },

  // Get user's authorized data scope for AI
  getUserDataScope: {
    functionName: 'auth.get_user_ai_data_scope',
    description: 'Returns the scope of data user is authorized to access for AI operations',
    parameters: {
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userRole: 'VARCHAR(50)',
      requestedScope: 'JSONB'
    },
    returns: {
      authorizedHorses: 'TEXT[]',
      authorizedFacilities: 'TEXT[]',
      dataCategories: 'TEXT[]',
      timeRestrictions: 'JSONB',
      fieldRestrictions: 'JSONB'
    }
  },

  // Apply data filters for AI queries
  applyAIDataFilters: {
    functionName: 'business.apply_ai_data_filters',
    description: 'Applies appropriate data filters for AI queries based on user permissions',
    parameters: {
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userPermissions: 'TEXT[]',
      requestedData: 'JSONB',
      contextType: 'VARCHAR(50)'
    },
    returns: {
      filteredQuery: 'TEXT',
      appliedFilters: 'JSONB',
      excludedData: 'JSONB',
      warningMessages: 'TEXT[]'
    }
  },

  // Senior Care Specific Security Functions
  validateSeniorDataAccess: {
    functionName: 'auth.validate_senior_data_access',
    description: 'Validates access to senior health and personal data with HIPAA compliance',
    parameters: {
      userBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userRole: 'VARCHAR(50)',
      requestedDataTypes: 'TEXT[]',
      accessPurpose: 'VARCHAR(100)',
      accessContext: 'JSONB'
    },
    returns: {
      hasAccess: 'BOOLEAN',
      accessLevel: 'VARCHAR(50)', // 'full', 'limited', 'summary', 'none'
      authorizedDataTypes: 'TEXT[]',
      dataFilters: 'JSONB',
      auditRequired: 'BOOLEAN',
      consentRequired: 'BOOLEAN',
      accessRestrictions: 'JSONB'
    }
  },

  validateMedicalDataAccess: {
    functionName: 'auth.validate_medical_data_access',
    description: 'Validates access to medical and cognitive data with enhanced security',
    parameters: {
      userBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userRole: 'VARCHAR(50)',
      medicalCredentials: 'JSONB',
      accessReason: 'VARCHAR(100)',
      emergencyOverride: 'BOOLEAN'
    },
    returns: {
      hasAccess: 'BOOLEAN',
      accessLevel: 'VARCHAR(50)',
      medicalDataTypes: 'TEXT[]',
      temporaryAccess: 'BOOLEAN',
      accessDuration: 'INTEGER', // minutes
      supervisorApprovalRequired: 'BOOLEAN',
      auditFlags: 'JSONB'
    }
  },

  applySeniorDataFilters: {
    functionName: 'healthcare.apply_senior_data_filters',
    description: 'Applies privacy and security filters for senior care data queries',
    parameters: {
      userBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      userPermissions: 'TEXT[]',
      requestedData: 'JSONB',
      dataScope: 'VARCHAR(50)',
      privacyLevel: 'VARCHAR(20)'
    },
    returns: {
      filteredQuery: 'TEXT',
      appliedFilters: 'JSONB',
      maskedFields: 'TEXT[]',
      aggregatedData: 'JSONB',
      privacyWarnings: 'TEXT[]'
    }
  }
} as const;

// ============================================================================
// AUDIT AND COMPLIANCE OPERATIONS
// ============================================================================

export const AI_AUDIT_OPERATIONS = {
  // Log AI access for audit trail
  logAIAccess: {
    procedureName: 'audit.log_ai_access',
    description: 'Logs AI system access for compliance and audit purposes',
    parameters: {
      auditBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      accessType: 'VARCHAR(50)',
      resourceAccessed: 'VARCHAR(100)',
      accessResult: 'VARCHAR(20)',
      ipAddress: 'INET',
      userAgent: 'TEXT',
      sessionId: 'VARCHAR(255)',
      dataAccessed: 'JSONB',
      dataFilters: 'JSONB',
      sensitiveDataAccessed: 'BOOLEAN',
      hipaaRelevant: 'BOOLEAN',
      gdprRelevant: 'BOOLEAN',
      retentionRequired: 'BOOLEAN',
      accessTimestamp: 'TIMESTAMP',
      logTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      auditHk: 'BYTEA',
      auditId: 'VARCHAR(255)',
      complianceStatus: 'VARCHAR(50)'
    }
  },

  // Generate compliance reports
  generateComplianceReport: {
    procedureName: 'audit.generate_ai_compliance_report',
    description: 'Generates compliance reports for AI system usage',
    parameters: {
      reportBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      requestingUserBk: 'VARCHAR(255)',
      reportType: 'VARCHAR(50)',
      reportPeriod: 'JSONB',
      includeDetails: 'BOOLEAN',
      userFilter: 'TEXT[]',
      accessTypeFilter: 'TEXT[]',
      complianceFilter: 'TEXT[]'
    },
    returns: {
      success: 'BOOLEAN',
      reportData: 'JSONB',
      complianceStatus: 'VARCHAR(50)',
      violations: 'JSONB',
      recommendations: 'JSONB',
      reportId: 'VARCHAR(255)'
    }
  },

  // Senior Care Specific Audit Operations
  logMedicalDecision: {
    procedureName: 'audit.log_medical_decision',
    description: 'Logs AI-assisted medical decisions with full medical audit trail',
    parameters: {
      auditBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      userBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      decisionType: 'VARCHAR(50)',
      decisionContext: 'JSONB',
      aiRecommendation: 'JSONB',
      aiConfidence: 'DECIMAL(5,4)',
      humanReview: 'JSONB',
      finalDecision: 'JSONB',
      medicalRationale: 'TEXT',
      riskAssessment: 'JSONB',
      patientConsent: 'BOOLEAN',
      supervisorApproval: 'BOOLEAN',
      medicalPersonnelInvolved: 'TEXT[]',
      decisionTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      auditHk: 'BYTEA',
      medicalAuditId: 'VARCHAR(255)',
      complianceFlags: 'JSONB',
      followUpRequired: 'BOOLEAN'
    }
  },

  logEmergencyResponse: {
    procedureName: 'audit.log_emergency_response',
    description: 'Logs emergency detection and response with detailed audit trail',
    parameters: {
      auditBk: 'VARCHAR(255)',
      emergencyBk: 'VARCHAR(255)',
      seniorBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      emergencyType: 'VARCHAR(50)',
      detectionMethod: 'VARCHAR(50)',
      responseActions: 'JSONB',
      responseTimeMs: 'INTEGER',
      personnelNotified: 'JSONB',
      medicalIntervention: 'BOOLEAN',
      outcomeStatus: 'VARCHAR(50)',
      lessonsLearned: 'TEXT',
      systemPerformance: 'JSONB',
      emergencyTimestamp: 'TIMESTAMP'
    },
    returns: {
      success: 'BOOLEAN',
      auditHk: 'BYTEA',
      emergencyAuditId: 'VARCHAR(255)',
      performanceMetrics: 'JSONB',
      improvementRecommendations: 'JSONB'
    }
  },

  generateMedicalComplianceReport: {
    procedureName: 'audit.generate_medical_compliance_report',
    description: 'Generates medical compliance reports for senior care AI system',
    parameters: {
      reportBk: 'VARCHAR(255)',
      tenantId: 'VARCHAR(255)',
      requestingUserBk: 'VARCHAR(255)',
      reportScope: 'VARCHAR(50)', // 'facility', 'senior', 'department', 'system'
      reportPeriod: 'JSONB',
      seniorFilter: 'TEXT[]',
      medicalStaffFilter: 'TEXT[]',
      complianceAreas: 'TEXT[]', // 'HIPAA', 'state_regulations', 'facility_policies'
      includeRecommendations: 'BOOLEAN'
    },
    returns: {
      success: 'BOOLEAN',
      reportData: 'JSONB',
      complianceScore: 'DECIMAL(5,2)',
      violations: 'JSONB',
      riskAreas: 'JSONB',
      corrective_actions: 'JSONB',
      reportId: 'VARCHAR(255)'
    }
  }
} as const;

// ============================================================================
// DATA RETENTION AND ARCHIVAL
// ============================================================================

export const AI_DATA_LIFECYCLE = {
  // Archive old AI interactions
  archiveAIInteractions: {
    procedureName: 'business.archive_ai_interactions',
    description: 'Archives old AI interactions based on retention policies',
    parameters: {
      tenantId: 'VARCHAR(255)',      // Tenant context
      archiveBefore: 'TIMESTAMP',    // Archive interactions before this date
      archiveType: 'VARCHAR(50)',    // full, summary, metadata-only
      retainAudit: 'BOOLEAN'         // Whether to retain audit records
    },
    returns: {
      success: 'BOOLEAN',
      recordsArchived: 'INTEGER',    // Number of records archived
      archiveLocation: 'VARCHAR(500)', // Where data was archived
      auditRecordsRetained: 'INTEGER', // Audit records kept
      message: 'TEXT'
    }
  },

  // Purge data based on retention policies
  purgeExpiredData: {
    procedureName: 'business.purge_expired_ai_data',
    description: 'Purges AI data that has exceeded retention period',
    parameters: {
      tenantId: 'VARCHAR(255)',      // Tenant context
      purgeBefore: 'TIMESTAMP',      // Purge data before this date
      dataTypes: 'TEXT[]',           // Types of data to purge
      confirmPurge: 'BOOLEAN'        // Confirmation flag
    },
    returns: {
      success: 'BOOLEAN',
      recordsPurged: 'INTEGER',      // Number of records purged
      auditRecordsCreated: 'INTEGER', // Audit records for purge
      complianceStatus: 'VARCHAR(50)', // Compliance status
      message: 'TEXT'
    }
  },

  // Senior Care Specific Data Lifecycle
  archiveSeniorMedicalData: {
    procedureName: 'healthcare.archive_senior_medical_data',
    description: 'Archives senior medical data following healthcare retention policies',
    parameters: {
      tenantId: 'VARCHAR(255)',
      archiveBefore: 'TIMESTAMP',
      dataCategories: 'TEXT[]', // 'cognitive', 'medical', 'emergency', 'wellness'
      retentionPolicy: 'VARCHAR(50)', // 'legal_minimum', 'extended', 'permanent'
      anonymizationLevel: 'VARCHAR(20)' // 'none', 'partial', 'full'
    },
    returns: {
      success: 'BOOLEAN',
      medicalRecordsArchived: 'INTEGER',
      cognitiveDataArchived: 'INTEGER',
      emergencyRecordsArchived: 'INTEGER',
      archiveLocation: 'VARCHAR(500)',
      anonymizationReport: 'JSONB',
      complianceStatus: 'VARCHAR(50)'
    }
  }
} as const;

// ============================================================================
// PERFORMANCE AND MONITORING
// ============================================================================

export const AI_MONITORING_CONFIG = {
  // Performance metrics to track
  performanceMetrics: {
    responseTime: {
      metric: 'ai_response_time_ms',
      type: 'histogram',
      buckets: [100, 500, 1000, 5000, 10000, 30000],
      labels: ['tenant_id', 'user_role', 'context_type', 'provider']
    },
    
    tokenUsage: {
      metric: 'ai_tokens_used_total',
      type: 'counter',
      labels: ['tenant_id', 'provider', 'model', 'token_type']
    },
    
    securityEvents: {
      metric: 'ai_security_events_total',
      type: 'counter',
      labels: ['tenant_id', 'event_type', 'security_level']
    },

    // Senior Care Specific Metrics
    emergencyResponseTime: {
      metric: 'ai_emergency_response_time_ms',
      type: 'histogram',
      buckets: [500, 1000, 2000, 5000, 10000, 30000],
      labels: ['tenant_id', 'emergency_type', 'detection_method']
    },

    cognitiveAssessmentAccuracy: {
      metric: 'ai_cognitive_assessment_accuracy',
      type: 'gauge',
      labels: ['tenant_id', 'assessment_type', 'user_role']
    },

    medicalDecisionSupport: {
      metric: 'ai_medical_decision_support_total',
      type: 'counter',
      labels: ['tenant_id', 'decision_type', 'outcome']
    }
  },

  // Health check configuration
  healthChecks: {
    database: {
      name: 'ai_database_health',
      query: 'SELECT 1 FROM business.ai_interaction_h LIMIT 1',
      timeout: 5000,
      interval: 30000
    },
    
    aiProviders: {
      name: 'ai_providers_health',
      endpoints: ['openai', 'anthropic', 'grok'],
      timeout: 10000,
      interval: 60000
    },

    emergencySystem: {
      name: 'emergency_system_health',
      query: 'SELECT 1 FROM emergency.emergency_response_h LIMIT 1',
      timeout: 2000,
      interval: 15000 // More frequent checks for emergency system
    },

    medicalSystem: {
      name: 'medical_system_health',
      query: 'SELECT 1 FROM healthcare.senior_assessment_h LIMIT 1',
      timeout: 3000,
      interval: 30000
    }
  },

  // Alert configuration
  alerts: {
    highResponseTime: {
      condition: 'ai_response_time_ms > 10000',
      severity: 'warning',
      notification: ['email', 'slack']
    },
    
    securityViolation: {
      condition: 'ai_security_events_total > 10 in 5m',
      severity: 'critical',
      notification: ['email', 'sms', 'pagerduty']
    },

    emergencySystemFailure: {
      condition: 'ai_emergency_response_time_ms > 30000',
      severity: 'critical',
      notification: ['email', 'sms', 'pagerduty', 'medical_staff']
    },

    cognitiveAssessmentAnomaly: {
      condition: 'ai_cognitive_assessment_accuracy < 0.8',
      severity: 'warning',
      notification: ['email', 'medical_staff']
    },

    medicalDataBreach: {
      condition: 'unauthorized_medical_data_access > 0',
      severity: 'critical',
      notification: ['email', 'sms', 'compliance_officer', 'legal']
    }
  }
} as const;

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export default {
  dataVault: DATA_VAULT_CONFIG,
  operations: AI_DATA_OPERATIONS,
  security: AI_SECURITY_FUNCTIONS,
  audit: AI_AUDIT_OPERATIONS,
  lifecycle: AI_DATA_LIFECYCLE,
  monitoring: AI_MONITORING_CONFIG
} as const; 