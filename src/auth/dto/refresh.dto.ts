import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  refresh_token: string;
}
