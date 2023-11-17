import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCouponDto {
  @IsNotEmpty()
  @ApiProperty({
    type: [Number],
    description: 'Array of coupon IDs to be deleted',
    example: [1, 2, 3],
  })
  coupon_ids: number[];
}
