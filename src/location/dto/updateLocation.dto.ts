import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @IsNotEmpty()
  @ApiProperty()
  location_id: number;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  status: number;

  @ApiProperty()
  country_id: number;
}
