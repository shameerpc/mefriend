import { CouponEntity } from 'src/typeOrm/entities/Coupon';

export class CouponData {
  async createResponse(input: CouponEntity) {
    const data = {
      coupon_id: input.id,
      status: input.status,
      coupon_name: input.coupon_name,
      coupon_code: input.coupon_code,
      discount_type: input.discount_type, //1-percentage,2 -amount
      minimum_discount_value: input.minimum_discount_value,
      coupon_code_duration_from: input.coupon_code_duration_from,
      coupon_code_duration_to: input.coupon_code_duration_to,
      minimum_coupon_redeem_count: input.minimum_coupon_redeem_count,
    };
    return data;
  }
}
