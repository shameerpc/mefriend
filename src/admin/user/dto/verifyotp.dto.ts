import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  otp: string;
}
