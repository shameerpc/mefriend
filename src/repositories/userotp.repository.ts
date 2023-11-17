/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';

import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOtpEntity } from 'src/typeOrm/entities/UserOtp';

export class UserOtpRepository extends BaseAbstractRepository<UserOtpEntity> {
  constructor(
    @InjectRepository(UserOtpEntity)
    userOtpRepository: Repository<UserOtpEntity>,
  ) {
    super(userOtpRepository);
  }
}
