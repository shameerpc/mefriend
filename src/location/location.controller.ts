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
import { CreateLocationDto } from './dto/createLocation.dto';
import { LocationService } from './location.service';
import { GetAllLocationDto } from './dto/getAllLocations.dto';
import { GetLocationDto } from './dto/getLocation.dto';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { DeleteLocationDto } from './dto/deleteLocation.dto';
@ApiTags('Location Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
// @UseGuards(MultipartPermissionsGuard)
@Controller()
export class locationController {
  constructor(private locationService: LocationService) {}

  @Post('/create-location')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-location'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
      },
    },
  })
  async create(
    @Request() request,
    @Body() createlocationDto: CreateLocationDto,
  ): Promise<any> {
    return this.locationService.createLocation(createlocationDto, request);
  }

  @Post('/get-locations')
  @SetMetadata('permissions', ['read-location'])
  @HttpCode(200)
  async getAlllocation(
    @Request() request,
    @Body() getAlllocationDto: GetAllLocationDto,
  ) {
    return this.locationService.findAllLocation(getAlllocationDto, request);
  }

  @Get('/get-location-by-id')
  @SetMetadata('permissions', ['read-location'])
  @HttpCode(200)
  async findlocationById(
    @Request() request,
    @Query() getlocationDto: GetLocationDto,
  ) {
    return await this.locationService.findLocationById(getlocationDto, request);
  }

  @Post('/update-location')
  @SetMetadata('permissions', ['write-location'])
  @HttpCode(200)
  async updateLocation(
    @Request() request,
    @Body() updatelocationDto: UpdateLocationDto,
  ): Promise<any> {
    return this.locationService.updateLocation(updatelocationDto, request);
  }

  @Post('/delete-location')
  @SetMetadata('permissions', ['delete-location'])
  @HttpCode(200)
  async deleteUser(@Body() deletelocationDto: DeleteLocationDto) {
    return await this.locationService.deleteLocation(deletelocationDto);
  }
}
