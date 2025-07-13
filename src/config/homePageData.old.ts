import { IHomePageData } from '../interfaces/HomePageTypes';

export const homePageData: IHomePageData = {
  // Main hero section
  hero: {
    title: 'One Barn AI',
    subtitle: 'AI-Powered Equestrian Analysis Platform',
    version: 'One Barn AI v2.0.0',
    tagline: 'Revolutionizing equestrian care through artificial intelligence'
  },

  // AI Provider status indicators
  aiStatus: {
    overall: 'AI ACTIVE',
    circuitBreaker: 'CIRCUITBREAKER',
    anthropic: 'ANTHROPIC'
  },

  // Primary action button
  primaryAction: {
    text: 'Launch AI Dashboard',
    route: '/ai-dashboard'
  },

  // Statistics section
  statistics: {
    horsesAnalyzed: {
      value: '1,247+',
      label: 'Horses Analyzed'
    },
    aiInsights: {
      value: '15,892+',
      label: 'AI Insights Generated'
    },
    videoHours: {
      value: '2,156+',
      label: 'Video Hours Processed'
    },
    facilities: {
      value: '89+',
      label: 'Training Facilities'
    }
  },

  // AI-Powered Features section
  features: {
    sectionTitle: 'AI-Powered Features',
    list: [
      {
        id: 'ai-dashboard',
        title: 'AI Analysis Dashboard',
        description: 'Real-time horse behavior analysis powered by advanced AI models',
        icon: '📊'
      },
      {
        id: 'live-monitoring',
        title: 'Live Monitoring',
        description: 'Continuous monitoring of horse health and performance metrics',
        icon: '📹'
      },
      {
        id: 'performance-insights',
        title: 'Performance Insights',
        description: 'Deep insights into training effectiveness and horse wellness',
        icon: '📈'
      },
      {
        id: 'video-analysis',
        title: 'Video Analysis',
        description: 'Advanced video processing for gait analysis and movement patterns',
        icon: '🎥'
      },
      {
        id: 'security-compliance',
        title: 'Security & Compliance',
        description: 'HIPAA-compliant data handling with enterprise-grade security',
        icon: '🔒'
      },
      {
        id: 'multi-provider-ai',
        title: 'Multi-Provider AI',
        description: 'Leveraging OpenAI, Anthropic, and other leading AI providers',
        icon: '🤖'
      }
    ]
  },

  // Quick Access section
  quickAccess: {
    sectionTitle: 'Quick Access - Horse Monitoring',
    items: [
      {
        id: 'live-camera',
        title: 'Live Camera Monitoring',
        description: 'Real-time AI analysis for horse health',
        route: '/camera-feed',
        icon: '📹'
      },
      {
        id: 'simple-camera',
        title: 'Simple Camera Feed',
        description: 'Basic camera monitoring view',
        route: '/simple-camera',
        icon: '📷'
      },
      {
        id: 'video-analysis',
        title: 'Video Analysis',
        description: 'Upload horse videos for AI analysis',
        route: '/video-analysis',
        icon: '🎥'
      },
      {
        id: 'ai-insights',
        title: 'AI Insights Dashboard',
        description: 'Advanced AI analytics and trends',
        route: '/ai-insights',
        icon: '📊'
      }
    ]
  },

  // System status indicators
  systemStatus: {
    activeCameras: {
      value: '0',
      label: 'Active Cameras',
      status: 'ready'
    },
    monitoringStatus: {
      value: 'Ready',
      label: 'Monitoring Status'
    },
    aiAnalysis: {
      value: 'Online',
      label: 'AI Analysis'
    }
  },

  // Pro tip section
  proTip: {
    icon: '💡',
    title: 'Pro Tip:',
    message: 'Start camera monitoring to get real-time AI analysis of your horse\'s health, behavior, and movement patterns!'
  },

  // Monitoring capabilities
  monitoringCapabilities: {
    icon: '🐎',
    title: 'Monitoring:',
    description: 'Detect lameness, colic signs, behavioral changes, and respiratory issues automatically.',
    features: [
      {
        icon: '🔍',
        text: 'Motion Detection'
      },
      {
        icon: '🧠',
        text: 'Health Analysis'
      },
      {
        icon: '⏰',
        text: '24/7 Monitoring'
      },
      {
        icon: '🚨',
        text: 'Auto Alerts'
      }
    ]
  },

  // Navigation elements
  navigation: {
    backToHome: 'Home',
    dashboard: 'Dashboard',
    settings: 'Settings'
  },

  // Button labels
  buttons: {
    startMonitoring: 'Start Monitoring',
    viewDetails: 'View Details',
    getStarted: 'Get Started',
    learnMore: 'Learn More'
  },

  // Messages and notifications
  messages: {
    welcome: 'Welcome to One Barn AI',
    systemReady: 'System ready for monitoring',
    noActiveCameras: 'No active cameras detected',
    connectionError: 'Connection error - please try again',
    loading: 'Loading system status...'
  },

  // Tooltips and help text
  tooltips: {
    aiStatus: 'Current AI system status and provider availability',
    statistics: 'Real-time statistics from your One Barn AI platform',
    quickAccess: 'Quick shortcuts to commonly used features',
    systemStatus: 'Current system monitoring status',
    proTip: 'Helpful tips to get the most out of your AI monitoring system'
  },

  // Analytics tracking
  analytics: {
    trackPageView: true,
    trackButtonClicks: true,
    trackFeatureUsage: true,
    trackQuickAccessClicks: true
  }
}; 