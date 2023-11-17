/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtTokenRepositoryInterface } from './interface/jwttoken.interface';
import { MerchantRepositoryInterface } from './interface/merchant.interface';
import { Status } from 'src/common/enum/status.enum';
import { UserRole } from 'src/common/enum/user-role.enum';

@Injectable()
export class CustomAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject('JwtTokenRepositoryInterface')
    private readonly jwtTokenRepository: JwtTokenRepositoryInterface,
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        return true;
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: `${process.env.JWT_SECRET}`,
        });

        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
        const jwtEntry = await this.jwtTokenRepository.findByCondition({
          user_id: payload.user_id,
          access_token: token,
        });
        const actualMerchantKey = await this.merchantRepository.findByCondition(
          {
            merchant_key: JSON.parse(payload.merchant),
            delete_status: 0,
            status: Status.Active,
          },
        );
        // console.log(actualMerchantKey);
        if (!payload.merchant || actualMerchantKey.length < 1) {
          throw new ForbiddenException('Access Denied');
        }

        if (payload.user_id != 1) {
          const expiryDate = new Date(actualMerchantKey[0].expiry_date);
          const currentDate = new Date();
          // console.log(currentDate, expiryDate);
          if (currentDate > expiryDate) {
            // The token has expired
            throw new ForbiddenException('Marchant key expired');
          }
        }
        if (
          request.body.length > 0 &&
          request.body.user_id != payload.user_id
        ) {
          //check if the loggedin user access the api
          throw new ForbiddenException('Access Denied');
        }
        if (
          request.user.length > 0 &&
          request.user.user_id != payload.user_id
        ) {
          throw new ForbiddenException('Access Denied');
        }
        if (jwtEntry.length < 1) {
          throw new ForbiddenException('Access Denied');
        }
      } catch (error) {
        throw new UnauthorizedException(error);
      }
      return true;
    } catch (error) {
      this.logger.error(error.message, error.stack, 'AuthGuard.canActivate');
      throw error;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
