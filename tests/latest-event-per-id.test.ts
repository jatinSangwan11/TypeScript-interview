import { describe, expect, it } from "vitest";

import {
  findLatestEventPerId,
  InvalidTimestampedEventError,
  type TimestampedEvent,
} from "../src/exercises/latest-event-per-id.js";

describe("findLatestEventPerId", () => {
  it("keeps the latest event for each ID in first-seen ID order", () => {
    const events: TimestampedEvent[] = [
      { id: "T-1", type: "created", occurredAt: "2026-09-15T10:00:00Z" },
      { id: "T-2", type: "created", occurredAt: "2026-09-15T11:00:00Z" },
      { id: "T-1", type: "assigned", occurredAt: "2026-09-15T12:00:00Z" },
      { id: "T-2", type: "resolved", occurredAt: "2026-09-15T10:30:00Z" },
    ];

    expect(findLatestEventPerId(events)).toEqual([
      { id: "T-1", type: "assigned", occurredAt: "2026-09-15T12:00:00Z" },
      { id: "T-2", type: "created", occurredAt: "2026-09-15T11:00:00Z" },
    ]);
  });

  it("keeps the first event when timestamps are equal", () => {
    const events: TimestampedEvent[] = [
      { id: "T-1", type: "created", occurredAt: "2026-09-15T10:00:00Z" },
      { id: "T-1", type: "updated", occurredAt: "2026-09-15T10:00:00Z" },
    ];

    expect(findLatestEventPerId(events)).toEqual([events[0]]);
  });

  it("returns an empty array for empty input", () => {
    expect(findLatestEventPerId([])).toEqual([]);
  });

  it("does not mutate the input", () => {
    const events: TimestampedEvent[] = [
      { id: "T-1", type: "created", occurredAt: "2026-09-15T10:00:00Z" },
      { id: "T-1", type: "updated", occurredAt: "2026-09-15T11:00:00Z" },
    ];
    const snapshot = structuredClone(events);

    findLatestEventPerId(events);

    expect(events).toEqual(snapshot);
  });

  it("rejects non-array input", () => {
    expect(() => findLatestEventPerId("invalid")).toThrow(
      InvalidTimestampedEventError,
    );
  });

  it("rejects an invalid event object", () => {
    expect(() =>
      findLatestEventPerId([
        { id: "", type: "created", occurredAt: "2026-09-15T10:00:00Z" },
      ]),
    ).toThrow(InvalidTimestampedEventError);
  });

  it("rejects an invalid date", () => {
    expect(() =>
      findLatestEventPerId([
        { id: "T-1", type: "created", occurredAt: "not-a-date" },
      ]),
    ).toThrow(InvalidTimestampedEventError);
  });
});
