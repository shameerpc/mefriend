/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingAdditionalUserEntity } from 'src/typeOrm/entities/BookingAdditionalUsers';

export class BookingAdditionalUserRepository extends BaseAbstractRepository<BookingAdditionalUserEntity> {
  constructor(
    @InjectRepository(BookingAdditionalUserEntity)
    repository: Repository<BookingAdditionalUserEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
