/* eslint-disable prettier/prettier */
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { AuthService } from 'src/auth/auth.service';
import { commonMessages } from 'src/common/library/commonmessages';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/getuset.dto';
import { DeleteUserDto } from './dto/deleteuser.dto';
import { AddUserDto } from './dto/add-user.dto';
import { ILike, Not } from 'typeorm';
import { UpdateUsersDto } from './dto/updateuser.dto';
import { Multer } from 'multer';
import * as fs from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { UserRepositoryInterface } from './interface/user.repository.interface';
import { UserRole } from 'src/common/enum/user-role.enum';
import { DashboardDto } from './dto/dashboard.dto';
import { Status } from 'src/common/enum/status.enum';
import { DashboardResponseData } from './response/dashboard.response';
import { BookingRepositoryInterface } from 'src/booking/interface/booking.repository.interface';
import { EntityManager } from 'typeorm';
import { GetUserByIdDto } from './dto/getuserbyid.dto';
import { EventRepositoryInterface } from '../event/interface/event.repository.interface';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { IsPhoneNumber } from 'class-validator';
import { MailService } from 'src/mail/mail.service';

const path = require('path');
@Injectable()
export class UsersService {
  constructor(
    private readonly authServices: AuthService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private responses: ResponsesData,
    private readonly logger: Logger,
    private commonService: CommonServices,
    private commonValidation: CommonValidation,
    private dashboarResponse: DashboardResponseData,
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly bookingRepository: BookingRepositoryInterface,
    private readonly entityManager: EntityManager,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    private mailService: MailService,
  ) {}

  //for registration
  async verifyOtp({ user_id, otp }: VerifyOtpDto, request: any) {
    try {
      const verificationStatus = await this.commonService.verifyOtpService(
        user_id,
        otp,
        0,
      );

      if (!verificationStatus) {
        return this.responses.errorResponse('Invalid Otp');
      }
      const userUpdate = await this.userRepository.findAndUpdate(
        { id: user_id },
        { otp_verified: true },
      );

      /* sign in the created user */
      const userData = await this.userRepository.findOneById(user_id);
      const merchatKey = await this.merchantRepository.findByCondition({
        merchant_key: request.merchant,
      });

      const auth = await this.authServices.signIn(
        userData.country_code.toString(),
        userData.phone_number.toString(),
        merchatKey,
      );
      if (!auth.status) {
        await this.userRepository.findAndUpdate(
          { id: user_id },
          { otp_verified: false },
        );
        return this.responses.errorResponse(commonMessages.commonError);
      }

      return this.responses.successResponse(auth?.data);
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UsersService.verifyOtp');
      throw error;
    }
  }
  async addUser(
    {
      user_id,
      first_name,
      last_name,
      user_role,
      email,
      country_code,
      phone_number,
      password,
      description,
      image,
      status,
    }: AddUserDto,
    request: any,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const getData = await this.userRepository.findByCondition({
        email: email,
      });
      if (getData.length > 0)
        return this.responses.errorResponse('Email should be unique');

      const phoneData = await this.userRepository.findByCondition({
        phone_number: phone_number,
      });
      if (phoneData.length > 0)
        return this.responses.errorResponse('Phone number should be unique');

      const getMerchantId = await this.commonService.getMerchantId(
        request.user.merchant,
      );
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        first_name: first_name,
        last_name: last_name,
        user_role: user_role,
        email: email,
        country_code: country_code,
        phone_number: phone_number,
        password: hashedPassword,
        created_by: user_id,
        profile_image: image,
        merchant_id: getMerchantId,
        description: description,
        status: status,
        otp_verified: true,
      };
      const saveDate = await this.userRepository.save(userData);
      if (saveDate) {
        // const sendMail = await this.mailService.sendUserDetails(
        //   email,
        //   password,
        // );
        return this.responses.successResponse(saveDate);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'MerchantService.regenerateMerchantKey',
      );
      throw error;
    }
  }
  async getUser({ user_id, page, limit, role_id, status, search }: GetUserDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const queryCondition: any = search
        ? [
            { first_name: ILike(`%${search}%`) },
            { last_name: ILike(`%${search}%`) },
            { email: ILike(`%${search}%`) },
            { phone_number: ILike(`%${search}%`) },
          ]
        : {};
      if (role_id) {
        queryCondition.user_role = role_id;
      } else {
        queryCondition.user_role = Not(UserRole.SUPERADMIN);
      }
      if (status) {
        queryCondition.status = status;
      }

      const offset = page ? page : 1;

      const actualLimit = limit ? Number(limit) : 10;
      const data = await this.userRepository.findByConditionWithPagination(
        queryCondition,
        offset,
        actualLimit,
        'id: desc',
      );
      const datam =
        data.data.length > 0
          ? data.data.map(async (user: any) => {
              const role = await this.commonService.getRoleName(user.user_role);
              const data = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                country_code: user.country_code,
                email: user.email,
                description: user.description,
                referal_code: user.referal_code,
                user_role: role,
                role_id: user.user_role,
                status: user.status,
                status_name: user.status == 1 ? 'Active' : 'Inactive',
              };
              return data;
            })
          : [];
      const pagination = {
        page: offset,
        limit: actualLimit,
        total: data.total,
      };
      if (datam) {
        const response = {
          user_result: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }

  async getUserById({ user_id, id }: GetUserByIdDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const data = await this.userRepository.findByCondition({
        id: id,
      });
      console.log(data);
      if (!data) return this.responses.errorResponse('User not found');
      const role = await this.commonService.getRoleName(data[0].user_role);

      const userProfileDirectory = 'userProfile';
      // const image = path.join(
      //   __dirname,
      //   baseDirectory,
      //   userProfileDirectory,
      //   data[0].profile_image,
      // );
      const datam = {
        id: data[0].id,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        phone_number: data[0].phone_number,
        country_code: data[0].country_code,
        email: data[0].email,
        description: data[0].description,
        referal_code: data[0].referal_code,
        user_role: role,
        role_id: data[0].user_role,
        profile_image: data[0].profile_image ? data[0].profile_image : '',
        status: data[0].status,
        status_name: data[0].status == 1 ? 'Active' : 'Inactive',
      };

      return this.responses.successResponse(datam);
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }
  async deleteUser({ user_id, ids }: DeleteUserDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      if (ids.length < 1)
        return this.responses.errorResponse('User ids should not be empty');
      const checkExist: any = await this.commonService.checkIdsExistOrNot(
        ids,
        'user',
      );
      if (!checkExist) return this.responses.errorResponse('Please check ids');

      const successResults = [];
      for (const id of ids) {
        //Check if exists in the event
        //Check if the organizer id exist or not
        const isOrganizerExistEvent =
          await this.eventRepository.findByCondition({
            organizer_id: id,
          });
        if (isOrganizerExistEvent.length > 0)
          return this.responses.errorResponse(
            'You can not delete this user,because this user associated in some event',
          );

        const is_exist = await this.userRepository.findOneById(id);
        const deleteUser = this.userRepository.delete(id);
        if (deleteUser) {
          successResults.push({
            id: id,
            status: true,
            message: 'User deleted successfully',
          });
        } else {
          successResults.push({
            id: id,
            status: false,
            message: 'Deletion failed',
          });
        }
      }

      const allDeletedSuccessfully = successResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse({}, 'Users deleted successfully');
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }
  async updateUser(
    {
      id,
      user_id,
      first_name,
      last_name,
      country_code,
      phone_number,
      email,
      description,
      status,
      image,
    }: UpdateUsersDto,
    request: any,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      console.log(request);
      const roleOfLogin = await this.commonService.AuthRoleId(user_id);
      const data = await this.userRepository.findByCondition({
        id: id,
      });
      if (roleOfLogin != UserRole.SUPERADMIN) {
        if (user_id != data[0].id)
          return this.responses.errorResponse("Can't perform this action");
      }
      if (!data) return this.responses.errorResponse('User not found');
      const getData = await this.userRepository.findByCondition({
        email: email,
        id: Not(id),
      });
      if (getData.length > 0)
        return this.responses.errorResponse('Email should be unique');

      const phoneData = await this.userRepository.findByCondition({
        phone_number: phone_number,
        id: Not(id),
      });

      if (phoneData.length > 0)
        return this.responses.errorResponse('Phone number should be unique');

      const getMerchantId = await this.commonService.getMerchantId(
        request.user.merchant,
      );
      const userData = {
        first_name: first_name,
        last_name: last_name,
        // user_role: user_role,
        email: email,
        country_code: country_code,
        phone_number: phone_number,
        profile_image: image,
        status: status,
        merchant_id: getMerchantId,
        updated_by: user_id,
        description: description,
      };
      const saveDate = await this.userRepository.update(id, userData);
      if (saveDate) {
        return this.responses.successResponse(saveDate);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }
  async dashboard(request: any, { user_id }: DashboardDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const allUsers = await this.userRepository.findByCondition({
        user_role: Not(UserRole.SUPERADMIN),
        // status: Status.Active,
        delete_status: 0,
      });
      let result: any = this.dashboarResponse.getAllResponse(
        allUsers,
        await this.commonService.AuthRoleId(request.user.user_id),
      );
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = (currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0'); // Months are 0-indexed
      const currentDay = currentDate.getDate().toString().padStart(2, '0');

      // Generate an array of all months (1 to 12)
      const allMonths = Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString().padStart(2, '0'),
      );

      // Generate an array of all days (1 to 31)
      const allDays = Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString().padStart(2, '0'),
      );

      // Execute a SQL query to get booking counts for all months and days of the current year
      const query = `
        SELECT
          TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
          COUNT(*) AS booking_count
        FROM
          booking
        WHERE
          TO_CHAR(created_at, 'YYYY') = $1
        GROUP BY
          TO_CHAR(created_at, 'YYYY-MM-DD');
      `;

      const results = await this.entityManager.query(query, [
        currentYear.toString(),
      ]);

      // Process the results to format the date and set booking counts
      const groupedData = {};

      allMonths.forEach((month) => {
        allDays.forEach((day) => {
          const dateKey = `${currentYear}-${month}-${day}`;
          const matchingResult = results.find((item) => item.date === dateKey);

          if (matchingResult) {
            groupedData[month] = groupedData[month] || [];
            groupedData[month].push({
              date: dateKey,
              booking_count: parseInt(matchingResult.booking_count),
            });
          } else {
            groupedData[month] = groupedData[month] || [];
            groupedData[month].push({ date: dateKey, booking_count: 0 });
          }
        });
      });

      if (!result) return this.responses.errorResponse('User not found');
      result.booking_data = groupedData;
      return this.responses.successResponse(result);
    } catch (error) {
      this.logger.error(error.message, error.stack, 'UserService.getUser');
      return this.responses.errorResponse(error);
    }
  }

  async resetPasswordUsers(
    { user_id, current_password, new_password }: ResetPasswordDto,
    request,
  ) {
    try {
      // if (request.user.role_id == UserRole.SUPERADMIN) {
      //   return this.responses.errorResponse(
      //     'You can not change the password of this user',
      //   );
      // }
      // Find the user by username from your database (you should have a repository or database service for this).
      const isCurrentPassword = await this.userRepository.findOneById(user_id);

      if (isCurrentPassword) {
        // Compare the hashed password in the database with the provided password.
        const passwordMatch = await bcrypt.compare(
          current_password,
          isCurrentPassword.password,
        );

        if (!passwordMatch) {
          return this.responses.errorResponse(
            'Current password does not match.please enter valid password',
          );
        }
      } else {
        return this.responses.errorResponse('User not found');
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      const userUpdate = await this.userRepository.findAndUpdate(
        { id: user_id },
        { password: hashedPassword },
      );

      if (userUpdate) return this.responses.successResponse(userUpdate);
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SettingsService.resetPasswordUsers',
      );
      return this.responses.errorResponse(error);
    }
  }
}
