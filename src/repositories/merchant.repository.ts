/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';

export class MerchantRepository extends BaseAbstractRepository<MerchantEntity> {
  constructor(
    @InjectRepository(MerchantEntity)
    repository: Repository<MerchantEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
