import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAllNotificationDto {
  @IsOptional()
  search?: string | undefined;

  @ApiProperty()
  @IsNotEmpty()
  readonly user_id: number;

  @ApiProperty()
  @IsOptional()
  readonly page: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly limit: number | undefined;
}
