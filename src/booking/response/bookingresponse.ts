import { UserRole } from 'src/common/enum/user-role.enum';
import * as dateFns from 'date-fns';
import { constants } from 'src/common/enum/constants.enum';
import { Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/user/interface/user.repository.interface';
import { Brackets } from 'typeorm';
import { QuestionOptionRepositoryInterface } from 'src/admin/questionnaire/interface/questionoption.interface.repository';
import { QuestionRepositoryInterface } from 'src/admin/questionnaire/interface/question.iterface.repository';
export class BookingResponseData {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('QuestionOptionRepositoryInterface')
    private readonly questionoptionRepository: QuestionOptionRepositoryInterface,
    @Inject('QuestionRepositoryInterface')
    private readonly questionRepository: QuestionRepositoryInterface,
  ) {}
  // Role based Get locations response
  //Defines all the roles
  async getAllResponse(data: any, role, user_id) {
    let result: any = [];
    switch (role) {
      case UserRole.SUPERADMIN: //Super Admin
        result =
          data.length > 0
            ? await Promise.all(
                data.map(async (datam: any) => {
                  const userData =
                    await this.userRepository.findByConditionWithDelete(
                      {
                        id: datam.user_id,
                      },
                      true,
                    );
                  // console.log(userData);
                  return {
                    id: datam.id,
                    coupon_code: datam.coupon_code,
                    ticket_count: datam.total_ticket_count,
                    amount: datam.total_ticket_amount,
                    booking_code: datam.booking_code,
                    event: datam.events.title,
                    event_id: datam.event_id,
                    event_subscription_status:
                      datam.events.event_subscription_status == 1
                        ? 'Free'
                        : datam.events.event_subscription_status == 2
                        ? 'Paid'
                        : '',
                    map_url: datam.events.map_url,
                    // created_by: datam.users
                    //   ? datam.users.first_name + " " + datam.users.last_name
                    //   : "",
                    created_by: userData[0]
                      ? userData[0].first_name +
                        (userData[0].last_name
                          ? ' ' + userData[0].last_name
                          : '')
                      : '',
                    status: datam.status == 1 ? 'Active' : 'Inactive',
                    user: userData[0]
                      ? userData[0].first_name +
                        (userData[0].last_name
                          ? ' ' + userData[0].last_name
                          : '')
                      : '',
                    ticket_price:
                      datam.booking_event_ticket_type[0]?.price ?? '',
                    coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
                    discount_value:
                      datam.booking_coupon[0]?.discount_value ?? '',
                    minimum_discount_value:
                      datam.booking_coupon[0]?.minimum_discount_value ?? '',
                    minimum_coupon_redeem_count:
                      datam.booking_coupon[0]?.minimum_coupon_redeem_count ??
                      '',
                    qrcode_image: datam.qrcode_image,
                    additional_users: datam.booking_additional_users ?? [],
                    booking_status:
                      datam.booking_status == 1
                        ? 'Active'
                        : datam.booking_status == 2
                        ? 'Cancelled'
                        : '',
                  };
                }),
              )
            : [];

        break;
      case UserRole.USER: //USER
        result =
          data.length > 0
            ? await Promise.all(
                data.map(async (datam: any) => {
                  const userData =
                    await this.userRepository.findByConditionWithDelete(
                      {
                        id: datam.user_id,
                      },
                      true,
                    );
                  return datam.status == 1
                    ? {
                        id: datam.id,
                        coupon_code: datam.coupon_code,
                        ticket_count: datam.total_ticket_count,
                        amount: datam.total_ticket_amount,
                        booking_code: datam.booking_code,
                        event: datam.events.title,
                        event_subscription_status:
                          datam.events.event_subscription_status == 1
                            ? 'Free'
                            : datam.events.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        map_url: datam.events.map_url,
                        // created_by: datam.users
                        //   ? datam.users.first_name + " " + datam.users.last_name
                        //   : "",
                        created_by: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        status: datam.status == 1 ? 'Active' : 'Inactive',
                        user: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
                        discount_value:
                          datam.booking_coupon[0]?.discount_value ?? '',
                        minimum_discount_value:
                          datam.booking_coupon[0]?.minimum_discount_value ?? '',
                        minimum_coupon_redeem_count:
                          datam.booking_coupon[0]
                            ?.minimum_coupon_redeem_count ?? '',
                        booking_status:
                          datam.booking_status == 1
                            ? 'Active'
                            : datam.booking_status == 2
                            ? 'Cancelled'
                            : '',
                      }
                    : [];
                }),
              )
            : [];
        break;
      case 3: //SUB_ADMIN
        break;
      case 4: //ORGANIZER
        result =
          data.length > 0
            ? await Promise.all(
                data.map(async (datam: any) => {
                  const userData =
                    await this.userRepository.findByConditionWithDelete(
                      {
                        id: datam.user_id,
                      },
                      true,
                    );
                  return datam.events.organizer_id == user_id && user_id != 0
                    ? {
                        id: datam.id,
                        coupon_code: datam.coupon_code,
                        ticket_count: datam.total_ticket_count,
                        amount: datam.total_ticket_amount,
                        booking_code: datam.booking_code,
                        event: datam.events.title,
                        event_id: datam.event_id,
                        event_subscription_status:
                          datam.events.event_subscription_status == 1
                            ? 'Free'
                            : datam.events.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        map_url: datam.events.map_url,
                        // created_by: datam.users
                        //   ? datam.users.first_name + " " + datam.users.last_name
                        //   : "",
                        created_by: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        status: datam.status == 1 ? 'Active' : 'Inactive',
                        user: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        ticket_price:
                          datam.booking_event_ticket_type[0]?.price ?? '',
                        coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
                        discount_value:
                          datam.booking_coupon[0]?.discount_value ?? '',
                        minimum_discount_value:
                          datam.booking_coupon[0]?.minimum_discount_value ?? '',
                        minimum_coupon_redeem_count:
                          datam.booking_coupon[0]
                            ?.minimum_coupon_redeem_count ?? '',
                        qrcode_image: datam.qrcode_image,
                        additional_users: datam.booking_additional_users ?? [],
                        booking_status:
                          datam.booking_status == 1
                            ? 'Active'
                            : datam.booking_status == 2
                            ? 'Cancelled'
                            : '',
                      }
                    : [];
                }),
              )
            : [];
        break;
      case 5: //Agent
        result =
          data.length > 0
            ? await Promise.all(
                data.map(async (datam: any) => {
                  const userData =
                    await this.userRepository.findByConditionWithDelete(
                      {
                        id: datam.user_id,
                      },
                      true,
                    );
                  return datam.events.created_by == user_id && user_id != 0
                    ? {
                        id: datam.id,
                        coupon_code: datam.coupon_code,
                        ticket_count: datam.total_ticket_count,
                        amount: datam.total_ticket_amount,
                        booking_code: datam.booking_code,
                        event: datam.events.title,
                        event_id: datam.event_id,
                        event_subscription_status:
                          datam.events.event_subscription_status == 1
                            ? 'Free'
                            : datam.events.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        map_url: datam.events.map_url,
                        // created_by: datam.users
                        //   ? datam.users.first_name + " " + datam.users.last_name
                        //   : "",
                        created_by: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        status: datam.status == 1 ? 'Active' : 'Inactive',
                        user: userData[0]
                          ? userData[0].first_name +
                            (userData[0].last_name
                              ? ' ' + userData[0].last_name
                              : '')
                          : '',
                        ticket_price:
                          datam.booking_event_ticket_type[0]?.price ?? '',
                        coupon_name: datam.booking_coupon[0]?.coupon_name ?? '',
                        discount_value:
                          datam.booking_coupon[0]?.discount_value ?? '',
                        minimum_discount_value:
                          datam.booking_coupon[0]?.minimum_discount_value ?? '',
                        minimum_coupon_redeem_count:
                          datam.booking_coupon[0]
                            ?.minimum_coupon_redeem_count ?? '',
                        qrcode_image: datam.qrcode_image,
                        additional_users: datam.booking_additional_users ?? [],
                        booking_status:
                          datam.booking_status == 1
                            ? 'Active'
                            : datam.booking_status == 2
                            ? 'Cancelled'
                            : '',
                      }
                    : [];
                }),
              )
            : [];
        break;
    }

    return result;
  }
  async getiDResponse(
    data: any,
    role,
    cat_name,
    ticket_type_name,
    userData,
    user_id,
    question_answer_data,
    sub_event_question_answer_data,
  ) {
    let result: any = [];
    switch (role) {
      case UserRole.SUPERADMIN: //Super Admin
        result = {
          id: data.id,
          user_id: data.user_id,
          coupon_code: data.coupon_code,
          ticket_count: data.total_ticket_count,
          amount: data.total_ticket_amount,
          booking_code: data.booking_code,
          event: data.events.title,
          event_id: data.event_id,
          event_subscription_status:
            data.events.event_subscription_status == 1
              ? 'Free'
              : data.events.event_subscription_status == 2
              ? 'Paid'
              : '',
          map_url: data.events.map_url,
          event_type: data.events.event_type == 1 ? 'Online' : 'Offline',
          event_ticket_type_id:
            data.booking_event_ticket_type[0]?.event_ticket_type_id ?? '',
          // created_by: data.users.first_name + " " + data.users.last_name,
          created_by: userData[0]
            ? userData[0].first_name +
              (userData[0].last_name ? ' ' + userData[0].last_name : '')
            : '',
          status: data.status == 1 ? 'Active' : 'Inactive',
          user: userData[0]
            ? userData[0].first_name +
              (userData[0].last_name ? ' ' + userData[0].last_name : '')
            : '',
          ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
          coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
          discount_value: data.booking_coupon[0]?.discount_value ?? '',
          minimum_discount_value:
            data.booking_coupon[0]?.minimum_discount_value ?? '',
          minimum_coupon_redeem_count:
            data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
          qrcode_image: data.qrcode_image,
          additional_users: data.booking_additional_users ?? [],
          booking_status:
            data.booking_status == 1
              ? 'Active'
              : data.booking_status == 2
              ? 'Cancelled'
              : '',
          question_answers: question_answer_data
            ? await Promise.all(
                question_answer_data.map(async (question_answers: any) => {
                  let option = '';

                  if (question_answers.option) {
                    const optionIds = JSON.parse(question_answers.option);
                    const optionNames = [];

                    // Use `for...of` loop to wait for each option to be retrieved
                    for (const element of optionIds) {
                      const option_data =
                        await this.questionoptionRepository.findOneById(
                          element,
                        );
                      optionNames.push(option_data.option);
                    }

                    option = optionNames.join(', ');
                  }
                  const question_data =
                    await this.questionRepository.findOneById(
                      question_answers.question_id,
                    );
                  return {
                    question_id: question_answers.question_id,
                    title: question_data ? question_data.title : null,
                    question_type_id: question_data
                      ? question_data.question_type
                      : null,
                    question_type: question_data
                      ? question_data.question_type == 1
                        ? 'Single Text'
                        : question_data.question_type == 2
                        ? 'MCQ'
                        : question_data.question_type == 3
                        ? 'Drop Down'
                        : ''
                      : null,
                    text_answer: question_answers.text_answer,
                    option: question_answers.option
                      ? JSON.parse(question_answers.option)
                      : null,
                    option_name: option,
                  };
                }),
              )
            : [],
          sub_event_question_answers: sub_event_question_answer_data
            ? await Promise.all(
                sub_event_question_answer_data.map(
                  async (question_answers: any) => {
                    let option = '';

                    if (question_answers.option) {
                      const optionIds = JSON.parse(question_answers.option);
                      const optionNames = [];

                      // Use `for...of` loop to wait for each option to be retrieved
                      for (const element of optionIds) {
                        const option_data =
                          await this.questionoptionRepository.findOneById(
                            element,
                          );
                        optionNames.push(option_data.option);
                      }

                      option = optionNames.join(', ');
                    }
                    const question_data =
                      await this.questionRepository.findOneById(
                        question_answers.question_id,
                      );
                    return {
                      question_id: question_answers.question_id,
                      title: question_data ? question_data.title : null,
                      question_type_id: question_data
                        ? question_data.question_type
                        : null,
                      question_type: question_data
                        ? question_data.question_type == 1
                          ? 'Single Text'
                          : question_data.question_type == 2
                          ? 'MCQ'
                          : question_data.question_type == 3
                          ? 'Drop Down'
                          : ''
                        : null,
                      text_answer: question_answers.text_answer,
                      option: question_answers.option
                        ? JSON.parse(question_answers.option)
                        : null,
                      option_name: option,
                    };
                  },
                ),
              )
            : [],
        };
        break;
      case UserRole.USER: //User
        result = {
          id: data.id,
          user_id: data.user_id,
          coupon_code: data.coupon_code,
          ticket_count: data.total_ticket_count,
          amount: data.total_ticket_amount,
          booking_code: data.booking_code,
          event: data.events.title,
          event_id: data.event_id,
          category_name: cat_name[0] ? cat_name[0].title : '',
          event_subscription_status:
            data.events.event_subscription_status == 1
              ? 'Free'
              : data.events.event_subscription_status == 2
              ? 'Paid'
              : '',
          event_ticket_type_id:
            data.booking_event_ticket_type[0]?.event_ticket_type_id ?? '',
          event_ticket_type_name: ticket_type_name[0]
            ? ticket_type_name[0].title
            : '',
          featured_image: data.events.featured_image
            ? `${constants.IMAGE_BASE_URL}` + data.events.featured_image
            : '',
          map_url: data.events.map_url,
          event_description: data.events.event_description,
          event_date_from: dateFns.format(
            new Date(data.events.event_date_from),
            'MMMM dd,EEEE yyyy',
          ),
          event_date_to: dateFns.format(
            new Date(data.events.event_date_to),
            'MMMM dd,EEEE yyyy',
          ),
          event_time_from: data.events.event_time_from,
          event_time_to: data.events.event_time_to,
          venue: data.events.venue,
          total_seats: data.events.total_seats,
          available_seats: data.events.available_seats,

          single_ticket_price: data.events.single_ticket_price,
          event_type: data.events.event_type == 1 ? 'Online' : 'Offline',
          event_ticket_status:
            data.events.event_ticket_status == 1
              ? 'Selling Fast'
              : data.events.event_ticket_status == 2
              ? 'SoldOut'
              : 'Upcoming', //need to implement the logic later
          event_period_status:
            new Date(data.events.event_date_from) > new Date()
              ? 'Upcoming'
              : new Date(data.events.event_date_from) <= new Date() &&
                new Date(data.events.event_date_to) >= new Date()
              ? 'On going'
              : new Date(data.events.event_date_to) < new Date()
              ? 'Past'
              : '',
          about_the_event: data.events.about_the_event,
          detailed_address: data.events.detailed_address,
          contact_ph: data.events.contact_ph,
          contact_email: data.events.contact_email,
          additional_venue_address: data.events.additional_venue_address,
          about_the_event_title: data.events.about_the_event_title,
          // created_by: data.users.first_name + " " + data.users.last_name,
          created_by: userData[0]
            ? userData[0].first_name +
              (userData[0].last_name ? ' ' + userData[0].last_name : '')
            : '',
          status: data.status == 1 ? 'Active' : 'Inactive',
          user: userData[0]
            ? userData[0].first_name +
              (userData[0].last_name ? ' ' + userData[0].last_name : '')
            : '',
          ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
          coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
          discount_value: data.booking_coupon[0]?.discount_value ?? '',
          minimum_discount_value:
            data.booking_coupon[0]?.minimum_discount_value ?? '',
          minimum_coupon_redeem_count:
            data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
          qrcode_image: data.qrcode_image,

          additional_users: data.booking_additional_users ?? [],
          booking_status:
            data.booking_status == 1
              ? 'Active'
              : data.booking_status == 2
              ? 'Cancelled'
              : '',
        };
        break;
      case 3: //SUB_ADMIN
        break;
      case 4: //ORGANIZER
        break;
      case 5: //Agent By id
        if (data.events.created_by == user_id && user_id != 0) {
          result = {
            id: data.id,
            user_id: data.user_id,
            coupon_code: data.coupon_code,
            ticket_count: data.total_ticket_count,
            amount: data.total_ticket_amount,
            booking_code: data.booking_code,
            event: data.events.title,
            event_id: data.event_id,
            event_subscription_status:
              data.events.event_subscription_status == 1
                ? 'Free'
                : data.events.event_subscription_status == 2
                ? 'Paid'
                : '',
            map_url: data.events.map_url,
            event_type: data.events.event_type == 1 ? 'Online' : 'Offline',
            event_ticket_type_id:
              data.booking_event_ticket_type[0]?.event_ticket_type_id ?? '',
            // created_by: data.users.first_name + " " + data.users.last_name,
            created_by: userData[0]
              ? userData[0].first_name +
                (userData[0].last_name ? ' ' + userData[0].last_name : '')
              : '',
            status: data.status == 1 ? 'Active' : 'Inactive',
            user: userData[0]
              ? userData[0].first_name +
                (userData[0].last_name ? ' ' + userData[0].last_name : '')
              : '',
            ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
            coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
            discount_value: data.booking_coupon[0]?.discount_value ?? '',
            minimum_discount_value:
              data.booking_coupon[0]?.minimum_discount_value ?? '',
            minimum_coupon_redeem_count:
              data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
            qrcode_image: data.qrcode_image,
            additional_users: data.booking_additional_users ?? [],
            booking_status:
              data.booking_status == 1
                ? 'Active'
                : data.booking_status == 2
                ? 'Cancelled'
                : '',
          };
        }
        break;
    }

    return result;
  }
}
