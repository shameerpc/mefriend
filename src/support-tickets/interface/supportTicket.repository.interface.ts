/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SupportTicketsEntity } from 'src/typeOrm/entities/SupportTickets';

export type SupportTicketRepositoryInterface =
  BaseInterfaceRepository<SupportTicketsEntity>;
