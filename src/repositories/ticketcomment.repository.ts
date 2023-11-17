import { TicketCommentsEntity } from './../typeOrm/entities/TicketComments';
/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class TicketCommentRepository extends BaseAbstractRepository<TicketCommentsEntity> {
  constructor(
    @InjectRepository(TicketCommentsEntity)
    repository: Repository<TicketCommentsEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
