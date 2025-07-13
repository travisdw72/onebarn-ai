import { brandConfig } from './brandConfig';

// Hardware Configuration for One Barn AI
export const hardwareConfig = {
  cameras: {
    essential: {
      id: 'essential',
      name: 'Essential Camera',
      displayName: 'Essential HorseWatch',
      subtitle: 'Perfect for basic monitoring',
      description: 'High-quality monitoring with all essential features for horse safety and health tracking.',
      features: [
        '1080p HD video recording',
        'Night vision capability',
        'Motion detection alerts',
        'Weather-resistant housing',
        'Basic AI behavior analysis',
        'Mobile app integration',
        '7-day cloud storage',
        'Email notifications'
      ],
      pricing: {
        purchase: {
          basePrice: 179,
          discountPrice: 149,
          savings: 30
        },
        lease: {
          monthly: 25,
          term: 24,
          totalCost: 600
        }
      },
      color: brandConfig.colors.pastureSage,
      popular: false
    },
    pro: {
      id: 'pro',
      name: 'Pro Camera',
      displayName: 'Pro HorseWatch',
      subtitle: 'Advanced monitoring for serious horse owners',
      description: 'Professional-grade monitoring with advanced AI analytics and premium features for complete horse management.',
      features: [
        '4K Ultra HD video recording',
        'Advanced night vision',
        'Smart motion tracking',
        'Weatherproof construction',
        'Advanced AI behavior analysis',
        'Health monitoring alerts',
        '30-day cloud storage',
        'SMS + email notifications',
        'Veterinary integration',
        'Training analytics'
      ],
      pricing: {
        purchase: {
          basePrice: 349,
          discountPrice: 279,
          savings: 70
        },
        lease: {
          monthly: 39,
          term: 24,
          totalCost: 936
        }
      },
      color: brandConfig.colors.championGold,
      popular: true
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise Camera',
      displayName: 'Enterprise HorseWatch',
      subtitle: 'Maximum performance for professional facilities',
      description: 'Commercial-grade monitoring system with enterprise features for training facilities and large operations.',
      features: [
        '4K Ultra HD + AI processing',
        'Professional night vision',
        'AI-powered tracking',
        'Military-grade weatherproofing',
        'Enterprise AI analytics',
        'Predictive health monitoring',
        '90-day cloud storage',
        'Multi-channel alerts',
        'Professional integrations',
        'Custom analytics dashboard',
        'API access',
        'White-label options'
      ],
      pricing: {
        purchase: {
          basePrice: 599,
          discountPrice: 499,
          savings: 100
        },
        lease: {
          monthly: 69,
          term: 24,
          totalCost: 1656
        }
      },
      color: brandConfig.colors.stableMahogany,
      popular: false
    }
  },

  powerTypes: {
    battery: {
      id: 'battery',
      name: 'Battery Powered',
      displayName: 'Battery Power',
      icon: '🔋',
      description: 'Completely wireless with rechargeable battery',
      benefits: [
        'No wiring required',
        'Easy installation',
        'Flexible placement',
        'Weather independent'
      ],
      pricing: {
        additionalCost: 0
      }
    },
    plugin: {
      id: 'plugin',
      name: 'Plug-In Power',
      displayName: 'AC Power',
      icon: '🔌',
      description: 'Reliable AC power connection',
      benefits: [
        'Continuous power',
        'No battery maintenance',
        'Highest reliability',
        'Best for permanent setups'
      ],
      pricing: {
        additionalCost: 0
      }
    },
    solar: {
      id: 'solar',
      name: 'Solar Powered',
      displayName: 'Solar Power',
      icon: '☀️',
      description: 'Eco-friendly solar charging system',
      benefits: [
        'Environmentally friendly',
        'No electricity costs',
        'Battery backup included',
        'Works in remote areas'
      ],
      pricing: {
        additionalCost: 50
      }
    }
  },

  installationServices: {
    diy: {
      id: 'diy',
      name: 'DIY Installation',
      displayName: 'Do It Yourself',
      subtitle: 'Free installation with complete support',
      description: 'Install your cameras yourself with our comprehensive guides and support.',
      price: 0,
      features: [
        'Complete installation guide',
        'Video tutorials',
        'Phone support during installation',
        'Live chat assistance',
        'All mounting hardware included'
      ],
      timeRequired: '30-90 minutes per camera',
      popular: true
    },
    assisted: {
      id: 'assisted',
      name: 'Assisted Installation',
      displayName: 'Assisted Setup',
      subtitle: 'Local partner helps with installation',
      description: 'Local certified partner provides hands-on installation assistance.',
      price: 75,
      features: [
        'Local certified partner',
        'Hands-on installation help',
        'System configuration',
        'Basic training included'
      ],
      timeRequired: '1-3 hours total'
    },
    professional: {
      id: 'professional',
      name: 'Professional Installation',
      displayName: 'Professional Service',
      subtitle: 'Complete white-glove installation',
      description: 'Certified technicians handle complete installation and setup.',
      price: 150,
      features: [
        'Certified technician',
        'Complete installation',
        'System optimization',
        'Comprehensive training',
        'One-year installation warranty'
      ],
      timeRequired: '2-6 hours total'
    }
  },

  bundles: {
    starter: {
      id: 'starter',
      name: 'Starter Package',
      displayName: 'Starter Bundle',
      subtitle: 'Perfect for 1-2 horses',
      description: 'Everything you need to start monitoring your horses.',
      cameras: {
        type: 'essential',
        quantity: 2,
        discount: 0.10
      },
      pricing: {
        originalPrice: 358,
        bundlePrice: 299,
        savings: 59
      }
    },
    complete: {
      id: 'complete',
      name: 'Complete Package',
      displayName: 'Complete Bundle',
      subtitle: 'Most popular for 3-6 horses',
      description: 'Complete monitoring solution for serious horse owners.',
      cameras: {
        type: 'pro',
        quantity: 4,
        discount: 0.15
      },
      pricing: {
        originalPrice: 1546,
        bundlePrice: 1299,
        savings: 247
      },
      popular: true
    },
    commercial: {
      id: 'commercial',
      name: 'Commercial Package',
      displayName: 'Commercial Bundle',
      subtitle: 'For training facilities and large operations',
      description: 'Enterprise-grade monitoring for professional facilities.',
      cameras: {
        type: 'enterprise',
        quantity: 8,
        discount: 0.20
      },
      pricing: {
        originalPrice: 5392,
        bundlePrice: 4299,
        savings: 1093
      }
    }
  },

  // Financing Options
  financing: {
    purchase: {
      id: 'purchase',
      name: 'Purchase',
      displayName: 'Buy Outright',
      description: 'Own your equipment immediately',
      benefits: [
        'Own equipment immediately',
        'No monthly payments',
        'Full warranty included',
        'Best long-term value'
      ],
      considerations: [
        'Higher upfront cost',
        'Responsible for upgrades'
      ]
    },
    lease: {
      id: 'lease',
      name: 'Lease',
      displayName: 'Lease to Own',
      description: 'Low monthly payments with ownership option',
      benefits: [
        'Low monthly payments',
        'Flexible terms',
        'Tax advantages for business',
        'Upgrade options available',
        'No large upfront cost'
      ],
      considerations: [
        'Higher total cost',
        'Ongoing monthly commitment'
      ],
      terms: {
        duration: 24, // months
        interestRate: 0, // 0% financing
        buyoutOption: true,
        earlyPayoffDiscount: 0.05 // 5% discount for early payoff
      }
    },
    zeroPercent: {
      id: 'zeroPercent',
      name: '0% Financing',
      displayName: '0% APR Financing',
      description: 'No interest financing available',
      benefits: [
        'No interest charges',
        'Flexible payment terms',
        'Same as cash pricing',
        'Budget-friendly option'
      ],
      terms: {
        duration: [12, 18, 24], // months options
        interestRate: 0,
        minimumPurchase: 500,
        creditCheck: true
      }
    }
  },

  // Recommendations Engine
  recommendations: {
    // Based on facility type from Step 3
    facilityType: {
      home: {
        recommendedCamera: 'essential',
        recommendedPower: 'battery',
        recommendedInstallation: 'diy',
        recommendedBundle: 'starter'
      },
      boarding: {
        recommendedCamera: 'pro',
        recommendedPower: 'plugin',
        recommendedInstallation: 'assisted',
        recommendedBundle: 'complete'
      },
      training: {
        recommendedCamera: 'enterprise',
        recommendedPower: 'plugin',
        recommendedInstallation: 'professional',
        recommendedBundle: 'commercial'
      },
      multiple: {
        recommendedCamera: 'pro',
        recommendedPower: 'solar',
        recommendedInstallation: 'professional',
        recommendedBundle: 'complete'
      }
    },

    // Based on horse count
    horseCount: {
      1: { minCameras: 1, maxCameras: 2, recommendedBundle: 'starter' },
      2: { minCameras: 2, maxCameras: 3, recommendedBundle: 'starter' },
      3: { minCameras: 3, maxCameras: 4, recommendedBundle: 'complete' },
      4: { minCameras: 4, maxCameras: 5, recommendedBundle: 'complete' },
      5: { minCameras: 5, maxCameras: 6, recommendedBundle: 'complete' },
      6: { minCameras: 6, maxCameras: 8, recommendedBundle: 'commercial' }
    },

    // Based on WiFi strength from Step 3
    wifiStrength: {
      excellent: { recommendedCamera: 'enterprise', powerConstraint: false },
      good: { recommendedCamera: 'pro', powerConstraint: false },
      fair: { recommendedCamera: 'essential', powerConstraint: true },
      poor: { recommendedCamera: 'essential', powerConstraint: true },
      none: { recommendedCamera: 'essential', powerConstraint: true }
    }
  }
};

export default hardwareConfig; 