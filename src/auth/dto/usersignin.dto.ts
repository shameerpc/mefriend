import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  @ApiProperty({ minLength: 10 })
  email_or_phone: any;

  @IsNotEmpty()
  @ApiProperty({ minLength: 6 })
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  role_id: number;
}
