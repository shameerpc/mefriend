/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from 'src/typeOrm/entities/Settings';

export class SettingsRepository extends BaseAbstractRepository<SettingsEntity> {
  constructor(
    @InjectRepository(SettingsEntity) repository: Repository<SettingsEntity>,
  ) {
    super(repository);
  }
}
