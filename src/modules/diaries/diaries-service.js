'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { diaries } from '@/drizzle/schemas/diaries-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createDiaryRequestDto,
  diaryListResponseDto,
  diaryResponseDto,
  updateDiaryRequestDto,
} from './diaries-dto'

export async function getAllDiaries(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(diaries)
    const data = diaryListResponseDto.parse(rows)

    logger.info('Diaries fetched successfully', {
      action: 'diaries:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch diaries', {
      action: 'diaries:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch diaries')
  }
}

export async function getDiariesById(id, urlEndpoint) {
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

    logger.info('Diary fetched successfully', {
      action: 'diaries:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch diary', {
      action: 'diaries:getById',
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
      : ApiError.server('Failed to fetch diary')
  }
}

export async function createDiary(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createDiaryRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(diaries).values(validated).returning()
    const data = diaryResponseDto.parse(created)

    logger.info('Diary created successfully', {
      action: 'diaries:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create diary', {
      action: 'diaries:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create diary')
  }
}

export async function updateDiary(id, payload, urlEndpoint) {
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

    logger.info('Diary updated successfully', {
      action: 'diaries:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update diary', {
      action: 'diaries:update',
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
      : ApiError.server('Failed to update diary')
  }
}

export async function deleteDiary(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(diaries)
      .where(eq(diaries.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Diary not found')
    }

    logger.info('Diary deleted successfully', {
      action: 'diaries:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete diary', {
      action: 'diaries:delete',
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
      : ApiError.server('Failed to delete diary')
  }
}
