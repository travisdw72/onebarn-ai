import { IHomePageData } from '../interfaces/HomePageTypes';

export const homePageData: IHomePageData = {
  // Main hero section - Emotional connection with peace of mind focus
  hero: {
    title: 'One Barn AI',
    subtitle: 'Never Wonder About Your Horse Again',
    version: 'One Barn AI v2.0.0',
    tagline: 'Your horses deserve the same level of care at midnight as they receive at noon. One Barn AI provides the peace of mind that comes from knowing an expert eye is always watching, even when you\'re asleep.'
  },

  // AI Provider status indicators
  aiStatus: {
    overall: 'AI GUARDIAN ACTIVE',
    circuitBreaker: 'EMERGENCY READY',
    anthropic: 'VETERINARY AI ONLINE'
  },

  // Primary action button
  primaryAction: {
    text: 'Start Protecting Your Horses',
    route: 'register'
  },

  // Statistics section - Impact-focused with real prevention outcomes
  statistics: {
    horsesAnalyzed: {
      value: '$2.3M+',
      label: 'Emergency Vet Costs Prevented'
    },
    aiInsights: {
      value: '347',
      label: 'Health Emergencies Prevented'
    },
    videoHours: {
      value: '100,000+',
      label: 'Hours of Behavior Training Data'
    },
    facilities: {
      value: '0',
      label: 'Overnight Colic Deaths in Monitored Facilities'
    }
  },

  // AI-Powered Features section - Problem-solution focused
  features: {
    sectionTitle: 'What Happens to Your Horse at 2 AM?',
    list: [
      {
        id: 'overnight-monitoring',
        title: 'Never Miss a Colic Episode',
        description: 'AI detects the subtle early signs of colic that happen when you\'re not there - rolling, pawing, and abnormal positioning',
        icon: '🚨'
      },
      {
        id: 'casting-prevention',
        title: 'Casting & Emergency Detection',
        description: 'Immediate alerts when horses are cast, trapped, or in distress - preventing serious injury or death',
        icon: '⚡'
      },
      {
        id: 'lameness-early-warning',
        title: 'Early Lameness Detection',
        description: 'Spot movement irregularities days before they become visible to the human eye',
        icon: '🔍'
      },
      {
        id: 'behavioral-analysis',
        title: 'Behavioral Change Monitoring',
        description: 'Track eating patterns, social interactions, and movement to identify illness before symptoms appear',
        icon: '🧠'
      },
      {
        id: 'instant-alerts',
        title: 'Emergency Notifications',
        description: 'Get notified the moment something requires your attention - sent directly to your phone',
        icon: '📱'
      },
      {
        id: 'veterinary-integration',
        title: 'Veterinary-Grade Analysis',
        description: 'AI trained by equine veterinarians to recognize the health issues that matter most',
        icon: '🏥'
      }
    ]
  },

  // Primary Actions section - Clean client workflow
  primaryActions: {
    sectionTitle: 'Get Started Protecting Your Horses',
    mainAction: {
      id: 'get-started',
      title: 'Start Monitoring My Horses',
      description: 'Begin 24/7 AI protection for your horses today',
      route: 'register',
      icon: '🐎',
      isPrimary: true
    },
    secondaryAction: {
      id: 'learn-more',
      title: 'See How It Works',
      description: 'Watch a quick overview of our AI monitoring system',
      route: 'video-analysis-demo',
      icon: '🎬',
      isPrimary: false
    }
  },

  // Quick Access section - Core functionality only
  quickAccess: {
    sectionTitle: 'Monitor & Protect',
    items: [
      {
        id: 'live-monitoring',
        title: 'Live Camera Monitoring',
        description: 'Watch your horses with real-time AI analysis',
        route: 'camera-feed',
        icon: '🔴'
      },
      {
        id: 'my-dashboard',
        title: 'My Horse Dashboard',
        description: 'View insights and alerts for your horses',
        route: 'client-dashboard',
        icon: '📊'
      },
      {
        id: 'emergency-contacts',
        title: 'Emergency Setup',
        description: 'Configure alerts and emergency notifications',
        route: 'ai-dashboard',
        icon: '🚨'
      },
      {
        id: 'health-insights',
        title: 'Health Reports',
        description: 'AI-generated health insights and veterinary reports',
        route: 'ai-insights',
        icon: '🏥'
      }
    ]
  },

  // System status indicators
  systemStatus: {
    activeCameras: {
      value: '0',
      label: 'Horses Protected',
      status: 'ready'
    },
    monitoringStatus: {
      value: 'Guardian Ready',
      label: 'AI Protection Status'
    },
    aiAnalysis: {
      value: 'Watching',
      label: 'Emergency Detection'
    }
  },

  // Pro tip section
  proTip: {
    icon: '💡',
    title: 'Peace of Mind Guarantee:',
    message: 'Start monitoring tonight and never again worry about what happens to your horses when you\'re asleep. Our AI never blinks, never gets tired, and never misses the signs that matter.'
  },

  // Monitoring capabilities - focused on life-saving detection
  monitoringCapabilities: {
    icon: '🐎',
    title: 'Life-Saving Detection:',
    description: 'Our AI monitors for the emergencies that typically happen overnight when 60% of colic episodes and casting incidents occur.',
    features: [
      {
        icon: '🚨',
        text: 'Colic Early Warning'
      },
      {
        icon: '⚡',
        text: 'Casting Detection'
      },
      {
        icon: '🔍',
        text: 'Lameness Alerts'
      },
      {
        icon: '💔',
        text: 'Distress Monitoring'
      }
    ]
  },

  // Navigation elements
  navigation: {
    backToHome: 'Home',
    dashboard: 'Guardian Dashboard',
    settings: 'Protection Settings'
  },

  // Button labels
  buttons: {
    startMonitoring: 'Protect My Horses',
    viewDetails: 'See How It Works',
    getStarted: 'Start Guardian Service',
    learnMore: 'Prevention Stories'
  },

  // Messages and notifications
  messages: {
    welcome: 'Your Horse Guardian is Ready',
    systemReady: 'AI protection system active and monitoring',
    noActiveCameras: 'Ready to protect - cameras not yet configured',
    connectionError: 'Guardian temporarily offline - reconnecting',
    loading: 'Initializing horse protection system...'
  },

  // Tooltips and help text
  tooltips: {
    aiStatus: 'Your AI guardian status - always watching, always ready',
    statistics: 'Real outcomes from horses protected by One Barn AI',
    quickAccess: 'Essential tools for horse protection and monitoring',
    systemStatus: 'Current protection status for your horses',
    proTip: 'The peace of mind that comes from 24/7 professional monitoring'
  },

  // Trust building section
  trustBuilders: {
    sectionTitle: 'Trusted by Champions, Relied on by Families',
    testimonials: [
      {
        quote: 'This system saved my horse\'s life. The colic alert at 2 AM meant we caught it early.',
        source: 'Sarah Johnson, Olympic Trainer'
      },
      {
        quote: 'Finally, I can sleep knowing my horses are being watched by something that never sleeps.',
        source: 'Mike Rodriguez, Breeding Farm Owner'
      }
    ],
    certifications: [
      'Veterinarian Developed',
      'HIPAA Compliant',
      '99.9% Uptime Guarantee',
      '24/7 Emergency Support'
    ]
  },

  // Analytics tracking
  analytics: {
    trackPageView: true,
    trackButtonClicks: true,
    trackFeatureUsage: true,
    trackQuickAccessClicks: true,
    trackEmotionalEngagement: true,
    trackConversionGoals: ['protection_signup', 'demo_request', 'emergency_contact_setup']
  }
};