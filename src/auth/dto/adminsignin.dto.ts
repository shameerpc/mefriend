import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminSignInDto {
  @IsNotEmpty()
  @ApiProperty({ minLength: 10 })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 6 })
  password: string;
}
