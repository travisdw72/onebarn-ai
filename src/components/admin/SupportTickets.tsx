import React from 'react';
import { TicketSystemSummary } from '../support/TicketSystemSummary';

interface SupportTicketsProps {
  tickets: any[];
  onTicketUpdate: (ticketId: string, status: string) => void;
}

export const SupportTickets: React.FC<SupportTicketsProps> = ({
  tickets,
  onTicketUpdate
}) => {
  return (
    <div className="support-tickets-admin">
      <div className="admin-support-header">
        <h2 className="section-title font-raleway font-bold text-xl mb-4">
          Support Ticket Management
        </h2>
        <p className="font-raleway text-gray-600 mb-6">
          Monitor and manage all support tickets across the platform
        </p>
      </div>
      
      {/* Use existing ticket system */}
      <TicketSystemSummary />
    </div>
  );
}; 