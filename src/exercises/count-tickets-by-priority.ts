export type TicketPriority = "low" | "medium" | "high";

export interface PrioritizedTicket {
  id: string;
  priority?: TicketPriority;
}

export type PriorityCounts = Record<
  TicketPriority | "unassigned",
  number
>;

export class InvalidTicketInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTicketInputError";
  }
}

/**
 * Count tickets by priority. Tickets without a priority are "unassigned".
 *
 * Because input may come from an API request, validate it at runtime and throw
 * InvalidTicketInputError when:
 * - input is not an array;
 * - an item is not an object with a string id; or
 * - priority is present but is not low, medium, or high.
 */
export function countTicketsByPriority(input: unknown): PriorityCounts {
  if (!Array.isArray(input)) {
    throw new InvalidTicketInputError("Tickets must be an array");
  }

  for (const [index, element] of input.entries()) {
    if (typeof element !== "object" || element === null) {
      throw new InvalidTicketInputError(
        `Ticket at index ${index} must be an object`,
      );
    }

    if (typeof element.id !== "string") {
      throw new InvalidTicketInputError(
        `Ticket at index ${index} must have a string id`,
      );
    }

    if (
      element.priority !== undefined &&
      element.priority !== "low" &&
      element.priority !== "medium" &&
      element.priority !== "high"
    ) {
      throw new InvalidTicketInputError(
        `Ticket at index ${index} has an unsupported priority`,
      );
    }
  }

  const ticketCountCollection: PriorityCounts = {
    high: 0,
    low: 0,
    medium: 0,
    unassigned: 0,
  };

  for (const ticket of input) {
    const priority: TicketPriority| "unassigned" = ticket.priority ?? "unassigned";
    ticketCountCollection[priority] += 1;
  }

  return ticketCountCollection;
}
