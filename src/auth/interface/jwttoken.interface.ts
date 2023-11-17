/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';

export type JwtTokenRepositoryInterface =
  BaseInterfaceRepository<JwtTokenEntity>;
