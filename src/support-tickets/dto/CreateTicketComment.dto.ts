/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketCommentDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly ticket_id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly comment: string;

  // @IsOptional()
  // @ApiProperty()
  // is_closed?: string;
}
