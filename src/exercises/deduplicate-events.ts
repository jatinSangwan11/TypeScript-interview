export interface TicketEvent {
  id: string;
  type: string;
}

export class InvalidEventInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEventInputError";
  }
}

/**
 * Remove events with duplicate IDs while preserving input order.
 * When an ID appears more than once, keep its first occurrence.
 * Do not mutate the input array.
 *
 * Validate runtime input and throw InvalidEventInputError when:
 * - input is not an array;
 * - an item is not a non-null object;
 * - id is not a non-empty string; or
 * - type is not a non-empty string.
 */
export function deduplicateEvents(input: unknown): TicketEvent[] {
  if(!Array.isArray(input)){
    throw new InvalidEventInputError("input must be a array")
  }
  for(const element of input){
    if(element === null){
      throw new InvalidEventInputError("item must be a non-null object")
    }
    if(element.id.length === 0 || typeof element.id !== "string"){
      throw new InvalidEventInputError("id should be a non-empty string")
    }
    if(element.type.length === 0 || typeof element.type !== "string"){
      throw new InvalidEventInputError("type should be a non-empty string")
    }
  }
  const dediplicatedEvents: TicketEvent[]=[]
  // let eventMap = new Map()
  // for(const event of input){
  //   let element = eventMap.get(event.id)
  //   if(element === undefined){
  //     eventMap.set(event.id, event)
  //     dediplicatedEvents.push(event)
  //   }
  // }
  // return dediplicatedEvents
  let eventSet = new Set<string>()
  for(const event of input){
    let element = eventSet.has(event.id)
    if(!element){
      eventSet.add(event.id)
      dediplicatedEvents.push(event)
    }
  }
  return dediplicatedEvents
}
