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
import { CreateEventDto } from './dto/createEvent.dto';
import { EventService } from './event.service';
import { GetAllEventDto } from './dto/getAllEvent.dto';
import { GetEventDto } from './dto/getEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { DeleteEventDto } from './dto/deleteEvent.dto';
import { CustomAuthGuard } from 'src/auth/custom-auth.guard';
import { CustomPermissionsGuard } from 'src/auth/custom-permission.guard';
@ApiTags('Event Management')
@Controller()
export class eventController {
  constructor(private eventService: EventService) {}

  @Post('/create-event')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  // @UseGuards(MultipartPermissionsGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @SetMetadata('permissions', ['write-event'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        organizer_id: { type: 'number' },
        category_id: { type: 'number' },
        country_id: {
          type: 'integer',
          example: '1-UAE,2-Qatar',
        },
        city_id: {
          type: 'integer',
        },
        venue: { type: 'string' },
        venue_latitude: { type: 'string' },
        venue_longitude: { type: 'string' },
        map_url: { type: 'string' },
        event_description: { type: 'string' },
        event_date_from: {
          type: 'string',
          example: '2023-08-30T13:57:20.220Z',
        },
        event_date_to: { type: 'string', example: '2023-08-31T13:57:20.220Z' },
        event_time_from: {
          type: 'string',
          example: '2023-08-30T13:57:20.220Z',
        },
        event_time_to: { type: 'string', example: '2023-08-30T13:57:20.220Z' },
        total_seats: { type: 'number' },
        featured_image: {
          type: 'string',
          format: 'binary',
        },
        banner_image: { type: 'string' },

        status: { type: 'integer', example: '1-active,2-inactive' },
        agent_commission: { type: 'number' },
        single_ticket_price: { type: 'number' },
        event_type: { type: 'number', example: '1-online,2-offline' },
        // event_ticket_status: {
        //   type: 'number',
        //   example: '1-Selling fast,2-Sold out,3-upcoming',
        // },
        about_the_event: { type: 'string' },
        detailed_address: { type: 'string' },
        // contact_details: { type: 'string' },
        contact_ph: { type: 'integer', example: '123456789' },
        contact_email: { type: 'string', example: 'mefriend@gmail.com' },
        event_subscription_status: { type: 'number', example: '1-free,2-paid' },
        additional_venue_address: { type: 'string' },
        about_the_event_title: { type: 'string' },
        ticket_type_prices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                example: '1 //Use the ticket type ids from ticket type s list',
              },
              ticket_count: { type: 'number', example: '20' },
              price: { type: 'number', example: '1000' },
            },
          },
        },
        sponsors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Athira' },
              image: { type: 'string', example: 'Event/abc.jpg' },
            },
          },
        },
        questionnaire_form_id: { type: 'number', example: '2' },
        sub_events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Subevent' },
              description: { type: 'string', example: 'Add Description' },
              image: { type: 'string', example: 'url:sampleS3upload.jpg' },
            },
          },
        },
        agent_ids: {
          type: 'array',
          items: {
            type: 'number',
            example: [1, 2, 3],
          },
        },
      },
    },
  })
  async create(
    @Body() createeventDto: CreateEventDto,

    @Request() request,
  ): Promise<any> {
    return this.eventService.createEvent(createeventDto, request);
  }

  @Post('/get-events')
  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @UseGuards(CustomPermissionsGuard)
  @SetMetadata('permissions', ['read-event'])
  @HttpCode(200)
  async getAllevent(
    @Request() request,
    @Body() getAlleventDto: GetAllEventDto,
  ) {
    return this.eventService.findAllEvent(getAlleventDto, request);
  }

  @Get('/get-event-by-id')
  @ApiBearerAuth()
  @UseGuards(CustomAuthGuard)
  @UseGuards(CustomPermissionsGuard)
  @SetMetadata('permissions', ['read-event'])
  @HttpCode(200)
  async findeventById(@Request() request, @Query() geteventDto: GetEventDto) {
    return await this.eventService.findEventById(geteventDto, request);
  }

  @Post('/update-event')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  @UseGuards(MultipartPermissionsGuard)
  @SetMetadata('permissions', ['write-event'])
  @HttpCode(200)
  // @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        event_id: { type: 'number' },
        title: { type: 'string' },
        //organizer_id: { type: 'number' },
        category_id: { type: 'string' },
        country_id: {
          type: 'integer',
          example: '1-India,2-UAE',
        },
        city_id: {
          type: 'integer',
        },
        venue: { type: 'string' },
        venue_latitude: { type: 'string' },
        venue_longitude: { type: 'string' },
        map_url: { type: 'string' },
        event_description: { type: 'string' },
        event_date_from: {
          type: 'string',
          example: '2023-08-30T13:57:20.220Z',
        },
        event_date_to: { type: 'string', example: '2023-08-31T13:57:20.220Z' },
        event_time_from: {
          type: 'string',
          example: '2023-08-30T13:57:20.220Z',
        },
        event_time_to: { type: 'string', example: '2023-08-30T13:57:20.220Z' },
        total_seats: { type: 'number' },
        featured_image: {
          type: 'string',
          format: 'binary',
        },
        banner_image: { type: 'string' },

        status: { type: 'integer', example: '1-active,2-inactive' },
        agent_commission: { type: 'number' },
        single_ticket_price: { type: 'number' },
        event_type: { type: 'number', example: '1-online,2-offline' },
        // event_ticket_status: {
        //   type: 'number',
        //   example: '1-Selling fast,2-Sold out,3-upcoming',
        // },
        about_the_event: { type: 'string' },
        detailed_address: { type: 'string' },
        // contact_details: { type: 'string' },
        contact_ph: { type: 'integer', example: '123456789' },
        contact_email: { type: 'string', example: 'mefriend@gmail.com' },
        event_subscription_status: { type: 'number', example: '1-free,2-paid' },
        additional_venue_address: { type: 'string' },
        about_the_event_title: { type: 'string' },
        ticket_type_prices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                example: '1 //Use the ticket type ids from ticket type s list',
              },
              ticket_count: { type: 'number', example: '20' },
              price: { type: 'number', example: '1000' },
            },
          },
        },
        sponsors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Athira' },
              image: { type: 'string', example: 'Event/abc.jpg' },
            },
          },
        },
        sub_events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Subevent' },
              description: { type: 'string', example: 'Add Description' },
              image: { type: 'string', example: 'url:sampleS3upload.jpg' },
            },
          },
        },
        agent_ids: {
          type: 'array',
          items: {
            type: 'number',
            example: [1, 2, 3],
          },
        },
      },
    },
  })
  async updateCategory(
    @Request() request,
    @Body() updateeventDto: UpdateEventDto,
  ): Promise<any> {
    return this.eventService.updateEvent(updateeventDto, request);
  }

  @Post('/delete-event')
  @ApiBearerAuth()
  @UseGuards(MultipartAuthGuard)
  @UseGuards(MultipartPermissionsGuard)
  @SetMetadata('permissions', ['delete-event'])
  @HttpCode(200)
  async deleteUser(@Body() deleteeventDto: DeleteEventDto) {
    return await this.eventService.deleteEvent(deleteeventDto);
  }
}
