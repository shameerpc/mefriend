/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetQuestionsByIdDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsOptional()
  @ApiProperty()
  readonly question_id: number | undefined;
}
