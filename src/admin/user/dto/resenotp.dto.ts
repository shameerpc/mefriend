import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;
}
