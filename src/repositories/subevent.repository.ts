/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SubEventEntity } from 'src/typeOrm/entities/SubEvent';

export class SubEventRepository extends BaseAbstractRepository<SubEventEntity> {
  constructor(
    @InjectRepository(SubEventEntity)
    repository: Repository<SubEventEntity>,
  ) {
    super(repository);
  }
}
