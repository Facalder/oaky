'use server'

import { eq } from 'drizzle-orm'
import db from '@/db/db'
import { tasks } from '@/drizzle/schemas/tasks-schema'
import { ApiError } from '@/shared/errors/api-error'
import { logger } from '@/shared/utils/logger'
import {
  createTaskRequestDto,
  taskListResponseDto,
  taskResponseDto,
  updateTaskRequestDto,
} from './tasks-dto'

export async function getAllTasks(urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks)
    const data = taskListResponseDto.parse(rows)

    logger.info('Tasks fetched successfully', {
      action: 'tasks:getAll',
      endpoint: urlEndpoint,
      count: rows.length,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch tasks', {
      action: 'tasks:getAll',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to fetch tasks')
  }
}

export async function getTasksById(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
    const task = rows[0]

    if (!task) {
      throw ApiError.notFound('Task not found')
    }

    const data = taskResponseDto.parse(task)

    logger.info('Task fetched successfully', {
      action: 'tasks:getById',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to fetch task', {
      action: 'tasks:getById',
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
      : ApiError.server('Failed to fetch task')
  }
}

export async function createTask(payload, urlEndpoint) {
  const startTime = Date.now()

  try {
    const validated = createTaskRequestDto.parse(payload)

    const [created] = await db.insert(tasks).values(validated).returning()
    const data = taskResponseDto.parse(created)

    logger.info('Task created successfully', {
      action: 'tasks:create',
      endpoint: urlEndpoint,
      id: data.id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to create task', {
      action: 'tasks:create',
      endpoint: urlEndpoint,
      errorName: error?.name,
      errorMessage: error?.message,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    if (error?.name === 'ApiError') throw error

    throw error?.name === 'ZodError'
      ? ApiError.validation('Validation failed', error.errors)
      : ApiError.server('Failed to create task')
  }
}

export async function updateTask(id, payload, urlEndpoint) {
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

    logger.info('Task updated successfully', {
      action: 'tasks:update',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to update task', {
      action: 'tasks:update',
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
      : ApiError.server('Failed to update task')
  }
}

export async function deleteTask(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const [deleted] = await db.delete(tasks).where(eq(tasks.id, id)).returning()

    if (!deleted) {
      throw ApiError.notFound('Task not found')
    }

    logger.info('Task deleted successfully', {
      action: 'tasks:delete',
      endpoint: urlEndpoint,
      id,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return deleted
  } catch (error) {
    logger.error('Failed to delete task', {
      action: 'tasks:delete',
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
      : ApiError.server('Failed to delete task')
  }
}
