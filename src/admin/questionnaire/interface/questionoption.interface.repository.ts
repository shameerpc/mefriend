/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { QuestionOptionEntity } from 'src/typeOrm/entities/QuestionOptions';

export type QuestionOptionRepositoryInterface =
  BaseInterfaceRepository<QuestionOptionEntity>;
