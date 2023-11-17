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

export class AddPermissionDto {
  @IsNotEmpty()
  @ApiProperty()
  readonly user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly permissionId: number;

  @IsNotEmpty()
  @ApiProperty()
  readonly hasPermission: boolean;

  @ApiProperty()
  readonly roleId: number;

  @ApiProperty()
  readonly rolePermissionId: number;
}
