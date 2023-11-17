/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { LocationEntity } from 'src/typeOrm/entities/Location';

export type LocationRepositoryInterface =
  BaseInterfaceRepository<LocationEntity>;
