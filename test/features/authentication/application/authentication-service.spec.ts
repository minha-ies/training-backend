import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationService } from '@features/authentication/application/authentication-service'
import { LoadUser, TokenHandler, UserAuthentication } from '@features/authentication/application/contracts'
import {
  AuthenticationError,
  InvalidUserCredentialsError,
  UserNotFoundError,
} from '@features/authentication/application/errors'
import { User } from '@features/authentication/domain'

describe(AuthenticationService.name, () => {
  let token: string
  let name: string
  let email: string
  let password: string
  let user: User
  let userAuth: MockProxy<UserAuthentication>
  let loadUser: MockProxy<LoadUser>
  let tokenHandler: MockProxy<TokenHandler<object>>
  let sut: AuthenticationService

  beforeEach(() => {
    token = 'any_token'
    name = 'John Doe'
    email = 'john.doe@email.com'
    password = 'any_password'
    user = new User(name, email)
    userAuth = mock<UserAuthentication>()
    userAuth.signIn.mockResolvedValue(true)
    loadUser = mock<LoadUser>()
    loadUser.loadByEmail.mockResolvedValue(user)
    tokenHandler = mock<TokenHandler<object>>()
    tokenHandler.encrypt.mockResolvedValue(token)
    sut = new AuthenticationService(userAuth, loadUser, tokenHandler)
  })

  it('should call UserAuthentication.signIn() with correct input', async () => {
    // Act
    await sut.execute({ email, password })
    // Assert
    expect(userAuth.signIn).toHaveBeenCalledWith(email, password)
    expect(userAuth.signIn).toHaveBeenCalledTimes(1)
  })

  it('should return InvalidUserCredentialsError if UserAuthentication fails', async () => {
    // Arrange
    userAuth.signIn.mockResolvedValueOnce(false)
    // Act
    try {
      await sut.execute({ email, password })
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(InvalidUserCredentialsError)
    }
  })

  it('should throw AuthenticationError if UserAuthentication throws', async () => {
    // Arrange
    userAuth.signIn.mockRejectedValueOnce(new Error('any_error'))
    // Act
    try {
      await sut.execute({ email, password })
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(AuthenticationError)
    }
  })

  it('should call LoadUser if UserAuthentication succeeds', async () => {
    // Arrange
    userAuth.signIn.mockResolvedValueOnce(true)
    // Act
    await sut.execute({ email, password })
    // Assert
    expect(loadUser.loadByEmail).toHaveBeenCalledWith(email)
    expect(loadUser.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('should throw UserNotFoundError if LoadUser fails', async () => {
    // Arrange
    loadUser.loadByEmail.mockResolvedValueOnce(undefined)
    // Assert
    const promise = sut.execute({ email, password })
    await expect(promise).rejects.toThrow(UserNotFoundError)
  })

  it('should throws AuthenticationError if LoadUser throws', async () => {
    // Arrange
    loadUser.loadByEmail.mockRejectedValueOnce(new Error('any_loading_user_error'))
    // Act
    const promise = sut.execute({ email, password })
    // Assert
    await expect(promise).rejects.toThrow(AuthenticationError)
  })

  it('should call TokenHandler if LoadUser is succeeds', async () => {
    // Act
    await sut.execute({ email, password })
    // Assert
    expect(tokenHandler.encrypt).toHaveBeenCalledWith({ email, name })
    expect(tokenHandler.encrypt).toHaveBeenCalledTimes(1)
  })

  it('should throw AuthenticationError if TokenHandler throws', async () => {
    // Arrange
    tokenHandler.encrypt.mockRejectedValueOnce(new Error('any_encrypt_error'))
    // Act
    const promise = sut.execute({ email, password })
    // Assert
    await expect(promise).rejects.toThrow(AuthenticationError)
  })

  it('should return authentication token if TokenHandler succeeds', async () => {
    // Act
    const result = await sut.execute({ email, password })
    // Assert
    expect(result).toEqual({ token: 'any_token' })
  })
})
