import { BaseError } from '@shared/errors'
import { HttpStatus } from '@shared/infra/http'

export class DatabaseError extends BaseError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode ?? HttpStatus.internalServerError)
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message?: string) {
    super(message ?? 'database connection error')
  }
}
