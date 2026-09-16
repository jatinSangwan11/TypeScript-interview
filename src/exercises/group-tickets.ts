export type TicketStatus = "open" | "in_progress" | "resolved";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
}

export type TicketsByStatus = Record<TicketStatus, Ticket[]>;

/**
 * Group tickets by status without changing the input array.
 *
 * The returned object must always contain all three status keys, even when a
 * status has no tickets.
 */
export function groupTicketsByStatus(
  tickets: readonly Ticket[],
): TicketsByStatus {
  let ticketCollection: TicketsByStatus= {
    "open": [],
    "in_progress": [],
    "resolved": []
  }
  for(const ticket of tickets){
    ticketCollection[ticket.status].push(ticket)
  }
  return ticketCollection
}
