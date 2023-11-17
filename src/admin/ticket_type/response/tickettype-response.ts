export class TicketTypeResponseData {
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
                  ticket_count: datam.ticket_count,
                  price: datam.price,
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
                      ticket_count: datam.ticket_count,
                      price: datam.price,
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
                  ticket_count: data.ticket_count,
                  price: data.price,
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
                  ticket_count: data.ticket_count,
                  price: data.price,
                  status: data.status == 1 ? 'Active' : 'Inactive',
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
