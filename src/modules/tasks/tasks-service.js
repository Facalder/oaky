'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { tasks } from '@/drizzle/schemas/tasks-schema'
import { STATUS_CODES } from '@/shared/constants/status-code'
import { ApiResponse } from '@/shared/utils/api-response'
import { logger } from '@/shared/utils/logger'
import {
  createTaskRequestDto,
  taskListResponseDto,
  taskResponseDto,
  updateTaskRequestDto,
} from './tasks-dto'

export async function getAllTasks() {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks)
    const data = taskListResponseDto.parse(rows)

    logger.info({
      action: 'tasks:getAll',
      count: data.length,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Tasks fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'tasks:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch tasks')
  }
}

export async function getTasksById(id) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
    const task = rows[0]

    if (!task) {
      return ApiResponse.error('Task not found', STATUS_CODES.NOT_FOUND)
    }

    const data = taskResponseDto.parse(task)

    logger.info({
      action: 'tasks:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task fetched successfully', data)
  } catch (error) {
    logger.error({
      action: 'tasks:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to fetch task')
  }
}

export async function createTask(payload) {
  const startTime = Date.now()

  try {
    const validated = createTaskRequestDto.parse(payload)

    const [created] = await db.insert(tasks).values(validated).returning()
    const data = taskResponseDto.parse(created)

    logger.info({
      action: 'tasks:create',
      id: data.id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.created('Task created successfully', data)
  } catch (error) {
    logger.error({
      action: 'tasks:create',
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

    return ApiResponse.error('Failed to create task')
  }
}

export async function updateTask(id, payload) {
  const startTime = Date.now()

  try {
    const validated = updateTaskRequestDto.parse(payload)

    const [updated] = await db
      .update(tasks)
      .set(validated)
      .where(eq(tasks.id, id))
      .returning()

    if (!updated) {
      return ApiResponse.error('Task not found', STATUS_CODES.NOT_FOUND)
    }

    const data = taskResponseDto.parse(updated)

    logger.info({
      action: 'tasks:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task updated successfully', data)
  } catch (error) {
    logger.error({
      action: 'tasks:update',
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

    return ApiResponse.error('Failed to update task')
  }
}

export async function deleteTask(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning()

    if (!deleted) {
      return ApiResponse.error('Task not found', STATUS_CODES.NOT_FOUND)
    }

    logger.info({
      action: 'tasks:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return ApiResponse.ok('Task deleted successfully')
  } catch (error) {
    logger.error({
      action: 'tasks:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    return ApiResponse.error('Failed to delete task')
  }
}
