'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { taskRecords } from '@/drizzle/schemas/task-records-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import { handleError } from '@/shared/utils/handle-error'
import {
  createTaskRecordRequestDto,
  taskRecordListResponseDto,
  taskRecordResponseDto,
  updateTaskRecordRequestDto,
} from './task-records-dto'

export async function getAllTaskRecords(urlEndpoint) {
  const startTime = Date.now()
  const action = 'taskRecords:getAll'

  try {
    // TODO: filter by authenticated user when auth is ready
    const rows = await db.select().from(taskRecords)
    const data = taskRecordListResponseDto.parse(rows)

    logger.info('Task records fetched successfully', {
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

export async function getTaskRecordById(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'taskRecords:getById'

  try {
    const rows = await db
      .select()
      .from(taskRecords)
      .where(eq(taskRecords.id, id))
      .limit(1)

    const row = rows[0]

    if (!row) throw ApiError.notFound('Task record not found')

    const data = taskRecordResponseDto.parse(row)

    logger.info('Task record fetched successfully', {
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

export async function createTaskRecord(payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'taskRecords:create'

  try {
    const validated = createTaskRecordRequestDto.parse(payload)

    // TODO: attach userId and taskId from authenticated context when auth is ready
    const [created] = await db.insert(taskRecords).values(validated).returning()
    const data = taskRecordResponseDto.parse(created)

    logger.info('Task record created successfully', {
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

export async function updateTaskRecord(id, payload, urlEndpoint) {
  const startTime = Date.now()
  const action = 'taskRecords:update'

  try {
    const validated = updateTaskRecordRequestDto.parse(payload)

    const [updated] = await db
      .update(taskRecords)
      .set(validated)
      .where(eq(taskRecords.id, id))
      .returning()

    if (!updated) throw ApiError.notFound('Task record not found')

    const data = taskRecordResponseDto.parse(updated)

    logger.info('Task record updated successfully', {
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

export async function deleteTaskRecord(id, urlEndpoint) {
  const startTime = Date.now()
  const action = 'taskRecords:delete'

  try {
    const [deleted] = await db
      .delete(taskRecords)
      .where(eq(taskRecords.id, id))
      .returning()

    if (!deleted) throw ApiError.notFound('Task record not found')

    logger.info('Task record deleted successfully', {
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
