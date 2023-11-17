import { IsNotEmpty } from 'class-validator';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponsesData } from 'src/common/library/response.data';

import { Multer } from 'multer';
import * as fs from 'fs';
import { ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import slugify from 'slugify';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { promisify } from 'util';
import { DeleteEventDto } from './dto/deleteEvent.dto';
import { CreateEventDto } from './dto/createEvent.dto';
import { EventRepositoryInterface } from './interface/event.repository.interface';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { GetEventDto } from './dto/getEvent.dto';
import { GetAllEventDto } from './dto/getAllEvent.dto';
import * as randomstring from 'randomstring';
import { EventResponseData } from './response/event-response';
import { EventTicketRepositoryInterface } from '../event_ticket/interface/eventticket.repository.interface';
import { EventSponsorRepositoryInterface } from './interface/eventsponsor.repository.interface';
import { TicketTypeRepositoryInterface } from '../ticket_type/interface/tickettype.repository.interface';
import { UserRepositoryInterface } from '../user/interface/user.repository.interface';
import { CategoryRepositoryInterface } from 'src/category/interface/category.repository.interface';
import { SubEventRepositoryInterface } from './interface/subevent.repository.interface';
import { Between } from 'typeorm';
import { constants } from 'src/common/enum/constants.enum';
import { LocationRepositoryInterface } from 'src/location/interface/location.repository.interface';
import { BookingRepositoryInterface } from 'src/booking/interface/booking.repository.interface';
import { UserRole } from 'src/common/enum/user-role.enum';

@Injectable()
export class EventService {
  constructor(
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private eventResponseData: EventResponseData,
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
    @Inject('EventSponsorRepositoryInterface')
    private readonly eventSponsorsRepository: EventSponsorRepositoryInterface,
    @Inject('TicketTypeRepositoryInterface')
    private readonly TicketTypeRepository: TicketTypeRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    @Inject('SubEventRepositoryInterface')
    private readonly subEventRepository: SubEventRepositoryInterface,
    @Inject('LocationRepositoryInterface')
    private readonly locationRepository: LocationRepositoryInterface,
    @Inject('BookingRepositoryInterface')
    private readonly bookingRepository: BookingRepositoryInterface,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,

    request,
  ): Promise<any> {
    const {
      title,
      organizer_id,
      category_id,
      country_id,
      city_id,
      venue,
      venue_latitude,
      venue_longitude,
      map_url,
      event_description,
      featured_image,
      banner_image,
      event_date_from,
      event_date_to,
      event_time_from,
      event_time_to,
      total_seats,
      agent_commission,
      single_ticket_price,
      event_type,
      about_the_event,
      detailed_address,
      contact_ph,
      contact_email,
      event_subscription_status,
      additional_venue_address,
      about_the_event_title,
      ticket_type_prices,
      sponsors,
      questionnaire_form_id,
      sub_events,
      agent_ids,
    } = createEventDto;
    try {
      const isTitleExist = await this.eventRepository.findByCondition({
        title: title,
      });
      const getMerchantId = await this.commonServices.getMerchantId(
        request.user.merchant,
      );
      if (ticket_type_prices && ticket_type_prices.length == 0) {
        return this.responses.errorResponse(
          'Please provide at least 1 ticket price details',
        );
      }

      //Check if the organizer id exist or not
      if (request.user.role_id == UserRole.SUPERADMIN) {
        const isOrganizerExist = await this.userRepository.findByCondition({
          id: organizer_id,
        });
        if (isOrganizerExist.length == 0)
          return this.responses.errorResponse('The organizer does not exists');
      }
      //Check if the category id exist or not

      const isCategoryExist = await this.categoryRepository.findByCondition({
        id: category_id,
      });
      if (isCategoryExist.length == 0)
        return this.responses.errorResponse('The category does not exists');
      const isCityExist = await this.locationRepository.findByCondition({
        id: city_id,
        country_id: country_id,
      });
      if (isCityExist.length == 0)
        return this.responses.errorResponse(
          'The city with country does not exists',
        );

      // let sponsors_result;
      //..Find out the organizer ID..//
      let organizer;
      if (request.user.role_id) {
        if (request.user.role_id == UserRole.ORGANIZER)
          organizer = request.user.user_id;
        else if (request.user.role_id == UserRole.SUPERADMIN)
          organizer = organizer_id;
        else organizer = organizer_id;
      }

      const event = {
        title: title,
        event_code: this.generateEventCode(),
        organizer_id: organizer,
        category_id: category_id,
        country_id: country_id,
        city_id: city_id,
        venue: venue,
        venue_latitude: venue_latitude,
        venue_longitude: venue_longitude,
        map_url: map_url,
        event_description: event_description,
        featured_image: featured_image,
        banner_image: banner_image,
        event_date_from: event_date_from,
        event_date_to: event_date_to,
        event_time_from: event_time_from,
        event_time_to: event_time_to,
        total_seats: total_seats,
        available_seats: total_seats, // Initialy all seats are available
        created_by: request.user.user_id,
        merchant_id: getMerchantId,
        status: 1,
        agent_commission: agent_commission,
        single_ticket_price: single_ticket_price,
        event_type: event_type,
        event_ticket_status: 3, //1- selling fast,2-sold out 3- selling low
        about_the_event: about_the_event,
        detailed_address: detailed_address,
        contact_ph: contact_ph,
        contact_email: contact_email,
        event_subscription_status: event_subscription_status,
        additional_venue_address: additional_venue_address,
        about_the_event_title: about_the_event_title,
        form_id: questionnaire_form_id,
        agent_ids: agent_ids.join(','),
      };

      // return 1;

      const data = await this.eventRepository.save(event);

      //event code save
      if (data.id) {
        const generateEventCode = await this.checkEventCode();
        const updatedEvent = await this.eventRepository.update(data.id, {
          event_code: generateEventCode,
        });
      }

      // update Event Ticket
      let eventTicketResult;

      if (ticket_type_prices && ticket_type_prices.length > 0) {
        let totalTicketCount = 0;
        await Promise.all(
          ticket_type_prices.map(async (ticket_type_price: any) => {
            totalTicketCount += ticket_type_price.ticket_count;
          }),
        );
        if (totalTicketCount > total_seats) {
          return this.responses.errorResponse(
            'The ticket type count must be less than or equal to total seats.',
          );
        }
        if (Array.isArray(ticket_type_prices)) {
          const validationErrors = [];

          await Promise.all(
            ticket_type_prices.map(async (ticket_type_price: any) => {
              const ticketTypeData =
                await this.TicketTypeRepository.findOneById(
                  ticket_type_price.id,
                );
              if (event_subscription_status == 1) {
                if (ticket_type_price.price !== 0) {
                  validationErrors.push(
                    'Free Event! The ticket type price must be equal to 0.',
                  );
                  // return this.responses.errorResponse(
                  //   'Free Event! The ticket type price must be equal to 0.',
                  // );
                }
              }

              let ticket_type_priceData = {
                event_id: data.id,
                ticket_type_id: ticket_type_price.id,
                title: ticketTypeData.title,
                description: ticketTypeData.description,
                price: ticket_type_price.price,
                ticket_count: ticket_type_price.ticket_count,
                created_by: request.user.user_id,
                status: 1,
              };
              eventTicketResult = await this.eventTicketRepository.save(
                ticket_type_priceData,
              );
            }),
          );
          // Check if there are validation errors
          if (validationErrors.length > 0) {
            return this.responses.errorResponse(validationErrors.join('\n'));
          }
        }
      }

      // ...

      // Save sponsors
      let sponsors_result;
      if (sponsors && sponsors.length > 0) {
        if (Array.isArray(sponsors)) {
          await Promise.all(
            sponsors.map(async (sponsor: any) => {
              let sponsorData = {
                event_id: data.id,
                name: sponsor.name ? sponsor.name : '',
                image: sponsor.image ? sponsor.image : '',
                created_by: request.user.user_id,
                status: 1,
              };
              // Await the save operation here
              sponsors_result = await this.eventSponsorsRepository.save(
                sponsorData,
              );
            }),
          );
        }
      }

      //Save Subevents

      let subevent_result;
      if (sub_events.length > 0) {
        if (Array.isArray(sub_events)) {
          await Promise.all(
            sub_events.map(async (sub_event: any) => {
              let subEventData = {
                event_id: data.id,
                title: sub_event.title ? sub_event.title : '',
                description: sub_event.description ? sub_event.description : '',
                image: sub_event.image ? sub_event.image : '',
                form_id:
                  sub_event.sub_event_form_id ?? sub_event.sub_event_form_id,
                status: 1,
              };
              subevent_result = await this.subEventRepository.save(
                subEventData,
              );
            }),
          );
        }
      }
      console.log(eventTicketResult);
      /*code ends here*/
      if (data && eventTicketResult && subevent_result) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(error.message, error.stack, 'EventService.createEvent');
      return this.responses.errorResponse(error);
    }
  }

  async findAllEvent(
    {
      search,
      page,
      limit,
      category_id,
      filter_date,
      country_id,
      city_id,
      sort_by_date,
      sort_by_price,
      event_type,
      status,
    }: GetAllEventDto,
    request,
  ) {
    try {
      const queryCondition: any = search ? { title: ILike(`%${search}%`) } : {};

      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      const relations: string[] = [
        'users',
        // "organizers",
        'category',
        'location',
      ];
      if (event_type && event_type === 'Online') {
        queryCondition.event_type = 1;
      }
      if (event_type && event_type === 'Offline') {
        queryCondition.event_type = 2;
      }

      //Sort string : sort by date
      let sort_string;
      if (sort_by_date) {
        sort_by_date == 1
          ? (sort_string = 'event_date_from:asc')
          : (sort_string = 'event_date_from:desc');
      }
      //Sort string : sort by price
      if (sort_by_price) {
        sort_by_price == 1
          ? (sort_string = 'single_ticket_price:asc')
          : (sort_string = 'single_ticket_price:desc');
      }

      if (filter_date) {
        const startDate = new Date(`${filter_date} 00:00:00.000000`);
        const endDate = new Date(`${filter_date} 23:59:59.999999`);

        queryCondition.event_date_from = LessThanOrEqual(endDate); // event_date_from <= endDate
        queryCondition.event_date_to = MoreThanOrEqual(startDate); // event_date_to >= startDate
      }
      const data =
        await this.eventRepository.findByConditionWithPaginationAndJoin(
          {
            ...queryCondition,
            category_id: category_id ? category_id : null,
            country_id: country_id ? country_id : null,
            city_id: city_id ? city_id : null,
            status: status ? status : null,
          },
          offset,
          lmt,
          sort_string,
          relations,
        );
      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };

      // //Filtering
      // //
      // let filterData;
      // if (filters) {
      //   filters.map(async (filterBy: any) => {
      //     console.log('cat i' + filterBy.categories);
      //     if (filterBy.categories)
      //       filterBy.categories.map(async (filterByCategories: any) => {
      //         // filterby Categories
      //         console.log('cat ids' + filterByCategories);
      //         filterData = { category_id: filterByCategories };
      //       });
      //   });
      // }
      // console.log(data);
      if (data) {
        if (request.user && request.user.role_id) {
          //FROM ADMIN || ORGANIZER
          const result = await this.eventResponseData.getAllResponse(
            data.data,
            request.user.role_id,
            request.user.user_id,
          );
          const response = {
            result,
            pagination,
          };
          return this.responses.successResponse(response);
        } else {
          // FROM WEBSITE
          const result = await this.eventResponseData.getAllResponse(
            data.data,
            2,
            0,
          );
          const response = {
            result,
            pagination,
          };
          return this.responses.successResponse(response);
        }
      }

      // return this.responses.errorResponse("Something went wrong");
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventService.findAllEvent',
      );
      throw error;
    }
  }
  async findEventById({ event_id }: GetEventDto, request) {
    try {
      const relations: string[] = [
        'users',
        // "organizers",
        'category',
        'location',
        'countries',
      ];
      const queryCondition = event_id ? { id: event_id } : {};
      const data = await this.eventRepository.findOneByIdWithJoin(
        queryCondition,
        relations,
      );
      //For getting event sponsor data
      const eventSponsors = await this.eventSponsorsRepository.findByCondition({
        event_id: event_id,
      });
      let eventSponsorsData;
      if (eventSponsors.length > 0) {
        eventSponsorsData = eventSponsors.map((eventSponsor: any) => {
          return {
            name: eventSponsor.name,
            image: eventSponsor.image
              ? `${constants.IMAGE_BASE_URL}` + eventSponsor.image
              : '',
          };
        });
      }
      //For getting event ticket data

      const eventTickets = await this.eventTicketRepository.findByCondition({
        event_id: event_id,
      });

      const eventTicketData =
        eventTickets.length > 0
          ? await Promise.all(
              eventTickets.map(async (eventTicket: any) => {
                const ticket_name = await this.commonServices.getTicketType(
                  eventTicket.ticket_type_id,
                );
                return {
                  id: eventTicket.ticket_type_id,
                  // ticket_type: ticket_name,
                  // title: eventTicket.title,
                  //description: eventTicket.description,
                  ticket_count: eventTicket.ticket_count,
                  price: eventTicket.price,
                };
              }),
            )
          : [];

      //For getting subevents data
      const subEvents = await this.subEventRepository.findByCondition({
        event_id: event_id,
      });
      let subEventData;
      if (subEvents.length > 0) {
        subEventData = subEvents.map((subEvent: any) => {
          return {
            title: subEvent.title,
            description: subEvent.description,
            image: subEvent.image,
          };
        });
      }

      if (data) {
        if (request.user && request.user.role_id) {
          const result = this.eventResponseData.getByIdResponse(
            data.data,
            request.user.role_id,
            eventSponsorsData,
            eventTicketData,
            subEventData,
            request.user.user_id,
          );
          return this.responses.successResponse(result);
        } else {
          const result = this.eventResponseData.getByIdResponse(
            data.data,
            2,
            eventSponsorsData,
            eventTicketData,
            subEventData,
            0,
          );
          return this.responses.successResponse(result);
        }
      } else return this.responses.errorResponse('Event not found');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'EventService.findEventById',
      );
      throw error;
    }
  }

  async updateEvent(
    UpdateEventDto: UpdateEventDto,

    request,
  ): Promise<any> {
    try {
      const {
        event_id,
        title,
        total_seats,
        organizer_id,
        category_id,
        country_id,
        city_id,
        venue,
        venue_latitude,
        venue_longitude,
        map_url,
        event_description,
        featured_image,
        banner_image,
        event_date_from,
        event_date_to,
        event_time_from,
        event_time_to,
        status,
        agent_commission,
        single_ticket_price,
        event_type,

        about_the_event,
        detailed_address,
        contact_ph,
        contact_email,
        event_subscription_status,
        additional_venue_address,
        about_the_event_title,
        ticket_type_prices,
        questionnaire_form_id,
        sponsors,
        sub_events,
        agent_ids,
      } = UpdateEventDto;

      const event_exist = await this.eventRepository.findByCondition({
        id: event_id,
      });
      if (event_exist.length < 1) {
        return this.responses.errorResponse('Event not found');
      }
      if (ticket_type_prices && ticket_type_prices.length == 0) {
        return this.responses.errorResponse(
          'Please provide at least 1 ticket price details',
        );
      }
      //Check if the organizer id exist or not
      if (request.user.role_id == UserRole.SUPERADMIN) {
        const isOrganizerExist = await this.userRepository.findByCondition({
          id: organizer_id,
        });
        if (isOrganizerExist.length == 0)
          return this.responses.errorResponse('The organizer does not exists');
      }
      //Check if the category id exist or not

      const isCategoryExist = await this.categoryRepository.findByCondition({
        id: category_id,
      });
      if (isCategoryExist.length == 0)
        return this.responses.errorResponse('The category does not exists');
      const isCityExist = await this.locationRepository.findByCondition({
        id: city_id,
        country_id: country_id,
      });
      if (isCityExist.length == 0)
        return this.responses.errorResponse(
          'The city with country does not exists',
        );
      //..Find out the organizer ID..//
      let organizer;
      if (request.user.role_id) {
        if (request.user.role_id == UserRole.ORGANIZER)
          organizer = request.user.user_id;
        else if (request.user.role_id == UserRole.SUPERADMIN)
          organizer = organizer_id;
        else organizer = organizer_id;
      }
      const eventData = {
        title: title,
        //event_code: this.generateEventCode(),
        organizer_id: organizer,
        category_id: category_id,
        country_id: country_id,
        city_id: city_id,
        venue: venue,
        venue_latitude: venue_latitude,
        venue_longitude: venue_longitude,
        map_url: map_url,
        event_description: event_description,
        event_date_from: event_date_from,
        event_date_to: event_date_to,
        event_time_from: event_time_from,
        event_time_to: event_time_to,
        featured_image: featured_image,
        banner_image: banner_image,
        total_seats: total_seats,
        created_by: request.user.user_id,
        agent_commission: agent_commission,
        single_ticket_price: single_ticket_price,
        event_type: event_type,
        event_ticket_status: 3, // upcoming
        about_the_event: about_the_event,
        detailed_address: detailed_address,
        // contact_details: contact_details,
        contact_ph: contact_ph,
        contact_email: contact_email,
        event_subscription_status: event_subscription_status,
        additional_venue_address: additional_venue_address,
        about_the_event_title: about_the_event_title,
        form_id: questionnaire_form_id,
        status: status,
        agent_ids: agent_ids.join(','),
      };

      const updatedEvent = await this.eventRepository.update(
        event_id,
        eventData,
      );

      //Also update Event Ticket
      //delete the event tickets
      const eventTicketIdsData = [];
      let eventTicketIds = await this.eventTicketRepository.findByCondition({
        event_id: event_id,
      });

      for (const eventId of eventTicketIds) {
        eventTicketIdsData.push({
          id: eventId.id,
        });
      }
      for (const eventTicketId of eventTicketIdsData) {
        const deleteResult = await this.eventTicketRepository.delete(
          eventTicketId,
        );
      }

      //Update event ticket prices
      // update Event Ticket
      let eventTicketResult;
      if (ticket_type_prices.length > 0) {
        let totalTicketCount = 0;
        await Promise.all(
          ticket_type_prices.map(async (ticket_type_price: any) => {
            totalTicketCount += ticket_type_price.ticket_count;
          }),
        );
        if (totalTicketCount > total_seats) {
          return this.responses.errorResponse(
            'The ticket type count must be less than or equal to total seats.',
          );
        }

        if (Array.isArray(ticket_type_prices)) {
          const validationErrors = [];
          ticket_type_prices.map(async (ticket_type_price: any) => {
            const ticketTypeData = await this.TicketTypeRepository.findOneById(
              ticket_type_price.id,
            );
            if (event_subscription_status == 1) {
              if (ticket_type_price.price != 0) {
                validationErrors.push(
                  'Free Event! The ticket type price must be equal to 0.',
                );
                // return this.responses.errorResponse(
                //   'Free Event! The ticket type price must be equal to 0.',
                // );
              }
            }
            let ticket_type_priceData = {
              event_id: event_id,
              ticket_type_id: ticket_type_price.id,
              title: ticketTypeData.title,
              description: ticketTypeData.description,
              price: ticket_type_price.price,
              ticket_count: ticket_type_price.ticket_count,
              created_by: request.user.user_id,
              status: 1,
            };
            eventTicketResult = this.eventTicketRepository.save(
              ticket_type_priceData,
            );
          });
          if (validationErrors.length > 0) {
            return this.responses.errorResponse(validationErrors.join('\n'));
          }
        }
      }

      //Save event sponsors /*Delete already created sponsors
      const eventSponsorIdsData = [];
      let eventSponsorIds = await this.eventSponsorsRepository.findByCondition({
        event_id: event_id,
      });

      for (const eventSponsorId of eventSponsorIds) {
        eventSponsorIdsData.push({
          id: eventSponsorId.id,
        });
      }
      for (const eventSponsorId of eventSponsorIdsData) {
        const deleteResultSponsor = await this.eventSponsorsRepository.delete(
          eventSponsorId,
        );
      }
      //update event sponsor
      let sponsors_result;
      if (sponsors.length > 0) {
        if (Array.isArray(sponsors)) {
          sponsors.map((sponsor: any) => {
            let sponsorData = {
              event_id: event_id,
              name: sponsor.name ? sponsor.name : '',
              image: sponsor.image ? sponsor.image : '',
              created_by: request.user.user_id,
              status: 1,
            };
            sponsors_result = this.eventSponsorsRepository.save(sponsorData);
          });
        }
      }

      //Save Subevents /*Delete already created subevents
      const subEventsIdsData = [];
      let subEventIds = await this.subEventRepository.findByCondition({
        event_id: event_id,
      });

      for (const subEventId of subEventIds) {
        subEventsIdsData.push({
          id: subEventId.id,
        });
      }
      for (const subEventsId of subEventsIdsData) {
        const deleteResultSubEvent = await this.subEventRepository.delete(
          subEventsId,
        );
      }

      let subevent_result;
      if (sub_events.length > 0) {
        if (Array.isArray(sub_events)) {
          await Promise.all(
            sub_events.map(async (sub_event: any) => {
              let subEventData = {
                event_id: event_id,
                title: sub_event.title ? sub_event.title : '',
                description: sub_event.description ? sub_event.description : '',
                image: sub_event.image ? sub_event.image : '',
                form_id:
                  sub_event.sub_event_form_id ?? sub_event.sub_event_form_id,
                status: 1,
              };
              subevent_result = await this.subEventRepository.save(
                subEventData,
              );
            }),
          );
        }
      }

      if (updatedEvent.affected > 0 && eventTicketResult) {
        return this.responses.successResponse(eventData);
      } else {
        return this.responses.errorResponse('Something went wrong');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'EventService.updateEvent');
      throw error;
    }
  }

  async deleteEvent({ event_ids }: DeleteEventDto) {
    try {
      const checkExist = await this.commonServices.checkIdsExist(
        event_ids,
        this.eventRepository,
      );
      if (!checkExist)
        return this.responses.errorResponse(
          'please ensure that the current statuses of the given events are active.',
        );

      const results = [];
      const delresults = [];
      for (const eventId of event_ids) {
        //Check if the organizer id exist or not
        const isCategoryExistEvent =
          await this.bookingRepository.findByCondition({
            event_id: eventId,
          });
        if (isCategoryExistEvent.length > 0)
          return this.responses.errorResponse(
            'You can not delete this event,because this event have some bookings',
          );

        const isExist = await this.eventRepository.findOneById(eventId);
        if (!isExist)
          results.push({
            id: eventId,
            status: false,
            message: 'Deletion Failed',
          });

        //delete the event ticket also
        const eventTicketIdsData = [];
        let eventTicketIds = await this.eventTicketRepository.findByCondition({
          event_id: eventId,
        });

        for (const eventId of eventTicketIds) {
          eventTicketIdsData.push({
            id: eventId.id,
          });
        }
        for (const eventTicketId of eventTicketIdsData) {
          const deleteResult = await this.eventTicketRepository.delete(
            eventTicketId,
          );
        }

        const eventSponsorIdsData = [];

        let eventSponsorIds =
          await this.eventSponsorsRepository.findByCondition({
            event_id: eventId,
          });

        for (const eventSponsorId of eventSponsorIds) {
          eventSponsorIdsData.push({
            id: eventSponsorId.id,
          });
        }

        for (const eventSponsorId of eventSponsorIdsData) {
          const deleteResultSponsor = await this.eventSponsorsRepository.delete(
            eventSponsorId,
          );
        }
        const deleteResult = await this.eventRepository.delete(eventId);
        // console.log(deleteResult);
        if (deleteResult) {
          results.push({
            id: eventId,
            status: true,
            message: 'Successfully deleted',
          });
        } else {
          results.push({
            id: eventId,
            status: false,
            message: 'Deletion Failed',
          });
        }
      }
      console.log(delresults);
      const allDeletedSuccessfully = delresults.every(
        (result) => result.success,
      );
      if (allDeletedSuccessfully) {
        return this.responses.successResponse(
          {},
          'Events deleted successfully',
        );
      } else {
        return this.responses.errorResponse('Deletion Failed');
      }
    } catch (error) {
      this.logger.error(error.message, error.stack, 'EventService.deleteEvent');
      throw error;
    }
  }

  // generateEventCode(): string {
  //   return 'MEE' + Date.now();
  // }

  generateEventCode() {
    const characters = '0123456789';
    let code = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return 'MFE' + code;
  }
  async checkEventCode() {
    const eventCode = this.generateEventCode();
    const checkCode = await this.eventRepository.findByCondition({
      event_code: eventCode,
    });
    if (checkCode.length > 0) {
      this.checkEventCode();
    }
    return eventCode;
  }
}
