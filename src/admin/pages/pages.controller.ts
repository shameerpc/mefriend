import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  Get,
  Query,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Request,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/createPage.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { DeletePageDto } from './dto/deletePage.dto';
import { GetPageDto } from './dto/getPage.dto';
import { GetAllPageDto } from './dto/getAllPage.dto';
import { UpdatePageDto } from './dto/updatePage.dto';
import { CustomAuthGuard } from 'src/auth/custom-auth.guard';
import { CustomPermissionsGuard } from 'src/auth/custom-permission.guard';

@ApiTags('Page Management')
@Controller()
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post('/admin/create-page')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  @UseGuards(MultipartPermissionsGuard)
  @HttpCode(200)
  @SetMetadata('permissions', ['write-page'])
  async create(
    @Request() request,
    @Body() createPageDto: CreatePageDto,
  ): Promise<any> {
    return this.pagesService.createPage(createPageDto, request);
  }

  @Post('/admin/get-page')
  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @UseGuards(CustomPermissionsGuard)
  @SetMetadata('permissions', ['read-page'])
  @HttpCode(200)
  async getAllPages(@Request() request, @Body() getAllPageDto: GetAllPageDto) {
    return this.pagesService.findAllPage(getAllPageDto, request);
  }

  @Get('/admin/get-page-by-id')
  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @UseGuards(CustomPermissionsGuard)
  @SetMetadata('permissions', ['read-page'])
  @HttpCode(200)
  async findPageById(@Request() request, @Query() getPageDto: GetPageDto) {
    return await this.pagesService.findPageById(getPageDto, request);
  }

  @Post('/admin/update-page')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  @UseGuards(MultipartPermissionsGuard)
  @SetMetadata('permissions', ['write-page'])
  @HttpCode(200)
  async updatePage(
    @Request() request,
    @Body() updatePageDto: UpdatePageDto,
  ): Promise<any> {
    return this.pagesService.updatePage(updatePageDto, request);
  }

  @Post('/admin/delete-page')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  @UseGuards(MultipartPermissionsGuard)
  @SetMetadata('permissions', ['delete-page'])
  @HttpCode(200)
  async deletePage(@Body() deletepageDto: DeletePageDto) {
    return await this.pagesService.deletePage(deletepageDto);
  }
}
