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
import { CreateTicketTypeDto } from './dto/createTicketType.dto';
import { TicketTypeService } from './tickettype.service';
import { GetAllTicketTypeDto } from './dto/getAllTicketTypes.dto';
import { GetTicketTypeDto } from './dto/getTicketType.dto';
import { UpdateTicketTypeDto } from './dto/updateTicketType.dto';
import { DeleteTicketTypeDto } from './dto/deleteTicketType.dto';
@ApiTags('Ticket Type Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
// @UseGuards(MultipartPermissionsGuard)
@Controller()
export class TicketTypeController {
  constructor(private ticketTypeService: TicketTypeService) {}

  @Post('/create-ticket-type')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-ticket-type'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        ticket_count: { type: 'number' },
        price: { type: 'number' },
      },
    },
  })
  async create(
    @Request() request,
    @Body() createticketTypeDto: CreateTicketTypeDto,
  ): Promise<any> {
    return this.ticketTypeService.createTicketType(
      createticketTypeDto,
      request,
    );
  }

  @Post('/get-ticket-types')
  @SetMetadata('permissions', ['read-ticket-type'])
  @HttpCode(200)
  async getAllticketType(
    @Request() request,
    @Body() getAllticketTypeDto: GetAllTicketTypeDto,
  ) {
    return this.ticketTypeService.findAllTicketType(
      getAllticketTypeDto,
      request,
    );
  }

  @Get('/get-ticket-type-by-id')
  @SetMetadata('permissions', ['read-ticket-type'])
  @HttpCode(200)
  async findticketTypeById(
    @Request() request,
    @Query() getticketTypeDto: GetTicketTypeDto,
  ) {
    return await this.ticketTypeService.findTicketTypeById(
      getticketTypeDto,
      request,
    );
  }

  @Post('/update-ticket-type')
  @SetMetadata('permissions', ['write-ticket-type'])
  @HttpCode(200)
  async updateTicketType(
    @Request() request,
    @Body() updateticketTypeDto: UpdateTicketTypeDto,
  ): Promise<any> {
    return this.ticketTypeService.updateTicketType(
      updateticketTypeDto,
      request,
    );
  }

  @Post('/delete-ticket-type')
  @SetMetadata('permissions', ['delete-ticket-type'])
  @HttpCode(200)
  async deleteUser(@Body() deleteticketTypeDto: DeleteTicketTypeDto) {
    return await this.ticketTypeService.deleteTicketType(deleteticketTypeDto);
  }
}
