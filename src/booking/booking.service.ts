import { IsNotEmpty } from 'class-validator';
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponsesData } from 'src/common/library/response.data';
import * as dateFns from 'date-fns';

import { Multer } from 'multer';
import * as fs from 'fs';
import { ILike } from 'typeorm';
import slugify from 'slugify';
import { CommonValidation } from 'src/common/library/commonvalidation.data';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { CommonServices } from 'src/common/services/common.service';
import { CreateBookingDto } from './dto/createbooking.dto';
import { BookingRepositoryInterface } from './interface/booking.repository.interface';
import { Status } from 'src/common/enum/status.enum';
import { CouponRepositoryInterface } from 'src/admin/coupon/interface/coupon.repository.interface';
import { EventTicketRepositoryInterface } from 'src/admin/event_ticket/interface/eventticket.repository.interface';
import { BookingCouponRepositoryInterface } from './interface/bookingcoupon.repository.interface';
import { BookingTicketTypeRepositoryInterface } from './interface/bookingtickettype.repository.interface';
import { BookingAdditionalUserEntity } from 'src/typeOrm/entities/BookingAdditionalUsers';
import { BookingAdditionalUserRepositoryInterface } from './interface/bookingadditionaluser.repositoy.interface';
import { DataSource } from 'typeorm';
import { BookingEntity } from 'src/typeOrm/entities/Booking';
import { BookingCouponEntity } from 'src/typeOrm/entities/BookingCoupon';
import { BookingEventTicketEntity } from 'src/typeOrm/entities/BookingTicketTypes';
import { GetBookingDto } from './dto/getbooking.dto';
import { BookingResponseData } from './response/bookingresponse';
import { off } from 'process';
import { GetBookingByIdDto } from './dto/getbookingbyid.dto';
import { UpdateBookingDto } from './dto/updatebooking.dto';
import { BookingQuestionAnswerRepository } from 'src/repositories/bookingquestionanswer.repository';
import { BookingQuestionAnswerEntity } from 'src/typeOrm/entities/BookingQuestionAnswers';
import { EventRepositoryInterface } from 'src/admin/event/interface/event.repository.interface';
import { GetBookingHistoryDto } from './dto/getbookinghistory.dto';
import { CancelBookingByIdDto } from './dto/cancelBookingByIdDto.dto';
import { EventEntity } from 'src/typeOrm/entities/Event';
import { CategoryRepositoryInterface } from 'src/category/interface/category.repository.interface';
import { TicketTypeRepositoryInterface } from 'src/admin/ticket_type/interface/tickettype.repository.interface';
import { UserRepositoryInterface } from 'src/user/interface/user.repository.interface';
import { constants } from 'src/common/enum/constants.enum';
import { SubEventParticipateRepositoryInterface } from 'src/admin/sub_event/interface/subevent_participate.repository.interface';
import { SubEventQuestionAnswerRepositoryInterface } from 'src/admin/sub_event/interface/subevent_event_question_answer.repository.interface';
@Injectable()
export class BookingService {
  constructor(
    private responses: ResponsesData,
    private commonValidation: CommonValidation,
    private readonly logger: Logger,
    private commonServices: CommonServices,
    private bookingResponse: BookingResponseData,
    @Inject('BookingRepositoryInterface')
    private readonly bookingRepository: BookingRepositoryInterface,
    @Inject('CouponRepositoryInterface')
    private readonly couponRepository: CouponRepositoryInterface,
    @Inject('EventTicketRepositoryInterface')
    private readonly eventTicketRepository: EventTicketRepositoryInterface,
    @Inject('BookingCouponRepositoryInterface')
    private readonly bookingCouponRepository: BookingCouponRepositoryInterface,
    @Inject('BookingTicketTypeRepositoryInterface')
    private readonly bookingTicketTypeRepository: BookingTicketTypeRepositoryInterface,
    @Inject('BookingAdditionalUserRepositoryInterface')
    private readonly bookingAdditionalUserRepository: BookingAdditionalUserRepositoryInterface,
    private readonly dataSource: DataSource,
    @Inject('BookingQuestionAnswerRepositoryInterface')
    private readonly bookingQuestionAnswerRepository: BookingQuestionAnswerRepository,
    @Inject('EventRepositoryInterface')
    private readonly eventRepository: EventRepositoryInterface,
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,
    @Inject('TicketTypeRepositoryInterface')
    private readonly TicketTypeRepository: TicketTypeRepositoryInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('SubEventParticipateRepositoryInterface')
    private readonly subEventParticipateRepository: SubEventParticipateRepositoryInterface,
    @Inject('SubEventQuestionAnswerRepositoryInterface')
    private readonly subEventQuestionAnswerRepository: SubEventQuestionAnswerRepositoryInterface,
  ) {}

  async createBooking(
    createCouponDto: CreateBookingDto,
    request,
  ): Promise<any> {
    const {
      user_id,
      people,
      coupon_code,
      event_id,
      event_ticket_type_id,
      ticket_count,
      question_answers,
    } = createCouponDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let totalPrice;
      let getTicketTypeDetails;
      let isAlreadyBooked;
      let isCouponAlreadyUsed;
      let getCouponDetails;
      const currentDate = new Date();
      const checkFreeEvent = await this.eventRepository.findByCondition({
        id: event_id,
        status: Status.Active,
      });
      if (
        checkFreeEvent.length > 0 &&
        checkFreeEvent[0].event_subscription_status === 1
      ) {
        [isAlreadyBooked, getTicketTypeDetails] = await Promise.all([
          this.bookingRepository.findByCondition({
            user_id: user_id,
            coupon_code: coupon_code,
            event_id: event_id,
            status: Status.Active,
          }),
          this.eventTicketRepository.findByCondition({
            id: event_ticket_type_id,
            status: Status.Active,
          }),
        ]);

        // if (isAlreadyBooked.length > 0)
        //   return this.responses.errorResponse('Already booked');

        totalPrice = 0;
      } else if (coupon_code) {
        [
          isCouponAlreadyUsed,
          isAlreadyBooked,
          getCouponDetails,
          getTicketTypeDetails,
        ] = await Promise.all([
          this.bookingRepository.findByCondition({
            user_id: user_id,
            coupon_code: coupon_code,
            status: Status.Active,
          }),
          this.bookingRepository.findByCondition({
            user_id: user_id,
            coupon_code: coupon_code,
            event_id: event_id,
            status: Status.Active,
          }),
          this.couponRepository.findByCondition({
            coupon_code: coupon_code,
            status: Status.Active,
          }),
          this.eventTicketRepository.findByCondition({
            id: event_ticket_type_id,
            status: Status.Active,
          }),
        ]);

        // if (isAlreadyBooked.length > 0)
        //   return this.responses.errorResponse('Already booked');

        if (getCouponDetails.length < 1)
          return this.responses.errorResponse('Coupon not exist');

        if (isCouponAlreadyUsed.length > 0)
          return this.responses.errorResponse('Coupon already used');

        //need to discuss
        // if (getCouponDetails[0].minimum_coupon_redeem_count < 1)
        //   return this.responses.errorResponse('Redeem count exceeded');

        if (getTicketTypeDetails.length < 1)
          return this.responses.errorResponse('Ticket not exist');
        const isValid = await this.commonServices.isCouponValid(
          getCouponDetails[0].coupon_code_duration_from,
          getCouponDetails[0].coupon_code_duration_to,
        );
        if (!isValid) return this.responses.errorResponse('Coupon not valid');

        const totalPriceBeforeDiscount =
          getTicketTypeDetails[0].price * ticket_count;
        let discountAmount: number;
        if (getCouponDetails[0].discount_type === 1) {
          discountAmount =
            totalPriceBeforeDiscount *
            (getCouponDetails[0].discount_value / 100);
          totalPrice = totalPriceBeforeDiscount - discountAmount;
        } else {
          totalPrice =
            totalPriceBeforeDiscount - getCouponDetails[0].discount_value;
        }
      } else {
        [isAlreadyBooked, getTicketTypeDetails] = await Promise.all([
          this.bookingRepository.findByCondition({
            user_id: user_id,
            event_id: event_id,
            status: Status.Active,
          }),
          this.eventTicketRepository.findByCondition({
            id: event_ticket_type_id,
            status: Status.Active,
          }),
        ]);

        // if (isAlreadyBooked.length > 0)
        //   return this.responses.errorResponse('Already booked');

        if (getTicketTypeDetails.length < 1)
          return this.responses.errorResponse('Ticket not exist');

        totalPrice = getTicketTypeDetails[0].price * ticket_count;
      }

      if (getTicketTypeDetails.length > 0) {
        const checkEvent = await this.eventRepository.findByCondition({
          id: getTicketTypeDetails[0].event_id,
          status: Status.Active,
        });
        if (checkEvent.length > 0) {
          const eventDate = new Date(checkEvent[0].event_date_from);
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          const day = currentDate.getDate();
          const formattedCurrentDate = `${year}-${month
            .toString()
            .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

          const eventYear = eventDate.getFullYear();
          const eventMonth = eventDate.getMonth() + 1;
          const eventDay = eventDate.getDate();
          const formattedEventDate = `${eventYear}-${eventMonth
            .toString()
            .padStart(2, '0')}-${eventDay.toString().padStart(2, '0')}`;

          if (formattedEventDate <= formattedCurrentDate)
            return this.responses.errorResponse(
              'Cannot book this event! Already completed',
            );
        } else {
          return this.responses.errorResponse('Event not exist');
        }
      }

      const count = ticket_count - 1;
      if (ticket_count - 1 > 1 && people && people.length != ticket_count)
        return this.responses.errorResponse(
          'Please provide ' + `${count}` + ' additional user details',
        );
      if (question_answers.length > 0) {
        const qstnValidation =
          await this.commonServices.questionAnsweValidationBooking(
            event_id,
            question_answers,
          );
        if (qstnValidation === 0)
          return this.responses.errorResponse('Forms not found');
        if (qstnValidation === 1)
          return this.responses.errorResponse('Please answer all questions');
        if (qstnValidation === 2)
          return this.responses.errorResponse(
            'Only answer the prefered form questions',
          );
      }
      const merchant = await this.commonServices.getMerchantId(
        request.user.merchant,
      );
      if (ticket_count > 0) {
        if (
          checkFreeEvent.length > 0 &&
          checkFreeEvent[0].available_seats === 0
        ) {
          return this.responses.errorResponse(
            'No Seats available for Booking the event',
          );
        } else if (
          checkFreeEvent.length > 0 &&
          ticket_count > checkFreeEvent[0].available_seats
        ) {
          return this.responses.errorResponse(
            'Seats not available.Please check ticket count!',
          );
        } else {
          const remainingSeats =
            checkFreeEvent[0].available_seats - ticket_count;
          const updateBooking = await this.eventRepository.update(
            checkFreeEvent[0].id,
            {
              available_seats: remainingSeats,
            },
          );
        }
      }
      const bookingData = {
        user_id: user_id,
        coupon_code: coupon_code ?? coupon_code,
        total_ticket_count: ticket_count,
        total_ticket_amount: totalPrice,
        event_id: event_id,
        merchant_id: merchant,
        created_by: request.user.user_id,
        event_ticket_type_id: event_ticket_type_id,
        status: 1,
      };
      const data = await queryRunner.manager
        .getRepository(BookingEntity)
        .save(bookingData);

      //.........Update event_ticket_status_id .......

      let seatCount = 0,
        status;

      const total_seats = await this.bookingRepository.findByCondition({
        event_id: event_id,
      });
      const eventInfo = await this.eventRepository.findByCondition({
        id: event_id,
      });

      total_seats.length > 0
        ? await Promise.all(
            total_seats.map(async (seat: any) => {
              seatCount = seatCount + seat.total_ticket_count;
            }),
          )
        : '';
      const total_seats_count = eventInfo[0].total_seats;
      if (seatCount == eventInfo[0].total_seats) status = 2; //Sold out
      const percentage = (seatCount / total_seats_count) * 100;
      if (percentage >= 50) status = 1; //Selling fast
      else if (percentage <= 50) status = 3; //selling slow
      // console.log('event_ticket_status ' + status);
      const updateEventStatus = await queryRunner.manager
        .getRepository(EventEntity)
        .update(event_id, {
          event_ticket_status: status,
        });

      //.......End Update event_ticket_status_id........

      if (coupon_code) {
        const bookingCouponData = {
          booking_id: data.id,
          coupon_id: getCouponDetails[0].id,
          coupon_name: getCouponDetails[0].coupon_name,
          coupon_code: coupon_code,
          discount_type: getCouponDetails[0].discount_type,
          discount_value: getCouponDetails[0].discount_value,
          minimum_discount_value: getCouponDetails[0].minimum_discount_value,
          coupon_code_duration_from:
            getCouponDetails[0].coupon_code_duration_from,
          coupon_code_duration_to: getCouponDetails[0].coupon_code_duration_to,
          minimum_coupon_redeem_count:
            getCouponDetails[0].minimum_coupon_redeem_count,
        };
        const dataCoupon = await queryRunner.manager
          .getRepository(BookingCouponEntity)
          .save(bookingCouponData);
      }
      // console.log(getTicketTypeDetails);
      const bookingTicketTypeData = {
        booking_id: data.id,
        event_ticket_type_id: event_ticket_type_id,
        event_id: event_id,
        ticket_type_id: getTicketTypeDetails[0].ticket_type_id,
        price: getTicketTypeDetails[0].price,
        status: 1,
      };

      //Qr code save
      if (data.id) {
        const generateQrCode = await this.commonServices.generateQrCode(
          data.id,
        );
        const generateBookingCode = await this.checkBookingCode();
        const updateBooking = await queryRunner.manager
          .getRepository(BookingEntity)
          .update(data.id, {
            qrcode_image: generateQrCode,
            booking_code: generateBookingCode,
          });
      }

      const dataTicket = await queryRunner.manager
        .getRepository(BookingEventTicketEntity)
        .save(bookingTicketTypeData);

      if (ticket_count >= 1 && people) {
        const saveUserPromises = people.map(async (user) => {
          const dataUser = {
            booking_id: data.id,
            user_name: user.name,
            age: user.age,
            gender: user.gender,
          };
          await queryRunner.manager
            .getRepository(BookingAdditionalUserEntity)
            .save(dataUser);
        });
        await Promise.all(saveUserPromises);
      }

      if (question_answers.length > 0) {
        const saveAnswersPromises = question_answers.map(async (qstn: any) => {
          const dataAnswers = {
            booking_id: data.id,
            question_id: qstn.question_id,
            option: qstn.option
              ? qstn.option.length > 0
                ? JSON.stringify(qstn.option)
                : null
              : null,
            text_answer: qstn.text_answer ?? null,
          };
          await queryRunner.manager
            .getRepository(BookingQuestionAnswerEntity)
            .save(dataAnswers);
        });
        await Promise.all(saveAnswersPromises);
      }

      await queryRunner.commitTransaction();
      if (data) {
        return this.responses.successResponse(data);
      }

      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        error.message,
        error.stack,
        'BookingService.createBooking',
      );
      return this.responses.errorResponse(error);
    } finally {
      await queryRunner.release();
    }
  }
  async getBooking(
    {
      user_id,
      event_id,
      event_ticket_type_id,
      page,
      limit,
      booking_id,
      search,
    }: GetBookingDto,
    request,
  ) {
    try {
      const queryCondition: any = search
        ? { coupon_code: ILike(`%${search}%`) }
        : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      if (event_id) {
        queryCondition.event_id = event_id;
      }
      if (event_ticket_type_id) {
        queryCondition.event_ticket_type_id = event_ticket_type_id;
      }
      if (booking_id) {
        queryCondition.id = booking_id;
      }
      const joinTables = [
        'user',
        'booking_additional_users',
        'booking_coupon',
        'booking_event_ticket_type',
        'events',
        'users',
      ];
      // console.log(queryCondition);
      const data =
        await this.bookingRepository.findWithDynamicJoinsAndPagination(
          queryCondition,
          offset,
          lmt,
          joinTables,
        );

      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = this.bookingResponse.getAllResponse(
          data.data,
          request.user.role_id,
          request.user.user_id,
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
        'BookingService.getBookings',
      );
      throw error;
    }
  }
  async getBookingById({ user_id, booking_id }: GetBookingByIdDto, request) {
    try {
      const joinTables = [
        'user',
        'booking_additional_users',
        'booking_coupon',
        'booking_event_ticket_type',
        'events',
        'users',
      ];
      const data = await this.bookingRepository.findOneWithDynamicJoins(
        booking_id,
        joinTables,
        { status: Status.Active },
      );

      const cat_name = await this.categoryRepository.findByCondition({
        id: data.events.category_id,
      });
      const ticket_type_name = await this.TicketTypeRepository.findByCondition({
        id: data.booking_event_ticket_type[0]?.ticket_type_id ?? '',
      });
      const userData = await this.userRepository.findByConditionWithDelete(
        {
          id: data.user_id,
        },
        true,
      );
      if (data) {
        const question_answer_data =
          await this.bookingQuestionAnswerRepository.findByCondition({
            booking_id: booking_id,
          });
        const sub_event_question_answer_data =
          await this.subEventQuestionAnswerRepository.findByCondition({
            booking_id: booking_id,
          });

        const result = await this.bookingResponse.getiDResponse(
          data,
          request.user.role_id,
          cat_name,
          ticket_type_name,
          userData,
          request.user.user_id,
          question_answer_data,
          sub_event_question_answer_data,
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
        'BookingService.getBookings',
      );
      throw error;
    }
  }
  async updateBooking({}: UpdateBookingDto, request) {}

  async getBookingHistory(
    {
      user_id,
      event_id,
      event_ticket_type_id,
      page,
      limit,
      booking_id,
      search,
    }: GetBookingHistoryDto,
    request,
  ) {
    try {
      if (
        /* validating whether the its a valid user */
        !(await this.commonValidation.validateUser(user_id))
      ) {
        return this.responses.errorResponse('User not found');
      }
      const queryCondition: any = search
        ? { booking_code: ILike(`%${search}%`) }
        : {};
      const offset = page ? page : 1;
      const lmt = limit ? limit : 12;
      if (user_id) {
        queryCondition.user_id = user_id;
      }
      if (event_id) {
        queryCondition.event_id = event_id;
      }
      if (event_ticket_type_id) {
        queryCondition.event_ticket_type_id = event_ticket_type_id;
      }
      if (booking_id) {
        queryCondition.id = booking_id;
      }
      const joinTables = [
        'user',
        'booking_additional_users',
        'booking_coupon',
        'booking_event_ticket_type',
        'events',
        'users',
        'location',
      ];
      let next_event = {};
      const currentDate = new Date();

      const data =
        await this.bookingRepository.findWithDynamicJoinsAndPagination(
          queryCondition,
          offset,
          lmt,
          joinTables,
        );
      const pagination = {
        offset: offset,
        limit: lmt,
        total: data.total,
      };
      if (data) {
        const result = await Promise.all(
          data.data.map(async (datam) => {
            const eventDate = new Date(datam.events.event_date_from);
            const eventToDate = new Date(datam.events.event_date_to);

            const cat_name = await this.categoryRepository.findByCondition({
              id: datam.events.category_id,
            });
            const ticket_type_name =
              await this.TicketTypeRepository.findByCondition({
                id: datam.booking_event_ticket_type[0]?.ticket_type_id ?? '',
              });
            if (eventDate > currentDate) {
              next_event = {
                id: datam.id,
                coupon_code: datam.coupon_code,
                ticket_count: datam.total_ticket_count,
                amount: datam.total_ticket_amount,
                booking_code: datam.booking_code,
                event: datam.events.title,
                event_id: datam.event_id,
                category_id: datam.events.category_id,
                category_name: cat_name[0] ? cat_name[0].title : '',
                city: datam.location ? datam.location.title : '',
                venue: datam.events.venue,
                venue_latitude: datam.events.venue_latitude,
                venue_longitude: datam.events.venue_longitude,
                map_url: datam.events.map_url,
                event_description: datam.events.event_description,
                // featured_image: datam.events.featured_image
                //   ? global.baseUrl +
                //     '/uploads/events/' +
                //     datam.events.featured_image
                //   : '',
                featured_image: datam.events.featured_image
                  ? `${constants.IMAGE_BASE_URL}` + datam.events.featured_image
                  : '',
                banner_image: datam.events.banner_image
                  ? `${constants.IMAGE_BASE_URL}` + datam.events.banner_image
                  : '',

                event_date_from: dateFns.format(
                  new Date(datam.events.event_date_from),
                  'MMMM dd,EEEE yyyy',
                ),
                event_date_to: dateFns.format(
                  new Date(datam.events.event_date_to),
                  'MMMM dd,EEEE yyyy',
                ),
                event_time_from: datam.events.event_time_from,
                event_time_to: datam.events.event_time_to,
                total_seats: datam.events.total_seats,
                available_seats: datam.events.available_seats,

                event_date_from_new: datam.events.event_date_from,
                event_date_to_new: datam.events.event_date_to,

                agent_commission: datam.events.agent_commission,
                single_ticket_price: datam.events.single_ticket_price,
                event_type: datam.events.event_type == 1 ? 'Online' : 'Offline',
                event_ticket_status:
                  datam.events.event_ticket_status == 1
                    ? 'Selling Fast'
                    : datam.events.event_ticket_status == 2
                    ? 'SoldOut'
                    : 'Upcoming', //need to implement the logic later
                event_period_status:
                  eventDate > new Date()
                    ? 'Upcoming'
                    : eventDate <= new Date() && eventToDate >= new Date()
                    ? 'On going'
                    : eventToDate < new Date()
                    ? 'Past'
                    : '',

                about_the_event: datam.events.about_the_event,
                detailed_address: datam.events.detailed_address,
                contact_details: datam.events.contact_details,
                event_subscription_status:
                  datam.events.event_subscription_status == 1
                    ? 'Free'
                    : datam.events.event_subscription_status == 2
                    ? 'Paid'
                    : '',
                event_ticket_type_name: ticket_type_name[0]
                  ? ticket_type_name[0].title
                  : '',
                additional_venue_address: datam.events.additional_venue_address,
                about_the_event_title: datam.events.about_the_event_title,
                created_by:
                  datam.users.first_name + ' ' + datam.users.last_name,
                status: datam.status == 1 ? 'Active' : 'Inactive',
                user: datam.user.first_name + '' + datam.user.last_name,
                ticket_price: datam.booking_event_ticket_type[0]?.price ?? '',
                coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
                discount_value: datam.booking_coupon[0]?.discount_value ?? '',
                minimum_discount_value:
                  datam.booking_coupon[0]?.minimum_discount_value ?? '',
                minimum_coupon_redeem_count:
                  datam.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
                additional_users: datam.booking_additional_users ?? [],

                event_status: eventDate >= currentDate ? 'Upcoming' : 'Past',
                qrcode_image: datam.qrcode_image,
                booking_status:
                  datam.booking_status == 1
                    ? 'Active'
                    : datam.booking_status == 2
                    ? 'Cancelled'
                    : '',
              };
            }
            return {
              id: datam.id,
              coupon_code: datam.coupon_code,
              ticket_count: datam.total_ticket_count,
              amount: datam.total_ticket_amount,
              event: datam.events.title,
              event_id: datam.event_id,
              city: datam.location ? datam.location.title : '',

              venue: datam.events.venue,
              venue_latitude: datam.events.venue_latitude,
              venue_longitude: datam.events.venue_longitude,
              map_url: datam.events.map_url,
              event_description: datam.events.event_description,

              featured_image: datam.events.featured_image
                ? `${constants.IMAGE_BASE_URL}` + datam.events.featured_image
                : '',
              banner_image: datam.events.banner_image
                ? `${constants.IMAGE_BASE_URL}` + datam.events.banner_image
                : '',
              event_date_from: dateFns.format(
                new Date(datam.events.event_date_from),
                'MMMM dd,EEEE yyyy',
              ),

              event_date_to: dateFns.format(
                new Date(datam.events.event_date_to),
                'MMMM dd,EEEE yyyy',
              ),
              event_time_from: datam.events.event_time_from,
              event_time_to: datam.events.event_time_to,
              total_seats: datam.events.total_seats,
              available_seats: datam.events.available_seats,

              agent_commission: datam.events.agent_commission,
              single_ticket_price: datam.events.single_ticket_price,
              event_type: datam.events.event_type == 1 ? 'Online' : 'Offline',
              event_ticket_status:
                datam.events.event_ticket_status == 1
                  ? 'Selling Fast'
                  : datam.events.event_ticket_status == 2
                  ? 'SoldOut'
                  : 'Upcoming', //need to implement the logic later
              event_period_status:
                eventDate > new Date()
                  ? 'Upcoming'
                  : eventDate <= new Date() && eventToDate >= new Date()
                  ? 'On going'
                  : eventToDate < new Date()
                  ? 'Past'
                  : '',
              about_the_event: datam.events.about_the_event,
              detailed_address: datam.events.detailed_address,
              contact_details: datam.events.contact_details,
              event_subscription_status:
                datam.events.event_subscription_status == 1
                  ? 'Free'
                  : datam.events.event_subscription_status == 2
                  ? 'Paid'
                  : '',
              event_ticket_type_name: ticket_type_name[0]
                ? ticket_type_name[0].title
                : '',
              additional_venue_address: datam.events.additional_venue_address,
              about_the_event_title: datam.events.about_the_event_title,
              created_by: datam.users.first_name + ' ' + datam.users.last_name,
              status: datam.status == 1 ? 'Active' : 'Inactive',
              user: datam.user.first_name + '' + datam.user.last_name,
              ticket_price: datam.booking_event_ticket_type[0]?.price ?? '',
              coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
              discount_value: datam.booking_coupon[0]?.discount_value ?? '',
              minimum_discount_value:
                datam.booking_coupon[0]?.minimum_discount_value ?? '',
              minimum_coupon_redeem_count:
                datam.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
              additional_users: datam.booking_additional_users ?? [],
              event_status: eventDate >= currentDate ? 'Upcoming' : 'Past',
              qrcode_image: datam.qrcode_image,
              booking_status:
                datam.booking_status == 1
                  ? 'Active'
                  : datam.booking_status == 2
                  ? 'Cancelled'
                  : '',
            };
          }),
        );
        const response = {
          result,
          next_event,
          pagination,
        };
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'BookingService.getBookings',
      );
      throw error;
    }
  }
  async cancelBooking({ booking_id }: CancelBookingByIdDto, request) {
    try {
      let event_info;
      //Check if booking id exists
      const isExist = await this.bookingRepository.findOneById(booking_id);
      if (!isExist) {
        return this.responses.errorResponse('Please select a valid booking ID');
      }
      //Check if booking already exists
      const booking_info = await this.bookingRepository.findByCondition({
        id: booking_id,
      });
      // console.log(booking_info.length);
      if (booking_info[0].booking_status === 2) {
        return this.responses.errorResponse(
          'Already this booking is cancelled',
        );
      }
      if (booking_info) {
        //Check if booking cancellation possible in event day
        event_info = await this.eventRepository.findByCondition({
          id: booking_info[0].event_id,
        });
        if (event_info[0].event_date_from <= new Date()) {
          return this.responses.errorResponse(
            'Cancellation is not possible on this particular date',
          );
        }
      }

      //Update the booking status
      const updateStatusData = {
        booking_status: 2,
        created_by: request.user.user_id,
      };

      const updateStatusBooking = await this.bookingRepository.update(
        booking_id,
        updateStatusData,
      );

      if (updateStatusBooking) {
        //Increase the seats available in the event
        if (booking_info) {
          const available_seats = event_info[0].available_seats;
          const seat = available_seats + booking_info[0].total_ticket_count;
          const updateSeat = {
            available_seats: seat,
          };

          const updateEventAvailableSeats = await this.eventRepository.update(
            booking_info[0].event_id,
            updateSeat,
          );
        }

        const response = {};
        return this.responses.successResponse(response);
      }
      return this.responses.errorResponse('Something went wrong');
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        'BookingService.getBookings',
      );
      throw error;
    }
  }

  generateBookingCode() {
    const characters = '0123456789';
    let code = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return 'MFB' + code;
  }
  async checkBookingCode() {
    const bookingCode = this.generateBookingCode();
    const checkCode = await this.bookingRepository.findByCondition({
      booking_code: bookingCode,
    });
    if (checkCode.length > 0) {
      this.checkBookingCode();
    }
    return bookingCode;
  }
}
