export interface EditableTicket {
  id: string;
  title: string;
}

export type RemovalMode = "mutable" | "immutable";

export interface TicketRemovalResult {
  tickets: EditableTicket[];
  removed: EditableTicket;
}

export class InvalidTicketRemovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTicketRemovalError";
  }
}

/**
 * Remove one ticket at the given zero-based index.
 *
 * Requirements:
 * - in mutable mode, use splice, mutate the original array, and return that
 *   same array reference in result.tickets;
 * - in immutable mode, use slice, leave the original array unchanged, and
 *   return a new array reference in result.tickets;
 * - preserve the order of all remaining tickets;
 * - return the removed ticket separately;
 * - throw InvalidTicketRemovalError for malformed tickets, an unsupported
 *   mode, or an index that is not an integer within the array bounds.
 */
export function removeTicket(
  input: unknown,
  index: unknown,
  mode: unknown,
): TicketRemovalResult {
  return {} as TicketRemovalResult
}
