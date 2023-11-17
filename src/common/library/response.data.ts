export class ResponsesData {
  errorResponse(message: string, data: object = {}) {
    return {
      status: false,
      message,
      data: data,
    };
  }

  successResponse(data: object, message: string = 'Success') {
    return {
      status: true,
      message: message,
      data,
    };
  }
}
