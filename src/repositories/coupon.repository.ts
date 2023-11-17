/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from 'src/typeOrm/entities/Coupon';

export class CouponRepository extends BaseAbstractRepository<CouponEntity> {
  constructor(
    @InjectRepository(CouponEntity) repository: Repository<CouponEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CouponEntity
}
