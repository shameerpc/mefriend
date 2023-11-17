/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SubEventEntity } from 'src/typeOrm/entities/SubEvent';

export type SubEventRepositoryInterface =
  BaseInterfaceRepository<SubEventEntity>;
