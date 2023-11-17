import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTicketTypeDto {
  @IsNotEmpty()
  @ApiProperty()
  ticket_type_id?: number;
}
