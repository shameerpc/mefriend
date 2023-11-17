import { UserRole } from 'src/common/enum/user-role.enum';

export class BookingResponseData {
  // Role based Get booking response
  //Defines all the roles
  getAllResponse(data: any, role) {
    let result: any = [];
    switch (role) {
      case UserRole.SUPERADMIN: //Super Admin
        result =
          data.length > 0
            ? data.map((datam: any) => {
                return {
                  id: datam.id,
                  coupon_code: datam.coupon_code,
                  ticket_count: datam.total_ticket_count,
                  amount: datam.total_ticket_amount,
                  event: datam.events.title,
                  event_id: datam.event_id,
                  created_by:
                    datam.users.first_name + ' ' + datam.users.last_name,
                  status: datam.status == 1 ? 'Active' : 'Inactive',
                  user: datam.user.first_name + '' + datam.user.last_name,
                  ticket_price: datam.booking_event_ticket_type[0]?.price ?? '',
                  coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
                  discount_value: data.booking_coupon[0]?.discount_value ?? '',
                  minimum_discount_value:
                    data.booking_coupon[0]?.minimum_discount_value ?? '',
                  minimum_coupon_redeem_count:
                    data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',

                  additional_users: datam.booking_additional_users ?? [],
                };
              })
            : [];

        break;
      case UserRole.ORGANIZER: //ORGANIZER
        result =
          data.length > 0
            ? data.map((datam: any) => {
                return datam.status == 1
                  ? {
                      id: datam.id,
                      coupon_code: datam.coupon_code,
                      ticket_count: datam.total_ticket_count,
                      amount: datam.total_ticket_amount,
                      event: datam.events.title,
                      created_by:
                        datam.users.first_name + ' ' + datam.users.last_name,
                      status: datam.status == 1 ? 'Active' : 'Inactive',
                      user: datam.user.first_name + '' + datam.user.last_name,
                      coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
                      discount_value:
                        data.booking_coupon[0]?.discount_value ?? '',
                      minimum_discount_value:
                        data.booking_coupon[0]?.minimum_discount_value ?? '',
                      minimum_coupon_redeem_count:
                        data.booking_coupon[0]?.minimum_coupon_redeem_count ??
                        '',
                    }
                  : [];
              })
            : [];
        break;
      case 3: //SUB_ADMIN
        break;
      case 4: //ORGANIZER
        break;
    }

    return result;
  }
  getiDResponse(data: any, role) {
    let result: any = [];
    switch (role) {
      case UserRole.SUPERADMIN: //Super Admin
        result = {
          id: data.id,
          coupon_code: data.coupon_code,
          ticket_count: data.total_ticket_count,
          amount: data.total_ticket_amount,
          event: data.events.title,
          event_id: data.event_id,
          created_by: data.users.first_name + ' ' + data.users.last_name,
          status: data.status == 1 ? 'Active' : 'Inactive',
          user: data.user.first_name + '' + data.user.last_name,
          ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
          coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
          discount_value: data.booking_coupon[0]?.discount_value ?? '',
          minimum_discount_value:
            data.booking_coupon[0]?.minimum_discount_value ?? '',
          minimum_coupon_redeem_count:
            data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
          additional_users: data.booking_additional_users ?? [],
        };
        break;
      case UserRole.USER: // User
        result = {
          id: data.id,
          coupon_code: data.coupon_code,
          ticket_count: data.total_ticket_count,
          amount: data.total_ticket_amount,
          event: data.events.title,
          event_id: data.event_id,
          created_by: data.users.first_name + ' ' + data.users.last_name,
          status: data.status == 1 ? 'Active' : 'Inactive',
          user: data.user.first_name + '' + data.user.last_name,
          ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
          coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
          discount_value: data.booking_coupon[0]?.discount_value ?? '',
          minimum_discount_value:
            data.booking_coupon[0]?.minimum_discount_value ?? '',
          minimum_coupon_redeem_count:
            data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
          additional_users: data.booking_additional_users ?? [],
        };
        break;
      case UserRole.ORGANIZER: //ORGANIZER
        result = {
          id: data.id,
          coupon_code: data.coupon_code,
          ticket_count: data.total_ticket_count,
          amount: data.total_ticket_amount,
          event: data.events.title,
          event_id: data.event_id,
          created_by: data.users.first_name + ' ' + data.users.last_name,
          status: data.status == 1 ? 'Active' : 'Inactive',
          user: data.user.first_name + '' + data.user.last_name,
          ticket_price: data.booking_event_ticket_type[0]?.price ?? '',
          coupon_name: data.booking_coupon[0]?.coupon_name ?? '',
          discount_value: data.booking_coupon[0]?.discount_value ?? '',
          minimum_discount_value:
            data.booking_coupon[0]?.minimum_discount_value ?? '',
          minimum_coupon_redeem_count:
            data.booking_coupon[0]?.minimum_coupon_redeem_count ?? '',
          additional_users: data.booking_additional_users ?? [],
        };
        break;
      case 3: //SUB_ADMIN
        break;
      case 4: //ORGANIZER
        break;
    }

    return result;
  }
}
