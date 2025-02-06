import { HttpStatus } from '@shared/infra/http'

abstract class BaseError extends Error {
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, details?: unknown) {
    super(message, HttpStatus.badRequest, details)
  }
}

export class AuthenticationError extends BaseError {
  constructor(message = 'Authentication failed') {
    super(message, HttpStatus.unauthorized)
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = 'Forbidden: You do not have permission') {
    super(message, HttpStatus.forbidden)
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, HttpStatus.notFound)
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict detected', details?: unknown) {
    super(message, HttpStatus.conflict, details)
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal server error', details?: unknown) {
    super(message, HttpStatus.internalServerError, details)
  }
}
