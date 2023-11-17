/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { UserEntity } from 'src/typeOrm/entities/User';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends BaseAbstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to UserEntity
}
