import { describe, expect, it } from "vitest";

import {
  aggregateTicketMetrics,
  InvalidMetricRecordError,
  type TicketMetricRecord,
} from "../src/exercises/aggregate-ticket-metrics.js";

describe("aggregateTicketMetrics", () => {
  it("aggregates counts, response times, and unassigned tickets", () => {
    const records: TicketMetricRecord[] = [
      { id: "T-1", status: "open", responseTimeMs: 120, assigneeId: "A-1" },
      { id: "T-2", status: "resolved", responseTimeMs: 80 },
      { id: "T-3", status: "open", responseTimeMs: 100, assigneeId: "A-1" },
      { id: "T-4", status: "in_progress", responseTimeMs: 200 },
    ];

    expect(aggregateTicketMetrics(records)).toEqual({
      total: 4,
      byStatus: {
        open: 2,
        in_progress: 1,
        resolved: 1,
      },
      totalResponseTimeMs: 500,
      averageResponseTimeMs: 125,
      unassigned: 2,
    });
  });

  it("returns zeroed metrics for empty input", () => {
    expect(aggregateTicketMetrics([])).toEqual({
      total: 0,
      byStatus: {
        open: 0,
        in_progress: 0,
        resolved: 0,
      },
      totalResponseTimeMs: 0,
      averageResponseTimeMs: 0,
      unassigned: 0,
    });
  });

  it("does not mutate the input", () => {
    const records: TicketMetricRecord[] = [
      { id: "T-1", status: "open", responseTimeMs: 120 },
    ];
    const snapshot = structuredClone(records);

    aggregateTicketMetrics(records);

    expect(records).toEqual(snapshot);
  });

  it("rejects non-array input", () => {
    expect(() => aggregateTicketMetrics("invalid")).toThrow(
      InvalidMetricRecordError,
    );
  });

  it("rejects an unsupported status", () => {
    expect(() =>
      aggregateTicketMetrics([
        { id: "T-1", status: "waiting", responseTimeMs: 100 },
      ]),
    ).toThrow(InvalidMetricRecordError);
  });

  it("rejects a negative or non-finite response time", () => {
    expect(() =>
      aggregateTicketMetrics([
        { id: "T-1", status: "open", responseTimeMs: -1 },
      ]),
    ).toThrow(InvalidMetricRecordError);

    expect(() =>
      aggregateTicketMetrics([
        { id: "T-1", status: "open", responseTimeMs: Number.POSITIVE_INFINITY },
      ]),
    ).toThrow(InvalidMetricRecordError);
  });

  it("rejects an invalid assignee ID", () => {
    expect(() =>
      aggregateTicketMetrics([
        { id: "T-1", status: "open", responseTimeMs: 100, assigneeId: "" },
      ]),
    ).toThrow(InvalidMetricRecordError);
  });
});
