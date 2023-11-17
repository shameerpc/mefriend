import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSupportTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  ticket_id?: number;
}
