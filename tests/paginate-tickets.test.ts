import { describe, expect, it } from "vitest";

import {
  InvalidPaginationError,
  paginateTickets,
  type PageTicket,
} from "../src/exercises/paginate-tickets.js";

const tickets: PageTicket[] = [
  { id: "T-1", title: "First" },
  { id: "T-2", title: "Second" },
  { id: "T-3", title: "Third" },
  { id: "T-4", title: "Fourth" },
  { id: "T-5", title: "Fifth" },
];

describe("paginateTickets", () => {
  it("returns the requested page and its metadata", () => {
    expect(paginateTickets(tickets, 2, 2)).toEqual({
      items: [tickets[2], tickets[3]],
      page: 2,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: true,
    });
  });

  it("handles the final partial page", () => {
    expect(paginateTickets(tickets, 3, 2)).toEqual({
      items: [tickets[4]],
      page: 3,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });

  it("returns empty items for a page beyond the data", () => {
    expect(paginateTickets(tickets, 4, 2)).toEqual({
      items: [],
      page: 4,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
      hasPreviousPage: true,
      hasNextPage: false,
    });
  });

  it("returns zeroed metadata for empty input", () => {
    expect(paginateTickets([], 1, 10)).toEqual({
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it("does not mutate the input", () => {
    const snapshot = structuredClone(tickets);

    paginateTickets(tickets, 1, 2);

    expect(tickets).toEqual(snapshot);
  });

  it("rejects malformed ticket input", () => {
    expect(() => paginateTickets([{ id: "", title: "Invalid" }], 1, 10)).toThrow(
      InvalidPaginationError,
    );
  });

  it("rejects invalid page arguments", () => {
    expect(() => paginateTickets(tickets, 0, 2)).toThrow(InvalidPaginationError);
    expect(() => paginateTickets(tickets, 1.5, 2)).toThrow(InvalidPaginationError);
    expect(() => paginateTickets(tickets, 1, -1)).toThrow(InvalidPaginationError);
    expect(() => paginateTickets(tickets, 1, "2")).toThrow(InvalidPaginationError);
  });
});
