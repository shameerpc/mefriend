import { LocationEntity } from 'src/typeOrm/entities/Location';

export class CategoryData {
  async createResponse(input: LocationEntity) {
    const data = {
      location_id: input.id,
      title: input.title,
      status: input.status,
    };
    return data;
  }
}
