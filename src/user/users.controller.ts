/* eslint-disable prettier/prettier */
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

import { DeleteSupportTicketDto } from 'src/support-tickets/dto/deleteSupportTicket.dto';
import { UserService } from './users.service';
import { DeleteUserByOwnDto } from './dto/deletebyown.dto';

@ApiTags('User Management(Organizer/Agency)')
@ApiBearerAuth()
// @UseGuards(PermissionsGuard)
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@Controller('user/')
export class UserController {
  constructor(private UsersService: UserService) {}

  @Post('/delete-user-by-own')
  @Post('delete-user')
  @SetMetadata('permissions', ['delete-user'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  deleteUser(@Body() data: DeleteUserByOwnDto): Promise<any> {
    return this.UsersService.deleteUserByOwn(data);
  }
}
