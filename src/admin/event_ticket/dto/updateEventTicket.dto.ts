import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventTicketDto {
  @IsNotEmpty()
  @ApiProperty()
  event_ticket_id: number;
  @IsNotEmpty()
  @ApiProperty()
  event_id: number;
  @IsNotEmpty()
  @ApiProperty()
  ticket_type_id: number;
  @IsNotEmpty()
  @ApiProperty()
  price: number;
  @IsNotEmpty()
  @ApiProperty()
  status: number;
}
