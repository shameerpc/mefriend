/* eslint-disable prettier/prettier */
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  UsePipes,
  HttpCode,
  Query,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/getuset.dto';
import { DeleteUserDto } from './dto/deleteuser.dto';
import { AddUserDto } from './dto/add-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUsersDto } from './dto/updateuser.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Multer } from 'multer';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { DashboardDto } from './dto/dashboard.dto';
import { GetUserByIdDto } from './dto/getuserbyid.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';

@ApiTags('User Management(Organizer/Agency)')
@ApiBearerAuth()
// @UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@Controller('user/')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post('/add-user')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @SetMetadata('permissions', ['write-user'])
  async create(
    @Body() addUserDto: AddUserDto,
    @Request() request,
  ): Promise<any> {
    return this.UsersService.addUser(addUserDto, request);
  }

  @Post('get-user')
  @SetMetadata('permissions', ['read-user'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getUser(@Body() data: GetUserDto): Promise<any> {
    return this.UsersService.getUser(data);
  }
  @Post('get-user-by-id')
  @SetMetadata('permissions', ['read-user'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getUserById(@Body() data: GetUserByIdDto): Promise<any> {
    return this.UsersService.getUserById(data);
  }
  @Post('delete-user')
  @SetMetadata('permissions', ['delete-user'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  deleteUser(@Body() data: DeleteUserDto): Promise<any> {
    return this.UsersService.deleteUser(data);
  }

  @Post('/update-user')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @SetMetadata('permissions', ['write-user'])
  async updateUser(
    @Body() updateUsersDto: UpdateUsersDto,

    @Request() request,
  ): Promise<any> {
    return this.UsersService.updateUser(updateUsersDto, request);
  }

  @Post('dashboard')
  @SetMetadata('permissions', ['read-dashboard'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  dashboard(@Request() req, @Body() data: DashboardDto): Promise<any> {
    return this.UsersService.dashboard(req, data);
  }

  @Post('update-user-password')
  @SetMetadata('permissions', ['update-user-password'])
  @HttpCode(200)
  async resetPasswordUsers(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Request() request,
  ) {
    return await this.UsersService.resetPasswordUsers(
      resetPasswordDto,
      request,
    );
  }
}
