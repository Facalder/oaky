'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { dailyStatistics } from '@/drizzle/schemas/daily-statistics.js'
import { STATUS_CODES } from '@/shared/constants/status-code'
import { ApiResponse } from '@/shared/utils/api-response'
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

    return ApiResponse.ok('Daily statistics fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch daily statistics')
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
      return ApiResponse.error(
        'Daily statistic not found',
        STATUS_CODES.NOT_FOUND,
      )
    }

    const data = dailyStatisticResponseDto.parse(row)

    logger.info({
      action: 'dailyStatistics:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Daily statistic fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch daily statistic')
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

    return ApiResponse.created('Daily statistic created successfully', data)
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:create',
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

    return ApiResponse.error('Failed to create daily statistic')
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
      return ApiResponse.error(
        'Daily statistic not found',
        STATUS_CODES.NOT_FOUND,
      )
    }

    const data = dailyStatisticResponseDto.parse(updated)

    logger.info({
      action: 'dailyStatistics:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Daily statistic updated successfully', data)
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:update',
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

    return ApiResponse.error('Failed to update daily statistic')
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
      return ApiResponse.error(
        'Daily statistic not found',
        STATUS_CODES.NOT_FOUND,
      )
    }

    logger.info({
      action: 'dailyStatistics:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Daily statistic deleted successfully')
  } catch (error) {
    logger.error({
      action: 'dailyStatistics:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to delete daily statistic')
  }
}
