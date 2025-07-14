export const contactConfig = {
    // Hero section
    txt_hero_headline: "CONNECT WITH ONE BARN AI",
    txt_hero_subheading: "Your AI Guardian Support Team",
    img_hero_background: "/images/contact-hero-barn-sunset.jpg",
    
    // SubHero section
    txt_subhero_headline: "GET STARTED PROTECTING YOUR HORSES",
    txt_subhero_subheading: "Expert Support for AI Monitoring Solutions",
    txt_subhero_description: "Ready to start protecting your horses with AI that never sleeps? Our team of equine technology specialists is here to help you implement the perfect monitoring solution for your facility. From initial consultation to ongoing support, we're committed to ensuring your horses receive 24/7 protection.",
    txt_subhero_description2: "Whether you need help selecting the right monitoring plan, have questions about installation, or want to understand how our AI detects emergencies, our knowledgeable team combines deep equine expertise with advanced technology understanding. We're here to provide the guidance you need to make informed decisions about your horses' safety.",
    
    // Direct Contact section
    txt_direct_contact_heading: "Emergency & Support Contact",
    txt_direct_contact_description: "For immediate assistance or emergency system support, contact us directly.",
    txt_phone: "(555) 123-BARN",
    txt_email: "support@onebarnai.com",
    txt_emergency_phone: "(555) 911-BARN",
    txt_emergency_label: "24/7 Emergency Support:",
    txt_text_legal_notice: "By texting One Barn AI at (555) 123-BARN with any question or \"START\", you agree to receive customer care and system alert texts from us. Message frequency varies based on your monitoring plan and alert settings. Msg & data rates may apply. Text HELP for assistance or STOP to cancel. View our Privacy Policy and Terms and Conditions.",
    url_privacy_policy: "/privacy-policy",
    url_terms_conditions: "/terms-and-conditions",
    
    // Emergency Contact section
    txt_emergency_heading: "Emergency System Support",
    txt_emergency_description: "Critical system issues and emergency monitoring support",
    txt_emergency_hours: "Available 24/7 for active monitoring customers",
    txt_emergency_response_time: "Average response time: Under 15 minutes",
    emergency_contact_types: [
        {
            type: "System Failure",
            description: "Camera offline, AI monitoring disrupted",
            contact: "(555) 911-BARN",
            priority: "Critical"
        },
        {
            type: "False Alert Issues",
            description: "Excessive false alarms, calibration needed",
            contact: "(555) 123-BARN",
            priority: "High"
        },
        {
            type: "Setup Support",
            description: "Installation questions, configuration help",
            contact: "support@onebarnai.com",
            priority: "Standard"
        }
    ],
    
    // Location section (for main office/support center)
    txt_location_heading: "One Barn AI Headquarters",
    txt_location_address_headline: "Main Office:",
    txt_location_address: [
        "One Barn AI Technologies",
        "1234 Equine Technology Drive",
        "Lexington, KY 40505"
    ],
    txt_location_description: "Located in the heart of horse country",
    txt_location_directions: "Our facility is located near the Kentucky Horse Park, with easy access from I-75. Visitor parking available for facility tours and consultations.",
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3137.123456789!2d-84.5037!3d38.1127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12345678!2sOne%20Barn%20AI!5e0!3m2!1sen!2sus!4v1747843278920!5m2!1sen!2sus",
    direct_map_link: "https://maps.app.goo.gl/OneBarnAILocation",
    
    // Contact Form section
    txt_form_heading: "Request Information or Support",
    txt_form_description: "Have questions about our AI monitoring system, need technical support, or want to schedule a consultation? Complete the form below and we'll respond within 4 hours during business hours.",
    txt_form_styled_description: {
        plainText: "Have questions about our AI Guardian system, emergency detection capabilities, or need installation support? Complete the form below and we'll respond within 4 hours during business hours.",
        specialTerms: [
            {
                term: "AI Guardian",
                color: "primaryBlue",
                fontWeight: 600
            },
            {
                term: "emergency detection",
                color: "emergencyRed",
                fontWeight: 600
            }
        ]
    },
    txt_form_quote: "One Barn AI: Because your horses deserve protection that never sleeps.",
    txt_form_legal_notice: "By entering your telephone number you agree to receive customer care and system alert texts from One Barn AI. Message frequency varies based on your monitoring plan and emergency alert settings. Msg & data rates may apply. Text HELP for assistance or STOP to cancel. View our Privacy Policy and Terms and Conditions.",
    
    // Form fields
    form_fields: {
        first_name: {
            label: "First Name",
            required: true,
            placeholder: "Your first name"
        },
        last_name: {
            label: "Last Name", 
            required: true,
            placeholder: "Your last name"
        },
        phone: {
            label: "Phone",
            required: true,
            placeholder: "Your phone number (required for emergency alerts)"
        },
        email: {
            label: "Email",
            required: true,
            placeholder: "Your email address"
        },
        facility_name: {
            label: "Facility Name",
            required: false,
            placeholder: "Your barn or facility name"
        },
        number_of_horses: {
            label: "Number of Horses",
            required: false,
            placeholder: "How many horses do you have?"
        },
        inquiry_type: {
            label: "Inquiry Type",
            required: true,
            type: "select",
            options: [
                "General Information",
                "Pricing & Plans",
                "Technical Support",
                "Installation Consultation",
                "Emergency System Issue",
                "Partnership Inquiry"
            ]
        },
        subject: {
            label: "Subject",
            required: true,
            placeholder: "Brief description of your inquiry"
        },
        message: {
            label: "Message",
            required: true,
            placeholder: "Tell us more about your monitoring needs or support request"
        }
    },
    txt_submit_button: "Send Message",
    form_submission_email: "support@onebarnai.com",
    txt_success_message_heading: "Your message has been sent successfully!",
    txt_success_message_body: "Our equine technology specialists will respond within 4 hours during business hours. For emergency system issues, please call our 24/7 support line.",
    
    // FAQ section
    txt_faq_heading: "Frequently Asked Questions",
    txt_faq_description: "Quick answers about our AI monitoring system and support",
    faq_items: [
        {
            question: "How quickly does the AI detect emergencies?",
            answer: "Our AI analyzes video feeds in real-time, detecting emergency situations like colic symptoms or casting within seconds. Alerts are sent immediately to your phone, email, and designated emergency contacts."
        },
        {
            question: "What happens if my internet goes down?",
            answer: "Our system includes cellular backup connectivity and local storage. Critical alerts are queued and sent once connectivity is restored. Emergency recordings are saved locally to prevent data loss."
        },
        {
            question: "How do I reduce false alarms?",
            answer: "Our AI learns your horses' normal behavior patterns over time, reducing false alarms significantly. You can also adjust sensitivity settings through your dashboard or contact our support team for calibration assistance."
        },
        {
            question: "What's included in 24/7 emergency support?",
            answer: "Emergency support covers system failures, critical alert issues, and urgent technical problems that affect your horses' safety monitoring. Our team responds to emergency calls within 15 minutes."
        },
        {
            question: "Can I get a consultation before installing?",
            answer: "Absolutely! We provide free facility assessments to determine optimal camera placement and system configuration. Our experts will visit your facility to design the perfect monitoring solution."
        },
        {
            question: "How long does installation take?",
            answer: "Most installations are completed in 1-2 days depending on facility size. We handle all camera mounting, network setup, and AI calibration. Your system will be fully operational before we leave."
        }
    ],
    
    // Service Areas section
    txt_service_heading: "Service Areas",
    txt_service_description: "Professional installation and support coverage",
    service_areas: [
        {
            region: "Primary Service Area",
            states: ["Kentucky", "Tennessee", "Virginia", "North Carolina", "Ohio"],
            description: "Full installation and next-day on-site support"
        },
        {
            region: "Extended Service Area", 
            states: ["Florida", "Georgia", "South Carolina", "West Virginia", "Indiana"],
            description: "Installation available with 48-hour support response"
        },
        {
            region: "Remote Support Area",
            states: ["All other US states"],
            description: "Remote installation guidance and virtual support available"
        }
    ],
    
    // Support Hours section
    txt_hours_heading: "Support Hours",
    txt_hours_description: "When our team is available to help",
    business_hours: {
        monday: "7:00 AM - 9:00 PM",
        tuesday: "7:00 AM - 9:00 PM", 
        wednesday: "7:00 AM - 9:00 PM",
        thursday: "7:00 AM - 9:00 PM",
        friday: "7:00 AM - 9:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "8:00 AM - 6:00 PM"
    },
    txt_hours_note: "Emergency system support available 24/7",
    txt_emergency_hours_note: "Critical monitoring issues: Call (555) 911-BARN anytime",
    txt_button_emergency_text: "Emergency Support",
    url_button_emergency: "tel:+15559118276",
    txt_button_consultation_text: "Schedule Consultation",
    url_button_consultation: "/consultation",
    
    // CTA section
    txt_cta_heading: "Start Protecting Your Horses Tonight",
    txt_cta_subheading: "Peace of Mind That Never Sleeps",
    txt_cta_description: "Don't wait for an emergency to discover the gaps in your horse monitoring. Our AI guardian technology provides the vigilant protection your horses deserve, detecting problems before they become crises and ensuring help is always just a phone call away.",
    txt_cta_description2: "Join hundreds of horse owners who sleep better knowing their animals are protected by technology that never blinks, never gets tired, and never misses the signs that matter most.",
    txt_cta_button: "Start Monitoring",
    url_cta_button: "/register",
    txt_cta_secondary_button: "Schedule Consultation",
    url_cta_secondary: "/consultation",
    img_cta_background: "/images/contact-cta-barn-protection.jpg",
    
    // Legal disclaimers
    txt_monitoring_disclaimer: "One Barn AI monitoring technology is designed to assist with horse care and emergency detection. It does not replace proper veterinary care, regular facility management, or professional horse handling. Always consult with qualified veterinarians for health concerns.",
    txt_emergency_disclaimer: "Emergency alert system is dependent on internet connectivity and mobile service. Multiple notification methods are recommended. One Barn AI is not responsible for delayed or failed message delivery due to network issues beyond our control.",
    
    // SEO and metadata
    seo: {
        title: "Contact One Barn AI | 24/7 Emergency Support & AI Monitoring Solutions",
        description: "Contact One Barn AI for emergency system support, installation consultations, and AI monitoring questions. 24/7 emergency support available for active monitoring customers.",
        keywords: "One Barn AI contact, horse monitoring support, AI emergency detection contact, equine surveillance customer service, barn camera installation support, 24/7 horse monitoring help",
        canonical: "https://onebarnai.com/contact",
        ogImage: "/images/og-contact-one-barn-ai.jpg",
        ogType: "website",
        structuredData: {
            "@type": "LocalBusiness",
            name: "One Barn AI Technologies",
            image: "https://onebarnai.com/images/og-contact-one-barn-ai.jpg",
            "@id": "https://onebarnai.com",
            url: "https://onebarnai.com/contact",
            telephone: "(555) 123-2276",
            email: "support@onebarnai.com",
            address: {
                "@type": "PostalAddress",
                streetAddress: "1234 Equine Technology Drive",
                addressLocality: "Lexington",
                addressRegion: "KY",
                postalCode: "40505",
                addressCountry: "US"
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: 38.1127,
                longitude: -84.5037
            },
            openingHoursSpecification: [
                {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "07:00",
                    closes: "21:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Saturday", "Sunday"],
                    opens: "08:00",
                    closes: "18:00"
                }
            ],
            sameAs: [
                "https://linkedin.com/company/onebarnai",
                "https://twitter.com/onebarnai"
            ],
            serviceArea: {
                "@type": "State",
                name: ["Kentucky", "Tennessee", "Virginia", "North Carolina", "Ohio", "Florida", "Georgia", "South Carolina", "West Virginia", "Indiana"]
            }
        }
    }
};

export default contactConfig;