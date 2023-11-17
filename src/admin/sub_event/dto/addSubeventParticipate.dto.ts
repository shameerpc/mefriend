/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSubEventParticipateDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  booking_id: number;

  @IsNotEmpty()
  @ApiProperty()
  event_id: number;

  @IsNotEmpty()
  @ApiProperty()
  sub_event_id: number;

  @ApiProperty()
  @IsOptional()
  question_answers: QuestionAnswerDto[] | undefined;
}
class QuestionAnswerDto {
  @IsString()
  question_id: number;

  @IsNumber()
  options: number[];

  @IsNumber()
  text_answer: string;
}
