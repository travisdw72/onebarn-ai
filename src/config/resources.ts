import type { IResourceItem } from "@refinedev/core";
import { 
  HorseIcon, 
  TrainingIcon, 
  ClientIcon, 
  BillingIcon,
  AnalyticsIcon,
  StaffIcon,
  FacilityIcon,
  MessageIcon,
  ReportIcon,
  SettingsIcon
} from "../components/icons";

// ============================================================================
// REFINE RESOURCES CONFIGURATION
// ============================================================================
// This file defines all resources available in the application
// Resources are automatically filtered based on user permissions (RBAC)

export const resources: IResourceItem[] = [
  // ============================================================================
  // CORE EQUESTRIAN RESOURCES
  // ============================================================================
  
  {
    name: "horses",
    list: "/horses",
    create: "/horses/create",
    edit: "/horses/edit/:id",
    show: "/horses/show/:id",
    meta: {
      label: "Horses",
      icon: "HorseIcon",
      canDelete: true,
      dataProviderName: "default",
      // RBAC integration - these will be checked against user permissions
      requiredPermissions: ["horses:read"],
      createPermission: ["horses:write"],
      editPermission: ["horses:write"],
      deletePermission: ["horses:delete"],
      // Tenant isolation
      tenantIsolated: true,
      // AI Training System integration
      aiTrainingEnabled: true,
      disciplines: [
        "barrel_racing",
        "dressage", 
        "show_jumping",
        "cutting",
        "reining",
        "hunter_jumper",
        "eventing"
      ],
    },
  },

  {
    name: "training_sessions",
    list: "/training-sessions",
    create: "/training-sessions/create",
    edit: "/training-sessions/edit/:id",
    show: "/training-sessions/show/:id",
    meta: {
      label: "Training Sessions",
      icon: "TrainingIcon",
      canDelete: true,
      dataProviderName: "default",
      requiredPermissions: ["training:read"],
      createPermission: ["training:write"],
      editPermission: ["training:write"],
      deletePermission: ["training:delete"],
      tenantIsolated: true,
      // AI Training System integration
      aiTrainingEnabled: true,
      realTimeMonitoring: true,
      zeroTrustSecurity: true,
    },
  },

  {
    name: "clients",
    list: "/clients",
    create: "/clients/create", 
    edit: "/clients/edit/:id",
    show: "/clients/show/:id",
    meta: {
      label: "Clients",
      icon: "ClientIcon",
      canDelete: false, // Clients should be archived, not deleted
      dataProviderName: "default",
      requiredPermissions: ["clients:read"],
      createPermission: ["clients:write"],
      editPermission: ["clients:write"],
      tenantIsolated: true,
    },
  },

  // ============================================================================
  // BUSINESS MANAGEMENT RESOURCES
  // ============================================================================

  {
    name: "billing",
    list: "/billing",
    create: "/billing/create",
    edit: "/billing/edit/:id", 
    show: "/billing/show/:id",
    meta: {
      label: "Billing",
      icon: "BillingIcon",
      canDelete: false, // Financial records should never be deleted
      dataProviderName: "default",
      requiredPermissions: ["billing:read"],
      createPermission: ["billing:write"],
      editPermission: ["billing:write"],
      tenantIsolated: true,
      // Special handling for financial data
      auditRequired: true,
      encryptionRequired: true,
    },
  },

  {
    name: "staff",
    list: "/staff",
    create: "/staff/create",
    edit: "/staff/edit/:id",
    show: "/staff/show/:id", 
    meta: {
      label: "Staff",
      icon: "StaffIcon",
      canDelete: false, // Staff should be deactivated, not deleted
      dataProviderName: "default",
      requiredPermissions: ["staff:read"],
      createPermission: ["staff:write"],
      editPermission: ["staff:write"],
      tenantIsolated: true,
      // HR data requires special handling
      sensitiveData: true,
      auditRequired: true,
    },
  },

  {
    name: "facility",
    list: "/facility",
    create: "/facility/create",
    edit: "/facility/edit/:id",
    show: "/facility/show/:id",
    meta: {
      label: "Facility",
      icon: "FacilityIcon",
      canDelete: true,
      dataProviderName: "default", 
      requiredPermissions: ["facility:read"],
      createPermission: ["facility:write"],
      editPermission: ["facility:write"],
      deletePermission: ["facility:delete"],
      tenantIsolated: true,
    },
  },

  // ============================================================================
  // ANALYTICS & REPORTING RESOURCES
  // ============================================================================

  {
    name: "analytics",
    list: "/analytics",
    meta: {
      label: "Analytics",
      icon: "AnalyticsIcon",
      canDelete: false,
      dataProviderName: "default",
      requiredPermissions: ["analytics:read"],
      tenantIsolated: true,
      // AI Analytics integration
      aiEnabled: true,
      realTimeData: true,
    },
  },

  {
    name: "reports",
    list: "/reports",
    meta: {
      label: "Reports", 
      icon: "ReportIcon",
      canDelete: false,
      dataProviderName: "default",
      requiredPermissions: ["reports:read"],
      tenantIsolated: true,
      // Report generation
      exportFormats: ["pdf", "excel", "csv"],
      scheduledReports: true,
    },
  },

  // ============================================================================
  // COMMUNICATION RESOURCES
  // ============================================================================

  {
    name: "messages",
    list: "/messages",
    create: "/messages/create",
    show: "/messages/show/:id",
    meta: {
      label: "Messages",
      icon: "MessageIcon",
      canDelete: true,
      dataProviderName: "default",
      requiredPermissions: ["messages:read"],
      createPermission: ["messages:write"],
      deletePermission: ["messages:delete"],
      tenantIsolated: true,
      // Real-time messaging
      realTime: true,
      notifications: true,
    },
  },

  // ============================================================================
  // SYSTEM ADMINISTRATION RESOURCES
  // ============================================================================

  {
    name: "settings",
    list: "/settings",
    edit: "/settings/edit/:id",
    meta: {
      label: "Settings",
      icon: "SettingsIcon",
      canDelete: false,
      dataProviderName: "default",
      requiredPermissions: ["settings:read"],
      editPermission: ["settings:write"],
      tenantIsolated: true,
      // System configuration
      systemLevel: true,
      auditRequired: true,
    },
  },

  // ============================================================================
  // AI TRAINING SYSTEM RESOURCES
  // ============================================================================

  {
    name: "ai_training_sessions",
    list: "/ai-training",
    create: "/ai-training/create",
    edit: "/ai-training/edit/:id",
    show: "/ai-training/show/:id",
    meta: {
      label: "AI Training",
      icon: "TrainingIcon",
      canDelete: false, // Training data is valuable, archive instead
      dataProviderName: "default",
      requiredPermissions: ["ai_training:read"],
      createPermission: ["ai_training:write"],
      editPermission: ["ai_training:write"],
      tenantIsolated: true,
      // AI Training System specific
      aiTrainingEnabled: true,
      realTimeMonitoring: true,
      zeroTrustSecurity: true,
      disciplines: [
        "barrel_racing",
        "dressage",
        "show_jumping", 
        "cutting",
        "reining",
        "hunter_jumper",
        "eventing"
      ],
      // Security classifications
      dataClassifications: ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED", "TOP_SECRET"],
      // Stakeholder access
      stakeholderTypes: ["owner", "trainer", "veterinarian", "farrier", "nutritionist", "competitor", "analyst"],
    },
  },

  {
    name: "training_devices",
    list: "/training-devices",
    create: "/training-devices/create",
    edit: "/training-devices/edit/:id",
    show: "/training-devices/show/:id",
    meta: {
      label: "Training Devices",
      icon: "SettingsIcon",
      canDelete: true,
      dataProviderName: "default",
      requiredPermissions: ["devices:read"],
      createPermission: ["devices:write"],
      editPermission: ["devices:write"],
      deletePermission: ["devices:delete"],
      tenantIsolated: true,
      // IoT Device management
      deviceManagement: true,
      zeroTrustSecurity: true,
      realTimeMonitoring: true,
    },
  },

  {
    name: "security_events",
    list: "/security-events",
    show: "/security-events/show/:id",
    meta: {
      label: "Security Events",
      icon: "AnalyticsIcon",
      canDelete: false, // Security events must be preserved
      dataProviderName: "default",
      requiredPermissions: ["security:read"],
      tenantIsolated: true,
      // Security monitoring
      realTimeAlerts: true,
      auditRequired: true,
      encryptionRequired: true,
    },
  },
];

// ============================================================================
// RESOURCE UTILITIES
// ============================================================================

// Get resources filtered by user permissions
export const getResourcesForUser = (userPermissions: string[]): IResourceItem[] => {
  return resources.filter(resource => {
    const requiredPermissions = resource.meta?.requiredPermissions || [];
    
    // Check if user has at least one required permission
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission) || userPermissions.includes("*")
    );
  });
};

// Get resource by name
export const getResourceByName = (name: string): IResourceItem | undefined => {
  return resources.find(resource => resource.name === name);
};

// Get AI Training enabled resources
export const getAITrainingResources = (): IResourceItem[] => {
  return resources.filter(resource => resource.meta?.aiTrainingEnabled === true);
};

// Get resources that require tenant isolation
export const getTenantIsolatedResources = (): IResourceItem[] => {
  return resources.filter(resource => resource.meta?.tenantIsolated === true);
};

// Get resources with real-time capabilities
export const getRealTimeResources = (): IResourceItem[] => {
  return resources.filter(resource => 
    resource.meta?.realTimeMonitoring === true || resource.meta?.realTime === true
  );
};

// Resource metadata for development
export const resourceMetadata = {
  totalResources: resources.length,
  aiEnabledResources: getAITrainingResources().length,
  tenantIsolatedResources: getTenantIsolatedResources().length,
  realTimeResources: getRealTimeResources().length,
  
  // Resource categories
  categories: {
    core: ["horses", "training_sessions", "clients"],
    business: ["billing", "staff", "facility"],
    analytics: ["analytics", "reports"],
    communication: ["messages"],
    system: ["settings"],
    aiTraining: ["ai_training_sessions", "training_devices", "security_events"],
  },
  
  // Permission requirements summary
  permissionSummary: resources.reduce((acc, resource) => {
    const permissions = resource.meta?.requiredPermissions || [];
    permissions.forEach(permission => {
      acc[permission] = (acc[permission] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>),
};

// Development utilities
export const devResourceUtils = {
  // Log resource configuration
  logResourceConfig: () => {
    console.group("🏗️ Refine Resources Configuration");
    console.table(resources.map(r => ({
      name: r.name,
      label: r.meta?.label,
      permissions: r.meta?.requiredPermissions?.join(", "),
      aiEnabled: r.meta?.aiTrainingEnabled ? "✅" : "❌",
      tenantIsolated: r.meta?.tenantIsolated ? "✅" : "❌",
    })));
    console.log("📊 Metadata:", resourceMetadata);
    console.groupEnd();
  },
  
  // Validate resource configuration
  validateResources: () => {
    const issues: string[] = [];
    
    resources.forEach(resource => {
      // Check required fields
      if (!resource.name) {
        issues.push(`Resource missing name: ${JSON.stringify(resource)}`);
      }
      
      if (!resource.meta?.label) {
        issues.push(`Resource ${resource.name} missing label`);
      }
      
      if (!resource.meta?.requiredPermissions?.length) {
        issues.push(`Resource ${resource.name} missing required permissions`);
      }
      
      // Check AI Training resources have disciplines
      if (resource.meta?.aiTrainingEnabled && !resource.meta?.disciplines?.length) {
        issues.push(`AI Training resource ${resource.name} missing disciplines`);
      }
    });
    
    if (issues.length > 0) {
      console.warn("⚠️ Resource Configuration Issues:", issues);
    } else {
      console.log("✅ All resources configured correctly");
    }
    
    return issues;
  },
};

// Auto-validate in development
if (process.env.NODE_ENV === 'development') {
  devResourceUtils.validateResources();
} 