import { ApiProperty } from '@nestjs/swagger';

export class updatePasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  user_id: number;
}
