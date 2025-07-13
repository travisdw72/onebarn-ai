import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const dressageConfig = {
  // 🎭 Discipline Information
  discipline: {
    name: 'Dressage',
    description: 'Classical training and competition emphasizing harmony, precision, and athletic development',
    category: 'classical_discipline',
    competitionLevel: 'olympic',
    icon: 'EmojiEvents',
    color: brandConfig.colors.hunterGreen,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'CONFIDENTIAL', // Training methods and scores are valuable
      competitiveIntelligence: true,
      intellectualProperty: ['training_progressions', 'movement_techniques', 'scoring_strategies'],
      accessControl: 'trainer_rider_judge',
      retentionPolicy: '5_years', // Longer retention for progression tracking
      sharingRestrictions: ['no_competitors', 'judge_trainer_only']
    }
  },

  // ⏱️ Movement Timing System (Precision Analysis)
  timing: {
    precision: 0.1, // 100ms precision for movement quality
    movements: {
      halt_salute: {
        name: 'Halt and Salute',
        description: 'Entry halt and salute to judge',
        targetDuration: { min: 3.0, max: 6.0, optimal: 4.0 },
        qualityFactors: ['straightness', 'immobility', 'attention', 'salute_execution'],
        securityLevel: 'INTERNAL'
      },
      working_trot: {
        name: 'Working Trot',
        description: 'Basic trot with regular rhythm and tempo',
        targetTempo: { min: 140, max: 150, optimal: 145 }, // steps per minute
        qualityFactors: ['rhythm', 'regularity', 'contact', 'impulsion'],
        securityLevel: 'CONFIDENTIAL'
      },
      medium_trot: {
        name: 'Medium Trot',
        description: 'Extended trot with increased stride length',
        targetTempo: { min: 135, max: 145, optimal: 140 },
        strideLength: { min: 2.8, max: 3.2, optimal: 3.0 }, // meters
        qualityFactors: ['extension', 'balance', 'rhythm_maintenance', 'collection_return'],
        securityLevel: 'CONFIDENTIAL'
      },
      collected_trot: {
        name: 'Collected Trot',
        description: 'Shortened, elevated trot with increased engagement',
        targetTempo: { min: 145, max: 155, optimal: 150 },
        strideLength: { min: 2.2, max: 2.6, optimal: 2.4 },
        qualityFactors: ['collection', 'elevation', 'engagement', 'lightness'],
        securityLevel: 'RESTRICTED'
      },
      shoulder_in: {
        name: 'Shoulder-in',
        description: 'Lateral movement with horse bent around inside leg',
        targetAngle: { min: 28, max: 32, optimal: 30 }, // degrees
        qualityFactors: ['bend', 'angle_consistency', 'forward_movement', 'rhythm'],
        securityLevel: 'RESTRICTED'
      },
      half_pass: {
        name: 'Half-pass',
        description: 'Diagonal lateral movement with bend toward direction',
        targetAngle: { min: 25, max: 35, optimal: 30 },
        qualityFactors: ['bend', 'crossing', 'forward_sideways', 'collection'],
        securityLevel: 'RESTRICTED'
      },
      flying_change: {
        name: 'Flying Change',
        description: 'Change of canter lead in the air',
        targetTiming: { preparation: 2.0, execution: 0.5, confirmation: 1.0 },
        qualityFactors: ['preparation', 'straightness', 'jump_moment', 'confirmation'],
        securityLevel: 'RESTRICTED'
      },
      piaffe: {
        name: 'Piaffe',
        description: 'Trot in place with maximum collection',
        targetTempo: { min: 28, max: 32, optimal: 30 }, // steps per minute
        qualityFactors: ['elevation', 'regularity', 'engagement', 'balance'],
        securityLevel: 'TOP_SECRET' // Highest level movement
      },
      passage: {
        name: 'Passage',
        description: 'Elevated trot with moment of suspension',
        targetTempo: { min: 50, max: 60, optimal: 55 },
        suspensionTime: { min: 0.3, max: 0.5, optimal: 0.4 },
        qualityFactors: ['elevation', 'suspension', 'regularity', 'cadence'],
        securityLevel: 'TOP_SECRET'
      }
    },
    
    // Competition Standards
    competitionStandards: {
      levels: {
        training: { maxScore: 10, passingScore: 6.0 },
        first: { maxScore: 10, passingScore: 6.0 },
        second: { maxScore: 10, passingScore: 6.0 },
        third: { maxScore: 10, passingScore: 6.0 },
        fourth: { maxScore: 10, passingScore: 6.0 },
        prix_st_georges: { maxScore: 10, passingScore: 6.0 },
        intermediate_i: { maxScore: 10, passingScore: 6.0 },
        intermediate_ii: { maxScore: 10, passingScore: 6.0 },
        grand_prix: { maxScore: 10, passingScore: 6.0 }
      },
      judging: {
        scales: ['rhythm', 'suppleness', 'contact', 'impulsion', 'straightness', 'collection'],
        coefficients: [1, 2, 3], // Movement importance multipliers
        collectiveMarks: ['gaits', 'impulsion', 'submission', 'rider_position']
      }
    },
    
    // Timing Equipment Security
    equipment: {
      videoAnalysis: {
        cameras: {
          primary: {
            type: 'high_speed_4k',
            frameRate: 120,
            resolution: '4K',
            encryption: 'AES-256',
            watermarking: true,
            angles: ['front', 'side', 'rear', 'overhead']
          },
          movement_tracking: {
            type: 'motion_capture',
            accuracy: 0.01, // centimeter precision
            sampleRate: 1000, // Hz
            encryption: true,
            realTimeProcessing: true
          }
        }
      },
      biometricSensors: {
        horse: {
          heartRate: { sampleRate: 100, accuracy: 1 },
          gaitAnalysis: { sampleRate: 1000, precision: 0.001 },
          temperatureMonitoring: true,
          stressIndicators: true
        },
        rider: {
          positionTracking: true,
          balanceAnalysis: true,
          aidApplication: true,
          heartRateMonitoring: true
        }
      }
    }
  },

  // 🎯 Movement Quality Analysis
  movementAnalysis: {
    rhythm: {
      description: 'Regularity and tempo of gaits',
      parameters: {
        regularity: { min: 85, max: 100, optimal: 95 }, // percentage
        tempo_consistency: { variance: 5 }, // percentage allowed
        beat_clarity: { threshold: 0.9 }
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        patternRecognition: true,
        anomalyDetection: true,
        confidenceThreshold: 0.88
      },
      securityLevel: 'CONFIDENTIAL'
    },
    suppleness: {
      description: 'Flexibility and looseness of movement',
      parameters: {
        lateral_bend: { min: 15, max: 35, optimal: 25 }, // degrees
        longitudinal_flexion: { range: 20 }, // degrees
        muscle_relaxation: { tension_threshold: 0.3 }
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        biomechanicalAnalysis: true,
        confidenceThreshold: 0.82
      },
      securityLevel: 'CONFIDENTIAL'
    },
    contact: {
      description: 'Connection between horse and rider through reins',
      parameters: {
        rein_tension: { min: 2, max: 8, optimal: 5 }, // kg force
        consistency: { variance: 15 }, // percentage
        elasticity: { response_time: 0.2 } // seconds
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        pressureAnalysis: true,
        confidenceThreshold: 0.85
      },
      securityLevel: 'RESTRICTED'
    },
    impulsion: {
      description: 'Desire to move forward with energy',
      parameters: {
        engagement: { hind_leg_reach: 0.8 }, // stride overlap ratio
        thrust: { power_output: 'measured' },
        elasticity: { spring_coefficient: 'calculated' }
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        powerAnalysis: true,
        confidenceThreshold: 0.87
      },
      securityLevel: 'RESTRICTED'
    },
    straightness: {
      description: 'Alignment of horse on straight and curved lines',
      parameters: {
        spinal_alignment: { deviation: 5 }, // degrees max
        track_accuracy: { variance: 10 }, // cm
        lateral_balance: { weight_distribution: 0.5 } // 50/50 ideal
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        geometryAnalysis: true,
        confidenceThreshold: 0.90
      },
      securityLevel: 'CONFIDENTIAL'
    },
    collection: {
      description: 'Shortening and elevation of frame with engagement',
      parameters: {
        frame_shortening: { percentage: 15 }, // from working frame
        elevation: { front_end_lift: 10 }, // degrees
        engagement: { hind_leg_angle: 45 } // degrees
      },
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        biomechanicalAnalysis: true,
        confidenceThreshold: 0.92
      },
      securityLevel: 'TOP_SECRET'
    }
  },

  // 📊 Scoring and Assessment
  scoring: {
    movementScoring: {
      scale: { min: 0, max: 10, increment: 0.5 },
      qualityDescriptors: {
        10: 'Excellent',
        9: 'Very Good',
        8: 'Good',
        7: 'Fairly Good',
        6: 'Satisfactory',
        5: 'Sufficient',
        4: 'Insufficient',
        3: 'Fairly Bad',
        2: 'Bad',
        1: 'Very Bad',
        0: 'Not Executed'
      },
      coefficients: {
        basic_movements: 1,
        medium_movements: 2,
        advanced_movements: 3
      }
    },
    collectiveMarks: {
      gaits: {
        description: 'Freedom and regularity of gaits',
        weight: 1,
        factors: ['walk_quality', 'trot_quality', 'canter_quality']
      },
      impulsion: {
        description: 'Desire to move forward, elasticity, suppleness',
        weight: 1,
        factors: ['energy', 'elasticity', 'engagement']
      },
      submission: {
        description: 'Attention, confidence, harmony, obedience',
        weight: 2,
        factors: ['attention', 'confidence', 'harmony', 'obedience']
      },
      rider: {
        description: 'Position, seat, influence of aids',
        weight: 1,
        factors: ['position', 'seat', 'aid_application', 'effectiveness']
      }
    },
    progressTracking: {
      enabled: true,
      metrics: ['consistency', 'improvement_rate', 'competition_readiness'],
      historicalComparison: true,
      goalSetting: true,
      securityLevel: 'CONFIDENTIAL'
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    realTimeAnalysis: {
      enabled: true,
      responseTime: 50, // milliseconds
      analysisDepth: 'comprehensive',
      feedbackTypes: ['visual', 'audio', 'haptic']
    },
    coachingPrompts: {
      rhythm_issues: [
        "Focus on maintaining consistent tempo",
        "Listen to the beat of the gait",
        "Use your seat to influence rhythm",
        "Check for tension affecting regularity"
      ],
      contact_problems: [
        "Soften your hands while maintaining connection",
        "Think of elastic contact, not rigid",
        "Use your seat and legs to create contact",
        "Allow the horse to seek the bit"
      ],
      impulsion_lacking: [
        "Engage your horse's hindquarters",
        "Think forward while maintaining balance",
        "Use your legs to create energy",
        "Channel energy into collection, not speed"
      ],
      straightness_deviation: [
        "Align your horse's shoulders with hips",
        "Use inside leg to outside rein",
        "Check your own position and balance",
        "Think of riding from inside leg to outside rein"
      ],
      collection_issues: [
        "Half-halt to rebalance",
        "Engage the hindquarters first",
        "Think up and forward, not back",
        "Maintain impulsion while collecting"
      ]
    },
    adaptiveLearning: {
      enabled: true,
      learningRate: 0.1,
      personalizedFeedback: true,
      progressAdaptation: true
    },
    securityLevel: 'RESTRICTED'
  },

  // 🏆 Competition Mode Security
  competitionMode: {
    enabled: true,
    security: {
      dataClassification: 'TOP_SECRET',
      accessRestriction: 'competition_officials_only',
      realTimeEncryption: true,
      tamperDetection: true,
      auditLogging: 'comprehensive'
    },
    features: {
      liveScoring: true,
      judgeInterface: true,
      spectatorView: 'limited',
      broadcastIntegration: true,
      resultValidation: true
    },
    intellectualProperty: {
      protection: 'maximum',
      watermarking: 'visible_invisible',
      accessTracking: 'detailed',
      sharingRestrictions: 'strict'
    }
  },

  // 📈 Training Progression Tracking
  progression: {
    levels: [
      'training_level',
      'first_level',
      'second_level',
      'third_level',
      'fourth_level',
      'prix_st_georges',
      'intermediate_i',
      'intermediate_ii',
      'grand_prix'
    ],
    requirements: {
      training_level: {
        movements: ['working_gaits', 'free_walk', 'halt_salute'],
        minScores: { average: 6.0, individual: 5.0 }
      },
      first_level: {
        movements: ['lengthening', 'leg_yield', 'circles'],
        minScores: { average: 6.0, individual: 5.0 }
      },
      // ... additional levels would be defined here
    },
    tracking: {
      consistency: true,
      improvement: true,
      readiness: true,
      weaknesses: true,
      strengths: true
    }
  }
};

// 🔧 Utility Functions
export const calculateMovementScore = (
  movement: string,
  qualityFactors: Record<string, number>
): number => {
  const config = dressageConfig.timing.movements[movement as keyof typeof dressageConfig.timing.movements];
  if (!config) return 0;

  let totalScore = 0;
  let factorCount = 0;

  config.qualityFactors.forEach(factor => {
    if (qualityFactors[factor] !== undefined) {
      totalScore += qualityFactors[factor];
      factorCount++;
    }
  });

  return factorCount > 0 ? Math.round((totalScore / factorCount) * 2) / 2 : 0; // Round to nearest 0.5
};

export const assessTrainingLevel = (scores: Record<string, number>): string => {
  const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
  
  if (averageScore >= 7.5) return 'advanced';
  if (averageScore >= 6.5) return 'intermediate';
  if (averageScore >= 5.5) return 'developing';
  return 'beginner';
};

export const getSecurityLevel = (dataType: string): string => {
  const securityMap: Record<string, string> = {
    'basic_movements': 'CONFIDENTIAL',
    'advanced_movements': 'RESTRICTED',
    'grand_prix_movements': 'TOP_SECRET',
    'competition_scores': 'RESTRICTED',
    'training_methods': 'CONFIDENTIAL',
    'judge_comments': 'RESTRICTED'
  };
  
  return securityMap[dataType] || 'INTERNAL';
};

export const validateCompetitionMode = (sessionData: any): boolean => {
  const requiredFields = ['judge_id', 'competition_id', 'level', 'test_number'];
  return requiredFields.every(field => sessionData[field] !== undefined);
};

export const generateTrainingPlan = (
  currentLevel: string,
  weaknesses: string[],
  goals: string[]
): any => {
  // Training plan generation logic would be implemented here
  return {
    level: currentLevel,
    focus_areas: weaknesses,
    objectives: goals,
    timeline: '12_weeks',
    securityLevel: 'CONFIDENTIAL'
  };
}; 