import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  SetMetadata,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { GetAllNotificationDto } from './dto/getallNotification.dto';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';

@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
@UseGuards(MultipartPermissionsGuard)
@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('get-notification-list')
  @SetMetadata('permissions', ['read-notification'])
  @HttpCode(200)
  async getNotificationList(
    @Request() request,
    @Body() getAllNotificationDto: GetAllNotificationDto,
  ) {
    return this.notificationService.findAllNotification(
      getAllNotificationDto,
      request,
    );
  }
}
