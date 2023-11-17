import { Inject, Injectable, Logger } from '@nestjs/common';
import { ResponsesData } from 'src/common/library/response.data';
import { EventRepositoryInterface } from 'src/admin/event/interface/event.repository.interface';
import { Status } from 'src/common/enum/status.enum';
import { EventTicketRepositoryInterface } from 'src/admin/event_ticket/interface/eventticket.repository.interface';
import { SettingsRepositoryInterface } from './interface/settings.repository.interface';
import { GetAllFaqDto } from 'src/admin/faq/dto/getAllFaqs.dto';
import { ILike } from 'typeorm';
import { FaqRepositoryInterface } from 'src/admin/faq/interface/faq.repository.interface';
import { FaqResponseData } from 'src/admin/faq/response/faq-response';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { GetAllCityDto } from './dto/getallcity.dto';
import * as dateFns from 'date-fns';
import { constants } from 'src/common/enum/constants.enum';
import { CategoryRepositoryInterface } from 'src/category/interface/category.repository.interface';

@Injectable()
export class HomepageService {
  constructor(
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
    @Inject('SettingsRepositoryInterface')
    private readonly settingsRepository: SettingsRepositoryInterface,
    private responses: ResponsesData,
    private readonly logger: Logger,
    @Inject('FaqRepositoryInterface')
    private readonly faqRepository: FaqRepositoryInterface,
    private faqResponseData: FaqResponseData,
    private commonValidation: CommonValidation,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
  ) {}

  async getHomePageList() {
    try {
      const data = await this.eventRepository.findByCondition({
        status: Status.Active,
      });

      if (data) {
        const currentDate = new Date();

        const upcomingEvents = [];
        const pastEvents = [];
        let trendingEvents = {};
        let highestRowCountEventId = null;
        let highestRowCount = 0;
        const dateFns = require('date-fns');

        await Promise.all(
          data.map(async (eventData) => {
            const eventDate = new Date(eventData.event_date_from);
            const eventDateTo = new Date(eventData.event_date_to);
            const cat_name = await this.categoryRepository.findByCondition({
              id: eventData.category_id,
            });
            if (eventDate > currentDate) {
              upcomingEvents.push({
                id: eventData.id,
                title: eventData.title,
                event_code: eventData.event_code,
                category_name: cat_name[0] ? cat_name[0].title : '',
                country: eventData.country_id == 1 ? 'INDIA' : 'UAE',
                city: eventData.city_id,
                venue: eventData.venue,
                venue_latitude: eventData.venue_latitude,
                venue_longitude: eventData.venue_longitude,
                map_url: eventData.map_url,
                event_description: eventData.event_description,
                featured_image: eventData.featured_image
                  ? `${constants.IMAGE_BASE_URL}` + eventData.featured_image
                  : '',
                banner_image: eventData.banner_image
                  ? `${constants.IMAGE_BASE_URL}` + eventData.banner_image
                  : '',

                event_date_from: dateFns.format(
                  new Date(eventData.event_date_from),
                  'MMMM dd,EEEE yyyy',
                ),

                event_date_to: dateFns.format(
                  new Date(eventData.event_date_to),
                  'MMMM dd,EEEE yyyy',
                ),
                event_time_from: eventData.event_time_from,
                event_time_to: eventData.event_time_to,

                // event_time_to: dateFns.format(
                //   new Date(eventData.event_time_to),
                //   "hh:mm a"
                // ),
                total_seats: eventData.total_seats,
                available_seats: eventData.available_seats,

                event_type: eventData.event_type == 1 ? 'Online' : 'Offline',
                event_ticket_status:
                  eventData.event_ticket_status == 1
                    ? 'Selling Fast'
                    : eventData.event_ticket_status == 2
                    ? 'SoldOut'
                    : 'Upcoming', //need to implement the logic later
                about_the_event: eventData.about_the_event,
                detailed_address: eventData.detailed_address,
                contact_phone: eventData.contact_ph,
                contact_email: eventData.contact_email,
                event_subscription_status:
                  eventData.event_subscription_status == 1
                    ? 'Free'
                    : eventData.event_subscription_status == 2
                    ? 'Paid'
                    : '',
                additional_venue_address: eventData.additional_venue_address,
                about_the_event_title: eventData.about_the_event_title,
                created_by: eventData.created_by,
                status: eventData.status == 1 ? 'Active' : 'Inactive',
              });
              const event_ticket =
                await this.eventTicketRepository.findByCondition({
                  event_id: eventData.id,
                  status: Status.Active,
                });

              if (event_ticket.length > highestRowCount) {
                highestRowCount = event_ticket.length;
                highestRowCountEventId = event_ticket[0].event_id;
              }
            } else if (eventDateTo < currentDate) {
              pastEvents.push({
                id: eventData.id,
                title: eventData.title,
                event_code: eventData.event_code,
                category_name: cat_name[0] ? cat_name[0].title : '',
                country: eventData.country_id == 1 ? 'INDIA' : 'UAE',
                city: eventData.city_id,
                venue: eventData.venue,
                venue_latitude: eventData.venue_latitude,
                venue_longitude: eventData.venue_longitude,
                map_url: eventData.map_url,
                event_description: eventData.event_description,
                featured_image: eventData.featured_image
                  ? `${constants.IMAGE_BASE_URL}` + eventData.featured_image
                  : '',
                banner_image: eventData.banner_image
                  ? `${constants.IMAGE_BASE_URL}` + eventData.banner_image
                  : '',
                event_date_from: dateFns.format(
                  new Date(eventData.event_date_from),
                  'MMMM dd,EEEE yyyy',
                ),

                event_date_to: dateFns.format(
                  new Date(eventData.event_date_to),
                  'MMMM dd,EEEE yyyy',
                ),
                event_time_from: eventData.event_time_from,
                event_time_to: eventData.event_time_to,
                // event_time_from: dateFns.format(
                //   new Date(eventData.event_time_from),
                //   "hh:mm a"
                // ),
                // event_time_to: dateFns.format(
                //   new Date(eventData.event_time_to),
                //   "hh:mm a"
                // ),
                total_seats: eventData.total_seats,
                available_seats: eventData.available_seats,
                event_type: eventData.event_type == 1 ? 'Online' : 'Offline',
                event_ticket_status:
                  eventData.event_ticket_status == 1
                    ? 'Selling Fast'
                    : eventData.event_ticket_status == 2
                    ? 'SoldOut'
                    : 'Upcoming', //need to implement the logic later
                about_the_event: eventData.about_the_event,
                detailed_address: eventData.detailed_address,
                contact_phone: eventData.contact_ph,
                contact_email: eventData.contact_email,
                event_subscription_status:
                  eventData.event_subscription_status == 1
                    ? 'Free'
                    : eventData.event_subscription_status == 2
                    ? 'Paid'
                    : '',
                additional_venue_address: eventData.additional_venue_address,
                about_the_event_title: eventData.about_the_event_title,
                status: eventData.status == 1 ? 'Active' : 'Inactive',
              });
            }
          }),
        );
        if (highestRowCountEventId) {
          const trending_event = await this.eventRepository.findOneById(
            highestRowCountEventId,
          );
          const cat_name_ = await this.categoryRepository.findByCondition({
            id: trending_event.category_id,
          });
          if (trending_event) {
            trendingEvents = {
              id: trending_event.id,
              title: trending_event.title,
              event_code: trending_event.event_code,
              category_name: cat_name_[0] ? cat_name_[0].title : '',
              country: trending_event.country_id == 1 ? 'INDIA' : 'UAE',
              city: trending_event.city_id,
              venue: trending_event.venue,
              venue_latitude: trending_event.venue_latitude,
              venue_longitude: trending_event.venue_longitude,
              map_url: trending_event.map_url,
              event_description: trending_event.event_description,
              featured_image: trending_event.featured_image
                ? `${constants.IMAGE_BASE_URL}` + trending_event.featured_image
                : '',
              banner_image: trending_event.banner_image
                ? `${constants.IMAGE_BASE_URL}` + trending_event.banner_image
                : '',

              event_date_from: dateFns.format(
                new Date(trending_event.event_date_to),
                'MMMM dd,EEEE yyyy',
              ),

              event_date_to: dateFns.format(
                new Date(trending_event.event_date_from),
                'MMMM dd,EEEE yyyy',
              ),
              event_time_from: trending_event.event_time_from,
              event_time_to: trending_event.event_time_to,
              // event_time_from: dateFns.format(
              //   new Date(trending_event.event_time_from),
              //   "hh:mm a"
              // ),
              // event_time_to: dateFns.format(
              //   new Date(trending_event.event_time_to),
              //   "hh:mm a"
              // ),
              total_seats: trending_event.total_seats,
              available_seats: trending_event.available_seats,
              event_type: trending_event.event_type == 1 ? 'Online' : 'Offline',
              event_ticket_status:
                trending_event.event_ticket_status == 1
                  ? 'Selling Fast'
                  : trending_event.event_ticket_status == 2
                  ? 'SoldOut'
                  : 'Upcoming', //need to implement the logic later
              about_the_event: trending_event.about_the_event,
              detailed_address: trending_event.detailed_address,
              contact_phone: trending_event.contact_ph,
              contact_email: trending_event.contact_email,
              event_subscription_status:
                trending_event.event_subscription_status == 1
                  ? 'Free'
                  : trending_event.event_subscription_status == 2
                  ? 'Paid'
                  : '',
              additional_venue_address: trending_event.additional_venue_address,
              about_the_event_title: trending_event.about_the_event_title,
              status: trending_event.status == 1 ? 'Active' : 'Inactive',
            };
          }
        }
        const response = {
          upcoming_events: upcomingEvents,
          past_events: pastEvents,
          trending_event: trendingEvents,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'HomepageService.getHomePageList',
      );
      return this.responses.errorResponse(error);
    }
  }

  async getContactList() {
    try {
      const data = await this.settingsRepository.findByCondition({
        id: 1,
        status: Status.Active,
      });

      if (data) {
        const result = {
          facebook: data[0].facebook_link,
          instagram: data[0].instagram_link,
          twitter: data[0].twitter_link,
          linkedin: data[0].linkedin_link,
        };
        return this.responses.successResponse(result);
      } else return this.responses.errorResponse('Settings not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'HomepageService.getContactList',
      );
      return this.responses.errorResponse(error);
    }
  }

  async getFaqList({ search, page, limit }: GetAllFaqDto, request) {
    try {
      const queryCondition = search ? { question: ILike(`%${search}%`) } : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = ['users'];

      const data =
        await this.faqRepository.findByConditionWithPaginationAndJoin(
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
        const result = this.faqResponseData.getAllResponse(data.data, 2);
        const response = {
          result,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'FaqService.findAllFaq');
      throw error;
    }
  }

  async getCityList({ user_id, search }: GetAllCityDto, request) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const queryCondition = search ? { status: Status.Active } : {};
      const relations: string[] = ['users', 'location'];

      // const data = await this.eventRepository.findByCondition({
      //   status: Status.Active,
      // });
      const data = await this.eventRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );

      if (data) {
        const result = await Promise.all(
          data.data.map(async (datam) => {
            console.log(datam.location);
            return {
              event_id: datam.id,
              city_id: datam.location ? datam.location.id : null,
              city: datam.location ? datam.location.title : '',
            };
          }),
        );
        const response = {
          result,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'HomepageService.getCityList',
      );
      throw error;
    }
  }

  async getCountries() {
    const result = [
      {
        id: 1,
        country_name: 'India',
      },
      {
        id: 2,
        country_name: 'UAE',
      },
    ];

    const response = {
      result,
    };
    return this.responses.successResponse(response);
  }
}
