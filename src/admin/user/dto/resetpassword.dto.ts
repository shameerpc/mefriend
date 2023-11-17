/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty()
  readonly current_password: string;
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty()
  readonly new_password: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;
}
