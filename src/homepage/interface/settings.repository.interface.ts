/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { SettingsEntity } from 'src/typeOrm/entities/Settings';

export type SettingsRepositoryInterface =
  BaseInterfaceRepository<SettingsEntity>;
