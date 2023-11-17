import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePageDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of page IDs to be deleted',
    example: [1, 2, 3],
  })
  page_ids: number[];
}
