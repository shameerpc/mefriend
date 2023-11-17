import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { UserEntity } from 'src/typeOrm/entities/User';
export type UserRepositoryInterface = BaseInterfaceRepository<UserEntity>;
