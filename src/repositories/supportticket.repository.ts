/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportTicketsEntity } from 'src/typeOrm/entities/SupportTickets';

export class SupportTicketRepository extends BaseAbstractRepository<SupportTicketsEntity> {
  constructor(
    @InjectRepository(SupportTicketsEntity)
    repository: Repository<SupportTicketsEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
