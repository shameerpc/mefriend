import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteEventDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of event IDs to be deleted',
    example: [1, 2, 3],
  })
  event_ids: number[];
}
