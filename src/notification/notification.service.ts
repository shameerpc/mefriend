import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetAllNotificationDto } from './dto/getallNotification.dto';
import { ILike } from 'typeorm';
import { NotificationRepositoryInterface } from './interface/notification.repository.interface';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonValidation } from 'src/common/library/commonvalidation.data';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NotificationRepositoryInterface')
    private readonly notificationRepository: NotificationRepositoryInterface,
    private responses: ResponsesData,
    private readonly logger: Logger,
    private readonly commonValidation: CommonValidation,
  ) {}

  async findAllNotification(
    { search, user_id, page, limit }: GetAllNotificationDto,
    request,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }

      const queryCondition: any = search ? { title: ILike(`%${search}%`) } : {};
      if (user_id) {
        queryCondition.user_id = user_id;
      }
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const data =
        await this.notificationRepository.findByConditionWithPagination(
          queryCondition,
          offset,
          lmt,
        );
      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const notificationIds = data.data.map((datam: any) => datam.id);
        if (notificationIds.length > 0) {
          for (const notification of notificationIds) {
            await this.notificationRepository.update(notification, {
              read_status: 1,
            });
          }
        }
        const result =
          data.data.length > 0
            ? data.data.map((datam: any) => {
                return {
                  id: datam.id,
                  title: datam.title,
                  message: datam.message ? datam.message : null,
                  type: datam.type,
                  read_status: datam.read_status,
                  status: datam.status === 1 ? 'Active' : 'Inactive',
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
        'NotificationService.findAllNotification',
      );
      throw error;
    }
  }
}
