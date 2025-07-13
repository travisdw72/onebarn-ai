// Zero Trust AI Service - Security-First AI Chat Implementation
import { aiService } from './aiProviders';
import type { User } from '../config/adminDashboardData';

// Types for secure AI system
interface SecureAIRequest {
  question: string;
  user: User;
  context?: 'dashboard' | 'horse-profile' | 'training' | 'health';
}

interface SecureAIResponse {
  answer: string;
  confidence: number;
  sources: string[];
  securityLevel: 'safe' | 'filtered' | 'blocked';
  auditId: string;
}

interface UserAccessibleData {
  horses: Array<{
    id: string;
    name: string;
    breed: string;
    age: number;
    status: string;
    lastActivity: string;
  }>;
  trainingSessions: Array<{
    id: string;
    horseId: string;
    date: string;
    type: string;
    notes: string;
  }>;
  healthRecords: Array<{
    id: string;
    horseId: string;
    date: string;
    type: string;
    status: string;
  }>;
  facilities: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  permissions: string[];
}

class SecureAIService {
  private auditLog: Array<{
    id: string;
    userId: string;
    tenantId: string;
    question: string;
    response: string;
    securityLevel: string;
    timestamp: string;
    ipAddress?: string;
  }> = [];

  /**
   * LAYER 1: Data Filtering - Only get data user has permission to see
   */
  private async getFilteredUserData(user: User): Promise<UserAccessibleData> {
    const baseData: UserAccessibleData = {
      horses: [],
      trainingSessions: [],
      healthRecords: [],
      facilities: [],
      permissions: user.permissions || []
    };

    // Role-based data access
    switch (user.role) {
      case 'client':
        return this.getClientData(user, baseData);
      case 'employee':
        return this.getTrainerData(user, baseData);
      case 'admin':
        return this.getAdminData(user, baseData);
      default:
        return baseData; // Empty data for unknown roles
    }
  }

  private async getClientData(user: User, baseData: UserAccessibleData): Promise<UserAccessibleData> {
    // Clients can only see their own horses
    // In a real app, this would query the database with user.id filter
    const mockClientHorses = [
      {
        id: 'horse-001',
        name: 'Thunder Bay',
        breed: 'Quarter Horse',
        age: 8,
        status: 'active',
        lastActivity: '2 hours ago'
      },
      {
        id: 'horse-002',
        name: 'Midnight Star',
        breed: 'Paint Horse',
        age: 6,
        status: 'training',
        lastActivity: '4 hours ago'
      }
    ];

    return {
      ...baseData,
      horses: mockClientHorses,
      trainingSessions: [
        {
          id: 'session-001',
          horseId: 'horse-001',
          date: '2024-01-15',
          type: 'Barrel Racing',
          notes: 'Excellent progress on tight turns'
        }
      ],
      healthRecords: [
        {
          id: 'health-001',
          horseId: 'horse-001',
          date: '2024-01-10',
          type: 'Routine Checkup',
          status: 'Excellent'
        }
      ],
      facilities: [
        {
          id: 'facility-001',
          name: 'Main Arena',
          type: 'Training Arena'
        }
      ]
    };
  }

  private async getTrainerData(user: User, baseData: UserAccessibleData): Promise<UserAccessibleData> {
    // Trainers can see horses they train + facility info
    // In production, this would query: SELECT * FROM horses WHERE trainer_id = user.id OR assigned_trainer = user.id
    const mockTrainerHorses = [
      {
        id: 'horse-001',
        name: 'Thunder Bay',
        breed: 'Quarter Horse',
        age: 8,
        status: 'active',
        lastActivity: '2 hours ago'
      },
      {
        id: 'horse-003',
        name: 'Storm Runner',
        breed: 'Thoroughbred',
        age: 5,
        status: 'training',
        lastActivity: '1 hour ago'
      }
    ];

    return {
      ...baseData,
      horses: mockTrainerHorses,
      trainingSessions: [
        {
          id: 'session-001',
          horseId: 'horse-001',
          date: '2024-01-15',
          type: 'Barrel Racing',
          notes: 'Excellent progress on tight turns'
        },
        {
          id: 'session-002',
          horseId: 'horse-003',
          date: '2024-01-15',
          type: 'Dressage',
          notes: 'Working on collection'
        }
      ],
      facilities: [
        {
          id: 'facility-001',
          name: 'Main Arena',
          type: 'Training Arena'
        },
        {
          id: 'facility-002',
          name: 'Outdoor Ring',
          type: 'Practice Ring'
        }
      ]
    };
  }

  private async getManagerData(user: User, baseData: UserAccessibleData): Promise<UserAccessibleData> {
    // Managers can see all facility horses and operations
    const mockAllFacilityHorses = [
      {
        id: 'horse-001',
        name: 'Thunder Bay',
        breed: 'Quarter Horse',
        age: 8,
        status: 'active',
        lastActivity: '2 hours ago'
      },
      {
        id: 'horse-002',
        name: 'Midnight Star',
        breed: 'Paint Horse',
        age: 6,
        status: 'training',
        lastActivity: '4 hours ago'
      },
      {
        id: 'horse-003',
        name: 'Storm Runner',
        breed: 'Thoroughbred',
        age: 5,
        status: 'training',
        lastActivity: '1 hour ago'
      }
    ];

    return {
      ...baseData,
      horses: mockAllFacilityHorses,
      trainingSessions: [
        // All training sessions for the facility
      ],
      healthRecords: [
        // All health records for the facility
      ],
      facilities: [
        // All facility information
      ]
    };
  }

  private async getAdminData(user: User, baseData: UserAccessibleData): Promise<UserAccessibleData> {
    // Admins can see everything in their tenant
    return this.getManagerData(user, baseData); // For now, same as manager
  }

  /**
   * LAYER 2: Response Validation - Catch any data leaks
   */
  private validateAndCleanResponse(response: string, userData: UserAccessibleData): {
    cleanResponse: string;
    securityLevel: 'safe' | 'filtered' | 'blocked';
  } {
    let cleanResponse = response;
    let securityLevel: 'safe' | 'filtered' | 'blocked' = 'safe';

    // Get list of horses user should NOT see
    const allPossibleHorses = [
      'Thunder Bay', 'Midnight Star', 'Storm Runner', 'Lightning Bolt', 
      'Silver Dream', 'Golden Arrow', 'Black Beauty', 'Fire Storm'
    ];
    
    const allowedHorseNames = userData.horses.map(h => h.name);
    const forbiddenHorses = allPossibleHorses.filter(name => !allowedHorseNames.includes(name));

    // Permission-based content filtering
    const hasPermission = (permission: string) => userData.permissions.includes(permission);
    
    // Block financial data if user doesn't have financial permissions
    if (!hasPermission('view_financials') && !hasPermission('full_access')) {
      const financialPatterns = [
        /\$[\d,]+/g, // Dollar amounts
        /cost|price|fee|payment|invoice|billing/gi,
        /revenue|profit|expense/gi
      ];
      
      financialPatterns.forEach(pattern => {
        if (pattern.test(cleanResponse)) {
          cleanResponse = cleanResponse.replace(pattern, '[FINANCIAL DATA REDACTED]');
          securityLevel = 'filtered';
        }
      });
    }

    // Block medical details if user doesn't have health permissions
    if (!hasPermission('view_health_details') && !hasPermission('full_access')) {
      const medicalPatterns = [
        /medication|drug|prescription|dosage/gi,
        /diagnosis|treatment|therapy|surgery/gi,
        /veterinarian|vet|medical/gi
      ];
      
      medicalPatterns.forEach(pattern => {
        if (pattern.test(cleanResponse)) {
          cleanResponse = cleanResponse.replace(pattern, '[MEDICAL DATA REDACTED]');
          securityLevel = 'filtered';
        }
      });
    }

    // Check for forbidden horse names in response
    let foundViolations = false;
    forbiddenHorses.forEach(horseName => {
      const regex = new RegExp(`\\b${horseName}\\b`, 'gi');
      if (regex.test(cleanResponse)) {
        cleanResponse = cleanResponse.replace(regex, '[HORSE NAME REDACTED]');
        foundViolations = true;
        securityLevel = 'filtered';
      }
    });

    // Check for other sensitive patterns
    const sensitivePatterns = [
      /\$[\d,]+/g, // Dollar amounts
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN patterns
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email addresses
    ];

    sensitivePatterns.forEach(pattern => {
      if (pattern.test(cleanResponse)) {
        cleanResponse = cleanResponse.replace(pattern, '[SENSITIVE DATA REDACTED]');
        foundViolations = true;
        securityLevel = 'filtered';
      }
    });

    // If too many violations, block entirely
    const violationCount = (cleanResponse.match(/\[.*?REDACTED\]/g) || []).length;
    if (violationCount > 3) {
      return {
        cleanResponse: "I can only provide information about your horses and data you have access to. Please ask a more specific question about your horses.",
        securityLevel: 'blocked'
      };
    }

    return { cleanResponse, securityLevel };
  }

  /**
   * LAYER 3: Audit Logging - Track everything for compliance
   */
  private logAIInteraction(
    user: User,
    question: string,
    response: string,
    securityLevel: string
  ): string {
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
          const logEntry = {
        id: auditId,
        userId: user.id || 'unknown',
        tenantId: user.barn || 'unknown', // Using barn as tenant identifier
        question,
        response,
        securityLevel,
        timestamp: new Date().toISOString(),
        ipAddress: 'unknown' // Would get from request in real app
      };

    this.auditLog.push(logEntry);
    
    // In production, this would go to a secure audit database
    console.log('🔒 AI Security Audit:', {
      auditId,
      userId: user.id,
      securityLevel,
      timestamp: logEntry.timestamp
    });

    return auditId;
  }

  /**
   * MAIN METHOD: Secure AI Chat
   */
  async secureChat(request: SecureAIRequest): Promise<SecureAIResponse> {
    try {
      // Step 1: Get filtered data (user can only see what they're allowed to)
      const userData = await this.getFilteredUserData(request.user);

      // Step 2: Build minimal, non-security-critical prompt
      const systemPrompt = `You are a helpful horse training assistant for ${request.user.role}s. 
      Answer questions based only on the provided data. 
      Be helpful, professional, and focus on horse care and training advice.
      If you don't have specific information, say so rather than guessing.`;

      // Step 3: Prepare context with filtered data
      const context = `
Available Horses: ${userData.horses.map(h => `${h.name} (${h.breed}, ${h.age} years, ${h.status})`).join(', ')}
Recent Training: ${userData.trainingSessions.map(s => `${s.type} session for horse ${s.horseId}`).join(', ')}
User Role: ${request.user.role}
User Permissions: ${userData.permissions.join(', ')}
      `;

      // Step 4: Call AI with filtered data
      const aiResponse = await aiService.analyze({
        type: 'behavioral',
        data: { question: request.question, context },
        horseId: 'chat-session',
        context: `${systemPrompt}\n\nContext: ${context}\n\nUser Question: ${request.question}`,
        priority: 'medium'
      });

      // Step 5: Validate and clean response
      const { cleanResponse, securityLevel } = this.validateAndCleanResponse(
        aiResponse.content,
        userData
      );

      // Step 6: Log for audit trail
      const auditId = this.logAIInteraction(
        request.user,
        request.question,
        cleanResponse,
        securityLevel
      );

      return {
        answer: cleanResponse,
        confidence: aiResponse.confidence,
        sources: ['Filtered user data'],
        securityLevel,
        auditId
      };

    } catch (error) {
      console.error('Secure AI Chat Error:', error);
      
      // Log the error attempt
      const auditId = this.logAIInteraction(
        request.user,
        request.question,
        'ERROR: AI service unavailable',
        'blocked'
      );

      return {
        answer: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        confidence: 0,
        sources: [],
        securityLevel: 'blocked',
        auditId
      };
    }
  }

  /**
   * Get audit logs (admin only)
   */
  getAuditLogs(user: User): Array<any> {
    if (user.role !== 'admin') {
      return [];
    }
    return this.auditLog.filter(log => log.tenantId === user.barn);
  }
}

// Export singleton instance
export const secureAIService = new SecureAIService(); 