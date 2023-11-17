/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BookingQuestionAnswerEntity } from 'src/typeOrm/entities/BookingQuestionAnswers';

export type BookingQuestionAnswerRepositoryInterface =
  BaseInterfaceRepository<BookingQuestionAnswerEntity>;
