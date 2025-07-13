// Registration Form Data Configuration - Single Source of Truth
// ALL user-facing text, labels, messages, and content for the registration workflow

export const registrationFormData = {
  // Landing Page Content
  landing: {
    hero: {
      title: "Start Monitoring Your Horses Today",
      subtitle: "Peace of mind for your most valuable family members",
      description: "Join thousands of horse owners who trust our AI-powered monitoring to keep their horses safe, healthy, and performing at their best."
    },
    valueProposition: {
      headline: "Why Horse Owners Choose One Barn AI",
      benefits: [
        "24/7 AI monitoring detects health issues before they become emergencies",
        "Instant alerts for unusual behavior or potential injuries",
        "Professional insights shared with your vet and trainer team",
        "Complete peace of mind whether you're home or away"
      ]
    },
    social: {
      testimonialHeading: "Trusted by Horse Owners Nationwide",
      testimonials: [
        {
          quote: "One Barn AI caught my mare's colic symptoms 3 hours before I would have noticed. It saved her life.",
          author: "Sarah Mitchell",
          location: "Colorado",
          horses: "3 Quarter Horses"
        },
        {
          quote: "The training insights have improved my horse's performance by 40%. My trainer loves the detailed reports.",
          author: "Jennifer Adams", 
          location: "Kentucky",
          horses: "2 Thoroughbreds"
        },
        {
          quote: "I travel for work constantly. Now I can check on my horses from anywhere and sleep peacefully.",
          author: "Robert Wilson",
          location: "Texas", 
          horses: "5 Ranch Horses"
        }
      ]
    },
    cta: {
      primary: "Start Your Free Assessment",
      secondary: "Referred by your barn or trainer?",
      partnerLink: "Click here for partner pricing"
    },
    guarantee: {
      heading: "100% Satisfaction Guarantee",
      text: "Try One Barn AI risk-free for 30 days. If you're not completely satisfied, we'll refund every penny."
    }
  },

  // Progress Steps
  progress: {
    steps: {
      owner: "Your Profile",
      horses: "Your Horses", 
      facility: "Your Facility",
      plans: "Choose Plan",
      payment: "Complete Setup"
    },
    stepDescriptions: {
      owner: "Tell us about yourself and your horse experience",
      horses: "Add details about each horse you want to monitor",
      facility: "Help us understand your property and setup needs",
      plans: "Select the perfect monitoring plan for your needs",
      payment: "Secure payment and schedule installation"
    }
  },

  // Owner Profile Form
  ownerProfile: {
    heading: "Tell Us About Yourself",
    subtitle: "Help us create the perfect monitoring experience for you and your horses",
    
    fields: {
      personalInfo: {
        heading: "Personal Information",
        firstName: {
          label: "First Name",
          placeholder: "Enter your first name",
          required: "First name is required",
          validation: "Please enter a valid first name"
        },
        lastName: {
          label: "Last Name", 
          placeholder: "Enter your last name",
          required: "Last name is required",
          validation: "Please enter a valid last name"
        },
        email: {
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: "Email address is required",
          validation: "Please enter a valid email address",
          help: "We'll use this for important alerts and updates"
        },
        phone: {
          label: "Phone Number",
          placeholder: "(555) 123-4567",
          required: "Phone number is required",
          validation: "Please enter a valid phone number",
          help: "For emergency alerts and installation coordination"
        }
      },
      
      experience: {
        heading: "Your Horse Experience",
        level: {
          label: "How would you describe your horse experience?",
          options: {
            beginner: {
              title: "New to Horses",
              description: "Less than 2 years of horse experience"
            },
            intermediate: {
              title: "Experienced Owner", 
              description: "2-10 years of horse ownership"
            },
            advanced: {
              title: "Horse Professional",
              description: "10+ years, trainer, or industry professional"
            }
          }
        },
        interests: {
          label: "Primary horse activities (select all that apply)",
          options: {
            trail: "Trail Riding",
            pleasure: "Pleasure Riding", 
            competition: "Competition",
            breeding: "Breeding",
            training: "Training",
            therapy: "Therapy/Therapeutic",
            racing: "Racing",
            ranch: "Ranch Work"
          }
        }
      },

      team: {
        heading: "Your Horse Care Team",
        veterinarian: {
          heading: "Primary Veterinarian",
          name: {
            label: "Veterinarian Name",
            placeholder: "Dr. Sarah Johnson",
            required: "Veterinarian name is required",
            help: "We'll integrate with your vet for health monitoring"
          },
          clinic: {
            label: "Clinic/Practice Name",
            placeholder: "Equine Health Center"
          },
          phone: {
            label: "Clinic Phone",
            placeholder: "(555) 987-6543",
            required: "Vet phone number is required"
          },
          email: {
            label: "Clinic Email (optional)",
            placeholder: "clinic@equinehealth.com"
          }
        },
        trainer: {
          heading: "Primary Trainer (Optional)",
          hasTrainer: {
            label: "Do you work with a professional trainer?"
          },
          name: {
            label: "Trainer Name",
            placeholder: "Maria Rodriguez"
          },
          discipline: {
            label: "Training Discipline",
            placeholder: "Dressage, Western, Jumping, etc."
          },
          phone: {
            label: "Trainer Phone",
            placeholder: "(555) 456-7890"
          }
        }
      },

      emergency: {
        heading: "Emergency Contacts",
        primary: {
          name: {
            label: "Emergency Contact Name",
            placeholder: "Family member or friend",
            required: "Emergency contact is required"
          },
          relationship: {
            label: "Relationship",
            placeholder: "Spouse, Parent, Friend, etc.",
            required: "Relationship is required"
          },
          phone: {
            label: "Phone Number",
            placeholder: "(555) 123-4567",
            required: "Emergency contact phone is required"
          }
        },
        backup: {
          heading: "Backup Contact (Optional but Recommended)",
          name: {
            label: "Backup Contact Name",
            placeholder: "Second emergency contact"
          },
          phone: {
            label: "Phone Number", 
            placeholder: "(555) 987-6543"
          }
        }
      }
    },

    buttons: {
      next: "Continue to Horse Details",
      back: "Back",
      save: "Save Progress"
    }
  },

  // Horse Details Form
  horseDetails: {
    heading: "Tell Us About Your Horses",
    subtitle: "Add each horse you want to monitor. The more details you provide, the better we can customize their care.",
    
    addHorse: {
      button: "Add Another Horse",
      firstHorse: "Add Your First Horse"
    },

    fields: {
      basic: {
        heading: "Basic Information",
        name: {
          label: "Horse Name",
          placeholder: "Thunder, Star, Duke, etc.",
          required: "Horse name is required",
          help: "What do you call this horse?"
        },
        showName: {
          label: "Show/Registered Name (optional)",
          placeholder: "Official registered name"
        },
        age: {
          label: "Age",
          placeholder: "8",
          required: "Age is required",
          validation: "Please enter a valid age (1-40)"
        },
        breed: {
          label: "Breed",
          placeholder: "Quarter Horse, Thoroughbred, etc.",
          required: "Breed is required"
        },
        gender: {
          label: "Gender",
          options: {
            mare: "Mare",
            gelding: "Gelding", 
            stallion: "Stallion",
            filly: "Filly",
            colt: "Colt"
          }
        },
        color: {
          label: "Color",
          placeholder: "Bay, Chestnut, Black, etc.",
          required: "Color is required"
        },
        markings: {
          label: "Distinctive Markings",
          placeholder: "White blaze, sock on left front, etc.",
          help: "Help our AI identify your horse"
        }
      },

      photos: {
        heading: "Photos",
        subtitle: "Add photos to help our AI identify and monitor your horse",
        upload: {
          label: "Upload Horse Photos",
          button: "Add Photos",
          dragText: "Drag photos here or click to browse",
          acceptedTypes: "JPG, PNG, HEIC up to 10MB each",
          maxPhotos: 5,
          help: "Clear photos help our AI accurately identify your horse"
        },
        captions: {
          label: "Photo Caption",
          placeholder: "Front view, side profile, distinctive markings, etc."
        },
        primary: {
          label: "Primary Photo",
          help: "This photo will be used as the main identification image"
        },
        validation: {
          fileSize: "File size must be less than 10MB",
          fileType: "Only JPG, PNG, and HEIC files are accepted",
          maxPhotos: "Maximum 5 photos per horse"
        }
      },

      health: {
        heading: "Health & Medical History",
        conditions: {
          label: "Known Medical Conditions",
          placeholder: "Allergies, arthritis, previous injuries, etc.",
          help: "This helps our AI understand normal vs concerning behavior"
        },
        medications: {
          label: "Current Medications",
          placeholder: "Daily supplements, treatments, etc."
        },
        vetHistory: {
          label: "Recent Veterinary Care",
          placeholder: "Recent treatments, surgeries, or concerns"
        }
      },

      behavior: {
        heading: "Behavior & Personality",
        temperament: {
          label: "Temperament",
          options: {
            calm: "Calm & Steady",
            spirited: "Spirited & Energetic", 
            sensitive: "Sensitive & Alert",
            bold: "Bold & Confident",
            gentle: "Gentle & Quiet"
          }
        },
        habits: {
          label: "Notable Behaviors or Habits",
          placeholder: "Weaving, cribbing, particular routines, etc.",
          help: "Helps distinguish normal behavior from health concerns"
        },
        triggers: {
          label: "Known Stress Triggers",
          placeholder: "Storms, loud noises, separation, etc."
        }
      },

      location: {
        heading: "Current Location",
        facility: {
          label: "Where is this horse kept?",
          home: "At my property",
          boarding: "Boarding facility",
          training: "Training facility"
        },
        stall: {
          label: "Stall/Paddock Identifier",
          placeholder: "Stall #3, North Paddock, etc.",
          help: "Helps us identify the horse in the right location"
        },
        turnout: {
          label: "Turnout Schedule",
          placeholder: "Daily turnout times and location"
        }
      }
    },

    buttons: {
      addHorse: "Add Another Horse",
      removeHorse: "Remove This Horse",
      next: "Continue to Facility Setup",
      back: "Back to Profile",
      save: "Save Progress"
    },

    validation: {
      minHorses: "Please add at least one horse",
      maxHorses: "Maximum 10 horses per registration",
      nameRequired: "Horse name is required",
      ageInvalid: "Please enter a valid age",
      requiredField: "This field is required"
    }
  },

  // Facility Assessment
  facility: {
    heading: "Facility Assessment",
    subtitle: "Help us understand your property so we can design the perfect monitoring system",

    propertyType: {
      heading: "Property Type",
      label: "How would you describe your horse facility?",
      options: {
        home: {
          title: "Private Property",
          description: "I own the property where my horses are kept",
          icon: "🏡"
        },
        boarding: {
          title: "Boarding Facility", 
          description: "My horses board at a commercial facility",
          icon: "🏢"
        },
        training: {
          title: "Training Facility",
          description: "My horses are at a professional training barn",
          icon: "🏆"
        },
        multiple: {
          title: "Multiple Locations",
          description: "My horses are kept at different facilities",
          icon: "📍"
        }
      }
    },

    infrastructure: {
      heading: "Infrastructure Assessment",
      wifi: {
        label: "WiFi Availability",
        strength: {
          label: "WiFi signal strength in horse areas",
          options: {
            excellent: "Excellent - Strong signal everywhere",
            good: "Good - Reliable in most areas", 
            fair: "Fair - Some weak spots",
            poor: "Poor - Limited coverage",
            none: "No WiFi available"
          }
        },
        upgrade: {
          label: "Are you willing to upgrade WiFi if needed?",
          help: "We can recommend solutions for better coverage"
        }
      },
      power: {
        label: "Power Access",
        availability: {
          label: "Electrical outlets near horse areas",
          options: {
            readily: "Readily available",
            some: "Some outlets available",
            limited: "Limited availability", 
            none: "No power in horse areas"
          }
        },
        install: {
          label: "Can new outlets be installed if needed?",
          help: "Our installation team can coordinate with electricians"
        }
      }
    },

    partnership: {
      heading: "Facility Partnership",
      referral: {
        label: "Were you referred by your barn, trainer, or veterinarian?",
        hasReferral: "Yes, I have a referral code",
        code: {
          label: "Referral Code",
          placeholder: "Enter referral code",
          help: "Get 20% off with barn/trainer partnerships"
        },
        referrer: {
          label: "Who referred you?",
          placeholder: "Barn name, trainer name, etc."
        }
      },
      permission: {
        label: "Installation Permission",
        hasPermission: {
          label: "Do you have permission to install monitoring equipment?",
          help: "Required for boarding facilities"
        },
        contact: {
          label: "Facility contact for installation coordination",
          name: {
            placeholder: "Manager or owner name"
          },
          phone: {
            placeholder: "Facility phone number"
          }
        }
      }
    },

    installation: {
      heading: "Installation Setup",
      subtitle: "Choose how you'd like to install your One Barn AI monitoring system",
      
      installationType: {
        label: "Installation Method",
        options: {
          self: {
            title: "Self-Installation",
            subtitle: "Recommended • No additional fees",
            description: "Install your cameras yourself with our step-by-step guide and phone support",
            benefits: [
              "No installation fees",
              "Install at your own pace", 
              "Video tutorials included",
              "Phone support available",
              "Quick start guide provided"
            ],
            icon: "⭐"
          },
          professional: {
            title: "Professional Installation",
            subtitle: "Installation fee applies",
            description: "Our certified technicians handle everything for you",
            benefits: [
              "Expert installation",
              "Optimal camera placement",
              "Complete system testing",
              "On-site training included",
              "1-year installation warranty"
            ],
            fee: "$199",
            icon: "🔧"
          }
        }
      },

      selfInstall: {
        heading: "Self-Installation Resources",
        description: "Everything you need for a successful installation",
        resources: [
          "📖 Comprehensive installation guide",
          "🎥 Step-by-step video tutorials", 
          "📞 Phone support during installation",
          "💬 Live chat assistance",
          "🔧 All mounting hardware included"
        ],
        cameraPlacement: {
          heading: "Optimal Camera Placement",
          description: "Follow our guidelines for best monitoring results"
        }
      },

      professionalInstall: {
        heading: "Professional Installation Details",
        description: "Let our experts handle the technical setup",
        fee: {
          amount: "$199",
          description: "Base installation fee per visit (covers up to 4 cameras + travel + setup)"
        },
        timeline: {
          label: "Preferred installation timeframe",
          options: {
            asap: "As soon as possible",
            week: "Within 1 week", 
            twoWeeks: "Within 2 weeks",
            month: "Within 1 month",
            flexible: "I'm flexible"
          }
        },
        availability: {
          label: "Best days for installation",
          options: {
            weekdays: "Weekdays",
            weekends: "Weekends",
            either: "Either weekdays or weekends"
          }
        },
        time: {
          label: "Preferred time of day",
          options: {
            morning: "Morning (8am-12pm)",
            afternoon: "Afternoon (12pm-5pm)",
            either: "Either morning or afternoon"
          }
        },
        notes: {
          label: "Special installation notes",
          placeholder: "Access instructions, scheduling constraints, property layout details, etc."
        }
      }
    },

    buttons: {
      next: "Continue to Plan Selection",
      back: "Back to Horse Details",
      save: "Save Progress"
    }
  },

  // Plan Selection
  plans: {
    heading: "Choose Your Monitoring Plan",
    subtitle: "Select the perfect plan for your horses. You can always upgrade or modify later.",

    comparison: {
      heading: "Plan Comparison",
      period: {
        monthly: "Monthly",
        annual: "Annual (Save 15%)"
      }
    },

    features: {
      monitoring: "24/7 AI Monitoring",
      alerts: "Smart Alerts",
      storage: "Video Storage",
      analysis: "Behavior Analysis", 
      health: "Health Insights",
      vet: "Vet Integration",
      training: "Training Analytics",
      support: "Priority Support",
      cameras: "Cameras Included",
      installation: "Professional Installation"
    },

    calculator: {
      heading: "Your Plan Summary",
      basePlan: "Base Plan",
      discount: "Partner Discount",
      tax: "Tax",
      total: "Total Monthly",
      annualSavings: "Annual Savings",
      
      perHorse: "per horse/month",
      firstYear: "First Year Total",
      monthlyTotal: "Monthly Total"
    },

    buttons: {
      select: "Select This Plan",
      customize: "Customize Plan",
      next: "Continue to Payment",
      back: "Back to Facility Setup"
    }
  },

  // Plan Selection
  planSelection: {
    heading: "Choose Your HorseWatch Plan",
    subtitle: "Select the perfect monitoring solution for your horses",
    
    sections: {
      softwarePlans: {
        heading: "Software Subscription Plans",
        subtitle: "Choose your monitoring service level",
        billingToggle: {
          monthly: "Monthly",
          annual: "Annual (Save 15%)",
          annualSavings: "Save 15% with annual billing"
        },
        plans: {
          starter: {
            id: "starter",
            name: "Starter",
            displayName: "Starter Plan",
            subtitle: "Perfect for 1-2 horses",
            description: "Great for small horse owners who want reliable monitoring",
            price: {
              monthly: 149,
              yearly: 127
            },
            features: [
              "Motion detection alerts",
              "Basic behavior monitoring", 
              "7-day video storage",
              "Mobile app access",
              "Email alerts",
              "Basic health insights"
            ],
            horses: {
              included: 2
            },
            cameras: {
              included: 2
            },
            maxHorses: 2,
            popular: false,
            recommended: false
          },
          professional: {
            id: "professional",
            name: "Professional",
            displayName: "Professional Plan",
            subtitle: "Most popular for 3-6 horses",
            description: "Most popular choice for serious horse owners",
            price: {
              monthly: 299,
              yearly: 254
            },
            features: [
              "Full AI behavior analysis",
              "Health monitoring & alerts",
              "30-day video storage",
              "Veterinarian integration",
              "SMS + email alerts",
              "Performance insights",
              "Training recommendations",
              "Priority support"
            ],
            horses: {
              included: 6
            },
            cameras: {
              included: 4
            },
            maxHorses: 6,
            popular: true,
            recommended: true
          },
          estate: {
            id: "estate",
            name: "Estate",
            displayName: "Estate Plan",
            subtitle: "Premium solution for 7+ horses",
            description: "Complete solution for large operations",
            price: {
              monthly: 599,
              yearly: 509
            },
            features: [
              "Advanced AI insights",
              "Predictive health analytics",
              "90-day video storage",
              "Custom alert rules",
              "Training analytics",
              "Performance benchmarking",
              "Dedicated account manager",
              "24/7 priority support",
              "Custom integrations"
            ],
            horses: {
              included: 12
            },
            cameras: {
              included: 8
            },
            maxHorses: 12,
            popular: false,
            recommended: false
          }
        }
      },
      
      hardwareSelection: {
        heading: "Camera Equipment",
        subtitle: "Select cameras based on your facility needs",
        comparison: {
          title: "Camera Comparison",
          features: [
            "Video Quality",
            "Night Vision",
            "Field of View",
            "Weather Rating",
            "AI Features",
            "Cloud Storage",
            "Warranty"
          ]
        },
        cameras: {
          basic: {
            id: "basic",
            name: "Basic HD Camera",
            displayName: "Basic HD Camera",
            description: "Reliable monitoring for indoor stalls",
            price: 199,
            originalPrice: 249,
            features: [
              "1080p HD Video",
              "Basic Night Vision",
              "90° Field of View",
              "Indoor Use Only",
              "Motion Detection",
              "2-Year Warranty"
            ],
            specs: {
              resolution: "1080p",
              nightVision: "Basic IR",
              fieldOfView: "90°",
              weatherRating: "Indoor Only",
              aiFeatures: "Motion Detection",
              cloudStorage: "7 days",
              warranty: "2 years"
            },
            recommended: false,
            popular: false
          },
          professional: {
            id: "professional",
            name: "Professional AI Camera",
            displayName: "Professional AI Camera",
            description: "Advanced monitoring with superior night vision",
            price: 349,
            originalPrice: 399,
            features: [
              "4K Ultra HD Video",
              "Advanced Night Vision",
              "160° Wide Field of View",
              "Weatherproof (IP66)",
              "AI-Powered Analytics",
              "30-Day Cloud Storage",
              "3-Year Warranty"
            ],
            specs: {
              resolution: "4K Ultra HD",
              nightVision: "Advanced IR + Color",
              fieldOfView: "160°",
              weatherRating: "IP66 Weatherproof",
              aiFeatures: "Full AI Analytics",
              cloudStorage: "30 days",
              warranty: "3 years"
            },
            recommended: true,
            popular: true
          },
          premium: {
            id: "premium",
            name: "Premium Pro Camera",
            displayName: "Premium Pro Camera",
            description: "Professional-grade monitoring with advanced features",
            price: 549,
            originalPrice: 649,
            features: [
              "6K Professional Video",
              "Color Night Vision",
              "180° Ultra-Wide View",
              "Military-Grade Weatherproof",
              "Advanced AI + Heat Detection",
              "Unlimited Cloud Storage",
              "5-Year Warranty"
            ],
            specs: {
              resolution: "6K Professional",
              nightVision: "Full Color Night Vision",
              fieldOfView: "180°",
              weatherRating: "Military Grade",
              aiFeatures: "Advanced AI + Thermal",
              cloudStorage: "Unlimited",
              warranty: "5 years"
            },
            recommended: false,
            popular: false
          }
        }
      },
      
      powerOptions: {
        heading: "Power Options",
        subtitle: "Choose the best power solution for your setup",
        recommendations: {
          battery: "Best for flexible placement and temporary setups",
          plugin: "Most reliable for permanent installations",
          solar: "Eco-friendly option for sunny locations"
        }
      },
      
      installation: {
        heading: "Installation Service",
        subtitle: "Choose your preferred installation method",
        defaultOption: "diy",
        recommendations: {
          diy: "Recommended for most users - free with full support",
          assisted: "Perfect if you want expert guidance",
          professional: "Complete white-glove service"
        },
        options: {
          diy: {
            id: "diy",
            name: "DIY Installation",
            description: "Self-install with our comprehensive guide and support",
            price: 0,
            features: [
              "Step-by-step video guides",
              "Live chat support during setup",
              "Pre-configured equipment",
              "Mobile app setup assistance",
              "30-day installation guarantee"
            ],
            estimatedTime: "2-4 hours",
            difficulty: "Easy",
            recommended: true,
            popular: true
          },
          assisted: {
            id: "assisted",
            name: "Assisted Installation",
            description: "Virtual guidance from our technical experts",
            price: 99,
            features: [
              "1-on-1 video call support",
              "Real-time troubleshooting",
              "Optimal camera placement guidance",
              "Network configuration help",
              "Follow-up support call"
            ],
            estimatedTime: "1-2 hours",
            difficulty: "Easy",
            recommended: false,
            popular: false
          },
          professional: {
            id: "professional",
            name: "Professional Installation",
            description: "Complete white-glove installation service",
            price: 199,
            features: [
              "Certified technician visit",
              "Professional mounting and setup",
              "Network optimization",
              "Full system testing",
              "Staff training included",
              "1-year service warranty"
            ],
            estimatedTime: "2-3 hours",
            difficulty: "None",
            recommended: false,
            popular: false
          }
        }
      },
      
      bundleOptimization: {
        heading: "Bundle Recommendations",
        subtitle: "Save money with our recommended packages",
        smartRecommendations: {
          title: "Recommended for You",
          subtitle: "Based on your facility assessment"
        }
      },
      
      financing: {
        heading: "Payment Options",
        subtitle: "Choose how you'd like to pay for your equipment",
        options: {
          purchase: {
            title: "Purchase",
            subtitle: "Own immediately",
            recommended: false
          },
          lease: {
            title: "Lease to Own",
            subtitle: "Low monthly payments",
            recommended: true
          },
          financing: {
            title: "0% Financing",
            subtitle: "No interest payments",
            recommended: false
          }
        }
      }
    },
    
    orderSummary: {
      heading: "Order Summary",
      sections: {
        software: "Software Subscription",
        hardware: "Camera Equipment",
        installation: "Installation Service",
        discounts: "Discounts & Savings",
        totals: "Total Costs"
      },
      labels: {
        monthlyRecurring: "Monthly Recurring",
        oneTimePayment: "One-Time Payment",
        annualSavings: "Annual Savings",
        totalFirstYear: "First Year Total"
      }
    },
    
    buttons: {
      selectPlan: "Select This Plan",
      addCamera: "Add Camera",
      removeCamera: "Remove",
      selectBundle: "Choose Bundle",
      applyCode: "Apply Code",
      next: "Continue to Payment",
      back: "Back to Facility Setup",
      save: "Save Progress"
    },
    
    messages: {
      recommendedPlan: "Recommended for you",
      mostPopular: "Most Popular",
      bestValue: "Best Value",
      cameraAdded: "Camera added to your selection",
      bundleApplied: "Bundle discount applied",
      codeApplied: "Referral code applied",
      maxCamerasReached: "Maximum cameras reached for this plan"
    },
    
    referralCodes: {
      heading: "Referral Code",
      subtitle: "Have a referral code? Enter it here for exclusive savings",
      placeholder: "Enter referral code",
      button: "Apply Code",
      validCodes: {
        "BARN15": {
          discount: 15,
          description: "15% off first year"
        },
        "TRAINER20": {
          discount: 20,
          description: "20% off first year"
        },
        "VET25": {
          discount: 25,
          description: "25% off first year"
        }
      }
    }
  },

  // Payment & Confirmation
  payment: {
    heading: "Complete Your Registration",
    subtitle: "Secure payment processing with 30-day money-back guarantee",

    summary: {
      heading: "Order Summary",
      plan: "Selected Plan",
      horses: "Horses to Monitor",
      installation: "Installation Date",
      total: "Total Today",
      nextBilling: "Next Billing Date"
    },

    billing: {
      heading: "Billing Information",
      same: "Same as profile address",
      address: {
        street: {
          label: "Street Address",
          placeholder: "123 Main Street",
          required: "Street address is required"
        },
        city: {
          label: "City",
          placeholder: "Your City",
          required: "City is required"
        },
        state: {
          label: "State",
          placeholder: "State",
          required: "State is required"
        },
        zip: {
          label: "ZIP Code",
          placeholder: "12345",
          required: "ZIP code is required"
        }
      }
    },

    payment: {
      heading: "Payment Method",
      method: {
        card: "Credit/Debit Card",
        bank: "Bank Transfer"
      },
      card: {
        number: {
          label: "Card Number",
          placeholder: "1234 5678 9012 3456"
        },
        expiry: {
          label: "Expiry Date",
          placeholder: "MM/YY"
        },
        cvc: {
          label: "CVC",
          placeholder: "123"
        },
        name: {
          label: "Name on Card",
          placeholder: "Full name as on card"
        }
      }
    },

    terms: {
      agreement: "I agree to the Terms of Service and Privacy Policy",
      guarantee: "30-day money-back guarantee",
      security: "Your payment information is encrypted and secure"
    },

    buttons: {
      complete: "Complete Registration",
      back: "Back to Plan Selection",
      processing: "Processing Payment..."
    }
  },

  // Confirmation Page
  confirmation: {
    heading: "Welcome to One Barn AI!",
    subtitle: "Your registration is complete and your horses are about to be safer than ever.",

    success: {
      title: "Registration Successful",
      orderNumber: "Order Number",
      email: "Confirmation email sent to"
    },

    nextSteps: {
      heading: "What Happens Next",
      steps: [
        {
          title: "Installation Scheduled",
          description: "Our team will contact you within 24 hours to confirm your installation appointment",
          icon: "📅"
        },
        {
          title: "Equipment Preparation",
          description: "Your custom monitoring system is being prepared and will arrive with our technician",
          icon: "📦"
        },
        {
          title: "Professional Installation", 
          description: "Certified technicians will install and configure your system for optimal monitoring",
          icon: "🔧"
        },
        {
          title: "System Activation",
          description: "Your AI monitoring begins immediately after installation and calibration",
          icon: "✅"
        }
      ]
    },

    immediate: {
      heading: "Start Exploring Now",
      dashboard: {
        title: "Access Your Dashboard",
        description: "Explore your new client dashboard and prepare for your horses' profiles",
        button: "Go to Dashboard"
      },
      mobile: {
        title: "Download Mobile App", 
        description: "Get instant alerts and monitor your horses from anywhere",
        button: "Download App"
      },
      support: {
        title: "Get Support",
        description: "Questions? Our horse-loving team is here to help 24/7",
        button: "Contact Support"
      }
    },

    buttons: {
      dashboard: "Go to My Dashboard",
      support: "Contact Support",
      download: "Download Mobile App"
    }
  },

  // Common Messages
  messages: {
    loading: "Loading...",
    saving: "Saving your progress...",
    error: {
      generic: "Something went wrong. Please try again.",
      network: "Network error. Please check your connection.",
      validation: "Please correct the errors below.",
      payment: "Payment processing failed. Please try again."
    },
    success: {
      saved: "Progress saved successfully",
      updated: "Information updated",
      sent: "Information sent successfully"
    }
  },

  // Navigation
  navigation: {
    breadcrumb: {
      home: "Home",
      register: "Registration",
      owner: "Profile",
      horses: "Horses",
      facility: "Facility", 
      plans: "Plans",
      payment: "Payment",
      confirmation: "Complete"
    },
    progress: {
      step: "Step",
      of: "of",
      complete: "Complete"
    }
  }
}; 