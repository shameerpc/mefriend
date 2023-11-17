/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BookingEventTicketEntity } from 'src/typeOrm/entities/BookingTicketTypes';

export type BookingTicketTypeRepositoryInterface =
  BaseInterfaceRepository<BookingEventTicketEntity>;
