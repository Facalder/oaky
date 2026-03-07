'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { timerSessions } from '@/drizzle/schemas/timer-sessions-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  createTimerSessionRequestDto,
  timerSessionListResponseDto,
  timerSessionResponseDto,
  updateTimerSessionRequestDto,
} from './timer-sessions-dto'

export async function getAllTimerSessions(urlEndpoint) {
  const startTime = Date.now()
  const action = 'timerSessions:getAll'

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(timerSessions)
    const data = timerSessionListResponseDto.parse(rows)

    logger.info('Timer sessions fetched successfully', {
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

export async function getTimerSessionById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'timerSessions:getById'

  try {
    const rows = await db
      .select()
      .from(timerSessions)
      .where(eq(timerSessions.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) throw ApiError.notFound('Timer session not found')

    const data = timerSessionResponseDto.parse(row)

    logger.info('Timer session fetched successfully', {
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

export async function createTimerSession(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'timerSessions:create'

  try {
    const validated = createTimerSessionRequestDto.parse(payload)

    // TODO: attach userId (and maybe taskId) from authenticated context when auth is ready
    const [created] = await db
      .insert(timerSessions)
      .values(validated)
      .returning()
    const data = timerSessionResponseDto.parse(created)

    logger.info('Timer session created successfully', {
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

export async function updateTimerSession(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'timerSessions:update'

  try {
    const validated = updateTimerSessionRequestDto.parse(payload)

    const [updated] = await db
      .update(timerSessions)
      .set(validated)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Timer session not found')

    const data = timerSessionResponseDto.parse(updated)

    logger.info('Timer session updated successfully', {
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

export async function deleteTimerSession(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'timerSessions:delete'

  try {
    const [deleted] = await db
      .delete(timerSessions)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!deleted) throw ApiError.notFound('Timer session not found')

    logger.info('Timer session deleted successfully', {
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
  const action = 'timerSessions:stop'

  try {
    const validated = updateTimerSessionRequestDto
      .pick({ endTime: true, durationSec: true, pausedDurationSec: true })
      .parse(payload)

    const [updated] = await db
      .update(timerSessions)
      .set(validated)
      .where(eq(timerSessions.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Timer session not found')

    const data = timerSessionResponseDto.parse(updated)

    // TODO: setelah stop, panggil upsertTaskRecord dan upsertDailyRecord
    //       untuk menyinkronkan taskRecords.totalSec dan dailyStatistics

    logger.info('Timer session stopped successfully', {
      action,
      endpoint: urlEndpoint,
      id,
      durationSec: data.durationSec,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    handleError(error, { action, endpoint: urlEndpoint, id, startTime })
  }
}
