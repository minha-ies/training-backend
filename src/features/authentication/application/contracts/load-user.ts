import { User } from '../../domain/user'

export interface LoadUser {
  loadByEmail(email: string): User | undefined
}
