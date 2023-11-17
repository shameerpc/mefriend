import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetEventDto {
  @IsNotEmpty()
  @ApiProperty()
  event_id?: number;
}
