import { brandConfig } from '../brandConfig';
import { zeroTrustTrainingConfig } from '../zeroTrustTrainingConfig';

export const barrelRacingConfig = {
  // 🏁 Discipline Information
  discipline: {
    name: 'Barrel Racing',
    description: 'High-speed precision sport requiring tight turns around barrels',
    category: 'speed_event',
    competitionLevel: 'professional',
    icon: 'Speed',
    color: brandConfig.colors.victoryRose,
    
    // Zero Trust Security Classification
    security: {
      dataClassification: 'RESTRICTED', // Competition times are highly sensitive
      competitiveIntelligence: true,
      intellectualProperty: ['training_methods', 'timing_strategies', 'horse_preparation'],
      accessControl: 'need_to_know',
      retentionPolicy: '3_years',
      sharingRestrictions: ['no_competitors', 'trainer_owner_only']
    }
  },

  // ⏱️ Timing System Configuration (Millisecond Precision)
  timing: {
    precision: 0.001, // 1 millisecond accuracy
    segments: {
      start_to_barrel1: {
        name: 'Start to Barrel 1',
        description: 'Initial acceleration and approach to first barrel',
        targetTime: { min: 3.5, max: 4.2, optimal: 3.8 },
        criticalFactors: ['acceleration', 'line_accuracy', 'approach_angle'],
        securityLevel: 'RESTRICTED'
      },
      "barrel1_turn": {
        name: 'Barrel 1 Turn',
        description: 'First barrel turn execution',
        targetTime: { min: 1.8, max: 2.5, optimal: 2.1 },
        criticalFactors: ['entry_speed', 'turn_radius', 'exit_acceleration'],
        securityLevel: 'RESTRICTED'
      },
      "barrel1_to_barrel2": {
        name: 'Barrel 1 to Barrel 2',
        description: 'Straight line between first and second barrel',
        targetTime: { min: 2.2, max: 2.8, optimal: 2.4 },
        criticalFactors: ['straightness', 'speed_maintenance', 'preparation'],
        securityLevel: 'CONFIDENTIAL'
      },
      "barrel2_turn": {
        name: 'Barrel 2 Turn',
        description: 'Second barrel turn execution',
        targetTime: { min: 1.8, max: 2.5, optimal: 2.0 },
        criticalFactors: ['approach_angle', 'turn_quality', 'balance'],
        securityLevel: 'RESTRICTED'
      },
      "barrel2_to_barrel3": {
        name: 'Barrel 2 to Barrel 3',
        description: 'Diagonal run to third barrel',
        targetTime: { min: 3.0, max: 3.8, optimal: 3.3 },
        criticalFactors: ['diagonal_accuracy', 'speed_control', 'positioning'],
        securityLevel: 'CONFIDENTIAL'
      },
      "barrel3_turn": {
        name: 'Barrel 3 Turn',
        description: 'Third barrel turn execution',
        targetTime: { min: 1.8, max: 2.5, optimal: 1.9 },
        criticalFactors: ['tight_turn', 'exit_speed', 'home_preparation'],
        securityLevel: 'RESTRICTED'
      },
      "barrel3_to_finish": {
        name: 'Barrel 3 to Finish',
        description: 'Final sprint to finish line',
        targetTime: { min: 3.8, max: 4.5, optimal: 4.0 },
        criticalFactors: ['maximum_speed', 'straightness', 'finish_strong'],
        securityLevel: 'RESTRICTED'
      }
    },
    
    // Competition Standards
    competitionStandards: {
      worldRecord: 13.11, // seconds
      professionalAverage: 15.5,
      amateurAverage: 17.2,
      penaltyTime: 5.0, // seconds for knocked barrel
      noTime: true // If pattern not completed correctly
    },
    
    // Timing Equipment Security
    equipment: {
      timingGates: {
        primary: {
          type: 'laser_gate',
          accuracy: 0.001,
          certification: 'PRCA_approved',
          encryption: true,
          tamperDetection: true,
          backupRequired: true
        },
        backup: {
          type: 'photo_finish',
          accuracy: 0.01,
          certification: 'secondary_standard',
          encryption: true
        }
      },
      videoSynchronization: {
        frameRate: 240, // fps for slow motion analysis
        resolution: '4K',
        encryption: 'AES-256',
        watermarking: true,
        timestampAccuracy: 0.001
      }
    }
  },

  // 🎯 Turn Analysis Parameters
  turnAnalysis: {
    barrel1: {
      optimalApproachAngle: { min: 25, max: 35, optimal: 30 }, // degrees
      optimalTurnRadius: { min: 8, max: 12, optimal: 10 }, // feet
      speedReduction: { min: 15, max: 25, optimal: 20 }, // percentage
      barrelProximity: { min: 6, max: 18, optimal: 12 }, // inches
      exitAngle: { min: 15, max: 25, optimal: 20 }, // degrees
      criticalMetrics: ['approach_speed', 'turn_initiation', 'barrel_clearance', 'exit_acceleration'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        patternRecognition: true,
        anomalyDetection: true,
        confidenceThreshold: 0.85
      }
    },
    barrel2: {
      optimalApproachAngle: { min: 20, max: 30, optimal: 25 },
      optimalTurnRadius: { min: 8, max: 12, optimal: 9 },
      speedReduction: { min: 18, max: 28, optimal: 22 },
      barrelProximity: { min: 6, max: 18, optimal: 10 },
      exitAngle: { min: 45, max: 55, optimal: 50 }, // Diagonal to barrel 3
      criticalMetrics: ['diagonal_setup', 'turn_efficiency', 'speed_maintenance', 'positioning'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        patternRecognition: true,
        anomalyDetection: true,
        confidenceThreshold: 0.80
      }
    },
    barrel3: {
      optimalApproachAngle: { min: 35, max: 45, optimal: 40 },
      optimalTurnRadius: { min: 7, max: 11, optimal: 8 }, // Tightest turn
      speedReduction: { min: 20, max: 30, optimal: 25 },
      barrelProximity: { min: 6, max: 18, optimal: 8 }, // Closest approach
      exitAngle: { min: 0, max: 10, optimal: 5 }, // Straight home
      criticalMetrics: ['tight_turn', 'balance_maintenance', 'home_setup', 'final_acceleration'],
      aiAnalysis: {
        enabled: true,
        realTimeCoaching: true,
        patternRecognition: true,
        anomalyDetection: true,
        confidenceThreshold: 0.90
      }
    }
  },

  // 🚀 Speed Analysis Configuration
  speedAnalysis: {
    zones: {
      acceleration: {
        name: 'Acceleration Zone',
        description: 'Initial speed building from start',
        location: 'start_to_barrel1',
        targetSpeed: { min: 25, max: 35, optimal: 30 }, // mph
        accelerationRate: { min: 8, max: 12, optimal: 10 }, // mph/second
        criticalFactors: ['horse_fitness', 'rider_position', 'ground_conditions'],
        securityLevel: 'CONFIDENTIAL'
      },
      maintenance: {
        name: 'Speed Maintenance',
        description: 'Maintaining speed between barrels',
        location: 'between_barrels',
        targetSpeed: { min: 28, max: 32, optimal: 30 },
        speedVariation: { max: 3 }, // mph variation allowed
        criticalFactors: ['rhythm', 'balance', 'line_accuracy'],
        securityLevel: 'CONFIDENTIAL'
      },
      deceleration: {
        name: 'Turn Deceleration',
        description: 'Speed reduction for barrel turns',
        location: 'barrel_approaches',
        speedReduction: { min: 15, max: 30, optimal: 22 }, // percentage
        decelerationRate: { min: 10, max: 15, optimal: 12 }, // mph/second
        criticalFactors: ['timing', 'balance', 'preparation'],
        securityLevel: 'RESTRICTED'
      },
      finalSprint: {
        name: 'Final Sprint',
        description: 'Maximum speed to finish line',
        location: 'barrel3_to_finish',
        targetSpeed: { min: 32, max: 40, optimal: 36 },
        accelerationRate: { min: 6, max: 10, optimal: 8 },
        criticalFactors: ['horse_conditioning', 'final_effort', 'straightness'],
        securityLevel: 'RESTRICTED'
      }
    },
    
    // Speed Monitoring Equipment
    monitoring: {
      radarGuns: {
        accuracy: 0.1, // mph
        sampleRate: 100, // Hz
        encryption: true,
        realTimeTransmission: true
      },
      gpsTracking: {
        accuracy: 0.1, // meters
        sampleRate: 10, // Hz
        encryption: true,
        geofencing: true
      }
    }
  },

  // 🤖 AI Coaching Configuration
  aiCoaching: {
    realTimePrompts: {
      approach: [
        'Maintain straight line to barrel {barrel_number}',
        'Adjust approach angle - currently {current_angle}°, optimal is {optimal_angle}°',
        'Speed check: {current_speed} mph, target {target_speed} mph',
        'Prepare for turn in {distance} feet'
      ],
      turn: [
        'Initiate turn now for optimal radius',
        'Maintain barrel proximity - currently {distance} inches',
        'Exit acceleration ready - prepare for next segment',
        'Turn quality: {quality_score}/10'
      ],
      straightaway: [
        'Maintain speed and straightness',
        'Prepare for barrel {next_barrel} approach',
        'Current pace: {current_pace}, target: {target_pace}',
        'Line accuracy: {accuracy_percentage}%'
      ],
      finish: [
        'Final sprint - maximum effort',
        'Maintain straight line to finish',
        'Current time: {current_time}, target: {target_time}',
        'Strong finish!'
      ]
    },
    
    // Performance Analysis
    performanceAnalysis: {
      strengthsIdentification: {
        enabled: true,
        categories: ['speed', 'turns', 'consistency', 'horse_fitness', 'rider_skill'],
        confidenceThreshold: 0.75
      },
      improvementAreas: {
        enabled: true,
        prioritization: 'impact_based',
        categories: ['timing', 'technique', 'conditioning', 'equipment'],
        actionableRecommendations: true
      },
      competitiveAnalysis: {
        enabled: true,
        benchmarking: 'peer_group',
        trendAnalysis: true,
        predictionModeling: true,
        securityLevel: 'TOP_SECRET' // Highly sensitive competitive data
      }
    },
    
    // Safety Monitoring
    safetyMonitoring: {
      riskFactors: [
        'excessive_speed',
        'tight_turns',
        'barrel_contact',
        'horse_fatigue',
        'rider_balance'
      ],
      alertThresholds: {
        speed: { max: 38 }, // mph
        turnRadius: { min: 6 }, // feet
        barrelProximity: { min: 4 }, // inches
        heartRate: { max: 180 }, // bpm
        stressLevel: { max: 8 } // 1-10 scale
      },
      emergencyProtocols: {
        automaticStop: true,
        emergencyContacts: true,
        medicalAlert: true,
        incidentReporting: true
      }
    }
  },

  // 🏆 Competition Mode Configuration
  competitionMode: {
    security: {
      witnessRequired: true,
      officialTiming: true,
      videoRecording: 'mandatory',
      sealedEquipment: true,
      tamperDetection: 'maximum',
      auditTrail: 'comprehensive'
    },
    
    dataProtection: {
      classification: 'TOP_SECRET',
      encryption: 'quantum_safe',
      accessControl: 'biometric_plus_token',
      sharing: 'prohibited',
      retention: '1_year',
      disposal: 'secure_destruction'
    },
    
    officialStandards: {
      timingAccuracy: 0.001, // seconds
      patternValidation: true,
      penaltyDetection: 'automatic',
      videoReview: 'available',
      protestProcedure: 'defined',
      resultsCertification: true
    }
  },

  // 📊 Performance Metrics
  performanceMetrics: {
    primary: {
      totalTime: {
        weight: 0.4,
        description: 'Overall run time',
        securityLevel: 'RESTRICTED'
      },
      turnQuality: {
        weight: 0.25,
        description: 'Average turn execution score',
        securityLevel: 'CONFIDENTIAL'
      },
      speedConsistency: {
        weight: 0.2,
        description: 'Speed maintenance between segments',
        securityLevel: 'CONFIDENTIAL'
      },
      patternAccuracy: {
        weight: 0.15,
        description: 'Adherence to optimal pattern',
        securityLevel: 'INTERNAL'
      }
    },
    
    secondary: {
      horseCondition: {
        metrics: ['heart_rate', 'recovery_time', 'stress_level'],
        securityLevel: 'CONFIDENTIAL'
      },
      riderTechnique: {
        metrics: ['position', 'balance', 'timing', 'communication'],
        securityLevel: 'INTERNAL'
      },
      equipmentPerformance: {
        metrics: ['saddle_fit', 'bit_response', 'ground_conditions'],
        securityLevel: 'INTERNAL'
      }
    }
  },

  // 🔒 Competitive Intelligence Protection
  competitiveIntelligence: {
    protectedData: [
      'training_methods',
      'timing_strategies',
      'horse_preparation_secrets',
      'equipment_modifications',
      'performance_analytics',
      'weakness_analysis',
      'improvement_plans'
    ],
    
    accessControl: {
      viewingRestrictions: {
        'training_methods': ['TRAINER', 'OWNER'],
        'timing_strategies': ['TRAINER'],
        'performance_analytics': ['TRAINER', 'OWNER'],
        'weakness_analysis': ['TRAINER'],
        'improvement_plans': ['TRAINER', 'OWNER']
      },
      
      sharingProhibitions: [
        'no_competitors',
        'no_other_trainers',
        'no_media_without_approval',
        'no_social_media',
        'no_public_forums'
      ],
      
      watermarking: {
        videos: true,
        reports: true,
        analytics: true,
        userData: true,
        timestamp: true,
        deviceId: true
      }
    },
    
    monitoring: {
      accessLogging: 'comprehensive',
      behavioralAnalytics: true,
      unusualPatterns: 'alert',
      bulkDownloads: 'prevent',
      screenshotDetection: true,
      printingRestrictions: true
    }
  },

  // 🎓 Training Progression
  trainingProgression: {
    beginner: {
      focus: ['pattern_learning', 'basic_turns', 'speed_control'],
      targetTime: { min: 20, max: 25 },
      safetyPriority: 'maximum',
      aiCoaching: 'detailed_guidance'
    },
    intermediate: {
      focus: ['turn_refinement', 'speed_optimization', 'consistency'],
      targetTime: { min: 17, max: 20 },
      safetyPriority: 'high',
      aiCoaching: 'technique_improvement'
    },
    advanced: {
      focus: ['precision_timing', 'competitive_edge', 'mental_preparation'],
      targetTime: { min: 14, max: 17 },
      safetyPriority: 'standard',
      aiCoaching: 'performance_optimization'
    },
    professional: {
      focus: ['world_class_performance', 'consistency_under_pressure', 'strategic_racing'],
      targetTime: { min: 13, max: 15 },
      safetyPriority: 'calculated_risk',
      aiCoaching: 'competitive_intelligence'
    }
  },

  // 🚨 Alert Templates
  alertTemplates: {
    timing: {
      personalBest: {
        message: 'New personal best! Time: {time} seconds',
        severity: 'success',
        celebration: true
      },
      slowTime: {
        message: 'Time {time}s is {difference}s slower than average',
        severity: 'warning',
        analysis: true
      },
      penaltyTime: {
        message: 'Penalty applied: +{penalty}s for {reason}',
        severity: 'error',
        review: true
      }
    },
    
    safety: {
      excessiveSpeed: {
        message: 'Speed {speed} mph exceeds safe limit of {limit} mph',
        severity: 'critical',
        immediateAction: 'reduce_speed'
      },
      barrelContact: {
        message: 'Barrel contact detected at barrel {barrel_number}',
        severity: 'high',
        immediateAction: 'check_horse_rider'
      },
      equipmentFailure: {
        message: 'Equipment malfunction detected: {equipment}',
        severity: 'critical',
        immediateAction: 'stop_session'
      }
    },
    
    performance: {
      improvementOpportunity: {
        message: 'Improvement opportunity in {area}: {suggestion}',
        severity: 'info',
        coaching: true
      },
      consistencyIssue: {
        message: 'Consistency variance of {variance}s in {segment}',
        severity: 'warning',
        analysis: true
      }
    }
  },

  // 🔧 Equipment Configuration
  equipment: {
    required: [
      'timing_gates',
      'speed_radar',
      'video_cameras',
      'safety_equipment'
    ],
    
    optional: [
      'heart_rate_monitors',
      'gps_tracking',
      'ground_sensors',
      'weather_monitoring'
    ],
    
    security: {
      certification: 'required',
      encryption: 'mandatory',
      tamperDetection: 'enabled',
      accessControl: 'biometric',
      auditLogging: 'comprehensive'
    }
  }
};

// Helper functions for barrel racing operations
export const getOptimalTime = (level: string): number => {
  const progression = barrelRacingConfig.trainingProgression[level as keyof typeof barrelRacingConfig.trainingProgression];
  return progression ? (progression.targetTime.min + progression.targetTime.max) / 2 : 18;
};

export const calculateTurnScore = (
  barrelNumber: number,
  approachAngle: number,
  turnRadius: number,
  speed: number,
  proximity: number
): number => {
  const barrel = barrelRacingConfig.turnAnalysis[`barrel${barrelNumber}` as keyof typeof barrelRacingConfig.turnAnalysis];
  if (!barrel) return 0;

  // Calculate score based on optimal parameters (0-100)
  const angleScore = 100 - Math.abs(approachAngle - barrel.optimalApproachAngle.optimal) * 2;
  const radiusScore = 100 - Math.abs(turnRadius - barrel.optimalTurnRadius.optimal) * 5;
  const proximityScore = 100 - Math.abs(proximity - barrel.barrelProximity.optimal) * 3;
  
  return Math.max(0, Math.min(100, (angleScore + radiusScore + proximityScore) / 3));
};

export const getSecurityLevel = (dataType: string): string => {
  const competitiveData = ['timing_strategies', 'training_methods', 'performance_analytics'];
  const restrictedData = ['competition_times', 'weakness_analysis'];
  
  if (restrictedData.includes(dataType)) return 'RESTRICTED';
  if (competitiveData.includes(dataType)) return 'CONFIDENTIAL';
  return 'INTERNAL';
};

export const validateCompetitionMode = (sessionData: any): boolean => {
  const requirements = barrelRacingConfig.competitionMode.security;
  
  return (
    sessionData.witnessPresent === requirements.witnessRequired &&
    sessionData.officialTiming === requirements.officialTiming &&
    sessionData.videoRecording === true &&
    sessionData.equipmentSealed === requirements.sealedEquipment
  );
};

export default barrelRacingConfig; 