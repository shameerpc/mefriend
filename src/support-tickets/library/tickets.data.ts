import { Inject } from '@nestjs/common';
import { Status } from 'src/common/enum/status.enum';
import { SupportTicketsEntity } from 'src/typeOrm/entities/SupportTickets';
import { TicketCommentRepositoryInterface } from '../interface/ticketComment.repository.interface';

export class TicketData {
  constructor(
    @Inject('TicketCommentRepositoryInterface')
    private readonly ticketCommentRepository: TicketCommentRepositoryInterface,
  ) {}
  async createResponse(input: SupportTicketsEntity) {
    const data = {
      id: input.id,
      title: input.title,
      ticket_id: input.ticket_id,
      user_id: input.user_id,
      description: input.description ? input.description : null,
      ticket_image: input.ticket_image,
      is_closed: input.is_closed,
      status: input.status,
      created_at: input.created_at,
    };
    return data;
  }

  //Role based Get ticket BY ID response
  async getByIdResponse(data: any, role) {
    let result: any = {};
    if (data) {
      switch (role) {
        case 1: // Super Admin
          const ticket = data; // Assuming data is a single ticket object
          const comments = await this.ticketCommentRepository.findByCondition({
            ticket_id: ticket.id,
            delete_status: 0,
          });
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
            description: ticket.description || null,
            ticket_image: ticket.ticket_image,
            is_closed: ticket.is_closed,
            status: ticket.status === 1 ? 'Active' : 'Inactive',
            created_at: ticket.created_at,
            comments: getComments,
          };

          break;
        case 2: //USER
          result = {
            id: data.id,
            title: data.title,
            ticket_id: data.ticket_id,
            description: data.description ? data.description : null,
            ticket_image: data.ticket_image,
            is_closed: data.is_closed,
            status: data.status == 1 ? 'Active' : 'Inactive',
          };
          break;
        case 3: //SUB_ADMIN
          break;
        case 4: //ORGANIZER
          break;
        case 5: //AGENT
          break;
      }

      return result ? result : {};
    }
  }
}
