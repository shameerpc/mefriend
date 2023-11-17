/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { BookingEntity } from 'src/typeOrm/entities/Booking';

export type BookingRepositoryInterface = BaseInterfaceRepository<BookingEntity>;
