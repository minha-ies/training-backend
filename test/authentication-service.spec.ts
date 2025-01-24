import { mock, MockProxy } from 'jest-mock-extended'

class AuthenticationService {
  constructor(
    private readonly userAuth: UserAuthentication,
    private readonly loadUser: LoadUser,
  ) {}

  execute(email: string, password: string): void {
    if (this.userAuth.signIn(email, password)) {
      if (this.loadUser.loadByEmail(email) == undefined) {
        throw new UserNotFoundError()
      }
    }
  }
}

interface UserAuthentication {
  signIn(email: string, password: string): boolean
}

interface LoadUser {
  loadByEmail(email: string): User | undefined
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

class UserNotFoundError extends AuthenticationError {
  constructor() {
    super('user not found')
  }
}

class User {
  constructor(
    readonly name: string,
    readonly email: string,
  ) {}
}

describe('AuthenticationService', () => {
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

  test('should return undefined if UserAuthentication fails', () => {
    // Arrange
    userAuth.signIn.mockReturnValueOnce(false)
    // Act
    const result = sut.execute(email, password)
    // Assert
    expect(result).toBeUndefined()
  })

  test('should throw AuthenticationError if UserAuthentication throws', () => {
    // Arrange
    const error = new AuthenticationError('any_error')
    userAuth.signIn.mockImplementationOnce(() => {
      throw error
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
  })

  test('should call TokenHandler if LoadUser succeeds', () => {})

  test('should throw UserNotFoundError if LoadUser fails', () => {
    // Arrange
    loadUser.loadByEmail.mockReturnValueOnce(undefined)
    // Assert
    expect(() => sut.execute(email, password)).toThrow(UserNotFoundError)
  })

  test('should throws UnexpectedError if LoadUser throw', () => {})
})
