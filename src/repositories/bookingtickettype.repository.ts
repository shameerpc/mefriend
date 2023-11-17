/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEventTicketEntity } from 'src/typeOrm/entities/BookingTicketTypes';

export class BookingTicketTypeRepository extends BaseAbstractRepository<BookingEventTicketEntity> {
  constructor(
    @InjectRepository(BookingEventTicketEntity)
    repository: Repository<BookingEventTicketEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
