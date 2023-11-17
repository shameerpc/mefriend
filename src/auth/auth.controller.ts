/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Request
} from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { updatePasswordDto } from './dto/updatePassword.dto';
import { VerifyOtpDto } from './dto/verifyotp.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AdminSignInDto } from './dto/adminsignin.dto';
import { UserSignInDto } from './dto/usersignin.dto';
import { SocialLoginDto } from './dto/googlelogin.dto';
import { MergeAccountDtoDto } from './dto/mergeaccount.dto';
import { RequiredHeaders } from './custom-header.decorator';
import { UsersService } from 'src/admin/user/users.service';
import { CreateUserDto } from 'src/admin/user/dto/create-user.dto';
import { ResendOtpDto } from 'src/admin/user/dto/resenotp.dto';

@ApiTags('Registration and Authentication')
@Controller('auth/')
@RequiredHeaders('x-merchant-id')
@ApiHeader({ name: 'x-merchant-id' })
@RequiredHeaders('x-merchant-secretkey')
@ApiHeader({ name: 'x-merchant-secretkey' })
export class AuthController {
  private ResponsesData: ResponsesData;
  constructor(
    private AuthService: AuthService,
    private UsersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(200)
  create(@Req() merchant: Request, @Body() post: CreateUserDto): Promise<any> {
    return this.AuthService.registerUser(post, merchant);
  }
  @Post('verify-otp') //for registration
  @HttpCode(200)
  async verifyOtp(
    @Req() merchant: Request,
    @Body() verifyOtpDto: VerifyOtpDto,
  ) {
    return await this.UsersService.verifyOtp(verifyOtpDto, merchant);
  }

  @Post('resend-otp')
  @HttpCode(200)
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return await this.AuthService.resendOtp(resendOtpDto);
  }
  @Post('sign-in-with-otp')
  @HttpCode(200)
  async signIn(@Req() merchant, @Body() signInDto: SignInDto) {
    return this.AuthService.signIn(
      signInDto.country_code,
      signInDto.phone_number,
      merchant,
    );
  }

  @Post('login')
  @HttpCode(200)
  async userSignIn(@Req() merchant, @Body() userSignInDto: UserSignInDto) {
    return this.AuthService.userSignIn(
      userSignInDto.email_or_phone,
      userSignInDto.password,
      userSignInDto.role_id,
      merchant,
    );
  }
  @Post('google-login')
  @HttpCode(200)
  async googleLogin(@Body() data: SocialLoginDto) {
    try {
      return this.AuthService.googleLogin(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('merge-account')
  @HttpCode(200)
  async mergeAccount(@Body() data: MergeAccountDtoDto) {
    try {
      return this.AuthService.mergeAccount(data);
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() merchant, @Body() refreshDto: RefreshDto) {
    return this.AuthService.refresh(
      refreshDto.user_id,
      refreshDto.refresh_token,
      merchant,
    );
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
    try {
      /* verify account is active and email is exist or not */
      return await this.AuthService.forgotPassword(
        ForgotPasswordDto.email,
      );
    } catch (error) {
      if (process.env.NODE_ENV == 'development') {
        return { status: false, error: error };
      } else {
        return { status: false, error: error };
      }
    }
  }

  @Post('update-password')
  @HttpCode(200)
  async OtpVerifyAndUpdatePassword(
    @Body() updatePasswordDto: updatePasswordDto,
  ) {
    try {
      /* verify account is active and email is exsist or not */
      return await this.AuthService.OtpVerifyForgotPassword(
        updatePasswordDto.user_id,
        updatePasswordDto.password,
      );
    } catch (error) {
      if (process.env.NODE_ENV == 'development') {
        return { status: false, error: error };
      } else {
        return { status: false, error: error };
      }
    }
  }

  @Post('forgot-password/verify-otp')
  @HttpCode(200)
  async verifyOto(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      return this.AuthService.verifyOtp(verifyOtpDto);
    } catch (error) {
      throw error;
    }
  }
}
