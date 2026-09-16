import { describe, expect, it } from "vitest";

import {
  deduplicateEvents,
  InvalidEventInputError,
  type TicketEvent,
} from "../src/exercises/deduplicate-events.js";

describe("deduplicateEvents", () => {
  it("keeps the first event for each ID while preserving order", () => {
    const events: TicketEvent[] = [
      { id: "E-1", type: "created" },
      { id: "E-2", type: "assigned" },
      { id: "E-1", type: "updated" },
      { id: "E-3", type: "resolved" },
      { id: "E-2", type: "updated" },
    ];

    expect(deduplicateEvents(events)).toEqual([
      { id: "E-1", type: "created" },
      { id: "E-2", type: "assigned" },
      { id: "E-3", type: "resolved" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(deduplicateEvents([])).toEqual([]);
  });

  it("does not mutate the input", () => {
    const events: TicketEvent[] = [
      { id: "E-1", type: "created" },
      { id: "E-1", type: "updated" },
    ];
    const snapshot = structuredClone(events);

    deduplicateEvents(events);

    expect(events).toEqual(snapshot);
  });

  it("rejects a non-array input", () => {
    expect(() => deduplicateEvents({ id: "E-1", type: "created" })).toThrow(
      InvalidEventInputError,
    );
  });

  it("rejects an event with an invalid ID", () => {
    expect(() => deduplicateEvents([{ id: "", type: "created" }])).toThrow(
      InvalidEventInputError,
    );
  });

  it("rejects an event with an invalid type", () => {
    expect(() => deduplicateEvents([{ id: "E-1", type: 42 }])).toThrow(
      InvalidEventInputError,
    );
  });
});
