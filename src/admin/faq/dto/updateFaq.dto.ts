import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFaqDto {
  @IsNotEmpty()
  @ApiProperty()
  faq_id: number;

  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  question: string;
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(50)
  answer: string;

  @IsNotEmpty()
  @ApiProperty()
  status: number;
}
