/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty()
  @IsNotEmpty()
  question: string;
  @IsNotEmpty()
  @ApiProperty()
  answer: string;
  @IsNotEmpty()
  @ApiProperty()
  status: number;
  deleted_status: boolean;
}
