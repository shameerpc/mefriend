/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';

export class TicketTypeRepository extends BaseAbstractRepository<TicketTypeEntity> {
  constructor(
    @InjectRepository(TicketTypeEntity)
    repository: Repository<TicketTypeEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to TicketTypeEntity
}
