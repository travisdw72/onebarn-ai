import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const reiningConfig = {
  // 🌪️ Discipline Information
  discipline: {
    name: 'Reining',
    description: 'Western riding discipline demonstrating precise control through prescribed patterns',
    category: 'western_precision',
    competitionLevel: 'olympic',
    icon: 'Cyclone',
    color: brandConfig.colors.victoryRose,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'RESTRICTED', // Pattern execution and training methods are valuable
      competitiveIntelligence: true,
      intellectualProperty: ['training_techniques', 'pattern_strategies', 'maneuver_development'],
      accessControl: 'trainer_rider_judge',
      retentionPolicy: '4_years',
      sharingRestrictions: ['no_competitors', 'bloodline_protection']
    }
  },

  // ⏱️ Pattern Timing System
  timing: {
    precision: 0.1, // 100ms precision for maneuver timing
    patterns: {
      pattern_1: {
        name: 'NRHA Pattern 1',
        description: 'Beginning with large fast circles',
        maneuvers: [
          'run_large_fast_circles_right',
          'run_large_fast_circles_left', 
          'run_small_slow_circles_right',
          'run_small_slow_circles_left',
          'change_leads_center',
          'run_large_fast_circles_right',
          'run_large_fast_circles_left',
          'run_small_slow_circles_right',
          'run_small_slow_circles_left',
          'change_leads_center',
          'begin_rundown',
          'sliding_stop',
          'back_up',
          '360_spin_right',
          '360_spin_left',
          'hesitate_to_demonstrate_completion'
        ],
        totalTime: { min: 180, max: 300, optimal: 240 }, // seconds
        securityLevel: 'RESTRICTED'
      },
      // Additional patterns would be defined similarly
    },
    
    // Competition Standards
    competitionStandards: {
      scoreRange: { min: 0, max: 80, passing: 60 },
      maneuverScores: { min: -1.5, max: 2, increment: 0.5 },
      penalties: {
        minor: -0.5,
        major: -1.0,
        severe: -2.0,
        disqualification: 0
      }
    },
    
    // Timing Equipment
    equipment: {
      patternTimer: {
        type: 'competition_timer',
        accuracy: 0.1,
        visibility: 'judge_only',
        encryption: true
      },
      videoAnalysis: {
        cameras: {
          center: { position: 'arena_center', coverage: '360_degree' },
          corners: { count: 4, coverage: 'corner_work' },
          fence: { position: 'long_side', coverage: 'rundowns' }
        },
        frameRate: 120, // High speed for spins and stops
        resolution: '4K',
        encryption: 'AES-256'
      }
    }
  },

  // 🎯 Maneuver Analysis
  maneuvers: {
    circles: {
      large_fast: {
        name: 'Large Fast Circles',
        diameter: { min: 50, max: 60, optimal: 55 }, // feet
        speed: { min: 'lope', target: 'hand_gallop' },
        shape: 'perfectly_round',
        cadence: 'consistent',
        qualityFactors: ['speed', 'shape', 'cadence', 'control'],
        commonFaults: ['egg_shaped', 'speed_variation', 'loss_of_gait'],
        securityLevel: 'CONFIDENTIAL'
      },
      small_slow: {
        name: 'Small Slow Circles',
        diameter: { min: 20, max: 30, optimal: 25 },
        speed: 'collected_lope',
        shape: 'perfectly_round',
        cadence: 'slow_and_controlled',
        qualityFactors: ['collection', 'shape', 'cadence', 'smoothness'],
        commonFaults: ['too_fast', 'loss_of_collection', 'irregular_shape'],
        securityLevel: 'CONFIDENTIAL'
      }
    },
    
    leadChanges: {
      flying_change: {
        name: 'Flying Lead Change',
        execution: 'simultaneous_front_and_hind',
        timing: 'precise_moment',
        location: 'center_of_arena',
        preparation: 'straight_approach',
        qualityFactors: ['timing', 'straightness', 'smoothness', 'precision'],
        commonFaults: ['late_behind', 'crooked', 'rough_transition'],
        securityLevel: 'RESTRICTED'
      }
    },
    
    rundowns: {
      straight_rundown: {
        name: 'Straight Rundown',
        distance: { min: 100, max: 150, optimal: 125 }, // feet
        speed: 'maximum_controlled',
        straightness: 'perfectly_straight',
        acceleration: 'gradual_to_maximum',
        qualityFactors: ['speed', 'straightness', 'control', 'acceleration'],
        commonFaults: ['crooked', 'insufficient_speed', 'loss_of_control'],
        securityLevel: 'RESTRICTED'
      }
    },
    
    stops: {
      sliding_stop: {
        name: 'Sliding Stop',
        initiation: 'rider_cue',
        technique: 'hind_feet_sliding',
        distance: { min: 10, max: 30, optimal: 20 }, // feet
        straightness: 'perfectly_straight',
        attitude: 'willing_and_controlled',
        qualityFactors: ['distance', 'straightness', 'attitude', 'technique'],
        commonFaults: ['short_slide', 'crooked', 'resistant', 'bouncy'],
        securityLevel: 'TOP_SECRET'
      }
    },
    
    backups: {
      straight_backup: {
        name: 'Straight Backup',
        distance: { min: 10, max: 15, optimal: 12 }, // feet
        speed: 'moderate_and_consistent',
        straightness: 'perfectly_straight',
        willingness: 'immediate_response',
        qualityFactors: ['straightness', 'distance', 'willingness', 'cadence'],
        commonFaults: ['crooked', 'insufficient_distance', 'resistant', 'irregular'],
        securityLevel: 'CONFIDENTIAL'
      }
    },
    
    spins: {
      "360_spin": {
        name: '360 Degree Spin',
        direction: ['right', 'left'],
        pivot_foot: 'inside_hind',
        speed: 'consistent_cadence',
        degrees: 360,
        position: 'stationary',
        qualityFactors: ['cadence', 'position', 'degrees', 'pivot_foot'],
        commonFaults: ['traveling', 'irregular_cadence', 'over_under_spin', 'wrong_pivot'],
        securityLevel: 'TOP_SECRET'
      }
    },
    
    rollbacks: {
      "180_rollback": {
        name: '180 Degree Rollback',
        execution: 'stop_and_turn',
        degrees: 180,
        speed: 'quick_and_smooth',
        position: 'minimal_ground_coverage',
        qualityFactors: ['quickness', 'smoothness', 'degrees', 'position'],
        commonFaults: ['slow', 'rough', 'over_under_turn', 'too_much_ground'],
        securityLevel: 'RESTRICTED'
      }
    }
  },

  // 📊 Scoring System
  scoring: {
    baseScore: 70, // Starting score
    maneuverScoring: {
      excellent: 2.0,
      very_good: 1.5,
      good: 1.0,
      correct: 0.5,
      poor: 0.0,
      very_poor: -0.5,
      extremely_poor: -1.0,
      not_performed: -1.5
    },
    
    penalties: {
      minor_faults: {
        over_spin: -0.5,
        under_spin: -0.5,
        out_of_lead: -0.5,
        break_of_gait: -0.5,
        freeze_up: -0.5
      },
      major_faults: {
        spurring_in_front_of_cinch: -5,
        use_of_two_hands: -5,
        knocking_over_markers: -5,
        blatant_disobedience: -5,
        illegal_equipment: -5
      },
      severe_faults: {
        fall_of_horse_rider: 0, // Score of 0
        equipment_failure: 0,
        lameness: 0,
        abuse: 0
      }
    },
    
    judging_criteria: {
      finesse: 'Degree of difficulty and precision',
      smoothness: 'Fluid transitions between maneuvers',
      attitude: 'Willingness and cooperation',
      authority: 'Control and command of horse',
      speed_control: 'Appropriate speed for each maneuver'
    }
  },

  // 🤖 AI Analysis Configuration
  aiAnalysis: {
    maneuverRecognition: {
      enabled: true,
      accuracy: 0.94,
      realTimeProcessing: true,
      maneuverClassification: 'automatic',
      qualityAssessment: 'continuous'
    },
    
    patternAnalysis: {
      enabled: true,
      geometryTracking: true,
      speedAnalysis: true,
      cadenceMonitoring: true,
      transitionEvaluation: true
    },
    
    performanceMetrics: {
      consistency: 'measured',
      improvement: 'tracked',
      weaknesses: 'identified',
      strengths: 'highlighted',
      competitionReadiness: 'assessed'
    },
    
    realTimeCoaching: {
      enabled: true,
      responseTime: 80, // milliseconds
      feedbackTypes: ['visual', 'audio', 'tactical'],
      adaptiveGuidance: true
    },
    
    securityLevel: 'TOP_SECRET'
  },

  // 🎓 Training Configuration
  training: {
    progressionLevels: [
      'basic_maneuvers',
      'pattern_introduction',
      'maneuver_refinement',
      'pattern_mastery',
      'competition_preparation',
      'advanced_competition'
    ],
    
    maneuverDevelopment: {
      stops: {
        progression: ['walk_stops', 'trot_stops', 'lope_stops', 'sliding_stops'],
        timeline: '6_months',
        prerequisites: ['basic_control', 'collection', 'responsiveness']
      },
      spins: {
        progression: ['turn_on_haunches', 'quarter_turns', 'half_turns', 'full_spins'],
        timeline: '8_months',
        prerequisites: ['lateral_flexion', 'collection', 'pivot_understanding']
      },
      circles: {
        progression: ['walk_circles', 'trot_circles', 'lope_circles', 'speed_variation'],
        timeline: '4_months',
        prerequisites: ['steering', 'speed_control', 'balance']
      },
      leadChanges: {
        progression: ['simple_changes', 'counter_canter', 'flying_changes', 'multiple_changes'],
        timeline: '10_months',
        prerequisites: ['lead_recognition', 'collection', 'straightness']
      }
    },
    
    patternPreparation: {
      memorization: 'pattern_study',
      visualization: 'mental_rehearsal',
      practice: 'incremental_building',
      refinement: 'precision_focus',
      competition: 'performance_optimization'
    }
  },

  // 🤖 AI Coaching Prompts
  aiCoaching: {
    coachingPrompts: {
      circles: [
        "Maintain consistent speed throughout the circle",
        "Keep your horse bent in the direction of travel",
        "Use your outside leg to maintain the circle size",
        "Look ahead to maintain perfect roundness"
      ],
      stops: [
        "Prepare your horse with collection before the stop",
        "Sit deep and say 'whoa' clearly",
        "Keep your horse straight during the slide",
        "Don't pull on the reins during the stop"
      ],
      spins: [
        "Keep your horse's front end elevated",
        "Maintain consistent rhythm throughout",
        "Use your outside leg to drive the hindquarters",
        "Keep your horse's head and neck straight"
      ],
      backups: [
        "Ask for backup immediately after the stop",
        "Keep your horse straight with equal leg pressure",
        "Use light rein pressure with leg support",
        "Count the steps to ensure proper distance"
      ],
      leadChanges: [
        "Prepare with straightness and collection",
        "Time your aids for the moment of suspension",
        "Keep your horse straight through the change",
        "Confirm the new lead immediately"
      ]
    },
    
    strategicAdvice: {
      patternStrategy: 'Optimize maneuver sequence for maximum scoring',
      energyManagement: 'Balance speed and control throughout pattern',
      riskAssessment: 'Identify high-risk maneuvers and prepare accordingly',
      competitionTactics: 'Adapt strategy based on competition conditions'
    }
  },

  // 🏆 Competition Mode
  competitionMode: {
    enabled: true,
    security: {
      dataClassification: 'TOP_SECRET',
      accessRestriction: 'judges_officials_only',
      realTimeEncryption: true,
      tamperDetection: true,
      auditLogging: 'comprehensive'
    },
    features: {
      liveScoring: true,
      judgeInterface: true,
      patternDisplay: true,
      spectatorView: 'scores_only',
      broadcastIntegration: true
    },
    intellectualProperty: {
      protection: 'maximum',
      trainingMethods: 'confidential',
      patternStrategies: 'restricted',
      accessTracking: 'detailed'
    }
  }
};

// 🔧 Utility Functions
export const calculatePatternScore = (
  maneuverScores: number[],
  penalties: number[]
): number => {
  const maneuverTotal = maneuverScores.reduce((sum, score) => sum + score, 0);
  const penaltyTotal = penalties.reduce((sum, penalty) => sum + penalty, 0);
  return Math.max(0, reiningConfig.scoring.baseScore + maneuverTotal + penaltyTotal);
};

export const analyzeManeuverQuality = (
  maneuverType: string,
  parameters: Record<string, number>
): number => {
  const maneuver = reiningConfig.maneuvers[maneuverType as keyof typeof reiningConfig.maneuvers];
  if (!maneuver) return 0;

  // Quality analysis logic based on maneuver parameters
  let qualityScore = 0;
  // Implementation would analyze specific parameters for each maneuver type
  
  return Math.max(-1.5, Math.min(2.0, qualityScore));
};

export const validatePattern = (
  patternName: string,
  executedManeuvers: string[]
): boolean => {
  const pattern = reiningConfig.timing.patterns[patternName as keyof typeof reiningConfig.timing.patterns];
  if (!pattern) return false;
  
  return pattern.maneuvers.every((maneuver, index) => 
    executedManeuvers[index] === maneuver
  );
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'pattern_strategies': 'TOP_SECRET',
    'training_methods': 'RESTRICTED',
    'competition_scores': 'CONFIDENTIAL',
    'maneuver_analysis': 'RESTRICTED',
    'horse_evaluation': 'CONFIDENTIAL'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const predictManeuverScore = (
  maneuverType: string,
  executionData: any
): number => {
  // AI-based scoring prediction
  return 0; // Placeholder for actual implementation
}; 