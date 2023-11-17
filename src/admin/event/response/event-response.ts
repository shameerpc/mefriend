import * as AWS from 'aws-sdk';

import { constants } from '../../../common/enum/constants.enum';
import { request } from 'http';
import { Inject } from '@nestjs/common';
import { FavouriteRepositoryInterface } from 'src/favourite/interface/favourite.repository.interface';

export class EventResponseData {
  constructor(
    @Inject('FavouriteRepositoryInterface')
    private readonly favouriteRepository: FavouriteRepositoryInterface,
  ) {}
  // Role based Get locations response
  //Defines all the roles
  async getAllResponse(data: any, role, user_id) {
    let result: any = [];
    switch (role) {
      case 1: //Super Admin event list
        result =
          data.length > 0
            ? data.map((datam: any) => {
                const eventDate = new Date(datam.event_date_from);
                const eventToDate = new Date(datam.event_date_to);

                return {
                  id: datam.id,
                  title: datam.title ? datam.title : null,
                  event_name: datam.event_name,
                  event_code: datam.event_code,
                  organizer_id: datam.organizer_id,
                  organizer_name: datam.organizers
                    ? datam.organizers.first_name +
                      ' ' +
                      datam.organizers.last_name
                    : '',

                  category_id: datam.category_id ? datam.category_id : null,
                  category_name: datam.category.id ? datam.category.title : '',
                  country_id: datam.country_id
                    ? this.getCountryName(datam.country_id)
                    : '',
                  city_id: datam.location ? datam.location.id : null,
                  city: datam.location ? datam.location.title : null,
                  venue: datam.venue,
                  venue_latitude: datam.venue_latitude,
                  venue_longitude: datam.venue_longitude,
                  map_url: datam.map_url,
                  event_description: datam.event_description,
                  featured_image: datam.featured_image
                    ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                    : '',
                  banner_image: datam.banner_image
                    ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                    : '',
                  event_date_from: datam.event_date_from,
                  event_date_to: datam.event_date_to,
                  event_time_from: datam.event_time_from,
                  event_time_to: datam.event_time_to,
                  total_seats: datam.total_seats,
                  available_seats: datam.available_seats,
                  agent_commission: datam.agent_commission,
                  single_ticket_price: datam.single_ticket_price,
                  event_type: datam.event_type == 1 ? 'Online' : 'Offline',
                  event_ticket_status:
                    datam.event_ticket_status == 1
                      ? 'Selling Fast'
                      : datam.event_ticket_status == 2
                      ? 'SoldOut'
                      : 'Upcoming', //need to implement the logic later
                  about_the_event: datam.about_the_event,
                  detailed_address: datam.detailed_address,
                  contact_details: datam.contact_details,
                  event_subscription_status:
                    datam.event_subscription_status == 1
                      ? 'Free'
                      : datam.event_subscription_status == 2
                      ? 'Paid'
                      : '',
                  additional_venue_address: datam.additional_venue_address,
                  about_the_event_title: datam.about_the_event_title,
                  created_by:
                    datam.users.first_name + ' ' + datam.users.last_name,
                  status: datam.status == 1 ? 'Active' : 'Inactive',
                  status_id: datam.status,
                  created_at: datam.created_at,
                  event_period_status:
                    eventDate > new Date()
                      ? 'Upcoming'
                      : eventDate <= new Date() && eventToDate >= new Date()
                      ? 'On going'
                      : eventToDate < new Date()
                      ? 'Past'
                      : '',
                  agent_ids: datam.agent_ids
                    ? datam.agent_ids
                        .split(',')
                        .map((value) => parseInt(value, 10))
                    : [],
                };
              })
            : [];

        break;
      case 2: //USER Event LIST
        result =
          data.length > 0
            ? await Promise.all(
                data.map(async (datam: any) => {
                  let is_fav_data;
                  if (user_id && user_id != 0) {
                    is_fav_data =
                      await this.favouriteRepository.findByCondition({
                        event_id: datam.id,
                        user_id: user_id,
                      });
                  } else {
                    is_fav_data = [];
                  }

                  return datam.status == 1
                    ? {
                        id: datam.id,
                        title: datam.title ? datam.title : null,
                        event_name: datam.event_name,
                        event_code: datam.event_code,
                        // organizer_id: datam.organizers.id,
                        organizer_id: datam.organizer_id,
                        // category_id: datam.category_id,
                        country_name: this.getCountryName(datam.country_id),
                        country_id: datam.country_id,
                        city: datam.city,
                        venue: datam.venue,
                        venue_latitude: datam.venue_latitude,
                        venue_longitude: datam.venue_longitude,
                        map_url: datam.map_url,
                        event_description: datam.event_description,
                        featured_image: datam.featured_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                          : '',
                        banner_image: datam.banner_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                          : '',
                        event_date_from: datam.event_date_from,
                        event_date_to: datam.event_date_to,
                        event_time_from: datam.event_time_from,
                        event_time_to: datam.event_time_to,
                        total_seats: datam.total_seats,
                        available_seats: datam.available_seats,
                        agent_commission: datam.agent_commission,
                        single_ticket_price: datam.single_ticket_price,
                        event_type:
                          datam.event_type == 1 ? 'Online' : 'Offline',
                        event_ticket_status:
                          datam.event_ticket_status == 1
                            ? 'Selling Fast'
                            : datam.event_ticket_status == 2
                            ? 'SoldOut'
                            : 'Upcoming', //need to implement the logic later
                        about_the_event: datam.about_the_event,
                        detailed_address: datam.detailed_address,
                        contact_details: datam.contact_details,
                        event_subscription_status:
                          datam.event_subscription_status == 1
                            ? 'Free'
                            : datam.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        additional_venue_address:
                          datam.additional_venue_address,
                        about_the_event_title: datam.about_the_event_title,
                        is_favorite: is_fav_data.length > 0 ? true : false,
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
            ? data.map((datam: any) => {
                const eventDate = new Date(datam.event_date_from);
                const eventToDate = new Date(datam.event_date_to);
                return datam.organizer_id == user_id && user_id != 0
                  ? {
                      id: datam.id,
                      title: datam.title ? datam.title : null,
                      event_name: datam.event_name,
                      event_code: datam.event_code,

                      category_id: datam.category_id,
                      category_name: datam.category.id
                        ? datam.category.title
                        : '',
                      country_name: datam.countries.country_name
                        ? datam.countries.country_name
                        : '',
                      country_id: datam.countries.id ? datam.countries.id : '',
                      country_code: datam.countries.country_code
                        ? datam.countries.country_code
                        : '',
                      city_id: datam.location ? datam.location.id : null,
                      city: datam.location ? datam.location.title : null,
                      venue: datam.venue,
                      venue_latitude: datam.venue_latitude,
                      venue_longitude: datam.venue_longitude,
                      map_url: datam.map_url,
                      event_description: datam.event_description,
                      featured_image: datam.featured_image
                        ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                        : '',
                      banner_image: datam.banner_image
                        ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                        : '',

                      event_date_from: datam.event_date_from,
                      event_date_to: datam.event_date_to,
                      event_time_from: datam.event_time_from,
                      event_time_to: datam.event_time_to,
                      total_seats: datam.total_seats,
                      available_seats: datam.available_seats,
                      single_ticket_price: datam.single_ticket_price,
                      event_type: datam.event_type == 1 ? 'Online' : 'Offline',
                      event_ticket_status:
                        datam.event_ticket_status == 1
                          ? 'Selling Fast'
                          : datam.event_ticket_status == 2
                          ? 'SoldOut'
                          : 'Selling Slow',

                      about_the_event: datam.about_the_event,
                      detailed_address: datam.detailed_address,
                      contact_ph: datam.contact_ph,
                      contact_email: datam.contact_email,
                      event_subscription_status_id:
                        datam.event_subscription_status,

                      event_subscription_status:
                        datam.event_subscription_status == 1
                          ? 'Free'
                          : datam.event_subscription_status == 2
                          ? 'Paid'
                          : '',
                      additional_venue_address: datam.additional_venue_address,
                      about_the_event_title: datam.about_the_event_title,
                      created_by:
                        datam.users.first_name + ' ' + datam.users.last_name,
                      status: datam.status == 1 ? 'Active' : 'Inactive',
                      status_id: datam.status,
                      created_at: datam.created_at,
                      event_period_status:
                        eventDate > new Date()
                          ? 'Upcoming'
                          : eventDate <= new Date() && eventToDate >= new Date()
                          ? 'On going'
                          : eventToDate < new Date()
                          ? 'Past'
                          : '',
                      agent_ids: datam.agent_ids
                        ? datam.agent_ids
                            .split(',')
                            .map((value) => parseInt(value, 10))
                        : [],
                    }
                  : [];
              })
            : [];
        break;
      case 5: //AGENT list
        result =
          data.length > 0
            ? data.map((datam: any) => {
                const eventDate = new Date(datam.event_date_from);
                const eventToDate = new Date(datam.event_date_to);
                let agentArray = datam.agent_ids
                  ? datam.agent_ids.split(',')
                  : [];

                return agentArray.length > 0 &&
                  agentArray.includes(user_id.toString()) &&
                  user_id != 0 &&
                  datam.agent_ids
                  ? {
                      id: datam.id,
                      title: datam.title ? datam.title : null,
                      event_name: datam.event_name,
                      event_code: datam.event_code,

                      category_id: datam.category_id,
                      category_name: datam.category ? datam.category.title : '',
                      country_name: datam.countries
                        ? datam.countries.country_name
                        : '',
                      country_id: datam.countries ? datam.countries.id : '',
                      country_code: datam.countries.country_code
                        ? datam.countries.country_code
                        : '',
                      city_id: datam.location ? datam.location.id : null,
                      city: datam.location ? datam.location.title : null,
                      venue: datam.venue,
                      venue_latitude: datam.venue_latitude,
                      venue_longitude: datam.venue_longitude,
                      map_url: datam.map_url,
                      event_description: datam.event_description,
                      featured_image: datam.featured_image
                        ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                        : '',
                      banner_image: datam.banner_image
                        ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                        : '',

                      event_date_from: datam.event_date_from,
                      event_date_to: datam.event_date_to,
                      event_time_from: datam.event_time_from,
                      event_time_to: datam.event_time_to,
                      total_seats: datam.total_seats,
                      available_seats: datam.available_seats,
                      single_ticket_price: datam.single_ticket_price,
                      event_type: datam.event_type == 1 ? 'Online' : 'Offline',
                      event_ticket_status:
                        datam.event_ticket_status == 1
                          ? 'Selling Fast'
                          : datam.event_ticket_status == 2
                          ? 'SoldOut'
                          : 'Selling Slow',

                      about_the_event: datam.about_the_event,
                      detailed_address: datam.detailed_address,
                      contact_ph: datam.contact_ph,
                      contact_email: datam.contact_email,
                      event_subscription_status_id:
                        datam.event_subscription_status,

                      event_subscription_status:
                        datam.event_subscription_status == 1
                          ? 'Free'
                          : datam.event_subscription_status == 2
                          ? 'Paid'
                          : '',
                      additional_venue_address: datam.additional_venue_address,
                      about_the_event_title: datam.about_the_event_title,
                      created_by:
                        datam.users.first_name + ' ' + datam.users.last_name,
                      status: datam.status == 1 ? 'Active' : 'Inactive',
                      status_id: datam.status,
                      created_at: datam.created_at,
                      event_period_status:
                        eventDate > new Date()
                          ? 'Upcoming'
                          : eventDate <= new Date() && eventToDate >= new Date()
                          ? 'On going'
                          : eventToDate < new Date()
                          ? 'Past'
                          : '',
                      agent_ids: datam.agent_ids
                        ? datam.agent_ids
                            .split(',')
                            .map((value) => parseInt(value, 10))
                        : [],
                    }
                  : [];
              })
            : [];
        break;
    }

    return result;
  }

  //Role based Get locations BY ID response
  getByIdResponse(
    datam: any,
    role,
    eventSponsorData,
    eventTicketData,
    subEventData,
    user_id,
  ) {
    let result;
    if (datam) {
      switch (role) {
        case 1: //Super Admin
          result =
            datam.length > 0
              ? datam.map((datam: any) => {
                  return {
                    id: datam.id,
                    title: datam.title ? datam.title : null,
                    event_name: datam.event_name,
                    event_code: datam.event_code,
                    organizer_id: datam.organizer_id,
                    // organizer_name:
                    //   datam.organizers.first_name +
                    //   ' ' +
                    //   datam.organizers.last_name,
                    category_id: datam.category_id,

                    category_name: datam.category.title
                      ? datam.category.title
                      : null,
                    country_name: this.getCountryName(datam.country_id),
                    country_id: datam.country_id,
                    city: datam.city,
                    venue: datam.venue,
                    venue_latitude: datam.venue_latitude,
                    venue_longitude: datam.venue_longitude,
                    map_url: datam.map_url,
                    event_description: datam.event_description,
                    featured_image: datam.featured_image
                      ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                      : '',
                    banner_image: datam.banner_image
                      ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                      : '',

                    event_date_from: datam.event_date_from,
                    event_date_to: datam.event_date_to,
                    event_time_from: datam.event_time_from,
                    event_time_to: datam.event_time_to,
                    total_seats: datam.total_seats,
                    available_seats: datam.available_seats,

                    agent_commission: datam.agent_commission,
                    single_ticket_price: datam.single_ticket_price,
                    event_type: datam.event_type == 1 ? 'Online' : 'Offline',
                    event_ticket_status:
                      datam.event_ticket_status == 1
                        ? 'Selling Fast'
                        : datam.event_ticket_status == 2
                        ? 'SoldOut'
                        : 'Upcoming', //need to implement the logic later
                    about_the_event: datam.about_the_event,
                    detailed_address: datam.detailed_address,
                    contact_details: datam.contact_details,
                    event_subscription_status:
                      datam.event_subscription_status == 1
                        ? 'Free'
                        : datam.event_subscription_status == 2
                        ? 'Paid'
                        : '',
                    additional_venue_address: datam.additional_venue_address,
                    about_the_event_title: datam.about_the_event_title,
                    created_by:
                      datam.users.first_name + ' ' + datam.users.last_name,
                    status: datam.status == 1 ? 'Active' : 'Inactive',
                    status_id: datam.status == 1,
                    created_at: datam.created_at,
                    event_sponsors: eventSponsorData,
                    event_ticket_prices: eventTicketData,
                    sub_events: subEventData,
                    agent_ids: datam.agent_ids
                      ? datam.agent_ids
                          .split(',')
                          .map((value) => parseInt(value, 10))
                      : [],
                  };
                })
              : {};
          break;
        case 2: //USER
          result =
            datam.length > 0
              ? datam.map((datam: any) => {
                  const eventDate = new Date(datam.event_date_from);
                  return {
                    id: datam.id,
                    title: datam.title ? datam.title : null,
                    event_name: datam.event_name,
                    event_code: datam.event_code,
                    organizer_id: datam.organizer_id,
                    // organizer_name:
                    //   datam.organizers.first_name +
                    //   ' ' +
                    //   datam.organizers.last_name,
                    category_id: datam.category_id,

                    category_name: datam.category.title
                      ? datam.category.title
                      : null,
                    country_name: this.getCountryName(datam.country_id),
                    country_id: datam.country_id,
                    city: datam.city,
                    venue: datam.venue,
                    venue_latitude: datam.venue_latitude,
                    venue_longitude: datam.venue_longitude,
                    map_url: datam.map_url,
                    event_description: datam.event_description,
                    featured_image: datam.featured_image
                      ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                      : '',
                    banner_image: datam.banner_image
                      ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                      : '',

                    event_date_from: datam.event_date_from,
                    event_date_to: datam.event_date_to,
                    event_time_from: datam.event_time_from,
                    event_time_to: datam.event_time_to,
                    total_seats: datam.total_seats,
                    available_seats: datam.available_seats,

                    agent_commission: datam.agent_commission,
                    single_ticket_price: datam.single_ticket_price,
                    event_type: datam.event_type == 1 ? 'Online' : 'Offline',
                    event_ticket_status:
                      datam.event_ticket_status == 1
                        ? 'Selling Fast'
                        : datam.event_ticket_status == 2
                        ? 'SoldOut'
                        : 'Upcoming', //need to implement the logic later
                    about_the_event: datam.about_the_event,
                    detailed_address: datam.detailed_address,
                    contact_details: datam.contact_details,
                    event_subscription_status:
                      datam.event_subscription_status == 1
                        ? 'Free'
                        : datam.event_subscription_status == 2
                        ? 'Paid'
                        : '',
                    additional_venue_address: datam.additional_venue_address,
                    about_the_event_title: datam.about_the_event_title,
                    event_sponsors: eventSponsorData,
                    event_ticket_prices: eventTicketData,
                    sub_events: subEventData,
                    agent_ids: datam.agent_ids
                      ? datam.agent_ids
                          .split(',')
                          .map((value) => parseInt(value, 10))
                      : [],
                  };
                })
              : {};
          break;
        case 3: //SUB_ADMIN
          break;
        case 4: //ORGANIZER
          result =
            datam.length > 0
              ? datam.map((datam: any) => {
                  const eventDate = new Date(datam.event_date_from);
                  const eventToDate = new Date(datam.event_date_to);
                  return datam.organizer_id == user_id && user_id != 0
                    ? {
                        id: datam.id,
                        title: datam.title ? datam.title : null,
                        event_name: datam.event_name,
                        event_code: datam.event_code,
                        // organizer_id: datam.organizers.id,
                        // organizer_name:
                        //   datam.organizers.first_name +
                        //   " " +
                        //   datam.organizers.last_name,
                        category_id: datam.category_id,

                        category_name: datam.category.title
                          ? datam.category.title
                          : null,
                        country_name: datam.countries.country_name
                          ? datam.countries.country_name
                          : '',
                        country_id: datam.countries.id
                          ? datam.countries.id
                          : '',
                        country_code: datam.countries.country_code
                          ? datam.countries.country_code
                          : '',
                        city_id: datam.location ? datam.location.id : null,
                        city: datam.location ? datam.location.title : null,
                        venue: datam.venue,
                        venue_latitude: datam.venue_latitude,
                        venue_longitude: datam.venue_longitude,
                        map_url: datam.map_url,
                        event_description: datam.event_description,
                        featured_image: datam.featured_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                          : '',
                        banner_image: datam.banner_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                          : '',

                        event_date_from: datam.event_date_from,
                        event_date_to: datam.event_date_to,
                        event_time_from: datam.event_time_from,
                        event_time_to: datam.event_time_to,
                        total_seats: datam.total_seats,
                        available_seats: datam.available_seats,
                        single_ticket_price: datam.single_ticket_price,
                        event_type:
                          datam.event_type == 1 ? 'Online' : 'Offline',
                        event_ticket_status:
                          datam.event_ticket_status == 1
                            ? 'Selling Fast'
                            : datam.event_ticket_status == 2
                            ? 'SoldOut'
                            : 'Selling Slow',

                        about_the_event: datam.about_the_event,
                        detailed_address: datam.detailed_address,
                        contact_ph: datam.contact_ph,
                        contact_email: datam.contact_email,
                        event_subscription_status_id:
                          datam.event_subscription_status,
                        event_subscription_status:
                          datam.event_subscription_status == 1
                            ? 'Free'
                            : datam.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        additional_venue_address:
                          datam.additional_venue_address,
                        about_the_event_title: datam.about_the_event_title,
                        created_by:
                          datam.users.first_name + ' ' + datam.users.last_name,
                        status: datam.status == 1 ? 'Active' : 'Inactive',
                        status_id: datam.status == 1,
                        created_at: datam.created_at,
                        event_sponsors: eventSponsorData,
                        event_ticket_prices: eventTicketData,
                        event_period_status:
                          eventDate > new Date()
                            ? 'Upcoming'
                            : eventDate <= new Date() &&
                              eventToDate >= new Date()
                            ? 'On going'
                            : eventToDate < new Date()
                            ? 'Past'
                            : '',
                        agent_ids: datam.agent_ids
                          ? datam.agent_ids
                              .split(',')
                              .map((value) => parseInt(value, 10))
                          : [],
                      }
                    : {};
                })
              : {};
          break;
        case 5: //Agent LIST
          result =
            datam.length > 0
              ? datam.map((datam: any) => {
                  const eventDate = new Date(datam.event_date_from);
                  const eventToDate = new Date(datam.event_date_to);

                  const agentArray = datam.agent_ids
                    ? datam.agent_ids.split(',')
                    : [];
                  return agentArray.length > 0 &&
                    agentArray.includes(user_id.toString()) &&
                    user_id != 0 &&
                    datam.agent_ids
                    ? {
                        id: datam.id,
                        title: datam.title ? datam.title : null,
                        event_name: datam.event_name,
                        event_code: datam.event_code,
                        // organizer_id: datam.organizers.id,
                        // organizer_name:
                        //   datam.organizers.first_name +
                        //   " " +
                        //   datam.organizers.last_name,
                        category_id: datam.category_id,

                        category_name: datam.category.title
                          ? datam.category.title
                          : null,
                        country_name: datam.countries.country_name
                          ? datam.countries.country_name
                          : '',
                        country_id: datam.countries.id
                          ? datam.countries.id
                          : '',
                        country_code: datam.countries.country_code
                          ? datam.countries.country_code
                          : '',
                        city_id: datam.location ? datam.location.id : null,
                        city: datam.location ? datam.location.title : null,
                        venue: datam.venue,
                        venue_latitude: datam.venue_latitude,
                        venue_longitude: datam.venue_longitude,
                        map_url: datam.map_url,
                        event_description: datam.event_description,
                        featured_image: datam.featured_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.featured_image
                          : '',
                        banner_image: datam.banner_image
                          ? `${constants.IMAGE_BASE_URL}` + datam.banner_image
                          : '',

                        event_date_from: datam.event_date_from,
                        event_date_to: datam.event_date_to,
                        event_time_from: datam.event_time_from,
                        event_time_to: datam.event_time_to,
                        total_seats: datam.total_seats,
                        available_seats: datam.available_seats,
                        single_ticket_price: datam.single_ticket_price,
                        event_type:
                          datam.event_type == 1 ? 'Online' : 'Offline',
                        event_ticket_status:
                          datam.event_ticket_status == 1
                            ? 'Selling Fast'
                            : datam.event_ticket_status == 2
                            ? 'SoldOut'
                            : 'Selling Slow',

                        about_the_event: datam.about_the_event,
                        detailed_address: datam.detailed_address,
                        contact_ph: datam.contact_ph,
                        contact_email: datam.contact_email,
                        event_subscription_status_id:
                          datam.event_subscription_status,
                        event_subscription_status:
                          datam.event_subscription_status == 1
                            ? 'Free'
                            : datam.event_subscription_status == 2
                            ? 'Paid'
                            : '',
                        additional_venue_address:
                          datam.additional_venue_address,
                        about_the_event_title: datam.about_the_event_title,
                        created_by:
                          datam.users.first_name + ' ' + datam.users.last_name,
                        status: datam.status == 1 ? 'Active' : 'Inactive',
                        status_id: datam.status == 1,
                        created_at: datam.created_at,
                        event_sponsors: eventSponsorData,
                        event_ticket_prices: eventTicketData,
                        event_period_status:
                          eventDate > new Date()
                            ? 'Upcoming'
                            : eventDate <= new Date() &&
                              eventToDate >= new Date()
                            ? 'On going'
                            : eventToDate < new Date()
                            ? 'Past'
                            : '',
                        agent_ids: datam.agent_ids
                          ? datam.agent_ids
                              .split(',')
                              .map((value) => parseInt(value, 10))
                          : [],
                      }
                    : {};
                })
              : {};
          break;
      }
      return result ? result : {};
    }
  }
  getCountryName(countryCode): string {
    switch (countryCode) {
      case 1:
        return 'United States';
      case 2:
        return 'Canada';
      case 3:
        return 'United Kingdom';
      case 4:
        return 'UAE';
      default:
        return 'Unknown Country';
    }
  }
  generateSignedUrl(bucketName: string, objectKey: string): Promise<string> {
    const config = {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      region: process.env.AWS_S3_REGION,
    };

    const s3 = new AWS.S3(config);

    // const signedUrlExpireSeconds = 60 * 5; // The URL will expire in 5 minutes
    const signedUrlExpireSeconds = 86400; // The URL will expire in 1 day

    const params = {
      Bucket: bucketName,
      Key: objectKey,
      Expires: signedUrlExpireSeconds,
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (error, url) => {
        if (error) {
          reject(error);
        } else {
          resolve(url);
        }
      });
    });
  }
}
