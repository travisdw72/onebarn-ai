// Manager Dashboard TypeScript Interfaces
// Defines all types for the modernized manager dashboard components

export interface IManagerDashboardModernProps {
  facilityId?: string; // Optional override for multi-facility managers
}

export interface IManagerDashboardHeaderProps {
  userName: string;
  facilityName: string;
  onEmergencyAlert: () => void;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  totalRevenue: string;
  occupancyRate: string;
}

export interface IManagerQuickStatsGridProps {
  statistics: ManagerStatistic[];
  onStatClick: (statKey: string) => void;
}

export interface ManagerStatistic {
  id: string;
  key: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ManagementModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface PerformanceMetric {
  key: string;
  value: string;
  target: string;
  status: 'good' | 'warning' | 'critical';
}

export type TabId = 'overview' | 'operations' | 'partnerships' | 'analytics' | 'reports' | 'demo';

export interface IManagerTabNavigationProps {
  selectedTab: TabId;
  onTabChange: (tab: TabId) => void;
  availableTabs: TabId[];
}

export interface IManagerDashboardContentProps {
  selectedTab: TabId;
  statistics: ManagerStatistic[];
  modules: ManagementModule[];
  performanceMetrics: PerformanceMetric[];
  partnershipData: BarnPartnershipData;
}

// Barn Partnership Program Types
export interface BarnPartnershipData {
  totalPartners: number;
  activePartners: number;
  monthlyRevenue: string;
  conversionRate: string;
  pendingApplications: PartnerApplication[];
  activePartnerships: Partnership[];
  revenueSharing: RevenueShare[];
  vetPartners: VetPartnership[];
  vetReferrals: VetReferral[];
  jointRevenue: string;
}

export interface PartnerApplication {
  id: string;
  barnName: string;
  ownerName: string;
  location: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  tier: PartnershipTier;
  estimatedRevenue: string;
}

export interface Partnership {
  id: string;
  barnName: string;
  ownerName: string;
  location: string;
  tier: PartnershipTier;
  startDate: string;
  monthlyRevenue: string;
  totalRevenue: string;
  status: 'active' | 'paused' | 'terminated';
  commissionRate: number;
}

export interface RevenueShare {
  partnerId: string;
  month: string;
  grossRevenue: string;
  commission: string;
  netRevenue: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface VetPartnership {
  id: string;
  vetName: string;
  clinicName: string;
  location: string;
  specialties: string[];
  referralBonus: number;
  totalReferrals: number;
  status: 'active' | 'inactive';
}

export interface VetReferral {
  id: string;
  vetId: string;
  barnPartnerId: string;
  clientName: string;
  serviceType: string;
  referralDate: string;
  revenue: string;
  bonusPaid: boolean;
}

export interface PartnershipTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  monthlyFee: number;
  commissionRate: number;
  features: string[];
  vetEndorsement: boolean;
}

// Content Component Interfaces
export interface IManagerOverviewContentProps {
  statistics: ManagerStatistic[];
  recentActivity: RecentActivity[];
  upcomingTasks: UpcomingTask[];
}

export interface IManagerOperationsContentProps {
  modules: ManagementModule[];
  dailyTasks: UpcomingTask[];
  staffOverview: StaffOverview[];
}

export interface IManagerPartnershipsContentProps {
  partnershipData: BarnPartnershipData;
  onPartnerAction: (action: string, partnerId: string) => void;
}

export interface IManagerAnalyticsContentProps {
  performanceMetrics: PerformanceMetric[];
  trendData: TrendData[];
}

export interface IManagerReportsContentProps {
  availableReports: ReportTemplate[];
  onGenerateReport: (reportId: string) => void;
}

export interface IManagerDemoContentProps {
  facilityName: string;
  demoMode: boolean;
}

// Supporting Types
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

export interface StaffOverview {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  tasksToday: number;
  completedTasks: number;
}

export interface TrendData {
  period: string;
  revenue: number;
  occupancy: number;
  partnerships: number;
  clientSatisfaction: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'partnership' | 'compliance';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastGenerated?: string;
} 