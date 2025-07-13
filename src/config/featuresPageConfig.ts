export const featuresConfig = {
    // Hero section
    txt_hero_headline: "ADVANCED AI MONITORING FEATURES",
    txt_hero_subheading: "Comprehensive Technology Solutions for Modern Equine Facilities",
    vid_hero_background: {
        desktop: "/videos/ai-monitoring-demo.mp4",
        mobile: "/videos/ai-monitoring-demo-mobile.mp4",
    },
    txt_hero_cta: "Explore Features",
    url_hero_cta: "/features/demo",
    
    // SubHero section - Technology Overview
    txt_subhero_headline: "NEXT-GENERATION EQUINE SURVEILLANCE",
    txt_subhero_subheading: "AI-Powered Monitoring That Never Sleeps",
    txt_subhero_description: "Traditional horse monitoring relies on periodic check-ins and human observation, leaving gaps in care coverage during critical overnight hours and busy periods. Missed behavioral changes, undetected injuries, and delayed emergency responses can have serious consequences for both horse welfare and facility operations.",
    txt_subhero_description2: "Our AI monitoring system provides continuous, intelligent surveillance that learns your horses' normal patterns and immediately alerts you to any concerning changes. From subtle lameness detection to emergency situations, our technology ensures nothing goes unnoticed.",

    // Core Technology section
    txt_technology_heading: "ADVANCED AI CAPABILITIES",
    txt_technology_description: "Our monitoring system uses cutting-edge artificial intelligence to provide insights that human observation alone cannot achieve, creating a new standard of care for equine facilities.",
    txt_technology_description2: "Machine learning algorithms trained specifically on equine behavior patterns enable early detection of health issues, behavioral changes, and emergency situations with unprecedented accuracy.",
    img_technology_primary: "/images/ai-analysis-dashboard.png",
    img_technology_secondary: "/images/behavior-pattern-analysis.png",
    
    // Features Overview section
    txt_features_overview_heading: "COMPREHENSIVE MONITORING SUITE",
    txt_features_overview_description: "Every feature designed specifically for equine facility management",
    
    // Core Features Categories
    core_features: [
        {
            id: "live_monitoring",
            category: "Live Surveillance",
            title: "24/7 Live Camera Monitoring",
            description: "High-definition cameras with night vision capabilities provide continuous surveillance of stalls, pastures, and training areas.",
            icon: "video-camera",
            features: [
                "4K Ultra HD video quality with automatic adjustment",
                "Advanced night vision for 24/7 monitoring",
                "Pan, tilt, and zoom controls for detailed observation",
                "Multi-camera view with customizable layouts",
                "Mobile app access for remote monitoring",
                "Two-way audio communication",
                "Weather-resistant outdoor cameras",
                "Encrypted streaming for privacy protection"
            ],
            image: "/images/features/live-monitoring.jpg",
            video: "/videos/live-monitoring-demo.mp4"
        },
        {
            id: "ai_analysis",
            category: "AI Intelligence",
            title: "Smart Behavior Analysis",
            description: "Advanced AI algorithms analyze horse behavior patterns to detect changes in health, comfort, and routine activities.",
            icon: "brain-circuit",
            features: [
                "Automated gait analysis and lameness detection",
                "Behavioral pattern recognition and anomaly alerts",
                "Feeding habit monitoring and appetite tracking",
                "Sleep pattern analysis and rest quality assessment",
                "Social interaction monitoring in group settings",
                "Stress indicator detection through movement patterns",
                "Predictive health analytics based on behavior changes",
                "Custom alert thresholds for each horse"
            ],
            image: "/images/features/ai-analysis.jpg",
            video: "/videos/ai-analysis-demo.mp4"
        },
        {
            id: "motion_detection",
            category: "Alert Systems",
            title: "Intelligent Motion Detection",
            description: "Smart motion detection distinguishes between normal activity and potential emergencies, reducing false alarms while ensuring critical events are never missed.",
            icon: "motion-sensor",
            features: [
                "Smart motion zones with customizable sensitivity",
                "Emergency movement pattern recognition",
                "Automatic recording triggering for incidents",
                "Real-time SMS and email alerts",
                "Integration with veterinary emergency contacts",
                "False alarm reduction through AI filtering",
                "Customizable notification schedules",
                "Activity level tracking and trending"
            ],
            image: "/images/features/motion-detection.jpg",
            video: "/videos/motion-detection-demo.mp4"
        },
        {
            id: "recording_storage",
            category: "Data Management",
            title: "Advanced Recording & Storage",
            description: "Comprehensive recording capabilities with intelligent storage management ensure critical footage is always available when needed.",
            icon: "database",
            features: [
                "Continuous recording with motion-triggered highlights",
                "Up to 90-day cloud storage retention",
                "Automatic backup and redundancy systems",
                "Easy search and filter capabilities",
                "Incident timeline reconstruction",
                "Secure sharing with veterinarians and trainers",
                "Export capabilities for insurance claims",
                "Automatic cleanup of routine footage"
            ],
            image: "/images/features/recording-storage.jpg",
            video: "/videos/storage-demo.mp4"
        },
        {
            id: "health_integration",
            category: "Health Monitoring",
            title: "Veterinary Integration Platform",
            description: "Seamless integration with veterinary care through video consultation capabilities and health monitoring features.",
            icon: "stethoscope",
            features: [
                "Remote veterinary consultation access",
                "Video-assisted health assessments",
                "Automatic health alert generation",
                "Integration with practice management software",
                "Treatment compliance monitoring",
                "Recovery progress tracking through video analysis",
                "Medication administration verification",
                "Health record synchronization"
            ],
            image: "/images/features/vet-integration.jpg",
            video: "/videos/vet-integration-demo.mp4"
        },
        {
            id: "facility_management",
            category: "Operations",
            title: "Facility Operations Dashboard",
            description: "Comprehensive facility management tools that streamline operations and ensure optimal care standards across all areas.",
            icon: "dashboard",
            features: [
                "Real-time facility status monitoring",
                "Staff activity tracking and verification",
                "Equipment maintenance alert integration",
                "Visitor access control and logging",
                "Environmental monitoring (temperature, humidity)",
                "Feed room security and inventory tracking",
                "Arena and training area utilization analysis",
                "Compliance documentation automation"
            ],
            image: "/images/features/facility-dashboard.jpg",
            video: "/videos/facility-management-demo.mp4"
        }
    ],
    
    // Advanced Features section
    txt_advanced_heading: "PREMIUM FEATURES & CAPABILITIES",
    txt_advanced_description: "Advanced functionality for sophisticated equine operations",
    advanced_features: [
        {
            id: "predictive_analytics",
            title: "Predictive Health Analytics",
            description: "Machine learning algorithms analyze long-term patterns to predict potential health issues before symptoms become visible.",
            icon: "crystal-ball",
            availability: "Premium Plus"
        },
        {
            id: "training_analysis",
            title: "Performance Training Analysis",
            description: "Detailed movement analysis for training sessions with gait mechanics and performance improvement recommendations.",
            icon: "trending-up",
            availability: "Premium Plus"
        },
        {
            id: "multi_facility",
            title: "Multi-Facility Management",
            description: "Centralized monitoring and management across multiple locations with unified reporting and analytics.",
            icon: "building-network",
            availability: "Enterprise"
        },
        {
            id: "api_integration",
            title: "Third-Party API Integration",
            description: "Connect with existing farm management software, billing systems, and industry-standard applications.",
            icon: "plug-connection",
            availability: "Enterprise"
        }
    ],
    
    // Benefits section
    txt_benefits_heading: "OPERATIONAL ADVANTAGES",
    txt_benefits_description: "Quantifiable improvements to facility operations and horse care quality",
    benefits: [
        {
            id: "cost_reduction",
            title: "Reduced Operational Costs",
            description: "Decrease staffing requirements during off-hours while maintaining superior care standards through automated monitoring.",
            icon: "dollar-decrease",
            metrics: "Up to 30% reduction in overnight staffing costs"
        },
        {
            id: "early_detection",
            title: "Early Health Issue Detection",
            description: "Identify potential health problems days before they become visible to human observers, reducing treatment costs and recovery time.",
            icon: "medical-early",
            metrics: "Average 3-5 day earlier detection of lameness issues"
        },
        {
            id: "liability_protection",
            title: "Enhanced Liability Protection",
            description: "Comprehensive video documentation protects against false claims and provides evidence for insurance purposes.",
            icon: "shield-check",
            metrics: "100% incident documentation and verification"
        },
        {
            id: "client_confidence",
            title: "Increased Client Confidence",
            description: "Transparent monitoring builds trust with horse owners who can access live feeds and receive regular updates.",
            icon: "handshake-trust",
            metrics: "95% client satisfaction increase with video access"
        }
    ],
    
    // Technology Specifications section
    txt_specs_heading: "TECHNICAL SPECIFICATIONS",
    txt_specs_description: "Enterprise-grade technology designed for reliability and performance",
    technical_specs: [
        {
            category: "Video Quality",
            specifications: [
                "4K Ultra HD recording (3840x2160)",
                "1080p Full HD streaming",
                "30 FPS smooth motion capture",
                "Advanced H.265 compression",
                "HDR support for challenging lighting",
                "Digital zoom up to 10x without quality loss"
            ]
        },
        {
            category: "AI Processing",
            specifications: [
                "Real-time computer vision analysis",
                "Custom-trained equine behavior models",
                "Edge computing for minimal latency",
                "99.2% accuracy in movement detection",
                "Machine learning pattern recognition",
                "Predictive analytics engine"
            ]
        },
        {
            category: "Network & Storage",
            specifications: [
                "Cloud-first architecture with local backup",
                "Military-grade encryption (AES-256)",
                "99.9% uptime service level agreement",
                "Scalable bandwidth adaptation",
                "Global CDN for fast access",
                "Automatic failover systems"
            ]
        },
        {
            category: "Hardware",
            specifications: [
                "IP67 weatherproof rating",
                "Operating temperature: -40°F to 140°F",
                "Infrared night vision up to 100 feet",
                "Power over Ethernet (PoE) support",
                "Wireless and cellular backup options",
                "5-year hardware warranty"
            ]
        }
    ],
    
    // Integration Capabilities section
    txt_integration_heading: "SEAMLESS INTEGRATIONS",
    txt_integration_description: "Connect with your existing systems for a unified management experience",
    integrations: [
        {
            category: "Practice Management",
            systems: [
                "VetBlue Practice Management",
                "eVetPractice Software",
                "ImproMed Equine",
                "Cornerstone Equine Software",
                "Custom API integrations"
            ]
        },
        {
            category: "Facility Management",
            systems: [
                "StableSecretary",
                "BarnManager",
                "EquiSoft Barn Management",
                "FarmVet Systems",
                "Custom facility platforms"
            ]
        },
        {
            category: "Communication",
            systems: [
                "Slack notifications",
                "Microsoft Teams integration",
                "WhatsApp Business alerts",
                "Email automation platforms",
                "SMS gateway services"
            ]
        }
    ],
    
    // Subscription Tiers section
    txt_subscription_heading: "MONITORING PLANS",
    txt_subscription_description: "Choose the perfect monitoring solution for your facility size and needs",
    subscription_tiers: [
        {
            id: "basic",
            name: "Basic Monitoring",
            price: "$49",
            period: "per month",
            description: "Essential monitoring for small facilities",
            features: [
                "2 Camera Feeds",
                "720p HD Quality",
                "7-Day Recording Storage",
                "Motion Alerts",
                "Mobile App Access",
                "Email Support"
            ],
            limitations: [
                "Limited to 2 cameras",
                "Basic motion detection only",
                "No AI analysis features"
            ],
            cta: "Start Basic Plan",
            popular: false
        },
        {
            id: "premium",
            name: "Premium Live",
            price: "$89",
            period: "per month",
            description: "Advanced monitoring with AI capabilities",
            features: [
                "6 Camera Feeds",
                "1080p Full HD Quality",
                "30-Day Recording Storage",
                "Night Vision",
                "AI Motion Detection & Analysis",
                "Live Audio",
                "Priority Support",
                "Basic health monitoring"
            ],
            limitations: [
                "Limited to 6 cameras",
                "Basic AI features only"
            ],
            cta: "Choose Premium",
            popular: true
        },
        {
            id: "premium_plus",
            name: "Premium Plus",
            price: "$149",
            period: "per month",
            description: "Complete monitoring with advanced AI",
            features: [
                "12 Camera Feeds",
                "4K Ultra HD Quality",
                "90-Day Recording Storage",
                "Advanced Night Vision",
                "Full AI Motion Analysis",
                "Two-Way Audio",
                "Veterinary Consultation Integration",
                "Advanced health analytics",
                "Predictive monitoring",
                "24/7 Phone Support"
            ],
            limitations: [],
            cta: "Get Premium Plus",
            popular: false
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "Custom",
            period: "pricing",
            description: "Unlimited monitoring for large operations",
            features: [
                "Unlimited Camera Feeds",
                "Custom video quality options",
                "Unlimited recording storage",
                "Multi-facility management",
                "Custom AI model training",
                "API access and integrations",
                "Dedicated account management",
                "Custom reporting and analytics",
                "White-label options",
                "On-site support available"
            ],
            limitations: [],
            cta: "Contact Sales",
            popular: false
        }
    ],
    
    // FAQ section
    txt_faq_heading: "FREQUENTLY ASKED QUESTIONS",
    txt_faq_description: "Common questions about our AI monitoring technology",
    faq_items: [
        {
            question: "How accurate is the AI behavior analysis?",
            answer: "Our AI system maintains a 99.2% accuracy rate in movement detection and 95% accuracy in behavioral pattern recognition. The system continuously learns and improves from each facility's unique patterns."
        },
        {
            question: "What happens if my internet connection is interrupted?",
            answer: "Our system includes local storage backup and cellular failover options. Critical alerts are queued and sent once connectivity is restored, ensuring no important notifications are lost."
        },
        {
            question: "Can veterinarians access the camera feeds for remote consultations?",
            answer: "Yes, Premium Plus and Enterprise plans include secure veterinary access. You can grant temporary or permanent access to specific cameras for your veterinary team."
        },
        {
            question: "How is my data protected and secured?",
            answer: "All video feeds use military-grade AES-256 encryption. Data is stored in secure cloud facilities with multiple redundancy layers and strict access controls."
        },
        {
            question: "What's the setup process for new installations?",
            answer: "Our certified technicians handle complete installation, typically completed within 1-2 days. The process includes camera mounting, network configuration, and staff training."
        },
        {
            question: "Can the system work with my existing security cameras?",
            answer: "In many cases, yes. Our technical team can evaluate your current camera infrastructure and determine compatibility. Some older systems may require upgrades for full AI functionality."
        }
    ],
    
    // Implementation section
    txt_implementation_heading: "IMPLEMENTATION PROCESS",
    txt_implementation_description: "Professional installation and setup designed for minimal disruption",
    implementation_steps: [
        {
            step: 1,
            title: "Site Assessment & Planning",
            description: "Our technical team conducts a comprehensive facility assessment to determine optimal camera placement and network requirements.",
            duration: "1-2 days",
            icon: "site-map"
        },
        {
            step: 2,
            title: "Professional Installation",
            description: "Certified technicians install cameras, configure network infrastructure, and set up the monitoring system with minimal facility disruption.",
            duration: "1-2 days",
            icon: "installation"
        },
        {
            step: 3,
            title: "System Configuration & Testing",
            description: "AI algorithms are calibrated for your specific facility and horses. All features are tested and validated before going live.",
            duration: "1 day",
            icon: "settings-gear"
        },
        {
            step: 4,
            title: "Staff Training & Go-Live",
            description: "Comprehensive training for your team on using the monitoring system, followed by full system activation with ongoing support.",
            duration: "Half day",
            icon: "graduation-cap"
        }
    ],
    
    // CTA section
    txt_cta_heading: "Transform Your Facility Operations Today",
    txt_cta_subheading: "Join hundreds of facilities already benefiting from AI monitoring",
    txt_cta_description: "Don't wait for an emergency to discover the gaps in your monitoring capabilities. Our AI system provides the peace of mind that comes from knowing your horses are continuously monitored by technology that never sleeps.",
    txt_cta_testimonial: "The AI monitoring system detected our mare's colic symptoms 4 hours before we would have noticed during morning rounds. That early detection likely saved her life.",
    txt_cta_testimonial_author: "— Dr. Sarah Mitchell, Equine Veterinarian",
    txt_cta_point1: "Professional installation with minimal disruption",
    txt_cta_point2: "30-day money-back guarantee",
    txt_cta_point3: "24/7 technical support included",
    txt_cta_button: "Get Started Today",
    txt_cta_secondary: "Free consultation and facility assessment",
    url_cta_button: "/contact/consultation",
    img_cta_background: "/images/features-cta-background.jpg",
    
    // SEO and metadata
    seo: {
        title: "AI Monitoring Features | Advanced Equine Surveillance Technology",
        description: "Discover comprehensive AI monitoring features for horse facilities including 24/7 surveillance, smart behavior analysis, motion detection, and veterinary integration capabilities.",
        keywords: "AI horse monitoring, equine surveillance system, smart barn cameras, horse behavior analysis, motion detection alerts, veterinary consultation integration, facility management software, predictive health analytics",
        canonical: "https://equinemonitor.com/features",
        ogImage: "/images/og-features.jpg",
        ogType: "website",
        structuredData: {
            "@type": "SoftwareApplication",
            name: "Equine AI Monitoring System",
            description: "Advanced AI-powered monitoring solution for horse facilities featuring 24/7 surveillance, behavioral analysis, and health monitoring capabilities.",
            applicationCategory: "SecurityApplication",
            operatingSystem: "Web-based, iOS, Android",
            offers: {
                "@type": "AggregateOffer",
                lowPrice: "49.00",
                highPrice: "149.00",
                priceCurrency: "USD",
                offerCount: 4
            },
            featureList: [
                "24/7 Live Camera Monitoring",
                "AI Behavior Analysis", 
                "Motion Detection Alerts",
                "Veterinary Integration",
                "Mobile App Access",
                "Cloud Storage"
            ]
        }
    }
};

export default featuresConfig;