import jwt from 'jsonwebtoken'

import { JwtTokenHandler, JwtTokenHandlerParams } from '@features/authentication/infra'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let id: number
  let email: string
  let payload: object
  let secret: string
  let expiresInSecs: number
  let options: JwtTokenHandlerParams
  let fakeJwt: jest.Mocked<typeof jwt>
  let sut: JwtTokenHandler

  beforeEach(() => {
    id = 123456
    email = 'john.doe@email.com'
    payload = { id, email }
    secret = 'any_secret'
    expiresInSecs = 3600
    options = { secret, expiresInSecs }
    fakeJwt = jwt as jest.Mocked<typeof jwt>
    sut = new JwtTokenHandler(options)
  })

  it('should call jwt.sign with correct input/output', async () => {
    const token = 'any_jwt_token'
    fakeJwt.sign.mockImplementationOnce(() => token)

    const result = await sut.encrypt(payload)

    expect(fakeJwt.sign).toHaveBeenCalledWith(payload, secret, { expiresIn: expiresInSecs })
    expect(result).toBe(token)
  })

  it('should throw if jwt throws', async () => {
    const error = new Error('any_jwt_error')
    fakeJwt.sign.mockImplementationOnce(() => {
      throw error
    })

    const promise = sut.encrypt(payload)

    await expect(promise).rejects.toThrow(error)
  })
})
