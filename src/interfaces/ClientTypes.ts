export interface IClientHorse {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'gelding' | 'mare' | 'stallion';
  stallLocation: string;
  cameraId?: string;
  photo?: string;
  status: 'active' | 'training' | 'recovery' | 'retired';
  lastActivity: string;
}

export interface ICameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  quality: '720p' | '1080p' | '4K';
  features: string[];
  isLive: boolean;
  isPremium: boolean;
  horseId?: string;
  preview?: string;
}

export interface IRecording {
  id: string;
  title: string;
  cameraName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  fileSize?: string;
  thumbnail?: string;
  isDownloadable: boolean;
}

export interface IClientMessage {
  id: string;
  from: string;
  fromRole: 'trainer' | 'veterinarian' | 'admin' | 'system';
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isUrgent?: boolean;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  cameraLimit: number;
  recordingDays: number;
  quality: string;
  isCurrent?: boolean;
  isFeatured?: boolean;
}

export interface IClientAlert {
  id: string;
  type: 'motion' | 'security' | 'system' | 'health';
  title: string;
  content: string;
  timestamp: string;
  cameraId?: string;
  horseId?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IClientDashboardData {
  horses: IClientHorse[];
  cameras: ICameraFeed[];
  recordings: IRecording[];
  messages: IClientMessage[];
  alerts: IClientAlert[];
  subscription: {
    currentPlan: string;
    availablePlans: ISubscriptionPlan[];
  };
  demoCamera?: {
    interface: {
      title: string;
      subtitle: string;
      description: string;
      setupWizard: any;
      controls: any;
      status: any;
      errors: any;
    };
    settings: any;
    troubleshooting: any;
  };
}

export interface IClientUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscriptionTier: 'basic' | 'premium' | 'premium-plus';
  memberSince: string;
}

export interface IMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

// Component Props Interfaces
export interface IHorsePortfolioProps {
  horses: IClientHorse[];
  onHorseSelect?: (horseId: string) => void;
  onWatchLive?: (cameraId: string) => void;
}

export interface ICameraViewerProps {
  cameras: ICameraFeed[];
  activeCameraId: string;
  onCameraChange: (cameraId: string) => void;
  onControlAction?: (action: string) => void;
  userSubscription: string;
}

export interface IRecordingListProps {
  recordings: IRecording[];
  onPlay?: (recordingId: string) => void;
  onDownload?: (recordingId: string) => void;
  onShare?: (recordingId: string) => void;
}

export interface IMessageCenterProps {
  messages: IClientMessage[];
  onMessageRead?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
}

export interface ISubscriptionPanelProps {
  currentPlan: string;
  availablePlans: ISubscriptionPlan[];
  onPlanSelect?: (planId: string) => void;
} 