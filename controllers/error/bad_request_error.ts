import CustomServerError from './custom_server_error'

export default class BadRequestErr extends CustomServerError {
  constructor(message: string) {
    super({ statusCode: 400, message })
  }
}
