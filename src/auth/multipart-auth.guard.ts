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

@Injectable()
export class MultipartAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject('JwtTokenRepositoryInterface')
    private readonly jwtTokenRepository: JwtTokenRepositoryInterface,
    private readonly logger: Logger,
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
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
        //check if the loggedin user access the api
        //   if (request.body.user_id != payload.user_id) {
        //     throw new ForbiddenException('Access Denied');
        //   }
        if (jwtEntry.length < 1) {
          throw new ForbiddenException('Access Denied');
        }
        const actualMerchantKey = await this.merchantRepository.findByCondition(
          {
            merchant_key: JSON.parse(payload.merchant),
            delete_status: 0,
            status: Status.Active,
          },
        );
        if (!payload.merchant || actualMerchantKey.length < 1)
          throw new ForbiddenException('Access Denied');

        if (payload.user_id != 1) {
          const expiryDate = new Date(actualMerchantKey[0].expiry_date);
          const currentDate = new Date();
          // console.log(currentDate, expiryDate);
          if (currentDate > expiryDate) {
            // The token has expired
            throw new ForbiddenException('Merchant key expired');
          }
        }
      } catch (error) {
        throw new UnauthorizedException();
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
