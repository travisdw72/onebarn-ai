import type { IEmployeeRole, IEmployeeDashboardData } from '../interfaces/EmployeeTypes';

// Dashboard Configuration - Single Source of Truth
export const dashboardConfig = {
  welcome: {
    title: 'Welcome to Your Dashboard',
    subtitle: 'Manage your daily responsibilities and access the tools you need for excellent horse care'
  },
  tooltips: {
    'sessions-today': 'Click to view today\'s schedule',
    'active-horses': 'Click to view your horses',
    'upcoming-shows': 'Click to view upcoming shows',
    'client-satisfaction': 'Click to view client reviews',
    default: 'Click for more details'
  },
  permissions: {
    full: 'FULL ACCESS',
    limited: 'LIMITED ACCESS',
    none: 'NO ACCESS',
    unknown: 'UNKNOWN'
  },
  messages: {
    accessDenied: 'Access denied. You do not have permission to access this module.',
    noScheduledSessions: 'No scheduled sessions for today',
    due: 'Due:'
  },
  buttons: {
    fullSchedule: 'Full Schedule'
  },
  headers: {
    priorityTasks: 'Priority Tasks',
    todaysSchedule: 'Today\'s Training Schedule'
  }
};

export const employeeRoles: IEmployeeRole[] = [
  {
    id: 'trainer',
    name: 'trainer',
    displayName: 'Trainer View',
    icon: '👩‍🏫',
    badge: 'TRAINER',
    user: {
      name: 'Maria Rodriguez',
      title: 'Lead Trainer',
      avatar: 'MR'
    }
  },
  {
    id: 'veterinarian',
    name: 'veterinarian',
    displayName: 'Veterinarian View',
    icon: '🏥',
    badge: 'VETERINARIAN',
    user: {
      name: 'Dr. Sarah Mitchell',
      title: 'Senior Veterinarian',
      avatar: 'SM'
    }
  },
  {
    id: 'facility',
    name: 'facility',
    displayName: 'Facility Manager View',
    icon: '🏢',
    badge: 'FACILITY MGR',
    user: {
      name: 'John Anderson',
      title: 'Facility Manager',
      avatar: 'JA'
    }
  },
  {
    id: 'barn-staff',
    name: 'barn-staff',
    displayName: 'Barn Staff View',
    icon: '🧹',
    badge: 'BARN STAFF',
    user: {
      name: 'Lisa Thompson',
      title: 'Head Barn Staff',
      avatar: 'LT'
    }
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Admin View',
    icon: '👨‍💼',
    badge: 'ADMINISTRATOR',
    user: {
      name: 'Michael Chen',
      title: 'System Administrator',
      avatar: 'MC'
    }
  }
];

export const employeeDashboardData: IEmployeeDashboardData = {
  trainer: {
    stats: [
      { id: 'sessions-today', label: 'Sessions Today', value: 8 },
      { id: 'active-horses', label: 'Active Horses', value: 24 },
      { id: 'upcoming-shows', label: 'Upcoming Shows', value: 3 },
      { id: 'client-satisfaction', label: 'Client Satisfaction', value: '96%' }
    ],
    tasks: [
      {
        id: 'competition-report',
        title: 'Competition Report Due',
        description: "Submit Thunder Bay's performance analysis from last weekend's show",
        priority: 'high',
        dueDate: 'Today',
        dueTime: '5:00 PM'
      },
      {
        id: 'training-plan-review',
        title: 'Training Plan Review',
        description: "Review and update Royal Duke's training progression plan with owner",
        priority: 'medium',
        dueDate: 'Tomorrow'
      },
      {
        id: 'equipment-inventory',
        title: 'Equipment Inventory',
        description: 'Check training equipment condition and submit replacement requests',
        priority: 'low',
        dueDate: 'This Week'
      }
    ],
    schedule: [
      {
        id: 'thunder-bay',
        title: 'Thunder Bay - Barrel Racing',
        client: 'Sarah Johnson',
        description: 'Advanced pattern work',
        time: '9:00 AM',
        type: 'training'
      },
      {
        id: 'midnight-star',
        title: 'Midnight Star - Trail Conditioning',
        client: 'Sarah Johnson',
        description: 'Endurance building',
        time: '10:30 AM',
        type: 'conditioning'
      },
      {
        id: 'royal-duke',
        title: 'Royal Duke - Dressage',
        client: 'Jennifer Adams',
        description: 'Collection work',
        time: '2:00 PM',
        type: 'dressage'
      },
      {
        id: 'storm-chaser',
        title: 'Storm Chaser - Competition Prep',
        client: 'Robert Wilson',
        description: 'Final tune-up',
        time: '4:00 PM',
        type: 'competition'
      }
    ],
    modules: [
      {
        id: 'training-logs',
        title: 'Training Logs',
        description: 'Record session details and progress notes',
        icon: '🏆',
        permission: 'full'
      },
      {
        id: 'performance-analytics',
        title: 'Performance Analytics',
        description: 'View horse performance data and trends',
        icon: '📊',
        permission: 'full'
      },
      {
        id: 'client-communication',
        title: 'Client Communication',
        description: 'Message owners and provide updates',
        icon: '💬',
        permission: 'full'
      },
      {
        id: 'financial-reports',
        title: 'Financial Reports',
        description: 'View billing and financial data',
        icon: '💰',
        permission: 'none',
        disabled: true
      }
    ]
  },
  veterinarian: {
    stats: [
      { id: 'appointments-today', label: 'Appointments Today', value: 6 },
      { id: 'emergency-calls', label: 'Emergency Calls', value: 2 },
      { id: 'health-alerts', label: 'Health Alerts', value: 18 },
      { id: 'vaccination-rate', label: 'Vaccination Rate', value: '89%' }
    ],
    alerts: [
      {
        id: 'storm-chaser-colic',
        title: '🚨 Critical Health Alert',
        content: 'Storm Chaser showing signs of mild colic - owner notified, examination scheduled for 1:00 PM',
        type: 'error'
      }
    ],
    modules: [
      {
        id: 'health-records',
        title: 'Health Records',
        description: 'Complete medical history and treatment logs',
        icon: '🏥',
        permission: 'full'
      },
      {
        id: 'vaccination-tracking',
        title: 'Vaccination Tracking',
        description: 'Monitor and schedule vaccinations',
        icon: '💉',
        permission: 'full'
      },
      {
        id: 'appointment-management',
        title: 'Appointment Management',
        description: 'Schedule and manage veterinary appointments',
        icon: '📋',
        permission: 'full'
      },
      {
        id: 'camera-access',
        title: 'Camera Access',
        description: 'Monitor horses remotely for health assessment',
        icon: '🎥',
        permission: 'limited'
      }
    ]
  },
  facility: {
    stats: [
      { id: 'total-horses', label: 'Total Horses', value: 45 },
      { id: 'staff-members', label: 'Staff Members', value: 12 },
      { id: 'monthly-revenue', label: 'Monthly Revenue', value: '$28,500' },
      { id: 'occupancy-rate', label: 'Occupancy Rate', value: '94%' }
    ],
    modules: [
      {
        id: 'facility-operations',
        title: 'Facility Operations',
        description: 'Manage stalls, arenas, and facility resources',
        icon: '🏢',
        permission: 'full'
      },
      {
        id: 'staff-management',
        title: 'Staff Management',
        description: 'Schedule staff and assign responsibilities',
        icon: '👥',
        permission: 'full'
      },
      {
        id: 'financial-overview',
        title: 'Financial Overview',
        description: 'Revenue, expenses, and profitability reports',
        icon: '💰',
        permission: 'full'
      },
      {
        id: 'maintenance-tracking',
        title: 'Maintenance Tracking',
        description: 'Schedule and track facility maintenance',
        icon: '🔧',
        permission: 'full'
      }
    ]
  },
  'barn-staff': {
    stats: [
      { id: 'daily-care-tasks', label: 'Daily Care Tasks', value: 32 },
      { id: 'horses-to-feed', label: 'Horses to Feed', value: 45 },
      { id: 'stalls-to-clean', label: 'Stalls to Clean', value: 8 },
      { id: 'turnout-schedule', label: 'Turnout Schedule', value: 12 }
    ],
    modules: [
      {
        id: 'feeding-schedule',
        title: 'Feeding Schedule',
        description: 'Daily feeding tasks and special requirements',
        icon: '🥕',
        permission: 'full'
      },
      {
        id: 'stall-management',
        title: 'Stall Management',
        description: 'Cleaning schedules and maintenance tasks',
        icon: '🧹',
        permission: 'full'
      },
      {
        id: 'turnout-management',
        title: 'Turnout Management',
        description: 'Pasture rotations and turnout schedules',
        icon: '🌾',
        permission: 'full'
      },
      {
        id: 'client-communication',
        title: 'Client Communication',
        description: 'Direct client messaging and updates',
        icon: '💬',
        permission: 'none',
        disabled: true
      }
    ]
  },
  admin: {
    stats: [
      { id: 'total-users', label: 'Total Users', value: 156 },
      { id: 'active-horses', label: 'Active Horses', value: 45 },
      { id: 'monthly-revenue', label: 'Monthly Revenue', value: '$32,100' },
      { id: 'system-uptime', label: 'System Uptime', value: '98.7%' }
    ],
    modules: [
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Manage staff and client accounts',
        icon: '👥',
        permission: 'full'
      },
      {
        id: 'security-settings',
        title: 'Security Settings',
        description: 'System security and access control',
        icon: '🔒',
        permission: 'full'
      },
      {
        id: 'system-analytics',
        title: 'System Analytics',
        description: 'Usage statistics and performance metrics',
        icon: '📊',
        permission: 'full'
      },
      {
        id: 'system-configuration',
        title: 'System Configuration',
        description: 'Application settings and customization',
        icon: '⚙️',
        permission: 'full'
      }
    ]
  }
}; 