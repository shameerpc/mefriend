/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { TicketCommentsEntity } from 'src/typeOrm/entities/TicketComments';

export type TicketCommentRepositoryInterface =
  BaseInterfaceRepository<TicketCommentsEntity>;
