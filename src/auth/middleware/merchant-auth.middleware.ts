// merchant-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MerchantServices } from 'src/common/services/merchant.service';

@Injectable()
export class MerchantAuthMiddleware implements NestMiddleware {
  constructor(private readonly merchantService: MerchantServices) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const merchantKey = req.headers['x-merchant-id']; // Extract merchant key from headers
    const merchantSecretKey = req.headers['x-merchant-secretkey']; // Extract merchant key from headers

    if (!merchantKey || !merchantSecretKey) {
      return res
        .status(401)
        .json({ status: 401, message: 'Please provide the merchant key' });
    }

    const merchant = await this.merchantService.validateMerchantKey(
      merchantKey,
      merchantSecretKey,
    );
    if (!merchant) {
      return res
        .status(400)
        .json({ status: 400, message: 'Invalid Merchant ID' });
    }

    // Attach merchant details to the request for downstream use
    req['merchant'] = merchant;
    req['merchant_secret'] = merchantSecretKey;

    next();
  }
}
