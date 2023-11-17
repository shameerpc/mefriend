import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupportTicketRepositoryInterface } from './interface/supportTicket.repository.interface';
import { CreateSupportTicketDto } from './dto/createSupportTicket.dto';
import { Multer } from 'multer';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { GetAllTicketsDto } from './dto/getAllTickets.dto';
import { ILike } from 'typeorm';
import * as fs from 'fs';
import { TicketData } from 'src/support-tickets/library/tickets.data';
import { DeleteSupportTicketDto } from './dto/deleteSupportTicket.dto';
import { CreateTicketCommentDto } from './dto/CreateTicketComment.dto';
import { TicketCommentRepositoryInterface } from './interface/ticketComment.repository.interface';
import { GetSupportTicketDto } from './dto/getSupportTicket.dto';
import { UpdateSupportTicketDto } from './dto/updateSupportTicket.dto';
import { UserRepositoryInterface } from 'src/user/interface/user.repository.interface';

@Injectable()
export class SupportTicketsService {
  constructor(
    @Inject('SupportTicketRepositoryInterface')
    private readonly supportTicketRepository: SupportTicketRepositoryInterface,
    @Inject('TicketCommentRepositoryInterface')
    private readonly ticketCommentRepository: TicketCommentRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private responses: ResponsesData,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private readonly commonValidation: CommonValidation,
    private ticketData: TicketData,
  ) {}

  async createSupportTicket(
    createTicketDto: CreateSupportTicketDto,
  ): Promise<any> {
    const { user_id, title, description, image } = createTicketDto;
    try {
      let fileName: string;
      if (title && title.length > 50) {
        return this.responses.errorResponse(
          'title must be shorter than or equal to 50 characters',
        );
      }
      if (description && description.length > 1500) {
        return this.responses.errorResponse(
          'description must be shorter than or equal to 1500 characters',
        );
      }
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      // Generate a unique ticket ID
      const ticketId = await this.generateUniqueTicketId();

      const support_ticket = {
        user_id: user_id,
        title: title,
        description: description,
        ticket_image: image,
        status: 1,
        ticket_id: ticketId,
      };

      const data = await this.supportTicketRepository.save(support_ticket);
      if (data) {
        const responseData = await this.ticketData.createResponse(data);
        return this.responses.successResponse(
          responseData,
          'Support Ticket Created Successfully',
        );
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.createSupportTicket',
      );
      return this.responses.errorResponse(error);
    }
  }

  async findAllTickets({ search, page, limit }: GetAllTicketsDto, request) {
    try {
      const queryCondition: any = search ? { title: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const role_id = await this.commonServices.AuthRoleId(
        request.user.user_id,
      );
      if (role_id === 2) {
        queryCondition.user_id = request.user.user_id;
      }
      const relations: string[] = ['users'];

      const data =
        await this.supportTicketRepository.findByConditionWithPaginationAndJoin(
          queryCondition,
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
        const result =
          data.data.length > 0
            ? data.data.map((datam: any) => {
                return {
                  id: datam.id,
                  title: datam.title,
                  ticket_id: datam.ticket_id,
                  user_id: datam.user_id,
                  user_name: datam.users
                    ? datam.users.first_name + ' ' + datam.users.last_name
                    : '',
                  description: datam.description ? datam.description : null,
                  ticket_image: datam.ticket_image,
                  is_closed: datam.is_closed,
                  status: datam.status,
                  created_at: datam.created_at,
                };
              })
            : [];
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
        'SupportTicketsService.findAllTickets',
      );
      throw error;
    }
  }

  async findTicketById({ ticket_id }: GetSupportTicketDto, request) {
    try {
      let result: any = {};
      const relations: string[] = ['users'];
      const queryCondition = ticket_id ? { id: ticket_id } : {};
      const data = await this.supportTicketRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      if (data) {
        const role_id = await this.commonServices.AuthRoleId(
          request.user.user_id,
        );
        const comment_exist =
          await this.ticketCommentRepository.findByCondition({
            ticket_id: ticket_id,
            user_role: role_id,
          });
        if (comment_exist.length > 0) {
          for (const comment of comment_exist) {
            await this.ticketCommentRepository.update(comment.id, {
              read_status: 1,
            });
          }
        }

        switch (role_id) {
          case 1: // Super Admin
            const ticket = data.data[0]; // Assuming data is a single ticket object
            const comments = await this.ticketCommentRepository.findByCondition(
              {
                ticket_id: ticket.id,
                delete_status: 0,
              },
            );
            const getComments = comments.map((comnt: any) => {
              const commentData = {
                id: comnt.id,
                user_role: comnt.user_role === 2 ? 'User' : 'Super Admin',
                comment: comnt.comment || '',
                read_status: comnt.read_status,
                created_at: comnt.created_at,
              };
              return commentData;
            });

            result = {
              id: ticket.id,
              title: ticket.title,
              ticket_id: ticket.ticket_id,
              user_id: ticket.user_id,
              user_name: ticket.users
                ? ticket.users.first_name + ' ' + ticket.users.last_name
                : '',
              description: ticket.description ? ticket.description : '',
              ticket_image: ticket.ticket_image,
              is_closed: ticket.is_closed,
              status: ticket.status === 1 ? 'Active' : 'Inactive',
              created_at: ticket.created_at,
              comments: getComments,
            };

            break;
          case 2: //USER
            const ticket_exist =
              await this.supportTicketRepository.findByCondition({
                id: ticket_id,
                user_id: request.user.user_id,
              });
            if (ticket_exist.length < 1) {
              return this.responses.errorResponse('Support ticket not found');
            }
            const ticket2 = data.data[0];

            const comments2 =
              await this.ticketCommentRepository.findByCondition({
                ticket_id: ticket2.id,
                delete_status: 0,
              });
            const getComments2 = comments2.map((comnt: any) => {
              const commentData = {
                id: comnt.id,
                user_role: comnt.user_role === 2 ? 'User' : 'Super Admin',
                comment: comnt.comment || '',
                read_status: comnt.read_status,
                created_at: comnt.created_at,
              };
              return commentData;
            });

            result = {
              id: ticket2.id,
              title: ticket2.title,
              ticket_id: ticket2.ticket_id,
              description: ticket2.description ? ticket2.description : '',
              ticket_image: ticket2.ticket_image,
              is_closed: ticket2.is_closed,
              status: ticket2.status === 1 ? 'Active' : 'Inactive',
              created_at: ticket2.created_at,
              comments: getComments2,
            };

            break;
          case 3: //SUB_ADMIN
            break;
          case 4: //ORGANIZER
            break;
          case 5: //AGENT
            break;
        }

        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Support ticket not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.findTicketById',
      );
      throw error;
    }
  }

  async UpdateSupportTicket(
    updateTicketDto: UpdateSupportTicketDto,
    request,
  ): Promise<any> {
    const { user_id, ticket_id, is_closed } = updateTicketDto;
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const ticket_exist = await this.supportTicketRepository.findByCondition({
        id: ticket_id,
      });
      if (ticket_exist.length < 1) {
        return this.responses.errorResponse('Support ticket not found');
      }
      const role_id = await this.commonServices.AuthRoleId(
        request.user.user_id,
      );
      if (
        ticket_exist.length > 0 &&
        (is_closed == true || is_closed == false) &&
        role_id === 1
      ) {
        await this.supportTicketRepository.update(ticket_id, {
          is_closed: is_closed,
        });
        return this.responses.successResponse({}, 'Support ticket is updated');
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.UpdateSupportTicket',
      );
      return this.responses.errorResponse(error);
    }
  }

  async CreateTicketComment(
    createCommentDto: CreateTicketCommentDto,
    request,
  ): Promise<any> {
    const { user_id, ticket_id, comment } = createCommentDto;
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      if (comment && comment.length > 1500) {
        return this.responses.errorResponse(
          'comment must be shorter than or equal to 1500 characters',
        );
      }

      const ticket_exist = await this.supportTicketRepository.findByCondition({
        id: ticket_id,
      });
      if (ticket_exist.length < 1) {
        return this.responses.errorResponse('Support ticket not found');
      }
      if (ticket_exist[0].is_closed) {
        return this.responses.errorResponse('Support ticket is closed');
      }
      const role_id = await this.commonServices.AuthRoleId(
        request.user.user_id,
      );

      const ticket_comment = {
        user_role: role_id,
        ticket_id: ticket_id,
        comment: comment,
        read_status: 0,
      };

      const data = await this.ticketCommentRepository.save(ticket_comment);
      if (data) {
        return this.responses.successResponse(data, 'Ticket comment added');
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.CreateTicketComment',
      );
      return this.responses.errorResponse(error);
    }
  }

  async deleteSupportTicket({ ticket_ids }: DeleteSupportTicketDto) {
    try {
      //first check all tickets are valid
      const checkExist = await this.commonServices.checkIdsExist(
        ticket_ids,
        this.supportTicketRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse('Please check support ticket');
      const successResults = [];

      for (const ticketId of ticket_ids) {
        const isExist = await this.supportTicketRepository.findOneById(
          ticketId,
        );

        if (!isExist) {
          return this.responses.errorResponse('Ticket not found');
        }

        const deleteResult = await this.supportTicketRepository.delete(
          ticketId,
        );
        if (deleteResult) {
          successResults.push({
            id: ticketId,
            status: true,
            message: 'Support ticket deleted successfully',
          });
        } else {
          successResults.push({
            id: ticketId,
            status: false,
            message: 'Deletion failed',
          });
        }
      }
      // Check if all deletions were successful
      const allDeletedSuccessfully = successResults.every(
        (result) => result.status,
      );

      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Support ticket deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.deleteSupportTicket',
      );
      throw error;
    }
  }

  async generateUniqueTicketId(): Promise<string> {
    try {
      let ticketId: string;
      const filterCondition = {
        ticket_id: '',
      };

      do {
        const randomSixDigits = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        ticketId = `MF${randomSixDigits}`;

        filterCondition.ticket_id = ticketId;
        const existingTickets =
          await this.supportTicketRepository.findByCondition(filterCondition);

        if (existingTickets.length === 0) {
          break;
        }
      } while (true);

      return ticketId;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'SupportTicketsService.generateUniqueTicketId',
      );
      throw error;
    }
  }
}
