import { brandConfig } from './brandConfig';

// ============================================================================
// HORSE AI MONITOR CONFIGURATION
// ============================================================================
// Adapted from dog monitoring for equine care and behavior analysis

export interface IHorseData {
  horseId: string;
  horseName: string;
  age: number;
  breed: string;
  weight: number; // pounds
  lastUpdated: Date;
  healthMetrics: HorseHealthMetrics;
  behavioralMetrics: HorseBehavioralMetrics;
  activityMetrics: HorseActivityMetrics;
}

export interface HorseHealthMetrics {
  vitals: {
    heartRate: number; // 28-44 bpm normal for horses
    temperature: number; // 99-101°F normal
    respiratoryRate: number; // 8-16 breaths/min
    weight: number;
  };
  feeding: {
    schedule: string[];
    hayIntake: number; // lbs per day
    grainIntake: number; // lbs per day
    waterConsumption: number; // gallons per day
    appetite: 'excellent' | 'good' | 'fair' | 'poor';
  };
  mobility: {
    gait: 'sound' | 'slightly_off' | 'lame' | 'severely_lame';
    movementWillingness: 'eager' | 'normal' | 'reluctant' | 'resistant';
    stiffness: 'none' | 'mild' | 'moderate' | 'severe';
    overallMobility: number; // 0-1 score
  };
  rest: {
    lyingDownFrequency: number; // times per day
    sleepQuality: 'restful' | 'restless' | 'interrupted';
    preferredRestPositions: string[];
    restDuration: number; // hours per day
  };
}

export interface HorseBehavioralMetrics {
  patterns: {
    socialBehavior: 'dominant' | 'submissive' | 'neutral' | 'isolated';
    responseToHumans: 'friendly' | 'neutral' | 'cautious' | 'fearful';
    vocalizations: 'normal' | 'increased' | 'decreased' | 'distressed';
    playfulness: 'high' | 'moderate' | 'low' | 'none';
  };
  stressIndicators: string[];
  environmentalResponse: {
    adaptability: number; // 0-1 score
    alertness: number; // 0-1 score
    curiosity: boolean;
    anxietyLevel: number; // 0-1 score
  };
  anomalies: HorseBehaviorAnomaly[];
}

export interface HorseActivityMetrics {
  dailyMovement: number; // estimated distance in feet
  grazingDuration: number; // minutes per day
  exerciseIntensity: number; // 0-1 score
  restPeriods: number;
  energyLevel: 'very_high' | 'high' | 'moderate' | 'low' | 'very_low';
}

export interface HorseBehaviorAnomaly {
  type: 'feeding' | 'mobility' | 'rest' | 'social' | 'respiratory' | 'neurological';
  severity: number; // 0-1
  description: string;
  detectedAt: Date;
  possibleCauses: string[];
}

// Horse AI Monitor Configuration
export const horseMonitorConfig = {
  // Camera Configuration for Stable/Paddock Horse Monitoring
  cameras: {
    stall: {
      name: "Stall Camera",
      location: "individual_stall",
      angles: ["wide_angle", "corner_view"],
      features: ["motion_detection", "night_vision", "audio"],
      aiProcessing: true,
      monitoringZones: ["feeding_area", "water_area", "resting_area", "door_area"]
    },
    paddock: {
      name: "Paddock Camera", 
      location: "outdoor_paddock",
      angles: ["field_overview", "shelter_view"],
      features: ["weather_resistant", "motion_tracking", "zoom"],
      aiProcessing: true,
      monitoringZones: ["grazing_area", "water_source", "shelter", "fence_line"]
    },
    arena: {
      name: "Training Arena Camera",
      location: "training_area", 
      angles: ["arena_overview", "gate_view"],
      features: ["high_resolution", "motion_tracking", "pan_tilt"],
      aiProcessing: true,
      monitoringZones: ["center_arena", "rail", "entrance", "equipment_area"]
    },
    barn_aisle: {
      name: "Barn Aisle Camera",
      location: "barn_corridor",
      angles: ["aisle_length", "cross_ties"],
      features: ["wide_angle", "motion_detection"],
      aiProcessing: true,
      monitoringZones: ["cross_tie_area", "feed_room", "tack_area", "entrance"]
    }
  },

  // Horse-Specific Behavior Patterns
  behavior: {
    patterns: [
      {
        id: 'feeding',
        name: 'Feeding and Grazing Behavior',
        description: 'Normal eating patterns and appetite for horses',
        indicators: ['hay_consumption', 'grain_eating', 'water_intake', 'grazing_time'],
        normalFrequency: { min: 12, max: 16, unit: 'hours_grazing_per_day' },
        alertConditions: [
          { type: 'frequency', operator: 'lt', value: 8, timeWindow: 24, consecutiveOccurrences: 1 },
          { type: 'duration', operator: 'gt', value: 60, timeWindow: 120, consecutiveOccurrences: 2 } // too long at feed
        ]
      },
      {
        id: 'lameness',
        name: 'Lameness and Gait Analysis',
        description: 'Monitoring for lameness, injury, and movement abnormalities',
        indicators: ['head_bobbing', 'uneven_stride', 'weight_shifting', 'reluctance_to_move'],
        normalFrequency: { min: 0, max: 0, unit: 'lameness_episodes' },
        alertConditions: [
          { type: 'gait_irregularity', operator: 'detected', value: 1, timeWindow: 60, consecutiveOccurrences: 1 },
          { type: 'head_bobbing', operator: 'gt', value: 3, timeWindow: 300, consecutiveOccurrences: 1 }
        ]
      },
      {
        id: 'rest_patterns',
        name: 'Rest and Lying Behavior',
        description: 'Monitoring sleep patterns and lying down frequency',
        indicators: ['lying_duration', 'lying_frequency', 'sleep_position', 'restlessness'],
        normalFrequency: { min: 2, max: 6, unit: 'lying_episodes_per_day' },
        alertConditions: [
          { type: 'excessive_lying', operator: 'gt', value: 12, timeWindow: 1440, consecutiveOccurrences: 1 }, // >12 hours lying
          { type: 'inability_to_lie', operator: 'lt', value: 1, timeWindow: 1440, consecutiveOccurrences: 2 } // no lying episodes
        ]
      },
      {
        id: 'respiratory',
        name: 'Respiratory Monitoring',
        description: 'Detecting respiratory distress and breathing abnormalities',
        indicators: ['breathing_rate', 'nostril_flare', 'abdominal_effort', 'head_extension'],
        alertConditions: [
          { type: 'elevated_breathing', operator: 'gt', value: 20, timeWindow: 60, consecutiveOccurrences: 2 },
          { type: 'labored_breathing', operator: 'detected', value: 1, timeWindow: 60, consecutiveOccurrences: 1 }
        ]
      },
      {
        id: 'colic_signs',
        name: 'Colic and Digestive Distress',
        description: 'Early detection of colic and digestive issues',
        indicators: ['pawing', 'looking_at_flank', 'rolling', 'restlessness', 'sweating'],
        alertConditions: [
          { type: 'pawing', operator: 'gt', value: 5, timeWindow: 60, consecutiveOccurrences: 1 },
          { type: 'flank_watching', operator: 'gt', value: 3, timeWindow: 30, consecutiveOccurrences: 1 },
          { type: 'rolling_attempts', operator: 'detected', value: 1, timeWindow: 60, consecutiveOccurrences: 1 }
        ]
      }
    ],
    anomalyDetection: true,
    learningPeriodDays: 14, // Horses need longer to establish patterns
    sensitivity: 'high', // High sensitivity for early problem detection
    categories: [
      {
        id: 'lameness_indicators',
        name: 'Lameness and Injury Indicators',
        description: 'Signs of lameness, injury, or movement abnormalities',
        behaviors: ['head_bobbing', 'uneven_gait', 'weight_shifting', 'reluctance_to_move', 'shortened_stride'],
        severity: 'high'
      },
      {
        id: 'colic_emergency',
        name: 'Colic and Emergency Signs',
        description: 'Critical signs requiring immediate veterinary attention',
        behaviors: ['violent_rolling', 'excessive_pawing', 'sweating', 'rapid_breathing', 'looking_at_flank'],
        severity: 'urgent'
      },
      {
        id: 'respiratory_distress',
        name: 'Respiratory Issues',
        description: 'Signs of breathing difficulties or respiratory disease',
        behaviors: ['labored_breathing', 'nostril_flare', 'extended_head', 'reluctance_to_move'],
        severity: 'high'
      },
      {
        id: 'behavioral_changes',
        name: 'Behavioral and Social Changes',
        description: 'Changes in normal behavior patterns',
        behaviors: ['isolation', 'aggression', 'depression', 'changed_appetite', 'restlessness'],
        severity: 'medium'
      }
    ]
  },

  // Health Risk Analysis for Horses
  healthAnalysis: {
    riskFactors: {
      lameness: {
        indicators: ['head_bobbing', 'uneven_stride', 'weight_shifting', 'reluctance_to_move'],
        threshold: 0.7,
        urgency: 'high' as const
      },
      colic: {
        indicators: ['pawing', 'flank_watching', 'rolling', 'sweating', 'rapid_breathing'],
        threshold: 0.8,
        urgency: 'urgent' as const
      },
      respiratory_distress: {
        indicators: ['labored_breathing', 'nostril_flare', 'head_extension', 'abdominal_breathing'],
        threshold: 0.7,
        urgency: 'high' as const
      },
      neurological: {
        indicators: ['head_tilt', 'incoordination', 'circling', 'abnormal_stance'],
        threshold: 0.8,
        urgency: 'urgent' as const
      },
      metabolic_issues: {
        indicators: ['excessive_drinking', 'frequent_urination', 'weight_loss', 'lethargy'],
        threshold: 0.6,
        urgency: 'medium' as const
      }
    },
    vitalRanges: {
      heartRate: { min: 28, max: 44, unit: 'bpm' },
      respiratoryRate: { min: 8, max: 16, unit: 'breaths/min' },
      temperature: { min: 99, max: 101, unit: '°F' },
      bodyConditionScore: { min: 4, max: 7, unit: 'BCS 1-9' }
    }
  },

  // Monitoring Zones and Areas
  monitoringZones: {
    stall: {
      feedingArea: { x: 0.1, y: 0.1, width: 0.3, height: 0.3 },
      waterArea: { x: 0.7, y: 0.1, width: 0.2, height: 0.2 },
      restingArea: { x: 0.2, y: 0.5, width: 0.6, height: 0.4 },
      doorArea: { x: 0.4, y: 0.0, width: 0.2, height: 0.1 }
    },
    paddock: {
      grazingArea: { x: 0.1, y: 0.2, width: 0.8, height: 0.6 },
      waterSource: { x: 0.8, y: 0.1, width: 0.1, height: 0.1 },
      shelter: { x: 0.0, y: 0.0, width: 0.3, height: 0.2 },
      fenceLine: { x: 0.0, y: 0.0, width: 1.0, height: 0.1 }
    }
  },

  // Alert Configuration
  alerts: {
    immediate: [
      { condition: 'colic_signs', message: '🚨 COLIC ALERT: Immediate veterinary attention required!' },
      { condition: 'severe_lameness', message: '🚨 SEVERE LAMENESS: Horse unable to bear weight!' },
      { condition: 'respiratory_emergency', message: '🚨 BREATHING EMERGENCY: Severe respiratory distress!' },
      { condition: 'neurological_emergency', message: '🚨 NEUROLOGICAL EMERGENCY: Abnormal neurological signs!' }
    ],
    urgent: [
      { condition: 'mild_lameness', message: '⚠️ LAMENESS DETECTED: Monitor closely, consider vet evaluation' },
      { condition: 'digestive_upset', message: '⚠️ DIGESTIVE CONCERNS: Watch for colic development' },
      { condition: 'respiratory_concerns', message: '⚠️ BREATHING CHANGES: Monitor respiratory effort' }
    ],
    monitoring: [
      { condition: 'behavioral_change', message: 'ℹ️ BEHAVIOR CHANGE: Unusual behavior pattern detected' },
      { condition: 'activity_change', message: 'ℹ️ ACTIVITY CHANGE: Different activity level observed' },
      { condition: 'feeding_change', message: 'ℹ️ FEEDING CHANGE: Appetite or eating pattern changed' }
    ]
  },

  // AI Analysis Configuration
  aiAnalysis: {
    confidenceThresholds: {
      lameness: 0.7,
      colic: 0.8,
      respiratory: 0.7,
      behavioral: 0.6
    },
    requiredDataPoints: {
      lameness: ['gait_analysis', 'weight_distribution', 'movement_willingness'],
      colic: ['abdominal_position', 'pawing_frequency', 'flank_watching'],
      respiratory: ['breathing_rate', 'nostril_position', 'abdominal_effort']
    },
    analysisIntervals: {
      realtime: 10000, // 10 seconds for critical monitoring
      standard: 30000, // 30 seconds for normal monitoring
      efficient: 60000, // 60 seconds for cost-effective monitoring
      emergency: 5000   // 5 seconds during emergency situations
    }
  },

  // Integration with existing systems
  integration: {
    veterinaryRecords: true,
    feedingSchedule: true,
    exerciseTracking: true,
    healthMetrics: true,
    alertNotifications: true
  }
};

// Generate mock horse data for testing
export function generateMockHorseData(horseId: string): IHorseData {
  const breeds = ['Thoroughbred', 'Quarter Horse', 'Arabian', 'Warmblood', 'Paint Horse', 'Appaloosa'];
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  
  return {
    horseId,
    horseName: `Horse_${horseId}`,
    age: Math.floor(Math.random() * 20) + 3, // 3-23 years
    breed: randomBreed,
    weight: Math.floor(Math.random() * 400) + 800, // 800-1200 lbs
    lastUpdated: new Date(),
    healthMetrics: {
      vitals: {
        heartRate: Math.floor(Math.random() * 16) + 28, // 28-44 bpm
        temperature: 99 + Math.random() * 2, // 99-101°F
        respiratoryRate: Math.floor(Math.random() * 8) + 8, // 8-16 breaths/min
        weight: Math.floor(Math.random() * 400) + 800
      },
      feeding: {
        schedule: ['6:00 AM', '12:00 PM', '6:00 PM'],
        hayIntake: Math.floor(Math.random() * 10) + 15, // 15-25 lbs
        grainIntake: Math.floor(Math.random() * 5) + 3, // 3-8 lbs
        waterConsumption: Math.floor(Math.random() * 5) + 8, // 8-13 gallons
        appetite: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as 'excellent' | 'good' | 'fair'
      },
      mobility: {
        gait: ['sound', 'slightly_off'][Math.floor(Math.random() * 2)] as 'sound' | 'slightly_off',
        movementWillingness: ['eager', 'normal'][Math.floor(Math.random() * 2)] as 'eager' | 'normal',
        stiffness: ['none', 'mild'][Math.floor(Math.random() * 2)] as 'none' | 'mild',
        overallMobility: 0.7 + Math.random() * 0.3 // 0.7-1.0
      },
      rest: {
        lyingDownFrequency: Math.floor(Math.random() * 4) + 2, // 2-6 times
        sleepQuality: ['restful', 'restless'][Math.floor(Math.random() * 2)] as 'restful' | 'restless',
        preferredRestPositions: ['sternal', 'lateral'],
        restDuration: Math.floor(Math.random() * 6) + 3 // 3-9 hours
      }
    },
    behavioralMetrics: {
      patterns: {
        socialBehavior: ['dominant', 'neutral', 'submissive'][Math.floor(Math.random() * 3)] as 'dominant' | 'neutral' | 'submissive',
        responseToHumans: ['friendly', 'neutral'][Math.floor(Math.random() * 2)] as 'friendly' | 'neutral',
        vocalizations: 'normal' as const,
        playfulness: ['moderate', 'low'][Math.floor(Math.random() * 2)] as 'moderate' | 'low'
      },
      stressIndicators: Math.random() > 0.7 ? ['weaving', 'pacing'] : [],
      environmentalResponse: {
        adaptability: 0.6 + Math.random() * 0.4,
        alertness: 0.7 + Math.random() * 0.3,
        curiosity: Math.random() > 0.5,
        anxietyLevel: Math.random() * 0.3
      },
      anomalies: []
    },
    activityMetrics: {
      dailyMovement: Math.floor(Math.random() * 2000) + 1000,
      grazingDuration: Math.floor(Math.random() * 360) + 480, // 8-14 hours
      exerciseIntensity: 0.3 + Math.random() * 0.4,
      restPeriods: Math.floor(Math.random() * 8) + 4,
      energyLevel: ['moderate', 'high'][Math.floor(Math.random() * 2)] as 'moderate' | 'high'
    }
  };
}

// Utility functions for horse monitoring
export const horseMonitorUtils = {
  /**
   * Assess overall horse health score
   */
  assessHealthScore: (horse: IHorseData): number => {
    const mobilityScore = horse.healthMetrics.mobility.overallMobility * 30;
    const vitalScore = (horse.healthMetrics.vitals.heartRate >= 28 && horse.healthMetrics.vitals.heartRate <= 44) ? 25 : 10;
    const appetiteScore = horse.healthMetrics.feeding.appetite === 'excellent' ? 25 : 
                         horse.healthMetrics.feeding.appetite === 'good' ? 20 : 10;
    const behaviorScore = horse.behavioralMetrics.stressIndicators.length === 0 ? 20 : 10;
    
    return Math.min(100, mobilityScore + vitalScore + appetiteScore + behaviorScore);
  },

  /**
   * Determine monitoring priority
   */
  getMonitoringPriority: (horse: IHorseData): 'low' | 'medium' | 'high' | 'urgent' => {
    const healthScore = horseMonitorUtils.assessHealthScore(horse);
    
    if (healthScore < 50) return 'urgent';
    if (healthScore < 70) return 'high';
    if (healthScore < 85) return 'medium';
    return 'low';
  },

  /**
   * Generate monitoring recommendations
   */
  getMonitoringRecommendations: (horse: IHorseData): string[] => {
    const recommendations: string[] = [];
    
    if (horse.healthMetrics.mobility.gait !== 'sound') {
      recommendations.push('Monitor for lameness - consider veterinary evaluation');
    }
    
    if (horse.healthMetrics.feeding.appetite !== 'excellent') {
      recommendations.push('Monitor feeding behavior - watch for digestive issues');
    }
    
    if (horse.behavioralMetrics.stressIndicators.length > 0) {
      recommendations.push('Address stress indicators - evaluate environment');
    }
    
    if (horse.healthMetrics.vitals.heartRate > 44) {
      recommendations.push('Elevated heart rate - monitor for stress or illness');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue routine monitoring');
    }
    
    return recommendations;
  }
}; 