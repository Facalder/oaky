'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { timerSessions } from '@/drizzle/schemas/timer-sessions-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createTimerSessionRequestDto,
  timerSessionListResponseDto,
  timerSessionResponseDto,
  updateTimerSessionRequestDto,
} from './timer-sessions-dto'

export async function getAllTimerSessions(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(timerSessions)
    const data = timerSessionListResponseDto.parse(rows)

    logger.info('Timer sessions fetched successfully', {
      action: 'timerSessions:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch timer sessions', {
      action: 'timerSessions:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch timer sessions')
  }
}

export async function getTimerSessionsById(id, urlEndpoint) {
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

    logger.info('Timer session fetched successfully', {
      action: 'timerSessions:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch timer session', {
      action: 'timerSessions:getById',
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
      : ApiError.server('Failed to fetch timer session')
  }
}

export async function createTimerSession(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createTimerSessionRequestDto.parse(payload)

    // TODO: attach userId (and maybe taskId) from authenticated context when auth is ready
    const [created] = await db
      .insert(timerSessions)
      .values(validated)
      .returning()
    const data = timerSessionResponseDto.parse(created)

    logger.info('Timer session created successfully', {
      action: 'timerSessions:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create timer session', {
      action: 'timerSessions:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create timer session')
  }
}

export async function updateTimerSession(id, payload, urlEndpoint) {
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

    logger.info('Timer session updated successfully', {
      action: 'timerSessions:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update timer session', {
      action: 'timerSessions:update',
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
      : ApiError.server('Failed to update timer session')
  }
}

export async function deleteTimerSession(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(timerSessions)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Timer session not found')
    }

    logger.info('Timer session deleted successfully', {
      action: 'timerSessions:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete timer session', {
      action: 'timerSessions:delete',
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
      : ApiError.server('Failed to delete timer session')
  }
}

/**
 * stopTimerSession — hentikan sesi timer yang sedang berjalan.
 *
 * Flow:
 *   1. Route POST /api/timer-sessions → createTimerSession (endTime = null)
 *   2. Route PATCH /api/timer-sessions/:id/stop → stopTimerSession
 *      - Set endTime + durationSec
 *      - TODO: setelah stop, trigger upsertTaskRecord + upsertDailyRecord
 */
export async function stopTimerSession(id, payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    // Hanya izinkan field yang relevan saat stop
    const validated = updateTimerSessionRequestDto
      .pick({ endTime: true, durationSec: true, pausedDurationSec: true })
      .parse(payload)

    const [updated] = await db
      .update(timerSessions)
      .set(validated)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Timer session not found')
    }

    const data = timerSessionResponseDto.parse(updated)

    // TODO: setelah stop, panggil upsertTaskRecord dan upsertDailyRecord
    //       untuk menyinkronkan taskRecords.totalSec dan dailyStatistics

    logger.info('Timer session stopped successfully', {
      action: 'timerSessions:stop',
      endpoint: urlEndpoint,
      id,
      durationSec: data.durationSec,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to stop timer session', {
      action: 'timerSessions:stop',
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
      : ApiError.server('Failed to stop timer session')
  }
}
