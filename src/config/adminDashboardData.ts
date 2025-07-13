// Admin Dashboard Configuration - Single Source of Truth
// ALL admin dashboard content, data structures, and UI copy
// Based on comprehensive administrative oversight requirements

export interface IAdminDashboardData {
  // 👋 Header and welcome content
  header: {
    title: string;
    subtitle: string;
    platformHealth: string;
    activeFacilities: string;
    systemLoad: string;
    revenueStatus: string;
  };

  // 🎯 Platform KPIs
  platformKPIs: {
    totalFacilities: {
      value: string;
      label: string;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
      change: string;
      description: string;
    };
    activeUsers: {
      value: string;
      label: string;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
      change: string;
      description: string;
    };
    systemUptime: {
      value: string;
      label: string;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
      change: string;
      description: string;
    };
    monthlyRevenue: {
      value: string;
      label: string;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
      change: string;
      description: string;
    };
    supportTickets: {
      value: string;
      label: string;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
      change: string;
      description: string;
    };
  };

  // 🚨 Platform alerts
  platformAlerts: {
    title: string;
    alerts: Array<{
      id: string;
      severity: 'info' | 'warning' | 'error' | 'critical';
      category: 'system' | 'security' | 'performance' | 'billing' | 'client';
      title: string;
      description: string;
      impact: string;
      actionRequired: boolean;
      timestamp: string;
      affectedFacilities?: number;
    }>;
  };

  // ⚡ System performance
  systemPerformance: {
    title: string;
    metrics: Array<{
      id: string;
      component: string;
      value: string;
      target: string;
      status: 'optimal' | 'good' | 'attention' | 'critical';
      trend: 'up' | 'down' | 'stable';
    }>;
  };

  // 🏆 Top facilities
  topFacilities: {
    title: string;
    facilities: Array<{
      id: string;
      name: string;
      location: string;
      horses: number;
      status: 'excellent' | 'good' | 'attention' | 'critical';
      uptime: number;
      monthlyRevenue: string;
      subscriptionTier: string;
    }>;
  };

  // 📊 Client management
  clientManagement: {
    title: string;
    facilities: Array<{
      id: string;
      name: string;
      location: string;
      owner: string;
      status: 'active' | 'inactive' | 'trial' | 'suspended';
      subscriptionTier: string;
      horses: number;
      cameras: number;
      uptime: number;
      monthlyRevenue: string;
      lastLogin: string;
      supportTickets: number;
    }>;
  };

  // 💰 Revenue analytics
  revenueAnalytics: {
    title: string;
    subscriptionTiers: {
      basic: {
        count: number;
        revenue: string;
        trend: 'up' | 'down' | 'stable';
        change: string;
      };
      professional: {
        count: number;
        revenue: string;
        trend: 'up' | 'down' | 'stable';
        change: string;
      };
      enterprise: {
        count: number;
        revenue: string;
        trend: 'up' | 'down' | 'stable';
        change: string;
      };
    };
    streams: Array<{
      id: string;
      source: string;
      amount: string;
      percentage: number;
      trend: 'up' | 'down' | 'stable';
      change: string;
    }>;
  };

  // 🔧 Infrastructure health
  infrastructureHealth: {
    title: string;
    components: Array<{
      id: string;
      name: string;
      status: 'optimal' | 'good' | 'attention' | 'critical';
      cpu: number;
      memory: number;
      disk: number;
      network: string;
      uptime: string;
      lastCheck: string;
    }>;
  };

  // 🤖 AI model performance
  aiModelPerformance: {
    title: string;
    models: Array<{
      id: string;
      name: string;
      status: 'optimal' | 'good' | 'attention' | 'critical';
      accuracy: number;
      latency: string;
      throughput: string;
      version: string;
      lastUpdate: string;
    }>;
  };

  // 💾 Database management
  databaseManagement: {
    title: string;
    databases: Array<{
      id: string;
      name: string;
      status: 'optimal' | 'good' | 'attention' | 'critical';
      size: string;
      connections: number;
      queriesPerSecond: number;
      lastBackup: string;
    }>;
  };

  // 🎟️ Support tickets
  supportTickets: {
    title: string;
    tickets: Array<{
      id: string;
      facility: string;
      subject: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      category: 'technical' | 'billing' | 'feature' | 'bug' | 'general';
      status: 'open' | 'in-progress' | 'resolved' | 'closed';
      created: string;
      assignedTo: string;
      clientName: string;
      clientEmail: string;
      estimatedResolution: string;
      customerSatisfaction: number | null;
      tags: string[];
    }>;
  };

  // 📊 Support management overview
  supportManagement: {
    title: string;
    staffPerformance: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      status: 'active' | 'inactive' | 'busy';
      assignedTickets: number;
      resolvedToday: number;
      avgResolutionTime: string;
      customerSatisfaction: number;
      specialties: string[];
      availability: 'online' | 'offline' | 'busy';
      workload: 'light' | 'medium' | 'high';
    }>;
    escalationRules: Array<{
      id: string;
      condition: string;
      action: string;
      isActive: boolean;
    }>;
  };

  // 📈 Support analytics
  supportAnalytics: {
    title: string;
    ticketVolume: {
      today: number;
      thisWeek: number;
      thisMonth: number;
      trend: 'up' | 'down' | 'stable';
      change: string;
    };
    resolutionMetrics: {
      avgFirstResponse: string;
      avgResolutionTime: string;
      firstCallResolution: string;
      customerSatisfaction: number;
    };
    categoryBreakdown: Array<{
      category: string;
      count: number;
      percentage: number;
      avgResolutionTime: string;
      trend: 'up' | 'down' | 'stable';
    }>;
    priorityDistribution: {
      critical: { count: number; percentage: number };
      high: { count: number; percentage: number };
      medium: { count: number; percentage: number };
      low: { count: number; percentage: number };
    };
  };

  // 🔄 Support workflows
  supportWorkflows: {
    title: string;
    automationRules: Array<{
      id: string;
      name: string;
      description: string;
      isActive: boolean;
      triggersPerDay: number;
    }>;
    templates: Array<{
      id: string;
      name: string;
      category: string;
      usage: number;
      lastUpdated: string;
    }>;
  };

  // 📈 Growth metrics
  growthMetrics: {
    userGrowth: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      description: string;
    };
    revenueGrowth: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      description: string;
    };
    churnRate: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      description: string;
    };
    marketPenetration: {
      value: string;
      trend: 'up' | 'down' | 'stable';
      description: string;
    };
  };

  // 🚀 Development pipeline
  developmentPipeline: {
    title: string;
    features: Array<{
      id: string;
      name: string;
      description: string;
      status: 'planning' | 'in-development' | 'testing' | 'ready' | 'deployed';
      progress: number;
      eta: string;
    }>;
  };

  // 💡 Feature requests
  featureRequests: {
    title: string;
    requests: Array<{
      id: string;
      feature: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      votes: number;
      requestedBy: string;
      timestamp: string;
    }>;
  };

  // 🔗 API usage
  apiUsage: {
    title: string;
    endpoints: Array<{
      id: string;
      name: string;
      requests: string;
      avgResponse: string;
      errorRate: number;
    }>;
  };

  // 📋 Section headers
  headers: {
    systemOverview: string;
    platformKPIs: string;
    systemPerformance: string;
    clientManagement: string;
    revenueAnalytics: string;
    supportTickets: string;
    infrastructureHealth: string;
    aiModelPerformance: string;
    databaseManagement: string;
    developmentPipeline: string;
    featureRequests: string;
    platformAlerts: string;
    topFacilities: string;
    quickActions: string;
    recentActivity: string;
    growthMetrics: string;
    apiUsage: string;
  };

  // 🔘 Navigation tabs
  tabs: {
    overview: {
      id: string;
      label: string;
      icon: string;
    };
    clients: {
      id: string;
      label: string;
      icon: string;
    };
    system: {
      id: string;
      label: string;
      icon: string;
    };
    support: {
      id: string;
      label: string;
      icon: string;
    };
    business: {
      id: string;
      label: string;
      icon: string;
    };
    development: {
      id: string;
      label: string;
      icon: string;
    };
  };

  // 🔘 Button labels
  buttons: {
    viewAll: string;
    refresh: string;
    export: string;
    configure: string;
    save: string;
    cancel: string;
    update: string;
    create: string;
    delete: string;
    edit: string;
    suspend: string;
    activate: string;
    resolve: string;
    acknowledge: string;
    escalate: string;
    autoRefresh: string;
    platformAlert: string;
    systemBackup: string;
    generateReport: string;
    testConnections: string;
    resetCache: string;
  };

  // ⚡ Quick actions
  quickActions: {
    title: string;
    actions: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      priority: 'high' | 'medium' | 'low';
      route?: string;
    }>;
  };

  // 📊 Recent activity
  recentActivity: {
    title: string;
    activities: Array<{
      id: string;
      action: string;
      facility: string;
      user: string;
      timestamp: string;
      type: 'login' | 'alert' | 'system' | 'billing' | 'support';
    }>;
  };

  // 📊 Support metrics
  supportMetrics: {
    averageResponseTime: {
      value: string;
      description: string;
    };
    resolutionRate: {
      value: string;
      description: string;
    };
    customerSatisfaction: {
      value: string;
      description: string;
    };
    openTickets: {
      value: string;
      description: string;
    };
  };

  // 💬 Messages and alerts
  messages: {
    systemHealthy: string;
    systemWarning: string;
    systemCritical: string;
    noAlerts: string;
    noTickets: string;
    dataLoading: string;
    dataError: string;
    unauthorizedAccess: string;
    backupInProgress: string;
    maintenanceMode: string;
  };

  // 💡 Tooltip text
  tooltips: {
    platformKPIs: string;
    systemPerformance: string;
    clientManagement: string;
    supportTickets: string;
    aiModelPerformance: string;
    infrastructureHealth: string;
    developmentPipeline: string;
    autoRefresh: string;
    exportData: string;
    backupSystem: string;
    testConnections: string;
    resetCache: string;
    default: string;
  };
}

export const adminDashboardConfig: IAdminDashboardData = {
  // 👋 Header configuration
  header: {
    title: "One Barn AI Platform Administration",
    subtitle: "Global platform management and system oversight",
    platformHealth: "All systems operational - 99.8% uptime across 127 facilities",
    activeFacilities: "127 facilities actively monitoring 3,247 horses worldwide",
    systemLoad: "Optimal performance - 78% capacity with auto-scaling enabled",
    revenueStatus: "$2.4M monthly recurring revenue, growing 23% YoY"
  },

  // 🎯 Platform KPIs
  platformKPIs: {
    totalFacilities: {
      value: "127",
      label: "Active Facilities",
      status: "excellent",
      trend: "up",
      change: "+12 this month",
      description: "Facilities actively using the platform"
    },
    activeUsers: {
      value: "1,847",
      label: "Active Users",
      status: "excellent",
      trend: "up",
      change: "+156 this month",
      description: "Monthly active users across all facilities"
    },
    systemUptime: {
      value: "99.8%",
      label: "Platform Uptime",
      status: "excellent",
      trend: "stable",
      change: "Consistent",
      description: "30-day rolling uptime percentage"
    },
    monthlyRevenue: {
      value: "$2.4M",
      label: "Monthly Revenue",
      status: "excellent",
      trend: "up",
      change: "+23% YoY",
      description: "Monthly recurring revenue"
    },
    supportTickets: {
      value: "23",
      label: "Open Tickets",
      status: "good",
      trend: "down",
      change: "-8 this week",
      description: "Active support tickets requiring attention"
    }
  },

  // 🚨 Platform alerts
  platformAlerts: {
    title: "Platform-Wide Alerts & Issues",
    alerts: [
      {
        id: "alert-001",
        severity: "warning",
        category: "performance",
        title: "High API Usage - West Coast Servers",
        description: "API request volume 15% above normal on west coast servers during peak hours",
        impact: "Potential latency increase for 23 facilities",
        actionRequired: true,
        timestamp: "15 minutes ago",
        affectedFacilities: 23
      },
      {
        id: "alert-002",
        severity: "info",
        category: "system",
        title: "Scheduled Maintenance Window",
        description: "Database optimization scheduled for Sunday 2:00 AM EST",
        impact: "5-minute service interruption expected",
        actionRequired: false,
        timestamp: "2 hours ago",
        affectedFacilities: 127
      },
      {
        id: "alert-003",
        severity: "error",
        category: "billing",
        title: "Payment Processing Issue",
        description: "3 facilities experiencing payment processing delays",
        impact: "Subscription renewals affected",
        actionRequired: true,
        timestamp: "4 hours ago",
        affectedFacilities: 3
      }
    ]
  },

  // ⚡ System performance
  systemPerformance: {
    title: "Real-Time System Performance",
    metrics: [
      {
        id: "perf-001",
        component: "API Gateway",
        value: "98.7",
        target: "95.0",
        status: "optimal",
        trend: "stable"
      },
      {
        id: "perf-002",
        component: "Database Cluster",
        value: "94.2",
        target: "90.0",
        status: "optimal",
        trend: "up"
      },
      {
        id: "perf-003",
        component: "AI Processing",
        value: "87.3",
        target: "85.0",
        status: "good",
        trend: "stable"
      },
      {
        id: "perf-004",
        component: "Video Streaming",
        value: "96.8",
        target: "95.0",
        status: "optimal",
        trend: "up"
      },
      {
        id: "perf-005",
        component: "Mobile API",
        value: "99.1",
        target: "98.0",
        status: "optimal",
        trend: "stable"
      }
    ]
  },

  // 🏆 Top facilities
  topFacilities: {
    title: "Top Performing Facilities",
    facilities: [
      {
        id: "fac-001",
        name: "Wellington Training Center",
        location: "Wellington, FL",
        horses: 48,
        status: "excellent",
        uptime: 99.9,
        monthlyRevenue: "$4,200",
        subscriptionTier: "Enterprise"
      },
      {
        id: "fac-002",
        name: "Sunset Ridge Equestrian",
        location: "Lexington, KY",
        horses: 32,
        status: "excellent",
        uptime: 99.7,
        monthlyRevenue: "$2,800",
        subscriptionTier: "Professional"
      },
      {
        id: "fac-003",
        name: "Royal Oak Stables",
        location: "Aiken, SC",
        horses: 24,
        status: "good",
        uptime: 98.5,
        monthlyRevenue: "$2,100",
        subscriptionTier: "Professional"
      }
    ]
  },

  // 📊 Client management
  clientManagement: {
    title: "Client Facility Management",
    facilities: [
      {
        id: "cli-001",
        name: "Wellington Training Center",
        location: "Wellington, FL",
        owner: "Sarah Johnson",
        status: "active",
        subscriptionTier: "Enterprise",
        horses: 48,
        cameras: 12,
        uptime: 99.9,
        monthlyRevenue: "$4,200",
        lastLogin: "2 hours ago",
        supportTickets: 0
      },
      {
        id: "cli-002",
        name: "Sunset Ridge Equestrian",
        location: "Lexington, KY",
        owner: "Michael Thompson",
        status: "active",
        subscriptionTier: "Professional",
        horses: 32,
        cameras: 8,
        uptime: 99.7,
        monthlyRevenue: "$2,800",
        lastLogin: "45 minutes ago",
        supportTickets: 1
      },
      {
        id: "cli-003",
        name: "Pine Valley Equestrian",
        location: "Ocala, FL",
        owner: "Jennifer Davis",
        status: "trial",
        subscriptionTier: "Professional",
        horses: 16,
        cameras: 4,
        uptime: 97.2,
        monthlyRevenue: "$0",
        lastLogin: "1 day ago",
        supportTickets: 2
      }
    ]
  },

  // 💰 Revenue analytics
  revenueAnalytics: {
    title: "Revenue Stream Analysis",
    subscriptionTiers: {
      basic: {
        count: 28,
        revenue: "$22,500",
        trend: "stable",
        change: "+2%"
      },
      professional: {
        count: 84,
        revenue: "$201,000",
        trend: "up",
        change: "+12%"
      },
      enterprise: {
        count: 15,
        revenue: "$150,000",
        trend: "up",
        change: "+25%"
      }
    },
    streams: [
      {
        id: "rev-001",
        source: "Professional Subscriptions",
        amount: "$201,000",
        percentage: 52,
        trend: "up",
        change: "+12%"
      },
      {
        id: "rev-002",
        source: "Enterprise Subscriptions",
        amount: "$150,000",
        percentage: 39,
        trend: "up",
        change: "+25%"
      },
      {
        id: "rev-003",
        source: "Basic Subscriptions",
        amount: "$22,500",
        percentage: 6,
        trend: "stable",
        change: "+2%"
      },
      {
        id: "rev-004",
        source: "Add-on Services",
        amount: "$11,500",
        percentage: 3,
        trend: "up",
        change: "+18%"
      }
    ]
  },

  // 🔧 Infrastructure health
  infrastructureHealth: {
    title: "Infrastructure Health Monitoring",
    components: [
      {
        id: "infra-001",
        name: "Primary Database Cluster",
        status: "optimal",
        cpu: 67,
        memory: 72,
        disk: 45,
        network: "1.2 GB/s",
        uptime: "99.9%",
        lastCheck: "30 seconds ago"
      },
      {
        id: "infra-002",
        name: "API Gateway Cluster",
        status: "optimal",
        cpu: 45,
        memory: 58,
        disk: 32,
        network: "850 MB/s",
        uptime: "99.8%",
        lastCheck: "45 seconds ago"
      },
      {
        id: "infra-003",
        name: "AI Processing Servers",
        status: "good",
        cpu: 89,
        memory: 76,
        disk: 65,
        network: "2.1 GB/s",
        uptime: "98.7%",
        lastCheck: "1 minute ago"
      }
    ]
  },

  // 🤖 AI model performance
  aiModelPerformance: {
    title: "AI Model Performance & Analytics",
    models: [
      {
        id: "ai-001",
        name: "Horse Health Analysis",
        status: "optimal",
        accuracy: 94.7,
        latency: "145ms",
        throughput: "847 req/min",
        version: "v2.3.1",
        lastUpdate: "2 days ago"
      },
      {
        id: "ai-002",
        name: "Behavior Pattern Recognition",
        status: "optimal",
        accuracy: 91.2,
        latency: "178ms",
        throughput: "623 req/min",
        version: "v1.8.4",
        lastUpdate: "1 week ago"
      },
      {
        id: "ai-003",
        name: "Gait Analysis",
        status: "attention",
        accuracy: 87.3,
        latency: "234ms",
        throughput: "445 req/min",
        version: "v1.5.2",
        lastUpdate: "3 weeks ago"
      }
    ]
  },

  // 💾 Database management
  databaseManagement: {
    title: "Database Management & Monitoring",
    databases: [
      {
        id: "db-001",
        name: "Primary Application DB",
        status: "optimal",
        size: "2.4 TB",
        connections: 247,
        queriesPerSecond: 1847,
        lastBackup: "6 hours ago"
      },
      {
        id: "db-002",
        name: "Analytics Warehouse",
        status: "optimal",
        size: "8.7 TB",
        connections: 89,
        queriesPerSecond: 423,
        lastBackup: "12 hours ago"
      },
      {
        id: "db-003",
        name: "Video Metadata Store",
        status: "good",
        size: "1.2 TB",
        connections: 156,
        queriesPerSecond: 672,
        lastBackup: "8 hours ago"
      }
    ]
  },

  // 🎟️ Support tickets
  supportTickets: {
    title: "Support Ticket Management",
    tickets: [
      {
        id: "TICK-001",
        facility: "Sunset Ridge Equestrian",
        subject: "Camera connection issues",
        description: "Intermittent connection drops on cameras 3 and 5",
        priority: "high",
        category: "technical",
        status: "in-progress",
        created: "2 hours ago",
        assignedTo: "Tech Support - Alex",
        clientName: "Sarah Johnson",
        clientEmail: "sarah@sunsetridge.com",
        estimatedResolution: "4 hours",
        customerSatisfaction: null,
        tags: ["camera", "connectivity", "urgent"]
      },
      {
        id: "TICK-002",
        facility: "Pine Valley Equestrian",
        subject: "Billing question about upgrade",
        description: "Client wants to understand pricing for upgrading to Professional tier",
        priority: "low",
        category: "billing",
        status: "open",
        created: "4 hours ago",
        assignedTo: "Sales - Maria",
        clientName: "Michael Chen",
        clientEmail: "michael@pinevalley.com",
        estimatedResolution: "2 hours",
        customerSatisfaction: null,
        tags: ["billing", "upgrade", "pricing"]
      },
      {
        id: "TICK-003",
        facility: "Royal Oak Stables",
        subject: "AI alert false positive",
        description: "Health alert triggered for healthy horse - needs model adjustment",
        priority: "medium",
        category: "technical",
        status: "open",
        created: "6 hours ago",
        assignedTo: "AI Team - David",
        clientName: "Emma Wilson",
        clientEmail: "emma@royaloak.com",
        estimatedResolution: "24 hours",
        customerSatisfaction: null,
        tags: ["ai", "false-positive", "health-alert"]
      },
      {
        id: "TICK-004",
        facility: "Wellington Training Center",
        subject: "Mobile app crashes on iOS",
        description: "App crashes when trying to view live camera feed on iPhone 15",
        priority: "high",
        category: "bug",
        status: "resolved",
        created: "1 day ago",
        assignedTo: "Dev Team - Lisa",
        clientName: "Robert Taylor",
        clientEmail: "robert@wellington.com",
        estimatedResolution: "8 hours",
        customerSatisfaction: 4.5,
        tags: ["mobile", "ios", "camera", "crash"]
      },
      {
        id: "TICK-005",
        facility: "Meadowbrook Equestrian",
        subject: "Request for training analytics feature",
        description: "Would like detailed analytics on training session effectiveness",
        priority: "low",
        category: "feature",
        status: "open",
        created: "3 days ago",
        assignedTo: "Product - James",
        clientName: "Jennifer Adams",
        clientEmail: "jennifer@meadowbrook.com",
        estimatedResolution: "2 weeks",
        customerSatisfaction: null,
        tags: ["feature-request", "analytics", "training"]
      }
    ]
  },

  // 📊 Support management overview
  supportManagement: {
    title: "Support Management Overview",
    staffPerformance: [
      {
        id: "staff-001",
        name: "Alex Thompson",
        email: "alex@onebarn.com",
        role: "Senior Technical Support",
        status: "active",
        assignedTickets: 12,
        resolvedToday: 3,
        avgResolutionTime: "2.5 hours",
        customerSatisfaction: 4.7,
        specialties: ["Technical Issues", "Camera Systems", "AI Alerts"],
        availability: "online",
        workload: "medium"
      },
      {
        id: "staff-002",
        name: "Maria Rodriguez",
        email: "maria@onebarn.com",
        role: "Billing Specialist",
        status: "active",
        assignedTickets: 8,
        resolvedToday: 5,
        avgResolutionTime: "45 minutes",
        customerSatisfaction: 4.9,
        specialties: ["Billing", "Subscriptions", "Account Management"],
        availability: "online",
        workload: "light"
      },
      {
        id: "staff-003",
        name: "David Kim",
        email: "david@onebarn.com",
        role: "AI Support Specialist",
        status: "active",
        assignedTickets: 6,
        resolvedToday: 2,
        avgResolutionTime: "4 hours",
        customerSatisfaction: 4.3,
        specialties: ["AI Systems", "Model Training", "False Positives"],
        availability: "busy",
        workload: "high"
      }
    ],
    escalationRules: [
      {
        id: "escalation-001",
        condition: "High priority tickets unresolved > 4 hours",
        action: "Auto-escalate to Senior Support",
        isActive: true
      },
      {
        id: "escalation-002",
        condition: "Critical tickets unresolved > 1 hour",
        action: "Notify Support Manager",
        isActive: true
      },
      {
        id: "escalation-003",
        condition: "Customer satisfaction < 3.0",
        action: "Manager review required",
        isActive: true
      }
    ]
  },

  // 📈 Support analytics
  supportAnalytics: {
    title: "Support Analytics & Insights",
    ticketVolume: {
      today: 15,
      thisWeek: 87,
      thisMonth: 342,
      trend: "up",
      change: "+12%"
    },
    resolutionMetrics: {
      avgFirstResponse: "18 minutes",
      avgResolutionTime: "2.3 hours",
      firstCallResolution: "73%",
      customerSatisfaction: 4.6
    },
    categoryBreakdown: [
      {
        category: "Technical",
        count: 156,
        percentage: 45.6,
        avgResolutionTime: "3.2 hours",
        trend: "stable"
      },
      {
        category: "Billing",
        count: 98,
        percentage: 28.7,
        avgResolutionTime: "1.1 hours",
        trend: "down"
      },
      {
        category: "Feature Request",
        count: 54,
        percentage: 15.8,
        avgResolutionTime: "5.2 days",
        trend: "up"
      },
      {
        category: "Bug Report",
        count: 34,
        percentage: 9.9,
        avgResolutionTime: "8.7 hours",
        trend: "stable"
      }
    ],
    priorityDistribution: {
      critical: { count: 12, percentage: 3.5 },
      high: { count: 67, percentage: 19.6 },
      medium: { count: 154, percentage: 45.0 },
      low: { count: 109, percentage: 31.9 }
    }
  },

  // 🔄 Support workflows
  supportWorkflows: {
    title: "Support Workflows & Automation",
    automationRules: [
      {
        id: "auto-001",
        name: "Auto-categorize billing inquiries",
        description: "Automatically categorize tickets containing billing keywords",
        isActive: true,
        triggersPerDay: 23
      },
      {
        id: "auto-002",
        name: "Priority escalation for VIP clients",
        description: "Automatically set high priority for Enterprise tier clients",
        isActive: true,
        triggersPerDay: 7
      },
      {
        id: "auto-003",
        name: "Knowledge base suggestions",
        description: "Auto-suggest relevant KB articles based on ticket content",
        isActive: true,
        triggersPerDay: 156
      }
    ],
    templates: [
      {
        id: "template-001",
        name: "Camera Connection Issues",
        category: "technical",
        usage: 45,
        lastUpdated: "2 days ago"
      },
      {
        id: "template-002",
        name: "Billing Inquiry Response",
        category: "billing",
        usage: 78,
        lastUpdated: "1 week ago"
      },
      {
        id: "template-003",
        name: "Feature Request Acknowledgment",
        category: "feature",
        usage: 23,
        lastUpdated: "3 days ago"
      }
    ]
  },

  // 📈 Growth metrics
  growthMetrics: {
    userGrowth: {
      value: "+23%",
      trend: "up",
      description: "Monthly active user growth rate"
    },
    revenueGrowth: {
      value: "+31%",
      trend: "up",
      description: "Year-over-year revenue growth"
    },
    churnRate: {
      value: "2.1%",
      trend: "down",
      description: "Monthly customer churn rate"
    },
    marketPenetration: {
      value: "8.3%",
      trend: "up",
      description: "Market share in equestrian tech"
    }
  },

  // 🚀 Development pipeline
  developmentPipeline: {
    title: "Development Pipeline & Roadmap",
    features: [
      {
        id: "dev-001",
        name: "Advanced Gait Analysis",
        description: "Enhanced AI model for detailed gait pattern analysis and lameness detection",
        status: "in-development",
        progress: 75,
        eta: "2 weeks"
      },
      {
        id: "dev-002",
        name: "Mobile App v3.0",
        description: "Complete mobile app redesign with offline capabilities",
        status: "testing",
        progress: 90,
        eta: "1 week"
      },
      {
        id: "dev-003",
        name: "Multi-facility Dashboard",
        description: "Consolidated dashboard for managing multiple facilities",
        status: "ready",
        progress: 100,
        eta: "Ready for deployment"
      },
      {
        id: "dev-004",
        name: "Predictive Health Analytics",
        description: "AI-powered predictive health insights and recommendations",
        status: "planning",
        progress: 25,
        eta: "8 weeks"
      }
    ]
  },

  // 💡 Feature requests
  featureRequests: {
    title: "Feature Requests & User Feedback",
    requests: [
      {
        id: "req-001",
        feature: "Custom Alert Thresholds",
        description: "Allow users to customize AI alert sensitivity per horse",
        priority: "high",
        votes: 47,
        requestedBy: "Multiple Facilities",
        timestamp: "2 weeks ago"
      },
      {
        id: "req-002",
        feature: "Weather Integration",
        description: "Integrate weather data to correlate with horse behavior patterns",
        priority: "medium",
        votes: 23,
        requestedBy: "Sunset Ridge Equestrian",
        timestamp: "1 month ago"
      },
      {
        id: "req-003",
        feature: "Veterinary Portal",
        description: "Dedicated portal for veterinarians to access horse health data",
        priority: "high",
        votes: 38,
        requestedBy: "Wellington Training Center",
        timestamp: "3 weeks ago"
      }
    ]
  },

  // 🔗 API usage
  apiUsage: {
    title: "API Usage & Integration Metrics",
    endpoints: [
      {
        id: "api-001",
        name: "Horse Health API",
        requests: "1.2M",
        avgResponse: "145ms",
        errorRate: 0.3
      },
      {
        id: "api-002",
        name: "Video Analysis API",
        requests: "847K",
        avgResponse: "234ms",
        errorRate: 0.7
      },
      {
        id: "api-003",
        name: "Alert Management API",
        requests: "623K",
        avgResponse: "89ms",
        errorRate: 0.2
      },
      {
        id: "api-004",
        name: "User Management API",
        requests: "445K",
        avgResponse: "67ms",
        errorRate: 0.1
      }
    ]
  },

  // 📋 Headers
  headers: {
    systemOverview: "System Overview",
    platformKPIs: "Platform Key Performance Indicators",
    systemPerformance: "Real-Time System Performance",
    clientManagement: "Client Facility Management",
    revenueAnalytics: "Revenue Analytics & Growth",
    supportTickets: "Support Ticket Management",
    infrastructureHealth: "Infrastructure Health Monitoring",
    aiModelPerformance: "AI Model Performance & Analytics",
    databaseManagement: "Database Management & Monitoring",
    developmentPipeline: "Development Pipeline & Roadmap",
    featureRequests: "Feature Requests & User Feedback",
    platformAlerts: "Platform-Wide Alerts & Issues",
    topFacilities: "Top Performing Facilities",
    quickActions: "Quick Administrative Actions",
    recentActivity: "Recent Platform Activity",
    growthMetrics: "Growth Metrics & KPIs",
    apiUsage: "API Usage & Integration Metrics"
  },

  // 🔘 Tabs
  tabs: {
    overview: {
      id: "overview",
      label: "Overview",
      icon: "📊"
    },
    clients: {
      id: "clients",
      label: "Clients",
      icon: "👥"
    },
    system: {
      id: "system",
      label: "System",
      icon: "⚙️"
    },
    support: {
      id: "support",
      label: "Support",
      icon: "🎟️"
    },
    business: {
      id: "business",
      label: "Business",
      icon: "💼"
    },
    development: {
      id: "development",
      label: "Development",
      icon: "🚀"
    }
  },

  // 🔘 Buttons
  buttons: {
    viewAll: "View All",
    refresh: "Refresh",
    export: "Export",
    configure: "Configure",
    save: "Save Changes",
    cancel: "Cancel",
    update: "Update",
    create: "Create",
    delete: "Delete",
    edit: "Edit",
    suspend: "Suspend",
    activate: "Activate",
    resolve: "Resolve",
    acknowledge: "Acknowledge",
    escalate: "Escalate",
    autoRefresh: "Auto Refresh",
    platformAlert: "Platform Alert",
    systemBackup: "System Backup",
    generateReport: "Generate Report",
    testConnections: "Test Connections",
    resetCache: "Reset Cache"
  },

  // ⚡ Quick actions
  quickActions: {
    title: "Quick Administrative Actions",
    actions: [
      {
        id: "action-001",
        title: "System Backup",
        description: "Initiate full system backup",
        icon: "💾",
        priority: "high"
      },
      {
        id: "action-002",
        title: "Generate Reports",
        description: "Create comprehensive system reports",
        icon: "📊",
        priority: "medium"
      },
      {
        id: "action-003",
        title: "User Management",
        description: "Manage user accounts and permissions",
        icon: "👥",
        priority: "medium",
        route: "/admin/users"
      },
      {
        id: "action-004",
        title: "AI Configuration",
        description: "Configure AI models and thresholds",
        icon: "🤖",
        priority: "high",
        route: "/admin/ai-config"
      },
      {
        id: "action-005",
        title: "Support Queue",
        description: "Review pending support tickets",
        icon: "🎟️",
        priority: "medium",
        route: "/admin/support"
      },
      {
        id: "action-006",
        title: "System Health",
        description: "Monitor system health and performance",
        icon: "⚡",
        priority: "high",
        route: "/admin/system-health"
      }
    ]
  },

  // 📊 Recent activity
  recentActivity: {
    title: "Recent Platform Activity",
    activities: [
      {
        id: "act-001",
        action: "User Login",
        facility: "Wellington Training Center",
        user: "Sarah Johnson",
        timestamp: "2 minutes ago",
        type: "login"
      },
      {
        id: "act-002",
        action: "Alert Triggered",
        facility: "Sunset Ridge Equestrian",
        user: "System",
        timestamp: "5 minutes ago",
        type: "alert"
      },
      {
        id: "act-003",
        action: "Backup Completed",
        facility: "All Systems",
        user: "System",
        timestamp: "15 minutes ago",
        type: "system"
      },
      {
        id: "act-004",
        action: "Payment Processed",
        facility: "Royal Oak Stables",
        user: "Billing System",
        timestamp: "1 hour ago",
        type: "billing"
      },
      {
        id: "act-005",
        action: "Support Ticket Created",
        facility: "Pine Valley Equestrian",
        user: "Jennifer Davis",
        timestamp: "2 hours ago",
        type: "support"
      }
    ]
  },

  // 📊 Support metrics
  supportMetrics: {
    averageResponseTime: {
      value: "2.3 hours",
      description: "Average first response time to support tickets"
    },
    resolutionRate: {
      value: "94%",
      description: "Percentage of tickets resolved within SLA"
    },
    customerSatisfaction: {
      value: "4.7/5",
      description: "Average customer satisfaction rating"
    },
    openTickets: {
      value: "23",
      description: "Currently open support tickets"
    }
  },

  // 💬 Messages
  messages: {
    systemHealthy: "All systems are operating normally",
    systemWarning: "Some systems require attention - please review alerts",
    systemCritical: "Critical system issues detected - immediate action required",
    noAlerts: "No active platform alerts",
    noTickets: "No open support tickets",
    dataLoading: "Loading platform data...",
    dataError: "Error loading platform data - please refresh",
    unauthorizedAccess: "You do not have permission to access this section",
    backupInProgress: "System backup in progress - some features may be limited",
    maintenanceMode: "Platform is in maintenance mode - limited functionality available"
  },

  // 💡 Tooltips
  tooltips: {
    platformKPIs: "Key performance indicators for overall platform health and growth",
    systemPerformance: "Real-time performance metrics for critical system components",
    clientManagement: "Overview of all client facilities and their subscription status",
    supportTickets: "Active support tickets requiring administrative attention",
    aiModelPerformance: "Performance analytics for AI models powering the platform",
    infrastructureHealth: "Health and performance of underlying infrastructure components",
    developmentPipeline: "Current development projects and their progress status",
    autoRefresh: "Automatically refresh dashboard data every 30 seconds",
    exportData: "Export current dashboard data to CSV or PDF format",
    backupSystem: "Initiate a full system backup including all user data",
    testConnections: "Test connectivity to all external services and APIs",
    resetCache: "Clear system cache to resolve performance issues",
    default: "Click for more details and available actions"
  }
};

// Legacy interfaces for backward compatibility
export interface SystemMetric {
  id: string;
  key: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'employee' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  barn: string;
  joinDate: string;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

export interface AIMetric {
  key: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

export type AdminTabId = 'overview' | 'clients' | 'system' | 'support' | 'business' | 'development'; 