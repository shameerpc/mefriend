import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTicketTypeDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of TicketType IDs to be deleted',
    example: [1, 2, 3],
  })
  ticket_type_ids: number[];
}
