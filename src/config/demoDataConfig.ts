/**
 * Demo Data Configuration
 * 
 * This file contains realistic demo data for client presentations
 * and workflow demonstrations. In production, this data would come
 * from the database via API calls.
 */

export interface IDemoHorse {
  id: string;
  name: string;
  breed: string;
  age: number;
  color: string;
  gender: 'Mare' | 'Stallion' | 'Gelding';
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  activityLevel: 'High' | 'Medium' | 'Low';
  lastCheckup: string;
  owner: string;
  stall: string;
  cameraStatus: 'Connected' | 'Offline' | 'Connecting';
  aiMonitoringActive: boolean;
  aiInsights: string[];
  alerts: Array<{
    id: string;
    type: 'health' | 'behavior' | 'activity' | 'emergency';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    resolved: boolean;
  }>;
  metrics: {
    totalInsights: number;
    alertsThisWeek: number;
    hoursMonitored: number;
    healthScore: number;
  };
}

export interface IDemoClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  barnName: string;
  subscriptionPlan: 'Basic' | 'Professional' | 'Enterprise';
  joinDate: string;
  status: 'Active' | 'Trial' | 'Suspended';
  horses: IDemoHorse[];
  totalMetrics: {
    totalHorses: number;
    totalInsights: number;
    totalAlertsThisWeek: number;
    totalMonitoringHours: number;
    averageHealthScore: number;
  };
}

// Demo client data for presentations
export const DEMO_CLIENT_DATA: IDemoClient = {
  id: 'client-001',
  name: 'Sarah Henderson',
  email: 'sarah@windridgestables.com',
  phone: '(555) 123-4567',
  barnName: 'Windridge Stables',
  subscriptionPlan: 'Professional',
  joinDate: '2024-01-15',
  status: 'Active',
  horses: [
    {
      id: 'horse-001',
      name: 'Thunder',
      breed: 'Thoroughbred',
      age: 8,
      color: 'Bay',
      gender: 'Stallion',
      healthStatus: 'Excellent',
      activityLevel: 'High',
      lastCheckup: '2024-01-10',
      owner: 'Sarah Henderson',
      stall: 'Stall A-1',
      cameraStatus: 'Connected',
      aiMonitoringActive: true,
      aiInsights: [
        'Consistent exercise patterns indicate excellent cardiovascular health',
        'Feeding behaviors show normal appetite and digestion',
        'No lameness indicators detected in 30-day analysis',
        'Social interactions with other horses are positive and healthy',
        'Sleep patterns are consistent with healthy adult stallions'
      ],
      alerts: [
        {
          id: 'alert-001',
          type: 'behavior',
          message: 'Increased water consumption detected - monitoring for potential health changes',
          timestamp: '2024-01-14T14:30:00',
          severity: 'low',
          resolved: false
        },
        {
          id: 'alert-002',
          type: 'activity',
          message: 'Above-average activity levels - excellent fitness indicators',
          timestamp: '2024-01-13T10:15:00',
          severity: 'low',
          resolved: true
        }
      ],
      metrics: {
        totalInsights: 847,
        alertsThisWeek: 1,
        hoursMonitored: 720,
        healthScore: 94
      }
    },
    {
      id: 'horse-002',
      name: 'Bella',
      breed: 'Quarter Horse',
      age: 6,
      color: 'Chestnut',
      gender: 'Mare',
      healthStatus: 'Good',
      activityLevel: 'Medium',
      lastCheckup: '2024-01-08',
      owner: 'Sarah Henderson',
      stall: 'Stall A-2',
      cameraStatus: 'Connected',
      aiMonitoringActive: true,
      aiInsights: [
        'Slight favoring of left front leg detected - within normal range but monitoring',
        'Overall movement patterns show good coordination and balance',
        'Mare behavior indicates good reproductive health',
        'Social interactions demonstrate confident and calm temperament',
        'Feeding patterns are consistent and healthy'
      ],
      alerts: [
        {
          id: 'alert-003',
          type: 'health',
          message: 'Minor gait irregularity detected - veterinary review recommended within 7 days',
          timestamp: '2024-01-13T09:15:00',
          severity: 'medium',
          resolved: false
        },
        {
          id: 'alert-004',
          type: 'activity',
          message: 'Slightly reduced activity level - normal variation detected',
          timestamp: '2024-01-12T16:45:00',
          severity: 'low',
          resolved: true
        }
      ],
      metrics: {
        totalInsights: 623,
        alertsThisWeek: 2,
        hoursMonitored: 720,
        healthScore: 87
      }
    }
  ],
  totalMetrics: {
    totalHorses: 2,
    totalInsights: 1470,
    totalAlertsThisWeek: 3,
    totalMonitoringHours: 1440,
    averageHealthScore: 91
  }
};

// Additional demo clients for admin/manager views
export const DEMO_CLIENTS: IDemoClient[] = [
  DEMO_CLIENT_DATA,
  {
    id: 'client-002',
    name: 'Michael Rodriguez',
    email: 'mike@sunset-ranch.com',
    phone: '(555) 987-6543',
    barnName: 'Sunset Ranch',
    subscriptionPlan: 'Enterprise',
    joinDate: '2023-11-20',
    status: 'Active',
    horses: [
      {
        id: 'horse-003',
        name: 'Storm',
        breed: 'Arabian',
        age: 5,
        color: 'Gray',
        gender: 'Mare',
        healthStatus: 'Excellent',
        activityLevel: 'High',
        lastCheckup: '2024-01-05',
        owner: 'Michael Rodriguez',
        stall: 'Stall B-1',
        cameraStatus: 'Connected',
        aiMonitoringActive: true,
        aiInsights: [
          'Exceptional movement quality indicates superior athletic ability',
          'Strong cardiovascular markers from activity analysis',
          'Excellent social dominance without aggression'
        ],
        alerts: [],
        metrics: {
          totalInsights: 1203,
          alertsThisWeek: 0,
          hoursMonitored: 2160,
          healthScore: 96
        }
      },
      {
        id: 'horse-004',
        name: 'Duke',
        breed: 'Clydesdale',
        age: 10,
        color: 'Brown',
        gender: 'Gelding',
        healthStatus: 'Good',
        activityLevel: 'Medium',
        lastCheckup: '2024-01-12',
        owner: 'Michael Rodriguez',
        stall: 'Stall B-2',
        cameraStatus: 'Connected',
        aiMonitoringActive: true,
        aiInsights: [
          'Age-appropriate activity levels for senior horse',
          'Joint mobility within normal range for breed',
          'Calm demeanor indicates good mental health'
        ],
        alerts: [
          {
            id: 'alert-005',
            type: 'health',
            message: 'Minor arthritis indicators - consistent with age, monitoring progression',
            timestamp: '2024-01-11T08:30:00',
            severity: 'low',
            resolved: false
          }
        ],
        metrics: {
          totalInsights: 967,
          alertsThisWeek: 1,
          hoursMonitored: 2160,
          healthScore: 83
        }
      }
    ],
    totalMetrics: {
      totalHorses: 2,
      totalInsights: 2170,
      totalAlertsThisWeek: 1,
      totalMonitoringHours: 4320,
      averageHealthScore: 90
    }
  }
];

// Database connection demo status
export const DATABASE_STATUS = {
  connected: true,
  lastSync: '2024-01-14T15:30:00',
  recordsStored: 15847,
  storageUsed: '2.3GB',
  dailyInsights: 127,
  connectionString: 'postgresql://one_barn_prod:***@db.onebarn.ai:5432/production',
  tables: {
    horses: 47,
    clients: 23,
    insights: 15847,
    alerts: 1203,
    camera_feeds: 94,
    ai_analyses: 45691
  }
};

// Live monitoring simulation data
export const LIVE_MONITORING_DATA = {
  isActive: true,
  lastUpdate: Date.now(),
  analysisInterval: 30000, // 30 seconds
  camerasOnline: 4,
  totalCameras: 4,
  aiProcessingQueue: 2,
  recentInsights: [
    'Normal feeding behavior - Thunder - 2 minutes ago',
    'Comfortable resting position - Bella - 5 minutes ago',
    'Active social interaction - Storm - 7 minutes ago',
    'Normal movement patterns - Duke - 12 minutes ago'
  ],
  systemHealth: {
    aiEngine: 'healthy',
    cameraFeeds: 'healthy',
    databaseConnection: 'healthy',
    alertSystem: 'healthy'
  }
};

export default {
  DEMO_CLIENT_DATA,
  DEMO_CLIENTS,
  DATABASE_STATUS,
  LIVE_MONITORING_DATA
}; 