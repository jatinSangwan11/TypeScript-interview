import { describe, expect, it } from "vitest";

import {
  InvalidTicketRemovalError,
  removeTicket,
  type EditableTicket,
} from "../src/exercises/remove-ticket.js";

function makeTickets(): EditableTicket[] {
  return [
    { id: "T-1", title: "First" },
    { id: "T-2", title: "Second" },
    { id: "T-3", title: "Third" },
  ];
}

describe.skip("removeTicket", () => {
  it("removes immutably with slice", () => {
    const tickets = makeTickets();
    const snapshot = structuredClone(tickets);

    const result = removeTicket(tickets, 1, "immutable");

    expect(result).toEqual({
      tickets: [tickets[0], tickets[2]],
      removed: tickets[1],
    });
    expect(tickets).toEqual(snapshot);
    expect(result.tickets).not.toBe(tickets);
  });

  it("removes mutably with splice", () => {
    const tickets = makeTickets();
    const removedTicket = tickets[1];

    const result = removeTicket(tickets, 1, "mutable");

    expect(result).toEqual({
      tickets: [
        { id: "T-1", title: "First" },
        { id: "T-3", title: "Third" },
      ],
      removed: removedTicket,
    });
    expect(result.tickets).toBe(tickets);
  });

  it("supports removing the first and last elements", () => {
    expect(removeTicket(makeTickets(), 0, "immutable").tickets).toEqual([
      { id: "T-2", title: "Second" },
      { id: "T-3", title: "Third" },
    ]);

    expect(removeTicket(makeTickets(), 2, "immutable").tickets).toEqual([
      { id: "T-1", title: "First" },
      { id: "T-2", title: "Second" },
    ]);
  });

  it("rejects an invalid index", () => {
    expect(() => removeTicket(makeTickets(), -1, "immutable")).toThrow(
      InvalidTicketRemovalError,
    );
    expect(() => removeTicket(makeTickets(), 3, "immutable")).toThrow(
      InvalidTicketRemovalError,
    );
    expect(() => removeTicket(makeTickets(), 1.5, "mutable")).toThrow(
      InvalidTicketRemovalError,
    );
  });

  it("rejects an unsupported mode", () => {
    expect(() => removeTicket(makeTickets(), 1, "safe")).toThrow(
      InvalidTicketRemovalError,
    );
  });

  it("rejects malformed ticket input", () => {
    expect(() => removeTicket([{ id: "", title: "Invalid" }], 0, "mutable")).toThrow(
      InvalidTicketRemovalError,
    );
  });
});
