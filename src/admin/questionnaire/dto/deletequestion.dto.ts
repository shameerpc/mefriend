/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteQuestionsByIdDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsOptional()
  @ApiProperty()
  readonly form_id: number | undefined;
}
