import { describe, expect, it } from "vitest";

import {
  groupTicketsByStatus,
  type Ticket,
} from "../src/exercises/group-tickets.js";

describe("groupTicketsByStatus", () => {
  it("groups tickets under their status", () => {
    const tickets: Ticket[] = [
      { id: "T-1", title: "Login fails", status: "open" },
      { id: "T-2", title: "Retry webhook", status: "in_progress" },
      { id: "T-3", title: "Update docs", status: "resolved" },
      { id: "T-4", title: "Cache is stale", status: "open" },
    ];

    expect(groupTicketsByStatus(tickets)).toEqual({
      open: [tickets[0], tickets[3]],
      in_progress: [tickets[1]],
      resolved: [tickets[2]],
    });
  });

  it("includes empty arrays for statuses with no tickets", () => {
    expect(groupTicketsByStatus([])).toEqual({
      open: [],
      in_progress: [],
      resolved: [],
    });
  });

  it("does not mutate the input array", () => {
    const tickets: Ticket[] = [
      { id: "T-1", title: "Login fails", status: "open" },
      { id: "T-2", title: "Update docs", status: "resolved" },
    ];
    const snapshot = structuredClone(tickets);

    groupTicketsByStatus(tickets);

    expect(tickets).toEqual(snapshot);
  });
});
