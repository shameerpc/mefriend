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
import { CreateEventTicketDto } from './dto/createEventTicket.dto';
import { EventTicketService } from './eventticket.service';
import { GetAllEventTicketDto } from './dto/getAllEventTickets.dto';
import { GetEventTicketDto } from './dto/getEventTicket.dto';
import { UpdateEventTicketDto } from './dto/updateEventTicket.dto';
import { DeleteEventTicketDto } from './dto/deleteEventTicket.dto';
import { GetEventTicketTypeDto } from './dto/getEventTicketType.dto';
@ApiTags('Event Ticket Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
// @UseGuards(MultipartPermissionsGuard)
@Controller()
export class EventTicketController {
  constructor(private EventTicketService: EventTicketService) {}

  @Post('/create-event-ticket')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-EventTicket'])
  async create(
    @Request() request,
    @Body() createEventTicketDto: CreateEventTicketDto,
  ): Promise<any> {
    return this.EventTicketService.createEventTicket(
      createEventTicketDto,
      request,
    );
  }

  @Post('/get-event-tickets')
  @SetMetadata('permissions', ['read-EventTicket'])
  @HttpCode(200)
  async getAllEventTicket(
    @Request() request,
    @Body() getAllEventTicketDto: GetAllEventTicketDto,
  ) {
    return this.EventTicketService.findAllEventTicket(
      getAllEventTicketDto,
      request,
    );
  }

  @Get('/get-event-ticket-by-id')
  @SetMetadata('permissions', ['read-EventTicket'])
  @HttpCode(200)
  async findEventTicketById(
    @Request() request,
    @Query() getEventTicketDto: GetEventTicketDto,
  ) {
    return await this.EventTicketService.findEventTicketById(
      getEventTicketDto,
      request,
    );
  }

  @Post('/update-event-ticket')
  @SetMetadata('permissions', ['write-EventTicket'])
  @HttpCode(200)
  async updateEventTicket(
    @Request() request,
    @Body() updateEventTicketDto: UpdateEventTicketDto,
  ): Promise<any> {
    return this.EventTicketService.updateEventTicket(
      updateEventTicketDto,
      request,
    );
  }

  @Post('/delete-event-ticket')
  @SetMetadata('permissions', ['delete-EventTicket'])
  @HttpCode(200)
  async deleteUser(@Body() deleteEventTicketDto: DeleteEventTicketDto) {
    return await this.EventTicketService.deleteEventTicket(
      deleteEventTicketDto,
    );
  }

  @Post('/get-event-ticket-type')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async getEventTicketType(
    @Request() request,
    @Body() getEventTicketTypeDto: GetEventTicketTypeDto,
  ) {
    return this.EventTicketService.findEventTicketType(
      getEventTicketTypeDto,
      request,
    );
  }
}
