'use server'

import { eq, and, gt } from 'drizzle-orm'
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

export async function getAllTasks(urlEndpoint, queryParams = {}) {
  const startTime = Date.now()

  try {
    const conditions = []

    if (queryParams.categoryId) {
      conditions.push(eq(tasks.categoryId, queryParams.categoryId))
    }

    if (queryParams.status) {
      conditions.push(eq(tasks.status, queryParams.status))
    }

    if (queryParams.isCompleted !== undefined) {
      conditions.push(eq(tasks.isCompleted, queryParams.isCompleted === 'true'))
    }

    if (queryParams.isUpcoming === 'true') {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`
      conditions.push(gt(tasks.endAt, currentTime))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const rows = await db.select().from(tasks).where(whereClause).orderBy(tasks.startAt)
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

    if (Object.keys(validated).length === 0) {
      throw ApiError.badRequest('No valid fields provided for update')
    }

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

export async function toggleTaskCompletion(id, urlEndpoint) {
  const startTime = Date.now()

  try {
    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1)
    const task = rows[0]

    if (!task) {
      throw ApiError.notFound('Task not found')
    }

    const newIsCompleted = !task.isCompleted

    const [updated] = await db
      .update(tasks)
      .set({ isCompleted: newIsCompleted })
      .where(eq(tasks.id, id))
      .returning()

    const data = taskResponseDto.parse(updated)

    logger.info('Task completion toggled successfully', {
      action: 'tasks:toggleCompletion',
      endpoint: urlEndpoint,
      id,
      isCompleted: newIsCompleted,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    })

    return data
  } catch (error) {
    logger.error('Failed to toggle task completion', {
      action: 'tasks:toggleCompletion',
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
      : ApiError.server('Failed to toggle task completion')
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
