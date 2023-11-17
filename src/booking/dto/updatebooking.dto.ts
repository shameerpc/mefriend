import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PersonDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsNumber()
  gender: number;
}

export class UpdateBookingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  @Type(() => PersonDto)
  people: PersonDto[];

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  ticket_count: number;

  @ApiProperty()
  booking_id: number;
}
