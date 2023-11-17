import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPageDto {
  @IsNotEmpty()
  @ApiProperty()
  page_id?: number;
}
