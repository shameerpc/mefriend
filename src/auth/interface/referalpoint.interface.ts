/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { ReferalPointsEntity } from 'src/typeOrm/entities/ReferalPoints';

export type ReferalPointRepositoryInterface =
  BaseInterfaceRepository<ReferalPointsEntity>;
