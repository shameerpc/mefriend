/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { EventTicketEntity } from 'src/typeOrm/entities/EventTicket';

export type EventTicketRepositoryInterface =
  BaseInterfaceRepository<EventTicketEntity>;
