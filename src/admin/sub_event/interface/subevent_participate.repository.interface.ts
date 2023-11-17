/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SubEventParticipateEntity } from 'src/typeOrm/entities/SubEventParticipate';

export type SubEventParticipateRepositoryInterface =
  BaseInterfaceRepository<SubEventParticipateEntity>;
