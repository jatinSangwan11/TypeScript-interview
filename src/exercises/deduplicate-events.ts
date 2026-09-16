export interface TicketEvent {
  id: string;
  type: string;
}

export class InvalidEventInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEventInputError";
  }
}

/**
 * Remove events with duplicate IDs while preserving input order.
 * When an ID appears more than once, keep its first occurrence.
 * Do not mutate the input array.
 *
 * Validate runtime input and throw InvalidEventInputError when:
 * - input is not an array;
 * - an item is not a non-null object;
 * - id is not a non-empty string; or
 * - type is not a non-empty string.
 */
export function deduplicateEvents(input: unknown): TicketEvent[] {
  // TODO: validate the input and deduplicate the events.
  throw new Error("Not implemented");
}
