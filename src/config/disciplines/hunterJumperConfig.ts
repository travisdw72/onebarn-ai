import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const hunterJumperConfig = {
  // 🦌 Discipline Information
  discipline: {
    name: 'Hunter/Jumper',
    description: 'English riding discipline emphasizing style, consistency, and smooth performance',
    category: 'english_style',
    competitionLevel: 'professional',
    icon: 'Terrain',
    color: brandConfig.colors.hunterGreen,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'CONFIDENTIAL', // Style and training methods are valuable
      competitiveIntelligence: true,
      intellectualProperty: ['training_methods', 'style_development', 'consistency_techniques'],
      accessControl: 'trainer_rider_judge',
      retentionPolicy: '3_years',
      sharingRestrictions: ['no_competitors', 'trainer_network_only']
    }
  },

  // ⏱️ Course Timing and Flow
  timing: {
    precision: 0.1, // 100ms precision for rhythm analysis
    phases: {
      course_walk: {
        name: 'Course Walk',
        description: 'Pre-round course inspection',
        allowedTime: { min: 300, max: 900, optimal: 600 }, // seconds
        activities: ['stride_counting', 'line_planning', 'rhythm_visualization'],
        securityLevel: 'INTERNAL'
      },
      warm_up: {
        name: 'Warm-up',
        description: 'Horse and rider preparation focusing on rhythm',
        duration: { min: 1200, max: 2400, optimal: 1800 },
        phases: ['flat_work', 'rhythm_establishment', 'jump_preparation'],
        securityLevel: 'INTERNAL'
      },
      hunter_round: {
        name: 'Hunter Round',
        description: 'Judged on style, consistency, and way of going',
        emphasis: 'rhythm_and_style',
        judging: 'subjective_scoring',
        faultSystem: 'style_based',
        securityLevel: 'CONFIDENTIAL'
      },
      jumper_round: {
        name: 'Jumper Round',
        description: 'Objective scoring based on faults and time',
        emphasis: 'clear_and_fast',
        judging: 'objective_scoring',
        faultSystem: 'penalty_based',
        securityLevel: 'RESTRICTED'
      }
    },
    
    // Course Standards
    courseStandards: {
      hunterSpeeds: {
        children: 275, // meters per minute
        adult_amateur: 300,
        professional: 325,
        grand_prix: 350
      },
      jumperSpeeds: {
        children: 300,
        adult_amateur: 325,
        professional: 350,
        grand_prix: 375
      },
      jumpHeights: {
        children_hunter: { min: 0.60, max: 1.00 },
        adult_hunter: { min: 0.90, max: 1.20 },
        professional_hunter: { min: 1.10, max: 1.30 },
        children_jumper: { min: 0.80, max: 1.15 },
        adult_jumper: { min: 1.00, max: 1.35 },
        grand_prix_jumper: { min: 1.40, max: 1.60 }
      }
    },
    
    // Equipment
    equipment: {
      timingSystem: {
        hunter: {
          type: 'rhythm_analysis',
          precision: 0.1,
          focus: 'consistency_measurement'
        },
        jumper: {
          type: 'precision_timing',
          precision: 0.01,
          focus: 'speed_measurement'
        }
      },
      videoAnalysis: {
        cameras: {
          side_view: { angle: 90, focus: 'style_analysis' },
          front_view: { angle: 0, focus: 'straightness' },
          overhead: { angle: 180, focus: 'track_accuracy' }
        },
        frameRate: 60,
        resolution: '4K',
        encryption: 'AES-256'
      }
    }
  },

  // 🎨 Style Analysis (Hunter Focus)
  styleAnalysis: {
    wayOfGoing: {
      rhythm: {
        name: 'Rhythm',
        description: 'Consistent, regular beat in all gaits',
        measurement: 'tempo_consistency',
        importance: 'critical',
        parameters: {
          consistency: { variance: 3 }, // percentage allowed
          regularity: { threshold: 95 }, // percentage
          maintenance: 'throughout_course'
        },
        aiAnalysis: {
          enabled: true,
          realTimeMonitoring: true,
          deviationDetection: true,
          confidenceThreshold: 0.90
        }
      },
      
      impulsion: {
        name: 'Impulsion',
        description: 'Forward energy and engagement',
        measurement: 'energy_assessment',
        importance: 'high',
        parameters: {
          forwardness: 'consistent_energy',
          engagement: 'hind_end_activity',
          elasticity: 'spring_in_step'
        },
        aiAnalysis: {
          enabled: true,
          energyTracking: true,
          engagementAnalysis: true,
          confidenceThreshold: 0.85
        }
      },
      
      balance: {
        name: 'Balance',
        description: 'Self-carriage and equilibrium',
        measurement: 'stability_analysis',
        importance: 'critical',
        parameters: {
          selfCarriage: 'independent_balance',
          equilibrium: 'steady_frame',
          collection: 'appropriate_for_level'
        },
        aiAnalysis: {
          enabled: true,
          stabilityTracking: true,
          balanceAssessment: true,
          confidenceThreshold: 0.88
        }
      },
      
      manners: {
        name: 'Manners',
        description: 'Obedience and cooperation',
        measurement: 'behavioral_assessment',
        importance: 'high',
        parameters: {
          obedience: 'responsive_to_aids',
          cooperation: 'willing_attitude',
          consistency: 'reliable_behavior'
        },
        aiAnalysis: {
          enabled: true,
          behaviorTracking: true,
          complianceMonitoring: true,
          confidenceThreshold: 0.82
        }
      }
    },
    
    jumpingStyle: {
      takeoff: {
        parameters: {
          distance: { optimal: 'appropriate_for_jump' },
          power: 'sufficient_but_not_excessive',
          technique: 'smooth_and_efficient'
        },
        faults: ['too_close', 'too_far', 'insufficient_power', 'overjumping']
      },
      
      form: {
        parameters: {
          front_legs: 'even_and_tight',
          hind_legs: 'clear_and_efficient',
          back: 'round_and_athletic',
          head_neck: 'appropriate_position'
        },
        faults: ['uneven_legs', 'hanging_legs', 'hollow_back', 'head_position']
      },
      
      landing: {
        parameters: {
          recovery: 'quick_and_balanced',
          rhythm: 'immediate_resumption',
          straightness: 'maintained_line'
        },
        faults: ['slow_recovery', 'rhythm_break', 'drift_on_landing']
      }
    },
    
    securityLevel: 'CONFIDENTIAL'
  },

  // 🏃 Performance Analysis (Jumper Focus)
  performanceAnalysis: {
    speed: {
      optimization: {
        name: 'Speed Optimization',
        focus: 'efficient_lines_and_pace',
        measurement: 'time_analysis',
        factors: ['track_efficiency', 'pace_management', 'turn_optimization'],
        aiAnalysis: {
          enabled: true,
          routeOptimization: true,
          speedAnalysis: true,
          confidenceThreshold: 0.92
        }
      }
    },
    
    accuracy: {
      jumping: {
        name: 'Jumping Accuracy',
        focus: 'clear_rounds',
        measurement: 'fault_analysis',
        factors: ['takeoff_precision', 'technique_consistency', 'power_management'],
        aiAnalysis: {
          enabled: true,
          faultPrediction: true,
          techniqueAnalysis: true,
          confidenceThreshold: 0.89
        }
      }
    },
    
    consistency: {
      performance: {
        name: 'Performance Consistency',
        focus: 'reliable_results',
        measurement: 'statistical_analysis',
        factors: ['fault_patterns', 'time_consistency', 'pressure_performance'],
        aiAnalysis: {
          enabled: true,
          patternRecognition: true,
          consistencyTracking: true,
          confidenceThreshold: 0.87
        }
      }
    },
    
    securityLevel: 'RESTRICTED'
  },

  // 📊 Scoring Systems
  scoring: {
    hunter: {
      scale: { min: 0, max: 100, increment: 0.5 },
      components: {
        wayOfGoing: {
          weight: 0.4,
          factors: ['rhythm', 'impulsion', 'balance', 'manners']
        },
        jumpingStyle: {
          weight: 0.4,
          factors: ['form', 'technique', 'scope', 'consistency']
        },
        overall: {
          weight: 0.2,
          factors: ['impression', 'suitability', 'quality']
        }
      },
      faults: {
        minor: {
          slight_rub: -1,
          minor_form_fault: -2,
          rhythm_break: -3
        },
        major: {
          rail_down: -4,
          refusal: -6,
          major_form_fault: -5
        },
        severe: {
          fall: 'elimination',
          dangerous_riding: 'elimination',
          off_course: 'elimination'
        }
      }
    },
    
    jumper: {
      faultSystem: 'penalty_based',
      penalties: {
        rail_down: 4,
        first_refusal: 4,
        second_refusal: 8,
        third_refusal: 'elimination',
        time_fault: 1 // per second over time allowed
      },
      jumpOff: {
        scoring: 'time_based',
        faults: 'carry_forward',
        strategy: 'speed_vs_accuracy'
      }
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    hunterCoaching: {
      enabled: true,
      focus: 'style_and_consistency',
      realTimeAnalysis: {
        responseTime: 100, // milliseconds
        analysisDepth: 'comprehensive',
        feedbackTypes: ['visual', 'audio', 'positional']
      },
      coachingPrompts: {
        rhythm: [
          "Maintain consistent tempo throughout",
          "Listen to your horse's natural rhythm",
          "Use your seat to influence the beat",
          "Keep the same pace between jumps"
        ],
        style: [
          "Keep your horse round and balanced",
          "Maintain steady contact and frame",
          "Encourage natural jumping form",
          "Stay quiet and supportive over jumps"
        ],
        consistency: [
          "Ride every jump the same way",
          "Maintain your plan throughout",
          "Don't change your approach mid-course",
          "Trust your preparation and training"
        ]
      }
    },
    
    jumperCoaching: {
      enabled: true,
      focus: 'speed_and_accuracy',
      realTimeAnalysis: {
        responseTime: 75,
        analysisDepth: 'tactical',
        feedbackTypes: ['visual', 'audio', 'strategic']
      },
      coachingPrompts: {
        speed: [
          "Take efficient lines between jumps",
          "Maintain forward pace in turns",
          "Save time on straight lines",
          "Balance speed with accuracy"
        ],
        accuracy: [
          "Focus on clear rounds first",
          "Maintain rhythm to each jump",
          "Don't sacrifice technique for speed",
          "Trust your horse's scope"
        ],
        strategy: [
          "Plan your track during course walk",
          "Identify where to save time",
          "Know your horse's optimal pace",
          "Adjust strategy based on conditions"
        ]
      }
    },
    
    securityLevel: 'CONFIDENTIAL'
  },

  // 🏆 Competition Modes
  competitionMode: {
    hunter: {
      enabled: true,
      judging: 'subjective',
      focus: 'style_and_way_of_going',
      security: {
        dataClassification: 'CONFIDENTIAL',
        accessRestriction: 'judges_stewards',
        scoringTransparency: 'limited'
      }
    },
    
    jumper: {
      enabled: true,
      judging: 'objective',
      focus: 'faults_and_time',
      security: {
        dataClassification: 'RESTRICTED',
        accessRestriction: 'officials_only',
        scoringTransparency: 'full'
      }
    },
    
    intellectualProperty: {
      protection: 'high',
      trainingMethods: 'confidential',
      styleSecrets: 'restricted',
      accessTracking: 'detailed'
    }
  },

  // 📈 Training Progression
  training: {
    hunterProgression: [
      'flat_work_foundation',
      'rhythm_development',
      'basic_jumping',
      'course_work',
      'style_refinement',
      'competition_preparation'
    ],
    
    jumperProgression: [
      'basic_jumping',
      'technical_skills',
      'speed_development',
      'course_strategy',
      'competition_tactics',
      'advanced_competition'
    ],
    
    developmentPlan: {
      foundation: {
        duration: '6_months',
        focus: ['basic_position', 'rhythm_establishment', 'simple_jumping'],
        goals: ['secure_seat', 'consistent_rhythm', 'confident_jumping']
      },
      development: {
        duration: '12_months',
        focus: ['style_development', 'course_work', 'consistency'],
        goals: ['polished_style', 'course_completion', 'reliable_performance']
      },
      competition: {
        duration: 'ongoing',
        focus: ['competition_skills', 'pressure_performance', 'advanced_techniques'],
        goals: ['consistent_placings', 'championship_level', 'professional_quality']
      }
    }
  }
};

// 🔧 Utility Functions
export const calculateHunterScore = (
  wayOfGoing: number,
  jumpingStyle: number,
  overall: number,
  faults: number[]
): number => {
  const baseScore = (wayOfGoing * 0.4) + (jumpingStyle * 0.4) + (overall * 0.2);
  const totalFaults = faults.reduce((sum, fault) => sum + fault, 0);
  return Math.max(0, Math.min(100, baseScore - totalFaults));
};

export const calculateJumperScore = (
  faults: number,
  timeAllowed: number,
  actualTime: number
): number => {
  const timeFaults = Math.max(0, actualTime - timeAllowed);
  return faults + timeFaults;
};

export const analyzeRhythmConsistency = (
  tempoData: number[]
): { consistency: number, variance: number } => {
  const average = tempoData.reduce((sum, tempo) => sum + tempo, 0) / tempoData.length;
  const variance = tempoData.reduce((sum, tempo) => sum + Math.pow(tempo - average, 2), 0) / tempoData.length;
  const consistency = Math.max(0, 100 - (Math.sqrt(variance) / average * 100));
  
  return { consistency, variance };
};

export const assessJumpingForm = (
  formData: {
    frontLegs: number,
    hindLegs: number,
    back: number,
    headNeck: number
  }
): number => {
  const weights = { frontLegs: 0.3, hindLegs: 0.3, back: 0.25, headNeck: 0.15 };
  return Object.entries(formData).reduce((score, [key, value]) => {
    return score + (value * weights[key as keyof typeof weights]);
  }, 0);
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'training_methods': 'CONFIDENTIAL',
    'style_analysis': 'CONFIDENTIAL',
    'competition_strategy': 'RESTRICTED',
    'performance_data': 'INTERNAL',
    'judging_criteria': 'CONFIDENTIAL'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const optimizeJumperTrack = (
  courseData: any,
  horseCapabilities: any
): any => {
  // Track optimization algorithm for jumper courses
  return {
    recommendedTrack: 'calculated_path',
    estimatedTime: 'predicted_time',
    riskAssessment: 'analyzed_risks',
    strategy: 'optimal_approach'
  };
}; 