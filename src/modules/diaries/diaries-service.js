'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { diaries } from '@/drizzle/schemas/diaries-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createDiaryRequestDto,
  diaryListResponseDto,
  diaryResponseDto,
  updateDiaryRequestDto,
} from './diaries-dto'

export async function getAllDiaries() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(diaries)
    const data = diaryListResponseDto.parse(rows)

    logger.info({
      action: 'diaries:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'diaries:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch diaries')
  }
}

export async function getDiariesById(id) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(diaries)
      .where(eq(diaries.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Diary not found')
    }

    const data = diaryResponseDto.parse(row)

    logger.info({
      action: 'diaries:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'diaries:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch diary')
  }
}

export async function createDiary(payload) {
  const startTime = Date.now()

  try {
    const validated = createDiaryRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(diaries).values(validated).returning()
    const data = diaryResponseDto.parse(created)

    logger.info({
      action: 'diaries:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'diaries:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create diary')
  }
}

export async function updateDiary(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateDiaryRequestDto.parse(payload)

    const [updated] = await db
      .update(diaries)
      .set(validated)
      .where(eq(diaries.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Diary not found')
    }

    const data = diaryResponseDto.parse(updated)

    logger.info({
      action: 'diaries:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'diaries:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update diary')
  }
}

export async function deleteDiary(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(diaries)
      .where(eq(diaries.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Diary not found')
    }

    logger.info({
      action: 'diaries:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'diaries:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete diary')
  }
}
