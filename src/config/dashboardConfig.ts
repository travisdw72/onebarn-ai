// Unified Dashboard Configuration - Single Source of Truth
// ALL dashboard content, modules, analytics, and UI elements for all roles

import { brandConfig } from './brandConfig';
import { ROLE_PERMISSIONS } from './permissions.config';

export interface IDashboardModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  requiredPermissions: string[];
  route?: string;
  isAIEnabled?: boolean;
}

export interface IAnalyticsCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ReactNode;
  description: string;
  requiredRole: string[];
  dataSource: string;
}

export interface IQuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route?: string;
  action?: string;
  requiredPermissions: string[];
  requiredRole?: string[];
}

export interface ISystemHealthMetric {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  performance: string;
  lastCheck: string;
  details?: string;
}

export interface IAlert {
  id: string;
  type: 'system' | 'business' | 'user' | 'ai' | 'health' | 'security';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  targetRoles: string[];
  actionRequired?: boolean;
}

export const dashboardConfig = {
  // 🎨 Role-specific theming
  roleThemes: {
    client: {
      primary: brandConfig.colors.hunterGreen,
      secondary: brandConfig.colors.pastureSage,
      accent: brandConfig.colors.arenaSand
    },
    employee: {
      primary: brandConfig.colors.ribbonBlue,
      secondary: brandConfig.colors.sterlingSilver,
      accent: brandConfig.colors.arenaSand
    },
    trainer: {
      primary: brandConfig.colors.championGold,
      secondary: brandConfig.colors.victoryRose,
      accent: brandConfig.colors.arenaSand
    },
    veterinarian: {
      primary: brandConfig.colors.errorRed,
      secondary: brandConfig.colors.alertAmber,
      accent: brandConfig.colors.arenaSand
    },
    manager: {
      primary: brandConfig.colors.stableMahogany,
      secondary: brandConfig.colors.hunterGreen,
      accent: brandConfig.colors.arenaSand
    },
    admin: {
      primary: brandConfig.colors.midnightBlack,
      secondary: brandConfig.colors.sterlingSilver,
      accent: brandConfig.colors.arenaSand
    }
  },

  // 👋 Welcome messages by role
  welcome: {
    client: {
      title: 'Welcome back, {userName}!',
      subtitle: 'Monitor your horses and stay connected with your training team',
      greeting: 'Horse Owner Dashboard'
    },
    employee: {
      title: 'Welcome to Your Dashboard',
      subtitle: 'Manage your daily responsibilities and access the tools you need for excellent horse care',
      greeting: 'Employee Dashboard'
    },
    trainer: {
      title: 'Welcome, {userName}',
      subtitle: 'Access training tools, track performance, and manage your training programs',
      greeting: 'Professional Trainer Dashboard'
    },
    veterinarian: {
      title: 'Welcome, Dr. {userName}',
      subtitle: 'Access medical records, health analytics, and veterinary management tools',
      greeting: 'Veterinary Dashboard'
    },
    manager: {
      title: 'Manager Control Center',
      subtitle: 'AI-Powered Facility Management & Analytics Dashboard',
      greeting: 'Facility Management Dashboard'
    },
    admin: {
      title: 'System Administration',
      subtitle: 'Complete system oversight, user management, and configuration control',
      greeting: 'Administrative Dashboard'
    }
  },

  // 📋 Dashboard Tab Configurations by Role (Optimized with Dropdown Support)
  dashboardTabs: {
    admin: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'management', label: 'Management', icon: '⚙️' },
      { id: 'ai', label: 'AI System', icon: '🤖' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'database', label: 'Database', icon: '🗄️' },
          { id: 'users', label: 'Users', icon: '👥' },
          { id: 'support', label: 'Support', icon: '🎫' },
          { id: 'logs', label: 'Logs', icon: '📋' }
        ]
      }
    ],
    partner: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'revenue', label: 'Revenue', icon: '💰' },
      { id: 'horses', label: 'Horses', icon: '🐎' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'customers', label: 'Customer Success', icon: '👥' },
          { id: 'marketing', label: 'Marketing Tools', icon: '🎁' },
          { id: 'support', label: 'Support', icon: '💬' }
        ]
      }
    ],
    'it-manager': [
      { id: 'monitoring', label: 'Monitoring', icon: '📺' },
      { id: 'users', label: 'Users', icon: '👥' },
      { id: 'performance', label: 'Performance', icon: '📈' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'deployments', label: 'Deployments', icon: '🚀' },
          { id: 'support', label: 'Support', icon: '⚙️' }
        ]
      }
    ],
    'it-support': [
      { id: 'tickets', label: 'Tickets', icon: '🎫' },
      { id: 'sessions', label: 'Sessions', icon: '👥' },
      { id: 'knowledge', label: 'Knowledge', icon: '📚' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'issues', label: 'Common Issues', icon: '💬' }
        ]
      }
    ],
    client: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'horses', label: 'My Horses', icon: '🐎' },
      { id: 'insights', label: 'AI Insights', icon: '🤖' },
      { id: 'support', label: 'Support', icon: '🎧' }
    ],
    employee: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'horses', label: 'Horses', icon: '🐎' },
      { id: 'insights', label: 'AI Insights', icon: '🤖' },
      { id: 'support', label: 'Support', icon: '🎧' }
    ],
    trainer: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'horses', label: 'Horses', icon: '🐎' },
      { id: 'training', label: 'Training', icon: '🏆' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'insights', label: 'AI Insights', icon: '🤖' },
          { id: 'support', label: 'Support', icon: '🎧' }
        ]
      }
    ],
    veterinarian: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'horses', label: 'Horses', icon: '🐎' },
      { id: 'health', label: 'Health', icon: '🏥' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'insights', label: 'AI Insights', icon: '🤖' },
          { id: 'support', label: 'Support', icon: '🎧' }
        ]
      }
    ],
    manager: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'operations', label: 'Operations', icon: '⚙️' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { 
        id: 'more', 
        label: 'More', 
        icon: '⋯', 
        dropdown: [
          { id: 'partnerships', label: 'Partnerships', icon: '🤝' },
          { id: 'reports', label: 'Reports', icon: '📋' },
          { id: 'support', label: 'Support', icon: '🎧' }
        ]
      }
    ]
  },

  // 📊 Universal analytics metrics
  analyticsMetrics: {
    'total-horses': {
      id: 'total-horses',
      title: 'Total Horses',
      description: 'Total horses under management/monitoring',
      icon: '🐎',
      color: brandConfig.colors.hunterGreen,
      requiredRole: ['employee', 'trainer', 'veterinarian', 'manager', 'admin'],
      dataSource: 'horses.count'
    },
    'active-clients': {
      id: 'active-clients',
      title: 'Active Clients',
      description: 'Current active client accounts',
      icon: '👥',
      color: brandConfig.colors.ribbonBlue,
      requiredRole: ['manager', 'admin'],
      dataSource: 'clients.active'
    },
    'health-alerts': {
      id: 'health-alerts',
      title: 'Health Alerts',
      description: 'Horses requiring health attention',
      icon: '🏥',
      color: brandConfig.colors.errorRed,
      requiredRole: ['veterinarian', 'manager', 'admin'],
      dataSource: 'health.alerts'
    },
    'training-sessions': {
      id: 'training-sessions',
      title: 'Training Sessions',
      description: 'Sessions scheduled for today',
      icon: '🏆',
      color: brandConfig.colors.championGold,
      requiredRole: ['trainer', 'manager', 'admin'],
      dataSource: 'training.todayCount'
    },
    'ai-insights': {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'AI-generated insights this week',
      icon: '🤖',
      color: brandConfig.colors.victoryRose,
      requiredRole: ['manager', 'admin'],
      dataSource: 'ai.insights'
    },
    'system-uptime': {
      id: 'system-uptime',
      title: 'System Uptime',
      description: 'Overall system availability',
      icon: '⚡',
      color: brandConfig.colors.successGreen,
      requiredRole: ['admin'],
      dataSource: 'system.uptime'
    },
    'monthly-revenue': {
      id: 'monthly-revenue',
      title: 'Monthly Revenue',
      description: 'Current month earnings',
      icon: '💰',
      color: brandConfig.colors.championGold,
      requiredRole: ['manager', 'admin'],
      dataSource: 'finance.monthlyRevenue'
    }
  },

  // 🎯 Role-specific dashboard modules
  dashboardModules: {
    // Client modules
    'my-horses': {
      id: 'my-horses',
      title: 'My Horses',
      description: 'View and monitor your horses with real-time updates and health status',
      icon: '🐎',
      color: brandConfig.colors.hunterGreen,
      features: ['Live Status', 'Health Reports', 'Training Updates', 'Photo Gallery'],
      requiredPermissions: ['horses:show'],
      route: 'client/horses'
    },
    'live-cameras': {
      id: 'live-cameras',
      title: 'Live Cameras',
      description: 'Watch your horses in real-time with HD streaming and recording capabilities',
      icon: '📹',
      color: brandConfig.colors.ribbonBlue,
      features: ['HD Streaming', 'Recording', 'Motion Alerts', 'Mobile Access'],
      requiredPermissions: ['cameras:show'],
      route: 'client/cameras',
      isAIEnabled: true
    },
    'demo-camera': {
      id: 'demo-camera',
      title: 'Live Camera Demo',
      description: 'Experience real-time camera monitoring with AI analysis for business demonstrations',
      icon: '🎥',
      color: brandConfig.colors.championGold,
      features: ['Browser Camera Access', 'Real-time AI Analysis', 'Professional Demo Interface', 'Device Selection'],
      requiredPermissions: ['cameras:show'],
      route: 'client/demo-camera',
      isAIEnabled: true
    },
    'health-reports': {
      id: 'health-reports',
      title: 'Health Reports',
      description: 'Access detailed health reports and veterinary updates for your horses',
      icon: '🏥',
      color: brandConfig.colors.errorRed,
      features: ['Vet Reports', 'Vaccination Records', 'Health Trends', 'Alerts'],
      requiredPermissions: ['health_records:show'],
      route: 'client/health'
    },
    'billing': {
      id: 'billing',
      title: 'Billing & Payments',
      description: 'Manage billing, view invoices, and track payment history',
      icon: '💳',
      color: brandConfig.colors.championGold,
      features: ['Invoice History', 'Payment Methods', 'Auto-pay', 'Reports'],
      requiredPermissions: ['billing:show'],
      route: 'client/billing'
    },
    'client-support': {
      id: 'client-support',
      title: 'Support & Help',
      description: 'Get help, submit tickets, and access support resources',
      icon: '🎧',
      color: brandConfig.colors.victoryRose,
      features: ['Submit Tickets', 'View My Tickets', 'Help Center', 'Contact Support'],
      requiredPermissions: ['support_tickets:create'],
      route: 'client/support'
    },

    // Employee/Trainer modules
    'horses': {
      id: 'horses',
      title: 'Horse Management',
      description: 'Complete horse profiles, registration, and information management',
      icon: '🐎',
      color: brandConfig.colors.hunterGreen,
      features: ['Horse Profiles', 'Registration', 'Status Updates', 'Care Logs'],
      requiredPermissions: ['horses:list', 'horses:update'],
      route: 'employee/horses'
    },
    'training': {
      id: 'training',
      title: 'Training Management',
      description: 'Training programs, session logs, and performance tracking',
      icon: '🏆',
      color: brandConfig.colors.championGold,
      features: ['Training Plans', 'Session Logs', 'Performance Analytics', 'Client Updates'],
      requiredPermissions: ['training_sessions:create'],
      route: 'employee/training',
      isAIEnabled: true
    },
    'health': {
      id: 'health',
      title: 'Health & Wellness',
      description: 'Health records, treatments, and veterinary management',
      icon: '🏥',
      color: brandConfig.colors.errorRed,
      features: ['Health Records', 'Treatments', 'Medication', 'Emergency Protocols'],
      requiredPermissions: ['health_records:create'],
      route: 'employee/health',
      isAIEnabled: true
    },
    'schedule': {
      id: 'schedule',
      title: 'Daily Schedule',
      description: 'Daily task management and appointment scheduling',
      icon: '📅',
      color: brandConfig.colors.ribbonBlue,
      features: ['Task Lists', 'Appointments', 'Reminders', 'Time Tracking'],
      requiredPermissions: ['daily_logs:create'],
      route: 'employee/schedule'
    },
    'employee-support': {
      id: 'employee-support',
      title: 'Support Center',
      description: 'Technical support, knowledge base, and help resources',
      icon: '🎧',
      color: brandConfig.colors.victoryRose,
      features: ['Submit Issues', 'Knowledge Base', 'Training Resources', 'IT Support'],
      requiredPermissions: ['support_tickets:create'],
      route: 'employee/support'
    },

    // Manager modules
    'overview': {
      id: 'overview',
      title: 'Facility Overview',
      description: 'Comprehensive facility metrics and operational overview',
      icon: '📊',
      color: brandConfig.colors.stableMahogany,
      features: ['Key Metrics', 'Status Dashboard', 'Alert Summary', 'Quick Actions'],
      requiredPermissions: ['facility_operations:show'],
      isAIEnabled: true
    },
    'analytics': {
      id: 'analytics',
      title: 'Business Analytics',
      description: 'Deep performance insights and business intelligence',
      icon: '📈',
      color: brandConfig.colors.victoryRose,
      features: ['Performance Metrics', 'Trends Analysis', 'Revenue Reports', 'Forecasting'],
      requiredPermissions: ['business_analytics:show'],
      route: 'manager/analytics',
      isAIEnabled: true
    },
    'staff': {
      id: 'staff',
      title: 'Staff Management',
      description: 'Employee oversight, scheduling, and performance management',
      icon: '👥',
      color: brandConfig.colors.pastureSage,
      features: ['Staff Directory', 'Performance Reviews', 'Schedule Management', 'Training Records'],
      requiredPermissions: ['staff_management:show'],
      route: 'manager/staff'
    },
    'operations': {
      id: 'operations',
      title: 'Operations',
      description: 'Daily operations, facility management, and resource allocation',
      icon: '🏢',
      color: brandConfig.colors.hunterGreen,
      features: ['Stall Management', 'Equipment', 'Maintenance', 'Inventory'],
      requiredPermissions: ['facility_operations:create'],
      route: 'manager/operations'
    },
    'manager-support': {
      id: 'manager-support',
      title: 'Support Management',
      description: 'Facility support overview and staff assistance coordination',
      icon: '🎧',
      color: brandConfig.colors.victoryRose,
      features: ['Support Overview', 'Staff Issues', 'Client Escalations', 'Support Analytics'],
      requiredPermissions: ['facility_operations:show'],
      route: 'manager/support'
    },

    // Veterinarian modules
    'ai-health-alerts': {
      id: 'ai-health-alerts',
      title: 'AI Health Alerts',
      description: 'Real-time AI-detected health anomalies and emergency alerts',
      icon: '🚨',
      color: brandConfig.colors.errorRed,
      features: ['Critical Health Alerts', 'Abnormal Behavior Detection', 'Predictive Health Warnings', 'Emergency Notifications', 'Alert Acknowledgment'],
      requiredPermissions: ['ai_health_alerts:list'],
      route: 'veterinarian/ai-alerts',
      isAIEnabled: true
    },
    'ai-diagnostics': {
      id: 'ai-diagnostics',
      title: 'AI Diagnostic Support',
      description: 'AI-powered diagnostic assistance and pattern analysis',
      icon: '🔬',
      color: brandConfig.colors.ribbonBlue,
      features: ['AI Diagnostic Suggestions', 'Confidence Level Analysis', 'Historical Pattern Matching', 'Cross-Reference Similar Cases', 'Treatment Recommendations'],
      requiredPermissions: ['ai_diagnostics:list'],
      route: 'veterinarian/ai-diagnostics',
      isAIEnabled: true
    },
    'health-analytics': {
      id: 'health-analytics',
      title: 'Health Analytics',
      description: 'Long-term health trends and predictive analytics',
      icon: '📊',
      color: brandConfig.colors.championGold,
      features: ['Health Trend Analysis', 'Predictive Health Models', 'Population Health Insights', 'Risk Assessment', 'Outcome Tracking'],
      requiredPermissions: ['ai_behavior_analysis:list'],
      route: 'veterinarian/health-analytics',
      isAIEnabled: true
    },
    'emergency-protocols': {
      id: 'emergency-protocols',
      title: 'Emergency Protocols',
      description: 'Emergency response procedures and critical care protocols',
      icon: '🆘',
      color: brandConfig.colors.alertAmber,
      features: ['Emergency Response Plans', 'Critical Care Protocols', 'Emergency Contact System', 'Escalation Procedures', 'Post-Emergency Analysis'],
      requiredPermissions: ['emergency_protocols:list'],
      route: 'veterinarian/emergency-protocols'
    },
    'case-management': {
      id: 'case-management',
      title: 'Case Management',
      description: 'Comprehensive medical case tracking and management',
      icon: '📋',
      color: brandConfig.colors.hunterGreen,
      features: ['Case Tracking', 'Treatment Plans', 'Follow-up Scheduling', 'Case Documentation', 'Outcome Monitoring'],
      requiredPermissions: ['health_records:list'],
      route: 'veterinarian/case-management'
    },
    'medical-history': {
      id: 'medical-history',
      title: 'Medical History',
      description: 'Complete medical history and timeline analysis',
      icon: '📚',
      color: brandConfig.colors.pastureSage,
      features: ['Complete Medical Records', 'Timeline Analysis', 'Treatment History', 'Medication Tracking', 'Vaccination Records'],
      requiredPermissions: ['medical_history:list'],
      route: 'veterinarian/medical-history'
    },
    'vet-support': {
      id: 'vet-support',
      title: 'Veterinary Support',
      description: 'Professional support and training resources for AI system',
      icon: '🎓',
      color: brandConfig.colors.victoryRose,
      features: ['AI System Training', 'Clinical Decision Support', 'Continuing Education', 'Best Practices', 'Technical Support'],
      requiredPermissions: ['support_tickets:create'],
      route: 'veterinarian/support'
    },

    // Enhanced Support Staff modules
    'ai-user-support': {
      id: 'ai-user-support',
      title: 'AI User Support',
      description: 'Help users understand and work with AI system alerts and insights',
      icon: '🤖',
      color: brandConfig.colors.ribbonBlue,
      features: ['AI False Alarm Management', 'User AI Training Requests', 'Alert Interpretation Help', 'Camera Setup Support', 'AI Configuration Issues'],
      requiredPermissions: ['ai_user_training:provide'],
      route: 'support/ai-user-support',
      isAIEnabled: true
    },
    'ai-education-center': {
      id: 'ai-education-center',
      title: 'AI Education Center',
      description: 'Manage training materials and user education for AI system',
      icon: '📚',
      color: brandConfig.colors.championGold,
      features: ['Training Material Management', 'User Onboarding Flows', 'AI Best Practices Guides', 'Video Tutorial Library', 'Interactive Training Modules'],
      requiredPermissions: ['ai_education_materials:manage'],
      route: 'support/ai-education-center'
    },
    'system-status': {
      id: 'system-status',
      title: 'System Status',
      description: 'Monitor AI system health and user-reported issues',
      icon: '📊',
      color: brandConfig.colors.hunterGreen,
      features: ['AI System Health Dashboard', 'User-Reported Issues Tracking', 'Camera Status Monitoring', 'Performance Metrics', 'Escalation Management'],
      requiredPermissions: ['ai_system_status:list'],
      route: 'support/system-status'
    },
    'user-training': {
      id: 'user-training',
      title: 'User Training',
      description: 'Coordinate and track user training programs',
      icon: '🎯',
      color: brandConfig.colors.pastureSage,
      features: ['Training Schedule Management', 'Progress Tracking', 'Training Resources', 'Competency Assessment', 'Certification Tracking'],
      requiredPermissions: ['ai_user_training:manage'],
      route: 'support/user-training'
    },
    'support-center': {
      id: 'support-center',
      title: 'Support Center',
      description: 'Comprehensive support ticket and issue management',
      icon: '🎧',
      color: brandConfig.colors.victoryRose,
      features: ['Ticket Management', 'Issue Tracking', 'SLA Monitoring', 'Customer Satisfaction', 'Knowledge Base Management'],
      requiredPermissions: ['support_tickets:list'],
      route: 'support/support-center'
    },

    // Admin modules
    'users': {
      id: 'users',
      title: 'User Management',
      description: 'Complete user administration and access control',
      icon: '👤',
      color: brandConfig.colors.midnightBlack,
      features: ['User Accounts', 'Role Assignment', 'Access Control', 'Audit Logs'],
      requiredPermissions: ['user_management:create'],
      route: 'admin/users'
    },
    'system': {
      id: 'system',
      title: 'System Configuration',
      description: 'System settings, integrations, and configuration management',
      icon: '⚙️',
      color: brandConfig.colors.sterlingSilver,
      features: ['System Settings', 'API Configuration', 'Integration Management', 'Backups'],
      requiredPermissions: ['system_configuration:update'],
      route: 'admin/system'
    },
    'security': {
      id: 'security',
      title: 'Security & Audit',
      description: 'Security monitoring, audit logs, and compliance management',
      icon: '🔒',
      color: brandConfig.colors.errorRed,
      features: ['Security Logs', 'Access Monitoring', 'Compliance Reports', 'Threat Detection'],
      requiredPermissions: ['audit_logs:show'],
      route: 'admin/security'
    }
  },

  // ⚡ Quick actions by role
  quickActions: {
    // Client quick actions
    'view-cameras': {
      id: 'view-cameras',
      title: 'View Live Cameras',
      description: 'Watch your horses live',
      icon: '📹',
      color: brandConfig.colors.ribbonBlue,
      route: 'client/cameras',
      requiredPermissions: ['cameras:show']
    },
    'health-report': {
      id: 'health-report',
      title: 'Health Report',
      description: 'View latest health updates',
      icon: '🏥',
      color: brandConfig.colors.errorRed,
      route: 'client/health',
      requiredPermissions: ['health_records:show']
    },
    'send-message': {
      id: 'send-message',
      title: 'Send Message',
      description: 'Contact your training team',
      icon: '💬',
      color: brandConfig.colors.pastureSage,
      action: 'open-messaging',
      requiredPermissions: ['client_communication:create']
    },
    'view-billing': {
      id: 'view-billing',
      title: 'View Billing',
      description: 'Check invoices and payments',
      icon: '💳',
      color: brandConfig.colors.championGold,
      route: 'client/billing',
      requiredPermissions: ['billing:show']
    },

    // Employee quick actions
    'add-health-record': {
      id: 'add-health-record',
      title: 'Add Health Record',
      description: 'Log health observation or treatment',
      icon: '🏥',
      color: brandConfig.colors.errorRed,
      action: 'create-health-record',
      requiredPermissions: ['health_records:create']
    },
    'log-training': {
      id: 'log-training',
      title: 'Log Training',
      description: 'Record training session',
      icon: '🏆',
      color: brandConfig.colors.championGold,
      action: 'create-training-log',
      requiredPermissions: ['training_sessions:create']
    },
    'view-schedule': {
      id: 'view-schedule',
      title: 'View Schedule',
      description: 'Check today\'s appointments',
      icon: '📅',
      color: brandConfig.colors.ribbonBlue,
      route: 'employee/schedule',
      requiredPermissions: ['daily_logs:show']
    },
    'update-status': {
      id: 'update-status',
      title: 'Update Horse Status',
      description: 'Quick status update',
      icon: '📝',
      color: brandConfig.colors.pastureSage,
      action: 'quick-status-update',
      requiredPermissions: ['horses:update']
    },

    // Manager quick actions
    'generate-report': {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create business reports',
      icon: '📊',
      color: brandConfig.colors.stableMahogany,
      action: 'generate-business-report',
      requiredPermissions: ['business_analytics:create']
    },
    'manage-staff': {
      id: 'manage-staff',
      title: 'Manage Staff',
      description: 'Staff scheduling and oversight',
      icon: '👥',
      color: brandConfig.colors.pastureSage,
      route: 'manager/staff',
      requiredPermissions: ['staff_management:update']
    },
    'view-analytics': {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Business intelligence dashboard',
      icon: '📈',
      color: brandConfig.colors.victoryRose,
      route: 'manager/analytics',
      requiredPermissions: ['business_analytics:show']
    },
    'ai-insights': {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'AI-powered recommendations',
      icon: '🤖',
      color: brandConfig.colors.ribbonBlue,
      route: 'ai/insights',
      requiredPermissions: ['business_analytics:show']
    },

    // Veterinarian quick actions
    'acknowledge-alert': {
      id: 'acknowledge-alert',
      title: 'Acknowledge AI Alert',
      description: 'Acknowledge critical AI health alert',
      icon: '🚨',
      color: brandConfig.colors.errorRed,
      action: 'acknowledge-ai-alert',
      requiredPermissions: ['ai_health_alerts:acknowledge']
    },
    'emergency-protocol': {
      id: 'emergency-protocol',
      title: 'Emergency Protocol',
      description: 'Activate emergency response protocol',
      icon: '🆘',
      color: brandConfig.colors.alertAmber,
      route: 'veterinarian/emergency-protocols',
      requiredPermissions: ['emergency_protocols:execute']
    },
    'ai-diagnostic': {
      id: 'ai-diagnostic',
      title: 'AI Diagnostic',
      description: 'Run AI diagnostic analysis',
      icon: '🔬',
      color: brandConfig.colors.ribbonBlue,
      action: 'run-ai-diagnostic',
      requiredPermissions: ['ai_diagnostics:create']
    },
    'prescribe-medication': {
      id: 'prescribe-medication',
      title: 'Prescribe Medication',
      description: 'Prescribe medication for horse',
      icon: '💊',
      color: brandConfig.colors.hunterGreen,
      action: 'prescribe-medication',
      requiredPermissions: ['medications:create']
    },
    'schedule-checkup': {
      id: 'schedule-checkup',
      title: 'Schedule Checkup',
      description: 'Schedule routine veterinary checkup',
      icon: '📅',
      color: brandConfig.colors.pastureSage,
      action: 'schedule-checkup',
      requiredPermissions: ['health_records:create']
    },
    'emergency-alert': {
      id: 'emergency-alert',
      title: 'Emergency Alert',
      description: 'Send emergency alert to staff',
      icon: '🚨',
      color: brandConfig.colors.errorRed,
      action: 'send-emergency-alert',
      requiredPermissions: ['staff_alerts:send']
    },

    // Enhanced Support Staff quick actions
    'ai-support-request': {
      id: 'ai-support-request',
      title: 'AI Support Request',
      description: 'Handle AI-related support request',
      icon: '🤖',
      color: brandConfig.colors.ribbonBlue,
      action: 'handle-ai-support',
      requiredPermissions: ['ai_user_training:provide']
    },
    'schedule-training': {
      id: 'schedule-training',
      title: 'Schedule Training',
      description: 'Schedule AI training session',
      icon: '🎓',
      color: brandConfig.colors.championGold,
      action: 'schedule-ai-training',
      requiredPermissions: ['ai_user_training:manage']
    },
    'handle-false-alarm': {
      id: 'handle-false-alarm',
      title: 'Handle False Alarm',
      description: 'Process AI false alarm report',
      icon: '⚠️',
      color: brandConfig.colors.alertAmber,
      action: 'handle-false-alarm',
      requiredPermissions: ['ai_false_alerts:handle']
    },

    // Admin quick actions
    'manage-users': {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'User administration',
      icon: '👤',
      color: brandConfig.colors.midnightBlack,
      route: 'admin/users',
      requiredPermissions: ['user_management:create']
    },
    'system-config': {
      id: 'system-config',
      title: 'System Config',
      description: 'System configuration',
      icon: '⚙️',
      color: brandConfig.colors.sterlingSilver,
      route: 'admin/system',
      requiredPermissions: ['system_configuration:update']
    },
    'security-audit': {
      id: 'security-audit',
      title: 'Security Audit',
      description: 'Security monitoring',
      icon: '🔒',
      color: brandConfig.colors.errorRed,
      route: 'admin/security',
      requiredPermissions: ['audit_logs:show']
    },
    'data-export': {
      id: 'data-export',
      title: 'Export Data',
      description: 'System data export',
      icon: '📤',
      color: brandConfig.colors.hunterGreen,
      action: 'export-system-data',
      requiredPermissions: ['data_export:create']
    }
  },

  // 📋 Navigation and UI labels
  navigation: {
    tabs: {
      overview: 'Overview',
      horses: 'Horses',
      settings: 'Settings',
      profile: 'Profile'
    },
    buttons: {
      viewAll: 'View All',
      refresh: 'Refresh',
      settings: 'Settings',
      help: 'Help',
      logout: 'Logout',
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export',
      import: 'Import'
    }
  },

  // 🚨 AI Health Alerts - Sample Data
  aiHealthAlerts: [
    {
      id: 'AHA-001',
      severity: 'critical',
      horseId: 'H-123',
      horseName: 'Thunder',
      alertType: 'abnormal_behavior',
      description: 'Unusual pacing pattern detected - possible colic symptoms',
      aiConfidence: 87,
      timestamp: '2024-01-15T14:30:00Z',
      status: 'unacknowledged',
      recommendedAction: 'Immediate veterinary examination recommended',
      vitals: {
        heartRate: 52,
        temperature: 101.8,
        respiratoryRate: 16
      }
    },
    {
      id: 'AHA-002',
      severity: 'high',
      horseId: 'H-456',
      horseName: 'Star',
      alertType: 'gait_abnormality',
      description: 'Limping detected in right front leg during movement',
      aiConfidence: 92,
      timestamp: '2024-01-15T13:45:00Z',
      status: 'acknowledged',
      recommendedAction: 'Examine right front leg for injury or lameness',
      vitals: {
        heartRate: 38,
        temperature: 99.2,
        respiratoryRate: 12
      }
    },
    {
      id: 'AHA-003',
      severity: 'medium',
      horseId: 'H-789',
      horseName: 'Blaze',
      alertType: 'feeding_behavior',
      description: 'Reduced appetite observed over past 24 hours',
      aiConfidence: 78,
      timestamp: '2024-01-15T12:00:00Z',
      status: 'investigating',
      recommendedAction: 'Monitor feeding behavior and check for underlying issues'
    }
  ],

  // 🔬 AI Diagnostic Suggestions - Sample Data
  aiDiagnosticSuggestions: [
    {
      id: 'ADS-001',
      horseId: 'H-123',
      horseName: 'Thunder',
      symptoms: ['pacing', 'restlessness', 'looking_at_flanks', 'elevated_heart_rate'],
      aiSuggestion: 'Possible colic - recommend immediate examination',
      confidence: 85,
      similarCases: 12,
      recommendedTests: ['physical_exam', 'temperature_check', 'heart_rate_monitoring', 'abdominal_sounds'],
      urgency: 'high',
      treatmentRecommendations: [
        'Immediate veterinary examination',
        'Administer pain management if confirmed',
        'Monitor vital signs closely',
        'Prepare for potential emergency treatment'
      ]
    },
    {
      id: 'ADS-002',
      horseId: 'H-456',
      horseName: 'Star',
      symptoms: ['limping', 'weight_bearing_reduction', 'visible_discomfort'],
      aiSuggestion: 'Probable lameness in right front leg',
      confidence: 92,
      similarCases: 8,
      recommendedTests: ['flexion_test', 'hoof_examination', 'radiographs'],
      urgency: 'medium',
      treatmentRecommendations: [
        'Rest and limited movement',
        'Cold therapy application',
        'Anti-inflammatory if appropriate',
        'Follow-up examination in 24-48 hours'
      ]
    }
  ],

  // 💬 Messages and notifications
  messages: {
    loading: 'Loading dashboard data...',
    noData: 'No data available',
    accessDenied: 'Access denied. You do not have permission to view this content.',
    networkError: 'Network error. Please check your connection and try again.',
    systemMaintenanceMode: 'System is currently in maintenance mode. Some features may be unavailable.',
    aiSystemsOffline: 'AI systems are currently offline. Some insights may not be available.',
    dataRefreshed: 'Dashboard data has been refreshed.',
    actionCompleted: 'Action completed successfully.',
    actionFailed: 'Action failed. Please try again.',
    sessionExpiring: 'Your session will expire in 5 minutes. Please save your work.',
    welcomeBack: 'Welcome back! Here\'s what\'s happening in your facility.'
  },

  // 🎨 UI Configuration
  layout: {
    maxWidth: '1400px',
    containerPadding: brandConfig.spacing.xl,
    sectionSpacing: brandConfig.spacing.xl
  },

  // 📊 Chart and visualization settings
  visualization: {
    colors: {
      primary: brandConfig.colors.ribbonBlue,
      secondary: brandConfig.colors.championGold,
      success: brandConfig.colors.successGreen,
      warning: brandConfig.colors.alertAmber,
      error: brandConfig.colors.errorRed,
      info: brandConfig.colors.pastureSage
    },
    animations: {
      duration: 300,
      easing: 'ease-in-out'
    }
  }
};

// Utility functions for role-based access
export const getDashboardModulesForRole = (userRole: string): IDashboardModule[] => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  if (!roleConfig) return [];

  return roleConfig.dashboardModules
    .map(moduleId => dashboardConfig.dashboardModules[moduleId])
    .filter(module => module !== undefined);
};

export const getQuickActionsForRole = (userRole: string): IQuickAction[] => {
  const roleConfig = ROLE_PERMISSIONS[userRole];
  if (!roleConfig) return [];

  return roleConfig.quickActions
    .map(actionId => dashboardConfig.quickActions[actionId])
    .filter(action => action !== undefined);
};

export const getAnalyticsForRole = (userRole: string): string[] => {
  return Object.values(dashboardConfig.analyticsMetrics)
    .filter(metric => metric.requiredRole.includes(userRole))
    .map(metric => metric.id);
};

export const getRoleTheme = (userRole: string) => {
  return dashboardConfig.roleThemes[userRole] || dashboardConfig.roleThemes.employee;
};

export const getWelcomeMessage = (userRole: string, userName?: string) => {
  const welcome = dashboardConfig.welcome[userRole] || dashboardConfig.welcome.employee;
  return {
    ...welcome,
    title: welcome.title.replace('{userName}', userName || 'User'),
    subtitle: welcome.subtitle.replace('{userName}', userName || 'User')
  };
};

export const getDashboardTabsForRole = (userRole: string) => {
  // Map role variations to standardized tab configurations
  const roleMap: Record<string, string> = {
    'admin': 'admin',
    'administrator': 'admin',
    'partner': 'partner',
    'it-manager': 'it-manager',
    'it_manager': 'it-manager',
    'it-support': 'it-support',
    'it_support': 'it-support',
    'client': 'client',
    'horse_owner': 'client',
    'employee': 'employee',
    'trainer': 'trainer',
    'veterinarian': 'veterinarian',
    'vet': 'veterinarian',
    'manager': 'manager',
    'facility_manager': 'manager',
    'barn_manager': 'manager'
  };
  
  const mappedRole = roleMap[userRole] || 'employee';
  return dashboardConfig.dashboardTabs[mappedRole] || dashboardConfig.dashboardTabs.employee;
};

// ============================================================================
// NEW DASHBOARD ENHANCEMENTS FOR PHASE 1
// ============================================================================

// Enhanced dashboard content for clean mobile-first interface
export const newDashboardEnhancements = {
  // Video grid and camera content
  video: {
    selectCameraPrompt: 'Select a camera to view live feed',
    cameraOffline: 'Camera offline - checking connection',
    noVideoFeed: 'No video feed available',
    connectingMessage: 'Connecting to camera...',
    fullscreenMode: 'Fullscreen Mode',
    exitFullscreen: 'Exit Fullscreen',
    audioEnabled: 'Audio Enabled',
    audioDisabled: 'Audio Disabled',
  },

  // AI chat interface content
  aiChat: {
    welcomeMessage: "Hi! I'm your AI Guardian. I'm currently monitoring your horses. Ask me anything about their wellbeing, behavior, or recent activity.",
    listeningIndicator: 'Listening...',
    processingMessage: 'AI is thinking...',
    voiceEnabled: 'Voice responses enabled',
    voiceDisabled: 'Voice responses disabled',
    startListening: 'Start voice input',
    stopListening: 'Stop listening',
    sendMessage: 'Send message',
    placeholder: 'Ask about your horses... (or use voice)',
  },

  // Alert and insights content
  insights: {
    noAlertsMessage: 'All horses are safe and sound',
    systemActive: 'AI Guardian Active',
    alertsTab: 'Alerts',
    insightsTab: 'Insights', 
    trendsTab: 'Trends',
    emergencyResponse: 'Emergency Response',
    respond: 'Respond',
    takeAction: 'Take Action',
    activity: 'Activity',
    mood: 'Mood',
    social: 'Social',
    lastUpdated: 'Last Updated',
  },

  // Emergency actions content
  emergency: {
    quickActions: {
      callVet: '📞 Call Vet',
      alertStaff: '📱 Alert Staff', 
      capture: '📸 Capture',
      logEvent: '📝 Log Event',
    },
    
    protocols: {
      emergencyMode: 'EMERGENCY MODE ACTIVE',
      vetCalled: 'Veterinarian has been contacted',
      staffAlerted: 'Staff have been notified',
      recordingStarted: 'Emergency recording started',
      eventLogged: 'Event has been logged',
    },

    contacts: {
      veterinarian: 'Emergency Veterinarian',
      facilityManager: 'Facility Manager',
      support: 'Technical Support',
    },
  },

  // Emergency actions (separate from emergency for specific usage)
  emergencyActions: {
    veterinarianCall: '🚨 Call Veterinarian',
    autoRecord: '📹 Auto-Record',
    alertStaff: '📱 Alert Staff',
    sendLocation: '📍 Send Location',
    callBackup: '📞 Call Backup',
  },

  // System status content
  status: {
    operational: 'OPERATIONAL',
    degraded: 'DEGRADED',
    critical: 'CRITICAL',
    offline: 'OFFLINE',
    aiActive: 'AI Guardian ACTIVE',
    camerasOnline: 'Cameras',
    activeAlerts: 'Active Alerts',
    uptime: 'Uptime',
    online: 'online',
  },

  // Mobile-specific content
  mobile: {
    swipeUp: 'Swipe up for more',
    swipeDown: 'Swipe down to minimize',
    tapHold: 'Tap and hold for options',
    gloveMode: 'Glove mode enabled',
    largeButtons: 'Large button mode',
    voiceCommands: 'Voice commands available',
  },

  // Accessibility content
  accessibility: {
    screenReader: {
      cameraFeed: 'Live camera feed showing',
      alertPanel: 'Alert notification panel',
      chatInterface: 'AI chat interface',
      emergencyButton: 'Emergency response button',
      videoControls: 'Video playback controls',
      statusIndicator: 'System status indicator',
    },
    
    ariaLabels: {
      mainVideo: 'Main video display',
      cameraGrid: 'Camera selection grid',
      aiChat: 'AI chat conversation',
      alertsList: 'Active alerts list',
      emergencyActions: 'Emergency action buttons',
      systemStatus: 'System status bar',
    },
  },

  // Loading and error states
  states: {
    loading: 'Loading...',
    connecting: 'Connecting...',
    reconnecting: 'Reconnecting...',
    offline: 'Offline',
    error: 'Error occurred',
    retry: 'Retry',
    refresh: 'Refresh',
    updating: 'Updating...',
  },
};

export default dashboardConfig; 