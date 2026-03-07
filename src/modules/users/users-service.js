'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { users } from '@/drizzle/schemas/users-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  createUserRequestDto,
  updateUserRequestDto,
  userListResponseDto,
  userResponseDto,
} from './users-dto'

export async function getAllUsers(urlEndpoint) {
  const startTime = Date.now()
  const action = 'users:getAll'

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(users)
    const data = userListResponseDto.parse(rows)

    logger.info('Users fetched successfully', {
      action,
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function getUserById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'users:getById'

  try {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
    const row = rows[0]

    if (!row) throw ApiError.notFound('User not found')

    const data = userResponseDto.parse(row)

    logger.info('User fetched successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}

export async function createUser(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'users:create'

  try {
    const validated = createUserRequestDto.parse(payload)

    // TODO: hash password before storing when auth is ready
    const [created] = await db.insert(users).values(validated).returning()
    const data = userResponseDto.parse(created)

    logger.info('User created successfully', {
      action,
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, startTime })
  }
}

export async function updateUser(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'users:update'

  try {
    const validated = updateUserRequestDto.parse(payload)

    const [updated] = await db
      .update(users)
      .set(validated)
      .where(eq(users.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('User not found')

    const data = userResponseDto.parse(updated)

    logger.info('User updated successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}

export async function deleteUser(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'users:delete'

  try {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning()

    if (!deleted) throw ApiError.notFound('User not found')

    logger.info('User deleted successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}
