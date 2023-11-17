import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetAllEventDto {
  @IsOptional()
  search?: string | undefined;
  @IsOptional()
  country_id?: number | undefined;
  @IsOptional()
  city_id?: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly page: number | undefined;

  @ApiProperty()
  @IsOptional()
  readonly limit: number | undefined;
  @IsOptional()
  category_id?: number | undefined;
  // @IsOptional()
  // filter_date?: number | undefined;
  @IsOptional()
  sort_by_date?: number | undefined; //1-asc,2-desc
  @IsOptional()
  sort_by_price?: number | undefined; //1-asc,2-desc

  @IsOptional()
  event_type?: string | undefined;

  @ApiProperty({ example: '2023-09-01' })
  @IsOptional()
  readonly filter_date: string | undefined;
  @IsOptional()
  status?: number | undefined; //1-asc,2-desc
}
