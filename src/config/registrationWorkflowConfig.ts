import { brandConfig } from './brandConfig';

// Type definitions for the registration workflow
export interface IPlan {
  id: string;
  name: string;
  displayName: string;
  subtitle: string;
  price: {
    monthly: number;
    annual: number;
    setup: number;
  };
  horses: {
    included: number;
    additional: number;
  };
  cameras: {
    included: number;
    additional: number;
  };
  features: string[];
  storage: string;
  support: string;
  color: string;
  popular: boolean;
}

export interface IAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  icon: string;
}

export interface IWorkflowStep {
  id: string;
  name: string;
  title: string;
  route: string;
  required: boolean;
  estimatedTime: number;
}

// Registration Workflow Configuration - Single Source of Truth
// Plans, pricing, features, and workflow configuration for the new registration system

export const registrationWorkflowConfig = {
  // Plan Definitions
  plans: {
    starter: {
      id: 'starter',
      name: 'Starter',
      displayName: 'Starter Plan',
      subtitle: 'Perfect for 1-2 horses',
      price: {
        monthly: 149,
        annual: 127, // 15% discount
        setup: 299
      },
      horses: {
        included: 2,
        additional: 49
      },
      cameras: {
        included: 2,
        additional: 99
      },
      features: [
        'Motion detection alerts',
        'Basic behavior monitoring', 
        '7-day video storage',
        'Mobile app access',
        'Email alerts',
        'Basic health insights'
      ],
      storage: '7 days',
      support: 'Email support',
      color: brandConfig.colors.pastureSage,
      popular: false
    } as IPlan,
    professional: {
      id: 'professional',
      name: 'Professional',
      displayName: 'Professional Plan',
      subtitle: 'Most popular for 3-6 horses',
      price: {
        monthly: 299,
        annual: 254, // 15% discount
        setup: 499
      },
      horses: {
        included: 6,
        additional: 39
      },
      cameras: {
        included: 4,
        additional: 79
      },
      features: [
        'Full AI behavior analysis',
        'Health monitoring & alerts',
        '30-day video storage',
        'Veterinarian integration',
        'SMS + email alerts',
        'Performance insights',
        'Training recommendations',
        'Priority support'
      ],
      storage: '30 days',
      support: 'Phone + email support',
      color: brandConfig.colors.championGold,
      popular: true
    } as IPlan,
    estate: {
      id: 'estate',
      name: 'Estate',
      displayName: 'Estate Plan',
      subtitle: 'Premium solution for 7+ horses',
      price: {
        monthly: 599,
        annual: 509, // 15% discount
        setup: 999
      },
      horses: {
        included: 12,
        additional: 29
      },
      cameras: {
        included: 8,
        additional: 69
      },
      features: [
        'Advanced AI insights',
        'Predictive health analytics',
        '90-day video storage',
        'Custom alert rules',
        'Training analytics',
        'Performance benchmarking',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom integrations'
      ],
      storage: '90 days',
      support: '24/7 dedicated support',
      color: brandConfig.colors.stableMahogany,
      popular: false
    } as IPlan
  },

  // Add-on Services
  addons: {
    extraCameras: {
      id: 'extra_cameras',
      name: 'Additional Cameras',
      description: 'Extra cameras for comprehensive coverage',
      price: 99,
      unit: 'per camera/month',
      icon: '📹'
    } as IAddon,
    vetIntegration: {
      id: 'vet_integration',
      name: 'Advanced Vet Integration', 
      description: 'Direct alerts and reports to your veterinarian',
      price: 49,
      unit: 'per month',
      icon: '🏥'
    } as IAddon,
    trainingAnalytics: {
      id: 'training_analytics',
      name: 'Training Performance Analytics',
      description: 'Detailed gait and performance analysis',
      price: 79,
      unit: 'per month',
      icon: '📊'
    } as IAddon,
    extendedStorage: {
      id: 'extended_storage',
      name: 'Extended Video Storage',
      description: 'Keep videos for 6 months instead of standard period',
      price: 29,
      unit: 'per month',
      icon: '💾'
    } as IAddon
  },

  // Registration Workflow Steps
  workflow: {
    steps: [
      {
        id: 'owner',
        name: 'owner',
        title: 'Owner Profile',
        route: '/register/owner',
        required: true,
        estimatedTime: 5
      },
      {
        id: 'horses',
        name: 'horses', 
        title: 'Horse Details',
        route: '/register/horses',
        required: true,
        estimatedTime: 10
      },
      {
        id: 'facility',
        name: 'facility',
        title: 'Facility Assessment',
        route: '/register/facility',
        required: true,
        estimatedTime: 8
      },
      {
        id: 'plans',
        name: 'plans',
        title: 'Plan Selection',
        route: '/register/plans',
        required: true,
        estimatedTime: 5
      },
      {
        id: 'payment',
        name: 'payment',
        title: 'Payment & Confirmation',
        route: '/register/payment',
        required: true,
        estimatedTime: 3
      }
    ] as IWorkflowStep[],
    totalSteps: 5,
    estimatedTotal: 31 // minutes
  },

  // Pricing Configuration
  pricing: {
    currency: 'USD',
    symbol: '$',
    annualDiscount: 0.15, // 15% off
    setupFeeWaiver: {
      conditions: ['annual_payment', 'partner_referral'],
      amount: 100 // percentage waiver
    },
    taxRate: 0.08, // 8% default tax rate
    promoCode: {
      maxDiscount: 0.30, // 30% max discount
      validityDays: 30
    }
  },

  // Feature Limits
  limits: {
    horses: {
      starter: 2,
      professional: 6,
      estate: 12,
      absolute: 50 // maximum horses per account
    },
    cameras: {
      starter: 2,
      professional: 4,
      estate: 8,
      absolute: 20 // maximum cameras per account
    },
    storage: {
      starter: 7, // days
      professional: 30,
      estate: 90
    }
  },

  // Payment Configuration
  payment: {
    methods: ['card', 'ach'],
    processors: {
      stripe: {
        enabled: true,
        testMode: true
      }
    },
    billing: {
      cycles: ['monthly', 'annual'],
      gracePeriod: 7, // days
      retryAttempts: 3
    }
  },

  // Installation Configuration
  installation: {
    included: true,
    scheduling: {
      advanceNotice: 7, // days
      timeSlots: [
        { start: '08:00', end: '12:00', label: 'Morning' },
        { start: '13:00', end: '17:00', label: 'Afternoon' }
      ],
      blackoutDates: [], // holidays, etc.
      maxReschedules: 2
    },
    requirements: {
      wifi: true,
      power: true,
      access: true
    }
  },

  // Validation Rules
  validation: {
    horse: {
      nameMinLength: 2,
      nameMaxLength: 50,
      ageMin: 1,
      ageMax: 40,
      requiredFields: ['name', 'age', 'breed', 'color']
    },
    owner: {
      nameMinLength: 2,
      phonePattern: /^\(\d{3}\) \d{3}-\d{4}$/,
      emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    facility: {
      requiredFields: ['propertyType', 'wifiStrength', 'powerAccess']
    }
  },

  // Success Metrics
  conversion: {
    trackingEvents: [
      'registration_started',
      'step_completed',
      'plan_selected', 
      'payment_initiated',
      'registration_completed'
    ],
    goals: {
      stepCompletionRate: 0.85, // 85%
      overallConversionRate: 0.65 // 65%
    }
  }
};

// Helper Functions
export const getPlanByHorseCount = (horseCount: number): IPlan => {
  if (horseCount <= 2) return registrationWorkflowConfig.plans.starter;
  if (horseCount <= 6) return registrationWorkflowConfig.plans.professional;
  return registrationWorkflowConfig.plans.estate;
};

export const calculatePlanPrice = (planId: keyof typeof registrationWorkflowConfig.plans, horseCount: number, isAnnual: boolean = false): number => {
  const plan = registrationWorkflowConfig.plans[planId];
  if (!plan) return 0;

  let basePrice = isAnnual ? plan.price.annual : plan.price.monthly;
  
  // Add cost for additional horses
  if (horseCount > plan.horses.included) {
    const additionalHorses = horseCount - plan.horses.included;
    basePrice += additionalHorses * plan.horses.additional;
  }

  return basePrice;
};

export const getRecommendedPlan = (horseCount: number): string => {
  if (horseCount <= 2) return 'starter';
  if (horseCount <= 6) return 'professional';
  return 'estate';
};

export const validateStep = (stepId: string, data: any): { valid: boolean; errors: string[] } => {
  const rules = registrationWorkflowConfig.validation;
  
  switch (stepId) {
    case 'owner':
      return validateOwnerData(data, rules.owner);
    case 'horses':
      return validateHorseData(data, rules.horse);
    case 'facility':
      return validateFacilityData(data, rules.facility);
    default:
      return { valid: true, errors: [] };
  }
};

const validateOwnerData = (data: any, rules: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.firstName || data.firstName.length < rules.nameMinLength) {
    errors.push('First name is required');
  }
  
  if (!data.email || !rules.emailPattern.test(data.email)) {
    errors.push('Valid email address is required');
  }
  
  return { valid: errors.length === 0, errors };
};

const validateHorseData = (data: any, rules: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.horses || data.horses.length === 0) {
    errors.push('At least one horse is required');
  }
  
  data.horses?.forEach((horse: any, index: number) => {
    rules.requiredFields.forEach((field: string) => {
      if (!horse[field]) {
        errors.push(`${field} is required for horse ${index + 1}`);
      }
    });
  });
  
  return { valid: errors.length === 0, errors };
};

const validateFacilityData = (data: any, rules: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  rules.requiredFields.forEach((field: string) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}; 