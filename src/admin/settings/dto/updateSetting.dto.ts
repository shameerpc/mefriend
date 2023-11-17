/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { String } from 'aws-sdk/clients/acm';

export class UpdateSettingDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty()
  readonly email: string;

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
  @ApiProperty({ default: 1 })
  readonly single_referral_point: number;

  @IsOptional()
  @ApiProperty()
  readonly facebook_link: string;

  @IsOptional()
  @ApiProperty()
  readonly instagram_link: string;

  @IsOptional()
  @ApiProperty()
  readonly twitter_link: string;

  @IsOptional()
  @ApiProperty()
  readonly linkedin_link: string;

  @IsOptional()
  @ApiProperty()
  readonly address: string;

  @IsOptional()
  @ApiProperty()
  readonly description: string;
}
