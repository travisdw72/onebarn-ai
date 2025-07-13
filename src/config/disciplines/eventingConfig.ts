import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const eventingConfig = {
  // 🏇 Discipline Information
  discipline: {
    name: 'Eventing',
    description: 'Three-phase equestrian sport combining dressage, cross-country, and show jumping',
    category: 'combined_training',
    competitionLevel: 'olympic',
    icon: 'EmojiEvents',
    color: brandConfig.colors.arenaSand,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'RESTRICTED', // Multi-phase training data is highly valuable
      competitiveIntelligence: true,
      intellectualProperty: ['training_programs', 'conditioning_methods', 'phase_strategies'],
      accessControl: 'trainer_rider_team',
      retentionPolicy: '7_years', // Long retention for horse development tracking
      sharingRestrictions: ['no_competitors', 'team_only', 'federation_approved']
    }
  },

  // ⏱️ Three-Phase Timing System
  timing: {
    precision: 0.01, // 10ms precision for cross-country timing
    phases: {
      dressage: {
        name: 'Dressage Phase',
        description: 'Classical training demonstration',
        duration: { min: 300, max: 600, optimal: 450 }, // seconds
        scoring: 'percentage_based',
        weight: 0.33,
        focus: 'harmony_and_precision',
        securityLevel: 'CONFIDENTIAL'
      },
      cross_country: {
        name: 'Cross-Country Phase',
        description: 'Endurance and jumping over natural obstacles',
        duration: 'distance_based', // varies by level
        scoring: 'penalty_and_time',
        weight: 0.33,
        focus: 'speed_endurance_courage',
        securityLevel: 'TOP_SECRET' // Most valuable phase data
      },
      show_jumping: {
        name: 'Show Jumping Phase',
        description: 'Precision jumping after cross-country',
        duration: 'time_allowed',
        scoring: 'penalty_based',
        weight: 0.34,
        focus: 'precision_after_endurance',
        securityLevel: 'RESTRICTED'
      }
    },
    
    // Competition Levels
    competitionLevels: {
      beginner_novice: {
        dressage: 'intro_test',
        crossCountry: { distance: 2400, speed: 350, jumps: 18 }, // meters, mpm, count
        showJumping: { height: 0.95, speed: 325 } // meters, mpm
      },
      novice: {
        dressage: 'training_level',
        crossCountry: { distance: 2800, speed: 350, jumps: 20 },
        showJumping: { height: 1.05, speed: 325 }
      },
      training: {
        dressage: 'first_level',
        crossCountry: { distance: 3120, speed: 520, jumps: 22 },
        showJumping: { height: 1.15, speed: 350 }
      },
      preliminary: {
        dressage: 'second_level',
        crossCountry: { distance: 3600, speed: 550, jumps: 24 },
        showJumping: { height: 1.20, speed: 350 }
      },
      intermediate: {
        dressage: 'third_level',
        crossCountry: { distance: 4200, speed: 570, jumps: 26 },
        showJumping: { height: 1.25, speed: 375 }
      },
      advanced: {
        dressage: 'fourth_level',
        crossCountry: { distance: 5700, speed: 570, jumps: 30 },
        showJumping: { height: 1.30, speed: 375 }
      },
      four_star: {
        dressage: 'grand_prix_special',
        crossCountry: { distance: 6840, speed: 570, jumps: 35 },
        showJumping: { height: 1.35, speed: 375 }
      }
    },
    
    // Equipment Security
    equipment: {
      timingSystem: {
        crossCountry: {
          type: 'gps_timing',
          accuracy: 0.01,
          certification: 'FEI_approved',
          encryption: true,
          tamperDetection: true,
          realTimeTracking: true
        },
        showJumping: {
          type: 'photocell_timing',
          accuracy: 0.01,
          certification: 'FEI_approved',
          encryption: true
        }
      },
      biometricMonitoring: {
        horse: {
          heartRate: { continuous: true, accuracy: 1 },
          gpsTracking: { precision: 1 }, // meters
          gaitAnalysis: { sampleRate: 1000 },
          fatigueMonitoring: true,
          recoveryTracking: true
        },
        rider: {
          heartRate: true,
          gpsTracking: true,
          impactMonitoring: true,
          fatigueAssessment: true
        }
      }
    }
  },

  // 🎭 Dressage Phase Analysis
  dressagePhase: {
    tests: {
      intro: {
        movements: ['halt_salute', 'working_trot', 'working_canter', 'free_walk'],
        duration: 300,
        maxScore: 100,
        coefficients: [1, 1, 1, 2]
      },
      training: {
        movements: ['working_gaits', 'lengthening', 'circles', 'transitions'],
        duration: 360,
        maxScore: 100,
        coefficients: [1, 1, 2, 1]
      },
      // Additional test levels would be defined here
    },
    
    scoring: {
      scale: { min: 0, max: 10, increment: 0.5 },
      conversion: 'percentage_based', // Convert to percentage for eventing
      penalties: {
        error_of_course: -2,
        error_of_test: -0.5,
        resistance: 'judge_discretion'
      }
    },
    
    aiAnalysis: {
      enabled: true,
      movementRecognition: true,
      qualityAssessment: true,
      consistencyTracking: true,
      confidenceThreshold: 0.88,
      securityLevel: 'CONFIDENTIAL'
    }
  },

  // 🏃‍♂️ Cross-Country Phase Analysis
  crossCountryPhase: {
    obstacles: {
      verticals: {
        type: 'upright_fence',
        approach: 'straight_forward',
        technique: 'power_and_scope',
        riskLevel: 'medium'
      },
      spreads: {
        type: 'width_fence',
        approach: 'forward_and_balanced',
        technique: 'scope_and_technique',
        riskLevel: 'medium_high'
      },
      combinations: {
        type: 'multiple_elements',
        approach: 'balanced_and_accurate',
        technique: 'rhythm_and_precision',
        riskLevel: 'high'
      },
      water: {
        type: 'water_complex',
        approach: 'confident_and_forward',
        technique: 'boldness_and_balance',
        riskLevel: 'high'
      },
      ditches: {
        type: 'ditch_fence',
        approach: 'forward_and_trusting',
        technique: 'confidence_and_scope',
        riskLevel: 'medium_high'
      },
      banks: {
        type: 'up_down_bank',
        approach: 'balanced_and_controlled',
        technique: 'balance_and_agility',
        riskLevel: 'high'
      }
    },
    
    performance: {
      speed: {
        measurement: 'gps_tracking',
        analysis: 'real_time',
        optimization: 'route_and_pace',
        factors: ['terrain', 'footing', 'weather', 'horse_fitness']
      },
      
      endurance: {
        measurement: 'biometric_monitoring',
        parameters: {
          heartRate: { zones: [120, 150, 180, 200] }, // bpm
          respirationRate: { normal: 16, elevated: 40 },
          temperature: { normal: 38, concern: 39.5 },
          recoveryTime: { target: 10 } // minutes to normal HR
        },
        tracking: 'continuous'
      },
      
      jumping: {
        analysis: 'video_and_sensor',
        parameters: {
          takeoffDistance: 'optimal_for_fence',
          technique: 'efficiency_and_safety',
          landing: 'balance_and_recovery',
          rhythm: 'maintenance_between_fences'
        },
        riskAssessment: 'real_time'
      }
    },
    
    scoring: {
      penalties: {
        refusal: { first: 20, second: 40, third: 'elimination' },
        fall: { horse: 'elimination', rider: 'elimination' },
        time: { per_second: 0.4 },
        dangerous_riding: 'elimination'
      },
      
      optimumTime: 'calculated_by_distance_and_speed',
      timeAllowed: 'optimum_plus_25_percent',
      
      bonuses: {
        inside_optimum: 'no_bonus', // Modern eventing doesn't award time bonuses
        clear_round: 'no_penalties'
      }
    },
    
    aiAnalysis: {
      enabled: true,
      routeOptimization: true,
      riskAssessment: true,
      fatigueMonitoring: true,
      performancePrediction: true,
      emergencyDetection: true,
      confidenceThreshold: 0.95,
      securityLevel: 'TOP_SECRET'
    }
  },

  // 🚧 Show Jumping Phase Analysis
  showJumpingPhase: {
    course: {
      design: 'technical_after_endurance',
      height: 'level_appropriate',
      spread: 'moderate',
      turns: 'testing_but_fair',
      combinations: 'rhythm_testing'
    },
    
    performance: {
      fatigue_impact: {
        measurement: 'pre_post_comparison',
        factors: ['reaction_time', 'power_output', 'technique_degradation'],
        analysis: 'continuous_monitoring'
      },
      
      precision: {
        measurement: 'fault_analysis',
        focus: 'accuracy_under_fatigue',
        factors: ['takeoff_timing', 'technique_maintenance', 'rider_effectiveness']
      }
    },
    
    scoring: {
      penalties: {
        rail_down: 4,
        first_refusal: 4,
        second_refusal: 8,
        third_refusal: 'elimination',
        time_fault: 1 // per second over time allowed
      },
      
      timeAllowed: 'calculated_by_course_length_and_speed',
      strategy: 'clear_round_priority'
    },
    
    aiAnalysis: {
      enabled: true,
      fatigueImpactAssessment: true,
      techniqueAnalysis: true,
      faultPrediction: true,
      recoveryMonitoring: true,
      confidenceThreshold: 0.87,
      securityLevel: 'RESTRICTED'
    }
  },

  // 📊 Overall Competition Analysis
  overallAnalysis: {
    scoring: {
      method: 'penalty_based',
      calculation: 'sum_of_all_phases',
      winner: 'lowest_penalty_score',
      
      phaseWeighting: {
        dressage: 'percentage_to_penalties',
        crossCountry: 'direct_penalties',
        showJumping: 'direct_penalties'
      }
    },
    
    performance: {
      consistency: 'across_all_phases',
      versatility: 'multi_discipline_competence',
      fitness: 'endurance_and_recovery',
      partnership: 'horse_rider_harmony'
    },
    
    development: {
      tracking: 'long_term_progression',
      analysis: 'strength_weakness_identification',
      planning: 'targeted_improvement_programs',
      goals: 'level_advancement_preparation'
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    phaseSpecific: {
      dressage: {
        focus: 'harmony_and_precision',
        prompts: [
          "Maintain consistent rhythm and tempo",
          "Focus on accurate geometry",
          "Show clear transitions",
          "Demonstrate willing partnership"
        ]
      },
      
      crossCountry: {
        focus: 'speed_endurance_courage',
        prompts: [
          "Maintain forward rhythm between fences",
          "Trust your horse's ability",
          "Ride the optimum track",
          "Monitor your horse's condition"
        ]
      },
      
      showJumping: {
        focus: 'precision_after_endurance',
        prompts: [
          "Focus on clear rounds",
          "Maintain rhythm despite fatigue",
          "Support your horse over the jumps",
          "Stay balanced and effective"
        ]
      }
    },
    
    integrated: {
      conditioning: {
        enabled: true,
        focus: 'fitness_development',
        monitoring: 'biometric_tracking',
        adaptation: 'progressive_loading'
      },
      
      strategy: {
        enabled: true,
        focus: 'competition_planning',
        analysis: 'risk_reward_assessment',
        optimization: 'performance_maximization'
      }
    },
    
    realTimeAnalysis: {
      enabled: true,
      responseTime: 100, // milliseconds
      analysisDepth: 'comprehensive',
      feedbackTypes: ['visual', 'audio', 'tactical', 'physiological']
    },
    
    securityLevel: 'TOP_SECRET'
  },

  // 🏆 Competition Mode Security
  competitionMode: {
    enabled: true,
    security: {
      dataClassification: 'TOP_SECRET',
      accessRestriction: 'officials_team_only',
      realTimeEncryption: true,
      tamperDetection: true,
      auditLogging: 'comprehensive',
      emergencyProtocols: true
    },
    
    features: {
      liveScoring: true,
      judgeInterface: true,
      timekeeperInterface: true,
      veterinaryInterface: true,
      spectatorView: 'limited',
      broadcastIntegration: true,
      emergencyResponse: true
    },
    
    intellectualProperty: {
      protection: 'maximum',
      trainingPrograms: 'confidential',
      conditioningMethods: 'restricted',
      competitionStrategies: 'top_secret',
      accessTracking: 'detailed'
    }
  },

  // 📈 Training Progression
  training: {
    levelProgression: [
      'ground_poles_and_cavalletti',
      'small_cross_country_fences',
      'basic_dressage_movements',
      'combined_training_introduction',
      'level_specific_preparation',
      'competition_conditioning',
      'advanced_level_training'
    ],
    
    conditioning: {
      phases: {
        base_fitness: {
          duration: '8_weeks',
          focus: ['cardiovascular_base', 'muscle_development', 'basic_skills'],
          intensity: 'low_to_moderate'
        },
        
        sport_specific: {
          duration: '12_weeks',
          focus: ['phase_specific_skills', 'increased_intensity', 'technical_development'],
          intensity: 'moderate_to_high'
        },
        
        competition_prep: {
          duration: '4_weeks',
          focus: ['peak_fitness', 'competition_simulation', 'fine_tuning'],
          intensity: 'high_with_recovery'
        },
        
        competition: {
          duration: 'event_specific',
          focus: ['performance_optimization', 'recovery_management', 'adaptation'],
          intensity: 'variable'
        },
        
        recovery: {
          duration: '2_4_weeks',
          focus: ['active_recovery', 'maintenance', 'injury_prevention'],
          intensity: 'low'
        }
      }
    },
    
    skills_development: {
      dressage: 'progressive_test_levels',
      crossCountry: 'fence_type_and_complexity',
      showJumping: 'height_and_technicality',
      fitness: 'endurance_and_power',
      partnership: 'trust_and_communication'
    }
  }
};

// 🔧 Utility Functions
export const calculateEventingScore = (
  dressagePercentage: number,
  crossCountryPenalties: number,
  showJumpingPenalties: number
): number => {
  // Convert dressage percentage to penalties (100 - percentage)
  const dressagePenalties = 100 - dressagePercentage;
  return dressagePenalties + crossCountryPenalties + showJumpingPenalties;
};

export const calculateOptimumTime = (
  distance: number,
  speed: number
): number => {
  return (distance / speed) * 60; // Convert to seconds
};

export const assessFitnessLevel = (
  heartRateData: number[],
  recoveryTime: number,
  workload: number
): string => {
  const avgHeartRate = heartRateData.reduce((sum, hr) => sum + hr, 0) / heartRateData.length;
  const maxHeartRate = Math.max(...heartRateData);
  
  if (recoveryTime <= 10 && maxHeartRate <= 180 && avgHeartRate <= 150) {
    return 'excellent';
  } else if (recoveryTime <= 15 && maxHeartRate <= 190 && avgHeartRate <= 160) {
    return 'good';
  } else if (recoveryTime <= 20 && maxHeartRate <= 200 && avgHeartRate <= 170) {
    return 'fair';
  } else {
    return 'needs_improvement';
  }
};

export const analyzeCrossCountryPerformance = (
  optimumTime: number,
  actualTime: number,
  jumpPenalties: number,
  heartRateData: number[]
): any => {
  const timeDifference = actualTime - optimumTime;
  const timePenalties = Math.max(0, timeDifference * 0.4);
  const totalPenalties = jumpPenalties + timePenalties;
  
  return {
    timePenalties,
    jumpPenalties,
    totalPenalties,
    efficiency: optimumTime / actualTime,
    fitnessScore: assessFitnessLevel(heartRateData, 0, 1) // Simplified
  };
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'training_programs': 'TOP_SECRET',
    'conditioning_data': 'RESTRICTED',
    'competition_strategy': 'TOP_SECRET',
    'performance_analysis': 'CONFIDENTIAL',
    'fitness_data': 'RESTRICTED',
    'veterinary_data': 'CONFIDENTIAL'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const predictEventingReadiness = (
  dressageScores: number[],
  crossCountryTimes: number[],
  showJumpingFaults: number[],
  fitnessData: any
): any => {
  // AI-based readiness assessment
  return {
    overallReadiness: 'calculated_percentage',
    phaseReadiness: {
      dressage: 'assessed_level',
      crossCountry: 'assessed_level',
      showJumping: 'assessed_level'
    },
    recommendations: 'targeted_improvements',
    timeline: 'estimated_preparation_time'
  };
}; 