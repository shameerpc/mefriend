import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEventTicketDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of EventTicket IDs to be deleted',
    example: [1, 2, 3],
  })
  event_ticket_ids: number[];
}
