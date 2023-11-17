export class CouponResponseData {
  // Role based Get locations response
  //Defines all the roles
  getAllResponse(data: any, role) {
    let result: any = [];
    switch (role) {
      case 1: //Super Admin
        result =
          data.length > 0
            ? data.map((datam: any) => {
                return {
                  id: datam.id,
                  title: datam.title,
                  coupon_name: datam.coupon_name,
                  coupon_code: datam.coupon_code,
                  discount_type: datam.discount_type,
                  minimum_discount_value: datam.minimum_discount_value,
                  discount_value: datam.discount_value,
                  coupon_code_duration_from: datam.coupon_code_duration_from,
                  coupon_code_duration_to: datam.coupon_code_duration_to,
                  minimum_coupon_redeem_count:
                    datam.minimum_coupon_redeem_count,
                  status: datam.status == 1 ? 'Active' : 'Inactive',
                  status_id: datam.status,
                  created_at: datam.created_at,
                  created_by:
                    datam.users.first_name + ' ' + datam.users.last_name,
                };
              })
            : [];

        break;
      case 2: //USER
        result =
          data.length > 0
            ? data.map((datam: any) => {
                return datam.status == 1
                  ? {
                      id: datam.id,
                      title: datam.title,
                      coupon_name: datam.coupon_name,
                      coupon_code: datam.coupon_code,
                      discount_type: datam.discount_type,
                      minimum_discount_value: datam.minimum_discount_value,
                      discount_value: datam.discount_value,

                      coupon_code_duration_from:
                        datam.coupon_code_duration_from,
                      coupon_code_duration_to: datam.coupon_code_duration_to,
                      minimum_coupon_redeem_count:
                        datam.minimum_coupon_redeem_count,
                      status: datam.status == 1 ? 'Active' : 'Inactive',
                      status_id: datam.status,
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

  //Role based Get locations BY ID response
  getByIdResponse(data: any, role) {
    let result;
    if (data) {
      switch (role) {
        case 1: //Super Admin
          data.length > 0
            ? data.map((data: any) => {
                result = {
                  id: data.id,
                  title: data.title,
                  coupon_name: data.coupon_name,
                  coupon_code: data.coupon_code,
                  discount_type: data.discount_type,
                  minimum_discount_value: data.minimum_discount_value,
                  discount_value: data.discount_value,
                  coupon_code_duration_from: data.coupon_code_duration_from,
                  coupon_code_duration_to: data.coupon_code_duration_to,
                  minimum_coupon_redeem_count: data.minimum_coupon_redeem_count,
                  status: data.status == 1 ? 'Active' : 'Inactive',
                  status_id: data.status,
                  created_at: data.created_at,
                  created_by:
                    data.users.first_name + ' ' + data.users.last_name,
                };
              })
            : {};
          break;
        case 2: //USER
          data.length > 0
            ? data.map((data: any) => {
                result = {
                  id: data.id,
                  title: data.title,
                  coupon_name: data.coupon_name,
                  coupon_code: data.coupon_code,
                  discount_type: data.discount_type,
                  minimum_discount_value: data.minimum_discount_value,
                  discount_value: data.discount_value,

                  coupon_code_duration_from: data.coupon_code_duration_from,
                  coupon_code_duration_to: data.coupon_code_duration_to,
                  minimum_coupon_redeem_count: data.minimum_coupon_redeem_count,
                  status: data.status == 1 ? 'Active' : 'Inactive',
                  status_id: data.status,
                };
              })
            : {};
          break;
        case 3: //SUB_ADMIN
          break;
        case 4: //ORGANIZER
          break;
      }
      return result ? result : {};
    }
  }
}
