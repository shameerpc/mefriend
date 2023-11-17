import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetSettingDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;
}
