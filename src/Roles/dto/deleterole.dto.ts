/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of Role IDs to be deleted',
    example: [1, 2, 3],
  })
  role_ids: number[];
}
