// Barn Partnership Program Configuration
// Single source of truth for all partnership-related content and data

import type { BarnPartnershipData, PartnershipTier, PartnerApplication, Partnership, VetPartnership } from '../interfaces/ManagerTypes';

export const partnershipTiers: PartnershipTier[] = [
  {
    name: 'Bronze',
    monthlyFee: 299,
    commissionRate: 0.15,
    features: [
      'Basic listing on platform',
      'Client referral system',
      'Monthly performance reports',
      'Email support'
    ],
    vetEndorsement: false
  },
  {
    name: 'Silver',
    monthlyFee: 599,
    commissionRate: 0.20,
    features: [
      'Enhanced listing with photos',
      'Priority referral placement',
      'Bi-weekly performance reports',
      'Phone and email support',
      'Basic marketing materials'
    ],
    vetEndorsement: true
  },
  {
    name: 'Gold',
    monthlyFee: 999,
    commissionRate: 0.25,
    features: [
      'Premium listing with video tours',
      'Top referral placement',
      'Weekly performance reports',
      'Dedicated account manager',
      'Custom marketing materials',
      'Vet partnership opportunities'
    ],
    vetEndorsement: true
  },
  {
    name: 'Platinum',
    monthlyFee: 1499,
    commissionRate: 0.30,
    features: [
      'Elite listing with virtual tours',
      'Exclusive referral priority',
      'Real-time performance dashboard',
      'White-glove support',
      'Co-branded marketing campaigns',
      'Guaranteed vet partnerships',
      'Revenue optimization consulting'
    ],
    vetEndorsement: true
  }
];

export const partnershipConfig = {
  // 📊 Partnership Overview
  overview: {
    title: 'Barn Partnership Program',
    subtitle: 'Manage and grow your network of barn partners',
    description: 'Comprehensive partnership management with revenue tracking, application processing, and veterinary integration'
  },

  // 📝 Content sections
  sections: {
    dashboard: {
      title: 'Partnership Dashboard',
      subtitle: 'Real-time metrics and performance overview'
    },
    applications: {
      title: 'Partner Applications',
      subtitle: 'Review and manage incoming partnership requests'
    },
    management: {
      title: 'Active Partners',
      subtitle: 'Manage existing partnerships and relationships'
    },
    revenue: {
      title: 'Revenue Analytics',
      subtitle: 'Track commissions, payments, and forecasting'
    },
    veterinary: {
      title: 'Veterinary Partnerships',
      subtitle: 'Manage vet referrals and joint opportunities'
    }
  },

  // 🔘 Action buttons
  buttons: {
    approveApplication: 'Approve Application',
    rejectApplication: 'Reject Application',
    reviewApplication: 'Review Details',
    pausePartnership: 'Pause Partnership',
    terminatePartnership: 'Terminate Partnership',
    processPayment: 'Process Payment',
    sendMessage: 'Send Message',
    viewDetails: 'View Details',
    downloadContract: 'Download Contract',
    generateReport: 'Generate Report'
  },

  // 📈 Metrics labels
  metrics: {
    totalPartners: 'Total Partners',
    activePartners: 'Active Partners',
    monthlyRevenue: 'Monthly Revenue',
    conversionRate: 'Conversion Rate',
    averageCommission: 'Average Commission',
    vetReferrals: 'Vet Referrals',
    jointRevenue: 'Joint Revenue',
    pendingPayments: 'Pending Payments'
  },

  // 💬 Status messages
  messages: {
    applicationApproved: 'Partnership application has been approved successfully.',
    applicationRejected: 'Partnership application has been rejected.',
    paymentProcessed: 'Commission payment has been processed.',
    partnershipPaused: 'Partnership has been temporarily paused.',
    partnershipTerminated: 'Partnership has been terminated.',
    reportGenerated: 'Partnership report has been generated and saved.',
    emailSent: 'Message has been sent to partner successfully.'
  },

  // 🏷️ Status labels
  statusLabels: {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    active: 'Active',
    paused: 'Paused',
    terminated: 'Terminated',
    paid: 'Paid',
    overdue: 'Overdue'
  },

  // 📊 Mock partnership data for demonstration
  mockData: {
    totalPartners: 52,
    activePartners: 48,
    monthlyRevenue: '$125,400',
    conversionRate: '78%',
    jointRevenue: '$89,200',

    pendingApplications: [
      {
        id: 'app-001',
        barnName: 'Sunset Ridge Stables',
        ownerName: 'Sarah Mitchell',
        location: 'Austin, TX',
        submissionDate: '2024-01-15',
        status: 'pending' as const,
        tier: partnershipTiers[1], // Silver
        estimatedRevenue: '$8,500'
      },
      {
        id: 'app-002',
        barnName: 'Mountain View Equestrian',
        ownerName: 'Robert Chen',
        location: 'Denver, CO',
        submissionDate: '2024-01-14',
        status: 'pending' as const,
        tier: partnershipTiers[2], // Gold
        estimatedRevenue: '$12,300'
      },
      {
        id: 'app-003',
        barnName: 'Prairie Wind Farm',
        ownerName: 'Jennifer Adams',
        location: 'Kansas City, MO',
        submissionDate: '2024-01-12',
        status: 'pending' as const,
        tier: partnershipTiers[0], // Bronze
        estimatedRevenue: '$5,200'
      }
    ] as PartnerApplication[],

    activePartnerships: [
      {
        id: 'partner-001',
        barnName: 'Golden Oak Stables',
        ownerName: 'Michael Thompson',
        location: 'Nashville, TN',
        tier: partnershipTiers[3], // Platinum
        startDate: '2023-08-15',
        monthlyRevenue: '$18,500',
        totalRevenue: '$92,500',
        status: 'active' as const,
        commissionRate: 0.30
      },
      {
        id: 'partner-002',
        barnName: 'Riverside Ranch',
        ownerName: 'Amanda Foster',
        location: 'Houston, TX',
        tier: partnershipTiers[2], // Gold
        startDate: '2023-10-01',
        monthlyRevenue: '$14,200',
        totalRevenue: '$56,800',
        status: 'active' as const,
        commissionRate: 0.25
      },
      {
        id: 'partner-003',
        barnName: 'Valley View Stables',
        ownerName: 'David Rodriguez',
        location: 'Phoenix, AZ',
        tier: partnershipTiers[1], // Silver
        startDate: '2023-09-15',
        monthlyRevenue: '$9,800',
        totalRevenue: '$39,200',
        status: 'active' as const,
        commissionRate: 0.20
      }
    ] as Partnership[],

    vetPartners: [
      {
        id: 'vet-001',
        vetName: 'Dr. Lisa Johnson',
        clinicName: 'Equine Health Solutions',
        location: 'Dallas, TX',
        specialties: ['Sports Medicine', 'Surgery', 'Reproduction'],
        referralBonus: 500,
        totalReferrals: 28,
        status: 'active' as const
      },
      {
        id: 'vet-002',
        vetName: 'Dr. James Wilson',
        clinicName: 'Wilson Veterinary Clinic',
        location: 'Atlanta, GA',
        specialties: ['Dentistry', 'Diagnostics', 'Emergency Care'],
        referralBonus: 400,
        totalReferrals: 35,
        status: 'active' as const
      },
      {
        id: 'vet-003',
        vetName: 'Dr. Maria Garcia',
        clinicName: 'Southwest Equine Care',
        location: 'Albuquerque, NM',
        specialties: ['Rehabilitation', 'Alternative Medicine', 'Preventive Care'],
        referralBonus: 350,
        totalReferrals: 19,
        status: 'active' as const
      }
    ] as VetPartnership[]
  },

  // 📈 Partnership growth targets
  targets: {
    quarterlyPartners: 75,
    quarterlyRevenue: 180000,
    conversionGoal: 0.85,
    vetPartnershipGoal: 25
  }
};

export default partnershipConfig; 