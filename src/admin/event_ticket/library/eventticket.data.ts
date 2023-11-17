import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';

export class EventTicketData {
  async createResponse(input: EventTicketEntity) {
    const data = {
      location_id: input.id,
      event_id: input.event_id,
      ticket_type_id: input.ticket_type_id,
      status: input.status,
    };
    return data;
  }
}
