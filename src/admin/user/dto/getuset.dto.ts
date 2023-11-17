import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id?: number;

  @ApiProperty()
  @IsOptional()
  role_id?: number;

  @ApiProperty()
  @IsOptional()
  readonly page: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly limit: number | undefined;

  @IsOptional()
  readonly status: number | undefined;

  @IsOptional()
  search?: string | undefined;
}
