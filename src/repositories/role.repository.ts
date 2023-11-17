/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { UserEntity } from 'src/typeOrm/entities/User';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/typeOrm/entities/Roles';

export class RoleRepository extends BaseAbstractRepository<RolesEntity> {
  constructor(
    @InjectRepository(RolesEntity) repository: Repository<RolesEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
