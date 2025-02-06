import { InternalServerError } from '@shared/errors'

export class DatabaseError extends InternalServerError {
  constructor(message: string, details?: unknown) {
    super(message, details)
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message?: string, details?: unknown) {
    super(message ?? 'database connection error', details)
  }
}
