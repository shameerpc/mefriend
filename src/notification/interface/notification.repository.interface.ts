/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { NotificationEntity } from 'src/typeOrm/entities/Notitfication';

export type NotificationRepositoryInterface =
  BaseInterfaceRepository<NotificationEntity>;
