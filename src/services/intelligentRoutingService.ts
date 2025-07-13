/**
 * Intelligent Routing Service - Phase 1 Core Component
 * Provides NLP-powered ticket routing with sentiment analysis and escalation prediction
 * 
 * @description Implements smart routing logic from Phase 1 specifications
 * @compliance Multi-tenant with zero trust security
 * @author One Barn Development Team
 * @since Phase 1.0.0
 */

import { ISupportTicket } from './ticketService';
import { aiConfig } from '../config/aiConfig';
import { ROLE_PERMISSIONS } from '../config/permissions.config';

// Import Anthropic for real AI analysis
let Anthropic: any = null;
const initializeAnthropic = async () => {
  if (!Anthropic) {
    const anthropicModule = await import('@anthropic-ai/sdk');
    Anthropic = anthropicModule.default;
  }
  return Anthropic;
};

// ============================================================================
// INTELLIGENT ROUTING INTERFACES
// ============================================================================

interface IContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated';
  urgencyIndicators: string[];
  technicalComplexity: 'low' | 'medium' | 'high';
  domainKeywords: string[];
  suggestedCategory: string;
  confidenceScore: number;
  languageType: 'formal' | 'informal' | 'urgent' | 'emotional';
  prioritySignals: {
    timeReferences: string[];
    escalationWords: string[];
    businessImpact: string[];
  };
}

interface IRoutingDecision {
  assignedTo: string;
  assignedToName: string;
  routingReason: string;
  confidence: number;
  escalationPath: string[];
  estimatedResolutionTime: number; // in minutes
  alternativeAssignees: IAssignmentOption[];
  suggestedPriority?: ISupportTicket['priority'];
}

interface IEscalationPrediction {
  shouldEscalate: boolean;
  escalationProbability: number;
  suggestedEscalationTarget: string;
  suggestedEscalationTargetName: string;
  reasoning: string[];
  preventiveActions: string[];
  riskFactors: string[];
  timeline: string; // when escalation likely to occur
}

interface IAssignmentOption {
  assignedTo: string;
  assignedToName: string;
  currentWorkload: number;
  specialties: string[];
  matchScore: number;
  availability: 'available' | 'busy' | 'offline';
  estimatedResponseTime: number;
}

interface IRoutingContext {
  tenantId: string;
  currentTime: string;
  workloadMetrics: IWorkloadMetrics[];
  availableStaff: IStaffMember[];
  escalationRules: IEscalationRule[];
  historicalPerformance: IHistoricalPerformance[];
}

interface IWorkloadMetrics {
  staffId: string;
  currentTickets: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  specialties: string[];
  availability: 'available' | 'busy' | 'offline';
  skillLevel: 'junior' | 'senior' | 'expert';
}

interface IStaffMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  currentWorkload: number;
  maxCapacity: number;
  skillLevel: 'junior' | 'senior' | 'expert';
  shiftStatus: 'online' | 'offline' | 'break';
  responseTimeAvg: number;
  satisfactionRating: number;
}

interface IEscalationRule {
  id: string;
  condition: string;
  triggerKeywords: string[];
  escalationTarget: string;
  priority: number;
  isActive: boolean;
}

interface IHistoricalPerformance {
  staffId: string;
  category: string;
  avgResolutionTime: number;
  successRate: number;
  customerSatisfaction: number;
  ticketCount: number;
}

// ============================================================================
// NLP AND SENTIMENT ANALYSIS
// ============================================================================

// Enhanced NLP Analysis Engine using Real Claude API
class ClaudeNLPAnalysisEngine {
  private anthropicClient: any = null;
  
  async initializeClient() {
    if (!this.anthropicClient && aiConfig.providers.anthropic.enabled && aiConfig.providers.anthropic.apiKey) {
      const AnthropicSDK = await initializeAnthropic();
      this.anthropicClient = new AnthropicSDK({
        apiKey: aiConfig.providers.anthropic.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  async analyzeContent(text: string): Promise<IContentAnalysis> {
    // If Claude API is not available, fall back to mock analysis
    if (!aiConfig.providers.anthropic.enabled || !aiConfig.providers.anthropic.apiKey) {
      console.warn('🤖 Claude API not configured, using fallback analysis');
      return this.fallbackAnalysis(text);
    }

    try {
      await this.initializeClient();
      
      if (!this.anthropicClient) {
        console.warn('🤖 Claude client not initialized, using fallback analysis');
        return this.fallbackAnalysis(text);
      }

      // Create specialized prompt for ticket routing analysis
      const analysisPrompt = `You are an expert support ticket routing AI assistant. Analyze this support ticket content and provide routing insights.

TICKET CONTENT:
"${text}"

Analyze the ticket and respond with ONLY valid JSON in this exact format:
{
  "sentiment": "positive|neutral|negative|frustrated",
  "urgencyIndicators": ["list", "of", "urgency", "words", "found"],
  "technicalComplexity": "low|medium|high",
  "domainKeywords": ["relevant", "domain", "keywords"],
  "suggestedCategory": "general|technical|billing|ai_support|training_requests|false_alarms",
  "confidenceScore": 0.85,
  "languageType": "formal|informal|urgent|emotional",
  "prioritySignals": {
    "timeReferences": ["urgent", "asap", "immediately"],
    "escalationWords": ["manager", "supervisor", "escalate"],
    "businessImpact": ["revenue", "critical", "down"]
  }
}

Focus on:
1. Sentiment analysis (especially frustration indicators)
2. Technical complexity assessment
3. Urgency and priority signals
4. Category classification for proper routing
5. Business impact assessment

Respond with ONLY the JSON object, no additional text.`;

      console.log('🤖 Analyzing ticket with Claude API...');
      
      const response = await this.anthropicClient.messages.create({
        model: aiConfig.providers.anthropic.model,
        max_tokens: 1000,
        temperature: 0.1,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      });

      const content = response.content[0]?.type === 'text' ? response.content[0].text : '';
      
      try {
        const analysis = JSON.parse(content);
        console.log('✅ Claude analysis successful:', analysis);
        return analysis;
      } catch (parseError) {
        console.error('❌ Failed to parse Claude response as JSON:', parseError);
        console.log('Raw Claude response:', content);
        return this.fallbackAnalysis(text);
      }

    } catch (error) {
      console.error('❌ Claude API error, using fallback analysis:', error);
      return this.fallbackAnalysis(text);
    }
  }

  // Fallback analysis when Claude API is not available
  private fallbackAnalysis(text: string): IContentAnalysis {
    console.log('🔄 Using fallback ticket analysis...');
    
    const lowerText = text.toLowerCase();
    
    // Basic sentiment analysis
    const frustrationWords = ['frustrated', 'angry', 'terrible', 'awful', 'horrible', 'useless', 'broken'];
    const negativeWords = ['problem', 'issue', 'error', 'bug', 'fail', 'wrong', 'bad'];
    const positiveWords = ['thank', 'great', 'good', 'excellent', 'pleased', 'satisfied'];
    
    let sentiment: IContentAnalysis['sentiment'] = 'neutral';
    if (frustrationWords.some(word => lowerText.includes(word))) {
      sentiment = 'frustrated';
    } else if (negativeWords.some(word => lowerText.includes(word))) {
      sentiment = 'negative';
    } else if (positiveWords.some(word => lowerText.includes(word))) {
      sentiment = 'positive';
    }

    // Basic urgency detection
    const urgencyWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'now'];
    const urgencyIndicators = urgencyWords.filter(word => lowerText.includes(word));

    // Basic technical complexity
    const technicalWords = ['api', 'database', 'server', 'code', 'bug', 'system', 'integration'];
    const technicalComplexity = technicalWords.some(word => lowerText.includes(word)) ? 'high' : 'low';

    // Basic category suggestion
    let suggestedCategory = 'general';
    if (lowerText.includes('billing') || lowerText.includes('payment')) {
      suggestedCategory = 'billing';
    } else if (lowerText.includes('technical') || lowerText.includes('bug') || lowerText.includes('error')) {
      suggestedCategory = 'technical';
    } else if (lowerText.includes('ai') || lowerText.includes('false alarm')) {
      suggestedCategory = 'ai_support';
    }

    return {
      sentiment,
      urgencyIndicators,
      technicalComplexity: technicalComplexity as 'low' | 'medium' | 'high',
      domainKeywords: [],
      suggestedCategory,
      confidenceScore: 0.6, // Lower confidence for fallback
      languageType: urgencyIndicators.length > 0 ? 'urgent' : 'formal',
      prioritySignals: {
        timeReferences: urgencyIndicators,
        escalationWords: ['manager', 'supervisor'].filter(word => lowerText.includes(word)),
        businessImpact: ['revenue', 'critical', 'down'].filter(word => lowerText.includes(word))
      }
    };
  }
}

// ============================================================================
// INTELLIGENT ROUTING SERVICE CLASS
// ============================================================================

class IntelligentRoutingService {
  private nlpEngine = new ClaudeNLPAnalysisEngine();
  
  // Mock staff data - in production this would come from staff management system
  private mockStaffMembers: IStaffMember[] = [
    {
      id: 'support_001',
      name: 'Enhanced Support Staff',
      role: 'support',
      specialties: ['general', 'billing', 'basic_technical'],
      currentWorkload: 5,
      maxCapacity: 10,
      skillLevel: 'senior',
      shiftStatus: 'online',
      responseTimeAvg: 15, // minutes
      satisfactionRating: 4.2
    },
    {
      id: 'it_manager_001',
      name: 'IT Manager',
      role: 'it_manager', 
      specialties: ['technical', 'ai_support', 'infrastructure', 'security'],
      currentWorkload: 3,
      maxCapacity: 8,
      skillLevel: 'expert',
      shiftStatus: 'online',
      responseTimeAvg: 30, // minutes
      satisfactionRating: 4.7
    },
    {
      id: 'manager_001',
      name: 'Support Manager',
      role: 'manager',
      specialties: ['escalations', 'client_relations', 'billing_disputes'],
      currentWorkload: 2,
      maxCapacity: 6,
      skillLevel: 'expert',
      shiftStatus: 'online',
      responseTimeAvg: 45, // minutes
      satisfactionRating: 4.8
    },
    {
      id: 'support_002',
      name: 'AI Support Specialist',
      role: 'support',
      specialties: ['ai_support', 'false_alarms', 'training_requests'],
      currentWorkload: 4,
      maxCapacity: 8,
      skillLevel: 'expert',
      shiftStatus: 'online',
      responseTimeAvg: 20, // minutes
      satisfactionRating: 4.5
    }
  ];

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  async analyzeTicketContent(ticket: ISupportTicket): Promise<IContentAnalysis> {
    const fullText = `${ticket.title} ${ticket.description}`;
    console.log('🎯 Analyzing ticket content with Claude:', ticket.ticketNumber || ticket.id);
    
    // Call the Claude-powered analysis engine
    const analysis = await this.nlpEngine.analyzeContent(fullText);
    
    console.log('📊 Ticket analysis complete:', {
      ticketId: ticket.ticketNumber || ticket.id,
      sentiment: analysis.sentiment,
      category: analysis.suggestedCategory,
      complexity: analysis.technicalComplexity,
      confidence: analysis.confidenceScore
    });
    
    return analysis;
  }

  async determineOptimalRoute(
    ticket: ISupportTicket,
    analysis: IContentAnalysis,
    context: IRoutingContext
  ): Promise<IRoutingDecision> {
    
    // Get available staff
    const availableStaff = this.getAvailableStaff(context);
    
    // Score each staff member for this ticket
    const scoredCandidates = availableStaff.map(staff => ({
      ...staff,
      matchScore: this.calculateMatchScore(ticket, analysis, staff)
    }));
    
    // Sort by match score
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);
    
    // Select the best candidate
    const bestCandidate = scoredCandidates[0];
    
    // Create routing decision
    const routingDecision: IRoutingDecision = {
      assignedTo: bestCandidate.id,
      assignedToName: bestCandidate.name,
      routingReason: this.generateRoutingReason(analysis, bestCandidate),
      confidence: this.calculateRoutingConfidence(analysis, bestCandidate),
      escalationPath: this.buildEscalationPath(bestCandidate.role),
      estimatedResolutionTime: this.estimateResolutionTime(analysis, bestCandidate),
      alternativeAssignees: scoredCandidates.slice(1, 3).map(staff => ({
        assignedTo: staff.id,
        assignedToName: staff.name,
        currentWorkload: staff.currentWorkload,
        specialties: staff.specialties,
        matchScore: staff.matchScore,
        availability: staff.shiftStatus === 'online' ? 'available' : 'offline',
        estimatedResponseTime: staff.responseTimeAvg
      })),
      suggestedPriority: this.suggestPriority(analysis)
    };

    return routingDecision;
  }

  async predictEscalationNeed(
    ticket: ISupportTicket,
    historicalData: ISupportTicket[]
  ): Promise<IEscalationPrediction> {
    
    const analysis = await this.analyzeTicketContent(ticket);
    
    // Calculate escalation probability based on various factors
    let escalationProbability = 0.1; // Base 10%
    const riskFactors: string[] = [];
    const reasoning: string[] = [];
    
    // Sentiment-based risk
    if (analysis.sentiment === 'frustrated') {
      escalationProbability += 0.4;
      riskFactors.push('Customer frustration detected');
      reasoning.push('Frustrated language indicates high escalation risk');
    } else if (analysis.sentiment === 'negative') {
      escalationProbability += 0.2;
      riskFactors.push('Negative sentiment');
    }
    
    // Priority-based risk
    if (ticket.priority === 'critical') {
      escalationProbability += 0.3;
      riskFactors.push('Critical priority ticket');
      reasoning.push('Critical tickets often require management attention');
    } else if (ticket.priority === 'high') {
      escalationProbability += 0.15;
      riskFactors.push('High priority ticket');
    }
    
    // Category-based risk
    if (ticket.category === 'billing') {
      escalationProbability += 0.2;
      riskFactors.push('Billing-related issue');
      reasoning.push('Billing issues frequently escalate to management');
    }
    
    // Escalation keywords
    if (analysis.prioritySignals.escalationWords.length > 0) {
      escalationProbability += 0.5;
      riskFactors.push('Escalation keywords detected');
      reasoning.push(`Found escalation triggers: ${analysis.prioritySignals.escalationWords.join(', ')}`);
    }
    
    // Business impact
    if (analysis.prioritySignals.businessImpact.length > 0) {
      escalationProbability += 0.2;
      riskFactors.push('Business impact mentioned');
    }
    
    // Historical pattern analysis
    const similarTickets = this.findSimilarTickets(ticket, historicalData);
    const historicalEscalationRate = this.calculateHistoricalEscalationRate(similarTickets);
    escalationProbability = (escalationProbability + historicalEscalationRate) / 2;
    
    // Cap at 95%
    escalationProbability = Math.min(escalationProbability, 0.95);
    
    // Determine if escalation should happen
    const shouldEscalate = escalationProbability > 0.6;
    
    // Determine escalation target
    let escalationTarget = 'manager_001';
    let escalationTargetName = 'Support Manager';
    
    if (analysis.technicalComplexity === 'high' || ticket.category === 'technical' || ticket.category === 'ai_support') {
      escalationTarget = 'it_manager_001';
      escalationTargetName = 'IT Manager';
    }
    
    // Preventive actions
    const preventiveActions = this.generatePreventiveActions(analysis, riskFactors);
    
    // Timeline prediction
    const timeline = this.predictEscalationTimeline(escalationProbability);

    return {
      shouldEscalate,
      escalationProbability,
      suggestedEscalationTarget: escalationTarget,
      suggestedEscalationTargetName: escalationTargetName,
      reasoning,
      preventiveActions,
      riskFactors,
      timeline
    };
  }

  async optimizeAssignment(
    candidates: IStaffMember[],
    workloadData: IWorkloadMetrics[]
  ): Promise<IStaffMember> {
    
    // Score each candidate based on multiple factors
    const scoredCandidates = candidates.map(candidate => {
      const workload = workloadData.find(w => w.staffId === candidate.id);
      let score = 0;
      
      // Availability score (40% weight)
      const availabilityScore = candidate.shiftStatus === 'online' ? 1 : 0;
      score += availabilityScore * 0.4;
      
      // Workload score (30% weight) - inverse relationship
      const workloadScore = workload ? Math.max(0, 1 - (workload.currentTickets / 10)) : 0.5;
      score += workloadScore * 0.3;
      
      // Performance score (20% weight)
      const performanceScore = (candidate.satisfactionRating / 5);
      score += performanceScore * 0.2;
      
      // Response time score (10% weight) - inverse relationship
      const responseScore = Math.max(0, 1 - (candidate.responseTimeAvg / 60));
      score += responseScore * 0.1;
      
      return { ...candidate, optimizationScore: score };
    });
    
    // Sort by optimization score
    scoredCandidates.sort((a, b) => (b as any).optimizationScore - (a as any).optimizationScore);
    
    return scoredCandidates[0];
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getAvailableStaff(context: IRoutingContext): IStaffMember[] {
    return this.mockStaffMembers.filter(staff => 
      staff.shiftStatus === 'online' && 
      staff.currentWorkload < staff.maxCapacity
    );
  }

  private calculateMatchScore(
    ticket: ISupportTicket,
    analysis: IContentAnalysis,
    staff: IStaffMember
  ): number {
    let score = 0;
    
    // Specialty matching (50% weight)
    const specialtyMatch = staff.specialties.includes(ticket.category) || 
                          staff.specialties.includes('general');
    score += specialtyMatch ? 0.5 : 0;
    
    // Skill level vs complexity (30% weight)
    const complexityMatch = this.matchComplexityToSkill(analysis.technicalComplexity, staff.skillLevel);
    score += complexityMatch * 0.3;
    
    // Workload availability (20% weight)
    const workloadScore = Math.max(0, 1 - (staff.currentWorkload / staff.maxCapacity));
    score += workloadScore * 0.2;
    
    return score;
  }

  private matchComplexityToSkill(complexity: string, skillLevel: string): number {
    if (complexity === 'high' && skillLevel === 'expert') return 1;
    if (complexity === 'medium' && (skillLevel === 'senior' || skillLevel === 'expert')) return 1;
    if (complexity === 'low') return 1;
    return 0.5; // Partial match
  }

  private generateRoutingReason(analysis: IContentAnalysis, staff: IStaffMember): string {
    const reasons: string[] = [];
    
    if (staff.specialties.includes(analysis.suggestedCategory)) {
      reasons.push(`Specialist in ${analysis.suggestedCategory}`);
    }
    
    if (analysis.technicalComplexity === 'high' && staff.skillLevel === 'expert') {
      reasons.push('Expert required for high technical complexity');
    }
    
    if (analysis.sentiment === 'frustrated' && staff.role === 'manager') {
      reasons.push('Management attention needed for frustrated customer');
    }
    
    if (staff.currentWorkload < staff.maxCapacity * 0.5) {
      reasons.push('Available capacity');
    }
    
    return reasons.length > 0 ? reasons.join('; ') : 'Best available match';
  }

  private calculateRoutingConfidence(analysis: IContentAnalysis, staff: IStaffMember): number {
    let confidence = analysis.confidenceScore;
    
    // Boost confidence for good specialty match
    if (staff.specialties.includes(analysis.suggestedCategory)) {
      confidence += 0.2;
    }
    
    // Boost for skill match
    if (this.matchComplexityToSkill(analysis.technicalComplexity, staff.skillLevel) === 1) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  private buildEscalationPath(currentRole: string): string[] {
    switch (currentRole) {
      case 'support':
        return ['manager', 'admin'];
      case 'manager':
        return ['admin'];
      case 'it_manager':
        return ['admin'];
      default:
        return ['admin'];
    }
  }

  private estimateResolutionTime(analysis: IContentAnalysis, staff: IStaffMember): number {
    let baseTime = staff.responseTimeAvg;
    
    // Adjust for complexity
    if (analysis.technicalComplexity === 'high') baseTime *= 2;
    else if (analysis.technicalComplexity === 'low') baseTime *= 0.5;
    
    // Adjust for urgency
    if (analysis.urgencyIndicators.length > 2) baseTime *= 0.7;
    
    // Adjust for sentiment
    if (analysis.sentiment === 'frustrated') baseTime *= 1.5;
    
    return Math.round(baseTime);
  }

  private suggestPriority(analysis: IContentAnalysis): ISupportTicket['priority'] {
    if (analysis.sentiment === 'frustrated' || analysis.urgencyIndicators.length > 3) {
      return 'critical';
    } else if (analysis.urgencyIndicators.length > 1 || analysis.prioritySignals.businessImpact.length > 0) {
      return 'high';
    } else if (analysis.sentiment === 'negative' || analysis.urgencyIndicators.length > 0) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private findSimilarTickets(ticket: ISupportTicket, historicalData: ISupportTicket[]): ISupportTicket[] {
    return historicalData.filter(h => 
      h.category === ticket.category && 
      h.priority === ticket.priority
    );
  }

  private calculateHistoricalEscalationRate(similarTickets: ISupportTicket[]): number {
    if (similarTickets.length === 0) return 0.1;
    
    const escalatedCount = similarTickets.filter(t => 
      t.assignedToName?.toLowerCase().includes('manager') ||
      t.assignedToName?.toLowerCase().includes('admin')
    ).length;
    
    return escalatedCount / similarTickets.length;
  }

  private generatePreventiveActions(analysis: IContentAnalysis, riskFactors: string[]): string[] {
    const actions: string[] = [];
    
    if (analysis.sentiment === 'frustrated') {
      actions.push('Prioritize immediate response');
      actions.push('Use empathetic language');
      actions.push('Offer compensation if appropriate');
    }
    
    if (analysis.prioritySignals.escalationWords.length > 0) {
      actions.push('Address escalation concerns directly');
      actions.push('Provide manager contact information');
    }
    
    if (analysis.technicalComplexity === 'high') {
      actions.push('Involve technical specialist');
      actions.push('Provide detailed technical explanation');
    }
    
    if (analysis.prioritySignals.businessImpact.length > 0) {
      actions.push('Acknowledge business impact');
      actions.push('Provide timeline for resolution');
    }
    
    return actions;
  }

  private predictEscalationTimeline(probability: number): string {
    if (probability > 0.8) return 'Within 1 hour';
    if (probability > 0.6) return 'Within 4 hours';
    if (probability > 0.4) return 'Within 24 hours';
    return 'Low likelihood';
  }

  // ============================================================================
  // PUBLIC UTILITY METHODS
  // ============================================================================

  async testRoutingDecision(ticket: ISupportTicket): Promise<{
    analysis: IContentAnalysis;
    routing: IRoutingDecision;
    escalation: IEscalationPrediction;
  }> {
    const context: IRoutingContext = {
      tenantId: 'demo_tenant',
      currentTime: new Date().toISOString(),
      workloadMetrics: this.mockStaffMembers.map(staff => ({
        staffId: staff.id,
        currentTickets: staff.currentWorkload,
        avgResolutionTime: staff.responseTimeAvg,
        customerSatisfaction: staff.satisfactionRating,
        specialties: staff.specialties,
        availability: staff.shiftStatus === 'online' ? 'available' : 'offline',
        skillLevel: staff.skillLevel
      })),
      availableStaff: this.mockStaffMembers,
      escalationRules: [],
      historicalPerformance: []
    };

    const analysis = await this.analyzeTicketContent(ticket);
    const routing = await this.determineOptimalRoute(ticket, analysis, context);
    const escalation = await this.predictEscalationNeed(ticket, []);

    return { analysis, routing, escalation };
  }

  getAvailableStaffSummary(): IStaffMember[] {
    return this.mockStaffMembers;
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const intelligentRoutingService = new IntelligentRoutingService();
export type { 
  IContentAnalysis, 
  IRoutingDecision, 
  IEscalationPrediction, 
  IAssignmentOption,
  IRoutingContext,
  IWorkloadMetrics
}; 