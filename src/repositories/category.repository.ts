/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/typeOrm/entities/Category';

export class CategoryRepository extends BaseAbstractRepository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity) repository: Repository<CategoryEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
