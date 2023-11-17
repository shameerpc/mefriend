/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FaqEntity } from 'src/typeOrm/entities/Faq';

export class FaqRepository extends BaseAbstractRepository<FaqEntity> {
  constructor(@InjectRepository(FaqEntity) repository: Repository<FaqEntity>) {
    super(repository);
  }
  // Custom methods and functionality specific to FaqEntity
}
