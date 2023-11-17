/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { QuestionTypeEntity } from 'src/typeOrm/entities/QuestionType';

export type QuestionTypeRepositoryInterface =
  BaseInterfaceRepository<QuestionTypeEntity>;
