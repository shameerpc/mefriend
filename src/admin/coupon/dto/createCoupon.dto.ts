/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Double } from 'typeorm';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  coupon_name: string;

  @ApiProperty()
  discount_type: number; //1-percentage,2 -amount
  @ApiProperty()
  discount_value: number;
  @ApiProperty()
  minimum_discount_value: number;
  @ApiProperty()
  coupon_code_duration_from: Date;
  @ApiProperty()
  coupon_code_duration_to: Date;
  @ApiProperty()
  minimum_coupon_redeem_count: number; // null - no limit
}
