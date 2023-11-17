/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { CategoryEntity } from 'src/typeOrm/entities/Category';

export type CategoryRepositoryInterface =
  BaseInterfaceRepository<CategoryEntity>;
