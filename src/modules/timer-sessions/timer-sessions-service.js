'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { timerSessions } from '@/drizzle/schemas/timer-sessions-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createTimerSessionRequestDto,
  timerSessionListResponseDto,
  timerSessionResponseDto,
  updateTimerSessionRequestDto,
} from './timer-sessions-dto'

export async function getAllTimerSessions() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(timerSessions)
    const data = timerSessionListResponseDto.parse(rows)

    logger.info({
      action: 'timerSessions:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'timerSessions:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch timer sessions')
  }
}

export async function getTimerSessionsById(id) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(timerSessions)
      .where(eq(timerSessions.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Timer session not found')
    }

    const data = timerSessionResponseDto.parse(row)

    logger.info({
      action: 'timerSessions:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'timerSessions:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch timer session')
  }
}

export async function createTimerSession(payload) {
  const startTime = Date.now()

  try {
    const validated = createTimerSessionRequestDto.parse(payload)

    // TODO: attach userId (and maybe taskId) from authenticated context when auth is ready
    const [created] = await db
      .insert(timerSessions)
      .values(validated)
      .returning()
    const data = timerSessionResponseDto.parse(created)

    logger.info({
      action: 'timerSessions:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'timerSessions:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create timer session')
  }
}

export async function updateTimerSession(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateTimerSessionRequestDto.parse(payload)

    const [updated] = await db
      .update(timerSessions)
      .set(validated)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Timer session not found')
    }

    const data = timerSessionResponseDto.parse(updated)

    logger.info({
      action: 'timerSessions:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'timerSessions:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update timer session')
  }
}

export async function deleteTimerSession(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(timerSessions)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Timer session not found')
    }

    logger.info({
      action: 'timerSessions:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'timerSessions:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete timer session')
  }
}
