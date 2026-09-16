import { describe, expect, it } from "vitest";

import {
  countTicketsByPriority,
  InvalidTicketInputError,
} from "../src/exercises/count-tickets-by-priority.js";

describe("countTicketsByPriority", () => {
  it("counts every priority and treats a missing priority as unassigned", () => {
    const tickets = [
      { id: "T-1", priority: "high" },
      { id: "T-2", priority: "low" },
      { id: "T-3", priority: "high" },
      { id: "T-4" },
    ];

    expect(countTicketsByPriority(tickets)).toEqual({
      low: 1,
      medium: 0,
      high: 2,
      unassigned: 1,
    });
  });

  it("returns zero counts for an empty array", () => {
    expect(countTicketsByPriority([])).toEqual({
      low: 0,
      medium: 0,
      high: 0,
      unassigned: 0,
    });
  });

  it("rejects a non-array input", () => {
    expect(() => countTicketsByPriority("not an array")).toThrow(
      InvalidTicketInputError,
    );
  });

  it("rejects an invalid ticket", () => {
    expect(() =>
      countTicketsByPriority([{ id: 42, priority: "urgent" }]),
    ).toThrow(InvalidTicketInputError);
  });

  it("rejects an unsupported priority", () => {
    expect(() =>
      countTicketsByPriority([{ id: "T-1", priority: "urgent" }]),
    ).toThrow(InvalidTicketInputError);
  });
});
