import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetLocationDto {
  @IsNotEmpty()
  @ApiProperty()
  location_id?: number;
}
