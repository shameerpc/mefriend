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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AddMerchantKeyDto } from './dto/addmerchantkey.dto';
import { MerchantKeyServices } from './merchant.service';
import { GetMerchantKeyDto } from './dto/getmerchantkey.dto';
import { GetMerchantKeyByIdDto } from './dto/getmerchantkeybyid.dto';
import { DeleteMerchantKeyDto } from './dto/deletemerchantkey.dto';
import { RegenerateMerchantKeyDto } from './dto/regeneratemerchantkey.dto';

@ApiTags('Merchant Key Management')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseGuards(PermissionsGuard)
@Controller('merchantkey/')
export class MerchantController {
  constructor(private merchantKeyServices: MerchantKeyServices) {}

  @Post('add-merchant-key')
  @SetMetadata('permissions', ['write-merchantkey'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  createMerchantKey(@Body() data: AddMerchantKeyDto): Promise<any> {
    return this.merchantKeyServices.addMerchantKey(data);
  }
  @Post('get-merchant-key')
  @SetMetadata('permissions', ['read-merchantkey'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getMerchantKeys(@Body() data: GetMerchantKeyDto): Promise<any> {
    return this.merchantKeyServices.getMerchantKey(data);
  }
  @Post('get-merchant-key-by-id')
  @SetMetadata('permissions', ['read-merchantkey'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  getMerchantKeysById(@Body() data: GetMerchantKeyByIdDto): Promise<any> {
    return this.merchantKeyServices.getMerchantKeyById(data);
  }
  @Post('delete-merchant-key')
  @SetMetadata('permissions', ['delete-merchantkey'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  deleteMerchantKeysById(@Body() data: DeleteMerchantKeyDto): Promise<any> {
    return this.merchantKeyServices.deleteMerchantKey(data);
  }
  @Post('regenerate-merchant-key')
  @SetMetadata('permissions', ['regenerate-merchantkey'])
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  regenerateMerchantKey(@Body() data: RegenerateMerchantKeyDto): Promise<any> {
    return this.merchantKeyServices.regenerateMerchantKey(data);
  }
}
