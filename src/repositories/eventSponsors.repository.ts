/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSponsorEntity } from 'src/typeOrm/entities/EventSponsor';

export class EventSponsorRepository extends BaseAbstractRepository<EventSponsorEntity> {
  constructor(
    @InjectRepository(EventSponsorEntity)
    repository: Repository<EventSponsorEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to EventSponsorEntity
}
