export class CategoryResponseData {
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
                  sub_title: datam.sub_title ? datam.sub_title : '',
                  category_type_id: datam.category_type,
                  // category_type:
                  //   datam.category_type === 1
                  //     ? 'Open Category'
                  //     : 'General Category',
                  description: datam.description,
                  slug: datam.slug,
                  created_at: datam.created_at,
                  image: datam.image,
                  status: datam.status == 1 ? 'Active' : 'Inactive',
                  status_id: datam.status,
                  sort_order: datam.sort_order ? datam.sort_order : null,
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
                      sub_title: datam.sub_title ? datam.sub_title : '',
                      category_type_id: datam.category_type,
                      // category_type:
                      //   datam.category_type === 1
                      //     ? 'Open Category'
                      //     : 'General Category',
                      description: datam.description,
                      slug: datam.slug,
                      image: datam.image,
                      status: datam.status == 1 ? 'Active' : 'Inactive',
                      status_id: datam.status,
                      sort_order: datam.sort_order ? datam.sort_order : null,
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
                  // category_type:
                  //   data.category_type === 1
                  //     ? 'Open Category'
                  //     : 'General Category',
                  status: data.status == 1 ? 'Active' : 'Inactive',
                  status_id: data.status,
                  created_by:
                    data.users.first_name + ' ' + data.users.last_name,
                  created_at: data.created_at,
                  sub_title: data.sub_title ? data.sub_title : '',
                  description: data.description,
                  slug: data.slug,
                  image: data.image,
                  sort_order: data.sort_order ? data.sort_order : null,
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
                  status: data.status == 1 ? 'Active' : 'Inactive',
                  status_id: data.status,
                  created_by:
                    data.users.first_name + ' ' + data.users.last_name,
                  created_at: data.created_at,
                  sub_title: data.sub_title ? data.sub_title : '',
                  description: data.description,
                  slug: data.slug,
                  image: data.image,

                  sort_order: data.sort_order ? data.sort_order : null,
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
