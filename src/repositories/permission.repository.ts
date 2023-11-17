/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/typeOrm/entities/Permissions';

export class PermissionRepository extends BaseAbstractRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    repository: Repository<PermissionEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
