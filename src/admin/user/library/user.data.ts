import { UserEntity } from 'src/typeOrm/entities/User';

export class UserData {
  async registrationResponse(input: UserEntity, otp: string | undefined) {
    const data = {
      user_id: input.id,
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      mobile_number: input.phone_number,
      otp: otp,
    };
    return data;
  }
}
