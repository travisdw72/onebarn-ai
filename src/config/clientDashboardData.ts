import type { 
  IClientDashboardData, 
  IClientHorse, 
  ICameraFeed, 
  IRecording, 
  IClientMessage, 
  ISubscriptionPlan,
  IClientAlert,
  IClientUser
} from '../interfaces/ClientTypes';

// Client Dashboard Configuration - Single Source of Truth
export const clientDashboardConfig = {
  welcome: {
    title: 'Welcome back, {userName}!',
    subtitle: 'Monitor your horses in real-time with our premium live streaming service'
  },
  navigation: {
    dashboard: 'Dashboard',
    horses: 'My Horses',
    cameras: 'Live Cameras',
    recordings: 'Recordings',
    messages: 'Messages',
    billing: 'Billing'
  },
  buttons: {
    viewAllCameras: '📹 View All Cameras',
    sendMessage: '💬 Send Message',
    watchLive: '🎥 Watch Live',
    healthReport: '📊 Health Report',
    performance: '🏆 Stats',
    viewDetails: 'View Details',
    viewAll: 'View All',
    play: '▶️ Play',
    download: '⬇️ Download',
    share: '📤 Share',
    mobileApp: '📱 Mobile App',
    cameraSettings: '⚙️ Camera Settings',
    startRecording: '🔴 Start Recording',
    filterByDate: 'Filter by Date',
    filterByCamera: 'Filter by Camera',
    downloadAll: 'Download All',
    selectPlan: 'Select Plan',
    currentPlan: 'Current Plan',
    upgrade: 'Upgrade',
    upgradeNow: 'Upgrade Now'
  },
  headers: {
    liveCameraMonitoring: 'Live Camera Monitoring',
    availableCameras: 'Available Cameras',
    myHorses: 'My Horses',
    recentMessages: 'Recent Messages',
    recordedFootage: '📹 Recorded Footage',
    premiumLiveCameraPlans: '🌟 Premium Live Camera Plans'
  },
  messages: {
    liveCameraDescription: 'Real-time surveillance of your horses with high-definition video streaming',
    mobileWarning: 'Download our mobile app for optimal camera viewing on phones and tablets. High-definition streaming optimized for all devices.',
    mobileWarningTitle: '📱 Mobile Viewing Available',
    privacyNoticeTitle: '🔒 Privacy & Security Notice',
    privacyNoticeContent: 'All camera feeds are encrypted and accessible only to you and authorized facility staff. Recordings are stored securely and automatically deleted according to your subscription plan. Camera access can be revoked or modified at any time through your account settings.',
    upgradePrompt: 'Upgrade to Premium Plus to access this camera feed!',
    unlockMoreCameras: '🌟 Unlock More Cameras',
    unlockDescription: 'Access up to 12 camera feeds with Premium Plus',
    currentlyVisible: '📹 Currently visible on {cameraName} camera',
    chooseMonitoringSolution: 'Choose the perfect monitoring solution for your horses'
  },
  cameraControls: {
    zoomIn: 'Zoom In',
    panLeft: 'Pan Left',
    panRight: 'Pan Right',
    fullscreen: 'Fullscreen',
    audio: 'Audio'
  },
  cameraStatus: {
    live: 'LIVE',
    online: '🟢 Online',
    offline: '🔴 Offline',
    maintenance: '🟡 Maintenance',
    active: '🟢 Active',
    upgradeRequired: 'Upgrade to Premium Plus'
  },
  subscriptionPlans: {
    choosePerfectPlan: 'Choose the perfect monitoring solution for your horses'
  }
};

// Demo Client User
export const demoClientUser: IClientUser = {
  id: 'client-001',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: 'SJ',
  subscriptionTier: 'premium',
  memberSince: '2024-01-15'
};

// Demo Client Dashboard Data
export const clientDashboardData: IClientDashboardData = {
  horses: [
    {
      id: 'horse-001',
      name: 'Thunder Bay',
      breed: 'Quarter Horse',
      age: 8,
      gender: 'gelding',
      stallLocation: 'Stall A-1',
      cameraId: 'cam-001',
      status: 'active',
      lastActivity: '2 hours ago'
    },
    {
      id: 'horse-002',
      name: 'Midnight Star',
      breed: 'Paint Horse',
      age: 6,
      gender: 'mare',
      stallLocation: 'Stall A-2',
      cameraId: 'cam-002',
      status: 'training',
      lastActivity: '4 hours ago'
    }
  ],
  cameras: [
    {
      id: 'cam-001',
      name: 'Stall A-1 - Thunder Bay',
      location: 'Stall A-1',
      status: 'online',
      quality: '1080p',
      features: ['Night Vision', 'Motion Detection', 'Audio'],
      isLive: true,
      isPremium: false,
      horseId: 'horse-001'
    },
    {
      id: 'cam-002',
      name: 'Stall A-2 - Midnight Star',
      location: 'Stall A-2',
      status: 'online',
      quality: '1080p',
      features: ['Night Vision', 'Motion Detection'],
      isLive: true,
      isPremium: false,
      horseId: 'horse-002'
    },
    {
      id: 'cam-003',
      name: 'Main Arena',
      location: 'Training Arena',
      status: 'online',
      quality: '4K',
      features: ['Pan/Tilt/Zoom', 'Audio', 'Recording'],
      isLive: true,
      isPremium: false
    },
    {
      id: 'cam-004',
      name: 'Pasture 1 - Overview',
      location: 'Pasture 1',
      status: 'online',
      quality: '1080p',
      features: ['Wide Angle', 'Weather Resistant'],
      isLive: true,
      isPremium: false
    },
    {
      id: 'cam-005',
      name: 'Wash Bay Camera',
      location: 'Wash Bay',
      status: 'online',
      quality: '1080p',
      features: ['High Definition', 'Audio'],
      isLive: true,
      isPremium: true
    },
    {
      id: 'cam-006',
      name: 'Feed Room Security',
      location: 'Feed Room',
      status: 'online',
      quality: '720p',
      features: ['Security', 'Motion Detection'],
      isLive: true,
      isPremium: true
    }
  ],
  recordings: [
    {
      id: 'rec-001',
      title: 'Thunder Bay Arena Training Session',
      cameraName: 'Main Arena Camera',
      date: 'June 10, 2025',
      startTime: '9:00 AM',
      endTime: '10:30 AM',
      duration: '1.5 hours',
      isDownloadable: true
    },
    {
      id: 'rec-002',
      title: 'Midnight Star Stall Activity',
      cameraName: 'Stall A-2 Camera',
      date: 'June 9, 2025',
      startTime: '6:00 PM',
      endTime: '11:00 PM',
      duration: '5 hours',
      isDownloadable: true
    },
    {
      id: 'rec-003',
      title: 'Motion Alert - Late Night Activity',
      cameraName: 'Pasture 1 Camera',
      date: 'June 8, 2025',
      startTime: '2:15 AM',
      endTime: '2:45 AM',
      duration: '30 minutes',
      isDownloadable: true
    }
  ],
  messages: [
    {
      id: 'msg-001',
      from: 'Maria Rodriguez - Trainer',
      fromRole: 'trainer',
      subject: 'Training Session Complete',
      content: 'Excellent barrel racing session with Thunder Bay today. The camera footage from the arena will be available in your recordings section by this evening for review.',
      timestamp: '2 hours ago',
      isRead: false
    },
    {
      id: 'msg-002',
      from: 'Security System',
      fromRole: 'system',
      subject: 'Motion Alert - Stall A-1',
      content: 'Motion detected in Thunder Bay\'s stall. Automatic recording saved. Horse activity appears normal - likely movement during sleep cycle.',
      timestamp: 'Yesterday 11:30 PM',
      isRead: true
    },
    {
      id: 'msg-003',
      from: 'Dr. Sarah Mitchell',
      fromRole: 'veterinarian',
      subject: 'Camera Assisted Health Check',
      content: 'Thank you for providing camera access during Thunder Bay\'s remote assessment. His movement patterns and behavior visible on camera confirm excellent recovery progress.',
      timestamp: '2 days ago',
      isRead: true
    }
  ],
  alerts: [
    {
      id: 'alert-001',
      type: 'motion',
      title: 'Motion Detected',
      content: 'Unusual activity detected in Stall A-1',
      timestamp: '1 hour ago',
      cameraId: 'cam-001',
      horseId: 'horse-001',
      severity: 'low'
    }
  ],
  subscription: {
    currentPlan: 'premium',
    availablePlans: [
      {
        id: 'basic',
        name: 'Basic Monitoring',
        price: 49,
        period: 'month',
        features: [
          '2 Camera Feeds',
          '720p HD Quality',
          '7-Day Recording Storage',
          'Motion Alerts',
          'Mobile App Access',
          'Email Support'
        ],
        cameraLimit: 2,
        recordingDays: 7,
        quality: '720p'
      },
      {
        id: 'premium',
        name: 'Premium Live',
        price: 89,
        period: 'month',
        features: [
          '6 Camera Feeds',
          '1080p Full HD Quality',
          '30-Day Recording Storage',
          'Night Vision',
          'Motion Detection & Alerts',
          'Live Audio',
          'Priority Support'
        ],
        cameraLimit: 6,
        recordingDays: 30,
        quality: '1080p',
        isCurrent: true,
        isFeatured: true
      },
      {
        id: 'premium-plus',
        name: 'Premium Plus',
        price: 149,
        period: 'month',
        features: [
          '12 Camera Feeds',
          '4K Ultra HD Quality',
          '90-Day Recording Storage',
          'Advanced Night Vision',
          'AI Motion Analysis',
          'Two-Way Audio',
          'Veterinary Consultation Integration',
          '24/7 Phone Support'
        ],
        cameraLimit: 12,
        recordingDays: 90,
        quality: '4K'
      }
    ]
  }
}; 