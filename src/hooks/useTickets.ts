// Custom hook for ticket management operations
// Provides easy access to ticket service for all support components

import { useState, useEffect, useCallback } from 'react';
import { ticketService, ISupportTicket, ITicketStats, ITicketFilters } from '../services/ticketService';

export const useTickets = (initialFilters?: ITicketFilters) => {
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [stats, setStats] = useState<ITicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ITicketFilters | undefined>(initialFilters);

  // Load tickets and stats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ticketsData, statsData] = await Promise.all([
        ticketService.getTickets(filters),
        ticketService.getTicketStats()
      ]);
      
      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      console.error('Error loading ticket data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data when component mounts or filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create a new ticket
  const createTicket = useCallback(async (ticketData: Partial<ISupportTicket>) => {
    try {
      const newTicket = await ticketService.createTicket(ticketData);
      await loadData(); // Refresh data
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      throw err;
    }
  }, [loadData]);

  // Update an existing ticket
  const updateTicket = useCallback(async (id: string, updates: Partial<ISupportTicket>) => {
    try {
      const updatedTicket = await ticketService.updateTicket(id, updates);
      if (updatedTicket) {
        setTickets(prev => prev.map(t => t.id === id ? updatedTicket : t));
        await loadData(); // Refresh stats
      }
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
      throw err;
    }
  }, [loadData]);

  // Add a comment to a ticket
  const addComment = useCallback(async (ticketId: string, author: string, authorRole: string, message: string, isInternal: boolean = false) => {
    try {
      const comment = await ticketService.addComment(ticketId, {
        author,
        authorRole,
        message,
        isInternal
      });
      await loadData(); // Refresh data
      return comment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      throw err;
    }
  }, [loadData]);

  // Assign ticket to support staff
  const assignTicket = useCallback(async (ticketId: string, assignedTo: string, assignedToName: string) => {
    try {
      const updatedTicket = await ticketService.assignTicket(ticketId, assignedTo, assignedToName);
      if (updatedTicket) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        await loadData(); // Refresh stats
      }
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign ticket');
      throw err;
    }
  }, [loadData]);

  // Close ticket with optional satisfaction rating
  const closeTicket = useCallback(async (ticketId: string, satisfactionRating?: number) => {
    try {
      const updatedTicket = await ticketService.closeTicket(ticketId, satisfactionRating);
      if (updatedTicket) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
        await loadData(); // Refresh stats
      }
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close ticket');
      throw err;
    }
  }, [loadData]);

  // Get tickets for a specific client
  const getClientTickets = useCallback(async (clientId: string) => {
    try {
      return await ticketService.getClientTickets(clientId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get client tickets');
      throw err;
    }
  }, []);

  // Search tickets
  const searchTickets = useCallback(async (searchTerm: string) => {
    try {
      return await ticketService.searchTickets(searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tickets');
      throw err;
    }
  }, []);

  // Update filters and reload data
  const updateFilters = useCallback((newFilters: ITicketFilters) => {
    setFilters(newFilters);
  }, []);

  // Refresh data manually
  const refresh = useCallback(() => {
    return loadData();
  }, [loadData]);

  return {
    // Data
    tickets,
    stats,
    loading,
    error,
    
    // Actions
    createTicket,
    updateTicket,
    addComment,
    assignTicket,
    closeTicket,
    getClientTickets,
    searchTickets,
    updateFilters,
    refresh,
    
    // Quick stats helpers
    openTickets: tickets.filter(t => t.status === 'open'),
    inProgressTickets: tickets.filter(t => t.status === 'in_progress'),
    resolvedTickets: tickets.filter(t => t.status === 'resolved'),
    
    // Quick category helpers
    aiSupportTickets: tickets.filter(t => t.category === 'ai_support'),
    technicalTickets: tickets.filter(t => t.category === 'technical'),
    billingTickets: tickets.filter(t => t.category === 'billing'),
    featureRequestTickets: tickets.filter(t => t.category === 'feature_request'),
    
    // Quick type helpers (for AI support tickets)
    falseAlarmTickets: tickets.filter(t => t.type === 'false_alarm'),
    trainingRequestTickets: tickets.filter(t => t.type === 'training_request'),
    cameraSetupTickets: tickets.filter(t => t.type === 'camera_setup'),
    interpretationHelpTickets: tickets.filter(t => t.type === 'interpretation_help'),
  };
};

// Specialized hook for AI support tickets only
export const useAISupportTickets = () => {
  return useTickets({ 
    category: ['ai_support'],
    assignedTo: 'support_staff_001' // Enhanced Support Staff
  });
};

// Specialized hook for client tickets
export const useClientTickets = (clientId: string) => {
  return useTickets({ clientId });
};

// Specialized hook for assigned tickets
export const useAssignedTickets = (assignedTo: string) => {
  return useTickets({ assignedTo });
}; 