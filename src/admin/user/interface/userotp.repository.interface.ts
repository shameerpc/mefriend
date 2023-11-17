import { BaseInterfaceRepository } from 'src/repositories/base/base.interface.repository';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';

export type UserOtpRepositoryInterface = BaseInterfaceRepository<UserOtpEntity>;
