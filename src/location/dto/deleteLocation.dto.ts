import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteLocationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of Location IDs to be deleted',
    example: [1, 2, 3],
  })
  location_ids: number[];
}
