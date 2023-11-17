import { Inject, Injectable, Logger } from '@nestjs/common';
import { MerchantRepositoryInterface } from 'src/auth/interface/merchant.interface';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { AddMerchantKeyDto } from './dto/addmerchantkey.dto';
import { Status } from 'src/common/enum/status.enum';
import { CommonServices } from 'src/common/services/common.service';
import { GetMerchantKeyDto } from './dto/getmerchantkey.dto';
import { GetMerchantKeyByIdDto } from './dto/getmerchantkeybyid.dto';
import { DeleteMerchantKeyDto } from './dto/deletemerchantkey.dto';
const crypto = require('crypto');
import { JwtService } from '@nestjs/jwt';
import { Not } from 'typeorm';
import { RegenerateMerchantKeyDto } from './dto/regeneratemerchantkey.dto';
import { constants } from 'src/common/enum/constants.enum';
@Injectable()
export class MerchantKeyServices {
  constructor(
    @Inject('MerchantRepositoryInterface')
    private readonly merchantRepository: MerchantRepositoryInterface,
    private readonly logger: Logger,
    private readonly commonValidation: CommonValidation,
    private readonly responses: ResponsesData,
    private readonly commonServices: CommonServices,
    private commonService: CommonServices,
    private readonly jwtService: JwtService,
  ) {}
  async addMerchantKey({
    user_id,
    name,
    merchant_id,
    status,
  }: AddMerchantKeyDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      if (merchant_id) {
        const isExist = await this.merchantRepository.findByCondition({
          name: name,
          status: Status.Active,
          delete_status: 0,
          id: Not(merchant_id),
        });
        if (isExist.length > 0)
          return this.responses.errorResponse('Already Exist');
        const updateData = await this.merchantRepository.update(merchant_id, {
          name: name,
        });
        if (updateData) return this.responses.successResponse(updateData);
        return this.responses.errorResponse('Something went wrong');
      }
      const isExist = await this.merchantRepository.findByCondition({
        name: name,
        status: Status.Active,
        delete_status: 0,
      });
      if (isExist.length > 0)
        return this.responses.errorResponse('Already Exist');

      const lastAddedkey = await this.merchantRepository.findByConditionithSort(
        {
          delete_status: 0,
        },
        'id: desc',
      );
      const lastObject = lastAddedkey[lastAddedkey.length - 1];
      const randomKey = await this.commonService.uniqueMerchantKey(
        lastObject.merchant_key,
      );

      const getSecret = await this.commonService.getSecretKey();

      const datam = {
        merchant_key: randomKey,
        name: name,
        secret_key: getSecret.secretKey,
        expiry_date: getSecret.expiry,
        status: status,
      };
      const saveKey = await this.merchantRepository.save(datam);
      if (saveKey) return this.responses.successResponse(saveKey);
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'RoleService.addRole');
      throw error;
    }
  }
  async getMerchantKey({ user_id, page, limit }: GetMerchantKeyDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      if (Number(page) === 0) page = 1;
      const offset = page ? page : 1;
      const actualLimit = limit ? Number(limit) : 10;
      const data = await this.merchantRepository.findByConditionWithPagination(
        {
          status: Status.Active,
        },
        offset,
        actualLimit,
      );
      const datam =
        data.data.length > 0
          ? data.data.map(async (merchant: any) => {
              const data = {
                id: merchant.id,
                name: merchant.name,
                key: merchant.merchant_key,
                status_id: merchant.status,
                status: merchant.status == 1 ? 'Active' : 'Inactive',
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
          result: await Promise.all(datam),
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'MerchantService.getMerchantKeys',
      );
      return this.responses.errorResponse(error);
    }
  }
  async getMerchantKeyById({ user_id, merchant_id }: GetMerchantKeyByIdDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const data = await this.merchantRepository.findByCondition({
        id: merchant_id,
        status: Status.Active,
      });
      if (data.length < 1)
        return this.responses.errorResponse('Not data found');
      const datam = {
        id: data[0].id,
        name: data[0].name,
        key: data[0].merchant_key,
        status: data[0].status,
      };

      if (datam) {
        return this.responses.successResponse(datam);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'MerchantService.getMerchantKeyById',
      );
      return this.responses.errorResponse(error);
    }
  }
  async deleteMerchantKey({ user_id, merchant_ids }: DeleteMerchantKeyDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        merchant_ids,
        this.merchantRepository,
      );

      if (!checkExist)
        return this.responses.errorResponse(
          'Please ensure that the current statuses of the given faq are active.',
        );
      const results = [];
      const delresults = [];

      for (const merchant_id of merchant_ids) {
        const isExist = await this.merchantRepository.findOneById(merchant_id);
        if (!isExist)
          results.push({
            id: merchant_id,
            status: false,
            message: 'Deletion Failed',
          });

        const deleteResult = await this.merchantRepository.delete(merchant_id);
        if (deleteResult) {
          results.push({
            id: merchant_id,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: merchant_id,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      const allDeletedSuccessfully = delresults.every(
        (result) => result.success,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Merchant key deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'MerchantService.deleteMerchant',
      );
      throw error;
    }
  }

  async generateMerchantKey(merchantId: string) {
    const payload = {
      merchantId,
      expiresIn: '30d', // Expiration time of 1 hour
    };

    return this.jwtService.sign(payload);
  }
  async regenerateMerchantKey({
    user_id,
    merchant_id,
  }: RegenerateMerchantKeyDto) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const getData = await this.merchantRepository.findByCondition({
        id: merchant_id,
      });
      const getSecret = await this.commonService.getSecretKey();
      const updateData = await this.merchantRepository.update(merchant_id, {
        secret_key: getSecret.secretKey,
        expiry_date: getSecret.expiry,
      });
      if (updateData) return this.responses.successResponse(updateData);
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
}
