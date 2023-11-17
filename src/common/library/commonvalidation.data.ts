/* eslint-disable prettier/prettier */
import { Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';

export class CommonValidation {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async validateUser(userId: number) {
    const user = await this.userRepository.findOneById(userId);
    if (!user || user === null || user.delete_status || !user.status) {
      return false;
    }
    return true;
  }

  async isValidSlug(slug: string): Promise<boolean> {
    const slugPattern = /^[a-zA-Z0-9-]+$/;
    if (slugPattern.test(slug)) {
      return true;
    } else {
      return false;
    }
  }
}
