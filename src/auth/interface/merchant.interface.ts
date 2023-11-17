/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { MerchantEntity } from 'src/typeOrm/entities/Merchants';

export type MerchantRepositoryInterface =
  BaseInterfaceRepository<MerchantEntity>;
