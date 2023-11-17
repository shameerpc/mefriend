/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity } from 'src/typeOrm/entities/Booking';

export class BookingRepository extends BaseAbstractRepository<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity) repository: Repository<BookingEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
