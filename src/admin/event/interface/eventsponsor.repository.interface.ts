/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { EventSponsorEntity } from 'src/typeOrm/entities/EventSponsor';

export type EventSponsorRepositoryInterface =
  BaseInterfaceRepository<EventSponsorEntity>;
