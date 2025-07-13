export interface AIAgentTemplate {
  agentTemplateHk: string;
  templateName: string;
  templateCategory: 'IMAGE_AI' | 'VOICE_AI' | 'SENSOR_AI';
  description: string;
  complexityLevel: 'Simple' | 'Medium' | 'Advanced';
  estimatedCostPerUse: number;
  configurationSchema?: Record<string, any>;
  capabilities: string[];
  supportedDataTypes: string[];
  processingTimeMs: number;
  maxRequestsPerHour: number;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

export interface UserAgentConfig {
  agentName: string;
  agentDescription: string;
  userConfiguration: Record<string, any>;
  privacySettings: {
    dataAccess?: 'own_tenant_only' | 'shared_with_consent' | 'anonymized_insights';
    retentionDays?: number;
    hipaaCompliance?: boolean;
  };
  alertConfiguration?: {
    enableNotifications?: boolean;
    alertThresholds?: Record<string, number>;
    notificationChannels?: string[];
  };
  costManagement: {
    monthlyBudget: number;
    alertOnBudgetThreshold?: number;
    autoDisableOnBudgetExceeded?: boolean;
  };
}

export interface AgentExecutionResult {
  executionId: string;
  agentId: string;
  status: 'success' | 'failed' | 'timeout' | 'budget_exceeded';
  processingTimeMs: number;
  confidenceScore?: number;
  costIncurred: number;
  result: any;
  metadata?: {
    provider: string;
    version: string;
    inputDataType: string;
    outputDataType: string;
  };
  error?: string;
  executedAt: string;
}

export interface CreateAgentResponse {
  agentId: string;
  agentName: string;
  status: 'created' | 'pending' | 'failed';
  deploymentUrl?: string;
  estimatedReadyTime?: string;
  message: string;
}

export interface AIAgentBuilderState {
  templates: AIAgentTemplate[];
  userAgents: UserAgentConfig[];
  isLoading: boolean;
  isTestingAgent: boolean;
  error: string | null;
}

export interface TestAgentRequest {
  agentConfig: UserAgentConfig;
  testData: any;
  timeout?: number;
  mockMode?: boolean;
} 