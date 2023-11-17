import { Inject, Injectable, Logger } from '@nestjs/common';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { ResponsesData } from 'src/common/library/response.data';
import { CommonServices } from 'src/common/services/common.service';
import { AddFavouriteDto } from './dto/addfavourite.dto';
import { EventRepositoryInterface } from 'src/admin/event/interface/event.repository.interface';
import { FavouriteRepositoryInterface } from './interface/favourite.repository.interface';
import { GetFavouriteDto } from './dto/getfavourite.dto';
import { ILike } from 'typeorm';

@Injectable()
export class FavouriteService {
  constructor(
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    @Inject('FavouriteRepositoryInterface')
    private readonly favouriteRepository: FavouriteRepositoryInterface,
  ) {}

  async addFavourite(addFavouriteDto: AddFavouriteDto, request): Promise<any> {
    const { user_id, event_id } = addFavouriteDto;
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const fav = await this.favouriteRepository.findByCondition({
        user_id: user_id,
        event_id: event_id,
      });
      if (fav.length > 0) {
        return this.responses.successResponse(
          {},
          'Event already added to favorites',
        );
      }
      const data = await this.eventRepository.findOneById(event_id);
      if (data) {
        const favourite_data = {
          user_id: user_id,
          event_id: event_id,
          status: 1,
        };

        const result = await this.favouriteRepository.save(favourite_data);
        return this.responses.successResponse({}, 'Event added to favourites');
      } else return this.responses.errorResponse('Event not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'FavouriteService.addFavourite',
      );
      return this.responses.errorResponse(error);
    }
  }

  async removeFavourite(
    addFavouriteDto: AddFavouriteDto,
    request,
  ): Promise<any> {
    const { user_id, event_id } = addFavouriteDto;
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const data = await this.eventRepository.findOneById(event_id);
      if (data) {
        const favourite_data_delete = {
          user_id: user_id,
          event_id: event_id,
          status: 0,
          delete_status: 1,
          deleted_at: new Date(),
        };

        const fav = await this.favouriteRepository.findByCondition({
          user_id: user_id,
          event_id: event_id,
        });
        console.log(fav);
        if (fav.length > 0) {
          const result = await this.favouriteRepository.update(
            fav[0].id,
            favourite_data_delete,
          );
          if (result)
            return this.responses.successResponse(
              {},
              'Event removed from favorites',
            );
        }

        return this.responses.successResponse({}, 'Something went wrong');
      } else return this.responses.errorResponse('Event not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'FavouriteService.addFavourite',
      );
      return this.responses.errorResponse(error);
    }
  }
  async getAllFavourites(
    getFavouriteDto: GetFavouriteDto,
    request,
  ): Promise<any> {
    const { user_id, search, page, limit } = getFavouriteDto;
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
      const relations: string[] = ['events'];

      const data =
        await this.favouriteRepository.findByConditionWithPaginationAndJoin(
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
      // console.log(data);
      if (data) {
        const result =
          data.data.length > 0
            ? await Promise.all(
                data.data.map(async (datam: any) => {
                  return {
                    id: datam.id,
                    event_id: datam.event_id,
                    event_name: datam.events.title,
                    event_code: datam.events.event_code,
                    category_id: datam.events.category_id,
                    city: datam.events.city,
                    venue: datam.events.venue,
                    venue_latitude: datam.events.venue_latitude,
                    venue_longitude: datam.events.venue_longitude,
                    map_url: datam.events.map_url,

                    event_description: datam.events.event_description,
                    featured_image: datam.events.featured_image
                      ? global.baseUrl +
                        '/uploads/events/' +
                        datam.events.featured_image
                      : '',
                    banner_image: datam.events.banner_image
                      ? datam.events.banner_image
                      : '',

                    event_date_from: datam.events.event_date_from,
                    event_date_to: datam.events.event_date_to,
                    event_time_from: datam.events.event_time_from,
                    event_time_to: datam.events.event_time_to,
                    total_seats: datam.events.total_seats,
                    agent_commission: datam.events.agent_commission,
                    single_ticket_price: datam.events.single_ticket_price,
                    event_type:
                      datam.events.event_type == 1 ? 'Online' : 'Offline',
                    event_ticket_status:
                      datam.events.event_ticket_status == 1
                        ? 'Selling Fast'
                        : datam.events.event_ticket_status == 2
                        ? 'SoldOut'
                        : 'Upcoming',
                    about_the_event: datam.events.about_the_event,
                    detailed_address: datam.events.detailed_address,
                    contact_details: datam.events.contact_details,
                    status: datam.status == 1 ? 'Active' : 'Inactive',
                  };
                }),
              )
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
        'FavouriteService.getAllFavourites',
      );
      return this.responses.errorResponse(error);
    }
  }
}
