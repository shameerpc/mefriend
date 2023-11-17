import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCategoryDto {
  @IsNotEmpty()
  @ApiProperty()
  category_id?: number;
}
