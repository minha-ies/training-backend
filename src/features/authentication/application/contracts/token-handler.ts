export interface TokenHandler<T> {
  encrypt(payload: T): Promise<string>
}
