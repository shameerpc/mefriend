/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  organizer_id: number;

  @IsNotEmpty()
  @ApiProperty()
  category_id: number;

  @IsNotEmpty()
  @ApiProperty()
  country_id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  venue: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  venue_latitude: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  venue_longitude: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  map_url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  event_description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  featured_image: any;

  @IsString()
  @ApiProperty()
  banner_image: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  event_date_from: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  event_date_to: Date;

  @IsNotEmpty()
  @ApiProperty()
  event_time_from: string;

  @IsNotEmpty()
  @ApiProperty()
  event_time_to: string;

  @IsNotEmpty()
  @ApiProperty()
  total_seats: number;
  @IsNotEmpty()
  @ApiProperty()
  agent_commission: number;
  @ApiProperty()
  single_ticket_price: number;
  @ApiProperty()
  event_type: number;

  @ApiProperty()
  about_the_event: string;
  @ApiProperty()
  detailed_address: string;

  @ApiProperty()
  event_subscription_status: number;
  @ApiProperty()
  additional_venue_address: string;
  @ApiProperty()
  about_the_event_title: string;

  @ApiProperty()
  ticket_type_prices: object[];
  @ApiProperty()
  sponsors: object[];
  @ApiProperty()
  questionnaire_form_id: number;

  @ApiProperty()
  sub_events: object[];
  @IsNotEmpty()
  @ApiProperty()
  city_id: number;
  @ApiProperty()
  contact_ph: string;
  @ApiProperty()
  contact_email: string;
  @ApiProperty()
  agent_ids: Number[];
}
