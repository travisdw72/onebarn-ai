// Customer/Client Service - Manages different types of users for support ticket routing
// Supports barn owners, trainers, individual clients, veterinarians, etc.

export interface ICustomer {
  id: string;
  type: 'barn_owner' | 'individual_client' | 'trainer' | 'veterinarian' | 'facility_manager' | 'corporate_client';
  name: string;
  email: string;
  phone?: string;
  organization?: string; // Barn name, training facility, vet clinic, etc.
  address?: IAddress;
  subscription: ISubscription;
  supportTier: 'basic' | 'premium' | 'enterprise';
  assignedSupportAgent?: string;
  tags: string[];
  createdAt: string;
  lastContactAt?: string;
  isActive: boolean;
  metadata: {
    horseCount?: number;
    facilitySize?: string;
    specializations?: string[];
    preferredContactMethod?: 'email' | 'phone' | 'sms';
    timezone?: string;
  };
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ISubscription {
  plan: 'basic' | 'professional' | 'enterprise' | 'custom';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  startDate: string;
  renewalDate: string;
  features: string[];
}

export interface ISupportRouting {
  customerType: ICustomer['type'];
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  assignedTeam: string;
  escalationPath: string[];
  responseTimeSLA: string; // e.g., "2 hours", "24 hours"
}

class CustomerService {
  private readonly STORAGE_KEY = 'onebarn_customers';
  private readonly ROUTING_KEY = 'onebarn_support_routing';

  // Initialize with sample customer data
  private initializeSampleData(): void {
    const existingCustomers = localStorage.getItem(this.STORAGE_KEY);
    const existingRouting = localStorage.getItem(this.ROUTING_KEY);
    
    if (!existingCustomers) {
      const sampleCustomers = this.generateSampleCustomers();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleCustomers));
    }
    
    if (!existingRouting) {
      const routingRules = this.generateRoutingRules();
      localStorage.setItem(this.ROUTING_KEY, JSON.stringify(routingRules));
    }
  }

  private generateSampleCustomers(): ICustomer[] {
    const customers: ICustomer[] = [
      // Barn Owners
      {
        id: 'barn_001',
        type: 'barn_owner',
        name: 'Sarah Johnson',
        email: 'sarah@willowcreekstables.com',
        phone: '(555) 123-4567',
        organization: 'Willow Creek Stables',
        address: {
          street: '1234 Country Road',
          city: 'Lexington',
          state: 'KY',
          zipCode: '40511',
          country: 'USA'
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: '2023-06-15',
          renewalDate: '2024-06-15',
          features: ['ai_monitoring', 'health_alerts', 'training_insights', 'multi_camera']
        },
        supportTier: 'premium',
        assignedSupportAgent: 'support_staff_001',
        tags: ['breeding_facility', 'show_horses', 'premium_client'],
        createdAt: '2023-06-15T10:00:00Z',
        lastContactAt: '2024-01-10T14:30:00Z',
        isActive: true,
        metadata: {
          horseCount: 25,
          facilitySize: 'large',
          specializations: ['breeding', 'show_preparation', 'retirement_care'],
          preferredContactMethod: 'email',
          timezone: 'America/New_York'
        }
      },
      {
        id: 'barn_002',
        type: 'barn_owner',
        name: 'Mike Chen',
        email: 'mike@goldendaleranch.com',
        phone: '(555) 234-5678',
        organization: 'Golden Dale Ranch',
        address: {
          street: '5678 Ranch Drive',
          city: 'Weatherford',
          state: 'TX',
          zipCode: '76086',
          country: 'USA'
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: '2023-03-01',
          renewalDate: '2024-03-01',
          features: ['ai_monitoring', 'health_alerts', 'training_insights', 'multi_camera', 'custom_alerts', 'api_access']
        },
        supportTier: 'enterprise',
        assignedSupportAgent: 'support_staff_001',
        tags: ['training_facility', 'cutting_horses', 'enterprise_client'],
        createdAt: '2023-03-01T09:00:00Z',
        lastContactAt: '2024-01-12T16:45:00Z',
        isActive: true,
        metadata: {
          horseCount: 150,
          facilitySize: 'extra_large',
          specializations: ['cutting', 'reining', 'ranch_work'],
          preferredContactMethod: 'phone',
          timezone: 'America/Chicago'
        }
      },
      
      // Individual Clients
      {
        id: 'client_001',
        type: 'individual_client',
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@email.com',
        phone: '(555) 345-6789',
        address: {
          street: '789 Maple Street',
          city: 'Wellington',
          state: 'FL',
          zipCode: '33414',
          country: 'USA'
        },
        subscription: {
          plan: 'basic',
          status: 'active',
          startDate: '2023-09-01',
          renewalDate: '2024-09-01',
          features: ['ai_monitoring', 'health_alerts']
        },
        supportTier: 'basic',
        tags: ['single_horse', 'dressage', 'weekend_rider'],
        createdAt: '2023-09-01T12:00:00Z',
        lastContactAt: '2024-01-08T10:15:00Z',
        isActive: true,
        metadata: {
          horseCount: 1,
          facilitySize: 'small',
          specializations: ['dressage'],
          preferredContactMethod: 'email',
          timezone: 'America/New_York'
        }
      },
      {
        id: 'client_002',
        type: 'individual_client',
        name: 'Jennifer Martinez',
        email: 'jennifer.martinez@email.com',
        phone: '(555) 456-7890',
        address: {
          street: '456 Oak Avenue',
          city: 'Scottsdale',
          state: 'AZ',
          zipCode: '85251',
          country: 'USA'
        },
        subscription: {
          plan: 'professional',
          status: 'trial',
          startDate: '2024-01-01',
          renewalDate: '2024-02-01',
          features: ['ai_monitoring', 'health_alerts', 'training_insights']
        },
        supportTier: 'basic',
        tags: ['new_horse_owner', 'trail_riding', 'learning'],
        createdAt: '2024-01-01T08:00:00Z',
        lastContactAt: '2024-01-14T13:20:00Z',
        isActive: true,
        metadata: {
          horseCount: 2,
          facilitySize: 'small',
          specializations: ['trail_riding', 'basic_care'],
          preferredContactMethod: 'email',
          timezone: 'America/Phoenix'
        }
      },

      // Trainers
      {
        id: 'trainer_001',
        type: 'trainer',
        name: 'David Thompson',
        email: 'david@eliteequinetraining.com',
        phone: '(555) 567-8901',
        organization: 'Elite Equine Training',
        address: {
          street: '321 Training Way',
          city: 'Aiken',
          state: 'SC',
          zipCode: '29801',
          country: 'USA'
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          startDate: '2023-07-15',
          renewalDate: '2024-07-15',
          features: ['ai_monitoring', 'health_alerts', 'training_insights', 'multi_camera', 'performance_analytics']
        },
        supportTier: 'premium',
        assignedSupportAgent: 'support_staff_001',
        tags: ['professional_trainer', 'eventing', 'multiple_clients'],
        createdAt: '2023-07-15T11:00:00Z',
        lastContactAt: '2024-01-11T15:30:00Z',
        isActive: true,
        metadata: {
          horseCount: 45,
          facilitySize: 'large',
          specializations: ['eventing', 'dressage', 'show_jumping'],
          preferredContactMethod: 'phone',
          timezone: 'America/New_York'
        }
      },

      // Veterinarians
      {
        id: 'vet_001',
        type: 'veterinarian',
        name: 'Dr. Robert Wilson',
        email: 'robert@equinevet.com',
        phone: '(555) 678-9012',
        organization: 'Equine Veterinary Services',
        address: {
          street: '987 Vet Drive',
          city: 'Ocala',
          state: 'FL',
          zipCode: '34471',
          country: 'USA'
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          startDate: '2023-04-01',
          renewalDate: '2024-04-01',
          features: ['ai_monitoring', 'health_alerts', 'diagnostic_tools', 'multi_facility_access', 'api_access']
        },
        supportTier: 'enterprise',
        assignedSupportAgent: 'support_staff_001',
        tags: ['veterinarian', 'diagnostic_partner', 'multiple_facilities'],
        createdAt: '2023-04-01T07:00:00Z',
        lastContactAt: '2024-01-13T11:45:00Z',
        isActive: true,
        metadata: {
          horseCount: 200, // Serves multiple facilities
          facilitySize: 'multi_facility',
          specializations: ['emergency_care', 'diagnostics', 'surgery', 'reproduction'],
          preferredContactMethod: 'phone',
          timezone: 'America/New_York'
        }
      }
    ];

    return customers;
  }

  private generateRoutingRules(): ISupportRouting[] {
    return [
      // Barn Owner Rules
      {
        customerType: 'barn_owner',
        priority: 'critical',
        category: 'technical',
        assignedTeam: 'premium_support',
        escalationPath: ['support_manager', 'technical_director'],
        responseTimeSLA: '1 hour'
      },
      {
        customerType: 'barn_owner',
        priority: 'high',
        category: 'ai_support',
        assignedTeam: 'ai_support_specialists',
        escalationPath: ['ai_support_lead', 'technical_director'],
        responseTimeSLA: '2 hours'
      },
      
      // Individual Client Rules
      {
        customerType: 'individual_client',
        priority: 'high',
        category: 'technical',
        assignedTeam: 'general_support',
        escalationPath: ['support_manager'],
        responseTimeSLA: '4 hours'
      },
      {
        customerType: 'individual_client',
        priority: 'medium',
        category: 'ai_support',
        assignedTeam: 'ai_support_specialists',
        escalationPath: ['ai_support_lead'],
        responseTimeSLA: '8 hours'
      },
      
      // Trainer Rules
      {
        customerType: 'trainer',
        priority: 'high',
        category: 'ai_support',
        assignedTeam: 'ai_support_specialists',
        escalationPath: ['ai_support_lead', 'technical_director'],
        responseTimeSLA: '2 hours'
      },
      
      // Veterinarian Rules
      {
        customerType: 'veterinarian',
        priority: 'critical',
        category: 'technical',
        assignedTeam: 'premium_support',
        escalationPath: ['support_manager', 'technical_director', 'cto'],
        responseTimeSLA: '30 minutes'
      }
    ];
  }

  private loadCustomers(): ICustomer[] {
    this.initializeSampleData();
    const customersData = localStorage.getItem(this.STORAGE_KEY);
    return customersData ? JSON.parse(customersData) : [];
  }

  private loadRoutingRules(): ISupportRouting[] {
    this.initializeSampleData();
    const routingData = localStorage.getItem(this.ROUTING_KEY);
    return routingData ? JSON.parse(routingData) : [];
  }

  // Get all customers
  public async getCustomers(): Promise<ICustomer[]> {
    const customers = this.loadCustomers();
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return customers.filter(c => c.isActive).sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get customer by ID
  public async getCustomer(id: string): Promise<ICustomer | null> {
    const customers = this.loadCustomers();
    const customer = customers.find(c => c.id === id);
    await new Promise(resolve => setTimeout(resolve, 50));
    return customer || null;
  }

  // Search customers
  public async searchCustomers(query: string): Promise<ICustomer[]> {
    const customers = this.loadCustomers();
    const searchLower = query.toLowerCase();
    
    const filtered = customers.filter(customer => 
      customer.isActive && (
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.organization?.toLowerCase().includes(searchLower) ||
        customer.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    );
    
    await new Promise(resolve => setTimeout(resolve, 150));
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get customers by type
  public async getCustomersByType(type: ICustomer['type']): Promise<ICustomer[]> {
    const customers = this.loadCustomers();
    const filtered = customers.filter(c => c.isActive && c.type === type);
    await new Promise(resolve => setTimeout(resolve, 100));
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Determine support routing for a ticket
  public async getRoutingForTicket(customer: ICustomer, priority: string, category: string): Promise<ISupportRouting | null> {
    const routingRules = this.loadRoutingRules();
    
    // Find the most specific matching rule
    const matchingRule = routingRules.find(rule => 
      rule.customerType === customer.type &&
      rule.priority === priority &&
      rule.category === category
    ) || routingRules.find(rule => 
      rule.customerType === customer.type &&
      rule.category === category
    ) || routingRules.find(rule => 
      rule.customerType === customer.type
    );
    
    await new Promise(resolve => setTimeout(resolve, 50));
    return matchingRule || null;
  }

  // Get assigned support agent for customer
  public getAssignedSupportAgent(customer: ICustomer): string {
    // Premium and enterprise customers have dedicated agents
    if (customer.supportTier === 'premium' || customer.supportTier === 'enterprise') {
      return customer.assignedSupportAgent || 'support_staff_001';
    }
    
    // Basic customers get routed to general pool
    return 'general_support_pool';
  }

  // Update customer's last contact time
  public async updateLastContact(customerId: string): Promise<void> {
    const customers = this.loadCustomers();
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex !== -1) {
      customers[customerIndex].lastContactAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// Export singleton instance
export const customerService = new CustomerService(); 