// Manager Dashboard Configuration - Single Source of Truth
// ALL manager dashboard content, data structures, and UI copy

export const managerDashboardConfig = {
  // 👋 Welcome content
  welcome: {
    title: 'Manager Dashboard',
    subtitle: 'Comprehensive horse facility management and operations',
    roleLabel: 'Facility Manager'
  },

  // 📊 Statistics configuration
  statistics: {
    totalHorses: {
      name: 'Total Horses',
      description: 'Active horses in facility',
      icon: '🐎'
    },
    activeClients: {
      name: 'Active Clients',
      description: 'Current client accounts',
      icon: '👥'
    },
    upcomingAppointments: {
      name: 'Upcoming Appointments',
      description: 'Scheduled for today',
      icon: '📅'
    },
    monthlyRevenue: {
      name: 'Monthly Revenue',
      description: 'Current month earnings',
      icon: '💰'
    },
    stallOccupancy: {
      name: 'Stall Occupancy',
      description: 'Facility utilization',
      icon: '🏢'
    },
    healthAlerts: {
      name: 'Health Alerts',
      description: 'Requiring attention',
      icon: '🏥'
    }
  },

  // 🔘 Navigation modules
  modules: {
    horses: {
      id: 'horses',
      title: 'Horse Management',
      description: 'Complete horse profiles, registration, ownership history, and basic information management',
      icon: '🐎',
      features: ['Horse Profiles', 'Registration', 'Ownership History', 'Basic Information']
    },
    health: {
      id: 'health',
      title: 'Health & Wellness',
      description: 'Veterinary records, vaccination schedules, farrier appointments, and health trend analysis',
      icon: '🏥',
      features: ['Veterinary Records', 'Vaccination Schedules', 'Farrier Appointments', 'Health Analytics']
    },
    training: {
      id: 'training',
      title: 'Training & Performance',
      description: 'Training logs, competition results, performance analytics, and progress tracking',
      icon: '🏆',
      features: ['Training Logs', 'Competition Results', 'Performance Analytics', 'Progress Tracking']
    },
    finance: {
      id: 'finance',
      title: 'Financial Management',
      description: 'Billing, expense tracking, profitability analysis, and automated invoicing',
      icon: '💰',
      features: ['Billing Management', 'Expense Tracking', 'Profitability Analysis', 'Automated Invoicing']
    },
    facility: {
      id: 'facility',
      title: 'Facility Operations',
      description: 'Stall management, resource scheduling, maintenance tracking, and inventory control',
      icon: '🏢',
      features: ['Stall Management', 'Resource Scheduling', 'Maintenance Tracking', 'Inventory Control']
    },
    clients: {
      id: 'clients',
      title: 'Client Portal',
      description: 'Owner communications, progress updates, billing access, and service requests',
      icon: '👥',
      features: ['Client Communications', 'Progress Updates', 'Billing Access', 'Service Requests']
    }
  },

  // 📋 Section headers
  headers: {
    facilityOverview: 'Facility Overview',
    managementModules: 'Management Modules',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    upcomingTasks: 'Upcoming Tasks',
    performanceMetrics: 'Performance Metrics'
  },

  // 🔘 Button labels
  buttons: {
    addNewHorse: 'Add New Horse',
    scheduleAppointment: 'Schedule Appointment',
    logTrainingSession: 'Log Training Session',
    generateReport: 'Generate Report',
    sendClientUpdate: 'Send Client Update',
    manageStalls: 'Manage Stalls',
    viewFinancials: 'View Financials',
    updateInventory: 'Update Inventory',
    logout: 'Logout'
  },

  // ⚡ Quick actions
  quickActions: [
    {
      label: 'Add New Horse',
      action: 'add-horse',
      description: 'Register a new horse in the system',
      icon: '🐎'
    },
    {
      label: 'Schedule Appointment',
      action: 'schedule-appointment',
      description: 'Book veterinary or farrier appointment',
      icon: '📅'
    },
    {
      label: 'Log Training Session',
      action: 'log-training',
      description: 'Record training activity and progress',
      icon: '🏆'
    },
    {
      label: 'Generate Report',
      action: 'generate-report',
      description: 'Create facility or financial reports',
      icon: '📊'
    },
    {
      label: 'Send Client Update',
      action: 'client-update',
      description: 'Communicate with horse owners',
      icon: '📧'
    },
    {
      label: 'Manage Stalls',
      action: 'manage-stalls',
      description: 'Update stall assignments and status',
      icon: '🏢'
    }
  ],

  // 📋 Recent activity types
  activityTypes: {
    horseAdded: 'Horse Added',
    appointmentScheduled: 'Appointment Scheduled',
    trainingLogged: 'Training Logged',
    paymentReceived: 'Payment Received',
    healthUpdate: 'Health Update',
    stallAssigned: 'Stall Assigned'
  },

  // 📊 Performance metrics
  performanceMetrics: {
    occupancyRate: {
      name: 'Occupancy Rate',
      description: 'Facility utilization percentage'
    },
    clientSatisfaction: {
      name: 'Client Satisfaction',
      description: 'Average satisfaction score'
    },
    revenueGrowth: {
      name: 'Revenue Growth',
      description: 'Month-over-month growth'
    },
    healthCompliance: {
      name: 'Health Compliance',
      description: 'Vaccination and health check compliance'
    }
  },

  // 💬 Messages and notifications
  messages: {
    moduleAction: 'Opening module:',
    quickAction: 'Quick action:',
    welcomeBack: 'Welcome back to your facility management dashboard'
  },

  // 📊 Mock data for demonstration
  mockData: {
    statistics: [
      {
        id: '1',
        key: 'totalHorses',
        value: '24',
        change: 8.3,
        status: 'good' as const
      },
      {
        id: '2',
        key: 'activeClients',
        value: '18',
        change: 12.5,
        status: 'good' as const
      },
      {
        id: '3',
        key: 'upcomingAppointments',
        value: '3',
        change: -25.0,
        status: 'warning' as const
      },
      {
        id: '4',
        key: 'monthlyRevenue',
        value: '$12,450',
        change: 15.7,
        status: 'good' as const
      },
      {
        id: '5',
        key: 'stallOccupancy',
        value: '85%',
        change: 5.2,
        status: 'good' as const
      },
      {
        id: '6',
        key: 'healthAlerts',
        value: '2',
        change: -50.0,
        status: 'good' as const
      }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'horseAdded',
        description: 'New horse "Thunder" registered by Sarah Johnson',
        timestamp: '2024-01-15 14:30',
        user: 'Sarah Johnson'
      },
      {
        id: '2',
        type: 'appointmentScheduled',
        description: 'Veterinary checkup scheduled for Lightning',
        timestamp: '2024-01-15 13:45',
        user: 'Mike Rodriguez'
      },
      {
        id: '3',
        type: 'trainingLogged',
        description: 'Dressage training session completed for Storm',
        timestamp: '2024-01-15 12:20',
        user: 'Emma Thompson'
      },
      {
        id: '4',
        type: 'paymentReceived',
        description: 'Monthly boarding payment received from John Smith',
        timestamp: '2024-01-15 11:15',
        user: 'System'
      },
      {
        id: '5',
        type: 'healthUpdate',
        description: 'Vaccination record updated for Midnight',
        timestamp: '2024-01-15 10:30',
        user: 'Dr. Williams'
      }
    ],
    upcomingTasks: [
      {
        id: '1',
        title: 'Quarterly Health Inspections',
        description: 'Schedule and conduct quarterly health inspections for all horses',
        dueDate: '2024-01-20',
        priority: 'high' as const,
        category: 'health'
      },
      {
        id: '2',
        title: 'Facility Maintenance Review',
        description: 'Review and schedule upcoming facility maintenance tasks',
        dueDate: '2024-01-18',
        priority: 'medium' as const,
        category: 'facility'
      },
      {
        id: '3',
        title: 'Client Billing Cycle',
        description: 'Process monthly billing for all active clients',
        dueDate: '2024-01-25',
        priority: 'high' as const,
        category: 'finance'
      },
      {
        id: '4',
        title: 'Training Schedule Update',
        description: 'Update training schedules for competition season',
        dueDate: '2024-01-22',
        priority: 'medium' as const,
        category: 'training'
      }
    ],
    performanceMetrics: [
      {
        key: 'occupancyRate',
        value: '85%',
        target: '90%',
        status: 'good' as const
      },
      {
        key: 'clientSatisfaction',
        value: '4.7/5',
        target: '4.5/5',
        status: 'good' as const
      },
      {
        key: 'revenueGrowth',
        value: '+15.7%',
        target: '+10%',
        status: 'good' as const
      },
      {
        key: 'healthCompliance',
        value: '98%',
        target: '95%',
        status: 'good' as const
      }
    ]
  }
};

// Type definitions for manager dashboard
export interface ManagerStatistic {
  id: string;
  key: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface UpcomingTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface PerformanceMetric {
  key: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'critical';
}

export interface ManagementModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
} 