/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { FaqEntity } from 'src/typeOrm/entities/Faq';

export type FaqRepositoryInterface = BaseInterfaceRepository<FaqEntity>;
