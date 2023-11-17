/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermissionEntity } from 'src/typeOrm/entities/RolePermissions';

export class RolePermissionRepository extends BaseAbstractRepository<RolePermissionEntity> {
  constructor(
    @InjectRepository(RolePermissionEntity)
    repository: Repository<RolePermissionEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
