/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';

import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ReferalPointsEntity } from 'src/typeOrm/entities/ReferalPoints';

export class ReferalPointsRepository extends BaseAbstractRepository<ReferalPointsEntity> {
  constructor(
    @InjectRepository(ReferalPointsEntity)
    UserReferalRepository: Repository<ReferalPointsEntity>,
  ) {
    super(UserReferalRepository);
  }
}
