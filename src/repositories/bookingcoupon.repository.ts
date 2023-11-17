/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingCouponEntity } from 'src/typeOrm/entities/BookingCoupon';

export class BookingCouponRepository extends BaseAbstractRepository<BookingCouponEntity> {
  constructor(
    @InjectRepository(BookingCouponEntity)
    repository: Repository<BookingCouponEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
