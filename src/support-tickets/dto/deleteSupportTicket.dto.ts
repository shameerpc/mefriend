import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSupportTicketDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of ticket IDs to be deleted',
    example: [1, 2, 3],
  })
  ticket_ids: number[];
}
