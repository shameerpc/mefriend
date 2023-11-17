/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BookingCouponEntity } from 'src/typeOrm/entities/BookingCoupon';

export type BookingCouponRepositoryInterface =
  BaseInterfaceRepository<BookingCouponEntity>;
