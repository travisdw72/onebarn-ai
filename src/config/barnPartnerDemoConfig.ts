import { brandConfig } from './brandConfig';

export const barnPartnerDemoConfig = {
  // Demo barn information
  demoBarn: {
    name: 'Willowbrook Equestrian Center',
    location: 'Wellington, Florida',
    type: 'Training & Boarding Facility',
    established: 2018,
    website: 'willowbrookequestrian.com',
    specialties: ['Dressage', 'Show Jumping', 'Hunter/Jumper'],
    ownerName: 'Sarah Mitchell',
    ownerTitle: 'Head Trainer & Facility Owner',
  },

  // Partnership timeline
  partnership: {
    startDate: 'March 2024',
    trialPeriod: '30 days',
    fullImplementation: 'April 2024',
    currentStatus: '8 months active',
    renewalDate: 'March 2025',
  },

  // Facility stats
  facility: {
    totalHorses: 24,
    boardingClients: 18,
    trainingClients: 12,
    activeUsers: 32, // Owners, trainers, staff
    monthlyBoardingRate: 1850, // Average boarding rate
    premiumServiceUpcharge: 75, // AI monitoring upcharge
  },

  // Financial transparency - Monthly numbers
  financials: {
    monthly: {
      // Revenue breakdown
      totalRevenueGenerated: 1800, // 24 horses × $75/horse
      oneBarnAIShare: 1080, // 24 horses × $45/horse (60%)
      barnPartnerShare: 720, // 24 horses × $30/horse (40%)
      
      // Cost breakdown for One Barn AI
      oneBarnAICosts: {
        apiProcessing: 600, // 24 horses × $25/horse average API cost
        platformOperations: 150, // Infrastructure, support, etc.
        salesAndMarketing: 100, // Customer acquisition costs
        total: 850,
      },
      
      // Net profits
      oneBarnAINetProfit: 230, // $1080 - $850
      barnNetProfit: 720, // Pure profit to barn (no additional costs)
      
      // ROI calculations
      barnROIPercentage: 38.9, // $720 profit on $1850 base boarding
      clientSavingsVsIndividual: 336, // 24 × ($89 individual - $75 charged) = $336/month savings
    },
    
    // Annual projections
    annual: {
      totalRevenueGenerated: 21600, // Monthly × 12
      oneBarnAIShare: 12960,
      barnPartnerShare: 8640,
      
      oneBarnAINetProfit: 2760,
      barnNetProfit: 8640,
      
      clientTotalSavings: 4032, // Monthly savings × 12
    },
  },

  // Performance metrics
  metrics: {
    healthIncidents: {
      before: 12, // Monthly average before AI
      after: 3, // Monthly average with AI
      reductionPercentage: 75,
      avgVetCostPrevented: 2400, // Per incident
      monthlyCostSavings: 21600, // 9 incidents × $2400
    },
    
    customerSatisfaction: {
      npsScore: 94, // Net Promoter Score
      retentionRate: 96, // Client retention
      referralIncrease: 40, // Increase in referrals
      waitingList: 8, // People waiting for stalls
    },
    
    operationalEfficiency: {
      staffTimeReduction: 25, // Percentage reduction in manual monitoring
      emergencyResponseTime: 18, // Minutes (down from 45 minutes)
      falseAlarms: 5, // Per month (down from 23)
      insuranceDiscount: 12, // Percentage discount from insurance company
    },
  },

  // Client testimonials and case studies
  testimonials: [
    {
      clientName: 'Jennifer Rodriguez',
      horseName: 'Midnight Star',
      discipline: 'Dressage',
      quote: 'The AI caught early signs of colic at 2 AM when I was sleeping. The emergency alert saved my horse\'s life and saved me $8,000 in surgery costs.',
      incidentDate: 'July 2024',
      vetCostSaved: 8000,
    },
    {
      clientName: 'Michael Thompson',
      horseName: 'Thunder Bay',
      discipline: 'Show Jumping',
      quote: 'I love getting the daily reports on Thunder\'s activity levels. It helped us adjust his training program and he\'s performing better than ever.',
      incidentDate: 'September 2024',
      performanceImprovement: '15% jump success rate increase',
    },
    {
      clientName: 'Dr. Patricia Williams',
      horseName: 'Golden Promise',
      discipline: 'Hunter',
      quote: 'As a veterinarian myself, I\'m impressed by the accuracy of the behavioral analysis. It\'s like having a 24/7 equine behaviorist.',
      incidentDate: 'October 2024',
      credibility: 'Equine Veterinarian',
    },
  ],

  // Revenue growth story
  revenueGrowth: {
    prePartnership: {
      monthlyRevenue: 44400, // 24 × $1850 boarding
      profitMargin: 22, // Typical boarding profit margin
      netProfit: 9768,
    },
    postPartnership: {
      monthlyRevenue: 46200, // Base + AI upcharge
      profitMargin: 24.6, // Improved margin with AI revenue
      netProfit: 11373, // Including $720 AI revenue
      additionalProfit: 1605, // Increase from AI partnership
    },
    
    yearOneProjection: {
      additionalAnnualRevenue: 8640, // AI revenue share
      clientRetentionValue: 15000, // Value of retained clients due to AI
      newClientPremium: 5200, // Premium pricing ability
      totalAdditionalValue: 28840,
    },
  },

  // Implementation case study
  implementation: {
    phase1: {
      title: 'Trial Phase (30 days)',
      duration: '30 days',
      activities: [
        'Install 8 cameras in high-priority stalls',
        'Train 3 staff members on system',
        'Monitor 6 highest-risk horses',
        'Establish emergency response protocols',
      ],
      results: [
        'Detected 2 early health issues',
        '100% staff adoption rate',
        'Zero false emergency calls',
        'Client excitement and positive feedback',
      ],
    },
    
    phase2: {
      title: 'Full Rollout (60 days)',
      duration: '60 days',
      activities: [
        'Install remaining 16 cameras',
        'Onboard all 18 boarding clients',
        'Integrate with existing barn management software',
        'Launch client mobile app access',
      ],
      results: [
        '96% client participation rate',
        '40% increase in facility tour requests',
        'First month: 2 serious incidents prevented',
        '$4,800 in documented vet cost savings',
      ],
    },
    
    phase3: {
      title: 'Optimization & Growth (Ongoing)',
      duration: 'Ongoing',
      activities: [
        'Refine AI algorithms based on barn data',
        'Expand to training arena monitoring',
        'Launch family plan for multiple horses',
        'Develop barn-specific insights dashboard',
      ],
      results: [
        '8-person waiting list for stalls',
        '25% increase in training client inquiries',
        'Featured in local equestrian magazine',
        'Insurance company offers 12% discount',
      ],
    },
  },

  // Competitive advantages
  competitiveAdvantages: [
    {
      title: 'Revenue Diversification',
      description: 'AI monitoring creates new recurring revenue stream beyond traditional boarding',
      impact: '$8,640 annual recurring revenue',
    },
    {
      title: 'Premium Positioning',
      description: 'Positions barn as technology leader, justifying higher boarding rates',
      impact: '15% premium pricing capability',
    },
    {
      title: 'Client Retention',
      description: 'Dramatic improvement in horse health outcomes increases client loyalty',
      impact: '96% retention rate (industry avg: 78%)',
    },
    {
      title: 'Risk Mitigation',
      description: 'Reduced liability exposure through early health issue detection',
      impact: '12% insurance premium reduction',
    },
    {
      title: 'Operational Efficiency',
      description: 'Automated monitoring reduces staff workload and increases capacity',
      impact: '25% reduction in manual checks',
    },
  ],

  // Partnership benefits breakdown
  partnershipBenefits: {
    forBarn: [
      'Guaranteed 40% revenue share on all AI subscriptions',
      'No upfront costs or equipment investment',
      'Complete installation and technical support',
      'Ongoing training and customer service',
      'Marketing materials and client education',
      'Insurance and liability coverage',
      'Performance guarantees and SLA',
    ],
    
    forOneBarnAI: [
      'Immediate access to 20+ horse market',
      'Reduced customer acquisition costs',
      'Stable, recurring revenue base',
      'Real-world AI training data',
      'Established distribution channel',
      'Professional credibility and testimonials',
      'Market intelligence and feedback',
    ],
  },

  // ROI Calculator
  roiCalculator: {
    title: 'Partnership ROI Calculator',
    inputs: {
      numberOfHorses: 24,
      averageBoardingRate: 1850,
      aiServiceCharge: 75,
      revenueSharePercentage: 40,
    },
    outputs: {
      monthlyAIRevenue: 720,
      annualAIRevenue: 8640,
      fiveYearAIRevenue: 43200,
      clientRetentionValue: 75000, // 5-year value of improved retention
      totalFiveYearValue: 118200,
    },
  },

  // Next steps for interested barns
  nextSteps: {
    title: 'Ready to Partner with One Barn AI?',
    subtitle: 'Join Willowbrook and other leading facilities',
    steps: [
      {
        step: 1,
        title: 'Schedule Discovery Call',
        description: 'Discuss your facility needs and customize partnership terms',
        duration: '30 minutes',
      },
      {
        step: 2,
        title: 'Facility Assessment',
        description: 'Our team visits to plan camera placement and integration',
        duration: '1-2 days',
      },
      {
        step: 3,
        title: 'Pilot Program',
        description: 'Start with 5-10 horses to prove value and ROI',
        duration: '30 days',
      },
      {
        step: 4,
        title: 'Full Implementation',
        description: 'Scale to full facility based on pilot results',
        duration: '60 days',
      },
    ],
  },

  // Contact information
  contact: {
    title: 'Start Your Partnership Today',
    subtitle: 'Join the future of equestrian facility management',
    email: 'partnerships@onebarnai.com',
    phone: '(555) 123-BARN',
    calendlyLink: 'https://calendly.com/onebarnai/partnership-discovery',
  },
}; 