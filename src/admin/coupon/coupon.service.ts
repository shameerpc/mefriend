import { IsNotEmpty } from 'class-validator';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponsesData } from 'src/common/library/response.data';

import { Multer } from 'multer';
import * as fs from 'fs';
import { ILike } from 'typeorm';
import slugify from 'slugify';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { promisify } from 'util';
import { DeleteCouponDto } from './dto/deleteCoupon.dto';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { CouponRepositoryInterface } from './interface/coupon.repository.interface';
import { UpdateCouponDto } from './dto/updateCoupon.dto';
import { GetCouponDto } from './dto/getCoupon.dto';
import { GetAllCouponDto } from './dto/getAllCoupon.dto';
import * as randomstring from 'randomstring';
import { CouponResponseData } from './response/coupon-response';

@Injectable()
export class CouponService {
  constructor(
    @Inject('CouponRepositoryInterface')
    private readonly couponRepository: CouponRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private couponResponseData: CouponResponseData,
  ) {}

  async createCoupon(createCouponDto: CreateCouponDto, request): Promise<any> {
    const {
      coupon_name,
      discount_value,
      discount_type,
      minimum_discount_value,
      coupon_code_duration_from,
      coupon_code_duration_to,
      minimum_coupon_redeem_count,
    } = createCouponDto;
    try {
      const isTitleExist = await this.couponRepository.findByCondition({
        coupon_name: coupon_name,
      });

      if (isTitleExist.length > 0)
        return this.responses.errorResponse('Coupon already exists');
      if (coupon_code_duration_from && coupon_code_duration_to) {
        if (coupon_code_duration_from > coupon_code_duration_to)
          return this.responses.errorResponse(
            'Coupon code duration from can not be greater than Coupon code duration to',
          );
      }
      if (discount_value && minimum_discount_value) {
        if (discount_value > minimum_discount_value)
          return this.responses.errorResponse(
            'Discount value can not be greater than minimum discount value',
          );
      }
      const coupon = {
        coupon_name: coupon_name,
        coupon_code: this.generateCouponCode(6),
        discount_type: discount_type,
        discount_value: discount_value,
        minimum_discount_value: minimum_discount_value,
        coupon_code_duration_from: coupon_code_duration_from,
        coupon_code_duration_to: coupon_code_duration_to,
        minimum_coupon_redeem_count: minimum_coupon_redeem_count,
        created_by: request.user.user_id,
        status: 1,
      };
      const data = await this.couponRepository.save(coupon);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CouponService.createCoupon',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllCoupon({ search, page, limit }: GetAllCouponDto, request) {
    try {
      const queryCondition = search
        ? { coupon_name: ILike(`%${search}%`) }
        : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];

      const data =
        await this.couponRepository.findByConditionWithPaginationAndJoin(
          queryCondition,
          offset,
          lmt,
          null,
          relations,
        );
      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = this.couponResponseData.getAllResponse(
          data.data,
          request.user.role_id,
        );

        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CouponService.findAllCoupon',
      );
      throw error;
    }
  }
  async findCouponById({ coupon_id }: GetCouponDto, request) {
    try {
      const relations: string[] = ['users'];

      const queryCondition = coupon_id ? { id: coupon_id } : {};
      const data = await this.couponRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data) {
        const result = this.couponResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Location not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CouponService.findCouponById',
      );
      throw error;
    }
  }

  async updateCoupon(UpdateCouponDto: UpdateCouponDto, request): Promise<any> {
    try {
      const {
        coupon_id,
        coupon_name,
        discount_value,
        discount_type,
        minimum_discount_value,
        coupon_code_duration_from,
        coupon_code_duration_to,
        minimum_coupon_redeem_count,
      } = UpdateCouponDto;
      const isTitleExist = await this.couponRepository.findByCondition({
        coupon_name: coupon_name,
      });

      if (isTitleExist.length > 0)
        if (isTitleExist[0].id !== coupon_id)
          return this.responses.errorResponse('Coupon already exists');
      if (coupon_code_duration_from && coupon_code_duration_to) {
        if (coupon_code_duration_from > coupon_code_duration_to)
          return this.responses.errorResponse(
            'Coupon code duration from can not be greater than Coupon code duration to',
          );
      }
      if (discount_value && minimum_discount_value) {
        if (discount_value > minimum_discount_value)
          return this.responses.errorResponse(
            'Discount value can not be greater than minimum discount value',
          );
      }
      const coupon_exist = await this.couponRepository.findByCondition({
        id: coupon_id,
      });
      if (coupon_exist.length < 1) {
        return this.responses.errorResponse('Coupon not found');
      }

      const couponData = {
        coupon_name: coupon_name,
        coupon_code: this.generateCouponCode(4),
        discount_type: discount_type,
        discount_value: discount_value,
        minimum_discount_value: minimum_discount_value,
        coupon_code_duration_from: coupon_code_duration_from,
        coupon_code_duration_to: coupon_code_duration_to,
        minimum_coupon_redeem_count: minimum_coupon_redeem_count,
        created_by: request.user.user_id,
        status: 1,
      };

      const updatedCoupon = await this.couponRepository.update(
        coupon_id,
        couponData,
      );
      if (updatedCoupon.affected > 0) {
        return this.responses.successResponse(couponData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'CouponService.updateCoupon',
      );
      throw error;
    }
  }

  async deleteCoupon({ coupon_ids }: DeleteCouponDto) {
    try {
      const deletedPageResults = [];
      const checkExist = await this.commonServices.checkIdsExist(
        coupon_ids,
        this.couponRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse(
          'please ensure that the current statuses of the given coupons are active.',
        );
      for (const couponId of coupon_ids) {
        const isExist = await this.couponRepository.findOneById(couponId);

        if (!isExist) {
          return this.responses.errorResponse('Coupon not found');
        }

        const deleteResult = await this.couponRepository.delete(couponId);
        if (deleteResult) {
          try {
            deletedPageResults.push({
              id: couponId,
              status: true,
              message: 'Coupon deleted successfully',
            });
          } catch (error) {
            this.logger.error(
              error.message,
              error.stack,
              'PagesService.deleteCoupon',
            );
            throw error;
          }
        } else {
          deletedPageResults.push({
            id: couponId,
            status: false,
            message: 'Deletion failed',
          });
        }
      }

      const allDeletedSuccessfully = deletedPageResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Coupon deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'PagesService.deleteCoupon',
      );
      throw error;
    }
  }

  generateCouponCode(length: number): string {
    const couponCode = randomstring.generate({
      length: length,
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    });
    return 'ME' + couponCode;
  }
}
