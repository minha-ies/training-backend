import { mock, MockProxy } from 'jest-mock-extended'

import { AuthenticationService } from '@features/authentication/application/authentication-service'
import { LoadUser, UserAuthentication } from '@features/authentication/application/contracts'
import {
  AuthenticationError,
  InvalidUserCredentialsError,
  UserNotFoundError,
} from '@features/authentication/application/errors'
import { User } from '@features/authentication/domain'

describe(AuthenticationService.name, () => {
  let name: string
  let email: string
  let password: string
  let user: User
  let userAuth: MockProxy<UserAuthentication>
  let loadUser: MockProxy<LoadUser>
  let sut: AuthenticationService

  beforeEach(() => {
    name = 'John Doe'
    email = 'john.doe@email.com'
    password = 'any_password'
    user = new User(name, email)
    userAuth = mock<UserAuthentication>()
    userAuth.signIn.mockReturnValue(true)
    loadUser = mock<LoadUser>()
    loadUser.loadByEmail.mockReturnValue(user)
    sut = new AuthenticationService(userAuth, loadUser)
  })

  test('should call UserAuthentication.signIn() with correct input', () => {
    // Act
    sut.execute(email, password)
    // Assert
    expect(userAuth.signIn).toHaveBeenCalledWith(email, password)
    expect(userAuth.signIn).toHaveBeenCalledTimes(1)
  })

  test('should return InvalidUserCredentialsError if UserAuthentication fails', () => {
    // Arrange
    userAuth.signIn.mockReturnValueOnce(false)
    // Act
    try {
      sut.execute(email, password)
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(InvalidUserCredentialsError)
    }
  })

  test('should throw AuthenticationError if UserAuthentication throws', () => {
    // Arrange
    userAuth.signIn.mockImplementationOnce(() => {
      throw new Error('any_error')
    })
    // Act
    try {
      sut.execute(email, password)
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(AuthenticationError)
    }
  })

  test('should call LoadUser if UserAuthentication succeeds', () => {
    // Arrange
    userAuth.signIn.mockReturnValueOnce(true)
    // Act
    sut.execute(email, password)
    // Assert
    expect(loadUser.loadByEmail).toHaveBeenCalledWith(email)
    expect(loadUser.loadByEmail).toHaveBeenCalledTimes(1)
  })

  test('should throw UserNotFoundError if LoadUser fails', () => {
    // Arrange
    loadUser.loadByEmail.mockReturnValueOnce(undefined)
    // Assert
    expect(() => sut.execute(email, password)).toThrow(UserNotFoundError)
  })

  test('should throws UnexpectedAuthenticationError if LoadUser throws', () => {
    // Arrange
    loadUser.loadByEmail.mockImplementationOnce(() => {
      throw new Error('any_loading_user_error')
    })
    // Assert
    expect(() => sut.execute(email, password)).toThrow(AuthenticationError)
  })
})
