/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  event_id: number;
  @IsNotEmpty()
  @ApiProperty()
  ticket_type_id: number;
  @IsNotEmpty()
  @ApiProperty()
  price: number;
}
