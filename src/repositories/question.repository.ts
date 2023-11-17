/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/typeOrm/entities/Questions';

export class QuestionRepository extends BaseAbstractRepository<QuestionEntity> {
  constructor(
    @InjectRepository(QuestionEntity)
    repository: Repository<QuestionEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
