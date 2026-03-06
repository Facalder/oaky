'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/drizzle'
import { tasks } from '@/drizzle/schemas/tasks-schema'
import { ApiError } from '@/shared/errors/api-error'
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

    return data
  } catch (error) {
    logger.error({
      action: 'tasks:getAll',
      error,
      durationMs: Date.now() - startTime,
    })
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch tasks')
  }
}

export async function getTasksById(id) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
    const task = rows[0]

    if (!task) {
      throw ApiError.notFound('Task not found')
    }

    const data = taskResponseDto.parse(task)

    logger.info({
      action: 'tasks:getById',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'tasks:getById',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch task')
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

    return data
  } catch (error) {
    logger.error({
      action: 'tasks:create',
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create task')
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
      throw ApiError.notFound('Task not found')
    }

    const data = taskResponseDto.parse(updated)

    logger.info({
      action: 'tasks:update',
      id,
      durationMs: Date.now() - startTime,
    })

    return data
  } catch (error) {
    logger.error({
      action: 'tasks:update',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to update task')
  }
}

export async function deleteTask(id) {
  const startTime = Date.now()

  try {
    const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning()

    if (!deleted) {
      throw ApiError.notFound('Task not found')
    }

    logger.info({
      action: 'tasks:delete',
      id,
      durationMs: Date.now() - startTime,
    })

    return deleted
  } catch (error) {
    logger.error({
      action: 'tasks:delete',
      id,
      error,
      durationMs: Date.now() - startTime,
    })
    if (error?.name === 'ApiError') throw error
    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to delete task')
  }
}
