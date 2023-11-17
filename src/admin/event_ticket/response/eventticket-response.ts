export class EventTicketResponseData {
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
                  price: datam.price,
                  event_name: datam.events.title,
                  ticket_type: datam.ticket_types.title,
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
                      price: datam.price,
                      event_name: datam.events.title,
                      ticket_type: datam.ticket_types.title,
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
          result =
            data.length > 0
              ? data.map((data: any) => {
                  return {
                    id: data.id,
                    title: data.title,
                    price: data.price,
                    event_name: data.events.title,
                    ticket_type: data.ticket_types.title,
                    status_id: data.status,
                    created_at: data.created_at,
                    created_by:
                      data.users.first_name + ' ' + data.users.last_name,
                  };
                })
              : {};
          break;
        case 2: //USER
          result =
            data.length > 0
              ? data.map((datam: any) => {
                  return {
                    id: data.id,
                    title: data.title,
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
