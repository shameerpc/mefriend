/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleEntity } from 'src/typeOrm/entities/Modules';

export class ModuleRepository extends BaseAbstractRepository<ModuleEntity> {
  constructor(
    @InjectRepository(ModuleEntity) repository: Repository<ModuleEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
