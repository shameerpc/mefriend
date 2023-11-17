import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEventTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  event_ticket_id?: number;
}
