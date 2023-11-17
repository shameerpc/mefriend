/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BookingAdditionalUserEntity } from 'src/typeOrm/entities/BookingAdditionalUsers';

export type BookingAdditionalUserRepositoryInterface =
  BaseInterfaceRepository<BookingAdditionalUserEntity>;
