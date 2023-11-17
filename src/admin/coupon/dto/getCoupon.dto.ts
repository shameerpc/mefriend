import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCouponDto {
  @IsNotEmpty()
  @ApiProperty()
  coupon_id?: number;
}
