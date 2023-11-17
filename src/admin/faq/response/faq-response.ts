export class FaqResponseData {
  // Role based Get Faqs response
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
                  question: datam.question,
                  answer: datam.answer,
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
                      question: datam.question,
                      answer: datam.answer,
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

  //Role based Get Faqs BY ID response
  getByIdResponse(data: any, role) {
    let result;
    if (data) {
      switch (role) {
        case 1: //Super Admin
          data.length > 0
            ? data.map((data: any) => {
                result = {
                  id: data.id,
                  question: data.question,
                  answer: data.answer,
                  status_id: data.status,
                  created_At: data.created_At,
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
                  question: data.question,
                  status_id: data.status,
                  answer: data.answer,
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
