import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of category IDs to be deleted',
    example: [1, 2, 3],
  })
  category_ids: number[];
}
