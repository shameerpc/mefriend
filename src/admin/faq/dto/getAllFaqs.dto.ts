import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAllFaqDto {
  @IsOptional()
  search?: string | undefined;

  @ApiProperty()
  @IsOptional()
  readonly page: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly limit: number | undefined;
}
