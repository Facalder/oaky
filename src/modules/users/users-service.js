'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { users } from '@/drizzle/schemas/users-schema'
import { STATUS_CODES } from '@/shared/constants/status-code'
import { ApiResponse } from '@/shared/utils/api-response'
import { logger } from '@/shared/utils/logger'
import {
  createUserRequestDto,
  updateUserRequestDto,
  userListResponseDto,
  userResponseDto,
} from './users-dto'

export async function getAllUsers() {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(users)
    const data = userListResponseDto.parse(rows)

    logger.info({
      action: 'users:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Users fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'users:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch users')
  }
}

export async function getUsersById(id) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
    const row = rows[0]

    if (!row) {
      return ApiResponse.error('User not found', STATUS_CODES.NOT_FOUND)
    }

    const data = userResponseDto.parse(row)

    logger.info({
      action: 'users:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('User fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'users:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch user')
  }
}

export async function createUser(payload) {
  const startTime = Date.now()

  try {
    const validated = createUserRequestDto.parse(payload)

    const [created] = await db.insert(users).values(validated).returning()
    const data = userResponseDto.parse(created)

    logger.info({
      action: 'users:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.created('User created successfully', data)
  } catch (error) {
    logger.error({
      action: 'users:create',
      error,
      durationMs: Date.now() - startTime,
    })

    if (error?.name === 'ZodError') {
      return ApiResponse.error(
        'Validation failed',
        STATUS_CODES.BAD_REQUEST,
        error.errors,
      )
    }

    return ApiResponse.error('Failed to create user')
  }
}

export async function updateUser(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateUserRequestDto.parse(payload)

    const [updated] = await db
      .update(users)
      .set(validated)
      .where(eq(users.id, id))
      .returning()

    if (!updated) {
      return ApiResponse.error('User not found', STATUS_CODES.NOT_FOUND)
    }

    const data = userResponseDto.parse(updated)

    logger.info({
      action: 'users:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('User updated successfully', data)
  } catch (error) {
    logger.error({
      action: 'users:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })

    if (error?.name === 'ZodError') {
      return ApiResponse.error(
        'Validation failed',
        STATUS_CODES.BAD_REQUEST,
        error.errors,
      )
    }

    return ApiResponse.error('Failed to update user')
  }
}

export async function deleteUser(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning()

    if (!deleted) {
      return ApiResponse.error('User not found', STATUS_CODES.NOT_FOUND)
    }

    logger.info({
      action: 'users:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('User deleted successfully')
  } catch (error) {
    logger.error({
      action: 'users:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to delete user')
  }
}
