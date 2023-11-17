/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class QuestionDto {
  title: string;
  question_type: number;
  options: string[];
}

export class UpdateQuestionsDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly form_id: number;
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @ApiProperty()
  questions: QuestionDto[];

  @ApiProperty()
  event_type: number; //1-event 2-subevent

  // @ApiProperty()
  // event_type_id: number;
}
