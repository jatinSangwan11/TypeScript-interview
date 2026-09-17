import { describe, expect, it } from "vitest";

import {
  InvalidRawTicketError,
  transformActiveTickets,
  type RawTicketRecord,
} from "../src/exercises/transform-active-tickets.js";

describe("transformActiveTickets", () => {
  it("filters archived tickets and transforms the remaining records", () => {
    const records: RawTicketRecord[] = [
      { id: " T-1 ", title: " Login fails ", status: "open" },
      {
        id: "T-2",
        title: "Old incident",
        status: "resolved",
        archived: true,
      },
      {
        id: " T-3",
        title: "Retry webhook ",
        status: "in_progress",
        archived: false,
      },
    ];

    expect(transformActiveTickets(records)).toEqual([
      { id: "T-1", title: "Login fails", status: "open" },
      { id: "T-3", title: "Retry webhook", status: "in_progress" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(transformActiveTickets([])).toEqual([]);
  });

  it("does not mutate input or reuse its record objects", () => {
    const records: RawTicketRecord[] = [
      { id: " T-1 ", title: " Login fails ", status: "open" },
    ];
    const snapshot = structuredClone(records);

    const result = transformActiveTickets(records);

    expect(records).toEqual(snapshot);
    expect(result[0]).not.toBe(records[0]);
  });

  it("rejects non-array input", () => {
    expect(() => transformActiveTickets("invalid")).toThrow(
      InvalidRawTicketError,
    );
  });

  it("rejects a blank id or title after trimming", () => {
    expect(() =>
      transformActiveTickets([{ id: "   ", title: "Valid", status: "open" }]),
    ).toThrow(InvalidRawTicketError);
  });

  it("rejects an unsupported status", () => {
    expect(() =>
      transformActiveTickets([
        { id: "T-1", title: "Valid", status: "waiting" },
      ]),
    ).toThrow(InvalidRawTicketError);
  });

  it("rejects a non-boolean archived value", () => {
    expect(() =>
      transformActiveTickets([
        { id: "T-1", title: "Valid", status: "open", archived: "yes" },
      ]),
    ).toThrow(InvalidRawTicketError);
  });
});
