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
class QuestionAnswerDto {
  @IsString()
  question_id: number;

  @IsNumber()
  options: number[];

  @IsNumber()
  text_answer: string;
}

export class CreateBookingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty()
  @Type(() => PersonDto)
  people: PersonDto[];

  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  event_id: number;

  @ApiProperty()
  coupon_code: string;

  @ApiProperty()
  event_ticket_type_id: number;

  @ApiProperty()
  ticket_count: number;

  @ApiProperty()
  @IsOptional()
  question_answers: QuestionAnswerDto[] | undefined;
}
