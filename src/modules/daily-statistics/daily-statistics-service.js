'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { dailyStatistics } from '@/drizzle/schemas/daily-statistics-schema.js'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createDailyStatisticRequestDto,
  dailyStatisticListResponseDto,
  dailyStatisticResponseDto,
  updateDailyStatisticRequestDto,
} from './daily-statistics-dto'

export async function getAllDailyStatistics(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(dailyStatistics)
    const data = dailyStatisticListResponseDto.parse(rows)

    logger.info('Daily statistics fetched successfully', {
      action: 'dailyStatistics:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch daily statistics', {
      action: 'dailyStatistics:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch daily statistics')
  }
}

export async function getDailyStatisticsById(id, urlEndpoint) {
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

    logger.info('Daily statistic fetched successfully', {
      action: 'dailyStatistics:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch daily statistic', {
      action: 'dailyStatistics:getById',
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
      : ApiError.server('Failed to fetch daily statistic')
  }
}

export async function createDailyStatistic(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createDailyStatisticRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db
      .insert(dailyStatistics)
      .values(validated)
      .returning()
    const data = dailyStatisticResponseDto.parse(created)

    logger.info('Daily statistic created successfully', {
      action: 'dailyStatistics:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create daily statistic', {
      action: 'dailyStatistics:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create daily statistic')
  }
}

export async function updateDailyStatistic(id, payload, urlEndpoint) {
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

    logger.info('Daily statistic updated successfully', {
      action: 'dailyStatistics:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update daily statistic', {
      action: 'dailyStatistics:update',
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
      : ApiError.server('Failed to update daily statistic')
  }
}

export async function deleteDailyStatistic(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(dailyStatistics)
      .where(eq(dailyStatistics.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Daily statistic not found')
    }

    logger.info('Daily statistic deleted successfully', {
      action: 'dailyStatistics:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete daily statistic', {
      action: 'dailyStatistics:delete',
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
      : ApiError.server('Failed to delete daily statistic')
  }
}
