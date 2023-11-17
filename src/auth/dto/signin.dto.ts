import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @ApiProperty()
  country_code: string;

  @IsNotEmpty()
  @ApiProperty({ minLength: 9 })
  phone_number: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // password: string;
}
