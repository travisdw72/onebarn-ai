import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const showJumpingConfig = {
  // 🏇 Discipline Information
  discipline: {
    name: 'Show Jumping',
    description: 'Precision jumping sport over a course of obstacles within time allowed',
    category: 'jumping_sport',
    competitionLevel: 'olympic',
    icon: 'FlightTakeoff',
    color: brandConfig.colors.arenaSand,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'RESTRICTED', // Course designs and times are competitive secrets
      competitiveIntelligence: true,
      intellectualProperty: ['course_strategies', 'jump_techniques', 'time_management'],
      accessControl: 'trainer_rider_course_designer',
      retentionPolicy: '2_years',
      sharingRestrictions: ['no_competitors', 'team_only']
    }
  },

  // ⏱️ Course Timing System (Precision Required)
  timing: {
    precision: 0.01, // 10ms precision for jump-offs
    phases: {
      course_walk: {
        name: 'Course Walk',
        description: 'Pre-competition course inspection',
        allowedTime: { min: 300, max: 600, optimal: 450 }, // seconds
        activities: ['distance_measurement', 'line_planning', 'strategy_development'],
        securityLevel: 'CONFIDENTIAL'
      },
      warm_up: {
        name: 'Warm-up',
        description: 'Horse and rider preparation',
        duration: { min: 900, max: 1800, optimal: 1200 }, // seconds
        phases: ['flat_work', 'gymnastic_jumps', 'practice_fences'],
        securityLevel: 'INTERNAL'
      },
      first_round: {
        name: 'First Round',
        description: 'Initial course completion',
        timeAllowed: 'calculated', // Based on course length and speed
        optimumTime: 'calculated',
        faultPenalties: { rail: 4, refusal: 4, time: 1 }, // per second over
        securityLevel: 'RESTRICTED'
      },
      jump_off: {
        name: 'Jump-off',
        description: 'Shortened course for tie-breaking',
        timeAllowed: 'calculated',
        strategy: 'speed_vs_accuracy',
        riskAssessment: true,
        securityLevel: 'TOP_SECRET'
      }
    },
    
    // Course Standards
    courseStandards: {
      speeds: {
        children: 300, // meters per minute
        junior: 325,
        young_rider: 350,
        amateur: 350,
        professional: 375,
        grand_prix: 400
      },
      jumpHeights: {
        children: { min: 0.80, max: 1.15 }, // meters
        junior: { min: 1.00, max: 1.30 },
        young_rider: { min: 1.20, max: 1.40 },
        amateur: { min: 1.20, max: 1.45 },
        professional: { min: 1.40, max: 1.60 },
        grand_prix: { min: 1.50, max: 1.70 }
      },
      courseLength: {
        min: 350, // meters
        max: 600,
        optimal: 500
      }
    },
    
    // Timing Equipment Security
    equipment: {
      timingSystem: {
        primary: {
          type: 'photocell_beam',
          accuracy: 0.01,
          certification: 'FEI_approved',
          encryption: true,
          tamperDetection: true,
          backupRequired: true
        },
        backup: {
          type: 'manual_stopwatch',
          accuracy: 0.1,
          certification: 'official_timekeeper',
          encryption: false
        }
      },
      jumpSensors: {
        type: 'magnetic_field',
        sensitivity: 'high',
        falsePositiveRate: 0.001,
        realTimeDetection: true,
        encryption: true
      }
    }
  },

  // 🚧 Jump Analysis Configuration
  jumpAnalysis: {
    approach: {
      name: 'Jump Approach',
      parameters: {
        distance: { min: 3, max: 5, optimal: 4 }, // strides from jump
        speed: { min: 300, max: 400, optimal: 350 }, // meters per minute
        rhythm: { consistency: 95 }, // percentage
        straightness: { deviation: 5 } // degrees max
      },
      criticalFactors: ['rhythm_maintenance', 'balance', 'impulsion', 'straightness'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        trajectoryPrediction: true,
        confidenceThreshold: 0.90
      },
      securityLevel: 'CONFIDENTIAL'
    },
    takeoff: {
      name: 'Jump Takeoff',
      parameters: {
        distance: { min: 1.2, max: 1.8, optimal: 1.5 }, // meters from base
        angle: { min: 15, max: 25, optimal: 20 }, // degrees
        power: { threshold: 'calculated' }, // based on jump height
        timing: { precision: 0.1 } // seconds
      },
      criticalFactors: ['takeoff_point', 'power_generation', 'balance', 'technique'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        biomechanicalAnalysis: true,
        confidenceThreshold: 0.92
      },
      securityLevel: 'RESTRICTED'
    },
    flight: {
      name: 'Jump Flight',
      parameters: {
        trajectory: { arc_height: 'calculated' },
        clearance: { min: 0.15, optimal: 0.30 }, // meters above jump
        technique: { front_leg_fold: 90, hind_leg_clearance: 0.10 }, // degrees, meters
        duration: { calculated: true }
      },
      criticalFactors: ['arc_quality', 'leg_technique', 'balance', 'clearance'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        trajectoryAnalysis: true,
        confidenceThreshold: 0.88
      },
      securityLevel: 'RESTRICTED'
    },
    landing: {
      name: 'Jump Landing',
      parameters: {
        distance: { min: 1.5, max: 2.5, optimal: 2.0 }, // meters from jump
        balance: { recovery_time: 1.0 }, // seconds
        rhythm: { resumption_strides: 2 },
        straightness: { deviation: 5 } // degrees
      },
      criticalFactors: ['balance_recovery', 'rhythm_resumption', 'straightness', 'preparation'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        recoveryAnalysis: true,
        confidenceThreshold: 0.85
      },
      securityLevel: 'CONFIDENTIAL'
    }
  },

  // 📏 Course Design Analysis
  courseAnalysis: {
    jumpTypes: {
      vertical: {
        name: 'Vertical Jump',
        characteristics: ['single_plane', 'height_challenge'],
        approach: 'straight',
        technique: 'power_and_scope',
        commonFaults: ['front_rail', 'back_rail']
      },
      oxer: {
        name: 'Oxer (Spread Jump)',
        characteristics: ['width_and_height', 'scope_challenge'],
        approach: 'forward',
        technique: 'scope_and_technique',
        commonFaults: ['back_rail', 'hanging_legs']
      },
      triple_bar: {
        name: 'Triple Bar',
        characteristics: ['ascending_spread', 'scope_emphasis'],
        approach: 'forward_and_straight',
        technique: 'maximum_scope',
        commonFaults: ['back_rail', 'trajectory_error']
      },
      combination: {
        name: 'Combination',
        characteristics: ['multiple_elements', 'rhythm_challenge'],
        approach: 'balanced',
        technique: 'rhythm_and_balance',
        commonFaults: ['second_element', 'rhythm_loss']
      },
      water_jump: {
        name: 'Water Jump',
        characteristics: ['width_only', 'psychological_challenge'],
        approach: 'forward_and_confident',
        technique: 'scope_and_confidence',
        commonFaults: ['front_feet_in_water', 'refusal']
      }
    },
    distances: {
      one_stride: { min: 7.0, max: 7.6, optimal: 7.3 }, // meters
      two_stride: { min: 10.4, max: 11.0, optimal: 10.7 },
      three_stride: { min: 13.7, max: 14.6, optimal: 14.0 },
      four_stride: { min: 17.1, max: 18.3, optimal: 17.7 },
      five_stride: { min: 20.4, max: 21.9, optimal: 21.0 }
    },
    lines: {
      straight: {
        description: 'Direct line between jumps',
        strategy: 'maintain_rhythm',
        riskLevel: 'low'
      },
      bending: {
        description: 'Curved line between jumps',
        strategy: 'balance_and_preparation',
        riskLevel: 'medium'
      },
      broken: {
        description: 'Angled or offset line',
        strategy: 'accuracy_and_adjustment',
        riskLevel: 'high'
      }
    }
  },

  // 🎯 Fault Analysis System
  faultAnalysis: {
    rails: {
      front_rail: {
        causes: ['takeoff_too_close', 'insufficient_power', 'poor_technique'],
        prevention: ['adjust_stride', 'increase_impulsion', 'improve_technique'],
        frequency: 'common',
        impact: 4 // penalty points
      },
      back_rail: {
        causes: ['takeoff_too_far', 'hanging_legs', 'poor_trajectory'],
        prevention: ['closer_takeoff', 'leg_technique', 'arc_improvement'],
        frequency: 'very_common',
        impact: 4
      }
    },
    refusals: {
      stop: {
        causes: ['lack_of_confidence', 'poor_approach', 'overfacing'],
        prevention: ['confidence_building', 'better_preparation', 'appropriate_height'],
        frequency: 'occasional',
        impact: 4
      },
      run_out: {
        causes: ['lack_of_straightness', 'evasion', 'poor_riding'],
        prevention: ['straightness_training', 'stronger_aids', 'better_preparation'],
        frequency: 'rare',
        impact: 4
      }
    },
    time_faults: {
      exceeded_time: {
        causes: ['slow_pace', 'long_route', 'hesitation'],
        prevention: ['pace_training', 'efficient_lines', 'confidence'],
        frequency: 'common',
        impact: 1 // per second
      }
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    realTimeAnalysis: {
      enabled: true,
      responseTime: 75, // milliseconds
      analysisDepth: 'comprehensive',
      feedbackTypes: ['visual', 'audio']
    },
    coachingPrompts: {
      approach_issues: [
        "Maintain rhythm in the approach",
        "Keep your horse straight to the jump",
        "Create impulsion without speed",
        "Look ahead to the next jump"
      ],
      takeoff_problems: [
        "Wait for the jump to come to you",
        "Keep your leg on for power",
        "Stay balanced over the jump",
        "Trust your horse's judgment"
      ],
      technique_faults: [
        "Keep your hands forward over the jump",
        "Stay with your horse's motion",
        "Look ahead, not down at the jump",
        "Maintain your position in the air"
      ],
      course_strategy: [
        "Plan your lines during course walk",
        "Ride forward to the first jump",
        "Save time on the straight lines",
        "Be accurate in the combinations"
      ]
    },
    jumpPrediction: {
      enabled: true,
      accuracy: 0.92,
      factors: ['approach_quality', 'takeoff_point', 'horse_form'],
      realTimeAdjustment: true
    },
    securityLevel: 'RESTRICTED'
  },

  // 🏆 Competition Mode Security
  competitionMode: {
    enabled: true,
    security: {
      dataClassification: 'TOP_SECRET',
      accessRestriction: 'officials_only',
      realTimeEncryption: true,
      tamperDetection: true,
      auditLogging: 'comprehensive'
    },
    features: {
      liveScoring: true,
      judgeInterface: true,
      timekeeperInterface: true,
      spectatorView: 'results_only',
      broadcastIntegration: true
    },
    intellectualProperty: {
      protection: 'maximum',
      courseDesigns: 'confidential',
      jumpingStrategies: 'restricted',
      accessTracking: 'detailed'
    }
  },

  // 📊 Performance Metrics
  performanceMetrics: {
    consistency: {
      clearRounds: { target: 80 }, // percentage
      timeConsistency: { variance: 5 }, // percentage
      faultPattern: 'analyzed'
    },
    improvement: {
      heightProgression: 'tracked',
      timeImprovement: 'measured',
      faultReduction: 'monitored'
    },
    competition: {
      placings: 'recorded',
      earnings: 'tracked',
      qualifications: 'monitored'
    }
  }
};

// 🔧 Utility Functions
export const calculateTimeAllowed = (
  courseLength: number,
  speed: number
): number => {
  return Math.round((courseLength / speed) * 60); // seconds
};

export const calculateOptimumTime = (
  courseLength: number,
  jumpCount: number,
  level: string
): number => {
  const baseSpeed = showJumpingConfig.timing.courseStandards.speeds[level as keyof typeof showJumpingConfig.timing.courseStandards.speeds] || 350;
  const jumpPenalty = jumpCount * 2; // seconds added for jumps
  return Math.round((courseLength / baseSpeed) * 60) + jumpPenalty;
};

export const analyzeFaultPattern = (
  faults: Array<{ type: string, jump: number, cause?: string }>
): any => {
  const patterns = {
    railsDown: faults.filter(f => f.type === 'rail').length,
    refusals: faults.filter(f => f.type === 'refusal').length,
    timeFaults: faults.filter(f => f.type === 'time').length,
    commonJumps: {} as Record<number, number>
  };

  faults.forEach(fault => {
    patterns.commonJumps[fault.jump] = (patterns.commonJumps[fault.jump] || 0) + 1;
  });

  return patterns;
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'course_design': 'TOP_SECRET',
    'jump_strategies': 'RESTRICTED',
    'training_sessions': 'CONFIDENTIAL',
    'competition_results': 'INTERNAL',
    'fault_analysis': 'CONFIDENTIAL'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const validateCompetitionMode = (sessionData: any): boolean => {
  const requiredFields = ['course_designer', 'judge', 'timekeeper', 'competition_id'];
  return requiredFields.every(field => sessionData[field] !== undefined);
};

export const generateJumpingPlan = (
  currentLevel: string,
  weaknesses: string[],
  goals: string[]
): any => {
  return {
    level: currentLevel,
    focus_areas: weaknesses,
    objectives: goals,
    timeline: '8_weeks',
    progression: 'systematic',
    securityLevel: 'CONFIDENTIAL'
  };
}; 