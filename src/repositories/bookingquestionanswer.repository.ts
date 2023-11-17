/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingQuestionAnswerEntity } from 'src/typeOrm/entities/BookingQuestionAnswers';

export class BookingQuestionAnswerRepository extends BaseAbstractRepository<BookingQuestionAnswerEntity> {
  constructor(
    @InjectRepository(BookingQuestionAnswerEntity)
    repository: Repository<BookingQuestionAnswerEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
