import { CommonServices } from 'src/common/services/common.service';
/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ResponsesData } from 'src/common/library/response.data';
import { JwtTokenRepositoryInterface } from './interface/jwttoken.interface';
import { constants } from 'src/common/enum/constants.enum';
import { commonMessages } from 'src/common/library/commonmessages';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { RolePermissionRepositoryInterface } from 'src/Roles/interface/rolepermission.repository.interface';
import { Status } from 'src/common/enum/status.enum';
import { get } from 'http';
import { PermissionRepositoryInterface } from 'src/Roles/interface/permission.repository.interface';
import { ModuleRepositoryInterface } from 'src/Roles/interface/module.repository.interface';
import { use } from 'passport';
import { SocialLoginDto } from './dto/googlelogin.dto';
import { MergeAccountDtoDto } from './dto/mergeaccount.dto';
import { UserRepositoryInterface } from 'src/admin/user/interface/user.repository.interface';
import { UserOtpRepositoryInterface } from 'src/admin/user/interface/userotp.repository.interface';
import { UserData } from 'src/admin/user/library/user.data';
import { CreateUserDto } from 'src/admin/user/dto/create-user.dto';
import { ResendOtpDto } from 'src/admin/user/dto/resenotp.dto';
import { ReferalPointRepositoryInterface } from './interface/referalpoint.interface';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private responses: ResponsesData,
    private readonly logger: Logger,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('UserOtpRepositoryInterface')
    private readonly userOtpRepository: UserOtpRepositoryInterface,
    @Inject('JwtTokenRepositoryInterface')
    private readonly jwtTokenRepository: JwtTokenRepositoryInterface,
    private commonService: CommonServices,
    private userData: UserData,
    @Inject('RolePermissionRepositoryInterface')
    private readonly rolePermissionRepository: RolePermissionRepositoryInterface,
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
    @Inject('ModuleRepositoryInterface')
    private readonly moduleRepository: ModuleRepositoryInterface,
    @Inject('ReferalPointRepositoryInterface')
    private readonly referalPointRepository: ReferalPointRepositoryInterface,
    private mailService: MailService,
  ) {}
  async registerUser(createDto: CreateUserDto, merchant: Request) {
    const {
      first_name,
      last_name,
      email,
      country_code,
      phone_number,
      password,
      user_role,
      referal_code,
    } = createDto;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const mobile = await this.userRepository.findByCondition({
        phone_number: phone_number,
      });
      const emailId = await this.userRepository.findByCondition({
        email: email,
      });

      if (mobile.length > 0) {
        return this.responses.errorResponse(
          'You are already done with this email/phone number.Please verify otp and complete your registration process',
          {
            user_id: mobile[0].id,
            otp_verified: mobile[0].otp_verified,
          },
        );
      }
      if (emailId.length > 0) {
        return this.responses.errorResponse('Email already Registered', {
          user_id: emailId[0].id,
          otp_verified: emailId[0].otp_verified,
        });
      }
      let referal: any;
      let referal_id = 0;

      if (referal_code) {
        referal = await this.userRepository.findByCondition({
          referal_code: referal_code,
          status: Status.Active,
          delete_status: 0,
        });
        if (referal.length < 1)
          return this.responses.errorResponse('Invalid referal code');
        referal_id = referal[0].id;
      }
      const getReferalCode = await this.commonService.getReferalCode();
      const getMerchantUnAuth = await this.commonService.getMerchantIdUnAuth(
        merchant.headers['x-merchant-id'],
      );
      const userData = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        country_code: country_code,
        phone_number: phone_number,
        password: hashedPassword,
        status: 1,
        user_role: UserRole.USER,
        referal_code: getReferalCode,
        merchant_id: getMerchantUnAuth,
        referal_id: referal_id,
      };
      const user = await this.userRepository.save(userData);
      if (user) {
        const otp = await this.commonService.generateOtp();
        const userOtp = await this.userOtpRepository.save({
          user_id: (await user).id,
          otp,
        });
        if (referal_code) {
          const saveReferal = await this.referalPointRepository.save({
            user_id: referal[0].id,
            points: 5, //need to taken from settings table
          });
        }
        const responseData = await this.userData.registrationResponse(
          user,
          otp,
        );
        return this.responses.successResponse(responseData);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.registerUser');
      return this.responses.errorResponse(error);
    }
  }
  async signIn(country_code: string, mobile: string, merchant: any) {
    try {
      const user = await this.userRepository.findByCondition({
        country_code: country_code,
        phone_number: mobile,
      });
      if (user.length < 1 || user[0].delete_status) {
        return this.responses.errorResponse('Unauthorized');
      }

      if (!user[0].otp_verified) {
        return {
          status: false,
          message: 'Please verify otp',
          data: {
            access_token: '',
            refresh_token: '',
            user_id: user[0].id,
            is_otp_verified: user[0].otp_verified,
          },
        };
      }

      const token = await this.getTokens(
        user[0].id,
        user[0].phone_number,
        user[0].user_role,
        merchant[0].merchant_key,
        merchant[0].merchant_secret,
      );
      await this.addJwtData(token, user[0].id, user[0].user_role);

      const getPermissions =
        await this.rolePermissionRepository.findByCondition({
          roleId: user[0].user_role,
          hasPermission: true,
          status: Status.Active,
        });
      const permisionResult =
        getPermissions.length > 0
          ? getPermissions.map(async (permission) => {
              const perm_name = await this.permissionRepository.findByCondition(
                { id: permission.permissionId },
              );
              const module_name =
                perm_name.length > 0
                  ? await this.moduleRepository.findByCondition({
                      id: perm_name[0].moduleId,
                    })
                  : [];

              const datam = {
                module: module_name[0].title,
                permission: perm_name[0].permissionName,
              };
              return datam;
            })
          : [];
      const permResult = await Promise.all(permisionResult);
      const groupedData =
        permResult.length > 0
          ? permResult.reduce((acc, item) => {
              const { module, ...rest } = item;
              const otherValues = Object.values(rest).join(', ');
              if (!acc[module]) {
                acc[module] = [otherValues];
              } else {
                acc[module].push(otherValues);
              }
              return acc;
            }, {})
          : [];
      return {
        status: true,
        message: 'Success',
        data: {
          access_token: token.accessToken,
          refresh_token: token.refreshToken,
          user_id: user[0].id,
          is_otp_verified: user[0].otp_verified,
          permissions: groupedData,
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.signIn');
      return this.responses.errorResponse(error);
    }
  }
  // async adminSignIn(email: string, password: string) {
  //   try {
  //     const user = await this.userRepository.findByCondition({
  //       email: email,
  //     });
  //     if (user.length < 1 || user[0].delete_status) {
  //       return this.responses.errorResponse(
  //         'No user is present with this credetials',
  //       );
  //     }
  //     if (!(await bcrypt.compare(password.toString(), user[0].password))) {
  //       return this.responses.errorResponse('Invalid email or password');
  //     }
  //     if (user[0].user_role === UserRole.USER)
  //       throw new UnauthorizedException();
  //     const token = await this.getTokens(user[0].id, user[0].phone_number);
  //     await this.addJwtData(token, user[0].id, user[0].user_role);
  //     const getPermissions = await this.permissionRepository.findByCondition({
  //       status: Status.Active,
  //     });
  //     let groupedData: any;
  //     if (user[0].user_role === UserRole.SUPERADMIN) {
  //       const permisionResult =
  //         getPermissions.length > 0
  //           ? getPermissions.map(async (permission) => {
  //               const module_name = await this.moduleRepository.findByCondition(
  //                 {
  //                   id: permission.moduleId,
  //                 },
  //               );

  //               const datam = {
  //                 module: module_name[0].title,
  //                 permission: permission.permissionName,
  //               };
  //               return datam;
  //             })
  //           : [];
  //       const permResult = await Promise.all(permisionResult);
  //       groupedData =
  //         permResult.length > 0
  //           ? permResult.reduce((acc, item) => {
  //               const { module, ...rest } = item;
  //               const otherValues = Object.values(rest).join(', ');
  //               if (!acc[module]) {
  //                 acc[module] = [otherValues];
  //               } else {
  //                 acc[module].push(otherValues);
  //               }
  //               return acc;
  //             }, {})
  //           : [];
  //     } else {
  //       groupedData = await this.commonService.getPermissionsOfAdminRoles(
  //         user[0].user_role,
  //       );
  //     }

  //     return {
  //       status: true,
  //       message: 'Success',
  //       data: {
  //         access_token: token.accessToken,
  //         refresh_token: token.refreshToken,
  //         user_id: user[0].id,
  //         is_otp_verified: user[0].otp_verified,
  //         permissions: groupedData,
  //       },
  //     };
  //   } catch (error) {
  //     this.logger.error(error.message, error.stack, 'AuthService.signIn');
  //     return this.responses.errorResponse(error);
  //   }
  // }
  async userSignIn(
    email_or_phone: any,
    password: string,
    role_id: number,
    merchant: any,
  ) {
    try {
      let result: any;
      result = await this.userRepository.findByCondition({
        email: email_or_phone,
      });
      if (result.length < 1) {
        result = await this.userRepository.findByCondition({
          phone_number: email_or_phone,
        });
      }
      if (result.length < 1 || result[0].delete_status) {
        return this.responses.errorResponse(
          'No user is present with this credetials',
        );
      }
      console.log(result);
      if (!result[0].otp_verified) {
        return this.responses.errorResponse('Please verify otp', {
          user_id: result[0].id,
          otp_verified: result[0].otp_verified,
        });
      }
      if (!(await bcrypt.compare(password.toString(), result[0].password))) {
        return this.responses.errorResponse('Invalid email or password');
      }
      //check whether the api access the correct role
      if (result[0].user_role != role_id)
        return this.responses.errorResponse('Invalid login');
      // console.log(merchant.merchant, 'mm');
      const token = await this.getTokens(
        result[0].id,
        result[0].phone_number,
        result[0].user_role,
        merchant.merchant,
        merchant.merchant_secret,
      );
      await this.addJwtData(token, result[0].id, result[0].user_role);
      const getPermissions = await this.permissionRepository.findByCondition({
        status: Status.Active,
      });
      let groupedData: any;

      if (result[0].user_role === UserRole.SUPERADMIN || UserRole.USER) {
        const permisionResult =
          getPermissions.length > 0
            ? getPermissions.map(async (permission) => {
                const module_name = await this.moduleRepository.findByCondition(
                  {
                    id: permission.moduleId,
                  },
                );

                const datam = {
                  module: module_name[0].title,
                  permission: permission.permissionName,
                };
                return datam;
              })
            : [];
        const permResult = await Promise.all(permisionResult);
        groupedData =
          permResult.length > 0
            ? permResult.reduce((acc, item) => {
                const { module, ...rest } = item;
                const otherValues = Object.values(rest).join(', ');
                if (!acc[module]) {
                  acc[module] = [otherValues];
                } else {
                  acc[module].push(otherValues);
                }
                return acc;
              }, {})
            : [];
      } else {
        groupedData = await this.commonService.getPermissionsOfAdminRoles(
          result[0].user_role,
        );
      }

      return {
        status: true,
        message: 'Success',
        data: {
          access_token: token.accessToken,
          refresh_token: token.refreshToken,
          user_id: result[0].id,
          is_otp_verified: result[0].otp_verified,
          permissions: groupedData,
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.signIn');
      return this.responses.errorResponse(error);
    }
  }
  async googleLogin(data: SocialLoginDto) {
    try {
      /*       User checking, Validations and other logics of social 
  login and its impact supporting code are yet to be added */
      const isExistingUser = await this.userRepository.findByCondition({
        email: data.email,
      });
      if (isExistingUser[0] && isExistingUser[0].email === data.email) {
        // Existing user, proceed with login logic
        return this.responses.errorResponse(
          'Already have an account with this email. Do you want to merge these account?',
        );
      } else {
        const userData = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.mobile_number,
          password: '',
          device_token: data.device_token,
          device_type: data.device_type,
          social_profile_pic_url: data.google_profile_pic,
          is_social: true,
          is_google_login: true,
          google_token: data.google_token,
          user_role: data.role_id,
          otp_verified: true,
        };
        const saveData = await this.userRepository.save(userData);
        if (saveData) {
          const token = await this.getTokens(
            saveData.id,
            saveData.phone_number,
            saveData.user_role,
            'merchant',
            'secret',
          );
          await this.addJwtData(token, saveData.id, saveData.user_role);
          const groupedData =
            await this.commonService.getPermissionsOfAdminRoles(
              saveData.user_role,
            );
          return {
            status: true,
            message: 'Success',
            data: {
              access_token: token.accessToken,
              refresh_token: token.refreshToken,
              user_id: saveData.id,
              is_otp_verified: saveData.otp_verified,
              permissions: groupedData,
            },
          };
        }
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.googleLogin');
      return this.responses.errorResponse(error);
    }
  }
  async mergeAccount(data: MergeAccountDtoDto) {
    const isExistingUser = await this.userRepository.findByCondition({
      email: data.email,
    });
    if (isExistingUser.length < 1)
      return this.responses.errorResponse('No user found');

    if (isExistingUser[0] && isExistingUser[0].email != data.email) {
      // Existing user, proceed with login logic
      return this.responses.errorResponse('Not same user');
    }
    const userUpdate = await this.userRepository.findAndUpdate(
      { id: isExistingUser[0].id },
      {
        device_token: data.device_token,
        device_type: data.device_type,
        google_token: data.google_token,
      },
    );
    if (userUpdate) {
      const token = await this.getTokens(
        isExistingUser[0].id,
        isExistingUser[0].phone_number,
        isExistingUser[0].user_role,
        'merchant',
        'secret',
      );
      await this.addJwtData(
        token,
        isExistingUser[0].id,
        isExistingUser[0].user_role,
      );
      const groupedData = await this.commonService.getPermissionsOfAdminRoles(
        isExistingUser[0].user_role,
      );
      return {
        status: true,
        message: 'Success',
        data: {
          access_token: token.accessToken,
          refresh_token: token.refreshToken,
          user_id: isExistingUser[0].id,
          is_otp_verified: isExistingUser[0].otp_verified,
          permissions: groupedData,
        },
      };
    }
  }
  async getTokens(
    user_id: number,
    phone_number: string,
    role_id: number,
    merchant: any,
    merchant_secret: any,
  ) {
    try {
      const payload = {
        user_id,
        phone_number,
        role_id,
        merchant: JSON.stringify(merchant),
        merchant_scret: JSON.stringify(merchant_secret),
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: `${process.env.JWT_SECRET}`,
          expiresIn: `${constants.JWT_EXPIRY}h`,
        }),
        this.jwtService.signAsync(payload, {
          secret: `${process.env.JWT_REFRESH_SECRET}`,
          expiresIn: `${constants.JWT_REFRESH_EXPIRY}d`,
        }),
      ]);
      const accessTokenExpiry = new Date();
      accessTokenExpiry.setHours(
        accessTokenExpiry.getHours() + constants.JWT_EXPIRY,
      );

      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(
        refreshTokenExpiry.getDate() + constants.JWT_REFRESH_EXPIRY,
      );
      return {
        accessToken,
        refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.getTokens');
      throw error;
    }
  }

  async addJwtData(
    token: {
      accessToken: string;
      accessTokenExpiry: Date;
      refreshToken: string;
      refreshTokenExpiry: Date;
    },
    user_id: number,
    user_role: number,
  ) {
    try {
      const jwtData = {
        user_id: user_id,
        name: 'JWT ACCESS TOKEN',
        type: 'api',
        access_token: token.accessToken,
        access_token_expiry: token.accessTokenExpiry,
        refresh_token: token.refreshToken,
        refresh_token_expiry: token.refreshTokenExpiry,
        user_role: user_role,
      };
      await this.jwtTokenRepository.save(jwtData);
      return true;
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.addJwtData');
      throw error;
    }
  }

  async refresh(userId: number, refreshToken: string, merchant: any) {
    try {
      const jwtEntry = await this.jwtTokenRepository.findByCondition({
        user_id: userId,
        refresh_token: refreshToken,
      });
      if (jwtEntry.length < 1) {
        throw new ForbiddenException('Access Denied');
      }
      const user = await this.userRepository.findOneById(userId);
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: `${process.env.JWT_REFRESH_SECRET}`,
      });

      if (!payload) {
        throw new ForbiddenException('Access Denied');
      }
      const token = await this.getTokens(
        userId,
        payload.email,
        payload.role_id,
        merchant.merchant,
        merchant.merchant_scret,
      );
      return {
        status: true,
        message: 'Success',
        data: {
          access_token: token.accessToken,
          refresh_token: token.refreshToken,
          user_id: userId,
        },
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthService.refresh');
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const result = await this.userRepository.findByConditionWithSelect(
        {
          email: email,
          status: 1,
          delete_status: 0,
        },
        ['id'],
      );

      if (!result) {
        return this.responses.errorResponse(commonMessages.DataNotFound);
      }
      // Generate OTP
      const otp = await this.commonService.generateOtp();
      const data = {
        user_id: result[0].id,
        otp,
        otp_type: 1,
      };
      const userOtp = await this.userOtpRepository.save(data);
      if (!userOtp) {
        return this.responses.errorResponse(commonMessages.dataNotSave);
      }

      return this.responses.successResponse({
        otp: otp,
        user_id: result[0].id,
      });
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'AuthService.forgotPassword',
      );
      throw error;
    }
  }
  //forgot password
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    if (
      await this.commonService.verifyOtpService(
        verifyOtpDto.user_id,
        verifyOtpDto.otp,
        1,
      )
    ) {
      return this.responses.successResponse(
        {},
        '4 Digit code verified successfully',
      );
    }
    return this.responses.errorResponse('Incorrect 4 Digit Code');
  }
  async resendOtp({ user_id }: ResendOtpDto) {
    const user = await this.userRepository.findOneById(user_id);
    if (!user) {
      throw new NotFoundException('Not found');
    }
    const otp = await this.commonService.generateOtp();
    const userOtp = await this.userOtpRepository.findAndUpdate(
      { user_id: user_id },
      { otp },
    );
    return this.responses.successResponse(otp);
  }
  async OtpVerifyForgotPassword(user_id: number, password: string) {
    try {
      const result = await this.userRepository.findByConditionWithSelect(
        {
          id: user_id,
          status: 1,
          delete_status: 0,
        },
        ['id'],
      );
      if (!result || result.length == 0) {
        return this.responses.errorResponse(commonMessages.DataNotFound);
      }

      const hashedPassword = await bcrypt.hash(password.toString(), 10);

      const userUpdate = await this.userRepository.findAndUpdate(
        { id: result[0].id },
        { password: hashedPassword },
      );

      return this.responses.successResponse({});
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'AuthService.OtpVerifyForgotPassword',
      );
      throw error;
    }
  }
}
