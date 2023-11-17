/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  SetMetadata,
  UploadedFiles,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { FavouriteService } from './favourite.service';
import { AddFavouriteDto } from './dto/addfavourite.dto';
import { GetFavouriteDto } from './dto/getfavourite.dto';

@ApiTags('Event Favourites')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller()
export class FavouriteController {
  constructor(private favouriteService: FavouriteService) {}

  @Post('/add-event-favourite')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-favourite'])
  async create(
    @Request() request,
    @Body() addFavouriteDto: AddFavouriteDto,
  ): Promise<any> {
    return this.favouriteService.addFavourite(addFavouriteDto, request);
  }
  @Post('/remove-event-favourite')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-favourite'])
  async remove(
    @Request() request,
    @Body() addFavouriteDto: AddFavouriteDto,
  ): Promise<any> {
    return this.favouriteService.removeFavourite(addFavouriteDto, request);
  }

  @Post('/get-event-favourite')
  @HttpCode(200)
  @SetMetadata('permissions', ['read-favourite'])
  async getAllFavourite(
    @Request() request,
    @Body() getFavouriteDto: GetFavouriteDto,
  ): Promise<any> {
    return this.favouriteService.getAllFavourites(getFavouriteDto, request);
  }
}
