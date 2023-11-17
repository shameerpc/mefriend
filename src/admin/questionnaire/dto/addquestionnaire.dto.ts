/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class QuestionDto {
  title: string;
  question_type: number;
  options: string[];
}

export class CreateQuestionsDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @ApiProperty()
  questions: QuestionDto[];

  @ApiProperty({ default: 1 })
  event_type: number; //1-event 2-subevent

  // @IsNotEmpty()
  // @IsOptional()
  // @ApiProperty()
  // readonly event_type_id: number;
}
