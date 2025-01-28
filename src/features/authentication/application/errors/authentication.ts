export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class InvalidUserCredentialsError extends AuthenticationError {
  constructor() {
    super('invalid user credentials')
  }
}

export class UserNotFoundError extends AuthenticationError {
  constructor() {
    super('user not found')
  }
}
