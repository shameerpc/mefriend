/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { TicketTypeEntity } from 'src/typeOrm/entities/TicketType';

export type TicketTypeRepositoryInterface =
  BaseInterfaceRepository<TicketTypeEntity>;
