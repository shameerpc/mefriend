import { GetCategoryDto } from './dto/getCategory.dto';
/* eslint-disable prettier/prettier */
import { CategoryService } from './category.service';
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
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DeleteCategoryDto } from './dto/deleteCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { GetAllCategoryDto } from './dto/getAllCategory.dto';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';
@ApiTags('Category Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
// @UseGuards(MultipartPermissionsGuard)
@Controller()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/create-category')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @SetMetadata('permissions', ['write-category'])
  async create(
    @Body() createCategoryDto: CreateCategoryDto,

    @Request() request,
  ): Promise<any> {
    return this.categoryService.createCategory(createCategoryDto, request);
  }

  @Post('/get-categories')
  @SetMetadata('permissions', ['read-category'])
  @HttpCode(200)
  async getAllCategory(
    @Request() request,
    @Body() getAllCategoryDto: GetAllCategoryDto,
  ) {
    return this.categoryService.findAllCategory(getAllCategoryDto, request);
  }

  @Get('/get-category-by-id')
  @SetMetadata('permissions', ['read-category'])
  @HttpCode(200)
  async findCategoryById(
    @Request() request,
    @Query() getCategoryDto: GetCategoryDto,
  ) {
    return await this.categoryService.findCategoryById(getCategoryDto, request);
  }

  @Post('/update-category')
  @SetMetadata('permissions', ['write-category'])
  @HttpCode(200)
  async updateCategory(
    @Request() request,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<any> {
    return this.categoryService.updateCategory(updateCategoryDto, request);
  }

  @Post('/delete-category')
  @SetMetadata('permissions', ['delete-category'])
  @HttpCode(200)
  async deleteUser(@Body() deleteCategoryDto: DeleteCategoryDto) {
    return await this.categoryService.deleteCategory(deleteCategoryDto);
  }
}
