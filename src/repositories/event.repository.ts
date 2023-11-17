/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/typeOrm/entities/Event';

export class EventRepository extends BaseAbstractRepository<EventEntity> {
  constructor(
    @InjectRepository(EventEntity) repository: Repository<EventEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to EventEntity
}
