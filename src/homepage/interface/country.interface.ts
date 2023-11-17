/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from "src/repositories/base/base.interface.repository";
import { CountryEntity } from "src/typeOrm/entities/Country";

export type CountryRepositoryInterface = BaseInterfaceRepository<CountryEntity>;
