/* eslint-disable prettier/prettier */
import { Multer } from 'multer';
import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  UploadedFiles,
  Request,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';
import { CreateCouponDto } from './dto/createCoupon.dto';
import { CouponService } from './coupon.service';
import { GetAllCouponDto } from './dto/getAllCoupon.dto';
import { GetCouponDto } from './dto/getCoupon.dto';
import { UpdateCouponDto } from './dto/updateCoupon.dto';
import { DeleteCouponDto } from './dto/deleteCoupon.dto';
@ApiTags('Coupon Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
// @UseGuards(MultipartPermissionsGuard)
@Controller()
export class couponController {
  constructor(private couponService: CouponService) {}

  @Post('/create-coupon')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-coupon'])
  async create(
    @Request() request,
    @Body() createcouponDto: CreateCouponDto,
  ): Promise<any> {
    return this.couponService.createCoupon(createcouponDto, request);
  }

  @Post('/get-coupons')
  @SetMetadata('permissions', ['read-coupon'])
  @HttpCode(200)
  async getAllcoupon(
    @Request() request,
    @Body() getAllcouponDto: GetAllCouponDto,
  ) {
    return this.couponService.findAllCoupon(getAllcouponDto, request);
  }

  @Get('/get-coupon-by-id')
  @SetMetadata('permissions', ['read-coupon'])
  @HttpCode(200)
  async findcouponById(
    @Request() request,
    @Query() getcouponDto: GetCouponDto,
  ) {
    return await this.couponService.findCouponById(getcouponDto, request);
  }

  @Post('/update-coupon')
  @SetMetadata('permissions', ['write-coupon'])
  @HttpCode(200)
  async updateCoupon(
    @Request() request,
    @Body() updatecouponDto: UpdateCouponDto,
  ): Promise<any> {
    return this.couponService.updateCoupon(updatecouponDto, request);
  }

  @Post('/delete-coupon')
  @SetMetadata('permissions', ['delete-coupon'])
  @HttpCode(200)
  async deleteUser(@Body() deletecouponDto: DeleteCouponDto) {
    return await this.couponService.deleteCoupon(deletecouponDto);
  }
}
