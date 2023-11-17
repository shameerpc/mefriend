/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty()
  readonly title: string;

  @IsString()
  @MaxLength(50)
  @ApiProperty()
  readonly sub_title: string;

  @IsString()
  @ApiProperty()
  readonly description: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // award_id?: number;

  // @IsNotEmpty()
  // @ApiProperty()
  // readonly category_type: number; //type 1=open 2=general

  @ApiProperty({ type: 'string' })
  image: any; // The image field to store the URL or path to the image
  @IsNotEmpty()
  @ApiProperty()
  readonly status: number;
}
