import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @ApiProperty()
  category_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  title?: string;

  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty()
  readonly sub_title?: string;

  // @IsOptional()
  // @IsNotEmpty()
  // @ApiProperty()
  // category_type?: number;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: 'string' })
  image: any;
  @IsNotEmpty()
  @ApiProperty({ type: 'number' })
  status: any;

  @IsOptional()
  @ApiProperty({ type: 'integer' })
  sort_order: number;
}
