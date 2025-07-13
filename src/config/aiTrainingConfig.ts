import { brandConfig } from './brandConfig';

export const aiTrainingConfig = {
  // Training Session Monitoring
  sessions: {
    types: {
      dressage: {
        title: "Dressage Training",
        icon: "EmojiEvents",
        color: brandConfig.colors.championGold,
        aiAnalysis: {
          gaitQuality: {
            enabled: true,
            metrics: ["rhythm", "regularity", "contact", "impulsion", "straightness", "collection"],
            alerts: ["gait_irregularity", "contact_loss", "rhythm_break", "tension"],
            confidenceThreshold: 0.75,
            realTimeScoring: true
          },
          movements: {
            enabled: true,
            tracked: ["halt", "transitions", "figures", "lateral_work", "collection"],
            scoring: "1-10",
            aiAssistance: true,
            comparison: "competition_standard"
          }
        },
        scoring: {
          movements: ["halt", "walk", "trot", "canter", "transitions"],
          scale: "1-10",
          aiAssistance: true
        }
      },
      jumping: {
        title: "Show Jumping Training",
        icon: "TrendingUp",
        color: brandConfig.colors.ribbonBlue,
        aiAnalysis: {
          approach: {
            enabled: true,
            metrics: ["rhythm", "balance", "impulsion", "straightness", "distance"],
            alerts: ["rushed_approach", "loss_of_rhythm", "crooked_approach"],
            confidenceThreshold: 0.80
          },
          jumpExecution: {
            enabled: true,
            metrics: ["takeoff_point", "arc_quality", "clearance", "style"],
            alerts: ["long_takeoff", "short_takeoff", "rail_risk", "poor_form"],
            confidenceThreshold: 0.85,
            faultDetection: true
          }
        }
      },
      barrelRacing: {
        title: "Barrel Racing Training",
        icon: "Speed",
        color: brandConfig.colors.victoryRose,
        aiAnalysis: {
          timing: {
            enabled: true,
            precision: 0.01, // Hundredths of seconds
            segments: ["start", "barrel1", "barrel2", "barrel3", "finish"],
            alerts: ["time_plateau", "segment_slowdown", "pattern_deviation"],
            recordTracking: true,
            autoSplits: true
          },
          turns: {
            enabled: true,
            metrics: ["entry_angle", "arc_quality", "exit_speed", "barrel_distance"],
            alerts: ["wide_turn", "tight_turn", "speed_loss", "knockdown_risk"],
            confidenceThreshold: 0.80,
            realTimeCoaching: true
          },
          straightaways: {
            enabled: true,
            metrics: ["acceleration", "top_speed", "deceleration", "line_accuracy"],
            alerts: ["slow_acceleration", "speed_inconsistency", "drift"],
            confidenceThreshold: 0.75
          }
        },
        timing: {
          precision: "hundredths",
          autoStart: true,
          splitTimes: true,
          recordPersonalBest: true,
          competitionMode: true,
          penalties: {
            knockdown: 5.0, // seconds
            noTime: true
          }
        }
      },
      western: {
        title: "Western Training",
        icon: "Landscape",
        color: brandConfig.colors.chestnutGlow,
        aiAnalysis: {
          stockSeat: {
            enabled: true,
            metrics: ["position", "balance", "quiet_hands", "leg_position"],
            alerts: ["seat_shift", "hand_movement", "leg_grip"],
            confidenceThreshold: 0.70
          },
          horseResponse: {
            enabled: true,
            metrics: ["collection", "responsiveness", "willingness", "frame"],
            alerts: ["resistance", "evasion", "loss_of_collection"],
            confidenceThreshold: 0.75
          }
        }
      },

      // 🐄 CUTTING - Advanced Pattern Recognition
      cutting: {
        title: "Cutting Training",
        icon: "Psychology",
        color: brandConfig.colors.pastureSage,
        aiAnalysis: {
          cattleWork: {
            enabled: true,
            metrics: ["cow_selection", "separation_technique", "holding_position", "cow_control"],
            alerts: ["lost_cow", "poor_position", "excessive_movement", "time_running_out"],
            confidenceThreshold: 0.80,
            realTimeCoaching: true
          },
          horseMovement: {
            enabled: true,
            metrics: ["anticipation", "agility", "balance", "cow_sense"],
            alerts: ["late_reaction", "overcommitment", "loss_of_balance", "poor_timing"],
            confidenceThreshold: 0.75,
            patternRecognition: true
          },
          riderPosition: {
            enabled: true,
            metrics: ["seat_security", "hand_position", "leg_contact", "body_language"],
            alerts: ["rider_interference", "poor_balance", "excessive_cueing"],
            confidenceThreshold: 0.70
          }
        },
        scoring: {
          scale: "60-80",
          penalties: ["lost_cow", "hot_quit", "back_fence", "turn_tail", "spurring"],
          bonuses: ["degree_of_difficulty", "eye_appeal", "courage"],
          timeLimit: 150 // seconds
        },
        competition: {
          officialScoring: true,
          judgeAssistance: true,
          videoReview: true,
          penaltyDetection: true
        }
      },

      // 🌪️ REINING - Precision Pattern Analysis
      reining: {
        title: "Reining Training",
        icon: "Rotate90DegreesCcw",
        color: brandConfig.colors.ribbonBlue,
        aiAnalysis: {
          circles: {
            enabled: true,
            metrics: ["size_consistency", "speed_control", "lead_changes", "cadence"],
            alerts: ["uneven_circles", "speed_variation", "missed_lead", "loss_of_cadence"],
            confidenceThreshold: 0.85,
            patternAccuracy: true
          },
          spins: {
            enabled: true,
            metrics: ["pivot_foot", "body_position", "speed", "completion"],
            alerts: ["moving_pivot", "uneven_spins", "incomplete_turn", "loss_of_balance"],
            confidenceThreshold: 0.80,
            revolutionCounting: true
          },
          stops: {
            enabled: true,
            metrics: ["slide_distance", "straightness", "hock_engagement", "front_end_elevation"],
            alerts: ["crooked_stop", "short_slide", "poor_engagement", "stumbling"],
            confidenceThreshold: 0.85,
            slideAnalysis: true
          },
          rollbacks: {
            enabled: true,
            metrics: ["pivot_quality", "speed", "straightness", "completion"],
            alerts: ["wide_rollback", "slow_pivot", "crooked_departure", "incomplete_turn"],
            confidenceThreshold: 0.75
          },
          leadChanges: {
            enabled: true,
            metrics: ["timing", "cleanliness", "straightness", "balance"],
            alerts: ["late_change", "cross_canter", "crooked_change", "missed_change"],
            confidenceThreshold: 0.80,
            changeDetection: true
          }
        },
        scoring: {
          scale: "0-1.5",
          penalties: ["break_of_gait", "spurring", "use_of_romal", "equipment_failure"],
          maneuvers: ["circles", "spins", "stops", "rollbacks", "lead_changes", "backup"],
          patternAccuracy: true
        },
        patterns: {
          nrha1: { name: "NRHA Pattern 1", difficulty: "beginner" },
          nrha7: { name: "NRHA Pattern 7", difficulty: "intermediate" },
          nrha13: { name: "NRHA Pattern 13", difficulty: "advanced" }
        }
      },

      // 🏇 HUNTER/JUMPER - Style & Technique Scoring
      hunterJumper: {
        title: "Hunter/Jumper Training",
        icon: "EmojiEvents",
        color: brandConfig.colors.championGold,
        aiAnalysis: {
          hunterStyle: {
            enabled: true,
            metrics: ["rhythm", "balance", "impulsion", "straightness", "jumping_style"],
            alerts: ["rhythm_break", "loss_of_balance", "crooked_approach", "poor_jumping_form"],
            confidenceThreshold: 0.80,
            styleScoring: true
          },
          jumpingTechnique: {
            enabled: true,
            metrics: ["takeoff_spot", "bascule", "front_leg_technique", "hind_leg_clearance"],
            alerts: ["long_spot", "short_spot", "hanging_legs", "rail_touching"],
            confidenceThreshold: 0.85,
            faultPrediction: true
          },
          courseNavigation: {
            enabled: true,
            metrics: ["track", "pace", "turns", "line_riding"],
            alerts: ["off_track", "pace_inconsistency", "wide_turns", "poor_lines"],
            confidenceThreshold: 0.75,
            courseAnalysis: true
          },
          riderPosition: {
            enabled: true,
            metrics: ["position", "hands", "legs", "release"],
            alerts: ["position_fault", "hard_hands", "leg_slip", "poor_release"],
            confidenceThreshold: 0.70,
            positionAnalysis: true
          }
        },
        scoring: {
          hunter: {
            scale: "0-100",
            criteria: ["movement", "jumping_style", "way_of_going", "manners"],
            faults: ["refusal", "knockdown", "wrong_lead", "break_of_gait"]
          },
          jumper: {
            scale: "time_plus_faults",
            faults: ["knockdown", "refusal", "time_fault"],
            penalties: { knockdown: 4, refusal: 4, time_fault: 1 }
          }
        },
        divisions: {
          hunter: ["green", "working", "amateur", "junior", "equitation"],
          jumper: ["low", "medium", "high", "grand_prix"]
        }
      },

      // 🏆 EVENTING - Multi-Phase Competition
      eventing: {
        title: "Eventing Training",
        icon: "Military",
        color: brandConfig.colors.stableMahogany,
        aiAnalysis: {
          dressage: {
            enabled: true,
            metrics: ["accuracy", "rhythm", "suppleness", "contact", "impulsion"],
            alerts: ["inaccurate_movement", "rhythm_fault", "resistance", "loss_of_contact"],
            confidenceThreshold: 0.75,
            testScoring: true
          },
          crossCountry: {
            enabled: true,
            metrics: ["pace", "jumping_technique", "fitness", "boldness", "time_management"],
            alerts: ["pace_too_fast", "pace_too_slow", "refusal_risk", "time_penalty_risk"],
            confidenceThreshold: 0.80,
            terrainAnalysis: true,
            obstacleRecognition: true
          },
          showJumping: {
            enabled: true,
            metrics: ["carefulness", "scope", "technique", "adjustability"],
            alerts: ["rail_risk", "refusal_risk", "time_pressure", "fatigue_signs"],
            confidenceThreshold: 0.85,
            fatigueMonitoring: true
          },
          conditioning: {
            enabled: true,
            metrics: ["heart_rate", "recovery_time", "fitness_level", "stamina"],
            alerts: ["overexertion", "poor_recovery", "fitness_decline"],
            confidenceThreshold: 0.70,
            fitnessTracking: true
          }
        },
        phases: {
          dressage: {
            weight: 0.33,
            scoring: "penalty_system",
            tests: ["intro", "preliminary", "novice", "training", "modified", "intermediate", "advanced"]
          },
          crossCountry: {
            weight: 0.33,
            scoring: "time_plus_penalties",
            optimumTime: true,
            penalties: { refusal: 20, fall: 65, dangerous_riding: 25 }
          },
          showJumping: {
            weight: 0.34,
            scoring: "penalty_system",
            penalties: { knockdown: 4, refusal: 4, time_fault: 1 }
          }
        },
        levels: ["intro", "beginner_novice", "novice", "training", "modified", "preliminary", "intermediate", "advanced", "four_star"]
      },

      // 🤠 ROPING - Precision Timing & Technique Analysis
      roping: {
        title: "Roping Training",
        icon: "GpsFixed",
        color: brandConfig.colors.chestnutGlow,
        aiAnalysis: {
          teamRoping: {
            enabled: true,
            positions: {
              header: {
                metrics: ["catch_percentage", "loop_placement", "timing", "horse_position", "dally_technique"],
                alerts: ["missed_catch", "poor_loop", "late_timing", "horse_out_of_position", "dally_fumble"],
                confidenceThreshold: 0.80,
                loopTracking: true
              },
              heeler: {
                metrics: ["heel_catch_percentage", "both_legs", "timing", "position", "speed"],
                alerts: ["one_leg", "missed_heels", "early_throw", "poor_position"],
                confidenceThreshold: 0.85,
                legDetection: true
              }
            },
            teamwork: {
              metrics: ["communication", "timing_sync", "positioning", "run_efficiency"],
              alerts: ["poor_communication", "timing_mismatch", "position_conflict"],
              confidenceThreshold: 0.75,
              syncAnalysis: true
            }
          },
          calfRoping: {
            enabled: true,
            phases: {
              run: {
                metrics: ["horse_speed", "positioning", "rate_control", "barrier_timing"],
                alerts: ["barrier_break", "poor_rate", "horse_too_fast", "position_error"],
                confidenceThreshold: 0.80,
                barrierDetection: true
              },
              throw: {
                metrics: ["loop_accuracy", "timing", "catch_placement", "rope_handling"],
                alerts: ["missed_throw", "poor_loop", "late_release", "rope_tangle"],
                confidenceThreshold: 0.85,
                throwAnalysis: true
              },
              dismount: {
                metrics: ["dismount_speed", "rope_handling", "approach_angle"],
                alerts: ["slow_dismount", "rope_slack", "poor_approach"],
                confidenceThreshold: 0.75
              },
              tie: {
                metrics: ["tie_speed", "wrap_quality", "calf_control", "technique"],
                alerts: ["slow_tie", "poor_wraps", "calf_movement", "tie_failure"],
                confidenceThreshold: 0.80,
                tieAnalysis: true
              }
            }
          },
          breakawayRoping: {
            enabled: true,
            metrics: ["catch_percentage", "loop_placement", "timing", "horse_rate", "flag_break"],
            alerts: ["missed_catch", "no_flag", "poor_loop", "horse_too_fast", "late_timing"],
            confidenceThreshold: 0.80,
            flagDetection: true,
            femaleOptimized: true
          },
          horseTraining: {
            enabled: true,
            metrics: ["rate_control", "stop_quality", "backing", "position_holding", "responsiveness"],
            alerts: ["poor_rate", "hard_stop", "won't_back", "drifting", "unresponsive"],
            confidenceThreshold: 0.75,
            horseAnalysis: true
          }
        },
        timing: {
          precision: 0.01, // Hundredths for competition
          segments: {
            teamRoping: ["barrier", "header_catch", "heeler_catch", "stop"],
            calfRoping: ["barrier", "catch", "dismount", "tie_complete"],
            breakaway: ["barrier", "catch", "flag_break"]
          },
          penalties: {
            barrier: 10.0, // seconds
            oneleg: 5.0,   // team roping
            notime: true   // missed catch
          },
          autoDetection: {
            barrier: true,
            catches: true,
            flags: true,
            ties: true
          }
        },
        scoring: {
          teamRoping: {
            scale: "time_plus_penalties",
            divisions: ["#4", "#5", "#6", "#7", "#8", "#9", "#10", "#11", "open"],
            penalties: ["barrier", "broken_rope", "illegal_catch"]
          },
          calfRoping: {
            scale: "time_plus_penalties", 
            penalties: ["barrier", "broken_rope", "illegal_tie", "calf_kicked_free"],
            tieRequirement: "three_legs_crossed_and_tied"
          },
          breakaway: {
            scale: "time_plus_penalties",
            penalties: ["barrier", "no_flag", "broken_rope"],
            flagRequirement: "clean_break_from_saddle_horn"
          }
        },
        equipment: {
          ropeTracking: true,
          loopAnalysis: true,
          flagDetection: true,
          barrierSensors: true,
          horsePositioning: true
        },
        competition: {
          proRodeo: true,
          jackpots: true,
          youth: true,
          amateur: true,
          divisions: true,
          payouts: true
        }
      },

      // 🏇 RANCH WORK - Practical Cattle Work
      ranchWork: {
        title: "Ranch Work Training",
        icon: "Agriculture",
        color: brandConfig.colors.pastureSage,
        aiAnalysis: {
          cattleHandling: {
            enabled: true,
            metrics: ["cattle_movement", "pressure_application", "positioning", "timing", "efficiency"],
            alerts: ["cattle_stress", "poor_position", "excessive_pressure", "inefficient_movement"],
            confidenceThreshold: 0.75,
            cattleWelfareMonitoring: true
          },
          sorting: {
            enabled: true,
            metrics: ["accuracy", "speed", "cattle_flow", "gate_work", "decision_making"],
            alerts: ["wrong_sort", "gate_trouble", "cattle_backup", "slow_decisions"],
            confidenceThreshold: 0.80,
            sortingAccuracy: true
          },
          penning: {
            enabled: true,
            metrics: ["approach_angle", "cattle_control", "gate_timing", "pressure_release"],
            alerts: ["cattle_escape", "gate_miss", "excessive_pressure", "poor_timing"],
            confidenceThreshold: 0.75
          },
          doctoring: {
            enabled: true,
            metrics: ["cattle_restraint", "safety", "efficiency", "stress_minimization"],
            alerts: ["safety_concern", "cattle_stress", "poor_restraint", "time_excessive"],
            confidenceThreshold: 0.85,
            safetyPriority: true
          }
        },
        horseEvaluation: {
          cowSense: {
            metrics: ["anticipation", "positioning", "cattle_reading", "natural_ability"],
            scoring: "1-10",
            aiAssessment: true
          },
          athleticism: {
            metrics: ["agility", "speed", "stamina", "balance", "coordination"],
            scoring: "1-10",
            performanceTracking: true
          },
          trainability: {
            metrics: ["responsiveness", "learning_rate", "retention", "willingness"],
            scoring: "1-10",
            progressTracking: true
          }
        },
        practicalSkills: {
          gateWork: true,
          trailRiding: true,
          ropeWork: true,
          cattleMovement: true,
          emergencyResponse: true
        }
      }
    }
  },

  // Competition Analysis
  competition: {
    enabled: true,
    modes: {
      practice: {
        realTimeCoaching: true,
        voiceAlerts: true,
        detailedAnalysis: true,
        recordSession: true,
        aiSuggestions: true
      },
      competition: {
        realTimeCoaching: false,
        voiceAlerts: false,
        detailedAnalysis: true,
        recordSession: true,
        officialTiming: true,
        livestream: true
      },
      analysis: {
        realTimeCoaching: false,
        voiceAlerts: false,
        detailedAnalysis: true,
        recordSession: false,
        videoReview: true,
        slowMotion: true
      }
    },
    timing: {
      precision: 0.001, // Milliseconds for competition
      backup: "manual",
      photoFinish: true,
      autoTriggers: {
        startLine: true,
        finishLine: true,
        barrelProximity: true,
        jumpApproach: true
      }
    }
  },

  // AI Coaching Insights
  coaching: {
    realTime: {
      enabled: true,
      alertTypes: {
        technique: {
          priority: "medium",
          examples: [
            "Maintain consistent rhythm approaching barrel",
            "Check turn radius - getting too wide", 
            "Excellent acceleration out of turn 2!"
          ]
        },
        safety: {
          priority: "critical",
          examples: [
            "Horse showing stress indicators",
            "Speed too high for turn entry",
            "Loss of balance detected"
          ]
        },
        performance: {
          priority: "info",
          examples: [
            "Personal best pace through turn 1!",
            "Consistent split times - great job!",
            "New overall personal record!"
          ]
        }
      },
      delivery: {
        visual: true,
        audio: false, // Configurable per session
        smartwatch: true,
        delay: 0.5 // Seconds after detection
      }
    },
    postSession: {
      enabled: true,
      analysis: {
        strengths: ["Fast straight lines", "Consistent turns", "Good horsemanship"],
        improvements: ["Turn 3 efficiency", "Exit speed", "Pattern accuracy"],
        progressTracking: true,
        videoHighlights: true,
        recommendations: [
          "Practice tighter turns on Turn 3",
          "Work on acceleration exercises", 
          "Review video of best runs"
        ]
      }
    }
  },

  // Performance Tracking
  performance: {
    tracking: {
      barrelRacing: {
        overall_time: { unit: "seconds", precision: 0.01, target: "personal_best" },
        "turn1_time": { unit: "seconds", precision: 0.01, target: "consistency" },
        "turn2_time": { unit: "seconds", precision: 0.01, target: "consistency" },
        "turn3_time": { unit: "seconds", precision: 0.01, target: "consistency" },
        home_stretch: { unit: "seconds", precision: 0.01, target: "speed" },
        penalties: { unit: "count", target: 0 },
        pattern_accuracy: { unit: "score", scale: "1-10", target: 8.5 }
      },
      dressage: {
        harmony: { unit: "score", scale: "1-10", target: 7.5 },
        precision: { unit: "score", scale: "1-10", target: 7.0 },
        impulsion: { unit: "score", scale: "1-10", target: 7.0 },
        overall_percentage: { unit: "percentage", target: 65 }
      },
      jumping: {
        clear_rounds: { unit: "percentage", target: 85 },
        time_faults: { unit: "count", target: 0 },
        rail_faults: { unit: "count", target: 0 },
        refusals: { unit: "count", target: 0 },
        style_score: { unit: "score", scale: "1-10", target: 8.0 }
      },
      
      // 🤠 ROPING PERFORMANCE METRICS
      teamRoping: {
        average_time: { unit: "seconds", precision: 0.01, target: "personal_best" },
        header_catch_percentage: { unit: "percentage", target: 85 },
        heeler_catch_percentage: { unit: "percentage", target: 80 },
        both_legs_percentage: { unit: "percentage", target: 95 },
        barrier_penalties: { unit: "count", target: 0 },
        consistency_rating: { unit: "score", scale: "1-10", target: 8.0 },
        teamwork_score: { unit: "score", scale: "1-10", target: 8.5 }
      },
      
      calfRoping: {
        average_time: { unit: "seconds", precision: 0.01, target: "personal_best" },
        catch_percentage: { unit: "percentage", target: 90 },
        tie_success_rate: { unit: "percentage", target: 95 },
        barrier_penalties: { unit: "count", target: 0 },
        dismount_speed: { unit: "seconds", precision: 0.1, target: "fast" },
        tie_speed: { unit: "seconds", precision: 0.1, target: "fast" },
        overall_efficiency: { unit: "score", scale: "1-10", target: 8.5 }
      },
      
      breakawayRoping: {
        average_time: { unit: "seconds", precision: 0.01, target: "personal_best" },
        catch_percentage: { unit: "percentage", target: 85 },
        flag_success_rate: { unit: "percentage", target: 98 },
        barrier_penalties: { unit: "count", target: 0 },
        horse_rate_score: { unit: "score", scale: "1-10", target: 8.0 },
        consistency: { unit: "percentage", target: 80 }
      },
      
      cutting: {
        work_time: { unit: "seconds", target: 150 },
        cow_control_score: { unit: "score", scale: "60-80", target: 74 },
        penalties: { unit: "count", target: 0 },
        degree_of_difficulty: { unit: "score", scale: "1-5", target: 3.5 },
        eye_appeal: { unit: "score", scale: "1-5", target: 4.0 },
        horse_credit: { unit: "score", scale: "1-5", target: 4.0 }
      },
      
      reining: {
        pattern_accuracy: { unit: "percentage", target: 95 },
        maneuver_average: { unit: "score", scale: "0-1.5", target: 1.0 },
        penalties: { unit: "count", target: 0 },
        circles_score: { unit: "score", scale: "0-1.5", target: 1.0 },
        spins_score: { unit: "score", scale: "0-1.5", target: 1.0 },
        stops_score: { unit: "score", scale: "0-1.5", target: 1.0 },
        lead_changes_score: { unit: "score", scale: "0-1.5", target: 1.0 }
      },
      
      ranchWork: {
        efficiency_score: { unit: "score", scale: "1-10", target: 8.0 },
        cattle_welfare_rating: { unit: "score", scale: "1-10", target: 9.0 },
        safety_score: { unit: "score", scale: "1-10", target: 9.5 },
        task_completion_rate: { unit: "percentage", target: 95 },
        cow_sense_rating: { unit: "score", scale: "1-10", target: 8.0 },
        horse_athleticism: { unit: "score", scale: "1-10", target: 8.0 }
      }
    },
    trends: {
      enabled: true,
      periods: ["session", "week", "month", "season"],
      predictions: {
        enabled: true,
        horizon: 30, // days
        confidence: 0.7
      }
    }
  },

  // Video Analysis Integration
  video: {
    enabled: true,
    cameras: {
      arena: {
        angles: ["front", "side", "rear", "overhead"],
        fps: 60,
        resolution: "1080p",
        aiProcessing: true
      },
      wearable: {
        riderCam: true,
        horseCam: true,
        syncEnabled: true
      }
    },
    analysis: {
      motionTracking: true,
      poseEstimation: true,
      gaitAnalysis: true,
      jumpAnalysis: true,
      automaticHighlights: true
    },
    storage: {
      cloud: true,
      local: true,
      retention: "1year",
      compression: "h264"
    }
  },

  // Training Goals & Programs
  programs: {
    templates: {
      beginnerDressage: {
        duration: "12weeks",
        sessions: 36,
        progression: ["basic_position", "walk_trot", "simple_figures", "canter", "test_riding"],
        aiGoals: ["position_stability", "rhythm_consistency", "basic_aids"]
      },
      barrelRacingImprovement: {
        duration: "8weeks",
        sessions: 24,
        progression: ["pattern_accuracy", "speed_building", "turn_refinement", "competition_prep"],
        aiGoals: ["time_improvement", "turn_efficiency", "consistency"]
      },
      jumpingProgression: {
        duration: "16weeks", 
        sessions: 48,
        progression: ["ground_poles", "crossrails", "verticals", "oxers", "combinations", "courses"],
        aiGoals: ["technique_improvement", "confidence_building", "height_progression"]
      }
    },
    customization: {
      enabled: true,
      aiAssisted: true,
      trainerInput: true,
      riderGoals: true,
      horseConsiderations: true
    }
  },

  // Alerts & Notifications
  alerts: {
    templates: {
      personalBest: {
        icon: "EmojiEvents",
        severity: "info", 
        title: "Personal Best Achieved!",
        actions: ["celebrate", "analyze", "shareResult"]
      },
      timeImprovement: {
        icon: "TrendingUp",
        severity: "info",
        title: "Time Improvement Detected", 
        actions: ["viewStats", "continue", "adjustGoals"]
      },
      techniqueFlaw: {
        icon: "Warning",
        severity: "warning",
        title: "Technique Issue Detected",
        actions: ["reviewVideo", "practiceExercise", "consultTrainer"]
      },
      safetyIssue: {
        icon: "Error", 
        severity: "critical",
        title: "Safety Concern",
        actions: ["stopSession", "assessHorse", "adjustEquipment"]
      },
      equipmentMalfunction: {
        icon: "Build",
        severity: "critical",
        title: "Timing Equipment Issue",
        actions: ["switchToBackup", "manualTiming", "calibrate"]
      },
      
      // 🤠 ROPING-SPECIFIC ALERTS
      barrierBreak: {
        icon: "Error",
        severity: "warning",
        title: "Barrier Penalty - 10 Second Penalty",
        actions: ["reviewStart", "practiceBarrier", "adjustTiming"]
      },
      
      missedCatch: {
        icon: "Warning", 
        severity: "info",
        title: "Missed Catch - No Time",
        actions: ["reviewThrow", "practiceLoop", "adjustTiming"]
      },
      
      oneLeg: {
        icon: "Warning",
        severity: "warning", 
        title: "One Leg Caught - 5 Second Penalty",
        actions: ["reviewPosition", "practiceHeeling", "improveAngle"]
      },
      
      ropingPersonalBest: {
        icon: "EmojiEvents",
        severity: "info",
        title: "New Roping Personal Best!",
        actions: ["celebrate", "analyzeRun", "shareTime"]
      },
      
      flagMissed: {
        icon: "Warning",
        severity: "warning",
        title: "Flag Didn't Break - No Time", 
        actions: ["checkFlag", "reviewCatch", "adjustRope"]
      },
      
      cowLost: {
        icon: "Error",
        severity: "critical",
        title: "Cow Lost - Work Ended",
        actions: ["reviewWork", "practiceHolding", "improvePosition"]
      },
      
      tieFailure: {
        icon: "Warning",
        severity: "warning",
        title: "Tie Came Loose - No Time",
        actions: ["reviewTechnique", "practiceTying", "checkWraps"]
      }
    }
  },

  // Integration Settings
  integration: {
    hardware: {
      timingSystems: ["FarmTek", "Alge", "FinishLynx", "custom"],
      cameras: ["arena_overhead", "turn_cameras", "finish_line", "mobile"],
      sensors: ["GPS", "IMU", "heartRate", "speed"],
      wearables: ["smartwatch", "fitness_tracker", "hearing_aid"]
    },
    software: {
      videoAnalysis: ["slowMotion", "frameByFrame", "comparison", "highlights"],
      export: ["PDF_report", "video_compilation", "statistics", "social_media"],
      streaming: ["livestream", "recording", "instant_replay"]
    }
  }
};

// Helper functions for easy extension
export const addTrainingType = (type: string, config: any) => {
  aiTrainingConfig.sessions.types[type] = config;
  console.log(`Added new training type: ${type}`);
};

export const addCompetitionMode = (mode: string, config: any) => {
  aiTrainingConfig.competition.modes[mode] = config;
};

export const getTrainingTypeConfig = (type: string) => {
  return (aiTrainingConfig.sessions.types as any)[type];
};

export const getCompetitionConfig = (mode: string) => {
  return (aiTrainingConfig.competition.modes as any)[mode];
};

export const addPerformanceMetric = (discipline: string, metric: string, config: any) => {
  if (!(aiTrainingConfig.performance.tracking as any)[discipline]) {
    (aiTrainingConfig.performance.tracking as any)[discipline] = {};
  }
  (aiTrainingConfig.performance.tracking as any)[discipline][metric] = config;
  console.log(`Added ${metric} metric for ${discipline}`);
};

export const addAlertTemplate = (name: string, template: any) => {
  (aiTrainingConfig.alerts.templates as any)[name] = template;
  console.log(`Added alert template: ${name}`);
}; 