import { User } from '../../domain/user'

export interface LoadUser {
  loadByEmail(email: string): Promise<User | undefined>
}
