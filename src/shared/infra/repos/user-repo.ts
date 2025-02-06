import { LoadUser } from '@features/authentication/application/contracts'
import { User } from '@shared/domain'

import { DatabaseClient } from '../db/contracts'
import { DatabaseError } from '../db/errors'

export class UserRepository implements LoadUser {
  constructor(private readonly dbClient: DatabaseClient) {}

  async loadByEmail(email: string): Promise<User | undefined> {
    const sql = 'select id,name,email from mies.user email=$1'
    try {
      const data = await this.dbClient.query.oneOrNone<User>(sql, [email])
      if (data === null) return undefined
      return new User(data.id, data.name, data.email)
    } catch {
      throw new DatabaseError('unexpected error')
    }
  }
}
