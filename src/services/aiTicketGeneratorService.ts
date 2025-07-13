/**
 * AI Ticket Generation Service - Phase 1 Core Component
 * Automatically generates tickets from system monitoring, performance issues, and anomaly detection
 * 
 * @description Implements the AI-powered ticket generation from Phase 1 specifications
 * @compliance Multi-tenant with zero trust security
 * @author One Barn Development Team
 * @since Phase 1.0.0
 */

import { ticketService, ISupportTicket } from './ticketService';
import { aiMonitorService } from './aiMonitorService';  
import { aiDataVaultService } from './aiDataVaultService';
import { aiConfig } from '../config/aiConfig';
import { brandConfig } from '../config/brandConfig';

// ============================================================================
// AI TICKET GENERATION INTERFACES
// ============================================================================

interface IAISystemIssue {
  issueType: 'performance_degradation' | 'system_error' | 'data_anomaly' | 'security_alert' | 'capacity_warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  component: string;
  description: string;
  metrics: Record<string, any>;
  timestamp: string;
  tenantId: string;
  aiConfidence: number;
}

interface IPerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  errorRate: number;
  responseTime: number;
  timestamp: string;
  tenantId: string;
}

interface IMaintenanceSchedule {
  scheduleId: string;
  maintenanceType: 'preventive' | 'corrective' | 'upgrade';
  component: string;
  scheduledDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  tenantId: string;
}

interface IAnomalyPattern {
  patternType: 'behavioral' | 'performance' | 'security' | 'data_quality';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedSystems: string[];
  deviation: number;
  timestamp: string;
  tenantId: string;
  confidence: number;
}

interface IFalsePositiveCluster {
  clusterId: string;
  alertType: string;
  falsePositiveCount: number;
  timeRange: { start: string; end: string };
  affectedHorses?: string[];
  cameras?: string[];
  tenantId: string;
  confidence: number;
}

// ============================================================================
// AI TICKET CATEGORIES CONFIGURATION
// ============================================================================

const AI_TICKET_CATEGORIES = {
  // System Intelligence
  'ai_system_alert': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'high' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['ai-system', 'automated', 'infrastructure']
  },
  'ai_performance': {
    category: 'technical' as const,
    type: 'ai_support' as const, 
    priority: 'medium' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['ai-performance', 'automated', 'optimization']
  },
  'ai_maintenance': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'manager_001',
    assignToName: 'Support Manager',
    tags: ['ai-maintenance', 'automated', 'scheduled']
  },
  'ai_model_update': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'high' as const,
    assignTo: 'it_manager_001', 
    assignToName: 'IT Manager',
    tags: ['ai-model', 'automated', 'update']
  },
  
  // Data Intelligence
  'data_anomaly': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager', 
    tags: ['data-anomaly', 'automated', 'analysis']
  },
  'data_quality': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'manager_001',
    assignToName: 'Support Manager',
    tags: ['data-quality', 'automated', 'integrity']
  },
  'data_volume': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'high' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['data-volume', 'automated', 'capacity']
  },
  
  // Infrastructure Intelligence
  'infrastructure_alert': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'high' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['infrastructure', 'automated', 'alert']
  },
  'capacity_planning': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'manager_001',
    assignToName: 'Support Manager',
    tags: ['capacity', 'automated', 'planning']
  },
  'security_alert': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'critical' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['security', 'automated', 'alert']
  },
  
  // Pattern Intelligence
  'pattern_drift': {
    category: 'ai_support' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'manager_001',
    assignToName: 'Support Manager',
    tags: ['pattern-drift', 'automated', 'behavior']
  },
  'correlation_alert': {
    category: 'technical' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['correlation', 'automated', 'analysis']
  },
  'prediction_accuracy': {
    category: 'ai_support' as const,
    type: 'ai_support' as const,
    priority: 'medium' as const,
    assignTo: 'it_manager_001',
    assignToName: 'IT Manager',
    tags: ['prediction', 'automated', 'accuracy']
  }
};

// ============================================================================
// AI TICKET GENERATOR SERVICE CLASS
// ============================================================================

class AITicketGeneratorService {
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Auto-start monitoring in demo mode
    if (aiConfig.demoMode.enabled) {
      this.startSystemMonitoring();
    }
  }

  // ============================================================================
  // SYSTEM HEALTH MONITORING
  // ============================================================================

  async generateSystemHealthTicket(issue: IAISystemIssue): Promise<ISupportTicket> {
    const ticketConfig = AI_TICKET_CATEGORIES['ai_system_alert'];
    const ticketNumber = await this.getNextAITicketNumber('SYS');

    const ticket = await ticketService.createTicket({
      title: `[AI ALERT] ${issue.component} - ${issue.description}`,
      description: this.formatSystemHealthDescription(issue),
      category: ticketConfig.category,
      type: ticketConfig.type,
      priority: this.mapSeverityToPriority(issue.severity),
      clientId: `system_${issue.tenantId}`,
      clientName: 'AI System Monitor',
      clientEmail: 'ai-monitor@onebarn.system',
      assignedTo: ticketConfig.assignTo,
      assignedToName: ticketConfig.assignToName,
      tags: [
        ...ticketConfig.tags,
        issue.issueType,
        issue.component.toLowerCase(),
        `confidence-${Math.round(issue.aiConfidence * 100)}`
      ],
      aiMetadata: {
        confidence: issue.aiConfidence,
        alertId: `sys-${Date.now()}`,
        sourceSystem: 'ai_monitor',
        autoGenerated: true,
        issueType: issue.issueType,
        component: issue.component,
        metrics: issue.metrics
      }
    });

    // Log to AI Data Vault
    await this.logAITicketGeneration('system_health', ticket, issue);

    return ticket;
  }

  // ============================================================================
  // PERFORMANCE DEGRADATION DETECTION  
  // ============================================================================

  async generatePerformanceTicket(metrics: IPerformanceMetrics): Promise<ISupportTicket> {
    const ticketConfig = AI_TICKET_CATEGORIES['ai_performance'];
    const ticketNumber = await this.getNextAITicketNumber('PERF');

    const performanceIssues = this.analyzePerformanceMetrics(metrics);
    
    const ticket = await ticketService.createTicket({
      title: `[AI ALERT] Performance Degradation Detected - ${performanceIssues.primaryIssue}`,
      description: this.formatPerformanceDescription(metrics, performanceIssues),
      category: ticketConfig.category,
      type: ticketConfig.type,
      priority: this.determinePerfPriority(performanceIssues),
      clientId: `system_${metrics.tenantId}`,
      clientName: 'AI Performance Monitor',
      clientEmail: 'ai-performance@onebarn.system',
      assignedTo: ticketConfig.assignTo,
      assignedToName: ticketConfig.assignToName,
      tags: [
        ...ticketConfig.tags,
        'performance-degradation',
        performanceIssues.primaryIssue,
        `severity-${performanceIssues.severity}`
      ],
      aiMetadata: {
        confidence: performanceIssues.confidence,
        alertId: `perf-${Date.now()}`,
        sourceSystem: 'performance_monitor',
        autoGenerated: true,
        metrics: metrics,
        issues: performanceIssues.issues
      }
    });

    // Log to AI Data Vault
    await this.logAITicketGeneration('performance_degradation', ticket, metrics);

    return ticket;
  }

  // ============================================================================
  // PROACTIVE MAINTENANCE
  // ============================================================================

  async generateMaintenanceTicket(schedule: IMaintenanceSchedule): Promise<ISupportTicket> {
    const ticketConfig = AI_TICKET_CATEGORIES['ai_maintenance'];
    const ticketNumber = await this.getNextAITicketNumber('MAINT');

    const ticket = await ticketService.createTicket({
      title: `[AI SCHEDULED] ${schedule.maintenanceType.toUpperCase()} Maintenance - ${schedule.component}`,
      description: this.formatMaintenanceDescription(schedule),
      category: ticketConfig.category,
      type: ticketConfig.type,
      priority: schedule.priority,
      clientId: `system_${schedule.tenantId}`,
      clientName: 'AI Maintenance Scheduler',
      clientEmail: 'ai-maintenance@onebarn.system',
      assignedTo: ticketConfig.assignTo,
      assignedToName: ticketConfig.assignToName,
      tags: [
        ...ticketConfig.tags,
        schedule.maintenanceType,
        schedule.component.toLowerCase(),
        'scheduled'
      ],
      aiMetadata: {
        confidence: 1.0, // Scheduled maintenance is always 100% confidence
        alertId: schedule.scheduleId,
        sourceSystem: 'maintenance_scheduler',
        autoGenerated: true,
        scheduledDate: schedule.scheduledDate,
        maintenanceType: schedule.maintenanceType
      }
    });

    // Log to AI Data Vault
    await this.logAITicketGeneration('proactive_maintenance', ticket, schedule);

    return ticket;
  }

  // ============================================================================
  // PATTERN ANOMALY DETECTION
  // ============================================================================

  async generateAnomalyTicket(pattern: IAnomalyPattern): Promise<ISupportTicket> {
    const ticketConfig = AI_TICKET_CATEGORIES['data_anomaly'];
    const ticketNumber = await this.getNextAITicketNumber('ANOM');

    const ticket = await ticketService.createTicket({
      title: `[AI ANOMALY] ${pattern.patternType.toUpperCase()} Pattern Deviation - ${pattern.description}`,
      description: this.formatAnomalyDescription(pattern),
      category: ticketConfig.category,
      type: ticketConfig.type,
      priority: this.mapSeverityToPriority(pattern.severity),
      clientId: `system_${pattern.tenantId}`,
      clientName: 'AI Anomaly Detector',
      clientEmail: 'ai-anomaly@onebarn.system',
      assignedTo: ticketConfig.assignTo,
      assignedToName: ticketConfig.assignToName,
      tags: [
        ...ticketConfig.tags,
        pattern.patternType,
        'anomaly-detection',
        `deviation-${Math.round(pattern.deviation * 100)}`
      ],
      aiMetadata: {
        confidence: pattern.confidence,
        alertId: `anom-${Date.now()}`,
        sourceSystem: 'anomaly_detector',
        autoGenerated: true,
        patternType: pattern.patternType,
        deviation: pattern.deviation,
        affectedSystems: pattern.affectedSystems
      }
    });

    // Log to AI Data Vault
    await this.logAITicketGeneration('anomaly_detection', ticket, pattern);

    return ticket;
  }

  // ============================================================================
  // FALSE POSITIVE CLUSTERING
  // ============================================================================

  async generateFalsePositiveTicket(cluster: IFalsePositiveCluster): Promise<ISupportTicket> {
    const ticketConfig = AI_TICKET_CATEGORIES['ai_model_update'];
    const ticketNumber = await this.getNextAITicketNumber('FP');

    const ticket = await ticketService.createTicket({
      title: `[AI LEARNING] False Positive Cluster Detected - ${cluster.alertType}`,
      description: this.formatFalsePositiveDescription(cluster),
      category: ticketConfig.category,
      type: ticketConfig.type,
      priority: this.determineFPPriority(cluster),
      clientId: `system_${cluster.tenantId}`,
      clientName: 'AI Learning System',
      clientEmail: 'ai-learning@onebarn.system',
      assignedTo: ticketConfig.assignTo,
      assignedToName: ticketConfig.assignToName,
      tags: [
        ...ticketConfig.tags,
        'false-positive',
        'model-tuning',
        cluster.alertType.toLowerCase(),
        `count-${cluster.falsePositiveCount}`
      ],
      aiMetadata: {
        confidence: cluster.confidence,
        alertId: cluster.clusterId,
        sourceSystem: 'ai_learning',
        autoGenerated: true,
        clusterId: cluster.clusterId,
        falsePositiveCount: cluster.falsePositiveCount,
        timeRange: cluster.timeRange
      }
    });

    // Log to AI Data Vault  
    await this.logAITicketGeneration('false_positive_clustering', ticket, cluster);

    return ticket;
  }

  // ============================================================================
  // SYSTEM MONITORING CONTROL
  // ============================================================================

  startSystemMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🤖 AI Ticket Generator: Starting system monitoring...');

    // Monitor every 5 minutes in demo mode, 30 seconds in development
    const intervalMs = aiConfig.demoMode.enabled ? 5 * 60 * 1000 : 30 * 1000;

    this.monitoringInterval = setInterval(async () => {
      try {
        await this.performSystemChecks();
      } catch (error) {
        console.error('AI Ticket Generator monitoring error:', error);
      }
    }, intervalMs);
  }

  stopSystemMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('🤖 AI Ticket Generator: System monitoring stopped');
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async performSystemChecks(): Promise<void> {
    const tenantId = this.getCurrentTenantId();
    if (!tenantId) return;

    // Check system performance
    const performanceMetrics = await this.collectPerformanceMetrics(tenantId);
    if (this.shouldCreatePerformanceTicket(performanceMetrics)) {
      await this.generatePerformanceTicket(performanceMetrics);
    }

    // Check for anomalies (demo simulation)
    if (Math.random() < 0.1) { // 10% chance
      const anomaly = this.generateMockAnomaly(tenantId);
      await this.generateAnomalyTicket(anomaly);
    }

    // Check for false positive clusters (demo simulation)  
    if (Math.random() < 0.05) { // 5% chance
      const fpCluster = this.generateMockFalsePositiveCluster(tenantId);
      await this.generateFalsePositiveTicket(fpCluster);
    }
  }

  private async collectPerformanceMetrics(tenantId: string): Promise<IPerformanceMetrics> {
    // In demo mode, generate realistic but mock metrics
    return {
      cpuUsage: 40 + Math.random() * 50, // 40-90%
      memoryUsage: 50 + Math.random() * 40, // 50-90%
      diskUsage: 30 + Math.random() * 60, // 30-90%
      networkLatency: 50 + Math.random() * 200, // 50-250ms
      errorRate: Math.random() * 5, // 0-5%
      responseTime: 100 + Math.random() * 400, // 100-500ms
      timestamp: new Date().toISOString(),
      tenantId
    };
  }

  private shouldCreatePerformanceTicket(metrics: IPerformanceMetrics): boolean {
    return (
      metrics.cpuUsage > 85 ||
      metrics.memoryUsage > 85 ||
      metrics.diskUsage > 85 ||
      metrics.networkLatency > 200 ||
      metrics.errorRate > 3 ||
      metrics.responseTime > 400
    );
  }

  private analyzePerformanceMetrics(metrics: IPerformanceMetrics) {
    const issues: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let primaryIssue = 'General Performance';

    if (metrics.cpuUsage > 90) {
      issues.push('Critical CPU usage');
      severity = 'critical';
      primaryIssue = 'CPU Overload';
    } else if (metrics.cpuUsage > 85) {
      issues.push('High CPU usage');
      severity = 'high';
      primaryIssue = 'CPU Strain';
    }

    if (metrics.memoryUsage > 90) {
      issues.push('Critical memory usage');
      severity = 'critical';
      primaryIssue = 'Memory Exhaustion';
    } else if (metrics.memoryUsage > 85) {
      issues.push('High memory usage');
      if (severity === 'low') severity = 'high';
    }

    if (metrics.responseTime > 500) {
      issues.push('Slow response times');
      if (severity === 'low') severity = 'medium';
    }

    if (metrics.errorRate > 5) {
      issues.push('High error rate');
      severity = 'critical';
      primaryIssue = 'System Errors';
    }

    return {
      issues,
      severity,
      primaryIssue,
      confidence: 0.8 + (issues.length * 0.05)
    };
  }

  private generateMockAnomaly(tenantId: string): IAnomalyPattern {
    const patternTypes = ['behavioral', 'performance', 'security', 'data_quality'] as const;
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    
    return {
      patternType: patternTypes[Math.floor(Math.random() * patternTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: 'Unusual pattern detected in system behavior',
      affectedSystems: ['camera_feed', 'ai_processor'],
      deviation: 0.3 + Math.random() * 0.6, // 0.3 to 0.9
      timestamp: new Date().toISOString(),
      tenantId,
      confidence: 0.7 + Math.random() * 0.25 // 0.7 to 0.95
    };
  }

  private generateMockFalsePositiveCluster(tenantId: string): IFalsePositiveCluster {
    const alertTypes = ['health_alert', 'behavior_alert', 'safety_alert'];
    
    return {
      clusterId: `fp-cluster-${Date.now()}`,
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      falsePositiveCount: 5 + Math.floor(Math.random() * 15), // 5-20
      timeRange: {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      },
      tenantId,
      confidence: 0.8 + Math.random() * 0.15 // 0.8 to 0.95
    };
  }

  private mapSeverityToPriority(severity: string): ISupportTicket['priority'] {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  private determinePerfPriority(issues: any): ISupportTicket['priority'] {
    switch (issues.severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  }

  private determineFPPriority(cluster: IFalsePositiveCluster): ISupportTicket['priority'] {
    if (cluster.falsePositiveCount > 15) return 'high';
    if (cluster.falsePositiveCount > 10) return 'medium';
    return 'low';
  }

  private formatSystemHealthDescription(issue: IAISystemIssue): string {
    return `**AI System Health Alert**

**Issue Type:** ${issue.issueType.replace(/_/g, ' ').toUpperCase()}
**Component:** ${issue.component}
**Severity:** ${issue.severity.toUpperCase()}
**AI Confidence:** ${Math.round(issue.aiConfidence * 100)}%

**Description:**
${issue.description}

**Metrics:**
${Object.entries(issue.metrics).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

**Timestamp:** ${new Date(issue.timestamp).toLocaleString()}

**Next Steps:**
1. Investigate the ${issue.component} component
2. Review system logs for additional context
3. Apply appropriate fixes based on issue type
4. Monitor for resolution

*This ticket was automatically generated by the AI System Monitor.*`;
  }

  private formatPerformanceDescription(metrics: IPerformanceMetrics, issues: any): string {
    return `**AI Performance Degradation Alert**

**Primary Issue:** ${issues.primaryIssue}
**Severity:** ${issues.severity.toUpperCase()}
**Confidence:** ${Math.round(issues.confidence * 100)}%

**Current Metrics:**
• CPU Usage: ${metrics.cpuUsage.toFixed(1)}%
• Memory Usage: ${metrics.memoryUsage.toFixed(1)}%  
• Disk Usage: ${metrics.diskUsage.toFixed(1)}%
• Network Latency: ${metrics.networkLatency.toFixed(0)}ms
• Error Rate: ${metrics.errorRate.toFixed(2)}%
• Response Time: ${metrics.responseTime.toFixed(0)}ms

**Identified Issues:**
${issues.issues.map((issue: string) => `• ${issue}`).join('\n')}

**Recommended Actions:**
1. Review system resource utilization
2. Check for resource-intensive processes
3. Consider scaling resources if needed
4. Monitor performance trends

*This ticket was automatically generated by the AI Performance Monitor.*`;
  }

  private formatMaintenanceDescription(schedule: IMaintenanceSchedule): string {
    return `**AI Scheduled Maintenance**

**Maintenance Type:** ${schedule.maintenanceType.toUpperCase()}
**Component:** ${schedule.component}
**Scheduled Date:** ${new Date(schedule.scheduledDate).toLocaleString()}
**Priority:** ${schedule.priority.toUpperCase()}

**Description:**
${schedule.description}

**Pre-Maintenance Checklist:**
- [ ] Notify affected users
- [ ] Backup relevant data
- [ ] Prepare rollback plan
- [ ] Schedule maintenance window

**Post-Maintenance Verification:**
- [ ] Verify system functionality
- [ ] Check performance metrics
- [ ] Confirm user access
- [ ] Update maintenance logs

*This ticket was automatically generated by the AI Maintenance Scheduler.*`;
  }

  private formatAnomalyDescription(pattern: IAnomalyPattern): string {
    return `**AI Anomaly Detection Alert**

**Pattern Type:** ${pattern.patternType.replace(/_/g, ' ').toUpperCase()}
**Severity:** ${pattern.severity.toUpperCase()}
**Deviation:** ${Math.round(pattern.deviation * 100)}% from normal
**Confidence:** ${Math.round(pattern.confidence * 100)}%

**Description:**
${pattern.description}

**Affected Systems:**
${pattern.affectedSystems.map(system => `• ${system}`).join('\n')}

**Detection Details:**
• Timestamp: ${new Date(pattern.timestamp).toLocaleString()}
• Pattern deviation exceeds normal parameters
• Requires investigation and potential system adjustment

**Recommended Actions:**
1. Investigate affected systems for root cause
2. Review recent changes that might cause anomaly
3. Adjust system parameters if needed
4. Monitor for pattern normalization

*This ticket was automatically generated by the AI Anomaly Detector.*`;
  }

  private formatFalsePositiveDescription(cluster: IFalsePositiveCluster): string {
    return `**AI False Positive Cluster Detected**

**Alert Type:** ${cluster.alertType.replace(/_/g, ' ').toUpperCase()}
**False Positive Count:** ${cluster.falsePositiveCount}
**Time Range:** ${new Date(cluster.timeRange.start).toLocaleString()} - ${new Date(cluster.timeRange.end).toLocaleString()}
**Confidence:** ${Math.round(cluster.confidence * 100)}%

**Cluster Analysis:**
The AI system has detected a cluster of false positive alerts that suggest model tuning is needed.

**Impact:**
• Reduced system efficiency
• Unnecessary alert fatigue
• Potential user trust issues

**Affected Resources:**
${cluster.affectedHorses ? `• Horses: ${cluster.affectedHorses.join(', ')}` : ''}
${cluster.cameras ? `• Cameras: ${cluster.cameras.join(', ')}` : ''}

**Recommended Actions:**
1. Review alert patterns for common factors
2. Adjust AI model parameters
3. Retrain model with additional data
4. Update alert thresholds
5. Monitor for improvement

*This ticket was automatically generated by the AI Learning System.*`;
  }

  private async getNextAITicketNumber(prefix: string): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `#AI-${prefix}-${timestamp}-${random}`;
  }

  private getCurrentTenantId(): string {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed.tenantId || parsed.tenant || 'demo_tenant';
      }
      return 'demo_tenant';
    } catch {
      return 'demo_tenant';
    }
  }

  private async logAITicketGeneration(
    generationType: string,
    ticket: ISupportTicket,
    sourceData: any
  ): Promise<void> {
    try {
      // Log the AI ticket generation event
      const logEntry = {
        type: 'ai_ticket_generation',
        generationType,
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        sourceData: sourceData,
        timestamp: new Date().toISOString(),
        tenantId: ticket.clientId.replace('system_', ''),
        confidence: ticket.aiMetadata?.confidence || 0
      };

      // In production, this would go to aiDataVaultService
      console.log('🤖 AI Ticket Generated:', logEntry);
      
    } catch (error) {
      console.error('Failed to log AI ticket generation:', error);
    }
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  getMonitoringStatus(): { isMonitoring: boolean; uptime: string } {
    return {
      isMonitoring: this.isMonitoring,
      uptime: this.isMonitoring ? 'Active' : 'Stopped'
    };
  }

  async generateTestTicket(type: keyof typeof AI_TICKET_CATEGORIES): Promise<ISupportTicket> {
    const tenantId = this.getCurrentTenantId();
    
    switch (type) {
      case 'ai_system_alert':
        return this.generateSystemHealthTicket({
          issueType: 'system_error',
          severity: 'high',
          component: 'AI Processing Engine',
          description: 'Test system health alert',
          metrics: { errorCount: 5, avgResponseTime: 500 },
          timestamp: new Date().toISOString(),
          tenantId,
          aiConfidence: 0.85
        });
        
      case 'ai_performance':
        return this.generatePerformanceTicket({
          cpuUsage: 90,
          memoryUsage: 85,
          diskUsage: 75,
          networkLatency: 250,
          errorRate: 4,
          responseTime: 450,
          timestamp: new Date().toISOString(),
          tenantId
        });
        
      default:
        throw new Error(`Test ticket type ${type} not implemented`);
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const aiTicketGeneratorService = new AITicketGeneratorService();
export type { IAISystemIssue, IPerformanceMetrics, IMaintenanceSchedule, IAnomalyPattern, IFalsePositiveCluster }; 