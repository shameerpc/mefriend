/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SubEventQuestionAnswerEntity } from 'src/typeOrm/entities/SubEventQuestionAnswers';

export type SubEventQuestionAnswerRepositoryInterface =
  BaseInterfaceRepository<SubEventQuestionAnswerEntity>;
