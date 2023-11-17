/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionOptionEntity } from 'src/typeOrm/entities/QuestionOptions';

export class QuestionOptionRepository extends BaseAbstractRepository<QuestionOptionEntity> {
  constructor(
    @InjectRepository(QuestionOptionEntity)
    repository: Repository<QuestionOptionEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
