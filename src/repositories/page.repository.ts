/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from 'src/typeOrm/entities/Page';

export class PageRepository extends BaseAbstractRepository<PageEntity> {
  constructor(
    @InjectRepository(PageEntity) repository: Repository<PageEntity>,
  ) {
    super(repository);
  }
}
