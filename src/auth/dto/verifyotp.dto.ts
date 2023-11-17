import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  otp: string;
}
