import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetAllCityDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id?: number;

  @IsOptional()
  search?: string | undefined;

  //   @ApiProperty()
  //   @IsOptional()
  //   readonly page: number | undefined;

  //   @ApiProperty()
  //   @IsOptional()
  //   readonly limit: number | undefined;
}
