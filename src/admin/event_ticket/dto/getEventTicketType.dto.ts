import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetEventTicketTypeDto {
  @IsOptional()
  search?: string | undefined;

  @ApiProperty()
  readonly event_id: number | undefined;
}
