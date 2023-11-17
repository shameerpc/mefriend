/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/typeOrm/entities/Notitfication';

export class NotificationRepository extends BaseAbstractRepository<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    repository: Repository<NotificationEntity>,
  ) {
    super(repository);
  }
  // Custom methods and functionality specific to CategoryEntity
}
