import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id?: number;

  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of User IDs to be deleted',
    example: [1, 2, 3],
  })
  ids: number[];
}
