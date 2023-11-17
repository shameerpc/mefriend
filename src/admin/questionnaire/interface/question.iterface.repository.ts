/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

export type QuestionRepositoryInterface =
  BaseInterfaceRepository<QuestionEntity>;
