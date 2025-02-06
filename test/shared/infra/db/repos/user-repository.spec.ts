import { DeepMockProxy, mockDeep } from 'jest-mock-extended'

import { User } from '@shared/domain'
import { DatabaseClient } from '@shared/infra/db/contracts'
import { DatabaseError } from '@shared/infra/db/errors'
import { UserRepository } from '@shared/infra/repos'

describe(UserRepository.name, () => {
  let user: User
  let dbClient: DeepMockProxy<DatabaseClient>
  let sut: UserRepository

  beforeEach(() => {
    user = new User(12345, 'John Doe', 'john.doe@email.com')
    dbClient = mockDeep()
    dbClient.connected.mockReturnValue(true)
    dbClient.query.oneOrNone.mockResolvedValue(user)
    sut = new UserRepository(dbClient)
  })

  it('should call LoadUser.loadByEmail with correct input/output', async () => {
    const result = await sut.loadByEmail(user.email)

    expect(dbClient.query.oneOrNone).toHaveBeenCalledWith(expect.any(String), [user.email])
    expect(result).toEqual(user)
  })

  it('should return undefined if LoadUser.loadByEmail returns null', async () => {
    dbClient.query.oneOrNone.mockResolvedValueOnce(null)

    const result = await sut.loadByEmail(user.email)

    expect(dbClient.query.oneOrNone).toHaveBeenCalledWith(expect.any(String), [user.email])
    expect(result).toBeUndefined()
  })

  it('should throw DatabaseError if LoadUser.loadByEmail throws', async () => {
    dbClient.query.oneOrNone.mockRejectedValueOnce(new Error('any_database_error'))

    const promise = sut.loadByEmail(user.email)

    await expect(promise).rejects.toBeInstanceOf(DatabaseError)
  })
})
