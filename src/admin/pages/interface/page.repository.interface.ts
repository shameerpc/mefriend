/* eslint-disable prettier/prettier */
import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { PageEntity } from 'src/typeOrm/entities/Page';

export type PageRepositoryInterface = BaseInterfaceRepository<PageEntity>;
