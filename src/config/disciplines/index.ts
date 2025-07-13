// 🏇 Discipline Configuration Index
// Unified access point for all equestrian discipline configurations

export { barrelRacingConfig } from './barrelRacingConfig';
export { dressageConfig } from './dressageConfig';
export { showJumpingConfig } from './showJumpingConfig';
export { cuttingConfig } from './cuttingConfig';
export { reiningConfig } from './reiningConfig';
export { hunterJumperConfig } from './hunterJumperConfig';
export { eventingConfig } from './eventingConfig';

// 🎯 Discipline Registry
export const disciplineRegistry = {
  'barrel_racing': () => import('./barrelRacingConfig').then(m => m.barrelRacingConfig),
  'dressage': () => import('./dressageConfig').then(m => m.dressageConfig),
  'show_jumping': () => import('./showJumpingConfig').then(m => m.showJumpingConfig),
  'cutting': () => import('./cuttingConfig').then(m => m.cuttingConfig),
  'reining': () => import('./reiningConfig').then(m => m.reiningConfig),
  'hunter_jumper': () => import('./hunterJumperConfig').then(m => m.hunterJumperConfig),
  'eventing': () => import('./eventingConfig').then(m => m.eventingConfig)
};

// 📋 Discipline Metadata
export const disciplineMetadata = {
  barrel_racing: {
    name: 'Barrel Racing',
    category: 'speed_event',
    icon: 'Speed',
    description: 'High-speed precision sport requiring tight turns around barrels',
    competitionLevel: 'professional',
    primaryFocus: 'speed_and_agility',
    securityLevel: 'RESTRICTED'
  },
  dressage: {
    name: 'Dressage',
    category: 'classical_discipline',
    icon: 'EmojiEvents',
    description: 'Classical training and competition emphasizing harmony, precision, and athletic development',
    competitionLevel: 'olympic',
    primaryFocus: 'harmony_and_precision',
    securityLevel: 'CONFIDENTIAL'
  },
  show_jumping: {
    name: 'Show Jumping',
    category: 'jumping_sport',
    icon: 'FlightTakeoff',
    description: 'Precision jumping sport over a course of obstacles within time allowed',
    competitionLevel: 'olympic',
    primaryFocus: 'precision_and_speed',
    securityLevel: 'RESTRICTED'
  },
  cutting: {
    name: 'Cutting',
    category: 'western_working',
    icon: 'Pets',
    description: 'Working cow horse discipline demonstrating ability to separate and control cattle',
    competitionLevel: 'professional',
    primaryFocus: 'cow_sense_and_athleticism',
    securityLevel: 'RESTRICTED'
  },
  reining: {
    name: 'Reining',
    category: 'western_precision',
    icon: 'Cyclone',
    description: 'Western riding discipline demonstrating precise control through prescribed patterns',
    competitionLevel: 'olympic',
    primaryFocus: 'precision_and_control',
    securityLevel: 'RESTRICTED'
  },
  hunter_jumper: {
    name: 'Hunter/Jumper',
    category: 'english_style',
    icon: 'Terrain',
    description: 'English riding discipline emphasizing style, consistency, and smooth performance',
    competitionLevel: 'professional',
    primaryFocus: 'style_and_consistency',
    securityLevel: 'CONFIDENTIAL'
  },
  eventing: {
    name: 'Eventing',
    category: 'combined_training',
    icon: 'EmojiEvents',
    description: 'Three-phase equestrian sport combining dressage, cross-country, and show jumping',
    competitionLevel: 'olympic',
    primaryFocus: 'versatility_and_endurance',
    securityLevel: 'RESTRICTED'
  }
};

// 🔧 Utility Functions
export const getDisciplineConfig = async (disciplineKey: string) => {
  const loader = disciplineRegistry[disciplineKey as keyof typeof disciplineRegistry];
  if (!loader) {
    throw new Error(`Unknown discipline: ${disciplineKey}`);
  }
  return await loader();
};

export const getDisciplineMetadata = (disciplineKey: string) => {
  return disciplineMetadata[disciplineKey as keyof typeof disciplineMetadata];
};

export const getAllDisciplines = () => {
  return Object.keys(disciplineRegistry);
};

export const getDisciplinesByCategory = (category: string) => {
  return Object.entries(disciplineMetadata)
    .filter(([_, meta]) => meta.category === category)
    .map(([key, _]) => key);
};

export const getDisciplinesBySecurityLevel = (securityLevel: string) => {
  return Object.entries(disciplineMetadata)
    .filter(([_, meta]) => meta.securityLevel === securityLevel)
    .map(([key, _]) => key);
};

export const getDisciplinesByCompetitionLevel = (competitionLevel: string) => {
  return Object.entries(disciplineMetadata)
    .filter(([_, meta]) => meta.competitionLevel === competitionLevel)
    .map(([key, _]) => key);
};

// 🎯 Discipline Categories
export const disciplineCategories = {
  speed_event: ['barrel_racing'],
  classical_discipline: ['dressage'],
  jumping_sport: ['show_jumping'],
  western_working: ['cutting'],
  western_precision: ['reining'],
  english_style: ['hunter_jumper'],
  combined_training: ['eventing']
};

// 🔒 Security Classifications
export const securityClassifications = {
  RESTRICTED: ['barrel_racing', 'show_jumping', 'cutting', 'reining', 'eventing'],
  CONFIDENTIAL: ['dressage', 'hunter_jumper'],
  TOP_SECRET: [] // Reserved for specific data types within disciplines
};

// 🏆 Competition Levels
export const competitionLevels = {
  professional: ['barrel_racing', 'cutting', 'hunter_jumper'],
  olympic: ['dressage', 'show_jumping', 'reining', 'eventing']
};

// 🎨 Discipline Colors (from brandConfig)
export const disciplineColors = {
  barrel_racing: 'victoryRose',
  dressage: 'hunterGreen',
  show_jumping: 'arenaSand',
  cutting: 'stableMahogany',
  reining: 'victoryRose',
  hunter_jumper: 'hunterGreen',
  eventing: 'arenaSand'
};

// 📊 Default Configuration Template
export const defaultDisciplineTemplate = {
  discipline: {
    name: '',
    description: '',
    category: '',
    competitionLevel: '',
    icon: '',
    color: '',
    security: {
      dataClassification: 'INTERNAL',
      competitiveIntelligence: false,
      intellectualProperty: [],
      accessControl: 'public',
      retentionPolicy: '1_year',
      sharingRestrictions: []
    }
  },
  timing: {
    precision: 0.1,
    equipment: {}
  },
  aiCoaching: {
    enabled: true,
    realTimeAnalysis: {
      enabled: true,
      responseTime: 100,
      analysisDepth: 'basic',
      feedbackTypes: ['visual', 'audio']
    },
    coachingPrompts: {},
    securityLevel: 'INTERNAL'
  },
  competitionMode: {
    enabled: false,
    security: {
      dataClassification: 'INTERNAL',
      accessRestriction: 'public',
      realTimeEncryption: false,
      tamperDetection: false,
      auditLogging: 'basic'
    }
  }
};

// 🔍 Validation Functions
export const validateDisciplineConfig = (config: any): boolean => {
  const requiredFields = [
    'discipline.name',
    'discipline.description',
    'discipline.category',
    'timing.precision',
    'aiCoaching.enabled'
  ];
  
  return requiredFields.every(field => {
    const keys = field.split('.');
    let current = config;
    for (const key of keys) {
      if (current[key] === undefined) return false;
      current = current[key];
    }
    return true;
  });
};

export const getDisciplineSecurityLevel = (disciplineKey: string, dataType?: string): string => {
  const metadata = getDisciplineMetadata(disciplineKey);
  if (!metadata) return 'INTERNAL';
  
  // Return discipline-specific security level or default
  return metadata.securityLevel;
};

// 🚀 Performance Optimization
export const preloadDisciplineConfigs = async (disciplines: string[]) => {
  const promises = disciplines.map(discipline => getDisciplineConfig(discipline));
  return await Promise.all(promises);
};

// 📈 Analytics Support
export const getDisciplineAnalytics = () => {
  return {
    totalDisciplines: Object.keys(disciplineRegistry).length,
    categoryCounts: Object.entries(disciplineCategories).reduce((acc, [category, disciplines]) => {
      acc[category] = disciplines.length;
      return acc;
    }, {} as Record<string, number>),
    securityLevelCounts: Object.entries(securityClassifications).reduce((acc, [level, disciplines]) => {
      acc[level] = disciplines.length;
      return acc;
    }, {} as Record<string, number>),
    competitionLevelCounts: Object.entries(competitionLevels).reduce((acc, [level, disciplines]) => {
      acc[level] = disciplines.length;
      return acc;
    }, {} as Record<string, number>)
  };
}; 