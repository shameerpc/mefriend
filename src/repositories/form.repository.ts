/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FormEntity } from 'src/typeOrm/entities/Forms';

export class FormRepository extends BaseAbstractRepository<FormEntity> {
  constructor(
    @InjectRepository(FormEntity) repository: Repository<FormEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to EventEntity
}
