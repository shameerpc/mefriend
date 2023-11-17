import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';

export class CategoryData {
  async createResponse(input: TicketTypeEntity) {
    const data = {
      location_id: input.id,
      title: input.title,
      status: input.status,
    };
    return data;
  }
}
