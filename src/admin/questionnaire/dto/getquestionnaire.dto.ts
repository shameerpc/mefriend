/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetQuestionsDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsOptional()
  @ApiProperty()
  readonly form_id: number | undefined;

  @IsOptional()
  @ApiProperty()
  readonly question_id: number | undefined;

  @IsOptional()
  @ApiProperty()
  readonly page: number | undefined;

  @IsOptional()
  @ApiProperty()
  readonly limit: number | undefined;

  @IsOptional()
  @ApiProperty()
  readonly search: string | undefined;
  @IsOptional()
  readonly status: number | undefined;
}
