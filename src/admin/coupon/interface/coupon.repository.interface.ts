/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { CouponEntity } from 'src/typeOrm/entities/Coupon';

export type CouponRepositoryInterface = BaseInterfaceRepository<CouponEntity>;
