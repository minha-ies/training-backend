export interface UserAuthentication {
  signIn(email: string, password: string): boolean
}
