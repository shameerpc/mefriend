/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { FormEntity } from 'src/typeOrm/entities/Forms';

export type FormRepositoryInterface = BaseInterfaceRepository<FormEntity>;
