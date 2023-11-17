/* eslint-disable prettier/prettier */
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { AuthService } from 'src/auth/auth.service';
import { commonMessages } from 'src/common/library/commonmessages';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { CommonServices } from 'src/common/services/common.service';
import { UserRepositoryInterface } from './interface/user.repository.interface';
import { UserRole } from 'src/common/enum/user-role.enum';
import { DeleteUserByOwnDto } from './dto/deletebyown.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authServices: AuthService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private responses: ResponsesData,
    private readonly logger: Logger,
    private commonService: CommonServices,
    private commonValidation: CommonValidation,

    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
  ) {}

  async deleteUserByOwn({ user_id, id }: DeleteUserByOwnDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const data = await this.userRepository.findByCondition({
        id: user_id,
      });
      if (!data) return this.responses.errorResponse("Can't delete");

      const datam = await this.userRepository.delete(id);
      if (datam) return this.responses.successResponse(datam);
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }
}
