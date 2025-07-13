import { brandConfig } from './brandConfig';

export const registrationConfig = {
  // Page content
  page: {
    title: 'Protect Your Horse with AI Technology',
    subtitle: 'Individual horse monitoring with professional-grade artificial intelligence',
    description: 'Give your horse the same level of care that professional trainers provide. Our AI never sleeps, ensuring your horse is monitored 24/7 for health, safety, and wellbeing.',
  },

  // Form sections
  form: {
    personalInfo: {
      title: 'Personal Information',
      fields: {
        firstName: {
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
        },
        lastName: {
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
        },
        email: {
          label: 'Email Address',
          placeholder: 'Enter your business email',
          required: true,
        },
        phone: {
          label: 'Phone Number',
          placeholder: '(555) 123-4567',
          required: true,
        },
      },
    },
    businessInfo: {
      title: 'Business Information',
      fields: {
        ownerName: {
          label: 'Horse Owner/Caretaker Name',
          placeholder: 'Enter your name or stable name',
          required: true,
        },
        ownerType: {
          label: 'I am a',
          placeholder: 'Select your role',
          required: true,
          options: [
            { value: 'horse-owner', label: 'Horse Owner' },
            { value: 'caretaker', label: 'Primary Caretaker' },
            { value: 'trainer', label: 'Personal Trainer' },
            { value: 'family-member', label: 'Family Member' },
            { value: 'other', label: 'Other' },
          ],
        },
        horseCount: {
          label: 'Number of Horses',
          placeholder: 'How many horses do you want to monitor?',
          required: true,
          type: 'number',
          min: 1,
          max: 5,
          note: 'Individual plans support up to 5 horses. For 6+ horses, see our Barn Partnership Program below.',
        },
        location: {
          label: 'Location',
          placeholder: 'City, State/Province, Country',
          required: true,
        },
      },
    },
    planSelection: {
      title: 'Choose Your Plan',
      description: 'Select the monitoring plan that best fits your needs. All plans include our core AI monitoring features.',
    },
    preferences: {
      title: 'Monitoring Preferences',
      fields: {
        primaryConcerns: {
          label: 'Primary Monitoring Concerns',
          type: 'checkbox-group',
          options: [
            { value: 'health-monitoring', label: 'Health & Wellness Monitoring' },
            { value: 'behavior-analysis', label: 'Behavior Analysis' },
            { value: 'training-optimization', label: 'Training Performance Optimization' },
            { value: 'safety-alerts', label: 'Safety & Emergency Alerts' },
            { value: 'feeding-patterns', label: 'Feeding Pattern Analysis' },
            { value: 'breeding-management', label: 'Breeding Management' },
            { value: 'injury-prevention', label: 'Injury Prevention' },
            { value: 'competition-prep', label: 'Competition Preparation' },
          ],
        },
        alertFrequency: {
          label: 'Alert Frequency',
          type: 'radio',
          options: [
            { value: 'immediate', label: 'Immediate (Real-time alerts for critical issues)' },
            { value: 'hourly', label: 'Hourly Summaries (Digest of activities and concerns)' },
            { value: 'daily', label: 'Daily Reports (Comprehensive daily overview)' },
            { value: 'custom', label: 'Custom Schedule (Configure your own timing)' },
          ],
          default: 'immediate',
        },
        cameraSetup: {
          label: 'Camera Setup Assistance',
          type: 'radio',
          options: [
            { value: 'professional', label: 'Professional Installation (We handle everything)' },
            { value: 'guided', label: 'Guided Self-Installation (Step-by-step support)' },
            { value: 'existing', label: 'Use Existing Cameras (Integration support)' },
            { value: 'later', label: 'Decide Later (Start with mobile monitoring)' },
          ],
          default: 'guided',
        },
      },
    },
    security: {
      title: 'Account Security',
      fields: {
        password: {
          label: 'Password',
          placeholder: 'Create a strong password',
          required: true,
          minLength: 8,
          requirements: 'Must be at least 8 characters with numbers and symbols',
        },
        confirmPassword: {
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
          required: true,
        },
      },
    },
    terms: {
      title: 'Terms & Agreements',
      fields: {
        termsAccepted: {
          label: 'I agree to the Terms of Service and Privacy Policy',
          type: 'checkbox',
          required: true,
        },
        marketingConsent: {
          label: 'I would like to receive updates about new features and equestrian insights',
          type: 'checkbox',
          required: false,
        },
        trialConsent: {
          label: 'Start my 14-day free trial (no credit card required)',
          type: 'checkbox',
          required: false,
          default: true,
        },
      },
    },
  },

  // Individual horse owner pricing
  pricing: {
    baseCosts: {
      apiCostLow: 25, // Low-end API cost per horse
      apiCostHigh: 50, // High-end API cost per horse
      markupMultiplier: 2.5, // 150% markup for sustainable business
    },
          plan: {
        id: 'professional-individual',
        name: 'Professional Individual',
        description: 'Complete AI monitoring for individual horse owners',
        maxHorses: 5,
        pricing: {
          oneHorse: {
            monthly: 125,
            yearly: 1200, // $100/month when paid annually
            savings: 300, // $25/month savings
            perHorseMonthly: 125,
            perHorseYearly: 100,
          },
          twoHorses: {
            monthly: 219, // Increased from $199 to $219
            yearly: 2100, // $175/month when paid annually  
            savings: 528, // $44/month savings
            perHorseMonthly: 109.50,
            perHorseYearly: 87.50,
          },
          threeToFiveHorses: {
            monthly: 89, // Per horse for 3-5 horses
            yearly: 79, // Per horse yearly for 3-5 horses
            savings: 120, // Per horse annual savings
            setupFee: 99, // One-time setup fee for 3+ horses
          },
        },
      features: [
        '24/7 AI Health Monitoring',
        'Real-time Emergency Alerts',
        'Colic & Casting Detection',
        'Behavioral Pattern Analysis',
        'Lameness Early Warning',
        'Mobile App & SMS Alerts',
        'Veterinary-Grade AI Analysis',
        'Historical Health Reports',
        'Multi-Camera Support',
        'Priority Customer Support',
        'Data Export & Sharing',
        'Monthly Health Summaries',
      ],
      benefits: [
        'Never miss a health emergency',
        'Prevent costly vet bills',
        'Sleep peacefully knowing AI is watching',
        'Early detection saves lives',
      ],
      popular: true,
      trialDays: 14,
      setupFee: 0,
      moneyBackGuarantee: 30,
    },
  },

  // Barn Partnership Program
  barnPartnership: {
    title: 'Barn Partnership Program',
    subtitle: 'Professional equestrian facilities',
    description: 'Transform your entire operation with enterprise-grade AI monitoring. Partner with us to offer your clients the ultimate in horse care technology.',
    benefits: [
      'Revenue sharing program for barn owners',
      'Professional installation and training',
      'White-label options available',
      'Bulk pricing for multiple horses',
      'Dedicated account management',
      'Marketing support and materials',
    ],
    cta: {
      title: 'Ready to Partner?',
      subtitle: 'Join leading barns already using our technology',
      buttonText: 'Schedule Partnership Call',
      contact: 'partnerships@onebarnai.com',
    },
    qualifications: [
      'Minimum 10 horses in operation',
      'Professional liability insurance',
      'Established customer base',
      'Commitment to horse welfare excellence',
    ],
  },

  // Addon services for individuals
  addons: {
    title: 'Optional Add-on Services',
    services: [
      {
        id: 'camera-installation',
        name: 'Professional Camera Installation',
        description: 'Complete camera setup and configuration by certified technicians',
        price: 199,
        unit: 'per camera',
        popular: true,
      },
      {
        id: 'vet-consultation',
        name: 'Veterinary AI Report Review',
        description: 'Monthly consultation with equine vet to review AI insights',
        price: 89,
        unit: 'per month',
        popular: true,
      },
      {
        id: 'premium-support',
        name: 'Premium Support Package',
        description: '24/7 phone support with guaranteed 1-hour response time',
        price: 49,
        unit: 'per month',
        popular: false,
      },
    ],
  },

  // Promotional offers
  promotions: {
    newCustomer: {
      title: 'New Customer Special',
      description: 'Get 2 months free when you pay annually',
      code: 'NEWBARN2024',
      discountPercent: 17, // Equivalent to 2 months free on annual
      validUntil: '2024-12-31',
      minHorses: 3,
    },
    referral: {
      title: 'Referral Program',
      description: 'Refer another barn and both get 1 month free',
      code: 'REFER-A-BARN',
      discountPercent: 8.33, // 1 month free
    },
  },

  // Trust indicators
  trustIndicators: {
    title: 'Trusted by Equestrian Professionals Worldwide',
    statistics: [
      { label: 'Active Barns', value: '1,200+' },
      { label: 'Horses Monitored', value: '15,000+' },
      { label: 'Countries Served', value: '12' },
      { label: 'AI Insights Generated', value: '2.5M+' },
    ],
    testimonials: [
      {
        name: 'Sarah Mitchell',
        title: 'Head Trainer, Willowbrook Stables',
        quote: 'The AI monitoring caught early signs of colic in one of our performance horses. The vet said early detection saved us thousands in treatment costs.',
        rating: 5,
      },
      {
        name: 'Dr. James Patterson',
        title: 'Equine Veterinarian',
        quote: 'The detailed behavior analysis helps me make more informed decisions. It\'s like having eyes on every horse 24/7.',
        rating: 5,
      },
      {
        name: 'Maria Rodriguez',
        title: 'Barn Owner, Desert Sun Ranch',
        quote: 'Setup was incredibly easy, and the insights have transformed how we manage our breeding program.',
        rating: 5,
      },
    ],
    certifications: [
      'ISO 27001 Certified',
      'GDPR Compliant',
      'SOC 2 Type II',
      'Veterinary Approved',
    ],
  },

  // Call to action
  cta: {
    primary: {
      text: 'Start Your Free Trial',
      subtext: 'No credit card required • Cancel anytime',
    },
    secondary: {
      text: 'Schedule a Demo',
      subtext: 'See the platform in action',
    },
    tertiary: {
      text: 'Contact Sales',
      subtext: 'Custom solutions available',
    },
  },

  // Form validation messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    password: 'Password must be at least 8 characters with numbers and symbols',
    passwordMatch: 'Passwords do not match',
    horseCount: 'Please enter a number between 1 and 500',
    terms: 'You must agree to the Terms of Service to continue',
  },

  // Billing and pricing disclaimers
  billing: {
    disclaimer: {
      title: 'Transparent AI-Powered Pricing',
      content: 'Our pricing reflects the cutting-edge AI technology powering your horse monitoring system. Advanced AI analysis costs are calculated at current market rates ($45-75 per horse monthly for enterprise-grade equine AI), plus our service markup to ensure continuous platform development and 24/7 support. Usage beyond plan limits incurs additional charges at our competitive AI processing rates.',
      legalText: 'Billing occurs monthly in advance. Additional AI processing beyond included limits billed at $0.08 per minute of video analysis. Rates subject to change with 30-day notice. See Terms of Service for complete billing terms.',
      valueProposition: 'Every dollar invested in AI monitoring has prevented an average of $3,200 in emergency veterinary costs for our customers.',
    },
    transparency: {
      costBreakdown: 'Your plan includes comprehensive AI monitoring with industry-leading accuracy. Additional usage ensures you never miss critical health indicators, even during peak monitoring periods.',
      noSurprises: 'All additional charges are clearly itemized on your monthly statement with detailed usage reports.',
    },
  },

  // Success messaging
  success: {
    title: 'Welcome to One Barn AI!',
    subtitle: 'Your account has been created successfully',
    message: 'Check your email for setup instructions and your trial activation link.',
    nextSteps: [
      'Check your email for the welcome message',
      'Download the mobile app',
      'Schedule your camera setup consultation',
      'Invite your team members',
    ],
  },
}; 