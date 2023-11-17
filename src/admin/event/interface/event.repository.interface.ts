/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { EventEntity } from 'src/typeOrm/entities/Event';

export type EventRepositoryInterface = BaseInterfaceRepository<EventEntity>;
