import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserByOwnDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id?: number;

  @IsNotEmpty()
  @ApiProperty()
  id?: number;
}
