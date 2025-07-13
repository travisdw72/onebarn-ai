import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { 
  AIAgentTemplate, 
  UserAgentConfig, 
  AgentExecutionResult, 
  CreateAgentResponse,
  TestAgentRequest
} from '@/interfaces/AIAgentTypes';

// Mock data for demonstration
const MOCK_TEMPLATES: AIAgentTemplate[] = [
  {
    agentTemplateHk: 'img-health-monitor-v1',
    templateName: 'Horse Health Monitor',
    templateCategory: 'IMAGE_AI',
    description: 'Analyze horse photos to detect health indicators, injuries, and overall condition',
    complexityLevel: 'Medium',
    estimatedCostPerUse: 0.15,
    configurationSchema: {
      health_focus: {
        type: 'string',
        enum: ['general', 'injury_detection', 'body_condition', 'lameness'],
        description: 'Primary health analysis focus'
      },
      confidence_threshold: {
        type: 'number',
        minimum: 0.1,
        maximum: 1.0,
        default: 0.7,
        description: 'Minimum confidence score for alerts'
      },
      enable_alerts: {
        type: 'boolean',
        default: true,
        description: 'Send alerts for concerning findings'
      }
    },
    capabilities: ['injury_detection', 'body_condition_scoring', 'lameness_analysis'],
    supportedDataTypes: ['jpeg', 'png', 'heic'],
    processingTimeMs: 3000,
    maxRequestsPerHour: 100,
    createdDate: '2024-01-15T10:00:00Z',
    updatedDate: '2024-01-20T15:30:00Z',
    isActive: true
  },
  {
    agentTemplateHk: 'img-equipment-inspect-v1',
    templateName: 'Equipment Inspector',
    templateCategory: 'IMAGE_AI',
    description: 'Inspect barn equipment, fencing, and infrastructure for safety issues',
    complexityLevel: 'Simple',
    estimatedCostPerUse: 0.08,
    configurationSchema: {
      inspection_type: {
        type: 'string',
        enum: ['fencing', 'equipment', 'buildings', 'all'],
        description: 'What type of equipment to inspect'
      },
      severity_threshold: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Minimum severity level to report'
      }
    },
    capabilities: ['safety_assessment', 'wear_detection', 'damage_assessment'],
    supportedDataTypes: ['jpeg', 'png'],
    processingTimeMs: 2000,
    maxRequestsPerHour: 200,
    createdDate: '2024-01-10T08:00:00Z',
    updatedDate: '2024-01-18T12:00:00Z',
    isActive: true
  },
  {
    agentTemplateHk: 'voice-senior-monitor-v1',
    templateName: 'Senior Wellness Monitor',
    templateCategory: 'VOICE_AI',
    description: 'Monitor senior clients for signs of confusion, distress, or health concerns',
    complexityLevel: 'Advanced',
    estimatedCostPerUse: 0.25,
    configurationSchema: {
      wellness_indicators: {
        type: 'string',
        enum: ['confusion', 'distress', 'fatigue', 'all'],
        description: 'Primary wellness indicators to monitor'
      },
      sensitivity: {
        type: 'number',
        minimum: 0.1,
        maximum: 1.0,
        default: 0.6,
        description: 'Sensitivity of detection algorithms'
      },
      privacy_mode: {
        type: 'boolean',
        default: true,
        description: 'Enable HIPAA-compliant privacy protection'
      }
    },
    capabilities: ['emotion_detection', 'confusion_assessment', 'emergency_detection'],
    supportedDataTypes: ['wav', 'mp3', 'flac'],
    processingTimeMs: 5000,
    maxRequestsPerHour: 50,
    createdDate: '2024-01-12T14:00:00Z',
    updatedDate: '2024-01-25T09:15:00Z',
    isActive: true
  },
  {
    agentTemplateHk: 'sensor-predictive-maint-v1',
    templateName: 'Predictive Maintenance',
    templateCategory: 'SENSOR_AI',
    description: 'Analyze sensor data to predict equipment failures and maintenance needs',
    complexityLevel: 'Advanced',
    estimatedCostPerUse: 0.12,
    configurationSchema: {
      equipment_type: {
        type: 'string',
        enum: ['motors', 'pumps', 'feeders', 'all'],
        description: 'Type of equipment to monitor'
      },
      prediction_horizon: {
        type: 'number',
        minimum: 1,
        maximum: 30,
        default: 7,
        description: 'Days ahead to predict failures'
      },
      maintenance_urgency: {
        type: 'string',
        enum: ['immediate', 'soon', 'scheduled'],
        default: 'soon',
        description: 'Urgency level for maintenance alerts'
      }
    },
    capabilities: ['failure_prediction', 'anomaly_detection', 'maintenance_scheduling'],
    supportedDataTypes: ['json', 'csv', 'timeseries'],
    processingTimeMs: 8000,
    maxRequestsPerHour: 25,
    createdDate: '2024-01-08T11:00:00Z',
    updatedDate: '2024-01-22T16:45:00Z',
    isActive: true
  }
];

export const useAIAgentBuilder = () => {
  const { tenantId } = useTenant();
  const [templates, setTemplates] = useState<AIAgentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingAgent, setIsTestingAgent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from your API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setTemplates(MOCK_TEMPLATES);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [tenantId]);

  const createAgent = useCallback(async (
    templateId: string, 
    config: UserAgentConfig
  ): Promise<CreateAgentResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to create agent
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const agentId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Mock response
      const response: CreateAgentResponse = {
        agentId,
        agentName: config.agentName,
        status: 'created',
        deploymentUrl: `https://api.onebarn.ai/agents/${agentId}`,
        estimatedReadyTime: new Date(Date.now() + 60000).toISOString(), // 1 minute from now
        message: `Agent "${config.agentName}" has been successfully created and deployed.`
      };

      return response;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create agent';
      setError(error);
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testAgent = useCallback(async (
    config: UserAgentConfig, 
    testData: any
  ): Promise<AgentExecutionResult> => {
    setIsTestingAgent(true);
    setError(null);

    try {
      // Simulate test execution
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 3000));
      const endTime = Date.now();

      // Mock test result based on template type
      const mockResult = generateMockResult(testData);
      
      const result: AgentExecutionResult = {
        executionId: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agentId: 'test-agent',
        status: 'success',
        processingTimeMs: endTime - startTime,
        confidenceScore: 0.85 + (Math.random() * 0.15), // 0.85-1.0
        costIncurred: 0.15,
        result: mockResult,
        metadata: {
          provider: 'OneBarn AI',
          version: 'v1.0.0',
          inputDataType: typeof testData,
          outputDataType: 'json'
        },
        executedAt: new Date().toISOString()
      };

      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Test execution failed';
      setError(error);
      throw new Error(error);
    } finally {
      setIsTestingAgent(false);
    }
  }, []);

  const deployAgent = useCallback(async (agentId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Deployment failed';
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    templates,
    createAgent,
    testAgent,
    deployAgent,
    isLoading,
    isTestingAgent,
    error
  };
};

// Helper function to generate mock results based on test data
const generateMockResult = (testData: any) => {
  if (testData.image_url) {
    return {
      analysis_type: 'image_analysis',
      findings: [
        {
          category: 'health',
          condition: 'good',
          confidence: 0.92,
          details: 'Horse appears healthy with good body condition score of 5/9'
        },
        {
          category: 'posture',
          condition: 'normal',
          confidence: 0.88,
          details: 'Normal standing posture, no signs of lameness detected'
        }
      ],
      recommendations: [
        'Continue current care routine',
        'Monitor for any changes in behavior or appetite'
      ],
      risk_score: 0.15
    };
  } else if (testData.audio_url) {
    return {
      analysis_type: 'voice_analysis',
      emotional_state: {
        primary_emotion: 'calm',
        confidence: 0.86,
        stress_level: 0.2,
        confusion_indicators: false
      },
      wellness_indicators: {
        cognitive_clarity: 'good',
        emotional_stability: 'stable',
        communication_clarity: 'clear'
      },
      alerts: [],
      recommendations: ['Continue regular monitoring', 'Maintain current engagement levels']
    };
  } else if (testData.sensor_data) {
    return {
      analysis_type: 'sensor_analysis',
      equipment_status: 'normal',
      anomalies_detected: false,
      performance_metrics: {
        efficiency: 0.94,
        temperature: 'within_range',
        vibration: 'normal',
        power_consumption: 'optimal'
      },
      maintenance_prediction: {
        next_maintenance_due: '2024-03-15',
        urgency: 'low',
        estimated_cost: 150
      },
      recommendations: ['Continue normal operation', 'Schedule routine inspection in 2 weeks']
    };
  }

  return {
    analysis_type: 'general',
    status: 'completed',
    message: 'Test execution completed successfully'
  };
}; 