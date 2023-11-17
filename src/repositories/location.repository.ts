/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/typeOrm/entities/Location';

export class LocationRepository extends BaseAbstractRepository<LocationEntity> {
  constructor(
    @InjectRepository(LocationEntity) repository: Repository<LocationEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to LocationEntity
}
