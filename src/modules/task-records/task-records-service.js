'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { taskRecords } from '@/drizzle/schemas/task-records-schema'
import { STATUS_CODES } from '@/shared/constants/status-code'
import { ApiResponse } from '@/shared/utils/api-response'
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

    return ApiResponse.ok('Task records fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'taskRecords:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch task records')
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
      return ApiResponse.error('Task record not found', STATUS_CODES.NOT_FOUND)
    }

    const data = taskRecordResponseDto.parse(row)

    logger.info({
      action: 'taskRecords:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task record fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'taskRecords:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch task record')
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

    return ApiResponse.created('Task record created successfully', data)
  } catch (error) {
    logger.error({
      action: 'taskRecords:create',
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

    return ApiResponse.error('Failed to create task record')
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
      return ApiResponse.error('Task record not found', STATUS_CODES.NOT_FOUND)
    }

    const data = taskRecordResponseDto.parse(updated)

    logger.info({
      action: 'taskRecords:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task record updated successfully', data)
  } catch (error) {
    logger.error({
      action: 'taskRecords:update',
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

    return ApiResponse.error('Failed to update task record')
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
      return ApiResponse.error('Task record not found', STATUS_CODES.NOT_FOUND)
    }

    logger.info({
      action: 'taskRecords:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task record deleted successfully')
  } catch (error) {
    logger.error({
      action: 'taskRecords:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to delete task record')
  }
}
