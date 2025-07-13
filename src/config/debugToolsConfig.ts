/**
 * Debug Tools Configuration
 * 
 * This file contains all development, testing, and demo tools
 * that should NOT appear on the main client-facing home page.
 * These tools are for developers, admins, and presentations.
 */

export interface IDebugTool {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  category: 'demo' | 'testing' | 'debug' | 'admin';
  access: 'admin' | 'developer' | 'public';
}

export interface IDebugToolsConfig {
  sectionTitle: string;
  description: string;
  categories: {
    demo: IDebugTool[];
    testing: IDebugTool[];
    debug: IDebugTool[];
    admin: IDebugTool[];
  };
}

export const debugToolsConfig: IDebugToolsConfig = {
  sectionTitle: 'Development & Testing Tools',
  description: 'Tools for development, testing, and demonstrations. Not part of the main client experience.',
  
  categories: {
    demo: [
      {
        id: 'client-workflow-demo',
        title: 'Complete Client Journey Demo',
        description: 'Interactive demo showing registration to monitoring workflow',
        route: 'client-workflow-demo',
        icon: '🎯',
        category: 'demo',
        access: 'public'
      },
      {
        id: 'barn-partnership-demo',
        title: 'Barn Partnership Demo',
        description: 'Financial results demonstration for barn partnerships',
        route: 'barn-partner-demo',
        icon: '🤝',
        category: 'demo',
        access: 'public'
      },
      {
        id: 'video-analysis-demo',
        title: 'Video Analysis Demo',
        description: 'Upload and analyze horse videos with AI',
        route: 'video-analysis-demo',
        icon: '🎬',
        category: 'demo',
        access: 'public'
      }
    ],
    
    testing: [
      {
        id: 'ai-testing-single-image',
        title: 'Single Image AI Testing',
        description: 'Test AI analysis on individual images',
        route: 'ai-testing-single-image',
        icon: '🧪',
        category: 'testing',
        access: 'developer'
      },
      {
        id: 'simple-threshold-tester',
        title: 'Threshold Testing Tool',
        description: 'Debug and calibrate AI thresholds',
        route: 'simple-threshold-tester',
        icon: '⚙️',
        category: 'testing',
        access: 'developer'
      },
      {
        id: 'horse-detection-tester',
        title: 'Horse Detection Testing',
        description: 'Test horse detection algorithms',
        route: 'horse-detection-tester',
        icon: '🔍',
        category: 'testing',
        access: 'developer'
      },
      {
        id: 'batch-tester',
        title: 'Batch Testing Tool',
        description: 'Run automated batch tests on multiple images',
        route: 'batch-tester',
        icon: '📦',
        category: 'testing',
        access: 'developer'
      },
      {
        id: 'overnight-test',
        title: 'Overnight AI Testing',
        description: 'Long-running AI optimization tests',
        route: 'overnight-test',
        icon: '🌙',
        category: 'testing',
        access: 'developer'
      }
    ],
    
    debug: [
      {
        id: 'ai-monitor',
        title: 'AI Monitor Dashboard',
        description: 'Real-time AI processing monitor',
        route: 'ai-monitor',
        icon: '📡',
        category: 'debug',
        access: 'developer'
      },
      {
        id: 'ai-observation',
        title: 'AI Observation Tool',
        description: 'Detailed AI analysis observations',
        route: 'ai-observation',
        icon: '👁️',
        category: 'debug',
        access: 'developer'
      },
      {
        id: 'video-upload',
        title: 'Video Upload Tool',
        description: 'Upload and process video files',
        route: 'video-upload',
        icon: '📤',
        category: 'debug',
        access: 'developer'
      }
    ],
    
    admin: [
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard',
        description: 'System administration and management',
        route: 'admin-dashboard',
        icon: '⚡',
        category: 'admin',
        access: 'admin'
      },
      {
        id: 'manager-dashboard',
        title: 'Manager Dashboard',
        description: 'Facility management dashboard',
        route: 'manager-dashboard',
        icon: '📊',
        category: 'admin',
        access: 'admin'
      },
      {
        id: 'employee-dashboard',
        title: 'Employee Dashboard',
        description: 'Staff monitoring dashboard',
        route: 'employee-dashboard',
        icon: '👷',
        category: 'admin',
        access: 'admin'
      },
      {
        id: 'support-dashboard',
        title: 'Support Dashboard',
        description: 'Customer support tools',
        route: 'support-dashboard',
        icon: '🎧',
        category: 'admin',
        access: 'admin'
      }
    ]
  }
};

// Helper functions for accessing debug tools
export const getDebugToolsByCategory = (category: 'demo' | 'testing' | 'debug' | 'admin'): IDebugTool[] => {
  return debugToolsConfig.categories[category];
};

export const getDebugToolsByAccess = (access: 'admin' | 'developer' | 'public'): IDebugTool[] => {
  const allTools = [
    ...debugToolsConfig.categories.demo,
    ...debugToolsConfig.categories.testing,
    ...debugToolsConfig.categories.debug,
    ...debugToolsConfig.categories.admin
  ];
  
  return allTools.filter(tool => tool.access === access || access === 'admin');
};

export const getAllDebugTools = (): IDebugTool[] => {
  return [
    ...debugToolsConfig.categories.demo,
    ...debugToolsConfig.categories.testing,
    ...debugToolsConfig.categories.debug,
    ...debugToolsConfig.categories.admin
  ];
}; 