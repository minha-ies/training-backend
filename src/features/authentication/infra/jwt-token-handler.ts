import jwt from 'jsonwebtoken'

import { TokenHandler } from '../application/contracts'

export class JwtTokenHandler implements TokenHandler<object> {
  constructor(private readonly params: JwtTokenHandlerParams) {}

  async encrypt(payload: object): Promise<string> {
    return jwt.sign(payload, this.params.secret, { expiresIn: this.params.expiresInSecs })
  }
}

export type JwtTokenHandlerParams = {
  secret: string
  expiresInSecs: number
}
