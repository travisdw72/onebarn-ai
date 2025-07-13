// Package Contents Configuration
// Detailed breakdown of what's included with each One Barn AI plan

export interface IPackageItem {
  id: string;
  name: string;
  description: string;
  quantity?: number;
  value?: string;
  icon?: string;
  isHighlight?: boolean;
}

export interface IPackageSection {
  id: string;
  title: string;
  icon: string;
  items: IPackageItem[];
  totalValue?: string;
}

export interface IPlanPackageContents {
  planId: string;
  planName: string;
  totalRetailValue: string;
  yourPrice: string;
  savings: string;
  sections: IPackageSection[];
}

export const packageContentsConfig: Record<string, IPlanPackageContents> = {
  starter: {
    planId: 'starter',
    planName: 'Starter Plan',
    totalRetailValue: '$549',
    yourPrice: '$149',
    savings: '$400',
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Package',
        icon: '📦',
        totalValue: '$897',
        items: [
          {
            id: 'indoor_camera',
            name: 'Indoor AI Camera',
            description: 'Weather-resistant HD camera with night vision',
            quantity: 1,
            value: '$299',
            icon: '📷',
            isHighlight: true
          },
          {
            id: 'mounting_kit',
            name: 'Professional Mounting Kit',
            description: 'Wall and ceiling mounts with all hardware',
            quantity: 1,
            value: '$79',
            icon: '🔧'
          },
          {
            id: 'power_adapter',
            name: 'Power Adapter & Cables',
            description: '25ft weather-resistant power cable',
            quantity: 1,
            value: '$49',
            icon: '⚡'
          },
          {
            id: 'hub_device',
            name: 'One Barn Hub',
            description: 'Local processing unit with AI capabilities',
            quantity: 1,
            value: '$399',
            icon: '🖥️',
            isHighlight: true
          },
          {
            id: 'storage_card',
            name: '128GB Storage Card',
            description: 'High-speed microSD for local video storage',
            quantity: 1,
            value: '$39',
            icon: '💾'
          },
          {
            id: 'installation_guide',
            name: 'Installation Guide',
            description: 'Step-by-step setup instructions',
            quantity: 1,
            value: '$32',
            icon: '📋'
          }
        ]
      },
      {
        id: 'software',
        title: 'Software & AI Features',
        icon: '🧠',
        totalValue: '$300',
        items: [
          {
            id: 'ai_monitoring',
            name: 'AI Horse Monitoring',
            description: '24/7 automated horse behavior analysis',
            value: '$120',
            icon: '🐴',
            isHighlight: true
          },
          {
            id: 'mobile_app',
            name: 'Mobile App Access',
            description: 'iOS and Android apps with live viewing',
            value: '$60',
            icon: '📱'
          },
          {
            id: 'cloud_storage',
            name: 'Cloud Storage (7 days)',
            description: 'Secure cloud backup of important events',
            value: '$45',
            icon: '☁️'
          },
          {
            id: 'basic_alerts',
            name: 'Basic Alert System',
            description: 'Email and SMS notifications for key events',
            value: '$35',
            icon: '🚨'
          },
          {
            id: 'dashboard_access',
            name: 'Web Dashboard',
            description: 'Comprehensive web-based control panel',
            value: '$40',
            icon: '💻'
          }
        ]
      },
      {
        id: 'support',
        title: 'Support & Training',
        icon: '🎓',
        totalValue: '$200',
        items: [
          {
            id: 'phone_support',
            name: 'Phone Support',
            description: 'Business hours phone support',
            value: '$80',
            icon: '📞'
          },
          {
            id: 'email_support',
            name: 'Email Support',
            description: '24/7 email support with 12-hour response',
            value: '$60',
            icon: '📧'
          },
          {
            id: 'setup_guide',
            name: 'Video Setup Guide',
            description: 'Comprehensive video tutorials',
            value: '$40',
            icon: '🎬'
          },
          {
            id: 'knowledge_base',
            name: 'Knowledge Base Access',
            description: 'Searchable help articles and FAQs',
            value: '$20',
            icon: '📚'
          }
        ]
      },
      {
        id: 'warranty',
        title: 'Warranty & Guarantees',
        icon: '🛡️',
        totalValue: '$100',
        items: [
          {
            id: 'hardware_warranty',
            name: '2-Year Hardware Warranty',
            description: 'Full coverage on all hardware components',
            value: '$60',
            icon: '🔧',
            isHighlight: true
          },
          {
            id: 'money_back',
            name: '30-Day Money Back',
            description: 'Full refund if not completely satisfied',
            value: '$40',
            icon: '💰'
          }
        ]
      }
    ]
  },
  professional: {
    planId: 'professional',
    planName: 'Professional Plan',
    totalRetailValue: '$899',
    yourPrice: '$299',
    savings: '$600',
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Package',
        icon: '📦',
        totalValue: '$1,597',
        items: [
          {
            id: 'indoor_cameras',
            name: 'Indoor AI Cameras',
            description: 'Weather-resistant HD cameras with night vision',
            quantity: 2,
            value: '$598',
            icon: '📷',
            isHighlight: true
          },
          {
            id: 'outdoor_camera',
            name: 'Outdoor AI Camera',
            description: 'Weatherproof camera with infrared night vision',
            quantity: 1,
            value: '$399',
            icon: '📹',
            isHighlight: true
          },
          {
            id: 'mounting_kit',
            name: 'Professional Mounting Kit',
            description: 'Wall, ceiling, and post mounts with all hardware',
            quantity: 1,
            value: '$129',
            icon: '🔧'
          },
          {
            id: 'power_system',
            name: 'Power System & Cables',
            description: 'Multiple power adapters and 50ft cables',
            quantity: 1,
            value: '$149',
            icon: '⚡'
          },
          {
            id: 'hub_device',
            name: 'One Barn Hub Pro',
            description: 'Enhanced processing unit with edge AI',
            quantity: 1,
            value: '$599',
            icon: '🖥️',
            isHighlight: true
          },
          {
            id: 'storage_cards',
            name: '256GB Storage Cards',
            description: 'High-speed microSD cards for each camera',
            quantity: 3,
            value: '$117',
            icon: '💾'
          },
          {
            id: 'installation_kit',
            name: 'Complete Installation Kit',
            description: 'Professional tools and detailed instructions',
            quantity: 1,
            value: '$89',
            icon: '🧰'
          }
        ]
      },
      {
        id: 'software',
        title: 'Software & AI Features',
        icon: '🧠',
        totalValue: '$600',
        items: [
          {
            id: 'advanced_ai',
            name: 'Advanced AI Monitoring',
            description: 'Multi-horse tracking with behavior analysis',
            value: '$180',
            icon: '🐴',
            isHighlight: true
          },
          {
            id: 'health_monitoring',
            name: 'Health Monitoring',
            description: 'AI-powered health pattern recognition',
            value: '$120',
            icon: '🏥',
            isHighlight: true
          },
          {
            id: 'mobile_app_pro',
            name: 'Mobile App Pro',
            description: 'Advanced features and multi-camera control',
            value: '$90',
            icon: '📱'
          },
          {
            id: 'cloud_storage_extended',
            name: 'Cloud Storage (30 days)',
            description: 'Extended cloud backup with smart highlights',
            value: '$120',
            icon: '☁️'
          },
          {
            id: 'advanced_alerts',
            name: 'Advanced Alert System',
            description: 'Smart alerts with video clips and insights',
            value: '$75',
            icon: '🚨'
          },
          {
            id: 'dashboard_pro',
            name: 'Professional Dashboard',
            description: 'Advanced analytics and reporting features',
            value: '$90',
            icon: '💻'
          }
        ]
      },
      {
        id: 'support',
        title: 'Support & Training',
        icon: '🎓',
        totalValue: '$400',
        items: [
          {
            id: 'priority_support',
            name: 'Priority Phone Support',
            description: '24/7 priority phone support',
            value: '$120',
            icon: '📞',
            isHighlight: true
          },
          {
            id: 'email_support_priority',
            name: 'Priority Email Support',
            description: '24/7 email support with 4-hour response',
            value: '$80',
            icon: '📧'
          },
          {
            id: 'video_consultation',
            name: 'Video Consultation',
            description: '1-hour personalized setup consultation',
            value: '$120',
            icon: '🎬',
            isHighlight: true
          },
          {
            id: 'training_materials',
            name: 'Complete Training Package',
            description: 'Videos, guides, and best practices',
            value: '$80',
            icon: '📚'
          }
        ]
      },
      {
        id: 'warranty',
        title: 'Warranty & Guarantees',
        icon: '🛡️',
        totalValue: '$200',
        items: [
          {
            id: 'hardware_warranty_extended',
            name: '3-Year Hardware Warranty',
            description: 'Extended coverage with advanced replacement',
            value: '$120',
            icon: '🔧',
            isHighlight: true
          },
          {
            id: 'money_back_extended',
            name: '60-Day Money Back',
            description: 'Extended trial period with full refund',
            value: '$80',
            icon: '💰'
          }
        ]
      }
    ]
  },
  estate: {
    planId: 'estate',
    planName: 'Estate Plan',
    totalRetailValue: '$1,299',
    yourPrice: '$599',
    savings: '$700',
    sections: [
      {
        id: 'hardware',
        title: 'Hardware Package',
        icon: '📦',
        totalValue: '$2,797',
        items: [
          {
            id: 'indoor_cameras',
            name: 'Indoor AI Cameras',
            description: 'Premium HD cameras with advanced night vision',
            quantity: 4,
            value: '$1,196',
            icon: '📷',
            isHighlight: true
          },
          {
            id: 'outdoor_cameras',
            name: 'Outdoor AI Cameras',
            description: 'Weatherproof cameras with infrared night vision',
            quantity: 2,
            value: '$798',
            icon: '📹',
            isHighlight: true
          },
          {
            id: 'mounting_kit_complete',
            name: 'Complete Mounting System',
            description: 'Professional mounting hardware for all cameras',
            quantity: 1,
            value: '$199',
            icon: '🔧'
          },
          {
            id: 'power_system_complete',
            name: 'Complete Power System',
            description: 'UPS backup and weatherproof power distribution',
            quantity: 1,
            value: '$299',
            icon: '⚡'
          },
          {
            id: 'hub_device_enterprise',
            name: 'One Barn Hub Enterprise',
            description: 'High-performance processing with redundancy',
            quantity: 1,
            value: '$999',
            icon: '🖥️',
            isHighlight: true
          },
          {
            id: 'storage_system',
            name: '1TB Storage System',
            description: 'High-capacity storage with backup',
            quantity: 1,
            value: '$249',
            icon: '💾'
          },
          {
            id: 'installation_service',
            name: 'Professional Installation',
            description: 'White-glove installation service',
            quantity: 1,
            value: '$299',
            icon: '🧰',
            isHighlight: true
          }
        ]
      },
      {
        id: 'software',
        title: 'Software & AI Features',
        icon: '🧠',
        totalValue: '$1,200',
        items: [
          {
            id: 'enterprise_ai',
            name: 'Enterprise AI Suite',
            description: 'Full AI capability with custom training',
            value: '$300',
            icon: '🐴',
            isHighlight: true
          },
          {
            id: 'veterinary_integration',
            name: 'Veterinary Integration',
            description: 'Direct integration with veterinary systems',
            value: '$180',
            icon: '🏥',
            isHighlight: true
          },
          {
            id: 'training_insights',
            name: 'Training Insights',
            description: 'AI-powered training progress analysis',
            value: '$150',
            icon: '🎯',
            isHighlight: true
          },
          {
            id: 'mobile_app_enterprise',
            name: 'Mobile App Enterprise',
            description: 'Full-featured mobile access with team features',
            value: '$120',
            icon: '📱'
          },
          {
            id: 'cloud_storage_unlimited',
            name: 'Unlimited Cloud Storage',
            description: 'Unlimited cloud backup with AI highlights',
            value: '$200',
            icon: '☁️'
          },
          {
            id: 'custom_alerts',
            name: 'Custom Alert System',
            description: 'Fully customizable alerts with integrations',
            value: '$120',
            icon: '🚨'
          },
          {
            id: 'dashboard_enterprise',
            name: 'Enterprise Dashboard',
            description: 'Advanced analytics with custom reports',
            value: '$130',
            icon: '💻'
          }
        ]
      },
      {
        id: 'support',
        title: 'Support & Training',
        icon: '🎓',
        totalValue: '$600',
        items: [
          {
            id: 'dedicated_support',
            name: 'Dedicated Support Manager',
            description: 'Personal support manager for your account',
            value: '$200',
            icon: '📞',
            isHighlight: true
          },
          {
            id: 'onsite_training',
            name: 'On-Site Training',
            description: 'Comprehensive on-site training session',
            value: '$250',
            icon: '🎬',
            isHighlight: true
          },
          {
            id: 'custom_training',
            name: 'Custom Training Materials',
            description: 'Training materials tailored to your facility',
            value: '$150',
            icon: '📚'
          }
        ]
      },
      {
        id: 'warranty',
        title: 'Warranty & Guarantees',
        icon: '🛡️',
        totalValue: '$400',
        items: [
          {
            id: 'hardware_warranty_platinum',
            name: '5-Year Platinum Warranty',
            description: 'Comprehensive coverage with next-day replacement',
            value: '$250',
            icon: '🔧',
            isHighlight: true
          },
          {
            id: 'money_back_premium',
            name: '90-Day Money Back',
            description: 'Extended trial with full satisfaction guarantee',
            value: '$150',
            icon: '💰'
          }
        ]
      }
    ]
  }
};

// Helper function to get package contents by plan ID
export const getPackageContents = (planId: string): IPlanPackageContents | null => {
  return packageContentsConfig[planId] || null;
};

// Helper function to get total items count
export const getTotalItemsCount = (planId: string): number => {
  const contents = getPackageContents(planId);
  if (!contents) return 0;
  
  return contents.sections.reduce((total, section) => {
    return total + section.items.reduce((sectionTotal, item) => {
      return sectionTotal + (item.quantity || 1);
    }, 0);
  }, 0);
};

// Helper function to get highlighted items
export const getHighlightedItems = (planId: string): IPackageItem[] => {
  const contents = getPackageContents(planId);
  if (!contents) return [];
  
  const highlightedItems: IPackageItem[] = [];
  contents.sections.forEach(section => {
    section.items.forEach(item => {
      if (item.isHighlight) {
        highlightedItems.push(item);
      }
    });
  });
  
  return highlightedItems;
}; 