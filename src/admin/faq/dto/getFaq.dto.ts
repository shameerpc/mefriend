import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetFaqDto {
  @IsNotEmpty()
  @ApiProperty()
  faq_id?: number;
}
