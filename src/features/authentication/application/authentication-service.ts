import { Service } from '@shared/application'
import { AuthenticationError } from '@shared/errors'

import { UserAuthentication, LoadUser, TokenHandler } from './contracts'
import { Authentication } from '../domain'
import { InvalidUserCredentialsError, UserNotFoundError } from './errors'

export class AuthenticationService implements Service<AuthenticationServiceParams, Authentication> {
  constructor(
    private readonly userAuth: UserAuthentication,
    private readonly loadUser: LoadUser,
    private readonly tokenHandler: TokenHandler<object>,
  ) {}

  async execute(params: AuthenticationServiceParams): Promise<Authentication> {
    const { email, password } = params

    try {
      const result = await this.userAuth.signIn(email, password)
      if (!result) throw new InvalidUserCredentialsError()

      const user = await this.loadUser.loadByEmail(email)
      if (!user) throw new UserNotFoundError()

      const payload = { email: user.email, name: user.name }
      const token = await this.tokenHandler.encrypt(payload)

      return { token }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error
      }
      const message = `unexpected error: ${(error as Error).message}`
      console.log(message)
      throw new AuthenticationError(message)
    }
  }
}

export type AuthenticationServiceParams = {
  email: string
  password: string
}
