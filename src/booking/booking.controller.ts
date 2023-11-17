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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createbooking.dto';
import { GetBookingDto } from './dto/getbooking.dto';
import { GetBookingByIdDto } from './dto/getbookingbyid.dto';
import { CancelBookingDto } from './dto/cancelbooking.dto';
import { UpdateBookingDto } from './dto/updatebooking.dto';
import { GetBookingHistoryDto } from './dto/getbookinghistory.dto';
import { CancelBookingByIdDto } from './dto/cancelBookingByIdDto.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
// @UseGuards(PermissionsGuard)
@Controller()
export class bookingController {
  constructor(private bookingService: BookingService) {}

  @Post('/create-booking')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-booking'])
  async create(
    @Request() request,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<any> {
    return this.bookingService.createBooking(createBookingDto, request);
  }

  @Post('/get-booking')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-booking'])
  async getBooking(
    @Request() request,
    @Body() getBookingDto: GetBookingDto,
  ): Promise<any> {
    return this.bookingService.getBooking(getBookingDto, request);
  }

  @Post('/get-booking-by-id')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-booking'])
  async getBookingById(
    @Request() request,
    @Body() getBookingByIdDto: GetBookingByIdDto,
  ): Promise<any> {
    return this.bookingService.getBookingById(getBookingByIdDto, request);
  }

  @Post('/update-booking')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-booking'])
  async updateBooking(
    @Request() request,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<any> {
    return this.bookingService.updateBooking(updateBookingDto, request);
  }

  @Post('/get-booking-history')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-booking'])
  async getBookingHistory(
    @Request() request,
    @Body() getBookingHistoryDto: GetBookingHistoryDto,
  ): Promise<any> {
    return this.bookingService.getBookingHistory(getBookingHistoryDto, request);
  }
  @Post('/cancel-booking')
  @HttpCode(200)
  @SetMetadata('permissions', ['cancel-booking'])
  async cancelBooking(
    @Request() request,
    @Body() cancelBookingByIdDto: CancelBookingByIdDto,
  ): Promise<any> {
    return this.bookingService.cancelBooking(cancelBookingByIdDto, request);
  }
}
