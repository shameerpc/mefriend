import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { ILike } from 'typeorm';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { CommonServices } from 'src/common/services/common.service';
import { DeleteEventTicketDto } from './dto/deleteEventTicket.dto';
import { CreateEventTicketDto } from './dto/createEventTicket.dto';
import { EventTicketRepositoryInterface } from './interface/eventticket.repository.interface';
import { UpdateEventTicketDto } from './dto/updateEventTicket.dto';
import { GetEventTicketDto } from './dto/getEventTicket.dto';
import { GetAllEventTicketDto } from './dto/getAllEventTickets.dto';
import { EventTicketResponseData } from './response/eventticket-response';
import { Status } from 'src/common/enum/status.enum';
import { GetEventTicketTypeDto } from './dto/getEventTicketType.dto';
import { EventRepositoryInterface } from '../event/interface/event.repository.interface';
@Injectable()
export class EventTicketService {
  constructor(
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private eventTicketResponseData: EventTicketResponseData,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
  ) {}

  async createEventTicket(
    createEventTicketDto: CreateEventTicketDto,
    request,
  ): Promise<any> {
    const { event_id, ticket_type_id, price } = createEventTicketDto;
    try {
      const eventTicket = {
        event_id: event_id,
        ticket_type_id: ticket_type_id,
        price: price,
        created_by: request.user.user_id,
        status: 1,
      };
      const data = await this.eventTicketRepository.save(eventTicket);
      if (data) {
        return this.responses.successResponse(data);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.createEventTicket',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllEventTicket(
    { search, page, limit }: GetAllEventTicketDto,
    request,
  ) {
    try {
      const queryCondition = search ? { status: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      // const relations = 'users, events';
      const relations: string[] = ['users', 'events', 'ticket_types'];
      const data =
        await this.eventTicketRepository.findByConditionWithPaginationAndJoin(
          {},
          offset,
          lmt,
          null,
          relations,
        );

      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = this.eventTicketResponseData.getAllResponse(
          data.data,
          request.user.role_id,
        );
        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.findAllEventTicket',
      );
      throw error;
    }
  }
  async findEventTicketById({ event_ticket_id }: GetEventTicketDto, request) {
    try {
      const relations: string[] = ['users', 'events', 'ticket_types'];
      const queryCondition = event_ticket_id ? { id: event_ticket_id } : {};
      const data = await this.eventTicketRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );

      if (data) {
        const result = this.eventTicketResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('EventTicket not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.findEventTicketById',
      );
      throw error;
    }
  }

  async updateEventTicket(
    UpdateEventTicketDto: UpdateEventTicketDto,
    request,
  ): Promise<any> {
    try {
      const { event_ticket_id, event_id, ticket_type_id, price, status } =
        UpdateEventTicketDto;

      const eventTicketData = {
        event_id: event_id,
        ticket_type_id: ticket_type_id,
        price: price,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedEventTicket = await this.eventTicketRepository.update(
        event_ticket_id,
        eventTicketData,
      );
      if (updatedEventTicket.affected > 0) {
        return this.responses.successResponse(eventTicketData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.updateEventTicket',
      );
      throw error;
    }
  }

  async deleteEventTicket({ event_ticket_ids }: DeleteEventTicketDto) {
    try {
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        event_ticket_ids,
        this.eventTicketRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse(
          'please ensure that the current statuses of the given event tickets are active.',
        );
      const results = [];
      for (const eventTicketId of event_ticket_ids) {
        const isExist = await this.eventTicketRepository.findOneById(
          eventTicketId,
        );
        if (!isExist)
          results.push({
            id: eventTicketId,
            status: false,
            message: 'Deletion Failed',
          });

        const deleteResult = await this.eventTicketRepository.delete(
          eventTicketId,
        );
        if (deleteResult) {
          results.push({
            id: eventTicketId,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: eventTicketId,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      return results;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.deleteEventTicket',
      );
      throw error;
    }
  }

  async findEventTicketType(
    { event_id, search }: GetEventTicketTypeDto,
    request,
  ) {
    try {
      // const queryCondition: any = event_id ? { event_id: event_id } : {};

      const data = await this.eventTicketRepository.findByCondition({
        event_id: event_id,
        status: Status.Active,
      });
      if (data) {
        const result = await Promise.all(
          data.map(async (datam) => {
            const eventData = await this.eventRepository.findOneById(
              datam.event_id,
            );
            return {
              id: datam.id,
              event_id: datam.event_id,
              title: datam.title,
              description: datam.description,
              price: datam.price ? datam.price : null,
              event_subscription_status:
                eventData.event_subscription_status == 1
                  ? 'Free'
                  : eventData.event_subscription_status == 2
                  ? 'Paid'
                  : '',
              ticket_type_id: datam.ticket_type_id,
              ticket_count: datam.ticket_count,
              status: datam.status,
            };
          }),
        );
        const response = {
          result,
        };
        return this.responses.successResponse(response);
      } else {
        return this.responses.errorResponse('EventTicket not found');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventTicketService.findEventTicketType',
      );
      throw error;
    }
  }
}
