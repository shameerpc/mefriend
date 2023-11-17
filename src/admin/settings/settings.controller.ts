import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  UseGuards,
  SetMetadata,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { GetSettingDto } from './dto/getSetting.dto';
import { UpdateSettingDto } from './dto/updateSetting.dto';
import { CustomAuthGuard } from 'src/auth/custom-auth.guard';
import { CustomPermissionsGuard } from 'src/auth/custom-permission.guard';

@ApiTags('Settings Management')
@UsePipes(new ValidationPipe())
@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('admin/get-settings')
  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @UseGuards(CustomPermissionsGuard)
  @SetMetadata('permissions', ['read-settings'])
  @HttpCode(200)
  async getAllSettings(
    @Request() request,
    @Body() getSettingDto: GetSettingDto,
  ) {
    return this.settingsService.findAllSettings(getSettingDto, request);
  }

  @Post('admin/update-settings')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseGuards(PermissionsGuard)
  @SetMetadata('permissions', ['write-settings'])
  @HttpCode(200)
  async updateSettings(@Body() updateSettingDto: UpdateSettingDto) {
    return await this.settingsService.updateSettings(updateSettingDto);
  }
}
