import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { ILike } from 'typeorm';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { CommonServices } from 'src/common/services/common.service';
import { DeleteTicketTypeDto } from './dto/deleteTicketType.dto';
import { CreateTicketTypeDto } from './dto/createTicketType.dto';
import { TicketTypeRepositoryInterface } from './interface/tickettype.repository.interface';
import { UpdateTicketTypeDto } from './dto/updateTicketType.dto';
import { GetTicketTypeDto } from './dto/getTicketType.dto';
import { GetAllTicketTypeDto } from './dto/getAllTicketTypes.dto';
import { TicketTypeResponseData } from './response/tickettype-response';
import { Status } from 'src/common/enum/status.enum';
import { EventTicketRepositoryInterface } from '../event_ticket/interface/eventticket.repository.interface';
@Injectable()
export class TicketTypeService {
  constructor(
    @Inject('TicketTypeRepositoryInterface')
    private readonly TicketTypeRepository: TicketTypeRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private TicketTypeResponseData: TicketTypeResponseData,
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
  ) {}

  async createTicketType(
    createTicketTypeDto: CreateTicketTypeDto,
    request,
  ): Promise<any> {
    const { title, ticket_count, price, status, description } =
      createTicketTypeDto;
    try {
      const isTitleExist = await this.TicketTypeRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        return this.responses.errorResponse('TicketType already exists');
      const TicketType = {
        title: title,
        ticket_count: ticket_count ? ticket_count : null,
        description: description ? description : null,
        price: price ? price : null,
        created_by: request.user.user_id,
        status: status,
      };
      const data = await this.TicketTypeRepository.save(TicketType);
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'TicketTypeService.createTicketType',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllTicketType(
    { search, page, limit, status }: GetAllTicketTypeDto,
    request,
  ) {
    try {
      const queryCondition = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];

      const data =
        await this.TicketTypeRepository.findByConditionWithPaginationAndJoin(
          {
            ...queryCondition,
            status: status ? status : null,
          },
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
        const result = this.TicketTypeResponseData.getAllResponse(
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
        'TicketTypeService.findAllTicketType',
      );
      throw error;
    }
  }
  async findTicketTypeById({ ticket_type_id }: GetTicketTypeDto, request) {
    try {
      const relations: string[] = ['users'];

      const queryCondition = ticket_type_id ? { id: ticket_type_id } : {};
      const data = await this.TicketTypeRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data.data) {
        const result = this.TicketTypeResponseData.getByIdResponse(
          data.data,
          request.user.role_id,
        );
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('TicketType not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'TicketTypeService.findTicketTypeById',
      );
      throw error;
    }
  }

  async updateTicketType(
    UpdateTicketTypeDto: UpdateTicketTypeDto,
    request,
  ): Promise<any> {
    try {
      const {
        ticket_type_id,
        title,
        status,
        ticket_count,
        price,
        description,
      } = UpdateTicketTypeDto;
      const isTitleExist = await this.TicketTypeRepository.findByCondition({
        title: title,
      });

      if (isTitleExist.length > 0)
        if (isTitleExist[0].id !== ticket_type_id)
          return this.responses.errorResponse('TicketType already exists');
      const TicketType_exist = await this.TicketTypeRepository.findByCondition({
        id: ticket_type_id,
      });
      if (TicketType_exist.length < 1) {
        return this.responses.errorResponse('TicketType not found');
      }

      const TicketTypeData = {
        title: title,
        ticket_count: ticket_count ? ticket_count : null,
        description: description ? description : null,
        price: price ? price : null,
        status: status,
        created_by: request.user.user_id,
      };

      const updatedTicketType = await this.TicketTypeRepository.update(
        ticket_type_id,
        TicketTypeData,
      );
      if (updatedTicketType.affected > 0) {
        return this.responses.successResponse(TicketTypeData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'TicketTypeService.updateTicketType',
      );
      throw error;
    }
  }

  async deleteTicketType({ ticket_type_ids }: DeleteTicketTypeDto) {
    try {
      //first check all categories are valid
      const checkExist = await this.commonServices.checkIdsExist(
        ticket_type_ids,
        this.TicketTypeRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse(
          'please ensure that the current statuses of the given ticket types are active.',
        );
      const results = [];
      const delresults = [];
      for (const TicketTypeId of ticket_type_ids) {
        //Check if the ticket type id exist or not
        const isTicketTypeIdExistEvent =
          await this.eventTicketRepository.findByCondition({
            ticket_type_id: TicketTypeId,
          });
        if (isTicketTypeIdExistEvent.length > 0)
          return this.responses.errorResponse(
            'You can not delete this ticket type,because this ticket type associated in some event',
          );
        const isExist = await this.TicketTypeRepository.findOneById(
          TicketTypeId,
        );
        if (!isExist)
          results.push({
            id: TicketTypeId,
            status: false,
            message: 'Deletion Failed',
          });

        const deleteResult = await this.TicketTypeRepository.delete(
          TicketTypeId,
        );
        if (deleteResult) {
          results.push({
            id: TicketTypeId,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: TicketTypeId,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      const allDeletedSuccessfully = delresults.every(
        (result) => result.success,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Ticket type deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'TicketTypeService.deleteTicketType',
      );
      throw error;
    }
  }
}
