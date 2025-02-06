/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DatabaseClient {
  readonly query: DatabaseQuery

  connect(): Promise<void>
  connected(): boolean
  disconnect(): Promise<void>
  transaction(callback: DatabaseTransactionCallback): Promise<void>
}

export type DatabaseTransactionCallback = (query: DatabaseQuery) => Promise<void>

export interface DatabaseQuery {
  any<T = any>(query: string, params?: any[]): Promise<T[]>
  many<T = any>(query: string, params?: any[]): Promise<T[]>
  one<T = any>(query: string, params?: any[]): Promise<T>
  oneOrNone<T = any>(query: string, params?: any[]): Promise<T | null>
  none(query: string, params?: any[]): Promise<void>
}

export type DatabaseClientParams = {
  schema: string
  host: string
  port: number
  name: string
  user: string
  password: string
}
