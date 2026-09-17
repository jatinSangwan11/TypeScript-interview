export type TransformTicketStatus = "open" | "in_progress" | "resolved";

export interface RawTicketRecord {
  id: string;
  title: string;
  status: TransformTicketStatus;
  archived?: boolean;
}

export interface TicketSummary {
  id: string;
  title: string;
  status: TransformTicketStatus;
}

export class InvalidRawTicketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRawTicketError";
  }
}

/**
 * Validate externally supplied ticket records, remove archived tickets, and
 * return new summary objects whose id and title have surrounding whitespace
 * removed.
 *
 * Requirements:
 * - preserve the order of the remaining records;
 * - treat a missing archived property as false;
 * - do not mutate the input or reuse its record objects;
 * - throw InvalidRawTicketError for malformed input, blank id/title,
 *   unsupported status, or a non-boolean archived value.
 *
 * Use filter and map for the transformation after validation.
 */
export function transformActiveTickets(input: unknown): TicketSummary[] {
  if(!Array.isArray(input))throw new InvalidRawTicketError("input must be a array")

  for(const ticket of input){
    if(ticket === null || typeof ticket !== "object"){
      throw new InvalidRawTicketError("input must be valid")
    }
    if(typeof ticket.id !== "string" || ticket.id.trim().length === 0){
      throw new InvalidRawTicketError("ticket id is invalid")
    }
    if(typeof ticket.title !== "string" || ticket.title.trim().length === 0){
      throw new InvalidRawTicketError("ticket title is invalid")
    }
    if(ticket.status !== "open" &&
      ticket.status !== "in_progress" &&
      ticket.status !== "resolved"
    ){
      throw new InvalidRawTicketError("invalid status")
    }
    if (
      ticket.archived !== undefined &&
      typeof ticket.archived !== "boolean"
    ) {
      throw new InvalidRawTicketError("invalid type of archived");
    }
  }
  const validTickets: TicketSummary[] = input.filter((ticket) => {
    return ticket.archived !== true
  }).map((ticket, index) => ({
    id: ticket.id.trim(),
    title: ticket.title.trim(),
    status: ticket.status
  }))
  return validTickets
}
