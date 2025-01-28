import { LoadUser } from './contracts/load-user'
import { UserAuthentication } from './contracts/user-authentication'
import { AuthenticationError, InvalidUserCredentialsError, UserNotFoundError } from './errors/authentication'

export class AuthenticationService {
  constructor(
    private readonly userAuth: UserAuthentication,
    private readonly loadUser: LoadUser,
  ) {}

  execute(email: string, password: string): void {
    try {
      if (!this.userAuth.signIn(email, password)) throw new InvalidUserCredentialsError()
      if (this.loadUser.loadByEmail(email) === undefined) throw new UserNotFoundError()
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error
      } else {
        throw new AuthenticationError('unexpected error')
      }
    }
  }
}
