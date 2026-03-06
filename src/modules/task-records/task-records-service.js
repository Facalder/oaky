'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { taskRecords } from '@/drizzle/schemas/task-records-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createTaskRecordRequestDto,
  taskRecordListResponseDto,
  taskRecordResponseDto,
  updateTaskRecordRequestDto,
} from './task-records-dto'

export async function getAllTaskRecords() {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(taskRecords)
    const data = taskRecordListResponseDto.parse(rows)

    logger.info({
      action: 'taskRecords:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'taskRecords:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch task records')
  }
}

export async function getTaskRecordsById(id) {
  const startTime = Date.now()

  try {
    const rows = await db
      .select()
      .from(taskRecords)
      .where(eq(taskRecords.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) {
      throw ApiError.notFound('Task record not found')
    }

    const data = taskRecordResponseDto.parse(row)

    logger.info({
      action: 'taskRecords:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'taskRecords:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch task record')
  }
}

export async function createTaskRecord(payload) {
  const startTime = Date.now()

  try {
    const validated = createTaskRecordRequestDto.parse(payload)

    // TODO: attach userId and taskId from authenticated context when auth is ready
    const [created] = await db.insert(taskRecords).values(validated).returning()
    const data = taskRecordResponseDto.parse(created)

    logger.info({
      action: 'taskRecords:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'taskRecords:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create task record')
  }
}

export async function updateTaskRecord(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateTaskRecordRequestDto.parse(payload)

    const [updated] = await db
      .update(taskRecords)
      .set(validated)
      .where(eq(taskRecords.id, id))
      .returning()

    if (!updated) {
      throw ApiError.notFound('Task record not found')
    }

    const data = taskRecordResponseDto.parse(updated)

    logger.info({
      action: 'taskRecords:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'taskRecords:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update task record')
  }
}

export async function deleteTaskRecord(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(taskRecords)
      .where(eq(taskRecords.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Task record not found')
    }

    logger.info({
      action: 'taskRecords:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'taskRecords:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete task record')
  }
}
