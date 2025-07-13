// RBAC Permissions Configuration - Simplified to 5 Core Roles
// ALL role definitions, permissions, and access control rules

export interface IPermission {
  resource: string;
  actions: string[];
  filters?: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'in' | 'not_in' | 'contains';
    value: string | string[];
  }>;
  columns?: string[];
}

export interface IRoleDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  level: number; // 1 = lowest access, 5 = highest access
  color: string;
  icon: string;
  badge: string;
  inheritsFrom?: string[];
  permissions: IPermission[];
  dashboardModules: string[];
  quickActions: string[];
  restrictions?: {
    maxHorses?: number;
    maxClients?: number;
    canViewFinancials?: boolean;
    canManageUsers?: boolean;
    maxTicketsPerDay?: number;
    dataAccess?: 'medical_clearance_required' | 'basic' | 'elevated';
    emergencyOverride?: boolean;
    crossTenantMedical?: boolean;
  };
}

export const ROLE_PERMISSIONS: Record<string, IRoleDefinition> = {
  client: {
    id: 'client',
    name: 'client',
    displayName: 'Horse Owner/Client',
    description: 'Horse owners with access to their horses and basic facility information',
    level: 1,
    color: '#2E8B57', // Sea Green
    icon: '👤',
    badge: 'CLIENT',
    permissions: [
      {
        resource: 'horses',
        actions: ['list', 'show'],
        filters: [
          { field: 'owner_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ],
        columns: ['name', 'breed', 'age', 'gender', 'stall_location', 'status']
      },
      {
        resource: 'health_records',
        actions: ['list', 'show'],
        filters: [
          { field: 'horse.owner_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      },
      {
        resource: 'training_sessions',
        actions: ['list', 'show'],
        filters: [
          { field: 'horse.owner_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      },
      {
        resource: 'cameras',
        actions: ['list', 'show'],
        filters: [
          { field: 'horse.owner_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      },
      {
        resource: 'billing',
        actions: ['list', 'show'],
        filters: [
          { field: 'client_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      },
      {
        resource: 'support_tickets',
        actions: ['list', 'show', 'create'],
        filters: [
          { field: 'client_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      }
    ],
    dashboardModules: ['my-horses', 'live-cameras', 'health-reports', 'billing', 'client-support', 'messages'],
    quickActions: ['view-cameras', 'health-report', 'send-message', 'view-billing'],
    restrictions: {
      canViewFinancials: false,
      canManageUsers: false
    }
  },

  trainer: {
    id: 'trainer',
    name: 'trainer',
    displayName: 'Trainer',
    description: 'Professional trainers with training and performance management access',
    level: 2,
    color: '#DAA520', // Goldenrod
    icon: '🏆',
    badge: 'TRAINER',
    permissions: [
      {
        resource: 'horses',
        actions: ['list', 'show', 'update'],
        filters: [
          { field: 'barn_id', operator: 'eq', value: 'CURRENT_BARN_ID' }
        ]
      },
      {
        resource: 'health_records',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'training_sessions',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'training_programs',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'performance_analytics',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'competition_records',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'client_communication',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'support_tickets',
        actions: ['list', 'show', 'create'],
        filters: [
          { field: 'staff_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      }
    ],
    dashboardModules: ['horses', 'training', 'performance', 'competitions', 'clients', 'employee-support', 'schedule'],
    quickActions: ['create-training-plan', 'log-session', 'schedule-lesson', 'send-update'],
    restrictions: {
      canViewFinancials: false,
      canManageUsers: false
    }
  },

  employee: {
    id: 'employee',
    name: 'employee',
    displayName: 'Facility Employee',
    description: 'General facility employees with horse care and basic operational access',
    level: 2,
    color: '#2E8B57', // Sea Green
    icon: '👥',
    badge: 'EMPLOYEE',
    permissions: [
      {
        resource: 'horses',
        actions: ['list', 'show', 'update'],
        filters: [
          { field: 'barn_id', operator: 'eq', value: 'CURRENT_BARN_ID' }
        ]
      },
      {
        resource: 'health_records',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'training_sessions',
        actions: ['list', 'show']
      },
      {
        resource: 'cameras',
        actions: ['list', 'show'],
        filters: [
          { field: 'barn_id', operator: 'eq', value: 'CURRENT_BARN_ID' }
        ]
      },
      {
        resource: 'daily_operations',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'support_tickets',
        actions: ['list', 'show', 'create', 'update'],
        filters: [
          { field: 'staff_id', operator: 'eq', value: 'CURRENT_USER_ID' }
        ]
      },
      {
        resource: 'client_communication',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'facility_maintenance',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'ai_monitoring',
        actions: ['list', 'show']
      }
    ],
    dashboardModules: ['overview', 'horses', 'settings', 'profile'],
    quickActions: ['view-horses', 'health-check', 'camera-monitor', 'create-ticket', 'ai-insights', 'daily-report'],
    restrictions: {
      canViewFinancials: false,
      canManageUsers: false,
      maxTicketsPerDay: 20
    }
  },

  it_support: {
    id: 'it_support',
    name: 'it_support',
    displayName: 'IT Support',
    description: 'IT specialists managing technical infrastructure, AI systems, and comprehensive customer support',
    level: 3,
    color: '#FF6B35', // Orange Red
    icon: '🎧',
    badge: 'IT SUPPORT',
    permissions: [
      // Support permissions
      {
        resource: 'support_tickets',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'client_communication',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'knowledge_base',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'escalation_management',
        actions: ['create', 'manage']
      },
      // AI support specific
      {
        resource: 'ai_system_status',
        actions: ['list', 'show']
      },
      {
        resource: 'ai_user_training',
        actions: ['list', 'show', 'create', 'update', 'manage']
      },
      {
        resource: 'ai_false_alerts',
        actions: ['list', 'show', 'handle', 'resolve']
      },
      {
        resource: 'ai_configuration_support',
        actions: ['list', 'show', 'basic']
      },
      {
        resource: 'camera_setup_support',
        actions: ['list', 'show', 'create', 'update', 'full']
      },
      // Technical infrastructure
      {
        resource: 'system_infrastructure',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'ai_system_management',
        actions: ['list', 'show', 'create', 'update', 'delete', 'configure']
      },
      {
        resource: 'camera_infrastructure',
        actions: ['list', 'show', 'create', 'update', 'delete', 'configure']
      },
      {
        resource: 'network_management',
        actions: ['list', 'show', 'create', 'update', 'configure']
      }
    ],
    dashboardModules: ['support-center', 'ai-user-support', 'system-health', 'ai-management', 'camera-management', 'escalated-tickets', 'knowledge-base'],
    quickActions: ['create-ticket', 'respond-ticket', 'ai-support-request', 'system-health-check', 'ai-diagnostics', 'camera-diagnostics'],
    restrictions: {
      canViewFinancials: false,
      canManageUsers: false,
      maxTicketsPerDay: 100,
      dataAccess: 'elevated'
    }
  },

  barn_owner_manager: {
    id: 'barn_owner_manager',
    name: 'barn_owner_manager',
    displayName: 'Barn Owner/Manager',
    description: 'Facility owners and managers with operational oversight and business management access',
    level: 4,
    color: '#8B4513', // Saddle Brown
    icon: '🏢',
    badge: 'MANAGER',
    inheritsFrom: ['trainer'],
    permissions: [
      {
        resource: 'facility_operations',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'staff_management',
        actions: ['list', 'show', 'update']
      },
      {
        resource: 'financial_reports',
        actions: ['list', 'show']
      },
      {
        resource: 'business_analytics',
        actions: ['list', 'show', 'create']
      },
      {
        resource: 'client_management',
        actions: ['list', 'show', 'create', 'update']
      },
      {
        resource: 'business_operations',
        actions: ['list', 'show', 'create', 'update', 'delete', 'full']
      },
      {
        resource: 'financial_management',
        actions: ['list', 'show', 'create', 'update', 'full']
      },
      {
        resource: 'facility_ownership',
        actions: ['list', 'show', 'create', 'update', 'delete', 'full']
      },
      {
        resource: 'staff_hiring_firing',
        actions: ['list', 'show', 'create', 'update', 'delete']
      }
    ],
    dashboardModules: ['overview', 'horses', 'staff', 'finances', 'analytics', 'operations', 'manager-support', 'clients'],
    quickActions: ['generate-report', 'manage-staff', 'view-analytics', 'client-communication', 'financial-overview'],
    restrictions: {
      canViewFinancials: true,
      canManageUsers: true,
      maxHorses: 500,
      maxClients: 200
    }
  },

  db_admin: {
    id: 'db_admin',
    name: 'db_admin',
    displayName: 'Database Administrator',
    description: 'System administrator with full database and system access',
    level: 5,
    color: '#4B0082', // Indigo
    icon: '⚡',
    badge: 'DB ADMIN',
    inheritsFrom: ['barn_owner_manager'],
    permissions: [
      {
        resource: 'user_management',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'system_configuration',
        actions: ['list', 'show', 'create', 'update', 'delete']
      },
      {
        resource: 'audit_logs',
        actions: ['list', 'show']
      },
      {
        resource: 'security_settings',
        actions: ['list', 'show', 'update']
      },
      {
        resource: 'data_export',
        actions: ['create']
      },
      {
        resource: 'database_management',
        actions: ['list', 'show', 'backup', 'restore', 'full']
      },
      {
        resource: 'system_administration',
        actions: ['full']
      }
    ],
    dashboardModules: ['overview', 'users', 'system', 'security', 'analytics', 'horses', 'operations', 'support', 'database'],
    quickActions: ['manage-users', 'system-config', 'security-audit', 'data-export', 'database-backup'],
    restrictions: {
      canViewFinancials: true,
      canManageUsers: true
    }
  }
};

// Permission check utilities
export const hasPermission = (
  userRole: string,
  resource: string,
  action: string
): boolean => {
  const role = ROLE_PERMISSIONS[userRole];
  if (!role) return false;

  // Check direct permissions
  const permission = role.permissions.find(p => p.resource === resource);
  if (permission && permission.actions.includes(action)) {
    return true;
  }

  // Check inherited permissions
  if (role.inheritsFrom) {
    return role.inheritsFrom.some(inheritedRole =>
      hasPermission(inheritedRole, resource, action)
    );
  }

  return false;
};

export const getUserPermissions = (userRole: string): IPermission[] => {
  const role = ROLE_PERMISSIONS[userRole];
  if (!role) return [];

  let permissions = [...role.permissions];

  // Add inherited permissions
  if (role.inheritsFrom) {
    role.inheritsFrom.forEach(inheritedRole => {
      permissions = [...permissions, ...getUserPermissions(inheritedRole)];
    });
  }

  // Remove duplicates based on resource + action combination
  const uniquePermissions = permissions.filter((permission, index, self) =>
    index === self.findIndex(p =>
      p.resource === permission.resource &&
      JSON.stringify(p.actions.sort()) === JSON.stringify(permission.actions.sort())
    )
  );

  return uniquePermissions;
};

export const canAccessModule = (userRole: string, moduleId: string): boolean => {
  const role = ROLE_PERMISSIONS[userRole];
  if (!role) return false;

  return role.dashboardModules.includes(moduleId);
};

export const getAvailableQuickActions = (userRole: string): string[] => {
  const role = ROLE_PERMISSIONS[userRole];
  if (!role) return [];

  let actions = [...role.quickActions];

  // Add inherited quick actions
  if (role.inheritsFrom) {
    role.inheritsFrom.forEach(inheritedRole => {
      actions = [...actions, ...getAvailableQuickActions(inheritedRole)];
    });
  }

  return [...new Set(actions)]; // Remove duplicates
};

export const getRoleHierarchy = (): Record<string, number> => {
  return Object.values(ROLE_PERMISSIONS).reduce((acc, role) => {
    acc[role.id] = role.level;
    return acc;
  }, {} as Record<string, number>);
};

export const isHigherRole = (role1: string, role2: string): boolean => {
  const hierarchy = getRoleHierarchy();
  return (hierarchy[role1] || 0) > (hierarchy[role2] || 0);
};

// Default export for easy importing
export default ROLE_PERMISSIONS; 