/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SubEventParticipateEntity } from 'src/typeOrm/entities/SubEventParticipate';

export class SubEventParticipateRepository extends BaseAbstractRepository<SubEventParticipateEntity> {
  constructor(
    @InjectRepository(SubEventParticipateEntity)
    repository: Repository<SubEventParticipateEntity>,
  ) {
    super(repository);
  }
}
