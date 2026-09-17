export interface PageTicket {
  id: string;
  title: string;
}

export interface TicketPage {
  items: PageTicket[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export class InvalidPaginationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPaginationError";
  }
}

/**
 * Return one page of tickets using one-based page numbers.
 *
 * Requirements:
 * - use slice to select the page;
 * - preserve ticket order and do not mutate the input;
 * - return an empty items array when page is beyond the available data;
 * - totalPages is zero when there are no tickets;
 * - throw InvalidPaginationError when input is malformed, a ticket has a
 *   blank/non-string id or title, or page/pageSize is not a positive integer.
 */
export function paginateTickets(
  input: unknown,
  page: unknown,
  pageSize: unknown,
): TicketPage {
  if(!Array.isArray(input)){
    throw new InvalidPaginationError("input must be an array")
  }
  for(const ticket of input){
    if(ticket === null || typeof ticket !== "object"){
      throw new InvalidPaginationError("invalid input")
    }
    if(ticket.id !== undefined && (typeof ticket.id !== "string" || ticket.id.trim().length === 0)){
      throw new InvalidPaginationError("id should be valid")
    }
    if(ticket.title !== undefined && (typeof ticket.title !== "string" || ticket.title.trim().length === 0)){
      throw new InvalidPaginationError("id should be valid")
    }
  }
  if(page === undefined || pageSize === undefined){
    throw new InvalidPaginationError("give valid details")
  }
  if(page !== undefined && (typeof page !== "number" || page<=0 || !Number.isInteger(page))){
    throw new InvalidPaginationError("Page must be a positive number")
  }
  if(pageSize !== undefined && (typeof pageSize !== "number" || pageSize<=0 || !Number.isInteger(pageSize))){
    throw new InvalidPaginationError("pageSize must be a positive number")
  }
  
  const startIndex = (page-1)* pageSize
  const endIndex = startIndex+ pageSize
  const records =  input as PageTicket[]
  const pageContent: PageTicket[] = records.slice(startIndex, endIndex)
  console.log("this is the page content::", pageContent)
  const ticketPage: TicketPage = {
    items: pageContent,
    page: page,
    pageSize: pageSize,
    totalItems: records.length,
    totalPages: Math.ceil(records.length/pageSize),
    hasPreviousPage: false,
    hasNextPage: false
  }
 
  return {...ticketPage, 
    hasPreviousPage: (page > 1 && ticketPage.totalPages>0)? true: false, 
    hasNextPage: (ticketPage.totalPages > page)? true: false}
}
