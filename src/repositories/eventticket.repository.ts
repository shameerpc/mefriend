/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';

export class EventTicketRepository extends BaseAbstractRepository<EventTicketEntity> {
  constructor(
    @InjectRepository(EventTicketEntity)
    repository: Repository<EventTicketEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to EventTicketEntity
}
