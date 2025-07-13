export type AppRoute = 
  | 'home' 
  | 'login' 
  | 'register'
  | 'features'
  | 'register-owner'
  | 'register-horses'
  | 'register-facility'
  | 'register-plans'
  | 'register-payment'
  | 'register-confirmation'
  | 'smart-dashboard'        // Smart dashboard that shows role-based content
  | 'employee-dashboard' 
  | 'client-dashboard' 
  | 'manager-dashboard' 
  | 'admin-dashboard'
  | 'veterinarian-dashboard' // AI-powered veterinary dashboard
  | 'support-dashboard'      // Enhanced support staff dashboard
 
  | 'ai-dashboard'
  | 'ai-monitor'
  | 'ai-insights'
  | 'ai-observation'
  | 'ai-testing-single-image' // NEW: Single-image AI filter testing tool
  | 'camera-monitor'
  | 'camera-feed'
  | 'wyze-v4-dashboard'      // NEW: Wyze V4 camera management dashboard
  | 'video-upload'
  | 'demo'
  | 'video-analysis-demo'    // NEW: Video analysis demo for public showcasing
  | 'client-workflow-demo'  // NEW: Complete client workflow demo for presentations
  | 'debug-tools'          // NEW: Development and testing tools page
  | 'barn-partner-demo'
  | 'overnight-test'         // NEW: Overnight AI optimization testing
  | 'simple-threshold-tester'  // NEW: Simple threshold debugging tool
  | 'horse-detection-tester'   // NEW: Pre-AI horse detection system
  | 'batch-tester'             // NEW: Automated batch testing for horse detection
  | 'reolink-demo'            // NEW: ReoLink camera integration demo with smart monitoring
  | 'camera-comparison-demo'  // NEW: Compare ReoLink vs Wyze camera integrations
  | 'simple-wyze-demo'       // NEW: Simple Wyze camera feed without AI analysis
  // Legacy routes for historical reference
  | 'legacy-home'
  | 'legacy-employee-dashboard'
  | 'legacy-client-dashboard'
  | 'legacy-manager-dashboard'
  | 'legacy-admin-dashboard'; 