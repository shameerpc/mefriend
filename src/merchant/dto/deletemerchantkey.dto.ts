import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteMerchantKeyDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  @ApiProperty({
    type: [Number],
    description: 'Array of merchant ids to be deleted',
    example: [2, 3],
  })
  merchant_ids: number[];
}
