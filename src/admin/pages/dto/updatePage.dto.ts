import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdatePageDto {
  @IsNotEmpty()
  @ApiProperty()
  page_id: number;

  @IsNotEmpty({ message: 'Page title should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  title: string;

  @IsNotEmpty({ message: 'Description should not be empty' })
  @IsString()
  @MaxLength(1500)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  status: number;
}
