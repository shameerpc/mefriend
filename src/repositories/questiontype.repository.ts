/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionTypeEntity } from 'src/typeOrm/entities/QuestionType';

export class QuestionTypeRepository extends BaseAbstractRepository<QuestionTypeEntity> {
  constructor(
    @InjectRepository(QuestionTypeEntity)
    repository: Repository<QuestionTypeEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
