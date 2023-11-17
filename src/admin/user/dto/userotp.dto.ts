import { IsNotEmpty, IsString } from 'class-validator';

export class UserOtpDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
