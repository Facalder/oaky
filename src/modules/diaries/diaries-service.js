'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { diaries } from '@/drizzle/schemas/diaries-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  createDiaryRequestDto,
  diaryListResponseDto,
  diaryResponseDto,
  updateDiaryRequestDto,
} from './diaries-dto'

export async function getAllDiaries(urlEndpoint) {
  const startTime = Date.now()
  const action = 'diaries:getAll'

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(diaries)
    const data = diaryListResponseDto.parse(rows)

    logger.info('Diaries fetched successfully', {
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

export async function getDiaryById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'diaries:getById'

  try {
    const rows = await db
      .select()
      .from(diaries)
      .where(eq(diaries.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) throw ApiError.notFound('Diary not found')

    const data = diaryResponseDto.parse(row)

    logger.info('Diary fetched successfully', {
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

export async function createDiary(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'diaries:create'

  try {
    const validated = createDiaryRequestDto.parse(payload)

    // TODO: attach userId from authenticated user when auth is ready
    const [created] = await db.insert(diaries).values(validated).returning()
    const data = diaryResponseDto.parse(created)

    logger.info('Diary created successfully', {
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

export async function updateDiary(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'diaries:update'

  try {
    const validated = updateDiaryRequestDto.parse(payload)

    const [updated] = await db
      .update(diaries)
      .set(validated)
      .where(eq(diaries.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Diary not found')

    const data = diaryResponseDto.parse(updated)

    logger.info('Diary updated successfully', {
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

export async function deleteDiary(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'diaries:delete'

  try {
    const [deleted] = await db
      .delete(diaries)
      .where(eq(diaries.id, id))
      .returning()

    if (!deleted) throw ApiError.notFound('Diary not found')

    logger.info('Diary deleted successfully', {
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
