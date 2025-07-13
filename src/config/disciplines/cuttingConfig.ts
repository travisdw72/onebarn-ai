import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const cuttingConfig = {
  // 🐄 Discipline Information
  discipline: {
    name: 'Cutting',
    description: 'Working cow horse discipline demonstrating ability to separate and control cattle',
    category: 'western_working',
    competitionLevel: 'professional',
    icon: 'Pets',
    color: brandConfig.colors.stableMahogany,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'RESTRICTED', // Cutting techniques are valuable trade secrets
      competitiveIntelligence: true,
      intellectualProperty: ['cow_reading_techniques', 'horse_training_methods', 'strategy_development'],
      accessControl: 'trainer_rider_only',
      retentionPolicy: '5_years', // Long retention for breeding/training value
      sharingRestrictions: ['no_competitors', 'bloodline_protection']
    }
  },

  // ⏱️ Work Session Timing
  timing: {
    precision: 0.1, // 100ms precision for cow work
    phases: {
      herd_entry: {
        name: 'Herd Entry',
        description: 'Entering the herd to select a cow',
        maxTime: 30, // seconds
        objectives: ['calm_entry', 'cow_selection', 'minimal_disturbance'],
        securityLevel: 'CONFIDENTIAL'
      },
      cow_separation: {
        name: 'Cow Separation',
        description: 'Separating selected cow from herd',
        targetTime: { min: 10, max: 45, optimal: 25 },
        objectives: ['clean_separation', 'cow_control', 'herd_stability'],
        securityLevel: 'RESTRICTED'
      },
      active_work: {
        name: 'Active Work',
        description: 'Working the separated cow',
        duration: 150, // seconds (2.5 minutes)
        phases: ['initial_control', 'cow_challenges', 'horse_responses'],
        securityLevel: 'TOP_SECRET'
      },
      quit_work: {
        name: 'Quit Work',
        description: 'Ending the work session',
        method: ['rider_initiated', 'time_expired', 'cow_quit'],
        evaluation: 'judge_scored',
        securityLevel: 'RESTRICTED'
      }
    },
    
    // Competition Standards
    competitionStandards: {
      workTime: 150, // seconds
      maxScore: 80, // points
      passingScore: 60,
      penalties: {
        hotQuit: -5,
        helpFromTurnbackRiders: -3,
        unnecessaryRiding: -1,
        spurringInShoulder: -5,
        useOfTwoHands: -5
      }
    },
    
    // Timing Equipment
    equipment: {
      sessionTimer: {
        type: 'competition_timer',
        accuracy: 0.1,
        visibility: 'judge_and_rider',
        audioSignals: true,
        encryption: true
      },
      videoAnalysis: {
        cameras: {
          overhead: { angle: 90, coverage: 'full_arena' },
          side: { angle: 0, coverage: 'work_area' },
          herd: { angle: 45, coverage: 'herd_area' }
        },
        frameRate: 60,
        resolution: '4K',
        encryption: 'AES-256'
      }
    }
  },

  // 🐄 Cow Analysis Parameters
  cowAnalysis: {
    cowTypes: {
      fresh: {
        name: 'Fresh Cow',
        characteristics: ['high_energy', 'unpredictable', 'challenging'],
        difficulty: 'high',
        scoringPotential: 'maximum',
        strategy: 'patience_and_control'
      },
      used: {
        name: 'Used Cow',
        characteristics: ['experienced', 'predictable', 'less_challenging'],
        difficulty: 'medium',
        scoringPotential: 'moderate',
        strategy: 'quick_work'
      },
      sour: {
        name: 'Sour Cow',
        characteristics: ['uncooperative', 'difficult', 'low_challenge'],
        difficulty: 'low',
        scoringPotential: 'minimal',
        strategy: 'minimal_work'
      }
    },
    
    cowBehavior: {
      movement_patterns: {
        straight_run: {
          description: 'Cow runs straight along fence',
          horse_response: 'mirror_movement',
          difficulty: 'easy',
          scoring: 'basic'
        },
        turn_back: {
          description: 'Cow turns back toward herd',
          horse_response: 'anticipate_and_block',
          difficulty: 'medium',
          scoring: 'good'
        },
        duck_and_dodge: {
          description: 'Cow makes quick direction changes',
          horse_response: 'quick_reactions',
          difficulty: 'high',
          scoring: 'excellent'
        },
        charge: {
          description: 'Cow charges toward horse',
          horse_response: 'stand_ground_control',
          difficulty: 'very_high',
          scoring: 'maximum'
        }
      },
      
      intensity_levels: {
        low: { description: 'Minimal cow movement', scoring_multiplier: 0.7 },
        medium: { description: 'Moderate cow challenge', scoring_multiplier: 1.0 },
        high: { description: 'Active cow work', scoring_multiplier: 1.3 },
        extreme: { description: 'Maximum cow challenge', scoring_multiplier: 1.5 }
      }
    },
    
    aiAnalysis: {
      enabled: true,
      cowTracking: {
        positionTracking: true,
        movementPrediction: true,
        behaviorClassification: true,
        intensityAssessment: true
      },
      realTimeCoaching: true,
      confidenceThreshold: 0.85,
      securityLevel: 'RESTRICTED'
    }
  },

  // 🐎 Horse Performance Analysis
  horseAnalysis: {
    attributes: {
      cow_sense: {
        name: 'Cow Sense',
        description: 'Natural ability to read and anticipate cow movement',
        measurement: 'behavioral_analysis',
        importance: 'critical',
        development: 'genetic_and_training'
      },
      athleticism: {
        name: 'Athleticism',
        description: 'Physical ability to match cow movements',
        measurement: 'movement_analysis',
        factors: ['speed', 'agility', 'balance', 'stamina'],
        importance: 'high'
      },
      trainability: {
        name: 'Trainability',
        description: 'Ability to learn and respond to training',
        measurement: 'progress_tracking',
        factors: ['responsiveness', 'retention', 'adaptability'],
        importance: 'high'
      },
      heart: {
        name: 'Heart/Desire',
        description: 'Willingness to work and compete',
        measurement: 'behavioral_assessment',
        factors: ['enthusiasm', 'persistence', 'competitiveness'],
        importance: 'critical'
      }
    },
    
    movements: {
      stop: {
        name: 'Stop',
        description: 'Quick deceleration to match cow',
        quality_factors: ['speed', 'balance', 'collection'],
        timing: 'cow_initiated',
        scoring_impact: 'high'
      },
      turn: {
        name: 'Turn',
        description: 'Direction change to follow cow',
        quality_factors: ['quickness', 'balance', 'positioning'],
        types: ['rollback', 'pivot', 'spin'],
        scoring_impact: 'high'
      },
      rate: {
        name: 'Rate',
        description: 'Speed adjustment to control cow',
        quality_factors: ['smoothness', 'timing', 'effectiveness'],
        application: 'cow_speed_matching',
        scoring_impact: 'medium'
      },
      draw: {
        name: 'Draw',
        description: 'Attracting cow movement',
        quality_factors: ['positioning', 'timing', 'subtlety'],
        technique: 'body_language',
        scoring_impact: 'high'
      }
    },
    
    aiAnalysis: {
      enabled: true,
      movementTracking: {
        positionAccuracy: 0.01, // meters
        speedTracking: true,
        accelerationAnalysis: true,
        balanceAssessment: true
      },
      performanceMetrics: {
        reactionTime: 'measured',
        movementEfficiency: 'calculated',
        cowControl: 'assessed',
        consistency: 'tracked'
      },
      confidenceThreshold: 0.88,
      securityLevel: 'TOP_SECRET'
    }
  },

  // 🎯 Scoring System
  scoring: {
    scale: { min: 60, max: 80, increment: 0.5 },
    components: {
      horseCredit: {
        weight: 0.6,
        factors: [
          'cow_sense_demonstration',
          'athletic_ability',
          'degree_of_difficulty',
          'eye_appeal',
          'courage'
        ]
      },
      riderCredit: {
        weight: 0.2,
        factors: [
          'cow_selection',
          'position_and_control',
          'timing',
          'showmanship'
        ]
      },
      cowCredit: {
        weight: 0.2,
        factors: [
          'degree_of_difficulty',
          'challenge_provided',
          'freshness',
          'cooperation_level'
        ]
      }
    },
    
    penalties: {
      major: {
        hotQuit: -5,
        spurringInShoulder: -5,
        useOfTwoHands: -5,
        schoolingAfterBuzzer: -5
      },
      minor: {
        helpFromTurnback: -3,
        unnecessaryRiding: -1,
        overShowing: -2,
        poorCowSelection: -2
      }
    },
    
    bonusPoints: {
      exceptionalDifficulty: 2,
      extraordinaryHorseWork: 3,
      perfectTiming: 1,
      spectacularMove: 2
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    realTimeAnalysis: {
      enabled: true,
      responseTime: 100, // milliseconds
      analysisDepth: 'comprehensive',
      feedbackTypes: ['visual', 'audio', 'tactical']
    },
    
    coachingPrompts: {
      cow_selection: [
        "Look for a fresh, challenging cow",
        "Avoid sour or overworked cattle",
        "Select based on your horse's ability",
        "Consider the cow's position in herd"
      ],
      herd_work: [
        "Enter the herd calmly and quietly",
        "Don't disturb the settled cattle",
        "Use minimal pressure to separate",
        "Keep your horse relaxed and focused"
      ],
      active_work: [
        "Let your horse work the cow",
        "Stay centered and balanced",
        "Don't over-ride or interfere",
        "Trust your horse's cow sense"
      ],
      timing: [
        "Know when to quit on a high note",
        "Don't overwork a good cow",
        "Recognize when cow is getting sour",
        "End with horse in control"
      ]
    },
    
    strategicAdvice: {
      cowReading: {
        enabled: true,
        factors: ['body_language', 'movement_patterns', 'energy_level'],
        predictions: 'behavioral_modeling'
      },
      horseManagement: {
        enabled: true,
        factors: ['energy_conservation', 'positioning', 'timing'],
        optimization: 'performance_maximization'
      }
    },
    
    securityLevel: 'TOP_SECRET'
  },

  // 🏆 Competition Mode Security
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
      spectatorView: 'scores_only',
      broadcastIntegration: true,
      cattleTracking: true
    },
    intellectualProperty: {
      protection: 'maximum',
      trainingMethods: 'confidential',
      bloodlineData: 'restricted',
      accessTracking: 'detailed'
    }
  },

  // 📊 Training Progression
  training: {
    levels: [
      'flag_work',
      'mechanical_cow',
      'live_cattle_introduction',
      'herd_work_basics',
      'competition_preparation',
      'advanced_cow_work'
    ],
    
    progressionMetrics: {
      cowSense: 'behavioral_assessment',
      athleticism: 'movement_analysis',
      consistency: 'performance_tracking',
      competitiveness: 'competition_results'
    },
    
    developmentPlan: {
      foundation: {
        duration: '6_months',
        focus: ['basic_training', 'cow_introduction', 'confidence_building'],
        goals: ['calm_cattle_exposure', 'basic_control', 'rider_position']
      },
      intermediate: {
        duration: '12_months',
        focus: ['herd_work', 'cow_selection', 'active_work'],
        goals: ['independent_work', 'cow_reading', 'competition_readiness']
      },
      advanced: {
        duration: 'ongoing',
        focus: ['competition_strategy', 'difficult_cattle', 'consistency'],
        goals: ['championship_level', 'breeding_prospect', 'training_horse']
      }
    }
  }
};

// 🔧 Utility Functions
export const calculateScore = (
  horseWork: number,
  riderWork: number,
  cowDifficulty: number,
  penalties: number[]
): number => {
  const baseScore = (horseWork * 0.6) + (riderWork * 0.2) + (cowDifficulty * 0.2);
  const totalPenalties = penalties.reduce((sum, penalty) => sum + penalty, 0);
  return Math.max(60, Math.min(80, baseScore - totalPenalties));
};

export const assessCowQuality = (
  freshness: number,
  difficulty: number,
  cooperation: number
): string => {
  const average = (freshness + difficulty + cooperation) / 3;
  if (average >= 8) return 'excellent';
  if (average >= 6) return 'good';
  if (average >= 4) return 'fair';
  return 'poor';
};

export const predictCowBehavior = (
  movementHistory: any[],
  currentPosition: any
): any => {
  // AI-based cow behavior prediction logic
  return {
    nextMove: 'predicted_direction',
    confidence: 0.85,
    difficulty: 'assessed_level',
    recommendation: 'strategic_advice'
  };
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'training_methods': 'TOP_SECRET',
    'bloodline_data': 'RESTRICTED',
    'competition_scores': 'CONFIDENTIAL',
    'cow_work_analysis': 'RESTRICTED',
    'horse_evaluation': 'CONFIDENTIAL'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const validateCompetitionMode = (sessionData: any): boolean => {
  const requiredFields = ['judge_id', 'competition_id', 'cattle_lot', 'turnback_riders'];
  return requiredFields.every(field => sessionData[field] !== undefined);
}; 