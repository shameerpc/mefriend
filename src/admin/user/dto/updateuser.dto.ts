/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly id: number;

  @IsNotEmpty({ message: 'First name should not be empty' })
  @IsString({ message: 'First name should be a string' })
  @ApiProperty()
  readonly first_name: string;

  @IsString()
  @ApiProperty()
  readonly last_name: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly country_code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  @MaxLength(11)
  @ApiProperty()
  readonly phone_number: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly user_role: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly image: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly status: number;
}
