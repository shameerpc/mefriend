import { Inject, Injectable, Logger } from '@nestjs/common';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { Status } from '../enum/status.enum';
import { escape } from 'querystring';
import { constants } from 'src/common/enum/constants.enum';

@Injectable()
export class MerchantServices {
  constructor(
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
  ) {}
  async validateMerchantKey(key: any, merchantSecretKey: any) {
    // console.log(key, merchantSecretKey, 'mm');

    const isValid = await this.merchantRepository.findByCondition({
      merchant_key: key,
      secret_key: merchantSecretKey,
      status: Status.Active,
      delete_status: 0,
    });
    // console.log(isValid, 'merch');
    if (isValid.length > 0) {
      // console.log(1, 'm');
      const expiryDate = isValid[0].expiry_date;
      const currentDate = new Date();
      if (key != constants.SUPERADMIN_MERCHANT_KEY) {
        // console.log(2, 'm');

        if (currentDate > expiryDate) {
          // The token has expired
          // console.log(3, 'm');

          return null;
        }
        return isValid[0].merchant_key;
      }
      return isValid[0].merchant_key;
    } else return null;
  }
}
