'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { dailyStatistics } from '@/drizzle/schemas/daily-statistics-schema.js'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createDailyStatisticRequestDto,
  dailyStatisticListResponseDto,
  dailyStatisticResponseDto,
  updateDailyStatisticRequestDto,
} from './daily-statistics-dto'

export async function getAllDailyStatistics() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(dailyStatistics)
    const data = dailyStatisticListResponseDto.parse(rows)

    logger.info({
      action: 'dailyStatistics:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch daily statistics')
  }
}

export async function getDailyStatisticsById(id) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(dailyStatistics)
      .where(eq(dailyStatistics.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Daily statistic not found')
    }

    const data = dailyStatisticResponseDto.parse(row)

    logger.info({
      action: 'dailyStatistics:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch daily statistic')
  }
}

export async function createDailyStatistic(payload) {
  const startTime = Date.now()

  try {
    const validated = createDailyStatisticRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db
      .insert(dailyStatistics)
      .values(validated)
      .returning()
    const data = dailyStatisticResponseDto.parse(created)

    logger.info({
      action: 'dailyStatistics:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create daily statistic')
  }
}

export async function updateDailyStatistic(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateDailyStatisticRequestDto.parse(payload)

    const [updated] = await db
      .update(dailyStatistics)
      .set(validated)
      .where(eq(dailyStatistics.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Daily statistic not found')
    }

    const data = dailyStatisticResponseDto.parse(updated)

    logger.info({
      action: 'dailyStatistics:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update daily statistic')
  }
}

export async function deleteDailyStatistic(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(dailyStatistics)
      .where(eq(dailyStatistics.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Daily statistic not found')
    }

    logger.info({
      action: 'dailyStatistics:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete daily statistic')
  }
}
