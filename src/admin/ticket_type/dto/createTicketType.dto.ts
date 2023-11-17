/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketTypeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsOptional()
  ticket_count: number;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  status: number;
  @ApiProperty()
  @MaxLength(30)
  @MinLength(40)
  description: string;
}
