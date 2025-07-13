import { brandConfig } from './brandConfig';

// ============================================================================
// SENIOR DOG AI MONITOR CONFIGURATION
// ============================================================================
// Adapted from horse monitoring for senior dog care and behavior analysis

export interface IDogData {
  dogId: string;
  dogName: string;
  age: number;
  breed: string;
  weight: number;
  lastUpdated: Date;
  healthMetrics: DogHealthMetrics;
  behavioralMetrics: DogBehavioralMetrics;
  activityMetrics: DogActivityMetrics;
}

export interface DogHealthMetrics {
  vitals: {
    heartRate: number; // 60-160 bpm normal for dogs
    temperature: number; // 101-102.5°F normal
    respiratoryRate: number; // 10-30 breaths/min
    weight: number;
  };
  feeding: {
    schedule: string[];
    mealSize: number; // cups per meal
    waterConsumption: number; // oz per day
    appetite: 'excellent' | 'good' | 'fair' | 'poor';
  };
  mobility: {
    walkingGait: 'normal' | 'stiff' | 'limping' | 'reluctant';
    stairClimbing: 'easy' | 'difficult' | 'avoided';
    jumpingAbility: 'normal' | 'reduced' | 'unable';
    overallMobility: number; // 0-1 score
  };
  sleep: {
    nightSleepHours: number;
    napCount: number;
    sleepQuality: 'restful' | 'restless' | 'interrupted';
    favoriteSleepSpots: string[];
  };
}

export interface DogBehavioralMetrics {
  patterns: {
    socialBehavior: 'friendly' | 'withdrawn' | 'aggressive' | 'anxious';
    responseToFamily: 'eager' | 'normal' | 'disinterested';
    vocalization: 'normal' | 'increased' | 'decreased' | 'excessive';
    playfulness: 'high' | 'moderate' | 'low' | 'none';
  };
  stressIndicators: string[];
  cognitiveFunction: {
    recognition: number; // 0-1 score
    responsiveness: number; // 0-1 score
    confusion: boolean;
    disorientation: boolean;
  };
  anomalies: DogBehaviorAnomaly[];
}

export interface DogActivityMetrics {
  dailySteps: number;
  walkDuration: number; // minutes
  restPeriods: number;
  energyLevel: 'high' | 'moderate' | 'low' | 'very_low';
  exerciseIntensity: number; // 0-1 score
}

export interface DogBehaviorAnomaly {
  type: 'feeding' | 'activity' | 'sleep' | 'social' | 'mobility' | 'cognitive';
  severity: number; // 0-1
  description: string;
  detectedAt: Date;
  possibleCauses: string[];
}

// Senior Dog AI Monitor Configuration
export const seniorDogMonitorConfig = {
  // Camera Configuration for Indoor Dog Monitoring
  cameras: {
    livingRoom: {
      name: "Living Room Camera",
      location: "main_living_area",
      angles: ["wide_angle"],
      features: ["motion_detection", "night_vision", "audio"],
      aiProcessing: true,
      monitoringZones: ["sleeping_area", "food_area", "play_area"]
    },
    kitchen: {
      name: "Kitchen/Feeding Camera", 
      location: "feeding_area",
      angles: ["feeding_station"],
      features: ["meal_detection", "water_monitoring"],
      aiProcessing: true,
      monitoringZones: ["food_bowl", "water_bowl"]
    },
    backyard: {
      name: "Backyard Camera",
      location: "outdoor_area", 
      angles: ["yard_overview"],
      features: ["weather_resistant", "motion_tracking"],
      aiProcessing: true,
      monitoringZones: ["exercise_area", "bathroom_area"]
    }
  },

  // Dog-Specific Behavior Patterns
  behavior: {
    patterns: [
      {
        id: 'feeding',
        name: 'Feeding Behavior',
        description: 'Normal eating patterns and appetite for senior dogs',
        indicators: ['meal_completion', 'eating_speed', 'water_intake', 'post_meal_behavior'],
        normalFrequency: { min: 2, max: 3, unit: 'meals_per_day' },
        alertConditions: [
          { type: 'frequency', operator: 'lt', value: 1, timeWindow: 24, consecutiveOccurrences: 1 },
          { type: 'duration', operator: 'gt', value: 30, timeWindow: 60, consecutiveOccurrences: 2 } // took too long to eat
        ]
      },
      {
        id: 'mobility',
        name: 'Mobility and Movement',
        description: 'Monitoring arthritis, joint pain, and general mobility issues',
        indicators: ['walking_gait', 'stair_usage', 'jumping_attempts', 'lying_down_difficulty'],
        normalFrequency: { min: 3, max: 8, unit: 'walks_per_day' },
        alertConditions: [
          { type: 'gait_change', operator: 'detected', value: 1, timeWindow: 60, consecutiveOccurrences: 1 },
          { type: 'reluctance', operator: 'gt', value: 2, timeWindow: 120, consecutiveOccurrences: 1 }
        ]
      },
      {
        id: 'sleep',
        name: 'Sleep Patterns',
        description: 'Senior dog sleep quality and duration monitoring',
        indicators: ['night_sleep_duration', 'restlessness', 'nap_frequency', 'sleep_location_changes'],
        normalFrequency: { min: 12, max: 18, unit: 'hours_per_day' },
        alertConditions: [
          { type: 'restlessness', operator: 'gt', value: 5, timeWindow: 480, consecutiveOccurrences: 2 }, // 5+ interruptions in 8 hours
          { type: 'insomnia', operator: 'lt', value: 10, timeWindow: 1440, consecutiveOccurrences: 1 } // less than 10 hours in 24h
        ]
      },
      {
        id: 'cognitive',
        name: 'Cognitive Function',
        description: 'Early detection of canine cognitive dysfunction',
        indicators: ['response_to_name', 'confusion_episodes', 'routine_disruption', 'disorientation'],
        alertConditions: [
          { type: 'confusion', operator: 'gt', value: 2, timeWindow: 480, consecutiveOccurrences: 1 },
          { type: 'disorientation', operator: 'detected', value: 1, timeWindow: 60, consecutiveOccurrences: 1 }
        ]
      }
    ],
    anomalyDetection: true,
    learningPeriodDays: 7, // Dogs adapt faster than horses
    sensitivity: 'high', // Senior dogs need more sensitive monitoring
    categories: [
      {
        id: 'arthritis_pain',
        name: 'Arthritis and Pain Indicators',
        description: 'Signs of joint pain, stiffness, and mobility issues',
        behaviors: ['stiff_walking', 'difficulty_rising', 'reluctance_to_move', 'limping'],
        severity: 'high'
      },
      {
        id: 'cognitive_decline',
        name: 'Cognitive Decline Signs',
        description: 'Early indicators of canine cognitive dysfunction',
        behaviors: ['confusion', 'disorientation', 'staring_at_walls', 'forgetting_routines'],
        severity: 'medium'
      },
      {
        id: 'illness_indicators',
        name: 'General Illness Indicators',
        description: 'Signs that may indicate illness or health issues',
        behaviors: ['lethargy', 'loss_of_appetite', 'excessive_thirst', 'unusual_vocalization'],
        severity: 'high'
      }
    ]
  },

  // Health Risk Analysis for Senior Dogs
  healthAnalysis: {
    riskFactors: {
      arthritis: {
        indicators: ['mobility_reduction', 'stiffness_after_rest', 'reluctance_to_exercise'],
        threshold: 0.6,
        urgency: 'medium' as const
      },
      cognitive_dysfunction: {
        indicators: ['confusion_episodes', 'routine_disruption', 'disorientation', 'anxiety_increase'],
        threshold: 0.7,
        urgency: 'high' as const
      },
      heart_disease: {
        indicators: ['exercise_intolerance', 'breathing_difficulty', 'coughing', 'lethargy'],
        threshold: 0.8,
        urgency: 'critical' as const
      },
      kidney_disease: {
        indicators: ['increased_thirst', 'frequent_urination', 'appetite_loss', 'weight_loss'],
        threshold: 0.75,
        urgency: 'high' as const
      }
    }
  },

  // Emergency Alert System for Dogs
  alerts: {
    emergency: {
      fall_detected: {
        severity: 'critical',
        responseTime: 30, // seconds
        actions: ['immediate_check', 'veterinary_contact'],
        description: 'Dog appears to have fallen and is not getting up'
      },
      seizure_detected: {
        severity: 'critical', 
        responseTime: 15,
        actions: ['immediate_attention', 'emergency_vet_call'],
        description: 'Possible seizure activity detected'
      },
      breathing_distress: {
        severity: 'critical',
        responseTime: 30,
        actions: ['immediate_check', 'emergency_vet_call'],
        description: 'Labored or distressed breathing detected'
      }
    },
    health: {
      prolonged_lethargy: {
        severity: 'high',
        responseTime: 120, // 2 minutes
        actions: ['wellness_check', 'schedule_vet_visit'],
        description: 'Dog has been inactive for an unusual period'
      },
      appetite_loss: {
        severity: 'medium',
        responseTime: 300, // 5 minutes
        actions: ['check_food_water', 'monitor_closely'],
        description: 'Dog has not eaten in expected timeframe'
      },
      mobility_issue: {
        severity: 'medium',
        responseTime: 180,
        actions: ['assess_comfort', 'consider_pain_management'],
        description: 'Changes in walking or movement detected'
      }
    }
  },

  // AI Processing Configuration
  aiProcessing: {
    videoAnalysis: {
      frameRate: 1, // Process 1 frame per second for efficiency
      objectDetection: ['dog', 'food_bowl', 'water_bowl', 'favorite_spots'],
      behaviorRecognition: ['eating', 'drinking', 'sleeping', 'walking', 'playing', 'resting'],
      postureAnalysis: true,
      gaitAnalysis: true,
      faceRecognition: true // For individual dog identification
    },
    alertThresholds: {
      inactivity: 4 * 60 * 60, // 4 hours of complete inactivity
      feeding_delay: 2 * 60 * 60, // 2 hours past normal feeding time
      unusual_behavior: 0.8, // 80% confidence threshold
      emergency_detection: 0.9 // 90% confidence for emergency alerts
    }
  },

  // Dashboard Configuration
  dashboard: {
    refreshInterval: 30000, // 30 seconds
    maxAlertsDisplay: 10,
    widgets: [
      'live_camera_feed',
      'recent_alerts', 
      'daily_activity_summary',
      'feeding_tracker',
      'sleep_quality',
      'mobility_assessment',
      'cognitive_health'
    ]
  },

  // Styling (using your existing brand config)
  styling: {
    primaryColor: brandConfig.colors.stableMahogany,
    alertColors: {
      critical: brandConfig.colors.errorRed,
      high: brandConfig.colors.alertAmber, 
      medium: brandConfig.colors.infoBlue,
      low: brandConfig.colors.hunterGreen
    },
    icons: {
      dog: '🐕',
      feeding: '🍽️',
      sleeping: '😴',
      walking: '🚶',
      health: '❤️',
      alert: '🚨'
    }
  }
};

// Mock Senior Dog Data Generator
export function generateMockDogData(dogId: string): IDogData {
  const breeds = ['Golden Retriever', 'Labrador', 'German Shepherd', 'Border Collie', 'Mixed Breed'];
  const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
  
  return {
    dogId,
    dogName: `${dogId === 'dog-001' ? 'Buddy' : dogId === 'dog-002' ? 'Luna' : 'Max'}`,
    age: Math.floor(Math.random() * 6) + 8, // 8-14 years (senior dogs)
    breed: randomBreed,
    weight: Math.floor(Math.random() * 40) + 45, // 45-85 lbs
    lastUpdated: new Date(),
    healthMetrics: {
      vitals: {
        heartRate: Math.floor(Math.random() * 40) + 80, // 80-120 bpm
        temperature: Math.random() * 1.5 + 101, // 101-102.5°F
        respiratoryRate: Math.floor(Math.random() * 15) + 15, // 15-30 breaths/min
        weight: Math.floor(Math.random() * 40) + 45
      },
      feeding: {
        schedule: ['7:00 AM', '6:00 PM'],
        mealSize: Math.random() * 1 + 1.5, // 1.5-2.5 cups
        waterConsumption: Math.floor(Math.random() * 20) + 30, // 30-50 oz
        appetite: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any
      },
      mobility: {
        walkingGait: ['normal', 'stiff', 'limping', 'reluctant'][Math.floor(Math.random() * 4)] as any,
        stairClimbing: ['easy', 'difficult', 'avoided'][Math.floor(Math.random() * 3)] as any,
        jumpingAbility: ['normal', 'reduced', 'unable'][Math.floor(Math.random() * 3)] as any,
        overallMobility: Math.random() * 0.4 + 0.6 // 0.6-1.0 for seniors
      },
      sleep: {
        nightSleepHours: Math.floor(Math.random() * 4) + 8, // 8-12 hours
        napCount: Math.floor(Math.random() * 4) + 2, // 2-6 naps
        sleepQuality: ['restful', 'restless', 'interrupted'][Math.floor(Math.random() * 3)] as any,
        favoriteSleepSpots: ['dog_bed', 'couch', 'floor_by_owner']
      }
    },
    behavioralMetrics: {
      patterns: {
        socialBehavior: ['friendly', 'withdrawn', 'aggressive', 'anxious'][Math.floor(Math.random() * 4)] as any,
        responseToFamily: ['eager', 'normal', 'disinterested'][Math.floor(Math.random() * 3)] as any,
        vocalization: ['normal', 'increased', 'decreased', 'excessive'][Math.floor(Math.random() * 4)] as any,
        playfulness: ['high', 'moderate', 'low', 'none'][Math.floor(Math.random() * 4)] as any
      },
      stressIndicators: Math.random() > 0.7 ? ['pacing', 'whining', 'hiding'] : [],
      cognitiveFunction: {
        recognition: Math.random() * 0.3 + 0.7, // 0.7-1.0
        responsiveness: Math.random() * 0.3 + 0.7,
        confusion: Math.random() > 0.8,
        disorientation: Math.random() > 0.9
      },
      anomalies: []
    },
    activityMetrics: {
      dailySteps: Math.floor(Math.random() * 3000) + 2000, // 2000-5000 steps (lower for seniors)
      walkDuration: Math.floor(Math.random() * 60) + 30, // 30-90 minutes
      restPeriods: Math.floor(Math.random() * 8) + 12, // 12-20 rest periods
      energyLevel: ['high', 'moderate', 'low', 'very_low'][Math.floor(Math.random() * 4)] as any,
      exerciseIntensity: Math.random() * 0.4 + 0.3 // 0.3-0.7 (lower for seniors)
    }
  };
} 