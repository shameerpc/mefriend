import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  first_name?: string;

  @IsOptional()
  @ApiProperty()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  country_code: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(11)
  @ApiProperty()
  phone_number?: string;
}
