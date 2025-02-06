/* eslint-disable @typescript-eslint/no-explicit-any */
import pgPromise, { IDatabase, IMain, ITask } from 'pg-promise'

import { DatabaseClient, DatabaseClientParams, DatabaseQuery, DatabaseTransactionCallback } from './contracts'
import { DatabaseConnectionError } from './errors'

export class PgPromiseAdapter implements DatabaseClient {
  private readonly pgp: IMain
  private db: IDatabase<any> | null
  private _query: DatabaseQuery
  readonly connectionUri: string

  constructor(readonly params: DatabaseClientParams) {
    this.pgp = pgPromise()
    this.db = null
    this.connectionUri = this.connectionString(this.params)
    this._query = new PgPromiseQuery(null as any)
  }

  private connectionString({ schema, host, port, name, user, password }: DatabaseClientParams): string {
    return `${schema}://${user}:${encodeURIComponent(password)}@${host}:${port}/${name}`
  }

  get query(): DatabaseQuery {
    return this._query
  }

  connected(): boolean {
    return this.db != null
  }

  async connect(): Promise<void> {
    if (this.db == null) {
      this.db = this.pgp(this.connectionUri)
      this._query = new PgPromiseQuery(this.db!)
      try {
        await this.forceConnection()
      } catch {
        this.disconnect()
        throw new DatabaseConnectionError()
      }
    }
  }

  private async forceConnection(): Promise<void> {
    await this.query.one('select 1 as value')
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.pgp.end()
      this.db = null
      this._query = new PgPromiseQuery(null as any)
    }
  }

  async transaction(callback: DatabaseTransactionCallback): Promise<void> {
    if (this.db == null) {
      throw new DatabaseConnectionError()
    }
    return this.db.tx(async (t) => {
      return callback(new PgPromiseQuery(t))
    })
  }
}

export class PgPromiseQuery implements DatabaseQuery {
  constructor(private connection: IDatabase<any> | ITask<any>) {}

  async any<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (this.connection == null) {
      throw new DatabaseConnectionError()
    }
    return this.connection.any<T>(query, params)
  }
  async many<T = any>(query: string, params?: any[]): Promise<T[]> {
    if (this.connection == null) {
      throw new DatabaseConnectionError()
    }
    return this.connection.many<T>(query, params)
  }
  async one<T = any>(query: string, params?: any[]): Promise<T> {
    if (this.connection == null) {
      throw new DatabaseConnectionError()
    }
    return this.connection.one<T>(query, params)
  }
  async oneOrNone<T = any>(query: string, params?: any[]): Promise<T | null> {
    if (this.connection == null) {
      throw new DatabaseConnectionError()
    }
    return this.connection.oneOrNone<T>(query, params)
  }
  async none(query: string, params?: any[]): Promise<void> {
    if (this.connection == null) {
      throw new DatabaseConnectionError()
    }
    this.connection.none(query, params)
  }
}
