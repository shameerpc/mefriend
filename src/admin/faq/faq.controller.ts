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
import { CreateFaqDto } from './dto/createFaq.dto';
import { FaqService } from './faq.service';
import { GetAllFaqDto } from './dto/getAllFaqs.dto';
import { GetFaqDto } from './dto/getFaq.dto';
import { UpdateFaqDto } from './dto/updateFaq.dto';
import { DeleteFaqDto } from './dto/deleteFaq.dto';
@ApiTags('Faq Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
@UseGuards(MultipartPermissionsGuard)
@Controller()
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Post('/create-faq')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-faq'])
  async create(
    @Request() request,
    @Body() createfaqDto: CreateFaqDto,
  ): Promise<any> {
    return this.faqService.createFaq(createfaqDto, request);
  }

  @Post('/get-faqs')
  @SetMetadata('permissions', ['read-faq'])
  @HttpCode(200)
  async getAllfaq(@Request() request, @Body() getAllfaqDto: GetAllFaqDto) {
    return this.faqService.findAllFaq(getAllfaqDto, request);
  }

  @Get('/get-faq-by-id')
  @SetMetadata('permissions', ['read-faq'])
  @HttpCode(200)
  async findfaqById(@Request() request, @Query() getfaqDto: GetFaqDto) {
    return await this.faqService.findFaqById(getfaqDto, request);
  }

  @Post('/update-faq')
  @SetMetadata('permissions', ['write-faq'])
  @HttpCode(200)
  async updateFaq(
    @Request() request,
    @Body() updatefaqDto: UpdateFaqDto,
  ): Promise<any> {
    return this.faqService.updateFaq(updatefaqDto, request);
  }

  @Post('/delete-faq')
  @SetMetadata('permissions', ['delete-faq'])
  @HttpCode(200)
  async deleteUser(@Body() deletefaqDto: DeleteFaqDto) {
    return await this.faqService.deleteFaq(deletefaqDto);
  }
}
