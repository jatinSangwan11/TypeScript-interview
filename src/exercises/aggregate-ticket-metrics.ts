export type MetricTicketStatus = "open" | "in_progress" | "resolved";

export interface TicketMetricRecord {
  id: string;
  status: MetricTicketStatus;
  responseTimeMs: number;
  assigneeId?: string;
}

export interface TicketMetrics {
  total: number;
  byStatus: Record<MetricTicketStatus, number>;
  totalResponseTimeMs: number;
  averageResponseTimeMs: number;
  unassigned: number;
}

export class InvalidMetricRecordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMetricRecordError";
  }
}

/**
 * Validate ticket records and calculate aggregate metrics.
 *
 * Requirements:
 * - use reduce for the aggregation;
 * - return zero for averageResponseTimeMs when the input is empty;
 * - consider a ticket unassigned when assigneeId is absent;
 * - do not mutate the input;
 * - throw InvalidMetricRecordError for malformed input, blank id,
 *   unsupported status, negative/non-finite responseTimeMs, or a present
 *   assigneeId that is not a non-empty string.
 */
export function aggregateTicketMetrics(input: unknown): TicketMetrics {
  if(!Array.isArray(input))throw new InvalidMetricRecordError("input must be a array")

    for(const ticket of input){
      if(ticket === null || typeof ticket !== "object"){
        throw new InvalidMetricRecordError("input must be valid")
      }
      if(typeof ticket.id !== "string" || ticket.id.trim().length === 0){
        throw new InvalidMetricRecordError("ticket id is invalid")
      }
      if(typeof ticket.responseTimeMs !== "number" || ticket.responseTimeMs < 0 || !Number.isFinite(ticket.responseTimeMs)){
        throw new InvalidMetricRecordError("ticket response time should not be negative")
      }
      if(ticket.status !== "open" &&
        ticket.status !== "in_progress" &&
        ticket.status !== "resolved"
      ){
        throw new InvalidMetricRecordError("invalid status")
      }
      if (
        ticket.assigneeId !== undefined &&
        (typeof ticket.assigneeId !== "string" || ticket.assigneeId.trim().length === 0)
      ) {
        throw new InvalidMetricRecordError("invalid type of archived");
      }
    }
    const byStatus: Record<MetricTicketStatus, number> = {
      "open" : 0,
      "in_progress": 0,
      "resolved": 0
    }
    const records = input as TicketMetricRecord[]
    const ticketMetrics: TicketMetrics = records.reduce((record: TicketMetrics, curr) => {
      return {
        ...record,
        total: record.total+1,
        byStatus: {
          ...record.byStatus,
          [curr.status]: record.byStatus[curr.status]+1,
        },
        totalResponseTimeMs: record.totalResponseTimeMs+curr.responseTimeMs,
        unassigned : record.unassigned + (curr.assigneeId === undefined? 1 : 0)
      }
    }, {
      total: 0,
      byStatus: byStatus,
      totalResponseTimeMs: 0,
      averageResponseTimeMs: 0,
      unassigned: 0
    })
    return {...ticketMetrics, averageResponseTimeMs: (ticketMetrics.totalResponseTimeMs === 0)? 0 : ticketMetrics.totalResponseTimeMs/ticketMetrics.total}
}
