/**
 * Complete API Contracts Configuration for One Barn Platform
 * Single Source of Truth for ALL API endpoints and contracts
 * 
 * @description Comprehensive API contracts covering all business entities and operations
 * @compliance HIPAA compliant with tenant isolation and audit requirements  
 * @security Zero Trust architecture with role-based access control
 * @architecture Data Vault 2.0 compatible with historization support
 * @author One Barn Development Team
 * @since v1.0.0
 */

// ============================================================================
// BASE API CONFIGURATION
// ============================================================================

export const API_BASE_CONFIG = {
  version: 'v1',
  basePath: '/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  environments: {
    development: {
      baseUrl: 'http://localhost:3001',
      enableMocking: true,
      enableLogging: true
    },
    testing: {
      baseUrl: 'https://api-test.onebarn.com',
      enableMocking: false,
      enableLogging: true
    },
    production: {
      baseUrl: 'https://api.onebarn.com',
      enableMocking: false,
      enableLogging: false
    }
  }
} as const;

// ============================================================================
// CORE BUSINESS ENTITY API ENDPOINTS
// ============================================================================

export const ENTITY_API_ENDPOINTS = {
  // Horse Management APIs
  horses: {
    list: '/horses',
    create: '/horses',
    getById: '/horses/{id}',
    update: '/horses/{id}',
    delete: '/horses/{id}',
    search: '/horses/search',
    byOwner: '/horses/owner/{ownerId}',
    healthRecords: '/horses/{id}/health',
    trainingHistory: '/horses/{id}/training',
    competitions: '/horses/{id}/competitions',
    photos: '/horses/{id}/photos',
    videos: '/horses/{id}/videos'
  },

  // Client/User Management APIs
  clients: {
    list: '/clients',
    create: '/clients',
    getById: '/clients/{id}',
    update: '/clients/{id}',
    delete: '/clients/{id}',
    profile: '/clients/{id}/profile',
    horses: '/clients/{id}/horses',
    invoices: '/clients/{id}/invoices',
    documents: '/clients/{id}/documents'
  },

  // Employee Management APIs  
  employees: {
    list: '/employees',
    create: '/employees',
    getById: '/employees/{id}',
    update: '/employees/{id}',
    delete: '/employees/{id}',
    schedule: '/employees/{id}/schedule',
    certifications: '/employees/{id}/certifications',
    performance: '/employees/{id}/performance'
  },

  // Training Session APIs
  trainingSessions: {
    list: '/training/sessions',
    create: '/training/sessions',
    getById: '/training/sessions/{id}',
    update: '/training/sessions/{id}',
    delete: '/training/sessions/{id}',
    start: '/training/sessions/{id}/start',
    pause: '/training/sessions/{id}/pause',
    stop: '/training/sessions/{id}/stop',
    metrics: '/training/sessions/{id}/metrics',
    analysis: '/training/sessions/{id}/analysis'
  },

  // Facility Management APIs
  facilities: {
    list: '/facilities',
    create: '/facilities',
    getById: '/facilities/{id}',
    update: '/facilities/{id}',
    delete: '/facilities/{id}',
    schedule: '/facilities/{id}/schedule',
    equipment: '/facilities/{id}/equipment',
    maintenance: '/facilities/{id}/maintenance'
  },

  // Veterinary APIs
  veterinary: {
    appointments: '/veterinary/appointments',
    examinations: '/veterinary/examinations',
    treatments: '/veterinary/treatments',
    medications: '/veterinary/medications',
    vaccinations: '/veterinary/vaccinations',
    emergencies: '/veterinary/emergencies',
    reports: '/veterinary/reports'
  },

  // Competition APIs
  competitions: {
    list: '/competitions',
    create: '/competitions',
    getById: '/competitions/{id}',
    register: '/competitions/{id}/register',
    results: '/competitions/{id}/results',
    live: '/competitions/{id}/live',
    leaderboard: '/competitions/{id}/leaderboard'
  }
} as const;

// ============================================================================
// SYSTEM & OPERATIONAL API ENDPOINTS  
// ============================================================================

export const SYSTEM_API_ENDPOINTS = {
  // Authentication & Authorization
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    validate: '/auth/validate',
    permissions: '/auth/permissions',
    roles: '/auth/roles'
  },

  // Zero Trust Security
  security: {
    validateSession: '/security/session/validate',
    checkPermissions: '/security/permissions/check',
    assessDevice: '/security/device/assess',
    validateLocation: '/security/location/validate',
    calculateRisk: '/security/risk/calculate',
    logEvent: '/security/events/log',
    detectAnomalies: '/security/anomalies/detect',
    enforcePolicy: '/security/policy/enforce'
  },

  // Tenant Management
  tenants: {
    list: '/tenants',
    create: '/tenants',
    getById: '/tenants/{id}',
    update: '/tenants/{id}',
    settings: '/tenants/{id}/settings',
    users: '/tenants/{id}/users',
    billing: '/tenants/{id}/billing'
  },

  // File & Media Management
  files: {
    upload: '/files/upload',
    download: '/files/{id}',
    delete: '/files/{id}',
    metadata: '/files/{id}/metadata',
    thumbnail: '/files/{id}/thumbnail',
    batch: '/files/batch'
  },

  // Live Streaming & Camera
  streaming: {
    cameras: '/streaming/cameras',
    start: '/streaming/{cameraId}/start',
    stop: '/streaming/{cameraId}/stop',
    status: '/streaming/{cameraId}/status',
    recordings: '/streaming/{cameraId}/recordings'
  },

  // Notifications & Alerts
  notifications: {
    send: '/notifications/send',
    list: '/notifications',
    markRead: '/notifications/{id}/read',
    preferences: '/notifications/preferences',
    templates: '/notifications/templates'
  }
} as const;

// ============================================================================
// ANALYTICS & REPORTING API ENDPOINTS
// ============================================================================

export const ANALYTICS_API_ENDPOINTS = {
  // Business Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    reports: '/analytics/reports',
    metrics: '/analytics/metrics',
    trends: '/analytics/trends',
    export: '/analytics/export'
  },

  // Performance Analytics
  performance: {
    horse: '/analytics/performance/horse/{id}',
    trainer: '/analytics/performance/trainer/{id}',
    facility: '/analytics/performance/facility/{id}',
    comparison: '/analytics/performance/comparison'
  },

  // Financial Analytics
  financial: {
    revenue: '/analytics/financial/revenue',
    expenses: '/analytics/financial/expenses',
    profitability: '/analytics/financial/profitability',
    forecasting: '/analytics/financial/forecasting'
  }
} as const;

// ============================================================================
// DATA VAULT 2.0 SCHEMA DEFINITIONS
// ============================================================================

export const DATA_VAULT_SCHEMA = {
  // Hub Tables (Core Business Keys)
  hubs: {
    horse_h: {
      tableName: 'horse_h',
      schema: 'business',
      businessKey: 'horse_bk',
      hashKey: 'horse_hk'
    },
    client_h: {
      tableName: 'client_h', 
      schema: 'business',
      businessKey: 'client_bk',
      hashKey: 'client_hk'
    },
    employee_h: {
      tableName: 'employee_h',
      schema: 'business', 
      businessKey: 'employee_bk',
      hashKey: 'employee_hk'
    },
    training_session_h: {
      tableName: 'training_session_h',
      schema: 'business',
      businessKey: 'training_session_bk',
      hashKey: 'training_session_hk'
    },
    facility_h: {
      tableName: 'facility_h',
      schema: 'business',
      businessKey: 'facility_bk', 
      hashKey: 'facility_hk'
    },
    competition_h: {
      tableName: 'competition_h',
      schema: 'business',
      businessKey: 'competition_bk',
      hashKey: 'competition_hk'
    }
  },

  // Link Tables (Relationships)
  links: {
    client_horse_l: {
      tableName: 'client_horse_l',
      schema: 'business',
      hashKey: 'client_horse_hk',
      hubKeys: ['client_hk', 'horse_hk']
    },
    horse_training_session_l: {
      tableName: 'horse_training_session_l', 
      schema: 'business',
      hashKey: 'horse_training_session_hk',
      hubKeys: ['horse_hk', 'training_session_hk']
    },
    employee_training_session_l: {
      tableName: 'employee_training_session_l',
      schema: 'business', 
      hashKey: 'employee_training_session_hk',
      hubKeys: ['employee_hk', 'training_session_hk']
    }
  },

  // Satellite Tables (Descriptive Data)
  satellites: {
    horse_details_s: {
      tableName: 'horse_details_s',
      schema: 'business',
      parentHub: 'horse_h',
      trackHistory: true
    },
    client_details_s: {
      tableName: 'client_details_s',
      schema: 'business', 
      parentHub: 'client_h',
      trackHistory: true
    },
    training_session_details_s: {
      tableName: 'training_session_details_s',
      schema: 'business',
      parentHub: 'training_session_h', 
      trackHistory: true
    }
  }
} as const;

// ============================================================================
// REQUEST/RESPONSE INTERFACE TEMPLATES
// ============================================================================

export interface IBaseAPIRequest {
  tenantId: string;
  userId: string;
  requestId: string;
  timestamp: string;
  effectiveDate?: string;
  includeHistory?: boolean;
}

export interface IBaseAPIResponse {
  success: boolean;
  timestamp: string;
  requestId: string;
  processingTimeMs: number;
  errors?: string[];
  warnings?: string[];
  pagination?: IPaginationInfo;
}

export interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Entity-specific request/response interfaces
export interface IHorseListRequest extends IBaseAPIRequest {
  filters?: {
    ownerId?: string;
    breed?: string;
    status?: string;
    ageRange?: { min: number; max: number };
  };
  sorting?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
}

export interface IHorseListResponse extends IBaseAPIResponse {
  horses: IHorse[];
  totalCount: number;
}

export interface ITrainingSessionRequest extends IBaseAPIRequest {
  horseId: string;
  trainerId: string;
  facilityId?: string;
  disciplineType: string;
  sessionType: 'individual' | 'group' | 'assessment';
  scheduledDate: string;
  duration?: number;
  goals?: string[];
}

// ============================================================================
// STORED PROCEDURES FOR BUSINESS OPERATIONS
// ============================================================================

export const BUSINESS_STORED_PROCEDURES = {
  // Horse Management
  createHorse: {
    name: 'business.create_horse',
    parameters: [
      'p_horse_bk VARCHAR(255)',
      'p_owner_bk VARCHAR(255)', 
      'p_horse_name VARCHAR(255)',
      'p_breed VARCHAR(100)',
      'p_age INTEGER',
      'p_gender VARCHAR(20)',
      'p_registration_number VARCHAR(100)',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_horse_hk BYTEA',
      'p_message VARCHAR(500)'
    ]
  },

  // Training Session Management
  createTrainingSession: {
    name: 'business.create_training_session',
    parameters: [
      'p_session_bk VARCHAR(255)',
      'p_horse_bk VARCHAR(255)',
      'p_trainer_bk VARCHAR(255)',
      'p_facility_bk VARCHAR(255)',
      'p_discipline_type VARCHAR(100)',
      'p_scheduled_date TIMESTAMP',
      'p_duration_minutes INTEGER',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_session_hk BYTEA', 
      'p_session_id VARCHAR(255)'
    ]
  },

  // Client Management
  createClient: {
    name: 'business.create_client',
    parameters: [
      'p_client_bk VARCHAR(255)',
      'p_first_name VARCHAR(100)',
      'p_last_name VARCHAR(100)', 
      'p_email VARCHAR(255)',
      'p_phone VARCHAR(50)',
      'p_address JSONB',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_client_hk BYTEA',
      'p_client_id VARCHAR(255)'
    ]
  },

  // Financial Operations
  processPayment: {
    name: 'business.process_payment',
    parameters: [
      'p_client_bk VARCHAR(255)',
      'p_invoice_bk VARCHAR(255)',
      'p_payment_amount DECIMAL(10,2)',
      'p_payment_method VARCHAR(50)',
      'p_transaction_reference VARCHAR(255)',
      'p_tenant_id VARCHAR(255)'
    ],
    returns: [
      'p_success BOOLEAN',
      'p_payment_id VARCHAR(255)',
      'p_remaining_balance DECIMAL(10,2)'
    ]
  }
} as const;

// ============================================================================
// ERROR CODES & HANDLING
// ============================================================================

export const API_ERROR_CODES = {
  // Authentication Errors (1000-1099)
  AUTH_TOKEN_INVALID: {
    code: 1001,
    message: 'Invalid or expired authentication token',
    httpStatus: 401
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    code: 1002,
    message: 'Insufficient permissions for requested operation',
    httpStatus: 403
  },

  // Validation Errors (1100-1199)
  VALIDATION_REQUIRED_FIELD: {
    code: 1101,
    message: 'Required field is missing or invalid',
    httpStatus: 400
  },
  VALIDATION_INVALID_FORMAT: {
    code: 1102,
    message: 'Field format is invalid',
    httpStatus: 400
  },

  // Business Logic Errors (1200-1299)
  BUSINESS_HORSE_NOT_FOUND: {
    code: 1201,
    message: 'Horse not found or access denied',
    httpStatus: 404
  },
  BUSINESS_CLIENT_NOT_FOUND: {
    code: 1202,
    message: 'Client not found or access denied', 
    httpStatus: 404
  },
  BUSINESS_TRAINING_CONFLICT: {
    code: 1203,
    message: 'Training session conflicts with existing schedule',
    httpStatus: 409
  },

  // System Errors (1300-1399)
  SYSTEM_DATABASE_ERROR: {
    code: 1301,
    message: 'Database operation failed',
    httpStatus: 500
  },
  SYSTEM_EXTERNAL_SERVICE_ERROR: {
    code: 1302,
    message: 'External service unavailable',
    httpStatus: 503
  },

  // Tenant Errors (1400-1499)
  TENANT_NOT_FOUND: {
    code: 1401,
    message: 'Tenant not found or inactive',
    httpStatus: 404
  },
  TENANT_QUOTA_EXCEEDED: {
    code: 1402,
    message: 'Tenant quota exceeded',
    httpStatus: 429
  }
} as const;

// ============================================================================
// CONSOLIDATED EXPORT
// ============================================================================

export default {
  base: API_BASE_CONFIG,
  entities: ENTITY_API_ENDPOINTS,
  system: SYSTEM_API_ENDPOINTS,
  analytics: ANALYTICS_API_ENDPOINTS,
  dataVault: DATA_VAULT_SCHEMA,
  procedures: BUSINESS_STORED_PROCEDURES,
  errors: API_ERROR_CODES
} as const;

// ============================================================================
// TYPE DEFINITIONS FOR BUSINESS ENTITIES
// ============================================================================

export interface IHorse {
  id: string;
  businessKey: string;
  name: string;
  breed: string;
  age: number;
  gender: 'gelding' | 'mare' | 'stallion';
  registrationNumber?: string;
  ownerId: string;
  status: 'active' | 'training' | 'recovery' | 'retired';
  stallLocation?: string;
  cameraId?: string;
  photo?: string;
  healthStatus: string;
  lastActivity: string;
  createdDate: string;
  updatedDate: string;
  tenantId: string;
}

export interface IClient {
  id: string;
  businessKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  horses: string[]; // Horse IDs
  invoices: string[]; // Invoice IDs
  createdDate: string;
  updatedDate: string;
  tenantId: string;
}

export interface ITrainingSession {
  id: string;
  businessKey: string;
  horseId: string;
  trainerId: string;
  facilityId?: string;
  disciplineType: string;
  sessionType: 'individual' | 'group' | 'assessment';
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  goals: string[];
  notes?: string;
  metrics?: any;
  createdDate: string;
  updatedDate: string;
  tenantId: string;
} 