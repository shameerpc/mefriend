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

import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/permissions.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { MultipartPermissionsGuard } from 'src/auth/multipart-permission.guard';
import { MultipartAuthGuard } from 'src/auth/multipart-auth.guard';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/createSupportTicket.dto';
import { GetAllTicketsDto } from './dto/getAllTickets.dto';
import { DeleteSupportTicketDto } from './dto/deleteSupportTicket.dto';
import { CreateTicketCommentDto } from './dto/CreateTicketComment.dto';
import { GetSupportTicketDto } from './dto/getSupportTicket.dto';
import { RequiredHeaders } from 'src/auth/custom-header.decorator';
import { UpdateSupportTicketDto } from './dto/updateSupportTicket.dto';

@ApiTags('Support Tickets Management')
@ApiBearerAuth()
@UseGuards(MultipartAuthGuard)
@UseGuards(MultipartPermissionsGuard)
@UsePipes(new ValidationPipe())
@Controller()
export class SupportTicketsController {
  constructor(private supportTicketService: SupportTicketsService) {}

  @Post('/create-support-ticket')
  @HttpCode(200)
  @SetMetadata('permissions', ['write-supportticket'])
  async create(@Body() createTicketDto: CreateSupportTicketDto): Promise<any> {
    return this.supportTicketService.createSupportTicket(createTicketDto);
  }

  @Post('/update-support-ticket')
  @SetMetadata('permissions', ['write-supportticket'])
  @HttpCode(200)
  async UpdateSupportTicket(
    @Request() request,
    @Body() updateTicketDto: UpdateSupportTicketDto,
  ) {
    return await this.supportTicketService.UpdateSupportTicket(
      updateTicketDto,
      request,
    );
  }

  @Post('/comment-support-ticket')
  @SetMetadata('permissions', ['write-supportticket'])
  @HttpCode(200)
  async CreateComment(
    @Request() request,
    @Body() createCommentDto: CreateTicketCommentDto,
  ) {
    return await this.supportTicketService.CreateTicketComment(
      createCommentDto,
      request,
    );
  }

  @Post('/get-support-tickets')
  @SetMetadata('permissions', ['read-supportticket'])
  @HttpCode(200)
  async getAllTickets(
    @Request() request,
    @Body() getAllTicketsDto: GetAllTicketsDto,
  ) {
    return this.supportTicketService.findAllTickets(getAllTicketsDto, request);
  }

  @Get('/get-support-ticket-by-id')
  @SetMetadata('permissions', ['read-supportticket'])
  @HttpCode(200)
  async findTicketById(
    @Request() request,
    @Query() getticketDto: GetSupportTicketDto,
  ) {
    return await this.supportTicketService.findTicketById(
      getticketDto,
      request,
    );
  }

  @Post('/delete-support-ticket')
  @SetMetadata('permissions', ['delete-supportticket'])
  @HttpCode(200)
  async deleteUser(@Body() deleteticketDto: DeleteSupportTicketDto) {
    return await this.supportTicketService.deleteSupportTicket(deleteticketDto);
  }
}
