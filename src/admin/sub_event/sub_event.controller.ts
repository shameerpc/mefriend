/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  HttpCode,
  UseGuards,
  SetMetadata,
  Request,
} from '@nestjs/common';

import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';

import { SubEventService } from './sub_event.service';
import { AddSubEventParticipateDto } from './dto/addSubeventParticipate.dto';

@ApiTags('SubEvents Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@UsePipes(new ValidationPipe())
@Controller()
export class SubEventController {
  constructor(private subEventService: SubEventService) {}

  @Post('/add-subevent-participate')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-subevent-participate'])
  async create(
    @Request() request,
    @Body() addPartcipateDto: AddSubEventParticipateDto,
  ): Promise<any> {
    return this.subEventService.addSubEventParticipate(
      addPartcipateDto,
      request,
    );
  }
}
