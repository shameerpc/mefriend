/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  country_id: number;
}
