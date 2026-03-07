'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { users } from '@/drizzle/schemas/users-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createUserRequestDto,
  updateUserRequestDto,
  userListResponseDto,
  userResponseDto,
} from './users-dto'

export async function getAllUsers(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(users)
    const data = userListResponseDto.parse(rows)

    logger.info('Users fetched successfully', {
      action: 'users:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch users', {
      action: 'users:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch users')
  }
}

export async function getUsersById(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('User not found')
    }

    const data = userResponseDto.parse(row)

    logger.info('User fetched successfully', {
      action: 'users:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch user', {
      action: 'users:getById',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch user')
  }
}

export async function createUser(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createUserRequestDto.parse(payload)

    // TODO: hash password before storing when auth is ready
    const [created] = await db.insert(users).values(validated).returning()
    const data = userResponseDto.parse(created)

    logger.info('User created successfully', {
      action: 'users:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create user', {
      action: 'users:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create user')
  }
}

export async function updateUser(id, payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = updateUserRequestDto.parse(payload)

    const [updated] = await db
      .update(users)
      .set(validated)
      .where(eq(users.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('User not found')
    }

    const data = userResponseDto.parse(updated)

    logger.info('User updated successfully', {
      action: 'users:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update user', {
      action: 'users:update',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update user')
  }
}

export async function deleteUser(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning()

    if (!deleted) {
      throw ApiError.notFound('User not found')
    }

    logger.info('User deleted successfully', {
      action: 'users:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete user', {
      action: 'users:delete',
      endpoint: urlEndpoint,
      id,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete user')
  }
}
