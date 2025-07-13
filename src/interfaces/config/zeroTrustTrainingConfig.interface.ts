// Zero Trust Training Configuration Interface
export interface IZeroTrustTrainingConfig {
  dataClassification: IDataClassification;
  stakeholderRoles: IStakeholderRoles;
  deviceTrustPolicies: IDeviceTrustPolicies;
  realTimeStreamSecurity: IRealTimeStreamSecurity;
  videoSecurity: IVideoSecurity;
  competitiveIntelligence: ICompetitiveIntelligence;
  facilityAccess: IFacilityAccess;
  equipmentAuthentication: IEquipmentAuthentication;
  dataGovernance: IDataGovernance;
  incidentResponse: IIncidentResponse;
  securityTemplates: ISecurityTemplates;
  policyEnforcement: IPolicyEnforcement;
}

// Data Classification Interfaces
export interface IDataClassification {
  levels: IClassificationLevels;
  dataTypes: IDataTypes;
}

export interface IClassificationLevel {
  label: string;
  color: string;
  description: string;
  retention: string;
  sharing: string;
  encryption: string;
  watermarking?: boolean;
  auditRequired?: boolean;
  accessRestrictions?: string;
}

export interface IClassificationLevels {
  PUBLIC: IClassificationLevel;
  INTERNAL: IClassificationLevel;
  CONFIDENTIAL: IClassificationLevel;
  RESTRICTED: IClassificationLevel;
  TOP_SECRET: IClassificationLevel;
}

export interface IDataTypes {
  timing_data: {
    competition_times: string;
    training_times: string;
    practice_times: string;
  };
  video_analysis: {
    technique_breakdown: string;
    performance_review: string;
    training_footage: string;
    promotional_content: string;
  };
  biometric_data: {
    horse_vitals: string;
    rider_biometrics: string;
    stress_indicators: string;
  };
  training_methods: {
    proprietary_techniques: string;
    standard_exercises: string;
    public_clinics: string;
  };
  performance_metrics: {
    competition_analytics: string;
    training_progress: string;
    basic_stats: string;
  };
}

// Stakeholder Role Interfaces
export interface IStakeholderRoles {
  OWNER: IStakeholderRole;
  TRAINER: IStakeholderRole;
  RIDER: IStakeholderRole;
  VETERINARIAN: IStakeholderRole;
  FACILITY_MANAGER: IStakeholderRole;
  INSURANCE_AGENT: IStakeholderRole;
  COMPETITION_OFFICIAL: IStakeholderRole;
}

export interface IStakeholderRole {
  label: string;
  permissions: IStakeholderPermissions;
  dataAccess: IDataAccessRules;
  sessionLimits: ISessionLimits;
}

export interface IStakeholderPermissions {
  [key: string]: boolean | string;
  view_performance_summaries?: boolean;
  view_training_progress?: boolean;
  view_health_metrics?: boolean;
  view_competition_results?: boolean;
  view_detailed_analytics?: boolean;
  view_training_methods?: boolean;
  access_live_training?: boolean;
  download_reports?: boolean;
  share_basic_metrics?: boolean;
  access_historical_data?: string;
  view_all_training_data?: boolean;
  modify_training_plans?: boolean;
  access_ai_coaching?: boolean;
  manage_training_sessions?: boolean;
  access_competitive_intelligence?: boolean;
  export_training_data?: boolean;
  create_custom_reports?: boolean;
}

export interface IDataAccessRules {
  maxClassification: string;
  restrictions: string[];
  auditLevel: string;
  selfDataOnly?: boolean;
  healthDataFocus?: boolean;
  purposeLimited?: boolean;
  officialUseOnly?: boolean;
}

export interface ISessionLimits {
  maxDuration: number; // minutes
  concurrentSessions: number;
  deviceLimit: number;
}

// Device Trust Policy Interfaces
export interface IDeviceTrustPolicies {
  cameras: IDeviceTrustPolicy;
  sensors: IDeviceTrustPolicy;
  timingGates: ITimingGatePolicy;
  mobileDevices: IMobileDevicePolicy;
}

export interface IDeviceTrustPolicy {
  requireCertification: boolean;
  encryptionRequired: boolean;
  tamperDetection?: boolean;
  firmwareValidation?: boolean;
  networkSegmentation?: boolean;
  accessLogging?: boolean;
  maxInactiveTime?: number;
  trustValidationInterval: number;
  allowedNetworks?: string[];
  blockedNetworks?: string[];
  geofencing?: IGeofencing;
  dataIntegrityValidation?: boolean;
  realTimeMonitoring?: boolean;
  anomalyDetection?: boolean;
  calibrationTracking?: boolean;
  maxDataGap?: number;
  allowedProtocols?: string[];
  deviceFingerprinting?: boolean;
  hardwareValidation?: boolean;
}

export interface ITimingGatePolicy extends IDeviceTrustPolicy {
  precisionValidation: boolean;
  synchronizationRequired: boolean;
  backupValidation: boolean;
  maxTimingError: number;
  redundantSystems: boolean;
  officialCertification: boolean;
  competitionMode: {
    additionalSecurity: boolean;
    witnessRequired: boolean;
    sealedOperation: boolean;
  };
}

export interface IMobileDevicePolicy extends IDeviceTrustPolicy {
  requireMDM: boolean;
  biometricAuth: boolean;
  appWhitelist: boolean;
  jailbreakDetection: boolean;
  locationTracking: boolean;
  allowedApps: string[];
  blockedApps: string[];
  dataLeakPrevention: boolean;
}

export interface IGeofencing {
  enabled: boolean;
  allowedZones: string[];
  alertOnViolation: boolean;
}

// Real-time Stream Security Interface
export interface IRealTimeStreamSecurity {
  encryption: IStreamEncryption;
  authentication: IStreamAuthentication;
  integrity: IStreamIntegrity;
  monitoring: IStreamMonitoring;
  failover: IStreamFailover;
}

export interface IStreamEncryption {
  algorithm: string;
  keyRotation: number;
  perfectForwardSecrecy: boolean;
  quantumSafe: boolean;
}

export interface IStreamAuthentication {
  method: string;
  certificateValidation: boolean;
  tokenRotation: number;
  sessionBinding: boolean;
}

export interface IStreamIntegrity {
  digitalSignatures: boolean;
  timestamping: boolean;
  sequenceValidation: boolean;
  checksumValidation: boolean;
}

export interface IStreamMonitoring {
  latencyThreshold: number;
  dropRateThreshold: number;
  anomalyDetection: boolean;
  bandwidthMonitoring: boolean;
  qualityMetrics: boolean;
}

export interface IStreamFailover {
  backupStreams: number;
  automaticSwitching: boolean;
  gracefulDegradation: boolean;
  offlineMode: boolean;
}

// Video Security Interface
export interface IVideoSecurity {
  encryption: IVideoEncryption;
  watermarking: IWatermarking;
  digitalRightsManagement: IDigitalRightsManagement;
  qualityLevels: IVideoQualityLevels;
}

export interface IVideoEncryption {
  atRest: string;
  inTransit: string;
  keyManagement: string;
  quantumSafe: boolean;
}

export interface IWatermarking {
  enabled: boolean;
  method: string;
  userData: boolean;
  timestamp: boolean;
  deviceId: boolean;
  geoLocation: boolean;
  customText: boolean;
}

export interface IDigitalRightsManagement {
  enabled: boolean;
  copyProtection: boolean;
  screenCapturePrevention: boolean;
  exportRestrictions: boolean;
  viewingTimeLimit: boolean;
  deviceBinding: boolean;
}

export interface IVideoQualityLevels {
  training: IVideoQuality;
  competition: IVideoQuality;
  analysis: IVideoQuality;
}

export interface IVideoQuality {
  resolution: string;
  bitrate: string;
  retention: string;
}

// Competitive Intelligence Interface
export interface ICompetitiveIntelligence {
  classification: IIntelligenceClassification;
  protection: IIntelligenceProtection;
  sharing: IIntelligenceSharing;
  monitoring: IIntelligenceMonitoring;
}

export interface IIntelligenceClassification {
  autoClassification: boolean;
  manualReview: boolean;
  appeals: boolean;
  reclassificationInterval: string;
}

export interface IIntelligenceProtection {
  accessLogging: boolean;
  viewingTimeTracking: boolean;
  screenshotPrevention: boolean;
  printingRestrictions: boolean;
  copyPasteBlocking: boolean;
  rightClickDisabled: boolean;
}

export interface IIntelligenceSharing {
  approvalRequired: boolean;
  recipientVerification: boolean;
  timeLimitedAccess: boolean;
  revocableAccess: boolean;
  auditTrail: boolean;
  nonDisclosureAgreement: boolean;
}

export interface IIntelligenceMonitoring {
  behavioralAnalytics: boolean;
  unusualAccess: boolean;
  bulkDownloads: boolean;
  offHoursAccess: boolean;
  competitorAnalysis: boolean;
  riskScoring: boolean;
}

// Facility Access Interface
export interface IFacilityAccess {
  zones: IFacilityZones;
  emergencyProcedures: IEmergencyProcedures;
}

export interface IFacilityZones {
  training_arena: IFacilityZone;
  equipment_room: IFacilityZone;
  control_room: IFacilityZone;
  viewing_area: IFacilityZone;
}

export interface IFacilityZone {
  securityLevel: string;
  accessMethods: string[];
  allowedRoles: string[];
  timeRestrictions: ITimeRestrictions;
  escortRequired: boolean;
  maxOccupancy: number;
  auditRequired?: boolean;
  videoSurveillance?: boolean;
}

export interface ITimeRestrictions {
  weekdays?: string;
  weekends?: string;
  always?: boolean;
  training_hours_only?: boolean;
}

export interface IEmergencyProcedures {
  lockdownProtocol: boolean;
  emergencyExit: boolean;
  securityOverride: boolean;
  incidentResponse: boolean;
  evacuationPlan: boolean;
  communicationProtocol: boolean;
}

// Equipment Authentication Interface
export interface IEquipmentAuthentication {
  certificates: ICertificateManagement;
  deviceProvisioning: IDeviceProvisioning;
  continuousValidation: IContinuousValidation;
  incidentResponse: IEquipmentIncidentResponse;
}

export interface ICertificateManagement {
  rootCA: string;
  intermediateCA: string;
  leafCertificates: boolean;
  certificateRevocation: boolean;
  ocspStapling: boolean;
}

export interface IDeviceProvisioning {
  zeroTouchProvisioning: boolean;
  deviceAttestation: boolean;
  secureBootVerification: boolean;
  firmwareValidation: boolean;
  configurationManagement: boolean;
}

export interface IContinuousValidation {
  heartbeatInterval: number;
  healthChecks: boolean;
  performanceMonitoring: boolean;
  securityScanning: boolean;
  complianceChecking: boolean;
}

export interface IEquipmentIncidentResponse {
  automaticIsolation: boolean;
  alerting: boolean;
  forensicCapture: boolean;
  recoveryProcedures: boolean;
  replacementProtocol: boolean;
}

// Data Governance Interface
export interface IDataGovernance {
  retention: IDataRetention;
  disposal: IDataDisposal;
}

export interface IDataRetention {
  policies: IRetentionPolicies;
  exceptions: IRetentionExceptions;
  automation: IRetentionAutomation;
}

export interface IRetentionPolicies {
  training_sessions: string;
  performance_data: string;
  video_footage: string;
  biometric_data: string;
  safety_incidents: string;
  competition_data: string;
  audit_logs: string;
}

export interface IRetentionExceptions {
  legal_hold: string;
  medical_records: string;
  insurance_claims: string;
  regulatory_compliance: string;
}

export interface IRetentionAutomation {
  autoDelete: boolean;
  notificationBeforeDeletion: boolean;
  verificationRequired: boolean;
  auditTrail: boolean;
}

export interface IDataDisposal {
  methods: IDisposalMethods;
  procedures: IDisposalProcedures;
}

export interface IDisposalMethods {
  secure_deletion: string;
  physical_destruction: string;
  cryptographic_erasure: boolean;
  verification: boolean;
}

export interface IDisposalProcedures {
  approvalRequired: boolean;
  witnessRequired: boolean;
  certificateOfDestruction: boolean;
  auditTrail: boolean;
  complianceReporting: boolean;
}

// Incident Response Interface
export interface IIncidentResponse {
  classification: IIncidentClassification;
  procedures: IIncidentProcedures;
}

export interface IIncidentClassification {
  severity: ISeverityLevels;
}

export interface ISeverityLevels {
  low: ISeverityLevel;
  medium: ISeverityLevel;
  high: ISeverityLevel;
  critical: ISeverityLevel;
}

export interface ISeverityLevel {
  description: string;
  response_time: string;
  escalation: boolean;
  emergency_contacts?: boolean;
  external_authorities?: boolean;
}

export interface IIncidentProcedures {
  detection: IIncidentDetection;
  containment: IIncidentContainment;
  investigation: IIncidentInvestigation;
  recovery: IIncidentRecovery;
  lessons_learned: ILessonsLearned;
}

export interface IIncidentDetection {
  automated_monitoring: boolean;
  anomaly_detection: boolean;
  user_reporting: boolean;
  third_party_alerts: boolean;
}

export interface IIncidentContainment {
  automatic_isolation: boolean;
  manual_override: boolean;
  backup_activation: boolean;
  service_degradation: boolean;
}

export interface IIncidentInvestigation {
  forensic_capture: boolean;
  evidence_preservation: boolean;
  root_cause_analysis: boolean;
  timeline_reconstruction: boolean;
}

export interface IIncidentRecovery {
  service_restoration: boolean;
  data_recovery: boolean;
  system_validation: boolean;
  monitoring_enhancement: boolean;
}

export interface ILessonsLearned {
  post_incident_review: boolean;
  process_improvement: boolean;
  training_updates: boolean;
  prevention_measures: boolean;
}

// Security Templates Interface
export interface ISecurityTemplates {
  training_session: ISecurityTemplate;
  competition_mode: ICompetitionSecurityTemplate;
  research_mode: IResearchSecurityTemplate;
}

export interface ISecurityTemplate {
  encryption: string;
  authentication: string;
  authorization: string;
  auditing: string;
  monitoring: string;
}

export interface ICompetitionSecurityTemplate extends ISecurityTemplate {
  witnessing: string;
  integrity: string;
}

export interface IResearchSecurityTemplate extends ISecurityTemplate {
  anonymization: string;
}

// Policy Enforcement Interface
export interface IPolicyEnforcement {
  automaticEnforcement: boolean;
  policyViolationAlerts: boolean;
  graduatedResponse: boolean;
  appealProcess: boolean;
  overrideCapability: IOverrideCapability;
  compliance: IComplianceManagement;
}

export interface IOverrideCapability {
  enabled: boolean;
  approvalRequired: boolean;
  auditRequired: boolean;
  timeBoxed: boolean;
}

export interface IComplianceManagement {
  continuousMonitoring: boolean;
  regularAudits: boolean;
  policyUpdates: boolean;
  trainingRequired: boolean;
  certificationTracking: boolean;
}

// Security Risk Assessment Interface
export interface ISecurityRiskFactors {
  userRole: string;
  dataClassification: string;
  deviceTrust: number;
  locationTrust: number;
  timeTrust: number;
  behaviorTrust: number;
}

// Function return types
export type StakeholderPermissions = IStakeholderPermissions;
export type DataClassificationResult = string | undefined;
export type DeviceTrustPolicy = IDeviceTrustPolicy | ITimingGatePolicy | IMobileDevicePolicy | undefined;
export type FacilityAccessRules = IFacilityZone | undefined;
export type SecurityTemplate = ISecurityTemplate | ICompetitionSecurityTemplate | IResearchSecurityTemplate | undefined; 