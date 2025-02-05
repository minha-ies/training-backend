import { UserAuthentication, LoadUser, TokenHandler } from './contracts'
import { Service, Authentication } from '../domain'
import { AuthenticationError, InvalidUserCredentialsError, UserNotFoundError } from './errors'

export class AuthenticationService implements Service<AuthenticationServiceParams, Authentication> {
  constructor(
    private readonly userAuth: UserAuthentication,
    private readonly loadUser: LoadUser,
    private readonly tokenHandler: TokenHandler<object>,
  ) {}

  async execute(params: AuthenticationServiceParams): Promise<Authentication> {
    const email = params.email
    const password = params.password
    try {
      const result = await this.userAuth.signIn(email, password)
      if (!result) throw new InvalidUserCredentialsError()
      const user = await this.loadUser.loadByEmail(email)
      if (user === undefined) throw new UserNotFoundError()
      const payload = { email: user.email, name: user.name }
      const token = await this.tokenHandler.encrypt(payload)
      return { token }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error
      } else {
        throw new AuthenticationError(`unexpected error: ${(error as Error).message}`)
      }
    }
  }
}

export type AuthenticationServiceParams = {
  email: string
  password: string
}
