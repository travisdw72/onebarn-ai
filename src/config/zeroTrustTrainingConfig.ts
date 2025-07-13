// Temporary interface definitions until interface file is created
interface IZeroTrustTrainingConfig {
  dataClassification: any;
  stakeholderRoles: any;
  deviceTrustPolicies: any;
  realTimeStreamSecurity: any;
  videoSecurity: any;
  competitiveIntelligence: any;
  facilityAccess: any;
  equipmentAuthentication: any;
  dataGovernance: any;
  incidentResponse: any;
  securityTemplates: any;
  policyEnforcement: any;
}
import { brandConfig } from './brandConfig';

export const zeroTrustTrainingConfig: IZeroTrustTrainingConfig = {
  // 🔐 Data Classification Levels for Training Systems
  dataClassification: {
    levels: {
      PUBLIC: {
        label: "Public",
        color: brandConfig.colors.successGreen,
        description: "General training information safe for public viewing",
        retention: "indefinite",
        sharing: "unrestricted",
        encryption: "standard"
      },
      INTERNAL: {
        label: "Internal",
        color: brandConfig.colors.infoBlue,
        description: "Internal training methods and basic performance data",
        retention: "7_years",
        sharing: "facility_only",
        encryption: "enhanced"
      },
      CONFIDENTIAL: {
        label: "Confidential",
        color: brandConfig.colors.alertAmber,
        description: "Proprietary training techniques and detailed performance analytics",
        retention: "5_years",
        sharing: "need_to_know",
        encryption: "advanced"
      },
      RESTRICTED: {
        label: "Restricted",
        color: brandConfig.colors.errorRed,
        description: "Competition times, trade secrets, and competitive intelligence",
        retention: "3_years",
        sharing: "authorized_only",
        encryption: "maximum",
        watermarking: true,
        auditRequired: true
      },
      TOP_SECRET: {
        label: "Top Secret",
        color: brandConfig.colors.midnightBlack,
        description: "Highly sensitive competitive strategies and breakthrough methods",
        retention: "1_year",
        sharing: "owner_trainer_only",
        encryption: "quantum_safe",
        watermarking: true,
        auditRequired: true,
        accessRestrictions: "physical_presence_required"
      }
    },
    
    // Data Type Classifications
    dataTypes: {
      timing_data: {
        competition_times: "RESTRICTED",
        training_times: "CONFIDENTIAL",
        practice_times: "INTERNAL"
      },
      video_analysis: {
        technique_breakdown: "TOP_SECRET",
        performance_review: "CONFIDENTIAL",
        training_footage: "INTERNAL",
        promotional_content: "PUBLIC"
      },
      biometric_data: {
        horse_vitals: "CONFIDENTIAL",
        rider_biometrics: "RESTRICTED",
        stress_indicators: "CONFIDENTIAL"
      },
      training_methods: {
        proprietary_techniques: "TOP_SECRET",
        standard_exercises: "INTERNAL",
        public_clinics: "PUBLIC"
      },
      performance_metrics: {
        competition_analytics: "RESTRICTED",
        training_progress: "CONFIDENTIAL",
        basic_stats: "INTERNAL"
      }
    }
  },

  // 👥 Stakeholder Role Definitions and Permissions
  stakeholderRoles: {
    OWNER: {
      label: "Horse Owner",
      permissions: {
        view_performance_summaries: true,
        view_training_progress: true,
        view_health_metrics: true,
        view_competition_results: true,
        view_detailed_analytics: false,
        view_training_methods: false,
        access_live_training: true,
        download_reports: true,
        share_basic_metrics: true,
        access_historical_data: "6_months"
      },
      dataAccess: {
        maxClassification: "CONFIDENTIAL",
        restrictions: ["no_training_methods", "no_competitive_intelligence"],
        auditLevel: "standard"
      },
      sessionLimits: {
        maxDuration: 240, // 4 hours
        concurrentSessions: 2,
        deviceLimit: 3
      }
    },

    TRAINER: {
      label: "Professional Trainer",
      permissions: {
        view_all_training_data: true,
        modify_training_plans: true,
        access_ai_coaching: true,
        view_detailed_analytics: true,
        access_training_methods: true,
        manage_training_sessions: true,
        access_competitive_intelligence: true,
        export_training_data: true,
        create_custom_reports: true,
        access_historical_data: "unlimited"
      },
      dataAccess: {
        maxClassification: "TOP_SECRET",
        restrictions: [],
        auditLevel: "comprehensive"
      },
      sessionLimits: {
        maxDuration: 480, // 8 hours
        concurrentSessions: 5,
        deviceLimit: 10
      }
    },

    RIDER: {
      label: "Rider/Athlete",
      permissions: {
        view_personal_performance: true,
        view_training_feedback: true,
        access_coaching_notes: true,
        view_improvement_suggestions: true,
        access_training_videos: "own_only",
        view_competition_preparation: true,
        access_mental_training: true,
        view_fitness_tracking: true,
        download_personal_reports: true,
        access_historical_data: "1_year"
      },
      dataAccess: {
        maxClassification: "CONFIDENTIAL",
        restrictions: ["no_other_riders_data", "no_training_methods", "no_competitive_analysis"],
        auditLevel: "standard",
        selfDataOnly: true
      },
      sessionLimits: {
        maxDuration: 180, // 3 hours
        concurrentSessions: 2,
        deviceLimit: 2
      }
    },

    VETERINARIAN: {
      label: "Veterinarian",
      permissions: {
        view_health_metrics: true,
        view_stress_indicators: true,
        view_injury_risk_analysis: true,
        access_biometric_data: true,
        view_workload_analysis: true,
        create_health_reports: true,
        set_health_alerts: true,
        access_emergency_data: true,
        view_recovery_tracking: true,
        access_historical_data: "medical_relevant"
      },
      dataAccess: {
        maxClassification: "CONFIDENTIAL",
        restrictions: ["health_data_only", "no_training_methods", "no_competition_data"],
        auditLevel: "medical",
        healthDataFocus: true
      },
      sessionLimits: {
        maxDuration: 120, // 2 hours
        concurrentSessions: 3,
        deviceLimit: 2
      }
    },

    FACILITY_MANAGER: {
      label: "Facility Manager",
      permissions: {
        view_facility_usage: true,
        manage_equipment_status: true,
        view_safety_metrics: true,
        access_maintenance_data: true,
        view_scheduling_data: true,
        manage_arena_conditions: true,
        access_insurance_data: true,
        view_incident_reports: true,
        manage_access_control: true,
        access_historical_data: "facility_relevant"
      },
      dataAccess: {
        maxClassification: "INTERNAL",
        restrictions: ["facility_operations_only", "no_performance_data", "no_training_methods"],
        auditLevel: "operational"
      },
      sessionLimits: {
        maxDuration: 480, // 8 hours
        concurrentSessions: 3,
        deviceLimit: 5
      }
    },

    INSURANCE_AGENT: {
      label: "Insurance Representative",
      permissions: {
        view_safety_incidents: true,
        view_risk_assessments: true,
        access_injury_reports: true,
        view_compliance_data: true,
        access_facility_safety: true,
        view_emergency_procedures: true,
        download_safety_reports: true,
        view_equipment_maintenance: true,
        access_historical_data: "safety_incidents_only"
      },
      dataAccess: {
        maxClassification: "INTERNAL",
        restrictions: ["safety_data_only", "no_performance_data", "no_training_methods", "no_personal_data"],
        auditLevel: "compliance",
        purposeLimited: true
      },
      sessionLimits: {
        maxDuration: 60, // 1 hour
        concurrentSessions: 1,
        deviceLimit: 2
      }
    },

    COMPETITION_OFFICIAL: {
      label: "Competition Official",
      permissions: {
        view_eligibility_data: true,
        access_drug_testing_records: true,
        view_competition_history: true,
        access_disciplinary_records: true,
        view_qualification_status: true,
        access_registration_data: true,
        download_official_reports: true,
        verify_competition_times: true,
        access_historical_data: "competition_relevant"
      },
      dataAccess: {
        maxClassification: "CONFIDENTIAL",
        restrictions: ["competition_data_only", "no_training_methods", "no_proprietary_data"],
        auditLevel: "regulatory",
        officialUseOnly: true
      },
      sessionLimits: {
        maxDuration: 120, // 2 hours
        concurrentSessions: 2,
        deviceLimit: 3
      }
    }
  },

  // 🔒 Device Trust Policies for Training Equipment
  deviceTrustPolicies: {
    cameras: {
      requireCertification: true,
      encryptionRequired: true,
      tamperDetection: true,
      firmwareValidation: true,
      networkSegmentation: true,
      accessLogging: true,
      maxInactiveTime: 300, // 5 minutes
      trustValidationInterval: 60, // 1 minute
      allowedNetworks: ["training_vlan", "secure_wireless"],
      blockedNetworks: ["guest_wifi", "public_internet"],
      geofencing: {
        enabled: true,
        allowedZones: ["training_arena", "stable_area", "office"],
        alertOnViolation: true
      }
    },

    sensors: {
      requireCertification: true,
      encryptionRequired: true,
      dataIntegrityValidation: true,
      realTimeMonitoring: true,
      anomalyDetection: true,
      calibrationTracking: true,
      maxDataGap: 5, // 5 seconds
      trustValidationInterval: 30, // 30 seconds
      allowedProtocols: ["https", "wss", "mqtt_tls"],
      deviceFingerprinting: true,
      hardwareValidation: true
    },

    timingGates: {
      requireCertification: true,
      encryptionRequired: true,
      precisionValidation: true,
      synchronizationRequired: true,
      tamperDetection: true,
      backupValidation: true,
      maxTimingError: 0.001, // 1 millisecond
      trustValidationInterval: 15, // 15 seconds
      redundantSystems: true,
      officialCertification: true,
      competitionMode: {
        additionalSecurity: true,
        witnessRequired: true,
        sealedOperation: true
      }
    },

    mobileDevices: {
      requireCertification: true,
      encryptionRequired: true,
      requireMDM: true,
      biometricAuth: true,
      appWhitelist: true,
      jailbreakDetection: true,
      locationTracking: true,
      maxInactiveTime: 600, // 10 minutes
      trustValidationInterval: 120, // 2 minutes
      allowedApps: ["OneBarn", "TrainingMonitor", "SafetyAlert"],
      blockedApps: ["social_media", "file_sharing", "remote_access"],
      dataLeakPrevention: true
    }
  },

  // 🌐 Real-time Data Stream Security Requirements
  realTimeStreamSecurity: {
    encryption: {
      algorithm: "AES-256-GCM",
      keyRotation: 3600, // 1 hour
      perfectForwardSecrecy: true,
      quantumSafe: true
    },
    
    authentication: {
      method: "mTLS",
      certificateValidation: true,
      tokenRotation: 900, // 15 minutes
      sessionBinding: true
    },
    
    integrity: {
      digitalSignatures: true,
      timestamping: true,
      sequenceValidation: true,
      checksumValidation: true
    },
    
    monitoring: {
      latencyThreshold: 50, // milliseconds
      dropRateThreshold: 0.1, // 0.1%
      anomalyDetection: true,
      bandwidthMonitoring: true,
      qualityMetrics: true
    },
    
    failover: {
      backupStreams: 2,
      automaticSwitching: true,
      gracefulDegradation: true,
      offlineMode: true
    }
  },

  // 🎥 Video Encryption and Watermarking Policies
  videoSecurity: {
    encryption: {
      atRest: "AES-256",
      inTransit: "ChaCha20-Poly1305",
      keyManagement: "HSM",
      quantumSafe: true
    },
    
    watermarking: {
      enabled: true,
      method: "digital_invisible",
      userData: true,
      timestamp: true,
      deviceId: true,
      geoLocation: false, // Privacy consideration
      customText: true
    },
    
    digitalRightsManagement: {
      enabled: true,
      copyProtection: true,
      screenCapturePrevention: true,
      exportRestrictions: true,
      viewingTimeLimit: true,
      deviceBinding: true
    },
    
    qualityLevels: {
      training: {
        resolution: "1080p",
        bitrate: "5Mbps",
        retention: "1_year"
      },
      competition: {
        resolution: "4K",
        bitrate: "15Mbps",
        retention: "5_years"
      },
      analysis: {
        resolution: "720p",
        bitrate: "2Mbps",
        retention: "6_months"
      }
    }
  },

  // 🏆 Competitive Intelligence Protection Measures
  competitiveIntelligence: {
    classification: {
      autoClassification: true,
      manualReview: true,
      appeals: true,
      reclassificationInterval: "monthly"
    },
    
    protection: {
      accessLogging: true,
      viewingTimeTracking: true,
      screenshotPrevention: true,
      printingRestrictions: true,
      copyPasteBlocking: true,
      rightClickDisabled: true
    },
    
    sharing: {
      approvalRequired: true,
      recipientVerification: true,
      timeLimitedAccess: true,
      revocableAccess: true,
      auditTrail: true,
      nonDisclosureAgreement: true
    },
    
    monitoring: {
      behavioralAnalytics: true,
      unusualAccess: true,
      bulkDownloads: true,
      offHoursAccess: true,
      competitorAnalysis: true,
      riskScoring: true
    }
  },

  // 🏭 Training Facility Access Control
  facilityAccess: {
    zones: {
      training_arena: {
        securityLevel: "HIGH",
        accessMethods: ["keycard", "biometric"],
        allowedRoles: ["TRAINER", "RIDER", "OWNER", "VETERINARIAN"],
        timeRestrictions: {
          weekdays: "05:00-22:00",
          weekends: "06:00-20:00"
        },
        escortRequired: false,
        maxOccupancy: 10
      },
      
      equipment_room: {
        securityLevel: "MAXIMUM",
        accessMethods: ["biometric", "dual_authentication"],
        allowedRoles: ["TRAINER", "FACILITY_MANAGER"],
        timeRestrictions: {
          weekdays: "07:00-18:00",
          weekends: "08:00-16:00"
        },
        escortRequired: true,
        maxOccupancy: 3,
        auditRequired: true
      },
      
      control_room: {
        securityLevel: "MAXIMUM",
        accessMethods: ["biometric", "security_token"],
        allowedRoles: ["TRAINER", "FACILITY_MANAGER"],
        timeRestrictions: {
          always: true
        },
        escortRequired: true,
        maxOccupancy: 2,
        auditRequired: true,
        videoSurveillance: true
      },
      
      viewing_area: {
        securityLevel: "MEDIUM",
        accessMethods: ["keycard"],
        allowedRoles: ["OWNER", "RIDER", "TRAINER", "VETERINARIAN"],
        timeRestrictions: {
          training_hours_only: true
        },
        escortRequired: false,
        maxOccupancy: 20
      }
    },
    
    emergencyProcedures: {
      lockdownProtocol: true,
      emergencyExit: true,
      securityOverride: true,
      incidentResponse: true,
      evacuationPlan: true,
      communicationProtocol: true
    }
  },

  // 🔐 Equipment Authentication Requirements
  equipmentAuthentication: {
    certificates: {
      rootCA: "OneBarn_Training_CA",
      intermediateCA: "Equipment_CA",
      leafCertificates: true,
      certificateRevocation: true,
      ocspStapling: true
    },
    
    deviceProvisioning: {
      zeroTouchProvisioning: true,
      deviceAttestation: true,
      secureBootVerification: true,
      firmwareValidation: true,
      configurationManagement: true
    },
    
    continuousValidation: {
      heartbeatInterval: 30, // seconds
      healthChecks: true,
      performanceMonitoring: true,
      securityScanning: true,
      complianceChecking: true
    },
    
    incidentResponse: {
      automaticIsolation: true,
      alerting: true,
      forensicCapture: true,
      recoveryProcedures: true,
      replacementProtocol: true
    }
  },

  // 📊 Training Data Retention and Disposal Policies
  dataGovernance: {
    retention: {
      policies: {
        training_sessions: "2_years",
        performance_data: "5_years",
        video_footage: "1_year",
        biometric_data: "1_year",
        safety_incidents: "10_years",
        competition_data: "7_years",
        audit_logs: "7_years"
      },
      
      exceptions: {
        legal_hold: "indefinite",
        medical_records: "follow_medical_regulations",
        insurance_claims: "follow_insurance_requirements",
        regulatory_compliance: "follow_regulatory_requirements"
      },
      
      automation: {
        autoDelete: true,
        notificationBeforeDeletion: true,
        verificationRequired: true,
        auditTrail: true
      }
    },
    
    disposal: {
      methods: {
        secure_deletion: "NIST_800-88",
        physical_destruction: "certified",
        cryptographic_erasure: true,
        verification: true
      },
      
      procedures: {
        approvalRequired: true,
        witnessRequired: true,
        certificateOfDestruction: true,
        auditTrail: true,
        complianceReporting: true
      }
    }
  },

  // 🚨 Incident Response Procedures for Training Systems
  incidentResponse: {
    classification: {
      severity: {
        low: {
          description: "Minor system anomaly",
          response_time: "4_hours",
          escalation: false
        },
        medium: {
          description: "Training system disruption",
          response_time: "1_hour",
          escalation: true
        },
        high: {
          description: "Security breach or safety incident",
          response_time: "15_minutes",
          escalation: true,
          emergency_contacts: true
        },
        critical: {
          description: "Major breach or life safety issue",
          response_time: "immediate",
          escalation: true,
          emergency_contacts: true,
          external_authorities: true
        }
      }
    },
    
    procedures: {
      detection: {
        automated_monitoring: true,
        anomaly_detection: true,
        user_reporting: true,
        third_party_alerts: true
      },
      
      containment: {
        automatic_isolation: true,
        manual_override: true,
        backup_activation: true,
        service_degradation: true
      },
      
      investigation: {
        forensic_capture: true,
        evidence_preservation: true,
        root_cause_analysis: true,
        timeline_reconstruction: true
      },
      
      recovery: {
        service_restoration: true,
        data_recovery: true,
        system_validation: true,
        monitoring_enhancement: true
      },
      
      lessons_learned: {
        post_incident_review: true,
        process_improvement: true,
        training_updates: true,
        prevention_measures: true
      }
    }
  },

  // ⚙️ Security Configuration Templates
  securityTemplates: {
    training_session: {
      encryption: "AES-256",
      authentication: "multi_factor",
      authorization: "role_based",
      auditing: "comprehensive",
      monitoring: "real_time"
    },
    
    competition_mode: {
      encryption: "quantum_safe",
      authentication: "biometric_plus_token",
      authorization: "zero_trust",
      auditing: "maximum",
      monitoring: "continuous",
      witnessing: "required",
      integrity: "cryptographic_proof"
    },
    
    research_mode: {
      encryption: "AES-256",
      authentication: "institutional",
      authorization: "ethics_approved",
      auditing: "research_compliant",
      monitoring: "privacy_preserving",
      anonymization: "required"
    }
  },

  // 🔧 Security Policy Enforcement
  policyEnforcement: {
    automaticEnforcement: true,
    policyViolationAlerts: true,
    graduatedResponse: true,
    appealProcess: true,
    overrideCapability: {
      enabled: true,
      approvalRequired: true,
      auditRequired: true,
      timeBoxed: true
    },
    
    compliance: {
      continuousMonitoring: true,
      regularAudits: true,
      policyUpdates: true,
      trainingRequired: true,
      certificationTracking: true
    }
  }
};

// Helper functions for zero trust training operations
export const getStakeholderPermissions = (role: keyof typeof zeroTrustTrainingConfig.stakeholderRoles) => {
  return zeroTrustTrainingConfig.stakeholderRoles[role]?.permissions || {};
};

export const getDataClassification = (dataType: string) => {
  return zeroTrustTrainingConfig.dataClassification.dataTypes[dataType as keyof typeof zeroTrustTrainingConfig.dataClassification.dataTypes];
};

export const getDeviceTrustPolicy = (deviceType: keyof typeof zeroTrustTrainingConfig.deviceTrustPolicies) => {
  return zeroTrustTrainingConfig.deviceTrustPolicies[deviceType];
};

export const getFacilityAccessRules = (zone: string) => {
  return zeroTrustTrainingConfig.facilityAccess.zones[zone as keyof typeof zeroTrustTrainingConfig.facilityAccess.zones];
};

export const getSecurityTemplate = (mode: keyof typeof zeroTrustTrainingConfig.securityTemplates) => {
  return zeroTrustTrainingConfig.securityTemplates[mode];
};

export const validateDataAccess = (userRole: string, dataClassification: string, action: string) => {
  const roleConfig = zeroTrustTrainingConfig.stakeholderRoles[userRole as keyof typeof zeroTrustTrainingConfig.stakeholderRoles];
  if (!roleConfig) return false;
  
  const classificationLevels = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED", "TOP_SECRET"];
  const userMaxLevel = classificationLevels.indexOf(roleConfig.dataAccess.maxClassification);
  const dataLevel = classificationLevels.indexOf(dataClassification);
  
  return userMaxLevel >= dataLevel;
};

export const calculateSecurityRiskScore = (factors: {
  userRole: string;
  dataClassification: string;
  deviceTrust: number;
  locationTrust: number;
  timeTrust: number;
  behaviorTrust: number;
}) => {
  const weights = {
    role: 0.2,
    classification: 0.3,
    device: 0.2,
    location: 0.1,
    time: 0.1,
    behavior: 0.1
  };
  
  // Calculate weighted risk score (0-100, lower is better)
  const roleRisk = factors.userRole === 'TRAINER' ? 10 : factors.userRole === 'OWNER' ? 30 : 50;
  const classRisk = factors.dataClassification === 'PUBLIC' ? 10 : 
                   factors.dataClassification === 'INTERNAL' ? 30 :
                   factors.dataClassification === 'CONFIDENTIAL' ? 50 :
                   factors.dataClassification === 'RESTRICTED' ? 70 : 90;
  
  const riskScore = (
    roleRisk * weights.role +
    classRisk * weights.classification +
    (100 - factors.deviceTrust) * weights.device +
    (100 - factors.locationTrust) * weights.location +
    (100 - factors.timeTrust) * weights.time +
    (100 - factors.behaviorTrust) * weights.behavior
  );
  
  return Math.round(riskScore);
};

export default zeroTrustTrainingConfig; 