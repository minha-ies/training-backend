import { AuthenticationError, NotFoundError } from '@shared/errors'

export class InvalidUserCredentialsError extends AuthenticationError {
  constructor() {
    super('invalid user credentials')
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('user not found')
  }
}
