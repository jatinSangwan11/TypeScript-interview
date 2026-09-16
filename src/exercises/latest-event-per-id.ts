export interface TimestampedEvent {
  id: string;
  type: string;
  occurredAt: string;
}

export class InvalidTimestampedEventError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTimestampedEventError";
  }
}

/**
 * Return the latest event for each ID.
 *
 * Requirements:
 * - preserve the order in which each distinct ID first appeared;
 * - if two events for an ID have equal timestamps, keep the first one;
 * - do not mutate the input;
 * - throw InvalidTimestampedEventError for malformed input, empty id/type,
 *   or an invalid occurredAt date string.
 */
export function findLatestEventPerId(input: unknown): TimestampedEvent[] {

  if(!Array.isArray(input)){
    throw new InvalidTimestampedEventError("input must be an array")
  }
  for(const event of input){
    if(event === null || typeof event !== "object"){
      throw new InvalidTimestampedEventError("Invalid Input")
    }
    if(typeof event.id !== "string" || event.id.length === 0){
      throw new InvalidTimestampedEventError("event id is invalid and must be a string")
    }
    if(typeof event.type !== "string" || event.type.length === 0){
      throw new InvalidTimestampedEventError("event type is invalid and must be a string")
    }
    if(typeof event.occurredAt !== "string"){
      throw new InvalidTimestampedEventError("timestamp must be a string")
    }
    let timeStamp = Date.parse(event.occurredAt)
    if(Number.isNaN(timeStamp)){
      throw new InvalidTimestampedEventError("Occured_at is an invalid date")
    }
  }
  const eventMap = new Map<string,TimestampedEvent>()
  const latestEventById: TimestampedEvent[] = []
  for(const event of input){
    let storedEvent = eventMap.get(event.id)
    if(storedEvent === undefined){
      eventMap.set(event.id, event)
    }else {
      const first = Date.parse(storedEvent.occurredAt)
      const second = Date.parse(event.occurredAt)
      if(first < second){
        eventMap.set(event.id, event)
      }
    }
  }
  for(const event of eventMap){
    latestEventById.push(event[1])
  }
  return latestEventById
}
