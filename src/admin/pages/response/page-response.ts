export class PageResponseData {
  // Role based Get pages response
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
                  slug: datam.slug,
                  description: datam.description,
                  status_id: datam.status,
                  status: datam.status == 1 ? 'Active' : 'Inactive',
                  created_by:
                    datam.users.first_name + ' ' + datam.users.last_name,
                  created_at: datam.created_at,
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
                      description: data.description,
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
                  slug: data.slug,
                  description: data.description,
                  status_id: data.status,
                  created_At: data.created_at,
                  status: data.status == 1 ? 'Active' : 'Inactive',
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
                  description: data.description,
                  status_id: data.status,
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
