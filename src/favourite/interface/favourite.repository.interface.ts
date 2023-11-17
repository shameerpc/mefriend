/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { FavouriteEntity } from 'src/typeOrm/entities/Favourites';

export type FavouriteRepositoryInterface =
  BaseInterfaceRepository<FavouriteEntity>;
