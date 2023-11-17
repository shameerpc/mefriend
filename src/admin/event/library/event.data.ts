import { EventEntity } from 'src/typeOrm/entities/Event';

export class EventData {
  async createResponse(input: EventEntity) {
    const data = {
      event_id: input.id,
      title: input.title,
      event_code: input.event_code,
      organizer_id: input.organizer_id,
      category_id: input.category_id,
      country_id: input.country_id,

      city: input.city_id,
      venue: input.venue,
      venue_latitude: input.venue_latitude,
      venue_longitude: input.venue_longitude,
      map_url: input.map_url,

      event_description: input.event_description,
      featured_image: input.featured_image,
      banner_image: input.banner_image,
      event_date_from: input.event_date_from,
      event_time_from: input.event_time_from,
      event_date_to: input.event_date_to,
      event_time_to: input.event_time_to,
      total_seats: input.total_seats,
    };
    return data;
  }
}
