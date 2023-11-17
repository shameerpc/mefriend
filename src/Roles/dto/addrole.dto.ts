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

export class AddRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly role_id: number;
}
