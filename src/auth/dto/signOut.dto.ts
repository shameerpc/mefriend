import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignOutDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;
}
