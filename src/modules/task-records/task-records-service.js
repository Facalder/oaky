'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { taskRecords } from '@/drizzle/schemas/task-records-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createTaskRecordRequestDto,
  taskRecordListResponseDto,
  taskRecordResponseDto,
  updateTaskRecordRequestDto,
} from './task-records-dto'

export async function getAllTaskRecords(urlEndpoint) {
  const startTime = Date.now()

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(taskRecords)
    const data = taskRecordListResponseDto.parse(rows)

    logger.info('Task records fetched successfully', {
      action: 'taskRecords:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch task records', {
      action: 'taskRecords:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch task records')
  }
}

export async function getTaskRecordsById(id, urlEndpoint) {
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

    logger.info('Task record fetched successfully', {
      action: 'taskRecords:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch task record', {
      action: 'taskRecords:getById',
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
      : ApiError.server('Failed to fetch task record')
  }
}

export async function createTaskRecord(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createTaskRecordRequestDto.parse(payload)

    // TODO: attach userId and taskId from authenticated context when auth is ready
    const [created] = await db.insert(taskRecords).values(validated).returning()
    const data = taskRecordResponseDto.parse(created)

    logger.info('Task record created successfully', {
      action: 'taskRecords:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create task record', {
      action: 'taskRecords:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create task record')
  }
}

export async function updateTaskRecord(id, payload, urlEndpoint) {
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

    logger.info('Task record updated successfully', {
      action: 'taskRecords:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update task record', {
      action: 'taskRecords:update',
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
      : ApiError.server('Failed to update task record')
  }
}

export async function deleteTaskRecord(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db
      .delete(taskRecords)
      .where(eq(taskRecords.id, id))
      .returning()

    if (!deleted) {
      throw ApiError.notFound('Task record not found')
    }

    logger.info('Task record deleted successfully', {
      action: 'taskRecords:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete task record', {
      action: 'taskRecords:delete',
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
      : ApiError.server('Failed to delete task record')
  }
}
