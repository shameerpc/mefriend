/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SubEventQuestionAnswerEntity } from 'src/typeOrm/entities/SubEventQuestionAnswers';

export class SubEventQuestionAnswerRepository extends BaseAbstractRepository<SubEventQuestionAnswerEntity> {
  constructor(
    @InjectRepository(SubEventQuestionAnswerEntity)
    repository: Repository<SubEventQuestionAnswerEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
