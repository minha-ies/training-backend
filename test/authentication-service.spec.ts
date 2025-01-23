
import { mock } from 'jest-mock-extended'


class AuthenticationService {
  constructor (private readonly userAuth: UserAuthentication) { }

  execute(email: string, password: string): boolean {
    return this.userAuth.signIn(email, password)
  }
} 

interface UserAuthentication {
  signIn(email: string, password: string): boolean
}

describe('AuthenticationService', () => {

  test('should call UserAuthentication.signIn() with correct input', () => {
    // Arrange
    const email = 'john.doe@email.com' 
    const password = 'any_password'
    const userAuth = mock<UserAuthentication>()
    const sut = new AuthenticationService(userAuth)
    // Act
    sut.execute(email, password)
    // Assert
    expect(userAuth.signIn).toHaveBeenCalledWith(email, password)
    expect(userAuth.signIn).toHaveBeenCalledTimes(1)
  })

  test('should return true if UserAuthentication.signIn() return true', () => {

    // Arrange
    const email = 'john.doe@email.com' 
    const password = 'any_password'
    const userAuth = mock<UserAuthentication>()
    userAuth.signIn.mockReturnValue(true)
    const sut = new AuthenticationService(userAuth)
    // Act
    const result = sut.execute(email, password)
    // Assert
    expect(result).toBe(true)
  })
})
