// Quick Ticket Creator Component
// For testing ticket creation across different support tabs

import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../config/brandConfig';
import { useTickets } from '../../hooks/useTickets';
import { ISupportTicket } from '../../services/ticketService';
import { customerService, ICustomer } from '../../services/customerService';

interface ITicketCreatorProps {
  onTicketCreated?: (ticket: ISupportTicket) => void;
  defaultCategory?: ISupportTicket['category'];
  defaultType?: ISupportTicket['type'];
}

export const TicketCreator: React.FC<ITicketCreatorProps> = ({
  onTicketCreated,
  defaultCategory = 'general',
  defaultType
}) => {
  const { createTicket, loading } = useTickets();
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: defaultCategory,
    type: defaultType,
    priority: 'medium' as ISupportTicket['priority']
  });

  // Load customers when component opens
  useEffect(() => {
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const customerData = await customerService.getCustomers();
      setCustomers(customerData);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCustomerSearch = async (query: string) => {
    setCustomerSearch(query);
    setShowCustomerDropdown(true);
    
    if (query.length > 2) {
      try {
        const searchResults = await customerService.searchCustomers(query);
        setCustomers(searchResults);
      } catch (error) {
        console.error('Error searching customers:', error);
      }
    } else {
      loadCustomers();
    }
  };

  const selectCustomer = (customer: ICustomer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.name} (${customer.organization || customer.email})`);
    setShowCustomerDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    
    try {
      // Get routing information for this customer and ticket
      const routing = await customerService.getRoutingForTicket(
        selectedCustomer, 
        formData.priority, 
        formData.category
      );
      
      const assignedAgent = customerService.getAssignedSupportAgent(selectedCustomer);
      
      const newTicket = await createTicket({
        ...formData,
        clientId: selectedCustomer.id,
        clientName: selectedCustomer.name,
        clientEmail: selectedCustomer.email,
        assignedTo: assignedAgent,
        assignedToName: assignedAgent === 'support_staff_001' ? 'Enhanced Support Staff' : 'General Support',
        tags: [
          formData.category, 
          formData.priority,
          selectedCustomer.type,
          selectedCustomer.supportTier,
          ...(selectedCustomer.tags || [])
        ]
      });
      
      // Update customer's last contact time
      await customerService.updateLastContact(selectedCustomer.id);
      
      onTicketCreated?.(newTicket);
      setIsOpen(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: defaultCategory,
        type: defaultType,
        priority: 'medium'
      });
      setSelectedCustomer(null);
      setCustomerSearch('');
      
      const routingInfo = routing ? ` (Routed to ${routing.assignedTeam}, SLA: ${routing.responseTimeSLA})` : '';
      alert(`Ticket ${newTicket.ticketNumber} created successfully!${routingInfo}`);
    } catch (error) {
      alert('Failed to create ticket');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: brandConfig.colors.stableMahogany,
          color: brandConfig.colors.barnWhite,
          border: 'none',
          padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
          borderRadius: brandConfig.layout.borderRadius,
          cursor: 'pointer',
          fontSize: brandConfig.typography.fontSizeSm,
          fontWeight: brandConfig.typography.weightSemiBold
        }}
      >
        🎫 Create Test Ticket
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: brandConfig.colors.barnWhite,
        borderRadius: brandConfig.layout.borderRadius,
        padding: brandConfig.spacing.xl,
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: brandConfig.typography.fontSizeLg,
          fontWeight: brandConfig.typography.weightBold,
          color: brandConfig.colors.stableMahogany,
          marginBottom: brandConfig.spacing.md
        }}>
          Create Test Ticket
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: brandConfig.spacing.md }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
              Customer *
            </label>
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => handleCustomerSearch(e.target.value)}
              onFocus={() => setShowCustomerDropdown(true)}
              placeholder="Search customers by name, email, or organization..."
              required
              style={{
                width: '100%',
                padding: brandConfig.spacing.sm,
                border: `1px solid ${selectedCustomer ? brandConfig.colors.successGreen : brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase
              }}
            />
            
            {showCustomerDropdown && customers.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: brandConfig.colors.barnWhite,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '2px'
              }}>
                {loadingCustomers ? (
                  <div style={{ padding: brandConfig.spacing.sm, textAlign: 'center', color: brandConfig.colors.neutralGray }}>
                    Loading customers...
                  </div>
                ) : (
                  customers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      style={{
                        padding: brandConfig.spacing.sm,
                        cursor: 'pointer',
                        borderBottom: `1px solid ${brandConfig.colors.arenaSand}`
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = brandConfig.colors.arenaSand}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: brandConfig.typography.weightSemiBold }}>
                        {customer.name}
                      </div>
                      <div style={{ fontSize: brandConfig.typography.fontSizeSm, color: brandConfig.colors.neutralGray }}>
                        {customer.organization && `${customer.organization} • `}
                        {customer.email} • {customer.type.replace('_', ' ')} • {customer.supportTier}
                      </div>
                      <div style={{ fontSize: brandConfig.typography.fontSizeXs, color: brandConfig.colors.neutralGray }}>
                        {customer.metadata.horseCount ? `${customer.metadata.horseCount} horses` : ''} 
                        {customer.metadata.facilitySize ? ` • ${customer.metadata.facilitySize} facility` : ''}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              style={{
                width: '100%',
                padding: brandConfig.spacing.sm,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              style={{
                width: '100%',
                padding: brandConfig.spacing.sm,
                border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                borderRadius: brandConfig.layout.borderRadius,
                fontSize: brandConfig.typography.fontSizeBase,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: brandConfig.spacing.md }}>
            <div>
              <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ISupportTicket['category'] }))}
                style={{
                  width: '100%',
                  padding: brandConfig.spacing.sm,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase
                }}
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug_report">Bug Report</option>
                <option value="ai_support">AI Support</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as ISupportTicket['priority'] }))}
                style={{
                  width: '100%',
                  padding: brandConfig.spacing.sm,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {formData.category === 'ai_support' && (
            <div>
              <label style={{ display: 'block', marginBottom: brandConfig.spacing.xs, fontWeight: brandConfig.typography.weightSemiBold }}>
                AI Support Type
              </label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ISupportTicket['type'] || undefined }))}
                style={{
                  width: '100%',
                  padding: brandConfig.spacing.sm,
                  border: `1px solid ${brandConfig.colors.sterlingSilver}`,
                  borderRadius: brandConfig.layout.borderRadius,
                  fontSize: brandConfig.typography.fontSizeBase
                }}
              >
                <option value="">Select type...</option>
                <option value="false_alarm">False Alarm</option>
                <option value="training_request">Training Request</option>
                <option value="interpretation_help">Interpretation Help</option>
                <option value="camera_setup">Camera Setup</option>
                <option value="ai_config">AI Configuration</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: brandConfig.spacing.sm, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                backgroundColor: brandConfig.colors.sterlingSilver,
                color: brandConfig.colors.midnightBlack,
                border: 'none',
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                borderRadius: brandConfig.layout.borderRadius,
                cursor: 'pointer',
                fontSize: brandConfig.typography.fontSizeSm
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: brandConfig.colors.stableMahogany,
                color: brandConfig.colors.barnWhite,
                border: 'none',
                padding: `${brandConfig.spacing.sm} ${brandConfig.spacing.md}`,
                borderRadius: brandConfig.layout.borderRadius,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: brandConfig.typography.fontSizeSm,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 